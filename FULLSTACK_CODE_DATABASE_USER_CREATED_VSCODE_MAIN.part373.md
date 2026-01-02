---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 373
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 373 of 552)

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

---[FILE: src/vs/workbench/contrib/comments/browser/commentNode.ts]---
Location: vscode-main/src/vs/workbench/contrib/comments/browser/commentNode.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import * as dom from '../../../../base/browser/dom.js';
import * as languages from '../../../../editor/common/languages.js';
import { ActionsOrientation, ActionBar } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { Action, IAction, Separator, ActionRunner } from '../../../../base/common/actions.js';
import { Disposable, DisposableStore, IReference, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { URI, UriComponents } from '../../../../base/common/uri.js';
import { IMarkdownRendererExtraOptions, IMarkdownRendererService } from '../../../../platform/markdown/browser/markdownRenderer.js';
import { IRenderedMarkdown } from '../../../../base/browser/markdownRenderer.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ICommentService } from './commentService.js';
import { LayoutableEditor, MIN_EDITOR_HEIGHT, SimpleCommentEditor, calculateEditorHeight } from './simpleCommentEditor.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { ToolBar } from '../../../../base/browser/ui/toolbar/toolbar.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { AnchorAlignment } from '../../../../base/browser/ui/contextview/contextview.js';
import { ToggleReactionsAction, ReactionAction, ReactionActionViewItem } from './reactionsAction.js';
import { ICommentThreadWidget } from '../common/commentThreadWidget.js';
import { MenuItemAction, SubmenuItemAction, IMenu, MenuId } from '../../../../platform/actions/common/actions.js';
import { MenuEntryActionViewItem, SubmenuEntryActionViewItem } from '../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { IContextKeyService, IContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { CommentFormActions } from './commentFormActions.js';
import { MOUSE_CURSOR_TEXT_CSS_CLASS_NAME } from '../../../../base/browser/ui/mouseCursor/mouseCursor.js';
import { ActionViewItem, IActionViewItemOptions } from '../../../../base/browser/ui/actionbar/actionViewItems.js';
import { DropdownMenuActionViewItem } from '../../../../base/browser/ui/dropdown/dropdownActionViewItem.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { MarshalledId } from '../../../../base/common/marshallingIds.js';
import { TimestampWidget } from './timestamp.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IMarkdownString } from '../../../../base/common/htmlContent.js';
import { IRange } from '../../../../editor/common/core/range.js';
import { ICellRange } from '../../notebook/common/notebookRange.js';
import { CommentMenus } from './commentMenus.js';
import { Scrollable, ScrollbarVisibility } from '../../../../base/common/scrollable.js';
import { SmoothScrollableElement } from '../../../../base/browser/ui/scrollbar/scrollableElement.js';
import { DomEmitter } from '../../../../base/browser/event.js';
import { CommentContextKeys } from '../common/commentContextKeys.js';
import { FileAccess, Schemas } from '../../../../base/common/network.js';
import { COMMENTS_SECTION, ICommentsConfiguration } from '../common/commentsConfiguration.js';
import { StandardMouseEvent } from '../../../../base/browser/mouseEvent.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { MarshalledCommentThread } from '../../../common/comments.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { IResolvedTextEditorModel, ITextModelService } from '../../../../editor/common/services/resolverService.js';
import { Position } from '../../../../editor/common/core/position.js';

class CommentsActionRunner extends ActionRunner {
	protected override async runAction(action: IAction, context: unknown[]): Promise<void> {
		await action.run(...context);
	}
}

export class CommentNode<T extends IRange | ICellRange> extends Disposable {
	private _domNode: HTMLElement;
	private _body: HTMLElement;
	private _avatar: HTMLElement;
	private readonly _md: MutableDisposable<IRenderedMarkdown> = this._register(new MutableDisposable());
	private _plainText: HTMLElement | undefined;
	private _clearTimeout: Timeout | null;

	private _editAction: Action | null = null;
	private _commentEditContainer: HTMLElement | null = null;
	private _commentDetailsContainer: HTMLElement;
	private _actionsToolbarContainer!: HTMLElement;
	private readonly _reactionsActionBar: MutableDisposable<ActionBar> = this._register(new MutableDisposable());
	private readonly _reactionActions: DisposableStore = this._register(new DisposableStore());
	private _reactionActionsContainer?: HTMLElement;
	private _commentEditor: SimpleCommentEditor | null = null;
	private _commentEditorModel: IReference<IResolvedTextEditorModel> | null = null;
	private _editorHeight = MIN_EDITOR_HEIGHT;

	private _isPendingLabel!: HTMLElement;
	private _timestamp: HTMLElement | undefined;
	private _timestampWidget: TimestampWidget | undefined;
	private _contextKeyService: IContextKeyService;
	private _commentContextValue: IContextKey<string>;
	private _commentMenus: CommentMenus;

	private _scrollable!: Scrollable;
	private _scrollableElement!: SmoothScrollableElement;

	private readonly _actionRunner: CommentsActionRunner = this._register(new CommentsActionRunner());
	private readonly toolbar: MutableDisposable<ToolBar> = this._register(new MutableDisposable());
	private _commentFormActions: CommentFormActions | null = null;
	private _commentEditorActions: CommentFormActions | null = null;

	private readonly _onDidClick = new Emitter<CommentNode<T>>();

	public get domNode(): HTMLElement {
		return this._domNode;
	}

	public isEditing: boolean = false;

	constructor(
		private readonly parentEditor: LayoutableEditor,
		private commentThread: languages.CommentThread<T>,
		public comment: languages.Comment,
		private pendingEdit: languages.PendingComment | undefined,
		private owner: string,
		private resource: URI,
		private parentThread: ICommentThreadWidget,
		private readonly markdownRendererOptions: IMarkdownRendererExtraOptions,
		@IInstantiationService private instantiationService: IInstantiationService,
		@ICommentService private commentService: ICommentService,
		@INotificationService private notificationService: INotificationService,
		@IContextMenuService private contextMenuService: IContextMenuService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IConfigurationService private configurationService: IConfigurationService,
		@IHoverService private hoverService: IHoverService,
		@IKeybindingService private keybindingService: IKeybindingService,
		@ITextModelService private readonly textModelService: ITextModelService,
		@IMarkdownRendererService private readonly markdownRendererService: IMarkdownRendererService,
	) {
		super();

		this._domNode = dom.$('div.review-comment');
		this._contextKeyService = this._register(contextKeyService.createScoped(this._domNode));
		this._commentContextValue = CommentContextKeys.commentContext.bindTo(this._contextKeyService);
		if (this.comment.contextValue) {
			this._commentContextValue.set(this.comment.contextValue);
		}
		this._commentMenus = this.commentService.getCommentMenus(this.owner);

		this._domNode.tabIndex = -1;
		this._avatar = dom.append(this._domNode, dom.$('div.avatar-container'));
		this.updateCommentUserIcon(this.comment.userIconPath);

		this._commentDetailsContainer = dom.append(this._domNode, dom.$('.review-comment-contents'));

		this.createHeader(this._commentDetailsContainer);
		this._body = document.createElement(`div`);
		this._body.classList.add('comment-body', MOUSE_CURSOR_TEXT_CSS_CLASS_NAME);
		if (configurationService.getValue<ICommentsConfiguration | undefined>(COMMENTS_SECTION)?.maxHeight !== false) {
			this._body.classList.add('comment-body-max-height');
		}

		this.createScroll(this._commentDetailsContainer, this._body);
		this.updateCommentBody(this.comment.body);

		this.createReactionsContainer(this._commentDetailsContainer);

		this._domNode.setAttribute('aria-label', `${comment.userName}, ${this.commentBodyValue}`);
		this._domNode.setAttribute('role', 'treeitem');
		this._clearTimeout = null;

		this._register(dom.addDisposableListener(this._domNode, dom.EventType.CLICK, () => this.isEditing || this._onDidClick.fire(this)));
		this._register(dom.addDisposableListener(this._domNode, dom.EventType.CONTEXT_MENU, e => {
			return this.onContextMenu(e);
		}));

		if (pendingEdit) {
			this.switchToEditMode();
		}

		this.activeCommentListeners();
	}

	private activeCommentListeners() {
		this._register(dom.addDisposableListener(this._domNode, dom.EventType.FOCUS_IN, () => {
			this.commentService.setActiveCommentAndThread(this.owner, { thread: this.commentThread, comment: this.comment });
		}, true));
	}

	private createScroll(container: HTMLElement, body: HTMLElement) {
		this._scrollable = this._register(new Scrollable({
			forceIntegerValues: true,
			smoothScrollDuration: 125,
			scheduleAtNextAnimationFrame: cb => dom.scheduleAtNextAnimationFrame(dom.getWindow(container), cb)
		}));
		this._scrollableElement = this._register(new SmoothScrollableElement(body, {
			horizontal: ScrollbarVisibility.Visible,
			vertical: ScrollbarVisibility.Visible
		}, this._scrollable));

		this._register(this._scrollableElement.onScroll(e => {
			if (e.scrollLeftChanged) {
				body.scrollLeft = e.scrollLeft;
			}
			if (e.scrollTopChanged) {
				body.scrollTop = e.scrollTop;
			}
		}));

		const onDidScrollViewContainer = this._register(new DomEmitter(body, 'scroll')).event;
		this._register(onDidScrollViewContainer(_ => {
			const position = this._scrollableElement.getScrollPosition();
			const scrollLeft = Math.abs(body.scrollLeft - position.scrollLeft) <= 1 ? undefined : body.scrollLeft;
			const scrollTop = Math.abs(body.scrollTop - position.scrollTop) <= 1 ? undefined : body.scrollTop;

			if (scrollLeft !== undefined || scrollTop !== undefined) {
				this._scrollableElement.setScrollPosition({ scrollLeft, scrollTop });
			}
		}));

		container.appendChild(this._scrollableElement.getDomNode());
	}

	private updateCommentBody(body: string | IMarkdownString) {
		this._body.innerText = '';
		this._md.clear();
		this._plainText = undefined;
		if (typeof body === 'string') {
			this._plainText = dom.append(this._body, dom.$('.comment-body-plainstring'));
			this._plainText.innerText = body;
		} else {
			this._md.value = this.markdownRendererService.render(body, this.markdownRendererOptions);
			this._body.appendChild(this._md.value.element);
		}
	}

	private updateCommentUserIcon(userIconPath: UriComponents | undefined) {
		this._avatar.textContent = '';
		if (userIconPath) {
			const img = dom.append(this._avatar, dom.$('img.avatar')) as HTMLImageElement;
			img.src = FileAccess.uriToBrowserUri(URI.revive(userIconPath)).toString(true);
			img.onerror = _ => img.remove();
		}
	}

	public get onDidClick(): Event<CommentNode<T>> {
		return this._onDidClick.event;
	}

	private createTimestamp(container: HTMLElement) {
		this._timestamp = dom.append(container, dom.$('span.timestamp-container'));
		this.updateTimestamp(this.comment.timestamp);
	}

	private updateTimestamp(raw?: string) {
		if (!this._timestamp) {
			return;
		}

		const timestamp = raw !== undefined ? new Date(raw) : undefined;
		if (!timestamp) {
			this._timestampWidget?.dispose();
		} else {
			if (!this._timestampWidget) {
				this._timestampWidget = new TimestampWidget(this.configurationService, this.hoverService, this._timestamp, timestamp);
				this._register(this._timestampWidget);
			} else {
				this._timestampWidget.setTimestamp(timestamp);
			}
		}
	}

	private createHeader(commentDetailsContainer: HTMLElement): void {
		const header = dom.append(commentDetailsContainer, dom.$(`div.comment-title.${MOUSE_CURSOR_TEXT_CSS_CLASS_NAME}`));
		const infoContainer = dom.append(header, dom.$('comment-header-info'));
		const author = dom.append(infoContainer, dom.$('strong.author'));
		author.innerText = this.comment.userName;
		this.createTimestamp(infoContainer);
		this._isPendingLabel = dom.append(infoContainer, dom.$('span.isPending'));

		if (this.comment.label) {
			this._isPendingLabel.innerText = this.comment.label;
		} else {
			this._isPendingLabel.innerText = '';
		}

		this._actionsToolbarContainer = dom.append(header, dom.$('.comment-actions'));
		this.createActionsToolbar();
	}

	private getToolbarActions(menu: IMenu): { primary: IAction[]; secondary: IAction[] } {
		const contributedActions = menu.getActions({ shouldForwardArgs: true });
		const primary: IAction[] = [];
		const secondary: IAction[] = [];
		const result = { primary, secondary };
		fillInActions(contributedActions, result, false, g => /^inline/.test(g));
		return result;
	}

	private get commentNodeContext(): [{ thread: languages.CommentThread<T>; commentUniqueId: number; $mid: MarshalledId.CommentNode }, MarshalledCommentThread] {
		return [{
			thread: this.commentThread,
			commentUniqueId: this.comment.uniqueIdInThread,
			$mid: MarshalledId.CommentNode
		},
		{
			commentControlHandle: this.commentThread.controllerHandle,
			commentThreadHandle: this.commentThread.commentThreadHandle,
			$mid: MarshalledId.CommentThread
		}];
	}

	private createToolbar() {
		this.toolbar.value = new ToolBar(this._actionsToolbarContainer, this.contextMenuService, {
			actionViewItemProvider: (action, options) => {
				if (action.id === ToggleReactionsAction.ID) {
					return new DropdownMenuActionViewItem(
						action,
						(<ToggleReactionsAction>action).menuActions,
						this.contextMenuService,
						{
							...options,
							actionViewItemProvider: (action, options) => this.actionViewItemProvider(action as Action, options),
							classNames: ['toolbar-toggle-pickReactions', ...ThemeIcon.asClassNameArray(Codicon.reactions)],
							anchorAlignmentProvider: () => AnchorAlignment.RIGHT
						}
					);
				}
				return this.actionViewItemProvider(action as Action, options);
			},
			orientation: ActionsOrientation.HORIZONTAL
		});

		this.toolbar.value.context = this.commentNodeContext;
		this.toolbar.value.actionRunner = this._actionRunner;
	}

	private createActionsToolbar() {
		const actions: IAction[] = [];

		const menu = this._commentMenus.getCommentTitleActions(this.comment, this._contextKeyService);
		this._register(menu);
		this._register(menu.onDidChange(e => {
			const { primary, secondary } = this.getToolbarActions(menu);
			if (!this.toolbar && (primary.length || secondary.length)) {
				this.createToolbar();
			}
			this.toolbar.value!.setActions(primary, secondary);
		}));

		const { primary, secondary } = this.getToolbarActions(menu);
		actions.push(...primary);

		if (actions.length || secondary.length) {
			this.createToolbar();
			this.toolbar.value!.setActions(actions, secondary);
		}
	}

	actionViewItemProvider(action: Action, options: IActionViewItemOptions) {
		if (action.id === ToggleReactionsAction.ID) {
			options = { label: false, icon: true };
		} else {
			options = { label: false, icon: true };
		}

		if (action.id === ReactionAction.ID) {
			const item = new ReactionActionViewItem(action);
			return item;
		} else if (action instanceof MenuItemAction) {
			return this.instantiationService.createInstance(MenuEntryActionViewItem, action, { hoverDelegate: options.hoverDelegate });
		} else if (action instanceof SubmenuItemAction) {
			return this.instantiationService.createInstance(SubmenuEntryActionViewItem, action, options);
		} else {
			const item = new ActionViewItem({}, action, options);
			return item;
		}
	}

	async submitComment(): Promise<void> {
		if (this._commentEditor && this._commentFormActions) {
			await this._commentFormActions.triggerDefaultAction();
			this.pendingEdit = undefined;
		}
	}

	private createReactionPicker(reactionGroup: languages.CommentReaction[]): ToggleReactionsAction {
		const toggleReactionAction = this._reactionActions.add(new ToggleReactionsAction(() => {
			toggleReactionActionViewItem?.show();
		}, nls.localize('commentToggleReaction', "Toggle Reaction")));

		let reactionMenuActions: Action[] = [];
		if (reactionGroup && reactionGroup.length) {
			reactionMenuActions = reactionGroup.map((reaction) => {
				return this._reactionActions.add(new Action(`reaction.command.${reaction.label}`, `${reaction.label}`, '', true, async () => {
					try {
						await this.commentService.toggleReaction(this.owner, this.resource, this.commentThread, this.comment, reaction);
					} catch (e) {
						const error = e.message
							? nls.localize('commentToggleReactionError', "Toggling the comment reaction failed: {0}.", e.message)
							: nls.localize('commentToggleReactionDefaultError', "Toggling the comment reaction failed");
						this.notificationService.error(error);
					}
				}));
			});
		}

		toggleReactionAction.menuActions = reactionMenuActions;

		const toggleReactionActionViewItem: DropdownMenuActionViewItem = this._reactionActions.add(new DropdownMenuActionViewItem(
			toggleReactionAction,
			(<ToggleReactionsAction>toggleReactionAction).menuActions,
			this.contextMenuService,
			{
				actionViewItemProvider: (action, options) => {
					if (action.id === ToggleReactionsAction.ID) {
						return toggleReactionActionViewItem;
					}
					return this.actionViewItemProvider(action as Action, options);
				},
				classNames: 'toolbar-toggle-pickReactions',
				anchorAlignmentProvider: () => AnchorAlignment.RIGHT
			}
		));

		return toggleReactionAction;
	}

	private createReactionsContainer(commentDetailsContainer: HTMLElement): void {
		this._reactionActionsContainer?.remove();
		this._reactionsActionBar.clear();
		this._reactionActions.clear();

		this._reactionActionsContainer = dom.append(commentDetailsContainer, dom.$('div.comment-reactions'));
		this._reactionsActionBar.value = new ActionBar(this._reactionActionsContainer, {
			actionViewItemProvider: (action, options) => {
				if (action.id === ToggleReactionsAction.ID) {
					return new DropdownMenuActionViewItem(
						action,
						(<ToggleReactionsAction>action).menuActions,
						this.contextMenuService,
						{
							actionViewItemProvider: (action, options) => this.actionViewItemProvider(action as Action, options),
							classNames: ['toolbar-toggle-pickReactions', ...ThemeIcon.asClassNameArray(Codicon.reactions)],
							anchorAlignmentProvider: () => AnchorAlignment.RIGHT
						}
					);
				}
				return this.actionViewItemProvider(action as Action, options);
			}
		});

		const hasReactionHandler = this.commentService.hasReactionHandler(this.owner);
		this.comment.commentReactions?.filter(reaction => !!reaction.count).map(reaction => {
			const action = this._reactionActions.add(new ReactionAction(`reaction.${reaction.label}`, `${reaction.label}`, reaction.hasReacted && (reaction.canEdit || hasReactionHandler) ? 'active' : '', (reaction.canEdit || hasReactionHandler), async () => {
				try {
					await this.commentService.toggleReaction(this.owner, this.resource, this.commentThread, this.comment, reaction);
				} catch (e) {
					let error: string;

					if (reaction.hasReacted) {
						error = e.message
							? nls.localize('commentDeleteReactionError', "Deleting the comment reaction failed: {0}.", e.message)
							: nls.localize('commentDeleteReactionDefaultError', "Deleting the comment reaction failed");
					} else {
						error = e.message
							? nls.localize('commentAddReactionError', "Deleting the comment reaction failed: {0}.", e.message)
							: nls.localize('commentAddReactionDefaultError', "Deleting the comment reaction failed");
					}
					this.notificationService.error(error);
				}
			}, reaction.reactors, reaction.iconPath, reaction.count));

			this._reactionsActionBar.value?.push(action, { label: true, icon: true });
		});

		if (hasReactionHandler) {
			const toggleReactionAction = this.createReactionPicker(this.comment.commentReactions || []);
			this._reactionsActionBar.value?.push(toggleReactionAction, { label: false, icon: true });
		}
	}

	get commentBodyValue(): string {
		return (typeof this.comment.body === 'string') ? this.comment.body : this.comment.body.value;
	}

	private async createCommentEditor(editContainer: HTMLElement): Promise<void> {
		this._editModeDisposables.clear();
		const container = dom.append(editContainer, dom.$('.edit-textarea'));
		this._commentEditor = this.instantiationService.createInstance(SimpleCommentEditor, container, SimpleCommentEditor.getEditorOptions(this.configurationService), this._contextKeyService, this.parentThread);
		this._editModeDisposables.add(this._commentEditor);

		const resource = URI.from({
			scheme: Schemas.commentsInput,
			path: `/commentinput-${this.comment.uniqueIdInThread}-${Date.now()}.md`
		});
		const modelRef = await this.textModelService.createModelReference(resource);
		this._commentEditorModel = modelRef;
		this._editModeDisposables.add(this._commentEditorModel);

		this._commentEditor.setModel(this._commentEditorModel.object.textEditorModel);
		this._commentEditor.setValue(this.pendingEdit?.body ?? this.commentBodyValue);
		if (this.pendingEdit) {
			this._commentEditor.setPosition(this.pendingEdit.cursor);
		} else {
			const lastLine = this._commentEditorModel.object.textEditorModel.getLineCount();
			const lastColumn = this._commentEditorModel.object.textEditorModel.getLineLength(lastLine) + 1;
			this._commentEditor.setPosition(new Position(lastLine, lastColumn));
		}
		this.pendingEdit = undefined;
		this._commentEditor.layout({ width: container.clientWidth - 14, height: this._editorHeight });
		this._commentEditor.focus();

		dom.scheduleAtNextAnimationFrame(dom.getWindow(editContainer), () => {
			this._commentEditor!.layout({ width: container.clientWidth - 14, height: this._editorHeight });
			this._commentEditor!.focus();
		});

		const commentThread = this.commentThread;
		commentThread.input = {
			uri: this._commentEditor.getModel()!.uri,
			value: this.commentBodyValue
		};
		this.commentService.setActiveEditingCommentThread(commentThread);
		this.commentService.setActiveCommentAndThread(this.owner, { thread: commentThread, comment: this.comment });

		this._editModeDisposables.add(this._commentEditor.onDidFocusEditorWidget(() => {
			commentThread.input = {
				uri: this._commentEditor!.getModel()!.uri,
				value: this.commentBodyValue
			};
			this.commentService.setActiveEditingCommentThread(commentThread);
			this.commentService.setActiveCommentAndThread(this.owner, { thread: commentThread, comment: this.comment });
		}));

		this._editModeDisposables.add(this._commentEditor.onDidChangeModelContent(e => {
			if (commentThread.input && this._commentEditor && this._commentEditor.getModel()!.uri === commentThread.input.uri) {
				const newVal = this._commentEditor.getValue();
				if (newVal !== commentThread.input.value) {
					const input = commentThread.input;
					input.value = newVal;
					commentThread.input = input;
					this.commentService.setActiveEditingCommentThread(commentThread);
					this.commentService.setActiveCommentAndThread(this.owner, { thread: commentThread, comment: this.comment });
				}
			}
		}));

		this.calculateEditorHeight();

		this._editModeDisposables.add((this._commentEditorModel.object.textEditorModel.onDidChangeContent(() => {
			if (this._commentEditor && this.calculateEditorHeight()) {
				this._commentEditor.layout({ height: this._editorHeight, width: this._commentEditor.getLayoutInfo().width });
				this._commentEditor.render(true);
			}
		})));

	}

	private calculateEditorHeight(): boolean {
		if (this._commentEditor) {
			const newEditorHeight = calculateEditorHeight(this.parentEditor, this._commentEditor, this._editorHeight);
			if (newEditorHeight !== this._editorHeight) {
				this._editorHeight = newEditorHeight;
				return true;
			}
		}
		return false;
	}

	getPendingEdit(): languages.PendingComment | undefined {
		const model = this._commentEditor?.getModel();
		if (this._commentEditor && model && model.getValueLength() > 0) {
			return { body: model.getValue(), cursor: this._commentEditor.getPosition()! };
		}
		return undefined;
	}

	private removeCommentEditor() {
		this.isEditing = false;
		if (this._editAction) {
			this._editAction.enabled = true;
		}
		this._body.classList.remove('hidden');
		this._editModeDisposables.clear();
		this._commentEditor = null;
		this._commentEditContainer!.remove();
	}

	layout(widthInPixel?: number) {
		const editorWidth = widthInPixel !== undefined ? widthInPixel - 72 /* - margin and scrollbar*/ : (this._commentEditor?.getLayoutInfo().width ?? 0);
		this._commentEditor?.layout({ width: editorWidth, height: this._editorHeight });
		const scrollWidth = this._body.scrollWidth;
		const width = dom.getContentWidth(this._body);
		const scrollHeight = this._body.scrollHeight;
		const height = dom.getContentHeight(this._body) + 4;
		this._scrollableElement.setScrollDimensions({ width, scrollWidth, height, scrollHeight });
	}

	public async switchToEditMode() {
		if (this.isEditing) {
			return;
		}

		this.isEditing = true;
		this._body.classList.add('hidden');
		this._commentEditContainer = dom.append(this._commentDetailsContainer, dom.$('.edit-container'));
		await this.createCommentEditor(this._commentEditContainer);

		const formActions = dom.append(this._commentEditContainer, dom.$('.form-actions'));
		const otherActions = dom.append(formActions, dom.$('.other-actions'));
		this.createCommentWidgetFormActions(otherActions);
		const editorActions = dom.append(formActions, dom.$('.editor-actions'));
		this.createCommentWidgetEditorActions(editorActions);
	}

	private readonly _editModeDisposables: DisposableStore = this._register(new DisposableStore());
	private createCommentWidgetFormActions(container: HTMLElement) {
		const menus = this.commentService.getCommentMenus(this.owner);
		const menu = menus.getCommentActions(this.comment, this._contextKeyService);

		this._editModeDisposables.add(menu);
		this._editModeDisposables.add(menu.onDidChange(() => {
			this._commentFormActions?.setActions(menu);
		}));

		this._commentFormActions = new CommentFormActions(this.keybindingService, this._contextKeyService, this.contextMenuService, container, (action: IAction): void => {
			const text = this._commentEditor!.getValue();

			action.run({
				thread: this.commentThread,
				commentUniqueId: this.comment.uniqueIdInThread,
				text: text,
				$mid: MarshalledId.CommentThreadNode
			});

			this.removeCommentEditor();
		});

		this._editModeDisposables.add(this._commentFormActions);
		this._commentFormActions.setActions(menu);
	}

	private createCommentWidgetEditorActions(container: HTMLElement) {
		const menus = this.commentService.getCommentMenus(this.owner);
		const menu = menus.getCommentEditorActions(this._contextKeyService);

		this._editModeDisposables.add(menu);
		this._editModeDisposables.add(menu.onDidChange(() => {
			this._commentEditorActions?.setActions(menu, true);
		}));

		this._commentEditorActions = new CommentFormActions(this.keybindingService, this._contextKeyService, this.contextMenuService, container, (action: IAction): void => {
			const text = this._commentEditor!.getValue();

			action.run({
				thread: this.commentThread,
				commentUniqueId: this.comment.uniqueIdInThread,
				text: text,
				$mid: MarshalledId.CommentThreadNode
			});

			this._commentEditor?.focus();
		});

		this._editModeDisposables.add(this._commentEditorActions);
		this._commentEditorActions.setActions(menu, true);
	}

	setFocus(focused: boolean, visible: boolean = false) {
		if (focused) {
			this._domNode.focus();
			this._actionsToolbarContainer.classList.add('tabfocused');
			this._domNode.tabIndex = 0;
			if (this.comment.mode === languages.CommentMode.Editing) {
				this._commentEditor?.focus();
			}
		} else {
			if (this._actionsToolbarContainer.classList.contains('tabfocused') && !this._actionsToolbarContainer.classList.contains('mouseover')) {
				this._domNode.tabIndex = -1;
			}
			this._actionsToolbarContainer.classList.remove('tabfocused');
		}
	}

	async update(newComment: languages.Comment) {

		if (newComment.body !== this.comment.body) {
			this.updateCommentBody(newComment.body);
		}

		if (this.comment.userIconPath && newComment.userIconPath && (URI.from(this.comment.userIconPath).toString() !== URI.from(newComment.userIconPath).toString())) {
			this.updateCommentUserIcon(newComment.userIconPath);
		}

		const isChangingMode: boolean = newComment.mode !== undefined && newComment.mode !== this.comment.mode;

		this.comment = newComment;

		if (isChangingMode) {
			if (newComment.mode === languages.CommentMode.Editing) {
				await this.switchToEditMode();
			} else {
				this.removeCommentEditor();
			}
		}

		if (newComment.label) {
			this._isPendingLabel.innerText = newComment.label;
		} else {
			this._isPendingLabel.innerText = '';
		}

		// update comment reactions
		this.createReactionsContainer(this._commentDetailsContainer);

		if (this.comment.contextValue) {
			this._commentContextValue.set(this.comment.contextValue);
		} else {
			this._commentContextValue.reset();
		}

		if (this.comment.timestamp) {
			this.updateTimestamp(this.comment.timestamp);
		}
	}

	private onContextMenu(e: MouseEvent) {
		const event = new StandardMouseEvent(dom.getWindow(this._domNode), e);
		this.contextMenuService.showContextMenu({
			getAnchor: () => event,
			menuId: MenuId.CommentThreadCommentContext,
			menuActionOptions: { shouldForwardArgs: true },
			contextKeyService: this._contextKeyService,
			actionRunner: this._actionRunner,
			getActionsContext: () => {
				return this.commentNodeContext;
			},
		});
	}

	focus() {
		this.domNode.focus();
		if (!this._clearTimeout) {
			this.domNode.classList.add('focus');
			this._clearTimeout = setTimeout(() => {
				this.domNode.classList.remove('focus');
			}, 3000);
		}
	}

	override dispose(): void {
		super.dispose();
	}
}

function fillInActions(groups: [string, Array<MenuItemAction | SubmenuItemAction>][], target: IAction[] | { primary: IAction[]; secondary: IAction[] }, useAlternativeActions: boolean, isPrimaryGroup: (group: string) => boolean = group => group === 'navigation'): void {
	for (const tuple of groups) {
		let [group, actions] = tuple;
		if (useAlternativeActions) {
			actions = actions.map(a => (a instanceof MenuItemAction) && !!a.alt ? a.alt : a);
		}

		if (isPrimaryGroup(group)) {
			const to = Array.isArray(target) ? target : target.primary;

			to.unshift(...actions);
		} else {
			const to = Array.isArray(target) ? target : target.secondary;

			if (to.length > 0) {
				to.push(new Separator());
			}

			to.push(...actions);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/comments/browser/commentReply.ts]---
Location: vscode-main/src/vs/workbench/contrib/comments/browser/commentReply.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { getDefaultHoverDelegate } from '../../../../base/browser/ui/hover/hoverDelegateFactory.js';
import { MOUSE_CURSOR_TEXT_CSS_CLASS_NAME } from '../../../../base/browser/ui/mouseCursor/mouseCursor.js';
import { IAction } from '../../../../base/common/actions.js';
import { Disposable, IDisposable, dispose } from '../../../../base/common/lifecycle.js';
import { MarshalledId } from '../../../../base/common/marshallingIds.js';
import { FileAccess, Schemas } from '../../../../base/common/network.js';
import { URI } from '../../../../base/common/uri.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import { ICodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { IRange } from '../../../../editor/common/core/range.js';
import * as languages from '../../../../editor/common/languages.js';
import { ITextModel } from '../../../../editor/common/model.js';
import { ITextModelService } from '../../../../editor/common/services/resolverService.js';
import * as nls from '../../../../nls.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { CommentFormActions } from './commentFormActions.js';
import { CommentMenus } from './commentMenus.js';
import { ICommentService } from './commentService.js';
import { CommentContextKeys } from '../common/commentContextKeys.js';
import { ICommentThreadWidget } from '../common/commentThreadWidget.js';
import { ICellRange } from '../../notebook/common/notebookRange.js';
import { LayoutableEditor, MIN_EDITOR_HEIGHT, SimpleCommentEditor, calculateEditorHeight } from './simpleCommentEditor.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { Position } from '../../../../editor/common/core/position.js';

let INMEM_MODEL_ID = 0;
export const COMMENTEDITOR_DECORATION_KEY = 'commenteditordecoration';

export class CommentReply<T extends IRange | ICellRange> extends Disposable {
	commentEditor: ICodeEditor;
	private _container: HTMLElement;
	private _form: HTMLElement;
	commentEditorIsEmpty: IContextKey<boolean>;
	private avatar!: HTMLElement;
	private _error!: HTMLElement;
	private _formActions!: HTMLElement;
	private _editorActions!: HTMLElement;
	private _commentThreadDisposables: IDisposable[] = [];
	private _commentFormActions!: CommentFormActions;
	private _commentEditorActions!: CommentFormActions;
	private _reviewThreadReplyButton!: HTMLElement;
	private _editorHeight = MIN_EDITOR_HEIGHT;

	constructor(
		readonly owner: string,
		container: HTMLElement,
		private readonly _parentEditor: LayoutableEditor,
		private _commentThread: languages.CommentThread<T>,
		private _scopedInstatiationService: IInstantiationService,
		private _contextKeyService: IContextKeyService,
		private _commentMenus: CommentMenus,
		private _commentOptions: languages.CommentOptions | undefined,
		private _pendingComment: languages.PendingComment | undefined,
		private _parentThread: ICommentThreadWidget,
		focus: boolean,
		private _actionRunDelegate: (() => void) | null,
		@ICommentService private commentService: ICommentService,
		@IConfigurationService configurationService: IConfigurationService,
		@IKeybindingService private keybindingService: IKeybindingService,
		@IContextMenuService private contextMenuService: IContextMenuService,
		@IHoverService private hoverService: IHoverService,
		@ITextModelService private readonly textModelService: ITextModelService
	) {
		super();
		this._container = dom.append(container, dom.$('.comment-form-container'));
		this._form = dom.append(this._container, dom.$('.comment-form'));
		this.commentEditor = this._register(this._scopedInstatiationService.createInstance(SimpleCommentEditor, this._form, SimpleCommentEditor.getEditorOptions(configurationService), _contextKeyService, this._parentThread));
		this.commentEditorIsEmpty = CommentContextKeys.commentIsEmpty.bindTo(this._contextKeyService);
		this.commentEditorIsEmpty.set(!this._pendingComment);

		this.initialize(focus);
	}

	private async initialize(focus: boolean) {
		this.avatar = dom.append(this._form, dom.$('.avatar-container'));
		this.updateAuthorInfo();
		const hasExistingComments = this._commentThread.comments && this._commentThread.comments.length > 0;
		const modeId = generateUuid() + '-' + (hasExistingComments ? this._commentThread.threadId : ++INMEM_MODEL_ID);
		const params = JSON.stringify({
			extensionId: this._commentThread.extensionId,
			commentThreadId: this._commentThread.threadId
		});

		let resource = URI.from({
			scheme: Schemas.commentsInput,
			path: `/${this._commentThread.extensionId}/commentinput-${modeId}.md?${params}` // TODO. Remove params once extensions adopt authority.
		});
		const commentController = this.commentService.getCommentController(this.owner);
		if (commentController) {
			resource = resource.with({ authority: commentController.id });
		}

		const model = await this.textModelService.createModelReference(resource);
		model.object.textEditorModel.setValue(this._pendingComment?.body || '');

		this._register(model);
		this.commentEditor.setModel(model.object.textEditorModel);
		if (this._pendingComment) {
			this.commentEditor.setPosition(this._pendingComment.cursor);
		}
		this.calculateEditorHeight();

		this._register(model.object.textEditorModel.onDidChangeContent(() => {
			this.setCommentEditorDecorations();
			this.commentEditorIsEmpty?.set(!this.commentEditor.getValue());
			if (this.calculateEditorHeight()) {
				this.commentEditor.layout({ height: this._editorHeight, width: this.commentEditor.getLayoutInfo().width });
				this.commentEditor.render(true);
			}
		}));

		this.createTextModelListener(this.commentEditor, this._form);

		this.setCommentEditorDecorations();

		// Only add the additional step of clicking a reply button to expand the textarea when there are existing comments
		if (this._pendingComment) {
			this.expandReplyArea();
		} else if (hasExistingComments) {
			this.createReplyButton(this.commentEditor, this._form);
		} else if (this._commentThread.comments && this._commentThread.comments.length === 0) {
			this.expandReplyArea(focus);
		}
		this._error = dom.append(this._container, dom.$('.validation-error.hidden'));
		const formActions = dom.append(this._container, dom.$('.form-actions'));
		this._formActions = dom.append(formActions, dom.$('.other-actions'));
		this.createCommentWidgetFormActions(this._formActions, model.object.textEditorModel);
		this._editorActions = dom.append(formActions, dom.$('.editor-actions'));
		this.createCommentWidgetEditorActions(this._editorActions, model.object.textEditorModel);
	}

	private calculateEditorHeight(): boolean {
		const newEditorHeight = calculateEditorHeight(this._parentEditor, this.commentEditor, this._editorHeight);
		if (newEditorHeight !== this._editorHeight) {
			this._editorHeight = newEditorHeight;
			return true;
		}
		return false;
	}

	public updateCommentThread(commentThread: languages.CommentThread<IRange | ICellRange>) {
		const isReplying = this.commentEditor.hasTextFocus();
		const oldAndNewBothEmpty = !this._commentThread.comments?.length && !commentThread.comments?.length;

		if (!this._reviewThreadReplyButton) {
			this.createReplyButton(this.commentEditor, this._form);
		}

		if (this._commentThread.comments && this._commentThread.comments.length === 0 && !oldAndNewBothEmpty) {
			this.expandReplyArea();
		}

		if (isReplying) {
			this.commentEditor.focus();
		}
	}

	public getPendingComment(): languages.PendingComment | undefined {
		const model = this.commentEditor.getModel();

		if (model && model.getValueLength() > 0) { // checking length is cheap
			return { body: model.getValue(), cursor: this.commentEditor.getPosition() ?? new Position(1, 1) };
		}

		return undefined;
	}

	public setPendingComment(pending: languages.PendingComment) {
		this._pendingComment = pending;
		this.expandReplyArea();
		this.commentEditor.setValue(pending.body);
		this.commentEditor.setPosition(pending.cursor);
	}

	public layout(widthInPixel: number) {
		this.commentEditor.layout({ height: this._editorHeight, width: widthInPixel - 54 /* margin 20px * 10 + scrollbar 14px*/ });
	}

	public focusIfNeeded() {
		if (!this._commentThread.comments || !this._commentThread.comments.length) {
			this.commentEditor.focus();
		} else if ((this.commentEditor.getModel()?.getValueLength() ?? 0) > 0) {
			this.expandReplyArea();
		}
	}

	public focusCommentEditor() {
		this.commentEditor.focus();
	}

	public expandReplyAreaAndFocusCommentEditor() {
		this.expandReplyArea();
		this.commentEditor.focus();
	}

	public isCommentEditorFocused(): boolean {
		return this.commentEditor.hasWidgetFocus();
	}

	private updateAuthorInfo() {
		this.avatar.textContent = '';
		if (typeof this._commentThread.canReply !== 'boolean' && this._commentThread.canReply.iconPath) {
			this.avatar.style.display = 'block';
			const img = dom.append(this.avatar, dom.$('img.avatar')) as HTMLImageElement;
			img.src = FileAccess.uriToBrowserUri(URI.revive(this._commentThread.canReply.iconPath)).toString(true);
		} else {
			this.avatar.style.display = 'none';
		}
	}

	public updateCanReply() {
		this.updateAuthorInfo();
		if (!this._commentThread.canReply) {
			this._container.style.display = 'none';
		} else {
			this._container.style.display = 'block';
		}
	}

	async submitComment(): Promise<void> {
		await this._commentFormActions?.triggerDefaultAction();
		this._pendingComment = undefined;
	}

	setCommentEditorDecorations() {
		const hasExistingComments = this._commentThread.comments && this._commentThread.comments.length > 0;
		const placeholder = hasExistingComments
			? (this._commentOptions?.placeHolder || nls.localize('reply', "Reply..."))
			: (this._commentOptions?.placeHolder || nls.localize('newComment', "Type a new comment"));

		this.commentEditor.updateOptions({ placeholder });
	}

	private createTextModelListener(commentEditor: ICodeEditor, commentForm: HTMLElement) {
		this._commentThreadDisposables.push(commentEditor.onDidFocusEditorWidget(() => {
			this._commentThread.input = {
				uri: commentEditor.getModel()!.uri,
				value: commentEditor.getValue()
			};
			this.commentService.setActiveEditingCommentThread(this._commentThread);
			this.commentService.setActiveCommentAndThread(this.owner, { thread: this._commentThread });
		}));

		this._commentThreadDisposables.push(commentEditor.getModel()!.onDidChangeContent(() => {
			const modelContent = commentEditor.getValue();
			if (this._commentThread.input && this._commentThread.input.uri === commentEditor.getModel()!.uri && this._commentThread.input.value !== modelContent) {
				const newInput: languages.CommentInput = this._commentThread.input;
				newInput.value = modelContent;
				this._commentThread.input = newInput;
			}
			this.commentService.setActiveEditingCommentThread(this._commentThread);
		}));

		this._commentThreadDisposables.push(this._commentThread.onDidChangeInput(input => {
			const thread = this._commentThread;
			const model = commentEditor.getModel();
			if (thread.input && model && (thread.input.uri !== model.uri)) {
				return;
			}
			if (!input) {
				return;
			}

			if (commentEditor.getValue() !== input.value) {
				commentEditor.setValue(input.value);

				if (input.value === '') {
					this._pendingComment = { body: '', cursor: new Position(1, 1) };
					commentForm.classList.remove('expand');
					commentEditor.getDomNode()!.style.outline = '';
					this._error.textContent = '';
					this._error.classList.add('hidden');
				}
			}
		}));
	}

	/**
	 * Command based actions.
	 */
	private createCommentWidgetFormActions(container: HTMLElement, model: ITextModel) {
		const menu = this._commentMenus.getCommentThreadActions(this._contextKeyService);

		this._register(menu);
		this._register(menu.onDidChange(() => {
			this._commentFormActions.setActions(menu);
		}));

		this._commentFormActions = new CommentFormActions(this.keybindingService, this._contextKeyService, this.contextMenuService, container, async (action: IAction) => {
			await this._actionRunDelegate?.();

			await action.run({
				thread: this._commentThread,
				text: this.commentEditor.getValue(),
				$mid: MarshalledId.CommentThreadReply
			});

			this.hideReplyArea();
		});

		this._register(this._commentFormActions);
		this._commentFormActions.setActions(menu);
	}

	private createCommentWidgetEditorActions(container: HTMLElement, model: ITextModel) {
		const editorMenu = this._commentMenus.getCommentEditorActions(this._contextKeyService);
		this._register(editorMenu);
		this._register(editorMenu.onDidChange(() => {
			this._commentEditorActions.setActions(editorMenu, true);
		}));

		this._commentEditorActions = new CommentFormActions(this.keybindingService, this._contextKeyService, this.contextMenuService, container, async (action: IAction) => {
			this._actionRunDelegate?.();

			action.run({
				thread: this._commentThread,
				text: this.commentEditor.getValue(),
				$mid: MarshalledId.CommentThreadReply
			});

			this.focusCommentEditor();
		});

		this._register(this._commentEditorActions);
		this._commentEditorActions.setActions(editorMenu, true);
	}

	private get isReplyExpanded(): boolean {
		return this._container.classList.contains('expand');
	}

	private expandReplyArea(focus: boolean = true) {
		if (!this.isReplyExpanded) {
			this._container.classList.add('expand');
			if (focus) {
				this.commentEditor.focus();
			}
			this.commentEditor.layout();
		}
	}

	private clearAndExpandReplyArea() {
		if (!this.isReplyExpanded) {
			this.commentEditor.setValue('');
			this.expandReplyArea();
		}
	}

	private hideReplyArea() {
		const domNode = this.commentEditor.getDomNode();
		if (domNode) {
			domNode.style.outline = '';
		}
		this.commentEditor.setValue('');
		this._pendingComment = { body: '', cursor: new Position(1, 1) };
		this._container.classList.remove('expand');
		this._error.textContent = '';
		this._error.classList.add('hidden');
	}

	private createReplyButton(commentEditor: ICodeEditor, commentForm: HTMLElement) {
		this._reviewThreadReplyButton = <HTMLButtonElement>dom.append(commentForm, dom.$(`button.review-thread-reply-button.${MOUSE_CURSOR_TEXT_CSS_CLASS_NAME}`));
		this._register(this.hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), this._reviewThreadReplyButton, this._commentOptions?.prompt || nls.localize('reply', "Reply...")));

		this._reviewThreadReplyButton.textContent = this._commentOptions?.prompt || nls.localize('reply', "Reply...");
		// bind click/escape actions for reviewThreadReplyButton and textArea
		this._register(dom.addDisposableListener(this._reviewThreadReplyButton, 'click', _ => this.clearAndExpandReplyArea()));
		this._register(dom.addDisposableListener(this._reviewThreadReplyButton, 'focus', _ => this.clearAndExpandReplyArea()));

		this._register(commentEditor.onDidBlurEditorWidget(() => {
			if (commentEditor.getModel()!.getValueLength() === 0 && commentForm.classList.contains('expand')) {
				commentForm.classList.remove('expand');
			}
		}));
	}

	override dispose(): void {
		super.dispose();
		dispose(this._commentThreadDisposables);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/comments/browser/comments.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/comments/browser/comments.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import './commentsEditorContribution.js';
import { ICommentService, CommentService, IWorkspaceCommentThreadsEvent } from './commentService.js';
import { IConfigurationRegistry, Extensions as ConfigurationExtensions } from '../../../../platform/configuration/common/configurationRegistry.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { Disposable, IDisposable, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { Extensions, IWorkbenchContribution, IWorkbenchContributionsRegistry } from '../../../common/contributions.js';
import { IActivityService, NumberBadge } from '../../../services/activity/common/activity.js';
import { COMMENTS_VIEW_ID } from './commentsTreeViewer.js';
import { CommentThreadState } from '../../../../editor/common/languages.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { Action2, MenuId, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { CONTEXT_KEY_HAS_COMMENTS, CONTEXT_KEY_SOME_COMMENTS_EXPANDED, CommentsPanel } from './commentsView.js';
import { ViewAction } from '../../../browser/parts/views/viewPane.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { revealCommentThread } from './commentsController.js';
import { MarshalledCommentThreadInternal } from '../../../common/comments.js';
import { accessibleViewCurrentProviderId, accessibleViewIsShown } from '../../accessibility/browser/accessibilityConfiguration.js';
import { AccessibleViewProviderId } from '../../../../platform/accessibility/browser/accessibleView.js';
import { AccessibleViewRegistry } from '../../../../platform/accessibility/browser/accessibleViewRegistry.js';
import { CommentsAccessibleView, CommentThreadAccessibleView } from './commentsAccessibleView.js';
import { CommentsAccessibilityHelp } from './commentsAccessibility.js';

registerAction2(class Collapse extends ViewAction<CommentsPanel> {
	constructor() {
		super({
			viewId: COMMENTS_VIEW_ID,
			id: 'comments.collapse',
			title: nls.localize('collapseAll', "Collapse All"),
			f1: false,
			icon: Codicon.collapseAll,
			menu: {
				id: MenuId.ViewTitle,
				group: 'navigation',
				when: ContextKeyExpr.and(ContextKeyExpr.and(ContextKeyExpr.equals('view', COMMENTS_VIEW_ID), CONTEXT_KEY_HAS_COMMENTS), CONTEXT_KEY_SOME_COMMENTS_EXPANDED),
				order: 100
			}
		});
	}
	runInView(_accessor: ServicesAccessor, view: CommentsPanel) {
		view.collapseAll();
	}
});

registerAction2(class Expand extends ViewAction<CommentsPanel> {
	constructor() {
		super({
			viewId: COMMENTS_VIEW_ID,
			id: 'comments.expand',
			title: nls.localize('expandAll', "Expand All"),
			f1: false,
			icon: Codicon.expandAll,
			menu: {
				id: MenuId.ViewTitle,
				group: 'navigation',
				when: ContextKeyExpr.and(ContextKeyExpr.and(ContextKeyExpr.equals('view', COMMENTS_VIEW_ID), CONTEXT_KEY_HAS_COMMENTS), ContextKeyExpr.not(CONTEXT_KEY_SOME_COMMENTS_EXPANDED.key)),
				order: 100
			}
		});
	}
	runInView(_accessor: ServicesAccessor, view: CommentsPanel) {
		view.expandAll();
	}
});

registerAction2(class Reply extends Action2 {
	constructor() {
		super({
			id: 'comments.reply',
			title: nls.localize('reply', "Reply"),
			icon: Codicon.reply,
			precondition: ContextKeyExpr.equals('canReply', true),
			menu: [{
				id: MenuId.CommentsViewThreadActions,
				order: 100
			},
			{
				id: MenuId.AccessibleView,
				when: ContextKeyExpr.and(accessibleViewIsShown, ContextKeyExpr.equals(accessibleViewCurrentProviderId.key, AccessibleViewProviderId.Comments)),
			}]
		});
	}

	override run(accessor: ServicesAccessor, marshalledCommentThread: MarshalledCommentThreadInternal): void {
		const commentService = accessor.get(ICommentService);
		const editorService = accessor.get(IEditorService);
		const uriIdentityService = accessor.get(IUriIdentityService);
		revealCommentThread(commentService, editorService, uriIdentityService, marshalledCommentThread.thread, marshalledCommentThread.thread.comments![marshalledCommentThread.thread.comments!.length - 1], true);
	}
});

Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration).registerConfiguration({
	id: 'comments',
	order: 20,
	title: nls.localize('commentsConfigurationTitle', "Comments"),
	type: 'object',
	properties: {
		'comments.openPanel': {
			enum: ['neverOpen', 'openOnSessionStart', 'openOnSessionStartWithComments'],
			default: 'openOnSessionStartWithComments',
			description: nls.localize('openComments', "Controls when the comments panel should open."),
			restricted: false,
			markdownDeprecationMessage: nls.localize('comments.openPanel.deprecated', "This setting is deprecated in favor of `comments.openView`.")
		},
		'comments.openView': {
			enum: ['never', 'file', 'firstFile', 'firstFileUnresolved'],
			enumDescriptions: [nls.localize('comments.openView.never', "The comments view will never be opened."), nls.localize('comments.openView.file', "The comments view will open when a file with comments is active."), nls.localize('comments.openView.firstFile', "If the comments view has not been opened yet during this session it will open the first time during a session that a file with comments is active."), nls.localize('comments.openView.firstFileUnresolved', "If the comments view has not been opened yet during this session and the comment is not resolved, it will open the first time during a session that a file with comments is active.")],
			default: 'firstFile',
			description: nls.localize('comments.openView', "Controls when the comments view should open."),
			restricted: false
		},
		'comments.useRelativeTime': {
			type: 'boolean',
			default: true,
			description: nls.localize('useRelativeTime', "Determines if relative time will be used in comment timestamps (ex. '1 day ago').")
		},
		'comments.visible': {
			type: 'boolean',
			default: true,
			description: nls.localize('comments.visible', "Controls the visibility of the comments bar and comment threads in editors that have commenting ranges and comments. Comments are still accessible via the Comments view and will cause commenting to be toggled on in the same way running the command \"Comments: Toggle Editor Commenting\" toggles comments.")
		},
		'comments.maxHeight': {
			type: 'boolean',
			default: true,
			description: nls.localize('comments.maxHeight', "Controls whether the comments widget scrolls or expands.")
		},
		'comments.collapseOnResolve': {
			type: 'boolean',
			default: true,
			description: nls.localize('collapseOnResolve', "Controls whether the comment thread should collapse when the thread is resolved.")
		},
		'comments.thread.confirmOnCollapse': {
			type: 'string',
			enum: ['whenHasUnsubmittedComments', 'never'],
			enumDescriptions: [nls.localize('confirmOnCollapse.whenHasUnsubmittedComments', "Show a confirmation dialog when collapsing a comment thread with unsubmitted comments."), nls.localize('confirmOnCollapse.never', "Never show a confirmation dialog when collapsing a comment thread.")],
			default: 'whenHasUnsubmittedComments',
			description: nls.localize('confirmOnCollapse', "Controls whether a confirmation dialog is shown when collapsing a comment thread.")
		}
	}
});

registerSingleton(ICommentService, CommentService, InstantiationType.Delayed);

export class UnresolvedCommentsBadge extends Disposable implements IWorkbenchContribution {
	private readonly activity = this._register(new MutableDisposable<IDisposable>());
	private totalUnresolved = 0;

	constructor(
		@ICommentService private readonly _commentService: ICommentService,
		@IActivityService private readonly activityService: IActivityService) {
		super();
		this._register(this._commentService.onDidSetAllCommentThreads(this.onAllCommentsChanged, this));
		this._register(this._commentService.onDidUpdateCommentThreads(this.onCommentsUpdated, this));
		this._register(this._commentService.onDidDeleteDataProvider(this.onCommentsUpdated, this));
	}

	private onAllCommentsChanged(e: IWorkspaceCommentThreadsEvent): void {
		let unresolved = 0;
		for (const thread of e.commentThreads) {
			if (thread.state === CommentThreadState.Unresolved) {
				unresolved++;
			}
		}
		this.updateBadge(unresolved);
	}

	private onCommentsUpdated(): void {
		let unresolved = 0;
		for (const resource of this._commentService.commentsModel.resourceCommentThreads) {
			for (const thread of resource.commentThreads) {
				if (thread.threadState === CommentThreadState.Unresolved) {
					unresolved++;
				}
			}
		}
		this.updateBadge(unresolved);
	}

	private updateBadge(unresolved: number) {
		if (unresolved === this.totalUnresolved) {
			return;
		}

		this.totalUnresolved = unresolved;
		const message = nls.localize('totalUnresolvedComments', '{0} Unresolved Comments', this.totalUnresolved);
		this.activity.value = this.activityService.showViewActivity(COMMENTS_VIEW_ID, { badge: new NumberBadge(this.totalUnresolved, () => message) });
	}
}

Registry.as<IWorkbenchContributionsRegistry>(Extensions.Workbench).registerWorkbenchContribution(UnresolvedCommentsBadge, LifecyclePhase.Eventually);

AccessibleViewRegistry.register(new CommentsAccessibleView());
AccessibleViewRegistry.register(new CommentThreadAccessibleView());
AccessibleViewRegistry.register(new CommentsAccessibilityHelp());
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/comments/browser/comments.ts]---
Location: vscode-main/src/vs/workbench/contrib/comments/browser/comments.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { IView } from '../../../common/views.js';
import { CommentsFilters } from './commentsViewActions.js';

export const CommentsViewFilterFocusContextKey = new RawContextKey<boolean>('commentsFilterFocus', false);

export interface ICommentsView extends IView {

	readonly filters: CommentsFilters;
	focusFilter(): void;
	clearFilterText(): void;
	getFilterStats(): { total: number; filtered: number };

	collapseAll(): void;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/comments/browser/commentsAccessibility.ts]---
Location: vscode-main/src/vs/workbench/contrib/comments/browser/commentsAccessibility.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { ctxCommentEditorFocused } from './simpleCommentEditor.js';
import { CommentContextKeys } from '../common/commentContextKeys.js';
import * as nls from '../../../../nls.js';
import { AccessibilityVerbositySettingId } from '../../accessibility/browser/accessibilityConfiguration.js';
import { CommentCommandId } from '../common/commentCommandIds.js';
import { ToggleTabFocusModeAction } from '../../../../editor/contrib/toggleTabFocusMode/browser/toggleTabFocusMode.js';
import { IAccessibleViewContentProvider, AccessibleViewProviderId, IAccessibleViewOptions, AccessibleViewType } from '../../../../platform/accessibility/browser/accessibleView.js';
import { IAccessibleViewImplementation } from '../../../../platform/accessibility/browser/accessibleViewRegistry.js';
import { Disposable } from '../../../../base/common/lifecycle.js';


export namespace CommentAccessibilityHelpNLS {
	export const intro = nls.localize('intro', "The editor contains commentable range(s). Some useful commands include:");
	export const tabFocus = nls.localize('introWidget', "This widget contains a text area, for composition of new comments, and actions, that can be tabbed to once tab moves focus mode has been enabled with the command Toggle Tab Key Moves Focus{0}.", `<keybinding:${ToggleTabFocusModeAction.ID}>`);
	export const commentCommands = nls.localize('commentCommands', "Some useful comment commands include:");
	export const escape = nls.localize('escape', "- Dismiss Comment (Escape)");
	export const nextRange = nls.localize('next', "- Go to Next Commenting Range{0}.", `<keybinding:${CommentCommandId.NextRange}>`);
	export const previousRange = nls.localize('previous', "- Go to Previous Commenting Range{0}.", `<keybinding:${CommentCommandId.PreviousRange}>`);
	export const nextCommentThread = nls.localize('nextCommentThreadKb', "- Go to Next Comment Thread{0}.", `<keybinding:${CommentCommandId.NextThread}>`);
	export const previousCommentThread = nls.localize('previousCommentThreadKb', "- Go to Previous Comment Thread{0}.", `<keybinding:${CommentCommandId.PreviousThread}>`);
	export const nextCommentedRange = nls.localize('nextCommentedRangeKb', "- Go to Next Commented Range{0}.", `<keybinding:${CommentCommandId.NextCommentedRange}>`);
	export const previousCommentedRange = nls.localize('previousCommentedRangeKb', "- Go to Previous Commented Range{0}.", `<keybinding:${CommentCommandId.PreviousCommentedRange}>`);
	export const addComment = nls.localize('addCommentNoKb', "- Add Comment on Current Selection{0}.", `<keybinding:${CommentCommandId.Add}>`);
	export const submitComment = nls.localize('submitComment', "- Submit Comment{0}.", `<keybinding:${CommentCommandId.Submit}>`);
}

export class CommentsAccessibilityHelpProvider extends Disposable implements IAccessibleViewContentProvider {
	id = AccessibleViewProviderId.Comments;
	verbositySettingKey: AccessibilityVerbositySettingId = AccessibilityVerbositySettingId.Comments;
	options: IAccessibleViewOptions = { type: AccessibleViewType.Help };
	private _element: HTMLElement | undefined;
	provideContent(): string {
		return [CommentAccessibilityHelpNLS.tabFocus, CommentAccessibilityHelpNLS.commentCommands, CommentAccessibilityHelpNLS.escape, CommentAccessibilityHelpNLS.addComment, CommentAccessibilityHelpNLS.submitComment, CommentAccessibilityHelpNLS.nextRange, CommentAccessibilityHelpNLS.previousRange].join('\n');
	}
	onClose(): void {
		this._element?.focus();
	}
}

export class CommentsAccessibilityHelp implements IAccessibleViewImplementation {
	readonly priority = 110;
	readonly name = 'comments';
	readonly type = AccessibleViewType.Help;
	readonly when = ContextKeyExpr.or(ctxCommentEditorFocused, CommentContextKeys.commentFocused);
	getProvider(accessor: ServicesAccessor) {
		return accessor.get(IInstantiationService).createInstance(CommentsAccessibilityHelpProvider);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/comments/browser/commentsAccessibleView.ts]---
Location: vscode-main/src/vs/workbench/contrib/comments/browser/commentsAccessibleView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { MarshalledId } from '../../../../base/common/marshallingIds.js';
import { ServicesAccessor } from '../../../../editor/browser/editorExtensions.js';
import { AccessibleViewProviderId, AccessibleViewType, IAccessibleViewContentProvider } from '../../../../platform/accessibility/browser/accessibleView.js';
import { IAccessibleViewImplementation } from '../../../../platform/accessibility/browser/accessibleViewRegistry.js';
import { IMenuService } from '../../../../platform/actions/common/actions.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { AccessibilityVerbositySettingId } from '../../accessibility/browser/accessibilityConfiguration.js';
import { COMMENTS_VIEW_ID, CommentsMenus } from './commentsTreeViewer.js';
import { CommentsPanel, CONTEXT_KEY_COMMENT_FOCUSED } from './commentsView.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { ICommentService } from './commentService.js';
import { CommentNode } from '../common/commentModel.js';
import { CommentContextKeys } from '../common/commentContextKeys.js';
import { moveToNextCommentInThread as findNextCommentInThread, revealCommentThread } from './commentsController.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { isCodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { URI } from '../../../../base/common/uri.js';
import { CommentThread, Comment } from '../../../../editor/common/languages.js';
import { IRange } from '../../../../editor/common/core/range.js';
import { IAction } from '../../../../base/common/actions.js';

export class CommentsAccessibleView extends Disposable implements IAccessibleViewImplementation {
	readonly priority = 90;
	readonly name = 'comment';
	readonly when = CONTEXT_KEY_COMMENT_FOCUSED;
	readonly type = AccessibleViewType.View;
	getProvider(accessor: ServicesAccessor) {
		const contextKeyService = accessor.get(IContextKeyService);
		const viewsService = accessor.get(IViewsService);
		const menuService = accessor.get(IMenuService);
		const commentsView = viewsService.getActiveViewWithId<CommentsPanel>(COMMENTS_VIEW_ID);
		const focusedCommentNode = commentsView?.focusedCommentNode;

		if (!commentsView || !focusedCommentNode) {
			return;
		}
		const menus = this._register(new CommentsMenus(menuService));
		menus.setContextKeyService(contextKeyService);

		return new CommentsAccessibleContentProvider(commentsView, focusedCommentNode, menus);
	}
	constructor() {
		super();
	}
}


export class CommentThreadAccessibleView extends Disposable implements IAccessibleViewImplementation {
	readonly priority = 85;
	readonly name = 'commentThread';
	readonly when = CommentContextKeys.commentFocused;
	readonly type = AccessibleViewType.View;
	getProvider(accessor: ServicesAccessor) {
		const commentService = accessor.get(ICommentService);
		const editorService = accessor.get(IEditorService);
		const uriIdentityService = accessor.get(IUriIdentityService);
		const threads = commentService.commentsModel.hasCommentThreads();
		if (!threads) {
			return;
		}
		return new CommentsThreadWidgetAccessibleContentProvider(commentService, editorService, uriIdentityService);
	}
	constructor() {
		super();
	}
}


class CommentsAccessibleContentProvider extends Disposable implements IAccessibleViewContentProvider {
	public readonly actions: IAction[];
	constructor(
		private readonly _commentsView: CommentsPanel,
		private readonly _focusedCommentNode: CommentNode,
		private readonly _menus: CommentsMenus,
	) {
		super();

		this.actions = [...this._menus.getResourceContextActions(this._focusedCommentNode)].filter(i => i.enabled).map(action => {
			return {
				...action,
				run: () => {
					this._commentsView.focus();
					action.run({
						thread: this._focusedCommentNode.thread,
						$mid: MarshalledId.CommentThread,
						commentControlHandle: this._focusedCommentNode.controllerHandle,
						commentThreadHandle: this._focusedCommentNode.threadHandle,
					});
				}
			};
		});
	}
	readonly id = AccessibleViewProviderId.Comments;
	readonly verbositySettingKey = AccessibilityVerbositySettingId.Comments;
	readonly options = { type: AccessibleViewType.View };

	provideContent(): string {
		const commentNode = this._commentsView.focusedCommentNode;
		const content = this._commentsView.focusedCommentInfo?.toString();
		if (!commentNode || !content) {
			throw new Error('Comment tree is focused but no comment is selected');
		}
		return content;
	}
	onClose(): void {
		this._commentsView.focus();
	}
	provideNextContent(): string | undefined {
		this._commentsView.focusNextNode();
		return this.provideContent();
	}
	providePreviousContent(): string | undefined {
		this._commentsView.focusPreviousNode();
		return this.provideContent();
	}
}

class CommentsThreadWidgetAccessibleContentProvider extends Disposable implements IAccessibleViewContentProvider {
	readonly id = AccessibleViewProviderId.CommentThread;
	readonly verbositySettingKey = AccessibilityVerbositySettingId.Comments;
	readonly options = { type: AccessibleViewType.View };
	private _activeCommentInfo: { thread: CommentThread<IRange>; comment?: Comment } | undefined;
	constructor(@ICommentService private readonly _commentService: ICommentService,
		@IEditorService private readonly _editorService: IEditorService,
		@IUriIdentityService private readonly _uriIdentityService: IUriIdentityService,
	) {
		super();
	}

	private get activeCommentInfo(): { thread: CommentThread<IRange>; comment?: Comment } | undefined {
		if (!this._activeCommentInfo && this._commentService.lastActiveCommentcontroller) {
			this._activeCommentInfo = this._commentService.lastActiveCommentcontroller.activeComment;
		}
		return this._activeCommentInfo;
	}

	provideContent(): string {
		if (!this.activeCommentInfo) {
			throw new Error('No current comment thread');
		}
		const comment = this.activeCommentInfo.comment?.body;
		const commentLabel = typeof comment === 'string' ? comment : comment?.value ?? '';
		const resource = this.activeCommentInfo.thread.resource;
		const range = this.activeCommentInfo.thread.range;
		let contentLabel = '';
		if (resource && range) {
			const editor = this._editorService.findEditors(URI.parse(resource)) || [];
			const codeEditor = this._editorService.activeEditorPane?.getControl();
			if (editor?.length && isCodeEditor(codeEditor)) {
				const content = codeEditor.getModel()?.getValueInRange(range);
				if (content) {
					contentLabel = '\nCorresponding code: \n' + content;
				}
			}
		}
		return commentLabel + contentLabel;
	}
	onClose(): void {
		const lastComment = this._activeCommentInfo;
		this._activeCommentInfo = undefined;
		if (lastComment) {
			revealCommentThread(this._commentService, this._editorService, this._uriIdentityService, lastComment.thread, lastComment.comment);
		}
	}
	provideNextContent(): string | undefined {
		const newCommentInfo = findNextCommentInThread(this._activeCommentInfo, 'next');
		if (newCommentInfo) {
			this._activeCommentInfo = newCommentInfo;
			return this.provideContent();
		}
		return undefined;
	}
	providePreviousContent(): string | undefined {
		const newCommentInfo = findNextCommentInThread(this._activeCommentInfo, 'previous');
		if (newCommentInfo) {
			this._activeCommentInfo = newCommentInfo;
			return this.provideContent();
		}
		return undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/comments/browser/commentsController.ts]---
Location: vscode-main/src/vs/workbench/contrib/comments/browser/commentsController.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Action, IAction } from '../../../../base/common/actions.js';
import { coalesce } from '../../../../base/common/arrays.js';
import { findFirstIdxMonotonousOrArrLen } from '../../../../base/common/arraysFind.js';
import { CancelablePromise, createCancelablePromise, Delayer } from '../../../../base/common/async.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { DisposableStore, dispose, IDisposable } from '../../../../base/common/lifecycle.js';
import './media/review.css';
import { ICodeEditor, IEditorMouseEvent, isCodeEditor, isDiffEditor } from '../../../../editor/browser/editorBrowser.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { IRange, Range } from '../../../../editor/common/core/range.js';
import { EditorType, IDiffEditor, IEditor, IEditorContribution, IModelChangedEvent } from '../../../../editor/common/editorCommon.js';
import { IModelDecorationOptions, IModelDeltaDecoration } from '../../../../editor/common/model.js';
import { ModelDecorationOptions, TextModel } from '../../../../editor/common/model/textModel.js';
import * as languages from '../../../../editor/common/languages.js';
import * as nls from '../../../../nls.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IQuickInputService, IQuickPickItem, QuickPickInput } from '../../../../platform/quickinput/common/quickInput.js';
import { CommentGlyphWidget } from './commentGlyphWidget.js';
import { ICommentInfo, ICommentService } from './commentService.js';
import { CommentWidgetFocus, isMouseUpEventDragFromMouseDown, parseMouseDownInfoFromEvent, ReviewZoneWidget } from './commentThreadZoneWidget.js';
import { ACTIVE_GROUP, IEditorService, SIDE_GROUP } from '../../../services/editor/common/editorService.js';
import { EmbeddedCodeEditorWidget } from '../../../../editor/browser/widget/codeEditor/embeddedCodeEditorWidget.js';
import { EditorOption } from '../../../../editor/common/config/editorOptions.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { COMMENTS_VIEW_ID } from './commentsTreeViewer.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { COMMENTS_SECTION, ICommentsConfiguration } from '../common/commentsConfiguration.js';
import { COMMENTEDITOR_DECORATION_KEY } from './commentReply.js';
import { Emitter } from '../../../../base/common/event.js';
import { IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { Position } from '../../../../editor/common/core/position.js';
import { CommentThreadRangeDecorator } from './commentThreadRangeDecorator.js';
import { ICursorSelectionChangedEvent } from '../../../../editor/common/cursorEvents.js';
import { CommentsPanel } from './commentsView.js';
import { status } from '../../../../base/browser/ui/aria/aria.js';
import { CommentContextKeys } from '../common/commentContextKeys.js';
import { AccessibilityVerbositySettingId } from '../../accessibility/browser/accessibilityConfiguration.js';
import { AccessibilityCommandId } from '../../accessibility/common/accessibilityCommands.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { IAccessibilityService } from '../../../../platform/accessibility/common/accessibility.js';
import { URI } from '../../../../base/common/uri.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { threadHasMeaningfulComments } from './commentsModel.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';

export const ID = 'editor.contrib.review';

interface CommentRangeAction {
	ownerId: string;
	extensionId: string | undefined;
	label: string | undefined;
	commentingRangesInfo: languages.CommentingRanges;
}

interface MergedCommentRangeActions {
	range?: Range;
	action: CommentRangeAction;
}

class CommentingRangeDecoration implements IModelDeltaDecoration {
	private _decorationId: string | undefined;
	private _startLineNumber: number;
	private _endLineNumber: number;

	public get id(): string | undefined {
		return this._decorationId;
	}

	public set id(id: string | undefined) {
		this._decorationId = id;
	}

	public get range(): IRange {
		return {
			startLineNumber: this._startLineNumber, startColumn: 1,
			endLineNumber: this._endLineNumber, endColumn: 1
		};
	}

	constructor(private _editor: ICodeEditor, private _ownerId: string, private _extensionId: string | undefined, private _label: string | undefined, private _range: IRange, public readonly options: ModelDecorationOptions, private commentingRangesInfo: languages.CommentingRanges, public readonly isHover: boolean = false) {
		this._startLineNumber = _range.startLineNumber;
		this._endLineNumber = _range.endLineNumber;
	}

	public getCommentAction(): CommentRangeAction {
		return {
			extensionId: this._extensionId,
			label: this._label,
			ownerId: this._ownerId,
			commentingRangesInfo: this.commentingRangesInfo
		};
	}

	public getOriginalRange() {
		return this._range;
	}

	public getActiveRange() {
		return this.id ? this._editor.getModel()!.getDecorationRange(this.id) : undefined;
	}
}

class CommentingRangeDecorator {
	public static description = 'commenting-range-decorator';
	private decorationOptions: ModelDecorationOptions;
	private hoverDecorationOptions: ModelDecorationOptions;
	private multilineDecorationOptions: ModelDecorationOptions;
	private commentingRangeDecorations: CommentingRangeDecoration[] = [];
	private decorationIds: string[] = [];
	private _editor: ICodeEditor | undefined;
	private _infos: ICommentInfo[] | undefined;
	private _lastHover: number = -1;
	private _lastSelection: Range | undefined;
	private _lastSelectionCursor: number | undefined;
	private _onDidChangeDecorationsCount: Emitter<number> = new Emitter();
	public readonly onDidChangeDecorationsCount = this._onDidChangeDecorationsCount.event;

	constructor() {
		const decorationOptions: IModelDecorationOptions = {
			description: CommentingRangeDecorator.description,
			isWholeLine: true,
			linesDecorationsClassName: 'comment-range-glyph comment-diff-added'
		};

		this.decorationOptions = ModelDecorationOptions.createDynamic(decorationOptions);

		const hoverDecorationOptions: IModelDecorationOptions = {
			description: CommentingRangeDecorator.description,
			isWholeLine: true,
			linesDecorationsClassName: `comment-range-glyph line-hover`
		};

		this.hoverDecorationOptions = ModelDecorationOptions.createDynamic(hoverDecorationOptions);

		const multilineDecorationOptions: IModelDecorationOptions = {
			description: CommentingRangeDecorator.description,
			isWholeLine: true,
			linesDecorationsClassName: `comment-range-glyph multiline-add`
		};

		this.multilineDecorationOptions = ModelDecorationOptions.createDynamic(multilineDecorationOptions);
	}

	public updateHover(hoverLine?: number) {
		if (this._editor && this._infos && (hoverLine !== this._lastHover)) {
			this._doUpdate(this._editor, this._infos, hoverLine);
		}
		this._lastHover = hoverLine ?? -1;
	}

	public updateSelection(cursorLine: number, range: Range = new Range(0, 0, 0, 0)) {
		this._lastSelection = range.isEmpty() ? undefined : range;
		this._lastSelectionCursor = range.isEmpty() ? undefined : cursorLine;
		// Some scenarios:
		// Selection is made. Emphasis should show on the drag/selection end location.
		// Selection is made, then user clicks elsewhere. We should still show the decoration.
		if (this._editor && this._infos) {
			this._doUpdate(this._editor, this._infos, cursorLine, range);
		}
	}

	public update(editor: ICodeEditor | undefined, commentInfos: ICommentInfo[], cursorLine?: number, range?: Range) {
		if (editor) {
			this._editor = editor;
			this._infos = commentInfos;
			this._doUpdate(editor, commentInfos, cursorLine, range);
		}
	}

	private _lineHasThread(editor: ICodeEditor, lineRange: Range) {
		return editor.getDecorationsInRange(lineRange)?.find(decoration => decoration.options.description === CommentGlyphWidget.description);
	}

	private _doUpdate(editor: ICodeEditor, commentInfos: ICommentInfo[], emphasisLine: number = -1, selectionRange: Range | undefined = this._lastSelection) {
		const model = editor.getModel();
		if (!model) {
			return;
		}

		// If there's still a selection, use that.
		emphasisLine = this._lastSelectionCursor ?? emphasisLine;

		const commentingRangeDecorations: CommentingRangeDecoration[] = [];
		for (const info of commentInfos) {
			info.commentingRanges.ranges.forEach(range => {
				const rangeObject = new Range(range.startLineNumber, range.startColumn, range.endLineNumber, range.endColumn);
				let intersectingSelectionRange = selectionRange ? rangeObject.intersectRanges(selectionRange) : undefined;
				if ((selectionRange && (emphasisLine >= 0) && intersectingSelectionRange)
					// If there's only one selection line, then just drop into the else if and show an emphasis line.
					&& !((intersectingSelectionRange.startLineNumber === intersectingSelectionRange.endLineNumber)
						&& (emphasisLine === intersectingSelectionRange.startLineNumber))) {
					// The emphasisLine should be within the commenting range, even if the selection range stretches
					// outside of the commenting range.
					// Clip the emphasis and selection ranges to the commenting range
					let intersectingEmphasisRange: Range;
					if (emphasisLine <= intersectingSelectionRange.startLineNumber) {
						intersectingEmphasisRange = intersectingSelectionRange.collapseToStart();
						intersectingSelectionRange = new Range(intersectingSelectionRange.startLineNumber + 1, 1, intersectingSelectionRange.endLineNumber, 1);
					} else {
						intersectingEmphasisRange = new Range(intersectingSelectionRange.endLineNumber, 1, intersectingSelectionRange.endLineNumber, 1);
						intersectingSelectionRange = new Range(intersectingSelectionRange.startLineNumber, 1, intersectingSelectionRange.endLineNumber - 1, 1);
					}
					commentingRangeDecorations.push(new CommentingRangeDecoration(editor, info.uniqueOwner, info.extensionId, info.label, intersectingSelectionRange, this.multilineDecorationOptions, info.commentingRanges, true));

					if (!this._lineHasThread(editor, intersectingEmphasisRange)) {
						commentingRangeDecorations.push(new CommentingRangeDecoration(editor, info.uniqueOwner, info.extensionId, info.label, intersectingEmphasisRange, this.hoverDecorationOptions, info.commentingRanges, true));
					}

					const beforeRangeEndLine = Math.min(intersectingEmphasisRange.startLineNumber, intersectingSelectionRange.startLineNumber) - 1;
					const hasBeforeRange = rangeObject.startLineNumber <= beforeRangeEndLine;
					const afterRangeStartLine = Math.max(intersectingEmphasisRange.endLineNumber, intersectingSelectionRange.endLineNumber) + 1;
					const hasAfterRange = rangeObject.endLineNumber >= afterRangeStartLine;
					if (hasBeforeRange) {
						const beforeRange = new Range(range.startLineNumber, 1, beforeRangeEndLine, 1);
						commentingRangeDecorations.push(new CommentingRangeDecoration(editor, info.uniqueOwner, info.extensionId, info.label, beforeRange, this.decorationOptions, info.commentingRanges, true));
					}
					if (hasAfterRange) {
						const afterRange = new Range(afterRangeStartLine, 1, range.endLineNumber, 1);
						commentingRangeDecorations.push(new CommentingRangeDecoration(editor, info.uniqueOwner, info.extensionId, info.label, afterRange, this.decorationOptions, info.commentingRanges, true));
					}
				} else if ((rangeObject.startLineNumber <= emphasisLine) && (emphasisLine <= rangeObject.endLineNumber)) {
					if (rangeObject.startLineNumber < emphasisLine) {
						const beforeRange = new Range(range.startLineNumber, 1, emphasisLine - 1, 1);
						commentingRangeDecorations.push(new CommentingRangeDecoration(editor, info.uniqueOwner, info.extensionId, info.label, beforeRange, this.decorationOptions, info.commentingRanges, true));
					}
					const emphasisRange = new Range(emphasisLine, 1, emphasisLine, 1);
					if (!this._lineHasThread(editor, emphasisRange)) {
						commentingRangeDecorations.push(new CommentingRangeDecoration(editor, info.uniqueOwner, info.extensionId, info.label, emphasisRange, this.hoverDecorationOptions, info.commentingRanges, true));
					}
					if (emphasisLine < rangeObject.endLineNumber) {
						const afterRange = new Range(emphasisLine + 1, 1, range.endLineNumber, 1);
						commentingRangeDecorations.push(new CommentingRangeDecoration(editor, info.uniqueOwner, info.extensionId, info.label, afterRange, this.decorationOptions, info.commentingRanges, true));
					}
				} else {
					commentingRangeDecorations.push(new CommentingRangeDecoration(editor, info.uniqueOwner, info.extensionId, info.label, range, this.decorationOptions, info.commentingRanges));
				}
			});
		}

		editor.changeDecorations((accessor) => {
			this.decorationIds = accessor.deltaDecorations(this.decorationIds, commentingRangeDecorations);
			commentingRangeDecorations.forEach((decoration, index) => decoration.id = this.decorationIds[index]);
		});

		const rangesDifference = this.commentingRangeDecorations.length - commentingRangeDecorations.length;
		this.commentingRangeDecorations = commentingRangeDecorations;
		if (rangesDifference) {
			this._onDidChangeDecorationsCount.fire(this.commentingRangeDecorations.length);
		}
	}

	private areRangesIntersectingOrTouchingByLine(a: Range, b: Range) {
		// Check if `a` is before `b`
		if (a.endLineNumber < (b.startLineNumber - 1)) {
			return false;
		}

		// Check if `b` is before `a`
		if ((b.endLineNumber + 1) < a.startLineNumber) {
			return false;
		}

		// These ranges must intersect
		return true;
	}

	public getMatchedCommentAction(commentRange: Range | undefined): MergedCommentRangeActions[] {
		if (commentRange === undefined) {
			const foundInfos = this._infos?.filter(info => info.commentingRanges.fileComments);
			if (foundInfos) {
				return foundInfos.map(foundInfo => {
					return {
						action: {
							ownerId: foundInfo.uniqueOwner,
							extensionId: foundInfo.extensionId,
							label: foundInfo.label,
							commentingRangesInfo: foundInfo.commentingRanges
						}
					};
				});
			}
			return [];
		}

		// keys is ownerId
		const foundHoverActions = new Map<string, { range: Range; action: CommentRangeAction }>();
		for (const decoration of this.commentingRangeDecorations) {
			const range = decoration.getActiveRange();
			if (range && this.areRangesIntersectingOrTouchingByLine(range, commentRange)) {
				// We can have several commenting ranges that match from the same uniqueOwner because of how
				// the line hover and selection decoration is done.
				// The ranges must be merged so that we can see if the new commentRange fits within them.
				const action = decoration.getCommentAction();
				const alreadyFoundInfo = foundHoverActions.get(action.ownerId);
				if (alreadyFoundInfo?.action.commentingRangesInfo === action.commentingRangesInfo) {
					// Merge ranges.
					const newRange = new Range(
						range.startLineNumber < alreadyFoundInfo.range.startLineNumber ? range.startLineNumber : alreadyFoundInfo.range.startLineNumber,
						range.startColumn < alreadyFoundInfo.range.startColumn ? range.startColumn : alreadyFoundInfo.range.startColumn,
						range.endLineNumber > alreadyFoundInfo.range.endLineNumber ? range.endLineNumber : alreadyFoundInfo.range.endLineNumber,
						range.endColumn > alreadyFoundInfo.range.endColumn ? range.endColumn : alreadyFoundInfo.range.endColumn
					);
					foundHoverActions.set(action.ownerId, { range: newRange, action });
				} else {
					foundHoverActions.set(action.ownerId, { range, action });
				}
			}
		}

		const seenOwners = new Set<string>();
		return Array.from(foundHoverActions.values()).filter(action => {
			if (seenOwners.has(action.action.ownerId)) {
				return false;
			} else {
				seenOwners.add(action.action.ownerId);
				return true;
			}
		});
	}

	public getNearestCommentingRange(findPosition: Position, reverse?: boolean): Range | undefined {
		let findPositionContainedWithin: Range | undefined;
		let decorations: CommentingRangeDecoration[];
		if (reverse) {
			decorations = [];
			for (let i = this.commentingRangeDecorations.length - 1; i >= 0; i--) {
				decorations.push(this.commentingRangeDecorations[i]);
			}
		} else {
			decorations = this.commentingRangeDecorations;
		}
		for (const decoration of decorations) {
			const range = decoration.getActiveRange();
			if (!range) {
				continue;
			}

			if (findPositionContainedWithin && this.areRangesIntersectingOrTouchingByLine(range, findPositionContainedWithin)) {
				findPositionContainedWithin = Range.plusRange(findPositionContainedWithin, range);
				continue;
			}

			if (range.startLineNumber <= findPosition.lineNumber && findPosition.lineNumber <= range.endLineNumber) {
				findPositionContainedWithin = new Range(range.startLineNumber, range.startColumn, range.endLineNumber, range.endColumn);
				continue;
			}

			if (!reverse && range.endLineNumber < findPosition.lineNumber) {
				continue;
			}

			if (reverse && range.startLineNumber > findPosition.lineNumber) {
				continue;
			}

			return range;
		}
		return (decorations.length > 0 ? (decorations[0].getActiveRange() ?? undefined) : undefined);
	}

	public dispose(): void {
		this.commentingRangeDecorations = [];
	}
}

/**
* Navigate to the next or previous comment in the current thread.
* @param type
*/
export function moveToNextCommentInThread(commentInfo: { thread: languages.CommentThread<IRange>; comment?: languages.Comment } | undefined, type: 'next' | 'previous') {
	if (!commentInfo?.comment || !commentInfo?.thread?.comments) {
		return;
	}
	const currentIndex = commentInfo.thread.comments?.indexOf(commentInfo.comment);
	if (currentIndex === undefined || currentIndex < 0) {
		return;
	}
	if (type === 'previous' && currentIndex === 0) {
		return;
	}
	if (type === 'next' && currentIndex === commentInfo.thread.comments.length - 1) {
		return;
	}
	const comment = commentInfo.thread.comments?.[type === 'previous' ? currentIndex - 1 : currentIndex + 1];
	if (!comment) {
		return;
	}
	return {
		...commentInfo,
		comment,
	};
}

export function revealCommentThread(commentService: ICommentService, editorService: IEditorService, uriIdentityService: IUriIdentityService,
	commentThread: languages.CommentThread<IRange>, comment: languages.Comment | undefined, focusReply?: boolean, pinned?: boolean, preserveFocus?: boolean, sideBySide?: boolean): void {
	if (!commentThread.resource) {
		return;
	}
	if (!commentService.isCommentingEnabled) {
		commentService.enableCommenting(true);
	}

	const range = commentThread.range;
	const focus = focusReply ? CommentWidgetFocus.Editor : (preserveFocus ? CommentWidgetFocus.None : CommentWidgetFocus.Widget);

	const activeEditor = editorService.activeTextEditorControl;
	// If the active editor is a diff editor where one of the sides has the comment,
	// then we try to reveal the comment in the diff editor.
	const currentActiveResources: IEditor[] = isDiffEditor(activeEditor) ? [activeEditor.getOriginalEditor(), activeEditor.getModifiedEditor()]
		: (activeEditor ? [activeEditor] : []);
	const threadToReveal = commentThread.threadId;
	const commentToReveal = comment?.uniqueIdInThread;
	const resource = URI.parse(commentThread.resource);

	for (const editor of currentActiveResources) {
		const model = editor.getModel();
		if ((model instanceof TextModel) && uriIdentityService.extUri.isEqual(resource, model.uri)) {

			if (threadToReveal && isCodeEditor(editor)) {
				const controller = CommentController.get(editor);
				controller?.revealCommentThread(threadToReveal, commentToReveal, true, focus);
			}
			return;
		}
	}

	editorService.openEditor({
		resource,
		options: {
			pinned: pinned,
			preserveFocus: preserveFocus,
			selection: range ?? new Range(1, 1, 1, 1)
		}
	}, sideBySide ? SIDE_GROUP : ACTIVE_GROUP).then(editor => {
		if (editor) {
			const control = editor.getControl();
			if (threadToReveal && isCodeEditor(control)) {
				const controller = CommentController.get(control);
				controller?.revealCommentThread(threadToReveal, commentToReveal, true, focus);
			}
		}
	});
}

export class CommentController implements IEditorContribution {
	private readonly globalToDispose = new DisposableStore();
	private readonly localToDispose = new DisposableStore();
	private editor: ICodeEditor | undefined;
	private _commentWidgets: ReviewZoneWidget[];
	private _commentInfos: ICommentInfo[];
	private _commentingRangeDecorator!: CommentingRangeDecorator;
	private _commentThreadRangeDecorator!: CommentThreadRangeDecorator;
	private mouseDownInfo: { lineNumber: number } | null = null;
	private _commentingRangeSpaceReserved = false;
	private _commentingRangeAmountReserved = 0;
	private _computePromise: CancelablePromise<Array<ICommentInfo | null>> | null;
	private _computeAndSetPromise: Promise<void> | undefined;
	private _addInProgress!: boolean;
	private _emptyThreadsToAddQueue: [Range | undefined, IEditorMouseEvent | undefined][] = [];
	private _computeCommentingRangeScheduler!: Delayer<Array<ICommentInfo | null>> | null;
	private _pendingNewCommentCache: { [key: string]: { [key: string]: languages.PendingComment } };
	private _pendingEditsCache: { [key: string]: { [key: string]: { [key: number]: languages.PendingComment } } }; // uniqueOwner -> threadId -> uniqueIdInThread -> pending comment
	private _inProcessContinueOnComments: Map<string, languages.PendingCommentThread[]> = new Map();
	private _editorDisposables: IDisposable[] = [];
	private _activeCursorHasCommentingRange: IContextKey<boolean>;
	private _activeCursorHasComment: IContextKey<boolean>;
	private _activeEditorHasCommentingRange: IContextKey<boolean>;
	private _hasRespondedToEditorChange: boolean = false;

	constructor(
		editor: ICodeEditor,
		@ICommentService private readonly commentService: ICommentService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@ICodeEditorService private readonly codeEditorService: ICodeEditorService,
		@IContextMenuService private readonly contextMenuService: IContextMenuService,
		@IQuickInputService private readonly quickInputService: IQuickInputService,
		@IViewsService private readonly viewsService: IViewsService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IEditorService private readonly editorService: IEditorService,
		@IKeybindingService private readonly keybindingService: IKeybindingService,
		@IAccessibilityService private readonly accessibilityService: IAccessibilityService,
		@INotificationService private readonly notificationService: INotificationService
	) {
		this._commentInfos = [];
		this._commentWidgets = [];
		this._pendingNewCommentCache = {};
		this._pendingEditsCache = {};
		this._computePromise = null;
		this._activeCursorHasCommentingRange = CommentContextKeys.activeCursorHasCommentingRange.bindTo(contextKeyService);
		this._activeCursorHasComment = CommentContextKeys.activeCursorHasComment.bindTo(contextKeyService);
		this._activeEditorHasCommentingRange = CommentContextKeys.activeEditorHasCommentingRange.bindTo(contextKeyService);

		if (editor instanceof EmbeddedCodeEditorWidget) {
			return;
		}

		this.editor = editor;

		this._commentingRangeDecorator = new CommentingRangeDecorator();
		this.globalToDispose.add(this._commentingRangeDecorator.onDidChangeDecorationsCount(count => {
			if (count === 0) {
				this.clearEditorListeners();
			} else if (this._editorDisposables.length === 0) {
				this.registerEditorListeners();
			}
		}));

		this.globalToDispose.add(this._commentThreadRangeDecorator = new CommentThreadRangeDecorator(this.commentService));

		this.globalToDispose.add(this.commentService.onDidDeleteDataProvider(ownerId => {
			if (ownerId) {
				delete this._pendingNewCommentCache[ownerId];
				delete this._pendingEditsCache[ownerId];
			} else {
				this._pendingNewCommentCache = {};
				this._pendingEditsCache = {};
			}
			this.beginCompute();
		}));
		this.globalToDispose.add(this.commentService.onDidSetDataProvider(_ => this.beginComputeAndHandleEditorChange()));
		this.globalToDispose.add(this.commentService.onDidUpdateCommentingRanges(_ => this.beginComputeAndHandleEditorChange()));

		this.globalToDispose.add(this.commentService.onDidSetResourceCommentInfos(async e => {
			const editorURI = this.editor && this.editor.hasModel() && this.editor.getModel().uri;
			if (editorURI && editorURI.toString() === e.resource.toString()) {
				await this.setComments(e.commentInfos.filter(commentInfo => commentInfo !== null));
			}
		}));

		this.globalToDispose.add(this.commentService.onDidChangeCommentingEnabled(e => {
			if (e) {
				this.registerEditorListeners();
				this.beginCompute();
			} else {
				this.tryUpdateReservedSpace();
				this.clearEditorListeners();
				this._commentingRangeDecorator.update(this.editor, []);
				this._commentThreadRangeDecorator.update(this.editor, []);
				dispose(this._commentWidgets);
				this._commentWidgets = [];
			}
		}));

		this.globalToDispose.add(this.editor.onWillChangeModel(e => this.onWillChangeModel(e)));
		this.globalToDispose.add(this.editor.onDidChangeModel(_ => this.onModelChanged()));
		this.globalToDispose.add(this.configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('diffEditor.renderSideBySide')) {
				this.beginCompute();
			}
		}));

		this.onModelChanged();
		this.globalToDispose.add(this.codeEditorService.registerDecorationType('comment-controller', COMMENTEDITOR_DECORATION_KEY, {}));
		this.globalToDispose.add(
			this.commentService.registerContinueOnCommentProvider({
				provideContinueOnComments: () => {
					const pendingComments: languages.PendingCommentThread[] = [];
					if (this._commentWidgets) {
						for (const zone of this._commentWidgets) {
							const zonePendingComments = zone.getPendingComments();
							const pendingNewComment = zonePendingComments.newComment;
							if (!pendingNewComment) {
								continue;
							}
							let lastCommentBody;
							if (zone.commentThread.comments && zone.commentThread.comments.length) {
								const lastComment = zone.commentThread.comments[zone.commentThread.comments.length - 1];
								if (typeof lastComment.body === 'string') {
									lastCommentBody = lastComment.body;
								} else {
									lastCommentBody = lastComment.body.value;
								}
							}

							if (pendingNewComment.body !== lastCommentBody) {
								pendingComments.push({
									uniqueOwner: zone.uniqueOwner,
									uri: zone.editor.getModel()!.uri,
									range: zone.commentThread.range,
									comment: pendingNewComment,
									isReply: (zone.commentThread.comments !== undefined) && (zone.commentThread.comments.length > 0)
								});
							}
						}
					}
					return pendingComments;
				}
			})
		);

	}

	private registerEditorListeners() {
		this._editorDisposables = [];
		if (!this.editor) {
			return;
		}
		this._editorDisposables.push(this.editor.onMouseMove(e => this.onEditorMouseMove(e)));
		this._editorDisposables.push(this.editor.onMouseLeave(() => this.onEditorMouseLeave()));
		this._editorDisposables.push(this.editor.onDidChangeCursorPosition(e => this.onEditorChangeCursorPosition(e.position)));
		this._editorDisposables.push(this.editor.onDidFocusEditorWidget(() => this.onEditorChangeCursorPosition(this.editor?.getPosition() ?? null)));
		this._editorDisposables.push(this.editor.onDidChangeCursorSelection(e => this.onEditorChangeCursorSelection(e)));
		this._editorDisposables.push(this.editor.onDidBlurEditorWidget(() => this.onEditorChangeCursorSelection()));
	}

	private clearEditorListeners() {
		dispose(this._editorDisposables);
		this._editorDisposables = [];
	}

	private onEditorMouseLeave() {
		this._commentingRangeDecorator.updateHover();
	}

	private onEditorMouseMove(e: IEditorMouseEvent): void {
		const position = e.target.position?.lineNumber;
		if (e.event.leftButton.valueOf() && position && this.mouseDownInfo) {
			this._commentingRangeDecorator.updateSelection(position, new Range(this.mouseDownInfo.lineNumber, 1, position, 1));
		} else {
			this._commentingRangeDecorator.updateHover(position);
		}
	}

	private onEditorChangeCursorSelection(e?: ICursorSelectionChangedEvent): void {
		const position = this.editor?.getPosition()?.lineNumber;
		if (position) {
			this._commentingRangeDecorator.updateSelection(position, e?.selection);
		}
	}

	private onEditorChangeCursorPosition(e: Position | null) {
		if (!e) {
			return;
		}
		const range = Range.fromPositions(e, { column: -1, lineNumber: e.lineNumber });
		const decorations = this.editor?.getDecorationsInRange(range);
		let hasCommentingRange = false;
		if (decorations) {
			for (const decoration of decorations) {
				if (decoration.options.description === CommentGlyphWidget.description) {
					// We don't allow multiple comments on the same line.
					hasCommentingRange = false;
					break;
				} else if (decoration.options.description === CommentingRangeDecorator.description) {
					hasCommentingRange = true;
				}
			}
		}
		this._activeCursorHasCommentingRange.set(hasCommentingRange);
		this._activeCursorHasComment.set(this.getCommentsAtLine(range).length > 0);
	}

	private isEditorInlineOriginal(testEditor: ICodeEditor): boolean {
		if (this.configurationService.getValue<boolean>('diffEditor.renderSideBySide')) {
			return false;
		}

		const foundEditor = this.editorService.visibleTextEditorControls.find(editor => {
			if (editor.getEditorType() === EditorType.IDiffEditor) {
				const diffEditor = editor as IDiffEditor;
				return diffEditor.getOriginalEditor() === testEditor;
			}
			return false;
		});
		return !!foundEditor;
	}

	private beginCompute(): Promise<void> {
		this._computePromise = createCancelablePromise(token => {
			const editorURI = this.editor && this.editor.hasModel() && this.editor.getModel().uri;

			if (editorURI) {
				return this.commentService.getDocumentComments(editorURI);
			}

			return Promise.resolve([]);
		});

		this._computeAndSetPromise = this._computePromise.then(async commentInfos => {
			await this.setComments(coalesce(commentInfos));
			this._computePromise = null;
		}, error => console.log(error));
		this._computePromise.then(() => this._computeAndSetPromise = undefined);
		return this._computeAndSetPromise;
	}

	private beginComputeCommentingRanges() {
		if (this._computeCommentingRangeScheduler) {
			this._computeCommentingRangeScheduler.trigger(() => {
				const editorURI = this.editor && this.editor.hasModel() && this.editor.getModel().uri;

				if (editorURI) {
					return this.commentService.getDocumentComments(editorURI);
				}

				return Promise.resolve([]);
			}).then(commentInfos => {
				if (this.commentService.isCommentingEnabled) {
					const meaningfulCommentInfos = coalesce(commentInfos);
					this._commentingRangeDecorator.update(this.editor, meaningfulCommentInfos, this.editor?.getPosition()?.lineNumber, this.editor?.getSelection() ?? undefined);
				}
			}, (err) => {
				onUnexpectedError(err);
				return null;
			});
		}
	}

	public static get(editor: ICodeEditor): CommentController | null {
		return editor.getContribution<CommentController>(ID);
	}

	public revealCommentThread(threadId: string, commentUniqueId: number | undefined, fetchOnceIfNotExist: boolean, focus: CommentWidgetFocus): void {
		const commentThreadWidget = this._commentWidgets.filter(widget => widget.commentThread.threadId === threadId);
		if (commentThreadWidget.length === 1) {
			commentThreadWidget[0].reveal(commentUniqueId, focus);
		} else if (fetchOnceIfNotExist) {
			if (this._computeAndSetPromise) {
				this._computeAndSetPromise.then(_ => {
					this.revealCommentThread(threadId, commentUniqueId, false, focus);
				});
			} else {
				this.beginCompute().then(_ => {
					this.revealCommentThread(threadId, commentUniqueId, false, focus);
				});
			}
		}
	}

	public collapseAll(): void {
		for (const widget of this._commentWidgets) {
			widget.collapse(true);
		}
	}

	public expandAll(): void {
		for (const widget of this._commentWidgets) {
			widget.expand();
		}
	}

	public expandUnresolved(): void {
		for (const widget of this._commentWidgets) {
			if (widget.commentThread.state === languages.CommentThreadState.Unresolved) {
				widget.expand();
			}
		}
	}

	public nextCommentThread(focusThread: boolean): void {
		this._findNearestCommentThread(focusThread);
	}

	private _findNearestCommentThread(focusThread: boolean, reverse?: boolean): void {
		if (!this._commentWidgets.length || !this.editor?.hasModel()) {
			return;
		}

		const after = reverse ? this.editor.getSelection().getStartPosition() : this.editor.getSelection().getEndPosition();
		const sortedWidgets = this._commentWidgets.sort((a, b) => {
			if (reverse) {
				const temp = a;
				a = b;
				b = temp;
			}
			if (a.commentThread.range === undefined) {
				return -1;
			}
			if (b.commentThread.range === undefined) {
				return 1;
			}
			if (a.commentThread.range.startLineNumber < b.commentThread.range.startLineNumber) {
				return -1;
			}

			if (a.commentThread.range.startLineNumber > b.commentThread.range.startLineNumber) {
				return 1;
			}

			if (a.commentThread.range.startColumn < b.commentThread.range.startColumn) {
				return -1;
			}

			if (a.commentThread.range.startColumn > b.commentThread.range.startColumn) {
				return 1;
			}

			return 0;
		});

		const idx = findFirstIdxMonotonousOrArrLen(sortedWidgets, widget => {
			const lineValueOne = reverse ? after.lineNumber : (widget.commentThread.range?.startLineNumber ?? 0);
			const lineValueTwo = reverse ? (widget.commentThread.range?.startLineNumber ?? 0) : after.lineNumber;
			const columnValueOne = reverse ? after.column : (widget.commentThread.range?.startColumn ?? 0);
			const columnValueTwo = reverse ? (widget.commentThread.range?.startColumn ?? 0) : after.column;
			if (lineValueOne > lineValueTwo) {
				return true;
			}

			if (lineValueOne < lineValueTwo) {
				return false;
			}

			if (columnValueOne > columnValueTwo) {
				return true;
			}
			return false;
		});

		const nextWidget: ReviewZoneWidget | undefined = sortedWidgets[idx];
		if (nextWidget !== undefined) {
			this.editor.setSelection(nextWidget.commentThread.range ?? new Range(1, 1, 1, 1));
			nextWidget.reveal(undefined, focusThread ? CommentWidgetFocus.Widget : CommentWidgetFocus.None);
		}
	}

	public previousCommentThread(focusThread: boolean): void {
		this._findNearestCommentThread(focusThread, true);
	}

	private _findNearestCommentingRange(reverse?: boolean): void {
		if (!this.editor?.hasModel()) {
			return;
		}

		const after = this.editor.getSelection().getEndPosition();
		const range = this._commentingRangeDecorator.getNearestCommentingRange(after, reverse);
		if (range) {
			const position = reverse ? range.getEndPosition() : range.getStartPosition();
			this.editor.setPosition(position);
			this.editor.revealLineInCenterIfOutsideViewport(position.lineNumber);
		}
		if (this.accessibilityService.isScreenReaderOptimized()) {
			const commentRangeStart = range?.getStartPosition().lineNumber;
			const commentRangeEnd = range?.getEndPosition().lineNumber;
			if (commentRangeStart && commentRangeEnd) {
				const oneLine = commentRangeStart === commentRangeEnd;
				oneLine ? status(nls.localize('commentRange', "Line {0}", commentRangeStart)) : status(nls.localize('commentRangeStart', "Lines {0} to {1}", commentRangeStart, commentRangeEnd));
			}
		}
	}

	public nextCommentingRange(): void {
		this._findNearestCommentingRange();
	}

	public previousCommentingRange(): void {
		this._findNearestCommentingRange(true);
	}

	public dispose(): void {
		this.globalToDispose.dispose();
		this.localToDispose.dispose();
		dispose(this._editorDisposables);
		dispose(this._commentWidgets);

		this.editor = null!; // Strict null override - nulling out in dispose
	}

	private onWillChangeModel(e: IModelChangedEvent): void {
		if (e.newModelUrl) {
			this.tryUpdateReservedSpace(e.newModelUrl);
		}
	}

	private async handleCommentAdded(editorId: string | undefined, uniqueOwner: string, thread: languages.AddedCommentThread): Promise<void> {
		const matchedZones = this._commentWidgets.filter(zoneWidget => zoneWidget.uniqueOwner === uniqueOwner && zoneWidget.commentThread.threadId === thread.threadId);
		if (matchedZones.length) {
			return;
		}

		const matchedNewCommentThreadZones = this._commentWidgets.filter(zoneWidget => zoneWidget.uniqueOwner === uniqueOwner && zoneWidget.commentThread.commentThreadHandle === -1 && Range.equalsRange(zoneWidget.commentThread.range, thread.range));

		if (matchedNewCommentThreadZones.length) {
			matchedNewCommentThreadZones[0].update(thread);
			return;
		}

		const continueOnCommentIndex = this._inProcessContinueOnComments.get(uniqueOwner)?.findIndex(pending => {
			if (pending.range === undefined) {
				return thread.range === undefined;
			} else {
				return Range.lift(pending.range).equalsRange(thread.range);
			}
		});
		let continueOnCommentText: string | undefined;
		if ((continueOnCommentIndex !== undefined) && continueOnCommentIndex >= 0) {
			continueOnCommentText = this._inProcessContinueOnComments.get(uniqueOwner)?.splice(continueOnCommentIndex, 1)[0].comment.body;
		}

		const pendingCommentText = (this._pendingNewCommentCache[uniqueOwner] && this._pendingNewCommentCache[uniqueOwner][thread.threadId])
			?? continueOnCommentText;
		const pendingEdits = this._pendingEditsCache[uniqueOwner] && this._pendingEditsCache[uniqueOwner][thread.threadId];
		const shouldReveal = thread.canReply && thread.isTemplate && (!thread.comments || (thread.comments.length === 0)) && (!thread.editorId || (thread.editorId === editorId));
		await this.displayCommentThread(uniqueOwner, thread, shouldReveal, pendingCommentText, pendingEdits);
		this._commentInfos.filter(info => info.uniqueOwner === uniqueOwner)[0].threads.push(thread);
		this.tryUpdateReservedSpace();
	}

	public onModelChanged(): void {
		this.localToDispose.clear();
		this.tryUpdateReservedSpace();

		this.removeCommentWidgetsAndStoreCache();
		if (!this.editor) {
			return;
		}

		this._hasRespondedToEditorChange = false;

		this.localToDispose.add(this.editor.onMouseDown(e => this.onEditorMouseDown(e)));
		this.localToDispose.add(this.editor.onMouseUp(e => this.onEditorMouseUp(e)));
		if (this._editorDisposables.length) {
			this.clearEditorListeners();
			this.registerEditorListeners();
		}

		this._computeCommentingRangeScheduler = new Delayer<ICommentInfo[]>(200);
		this.localToDispose.add({
			dispose: () => {
				this._computeCommentingRangeScheduler?.cancel();
				this._computeCommentingRangeScheduler = null;
			}
		});
		this.localToDispose.add(this.editor.onDidChangeModelContent(async () => {
			this.beginComputeCommentingRanges();
		}));
		this.localToDispose.add(this.commentService.onDidUpdateCommentThreads(async e => {
			const editorURI = this.editor && this.editor.hasModel() && this.editor.getModel().uri;
			if (!editorURI || !this.commentService.isCommentingEnabled) {
				return;
			}

			if (this._computePromise) {
				await this._computePromise;
			}

			const commentInfo = this._commentInfos.filter(info => info.uniqueOwner === e.uniqueOwner);
			if (!commentInfo || !commentInfo.length) {
				return;
			}

			const added = e.added.filter(thread => thread.resource && thread.resource === editorURI.toString());
			const removed = e.removed.filter(thread => thread.resource && thread.resource === editorURI.toString());
			const changed = e.changed.filter(thread => thread.resource && thread.resource === editorURI.toString());
			const pending = e.pending.filter(pending => pending.uri.toString() === editorURI.toString());

			removed.forEach(thread => {
				const matchedZones = this._commentWidgets.filter(zoneWidget => zoneWidget.uniqueOwner === e.uniqueOwner && zoneWidget.commentThread.threadId === thread.threadId && zoneWidget.commentThread.threadId !== '');
				if (matchedZones.length) {
					const matchedZone = matchedZones[0];
					const index = this._commentWidgets.indexOf(matchedZone);
					this._commentWidgets.splice(index, 1);
					matchedZone.dispose();
				}
				const infosThreads = this._commentInfos.filter(info => info.uniqueOwner === e.uniqueOwner)[0].threads;
				for (let i = 0; i < infosThreads.length; i++) {
					if (infosThreads[i] === thread) {
						infosThreads.splice(i, 1);
						i--;
					}
				}
			});

			for (const thread of changed) {
				const matchedZones = this._commentWidgets.filter(zoneWidget => zoneWidget.uniqueOwner === e.uniqueOwner && zoneWidget.commentThread.threadId === thread.threadId);
				if (matchedZones.length) {
					const matchedZone = matchedZones[0];
					matchedZone.update(thread);
					this.openCommentsView(thread);
				}
			}
			const editorId = this.editor?.getId();
			for (const thread of added) {
				await this.handleCommentAdded(editorId, e.uniqueOwner, thread);
			}

			for (const thread of pending) {
				await this.resumePendingComment(editorURI, thread);
			}
			this._commentThreadRangeDecorator.update(this.editor, commentInfo);
		}));

		this.beginComputeAndHandleEditorChange();
	}

	private async resumePendingComment(editorURI: URI, thread: languages.PendingCommentThread) {
		const matchedZones = this._commentWidgets.filter(zoneWidget => zoneWidget.uniqueOwner === thread.uniqueOwner && Range.lift(zoneWidget.commentThread.range)?.equalsRange(thread.range));
		if (thread.isReply && matchedZones.length) {
			this.commentService.removeContinueOnComment({ uniqueOwner: thread.uniqueOwner, uri: editorURI, range: thread.range, isReply: true });
			matchedZones[0].setPendingComment(thread.comment);
		} else if (matchedZones.length) {
			this.commentService.removeContinueOnComment({ uniqueOwner: thread.uniqueOwner, uri: editorURI, range: thread.range, isReply: false });
			const existingPendingComment = matchedZones[0].getPendingComments().newComment;
			// We need to try to reconcile the existing pending comment with the incoming pending comment
			let pendingComment: languages.PendingComment;
			if (!existingPendingComment || thread.comment.body.includes(existingPendingComment.body)) {
				pendingComment = thread.comment;
			} else if (existingPendingComment.body.includes(thread.comment.body)) {
				pendingComment = existingPendingComment;
			} else {
				pendingComment = { body: `${existingPendingComment}\n${thread.comment.body}`, cursor: thread.comment.cursor };
			}
			matchedZones[0].setPendingComment(pendingComment);
		} else if (!thread.isReply) {
			const threadStillAvailable = this.commentService.removeContinueOnComment({ uniqueOwner: thread.uniqueOwner, uri: editorURI, range: thread.range, isReply: false });
			if (!threadStillAvailable) {
				return;
			}
			if (!this._inProcessContinueOnComments.has(thread.uniqueOwner)) {
				this._inProcessContinueOnComments.set(thread.uniqueOwner, []);
			}
			this._inProcessContinueOnComments.get(thread.uniqueOwner)?.push(thread);
			await this.commentService.createCommentThreadTemplate(thread.uniqueOwner, thread.uri, thread.range ? Range.lift(thread.range) : undefined);
		}
	}

	private beginComputeAndHandleEditorChange(): void {
		this.beginCompute().then(() => {
			if (!this._hasRespondedToEditorChange) {
				if (this._commentInfos.some(commentInfo => commentInfo.commentingRanges.ranges.length > 0 || commentInfo.commentingRanges.fileComments)) {
					this._hasRespondedToEditorChange = true;
					const verbose = this.configurationService.getValue(AccessibilityVerbositySettingId.Comments);
					if (verbose) {
						const keybinding = this.keybindingService.lookupKeybinding(AccessibilityCommandId.OpenAccessibilityHelp)?.getAriaLabel();
						if (keybinding) {
							status(nls.localize('hasCommentRangesKb', "Editor has commenting ranges, run the command Open Accessibility Help ({0}), for more information.", keybinding));
						} else {
							status(nls.localize('hasCommentRangesNoKb', "Editor has commenting ranges, run the command Open Accessibility Help, which is currently not triggerable via keybinding, for more information."));
						}
					} else {
						status(nls.localize('hasCommentRanges', "Editor has commenting ranges."));
					}
				}
			}
		});
	}

	private async openCommentsView(thread: languages.CommentThread) {
		if (thread.comments && (thread.comments.length > 0) && threadHasMeaningfulComments(thread)) {
			const openViewState = this.configurationService.getValue<ICommentsConfiguration>(COMMENTS_SECTION).openView;
			if (openViewState === 'file') {
				return this.viewsService.openView(COMMENTS_VIEW_ID);
			} else if (openViewState === 'firstFile' || (openViewState === 'firstFileUnresolved' && thread.state === languages.CommentThreadState.Unresolved)) {
				const hasShownView = this.viewsService.getViewWithId<CommentsPanel>(COMMENTS_VIEW_ID)?.hasRendered;
				if (!hasShownView) {
					return this.viewsService.openView(COMMENTS_VIEW_ID);
				}
			}
		}
		return undefined;
	}

	private async displayCommentThread(uniqueOwner: string, thread: languages.CommentThread, shouldReveal: boolean, pendingComment: languages.PendingComment | undefined, pendingEdits: { [key: number]: languages.PendingComment } | undefined): Promise<void> {
		const editor = this.editor?.getModel();
		if (!editor) {
			return;
		}
		if (!this.editor || this.isEditorInlineOriginal(this.editor)) {
			return;
		}

		let continueOnCommentReply: languages.PendingCommentThread | undefined;
		if (thread.range && !pendingComment) {
			continueOnCommentReply = this.commentService.removeContinueOnComment({ uniqueOwner, uri: editor.uri, range: thread.range, isReply: true });
		}
		const zoneWidget = this.instantiationService.createInstance(ReviewZoneWidget, this.editor, uniqueOwner, thread, pendingComment ?? continueOnCommentReply?.comment, pendingEdits);
		await zoneWidget.display(thread.range, shouldReveal);
		this._commentWidgets.push(zoneWidget);
		this.openCommentsView(thread);
	}

	private onEditorMouseDown(e: IEditorMouseEvent): void {
		this.mouseDownInfo = (e.target.element?.className.indexOf('comment-range-glyph') ?? -1) >= 0 ? parseMouseDownInfoFromEvent(e) : null;
	}

	private onEditorMouseUp(e: IEditorMouseEvent): void {
		const matchedLineNumber = isMouseUpEventDragFromMouseDown(this.mouseDownInfo, e);
		this.mouseDownInfo = null;

		if (!this.editor || matchedLineNumber === null || !e.target.element) {
			return;
		}
		const mouseUpIsOnDecorator = (e.target.element.className.indexOf('comment-range-glyph') >= 0);

		const lineNumber = e.target.position!.lineNumber;
		let range: Range | undefined;
		let selection: Range | null | undefined;
		// Check for drag along gutter decoration
		if ((matchedLineNumber !== lineNumber)) {
			if (matchedLineNumber > lineNumber) {
				selection = new Range(matchedLineNumber, this.editor.getModel()!.getLineLength(matchedLineNumber) + 1, lineNumber, 1);
			} else {
				selection = new Range(matchedLineNumber, 1, lineNumber, this.editor.getModel()!.getLineLength(lineNumber) + 1);
			}
		} else if (mouseUpIsOnDecorator) {
			selection = this.editor.getSelection();
		}

		// Check for selection at line number.
		if (selection && (selection.startLineNumber <= lineNumber) && (lineNumber <= selection.endLineNumber)) {
			range = selection;
			this.editor.setSelection(new Range(selection.endLineNumber, 1, selection.endLineNumber, 1));
		} else if (mouseUpIsOnDecorator) {
			range = new Range(lineNumber, 1, lineNumber, 1);
		}

		if (range) {
			this.addOrToggleCommentAtLine(range, e);
		}
	}

	public getCommentsAtLine(commentRange: Range | undefined): ReviewZoneWidget[] {
		return this._commentWidgets.filter(widget => widget.getGlyphPosition() === (commentRange ? commentRange.endLineNumber : 0));
	}

	public async addOrToggleCommentAtLine(commentRange: Range | undefined, e: IEditorMouseEvent | undefined): Promise<void> {
		// If an add is already in progress, queue the next add and process it after the current one finishes to
		// prevent empty comment threads from being added to the same line.
		if (!this._addInProgress) {
			this._addInProgress = true;
			// The widget's position is undefined until the widget has been displayed, so rely on the glyph position instead
			const existingCommentsAtLine = this.getCommentsAtLine(commentRange);
			if (existingCommentsAtLine.length) {
				const allExpanded = existingCommentsAtLine.every(widget => widget.expanded);
				existingCommentsAtLine.forEach(allExpanded ? widget => widget.collapse(true) : widget => widget.expand(true));
				this.processNextThreadToAdd();
				return;
			} else {
				this.addCommentAtLine(commentRange, e);
			}
		} else {
			this._emptyThreadsToAddQueue.push([commentRange, e]);
		}
	}

	private processNextThreadToAdd(): void {
		this._addInProgress = false;
		const info = this._emptyThreadsToAddQueue.shift();
		if (info) {
			this.addOrToggleCommentAtLine(info[0], info[1]);
		}
	}

	private clipUserRangeToCommentRange(userRange: Range, commentRange: Range): Range {
		if (userRange.startLineNumber < commentRange.startLineNumber) {
			userRange = new Range(commentRange.startLineNumber, commentRange.startColumn, userRange.endLineNumber, userRange.endColumn);
		}
		if (userRange.endLineNumber > commentRange.endLineNumber) {
			userRange = new Range(userRange.startLineNumber, userRange.startColumn, commentRange.endLineNumber, commentRange.endColumn);
		}
		return userRange;
	}

	public addCommentAtLine(range: Range | undefined, e: IEditorMouseEvent | undefined): Promise<void> {
		const newCommentInfos = this._commentingRangeDecorator.getMatchedCommentAction(range);
		if (!newCommentInfos.length || !this.editor?.hasModel()) {
			this._addInProgress = false;
			if (!newCommentInfos.length) {
				if (range) {
					this.notificationService.error(nls.localize('comments.addCommand.error', "The cursor must be within a commenting range to add a comment."));
				} else {
					this.notificationService.error(nls.localize('comments.addFileCommentCommand.error', "File comments are not allowed on this file."));
				}
			}
			return Promise.resolve();
		}

		if (newCommentInfos.length > 1) {
			if (e && range) {
				this.contextMenuService.showContextMenu({
					getAnchor: () => e.event,
					getActions: () => this.getContextMenuActions(newCommentInfos, range),
					getActionsContext: () => newCommentInfos.length ? newCommentInfos[0] : undefined,
					onHide: () => { this._addInProgress = false; }
				});

				return Promise.resolve();
			} else {
				const picks = this.getCommentProvidersQuickPicks(newCommentInfos);
				return this.quickInputService.pick(picks, { placeHolder: nls.localize('pickCommentService', "Select Comment Provider"), matchOnDescription: true }).then(pick => {
					if (!pick) {
						return;
					}

					const commentInfos = newCommentInfos.filter(info => info.action.ownerId === pick.id);

					if (commentInfos.length) {
						const { ownerId } = commentInfos[0].action;
						const clippedRange = range && commentInfos[0].range ? this.clipUserRangeToCommentRange(range, commentInfos[0].range) : range;
						this.addCommentAtLine2(clippedRange, ownerId);
					}
				}).then(() => {
					this._addInProgress = false;
				});
			}
		} else {
			const { ownerId } = newCommentInfos[0].action;
			const clippedRange = range && newCommentInfos[0].range ? this.clipUserRangeToCommentRange(range, newCommentInfos[0].range) : range;
			this.addCommentAtLine2(clippedRange, ownerId);
		}

		return Promise.resolve();
	}

	private getCommentProvidersQuickPicks(commentInfos: MergedCommentRangeActions[]) {
		const picks: QuickPickInput[] = commentInfos.map((commentInfo) => {
			const { ownerId, extensionId, label } = commentInfo.action;

			return {
				label: label ?? extensionId ?? ownerId,
				id: ownerId
			} satisfies IQuickPickItem;
		});

		return picks;
	}

	private getContextMenuActions(commentInfos: MergedCommentRangeActions[], commentRange: Range): IAction[] {
		const actions: IAction[] = [];

		commentInfos.forEach(commentInfo => {
			const { ownerId, extensionId, label } = commentInfo.action;

			actions.push(new Action(
				'addCommentThread',
				`${label || extensionId}`,
				undefined,
				true,
				() => {
					const clippedRange = commentInfo.range ? this.clipUserRangeToCommentRange(commentRange, commentInfo.range) : commentRange;
					this.addCommentAtLine2(clippedRange, ownerId);
					return Promise.resolve();
				}
			));
		});
		return actions;
	}

	public addCommentAtLine2(range: Range | undefined, ownerId: string) {
		if (!this.editor) {
			return;
		}
		this.commentService.createCommentThreadTemplate(ownerId, this.editor.getModel()!.uri, range, this.editor.getId());
		this.processNextThreadToAdd();
		return;
	}

	private getExistingCommentEditorOptions(editor: ICodeEditor) {
		const lineDecorationsWidth: number = editor.getOption(EditorOption.lineDecorationsWidth);
		let extraEditorClassName: string[] = [];
		const configuredExtraClassName = editor.getRawOptions().extraEditorClassName;
		if (configuredExtraClassName) {
			extraEditorClassName = configuredExtraClassName.split(' ');
		}
		return { lineDecorationsWidth, extraEditorClassName };
	}

	private getWithoutCommentsEditorOptions(editor: ICodeEditor, extraEditorClassName: string[], startingLineDecorationsWidth: number) {
		let lineDecorationsWidth = startingLineDecorationsWidth;
		const inlineCommentPos = extraEditorClassName.findIndex(name => name === 'inline-comment');
		if (inlineCommentPos >= 0) {
			extraEditorClassName.splice(inlineCommentPos, 1);
		}

		const options = editor.getOptions();
		if (options.get(EditorOption.folding) && options.get(EditorOption.showFoldingControls) !== 'never') {
			lineDecorationsWidth += 11; // 11 comes from https://github.com/microsoft/vscode/blob/94ee5f58619d59170983f453fe78f156c0cc73a3/src/vs/workbench/contrib/comments/browser/media/review.css#L485
		}
		lineDecorationsWidth -= 24;
		return { extraEditorClassName, lineDecorationsWidth };
	}

	private getWithCommentsLineDecorationWidth(editor: ICodeEditor, startingLineDecorationsWidth: number) {
		let lineDecorationsWidth = startingLineDecorationsWidth;
		const options = editor.getOptions();
		if (options.get(EditorOption.folding) && options.get(EditorOption.showFoldingControls) !== 'never') {
			lineDecorationsWidth -= 11;
		}
		lineDecorationsWidth += 24;
		this._commentingRangeAmountReserved = lineDecorationsWidth;
		return this._commentingRangeAmountReserved;
	}

	private getWithCommentsEditorOptions(editor: ICodeEditor, extraEditorClassName: string[], startingLineDecorationsWidth: number) {
		extraEditorClassName.push('inline-comment');
		return { lineDecorationsWidth: this.getWithCommentsLineDecorationWidth(editor, startingLineDecorationsWidth), extraEditorClassName };
	}

	private updateEditorLayoutOptions(editor: ICodeEditor, extraEditorClassName: string[], lineDecorationsWidth: number) {
		editor.updateOptions({
			extraEditorClassName: extraEditorClassName.join(' '),
			lineDecorationsWidth: lineDecorationsWidth
		});
	}

	private ensureCommentingRangeReservedAmount(editor: ICodeEditor) {
		const existing = this.getExistingCommentEditorOptions(editor);
		if (existing.lineDecorationsWidth !== this._commentingRangeAmountReserved) {
			editor.updateOptions({
				lineDecorationsWidth: this.getWithCommentsLineDecorationWidth(editor, existing.lineDecorationsWidth)
			});
		}
	}

	private tryUpdateReservedSpace(uri?: URI) {
		if (!this.editor) {
			return;
		}

		const hasCommentsOrRangesInInfo = this._commentInfos.some(info => {
			const hasRanges = Boolean(info.commentingRanges && (Array.isArray(info.commentingRanges) ? info.commentingRanges : info.commentingRanges.ranges).length);
			return hasRanges || (info.threads.length > 0);
		});
		uri = uri ?? this.editor.getModel()?.uri;
		const resourceHasCommentingRanges = uri ? this.commentService.resourceHasCommentingRanges(uri) : false;

		const hasCommentsOrRanges = hasCommentsOrRangesInInfo || resourceHasCommentingRanges;

		if (hasCommentsOrRanges && this.commentService.isCommentingEnabled) {
			if (!this._commentingRangeSpaceReserved) {
				this._commentingRangeSpaceReserved = true;
				const { lineDecorationsWidth, extraEditorClassName } = this.getExistingCommentEditorOptions(this.editor);
				const newOptions = this.getWithCommentsEditorOptions(this.editor, extraEditorClassName, lineDecorationsWidth);
				this.updateEditorLayoutOptions(this.editor, newOptions.extraEditorClassName, newOptions.lineDecorationsWidth);
			} else {
				this.ensureCommentingRangeReservedAmount(this.editor);
			}
		} else if ((!hasCommentsOrRanges || !this.commentService.isCommentingEnabled) && this._commentingRangeSpaceReserved) {
			this._commentingRangeSpaceReserved = false;
			const { lineDecorationsWidth, extraEditorClassName } = this.getExistingCommentEditorOptions(this.editor);
			const newOptions = this.getWithoutCommentsEditorOptions(this.editor, extraEditorClassName, lineDecorationsWidth);
			this.updateEditorLayoutOptions(this.editor, newOptions.extraEditorClassName, newOptions.lineDecorationsWidth);
		}
	}

	private async setComments(commentInfos: ICommentInfo[]): Promise<void> {
		if (!this.editor || !this.commentService.isCommentingEnabled) {
			return;
		}

		this._commentInfos = commentInfos;
		this.tryUpdateReservedSpace();
		// create viewzones
		this.removeCommentWidgetsAndStoreCache();

		let hasCommentingRanges = false;
		for (const info of this._commentInfos) {
			if (!hasCommentingRanges && (info.commentingRanges.ranges.length > 0 || info.commentingRanges.fileComments)) {
				hasCommentingRanges = true;
			}

			const providerCacheStore = this._pendingNewCommentCache[info.uniqueOwner];
			const providerEditsCacheStore = this._pendingEditsCache[info.uniqueOwner];
			info.threads = info.threads.filter(thread => !thread.isDisposed);
			for (const thread of info.threads) {
				let pendingComment: languages.PendingComment | undefined = undefined;
				if (providerCacheStore) {
					pendingComment = providerCacheStore[thread.threadId];
				}

				let pendingEdits: { [key: number]: languages.PendingComment } | undefined = undefined;
				if (providerEditsCacheStore) {
					pendingEdits = providerEditsCacheStore[thread.threadId];
				}

				await this.displayCommentThread(info.uniqueOwner, thread, false, pendingComment, pendingEdits);
			}
			for (const thread of info.pendingCommentThreads ?? []) {
				this.resumePendingComment(this.editor.getModel()!.uri, thread);
			}
		}

		this._commentingRangeDecorator.update(this.editor, this._commentInfos);
		this._commentThreadRangeDecorator.update(this.editor, this._commentInfos);

		if (hasCommentingRanges) {
			this._activeEditorHasCommentingRange.set(true);
		} else {
			this._activeEditorHasCommentingRange.set(false);
		}
	}

	public collapseAndFocusRange(threadId: string): void {
		this._commentWidgets?.find(widget => widget.commentThread.threadId === threadId)?.collapseAndFocusRange();
	}

	private removeCommentWidgetsAndStoreCache() {
		if (this._commentWidgets) {
			this._commentWidgets.forEach(zone => {
				const pendingComments = zone.getPendingComments();
				const pendingNewComment = pendingComments.newComment;
				const providerNewCommentCacheStore = this._pendingNewCommentCache[zone.uniqueOwner];

				let lastCommentBody;
				if (zone.commentThread.comments && zone.commentThread.comments.length) {
					const lastComment = zone.commentThread.comments[zone.commentThread.comments.length - 1];
					if (typeof lastComment.body === 'string') {
						lastCommentBody = lastComment.body;
					} else {
						lastCommentBody = lastComment.body.value;
					}
				}
				if (pendingNewComment && (pendingNewComment.body !== lastCommentBody)) {
					if (!providerNewCommentCacheStore) {
						this._pendingNewCommentCache[zone.uniqueOwner] = {};
					}

					this._pendingNewCommentCache[zone.uniqueOwner][zone.commentThread.threadId] = pendingNewComment;
				} else {
					if (providerNewCommentCacheStore) {
						delete providerNewCommentCacheStore[zone.commentThread.threadId];
					}
				}

				const pendingEdits = pendingComments.edits;
				const providerEditsCacheStore = this._pendingEditsCache[zone.uniqueOwner];
				if (Object.keys(pendingEdits).length > 0) {
					if (!providerEditsCacheStore) {
						this._pendingEditsCache[zone.uniqueOwner] = {};
					}
					this._pendingEditsCache[zone.uniqueOwner][zone.commentThread.threadId] = pendingEdits;
				} else if (providerEditsCacheStore) {
					delete providerEditsCacheStore[zone.commentThread.threadId];
				}

				zone.dispose();
			});
		}

		this._commentWidgets = [];
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/comments/browser/commentsEditorContribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/comments/browser/commentsEditorContribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyChord, KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import './media/review.css';
import { IActiveCodeEditor, isCodeEditor, isDiffEditor } from '../../../../editor/browser/editorBrowser.js';
import { EditorContributionInstantiation, registerEditorContribution } from '../../../../editor/browser/editorExtensions.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import * as nls from '../../../../nls.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { KeybindingsRegistry, KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ICommentService } from './commentService.js';
import { ctxCommentEditorFocused, SimpleCommentEditor } from './simpleCommentEditor.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { Action2, MenuId, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { EditorContextKeys } from '../../../../editor/common/editorContextKeys.js';
import { CommentController, ID } from './commentsController.js';
import { IRange, Range } from '../../../../editor/common/core/range.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { CommentContextKeys } from '../common/commentContextKeys.js';
import { CONTEXT_ACCESSIBILITY_MODE_ENABLED } from '../../../../platform/accessibility/common/accessibility.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { accessibilityHelpIsShown, accessibleViewCurrentProviderId } from '../../accessibility/browser/accessibilityConfiguration.js';
import { CommentCommandId } from '../common/commentCommandIds.js';
import { registerWorkbenchContribution2, WorkbenchPhase } from '../../../common/contributions.js';
import { CommentsInputContentProvider } from './commentsInputContentProvider.js';
import { AccessibleViewProviderId } from '../../../../platform/accessibility/browser/accessibleView.js';
import { CommentWidgetFocus } from './commentThreadZoneWidget.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { CommentThread, CommentThreadCollapsibleState, CommentThreadState } from '../../../../editor/common/languages.js';

registerEditorContribution(ID, CommentController, EditorContributionInstantiation.AfterFirstRender);
registerWorkbenchContribution2(CommentsInputContentProvider.ID, CommentsInputContentProvider, WorkbenchPhase.BlockRestore);

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: CommentCommandId.NextThread,
	handler: async (accessor, args?: { range: IRange; fileComment: boolean }) => {
		const activeEditor = getActiveEditor(accessor);
		if (!activeEditor) {
			return Promise.resolve();
		}

		const controller = CommentController.get(activeEditor);
		if (!controller) {
			return Promise.resolve();
		}
		controller.nextCommentThread(true);
	},
	weight: KeybindingWeight.EditorContrib,
	primary: KeyMod.Alt | KeyCode.F9,
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: CommentCommandId.PreviousThread,
	handler: async (accessor, args?: { range: IRange; fileComment: boolean }) => {
		const activeEditor = getActiveEditor(accessor);
		if (!activeEditor) {
			return Promise.resolve();
		}

		const controller = CommentController.get(activeEditor);
		if (!controller) {
			return Promise.resolve();
		}
		controller.previousCommentThread(true);
	},
	weight: KeybindingWeight.EditorContrib,
	primary: KeyMod.Shift | KeyMod.Alt | KeyCode.F9
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: CommentCommandId.NextCommentedRange,
			title: {
				value: nls.localize('comments.NextCommentedRange', "Go to Next Commented Range"),
				original: 'Go to Next Commented Range'
			},
			category: {
				value: nls.localize('commentsCategory', "Comments"),
				original: 'Comments'
			},
			menu: [{
				id: MenuId.CommandPalette,
				when: CommentContextKeys.activeEditorHasCommentingRange
			}],
			keybinding: {
				primary: KeyMod.Alt | KeyCode.F10,
				weight: KeybindingWeight.EditorContrib,
				when: CommentContextKeys.activeEditorHasCommentingRange
			}
		});
	}
	override run(accessor: ServicesAccessor, ...args: unknown[]): void {
		const activeEditor = getActiveEditor(accessor);
		if (!activeEditor) {
			return;
		}

		const controller = CommentController.get(activeEditor);
		if (!controller) {
			return;
		}
		controller.nextCommentThread(false);
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: CommentCommandId.PreviousCommentedRange,
			title: {
				value: nls.localize('comments.previousCommentedRange', "Go to Previous Commented Range"),
				original: 'Go to Previous Commented Range'
			},
			category: {
				value: nls.localize('commentsCategory', "Comments"),
				original: 'Comments'
			},
			menu: [{
				id: MenuId.CommandPalette,
				when: CommentContextKeys.activeEditorHasCommentingRange
			}],
			keybinding: {
				primary: KeyMod.Shift | KeyMod.Alt | KeyCode.F10,
				weight: KeybindingWeight.EditorContrib,
				when: CommentContextKeys.activeEditorHasCommentingRange
			}
		});
	}
	override run(accessor: ServicesAccessor, ...args: unknown[]): void {
		const activeEditor = getActiveEditor(accessor);
		if (!activeEditor) {
			return;
		}

		const controller = CommentController.get(activeEditor);
		if (!controller) {
			return;
		}
		controller.previousCommentThread(false);
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: CommentCommandId.NextRange,
			title: {
				value: nls.localize('comments.nextCommentingRange', "Go to Next Commenting Range"),
				original: 'Go to Next Commenting Range'
			},
			category: {
				value: nls.localize('commentsCategory', "Comments"),
				original: 'Comments'
			},
			menu: [{
				id: MenuId.CommandPalette,
				when: CommentContextKeys.activeEditorHasCommentingRange
			}],
			keybinding: {
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.DownArrow),
				weight: KeybindingWeight.EditorContrib,
				when: ContextKeyExpr.and(CONTEXT_ACCESSIBILITY_MODE_ENABLED, ContextKeyExpr.or(EditorContextKeys.focus, CommentContextKeys.commentFocused, ContextKeyExpr.and(accessibilityHelpIsShown, accessibleViewCurrentProviderId.isEqualTo(AccessibleViewProviderId.Comments))))
			}
		});
	}

	override run(accessor: ServicesAccessor, args?: { range: IRange; fileComment: boolean }): void {
		const activeEditor = getActiveEditor(accessor);
		if (!activeEditor) {
			return;
		}

		const controller = CommentController.get(activeEditor);
		if (!controller) {
			return;
		}
		controller.nextCommentingRange();
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: CommentCommandId.PreviousRange,
			title: {
				value: nls.localize('comments.previousCommentingRange', "Go to Previous Commenting Range"),
				original: 'Go to Previous Commenting Range'
			},
			category: {
				value: nls.localize('commentsCategory', "Comments"),
				original: 'Comments'
			},
			menu: [{
				id: MenuId.CommandPalette,
				when: CommentContextKeys.activeEditorHasCommentingRange
			}],
			keybinding: {
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.UpArrow),
				weight: KeybindingWeight.EditorContrib,
				when: ContextKeyExpr.and(CONTEXT_ACCESSIBILITY_MODE_ENABLED, ContextKeyExpr.or(EditorContextKeys.focus, CommentContextKeys.commentFocused, ContextKeyExpr.and(accessibilityHelpIsShown, accessibleViewCurrentProviderId.isEqualTo(AccessibleViewProviderId.Comments))))
			}
		});
	}

	override async run(accessor: ServicesAccessor, ...args: unknown[]): Promise<void> {
		const activeEditor = getActiveEditor(accessor);
		if (!activeEditor) {
			return;
		}

		const controller = CommentController.get(activeEditor);
		if (!controller) {
			return;
		}
		controller.previousCommentingRange();
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: CommentCommandId.ToggleCommenting,
			title: {
				value: nls.localize('comments.toggleCommenting', "Toggle Editor Commenting"),
				original: 'Toggle Editor Commenting'
			},
			category: {
				value: nls.localize('commentsCategory', "Comments"),
				original: 'Comments'
			},
			menu: [{
				id: MenuId.CommandPalette,
				when: CommentContextKeys.WorkspaceHasCommenting
			}]
		});
	}
	override run(accessor: ServicesAccessor, ...args: unknown[]): void {
		const commentService = accessor.get(ICommentService);
		const enable = commentService.isCommentingEnabled;
		commentService.enableCommenting(!enable);
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: CommentCommandId.Add,
			title: {
				value: nls.localize('comments.addCommand', "Add Comment on Current Selection"),
				original: 'Add Comment on Current Selection'
			},
			category: {
				value: nls.localize('commentsCategory', "Comments"),
				original: 'Comments'
			},
			menu: [{
				id: MenuId.CommandPalette,
				when: CommentContextKeys.activeCursorHasCommentingRange
			}],
			keybinding: {
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.KeyC),
				weight: KeybindingWeight.EditorContrib,
				when: CommentContextKeys.activeCursorHasCommentingRange
			}
		});
	}

	override async run(accessor: ServicesAccessor, args?: { range: IRange; fileComment: boolean }): Promise<void> {
		const activeEditor = getActiveEditor(accessor);
		if (!activeEditor) {
			return;
		}

		const controller = CommentController.get(activeEditor);
		if (!controller) {
			return;
		}

		const position = args?.range ? new Range(args.range.startLineNumber, args.range.startLineNumber, args.range.endLineNumber, args.range.endColumn)
			: (args?.fileComment ? undefined : activeEditor.getSelection());
		await controller.addOrToggleCommentAtLine(position, undefined);
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: CommentCommandId.FocusCommentOnCurrentLine,
			title: {
				value: nls.localize('comments.focusCommentOnCurrentLine', "Focus Comment on Current Line"),
				original: 'Focus Comment on Current Line'
			},
			category: {
				value: nls.localize('commentsCategory', "Comments"),
				original: 'Comments'
			},
			f1: true,
			precondition: CommentContextKeys.activeCursorHasComment,
		});
	}
	override async run(accessor: ServicesAccessor, ...args: unknown[]): Promise<void> {
		const activeEditor = getActiveEditor(accessor);
		if (!activeEditor) {
			return;
		}

		const controller = CommentController.get(activeEditor);
		if (!controller) {
			return;
		}
		const position = activeEditor.getSelection();
		const notificationService = accessor.get(INotificationService);
		let error = false;
		try {
			const commentAtLine = controller.getCommentsAtLine(position);
			if (commentAtLine.length === 0) {
				error = true;
			} else {
				await controller.revealCommentThread(commentAtLine[0].commentThread.threadId, undefined, false, CommentWidgetFocus.Widget);
			}
		} catch (e) {
			error = true;
		}
		if (error) {
			notificationService.error(nls.localize('comments.focusCommand.error', "The cursor must be on a line with a comment to focus the comment"));
		}
	}
});

