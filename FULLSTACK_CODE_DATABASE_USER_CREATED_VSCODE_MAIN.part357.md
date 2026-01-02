---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 357
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 357 of 552)

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

---[FILE: src/vs/workbench/contrib/chat/browser/chatManagement/chatModelsWidget.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatManagement/chatModelsWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/chatModelsWidget.css';
import { Disposable, DisposableStore, IDisposable } from '../../../../../base/common/lifecycle.js';
import { Emitter } from '../../../../../base/common/event.js';
import * as DOM from '../../../../../base/browser/dom.js';
import { Button, IButtonOptions } from '../../../../../base/browser/ui/button/button.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { ILanguageModelsService } from '../../../chat/common/languageModels.js';
import { localize } from '../../../../../nls.js';
import { defaultButtonStyles } from '../../../../../platform/theme/browser/defaultStyles.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { WorkbenchTable } from '../../../../../platform/list/browser/listService.js';
import { ITableVirtualDelegate, ITableRenderer } from '../../../../../base/browser/ui/table/table.js';
import { IHoverService } from '../../../../../platform/hover/browser/hover.js';
import { MarkdownString } from '../../../../../base/common/htmlContent.js';
import { IExtensionService } from '../../../../services/extensions/common/extensions.js';
import { IContextMenuService } from '../../../../../platform/contextview/browser/contextView.js';
import { IAction, toAction, Action, Separator, SubmenuAction } from '../../../../../base/common/actions.js';
import { ActionBar } from '../../../../../base/browser/ui/actionbar/actionbar.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { ChatModelsViewModel, IModelEntry, IModelItemEntry, IVendorItemEntry, IGroupItemEntry, SEARCH_SUGGESTIONS, isVendorEntry, isGroupEntry, ChatModelGroup } from './chatModelsViewModel.js';
import { HighlightedLabel } from '../../../../../base/browser/ui/highlightedlabel/highlightedLabel.js';
import { SuggestEnabledInput } from '../../../codeEditor/browser/suggestEnabledInput/suggestEnabledInput.js';
import { Delayer } from '../../../../../base/common/async.js';
import { settingsTextInputBorder } from '../../../preferences/common/settingsEditorColorRegistry.js';
import { IChatEntitlementService, ChatEntitlement } from '../../../../services/chat/common/chatEntitlementService.js';
import { DropdownMenuActionViewItem } from '../../../../../base/browser/ui/dropdown/dropdownActionViewItem.js';
import { IActionViewItemOptions } from '../../../../../base/browser/ui/actionbar/actionViewItems.js';
import { AnchorAlignment } from '../../../../../base/browser/ui/contextview/contextview.js';
import { ToolBar } from '../../../../../base/browser/ui/toolbar/toolbar.js';
import { preferencesClearInputIcon } from '../../../preferences/browser/preferencesIcons.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { IEditorProgressService } from '../../../../../platform/progress/common/progress.js';
import { IContextKey, IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { CONTEXT_MODELS_SEARCH_FOCUS } from '../../common/constants.js';

const $ = DOM.$;

const HEADER_HEIGHT = 30;
const VENDOR_ROW_HEIGHT = 30;
const MODEL_ROW_HEIGHT = 26;

type TableEntry = IModelItemEntry | IVendorItemEntry | IGroupItemEntry;

export function getModelHoverContent(model: IModelEntry): MarkdownString {
	const markdown = new MarkdownString('', { isTrusted: true, supportThemeIcons: true });
	markdown.appendMarkdown(`**${model.metadata.name}**`);
	if (model.metadata.id !== model.metadata.version) {
		markdown.appendMarkdown(`&nbsp;<span style="background-color:#8080802B;">&nbsp;_${model.metadata.id}@${model.metadata.version}_&nbsp;</span>`);
	} else {
		markdown.appendMarkdown(`&nbsp;<span style="background-color:#8080802B;">&nbsp;_${model.metadata.id}_&nbsp;</span>`);
	}
	markdown.appendText(`\n`);

	if (model.metadata.statusIcon && model.metadata.tooltip) {
		if (model.metadata.statusIcon) {
			markdown.appendMarkdown(`$(${model.metadata.statusIcon.id})&nbsp;`);
		}
		markdown.appendMarkdown(`${model.metadata.tooltip}`);
		markdown.appendText(`\n`);
	}

	if (model.metadata.detail) {
		markdown.appendMarkdown(`${localize('models.cost', 'Multiplier')}: `);
		markdown.appendMarkdown(model.metadata.detail);
		markdown.appendText(`\n`);
	}

	if (model.metadata.maxInputTokens || model.metadata.maxOutputTokens) {
		markdown.appendMarkdown(`${localize('models.contextSize', 'Context Size')}: `);
		let addSeparator = false;
		if (model.metadata.maxInputTokens) {
			markdown.appendMarkdown(`$(arrow-down) ${formatTokenCount(model.metadata.maxInputTokens)} (${localize('models.input', 'Input')})`);
			addSeparator = true;
		}
		if (model.metadata.maxOutputTokens) {
			if (addSeparator) {
				markdown.appendText(`  |  `);
			}
			markdown.appendMarkdown(`$(arrow-up) ${formatTokenCount(model.metadata.maxOutputTokens)} (${localize('models.output', 'Output')})`);
		}
		markdown.appendText(`\n`);
	}

	if (model.metadata.capabilities) {
		markdown.appendMarkdown(`${localize('models.capabilities', 'Capabilities')}: `);
		if (model.metadata.capabilities?.toolCalling) {
			markdown.appendMarkdown(`&nbsp;<span style="background-color:#8080802B;">&nbsp;_${localize('models.toolCalling', 'Tools')}_&nbsp;</span>`);
		}
		if (model.metadata.capabilities?.vision) {
			markdown.appendMarkdown(`&nbsp;<span style="background-color:#8080802B;">&nbsp;_${localize('models.vision', 'Vision')}_&nbsp;</span>`);
		}
		if (model.metadata.capabilities?.agentMode) {
			markdown.appendMarkdown(`&nbsp;<span style="background-color:#8080802B;">&nbsp;_${localize('models.agentMode', 'Agent Mode')}_&nbsp;</span>`);
		}
		for (const editTool of model.metadata.capabilities.editTools ?? []) {
			markdown.appendMarkdown(`&nbsp;<span style="background-color:#8080802B;">&nbsp;_${editTool}_&nbsp;</span>`);
		}
		markdown.appendText(`\n`);
	}

	return markdown;
}

class ModelsFilterAction extends Action {
	constructor() {
		super('workbench.models.filter', localize('filter', "Filter"), ThemeIcon.asClassName(Codicon.filter));
	}
	override async run(): Promise<void> {
	}
}

function toggleFilter(currentQuery: string, query: string, alternativeQueries: string[] = []): string {
	const allQueries = [query, ...alternativeQueries];
	const isChecked = allQueries.some(q => currentQuery.includes(q));

	if (!isChecked) {
		const trimmedQuery = currentQuery.trim();
		return trimmedQuery ? `${trimmedQuery} ${query}` : query;
	} else {
		let queryWithRemovedFilter = currentQuery;
		for (const q of allQueries) {
			queryWithRemovedFilter = queryWithRemovedFilter.replace(q, '');
		}
		return queryWithRemovedFilter.replace(/\s+/g, ' ').trim();
	}
}

class ModelsSearchFilterDropdownMenuActionViewItem extends DropdownMenuActionViewItem {

	constructor(
		action: IAction,
		options: IActionViewItemOptions,
		private readonly searchWidget: SuggestEnabledInput,
		private readonly viewModel: ChatModelsViewModel,
		@IContextMenuService contextMenuService: IContextMenuService
	) {
		super(action,
			{ getActions: () => this.getActions() },
			contextMenuService,
			{
				...options,
				classNames: action.class,
				anchorAlignmentProvider: () => AnchorAlignment.RIGHT,
				menuAsChild: true
			}
		);
	}

	private createGroupByAction(grouping: ChatModelGroup, label: string): IAction {
		return {
			id: `groupBy.${grouping}`,
			label,
			class: undefined,
			enabled: true,
			tooltip: localize('groupByTooltip', "Group by {0}", label),
			checked: this.viewModel.groupBy === grouping,
			run: () => {
				this.viewModel.groupBy = grouping;
			}
		};
	}

	private createProviderAction(vendor: string, displayName: string): IAction {
		const query = `@provider:"${displayName}"`;
		const currentQuery = this.searchWidget.getValue();
		const isChecked = currentQuery.includes(query) || currentQuery.includes(`@provider:${vendor}`);

		return {
			id: `provider-${vendor}`,
			label: displayName,
			tooltip: localize('filterByProvider', "Filter by {0}", displayName),
			class: undefined,
			enabled: true,
			checked: isChecked,
			run: () => this.toggleFilterAndSearch(query, [`@provider:${vendor}`])
		};
	}

	private createCapabilityAction(capability: string, label: string): IAction {
		const query = `@capability:${capability}`;
		const currentQuery = this.searchWidget.getValue();
		const isChecked = currentQuery.includes(query);

		return {
			id: `capability-${capability}`,
			label,
			tooltip: localize('filterByCapability', "Filter by {0}", label),
			class: undefined,
			enabled: true,
			checked: isChecked,
			run: () => this.toggleFilterAndSearch(query)
		};
	}

	private createVisibleAction(visible: boolean, label: string): IAction {
		const query = `@visible:${visible}`;
		const oppositeQuery = `@visible:${!visible}`;
		const currentQuery = this.searchWidget.getValue();
		const isChecked = currentQuery.includes(query);

		return {
			id: `visible-${visible}`,
			label,
			tooltip: localize('filterByVisible', "Filter by {0}", label),
			class: undefined,
			enabled: true,
			checked: isChecked,
			run: () => this.toggleFilterAndSearch(query, [oppositeQuery])
		};
	}

	private toggleFilterAndSearch(query: string, alternativeQueries: string[] = []): void {
		const currentQuery = this.searchWidget.getValue();
		const newQuery = toggleFilter(currentQuery, query, alternativeQueries);
		this.searchWidget.setValue(newQuery);
		this.searchWidget.focus();
	}

	private getActions(): IAction[] {
		const actions: IAction[] = [];

		// Visibility filters
		actions.push(this.createVisibleAction(true, localize('filter.visible', 'Visible')));
		actions.push(this.createVisibleAction(false, localize('filter.hidden', 'Hidden')));

		// Capability filters
		actions.push(new Separator());
		actions.push(
			this.createCapabilityAction('tools', localize('capability.tools', 'Tools')),
			this.createCapabilityAction('vision', localize('capability.vision', 'Vision')),
			this.createCapabilityAction('agent', localize('capability.agent', 'Agent Mode'))
		);

		// Provider filters - only show providers with configured models
		const configuredVendors = this.viewModel.getConfiguredVendors();
		if (configuredVendors.length > 1) {
			actions.push(new Separator());
			actions.push(...configuredVendors.map(vendor => this.createProviderAction(vendor.vendor, vendor.vendorDisplayName)));
		}

		// Group By
		actions.push(new Separator());
		const groupByActions: IAction[] = [];
		groupByActions.push(this.createGroupByAction(ChatModelGroup.Vendor, localize('groupBy.provider', 'Provider')));
		groupByActions.push(this.createGroupByAction(ChatModelGroup.Visibility, localize('groupBy.visibility', 'Visibility')));
		actions.push(new SubmenuAction('groupBy', localize('groupBy', "Group By"), groupByActions));

		return actions;
	}
}

class Delegate implements ITableVirtualDelegate<TableEntry> {
	readonly headerRowHeight = HEADER_HEIGHT;
	getHeight(element: TableEntry): number {
		return isVendorEntry(element) || isGroupEntry(element) ? VENDOR_ROW_HEIGHT : MODEL_ROW_HEIGHT;
	}
}

interface IModelTableColumnTemplateData {
	readonly container: HTMLElement;
	readonly disposables: DisposableStore;
	readonly elementDisposables: DisposableStore;
}

abstract class ModelsTableColumnRenderer<T extends IModelTableColumnTemplateData> implements ITableRenderer<TableEntry, T> {
	abstract readonly templateId: string;
	abstract renderTemplate(container: HTMLElement): T;

	renderElement(element: TableEntry, index: number, templateData: T): void {
		templateData.elementDisposables.clear();
		const isVendor = isVendorEntry(element);
		const isGroup = isGroupEntry(element);
		templateData.container.classList.add('models-table-column');
		templateData.container.parentElement!.classList.toggle('models-vendor-row', isVendor || isGroup);
		templateData.container.parentElement!.classList.toggle('models-model-row', !isVendor && !isGroup);
		templateData.container.parentElement!.classList.toggle('model-hidden', !isVendor && !isGroup && !element.modelEntry.metadata.isUserSelectable);
		if (isVendor) {
			this.renderVendorElement(element, index, templateData);
		} else if (isGroup) {
			this.renderGroupElement(element, index, templateData);
		} else {
			this.renderModelElement(element, index, templateData);
		}
	}

	abstract renderVendorElement(element: IVendorItemEntry, index: number, templateData: T): void;
	abstract renderGroupElement(element: IGroupItemEntry, index: number, templateData: T): void;
	abstract renderModelElement(element: IModelItemEntry, index: number, templateData: T): void;

	disposeTemplate(templateData: T): void {
		templateData.elementDisposables.dispose();
		templateData.disposables.dispose();
	}
}

interface IToggleCollapseColumnTemplateData extends IModelTableColumnTemplateData {
	readonly listRowElement: HTMLElement | null;
	readonly container: HTMLElement;
	readonly actionBar: ActionBar;
}

class GutterColumnRenderer extends ModelsTableColumnRenderer<IToggleCollapseColumnTemplateData> {

	static readonly TEMPLATE_ID = 'gutter';

	readonly templateId: string = GutterColumnRenderer.TEMPLATE_ID;

	constructor(
		private readonly viewModel: ChatModelsViewModel,
	) {
		super();
	}

	renderTemplate(container: HTMLElement): IToggleCollapseColumnTemplateData {
		const disposables = new DisposableStore();
		const elementDisposables = new DisposableStore();
		container.classList.add('models-gutter-column');
		const actionBar = disposables.add(new ActionBar(container));
		return {
			listRowElement: container.parentElement?.parentElement ?? null,
			container,
			actionBar,
			disposables,
			elementDisposables
		};
	}

	override renderElement(entry: TableEntry, index: number, templateData: IToggleCollapseColumnTemplateData): void {
		templateData.actionBar.clear();
		super.renderElement(entry, index, templateData);
	}

	override renderVendorElement(entry: IVendorItemEntry, index: number, templateData: IToggleCollapseColumnTemplateData): void {
		this.renderCollapsableElement(entry, templateData);
	}

	override renderGroupElement(entry: IGroupItemEntry, index: number, templateData: IToggleCollapseColumnTemplateData): void {
		this.renderCollapsableElement(entry, templateData);
	}

	private renderCollapsableElement(entry: IVendorItemEntry | IGroupItemEntry, templateData: IToggleCollapseColumnTemplateData): void {
		if (templateData.listRowElement) {
			templateData.listRowElement.setAttribute('aria-expanded', entry.collapsed ? 'false' : 'true');
		}

		const label = entry.collapsed ? localize('expand', 'Expand') : localize('collapse', 'Collapse');
		const toggleCollapseAction = {
			id: 'toggleCollapse',
			label,
			tooltip: label,
			enabled: true,
			class: ThemeIcon.asClassName(entry.collapsed ? Codicon.chevronRight : Codicon.chevronDown),
			run: () => this.viewModel.toggleCollapsed(entry)
		};
		templateData.actionBar.push(toggleCollapseAction, { icon: true, label: false });
	}

	override renderModelElement(entry: IModelItemEntry, index: number, templateData: IToggleCollapseColumnTemplateData): void {
		const { modelEntry } = entry;
		const isVisible = modelEntry.metadata.isUserSelectable ?? false;
		const toggleVisibilityAction = toAction({
			id: 'toggleVisibility',
			label: isVisible ? localize('models.hide', 'Hide') : localize('models.show', 'Show'),
			class: `model-visibility-toggle ${isVisible ? `${ThemeIcon.asClassName(Codicon.eye)} model-visible` : `${ThemeIcon.asClassName(Codicon.eyeClosed)} model-hidden`}`,
			tooltip: isVisible ? localize('models.visible', 'Hide in the chat model picker') : localize('models.hidden', 'Show in the chat model picker'),
			checked: !isVisible,
			run: async () => this.viewModel.toggleVisibility(entry)
		});
		templateData.actionBar.push(toggleVisibilityAction, { icon: true, label: false });
	}
}

interface IModelNameColumnTemplateData extends IModelTableColumnTemplateData {
	readonly statusIcon: HTMLElement;
	readonly nameLabel: HighlightedLabel;
	readonly actionBar: ActionBar;
}

class ModelNameColumnRenderer extends ModelsTableColumnRenderer<IModelNameColumnTemplateData> {
	static readonly TEMPLATE_ID = 'modelName';

	readonly templateId: string = ModelNameColumnRenderer.TEMPLATE_ID;

	constructor(
		@IHoverService private readonly hoverService: IHoverService
	) {
		super();
	}

	renderTemplate(container: HTMLElement): IModelNameColumnTemplateData {
		const disposables = new DisposableStore();
		const elementDisposables = new DisposableStore();
		const nameContainer = DOM.append(container, $('.model-name-container'));
		const nameLabel = disposables.add(new HighlightedLabel(DOM.append(nameContainer, $('.model-name'))));
		const statusIcon = DOM.append(nameContainer, $('.model-status-icon'));
		const actionBar = disposables.add(new ActionBar(DOM.append(nameContainer, $('.model-name-actions'))));
		return {
			container,
			statusIcon,
			nameLabel,
			actionBar,
			disposables,
			elementDisposables
		};
	}

	override renderElement(entry: TableEntry, index: number, templateData: IModelNameColumnTemplateData): void {
		DOM.clearNode(templateData.statusIcon);
		templateData.actionBar.clear();
		super.renderElement(entry, index, templateData);
	}

	override renderVendorElement(entry: IVendorItemEntry, index: number, templateData: IModelNameColumnTemplateData): void {
		templateData.nameLabel.set(entry.vendorEntry.vendorDisplayName, undefined);
	}

	override renderGroupElement(entry: IGroupItemEntry, index: number, templateData: IModelNameColumnTemplateData): void {
		templateData.nameLabel.set(entry.label, undefined);
	}

	override renderModelElement(entry: IModelItemEntry, index: number, templateData: IModelNameColumnTemplateData): void {
		const { modelEntry, modelNameMatches } = entry;

		templateData.statusIcon.className = 'model-status-icon';
		if (modelEntry.metadata.statusIcon) {
			templateData.statusIcon.classList.add(...ThemeIcon.asClassNameArray(modelEntry.metadata.statusIcon));
			templateData.statusIcon.style.display = '';
		} else {
			templateData.statusIcon.style.display = 'none';
		}

		templateData.nameLabel.set(modelEntry.metadata.name, modelNameMatches);

		const markdown = new MarkdownString('', { isTrusted: true, supportThemeIcons: true });
		markdown.appendMarkdown(`**${entry.modelEntry.metadata.name}**`);
		if (entry.modelEntry.metadata.id !== entry.modelEntry.metadata.version) {
			markdown.appendMarkdown(`&nbsp;<span style="background-color:#8080802B;">&nbsp;_${entry.modelEntry.metadata.id}@${entry.modelEntry.metadata.version}_&nbsp;</span>`);
		} else {
			markdown.appendMarkdown(`&nbsp;<span style="background-color:#8080802B;">&nbsp;_${entry.modelEntry.metadata.id}_&nbsp;</span>`);
		}
		markdown.appendText(`\n`);

		if (entry.modelEntry.metadata.statusIcon && entry.modelEntry.metadata.tooltip) {
			if (entry.modelEntry.metadata.statusIcon) {
				markdown.appendMarkdown(`$(${entry.modelEntry.metadata.statusIcon.id})&nbsp;`);
			}
			markdown.appendMarkdown(`${entry.modelEntry.metadata.tooltip}`);
			markdown.appendText(`\n`);
		}

		if (!entry.modelEntry.metadata.isUserSelectable) {
			markdown.appendMarkdown(`\n\n${localize('models.userSelectable', 'This model is hidden in the chat model picker')}`);
		}

		templateData.elementDisposables.add(this.hoverService.setupDelayedHoverAtMouse(templateData.container!, () => ({
			content: markdown,
			appearance: {
				compact: true,
				skipFadeInAnimation: true,
			}
		})));
	}
}

interface IMultiplierColumnTemplateData extends IModelTableColumnTemplateData {
	readonly multiplierElement: HTMLElement;
}

class MultiplierColumnRenderer extends ModelsTableColumnRenderer<IMultiplierColumnTemplateData> {
	static readonly TEMPLATE_ID = 'multiplier';

	readonly templateId: string = MultiplierColumnRenderer.TEMPLATE_ID;

	constructor(
		@IHoverService private readonly hoverService: IHoverService
	) {
		super();
	}

	renderTemplate(container: HTMLElement): IMultiplierColumnTemplateData {
		const disposables = new DisposableStore();
		const elementDisposables = new DisposableStore();
		const multiplierElement = DOM.append(container, $('.model-multiplier'));
		return {
			container,
			multiplierElement,
			disposables,
			elementDisposables
		};
	}

	override renderVendorElement(entry: IVendorItemEntry, index: number, templateData: IMultiplierColumnTemplateData): void {
		templateData.multiplierElement.textContent = '';
	}

	override renderGroupElement(entry: IGroupItemEntry, index: number, templateData: IMultiplierColumnTemplateData): void {
		templateData.multiplierElement.textContent = '';
	}

	override renderModelElement(entry: IModelItemEntry, index: number, templateData: IMultiplierColumnTemplateData): void {
		const multiplierText = (entry.modelEntry.metadata.detail && entry.modelEntry.metadata.detail.trim().toLowerCase() !== entry.modelEntry.vendor.trim().toLowerCase()) ? entry.modelEntry.metadata.detail : '-';
		templateData.multiplierElement.textContent = multiplierText;

		if (multiplierText !== '-') {
			templateData.elementDisposables.add(this.hoverService.setupDelayedHoverAtMouse(templateData.container, () => ({
				content: localize('multiplier.tooltip', "Every chat message counts {0} towards your premium model request quota", multiplierText),
				appearance: {
					compact: true,
					skipFadeInAnimation: true
				}
			})));
		}
	}
}

interface ITokenLimitsColumnTemplateData extends IModelTableColumnTemplateData {
	readonly tokenLimitsElement: HTMLElement;
}

class TokenLimitsColumnRenderer extends ModelsTableColumnRenderer<ITokenLimitsColumnTemplateData> {
	static readonly TEMPLATE_ID = 'tokenLimits';

	readonly templateId: string = TokenLimitsColumnRenderer.TEMPLATE_ID;

	constructor(
		@IHoverService private readonly hoverService: IHoverService
	) {
		super();
	}

	renderTemplate(container: HTMLElement): ITokenLimitsColumnTemplateData {
		const disposables = new DisposableStore();
		const elementDisposables = new DisposableStore();
		const tokenLimitsElement = DOM.append(container, $('.model-token-limits'));
		return {
			container,
			tokenLimitsElement,
			disposables,
			elementDisposables
		};
	}

	override renderElement(entry: TableEntry, index: number, templateData: ITokenLimitsColumnTemplateData): void {
		DOM.clearNode(templateData.tokenLimitsElement);
		super.renderElement(entry, index, templateData);
	}

	override renderVendorElement(entry: IVendorItemEntry, index: number, templateData: ITokenLimitsColumnTemplateData): void {
	}

	override renderGroupElement(entry: IGroupItemEntry, index: number, templateData: ITokenLimitsColumnTemplateData): void {
	}

	override renderModelElement(entry: IModelItemEntry, index: number, templateData: ITokenLimitsColumnTemplateData): void {
		const { modelEntry } = entry;
		const markdown = new MarkdownString('', { isTrusted: true, supportThemeIcons: true });
		if (modelEntry.metadata.maxInputTokens || modelEntry.metadata.maxOutputTokens) {
			let addSeparator = false;
			markdown.appendMarkdown(`${localize('models.contextSize', 'Context Size')}: `);
			if (modelEntry.metadata.maxInputTokens) {
				const inputDiv = DOM.append(templateData.tokenLimitsElement, $('.token-limit-item'));
				DOM.append(inputDiv, $('span.codicon.codicon-arrow-down'));
				const inputText = DOM.append(inputDiv, $('span'));
				inputText.textContent = formatTokenCount(modelEntry.metadata.maxInputTokens);

				markdown.appendMarkdown(`$(arrow-down) ${modelEntry.metadata.maxInputTokens} (${localize('models.input', 'Input')})`);
				addSeparator = true;
			}
			if (modelEntry.metadata.maxOutputTokens) {
				const outputDiv = DOM.append(templateData.tokenLimitsElement, $('.token-limit-item'));
				DOM.append(outputDiv, $('span.codicon.codicon-arrow-up'));
				const outputText = DOM.append(outputDiv, $('span'));
				outputText.textContent = formatTokenCount(modelEntry.metadata.maxOutputTokens);
				if (addSeparator) {
					markdown.appendText(`  |  `);
				}
				markdown.appendMarkdown(`$(arrow-up) ${modelEntry.metadata.maxOutputTokens} (${localize('models.output', 'Output')})`);
			}
		}

		templateData.elementDisposables.add(this.hoverService.setupDelayedHoverAtMouse(templateData.container, () => ({
			content: markdown,
			appearance: {
				compact: true,
				skipFadeInAnimation: true,
			}
		})));
	}
}

interface ICapabilitiesColumnTemplateData extends IModelTableColumnTemplateData {
	readonly metadataRow: HTMLElement;
}

class CapabilitiesColumnRenderer extends ModelsTableColumnRenderer<ICapabilitiesColumnTemplateData> {
	static readonly TEMPLATE_ID = 'capabilities';

	readonly templateId: string = CapabilitiesColumnRenderer.TEMPLATE_ID;

	private readonly _onDidClickCapability = new Emitter<string>();
	readonly onDidClickCapability = this._onDidClickCapability.event;

	renderTemplate(container: HTMLElement): ICapabilitiesColumnTemplateData {
		const disposables = new DisposableStore();
		const elementDisposables = new DisposableStore();
		container.classList.add('model-capability-column');
		const metadataRow = DOM.append(container, $('.model-capabilities'));
		return {
			container,
			metadataRow,
			disposables,
			elementDisposables
		};
	}

	override renderElement(entry: TableEntry, index: number, templateData: ICapabilitiesColumnTemplateData): void {
		DOM.clearNode(templateData.metadataRow);
		super.renderElement(entry, index, templateData);
	}

	override renderVendorElement(entry: IVendorItemEntry, index: number, templateData: ICapabilitiesColumnTemplateData): void {
	}

	override renderGroupElement(entry: IGroupItemEntry, index: number, templateData: ICapabilitiesColumnTemplateData): void {
	}

	override renderModelElement(entry: IModelItemEntry, index: number, templateData: ICapabilitiesColumnTemplateData): void {
		const { modelEntry, capabilityMatches } = entry;

		if (modelEntry.metadata.capabilities?.toolCalling) {
			templateData.elementDisposables.add(this.createCapabilityButton(
				templateData.metadataRow,
				capabilityMatches?.includes('toolCalling') || false,
				localize('models.tools', 'Tools'),
				'tools'
			));
		}

		if (modelEntry.metadata.capabilities?.vision) {
			templateData.elementDisposables.add(this.createCapabilityButton(
				templateData.metadataRow,
				capabilityMatches?.includes('vision') || false,
				localize('models.vision', 'Vision'),
				'vision'
			));
		}
	}

	private createCapabilityButton(container: HTMLElement, isActive: boolean, label: string, capability: string): IDisposable {
		const disposables = new DisposableStore();
		const buttonContainer = DOM.append(container, $('.model-badge-container'));
		const button = disposables.add(new Button(buttonContainer, { secondary: true }));
		button.element.classList.add('model-capability');
		button.element.classList.toggle('active', isActive);
		button.label = label;
		disposables.add(button.onDidClick(() => this._onDidClickCapability.fire(capability)));
		return disposables;
	}
}

interface IActionsColumnTemplateData extends IModelTableColumnTemplateData {
	readonly actionBar: ActionBar;
}

class ActionsColumnRenderer extends ModelsTableColumnRenderer<IActionsColumnTemplateData> {
	static readonly TEMPLATE_ID = 'actions';

	readonly templateId: string = ActionsColumnRenderer.TEMPLATE_ID;

	constructor(
		private readonly viewModel: ChatModelsViewModel,
		@ICommandService private readonly commandService: ICommandService
	) {
		super();
	}

	renderTemplate(container: HTMLElement): IActionsColumnTemplateData {
		const disposables = new DisposableStore();
		const elementDisposables = new DisposableStore();
		const parent = DOM.append(container, $('.actions-column'));
		const actionBar = disposables.add(new ActionBar(parent));

		return {
			container,
			actionBar,
			disposables,
			elementDisposables
		};
	}

	override renderElement(entry: TableEntry, index: number, templateData: IActionsColumnTemplateData): void {
		templateData.actionBar.clear();
		super.renderElement(entry, index, templateData);
	}

	override renderVendorElement(entry: IVendorItemEntry, index: number, templateData: IActionsColumnTemplateData): void {
		if (entry.vendorEntry.managementCommand) {
			const { vendorEntry } = entry;
			const action = toAction({
				id: 'manageVendor',
				label: localize('models.manageProvider', 'Manage {0}...', entry.vendorEntry.vendorDisplayName),
				class: ThemeIcon.asClassName(Codicon.gear),
				run: async () => {
					await this.commandService.executeCommand(vendorEntry.managementCommand!, vendorEntry.vendor);
					this.viewModel.refresh();
				}

			});
			templateData.actionBar.push(action, { icon: true, label: false });
		}
	}

	override renderGroupElement(entry: IGroupItemEntry, index: number, templateData: IActionsColumnTemplateData): void {
	}

	override renderModelElement(entry: IModelItemEntry, index: number, templateData: IActionsColumnTemplateData): void {
		// Visibility action moved to name column
	}
}

interface IProviderColumnTemplateData extends IModelTableColumnTemplateData {
	readonly providerElement: HTMLElement;
}

class ProviderColumnRenderer extends ModelsTableColumnRenderer<IProviderColumnTemplateData> {
	static readonly TEMPLATE_ID = 'provider';

	readonly templateId: string = ProviderColumnRenderer.TEMPLATE_ID;

	renderTemplate(container: HTMLElement): IProviderColumnTemplateData {
		const disposables = new DisposableStore();
		const elementDisposables = new DisposableStore();
		const providerElement = DOM.append(container, $('.model-provider'));
		return {
			container,
			providerElement,
			disposables,
			elementDisposables
		};
	}

	override renderVendorElement(entry: IVendorItemEntry, index: number, templateData: IProviderColumnTemplateData): void {
		templateData.providerElement.textContent = '';
	}

	override renderGroupElement(entry: IGroupItemEntry, index: number, templateData: IProviderColumnTemplateData): void {
		templateData.providerElement.textContent = '';
	}

	override renderModelElement(entry: IModelItemEntry, index: number, templateData: IProviderColumnTemplateData): void {
		templateData.providerElement.textContent = entry.modelEntry.vendorDisplayName;
	}
}



function formatTokenCount(count: number): string {
	if (count >= 1000000) {
		return `${(count / 1000000).toFixed(1)}M`;
	} else if (count >= 1000) {
		return `${(count / 1000).toFixed(0)}K`;
	}
	return count.toString();
}

export class ChatModelsWidget extends Disposable {

	private static NUM_INSTANCES: number = 0;

	readonly element: HTMLElement;
	private searchWidget!: SuggestEnabledInput;
	private searchActionsContainer!: HTMLElement;
	private table!: WorkbenchTable<TableEntry>;
	private tableContainer!: HTMLElement;
	private addButtonContainer!: HTMLElement;
	private addButton!: Button;
	private dropdownActions: IAction[] = [];
	private viewModel: ChatModelsViewModel;
	private delayedFiltering: Delayer<void>;

	private readonly searchFocusContextKey: IContextKey<boolean>;

	private tableDisposables = this._register(new DisposableStore());

	constructor(
		@ILanguageModelsService private readonly languageModelsService: ILanguageModelsService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IExtensionService private readonly extensionService: IExtensionService,
		@IContextMenuService private readonly contextMenuService: IContextMenuService,
		@IChatEntitlementService private readonly chatEntitlementService: IChatEntitlementService,
		@IEditorProgressService private readonly editorProgressService: IEditorProgressService,
		@ICommandService private readonly commandService: ICommandService,
		@IContextKeyService contextKeyService: IContextKeyService,
	) {
		super();

		this.searchFocusContextKey = CONTEXT_MODELS_SEARCH_FOCUS.bindTo(contextKeyService);
		this.delayedFiltering = new Delayer<void>(200);
		this.viewModel = this._register(this.instantiationService.createInstance(ChatModelsViewModel));
		this.element = DOM.$('.models-widget');
		this.create(this.element);

		const loadingPromise = this.extensionService.whenInstalledExtensionsRegistered().then(() => this.viewModel.refresh());
		this.editorProgressService.showWhile(loadingPromise, 300);
	}

	private create(container: HTMLElement): void {
		const searchAndButtonContainer = DOM.append(container, $('.models-search-and-button-container'));

		const placeholder = localize('Search.FullTextSearchPlaceholder', "Type to search...");
		const searchContainer = DOM.append(searchAndButtonContainer, $('.models-search-container'));
		this.searchWidget = this._register(this.instantiationService.createInstance(
			SuggestEnabledInput,
			'chatModelsWidget.searchbox',
			searchContainer,
			{
				triggerCharacters: ['@', ':'],
				provideResults: (query: string) => {
					const providerSuggestions = this.viewModel.getVendors().map(v => `@provider:"${v.displayName}"`);
					const allSuggestions = [
						...providerSuggestions,
						...SEARCH_SUGGESTIONS.CAPABILITIES,
						...SEARCH_SUGGESTIONS.VISIBILITY,
					];
					if (!query.trim()) {
						return allSuggestions;
					}
					const queryParts = query.split(/\s/g);
					const lastPart = queryParts[queryParts.length - 1];
					if (lastPart.startsWith('@provider:')) {
						return providerSuggestions;
					} else if (lastPart.startsWith('@capability:')) {
						return SEARCH_SUGGESTIONS.CAPABILITIES;
					} else if (lastPart.startsWith('@visible:')) {
						return SEARCH_SUGGESTIONS.VISIBILITY;
					} else if (lastPart.startsWith('@')) {
						return allSuggestions;
					}
					return [];
				}
			},
			placeholder,
			`chatModelsWidget:searchinput:${ChatModelsWidget.NUM_INSTANCES++}`,
			{
				placeholderText: placeholder,
				styleOverrides: {
					inputBorder: settingsTextInputBorder
				},
				focusContextKey: this.searchFocusContextKey,
			},
		));

		const filterAction = this._register(new ModelsFilterAction());
		const clearSearchAction = this._register(new Action(
			'workbench.models.clearSearch',
			localize('clearSearch', "Clear Search"),
			ThemeIcon.asClassName(preferencesClearInputIcon),
			false,
			() => {
				this.searchWidget.setValue('');
				this.searchWidget.focus();
			}
		));
		const collapseAllAction = this._register(new Action(
			'workbench.models.collapseAll',
			localize('collapseAll', "Collapse All"),
			ThemeIcon.asClassName(Codicon.collapseAll),
			false,
			() => {
				this.viewModel.collapseAll();
			}
		));
		collapseAllAction.enabled = this.viewModel.viewModelEntries.some(e => isVendorEntry(e) || isGroupEntry(e));
		this._register(this.viewModel.onDidChange(() => collapseAllAction.enabled = this.viewModel.viewModelEntries.some(e => isVendorEntry(e) || isGroupEntry(e))));

		this._register(this.searchWidget.onInputDidChange(() => {
			clearSearchAction.enabled = !!this.searchWidget.getValue();
			this.filterModels();
		}));

		this.searchActionsContainer = DOM.append(searchContainer, $('.models-search-actions'));
		const actions = [clearSearchAction, collapseAllAction, filterAction];
		const toolBar = this._register(new ToolBar(this.searchActionsContainer, this.contextMenuService, {
			actionViewItemProvider: (action: IAction, options: IActionViewItemOptions) => {
				if (action.id === filterAction.id) {
					return this.instantiationService.createInstance(ModelsSearchFilterDropdownMenuActionViewItem, action, options, this.searchWidget, this.viewModel);
				}
				return undefined;
			},
			getKeyBinding: () => undefined
		}));
		toolBar.setActions(actions);

		// Add padding to input box for toolbar
		this.searchWidget.inputWidget.getContainerDomNode().style.paddingRight = `${DOM.getTotalWidth(this.searchActionsContainer) + 12}px`;

		this.addButtonContainer = DOM.append(searchAndButtonContainer, $('.section-title-actions'));
		const buttonOptions: IButtonOptions = {
			...defaultButtonStyles,
			supportIcons: true,
		};
		this.addButton = this._register(new Button(this.addButtonContainer, buttonOptions));
		this.addButton.label = `$(${Codicon.add.id}) ${localize('models.enableModelProvider', 'Add Models...')}`;
		this.addButton.element.classList.add('models-add-model-button');
		this.addButton.enabled = false;
		this._register(this.addButton.onDidClick((e) => {
			if (this.dropdownActions.length > 0) {
				this.contextMenuService.showContextMenu({
					getAnchor: () => this.addButton.element,
					getActions: () => this.dropdownActions,
				});
			}
		}));

		// Table container
		this.tableContainer = DOM.append(container, $('.models-table-container'));

		// Create table
		this.createTable();
		this._register(this.viewModel.onDidChangeGrouping(() => this.createTable()));
	}

	private createTable(): void {
		this.tableDisposables.clear();
		DOM.clearNode(this.tableContainer);

		const gutterColumnRenderer = this.instantiationService.createInstance(GutterColumnRenderer, this.viewModel);
		const modelNameColumnRenderer = this.instantiationService.createInstance(ModelNameColumnRenderer);
		const costColumnRenderer = this.instantiationService.createInstance(MultiplierColumnRenderer);
		const tokenLimitsColumnRenderer = this.instantiationService.createInstance(TokenLimitsColumnRenderer);
		const capabilitiesColumnRenderer = this.instantiationService.createInstance(CapabilitiesColumnRenderer);
		const actionsColumnRenderer = this.instantiationService.createInstance(ActionsColumnRenderer, this.viewModel);
		const providerColumnRenderer = this.instantiationService.createInstance(ProviderColumnRenderer);

		this.tableDisposables.add(capabilitiesColumnRenderer.onDidClickCapability(capability => {
			const currentQuery = this.searchWidget.getValue();
			const query = `@capability:${capability}`;
			const newQuery = toggleFilter(currentQuery, query);
			this.searchWidget.setValue(newQuery);
			this.searchWidget.focus();
		}));

		const columns = [
			{
				label: '',
				tooltip: '',
				weight: 0.05,
				minimumWidth: 40,
				maximumWidth: 40,
				templateId: GutterColumnRenderer.TEMPLATE_ID,
				project(row: TableEntry): TableEntry { return row; }
			},
			{
				label: localize('modelName', 'Name'),
				tooltip: '',
				weight: 0.35,
				minimumWidth: 200,
				templateId: ModelNameColumnRenderer.TEMPLATE_ID,
				project(row: TableEntry): TableEntry { return row; }
			}
		];

		if (this.viewModel.groupBy === ChatModelGroup.Visibility) {
			columns.push({
				label: localize('provider', 'Provider'),
				tooltip: '',
				weight: 0.15,
				minimumWidth: 100,
				templateId: ProviderColumnRenderer.TEMPLATE_ID,
				project(row: TableEntry): TableEntry { return row; }
			});
		}

		columns.push(
			{
				label: localize('tokenLimits', 'Context Size'),
				tooltip: '',
				weight: 0.1,
				minimumWidth: 140,
				templateId: TokenLimitsColumnRenderer.TEMPLATE_ID,
				project(row: TableEntry): TableEntry { return row; }
			},
			{
				label: localize('capabilities', 'Capabilities'),
				tooltip: '',
				weight: 0.25,
				minimumWidth: 180,
				templateId: CapabilitiesColumnRenderer.TEMPLATE_ID,
				project(row: TableEntry): TableEntry { return row; }
			},
			{
				label: localize('cost', 'Multiplier'),
				tooltip: '',
				weight: 0.05,
				minimumWidth: 60,
				templateId: MultiplierColumnRenderer.TEMPLATE_ID,
				project(row: TableEntry): TableEntry { return row; }
			},
			{
				label: '',
				tooltip: '',
				weight: 0.05,
				minimumWidth: 64,
				maximumWidth: 64,
				templateId: ActionsColumnRenderer.TEMPLATE_ID,
				project(row: TableEntry): TableEntry { return row; }
			}
		);

		this.table = this.tableDisposables.add(this.instantiationService.createInstance(
			WorkbenchTable,
			'ModelsWidget',
			this.tableContainer,
			new Delegate(),
			columns,
			[
				gutterColumnRenderer,
				modelNameColumnRenderer,
				costColumnRenderer,
				tokenLimitsColumnRenderer,
				capabilitiesColumnRenderer,
				actionsColumnRenderer,
				providerColumnRenderer
			],
			{
				identityProvider: { getId: (e: TableEntry) => e.id },
				horizontalScrolling: false,
				accessibilityProvider: {
					getAriaLabel: (e: TableEntry) => {
						if (isVendorEntry(e)) {
							return localize('vendor.ariaLabel', '{0} Models', e.vendorEntry.vendorDisplayName);
						} else if (isGroupEntry(e)) {
							return e.id === 'visible' ? localize('visible.ariaLabel', 'Visible Models') : localize('hidden.ariaLabel', 'Hidden Models');
						}
						const ariaLabels = [];
						ariaLabels.push(localize('model.name', '{0} from {1}', e.modelEntry.metadata.name, e.modelEntry.vendorDisplayName));
						if (e.modelEntry.metadata.maxInputTokens && e.modelEntry.metadata.maxOutputTokens) {
							ariaLabels.push(localize('model.contextSize', 'Context size: {0} input tokens and {1} output tokens', formatTokenCount(e.modelEntry.metadata.maxInputTokens), formatTokenCount(e.modelEntry.metadata.maxOutputTokens)));
						}
						if (e.modelEntry.metadata.capabilities) {
							ariaLabels.push(localize('model.capabilities', 'Capabilities: {0}', Object.keys(e.modelEntry.metadata.capabilities).join(', ')));
						}
						const multiplierText = (e.modelEntry.metadata.detail && e.modelEntry.metadata.detail.trim().toLowerCase() !== e.modelEntry.vendor.trim().toLowerCase()) ? e.modelEntry.metadata.detail : '-';
						if (multiplierText !== '-') {
							ariaLabels.push(localize('multiplier.tooltip', "Every chat message counts {0} towards your premium model request quota", multiplierText));
						}
						if (e.modelEntry.metadata.isUserSelectable) {
							ariaLabels.push(localize('model.visible', 'This model is visible in the chat model picker'));
						} else {
							ariaLabels.push(localize('model.hidden', 'This model is hidden in the chat model picker'));
						}
						return ariaLabels.join('. ');
					},
					getWidgetAriaLabel: () => localize('modelsTable.ariaLabel', 'Language Models')
				},
				multipleSelectionSupport: false,
				setRowLineHeight: false,
				openOnSingleClick: true,
				alwaysConsumeMouseWheel: false,
			}
		)) as WorkbenchTable<TableEntry>;

		this.tableDisposables.add(this.table.onContextMenu(e => {
			if (!e.element) {
				return;
			}
			const entry = e.element;
			if (isVendorEntry(entry) && entry.vendorEntry.managementCommand) {
				const actions: IAction[] = [
					toAction({
						id: 'manageVendor',
						label: localize('models.manageProvider', 'Manage {0}...', entry.vendorEntry.vendorDisplayName),
						run: async () => {
							await this.commandService.executeCommand(entry.vendorEntry.managementCommand!, entry.vendorEntry.vendor);
							await this.viewModel.refresh();
						}
					})
				];
				this.contextMenuService.showContextMenu({
					getAnchor: () => e.anchor,
					getActions: () => actions
				});
			}
		}));

		this.table.splice(0, this.table.length, this.viewModel.viewModelEntries);
		this.tableDisposables.add(this.viewModel.onDidChange(({ at, removed, added }) => {
			this.table.splice(at, removed, added);
			if (this.viewModel.selectedEntry) {
				const selectedEntryIndex = this.viewModel.viewModelEntries.indexOf(this.viewModel.selectedEntry);
				this.table.setFocus([selectedEntryIndex]);
				this.table.setSelection([selectedEntryIndex]);
			}

			const vendors = this.viewModel.getVendors();
			const configuredVendors = new Set(this.viewModel.getConfiguredVendors().map(cv => cv.vendor));
			const vendorsWithoutModels = vendors.filter(v => !configuredVendors.has(v.vendor));

			const hasPlan = this.chatEntitlementService.entitlement !== ChatEntitlement.Unknown && this.chatEntitlementService.entitlement !== ChatEntitlement.Available;
			this.addButton.enabled = hasPlan && vendorsWithoutModels.length > 0;

			this.dropdownActions = vendorsWithoutModels.map(vendor => toAction({
				id: `enable-${vendor.vendor}`,
				label: vendor.displayName,
				run: async () => {
					await this.enableProvider(vendor.vendor);
				}
			}));
		}));

		this.tableDisposables.add(this.table.onDidOpen(async ({ element, browserEvent }) => {
			if (!element) {
				return;
			}
			if (isVendorEntry(element) || isGroupEntry(element)) {
				this.viewModel.toggleCollapsed(element);
			} else if (!DOM.isMouseEvent(browserEvent) || browserEvent.detail === 2) {
				this.viewModel.toggleVisibility(element);
			}
		}));

		this.tableDisposables.add(this.table.onDidChangeSelection(e => this.viewModel.selectedEntry = e.elements[0]));

		this.tableDisposables.add(this.table.onDidBlur(() => {
			if (this.viewModel.shouldRefilter()) {
				this.viewModel.filter(this.searchWidget.getValue());
			}
		}));

		this.layout(this.element.clientHeight, this.element.clientWidth);
	}

	private filterModels(): void {
		this.delayedFiltering.trigger(() => {
			this.viewModel.filter(this.searchWidget.getValue());
		});
	}

	private async enableProvider(vendorId: string): Promise<void> {
		await this.languageModelsService.selectLanguageModels({ vendor: vendorId }, true);
		await this.viewModel.refresh();
	}

	public layout(height: number, width: number): void {
		width = width - 24;
		this.searchWidget.layout(new DOM.Dimension(width - this.searchActionsContainer.clientWidth - this.addButtonContainer.clientWidth - 8, 22));
		const tableHeight = height - 40;
		this.tableContainer.style.height = `${tableHeight}px`;
		this.table.layout(tableHeight, width);
	}

	public focusSearch(): void {
		this.searchWidget.focus();
	}

	public search(filter: string): void {
		this.focusSearch();
		this.searchWidget.setValue(filter);
	}

	public clearSearch(): void {
		this.searchWidget.setValue('');
	}

	public render(): void {
		if (this.viewModel.shouldRefilter()) {
			this.viewModel.filter(this.searchWidget.getValue());
		}
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatManagement/chatUsageWidget.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatManagement/chatUsageWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/chatUsageWidget.css';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { Emitter } from '../../../../../base/common/event.js';
import * as DOM from '../../../../../base/browser/dom.js';
import { localize } from '../../../../../nls.js';
import { IChatEntitlementService, IQuotaSnapshot } from '../../../../services/chat/common/chatEntitlementService.js';
import { language } from '../../../../../base/common/platform.js';
import { safeIntl } from '../../../../../base/common/date.js';

const $ = DOM.$;

export class ChatUsageWidget extends Disposable {

	private readonly _onDidChangeContentHeight = new Emitter<number>();
	readonly onDidChangeContentHeight = this._onDidChangeContentHeight.event;

	readonly element: HTMLElement;
	private usageSection!: HTMLElement;

	private readonly dateFormatter = safeIntl.DateTimeFormat(language, { year: 'numeric', month: 'long', day: 'numeric' });
	private readonly dateTimeFormatter = safeIntl.DateTimeFormat(language, { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' });

	constructor(
		@IChatEntitlementService private readonly chatEntitlementService: IChatEntitlementService
	) {
		super();

		this.element = DOM.$('.chat-usage-widget');
		this.create(this.element);
		this.render();

		// Update when quotas or entitlements change
		this._register(this.chatEntitlementService.onDidChangeQuotaRemaining(() => this.render()));
		this._register(this.chatEntitlementService.onDidChangeEntitlement(() => this.render()));
	}

	private create(container: HTMLElement): void {
		// Content container
		this.usageSection = DOM.append(container, $('.copilot-usage-section'));
	}

	private render(): void {
		DOM.clearNode(this.usageSection);

		const { chat: chatQuota, completions: completionsQuota, premiumChat: premiumChatQuota, resetDate, resetDateHasTime } = this.chatEntitlementService.quotas;

		// Anonymous Indicator - show limited quotas
		if (this.chatEntitlementService.anonymous && this.chatEntitlementService.sentiment.installed && !completionsQuota && !chatQuota && !premiumChatQuota) {
			this.renderLimitedQuotaItem(this.usageSection, localize('completionsLabel', 'Inline Suggestions'));
			this.renderLimitedQuotaItem(this.usageSection, localize('chatsLabel', 'Chat messages'));
		}
		// Copilot Usage section - show detailed breakdown of all quotas
		else if (completionsQuota || chatQuota || premiumChatQuota) {
			// Inline Suggestions
			if (completionsQuota) {
				this.renderQuotaItem(this.usageSection, localize('plan.inlineSuggestions', 'Inline Suggestions'), completionsQuota);
			}

			// Chat messages
			if (chatQuota) {
				this.renderQuotaItem(this.usageSection, localize('plan.chatMessages', 'Chat messages'), chatQuota);
			}

			// Premium requests
			if (premiumChatQuota) {
				this.renderQuotaItem(this.usageSection, localize('plan.premiumRequests', 'Premium requests'), premiumChatQuota);

				// Additional overage message
				if (premiumChatQuota.overageEnabled) {
					const overageMessage = DOM.append(this.usageSection, $('.overage-message'));
					overageMessage.textContent = localize('plan.additionalPaidEnabled', 'Additional paid premium requests enabled.');
				}
			}

			// Reset date
			if (resetDate) {
				const resetText = DOM.append(this.usageSection, $('.allowance-resets'));
				resetText.textContent = localize('plan.allowanceResets', 'Allowance resets {0}.', resetDateHasTime ? this.dateTimeFormatter.value.format(new Date(resetDate)) : this.dateFormatter.value.format(new Date(resetDate)));
			}
		}

		// Emit height change
		const height = this.element.offsetHeight || 400;
		this._onDidChangeContentHeight.fire(height);
	}

	private renderQuotaItem(container: HTMLElement, label: string, quota: IQuotaSnapshot): void {
		const quotaItem = DOM.append(container, $('.quota-item'));

		const quotaItemHeader = DOM.append(quotaItem, $('.quota-item-header'));
		const quotaItemLabel = DOM.append(quotaItemHeader, $('.quota-item-label'));
		quotaItemLabel.textContent = label;

		const quotaItemValue = DOM.append(quotaItemHeader, $('.quota-item-value'));
		if (quota.unlimited) {
			quotaItemValue.textContent = localize('plan.included', 'Included');
		} else {
			quotaItemValue.textContent = localize('plan.included', 'Included');
		}

		// Progress bar - using same structure as chat status
		const progressBarContainer = DOM.append(quotaItem, $('.quota-bar'));
		const progressBar = DOM.append(progressBarContainer, $('.quota-bit'));
		const percentageUsed = this.getQuotaPercentageUsed(quota);
		progressBar.style.width = percentageUsed + '%';

		// Apply warning/error classes based on usage
		if (percentageUsed >= 90) {
			quotaItem.classList.add('error');
		} else if (percentageUsed >= 75) {
			quotaItem.classList.add('warning');
		}
	}

	private getQuotaPercentageUsed(quota: IQuotaSnapshot): number {
		if (quota.unlimited) {
			return 0;
		}
		return Math.max(0, 100 - quota.percentRemaining);
	}

	private renderLimitedQuotaItem(container: HTMLElement, label: string): void {
		const quotaItem = DOM.append(container, $('.quota-item'));

		const quotaItemHeader = DOM.append(quotaItem, $('.quota-item-header'));
		const quotaItemLabel = DOM.append(quotaItemHeader, $('.quota-item-label'));
		quotaItemLabel.textContent = label;

		const quotaItemValue = DOM.append(quotaItemHeader, $('.quota-item-value'));
		quotaItemValue.textContent = localize('quotaLimited', 'Limited');

		// Progress bar - using same structure as chat status
		const progressBarContainer = DOM.append(quotaItem, $('.quota-bar'));
		DOM.append(progressBarContainer, $('.quota-bit'));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatManagement/media/chatManagementEditor.css]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatManagement/media/chatManagementEditor.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.ai-management-editor {
	height: 100%;
	overflow: hidden;
	max-width: 1200px;
	margin: 0 auto;
	display: flex;
	flex-direction: column;
}

.ai-models-management-editor {
	height: 100%;
	overflow: hidden;
	max-width: 1200px;
	margin: 0 auto;
	padding: 15px 0px 0px 24px;
}

/* Header - spans full width */
.ai-management-editor .ai-management-header {
	box-sizing: border-box;
	margin-left: 20px;
	padding: 10px 15px 5px 15px;
	border-bottom: 1px solid var(--vscode-settings-headerBorder);
	flex-shrink: 0;
}

/* Split view container - takes remaining space */
.ai-management-editor .split-view-container {
	flex: 1;
	min-height: 0;
	position: relative;
}

.ai-management-editor .sidebar-view,
.ai-management-editor .contents-view {
	height: 100%;
	overflow: hidden;
}

.ai-management-editor .contents-container {
	height: 100%;
	overflow: hidden;
}

.ai-management-editor .sidebar-container {
	padding-left: 20px;
	padding-top: 15px;
	height: 100%;
	overflow: hidden;
	box-sizing: border-box;
}

.ai-management-editor .sidebar-container .section-list-item {
	padding-left: 20px;
	display: flex;
	align-items: center;
}

.ai-management-editor .sidebar-container .section-list-item > .section-list-item-label {
	overflow: hidden;
	text-overflow: ellipsis;
}

.ai-management-editor .ai-management-body {
	padding: 15px;
	height: 100%;
	box-sizing: border-box;
}

.ai-management-editor .header-title-container {
	display: flex;
	align-items: end;
	justify-content: space-between;
	margin-bottom: 0;
}

.ai-management-editor .header-title-wrapper {
	display: flex;
	align-items: center;
	gap: 4px;
}

.ai-management-editor .ai-management-editor-title {
	font-size: 26px;
	font-weight: 600;
	color: var(--vscode-foreground);
}

.ai-management-editor .hide {
	display: none !important;
}

.ai-management-editor .plan-badge {
	padding: 4px 12px;
	border-radius: 12px;
	background-color: var(--vscode-badge-background);
	color: var(--vscode-badge-foreground);
	font-weight: 500;
	margin-left: 4px;
}

.ai-management-editor .header-upgrade-button-container {
	margin-left: auto;
}

.ai-management-editor .header-upgrade-button {
	white-space: nowrap;
}

/* Widget sections */
.ai-management-editor .ai-management-body > * {
	margin-bottom: 20px;
}

.ai-management-editor .ai-management-body > *:last-child {
	margin-bottom: 0;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatManagement/media/chatModelsWidget.css]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatManagement/media/chatModelsWidget.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.models-widget {
	padding-right: 24px;
}

/** Search and button container styling **/

.models-widget .models-search-and-button-container {
	display: flex;
	align-items: center;
	gap: 8px;
	margin-bottom: 12px;
}

.models-widget .models-search-container {
	flex: 1;
	position: relative;
}

.models-widget .models-search-container .models-search-actions {
	position: absolute;
	top: 0;
	right: 0;
	height: 100%;
	margin-right: 1px;
	display: flex;
	align-items: center;
}

.models-widget .models-search-container .models-search-actions .monaco-toolbar {
	height: 100%;
}

.models-widget .models-search-container .models-search-actions .action-label {
	padding: 3px;
	margin-left: 0;
	box-sizing: content-box;
}

.models-widget .models-search-and-button-container .section-title-actions .models-add-model-button {
	white-space: nowrap;
}

/** Table styling **/

.models-widget .models-table-container {
	width: 100%;
	border-spacing: 0;
	border-collapse: separate;
}

.models-widget .models-table-container .monaco-table-tr {
	cursor: default;
}

.models-widget .models-table-container .monaco-table-td {
	align-items: center;
	display: flex;
	overflow: hidden;
	padding-left: 10px;
}

.models-widget .models-table-container .monaco-table-td[data-col-index="1"] {
	padding-left: 8px;
}

.models-widget .models-table-container .monaco-table-th {
	padding-left: 10px;
	background-color: var(--vscode-keybindingTable-headerBackground);
}

.models-widget .models-table-container .monaco-table-th[data-col-index="1"] {
	padding-left: 8px;
}


/** Gutter column styling **/

.models-widget .models-table-container .monaco-table-tr.models-model-row.model-hidden .models-table-column.models-gutter-column {
	opacity: 1;
}

.models-widget .models-table-container .monaco-table-td .models-gutter-column .models-twistie {
	align-self: stretch;
}

.models-widget .models-table-container .monaco-list-row .monaco-table-tr.models-model-row .models-gutter-column .monaco-action-bar {
	display: none;
}

.models-widget .models-table-container .monaco-list-row.focused .monaco-table-tr.models-model-row .models-gutter-column .monaco-action-bar,
.models-widget .models-table-container .monaco-list-row.selected .monaco-table-tr.models-model-row .models-gutter-column .monaco-action-bar,
.models-widget .models-table-container .monaco-list-row:hover .monaco-table-tr.models-model-row .models-gutter-column .monaco-action-bar {
	display: inherit;
}

/** Model Name column styling **/

.models-widget .models-table-container .monaco-table-td .model-name-container {
	display: flex;
	align-items: center;
	gap: 6px;
	min-width: 0;
	width: 100%;
}

.models-widget .models-table-container .monaco-table-td .model-name-container .model-status-icon {
	flex-shrink: 0;
	margin-left: auto;
	margin-right: 4px;
}

.models-widget .models-table-container .monaco-table-td .model-name-container .model-name {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	flex: 0 1 auto;
}

/** Actions column styling **/

.models-widget .models-table-container .monaco-table-td .actions-column {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
}

.models-widget .models-table-container .monaco-table-td .actions-column .monaco-action-bar {
	margin-right: 9px;
}

/** Cost column styling **/

.models-widget .models-table-container .monaco-table-td .model-multiplier {
	overflow: hidden;
	text-overflow: ellipsis;
}

/** Token Limits column styling **/

.models-widget .models-table-container .monaco-table-td .model-token-limits {
	display: flex;
	gap: 12px;
	white-space: nowrap;
}

.models-widget .models-table-container .monaco-table-td .model-token-limits .token-limit-item {
	display: flex;
	align-items: center;
	gap: 4px;
	min-width: 48px;
}

.models-widget .models-table-container .monaco-table-td .model-token-limits .codicon {
	font-size: 12px;
}

/** Capabilities column styling **/

.models-widget .models-table-container .monaco-table-td .model-capabilities {
	display: flex;
	align-items: center;
	gap: 6px;
	flex-wrap: wrap;
}

.models-widget .models-table-container .monaco-table-td .model-capability {
	width: fit-content;
	padding: 0 6px;
	border-radius: 3px;
	font-size: 11px;
	color: var(--vscode-radio-inactiveForeground);
	background-color: var(--vscode-radio-inactiveBackground);
	border-color: var(--vscode-radio-inactiveBorder, transparent);
}

.models-widget .models-table-container .monaco-table-td .model-capability.active {
	background-color: var(--vscode-toolbar-hoverBackground);
	opacity: 0.8;
}

/** Vendor row styling **/

.models-widget .models-table-container .models-vendor-row {
	background-color: var(--vscode-keybindingTable-headerBackground);
	cursor: pointer;
}

.models-widget .models-table-container .monaco-table-tr:hover .models-vendor-row {
	background-color: var(--vscode-toolbar-hoverBackground);
}

.models-widget .models-table-container .models-vendor-row .model-name {
	font-weight: bold;
}

/** Model row styling **/

.models-widget .models-table-container .monaco-table-tr.models-model-row.model-hidden .models-table-column {
	opacity: 0.6;
}

/** Row alternating colors **/
.models-widget .models-table-container .monaco-table .monaco-list-row[data-parity=odd]:not(.focused):not(.selected):not(:hover) .monaco-table-tr:not(.models-vendor-row),
.models-widget .models-table-container .monaco-table .monaco-list:not(:focus) .monaco-list-row[data-parity=odd].focused:not(.selected):not(:hover) .monaco-table-tr:not(.models-vendor-row),
.models-widget .models-table-container .monaco-table .monaco-list:not(.focused) .monaco-list-row[data-parity=odd].focused:not(.selected):not(:hover) .monaco-table-tr:not(.models-vendor-row) {
	background-color: var(--vscode-editor-background);
}

/** Provider column styling **/

.models-widget .models-table-container .monaco-table-td .model-provider {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatManagement/media/chatUsageWidget.css]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatManagement/media/chatUsageWidget.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.chat-usage-widget .quota-item {
	margin-bottom: 12px;
}

.chat-usage-widget .quota-item-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 4px;
}

.chat-usage-widget .quota-item-label {
	color: var(--vscode-foreground);
}

.chat-usage-widget .quota-item-value {
	color: var(--vscode-descriptionForeground);
}

/* Progress bar - matching chat status implementation */
.chat-usage-widget .quota-item .quota-bar {
	width: 100%;
	height: 4px;
	background-color: var(--vscode-gauge-background);
	border-radius: 4px;
	border: 1px solid var(--vscode-gauge-border);
	margin: 4px 0;
}

.chat-usage-widget .quota-item .quota-bar .quota-bit {
	height: 100%;
	background-color: var(--vscode-gauge-foreground);
	border-radius: 4px;
	transition: width 0.3s ease;
}

.chat-usage-widget .quota-item.warning .quota-bar {
	background-color: var(--vscode-gauge-warningBackground);
}

.chat-usage-widget .quota-item.warning .quota-bar .quota-bit {
	background-color: var(--vscode-gauge-warningForeground);
}

.chat-usage-widget .quota-item.error .quota-bar {
	background-color: var(--vscode-gauge-errorBackground);
}

.chat-usage-widget .quota-item.error .quota-bar .quota-bit {
	background-color: var(--vscode-gauge-errorForeground);
}

.chat-usage-widget .overage-message {
	font-size: 13px;
	color: var(--vscode-foreground);
	margin-top: 12px;
	margin-bottom: 8px;
}

.chat-usage-widget .allowance-resets {
	font-size: 13px;
	color: var(--vscode-foreground);
	margin-top: 12px;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatSessions/chatSessionPickerActionItem.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatSessions/chatSessionPickerActionItem.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/chatSessionPickerActionItem.css';
import { IAction } from '../../../../../base/common/actions.js';
import { Event } from '../../../../../base/common/event.js';
import * as dom from '../../../../../base/browser/dom.js';
import { IActionWidgetService } from '../../../../../platform/actionWidget/browser/actionWidget.js';
import { IActionWidgetDropdownAction, IActionWidgetDropdownOptions } from '../../../../../platform/actionWidget/browser/actionWidgetDropdown.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { IKeybindingService } from '../../../../../platform/keybinding/common/keybinding.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { IChatEntitlementService } from '../../../../services/chat/common/chatEntitlementService.js';
import { ActionWidgetDropdownActionViewItem } from '../../../../../platform/actions/browser/actionWidgetDropdownActionViewItem.js';
import { IChatSessionProviderOptionGroup, IChatSessionProviderOptionItem } from '../../common/chatSessionsService.js';
import { IDisposable } from '../../../../../base/common/lifecycle.js';
import { renderLabelWithIcons, renderIcon } from '../../../../../base/browser/ui/iconLabel/iconLabels.js';
import { localize } from '../../../../../nls.js';


export interface IChatSessionPickerDelegate {
	readonly onDidChangeOption: Event<IChatSessionProviderOptionItem>;
	getCurrentOption(): IChatSessionProviderOptionItem | undefined;
	setOption(option: IChatSessionProviderOptionItem): void;
	getAllOptions(): IChatSessionProviderOptionItem[];
}

/**
 * Action view item for making an option selection for a contributed chat session
 * These options are provided by the relevant ChatSession Provider
 */
export class ChatSessionPickerActionItem extends ActionWidgetDropdownActionViewItem {
	currentOption: IChatSessionProviderOptionItem | undefined;
	constructor(
		action: IAction,
		initialState: { group: IChatSessionProviderOptionGroup; item: IChatSessionProviderOptionItem | undefined },
		private readonly delegate: IChatSessionPickerDelegate,
		@IActionWidgetService actionWidgetService: IActionWidgetService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@ICommandService commandService: ICommandService,
		@IChatEntitlementService chatEntitlementService: IChatEntitlementService,
		@IKeybindingService keybindingService: IKeybindingService,
		@ITelemetryService telemetryService: ITelemetryService,
	) {
		const { group, item } = initialState;
		const actionWithLabel: IAction = {
			...action,
			label: item?.name || group.name,
			tooltip: item?.description ?? group.description ?? group.name,
			run: () => { }
		};

		const sessionPickerActionWidgetOptions: Omit<IActionWidgetDropdownOptions, 'label' | 'labelRenderer'> = {
			actionProvider: {
				getActions: () => {
					// if locked, show the current option only
					const currentOption = this.delegate.getCurrentOption();
					if (currentOption?.locked) {
						return [{
							id: currentOption.id,
							enabled: false,
							icon: currentOption.icon,
							checked: true,
							class: undefined,
							description: undefined,
							tooltip: currentOption.description ?? currentOption.name,
							label: currentOption.name,
							run: () => { }
						} satisfies IActionWidgetDropdownAction];
					} else {
						return this.delegate.getAllOptions().map(optionItem => {
							const isCurrent = optionItem.id === this.delegate.getCurrentOption()?.id;
							return {
								id: optionItem.id,
								enabled: true,
								icon: optionItem.icon,
								checked: isCurrent,
								class: undefined,
								description: undefined,
								tooltip: optionItem.description ?? optionItem.name,
								label: optionItem.name,
								run: () => {
									this.delegate.setOption(optionItem);
								}
							} satisfies IActionWidgetDropdownAction;
						});
					}
				}
			},
			actionBarActionProvider: undefined,
		};

		super(actionWithLabel, sessionPickerActionWidgetOptions, actionWidgetService, keybindingService, contextKeyService);
		this.currentOption = item;

		this._register(this.delegate.onDidChangeOption(newOption => {
			this.currentOption = newOption;
			if (this.element) {
				this.renderLabel(this.element);
			}
		}));
	}
	protected override renderLabel(element: HTMLElement): IDisposable | null {
		const domChildren = [];
		element.classList.add('chat-session-option-picker');
		if (this.currentOption?.icon) {
			domChildren.push(renderIcon(this.currentOption.icon));
		}
		domChildren.push(dom.$('span.chat-session-option-label', undefined, this.currentOption?.name ?? localize('chat.sessionPicker.label', "Pick Option")));
		domChildren.push(...renderLabelWithIcons(`$(chevron-down)`));
		dom.reset(element, ...domChildren);
		this.setAriaLabelAttributes(element);
		return null;
	}

	override render(container: HTMLElement): void {
		super.render(container);
		container.classList.add('chat-sessionPicker-item');
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatSessions/media/chatSessionPickerActionItem.css]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatSessions/media/chatSessionPickerActionItem.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* .chat-session-option-picker {
	align-items: center;
} */

/* .chat-session-option-picker .chat-session-option-label {
	overflow: hidden;
	text-overflow: ellipsis;
}

.chat-session-option-picker */

.monaco-action-bar .action-item.chat-sessionPicker-item {
	overflow: hidden;
}

.monaco-action-bar .action-item .chat-session-option-picker {
	align-items: center;
	overflow: hidden;

	.chat-session-option-label {
		overflow: hidden;
		text-overflow: ellipsis;
	}

	span.codicon {
		font-size: 12px;
		margin-left: 2px;
	}

	span.codicon.codicon-chevron-down {
		font-size: 12px;
		margin-left: 2px;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatSetup/chatSetup.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatSetup/chatSetup.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import product from '../../../../../platform/product/common/product.js';

const defaultChat = {
	completionsRefreshTokenCommand: product.defaultChatAgent?.completionsRefreshTokenCommand ?? '',
	chatRefreshTokenCommand: product.defaultChatAgent?.chatRefreshTokenCommand ?? '',
};

export type InstallChatClassification = {
	owner: 'bpasero';
	comment: 'Provides insight into chat installation.';
	installResult: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether the extension was installed successfully, cancelled or failed to install.' };
	installDuration: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The duration it took to install the extension.' };
	signUpErrorCode: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The error code in case of an error signing up.' };
	provider: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The provider used for the chat installation.' };
};
export type InstallChatEvent = {
	installResult: 'installed' | 'alreadyInstalled' | 'cancelled' | 'failedInstall' | 'failedNotSignedIn' | 'failedSignUp' | 'failedNotTrusted' | 'failedNoSession' | 'failedMaybeLater' | 'failedEnterpriseSetup';
	installDuration: number;
	signUpErrorCode: number | undefined;
	provider: string | undefined;
};

export enum ChatSetupAnonymous {
	Disabled = 0,
	EnabledWithDialog = 1,
	EnabledWithoutDialog = 2
}

export enum ChatSetupStep {
	Initial = 1,
	SigningIn,
	Installing
}

export enum ChatSetupStrategy {
	Canceled = 0,
	DefaultSetup = 1,
	SetupWithoutEnterpriseProvider = 2,
	SetupWithEnterpriseProvider = 3,
	SetupWithGoogleProvider = 4,
	SetupWithAppleProvider = 5
}

export type ChatSetupResultValue = boolean /* success */ | undefined /* canceled */;

export interface IChatSetupResult {
	readonly success: ChatSetupResultValue;
	readonly dialogSkipped: boolean;
}

export function refreshTokens(commandService: ICommandService): void {
	// ugly, but we need to signal to the extension that entitlements changed
	commandService.executeCommand(defaultChat.completionsRefreshTokenCommand);
	commandService.executeCommand(defaultChat.chatRefreshTokenCommand);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatSetup/chatSetupContributions.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatSetup/chatSetupContributions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { WorkbenchActionExecutedClassification, WorkbenchActionExecutedEvent } from '../../../../../base/common/actions.js';
import { Event } from '../../../../../base/common/event.js';
import { Lazy } from '../../../../../base/common/lazy.js';
import { Disposable, DisposableStore, markAsSingleton, MutableDisposable } from '../../../../../base/common/lifecycle.js';
import Severity from '../../../../../base/common/severity.js';
import { equalsIgnoreCase } from '../../../../../base/common/strings.js';
import { URI } from '../../../../../base/common/uri.js';
import { ServicesAccessor } from '../../../../../editor/browser/editorExtensions.js';
import { ICodeEditorService } from '../../../../../editor/browser/services/codeEditorService.js';
import { EditorContextKeys } from '../../../../../editor/common/editorContextKeys.js';
import { localize, localize2 } from '../../../../../nls.js';
import { Action2, MenuId, MenuRegistry, registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { CommandsRegistry, ICommandService } from '../../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr, IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { IDialogService } from '../../../../../platform/dialogs/common/dialogs.js';
import { IEnvironmentService } from '../../../../../platform/environment/common/environment.js';
import { ExtensionIdentifier } from '../../../../../platform/extensions/common/extensions.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../../platform/log/common/log.js';
import { IMarkerService } from '../../../../../platform/markers/common/markers.js';
import { IOpenerService } from '../../../../../platform/opener/common/opener.js';
import product from '../../../../../platform/product/common/product.js';
import { IProductService } from '../../../../../platform/product/common/productService.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { IWorkbenchContribution } from '../../../../common/contributions.js';
import { IViewDescriptorService, ViewContainerLocation } from '../../../../common/views.js';
import { ChatEntitlement, ChatEntitlementContext, ChatEntitlementRequests, ChatEntitlementService, IChatEntitlementService, isProUser } from '../../../../services/chat/common/chatEntitlementService.js';
import { EnablementState, IWorkbenchExtensionEnablementService } from '../../../../services/extensionManagement/common/extensionManagement.js';
import { ExtensionUrlHandlerOverrideRegistry, IExtensionUrlHandlerOverride } from '../../../../services/extensions/browser/extensionUrlHandler.js';
import { IExtensionService } from '../../../../services/extensions/common/extensions.js';
import { IHostService } from '../../../../services/host/browser/host.js';
import { IWorkbenchLayoutService, Parts } from '../../../../services/layout/browser/layoutService.js';
import { ILifecycleService } from '../../../../services/lifecycle/common/lifecycle.js';
import { IPreferencesService } from '../../../../services/preferences/common/preferences.js';
import { IExtension, IExtensionsWorkbenchService } from '../../../extensions/common/extensions.js';
import { ChatContextKeys } from '../../common/chatContextKeys.js';
import { IChatModeService } from '../../common/chatModes.js';
import { ChatAgentLocation, ChatModeKind } from '../../common/constants.js';
import { CHAT_CATEGORY, CHAT_SETUP_ACTION_ID, CHAT_SETUP_SUPPORT_ANONYMOUS_ACTION_ID } from '../actions/chatActions.js';
import { ChatViewContainerId, IChatWidgetService } from '../chat.js';
import { chatViewsWelcomeRegistry } from '../viewsWelcome/chatViewsWelcome.js';
import { ChatSetupAnonymous } from './chatSetup.js';
import { ChatSetupController } from './chatSetupController.js';
import { AICodeActionsHelper, AINewSymbolNamesProvider, ChatCodeActionsProvider, SetupAgent } from './chatSetupProviders.js';
import { ChatSetup } from './chatSetupRunner.js';

const defaultChat = {
	chatExtensionId: product.defaultChatAgent?.chatExtensionId ?? '',
	manageOveragesUrl: product.defaultChatAgent?.manageOverageUrl ?? '',
	upgradePlanUrl: product.defaultChatAgent?.upgradePlanUrl ?? '',
	completionsRefreshTokenCommand: product.defaultChatAgent?.completionsRefreshTokenCommand ?? '',
	chatRefreshTokenCommand: product.defaultChatAgent?.chatRefreshTokenCommand ?? '',
};

export class ChatSetupContribution extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.chatSetup';

	constructor(
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IChatEntitlementService chatEntitlementService: ChatEntitlementService,
		@ILogService private readonly logService: ILogService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IWorkbenchExtensionEnablementService private readonly extensionEnablementService: IWorkbenchExtensionEnablementService,
		@IExtensionsWorkbenchService private readonly extensionsWorkbenchService: IExtensionsWorkbenchService,
		@IExtensionService private readonly extensionService: IExtensionService,
		@IEnvironmentService private readonly environmentService: IEnvironmentService,
	) {
		super();

		const context = chatEntitlementService.context?.value;
		const requests = chatEntitlementService.requests?.value;
		if (!context || !requests) {
			return; // disabled
		}

		const controller = new Lazy(() => this._register(this.instantiationService.createInstance(ChatSetupController, context, requests)));

		this.registerSetupAgents(context, controller);
		this.registerActions(context, requests, controller);
		this.registerUrlLinkHandler();
		this.checkExtensionInstallation(context);
	}

	private registerSetupAgents(context: ChatEntitlementContext, controller: Lazy<ChatSetupController>): void {
		const defaultAgentDisposables = markAsSingleton(new MutableDisposable()); // prevents flicker on window reload
		const vscodeAgentDisposables = markAsSingleton(new MutableDisposable());

		const renameProviderDisposables = markAsSingleton(new MutableDisposable());
		const codeActionsProviderDisposables = markAsSingleton(new MutableDisposable());

		const updateRegistration = () => {

			// Agent + Tools
			{
				if (!context.state.hidden && !context.state.disabled) {

					// Default Agents (always, even if installed to allow for speedy requests right on startup)
					if (!defaultAgentDisposables.value) {
						const disposables = defaultAgentDisposables.value = new DisposableStore();

						// Panel Agents
						const panelAgentDisposables = disposables.add(new DisposableStore());
						for (const mode of [ChatModeKind.Ask, ChatModeKind.Edit, ChatModeKind.Agent]) {
							const { agent, disposable } = SetupAgent.registerDefaultAgents(this.instantiationService, ChatAgentLocation.Chat, mode, context, controller);
							panelAgentDisposables.add(disposable);
							panelAgentDisposables.add(agent.onUnresolvableError(() => {
								const panelAgentHasGuidance = chatViewsWelcomeRegistry.get().some(descriptor => this.contextKeyService.contextMatchesRules(descriptor.when));
								if (panelAgentHasGuidance) {
									// An unresolvable error from our agent registrations means that
									// Chat is unhealthy for some reason. We clear our panel
									// registration to give Chat a chance to show a custom message
									// to the user from the views and stop pretending as if there was
									// a functional agent.
									this.logService.error('[chat setup] Unresolvable error from Chat agent registration, clearing registration.');
									panelAgentDisposables.dispose();
								}
							}));
						}

						// Inline Agents
						disposables.add(SetupAgent.registerDefaultAgents(this.instantiationService, ChatAgentLocation.Terminal, undefined, context, controller).disposable);
						disposables.add(SetupAgent.registerDefaultAgents(this.instantiationService, ChatAgentLocation.Notebook, undefined, context, controller).disposable);
						disposables.add(SetupAgent.registerDefaultAgents(this.instantiationService, ChatAgentLocation.EditorInline, undefined, context, controller).disposable);
					}

					// Built-In Agent + Tool (unless installed, signed-in and enabled)
					if ((!context.state.installed || context.state.entitlement === ChatEntitlement.Unknown || context.state.entitlement === ChatEntitlement.Unresolved) && !vscodeAgentDisposables.value) {
						const disposables = vscodeAgentDisposables.value = new DisposableStore();
						disposables.add(SetupAgent.registerBuiltInAgents(this.instantiationService, context, controller));
					}
				} else {
					defaultAgentDisposables.clear();
					vscodeAgentDisposables.clear();
				}

				if (context.state.installed && !context.state.disabled) {
					vscodeAgentDisposables.clear(); // we need to do this to prevent showing duplicate agent/tool entries in the list
				}
			}

			// Rename Provider
			{
				if (!context.state.installed && !context.state.hidden && !context.state.disabled) {
					if (!renameProviderDisposables.value) {
						renameProviderDisposables.value = AINewSymbolNamesProvider.registerProvider(this.instantiationService, context, controller);
					}
				} else {
					renameProviderDisposables.clear();
				}
			}

			// Code Actions Provider
			{
				if (!context.state.installed && !context.state.hidden && !context.state.disabled) {
					if (!codeActionsProviderDisposables.value) {
						codeActionsProviderDisposables.value = ChatCodeActionsProvider.registerProvider(this.instantiationService);
					}
				} else {
					codeActionsProviderDisposables.clear();
				}
			}
		};

		this._register(Event.runAndSubscribe(context.onDidChange, () => updateRegistration()));
	}

	private registerActions(context: ChatEntitlementContext, requests: ChatEntitlementRequests, controller: Lazy<ChatSetupController>): void {

		//#region Global Chat Setup Actions

		class ChatSetupTriggerAction extends Action2 {

			static CHAT_SETUP_ACTION_LABEL = localize2('triggerChatSetup', "Use AI Features with Copilot for free...");

			constructor() {
				super({
					id: CHAT_SETUP_ACTION_ID,
					title: ChatSetupTriggerAction.CHAT_SETUP_ACTION_LABEL,
					category: CHAT_CATEGORY,
					f1: true,
					precondition: ContextKeyExpr.or(
						ChatContextKeys.Setup.hidden,
						ChatContextKeys.Setup.disabled,
						ChatContextKeys.Setup.untrusted,
						ChatContextKeys.Setup.installed.negate(),
						ChatContextKeys.Entitlement.canSignUp
					)
				});
			}

			override async run(accessor: ServicesAccessor, mode?: ChatModeKind | string, options?: { forceSignInDialog?: boolean; additionalScopes?: readonly string[]; forceAnonymous?: ChatSetupAnonymous; inputValue?: string }): Promise<boolean> {
				const widgetService = accessor.get(IChatWidgetService);
				const instantiationService = accessor.get(IInstantiationService);
				const dialogService = accessor.get(IDialogService);
				const commandService = accessor.get(ICommandService);
				const lifecycleService = accessor.get(ILifecycleService);
				const configurationService = accessor.get(IConfigurationService);

				await context.update({ hidden: false });
				configurationService.updateValue(ChatTeardownContribution.CHAT_DISABLED_CONFIGURATION_KEY, false);

				if (mode) {
					const chatWidget = await widgetService.revealWidget();
					chatWidget?.input.setChatMode(mode);
				}

				if (options?.inputValue) {
					const chatWidget = await widgetService.revealWidget();
					chatWidget?.setInput(options.inputValue);
				}

				const setup = ChatSetup.getInstance(instantiationService, context, controller);
				const { success } = await setup.run(options);
				if (success === false && !lifecycleService.willShutdown) {
					const { confirmed } = await dialogService.confirm({
						type: Severity.Error,
						message: localize('setupErrorDialog', "Chat setup failed. Would you like to try again?"),
						primaryButton: localize('retry', "Retry"),
					});

					if (confirmed) {
						return Boolean(await commandService.executeCommand(CHAT_SETUP_ACTION_ID, mode, options));
					}
				}

				return Boolean(success);
			}
		}

		class ChatSetupTriggerSupportAnonymousAction extends Action2 {

			constructor() {
				super({
					id: CHAT_SETUP_SUPPORT_ANONYMOUS_ACTION_ID,
					title: ChatSetupTriggerAction.CHAT_SETUP_ACTION_LABEL
				});
			}

			override async run(accessor: ServicesAccessor): Promise<unknown> {
				const commandService = accessor.get(ICommandService);
				const telemetryService = accessor.get(ITelemetryService);
				const chatEntitlementService = accessor.get(IChatEntitlementService);

				telemetryService.publicLog2<WorkbenchActionExecutedEvent, WorkbenchActionExecutedClassification>('workbenchActionExecuted', { id: CHAT_SETUP_ACTION_ID, from: 'api' });

				return commandService.executeCommand(CHAT_SETUP_ACTION_ID, undefined, {
					forceAnonymous: chatEntitlementService.anonymous ? ChatSetupAnonymous.EnabledWithDialog : undefined
				});
			}
		}

		class ChatSetupTriggerForceSignInDialogAction extends Action2 {

			constructor() {
				super({
					id: 'workbench.action.chat.triggerSetupForceSignIn',
					title: localize2('forceSignIn', "Sign in to use AI features")
				});
			}

			override async run(accessor: ServicesAccessor): Promise<unknown> {
				const commandService = accessor.get(ICommandService);
				const telemetryService = accessor.get(ITelemetryService);

				telemetryService.publicLog2<WorkbenchActionExecutedEvent, WorkbenchActionExecutedClassification>('workbenchActionExecuted', { id: CHAT_SETUP_ACTION_ID, from: 'api' });

				return commandService.executeCommand(CHAT_SETUP_ACTION_ID, undefined, { forceSignInDialog: true });
			}
		}

		class ChatSetupTriggerAnonymousWithoutDialogAction extends Action2 {

			constructor() {
				super({
					id: 'workbench.action.chat.triggerSetupAnonymousWithoutDialog',
					title: ChatSetupTriggerAction.CHAT_SETUP_ACTION_LABEL
				});
			}

			override async run(accessor: ServicesAccessor): Promise<unknown> {
				const commandService = accessor.get(ICommandService);
				const telemetryService = accessor.get(ITelemetryService);

				telemetryService.publicLog2<WorkbenchActionExecutedEvent, WorkbenchActionExecutedClassification>('workbenchActionExecuted', { id: CHAT_SETUP_ACTION_ID, from: 'api' });

				return commandService.executeCommand(CHAT_SETUP_ACTION_ID, undefined, { forceAnonymous: ChatSetupAnonymous.EnabledWithoutDialog });
			}
		}

		class ChatSetupFromAccountsAction extends Action2 {

			constructor() {
				super({
					id: 'workbench.action.chat.triggerSetupFromAccounts',
					title: localize2('triggerChatSetupFromAccounts', "Sign in to use AI features..."),
					menu: {
						id: MenuId.AccountsContext,
						group: '2_copilot',
						when: ContextKeyExpr.and(
							ChatContextKeys.Setup.hidden.negate(),
							ChatContextKeys.Setup.installed.negate(),
							ChatContextKeys.Entitlement.signedOut
						)
					}
				});
			}

			override async run(accessor: ServicesAccessor): Promise<void> {
				const commandService = accessor.get(ICommandService);
				const telemetryService = accessor.get(ITelemetryService);

				telemetryService.publicLog2<WorkbenchActionExecutedEvent, WorkbenchActionExecutedClassification>('workbenchActionExecuted', { id: CHAT_SETUP_ACTION_ID, from: 'accounts' });

				return commandService.executeCommand(CHAT_SETUP_ACTION_ID);
			}
		}

		const windowFocusListener = this._register(new MutableDisposable());
		class UpgradePlanAction extends Action2 {
			constructor() {
				super({
					id: 'workbench.action.chat.upgradePlan',
					title: localize2('managePlan', "Upgrade to GitHub Copilot Pro"),
					category: localize2('chat.category', 'Chat'),
					f1: true,
					precondition: ContextKeyExpr.and(
						ChatContextKeys.Setup.hidden.negate(),
						ContextKeyExpr.or(
							ChatContextKeys.Entitlement.canSignUp,
							ChatContextKeys.Entitlement.planFree
						)
					),
					menu: {
						id: MenuId.ChatTitleBarMenu,
						group: 'a_first',
						order: 1,
						when: ContextKeyExpr.and(
							ChatContextKeys.Entitlement.planFree,
							ContextKeyExpr.or(
								ChatContextKeys.chatQuotaExceeded,
								ChatContextKeys.completionsQuotaExceeded
							)
						)
					}
				});
			}

			override async run(accessor: ServicesAccessor): Promise<void> {
				const openerService = accessor.get(IOpenerService);
				const hostService = accessor.get(IHostService);
				const commandService = accessor.get(ICommandService);

				openerService.open(URI.parse(defaultChat.upgradePlanUrl));

				const entitlement = context.state.entitlement;
				if (!isProUser(entitlement)) {
					// If the user is not yet Pro, we listen to window focus to refresh the token
					// when the user has come back to the window assuming the user signed up.
					windowFocusListener.value = hostService.onDidChangeFocus(focus => this.onWindowFocus(focus, commandService));
				}
			}

			private async onWindowFocus(focus: boolean, commandService: ICommandService): Promise<void> {
				if (focus) {
					windowFocusListener.clear();

					const entitlements = await requests.forceResolveEntitlement(undefined);
					if (entitlements?.entitlement && isProUser(entitlements?.entitlement)) {
						refreshTokens(commandService);
					}
				}
			}
		}

		class EnableOveragesAction extends Action2 {
			constructor() {
				super({
					id: 'workbench.action.chat.manageOverages',
					title: localize2('manageOverages', "Manage GitHub Copilot Overages"),
					category: localize2('chat.category', 'Chat'),
					f1: true,
					precondition: ContextKeyExpr.and(
						ChatContextKeys.Setup.hidden.negate(),
						ContextKeyExpr.or(
							ChatContextKeys.Entitlement.planPro,
							ChatContextKeys.Entitlement.planProPlus,
						)
					),
					menu: {
						id: MenuId.ChatTitleBarMenu,
						group: 'a_first',
						order: 1,
						when: ContextKeyExpr.and(
							ContextKeyExpr.or(
								ChatContextKeys.Entitlement.planPro,
								ChatContextKeys.Entitlement.planProPlus,
							),
							ContextKeyExpr.or(
								ChatContextKeys.chatQuotaExceeded,
								ChatContextKeys.completionsQuotaExceeded
							)
						)
					}
				});
			}

			override async run(accessor: ServicesAccessor): Promise<void> {
				const openerService = accessor.get(IOpenerService);
				openerService.open(URI.parse(defaultChat.manageOveragesUrl));
			}
		}

		registerAction2(ChatSetupTriggerAction);
		registerAction2(ChatSetupTriggerForceSignInDialogAction);
		registerAction2(ChatSetupFromAccountsAction);
		registerAction2(ChatSetupTriggerAnonymousWithoutDialogAction);
		registerAction2(ChatSetupTriggerSupportAnonymousAction);
		registerAction2(UpgradePlanAction);
		registerAction2(EnableOveragesAction);

		//#endregion

		//#region Editor Context Menu

		function registerGenerateCodeCommand(coreCommand: 'chat.internal.explain' | 'chat.internal.fix' | 'chat.internal.review' | 'chat.internal.generateDocs' | 'chat.internal.generateTests', actualCommand: string): void {

			CommandsRegistry.registerCommand(coreCommand, async accessor => {
				const commandService = accessor.get(ICommandService);
				const codeEditorService = accessor.get(ICodeEditorService);
				const markerService = accessor.get(IMarkerService);

				switch (coreCommand) {
					case 'chat.internal.explain':
					case 'chat.internal.fix': {
						const textEditor = codeEditorService.getActiveCodeEditor();
						const uri = textEditor?.getModel()?.uri;
						const range = textEditor?.getSelection();
						if (!uri || !range) {
							return;
						}

						const markers = AICodeActionsHelper.warningOrErrorMarkersAtRange(markerService, uri, range);

						const actualCommand = coreCommand === 'chat.internal.explain'
							? AICodeActionsHelper.explainMarkers(markers)
							: AICodeActionsHelper.fixMarkers(markers, range);

						await commandService.executeCommand(actualCommand.id, ...(actualCommand.arguments ?? []));

						break;
					}
					case 'chat.internal.review':
					case 'chat.internal.generateDocs':
					case 'chat.internal.generateTests': {
						const result = await commandService.executeCommand(CHAT_SETUP_SUPPORT_ANONYMOUS_ACTION_ID);
						if (result) {
							await commandService.executeCommand(actualCommand);
						}
					}
				}
			});
		}
		registerGenerateCodeCommand('chat.internal.explain', 'github.copilot.chat.explain');
		registerGenerateCodeCommand('chat.internal.fix', 'github.copilot.chat.fix');
		registerGenerateCodeCommand('chat.internal.review', 'github.copilot.chat.review');
		registerGenerateCodeCommand('chat.internal.generateDocs', 'github.copilot.chat.generateDocs');
		registerGenerateCodeCommand('chat.internal.generateTests', 'github.copilot.chat.generateTests');

		const internalGenerateCodeContext = ContextKeyExpr.and(
			ChatContextKeys.Setup.hidden.negate(),
			ChatContextKeys.Setup.disabled.negate(),
			ChatContextKeys.Setup.installed.negate(),
		);

		MenuRegistry.appendMenuItem(MenuId.EditorContext, {
			command: {
				id: 'chat.internal.explain',
				title: localize('explain', "Explain"),
			},
			group: '1_chat',
			order: 4,
			when: internalGenerateCodeContext
		});

		MenuRegistry.appendMenuItem(MenuId.ChatTextEditorMenu, {
			command: {
				id: 'chat.internal.fix',
				title: localize('fix', "Fix"),
			},
			group: '1_action',
			order: 1,
			when: ContextKeyExpr.and(
				internalGenerateCodeContext,
				EditorContextKeys.readOnly.negate()
			)
		});

		MenuRegistry.appendMenuItem(MenuId.ChatTextEditorMenu, {
			command: {
				id: 'chat.internal.review',
				title: localize('review', "Code Review"),
			},
			group: '1_action',
			order: 2,
			when: internalGenerateCodeContext
		});

		MenuRegistry.appendMenuItem(MenuId.ChatTextEditorMenu, {
			command: {
				id: 'chat.internal.generateDocs',
				title: localize('generateDocs', "Generate Docs"),
			},
			group: '2_generate',
			order: 1,
			when: ContextKeyExpr.and(
				internalGenerateCodeContext,
				EditorContextKeys.readOnly.negate()
			)
		});

		MenuRegistry.appendMenuItem(MenuId.ChatTextEditorMenu, {
			command: {
				id: 'chat.internal.generateTests',
				title: localize('generateTests', "Generate Tests"),
			},
			group: '2_generate',
			order: 2,
			when: ContextKeyExpr.and(
				internalGenerateCodeContext,
				EditorContextKeys.readOnly.negate()
			)
		});
	}

	private registerUrlLinkHandler(): void {
		this._register(ExtensionUrlHandlerOverrideRegistry.registerHandler(this.instantiationService.createInstance(ChatSetupExtensionUrlHandler)));
	}

	private async checkExtensionInstallation(context: ChatEntitlementContext): Promise<void> {

		// When developing extensions, await registration and then check
		if (this.environmentService.isExtensionDevelopment) {
			await this.extensionService.whenInstalledExtensionsRegistered();
			if (this.extensionService.extensions.find(ext => ExtensionIdentifier.equals(ext.identifier, defaultChat.chatExtensionId))) {
				context.update({ installed: true, disabled: false, untrusted: false });
				return;
			}
		}

		// Await extensions to be ready to be queried
		await this.extensionsWorkbenchService.queryLocal();

		// Listen to extensions change and process extensions once
		this._register(Event.runAndSubscribe<IExtension | undefined>(this.extensionsWorkbenchService.onChange, e => {
			if (e && !ExtensionIdentifier.equals(e.identifier.id, defaultChat.chatExtensionId)) {
				return; // unrelated event
			}

			const defaultChatExtension = this.extensionsWorkbenchService.local.find(value => ExtensionIdentifier.equals(value.identifier.id, defaultChat.chatExtensionId));
			const installed = !!defaultChatExtension?.local;

			let disabled: boolean;
			let untrusted = false;
			if (installed) {
				disabled = !this.extensionEnablementService.isEnabled(defaultChatExtension.local);
				if (disabled) {
					const state = this.extensionEnablementService.getEnablementState(defaultChatExtension.local);
					if (state === EnablementState.DisabledByTrustRequirement) {
						disabled = false; // not disabled by user choice but
						untrusted = true; // by missing workspace trust
					}
				}
			} else {
				disabled = false;
			}

			context.update({ installed, disabled, untrusted });
		}));
	}
}

class ChatSetupExtensionUrlHandler implements IExtensionUrlHandlerOverride {
	constructor(
		@IProductService private readonly productService: IProductService,
		@ICommandService private readonly commandService: ICommandService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IChatModeService private readonly chatModeService: IChatModeService,
	) { }

	canHandleURL(url: URI): boolean {
		return url.scheme === this.productService.urlProtocol && equalsIgnoreCase(url.authority, defaultChat.chatExtensionId);
	}

	async handleURL(url: URI): Promise<boolean> {
		const params = new URLSearchParams(url.query);
		this.telemetryService.publicLog2<WorkbenchActionExecutedEvent, WorkbenchActionExecutedClassification>('workbenchActionExecuted', { id: CHAT_SETUP_ACTION_ID, from: 'url', detail: params.get('referrer') ?? undefined });

		const agentParam = params.get('agent') ?? params.get('mode');
		const inputParam = params.get('prompt');
		if (!agentParam && !inputParam) {
			return false;
		}

		const agentId = agentParam ? this.resolveAgentId(agentParam) : undefined;
		await this.commandService.executeCommand(CHAT_SETUP_ACTION_ID, agentId, inputParam ? { inputValue: inputParam } : undefined);
		return true;
	}

	private resolveAgentId(agentParam: string): string | undefined {
		const agents = this.chatModeService.getModes();
		const allAgents = [...agents.builtin, ...agents.custom];

		const foundAgent = allAgents.find(agent => agent.id === agentParam);
		if (foundAgent) {
			return foundAgent.id;
		}

		const nameLower = agentParam.toLowerCase();
		const agentByName = allAgents.find(agent => agent.name.get().toLowerCase() === nameLower);
		return agentByName?.id;
	}
}

export class ChatTeardownContribution extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.chatTeardown';

	static readonly CHAT_DISABLED_CONFIGURATION_KEY = 'chat.disableAIFeatures';

	constructor(
		@IChatEntitlementService chatEntitlementService: ChatEntitlementService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IExtensionsWorkbenchService private readonly extensionsWorkbenchService: IExtensionsWorkbenchService,
		@IWorkbenchExtensionEnablementService private readonly extensionEnablementService: IWorkbenchExtensionEnablementService,
		@IViewDescriptorService private readonly viewDescriptorService: IViewDescriptorService,
		@IWorkbenchLayoutService private readonly layoutService: IWorkbenchLayoutService
	) {
		super();

		const context = chatEntitlementService.context?.value;
		if (!context) {
			return; // disabled
		}

		this.registerListeners();
		this.registerActions();

		this.handleChatDisabled(false);
	}

	private handleChatDisabled(fromEvent: boolean): void {
		const chatDisabled = this.configurationService.inspect(ChatTeardownContribution.CHAT_DISABLED_CONFIGURATION_KEY);
		if (chatDisabled.value === true) {
			this.maybeEnableOrDisableExtension(typeof chatDisabled.workspaceValue === 'boolean' ? EnablementState.DisabledWorkspace : EnablementState.DisabledGlobally);
			if (fromEvent) {
				this.maybeHideAuxiliaryBar();
			}
		} else if (chatDisabled.value === false && fromEvent /* do not enable extensions unless its an explicit settings change */) {
			this.maybeEnableOrDisableExtension(typeof chatDisabled.workspaceValue === 'boolean' ? EnablementState.EnabledWorkspace : EnablementState.EnabledGlobally);
		}
	}

	private async registerListeners(): Promise<void> {

		// Configuration changes
		this._register(this.configurationService.onDidChangeConfiguration(e => {
			if (!e.affectsConfiguration(ChatTeardownContribution.CHAT_DISABLED_CONFIGURATION_KEY)) {
				return;
			}

			this.handleChatDisabled(true);
		}));

		// Extension installation
		await this.extensionsWorkbenchService.queryLocal();
		this._register(this.extensionsWorkbenchService.onChange(e => {
			if (e && !ExtensionIdentifier.equals(e.identifier.id, defaultChat.chatExtensionId)) {
				return; // unrelated event
			}

			const defaultChatExtension = this.extensionsWorkbenchService.local.find(value => ExtensionIdentifier.equals(value.identifier.id, defaultChat.chatExtensionId));
			if (defaultChatExtension?.local && this.extensionEnablementService.isEnabled(defaultChatExtension.local)) {
				this.configurationService.updateValue(ChatTeardownContribution.CHAT_DISABLED_CONFIGURATION_KEY, false);
			}
		}));
	}

	private async maybeEnableOrDisableExtension(state: EnablementState.EnabledGlobally | EnablementState.EnabledWorkspace | EnablementState.DisabledGlobally | EnablementState.DisabledWorkspace): Promise<void> {
		const defaultChatExtension = this.extensionsWorkbenchService.local.find(value => ExtensionIdentifier.equals(value.identifier.id, defaultChat.chatExtensionId));
		if (!defaultChatExtension) {
			return;
		}

		await this.extensionsWorkbenchService.setEnablement([defaultChatExtension], state);
		await this.extensionsWorkbenchService.updateRunningExtensions(state === EnablementState.EnabledGlobally || state === EnablementState.EnabledWorkspace ? localize('restartExtensionHost.reason.enable', "Enabling AI features") : localize('restartExtensionHost.reason.disable', "Disabling AI features"));
	}

	private maybeHideAuxiliaryBar(): void {
		const activeContainers = this.viewDescriptorService.getViewContainersByLocation(ViewContainerLocation.AuxiliaryBar).filter(
			container => this.viewDescriptorService.getViewContainerModel(container).activeViewDescriptors.length > 0
		);
		if (
			(activeContainers.length === 0) ||  													// chat view is already gone but we know it was there before
			(activeContainers.length === 1 && activeContainers.at(0)?.id === ChatViewContainerId) 	// chat view is the only view which is going to go away
		) {
			this.layoutService.setPartHidden(true, Parts.AUXILIARYBAR_PART); // hide if there are no views in the secondary sidebar
		}
	}

	private registerActions(): void {

		class ChatSetupHideAction extends Action2 {

			static readonly ID = 'workbench.action.chat.hideSetup';
			static readonly TITLE = localize2('hideChatSetup', "Learn How to Hide AI Features");

			constructor() {
				super({
					id: ChatSetupHideAction.ID,
					title: ChatSetupHideAction.TITLE,
					f1: true,
					category: CHAT_CATEGORY,
					precondition: ChatContextKeys.Setup.hidden.negate(),
					menu: {
						id: MenuId.ChatTitleBarMenu,
						group: 'z_hide',
						order: 1,
						when: ChatContextKeys.Setup.installed.negate()
					}
				});
			}

			override async run(accessor: ServicesAccessor): Promise<void> {
				const preferencesService = accessor.get(IPreferencesService);

				preferencesService.openSettings({ jsonEditor: false, query: `@id:${ChatTeardownContribution.CHAT_DISABLED_CONFIGURATION_KEY}` });
			}
		}

		registerAction2(ChatSetupHideAction);
	}
}

//#endregion

export function refreshTokens(commandService: ICommandService): void {
	// ugly, but we need to signal to the extension that entitlements changed
	commandService.executeCommand(defaultChat.completionsRefreshTokenCommand);
	commandService.executeCommand(defaultChat.chatRefreshTokenCommand);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatSetup/chatSetupController.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatSetup/chatSetupController.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { toErrorMessage } from '../../../../../base/common/errorMessage.js';
import { isCancellationError } from '../../../../../base/common/errors.js';
import { Emitter } from '../../../../../base/common/event.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import Severity from '../../../../../base/common/severity.js';
import { StopWatch } from '../../../../../base/common/stopwatch.js';
import { isObject } from '../../../../../base/common/types.js';
import { localize } from '../../../../../nls.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { ConfigurationTarget, IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { Extensions as ConfigurationExtensions, IConfigurationRegistry } from '../../../../../platform/configuration/common/configurationRegistry.js';
import { IDialogService } from '../../../../../platform/dialogs/common/dialogs.js';
import { ILogService } from '../../../../../platform/log/common/log.js';
import product from '../../../../../platform/product/common/product.js';
import { IProductService } from '../../../../../platform/product/common/productService.js';
import { IProgressService, ProgressLocation } from '../../../../../platform/progress/common/progress.js';
import { IQuickInputService } from '../../../../../platform/quickinput/common/quickInput.js';
import { Registry } from '../../../../../platform/registry/common/platform.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { IActivityService, ProgressBadge } from '../../../../services/activity/common/activity.js';
import { AuthenticationSession, IAuthenticationService } from '../../../../services/authentication/common/authentication.js';
import { ILifecycleService } from '../../../../services/lifecycle/common/lifecycle.js';
import { IExtensionsWorkbenchService } from '../../../extensions/common/extensions.js';
import { ChatEntitlement, ChatEntitlementContext, ChatEntitlementRequests, isProUser } from '../../../../services/chat/common/chatEntitlementService.js';
import { CHAT_OPEN_ACTION_ID } from '../actions/chatActions.js';
import { ChatViewId, ChatViewContainerId } from '../chat.js';
import { ChatSetupAnonymous, ChatSetupStep, ChatSetupResultValue, InstallChatEvent, InstallChatClassification, refreshTokens } from './chatSetup.js';

const defaultChat = {
	chatExtensionId: product.defaultChatAgent?.chatExtensionId ?? '',
	provider: product.defaultChatAgent?.provider ?? { default: { id: '', name: '' }, enterprise: { id: '', name: '' }, apple: { id: '', name: '' }, google: { id: '', name: '' } },
	providerUriSetting: product.defaultChatAgent?.providerUriSetting ?? '',
	completionsAdvancedSetting: product.defaultChatAgent?.completionsAdvancedSetting ?? '',
};

export interface IChatSetupControllerOptions {
	readonly forceSignIn?: boolean;
	readonly useSocialProvider?: string;
	readonly useEnterpriseProvider?: boolean;
	readonly additionalScopes?: readonly string[];
	readonly forceAnonymous?: ChatSetupAnonymous;
}

export class ChatSetupController extends Disposable {

	private readonly _onDidChange = this._register(new Emitter<void>());
	readonly onDidChange = this._onDidChange.event;

	private _step = ChatSetupStep.Initial;
	get step(): ChatSetupStep { return this._step; }

	constructor(
		private readonly context: ChatEntitlementContext,
		private readonly requests: ChatEntitlementRequests,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IAuthenticationService private readonly authenticationService: IAuthenticationService,
		@IExtensionsWorkbenchService private readonly extensionsWorkbenchService: IExtensionsWorkbenchService,
		@IProductService private readonly productService: IProductService,
		@ILogService private readonly logService: ILogService,
		@IProgressService private readonly progressService: IProgressService,
		@IActivityService private readonly activityService: IActivityService,
		@ICommandService private readonly commandService: ICommandService,
		@IDialogService private readonly dialogService: IDialogService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@ILifecycleService private readonly lifecycleService: ILifecycleService,
		@IQuickInputService private readonly quickInputService: IQuickInputService,
	) {
		super();

		this.registerListeners();
	}

	private registerListeners(): void {
		this._register(this.context.onDidChange(() => this._onDidChange.fire()));
	}

	private setStep(step: ChatSetupStep): void {
		if (this._step === step) {
			return;
		}

		this._step = step;
		this._onDidChange.fire();
	}

	async setup(options: IChatSetupControllerOptions = {}): Promise<ChatSetupResultValue> {
		const watch = new StopWatch(false);
		const title = localize('setupChatProgress', "Getting chat ready...");
		const badge = this.activityService.showViewContainerActivity(ChatViewContainerId, {
			badge: new ProgressBadge(() => title),
		});

		try {
			return await this.progressService.withProgress({
				location: ProgressLocation.Window,
				command: CHAT_OPEN_ACTION_ID,
				title,
			}, () => this.doSetup(options, watch));
		} finally {
			badge.dispose();
		}
	}

	private async doSetup(options: IChatSetupControllerOptions, watch: StopWatch): Promise<ChatSetupResultValue> {
		this.context.suspend();  // reduces flicker

		let success: ChatSetupResultValue = false;
		try {
			const providerId = ChatEntitlementRequests.providerId(this.configurationService);
			let session: AuthenticationSession | undefined;
			let entitlement: ChatEntitlement | undefined;

			let signIn: boolean;
			if (options.forceSignIn) {
				signIn = true; // forced to sign in
			} else if (this.context.state.entitlement === ChatEntitlement.Unknown) {
				if (options.forceAnonymous) {
					signIn = false; // forced to anonymous without sign in
				} else {
					signIn = true; // sign in since we are signed out
				}
			} else {
				signIn = false; // already signed in
			}

			if (signIn) {
				this.setStep(ChatSetupStep.SigningIn);
				const result = await this.signIn(options);
				if (!result.session) {
					this.doInstall(); // still install the extension in the background to remind the user to sign-in eventually

					const provider = options.useSocialProvider ?? (options.useEnterpriseProvider ? defaultChat.provider.enterprise.id : defaultChat.provider.default.id);
					this.telemetryService.publicLog2<InstallChatEvent, InstallChatClassification>('commandCenter.chatInstall', { installResult: 'failedNotSignedIn', installDuration: watch.elapsed(), signUpErrorCode: undefined, provider });
					return undefined; // treat as cancelled because signing in already triggers an error dialog
				}

				session = result.session;
				entitlement = result.entitlement;
			}

			// Await Install
			this.setStep(ChatSetupStep.Installing);
			success = await this.install(session, entitlement ?? this.context.state.entitlement, providerId, watch, options);
		} finally {
			this.setStep(ChatSetupStep.Initial);
			this.context.resume();
		}

		return success;
	}

	private async signIn(options: IChatSetupControllerOptions): Promise<{ session: AuthenticationSession | undefined; entitlement: ChatEntitlement | undefined }> {
		let session: AuthenticationSession | undefined;
		let entitlements;
		try {
			({ session, entitlements } = await this.requests.signIn(options));
		} catch (e) {
			this.logService.error(`[chat setup] signIn: error ${e}`);
		}

		if (!session && !this.lifecycleService.willShutdown) {
			const { confirmed } = await this.dialogService.confirm({
				type: Severity.Error,
				message: localize('unknownSignInError', "Failed to sign in to {0}. Would you like to try again?", ChatEntitlementRequests.providerId(this.configurationService) === defaultChat.provider.enterprise.id ? defaultChat.provider.enterprise.name : defaultChat.provider.default.name),
				detail: localize('unknownSignInErrorDetail', "You must be signed in to use AI features."),
				primaryButton: localize('retry', "Retry")
			});

			if (confirmed) {
				return this.signIn(options);
			}
		}

		return { session, entitlement: entitlements?.entitlement };
	}

	private async install(session: AuthenticationSession | undefined, entitlement: ChatEntitlement, providerId: string, watch: StopWatch, options: IChatSetupControllerOptions): Promise<ChatSetupResultValue> {
		const wasRunning = this.context.state.installed && !this.context.state.disabled;
		let signUpResult: boolean | { errorCode: number } | undefined = undefined;

		let provider: string;
		if (options.forceAnonymous && entitlement === ChatEntitlement.Unknown) {
			provider = 'anonymous';
		} else {
			provider = options.useSocialProvider ?? (options.useEnterpriseProvider ? defaultChat.provider.enterprise.id : defaultChat.provider.default.id);
		}

		let sessions = session ? [session] : undefined;
		try {
			if (
				!options.forceAnonymous &&						// User is not asking for anonymous access
				entitlement !== ChatEntitlement.Free &&			// User is not signed up to Copilot Free
				!isProUser(entitlement) &&						// User is not signed up for a Copilot subscription
				entitlement !== ChatEntitlement.Unavailable		// User is eligible for Copilot Free
			) {
				if (!sessions) {
					try {
						// Consider all sessions for the provider to be suitable for signing up
						const existingSessions = await this.authenticationService.getSessions(providerId);
						sessions = existingSessions.length > 0 ? [...existingSessions] : undefined;
					} catch (error) {
						// ignore - errors can throw if a provider is not registered
					}

					if (!sessions || sessions.length === 0) {
						this.telemetryService.publicLog2<InstallChatEvent, InstallChatClassification>('commandCenter.chatInstall', { installResult: 'failedNoSession', installDuration: watch.elapsed(), signUpErrorCode: undefined, provider });
						return false; // unexpected
					}
				}

				signUpResult = await this.requests.signUpFree(sessions);

				if (typeof signUpResult !== 'boolean' /* error */) {
					this.telemetryService.publicLog2<InstallChatEvent, InstallChatClassification>('commandCenter.chatInstall', { installResult: 'failedSignUp', installDuration: watch.elapsed(), signUpErrorCode: signUpResult.errorCode, provider });
				}
			}

			await this.doInstallWithRetry();
		} catch (error) {
			this.logService.error(`[chat setup] install: error ${error}`);
			this.telemetryService.publicLog2<InstallChatEvent, InstallChatClassification>('commandCenter.chatInstall', { installResult: isCancellationError(error) ? 'cancelled' : 'failedInstall', installDuration: watch.elapsed(), signUpErrorCode: undefined, provider });
			return false;
		}

		if (typeof signUpResult === 'boolean' /* not an error case */ || typeof signUpResult === 'undefined' /* already signed up */) {
			this.telemetryService.publicLog2<InstallChatEvent, InstallChatClassification>('commandCenter.chatInstall', { installResult: wasRunning && !signUpResult ? 'alreadyInstalled' : 'installed', installDuration: watch.elapsed(), signUpErrorCode: undefined, provider });
		}

		if (wasRunning) {
			// We always trigger refresh of tokens to help the user
			// get out of authentication issues that can happen when
			// for example the sign-up ran after the extension tried
			// to use the authentication information to mint a token
			refreshTokens(this.commandService);
		}

		return true;
	}

	private async doInstallWithRetry(): Promise<void> {
		let error: Error | undefined;
		try {
			await this.doInstall();
		} catch (e) {
			this.logService.error(`[chat setup] install: error ${error}`);
			error = e;
		}

		if (error) {
			if (!this.lifecycleService.willShutdown) {
				const { confirmed } = await this.dialogService.confirm({
					type: Severity.Error,
					message: localize('unknownSetupError', "An error occurred while setting up chat. Would you like to try again?"),
					detail: error && !isCancellationError(error) ? toErrorMessage(error) : undefined,
					primaryButton: localize('retry', "Retry")
				});

				if (confirmed) {
					return this.doInstallWithRetry();
				}
			}

			throw error;
		}
	}

	private async doInstall(): Promise<void> {
		await this.extensionsWorkbenchService.install(defaultChat.chatExtensionId, {
			enable: true,
			isApplicationScoped: true, 	// install into all profiles
			isMachineScoped: false,		// do not ask to sync
			installEverywhere: true,	// install in local and remote
			installPreReleaseVersion: this.productService.quality !== 'stable'
		}, ChatViewId);
	}

	async setupWithProvider(options: IChatSetupControllerOptions): Promise<ChatSetupResultValue> {
		const registry = Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration);
		registry.registerConfiguration({
			'id': 'copilot.setup',
			'type': 'object',
			'properties': {
				[defaultChat.completionsAdvancedSetting]: {
					'type': 'object',
					'properties': {
						'authProvider': {
							'type': 'string'
						}
					}
				},
				[defaultChat.providerUriSetting]: {
					'type': 'string'
				}
			}
		});

		if (options.useEnterpriseProvider) {
			const success = await this.handleEnterpriseInstance();
			if (!success) {
				this.telemetryService.publicLog2<InstallChatEvent, InstallChatClassification>('commandCenter.chatInstall', { installResult: 'failedEnterpriseSetup', installDuration: 0, signUpErrorCode: undefined, provider: undefined });
				return success; // not properly configured, abort
			}
		}

		let existingAdvancedSetting = this.configurationService.inspect(defaultChat.completionsAdvancedSetting).user?.value;
		if (!isObject(existingAdvancedSetting)) {
			existingAdvancedSetting = {};
		}

		if (options.useEnterpriseProvider) {
			await this.configurationService.updateValue(`${defaultChat.completionsAdvancedSetting}`, {
				...existingAdvancedSetting,
				'authProvider': defaultChat.provider.enterprise.id
			}, ConfigurationTarget.USER);
		} else {
			await this.configurationService.updateValue(`${defaultChat.completionsAdvancedSetting}`, Object.keys(existingAdvancedSetting).length > 0 ? {
				...existingAdvancedSetting,
				'authProvider': undefined
			} : undefined, ConfigurationTarget.USER);
		}

		return this.setup({ ...options, forceSignIn: true });
	}

	private async handleEnterpriseInstance(): Promise<ChatSetupResultValue> {
		const domainRegEx = /^[a-zA-Z\-_]+$/;
		const fullUriRegEx = /^(https:\/\/)?([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.ghe\.com\/?$/;

		const uri = this.configurationService.getValue<string>(defaultChat.providerUriSetting);
		if (typeof uri === 'string' && fullUriRegEx.test(uri)) {
			return true; // already setup with a valid URI
		}

		let isSingleWord = false;
		const result = await this.quickInputService.input({
			prompt: localize('enterpriseInstance', "What is your {0} instance?", defaultChat.provider.enterprise.name),
			placeHolder: localize('enterpriseInstancePlaceholder', 'i.e. "octocat" or "https://octocat.ghe.com"...'),
			ignoreFocusLost: true,
			value: uri,
			validateInput: async value => {
				isSingleWord = false;
				if (!value) {
					return undefined;
				}

				if (domainRegEx.test(value)) {
					isSingleWord = true;
					return {
						content: localize('willResolveTo', "Will resolve to {0}", `https://${value}.ghe.com`),
						severity: Severity.Info
					};
				} if (!fullUriRegEx.test(value)) {
					return {
						content: localize('invalidEnterpriseInstance', 'You must enter a valid {0} instance (i.e. "octocat" or "https://octocat.ghe.com")', defaultChat.provider.enterprise.name),
						severity: Severity.Error
					};
				}

				return undefined;
			}
		});

		if (!result) {
			return undefined; // canceled
		}

		let resolvedUri = result;
		if (isSingleWord) {
			resolvedUri = `https://${resolvedUri}.ghe.com`;
		} else {
			const normalizedUri = result.toLowerCase();
			const hasHttps = normalizedUri.startsWith('https://');
			if (!hasHttps) {
				resolvedUri = `https://${result}`;
			}
		}

		await this.configurationService.updateValue(defaultChat.providerUriSetting, resolvedUri, ConfigurationTarget.USER);

		return true;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatSetup/chatSetupProviders.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatSetup/chatSetupProviders.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { WorkbenchActionExecutedClassification, WorkbenchActionExecutedEvent } from '../../../../../base/common/actions.js';
import { timeout } from '../../../../../base/common/async.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { toErrorMessage } from '../../../../../base/common/errorMessage.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { MarkdownString } from '../../../../../base/common/htmlContent.js';
import { Lazy } from '../../../../../base/common/lazy.js';
import { Disposable, DisposableStore, IDisposable } from '../../../../../base/common/lifecycle.js';
import { URI } from '../../../../../base/common/uri.js';
import { localize, localize2 } from '../../../../../nls.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr } from '../../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../../platform/log/common/log.js';
import product from '../../../../../platform/product/common/product.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { IWorkspaceTrustManagementService } from '../../../../../platform/workspace/common/workspaceTrust.js';
import { IWorkbenchEnvironmentService } from '../../../../services/environment/common/environmentService.js';
import { nullExtensionDescription } from '../../../../services/extensions/common/extensions.js';
import { CountTokensCallback, ILanguageModelToolsService, IPreparedToolInvocation, IToolData, IToolImpl, IToolInvocation, IToolResult, ToolDataSource, ToolProgress } from '../../common/languageModelToolsService.js';
import { IChatAgentImplementation, IChatAgentRequest, IChatAgentResult, IChatAgentService } from '../../common/chatAgents.js';
import { ChatEntitlement, ChatEntitlementContext, ChatEntitlementRequests, IChatEntitlementService } from '../../../../services/chat/common/chatEntitlementService.js';
import { ChatModel, ChatRequestModel, IChatRequestModel, IChatRequestVariableData } from '../../common/chatModel.js';
import { ChatMode } from '../../common/chatModes.js';
import { ChatRequestAgentPart, ChatRequestToolPart } from '../../common/chatParserTypes.js';
import { IChatProgress, IChatService } from '../../common/chatService.js';
import { IChatRequestToolEntry } from '../../common/chatVariableEntries.js';
import { ChatAgentLocation, ChatConfiguration, ChatModeKind } from '../../common/constants.js';
import { ILanguageModelsService } from '../../common/languageModels.js';
import { CHAT_OPEN_ACTION_ID, CHAT_SETUP_ACTION_ID } from '../actions/chatActions.js';
import { IChatWidgetService } from '../chat.js';
import { ILanguageFeaturesService } from '../../../../../editor/common/services/languageFeatures.js';
import { CodeAction, CodeActionList, Command, NewSymbolName, NewSymbolNameTriggerKind } from '../../../../../editor/common/languages.js';
import { ITextModel } from '../../../../../editor/common/model.js';
import { IRange, Range } from '../../../../../editor/common/core/range.js';
import { ISelection, Selection } from '../../../../../editor/common/core/selection.js';
import { ResourceMap } from '../../../../../base/common/map.js';
import { CodeActionKind } from '../../../../../editor/contrib/codeAction/common/types.js';
import { ACTION_START as INLINE_CHAT_START } from '../../../inlineChat/common/inlineChat.js';
import { IPosition } from '../../../../../editor/common/core/position.js';
import { IMarker, IMarkerService, MarkerSeverity } from '../../../../../platform/markers/common/markers.js';
import { ChatSetupController } from './chatSetupController.js';
import { ChatSetupAnonymous, ChatSetupStep, IChatSetupResult } from './chatSetup.js';
import { ChatSetup } from './chatSetupRunner.js';

const defaultChat = {
	extensionId: product.defaultChatAgent?.extensionId ?? '',
	chatExtensionId: product.defaultChatAgent?.chatExtensionId ?? '',
	provider: product.defaultChatAgent?.provider ?? { default: { id: '', name: '' }, enterprise: { id: '', name: '' }, apple: { id: '', name: '' }, google: { id: '', name: '' } },
};

const ToolsAgentContextKey = ContextKeyExpr.and(
	ContextKeyExpr.equals(`config.${ChatConfiguration.AgentEnabled}`, true),
	ContextKeyExpr.not(`previewFeaturesDisabled`) // Set by extension
);

export class SetupAgent extends Disposable implements IChatAgentImplementation {

	static registerDefaultAgents(instantiationService: IInstantiationService, location: ChatAgentLocation, mode: ChatModeKind | undefined, context: ChatEntitlementContext, controller: Lazy<ChatSetupController>): { agent: SetupAgent; disposable: IDisposable } {
		return instantiationService.invokeFunction(accessor => {
			const chatAgentService = accessor.get(IChatAgentService);

			let id: string;
			let description = ChatMode.Ask.description.get();
			switch (location) {
				case ChatAgentLocation.Chat:
					if (mode === ChatModeKind.Ask) {
						id = 'setup.chat';
					} else if (mode === ChatModeKind.Edit) {
						id = 'setup.edits';
						description = ChatMode.Edit.description.get();
					} else {
						id = 'setup.agent';
						description = ChatMode.Agent.description.get();
					}
					break;
				case ChatAgentLocation.Terminal:
					id = 'setup.terminal';
					break;
				case ChatAgentLocation.EditorInline:
					id = 'setup.editor';
					break;
				case ChatAgentLocation.Notebook:
					id = 'setup.notebook';
					break;
			}

			return SetupAgent.doRegisterAgent(instantiationService, chatAgentService, id, `${defaultChat.provider.default.name} Copilot` /* Do NOT change, this hides the username altogether in Chat */, true, description, location, mode, context, controller);
		});
	}

	static registerBuiltInAgents(instantiationService: IInstantiationService, context: ChatEntitlementContext, controller: Lazy<ChatSetupController>): IDisposable {
		return instantiationService.invokeFunction(accessor => {
			const chatAgentService = accessor.get(IChatAgentService);

			const disposables = new DisposableStore();

			// Register VSCode agent
			const { disposable: vscodeDisposable } = SetupAgent.doRegisterAgent(instantiationService, chatAgentService, 'setup.vscode', 'vscode', false, localize2('vscodeAgentDescription', "Ask questions about VS Code").value, ChatAgentLocation.Chat, undefined, context, controller);
			disposables.add(vscodeDisposable);

			// Register workspace agent
			const { disposable: workspaceDisposable } = SetupAgent.doRegisterAgent(instantiationService, chatAgentService, 'setup.workspace', 'workspace', false, localize2('workspaceAgentDescription', "Ask about your workspace").value, ChatAgentLocation.Chat, undefined, context, controller);
			disposables.add(workspaceDisposable);

			// Register terminal agent
			const { disposable: terminalDisposable } = SetupAgent.doRegisterAgent(instantiationService, chatAgentService, 'setup.terminal.agent', 'terminal', false, localize2('terminalAgentDescription', "Ask how to do something in the terminal").value, ChatAgentLocation.Chat, undefined, context, controller);
			disposables.add(terminalDisposable);

			// Register tools
			disposables.add(SetupTool.registerTool(instantiationService, {
				id: 'setup_tools_createNewWorkspace',
				source: ToolDataSource.Internal,
				icon: Codicon.newFolder,
				displayName: localize('setupToolDisplayName', "New Workspace"),
				modelDescription: 'Scaffold a new workspace in VS Code',
				userDescription: localize('setupToolsDescription', "Scaffold a new workspace in VS Code"),
				canBeReferencedInPrompt: true,
				toolReferenceName: 'new',
				when: ContextKeyExpr.true(),
			}));

			return disposables;
		});
	}

	private static doRegisterAgent(instantiationService: IInstantiationService, chatAgentService: IChatAgentService, id: string, name: string, isDefault: boolean, description: string, location: ChatAgentLocation, mode: ChatModeKind | undefined, context: ChatEntitlementContext, controller: Lazy<ChatSetupController>): { agent: SetupAgent; disposable: IDisposable } {
		const disposables = new DisposableStore();
		disposables.add(chatAgentService.registerAgent(id, {
			id,
			name,
			isDefault,
			isCore: true,
			modes: mode ? [mode] : [ChatModeKind.Ask],
			when: mode === ChatModeKind.Agent ? ToolsAgentContextKey?.serialize() : undefined,
			slashCommands: [],
			disambiguation: [],
			locations: [location],
			metadata: { helpTextPrefix: SetupAgent.SETUP_NEEDED_MESSAGE },
			description,
			extensionId: nullExtensionDescription.identifier,
			extensionVersion: undefined,
			extensionDisplayName: nullExtensionDescription.name,
			extensionPublisherId: nullExtensionDescription.publisher
		}));

		const agent = disposables.add(instantiationService.createInstance(SetupAgent, context, controller, location));
		disposables.add(chatAgentService.registerAgentImplementation(id, agent));
		if (mode === ChatModeKind.Agent) {
			chatAgentService.updateAgent(id, { themeIcon: Codicon.tools });
		}

		return { agent, disposable: disposables };
	}

	private static readonly SETUP_NEEDED_MESSAGE = new MarkdownString(localize('settingUpCopilotNeeded', "You need to set up GitHub Copilot and be signed in to use Chat."));
	private static readonly TRUST_NEEDED_MESSAGE = new MarkdownString(localize('trustNeeded', "You need to trust this workspace to use Chat."));

	private readonly _onUnresolvableError = this._register(new Emitter<void>());
	readonly onUnresolvableError = this._onUnresolvableError.event;

	private readonly pendingForwardedRequests = new ResourceMap<Promise<void>>();

	constructor(
		private readonly context: ChatEntitlementContext,
		private readonly controller: Lazy<ChatSetupController>,
		private readonly location: ChatAgentLocation,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@ILogService private readonly logService: ILogService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IWorkbenchEnvironmentService private readonly environmentService: IWorkbenchEnvironmentService,
		@IWorkspaceTrustManagementService private readonly workspaceTrustManagementService: IWorkspaceTrustManagementService,
		@IChatEntitlementService private readonly chatEntitlementService: IChatEntitlementService,
	) {
		super();
	}

	async invoke(request: IChatAgentRequest, progress: (parts: IChatProgress[]) => void): Promise<IChatAgentResult> {
		return this.instantiationService.invokeFunction(async accessor /* using accessor for lazy loading */ => {
			const chatService = accessor.get(IChatService);
			const languageModelsService = accessor.get(ILanguageModelsService);
			const chatWidgetService = accessor.get(IChatWidgetService);
			const chatAgentService = accessor.get(IChatAgentService);
			const languageModelToolsService = accessor.get(ILanguageModelToolsService);

			return this.doInvoke(request, part => progress([part]), chatService, languageModelsService, chatWidgetService, chatAgentService, languageModelToolsService);
		});
	}

	private async doInvoke(request: IChatAgentRequest, progress: (part: IChatProgress) => void, chatService: IChatService, languageModelsService: ILanguageModelsService, chatWidgetService: IChatWidgetService, chatAgentService: IChatAgentService, languageModelToolsService: ILanguageModelToolsService): Promise<IChatAgentResult> {
		if (
			!this.context.state.installed ||									// Extension not installed: run setup to install
			this.context.state.disabled ||										// Extension disabled: run setup to enable
			this.context.state.untrusted ||										// Workspace untrusted: run setup to ask for trust
			this.context.state.entitlement === ChatEntitlement.Available ||		// Entitlement available: run setup to sign up
			(
				this.context.state.entitlement === ChatEntitlement.Unknown &&	// Entitlement unknown: run setup to sign in / sign up
				!this.chatEntitlementService.anonymous							// unless anonymous access is enabled
			)
		) {
			return this.doInvokeWithSetup(request, progress, chatService, languageModelsService, chatWidgetService, chatAgentService, languageModelToolsService);
		}

		return this.doInvokeWithoutSetup(request, progress, chatService, languageModelsService, chatWidgetService, chatAgentService, languageModelToolsService);
	}

	private async doInvokeWithoutSetup(request: IChatAgentRequest, progress: (part: IChatProgress) => void, chatService: IChatService, languageModelsService: ILanguageModelsService, chatWidgetService: IChatWidgetService, chatAgentService: IChatAgentService, languageModelToolsService: ILanguageModelToolsService): Promise<IChatAgentResult> {
		const requestModel = chatWidgetService.getWidgetBySessionResource(request.sessionResource)?.viewModel?.model.getRequests().at(-1);
		if (!requestModel) {
			this.logService.error('[chat setup] Request model not found, cannot redispatch request.');
			return {}; // this should not happen
		}

		progress({
			kind: 'progressMessage',
			content: new MarkdownString(localize('waitingChat', "Getting chat ready...")),
		});

		await this.forwardRequestToChat(requestModel, progress, chatService, languageModelsService, chatAgentService, chatWidgetService, languageModelToolsService);

		return {};
	}

	private async forwardRequestToChat(requestModel: IChatRequestModel, progress: (part: IChatProgress) => void, chatService: IChatService, languageModelsService: ILanguageModelsService, chatAgentService: IChatAgentService, chatWidgetService: IChatWidgetService, languageModelToolsService: ILanguageModelToolsService): Promise<void> {
		try {
			await this.doForwardRequestToChat(requestModel, progress, chatService, languageModelsService, chatAgentService, chatWidgetService, languageModelToolsService);
		} catch (error) {
			this.logService.error('[chat setup] Failed to forward request to chat', error);

			progress({
				kind: 'warning',
				content: new MarkdownString(localize('copilotUnavailableWarning', "Failed to get a response. Please try again."))
			});
		}
	}

	private async doForwardRequestToChat(requestModel: IChatRequestModel, progress: (part: IChatProgress) => void, chatService: IChatService, languageModelsService: ILanguageModelsService, chatAgentService: IChatAgentService, chatWidgetService: IChatWidgetService, languageModelToolsService: ILanguageModelToolsService): Promise<void> {
		if (this.pendingForwardedRequests.has(requestModel.session.sessionResource)) {
			throw new Error('Request already in progress');
		}

		const forwardRequest = this.doForwardRequestToChatWhenReady(requestModel, progress, chatService, languageModelsService, chatAgentService, chatWidgetService, languageModelToolsService);
		this.pendingForwardedRequests.set(requestModel.session.sessionResource, forwardRequest);

		try {
			await forwardRequest;
		} finally {
			this.pendingForwardedRequests.delete(requestModel.session.sessionResource);
		}
	}

	private async doForwardRequestToChatWhenReady(requestModel: IChatRequestModel, progress: (part: IChatProgress) => void, chatService: IChatService, languageModelsService: ILanguageModelsService, chatAgentService: IChatAgentService, chatWidgetService: IChatWidgetService, languageModelToolsService: ILanguageModelToolsService): Promise<void> {
		const widget = chatWidgetService.getWidgetBySessionResource(requestModel.session.sessionResource);
		const modeInfo = widget?.input.currentModeInfo;

		// We need a signal to know when we can resend the request to
		// Chat. Waiting for the registration of the agent is not
		// enough, we also need a language/tools model to be available.

		let agentActivated = false;
		let agentReady = false;
		let languageModelReady = false;
		let toolsModelReady = false;

		const whenAgentActivated = this.whenAgentActivated(chatService).then(() => agentActivated = true);
		const whenAgentReady = this.whenAgentReady(chatAgentService, modeInfo?.kind)?.then(() => agentReady = true);
		const whenLanguageModelReady = this.whenLanguageModelReady(languageModelsService, requestModel.modelId)?.then(() => languageModelReady = true);
		const whenToolsModelReady = this.whenToolsModelReady(languageModelToolsService, requestModel)?.then(() => toolsModelReady = true);

		if (whenLanguageModelReady instanceof Promise || whenAgentReady instanceof Promise || whenToolsModelReady instanceof Promise) {
			const timeoutHandle = setTimeout(() => {
				progress({
					kind: 'progressMessage',
					content: new MarkdownString(localize('waitingChat2', "Chat is almost ready...")),
				});
			}, 10000);

			try {
				const ready = await Promise.race([
					timeout(this.environmentService.remoteAuthority ? 60000 /* increase for remote scenarios */ : 20000).then(() => 'timedout'),
					Promise.allSettled([
						whenAgentActivated,
						whenAgentReady,
						whenLanguageModelReady,
						whenToolsModelReady
					])
				]);

				if (ready === 'timedout') {
					let warningMessage: string;
					if (this.chatEntitlementService.anonymous) {
						warningMessage = localize('chatTookLongWarningAnonymous', "Chat took too long to get ready. Please ensure that the extension `{0}` is installed and enabled.", defaultChat.chatExtensionId);
					} else {
						warningMessage = localize('chatTookLongWarning', "Chat took too long to get ready. Please ensure you are signed in to {0} and that the extension `{1}` is installed and enabled.", defaultChat.provider.default.name, defaultChat.chatExtensionId);
					}

					this.logService.warn(warningMessage, {
						agentActivated,
						agentReady,
						languageModelReady,
						toolsModelReady
					});

					progress({
						kind: 'warning',
						content: new MarkdownString(warningMessage)
					});

					// This means Chat is unhealthy and we cannot retry the
					// request. Signal this to the outside via an event.
					this._onUnresolvableError.fire();
					return;
				}
			} finally {
				clearTimeout(timeoutHandle);
			}
		}

		await chatService.resendRequest(requestModel, {
			...widget?.getModeRequestOptions(),
			modeInfo,
			userSelectedModelId: widget?.input.currentLanguageModel
		});
	}

	private whenLanguageModelReady(languageModelsService: ILanguageModelsService, modelId: string | undefined): Promise<unknown> | void {
		const hasModelForRequest = () => {
			if (modelId) {
				return !!languageModelsService.lookupLanguageModel(modelId);
			}

			for (const id of languageModelsService.getLanguageModelIds()) {
				const model = languageModelsService.lookupLanguageModel(id);
				if (model?.isDefault) {
					return true;
				}
			}

			return false;
		};

		if (hasModelForRequest()) {
			return;
		}

		return Event.toPromise(Event.filter(languageModelsService.onDidChangeLanguageModels, () => hasModelForRequest()));
	}

	private whenToolsModelReady(languageModelToolsService: ILanguageModelToolsService, requestModel: IChatRequestModel): Promise<unknown> | void {
		const needsToolsModel = requestModel.message.parts.some(part => part instanceof ChatRequestToolPart);
		if (!needsToolsModel) {
			return; // No tools in this request, no need to check
		}

		// check that tools other than setup. and internal tools are registered.
		for (const tool of languageModelToolsService.getTools()) {
			if (tool.id.startsWith('copilot_')) {
				return; // we have tools!
			}
		}

		return Event.toPromise(Event.filter(languageModelToolsService.onDidChangeTools, () => {
			for (const tool of languageModelToolsService.getTools()) {
				if (tool.id.startsWith('copilot_')) {
					return true; // we have tools!
				}
			}

			return false; // no external tools found
		}));
	}

	private whenAgentReady(chatAgentService: IChatAgentService, mode: ChatModeKind | undefined): Promise<unknown> | void {
		const defaultAgent = chatAgentService.getDefaultAgent(this.location, mode);
		if (defaultAgent && !defaultAgent.isCore) {
			return; // we have a default agent from an extension!
		}

		return Event.toPromise(Event.filter(chatAgentService.onDidChangeAgents, () => {
			const defaultAgent = chatAgentService.getDefaultAgent(this.location, mode);
			return Boolean(defaultAgent && !defaultAgent.isCore);
		}));
	}

	private async whenAgentActivated(chatService: IChatService): Promise<void> {
		try {
			await chatService.activateDefaultAgent(this.location);
		} catch (error) {
			this.logService.error(error);
		}
	}

	private async doInvokeWithSetup(request: IChatAgentRequest, progress: (part: IChatProgress) => void, chatService: IChatService, languageModelsService: ILanguageModelsService, chatWidgetService: IChatWidgetService, chatAgentService: IChatAgentService, languageModelToolsService: ILanguageModelToolsService): Promise<IChatAgentResult> {
		this.telemetryService.publicLog2<WorkbenchActionExecutedEvent, WorkbenchActionExecutedClassification>('workbenchActionExecuted', { id: CHAT_SETUP_ACTION_ID, from: 'chat' });

		const widget = chatWidgetService.getWidgetBySessionResource(request.sessionResource);
		const requestModel = widget?.viewModel?.model.getRequests().at(-1);

		const setupListener = Event.runAndSubscribe(this.controller.value.onDidChange, (() => {
			switch (this.controller.value.step) {
				case ChatSetupStep.SigningIn:
					progress({
						kind: 'progressMessage',
						content: new MarkdownString(localize('setupChatSignIn2', "Signing in to {0}...", ChatEntitlementRequests.providerId(this.configurationService) === defaultChat.provider.enterprise.id ? defaultChat.provider.enterprise.name : defaultChat.provider.default.name)),
					});
					break;
				case ChatSetupStep.Installing:
					progress({
						kind: 'progressMessage',
						content: new MarkdownString(localize('installingChat', "Getting chat ready...")),
					});
					break;
			}
		}));

		let result: IChatSetupResult | undefined = undefined;
		try {
			result = await ChatSetup.getInstance(this.instantiationService, this.context, this.controller).run({
				disableChatViewReveal: true, 																				// we are already in a chat context
				forceAnonymous: this.chatEntitlementService.anonymous ? ChatSetupAnonymous.EnabledWithoutDialog : undefined	// only enable anonymous selectively
			});
		} catch (error) {
			this.logService.error(`[chat setup] Error during setup: ${toErrorMessage(error)}`);
		} finally {
			setupListener.dispose();
		}

		// User has agreed to run the setup
		if (typeof result?.success === 'boolean') {
			if (result.success) {
				if (result.dialogSkipped) {
					await widget?.clear(); // make room for the Chat welcome experience
				} else if (requestModel) {
					let newRequest = this.replaceAgentInRequestModel(requestModel, chatAgentService); 	// Replace agent part with the actual Chat agent...
					newRequest = this.replaceToolInRequestModel(newRequest); 							// ...then replace any tool parts with the actual Chat tools

					await this.forwardRequestToChat(newRequest, progress, chatService, languageModelsService, chatAgentService, chatWidgetService, languageModelToolsService);
				}
			} else {
				progress({
					kind: 'warning',
					content: new MarkdownString(localize('chatSetupError', "Chat setup failed."))
				});
			}
		}

		// User has cancelled the setup
		else {
			progress({
				kind: 'markdownContent',
				content: this.workspaceTrustManagementService.isWorkspaceTrusted() ? SetupAgent.SETUP_NEEDED_MESSAGE : SetupAgent.TRUST_NEEDED_MESSAGE
			});
		}

		return {};
	}

	private replaceAgentInRequestModel(requestModel: IChatRequestModel, chatAgentService: IChatAgentService): IChatRequestModel {
		const agentPart = requestModel.message.parts.find((r): r is ChatRequestAgentPart => r instanceof ChatRequestAgentPart);
		if (!agentPart) {
			return requestModel;
		}

		const agentId = agentPart.agent.id.replace(/setup\./, `${defaultChat.extensionId}.`.toLowerCase());
		const githubAgent = chatAgentService.getAgent(agentId);
		if (!githubAgent) {
			return requestModel;
		}

		const newAgentPart = new ChatRequestAgentPart(agentPart.range, agentPart.editorRange, githubAgent);

		return new ChatRequestModel({
			session: requestModel.session as ChatModel,
			message: {
				parts: requestModel.message.parts.map(part => {
					if (part instanceof ChatRequestAgentPart) {
						return newAgentPart;
					}
					return part;
				}),
				text: requestModel.message.text
			},
			variableData: requestModel.variableData,
			timestamp: Date.now(),
			attempt: requestModel.attempt,
			modeInfo: requestModel.modeInfo,
			confirmation: requestModel.confirmation,
			locationData: requestModel.locationData,
			attachedContext: requestModel.attachedContext,
			isCompleteAddedRequest: requestModel.isCompleteAddedRequest,
		});
	}

	private replaceToolInRequestModel(requestModel: IChatRequestModel): IChatRequestModel {
		const toolPart = requestModel.message.parts.find((r): r is ChatRequestToolPart => r instanceof ChatRequestToolPart);
		if (!toolPart) {
			return requestModel;
		}

		const toolId = toolPart.toolId.replace(/setup.tools\./, `copilot_`.toLowerCase());
		const newToolPart = new ChatRequestToolPart(
			toolPart.range,
			toolPart.editorRange,
			toolPart.toolName,
			toolId,
			toolPart.displayName,
			toolPart.icon
		);

		const chatRequestToolEntry: IChatRequestToolEntry = {
			id: toolId,
			name: 'new',
			range: toolPart.range,
			kind: 'tool',
			value: undefined
		};

		const variableData: IChatRequestVariableData = {
			variables: [chatRequestToolEntry]
		};

		return new ChatRequestModel({
			session: requestModel.session as ChatModel,
			message: {
				parts: requestModel.message.parts.map(part => {
					if (part instanceof ChatRequestToolPart) {
						return newToolPart;
					}
					return part;
				}),
				text: requestModel.message.text
			},
			variableData: variableData,
			timestamp: Date.now(),
			attempt: requestModel.attempt,
			modeInfo: requestModel.modeInfo,
			confirmation: requestModel.confirmation,
			locationData: requestModel.locationData,
			attachedContext: [chatRequestToolEntry],
			isCompleteAddedRequest: requestModel.isCompleteAddedRequest,
		});
	}
}

export class SetupTool implements IToolImpl {

	static registerTool(instantiationService: IInstantiationService, toolData: IToolData): IDisposable {
		return instantiationService.invokeFunction(accessor => {
			const toolService = accessor.get(ILanguageModelToolsService);

			const tool = instantiationService.createInstance(SetupTool);
			return toolService.registerTool(toolData, tool);
		});
	}

	async invoke(invocation: IToolInvocation, countTokens: CountTokensCallback, progress: ToolProgress, token: CancellationToken): Promise<IToolResult> {
		const result: IToolResult = {
			content: [
				{
					kind: 'text',
					value: ''
				}
			]
		};

		return result;
	}

	async prepareToolInvocation?(parameters: unknown, token: CancellationToken): Promise<IPreparedToolInvocation | undefined> {
		return undefined;
	}
}

export class AINewSymbolNamesProvider {

	static registerProvider(instantiationService: IInstantiationService, context: ChatEntitlementContext, controller: Lazy<ChatSetupController>): IDisposable {
		return instantiationService.invokeFunction(accessor => {
			const languageFeaturesService = accessor.get(ILanguageFeaturesService);

			const provider = instantiationService.createInstance(AINewSymbolNamesProvider, context, controller);
			return languageFeaturesService.newSymbolNamesProvider.register('*', provider);
		});
	}

	constructor(
		private readonly context: ChatEntitlementContext,
		private readonly controller: Lazy<ChatSetupController>,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IChatEntitlementService private readonly chatEntitlementService: IChatEntitlementService,
	) {
	}

	async provideNewSymbolNames(model: ITextModel, range: IRange, triggerKind: NewSymbolNameTriggerKind, token: CancellationToken): Promise<NewSymbolName[] | undefined> {
		await this.instantiationService.invokeFunction(accessor => {
			return ChatSetup.getInstance(this.instantiationService, this.context, this.controller).run({
				forceAnonymous: this.chatEntitlementService.anonymous ? ChatSetupAnonymous.EnabledWithDialog : undefined
			});
		});

		return [];
	}
}

export class ChatCodeActionsProvider {

	static registerProvider(instantiationService: IInstantiationService): IDisposable {
		return instantiationService.invokeFunction(accessor => {
			const languageFeaturesService = accessor.get(ILanguageFeaturesService);

			const provider = instantiationService.createInstance(ChatCodeActionsProvider);
			return languageFeaturesService.codeActionProvider.register('*', provider);
		});
	}

	constructor(
		@IMarkerService private readonly markerService: IMarkerService,
	) {
	}

	async provideCodeActions(model: ITextModel, range: Range | Selection): Promise<CodeActionList | undefined> {
		const actions: CodeAction[] = [];

		// "Generate" if the line is whitespace only
		// "Modify" if there is a selection
		let generateOrModifyTitle: string | undefined;
		let generateOrModifyCommand: Command | undefined;
		if (range.isEmpty()) {
			const textAtLine = model.getLineContent(range.startLineNumber);
			if (/^\s*$/.test(textAtLine)) {
				generateOrModifyTitle = localize('generate', "Generate");
				generateOrModifyCommand = AICodeActionsHelper.generate(range);
			}
		} else {
			const textInSelection = model.getValueInRange(range);
			if (!/^\s*$/.test(textInSelection)) {
				generateOrModifyTitle = localize('modify', "Modify");
				generateOrModifyCommand = AICodeActionsHelper.modify(range);
			}
		}

		if (generateOrModifyTitle && generateOrModifyCommand) {
			actions.push({
				kind: CodeActionKind.RefactorRewrite.append('copilot').value,
				isAI: true,
				title: generateOrModifyTitle,
				command: generateOrModifyCommand,
			});
		}

		const markers = AICodeActionsHelper.warningOrErrorMarkersAtRange(this.markerService, model.uri, range);
		if (markers.length > 0) {

			// "Fix" if there are diagnostics in the range
			actions.push({
				kind: CodeActionKind.QuickFix.append('copilot').value,
				isAI: true,
				diagnostics: markers,
				title: localize('fix', "Fix"),
				command: AICodeActionsHelper.fixMarkers(markers, range)
			});

			// "Explain" if there are diagnostics in the range
			actions.push({
				kind: CodeActionKind.QuickFix.append('explain').append('copilot').value,
				isAI: true,
				diagnostics: markers,
				title: localize('explain', "Explain"),
				command: AICodeActionsHelper.explainMarkers(markers)
			});
		}

		return {
			actions,
			dispose() { }
		};
	}
}

export class AICodeActionsHelper {

	static warningOrErrorMarkersAtRange(markerService: IMarkerService, resource: URI, range: Range | Selection): IMarker[] {
		return markerService
			.read({ resource, severities: MarkerSeverity.Error | MarkerSeverity.Warning })
			.filter(marker => range.startLineNumber <= marker.endLineNumber && range.endLineNumber >= marker.startLineNumber);
	}

	static modify(range: Range): Command {
		return {
			id: INLINE_CHAT_START,
			title: localize('modify', "Modify"),
			arguments: [
				{
					initialSelection: this.rangeToSelection(range),
					initialRange: range,
					position: range.getStartPosition()
				} satisfies { initialSelection: ISelection; initialRange: IRange; position: IPosition }
			]
		};
	}

	static generate(range: Range): Command {
		return {
			id: INLINE_CHAT_START,
			title: localize('generate', "Generate"),
			arguments: [
				{
					initialSelection: this.rangeToSelection(range),
					initialRange: range,
					position: range.getStartPosition()
				} satisfies { initialSelection: ISelection; initialRange: IRange; position: IPosition }
			]
		};
	}

	private static rangeToSelection(range: Range): ISelection {
		return new Selection(range.startLineNumber, range.startColumn, range.endLineNumber, range.endColumn);
	}

	static explainMarkers(markers: IMarker[]): Command {
		return {
			id: CHAT_OPEN_ACTION_ID,
			title: localize('explain', "Explain"),
			arguments: [
				{
					query: `@workspace /explain ${markers.map(marker => marker.message).join(', ')}`,
					isPartialQuery: true
				} satisfies { query: string; isPartialQuery: boolean }
			]
		};
	}

	static fixMarkers(markers: IMarker[], range: Range): Command {
		return {
			id: INLINE_CHAT_START,
			title: localize('fix', "Fix"),
			arguments: [
				{
					message: `/fix ${markers.map(marker => marker.message).join(', ')}`,
					initialSelection: this.rangeToSelection(range),
					initialRange: range,
					position: range.getStartPosition()
				} satisfies { message: string; initialSelection: ISelection; initialRange: IRange; position: IPosition }
			]
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatSetup/chatSetupRunner.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatSetup/chatSetupRunner.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/chatSetup.css';
import { $ } from '../../../../../base/browser/dom.js';
import { IButton } from '../../../../../base/browser/ui/button/button.js';
import { Dialog, DialogContentsAlignment } from '../../../../../base/browser/ui/dialog/dialog.js';
import { coalesce } from '../../../../../base/common/arrays.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { toErrorMessage } from '../../../../../base/common/errorMessage.js';
import { MarkdownString } from '../../../../../base/common/htmlContent.js';
import { Lazy } from '../../../../../base/common/lazy.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { IMarkdownRendererService } from '../../../../../platform/markdown/browser/markdownRenderer.js';
import { localize } from '../../../../../nls.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { createWorkbenchDialogOptions } from '../../../../../platform/dialogs/browser/dialog.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../../platform/keybinding/common/keybinding.js';
import { ILayoutService } from '../../../../../platform/layout/browser/layoutService.js';
import { ILogService } from '../../../../../platform/log/common/log.js';
import product from '../../../../../platform/product/common/product.js';
import { ITelemetryService, TelemetryLevel } from '../../../../../platform/telemetry/common/telemetry.js';
import { IWorkspaceTrustRequestService } from '../../../../../platform/workspace/common/workspaceTrust.js';
import { IWorkbenchLayoutService } from '../../../../services/layout/browser/layoutService.js';
import { ChatEntitlement, ChatEntitlementContext, ChatEntitlementRequests, ChatEntitlementService, IChatEntitlementService, isProUser } from '../../../../services/chat/common/chatEntitlementService.js';
import { IChatWidgetService } from '../chat.js';
import { ChatSetupController } from './chatSetupController.js';
import { IChatSetupResult, ChatSetupAnonymous, InstallChatEvent, InstallChatClassification, ChatSetupStrategy, ChatSetupResultValue } from './chatSetup.js';

const defaultChat = {
	publicCodeMatchesUrl: product.defaultChatAgent?.publicCodeMatchesUrl ?? '',
	provider: product.defaultChatAgent?.provider ?? { default: { id: '', name: '' }, enterprise: { id: '', name: '' }, apple: { id: '', name: '' }, google: { id: '', name: '' } },
	manageSettingsUrl: product.defaultChatAgent?.manageSettingsUrl ?? '',
	completionsRefreshTokenCommand: product.defaultChatAgent?.completionsRefreshTokenCommand ?? '',
	chatRefreshTokenCommand: product.defaultChatAgent?.chatRefreshTokenCommand ?? '',
	termsStatementUrl: product.defaultChatAgent?.termsStatementUrl ?? '',
	privacyStatementUrl: product.defaultChatAgent?.privacyStatementUrl ?? ''
};

export class ChatSetup {

	private static instance: ChatSetup | undefined = undefined;
	static getInstance(instantiationService: IInstantiationService, context: ChatEntitlementContext, controller: Lazy<ChatSetupController>): ChatSetup {
		let instance = ChatSetup.instance;
		if (!instance) {
			instance = ChatSetup.instance = instantiationService.invokeFunction(accessor => {
				return new ChatSetup(context, controller, accessor.get(ITelemetryService), accessor.get(IWorkbenchLayoutService), accessor.get(IKeybindingService), accessor.get(IChatEntitlementService) as ChatEntitlementService, accessor.get(ILogService), accessor.get(IConfigurationService), accessor.get(IChatWidgetService), accessor.get(IWorkspaceTrustRequestService), accessor.get(IMarkdownRendererService));
			});
		}

		return instance;
	}

	private pendingRun: Promise<IChatSetupResult> | undefined = undefined;

	private skipDialogOnce = false;

	private constructor(
		private readonly context: ChatEntitlementContext,
		private readonly controller: Lazy<ChatSetupController>,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@ILayoutService private readonly layoutService: IWorkbenchLayoutService,
		@IKeybindingService private readonly keybindingService: IKeybindingService,
		@IChatEntitlementService private readonly chatEntitlementService: ChatEntitlementService,
		@ILogService private readonly logService: ILogService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IChatWidgetService private readonly widgetService: IChatWidgetService,
		@IWorkspaceTrustRequestService private readonly workspaceTrustRequestService: IWorkspaceTrustRequestService,
		@IMarkdownRendererService private readonly markdownRendererService: IMarkdownRendererService,
	) { }

	skipDialog(): void {
		this.skipDialogOnce = true;
	}

	async run(options?: { disableChatViewReveal?: boolean; forceSignInDialog?: boolean; additionalScopes?: readonly string[]; forceAnonymous?: ChatSetupAnonymous }): Promise<IChatSetupResult> {
		if (this.pendingRun) {
			return this.pendingRun;
		}

		this.pendingRun = this.doRun(options);

		try {
			return await this.pendingRun;
		} finally {
			this.pendingRun = undefined;
		}
	}

	private async doRun(options?: { disableChatViewReveal?: boolean; forceSignInDialog?: boolean; additionalScopes?: readonly string[]; forceAnonymous?: ChatSetupAnonymous }): Promise<IChatSetupResult> {
		this.context.update({ later: false });

		const dialogSkipped = this.skipDialogOnce;
		this.skipDialogOnce = false;

		const trusted = await this.workspaceTrustRequestService.requestWorkspaceTrust({
			message: localize('chatWorkspaceTrust', "AI features are currently only supported in trusted workspaces.")
		});
		if (!trusted) {
			this.context.update({ later: true });
			this.telemetryService.publicLog2<InstallChatEvent, InstallChatClassification>('commandCenter.chatInstall', { installResult: 'failedNotTrusted', installDuration: 0, signUpErrorCode: undefined, provider: undefined });

			return { dialogSkipped, success: undefined /* canceled */ };
		}

		let setupStrategy: ChatSetupStrategy;
		if (!options?.forceSignInDialog && (dialogSkipped || isProUser(this.chatEntitlementService.entitlement) || this.chatEntitlementService.entitlement === ChatEntitlement.Free)) {
			setupStrategy = ChatSetupStrategy.DefaultSetup; // existing pro/free users setup without a dialog
		} else if (options?.forceAnonymous === ChatSetupAnonymous.EnabledWithoutDialog) {
			setupStrategy = ChatSetupStrategy.DefaultSetup; // anonymous setup without a dialog
		} else {
			setupStrategy = await this.showDialog(options);
		}

		if (setupStrategy === ChatSetupStrategy.DefaultSetup && ChatEntitlementRequests.providerId(this.configurationService) === defaultChat.provider.enterprise.id) {
			setupStrategy = ChatSetupStrategy.SetupWithEnterpriseProvider; // users with a configured provider go through provider setup
		}

		if (setupStrategy !== ChatSetupStrategy.Canceled && !options?.disableChatViewReveal) {
			// Show the chat view now to better indicate progress
			// while installing the extension or returning from sign in
			this.widgetService.revealWidget();
		}

		let success: ChatSetupResultValue = undefined;
		try {
			switch (setupStrategy) {
				case ChatSetupStrategy.SetupWithEnterpriseProvider:
					success = await this.controller.value.setupWithProvider({ useEnterpriseProvider: true, useSocialProvider: undefined, additionalScopes: options?.additionalScopes, forceAnonymous: options?.forceAnonymous });
					break;
				case ChatSetupStrategy.SetupWithoutEnterpriseProvider:
					success = await this.controller.value.setupWithProvider({ useEnterpriseProvider: false, useSocialProvider: undefined, additionalScopes: options?.additionalScopes, forceAnonymous: options?.forceAnonymous });
					break;
				case ChatSetupStrategy.SetupWithAppleProvider:
					success = await this.controller.value.setupWithProvider({ useEnterpriseProvider: false, useSocialProvider: 'apple', additionalScopes: options?.additionalScopes, forceAnonymous: options?.forceAnonymous });
					break;
				case ChatSetupStrategy.SetupWithGoogleProvider:
					success = await this.controller.value.setupWithProvider({ useEnterpriseProvider: false, useSocialProvider: 'google', additionalScopes: options?.additionalScopes, forceAnonymous: options?.forceAnonymous });
					break;
				case ChatSetupStrategy.DefaultSetup:
					success = await this.controller.value.setup({ ...options, forceAnonymous: options?.forceAnonymous });
					break;
				case ChatSetupStrategy.Canceled:
					this.context.update({ later: true });
					this.telemetryService.publicLog2<InstallChatEvent, InstallChatClassification>('commandCenter.chatInstall', { installResult: 'failedMaybeLater', installDuration: 0, signUpErrorCode: undefined, provider: undefined });
					break;
			}
		} catch (error) {
			this.logService.error(`[chat setup] Error during setup: ${toErrorMessage(error)}`);
			success = false;
		}

		return { success, dialogSkipped };
	}

	private async showDialog(options?: { forceSignInDialog?: boolean; forceAnonymous?: ChatSetupAnonymous }): Promise<ChatSetupStrategy> {
		const disposables = new DisposableStore();

		const buttons = this.getButtons(options);

		const dialog = disposables.add(new Dialog(
			this.layoutService.activeContainer,
			this.getDialogTitle(options),
			buttons.map(button => button[0]),
			createWorkbenchDialogOptions({
				type: 'none',
				extraClasses: ['chat-setup-dialog'],
				detail: ' ', // workaround allowing us to render the message in large
				icon: Codicon.copilotLarge,
				alignment: DialogContentsAlignment.Vertical,
				cancelId: buttons.length - 1,
				disableCloseButton: true,
				renderFooter: footer => footer.appendChild(this.createDialogFooter(disposables, options)),
				buttonOptions: buttons.map(button => button[2])
			}, this.keybindingService, this.layoutService)
		));

		const { button } = await dialog.show();
		disposables.dispose();

		return buttons[button]?.[1] ?? ChatSetupStrategy.Canceled;
	}

	private getButtons(options?: { forceSignInDialog?: boolean; forceAnonymous?: ChatSetupAnonymous }): Array<[string, ChatSetupStrategy, { styleButton?: (button: IButton) => void } | undefined]> {
		type ContinueWithButton = [string, ChatSetupStrategy, { styleButton?: (button: IButton) => void } | undefined];
		const styleButton = (...classes: string[]) => ({ styleButton: (button: IButton) => button.element.classList.add(...classes) });

		let buttons: Array<ContinueWithButton>;
		if (!options?.forceAnonymous && (this.context.state.entitlement === ChatEntitlement.Unknown || options?.forceSignInDialog)) {
			const defaultProviderButton: ContinueWithButton = [localize('continueWith', "Continue with {0}", defaultChat.provider.default.name), ChatSetupStrategy.SetupWithoutEnterpriseProvider, styleButton('continue-button', 'default')];
			const defaultProviderLink: ContinueWithButton = [defaultProviderButton[0], defaultProviderButton[1], styleButton('link-button')];

			const enterpriseProviderButton: ContinueWithButton = [localize('continueWith', "Continue with {0}", defaultChat.provider.enterprise.name), ChatSetupStrategy.SetupWithEnterpriseProvider, styleButton('continue-button', 'default')];
			const enterpriseProviderLink: ContinueWithButton = [enterpriseProviderButton[0], enterpriseProviderButton[1], styleButton('link-button')];

			const googleProviderButton: ContinueWithButton = [localize('continueWith', "Continue with {0}", defaultChat.provider.google.name), ChatSetupStrategy.SetupWithGoogleProvider, styleButton('continue-button', 'google')];
			const appleProviderButton: ContinueWithButton = [localize('continueWith', "Continue with {0}", defaultChat.provider.apple.name), ChatSetupStrategy.SetupWithAppleProvider, styleButton('continue-button', 'apple')];

			if (ChatEntitlementRequests.providerId(this.configurationService) !== defaultChat.provider.enterprise.id) {
				buttons = coalesce([
					defaultProviderButton,
					googleProviderButton,
					appleProviderButton,
					enterpriseProviderLink
				]);
			} else {
				buttons = coalesce([
					enterpriseProviderButton,
					googleProviderButton,
					appleProviderButton,
					defaultProviderLink
				]);
			}
		} else {
			buttons = [[localize('setupAIButton', "Use AI Features"), ChatSetupStrategy.DefaultSetup, undefined]];
		}

		buttons.push([localize('skipForNow', "Skip for now"), ChatSetupStrategy.Canceled, styleButton('link-button', 'skip-button')]);

		return buttons;
	}

	private getDialogTitle(options?: { forceSignInDialog?: boolean; forceAnonymous?: ChatSetupAnonymous }): string {
		if (this.chatEntitlementService.anonymous) {
			if (options?.forceAnonymous) {
				return localize('startUsing', "Start using AI Features");
			} else {
				return localize('enableMore', "Enable more AI features");
			}
		}

		if (this.context.state.entitlement === ChatEntitlement.Unknown || options?.forceSignInDialog) {
			return localize('signIn', "Sign in to use AI Features");
		}

		return localize('startUsing', "Start using AI Features");
	}

	private createDialogFooter(disposables: DisposableStore, options?: { forceAnonymous?: ChatSetupAnonymous }): HTMLElement {
		const element = $('.chat-setup-dialog-footer');


		let footer: string;
		if (options?.forceAnonymous || this.telemetryService.telemetryLevel === TelemetryLevel.NONE) {
			footer = localize({ key: 'settingsAnonymous', comment: ['{Locked="["}', '{Locked="]({1})"}', '{Locked="]({2})"}'] }, "By continuing, you agree to {0}'s [Terms]({1}) and [Privacy Statement]({2}).", defaultChat.provider.default.name, defaultChat.termsStatementUrl, defaultChat.privacyStatementUrl);
		} else {
			footer = localize({ key: 'settings', comment: ['{Locked="["}', '{Locked="]({1})"}', '{Locked="]({2})"}', '{Locked="]({4})"}', '{Locked="]({5})"}'] }, "By continuing, you agree to {0}'s [Terms]({1}) and [Privacy Statement]({2}). {3} Copilot may show [public code]({4}) suggestions and use your data to improve the product. You can change these [settings]({5}) anytime.", defaultChat.provider.default.name, defaultChat.termsStatementUrl, defaultChat.privacyStatementUrl, defaultChat.provider.default.name, defaultChat.publicCodeMatchesUrl, defaultChat.manageSettingsUrl);
		}
		element.appendChild($('p', undefined, disposables.add(this.markdownRendererService.render(new MarkdownString(footer, { isTrusted: true }))).element));

		return element;
	}
}

//#endregion

export function refreshTokens(commandService: ICommandService): void {
	// ugly, but we need to signal to the extension that entitlements changed
	commandService.executeCommand(defaultChat.completionsRefreshTokenCommand);
	commandService.executeCommand(defaultChat.chatRefreshTokenCommand);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatSetup/media/apple-dark.svg]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatSetup/media/apple-dark.svg

```text
<svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.20784 4.15385C9.98439 4.15385 10.9578 3.60458 11.5376 2.87222C12.0624 2.20852 12.4454 1.28162 12.4454 0.354737C12.4454 0.228862 12.4344 0.102988 12.4126 0C11.5484 0.0343294 10.5094 0.606485 9.88596 1.37318C9.39377 1.95677 8.94534 2.87222 8.94534 3.81056C8.94534 3.94787 8.96721 4.08518 8.97814 4.13096C9.03285 4.14241 9.12034 4.15385 9.20784 4.15385ZM6.47345 18C7.53438 18 8.00471 17.2562 9.32816 17.2562C10.6735 17.2562 10.9688 17.9772 12.15 17.9772C13.3094 17.9772 14.086 16.8558 14.8188 15.7572C15.6391 14.4984 15.9781 13.2625 16 13.2054C15.9235 13.1824 13.7031 12.2327 13.7031 9.56644C13.7031 7.25493 15.4531 6.2136 15.5516 6.1335C14.3923 4.39415 12.6313 4.34838 12.15 4.34838C10.8485 4.34838 9.78752 5.17229 9.12034 5.17229C8.39846 5.17229 7.44689 4.39415 6.32033 4.39415C4.17656 4.39415 2 6.24793 2 9.74952C2 11.9238 2.80938 14.2237 3.80469 15.7114C4.65781 16.9702 5.40157 18 6.47345 18Z" fill="white"/>
</svg>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatSetup/media/apple-light.svg]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatSetup/media/apple-light.svg

```text
<svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.20784 4.15385C9.98439 4.15385 10.9578 3.60458 11.5376 2.87222C12.0624 2.20852 12.4454 1.28162 12.4454 0.354737C12.4454 0.228862 12.4344 0.102988 12.4126 0C11.5484 0.0343294 10.5094 0.606485 9.88596 1.37318C9.39377 1.95677 8.94534 2.87222 8.94534 3.81056C8.94534 3.94787 8.96721 4.08518 8.97814 4.13096C9.03285 4.14241 9.12034 4.15385 9.20784 4.15385ZM6.47345 18C7.53438 18 8.00471 17.2562 9.32816 17.2562C10.6735 17.2562 10.9688 17.9772 12.15 17.9772C13.3094 17.9772 14.086 16.8558 14.8188 15.7572C15.6391 14.4984 15.9781 13.2625 16 13.2054C15.9235 13.1824 13.7031 12.2327 13.7031 9.56644C13.7031 7.25493 15.4531 6.2136 15.5516 6.1335C14.3923 4.39415 12.6313 4.34838 12.15 4.34838C10.8485 4.34838 9.78752 5.17229 9.12034 5.17229C8.39846 5.17229 7.44689 4.39415 6.32033 4.39415C4.17656 4.39415 2 6.24793 2 9.74952C2 11.9238 2.80938 14.2237 3.80469 15.7114C4.65781 16.9702 5.40157 18 6.47345 18Z" fill="black"/>
</svg>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatSetup/media/chatSetup.css]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatSetup/media/chatSetup.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.chat-setup-dialog {

	/* Continue Buttons */

	.dialog-buttons-row > .dialog-buttons > .monaco-button.continue-button::before {
		content: '';
		background-size: 16px;
		background-repeat: no-repeat;
		background-position: left center;
		padding-right: 6px;
		width: 16px;
		height: 22px;
		line-height: inherit !important;
		display: inline-block;
	}

	.dialog-buttons-row > .dialog-buttons > .monaco-button.continue-button.default::before {
		background-image: url('./github.svg');
	}

	.dialog-buttons-row > .dialog-buttons > .monaco-button.continue-button.google::before {
		background-image: url('./google.svg');
	}

	/* Link Buttons */

	.dialog-buttons-row > .dialog-buttons > .monaco-button.link-button {
		border: 0 !important;
		background-color: unset !important;
		color: var(--vscode-textLink-foreground) !important;
		width: fit-content;
		margin-left: auto;
		margin-right: auto;
	}

	.dialog-buttons-row > .dialog-buttons > .monaco-button.link-button.skip-button {
		font-size: 11px;
		color: var(--vscode-descriptionForeground) !important;
	}

	/* Footer */

	.chat-setup-dialog-footer {
		font-size: 11px;
		color: var(--vscode-descriptionForeground);
	}
}

.monaco-workbench.hc-light .chat-setup-dialog .dialog-buttons-row > .dialog-buttons > .monaco-button.continue-button.apple::before {
	background-image: url('./apple-light.svg');
}

.chat-setup-dialog .dialog-buttons-row > .dialog-buttons > .monaco-button.continue-button.apple::before {
	background-image: url('./apple-dark.svg');
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatSetup/media/github.svg]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatSetup/media/github.svg

```text
<svg width="98" height="96" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" fill="#fff"/></svg>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatSetup/media/google.svg]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatSetup/media/google.svg

```text
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15.68 8.18184C15.68 7.61456 15.6291 7.06912 15.5346 6.54544H8V9.64H12.3054C12.12 10.64 11.5564 11.4873 10.7091 12.0546V14.0618H13.2946C14.8073 12.6691 15.68 10.6182 15.68 8.18184Z" fill="#4285F4"/>
<path d="M7.99995 16C10.16 16 11.9708 15.2836 13.2944 14.0618L10.709 12.0545C9.99267 12.5345 9.07627 12.8181 7.99995 12.8181C5.91627 12.8181 4.15267 11.4109 3.52355 9.51999H0.85083V11.5927C2.16723 14.2073 4.87267 16 7.99995 16Z" fill="#34A853"/>
<path d="M3.5236 9.52001C3.3636 9.04001 3.27272 8.52729 3.27272 8.00001C3.27272 7.47273 3.3636 6.96001 3.5236 6.48001V4.40729H0.85088C0.30912 5.48729 0 6.70913 0 8.00001C0 9.29089 0.30912 10.5127 0.85088 11.5927L3.5236 9.52001Z" fill="#FBBC04"/>
<path d="M7.99995 3.18184C9.17443 3.18184 10.229 3.58544 11.0581 4.37816L13.3527 2.0836C11.9672 0.79272 10.1563 0 7.99995 0C4.87267 0 2.16723 1.79272 0.85083 4.40728L3.52355 6.48C4.15267 4.58912 5.91627 3.18184 7.99995 3.18184Z" fill="#E94235"/>
</svg>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatStatus/chatStatus.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatStatus/chatStatus.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ChatEntitlement, IChatEntitlementService } from '../../../../services/chat/common/chatEntitlementService.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import product from '../../../../../platform/product/common/product.js';
import { isObject } from '../../../../../base/common/types.js';

export function isNewUser(chatEntitlementService: IChatEntitlementService): boolean {
	return !chatEntitlementService.sentiment.installed ||					// chat not installed
		chatEntitlementService.entitlement === ChatEntitlement.Available;	// not yet signed up to chat
}

export function isCompletionsEnabled(configurationService: IConfigurationService, modeId: string = '*'): boolean {
	const result = configurationService.getValue<Record<string, boolean>>(product.defaultChatAgent.completionsEnablementSetting);
	if (!isObject(result)) {
		return false;
	}

	if (typeof result[modeId] !== 'undefined') {
		return Boolean(result[modeId]); // go with setting if explicitly defined
	}

	return Boolean(result['*']); // fallback to global setting otherwise
}
```

--------------------------------------------------------------------------------

````
