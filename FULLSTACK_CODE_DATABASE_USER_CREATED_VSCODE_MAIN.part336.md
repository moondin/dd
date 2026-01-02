---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 336
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 336 of 552)

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

---[FILE: src/vs/workbench/browser/parts/notifications/notificationsViewer.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/notifications/notificationsViewer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IListVirtualDelegate, IListRenderer } from '../../../../base/browser/ui/list/list.js';
import { clearNode, addDisposableListener, EventType, EventHelper, $, isEventLike } from '../../../../base/browser/dom.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { URI } from '../../../../base/common/uri.js';
import { localize } from '../../../../nls.js';
import { ButtonBar, IButtonOptions } from '../../../../base/browser/ui/button/button.js';
import { ActionBar } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { ActionRunner, IAction, IActionRunner, Separator, toAction } from '../../../../base/common/actions.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { dispose, DisposableStore, Disposable } from '../../../../base/common/lifecycle.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { INotificationViewItem, NotificationViewItem, NotificationViewItemContentChangeKind, INotificationMessage, ChoiceAction } from '../../../common/notifications.js';
import { ClearNotificationAction, ExpandNotificationAction, CollapseNotificationAction, ConfigureNotificationAction } from './notificationsActions.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { ProgressBar } from '../../../../base/browser/ui/progressbar/progressbar.js';
import { INotificationService, NotificationsFilter, Severity, isNotificationSource } from '../../../../platform/notification/common/notification.js';
import { isNonEmptyArray } from '../../../../base/common/arrays.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { DropdownMenuActionViewItem } from '../../../../base/browser/ui/dropdown/dropdownActionViewItem.js';
import { DomEmitter } from '../../../../base/browser/event.js';
import { Gesture, EventType as GestureEventType } from '../../../../base/browser/touch.js';
import { Event } from '../../../../base/common/event.js';
import { defaultButtonStyles, defaultProgressBarStyles } from '../../../../platform/theme/browser/defaultStyles.js';
import { KeyCode } from '../../../../base/common/keyCodes.js';
import { StandardKeyboardEvent } from '../../../../base/browser/keyboardEvent.js';
import { getDefaultHoverDelegate } from '../../../../base/browser/ui/hover/hoverDelegateFactory.js';
import type { IManagedHover } from '../../../../base/browser/ui/hover/hover.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';

export class NotificationsListDelegate implements IListVirtualDelegate<INotificationViewItem> {

	private static readonly ROW_HEIGHT = 42;
	private static readonly LINE_HEIGHT = 22;

	private offsetHelper: HTMLElement;

	constructor(container: HTMLElement) {
		this.offsetHelper = this.createOffsetHelper(container);
	}

	private createOffsetHelper(container: HTMLElement): HTMLElement {
		return container.appendChild($('.notification-offset-helper'));
	}

	getHeight(notification: INotificationViewItem): number {
		if (!notification.expanded) {
			return NotificationsListDelegate.ROW_HEIGHT; // return early if there are no more rows to show
		}

		// First row: message and actions
		let expandedHeight = NotificationsListDelegate.ROW_HEIGHT;

		// Dynamic height: if message overflows
		const preferredMessageHeight = this.computePreferredHeight(notification);
		const messageOverflows = NotificationsListDelegate.LINE_HEIGHT < preferredMessageHeight;
		if (messageOverflows) {
			const overflow = preferredMessageHeight - NotificationsListDelegate.LINE_HEIGHT;
			expandedHeight += overflow;
		}

		// Last row: source and buttons if we have any
		if (notification.source || isNonEmptyArray(notification.actions?.primary)) {
			expandedHeight += NotificationsListDelegate.ROW_HEIGHT;
		}

		// If the expanded height is same as collapsed, unset the expanded state
		// but skip events because there is no change that has visual impact
		if (expandedHeight === NotificationsListDelegate.ROW_HEIGHT) {
			notification.collapse(true /* skip events, no change in height */);
		}

		return expandedHeight;
	}

	private computePreferredHeight(notification: INotificationViewItem): number {

		// Prepare offset helper depending on toolbar actions count
		let actions = 0;
		if (!notification.hasProgress) {
			actions++; // close
		}
		if (notification.canCollapse) {
			actions++; // expand/collapse
		}
		if (isNonEmptyArray(notification.actions?.secondary)) {
			actions++; // secondary actions
		}
		this.offsetHelper.style.width = `${450 /* notifications container width */ - (10 /* padding */ + 30 /* severity icon */ + (actions * 30) /* actions */ - (Math.max(actions - 1, 0) * 4) /* less padding for actions > 1 */)}px`;

		// Render message into offset helper
		const renderedMessage = NotificationMessageRenderer.render(notification.message);
		this.offsetHelper.appendChild(renderedMessage);

		// Compute height
		const preferredHeight = Math.max(this.offsetHelper.offsetHeight, this.offsetHelper.scrollHeight);

		// Always clear offset helper after use
		clearNode(this.offsetHelper);

		return preferredHeight;
	}

	getTemplateId(element: INotificationViewItem): string {
		if (element instanceof NotificationViewItem) {
			return NotificationRenderer.TEMPLATE_ID;
		}

		throw new Error('unknown element type: ' + element);
	}
}

export interface INotificationTemplateData {
	container: HTMLElement;
	toDispose: DisposableStore;

	mainRow: HTMLElement;
	icon: HTMLElement;
	message: HTMLElement;
	toolbar: ActionBar;

	detailsRow: HTMLElement;
	source: HTMLElement;
	buttonsContainer: HTMLElement;
	progress: ProgressBar;

	renderer: NotificationTemplateRenderer;
}

interface IMessageActionHandler {
	readonly toDispose: DisposableStore;

	callback: (href: string) => void;
}

class NotificationMessageRenderer {

	static render(message: INotificationMessage, actionHandler?: IMessageActionHandler): HTMLElement {
		const messageContainer = $('span');

		for (const node of message.linkedText.nodes) {
			if (typeof node === 'string') {
				messageContainer.appendChild(document.createTextNode(node));
			} else {
				let title = node.title;

				if (!title && node.href.startsWith('command:')) {
					title = localize('executeCommand', "Click to execute command '{0}'", node.href.substr('command:'.length));
				} else if (!title) {
					title = node.href;
				}

				const anchor = $('a', { href: node.href, title, tabIndex: 0 }, node.label);

				if (actionHandler) {
					const handleOpen = (e: unknown) => {
						if (isEventLike(e)) {
							EventHelper.stop(e, true);
						}

						actionHandler.callback(node.href);
					};

					const onClick = actionHandler.toDispose.add(new DomEmitter(anchor, EventType.CLICK)).event;

					const onKeydown = actionHandler.toDispose.add(new DomEmitter(anchor, EventType.KEY_DOWN)).event;
					const onSpaceOrEnter = Event.chain(onKeydown, $ => $.filter(e => {
						const event = new StandardKeyboardEvent(e);

						return event.equals(KeyCode.Space) || event.equals(KeyCode.Enter);
					}));

					actionHandler.toDispose.add(Gesture.addTarget(anchor));
					const onTap = actionHandler.toDispose.add(new DomEmitter(anchor, GestureEventType.Tap)).event;

					Event.any(onClick, onTap, onSpaceOrEnter)(handleOpen, null, actionHandler.toDispose);
				}

				messageContainer.appendChild(anchor);
			}
		}

		return messageContainer;
	}
}

export class NotificationRenderer implements IListRenderer<INotificationViewItem, INotificationTemplateData> {

	static readonly TEMPLATE_ID = 'notification';

	constructor(
		private actionRunner: IActionRunner,
		@IContextMenuService private readonly contextMenuService: IContextMenuService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@INotificationService private readonly notificationService: INotificationService
	) {
	}

	get templateId() {
		return NotificationRenderer.TEMPLATE_ID;
	}

	renderTemplate(container: HTMLElement): INotificationTemplateData {
		const data: INotificationTemplateData = Object.create(null);
		data.toDispose = new DisposableStore();

		// Container
		data.container = $('.notification-list-item');

		// Main Row
		data.mainRow = $('.notification-list-item-main-row');

		// Icon
		data.icon = $('.notification-list-item-icon.codicon');

		// Message
		data.message = $('.notification-list-item-message');

		// Toolbar
		const that = this;
		const toolbarContainer = $('.notification-list-item-toolbar-container');
		data.toolbar = new ActionBar(
			toolbarContainer,
			{
				ariaLabel: localize('notificationActions', "Notification Actions"),
				actionViewItemProvider: (action, options) => {
					if (action instanceof ConfigureNotificationAction) {
						return data.toDispose.add(new DropdownMenuActionViewItem(action, {
							getActions() {
								const actions: IAction[] = [];

								const source = { id: action.notification.sourceId, label: action.notification.source };
								if (isNotificationSource(source)) {
									const isSourceFiltered = that.notificationService.getFilter(source) === NotificationsFilter.ERROR;
									actions.push(toAction({
										id: source.id,
										label: isSourceFiltered ? localize('turnOnNotifications', "Turn On All Notifications from '{0}'", source.label) : localize('turnOffNotifications', "Turn Off Info and Warning Notifications from '{0}'", source.label),
										run: () => that.notificationService.setFilter({ ...source, filter: isSourceFiltered ? NotificationsFilter.OFF : NotificationsFilter.ERROR })
									}));

									if (action.notification.actions?.secondary?.length) {
										actions.push(new Separator());
									}
								}

								if (Array.isArray(action.notification.actions?.secondary)) {
									actions.push(...action.notification.actions.secondary);
								}

								return actions;
							},
						}, this.contextMenuService, {
							...options,
							actionRunner: this.actionRunner,
							classNames: action.class
						}));
					}

					return undefined;
				},
				actionRunner: this.actionRunner
			}
		);
		data.toDispose.add(data.toolbar);

		// Details Row
		data.detailsRow = $('.notification-list-item-details-row');

		// Source
		data.source = $('.notification-list-item-source');

		// Buttons Container
		data.buttonsContainer = $('.notification-list-item-buttons-container');

		container.appendChild(data.container);

		// the details row appears first in order for better keyboard access to notification buttons
		data.container.appendChild(data.detailsRow);
		data.detailsRow.appendChild(data.source);
		data.detailsRow.appendChild(data.buttonsContainer);

		// main row
		data.container.appendChild(data.mainRow);
		data.mainRow.appendChild(data.icon);
		data.mainRow.appendChild(data.message);
		data.mainRow.appendChild(toolbarContainer);

		// Progress: below the rows to span the entire width of the item
		data.progress = new ProgressBar(container, defaultProgressBarStyles);
		data.toDispose.add(data.progress);

		// Renderer
		data.renderer = this.instantiationService.createInstance(NotificationTemplateRenderer, data, this.actionRunner);
		data.toDispose.add(data.renderer);

		return data;
	}

	renderElement(notification: INotificationViewItem, index: number, data: INotificationTemplateData): void {
		data.renderer.setInput(notification);
	}

	disposeTemplate(templateData: INotificationTemplateData): void {
		dispose(templateData.toDispose);
	}
}

export class NotificationTemplateRenderer extends Disposable {

	private static closeNotificationAction: ClearNotificationAction;
	private static expandNotificationAction: ExpandNotificationAction;
	private static collapseNotificationAction: CollapseNotificationAction;

	private static readonly SEVERITIES = [Severity.Info, Severity.Warning, Severity.Error];

	private readonly inputDisposables = this._register(new DisposableStore());

	constructor(
		private template: INotificationTemplateData,
		private actionRunner: IActionRunner,
		@IOpenerService private readonly openerService: IOpenerService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IKeybindingService private readonly keybindingService: IKeybindingService,
		@IContextMenuService private readonly contextMenuService: IContextMenuService,
		@IHoverService private readonly hoverService: IHoverService,
	) {
		super();

		if (!NotificationTemplateRenderer.closeNotificationAction) {
			NotificationTemplateRenderer.closeNotificationAction = instantiationService.createInstance(ClearNotificationAction, ClearNotificationAction.ID, ClearNotificationAction.LABEL);
			NotificationTemplateRenderer.expandNotificationAction = instantiationService.createInstance(ExpandNotificationAction, ExpandNotificationAction.ID, ExpandNotificationAction.LABEL);
			NotificationTemplateRenderer.collapseNotificationAction = instantiationService.createInstance(CollapseNotificationAction, CollapseNotificationAction.ID, CollapseNotificationAction.LABEL);
		}
	}

	setInput(notification: INotificationViewItem): void {
		this.inputDisposables.clear();

		this.render(notification);
	}

	private render(notification: INotificationViewItem): void {

		// Container
		this.template.container.classList.toggle('expanded', notification.expanded);
		this.inputDisposables.add(addDisposableListener(this.template.container, EventType.MOUSE_UP, e => {
			if (e.button === 1 /* Middle Button */) {
				// Prevent firing the 'paste' event in the editor textarea - #109322
				EventHelper.stop(e, true);
			}
		}));
		this.inputDisposables.add(addDisposableListener(this.template.container, EventType.AUXCLICK, e => {
			if (!notification.hasProgress && e.button === 1 /* Middle Button */) {
				EventHelper.stop(e, true);

				notification.close();
			}
		}));

		// Severity Icon
		this.renderSeverity(notification);

		// Message
		const messageCustomHover = this.inputDisposables.add(this.hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), this.template.message, ''));
		const messageOverflows = this.renderMessage(notification, messageCustomHover);

		// Secondary Actions
		this.renderSecondaryActions(notification, messageOverflows);

		// Source
		const sourceCustomHover = this.inputDisposables.add(this.hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), this.template.source, ''));
		this.renderSource(notification, sourceCustomHover);

		// Buttons
		this.renderButtons(notification);

		// Progress
		this.renderProgress(notification);

		// Label Change Events that we can handle directly
		// (changes to actions require an entire redraw of
		// the notification because it has an impact on
		// epxansion state)
		this.inputDisposables.add(notification.onDidChangeContent(event => {
			switch (event.kind) {
				case NotificationViewItemContentChangeKind.SEVERITY:
					this.renderSeverity(notification);
					break;
				case NotificationViewItemContentChangeKind.PROGRESS:
					this.renderProgress(notification);
					break;
				case NotificationViewItemContentChangeKind.MESSAGE:
					this.renderMessage(notification, messageCustomHover);
					break;
			}
		}));
	}

	private renderSeverity(notification: INotificationViewItem): void {
		// first remove, then set as the codicon class names overlap
		NotificationTemplateRenderer.SEVERITIES.forEach(severity => {
			if (notification.severity !== severity) {
				this.template.icon.classList.remove(...ThemeIcon.asClassNameArray(this.toSeverityIcon(severity)));
			}
		});
		this.template.icon.classList.add(...ThemeIcon.asClassNameArray(this.toSeverityIcon(notification.severity)));
	}

	private renderMessage(notification: INotificationViewItem, customHover: IManagedHover): boolean {
		clearNode(this.template.message);
		this.template.message.appendChild(NotificationMessageRenderer.render(notification.message, {
			callback: link => this.openerService.open(URI.parse(link), { allowCommands: true }),
			toDispose: this.inputDisposables
		}));

		const messageOverflows = notification.canCollapse && !notification.expanded && this.template.message.scrollWidth > this.template.message.clientWidth;

		customHover.update(messageOverflows ? this.template.message.textContent + '' : '');

		return messageOverflows;
	}

	private renderSecondaryActions(notification: INotificationViewItem, messageOverflows: boolean): void {
		const actions: IAction[] = [];

		// Secondary Actions
		if (isNonEmptyArray(notification.actions?.secondary)) {
			const configureNotificationAction = this.instantiationService.createInstance(ConfigureNotificationAction, ConfigureNotificationAction.ID, ConfigureNotificationAction.LABEL, notification);
			actions.push(configureNotificationAction);
			this.inputDisposables.add(configureNotificationAction);
		}

		// Expand / Collapse
		let showExpandCollapseAction = false;
		if (notification.canCollapse) {
			if (notification.expanded) {
				showExpandCollapseAction = true; // allow to collapse an expanded message
			} else if (notification.source) {
				showExpandCollapseAction = true; // allow to expand to details row
			} else if (messageOverflows) {
				showExpandCollapseAction = true; // allow to expand if message overflows
			}
		}

		if (showExpandCollapseAction) {
			actions.push(notification.expanded ? NotificationTemplateRenderer.collapseNotificationAction : NotificationTemplateRenderer.expandNotificationAction);
		}

		// Close (unless progress is showing)
		if (!notification.hasProgress) {
			actions.push(NotificationTemplateRenderer.closeNotificationAction);
		}

		this.template.toolbar.clear();
		this.template.toolbar.context = notification;
		actions.forEach(action => this.template.toolbar.push(action, { icon: true, label: false, keybinding: this.getKeybindingLabel(action) }));
	}

	private renderSource(notification: INotificationViewItem, sourceCustomHover: IManagedHover): void {
		if (notification.expanded && notification.source) {
			this.template.source.textContent = localize('notificationSource', "Source: {0}", notification.source);
			sourceCustomHover.update(notification.source);
		} else {
			this.template.source.textContent = '';
			sourceCustomHover.update('');
		}
	}

	private renderButtons(notification: INotificationViewItem): void {
		clearNode(this.template.buttonsContainer);

		const primaryActions = notification.actions ? notification.actions.primary : undefined;
		if (notification.expanded && isNonEmptyArray(primaryActions)) {
			const that = this;

			const actionRunner: IActionRunner = this.inputDisposables.add(new class extends ActionRunner {
				protected override async runAction(action: IAction): Promise<void> {

					// Run action
					that.actionRunner.run(action, notification);

					// Hide notification (unless explicitly prevented)
					if (!(action instanceof ChoiceAction) || !action.keepOpen) {
						notification.close();
					}
				}
			}());

			const buttonToolbar = this.inputDisposables.add(new ButtonBar(this.template.buttonsContainer));
			for (let i = 0; i < primaryActions.length; i++) {
				const action = primaryActions[i];

				const options: IButtonOptions = {
					title: true,  // assign titles to buttons in case they overflow
					secondary: i > 0,
					...defaultButtonStyles
				};

				const dropdownActions = action instanceof ChoiceAction ? action.menu : undefined;
				const button = this.inputDisposables.add(dropdownActions ?
					buttonToolbar.addButtonWithDropdown({
						...options,
						contextMenuProvider: this.contextMenuService,
						actions: dropdownActions,
						actionRunner
					}) :
					buttonToolbar.addButton(options)
				);

				button.label = action.label;

				this.inputDisposables.add(button.onDidClick(e => {
					if (e) {
						EventHelper.stop(e, true);
					}

					actionRunner.run(action);
				}));
			}
		}
	}

	private renderProgress(notification: INotificationViewItem): void {

		// Return early if the item has no progress
		if (!notification.hasProgress) {
			this.template.progress.stop().hide();

			return;
		}

		// Infinite
		const state = notification.progress.state;
		if (state.infinite) {
			this.template.progress.infinite().show();
		}

		// Total / Worked
		else if (typeof state.total === 'number' || typeof state.worked === 'number') {
			if (typeof state.total === 'number' && !this.template.progress.hasTotal()) {
				this.template.progress.total(state.total);
			}

			if (typeof state.worked === 'number') {
				this.template.progress.setWorked(state.worked).show();
			}
		}

		// Done
		else {
			this.template.progress.done().hide();
		}
	}

	private toSeverityIcon(severity: Severity): ThemeIcon {
		switch (severity) {
			case Severity.Warning:
				return Codicon.warning;
			case Severity.Error:
				return Codicon.error;
		}
		return Codicon.info;
	}

	private getKeybindingLabel(action: IAction): string | null {
		const keybinding = this.keybindingService.lookupKeybinding(action.id);

		return keybinding ? keybinding.getLabel() : null;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/notifications/media/notificationsActions.css]---