function changeAllCollapseState(commentService: ICommentService, newState: (commentThread: CommentThread) => CommentThreadCollapsibleState) {
	for (const resource of commentService.commentsModel.resourceCommentThreads) {
		for (const thread of resource.commentThreads) {
			thread.thread.collapsibleState = newState(thread.thread);
		}
	}
}

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: CommentCommandId.CollapseAll,
			title: {
				value: nls.localize('comments.collapseAll', "Collapse All Comments"),
				original: 'Collapse All Comments'
			},
			category: {
				value: nls.localize('commentsCategory', "Comments"),
				original: 'Comments'
			},
			menu: [{
				id: MenuId.CommandPalette,
				when: CommentContextKeys.WorkspaceHasCommenting
			}]
		});
	}
	override run(accessor: ServicesAccessor, ...args: unknown[]): void {
		const commentService = accessor.get(ICommentService);
		changeAllCollapseState(commentService, () => CommentThreadCollapsibleState.Collapsed);
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: CommentCommandId.ExpandAll,
			title: {
				value: nls.localize('comments.expandAll', "Expand All Comments"),
				original: 'Expand All Comments'
			},
			category: {
				value: nls.localize('commentsCategory', "Comments"),
				original: 'Comments'
			},
			menu: [{
				id: MenuId.CommandPalette,
				when: CommentContextKeys.WorkspaceHasCommenting
			}]
		});
	}
	override run(accessor: ServicesAccessor, ...args: unknown[]): void {
		const commentService = accessor.get(ICommentService);
		changeAllCollapseState(commentService, () => CommentThreadCollapsibleState.Expanded);
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: CommentCommandId.ExpandUnresolved,
			title: {
				value: nls.localize('comments.expandUnresolved', "Expand Unresolved Comments"),
				original: 'Expand Unresolved Comments'
			},
			category: {
				value: nls.localize('commentsCategory', "Comments"),
				original: 'Comments'
			},
			menu: [{
				id: MenuId.CommandPalette,
				when: CommentContextKeys.WorkspaceHasCommenting
			}]
		});
	}
	override run(accessor: ServicesAccessor, ...args: unknown[]): void {
		const commentService = accessor.get(ICommentService);
		changeAllCollapseState(commentService, (commentThread) => {
			return commentThread.state === CommentThreadState.Unresolved ? CommentThreadCollapsibleState.Expanded : CommentThreadCollapsibleState.Collapsed;
		});
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: CommentCommandId.Submit,
	weight: KeybindingWeight.EditorContrib,
	primary: KeyMod.CtrlCmd | KeyCode.Enter,
	when: ctxCommentEditorFocused,
	handler: (accessor, args) => {
		const activeCodeEditor = accessor.get(ICodeEditorService).getFocusedCodeEditor();
		if (activeCodeEditor instanceof SimpleCommentEditor) {
			activeCodeEditor.getParentThread().submitComment();
		}
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: CommentCommandId.Hide,
	weight: KeybindingWeight.EditorContrib,
	primary: KeyCode.Escape,
	secondary: [KeyMod.Shift | KeyCode.Escape],
	when: ContextKeyExpr.or(ctxCommentEditorFocused, CommentContextKeys.commentFocused),
	handler: async (accessor, args) => {
		const activeCodeEditor = accessor.get(ICodeEditorService).getFocusedCodeEditor();
		const keybindingService = accessor.get(IKeybindingService);
		// Unfortunate, but collapsing the comment thread might cause a dialog to show
		// If we don't wait for the key up here, then the dialog will consume it and immediately close
		await keybindingService.enableKeybindingHoldMode(CommentCommandId.Hide);
		if (activeCodeEditor instanceof SimpleCommentEditor) {
			activeCodeEditor.getParentThread().collapse();
		} else if (activeCodeEditor) {
			const controller = CommentController.get(activeCodeEditor);
			if (!controller) {
				return;
			}
			const notificationService = accessor.get(INotificationService);
			const commentService = accessor.get(ICommentService);
			let error = false;
			try {
				const activeComment = commentService.lastActiveCommentcontroller?.activeComment;
				if (!activeComment) {
					error = true;
				} else {
					controller.collapseAndFocusRange(activeComment.thread.threadId);
				}
			} catch (e) {
				error = true;
			}
			if (error) {
				notificationService.error(nls.localize('comments.focusCommand.error', "The cursor must be on a line with a comment to focus the comment"));
			}
		}
	}
});

