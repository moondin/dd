---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 493
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 493 of 552)

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

---[FILE: src/vs/workbench/contrib/welcomeViews/common/viewsWelcomeExtensionPoint.ts]---
Location: vscode-main/src/vs/workbench/contrib/welcomeViews/common/viewsWelcomeExtensionPoint.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { IConfigurationPropertySchema } from '../../../../platform/configuration/common/configurationRegistry.js';

export enum ViewsWelcomeExtensionPointFields {
	view = 'view',
	contents = 'contents',
	when = 'when',
	group = 'group',
	enablement = 'enablement',
}

export interface ViewWelcome {
	readonly [ViewsWelcomeExtensionPointFields.view]: string;
	readonly [ViewsWelcomeExtensionPointFields.contents]: string;
	readonly [ViewsWelcomeExtensionPointFields.when]: string;
	readonly [ViewsWelcomeExtensionPointFields.group]: string;
	readonly [ViewsWelcomeExtensionPointFields.enablement]: string;
}

export type ViewsWelcomeExtensionPoint = ViewWelcome[];

export const ViewIdentifierMap: { [key: string]: string } = {
	'explorer': 'workbench.explorer.emptyView',
	'debug': 'workbench.debug.welcome',
	'scm': 'workbench.scm',
	'testing': 'workbench.view.testing'
};

const viewsWelcomeExtensionPointSchema = Object.freeze<IConfigurationPropertySchema>({
	type: 'array',
	description: nls.localize('contributes.viewsWelcome', "Contributed views welcome content. Welcome content will be rendered in tree based views whenever they have no meaningful content to display, ie. the File Explorer when no folder is open. Such content is useful as in-product documentation to drive users to use certain features before they are available. A good example would be a `Clone Repository` button in the File Explorer welcome view."),
	items: {
		type: 'object',
		description: nls.localize('contributes.viewsWelcome.view', "Contributed welcome content for a specific view."),
		required: [
			ViewsWelcomeExtensionPointFields.view,
			ViewsWelcomeExtensionPointFields.contents
		],
		properties: {
			[ViewsWelcomeExtensionPointFields.view]: {
				anyOf: [
					{
						type: 'string',
						description: nls.localize('contributes.viewsWelcome.view.view', "Target view identifier for this welcome content. Only tree based views are supported.")
					},
					{
						type: 'string',
						description: nls.localize('contributes.viewsWelcome.view.view', "Target view identifier for this welcome content. Only tree based views are supported."),
						enum: Object.keys(ViewIdentifierMap)
					}
				]
			},
			[ViewsWelcomeExtensionPointFields.contents]: {
				type: 'string',
				description: nls.localize('contributes.viewsWelcome.view.contents', "Welcome content to be displayed. The format of the contents is a subset of Markdown, with support for links only."),
			},
			[ViewsWelcomeExtensionPointFields.when]: {
				type: 'string',
				description: nls.localize('contributes.viewsWelcome.view.when', "Condition when the welcome content should be displayed."),
			},
			[ViewsWelcomeExtensionPointFields.group]: {
				type: 'string',
				description: nls.localize('contributes.viewsWelcome.view.group', "Group to which this welcome content belongs. Proposed API."),
			},
			[ViewsWelcomeExtensionPointFields.enablement]: {
				type: 'string',
				description: nls.localize('contributes.viewsWelcome.view.enablement', "Condition when the welcome content buttons and command links should be enabled."),
			},
		}
	}
});