Location: vscode-main/src/vs/workbench/browser/parts/notifications/media/notificationsActions.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-workbench .notifications-list-container .notification-list-item .notification-list-item-toolbar-container .action-item,
.monaco-workbench > .notifications-center > .notifications-center-header > .notifications-center-header-toolbar .action-item {
	margin-right: 4px;
}

.monaco-workbench .notifications-list-container .notification-list-item .notification-list-item-toolbar-container .action-item:first-child,
.monaco-workbench > .notifications-center > .notifications-center-header > .notifications-center-header-toolbar .action-item:first-child {
	margin-left: 4px;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/notifications/media/notificationsCenter.css]---
Location: vscode-main/src/vs/workbench/browser/parts/notifications/media/notificationsCenter.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-workbench > .notifications-center {
	position: absolute;
	z-index: 1000;
	right: 7px; /* attempt to position at same location as a toast */
	bottom: 29px; /* 22px status bar height + 7px (attempt to position at same location as a toast) */
	display: none;
	overflow: hidden;
	border-radius: 4px;
}

.monaco-workbench.nostatusbar > .notifications-center {
	bottom: 11px; /* attempt to position at same location as a toast */
}

.monaco-workbench > .notifications-center.visible {
	display: block;
}

/* Header */

.monaco-workbench > .notifications-center > .notifications-center-header {
	display: flex;
	align-items: center;
	padding-left: 8px;
	padding-right: 5px;
	height: 35px;
}

.monaco-workbench > .notifications-center > .notifications-center-header > .notifications-center-header-title {
	text-transform: uppercase;
	font-size: 11px;
}

.monaco-workbench > .notifications-center > .notifications-center-header > .notifications-center-header-toolbar {
	flex: 1;
}

.monaco-workbench > .notifications-center > .notifications-center-header > .notifications-center-header-toolbar .actions-container {
	justify-content: flex-end;
}

.monaco-workbench > .notifications-center .notifications-list-container .monaco-list-row:not(:last-child) > .notification-list-item {
	border-bottom: 1px solid var(--vscode-notifications-border);
}

.monaco-workbench > .notifications-center .notifications-list-container .monaco-list-row:last-child {
	border-radius: 0px 0px 4px 4px; /* adopt the border radius at the end of the notifications center */
}

/* Icons */

.monaco-workbench > .notifications-center .codicon.codicon-error {
	color: var(--vscode-notificationsErrorIcon-foreground) !important;
}

.monaco-workbench > .notifications-center .codicon.codicon-warning {
	color: var(--vscode-notificationsWarningIcon-foreground) !important;
}

.monaco-workbench > .notifications-center .codicon.codicon-info {
	color: var(--vscode-notificationsInfoIcon-foreground) !important;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/notifications/media/notificationsList.css]---
Location: vscode-main/src/vs/workbench/browser/parts/notifications/media/notificationsList.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/** Notification: Container */

.monaco-workbench .notifications-list-container {
	color: var(--vscode-notifications-foreground);
	background: var(--vscode-notifications-background);
	outline-color: var(--vscode-contrastBorder);
}

.monaco-workbench .notifications-list-container .notification-list-item {
	display: flex;
	flex-direction: column-reverse; /* the details row appears first in order for better keyboard access to notification buttons */
	padding: 10px 5px;
	height: 100%;
	box-sizing: border-box;
}

.monaco-workbench .notifications-list-container .notification-offset-helper {
	opacity: 0;
	position: absolute;
	line-height: 22px;
	word-wrap: break-word; /* never overflow long words, but break to next line */
}

/** Notification: Main Row */

.monaco-workbench .notifications-list-container .notification-list-item > .notification-list-item-main-row {
	display: flex;
	flex-grow: 1;
}

/** Notification: Icon */

.monaco-workbench .notifications-list-container .notification-list-item .notification-list-item-icon {
	display: flex;
	align-items: center;
	flex: 0 0 16px;
	height: 22px;
	margin-right: 4px;
	margin-left: 4px;
	font-size: 18px;
	background-position: center;
	background-repeat: no-repeat;
}

/** Notification: Message */

.monaco-workbench .notifications-list-container .notification-list-item .notification-list-item-message {
	line-height: 22px;
	overflow: hidden;
	text-overflow: ellipsis;
	flex: 1; /* let the message always grow */
	user-select: text;
	-webkit-user-select: text;
}

.monaco-workbench .notifications-list-container .notification-list-item .notification-list-item-message a {
	color: var(--vscode-notificationLink-foreground);
}

.monaco-workbench .notifications-list-container .notification-list-item .notification-list-item-message a:focus {
	outline-width: 1px;
	outline-style: solid;
	outline-color: var(--vscode-focusBorder);
}

.monaco-workbench .notifications-list-container .notification-list-item.expanded .notification-list-item-message {
	white-space: normal;
	word-wrap: break-word; /* never overflow long words, but break to next line */
}

/** Notification: Toolbar Container */

.monaco-workbench .notifications-list-container .notification-list-item .notification-list-item-toolbar-container {
	display: none;
	height: 22px;
}

.monaco-workbench .notifications-list-container .monaco-list:focus-within .notification-list-item .notification-list-item-toolbar-container,
.monaco-workbench .notifications-list-container .notification-list-item:hover .notification-list-item-toolbar-container,
.monaco-workbench .notifications-list-container .monaco-list-row.focused .notification-list-item .notification-list-item-toolbar-container,
.monaco-workbench .notifications-list-container .notification-list-item.expanded .notification-list-item-toolbar-container {
	display: block;
}

/** Notification: Details Row */

.monaco-workbench .notifications-list-container .notification-list-item > .notification-list-item-details-row {
	display: none;
	align-items: center;
	padding-left: 5px;
	overflow: hidden; /* details row should never overflow */
}

.monaco-workbench .notifications-list-container .notification-list-item.expanded > .notification-list-item-details-row {
	display: flex;
}

/** Notification: Source */

.monaco-workbench .notifications-list-container .notification-list-item .notification-list-item-source {
	flex: 1;
	font-size: 12px;
	overflow: hidden; /* always give away space to buttons container */
	text-overflow: ellipsis;
}

/** Notification: Buttons */

.monaco-workbench .notifications-list-container .notification-list-item .notification-list-item-buttons-container {
	display: flex;
	overflow: hidden;
}

.monaco-workbench .notifications-list-container .notification-list-item .notification-list-item-buttons-container > .monaco-button-dropdown,
.monaco-workbench .notifications-list-container .notification-list-item .notification-list-item-buttons-container > .monaco-button {
	margin: 4px 5px; /* allows button focus outline to be visible */
}

.monaco-workbench .notifications-list-container .notification-list-item .notification-list-item-buttons-container .monaco-button {
	outline-offset: 2px !important;
}

.monaco-workbench .notifications-list-container .notification-list-item .notification-list-item-buttons-container .monaco-text-button {
	width: fit-content;
	padding: 4px 10px;
	display: inline-block;	/* to enable ellipsis in text overflow */
	font-size: 12px;
	overflow: hidden;
	text-overflow: ellipsis;
}

.monaco-workbench .notifications-list-container .notification-list-item .notification-list-item-buttons-container .monaco-dropdown-button {
	padding: 5px
}

/** Notification: Progress */

.monaco-workbench .notifications-list-container .progress-bit {
	bottom: 0;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/notifications/media/notificationsToasts.css]---
Location: vscode-main/src/vs/workbench/browser/parts/notifications/media/notificationsToasts.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-workbench > .notifications-toasts {
	position: absolute;
	z-index: 1000;
	right: 3px;
	bottom: 25px; /* 22px status bar height + 3px */
	display: none;
	overflow: hidden;
}

.monaco-workbench.nostatusbar > .notifications-toasts {
	bottom: 3px;
}

.monaco-workbench > .notifications-toasts.visible {
	display: flex;
	flex-direction: column;
}

.monaco-workbench > .notifications-toasts .notification-toast-container {
	overflow: hidden; /* this ensures that the notification toast does not shine through */
}

.monaco-workbench > .notifications-toasts .notification-toast-container > .notification-toast {
	margin: 4px; /* enables separation and drop shadows around toasts */
	transform: translate3d(0px, 100%, 0px); /* move the notification 50px to the bottom (to prevent bleed through) */
	opacity: 0; /*  fade the toast in */
	transition:	transform 300ms ease-out, opacity 300ms ease-out;
}

.monaco-workbench > .notifications-toasts .notifications-list-container,
.monaco-workbench > .notifications-toasts .notification-toast-container > .notification-toast,
.monaco-workbench > .notifications-toasts .notification-toast-container > .notification-toast .monaco-scrollable-element,
.monaco-workbench > .notifications-toasts .notification-toast-container > .notification-toast .monaco-list:not(.element-focused):focus:before,
.monaco-workbench > .notifications-toasts .notification-toast-container > .notification-toast .monaco-list-row {
	border-radius: 4px;
}

.monaco-workbench.monaco-reduce-motion > .notifications-toasts .notification-toast-container > .notification-toast {
	transition: transform 0ms ease-out, opacity 0ms ease-out;
}

.monaco-workbench > .notifications-toasts .notification-toast-container > .notification-toast.notification-fade-in {
	opacity: 1;
	transform: none;
}

.monaco-workbench > .notifications-toasts .notification-toast-container > .notification-toast.notification-fade-in-done {
	opacity: 1;
	transform: none;
	transition: none;
}

/* Icons */

.monaco-workbench > .notifications-toasts .codicon.codicon-error {
	color: var(--vscode-notificationsErrorIcon-foreground) !important;
}

.monaco-workbench > .notifications-toasts .codicon.codicon-warning {
	color: var(--vscode-notificationsWarningIcon-foreground) !important;
}

.monaco-workbench > .notifications-toasts .codicon.codicon-info {
	color: var(--vscode-notificationsInfoIcon-foreground) !important;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/panel/panelActions.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/panel/panelActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/panelpart.css';
import { localize, localize2 } from '../../../../nls.js';
import { KeyMod, KeyCode } from '../../../../base/common/keyCodes.js';
import { MenuId, MenuRegistry, registerAction2, Action2, IAction2Options } from '../../../../platform/actions/common/actions.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { isHorizontal, IWorkbenchLayoutService, PanelAlignment, Parts, Position, positionToString } from '../../../services/layout/browser/layoutService.js';
import { IsAuxiliaryWindowContext, PanelAlignmentContext, PanelMaximizedContext, PanelPositionContext, PanelVisibleContext } from '../../../common/contextkeys.js';
import { ContextKeyExpr, ContextKeyExpression } from '../../../../platform/contextkey/common/contextkey.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';
import { ServicesAccessor } from '../../../../editor/browser/editorExtensions.js';
import { ViewContainerLocation, IViewDescriptorService } from '../../../common/views.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { IPaneCompositePartService } from '../../../services/panecomposite/browser/panecomposite.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { ICommandActionTitle } from '../../../../platform/action/common/action.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { SwitchCompositeViewAction } from '../compositeBarActions.js';

const maximizeIcon = registerIcon('panel-maximize', Codicon.screenFull, localize('maximizeIcon', 'Icon to maximize a panel.'));
export const closeIcon = registerIcon('panel-close', Codicon.close, localize('closeIcon', 'Icon to close a panel.'));
const panelIcon = registerIcon('panel-layout-icon', Codicon.layoutPanel, localize('togglePanelOffIcon', 'Icon to toggle the panel off when it is on.'));
const panelOffIcon = registerIcon('panel-layout-icon-off', Codicon.layoutPanelOff, localize('togglePanelOnIcon', 'Icon to toggle the panel on when it is off.'));

export class TogglePanelAction extends Action2 {

	static readonly ID = 'workbench.action.togglePanel';
	static readonly LABEL = localize2('togglePanelVisibility', "Toggle Panel Visibility");

	constructor() {
		super({
			id: TogglePanelAction.ID,
			title: TogglePanelAction.LABEL,
			toggled: {
				condition: PanelVisibleContext,
				title: localize('closePanel', 'Hide Panel'),
				icon: closeIcon,
				mnemonicTitle: localize({ key: 'miTogglePanelMnemonic', comment: ['&& denotes a mnemonic'] }, "&&Panel"),
			},
			icon: closeIcon,
			f1: true,
			category: Categories.View,
			metadata: {
				description: localize('openAndClosePanel', 'Open/Show and Close/Hide Panel'),
			},
			keybinding: { primary: KeyMod.CtrlCmd | KeyCode.KeyJ, weight: KeybindingWeight.WorkbenchContrib },
			menu: [
				{
					id: MenuId.MenubarAppearanceMenu,
					group: '2_workbench_layout',
					order: 5
				}, {
					id: MenuId.LayoutControlMenuSubmenu,
					group: '0_workbench_layout',
					order: 4
				}
			]
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const layoutService = accessor.get(IWorkbenchLayoutService);
		layoutService.setPartHidden(layoutService.isVisible(Parts.PANEL_PART), Parts.PANEL_PART);
	}
}

registerAction2(TogglePanelAction);

MenuRegistry.appendMenuItem(MenuId.PanelTitle, {
	command: {
		id: TogglePanelAction.ID,
		title: localize('closePanel', 'Hide Panel'),
		icon: closeIcon
	},
	group: 'navigation',
	order: 2
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'workbench.action.closePanel',
			title: localize2('closePanel', 'Hide Panel'),
			category: Categories.View,
			precondition: PanelVisibleContext,
			f1: true,
		});
	}
	run(accessor: ServicesAccessor) {
		accessor.get(IWorkbenchLayoutService).setPartHidden(true, Parts.PANEL_PART);
	}
});

registerAction2(class extends Action2 {

	static readonly ID = 'workbench.action.focusPanel';
	static readonly LABEL = localize('focusPanel', "Focus into Panel");

	constructor() {
		super({
			id: 'workbench.action.focusPanel',
			title: localize2('focusPanel', "Focus into Panel"),
			category: Categories.View,
			f1: true,
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const layoutService = accessor.get(IWorkbenchLayoutService);
		const paneCompositeService = accessor.get(IPaneCompositePartService);

		// Show panel
		if (!layoutService.isVisible(Parts.PANEL_PART)) {
			layoutService.setPartHidden(false, Parts.PANEL_PART);
		}

		// Focus into active panel
		const panel = paneCompositeService.getActivePaneComposite(ViewContainerLocation.Panel);
		panel?.focus();
	}
});

const PositionPanelActionId = {
	LEFT: 'workbench.action.positionPanelLeft',
	RIGHT: 'workbench.action.positionPanelRight',
	BOTTOM: 'workbench.action.positionPanelBottom',
	TOP: 'workbench.action.positionPanelTop'
};

const AlignPanelActionId = {
	LEFT: 'workbench.action.alignPanelLeft',
	RIGHT: 'workbench.action.alignPanelRight',
	CENTER: 'workbench.action.alignPanelCenter',
	JUSTIFY: 'workbench.action.alignPanelJustify',
};

interface PanelActionConfig<T> {
	id: string;
	when: ContextKeyExpression;
	title: ICommandActionTitle;
	shortLabel: string;
	value: T;
}

function createPanelActionConfig<T>(id: string, title: ICommandActionTitle, shortLabel: string, value: T, when: ContextKeyExpression): PanelActionConfig<T> {
	return {
		id,
		title,
		shortLabel,
		value,
		when,
	};
}

function createPositionPanelActionConfig(id: string, title: ICommandActionTitle, shortLabel: string, position: Position): PanelActionConfig<Position> {
	return createPanelActionConfig<Position>(id, title, shortLabel, position, PanelPositionContext.notEqualsTo(positionToString(position)));
}

function createAlignmentPanelActionConfig(id: string, title: ICommandActionTitle, shortLabel: string, alignment: PanelAlignment): PanelActionConfig<PanelAlignment> {
	return createPanelActionConfig<PanelAlignment>(id, title, shortLabel, alignment, PanelAlignmentContext.notEqualsTo(alignment));
}

const PositionPanelActionConfigs: PanelActionConfig<Position>[] = [
	createPositionPanelActionConfig(PositionPanelActionId.TOP, localize2('positionPanelTop', "Move Panel To Top"), localize('positionPanelTopShort', "Top"), Position.TOP),
	createPositionPanelActionConfig(PositionPanelActionId.LEFT, localize2('positionPanelLeft', "Move Panel Left"), localize('positionPanelLeftShort', "Left"), Position.LEFT),
	createPositionPanelActionConfig(PositionPanelActionId.RIGHT, localize2('positionPanelRight', "Move Panel Right"), localize('positionPanelRightShort', "Right"), Position.RIGHT),
	createPositionPanelActionConfig(PositionPanelActionId.BOTTOM, localize2('positionPanelBottom', "Move Panel To Bottom"), localize('positionPanelBottomShort', "Bottom"), Position.BOTTOM),
];


const AlignPanelActionConfigs: PanelActionConfig<PanelAlignment>[] = [
	createAlignmentPanelActionConfig(AlignPanelActionId.LEFT, localize2('alignPanelLeft', "Set Panel Alignment to Left"), localize('alignPanelLeftShort', "Left"), 'left'),
	createAlignmentPanelActionConfig(AlignPanelActionId.RIGHT, localize2('alignPanelRight', "Set Panel Alignment to Right"), localize('alignPanelRightShort', "Right"), 'right'),
	createAlignmentPanelActionConfig(AlignPanelActionId.CENTER, localize2('alignPanelCenter', "Set Panel Alignment to Center"), localize('alignPanelCenterShort', "Center"), 'center'),
	createAlignmentPanelActionConfig(AlignPanelActionId.JUSTIFY, localize2('alignPanelJustify', "Set Panel Alignment to Justify"), localize('alignPanelJustifyShort', "Justify"), 'justify'),
];

MenuRegistry.appendMenuItem(MenuId.MenubarAppearanceMenu, {
	submenu: MenuId.PanelPositionMenu,
	title: localize('positionPanel', "Panel Position"),
	group: '3_workbench_layout_move',
	order: 4
});

PositionPanelActionConfigs.forEach((positionPanelAction, index) => {
	const { id, title, shortLabel, value, when } = positionPanelAction;

	registerAction2(class extends Action2 {
		constructor() {
			super({
				id,
				title,
				category: Categories.View,
				f1: true
			});
		}
		run(accessor: ServicesAccessor): void {
			const layoutService = accessor.get(IWorkbenchLayoutService);
			layoutService.setPanelPosition(value === undefined ? Position.BOTTOM : value);
		}
	});

	MenuRegistry.appendMenuItem(MenuId.PanelPositionMenu, {
		command: {
			id,
			title: shortLabel,
			toggled: when.negate()
		},
		order: 5 + index
	});
});

MenuRegistry.appendMenuItem(MenuId.MenubarAppearanceMenu, {
	submenu: MenuId.PanelAlignmentMenu,
	title: localize('alignPanel', "Align Panel"),
	group: '3_workbench_layout_move',
	order: 5
});

AlignPanelActionConfigs.forEach(alignPanelAction => {
	const { id, title, shortLabel, value, when } = alignPanelAction;
	registerAction2(class extends Action2 {
		constructor() {
			super({
				id,
				title,
				category: Categories.View,
				toggled: when.negate(),
				f1: true
			});
		}
		run(accessor: ServicesAccessor): void {
			const layoutService = accessor.get(IWorkbenchLayoutService);
			layoutService.setPanelAlignment(value === undefined ? 'center' : value);
		}
	});

	MenuRegistry.appendMenuItem(MenuId.PanelAlignmentMenu, {
		command: {
			id,
			title: shortLabel,
			toggled: when.negate()
		},
		order: 5
	});
});

registerAction2(class extends SwitchCompositeViewAction {
	constructor() {
		super({
			id: 'workbench.action.previousPanelView',
			title: localize2('previousPanelView', "Previous Panel View"),
			category: Categories.View,
			f1: true
		}, ViewContainerLocation.Panel, -1);
	}
});

registerAction2(class extends SwitchCompositeViewAction {
	constructor() {
		super({
			id: 'workbench.action.nextPanelView',
			title: localize2('nextPanelView', "Next Panel View"),
			category: Categories.View,
			f1: true
		}, ViewContainerLocation.Panel, 1);
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'workbench.action.toggleMaximizedPanel',
			title: localize2('toggleMaximizedPanel', 'Toggle Maximized Panel'),
			tooltip: localize('maximizePanel', "Maximize Panel Size"),
			category: Categories.View,
			f1: true,
			icon: maximizeIcon,
			// the workbench grid currently prevents us from supporting panel maximization with non-center panel alignment
			precondition: ContextKeyExpr.or(PanelAlignmentContext.isEqualTo('center'), ContextKeyExpr.and(PanelPositionContext.notEqualsTo('bottom'), PanelPositionContext.notEqualsTo('top'))),
			toggled: { condition: PanelMaximizedContext, icon: maximizeIcon, tooltip: localize('minimizePanel', "Restore Panel Size") },
			menu: [{
				id: MenuId.PanelTitle,
				group: 'navigation',
				order: 1,
				// the workbench grid currently prevents us from supporting panel maximization with non-center panel alignment
				when: ContextKeyExpr.or(PanelAlignmentContext.isEqualTo('center'), ContextKeyExpr.and(PanelPositionContext.notEqualsTo('bottom'), PanelPositionContext.notEqualsTo('top')))
			}]
		});
	}
	run(accessor: ServicesAccessor) {
		const layoutService = accessor.get(IWorkbenchLayoutService);
		const notificationService = accessor.get(INotificationService);
		if (layoutService.getPanelAlignment() !== 'center' && isHorizontal(layoutService.getPanelPosition())) {
			notificationService.warn(localize('panelMaxNotSupported', "Maximizing the panel is only supported when it is center aligned."));
			return;
		}

		if (!layoutService.isVisible(Parts.PANEL_PART)) {
			layoutService.setPartHidden(false, Parts.PANEL_PART);
			// If the panel is not already maximized, maximize it
			if (!layoutService.isPanelMaximized()) {
				layoutService.toggleMaximizedPanel();
			}
		}
		else {
			layoutService.toggleMaximizedPanel();
		}
	}
});