export function getActiveEditor(accessor: ServicesAccessor): IActiveCodeEditor | null {
	let activeTextEditorControl = accessor.get(IEditorService).activeTextEditorControl;

	if (isDiffEditor(activeTextEditorControl)) {
		if (activeTextEditorControl.getOriginalEditor().hasTextFocus()) {
			activeTextEditorControl = activeTextEditorControl.getOriginalEditor();
		} else {
			activeTextEditorControl = activeTextEditorControl.getModifiedEditor();
		}
	}

	if (!isCodeEditor(activeTextEditorControl) || !activeTextEditorControl.hasModel()) {
		return null;
	}

	return activeTextEditorControl;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/comments/browser/commentService.ts]---
Location: vscode-main/src/vs/workbench/contrib/comments/browser/commentService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CommentThreadChangedEvent, CommentInfo, Comment, CommentReaction, CommentingRanges, CommentThread, CommentOptions, PendingCommentThread, CommentingRangeResourceHint } from '../../../../editor/common/languages.js';
import { createDecorator, IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { Event, Emitter } from '../../../../base/common/event.js';
import { Disposable, DisposableStore, IDisposable } from '../../../../base/common/lifecycle.js';
import { URI, UriComponents } from '../../../../base/common/uri.js';
import { Range, IRange } from '../../../../editor/common/core/range.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { ICommentThreadChangedEvent } from '../common/commentModel.js';
import { CommentMenus } from './commentMenus.js';
import { ICellRange } from '../../notebook/common/notebookRange.js';
import { IWorkbenchLayoutService } from '../../../services/layout/browser/layoutService.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { COMMENTS_SECTION, ICommentsConfiguration } from '../common/commentsConfiguration.js';
import { IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { CommentContextKeys } from '../common/commentContextKeys.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { CommentsModel, ICommentsModel } from './commentsModel.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { Schemas } from '../../../../base/common/network.js';

export const ICommentService = createDecorator<ICommentService>('commentService');

interface IResourceCommentThreadEvent {
	resource: URI;
	commentInfos: ICommentInfo[];
}

export interface ICommentInfo<T = IRange> extends CommentInfo<T> {
	uniqueOwner: string;
	label?: string;
}

export interface INotebookCommentInfo {
	extensionId?: string;
	threads: CommentThread<ICellRange>[];
	uniqueOwner: string;
	label?: string;
}

export interface IWorkspaceCommentThreadsEvent {
	ownerId: string;
	ownerLabel: string;
	commentThreads: CommentThread[];
}

export interface INotebookCommentThreadChangedEvent extends CommentThreadChangedEvent<ICellRange> {
	uniqueOwner: string;
}

export interface ICommentController {
	id: string;
	label: string;
	features: {
		reactionGroup?: CommentReaction[];
		reactionHandler?: boolean;
		options?: CommentOptions;
	};
	options?: CommentOptions;
	contextValue?: string;
	owner: string;
	activeComment: { thread: CommentThread; comment?: Comment } | undefined;
	createCommentThreadTemplate(resource: UriComponents, range: IRange | undefined, editorId?: string): Promise<void>;
	updateCommentThreadTemplate(threadHandle: number, range: IRange): Promise<void>;
	deleteCommentThreadMain(commentThreadId: string): void;
	toggleReaction(uri: URI, thread: CommentThread, comment: Comment, reaction: CommentReaction, token: CancellationToken): Promise<void>;
	getDocumentComments(resource: URI, token: CancellationToken): Promise<ICommentInfo<IRange>>;
	getNotebookComments(resource: URI, token: CancellationToken): Promise<INotebookCommentInfo>;
	setActiveCommentAndThread(commentInfo: { thread: CommentThread; comment?: Comment } | undefined): Promise<void>;
}

export interface IContinueOnCommentProvider {
	provideContinueOnComments(): PendingCommentThread[];
}

export interface ICommentService {
	readonly _serviceBrand: undefined;
	readonly onDidSetResourceCommentInfos: Event<IResourceCommentThreadEvent>;
	readonly onDidSetAllCommentThreads: Event<IWorkspaceCommentThreadsEvent>;
	readonly onDidUpdateCommentThreads: Event<ICommentThreadChangedEvent>;
	readonly onDidUpdateNotebookCommentThreads: Event<INotebookCommentThreadChangedEvent>;
	readonly onDidChangeActiveEditingCommentThread: Event<CommentThread | null>;
	readonly onDidChangeCurrentCommentThread: Event<CommentThread | undefined>;
	readonly onDidUpdateCommentingRanges: Event<{ uniqueOwner: string }>;
	readonly onDidChangeActiveCommentingRange: Event<{ range: Range; commentingRangesInfo: CommentingRanges }>;
	readonly onDidSetDataProvider: Event<void>;
	readonly onDidDeleteDataProvider: Event<string | undefined>;
	readonly onDidChangeCommentingEnabled: Event<boolean>;
	readonly onResourceHasCommentingRanges: Event<void>;
	readonly isCommentingEnabled: boolean;
	readonly commentsModel: ICommentsModel;
	readonly lastActiveCommentcontroller: ICommentController | undefined;
	setDocumentComments(resource: URI, commentInfos: ICommentInfo[]): void;
	setWorkspaceComments(uniqueOwner: string, commentsByResource: CommentThread<IRange | ICellRange>[]): void;
	removeWorkspaceComments(uniqueOwner: string): void;
	registerCommentController(uniqueOwner: string, commentControl: ICommentController): void;
	unregisterCommentController(uniqueOwner?: string): void;
	getCommentController(uniqueOwner: string): ICommentController | undefined;
	createCommentThreadTemplate(uniqueOwner: string, resource: URI, range: Range | undefined, editorId?: string): Promise<void>;
	updateCommentThreadTemplate(uniqueOwner: string, threadHandle: number, range: Range): Promise<void>;
	getCommentMenus(uniqueOwner: string): CommentMenus;
	updateComments(ownerId: string, event: CommentThreadChangedEvent<IRange>): void;
	updateNotebookComments(ownerId: string, event: CommentThreadChangedEvent<ICellRange>): void;
	disposeCommentThread(ownerId: string, threadId: string): void;
	getDocumentComments(resource: URI): Promise<(ICommentInfo | null)[]>;
	getNotebookComments(resource: URI): Promise<(INotebookCommentInfo | null)[]>;
	updateCommentingRanges(ownerId: string, resourceHints?: CommentingRangeResourceHint): void;
	hasReactionHandler(uniqueOwner: string): boolean;
	toggleReaction(uniqueOwner: string, resource: URI, thread: CommentThread<IRange | ICellRange>, comment: Comment, reaction: CommentReaction): Promise<void>;
	setActiveEditingCommentThread(commentThread: CommentThread<IRange | ICellRange> | null): void;
	setCurrentCommentThread(commentThread: CommentThread<IRange | ICellRange> | undefined): void;
	setActiveCommentAndThread(uniqueOwner: string, commentInfo: { thread: CommentThread<IRange | ICellRange>; comment?: Comment } | undefined): Promise<void>;
	enableCommenting(enable: boolean): void;
	registerContinueOnCommentProvider(provider: IContinueOnCommentProvider): IDisposable;
	removeContinueOnComment(pendingComment: { range: IRange | undefined; uri: URI; uniqueOwner: string; isReply?: boolean }): PendingCommentThread | undefined;
	resourceHasCommentingRanges(resource: URI): boolean;
}

const CONTINUE_ON_COMMENTS = 'comments.continueOnComments';

export class CommentService extends Disposable implements ICommentService {
	declare readonly _serviceBrand: undefined;

	private readonly _onDidSetDataProvider: Emitter<void> = this._register(new Emitter<void>());
	readonly onDidSetDataProvider: Event<void> = this._onDidSetDataProvider.event;

	private readonly _onDidDeleteDataProvider: Emitter<string | undefined> = this._register(new Emitter<string | undefined>());
	readonly onDidDeleteDataProvider: Event<string | undefined> = this._onDidDeleteDataProvider.event;

	private readonly _onDidSetResourceCommentInfos: Emitter<IResourceCommentThreadEvent> = this._register(new Emitter<IResourceCommentThreadEvent>());
	readonly onDidSetResourceCommentInfos: Event<IResourceCommentThreadEvent> = this._onDidSetResourceCommentInfos.event;

	private readonly _onDidSetAllCommentThreads: Emitter<IWorkspaceCommentThreadsEvent> = this._register(new Emitter<IWorkspaceCommentThreadsEvent>());
	readonly onDidSetAllCommentThreads: Event<IWorkspaceCommentThreadsEvent> = this._onDidSetAllCommentThreads.event;

	private readonly _onDidUpdateCommentThreads: Emitter<ICommentThreadChangedEvent> = this._register(new Emitter<ICommentThreadChangedEvent>());
	readonly onDidUpdateCommentThreads: Event<ICommentThreadChangedEvent> = this._onDidUpdateCommentThreads.event;

	private readonly _onDidUpdateNotebookCommentThreads: Emitter<INotebookCommentThreadChangedEvent> = this._register(new Emitter<INotebookCommentThreadChangedEvent>());
	readonly onDidUpdateNotebookCommentThreads: Event<INotebookCommentThreadChangedEvent> = this._onDidUpdateNotebookCommentThreads.event;

	private readonly _onDidUpdateCommentingRanges: Emitter<{ uniqueOwner: string }> = this._register(new Emitter<{ uniqueOwner: string }>());
	readonly onDidUpdateCommentingRanges: Event<{ uniqueOwner: string }> = this._onDidUpdateCommentingRanges.event;

	private readonly _onDidChangeActiveEditingCommentThread = this._register(new Emitter<CommentThread | null>());
	readonly onDidChangeActiveEditingCommentThread = this._onDidChangeActiveEditingCommentThread.event;

	private readonly _onDidChangeCurrentCommentThread = this._register(new Emitter<CommentThread | undefined>());
	readonly onDidChangeCurrentCommentThread = this._onDidChangeCurrentCommentThread.event;

	private readonly _onDidChangeCommentingEnabled = this._register(new Emitter<boolean>());
	readonly onDidChangeCommentingEnabled = this._onDidChangeCommentingEnabled.event;

	private readonly _onResourceHasCommentingRanges = this._register(new Emitter<void>());
	readonly onResourceHasCommentingRanges = this._onResourceHasCommentingRanges.event;

	private readonly _onDidChangeActiveCommentingRange: Emitter<{
		range: Range; commentingRangesInfo:
		CommentingRanges;
	}> = this._register(new Emitter<{
		range: Range; commentingRangesInfo:
		CommentingRanges;
	}>());
	readonly onDidChangeActiveCommentingRange: Event<{ range: Range; commentingRangesInfo: CommentingRanges }> = this._onDidChangeActiveCommentingRange.event;

	private _commentControls = new Map<string, ICommentController>();
	private _commentMenus = new Map<string, CommentMenus>();
	private _isCommentingEnabled: boolean = true;
	private _workspaceHasCommenting: IContextKey<boolean>;
	private _commentingEnabled: IContextKey<boolean>;

	private _continueOnComments = new Map<string, PendingCommentThread[]>(); // uniqueOwner -> PendingCommentThread[]
	private _continueOnCommentProviders = new Set<IContinueOnCommentProvider>();

	private readonly _commentsModel: CommentsModel = this._register(new CommentsModel());
	public readonly commentsModel: ICommentsModel = this._commentsModel;

	private _commentingRangeResources = new Set<string>(); // URIs
	private _commentingRangeResourceHintSchemes = new Set<string>(); // schemes

	constructor(
		@IInstantiationService protected readonly instantiationService: IInstantiationService,
		@IWorkbenchLayoutService private readonly layoutService: IWorkbenchLayoutService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IStorageService private readonly storageService: IStorageService,
		@ILogService private readonly logService: ILogService,
		@IModelService private readonly modelService: IModelService
	) {
		super();
		this._handleConfiguration();
		this._handleZenMode();
		this._workspaceHasCommenting = CommentContextKeys.WorkspaceHasCommenting.bindTo(contextKeyService);
		this._commentingEnabled = CommentContextKeys.commentingEnabled.bindTo(contextKeyService);
		const storageListener = this._register(new DisposableStore());

		const storageEvent = Event.debounce(this.storageService.onDidChangeValue(StorageScope.WORKSPACE, CONTINUE_ON_COMMENTS, storageListener), (last, event) => last?.external ? last : event, 500);
		storageListener.add(storageEvent(v => {
			if (!v.external) {
				return;
			}
			const commentsToRestore: PendingCommentThread[] | undefined = this.storageService.getObject(CONTINUE_ON_COMMENTS, StorageScope.WORKSPACE);
			if (!commentsToRestore) {
				return;
			}
			this.logService.debug(`Comments: URIs of continue on comments from storage ${commentsToRestore.map(thread => thread.uri.toString()).join(', ')}.`);
			const changedOwners = this._addContinueOnComments(commentsToRestore, this._continueOnComments);
			for (const uniqueOwner of changedOwners) {
				const control = this._commentControls.get(uniqueOwner);
				if (!control) {
					continue;
				}
				const evt: ICommentThreadChangedEvent = {
					uniqueOwner: uniqueOwner,
					owner: control.owner,
					ownerLabel: control.label,
					pending: this._continueOnComments.get(uniqueOwner) || [],
					added: [],
					removed: [],
					changed: []
				};
				this.updateModelThreads(evt);
			}
		}));
		this._register(storageService.onWillSaveState(() => {
			const map: Map<string, PendingCommentThread[]> = new Map();
			for (const provider of this._continueOnCommentProviders) {
				const pendingComments = provider.provideContinueOnComments();
				this._addContinueOnComments(pendingComments, map);
			}
			this._saveContinueOnComments(map);
		}));

		this._register(this.modelService.onModelAdded(model => {
			// Excluded schemes
			if ((model.uri.scheme === Schemas.vscodeSourceControl)) {
				return;
			}
			// Allows comment providers to cause their commenting ranges to be prefetched by opening text documents in the background.
			if (!this._commentingRangeResources.has(model.uri.toString())) {
				this.getDocumentComments(model.uri);
			}
		}));
	}

	private _updateResourcesWithCommentingRanges(resource: URI, commentInfos: (ICommentInfo | null)[]) {
		let addedResources = false;
		for (const comments of commentInfos) {
			if (comments && (comments.commentingRanges.ranges.length > 0 || comments.threads.length > 0)) {
				this._commentingRangeResources.add(resource.toString());
				addedResources = true;
			}
		}
		if (addedResources) {
			this._onResourceHasCommentingRanges.fire();
		}
	}

	private _handleConfiguration() {
		this._isCommentingEnabled = this._defaultCommentingEnablement;
		this._register(this.configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('comments.visible')) {
				this.enableCommenting(this._defaultCommentingEnablement);
			}
		}));
	}

	private _handleZenMode() {
		let preZenModeValue: boolean = this._isCommentingEnabled;
		this._register(this.layoutService.onDidChangeZenMode(e => {
			if (e) {
				preZenModeValue = this._isCommentingEnabled;
				this.enableCommenting(false);
			} else {
				this.enableCommenting(preZenModeValue);
			}
		}));
	}

	private get _defaultCommentingEnablement(): boolean {
		return !!this.configurationService.getValue<ICommentsConfiguration | undefined>(COMMENTS_SECTION)?.visible;
	}

	get isCommentingEnabled(): boolean {
		return this._isCommentingEnabled;
	}

	enableCommenting(enable: boolean): void {
		if (enable !== this._isCommentingEnabled) {
			this._isCommentingEnabled = enable;
			this._commentingEnabled.set(enable);
			this._onDidChangeCommentingEnabled.fire(enable);
		}
	}

	/**
	 * The current comment thread is the thread that has focus or is being hovered.
	 * @param commentThread
	 */
	setCurrentCommentThread(commentThread: CommentThread | undefined) {
		this._onDidChangeCurrentCommentThread.fire(commentThread);
	}

	/**
	 * The active comment thread is the thread that is currently being edited.
	 * @param commentThread
	 */
	setActiveEditingCommentThread(commentThread: CommentThread | null) {
		this._onDidChangeActiveEditingCommentThread.fire(commentThread);
	}

	get lastActiveCommentcontroller() {
		return this._lastActiveCommentController;
	}

	private _lastActiveCommentController: ICommentController | undefined;
	async setActiveCommentAndThread(uniqueOwner: string, commentInfo: { thread: CommentThread<IRange>; comment?: Comment } | undefined) {
		const commentController = this._commentControls.get(uniqueOwner);

		if (!commentController) {
			return;
		}

		if (commentController !== this._lastActiveCommentController) {
			await this._lastActiveCommentController?.setActiveCommentAndThread(undefined);
		}
		this._lastActiveCommentController = commentController;
		return commentController.setActiveCommentAndThread(commentInfo);
	}

	setDocumentComments(resource: URI, commentInfos: ICommentInfo[]): void {
		this._onDidSetResourceCommentInfos.fire({ resource, commentInfos });
	}

	private setModelThreads(ownerId: string, owner: string, ownerLabel: string, commentThreads: CommentThread<IRange>[]) {
		this._commentsModel.setCommentThreads(ownerId, owner, ownerLabel, commentThreads);
		this._onDidSetAllCommentThreads.fire({ ownerId, ownerLabel, commentThreads });
	}

	private updateModelThreads(event: ICommentThreadChangedEvent) {
		this._commentsModel.updateCommentThreads(event);
		this._onDidUpdateCommentThreads.fire(event);
	}

	setWorkspaceComments(uniqueOwner: string, commentsByResource: CommentThread[]): void {

		if (commentsByResource.length) {
			this._workspaceHasCommenting.set(true);
		}
		const control = this._commentControls.get(uniqueOwner);
		if (control) {
			this.setModelThreads(uniqueOwner, control.owner, control.label, commentsByResource);
		}
	}

	removeWorkspaceComments(uniqueOwner: string): void {
		const control = this._commentControls.get(uniqueOwner);
		if (control) {
			this.setModelThreads(uniqueOwner, control.owner, control.label, []);
		}
	}

	registerCommentController(uniqueOwner: string, commentControl: ICommentController): void {
		this._commentControls.set(uniqueOwner, commentControl);
		this._onDidSetDataProvider.fire();
	}

	unregisterCommentController(uniqueOwner?: string): void {
		if (uniqueOwner) {
			this._commentControls.delete(uniqueOwner);
		} else {
			this._commentControls.clear();
		}
		this._commentsModel.deleteCommentsByOwner(uniqueOwner);
		this._onDidDeleteDataProvider.fire(uniqueOwner);
	}

	getCommentController(uniqueOwner: string): ICommentController | undefined {
		return this._commentControls.get(uniqueOwner);
	}

	async createCommentThreadTemplate(uniqueOwner: string, resource: URI, range: Range | undefined, editorId?: string): Promise<void> {
		const commentController = this._commentControls.get(uniqueOwner);

		if (!commentController) {
			return;
		}

		return commentController.createCommentThreadTemplate(resource, range, editorId);
	}

	async updateCommentThreadTemplate(uniqueOwner: string, threadHandle: number, range: Range) {
		const commentController = this._commentControls.get(uniqueOwner);

		if (!commentController) {
			return;
		}

		await commentController.updateCommentThreadTemplate(threadHandle, range);
	}

	disposeCommentThread(uniqueOwner: string, threadId: string) {
		const controller = this.getCommentController(uniqueOwner);
		controller?.deleteCommentThreadMain(threadId);
	}

	getCommentMenus(uniqueOwner: string): CommentMenus {
		if (this._commentMenus.get(uniqueOwner)) {
			return this._commentMenus.get(uniqueOwner)!;
		}

		const menu = this.instantiationService.createInstance(CommentMenus);
		this._commentMenus.set(uniqueOwner, menu);
		return menu;
	}

	updateComments(ownerId: string, event: CommentThreadChangedEvent<IRange>): void {
		const control = this._commentControls.get(ownerId);
		if (control) {
			const evt: ICommentThreadChangedEvent = Object.assign({}, event, { uniqueOwner: ownerId, ownerLabel: control.label, owner: control.owner });
			this.updateModelThreads(evt);
		}
	}

	updateNotebookComments(ownerId: string, event: CommentThreadChangedEvent<ICellRange>): void {
		const evt: INotebookCommentThreadChangedEvent = Object.assign({}, event, { uniqueOwner: ownerId });
		this._onDidUpdateNotebookCommentThreads.fire(evt);
	}

	updateCommentingRanges(ownerId: string, resourceHints?: CommentingRangeResourceHint) {
		if (resourceHints?.schemes && resourceHints.schemes.length > 0) {
			for (const scheme of resourceHints.schemes) {
				this._commentingRangeResourceHintSchemes.add(scheme);
			}
		}
		this._workspaceHasCommenting.set(true);
		this._onDidUpdateCommentingRanges.fire({ uniqueOwner: ownerId });
	}

	async toggleReaction(uniqueOwner: string, resource: URI, thread: CommentThread, comment: Comment, reaction: CommentReaction): Promise<void> {
		const commentController = this._commentControls.get(uniqueOwner);

		if (commentController) {
			return commentController.toggleReaction(resource, thread, comment, reaction, CancellationToken.None);
		} else {
			throw new Error('Not supported');
		}
	}

	hasReactionHandler(uniqueOwner: string): boolean {
		const commentProvider = this._commentControls.get(uniqueOwner);

		if (commentProvider) {
			return !!commentProvider.features.reactionHandler;
		}

		return false;
	}

	async getDocumentComments(resource: URI): Promise<(ICommentInfo | null)[]> {
		const commentControlResult: Promise<ICommentInfo | null>[] = [];

		for (const control of this._commentControls.values()) {
			commentControlResult.push(control.getDocumentComments(resource, CancellationToken.None)
				.then(documentComments => {
					// Check that there aren't any continue on comments in the provided comments
					// This can happen because continue on comments are stored separately from local un-submitted comments.
					for (const documentCommentThread of documentComments.threads) {
						if (documentCommentThread.comments?.length === 0 && documentCommentThread.range) {
							this.removeContinueOnComment({ range: documentCommentThread.range, uri: resource, uniqueOwner: documentComments.uniqueOwner });
						}
					}
					const pendingComments = this._continueOnComments.get(documentComments.uniqueOwner);
					documentComments.pendingCommentThreads = pendingComments?.filter(pendingComment => pendingComment.uri.toString() === resource.toString());
					return documentComments;
				})
				.catch(_ => {
					return null;
				}));
		}

		const commentInfos = await Promise.all(commentControlResult);
		this._updateResourcesWithCommentingRanges(resource, commentInfos);
		return commentInfos;
	}

	async getNotebookComments(resource: URI): Promise<(INotebookCommentInfo | null)[]> {
		const commentControlResult: Promise<INotebookCommentInfo | null>[] = [];

		this._commentControls.forEach(control => {
			commentControlResult.push(control.getNotebookComments(resource, CancellationToken.None)
				.catch(_ => {
					return null;
				}));
		});

		return Promise.all(commentControlResult);
	}

	registerContinueOnCommentProvider(provider: IContinueOnCommentProvider): IDisposable {
		this._continueOnCommentProviders.add(provider);
		return {
			dispose: () => {
				this._continueOnCommentProviders.delete(provider);
			}
		};
	}

	private _saveContinueOnComments(map: Map<string, PendingCommentThread[]>) {
		const commentsToSave: PendingCommentThread[] = [];
		for (const pendingComments of map.values()) {
			commentsToSave.push(...pendingComments);
		}
		this.logService.debug(`Comments: URIs of continue on comments to add to storage ${commentsToSave.map(thread => thread.uri.toString()).join(', ')}.`);
		this.storageService.store(CONTINUE_ON_COMMENTS, commentsToSave, StorageScope.WORKSPACE, StorageTarget.USER);
	}

	removeContinueOnComment(pendingComment: { range: IRange; uri: URI; uniqueOwner: string; isReply?: boolean }): PendingCommentThread | undefined {
		const pendingComments = this._continueOnComments.get(pendingComment.uniqueOwner);
		if (pendingComments) {
			const commentIndex = pendingComments.findIndex(comment => comment.uri.toString() === pendingComment.uri.toString() && Range.equalsRange(comment.range, pendingComment.range) && (pendingComment.isReply === undefined || comment.isReply === pendingComment.isReply));
			if (commentIndex > -1) {
				return pendingComments.splice(commentIndex, 1)[0];
			}
		}
		return undefined;
	}

	private _addContinueOnComments(pendingComments: PendingCommentThread[], map: Map<string, PendingCommentThread[]>): Set<string> {
		const changedOwners = new Set<string>();
		for (const pendingComment of pendingComments) {
			if (!map.has(pendingComment.uniqueOwner)) {
				map.set(pendingComment.uniqueOwner, [pendingComment]);
				changedOwners.add(pendingComment.uniqueOwner);
			} else {
				const commentsForOwner = map.get(pendingComment.uniqueOwner)!;
				if (commentsForOwner.every(comment => (comment.uri.toString() !== pendingComment.uri.toString()) || !Range.equalsRange(comment.range, pendingComment.range))) {
					commentsForOwner.push(pendingComment);
					changedOwners.add(pendingComment.uniqueOwner);
				}
			}
		}
		return changedOwners;
	}

	resourceHasCommentingRanges(resource: URI): boolean {
		return this._commentingRangeResourceHintSchemes.has(resource.scheme) || this._commentingRangeResources.has(resource.toString());
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/comments/browser/commentsFilterOptions.ts]---
Location: vscode-main/src/vs/workbench/contrib/comments/browser/commentsFilterOptions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IFilter, matchesFuzzy, matchesFuzzy2 } from '../../../../base/common/filters.js';
import * as strings from '../../../../base/common/strings.js';