export const viewsWelcomeExtensionPointDescriptor = {
	extensionPoint: 'viewsWelcome',
	jsonSchema: viewsWelcomeExtensionPointSchema
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/welcomeWalkthrough/browser/walkThrough.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/welcomeWalkthrough/browser/walkThrough.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { WalkThroughInput } from './walkThroughInput.js';
import { WalkThroughPart } from './walkThroughPart.js';
import { WalkThroughArrowUp, WalkThroughArrowDown, WalkThroughPageUp, WalkThroughPageDown } from './walkThroughActions.js';
import { WalkThroughSnippetContentProvider } from '../common/walkThroughContentProvider.js';
import { EditorWalkThroughAction, EditorWalkThroughInputSerializer } from './editor/editorWalkThrough.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { EditorExtensions, IEditorFactoryRegistry } from '../../../common/editor.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { MenuRegistry, MenuId, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { registerWorkbenchContribution2 } from '../../../common/contributions.js';
import { IEditorPaneRegistry, EditorPaneDescriptor } from '../../../browser/editor.js';
import { KeybindingsRegistry } from '../../../../platform/keybinding/common/keybindingsRegistry.js';

Registry.as<IEditorPaneRegistry>(EditorExtensions.EditorPane)
	.registerEditorPane(EditorPaneDescriptor.create(
		WalkThroughPart,
		WalkThroughPart.ID,
		localize('walkThrough.editor.label', "Playground"),
	),
		[new SyncDescriptor(WalkThroughInput)]);

registerAction2(EditorWalkThroughAction);

Registry.as<IEditorFactoryRegistry>(EditorExtensions.EditorFactory).registerEditorSerializer(EditorWalkThroughInputSerializer.ID, EditorWalkThroughInputSerializer);

registerWorkbenchContribution2(WalkThroughSnippetContentProvider.ID, WalkThroughSnippetContentProvider, { editorTypeId: WalkThroughPart.ID });

KeybindingsRegistry.registerCommandAndKeybindingRule(WalkThroughArrowUp);

KeybindingsRegistry.registerCommandAndKeybindingRule(WalkThroughArrowDown);

KeybindingsRegistry.registerCommandAndKeybindingRule(WalkThroughPageUp);

KeybindingsRegistry.registerCommandAndKeybindingRule(WalkThroughPageDown);

MenuRegistry.appendMenuItem(MenuId.MenubarHelpMenu, {
	group: '1_welcome',
	command: {
		id: 'workbench.action.showInteractivePlayground',
		title: localize({ key: 'miPlayground', comment: ['&& denotes a mnemonic'] }, "Editor Playgrou&&nd")
	},
	order: 3
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/welcomeWalkthrough/browser/walkThroughActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/welcomeWalkthrough/browser/walkThroughActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IEditorService } from '../../../services/editor/common/editorService.js';
import { WalkThroughPart, WALK_THROUGH_FOCUS } from './walkThroughPart.js';
import { ICommandAndKeybindingRule, KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { EditorContextKeys } from '../../../../editor/common/editorContextKeys.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { KeyCode } from '../../../../base/common/keyCodes.js';

export const WalkThroughArrowUp: ICommandAndKeybindingRule = {
	id: 'workbench.action.interactivePlayground.arrowUp',
	weight: KeybindingWeight.WorkbenchContrib,
	when: ContextKeyExpr.and(WALK_THROUGH_FOCUS, EditorContextKeys.editorTextFocus.toNegated()),
	primary: KeyCode.UpArrow,
	handler: accessor => {
		const editorService = accessor.get(IEditorService);
		const activeEditorPane = editorService.activeEditorPane;
		if (activeEditorPane instanceof WalkThroughPart) {
			activeEditorPane.arrowUp();
		}
	}
};

export const WalkThroughArrowDown: ICommandAndKeybindingRule = {
	id: 'workbench.action.interactivePlayground.arrowDown',
	weight: KeybindingWeight.WorkbenchContrib,
	when: ContextKeyExpr.and(WALK_THROUGH_FOCUS, EditorContextKeys.editorTextFocus.toNegated()),
	primary: KeyCode.DownArrow,
	handler: accessor => {
		const editorService = accessor.get(IEditorService);
		const activeEditorPane = editorService.activeEditorPane;
		if (activeEditorPane instanceof WalkThroughPart) {
			activeEditorPane.arrowDown();
		}
	}
};

export const WalkThroughPageUp: ICommandAndKeybindingRule = {
	id: 'workbench.action.interactivePlayground.pageUp',
	weight: KeybindingWeight.WorkbenchContrib,
	when: ContextKeyExpr.and(WALK_THROUGH_FOCUS, EditorContextKeys.editorTextFocus.toNegated()),
	primary: KeyCode.PageUp,
	handler: accessor => {
		const editorService = accessor.get(IEditorService);
		const activeEditorPane = editorService.activeEditorPane;
		if (activeEditorPane instanceof WalkThroughPart) {
			activeEditorPane.pageUp();
		}
	}
};

export const WalkThroughPageDown: ICommandAndKeybindingRule = {
	id: 'workbench.action.interactivePlayground.pageDown',
	weight: KeybindingWeight.WorkbenchContrib,
	when: ContextKeyExpr.and(WALK_THROUGH_FOCUS, EditorContextKeys.editorTextFocus.toNegated()),
	primary: KeyCode.PageDown,
	handler: accessor => {
		const editorService = accessor.get(IEditorService);
		const activeEditorPane = editorService.activeEditorPane;
		if (activeEditorPane instanceof WalkThroughPart) {
			activeEditorPane.pageDown();
		}
	}
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/welcomeWalkthrough/browser/walkThroughInput.ts]---
Location: vscode-main/src/vs/workbench/contrib/welcomeWalkthrough/browser/walkThroughInput.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Dimension } from '../../../../base/browser/dom.js';
import { DisposableStore, IReference } from '../../../../base/common/lifecycle.js';
import * as marked from '../../../../base/common/marked/marked.js';
import { Schemas } from '../../../../base/common/network.js';
import { isEqual } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { ITextEditorModel, ITextModelService } from '../../../../editor/common/services/resolverService.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { EditorInputCapabilities, IUntypedEditorInput } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { EditorModel } from '../../../common/editor/editorModel.js';
import { markedGfmHeadingIdPlugin } from '../../markdown/browser/markedGfmHeadingIdPlugin.js';
import { moduleToContent } from '../common/walkThroughContentProvider.js';

class WalkThroughModel extends EditorModel {

	constructor(
		private mainRef: string,
		private snippetRefs: IReference<ITextEditorModel>[]
	) {
		super();
	}

	get main() {
		return this.mainRef;
	}

	get snippets() {
		return this.snippetRefs.map(snippet => snippet.object);
	}

	override dispose() {
		this.snippetRefs.forEach(ref => ref.dispose());
		super.dispose();
	}
}

export interface WalkThroughInputOptions {
	readonly typeId: string;
	readonly name: string;
	readonly description?: string;
	readonly resource: URI;
	readonly telemetryFrom: string;
	readonly onReady?: (container: HTMLElement, contentDisposables: DisposableStore) => void;
	readonly layout?: (dimension: Dimension) => void;
}

export class WalkThroughInput extends EditorInput {

	override get capabilities(): EditorInputCapabilities {
		return EditorInputCapabilities.Singleton | super.capabilities;
	}

	private promise: Promise<WalkThroughModel> | null = null;

	private maxTopScroll = 0;
	private maxBottomScroll = 0;

	get resource() { return this.options.resource; }

	constructor(
		private readonly options: WalkThroughInputOptions,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@ITextModelService private readonly textModelResolverService: ITextModelService
	) {
		super();
	}

	override get typeId(): string {
		return this.options.typeId;
	}

	override getName(): string {
		return this.options.name;
	}

	override getDescription(): string {
		return this.options.description || '';
	}

	getTelemetryFrom(): string {
		return this.options.telemetryFrom;
	}

	override getTelemetryDescriptor(): { [key: string]: unknown } {
		const descriptor = super.getTelemetryDescriptor();
		descriptor['target'] = this.getTelemetryFrom();
		/* __GDPR__FRAGMENT__
			"EditorTelemetryDescriptor" : {
				"target" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
			}
		*/
		return descriptor;
	}

	get onReady() {
		return this.options.onReady;
	}

	get layout() {
		return this.options.layout;
	}

	override resolve(): Promise<WalkThroughModel> {
		if (!this.promise) {
			this.promise = moduleToContent(this.instantiationService, this.options.resource)
				.then(content => {
					if (this.resource.path.endsWith('.html')) {
						return new WalkThroughModel(content, []);
					}

					const snippets: Promise<IReference<ITextEditorModel>>[] = [];
					let i = 0;
					const renderer = new marked.marked.Renderer();
					renderer.code = ({ lang }: marked.Tokens.Code) => {
						i++;
						const resource = this.options.resource.with({ scheme: Schemas.walkThroughSnippet, fragment: `${i}.${lang}` });
						snippets.push(this.textModelResolverService.createModelReference(resource));
						return `<div id="snippet-${resource.fragment}" class="walkThroughEditorContainer" ></div>`;
					};

					const m = new marked.Marked({ renderer }, markedGfmHeadingIdPlugin());
					content = m.parse(content, { async: false });
					return Promise.all(snippets)
						.then(refs => new WalkThroughModel(content, refs));
				});
		}

		return this.promise;
	}

	override matches(otherInput: EditorInput | IUntypedEditorInput): boolean {
		if (super.matches(otherInput)) {
			return true;
		}

		if (otherInput instanceof WalkThroughInput) {
			return isEqual(otherInput.options.resource, this.options.resource);
		}

		return false;
	}

	override dispose(): void {
		if (this.promise) {
			this.promise.then(model => model.dispose());
			this.promise = null;
		}

		super.dispose();
	}

	public relativeScrollPosition(topScroll: number, bottomScroll: number) {
		this.maxTopScroll = Math.max(this.maxTopScroll, topScroll);
		this.maxBottomScroll = Math.max(this.maxBottomScroll, bottomScroll);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/welcomeWalkthrough/browser/walkThroughPart.ts]---
Location: vscode-main/src/vs/workbench/contrib/welcomeWalkthrough/browser/walkThroughPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import '../common/walkThroughUtils.js';
import './media/walkThroughPart.css';
import { DomScrollableElement } from '../../../../base/browser/ui/scrollbar/scrollableElement.js';
import { EventType as TouchEventType, GestureEvent, Gesture } from '../../../../base/browser/touch.js';
import { ScrollbarVisibility } from '../../../../base/common/scrollable.js';
import * as strings from '../../../../base/common/strings.js';
import { URI } from '../../../../base/common/uri.js';
import { IDisposable, dispose, toDisposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { IEditorMemento, IEditorOpenContext } from '../../../common/editor.js';
import { EditorPane } from '../../../browser/parts/editor/editorPane.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { WalkThroughInput } from './walkThroughInput.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { ITextResourceConfigurationService } from '../../../../editor/common/services/textResourceConfiguration.js';
import { CodeEditorWidget } from '../../../../editor/browser/widget/codeEditor/codeEditorWidget.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { localize } from '../../../../nls.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { RawContextKey, IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { isObject } from '../../../../base/common/types.js';
import { CommandsRegistry } from '../../../../platform/commands/common/commands.js';
import { EditorOption, IEditorOptions as ICodeEditorOptions } from '../../../../editor/common/config/editorOptions.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { UILabelProvider } from '../../../../base/common/keybindingLabels.js';
import { OS, OperatingSystem } from '../../../../base/common/platform.js';
import { deepClone } from '../../../../base/common/objects.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { addDisposableListener, Dimension, isHTMLAnchorElement, isHTMLButtonElement, isHTMLElement, size } from '../../../../base/browser/dom.js';
import * as domSanitize from '../../../../base/browser/domSanitize.js';
import { IEditorGroup, IEditorGroupsService } from '../../../services/editor/common/editorGroupsService.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { IEditorOptions } from '../../../../platform/editor/common/editor.js';

export const WALK_THROUGH_FOCUS = new RawContextKey<boolean>('interactivePlaygroundFocus', false);

const UNBOUND_COMMAND = localize('walkThrough.unboundCommand', "unbound");
const WALK_THROUGH_EDITOR_VIEW_STATE_PREFERENCE_KEY = 'walkThroughEditorViewState';

interface IViewState {
	scrollTop: number;
	scrollLeft: number;
}

interface IWalkThroughEditorViewState {
	viewState: IViewState;
}

export class WalkThroughPart extends EditorPane {

	static readonly ID: string = 'workbench.editor.walkThroughPart';

	private readonly disposables = new DisposableStore();
	private contentDisposables: IDisposable[] = [];
	private content!: HTMLDivElement;
	private scrollbar!: DomScrollableElement;
	private editorFocus: IContextKey<boolean>;
	private lastFocus: HTMLElement | undefined;
	private size: Dimension | undefined;
	private editorMemento: IEditorMemento<IWalkThroughEditorViewState>;

	constructor(
		group: IEditorGroup,
		@ITelemetryService telemetryService: ITelemetryService,
		@IThemeService themeService: IThemeService,
		@ITextResourceConfigurationService textResourceConfigurationService: ITextResourceConfigurationService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IOpenerService private readonly openerService: IOpenerService,
		@IKeybindingService private readonly keybindingService: IKeybindingService,
		@IStorageService storageService: IStorageService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@INotificationService private readonly notificationService: INotificationService,
		@IExtensionService private readonly extensionService: IExtensionService,
		@IEditorGroupsService editorGroupService: IEditorGroupsService,
	) {
		super(WalkThroughPart.ID, group, telemetryService, themeService, storageService);
		this.editorFocus = WALK_THROUGH_FOCUS.bindTo(this.contextKeyService);
		this.editorMemento = this.getEditorMemento<IWalkThroughEditorViewState>(editorGroupService, textResourceConfigurationService, WALK_THROUGH_EDITOR_VIEW_STATE_PREFERENCE_KEY);
	}

	protected createEditor(container: HTMLElement): void {
		this.content = document.createElement('div');
		this.content.classList.add('welcomePageFocusElement');
		this.content.tabIndex = 0;
		this.content.style.outlineStyle = 'none';

		this.scrollbar = new DomScrollableElement(this.content, {
			horizontal: ScrollbarVisibility.Auto,
			vertical: ScrollbarVisibility.Auto
		});
		this.disposables.add(this.scrollbar);
		container.appendChild(this.scrollbar.getDomNode());

		this.registerFocusHandlers();
		this.registerClickHandler();

		this.disposables.add(this.scrollbar.onScroll(e => this.updatedScrollPosition()));
	}

	private updatedScrollPosition() {
		const scrollDimensions = this.scrollbar.getScrollDimensions();
		const scrollPosition = this.scrollbar.getScrollPosition();
		const scrollHeight = scrollDimensions.scrollHeight;
		if (scrollHeight && this.input instanceof WalkThroughInput) {
			const scrollTop = scrollPosition.scrollTop;
			const height = scrollDimensions.height;
			this.input.relativeScrollPosition(scrollTop / scrollHeight, (scrollTop + height) / scrollHeight);
		}
	}

	private onTouchChange(event: GestureEvent) {
		event.preventDefault();
		event.stopPropagation();

		const scrollPosition = this.scrollbar.getScrollPosition();
		this.scrollbar.setScrollPosition({ scrollTop: scrollPosition.scrollTop - event.translationY });
	}

	private addEventListener<K extends keyof HTMLElementEventMap, E extends HTMLElement>(element: E, type: K, listener: (this: E, ev: HTMLElementEventMap[K]) => any, useCapture?: boolean): IDisposable;
	private addEventListener<E extends HTMLElement>(element: E, type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): IDisposable;
	private addEventListener<E extends HTMLElement>(element: E, type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): IDisposable {
		element.addEventListener(type, listener, useCapture);
		return toDisposable(() => { element.removeEventListener(type, listener, useCapture); });
	}

	private registerFocusHandlers() {
		this.disposables.add(this.addEventListener(this.content, 'mousedown', e => {
			this.focus();
		}));
		this.disposables.add(this.addEventListener(this.content, 'focus', e => {
			this.editorFocus.set(true);
		}));
		this.disposables.add(this.addEventListener(this.content, 'blur', e => {
			this.editorFocus.reset();
		}));
		this.disposables.add(this.addEventListener(this.content, 'focusin', (e: FocusEvent) => {
			// Work around scrolling as side-effect of setting focus on the offscreen zone widget (#18929)
			if (isHTMLElement(e.target) && e.target.classList.contains('zone-widget-container')) {
				const scrollPosition = this.scrollbar.getScrollPosition();
				this.content.scrollTop = scrollPosition.scrollTop;
				this.content.scrollLeft = scrollPosition.scrollLeft;
			}
			if (isHTMLElement(e.target)) {
				this.lastFocus = e.target;
			}
		}));
	}

	private registerClickHandler() {
		this.content.addEventListener('click', event => {
			for (let node = event.target as HTMLElement; node; node = node.parentNode as HTMLElement) {
				if (isHTMLAnchorElement(node) && node.href) {
					// eslint-disable-next-line no-restricted-syntax
					const baseElement = node.ownerDocument.getElementsByTagName('base')[0] || this.window.location;
					if (baseElement && node.href.indexOf(baseElement.href) >= 0 && node.hash) {
						// eslint-disable-next-line no-restricted-syntax
						const scrollTarget = this.content.querySelector(node.hash);
						const innerContent = this.content.firstElementChild;
						if (scrollTarget && innerContent) {
							const targetTop = scrollTarget.getBoundingClientRect().top - 20;
							const containerTop = innerContent.getBoundingClientRect().top;
							this.scrollbar.setScrollPosition({ scrollTop: targetTop - containerTop });
						}
					} else {
						this.open(URI.parse(node.href));
					}
					event.preventDefault();
					break;
				} else if (isHTMLButtonElement(node)) {
					const href = node.getAttribute('data-href');
					if (href) {
						this.open(URI.parse(href));
					}
					break;
				} else if (node === event.currentTarget) {
					break;
				}
			}
		});
	}

	private open(uri: URI) {
		if (uri.scheme === 'command' && uri.path === 'git.clone' && !CommandsRegistry.getCommand('git.clone')) {
			this.notificationService.info(localize('walkThrough.gitNotFound', "It looks like Git is not installed on your system."));
			return;
		}
		this.openerService.open(this.addFrom(uri), { allowCommands: true });
	}

	private addFrom(uri: URI) {
		if (uri.scheme !== 'command' || !(this.input instanceof WalkThroughInput)) {
			return uri;
		}
		const query = uri.query ? JSON.parse(uri.query) : {};
		query.from = this.input.getTelemetryFrom();
		return uri.with({ query: JSON.stringify(query) });
	}

	layout(dimension: Dimension): void {
		this.size = dimension;
		size(this.content, dimension.width, dimension.height);
		this.updateSizeClasses();
		this.contentDisposables.forEach(disposable => {
			if (disposable instanceof CodeEditorWidget) {
				disposable.layout();
			}
		});
		const walkthroughInput = this.input instanceof WalkThroughInput && this.input;
		if (walkthroughInput && walkthroughInput.layout) {
			walkthroughInput.layout(dimension);
		}
		this.scrollbar.scanDomNode();
	}

	private updateSizeClasses() {
		const innerContent = this.content.firstElementChild;
		if (this.size && innerContent) {
			innerContent.classList.toggle('max-height-685px', this.size.height <= 685);
		}
	}

	override focus(): void {
		super.focus();

		let active = this.content.ownerDocument.activeElement;
		while (active && active !== this.content) {
			active = active.parentElement;
		}
		if (!active) {
			(this.lastFocus || this.content).focus();
		}
		this.editorFocus.set(true);
	}

	arrowUp() {
		const scrollPosition = this.scrollbar.getScrollPosition();
		this.scrollbar.setScrollPosition({ scrollTop: scrollPosition.scrollTop - this.getArrowScrollHeight() });
	}

	arrowDown() {
		const scrollPosition = this.scrollbar.getScrollPosition();
		this.scrollbar.setScrollPosition({ scrollTop: scrollPosition.scrollTop + this.getArrowScrollHeight() });
	}

	private getArrowScrollHeight() {
		let fontSize = this.configurationService.getValue('editor.fontSize');
		if (typeof fontSize !== 'number' || fontSize < 1) {
			fontSize = 12;
		}
		return 3 * (fontSize as number);
	}

	pageUp() {
		const scrollDimensions = this.scrollbar.getScrollDimensions();
		const scrollPosition = this.scrollbar.getScrollPosition();
		this.scrollbar.setScrollPosition({ scrollTop: scrollPosition.scrollTop - scrollDimensions.height });
	}

	pageDown() {
		const scrollDimensions = this.scrollbar.getScrollDimensions();
		const scrollPosition = this.scrollbar.getScrollPosition();
		this.scrollbar.setScrollPosition({ scrollTop: scrollPosition.scrollTop + scrollDimensions.height });
	}

	override setInput(input: WalkThroughInput, options: IEditorOptions | undefined, context: IEditorOpenContext, token: CancellationToken): Promise<void> {
		const store = new DisposableStore();
		this.contentDisposables.push(store);

		this.content.innerText = '';

		return super.setInput(input, options, context, token)
			.then(async () => {
				if (input.resource.path.endsWith('.md')) {
					await this.extensionService.whenInstalledExtensionsRegistered();
				}
				return input.resolve();
			})
			.then(model => {
				if (token.isCancellationRequested) {
					return;
				}

				const content = model.main;
				if (!input.resource.path.endsWith('.md')) {
					this.safeSetInnerHtml(this.content, content);

					this.updateSizeClasses();
					this.decorateContent();
					this.contentDisposables.push(this.keybindingService.onDidUpdateKeybindings(() => this.decorateContent()));
					input.onReady?.(this.content.firstElementChild as HTMLElement, store);
					this.scrollbar.scanDomNode();
					this.loadTextEditorViewState(input);
					this.updatedScrollPosition();
					return;
				}

				const innerContent = document.createElement('div');
				innerContent.classList.add('walkThroughContent'); // only for markdown files
				const markdown = this.expandMacros(content);
				this.safeSetInnerHtml(innerContent, markdown);
				this.content.appendChild(innerContent);

				model.snippets.forEach((snippet, i) => {
					const model = snippet.textEditorModel;
					if (!model) {
						return;
					}
					const id = `snippet-${model.uri.fragment}`;
					// eslint-disable-next-line no-restricted-syntax
					const div = innerContent.querySelector(`#${id.replace(/[\\.]/g, '\\$&')}`) as HTMLElement;

					const options = this.getEditorOptions(model.getLanguageId());
					const telemetryData = {
						target: this.input instanceof WalkThroughInput ? this.input.getTelemetryFrom() : undefined,
						snippet: i
					};
					const editor = this.instantiationService.createInstance(CodeEditorWidget, div, options, {
						telemetryData: telemetryData
					});
					editor.setModel(model);
					this.contentDisposables.push(editor);

					const updateHeight = (initial: boolean) => {
						const position = editor.getPosition();
						const lineHeight = position ? editor.getLineHeightForPosition(position) : editor.getOption(EditorOption.lineHeight);
						const height = `${Math.max(model.getLineCount() + 1, 4) * lineHeight}px`;
						if (div.style.height !== height) {
							div.style.height = height;
							editor.layout();
							if (!initial) {
								this.scrollbar.scanDomNode();
							}
						}
					};
					updateHeight(true);
					this.contentDisposables.push(editor.onDidChangeModelContent(() => updateHeight(false)));
					this.contentDisposables.push(editor.onDidChangeCursorPosition(e => {
						const innerContent = this.content.firstElementChild;
						if (innerContent) {
							const targetTop = div.getBoundingClientRect().top;
							const containerTop = innerContent.getBoundingClientRect().top;
							const lineHeight = editor.getLineHeightForPosition(e.position);
							const lineTop = (targetTop + (e.position.lineNumber - 1) * lineHeight) - containerTop;
							const lineBottom = lineTop + lineHeight;
							const scrollDimensions = this.scrollbar.getScrollDimensions();
							const scrollPosition = this.scrollbar.getScrollPosition();
							const scrollTop = scrollPosition.scrollTop;
							const height = scrollDimensions.height;
							if (scrollTop > lineTop) {
								this.scrollbar.setScrollPosition({ scrollTop: lineTop });
							} else if (scrollTop < lineBottom - height) {
								this.scrollbar.setScrollPosition({ scrollTop: lineBottom - height });
							}
						}
					}));

					this.contentDisposables.push(this.configurationService.onDidChangeConfiguration(e => {
						if (e.affectsConfiguration('editor') && snippet.textEditorModel) {
							editor.updateOptions(this.getEditorOptions(snippet.textEditorModel.getLanguageId()));
						}
					}));
				});
				this.updateSizeClasses();
				this.multiCursorModifier();
				this.contentDisposables.push(this.configurationService.onDidChangeConfiguration(e => {
					if (e.affectsConfiguration('editor.multiCursorModifier')) {
						this.multiCursorModifier();
					}
				}));
				input.onReady?.(innerContent, store);
				this.scrollbar.scanDomNode();
				this.loadTextEditorViewState(input);
				this.updatedScrollPosition();
				this.contentDisposables.push(Gesture.addTarget(innerContent));
				this.contentDisposables.push(addDisposableListener(innerContent, TouchEventType.Change, e => this.onTouchChange(e as GestureEvent)));
			});
	}

	private safeSetInnerHtml(node: HTMLElement, content: string) {
		domSanitize.safeSetInnerHtml(node, content, {
			allowedAttributes: {
				augment: [
					'id',
					'class',
					'style',
					'data-command',
					'data-href',
				]
			}
		});
	}

	private getEditorOptions(language: string): ICodeEditorOptions {
		const config = deepClone(this.configurationService.getValue<IEditorOptions>('editor', { overrideIdentifier: language }));
		return {
			...isObject(config) ? config : Object.create(null),
			scrollBeyondLastLine: false,
			scrollbar: {
				verticalScrollbarSize: 14,
				horizontal: 'auto',
				useShadows: true,
				verticalHasArrows: false,
				horizontalHasArrows: false,
				alwaysConsumeMouseWheel: false
			},
			overviewRulerLanes: 3,
			fixedOverflowWidgets: false,
			lineNumbersMinChars: 1,
			minimap: { enabled: false },
		};
	}

	private expandMacros(input: string) {
		return input.replace(/kb\(([a-z.\d\-]+)\)/gi, (match: string, kb: string) => {
			const keybinding = this.keybindingService.lookupKeybinding(kb);
			const shortcut = keybinding ? keybinding.getLabel() || '' : UNBOUND_COMMAND;
			return `<span class="shortcut">${strings.escape(shortcut)}</span>`;
		});
	}

	private decorateContent() {
		// eslint-disable-next-line no-restricted-syntax
		const keys = this.content.querySelectorAll('.shortcut[data-command]');
		Array.prototype.forEach.call(keys, (key: Element) => {
			const command = key.getAttribute('data-command');
			const keybinding = command && this.keybindingService.lookupKeybinding(command);
			const label = keybinding ? keybinding.getLabel() || '' : UNBOUND_COMMAND;
			while (key.firstChild) {
				key.firstChild.remove();
			}
			key.appendChild(document.createTextNode(label));
		});
		// eslint-disable-next-line no-restricted-syntax
		const ifkeys = this.content.querySelectorAll('.if_shortcut[data-command]');
		Array.prototype.forEach.call(ifkeys, (key: HTMLElement) => {
			const command = key.getAttribute('data-command');
			const keybinding = command && this.keybindingService.lookupKeybinding(command);
			key.style.display = !keybinding ? 'none' : '';
		});
	}

	private multiCursorModifier() {
		const labels = UILabelProvider.modifierLabels[OS];
		const value = this.configurationService.getValue('editor.multiCursorModifier');
		const modifier = labels[value === 'ctrlCmd' ? (OS === OperatingSystem.Macintosh ? 'metaKey' : 'ctrlKey') : 'altKey'];
		// eslint-disable-next-line no-restricted-syntax
		const keys = this.content.querySelectorAll('.multi-cursor-modifier');
		Array.prototype.forEach.call(keys, (key: Element) => {
			while (key.firstChild) {
				key.firstChild.remove();
			}
			key.appendChild(document.createTextNode(modifier));
		});
	}

	private saveTextEditorViewState(input: WalkThroughInput): void {
		const scrollPosition = this.scrollbar.getScrollPosition();

		this.editorMemento.saveEditorState(this.group, input, {
			viewState: {
				scrollTop: scrollPosition.scrollTop,
				scrollLeft: scrollPosition.scrollLeft
			}
		});
	}

	private loadTextEditorViewState(input: WalkThroughInput) {
		const state = this.editorMemento.loadEditorState(this.group, input);
		if (state) {
			this.scrollbar.setScrollPosition(state.viewState);
		}
	}

	public override clearInput(): void {
		if (this.input instanceof WalkThroughInput) {
			this.saveTextEditorViewState(this.input);
		}
		this.contentDisposables = dispose(this.contentDisposables);
		super.clearInput();
	}

	protected override saveState(): void {
		if (this.input instanceof WalkThroughInput) {
			this.saveTextEditorViewState(this.input);
		}

		super.saveState();
	}

	override dispose(): void {
		this.editorFocus.reset();
		this.contentDisposables = dispose(this.contentDisposables);
		this.disposables.dispose();
		super.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/welcomeWalkthrough/browser/editor/editorWalkThrough.ts]---
Location: vscode-main/src/vs/workbench/contrib/welcomeWalkthrough/browser/editor/editorWalkThrough.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import content from './vs_code_editor_walkthrough.js';
import { localize, localize2 } from '../../../../../nls.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { IInstantiationService, ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { WalkThroughInput, WalkThroughInputOptions } from '../walkThroughInput.js';
import { FileAccess, Schemas } from '../../../../../base/common/network.js';
import { IEditorSerializer } from '../../../../common/editor.js';
import { EditorInput } from '../../../../common/editor/editorInput.js';
import { Action2 } from '../../../../../platform/actions/common/actions.js';
import { Categories } from '../../../../../platform/action/common/actionCommonCategories.js';
import { walkThroughContentRegistry } from '../../common/walkThroughContentProvider.js';

walkThroughContentRegistry.registerProvider('vs/workbench/contrib/welcomeWalkthrough/browser/editor/vs_code_editor_walkthrough', content);

const typeId = 'workbench.editors.walkThroughInput';
const inputOptions: WalkThroughInputOptions = {
	typeId,
	name: localize('editorWalkThrough.title', "Editor Playground"),
	resource: FileAccess.asBrowserUri('vs/workbench/contrib/welcomeWalkthrough/browser/editor/vs_code_editor_walkthrough.md')
		.with({
			scheme: Schemas.walkThrough,
			query: JSON.stringify({ moduleId: 'vs/workbench/contrib/welcomeWalkthrough/browser/editor/vs_code_editor_walkthrough' })
		}),
	telemetryFrom: 'walkThrough'
};

export class EditorWalkThroughAction extends Action2 {

	public static readonly ID = 'workbench.action.showInteractivePlayground';
	public static readonly LABEL = localize2('editorWalkThrough', 'Interactive Editor Playground');

	constructor() {
		super({
			id: EditorWalkThroughAction.ID,
			title: EditorWalkThroughAction.LABEL,
			category: Categories.Help,
			f1: true,
			metadata: {
				description: localize2('editorWalkThroughMetadata', "Opens an interactive playground for learning about the editor.")
			}
		});
	}

	public override run(serviceAccessor: ServicesAccessor): Promise<void> {
		const editorService = serviceAccessor.get(IEditorService);
		const instantiationService = serviceAccessor.get(IInstantiationService);
		const input = instantiationService.createInstance(WalkThroughInput, inputOptions);
		// TODO @lramos15 adopt the resolver here
		return editorService.openEditor(input, { pinned: true })
			.then(() => void (0));
	}
}

export class EditorWalkThroughInputSerializer implements IEditorSerializer {

	static readonly ID = typeId;

	public canSerialize(editorInput: EditorInput): boolean {
		return true;
	}

	public serialize(editorInput: EditorInput): string {
		return '';
	}

	public deserialize(instantiationService: IInstantiationService): WalkThroughInput {
		return instantiationService.createInstance(WalkThroughInput, inputOptions);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/welcomeWalkthrough/browser/editor/vs_code_editor_walkthrough.ts]---
Location: vscode-main/src/vs/workbench/contrib/welcomeWalkthrough/browser/editor/vs_code_editor_walkthrough.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as platform from '../../../../../base/common/platform.js';
import { ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { IWorkbenchEnvironmentService } from '../../../../services/environment/common/environmentService.js';

export default function content(accessor: ServicesAccessor) {
	const isServerless = platform.isWeb && !accessor.get(IWorkbenchEnvironmentService).remoteAuthority;
	return `
## Interactive Editor Playground
The core editor in VS Code is packed with features.  This page highlights a number of them and lets you interactively try them out through the use of a number of embedded editors.  For full details on the editor features for VS Code and more head over to our [documentation](https://code.visualstudio.com/docs).

* [Multi-cursor Editing](#multi-cursor-editing) - block selection, select all occurrences, add additional cursors and more.
* [IntelliSense](#intellisense) - get code assistance and parameter suggestions for your code and external modules.
* [Line Actions](#line-actions) - quickly move lines around to re-order your code.${!isServerless ? `
* [Rename Refactoring](#rename-refactoring) - quickly rename symbols across your code base.` : ''}
* [Formatting](#formatting) - keep your code looking great with inbuilt document & selection formatting.
* [Code Folding](#code-folding) - focus on the most relevant parts of your code by folding other areas.
* [Errors and Warnings](#errors-and-warnings) - see errors and warnings as you type.
* [Snippets](#snippets) - spend less time typing with snippets.
* [Emmet](#emmet) - integrated Emmet support takes HTML and CSS editing to the next level.
* [JavaScript Type Checking](#javascript-type-checking) - perform type checking on your JavaScript file using TypeScript with zero configuration.



### Multi-Cursor Editing
Using multiple cursors allows you to edit multiple parts of the document at once, greatly improving your productivity.  Try the following actions in the code block below:
1. Box Selection - press <span class="mac-only windows-only">any combination of kb(cursorColumnSelectDown), kb(cursorColumnSelectRight), kb(cursorColumnSelectUp), kb(cursorColumnSelectLeft) to select a block of text. You can also press</span> <span class="shortcut mac-only">|⇧⌥|</span><span class="shortcut windows-only linux-only">|Shift+Alt|</span> while selecting text with the mouse or drag-select using the middle mouse button.
2. Add a cursor - press kb(editor.action.insertCursorAbove) to add a new cursor above, or kb(editor.action.insertCursorBelow) to add a new cursor below. You can also use your mouse with <span class="shortcut"><span class="multi-cursor-modifier"></span>+Click</span> to add a cursor anywhere.
3. Create cursors on all occurrences of a string - select one instance of a string e.g. |background-color| and press kb(editor.action.selectHighlights).  Now you can replace all instances by simply typing.

That is the tip of the iceberg for multi-cursor editing. Have a look at the selection menu and our handy [keyboard reference guide](command:workbench.action.keybindingsReference) for additional actions.

|||css
#p1 {background-color: #ff0000;}                /* red in HEX format */
#p2 {background-color: hsl(120, 100%, 50%);}    /* green in HSL format */
#p3 {background-color: rgba(0, 4, 255, 0.733);} /* blue with alpha channel in RGBA format */
|||

> **CSS Tip:** You may have noticed in the example above we also provide color swatches inline for CSS, additionally if you hover over an element such as |#p1| we will show how this is represented in HTML.  These swatches also act as color pickers that allow you to easily change a color value.  A simple example of some language-specific editor features.

### IntelliSense

Visual Studio Code comes with the powerful IntelliSense for JavaScript and TypeScript pre-installed. In the below example, position the text cursor right after the dot and press kb(editor.action.triggerSuggest) to invoke IntelliSense.  Notice how the suggestions come from the Canvas API.

|||js
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

context.strokeStyle = 'blue';
context.
|||

>**Tip:** While we ship JavaScript and TypeScript support out of the box other languages can be upgraded with better IntelliSense through one of the many [extensions](command:workbench.extensions.action.showPopularExtensions).


### Line Actions
Since it's very common to work with the entire text in a line we provide a set of useful shortcuts to help with this.
1. <span class="mac-only windows-only">Copy a line and insert it above or below the current position with kb(editor.action.copyLinesDownAction) or kb(editor.action.copyLinesUpAction) respectively.</span><span class="linux-only">Copy the entire current line when no text is selected with kb(editor.action.clipboardCopyAction).</span>
2. Move an entire line or selection of lines up or down with kb(editor.action.moveLinesUpAction) and kb(editor.action.moveLinesDownAction) respectively.
3. Delete the entire line with kb(editor.action.deleteLines).

|||json
{
	"name": "John",
	"age": 31,
	"city": "New York"
}
|||

>**Tip:** Another very common task is to comment out a block of code - you can toggle commenting by pressing kb(editor.action.commentLine).


${!isServerless ? `
### Rename Refactoring
It's easy to rename a symbol such as a function name or variable name.  Hit kb(editor.action.rename) while in the symbol |Book| to rename all instances - this will occur across all files in a project. You also have |Rename Symbol| in the right-click context menu.

|||js
// Reference the function
new Book("War of the Worlds", "H G Wells");
new Book("The Martian", "Andy Weir");

/**
 * Represents a book.
 *
 * @param {string} title Title of the book
 * @param {string} author Who wrote the book
 */
function Book(title, author) {
	this.title = title;
	this.author = author;
}
|||

> **JSDoc Tip:** VS Code's IntelliSense uses JSDoc comments to provide richer suggestions. The types and documentation from JSDoc comments show up when you hover over a reference to |Book| or in IntelliSense when you create a new instance of |Book|.

` : ''}
### Formatting
Keeping your code looking great is hard without a good formatter.  Luckily it's easy to format content, either for the entire document with kb(editor.action.formatDocument) or for the current selection with kb(editor.action.formatSelection).  Both of these options are also available through the right-click context menu.

|||js
const cars = ["🚗", "🚙", "🚕"];

for (const car of cars){
	// Drive the car
	console.log(|This is the car \${car}|);
}
|||

>**Tip:** Additional formatters are available in the [extension gallery](command:workbench.extensions.action.showPopularExtensions).  Formatting support can also be configured via [settings](command:workbench.action.openGlobalSettings) e.g. enabling |editor.formatOnSave|.


### Code Folding
In a large file it can often be useful to collapse sections of code to increase readability.  To do this, you can simply press kb(editor.fold) to fold or press kb(editor.unfold) to unfold the ranges at the current cursor position.  Folding can also be done with the down and right angle bracket icons in the left gutter.  To fold all sections use kb(editor.foldAll) or to unfold all use kb(editor.unfoldAll).

|||html
<div>
	<header>
		<ul>
			<li><a href=""></a></li>
			<li><a href=""></a></li>
		</ul>
	</header>
	<footer>
		<p></p>
	</footer>
</div>
|||

>**Tip:** Folding is based on indentation and as a result can apply to all languages.  Simply indent your code to create a foldable section you can fold a certain number of levels with shortcuts like kb(editor.foldLevel1) through to kb(editor.foldLevel5).

### Errors and Warnings
Errors and warnings are highlighted as you edit your code with squiggles.  In the sample below you can see a number of syntax errors.  By pressing kb(editor.action.marker.nextInFiles) you can navigate across them in sequence and see the detailed error message.  As you correct them the squiggles and scrollbar indicators will update.

|||js
// This code has a few syntax errors
Console.log(add(1, 1.5));


function Add(a, b)
	return a + b;
}
|||


###  Snippets
You can greatly accelerate your editing through the use of snippets.  Simply start typing |try| and select |trycatch| from the suggestion list and press kb(insertSnippet) to create a |try|->|catch| block.  Your cursor will be placed on the text |error| for easy editing.  If more than one parameter exists then press kb(jumpToNextSnippetPlaceholder) to jump to it.

|||js

|||

>**Tip:** The [extension gallery](command:workbench.extensions.action.showPopularExtensions) includes snippets for almost every framework and language imaginable.  You can also create your own [user-defined snippets](command:workbench.action.openSnippets).


### Emmet
Emmet takes the snippets idea to a whole new level: you can type CSS-like expressions that can be dynamically parsed, and produce output depending on what you type in the abbreviation. Try it by selecting |Emmet: Expand Abbreviation| from the |Edit| menu with the cursor at the end of a valid Emmet abbreviation or snippet and the expansion will occur.

|||html
ul>li.item$*5
|||

>**Tip:** The [Emmet cheat sheet](https://docs.emmet.io/cheat-sheet/) is a great source of Emmet syntax suggestions. To expand Emmet abbreviations and snippets using the |tab| key use the |emmet.triggerExpansionOnTab| [setting](command:workbench.action.openGlobalSettings). Check out the docs on [Emmet in VS Code](https://code.visualstudio.com/docs/editor/emmet) to learn more.



### JavaScript Type Checking
Sometimes type checking your JavaScript code can help you spot mistakes you might have not caught otherwise. You can run the TypeScript type checker against your existing JavaScript code by simply adding a |// @ts-check| comment to the top of your file.

|||js
// @ts-nocheck

let easy = true;
easy = 42;
|||

>**Tip:** You can also enable the checks workspace or application wide by adding |"js/ts.implicitProjectConfig.checkJs": true| to your workspace or user settings and explicitly ignoring files or lines using |// @ts-nocheck| and |// @ts-expect-error|. Check out the docs on [JavaScript in VS Code](https://code.visualstudio.com/docs/languages/javascript) to learn more.


## Thanks!
Well if you have got this far then you will have touched on some of the editing features in Visual Studio Code.  But don't stop now :)  We have lots of additional [documentation](https://code.visualstudio.com/docs), [introductory videos](https://code.visualstudio.com/docs/getstarted/introvideos) and [tips and tricks](https://go.microsoft.com/fwlink/?linkid=852118) for the product that will help you learn how to use it.  And while you are here, here are a few additional things you can try:
- Open the Integrated Terminal by pressing kb(workbench.action.terminal.toggleTerminal), then see what's possible by [reviewing the terminal documentation](https://code.visualstudio.com/docs/editor/integrated-terminal)
- Work with version control by pressing kb(workbench.view.scm). Understand how to stage, commit, change branches, and view diffs and more by reviewing the [version control documentation](https://code.visualstudio.com/docs/editor/versioncontrol)
- Browse thousands of extensions in our integrated gallery by pressing kb(workbench.view.extensions). The [documentation](https://code.visualstudio.com/docs/editor/extension-gallery) will show you how to see the most popular extensions, disable installed ones and more.

That's all for now,

Happy Coding! 🎉

`.replace(/\|/g, '`');
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/welcomeWalkthrough/browser/media/walkThroughPart.css]---
Location: vscode-main/src/vs/workbench/contrib/welcomeWalkthrough/browser/media/walkThroughPart.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-workbench .part.editor > .content .walkThroughContent {
	box-sizing: border-box;
	padding: 10px 20px;
	line-height: 22px;
	height: inherit;
	user-select: initial;
	-webkit-user-select: initial;
}

.monaco-workbench .part.editor > .content .walkThroughContent img {
	max-width: 100%;
	max-height: 100%;
}

.monaco-workbench .part.editor > .content .walkThroughContent a {
	text-decoration: var(--text-link-decoration);
}

.monaco-workbench .part.editor > .content .walkThroughContent a:focus,
.monaco-workbench .part.editor > .content .walkThroughContent input:focus,
.monaco-workbench .part.editor > .content .walkThroughContent select:focus,
.monaco-workbench .part.editor > .content .walkThroughContent textarea:focus {
	outline: 1px solid -webkit-focus-ring-color;
	outline-offset: -1px;
}

.monaco-workbench .part.editor > .content .walkThroughContent hr {
	border: 0;
	height: 2px;
	border-bottom: 2px solid;
}

.monaco-workbench .part.editor > .content .walkThroughContent h1,
.monaco-workbench .part.editor > .content .walkThroughContent h2,
.monaco-workbench .part.editor > .content .walkThroughContent h3 {
	font-weight: lighter;
	margin-top: 20px;
	margin-bottom: 10px;
}

.monaco-workbench .part.editor > .content .walkThroughContent h1 {
	padding-bottom: 0.3em;
	line-height: 1.2;
	border-bottom-width: 1px;
	border-bottom-style: solid;
	font-size: 40px;
	margin-bottom: 15px;
}

.monaco-workbench .part.editor > .content .walkThroughContent h2 {
	font-size: 30px;
	margin-top: 30px;
}

.monaco-workbench .part.editor > .content .walkThroughContent h3 {
	font-size: 22px;
}

.monaco-workbench .part.editor > .content .walkThroughContent h4 {
	font-size: 12px;
	text-transform: uppercase;
	margin-top: 30px;
	margin-bottom: 10px;
}

.monaco-workbench .part.editor > .content .walkThroughContent a:hover {
	text-decoration: underline;
}

.monaco-workbench .part.editor > .content .walkThroughContent table {
	border-collapse: collapse;
}

.monaco-workbench .part.editor > .content .walkThroughContent table > thead > tr > th {
	text-align: left;
	border-bottom: 1px solid;
}

.monaco-workbench .part.editor > .content .walkThroughContent table > thead > tr > th,
.monaco-workbench .part.editor > .content .walkThroughContent table > thead > tr > td,
.monaco-workbench .part.editor > .content .walkThroughContent table > tbody > tr > th,
.monaco-workbench .part.editor > .content .walkThroughContent table > tbody > tr > td {
	padding: 5px 10px;
}

.monaco-workbench .part.editor > .content .walkThroughContent table > tbody > tr + tr > td {
	border-top: 1px solid;
}

.monaco-workbench .part.editor > .content .walkThroughContent code,
.monaco-workbench .part.editor > .content .walkThroughContent .shortcut {
	font-family: var(--monaco-monospace-font);
	font-size: 14px;
	line-height: 19px;
}

.monaco-workbench .part.editor > .content .walkThroughContent blockquote {
	margin: 0 7px 0 5px;
	padding: 0 16px 0 10px;
	border-left: 5px solid;
	background: var(--vscode-textBlockQuote-background);
	border-color: var(--vscode-textBlockQuote-border);
}

.monaco-workbench .part.editor > .content .walkThroughContent .monaco-tokenized-source {
	white-space: pre;
}

.file-icons-enabled .show-file-icons .vs_code_editor_walkthrough\.md-name-file-icon.md-ext-file-icon.ext-file-icon.markdown-lang-file-icon.file-icon::before {
	content: ' ';
	background-image: url('../../../../browser/media/code-icon.svg');
}

.monaco-workbench .part.editor > .content .walkThroughContent .mac-only,
.monaco-workbench .part.editor > .content .walkThroughContent .windows-only,
.monaco-workbench .part.editor > .content .walkThroughContent .linux-only {
	display: none;
}
.monaco-workbench.mac .part.editor > .content .walkThroughContent .mac-only {
	display: initial;
}
.monaco-workbench.windows .part.editor > .content .walkThroughContent .windows-only {
	display: initial;
}
.monaco-workbench.linux .part.editor > .content .walkThroughContent .linux-only {
	display: initial;
}

.monaco-workbench.hc-black .part.editor > .content .walkThroughContent .monaco-editor,
.monaco-workbench.hc-light .part.editor > .content .walkThroughContent .monaco-editor {
	border-width: 1px;
	border-style: solid;
}

.monaco-workbench .part.editor > .content .walkThroughContent a[href] {
	color: var(--vscode-textLink-foreground);
}

.monaco-workbench .part.editor > .content .walkThroughContent a:hover,
.monaco-workbench .part.editor > .content .walkThroughContent a[href]:active {
	color: var(--vscode-textLink-activeForeground);
}

.monaco-workbench .part.editor > .content .walkThroughContent a[href]:focus {
	outline-color: var(--vscode-focusBorder);
}

.monaco-workbench .part.editor > .content .walkThroughContent code,
.monaco-workbench .part.editor > .content .walkThroughContent .shortcut {
	color: var(--vscode-textPreformat-foreground);
	background-color: var(--vscode-textPreformat-background);
	border-radius: 3px;
	border: 1px solid var(--vscode-textPreformat-border);
}

.monaco-workbench .part.editor > .content .walkThroughContent .monaco-editor {
	border-color: var(--vscode-contrastBorder);
}

.monaco-workbench .part.editor > .content .walkThroughContent .monaco-editor-background,
.monaco-workbench .part.editor > .content .walkThroughContent .margin-view-overlays {
	background: var(--vscode-walkThrough-embeddedEditorBackground);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/welcomeWalkthrough/common/walkThroughContentProvider.ts]---
Location: vscode-main/src/vs/workbench/contrib/welcomeWalkthrough/common/walkThroughContentProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';
import { ITextModelService, ITextModelContentProvider } from '../../../../editor/common/services/resolverService.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { ITextModel, DefaultEndOfLine, EndOfLinePreference, ITextBufferFactory } from '../../../../editor/common/model.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import * as marked from '../../../../base/common/marked/marked.js';
import { Schemas } from '../../../../base/common/network.js';
import { Range } from '../../../../editor/common/core/range.js';
import { createTextBufferFactory } from '../../../../editor/common/model/textModel.js';
import { assertReturnsDefined } from '../../../../base/common/types.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';

interface IWalkThroughContentProvider {
	(accessor: ServicesAccessor): string;
}

class WalkThroughContentProviderRegistry {

	private readonly providers = new Map<string, IWalkThroughContentProvider>();

	registerProvider(moduleId: string, provider: IWalkThroughContentProvider): void {
		this.providers.set(moduleId, provider);
	}

	getProvider(moduleId: string): IWalkThroughContentProvider | undefined {
		return this.providers.get(moduleId);
	}
}
export const walkThroughContentRegistry = new WalkThroughContentProviderRegistry();

export async function moduleToContent(instantiationService: IInstantiationService, resource: URI): Promise<string> {
	if (!resource.query) {
		throw new Error('Walkthrough: invalid resource');
	}

	const query = JSON.parse(resource.query);
	if (!query.moduleId) {
		throw new Error('Walkthrough: invalid resource');
	}

	const provider = walkThroughContentRegistry.getProvider(query.moduleId);
	if (!provider) {
		throw new Error(`Walkthrough: no provider registered for ${query.moduleId}`);
	}

	return instantiationService.invokeFunction(provider);
}

export class WalkThroughSnippetContentProvider implements ITextModelContentProvider, IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.walkThroughSnippetContentProvider';

	private loads = new Map<string, Promise<ITextBufferFactory>>();

	constructor(
		@ITextModelService private readonly textModelResolverService: ITextModelService,
		@ILanguageService private readonly languageService: ILanguageService,
		@IModelService private readonly modelService: IModelService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		this.textModelResolverService.registerTextModelContentProvider(Schemas.walkThroughSnippet, this);
	}

	private async textBufferFactoryFromResource(resource: URI): Promise<ITextBufferFactory> {
		let ongoing = this.loads.get(resource.toString());
		if (!ongoing) {
			ongoing = moduleToContent(this.instantiationService, resource)
				.then(content => createTextBufferFactory(content))
				.finally(() => this.loads.delete(resource.toString()));
			this.loads.set(resource.toString(), ongoing);
		}
		return ongoing;
	}

	public async provideTextContent(resource: URI): Promise<ITextModel> {
		const factory = await this.textBufferFactoryFromResource(resource.with({ fragment: '' }));
		let codeEditorModel = this.modelService.getModel(resource);
		if (!codeEditorModel) {
			const j = parseInt(resource.fragment);
			let i = 0;
			const renderer = new marked.marked.Renderer();
			renderer.code = ({ text, lang }: marked.Tokens.Code) => {
				i++;
				const languageId = typeof lang === 'string' ? this.languageService.getLanguageIdByLanguageName(lang) || '' : '';
				const languageSelection = this.languageService.createById(languageId);
				// Create all models for this resource in one go... we'll need them all and we don't want to re-parse markdown each time
				const model = this.modelService.createModel(text, languageSelection, resource.with({ fragment: `${i}.${lang}` }));
				if (i === j) { codeEditorModel = model; }
				return '';
			};
			const textBuffer = factory.create(DefaultEndOfLine.LF).textBuffer;
			const lineCount = textBuffer.getLineCount();
			const range = new Range(1, 1, lineCount, textBuffer.getLineLength(lineCount) + 1);
			const markdown = textBuffer.getValueInRange(range, EndOfLinePreference.TextDefined);
			marked.marked(markdown, { renderer });
		}
		return assertReturnsDefined(codeEditorModel);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/welcomeWalkthrough/common/walkThroughUtils.ts]---
Location: vscode-main/src/vs/workbench/contrib/welcomeWalkthrough/common/walkThroughUtils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerColor } from '../../../../platform/theme/common/colorRegistry.js';
import { localize } from '../../../../nls.js';
import { Color, RGBA } from '../../../../base/common/color.js';

export const embeddedEditorBackground = registerColor('walkThrough.embeddedEditorBackground', { dark: new Color(new RGBA(0, 0, 0, .4)), light: '#f4f4f4', hcDark: null, hcLight: null }, localize('walkThrough.embeddedEditorBackground', 'Background color for the embedded editors on the Interactive Playground.'));
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/workspace/browser/workspace.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/workspace/browser/workspace.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/workspaceTrustEditor.css';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { Disposable, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { localize, localize2 } from '../../../../nls.js';
import { Action2, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { ConfigurationScope, Extensions as ConfigurationExtensions, IConfigurationRegistry } from '../../../../platform/configuration/common/configurationRegistry.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { Severity } from '../../../../platform/notification/common/notification.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IWorkspaceTrustEnablementService, IWorkspaceTrustManagementService, IWorkspaceTrustRequestService, WorkspaceTrustUriResponse } from '../../../../platform/workspace/common/workspaceTrust.js';
import { Extensions as WorkbenchExtensions, IWorkbenchContribution, IWorkbenchContributionsRegistry, WorkbenchPhase, registerWorkbenchContribution2 } from '../../../common/contributions.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { ContextKeyExpr, IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IStatusbarEntry, IStatusbarEntryAccessor, IStatusbarService, StatusbarAlignment } from '../../../services/statusbar/browser/statusbar.js';
import { IEditorPaneRegistry, EditorPaneDescriptor } from '../../../browser/editor.js';
import { shieldIcon, WorkspaceTrustEditor } from './workspaceTrustEditor.js';
import { WorkspaceTrustEditorInput } from '../../../services/workspaces/browser/workspaceTrustEditorInput.js';
import { WORKSPACE_TRUST_BANNER, WORKSPACE_TRUST_EMPTY_WINDOW, WORKSPACE_TRUST_ENABLED, WORKSPACE_TRUST_STARTUP_PROMPT, WORKSPACE_TRUST_UNTRUSTED_FILES } from '../../../services/workspaces/common/workspaceTrust.js';
import { IEditorSerializer, IEditorFactoryRegistry, EditorExtensions } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { isEmptyWorkspaceIdentifier, ISingleFolderWorkspaceIdentifier, isSingleFolderWorkspaceIdentifier, IWorkspaceContextService, IWorkspaceFoldersWillChangeEvent, toWorkspaceIdentifier, WorkbenchState } from '../../../../platform/workspace/common/workspace.js';
import { dirname, resolve } from '../../../../base/common/path.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IMarkdownString, MarkdownString } from '../../../../base/common/htmlContent.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IHostService } from '../../../services/host/browser/host.js';
import { IBannerItem, IBannerService } from '../../../services/banner/browser/bannerService.js';
import { isVirtualWorkspace } from '../../../../platform/workspace/common/virtualWorkspace.js';
import { LIST_WORKSPACE_UNSUPPORTED_EXTENSIONS_COMMAND_ID } from '../../extensions/common/extensions.js';
import { IWorkbenchEnvironmentService } from '../../../services/environment/common/environmentService.js';
import { WORKSPACE_TRUST_SETTING_TAG } from '../../preferences/common/preferences.js';
import { IPreferencesService } from '../../../services/preferences/common/preferences.js';
import { ILabelService, Verbosity } from '../../../../platform/label/common/label.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { MANAGE_TRUST_COMMAND_ID, WorkspaceTrustContext } from '../common/workspace.js';
import { isWeb } from '../../../../base/common/platform.js';
import { IRemoteAgentService } from '../../../services/remote/common/remoteAgentService.js';
import { securityConfigurationNodeBase } from '../../../common/configuration.js';
import { basename, dirname as uriDirname } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { IFileService } from '../../../../platform/files/common/files.js';

const BANNER_RESTRICTED_MODE = 'workbench.banner.restrictedMode';
const STARTUP_PROMPT_SHOWN_KEY = 'workspace.trust.startupPrompt.shown';
const BANNER_RESTRICTED_MODE_DISMISSED_KEY = 'workbench.banner.restrictedMode.dismissed';

export class WorkspaceTrustContextKeys extends Disposable implements IWorkbenchContribution {

	private readonly _ctxWorkspaceTrustEnabled: IContextKey<boolean>;
	private readonly _ctxWorkspaceTrustState: IContextKey<boolean>;

	constructor(
		@IContextKeyService contextKeyService: IContextKeyService,
		@IWorkspaceTrustEnablementService workspaceTrustEnablementService: IWorkspaceTrustEnablementService,
		@IWorkspaceTrustManagementService workspaceTrustManagementService: IWorkspaceTrustManagementService
	) {
		super();

		this._ctxWorkspaceTrustEnabled = WorkspaceTrustContext.IsEnabled.bindTo(contextKeyService);
		this._ctxWorkspaceTrustEnabled.set(workspaceTrustEnablementService.isWorkspaceTrustEnabled());

		this._ctxWorkspaceTrustState = WorkspaceTrustContext.IsTrusted.bindTo(contextKeyService);
		this._ctxWorkspaceTrustState.set(workspaceTrustManagementService.isWorkspaceTrusted());

		this._register(workspaceTrustManagementService.onDidChangeTrust(trusted => this._ctxWorkspaceTrustState.set(trusted)));
	}
}

Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench).registerWorkbenchContribution(WorkspaceTrustContextKeys, LifecyclePhase.Restored);


/*
 * Trust Request via Service UX handler
 */

export class WorkspaceTrustRequestHandler extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.workspaceTrustRequestHandler';

	constructor(
		@IDialogService private readonly dialogService: IDialogService,
		@ICommandService private readonly commandService: ICommandService,
		@IWorkspaceContextService private readonly workspaceContextService: IWorkspaceContextService,
		@IWorkspaceTrustManagementService private readonly workspaceTrustManagementService: IWorkspaceTrustManagementService,
		@IWorkspaceTrustRequestService private readonly workspaceTrustRequestService: IWorkspaceTrustRequestService) {
		super();

		this.registerListeners();
	}

	private get useWorkspaceLanguage(): boolean {
		return !isSingleFolderWorkspaceIdentifier(toWorkspaceIdentifier(this.workspaceContextService.getWorkspace()));
	}

	private registerListeners(): void {

		// Open files trust request
		this._register(this.workspaceTrustRequestService.onDidInitiateOpenFilesTrustRequest(async () => {
			await this.workspaceTrustManagementService.workspaceResolved;

			// Details
			const markdownDetails = [
				this.workspaceContextService.getWorkbenchState() !== WorkbenchState.EMPTY ?
					localize('openLooseFileWorkspaceDetails', "You are trying to open untrusted files in a workspace which is trusted.") :
					localize('openLooseFileWindowDetails', "You are trying to open untrusted files in a window which is trusted."),
				localize('openLooseFileLearnMore', "If you don't want to open untrusted files, we recommend to open them in Restricted Mode in a new window as the files may be malicious. See [our docs](https://aka.ms/vscode-workspace-trust) to learn more.")
			];

			// Dialog
			await this.dialogService.prompt<void>({
				type: Severity.Info,
				message: this.workspaceContextService.getWorkbenchState() !== WorkbenchState.EMPTY ?
					localize('openLooseFileWorkspaceMesssage', "Do you want to allow untrusted files in this workspace?") :
					localize('openLooseFileWindowMesssage', "Do you want to allow untrusted files in this window?"),
				buttons: [
					{
						label: localize({ key: 'open', comment: ['&& denotes a mnemonic'] }, "&&Open"),
						run: ({ checkboxChecked }) => this.workspaceTrustRequestService.completeOpenFilesTrustRequest(WorkspaceTrustUriResponse.Open, !!checkboxChecked)
					},
					{
						label: localize({ key: 'newWindow', comment: ['&& denotes a mnemonic'] }, "Open in &&Restricted Mode"),
						run: ({ checkboxChecked }) => this.workspaceTrustRequestService.completeOpenFilesTrustRequest(WorkspaceTrustUriResponse.OpenInNewWindow, !!checkboxChecked)
					}
				],
				cancelButton: {
					run: () => this.workspaceTrustRequestService.completeOpenFilesTrustRequest(WorkspaceTrustUriResponse.Cancel)
				},
				checkbox: {
					label: localize('openLooseFileWorkspaceCheckbox', "Remember my decision for all workspaces"),
					checked: false
				},
				custom: {
					icon: Codicon.shield,
					markdownDetails: markdownDetails.map(md => { return { markdown: new MarkdownString(md) }; })
				}
			});
		}));

		// Workspace trust request
		this._register(this.workspaceTrustRequestService.onDidInitiateWorkspaceTrustRequest(async requestOptions => {
			await this.workspaceTrustManagementService.workspaceResolved;

			// Title
			const message = this.useWorkspaceLanguage ?
				localize('workspaceTrust', "Do you trust the authors of the files in this workspace?") :
				localize('folderTrust', "Do you trust the authors of the files in this folder?");

			// Message
			const defaultDetails = localize('immediateTrustRequestMessage', "A feature you are trying to use may be a security risk if you do not trust the source of the files or folders you currently have open.");
			const details = requestOptions?.message ?? defaultDetails;

			// Buttons
			const buttons = requestOptions?.buttons ?? [
				{ label: this.useWorkspaceLanguage ? localize({ key: 'grantWorkspaceTrustButton', comment: ['&& denotes a mnemonic'] }, "&&Trust Workspace & Continue") : localize({ key: 'grantFolderTrustButton', comment: ['&& denotes a mnemonic'] }, "&&Trust Folder & Continue"), type: 'ContinueWithTrust' },
				{ label: localize({ key: 'manageWorkspaceTrustButton', comment: ['&& denotes a mnemonic'] }, "&&Manage"), type: 'Manage' }
			];

			// Add Cancel button if not provided
			if (!buttons.some(b => b.type === 'Cancel')) {
				buttons.push({ label: localize('cancelWorkspaceTrustButton', "Cancel"), type: 'Cancel' });
			}

			// Dialog
			const { result } = await this.dialogService.prompt({
				type: Severity.Info,
				message,
				custom: {
					icon: Codicon.shield,
					markdownDetails: [
						{ markdown: new MarkdownString(details) },
						{ markdown: new MarkdownString(localize('immediateTrustRequestLearnMore', "If you don't trust the authors of these files, we do not recommend continuing as the files may be malicious. See [our docs](https://aka.ms/vscode-workspace-trust) to learn more.")) }
					]
				},
				buttons: buttons.filter(b => b.type !== 'Cancel').map(button => {
					return {
						label: button.label,
						run: () => button.type
					};
				}),
				cancelButton: (() => {
					const cancelButton = buttons.find(b => b.type === 'Cancel');
					if (!cancelButton) {
						return undefined;
					}

					return {
						label: cancelButton.label,
						run: () => cancelButton.type
					};
				})()
			});


			// Dialog result
			switch (result) {
				case 'ContinueWithTrust':
					await this.workspaceTrustRequestService.completeWorkspaceTrustRequest(true);
					break;
				case 'ContinueWithoutTrust':
					await this.workspaceTrustRequestService.completeWorkspaceTrustRequest(undefined);
					break;
				case 'Manage':
					this.workspaceTrustRequestService.cancelWorkspaceTrustRequest();
					await this.commandService.executeCommand(MANAGE_TRUST_COMMAND_ID);
					break;
				case 'Cancel':
					this.workspaceTrustRequestService.cancelWorkspaceTrustRequest();
					break;
			}
		}));
	}
}


/*
 * Trust UX and Startup Handler
 */
export class WorkspaceTrustUXHandler extends Disposable implements IWorkbenchContribution {

	private readonly entryId = `status.workspaceTrust`;

	private readonly statusbarEntryAccessor: MutableDisposable<IStatusbarEntryAccessor>;

	constructor(
		@IDialogService private readonly dialogService: IDialogService,
		@IWorkspaceContextService private readonly workspaceContextService: IWorkspaceContextService,
		@IWorkspaceTrustEnablementService private readonly workspaceTrustEnablementService: IWorkspaceTrustEnablementService,
		@IWorkspaceTrustManagementService private readonly workspaceTrustManagementService: IWorkspaceTrustManagementService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IStatusbarService private readonly statusbarService: IStatusbarService,
		@IStorageService private readonly storageService: IStorageService,
		@IWorkspaceTrustRequestService private readonly workspaceTrustRequestService: IWorkspaceTrustRequestService,
		@IBannerService private readonly bannerService: IBannerService,
		@ILabelService private readonly labelService: ILabelService,
		@IHostService private readonly hostService: IHostService,
		@IProductService private readonly productService: IProductService,
		@IRemoteAgentService private readonly remoteAgentService: IRemoteAgentService,
		@IEnvironmentService private readonly environmentService: IEnvironmentService,
		@IFileService private readonly fileService: IFileService,
	) {
		super();

		this.statusbarEntryAccessor = this._register(new MutableDisposable<IStatusbarEntryAccessor>());

		(async () => {

			await this.workspaceTrustManagementService.workspaceTrustInitialized;

			if (this.workspaceTrustEnablementService.isWorkspaceTrustEnabled()) {
				this.registerListeners();
				this.updateStatusbarEntry(this.workspaceTrustManagementService.isWorkspaceTrusted());

				// Show modal dialog
				if (this.hostService.hasFocus) {
					this.showModalOnStart();
				} else {
					const focusDisposable = this.hostService.onDidChangeFocus(focused => {
						if (focused) {
							focusDisposable.dispose();
							this.showModalOnStart();
						}
					});
				}
			}
		})();
	}

	private registerListeners(): void {
		this._register(this.workspaceContextService.onWillChangeWorkspaceFolders(e => {
			if (e.fromCache) {
				return;
			}
			if (!this.workspaceTrustEnablementService.isWorkspaceTrustEnabled()) {
				return;
			}

			const addWorkspaceFolder = async (e: IWorkspaceFoldersWillChangeEvent): Promise<void> => {
				const trusted = this.workspaceTrustManagementService.isWorkspaceTrusted();

				// Workspace is trusted and there are added/changed folders
				if (trusted && (e.changes.added.length || e.changes.changed.length)) {
					const addedFoldersTrustInfo = await Promise.all(e.changes.added.map(folder => this.workspaceTrustManagementService.getUriTrustInfo(folder.uri)));

					if (!addedFoldersTrustInfo.map(info => info.trusted).every(trusted => trusted)) {
						const { confirmed } = await this.dialogService.confirm({
							type: Severity.Info,
							message: localize('addWorkspaceFolderMessage', "Do you trust the authors of the files in this folder?"),
							detail: localize('addWorkspaceFolderDetail', "You are adding files that are not currently trusted to a trusted workspace. Do you trust the authors of these new files?"),
							cancelButton: localize('no', 'No'),
							custom: { icon: Codicon.shield }
						});

						// Mark added/changed folders as trusted
						await this.workspaceTrustManagementService.setUrisTrust(addedFoldersTrustInfo.map(i => i.uri), confirmed);
					}
				}
			};

			return e.join(addWorkspaceFolder(e));
		}));

		this._register(this.workspaceTrustManagementService.onDidChangeTrust(trusted => {
			this.updateWorkbenchIndicators(trusted);
		}));

		this._register(this.workspaceTrustRequestService.onDidInitiateWorkspaceTrustRequestOnStartup(async () => {

			let titleString: string | undefined;
			let learnMoreString: string | undefined;
			let trustOption: string | undefined;
			let dontTrustOption: string | undefined;
			const isAiGeneratedWorkspace = await this.isAiGeneratedWorkspace();
			if (isAiGeneratedWorkspace && this.productService.aiGeneratedWorkspaceTrust) {
				titleString = this.productService.aiGeneratedWorkspaceTrust.title;
				learnMoreString = this.productService.aiGeneratedWorkspaceTrust.startupTrustRequestLearnMore;
				trustOption = this.productService.aiGeneratedWorkspaceTrust.trustOption;
				dontTrustOption = this.productService.aiGeneratedWorkspaceTrust.dontTrustOption;
			} else {
				console.warn('AI generated workspace trust dialog contents not available.');
			}

			const title = titleString ?? (this.useWorkspaceLanguage ?
				localize('workspaceTrust', "Do you trust the authors of the files in this workspace?") :
				localize('folderTrust', "Do you trust the authors of the files in this folder?"));

			let checkboxText: string | undefined;
			const workspaceIdentifier = toWorkspaceIdentifier(this.workspaceContextService.getWorkspace());
			const isSingleFolderWorkspace = isSingleFolderWorkspaceIdentifier(workspaceIdentifier);
			const isEmptyWindow = isEmptyWorkspaceIdentifier(workspaceIdentifier);
			if (!isAiGeneratedWorkspace && this.workspaceTrustManagementService.canSetParentFolderTrust()) {
				const name = basename(uriDirname((workspaceIdentifier as ISingleFolderWorkspaceIdentifier).uri));
				checkboxText = localize('checkboxString', "Trust the authors of all files in the parent folder '{0}'", name);
			}

			// Show Workspace Trust Start Dialog
			this.doShowModal(
				title,
				{ label: trustOption ?? localize({ key: 'trustOption', comment: ['&& denotes a mnemonic'] }, "&&Yes, I trust the authors"), sublabel: isSingleFolderWorkspace ? localize('trustFolderOptionDescription', "Trust folder and enable all features") : localize('trustWorkspaceOptionDescription', "Trust workspace and enable all features") },
				{ label: dontTrustOption ?? localize({ key: 'dontTrustOption', comment: ['&& denotes a mnemonic'] }, "&&No, I don't trust the authors"), sublabel: isSingleFolderWorkspace ? localize('dontTrustFolderOptionDescription', "Browse folder in restricted mode") : localize('dontTrustWorkspaceOptionDescription', "Browse workspace in restricted mode") },
				[
					!isSingleFolderWorkspace ?
						localize('workspaceStartupTrustDetails', "{0} provides features that may automatically execute files in this workspace.", this.productService.nameShort) :
						localize('folderStartupTrustDetails', "{0} provides features that may automatically execute files in this folder.", this.productService.nameShort),
					learnMoreString ?? localize('startupTrustRequestLearnMore', "If you don't trust the authors of these files, we recommend to continue in restricted mode as the files may be malicious. See [our docs](https://aka.ms/vscode-workspace-trust) to learn more."),
					!isEmptyWindow ?
						`\`${this.labelService.getWorkspaceLabel(workspaceIdentifier, { verbose: Verbosity.LONG })}\`` : '',
				],
				checkboxText
			);
		}));
	}

	private updateWorkbenchIndicators(trusted: boolean): void {
		const bannerItem = this.getBannerItem(!trusted);

		this.updateStatusbarEntry(trusted);

		if (bannerItem) {
			if (!trusted) {
				this.bannerService.show(bannerItem);
			} else {
				this.bannerService.hide(BANNER_RESTRICTED_MODE);
			}
		}
	}

	//#region Dialog

	private async doShowModal(question: string, trustedOption: { label: string; sublabel: string }, untrustedOption: { label: string; sublabel: string }, markdownStrings: string[], trustParentString?: string): Promise<void> {
		await this.dialogService.prompt({
			type: Severity.Info,
			message: question,
			checkbox: trustParentString ? {
				label: trustParentString
			} : undefined,
			buttons: [
				{
					label: trustedOption.label,
					run: async ({ checkboxChecked }) => {
						if (checkboxChecked) {
							await this.workspaceTrustManagementService.setParentFolderTrust(true);
						} else {
							await this.workspaceTrustRequestService.completeWorkspaceTrustRequest(true);
						}
					}
				},
				{
					label: untrustedOption.label,
					run: () => {
						this.updateWorkbenchIndicators(false);
						this.workspaceTrustRequestService.cancelWorkspaceTrustRequest();
					}
				}
			],
			custom: {
				buttonDetails: [
					trustedOption.sublabel,
					untrustedOption.sublabel
				],
				disableCloseAction: true,
				icon: Codicon.shield,
				markdownDetails: markdownStrings.map(md => { return { markdown: new MarkdownString(md) }; })
			}
		});

		this.storageService.store(STARTUP_PROMPT_SHOWN_KEY, true, StorageScope.WORKSPACE, StorageTarget.MACHINE);
	}

	private async showModalOnStart(): Promise<void> {
		if (this.workspaceTrustManagementService.isWorkspaceTrusted()) {
			this.updateWorkbenchIndicators(true);
			return;
		}

		// Don't show modal prompt if workspace trust cannot be changed
		if (!(this.workspaceTrustManagementService.canSetWorkspaceTrust())) {
			return;
		}

		// Don't show modal prompt for virtual workspaces by default
		if (isVirtualWorkspace(this.workspaceContextService.getWorkspace())) {
			this.updateWorkbenchIndicators(false);
			return;
		}

		// Don't show modal prompt for empty workspaces by default
		if (this.workspaceContextService.getWorkbenchState() === WorkbenchState.EMPTY) {
			this.updateWorkbenchIndicators(false);
			return;
		}

		if (this.startupPromptSetting === 'never') {
			this.updateWorkbenchIndicators(false);
			return;
		}

		if (this.startupPromptSetting === 'once' && this.storageService.getBoolean(STARTUP_PROMPT_SHOWN_KEY, StorageScope.WORKSPACE, false)) {
			this.updateWorkbenchIndicators(false);
			return;
		}

		// Use the workspace trust request service to show modal dialog
		this.workspaceTrustRequestService.requestWorkspaceTrustOnStartup();
	}

	private get startupPromptSetting(): 'always' | 'once' | 'never' {
		return this.configurationService.getValue(WORKSPACE_TRUST_STARTUP_PROMPT);
	}

	private get useWorkspaceLanguage(): boolean {
		return !isSingleFolderWorkspaceIdentifier(toWorkspaceIdentifier(this.workspaceContextService.getWorkspace()));
	}

	private async isAiGeneratedWorkspace(): Promise<boolean> {
		const aiGeneratedWorkspaces = URI.joinPath(this.environmentService.workspaceStorageHome, 'aiGeneratedWorkspaces.json');
		return await this.fileService.exists(aiGeneratedWorkspaces).then(async result => {
			if (result) {
				try {
					const content = await this.fileService.readFile(aiGeneratedWorkspaces);
					const workspaces = JSON.parse(content.value.toString()) as string[];
					if (workspaces.indexOf(this.workspaceContextService.getWorkspace().folders[0].uri.toString()) > -1) {
						return true;
					}
				} catch (e) {
					// Ignore errors when resolving file contents
				}
			}
			return false;
		});
	}

	//#endregion

	//#region Banner

	private getBannerItem(restrictedMode: boolean): IBannerItem | undefined {
		const dismissedRestricted = this.storageService.getBoolean(BANNER_RESTRICTED_MODE_DISMISSED_KEY, StorageScope.WORKSPACE, false);

		// never show the banner
		if (this.bannerSetting === 'never') {
			return undefined;
		}

		// info has been dismissed
		if (this.bannerSetting === 'untilDismissed' && dismissedRestricted) {
			return undefined;
		}

		const actions =
			[
				{
					label: localize('restrictedModeBannerManage', "Manage"),
					href: 'command:' + MANAGE_TRUST_COMMAND_ID
				},
				{
					label: localize('restrictedModeBannerLearnMore', "Learn More"),
					href: 'https://aka.ms/vscode-workspace-trust'
				}
			];

		return {
			id: BANNER_RESTRICTED_MODE,
			icon: shieldIcon,
			ariaLabel: this.getBannerItemAriaLabels(),
			message: this.getBannerItemMessages(),
			actions,
			onClose: () => {
				if (restrictedMode) {
					this.storageService.store(BANNER_RESTRICTED_MODE_DISMISSED_KEY, true, StorageScope.WORKSPACE, StorageTarget.MACHINE);
				}
			}
		};
	}

	private getBannerItemAriaLabels(): string {
		switch (this.workspaceContextService.getWorkbenchState()) {
			case WorkbenchState.EMPTY:
				return localize('restrictedModeBannerAriaLabelWindow', "Restricted Mode is intended for safe code browsing. Trust this window to enable all features. Use navigation keys to access banner actions.");
			case WorkbenchState.FOLDER:
				return localize('restrictedModeBannerAriaLabelFolder', "Restricted Mode is intended for safe code browsing. Trust this folder to enable all features. Use navigation keys to access banner actions.");
			case WorkbenchState.WORKSPACE:
				return localize('restrictedModeBannerAriaLabelWorkspace', "Restricted Mode is intended for safe code browsing. Trust this workspace to enable all features. Use navigation keys to access banner actions.");
		}
	}

	private getBannerItemMessages(): string {
		switch (this.workspaceContextService.getWorkbenchState()) {
			case WorkbenchState.EMPTY:
				return localize('restrictedModeBannerMessageWindow', "Restricted Mode is intended for safe code browsing. Trust this window to enable all features.");
			case WorkbenchState.FOLDER:
				return localize('restrictedModeBannerMessageFolder', "Restricted Mode is intended for safe code browsing. Trust this folder to enable all features.");
			case WorkbenchState.WORKSPACE:
				return localize('restrictedModeBannerMessageWorkspace', "Restricted Mode is intended for safe code browsing. Trust this workspace to enable all features.");
		}
	}


	private get bannerSetting(): 'always' | 'untilDismissed' | 'never' {
		const result = this.configurationService.getValue<'always' | 'untilDismissed' | 'never'>(WORKSPACE_TRUST_BANNER);

		// In serverless environments, we don't need to aggressively show the banner
		if (result !== 'always' && isWeb && !this.remoteAgentService.getConnection()?.remoteAuthority) {
			return 'never';
		}

		return result;
	}

	//#endregion

	//#region Statusbar

	private getRestrictedModeStatusbarEntry(): IStatusbarEntry {
		let ariaLabel = '';
		let toolTip: IMarkdownString | string | undefined;
		switch (this.workspaceContextService.getWorkbenchState()) {
			case WorkbenchState.EMPTY: {
				ariaLabel = localize('status.ariaUntrustedWindow', "Restricted Mode: Some features are disabled because this window is not trusted.");
				toolTip = {
					value: localize(
						{ key: 'status.tooltipUntrustedWindow2', comment: ['[abc]({n}) are links.  Only translate `features are disabled` and `window is not trusted`. Do not change brackets and parentheses or {n}'] },
						"Running in Restricted Mode\n\nSome [features are disabled]({0}) because this [window is not trusted]({1}).",
						`command:${LIST_WORKSPACE_UNSUPPORTED_EXTENSIONS_COMMAND_ID}`,
						`command:${MANAGE_TRUST_COMMAND_ID}`
					),
					isTrusted: true,
					supportThemeIcons: true
				};
				break;
			}
			case WorkbenchState.FOLDER: {
				ariaLabel = localize('status.ariaUntrustedFolder', "Restricted Mode: Some features are disabled because this folder is not trusted.");
				toolTip = {
					value: localize(
						{ key: 'status.tooltipUntrustedFolder2', comment: ['[abc]({n}) are links.  Only translate `features are disabled` and `folder is not trusted`. Do not change brackets and parentheses or {n}'] },
						"Running in Restricted Mode\n\nSome [features are disabled]({0}) because this [folder is not trusted]({1}).",
						`command:${LIST_WORKSPACE_UNSUPPORTED_EXTENSIONS_COMMAND_ID}`,
						`command:${MANAGE_TRUST_COMMAND_ID}`
					),
					isTrusted: true,
					supportThemeIcons: true
				};
				break;
			}
			case WorkbenchState.WORKSPACE: {
				ariaLabel = localize('status.ariaUntrustedWorkspace', "Restricted Mode: Some features are disabled because this workspace is not trusted.");
				toolTip = {
					value: localize(
						{ key: 'status.tooltipUntrustedWorkspace2', comment: ['[abc]({n}) are links. Only translate `features are disabled` and `workspace is not trusted`. Do not change brackets and parentheses or {n}'] },
						"Running in Restricted Mode\n\nSome [features are disabled]({0}) because this [workspace is not trusted]({1}).",
						`command:${LIST_WORKSPACE_UNSUPPORTED_EXTENSIONS_COMMAND_ID}`,
						`command:${MANAGE_TRUST_COMMAND_ID}`
					),
					isTrusted: true,
					supportThemeIcons: true
				};
				break;
			}
		}

		return {
			name: localize('status.WorkspaceTrust', "Workspace Trust"),
			text: `$(shield) ${localize('untrusted', "Restricted Mode")}`,
			ariaLabel: ariaLabel,
			tooltip: toolTip,
			command: MANAGE_TRUST_COMMAND_ID,
			kind: 'prominent'
		};
	}

	private updateStatusbarEntry(trusted: boolean): void {
		if (trusted && this.statusbarEntryAccessor.value) {
			this.statusbarEntryAccessor.clear();
			return;
		}

		if (!trusted && !this.statusbarEntryAccessor.value) {
			const entry = this.getRestrictedModeStatusbarEntry();
			this.statusbarEntryAccessor.value = this.statusbarService.addEntry(entry, this.entryId, StatusbarAlignment.LEFT, { location: { id: 'status.host', priority: Number.POSITIVE_INFINITY }, alignment: StatusbarAlignment.RIGHT });
		}
	}

	//#endregion
}

registerWorkbenchContribution2(WorkspaceTrustRequestHandler.ID, WorkspaceTrustRequestHandler, WorkbenchPhase.BlockRestore);
Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench).registerWorkbenchContribution(WorkspaceTrustUXHandler, LifecyclePhase.Restored);


/**
 * Trusted Workspace GUI Editor
 */
class WorkspaceTrustEditorInputSerializer implements IEditorSerializer {

	canSerialize(editorInput: EditorInput): boolean {
		return true;
	}

	serialize(input: WorkspaceTrustEditorInput): string {
		return '';
	}

	deserialize(instantiationService: IInstantiationService): WorkspaceTrustEditorInput {
		return instantiationService.createInstance(WorkspaceTrustEditorInput);
	}
}

Registry.as<IEditorFactoryRegistry>(EditorExtensions.EditorFactory)
	.registerEditorSerializer(WorkspaceTrustEditorInput.ID, WorkspaceTrustEditorInputSerializer);

Registry.as<IEditorPaneRegistry>(EditorExtensions.EditorPane).registerEditorPane(
	EditorPaneDescriptor.create(
		WorkspaceTrustEditor,
		WorkspaceTrustEditor.ID,
		localize('workspaceTrustEditor', "Workspace Trust Editor")
	),
	[
		new SyncDescriptor(WorkspaceTrustEditorInput)
	]
);


/*
 * Actions
 */

// Configure Workspace Trust Settings

const CONFIGURE_TRUST_COMMAND_ID = 'workbench.trust.configure';
const WORKSPACES_CATEGORY = localize2('workspacesCategory', 'Workspaces');

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: CONFIGURE_TRUST_COMMAND_ID,
			title: localize2('configureWorkspaceTrustSettings', "Configure Workspace Trust Settings"),
			precondition: ContextKeyExpr.and(WorkspaceTrustContext.IsEnabled, ContextKeyExpr.equals(`config.${WORKSPACE_TRUST_ENABLED}`, true)),
			category: WORKSPACES_CATEGORY,
			f1: true
		});
	}

	run(accessor: ServicesAccessor) {
		accessor.get(IPreferencesService).openUserSettings({ jsonEditor: false, query: `@tag:${WORKSPACE_TRUST_SETTING_TAG}` });
	}
});

// Manage Workspace Trust

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: MANAGE_TRUST_COMMAND_ID,
			title: localize2('manageWorkspaceTrust', "Manage Workspace Trust"),
			precondition: ContextKeyExpr.and(WorkspaceTrustContext.IsEnabled, ContextKeyExpr.equals(`config.${WORKSPACE_TRUST_ENABLED}`, true)),
			category: WORKSPACES_CATEGORY,
			f1: true,
		});
	}

	run(accessor: ServicesAccessor) {
		const editorService = accessor.get(IEditorService);
		const instantiationService = accessor.get(IInstantiationService);

		const input = instantiationService.createInstance(WorkspaceTrustEditorInput);

		editorService.openEditor(input, { pinned: true });
		return;
	}
});


/*
 * Configuration
 */
Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration)
	.registerConfiguration({
		...securityConfigurationNodeBase,
		properties: {
			[WORKSPACE_TRUST_ENABLED]: {
				type: 'boolean',
				default: true,
				description: localize('workspace.trust.description', "Controls whether or not Workspace Trust is enabled within VS Code."),
				tags: [WORKSPACE_TRUST_SETTING_TAG],
				scope: ConfigurationScope.APPLICATION,
			},
			[WORKSPACE_TRUST_STARTUP_PROMPT]: {
				type: 'string',
				default: 'once',
				description: localize('workspace.trust.startupPrompt.description', "Controls when the startup prompt to trust a workspace is shown."),
				tags: [WORKSPACE_TRUST_SETTING_TAG],
				scope: ConfigurationScope.APPLICATION,
				enum: ['always', 'once', 'never'],
				enumDescriptions: [
					localize('workspace.trust.startupPrompt.always', "Ask for trust every time an untrusted workspace is opened."),
					localize('workspace.trust.startupPrompt.once', "Ask for trust the first time an untrusted workspace is opened."),
					localize('workspace.trust.startupPrompt.never', "Do not ask for trust when an untrusted workspace is opened."),
				]
			},
			[WORKSPACE_TRUST_BANNER]: {
				type: 'string',
				default: 'untilDismissed',
				description: localize('workspace.trust.banner.description', "Controls when the restricted mode banner is shown."),
				tags: [WORKSPACE_TRUST_SETTING_TAG],
				scope: ConfigurationScope.APPLICATION,
				enum: ['always', 'untilDismissed', 'never'],
				enumDescriptions: [
					localize('workspace.trust.banner.always', "Show the banner every time an untrusted workspace is open."),
					localize('workspace.trust.banner.untilDismissed', "Show the banner when an untrusted workspace is opened until dismissed."),
					localize('workspace.trust.banner.never', "Do not show the banner when an untrusted workspace is open."),
				]
			},
			[WORKSPACE_TRUST_UNTRUSTED_FILES]: {
				type: 'string',
				default: 'prompt',
				markdownDescription: localize('workspace.trust.untrustedFiles.description', "Controls how to handle opening untrusted files in a trusted workspace. This setting also applies to opening files in an empty window which is trusted via `#{0}#`.", WORKSPACE_TRUST_EMPTY_WINDOW),
				tags: [WORKSPACE_TRUST_SETTING_TAG],
				scope: ConfigurationScope.APPLICATION,
				enum: ['prompt', 'open', 'newWindow'],
				enumDescriptions: [
					localize('workspace.trust.untrustedFiles.prompt', "Ask how to handle untrusted files for each workspace. Once untrusted files are introduced to a trusted workspace, you will not be prompted again."),
					localize('workspace.trust.untrustedFiles.open', "Always allow untrusted files to be introduced to a trusted workspace without prompting."),
					localize('workspace.trust.untrustedFiles.newWindow', "Always open untrusted files in a separate window in restricted mode without prompting."),
				]
			},
			[WORKSPACE_TRUST_EMPTY_WINDOW]: {
				type: 'boolean',
				default: true,
				markdownDescription: localize('workspace.trust.emptyWindow.description', "Controls whether or not the empty window is trusted by default within VS Code. When used with `#{0}#`, you can enable the full functionality of VS Code without prompting in an empty window.", WORKSPACE_TRUST_UNTRUSTED_FILES),
				tags: [WORKSPACE_TRUST_SETTING_TAG],
				scope: ConfigurationScope.APPLICATION
			}
		}
	});

class WorkspaceTrustTelemetryContribution extends Disposable implements IWorkbenchContribution {
	constructor(
		@IWorkbenchEnvironmentService private readonly environmentService: IWorkbenchEnvironmentService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IWorkspaceContextService private readonly workspaceContextService: IWorkspaceContextService,
		@IWorkspaceTrustEnablementService private readonly workspaceTrustEnablementService: IWorkspaceTrustEnablementService,
		@IWorkspaceTrustManagementService private readonly workspaceTrustManagementService: IWorkspaceTrustManagementService,
	) {
		super();

		this.workspaceTrustManagementService.workspaceTrustInitialized
			.then(() => {
				this.logInitialWorkspaceTrustInfo();
				this.logWorkspaceTrust(this.workspaceTrustManagementService.isWorkspaceTrusted());

				this._register(this.workspaceTrustManagementService.onDidChangeTrust(isTrusted => this.logWorkspaceTrust(isTrusted)));
			});
	}

	private logInitialWorkspaceTrustInfo(): void {
		if (!this.workspaceTrustEnablementService.isWorkspaceTrustEnabled()) {
			const disabledByCliFlag = this.environmentService.disableWorkspaceTrust;

			type WorkspaceTrustDisabledEventClassification = {
				owner: 'sbatten';
				comment: 'Logged when workspace trust is disabled';
				reason: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The reason workspace trust is disabled. e.g. cli or setting' };
			};

			type WorkspaceTrustDisabledEvent = {
				reason: 'setting' | 'cli';
			};

			this.telemetryService.publicLog2<WorkspaceTrustDisabledEvent, WorkspaceTrustDisabledEventClassification>('workspaceTrustDisabled', {
				reason: disabledByCliFlag ? 'cli' : 'setting'
			});
			return;
		}

		type WorkspaceTrustInfoEventClassification = {
			owner: 'sbatten';
			comment: 'Information about the workspaces trusted on the machine';
			trustedFoldersCount: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The number of trusted folders on the machine' };
		};

		type WorkspaceTrustInfoEvent = {
			trustedFoldersCount: number;
		};

		this.telemetryService.publicLog2<WorkspaceTrustInfoEvent, WorkspaceTrustInfoEventClassification>('workspaceTrustFolderCounts', {
			trustedFoldersCount: this.workspaceTrustManagementService.getTrustedUris().length,
		});
	}

	private async logWorkspaceTrust(isTrusted: boolean): Promise<void> {
		if (!this.workspaceTrustEnablementService.isWorkspaceTrustEnabled()) {
			return;
		}

		type WorkspaceTrustStateChangedEvent = {
			workspaceId: string;
			isTrusted: boolean;
		};

		type WorkspaceTrustStateChangedEventClassification = {
			owner: 'sbatten';
			comment: 'Logged when the workspace transitions between trusted and restricted modes';
			workspaceId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'An id of the workspace' };
			isTrusted: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'true if the workspace is trusted' };
		};

		this.telemetryService.publicLog2<WorkspaceTrustStateChangedEvent, WorkspaceTrustStateChangedEventClassification>('workspaceTrustStateChanged', {
			workspaceId: this.workspaceContextService.getWorkspace().id,
			isTrusted: isTrusted
		});

		if (isTrusted) {
			type WorkspaceTrustFolderInfoEventClassification = {
				owner: 'sbatten';
				comment: 'Some metrics on the trusted workspaces folder structure';
				trustedFolderDepth: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The number of directories deep of the trusted path' };
				workspaceFolderDepth: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The number of directories deep of the workspace path' };
				delta: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The difference between the trusted path and the workspace path directories depth' };
			};

			type WorkspaceTrustFolderInfoEvent = {
				trustedFolderDepth: number;
				workspaceFolderDepth: number;
				delta: number;
			};

			const getDepth = (folder: string): number => {
				let resolvedPath = resolve(folder);

				let depth = 0;
				while (dirname(resolvedPath) !== resolvedPath && depth < 100) {
					resolvedPath = dirname(resolvedPath);
					depth++;
				}

				return depth;
			};

			for (const folder of this.workspaceContextService.getWorkspace().folders) {
				const { trusted, uri } = await this.workspaceTrustManagementService.getUriTrustInfo(folder.uri);
				if (!trusted) {
					continue;
				}

				const workspaceFolderDepth = getDepth(folder.uri.fsPath);
				const trustedFolderDepth = getDepth(uri.fsPath);
				const delta = workspaceFolderDepth - trustedFolderDepth;

				this.telemetryService.publicLog2<WorkspaceTrustFolderInfoEvent, WorkspaceTrustFolderInfoEventClassification>('workspaceFolderDepthBelowTrustedFolder', { workspaceFolderDepth, trustedFolderDepth, delta });
			}
		}
	}
}

Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench)
	.registerWorkbenchContribution(WorkspaceTrustTelemetryContribution, LifecyclePhase.Restored);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/workspace/browser/workspaceTrustEditor.ts]---
