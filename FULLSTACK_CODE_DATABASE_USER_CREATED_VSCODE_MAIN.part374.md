---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 374
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 374 of 552)

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

---[FILE: src/vs/workbench/contrib/comments/browser/commentsTreeViewer.ts]---
Location: vscode-main/src/vs/workbench/contrib/comments/browser/commentsTreeViewer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import * as nls from '../../../../nls.js';
import { renderMarkdown } from '../../../../base/browser/markdownRenderer.js';
import { IDisposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { IResourceLabel, ResourceLabels } from '../../../browser/labels.js';
import { CommentNode, ResourceWithCommentThreads } from '../common/commentModel.js';
import { ITreeContextMenuEvent, ITreeFilter, ITreeNode, TreeFilterResult, TreeVisibility } from '../../../../base/browser/ui/tree/tree.js';
import { IListVirtualDelegate, IListRenderer } from '../../../../base/browser/ui/list/list.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IListService, IWorkbenchAsyncDataTreeOptions, WorkbenchObjectTree } from '../../../../platform/list/browser/listService.js';
import { IColorTheme, IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { TimestampWidget } from './timestamp.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { IMarkdownString } from '../../../../base/common/htmlContent.js';
import { commentViewThreadStateColorVar, getCommentThreadStateIconColor } from './commentColors.js';
import { CommentThreadApplicability, CommentThreadState, CommentState } from '../../../../editor/common/languages.js';
import { Color } from '../../../../base/common/color.js';
import { IMatch } from '../../../../base/common/filters.js';
import { FilterOptions } from './commentsFilterOptions.js';
import { basename } from '../../../../base/common/resources.js';
import { IStyleOverride } from '../../../../platform/theme/browser/defaultStyles.js';
import { IListStyles } from '../../../../base/browser/ui/list/listWidget.js';
import { ILocalizedString } from '../../../../platform/action/common/action.js';
import { CommentsModel } from './commentsModel.js';
import { getDefaultHoverDelegate } from '../../../../base/browser/ui/hover/hoverDelegateFactory.js';
import { ActionBar, IActionViewItemProvider } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { createActionViewItem, getContextMenuActions } from '../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { IMenuService, MenuId } from '../../../../platform/actions/common/actions.js';
import { IAction } from '../../../../base/common/actions.js';
import { MarshalledId } from '../../../../base/common/marshallingIds.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { ActionViewItem } from '../../../../base/browser/ui/actionbar/actionViewItems.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { MarshalledCommentThread, MarshalledCommentThreadInternal } from '../../../common/comments.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';

export const COMMENTS_VIEW_ID = 'workbench.panel.comments';
export const COMMENTS_VIEW_STORAGE_ID = 'Comments';
export const COMMENTS_VIEW_TITLE: ILocalizedString = nls.localize2('comments.view.title', "Comments");

interface IResourceTemplateData {
	resourceLabel: IResourceLabel;
	separator: HTMLElement;
	owner: HTMLElement;
}

interface ICommentThreadTemplateData {
	threadMetadata: {
		relevance: HTMLElement;
		icon: HTMLElement;
		userNames: HTMLSpanElement;
		timestamp: TimestampWidget;
		separator: HTMLElement;
		commentPreview: HTMLSpanElement;
		range: HTMLElement;
	};
	repliesMetadata: {
		container: HTMLElement;
		icon: HTMLElement;
		count: HTMLSpanElement;
		lastReplyDetail: HTMLSpanElement;
		separator: HTMLElement;
		timestamp: TimestampWidget;
	};
	actionBar: ActionBar;
	disposables: IDisposable[];
}

class CommentsModelVirtualDelegate implements IListVirtualDelegate<ResourceWithCommentThreads | CommentNode> {
	private static readonly RESOURCE_ID = 'resource-with-comments';
	private static readonly COMMENT_ID = 'comment-node';


	getHeight(element: any): number {
		if ((element instanceof CommentNode) && element.hasReply()) {
			return 44;
		}
		return 22;
	}

	public getTemplateId(element: any): string {
		if (element instanceof ResourceWithCommentThreads) {
			return CommentsModelVirtualDelegate.RESOURCE_ID;
		}
		if (element instanceof CommentNode) {
			return CommentsModelVirtualDelegate.COMMENT_ID;
		}

		return '';
	}
}

export class ResourceWithCommentsRenderer implements IListRenderer<ITreeNode<ResourceWithCommentThreads>, IResourceTemplateData> {
	templateId: string = 'resource-with-comments';

	constructor(
		private labels: ResourceLabels
	) {
	}

	renderTemplate(container: HTMLElement) {
		const labelContainer = dom.append(container, dom.$('.resource-container'));
		const resourceLabel = this.labels.create(labelContainer);
		const separator = dom.append(labelContainer, dom.$('.separator'));
		const owner = labelContainer.appendChild(dom.$('.owner'));

		return { resourceLabel, owner, separator };
	}

	renderElement(node: ITreeNode<ResourceWithCommentThreads>, index: number, templateData: IResourceTemplateData): void {
		templateData.resourceLabel.setFile(node.element.resource);
		templateData.separator.innerText = '\u00b7';

		if (node.element.ownerLabel) {
			templateData.owner.innerText = node.element.ownerLabel;
			templateData.separator.style.display = 'inline';
		} else {
			templateData.owner.innerText = '';
			templateData.separator.style.display = 'none';
		}
	}

	disposeTemplate(templateData: IResourceTemplateData): void {
		templateData.resourceLabel.dispose();
	}
}

export class CommentsMenus implements IDisposable {
	private contextKeyService: IContextKeyService | undefined;

	constructor(
		@IMenuService private readonly menuService: IMenuService
	) { }

	getResourceActions(element: CommentNode): { actions: IAction[] } {
		const actions = this.getActions(MenuId.CommentsViewThreadActions, element);
		return { actions: actions.primary };
	}

	getResourceContextActions(element: CommentNode): IAction[] {
		return this.getActions(MenuId.CommentsViewThreadActions, element).secondary;
	}

	public setContextKeyService(service: IContextKeyService) {
		this.contextKeyService = service;
	}

	private getActions(menuId: MenuId, element: CommentNode): { primary: IAction[]; secondary: IAction[] } {
		if (!this.contextKeyService) {
			return { primary: [], secondary: [] };
		}

		const overlay: [string, any][] = [
			['commentController', element.owner],
			['resourceScheme', element.resource.scheme],
			['commentThread', element.contextValue],
			['canReply', element.thread.canReply]
		];
		const contextKeyService = this.contextKeyService.createOverlay(overlay);

		const menu = this.menuService.getMenuActions(menuId, contextKeyService, { shouldForwardArgs: true });
		return getContextMenuActions(menu, 'inline');
	}

	dispose() {
		this.contextKeyService = undefined;
	}
}

export class CommentNodeRenderer implements IListRenderer<ITreeNode<CommentNode>, ICommentThreadTemplateData> {
	templateId: string = 'comment-node';

	constructor(
		private actionViewItemProvider: IActionViewItemProvider,
		private menus: CommentsMenus,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IHoverService private readonly hoverService: IHoverService,
		@IThemeService private themeService: IThemeService
	) { }

	renderTemplate(container: HTMLElement) {
		const threadContainer = dom.append(container, dom.$('.comment-thread-container'));
		const metadataContainer = dom.append(threadContainer, dom.$('.comment-metadata-container'));
		const metadata = dom.append(metadataContainer, dom.$('.comment-metadata'));

		const icon = dom.append(metadata, dom.$('.icon'));
		const userNames = dom.append(metadata, dom.$('.user'));
		const timestamp = new TimestampWidget(this.configurationService, this.hoverService, dom.append(metadata, dom.$('.timestamp-container')));
		const relevance = dom.append(metadata, dom.$('.relevance'));
		const separator = dom.append(metadata, dom.$('.separator'));
		const commentPreview = dom.append(metadata, dom.$('.text'));
		const rangeContainer = dom.append(metadata, dom.$('.range'));
		const range = dom.$('p');
		rangeContainer.appendChild(range);

		const threadMetadata = {
			icon,
			userNames,
			timestamp,
			relevance,
			separator,
			commentPreview,
			range
		};
		threadMetadata.separator.innerText = '\u00b7';

		const actionsContainer = dom.append(metadataContainer, dom.$('.actions'));
		const actionBar = new ActionBar(actionsContainer, {
			actionViewItemProvider: this.actionViewItemProvider
		});

		const snippetContainer = dom.append(threadContainer, dom.$('.comment-snippet-container'));
		const repliesMetadata = {
			container: snippetContainer,
			icon: dom.append(snippetContainer, dom.$('.icon')),
			count: dom.append(snippetContainer, dom.$('.count')),
			lastReplyDetail: dom.append(snippetContainer, dom.$('.reply-detail')),
			separator: dom.append(snippetContainer, dom.$('.separator')),
			timestamp: new TimestampWidget(this.configurationService, this.hoverService, dom.append(snippetContainer, dom.$('.timestamp-container'))),
		};
		repliesMetadata.separator.innerText = '\u00b7';
		repliesMetadata.icon.classList.add(...ThemeIcon.asClassNameArray(Codicon.indent));

		const disposables = [threadMetadata.timestamp, repliesMetadata.timestamp];
		return { threadMetadata, repliesMetadata, actionBar, disposables };
	}

	private getCountString(commentCount: number): string {
		if (commentCount > 2) {
			return nls.localize('commentsCountReplies', "{0} replies", commentCount - 1);
		} else if (commentCount === 2) {
			return nls.localize('commentsCountReply', "1 reply");
		} else {
			return nls.localize('commentCount', "1 comment");
		}
	}

	private getRenderedComment(commentBody: IMarkdownString) {
		const renderedComment = renderMarkdown(commentBody, {}, document.createElement('span'));
		// eslint-disable-next-line no-restricted-syntax
		const images = renderedComment.element.getElementsByTagName('img');
		for (let i = 0; i < images.length; i++) {
			const image = images[i];
			const textDescription = dom.$('');
			textDescription.textContent = image.alt ? nls.localize('imageWithLabel', "Image: {0}", image.alt) : nls.localize('image', "Image");
			image.replaceWith(textDescription);
		}
		// eslint-disable-next-line no-restricted-syntax
		const headings = [...renderedComment.element.getElementsByTagName('h1'), ...renderedComment.element.getElementsByTagName('h2'), ...renderedComment.element.getElementsByTagName('h3'), ...renderedComment.element.getElementsByTagName('h4'), ...renderedComment.element.getElementsByTagName('h5'), ...renderedComment.element.getElementsByTagName('h6')];
		for (const heading of headings) {
			const textNode = document.createTextNode(heading.textContent || '');
			heading.replaceWith(textNode);
		}
		while ((renderedComment.element.children.length > 1) && (renderedComment.element.firstElementChild?.tagName === 'HR')) {
			renderedComment.element.removeChild(renderedComment.element.firstElementChild);
		}
		return renderedComment;
	}

	private getIcon(threadState?: CommentThreadState, hasDraft?: boolean): ThemeIcon {
		// Priority: draft > unresolved > resolved
		if (hasDraft) {
			return Codicon.commentDraft;
		} else if (threadState === CommentThreadState.Unresolved) {
			return Codicon.commentUnresolved;
		} else {
			return Codicon.comment;
		}
	}

	renderElement(node: ITreeNode<CommentNode>, index: number, templateData: ICommentThreadTemplateData): void {
		templateData.actionBar.clear();

		const commentCount = node.element.replies.length + 1;
		if (node.element.threadRelevance === CommentThreadApplicability.Outdated) {
			templateData.threadMetadata.relevance.style.display = '';
			templateData.threadMetadata.relevance.innerText = nls.localize('outdated', "Outdated");
			templateData.threadMetadata.separator.style.display = 'none';
		} else {
			templateData.threadMetadata.relevance.innerText = '';
			templateData.threadMetadata.relevance.style.display = 'none';
			templateData.threadMetadata.separator.style.display = '';
		}

		templateData.threadMetadata.icon.classList.remove(...Array.from(templateData.threadMetadata.icon.classList.values())
			.filter(value => value.startsWith('codicon')));
		// Check if any comment in the thread has draft state
		const hasDraft = node.element.thread.comments?.some(comment => comment.state === CommentState.Draft);
		templateData.threadMetadata.icon.classList.add(...ThemeIcon.asClassNameArray(this.getIcon(node.element.threadState, hasDraft)));
		if (node.element.threadState !== undefined) {
			const color = this.getCommentThreadWidgetStateColor(node.element.threadState, this.themeService.getColorTheme());
			templateData.threadMetadata.icon.style.setProperty(commentViewThreadStateColorVar, `${color}`);
			templateData.threadMetadata.icon.style.color = `var(${commentViewThreadStateColorVar})`;
		}
		templateData.threadMetadata.userNames.textContent = node.element.comment.userName;
		templateData.threadMetadata.timestamp.setTimestamp(node.element.comment.timestamp ? new Date(node.element.comment.timestamp) : undefined);
		const originalComment = node.element;

		templateData.threadMetadata.commentPreview.innerText = '';
		templateData.threadMetadata.commentPreview.style.height = '22px';
		if (typeof originalComment.comment.body === 'string') {
			templateData.threadMetadata.commentPreview.innerText = originalComment.comment.body;
		} else {
			const disposables = new DisposableStore();
			templateData.disposables.push(disposables);
			const renderedComment = this.getRenderedComment(originalComment.comment.body);
			templateData.disposables.push(renderedComment);
			for (let i = renderedComment.element.children.length - 1; i >= 1; i--) {
				renderedComment.element.removeChild(renderedComment.element.children[i]);
			}
			templateData.threadMetadata.commentPreview.appendChild(renderedComment.element);
			templateData.disposables.push(this.hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), templateData.threadMetadata.commentPreview, renderedComment.element.textContent ?? ''));
		}

		if (node.element.range) {
			if (node.element.range.startLineNumber === node.element.range.endLineNumber) {
				templateData.threadMetadata.range.textContent = nls.localize('commentLine', "[Ln {0}]", node.element.range.startLineNumber);
			} else {
				templateData.threadMetadata.range.textContent = nls.localize('commentRange', "[Ln {0}-{1}]", node.element.range.startLineNumber, node.element.range.endLineNumber);
			}
		}

		const menuActions = this.menus.getResourceActions(node.element);
		templateData.actionBar.push(menuActions.actions, { icon: true, label: false });
		templateData.actionBar.context = {
			commentControlHandle: node.element.controllerHandle,
			commentThreadHandle: node.element.threadHandle,
			$mid: MarshalledId.CommentThread
		} satisfies MarshalledCommentThread;

		if (!node.element.hasReply()) {
			templateData.repliesMetadata.container.style.display = 'none';
			return;
		}

		templateData.repliesMetadata.container.style.display = '';
		templateData.repliesMetadata.count.textContent = this.getCountString(commentCount);
		const lastComment = node.element.replies[node.element.replies.length - 1].comment;
		templateData.repliesMetadata.lastReplyDetail.textContent = nls.localize('lastReplyFrom', "Last reply from {0}", lastComment.userName);
		templateData.repliesMetadata.timestamp.setTimestamp(lastComment.timestamp ? new Date(lastComment.timestamp) : undefined);
	}

	private getCommentThreadWidgetStateColor(state: CommentThreadState | undefined, theme: IColorTheme): Color | undefined {
		return (state !== undefined) ? getCommentThreadStateIconColor(state, theme) : undefined;
	}

	disposeTemplate(templateData: ICommentThreadTemplateData): void {
		templateData.disposables.forEach(disposeable => disposeable.dispose());
		templateData.actionBar.dispose();
	}
}

export interface ICommentsListOptions extends IWorkbenchAsyncDataTreeOptions<any, any> {
	overrideStyles?: IStyleOverride<IListStyles>;
}

const enum FilterDataType {
	Resource,
	Comment
}

interface ResourceFilterData {
	type: FilterDataType.Resource;
	uriMatches: IMatch[];
}

interface CommentFilterData {
	type: FilterDataType.Comment;
	textMatches: IMatch[];
}

type FilterData = ResourceFilterData | CommentFilterData;

export class Filter implements ITreeFilter<ResourceWithCommentThreads | CommentNode, FilterData> {

	constructor(public options: FilterOptions) { }

	filter(element: ResourceWithCommentThreads | CommentNode, parentVisibility: TreeVisibility): TreeFilterResult<FilterData> {
		if (this.options.filter === '' && this.options.showResolved && this.options.showUnresolved) {
			return TreeVisibility.Visible;
		}

		if (element instanceof ResourceWithCommentThreads) {
			return this.filterResourceMarkers(element);
		} else {
			return this.filterCommentNode(element, parentVisibility);
		}
	}

	private filterResourceMarkers(resourceMarkers: ResourceWithCommentThreads): TreeFilterResult<FilterData> {
		// Filter by text. Do not apply negated filters on resources instead use exclude patterns
		if (this.options.textFilter.text && !this.options.textFilter.negate) {
			const uriMatches = FilterOptions._filter(this.options.textFilter.text, basename(resourceMarkers.resource));
			if (uriMatches) {
				return { visibility: true, data: { type: FilterDataType.Resource, uriMatches: uriMatches || [] } };
			}
		}

		return TreeVisibility.Recurse;
	}

	private filterCommentNode(comment: CommentNode, parentVisibility: TreeVisibility): TreeFilterResult<FilterData> {
		const matchesResolvedState = (comment.threadState === undefined) || (this.options.showResolved && CommentThreadState.Resolved === comment.threadState) ||
			(this.options.showUnresolved && CommentThreadState.Unresolved === comment.threadState);

		if (!matchesResolvedState) {
			return false;
		}

		if (!this.options.textFilter.text) {
			return true;
		}

		const textMatches =
			// Check body of comment for value
			FilterOptions._messageFilter(this.options.textFilter.text, typeof comment.comment.body === 'string' ? comment.comment.body : comment.comment.body.value)
			// Check first user for value
			|| FilterOptions._messageFilter(this.options.textFilter.text, comment.comment.userName)
			// Check all replies for value
			|| (comment.replies.map(reply => {
				// Check user for value
				return FilterOptions._messageFilter(this.options.textFilter.text, reply.comment.userName)
					// Check body of reply for value
					|| FilterOptions._messageFilter(this.options.textFilter.text, typeof reply.comment.body === 'string' ? reply.comment.body : reply.comment.body.value);
			}).filter(value => !!value) as IMatch[][]).flat();

		// Matched and not negated
		if (textMatches.length && !this.options.textFilter.negate) {
			return { visibility: true, data: { type: FilterDataType.Comment, textMatches } };
		}

		// Matched and negated - exclude it only if parent visibility is not set
		if (textMatches.length && this.options.textFilter.negate && parentVisibility === TreeVisibility.Recurse) {
			return false;
		}

		// Not matched and negated - include it only if parent visibility is not set
		if ((textMatches.length === 0) && this.options.textFilter.negate && parentVisibility === TreeVisibility.Recurse) {
			return true;
		}

		return parentVisibility;
	}
}

export class CommentsList extends WorkbenchObjectTree<CommentsModel | ResourceWithCommentThreads | CommentNode, any> {
	private readonly menus: CommentsMenus;

	constructor(
		labels: ResourceLabels,
		container: HTMLElement,
		options: ICommentsListOptions,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IListService listService: IListService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IConfigurationService configurationService: IConfigurationService,
		@IContextMenuService private readonly contextMenuService: IContextMenuService,
		@IKeybindingService private readonly keybindingService: IKeybindingService
	) {
		const delegate = new CommentsModelVirtualDelegate();
		const actionViewItemProvider = createActionViewItem.bind(undefined, instantiationService);
		const menus = instantiationService.createInstance(CommentsMenus);
		menus.setContextKeyService(contextKeyService);
		const renderers = [
			instantiationService.createInstance(ResourceWithCommentsRenderer, labels),
			instantiationService.createInstance(CommentNodeRenderer, actionViewItemProvider, menus)
		];

		super(
			'CommentsTree',
			container,
			delegate,
			renderers,
			{
				accessibilityProvider: options.accessibilityProvider,
				identityProvider: {
					getId: (element: any) => {
						if (element instanceof CommentsModel) {
							return 'root';
						}
						if (element instanceof ResourceWithCommentThreads) {
							return `${element.uniqueOwner}-${element.id}`;
						}
						if (element instanceof CommentNode) {
							return `${element.uniqueOwner}-${element.resource.toString()}-${element.threadId}-${element.comment.uniqueIdInThread}` + (element.isRoot ? '-root' : '');
						}
						return '';
					}
				},
				expandOnlyOnTwistieClick: true,
				collapseByDefault: false,
				overrideStyles: options.overrideStyles,
				filter: options.filter,
				sorter: options.sorter,
				findWidgetEnabled: false,
				multipleSelectionSupport: false,
			},
			instantiationService,
			contextKeyService,
			listService,
			configurationService,
		);
		this.menus = menus;
		this.disposables.add(this.onContextMenu(e => this.commentsOnContextMenu(e)));
	}