export class FilterOptions {

	static readonly _filter: IFilter = matchesFuzzy2;
	static readonly _messageFilter: IFilter = matchesFuzzy;

	readonly showResolved: boolean = true;
	readonly showUnresolved: boolean = true;
	readonly textFilter: { readonly text: string; readonly negate: boolean };

	constructor(
		readonly filter: string,
		showResolved: boolean,
		showUnresolved: boolean,
	) {
		filter = filter.trim();
		this.showResolved = showResolved;
		this.showUnresolved = showUnresolved;

		const negate = filter.startsWith('!');
		this.textFilter = { text: (negate ? strings.ltrim(filter, '!') : filter).trim(), negate };
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/comments/browser/commentsInputContentProvider.ts]---
Location: vscode-main/src/vs/workbench/contrib/comments/browser/commentsInputContentProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../base/common/network.js';
import { URI } from '../../../../base/common/uri.js';
import { ICodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { IEditorContribution, ScrollType } from '../../../../editor/common/editorCommon.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { ITextModel } from '../../../../editor/common/model.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { ITextModelContentProvider, ITextModelService } from '../../../../editor/common/services/resolverService.js';
import { ITextResourceEditorInput } from '../../../../platform/editor/common/editor.js';
import { applyTextEditorOptions } from '../../../common/editor/editorOptions.js';
import { SimpleCommentEditor } from './simpleCommentEditor.js';

export class CommentsInputContentProvider extends Disposable implements ITextModelContentProvider, IEditorContribution {

	public static readonly ID = 'comments.input.contentProvider';

	constructor(
		@ITextModelService textModelService: ITextModelService,
		@ICodeEditorService codeEditorService: ICodeEditorService,
		@IModelService private readonly _modelService: IModelService,
		@ILanguageService private readonly _languageService: ILanguageService,
	) {
		super();
		this._register(textModelService.registerTextModelContentProvider(Schemas.commentsInput, this));

		this._register(codeEditorService.registerCodeEditorOpenHandler(async (input: ITextResourceEditorInput, editor: ICodeEditor | null, _sideBySide?: boolean): Promise<ICodeEditor | null> => {
			if (!(editor instanceof SimpleCommentEditor)) {
				return null;
			}

			if (editor.getModel()?.uri.toString() !== input.resource.toString()) {
				return null;
			}

			if (input.options) {
				applyTextEditorOptions(input.options, editor, ScrollType.Immediate);
			}
			return editor;
		}));
	}

	async provideTextContent(resource: URI): Promise<ITextModel | null> {
		const existing = this._modelService.getModel(resource);
		return existing ?? this._modelService.createModel('', this._languageService.createById('markdown'), resource);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/comments/browser/commentsModel.ts]---
Location: vscode-main/src/vs/workbench/contrib/comments/browser/commentsModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { groupBy } from '../../../../base/common/arrays.js';
import { URI } from '../../../../base/common/uri.js';
import { CommentThread } from '../../../../editor/common/languages.js';
import { localize } from '../../../../nls.js';
import { ResourceWithCommentThreads, ICommentThreadChangedEvent } from '../common/commentModel.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { isMarkdownString } from '../../../../base/common/htmlContent.js';

export function threadHasMeaningfulComments(thread: CommentThread): boolean {
	return !!thread.comments && !!thread.comments.length && thread.comments.some(comment => isMarkdownString(comment.body) ? comment.body.value.length > 0 : comment.body.length > 0);

}

export interface ICommentsModel {
	hasCommentThreads(): boolean;
	getMessage(): string;
	readonly resourceCommentThreads: ResourceWithCommentThreads[];
	readonly commentThreadsMap: Map<string, { resourceWithCommentThreads: ResourceWithCommentThreads[]; ownerLabel?: string }>;
}

export class CommentsModel extends Disposable implements ICommentsModel {
	readonly _serviceBrand: undefined;
	private _resourceCommentThreads: ResourceWithCommentThreads[];
	get resourceCommentThreads(): ResourceWithCommentThreads[] { return this._resourceCommentThreads; }
	readonly commentThreadsMap: Map<string, { resourceWithCommentThreads: ResourceWithCommentThreads[]; ownerLabel?: string }>;

	constructor(
	) {
		super();
		this._resourceCommentThreads = [];
		this.commentThreadsMap = new Map<string, { resourceWithCommentThreads: ResourceWithCommentThreads[]; ownerLabel: string }>();
	}

	private updateResourceCommentThreads() {
		const includeLabel = this.commentThreadsMap.size > 1;
		this._resourceCommentThreads = [...this.commentThreadsMap.values()].map(value => {
			return value.resourceWithCommentThreads.map(resource => {
				resource.ownerLabel = includeLabel ? value.ownerLabel : undefined;
				return resource;
			}).flat();
		}).flat();
	}

	public setCommentThreads(uniqueOwner: string, owner: string, ownerLabel: string, commentThreads: CommentThread[]): void {
		this.commentThreadsMap.set(uniqueOwner, { ownerLabel, resourceWithCommentThreads: this.groupByResource(uniqueOwner, owner, commentThreads) });
		this.updateResourceCommentThreads();
	}

	public deleteCommentsByOwner(uniqueOwner?: string): void {
		if (uniqueOwner) {
			const existingOwner = this.commentThreadsMap.get(uniqueOwner);
			this.commentThreadsMap.set(uniqueOwner, { ownerLabel: existingOwner?.ownerLabel, resourceWithCommentThreads: [] });
		} else {
			this.commentThreadsMap.clear();
		}
		this.updateResourceCommentThreads();
	}

	public updateCommentThreads(event: ICommentThreadChangedEvent): boolean {
		const { uniqueOwner, owner, ownerLabel, removed, changed, added } = event;

		const threadsForOwner = this.commentThreadsMap.get(uniqueOwner)?.resourceWithCommentThreads || [];

		removed.forEach(thread => {
			// Find resource that has the comment thread
			const matchingResourceIndex = threadsForOwner.findIndex((resourceData) => resourceData.id === thread.resource);
			const matchingResourceData = matchingResourceIndex >= 0 ? threadsForOwner[matchingResourceIndex] : undefined;

			// Find comment node on resource that is that thread and remove it
			const index = matchingResourceData?.commentThreads.findIndex((commentThread) => commentThread.threadId === thread.threadId) ?? 0;
			if (index >= 0) {
				matchingResourceData?.commentThreads.splice(index, 1);
			}

			// If the comment thread was the last thread for a resource, remove that resource from the list
			if (matchingResourceData?.commentThreads.length === 0) {
				threadsForOwner.splice(matchingResourceIndex, 1);
			}
		});

		changed.forEach(thread => {
			// Find resource that has the comment thread
			const matchingResourceIndex = threadsForOwner.findIndex((resourceData) => resourceData.id === thread.resource);
			const matchingResourceData = matchingResourceIndex >= 0 ? threadsForOwner[matchingResourceIndex] : undefined;
			if (!matchingResourceData) {
				return;
			}

			// Find comment node on resource that is that thread and replace it
			const index = matchingResourceData.commentThreads.findIndex((commentThread) => commentThread.threadId === thread.threadId);
			if (index >= 0) {
				matchingResourceData.commentThreads[index] = ResourceWithCommentThreads.createCommentNode(uniqueOwner, owner, URI.parse(matchingResourceData.id), thread);
			} else if (thread.comments && thread.comments.length) {
				matchingResourceData.commentThreads.push(ResourceWithCommentThreads.createCommentNode(uniqueOwner, owner, URI.parse(matchingResourceData.id), thread));
			}
		});

		added.forEach(thread => {
			const existingResource = threadsForOwner.filter(resourceWithThreads => resourceWithThreads.resource.toString() === thread.resource);
			if (existingResource.length) {
				const resource = existingResource[0];
				if (thread.comments && thread.comments.length) {
					resource.commentThreads.push(ResourceWithCommentThreads.createCommentNode(uniqueOwner, owner, resource.resource, thread));
				}
			} else {
				threadsForOwner.push(new ResourceWithCommentThreads(uniqueOwner, owner, URI.parse(thread.resource!), [thread]));
			}
		});

		this.commentThreadsMap.set(uniqueOwner, { ownerLabel, resourceWithCommentThreads: threadsForOwner });
		this.updateResourceCommentThreads();

		return removed.length > 0 || changed.length > 0 || added.length > 0;
	}

	public hasCommentThreads(): boolean {
		// There's a resource with at least one thread
		return !!this._resourceCommentThreads.length && this._resourceCommentThreads.some(resource => {
			// At least one of the threads in the resource has comments
			return (resource.commentThreads.length > 0) && resource.commentThreads.some(thread => {
				// At least one of the comments in the thread is not empty
				return threadHasMeaningfulComments(thread.thread);
			});
		});
	}

	public getMessage(): string {
		if (!this._resourceCommentThreads.length) {
			return localize('noComments', "There are no comments in this workspace yet.");
		} else {
			return '';
		}
	}

	private groupByResource(uniqueOwner: string, owner: string, commentThreads: CommentThread[]): ResourceWithCommentThreads[] {
		const resourceCommentThreads: ResourceWithCommentThreads[] = [];
		const commentThreadsByResource = new Map<string, ResourceWithCommentThreads>();
		for (const group of groupBy(commentThreads, CommentsModel._compareURIs)) {
			commentThreadsByResource.set(group[0].resource!, new ResourceWithCommentThreads(uniqueOwner, owner, URI.parse(group[0].resource!), group));
		}

		commentThreadsByResource.forEach((v, i, m) => {
			resourceCommentThreads.push(v);
		});

		return resourceCommentThreads;
	}

	private static _compareURIs(a: CommentThread, b: CommentThread) {
		const resourceA = a.resource!.toString();
		const resourceB = b.resource!.toString();
		if (resourceA < resourceB) {
			return -1;
		} else if (resourceA > resourceB) {
			return 1;
		} else {
			return 0;
		}
	}
}
```

--------------------------------------------------------------------------------

````