Location: vscode-main/src/vs/workbench/contrib/workspace/browser/workspaceTrustEditor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { $, addDisposableListener, addStandardDisposableListener, append, clearNode, Dimension, EventHelper, EventType, isAncestorOfActiveElement } from '../../../../base/browser/dom.js';
import { ActionBar } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { ButtonBar } from '../../../../base/browser/ui/button/button.js';
import { IMessage, InputBox, MessageType } from '../../../../base/browser/ui/inputbox/inputBox.js';
import { DomScrollableElement } from '../../../../base/browser/ui/scrollbar/scrollableElement.js';
import { ITableRenderer, ITableVirtualDelegate } from '../../../../base/browser/ui/table/table.js';
import { Action, IAction } from '../../../../base/common/actions.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { debounce } from '../../../../base/common/decorators.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { normalizeDriveLetter } from '../../../../base/common/labels.js';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { parseLinkedText } from '../../../../base/common/linkedText.js';
import { Schemas } from '../../../../base/common/network.js';
import { ScrollbarVisibility } from '../../../../base/common/scrollable.js';
import { URI } from '../../../../base/common/uri.js';
import { localize } from '../../../../nls.js';
import { ConfigurationScope, Extensions, IConfigurationRegistry } from '../../../../platform/configuration/common/configurationRegistry.js';
import { IContextViewService } from '../../../../platform/contextview/browser/contextView.js';
import { IFileDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { WorkbenchTable } from '../../../../platform/list/browser/listService.js';
import { Link } from '../../../../platform/opener/browser/link.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { isVirtualResource, isVirtualWorkspace } from '../../../../platform/workspace/common/virtualWorkspace.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { asCssVariable, buttonBackground, buttonSecondaryBackground, editorErrorForeground } from '../../../../platform/theme/common/colorRegistry.js';
import { ISingleFolderWorkspaceIdentifier, IWorkspaceContextService, toWorkspaceIdentifier, WorkbenchState } from '../../../../platform/workspace/common/workspace.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { IWorkspaceTrustManagementService } from '../../../../platform/workspace/common/workspaceTrust.js';
import { EditorPane } from '../../../browser/parts/editor/editorPane.js';
import { IEditorOpenContext } from '../../../common/editor.js';
import { debugIconStartForeground } from '../../debug/browser/debugColors.js';
import { IExtensionsWorkbenchService, LIST_WORKSPACE_UNSUPPORTED_EXTENSIONS_COMMAND_ID } from '../../extensions/common/extensions.js';
import { APPLICATION_SCOPES, IWorkbenchConfigurationService } from '../../../services/configuration/common/configuration.js';
import { IExtensionManifestPropertiesService } from '../../../services/extensions/common/extensionManifestPropertiesService.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { WorkspaceTrustEditorInput } from '../../../services/workspaces/browser/workspaceTrustEditorInput.js';
import { IEditorOptions } from '../../../../platform/editor/common/editor.js';
import { getExtensionDependencies } from '../../../../platform/extensionManagement/common/extensionManagementUtil.js';
import { EnablementState, IWorkbenchExtensionEnablementService } from '../../../services/extensionManagement/common/extensionManagement.js';
import { posix, win32 } from '../../../../base/common/path.js';
import { hasDriveLetter, toSlashes } from '../../../../base/common/extpath.js';
import { StandardKeyboardEvent } from '../../../../base/browser/keyboardEvent.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';
import { defaultButtonStyles, defaultInputBoxStyles } from '../../../../platform/theme/browser/defaultStyles.js';
import { isMacintosh } from '../../../../base/common/platform.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { ResolvedKeybinding } from '../../../../base/common/keybindings.js';
import { basename, dirname } from '../../../../base/common/resources.js';
import { IEditorGroup } from '../../../services/editor/common/editorGroupsService.js';

export const shieldIcon = registerIcon('workspace-trust-banner', Codicon.shield, localize('shieldIcon', 'Icon for workspace trust ion the banner.'));

const checkListIcon = registerIcon('workspace-trust-editor-check', Codicon.check, localize('checkListIcon', 'Icon for the checkmark in the workspace trust editor.'));
const xListIcon = registerIcon('workspace-trust-editor-cross', Codicon.x, localize('xListIcon', 'Icon for the cross in the workspace trust editor.'));
const folderPickerIcon = registerIcon('workspace-trust-editor-folder-picker', Codicon.folder, localize('folderPickerIcon', 'Icon for the pick folder icon in the workspace trust editor.'));
const editIcon = registerIcon('workspace-trust-editor-edit-folder', Codicon.edit, localize('editIcon', 'Icon for the edit folder icon in the workspace trust editor.'));
const removeIcon = registerIcon('workspace-trust-editor-remove-folder', Codicon.close, localize('removeIcon', 'Icon for the remove folder icon in the workspace trust editor.'));

interface ITrustedUriItem {
	parentOfWorkspaceItem: boolean;
	uri: URI;
}

class WorkspaceTrustedUrisTable extends Disposable {
	private readonly _onDidAcceptEdit: Emitter<ITrustedUriItem> = this._register(new Emitter<ITrustedUriItem>());
	readonly onDidAcceptEdit: Event<ITrustedUriItem> = this._onDidAcceptEdit.event;

	private readonly _onDidRejectEdit: Emitter<ITrustedUriItem> = this._register(new Emitter<ITrustedUriItem>());
	readonly onDidRejectEdit: Event<ITrustedUriItem> = this._onDidRejectEdit.event;

	private _onEdit: Emitter<ITrustedUriItem> = this._register(new Emitter<ITrustedUriItem>());
	readonly onEdit: Event<ITrustedUriItem> = this._onEdit.event;

	private _onDelete: Emitter<ITrustedUriItem> = this._register(new Emitter<ITrustedUriItem>());
	readonly onDelete: Event<ITrustedUriItem> = this._onDelete.event;

	private readonly table: WorkbenchTable<ITrustedUriItem>;

	private readonly descriptionElement: HTMLElement;

	constructor(
		private readonly container: HTMLElement,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IWorkspaceContextService private readonly workspaceService: IWorkspaceContextService,
		@IWorkspaceTrustManagementService private readonly workspaceTrustManagementService: IWorkspaceTrustManagementService,
		@IUriIdentityService private readonly uriService: IUriIdentityService,
		@ILabelService private readonly labelService: ILabelService,
		@IFileDialogService private readonly fileDialogService: IFileDialogService
	) {
		super();

		this.descriptionElement = container.appendChild($('.workspace-trusted-folders-description'));
		const tableElement = container.appendChild($('.trusted-uris-table'));
		const addButtonBarElement = container.appendChild($('.trusted-uris-button-bar'));

		this.table = this.instantiationService.createInstance(
			WorkbenchTable,
			'WorkspaceTrust',
			tableElement,
			new TrustedUriTableVirtualDelegate(),
			[
				{
					label: localize('hostColumnLabel', "Host"),
					tooltip: '',
					weight: 1,
					templateId: TrustedUriHostColumnRenderer.TEMPLATE_ID,
					project(row: ITrustedUriItem): ITrustedUriItem { return row; }
				},
				{
					label: localize('pathColumnLabel', "Path"),
					tooltip: '',
					weight: 8,
					templateId: TrustedUriPathColumnRenderer.TEMPLATE_ID,
					project(row: ITrustedUriItem): ITrustedUriItem { return row; }
				},
				{
					label: '',
					tooltip: '',
					weight: 1,
					minimumWidth: 75,
					maximumWidth: 75,
					templateId: TrustedUriActionsColumnRenderer.TEMPLATE_ID,
					project(row: ITrustedUriItem): ITrustedUriItem { return row; }
				},
			],
			[
				this.instantiationService.createInstance(TrustedUriHostColumnRenderer),
				this.instantiationService.createInstance(TrustedUriPathColumnRenderer, this),
				this.instantiationService.createInstance(TrustedUriActionsColumnRenderer, this, this.currentWorkspaceUri),
			],
			{
				horizontalScrolling: false,
				alwaysConsumeMouseWheel: false,
				openOnSingleClick: false,
				multipleSelectionSupport: false,
				accessibilityProvider: {
					getAriaLabel: (item: ITrustedUriItem) => {
						const hostLabel = getHostLabel(this.labelService, item);
						if (hostLabel === undefined || hostLabel.length === 0) {
							return localize('trustedFolderAriaLabel', "{0}, trusted", this.labelService.getUriLabel(item.uri));
						}

						return localize('trustedFolderWithHostAriaLabel', "{0} on {1}, trusted", this.labelService.getUriLabel(item.uri), hostLabel);
					},
					getWidgetAriaLabel: () => localize('trustedFoldersAndWorkspaces', "Trusted Folders & Workspaces")
				},
				identityProvider: {
					getId(element: ITrustedUriItem) {
						return element.uri.toString();
					},
				}
			}
		) as WorkbenchTable<ITrustedUriItem>;

		this._register(this.table.onDidOpen(item => {
			// default prevented when input box is double clicked #125052
			if (item && item.element && !item.browserEvent?.defaultPrevented) {
				this.edit(item.element, true);
			}
		}));

		const buttonBar = this._register(new ButtonBar(addButtonBarElement));
		const addButton = this._register(buttonBar.addButton({ title: localize('addButton', "Add Folder"), ...defaultButtonStyles }));
		addButton.label = localize('addButton', "Add Folder");

		this._register(addButton.onDidClick(async () => {
			const uri = await this.fileDialogService.showOpenDialog({
				canSelectFiles: false,
				canSelectFolders: true,
				canSelectMany: false,
				defaultUri: this.currentWorkspaceUri,
				openLabel: localize('trustUri', "Trust Folder"),
				title: localize('selectTrustedUri', "Select Folder To Trust")
			});

			if (uri) {
				this.workspaceTrustManagementService.setUrisTrust(uri, true);
			}
		}));

		this._register(this.workspaceTrustManagementService.onDidChangeTrustedFolders(() => {
			this.updateTable();
		}));
	}

	private getIndexOfTrustedUriEntry(item: ITrustedUriItem): number {
		const index = this.trustedUriEntries.indexOf(item);
		if (index === -1) {
			for (let i = 0; i < this.trustedUriEntries.length; i++) {
				if (this.trustedUriEntries[i].uri === item.uri) {
					return i;
				}
			}
		}

		return index;
	}

	private selectTrustedUriEntry(item: ITrustedUriItem, focus: boolean = true): void {
		const index = this.getIndexOfTrustedUriEntry(item);
		if (index !== -1) {
			if (focus) {
				this.table.domFocus();
				this.table.setFocus([index]);
			}
			this.table.setSelection([index]);
		}
	}

	private get currentWorkspaceUri(): URI {
		return this.workspaceService.getWorkspace().folders[0]?.uri || URI.file('/');
	}

	private get trustedUriEntries(): ITrustedUriItem[] {
		const currentWorkspace = this.workspaceService.getWorkspace();
		const currentWorkspaceUris = currentWorkspace.folders.map(folder => folder.uri);
		if (currentWorkspace.configuration) {
			currentWorkspaceUris.push(currentWorkspace.configuration);
		}

		const entries = this.workspaceTrustManagementService.getTrustedUris().map(uri => {

			let relatedToCurrentWorkspace = false;
			for (const workspaceUri of currentWorkspaceUris) {
				relatedToCurrentWorkspace = relatedToCurrentWorkspace || this.uriService.extUri.isEqualOrParent(workspaceUri, uri);
			}

			return {
				uri,
				parentOfWorkspaceItem: relatedToCurrentWorkspace
			};
		});

		// Sort entries
		const sortedEntries = entries.sort((a, b) => {
			if (a.uri.scheme !== b.uri.scheme) {
				if (a.uri.scheme === Schemas.file) {
					return -1;
				}

				if (b.uri.scheme === Schemas.file) {
					return 1;
				}
			}

			const aIsWorkspace = a.uri.path.endsWith('.code-workspace');
			const bIsWorkspace = b.uri.path.endsWith('.code-workspace');

			if (aIsWorkspace !== bIsWorkspace) {
				if (aIsWorkspace) {
					return 1;
				}

				if (bIsWorkspace) {
					return -1;
				}
			}

			return a.uri.fsPath.localeCompare(b.uri.fsPath);
		});

		return sortedEntries;
	}

	layout(): void {
		this.table.layout((this.trustedUriEntries.length * TrustedUriTableVirtualDelegate.ROW_HEIGHT) + TrustedUriTableVirtualDelegate.HEADER_ROW_HEIGHT, undefined);
	}

	updateTable(): void {
		const entries = this.trustedUriEntries;
		this.container.classList.toggle('empty', entries.length === 0);

		this.descriptionElement.innerText = entries.length ?
			localize('trustedFoldersDescription', "You trust the following folders, their subfolders, and workspace files.") :
			localize('noTrustedFoldersDescriptions', "You haven't trusted any folders or workspace files yet.");

		this.table.splice(0, Number.POSITIVE_INFINITY, this.trustedUriEntries);
		this.layout();
	}

	validateUri(path: string, item?: ITrustedUriItem): IMessage | null {
		if (!item) {
			return null;
		}

		if (item.uri.scheme === 'vscode-vfs') {
			const segments = path.split(posix.sep).filter(s => s.length);
			if (segments.length === 0 && path.startsWith(posix.sep)) {
				return {
					type: MessageType.WARNING,
					content: localize({ key: 'trustAll', comment: ['The {0} will be a host name where repositories are hosted.'] }, "You will trust all repositories on {0}.", getHostLabel(this.labelService, item))
				};
			}

			if (segments.length === 1) {
				return {
					type: MessageType.WARNING,
					content: localize({ key: 'trustOrg', comment: ['The {0} will be an organization or user name.', 'The {1} will be a host name where repositories are hosted.'] }, "You will trust all repositories and forks under '{0}' on {1}.", segments[0], getHostLabel(this.labelService, item))
				};
			}

			if (segments.length > 2) {
				return {
					type: MessageType.ERROR,
					content: localize('invalidTrust', "You cannot trust individual folders within a repository.", path)
				};
			}
		}

		return null;
	}

	acceptEdit(item: ITrustedUriItem, uri: URI) {
		const trustedFolders = this.workspaceTrustManagementService.getTrustedUris();
		const index = trustedFolders.findIndex(u => this.uriService.extUri.isEqual(u, item.uri));

		if (index >= trustedFolders.length || index === -1) {
			trustedFolders.push(uri);
		} else {
			trustedFolders[index] = uri;
		}

		this.workspaceTrustManagementService.setTrustedUris(trustedFolders);
		this._onDidAcceptEdit.fire(item);
	}

	rejectEdit(item: ITrustedUriItem) {
		this._onDidRejectEdit.fire(item);
	}

	async delete(item: ITrustedUriItem) {
		this.table.focusNext();
		await this.workspaceTrustManagementService.setUrisTrust([item.uri], false);

		if (this.table.getFocus().length === 0) {
			this.table.focusLast();
		}
		this._onDelete.fire(item);
		this.table.domFocus();
	}

	async edit(item: ITrustedUriItem, usePickerIfPossible?: boolean) {
		const canUseOpenDialog = item.uri.scheme === Schemas.file ||
			(
				item.uri.scheme === this.currentWorkspaceUri.scheme &&
				this.uriService.extUri.isEqualAuthority(this.currentWorkspaceUri.authority, item.uri.authority) &&
				!isVirtualResource(item.uri)
			);
		if (canUseOpenDialog && usePickerIfPossible) {
			const uri = await this.fileDialogService.showOpenDialog({
				canSelectFiles: false,
				canSelectFolders: true,
				canSelectMany: false,
				defaultUri: item.uri,
				openLabel: localize('trustUri', "Trust Folder"),
				title: localize('selectTrustedUri', "Select Folder To Trust")
			});

			if (uri) {
				this.acceptEdit(item, uri[0]);
			} else {
				this.rejectEdit(item);
			}
		} else {
			this.selectTrustedUriEntry(item);
			this._onEdit.fire(item);
		}
	}
}

class TrustedUriTableVirtualDelegate implements ITableVirtualDelegate<ITrustedUriItem> {
	static readonly HEADER_ROW_HEIGHT = 30;
	static readonly ROW_HEIGHT = 24;
	readonly headerRowHeight = TrustedUriTableVirtualDelegate.HEADER_ROW_HEIGHT;
	getHeight(item: ITrustedUriItem) {
		return TrustedUriTableVirtualDelegate.ROW_HEIGHT;
	}
}

interface IActionsColumnTemplateData {
	readonly actionBar: ActionBar;
}

class TrustedUriActionsColumnRenderer implements ITableRenderer<ITrustedUriItem, IActionsColumnTemplateData> {

	static readonly TEMPLATE_ID = 'actions';

	readonly templateId: string = TrustedUriActionsColumnRenderer.TEMPLATE_ID;

	constructor(
		private readonly table: WorkspaceTrustedUrisTable,
		private readonly currentWorkspaceUri: URI,
		@IUriIdentityService private readonly uriService: IUriIdentityService) { }

	renderTemplate(container: HTMLElement): IActionsColumnTemplateData {
		const element = container.appendChild($('.actions'));
		const actionBar = new ActionBar(element);
		return { actionBar };
	}

	renderElement(item: ITrustedUriItem, index: number, templateData: IActionsColumnTemplateData): void {
		templateData.actionBar.clear();

		const canUseOpenDialog = item.uri.scheme === Schemas.file ||
			(
				item.uri.scheme === this.currentWorkspaceUri.scheme &&
				this.uriService.extUri.isEqualAuthority(this.currentWorkspaceUri.authority, item.uri.authority) &&
				!isVirtualResource(item.uri)
			);

		const actions: IAction[] = [];
		if (canUseOpenDialog) {
			actions.push(this.createPickerAction(item));
		}
		actions.push(this.createEditAction(item));
		actions.push(this.createDeleteAction(item));
		templateData.actionBar.push(actions, { icon: true });
	}

	private createEditAction(item: ITrustedUriItem): IAction {
		return {
			label: '',
			class: ThemeIcon.asClassName(editIcon),
			enabled: true,
			id: 'editTrustedUri',
			tooltip: localize('editTrustedUri', "Edit Path"),
			run: () => {
				this.table.edit(item, false);
			}
		};
	}

	private createPickerAction(item: ITrustedUriItem): IAction {
		return {
			label: '',
			class: ThemeIcon.asClassName(folderPickerIcon),
			enabled: true,
			id: 'pickerTrustedUri',
			tooltip: localize('pickerTrustedUri', "Open File Picker"),
			run: () => {
				this.table.edit(item, true);
			}
		};
	}

	private createDeleteAction(item: ITrustedUriItem): IAction {
		return {
			label: '',
			class: ThemeIcon.asClassName(removeIcon),
			enabled: true,
			id: 'deleteTrustedUri',
			tooltip: localize('deleteTrustedUri', "Delete Path"),
			run: async () => {
				await this.table.delete(item);
			}
		};
	}

	disposeTemplate(templateData: IActionsColumnTemplateData): void {
		templateData.actionBar.dispose();
	}

}

interface ITrustedUriPathColumnTemplateData {
	element: HTMLElement;
	pathLabel: HTMLElement;
	pathInput: InputBox;
	renderDisposables: DisposableStore;
	disposables: DisposableStore;
}

class TrustedUriPathColumnRenderer implements ITableRenderer<ITrustedUriItem, ITrustedUriPathColumnTemplateData> {
	static readonly TEMPLATE_ID = 'path';

	readonly templateId: string = TrustedUriPathColumnRenderer.TEMPLATE_ID;
	private currentItem?: ITrustedUriItem;

	constructor(
		private readonly table: WorkspaceTrustedUrisTable,
		@IContextViewService private readonly contextViewService: IContextViewService
	) {
	}

	renderTemplate(container: HTMLElement): ITrustedUriPathColumnTemplateData {
		const element = container.appendChild($('.path'));
		const pathLabel = element.appendChild($('div.path-label'));

		const pathInput = new InputBox(element, this.contextViewService, {
			validationOptions: {
				validation: value => this.table.validateUri(value, this.currentItem)
			},
			inputBoxStyles: defaultInputBoxStyles
		});

		const disposables = new DisposableStore();
		const renderDisposables = disposables.add(new DisposableStore());

		return {
			element,
			pathLabel,
			pathInput,
			disposables,
			renderDisposables
		};
	}

	renderElement(item: ITrustedUriItem, index: number, templateData: ITrustedUriPathColumnTemplateData): void {
		templateData.renderDisposables.clear();

		this.currentItem = item;
		templateData.renderDisposables.add(this.table.onEdit(async (e) => {
			if (item === e) {
				templateData.element.classList.add('input-mode');
				templateData.pathInput.focus();
				templateData.pathInput.select();
				templateData.element.parentElement!.style.paddingLeft = '0px';
			}
		}));

		// stop double click action from re-rendering the element on the table #125052
		templateData.renderDisposables.add(addDisposableListener(templateData.pathInput.element, EventType.DBLCLICK, e => {
			EventHelper.stop(e);
		}));


		const hideInputBox = () => {
			templateData.element.classList.remove('input-mode');
			templateData.element.parentElement!.style.paddingLeft = '5px';
		};

		const accept = () => {
			hideInputBox();

			const pathToUse = templateData.pathInput.value;
			const uri = hasDriveLetter(pathToUse) ? item.uri.with({ path: posix.sep + toSlashes(pathToUse) }) : item.uri.with({ path: pathToUse });
			templateData.pathLabel.innerText = this.formatPath(uri);

			if (uri) {
				this.table.acceptEdit(item, uri);
			}
		};

		const reject = () => {
			hideInputBox();
			templateData.pathInput.value = stringValue;
			this.table.rejectEdit(item);
		};

		templateData.renderDisposables.add(addStandardDisposableListener(templateData.pathInput.inputElement, EventType.KEY_DOWN, e => {
			let handled = false;
			if (e.equals(KeyCode.Enter)) {
				accept();
				handled = true;
			} else if (e.equals(KeyCode.Escape)) {
				reject();
				handled = true;
			}

			if (handled) {
				e.preventDefault();
				e.stopPropagation();
			}
		}));
		templateData.renderDisposables.add((addDisposableListener(templateData.pathInput.inputElement, EventType.BLUR, () => {
			reject();
		})));

		const stringValue = this.formatPath(item.uri);
		templateData.pathInput.value = stringValue;
		templateData.pathLabel.innerText = stringValue;
		templateData.element.classList.toggle('current-workspace-parent', item.parentOfWorkspaceItem);
	}

	disposeTemplate(templateData: ITrustedUriPathColumnTemplateData): void {
		templateData.disposables.dispose();
		templateData.renderDisposables.dispose();
	}

	private formatPath(uri: URI): string {
		if (uri.scheme === Schemas.file) {
			return normalizeDriveLetter(uri.fsPath);
		}

		// If the path is not a file uri, but points to a windows remote, we should create windows fs path
		// e.g. /c:/user/directory => C:\user\directory
		if (uri.path.startsWith(posix.sep)) {
			const pathWithoutLeadingSeparator = uri.path.substring(1);
			const isWindowsPath = hasDriveLetter(pathWithoutLeadingSeparator, true);
			if (isWindowsPath) {
				return normalizeDriveLetter(win32.normalize(pathWithoutLeadingSeparator), true);
			}
		}

		return uri.path;
	}

}


interface ITrustedUriHostColumnTemplateData {
	element: HTMLElement;
	hostContainer: HTMLElement;
	buttonBarContainer: HTMLElement;
	disposables: DisposableStore;
	renderDisposables: DisposableStore;
}

function getHostLabel(labelService: ILabelService, item: ITrustedUriItem): string {
	return item.uri.authority ? labelService.getHostLabel(item.uri.scheme, item.uri.authority) : localize('localAuthority', "Local");
}

class TrustedUriHostColumnRenderer implements ITableRenderer<ITrustedUriItem, ITrustedUriHostColumnTemplateData> {
	static readonly TEMPLATE_ID = 'host';

	readonly templateId: string = TrustedUriHostColumnRenderer.TEMPLATE_ID;

	constructor(
		@ILabelService private readonly labelService: ILabelService,
	) { }

	renderTemplate(container: HTMLElement): ITrustedUriHostColumnTemplateData {
		const disposables = new DisposableStore();
		const renderDisposables = disposables.add(new DisposableStore());

		const element = container.appendChild($('.host'));
		const hostContainer = element.appendChild($('div.host-label'));
		const buttonBarContainer = element.appendChild($('div.button-bar'));

		return {
			element,
			hostContainer,
			buttonBarContainer,
			disposables,
			renderDisposables
		};
	}

	renderElement(item: ITrustedUriItem, index: number, templateData: ITrustedUriHostColumnTemplateData): void {
		templateData.renderDisposables.clear();
		templateData.renderDisposables.add({ dispose: () => { clearNode(templateData.buttonBarContainer); } });

		templateData.hostContainer.innerText = getHostLabel(this.labelService, item);
		templateData.element.classList.toggle('current-workspace-parent', item.parentOfWorkspaceItem);

		templateData.hostContainer.style.display = '';
		templateData.buttonBarContainer.style.display = 'none';
	}

	disposeTemplate(templateData: ITrustedUriHostColumnTemplateData): void {
		templateData.disposables.dispose();
	}

}

export class WorkspaceTrustEditor extends EditorPane {
	static readonly ID: string = 'workbench.editor.workspaceTrust';
	private rootElement!: HTMLElement;

	// Header Section
	private headerContainer!: HTMLElement;
	private headerTitleContainer!: HTMLElement;
	private headerTitleIcon!: HTMLElement;
	private headerTitleText!: HTMLElement;
	private headerDescription!: HTMLElement;

	private bodyScrollBar!: DomScrollableElement;

	// Affected Features Section
	private affectedFeaturesContainer!: HTMLElement;
	private trustedContainer!: HTMLElement;
	private untrustedContainer!: HTMLElement;

	// Settings Section
	private configurationContainer!: HTMLElement;
	private workspaceTrustedUrisTable!: WorkspaceTrustedUrisTable;

	constructor(
		group: IEditorGroup,
		@ITelemetryService telemetryService: ITelemetryService,
		@IThemeService themeService: IThemeService,
		@IStorageService storageService: IStorageService,
		@IWorkspaceContextService private readonly workspaceService: IWorkspaceContextService,
		@IExtensionsWorkbenchService private readonly extensionWorkbenchService: IExtensionsWorkbenchService,
		@IExtensionManifestPropertiesService private readonly extensionManifestPropertiesService: IExtensionManifestPropertiesService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IWorkspaceTrustManagementService private readonly workspaceTrustManagementService: IWorkspaceTrustManagementService,
		@IWorkbenchConfigurationService private readonly configurationService: IWorkbenchConfigurationService,
		@IWorkbenchExtensionEnablementService private readonly extensionEnablementService: IWorkbenchExtensionEnablementService,
		@IProductService private readonly productService: IProductService,
		@IKeybindingService private readonly keybindingService: IKeybindingService,
	) { super(WorkspaceTrustEditor.ID, group, telemetryService, themeService, storageService); }

	protected createEditor(parent: HTMLElement): void {
		this.rootElement = append(parent, $('.workspace-trust-editor', { tabindex: '0' }));

		this.createHeaderElement(this.rootElement);

		const scrollableContent = $('.workspace-trust-editor-body');
		this.bodyScrollBar = this._register(new DomScrollableElement(scrollableContent, {
			horizontal: ScrollbarVisibility.Hidden,
			vertical: ScrollbarVisibility.Auto,
		}));

		append(this.rootElement, this.bodyScrollBar.getDomNode());

		this.createAffectedFeaturesElement(scrollableContent);
		this.createConfigurationElement(scrollableContent);

		this.rootElement.style.setProperty('--workspace-trust-selected-color', asCssVariable(buttonBackground));
		this.rootElement.style.setProperty('--workspace-trust-unselected-color', asCssVariable(buttonSecondaryBackground));
		this.rootElement.style.setProperty('--workspace-trust-check-color', asCssVariable(debugIconStartForeground));
		this.rootElement.style.setProperty('--workspace-trust-x-color', asCssVariable(editorErrorForeground));

		// Navigate page with keyboard
		this._register(addDisposableListener(this.rootElement, EventType.KEY_DOWN, e => {
			const event = new StandardKeyboardEvent(e);

			if (event.equals(KeyCode.UpArrow) || event.equals(KeyCode.DownArrow)) {
				const navOrder = [this.headerContainer, this.trustedContainer, this.untrustedContainer, this.configurationContainer];
				const currentIndex = navOrder.findIndex(element => {
					return isAncestorOfActiveElement(element);
				});

				let newIndex = currentIndex;
				if (event.equals(KeyCode.DownArrow)) {
					newIndex++;
				} else if (event.equals(KeyCode.UpArrow)) {
					newIndex = Math.max(0, newIndex);
					newIndex--;
				}

				newIndex += navOrder.length;
				newIndex %= navOrder.length;

				navOrder[newIndex].focus();
			} else if (event.equals(KeyCode.Escape)) {
				this.rootElement.focus();
			} else if (event.equals(KeyMod.CtrlCmd | KeyCode.Enter)) {
				if (this.workspaceTrustManagementService.canSetWorkspaceTrust()) {
					this.workspaceTrustManagementService.setWorkspaceTrust(!this.workspaceTrustManagementService.isWorkspaceTrusted());
				}
			} else if (event.equals(KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.Enter)) {
				if (this.workspaceTrustManagementService.canSetParentFolderTrust()) {
					this.workspaceTrustManagementService.setParentFolderTrust(true);
				}
			}
		}));
	}

	override focus() {
		super.focus();

		this.rootElement.focus();
	}

	override async setInput(input: WorkspaceTrustEditorInput, options: IEditorOptions | undefined, context: IEditorOpenContext, token: CancellationToken): Promise<void> {

		await super.setInput(input, options, context, token);
		if (token.isCancellationRequested) { return; }

		await this.workspaceTrustManagementService.workspaceTrustInitialized;
		this.registerListeners();
		await this.render();
	}

	private registerListeners(): void {
		this._register(this.extensionWorkbenchService.onChange(() => this.render()));
		this._register(this.configurationService.onDidChangeRestrictedSettings(() => this.render()));
		this._register(this.workspaceTrustManagementService.onDidChangeTrust(() => this.render()));
		this._register(this.workspaceTrustManagementService.onDidChangeTrustedFolders(() => this.render()));
	}

	private getHeaderContainerClass(trusted: boolean): string {
		if (trusted) {
			return 'workspace-trust-header workspace-trust-trusted';
		}

		return 'workspace-trust-header workspace-trust-untrusted';
	}

	private getHeaderTitleText(trusted: boolean): string {
		if (trusted) {
			if (this.workspaceTrustManagementService.isWorkspaceTrustForced()) {
				return localize('trustedUnsettableWindow', "This window is trusted");
			}

			switch (this.workspaceService.getWorkbenchState()) {
				case WorkbenchState.EMPTY:
					return localize('trustedHeaderWindow', "You trust this window");
				case WorkbenchState.FOLDER:
					return localize('trustedHeaderFolder', "You trust this folder");
				case WorkbenchState.WORKSPACE:
					return localize('trustedHeaderWorkspace', "You trust this workspace");
			}
		}

		return localize('untrustedHeader', "You are in Restricted Mode");
	}

	private getHeaderTitleIconClassNames(trusted: boolean): string[] {
		return ThemeIcon.asClassNameArray(shieldIcon);
	}

	private getFeaturesHeaderText(trusted: boolean): [string, string] {
		let title: string = '';
		let subTitle: string = '';

		switch (this.workspaceService.getWorkbenchState()) {
			case WorkbenchState.EMPTY: {
				title = trusted ? localize('trustedWindow', "In a Trusted Window") : localize('untrustedWorkspace', "In Restricted Mode");
				subTitle = trusted ? localize('trustedWindowSubtitle', "You trust the authors of the files in the current window. All features are enabled:") :
					localize('untrustedWindowSubtitle', "You do not trust the authors of the files in the current window. The following features are disabled:");
				break;
			}
			case WorkbenchState.FOLDER: {
				title = trusted ? localize('trustedFolder', "In a Trusted Folder") : localize('untrustedWorkspace', "In Restricted Mode");
				subTitle = trusted ? localize('trustedFolderSubtitle', "You trust the authors of the files in the current folder. All features are enabled:") :
					localize('untrustedFolderSubtitle', "You do not trust the authors of the files in the current folder. The following features are disabled:");
				break;
			}
			case WorkbenchState.WORKSPACE: {
				title = trusted ? localize('trustedWorkspace', "In a Trusted Workspace") : localize('untrustedWorkspace', "In Restricted Mode");
				subTitle = trusted ? localize('trustedWorkspaceSubtitle', "You trust the authors of the files in the current workspace. All features are enabled:") :
					localize('untrustedWorkspaceSubtitle', "You do not trust the authors of the files in the current workspace. The following features are disabled:");
				break;
			}
		}

		return [title, subTitle];
	}

	private rendering = false;
	private readonly rerenderDisposables: DisposableStore = this._register(new DisposableStore());
	@debounce(100)
	private async render() {
		if (this.rendering) {
			return;
		}

		this.rendering = true;
		this.rerenderDisposables.clear();

		const isWorkspaceTrusted = this.workspaceTrustManagementService.isWorkspaceTrusted();
		this.rootElement.classList.toggle('trusted', isWorkspaceTrusted);
		this.rootElement.classList.toggle('untrusted', !isWorkspaceTrusted);

		// Header Section
		this.headerTitleText.innerText = this.getHeaderTitleText(isWorkspaceTrusted);
		this.headerTitleIcon.className = 'workspace-trust-title-icon';
		this.headerTitleIcon.classList.add(...this.getHeaderTitleIconClassNames(isWorkspaceTrusted));
		this.headerDescription.innerText = '';

		const headerDescriptionText = append(this.headerDescription, $('div'));
		headerDescriptionText.innerText = isWorkspaceTrusted ?
			localize('trustedDescription', "All features are enabled because trust has been granted to the workspace.") :
			localize('untrustedDescription', "{0} is in a restricted mode intended for safe code browsing.", this.productService.nameShort);

		const headerDescriptionActions = append(this.headerDescription, $('div'));
		const headerDescriptionActionsText = localize({ key: 'workspaceTrustEditorHeaderActions', comment: ['Please ensure the markdown link syntax is not broken up with whitespace [text block](link block)'] }, "[Configure your settings]({0}) or [learn more](https://aka.ms/vscode-workspace-trust).", `command:workbench.trust.configure`);
		for (const node of parseLinkedText(headerDescriptionActionsText).nodes) {
			if (typeof node === 'string') {
				append(headerDescriptionActions, document.createTextNode(node));
			} else {
				this.rerenderDisposables.add(this.instantiationService.createInstance(Link, headerDescriptionActions, { ...node, tabIndex: -1 }, {}));
			}
		}

		this.headerContainer.className = this.getHeaderContainerClass(isWorkspaceTrusted);
		this.rootElement.setAttribute('aria-label', `${localize('root element label', "Manage Workspace Trust")}:  ${this.headerContainer.innerText}`);

		// Settings
		const restrictedSettings = this.configurationService.restrictedSettings;
		const configurationRegistry = Registry.as<IConfigurationRegistry>(Extensions.Configuration);
		const settingsRequiringTrustedWorkspaceCount = restrictedSettings.default.filter(key => {
			const property = configurationRegistry.getConfigurationProperties()[key];

			// cannot be configured in workspace
			if (property.scope && (APPLICATION_SCOPES.includes(property.scope) || property.scope === ConfigurationScope.MACHINE)) {
				return false;
			}

			// If deprecated include only those configured in the workspace
			if (property.deprecationMessage || property.markdownDeprecationMessage) {
				if (restrictedSettings.workspace?.includes(key)) {
					return true;
				}
				if (restrictedSettings.workspaceFolder) {
					for (const workspaceFolderSettings of restrictedSettings.workspaceFolder.values()) {
						if (workspaceFolderSettings.includes(key)) {
							return true;
						}
					}
				}
				return false;
			}

			return true;
		}).length;

		// Features List
		this.renderAffectedFeatures(settingsRequiringTrustedWorkspaceCount, this.getExtensionCount());

		// Configuration Tree
		this.workspaceTrustedUrisTable.updateTable();

		this.bodyScrollBar.getDomNode().style.height = `calc(100% - ${this.headerContainer.clientHeight}px)`;
		this.bodyScrollBar.scanDomNode();
		this.rendering = false;
	}

	private getExtensionCount(): number {
		const set = new Set<string>();

		const inVirtualWorkspace = isVirtualWorkspace(this.workspaceService.getWorkspace());
		const localExtensions = this.extensionWorkbenchService.local.filter(ext => ext.local).map(ext => ext.local!);

		for (const extension of localExtensions) {
			const enablementState = this.extensionEnablementService.getEnablementState(extension);
			if (enablementState !== EnablementState.EnabledGlobally && enablementState !== EnablementState.EnabledWorkspace &&
				enablementState !== EnablementState.DisabledByTrustRequirement && enablementState !== EnablementState.DisabledByExtensionDependency) {
				continue;
			}

			if (inVirtualWorkspace && this.extensionManifestPropertiesService.getExtensionVirtualWorkspaceSupportType(extension.manifest) === false) {
				continue;
			}

			if (this.extensionManifestPropertiesService.getExtensionUntrustedWorkspaceSupportType(extension.manifest) !== true) {
				set.add(extension.identifier.id);
				continue;
			}

			const dependencies = getExtensionDependencies(localExtensions, extension);
			if (dependencies.some(ext => this.extensionManifestPropertiesService.getExtensionUntrustedWorkspaceSupportType(ext.manifest) === false)) {
				set.add(extension.identifier.id);
			}
		}

		return set.size;
	}

	private createHeaderElement(parent: HTMLElement): void {
		this.headerContainer = append(parent, $('.workspace-trust-header', { tabIndex: '0' }));
		this.headerTitleContainer = append(this.headerContainer, $('.workspace-trust-title'));
		this.headerTitleIcon = append(this.headerTitleContainer, $('.workspace-trust-title-icon'));
		this.headerTitleText = append(this.headerTitleContainer, $('.workspace-trust-title-text'));
		this.headerDescription = append(this.headerContainer, $('.workspace-trust-description'));
	}

	private createConfigurationElement(parent: HTMLElement): void {
		this.configurationContainer = append(parent, $('.workspace-trust-settings', { tabIndex: '0' }));
		const configurationTitle = append(this.configurationContainer, $('.workspace-trusted-folders-title'));
		configurationTitle.innerText = localize('trustedFoldersAndWorkspaces', "Trusted Folders & Workspaces");

		this.workspaceTrustedUrisTable = this._register(this.instantiationService.createInstance(WorkspaceTrustedUrisTable, this.configurationContainer));
	}

	private createAffectedFeaturesElement(parent: HTMLElement): void {
		this.affectedFeaturesContainer = append(parent, $('.workspace-trust-features'));
		this.trustedContainer = append(this.affectedFeaturesContainer, $('.workspace-trust-limitations.trusted', { tabIndex: '0' }));
		this.untrustedContainer = append(this.affectedFeaturesContainer, $('.workspace-trust-limitations.untrusted', { tabIndex: '0' }));
	}

	private async renderAffectedFeatures(numSettings: number, numExtensions: number): Promise<void> {
		clearNode(this.trustedContainer);
		clearNode(this.untrustedContainer);

		// Trusted features
		const [trustedTitle, trustedSubTitle] = this.getFeaturesHeaderText(true);

		this.renderLimitationsHeaderElement(this.trustedContainer, trustedTitle, trustedSubTitle);
		const trustedContainerItems = this.workspaceService.getWorkbenchState() === WorkbenchState.EMPTY ?
			[
				localize('trustedTasks', "Tasks are allowed to run"),
				localize('trustedDebugging', "Debugging is enabled"),
				localize('trustedExtensions', "All enabled extensions are activated")
			] :
			[
				localize('trustedTasks', "Tasks are allowed to run"),
				localize('trustedDebugging', "Debugging is enabled"),
				localize('trustedSettings', "All workspace settings are applied"),
				localize('trustedExtensions', "All enabled extensions are activated")
			];
		this.renderLimitationsListElement(this.trustedContainer, trustedContainerItems, ThemeIcon.asClassNameArray(checkListIcon));

		// Restricted Mode features
		const [untrustedTitle, untrustedSubTitle] = this.getFeaturesHeaderText(false);

		this.renderLimitationsHeaderElement(this.untrustedContainer, untrustedTitle, untrustedSubTitle);
		const untrustedContainerItems = this.workspaceService.getWorkbenchState() === WorkbenchState.EMPTY ?
			[
				localize('untrustedTasks', "Tasks are not allowed to run"),
				localize('untrustedDebugging', "Debugging is disabled"),
				fixBadLocalizedLinks(localize({ key: 'untrustedExtensions', comment: ['Please ensure the markdown link syntax is not broken up with whitespace [text block](link block)'] }, "[{0} extensions]({1}) are disabled or have limited functionality", numExtensions, `command:${LIST_WORKSPACE_UNSUPPORTED_EXTENSIONS_COMMAND_ID}`))
			] :
			[
				localize('untrustedTasks', "Tasks are not allowed to run"),
				localize('untrustedDebugging', "Debugging is disabled"),
				fixBadLocalizedLinks(numSettings ? localize({ key: 'untrustedSettings', comment: ['Please ensure the markdown link syntax is not broken up with whitespace [text block](link block)'] }, "[{0} workspace settings]({1}) are not applied", numSettings, 'command:settings.filterUntrusted') : localize('no untrustedSettings', "Workspace settings requiring trust are not applied")),
				fixBadLocalizedLinks(localize({ key: 'untrustedExtensions', comment: ['Please ensure the markdown link syntax is not broken up with whitespace [text block](link block)'] }, "[{0} extensions]({1}) are disabled or have limited functionality", numExtensions, `command:${LIST_WORKSPACE_UNSUPPORTED_EXTENSIONS_COMMAND_ID}`))
			];
		this.renderLimitationsListElement(this.untrustedContainer, untrustedContainerItems, ThemeIcon.asClassNameArray(xListIcon));

		if (this.workspaceTrustManagementService.isWorkspaceTrusted()) {
			if (this.workspaceTrustManagementService.canSetWorkspaceTrust()) {
				this.addDontTrustButtonToElement(this.untrustedContainer);
			} else {
				this.addTrustedTextToElement(this.untrustedContainer);
			}
		} else {
			if (this.workspaceTrustManagementService.canSetWorkspaceTrust()) {
				this.addTrustButtonToElement(this.trustedContainer);
			}
		}
	}

	private createButtonRow(parent: HTMLElement, buttonInfo: { action: Action; keybinding: ResolvedKeybinding }[], enabled?: boolean): void {
		const buttonRow = append(parent, $('.workspace-trust-buttons-row'));
		const buttonContainer = append(buttonRow, $('.workspace-trust-buttons'));
		const buttonBar = this.rerenderDisposables.add(new ButtonBar(buttonContainer));

		for (const { action, keybinding } of buttonInfo) {
			const button = buttonBar.addButtonWithDescription(defaultButtonStyles);

			button.label = action.label;
			button.enabled = enabled !== undefined ? enabled : action.enabled;
			button.description = keybinding.getLabel()!;
			button.element.ariaLabel = action.label + ', ' + localize('keyboardShortcut', "Keyboard Shortcut: {0}", keybinding.getAriaLabel()!);

			this.rerenderDisposables.add(button.onDidClick(e => {
				if (e) {
					EventHelper.stop(e, true);
				}

				action.run();
			}));
		}
	}

	private addTrustButtonToElement(parent: HTMLElement): void {
		const trustAction = this.rerenderDisposables.add(new Action('workspace.trust.button.action.grant', localize('trustButton', "Trust"), undefined, true, async () => {
			await this.workspaceTrustManagementService.setWorkspaceTrust(true);
		}));

		const trustActions = [{ action: trustAction, keybinding: this.keybindingService.resolveUserBinding(isMacintosh ? 'Cmd+Enter' : 'Ctrl+Enter')[0] }];

		if (this.workspaceTrustManagementService.canSetParentFolderTrust()) {
			const workspaceIdentifier = toWorkspaceIdentifier(this.workspaceService.getWorkspace()) as ISingleFolderWorkspaceIdentifier;
			const name = basename(dirname(workspaceIdentifier.uri));

			const trustMessageElement = append(parent, $('.trust-message-box'));
			trustMessageElement.innerText = localize('trustMessage', "Trust the authors of all files in the current folder or its parent '{0}'.", name);

			const trustParentAction = this.rerenderDisposables.add(new Action('workspace.trust.button.action.grantParent', localize('trustParentButton', "Trust Parent"), undefined, true, async () => {
				await this.workspaceTrustManagementService.setParentFolderTrust(true);
			}));

			trustActions.push({ action: trustParentAction, keybinding: this.keybindingService.resolveUserBinding(isMacintosh ? 'Cmd+Shift+Enter' : 'Ctrl+Shift+Enter')[0] });
		}

		this.createButtonRow(parent, trustActions);
	}

	private addDontTrustButtonToElement(parent: HTMLElement): void {
		this.createButtonRow(parent, [{
			action: this.rerenderDisposables.add(new Action('workspace.trust.button.action.deny', localize('dontTrustButton', "Don't Trust"), undefined, true, async () => {
				await this.workspaceTrustManagementService.setWorkspaceTrust(false);
			})),
			keybinding: this.keybindingService.resolveUserBinding(isMacintosh ? 'Cmd+Enter' : 'Ctrl+Enter')[0]
		}]);
	}

	private addTrustedTextToElement(parent: HTMLElement): void {
		if (this.workspaceService.getWorkbenchState() === WorkbenchState.EMPTY) {
			return;
		}

		const textElement = append(parent, $('.workspace-trust-untrusted-description'));
		if (!this.workspaceTrustManagementService.isWorkspaceTrustForced()) {
			textElement.innerText = this.workspaceService.getWorkbenchState() === WorkbenchState.WORKSPACE ? localize('untrustedWorkspaceReason', "This workspace is trusted via the bolded entries in the trusted folders below.") : localize('untrustedFolderReason', "This folder is trusted via the bolded entries in the trusted folders below.");
		} else {
			textElement.innerText = localize('trustedForcedReason', "This window is trusted by nature of the workspace that is opened.");
		}
	}

	private renderLimitationsHeaderElement(parent: HTMLElement, headerText: string, subtitleText: string): void {
		const limitationsHeaderContainer = append(parent, $('.workspace-trust-limitations-header'));
		const titleElement = append(limitationsHeaderContainer, $('.workspace-trust-limitations-title'));
		const textElement = append(titleElement, $('.workspace-trust-limitations-title-text'));
		const subtitleElement = append(limitationsHeaderContainer, $('.workspace-trust-limitations-subtitle'));

		textElement.innerText = headerText;
		subtitleElement.innerText = subtitleText;
	}

	private renderLimitationsListElement(parent: HTMLElement, limitations: string[], iconClassNames: string[]): void {
		const listContainer = append(parent, $('.workspace-trust-limitations-list-container'));
		const limitationsList = append(listContainer, $('ul'));
		for (const limitation of limitations) {
			const limitationListItem = append(limitationsList, $('li'));
			const icon = append(limitationListItem, $('.list-item-icon'));
			const text = append(limitationListItem, $('.list-item-text'));

			icon.classList.add(...iconClassNames);

			const linkedText = parseLinkedText(limitation);
			for (const node of linkedText.nodes) {
				if (typeof node === 'string') {
					append(text, document.createTextNode(node));
				} else {
					this.rerenderDisposables.add(this.instantiationService.createInstance(Link, text, { ...node, tabIndex: -1 }, {}));
				}
			}
		}
	}

	private layoutParticipants: { layout: () => void }[] = [];
	layout(dimension: Dimension): void {
		if (!this.isVisible()) {
			return;
		}

		this.workspaceTrustedUrisTable.layout();

		this.layoutParticipants.forEach(participant => {
			participant.layout();
		});

		this.bodyScrollBar.scanDomNode();
	}
}

// Highly scoped fix for #126614
function fixBadLocalizedLinks(badString: string): string {
	const regex = /(.*)\[(.+)\]\s*\((.+)\)(.*)/; // markdown link match with spaces
	return badString.replace(regex, '$1[$2]($3)$4');
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/workspace/browser/media/workspaceTrustEditor.css]---
Location: vscode-main/src/vs/workbench/contrib/workspace/browser/media/workspaceTrustEditor.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.workspace-trust-editor {
	max-width: 1000px;
	padding-top: 11px;
	margin: auto;
	height: calc(100% - 11px);
}

.workspace-trust-editor:focus {
	outline: none !important;
}

.workspace-trust-editor > .workspace-trust-header {
	padding: 14px;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.workspace-trust-editor .workspace-trust-header .workspace-trust-title {
	font-size: 24px;
	font-weight: 600;
	line-height: 32px;
	padding: 10px 0px;
	display: flex;
}

.workspace-trust-editor .workspace-trust-header .workspace-trust-title .workspace-trust-title-icon {
	font-size: 32px;
	margin-right: 8px;
}

.workspace-trust-editor .workspace-trust-header .workspace-trust-title .workspace-trust-title-icon {
	color: var(--workspace-trust-selected-color) !important;
}

.workspace-trust-editor .workspace-trust-header .workspace-trust-description {
	cursor: default;
	user-select: text;
	max-width: 600px;
	text-align: center;
	padding: 14px 0;
}

.workspace-trust-editor .workspace-trust-section-title {
	font-weight: 600;
	font-size: 18px;
	padding-bottom: 5px;
}

.workspace-trust-editor .workspace-trust-subsection-title {
	font-size: 16px;
	font-weight: 600;
	line-height: 32px;
}

.workspace-trust-editor .workspace-trust-editor-body {
	height: 100%;
}

/** Features List */
.workspace-trust-editor .workspace-trust-features {
	padding: 14px;
	cursor: default;
	user-select: text;
	display: flex;
	flex-direction: row;
	flex-flow: wrap;
	justify-content: space-evenly;
}

.workspace-trust-editor .workspace-trust-features .workspace-trust-limitations {
	min-height: 315px;
	border: 1px solid var(--workspace-trust-unselected-color);
	margin: 4px 4px;
	display: flex;
	flex-direction: column;
	padding: 10px 40px;
}

.workspace-trust-editor.trusted .workspace-trust-features .workspace-trust-limitations.trusted,
.workspace-trust-editor.untrusted .workspace-trust-features .workspace-trust-limitations.untrusted {
	border-width: 2px;
	border-color: var(--workspace-trust-selected-color) !important;
	padding: 9px 39px;
	outline-offset: 2px;
}

.workspace-trust-editor .workspace-trust-features .workspace-trust-limitations ul {
	list-style: none;
	padding-inline-start: 0px;
}

.workspace-trust-editor .workspace-trust-features .workspace-trust-limitations li {
	display: flex;
	padding-bottom: 10px;
}

.workspace-trust-editor .workspace-trust-features .workspace-trust-limitations .list-item-icon {
	padding-right: 5px;
	line-height: 24px;
}

.workspace-trust-editor .workspace-trust-features .workspace-trust-limitations.trusted .list-item-icon {
	color: var(--workspace-trust-check-color) !important;
	font-size: 18px;
}

.workspace-trust-editor .workspace-trust-features .workspace-trust-limitations.untrusted .list-item-icon {
	color: var(--workspace-trust-x-color) !important;
	font-size: 20px;
}

.workspace-trust-editor .workspace-trust-features .workspace-trust-limitations .list-item-text {
	font-size: 16px;
	line-height: 24px;
}

.workspace-trust-editor .workspace-trust-features .workspace-trust-limitations-header {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.workspace-trust-editor .workspace-trust-features .workspace-trust-limitations-header .workspace-trust-limitations-title {
	font-size: 16px;
	font-weight: 600;
	line-height: 24px;
	padding: 10px 0px;
	display: flex;
}

.workspace-trust-editor .workspace-trust-features .workspace-trust-limitations-header .workspace-trust-limitations-title .workspace-trust-title-icon {
	font-size: 24px;
	margin-right: 8px;
	display: none;
}

.workspace-trust-editor.trusted .workspace-trust-features .workspace-trust-limitations.trusted .workspace-trust-limitations-header .workspace-trust-limitations-title .workspace-trust-title-icon,
.workspace-trust-editor.untrusted .workspace-trust-features .workspace-trust-limitations.untrusted .workspace-trust-limitations-header .workspace-trust-limitations-title .workspace-trust-title-icon {
	display: unset;
	color: var(--workspace-trust-selected-color) !important;
}

.workspace-trust-editor .workspace-trust-features .workspace-trust-untrusted-description {
	font-style: italic;
	padding-bottom: 10px;
}

/** Buttons Container */
.workspace-trust-editor .workspace-trust-features .workspace-trust-buttons-row {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 5px 0 10px 0;
	overflow: hidden; /* buttons row should never overflow */
	white-space: nowrap;
	margin-top: auto;
}

/** Buttons */
.workspace-trust-editor .workspace-trust-features .workspace-trust-buttons-row .workspace-trust-buttons,
.workspace-trust-editor .workspace-trust-settings .trusted-uris-button-bar {
	display: flex;
	overflow: hidden;
}

.workspace-trust-editor .workspace-trust-settings .trusted-uris-button-bar {
	margin-top: 5px;
}

.workspace-trust-editor .workspace-trust-settings .trusted-uris-button-bar .monaco-button {
	width: fit-content;
	padding: 5px 10px;
	overflow: hidden;
	text-overflow: ellipsis;
	outline-offset: 2px !important;
}

.workspace-trust-editor .workspace-trust-features .workspace-trust-buttons-row .workspace-trust-buttons > .monaco-button,
.workspace-trust-editor .workspace-trust-features .workspace-trust-buttons-row .workspace-trust-buttons > .monaco-button-dropdown,
.workspace-trust-editor .workspace-trust-settings .trusted-uris-button-bar .monaco-button {
	margin: 4px 5px; /* allows button focus outline to be visible */
}

.workspace-trust-editor .workspace-trust-features .workspace-trust-buttons-row .workspace-trust-buttons .monaco-button-dropdown .monaco-dropdown-button {
	padding: 5px;
}

.workspace-trust-limitations {
	width: 50%;
	max-width: 350px;
	min-width: 250px;
	flex: 1;
}

.workspace-trust-intro-dialog {
	min-width: min(50vw, 500px);
	padding-right: 24px;
}

.workspace-trust-intro-dialog .workspace-trust-dialog-image-row p {
	display: flex;
	align-items: center;
}

.workspace-trust-intro-dialog .workspace-trust-dialog-image-row.badge-row img {
	max-height: 40px;
	padding-right: 10px;
}

.workspace-trust-intro-dialog .workspace-trust-dialog-image-row.status-bar img {
	max-height: 32px;
	padding-right: 10px;
}

.workspace-trust-editor .workspace-trust-settings {
	padding: 20px 14px;
}

.workspace-trust-editor .workspace-trust-settings .workspace-trusted-folders-title {
	font-weight: 600;
}

.workspace-trust-editor .empty > .trusted-uris-table {
	display: none;
}

.workspace-trust-editor .monaco-table-tr .monaco-table-td .path {
	width: 100%;
}

.workspace-trust-editor .monaco-table-tr .monaco-table-td .path:not(.input-mode) .monaco-inputbox,
.workspace-trust-editor .monaco-table-tr .monaco-table-td .path.input-mode .path-label {
	display: none;
}

.workspace-trust-editor .monaco-table-tr .monaco-table-td .current-workspace-parent .path-label,
.workspace-trust-editor .monaco-table-tr .monaco-table-td .current-workspace-parent .host-label {
	font-weight: bold;
	font-style: italic;
}

.workspace-trust-editor .monaco-table-th,
.workspace-trust-editor .monaco-table-td {
	padding-left: 5px;
}

.workspace-trust-editor .workspace-trust-settings .monaco-action-bar .action-item > .codicon {
	display: flex;
	align-items: center;
	justify-content: center;
	color: inherit;
}

.workspace-trust-editor .workspace-trust-settings .monaco-table-tr .monaco-table-td {
	align-items: center;
	display: flex;
	overflow: hidden;
}

.workspace-trust-editor .workspace-trust-settings .monaco-table-tr .monaco-table-td .host,
.workspace-trust-editor .workspace-trust-settings .monaco-table-tr .monaco-table-td .path {
	max-width: 100%;
}

.workspace-trust-editor .workspace-trust-settings .monaco-table-tr .monaco-table-td .actions {
	width: 100%;
}

.workspace-trust-editor .workspace-trust-settings .monaco-table-tr .monaco-table-td .actions .actions-container {
	justify-content: flex-end;
	padding-right: 3px;
}

.workspace-trust-editor .workspace-trust-settings .monaco-table-tr .monaco-table-td .monaco-button {
	height: 18px;
	padding-left: 8px;
	padding-right: 8px;
}

.workspace-trust-editor .workspace-trust-settings .monaco-table-tr .monaco-table-td .actions .monaco-action-bar {
	display: none;
	flex: 1;
}

.workspace-trust-editor .workspace-trust-settings .monaco-list-row.selected .monaco-table-tr .monaco-table-td .actions .monaco-action-bar,
.workspace-trust-editor .workspace-trust-settings .monaco-table .monaco-list-row.focused .monaco-table-tr .monaco-table-td .actions .monaco-action-bar,
.workspace-trust-editor .workspace-trust-settings .monaco-list-row:hover .monaco-table-tr .monaco-table-td .actions .monaco-action-bar {
	display: flex;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/workspace/common/workspace.ts]---
Location: vscode-main/src/vs/workbench/contrib/workspace/common/workspace.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';

/**
 * Trust Context Keys
 */

export const WorkspaceTrustContext = {
	IsEnabled: new RawContextKey<boolean>('isWorkspaceTrustEnabled', false, localize('workspaceTrustEnabledCtx', "Whether the workspace trust feature is enabled.")),
	IsTrusted: new RawContextKey<boolean>('isWorkspaceTrusted', false, localize('workspaceTrustedCtx', "Whether the current workspace has been trusted by the user."))
};

export const MANAGE_TRUST_COMMAND_ID = 'workbench.trust.manage';
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/workspaces/browser/workspaces.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/workspaces/browser/workspaces.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize, localize2 } from '../../../../nls.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { Extensions as WorkbenchExtensions, IWorkbenchContributionsRegistry, IWorkbenchContribution } from '../../../common/contributions.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { hasWorkspaceFileExtension, IWorkspaceContextService, WorkbenchState, WORKSPACE_SUFFIX } from '../../../../platform/workspace/common/workspace.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { INeverShowAgainOptions, INotificationService, NeverShowAgainScope, NotificationPriority, Severity } from '../../../../platform/notification/common/notification.js';
import { URI } from '../../../../base/common/uri.js';
import { isEqual, joinPath } from '../../../../base/common/resources.js';
import { IHostService } from '../../../services/host/browser/host.js';
import { IQuickInputService, IQuickPickItem } from '../../../../platform/quickinput/common/quickInput.js';
import { IStorageService, StorageScope } from '../../../../platform/storage/common/storage.js';
import { isVirtualWorkspace } from '../../../../platform/workspace/common/virtualWorkspace.js';
import { Action2, MenuId, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { ServicesAccessor } from '../../../../editor/browser/editorExtensions.js';
import { ActiveEditorContext, ResourceContextKey, TemporaryWorkspaceContext } from '../../../common/contextkeys.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { TEXT_FILE_EDITOR_ID } from '../../files/common/files.js';

/**
 * A workbench contribution that will look for `.code-workspace` files in the root of the
 * workspace folder and open a notification to suggest to open one of the workspaces.
 */
export class WorkspacesFinderContribution extends Disposable implements IWorkbenchContribution {

	constructor(
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService,
		@INotificationService private readonly notificationService: INotificationService,
		@IFileService private readonly fileService: IFileService,
		@IQuickInputService private readonly quickInputService: IQuickInputService,
		@IHostService private readonly hostService: IHostService,
		@IStorageService private readonly storageService: IStorageService
	) {
		super();

		this.findWorkspaces();
	}

	private async findWorkspaces(): Promise<void> {
		const folder = this.contextService.getWorkspace().folders[0];
		if (!folder || this.contextService.getWorkbenchState() !== WorkbenchState.FOLDER || isVirtualWorkspace(this.contextService.getWorkspace())) {
			return; // require a single (non virtual) root folder
		}

		const rootFileNames = (await this.fileService.resolve(folder.uri)).children?.map(child => child.name);
		if (Array.isArray(rootFileNames)) {
			const workspaceFiles = rootFileNames.filter(hasWorkspaceFileExtension);
			if (workspaceFiles.length > 0) {
				this.doHandleWorkspaceFiles(folder.uri, workspaceFiles);
			}
		}
	}

	private doHandleWorkspaceFiles(folder: URI, workspaces: string[]): void {
		const neverShowAgain: INeverShowAgainOptions = { id: 'workspaces.dontPromptToOpen', scope: NeverShowAgainScope.WORKSPACE, isSecondary: true };

		// Prompt to open one workspace
		if (workspaces.length === 1) {
			const workspaceFile = workspaces[0];

			this.notificationService.prompt(Severity.Info, localize(
				{
					key: 'foundWorkspace',
					comment: ['{Locked="]({1})"}']
				},
				"This folder contains a workspace file '{0}'. Do you want to open it? [Learn more]({1}) about workspace files.",
				workspaceFile,
				'https://go.microsoft.com/fwlink/?linkid=2025315'
			), [{
				label: localize('openWorkspace', "Open Workspace"),
				run: () => this.hostService.openWindow([{ workspaceUri: joinPath(folder, workspaceFile) }])
			}], {
				neverShowAgain,
				priority: !this.storageService.isNew(StorageScope.WORKSPACE) ? NotificationPriority.SILENT : NotificationPriority.OPTIONAL // https://github.com/microsoft/vscode/issues/125315
			});
		}

		// Prompt to select a workspace from many
		else if (workspaces.length > 1) {
			this.notificationService.prompt(Severity.Info, localize({
				key: 'foundWorkspaces',
				comment: ['{Locked="]({0})"}']
			}, "This folder contains multiple workspace files. Do you want to open one? [Learn more]({0}) about workspace files.", 'https://go.microsoft.com/fwlink/?linkid=2025315'), [{
				label: localize('selectWorkspace', "Select Workspace"),
				run: () => {
					this.quickInputService.pick(
						workspaces.map(workspace => ({ label: workspace } satisfies IQuickPickItem)),
						{ placeHolder: localize('selectToOpen', "Select a workspace to open") }).then(pick => {
							if (pick) {
								this.hostService.openWindow([{ workspaceUri: joinPath(folder, pick.label) }]);
							}
						});
				}
			}], {
				neverShowAgain,
				priority: !this.storageService.isNew(StorageScope.WORKSPACE) ? NotificationPriority.SILENT : NotificationPriority.OPTIONAL // https://github.com/microsoft/vscode/issues/125315
			});
		}
	}
}

Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench).registerWorkbenchContribution(WorkspacesFinderContribution, LifecyclePhase.Eventually);

// Render "Open Workspace" button in *.code-workspace files

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'workbench.action.openWorkspaceFromEditor',
			title: localize2('openWorkspace', "Open Workspace"),
			f1: false,
			menu: {
				id: MenuId.EditorContent,
				when: ContextKeyExpr.and(
					ResourceContextKey.Extension.isEqualTo(WORKSPACE_SUFFIX),
					ActiveEditorContext.isEqualTo(TEXT_FILE_EDITOR_ID),
					TemporaryWorkspaceContext.toNegated()
				)
			}
		});
	}

	async run(accessor: ServicesAccessor, uri: URI): Promise<void> {
		const hostService = accessor.get(IHostService);
		const contextService = accessor.get(IWorkspaceContextService);
		const notificationService = accessor.get(INotificationService);

		if (contextService.getWorkbenchState() === WorkbenchState.WORKSPACE) {
			const workspaceConfiguration = contextService.getWorkspace().configuration;
			if (workspaceConfiguration && isEqual(workspaceConfiguration, uri)) {
				notificationService.info(localize('alreadyOpen', "This workspace is already open."));

				return; // workspace already opened
			}
		}

		return hostService.openWindow([{ workspaceUri: uri }]);
	}
});
```

--------------------------------------------------------------------------------

````