	private commentsOnContextMenu(treeEvent: ITreeContextMenuEvent<CommentsModel | ResourceWithCommentThreads | CommentNode | null>): void {
		const node: CommentsModel | ResourceWithCommentThreads | CommentNode | null = treeEvent.element;
		if (!(node instanceof CommentNode)) {
			return;
		}
		const event: UIEvent = treeEvent.browserEvent;

		event.preventDefault();
		event.stopPropagation();

		this.setFocus([node]);
		const actions = this.menus.getResourceContextActions(node);
		if (!actions.length) {
			return;
		}
		this.contextMenuService.showContextMenu({
			getAnchor: () => treeEvent.anchor,
			getActions: () => actions,
			getActionViewItem: (action) => {
				const keybinding = this.keybindingService.lookupKeybinding(action.id);
				if (keybinding) {
					return new ActionViewItem(action, action, { label: true, keybinding: keybinding.getLabel() });
				}
				return undefined;
			},
			onHide: (wasCancelled?: boolean) => {
				if (wasCancelled) {
					this.domFocus();
				}
			},
			getActionsContext: (): MarshalledCommentThreadInternal => ({
				commentControlHandle: node.controllerHandle,
				commentThreadHandle: node.threadHandle,
				$mid: MarshalledId.CommentThread,
				thread: node.thread
			})
		});
	}

	filterComments(): void {
		this.refilter();
	}