MenuRegistry.appendMenuItems([
	{
		id: MenuId.LayoutControlMenu,
		item: {
			group: '2_pane_toggles',
			command: {
				id: TogglePanelAction.ID,
				title: localize('togglePanel', "Toggle Panel"),
				icon: panelOffIcon,
				toggled: { condition: PanelVisibleContext, icon: panelIcon }
			},
			when:
				ContextKeyExpr.and(
					IsAuxiliaryWindowContext.negate(),
					ContextKeyExpr.or(
						ContextKeyExpr.equals('config.workbench.layoutControl.type', 'toggles'),
						ContextKeyExpr.equals('config.workbench.layoutControl.type', 'both')
					)
				),
			order: 1
		}
	}
]);

class MoveViewsBetweenPanelsAction extends Action2 {
	constructor(private readonly source: ViewContainerLocation, private readonly destination: ViewContainerLocation, desc: Readonly<IAction2Options>) {
		super(desc);
	}

	run(accessor: ServicesAccessor, ...args: unknown[]): void {
		const viewDescriptorService = accessor.get(IViewDescriptorService);
		const layoutService = accessor.get(IWorkbenchLayoutService);
		const viewsService = accessor.get(IViewsService);

		const srcContainers = viewDescriptorService.getViewContainersByLocation(this.source);
		const destContainers = viewDescriptorService.getViewContainersByLocation(this.destination);

		if (srcContainers.length) {
			const activeViewContainer = viewsService.getVisibleViewContainer(this.source);

			srcContainers.forEach(viewContainer => viewDescriptorService.moveViewContainerToLocation(viewContainer, this.destination, undefined, this.desc.id));
			layoutService.setPartHidden(false, this.destination === ViewContainerLocation.Panel ? Parts.PANEL_PART : Parts.AUXILIARYBAR_PART);

			if (activeViewContainer && destContainers.length === 0) {
				viewsService.openViewContainer(activeViewContainer.id, true);
			}
		}
	}
}

// --- Move Panel Views To Secondary Side Bar

class MovePanelToSidePanelAction extends MoveViewsBetweenPanelsAction {
	static readonly ID = 'workbench.action.movePanelToSidePanel';
	constructor() {
		super(ViewContainerLocation.Panel, ViewContainerLocation.AuxiliaryBar, {
			id: MovePanelToSidePanelAction.ID,
			title: localize2('movePanelToSecondarySideBar', "Move Panel Views To Secondary Side Bar"),
			category: Categories.View,
			f1: false
		});
	}
}

export class MovePanelToSecondarySideBarAction extends MoveViewsBetweenPanelsAction {
	static readonly ID = 'workbench.action.movePanelToSecondarySideBar';
	constructor() {
		super(ViewContainerLocation.Panel, ViewContainerLocation.AuxiliaryBar, {
			id: MovePanelToSecondarySideBarAction.ID,
			title: localize2('movePanelToSecondarySideBar', "Move Panel Views To Secondary Side Bar"),
			category: Categories.View,
			f1: true
		});
	}
}

registerAction2(MovePanelToSidePanelAction);
registerAction2(MovePanelToSecondarySideBarAction);

// --- Move Secondary Side Bar Views To Panel

class MoveSidePanelToPanelAction extends MoveViewsBetweenPanelsAction {
	static readonly ID = 'workbench.action.moveSidePanelToPanel';

	constructor() {
		super(ViewContainerLocation.AuxiliaryBar, ViewContainerLocation.Panel, {
			id: MoveSidePanelToPanelAction.ID,
			title: localize2('moveSidePanelToPanel', "Move Secondary Side Bar Views To Panel"),
			category: Categories.View,
			f1: false
		});
	}
}

export class MoveSecondarySideBarToPanelAction extends MoveViewsBetweenPanelsAction {
	static readonly ID = 'workbench.action.moveSecondarySideBarToPanel';

	constructor() {
		super(ViewContainerLocation.AuxiliaryBar, ViewContainerLocation.Panel, {
			id: MoveSecondarySideBarToPanelAction.ID,
			title: localize2('moveSidePanelToPanel', "Move Secondary Side Bar Views To Panel"),
			category: Categories.View,
			f1: true
		});
	}
}
registerAction2(MoveSidePanelToPanelAction);
registerAction2(MoveSecondarySideBarToPanelAction);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/panel/panelPart.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/panel/panelPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/panelpart.css';
import { localize } from '../../../../nls.js';
import { IAction, Separator, SubmenuAction, toAction } from '../../../../base/common/actions.js';
import { ActionsOrientation } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { ActivePanelContext, PanelFocusContext } from '../../../common/contextkeys.js';
import { IWorkbenchLayoutService, Parts, Position } from '../../../services/layout/browser/layoutService.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { TogglePanelAction } from './panelActions.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { PANEL_BACKGROUND, PANEL_BORDER, PANEL_TITLE_BORDER, PANEL_ACTIVE_TITLE_FOREGROUND, PANEL_INACTIVE_TITLE_FOREGROUND, PANEL_ACTIVE_TITLE_BORDER, PANEL_DRAG_AND_DROP_BORDER, PANEL_TITLE_BADGE_BACKGROUND, PANEL_TITLE_BADGE_FOREGROUND } from '../../../common/theme.js';
import { contrastBorder } from '../../../../platform/theme/common/colorRegistry.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { Dimension } from '../../../../base/browser/dom.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { assertReturnsDefined } from '../../../../base/common/types.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { IViewDescriptorService } from '../../../common/views.js';
import { HoverPosition } from '../../../../base/browser/ui/hover/hoverWidget.js';
import { IMenuService, MenuId } from '../../../../platform/actions/common/actions.js';
import { AbstractPaneCompositePart, CompositeBarPosition } from '../paneCompositePart.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { getContextMenuActions } from '../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { IPaneCompositeBarOptions } from '../paneCompositeBar.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';

export class PanelPart extends AbstractPaneCompositePart {

	//#region IView

	readonly minimumWidth: number = 300;
	readonly maximumWidth: number = Number.POSITIVE_INFINITY;
	readonly minimumHeight: number = 77;
	readonly maximumHeight: number = Number.POSITIVE_INFINITY;

	get preferredHeight(): number | undefined {
		// Don't worry about titlebar or statusbar visibility
		// The difference is minimal and keeps this function clean
		return this.layoutService.mainContainerDimension.height * 0.4;
	}

	get preferredWidth(): number | undefined {
		const activeComposite = this.getActivePaneComposite();

		if (!activeComposite) {
			return undefined;
		}

		const width = activeComposite.getOptimalWidth();
		if (typeof width !== 'number') {
			return undefined;
		}

		return Math.max(width, 300);
	}

	//#endregion

	static readonly activePanelSettingsKey = 'workbench.panelpart.activepanelid';

	constructor(
		@INotificationService notificationService: INotificationService,
		@IStorageService storageService: IStorageService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IWorkbenchLayoutService layoutService: IWorkbenchLayoutService,
		@IKeybindingService keybindingService: IKeybindingService,
		@IHoverService hoverService: IHoverService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IThemeService themeService: IThemeService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IExtensionService extensionService: IExtensionService,
		@ICommandService private commandService: ICommandService,
		@IMenuService menuService: IMenuService,
		@IConfigurationService private configurationService: IConfigurationService
	) {
		super(
			Parts.PANEL_PART,
			{ hasTitle: true, trailingSeparator: true },
			PanelPart.activePanelSettingsKey,
			ActivePanelContext.bindTo(contextKeyService),
			PanelFocusContext.bindTo(contextKeyService),
			'panel',
			'panel',
			undefined,
			PANEL_TITLE_BORDER,
			notificationService,
			storageService,
			contextMenuService,
			layoutService,
			keybindingService,
			hoverService,
			instantiationService,
			themeService,
			viewDescriptorService,
			contextKeyService,
			extensionService,
			menuService,
		);

		this._register(this.configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('workbench.panel.showLabels')) {
				this.updateCompositeBar(true);
			}
		}));
	}

	override updateStyles(): void {
		super.updateStyles();

		const container = assertReturnsDefined(this.getContainer());
		container.style.backgroundColor = this.getColor(PANEL_BACKGROUND) || '';
		const borderColor = this.getColor(PANEL_BORDER) || this.getColor(contrastBorder) || '';
		container.style.borderLeftColor = borderColor;
		container.style.borderRightColor = borderColor;
		container.style.borderBottomColor = borderColor;

		if (this.titleArea) {
			this.titleArea.style.borderTopColor = this.getColor(PANEL_BORDER) || this.getColor(contrastBorder) || '';
		}
	}

	protected getCompositeBarOptions(): IPaneCompositeBarOptions {
		return {
			partContainerClass: 'panel',
			pinnedViewContainersKey: 'workbench.panel.pinnedPanels',
			placeholderViewContainersKey: 'workbench.panel.placeholderPanels',
			viewContainersWorkspaceStateKey: 'workbench.panel.viewContainersWorkspaceState',
			icon: this.configurationService.getValue('workbench.panel.showLabels') === false,
			orientation: ActionsOrientation.HORIZONTAL,
			recomputeSizes: true,
			activityHoverOptions: {
				position: () => this.layoutService.getPanelPosition() === Position.BOTTOM && !this.layoutService.isPanelMaximized() ? HoverPosition.ABOVE : HoverPosition.BELOW,
			},
			fillExtraContextMenuActions: actions => this.fillExtraContextMenuActions(actions),
			compositeSize: 0,
			iconSize: 16,
			compact: true, // Only applies to icons, not labels
			overflowActionSize: 44,
			colors: theme => ({
				activeBackgroundColor: theme.getColor(PANEL_BACKGROUND), // Background color for overflow action
				inactiveBackgroundColor: theme.getColor(PANEL_BACKGROUND), // Background color for overflow action
				activeBorderBottomColor: theme.getColor(PANEL_ACTIVE_TITLE_BORDER),
				activeForegroundColor: theme.getColor(PANEL_ACTIVE_TITLE_FOREGROUND),
				inactiveForegroundColor: theme.getColor(PANEL_INACTIVE_TITLE_FOREGROUND),
				badgeBackground: theme.getColor(PANEL_TITLE_BADGE_BACKGROUND),
				badgeForeground: theme.getColor(PANEL_TITLE_BADGE_FOREGROUND),
				dragAndDropBorder: theme.getColor(PANEL_DRAG_AND_DROP_BORDER)
			})
		};
	}

	private fillExtraContextMenuActions(actions: IAction[]): void {
		if (this.getCompositeBarPosition() === CompositeBarPosition.TITLE) {
			const viewsSubmenuAction = this.getViewsSubmenuAction();
			if (viewsSubmenuAction) {
				actions.push(new Separator());
				actions.push(viewsSubmenuAction);
			}
		}

		const panelPositionMenu = this.menuService.getMenuActions(MenuId.PanelPositionMenu, this.contextKeyService, { shouldForwardArgs: true });
		const panelAlignMenu = this.menuService.getMenuActions(MenuId.PanelAlignmentMenu, this.contextKeyService, { shouldForwardArgs: true });
		const positionActions = getContextMenuActions(panelPositionMenu).secondary;
		const alignActions = getContextMenuActions(panelAlignMenu).secondary;

		const panelShowLabels = this.configurationService.getValue<boolean | undefined>('workbench.panel.showLabels');
		const toggleShowLabelsAction = toAction({
			id: 'workbench.action.panel.toggleShowLabels',
			label: panelShowLabels ? localize('showIcons', "Show Icons") : localize('showLabels', "Show Labels"),
			run: () => this.configurationService.updateValue('workbench.panel.showLabels', !panelShowLabels)
		});

		actions.push(...[
			new Separator(),
			new SubmenuAction('workbench.action.panel.position', localize('panel position', "Panel Position"), positionActions),
			new SubmenuAction('workbench.action.panel.align', localize('align panel', "Align Panel"), alignActions),
			toggleShowLabelsAction,
			toAction({ id: TogglePanelAction.ID, label: localize('hidePanel', "Hide Panel"), run: () => this.commandService.executeCommand(TogglePanelAction.ID) }),
		]);
	}

	override layout(width: number, height: number, top: number, left: number): void {
		let dimensions: Dimension;
		switch (this.layoutService.getPanelPosition()) {
			case Position.RIGHT:
				dimensions = new Dimension(width - 1, height); // Take into account the 1px border when layouting
				break;
			case Position.TOP:
				dimensions = new Dimension(width, height - 1); // Take into account the 1px border when layouting
				break;
			default:
				dimensions = new Dimension(width, height);
				break;
		}

		// Layout contents
		super.layout(dimensions.width, dimensions.height, top, left);
	}

	protected override shouldShowCompositeBar(): boolean {
		return true;
	}

	protected getCompositeBarPosition(): CompositeBarPosition {
		return CompositeBarPosition.TITLE;
	}

	toJSON(): object {
		return {
			type: Parts.PANEL_PART
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/panel/media/panelpart.css]---
Location: vscode-main/src/vs/workbench/browser/parts/panel/media/panelpart.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-workbench.nopanel .part.panel {
	display: none !important;
	visibility: hidden !important;
}

.monaco-workbench .part.panel.bottom .composite.title {
	border-top-width: 1px;
	border-top-style: solid;
}

.monaco-workbench.nomaineditorarea .part.panel.bottom .composite.title {
	border-top-width: 0; /* no border when main editor area is hiden */
}

.monaco-workbench .part.panel.top {
	border-bottom-width: 1px;
	border-bottom-style: solid;
}

.monaco-workbench.nomaineditorarea .part.panel.top {
	border-bottom-width: 0; /* no border when main editor area is hiden */
}

.monaco-workbench .part.panel.right {
	border-left-width: 1px;
	border-left-style: solid;
}

.monaco-workbench.nomaineditorarea .part.panel.right {
	border-left-width: 0; /* no border when main editor area is hiden */
}

.monaco-workbench .part.panel.left {
	border-right-width: 1px;
	border-right-style: solid;
}

.monaco-workbench.nomaineditorarea .part.panel.left {
	border-right-width: 0; /* no border when main editor area is hiden */
}

.monaco-workbench .part.panel > .content .monaco-editor,
.monaco-workbench .part.panel > .content .monaco-editor .margin,
.monaco-workbench .part.panel > .content .monaco-editor .monaco-editor-background {
	/* THIS DOESN'T WORK ANYMORE */
	background-color: var(--vscode-panel-background);
}

.monaco-workbench .part.panel > .content .suggest-input-container .monaco-editor,
.monaco-workbench .part.panel > .content .suggest-input-container .monaco-editor .margin,
.monaco-workbench .part.panel > .content .suggest-input-container .monaco-editor .monaco-editor-background {
	background-color: inherit;
}

.monaco-workbench .part.panel > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item.checked:not(:focus) .active-item-indicator:before,
.monaco-workbench .part.panel > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item.checked.clicked:focus .active-item-indicator:before {
	border-top-color: var(--vscode-panelTitle-activeBorder) !important;
}

.monaco-workbench .part.panel > .title > .composite-bar-container >.composite-bar > .monaco-action-bar .action-item:focus .action-label,
.monaco-workbench .part.panel > .title > .composite-bar-container >.composite-bar > .monaco-action-bar .action-item:hover .action-label {
	color: var(--vscode-panelTitle-activeForeground) !important;
}

.monaco-workbench .part.panel .monaco-inputbox {
	border-color: var(--vscode-panelInput-border, transparent) !important;
}

.monaco-workbench .part.panel > .title > .composite-bar-container >.composite-bar > .monaco-action-bar .action-item:focus {
	outline: none;
}

/* Rotate icons when panel is on right */
.monaco-workbench .part.basepanel.right .title-actions .codicon-split-horizontal::before,
.monaco-workbench .part.basepanel.right .global-actions .codicon-panel-maximize::before,
.monaco-workbench .part.basepanel.right .global-actions .codicon-panel-restore::before {
	display: inline-block;
	transform: rotate(-90deg);
}

/* Rotate icons when panel is on left */
.monaco-workbench .part.basepanel.left .title-actions .codicon-split-horizontal::before,
.monaco-workbench .part.basepanel.left .global-actions .codicon-panel-maximize::before,
.monaco-workbench .part.basepanel.left .global-actions .codicon-panel-restore::before {
	display: inline-block;
	transform: rotate(90deg);
}

/* Rotate icons when panel is on left */
.monaco-workbench .part.basepanel.top .title-actions .codicon-split-horizontal::before,
.monaco-workbench .part.basepanel.top .global-actions .codicon-panel-maximize::before,
.monaco-workbench .part.basepanel.top .global-actions .codicon-panel-restore::before {
	display: inline-block;
	transform: rotate(180deg);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/sidebar/sidebarActions.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/sidebar/sidebarActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/sidebarpart.css';
import { localize2 } from '../../../../nls.js';
import { Action2, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { IWorkbenchLayoutService, Parts } from '../../../services/layout/browser/layoutService.js';
import { KeyMod, KeyCode } from '../../../../base/common/keyCodes.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { IPaneCompositePartService } from '../../../services/panecomposite/browser/panecomposite.js';
import { ViewContainerLocation } from '../../../common/views.js';
import { SideBarVisibleContext } from '../../../common/contextkeys.js';

registerAction2(class extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.closeSidebar',
			title: localize2('closeSidebar', 'Close Primary Side Bar'),
			category: Categories.View,
			f1: true,
			precondition: SideBarVisibleContext
		});
	}

	run(accessor: ServicesAccessor): void {
		accessor.get(IWorkbenchLayoutService).setPartHidden(true, Parts.SIDEBAR_PART);
	}
});

