---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 480
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 480 of 552)

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

---[FILE: src/vs/workbench/contrib/userDataProfile/browser/userDataProfilesEditor.ts]---
Location: vscode-main/src/vs/workbench/contrib/userDataProfile/browser/userDataProfilesEditor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/userDataProfilesEditor.css';
import { $, addDisposableListener, append, clearNode, Dimension, EventHelper, EventType, IDomPosition, trackFocus } from '../../../../base/browser/dom.js';
import { Action, IAction, IActionChangeEvent, Separator, SubmenuAction, toAction } from '../../../../base/common/actions.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { localize } from '../../../../nls.js';
import { IContextMenuService, IContextViewService } from '../../../../platform/contextview/browser/contextView.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IUserDataProfile, IUserDataProfilesService, ProfileResourceType } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { EditorPane } from '../../../browser/parts/editor/editorPane.js';
import { IEditorOpenContext, IEditorSerializer, IUntypedEditorInput } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { IUserDataProfilesEditor } from '../common/userDataProfile.js';
import { IEditorGroup } from '../../../services/editor/common/editorGroupsService.js';
import { defaultUserDataProfileIcon, IProfileTemplateInfo, IUserDataProfileManagementService, IUserDataProfileService, PROFILE_FILTER } from '../../../services/userDataProfile/common/userDataProfile.js';
import { Orientation, Sizing, SplitView } from '../../../../base/browser/ui/splitview/splitview.js';
import { Button, ButtonBar, ButtonWithDropdown } from '../../../../base/browser/ui/button/button.js';
import { defaultButtonStyles, defaultCheckboxStyles, defaultInputBoxStyles, defaultSelectBoxStyles, getInputBoxStyle, getListStyles } from '../../../../platform/theme/browser/defaultStyles.js';
import { editorBackground, foreground, registerColor } from '../../../../platform/theme/common/colorRegistry.js';
import { PANEL_BORDER } from '../../../common/theme.js';
import { WorkbenchAsyncDataTree, WorkbenchList, WorkbenchTable } from '../../../../platform/list/browser/listService.js';
import { CachedListVirtualDelegate, IListRenderer, IListVirtualDelegate } from '../../../../base/browser/ui/list/list.js';
import { IAsyncDataSource, ITreeNode, ITreeRenderer } from '../../../../base/browser/ui/tree/tree.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IEditorOptions } from '../../../../platform/editor/common/editor.js';
import { Disposable, DisposableStore, IDisposable, MutableDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { InputBox, MessageType } from '../../../../base/browser/ui/inputbox/inputBox.js';
import { Checkbox } from '../../../../base/browser/ui/toggle/toggle.js';
import { DEFAULT_ICON, ICONS } from '../../../services/userDataProfile/common/userDataProfileIcons.js';
import { WorkbenchIconSelectBox } from '../../../services/userDataProfile/browser/iconSelectBox.js';
import { StandardKeyboardEvent } from '../../../../base/browser/keyboardEvent.js';
import { KeyCode } from '../../../../base/common/keyCodes.js';
import { IHoverService, WorkbenchHoverDelegate } from '../../../../platform/hover/browser/hover.js';
import { HoverPosition } from '../../../../base/browser/ui/hover/hoverWidget.js';
import { IHoverWidget, IManagedHover } from '../../../../base/browser/ui/hover/hover.js';
import { ISelectOptionItem, SelectBox, SeparatorSelectOption } from '../../../../base/browser/ui/selectBox/selectBox.js';
import { URI } from '../../../../base/common/uri.js';
import { IEditorProgressService } from '../../../../platform/progress/common/progress.js';
import { isString, isUndefined } from '../../../../base/common/types.js';
import { basename } from '../../../../base/common/resources.js';
import { RenderIndentGuides } from '../../../../base/browser/ui/tree/abstractTree.js';
import { DEFAULT_LABELS_CONTAINER, IResourceLabel, ResourceLabels } from '../../../browser/labels.js';
import { IHoverDelegate } from '../../../../base/browser/ui/hover/hoverDelegate.js';
import { IFileDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { IQuickInputService, IQuickPickItem } from '../../../../platform/quickinput/common/quickInput.js';
import { AbstractUserDataProfileElement, isProfileResourceChildElement, isProfileResourceTypeElement, IProfileChildElement, IProfileResourceTypeChildElement, IProfileResourceTypeElement, NewProfileElement, UserDataProfileElement, UserDataProfilesEditorModel } from './userDataProfilesEditorModel.js';
import { WorkbenchToolBar } from '../../../../platform/actions/browser/toolbar.js';
import { createInstantHoverDelegate, getDefaultHoverDelegate } from '../../../../base/browser/ui/hover/hoverDelegateFactory.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { Radio } from '../../../../base/browser/ui/radio/radio.js';
import { MarkdownString } from '../../../../base/common/htmlContent.js';
import { settingsTextInputBorder } from '../../preferences/common/settingsEditorColorRegistry.js';
import { renderMarkdown } from '../../../../base/browser/markdownRenderer.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { ITableRenderer, ITableVirtualDelegate } from '../../../../base/browser/ui/table/table.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { Schemas } from '../../../../base/common/network.js';
import { posix, win32 } from '../../../../base/common/path.js';
import { hasDriveLetter } from '../../../../base/common/extpath.js';
import { normalizeDriveLetter } from '../../../../base/common/labels.js';
import { ActionBar } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';
import { DropdownMenuActionViewItem } from '../../../../base/browser/ui/dropdown/dropdownActionViewItem.js';

const editIcon = registerIcon('profiles-editor-edit-folder', Codicon.edit, localize('editIcon', 'Icon for the edit folder icon in the profiles editor.'));
const removeIcon = registerIcon('profiles-editor-remove-folder', Codicon.close, localize('removeIcon', 'Icon for the remove folder icon in the profiles editor.'));

export const profilesSashBorder = registerColor('profiles.sashBorder', PANEL_BORDER, localize('profilesSashBorder', "The color of the Profiles editor splitview sash border."));

const listStyles = getListStyles({
	listActiveSelectionBackground: editorBackground,
	listActiveSelectionForeground: foreground,
	listFocusAndSelectionBackground: editorBackground,
	listFocusAndSelectionForeground: foreground,
	listFocusBackground: editorBackground,
	listFocusForeground: foreground,
	listHoverForeground: foreground,
	listHoverBackground: editorBackground,
	listHoverOutline: editorBackground,
	listFocusOutline: editorBackground,
	listInactiveSelectionBackground: editorBackground,
	listInactiveSelectionForeground: foreground,
	listInactiveFocusBackground: editorBackground,
	listInactiveFocusOutline: editorBackground,
	treeIndentGuidesStroke: undefined,
	treeInactiveIndentGuidesStroke: undefined,
	tableOddRowsBackgroundColor: editorBackground,
});

export class UserDataProfilesEditor extends EditorPane implements IUserDataProfilesEditor {

	static readonly ID: string = 'workbench.editor.userDataProfiles';

	private container: HTMLElement | undefined;
	private splitView: SplitView<number> | undefined;
	private profilesList: WorkbenchList<AbstractUserDataProfileElement> | undefined;
	private profileWidget: ProfileWidget | undefined;

	private model: UserDataProfilesEditorModel | undefined;
	private templates: readonly IProfileTemplateInfo[] = [];

	constructor(
		group: IEditorGroup,
		@ITelemetryService telemetryService: ITelemetryService,
		@IThemeService themeService: IThemeService,
		@IStorageService storageService: IStorageService,
		@IQuickInputService private readonly quickInputService: IQuickInputService,
		@IFileDialogService private readonly fileDialogService: IFileDialogService,
		@IContextMenuService private readonly contextMenuService: IContextMenuService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		super(UserDataProfilesEditor.ID, group, telemetryService, themeService, storageService);
	}

	layout(dimension: Dimension, position?: IDomPosition | undefined): void {
		if (this.container && this.splitView) {
			const height = dimension.height - 20;
			this.splitView.layout(this.container?.clientWidth, height);
			this.splitView.el.style.height = `${height}px`;
		}
	}

	protected createEditor(parent: HTMLElement): void {
		this.container = append(parent, $('.profiles-editor'));

		const sidebarView = append(this.container, $('.sidebar-view'));
		const sidebarContainer = append(sidebarView, $('.sidebar-container'));

		const contentsView = append(this.container, $('.contents-view'));
		const contentsContainer = append(contentsView, $('.contents-container'));
		this.profileWidget = this._register(this.instantiationService.createInstance(ProfileWidget, contentsContainer));

		this.splitView = new SplitView(this.container, {
			orientation: Orientation.HORIZONTAL,
			proportionalLayout: true
		});

		this.renderSidebar(sidebarContainer);
		this.splitView.addView({
			onDidChange: Event.None,
			element: sidebarView,
			minimumSize: 200,
			maximumSize: 350,
			layout: (width, _, height) => {
				sidebarView.style.width = `${width}px`;
				if (height && this.profilesList) {
					const listHeight = height - 40 /* new profile button */ - 15 /* marginTop */;
					this.profilesList.getHTMLElement().style.height = `${listHeight}px`;
					this.profilesList.layout(listHeight, width);
				}
			}
		}, 300, undefined, true);
		this.splitView.addView({
			onDidChange: Event.None,
			element: contentsView,
			minimumSize: 550,
			maximumSize: Number.POSITIVE_INFINITY,
			layout: (width, _, height) => {
				contentsView.style.width = `${width}px`;
				if (height) {
					this.profileWidget?.layout(new Dimension(width, height));
				}
			}
		}, Sizing.Distribute, undefined, true);

		this.registerListeners();
		this.updateStyles();
	}

	override updateStyles(): void {
		const borderColor = this.theme.getColor(profilesSashBorder)!;
		this.splitView?.style({ separatorBorder: borderColor });
	}

	private renderSidebar(parent: HTMLElement): void {
		// render New Profile Button
		this.renderNewProfileButton(append(parent, $('.new-profile-button')));

		// render profiles list
		const renderer = this.instantiationService.createInstance(ProfileElementRenderer);
		const delegate = new ProfileElementDelegate();
		this.profilesList = this._register(this.instantiationService.createInstance(WorkbenchList<AbstractUserDataProfileElement>, 'ProfilesList',
			append(parent, $('.profiles-list')),
			delegate,
			[renderer],
			{
				multipleSelectionSupport: false,
				setRowLineHeight: false,
				horizontalScrolling: false,
				accessibilityProvider: {
					getAriaLabel(profileElement: AbstractUserDataProfileElement | null): string {
						return profileElement?.name ?? '';
					},
					getWidgetAriaLabel(): string {
						return localize('profiles', "Profiles");
					}
				},
				openOnSingleClick: true,
				identityProvider: {
					getId(e) {
						if (e instanceof UserDataProfileElement) {
							return e.profile.id;
						}
						return e.name;
					}
				},
				alwaysConsumeMouseWheel: false,
			}));
	}

	private renderNewProfileButton(parent: HTMLElement): void {
		const button = this._register(new ButtonWithDropdown(parent, {
			actions: {
				getActions: () => {
					const actions: IAction[] = [];
					if (this.templates.length) {
						actions.push(new SubmenuAction('from.template', localize('from template', "From Template"), this.getCreateFromTemplateActions()));
						actions.push(new Separator());
					}
					actions.push(toAction({
						id: 'importProfile',
						label: localize('importProfile', "Import Profile..."),
						run: () => this.importProfile()
					}));
					return actions;
				}
			},
			addPrimaryActionToDropdown: false,
			contextMenuProvider: this.contextMenuService,
			supportIcons: true,
			...defaultButtonStyles
		}));
		button.label = localize('newProfile', "New Profile");
		this._register(button.onDidClick(e => this.createNewProfile()));
	}

	private getCreateFromTemplateActions(): IAction[] {
		return this.templates.map(template =>
			toAction({
				id: `template:${template.url}`,
				label: template.name,
				run: () => this.createNewProfile(URI.parse(template.url))
			}));
	}

	private registerListeners(): void {
		if (this.profilesList) {
			this._register(this.profilesList.onDidChangeSelection(e => {
				const [element] = e.elements;
				if (element instanceof AbstractUserDataProfileElement) {
					this.profileWidget?.render(element);
				}
			}));
			this._register(this.profilesList.onContextMenu(e => {
				const actions: IAction[] = [];
				if (!e.element) {
					actions.push(...this.getTreeContextMenuActions());
				}
				if (e.element instanceof AbstractUserDataProfileElement) {
					actions.push(...e.element.actions[1]);
				}
				if (actions.length) {
					this.contextMenuService.showContextMenu({
						getAnchor: () => e.anchor,
						getActions: () => actions,
						getActionsContext: () => e.element
					});
				}
			}));
			this._register(this.profilesList.onMouseDblClick(e => {
				if (!e.element) {
					this.createNewProfile();
				}
			}));
		}
	}

	private getTreeContextMenuActions(): IAction[] {
		const actions: IAction[] = [];
		actions.push(toAction({
			id: 'newProfile',
			label: localize('newProfile', "New Profile"),
			run: () => this.createNewProfile()
		}));
		const templateActions = this.getCreateFromTemplateActions();
		if (templateActions.length) {
			actions.push(new SubmenuAction('from.template', localize('new from template', "New Profile From Template"), templateActions));
		}
		actions.push(new Separator());
		actions.push(toAction({
			id: 'importProfile',
			label: localize('importProfile', "Import Profile..."),
			run: () => this.importProfile()
		}));
		return actions;
	}

	private async importProfile(): Promise<void> {
		const disposables = new DisposableStore();
		const quickPick = disposables.add(this.quickInputService.createQuickPick());

		const updateQuickPickItems = (value?: string) => {
			const quickPickItems: IQuickPickItem[] = [];
			if (value) {
				quickPickItems.push({ label: quickPick.value, description: localize('import from url', "Import from URL") });
			}
			quickPickItems.push({ label: localize('import from file', "Select File...") });
			quickPick.items = quickPickItems;
		};

		quickPick.title = localize('import profile quick pick title', "Import from Profile Template...");
		quickPick.placeholder = localize('import profile placeholder', "Provide Profile Template URL");
		quickPick.ignoreFocusOut = true;
		disposables.add(quickPick.onDidChangeValue(updateQuickPickItems));
		updateQuickPickItems();
		quickPick.matchOnLabel = false;
		quickPick.matchOnDescription = false;
		disposables.add(quickPick.onDidAccept(async () => {
			quickPick.hide();
			const selectedItem = quickPick.selectedItems[0];
			if (!selectedItem) {
				return;
			}
			const url = selectedItem.label === quickPick.value ? URI.parse(quickPick.value) : await this.getProfileUriFromFileSystem();
			if (url) {
				this.createNewProfile(url);
			}
		}));
		disposables.add(quickPick.onDidHide(() => disposables.dispose()));
		quickPick.show();
	}

	async createNewProfile(copyFrom?: URI | IUserDataProfile): Promise<void> {
		await this.model?.createNewProfile(copyFrom);
	}

	selectProfile(profile: IUserDataProfile): void {
		const index = this.model?.profiles.findIndex(p => p instanceof UserDataProfileElement && p.profile.id === profile.id);
		if (index !== undefined && index >= 0) {
			this.profilesList?.setSelection([index]);
		}
	}

	private async getProfileUriFromFileSystem(): Promise<URI | null> {
		const profileLocation = await this.fileDialogService.showOpenDialog({
			canSelectFolders: false,
			canSelectFiles: true,
			canSelectMany: false,
			filters: PROFILE_FILTER,
			title: localize('import profile dialog', "Select Profile Template File"),
		});
		if (!profileLocation) {
			return null;
		}
		return profileLocation[0];
	}

	override async setInput(input: UserDataProfilesEditorInput, options: IEditorOptions | undefined, context: IEditorOpenContext, token: CancellationToken): Promise<void> {
		await super.setInput(input, options, context, token);
		this.model = await input.resolve();
		this.model.getTemplates().then(templates => {
			this.templates = templates;
			if (this.profileWidget) {
				this.profileWidget.templates = templates;
			}
		});
		this.updateProfilesList();
		this._register(this.model.onDidChange(element =>
			this.updateProfilesList(element)));
	}

	override focus(): void {
		super.focus();
		this.profilesList?.domFocus();
	}

	private updateProfilesList(elementToSelect?: AbstractUserDataProfileElement): void {
		if (!this.model) {
			return;
		}
		const currentSelectionIndex = this.profilesList?.getSelection()?.[0];
		const currentSelection = currentSelectionIndex !== undefined ? this.profilesList?.element(currentSelectionIndex) : undefined;
		this.profilesList?.splice(0, this.profilesList.length, this.model.profiles);

		if (elementToSelect) {
			this.profilesList?.setSelection([this.model.profiles.indexOf(elementToSelect)]);
		} else if (currentSelection) {
			if (!this.model.profiles.includes(currentSelection)) {
				const elementToSelect = this.model.profiles.find(profile => profile.name === currentSelection.name) ?? this.model.profiles[0];
				if (elementToSelect) {
					this.profilesList?.setSelection([this.model.profiles.indexOf(elementToSelect)]);
				}
			}
		} else {
			const elementToSelect = this.model.profiles.find(profile => profile.active) ?? this.model.profiles[0];
			if (elementToSelect) {
				this.profilesList?.setSelection([this.model.profiles.indexOf(elementToSelect)]);
			}
		}
	}

}

interface IProfileElementTemplateData {
	readonly icon: HTMLElement;
	readonly label: HTMLElement;
	readonly dirty: HTMLElement;
	readonly description: HTMLElement;
	readonly actionBar: WorkbenchToolBar;
	readonly disposables: DisposableStore;
	readonly elementDisposables: DisposableStore;
}

class ProfileElementDelegate implements IListVirtualDelegate<AbstractUserDataProfileElement> {
	getHeight(element: AbstractUserDataProfileElement) {
		return 22;
	}
	getTemplateId() { return 'profileListElement'; }
}

class ProfileElementRenderer implements IListRenderer<AbstractUserDataProfileElement, IProfileElementTemplateData> {

	readonly templateId = 'profileListElement';

	constructor(
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) { }

	renderTemplate(container: HTMLElement): IProfileElementTemplateData {

		const disposables = new DisposableStore();
		const elementDisposables = new DisposableStore();

		container.classList.add('profile-list-item');
		const icon = append(container, $('.profile-list-item-icon'));
		const label = append(container, $('.profile-list-item-label'));
		const dirty = append(container, $(`span${ThemeIcon.asCSSSelector(Codicon.circleFilled)}`));
		const description = append(container, $('.profile-list-item-description'));
		append(description, $(`span${ThemeIcon.asCSSSelector(Codicon.check)}`), $('span', undefined, localize('activeProfile', "Active")));

		const actionsContainer = append(container, $('.profile-tree-item-actions-container'));
		const actionBar = disposables.add(this.instantiationService.createInstance(WorkbenchToolBar,
			actionsContainer,
			{
				hoverDelegate: disposables.add(createInstantHoverDelegate()),
				highlightToggledItems: true
			}
		));

		return { label, icon, dirty, description, actionBar, disposables, elementDisposables };
	}

	renderElement(element: AbstractUserDataProfileElement, index: number, templateData: IProfileElementTemplateData) {
		templateData.elementDisposables.clear();
		templateData.label.textContent = element.name;
		templateData.label.classList.toggle('new-profile', element instanceof NewProfileElement);
		templateData.icon.className = ThemeIcon.asClassName(element.icon ? ThemeIcon.fromId(element.icon) : DEFAULT_ICON);
		templateData.dirty.classList.toggle('hide', !(element instanceof NewProfileElement));
		templateData.description.classList.toggle('hide', !element.active);
		templateData.elementDisposables.add(element.onDidChange(e => {
			if (e.name) {
				templateData.label.textContent = element.name;
			}
			if (e.icon) {
				if (element.icon) {
					templateData.icon.className = ThemeIcon.asClassName(ThemeIcon.fromId(element.icon));
				} else {
					templateData.icon.className = 'hide';
				}
			}
			if (e.active) {
				templateData.description.classList.toggle('hide', !element.active);
			}
		}));
		const setActions = () => templateData.actionBar.setActions(element.actions[0].filter(a => a.enabled), element.actions[1].filter(a => a.enabled));
		setActions();
		const events: Event<IActionChangeEvent>[] = [];
		for (const action of element.actions.flat()) {
			if (action instanceof Action) {
				events.push(action.onDidChange);
			}
		}
		templateData.elementDisposables.add(Event.any(...events)(e => {
			if (e.enabled !== undefined) {
				setActions();
			}
		}));

	}

	disposeElement(element: AbstractUserDataProfileElement, index: number, templateData: IProfileElementTemplateData): void {
		templateData.elementDisposables.clear();
	}

	disposeTemplate(templateData: IProfileElementTemplateData): void {
		templateData.disposables.dispose();
		templateData.elementDisposables.dispose();
	}
}

class ProfileWidget extends Disposable {

	private readonly profileTitle: HTMLElement;
	private readonly profileTreeContainer: HTMLElement;
	private readonly buttonContainer: HTMLElement;

	private readonly profileTree: WorkbenchAsyncDataTree<AbstractUserDataProfileElement, ProfileTreeElement>;
	private readonly copyFromProfileRenderer: CopyFromProfileRenderer;
	private readonly _profileElement = this._register(new MutableDisposable<{ element: AbstractUserDataProfileElement } & IDisposable>());

	private readonly layoutParticipants: { layout: () => void }[] = [];

	public set templates(templates: readonly IProfileTemplateInfo[]) {
		this.copyFromProfileRenderer.setTemplates(templates);
		this.profileTree.rerender();
	}

	constructor(
		parent: HTMLElement,
		@IEditorProgressService private readonly editorProgressService: IEditorProgressService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		super();

		const header = append(parent, $('.profile-header'));
		const title = append(header, $('.profile-title-container'));
		this.profileTitle = append(title, $(''));

		const body = append(parent, $('.profile-body'));

		const delegate = new ProfileTreeDelegate();
		const contentsRenderer = this._register(this.instantiationService.createInstance(ContentsProfileRenderer));
		const associationsRenderer = this._register(this.instantiationService.createInstance(ProfileWorkspacesRenderer));
		this.layoutParticipants.push(associationsRenderer);
		this.copyFromProfileRenderer = this._register(this.instantiationService.createInstance(CopyFromProfileRenderer));
		this.profileTreeContainer = append(body, $('.profile-tree'));
		this.profileTree = this._register(this.instantiationService.createInstance(WorkbenchAsyncDataTree<AbstractUserDataProfileElement, ProfileTreeElement>,
			'ProfileEditor-Tree',
			this.profileTreeContainer,
			delegate,
			[
				this._register(this.instantiationService.createInstance(ProfileNameRenderer)),
				this._register(this.instantiationService.createInstance(ProfileIconRenderer)),
				this._register(this.instantiationService.createInstance(UseForCurrentWindowPropertyRenderer)),
				this._register(this.instantiationService.createInstance(UseAsDefaultProfileRenderer)),
				this.copyFromProfileRenderer,
				contentsRenderer,
				associationsRenderer,
			],
			this.instantiationService.createInstance(ProfileTreeDataSource),
			{
				multipleSelectionSupport: false,
				horizontalScrolling: false,
				accessibilityProvider: {
					getAriaLabel(element: ProfileTreeElement | null): string {
						return element?.element ?? '';
					},
					getWidgetAriaLabel(): string {
						return '';
					},
				},
				identityProvider: {
					getId(element) {
						return element.element;
					}
				},
				expandOnlyOnTwistieClick: true,
				renderIndentGuides: RenderIndentGuides.None,
				enableStickyScroll: false,
				openOnSingleClick: false,
				setRowLineHeight: false,
				supportDynamicHeights: true,
				alwaysConsumeMouseWheel: false,
			}));

		this.profileTree.style(listStyles);

		this._register(contentsRenderer.onDidChangeContentHeight((e) => this.profileTree.updateElementHeight(e, undefined)));
		this._register(associationsRenderer.onDidChangeContentHeight((e) => this.profileTree.updateElementHeight(e, undefined)));
		this._register(contentsRenderer.onDidChangeSelection((e) => {
			if (e.selected) {
				this.profileTree.setFocus([]);
				this.profileTree.setSelection([]);
			}
		}));

		this._register(this.profileTree.onDidChangeContentHeight((e) => {
			if (this.dimension) {
				this.layout(this.dimension);
			}
		}));

		this._register(this.profileTree.onDidChangeSelection((e) => {
			if (e.elements.length) {
				contentsRenderer.clearSelection();
			}
		}));

		this.buttonContainer = append(body, $('.profile-row-container.profile-button-container'));
	}

	private dimension: Dimension | undefined;
	layout(dimension: Dimension): void {
		this.dimension = dimension;
		const treeContentHeight = this.profileTree.contentHeight;
		const height = Math.min(treeContentHeight, dimension.height - (this._profileElement.value?.element instanceof NewProfileElement ? 116 : 54));
		this.profileTreeContainer.style.height = `${height}px`;
		this.profileTree.layout(height, dimension.width);
		for (const participant of this.layoutParticipants) {
			participant.layout();
		}
	}

	render(profileElement: AbstractUserDataProfileElement): void {
		if (this._profileElement.value?.element === profileElement) {
			return;
		}

		if (this._profileElement.value?.element instanceof UserDataProfileElement) {
			this._profileElement.value.element.reset();
		}
		this.profileTree.setInput(profileElement);

		const disposables = new DisposableStore();
		this._profileElement.value = { element: profileElement, dispose: () => disposables.dispose() };

		this.profileTitle.textContent = profileElement.name;
		disposables.add(profileElement.onDidChange(e => {
			if (e.name) {
				this.profileTitle.textContent = profileElement.name;
			}
		}));

		const [primaryTitleButtons, secondatyTitleButtons] = profileElement.titleButtons;
		if (primaryTitleButtons?.length || secondatyTitleButtons?.length) {
			this.buttonContainer.classList.remove('hide');

			if (secondatyTitleButtons?.length) {
				for (const action of secondatyTitleButtons) {
					const button = disposables.add(new Button(this.buttonContainer, {
						...defaultButtonStyles,
						secondary: true
					}));
					button.label = action.label;
					button.enabled = action.enabled;
					disposables.add(button.onDidClick(() => this.editorProgressService.showWhile(action.run())));
					disposables.add(action.onDidChange((e) => {
						if (!isUndefined(e.enabled)) {
							button.enabled = action.enabled;
						}
						if (!isUndefined(e.label)) {
							button.label = action.label;
						}
					}));
				}
			}

			if (primaryTitleButtons?.length) {
				for (const action of primaryTitleButtons) {
					const button = disposables.add(new Button(this.buttonContainer, {
						...defaultButtonStyles
					}));
					button.label = action.label;
					button.enabled = action.enabled;
					disposables.add(button.onDidClick(() => this.editorProgressService.showWhile(action.run())));
					disposables.add(action.onDidChange((e) => {
						if (!isUndefined(e.enabled)) {
							button.enabled = action.enabled;
						}
						if (!isUndefined(e.label)) {
							button.label = action.label;
						}
					}));
					disposables.add(profileElement.onDidChange(e => {
						if (e.message) {
							button.setTitle(profileElement.message ?? action.label);
							button.element.classList.toggle('error', !!profileElement.message);
						}
					}));
				}
			}

		} else {
			this.buttonContainer.classList.add('hide');
		}

		if (profileElement instanceof NewProfileElement) {
			this.profileTree.focusFirst();
		}

		if (this.dimension) {
			this.layout(this.dimension);
		}
	}

}

type ProfileProperty = 'name' | 'icon' | 'copyFrom' | 'useForCurrent' | 'useAsDefault' | 'contents' | 'workspaces';

interface ProfileTreeElement {
	element: ProfileProperty;
	root: AbstractUserDataProfileElement;
}

class ProfileTreeDelegate extends CachedListVirtualDelegate<ProfileTreeElement> {

	getTemplateId({ element }: ProfileTreeElement) {
		return element;
	}

	hasDynamicHeight({ element }: ProfileTreeElement): boolean {
		return element === 'contents' || element === 'workspaces';
	}

	protected estimateHeight({ element, root }: ProfileTreeElement): number {
		switch (element) {
			case 'name':
				return 72;
			case 'icon':
				return 68;
			case 'copyFrom':
				return 90;
			case 'useForCurrent':
			case 'useAsDefault':
				return 68;
			case 'contents':
				return 258;
			case 'workspaces':
				return (root.workspaces ? (root.workspaces.length * 24) + 30 : 0) + 112;
		}
	}
}

class ProfileTreeDataSource implements IAsyncDataSource<AbstractUserDataProfileElement, ProfileTreeElement> {

	hasChildren(element: AbstractUserDataProfileElement | ProfileTreeElement): boolean {
		return element instanceof AbstractUserDataProfileElement;
	}

	async getChildren(element: AbstractUserDataProfileElement | ProfileTreeElement): Promise<ProfileTreeElement[]> {
		if (element instanceof AbstractUserDataProfileElement) {
			const children: ProfileTreeElement[] = [];
			if (element instanceof NewProfileElement) {
				children.push({ element: 'name', root: element });
				children.push({ element: 'icon', root: element });
				children.push({ element: 'copyFrom', root: element });
				children.push({ element: 'contents', root: element });
			} else if (element instanceof UserDataProfileElement) {
				if (!element.profile.isDefault) {
					children.push({ element: 'name', root: element });
					children.push({ element: 'icon', root: element });
				}
				children.push({ element: 'useAsDefault', root: element });
				children.push({ element: 'contents', root: element });
				children.push({ element: 'workspaces', root: element });
			}
			return children;
		}
		return [];
	}
}

interface ProfileContentTreeElement {
	element: IProfileChildElement;
	root: AbstractUserDataProfileElement;
}

class ProfileContentTreeElementDelegate implements IListVirtualDelegate<ProfileContentTreeElement> {

	getTemplateId(element: ProfileContentTreeElement) {
		if (!(<IProfileResourceTypeElement>element.element).resourceType) {
			return ProfileResourceChildTreeItemRenderer.TEMPLATE_ID;
		}
		if (element.root instanceof NewProfileElement) {
			return NewProfileResourceTreeRenderer.TEMPLATE_ID;
		}
		return ExistingProfileResourceTreeRenderer.TEMPLATE_ID;
	}

	getHeight(element: ProfileContentTreeElement): number {
		return 24;
	}
}

class ProfileResourceTreeDataSource implements IAsyncDataSource<AbstractUserDataProfileElement, ProfileContentTreeElement> {

	constructor(
		@IEditorProgressService private readonly editorProgressService: IEditorProgressService,
	) { }

	hasChildren(element: AbstractUserDataProfileElement | ProfileContentTreeElement): boolean {
		if (element instanceof AbstractUserDataProfileElement) {
			return true;
		}
		if ((<IProfileResourceTypeElement>element.element).resourceType) {
			if ((<IProfileResourceTypeElement>element.element).resourceType !== ProfileResourceType.Extensions && (<IProfileResourceTypeElement>element.element).resourceType !== ProfileResourceType.Snippets) {
				return false;
			}
			if (element.root instanceof NewProfileElement) {
				const resourceType = (<IProfileResourceTypeElement>element.element).resourceType;
				if (element.root.getFlag(resourceType)) {
					return true;
				}
				if (!element.root.hasResource(resourceType)) {
					return false;
				}
				if (element.root.copyFrom === undefined) {
					return false;
				}
				if (!element.root.getCopyFlag(resourceType)) {
					return false;
				}
			}
			return true;
		}
		return false;
	}

	async getChildren(element: AbstractUserDataProfileElement | ProfileContentTreeElement): Promise<ProfileContentTreeElement[]> {
		if (element instanceof AbstractUserDataProfileElement) {
			const children = await element.getChildren();
			return children.map(e => ({ element: e, root: element }));
		}
		if ((<IProfileResourceTypeElement>element.element).resourceType) {
			const progressRunner = this.editorProgressService.show(true, 500);
			try {
				const extensions = await element.root.getChildren((<IProfileResourceTypeElement>element.element).resourceType);
				return extensions.map(e => ({ element: e, root: element.root }));
			} finally {
				progressRunner.done();
			}
		}
		return [];
	}
}

interface IProfileRendererTemplate {
	readonly disposables: DisposableStore;
	readonly elementDisposables: DisposableStore;
}

interface IExistingProfileResourceTemplateData extends IProfileRendererTemplate {
	readonly label: HTMLElement;
	readonly radio: Radio;
	readonly actionBar: WorkbenchToolBar;
}

interface INewProfileResourceTemplateData extends IProfileRendererTemplate {
	readonly label: HTMLElement;
	readonly radio: Radio;
	readonly actionBar: WorkbenchToolBar;
}

interface IProfileResourceChildTreeItemTemplateData extends IProfileRendererTemplate {
	readonly actionBar: WorkbenchToolBar;
	readonly checkbox: Checkbox;
	readonly resourceLabel: IResourceLabel;
}

interface IProfilePropertyRendererTemplate extends IProfileRendererTemplate {
	element: ProfileTreeElement;
}

class AbstractProfileResourceTreeRenderer extends Disposable {

	protected getResourceTypeTitle(resourceType: ProfileResourceType): string {
		switch (resourceType) {
			case ProfileResourceType.Settings:
				return localize('settings', "Settings");
			case ProfileResourceType.Keybindings:
				return localize('keybindings', "Keyboard Shortcuts");
			case ProfileResourceType.Snippets:
				return localize('snippets', "Snippets");
			case ProfileResourceType.Tasks:
				return localize('tasks', "Tasks");
			case ProfileResourceType.Mcp:
				return localize('mcp', "MCP Servers");
			case ProfileResourceType.Extensions:
				return localize('extensions', "Extensions");
		}
		return '';
	}

	disposeElement(element: ITreeNode<ProfileContentTreeElement | ProfileTreeElement, void>, index: number, templateData: IProfileRendererTemplate): void {
		templateData.elementDisposables.clear();
	}

	disposeTemplate(templateData: IProfileRendererTemplate): void {
		templateData.disposables.dispose();
	}
}

abstract class ProfilePropertyRenderer extends AbstractProfileResourceTreeRenderer implements ITreeRenderer<ProfileTreeElement, void, IProfilePropertyRendererTemplate> {

	abstract templateId: ProfileProperty;
	abstract renderTemplate(parent: HTMLElement): IProfilePropertyRendererTemplate;

	renderElement({ element }: ITreeNode<ProfileTreeElement, void>, index: number, templateData: IProfilePropertyRendererTemplate): void {
		templateData.elementDisposables.clear();
		templateData.element = element;
	}

}

class ProfileNameRenderer extends ProfilePropertyRenderer {

	readonly templateId: ProfileProperty = 'name';

	constructor(
		@IUserDataProfilesService private readonly userDataProfilesService: IUserDataProfilesService,
		@IContextViewService private readonly contextViewService: IContextViewService,
	) {
		super();
	}

	renderTemplate(parent: HTMLElement): IProfilePropertyRendererTemplate {
		const disposables = new DisposableStore();
		const elementDisposables = disposables.add(new DisposableStore());
		let profileElement: ProfileTreeElement | undefined;

		const nameContainer = append(parent, $('.profile-row-container'));
		append(nameContainer, $('.profile-label-element', undefined, localize('name', "Name")));
		const nameInput = disposables.add(new InputBox(
			nameContainer,
			this.contextViewService,
			{
				inputBoxStyles: getInputBoxStyle({
					inputBorder: settingsTextInputBorder
				}),
				ariaLabel: localize('profileName', "Profile Name"),
				placeholder: localize('profileName', "Profile Name"),
				validationOptions: {
					validation: (value) => {
						if (!value) {
							return {
								content: localize('name required', "Profile name is required and must be a non-empty value."),
								type: MessageType.WARNING
							};
						}
						if (profileElement?.root.disabled) {
							return null;
						}
						if (!profileElement?.root.shouldValidateName()) {
							return null;
						}
						const initialName = profileElement?.root.getInitialName();
						value = value.trim();
						if (initialName !== value && this.userDataProfilesService.profiles.some(p => !p.isTransient && p.name === value)) {
							return {
								content: localize('profileExists', "Profile with name {0} already exists.", value),
								type: MessageType.WARNING
							};
						}
						return null;
					}
				}
			}
		));
		disposables.add(nameInput.onDidChange(value => {
			if (profileElement && value) {
				profileElement.root.name = value;
			}
		}));
		const focusTracker = disposables.add(trackFocus(nameInput.inputElement));
		disposables.add(focusTracker.onDidBlur(() => {
			if (profileElement && !nameInput.value) {
				nameInput.value = profileElement.root.name;
			}
		}));

		const renderName = (profileElement: ProfileTreeElement) => {
			nameInput.value = profileElement.root.name;
			nameInput.validate();
			const isDefaultProfile = profileElement.root instanceof UserDataProfileElement && profileElement.root.profile.isDefault;
			if (profileElement.root.disabled || isDefaultProfile) {
				nameInput.disable();
			} else {
				nameInput.enable();
			}
			if (isDefaultProfile) {
				nameInput.setTooltip(localize('defaultProfileName', "Name cannot be changed for the default profile"));
			} else {
				nameInput.setTooltip(localize('profileName', "Profile Name"));
			}
		};

		return {
			set element(element: ProfileTreeElement) {
				profileElement = element;
				renderName(profileElement);
				elementDisposables.add(profileElement.root.onDidChange(e => {
					if (e.name || e.disabled) {
						renderName(element);
					}
					if (e.profile) {
						nameInput.validate();
					}
				}));
			},
			disposables,
			elementDisposables
		};
	}

}

class ProfileIconRenderer extends ProfilePropertyRenderer {

	readonly templateId: ProfileProperty = 'icon';
	private readonly hoverDelegate: IHoverDelegate;

	constructor(
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IHoverService private readonly hoverService: IHoverService,
	) {
		super();
		this.hoverDelegate = getDefaultHoverDelegate('element');
	}

	renderTemplate(parent: HTMLElement): IProfilePropertyRendererTemplate {
		const disposables = new DisposableStore();
		const elementDisposables = disposables.add(new DisposableStore());
		let profileElement: ProfileTreeElement | undefined;

		const iconContainer = append(parent, $('.profile-row-container'));
		append(iconContainer, $('.profile-label-element', undefined, localize('icon-label', "Icon")));
		const iconValueContainer = append(iconContainer, $('.profile-icon-container'));
		const iconElement = append(iconValueContainer, $(`${ThemeIcon.asCSSSelector(DEFAULT_ICON)}`, { 'tabindex': '0', 'role': 'button', 'aria-label': localize('icon', "Profile Icon") }));
		const iconHover = disposables.add(this.hoverService.setupManagedHover(this.hoverDelegate, iconElement, ''));

		const iconSelectBox = disposables.add(this.instantiationService.createInstance(WorkbenchIconSelectBox, { icons: ICONS, inputBoxStyles: defaultInputBoxStyles }));
		let hoverWidget: IHoverWidget | undefined;
		const showIconSelectBox = () => {
			if (profileElement?.root instanceof UserDataProfileElement && profileElement.root.profile.isDefault) {
				return;
			}
			if (profileElement?.root.disabled) {
				return;
			}
			if (profileElement?.root instanceof UserDataProfileElement && profileElement.root.profile.isDefault) {
				return;
			}
			iconSelectBox.clearInput();
			hoverWidget = this.hoverService.showInstantHover({
				content: iconSelectBox.domNode,
				target: iconElement,
				position: {
					hoverPosition: HoverPosition.BELOW,
				},
				persistence: {
					sticky: true,
				},
				appearance: {
					showPointer: true,
				},
			}, true);

			if (hoverWidget) {
				iconSelectBox.layout(new Dimension(486, 292));
				iconSelectBox.focus();
			}
		};
		disposables.add(addDisposableListener(iconElement, EventType.CLICK, (e: MouseEvent) => {
			EventHelper.stop(e, true);
			showIconSelectBox();
		}));
		disposables.add(addDisposableListener(iconElement, EventType.KEY_DOWN, e => {
			const event = new StandardKeyboardEvent(e);
			if (event.equals(KeyCode.Enter) || event.equals(KeyCode.Space)) {
				EventHelper.stop(event, true);
				showIconSelectBox();
			}
		}));
		disposables.add(addDisposableListener(iconSelectBox.domNode, EventType.KEY_DOWN, e => {
			const event = new StandardKeyboardEvent(e);
			if (event.equals(KeyCode.Escape)) {
				EventHelper.stop(event, true);
				hoverWidget?.dispose();
				iconElement.focus();
			}
		}));
		disposables.add(iconSelectBox.onDidSelect(selectedIcon => {
			hoverWidget?.dispose();
			iconElement.focus();
			if (profileElement) {
				profileElement.root.icon = selectedIcon.id;
			}
		}));

		append(iconValueContainer, $('.profile-description-element', undefined, localize('icon-description', "Profile icon to be shown in the activity bar")));

		const renderIcon = (profileElement: ProfileTreeElement) => {
			if (profileElement?.root instanceof UserDataProfileElement && profileElement.root.profile.isDefault) {
				iconValueContainer.classList.add('disabled');
				iconHover.update(localize('defaultProfileIcon', "Icon cannot be changed for the default profile"));
			} else {
				iconHover.update(localize('changeIcon', "Click to change icon"));
				iconValueContainer.classList.remove('disabled');
			}
			if (profileElement.root.icon) {
				iconElement.className = ThemeIcon.asClassName(ThemeIcon.fromId(profileElement.root.icon));
			} else {
				iconElement.className = ThemeIcon.asClassName(ThemeIcon.fromId(DEFAULT_ICON.id));
			}
		};

		return {
			set element(element: ProfileTreeElement) {
				profileElement = element;
				renderIcon(profileElement);
				elementDisposables.add(profileElement.root.onDidChange(e => {
					if (e.icon) {
						renderIcon(element);
					}
				}));
			},
			disposables,
			elementDisposables
		};
	}
}

class UseForCurrentWindowPropertyRenderer extends ProfilePropertyRenderer {

	readonly templateId: ProfileProperty = 'useForCurrent';

	constructor(
		@IUserDataProfileService private readonly userDataProfileService: IUserDataProfileService,
	) {
		super();
	}

	renderTemplate(parent: HTMLElement): IProfilePropertyRendererTemplate {
		const disposables = new DisposableStore();
		const elementDisposables = disposables.add(new DisposableStore());
		let profileElement: ProfileTreeElement | undefined;

		const useForCurrentWindowContainer = append(parent, $('.profile-row-container'));
		append(useForCurrentWindowContainer, $('.profile-label-element', undefined, localize('use for curren window', "Use for Current Window")));
		const useForCurrentWindowValueContainer = append(useForCurrentWindowContainer, $('.profile-use-for-current-container'));
		const useForCurrentWindowTitle = localize('enable for current window', "Use this profile for the current window");
		const useForCurrentWindowCheckbox = disposables.add(new Checkbox(useForCurrentWindowTitle, false, defaultCheckboxStyles));
		append(useForCurrentWindowValueContainer, useForCurrentWindowCheckbox.domNode);
		const useForCurrentWindowLabel = append(useForCurrentWindowValueContainer, $('.profile-description-element', undefined, useForCurrentWindowTitle));
		disposables.add(useForCurrentWindowCheckbox.onChange(() => {
			if (profileElement?.root instanceof UserDataProfileElement) {
				profileElement.root.toggleCurrentWindowProfile();
			}
		}));
		disposables.add(addDisposableListener(useForCurrentWindowLabel, EventType.CLICK, () => {
			if (profileElement?.root instanceof UserDataProfileElement) {
				profileElement.root.toggleCurrentWindowProfile();
			}
		}));

		const renderUseCurrentProfile = (profileElement: ProfileTreeElement) => {
			useForCurrentWindowCheckbox.checked = profileElement.root instanceof UserDataProfileElement && this.userDataProfileService.currentProfile.id === profileElement.root.profile.id;
			if (useForCurrentWindowCheckbox.checked && this.userDataProfileService.currentProfile.isDefault) {
				useForCurrentWindowCheckbox.disable();
			} else {
				useForCurrentWindowCheckbox.enable();
			}
		};

		const that = this;
		return {
			set element(element: ProfileTreeElement) {
				profileElement = element;
				renderUseCurrentProfile(profileElement);
				elementDisposables.add(that.userDataProfileService.onDidChangeCurrentProfile(e => {
					renderUseCurrentProfile(element);
				}));
			},
			disposables,
			elementDisposables
		};
	}
}

class UseAsDefaultProfileRenderer extends ProfilePropertyRenderer {

	readonly templateId: ProfileProperty = 'useAsDefault';

	renderTemplate(parent: HTMLElement): IProfilePropertyRendererTemplate {
		const disposables = new DisposableStore();
		const elementDisposables = disposables.add(new DisposableStore());
		let profileElement: ProfileTreeElement | undefined;

		const useAsDefaultProfileContainer = append(parent, $('.profile-row-container'));
		append(useAsDefaultProfileContainer, $('.profile-label-element', undefined, localize('use for new windows', "Use for New Windows")));
		const useAsDefaultProfileValueContainer = append(useAsDefaultProfileContainer, $('.profile-use-as-default-container'));
		const useAsDefaultProfileTitle = localize('enable for new windows', "Use this profile as the default for new windows");
		const useAsDefaultProfileCheckbox = disposables.add(new Checkbox(useAsDefaultProfileTitle, false, defaultCheckboxStyles));
		append(useAsDefaultProfileValueContainer, useAsDefaultProfileCheckbox.domNode);
		const useAsDefaultProfileLabel = append(useAsDefaultProfileValueContainer, $('.profile-description-element', undefined, useAsDefaultProfileTitle));
		disposables.add(useAsDefaultProfileCheckbox.onChange(() => {
			if (profileElement?.root instanceof UserDataProfileElement) {
				profileElement.root.toggleNewWindowProfile();
			}
		}));
		disposables.add(addDisposableListener(useAsDefaultProfileLabel, EventType.CLICK, () => {
			if (profileElement?.root instanceof UserDataProfileElement) {
				profileElement.root.toggleNewWindowProfile();
			}
		}));

		const renderUseAsDefault = (profileElement: ProfileTreeElement) => {
			useAsDefaultProfileCheckbox.checked = profileElement.root instanceof UserDataProfileElement && profileElement.root.isNewWindowProfile;
		};

		return {
			set element(element: ProfileTreeElement) {
				profileElement = element;
				renderUseAsDefault(profileElement);
				elementDisposables.add(profileElement.root.onDidChange(e => {
					if (e.newWindowProfile) {
						renderUseAsDefault(element);
					}
				}));
			},
			disposables,
			elementDisposables
		};
	}
}

class CopyFromProfileRenderer extends ProfilePropertyRenderer {

	readonly templateId: ProfileProperty = 'copyFrom';

	private templates: readonly IProfileTemplateInfo[] = [];

	constructor(
		@IUserDataProfilesService private readonly userDataProfilesService: IUserDataProfilesService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@IContextViewService private readonly contextViewService: IContextViewService,
	) {
		super();
	}

	renderTemplate(parent: HTMLElement): IProfilePropertyRendererTemplate {
		const disposables = new DisposableStore();
		const elementDisposables = disposables.add(new DisposableStore());
		let profileElement: ProfileTreeElement | undefined;

		const copyFromContainer = append(parent, $('.profile-row-container.profile-copy-from-container'));
		append(copyFromContainer, $('.profile-label-element', undefined, localize('create from', "Copy from")));
		append(copyFromContainer, $('.profile-description-element', undefined, localize('copy from description', "Select the profile source from which you want to copy contents")));
		const copyFromSelectBox = disposables.add(this.instantiationService.createInstance(SelectBox,
			[],
			0,
			this.contextViewService,
			defaultSelectBoxStyles,
			{
				useCustomDrawn: true,
				ariaLabel: localize('copy profile from', "Copy profile from"),
			}
		));
		copyFromSelectBox.render(append(copyFromContainer, $('.profile-select-container')));

		const render = (profileElement: NewProfileElement, copyFromOptions: (ISelectOptionItem & { id?: string; source?: IUserDataProfile | URI })[]) => {
			copyFromSelectBox.setOptions(copyFromOptions);
			const id = profileElement.copyFrom instanceof URI ? profileElement.copyFrom.toString() : profileElement.copyFrom?.id;
			const index = id
				? copyFromOptions.findIndex(option => option.id === id)
				: 0;
			copyFromSelectBox.select(index);
		};

		const that = this;
		return {
			set element(element: ProfileTreeElement) {
				profileElement = element;
				if (profileElement.root instanceof NewProfileElement) {
					const newProfileElement = profileElement.root;
					let copyFromOptions = that.getCopyFromOptions(newProfileElement);
					render(newProfileElement, copyFromOptions);
					copyFromSelectBox.setEnabled(!newProfileElement.previewProfile && !newProfileElement.disabled);
					elementDisposables.add(profileElement.root.onDidChange(e => {
						if (e.copyFrom || e.copyFromInfo) {
							copyFromOptions = that.getCopyFromOptions(newProfileElement);
							render(newProfileElement, copyFromOptions);
						}
						if (e.preview || e.disabled) {
							copyFromSelectBox.setEnabled(!newProfileElement.previewProfile && !newProfileElement.disabled);
						}
					}));
					elementDisposables.add(copyFromSelectBox.onDidSelect(option => {
						newProfileElement.copyFrom = copyFromOptions[option.index].source;
					}));
				}
			},
			disposables,
			elementDisposables
		};
	}

	setTemplates(templates: readonly IProfileTemplateInfo[]): void {
		this.templates = templates;
	}

	private getCopyFromOptions(profileElement: NewProfileElement): (ISelectOptionItem & { id?: string; source?: IUserDataProfile | URI })[] {
		const copyFromOptions: (ISelectOptionItem & { id?: string; source?: IUserDataProfile | URI })[] = [];

		copyFromOptions.push({ text: localize('empty profile', "None") });
		for (const [copyFromTemplate, name] of profileElement.copyFromTemplates) {
			if (!this.templates.some(template => this.uriIdentityService.extUri.isEqual(URI.parse(template.url), copyFromTemplate))) {
				copyFromOptions.push({ text: `${name} (${basename(copyFromTemplate)})`, id: copyFromTemplate.toString(), source: copyFromTemplate });
			}
		}

		if (this.templates.length) {
			copyFromOptions.push({ ...SeparatorSelectOption, decoratorRight: localize('from templates', "Profile Templates") });
			for (const template of this.templates) {
				copyFromOptions.push({ text: template.name, id: template.url, source: URI.parse(template.url) });
			}
		}
		copyFromOptions.push({ ...SeparatorSelectOption, decoratorRight: localize('from existing profiles', "Existing Profiles") });
		for (const profile of this.userDataProfilesService.profiles) {
			if (!profile.isTransient) {
				copyFromOptions.push({ text: profile.name, id: profile.id, source: profile });
			}
		}
		return copyFromOptions;
	}
}

class ContentsProfileRenderer extends ProfilePropertyRenderer {

	readonly templateId: ProfileProperty = 'contents';

	private readonly _onDidChangeContentHeight = this._register(new Emitter<ProfileTreeElement>());
	readonly onDidChangeContentHeight = this._onDidChangeContentHeight.event;

	private readonly _onDidChangeSelection = this._register(new Emitter<{ element: ProfileTreeElement; selected: boolean }>());
	readonly onDidChangeSelection = this._onDidChangeSelection.event;

	private profilesContentTree: WorkbenchAsyncDataTree<AbstractUserDataProfileElement, ProfileContentTreeElement> | undefined;

	constructor(
		@IUserDataProfilesService private readonly userDataProfilesService: IUserDataProfilesService,
		@IContextMenuService private readonly contextMenuService: IContextMenuService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		super();
	}

	renderTemplate(parent: HTMLElement): IProfilePropertyRendererTemplate {
		const disposables = new DisposableStore();
		const elementDisposables = disposables.add(new DisposableStore());
		let profileElement: ProfileTreeElement | undefined;

		const configureRowContainer = append(parent, $('.profile-row-container'));
		append(configureRowContainer, $('.profile-label-element', undefined, localize('contents', "Contents")));
		const contentsDescriptionElement = append(configureRowContainer, $('.profile-description-element'));
		const contentsTreeHeader = append(configureRowContainer, $('.profile-content-tree-header'));
		const optionsLabel = $('.options-header', undefined, $('span', undefined, localize('options', "Source")));
		append(contentsTreeHeader,
			$(''),
			$('', undefined, localize('contents', "Contents")),
			optionsLabel,
			$(''),
		);

		const delegate = new ProfileContentTreeElementDelegate();
		const profilesContentTree = this.profilesContentTree = disposables.add(this.instantiationService.createInstance(WorkbenchAsyncDataTree<AbstractUserDataProfileElement, ProfileContentTreeElement>,
			'ProfileEditor-ContentsTree',
			append(configureRowContainer, $('.profile-content-tree.file-icon-themable-tree.show-file-icons')),
			delegate,
			[
				this.instantiationService.createInstance(ExistingProfileResourceTreeRenderer),
				this.instantiationService.createInstance(NewProfileResourceTreeRenderer),
				this.instantiationService.createInstance(ProfileResourceChildTreeItemRenderer),
			],
			this.instantiationService.createInstance(ProfileResourceTreeDataSource),
			{
				multipleSelectionSupport: false,
				horizontalScrolling: false,
				accessibilityProvider: {
					getAriaLabel(element: ProfileContentTreeElement | null): string {
						if ((<IProfileResourceTypeElement>element?.element).resourceType) {
							return (<IProfileResourceTypeElement>element?.element).resourceType;
						}
						if ((<IProfileResourceTypeChildElement>element?.element).label) {
							return (<IProfileResourceTypeChildElement>element?.element).label;
						}
						return '';
					},
					getWidgetAriaLabel(): string {
						return '';
					},
				},
				identityProvider: {
					getId(element) {
						if (element?.element.handle) {
							return element.element.handle;
						}
						return '';
					}
				},
				expandOnlyOnTwistieClick: true,
				renderIndentGuides: RenderIndentGuides.None,
				enableStickyScroll: false,
				openOnSingleClick: false,
				alwaysConsumeMouseWheel: false,
			}));

		this.profilesContentTree.style(listStyles);

		disposables.add(toDisposable(() => this.profilesContentTree = undefined));

		disposables.add(this.profilesContentTree.onDidChangeContentHeight(height => {
			this.profilesContentTree?.layout(height);
			if (profileElement) {
				this._onDidChangeContentHeight.fire(profileElement);
			}
		}));

		disposables.add(this.profilesContentTree.onDidChangeSelection((e => {
			if (profileElement) {
				this._onDidChangeSelection.fire({ element: profileElement, selected: !!e.elements.length });
			}
		})));

		disposables.add(this.profilesContentTree.onDidOpen(async (e) => {
			if (!e.browserEvent) {
				return;
			}
			if (e.element?.element.openAction) {
				await e.element.element.openAction.run();
			}
		}));

		disposables.add(this.profilesContentTree.onContextMenu(async (e) => {
			if (!e.element?.element.actions?.contextMenu?.length) {
				return;
			}
			this.contextMenuService.showContextMenu({
				getAnchor: () => e.anchor,
				getActions: () => e.element?.element?.actions?.contextMenu ?? [],
				getActionsContext: () => e.element
			});
		}));

		const updateDescription = (element: ProfileTreeElement) => {
			clearNode(contentsDescriptionElement);

			const markdown = new MarkdownString();
			if (element.root instanceof UserDataProfileElement && element.root.profile.isDefault) {
				markdown.appendMarkdown(localize('default profile contents description', "Browse contents of this profile\n"));
			}

			else {
				markdown.appendMarkdown(localize('contents source description', "Configure source of contents for this profile\n"));
				if (element.root instanceof NewProfileElement) {
					const copyFromName = element.root.getCopyFromName();
					const optionName = copyFromName === this.userDataProfilesService.defaultProfile.name
						? localize('copy from default', "{0} (Copy)", copyFromName)
						: copyFromName;
					if (optionName) {
						markdown
							.appendMarkdown(localize('copy info', "- *{0}:* Copy contents from the {1} profile\n", optionName, copyFromName));
					}
					markdown
						.appendMarkdown(localize('default info', "- *Default:* Use contents from the Default profile\n"))
						.appendMarkdown(localize('none info', "- *None:* Create empty contents\n"));
				}
			}

			append(contentsDescriptionElement, elementDisposables.add(renderMarkdown(markdown)).element);
		};

		const that = this;
		return {
			set element(element: ProfileTreeElement) {
				profileElement = element;
				updateDescription(element);
				if (element.root instanceof NewProfileElement) {
					contentsTreeHeader.classList.remove('default-profile');
				} else if (element.root instanceof UserDataProfileElement) {
					contentsTreeHeader.classList.toggle('default-profile', element.root.profile.isDefault);
				}
				profilesContentTree.setInput(profileElement.root);
				elementDisposables.add(profileElement.root.onDidChange(e => {
					if (e.copyFrom || e.copyFlags || e.flags || e.extensions || e.snippets || e.preview) {
						profilesContentTree.updateChildren(element.root);
					}
					if (e.copyFromInfo) {
						updateDescription(element);
						that._onDidChangeContentHeight.fire(element);
					}
				}));
			},
			disposables,
			elementDisposables
		};
	}

	clearSelection(): void {
		if (this.profilesContentTree) {
			this.profilesContentTree.setSelection([]);
			this.profilesContentTree.setFocus([]);
		}
	}
}

interface WorkspaceTableElement {
	readonly workspace: URI;
	readonly profileElement: UserDataProfileElement;
}

class ProfileWorkspacesRenderer extends ProfilePropertyRenderer {

	readonly templateId: ProfileProperty = 'workspaces';

	private readonly _onDidChangeContentHeight = this._register(new Emitter<ProfileTreeElement>());
	readonly onDidChangeContentHeight = this._onDidChangeContentHeight.event;

	private readonly _onDidChangeSelection = this._register(new Emitter<{ element: ProfileTreeElement; selected: boolean }>());
	readonly onDidChangeSelection = this._onDidChangeSelection.event;

	private workspacesTable: WorkbenchTable<WorkspaceTableElement> | undefined;

	constructor(
		@ILabelService private readonly labelService: ILabelService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@IFileDialogService private readonly fileDialogService: IFileDialogService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		super();
	}

	renderTemplate(parent: HTMLElement): IProfilePropertyRendererTemplate {
		const disposables = new DisposableStore();
		const elementDisposables = disposables.add(new DisposableStore());
		let profileElement: ProfileTreeElement | undefined;

		const profileWorkspacesRowContainer = append(parent, $('.profile-row-container'));
		append(profileWorkspacesRowContainer, $('.profile-label-element', undefined, localize('folders_workspaces', "Folders & Workspaces")));
		const profileWorkspacesDescriptionElement = append(profileWorkspacesRowContainer, $('.profile-description-element'));

		const workspacesTableContainer = append(profileWorkspacesRowContainer, $('.profile-associations-table'));
		const table = this.workspacesTable = disposables.add(this.instantiationService.createInstance(WorkbenchTable<WorkspaceTableElement>,
			'ProfileEditor-AssociationsTable',
			workspacesTableContainer,
			new class implements ITableVirtualDelegate<URI> {
				readonly headerRowHeight = 30;
				getHeight() { return 24; }
			},
			[
				{
					label: '',
					tooltip: '',
					weight: 1,
					minimumWidth: 30,
					maximumWidth: 30,
					templateId: WorkspaceUriEmptyColumnRenderer.TEMPLATE_ID,
					project(row: WorkspaceTableElement): WorkspaceTableElement { return row; },
				},
				{
					label: localize('hostColumnLabel', "Host"),
					tooltip: '',
					weight: 2,
					templateId: WorkspaceUriHostColumnRenderer.TEMPLATE_ID,
					project(row: WorkspaceTableElement): WorkspaceTableElement { return row; },
				},
				{
					label: localize('pathColumnLabel', "Path"),
					tooltip: '',
					weight: 7,
					templateId: WorkspaceUriPathColumnRenderer.TEMPLATE_ID,
					project(row: WorkspaceTableElement): WorkspaceTableElement { return row; }
				},
				{
					label: '',
					tooltip: '',
					weight: 1,
					minimumWidth: 84,
					maximumWidth: 84,
					templateId: WorkspaceUriActionsColumnRenderer.TEMPLATE_ID,
					project(row: WorkspaceTableElement): WorkspaceTableElement { return row; }
				},
			],
			[
				new WorkspaceUriEmptyColumnRenderer(),
				this.instantiationService.createInstance(WorkspaceUriHostColumnRenderer),
				this.instantiationService.createInstance(WorkspaceUriPathColumnRenderer),
				this.instantiationService.createInstance(WorkspaceUriActionsColumnRenderer),
			],
			{
				horizontalScrolling: false,
				alwaysConsumeMouseWheel: false,
				openOnSingleClick: false,
				multipleSelectionSupport: false,
				accessibilityProvider: {
					getAriaLabel: (item: WorkspaceTableElement) => {
						const hostLabel = getHostLabel(this.labelService, item.workspace);
						if (hostLabel === undefined || hostLabel.length === 0) {
							return localize('trustedFolderAriaLabel', "{0}, trusted", this.labelService.getUriLabel(item.workspace));
						}

						return localize('trustedFolderWithHostAriaLabel', "{0} on {1}, trusted", this.labelService.getUriLabel(item.workspace), hostLabel);
					},
					getWidgetAriaLabel: () => localize('trustedFoldersAndWorkspaces', "Trusted Folders & Workspaces")
				},
				identityProvider: {
					getId(element: WorkspaceTableElement) {
						return element.workspace.toString();
					},
				}
			}));
		this.workspacesTable.style(listStyles);
		disposables.add(toDisposable(() => this.workspacesTable = undefined));
		disposables.add(this.workspacesTable.onDidChangeSelection((e => {
			if (profileElement) {
				this._onDidChangeSelection.fire({ element: profileElement, selected: !!e.elements.length });
			}
		})));

		const addButtonBarElement = append(profileWorkspacesRowContainer, $('.profile-workspaces-button-container'));
		const buttonBar = disposables.add(new ButtonBar(addButtonBarElement));
		const addButton = this._register(buttonBar.addButton({ title: localize('addButton', "Add Folder"), ...defaultButtonStyles }));
		addButton.label = localize('addButton', "Add Folder");

		disposables.add(addButton.onDidClick(async () => {
			const uris = await this.fileDialogService.showOpenDialog({
				canSelectFiles: false,
				canSelectFolders: true,
				canSelectMany: true,
				openLabel: localize('addFolder', "Add Folder"),
				title: localize('addFolderTitle', "Select Folders To Add")
			});
			if (uris) {
				if (profileElement?.root instanceof UserDataProfileElement) {
					profileElement.root.updateWorkspaces(uris, []);
				}
			}
		}));

		disposables.add(table.onDidOpen(item => {
			if (item?.element) {
				item.element.profileElement.openWorkspace(item.element.workspace);
			}
		}));

		const updateTable = () => {
			if (profileElement?.root instanceof UserDataProfileElement && profileElement.root.workspaces?.length) {
				profileWorkspacesDescriptionElement.textContent = localize('folders_workspaces_description', "Following folders and workspaces are using this profile");
				workspacesTableContainer.classList.remove('hide');
				table.splice(0, table.length, profileElement.root.workspaces
					.map(workspace => ({ workspace, profileElement: <UserDataProfileElement>profileElement!.root }))
					.sort((a, b) => this.uriIdentityService.extUri.compare(a.workspace, b.workspace))
				);
				this.layout();
			} else {
				profileWorkspacesDescriptionElement.textContent = localize('no_folder_description', "No folders or workspaces are using this profile");
				workspacesTableContainer.classList.add('hide');
			}
		};

		const that = this;
		return {
			set element(element: ProfileTreeElement) {
				profileElement = element;
				if (element.root instanceof UserDataProfileElement) {
					updateTable();
				}
				elementDisposables.add(profileElement.root.onDidChange(e => {
					if (profileElement && e.workspaces) {
						updateTable();
						that._onDidChangeContentHeight.fire(profileElement);
					}
				}));
			},
			disposables,
			elementDisposables
		};
	}

	layout(): void {
		if (this.workspacesTable) {
			this.workspacesTable.layout((this.workspacesTable.length * 24) + 30, undefined);
		}
	}

	clearSelection(): void {
		if (this.workspacesTable) {
			this.workspacesTable.setSelection([]);
			this.workspacesTable.setFocus([]);
		}
	}
}

class ExistingProfileResourceTreeRenderer extends AbstractProfileResourceTreeRenderer implements ITreeRenderer<ProfileContentTreeElement, void, IExistingProfileResourceTemplateData> {

	static readonly TEMPLATE_ID = 'ExistingProfileResourceTemplate';

	readonly templateId = ExistingProfileResourceTreeRenderer.TEMPLATE_ID;

	constructor(
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		super();
	}

	renderTemplate(parent: HTMLElement): IExistingProfileResourceTemplateData {
		const disposables = new DisposableStore();
		const container = append(parent, $('.profile-tree-item-container.existing-profile-resource-type-container'));
		const label = append(container, $('.profile-resource-type-label'));

		const radio = disposables.add(new Radio({ items: [] }));
		append(append(container, $('.profile-resource-options-container')), radio.domNode);

		const actionsContainer = append(container, $('.profile-resource-actions-container'));
		const actionBar = disposables.add(this.instantiationService.createInstance(WorkbenchToolBar,
			actionsContainer,
			{
				hoverDelegate: disposables.add(createInstantHoverDelegate()),
				highlightToggledItems: true
			}
		));

		return { label, radio, actionBar, disposables, elementDisposables: disposables.add(new DisposableStore()) };
	}

	renderElement({ element: profileResourceTreeElement }: ITreeNode<ProfileContentTreeElement, void>, index: number, templateData: IExistingProfileResourceTemplateData): void {
		templateData.elementDisposables.clear();
		const { element, root } = profileResourceTreeElement;
		if (!(root instanceof UserDataProfileElement)) {
			throw new Error('ExistingProfileResourceTreeRenderer can only render existing profile element');
		}
		if (isString(element) || !isProfileResourceTypeElement(element)) {
			throw new Error('Invalid profile resource element');
		}

		const updateRadioItems = () => {
			templateData.radio.setItems([{
				text: localize('default', "Default"),
				tooltip: localize('default description', "Use {0} from the Default profile", resourceTypeTitle),
				isActive: root.getFlag(element.resourceType)
			},
			{
				text: root.name,
				tooltip: localize('current description', "Use {0} from the {1} profile", resourceTypeTitle, root.name),
				isActive: !root.getFlag(element.resourceType)
			}]);
		};

		const resourceTypeTitle = this.getResourceTypeTitle(element.resourceType);
		templateData.label.textContent = resourceTypeTitle;

		if (root instanceof UserDataProfileElement && root.profile.isDefault) {
			templateData.radio.domNode.classList.add('hide');
		} else {
			templateData.radio.domNode.classList.remove('hide');
			updateRadioItems();
			templateData.elementDisposables.add(root.onDidChange(e => {
				if (e.name) {
					updateRadioItems();
				}
			}));
			templateData.elementDisposables.add(templateData.radio.onDidSelect((index) => root.setFlag(element.resourceType, index === 0)));
		}

		const actions: IAction[] = [];
		if (element.openAction) {
			actions.push(element.openAction);
		}
		if (element.actions?.primary) {
			actions.push(...element.actions.primary);
		}
		templateData.actionBar.setActions(actions);
	}

}

class NewProfileResourceTreeRenderer extends AbstractProfileResourceTreeRenderer implements ITreeRenderer<ProfileContentTreeElement, void, INewProfileResourceTemplateData> {

	static readonly TEMPLATE_ID = 'NewProfileResourceTemplate';

	readonly templateId = NewProfileResourceTreeRenderer.TEMPLATE_ID;

	constructor(
		@IUserDataProfilesService private readonly userDataProfilesService: IUserDataProfilesService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		super();
	}

	renderTemplate(parent: HTMLElement): INewProfileResourceTemplateData {
		const disposables = new DisposableStore();
		const container = append(parent, $('.profile-tree-item-container.new-profile-resource-type-container'));
		const labelContainer = append(container, $('.profile-resource-type-label-container'));
		const label = append(labelContainer, $('span.profile-resource-type-label'));

		const radio = disposables.add(new Radio({ items: [] }));
		append(append(container, $('.profile-resource-options-container')), radio.domNode);

		const actionsContainer = append(container, $('.profile-resource-actions-container'));
		const actionBar = disposables.add(this.instantiationService.createInstance(WorkbenchToolBar,
			actionsContainer,
			{
				hoverDelegate: disposables.add(createInstantHoverDelegate()),
				highlightToggledItems: true
			}
		));

		return { label, radio, actionBar, disposables, elementDisposables: disposables.add(new DisposableStore()) };
	}

	renderElement({ element: profileResourceTreeElement }: ITreeNode<ProfileContentTreeElement, void>, index: number, templateData: INewProfileResourceTemplateData): void {
		templateData.elementDisposables.clear();
		const { element, root } = profileResourceTreeElement;
		if (!(root instanceof NewProfileElement)) {
			throw new Error('NewProfileResourceTreeRenderer can only render new profile element');
		}
		if (isString(element) || !isProfileResourceTypeElement(element)) {
			throw new Error('Invalid profile resource element');
		}

		const resourceTypeTitle = this.getResourceTypeTitle(element.resourceType);
		templateData.label.textContent = resourceTypeTitle;

		const renderRadioItems = () => {
			const options = [{
				text: localize('default', "Default"),
				tooltip: localize('default description', "Use {0} from the Default profile", resourceTypeTitle),
			},
			{
				text: localize('none', "None"),
				tooltip: localize('none description', "Create empty {0}", resourceTypeTitle)
			}];
			const copyFromName = root.getCopyFromName();
			const name = copyFromName === this.userDataProfilesService.defaultProfile.name
				? localize('copy from default', "{0} (Copy)", copyFromName)
				: copyFromName;
			if (root.copyFrom && name) {
				templateData.radio.setItems([
					{
						text: name,
						tooltip: name ? localize('copy from profile description', "Copy {0} from the {1} profile", resourceTypeTitle, name) : localize('copy description', "Copy"),
					},
					...options
				]);
				templateData.radio.setActiveItem(root.getCopyFlag(element.resourceType) ? 0 : root.getFlag(element.resourceType) ? 1 : 2);
			} else {
				templateData.radio.setItems(options);
				templateData.radio.setActiveItem(root.getFlag(element.resourceType) ? 0 : 1);
			}
		};

		if (root.copyFrom) {
			templateData.elementDisposables.add(templateData.radio.onDidSelect(index => {
				root.setFlag(element.resourceType, index === 1);
				root.setCopyFlag(element.resourceType, index === 0);
			}));
		} else {
			templateData.elementDisposables.add(templateData.radio.onDidSelect(index => {
				root.setFlag(element.resourceType, index === 0);
			}));
		}

		renderRadioItems();
		templateData.radio.setEnabled(!root.disabled && !root.previewProfile);
		templateData.elementDisposables.add(root.onDidChange(e => {
			if (e.disabled || e.preview) {
				templateData.radio.setEnabled(!root.disabled && !root.previewProfile);
			}
			if (e.copyFrom || e.copyFromInfo) {
				renderRadioItems();
			}
		}));
		const actions: IAction[] = [];
		if (element.openAction) {
			actions.push(element.openAction);
		}
		if (element.actions?.primary) {
			actions.push(...element.actions.primary);
		}
		templateData.actionBar.setActions(actions);
	}
}

class ProfileResourceChildTreeItemRenderer extends AbstractProfileResourceTreeRenderer implements ITreeRenderer<ProfileContentTreeElement, void, IProfileResourceChildTreeItemTemplateData> {

	static readonly TEMPLATE_ID = 'ProfileResourceChildTreeItemTemplate';

	readonly templateId = ProfileResourceChildTreeItemRenderer.TEMPLATE_ID;
	private readonly labels: ResourceLabels;
	private readonly hoverDelegate: IHoverDelegate;

	constructor(
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		super();
		this.labels = instantiationService.createInstance(ResourceLabels, DEFAULT_LABELS_CONTAINER);
		this.hoverDelegate = this._register(instantiationService.createInstance(WorkbenchHoverDelegate, 'mouse', undefined, {}));
	}

	renderTemplate(parent: HTMLElement): IProfileResourceChildTreeItemTemplateData {
		const disposables = new DisposableStore();
		const container = append(parent, $('.profile-tree-item-container.profile-resource-child-container'));
		const checkbox = disposables.add(new Checkbox('', false, defaultCheckboxStyles));
		append(container, checkbox.domNode);
		const resourceLabel = disposables.add(this.labels.create(container, { hoverDelegate: this.hoverDelegate }));

		const actionsContainer = append(container, $('.profile-resource-actions-container'));
		const actionBar = disposables.add(this.instantiationService.createInstance(WorkbenchToolBar,
			actionsContainer,
			{
				hoverDelegate: disposables.add(createInstantHoverDelegate()),
				highlightToggledItems: true
			}
		));

		return { checkbox, resourceLabel, actionBar, disposables, elementDisposables: disposables.add(new DisposableStore()) };
	}

	renderElement({ element: profileResourceTreeElement }: ITreeNode<ProfileContentTreeElement, void>, index: number, templateData: IProfileResourceChildTreeItemTemplateData): void {
		templateData.elementDisposables.clear();
		const { element } = profileResourceTreeElement;

		if (isString(element) || !isProfileResourceChildElement(element)) {
			throw new Error('Invalid profile resource element');
		}

		if (element.checkbox) {
			templateData.checkbox.domNode.setAttribute('tabindex', '0');
			templateData.checkbox.domNode.classList.remove('hide');
			templateData.checkbox.checked = element.checkbox.isChecked;
			templateData.checkbox.domNode.ariaLabel = element.checkbox.accessibilityInformation?.label ?? '';
			if (element.checkbox.accessibilityInformation?.role) {
				templateData.checkbox.domNode.role = element.checkbox.accessibilityInformation.role;
			}
		} else {
			templateData.checkbox.domNode.removeAttribute('tabindex');
			templateData.checkbox.domNode.classList.add('hide');
		}

		templateData.resourceLabel.setResource(
			{
				name: element.resource ? basename(element.resource) : element.label,
				description: element.description,
				resource: element.resource
			},
			{
				forceLabel: true,
				icon: element.icon,
				hideIcon: !element.resource && !element.icon,
			});
		const actions: IAction[] = [];
		if (element.openAction) {
			actions.push(element.openAction);
		}
		if (element.actions?.primary) {
			actions.push(...element.actions.primary);
		}
		templateData.actionBar.setActions(actions);
	}

}

class WorkspaceUriEmptyColumnRenderer implements ITableRenderer<WorkspaceTableElement, {}> {
	static readonly TEMPLATE_ID = 'empty';

	readonly templateId: string = WorkspaceUriEmptyColumnRenderer.TEMPLATE_ID;

	renderTemplate(container: HTMLElement): {} {
		return {};
	}

	renderElement(item: WorkspaceTableElement, index: number, templateData: {}): void {
	}

	disposeTemplate(): void {
	}

}

interface IWorkspaceUriHostColumnTemplateData {
	element: HTMLElement;
	hostContainer: HTMLElement;
	buttonBarContainer: HTMLElement;
	disposables: DisposableStore;
	renderDisposables: DisposableStore;
}

class WorkspaceUriHostColumnRenderer implements ITableRenderer<WorkspaceTableElement, IWorkspaceUriHostColumnTemplateData> {
	static readonly TEMPLATE_ID = 'host';

	readonly templateId: string = WorkspaceUriHostColumnRenderer.TEMPLATE_ID;

	constructor(
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@ILabelService private readonly labelService: ILabelService,
	) { }

	renderTemplate(container: HTMLElement): IWorkspaceUriHostColumnTemplateData {
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

	renderElement(item: WorkspaceTableElement, index: number, templateData: IWorkspaceUriHostColumnTemplateData): void {
		templateData.renderDisposables.clear();
		templateData.renderDisposables.add({ dispose: () => { clearNode(templateData.buttonBarContainer); } });

		templateData.hostContainer.innerText = getHostLabel(this.labelService, item.workspace);
		templateData.element.classList.toggle('current-workspace', this.uriIdentityService.extUri.isEqual(item.workspace, item.profileElement.getCurrentWorkspace()));

		templateData.hostContainer.style.display = '';
		templateData.buttonBarContainer.style.display = 'none';
	}

	disposeTemplate(templateData: IWorkspaceUriHostColumnTemplateData): void {
		templateData.disposables.dispose();
	}

}

interface IWorkspaceUriPathColumnTemplateData {
	element: HTMLElement;
	pathLabel: HTMLElement;
	pathHover: IManagedHover;
	renderDisposables: DisposableStore;
	disposables: DisposableStore;
}

class WorkspaceUriPathColumnRenderer implements ITableRenderer<WorkspaceTableElement, IWorkspaceUriPathColumnTemplateData> {
	static readonly TEMPLATE_ID = 'path';

	readonly templateId: string = WorkspaceUriPathColumnRenderer.TEMPLATE_ID;

	private readonly hoverDelegate: IHoverDelegate;

	constructor(
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@IHoverService private readonly hoverService: IHoverService,
	) {
		this.hoverDelegate = getDefaultHoverDelegate('mouse');
	}

	renderTemplate(container: HTMLElement): IWorkspaceUriPathColumnTemplateData {
		const disposables = new DisposableStore();
		const element = container.appendChild($('.path'));
		const pathLabel = element.appendChild($('div.path-label'));
		const pathHover = disposables.add(this.hoverService.setupManagedHover(this.hoverDelegate, pathLabel, ''));
		const renderDisposables = disposables.add(new DisposableStore());

		return {
			element,
			pathLabel,
			pathHover,
			disposables,
			renderDisposables
		};
	}

	renderElement(item: WorkspaceTableElement, index: number, templateData: IWorkspaceUriPathColumnTemplateData): void {
		templateData.renderDisposables.clear();
		const stringValue = this.formatPath(item.workspace);
		templateData.pathLabel.innerText = stringValue;
		templateData.element.classList.toggle('current-workspace', this.uriIdentityService.extUri.isEqual(item.workspace, item.profileElement.getCurrentWorkspace()));
		templateData.pathHover.update(stringValue);
	}

	disposeTemplate(templateData: IWorkspaceUriPathColumnTemplateData): void {
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

interface IActionsColumnTemplateData {
	readonly actionBar: ActionBar;
	readonly disposables: DisposableStore;
}

class ChangeProfileAction implements IAction {

	readonly id = 'changeProfile';
	readonly label = 'Change Profile';
	readonly class = ThemeIcon.asClassName(editIcon);
	readonly enabled = true;
	readonly tooltip = localize('change profile', "Change Profile");
	readonly checked = false;

	constructor(
		private readonly item: WorkspaceTableElement,
		@IUserDataProfilesService private readonly userDataProfilesService: IUserDataProfilesService,
	) {
	}

	run(): void { }

	getSwitchProfileActions(): IAction[] {
		return this.userDataProfilesService.profiles
			.filter(profile => !profile.isTransient)
			.sort((a, b) => a.isDefault ? -1 : b.isDefault ? 1 : a.name.localeCompare(b.name))
			.map<IAction>(profile => ({
				id: `switchProfileTo${profile.id}`,
				label: profile.name,
				class: undefined,
				enabled: true,
				checked: profile.id === this.item.profileElement.profile.id,
				tooltip: '',
				run: () => {
					if (profile.id === this.item.profileElement.profile.id) {
						return;
					}
					this.userDataProfilesService.updateProfile(profile, { workspaces: [...(profile.workspaces ?? []), this.item.workspace] });
				}
			}));
	}
}

class WorkspaceUriActionsColumnRenderer implements ITableRenderer<WorkspaceTableElement, IActionsColumnTemplateData> {

	static readonly TEMPLATE_ID = 'actions';

	readonly templateId: string = WorkspaceUriActionsColumnRenderer.TEMPLATE_ID;

	constructor(
		@IUserDataProfilesService private readonly userDataProfilesService: IUserDataProfilesService,
		@IUserDataProfileManagementService private readonly userDataProfileManagementService: IUserDataProfileManagementService,
		@IContextMenuService private readonly contextMenuService: IContextMenuService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
	) {
	}

	renderTemplate(container: HTMLElement): IActionsColumnTemplateData {
		const disposables = new DisposableStore();
		const element = container.appendChild($('.profile-workspaces-actions-container'));
		const hoverDelegate = disposables.add(createInstantHoverDelegate());
		const actionBar = disposables.add(new ActionBar(element, {
			hoverDelegate,
			actionViewItemProvider: (action) => {
				if (action instanceof ChangeProfileAction) {
					return new DropdownMenuActionViewItem(action, { getActions: () => action.getSwitchProfileActions() }, this.contextMenuService, {
						classNames: action.class,
						hoverDelegate,
					});
				}
				return undefined;
			}
		}));
		return { actionBar, disposables };
	}

	renderElement(item: WorkspaceTableElement, index: number, templateData: IActionsColumnTemplateData): void {
		templateData.actionBar.clear();
		const actions: IAction[] = [];
		actions.push(this.createOpenAction(item));
		actions.push(new ChangeProfileAction(item, this.userDataProfilesService));
		actions.push(this.createDeleteAction(item));
		templateData.actionBar.push(actions, { icon: true });
	}

	private createOpenAction(item: WorkspaceTableElement): IAction {
		return {
			label: '',
			class: ThemeIcon.asClassName(Codicon.window),
			enabled: !this.uriIdentityService.extUri.isEqual(item.workspace, item.profileElement.getCurrentWorkspace()),
			id: 'openWorkspace',
			tooltip: localize('open', "Open in New Window"),
			run: () => item.profileElement.openWorkspace(item.workspace)
		};
	}

	private createDeleteAction(item: WorkspaceTableElement): IAction {
		return {
			label: '',
			class: ThemeIcon.asClassName(removeIcon),
			enabled: this.userDataProfileManagementService.getDefaultProfileToUse().id !== item.profileElement.profile.id,
			id: 'deleteTrustedUri',
			tooltip: localize('deleteTrustedUri', "Delete Path"),
			run: () => item.profileElement.updateWorkspaces([], [item.workspace])
		};
	}

	disposeTemplate(templateData: IActionsColumnTemplateData): void {
		templateData.disposables.dispose();
	}

}

function getHostLabel(labelService: ILabelService, workspaceUri: URI): string {
	return workspaceUri.authority ? labelService.getHostLabel(workspaceUri.scheme, workspaceUri.authority) : localize('localAuthority', "Local");
}

export class UserDataProfilesEditorInput extends EditorInput {
	static readonly ID: string = 'workbench.input.userDataProfiles';
	readonly resource = undefined;

	private readonly model: UserDataProfilesEditorModel;

	private _dirty: boolean = false;
	get dirty(): boolean { return this._dirty; }
	set dirty(dirty: boolean) {
		if (this._dirty !== dirty) {
			this._dirty = dirty;
			this._onDidChangeDirty.fire();
		}
	}

	constructor(
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		super();
		this.model = UserDataProfilesEditorModel.getInstance(this.instantiationService);
		this._register(this.model.onDidChange(e => this.dirty = this.model.profiles.some(profile => profile instanceof NewProfileElement)));
	}

	override get typeId(): string { return UserDataProfilesEditorInput.ID; }
	override getName(): string { return localize('userDataProfiles', "Profiles"); }
	override getIcon(): ThemeIcon | undefined { return defaultUserDataProfileIcon; }

	override async resolve(): Promise<UserDataProfilesEditorModel> {
		await this.model.resolve();
		return this.model;
	}

	override isDirty(): boolean {
		return this.dirty;
	}

	override async save(): Promise<EditorInput> {
		await this.model.saveNewProfile();
		return this;
	}

	override async revert(): Promise<void> {
		this.model.revert();
	}

	override matches(otherInput: EditorInput | IUntypedEditorInput): boolean { return otherInput instanceof UserDataProfilesEditorInput; }

	override dispose(): void {
		for (const profile of this.model.profiles) {
			if (profile instanceof UserDataProfileElement) {
				profile.reset();
			}
		}
		super.dispose();
	}
}

export class UserDataProfilesEditorInputSerializer implements IEditorSerializer {
	canSerialize(editorInput: EditorInput): boolean { return true; }
	serialize(editorInput: EditorInput): string { return ''; }
	deserialize(instantiationService: IInstantiationService): EditorInput { return instantiationService.createInstance(UserDataProfilesEditorInput); }
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/userDataProfile/browser/userDataProfilesEditorModel.ts]---
Location: vscode-main/src/vs/workbench/contrib/userDataProfile/browser/userDataProfilesEditorModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Action, IAction, Separator, toAction } from '../../../../base/common/actions.js';
import { Emitter } from '../../../../base/common/event.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { isMarkdownString } from '../../../../base/common/htmlContent.js';
import { localize } from '../../../../nls.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { DidChangeProfilesEvent, isUserDataProfile, IUserDataProfile, IUserDataProfilesService, ProfileResourceType, ProfileResourceTypeFlags, toUserDataProfile, UseDefaultProfileFlags } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { IProfileResourceChildTreeItem, IProfileTemplateInfo, isProfileURL, IUserDataProfileImportExportService, IUserDataProfileManagementService, IUserDataProfileService, IUserDataProfileTemplate } from '../../../services/userDataProfile/common/userDataProfile.js';
import { Disposable, DisposableStore, toDisposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import * as arrays from '../../../../base/common/arrays.js';
import { equals } from '../../../../base/common/objects.js';
import { EditorModel } from '../../../common/editor/editorModel.js';
import { ExtensionsResourceExportTreeItem, ExtensionsResourceImportTreeItem } from '../../../services/userDataProfile/browser/extensionsResource.js';
import { SettingsResource, SettingsResourceTreeItem } from '../../../services/userDataProfile/browser/settingsResource.js';
import { KeybindingsResource, KeybindingsResourceTreeItem } from '../../../services/userDataProfile/browser/keybindingsResource.js';
import { TasksResource, TasksResourceTreeItem } from '../../../services/userDataProfile/browser/tasksResource.js';
import { SnippetsResource, SnippetsResourceTreeItem } from '../../../services/userDataProfile/browser/snippetsResource.js';
import { McpProfileResource, McpResourceTreeItem } from '../../../services/userDataProfile/browser/mcpProfileResource.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { InMemoryFileSystemProvider } from '../../../../platform/files/common/inMemoryFilesystemProvider.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import { CancelablePromise, createCancelablePromise, RunOnceScheduler } from '../../../../base/common/async.js';
import { IHostService } from '../../../services/host/browser/host.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { ITreeItemCheckboxState } from '../../../common/views.js';
import { API_OPEN_EDITOR_COMMAND_ID } from '../../../browser/parts/editor/editorCommands.js';
import { SIDE_GROUP } from '../../../services/editor/common/editorService.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { CONFIG_NEW_WINDOW_PROFILE } from '../../../common/configuration.js';
import { ResourceMap, ResourceSet } from '../../../../base/common/map.js';
import { getErrorMessage } from '../../../../base/common/errors.js';
import { isWeb } from '../../../../base/common/platform.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IWorkspaceContextService, WORKSPACE_SUFFIX } from '../../../../platform/workspace/common/workspace.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { isString } from '../../../../base/common/types.js';
import { IWorkbenchExtensionManagementService } from '../../../services/extensionManagement/common/extensionManagement.js';
import { areSameExtensions } from '../../../../platform/extensionManagement/common/extensionManagementUtil.js';

export type ChangeEvent = {
	readonly name?: boolean;
	readonly icon?: boolean;
	readonly flags?: boolean;
	readonly workspaces?: boolean;
	readonly active?: boolean;
	readonly message?: boolean;
	readonly copyFrom?: boolean;
	readonly copyFromInfo?: boolean;
	readonly copyFlags?: boolean;
	readonly preview?: boolean;
	readonly profile?: boolean;
	readonly extensions?: boolean;
	readonly snippets?: boolean;
	readonly disabled?: boolean;
	readonly newWindowProfile?: boolean;
};

export interface IProfileChildElement {
	readonly handle: string;
	readonly openAction?: IAction;
	readonly actions?: {
		readonly primary?: IAction[];
		readonly contextMenu?: IAction[];
	};
	readonly checkbox?: ITreeItemCheckboxState;
}

export interface IProfileResourceTypeElement extends IProfileChildElement {
	readonly resourceType: ProfileResourceType;
}

export interface IProfileResourceTypeChildElement extends IProfileChildElement {
	readonly label: string;
	readonly description?: string;
	readonly resource?: URI;
	readonly icon?: ThemeIcon;
}

export function isProfileResourceTypeElement(element: IProfileChildElement): element is IProfileResourceTypeElement {
	return (element as IProfileResourceTypeElement).resourceType !== undefined;
}

export function isProfileResourceChildElement(element: IProfileChildElement): element is IProfileResourceTypeChildElement {
	return (element as IProfileResourceTypeChildElement).label !== undefined;
}

export abstract class AbstractUserDataProfileElement extends Disposable {

	protected readonly _onDidChange = this._register(new Emitter<ChangeEvent>());
	readonly onDidChange = this._onDidChange.event;

	private readonly saveScheduler = this._register(new RunOnceScheduler(() => this.doSave(), 500));

	constructor(
		name: string,
		icon: string | undefined,
		flags: UseDefaultProfileFlags | undefined,
		workspaces: readonly URI[] | undefined,
		isActive: boolean,
		@IUserDataProfileManagementService protected readonly userDataProfileManagementService: IUserDataProfileManagementService,
		@IUserDataProfilesService protected readonly userDataProfilesService: IUserDataProfilesService,
		@ICommandService protected readonly commandService: ICommandService,
		@IWorkspaceContextService protected readonly workspaceContextService: IWorkspaceContextService,
		@IHostService protected readonly hostService: IHostService,
		@IUriIdentityService protected readonly uriIdentityService: IUriIdentityService,
		@IFileService protected readonly fileService: IFileService,
		@IWorkbenchExtensionManagementService protected readonly extensionManagementService: IWorkbenchExtensionManagementService,
		@IInstantiationService protected readonly instantiationService: IInstantiationService,
	) {
		super();
		this._name = name;
		this._icon = icon;
		this._flags = flags;
		this._workspaces = workspaces;
		this._active = isActive;
		this._register(this.onDidChange(e => {
			if (!e.message) {
				this.validate();
			}
			this.save();
		}));
		this._register(this.extensionManagementService.onProfileAwareDidInstallExtensions(results => {
			const profile = this.getProfileToWatch();
			if (profile && results.some(r => !r.error && (r.applicationScoped || this.uriIdentityService.extUri.isEqual(r.profileLocation, profile.extensionsResource)))) {
				this._onDidChange.fire({ extensions: true });
			}
		}));
		this._register(this.extensionManagementService.onProfileAwareDidUninstallExtension(e => {
			const profile = this.getProfileToWatch();
			if (profile && !e.error && (e.applicationScoped || this.uriIdentityService.extUri.isEqual(e.profileLocation, profile.extensionsResource))) {
				this._onDidChange.fire({ extensions: true });
			}
		}));
		this._register(this.extensionManagementService.onProfileAwareDidUpdateExtensionMetadata(e => {
			const profile = this.getProfileToWatch();
			if (profile && e.local.isApplicationScoped || this.uriIdentityService.extUri.isEqual(e.profileLocation, profile?.extensionsResource)) {
				this._onDidChange.fire({ extensions: true });
			}
		}));
	}

	private _name = '';
	get name(): string { return this._name; }
	set name(name: string) {
		name = name.trim();
		if (this._name !== name) {
			this._name = name;
			this._onDidChange.fire({ name: true });
		}
	}

	private _icon: string | undefined;
	get icon(): string | undefined { return this._icon; }
	set icon(icon: string | undefined) {
		if (this._icon !== icon) {
			this._icon = icon;
			this._onDidChange.fire({ icon: true });
		}
	}

	private _workspaces: readonly URI[] | undefined;
	get workspaces(): readonly URI[] | undefined { return this._workspaces; }
	set workspaces(workspaces: readonly URI[] | undefined) {
		if (!arrays.equals(this._workspaces, workspaces, (a, b) => a.toString() === b.toString())) {
			this._workspaces = workspaces;
			this._onDidChange.fire({ workspaces: true });
		}
	}

	private _flags: UseDefaultProfileFlags | undefined;
	get flags(): UseDefaultProfileFlags | undefined { return this._flags; }
	set flags(flags: UseDefaultProfileFlags | undefined) {
		if (!equals(this._flags, flags)) {
			this._flags = flags;
			this._onDidChange.fire({ flags: true });
		}
	}

	private _active: boolean = false;
	get active(): boolean { return this._active; }
	set active(active: boolean) {
		if (this._active !== active) {
			this._active = active;
			this._onDidChange.fire({ active: true });
		}
	}

	private _message: string | undefined;
	get message(): string | undefined { return this._message; }
	set message(message: string | undefined) {
		if (this._message !== message) {
			this._message = message;
			this._onDidChange.fire({ message: true });
		}
	}

	private _disabled: boolean = false;
	get disabled(): boolean { return this._disabled; }
	set disabled(saving: boolean) {
		if (this._disabled !== saving) {
			this._disabled = saving;
			this._onDidChange.fire({ disabled: true });
		}
	}

	getFlag(key: ProfileResourceType): boolean {
		return this.flags?.[key] ?? false;
	}

	setFlag(key: ProfileResourceType, value: boolean): void {
		const flags = this.flags ? { ...this.flags } : {};
		if (value) {
			flags[key] = true;
		} else {
			delete flags[key];
		}
		this.flags = flags;
	}

	validate(): void {
		if (!this.name) {
			this.message = localize('name required', "Profile name is required and must be a non-empty value.");
			return;
		}
		if (this.shouldValidateName() && this.name !== this.getInitialName() && this.userDataProfilesService.profiles.some(p => p.name === this.name)) {
			this.message = localize('profileExists', "Profile with name {0} already exists.", this.name);
			return;
		}
		if (
			this.flags && this.flags.settings && this.flags.keybindings && this.flags.tasks && this.flags.snippets && this.flags.extensions
		) {
			this.message = localize('invalid configurations', "The profile should contain at least one configuration.");
			return;
		}
		this.message = undefined;
	}

	async getChildren(resourceType?: ProfileResourceType): Promise<IProfileChildElement[]> {
		if (resourceType === undefined) {
			const resourceTypes = [
				ProfileResourceType.Settings,
				ProfileResourceType.Keybindings,
				ProfileResourceType.Tasks,
				ProfileResourceType.Mcp,
				ProfileResourceType.Snippets,
				ProfileResourceType.Extensions
			];
			return Promise.all(resourceTypes.map<Promise<IProfileResourceTypeElement>>(async r => {
				const children = (r === ProfileResourceType.Settings
					|| r === ProfileResourceType.Keybindings
					|| r === ProfileResourceType.Tasks
					|| r === ProfileResourceType.Mcp) ? await this.getChildrenForResourceType(r) : [];
				return {
					handle: r,
					checkbox: undefined,
					resourceType: r,
					openAction: children.length
						? toAction({
							id: '_open',
							label: localize('open', "Open to the Side"),
							class: ThemeIcon.asClassName(Codicon.goToFile),
							run: () => children[0]?.openAction?.run()
						})
						: undefined
				};
			}));
		}
		return this.getChildrenForResourceType(resourceType);
	}

	protected async getChildrenForResourceType(resourceType: ProfileResourceType): Promise<IProfileChildElement[]> {
		return [];
	}

	protected async getChildrenFromProfile(profile: IUserDataProfile, resourceType: ProfileResourceType): Promise<IProfileResourceTypeChildElement[]> {
		profile = this.getFlag(resourceType) ? this.userDataProfilesService.defaultProfile : profile;
		let children: IProfileResourceChildTreeItem[] = [];
		switch (resourceType) {
			case ProfileResourceType.Settings:
				children = await this.instantiationService.createInstance(SettingsResourceTreeItem, profile).getChildren();
				break;
			case ProfileResourceType.Keybindings:
				children = await this.instantiationService.createInstance(KeybindingsResourceTreeItem, profile).getChildren();
				break;
			case ProfileResourceType.Snippets:
				children = (await this.instantiationService.createInstance(SnippetsResourceTreeItem, profile).getChildren()) ?? [];
				break;
			case ProfileResourceType.Tasks:
				children = await this.instantiationService.createInstance(TasksResourceTreeItem, profile).getChildren();
				break;
			case ProfileResourceType.Mcp:
				children = await this.instantiationService.createInstance(McpResourceTreeItem, profile).getChildren();
				break;
			case ProfileResourceType.Extensions:
				children = await this.instantiationService.createInstance(ExtensionsResourceExportTreeItem, profile).getChildren();
				break;
		}
		return children.map<IProfileResourceTypeChildElement>(child => this.toUserDataProfileResourceChildElement(child));
	}

	protected toUserDataProfileResourceChildElement(child: IProfileResourceChildTreeItem, primaryActions?: IAction[], contextMenuActions?: IAction[]): IProfileResourceTypeChildElement {
		return {
			handle: child.handle,
			checkbox: child.checkbox,
			label: child.label ? (isMarkdownString(child.label.label) ? child.label.label.value : child.label.label) : '',
			description: isString(child.description) ? child.description : undefined,
			resource: URI.revive(child.resourceUri),
			icon: child.themeIcon,
			openAction: toAction({
				id: '_openChild',
				label: localize('open', "Open to the Side"),
				class: ThemeIcon.asClassName(Codicon.goToFile),
				run: async () => {
					if (child.parent.type === ProfileResourceType.Extensions) {
						await this.commandService.executeCommand('extension.open', child.handle, undefined, true, undefined, true);
					} else if (child.resourceUri) {
						await this.commandService.executeCommand(API_OPEN_EDITOR_COMMAND_ID, child.resourceUri, [SIDE_GROUP], undefined);
					}
				}
			}),
			actions: {
				primary: primaryActions,
				contextMenu: contextMenuActions,
			}
		};

	}

	getInitialName(): string {
		return '';
	}

	shouldValidateName(): boolean {
		return true;
	}

	getCurrentWorkspace(): URI | undefined {
		const workspace = this.workspaceContextService.getWorkspace();
		return workspace.configuration ?? workspace.folders[0]?.uri;
	}

	openWorkspace(workspace: URI): void {
		if (this.uriIdentityService.extUri.extname(workspace) === WORKSPACE_SUFFIX) {
			this.hostService.openWindow([{ workspaceUri: workspace }], { forceNewWindow: true });
		} else {
			this.hostService.openWindow([{ folderUri: workspace }], { forceNewWindow: true });
		}
	}

	save(): void {
		this.saveScheduler.schedule();
	}

	private hasUnsavedChanges(profile: IUserDataProfile): boolean {
		if (this.name !== profile.name) {
			return true;
		}
		if (this.icon !== profile.icon) {
			return true;
		}
		if (!equals(this.flags ?? {}, profile.useDefaultFlags ?? {})) {
			return true;
		}
		if (!arrays.equals(this.workspaces ?? [], profile.workspaces ?? [], (a, b) => a.toString() === b.toString())) {
			return true;
		}
		return false;
	}

	protected async saveProfile(profile: IUserDataProfile): Promise<IUserDataProfile | undefined> {
		if (!this.hasUnsavedChanges(profile)) {
			return;
		}
		this.validate();
		if (this.message) {
			return;
		}
		const useDefaultFlags: UseDefaultProfileFlags | undefined = this.flags
			? this.flags.settings && this.flags.keybindings && this.flags.tasks && this.flags.globalState && this.flags.extensions ? undefined : this.flags
			: undefined;

		return await this.userDataProfileManagementService.updateProfile(profile, {
			name: this.name,
			icon: this.icon,
			useDefaultFlags: profile.useDefaultFlags && !useDefaultFlags ? {} : useDefaultFlags,
			workspaces: this.workspaces
		});
	}

	abstract readonly titleButtons: [Action[], Action[]];
	abstract readonly actions: [IAction[], IAction[]];

	protected abstract doSave(): Promise<void>;
	protected abstract getProfileToWatch(): IUserDataProfile | undefined;
}

export class UserDataProfileElement extends AbstractUserDataProfileElement {

	get profile(): IUserDataProfile { return this._profile; }

	constructor(
		private _profile: IUserDataProfile,
		readonly titleButtons: [Action[], Action[]],
		readonly actions: [IAction[], IAction[]],
		@IUserDataProfileService private readonly userDataProfileService: IUserDataProfileService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IUserDataProfileManagementService userDataProfileManagementService: IUserDataProfileManagementService,
		@IUserDataProfilesService userDataProfilesService: IUserDataProfilesService,
		@ICommandService commandService: ICommandService,
		@IWorkspaceContextService workspaceContextService: IWorkspaceContextService,
		@IHostService hostService: IHostService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
		@IFileService fileService: IFileService,
		@IWorkbenchExtensionManagementService extensionManagementService: IWorkbenchExtensionManagementService,
		@IInstantiationService instantiationService: IInstantiationService,
	) {
		super(
			_profile.name,
			_profile.icon,
			_profile.useDefaultFlags,
			_profile.workspaces,
			userDataProfileService.currentProfile.id === _profile.id,
			userDataProfileManagementService,
			userDataProfilesService,
			commandService,
			workspaceContextService,
			hostService,
			uriIdentityService,
			fileService,
			extensionManagementService,
			instantiationService,
		);
		this._isNewWindowProfile = this.configurationService.getValue(CONFIG_NEW_WINDOW_PROFILE) === this.profile.name;
		this._register(configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(CONFIG_NEW_WINDOW_PROFILE)) {
				this.isNewWindowProfile = this.configurationService.getValue(CONFIG_NEW_WINDOW_PROFILE) === this.profile.name;
			}
		}
		));
		this._register(this.userDataProfileService.onDidChangeCurrentProfile(() => this.active = this.userDataProfileService.currentProfile.id === this.profile.id));
		this._register(this.userDataProfilesService.onDidChangeProfiles(({ updated }) => {
			const profile = updated.find(p => p.id === this.profile.id);
			if (profile) {
				this._profile = profile;
				this.reset();
				this._onDidChange.fire({ profile: true });
			}
		}));
		this._register(fileService.watch(this.profile.snippetsHome));
		this._register(fileService.onDidFilesChange(e => {
			if (e.affects(this.profile.snippetsHome)) {
				this._onDidChange.fire({ snippets: true });
			}
		}));
	}

	protected getProfileToWatch(): IUserDataProfile | undefined {
		return this.profile;
	}

	reset(): void {
		this.name = this._profile.name;
		this.icon = this._profile.icon;
		this.flags = this._profile.useDefaultFlags;
		this.workspaces = this._profile.workspaces;
	}

	public updateWorkspaces(toAdd: URI[], toRemove: URI[]): void {
		const workspaces = new ResourceSet(this.workspaces ?? []);
		for (const workspace of toAdd) {
			workspaces.add(workspace);
		}
		for (const workspace of toRemove) {
			workspaces.delete(workspace);
		}
		this.workspaces = [...workspaces.values()];
	}

	public async toggleNewWindowProfile(): Promise<void> {
		if (this._isNewWindowProfile) {
			await this.configurationService.updateValue(CONFIG_NEW_WINDOW_PROFILE, null);
		} else {
			await this.configurationService.updateValue(CONFIG_NEW_WINDOW_PROFILE, this.profile.name);
		}
	}

	private _isNewWindowProfile: boolean = false;
	get isNewWindowProfile(): boolean { return this._isNewWindowProfile; }
	set isNewWindowProfile(isNewWindowProfile: boolean) {
		if (this._isNewWindowProfile !== isNewWindowProfile) {
			this._isNewWindowProfile = isNewWindowProfile;
			this._onDidChange.fire({ newWindowProfile: true });
		}
	}

	public async toggleCurrentWindowProfile(): Promise<void> {
		if (this.userDataProfileService.currentProfile.id === this.profile.id) {
			await this.userDataProfileManagementService.switchProfile(this.userDataProfilesService.defaultProfile);
		} else {
			await this.userDataProfileManagementService.switchProfile(this.profile);
		}
	}

	protected override async doSave(): Promise<void> {
		await this.saveProfile(this.profile);
	}

	protected override async getChildrenForResourceType(resourceType: ProfileResourceType): Promise<IProfileChildElement[]> {
		if (resourceType === ProfileResourceType.Extensions) {
			const children = await this.instantiationService.createInstance(ExtensionsResourceExportTreeItem, this.profile).getChildren();
			return children.map<IProfileResourceTypeChildElement>(child =>
				this.toUserDataProfileResourceChildElement(
					child,
					undefined,
					[{
						id: 'applyToAllProfiles',
						label: localize('applyToAllProfiles', "Apply Extension to all Profiles"),
						checked: child.applicationScoped,
						enabled: true,
						class: '',
						tooltip: '',
						run: async () => {
							const extensions = await this.extensionManagementService.getInstalled(undefined, this.profile.extensionsResource);
							const extension = extensions.find(e => areSameExtensions(e.identifier, child.identifier));
							if (extension) {
								await this.extensionManagementService.toggleApplicationScope(extension, this.profile.extensionsResource);
							}
						}
					}]
				));
		}
		return this.getChildrenFromProfile(this.profile, resourceType);
	}

	override getInitialName(): string {
		return this.profile.name;
	}

}

const USER_DATA_PROFILE_TEMPLATE_PREVIEW_SCHEME = 'userdataprofiletemplatepreview';

export class NewProfileElement extends AbstractUserDataProfileElement {

	private _copyFromTemplates = new ResourceMap<string>();
	get copyFromTemplates(): ResourceMap<string> { return this._copyFromTemplates; }

	private templatePromise: CancelablePromise<void> | undefined;
	private template: IUserDataProfileTemplate | null = null;

	private defaultName: string;
	private defaultIcon: string | undefined;

	constructor(
		copyFrom: URI | IUserDataProfile | undefined,
		readonly titleButtons: [Action[], Action[]],
		readonly actions: [IAction[], IAction[]],

		@IUserDataProfileImportExportService private readonly userDataProfileImportExportService: IUserDataProfileImportExportService,
		@IUserDataProfileManagementService userDataProfileManagementService: IUserDataProfileManagementService,
		@IUserDataProfilesService userDataProfilesService: IUserDataProfilesService,
		@ICommandService commandService: ICommandService,
		@IWorkspaceContextService workspaceContextService: IWorkspaceContextService,
		@IHostService hostService: IHostService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
		@IFileService fileService: IFileService,
		@IWorkbenchExtensionManagementService extensionManagementService: IWorkbenchExtensionManagementService,
		@IInstantiationService instantiationService: IInstantiationService,
	) {
		super(
			'',
			undefined,
			undefined,
			undefined,
			false,
			userDataProfileManagementService,
			userDataProfilesService,
			commandService,
			workspaceContextService,
			hostService,
			uriIdentityService,
			fileService,
			extensionManagementService,
			instantiationService,
		);
		this.name = this.defaultName = this.getNewProfileName();
		this._copyFrom = copyFrom;
		this._copyFlags = this.getCopyFlagsFrom(copyFrom);
		this.initialize();
		this._register(this.fileService.registerProvider(USER_DATA_PROFILE_TEMPLATE_PREVIEW_SCHEME, this._register(new InMemoryFileSystemProvider())));
		this._register(toDisposable(() => {
			if (this.previewProfile) {
				this.userDataProfilesService.removeProfile(this.previewProfile);
			}
		}));
	}

	private _copyFrom: IUserDataProfile | URI | undefined;
	get copyFrom(): IUserDataProfile | URI | undefined { return this._copyFrom; }
	set copyFrom(copyFrom: IUserDataProfile | URI | undefined) {
		if (this._copyFrom !== copyFrom) {
			this._copyFrom = copyFrom;
			this._onDidChange.fire({ copyFrom: true });
			this.flags = undefined;
			this.copyFlags = this.getCopyFlagsFrom(copyFrom);
			if (copyFrom instanceof URI) {
				this.templatePromise?.cancel();
				this.templatePromise = undefined;
			}
			this.initialize();
		}
	}

	private _copyFlags: ProfileResourceTypeFlags | undefined;
	get copyFlags(): ProfileResourceTypeFlags | undefined { return this._copyFlags; }
	set copyFlags(flags: ProfileResourceTypeFlags | undefined) {
		if (!equals(this._copyFlags, flags)) {
			this._copyFlags = flags;
			this._onDidChange.fire({ copyFlags: true });
		}
	}

	private readonly previewProfileWatchDisposables = this._register(new DisposableStore());
	private _previewProfile: IUserDataProfile | undefined;
	get previewProfile(): IUserDataProfile | undefined { return this._previewProfile; }
	set previewProfile(profile: IUserDataProfile | undefined) {
		if (this._previewProfile !== profile) {
			this._previewProfile = profile;
			this._onDidChange.fire({ preview: true });
			this.previewProfileWatchDisposables.clear();
			if (this._previewProfile) {
				this.previewProfileWatchDisposables.add(this.fileService.watch(this._previewProfile.snippetsHome));
				this.previewProfileWatchDisposables.add(this.fileService.onDidFilesChange(e => {
					if (!this._previewProfile) {
						return;
					}
					if (e.affects(this._previewProfile.snippetsHome)) {
						this._onDidChange.fire({ snippets: true });
					}
				}));
			}
		}
	}

	protected getProfileToWatch(): IUserDataProfile | undefined {
		return this.previewProfile;
	}

	private getCopyFlagsFrom(copyFrom: URI | IUserDataProfile | undefined): ProfileResourceTypeFlags | undefined {
		return copyFrom ? {
			settings: true,
			keybindings: true,
			snippets: true,
			tasks: true,
			extensions: true,
			mcp: true
		} : undefined;
	}

	private async initialize(): Promise<void> {
		this.disabled = true;
		try {
			if (this.copyFrom instanceof URI) {
				await this.resolveTemplate(this.copyFrom);
				if (this.template) {
					this.copyFromTemplates.set(this.copyFrom, this.template.name);
					if (this.defaultName === this.name) {
						this.name = this.defaultName = this.template.name ?? '';
					}
					if (this.defaultIcon === this.icon) {
						this.icon = this.defaultIcon = this.template.icon;
					}
					this.setCopyFlag(ProfileResourceType.Settings, !!this.template.settings);
					this.setCopyFlag(ProfileResourceType.Keybindings, !!this.template.keybindings);
					this.setCopyFlag(ProfileResourceType.Tasks, !!this.template.tasks);
					this.setCopyFlag(ProfileResourceType.Snippets, !!this.template.snippets);
					this.setCopyFlag(ProfileResourceType.Extensions, !!this.template.extensions);
					this.setCopyFlag(ProfileResourceType.Mcp, !!this.template.mcp);
					this._onDidChange.fire({ copyFromInfo: true });
				}
				return;
			}

			if (isUserDataProfile(this.copyFrom)) {
				if (this.defaultName === this.name) {
					this.name = this.defaultName = localize('copy from', "{0} (Copy)", this.copyFrom.name);
				}
				if (this.defaultIcon === this.icon) {
					this.icon = this.defaultIcon = this.copyFrom.icon;
				}
				this.setCopyFlag(ProfileResourceType.Settings, true);
				this.setCopyFlag(ProfileResourceType.Keybindings, true);
				this.setCopyFlag(ProfileResourceType.Tasks, true);
				this.setCopyFlag(ProfileResourceType.Snippets, true);
				this.setCopyFlag(ProfileResourceType.Extensions, true);
				this.setCopyFlag(ProfileResourceType.Mcp, true);
				this._onDidChange.fire({ copyFromInfo: true });
				return;
			}

			if (this.defaultName === this.name) {
				this.name = this.defaultName = this.getNewProfileName();
			}
			if (this.defaultIcon === this.icon) {
				this.icon = this.defaultIcon = undefined;
			}
			this.setCopyFlag(ProfileResourceType.Settings, false);
			this.setCopyFlag(ProfileResourceType.Keybindings, false);
			this.setCopyFlag(ProfileResourceType.Tasks, false);
			this.setCopyFlag(ProfileResourceType.Snippets, false);
			this.setCopyFlag(ProfileResourceType.Extensions, false);
			this.setCopyFlag(ProfileResourceType.Mcp, false);
			this._onDidChange.fire({ copyFromInfo: true });
		} finally {
			this.disabled = false;
		}
	}

	private getNewProfileName(): string {
		const name = localize('untitled', "Untitled");
		const nameRegEx = new RegExp(`${name}\\s(\\d+)`);
		let nameIndex = 0;
		for (const profile of this.userDataProfilesService.profiles) {
			const matches = nameRegEx.exec(profile.name);
			const index = matches ? parseInt(matches[1]) : 0;
			nameIndex = index > nameIndex ? index : nameIndex;
		}
		return `${name} ${nameIndex + 1}`;
	}

	async resolveTemplate(uri: URI): Promise<IUserDataProfileTemplate | null> {
		if (!this.templatePromise) {
			this.templatePromise = createCancelablePromise(async token => {
				const template = await this.userDataProfileImportExportService.resolveProfileTemplate(uri);
				if (!token.isCancellationRequested) {
					this.template = template;
				}
			});
		}
		await this.templatePromise;
		return this.template;
	}

	hasResource(resourceType: ProfileResourceType): boolean {
		if (this.template) {
			switch (resourceType) {
				case ProfileResourceType.Settings:
					return !!this.template.settings;
				case ProfileResourceType.Keybindings:
					return !!this.template.keybindings;
				case ProfileResourceType.Snippets:
					return !!this.template.snippets;
				case ProfileResourceType.Tasks:
					return !!this.template.tasks;
				case ProfileResourceType.Extensions:
					return !!this.template.extensions;
			}
		}
		return true;
	}

	getCopyFlag(key: ProfileResourceType): boolean {
		return this.copyFlags?.[key] ?? false;
	}

	setCopyFlag(key: ProfileResourceType, value: boolean): void {
		const flags = this.copyFlags ? { ...this.copyFlags } : {};
		flags[key] = value;
		this.copyFlags = flags;
	}

	getCopyFromName(): string | undefined {
		if (isUserDataProfile(this.copyFrom)) {
			return this.copyFrom.name;
		}
		if (this.copyFrom instanceof URI) {
			return this.copyFromTemplates.get(this.copyFrom);
		}
		return undefined;
	}

	protected override async getChildrenForResourceType(resourceType: ProfileResourceType): Promise<IProfileChildElement[]> {
		if (this.getFlag(resourceType)) {
			return this.getChildrenFromProfile(this.userDataProfilesService.defaultProfile, resourceType);
		}
		if (!this.getCopyFlag(resourceType)) {
			return [];
		}
		if (this.previewProfile) {
			return this.getChildrenFromProfile(this.previewProfile, resourceType);
		}
		if (this.copyFrom instanceof URI) {
			await this.resolveTemplate(this.copyFrom);
			if (!this.template) {
				return [];
			}
			return this.getChildrenFromProfileTemplate(this.template, resourceType);
		}
		if (this.copyFrom) {
			return this.getChildrenFromProfile(this.copyFrom, resourceType);
		}
		return [];
	}

	private async getChildrenFromProfileTemplate(profileTemplate: IUserDataProfileTemplate, resourceType: ProfileResourceType): Promise<IProfileResourceTypeChildElement[]> {
		const location = URI.from({ scheme: USER_DATA_PROFILE_TEMPLATE_PREVIEW_SCHEME, path: `/root/profiles/${profileTemplate.name}` });
		const cacheLocation = URI.from({ scheme: USER_DATA_PROFILE_TEMPLATE_PREVIEW_SCHEME, path: `/root/cache/${profileTemplate.name}` });
		const profile = toUserDataProfile(generateUuid(), this.name, location, cacheLocation);
		switch (resourceType) {
			case ProfileResourceType.Settings:
				if (profileTemplate.settings) {
					await this.instantiationService.createInstance(SettingsResource).apply(profileTemplate.settings, profile);
					return this.getChildrenFromProfile(profile, resourceType);
				}
				return [];
			case ProfileResourceType.Keybindings:
				if (profileTemplate.keybindings) {
					await this.instantiationService.createInstance(KeybindingsResource).apply(profileTemplate.keybindings, profile);
					return this.getChildrenFromProfile(profile, resourceType);
				}
				return [];
			case ProfileResourceType.Snippets:
				if (profileTemplate.snippets) {
					await this.instantiationService.createInstance(SnippetsResource).apply(profileTemplate.snippets, profile);
					return this.getChildrenFromProfile(profile, resourceType);
				}
				return [];
			case ProfileResourceType.Tasks:
				if (profileTemplate.tasks) {
					await this.instantiationService.createInstance(TasksResource).apply(profileTemplate.tasks, profile);
					return this.getChildrenFromProfile(profile, resourceType);
				}
				return [];
			case ProfileResourceType.Mcp:
				if (profileTemplate.mcp) {
					await this.instantiationService.createInstance(McpProfileResource).apply(profileTemplate.mcp, profile);
					return this.getChildrenFromProfile(profile, resourceType);
				}
				return [];
			case ProfileResourceType.Extensions:
				if (profileTemplate.extensions) {
					const children = await this.instantiationService.createInstance(ExtensionsResourceImportTreeItem, profileTemplate.extensions).getChildren();
					return children.map(child => this.toUserDataProfileResourceChildElement(child));
				}
				return [];
		}
		return [];
	}

	override shouldValidateName(): boolean {
		return !this.copyFrom;
	}

	override getInitialName(): string {
		return this.previewProfile?.name ?? '';
	}

	protected override async doSave(): Promise<void> {
		if (this.previewProfile) {
			const profile = await this.saveProfile(this.previewProfile);
			if (profile) {
				this.previewProfile = profile;
			}
		}
	}
}

export class UserDataProfilesEditorModel extends EditorModel {

	private static INSTANCE: UserDataProfilesEditorModel | undefined;
	static getInstance(instantiationService: IInstantiationService): UserDataProfilesEditorModel {
		if (!UserDataProfilesEditorModel.INSTANCE) {
			UserDataProfilesEditorModel.INSTANCE = instantiationService.createInstance(UserDataProfilesEditorModel);
		}
		return UserDataProfilesEditorModel.INSTANCE;
	}

	private _profiles: [AbstractUserDataProfileElement, DisposableStore][] = [];
	get profiles(): AbstractUserDataProfileElement[] {
		return this._profiles
			.map(([profile]) => profile)
			.sort((a, b) => {
				if (a instanceof NewProfileElement) {
					return 1;
				}
				if (b instanceof NewProfileElement) {
					return -1;
				}
				if (a instanceof UserDataProfileElement && a.profile.isDefault) {
					return -1;
				}
				if (b instanceof UserDataProfileElement && b.profile.isDefault) {
					return 1;
				}
				return a.name.localeCompare(b.name);
			});
	}

	private newProfileElement: NewProfileElement | undefined;

	private _onDidChange = this._register(new Emitter<AbstractUserDataProfileElement | undefined>());
	readonly onDidChange = this._onDidChange.event;

	private templates: Promise<readonly IProfileTemplateInfo[]> | undefined;

	constructor(
		@IUserDataProfileService private readonly userDataProfileService: IUserDataProfileService,
		@IUserDataProfilesService private readonly userDataProfilesService: IUserDataProfilesService,
		@IUserDataProfileManagementService private readonly userDataProfileManagementService: IUserDataProfileManagementService,
		@IUserDataProfileImportExportService private readonly userDataProfileImportExportService: IUserDataProfileImportExportService,
		@IDialogService private readonly dialogService: IDialogService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IHostService private readonly hostService: IHostService,
		@IProductService private readonly productService: IProductService,
		@IOpenerService private readonly openerService: IOpenerService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		super();
		for (const profile of userDataProfilesService.profiles) {
			if (!profile.isTransient) {
				this._profiles.push(this.createProfileElement(profile));
			}
		}
		this._register(toDisposable(() => this._profiles.splice(0, this._profiles.length).map(([, disposables]) => disposables.dispose())));
		this._register(userDataProfilesService.onDidChangeProfiles(e => this.onDidChangeProfiles(e)));
	}

	private onDidChangeProfiles(e: DidChangeProfilesEvent): void {
		let changed = false;
		for (const profile of e.added) {
			if (!profile.isTransient && profile.name !== this.newProfileElement?.name) {
				changed = true;
				this._profiles.push(this.createProfileElement(profile));
			}
		}
		for (const profile of e.removed) {
			if (profile.id === this.newProfileElement?.previewProfile?.id) {
				this.newProfileElement.previewProfile = undefined;
			}
			const index = this._profiles.findIndex(([p]) => p instanceof UserDataProfileElement && p.profile.id === profile.id);
			if (index !== -1) {
				changed = true;
				this._profiles.splice(index, 1).map(([, disposables]) => disposables.dispose());
			}
		}
		if (changed) {
			this._onDidChange.fire(undefined);
		}
	}

	getTemplates(): Promise<readonly IProfileTemplateInfo[]> {
		if (!this.templates) {
			this.templates = this.userDataProfileManagementService.getBuiltinProfileTemplates();
		}
		return this.templates;
	}

	private createProfileElement(profile: IUserDataProfile): [UserDataProfileElement, DisposableStore] {
		const disposables = new DisposableStore();

		const activateAction = disposables.add(new Action(
			'userDataProfile.activate',
			localize('active', "Use this Profile for Current Window"),
			ThemeIcon.asClassName(Codicon.check),
			true,
			() => this.userDataProfileManagementService.switchProfile(profileElement.profile)
		));

		const copyFromProfileAction = disposables.add(new Action(
			'userDataProfile.copyFromProfile',
			localize('copyFromProfile', "Duplicate..."),
			ThemeIcon.asClassName(Codicon.copy),
			true, () => this.createNewProfile(profileElement.profile)
		));

		const exportAction = disposables.add(new Action(
			'userDataProfile.export',
			localize('export', "Export..."),
			ThemeIcon.asClassName(Codicon.export),
			true,
			() => this.userDataProfileImportExportService.exportProfile(profile)
		));

		const deleteAction = disposables.add(new Action(
			'userDataProfile.delete',
			localize('delete', "Delete"),
			ThemeIcon.asClassName(Codicon.trash),
			true,
			() => this.removeProfile(profileElement.profile)
		));

		const newWindowAction = disposables.add(new Action(
			'userDataProfile.newWindow',
			localize('open new window', "Open New Window with this Profile"),
			ThemeIcon.asClassName(Codicon.emptyWindow),
			true,
			() => this.openWindow(profileElement.profile)
		));

		const primaryActions: IAction[] = [];
		primaryActions.push(activateAction);
		primaryActions.push(newWindowAction);
		const secondaryActions: IAction[] = [];
		secondaryActions.push(copyFromProfileAction);
		secondaryActions.push(exportAction);
		if (!profile.isDefault) {
			secondaryActions.push(new Separator());
			secondaryActions.push(deleteAction);
		}

		const profileElement = disposables.add(this.instantiationService.createInstance(UserDataProfileElement,
			profile,
			[[], []],
			[primaryActions, secondaryActions]
		));

		activateAction.enabled = this.userDataProfileService.currentProfile.id !== profileElement.profile.id;
		disposables.add(this.userDataProfileService.onDidChangeCurrentProfile(() =>
			activateAction.enabled = this.userDataProfileService.currentProfile.id !== profileElement.profile.id));

		return [profileElement, disposables];
	}

	async createNewProfile(copyFrom?: URI | IUserDataProfile): Promise<AbstractUserDataProfileElement | undefined> {
		if (this.newProfileElement) {
			const result = await this.dialogService.confirm({
				type: 'info',
				message: localize('new profile exists', "A new profile is already being created. Do you want to discard it and create a new one?"),
				primaryButton: localize('discard', "Discard & Create"),
				cancelButton: localize('cancel', "Cancel")
			});
			if (!result.confirmed) {
				return;
			}
			this.revert();
		}

		if (copyFrom instanceof URI) {
			try {
				await this.userDataProfileImportExportService.resolveProfileTemplate(copyFrom);
			} catch (error) {
				this.dialogService.error(getErrorMessage(error));
				return;
			}
		}

		if (!this.newProfileElement) {
			const disposables = new DisposableStore();
			const cancellationTokenSource = new CancellationTokenSource();
			disposables.add(toDisposable(() => cancellationTokenSource.dispose(true)));
			const primaryActions: Action[] = [];
			const secondaryActions: Action[] = [];
			const createAction = disposables.add(new Action(
				'userDataProfile.create',
				localize('create', "Create"),
				undefined,
				true,
				() => this.saveNewProfile(false, cancellationTokenSource.token)
			));
			primaryActions.push(createAction);
			if (isWeb && copyFrom instanceof URI && isProfileURL(copyFrom)) {
				primaryActions.push(disposables.add(new Action(
					'userDataProfile.createInDesktop',
					localize('import in desktop', "Create in {0}", this.productService.nameLong),
					undefined,
					true,
					() => this.openerService.open(copyFrom, { openExternal: true })
				)));
			}
			const cancelAction = disposables.add(new Action(
				'userDataProfile.cancel',
				localize('cancel', "Cancel"),
				ThemeIcon.asClassName(Codicon.trash),
				true,
				() => this.discardNewProfile()
			));
			secondaryActions.push(cancelAction);
			const previewProfileAction = disposables.add(new Action(
				'userDataProfile.preview',
				localize('preview', "Preview"),
				ThemeIcon.asClassName(Codicon.openPreview),
				true,
				() => this.previewNewProfile(cancellationTokenSource.token)
			));
			secondaryActions.push(previewProfileAction);
			const exportAction = disposables.add(new Action(
				'userDataProfile.export',
				localize('export', "Export..."),
				ThemeIcon.asClassName(Codicon.export),
				isUserDataProfile(copyFrom),
				() => this.exportNewProfile(cancellationTokenSource.token)
			));
			this.newProfileElement = disposables.add(this.instantiationService.createInstance(NewProfileElement,
				copyFrom,
				[primaryActions, secondaryActions],
				[[cancelAction], [exportAction]],
			));
			const updateCreateActionLabel = () => {
				if (createAction.enabled) {
					if (this.newProfileElement?.copyFrom && this.userDataProfilesService.profiles.some(p => !p.isTransient && p.name === this.newProfileElement?.name)) {
						createAction.label = localize('replace', "Replace");
					} else {
						createAction.label = localize('create', "Create");
					}
				}
			};
			updateCreateActionLabel();
			disposables.add(this.newProfileElement.onDidChange(e => {
				if (e.preview || e.disabled || e.message) {
					createAction.enabled = !this.newProfileElement?.disabled && !this.newProfileElement?.message;
					previewProfileAction.enabled = !this.newProfileElement?.previewProfile && !this.newProfileElement?.disabled && !this.newProfileElement?.message;
				}
				if (e.name || e.copyFrom) {
					updateCreateActionLabel();
					exportAction.enabled = isUserDataProfile(this.newProfileElement?.copyFrom);
				}
			}));
			disposables.add(this.userDataProfilesService.onDidChangeProfiles((e) => {
				updateCreateActionLabel();
				this.newProfileElement?.validate();
			}));
			this._profiles.push([this.newProfileElement, disposables]);
			this._onDidChange.fire(this.newProfileElement);
		}
		return this.newProfileElement;
	}

	revert(): void {
		this.removeNewProfile();
		this._onDidChange.fire(undefined);
	}

	private removeNewProfile(): void {
		if (this.newProfileElement) {
			const index = this._profiles.findIndex(([p]) => p === this.newProfileElement);
			if (index !== -1) {
				this._profiles.splice(index, 1).map(([, disposables]) => disposables.dispose());
			}
			this.newProfileElement = undefined;
		}
	}

	private async previewNewProfile(token: CancellationToken): Promise<void> {
		if (!this.newProfileElement) {
			return;
		}
		if (this.newProfileElement.previewProfile) {
			return;
		}
		const profile = await this.saveNewProfile(true, token);
		if (profile) {
			this.newProfileElement.previewProfile = profile;
			if (isWeb) {
				await this.userDataProfileManagementService.switchProfile(profile);
			} else {
				await this.openWindow(profile);
			}
		}
	}

	private async exportNewProfile(token: CancellationToken): Promise<void> {
		if (!this.newProfileElement) {
			return;
		}
		if (!isUserDataProfile(this.newProfileElement.copyFrom)) {
			return;
		}
		const profile = toUserDataProfile(
			generateUuid(),
			this.newProfileElement.name,
			this.newProfileElement.copyFrom.location,
			this.newProfileElement.copyFrom.cacheHome,
			{
				icon: this.newProfileElement.icon,
				useDefaultFlags: this.newProfileElement.flags,
			},
			this.userDataProfilesService.defaultProfile
		);
		await this.userDataProfileImportExportService.exportProfile(profile, this.newProfileElement.copyFlags);
	}

	async saveNewProfile(transient?: boolean, token?: CancellationToken): Promise<IUserDataProfile | undefined> {
		if (!this.newProfileElement) {
			return undefined;
		}

		this.newProfileElement.validate();
		if (this.newProfileElement.message) {
			return undefined;
		}

		this.newProfileElement.disabled = true;
		let profile: IUserDataProfile | undefined;

		try {
			if (this.newProfileElement.previewProfile) {
				if (!transient) {
					profile = await this.userDataProfileManagementService.updateProfile(this.newProfileElement.previewProfile, { transient: false });
				}
			}
			else {
				const { flags, icon, name, copyFrom } = this.newProfileElement;
				const useDefaultFlags: UseDefaultProfileFlags | undefined = flags
					? flags.settings && flags.keybindings && flags.tasks && flags.globalState && flags.extensions ? undefined : flags
					: undefined;

				type CreateProfileInfoClassification = {
					owner: 'sandy081';
					comment: 'Report when profile is about to be created';
					source: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Type of profile source' };
				};
				type CreateProfileInfoEvent = {
					source: string | undefined;
				};
				const createProfileTelemetryData: CreateProfileInfoEvent = { source: copyFrom instanceof URI ? 'template' : isUserDataProfile(copyFrom) ? 'profile' : copyFrom ? 'external' : undefined };

				if (copyFrom instanceof URI) {
					const template = await this.newProfileElement.resolveTemplate(copyFrom);
					if (template) {
						this.telemetryService.publicLog2<CreateProfileInfoEvent, CreateProfileInfoClassification>('userDataProfile.createFromTemplate', createProfileTelemetryData);
						profile = await this.userDataProfileImportExportService.createProfileFromTemplate(
							template,
							{
								name,
								useDefaultFlags,
								icon,
								resourceTypeFlags: this.newProfileElement.copyFlags,
								transient
							},
							token ?? CancellationToken.None
						);
					}
				} else if (isUserDataProfile(copyFrom)) {
					profile = await this.userDataProfileImportExportService.createFromProfile(
						copyFrom,
						{
							name,
							useDefaultFlags,
							icon: icon,
							resourceTypeFlags: this.newProfileElement.copyFlags,
							transient
						},
						token ?? CancellationToken.None
					);
				} else {
					profile = await this.userDataProfileManagementService.createProfile(name, { useDefaultFlags, icon, transient });
				}
			}
		} finally {
			if (this.newProfileElement) {
				this.newProfileElement.disabled = false;
			}
		}

		if (token?.isCancellationRequested) {
			if (profile) {
				try {
					await this.userDataProfileManagementService.removeProfile(profile);
				} catch (error) {
					// ignore
				}
			}
			return;
		}

		if (profile && !profile.isTransient && this.newProfileElement) {
			this.removeNewProfile();
			const existing = this._profiles.find(([p]) => p.name === profile.name);
			if (existing) {
				this._onDidChange.fire(existing[0]);
			} else {
				this.onDidChangeProfiles({ added: [profile], removed: [], updated: [], all: this.userDataProfilesService.profiles });
			}
		}

		return profile;
	}

	private async discardNewProfile(): Promise<void> {
		if (!this.newProfileElement) {
			return;
		}
		if (this.newProfileElement.previewProfile) {
			await this.userDataProfileManagementService.removeProfile(this.newProfileElement.previewProfile);
			return;
		}
		this.removeNewProfile();
		this._onDidChange.fire(undefined);
	}

	private async removeProfile(profile: IUserDataProfile): Promise<void> {
		const result = await this.dialogService.confirm({
			type: 'info',
			message: localize('deleteProfile', "Are you sure you want to delete the profile '{0}'?", profile.name),
			primaryButton: localize('delete', "Delete"),
			cancelButton: localize('cancel', "Cancel")
		});
		if (result.confirmed) {
			await this.userDataProfileManagementService.removeProfile(profile);
		}
	}

	private async openWindow(profile: IUserDataProfile): Promise<void> {
		await this.hostService.openWindow({ forceProfile: profile.name });
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/userDataProfile/browser/media/userDataProfilesEditor.css]---
Location: vscode-main/src/vs/workbench/contrib/userDataProfile/browser/media/userDataProfilesEditor.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.profiles-editor {
	height: 100%;
	overflow: hidden;
	max-width: 1200px;
	margin: 20px auto 0px auto;
}

.profiles-editor .sidebar-view,
.profiles-editor .contents-view {
	height: 100%;
}

.profiles-editor > .monaco-split-view2 > .sash-container,
.profiles-editor > .monaco-split-view2.separator-border.horizontal > .monaco-scrollable-element > .split-view-container > .split-view-view:not(:first-child)::before {
	top: 55px;
}

.profiles-editor .contents-container {
	height: 100%;
}

.profiles-editor .sidebar-container {
	padding-left: 20px;
	height: 100%;
}

.profiles-editor .sidebar-container .new-profile-button {
	padding: 0px 20px 0px 18px;
	display: flex;
	align-items: center;
	height: 40px;
}

.profiles-editor .sidebar-container .new-profile-button > .monaco-button-dropdown {
	flex-grow: 1;
}

.profiles-editor .monaco-button-dropdown > .monaco-dropdown-button {
	display: flex;
	align-items: center;
	padding: 0 4px;
}

.profiles-editor .monaco-list-row .profile-tree-item-actions-container {
	display: none;
	align-items: center;
}

.profiles-editor .monaco-list-row.focused .profile-tree-item-actions-container,
.profiles-editor .monaco-list-row.selected .profile-tree-item-actions-container,
.profiles-editor .monaco-list-row:hover .profile-tree-item-actions-container {
	display: flex;
}

.profiles-editor .sidebar-container .profiles-list {
	margin-top: 15px;
}

.profiles-editor .sidebar-container .profiles-list .profile-list-item {
	padding-left: 20px;
	display: flex;
	align-items: center;
}

.profiles-editor .sidebar-container .profiles-list .profile-list-item > * {
	margin-right: 5px;
}

.profiles-editor .sidebar-container .profiles-list .profile-list-item > .profile-list-item-label {
	overflow: hidden;
	text-overflow: ellipsis;
}

.profiles-editor .sidebar-container .profiles-list .profile-list-item > .profile-list-item-label.new-profile {
	font-style: italic;
}

.profiles-editor .sidebar-container .profiles-list .profile-list-item > .profile-list-item-description {
	margin-left: 2px;
	display: flex;
	align-items: center;
	font-size: 0.9em;
	opacity: 0.7;
}

.profiles-editor .sidebar-container .profiles-list .profile-list-item .profile-tree-item-actions-container {
	flex: 1;
	justify-content: flex-end;
	margin-right: 10px;
}

.profiles-editor .hide {
	display: none !important;
}

.profiles-editor .contents-container .profile-header {
	margin-left: 27px;
	display: flex;
	height: 40px;
	align-items: center;
}

.profiles-editor .contents-container .profile-header .profile-title-container {
	font-size: 26px;
	font-weight: 600;
}

.profiles-editor .contents-container .profile-title-container .monaco-inputbox {
	margin-right: 10px;
	flex: 1;
}

.profiles-editor .contents-container .profile-header .profile-actions-container .actions-container .action-label {
	padding: 6px;
}

.profiles-editor .contents-container .profile-body {
	margin: 15px 0px 0px 1px
}

.profiles-editor .contents-container .profile-body .profile-row-container {
	padding: 12px 0px;
}

.profiles-editor .contents-container .profile-body .profile-row-container.no-padding-bottom {
	padding-bottom: 0px;
}

.profiles-editor .contents-container .profile-body .profile-row-container .profile-label-element {
	font-weight: 600;
	padding-bottom: 5px;
}

.profiles-editor .contents-container .profile-body .profile-row-container .profile-description-element {
	color: var(--vscode-foreground);
	opacity: 0.9;
}

.profiles-editor .contents-container .profile-body .profile-row-container .profile-description-element ul,
.profiles-editor .contents-container .profile-body .profile-row-container .profile-description-element p {
	margin: 0px;
}

.profiles-editor .contents-container .profile-body .profile-row-container .profile-description-element ul {
	padding-inline-start: 28px;
}

.profiles-editor .contents-container .profile-body .profile-row-container .profile-description-element ul li {
	padding-left: 2px;
}

.profiles-editor .contents-container .profile-body .profile-row-container .monaco-inputbox {
	width: 400px;
}

.profiles-editor .contents-container .profile-body .profile-row-container .profile-icon-container {
	line-height: 22px;
	display: flex;
	align-items: center;
}

.profiles-editor .contents-container .profile-body .profile-row-container .profile-icon-container.disabled .codicon {
	cursor: default;
}

.profiles-editor .contents-container .profile-body .profile-row-container .profile-icon-container .codicon {
	cursor: pointer;
	margin-right: 4px;
	padding: 2px;
	border-radius: 5px;
}

.profiles-editor .contents-container .profile-body .profile-row-container .profile-icon-container:not(.disabled) .codicon:hover {
	background-color: var(--vscode-toolbar-hoverBackground);
	outline: 1px dashed var(--vscode-toolbar-hoverOutline);
}

.profiles-editor .contents-container .profile-body .profile-row-container .profile-icon-container .profile-description-element {
	margin-top: -1px;
}

.profiles-editor .contents-container .profile-select-container {
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;
}

.profiles-editor .contents-container .profile-select-container > .monaco-select-box {
	cursor: pointer;
	line-height: 18px;
	padding: 0px 23px 0px 8px;
	border-radius: 2px;
}

.profiles-editor .contents-container .profile-copy-from-container .profile-select-container {
	margin-top: 5px;
	width: 250px;
}

.profiles-editor .contents-container .profile-use-as-default-container,
.profiles-editor .contents-container .profile-use-for-current-container {
	display: flex;
	align-items: center;
	line-height: 22px;
}

.profiles-editor .contents-container .profile-body .profile-row-container .profile-use-as-default-container .profile-description-element,
.profiles-editor .contents-container .profile-body .profile-row-container .profile-use-for-current-container .profile-description-element {
	margin-top: -1px;
}

.profiles-editor .contents-container .profile-use-as-default-container .profile-use-as-default-label,
.profiles-editor .contents-container .profile-use-for-current-container .profile-use-as-default-label {
	margin-left: 2px;
}

.profiles-editor .contents-container .profile-contents-container {
	margin: 0px 0px 10px 20px;
}

.profiles-editor .contents-container .profile-content-tree-header {
	display: grid;
	grid-template-columns: 30px repeat(2, 1fr) 80px;
	line-height: 22px;
	height: 30px;
	align-items: center;
	margin: 5px 0px 2px 0px;
	font-weight: bold;
	border-bottom: 1px solid transparent;
}

.profiles-editor .profile-associations-table .monaco-table-th,
.profiles-editor .contents-container .profile-content-tree-header {
	background-color: var(--vscode-keybindingTable-headerBackground);
}

.profiles-editor .contents-container .profile-content-tree-header > .options-header {
	display: flex;
	align-items: center;
}

.profiles-editor .contents-container .profile-content-tree-header > .options-header .codicon {
	cursor: pointer;
	padding-left: 2px;
}

.profiles-editor .contents-container .profile-content-tree-header.default-profile {
	grid-template-columns: 30px repeat(1, 1fr) 80px;
}

.profiles-editor .contents-container .profile-content-tree-header.default-profile > .options-header {
	display: none;
}

.profiles-editor .contents-container .profile-tree-item-container {
	display: grid;
	align-items: center;
	grid-template-columns: repeat(2, 1fr) 80px;
}

.profiles-editor .contents-container .profile-body .profile-tree .monaco-list-row .profile-content-tree-header,
.profiles-editor .contents-container .profile-body .profile-tree .monaco-list-row .profile-content-tree {
	margin-right: 1px;
}

.profiles-editor .contents-container .profile-tree-item-container.default-profile,
.profiles-editor .contents-container .profile-tree-item-container.profile-resource-child-container {
	grid-template-columns: repeat(1, 1fr) 80px;
}

.profiles-editor .contents-container .profile-tree-item-container .profile-resource-type-description {
	margin-left: 10px;
	font-size: 0.9em;
	opacity: 0.7;
}

.profiles-editor .contents-container .profile-tree-item-container .profile-resource-options-container {
	height: fit-content;
	width: fit-content;
}

.profiles-editor .contents-container .profile-tree-item-container .monaco-custom-radio .monaco-button {
	outline-offset: -1px !important;
}

.profiles-editor .contents-container .profile-tree-item-container .profile-resource-actions-container {
	display: none;
	justify-self: end;
	padding-right: 10px;
}

.profiles-editor .contents-container .profile-content-tree .monaco-list-row.selected .profile-resource-actions-container,
.profiles-editor .contents-container .profile-content-tree .monaco-list-row.focused .profile-resource-actions-container,
.profiles-editor .contents-container .profile-content-tree .monaco-list-row:hover .profile-resource-actions-container {
	display: flex;
}

.profiles-editor .contents-container .profile-body .profile-row-container.profile-button-container {
	margin-top: 10px;
	margin-left: 30px;
	display: flex;
	align-items: center;
}

.profiles-editor .contents-container .profile-body .profile-row-container.profile-button-container .monaco-button {
	margin-right: 10px;
	width: inherit;
	padding: 4px 10px;
}

.profiles-editor .profile-associations-table {
	margin-top: 5px;
}

.profiles-editor .profile-associations-table .monaco-table-th,
.profiles-editor .profile-associations-table .monaco-table-td {
	padding: 0px 5px;
}

.profiles-editor .profile-associations-table .monaco-table-td {
	display: flex;
	align-items: center;
	overflow: hidden;
}

.profiles-editor .profile-associations-table .monaco-list-row .monaco-table-tr .monaco-table-td .profile-workspaces-actions-container {
	display: none;
	justify-content: flex-end;
	padding-right: 5px;
}

.profiles-editor .profile-associations-table .monaco-list-row.selected .monaco-table-tr .monaco-table-td .profile-workspaces-actions-container,
.profiles-editor .profile-associations-table .monaco-list-row.focused .monaco-table-tr .monaco-table-td .profile-workspaces-actions-container,
.profiles-editor .profile-associations-table .monaco-list-row:hover .monaco-table-tr .monaco-table-td .profile-workspaces-actions-container {
	display: flex;
}

.profiles-editor .profile-associations-table .monaco-table-tr .monaco-table-td .host,
.profiles-editor .profile-associations-table .monaco-table-tr .monaco-table-td .path {
	width: 100%;
}

.profiles-editor .profile-associations-table .monaco-table-tr .monaco-table-td .host .host-label,
.profiles-editor .profile-associations-table .monaco-table-tr .monaco-table-td .path .path-label {
	overflow: hidden;
	text-overflow: ellipsis;
}

.profiles-editor .profile-associations-table .monaco-table-tr .monaco-table-td .current-workspace .path-label,
.profiles-editor .profile-associations-table .monaco-table-tr .monaco-table-td .current-workspace .host-label {
	font-weight: bold;
	font-style: italic;
}

.profiles-editor .contents-container .profile-body .profile-row-container .profile-workspaces-button-container {
	display: flex;
	margin: 8px 4px;
}

.profiles-editor .contents-container .profile-body .profile-row-container .profile-workspaces-button-container .monaco-button {
	width: inherit;
	padding: 2px 14px;
}

/* Profile Editor Tree Theming */

.profiles-editor .contents-container .profile-body .profile-tree .monaco-list-row.focused {
	background-color: var(--vscode-settings-focusedRowBackground) !important;
}

.profiles-editor .contents-container .profile-body .profile-tree .monaco-list-row .profile-associations-table .monaco-list-row[data-parity=odd] .monaco-table-tr {
	background-color: transparent !important;
}

.profiles-editor .contents-container .profile-body .profile-tree .monaco-list-row:not(.focused):hover {
	background-color: var(--vscode-settings-rowHoverBackground) !important;
}

.profiles-editor .contents-container .profile-body .profile-tree .monaco-list:focus .monaco-list-row.focused {
	outline: 1px solid var(--vscode-settings-focusedRowBorder) !important;
}

.profiles-editor .contents-container .profile-body .profile-tree .monaco-list-row {
	cursor: default;
}

.profiles-editor .contents-container .profile-body .profile-tree .monaco-list-row .profile-associations-table .monaco-list-row,
.profiles-editor .contents-container .profile-body .profile-tree .monaco-list-row .profile-content-tree .monaco-list-row {
	cursor: default;
}

.profiles-editor .contents-container .profile-body .profile-tree .monaco-list-row .profile-associations-table .monaco-list-row.focused,
.profiles-editor .contents-container .profile-body .profile-tree .monaco-list-row .profile-associations-table .monaco-list-row.selected:not(:focus),
.profiles-editor .contents-container .profile-body .profile-tree .monaco-list-row .profile-associations-table .monaco-list-row.selected:focus,
.profiles-editor .contents-container .profile-body .profile-tree .monaco-list-row .profile-content-tree .monaco-list-row.focused,
.profiles-editor .contents-container .profile-body .profile-tree .monaco-list-row .profile-content-tree .monaco-list-row.selected:not(:focus),
.profiles-editor .contents-container .profile-body .profile-tree .monaco-list-row .profile-content-tree .monaco-list-row.selected:focus {
	background-color: inherit !important;
	color: inherit !important;
}

.monaco-workbench:not(.hc-black):not(.hc-light) .profiles-editor .contents-container .profile-body .profile-tree .monaco-list-row .profile-associations-table .monaco-list-row:hover:not(.selected),
.monaco-workbench:not(.hc-black):not(.hc-light) .profiles-editor .contents-container .profile-body .profile-tree .monaco-list-row .profile-content-tree .monaco-list-row:hover:not(.selected) {
	background-color: var(--vscode-list-hoverBackground) !important;
}

.profiles-editor .contents-container .profile-body .profile-tree .monaco-list-row .profile-associations-table .monaco-list-row.selected:focus,
.profiles-editor .contents-container .profile-body .profile-tree .monaco-list-row .profile-content-tree .monaco-list-row.selected:focus {
	background-color: var(--vscode-list-activeSelectionBackground) !important;
	color: var(--vscode-list-activeSelectionForeground) !important;
}

.profiles-editor .contents-container .profile-body .profile-tree .monaco-list-row .profile-associations-table .monaco-list-row.selected:not(:focus),
.profiles-editor .contents-container .profile-body .profile-tree .monaco-list-row .profile-content-tree .monaco-list-row.selected:not(:focus) {
	background-color: var(--vscode-list-inactiveSelectionBackground) !important;
	color: var(--vscode-list-inactiveSelectionForeground) !important;
}

.profiles-editor .contents-container .profile-body .profile-tree .monaco-list-row .profile-content-tree .monaco-list-row .monaco-tl-twistie.collapsible {
	cursor: pointer;
}

.profiles-editor .contents-container .profile-body .profile-tree .monaco-list-row .codicon,
.profiles-editor .contents-container .profile-body .profile-tree .monaco-list-row .profile-content-tree .monaco-list-row .codicon {
	color: inherit !important;
}

.monaco-workbench.monaco-enable-motion .profiles-editor .contents-container .profile-body .profile-tree .monaco-list-row:hover .profile-content-tree-header,
.monaco-workbench.monaco-enable-motion .profiles-editor .contents-container .profile-body .profile-tree .monaco-list-row:hover .profile-associations-table .monaco-table > .monaco-split-view2 {
	border-color: var(--vscode-tree-tableColumnsBorder) !important;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/userDataProfile/common/userDataProfile.ts]---
Location: vscode-main/src/vs/workbench/contrib/userDataProfile/common/userDataProfile.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';
import { IUserDataProfile } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { IEditorPane } from '../../../common/editor.js';

export interface IUserDataProfilesEditor extends IEditorPane {
	createNewProfile(copyFrom?: URI | IUserDataProfile): Promise<void>;
	selectProfile(profile: IUserDataProfile): void;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/userDataSync/browser/userDataSync.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/userDataSync/browser/userDataSync.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IWorkbenchContributionsRegistry, Extensions as WorkbenchExtensions, IWorkbenchContribution } from '../../../common/contributions.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { UserDataSyncWorkbenchContribution } from './userDataSync.js';
import { IUserDataAutoSyncService, UserDataSyncError, UserDataSyncErrorCode } from '../../../../platform/userDataSync/common/userDataSync.js';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { localize } from '../../../../nls.js';
import { isWeb } from '../../../../base/common/platform.js';
import { UserDataSyncTrigger } from './userDataSyncTrigger.js';
import { toAction } from '../../../../base/common/actions.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IHostService } from '../../../services/host/browser/host.js';
import { SHOW_SYNC_LOG_COMMAND_ID } from '../../../services/userDataSync/common/userDataSync.js';

class UserDataSyncReportIssueContribution extends Disposable implements IWorkbenchContribution {

	constructor(
		@IUserDataAutoSyncService userDataAutoSyncService: IUserDataAutoSyncService,
		@INotificationService private readonly notificationService: INotificationService,
		@IProductService private readonly productService: IProductService,
		@ICommandService private readonly commandService: ICommandService,
		@IHostService private readonly hostService: IHostService,
	) {
		super();
		this._register(userDataAutoSyncService.onError(error => this.onAutoSyncError(error)));
	}

	private onAutoSyncError(error: UserDataSyncError): void {
		switch (error.code) {
			case UserDataSyncErrorCode.LocalTooManyRequests: {
				const message = isWeb ? localize({ key: 'local too many requests - reload', comment: ['Settings Sync is the name of the feature'] }, "Settings sync is suspended temporarily because the current device is making too many requests. Please reload {0} to resume.", this.productService.nameLong)
					: localize({ key: 'local too many requests - restart', comment: ['Settings Sync is the name of the feature'] }, "Settings sync is suspended temporarily because the current device is making too many requests. Please restart {0} to resume.", this.productService.nameLong);
				this.notificationService.notify({
					severity: Severity.Error,
					message,
					actions: {
						primary: [
							toAction({
								id: 'Show Sync Logs',
								label: localize('show sync logs', "Show Log"),
								run: () => this.commandService.executeCommand(SHOW_SYNC_LOG_COMMAND_ID)
							}),
							toAction({
								id: 'Restart',
								label: isWeb ? localize('reload', "Reload") : localize('restart', "Restart"),
								run: () => this.hostService.restart()
							})
						]
					}
				});
				return;
			}
			case UserDataSyncErrorCode.TooManyRequests: {
				const operationId = error.operationId ? localize('operationId', "Operation Id: {0}", error.operationId) : undefined;
				const message = localize({ key: 'server too many requests', comment: ['Settings Sync is the name of the feature'] }, "Settings sync is disabled because the current device is making too many requests. Please wait for 10 minutes and turn on sync.");
				this.notificationService.notify({
					severity: Severity.Error,
					message: operationId ? `${message} ${operationId}` : message,
					source: error.operationId ? localize('settings sync', "Settings Sync. Operation Id: {0}", error.operationId) : undefined,
					actions: {
						primary: [
							toAction({
								id: 'Show Sync Logs',
								label: localize('show sync logs', "Show Log"),
								run: () => this.commandService.executeCommand(SHOW_SYNC_LOG_COMMAND_ID)
							})
						]
					}
				});
				return;
			}
		}
	}
}

const workbenchRegistry = Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench);
workbenchRegistry.registerWorkbenchContribution(UserDataSyncWorkbenchContribution, LifecyclePhase.Restored);
workbenchRegistry.registerWorkbenchContribution(UserDataSyncTrigger, LifecyclePhase.Eventually);
workbenchRegistry.registerWorkbenchContribution(UserDataSyncReportIssueContribution, LifecyclePhase.Eventually);
```

--------------------------------------------------------------------------------

````