	getVisibleItemCount(): number {
		let filtered = 0;
		const root = this.getNode();

		for (const resourceNode of root.children) {
			for (const commentNode of resourceNode.children) {
				if (commentNode.visible && resourceNode.visible) {
					filtered++;
				}
			}
		}

		return filtered;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/comments/browser/commentsView.ts]---
Location: vscode-main/src/vs/workbench/contrib/comments/browser/commentsView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/panel.css';
import * as nls from '../../../../nls.js';
import * as dom from '../../../../base/browser/dom.js';
import { basename } from '../../../../base/common/resources.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { CommentNode, ICommentThreadChangedEvent, ResourceWithCommentThreads } from '../common/commentModel.js';
import { ICommentService, IWorkspaceCommentThreadsEvent } from './commentService.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { ResourceLabels } from '../../../browser/labels.js';
import { CommentsList, COMMENTS_VIEW_TITLE, Filter } from './commentsTreeViewer.js';
import { IViewPaneOptions, FilterViewPane } from '../../../browser/parts/views/viewPane.js';
import { IViewDescriptorService } from '../../../common/views.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKey, IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { CommentsViewFilterFocusContextKey, ICommentsView } from './comments.js';
import { CommentsFilters, CommentsFiltersChangeEvent, CommentsSortOrder } from './commentsViewActions.js';
import { Memento } from '../../../common/memento.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { FilterOptions } from './commentsFilterOptions.js';
import { CommentThreadApplicability, CommentThreadState } from '../../../../editor/common/languages.js';
import { revealCommentThread } from './commentsController.js';
import { registerNavigableContainer } from '../../../browser/actions/widgetNavigationCommands.js';
import { CommentsModel, threadHasMeaningfulComments, type ICommentsModel } from './commentsModel.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { AccessibilityVerbositySettingId } from '../../accessibility/browser/accessibilityConfiguration.js';
import { AccessibleViewAction } from '../../accessibility/browser/accessibleViewActions.js';
import type { ITreeElement } from '../../../../base/browser/ui/tree/tree.js';
import { IPathService } from '../../../services/path/common/pathService.js';
import { isCodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { URI } from '../../../../base/common/uri.js';
import { IRange } from '../../../../editor/common/core/range.js';

export const CONTEXT_KEY_HAS_COMMENTS = new RawContextKey<boolean>('commentsView.hasComments', false);
export const CONTEXT_KEY_SOME_COMMENTS_EXPANDED = new RawContextKey<boolean>('commentsView.someCommentsExpanded', false);
export const CONTEXT_KEY_COMMENT_FOCUSED = new RawContextKey<boolean>('commentsView.commentFocused', false);
const VIEW_STORAGE_ID = 'commentsViewState';

interface CommentsViewState {
	filter?: string;
	filterHistory?: string[];
	showResolved?: boolean;
	showUnresolved?: boolean;
	sortBy?: CommentsSortOrder;
}

type CommentsTreeNode = CommentsModel | ResourceWithCommentThreads | CommentNode;

function createResourceCommentsIterator(model: ICommentsModel): Iterable<ITreeElement<CommentsTreeNode>> {
	const result: ITreeElement<CommentsTreeNode>[] = [];

	for (const m of model.resourceCommentThreads) {
		const children = [];
		for (const r of m.commentThreads) {
			if (threadHasMeaningfulComments(r.thread)) {
				children.push({ element: r });
			}
		}
		if (children.length > 0) {
			result.push({ element: m, children });
		}
	}
	return result;
}

export class CommentsPanel extends FilterViewPane implements ICommentsView {
	private treeLabels!: ResourceLabels;
	private tree: CommentsList | undefined;
	private treeContainer!: HTMLElement;
	private messageBoxContainer!: HTMLElement;
	private totalComments: number = 0;
	private readonly hasCommentsContextKey: IContextKey<boolean>;
	private readonly someCommentsExpandedContextKey: IContextKey<boolean>;
	private readonly commentsFocusedContextKey: IContextKey<boolean>;
	private readonly filter: Filter;
	readonly filters: CommentsFilters;

	private currentHeight = 0;
	private currentWidth = 0;
	private readonly viewState: CommentsViewState;
	private readonly stateMemento: Memento<CommentsViewState>;
	private cachedFilterStats: { total: number; filtered: number } | undefined = undefined;

	readonly onDidChangeVisibility = this.onDidChangeBodyVisibility;

	get focusedCommentNode(): CommentNode | undefined {
		const focused = this.tree?.getFocus();
		if (focused?.length === 1 && focused[0] instanceof CommentNode) {
			return focused[0];
		}
		return undefined;
	}

	get focusedCommentInfo(): string | undefined {
		if (!this.focusedCommentNode) {
			return;
		}
		return this.getScreenReaderInfoForNode(this.focusedCommentNode);
	}

	focusNextNode(): void {
		if (!this.tree) {
			return;
		}
		const focused = this.tree.getFocus()?.[0];
		if (!focused) {
			return;
		}
		let next = this.tree.navigate(focused).next();
		while (next && !(next instanceof CommentNode)) {
			next = this.tree.navigate(next).next();
		}
		if (!next) {
			return;
		}
		this.tree.setFocus([next]);
	}

	focusPreviousNode(): void {
		if (!this.tree) {
			return;
		}
		const focused = this.tree.getFocus()?.[0];
		if (!focused) {
			return;
		}
		let previous = this.tree.navigate(focused).previous();
		while (previous && !(previous instanceof CommentNode)) {
			previous = this.tree.navigate(previous).previous();
		}
		if (!previous) {
			return;
		}
		this.tree.setFocus([previous]);
	}

	constructor(
		options: IViewPaneOptions,
		@IInstantiationService instantiationService: IInstantiationService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@IEditorService private readonly editorService: IEditorService,
		@IConfigurationService configurationService: IConfigurationService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IKeybindingService keybindingService: IKeybindingService,
		@IOpenerService openerService: IOpenerService,
		@IThemeService themeService: IThemeService,
		@ICommentService private readonly commentService: ICommentService,
		@IHoverService hoverService: IHoverService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@IStorageService storageService: IStorageService,
		@IPathService private readonly pathService: IPathService,
	) {
		const stateMemento = new Memento<CommentsViewState>(VIEW_STORAGE_ID, storageService);
		const viewState = stateMemento.getMemento(StorageScope.WORKSPACE, StorageTarget.MACHINE);
		super({
			...options,
			filterOptions: {
				placeholder: nls.localize('comments.filter.placeholder', "Filter (e.g. text, author)"),
				ariaLabel: nls.localize('comments.filter.ariaLabel', "Filter comments"),
				history: viewState.filterHistory || [],
				text: viewState.filter || '',
				focusContextKey: CommentsViewFilterFocusContextKey.key
			}
		}, keybindingService, contextMenuService, configurationService, contextKeyService, viewDescriptorService, instantiationService, openerService, themeService, hoverService);
		this.hasCommentsContextKey = CONTEXT_KEY_HAS_COMMENTS.bindTo(contextKeyService);
		this.someCommentsExpandedContextKey = CONTEXT_KEY_SOME_COMMENTS_EXPANDED.bindTo(contextKeyService);
		this.commentsFocusedContextKey = CONTEXT_KEY_COMMENT_FOCUSED.bindTo(contextKeyService);
		this.stateMemento = stateMemento;
		this.viewState = viewState;

		this.filters = this._register(new CommentsFilters({
			showResolved: this.viewState.showResolved !== false,
			showUnresolved: this.viewState.showUnresolved !== false,
			sortBy: this.viewState.sortBy ?? CommentsSortOrder.ResourceAscending,
		}, this.contextKeyService));
		this.filter = new Filter(new FilterOptions(this.filterWidget.getFilterText(), this.filters.showResolved, this.filters.showUnresolved));

		this._register(this.filters.onDidChange((event: CommentsFiltersChangeEvent) => {
			if (event.showResolved || event.showUnresolved) {
				this.updateFilter();
			}
			if (event.sortBy) {
				this.refresh();
			}
		}));
		this._register(this.filterWidget.onDidChangeFilterText(() => this.updateFilter()));
	}

	override saveState(): void {
		this.viewState.filter = this.filterWidget.getFilterText();
		this.viewState.filterHistory = this.filterWidget.getHistory();
		this.viewState.showResolved = this.filters.showResolved;
		this.viewState.showUnresolved = this.filters.showUnresolved;
		this.viewState.sortBy = this.filters.sortBy;
		this.stateMemento.saveMemento();
		super.saveState();
	}

	override render(): void {
		super.render();
		this._register(registerNavigableContainer({
			name: 'commentsView',
			focusNotifiers: [this, this.filterWidget],
			focusNextWidget: () => {
				if (this.filterWidget.hasFocus()) {
					this.focus();
				}
			},
			focusPreviousWidget: () => {
				if (!this.filterWidget.hasFocus()) {
					this.focusFilter();
				}
			}
		}));
	}

	public focusFilter(): void {
		this.filterWidget.focus();
	}

	public clearFilterText(): void {
		this.filterWidget.setFilterText('');
	}

	public getFilterStats(): { total: number; filtered: number } {
		if (!this.cachedFilterStats) {
			this.cachedFilterStats = {
				total: this.totalComments,
				filtered: this.tree?.getVisibleItemCount() ?? 0
			};
		}

		return this.cachedFilterStats;
	}

	private updateFilter() {
		this.filter.options = new FilterOptions(this.filterWidget.getFilterText(), this.filters.showResolved, this.filters.showUnresolved);
		this.tree?.filterComments();

		this.cachedFilterStats = undefined;
		const { total, filtered } = this.getFilterStats();
		this.filterWidget.updateBadge(total === filtered || total === 0 ? undefined : nls.localize('showing filtered results', "Showing {0} of {1}", filtered, total));
		this.filterWidget.checkMoreFilters(!this.filters.showResolved || !this.filters.showUnresolved);
	}

	protected override renderBody(container: HTMLElement): void {
		super.renderBody(container);

		container.classList.add('comments-panel');

		const domContainer = dom.append(container, dom.$('.comments-panel-container'));

		this.treeContainer = dom.append(domContainer, dom.$('.tree-container'));
		this.treeContainer.classList.add('file-icon-themable-tree', 'show-file-icons');

		this.cachedFilterStats = undefined;
		this.createTree();
		this.createMessageBox(domContainer);

		this._register(this.commentService.onDidSetAllCommentThreads(this.onAllCommentsChanged, this));
		this._register(this.commentService.onDidUpdateCommentThreads(this.onCommentsUpdated, this));
		this._register(this.commentService.onDidDeleteDataProvider(this.onDataProviderDeleted, this));

		this._register(this.onDidChangeBodyVisibility(visible => {
			if (visible) {
				this.refresh();
			}
		}));

		this.renderComments();
	}

	public override focus(): void {
		super.focus();

		const element = this.tree?.getHTMLElement();
		if (element && dom.isActiveElement(element)) {
			return;
		}

		if (!this.commentService.commentsModel.hasCommentThreads() && this.messageBoxContainer) {
			this.messageBoxContainer.focus();
		} else if (this.tree) {
			this.tree.domFocus();
		}
	}

	private renderComments(): void {
		this.treeContainer.classList.toggle('hidden', !this.commentService.commentsModel.hasCommentThreads());
		this.renderMessage();
		this.tree?.setChildren(null, createResourceCommentsIterator(this.commentService.commentsModel));
	}

	public collapseAll() {
		if (this.tree) {
			this.tree.collapseAll();
			this.tree.setSelection([]);
			this.tree.setFocus([]);
			this.tree.domFocus();
			this.tree.focusFirst();
		}
	}

	public expandAll() {
		if (this.tree) {
			this.tree.expandAll();
			this.tree.setSelection([]);
			this.tree.setFocus([]);
			this.tree.domFocus();
			this.tree.focusFirst();
		}
	}

	public get hasRendered(): boolean {
		return !!this.tree;
	}

	protected layoutBodyContent(height: number = this.currentHeight, width: number = this.currentWidth): void {
		if (this.messageBoxContainer) {
			this.messageBoxContainer.style.height = `${height}px`;
		}
		this.tree?.layout(height, width);
		this.currentHeight = height;
		this.currentWidth = width;
	}

	private createMessageBox(parent: HTMLElement): void {
		this.messageBoxContainer = dom.append(parent, dom.$('.message-box-container'));
		this.messageBoxContainer.setAttribute('tabIndex', '0');
	}

	private renderMessage(): void {
		this.messageBoxContainer.textContent = this.commentService.commentsModel.getMessage();
		this.messageBoxContainer.classList.toggle('hidden', this.commentService.commentsModel.hasCommentThreads());
	}

	private makeCommentLocationLabel(file: URI, range?: IRange) {
		const fileLabel = basename(file);
		if (!range) {
			return nls.localize('fileCommentLabel', "in {0}", fileLabel);
		}
		if (range.startLineNumber === range.endLineNumber) {
			return nls.localize('oneLineCommentLabel', "at line {0} column {1} in {2}", range.startLineNumber, range.startColumn, fileLabel);
		} else {
			return nls.localize('multiLineCommentLabel', "from line {0} to line {1} in {2}", range.startLineNumber, range.endLineNumber, fileLabel);
		}
	}

	private makeScreenReaderLabelInfo(element: CommentNode, forAriaLabel?: boolean) {
		const userName = element.comment.userName;
		const locationLabel = this.makeCommentLocationLabel(element.resource, element.range);
		const replyCountLabel = this.getReplyCountAsString(element, forAriaLabel);
		const bodyLabel = (typeof element.comment.body === 'string') ? element.comment.body : element.comment.body.value;

		return { userName, locationLabel, replyCountLabel, bodyLabel };
	}

	private getScreenReaderInfoForNode(element: CommentNode, forAriaLabel?: boolean): string {
		let accessibleViewHint = '';
		if (forAriaLabel && this.configurationService.getValue(AccessibilityVerbositySettingId.Comments)) {
			const kbLabel = this.keybindingService.lookupKeybinding(AccessibleViewAction.id)?.getAriaLabel();
			accessibleViewHint = kbLabel ? nls.localize('accessibleViewHint', "\nInspect this in the accessible view ({0}).", kbLabel) : nls.localize('acessibleViewHintNoKbOpen', "\nInspect this in the accessible view via the command Open Accessible View which is currently not triggerable via keybinding.");
		}
		const replies = this.getRepliesAsString(element, forAriaLabel);
		const editor = this.editorService.findEditors(element.resource);
		const codeEditor = this.editorService.activeEditorPane?.getControl();
		let relevantLines;
		if (element.range && editor?.length && isCodeEditor(codeEditor)) {
			relevantLines = codeEditor.getModel()?.getValueInRange(element.range);
			if (relevantLines) {
				relevantLines = '\nCorresponding code: \n' + relevantLines;
			}
		}
		if (!relevantLines) {
			relevantLines = '';
		}

		const labelInfo = this.makeScreenReaderLabelInfo(element, forAriaLabel);

		if (element.threadRelevance === CommentThreadApplicability.Outdated) {
			return nls.localize('resourceWithCommentLabelOutdated',
				"Outdated from {0}: {1}\n{2}\n{3}\n{4}",
				labelInfo.userName,
				labelInfo.bodyLabel,
				labelInfo.locationLabel,
				labelInfo.replyCountLabel,
				relevantLines
			) + replies + accessibleViewHint;
		} else {
			return nls.localize('resourceWithCommentLabel',
				"{0}: {1}\n{2}\n{3}\n{4}",
				labelInfo.userName,
				labelInfo.bodyLabel,
				labelInfo.locationLabel,
				labelInfo.replyCountLabel,
				relevantLines
			) + replies + accessibleViewHint;
		}
	}

	private getRepliesAsString(node: CommentNode, forAriaLabel?: boolean): string {
		if (!node.replies.length || forAriaLabel) {
			return '';
		}
		return '\n' + node.replies.map(reply => nls.localize('resourceWithRepliesLabel',
			"{0} {1}",
			reply.comment.userName,
			(typeof reply.comment.body === 'string') ? reply.comment.body : reply.comment.body.value)
		).join('\n');
	}

	private getReplyCountAsString(node: CommentNode, forAriaLabel?: boolean): string {
		return node.replies.length && !forAriaLabel ? nls.localize('replyCount', " {0} replies,", node.replies.length) : '';
	}

	private createTree(): void {
		this.treeLabels = this._register(this.instantiationService.createInstance(ResourceLabels, this));
		this.tree = this._register(this.instantiationService.createInstance(CommentsList, this.treeLabels, this.treeContainer, {
			overrideStyles: this.getLocationBasedColors().listOverrideStyles,
			selectionNavigation: true,
			filter: this.filter,
			sorter: {
				compare: (a: CommentsTreeNode, b: CommentsTreeNode) => {
					if (a instanceof CommentsModel || b instanceof CommentsModel) {
						return 0;
					}
					if (this.filters.sortBy === CommentsSortOrder.UpdatedAtDescending) {
						return a.lastUpdatedAt > b.lastUpdatedAt ? -1 : 1;
					} else if (this.filters.sortBy === CommentsSortOrder.ResourceAscending) {
						if (a instanceof ResourceWithCommentThreads && b instanceof ResourceWithCommentThreads) {
							const workspaceScheme = this.pathService.defaultUriScheme;
							if ((a.resource.scheme !== b.resource.scheme) && (a.resource.scheme === workspaceScheme || b.resource.scheme === workspaceScheme)) {
								// Workspace scheme should always come first
								return b.resource.scheme === workspaceScheme ? 1 : -1;
							}
							return a.resource.toString() > b.resource.toString() ? 1 : -1;
						} else if (a instanceof CommentNode && b instanceof CommentNode && a.thread.range && b.thread.range) {
							return a.thread.range?.startLineNumber > b.thread.range?.startLineNumber ? 1 : -1;
						}
					}
					return 0;
				},
			},
			keyboardNavigationLabelProvider: {
				getKeyboardNavigationLabel: (item: CommentsTreeNode) => {
					return undefined;
				}
			},
			accessibilityProvider: {
				getAriaLabel: (element: any): string => {
					if (element instanceof CommentsModel) {
						return nls.localize('rootCommentsLabel', "Comments for current workspace");
					}
					if (element instanceof ResourceWithCommentThreads) {
						return nls.localize('resourceWithCommentThreadsLabel', "Comments in {0}, full path {1}", basename(element.resource), element.resource.fsPath);
					}
					if (element instanceof CommentNode) {
						return this.getScreenReaderInfoForNode(element, true);
					}
					return '';
				},
				getWidgetAriaLabel(): string {
					return COMMENTS_VIEW_TITLE.value;
				}
			}
		}));

		this._register(this.tree.onDidOpen(e => {
			this.openFile(e.element, e.editorOptions.pinned, e.editorOptions.preserveFocus, e.sideBySide);
		}));


		this._register(this.tree.onDidChangeModel(() => {
			this.updateSomeCommentsExpanded();
		}));
		this._register(this.tree.onDidChangeCollapseState(() => {
			this.updateSomeCommentsExpanded();
		}));
		this._register(this.tree.onDidFocus(() => this.commentsFocusedContextKey.set(true)));
		this._register(this.tree.onDidBlur(() => this.commentsFocusedContextKey.set(false)));
	}

	private openFile(element: any, pinned?: boolean, preserveFocus?: boolean, sideBySide?: boolean): void {
		if (!element) {
			return;
		}

		if (!(element instanceof ResourceWithCommentThreads || element instanceof CommentNode)) {
			return;
		}
		const threadToReveal = element instanceof ResourceWithCommentThreads ? element.commentThreads[0].thread : element.thread;
		const commentToReveal = element instanceof ResourceWithCommentThreads ? element.commentThreads[0].comment : undefined;
		return revealCommentThread(this.commentService, this.editorService, this.uriIdentityService, threadToReveal, commentToReveal, false, pinned, preserveFocus, sideBySide);
	}

	private async refresh(): Promise<void> {
		if (!this.tree) {
			return;
		}
		if (this.isVisible()) {
			this.hasCommentsContextKey.set(this.commentService.commentsModel.hasCommentThreads());
			this.cachedFilterStats = undefined;
			this.renderComments();

			if (this.tree.getSelection().length === 0 && this.commentService.commentsModel.hasCommentThreads()) {
				const firstComment = this.commentService.commentsModel.resourceCommentThreads[0].commentThreads[0];
				if (firstComment) {
					this.tree.setFocus([firstComment]);
					this.tree.setSelection([firstComment]);
				}
			}
		}
	}

	private onAllCommentsChanged(e: IWorkspaceCommentThreadsEvent): void {
		this.cachedFilterStats = undefined;
		this.totalComments += e.commentThreads.length;

		let unresolved = 0;
		for (const thread of e.commentThreads) {
			if (thread.state === CommentThreadState.Unresolved) {
				unresolved++;
			}
		}
		this.refresh();
	}

	private onCommentsUpdated(e: ICommentThreadChangedEvent): void {
		this.cachedFilterStats = undefined;

		this.totalComments += e.added.length;
		this.totalComments -= e.removed.length;

		let unresolved = 0;
		for (const resource of this.commentService.commentsModel.resourceCommentThreads) {
			for (const thread of resource.commentThreads) {
				if (thread.threadState === CommentThreadState.Unresolved) {
					unresolved++;
				}
			}
		}
		this.refresh();
	}

	private onDataProviderDeleted(owner: string | undefined): void {
		this.cachedFilterStats = undefined;
		this.totalComments = 0;
		this.refresh();
	}

	private updateSomeCommentsExpanded() {
		this.someCommentsExpandedContextKey.set(this.isSomeCommentsExpanded());
	}

	public areAllCommentsExpanded(): boolean {
		if (!this.tree) {
			return false;
		}
		const navigator = this.tree.navigate();
		while (navigator.next()) {
			if (this.tree.isCollapsed(navigator.current())) {
				return false;
			}
		}
		return true;
	}

	public isSomeCommentsExpanded(): boolean {
		if (!this.tree) {
			return false;
		}
		const navigator = this.tree.navigate();
		while (navigator.next()) {
			if (!this.tree.isCollapsed(navigator.current())) {
				return true;
			}
		}
		return false;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/comments/browser/commentsViewActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/comments/browser/commentsViewActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { localize } from '../../../../nls.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { ContextKeyExpr, IContextKey, IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { Event, Emitter } from '../../../../base/common/event.js';
import { CommentsViewFilterFocusContextKey, ICommentsView } from './comments.js';
import { MenuId, MenuRegistry, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { ViewAction } from '../../../browser/parts/views/viewPane.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { COMMENTS_VIEW_ID } from './commentsTreeViewer.js';
import { FocusedViewContext } from '../../../common/contextkeys.js';
import { viewFilterSubmenu } from '../../../browser/parts/views/viewFilter.js';
import { Codicon } from '../../../../base/common/codicons.js';

export const enum CommentsSortOrder {
	ResourceAscending = 'resourceAscending',
	UpdatedAtDescending = 'updatedAtDescending',
}


const CONTEXT_KEY_SHOW_RESOLVED = new RawContextKey<boolean>('commentsView.showResolvedFilter', true);
const CONTEXT_KEY_SHOW_UNRESOLVED = new RawContextKey<boolean>('commentsView.showUnResolvedFilter', true);
const CONTEXT_KEY_SORT_BY = new RawContextKey<CommentsSortOrder>('commentsView.sortBy', CommentsSortOrder.ResourceAscending);

export interface CommentsFiltersChangeEvent {
	showResolved?: boolean;
	showUnresolved?: boolean;
	sortBy?: CommentsSortOrder;
}

interface CommentsFiltersOptions {
	showResolved: boolean;
	showUnresolved: boolean;
	sortBy: CommentsSortOrder;
}

export class CommentsFilters extends Disposable {

	private readonly _onDidChange: Emitter<CommentsFiltersChangeEvent> = this._register(new Emitter<CommentsFiltersChangeEvent>());
	readonly onDidChange: Event<CommentsFiltersChangeEvent> = this._onDidChange.event;
	private readonly _showUnresolved: IContextKey<boolean>;
	private readonly _showResolved: IContextKey<boolean>;
	private readonly _sortBy: IContextKey<CommentsSortOrder>;

	constructor(options: CommentsFiltersOptions, private readonly contextKeyService: IContextKeyService) {
		super();
		this._showUnresolved = CONTEXT_KEY_SHOW_UNRESOLVED.bindTo(this.contextKeyService);
		this._showResolved = CONTEXT_KEY_SHOW_RESOLVED.bindTo(this.contextKeyService);
		this._sortBy = CONTEXT_KEY_SORT_BY.bindTo(this.contextKeyService);
		this._showResolved.set(options.showResolved);
		this._showUnresolved.set(options.showUnresolved);
		this._sortBy.set(options.sortBy);
	}

	get showUnresolved(): boolean {
		return !!this._showUnresolved.get();
	}
	set showUnresolved(showUnresolved: boolean) {
		if (this._showUnresolved.get() !== showUnresolved) {
			this._showUnresolved.set(showUnresolved);
			this._onDidChange.fire({ showUnresolved: true });
		}
	}

	get showResolved(): boolean {
		return !!this._showResolved.get();
	}
	set showResolved(showResolved: boolean) {
		if (this._showResolved.get() !== showResolved) {
			this._showResolved.set(showResolved);
			this._onDidChange.fire({ showResolved: true });
		}
	}

	get sortBy(): CommentsSortOrder {
		return this._sortBy.get() ?? CommentsSortOrder.ResourceAscending;
	}
	set sortBy(sortBy: CommentsSortOrder) {
		if (this._sortBy.get() !== sortBy) {
			this._sortBy.set(sortBy);
			this._onDidChange.fire({ sortBy });
		}
	}
}

registerAction2(class extends ViewAction<ICommentsView> {
	constructor() {
		super({
			id: 'commentsFocusViewFromFilter',
			title: localize('focusCommentsList', "Focus Comments view"),
			keybinding: {
				when: CommentsViewFilterFocusContextKey,
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.CtrlCmd | KeyCode.DownArrow
			},
			viewId: COMMENTS_VIEW_ID
		});
	}
	async runInView(serviceAccessor: ServicesAccessor, commentsView: ICommentsView): Promise<void> {
		commentsView.focus();
	}
});

registerAction2(class extends ViewAction<ICommentsView> {
	constructor() {
		super({
			id: 'commentsClearFilterText',
			title: localize('commentsClearFilterText', "Clear filter text"),
			keybinding: {
				when: CommentsViewFilterFocusContextKey,
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyCode.Escape
			},
			viewId: COMMENTS_VIEW_ID
		});
	}
	async runInView(serviceAccessor: ServicesAccessor, commentsView: ICommentsView): Promise<void> {
		commentsView.clearFilterText();
	}
});

registerAction2(class extends ViewAction<ICommentsView> {
	constructor() {
		super({
			id: 'commentsFocusFilter',
			title: localize('focusCommentsFilter', "Focus comments filter"),
			keybinding: {
				when: FocusedViewContext.isEqualTo(COMMENTS_VIEW_ID),
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.CtrlCmd | KeyCode.KeyF
			},
			viewId: COMMENTS_VIEW_ID
		});
	}
	async runInView(serviceAccessor: ServicesAccessor, commentsView: ICommentsView): Promise<void> {
		commentsView.focusFilter();
	}
});

registerAction2(class extends ViewAction<ICommentsView> {
	constructor() {
		super({
			id: `workbench.actions.${COMMENTS_VIEW_ID}.toggleUnResolvedComments`,
			title: localize('toggle unresolved', "Show Unresolved"),
			category: localize('comments', "Comments"),
			toggled: {
				condition: CONTEXT_KEY_SHOW_UNRESOLVED,
				title: localize('unresolved', "Show Unresolved"),
			},
			menu: {
				id: viewFilterSubmenu,
				group: '1_filter',
				when: ContextKeyExpr.equals('view', COMMENTS_VIEW_ID),
				order: 1
			},
			viewId: COMMENTS_VIEW_ID
		});
	}

	async runInView(serviceAccessor: ServicesAccessor, view: ICommentsView): Promise<void> {
		view.filters.showUnresolved = !view.filters.showUnresolved;
	}
});

registerAction2(class extends ViewAction<ICommentsView> {
	constructor() {
		super({
			id: `workbench.actions.${COMMENTS_VIEW_ID}.toggleResolvedComments`,
			title: localize('toggle resolved', "Show Resolved"),
			category: localize('comments', "Comments"),
			toggled: {
				condition: CONTEXT_KEY_SHOW_RESOLVED,
				title: localize('resolved', "Show Resolved"),
			},
			menu: {
				id: viewFilterSubmenu,
				group: '1_filter',
				when: ContextKeyExpr.equals('view', COMMENTS_VIEW_ID),
				order: 1
			},
			viewId: COMMENTS_VIEW_ID
		});
	}

	async runInView(serviceAccessor: ServicesAccessor, view: ICommentsView): Promise<void> {
		view.filters.showResolved = !view.filters.showResolved;
	}
});

const commentSortSubmenu = new MenuId('submenu.filter.commentSort');
MenuRegistry.appendMenuItem(viewFilterSubmenu, {
	submenu: commentSortSubmenu,
	title: localize('comment sorts', "Sort By"),
	group: '2_sort',
	icon: Codicon.history,
	when: ContextKeyExpr.equals('view', COMMENTS_VIEW_ID),
});

registerAction2(class extends ViewAction<ICommentsView> {
	constructor() {
		super({
			id: `workbench.actions.${COMMENTS_VIEW_ID}.toggleSortByUpdatedAt`,
			title: localize('toggle sorting by updated at', "Updated Time"),
			category: localize('comments', "Comments"),
			icon: Codicon.history,
			viewId: COMMENTS_VIEW_ID,
			toggled: {
				condition: ContextKeyExpr.equals(CONTEXT_KEY_SORT_BY.key, CommentsSortOrder.UpdatedAtDescending),
				title: localize('sorting by updated at', "Updated Time"),
			},
			menu: {
				id: commentSortSubmenu,
				group: 'navigation',
				order: 1,
				isHiddenByDefault: false,
			},
		});
	}

	async runInView(serviceAccessor: ServicesAccessor, view: ICommentsView): Promise<void> {
		view.filters.sortBy = CommentsSortOrder.UpdatedAtDescending;
	}
});

registerAction2(class extends ViewAction<ICommentsView> {
	constructor() {
		super({
			id: `workbench.actions.${COMMENTS_VIEW_ID}.toggleSortByResource`,
			title: localize('toggle sorting by resource', "Position in File"),
			category: localize('comments', "Comments"),
			icon: Codicon.history,
			viewId: COMMENTS_VIEW_ID,
			toggled: {
				condition: ContextKeyExpr.equals(CONTEXT_KEY_SORT_BY.key, CommentsSortOrder.ResourceAscending),
				title: localize('sorting by position in file', "Position in File"),
			},
			menu: {
				id: commentSortSubmenu,
				group: 'navigation',
				order: 0,
				isHiddenByDefault: false,
			},
		});
	}

	async runInView(serviceAccessor: ServicesAccessor, view: ICommentsView): Promise<void> {
		view.filters.sortBy = CommentsSortOrder.ResourceAscending;
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/comments/browser/commentThreadAdditionalActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/comments/browser/commentThreadAdditionalActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';

import { IAction } from '../../../../base/common/actions.js';
import { IMenu, SubmenuItemAction } from '../../../../platform/actions/common/actions.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { MarshalledId } from '../../../../base/common/marshallingIds.js';
import { IRange } from '../../../../editor/common/core/range.js';
import * as languages from '../../../../editor/common/languages.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { CommentFormActions } from './commentFormActions.js';
import { CommentMenus } from './commentMenus.js';
import { ICellRange } from '../../notebook/common/notebookRange.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';

export class CommentThreadAdditionalActions<T extends IRange | ICellRange> extends Disposable {
	private _container: HTMLElement | null;
	private _buttonBar: HTMLElement | null;
	private _commentFormActions!: CommentFormActions;

	constructor(
		container: HTMLElement,
		private _commentThread: languages.CommentThread<T>,
		private _contextKeyService: IContextKeyService,
		private _commentMenus: CommentMenus,
		private _actionRunDelegate: (() => void) | null,
		@IKeybindingService private _keybindingService: IKeybindingService,
		@IContextMenuService private _contextMenuService: IContextMenuService,
	) {
		super();

		this._container = dom.append(container, dom.$('.comment-additional-actions'));
		dom.append(this._container, dom.$('.section-separator'));

		this._buttonBar = dom.append(this._container, dom.$('.button-bar'));
		this._createAdditionalActions(this._buttonBar);
	}

	private _showMenu() {
		this._container?.classList.remove('hidden');
	}

	private _hideMenu() {
		this._container?.classList.add('hidden');
	}

	private _enableDisableMenu(menu: IMenu) {
		const groups = menu.getActions({ shouldForwardArgs: true });

		// Show the menu if at least one action is enabled.
		for (const group of groups) {
			const [, actions] = group;
			for (const action of actions) {
				if (action.enabled) {
					this._showMenu();
					return;
				}

				for (const subAction of (action as SubmenuItemAction).actions ?? []) {
					if (subAction.enabled) {
						this._showMenu();
						return;
					}
				}
			}
		}

		this._hideMenu();
	}


	private _createAdditionalActions(container: HTMLElement) {
		const menu = this._commentMenus.getCommentThreadAdditionalActions(this._contextKeyService);
		this._register(menu);
		this._register(menu.onDidChange(() => {
			this._commentFormActions.setActions(menu, /*hasOnlySecondaryActions*/ true);
			this._enableDisableMenu(menu);
		}));

		this._commentFormActions = new CommentFormActions(this._keybindingService, this._contextKeyService, this._contextMenuService, container, async (action: IAction) => {
			this._actionRunDelegate?.();

			action.run({
				thread: this._commentThread,
				$mid: MarshalledId.CommentThreadInstance
			});
		}, 4, true);

		this._register(this._commentFormActions);
		this._commentFormActions.setActions(menu, /*hasOnlySecondaryActions*/ true);
		this._enableDisableMenu(menu);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/comments/browser/commentThreadBody.ts]---
Location: vscode-main/src/vs/workbench/contrib/comments/browser/commentThreadBody.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import * as nls from '../../../../nls.js';
import { Disposable, DisposableMap, DisposableStore } from '../../../../base/common/lifecycle.js';
import * as languages from '../../../../editor/common/languages.js';
import { Emitter } from '../../../../base/common/event.js';
import { ICommentService } from './commentService.js';
import { StandardKeyboardEvent } from '../../../../base/browser/keyboardEvent.js';
import { KeyCode } from '../../../../base/common/keyCodes.js';
import { CommentNode } from './commentNode.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { URI } from '../../../../base/common/uri.js';
import { ICommentThreadWidget } from '../common/commentThreadWidget.js';
import { IMarkdownRendererExtraOptions } from '../../../../platform/markdown/browser/markdownRenderer.js';
import { ICellRange } from '../../notebook/common/notebookRange.js';
import { IRange } from '../../../../editor/common/core/range.js';
import { LayoutableEditor } from './simpleCommentEditor.js';

export class CommentThreadBody<T extends IRange | ICellRange = IRange> extends Disposable {
	private _commentsElement!: HTMLElement;
	private _commentElements: CommentNode<T>[] = [];
	private _resizeObserver: MutationObserver | null = null;
	private _focusedComment: number | undefined = undefined;
	private _onDidResize = new Emitter<dom.Dimension>();
	onDidResize = this._onDidResize.event;

	private _commentDisposable = new DisposableMap<CommentNode<T>, DisposableStore>();

	get length() {
		return this._commentThread.comments ? this._commentThread.comments.length : 0;
	}

	get activeComment() {
		return this._commentElements.filter(node => node.isEditing)[0];
	}

	constructor(
		private readonly _parentEditor: LayoutableEditor,
		readonly owner: string,
		readonly parentResourceUri: URI,
		readonly container: HTMLElement,
		private _markdownRendererOptions: IMarkdownRendererExtraOptions,
		private _commentThread: languages.CommentThread<T>,
		private _pendingEdits: { [key: number]: languages.PendingComment } | undefined,
		private _scopedInstatiationService: IInstantiationService,
		private _parentCommentThreadWidget: ICommentThreadWidget,
		@ICommentService private readonly commentService: ICommentService,
	) {
		super();

		this._register(dom.addDisposableListener(container, dom.EventType.FOCUS_IN, e => {
			// TODO @rebornix, limit T to IRange | ICellRange
			this.commentService.setActiveEditingCommentThread(this._commentThread);
		}));
	}

	focus(commentUniqueId?: number) {
		if (commentUniqueId !== undefined) {
			const comment = this._commentElements.find(commentNode => commentNode.comment.uniqueIdInThread === commentUniqueId);
			if (comment) {
				comment.focus();
				return;
			}
		}
		this._commentsElement.focus();
	}

	hasCommentsInEditMode() {
		return this._commentElements.some(commentNode => commentNode.isEditing);
	}

	ensureFocusIntoNewEditingComment() {
		if (this._commentElements.length === 1 && this._commentElements[0].isEditing) {
			this._commentElements[0].setFocus(true);
		}
	}

	async display() {
		this._commentsElement = dom.append(this.container, dom.$('div.comments-container'));
		this._commentsElement.setAttribute('role', 'presentation');
		this._commentsElement.tabIndex = 0;
		this._updateAriaLabel();

		this._register(dom.addDisposableListener(this._commentsElement, dom.EventType.KEY_DOWN, (e) => {
			const event = new StandardKeyboardEvent(e as KeyboardEvent);
			if ((event.equals(KeyCode.UpArrow) || event.equals(KeyCode.DownArrow)) && (!this._focusedComment || !this._commentElements[this._focusedComment].isEditing)) {
				const moveFocusWithinBounds = (change: number): number => {
					if (this._focusedComment === undefined && change >= 0) { return 0; }
					if (this._focusedComment === undefined && change < 0) { return this._commentElements.length - 1; }
					const newIndex = this._focusedComment! + change;
					return Math.min(Math.max(0, newIndex), this._commentElements.length - 1);
				};

				this._setFocusedComment(event.equals(KeyCode.UpArrow) ? moveFocusWithinBounds(-1) : moveFocusWithinBounds(1));
			}
		}));

		this._commentDisposable.clearAndDisposeAll();
		this._commentElements = [];
		if (this._commentThread.comments) {
			for (const comment of this._commentThread.comments) {
				const newCommentNode = this.createNewCommentNode(comment);

				this._commentElements.push(newCommentNode);
				this._commentsElement.appendChild(newCommentNode.domNode);
				if (comment.mode === languages.CommentMode.Editing) {
					await newCommentNode.switchToEditMode();
				}
			}
		}

		this._resizeObserver = new MutationObserver(this._refresh.bind(this));

		this._resizeObserver.observe(this.container, {
			attributes: true,
			childList: true,
			characterData: true,
			subtree: true
		});
	}

	private _containerClientArea: dom.Dimension | undefined = undefined;
	private _refresh() {
		const dimensions = dom.getClientArea(this.container);
		if ((dimensions.height === 0 && dimensions.width === 0) || (dom.Dimension.equals(this._containerClientArea, dimensions))) {
			return;
		}
		this._containerClientArea = dimensions;
		this._onDidResize.fire(dimensions);
	}

	getDimensions() {
		return dom.getClientArea(this.container);
	}

	layout(widthInPixel?: number) {
		this._commentElements.forEach(element => {
			element.layout(widthInPixel);
		});
	}

	getPendingEdits(): { [key: number]: languages.PendingComment } {
		const pendingEdits: { [key: number]: languages.PendingComment } = {};
		this._commentElements.forEach(element => {
			if (element.isEditing) {
				const pendingEdit = element.getPendingEdit();
				if (pendingEdit) {
					pendingEdits[element.comment.uniqueIdInThread] = pendingEdit;
				}
			}
		});

		return pendingEdits;
	}

	getCommentCoords(commentUniqueId: number): { thread: dom.IDomNodePagePosition; comment: dom.IDomNodePagePosition } | undefined {
		const matchedNode = this._commentElements.filter(commentNode => commentNode.comment.uniqueIdInThread === commentUniqueId);
		if (matchedNode && matchedNode.length) {
			const commentThreadCoords = dom.getDomNodePagePosition(this._commentElements[0].domNode);
			const commentCoords = dom.getDomNodePagePosition(matchedNode[0].domNode);
			return {
				thread: commentThreadCoords,
				comment: commentCoords
			};
		}

		return;
	}

	async updateCommentThread(commentThread: languages.CommentThread<T>, preserveFocus: boolean) {
		const oldCommentsLen = this._commentElements.length;
		const newCommentsLen = commentThread.comments ? commentThread.comments.length : 0;

		const commentElementsToDel: CommentNode<T>[] = [];
		const commentElementsToDelIndex: number[] = [];
		for (let i = 0; i < oldCommentsLen; i++) {
			const comment = this._commentElements[i].comment;
			const newComment = commentThread.comments ? commentThread.comments.filter(c => c.uniqueIdInThread === comment.uniqueIdInThread) : [];

			if (newComment.length) {
				this._commentElements[i].update(newComment[0]);
			} else {
				commentElementsToDelIndex.push(i);
				commentElementsToDel.push(this._commentElements[i]);
			}
		}

		// del removed elements
		for (let i = commentElementsToDel.length - 1; i >= 0; i--) {
			const commentToDelete = commentElementsToDel[i];
			this._commentDisposable.deleteAndDispose(commentToDelete);

			this._commentElements.splice(commentElementsToDelIndex[i], 1);
			commentToDelete.domNode.remove();
		}


		let lastCommentElement: HTMLElement | null = null;
		const newCommentNodeList: CommentNode<T>[] = [];
		const newCommentsInEditMode: CommentNode<T>[] = [];
		const startEditing: Promise<void>[] = [];

		for (let i = newCommentsLen - 1; i >= 0; i--) {
			const currentComment = commentThread.comments![i];
			const oldCommentNode = this._commentElements.filter(commentNode => commentNode.comment.uniqueIdInThread === currentComment.uniqueIdInThread);
			if (oldCommentNode.length) {
				lastCommentElement = oldCommentNode[0].domNode;
				newCommentNodeList.unshift(oldCommentNode[0]);
			} else {
				const newElement = this.createNewCommentNode(currentComment);

				newCommentNodeList.unshift(newElement);
				if (lastCommentElement) {
					this._commentsElement.insertBefore(newElement.domNode, lastCommentElement);
					lastCommentElement = newElement.domNode;
				} else {
					this._commentsElement.appendChild(newElement.domNode);
					lastCommentElement = newElement.domNode;
				}

				if (currentComment.mode === languages.CommentMode.Editing) {
					startEditing.push(newElement.switchToEditMode());
					newCommentsInEditMode.push(newElement);
				}
			}
		}

		this._commentThread = commentThread;
		this._commentElements = newCommentNodeList;
		// Start editing *after* updating the thread and elements to avoid a sequencing issue https://github.com/microsoft/vscode/issues/239191
		await Promise.all(startEditing);

		if (newCommentsInEditMode.length) {
			const lastIndex = this._commentElements.indexOf(newCommentsInEditMode[newCommentsInEditMode.length - 1]);
			this._focusedComment = lastIndex;
		}

		this._updateAriaLabel();
		if (!preserveFocus) {
			this._setFocusedComment(this._focusedComment);
		}
	}

	private _updateAriaLabel() {
		if (this._commentThread.isDocumentCommentThread()) {
			if (this._commentThread.range) {
				this._commentsElement.ariaLabel = nls.localize('commentThreadAria.withRange', "Comment thread with {0} comments on lines {1} through {2}. {3}.",
					this._commentThread.comments?.length, this._commentThread.range.startLineNumber, this._commentThread.range.endLineNumber,
					this._commentThread.label);
			} else {
				this._commentsElement.ariaLabel = nls.localize('commentThreadAria.document', "Comment thread with {0} comments on the entire document. {1}.",
					this._commentThread.comments?.length, this._commentThread.label);
			}
		} else {
			this._commentsElement.ariaLabel = nls.localize('commentThreadAria', "Comment thread with {0} comments. {1}.",
				this._commentThread.comments?.length, this._commentThread.label);
		}
	}

	private _setFocusedComment(value: number | undefined) {
		if (this._focusedComment !== undefined) {
			this._commentElements[this._focusedComment]?.setFocus(false);
		}

		if (this._commentElements.length === 0 || value === undefined) {
			this._focusedComment = undefined;
		} else {
			this._focusedComment = Math.min(value, this._commentElements.length - 1);
			this._commentElements[this._focusedComment].setFocus(true);
		}
	}

	private createNewCommentNode(comment: languages.Comment): CommentNode<T> {
		const newCommentNode = this._scopedInstatiationService.createInstance(CommentNode,
			this._parentEditor,
			this._commentThread,
			comment,
			this._pendingEdits ? this._pendingEdits[comment.uniqueIdInThread] : undefined,
			this.owner,
			this.parentResourceUri,
			this._parentCommentThreadWidget,
			this._markdownRendererOptions) as unknown as CommentNode<T>;

		const disposables: DisposableStore = new DisposableStore();
		disposables.add(newCommentNode.onDidClick(clickedNode =>
			this._setFocusedComment(this._commentElements.findIndex(commentNode => commentNode.comment.uniqueIdInThread === clickedNode.comment.uniqueIdInThread))
		));
		disposables.add(newCommentNode);
		this._commentDisposable.set(newCommentNode, disposables);

		return newCommentNode;
	}

	public override dispose(): void {
		super.dispose();

		if (this._resizeObserver) {
			this._resizeObserver.disconnect();
			this._resizeObserver = null;
		}

		this._commentDisposable.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/comments/browser/commentThreadHeader.ts]---
Location: vscode-main/src/vs/workbench/contrib/comments/browser/commentThreadHeader.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { ActionBar } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { Action, ActionRunner } from '../../../../base/common/actions.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { Disposable, IDisposable, MutableDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import * as strings from '../../../../base/common/strings.js';
import * as languages from '../../../../editor/common/languages.js';
import { IRange } from '../../../../editor/common/core/range.js';
import * as nls from '../../../../nls.js';
import { createActionViewItem } from '../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { IMenu, MenuItemAction, SubmenuItemAction } from '../../../../platform/actions/common/actions.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { CommentMenus } from './commentMenus.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { MarshalledId } from '../../../../base/common/marshallingIds.js';
import { StandardMouseEvent } from '../../../../base/browser/mouseEvent.js';
import { MarshalledCommentThread } from '../../../common/comments.js';
import { CommentCommandId } from '../common/commentCommandIds.js';

const collapseIcon = registerIcon('review-comment-collapse', Codicon.chevronUp, nls.localize('collapseIcon', 'Icon to collapse a review comment.'));
const COLLAPSE_ACTION_CLASS = 'expand-review-action ' + ThemeIcon.asClassName(collapseIcon);
const DELETE_ACTION_CLASS = 'expand-review-action ' + ThemeIcon.asClassName(Codicon.trashcan);

function threadHasComments(comments: ReadonlyArray<languages.Comment> | undefined): comments is ReadonlyArray<languages.Comment> {
	return !!comments && comments.length > 0;
}

export class CommentThreadHeader<T = IRange> extends Disposable {
	private _headElement: HTMLElement;
	private _headingLabel!: HTMLElement;
	private _actionbarWidget!: ActionBar;
	private _collapseAction!: Action;
	private _contextMenuActionRunner: ActionRunner | undefined;

	constructor(
		container: HTMLElement,
		private _delegate: { collapse: () => void },
		private _commentMenus: CommentMenus,
		private _commentThread: languages.CommentThread<T>,
		@IContextKeyService private readonly _contextKeyService: IContextKeyService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IContextMenuService private readonly _contextMenuService: IContextMenuService
	) {
		super();
		this._headElement = dom.$('.head');
		container.appendChild(this._headElement);
		this._register(toDisposable(() => this._headElement.remove()));
		this._fillHead();
	}

	protected _fillHead(): void {
		const titleElement = dom.append(this._headElement, dom.$('.review-title'));

		this._headingLabel = dom.append(titleElement, dom.$('span.filename'));
		this.createThreadLabel();

		const actionsContainer = dom.append(this._headElement, dom.$('.review-actions'));
		this._actionbarWidget = new ActionBar(actionsContainer, {
			actionViewItemProvider: createActionViewItem.bind(undefined, this._instantiationService)
		});

		this._register(this._actionbarWidget);

		const collapseClass = threadHasComments(this._commentThread.comments) ? COLLAPSE_ACTION_CLASS : DELETE_ACTION_CLASS;
		this._collapseAction = new Action(CommentCommandId.Hide, nls.localize('label.collapse', "Collapse"), collapseClass, true, () => this._delegate.collapse());
		if (!threadHasComments(this._commentThread.comments)) {
			const commentsChanged: MutableDisposable<IDisposable> = this._register(new MutableDisposable());
			commentsChanged.value = this._commentThread.onDidChangeComments(() => {
				if (threadHasComments(this._commentThread.comments)) {
					this._collapseAction.class = COLLAPSE_ACTION_CLASS;
					commentsChanged.clear();
				}
			});
		}

		const menu = this._commentMenus.getCommentThreadTitleActions(this._contextKeyService);
		this._register(menu);
		this.setActionBarActions(menu);

		this._register(menu);
		this._register(menu.onDidChange(e => {
			this.setActionBarActions(menu);
		}));

		this._register(dom.addDisposableListener(this._headElement, dom.EventType.CONTEXT_MENU, e => {
			return this.onContextMenu(e);
		}));

		this._actionbarWidget.context = this._commentThread;
	}

	private setActionBarActions(menu: IMenu): void {
		const groups = menu.getActions({ shouldForwardArgs: true }).reduce((r, [, actions]) => [...r, ...actions], <(MenuItemAction | SubmenuItemAction)[]>[]);
		this._actionbarWidget.clear();
		this._actionbarWidget.push([...groups, this._collapseAction], { label: false, icon: true });
	}

	updateCommentThread(commentThread: languages.CommentThread<T>) {
		this._commentThread = commentThread;

		this._actionbarWidget.context = this._commentThread;
		this.createThreadLabel();
	}

	createThreadLabel() {
		let label: string | undefined;
		label = this._commentThread.label;

		if (label === undefined) {
			if (!(this._commentThread.comments && this._commentThread.comments.length)) {
				label = nls.localize('startThread', "Start discussion");
			}
		}

		if (label) {
			this._headingLabel.textContent = strings.escape(label);
			this._headingLabel.setAttribute('aria-label', label);
		}
	}

	updateHeight(headHeight: number) {
		this._headElement.style.height = `${headHeight}px`;
		this._headElement.style.lineHeight = this._headElement.style.height;
	}

	private onContextMenu(e: MouseEvent) {
		const actions = this._commentMenus.getCommentThreadTitleContextActions(this._contextKeyService);
		if (!actions.length) {
			return;
		}
		const event = new StandardMouseEvent(dom.getWindow(this._headElement), e);
		if (!this._contextMenuActionRunner) {
			this._contextMenuActionRunner = this._register(new ActionRunner());
		}
		this._contextMenuService.showContextMenu({
			getAnchor: () => event,
			getActions: () => actions,
			actionRunner: this._contextMenuActionRunner,
			getActionsContext: (): MarshalledCommentThread => {
				return {
					commentControlHandle: this._commentThread.controllerHandle,
					commentThreadHandle: this._commentThread.commentThreadHandle,
					$mid: MarshalledId.CommentThread
				};
			},
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/comments/browser/commentThreadRangeDecorator.ts]---
Location: vscode-main/src/vs/workbench/contrib/comments/browser/commentThreadRangeDecorator.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, dispose, IDisposable } from '../../../../base/common/lifecycle.js';
import { ICodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { IRange } from '../../../../editor/common/core/range.js';
import { CommentThread, CommentThreadCollapsibleState } from '../../../../editor/common/languages.js';
import { IModelDecorationOptions, IModelDeltaDecoration } from '../../../../editor/common/model.js';
import { ModelDecorationOptions } from '../../../../editor/common/model/textModel.js';
import { ICommentInfo, ICommentService } from './commentService.js';

class CommentThreadRangeDecoration implements IModelDeltaDecoration {
	private _decorationId: string | undefined;

	public get id(): string | undefined {
		return this._decorationId;
	}

	public set id(id: string | undefined) {
		this._decorationId = id;
	}

	constructor(
		public readonly range: IRange,
		public readonly options: ModelDecorationOptions) {
	}
}

export class CommentThreadRangeDecorator extends Disposable {
	private static description = 'comment-thread-range-decorator';
	private decorationOptions: ModelDecorationOptions;
	private activeDecorationOptions: ModelDecorationOptions;
	private decorationIds: string[] = [];
	private activeDecorationIds: string[] = [];
	private editor: ICodeEditor | undefined;
	private threadCollapseStateListeners: IDisposable[] = [];
	private currentThreadCollapseStateListener: IDisposable | undefined;

	constructor(commentService: ICommentService) {
		super();
		const decorationOptions: IModelDecorationOptions = {
			description: CommentThreadRangeDecorator.description,
			isWholeLine: false,
			zIndex: 20,
			className: 'comment-thread-range',
			shouldFillLineOnLineBreak: true
		};

		this.decorationOptions = ModelDecorationOptions.createDynamic(decorationOptions);

		const activeDecorationOptions: IModelDecorationOptions = {
			description: CommentThreadRangeDecorator.description,
			isWholeLine: false,
			zIndex: 20,
			className: 'comment-thread-range-current',
			shouldFillLineOnLineBreak: true
		};

		this.activeDecorationOptions = ModelDecorationOptions.createDynamic(activeDecorationOptions);
		this._register(commentService.onDidChangeCurrentCommentThread(thread => {
			this.updateCurrent(thread);
		}));
		this._register(commentService.onDidUpdateCommentThreads(() => {
			this.updateCurrent(undefined);
		}));
	}

	private updateCurrent(thread: CommentThread<IRange> | undefined) {
		if (!this.editor || (thread?.resource && (thread.resource?.toString() !== this.editor.getModel()?.uri.toString()))) {
			return;
		}
		this.currentThreadCollapseStateListener?.dispose();
		const newDecoration: CommentThreadRangeDecoration[] = [];
		if (thread) {
			const range = thread.range;
			if (range && !((range.startLineNumber === range.endLineNumber) && (range.startColumn === range.endColumn))) {
				if (thread.collapsibleState === CommentThreadCollapsibleState.Expanded) {
					this.currentThreadCollapseStateListener = thread.onDidChangeCollapsibleState(state => {
						if (state === CommentThreadCollapsibleState.Collapsed) {
							this.updateCurrent(undefined);
						}
					});
					newDecoration.push(new CommentThreadRangeDecoration(range, this.activeDecorationOptions));
				}
			}
		}
		this.editor.changeDecorations((changeAccessor) => {
			this.activeDecorationIds = changeAccessor.deltaDecorations(this.activeDecorationIds, newDecoration);
			newDecoration.forEach((decoration, index) => decoration.id = this.decorationIds[index]);
		});
	}

	public update(editor: ICodeEditor | undefined, commentInfos: ICommentInfo[]) {
		const model = editor?.getModel();
		if (!editor || !model) {
			return;
		}
		dispose(this.threadCollapseStateListeners);
		this.editor = editor;

		const commentThreadRangeDecorations: CommentThreadRangeDecoration[] = [];
		for (const info of commentInfos) {
			info.threads.forEach(thread => {
				if (thread.isDisposed) {
					return;
				}

				const range = thread.range;
				// We only want to show a range decoration when there's the range spans either multiple lines
				// or, when is spans multiple characters on the sample line
				if (!range || (range.startLineNumber === range.endLineNumber) && (range.startColumn === range.endColumn)) {
					return;
				}

				this.threadCollapseStateListeners.push(thread.onDidChangeCollapsibleState(() => {
					this.update(editor, commentInfos);
				}));

				if (thread.collapsibleState === CommentThreadCollapsibleState.Collapsed) {
					return;
				}

				commentThreadRangeDecorations.push(new CommentThreadRangeDecoration(range, this.decorationOptions));
			});
		}

		editor.changeDecorations((changeAccessor) => {
			this.decorationIds = changeAccessor.deltaDecorations(this.decorationIds, commentThreadRangeDecorations);
			commentThreadRangeDecorations.forEach((decoration, index) => decoration.id = this.decorationIds[index]);
		});
	}

	override dispose() {
		dispose(this.threadCollapseStateListeners);
		this.currentThreadCollapseStateListener?.dispose();
		super.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/comments/browser/commentThreadWidget.ts]---
Location: vscode-main/src/vs/workbench/contrib/comments/browser/commentThreadWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/review.css';
import * as dom from '../../../../base/browser/dom.js';
import { Emitter } from '../../../../base/common/event.js';
import { Disposable, dispose, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import * as languages from '../../../../editor/common/languages.js';
import { IMarkdownRendererExtraOptions } from '../../../../platform/markdown/browser/markdownRenderer.js';
import { IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { CommentMenus } from './commentMenus.js';
import { CommentReply } from './commentReply.js';
import { ICommentService } from './commentService.js';
import { CommentThreadBody } from './commentThreadBody.js';
import { CommentThreadHeader } from './commentThreadHeader.js';
import { CommentThreadAdditionalActions } from './commentThreadAdditionalActions.js';
import { CommentContextKeys } from '../common/commentContextKeys.js';
import { ICommentThreadWidget } from '../common/commentThreadWidget.js';
import { IRange, Range } from '../../../../editor/common/core/range.js';
import { ICellRange } from '../../notebook/common/notebookRange.js';
import { FontInfo } from '../../../../editor/common/config/fontInfo.js';
import { registerNavigableContainer } from '../../../browser/actions/widgetNavigationCommands.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { COMMENTS_SECTION, ICommentsConfiguration } from '../common/commentsConfiguration.js';
import { localize } from '../../../../nls.js';
import { AccessibilityVerbositySettingId } from '../../accessibility/browser/accessibilityConfiguration.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { AccessibilityCommandId } from '../../accessibility/common/accessibilityCommands.js';
import { LayoutableEditor } from './simpleCommentEditor.js';
import { isCodeEditor } from '../../../../editor/browser/editorBrowser.js';

export const COMMENTEDITOR_DECORATION_KEY = 'commenteditordecoration';

export class CommentThreadWidget<T extends IRange | ICellRange = IRange> extends Disposable implements ICommentThreadWidget {
	private _header!: CommentThreadHeader<T>;
	private _body: CommentThreadBody<T>;
	private _commentReply?: CommentReply<T>;
	private _additionalActions?: CommentThreadAdditionalActions<T>;
	private _commentMenus: CommentMenus;
	private _commentThreadDisposables: IDisposable[] = [];
	private _threadIsEmpty: IContextKey<boolean>;
	private _commentThreadContextValue: IContextKey<string | undefined>;
	private _focusedContextKey: IContextKey<boolean>;
	private _onDidResize = new Emitter<dom.Dimension>();
	onDidResize = this._onDidResize.event;

	private _commentThreadState: languages.CommentThreadState | undefined;

	get commentThread() {
		return this._commentThread;
	}
	constructor(
		readonly container: HTMLElement,
		readonly _parentEditor: LayoutableEditor,
		private _owner: string,
		private _parentResourceUri: URI,
		private _contextKeyService: IContextKeyService,
		private _scopedInstantiationService: IInstantiationService,
		private _commentThread: languages.CommentThread<T>,
		private _pendingComment: languages.PendingComment | undefined,
		private _pendingEdits: { [key: number]: languages.PendingComment } | undefined,
		private _markdownOptions: IMarkdownRendererExtraOptions,
		private _commentOptions: languages.CommentOptions | undefined,
		private _containerDelegate: {
			actionRunner: (() => void) | null;
			collapse: () => Promise<boolean>;
		},
		@ICommentService private readonly commentService: ICommentService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IKeybindingService private readonly _keybindingService: IKeybindingService
	) {
		super();

		this._threadIsEmpty = CommentContextKeys.commentThreadIsEmpty.bindTo(this._contextKeyService);
		this._threadIsEmpty.set(!_commentThread.comments || !_commentThread.comments.length);
		this._focusedContextKey = CommentContextKeys.commentFocused.bindTo(this._contextKeyService);

		this._commentMenus = this.commentService.getCommentMenus(this._owner);

		this._register(this._header = this._scopedInstantiationService.createInstance(
			CommentThreadHeader,
			container,
			{
				collapse: this._containerDelegate.collapse.bind(this)
			},
			this._commentMenus,
			this._commentThread
		));

		this._header.updateCommentThread(this._commentThread);

		const bodyElement = dom.$('.body');
		container.appendChild(bodyElement);
		this._register(toDisposable(() => bodyElement.remove()));

		const tracker = this._register(dom.trackFocus(bodyElement));
		this._register(registerNavigableContainer({
			name: 'commentThreadWidget',
			focusNotifiers: [tracker],
			focusNextWidget: () => {
				if (!this._commentReply?.isCommentEditorFocused()) {
					this._commentReply?.expandReplyAreaAndFocusCommentEditor();
				}
			},
			focusPreviousWidget: () => {
				if (this._commentReply?.isCommentEditorFocused() && this._commentThread.comments?.length) {
					this._body.focus();
				}
			}
		}));
		this._register(tracker.onDidFocus(() => this._focusedContextKey.set(true)));
		this._register(tracker.onDidBlur(() => this._focusedContextKey.reset()));
		this._register(this.configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(AccessibilityVerbositySettingId.Comments)) {
				this._setAriaLabel();
			}
		}));
		this._body = this._scopedInstantiationService.createInstance(
			CommentThreadBody,
			this._parentEditor,
			this._owner,
			this._parentResourceUri,
			bodyElement,
			this._markdownOptions,
			this._commentThread,
			this._pendingEdits,
			this._scopedInstantiationService,
			this
		) as unknown as CommentThreadBody<T>;
		this._register(this._body);
		this._setAriaLabel();

		this._commentThreadContextValue = CommentContextKeys.commentThreadContext.bindTo(this._contextKeyService);
		this._commentThreadContextValue.set(_commentThread.contextValue);

		const commentControllerKey = CommentContextKeys.commentControllerContext.bindTo(this._contextKeyService);
		const controller = this.commentService.getCommentController(this._owner);

		if (controller?.contextValue) {
			commentControllerKey.set(controller.contextValue);
		}

		this.currentThreadListeners();
	}

	get hasUnsubmittedComments(): boolean {
		return !!this._commentReply?.commentEditor.getValue() || this._body.hasCommentsInEditMode();
	}

	private _setAriaLabel(): void {
		let ariaLabel = localize('commentLabel', "Comment");
		let keybinding: string | undefined;
		const verbose = this.configurationService.getValue(AccessibilityVerbositySettingId.Comments);
		if (verbose) {
			keybinding = this._keybindingService.lookupKeybinding(AccessibilityCommandId.OpenAccessibilityHelp, this._contextKeyService)?.getLabel() ?? undefined;
		}
		if (keybinding) {
			ariaLabel = localize('commentLabelWithKeybinding', "{0}, use ({1}) for accessibility help", ariaLabel, keybinding);
		} else if (verbose) {
			ariaLabel = localize('commentLabelWithKeybindingNoKeybinding', "{0}, run the command Open Accessibility Help which is currently not triggerable via keybinding.", ariaLabel);
		}
		this._body.container.ariaLabel = ariaLabel;
	}

	private updateCurrentThread(hasMouse: boolean, hasFocus: boolean) {
		if (hasMouse || hasFocus) {
			this.commentService.setCurrentCommentThread(this.commentThread);
		} else {
			this.commentService.setCurrentCommentThread(undefined);
		}
	}

	private currentThreadListeners() {
		let hasMouse = false;
		let hasFocus = false;
		this._register(dom.addDisposableListener(this.container, dom.EventType.MOUSE_ENTER, (e) => {
			if (e.relatedTarget === this.container) {
				hasMouse = true;
				this.updateCurrentThread(hasMouse, hasFocus);
			}
		}, true));
		this._register(dom.addDisposableListener(this.container, dom.EventType.MOUSE_LEAVE, (e) => {
			if (e.relatedTarget === this.container) {
				hasMouse = false;
				this.updateCurrentThread(hasMouse, hasFocus);
			}
		}, true));
		this._register(dom.addDisposableListener(this.container, dom.EventType.FOCUS_IN, () => {
			hasFocus = true;
			this.updateCurrentThread(hasMouse, hasFocus);
		}, true));
		this._register(dom.addDisposableListener(this.container, dom.EventType.FOCUS_OUT, () => {
			hasFocus = false;
			this.updateCurrentThread(hasMouse, hasFocus);
		}, true));
	}

	async updateCommentThread(commentThread: languages.CommentThread<T>) {
		const shouldCollapse = (this._commentThread.collapsibleState === languages.CommentThreadCollapsibleState.Expanded) && (this._commentThreadState === languages.CommentThreadState.Unresolved)
			&& (commentThread.state === languages.CommentThreadState.Resolved);
		this._commentThreadState = commentThread.state;
		this._commentThread = commentThread;
		dispose(this._commentThreadDisposables);
		this._commentThreadDisposables = [];
		this._bindCommentThreadListeners();

		await this._body.updateCommentThread(commentThread, this._commentReply?.isCommentEditorFocused() ?? false);
		this._threadIsEmpty.set(!this._body.length);
		this._header.updateCommentThread(commentThread);
		this._commentReply?.updateCommentThread(commentThread);

		if (this._commentThread.contextValue) {
			this._commentThreadContextValue.set(this._commentThread.contextValue);
		} else {
			this._commentThreadContextValue.reset();
		}

		if (shouldCollapse && this.configurationService.getValue<ICommentsConfiguration>(COMMENTS_SECTION).collapseOnResolve) {
			this.collapse();
		}
	}

	async display(lineHeight: number, focus: boolean) {
		const headHeight = Math.max(23, Math.ceil(lineHeight * 1.2)); // 23 is the value of `Math.ceil(lineHeight * 1.2)` with the default editor font size
		this._header.updateHeight(headHeight);

		await this._body.display();

		// create comment thread only when it supports reply
		if (this._commentThread.canReply) {
			this._createCommentForm(focus);
		}
		this._createAdditionalActions();

		this._register(this._body.onDidResize(dimension => {
			this._refresh(dimension);
		}));

		// If there are no existing comments, place focus on the text area. This must be done after show, which also moves focus.
		// if this._commentThread.comments is undefined, it doesn't finish initialization yet, so we don't focus the editor immediately.
		if (this._commentThread.canReply && this._commentReply) {
			this._commentReply.focusIfNeeded();
		}

		this._bindCommentThreadListeners();
	}

	private _refresh(dimension: dom.Dimension) {
		this._body.layout();
		this._onDidResize.fire(dimension);
	}

	override dispose() {
		super.dispose();
		dispose(this._commentThreadDisposables);
		this.updateCurrentThread(false, false);
	}

	private _bindCommentThreadListeners() {
		this._commentThreadDisposables.push(this._commentThread.onDidChangeCanReply(() => {
			if (this._commentReply) {
				this._commentReply.updateCanReply();
			} else {
				if (this._commentThread.canReply) {
					this._createCommentForm(false);
				}
			}
		}));

		this._commentThreadDisposables.push(this._commentThread.onDidChangeComments(async _ => {
			await this.updateCommentThread(this._commentThread);
		}));

		this._commentThreadDisposables.push(this._commentThread.onDidChangeLabel(_ => {
			this._header.createThreadLabel();
		}));
	}

	private _createCommentForm(focus: boolean) {
		this._commentReply = this._scopedInstantiationService.createInstance(
			CommentReply,
			this._owner,
			this._body.container,
			this._parentEditor,
			this._commentThread,
			this._scopedInstantiationService,
			this._contextKeyService,
			this._commentMenus,
			this._commentOptions,
			this._pendingComment,
			this,
			focus,
			this._containerDelegate.actionRunner
		);

		this._register(this._commentReply);
	}

	private _createAdditionalActions() {
		this._additionalActions = this._scopedInstantiationService.createInstance(
			CommentThreadAdditionalActions,
			this._body.container,
			this._commentThread,
			this._contextKeyService,
			this._commentMenus,
			this._containerDelegate.actionRunner,
		);

		this._register(this._additionalActions);
	}

	getCommentCoords(commentUniqueId: number) {
		return this._body.getCommentCoords(commentUniqueId);
	}

	getPendingEdits(): { [key: number]: languages.PendingComment } {
		return this._body.getPendingEdits();
	}

	getPendingComment(): languages.PendingComment | undefined {
		if (this._commentReply) {
			return this._commentReply.getPendingComment();
		}

		return undefined;
	}

	setPendingComment(pending: languages.PendingComment) {
		this._pendingComment = pending;
		this._commentReply?.setPendingComment(pending);
	}

	getDimensions() {
		return this._body.getDimensions();
	}

	layout(widthInPixel?: number) {
		this._body.layout(widthInPixel);

		if (widthInPixel !== undefined) {
			this._commentReply?.layout(widthInPixel);
		}
	}

	ensureFocusIntoNewEditingComment() {
		this._body.ensureFocusIntoNewEditingComment();
	}

	focusCommentEditor() {
		this._commentReply?.expandReplyAreaAndFocusCommentEditor();
	}

	focus(commentUniqueId: number | undefined) {
		this._body.focus(commentUniqueId);
	}

	async submitComment() {
		const activeComment = this._body.activeComment;
		if (activeComment) {
			return activeComment.submitComment();
		} else if ((this._commentReply?.getPendingComment()?.body.length ?? 0) > 0) {
			return this._commentReply?.submitComment();
		}
	}

	async collapse() {
		if ((await this._containerDelegate.collapse()) && Range.isIRange(this.commentThread.range) && isCodeEditor(this._parentEditor)) {
			this._parentEditor.setSelection(this.commentThread.range);
		}

	}

	applyTheme(fontInfo: FontInfo) {
		const fontFamilyVar = '--comment-thread-editor-font-family';
		const fontWeightVar = '--comment-thread-editor-font-weight';
		this.container?.style.setProperty(fontFamilyVar, fontInfo.fontFamily);
		this.container?.style.setProperty(fontWeightVar, fontInfo.fontWeight);

		this._commentReply?.setCommentEditorDecorations();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/comments/browser/commentThreadZoneWidget.ts]---
Location: vscode-main/src/vs/workbench/contrib/comments/browser/commentThreadZoneWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { Color } from '../../../../base/common/color.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { IDisposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { ICodeEditor, IEditorMouseEvent, isCodeEditor, MouseTargetType } from '../../../../editor/browser/editorBrowser.js';
import { IPosition } from '../../../../editor/common/core/position.js';
import { IRange, Range } from '../../../../editor/common/core/range.js';
import * as languages from '../../../../editor/common/languages.js';
import { ZoneWidget } from '../../../../editor/contrib/zoneWidget/browser/zoneWidget.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IColorTheme, IThemeService } from '../../../../platform/theme/common/themeService.js';
import { CommentGlyphWidget } from './commentGlyphWidget.js';
import { ICommentService } from './commentService.js';
import { ICommentThreadWidget } from '../common/commentThreadWidget.js';
import { EditorOption } from '../../../../editor/common/config/editorOptions.js';
import { ServiceCollection } from '../../../../platform/instantiation/common/serviceCollection.js';
import { CommentThreadWidget } from './commentThreadWidget.js';
import { commentThreadStateBackgroundColorVar, commentThreadStateColorVar, getCommentThreadStateBorderColor } from './commentColors.js';
import { peekViewBorder } from '../../../../editor/contrib/peekView/browser/peekView.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { StableEditorScrollState } from '../../../../editor/browser/stableEditorScroll.js';
import Severity from '../../../../base/common/severity.js';
import * as nls from '../../../../nls.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';

function getCommentThreadWidgetStateColor(thread: languages.CommentThreadState | undefined, theme: IColorTheme): Color | undefined {
	return getCommentThreadStateBorderColor(thread, theme) ?? theme.getColor(peekViewBorder);
}

/**
 * Check if a comment thread has any draft comments
 */
function commentThreadHasDraft(commentThread: languages.CommentThread): boolean {
	const comments = commentThread.comments;
	if (!comments) {
		return false;
	}
	return comments.some(comment => comment.state === languages.CommentState.Draft);
}

export enum CommentWidgetFocus {
	None = 0,
	Widget = 1,
	Editor = 2
}

export function parseMouseDownInfoFromEvent(e: IEditorMouseEvent) {
	const range = e.target.range;

	if (!range) {
		return null;
	}

	if (!e.event.leftButton) {
		return null;
	}

	if (e.target.type !== MouseTargetType.GUTTER_LINE_DECORATIONS) {
		return null;
	}

	const data = e.target.detail;
	const gutterOffsetX = data.offsetX - data.glyphMarginWidth - data.lineNumbersWidth - data.glyphMarginLeft;

	// don't collide with folding and git decorations
	if (gutterOffsetX > 20) {
		return null;
	}

	return { lineNumber: range.startLineNumber };
}

export function isMouseUpEventDragFromMouseDown(mouseDownInfo: { lineNumber: number } | null, e: IEditorMouseEvent) {
	if (!mouseDownInfo) {
		return null;
	}

	const { lineNumber } = mouseDownInfo;

	const range = e.target.range;

	if (!range) {
		return null;
	}

	return lineNumber;
}

export function isMouseUpEventMatchMouseDown(mouseDownInfo: { lineNumber: number } | null, e: IEditorMouseEvent) {
	if (!mouseDownInfo) {
		return null;
	}

	const { lineNumber } = mouseDownInfo;

	const range = e.target.range;

	if (!range || range.startLineNumber !== lineNumber) {
		return null;
	}

	if (e.target.type !== MouseTargetType.GUTTER_LINE_DECORATIONS) {
		return null;
	}

	return lineNumber;
}

export class ReviewZoneWidget extends ZoneWidget implements ICommentThreadWidget {
	private _commentThreadWidget!: CommentThreadWidget;
	private readonly _onDidClose = new Emitter<ReviewZoneWidget | undefined>();
	private readonly _onDidCreateThread = new Emitter<ReviewZoneWidget>();
	private _isExpanded?: boolean;
	private _initialCollapsibleState?: languages.CommentThreadCollapsibleState;
	private _commentGlyph?: CommentGlyphWidget;
	private readonly _globalToDispose = new DisposableStore();
	private _commentThreadDisposables: IDisposable[] = [];
	private _contextKeyService: IContextKeyService;
	private _scopedInstantiationService: IInstantiationService;

	public get uniqueOwner(): string {
		return this._uniqueOwner;
	}
	public get commentThread(): languages.CommentThread {
		return this._commentThread;
	}

	public get expanded(): boolean | undefined {
		return this._isExpanded;
	}

	private _commentOptions: languages.CommentOptions | undefined;

	constructor(
		editor: ICodeEditor,
		private _uniqueOwner: string,
		private _commentThread: languages.CommentThread,
		private _pendingComment: languages.PendingComment | undefined,
		private _pendingEdits: { [key: number]: languages.PendingComment } | undefined,
		@IInstantiationService instantiationService: IInstantiationService,
		@IThemeService private themeService: IThemeService,
		@ICommentService private commentService: ICommentService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IDialogService private readonly dialogService: IDialogService
	) {
		super(editor, { keepEditorSelection: true, isAccessible: true, showArrow: !!_commentThread.range });
		this._contextKeyService = contextKeyService.createScoped(this.domNode);

		this._scopedInstantiationService = this._globalToDispose.add(instantiationService.createChild(new ServiceCollection(
			[IContextKeyService, this._contextKeyService]
		)));

		const controller = this.commentService.getCommentController(this._uniqueOwner);
		if (controller) {
			this._commentOptions = controller.options;
		}

		this._initialCollapsibleState = _pendingComment ? languages.CommentThreadCollapsibleState.Expanded : _commentThread.initialCollapsibleState;
		_commentThread.initialCollapsibleState = this._initialCollapsibleState;
		this._commentThreadDisposables = [];
		this.create();

		this._globalToDispose.add(this.themeService.onDidColorThemeChange(this._applyTheme, this));
		this._globalToDispose.add(this.editor.onDidChangeConfiguration(e => {
			if (e.hasChanged(EditorOption.fontInfo)) {
				this._applyTheme();
			}
		}));
		this._applyTheme();

	}

	public get onDidClose(): Event<ReviewZoneWidget | undefined> {
		return this._onDidClose.event;
	}

	public get onDidCreateThread(): Event<ReviewZoneWidget> {
		return this._onDidCreateThread.event;
	}

	public getPosition(): IPosition | undefined {
		if (this.position) {
			return this.position;
		}

		if (this._commentGlyph) {
			return this._commentGlyph.getPosition().position ?? undefined;
		}
		return undefined;
	}

	protected override revealRange() {
		// we don't do anything here as we always do the reveal ourselves.
	}

	public reveal(commentUniqueId?: number, focus: CommentWidgetFocus = CommentWidgetFocus.None) {
		this.makeVisible(commentUniqueId, focus);
		const comment = this._commentThread.comments?.find(comment => comment.uniqueIdInThread === commentUniqueId) ?? this._commentThread.comments?.[0];
		this.commentService.setActiveCommentAndThread(this.uniqueOwner, { thread: this._commentThread, comment });
	}

	private _expandAndShowZoneWidget() {
		if (!this._isExpanded) {
			this.show(this.arrowPosition(this._commentThread.range), 2);
		}
	}

	private _setFocus(commentUniqueId: number | undefined, focus: CommentWidgetFocus) {
		if (focus === CommentWidgetFocus.Widget) {
			this._commentThreadWidget.focus(commentUniqueId);
		} else if (focus === CommentWidgetFocus.Editor) {
			this._commentThreadWidget.focusCommentEditor();
		}
	}

	private _goToComment(commentUniqueId: number, focus: CommentWidgetFocus) {
		const height = this.editor.getLayoutInfo().height;
		const coords = this._commentThreadWidget.getCommentCoords(commentUniqueId);
		if (coords) {
			let scrollTop: number = 1;
			if (this._commentThread.range) {
				const commentThreadCoords = coords.thread;
				const commentCoords = coords.comment;
				scrollTop = this.editor.getTopForLineNumber(this._commentThread.range.startLineNumber) - height / 2 + commentCoords.top - commentThreadCoords.top;
			}
			this.editor.setScrollTop(scrollTop);
			this._setFocus(commentUniqueId, focus);
		} else {
			this._goToThread(focus);
		}
	}

	private _goToThread(focus: CommentWidgetFocus) {
		const rangeToReveal = this._commentThread.range
			? new Range(this._commentThread.range.startLineNumber, this._commentThread.range.startColumn, this._commentThread.range.endLineNumber + 1, 1)
			: new Range(1, 1, 1, 1);

		this.editor.revealRangeInCenter(rangeToReveal);
		this._setFocus(undefined, focus);
	}

	public makeVisible(commentUniqueId?: number, focus: CommentWidgetFocus = CommentWidgetFocus.None) {
		this._expandAndShowZoneWidget();

		if (commentUniqueId !== undefined) {
			this._goToComment(commentUniqueId, focus);
		} else {
			this._goToThread(focus);
		}
	}

	public getPendingComments(): { newComment: languages.PendingComment | undefined; edits: { [key: number]: languages.PendingComment } } {
		return {
			newComment: this._commentThreadWidget.getPendingComment(),
			edits: this._commentThreadWidget.getPendingEdits()
		};
	}

	public setPendingComment(pending: languages.PendingComment) {
		this._pendingComment = pending;
		this.expand();
		this._commentThreadWidget.setPendingComment(pending);
	}

	protected _fillContainer(container: HTMLElement): void {
		this.setCssClass('review-widget');
		this._commentThreadWidget = this._scopedInstantiationService.createInstance(
			CommentThreadWidget<IRange>,
			container,
			this.editor,
			this._uniqueOwner,
			this.editor.getModel()!.uri,
			this._contextKeyService,
			this._scopedInstantiationService,
			this._commentThread,
			this._pendingComment,
			this._pendingEdits,
			{ context: this.editor, },
			this._commentOptions,
			{
				actionRunner: async () => {
					if (!this._commentThread.comments || !this._commentThread.comments.length) {
						const newPosition = this.getPosition();

						if (newPosition) {
							const originalRange = this._commentThread.range;
							if (!originalRange) {
								return;
							}
							let range: Range;

							if (newPosition.lineNumber !== originalRange.endLineNumber) {
								// The widget could have moved as a result of editor changes.
								// We need to try to calculate the new, more correct, range for the comment.
								const distance = newPosition.lineNumber - originalRange.endLineNumber;
								range = new Range(originalRange.startLineNumber + distance, originalRange.startColumn, originalRange.endLineNumber + distance, originalRange.endColumn);
							} else {
								range = new Range(originalRange.startLineNumber, originalRange.startColumn, originalRange.endLineNumber, originalRange.endColumn);
							}
							await this.commentService.updateCommentThreadTemplate(this.uniqueOwner, this._commentThread.commentThreadHandle, range);
						}
					}
				},
				collapse: () => {
					return this.collapse(true);
				}
			}
		);

		this._disposables.add(this._commentThreadWidget);
	}

	private arrowPosition(range: IRange | undefined): IPosition | undefined {
		if (!range) {
			return undefined;
		}
		// Arrow on top edge of zone widget will be at the start of the line if range is multi-line, else at midpoint of range (rounding rightwards)
		return { lineNumber: range.endLineNumber, column: range.endLineNumber === range.startLineNumber ? (range.startColumn + range.endColumn + 1) / 2 : 1 };
	}

	private deleteCommentThread(): void {
		this.dispose();
		this.commentService.disposeCommentThread(this.uniqueOwner, this._commentThread.threadId);
	}

	private doCollapse() {
		this._commentThread.collapsibleState = languages.CommentThreadCollapsibleState.Collapsed;
	}

	public async collapse(confirm: boolean = false): Promise<boolean> {
		if (!confirm || (await this.confirmCollapse())) {
			this.doCollapse();
			return true;
		} else {
			return false;
		}
	}

	private async confirmCollapse(): Promise<boolean> {
		const confirmSetting = this.configurationService.getValue<'whenHasUnsubmittedComments' | 'never'>('comments.thread.confirmOnCollapse');

		if (confirmSetting === 'whenHasUnsubmittedComments' && this._commentThreadWidget.hasUnsubmittedComments) {
			const result = await this.dialogService.confirm({
				message: nls.localize('confirmCollapse', "Collapsing this comment thread will discard unsubmitted comments. Are you sure you want to discard these comments?"),
				primaryButton: nls.localize('discard', "Discard"),
				type: Severity.Warning,
				checkbox: { label: nls.localize('neverAskAgain', "Never ask me again"), checked: false }
			});
			if (result.checkboxChecked) {
				await this.configurationService.updateValue('comments.thread.confirmOnCollapse', 'never');
			}
			return result.confirmed;
		}
		return true;
	}

	public expand(setActive?: boolean) {
		this._commentThread.collapsibleState = languages.CommentThreadCollapsibleState.Expanded;
		if (setActive) {
			this.commentService.setActiveCommentAndThread(this.uniqueOwner, { thread: this._commentThread });
		}
	}

	public getGlyphPosition(): number {
		if (this._commentGlyph) {
			return this._commentGlyph.getPosition().position!.lineNumber;
		}
		return 0;
	}

	async update(commentThread: languages.CommentThread<IRange>) {
		if (this._commentThread !== commentThread) {
			this._commentThreadDisposables.forEach(disposable => disposable.dispose());
			this._commentThread = commentThread;
			this._commentThreadDisposables = [];
			this.bindCommentThreadListeners();
		}

		await this._commentThreadWidget.updateCommentThread(commentThread);

		// Move comment glyph widget and show position if the line has changed.
		const lineNumber = this._commentThread.range?.endLineNumber ?? 1;
		let shouldMoveWidget = false;
		if (this._commentGlyph) {
			const hasDraft = commentThreadHasDraft(commentThread);
			this._commentGlyph.setThreadState(commentThread.state, hasDraft);
			if (this._commentGlyph.getPosition().position!.lineNumber !== lineNumber) {
				shouldMoveWidget = true;
				this._commentGlyph.setLineNumber(lineNumber);
			}
		}

		if ((shouldMoveWidget && this._isExpanded) || (this._commentThread.collapsibleState === languages.CommentThreadCollapsibleState.Expanded && !this._isExpanded)) {
			this.show(this.arrowPosition(this._commentThread.range), 2);
		} else if (this._commentThread.collapsibleState !== languages.CommentThreadCollapsibleState.Expanded) {
			this.hide();
		}
	}

	protected override _onWidth(widthInPixel: number): void {
		this._commentThreadWidget.layout(widthInPixel);
	}

	protected override _doLayout(heightInPixel: number, widthInPixel: number): void {
		this._commentThreadWidget.layout(widthInPixel);
	}

	async display(range: IRange | undefined, shouldReveal: boolean) {
		if (range) {
			this._commentGlyph = new CommentGlyphWidget(this.editor, range?.endLineNumber ?? -1);
			const hasDraft = commentThreadHasDraft(this._commentThread);
			this._commentGlyph.setThreadState(this._commentThread.state, hasDraft);
			this._globalToDispose.add(this._commentGlyph.onDidChangeLineNumber(async e => {
				if (!this._commentThread.range) {
					return;
				}
				const shift = e - (this._commentThread.range.endLineNumber);
				const newRange = new Range(this._commentThread.range.startLineNumber + shift, this._commentThread.range.startColumn, this._commentThread.range.endLineNumber + shift, this._commentThread.range.endColumn);
				this._commentThread.range = newRange;
			}));
		}

		await this._commentThreadWidget.display(this.editor.getOption(EditorOption.lineHeight), shouldReveal);
		this._disposables.add(this._commentThreadWidget.onDidResize(dimension => {
			this._refresh(dimension);
		}));
		if (this._commentThread.collapsibleState === languages.CommentThreadCollapsibleState.Expanded) {
			this.show(this.arrowPosition(range), 2);
		}

		// If this is a new comment thread awaiting user input then we need to reveal it.
		if (shouldReveal) {
			this.makeVisible();
		}

		this.bindCommentThreadListeners();
	}

	private bindCommentThreadListeners() {
		this._commentThreadDisposables.push(this._commentThread.onDidChangeComments(async _ => {
			await this.update(this._commentThread);
		}));

		this._commentThreadDisposables.push(this._commentThread.onDidChangeCollapsibleState(state => {
			if (state === languages.CommentThreadCollapsibleState.Expanded && !this._isExpanded) {
				this.show(this.arrowPosition(this._commentThread.range), 2);
				this._commentThreadWidget.ensureFocusIntoNewEditingComment();
				return;
			}

			if (state === languages.CommentThreadCollapsibleState.Collapsed && this._isExpanded) {
				this.hide();
				return;
			}
		}));

		if (this._initialCollapsibleState === undefined) {
			const onDidChangeInitialCollapsibleState = this._commentThread.onDidChangeInitialCollapsibleState(state => {
				// File comments always start expanded
				this._initialCollapsibleState = state;
				this._commentThread.collapsibleState = this._initialCollapsibleState;
				onDidChangeInitialCollapsibleState.dispose();
			});
			this._commentThreadDisposables.push(onDidChangeInitialCollapsibleState);
		}


		this._commentThreadDisposables.push(this._commentThread.onDidChangeState(() => {
			const borderColor =
				getCommentThreadWidgetStateColor(this._commentThread.state, this.themeService.getColorTheme()) || Color.transparent;
			this.style({
				frameColor: borderColor,
				arrowColor: borderColor,
			});
			this.container?.style.setProperty(commentThreadStateColorVar, `${borderColor}`);
			this.container?.style.setProperty(commentThreadStateBackgroundColorVar, `${borderColor.transparent(.1)}`);
		}));
	}

	async submitComment(): Promise<void> {
		return this._commentThreadWidget.submitComment();
	}

	_refresh(dimensions: dom.Dimension) {
		if ((this._isExpanded === undefined) && (dimensions.height === 0) && (dimensions.width === 0)) {
			this.commentThread.collapsibleState = languages.CommentThreadCollapsibleState.Collapsed;
			return;
		}
		if (this._isExpanded) {
			this._commentThreadWidget.layout();

			const headHeight = Math.ceil(this.editor.getOption(EditorOption.lineHeight) * 1.2);
			const lineHeight = this.editor.getOption(EditorOption.lineHeight);
			const arrowHeight = Math.round(lineHeight / 3);
			const frameThickness = Math.round(lineHeight / 9) * 2;

			const computedLinesNumber = Math.ceil((headHeight + dimensions.height + arrowHeight + frameThickness + 8 /** margin bottom to avoid margin collapse */) / lineHeight);

			if (this._viewZone?.heightInLines === computedLinesNumber) {
				return;
			}

			const currentPosition = this.getPosition();

			if (this._viewZone && currentPosition && currentPosition.lineNumber !== this._viewZone.afterLineNumber && this._viewZone.afterLineNumber !== 0) {
				this._viewZone.afterLineNumber = currentPosition.lineNumber;
			}

			const capture = StableEditorScrollState.capture(this.editor);
			this._relayout(computedLinesNumber);
			capture.restore(this.editor);
		}
	}

	private _applyTheme() {
		const borderColor = getCommentThreadWidgetStateColor(this._commentThread.state, this.themeService.getColorTheme()) || Color.transparent;
		this.style({
			arrowColor: borderColor,
			frameColor: borderColor
		});
		const fontInfo = this.editor.getOption(EditorOption.fontInfo);

		this._commentThreadWidget.applyTheme(fontInfo);
	}

	override show(rangeOrPos: IRange | IPosition | undefined, heightInLines: number): void {
		const glyphPosition = this._commentGlyph?.getPosition();
		let range = Range.isIRange(rangeOrPos) ? rangeOrPos : (rangeOrPos ? Range.fromPositions(rangeOrPos) : undefined);
		if (glyphPosition?.position && range && glyphPosition.position.lineNumber !== range.endLineNumber) {
			// The widget could have moved as a result of editor changes.
			// We need to try to calculate the new, more correct, range for the comment.
			const distance = glyphPosition.position.lineNumber - range.endLineNumber;
			range = new Range(range.startLineNumber + distance, range.startColumn, range.endLineNumber + distance, range.endColumn);
		}

		this._isExpanded = true;
		super.show(range ?? new Range(0, 0, 0, 0), heightInLines);
		this._commentThread.collapsibleState = languages.CommentThreadCollapsibleState.Expanded;
		this._refresh(this._commentThreadWidget.getDimensions());
	}

	async collapseAndFocusRange() {
		if (await this.collapse(true) && Range.isIRange(this.commentThread.range) && isCodeEditor(this.editor)) {
			this.editor.setSelection(this.commentThread.range);
		}
	}

	override hide() {
		if (this._isExpanded) {
			this._isExpanded = false;
			// Focus the container so that the comment editor will be blurred before it is hidden
			if (this.editor.hasWidgetFocus()) {
				this.editor.focus();
			}

			if (!this._commentThread.comments || !this._commentThread.comments.length) {
				this.deleteCommentThread();
			}
		}
		super.hide();
	}

	override dispose() {
		super.dispose();

		if (this._commentGlyph) {
			this._commentGlyph.dispose();
			this._commentGlyph = undefined;
		}

		this._globalToDispose.dispose();
		this._commentThreadDisposables.forEach(global => global.dispose());
		this._onDidClose.fire(undefined);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/comments/browser/reactionsAction.ts]---
Location: vscode-main/src/vs/workbench/contrib/comments/browser/reactionsAction.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import * as dom from '../../../../base/browser/dom.js';
import * as cssJs from '../../../../base/browser/cssValue.js';
import { Action, IAction } from '../../../../base/common/actions.js';
import { URI, UriComponents } from '../../../../base/common/uri.js';
import { ActionViewItem } from '../../../../base/browser/ui/actionbar/actionViewItems.js';

export class ToggleReactionsAction extends Action {
	static readonly ID = 'toolbar.toggle.pickReactions';
	private _menuActions: IAction[] = [];
	private toggleDropdownMenu: () => void;
	constructor(toggleDropdownMenu: () => void, title?: string) {
		super(ToggleReactionsAction.ID, title || nls.localize('pickReactions', "Pick Reactions..."), 'toggle-reactions', true);
		this.toggleDropdownMenu = toggleDropdownMenu;
	}
	override run(): Promise<any> {
		this.toggleDropdownMenu();
		return Promise.resolve(true);
	}
	get menuActions() {
		return this._menuActions;
	}
	set menuActions(actions: IAction[]) {
		this._menuActions = actions;
	}
}
export class ReactionActionViewItem extends ActionViewItem {
	constructor(action: ReactionAction) {
		super(null, action, {});
	}
	protected override updateLabel(): void {
		if (!this.label) {
			return;
		}

		const action = this.action as ReactionAction;
		if (action.class) {
			this.label.classList.add(action.class);
		}
		if (!action.icon) {
			const reactionLabel = dom.append(this.label, dom.$('span.reaction-label'));
			reactionLabel.innerText = action.label;
		} else {
			const reactionIcon = dom.append(this.label, dom.$('.reaction-icon'));
			const uri = URI.revive(action.icon);
			reactionIcon.style.backgroundImage = cssJs.asCSSUrl(uri);
		}
		if (action.count) {
			const reactionCount = dom.append(this.label, dom.$('span.reaction-count'));
			reactionCount.innerText = `${action.count}`;
		}
	}

	protected override getTooltip(): string | undefined {
		const action = this.action as ReactionAction;
		const toggleMessage = action.enabled ? nls.localize('comment.toggleableReaction', "Toggle reaction, ") : '';

		if (action.count === undefined) {
			return nls.localize({
				key: 'comment.reactionLabelNone', comment: [
					'This is a tooltip for an emoji button so that the current user can toggle their reaction to a comment.',
					'The first arg is localized message "Toggle reaction" or empty if the user doesn\'t have permission to toggle the reaction, the second is the name of the reaction.']
			}, "{0}{1} reaction", toggleMessage, action.label);
		} else if (action.reactors === undefined || action.reactors.length === 0) {
			if (action.count === 1) {
				return nls.localize({
					key: 'comment.reactionLabelOne', comment: [
						'This is a tooltip for an emoji that is a "reaction" to a comment where the count of the reactions is 1.',
						'The emoji is also a button so that the current user can also toggle their own emoji reaction.',
						'The first arg is localized message "Toggle reaction" or empty if the user doesn\'t have permission to toggle the reaction, the second is the name of the reaction.']
				}, "{0}1 reaction with {1}", toggleMessage, action.label);
			} else if (action.count > 1) {
				return nls.localize({
					key: 'comment.reactionLabelMany', comment: [
						'This is a tooltip for an emoji that is a "reaction" to a comment where the count of the reactions is greater than 1.',
						'The emoji is also a button so that the current user can also toggle their own emoji reaction.',
						'The first arg is localized message "Toggle reaction" or empty if the user doesn\'t have permission to toggle the reaction, the second is number of users who have reacted with that reaction, and the third is the name of the reaction.']
				}, "{0}{1} reactions with {2}", toggleMessage, action.count, action.label);
			}
		} else {
			if (action.reactors.length <= 10 && action.reactors.length === action.count) {
				return nls.localize({
					key: 'comment.reactionLessThanTen', comment: [
						'This is a tooltip for an emoji that is a "reaction" to a comment where the count of the reactions is less than or equal to 10.',
						'The emoji is also a button so that the current user can also toggle their own emoji reaction.',
						'The first arg is localized message "Toggle reaction" or empty if the user doesn\'t have permission to toggle the reaction, the second iis a list of the reactors, and the third is the name of the reaction.']
				}, "{0}{1} reacted with {2}", toggleMessage, action.reactors.join(', '), action.label);
			} else if (action.count > 1) {
				const displayedReactors = action.reactors.slice(0, 10);
				return nls.localize({
					key: 'comment.reactionMoreThanTen', comment: [
						'This is a tooltip for an emoji that is a "reaction" to a comment where the count of the reactions is less than or equal to 10.',
						'The emoji is also a button so that the current user can also toggle their own emoji reaction.',
						'The first arg is localized message "Toggle reaction" or empty if the user doesn\'t have permission to toggle the reaction, the second iis a list of the reactors, and the third is the name of the reaction.']
				}, "{0}{1} and {2} more reacted with {3}", toggleMessage, displayedReactors.join(', '), action.count - displayedReactors.length, action.label);
			}
		}
		return undefined;
	}
}
export class ReactionAction extends Action {
	static readonly ID = 'toolbar.toggle.reaction';
	constructor(id: string, label: string = '', cssClass: string = '', enabled: boolean = true, actionCallback?: (event?: any) => Promise<any>, public readonly reactors?: readonly string[], public icon?: UriComponents, public count?: number) {
		super(ReactionAction.ID, label, cssClass, enabled, actionCallback);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/comments/browser/simpleCommentEditor.ts]---
Location: vscode-main/src/vs/workbench/contrib/comments/browser/simpleCommentEditor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { EditorOption, IEditorOptions } from '../../../../editor/common/config/editorOptions.js';
import { EditorAction, EditorContributionInstantiation, EditorExtensionsRegistry, IEditorContributionDescription } from '../../../../editor/browser/editorExtensions.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { CodeEditorWidget, ICodeEditorWidgetOptions } from '../../../../editor/browser/widget/codeEditor/codeEditorWidget.js';
import { IContextKeyService, RawContextKey, IContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';

// Allowed Editor Contributions:
import { MenuPreventer } from '../../codeEditor/browser/menuPreventer.js';
import { EditorDictation } from '../../codeEditor/browser/dictation/editorDictation.js';
import { ContextMenuController } from '../../../../editor/contrib/contextmenu/browser/contextmenu.js';
import { SuggestController } from '../../../../editor/contrib/suggest/browser/suggestController.js';
import { SnippetController2 } from '../../../../editor/contrib/snippet/browser/snippetController2.js';
import { TabCompletionController } from '../../snippets/browser/tabCompletion.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { IAccessibilityService } from '../../../../platform/accessibility/common/accessibility.js';
import { ICommentThreadWidget } from '../common/commentThreadWidget.js';
import { CommentContextKeys } from '../common/commentContextKeys.js';
import { ILanguageConfigurationService } from '../../../../editor/common/languages/languageConfigurationRegistry.js';
import { ILanguageFeaturesService } from '../../../../editor/common/services/languageFeatures.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ICodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { clamp } from '../../../../base/common/numbers.js';
import { CopyPasteController } from '../../../../editor/contrib/dropOrPasteInto/browser/copyPasteController.js';
import { CodeActionController } from '../../../../editor/contrib/codeAction/browser/codeActionController.js';
import { DropIntoEditorController } from '../../../../editor/contrib/dropOrPasteInto/browser/dropIntoEditorController.js';
import { InlineCompletionsController } from '../../../../editor/contrib/inlineCompletions/browser/controller/inlineCompletionsController.js';
import { LinkDetector } from '../../../../editor/contrib/links/browser/links.js';
import { MessageController } from '../../../../editor/contrib/message/browser/messageController.js';
import { SelectionClipboardContributionID } from '../../codeEditor/browser/selectionClipboard.js';
import { MenuId } from '../../../../platform/actions/common/actions.js';
import { ContentHoverController } from '../../../../editor/contrib/hover/browser/contentHoverController.js';
import { GlyphHoverController } from '../../../../editor/contrib/hover/browser/glyphHoverController.js';
import { PlaceholderTextContribution } from '../../../../editor/contrib/placeholderText/browser/placeholderTextContribution.js';

export const ctxCommentEditorFocused = new RawContextKey<boolean>('commentEditorFocused', false);
export const MIN_EDITOR_HEIGHT = 5 * 18;
export const MAX_EDITOR_HEIGHT = 25 * 18;

export interface LayoutableEditor {
	getLayoutInfo(): { height: number };
}

export class SimpleCommentEditor extends CodeEditorWidget {
	private _parentThread: ICommentThreadWidget;
	private _commentEditorFocused: IContextKey<boolean>;
	private _commentEditorEmpty: IContextKey<boolean>;

	constructor(
		domElement: HTMLElement,
		options: IEditorOptions,
		scopedContextKeyService: IContextKeyService,
		parentThread: ICommentThreadWidget,
		@IInstantiationService instantiationService: IInstantiationService,
		@ICodeEditorService codeEditorService: ICodeEditorService,
		@ICommandService commandService: ICommandService,
		@IThemeService themeService: IThemeService,
		@INotificationService notificationService: INotificationService,
		@IAccessibilityService accessibilityService: IAccessibilityService,
		@ILanguageConfigurationService languageConfigurationService: ILanguageConfigurationService,
		@ILanguageFeaturesService languageFeaturesService: ILanguageFeaturesService,
	) {
		const codeEditorWidgetOptions: ICodeEditorWidgetOptions = {
			contributions: <IEditorContributionDescription[]>[
				{ id: MenuPreventer.ID, ctor: MenuPreventer, instantiation: EditorContributionInstantiation.BeforeFirstInteraction },
				{ id: ContextMenuController.ID, ctor: ContextMenuController, instantiation: EditorContributionInstantiation.BeforeFirstInteraction },
				{ id: SuggestController.ID, ctor: SuggestController, instantiation: EditorContributionInstantiation.Eager },
				{ id: SnippetController2.ID, ctor: SnippetController2, instantiation: EditorContributionInstantiation.Lazy },
				{ id: TabCompletionController.ID, ctor: TabCompletionController, instantiation: EditorContributionInstantiation.Eager }, // eager because it needs to define a context key
				{ id: EditorDictation.ID, ctor: EditorDictation, instantiation: EditorContributionInstantiation.Lazy },
				...EditorExtensionsRegistry.getSomeEditorContributions([
					CopyPasteController.ID,
					DropIntoEditorController.ID,
					LinkDetector.ID,
					MessageController.ID,
					ContentHoverController.ID,
					GlyphHoverController.ID,
					SelectionClipboardContributionID,
					InlineCompletionsController.ID,
					CodeActionController.ID,
					PlaceholderTextContribution.ID
				])
			],
			contextMenuId: MenuId.SimpleEditorContext
		};

		super(domElement, options, codeEditorWidgetOptions, instantiationService, codeEditorService, commandService, scopedContextKeyService, themeService, notificationService, accessibilityService, languageConfigurationService, languageFeaturesService);

		this._commentEditorFocused = ctxCommentEditorFocused.bindTo(scopedContextKeyService);
		this._commentEditorEmpty = CommentContextKeys.commentIsEmpty.bindTo(scopedContextKeyService);
		this._commentEditorEmpty.set(!this.getModel()?.getValueLength());
		this._parentThread = parentThread;

		this._register(this.onDidFocusEditorWidget(_ => this._commentEditorFocused.set(true)));

		this._register(this.onDidChangeModelContent(e => this._commentEditorEmpty.set(!this.getModel()?.getValueLength())));
		this._register(this.onDidBlurEditorWidget(_ => this._commentEditorFocused.reset()));
	}

	getParentThread(): ICommentThreadWidget {
		return this._parentThread;
	}

	protected _getActions(): Iterable<EditorAction> {
		return EditorExtensionsRegistry.getEditorActions();
	}

	public override updateOptions(newOptions: Readonly<IEditorOptions> | undefined): void {
		const withLineNumberRemoved: Readonly<IEditorOptions> = { ...newOptions, lineNumbers: 'off' };
		super.updateOptions(withLineNumberRemoved);
	}

	public static getEditorOptions(configurationService: IConfigurationService): IEditorOptions {
		return {
			wordWrap: 'on',
			glyphMargin: false,
			lineNumbers: 'off',
			folding: false,
			selectOnLineNumbers: false,
			scrollbar: {
				vertical: 'visible',
				verticalScrollbarSize: 14,
				horizontal: 'auto',
				useShadows: true,
				verticalHasArrows: false,
				horizontalHasArrows: false,
				alwaysConsumeMouseWheel: false
			},
			overviewRulerLanes: 2,
			lineDecorationsWidth: 0,
			scrollBeyondLastLine: false,
			renderLineHighlight: 'none',
			fixedOverflowWidgets: true,
			acceptSuggestionOnEnter: 'smart',
			minimap: {
				enabled: false
			},
			dropIntoEditor: { enabled: true },
			autoClosingBrackets: configurationService.getValue('editor.autoClosingBrackets'),
			quickSuggestions: false,
			accessibilitySupport: configurationService.getValue<'auto' | 'off' | 'on'>('editor.accessibilitySupport'),
			fontFamily: configurationService.getValue('editor.fontFamily'),
			fontSize: configurationService.getValue('editor.fontSize'),
			allowVariableLineHeights: false
		};
	}
}

export function calculateEditorHeight(parentEditor: LayoutableEditor, editor: ICodeEditor, currentHeight: number): number {
	const layoutInfo = editor.getLayoutInfo();
	const lineHeight = editor.getOption(EditorOption.lineHeight);
	const contentHeight = (editor._getViewModel()?.getLineCount()! * lineHeight); // Can't just call getContentHeight() because it returns an incorrect, large, value when the editor is first created.
	if ((contentHeight > layoutInfo.height) ||
		(contentHeight < layoutInfo.height && currentHeight > MIN_EDITOR_HEIGHT)) {
		const linesToAdd = Math.ceil((contentHeight - layoutInfo.height) / lineHeight);
		const proposedHeight = layoutInfo.height + (lineHeight * linesToAdd);
		return clamp(proposedHeight, MIN_EDITOR_HEIGHT, clamp(parentEditor.getLayoutInfo().height - 90, MIN_EDITOR_HEIGHT, MAX_EDITOR_HEIGHT));
	}
	return currentHeight;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/comments/browser/timestamp.ts]---
Location: vscode-main/src/vs/workbench/contrib/comments/browser/timestamp.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import type { IManagedHover } from '../../../../base/browser/ui/hover/hover.js';
import { getDefaultHoverDelegate } from '../../../../base/browser/ui/hover/hoverDelegateFactory.js';
import { fromNow } from '../../../../base/common/date.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { language } from '../../../../base/common/platform.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import type { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { COMMENTS_SECTION, ICommentsConfiguration } from '../common/commentsConfiguration.js';

export class TimestampWidget extends Disposable {
	private _date: HTMLElement;
	private _timestamp: Date | undefined;
	private _useRelativeTime: boolean;

	private hover: IManagedHover;

	constructor(
		private configurationService: IConfigurationService,
		hoverService: IHoverService,
		container: HTMLElement,
		timeStamp?: Date
	) {
		super();
		this._date = dom.append(container, dom.$('span.timestamp'));
		this._date.style.display = 'none';
		this._useRelativeTime = this.useRelativeTimeSetting;
		this.hover = this._register(hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), this._date, ''));
		this.setTimestamp(timeStamp);
	}

	private get useRelativeTimeSetting(): boolean {
		return this.configurationService.getValue<ICommentsConfiguration>(COMMENTS_SECTION).useRelativeTime;
	}

	public async setTimestamp(timestamp: Date | undefined) {
		if ((timestamp !== this._timestamp) || (this.useRelativeTimeSetting !== this._useRelativeTime)) {
			this.updateDate(timestamp);
		}
		this._timestamp = timestamp;
		this._useRelativeTime = this.useRelativeTimeSetting;
	}

	private updateDate(timestamp?: Date) {
		if (!timestamp) {
			this._date.textContent = '';
			this._date.style.display = 'none';
		} else if ((timestamp !== this._timestamp)
			|| (this.useRelativeTimeSetting !== this._useRelativeTime)) {
			this._date.style.display = '';
			let textContent: string;
			let tooltip: string | undefined;
			if (this.useRelativeTimeSetting) {
				textContent = this.getRelative(timestamp);
				tooltip = this.getDateString(timestamp);
			} else {
				textContent = this.getDateString(timestamp);
			}

			this._date.textContent = textContent;
			this.hover.update(tooltip ?? '');
		}
	}

	private getRelative(date: Date): string {
		return fromNow(date, true, true);
	}

	private getDateString(date: Date): string {
		return date.toLocaleString(language);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/comments/browser/media/panel.css]---
Location: vscode-main/src/vs/workbench/contrib/comments/browser/media/panel.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.comments-panel .comments-panel-container {
	height: 100%;
}

.comments-panel .comments-panel-container .hidden {
	display: none;
}

.comments-panel .comments-panel-container .tree-container {
	height: 100%;
}

.comments-panel .comments-panel-container .tree-container.hidden {
	display: none;
	visibility: hidden;
}

.comments-panel .comments-panel-container .tree-container .comment-thread-container {
	display: block;
}

.comments-panel .comments-panel-container .tree-container .comment-thread-container div {
	overflow: hidden;
}

.comments-panel .comments-panel-container .tree-container .resource-container,
.comments-panel .comments-panel-container .tree-container .comment-thread-container .comment-metadata-container,
.comments-panel .comments-panel-container .tree-container .comment-thread-container .comment-snippet-container {
	display: flex;
	text-overflow: ellipsis;
	overflow: hidden;
}

.comments-panel .comments-panel-container .tree-container .comment-thread-container .comment-metadata {
	flex: 1;
	display: flex;
}

.comments-panel .count,
.comments-panel .user {
	padding-right: 5px;
}

.comments-panel .comments-panel-container .tree-container .comment-thread-container .icon {
	padding-top: 4px;
	padding-right: 5px;
	min-width: fit-content;
}

.comments-panel .comments-panel-container .tree-container .comment-thread-container .comment-snippet-container .count,
.comments-panel .comments-panel-container .tree-container .comment-thread-container .comment-metadata-container .relevance,
.comments-panel .comments-panel-container .tree-container .comment-thread-container .comment-metadata-container .user {
	min-width: fit-content;
}

.comments-panel .comments-panel-container .tree-container .comment-thread-container .comment-metadata-container .relevance {
	border-radius: 2px;
	background-color: var(--vscode-badge-background);
	color: var(--vscode-badge-foreground);
	padding: 0px 4px 1px 4px;
	font-size: 0.9em;
	margin-right: 4px;
	margin-top: 4px;
	margin-bottom: 3px;
	line-height: 14px;
}

.comments-panel .comments-panel-container .tree-container .comment-thread-container .comment-snippet-container .text {
	display: flex;
	flex: 1;
	min-width: 0;
}

.comments-panel .comments-panel-container .tree-container .comment-thread-container .reply-detail,
.comments-panel .comments-panel-container .tree-container .resource-container .owner,
.comments-panel .comments-panel-container .tree-container .comment-thread-container .timestamp {
	display: block;
	overflow: hidden;
	text-overflow: ellipsis;
	font-size: 0.9em;
	padding-right: 5px;
	opacity: 0.8;
}

.comments-panel .comments-panel-container .tree-container .comment-thread-container .text *,
.comments-panel .comments-panel-container .tree-container .comment-thread-container .range * {
	margin: 0;
	padding-right: 5px;
}

.comments-panel .comments-panel-container .tree-container .comment-thread-container .text * {
	text-overflow: ellipsis;
	overflow: hidden;
}

.comments-panel .comments-panel-container .tree-container .comment-thread-container .range * {
	overflow: visible;
	white-space: nowrap;
}

.comments-panel .comments-panel-container .tree-container .comment-thread-container .range {
	opacity: 0.8;
	overflow: visible;
}

.comments-panel .comments-panel-container .tree-container .comment-thread-container .comment-snippet-container .text code {
	font-family: var(--monaco-monospace-font);
}

.comments-panel .comments-panel-container .tree-container .monaco-icon-label {
	padding-right: 5px;
}

.comments-panel .comments-panel-container .tree-container .separator {
	padding-right: 5px;
	opacity: 0.8;
}

.comments-panel .comments-panel-container .message-box-container {
	line-height: 22px;
	padding-left: 20px;
	height: inherit;
}

.comments-panel .comments-panel-container .tree-container .count-badge-wrapper {
	margin-left: 10px;
}

.comments-panel .comments-panel-container .tree-container .comment-thread-container .comment-metadata-container,
.comments-panel .comments-panel-container .tree-container .comment-thread-container .comment-snippet-container {
	line-height: 22px;
	margin-right: 5px;
}

.comments-panel .comments-panel-container .tree-container .comment-thread-container .comment-snippet-container {
	padding-left: 16px;
}

.comments-panel .hide {
	display: none;
}

.comments-panel .comments-panel-container .text a {
	color: var(--vscode-textLink-foreground);
}

.comments-panel .comments-panel-container .text a:hover,
.comments-panel .comments-panel-container a:active {
	color: var(--vscode-textLink-activeForeground);
}

.comments-panel .comments-panel-container .text a:focus {
	outline-color: var(--vscode-focusBorder);
}

.comments-panel .comments-panel-container .text code {
	color: var(--vscode-textPreformat-foreground);
}

.comments-panel .comments-panel-container .actions {
	display: none;
}

.comments-panel .comments-panel-container .actions .action-label {
	padding: 2px;
}

.comments-panel .monaco-list .monaco-list-row:hover .comment-metadata-container .actions,
.comments-panel .monaco-list .monaco-list-row.selected .comment-metadata-container .actions,
.comments-panel .monaco-list .monaco-list-row.focused .comment-metadata-container .actions {
	display: block;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/comments/browser/media/review.css]---
Location: vscode-main/src/vs/workbench/contrib/comments/browser/media/review.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.review-widget {
	width: 100%;
	position: absolute;
}

.monaco-editor .review-widget,
.monaco-editor .review-widget {
	background-color: var(--vscode-peekViewResult-background);
}
.review-widget .hidden {
	display: none !important;
}

.review-widget .body {
	overflow: hidden;
}

.review-widget .body .review-comment {
	padding: 8px 16px 8px 20px;
	display: flex;
}

@keyframes monaco-review-widget-focus {
	0% {
		background: var(--vscode-peekViewResult-selectionBackground);
	}

	100% {
		background: transparent;
	}
}

.review-widget .body .review-comment.focus {
	animation: monaco-review-widget-focus 3s ease 0s;
}
.review-widget .body .review-comment .comment-actions {
	margin-left: auto;
}

.review-widget .body .review-comment .comment-actions .monaco-toolbar {
	height: 22px;
}

.review-widget .body .review-comment .comment-title .comment-header-info {
	overflow: hidden;
	text-overflow: ellipsis;
}

.review-widget .body .review-comment .comment-title {
	display: flex;
	width: 100%;
}

.review-widget .body .review-comment .comment-title .action-label.codicon {
	line-height: 18px;
}

.review-widget .body .review-comment .comment-title .monaco-dropdown .toolbar-toggle-more {
	width: 16px;
	height: 18px;
	line-height: 18px;
	vertical-align: middle;
}

.review-widget .body .comment-body blockquote {
	margin: 8px 7px 8px 5px;
	padding: 2px 16px 2px 10px;
	border-left-width: 5px;
	border-left-style: solid;
	border-left-color: var(--vscode-textBlockQuote-border);
}

.review-widget .body .review-comment blockquote {
	background: var(--vscode-textBlockQuote-background);
}

.review-widget .body .review-comment .avatar-container {
	margin-top: 4px !important;
}

.review-widget .body .avatar-container img.avatar {
	height: 28px;
	width: 28px;
	display: inline-block;
	overflow: hidden;
	line-height: 1;
	vertical-align: middle;
	border-radius: 3px;
	border-style: none;
}

.review-widget .body .comment-reactions .monaco-text-button {
	margin: 0 7px 0 0;
	width: 30px;
	background-color: transparent;
	border: 1px solid grey;
	border-radius: 3px;
}

.review-widget .body .review-comment .review-comment-contents {
	padding-left: 20px;
	user-select: text;
	-webkit-user-select: text;
	width: 100%;
	overflow: hidden;
}

.review-widget .body pre {
	overflow: auto;
	word-wrap: normal;
	white-space: pre;
}


.review-widget .body .review-comment .review-comment-contents .author {
	line-height: 22px;
}


.review-widget .body .review-comment .review-comment-contents .isPending {
	line-height: 22px;
	margin: 0 5px 0 5px;
	padding: 0 2px 0 2px;
	font-style: italic;
}

.review-widget .body .review-comment .review-comment-contents .timestamp {
	line-height: 22px;
	margin: 0 5px 0 5px;
	padding: 0 2px 0 2px;
}

.review-widget .body .review-comment .review-comment-contents .comment-body .comment-body-plainstring {
	white-space: pre-wrap;
}

.review-widget .body .review-comment .review-comment-contents .comment-body {
	padding-top: 4px;
}

.review-widget .body .review-comment .review-comment-contents .comment-body-max-height {
	max-height: 20em;
}

.review-widget .body .review-comment .review-comment-contents .comment-reactions {
	margin-top: 8px;
	min-height: 25px;
}

.review-widget .body .review-comment .review-comment-contents .comment-reactions .action-item .action-label {
	padding: 1px 4px;
	white-space: pre;
	text-align: center;
	font-size: 12px;
	display: flex;
}

.review-widget .body .review-comment .review-comment-contents .comment-reactions .action-item .action-label .reaction-icon {
	background-size: 14px;
	background-position: left center;
	background-repeat: no-repeat;
	width: 14px;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	display: inline-block;
	margin-right: 4px;
}

.review-widget .body .review-comment .review-comment-contents .comment-reactions .action-item .action-label .reaction-label {
	line-height: 20px;
	margin-right: 4px;
}

.review-widget .body .review-comment .review-comment-contents .comment-reactions .action-item a.action-label.toolbar-toggle-pickReactions {
	background-size: 16px;
	font-size: 16px;
	width: 26px;
	height: 16px;
	background-repeat: no-repeat;
	background-position: center;
	margin-top: 3px;
	border: none;
}

.review-widget .body .review-comment .comment-title .action-label {
	display: block;
	height: 16px;
	line-height: 16px;
	background-size: 16px;
	background-position: center center;
	background-repeat: no-repeat;
}

.review-widget .body .review-comment .review-comment-contents .comment-reactions .action-item a.action-label {
	border: 1px solid;
	border-color: var(--vscode-panel-border);
}

.review-widget .body .review-comment .review-comment-contents .comment-reactions .action-item a.action-label.disabled {
	opacity: 0.6;
}

.review-widget .body .review-comment .review-comment-contents .comment-reactions .action-item a.action-label.active:hover {
	background-color: var(--vscode-statusBarItem-hoverBackground);
}

.review-widget .body .review-comment .review-comment-contents .comment-reactions .action-item a.action-label:active {
	background-color: var(--vscode-statusBarItem-activeBackground);
	border: 1px solid transparent;
}
.review-widget .body .review-comment .review-comment-contents .comment-body a {
	cursor: pointer;
	color: var(--vscode-textLink-foreground);
}

.review-widget .body .comment-body a:hover,
.review-widget .body .comment-body a:active {
	color: var(--vscode-textLink-activeForeground);
}

.review-widget .body .comment-body a:focus {
	outline: 1px solid var(--vscode-focusBorder);
}

.review-widget .body .comment-body p,
.review-widget .body .comment-body ul {
	margin: 8px 0;
}

.review-widget .body .comment-body p:first-child,
.review-widget .body .comment-body ul:first-child {
	margin-top: 0;
}

.review-widget .body .comment-body p:last-child,
.review-widget .body.comment-body ul:last-child {
	margin-bottom: 0;
}

.review-widget .body .comment-body ul {
	padding-left: 20px;
}

.review-widget .body .comment-body li > p {
	margin-bottom: 0;
}

.review-widget .body .comment-body li > ul {
	margin-top: 0;
}

.review-widget .body .comment-body span {
	white-space: pre;
}

.review-widget .body .comment-body img {
	max-width: 100%;
}

.review-widget .body .comment-body .monaco-tokenized-source {
	font-size: inherit !important;
	line-height: auto !important;
}

.review-widget .body .comment-form-container {
	margin: 8px 20px;
}

.review-widget .validation-error {
	display: inline-block;
	overflow: hidden;
	text-align: left;
	width: 100%;
	box-sizing: border-box;
	padding: 0.4em;
	font-size: 12px;
	line-height: 17px;
	min-height: 34px;
	margin-top: -1px;
	margin-left: -1px;
	word-wrap: break-word;
	border: 1px solid var(--vscode-inputValidation-errorBorder);
	background: var(--vscode-inputValidation-errorBackground);
}

.review-widget .body .comment-form .validation-error {
	color: var(--vscode-inputValidation-errorForeground);
}


.review-widget .body .comment-additional-actions {
	margin: 10px 20px;
}

.review-widget .body .comment-additional-actions .section-separator {
	border-top: 1px solid var(--vscode-menu-separatorBackground);
	margin: 10px 0 14px;
}

.review-widget .body .comment-additional-actions .button-bar {
	display: flex;
	white-space: nowrap;
}

.review-widget .body .comment-additional-actions .monaco-button,
.review-widget .body .comment-additional-actions .monaco-text-button,
.review-widget .body .comment-additional-actions .monaco-button-dropdown {
	display: flex;
	width: auto;
}

.review-widget .body .comment-additional-actions .button-bar > .monaco-text-button,
.review-widget .body .comment-additional-actions .button-bar > .monaco-button-dropdown {
	margin: 0 10px 0 0;
}

.review-widget .body .comment-additional-actions .button-bar .monaco-text-button {
	padding: 4px 10px;
}

.review-widget .body .comment-additional-actions .codicon-drop-down-button {
	align-items: center;
}

.review-widget .body .monaco-editor {
	color: var(--vscode-editor-foreground);
}

.review-widget .body code {
	font-family: var(--comment-thread-editor-font-family);
	font-weight: var(--comment-thread-editor-font-weight);
}

.review-widget .body .comment-form-container .comment-form {
	display: flex;
	flex-direction: row;
}

.review-widget .body .comment-form-container .comment-form .avatar-container {
	padding-right: 20px;
}

.review-widget .body .comment-form-container.expand .review-thread-reply-button {
	display: none;
}

.review-widget .body .comment-form-container.expand .monaco-editor,
.review-widget .body .comment-form-container.expand .form-actions {
	display: block;
	box-sizing: content-box;
}

.review-widget .body .comment-form-container .review-thread-reply-button {
	text-align: left;
	display: block;
	width: 100%;
	resize: vertical;
	border-radius: 0;
	box-sizing: border-box;
	padding: 6px 12px;
	font-weight: 600;
	line-height: 20px;
	white-space: nowrap;
	border: 0px;
	outline: 1px solid transparent;
	outline-color: var(--vscode-contrastBorder);
	background-color: var(--vscode-editorCommentsWidget-replyInputBackground);
	color: var(--vscode-editor-foreground);
	font-size: inherit;
	font-family: var(--monaco-monospace-font);
}

.review-widget .body .comment-form-container .review-thread-reply-button:focus {
	outline-style: solid;
	outline-width: 1px;
}

.review-widget .body .comment-form-container .monaco-editor,
.review-widget .body .comment-form-container .monaco-editor .monaco-editor-background,
.review-widget .body .edit-container .monaco-editor .monaco-editor-background {
	background-color: var(--vscode-editorCommentsWidget-replyInputBackground);
}

.review-widget .body .comment-form-container .monaco-editor,
.review-widget .body .edit-container .monaco-editor {
	width: 100%;
	min-height: 90px;
	max-height: 500px;
	border-radius: 3px;
	border: 0px;
	box-sizing: content-box;
	padding: 6px 0 6px 12px;
	outline: 1px solid var(--vscode-contrastBorder);
}

.review-widget .body .monaco-editor.focused {
	outline: 1px solid var(--vscode-focusBorder);
}

.review-widget .body .comment-form-container .monaco-editor,
.review-widget .body .comment-form-container .form-actions {
	display: none;
}

.review-widget .body .comment-form-container .form-actions,
.review-widget .body .edit-container .form-actions {
	overflow: auto;
	margin: 10px 0;
}

.review-widget .body .edit-container .form-actions {
	padding-top: 10px;
}

.review-widget .body .edit-textarea {
	margin: 5px 0 10px 0;
	margin-right: 12px;
}

.review-widget .body .comment-form-container .form-actions .monaco-text-button,
.review-widget .body .edit-container .monaco-text-button {
	width: auto;
	padding: 4px 10px;
	margin-left: 5px;
}

.review-widget .body .form-actions .monaco-text-button {
	float: right;
}

.review-widget .head {
	box-sizing: border-box;
	display: flex;
	height: 100%;
}

.review-widget .head .review-title {
	display: inline-block;
	font-size: 13px;
	margin-left: 20px;
	cursor: default;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.review-widget .head .review-title .dirname:not(:empty) {
	font-size: 0.9em;
	margin-left: 0.5em;
}

.review-widget .head .review-actions {
	flex: 1;
	text-align: right;
	padding-right: 2px;
}

.review-widget .head .review-actions > .monaco-action-bar {
	display: inline-block;
}

.review-widget .head .review-actions > .monaco-action-bar,
.review-widget .head .review-actions > .monaco-action-bar > .actions-container {
	height: 100%;
}

.review-widget .action-item {
	min-width: 18px;
	min-height: 20px;
	margin-left: 4px;
}

.review-widget .head .review-actions > .monaco-action-bar .action-label {
	margin: 0;
	line-height: inherit;
	background-repeat: no-repeat;
	background-position: center center;
}

.review-widget .head .review-actions > .monaco-action-bar .action-label.codicon {
	margin: 0;
}

.monaco-editor .review-widget > .body {
	border-top: 1px solid var(--comment-thread-state-color);
}

.monaco-editor .review-widget > .head {
	background-color: var(--comment-thread-state-background-color);
}

.review-widget > .body {
	border-top: 1px solid;
	position: relative;
}

.monaco-editor .comment-range-glyph {
	margin-left: 10px;
	width: 4px !important;
	cursor: pointer;
	z-index: 10;
}

div.preview.inline .monaco-editor .comment-range-glyph {
	display: none !important;
}

.monaco-editor .comment-diff-added {
	border-left-width: 3px;
	border-left-style: solid;
}

.monaco-editor .comment-diff-added,
.monaco-editor .comment-range-glyph.multiline-add {
	border-left-color: var(--vscode-editorGutter-commentRangeForeground);
}

.monaco-editor .comment-diff-added:before,
.monaco-editor .comment-range-glyph.line-hover:before {
	background: var(--vscode-editorGutter-commentRangeForeground);
}

.monaco-editor .comment-thread:before,
.monaco-editor .comment-thread-unresolved:before,
.monaco-editor .comment-thread-draft:before {
	background: var(--vscode-editorGutter-commentRangeForeground);
}

.monaco-editor .comment-thread-range {
	background-color: var(--vscode-editorCommentsWidget-rangeBackground);
}

.monaco-editor .comment-thread-range-current {
	background-color: var(--vscode-editorCommentsWidget-rangeActiveBackground);
}

.monaco-editor .margin-view-overlays .comment-range-glyph.line-hover,
.monaco-editor .margin-view-overlays .comment-range-glyph.comment-thread,
.monaco-editor .margin-view-overlays .comment-range-glyph.comment-thread-unresolved,
.monaco-editor .margin-view-overlays .comment-range-glyph.comment-thread-draft {
	margin-left: 13px;
}

.monaco-editor .margin-view-overlays > div:hover > .comment-range-glyph.comment-diff-added:before,
.monaco-editor .margin-view-overlays .comment-range-glyph.line-hover:before,
.monaco-editor .comment-range-glyph.comment-thread:before,
.monaco-editor .comment-range-glyph.comment-thread-unresolved:before,
.monaco-editor .comment-range-glyph.comment-thread-draft:before {
	position: absolute;
	height: 100%;
	width: 9px;
	left: -6px;
	z-index: 10;
	color: var(--vscode-editorGutter-commentGlyphForeground);
	text-align: center;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
}

.monaco-editor .comment-range-glyph.comment-thread-unresolved:before {
	color: var(--vscode-editorGutter-commentUnresolvedGlyphForeground);
}

.monaco-editor .comment-range-glyph.comment-thread-draft:before {
	color: var(--vscode-editorGutter-commentDraftGlyphForeground);
}

.monaco-editor .margin-view-overlays .comment-range-glyph.multiline-add {
	border-left-width: 3px;
	border-left-style: dotted;
	height: 16px;
	margin-top: 2px;
}

.monaco-editor .margin-view-overlays > div:hover > .comment-range-glyph.comment-diff-added:before,
.monaco-editor .margin-view-overlays .comment-range-glyph.line-hover:before {
	content: var(--vscode-icon-plus-content);
	font-family: var(--vscode-icon-plus-font-family);
	font-family: "codicon";
	border-radius: 3px;
	width: 18px !important;
	margin-left: -5px;
	padding-left: 1px;
}

.monaco-editor .comment-range-glyph.comment-thread,
.monaco-editor .comment-range-glyph.comment-thread-unresolved,
.monaco-editor .comment-range-glyph.comment-thread-draft {
	z-index: 20;
}

.monaco-editor .comment-range-glyph.comment-thread:before,
.monaco-editor .comment-range-glyph.comment-thread-unresolved:before,
.monaco-editor .comment-range-glyph.comment-thread-draft:before {
	font-family: "codicon";
	font-size: 13px;
	width: 18px !important;
	line-height: 100%;
	border-radius: 3px;
	z-index: 20;
	margin-left: -5px;
	padding-top: 1px;
	padding-left: 1px;
}

.monaco-editor .comment-range-glyph.comment-thread:before {
	content: var(--vscode-icon-comment-add-content);
	font-family: var(--vscode-icon-comment-add-font-family);

}
.monaco-editor .comment-range-glyph.comment-thread-unresolved:before {
	content: var(--vscode-icon-comment-unresolved-content);
	font-family: var(--vscode-icon-comment-unresolved-font-family);
}
.monaco-editor .comment-range-glyph.comment-thread-draft:before {
	content: var(--vscode-icon-comment-draft-content);
	font-family: var(--vscode-icon-comment-draft-font-family);
}

.monaco-editor.inline-comment .margin-view-overlays .codicon-folding-expanded,
.monaco-editor.inline-comment .margin-view-overlays .codicon-folding-collapsed {
	margin-left: 11px;
}

.monaco-editor.inline-comment .margin-view-overlays .dirty-diff-glyph {
	margin-left: 25px;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/comments/common/commentCommandIds.ts]---
Location: vscode-main/src/vs/workbench/contrib/comments/common/commentCommandIds.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const enum CommentCommandId {
	Add = 'workbench.action.addComment',
	FocusCommentOnCurrentLine = 'workbench.action.focusCommentOnCurrentLine',
	NextThread = 'editor.action.nextCommentThreadAction',
	PreviousThread = 'editor.action.previousCommentThreadAction',
	NextCommentedRange = 'editor.action.nextCommentedRangeAction',
	PreviousCommentedRange = 'editor.action.previousCommentedRangeAction',
	NextRange = 'editor.action.nextCommentingRange',
	PreviousRange = 'editor.action.previousCommentingRange',
	ToggleCommenting = 'workbench.action.toggleCommenting',
	Submit = 'editor.action.submitComment',
	Hide = 'workbench.action.hideComment',
	CollapseAll = 'workbench.action.collapseAllComments',
	ExpandAll = 'workbench.action.expandAllComments',
	ExpandUnresolved = 'workbench.action.expandUnresolvedComments'
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/comments/common/commentContextKeys.ts]---
Location: vscode-main/src/vs/workbench/contrib/comments/common/commentContextKeys.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';


export namespace CommentContextKeys {

	/**
	 * A context key that is set when the active cursor is in a commenting range.
	 */
	export const activeCursorHasCommentingRange = new RawContextKey<boolean>('activeCursorHasCommentingRange', false, {
		description: nls.localize('hasCommentingRange', "Whether the position at the active cursor has a commenting range"),
		type: 'boolean'
	});

	/**
	 * A context key that is set when the active cursor is in the range of an existing comment.
	 */
	export const activeCursorHasComment = new RawContextKey<boolean>('activeCursorHasComment', false, {
		description: nls.localize('hasComment', "Whether the position at the active cursor has a comment"),
		type: 'boolean'
	});

	/**
	 * A context key that is set when the active editor has commenting ranges.
	 */
	export const activeEditorHasCommentingRange = new RawContextKey<boolean>('activeEditorHasCommentingRange', false, {
		description: nls.localize('editorHasCommentingRange', "Whether the active editor has a commenting range"),
		type: 'boolean'
	});

	/**
	 * A context key that is set when the workspace has either comments or commenting ranges.
	 */
	export const WorkspaceHasCommenting = new RawContextKey<boolean>('workspaceHasCommenting', false, {
		description: nls.localize('hasCommentingProvider', "Whether the open workspace has either comments or commenting ranges."),
		type: 'boolean'
	});

	/**
	 * A context key that is set when the comment thread has no comments.
	 */
	export const commentThreadIsEmpty = new RawContextKey<boolean>('commentThreadIsEmpty', false, { type: 'boolean', description: nls.localize('commentThreadIsEmpty', "Set when the comment thread has no comments") });
	/**
	 * A context key that is set when the comment has no input.
	 */
	export const commentIsEmpty = new RawContextKey<boolean>('commentIsEmpty', false, { type: 'boolean', description: nls.localize('commentIsEmpty', "Set when the comment has no input") });
	/**
	 * The context value of the comment.
	 */
	export const commentContext = new RawContextKey<string>('comment', undefined, { type: 'string', description: nls.localize('comment', "The context value of the comment") });
	/**
	 * The context value of the comment thread.
	 */
	export const commentThreadContext = new RawContextKey<string>('commentThread', undefined, { type: 'string', description: nls.localize('commentThread', "The context value of the comment thread") });
	/**
	 * The comment controller id associated with a comment thread.
	 */
	export const commentControllerContext = new RawContextKey<string>('commentController', undefined, { type: 'string', description: nls.localize('commentController', "The comment controller id associated with a comment thread") });

	/**
	 * The comment widget is focused.
	 */
	export const commentFocused = new RawContextKey<boolean>('commentFocused', false, { type: 'boolean', description: nls.localize('commentFocused', "Set when the comment is focused") });

	/**
	 * A context key that is set when commenting is enabled.
	 */
	export const commentingEnabled = new RawContextKey<boolean>('commentingEnabled', true, {
		description: nls.localize('commentingEnabled', "Whether commenting functionality is enabled"),
		type: 'boolean'
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/comments/common/commentModel.ts]---
Location: vscode-main/src/vs/workbench/contrib/comments/common/commentModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';
import { IRange } from '../../../../editor/common/core/range.js';
import { Comment, CommentThread, CommentThreadChangedEvent, CommentThreadApplicability, CommentThreadState } from '../../../../editor/common/languages.js';

export interface ICommentThreadChangedEvent extends CommentThreadChangedEvent<IRange> {
	uniqueOwner: string;
	owner: string;
	ownerLabel: string;
}

export class CommentNode {
	isRoot: boolean = false;
	replies: CommentNode[] = [];
	public readonly threadId: string;
	public readonly range: IRange | undefined;
	public readonly threadState: CommentThreadState | undefined;
	public readonly threadRelevance: CommentThreadApplicability | undefined;
	public readonly contextValue: string | undefined;
	public readonly controllerHandle: number;
	public readonly threadHandle: number;

	constructor(
		public readonly uniqueOwner: string,
		public readonly owner: string,
		public readonly resource: URI,
		public readonly comment: Comment,
		public readonly thread: CommentThread) {
		this.threadId = thread.threadId;
		this.range = thread.range;
		this.threadState = thread.state;
		this.threadRelevance = thread.applicability;
		this.contextValue = thread.contextValue;
		this.controllerHandle = thread.controllerHandle;
		this.threadHandle = thread.commentThreadHandle;
	}

	hasReply(): boolean {
		return this.replies && this.replies.length !== 0;
	}

	private _lastUpdatedAt: string | undefined;

	get lastUpdatedAt(): string {
		if (this._lastUpdatedAt === undefined) {
			let updatedAt = this.comment.timestamp || '';
			if (this.replies.length) {
				const reply = this.replies[this.replies.length - 1];
				const replyUpdatedAt = reply.lastUpdatedAt;
				if (replyUpdatedAt > updatedAt) {
					updatedAt = replyUpdatedAt;
				}
			}
			this._lastUpdatedAt = updatedAt;
		}
		return this._lastUpdatedAt;
	}
}

export class ResourceWithCommentThreads {
	id: string;
	uniqueOwner: string;
	owner: string;
	ownerLabel: string | undefined;
	commentThreads: CommentNode[]; // The top level comments on the file. Replys are nested under each node.
	resource: URI;

	constructor(uniqueOwner: string, owner: string, resource: URI, commentThreads: CommentThread[]) {
		this.uniqueOwner = uniqueOwner;
		this.owner = owner;
		this.id = resource.toString();
		this.resource = resource;
		this.commentThreads = commentThreads.filter(thread => thread.comments && thread.comments.length).map(thread => ResourceWithCommentThreads.createCommentNode(uniqueOwner, owner, resource, thread));
	}

	public static createCommentNode(uniqueOwner: string, owner: string, resource: URI, commentThread: CommentThread): CommentNode {
		const { comments } = commentThread;
		const commentNodes: CommentNode[] = comments!.map(comment => new CommentNode(uniqueOwner, owner, resource, comment, commentThread));
		if (commentNodes.length > 1) {
			commentNodes[0].replies = commentNodes.slice(1, commentNodes.length);
		}

		commentNodes[0].isRoot = true;

		return commentNodes[0];
	}

	private _lastUpdatedAt: string | undefined;

	get lastUpdatedAt() {
		if (this._lastUpdatedAt === undefined) {
			let updatedAt = '';
			// Return result without cahcing as we expect data to arrive later
			if (!this.commentThreads.length) {
				return updatedAt;
			}
			for (const thread of this.commentThreads) {
				const threadUpdatedAt = thread.lastUpdatedAt;
				if (threadUpdatedAt && threadUpdatedAt > updatedAt) {
					updatedAt = threadUpdatedAt;
				}
			}
			this._lastUpdatedAt = updatedAt;
		}
		return this._lastUpdatedAt;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/comments/common/commentsConfiguration.ts]---
Location: vscode-main/src/vs/workbench/contrib/comments/common/commentsConfiguration.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export interface ICommentsConfiguration {
	openView: 'never' | 'file' | 'firstFile' | 'firstFileUnresolved';
	useRelativeTime: boolean;
	visible: boolean;
	maxHeight: boolean;
	collapseOnResolve: boolean;
}

export const COMMENTS_SECTION = 'comments';
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/comments/common/commentThreadWidget.ts]---
Location: vscode-main/src/vs/workbench/contrib/comments/common/commentThreadWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export interface ICommentThreadWidget {
	submitComment: () => Promise<void>;
	collapse: () => void;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/comments/test/browser/commentsView.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/comments/test/browser/commentsView.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { workbenchInstantiationService } from '../../../../test/browser/workbenchTestServices.js';
import { IRange, Range } from '../../../../../editor/common/core/range.js';
import { CommentsPanel } from '../../browser/commentsView.js';
import { CommentService, ICommentController, ICommentInfo, ICommentService, INotebookCommentInfo } from '../../browser/commentService.js';
import { Comment, CommentInput, CommentReaction, CommentThread, CommentThreadCollapsibleState, CommentThreadState } from '../../../../../editor/common/languages.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { IViewContainerModel, IViewDescriptor, IViewDescriptorService, IViewPaneContainer, ViewContainer, ViewContainerLocation } from '../../../../common/views.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { IContextViewService } from '../../../../../platform/contextview/browser/contextView.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { URI, UriComponents } from '../../../../../base/common/uri.js';
import { IHoverService } from '../../../../../platform/hover/browser/hover.js';
import { NullHoverService } from '../../../../../platform/hover/test/browser/nullHoverService.js';
import { SyncDescriptor } from '../../../../../platform/instantiation/common/descriptors.js';

class TestCommentThread implements CommentThread<IRange> {
	isDocumentCommentThread(): this is CommentThread<IRange> {
		return true;
	}
	constructor(public readonly commentThreadHandle: number,
		public readonly controllerHandle: number,
		public readonly threadId: string,
		public readonly resource: string,
		public readonly range: IRange,
		public readonly comments: Comment[]) { }

	readonly onDidChangeComments: Event<readonly Comment[] | undefined> = new Emitter<readonly Comment[] | undefined>().event;
	readonly onDidChangeInitialCollapsibleState: Event<CommentThreadCollapsibleState | undefined> = new Emitter<CommentThreadCollapsibleState | undefined>().event;
	canReply: boolean = false;
	readonly onDidChangeInput: Event<CommentInput | undefined> = new Emitter<CommentInput | undefined>().event;
	readonly onDidChangeRange: Event<IRange> = new Emitter<IRange>().event;
	readonly onDidChangeLabel: Event<string | undefined> = new Emitter<string | undefined>().event;
	readonly onDidChangeCollapsibleState: Event<CommentThreadCollapsibleState | undefined> = new Emitter<CommentThreadCollapsibleState | undefined>().event;
	readonly onDidChangeState: Event<CommentThreadState | undefined> = new Emitter<CommentThreadState | undefined>().event;
	readonly onDidChangeCanReply: Event<boolean> = new Emitter<boolean>().event;
	isDisposed: boolean = false;
	isTemplate: boolean = false;
	label: string | undefined = undefined;
	contextValue: string | undefined = undefined;
}

class TestCommentController implements ICommentController {
	activeComment: { thread: CommentThread; comment?: Comment } | undefined;
	id: string = 'test';
	label: string = 'Test Comments';
	owner: string = 'test';
	features = {};
	createCommentThreadTemplate(resource: UriComponents, range: IRange | undefined): Promise<void> {
		throw new Error('Method not implemented.');
	}
	updateCommentThreadTemplate(threadHandle: number, range: IRange): Promise<void> {
		throw new Error('Method not implemented.');
	}
	deleteCommentThreadMain(commentThreadId: string): void {
		throw new Error('Method not implemented.');
	}
	toggleReaction(uri: URI, thread: CommentThread<IRange>, comment: Comment, reaction: CommentReaction, token: CancellationToken): Promise<void> {
		throw new Error('Method not implemented.');
	}
	getDocumentComments(resource: URI, token: CancellationToken): Promise<ICommentInfo> {
		throw new Error('Method not implemented.');
	}
	getNotebookComments(resource: URI, token: CancellationToken): Promise<INotebookCommentInfo> {
		throw new Error('Method not implemented.');
	}
	setActiveCommentAndThread(commentInfo: { thread: CommentThread; comment: Comment } | undefined): Promise<void> {
		throw new Error('Method not implemented.');
	}

}

export class TestViewDescriptorService implements Partial<IViewDescriptorService> {
	getViewLocationById(id: string): ViewContainerLocation | null {
		return ViewContainerLocation.Panel;
	}
	readonly onDidChangeLocation: Event<{ views: IViewDescriptor[]; from: ViewContainerLocation; to: ViewContainerLocation }> = new Emitter<{ views: IViewDescriptor[]; from: ViewContainerLocation; to: ViewContainerLocation }>().event;
	getViewDescriptorById(id: string): IViewDescriptor | null {
		return null;
	}
	getViewContainerByViewId(id: string): ViewContainer | null {
		return {
			id: 'comments',
			title: { value: 'Comments', original: 'Comments' },
			ctorDescriptor: {} as SyncDescriptor<IViewPaneContainer>
		};
	}
	getViewContainerModel(viewContainer: ViewContainer): IViewContainerModel {
		const partialViewContainerModel: Partial<IViewContainerModel> = {
			onDidChangeContainerInfo: new Emitter<{ title?: boolean; icon?: boolean; keybindingId?: boolean }>().event
		};
		return partialViewContainerModel as IViewContainerModel;
	}
	getDefaultContainerById(id: string): ViewContainer | null {
		return null;
	}
}

suite('Comments View', function () {
	teardown(() => {
		instantiationService.dispose();
		commentService.dispose();
		disposables.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	let disposables: DisposableStore;
	let instantiationService: TestInstantiationService;
	let commentService: CommentService;

	setup(() => {
		disposables = new DisposableStore();
		instantiationService = workbenchInstantiationService({}, disposables);
		instantiationService.stub(IConfigurationService, new TestConfigurationService());
		instantiationService.stub(IHoverService, NullHoverService);
		instantiationService.stub(IContextViewService, {});
		instantiationService.stub(IViewDescriptorService, new TestViewDescriptorService());
		commentService = instantiationService.createInstance(CommentService);
		instantiationService.stub(ICommentService, commentService);
		commentService.registerCommentController('test', new TestCommentController());
	});



	test('collapse all', async function () {
		const view = instantiationService.createInstance(CommentsPanel, { id: 'comments', title: 'Comments' });
		view.render();
		commentService.setWorkspaceComments('test', [
			new TestCommentThread(1, 1, '1', 'test1', new Range(1, 1, 1, 1), [{ body: 'test', uniqueIdInThread: 1, userName: 'alex' }]),
			new TestCommentThread(2, 1, '1', 'test2', new Range(1, 1, 1, 1), [{ body: 'test', uniqueIdInThread: 1, userName: 'alex' }]),
		]);
		assert.strictEqual(view.getFilterStats().total, 2);
		assert.strictEqual(view.areAllCommentsExpanded(), true);
		view.collapseAll();
		assert.strictEqual(view.isSomeCommentsExpanded(), false);
		view.dispose();
	});

	test('expand all', async function () {
		const view = instantiationService.createInstance(CommentsPanel, { id: 'comments', title: 'Comments' });
		view.render();
		commentService.setWorkspaceComments('test', [
			new TestCommentThread(1, 1, '1', 'test1', new Range(1, 1, 1, 1), [{ body: 'test', uniqueIdInThread: 1, userName: 'alex' }]),
			new TestCommentThread(2, 1, '1', 'test2', new Range(1, 1, 1, 1), [{ body: 'test', uniqueIdInThread: 1, userName: 'alex' }]),
		]);
		assert.strictEqual(view.getFilterStats().total, 2);
		view.collapseAll();
		assert.strictEqual(view.isSomeCommentsExpanded(), false);
		view.expandAll();
		assert.strictEqual(view.areAllCommentsExpanded(), true);
		view.dispose();
	});

	test('filter by text', async function () {
		const view = instantiationService.createInstance(CommentsPanel, { id: 'comments', title: 'Comments' });
		view.setVisible(true);
		view.render();
		commentService.setWorkspaceComments('test', [
			new TestCommentThread(1, 1, '1', 'test1', new Range(1, 1, 1, 1), [{ body: 'This comment is a cat.', uniqueIdInThread: 1, userName: 'alex' }]),
			new TestCommentThread(2, 1, '1', 'test2', new Range(1, 1, 1, 1), [{ body: 'This comment is a dog.', uniqueIdInThread: 1, userName: 'alex' }]),
		]);
		assert.strictEqual(view.getFilterStats().total, 2);
		assert.strictEqual(view.getFilterStats().filtered, 2);
		view.getFilterWidget().setFilterText('cat');
		// Setting showResolved causes the filter to trigger for the purposes of this test.
		view.filters.showResolved = false;

		assert.strictEqual(view.getFilterStats().total, 2);
		assert.strictEqual(view.getFilterStats().filtered, 1);
		view.clearFilterText();
		// Setting showResolved causes the filter to trigger for the purposes of this test.
		view.filters.showResolved = true;
		assert.strictEqual(view.getFilterStats().total, 2);
		assert.strictEqual(view.getFilterStats().filtered, 2);
		view.dispose();
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/customEditor/browser/customEditor.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/customEditor/browser/customEditor.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { EditorPaneDescriptor, IEditorPaneRegistry } from '../../../browser/editor.js';
import { WorkbenchPhase, registerWorkbenchContribution2 } from '../../../common/contributions.js';
import { EditorExtensions, IEditorFactoryRegistry } from '../../../common/editor.js';
import { ComplexCustomWorkingCopyEditorHandler as ComplexCustomWorkingCopyEditorHandler, CustomEditorInputSerializer } from './customEditorInputFactory.js';
import { ICustomEditorService } from '../common/customEditor.js';
import { WebviewEditor } from '../../webviewPanel/browser/webviewEditor.js';
import { CustomEditorInput } from './customEditorInput.js';
import { CustomEditorService } from './customEditors.js';

registerSingleton(ICustomEditorService, CustomEditorService, InstantiationType.Delayed);

Registry.as<IEditorPaneRegistry>(EditorExtensions.EditorPane)
	.registerEditorPane(
		EditorPaneDescriptor.create(
			WebviewEditor,
			WebviewEditor.ID,
			'Webview Editor',
		), [
		new SyncDescriptor(CustomEditorInput)
	]);

Registry.as<IEditorFactoryRegistry>(EditorExtensions.EditorFactory)
	.registerEditorSerializer(CustomEditorInputSerializer.ID, CustomEditorInputSerializer);

registerWorkbenchContribution2(ComplexCustomWorkingCopyEditorHandler.ID, ComplexCustomWorkingCopyEditorHandler, WorkbenchPhase.BlockStartup);
```

--------------------------------------------------------------------------------

````