export class FocusSideBarAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.focusSideBar',
			title: localize2('focusSideBar', 'Focus into Primary Side Bar'),
			category: Categories.View,
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				when: null,
				primary: KeyMod.CtrlCmd | KeyCode.Digit0
			}
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const layoutService = accessor.get(IWorkbenchLayoutService);
		const paneCompositeService = accessor.get(IPaneCompositePartService);

		// Show side bar
		if (!layoutService.isVisible(Parts.SIDEBAR_PART)) {
			layoutService.setPartHidden(false, Parts.SIDEBAR_PART);
		}

		// Focus into active viewlet
		const viewlet = paneCompositeService.getActivePaneComposite(ViewContainerLocation.Sidebar);
		viewlet?.focus();
	}
}

registerAction2(FocusSideBarAction);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/sidebar/sidebarPart.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/sidebar/sidebarPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/sidebarpart.css';
import './sidebarActions.js';
import { ActivityBarPosition, IWorkbenchLayoutService, LayoutSettings, Parts, Position as SideBarPosition } from '../../../services/layout/browser/layoutService.js';
import { SidebarFocusContext, ActiveViewletContext } from '../../../common/contextkeys.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { contrastBorder } from '../../../../platform/theme/common/colorRegistry.js';
import { SIDE_BAR_TITLE_FOREGROUND, SIDE_BAR_TITLE_BORDER, SIDE_BAR_BACKGROUND, SIDE_BAR_FOREGROUND, SIDE_BAR_BORDER, SIDE_BAR_DRAG_AND_DROP_BACKGROUND, ACTIVITY_BAR_BADGE_BACKGROUND, ACTIVITY_BAR_BADGE_FOREGROUND, ACTIVITY_BAR_TOP_FOREGROUND, ACTIVITY_BAR_TOP_ACTIVE_BORDER, ACTIVITY_BAR_TOP_INACTIVE_FOREGROUND, ACTIVITY_BAR_TOP_DRAG_AND_DROP_BORDER } from '../../../common/theme.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { AnchorAlignment } from '../../../../base/browser/ui/contextview/contextview.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { LayoutPriority } from '../../../../base/browser/ui/grid/grid.js';
import { assertReturnsDefined } from '../../../../base/common/types.js';
import { IViewDescriptorService } from '../../../common/views.js';
import { AbstractPaneCompositePart, CompositeBarPosition } from '../paneCompositePart.js';
import { ActivityBarCompositeBar, ActivitybarPart } from '../activitybar/activitybarPart.js';
import { ActionsOrientation } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { HoverPosition } from '../../../../base/browser/ui/hover/hoverWidget.js';
import { IPaneCompositeBarOptions } from '../paneCompositeBar.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { Action2, IMenuService, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { Separator } from '../../../../base/common/actions.js';
import { ToggleActivityBarVisibilityActionId } from '../../actions/layoutActions.js';
import { localize2 } from '../../../../nls.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';

export class SidebarPart extends AbstractPaneCompositePart {

	static readonly activeViewletSettingsKey = 'workbench.sidebar.activeviewletid';

	//#region IView

	readonly minimumWidth: number = 170;
	readonly maximumWidth: number = Number.POSITIVE_INFINITY;
	readonly minimumHeight: number = 0;
	readonly maximumHeight: number = Number.POSITIVE_INFINITY;
	override get snap(): boolean { return true; }

	readonly priority: LayoutPriority = LayoutPriority.Low;

	get preferredWidth(): number | undefined {
		const viewlet = this.getActivePaneComposite();

		if (!viewlet) {
			return undefined;
		}

		const width = viewlet.getOptimalWidth();
		if (typeof width !== 'number') {
			return undefined;
		}

		return Math.max(width, 300);
	}

	private readonly activityBarPart = this._register(this.instantiationService.createInstance(ActivitybarPart, this));

	//#endregion

	constructor(
		@INotificationService notificationService: INotificationService,
		@IStorageService storageService: IStorageService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IWorkbenchLayoutService layoutService: IWorkbenchLayoutService,
		@IKeybindingService keybindingService: IKeybindingService,
		@IHoverService hoverService: IHoverService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IThemeService themeService: IThemeService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IExtensionService extensionService: IExtensionService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IMenuService menuService: IMenuService,
	) {
		super(
			Parts.SIDEBAR_PART,
			{ hasTitle: true, trailingSeparator: false, borderWidth: () => (this.getColor(SIDE_BAR_BORDER) || this.getColor(contrastBorder)) ? 1 : 0 },
			SidebarPart.activeViewletSettingsKey,
			ActiveViewletContext.bindTo(contextKeyService),
			SidebarFocusContext.bindTo(contextKeyService),
			'sideBar',
			'viewlet',
			SIDE_BAR_TITLE_FOREGROUND,
			SIDE_BAR_TITLE_BORDER,
			notificationService,
			storageService,
			contextMenuService,
			layoutService,
			keybindingService,
			hoverService,
			instantiationService,
			themeService,
			viewDescriptorService,
			contextKeyService,
			extensionService,
			menuService,
		);

		this.rememberActivityBarVisiblePosition();
		this._register(configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(LayoutSettings.ACTIVITY_BAR_LOCATION)) {
				this.onDidChangeActivityBarLocation();
			}
		}));

		this.registerActions();
	}

	private onDidChangeActivityBarLocation(): void {
		this.activityBarPart.hide();

		this.updateCompositeBar();

		const id = this.getActiveComposite()?.getId();
		if (id) {
			this.onTitleAreaUpdate(id);
		}

		if (this.shouldShowActivityBar()) {
			this.activityBarPart.show();
		}

		this.rememberActivityBarVisiblePosition();
	}

	override updateStyles(): void {
		super.updateStyles();

		const container = assertReturnsDefined(this.getContainer());

		container.style.backgroundColor = this.getColor(SIDE_BAR_BACKGROUND) || '';
		container.style.color = this.getColor(SIDE_BAR_FOREGROUND) || '';

		const borderColor = this.getColor(SIDE_BAR_BORDER) || this.getColor(contrastBorder);
		const isPositionLeft = this.layoutService.getSideBarPosition() === SideBarPosition.LEFT;
		container.style.borderRightWidth = borderColor && isPositionLeft ? '1px' : '';
		container.style.borderRightStyle = borderColor && isPositionLeft ? 'solid' : '';
		container.style.borderRightColor = isPositionLeft ? borderColor || '' : '';
		container.style.borderLeftWidth = borderColor && !isPositionLeft ? '1px' : '';
		container.style.borderLeftStyle = borderColor && !isPositionLeft ? 'solid' : '';
		container.style.borderLeftColor = !isPositionLeft ? borderColor || '' : '';
		container.style.outlineColor = this.getColor(SIDE_BAR_DRAG_AND_DROP_BACKGROUND) ?? '';
	}

	override layout(width: number, height: number, top: number, left: number): void {
		if (!this.layoutService.isVisible(Parts.SIDEBAR_PART)) {
			return;
		}

		super.layout(width, height, top, left);
	}

	protected override getTitleAreaDropDownAnchorAlignment(): AnchorAlignment {
		return this.layoutService.getSideBarPosition() === SideBarPosition.LEFT ? AnchorAlignment.LEFT : AnchorAlignment.RIGHT;
	}

	protected override createCompositeBar(): ActivityBarCompositeBar {
		return this.instantiationService.createInstance(ActivityBarCompositeBar, this.getCompositeBarOptions(), this.partId, this, false);
	}

	protected getCompositeBarOptions(): IPaneCompositeBarOptions {
		return {
			partContainerClass: 'sidebar',
			pinnedViewContainersKey: ActivitybarPart.pinnedViewContainersKey,
			placeholderViewContainersKey: ActivitybarPart.placeholderViewContainersKey,
			viewContainersWorkspaceStateKey: ActivitybarPart.viewContainersWorkspaceStateKey,
			icon: true,
			orientation: ActionsOrientation.HORIZONTAL,
			recomputeSizes: true,
			activityHoverOptions: {
				position: () => this.getCompositeBarPosition() === CompositeBarPosition.BOTTOM ? HoverPosition.ABOVE : HoverPosition.BELOW,
			},
			fillExtraContextMenuActions: actions => {
				if (this.getCompositeBarPosition() === CompositeBarPosition.TITLE) {
					const viewsSubmenuAction = this.getViewsSubmenuAction();
					if (viewsSubmenuAction) {
						actions.push(new Separator());
						actions.push(viewsSubmenuAction);
					}
				}
			},
			compositeSize: 0,
			iconSize: 16,
			overflowActionSize: 30,
			colors: theme => ({
				activeBackgroundColor: theme.getColor(SIDE_BAR_BACKGROUND),
				inactiveBackgroundColor: theme.getColor(SIDE_BAR_BACKGROUND),
				activeBorderBottomColor: theme.getColor(ACTIVITY_BAR_TOP_ACTIVE_BORDER),
				activeForegroundColor: theme.getColor(ACTIVITY_BAR_TOP_FOREGROUND),
				inactiveForegroundColor: theme.getColor(ACTIVITY_BAR_TOP_INACTIVE_FOREGROUND),
				badgeBackground: theme.getColor(ACTIVITY_BAR_BADGE_BACKGROUND),
				badgeForeground: theme.getColor(ACTIVITY_BAR_BADGE_FOREGROUND),
				dragAndDropBorder: theme.getColor(ACTIVITY_BAR_TOP_DRAG_AND_DROP_BORDER)
			}),
			compact: true
		};
	}

	protected shouldShowCompositeBar(): boolean {
		const activityBarPosition = this.configurationService.getValue<ActivityBarPosition>(LayoutSettings.ACTIVITY_BAR_LOCATION);
		return activityBarPosition === ActivityBarPosition.TOP || activityBarPosition === ActivityBarPosition.BOTTOM;
	}

	private shouldShowActivityBar(): boolean {
		if (this.shouldShowCompositeBar()) {
			return false;
		}

		return this.configurationService.getValue(LayoutSettings.ACTIVITY_BAR_LOCATION) !== ActivityBarPosition.HIDDEN;
	}

	protected getCompositeBarPosition(): CompositeBarPosition {
		const activityBarPosition = this.configurationService.getValue<ActivityBarPosition>(LayoutSettings.ACTIVITY_BAR_LOCATION);
		switch (activityBarPosition) {
			case ActivityBarPosition.TOP: return CompositeBarPosition.TOP;
			case ActivityBarPosition.BOTTOM: return CompositeBarPosition.BOTTOM;
			case ActivityBarPosition.HIDDEN:
			case ActivityBarPosition.DEFAULT: // noop
			default: return CompositeBarPosition.TITLE;
		}
	}

	private rememberActivityBarVisiblePosition(): void {
		const activityBarPosition = this.configurationService.getValue<string>(LayoutSettings.ACTIVITY_BAR_LOCATION);
		if (activityBarPosition !== ActivityBarPosition.HIDDEN) {
			this.storageService.store(LayoutSettings.ACTIVITY_BAR_LOCATION, activityBarPosition, StorageScope.PROFILE, StorageTarget.USER);
		}
	}

	private getRememberedActivityBarVisiblePosition(): ActivityBarPosition {
		const activityBarPosition = this.storageService.get(LayoutSettings.ACTIVITY_BAR_LOCATION, StorageScope.PROFILE);
		switch (activityBarPosition) {
			case ActivityBarPosition.TOP: return ActivityBarPosition.TOP;
			case ActivityBarPosition.BOTTOM: return ActivityBarPosition.BOTTOM;
			default: return ActivityBarPosition.DEFAULT;
		}
	}

	override getPinnedPaneCompositeIds(): string[] {
		return this.shouldShowCompositeBar() ? super.getPinnedPaneCompositeIds() : this.activityBarPart.getPinnedPaneCompositeIds();
	}

	override getVisiblePaneCompositeIds(): string[] {
		return this.shouldShowCompositeBar() ? super.getVisiblePaneCompositeIds() : this.activityBarPart.getVisiblePaneCompositeIds();
	}

	override getPaneCompositeIds(): string[] {
		return this.shouldShowCompositeBar() ? super.getPaneCompositeIds() : this.activityBarPart.getPaneCompositeIds();
	}

	async focusActivityBar(): Promise<void> {
		if (this.configurationService.getValue(LayoutSettings.ACTIVITY_BAR_LOCATION) === ActivityBarPosition.HIDDEN) {
			await this.configurationService.updateValue(LayoutSettings.ACTIVITY_BAR_LOCATION, this.getRememberedActivityBarVisiblePosition());

			this.onDidChangeActivityBarLocation();
		}

		if (this.shouldShowCompositeBar()) {
			this.focusCompositeBar();
		} else {
			if (!this.layoutService.isVisible(Parts.ACTIVITYBAR_PART)) {
				this.layoutService.setPartHidden(false, Parts.ACTIVITYBAR_PART);
			}

			this.activityBarPart.show(true);
		}
	}

	private registerActions(): void {
		const that = this;
		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: ToggleActivityBarVisibilityActionId,
					title: localize2('toggleActivityBar', "Toggle Activity Bar Visibility"),
				});
			}
			run(): Promise<void> {
				const value = that.configurationService.getValue(LayoutSettings.ACTIVITY_BAR_LOCATION) === ActivityBarPosition.HIDDEN ? that.getRememberedActivityBarVisiblePosition() : ActivityBarPosition.HIDDEN;
				return that.configurationService.updateValue(LayoutSettings.ACTIVITY_BAR_LOCATION, value);
			}
		}));
	}

	toJSON(): object {
		return {
			type: Parts.SIDEBAR_PART
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/sidebar/media/sidebarpart.css]---
Location: vscode-main/src/vs/workbench/browser/parts/sidebar/media/sidebarpart.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-workbench.nosidebar > .part.sidebar {
	display: none !important;
	visibility: hidden !important;
}

.monaco-workbench .part.sidebar .title-actions .actions-container {
	justify-content: flex-end;
}

.monaco-workbench .part.sidebar .title-actions .action-item {
	margin-right: 4px;
}

.monaco-workbench .part.sidebar > .title {
	background-color: var(--vscode-sideBarTitle-background);
}

.monaco-workbench .part.sidebar > .title > .title-label h2 {
	text-transform: uppercase;
}

.monaco-workbench .viewlet .collapsible.header .title {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.monaco-workbench .viewlet .collapsible.header .actions {
	width: 0; /* not using display: none for keyboard a11y reasons */
}

.monaco-workbench .viewlet .split-view-view:hover > .header .actions,
.monaco-workbench .viewlet .collapsible.header.focused .actions {
	width: initial;
	flex: 1;
}

.monaco-workbench .viewlet .collapsible.header .actions .action-label {
	width: 28px;
	background-size: 16px;
	background-position: center center;
	background-repeat: no-repeat;
	margin-right: 0;
	height: 22px;
}

.monaco-workbench .viewlet .collapsible.header .actions .action-label .label {
	display: none;
}

.monaco-workbench .viewlet .collapsible.header.collapsed .actions {
	display: none;
}

.monaco-workbench .viewlet .collapsible.header .action-label {
	margin-right: 0.2em;
	background-repeat: no-repeat;
	width: 16px;
	height: 16px;
}

.monaco-workbench .part.sidebar > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item:focus,
.monaco-workbench .part.sidebar > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item:focus {
	outline: 0 !important; /* activity bar indicates focus custom */
}

.monaco-workbench .part.sidebar > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item .action-label,
.monaco-workbench .part.sidebar > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item .action-label {
	outline-offset: 2px;
}

.hc-black .monaco-workbench .part.sidebar > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item .action-label,
.hc-black .monaco-workbench .part.sidebar > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item .action-label,
.hc-light .monaco-workbench .part.sidebar > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item .action-label,
.hc-light .monaco-workbench .part.sidebar > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item .action-label {
	border-radius: 0px;
}

.monaco-workbench .part.sidebar > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item .action-label::before,
.monaco-workbench .part.sidebar > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item .action-label::before {
	position: absolute;
	left: 5px; /* place icon in center */
}

.monaco-workbench .part.sidebar > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item.checked:not(:focus) .active-item-indicator:before,
.monaco-workbench .part.sidebar > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item.checked.clicked:focus .active-item-indicator:before,
.monaco-workbench .part.sidebar > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item.checked:not(:focus) .active-item-indicator:before,
.monaco-workbench .part.sidebar > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item.checked.clicked:focus .active-item-indicator:before {
	border-top-color: var(--vscode-activityBarTop-activeBorder) !important;
}

.monaco-workbench .part.sidebar > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item:hover .action-label,
.monaco-workbench .part.sidebar > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item:focus .action-label,
.monaco-workbench .part.sidebar > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item:hover .action-label,
.monaco-workbench .part.sidebar > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item:focus .action-label {
	color: var(--vscode-activityBarTop-foreground) !important;
}

.monaco-workbench .part.sidebar > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item:hover .action-label.uri-icon,
.monaco-workbench .part.sidebar > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item:focus .action-label.uri-icon,
.monaco-workbench .part.sidebar > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item:hover .action-label.uri-icon,
.monaco-workbench .part.sidebar > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item:focus .action-label.uri-icon {
	background-color: var(--vscode-activityBarTop-foreground) !important;
}

.monaco-workbench .sidebar.pane-composite-part > .title > .composite-bar-container {
	flex: 1;
}

.monaco-workbench .sidebar.part.pane-composite-part > .composite.title.has-composite-bar > .title-actions {
	flex: inherit;
}

.monaco-workbench .sidebar.pane-composite-part > .title.has-composite-bar > .title-actions .monaco-action-bar .action-item {
	max-width: 150px;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/statusbar/statusbarActions.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/statusbar/statusbarActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize, localize2 } from '../../../../nls.js';
import { IStatusbarService } from '../../../services/statusbar/browser/statusbar.js';
import { Action } from '../../../../base/common/actions.js';
import { Parts, IWorkbenchLayoutService } from '../../../services/layout/browser/layoutService.js';
import { KeyCode } from '../../../../base/common/keyCodes.js';
import { KeybindingsRegistry, KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ServicesAccessor } from '../../../../editor/browser/editorExtensions.js';
import { Action2, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { StatusbarViewModel } from './statusbarModel.js';
import { StatusBarFocused } from '../../../common/contextkeys.js';
import { getActiveWindow } from '../../../../base/browser/dom.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';

export class ToggleStatusbarEntryVisibilityAction extends Action {

	constructor(id: string, label: string, private model: StatusbarViewModel) {
		super(id, label, undefined, true);

		this.checked = !model.isHidden(id);
	}

	override async run(): Promise<void> {
		if (this.model.isHidden(this.id)) {
			this.model.show(this.id);
		} else {
			this.model.hide(this.id);
		}
	}
}

export class HideStatusbarEntryAction extends Action {

	constructor(id: string, name: string, private model: StatusbarViewModel) {
		super(id, localize('hide', "Hide '{0}'", name), undefined, true);
	}

	override async run(): Promise<void> {
		this.model.hide(this.id);
	}
}

export class ManageExtensionAction extends Action {

	constructor(
		private readonly extensionId: string,
		@ICommandService private readonly commandService: ICommandService
	) {
		super('statusbar.manage.extension', localize('manageExtension', "Manage Extension"));
	}

	override run(): Promise<void> {
		return this.commandService.executeCommand('_extensions.manage', this.extensionId);
	}
}

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'workbench.statusBar.focusPrevious',
	weight: KeybindingWeight.WorkbenchContrib,
	primary: KeyCode.LeftArrow,
	secondary: [KeyCode.UpArrow],
	when: StatusBarFocused,
	handler: (accessor: ServicesAccessor) => {
		const statusBarService = accessor.get(IStatusbarService);
		statusBarService.focusPreviousEntry();
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'workbench.statusBar.focusNext',
	weight: KeybindingWeight.WorkbenchContrib,
	primary: KeyCode.RightArrow,
	secondary: [KeyCode.DownArrow],
	when: StatusBarFocused,
	handler: (accessor: ServicesAccessor) => {
		const statusBarService = accessor.get(IStatusbarService);
		statusBarService.focusNextEntry();
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'workbench.statusBar.focusFirst',
	weight: KeybindingWeight.WorkbenchContrib,
	primary: KeyCode.Home,
	when: StatusBarFocused,
	handler: (accessor: ServicesAccessor) => {
		const statusBarService = accessor.get(IStatusbarService);
		statusBarService.focus(false);
		statusBarService.focusNextEntry();
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'workbench.statusBar.focusLast',
	weight: KeybindingWeight.WorkbenchContrib,
	primary: KeyCode.End,
	when: StatusBarFocused,
	handler: (accessor: ServicesAccessor) => {
		const statusBarService = accessor.get(IStatusbarService);
		statusBarService.focus(false);
		statusBarService.focusPreviousEntry();
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'workbench.statusBar.clearFocus',
	weight: KeybindingWeight.WorkbenchContrib,
	primary: KeyCode.Escape,
	when: StatusBarFocused,
	handler: (accessor: ServicesAccessor) => {
		const statusBarService = accessor.get(IStatusbarService);
		const editorService = accessor.get(IEditorService);
		if (statusBarService.isEntryFocused()) {
			statusBarService.focus(false);
		} else if (editorService.activeEditorPane) {
			editorService.activeEditorPane.focus();
		}
	}
});

class FocusStatusBarAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.focusStatusBar',
			title: localize2('focusStatusBar', 'Focus Status Bar'),
			category: Categories.View,
			f1: true
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const layoutService = accessor.get(IWorkbenchLayoutService);
		layoutService.focusPart(Parts.STATUSBAR_PART, getActiveWindow());
	}
}

registerAction2(FocusStatusBarAction);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/statusbar/statusbarItem.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/statusbar/statusbarItem.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { toErrorMessage } from '../../../../base/common/errorMessage.js';
import { Disposable, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { SimpleIconLabel } from '../../../../base/browser/ui/iconLabel/simpleIconLabel.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IStatusbarEntry, isTooltipWithCommands, ShowTooltipCommand, StatusbarEntryKinds, TooltipContent } from '../../../services/statusbar/browser/statusbar.js';
import { WorkbenchActionExecutedEvent, WorkbenchActionExecutedClassification } from '../../../../base/common/actions.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { ThemeColor } from '../../../../base/common/themables.js';
import { isThemeColor } from '../../../../editor/common/editorCommon.js';
import { addDisposableListener, EventType, hide, show, append, EventHelper, $ } from '../../../../base/browser/dom.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { assertReturnsDefined } from '../../../../base/common/types.js';
import { Command } from '../../../../editor/common/languages.js';
import { StandardKeyboardEvent } from '../../../../base/browser/keyboardEvent.js';
import { KeyCode } from '../../../../base/common/keyCodes.js';
import { renderIcon, renderLabelWithIcons } from '../../../../base/browser/ui/iconLabel/iconLabels.js';
import { spinningLoading, syncing } from '../../../../platform/theme/common/iconRegistry.js';
import { isMarkdownString, markdownStringEqual } from '../../../../base/common/htmlContent.js';
import { IHoverDelegate } from '../../../../base/browser/ui/hover/hoverDelegate.js';
import { Gesture, EventType as TouchEventType } from '../../../../base/browser/touch.js';
import { IManagedHover, IManagedHoverOptions } from '../../../../base/browser/ui/hover/hover.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';

export class StatusbarEntryItem extends Disposable {

	private readonly label: StatusBarCodiconLabel;

	private entry: IStatusbarEntry | undefined = undefined;

	private readonly foregroundListener = this._register(new MutableDisposable());
	private readonly backgroundListener = this._register(new MutableDisposable());

	private readonly commandMouseListener = this._register(new MutableDisposable());
	private readonly commandTouchListener = this._register(new MutableDisposable());
	private readonly commandKeyboardListener = this._register(new MutableDisposable());

	private hover: IManagedHover | undefined = undefined;

	readonly labelContainer: HTMLElement;
	readonly beakContainer: HTMLElement;

	get name(): string {
		return assertReturnsDefined(this.entry).name;
	}

	get hasCommand(): boolean {
		return typeof this.entry?.command !== 'undefined';
	}

	constructor(
		private container: HTMLElement,
		entry: IStatusbarEntry,
		private readonly hoverDelegate: IHoverDelegate,
		@ICommandService private readonly commandService: ICommandService,
		@IHoverService private readonly hoverService: IHoverService,
		@INotificationService private readonly notificationService: INotificationService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IThemeService private readonly themeService: IThemeService
	) {
		super();

		// Label Container
		this.labelContainer = $('a.statusbar-item-label', {
			role: 'button',
			tabIndex: -1 // allows screen readers to read title, but still prevents tab focus.
		});
		this._register(Gesture.addTarget(this.labelContainer)); // enable touch

		// Label (with support for progress)
		this.label = this._register(new StatusBarCodiconLabel(this.labelContainer));
		this.container.appendChild(this.labelContainer);

		// Beak Container
		this.beakContainer = $('.status-bar-item-beak-container');
		this.container.appendChild(this.beakContainer);

		if (entry.content) {
			this.container.appendChild(entry.content);
		}

		this.update(entry);
	}

	update(entry: IStatusbarEntry): void {

		// Update: Progress
		this.label.showProgress = entry.showProgress ?? false;

		// Update: Text
		if (!this.entry || entry.text !== this.entry.text) {
			this.label.text = entry.text;

			if (entry.text) {
				show(this.labelContainer);
			} else {
				hide(this.labelContainer);
			}
		}

		// Update: ARIA label
		//
		// Set the aria label on both elements so screen readers would read
		// the correct thing without duplication #96210

		if (!this.entry || entry.ariaLabel !== this.entry.ariaLabel) {
			this.container.setAttribute('aria-label', entry.ariaLabel);
			this.labelContainer.setAttribute('aria-label', entry.ariaLabel);
		}

		if (!this.entry || entry.role !== this.entry.role) {
			this.labelContainer.setAttribute('role', entry.role || 'button');
		}

		// Update: Hover
		if (!this.entry || !this.isEqualTooltip(this.entry, entry)) {
			let hoverOptions: IManagedHoverOptions | undefined;
			let hoverTooltip: TooltipContent | undefined;
			if (isTooltipWithCommands(entry.tooltip)) {
				hoverTooltip = entry.tooltip.content;
				hoverOptions = {
					actions: entry.tooltip.commands.map(command => ({
						commandId: command.id,
						label: command.title,
						run: () => this.executeCommand(command)
					}))
				};
			} else {
				hoverTooltip = entry.tooltip;
			}

			const hoverContents = isMarkdownString(hoverTooltip) ? { markdown: hoverTooltip, markdownNotSupportedFallback: undefined } : hoverTooltip;
			if (this.hover) {
				this.hover.update(hoverContents, hoverOptions);
			} else {
				this.hover = this._register(this.hoverService.setupManagedHover(this.hoverDelegate, this.container, hoverContents, hoverOptions));
			}
		}

		// Update: Command
		if (!this.entry || entry.command !== this.entry.command) {
			this.commandMouseListener.clear();
			this.commandTouchListener.clear();
			this.commandKeyboardListener.clear();

			const command = entry.command;
			if (command && (command !== ShowTooltipCommand || this.hover) /* "Show Hover" is only valid when we have a hover */) {
				this.commandMouseListener.value = addDisposableListener(this.labelContainer, EventType.CLICK, () => this.executeCommand(command));
				this.commandTouchListener.value = addDisposableListener(this.labelContainer, TouchEventType.Tap, () => this.executeCommand(command));
				this.commandKeyboardListener.value = addDisposableListener(this.labelContainer, EventType.KEY_DOWN, e => {
					const event = new StandardKeyboardEvent(e);
					if (event.equals(KeyCode.Space) || event.equals(KeyCode.Enter)) {
						EventHelper.stop(e);

						this.executeCommand(command);
					} else if (event.equals(KeyCode.Escape) || event.equals(KeyCode.LeftArrow) || event.equals(KeyCode.RightArrow)) {
						EventHelper.stop(e);

						this.hover?.hide();
					}
				});

				this.labelContainer.classList.remove('disabled');
			} else {
				this.labelContainer.classList.add('disabled');
			}
		}

		// Update: Beak
		if (!this.entry || entry.showBeak !== this.entry.showBeak) {
			if (entry.showBeak) {
				this.container.classList.add('has-beak');
			} else {
				this.container.classList.remove('has-beak');
			}
		}

		const hasBackgroundColor = !!entry.backgroundColor || (entry.kind && entry.kind !== 'standard');

		// Update: Kind
		if (!this.entry || entry.kind !== this.entry.kind) {
			for (const kind of StatusbarEntryKinds) {
				this.container.classList.remove(`${kind}-kind`);
			}

			if (entry.kind && entry.kind !== 'standard') {
				this.container.classList.add(`${entry.kind}-kind`);
			}

			this.container.classList.toggle('has-background-color', hasBackgroundColor);
		}

		// Update: Foreground
		if (!this.entry || entry.color !== this.entry.color) {
			this.applyColor(this.labelContainer, entry.color);
		}

		// Update: Background
		if (!this.entry || entry.backgroundColor !== this.entry.backgroundColor) {
			this.container.classList.toggle('has-background-color', hasBackgroundColor);
			this.applyColor(this.container, entry.backgroundColor, true);
		}

		// Remember for next round
		this.entry = entry;
	}

	private isEqualTooltip({ tooltip }: IStatusbarEntry, { tooltip: otherTooltip }: IStatusbarEntry) {
		if (tooltip === undefined) {
			return otherTooltip === undefined;
		}

		if (isMarkdownString(tooltip)) {
			return isMarkdownString(otherTooltip) && markdownStringEqual(tooltip, otherTooltip);
		}

		return tooltip === otherTooltip;
	}

	private async executeCommand(command: string | Command): Promise<void> {

		// Custom command from us: Show tooltip
		if (command === ShowTooltipCommand) {
			this.hover?.show(true /* focus */);
		}

		// Any other command is going through command service
		else {
			const id = typeof command === 'string' ? command : command.id;
			const args = typeof command === 'string' ? [] : command.arguments ?? [];

			this.telemetryService.publicLog2<WorkbenchActionExecutedEvent, WorkbenchActionExecutedClassification>('workbenchActionExecuted', { id, from: 'status bar' });
			try {
				await this.commandService.executeCommand(id, ...args);
			} catch (error) {
				this.notificationService.error(toErrorMessage(error));
			}
		}
	}

	private applyColor(container: HTMLElement, color: string | ThemeColor | undefined, isBackground?: boolean): void {
		let colorResult: string | undefined = undefined;

		if (isBackground) {
			this.backgroundListener.clear();
		} else {
			this.foregroundListener.clear();
		}

		if (color) {
			if (isThemeColor(color)) {
				colorResult = this.themeService.getColorTheme().getColor(color.id)?.toString();

				const listener = this.themeService.onDidColorThemeChange(theme => {
					const colorValue = theme.getColor(color.id)?.toString();

					if (isBackground) {
						container.style.backgroundColor = colorValue ?? '';
					} else {
						container.style.color = colorValue ?? '';
					}
				});

				if (isBackground) {
					this.backgroundListener.value = listener;
				} else {
					this.foregroundListener.value = listener;
				}
			} else {
				colorResult = color;
			}
		}

		if (isBackground) {
			container.style.backgroundColor = colorResult ?? '';
		} else {
			container.style.color = colorResult ?? '';
		}
	}
}

class StatusBarCodiconLabel extends SimpleIconLabel {

	private progressCodicon = renderIcon(syncing);

	private currentText = '';
	private currentShowProgress: boolean | 'loading' | 'syncing' = false;

	constructor(
		private readonly container: HTMLElement
	) {
		super(container);
	}

	set showProgress(showProgress: boolean | 'loading' | 'syncing') {
		if (this.currentShowProgress !== showProgress) {
			this.currentShowProgress = showProgress;
			this.progressCodicon = renderIcon(showProgress === 'syncing' ? syncing : spinningLoading);
			this.text = this.currentText;
		}
	}

	override set text(text: string) {

		// Progress: insert progress codicon as first element as needed
		// but keep it stable so that the animation does not reset
		if (this.currentShowProgress) {

			// Append as needed
			if (this.container.firstChild !== this.progressCodicon) {
				this.container.appendChild(this.progressCodicon);
			}

			// Remove others
			for (const node of Array.from(this.container.childNodes)) {
				if (node !== this.progressCodicon) {
					node.remove();
				}
			}

			// If we have text to show, add a space to separate from progress
			let textContent = text ?? '';
			if (textContent) {
				textContent = `\u00A0${textContent}`; // prepend non-breaking space
			}

			// Append new elements
			append(this.container, ...renderLabelWithIcons(textContent));
		}

		// No Progress: no special handling
		else {
			super.text = text;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/statusbar/statusbarModel.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/statusbar/statusbarModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { isStatusbarEntryLocation, IStatusbarEntryPriority, StatusbarAlignment } from '../../../services/statusbar/browser/statusbar.js';
import { hide, show, isAncestorOfActiveElement } from '../../../../base/browser/dom.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { Emitter } from '../../../../base/common/event.js';

export interface IStatusbarViewModelEntry {
	readonly id: string;
	readonly extensionId: string | undefined;
	readonly name: string;
	readonly hasCommand: boolean;
	readonly alignment: StatusbarAlignment;
	readonly priority: IStatusbarEntryPriority;
	readonly container: HTMLElement;
	readonly labelContainer: HTMLElement;
}

export class StatusbarViewModel extends Disposable {

	private static readonly HIDDEN_ENTRIES_KEY = 'workbench.statusbar.hidden';

	private readonly _onDidChangeEntryVisibility = this._register(new Emitter<{ id: string; visible: boolean }>());
	readonly onDidChangeEntryVisibility = this._onDidChangeEntryVisibility.event;

	private _entries: IStatusbarViewModelEntry[] = []; // Intentionally not using a map here since multiple entries can have the same ID
	get entries(): IStatusbarViewModelEntry[] { return this._entries.slice(0); }

	private _lastFocusedEntry: IStatusbarViewModelEntry | undefined;
	get lastFocusedEntry(): IStatusbarViewModelEntry | undefined {
		return this._lastFocusedEntry && !this.isHidden(this._lastFocusedEntry.id) ? this._lastFocusedEntry : undefined;
	}

	private hidden = new Set<string>();

	constructor(private readonly storageService: IStorageService) {
		super();

		this.restoreState();
		this.registerListeners();
	}

	private restoreState(): void {
		const hiddenRaw = this.storageService.get(StatusbarViewModel.HIDDEN_ENTRIES_KEY, StorageScope.PROFILE);
		if (hiddenRaw) {
			try {
				this.hidden = new Set(JSON.parse(hiddenRaw));
			} catch (error) {
				// ignore parsing errors
			}
		}
	}

	private registerListeners(): void {
		this._register(this.storageService.onDidChangeValue(StorageScope.PROFILE, StatusbarViewModel.HIDDEN_ENTRIES_KEY, this._store)(() => this.onDidStorageValueChange()));
	}

	private onDidStorageValueChange(): void {

		// Keep current hidden entries
		const currentlyHidden = new Set(this.hidden);

		// Load latest state of hidden entries
		this.hidden.clear();
		this.restoreState();

		const changed = new Set<string>();

		// Check for each entry that is now visible
		for (const id of currentlyHidden) {
			if (!this.hidden.has(id)) {
				changed.add(id);
			}
		}

		// Check for each entry that is now hidden
		for (const id of this.hidden) {
			if (!currentlyHidden.has(id)) {
				changed.add(id);
			}
		}

		// Update visibility for entries have changed
		if (changed.size > 0) {
			for (const entry of this._entries) {
				if (changed.has(entry.id)) {
					this.updateVisibility(entry.id, true);

					changed.delete(entry.id);
				}
			}
		}
	}

	add(entry: IStatusbarViewModelEntry): void {

		// Add to set of entries
		this._entries.push(entry);

		// Update visibility directly
		this.updateVisibility(entry, false);

		// Sort according to priority
		this.sort();

		// Mark first/last visible entry
		this.markFirstLastVisibleEntry();
	}

	remove(entry: IStatusbarViewModelEntry): void {
		const index = this._entries.indexOf(entry);
		if (index >= 0) {

			// Remove from entries
			this._entries.splice(index, 1);

			// Re-sort entries if this one was used
			// as reference from other entries
			if (this._entries.some(otherEntry => isStatusbarEntryLocation(otherEntry.priority.primary) && otherEntry.priority.primary.location.id === entry.id)) {
				this.sort();
			}

			// Mark first/last visible entry
			this.markFirstLastVisibleEntry();
		}
	}

	isHidden(id: string): boolean {
		return this.hidden.has(id);
	}

	hide(id: string): void {
		if (!this.hidden.has(id)) {
			this.hidden.add(id);

			this.updateVisibility(id, true);

			this.saveState();
		}
	}

	show(id: string): void {
		if (this.hidden.delete(id)) {
			this.updateVisibility(id, true);

			this.saveState();
		}
	}

	findEntry(container: HTMLElement): IStatusbarViewModelEntry | undefined {
		return this._entries.find(entry => entry.container === container);
	}

	getEntries(alignment: StatusbarAlignment): IStatusbarViewModelEntry[] {
		return this._entries.filter(entry => entry.alignment === alignment);
	}

	focusNextEntry(): void {
		this.focusEntry(+1, 0);
	}

	focusPreviousEntry(): void {
		this.focusEntry(-1, this.entries.length - 1);
	}

	isEntryFocused(): boolean {
		return !!this.getFocusedEntry();
	}

	private getFocusedEntry(): IStatusbarViewModelEntry | undefined {
		return this._entries.find(entry => isAncestorOfActiveElement(entry.container));
	}

	private focusEntry(delta: number, restartPosition: number): void {

		const getVisibleEntry = (start: number) => {
			let indexToFocus = start;
			let entry = (indexToFocus >= 0 && indexToFocus < this._entries.length) ? this._entries[indexToFocus] : undefined;
			while (entry && this.isHidden(entry.id)) {
				indexToFocus += delta;
				entry = (indexToFocus >= 0 && indexToFocus < this._entries.length) ? this._entries[indexToFocus] : undefined;
			}

			return entry;
		};

		const focused = this.getFocusedEntry();
		if (focused) {
			const entry = getVisibleEntry(this._entries.indexOf(focused) + delta);
			if (entry) {
				this._lastFocusedEntry = entry;

				entry.labelContainer.focus();

				return;
			}
		}

		const entry = getVisibleEntry(restartPosition);
		if (entry) {
			this._lastFocusedEntry = entry;
			entry.labelContainer.focus();
		}
	}

	private updateVisibility(id: string, trigger: boolean): void;
	private updateVisibility(entry: IStatusbarViewModelEntry, trigger: boolean): void;
	private updateVisibility(arg1: string | IStatusbarViewModelEntry, trigger: boolean): void {

		// By identifier
		if (typeof arg1 === 'string') {
			const id = arg1;

			for (const entry of this._entries) {
				if (entry.id === id) {
					this.updateVisibility(entry, trigger);
				}
			}
		}

		// By entry
		else {
			const entry = arg1;
			const isHidden = this.isHidden(entry.id);

			// Use CSS to show/hide item container
			if (isHidden) {
				hide(entry.container);
			} else {
				show(entry.container);
			}

			if (trigger) {
				this._onDidChangeEntryVisibility.fire({ id: entry.id, visible: !isHidden });
			}

			// Mark first/last visible entry
			this.markFirstLastVisibleEntry();
		}
	}

	private saveState(): void {
		if (this.hidden.size > 0) {
			this.storageService.store(StatusbarViewModel.HIDDEN_ENTRIES_KEY, JSON.stringify(Array.from(this.hidden.values())), StorageScope.PROFILE, StorageTarget.USER);
		} else {
			this.storageService.remove(StatusbarViewModel.HIDDEN_ENTRIES_KEY, StorageScope.PROFILE);
		}
	}

	private sort(): void {
		const allEntryIds = new Set(this._entries.map(entry => entry.id));

		// Split up entries into 2 buckets:
		// - those with priority as number that can be compared or with a missing relative entry
		// - those with a relative priority that must be sorted relative to another entry that exists
		const mapEntryWithNumberedPriorityToIndex = new Map<IStatusbarViewModelEntry, number /* priority of entry as number */>();
		const mapEntryWithRelativePriority = new Map<string /* id of entry to position after */, Map<string, IStatusbarViewModelEntry>>();
		for (let i = 0; i < this._entries.length; i++) {
			const entry = this._entries[i];
			if (typeof entry.priority.primary === 'number' || !allEntryIds.has(entry.priority.primary.location.id)) {
				mapEntryWithNumberedPriorityToIndex.set(entry, i);
			} else {
				const referenceEntryId = entry.priority.primary.location.id;
				let entries = mapEntryWithRelativePriority.get(referenceEntryId);
				if (!entries) {

					// It is possible that this entry references another entry
					// that itself references an entry. In that case, we want
					// to add it to the entries of the referenced entry.

					for (const relativeEntries of mapEntryWithRelativePriority.values()) {
						if (relativeEntries.has(referenceEntryId)) {
							entries = relativeEntries;
							break;
						}
					}

					if (!entries) {
						entries = new Map();
						mapEntryWithRelativePriority.set(referenceEntryId, entries);
					}
				}
				entries.set(entry.id, entry);
			}
		}

		// Sort the entries with `priority: number` or referencing a missing entry accordingly
		const sortedEntriesWithNumberedPriority = Array.from(mapEntryWithNumberedPriorityToIndex.keys());
		sortedEntriesWithNumberedPriority.sort((entryA, entryB) => {
			if (entryA.alignment === entryB.alignment) {

				// Sort by primary/secondary priority: higher values move towards the left

				const entryAPrimaryPriority = typeof entryA.priority.primary === 'number' ? entryA.priority.primary : entryA.priority.primary.location.priority;
				const entryBPrimaryPriority = typeof entryB.priority.primary === 'number' ? entryB.priority.primary : entryB.priority.primary.location.priority;

				if (entryAPrimaryPriority !== entryBPrimaryPriority) {
					return entryBPrimaryPriority - entryAPrimaryPriority;
				}

				if (entryA.priority.secondary !== entryB.priority.secondary) {
					return entryB.priority.secondary - entryA.priority.secondary;
				}

				// otherwise maintain stable order (both values known to be in map)
				return mapEntryWithNumberedPriorityToIndex.get(entryA)! - mapEntryWithNumberedPriorityToIndex.get(entryB)!;
			}

			if (entryA.alignment === StatusbarAlignment.LEFT) {
				return -1;
			}

			if (entryB.alignment === StatusbarAlignment.LEFT) {
				return 1;
			}

			return 0;
		});

		let sortedEntries: IStatusbarViewModelEntry[];

		// Entries with location: sort in accordingly
		if (mapEntryWithRelativePriority.size > 0) {
			sortedEntries = [];

			for (const entry of sortedEntriesWithNumberedPriority) {
				const relativeEntriesMap = mapEntryWithRelativePriority.get(entry.id);
				const relativeEntries = relativeEntriesMap ? Array.from(relativeEntriesMap.values()) : undefined;

				// Fill relative entries to LEFT
				if (relativeEntries) {
					sortedEntries.push(...relativeEntries
						.filter(entry => isStatusbarEntryLocation(entry.priority.primary) && entry.priority.primary.alignment === StatusbarAlignment.LEFT)
						.sort((entryA, entryB) => entryB.priority.secondary - entryA.priority.secondary));
				}

				// Fill referenced entry
				sortedEntries.push(entry);

				// Fill relative entries to RIGHT
				if (relativeEntries) {
					sortedEntries.push(...relativeEntries
						.filter(entry => isStatusbarEntryLocation(entry.priority.primary) && entry.priority.primary.alignment === StatusbarAlignment.RIGHT)
						.sort((entryA, entryB) => entryB.priority.secondary - entryA.priority.secondary));
				}

				// Delete from map to mark as handled
				mapEntryWithRelativePriority.delete(entry.id);
			}

			// Finally, just append all entries that reference another entry
			// that does not exist to the end of the list
			//
			// Note: this should really not happen because of our check in
			// `allEntryIds`, but we play it safe here to really consume
			// all entries.
			//
			for (const [, entries] of mapEntryWithRelativePriority) {
				sortedEntries.push(...Array.from(entries.values()).sort((entryA, entryB) => entryB.priority.secondary - entryA.priority.secondary));
			}
		}

		// No entries with relative priority: take sorted entries as is
		else {
			sortedEntries = sortedEntriesWithNumberedPriority;
		}

		// Take over as new truth of entries
		this._entries = sortedEntries;
	}

	private markFirstLastVisibleEntry(): void {
		this.doMarkFirstLastVisibleStatusbarItem(this.getEntries(StatusbarAlignment.LEFT));
		this.doMarkFirstLastVisibleStatusbarItem(this.getEntries(StatusbarAlignment.RIGHT));
	}

	private doMarkFirstLastVisibleStatusbarItem(entries: IStatusbarViewModelEntry[]): void {
		let firstVisibleItem: IStatusbarViewModelEntry | undefined;
		let lastVisibleItem: IStatusbarViewModelEntry | undefined;

		for (const entry of entries) {

			// Clear previous first
			entry.container.classList.remove('first-visible-item', 'last-visible-item');

			const isVisible = !this.isHidden(entry.id);
			if (isVisible) {
				if (!firstVisibleItem) {
					firstVisibleItem = entry;
				}

				lastVisibleItem = entry;
			}
		}

		// Mark: first visible item
		firstVisibleItem?.container.classList.add('first-visible-item');

		// Mark: last visible item
		lastVisibleItem?.container.classList.add('last-visible-item');
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/statusbar/statusbarPart.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/statusbar/statusbarPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/statusbarpart.css';
import { localize } from '../../../../nls.js';
import { Disposable, DisposableStore, disposeIfDisposable, IDisposable, MutableDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { MultiWindowParts, Part } from '../../part.js';
import { EventType as TouchEventType, Gesture, GestureEvent } from '../../../../base/browser/touch.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { StatusbarAlignment, IStatusbarService, IStatusbarEntry, IStatusbarEntryAccessor, IStatusbarStyleOverride, isStatusbarEntryLocation, IStatusbarEntryLocation, isStatusbarEntryPriority, IStatusbarEntryPriority } from '../../../services/statusbar/browser/statusbar.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IAction, Separator, toAction } from '../../../../base/common/actions.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { STATUS_BAR_BACKGROUND, STATUS_BAR_FOREGROUND, STATUS_BAR_NO_FOLDER_BACKGROUND, STATUS_BAR_ITEM_HOVER_BACKGROUND, STATUS_BAR_BORDER, STATUS_BAR_NO_FOLDER_FOREGROUND, STATUS_BAR_NO_FOLDER_BORDER, STATUS_BAR_ITEM_COMPACT_HOVER_BACKGROUND, STATUS_BAR_ITEM_FOCUS_BORDER, STATUS_BAR_FOCUS_BORDER } from '../../../common/theme.js';
import { IWorkspaceContextService, WorkbenchState } from '../../../../platform/workspace/common/workspace.js';
import { contrastBorder, activeContrastBorder } from '../../../../platform/theme/common/colorRegistry.js';
import { EventHelper, addDisposableListener, EventType, clearNode, getWindow, isHTMLElement, $ } from '../../../../base/browser/dom.js';
import { createStyleSheet } from '../../../../base/browser/domStylesheets.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { Parts, IWorkbenchLayoutService } from '../../../services/layout/browser/layoutService.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { equals } from '../../../../base/common/arrays.js';
import { StandardMouseEvent } from '../../../../base/browser/mouseEvent.js';
import { ToggleStatusbarVisibilityAction } from '../../actions/layoutActions.js';
import { assertReturnsDefined } from '../../../../base/common/types.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { isHighContrast } from '../../../../platform/theme/common/theme.js';
import { hash } from '../../../../base/common/hash.js';
import { WorkbenchHoverDelegate } from '../../../../platform/hover/browser/hover.js';
import { HideStatusbarEntryAction, ManageExtensionAction, ToggleStatusbarEntryVisibilityAction } from './statusbarActions.js';
import { IStatusbarViewModelEntry, StatusbarViewModel } from './statusbarModel.js';
import { StatusbarEntryItem } from './statusbarItem.js';
import { StatusBarFocused } from '../../../common/contextkeys.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { IView } from '../../../../base/browser/ui/grid/grid.js';
import { isManagedHoverTooltipHTMLElement, isManagedHoverTooltipMarkdownString } from '../../../../base/browser/ui/hover/hover.js';

export interface IStatusbarEntryContainer extends IDisposable {

	/**
	 * An event that is triggered when an entry's visibility is changed.
	 */
	readonly onDidChangeEntryVisibility: Event<{ id: string; visible: boolean }>;

	/**
	 * Adds an entry to the statusbar with the given alignment and priority. Use the returned accessor
	 * to update or remove the statusbar entry.
	 *
	 * @param id identifier of the entry is needed to allow users to hide entries via settings
	 * @param alignment either LEFT or RIGHT side in the status bar
	 * @param priority items get arranged from highest priority to lowest priority from left to right
	 * in their respective alignment slot
	 */
	addEntry(entry: IStatusbarEntry, id: string, alignment: StatusbarAlignment, priority?: number | IStatusbarEntryPriority): IStatusbarEntryAccessor;
	addEntry(entry: IStatusbarEntry, id: string, alignment: StatusbarAlignment, priority?: number | IStatusbarEntryPriority | IStatusbarEntryLocation): IStatusbarEntryAccessor;

	/**
	 * Adds an entry to the statusbar with the given alignment relative to another entry. Use the returned
	 * accessor to update or remove the statusbar entry.
	 *
	 * @param id identifier of the entry is needed to allow users to hide entries via settings
	 * @param alignment either LEFT or RIGHT side in the status bar
	 * @param location a reference to another entry to position relative to
	 */
	addEntry(entry: IStatusbarEntry, id: string, alignment: StatusbarAlignment, location?: IStatusbarEntryLocation): IStatusbarEntryAccessor;

	/**
	 * Return if an entry is visible or not.
	 */
	isEntryVisible(id: string): boolean;

	/**
	 * Allows to update an entry's visibility with the provided ID.
	 */
	updateEntryVisibility(id: string, visible: boolean): void;

	/**
	 * Allows to override the appearance of an entry with the provided ID.
	 */
	overrideEntry(id: string, override: Partial<IStatusbarEntry>): IDisposable;

	/**
	 * Focused the status bar. If one of the status bar entries was focused, focuses it directly.
	 */
	focus(preserveEntryFocus?: boolean): void;

	/**
	 * Focuses the next status bar entry. If none focused, focuses the first.
	 */
	focusNextEntry(): void;

	/**
	 * Focuses the previous status bar entry. If none focused, focuses the last.
	 */
	focusPreviousEntry(): void;

	/**
	 *	Returns true if a status bar entry is focused.
	 */
	isEntryFocused(): boolean;

	/**
	 * Temporarily override statusbar style.
	 */
	overrideStyle(style: IStatusbarStyleOverride): IDisposable;
}

interface IPendingStatusbarEntry {
	readonly id: string;
	readonly alignment: StatusbarAlignment;
	readonly priority: IStatusbarEntryPriority;

	entry: IStatusbarEntry;
	accessor?: IStatusbarEntryAccessor;
}

class StatusbarPart extends Part implements IStatusbarEntryContainer {

	static readonly HEIGHT = 22;

	//#region IView

	readonly minimumWidth: number = 0;
	readonly maximumWidth: number = Number.POSITIVE_INFINITY;
	readonly minimumHeight: number = StatusbarPart.HEIGHT;
	readonly maximumHeight: number = StatusbarPart.HEIGHT;

	//#endregion

	private styleElement: HTMLStyleElement | undefined;

	private pendingEntries: IPendingStatusbarEntry[] = [];

	private readonly viewModel: StatusbarViewModel;

	readonly onDidChangeEntryVisibility: Event<{ id: string; visible: boolean }>;

	private readonly _onWillDispose = this._register(new Emitter<void>());
	readonly onWillDispose = this._onWillDispose.event;

	private readonly onDidOverrideEntry = this._register(new Emitter<string>());
	private readonly entryOverrides = new Map<string, Partial<IStatusbarEntry>>();

	private leftItemsContainer: HTMLElement | undefined;
	private rightItemsContainer: HTMLElement | undefined;

	private readonly hoverDelegate: WorkbenchHoverDelegate;

	private readonly compactEntriesDisposable = this._register(new MutableDisposable<DisposableStore>());
	private readonly styleOverrides = new Set<IStatusbarStyleOverride>();

	constructor(
		id: string,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IThemeService themeService: IThemeService,
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService,
		@IStorageService storageService: IStorageService,
		@IWorkbenchLayoutService layoutService: IWorkbenchLayoutService,
		@IContextMenuService private readonly contextMenuService: IContextMenuService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
	) {
		super(id, { hasTitle: false }, themeService, storageService, layoutService);

		this.viewModel = this._register(new StatusbarViewModel(storageService));
		this.onDidChangeEntryVisibility = this.viewModel.onDidChangeEntryVisibility;

		this.hoverDelegate = this._register(this.instantiationService.createInstance(WorkbenchHoverDelegate, 'element', {
			instantHover: true,
			dynamicDelay(content) {
				if (
					typeof content === 'function' ||
					isHTMLElement(content) ||
					(isManagedHoverTooltipMarkdownString(content) && typeof content.markdown === 'function') ||
					isManagedHoverTooltipHTMLElement(content)
				) {
					// override the delay for content that is rich (e.g. html or long running)
					// so that it appears more instantly. these hovers carry more important
					// information and should not be delayed by preference.
					return 500;
				}

				return undefined;
			}
		}, (_, focus?: boolean) => (
			{
				persistence: {
					hideOnKeyDown: true,
					sticky: focus
				},
				appearance: {
					maxHeightRatio: 0.9
				}
			}
		)));

		this.registerListeners();
	}

	private registerListeners(): void {

		// Entry visibility changes
		this._register(this.onDidChangeEntryVisibility(() => this.updateCompactEntries()));

		// Workbench state changes
		this._register(this.contextService.onDidChangeWorkbenchState(() => this.updateStyles()));
	}

	overrideEntry(id: string, override: Partial<IStatusbarEntry>): IDisposable {
		this.entryOverrides.set(id, override);
		this.onDidOverrideEntry.fire(id);

		return toDisposable(() => {
			const currentOverride = this.entryOverrides.get(id);
			if (currentOverride === override) {
				this.entryOverrides.delete(id);
				this.onDidOverrideEntry.fire(id);
			}
		});
	}

	private withEntryOverride(entry: IStatusbarEntry, id: string): IStatusbarEntry {
		const override = this.entryOverrides.get(id);
		if (override) {
			entry = { ...entry, ...override };
		}

		return entry;
	}

	addEntry(entry: IStatusbarEntry, id: string, alignment: StatusbarAlignment, priorityOrLocation: number | IStatusbarEntryLocation | IStatusbarEntryPriority = 0): IStatusbarEntryAccessor {
		let priority: IStatusbarEntryPriority;
		if (isStatusbarEntryPriority(priorityOrLocation)) {
			priority = priorityOrLocation;
		} else {
			priority = {
				primary: priorityOrLocation,
				secondary: hash(id) // derive from identifier to accomplish uniqueness
			};
		}

		// As long as we have not been created into a container yet, record all entries
		// that are pending so that they can get created at a later point
		if (!this.element) {
			return this.doAddPendingEntry(entry, id, alignment, priority);
		}

		// Otherwise add to view
		return this.doAddEntry(entry, id, alignment, priority);
	}

	private doAddPendingEntry(entry: IStatusbarEntry, id: string, alignment: StatusbarAlignment, priority: IStatusbarEntryPriority): IStatusbarEntryAccessor {
		const pendingEntry: IPendingStatusbarEntry = { entry, id, alignment, priority };
		this.pendingEntries.push(pendingEntry);

		const accessor: IStatusbarEntryAccessor = {
			update: (entry: IStatusbarEntry) => {
				if (pendingEntry.accessor) {
					pendingEntry.accessor.update(entry);
				} else {
					pendingEntry.entry = entry;
				}
			},

			dispose: () => {
				if (pendingEntry.accessor) {
					pendingEntry.accessor.dispose();
				} else {
					this.pendingEntries = this.pendingEntries.filter(entry => entry !== pendingEntry);
				}
			}
		};

		return accessor;
	}

	private doAddEntry(entry: IStatusbarEntry, id: string, alignment: StatusbarAlignment, priority: IStatusbarEntryPriority): IStatusbarEntryAccessor {
		const disposables = new DisposableStore();

		// View model item
		const itemContainer = this.doCreateStatusItem(id, alignment);
		const item = disposables.add(this.instantiationService.createInstance(StatusbarEntryItem, itemContainer, this.withEntryOverride(entry, id), this.hoverDelegate));

		// View model entry
		const viewModelEntry: IStatusbarViewModelEntry = new class implements IStatusbarViewModelEntry {
			readonly id = id;
			readonly extensionId = entry.extensionId;
			readonly alignment = alignment;
			readonly priority = priority;
			readonly container = itemContainer;
			readonly labelContainer = item.labelContainer;

			get name() { return item.name; }
			get hasCommand() { return item.hasCommand; }
		};

		// Add to view model
		const { needsFullRefresh } = this.doAddOrRemoveModelEntry(viewModelEntry, true);
		if (needsFullRefresh) {
			this.appendStatusbarEntries();
		} else {
			this.appendStatusbarEntry(viewModelEntry);
		}

		let lastEntry = entry;
		const accessor: IStatusbarEntryAccessor = {
			update: entry => {
				lastEntry = entry;
				item.update(this.withEntryOverride(entry, id));
			},
			dispose: () => {
				const { needsFullRefresh } = this.doAddOrRemoveModelEntry(viewModelEntry, false);
				if (needsFullRefresh) {
					this.appendStatusbarEntries();
				} else {
					itemContainer.remove();
					this.updateCompactEntries();
				}
				disposables.dispose();
			}
		};

		// React to overrides
		disposables.add(this.onDidOverrideEntry.event(overrideEntryId => {
			if (overrideEntryId === id) {
				accessor.update(lastEntry);
			}
		}));

		return accessor;
	}

	private doCreateStatusItem(id: string, alignment: StatusbarAlignment, ...extraClasses: string[]): HTMLElement {
		const itemContainer = $('.statusbar-item', { id });

		if (extraClasses) {
			itemContainer.classList.add(...extraClasses);
		}

		if (alignment === StatusbarAlignment.RIGHT) {
			itemContainer.classList.add('right');
		} else {
			itemContainer.classList.add('left');
		}

		return itemContainer;
	}

	private doAddOrRemoveModelEntry(entry: IStatusbarViewModelEntry, add: boolean) {

		// Update model but remember previous entries
		const entriesBefore = this.viewModel.entries;
		if (add) {
			this.viewModel.add(entry);
		} else {
			this.viewModel.remove(entry);
		}
		const entriesAfter = this.viewModel.entries;

		// Apply operation onto the entries from before
		if (add) {
			entriesBefore.splice(entriesAfter.indexOf(entry), 0, entry);
		} else {
			entriesBefore.splice(entriesBefore.indexOf(entry), 1);
		}

		// Figure out if a full refresh is needed by comparing arrays
		const needsFullRefresh = !equals(entriesBefore, entriesAfter);

		return { needsFullRefresh };
	}

	isEntryVisible(id: string): boolean {
		return !this.viewModel.isHidden(id);
	}

	updateEntryVisibility(id: string, visible: boolean): void {
		if (visible) {
			this.viewModel.show(id);
		} else {
			this.viewModel.hide(id);
		}
	}

	focusNextEntry(): void {
		this.viewModel.focusNextEntry();
	}

	focusPreviousEntry(): void {
		this.viewModel.focusPreviousEntry();
	}

	isEntryFocused(): boolean {
		return this.viewModel.isEntryFocused();
	}

	focus(preserveEntryFocus = true): void {
		this.getContainer()?.focus();
		const lastFocusedEntry = this.viewModel.lastFocusedEntry;
		if (preserveEntryFocus && lastFocusedEntry) {
			setTimeout(() => lastFocusedEntry.labelContainer.focus(), 0); // Need a timeout, for some reason without it the inner label container will not get focused
		}
	}

	protected override createContentArea(parent: HTMLElement): HTMLElement {
		this.element = parent;

		// Track focus within container
		const scopedContextKeyService = this._register(this.contextKeyService.createScoped(this.element));
		StatusBarFocused.bindTo(scopedContextKeyService).set(true);

		// Left items container
		this.leftItemsContainer = $('.left-items.items-container');
		this.element.appendChild(this.leftItemsContainer);
		this.element.tabIndex = 0;

		// Right items container
		this.rightItemsContainer = $('.right-items.items-container');
		this.element.appendChild(this.rightItemsContainer);

		// Context menu support
		this._register(addDisposableListener(parent, EventType.CONTEXT_MENU, e => this.showContextMenu(e)));
		this._register(Gesture.addTarget(parent));
		this._register(addDisposableListener(parent, TouchEventType.Contextmenu, e => this.showContextMenu(e)));

		// Initial status bar entries
		this.createInitialStatusbarEntries();

		return this.element;
	}

	private createInitialStatusbarEntries(): void {

		// Add items in order according to alignment
		this.appendStatusbarEntries();

		// Fill in pending entries if any
		while (this.pendingEntries.length) {
			const pending = this.pendingEntries.shift();
			if (pending) {
				pending.accessor = this.addEntry(pending.entry, pending.id, pending.alignment, pending.priority.primary);
			}
		}
	}

	private appendStatusbarEntries(): void {
		const leftItemsContainer = assertReturnsDefined(this.leftItemsContainer);
		const rightItemsContainer = assertReturnsDefined(this.rightItemsContainer);

		// Clear containers
		clearNode(leftItemsContainer);
		clearNode(rightItemsContainer);

		// Append all
		for (const entry of [
			...this.viewModel.getEntries(StatusbarAlignment.LEFT),
			...this.viewModel.getEntries(StatusbarAlignment.RIGHT).reverse() // reversing due to flex: row-reverse
		]) {
			const target = entry.alignment === StatusbarAlignment.LEFT ? leftItemsContainer : rightItemsContainer;

			target.appendChild(entry.container);
		}

		// Update compact entries
		this.updateCompactEntries();
	}

	private appendStatusbarEntry(entry: IStatusbarViewModelEntry): void {
		const entries = this.viewModel.getEntries(entry.alignment);

		if (entry.alignment === StatusbarAlignment.RIGHT) {
			entries.reverse(); // reversing due to flex: row-reverse
		}

		const target = assertReturnsDefined(entry.alignment === StatusbarAlignment.LEFT ? this.leftItemsContainer : this.rightItemsContainer);

		const index = entries.indexOf(entry);
		if (index + 1 === entries.length) {
			target.appendChild(entry.container); // append at the end if last
		} else {
			target.insertBefore(entry.container, entries[index + 1].container); // insert before next element otherwise
		}

		// Update compact entries
		this.updateCompactEntries();
	}

	private updateCompactEntries(): void {
		const entries = this.viewModel.entries;

		// Find visible entries and clear compact related CSS classes if any
		const mapIdToVisibleEntry = new Map<string, IStatusbarViewModelEntry>();
		for (const entry of entries) {
			if (!this.viewModel.isHidden(entry.id)) {
				mapIdToVisibleEntry.set(entry.id, entry);
			}

			entry.container.classList.remove('compact-left', 'compact-right');
		}

		// Figure out groups of entries with `compact` alignment
		const compactEntryGroups = new Map<string, Map<string, IStatusbarViewModelEntry>>();
		for (const entry of mapIdToVisibleEntry.values()) {
			if (
				isStatusbarEntryLocation(entry.priority.primary) && // entry references another entry as location
				entry.priority.primary.compact						// entry wants to be compact
			) {
				const locationId = entry.priority.primary.location.id;
				const location = mapIdToVisibleEntry.get(locationId);
				if (!location) {
					continue; // skip if location does not exist
				}

				// Build a map of entries that are compact among each other
				let compactEntryGroup = compactEntryGroups.get(locationId);
				if (!compactEntryGroup) {

					// It is possible that this entry references another entry
					// that itself references an entry. In that case, we want
					// to add it to the entries of the referenced entry.

					for (const group of compactEntryGroups.values()) {
						if (group.has(locationId)) {
							compactEntryGroup = group;
							break;
						}
					}

					if (!compactEntryGroup) {
						compactEntryGroup = new Map<string, IStatusbarViewModelEntry>();
						compactEntryGroups.set(locationId, compactEntryGroup);
					}
				}
				compactEntryGroup.set(entry.id, entry);
				compactEntryGroup.set(location.id, location);

				// Adjust CSS classes to move compact items closer together
				if (entry.priority.primary.alignment === StatusbarAlignment.LEFT) {
					location.container.classList.add('compact-left');
					entry.container.classList.add('compact-right');
				} else {
					location.container.classList.add('compact-right');
					entry.container.classList.add('compact-left');
				}
			}
		}

		// Install mouse listeners to update hover feedback for
		// all compact entries that belong to each other
		const statusBarItemHoverBackground = this.getColor(STATUS_BAR_ITEM_HOVER_BACKGROUND);
		const statusBarItemCompactHoverBackground = this.getColor(STATUS_BAR_ITEM_COMPACT_HOVER_BACKGROUND);
		this.compactEntriesDisposable.value = new DisposableStore();
		if (statusBarItemHoverBackground && statusBarItemCompactHoverBackground && !isHighContrast(this.theme.type)) {
			for (const [, compactEntryGroup] of compactEntryGroups) {
				for (const compactEntry of compactEntryGroup.values()) {
					if (!compactEntry.hasCommand) {
						continue; // only show hover feedback when we have a command
					}

					this.compactEntriesDisposable.value.add(addDisposableListener(compactEntry.labelContainer, EventType.MOUSE_OVER, () => {
						compactEntryGroup.forEach(compactEntry => compactEntry.labelContainer.style.backgroundColor = statusBarItemHoverBackground);
						compactEntry.labelContainer.style.backgroundColor = statusBarItemCompactHoverBackground;
					}));

					this.compactEntriesDisposable.value.add(addDisposableListener(compactEntry.labelContainer, EventType.MOUSE_OUT, () => {
						compactEntryGroup.forEach(compactEntry => compactEntry.labelContainer.style.backgroundColor = '');
					}));
				}
			}
		}
	}

	private showContextMenu(e: MouseEvent | GestureEvent): void {
		EventHelper.stop(e, true);

		const event = new StandardMouseEvent(getWindow(this.element), e);

		let actions: IAction[] | undefined = undefined;
		this.contextMenuService.showContextMenu({
			getAnchor: () => event,
			getActions: () => {
				actions = this.getContextMenuActions(event);

				return actions;
			},
			onHide: () => {
				if (actions) {
					disposeIfDisposable(actions);
				}
			}
		});
	}

	private getContextMenuActions(event: StandardMouseEvent): IAction[] {
		const actions: IAction[] = [];

		// Provide an action to hide the status bar at last
		actions.push(toAction({ id: ToggleStatusbarVisibilityAction.ID, label: localize('hideStatusBar', "Hide Status Bar"), run: () => this.instantiationService.invokeFunction(accessor => new ToggleStatusbarVisibilityAction().run(accessor)) }));
		actions.push(new Separator());

		// Show an entry per known status entry
		// Note: even though entries have an identifier, there can be multiple entries
		// having the same identifier (e.g. from extensions). So we make sure to only
		// show a single entry per identifier we handled.
		const handledEntries = new Set<string>();
		for (const entry of this.viewModel.entries) {
			if (!handledEntries.has(entry.id)) {
				actions.push(new ToggleStatusbarEntryVisibilityAction(entry.id, entry.name, this.viewModel));
				handledEntries.add(entry.id);
			}
		}

		// Figure out if mouse is over an entry
		let statusEntryUnderMouse: IStatusbarViewModelEntry | undefined = undefined;
		for (let element: HTMLElement | null = event.target; element; element = element.parentElement) {
			const entry = this.viewModel.findEntry(element);
			if (entry) {
				statusEntryUnderMouse = entry;
				break;
			}
		}

		if (statusEntryUnderMouse) {
			actions.push(new Separator());
			if (statusEntryUnderMouse.extensionId) {
				actions.push(this.instantiationService.createInstance(ManageExtensionAction, statusEntryUnderMouse.extensionId));
			}
			actions.push(new HideStatusbarEntryAction(statusEntryUnderMouse.id, statusEntryUnderMouse.name, this.viewModel));
		}

		return actions;
	}

	override updateStyles(): void {
		super.updateStyles();

		const container = assertReturnsDefined(this.getContainer());
		const styleOverride: IStatusbarStyleOverride | undefined = [...this.styleOverrides].sort((a, b) => a.priority - b.priority)[0];

		// Background / foreground colors
		const backgroundColor = this.getColor(styleOverride?.background ?? (this.contextService.getWorkbenchState() !== WorkbenchState.EMPTY ? STATUS_BAR_BACKGROUND : STATUS_BAR_NO_FOLDER_BACKGROUND)) || '';
		container.style.backgroundColor = backgroundColor;
		const foregroundColor = this.getColor(styleOverride?.foreground ?? (this.contextService.getWorkbenchState() !== WorkbenchState.EMPTY ? STATUS_BAR_FOREGROUND : STATUS_BAR_NO_FOLDER_FOREGROUND)) || '';
		container.style.color = foregroundColor;
		const itemBorderColor = this.getColor(STATUS_BAR_ITEM_FOCUS_BORDER);

		// Border color
		const borderColor = this.getColor(styleOverride?.border ?? (this.contextService.getWorkbenchState() !== WorkbenchState.EMPTY ? STATUS_BAR_BORDER : STATUS_BAR_NO_FOLDER_BORDER)) || this.getColor(contrastBorder);
		if (borderColor) {
			container.classList.add('status-border-top');
			container.style.setProperty('--status-border-top-color', borderColor);
		} else {
			container.classList.remove('status-border-top');
			container.style.removeProperty('--status-border-top-color');
		}

		// Colors and focus outlines via dynamic stylesheet

		const statusBarFocusColor = this.getColor(STATUS_BAR_FOCUS_BORDER);

		if (!this.styleElement) {
			this.styleElement = createStyleSheet(container);
		}

		this.styleElement.textContent = `

				/* Status bar focus outline */
				.monaco-workbench .part.statusbar:focus {
					outline-color: ${statusBarFocusColor};
				}

				/* Status bar item focus outline */
				.monaco-workbench .part.statusbar > .items-container > .statusbar-item a:focus-visible {
					outline: 1px solid ${this.getColor(activeContrastBorder) ?? itemBorderColor};
					outline-offset: ${borderColor ? '-2px' : '-1px'};
				}

				/* Notification Beak */
				.monaco-workbench .part.statusbar > .items-container > .statusbar-item.has-beak > .status-bar-item-beak-container:before {
					border-bottom-color: ${borderColor ?? backgroundColor};
				}
			`;
	}

	override layout(width: number, height: number, top: number, left: number): void {
		super.layout(width, height, top, left);
		super.layoutContents(width, height);
	}

	overrideStyle(style: IStatusbarStyleOverride): IDisposable {
		this.styleOverrides.add(style);
		this.updateStyles();

		return toDisposable(() => {
			this.styleOverrides.delete(style);
			this.updateStyles();
		});
	}

	toJSON(): object {
		return {
			type: Parts.STATUSBAR_PART
		};
	}

	override dispose(): void {
		this._onWillDispose.fire();

		super.dispose();
	}
}

export class MainStatusbarPart extends StatusbarPart {

	constructor(
		@IInstantiationService instantiationService: IInstantiationService,
		@IThemeService themeService: IThemeService,
		@IWorkspaceContextService contextService: IWorkspaceContextService,
		@IStorageService storageService: IStorageService,
		@IWorkbenchLayoutService layoutService: IWorkbenchLayoutService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IContextKeyService contextKeyService: IContextKeyService,
	) {
		super(Parts.STATUSBAR_PART, instantiationService, themeService, contextService, storageService, layoutService, contextMenuService, contextKeyService);
	}
}

export interface IAuxiliaryStatusbarPart extends IStatusbarEntryContainer, IView {
	readonly container: HTMLElement;
	readonly height: number;
}

export class AuxiliaryStatusbarPart extends StatusbarPart implements IAuxiliaryStatusbarPart {

	private static COUNTER = 1;

	readonly height = StatusbarPart.HEIGHT;

	constructor(
		readonly container: HTMLElement,
		@IInstantiationService instantiationService: IInstantiationService,
		@IThemeService themeService: IThemeService,
		@IWorkspaceContextService contextService: IWorkspaceContextService,
		@IStorageService storageService: IStorageService,
		@IWorkbenchLayoutService layoutService: IWorkbenchLayoutService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IContextKeyService contextKeyService: IContextKeyService,
	) {
		const id = AuxiliaryStatusbarPart.COUNTER++;
		super(`workbench.parts.auxiliaryStatus.${id}`, instantiationService, themeService, contextService, storageService, layoutService, contextMenuService, contextKeyService);
	}
}

export class StatusbarService extends MultiWindowParts<StatusbarPart> implements IStatusbarService {

	declare readonly _serviceBrand: undefined;

	readonly mainPart: MainStatusbarPart;

	private readonly _onDidCreateAuxiliaryStatusbarPart = this._register(new Emitter<AuxiliaryStatusbarPart>());
	private readonly onDidCreateAuxiliaryStatusbarPart = this._onDidCreateAuxiliaryStatusbarPart.event;

	constructor(
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IStorageService storageService: IStorageService,
		@IThemeService themeService: IThemeService
	) {
		super('workbench.statusBarService', themeService, storageService);

		this.mainPart = this._register(this.instantiationService.createInstance(MainStatusbarPart));
		this._register(this.registerPart(this.mainPart));

		this.onDidChangeEntryVisibility = this.mainPart.onDidChangeEntryVisibility;
	}

	//#region Auxiliary Statusbar Parts

	createAuxiliaryStatusbarPart(container: HTMLElement, instantiationService: IInstantiationService): IAuxiliaryStatusbarPart {

		// Container
		const statusbarPartContainer = $('footer.part.statusbar', {
			'role': 'status',
			'aria-live': 'off',
			'tabIndex': '0'
		});
		statusbarPartContainer.style.position = 'relative';
		container.appendChild(statusbarPartContainer);

		// Statusbar Part
		const statusbarPart = instantiationService.createInstance(AuxiliaryStatusbarPart, statusbarPartContainer);
		const disposable = this.registerPart(statusbarPart);

		statusbarPart.create(statusbarPartContainer);

		Event.once(statusbarPart.onWillDispose)(() => disposable.dispose());

		// Emit internal event
		this._onDidCreateAuxiliaryStatusbarPart.fire(statusbarPart);

		return statusbarPart;
	}

	createScoped(statusbarEntryContainer: IStatusbarEntryContainer, disposables: DisposableStore): IStatusbarService {
		return disposables.add(this.instantiationService.createInstance(ScopedStatusbarService, statusbarEntryContainer));
	}

	//#endregion

	//#region Service Implementation

	readonly onDidChangeEntryVisibility: Event<{ id: string; visible: boolean }>;

	addEntry(entry: IStatusbarEntry, id: string, alignment: StatusbarAlignment, priorityOrLocation: number | IStatusbarEntryLocation | IStatusbarEntryPriority = 0): IStatusbarEntryAccessor {
		if (entry.showInAllWindows) {
			return this.doAddEntryToAllWindows(entry, id, alignment, priorityOrLocation);
		}

		return this.mainPart.addEntry(entry, id, alignment, priorityOrLocation);
	}

	private doAddEntryToAllWindows(originalEntry: IStatusbarEntry, id: string, alignment: StatusbarAlignment, priorityOrLocation: number | IStatusbarEntryLocation | IStatusbarEntryPriority = 0): IStatusbarEntryAccessor {
		const entryDisposables = new DisposableStore();

		const accessors = new Set<IStatusbarEntryAccessor>();

		let entry = originalEntry;
		function addEntry(part: StatusbarPart | AuxiliaryStatusbarPart): void {
			const partDisposables = new DisposableStore();
			partDisposables.add(part.onWillDispose(() => partDisposables.dispose()));

			const accessor = partDisposables.add(part.addEntry(entry, id, alignment, priorityOrLocation));
			accessors.add(accessor);
			partDisposables.add(toDisposable(() => accessors.delete(accessor)));

			entryDisposables.add(partDisposables);
			partDisposables.add(toDisposable(() => entryDisposables.delete(partDisposables)));
		}

		for (const part of this.parts) {
			addEntry(part);
		}

		entryDisposables.add(this.onDidCreateAuxiliaryStatusbarPart(part => addEntry(part)));

		return {
			update: (updatedEntry: IStatusbarEntry) => {
				entry = updatedEntry;

				for (const update of accessors) {
					update.update(updatedEntry);
				}
			},
			dispose: () => entryDisposables.dispose()
		};
	}

	isEntryVisible(id: string): boolean {
		return this.mainPart.isEntryVisible(id);
	}

	updateEntryVisibility(id: string, visible: boolean): void {
		for (const part of this.parts) {
			part.updateEntryVisibility(id, visible);
		}
	}

	overrideEntry(id: string, override: Partial<IStatusbarEntry>): IDisposable {
		const disposables = new DisposableStore();

		for (const part of this.parts) {
			disposables.add(part.overrideEntry(id, override));
		}

		return disposables;
	}

	focus(preserveEntryFocus?: boolean): void {
		this.activePart.focus(preserveEntryFocus);
	}

	focusNextEntry(): void {
		this.activePart.focusNextEntry();
	}

	focusPreviousEntry(): void {
		this.activePart.focusPreviousEntry();
	}

	isEntryFocused(): boolean {
		return this.activePart.isEntryFocused();
	}

	overrideStyle(style: IStatusbarStyleOverride): IDisposable {
		const disposables = new DisposableStore();

		for (const part of this.parts) {
			disposables.add(part.overrideStyle(style));
		}

		return disposables;
	}

	//#endregion
}

export class ScopedStatusbarService extends Disposable implements IStatusbarService {

	declare readonly _serviceBrand: undefined;

	constructor(
		private readonly statusbarEntryContainer: IStatusbarEntryContainer,
		@IStatusbarService private readonly statusbarService: IStatusbarService
	) {
		super();

		this.onDidChangeEntryVisibility = this.statusbarEntryContainer.onDidChangeEntryVisibility;
	}

	createAuxiliaryStatusbarPart(container: HTMLElement, instantiationService: IInstantiationService): IAuxiliaryStatusbarPart {
		return this.statusbarService.createAuxiliaryStatusbarPart(container, instantiationService);
	}

	createScoped(statusbarEntryContainer: IStatusbarEntryContainer, disposables: DisposableStore): IStatusbarService {
		return this.statusbarService.createScoped(statusbarEntryContainer, disposables);
	}

	getPart(): IStatusbarEntryContainer {
		return this.statusbarEntryContainer;
	}

	readonly onDidChangeEntryVisibility: Event<{ id: string; visible: boolean }>;

	addEntry(entry: IStatusbarEntry, id: string, alignment: StatusbarAlignment, priorityOrLocation: number | IStatusbarEntryLocation | IStatusbarEntryPriority = 0): IStatusbarEntryAccessor {
		return this.statusbarEntryContainer.addEntry(entry, id, alignment, priorityOrLocation);
	}

	isEntryVisible(id: string): boolean {
		return this.statusbarEntryContainer.isEntryVisible(id);
	}

	updateEntryVisibility(id: string, visible: boolean): void {
		this.statusbarEntryContainer.updateEntryVisibility(id, visible);
	}

	overrideEntry(id: string, override: Partial<IStatusbarEntry>): IDisposable {
		return this.statusbarEntryContainer.overrideEntry(id, override);
	}

	focus(preserveEntryFocus?: boolean): void {
		this.statusbarEntryContainer.focus(preserveEntryFocus);
	}

	focusNextEntry(): void {
		this.statusbarEntryContainer.focusNextEntry();
	}

	focusPreviousEntry(): void {
		this.statusbarEntryContainer.focusPreviousEntry();
	}

	isEntryFocused(): boolean {
		return this.statusbarEntryContainer.isEntryFocused();
	}

	overrideStyle(style: IStatusbarStyleOverride): IDisposable {
		return this.statusbarEntryContainer.overrideStyle(style);
	}
}

registerSingleton(IStatusbarService, StatusbarService, InstantiationType.Eager);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/statusbar/media/statusbarpart.css]---
Location: vscode-main/src/vs/workbench/browser/parts/statusbar/media/statusbarpart.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-workbench .part.statusbar {
	box-sizing: border-box;
	cursor: default;
	width: 100%;
	height: 22px;
	font-size: 12px;
	display: flex;
	overflow: hidden;
}

.monaco-workbench.monaco-enable-motion .part.statusbar {
	transition: background-color 0.15s ease-out;
}

.monaco-workbench.mac:not(.fullscreen) .part.statusbar:focus {
	/* Rounded corners to make focus outline appear properly (unless fullscreen) */
	border-bottom-right-radius: 10px;
	border-bottom-left-radius: 10px;
}
.monaco-workbench.mac.macos-tahoe:not(.fullscreen) .part.statusbar:focus {
	/* macOS Tahoe increased rounded corners size */
	border-bottom-right-radius: 16px;
	border-bottom-left-radius: 16px;
}

.monaco-workbench .part.statusbar:not(:focus).status-border-top::after {
	/* Top border only visible unless focused to make room for focus outline */
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	z-index: 5;
	pointer-events: none;
	background-color: var(--status-border-top-color);
	width: 100%;
	height: 1px;
}

.monaco-workbench .part.statusbar > .left-items,
.monaco-workbench .part.statusbar > .right-items {
	display: flex;
}

.monaco-workbench .part.statusbar > .right-items {
	flex-wrap: wrap; /* overflow elements by wrapping */
	flex-direction: row-reverse; /* let the elements to the left wrap first */
}

.monaco-workbench .part.statusbar > .left-items {
	flex-grow: 1; /* left items push right items to the far right end */
}

.monaco-workbench .part.statusbar > .items-container > .statusbar-item {
	display: inline-block;
	line-height: 22px;
	height: 100%;
	vertical-align: top;
	max-width: 40vw;
	font-variant-numeric: tabular-nums;
}

.monaco-workbench .part.statusbar > .items-container > .statusbar-item.has-beak {
	position: relative;
}

.monaco-workbench .part.statusbar > .items-container > .statusbar-item.has-beak > .status-bar-item-beak-container {
	position: absolute;
	left: calc(50% - 5px); /* centering relative to parent */
	top: -5px;
	width: 10px;
	height: 5px;
}

.monaco-workbench .part.statusbar > .items-container > .statusbar-item.has-beak > .status-bar-item-beak-container:before {
	content: '';
	position: fixed;
	border-bottom-width: 5px;
	border-bottom-style: solid;
	border-left: 5px solid transparent;
	border-right: 5px solid transparent;
}

.monaco-workbench .part.statusbar > .items-container > .statusbar-item.left.first-visible-item,
.monaco-workbench .part.statusbar > .items-container > .statusbar-item.right.last-visible-item {
	padding-right: 0;
	padding-left: 0;
}

.monaco-workbench .part.statusbar > .items-container > .statusbar-item > .statusbar-item-label {
	cursor: pointer;
	display: flex;
	height: 100%;
	margin-right: 3px;
	margin-left: 3px;
	padding: 0 5px;
	white-space: pre; /* gives some degree of styling */
	align-items: center;
	text-overflow: ellipsis;
	overflow: hidden;
	outline-width: 0px; /* do not render focus outline, we already have background */
}

.monaco-workbench .part.statusbar > .items-container > .statusbar-item.compact-left > .statusbar-item-label {
	margin-left: 0;
	margin-right: 5px; /* +2px because padding is smaller and we want to preserve spacing between items */
	padding: 0 3px;
}

.monaco-workbench .part.statusbar > .items-container > .statusbar-item.compact-right > .statusbar-item-label {
	margin-left: 5px; /* +2px because padding is smaller and we want to preserve spacing between items */
	margin-right: 0;
	padding: 0 3px;
}

.monaco-workbench .part.statusbar > .items-container > .statusbar-item.compact-left.compact-right > .statusbar-item-label {
	margin-left: 0;
	margin-right: 0;
}

.monaco-workbench .part.statusbar > .items-container > .statusbar-item.left.first-visible-item > .statusbar-item-label,
.monaco-workbench .part.statusbar > .items-container > .statusbar-item.right.last-visible-item > .statusbar-item-label,
.monaco-workbench .part.statusbar > .items-container > .statusbar-item.has-background-color > .statusbar-item-label {
	margin-left: 0; /* Reduce margin to let element attach to the corners */
	margin-right: 0;
	padding-left: 8px; /* But increase padding to preserve our usual spacing */
	padding-right: 8px;
}

.monaco-workbench .part.statusbar > .items-container > .statusbar-item.compact-left.has-background-color > .statusbar-item-label {
	padding-left: 3px;
	padding-right: 10px;
}

.monaco-workbench .part.statusbar > .items-container > .statusbar-item.compact-right.has-background-color > .statusbar-item-label {
	padding-left: 10px;
	padding-right: 3px;
}

.monaco-workbench .part.statusbar > .items-container > .statusbar-item > a:hover:not(.disabled) {
	text-decoration: none;
	color: var(--vscode-statusBarItem-hoverForeground);
}

.monaco-workbench .part.statusbar > .items-container > .statusbar-item > a.disabled {
	cursor: default;
}

.monaco-workbench .part.statusbar > .items-container > .statusbar-item span.codicon {
	text-align: center;
	color: inherit;
}

.monaco-workbench .part.statusbar > .items-container > .statusbar-item a:active:not(.disabled) {
	outline: 1px solid var(--vscode-contrastActiveBorder) !important;
	outline-offset: -1px;
}

.monaco-workbench:not(.hc-light):not(.hc-black) .part.statusbar > .items-container > .statusbar-item a:active:not(.disabled) {
	background-color: var(--vscode-statusBarItem-activeBackground) !important;
}

.monaco-workbench .part.statusbar > .items-container > .statusbar-item a:hover:not(.disabled) {
	outline: 1px dashed var(--vscode-contrastActiveBorder);
	outline-offset: -1px;
}

.monaco-workbench .part.statusbar > .items-container > .statusbar-item a:hover:not(.disabled) {
	background-color: var(--vscode-statusBarItem-hoverBackground) !important;
}

/** Status bar entry item kinds */

.monaco-workbench .part.statusbar > .items-container > .statusbar-item.warning-kind {
	color: var(--vscode-statusBarItem-warningForeground);
	background-color: var(--vscode-statusBarItem-warningBackground);
}

.monaco-workbench .part.statusbar > .items-container > .statusbar-item.warning-kind a:hover:not(.disabled) {
	color: var(--vscode-statusBarItem-warningHoverForeground);
	background-color: var(--vscode-statusBarItem-warningHoverBackground) !important;
}

.monaco-workbench .part.statusbar > .items-container > .statusbar-item.error-kind {
	color: var(--vscode-statusBarItem-errorForeground);
	background-color: var(--vscode-statusBarItem-errorBackground);
}

.monaco-workbench .part.statusbar > .items-container > .statusbar-item.error-kind a:hover:not(.disabled) {
	color: var(--vscode-statusBarItem-errorHoverForeground);
	background-color: var(--vscode-statusBarItem-errorHoverBackground) !important;
}

.monaco-workbench .part.statusbar > .items-container > .statusbar-item.prominent-kind {
	color: var(--vscode-statusBarItem-prominentForeground);
	background-color: var(--vscode-statusBarItem-prominentBackground);
}

/**
 * Using :not(.compact-right):not(.compact-left) here to improve the visual appearance
 * when a prominent item uses `compact: true` with other items. The presence of the
 * !important directive for `background-color` otherwise blocks our special hover handling
 * code here:
 * https://github.com/microsoft/vscode/blob/c2037f152b2bb3119ce1d87f52987776540dd57f/src/vs/workbench/browser/parts/statusbar/statusbarPart.ts#L483-L505
 *
 * Note: this is currently only done for the prominent kind, but needs to be expanded if
 * other kinds use compact feature.
 */
.monaco-workbench .part.statusbar > .items-container > .statusbar-item.prominent-kind:not(.compact-right):not(.compact-left) a:hover:not(.disabled) {
	color: var(--vscode-statusBarItem-prominentHoverForeground);
	background-color: var(--vscode-statusBarItem-prominentHoverBackground) !important;
}

.monaco-workbench .part.statusbar > .items-container > .statusbar-item.remote-kind {
	color: var(--vscode-statusBarItem-remoteForeground);
	background-color: var(--vscode-statusBarItem-remoteBackground);
}

.monaco-workbench .part.statusbar > .items-container > .statusbar-item.remote-kind a:hover:not(.disabled) {
	color: var(--vscode-statusBarItem-remoteHoverForeground);
	background-color: var(--vscode-statusBarItem-remoteHoverBackground) !important;
}

.monaco-workbench .part.statusbar > .items-container > .statusbar-item.offline-kind {
	color: var(--vscode-statusBarItem-offlineForeground);
	background-color: var(--vscode-statusBarItem-offlineBackground);
}

.monaco-workbench .part.statusbar > .items-container > .statusbar-item.offline-kind a:hover:not(.disabled) {
	color: var(--vscode-statusBarItem-offlineHoverForeground);
	background-color: var(--vscode-statusBarItem-offlineHoverBackground) !important;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/titlebar/commandCenterControl.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/titlebar/commandCenterControl.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isActiveDocument, reset } from '../../../../base/browser/dom.js';
import { BaseActionViewItem, IBaseActionViewItemOptions } from '../../../../base/browser/ui/actionbar/actionViewItems.js';
import { getDefaultHoverDelegate } from '../../../../base/browser/ui/hover/hoverDelegateFactory.js';
import { IHoverDelegate } from '../../../../base/browser/ui/hover/hoverDelegate.js';
import { renderIcon } from '../../../../base/browser/ui/iconLabel/iconLabels.js';
import { IAction, SubmenuAction } from '../../../../base/common/actions.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { localize } from '../../../../nls.js';
import { createActionViewItem } from '../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { HiddenItemStrategy, MenuWorkbenchToolBar, WorkbenchToolBar } from '../../../../platform/actions/browser/toolbar.js';
import { MenuId, MenuRegistry, SubmenuItemAction } from '../../../../platform/actions/common/actions.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { IQuickInputService } from '../../../../platform/quickinput/common/quickInput.js';
import { WindowTitle } from './windowTitle.js';
import { IEditorGroupsService } from '../../../services/editor/common/editorGroupsService.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';

export class CommandCenterControl {

	private readonly _disposables = new DisposableStore();

	private readonly _onDidChangeVisibility = this._disposables.add(new Emitter<void>());
	readonly onDidChangeVisibility: Event<void> = this._onDidChangeVisibility.event;

	readonly element: HTMLElement = document.createElement('div');

	constructor(
		windowTitle: WindowTitle,
		hoverDelegate: IHoverDelegate,
		@IInstantiationService instantiationService: IInstantiationService,
		@IQuickInputService quickInputService: IQuickInputService,
	) {
		this.element.classList.add('command-center');

		const titleToolbar = instantiationService.createInstance(MenuWorkbenchToolBar, this.element, MenuId.CommandCenter, {
			contextMenu: MenuId.TitleBarContext,
			hiddenItemStrategy: HiddenItemStrategy.NoHide,
			toolbarOptions: {
				primaryGroup: () => true,
			},
			telemetrySource: 'commandCenter',
			actionViewItemProvider: (action, options) => {
				if (action instanceof SubmenuItemAction && action.item.submenu === MenuId.CommandCenterCenter) {
					return instantiationService.createInstance(CommandCenterCenterViewItem, action, windowTitle, { ...options, hoverDelegate });
				} else {
					return createActionViewItem(instantiationService, action, { ...options, hoverDelegate });
				}
			}
		});

		this._disposables.add(Event.filter(quickInputService.onShow, () => isActiveDocument(this.element), this._disposables)(this._setVisibility.bind(this, false)));
		this._disposables.add(quickInputService.onHide(this._setVisibility.bind(this, true)));
		this._disposables.add(titleToolbar);
	}

	private _setVisibility(show: boolean): void {
		this.element.classList.toggle('hide', !show);
		this._onDidChangeVisibility.fire();
	}

	dispose(): void {
		this._disposables.dispose();
	}
}


class CommandCenterCenterViewItem extends BaseActionViewItem {

	private static readonly _quickOpenCommandId = 'workbench.action.quickOpenWithModes';

	private readonly _hoverDelegate: IHoverDelegate;

	constructor(
		private readonly _submenu: SubmenuItemAction,
		private readonly _windowTitle: WindowTitle,
		options: IBaseActionViewItemOptions,
		@IHoverService private readonly _hoverService: IHoverService,
		@IKeybindingService private _keybindingService: IKeybindingService,
		@IInstantiationService private _instaService: IInstantiationService,
		@IEditorGroupsService private _editorGroupService: IEditorGroupsService,
	) {
		super(undefined, _submenu.actions.find(action => action.id === 'workbench.action.quickOpenWithModes') ?? _submenu.actions[0], options);
		this._hoverDelegate = options.hoverDelegate ?? getDefaultHoverDelegate('mouse');
	}

	override render(container: HTMLElement): void {
		super.render(container);
		container.classList.add('command-center-center');
		container.classList.toggle('multiple', (this._submenu.actions.length > 1));

		const hover = this._store.add(this._hoverService.setupManagedHover(this._hoverDelegate, container, this.getTooltip()));

		// update label & tooltip when window title changes
		this._store.add(this._windowTitle.onDidChange(() => {
			hover.update(this.getTooltip());
		}));

		const groups: (readonly IAction[])[] = [];
		for (const action of this._submenu.actions) {
			if (action instanceof SubmenuAction) {
				groups.push(action.actions);
			} else {
				groups.push([action]);
			}
		}


		for (let i = 0; i < groups.length; i++) {
			const group = groups[i];

			// nested toolbar
			const toolbar = this._instaService.createInstance(WorkbenchToolBar, container, {
				hiddenItemStrategy: HiddenItemStrategy.NoHide,
				telemetrySource: 'commandCenterCenter',
				actionViewItemProvider: (action, options) => {
					options = {
						...options,
						hoverDelegate: this._hoverDelegate,
					};

					if (action.id !== CommandCenterCenterViewItem._quickOpenCommandId) {
						return createActionViewItem(this._instaService, action, options);
					}

					const that = this;

					return this._instaService.createInstance(class CommandCenterQuickPickItem extends BaseActionViewItem {

						constructor() {
							super(undefined, action, options);
						}

						override render(container: HTMLElement): void {
							super.render(container);
							container.classList.toggle('command-center-quick-pick');
							container.role = 'button';
							container.setAttribute('aria-description', this.getTooltip());
							const action = this.action;

							// icon (search)
							const searchIcon = document.createElement('span');
							searchIcon.ariaHidden = 'true';
							searchIcon.className = action.class ?? '';
							searchIcon.classList.add('search-icon');

							// label: just workspace name and optional decorations
							const label = this._getLabel();
							const labelElement = document.createElement('span');
							labelElement.classList.add('search-label');
							labelElement.textContent = label;
							reset(container, searchIcon, labelElement);

							const hover = this._store.add(that._hoverService.setupManagedHover(that._hoverDelegate, container, this.getTooltip()));

							// update label & tooltip when window title changes
							this._store.add(that._windowTitle.onDidChange(() => {
								hover.update(this.getTooltip());
								labelElement.textContent = this._getLabel();
							}));

							// update label & tooltip when tabs visibility changes
							this._store.add(that._editorGroupService.onDidChangeEditorPartOptions(({ newPartOptions, oldPartOptions }) => {
								if (newPartOptions.showTabs !== oldPartOptions.showTabs) {
									hover.update(this.getTooltip());
									labelElement.textContent = this._getLabel();
								}
							}));
						}

						protected override getTooltip() {
							return that.getTooltip();
						}

						private _getLabel(): string {
							const { prefix, suffix } = that._windowTitle.getTitleDecorations();
							let label = that._windowTitle.workspaceName;
							if (that._windowTitle.isCustomTitleFormat()) {
								label = that._windowTitle.getWindowTitle();
							} else if (that._editorGroupService.partOptions.showTabs === 'none') {
								label = that._windowTitle.fileName ?? label;
							}
							if (!label) {
								label = localize('label.dfl', "Search");
							}
							if (prefix) {
								label = localize('label1', "{0} {1}", prefix, label);
							}
							if (suffix) {
								label = localize('label2', "{0} {1}", label, suffix);
							}

							return label.replaceAll(/\r\n|\r|\n/g, '\u23CE');
						}
					});
				}
			});
			toolbar.setActions(group);
			this._store.add(toolbar);


			// spacer
			if (i < groups.length - 1) {
				const icon = renderIcon(Codicon.circleSmallFilled);
				icon.style.padding = '0 8px';
				icon.style.height = '100%';
				icon.style.opacity = '0.5';
				container.appendChild(icon);
			}
		}
	}

	protected override getTooltip() {

		// tooltip: full windowTitle
		const kb = this._keybindingService.lookupKeybinding(this.action.id)?.getLabel();
		const title = kb
			? localize('title', "Search {0} ({1}) \u2014 {2}", this._windowTitle.workspaceName, kb, this._windowTitle.value)
			: localize('title2', "Search {0} \u2014 {1}", this._windowTitle.workspaceName, this._windowTitle.value);

		return title;
	}
}

MenuRegistry.appendMenuItem(MenuId.CommandCenter, {
	submenu: MenuId.CommandCenterCenter,
	title: localize('title3', "Command Center"),
	icon: Codicon.shield,
	order: 101,
});
```

--------------------------------------------------------------------------------

````
