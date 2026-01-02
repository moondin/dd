---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 388
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 388 of 552)

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

---[FILE: src/vs/workbench/contrib/extensions/browser/extensionFeaturesTab.ts]---
Location: vscode-main/src/vs/workbench/contrib/extensions/browser/extensionFeaturesTab.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, DisposableStore, IDisposable, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { $, append, clearNode, addDisposableListener, EventType } from '../../../../base/browser/dom.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { ExtensionIdentifier, IExtensionManifest } from '../../../../platform/extensions/common/extensions.js';
import { Orientation, Sizing, SplitView } from '../../../../base/browser/ui/splitview/splitview.js';
import { IExtensionFeatureDescriptor, Extensions, IExtensionFeaturesRegistry, IExtensionFeatureRenderer, IExtensionFeaturesManagementService, IExtensionFeatureTableRenderer, IExtensionFeatureMarkdownRenderer, ITableData, IRenderedData, IExtensionFeatureMarkdownAndTableRenderer } from '../../../services/extensionManagement/common/extensionFeatures.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { localize } from '../../../../nls.js';
import { WorkbenchList } from '../../../../platform/list/browser/listService.js';
import { getExtensionId } from '../../../../platform/extensionManagement/common/extensionManagementUtil.js';
import { IListRenderer, IListVirtualDelegate } from '../../../../base/browser/ui/list/list.js';
import { Button } from '../../../../base/browser/ui/button/button.js';
import { defaultButtonStyles, defaultKeybindingLabelStyles } from '../../../../platform/theme/browser/defaultStyles.js';
import { getErrorMessage } from '../../../../base/common/errors.js';
import { PANEL_SECTION_BORDER } from '../../../common/theme.js';
import { IThemeService, Themable } from '../../../../platform/theme/common/themeService.js';
import { DomScrollableElement } from '../../../../base/browser/ui/scrollbar/scrollableElement.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import Severity from '../../../../base/common/severity.js';
import { errorIcon, infoIcon, warningIcon } from './extensionsIcons.js';
import { SeverityIcon } from '../../../../base/browser/ui/severityIcon/severityIcon.js';
import { KeybindingLabel } from '../../../../base/browser/ui/keybindingLabel/keybindingLabel.js';
import { OS } from '../../../../base/common/platform.js';
import { IMarkdownString, MarkdownString, isMarkdownString } from '../../../../base/common/htmlContent.js';
import { Color } from '../../../../base/common/color.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { ResolvedKeybinding } from '../../../../base/common/keybindings.js';
import { asCssVariable } from '../../../../platform/theme/common/colorUtils.js';
import { foreground, chartAxis, chartGuide, chartLine } from '../../../../platform/theme/common/colorRegistry.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { IMarkdownRendererService } from '../../../../platform/markdown/browser/markdownRenderer.js';

interface IExtensionFeatureElementRenderer extends IExtensionFeatureRenderer {
	type: 'element';
	render(manifest: IExtensionManifest): IRenderedData<HTMLElement>;
}

class RuntimeStatusMarkdownRenderer extends Disposable implements IExtensionFeatureElementRenderer {

	static readonly ID = 'runtimeStatus';
	readonly type = 'element';

	constructor(
		@IExtensionService private readonly extensionService: IExtensionService,
		@IHoverService private readonly hoverService: IHoverService,
		@IExtensionFeaturesManagementService private readonly extensionFeaturesManagementService: IExtensionFeaturesManagementService,
		@IMarkdownRendererService private readonly markdownRendererService: IMarkdownRendererService,
	) {
		super();
	}

	shouldRender(manifest: IExtensionManifest): boolean {
		const extensionId = new ExtensionIdentifier(getExtensionId(manifest.publisher, manifest.name));
		if (!this.extensionService.extensions.some(e => ExtensionIdentifier.equals(e.identifier, extensionId))) {
			return false;
		}
		return !!manifest.main || !!manifest.browser;
	}

	render(manifest: IExtensionManifest): IRenderedData<HTMLElement> {
		const disposables = new DisposableStore();
		const extensionId = new ExtensionIdentifier(getExtensionId(manifest.publisher, manifest.name));
		const emitter = disposables.add(new Emitter<HTMLElement>());
		disposables.add(this.extensionService.onDidChangeExtensionsStatus(e => {
			if (e.some(extension => ExtensionIdentifier.equals(extension, extensionId))) {
				emitter.fire(this.createElement(manifest, disposables));
			}
		}));
		disposables.add(this.extensionFeaturesManagementService.onDidChangeAccessData(e => emitter.fire(this.createElement(manifest, disposables))));
		return {
			onDidChange: emitter.event,
			data: this.createElement(manifest, disposables),
			dispose: () => disposables.dispose()
		};
	}

	private createElement(manifest: IExtensionManifest, disposables: DisposableStore): HTMLElement {
		const container = $('.runtime-status');
		const extensionId = new ExtensionIdentifier(getExtensionId(manifest.publisher, manifest.name));
		const status = this.extensionService.getExtensionsStatus()[extensionId.value];
		if (this.extensionService.extensions.some(extension => ExtensionIdentifier.equals(extension.identifier, extensionId))) {
			const data = new MarkdownString();
			data.appendMarkdown(`### ${localize('activation', "Activation")}\n\n`);
			if (status.activationTimes) {
				if (status.activationTimes.activationReason.startup) {
					data.appendMarkdown(`Activated on Startup: \`${status.activationTimes.activateCallTime}ms\``);
				} else {
					data.appendMarkdown(`Activated by \`${status.activationTimes.activationReason.activationEvent}\` event: \`${status.activationTimes.activateCallTime}ms\``);
				}
			} else {
				data.appendMarkdown('Not yet activated');
			}
			this.renderMarkdown(data, container, disposables);
		}
		const features = Registry.as<IExtensionFeaturesRegistry>(Extensions.ExtensionFeaturesRegistry).getExtensionFeatures();
		for (const feature of features) {
			const accessData = this.extensionFeaturesManagementService.getAccessData(extensionId, feature.id);
			if (accessData) {
				this.renderMarkdown(new MarkdownString(`\n ### ${localize('label', "{0} Usage", feature.label)}\n\n`), container, disposables);
				if (accessData.accessTimes.length) {
					const description = append(container,
						$('.feature-chart-description',
							undefined,
							localize('chartDescription', "There were {0} {1} requests from this extension in the last 30 days.", accessData?.accessTimes.length, feature.accessDataLabel ?? feature.label)));
					description.style.marginBottom = '8px';
					this.renderRequestsChart(container, accessData.accessTimes, disposables);
				}
				const status = accessData?.current?.status;
				if (status) {
					const data = new MarkdownString();
					if (status?.severity === Severity.Error) {
						data.appendMarkdown(`$(${errorIcon.id}) ${status.message}\n\n`);
					}
					if (status?.severity === Severity.Warning) {
						data.appendMarkdown(`$(${warningIcon.id}) ${status.message}\n\n`);
					}
					if (data.value) {
						this.renderMarkdown(data, container, disposables);
					}
				}
			}
		}
		if (status.runtimeErrors.length || status.messages.length) {
			const data = new MarkdownString();
			if (status.runtimeErrors.length) {
				data.appendMarkdown(`\n ### ${localize('uncaught errors', "Uncaught Errors ({0})", status.runtimeErrors.length)}\n`);
				for (const error of status.runtimeErrors) {
					data.appendMarkdown(`$(${Codicon.error.id})&nbsp;${getErrorMessage(error)}\n\n`);
				}
			}
			if (status.messages.length) {
				data.appendMarkdown(`\n ### ${localize('messaages', "Messages ({0})", status.messages.length)}\n`);
				for (const message of status.messages) {
					data.appendMarkdown(`$(${(message.type === Severity.Error ? Codicon.error : message.type === Severity.Warning ? Codicon.warning : Codicon.info).id})&nbsp;${message.message}\n\n`);
				}
			}
			if (data.value) {
				this.renderMarkdown(data, container, disposables);
			}
		}
		return container;
	}

	private renderMarkdown(markdown: IMarkdownString, container: HTMLElement, disposables: DisposableStore): void {
		const { element } = disposables.add(this.markdownRendererService.render({
			value: markdown.value,
			isTrusted: markdown.isTrusted,
			supportThemeIcons: true
		}));
		append(container, element);
	}

	private renderRequestsChart(container: HTMLElement, accessTimes: Date[], disposables: DisposableStore): void {
		const width = 450;
		const height = 250;
		const margin = { top: 0, right: 4, bottom: 20, left: 4 };
		const innerWidth = width - margin.left - margin.right;
		const innerHeight = height - margin.top - margin.bottom;

		const chartContainer = append(container, $('.feature-chart-container'));
		chartContainer.style.position = 'relative';

		const tooltip = append(chartContainer, $('.feature-chart-tooltip'));
		tooltip.style.position = 'absolute';
		tooltip.style.width = '0px';
		tooltip.style.height = '0px';

		let maxCount = 100;
		const map = new Map<string, number>();
		for (const accessTime of accessTimes) {
			const day = `${accessTime.getDate()} ${accessTime.toLocaleString('default', { month: 'short' })}`;
			map.set(day, (map.get(day) ?? 0) + 1);
			maxCount = Math.max(maxCount, map.get(day)!);
		}

		const now = new Date();
		type Point = { x: number; y: number; date: string; count: number };
		const points: Point[] = [];
		for (let i = 0; i <= 30; i++) {
			const date = new Date(now);
			date.setDate(now.getDate() - (30 - i));
			const dateString = `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;
			const count = map.get(dateString) ?? 0;
			const x = (i / 30) * innerWidth;
			const y = innerHeight - (count / maxCount) * innerHeight;
			points.push({ x, y, date: dateString, count });
		}

		const chart = append(chartContainer, $('.feature-chart'));
		const svg = append(chart, $.SVG('svg'));
		svg.setAttribute('width', `${width}px`);
		svg.setAttribute('height', `${height}px`);
		svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

		const g = $.SVG('g');
		g.setAttribute('transform', `translate(${margin.left},${margin.top})`);
		svg.appendChild(g);

		const xAxisLine = $.SVG('line');
		xAxisLine.setAttribute('x1', '0');
		xAxisLine.setAttribute('y1', `${innerHeight}`);
		xAxisLine.setAttribute('x2', `${innerWidth}`);
		xAxisLine.setAttribute('y2', `${innerHeight}`);
		xAxisLine.setAttribute('stroke', asCssVariable(chartAxis));
		xAxisLine.setAttribute('stroke-width', '1px');
		g.appendChild(xAxisLine);

		for (let i = 1; i <= 30; i += 7) {
			const date = new Date(now);
			date.setDate(now.getDate() - (30 - i));
			const dateString = `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;
			const x = (i / 30) * innerWidth;

			// Add vertical line
			const tick = $.SVG('line');
			tick.setAttribute('x1', `${x}`);
			tick.setAttribute('y1', `${innerHeight}`);
			tick.setAttribute('x2', `${x}`);
			tick.setAttribute('y2', `${innerHeight + 10}`);
			tick.setAttribute('stroke', asCssVariable(chartAxis));
			tick.setAttribute('stroke-width', '1px');
			g.appendChild(tick);

			const ruler = $.SVG('line');
			ruler.setAttribute('x1', `${x}`);
			ruler.setAttribute('y1', `0`);
			ruler.setAttribute('x2', `${x}`);
			ruler.setAttribute('y2', `${innerHeight}`);
			ruler.setAttribute('stroke', asCssVariable(chartGuide));
			ruler.setAttribute('stroke-width', '1px');
			g.appendChild(ruler);

			const xAxisDate = $.SVG('text');
			xAxisDate.setAttribute('x', `${x}`);
			xAxisDate.setAttribute('y', `${height}`); // Adjusted y position to be within the SVG view port
			xAxisDate.setAttribute('text-anchor', 'middle');
			xAxisDate.setAttribute('fill', asCssVariable(foreground));
			xAxisDate.setAttribute('font-size', '10px');
			xAxisDate.textContent = dateString;
			g.appendChild(xAxisDate);
		}

		const line = $.SVG('polyline');
		line.setAttribute('fill', 'none');
		line.setAttribute('stroke', asCssVariable(chartLine));
		line.setAttribute('stroke-width', `2px`);
		line.setAttribute('points', points.map(p => `${p.x},${p.y}`).join(' '));
		g.appendChild(line);

		const highlightCircle = $.SVG('circle');
		highlightCircle.setAttribute('r', `4px`);
		highlightCircle.style.display = 'none';
		g.appendChild(highlightCircle);

		const hoverDisposable = disposables.add(new MutableDisposable<IDisposable>());
		const mouseMoveListener = (event: MouseEvent): void => {
			const rect = svg.getBoundingClientRect();
			const mouseX = event.clientX - rect.left - margin.left;

			let closestPoint: Point | undefined;
			let minDistance = Infinity;

			points.forEach(point => {
				const distance = Math.abs(point.x - mouseX);
				if (distance < minDistance) {
					minDistance = distance;
					closestPoint = point;
				}
			});

			if (closestPoint) {
				highlightCircle.setAttribute('cx', `${closestPoint.x}`);
				highlightCircle.setAttribute('cy', `${closestPoint.y}`);
				highlightCircle.style.display = 'block';
				tooltip.style.left = `${closestPoint.x + 24}px`;
				tooltip.style.top = `${closestPoint.y + 14}px`;
				hoverDisposable.value = this.hoverService.showInstantHover({
					content: new MarkdownString(`${closestPoint.date}: ${closestPoint.count} requests`),
					target: tooltip,
					appearance: {
						showPointer: true,
						skipFadeInAnimation: true,
					}
				});
			} else {
				hoverDisposable.value = undefined;
			}
		};
		disposables.add(addDisposableListener(svg, EventType.MOUSE_MOVE, mouseMoveListener));

		const mouseLeaveListener = () => {
			highlightCircle.style.display = 'none';
			hoverDisposable.value = undefined;
		};
		disposables.add(addDisposableListener(svg, EventType.MOUSE_LEAVE, mouseLeaveListener));
	}
}


interface ILayoutParticipant {
	layout(height?: number, width?: number): void;
}

const runtimeStatusFeature = {
	id: RuntimeStatusMarkdownRenderer.ID,
	label: localize('runtime', "Runtime Status"),
	access: {
		canToggle: false
	},
	renderer: new SyncDescriptor(RuntimeStatusMarkdownRenderer),
};

export class ExtensionFeaturesTab extends Themable {

	readonly domNode: HTMLElement;

	private readonly featureView = this._register(new MutableDisposable<ExtensionFeatureView>());
	private featureViewDimension?: { height?: number; width?: number };

	private readonly layoutParticipants: ILayoutParticipant[] = [];
	private readonly extensionId: ExtensionIdentifier;

	constructor(
		private readonly manifest: IExtensionManifest,
		private readonly feature: string | undefined,
		@IThemeService themeService: IThemeService,
		@IInstantiationService private readonly instantiationService: IInstantiationService
	) {
		super(themeService);

		this.extensionId = new ExtensionIdentifier(getExtensionId(manifest.publisher, manifest.name));
		this.domNode = $('div.subcontent.feature-contributions');
		this.create();
	}

	layout(height?: number, width?: number): void {
		this.layoutParticipants.forEach(participant => participant.layout(height, width));
	}

	private create(): void {
		const features = this.getFeatures();
		if (features.length === 0) {
			append($('.no-features'), this.domNode).textContent = localize('noFeatures', "No features contributed.");
			return;
		}

		const splitView = this._register(new SplitView<number>(this.domNode, {
			orientation: Orientation.HORIZONTAL,
			proportionalLayout: true
		}));
		this.layoutParticipants.push({
			layout: (height: number, width: number) => {
				splitView.el.style.height = `${height - 14}px`;
				splitView.layout(width);
			}
		});

		const featuresListContainer = $('.features-list-container');
		const list = this._register(this.createFeaturesList(featuresListContainer));
		list.splice(0, list.length, features);

		const featureViewContainer = $('.feature-view-container');
		this._register(list.onDidChangeSelection(e => {
			const feature = e.elements[0];
			if (feature) {
				this.showFeatureView(feature, featureViewContainer);
			}
		}));

		const index = this.feature ? features.findIndex(f => f.id === this.feature) : 0;
		list.setSelection([index === -1 ? 0 : index]);

		splitView.addView({
			onDidChange: Event.None,
			element: featuresListContainer,
			minimumSize: 100,
			maximumSize: Number.POSITIVE_INFINITY,
			layout: (width, _, height) => {
				featuresListContainer.style.width = `${width}px`;
				list.layout(height, width);
			}
		}, 200, undefined, true);

		splitView.addView({
			onDidChange: Event.None,
			element: featureViewContainer,
			minimumSize: 500,
			maximumSize: Number.POSITIVE_INFINITY,
			layout: (width, _, height) => {
				featureViewContainer.style.width = `${width}px`;
				this.featureViewDimension = { height, width };
				this.layoutFeatureView();
			}
		}, Sizing.Distribute, undefined, true);

		splitView.style({
			separatorBorder: this.theme.getColor(PANEL_SECTION_BORDER)!
		});
	}

	private createFeaturesList(container: HTMLElement): WorkbenchList<IExtensionFeatureDescriptor> {
		const renderer = this.instantiationService.createInstance(ExtensionFeatureItemRenderer, this.extensionId);
		const delegate = new ExtensionFeatureItemDelegate();
		const list = this.instantiationService.createInstance(WorkbenchList, 'ExtensionFeaturesList', append(container, $('.features-list-wrapper')), delegate, [renderer], {
			multipleSelectionSupport: false,
			setRowLineHeight: false,
			horizontalScrolling: false,
			accessibilityProvider: {
				getAriaLabel(extensionFeature: IExtensionFeatureDescriptor | null): string {
					return extensionFeature?.label ?? '';
				},
				getWidgetAriaLabel(): string {
					return localize('extension features list', "Extension Features");
				}
			},
			openOnSingleClick: true
		}) as WorkbenchList<IExtensionFeatureDescriptor>;
		return list;
	}

	private layoutFeatureView(): void {
		this.featureView.value?.layout(this.featureViewDimension?.height, this.featureViewDimension?.width);
	}

	private showFeatureView(feature: IExtensionFeatureDescriptor, container: HTMLElement): void {
		if (this.featureView.value?.feature.id === feature.id) {
			return;
		}
		clearNode(container);
		this.featureView.value = this.instantiationService.createInstance(ExtensionFeatureView, this.extensionId, this.manifest, feature);
		container.appendChild(this.featureView.value.domNode);
		this.layoutFeatureView();
	}

	private getFeatures(): IExtensionFeatureDescriptor[] {
		const features = Registry.as<IExtensionFeaturesRegistry>(Extensions.ExtensionFeaturesRegistry)
			.getExtensionFeatures().filter(feature => {
				const renderer = this.getRenderer(feature);
				const shouldRender = renderer?.shouldRender(this.manifest);
				renderer?.dispose();
				return shouldRender;
			}).sort((a, b) => a.label.localeCompare(b.label));

		const renderer = this.getRenderer(runtimeStatusFeature);
		if (renderer?.shouldRender(this.manifest)) {
			features.splice(0, 0, runtimeStatusFeature);
		}
		renderer?.dispose();
		return features;
	}

	private getRenderer(feature: IExtensionFeatureDescriptor): IExtensionFeatureRenderer | undefined {
		return feature.renderer ? this.instantiationService.createInstance(feature.renderer) : undefined;
	}

}

interface IExtensionFeatureItemTemplateData {
	readonly label: HTMLElement;
	readonly disabledElement: HTMLElement;
	readonly statusElement: HTMLElement;
	readonly disposables: DisposableStore;
}

class ExtensionFeatureItemDelegate implements IListVirtualDelegate<IExtensionFeatureDescriptor> {
	getHeight() { return 22; }
	getTemplateId() { return 'extensionFeatureDescriptor'; }
}

class ExtensionFeatureItemRenderer implements IListRenderer<IExtensionFeatureDescriptor, IExtensionFeatureItemTemplateData> {

	readonly templateId = 'extensionFeatureDescriptor';

	constructor(
		private readonly extensionId: ExtensionIdentifier,
		@IExtensionFeaturesManagementService private readonly extensionFeaturesManagementService: IExtensionFeaturesManagementService
	) { }

	renderTemplate(container: HTMLElement): IExtensionFeatureItemTemplateData {
		container.classList.add('extension-feature-list-item');
		const label = append(container, $('.extension-feature-label'));
		const disabledElement = append(container, $('.extension-feature-disabled-label'));
		disabledElement.textContent = localize('revoked', "No Access");
		const statusElement = append(container, $('.extension-feature-status'));
		return { label, disabledElement, statusElement, disposables: new DisposableStore() };
	}

	renderElement(element: IExtensionFeatureDescriptor, index: number, templateData: IExtensionFeatureItemTemplateData) {
		templateData.disposables.clear();
		templateData.label.textContent = element.label;
		templateData.disabledElement.style.display = element.id === runtimeStatusFeature.id || this.extensionFeaturesManagementService.isEnabled(this.extensionId, element.id) ? 'none' : 'inherit';

		templateData.disposables.add(this.extensionFeaturesManagementService.onDidChangeEnablement(({ extension, featureId, enabled }) => {
			if (ExtensionIdentifier.equals(extension, this.extensionId) && featureId === element.id) {
				templateData.disabledElement.style.display = enabled ? 'none' : 'inherit';
			}
		}));

		const statusElementClassName = templateData.statusElement.className;
		const updateStatus = () => {
			const accessData = this.extensionFeaturesManagementService.getAccessData(this.extensionId, element.id);
			if (accessData?.current?.status) {
				templateData.statusElement.style.display = 'inherit';
				templateData.statusElement.className = `${statusElementClassName} ${SeverityIcon.className(accessData.current.status.severity)}`;
			} else {
				templateData.statusElement.style.display = 'none';
			}
		};
		updateStatus();
		templateData.disposables.add(this.extensionFeaturesManagementService.onDidChangeAccessData(({ extension, featureId }) => {
			if (ExtensionIdentifier.equals(extension, this.extensionId) && featureId === element.id) {
				updateStatus();
			}
		}));
	}

	disposeElement(element: IExtensionFeatureDescriptor, index: number, templateData: IExtensionFeatureItemTemplateData): void {
		templateData.disposables.dispose();
	}

	disposeTemplate(templateData: IExtensionFeatureItemTemplateData) {
		templateData.disposables.dispose();
	}

}

class ExtensionFeatureView extends Disposable {

	readonly domNode: HTMLElement;
	private readonly layoutParticipants: ILayoutParticipant[] = [];

	constructor(
		private readonly extensionId: ExtensionIdentifier,
		private readonly manifest: IExtensionManifest,
		readonly feature: IExtensionFeatureDescriptor,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IExtensionFeaturesManagementService private readonly extensionFeaturesManagementService: IExtensionFeaturesManagementService,
		@IDialogService private readonly dialogService: IDialogService,
		@IMarkdownRendererService private readonly markdownRendererService: IMarkdownRendererService,
	) {
		super();

		this.domNode = $('.extension-feature-content');
		this.create(this.domNode);
	}

	private create(content: HTMLElement): void {
		const header = append(content, $('.feature-header'));
		const title = append(header, $('.feature-title'));
		title.textContent = this.feature.label;

		if (this.feature.access.canToggle) {
			const actionsContainer = append(header, $('.feature-actions'));
			const button = new Button(actionsContainer, defaultButtonStyles);
			this.updateButtonLabel(button);
			this._register(this.extensionFeaturesManagementService.onDidChangeEnablement(({ extension, featureId }) => {
				if (ExtensionIdentifier.equals(extension, this.extensionId) && featureId === this.feature.id) {
					this.updateButtonLabel(button);
				}
			}));
			this._register(button.onDidClick(async () => {
				const enabled = this.extensionFeaturesManagementService.isEnabled(this.extensionId, this.feature.id);
				const confirmationResult = await this.dialogService.confirm({
					title: localize('accessExtensionFeature', "Enable '{0}' Feature", this.feature.label),
					message: enabled
						? localize('disableAccessExtensionFeatureMessage', "Would you like to revoke '{0}' extension to access '{1}' feature?", this.manifest.displayName ?? this.extensionId.value, this.feature.label)
						: localize('enableAccessExtensionFeatureMessage', "Would you like to allow '{0}' extension to access '{1}' feature?", this.manifest.displayName ?? this.extensionId.value, this.feature.label),
					custom: true,
					primaryButton: enabled ? localize('revoke', "Revoke Access") : localize('grant', "Allow Access"),
					cancelButton: localize('cancel', "Cancel"),
				});
				if (confirmationResult.confirmed) {
					this.extensionFeaturesManagementService.setEnablement(this.extensionId, this.feature.id, !enabled);
				}
			}));
		}

		const body = append(content, $('.feature-body'));

		const bodyContent = $('.feature-body-content');
		const scrollableContent = this._register(new DomScrollableElement(bodyContent, {}));
		append(body, scrollableContent.getDomNode());
		this.layoutParticipants.push({ layout: () => scrollableContent.scanDomNode() });
		scrollableContent.scanDomNode();

		if (this.feature.description) {
			const description = append(bodyContent, $('.feature-description'));
			description.textContent = this.feature.description;
		}

		const accessData = this.extensionFeaturesManagementService.getAccessData(this.extensionId, this.feature.id);
		if (accessData?.current?.status) {
			append(bodyContent, $('.feature-status', undefined,
				$(`span${ThemeIcon.asCSSSelector(accessData.current.status.severity === Severity.Error ? errorIcon : accessData.current.status.severity === Severity.Warning ? warningIcon : infoIcon)}`, undefined),
				$('span', undefined, accessData.current.status.message)));
		}

		const featureContentElement = append(bodyContent, $('.feature-content'));
		if (this.feature.renderer) {
			const renderer = this.instantiationService.createInstance<IExtensionFeatureRenderer>(this.feature.renderer);
			if (renderer.type === 'table') {
				this.renderTableData(featureContentElement, <IExtensionFeatureTableRenderer>renderer);
			} else if (renderer.type === 'markdown') {
				this.renderMarkdownData(featureContentElement, <IExtensionFeatureMarkdownRenderer>renderer);
			} else if (renderer.type === 'markdown+table') {
				this.renderMarkdownAndTableData(featureContentElement, <IExtensionFeatureMarkdownAndTableRenderer>renderer);
			} else if (renderer.type === 'element') {
				this.renderElementData(featureContentElement, <IExtensionFeatureElementRenderer>renderer);
			}
		}
	}

	private updateButtonLabel(button: Button): void {
		button.label = this.extensionFeaturesManagementService.isEnabled(this.extensionId, this.feature.id) ? localize('revoke', "Revoke Access") : localize('enable', "Allow Access");
	}

	private renderTableData(container: HTMLElement, renderer: IExtensionFeatureTableRenderer): void {
		const tableData = this._register(renderer.render(this.manifest));
		const tableDisposable = this._register(new MutableDisposable());
		if (tableData.onDidChange) {
			this._register(tableData.onDidChange(data => {
				clearNode(container);
				tableDisposable.value = this.renderTable(data, container);
			}));
		}
		tableDisposable.value = this.renderTable(tableData.data, container);
	}

	private renderTable(tableData: ITableData, container: HTMLElement): IDisposable {
		const disposables = new DisposableStore();
		append(container,
			$('table', undefined,
				$('tr', undefined,
					...tableData.headers.map(header => $('th', undefined, header))
				),
				...tableData.rows
					.map(row => {
						return $('tr', undefined,
							...row.map(rowData => {
								if (typeof rowData === 'string') {
									return $('td', undefined, $('p', undefined, rowData));
								}
								const data = Array.isArray(rowData) ? rowData : [rowData];
								return $('td', undefined, ...data.map(item => {
									const result: Node[] = [];
									if (isMarkdownString(rowData)) {
										const element = $('', undefined);
										this.renderMarkdown(rowData, element);
										result.push(element);
									} else if (item instanceof ResolvedKeybinding) {
										const element = $('');
										const kbl = disposables.add(new KeybindingLabel(element, OS, defaultKeybindingLabelStyles));
										kbl.set(item);
										result.push(element);
									} else if (item instanceof Color) {
										result.push($('span', { class: 'colorBox', style: 'background-color: ' + Color.Format.CSS.format(item) }, ''));
										result.push($('code', undefined, Color.Format.CSS.formatHex(item)));
									}
									return result;
								}).flat());
							})
						);
					})));
		return disposables;
	}

	private renderMarkdownAndTableData(container: HTMLElement, renderer: IExtensionFeatureMarkdownAndTableRenderer): void {
		const markdownAndTableData = this._register(renderer.render(this.manifest));
		if (markdownAndTableData.onDidChange) {
			this._register(markdownAndTableData.onDidChange(data => {
				clearNode(container);
				this.renderMarkdownAndTable(data, container);
			}));
		}
		this.renderMarkdownAndTable(markdownAndTableData.data, container);
	}

	private renderMarkdownData(container: HTMLElement, renderer: IExtensionFeatureMarkdownRenderer): void {
		container.classList.add('markdown');
		const markdownData = this._register(renderer.render(this.manifest));
		if (markdownData.onDidChange) {
			this._register(markdownData.onDidChange(data => {
				clearNode(container);
				this.renderMarkdown(data, container);
			}));
		}
		this.renderMarkdown(markdownData.data, container);
	}

	private renderMarkdown(markdown: IMarkdownString, container: HTMLElement): void {
		const { element } = this._register(this.markdownRendererService.render({
			value: markdown.value,
			isTrusted: markdown.isTrusted,
			supportThemeIcons: true
		}));
		append(container, element);
	}

	private renderMarkdownAndTable(data: Array<IMarkdownString | ITableData>, container: HTMLElement): void {
		for (const markdownOrTable of data) {
			if (isMarkdownString(markdownOrTable)) {
				const element = $('', undefined);
				this.renderMarkdown(markdownOrTable, element);
				append(container, element);
			} else {
				const tableElement = append(container, $('table'));
				this.renderTable(markdownOrTable, tableElement);
			}
		}
	}

	private renderElementData(container: HTMLElement, renderer: IExtensionFeatureElementRenderer): void {
		const elementData = this._register(renderer.render(this.manifest));
		if (elementData.onDidChange) {
			this._register(elementData.onDidChange(data => {
				clearNode(container);
				container.appendChild(data);
			}));
		}
		container.appendChild(elementData.data);
	}

	layout(height?: number, width?: number): void {
		this.layoutParticipants.forEach(p => p.layout(height, width));
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/extensions/browser/extensionRecommendationNotificationService.ts]---
Location: vscode-main/src/vs/workbench/contrib/extensions/browser/extensionRecommendationNotificationService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { distinct } from '../../../../base/common/arrays.js';
import { CancelablePromise, createCancelablePromise, Promises, raceCancellablePromises, raceCancellation, timeout } from '../../../../base/common/async.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { isCancellationError } from '../../../../base/common/errors.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable, DisposableStore, MutableDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { isString } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import { localize } from '../../../../nls.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IGalleryExtension } from '../../../../platform/extensionManagement/common/extensionManagement.js';
import { areSameExtensions } from '../../../../platform/extensionManagement/common/extensionManagementUtil.js';
import { IExtensionRecommendationNotificationService, IExtensionRecommendations, RecommendationsNotificationResult, RecommendationSource, RecommendationSourceToString } from '../../../../platform/extensionRecommendations/common/extensionRecommendations.js';
import { INotificationHandle, INotificationService, IPromptChoice, IPromptChoiceWithMenu, NotificationPriority, Severity } from '../../../../platform/notification/common/notification.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IUserDataSyncEnablementService, SyncResource } from '../../../../platform/userDataSync/common/userDataSync.js';
import { IExtension, IExtensionsWorkbenchService } from '../common/extensions.js';
import { IWorkbenchEnvironmentService } from '../../../services/environment/common/environmentService.js';
import { EnablementState, IWorkbenchExtensionManagementService, IWorkbenchExtensionEnablementService } from '../../../services/extensionManagement/common/extensionManagement.js';
import { IExtensionIgnoredRecommendationsService } from '../../../services/extensionRecommendations/common/extensionRecommendations.js';

type ExtensionRecommendationsNotificationClassification = {
	owner: 'sandy081';
	comment: 'Response information when an extension is recommended';
	userReaction: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'User reaction after showing the recommendation prompt. Eg., install, cancel, show, neverShowAgain' };
	extensionId?: { classification: 'PublicNonPersonalData'; purpose: 'FeatureInsight'; comment: 'Id of the extension that is recommended' };
	source: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The source from which this recommendation is coming from. Eg., file, exe.,' };
};

type ExtensionWorkspaceRecommendationsNotificationClassification = {
	owner: 'sandy081';
	comment: 'Response information when a recommendation from workspace is recommended';
	userReaction: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'User reaction after showing the recommendation prompt. Eg., install, cancel, show, neverShowAgain' };
};

const ignoreImportantExtensionRecommendationStorageKey = 'extensionsAssistant/importantRecommendationsIgnore';
const donotShowWorkspaceRecommendationsStorageKey = 'extensionsAssistant/workspaceRecommendationsIgnore';

type RecommendationsNotificationActions = {
	onDidInstallRecommendedExtensions(extensions: IExtension[]): void;
	onDidShowRecommendedExtensions(extensions: IExtension[]): void;
	onDidCancelRecommendedExtensions(extensions: IExtension[]): void;
	onDidNeverShowRecommendedExtensionsAgain(extensions: IExtension[]): void;
};

type ExtensionRecommendations = Omit<IExtensionRecommendations, 'extensions'> & { extensions: Array<string | URI> };

class RecommendationsNotification extends Disposable {

	private _onDidClose = this._register(new Emitter<void>());
	readonly onDidClose = this._onDidClose.event;

	private _onDidChangeVisibility = this._register(new Emitter<boolean>());
	readonly onDidChangeVisibility = this._onDidChangeVisibility.event;

	private notificationHandle: INotificationHandle | undefined;
	private cancelled: boolean = false;

	constructor(
		private readonly severity: Severity,
		private readonly message: string,
		private readonly choices: IPromptChoice[],
		private readonly notificationService: INotificationService
	) {
		super();
	}

	show(): void {
		if (!this.notificationHandle) {
			this.updateNotificationHandle(this.notificationService.prompt(this.severity, this.message, this.choices, { sticky: true, priority: NotificationPriority.OPTIONAL, onCancel: () => this.cancelled = true }));
		}
	}

	hide(): void {
		if (this.notificationHandle) {
			this.onDidCloseDisposable.clear();
			this.notificationHandle.close();
			this.cancelled = false;
			this.updateNotificationHandle(this.notificationService.prompt(this.severity, this.message, this.choices, { priority: NotificationPriority.SILENT, onCancel: () => this.cancelled = true }));
		}
	}

	isCancelled(): boolean {
		return this.cancelled;
	}

	private readonly onDidCloseDisposable = this._register(new MutableDisposable());
	private readonly onDidChangeVisibilityDisposable = this._register(new MutableDisposable());
	private updateNotificationHandle(notificationHandle: INotificationHandle) {
		this.onDidCloseDisposable.clear();
		this.onDidChangeVisibilityDisposable.clear();
		this.notificationHandle = notificationHandle;

		this.onDidCloseDisposable.value = this.notificationHandle.onDidClose(() => {
			this.onDidCloseDisposable.dispose();
			this.onDidChangeVisibilityDisposable.dispose();

			this._onDidClose.fire();

			this._onDidClose.dispose();
			this._onDidChangeVisibility.dispose();
		});
		this.onDidChangeVisibilityDisposable.value = this.notificationHandle.onDidChangeVisibility((e) => this._onDidChangeVisibility.fire(e));
	}
}

type PendingRecommendationsNotification = { recommendationsNotification: RecommendationsNotification; source: RecommendationSource; token: CancellationToken };
type VisibleRecommendationsNotification = { recommendationsNotification: RecommendationsNotification; source: RecommendationSource; from: number };

export class ExtensionRecommendationNotificationService extends Disposable implements IExtensionRecommendationNotificationService {

	declare readonly _serviceBrand: undefined;

	// Ignored Important Recommendations
	get ignoredRecommendations(): string[] {
		return distinct([...(<string[]>JSON.parse(this.storageService.get(ignoreImportantExtensionRecommendationStorageKey, StorageScope.PROFILE, '[]')))].map(i => i.toLowerCase()));
	}

	private recommendedExtensions: string[] = [];
	private recommendationSources: RecommendationSource[] = [];

	private hideVisibleNotificationPromise: CancelablePromise<void> | undefined;
	private visibleNotification: VisibleRecommendationsNotification | undefined;
	private pendingNotificaitons: PendingRecommendationsNotification[] = [];

	constructor(
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IStorageService private readonly storageService: IStorageService,
		@INotificationService private readonly notificationService: INotificationService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IExtensionsWorkbenchService private readonly extensionsWorkbenchService: IExtensionsWorkbenchService,
		@IWorkbenchExtensionManagementService private readonly extensionManagementService: IWorkbenchExtensionManagementService,
		@IWorkbenchExtensionEnablementService private readonly extensionEnablementService: IWorkbenchExtensionEnablementService,
		@IExtensionIgnoredRecommendationsService private readonly extensionIgnoredRecommendationsService: IExtensionIgnoredRecommendationsService,
		@IUserDataSyncEnablementService private readonly userDataSyncEnablementService: IUserDataSyncEnablementService,
		@IWorkbenchEnvironmentService private readonly workbenchEnvironmentService: IWorkbenchEnvironmentService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
	) {
		super();
	}

	hasToIgnoreRecommendationNotifications(): boolean {
		const config = this.configurationService.getValue<{ ignoreRecommendations: boolean; showRecommendationsOnlyOnDemand?: boolean }>('extensions');
		return config.ignoreRecommendations || !!config.showRecommendationsOnlyOnDemand;
	}

	async promptImportantExtensionsInstallNotification(extensionRecommendations: IExtensionRecommendations): Promise<RecommendationsNotificationResult> {
		const ignoredRecommendations = [...this.extensionIgnoredRecommendationsService.ignoredRecommendations, ...this.ignoredRecommendations];
		const extensions = extensionRecommendations.extensions.filter(id => !ignoredRecommendations.includes(id));
		if (!extensions.length) {
			return RecommendationsNotificationResult.Ignored;
		}

		return this.promptRecommendationsNotification({ ...extensionRecommendations, extensions }, {
			onDidInstallRecommendedExtensions: (extensions: IExtension[]) => extensions.forEach(extension => this.telemetryService.publicLog2<{ userReaction: string; extensionId: string; source: string }, ExtensionRecommendationsNotificationClassification>('extensionRecommendations:popup', { userReaction: 'install', extensionId: extension.identifier.id, source: RecommendationSourceToString(extensionRecommendations.source) })),
			onDidShowRecommendedExtensions: (extensions: IExtension[]) => extensions.forEach(extension => this.telemetryService.publicLog2<{ userReaction: string; extensionId: string; source: string }, ExtensionRecommendationsNotificationClassification>('extensionRecommendations:popup', { userReaction: 'show', extensionId: extension.identifier.id, source: RecommendationSourceToString(extensionRecommendations.source) })),
			onDidCancelRecommendedExtensions: (extensions: IExtension[]) => extensions.forEach(extension => this.telemetryService.publicLog2<{ userReaction: string; extensionId: string; source: string }, ExtensionRecommendationsNotificationClassification>('extensionRecommendations:popup', { userReaction: 'cancelled', extensionId: extension.identifier.id, source: RecommendationSourceToString(extensionRecommendations.source) })),
			onDidNeverShowRecommendedExtensionsAgain: (extensions: IExtension[]) => {
				for (const extension of extensions) {
					this.addToImportantRecommendationsIgnore(extension.identifier.id);
					this.telemetryService.publicLog2<{ userReaction: string; extensionId: string; source: string }, ExtensionRecommendationsNotificationClassification>('extensionRecommendations:popup', { userReaction: 'neverShowAgain', extensionId: extension.identifier.id, source: RecommendationSourceToString(extensionRecommendations.source) });
				}
				this.notificationService.prompt(
					Severity.Info,
					localize('ignoreExtensionRecommendations', "Do you want to ignore all extension recommendations?"),
					[{
						label: localize('ignoreAll', "Yes, Ignore All"),
						run: () => this.setIgnoreRecommendationsConfig(true)
					}, {
						label: localize('no', "No"),
						run: () => this.setIgnoreRecommendationsConfig(false)
					}]
				);
			},
		});
	}

	async promptWorkspaceRecommendations(recommendations: Array<string | URI>): Promise<void> {
		if (this.storageService.getBoolean(donotShowWorkspaceRecommendationsStorageKey, StorageScope.WORKSPACE, false)) {
			return;
		}

		let installed = await this.extensionManagementService.getInstalled();
		installed = installed.filter(l => this.extensionEnablementService.getEnablementState(l) !== EnablementState.DisabledByExtensionKind); // Filter extensions disabled by kind
		recommendations = recommendations.filter(recommendation => installed.every(local =>
			isString(recommendation) ? !areSameExtensions({ id: recommendation }, local.identifier) : !this.uriIdentityService.extUri.isEqual(recommendation, local.location)
		));
		if (!recommendations.length) {
			return;
		}

		await this.promptRecommendationsNotification({ extensions: recommendations, source: RecommendationSource.WORKSPACE, name: localize({ key: 'this repository', comment: ['this repository means the current repository that is opened'] }, "this repository") }, {
			onDidInstallRecommendedExtensions: () => this.telemetryService.publicLog2<{ userReaction: string }, ExtensionWorkspaceRecommendationsNotificationClassification>('extensionWorkspaceRecommendations:popup', { userReaction: 'install' }),
			onDidShowRecommendedExtensions: () => this.telemetryService.publicLog2<{ userReaction: string }, ExtensionWorkspaceRecommendationsNotificationClassification>('extensionWorkspaceRecommendations:popup', { userReaction: 'show' }),
			onDidCancelRecommendedExtensions: () => this.telemetryService.publicLog2<{ userReaction: string }, ExtensionWorkspaceRecommendationsNotificationClassification>('extensionWorkspaceRecommendations:popup', { userReaction: 'cancelled' }),
			onDidNeverShowRecommendedExtensionsAgain: () => {
				this.telemetryService.publicLog2<{ userReaction: string }, ExtensionWorkspaceRecommendationsNotificationClassification>('extensionWorkspaceRecommendations:popup', { userReaction: 'neverShowAgain' });
				this.storageService.store(donotShowWorkspaceRecommendationsStorageKey, true, StorageScope.WORKSPACE, StorageTarget.MACHINE);
			},
		});

	}

	private async promptRecommendationsNotification({ extensions: extensionIds, source, name, searchValue }: ExtensionRecommendations, recommendationsNotificationActions: RecommendationsNotificationActions): Promise<RecommendationsNotificationResult> {

		if (this.hasToIgnoreRecommendationNotifications()) {
			return RecommendationsNotificationResult.Ignored;
		}

		// Do not show exe based recommendations in remote window
		if (source === RecommendationSource.EXE && this.workbenchEnvironmentService.remoteAuthority) {
			return RecommendationsNotificationResult.IncompatibleWindow;
		}

		// Ignore exe recommendation if the window
		// 		=> has shown an exe based recommendation already
		// 		=> or has shown any two recommendations already
		if (source === RecommendationSource.EXE && (this.recommendationSources.includes(RecommendationSource.EXE) || this.recommendationSources.length >= 2)) {
			return RecommendationsNotificationResult.TooMany;
		}

		this.recommendationSources.push(source);

		// Ignore exe recommendation if recommendations are already shown
		if (source === RecommendationSource.EXE && extensionIds.every(id => isString(id) && this.recommendedExtensions.includes(id))) {
			return RecommendationsNotificationResult.Ignored;
		}

		const extensions = await this.getInstallableExtensions(extensionIds);
		if (!extensions.length) {
			return RecommendationsNotificationResult.Ignored;
		}

		this.recommendedExtensions = distinct([...this.recommendedExtensions, ...extensionIds.filter(isString)]);

		let extensionsMessage = '';
		if (extensions.length === 1) {
			extensionsMessage = localize('extensionFromPublisher', "'{0}' extension from {1}", extensions[0].displayName, extensions[0].publisherDisplayName);
		} else {
			const publishers = [...extensions.reduce((result, extension) => result.add(extension.publisherDisplayName), new Set<string>())];
			if (publishers.length > 2) {
				extensionsMessage = localize('extensionsFromMultiplePublishers', "extensions from {0}, {1} and others", publishers[0], publishers[1]);
			} else if (publishers.length === 2) {
				extensionsMessage = localize('extensionsFromPublishers', "extensions from {0} and {1}", publishers[0], publishers[1]);
			} else {
				extensionsMessage = localize('extensionsFromPublisher', "extensions from {0}", publishers[0]);
			}
		}

		let message = localize('recommended', "Do you want to install the recommended {0} for {1}?", extensionsMessage, name);
		if (source === RecommendationSource.EXE) {
			message = localize({ key: 'exeRecommended', comment: ['Placeholder string is the name of the software that is installed.'] }, "You have {0} installed on your system. Do you want to install the recommended {1} for it?", name, extensionsMessage);
		}
		if (!searchValue) {
			searchValue = source === RecommendationSource.WORKSPACE ? '@recommended' : extensions.map(extensionId => `@id:${extensionId.identifier.id}`).join(' ');
		}

		const donotShowAgainLabel = source === RecommendationSource.WORKSPACE ? localize('donotShowAgain', "Don't Show Again for this Repository")
			: extensions.length > 1 ? localize('donotShowAgainExtension', "Don't Show Again for these Extensions") : localize('donotShowAgainExtensionSingle', "Don't Show Again for this Extension");

		return raceCancellablePromises([
			this._registerP(this.showRecommendationsNotification(extensions, message, searchValue, donotShowAgainLabel, source, recommendationsNotificationActions)),
			this._registerP(this.waitUntilRecommendationsAreInstalled(extensions))
		]);

	}

	private showRecommendationsNotification(extensions: IExtension[], message: string, searchValue: string, donotShowAgainLabel: string, source: RecommendationSource,
		{ onDidInstallRecommendedExtensions, onDidShowRecommendedExtensions, onDidCancelRecommendedExtensions, onDidNeverShowRecommendedExtensionsAgain }: RecommendationsNotificationActions): CancelablePromise<RecommendationsNotificationResult> {
		return createCancelablePromise<RecommendationsNotificationResult>(async token => {
			let accepted = false;
			const choices: (IPromptChoice | IPromptChoiceWithMenu)[] = [];
			const installExtensions = async (isMachineScoped: boolean) => {
				this.extensionsWorkbenchService.openSearch(searchValue);
				onDidInstallRecommendedExtensions(extensions);
				const galleryExtensions: IGalleryExtension[] = [], resourceExtensions: IExtension[] = [];
				for (const extension of extensions) {
					if (extension.gallery) {
						galleryExtensions.push(extension.gallery);
					} else if (extension.resourceExtension) {
						resourceExtensions.push(extension);
					}
				}
				await Promises.settled<any>([
					Promises.settled(extensions.map(extension => this.extensionsWorkbenchService.open(extension, { pinned: true }))),
					galleryExtensions.length ? this.extensionManagementService.installGalleryExtensions(galleryExtensions.map(e => ({ extension: e, options: { isMachineScoped } }))) : Promise.resolve(),
					resourceExtensions.length ? Promise.allSettled(resourceExtensions.map(r => this.extensionsWorkbenchService.install(r))) : Promise.resolve()
				]);
			};
			choices.push({
				label: localize('install', "Install"),
				run: () => installExtensions(false),
				menu: this.userDataSyncEnablementService.isEnabled() && this.userDataSyncEnablementService.isResourceEnabled(SyncResource.Extensions) ? [{
					label: localize('install and do no sync', "Install (Do not sync)"),
					run: () => installExtensions(true)
				}] : undefined,
			});
			choices.push(...[{
				label: localize('show recommendations', "Show Recommendations"),
				run: async () => {
					onDidShowRecommendedExtensions(extensions);
					for (const extension of extensions) {
						this.extensionsWorkbenchService.open(extension, { pinned: true });
					}
					this.extensionsWorkbenchService.openSearch(searchValue);
				}
			}, {
				label: donotShowAgainLabel,
				isSecondary: true,
				run: () => {
					onDidNeverShowRecommendedExtensionsAgain(extensions);
				}
			}]);
			try {
				accepted = await this.doShowRecommendationsNotification(Severity.Info, message, choices, source, token);
			} catch (error) {
				if (!isCancellationError(error)) {
					throw error;
				}
			}

			if (accepted) {
				return RecommendationsNotificationResult.Accepted;
			} else {
				onDidCancelRecommendedExtensions(extensions);
				return RecommendationsNotificationResult.Cancelled;
			}

		});
	}

	private waitUntilRecommendationsAreInstalled(extensions: IExtension[]): CancelablePromise<RecommendationsNotificationResult.Accepted> {
		const installedExtensions: string[] = [];
		const disposables = new DisposableStore();
		return createCancelablePromise(async token => {
			disposables.add(token.onCancellationRequested(e => disposables.dispose()));
			return new Promise<RecommendationsNotificationResult.Accepted>((c, e) => {
				disposables.add(this.extensionManagementService.onInstallExtension(e => {
					installedExtensions.push(e.identifier.id.toLowerCase());
					if (extensions.every(e => installedExtensions.includes(e.identifier.id.toLowerCase()))) {
						c(RecommendationsNotificationResult.Accepted);
					}
				}));
			});
		});
	}

	/**
	 * Show recommendations in Queue
	 * At any time only one recommendation is shown
	 * If a new recommendation comes in
	 * 		=> If no recommendation is visible, show it immediately
	 *		=> Otherwise, add to the pending queue
	 * 			=> If it is not exe based and has higher or same priority as current, hide the current notification after showing it for 3s.
	 * 			=> Otherwise wait until the current notification is hidden.
	 */
	private async doShowRecommendationsNotification(severity: Severity, message: string, choices: IPromptChoice[], source: RecommendationSource, token: CancellationToken): Promise<boolean> {
		const disposables = new DisposableStore();
		try {
			const recommendationsNotification = disposables.add(new RecommendationsNotification(severity, message, choices, this.notificationService));
			disposables.add(Event.once(Event.filter(recommendationsNotification.onDidChangeVisibility, e => !e))(() => this.showNextNotification()));
			if (this.visibleNotification) {
				const index = this.pendingNotificaitons.length;
				disposables.add(token.onCancellationRequested(() => this.pendingNotificaitons.splice(index, 1)));
				this.pendingNotificaitons.push({ recommendationsNotification, source, token });
				if (source !== RecommendationSource.EXE && source <= this.visibleNotification.source) {
					this.hideVisibleNotification(3000);
				}
			} else {
				this.visibleNotification = { recommendationsNotification, source, from: Date.now() };
				recommendationsNotification.show();
			}
			await raceCancellation(new Promise(c => disposables.add(Event.once(recommendationsNotification.onDidClose)(c))), token);
			return !recommendationsNotification.isCancelled();
		} finally {
			disposables.dispose();
		}
	}

	private showNextNotification(): void {
		const index = this.getNextPendingNotificationIndex();
		const [nextNotificaiton] = index > -1 ? this.pendingNotificaitons.splice(index, 1) : [];

		// Show the next notification after a delay of 500ms (after the current notification is dismissed)
		timeout(nextNotificaiton ? 500 : 0)
			.then(() => {
				this.unsetVisibileNotification();
				if (nextNotificaiton) {
					this.visibleNotification = { recommendationsNotification: nextNotificaiton.recommendationsNotification, source: nextNotificaiton.source, from: Date.now() };
					nextNotificaiton.recommendationsNotification.show();
				}
			});
	}

	/**
	 * Return the recent high priroity pending notification
	 */
	private getNextPendingNotificationIndex(): number {
		let index = this.pendingNotificaitons.length - 1;
		if (this.pendingNotificaitons.length) {
			for (let i = 0; i < this.pendingNotificaitons.length; i++) {
				if (this.pendingNotificaitons[i].source <= this.pendingNotificaitons[index].source) {
					index = i;
				}
			}
		}
		return index;
	}

	private hideVisibleNotification(timeInMillis: number): void {
		if (this.visibleNotification && !this.hideVisibleNotificationPromise) {
			const visibleNotification = this.visibleNotification;
			this.hideVisibleNotificationPromise = timeout(Math.max(timeInMillis - (Date.now() - visibleNotification.from), 0));
			this.hideVisibleNotificationPromise.then(() => visibleNotification.recommendationsNotification.hide());
		}
	}

	private unsetVisibileNotification(): void {
		this.hideVisibleNotificationPromise?.cancel();
		this.hideVisibleNotificationPromise = undefined;
		this.visibleNotification = undefined;
	}

	private async getInstallableExtensions(recommendations: Array<string | URI>): Promise<IExtension[]> {
		const result: IExtension[] = [];
		if (recommendations.length) {
			const galleryExtensions: string[] = [];
			const resourceExtensions: URI[] = [];
			for (const recommendation of recommendations) {
				if (typeof recommendation === 'string') {
					galleryExtensions.push(recommendation);
				} else {
					resourceExtensions.push(recommendation);
				}
			}
			if (galleryExtensions.length) {
				const extensions = await this.extensionsWorkbenchService.getExtensions(galleryExtensions.map(id => ({ id })), { source: 'install-recommendations' }, CancellationToken.None);
				for (const extension of extensions) {
					if (extension.gallery && await this.extensionManagementService.canInstall(extension.gallery) === true) {
						result.push(extension);
					}
				}
			}
			if (resourceExtensions.length) {
				const extensions = await this.extensionsWorkbenchService.getResourceExtensions(resourceExtensions, true);
				for (const extension of extensions) {
					if (await this.extensionsWorkbenchService.canInstall(extension) === true) {
						result.push(extension);
					}
				}
			}
		}
		return result;
	}

	private addToImportantRecommendationsIgnore(id: string) {
		const importantRecommendationsIgnoreList = [...this.ignoredRecommendations];
		if (!importantRecommendationsIgnoreList.includes(id.toLowerCase())) {
			importantRecommendationsIgnoreList.push(id.toLowerCase());
			this.storageService.store(ignoreImportantExtensionRecommendationStorageKey, JSON.stringify(importantRecommendationsIgnoreList), StorageScope.PROFILE, StorageTarget.USER);
		}
	}

	private setIgnoreRecommendationsConfig(configVal: boolean) {
		this.configurationService.updateValue('extensions.ignoreRecommendations', configVal);
	}

	private _registerP<T>(o: CancelablePromise<T>): CancelablePromise<T> {
		this._register(toDisposable(() => o.cancel()));
		return o;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/extensions/browser/extensionRecommendations.ts]---
Location: vscode-main/src/vs/workbench/contrib/extensions/browser/extensionRecommendations.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { IExtensionRecommendationReason } from '../../../services/extensionRecommendations/common/extensionRecommendations.js';

export type GalleryExtensionRecommendation = {
	readonly extension: string;
	readonly reason: IExtensionRecommendationReason;
};

export type ResourceExtensionRecommendation = {
	readonly extension: URI;
	readonly reason: IExtensionRecommendationReason;
};

export type ExtensionRecommendation = GalleryExtensionRecommendation | ResourceExtensionRecommendation;

export abstract class ExtensionRecommendations extends Disposable {

	readonly abstract recommendations: ReadonlyArray<ExtensionRecommendation>;
	protected abstract doActivate(): Promise<void>;

	private _activationPromise: Promise<void> | null = null;
	get activated(): boolean { return this._activationPromise !== null; }
	activate(): Promise<void> {
		if (!this._activationPromise) {
			this._activationPromise = this.doActivate();
		}
		return this._activationPromise;
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/extensions/browser/extensionRecommendationsService.ts]---
Location: vscode-main/src/vs/workbench/contrib/extensions/browser/extensionRecommendationsService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { IExtensionManagementService, IExtensionGalleryService, InstallOperation, InstallExtensionResult } from '../../../../platform/extensionManagement/common/extensionManagement.js';
import { IExtensionRecommendationsService, ExtensionRecommendationReason, IExtensionIgnoredRecommendationsService } from '../../../services/extensionRecommendations/common/extensionRecommendations.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { shuffle } from '../../../../base/common/arrays.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { LifecyclePhase, ILifecycleService } from '../../../services/lifecycle/common/lifecycle.js';
import { ExeBasedRecommendations } from './exeBasedRecommendations.js';
import { WorkspaceRecommendations } from './workspaceRecommendations.js';
import { FileBasedRecommendations } from './fileBasedRecommendations.js';
import { KeymapRecommendations } from './keymapRecommendations.js';
import { LanguageRecommendations } from './languageRecommendations.js';
import { ExtensionRecommendation } from './extensionRecommendations.js';
import { ConfigBasedRecommendations } from './configBasedRecommendations.js';
import { IExtensionRecommendationNotificationService } from '../../../../platform/extensionRecommendations/common/extensionRecommendations.js';
import { CancelablePromise, timeout } from '../../../../base/common/async.js';
import { URI } from '../../../../base/common/uri.js';
import { WebRecommendations } from './webRecommendations.js';
import { IExtensionsWorkbenchService } from '../common/extensions.js';
import { areSameExtensions } from '../../../../platform/extensionManagement/common/extensionManagementUtil.js';
import { RemoteRecommendations } from './remoteRecommendations.js';
import { IRemoteExtensionsScannerService } from '../../../../platform/remote/common/remoteExtensionsScanner.js';
import { IUserDataInitializationService } from '../../../services/userData/browser/userDataInit.js';
import { isString } from '../../../../base/common/types.js';

export class ExtensionRecommendationsService extends Disposable implements IExtensionRecommendationsService {

	declare readonly _serviceBrand: undefined;

	// Recommendations
	private readonly fileBasedRecommendations: FileBasedRecommendations;
	private readonly workspaceRecommendations: WorkspaceRecommendations;
	private readonly configBasedRecommendations: ConfigBasedRecommendations;
	private readonly exeBasedRecommendations: ExeBasedRecommendations;
	private readonly keymapRecommendations: KeymapRecommendations;
	private readonly webRecommendations: WebRecommendations;
	private readonly languageRecommendations: LanguageRecommendations;
	private readonly remoteRecommendations: RemoteRecommendations;

	public readonly activationPromise: Promise<void>;
	private sessionSeed: number;

	private _onDidChangeRecommendations = this._register(new Emitter<void>());
	readonly onDidChangeRecommendations = this._onDidChangeRecommendations.event;

	constructor(
		@IInstantiationService instantiationService: IInstantiationService,
		@ILifecycleService private readonly lifecycleService: ILifecycleService,
		@IExtensionGalleryService private readonly galleryService: IExtensionGalleryService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IEnvironmentService private readonly environmentService: IEnvironmentService,
		@IExtensionManagementService private readonly extensionManagementService: IExtensionManagementService,
		@IExtensionIgnoredRecommendationsService private readonly extensionRecommendationsManagementService: IExtensionIgnoredRecommendationsService,
		@IExtensionRecommendationNotificationService private readonly extensionRecommendationNotificationService: IExtensionRecommendationNotificationService,
		@IExtensionsWorkbenchService private readonly extensionsWorkbenchService: IExtensionsWorkbenchService,
		@IRemoteExtensionsScannerService private readonly remoteExtensionsScannerService: IRemoteExtensionsScannerService,
		@IUserDataInitializationService private readonly userDataInitializationService: IUserDataInitializationService,
	) {
		super();

		this.workspaceRecommendations = this._register(instantiationService.createInstance(WorkspaceRecommendations));
		this.fileBasedRecommendations = this._register(instantiationService.createInstance(FileBasedRecommendations));
		this.configBasedRecommendations = this._register(instantiationService.createInstance(ConfigBasedRecommendations));
		this.exeBasedRecommendations = this._register(instantiationService.createInstance(ExeBasedRecommendations));
		this.keymapRecommendations = this._register(instantiationService.createInstance(KeymapRecommendations));
		this.webRecommendations = this._register(instantiationService.createInstance(WebRecommendations));
		this.languageRecommendations = this._register(instantiationService.createInstance(LanguageRecommendations));
		this.remoteRecommendations = this._register(instantiationService.createInstance(RemoteRecommendations));

		if (!this.isEnabled()) {
			this.sessionSeed = 0;
			this.activationPromise = Promise.resolve();
			return;
		}

		this.sessionSeed = +new Date();

		// Activation
		this.activationPromise = this.activate();

		this._register(this.extensionManagementService.onDidInstallExtensions(e => this.onDidInstallExtensions(e)));
	}

	private async activate(): Promise<void> {
		try {
			await Promise.allSettled([
				this.remoteExtensionsScannerService.whenExtensionsReady(),
				this.userDataInitializationService.whenInitializationFinished(),
				this.lifecycleService.when(LifecyclePhase.Restored)]);
		} catch (error) { /* ignore */ }

		// activate all recommendations
		await Promise.all([
			this.workspaceRecommendations.activate(),
			this.configBasedRecommendations.activate(),
			this.fileBasedRecommendations.activate(),
			this.keymapRecommendations.activate(),
			this.languageRecommendations.activate(),
			this.webRecommendations.activate(),
			this.remoteRecommendations.activate()
		]);

		this._register(Event.any(this.workspaceRecommendations.onDidChangeRecommendations, this.configBasedRecommendations.onDidChangeRecommendations, this.extensionRecommendationsManagementService.onDidChangeIgnoredRecommendations)(() => this._onDidChangeRecommendations.fire()));

		this.promptWorkspaceRecommendations();
	}

	private isEnabled(): boolean {
		return this.galleryService.isEnabled() && !this.environmentService.isExtensionDevelopment;
	}

	private async activateProactiveRecommendations(): Promise<void> {
		await Promise.all([this.exeBasedRecommendations.activate(), this.configBasedRecommendations.activate()]);
	}

	getAllRecommendationsWithReason(): { [id: string]: { reasonId: ExtensionRecommendationReason; reasonText: string } } {
		/* Activate proactive recommendations */
		this.activateProactiveRecommendations();

		const output: { [id: string]: { reasonId: ExtensionRecommendationReason; reasonText: string } } = Object.create(null);

		const allRecommendations = [
			...this.configBasedRecommendations.recommendations,
			...this.exeBasedRecommendations.recommendations,
			...this.fileBasedRecommendations.recommendations,
			...this.workspaceRecommendations.recommendations,
			...this.keymapRecommendations.recommendations,
			...this.languageRecommendations.recommendations,
			...this.webRecommendations.recommendations,
		];

		for (const { extension, reason } of allRecommendations) {
			if (isString(extension) && this.isExtensionAllowedToBeRecommended(extension)) {
				output[extension.toLowerCase()] = reason;
			}
		}

		return output;
	}

	async getConfigBasedRecommendations(): Promise<{ important: string[]; others: string[] }> {
		await this.configBasedRecommendations.activate();
		return {
			important: this.toExtensionIds(this.configBasedRecommendations.importantRecommendations),
			others: this.toExtensionIds(this.configBasedRecommendations.otherRecommendations)
		};
	}

	async getOtherRecommendations(): Promise<string[]> {
		await this.activationPromise;
		await this.activateProactiveRecommendations();

		const recommendations = [
			...this.configBasedRecommendations.otherRecommendations,
			...this.exeBasedRecommendations.otherRecommendations,
			...this.webRecommendations.recommendations
		];

		const extensionIds = this.toExtensionIds(recommendations);
		shuffle(extensionIds, this.sessionSeed);
		return extensionIds;
	}

	async getImportantRecommendations(): Promise<string[]> {
		await this.activateProactiveRecommendations();

		const recommendations = [
			...this.fileBasedRecommendations.importantRecommendations,
			...this.configBasedRecommendations.importantRecommendations,
			...this.exeBasedRecommendations.importantRecommendations,
		];

		const extensionIds = this.toExtensionIds(recommendations);
		shuffle(extensionIds, this.sessionSeed);
		return extensionIds;
	}

	getKeymapRecommendations(): string[] {
		return this.toExtensionIds(this.keymapRecommendations.recommendations);
	}

	getLanguageRecommendations(): string[] {
		return this.toExtensionIds(this.languageRecommendations.recommendations);
	}

	getRemoteRecommendations(): string[] {
		return this.toExtensionIds(this.remoteRecommendations.recommendations);
	}

	async getWorkspaceRecommendations(): Promise<Array<string | URI>> {
		if (!this.isEnabled()) {
			return [];
		}
		await this.workspaceRecommendations.activate();
		const result: Array<string | URI> = [];
		for (const { extension } of this.workspaceRecommendations.recommendations) {
			if (isString(extension)) {
				if (!result.includes(extension.toLowerCase()) && this.isExtensionAllowedToBeRecommended(extension)) {
					result.push(extension.toLowerCase());
				}
			} else {
				result.push(extension);
			}
		}
		return result;
	}

	async getExeBasedRecommendations(exe?: string): Promise<{ important: string[]; others: string[] }> {
		await this.exeBasedRecommendations.activate();
		const { important, others } = exe ? this.exeBasedRecommendations.getRecommendations(exe)
			: { important: this.exeBasedRecommendations.importantRecommendations, others: this.exeBasedRecommendations.otherRecommendations };
		return { important: this.toExtensionIds(important), others: this.toExtensionIds(others) };
	}

	getFileBasedRecommendations(): string[] {
		return this.toExtensionIds(this.fileBasedRecommendations.recommendations);
	}

	private onDidInstallExtensions(results: readonly InstallExtensionResult[]): void {
		for (const e of results) {
			if (e.source && !URI.isUri(e.source) && e.operation === InstallOperation.Install) {
				const extRecommendations = this.getAllRecommendationsWithReason() || {};
				const recommendationReason = extRecommendations[e.source.identifier.id.toLowerCase()];
				if (recommendationReason) {
					/* __GDPR__
						"extensionGallery:install:recommendations" : {
							"owner": "sandy081",
							"recommendationReason": { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true },
							"${include}": [
								"${GalleryExtensionTelemetryData}"
							]
						}
					*/
					this.telemetryService.publicLog('extensionGallery:install:recommendations', { ...e.source.telemetryData, recommendationReason: recommendationReason.reasonId });
				}
			}
		}
	}

	private toExtensionIds(recommendations: ReadonlyArray<ExtensionRecommendation>): string[] {
		const extensionIds: string[] = [];
		for (const { extension } of recommendations) {
			if (isString(extension) && this.isExtensionAllowedToBeRecommended(extension) && !extensionIds.includes(extension.toLowerCase())) {
				extensionIds.push(extension.toLowerCase());
			}
		}
		return extensionIds;
	}

	private isExtensionAllowedToBeRecommended(extensionId: string): boolean {
		return !this.extensionRecommendationsManagementService.ignoredRecommendations.includes(extensionId.toLowerCase());
	}

	private async promptWorkspaceRecommendations(): Promise<void> {
		const installed = await this.extensionsWorkbenchService.queryLocal();
		const allowedRecommendations = [
			...this.workspaceRecommendations.recommendations,
			...this.configBasedRecommendations.importantRecommendations.filter(
				recommendation => !recommendation.whenNotInstalled || recommendation.whenNotInstalled.every(id => installed.every(local => !areSameExtensions(local.identifier, { id }))))
		]
			.map(({ extension }) => extension)
			.filter(extension => !isString(extension) || this.isExtensionAllowedToBeRecommended(extension));

		if (allowedRecommendations.length) {
			await this._registerP(timeout(5000));
			await this.extensionRecommendationNotificationService.promptWorkspaceRecommendations(allowedRecommendations);
		}
	}

	private _registerP<T>(o: CancelablePromise<T>): CancelablePromise<T> {
		this._register(toDisposable(() => o.cancel()));
		return o;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/extensions/browser/extensions.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/extensions/browser/extensions.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IAction } from '../../../../base/common/actions.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IStringDictionary } from '../../../../base/common/collections.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { Event } from '../../../../base/common/event.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { mnemonicButtonLabel } from '../../../../base/common/labels.js';
import { Disposable, DisposableStore, IDisposable, isDisposable } from '../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../base/common/network.js';
import { isNative, isWeb } from '../../../../base/common/platform.js';
import { PolicyCategory } from '../../../../base/common/policy.js';
import { URI, UriComponents } from '../../../../base/common/uri.js';
import { MultiCommand } from '../../../../editor/browser/editorExtensions.js';
import { CopyAction, CutAction, PasteAction } from '../../../../editor/contrib/clipboard/browser/clipboard.js';
import { localize, localize2 } from '../../../../nls.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { Action2, IAction2Options, IMenuItem, MenuId, MenuRegistry, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';
import { CommandsRegistry, ICommandService } from '../../../../platform/commands/common/commands.js';
import { Extensions as ConfigurationExtensions, ConfigurationScope, IConfigurationRegistry } from '../../../../platform/configuration/common/configurationRegistry.js';
import { ContextKeyExpr, IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { IDialogService, IFileDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { ExtensionGalleryManifestStatus, ExtensionGalleryResourceType, ExtensionGalleryServiceUrlConfigKey, getExtensionGalleryManifestResourceUri, IExtensionGalleryManifest, IExtensionGalleryManifestService } from '../../../../platform/extensionManagement/common/extensionGalleryManifest.js';
import { EXTENSION_INSTALL_SOURCE_CONTEXT, ExtensionInstallSource, ExtensionRequestsTimeoutConfigKey, ExtensionsLocalizedLabel, FilterType, IExtensionGalleryService, IExtensionManagementService, PreferencesLocalizedLabel, SortBy, VerifyExtensionSignatureConfigKey } from '../../../../platform/extensionManagement/common/extensionManagement.js';
import { areSameExtensions, getIdAndVersion } from '../../../../platform/extensionManagement/common/extensionManagementUtil.js';
import { ExtensionStorageService } from '../../../../platform/extensionManagement/common/extensionStorage.js';
import { IExtensionRecommendationNotificationService } from '../../../../platform/extensionRecommendations/common/extensionRecommendations.js';
import { EXTENSION_CATEGORIES, ExtensionType } from '../../../../platform/extensions/common/extensions.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import * as jsonContributionRegistry from '../../../../platform/jsonschemas/common/jsonContributionRegistry.js';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification.js';
import product from '../../../../platform/product/common/product.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { ProgressLocation } from '../../../../platform/progress/common/progress.js';
import { Extensions, IQuickAccessRegistry } from '../../../../platform/quickinput/common/quickAccess.js';
import { IQuickInputService } from '../../../../platform/quickinput/common/quickInput.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IUserDataProfilesService } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { EditorPaneDescriptor, IEditorPaneRegistry } from '../../../browser/editor.js';
import { Extensions as ConfigurationMigrationExtensions, IConfigurationMigrationRegistry } from '../../../common/configuration.js';
import { ResourceContextKey, WorkbenchStateContext } from '../../../common/contextkeys.js';
import { IWorkbenchContribution, IWorkbenchContributionsRegistry, registerWorkbenchContribution2, Extensions as WorkbenchExtensions, WorkbenchPhase } from '../../../common/contributions.js';
import { EditorExtensions } from '../../../common/editor.js';
import { IViewContainersRegistry, Extensions as ViewContainerExtensions, ViewContainerLocation } from '../../../common/views.js';
import { DEFAULT_ACCOUNT_SIGN_IN_COMMAND } from '../../../services/accounts/common/defaultAccount.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { EnablementState, IExtensionManagementServerService, IPublisherInfo, IWorkbenchExtensionEnablementService, IWorkbenchExtensionManagementService } from '../../../services/extensionManagement/common/extensionManagement.js';
import { IExtensionIgnoredRecommendationsService, IExtensionRecommendationsService } from '../../../services/extensionRecommendations/common/extensionRecommendations.js';
import { IWorkspaceExtensionsConfigService } from '../../../services/extensionRecommendations/common/workspaceExtensionsConfig.js';
import { IHostService } from '../../../services/host/browser/host.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { IPreferencesService } from '../../../services/preferences/common/preferences.js';
import { CONTEXT_SYNC_ENABLEMENT } from '../../../services/userDataSync/common/userDataSync.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { WORKSPACE_TRUST_EXTENSION_SUPPORT } from '../../../services/workspaces/common/workspaceTrust.js';
import { ILanguageModelToolsService } from '../../chat/common/languageModelToolsService.js';
import { CONTEXT_KEYBINDINGS_EDITOR } from '../../preferences/common/preferences.js';
import { IWebview } from '../../webview/browser/webview.js';
import { Query } from '../common/extensionQuery.js';
import { AutoRestartConfigurationKey, AutoUpdateConfigurationKey, CONTEXT_EXTENSIONS_GALLERY_STATUS, CONTEXT_HAS_GALLERY, DefaultViewsContext, ExtensionEditorTab, ExtensionRuntimeActionType, EXTENSIONS_CATEGORY, extensionsFilterSubMenu, extensionsSearchActionsMenu, HasOutdatedExtensionsContext, IExtensionArg, IExtensionsViewPaneContainer, IExtensionsWorkbenchService, INSTALL_ACTIONS_GROUP, INSTALL_EXTENSION_FROM_VSIX_COMMAND_ID, IWorkspaceRecommendedExtensionsView, LIST_WORKSPACE_UNSUPPORTED_EXTENSIONS_COMMAND_ID, OUTDATED_EXTENSIONS_VIEW_ID, SELECT_INSTALL_VSIX_EXTENSION_COMMAND_ID, THEME_ACTIONS_GROUP, TOGGLE_IGNORE_EXTENSION_ACTION_ID, UPDATE_ACTIONS_GROUP, VIEWLET_ID, WORKSPACE_RECOMMENDATIONS_VIEW_ID } from '../common/extensions.js';
import { ExtensionsConfigurationSchema, ExtensionsConfigurationSchemaId } from '../common/extensionsFileTemplate.js';
import { ExtensionsInput } from '../common/extensionsInput.js';
import { KeymapExtensions } from '../common/extensionsUtils.js';
import { SearchExtensionsTool, SearchExtensionsToolData } from '../common/searchExtensionsTool.js';
import { ShowRuntimeExtensionsAction } from './abstractRuntimeExtensionsEditor.js';
import { ExtensionEditor } from './extensionEditor.js';
import { ExtensionEnablementWorkspaceTrustTransitionParticipant } from './extensionEnablementWorkspaceTrustTransitionParticipant.js';
import { ExtensionRecommendationNotificationService } from './extensionRecommendationNotificationService.js';
import { ExtensionRecommendationsService } from './extensionRecommendationsService.js';
import { ClearLanguageAction, ConfigureWorkspaceFolderRecommendedExtensionsAction, ConfigureWorkspaceRecommendedExtensionsAction, InstallAction, InstallAnotherVersionAction, InstallSpecificVersionOfExtensionAction, SetColorThemeAction, SetFileIconThemeAction, SetProductIconThemeAction, ToggleAutoUpdateForExtensionAction, ToggleAutoUpdatesForPublisherAction, TogglePreReleaseExtensionAction } from './extensionsActions.js';
import { ExtensionActivationProgress } from './extensionsActivationProgress.js';
import { ExtensionsCompletionItemsProvider } from './extensionsCompletionItemsProvider.js';
import { ExtensionDependencyChecker } from './extensionsDependencyChecker.js';
import { clearSearchResultsIcon, configureRecommendedIcon, extensionsViewIcon, filterIcon, installWorkspaceRecommendedIcon, refreshIcon } from './extensionsIcons.js';
import { InstallExtensionQuickAccessProvider, ManageExtensionsQuickAccessProvider } from './extensionsQuickAccess.js';
import { BuiltInExtensionsContext, ExtensionMarketplaceStatusUpdater, ExtensionsSearchValueContext, ExtensionsSortByContext, ExtensionsViewletViewsContribution, ExtensionsViewPaneContainer, MaliciousExtensionChecker, RecommendedExtensionsContext, SearchHasTextContext, SearchMarketplaceExtensionsContext, StatusUpdater } from './extensionsViewlet.js';
import { ExtensionsWorkbenchService } from './extensionsWorkbenchService.js';
import './media/extensionManagement.css';
import { UnsupportedExtensionsMigrationContrib } from './unsupportedExtensionsMigrationContribution.js';

// Singletons
registerSingleton(IExtensionsWorkbenchService, ExtensionsWorkbenchService, InstantiationType.Eager /* Auto updates extensions */);
registerSingleton(IExtensionRecommendationNotificationService, ExtensionRecommendationNotificationService, InstantiationType.Delayed);
registerSingleton(IExtensionRecommendationsService, ExtensionRecommendationsService, InstantiationType.Eager /* Prompts recommendations in the background */);

// Quick Access
Registry.as<IQuickAccessRegistry>(Extensions.Quickaccess).registerQuickAccessProvider({
	ctor: ManageExtensionsQuickAccessProvider,
	prefix: ManageExtensionsQuickAccessProvider.PREFIX,
	placeholder: localize('manageExtensionsQuickAccessPlaceholder', "Press Enter to manage extensions."),
	helpEntries: [{ description: localize('manageExtensionsHelp', "Manage Extensions") }]
});

// Editor
Registry.as<IEditorPaneRegistry>(EditorExtensions.EditorPane).registerEditorPane(
	EditorPaneDescriptor.create(
		ExtensionEditor,
		ExtensionEditor.ID,
		localize('extension', "Extension")
	),
	[
		new SyncDescriptor(ExtensionsInput)
	]);

export const VIEW_CONTAINER = Registry.as<IViewContainersRegistry>(ViewContainerExtensions.ViewContainersRegistry).registerViewContainer(
	{
		id: VIEWLET_ID,
		title: localize2('extensions', "Extensions"),
		openCommandActionDescriptor: {
			id: VIEWLET_ID,
			mnemonicTitle: localize({ key: 'miViewExtensions', comment: ['&& denotes a mnemonic'] }, "E&&xtensions"),
			keybindings: { primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyX },
			order: 4,
		},
		ctorDescriptor: new SyncDescriptor(ExtensionsViewPaneContainer),
		icon: extensionsViewIcon,
		order: 4,
		rejectAddedViews: true,
		alwaysUseContainerInfo: true,
	}, ViewContainerLocation.Sidebar);

Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration)
	.registerConfiguration({
		id: 'extensions',
		order: 30,
		title: localize('extensionsConfigurationTitle', "Extensions"),
		type: 'object',
		properties: {
			'extensions.autoUpdate': {
				enum: [true, 'onlyEnabledExtensions', false,],
				enumItemLabels: [
					localize('all', "All Extensions"),
					localize('enabled', "Only Enabled Extensions"),
					localize('none', "None"),
				],
				enumDescriptions: [
					localize('extensions.autoUpdate.true', 'Download and install updates automatically for all extensions.'),
					localize('extensions.autoUpdate.enabled', 'Download and install updates automatically only for enabled extensions.'),
					localize('extensions.autoUpdate.false', 'Extensions are not automatically updated.'),
				],
				description: localize('extensions.autoUpdate', "Controls the automatic update behavior of extensions. The updates are fetched from a Microsoft online service."),
				default: true,
				scope: ConfigurationScope.APPLICATION,
				tags: ['usesOnlineServices']
			},
			'extensions.autoCheckUpdates': {
				type: 'boolean',
				description: localize('extensionsCheckUpdates', "When enabled, automatically checks extensions for updates. If an extension has an update, it is marked as outdated in the Extensions view. The updates are fetched from a Microsoft online service."),
				default: true,
				scope: ConfigurationScope.APPLICATION,
				tags: ['usesOnlineServices']
			},
			'extensions.ignoreRecommendations': {
				type: 'boolean',
				description: localize('extensionsIgnoreRecommendations', "When enabled, the notifications for extension recommendations will not be shown."),
				default: false
			},
			'extensions.showRecommendationsOnlyOnDemand': {
				type: 'boolean',
				deprecationMessage: localize('extensionsShowRecommendationsOnlyOnDemand_Deprecated', "This setting is deprecated. Use extensions.ignoreRecommendations setting to control recommendation notifications. Use Extensions view's visibility actions to hide Recommended view by default."),
				default: false,
				tags: ['usesOnlineServices']
			},
			'extensions.closeExtensionDetailsOnViewChange': {
				type: 'boolean',
				description: localize('extensionsCloseExtensionDetailsOnViewChange', "When enabled, editors with extension details will be automatically closed upon navigating away from the Extensions View."),
				default: false
			},
			'extensions.confirmedUriHandlerExtensionIds': {
				type: 'array',
				items: {
					type: 'string'
				},
				description: localize('handleUriConfirmedExtensions', "When an extension is listed here, a confirmation prompt will not be shown when that extension handles a URI."),
				default: [],
				scope: ConfigurationScope.APPLICATION
			},
			'extensions.webWorker': {
				type: ['boolean', 'string'],
				enum: [true, false, 'auto'],
				enumDescriptions: [
					localize('extensionsWebWorker.true', "The Web Worker Extension Host will always be launched."),
					localize('extensionsWebWorker.false', "The Web Worker Extension Host will never be launched."),
					localize('extensionsWebWorker.auto', "The Web Worker Extension Host will be launched when a web extension needs it."),
				],
				description: localize('extensionsWebWorker', "Enable web worker extension host."),
				default: 'auto'
			},
			'extensions.supportVirtualWorkspaces': {
				type: 'object',
				markdownDescription: localize('extensions.supportVirtualWorkspaces', "Override the virtual workspaces support of an extension."),
				patternProperties: {
					'([a-z0-9A-Z][a-z0-9-A-Z]*)\\.([a-z0-9A-Z][a-z0-9-A-Z]*)$': {
						type: 'boolean',
						default: false
					}
				},
				additionalProperties: false,
				default: {},
				defaultSnippets: [{
					'body': {
						'pub.name': false
					}
				}]
			},
			'extensions.experimental.affinity': {
				type: 'object',
				markdownDescription: localize('extensions.affinity', "Configure an extension to execute in a different extension host process."),
				patternProperties: {
					'([a-z0-9A-Z][a-z0-9-A-Z]*)\\.([a-z0-9A-Z][a-z0-9-A-Z]*)$': {
						type: 'integer',
						default: 1
					}
				},
				additionalProperties: false,
				default: {},
				defaultSnippets: [{
					'body': {
						'pub.name': 1
					}
				}]
			},
			[WORKSPACE_TRUST_EXTENSION_SUPPORT]: {
				type: 'object',
				scope: ConfigurationScope.APPLICATION,
				markdownDescription: localize('extensions.supportUntrustedWorkspaces', "Override the untrusted workspace support of an extension. Extensions using `true` will always be enabled. Extensions using `limited` will always be enabled, and the extension will hide functionality that requires trust. Extensions using `false` will only be enabled only when the workspace is trusted."),
				patternProperties: {
					'([a-z0-9A-Z][a-z0-9-A-Z]*)\\.([a-z0-9A-Z][a-z0-9-A-Z]*)$': {
						type: 'object',
						properties: {
							'supported': {
								type: ['boolean', 'string'],
								enum: [true, false, 'limited'],
								enumDescriptions: [
									localize('extensions.supportUntrustedWorkspaces.true', "Extension will always be enabled."),
									localize('extensions.supportUntrustedWorkspaces.false', "Extension will only be enabled only when the workspace is trusted."),
									localize('extensions.supportUntrustedWorkspaces.limited', "Extension will always be enabled, and the extension will hide functionality requiring trust."),
								],
								description: localize('extensions.supportUntrustedWorkspaces.supported', "Defines the untrusted workspace support setting for the extension."),
							},
							'version': {
								type: 'string',
								description: localize('extensions.supportUntrustedWorkspaces.version', "Defines the version of the extension for which the override should be applied. If not specified, the override will be applied independent of the extension version."),
							}
						}
					}
				}
			},
			'extensions.experimental.deferredStartupFinishedActivation': {
				type: 'boolean',
				description: localize('extensionsDeferredStartupFinishedActivation', "When enabled, extensions which declare the `onStartupFinished` activation event will be activated after a timeout."),
				default: false
			},
			'extensions.experimental.issueQuickAccess': {
				type: 'boolean',
				description: localize('extensionsInQuickAccess', "When enabled, extensions can be searched for via Quick Access and report issues from there."),
				default: true
			},
			[VerifyExtensionSignatureConfigKey]: {
				type: 'boolean',
				description: localize('extensions.verifySignature', "When enabled, extensions are verified to be signed before getting installed."),
				default: true,
				scope: ConfigurationScope.APPLICATION,
				included: isNative
			},
			[AutoRestartConfigurationKey]: {
				type: 'boolean',
				description: localize('autoRestart', "If activated, extensions will automatically restart following an update if the window is not in focus. There can be a data loss if you have open Notebooks or Custom Editors."),
				default: false,
				included: product.quality !== 'stable'
			},
			[ExtensionGalleryServiceUrlConfigKey]: {
				type: 'string',
				description: localize('extensions.gallery.serviceUrl', "Configure the Marketplace service URL to connect to"),
				default: '',
				scope: ConfigurationScope.APPLICATION,
				tags: ['usesOnlineServices'],
				included: false,
				policy: {
					name: 'ExtensionGalleryServiceUrl',
					category: PolicyCategory.Extensions,
					minimumVersion: '1.99',
					localization: {
						description: {
							key: 'extensions.gallery.serviceUrl',
							value: localize('extensions.gallery.serviceUrl', "Configure the Marketplace service URL to connect to"),
						}
					}
				},
			},
			'extensions.supportNodeGlobalNavigator': {
				type: 'boolean',
				description: localize('extensionsSupportNodeGlobalNavigator', "When enabled, Node.js navigator object is exposed on the global scope."),
				default: false,
			},
			[ExtensionRequestsTimeoutConfigKey]: {
				type: 'number',
				description: localize('extensionsRequestTimeout', "Controls the timeout in milliseconds for HTTP requests made when fetching extensions from the Marketplace"),
				default: 60_000,
				scope: ConfigurationScope.APPLICATION,
				tags: ['advanced', 'usesOnlineServices']
			},
		}
	});

const jsonRegistry = <jsonContributionRegistry.IJSONContributionRegistry>Registry.as(jsonContributionRegistry.Extensions.JSONContribution);
jsonRegistry.registerSchema(ExtensionsConfigurationSchemaId, ExtensionsConfigurationSchema);

// Register Commands
CommandsRegistry.registerCommand('_extensions.manage', (accessor: ServicesAccessor, extensionId: string, tab?: ExtensionEditorTab, preserveFocus?: boolean, feature?: string) => {
	const extensionService = accessor.get(IExtensionsWorkbenchService);
	const extension = extensionService.local.find(e => areSameExtensions(e.identifier, { id: extensionId }));
	if (extension) {
		extensionService.open(extension, { tab, preserveFocus, feature });
	} else {
		throw new Error(localize('notFound', "Extension '{0}' not found.", extensionId));
	}
});

CommandsRegistry.registerCommand('extension.open', async (accessor: ServicesAccessor, extensionId: string, tab?: ExtensionEditorTab, preserveFocus?: boolean, feature?: string, sideByside?: boolean) => {
	const extensionService = accessor.get(IExtensionsWorkbenchService);
	const commandService = accessor.get(ICommandService);

	const [extension] = await extensionService.getExtensions([{ id: extensionId }], CancellationToken.None);
	if (extension) {
		return extensionService.open(extension, { tab, preserveFocus, feature, sideByside });
	}

	return commandService.executeCommand('_extensions.manage', extensionId, tab, preserveFocus, feature);
});

CommandsRegistry.registerCommand({
	id: 'workbench.extensions.installExtension',
	metadata: {
		description: localize('workbench.extensions.installExtension.description', "Install the given extension"),
		args: [
			{
				name: 'extensionIdOrVSIXUri',
				description: localize('workbench.extensions.installExtension.arg.decription', "Extension id or VSIX resource uri"),
				constraint: (value: any) => typeof value === 'string' || value instanceof URI,
			},
			{
				name: 'options',
				description: '(optional) Options for installing the extension. Object with the following properties: ' +
					'`installOnlyNewlyAddedFromExtensionPackVSIX`: When enabled, VS Code installs only newly added extensions from the extension pack VSIX. This option is considered only when installing VSIX. ',
				isOptional: true,
				schema: {
					'type': 'object',
					'properties': {
						'installOnlyNewlyAddedFromExtensionPackVSIX': {
							'type': 'boolean',
							'description': localize('workbench.extensions.installExtension.option.installOnlyNewlyAddedFromExtensionPackVSIX', "When enabled, VS Code installs only newly added extensions from the extension pack VSIX. This option is considered only while installing a VSIX."),
							default: false
						},
						'installPreReleaseVersion': {
							'type': 'boolean',
							'description': localize('workbench.extensions.installExtension.option.installPreReleaseVersion', "When enabled, VS Code installs the pre-release version of the extension if available."),
							default: false
						},
						'donotSync': {
							'type': 'boolean',
							'description': localize('workbench.extensions.installExtension.option.donotSync', "When enabled, VS Code do not sync this extension when Settings Sync is on."),
							default: false
						},
						'justification': {
							'type': ['string', 'object'],
							'description': localize('workbench.extensions.installExtension.option.justification', "Justification for installing the extension. This is a string or an object that can be used to pass any information to the installation handlers. i.e. `{reason: 'This extension wants to open a URI', action: 'Open URI'}` will show a message box with the reason and action upon install."),
						},
						'enable': {
							'type': 'boolean',
							'description': localize('workbench.extensions.installExtension.option.enable', "When enabled, the extension will be enabled if it is installed but disabled. If the extension is already enabled, this has no effect."),
							default: false
						},
						'context': {
							'type': 'object',
							'description': localize('workbench.extensions.installExtension.option.context', "Context for the installation. This is a JSON object that can be used to pass any information to the installation handlers. i.e. `{skipWalkthrough: true}` will skip opening the walkthrough upon install."),
						}
					}
				}
			}
		]
	},
	handler: async (
		accessor,
		arg: string | UriComponents,
		options?: {
			installOnlyNewlyAddedFromExtensionPackVSIX?: boolean;
			installPreReleaseVersion?: boolean;
			donotSync?: boolean;
			justification?: string | { reason: string; action: string };
			enable?: boolean;
			context?: IStringDictionary<any>;
		}) => {
		const extensionsWorkbenchService = accessor.get(IExtensionsWorkbenchService);
		const extensionManagementService = accessor.get(IWorkbenchExtensionManagementService);
		const extensionGalleryService = accessor.get(IExtensionGalleryService);
		try {
			if (typeof arg === 'string') {
				const [id, version] = getIdAndVersion(arg);
				const extension = extensionsWorkbenchService.local.find(e => areSameExtensions(e.identifier, { id, uuid: version }));
				if (extension?.enablementState === EnablementState.DisabledByExtensionKind) {
					const [gallery] = await extensionGalleryService.getExtensions([{ id, preRelease: options?.installPreReleaseVersion }], CancellationToken.None);
					if (!gallery) {
						throw new Error(localize('notFound', "Extension '{0}' not found.", arg));
					}
					await extensionManagementService.installFromGallery(gallery, {
						isMachineScoped: options?.donotSync ? true : undefined, /* do not allow syncing extensions automatically while installing through the command */
						installPreReleaseVersion: options?.installPreReleaseVersion,
						installGivenVersion: !!version,
						context: { ...options?.context, [EXTENSION_INSTALL_SOURCE_CONTEXT]: ExtensionInstallSource.COMMAND },
					});
				} else {
					await extensionsWorkbenchService.install(id, {
						version,
						installPreReleaseVersion: options?.installPreReleaseVersion,
						context: { ...options?.context, [EXTENSION_INSTALL_SOURCE_CONTEXT]: ExtensionInstallSource.COMMAND },
						justification: options?.justification,
						enable: options?.enable,
						isMachineScoped: options?.donotSync ? true : undefined, /* do not allow syncing extensions automatically while installing through the command */
					}, ProgressLocation.Notification);
				}
			} else {
				const vsix = URI.revive(arg);
				await extensionsWorkbenchService.install(vsix, { installGivenVersion: true });
			}
		} catch (e) {
			onUnexpectedError(e);
			throw e;
		}
	}
});

CommandsRegistry.registerCommand({
	id: 'workbench.extensions.uninstallExtension',
	metadata: {
		description: localize('workbench.extensions.uninstallExtension.description', "Uninstall the given extension"),
		args: [
			{
				name: localize('workbench.extensions.uninstallExtension.arg.name', "Id of the extension to uninstall"),
				schema: {
					'type': 'string'
				}
			}
		]
	},
	handler: async (accessor, id: string) => {
		if (!id) {
			throw new Error(localize('id required', "Extension id required."));
		}
		const extensionManagementService = accessor.get(IExtensionManagementService);
		const installed = await extensionManagementService.getInstalled();
		const [extensionToUninstall] = installed.filter(e => areSameExtensions(e.identifier, { id }));
		if (!extensionToUninstall) {
			throw new Error(localize('notInstalled', "Extension '{0}' is not installed. Make sure you use the full extension ID, including the publisher, e.g.: ms-dotnettools.csharp.", id));
		}
		if (extensionToUninstall.isBuiltin) {
			throw new Error(localize('builtin', "Extension '{0}' is a Built-in extension and cannot be uninstalled", id));
		}

		try {
			await extensionManagementService.uninstall(extensionToUninstall);
		} catch (e) {
			onUnexpectedError(e);
			throw e;
		}
	}
});

CommandsRegistry.registerCommand({
	id: 'workbench.extensions.search',
	metadata: {
		description: localize('workbench.extensions.search.description', "Search for a specific extension"),
		args: [
			{
				name: localize('workbench.extensions.search.arg.name', "Query to use in search"),
				schema: { 'type': 'string' }
			}
		]
	},
	handler: async (accessor, query: string = '') => {
		return accessor.get(IExtensionsWorkbenchService).openSearch(query);
	}
});

function overrideActionForActiveExtensionEditorWebview(command: MultiCommand | undefined, f: (webview: IWebview) => void) {
	command?.addImplementation(105, 'extensions-editor', (accessor) => {
		const editorService = accessor.get(IEditorService);
		const editor = editorService.activeEditorPane;
		if (editor instanceof ExtensionEditor) {
			if (editor.activeWebview?.isFocused) {
				f(editor.activeWebview);
				return true;
			}
		}
		return false;
	});
}

overrideActionForActiveExtensionEditorWebview(CopyAction, webview => webview.copy());
overrideActionForActiveExtensionEditorWebview(CutAction, webview => webview.cut());
overrideActionForActiveExtensionEditorWebview(PasteAction, webview => webview.paste());

// Contexts
export const CONTEXT_HAS_LOCAL_SERVER = new RawContextKey<boolean>('hasLocalServer', false);
export const CONTEXT_HAS_REMOTE_SERVER = new RawContextKey<boolean>('hasRemoteServer', false);
export const CONTEXT_HAS_WEB_SERVER = new RawContextKey<boolean>('hasWebServer', false);
const CONTEXT_GALLERY_SORT_CAPABILITIES = new RawContextKey<string>('gallerySortCapabilities', '');
const CONTEXT_GALLERY_FILTER_CAPABILITIES = new RawContextKey<string>('galleryFilterCapabilities', '');
const CONTEXT_GALLERY_ALL_PUBLIC_REPOSITORY_SIGNED = new RawContextKey<boolean>('galleryAllPublicRepositorySigned', false);
const CONTEXT_GALLERY_ALL_PRIVATE_REPOSITORY_SIGNED = new RawContextKey<boolean>('galleryAllPrivateRepositorySigned', false);
const CONTEXT_GALLERY_HAS_EXTENSION_LINK = new RawContextKey<boolean>('galleryHasExtensionLink', false);

async function runAction(action: IAction): Promise<void> {
	try {
		await action.run();
	} finally {
		if (isDisposable(action)) {
			action.dispose();
		}
	}
}

type IExtensionActionOptions = IAction2Options & {
	menuTitles?: { [id: string]: string };
	run(accessor: ServicesAccessor, ...args: unknown[]): Promise<any>;
};

class ExtensionsContributions extends Disposable implements IWorkbenchContribution {

	constructor(
		@IExtensionManagementService private readonly extensionManagementService: IExtensionManagementService,
		@IExtensionManagementServerService private readonly extensionManagementServerService: IExtensionManagementServerService,
		@IExtensionGalleryManifestService private readonly extensionGalleryManifestService: IExtensionGalleryManifestService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IViewsService private readonly viewsService: IViewsService,
		@IExtensionsWorkbenchService private readonly extensionsWorkbenchService: IExtensionsWorkbenchService,
		@IWorkbenchExtensionEnablementService private readonly extensionEnablementService: IWorkbenchExtensionEnablementService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IDialogService private readonly dialogService: IDialogService,
		@ICommandService private readonly commandService: ICommandService,
		@IProductService private readonly productService: IProductService,
	) {
		super();
		const hasLocalServerContext = CONTEXT_HAS_LOCAL_SERVER.bindTo(contextKeyService);
		if (this.extensionManagementServerService.localExtensionManagementServer) {
			hasLocalServerContext.set(true);
		}

		const hasRemoteServerContext = CONTEXT_HAS_REMOTE_SERVER.bindTo(contextKeyService);
		if (this.extensionManagementServerService.remoteExtensionManagementServer) {
			hasRemoteServerContext.set(true);
		}

		const hasWebServerContext = CONTEXT_HAS_WEB_SERVER.bindTo(contextKeyService);
		if (this.extensionManagementServerService.webExtensionManagementServer) {
			hasWebServerContext.set(true);
		}

		this.updateExtensionGalleryStatusContexts();
		this._register(extensionGalleryManifestService.onDidChangeExtensionGalleryManifestStatus(() => this.updateExtensionGalleryStatusContexts()));
		extensionGalleryManifestService.getExtensionGalleryManifest()
			.then(extensionGalleryManifest => {
				this.updateGalleryCapabilitiesContexts(extensionGalleryManifest);
				this._register(extensionGalleryManifestService.onDidChangeExtensionGalleryManifest(extensionGalleryManifest => this.updateGalleryCapabilitiesContexts(extensionGalleryManifest)));
			});
		this.registerGlobalActions();
		this.registerContextMenuActions();
		this.registerQuickAccessProvider();
	}

	private async updateExtensionGalleryStatusContexts(): Promise<void> {
		CONTEXT_HAS_GALLERY.bindTo(this.contextKeyService).set(this.extensionGalleryManifestService.extensionGalleryManifestStatus === ExtensionGalleryManifestStatus.Available);
		CONTEXT_EXTENSIONS_GALLERY_STATUS.bindTo(this.contextKeyService).set(this.extensionGalleryManifestService.extensionGalleryManifestStatus);
	}

	private async updateGalleryCapabilitiesContexts(extensionGalleryManifest: IExtensionGalleryManifest | null): Promise<void> {
		CONTEXT_GALLERY_SORT_CAPABILITIES.bindTo(this.contextKeyService).set(`_${extensionGalleryManifest?.capabilities.extensionQuery.sorting?.map(s => s.name)?.join('_')}_UpdateDate_`);
		CONTEXT_GALLERY_FILTER_CAPABILITIES.bindTo(this.contextKeyService).set(`_${extensionGalleryManifest?.capabilities.extensionQuery.filtering?.map(s => s.name)?.join('_')}_`);
		CONTEXT_GALLERY_ALL_PUBLIC_REPOSITORY_SIGNED.bindTo(this.contextKeyService).set(!!extensionGalleryManifest?.capabilities?.signing?.allPublicRepositorySigned);
		CONTEXT_GALLERY_ALL_PRIVATE_REPOSITORY_SIGNED.bindTo(this.contextKeyService).set(!!extensionGalleryManifest?.capabilities?.signing?.allPrivateRepositorySigned);
		CONTEXT_GALLERY_HAS_EXTENSION_LINK.bindTo(this.contextKeyService).set(!!(extensionGalleryManifest && getExtensionGalleryManifestResourceUri(extensionGalleryManifest, ExtensionGalleryResourceType.ExtensionDetailsViewUri)));
	}

	private registerQuickAccessProvider(): void {
		if (this.extensionManagementServerService.localExtensionManagementServer
			|| this.extensionManagementServerService.remoteExtensionManagementServer
			|| this.extensionManagementServerService.webExtensionManagementServer
		) {
			Registry.as<IQuickAccessRegistry>(Extensions.Quickaccess).registerQuickAccessProvider({
				ctor: InstallExtensionQuickAccessProvider,
				prefix: InstallExtensionQuickAccessProvider.PREFIX,
				placeholder: localize('installExtensionQuickAccessPlaceholder', "Type the name of an extension to install or search."),
				helpEntries: [{ description: localize('installExtensionQuickAccessHelp', "Install or Search Extensions") }]
			});
		}
	}

	// Global actions
	private registerGlobalActions(): void {
		this._register(MenuRegistry.appendMenuItem(MenuId.MenubarPreferencesMenu, {
			command: {
				id: VIEWLET_ID,
				title: localize({ key: 'miPreferencesExtensions', comment: ['&& denotes a mnemonic'] }, "&&Extensions")
			},
			group: '2_configuration',
			order: 3
		}));
		this._register(MenuRegistry.appendMenuItem(MenuId.GlobalActivity, {
			command: {
				id: VIEWLET_ID,
				title: localize('showExtensions', "Extensions")
			},
			group: '2_configuration',
			order: 3
		}));

		this.registerExtensionAction({
			id: 'workbench.extensions.action.focusExtensionsView',
			title: localize2('focusExtensions', 'Focus on Extensions View'),
			category: ExtensionsLocalizedLabel,
			f1: true,
			run: async (accessor: ServicesAccessor) => {
				await accessor.get(IExtensionsWorkbenchService).openSearch('');
			}
		});

		this.registerExtensionAction({
			id: 'workbench.extensions.action.installExtensions',
			title: localize2('installExtensions', 'Install Extensions'),
			category: ExtensionsLocalizedLabel,
			menu: {
				id: MenuId.CommandPalette,
				when: ContextKeyExpr.and(CONTEXT_HAS_GALLERY, ContextKeyExpr.or(CONTEXT_HAS_LOCAL_SERVER, CONTEXT_HAS_REMOTE_SERVER, CONTEXT_HAS_WEB_SERVER))
			},
			run: async (accessor: ServicesAccessor) => {
				accessor.get(IViewsService).openViewContainer(VIEWLET_ID, true);
			}
		});

		this.registerExtensionAction({
			id: 'workbench.extensions.action.showRecommendedKeymapExtensions',
			title: localize2('showRecommendedKeymapExtensionsShort', 'Keymaps'),
			category: PreferencesLocalizedLabel,
			menu: [{
				id: MenuId.CommandPalette,
				when: CONTEXT_HAS_GALLERY
			}, {
				id: MenuId.EditorTitle,
				when: ContextKeyExpr.and(CONTEXT_KEYBINDINGS_EDITOR, CONTEXT_HAS_GALLERY),
				group: '2_keyboard_discover_actions'
			}],
			menuTitles: {
				[MenuId.EditorTitle.id]: localize('importKeyboardShortcutsFroms', "Migrate Keyboard Shortcuts from...")
			},
			run: () => this.extensionsWorkbenchService.openSearch('@recommended:keymaps ')
		});

		this.registerExtensionAction({
			id: 'workbench.extensions.action.showLanguageExtensions',
			title: localize2('showLanguageExtensionsShort', 'Language Extensions'),
			category: PreferencesLocalizedLabel,
			menu: {
				id: MenuId.CommandPalette,
				when: CONTEXT_HAS_GALLERY
			},
			run: () => this.extensionsWorkbenchService.openSearch('@recommended:languages ')
		});

		this.registerExtensionAction({
			id: 'workbench.extensions.action.checkForUpdates',
			title: localize2('checkForUpdates', 'Check for Extension Updates'),
			category: ExtensionsLocalizedLabel,
			menu: [{
				id: MenuId.CommandPalette,
				when: ContextKeyExpr.and(CONTEXT_HAS_GALLERY, ContextKeyExpr.or(CONTEXT_HAS_LOCAL_SERVER, CONTEXT_HAS_REMOTE_SERVER, CONTEXT_HAS_WEB_SERVER))
			}, {
				id: MenuId.ViewContainerTitle,
				when: ContextKeyExpr.and(ContextKeyExpr.equals('viewContainer', VIEWLET_ID), CONTEXT_HAS_GALLERY),
				group: '1_updates',
				order: 1
			}],
			run: async () => {
				await this.extensionsWorkbenchService.checkForUpdates();
				const outdated = this.extensionsWorkbenchService.outdated;
				if (outdated.length) {
					return this.extensionsWorkbenchService.openSearch('@outdated ');
				} else {
					return this.dialogService.info(localize('noUpdatesAvailable', "All extensions are up to date."));
				}
			}
		});

		const enableAutoUpdateWhenCondition = ContextKeyExpr.equals(`config.${AutoUpdateConfigurationKey}`, false);
		this.registerExtensionAction({
			id: 'workbench.extensions.action.enableAutoUpdate',
			title: localize2('enableAutoUpdate', 'Enable Auto Update for All Extensions'),
			category: ExtensionsLocalizedLabel,
			precondition: enableAutoUpdateWhenCondition,
			menu: [{
				id: MenuId.ViewContainerTitle,
				order: 5,
				group: '1_updates',
				when: ContextKeyExpr.and(ContextKeyExpr.equals('viewContainer', VIEWLET_ID), enableAutoUpdateWhenCondition)
			}, {
				id: MenuId.CommandPalette,
			}],
			run: (accessor: ServicesAccessor) => accessor.get(IExtensionsWorkbenchService).updateAutoUpdateForAllExtensions(true)
		});

		const disableAutoUpdateWhenCondition = ContextKeyExpr.notEquals(`config.${AutoUpdateConfigurationKey}`, false);
		this.registerExtensionAction({
			id: 'workbench.extensions.action.disableAutoUpdate',
			title: localize2('disableAutoUpdate', 'Disable Auto Update for All Extensions'),
			precondition: disableAutoUpdateWhenCondition,
			category: ExtensionsLocalizedLabel,
			menu: [{
				id: MenuId.ViewContainerTitle,
				order: 5,
				group: '1_updates',
				when: ContextKeyExpr.and(ContextKeyExpr.equals('viewContainer', VIEWLET_ID), disableAutoUpdateWhenCondition)
			}, {
				id: MenuId.CommandPalette,
			}],
			run: (accessor: ServicesAccessor) => accessor.get(IExtensionsWorkbenchService).updateAutoUpdateForAllExtensions(false)
		});

		this.registerExtensionAction({
			id: 'workbench.extensions.action.updateAllExtensions',
			title: localize2('updateAll', 'Update All Extensions'),
			category: ExtensionsLocalizedLabel,
			precondition: HasOutdatedExtensionsContext,
			menu: [
				{
					id: MenuId.CommandPalette,
					when: ContextKeyExpr.and(CONTEXT_HAS_GALLERY, ContextKeyExpr.or(CONTEXT_HAS_LOCAL_SERVER, CONTEXT_HAS_REMOTE_SERVER, CONTEXT_HAS_WEB_SERVER))
				}, {
					id: MenuId.ViewContainerTitle,
					when: ContextKeyExpr.and(ContextKeyExpr.equals('viewContainer', VIEWLET_ID), ContextKeyExpr.or(ContextKeyExpr.has(`config.${AutoUpdateConfigurationKey}`).negate(), ContextKeyExpr.equals(`config.${AutoUpdateConfigurationKey}`, 'onlyEnabledExtensions'))),
					group: '1_updates',
					order: 2
				}, {
					id: MenuId.ViewTitle,
					when: ContextKeyExpr.equals('view', OUTDATED_EXTENSIONS_VIEW_ID),
					group: 'navigation',
					order: 1
				}
			],
			icon: installWorkspaceRecommendedIcon,
			run: async () => {
				await this.extensionsWorkbenchService.updateAll();
			}
		});

		this.registerExtensionAction({
			id: 'workbench.extensions.action.enableAll',
			title: localize2('enableAll', 'Enable All Extensions'),
			category: ExtensionsLocalizedLabel,
			menu: [{
				id: MenuId.CommandPalette,
				when: ContextKeyExpr.or(CONTEXT_HAS_LOCAL_SERVER, CONTEXT_HAS_REMOTE_SERVER, CONTEXT_HAS_WEB_SERVER)
			}, {
				id: MenuId.ViewContainerTitle,
				when: ContextKeyExpr.equals('viewContainer', VIEWLET_ID),
				group: '2_enablement',
				order: 1
			}],
			run: async () => {
				const extensionsToEnable = this.extensionsWorkbenchService.local.filter(e => !!e.local && this.extensionEnablementService.canChangeEnablement(e.local) && !this.extensionEnablementService.isEnabled(e.local));
				if (extensionsToEnable.length) {
					await this.extensionsWorkbenchService.setEnablement(extensionsToEnable, EnablementState.EnabledGlobally);
				}
			}
		});

		this.registerExtensionAction({
			id: 'workbench.extensions.action.enableAllWorkspace',
			title: localize2('enableAllWorkspace', 'Enable All Extensions for this Workspace'),
			category: ExtensionsLocalizedLabel,
			menu: {
				id: MenuId.CommandPalette,
				when: ContextKeyExpr.and(WorkbenchStateContext.notEqualsTo('empty'), ContextKeyExpr.or(CONTEXT_HAS_LOCAL_SERVER, CONTEXT_HAS_REMOTE_SERVER, CONTEXT_HAS_WEB_SERVER))
			},
			run: async () => {
				const extensionsToEnable = this.extensionsWorkbenchService.local.filter(e => !!e.local && this.extensionEnablementService.canChangeEnablement(e.local) && !this.extensionEnablementService.isEnabled(e.local));
				if (extensionsToEnable.length) {
					await this.extensionsWorkbenchService.setEnablement(extensionsToEnable, EnablementState.EnabledWorkspace);
				}
			}
		});

		this.registerExtensionAction({
			id: 'workbench.extensions.action.disableAll',
			title: localize2('disableAll', 'Disable All Installed Extensions'),
			category: ExtensionsLocalizedLabel,
			menu: [{
				id: MenuId.CommandPalette,
				when: ContextKeyExpr.or(CONTEXT_HAS_LOCAL_SERVER, CONTEXT_HAS_REMOTE_SERVER, CONTEXT_HAS_WEB_SERVER)
			}, {
				id: MenuId.ViewContainerTitle,
				when: ContextKeyExpr.equals('viewContainer', VIEWLET_ID),
				group: '2_enablement',
				order: 2
			}],
			run: async () => {
				const extensionsToDisable = this.extensionsWorkbenchService.local.filter(e => !e.isBuiltin && !!e.local && this.extensionEnablementService.isEnabled(e.local) && this.extensionEnablementService.canChangeEnablement(e.local));
				if (extensionsToDisable.length) {
					await this.extensionsWorkbenchService.setEnablement(extensionsToDisable, EnablementState.DisabledGlobally);
				}
			}
		});

		this.registerExtensionAction({
			id: 'workbench.extensions.action.disableAllWorkspace',
			title: localize2('disableAllWorkspace', 'Disable All Installed Extensions for this Workspace'),
			category: ExtensionsLocalizedLabel,
			menu: {
				id: MenuId.CommandPalette,
				when: ContextKeyExpr.and(WorkbenchStateContext.notEqualsTo('empty'), ContextKeyExpr.or(CONTEXT_HAS_LOCAL_SERVER, CONTEXT_HAS_REMOTE_SERVER, CONTEXT_HAS_WEB_SERVER))
			},
			run: async () => {
				const extensionsToDisable = this.extensionsWorkbenchService.local.filter(e => !e.isBuiltin && !!e.local && this.extensionEnablementService.isEnabled(e.local) && this.extensionEnablementService.canChangeEnablement(e.local));
				if (extensionsToDisable.length) {
					await this.extensionsWorkbenchService.setEnablement(extensionsToDisable, EnablementState.DisabledWorkspace);
				}
			}
		});

		this.registerExtensionAction({
			id: SELECT_INSTALL_VSIX_EXTENSION_COMMAND_ID,
			title: localize2('InstallFromVSIX', 'Install from VSIX...'),
			category: ExtensionsLocalizedLabel,
			menu: [{
				id: MenuId.CommandPalette,
				when: ContextKeyExpr.or(CONTEXT_HAS_LOCAL_SERVER, CONTEXT_HAS_REMOTE_SERVER)
			}, {
				id: MenuId.ViewContainerTitle,
				when: ContextKeyExpr.and(ContextKeyExpr.equals('viewContainer', VIEWLET_ID), ContextKeyExpr.or(CONTEXT_HAS_LOCAL_SERVER, CONTEXT_HAS_REMOTE_SERVER)),
				group: '3_install',
				order: 1
			}],
			run: async (accessor: ServicesAccessor) => {
				const fileDialogService = accessor.get(IFileDialogService);
				const commandService = accessor.get(ICommandService);
				const vsixPaths = await fileDialogService.showOpenDialog({
					title: localize('installFromVSIX', "Install from VSIX"),
					filters: [{ name: 'VSIX Extensions', extensions: ['vsix'] }],
					canSelectFiles: true,
					canSelectMany: true,
					openLabel: mnemonicButtonLabel(localize({ key: 'installButton', comment: ['&& denotes a mnemonic'] }, "&&Install"))
				});
				if (vsixPaths) {
					await commandService.executeCommand(INSTALL_EXTENSION_FROM_VSIX_COMMAND_ID, vsixPaths);
				}
			}
		});

		this.registerExtensionAction({
			id: INSTALL_EXTENSION_FROM_VSIX_COMMAND_ID,
			title: localize('installVSIX', "Install Extension VSIX"),
			menu: [{
				id: MenuId.ExplorerContext,
				group: 'extensions',
				when: ContextKeyExpr.and(ResourceContextKey.Extension.isEqualTo('.vsix'), ContextKeyExpr.or(CONTEXT_HAS_LOCAL_SERVER, CONTEXT_HAS_REMOTE_SERVER)),
			}],
			run: async (accessor: ServicesAccessor, resources: URI[] | URI) => {
				const extensionsWorkbenchService = accessor.get(IExtensionsWorkbenchService);
				const hostService = accessor.get(IHostService);
				const notificationService = accessor.get(INotificationService);

				const vsixs = Array.isArray(resources) ? resources : [resources];
				const result = await Promise.allSettled(vsixs.map(async (vsix) => await extensionsWorkbenchService.install(vsix, { installGivenVersion: true })));
				let error: Error | undefined, requireReload = false, requireRestart = false;
				for (const r of result) {
					if (r.status === 'rejected') {
						error = new Error(r.reason);
						break;
					}
					requireReload = requireReload || r.value.runtimeState?.action === ExtensionRuntimeActionType.ReloadWindow;
					requireRestart = requireRestart || r.value.runtimeState?.action === ExtensionRuntimeActionType.RestartExtensions;
				}
				if (error) {
					throw error;
				}
				if (requireReload) {
					notificationService.prompt(
						Severity.Info,
						vsixs.length > 1 ? localize('InstallVSIXs.successReload', "Completed installing extensions. Please reload Visual Studio Code to enable them.")
							: localize('InstallVSIXAction.successReload', "Completed installing extension. Please reload Visual Studio Code to enable it."),
						[{
							label: localize('InstallVSIXAction.reloadNow', "Reload Now"),
							run: () => hostService.reload()
						}]
					);
				}
				else if (requireRestart) {
					notificationService.prompt(
						Severity.Info,
						vsixs.length > 1 ? localize('InstallVSIXs.successRestart', "Completed installing extensions. Please restart extensions to enable them.")
							: localize('InstallVSIXAction.successRestart', "Completed installing extension. Please restart extensions to enable it."),
						[{
							label: localize('InstallVSIXAction.restartExtensions', "Restart Extensions"),
							run: () => extensionsWorkbenchService.updateRunningExtensions()
						}]
					);
				}
				else {
					notificationService.prompt(
						Severity.Info,
						vsixs.length > 1 ? localize('InstallVSIXs.successNoReload', "Completed installing extensions.") : localize('InstallVSIXAction.successNoReload', "Completed installing extension."),
						[]
					);
				}
			}
		});

		this.registerExtensionAction({
			id: 'workbench.extensions.action.installExtensionFromLocation',
			title: localize2('installExtensionFromLocation', 'Install Extension from Location...'),
			category: Categories.Developer,
			menu: [{
				id: MenuId.CommandPalette,
				when: ContextKeyExpr.or(CONTEXT_HAS_WEB_SERVER, CONTEXT_HAS_LOCAL_SERVER)
			}],
			run: async (accessor: ServicesAccessor) => {
				const extensionManagementService = accessor.get(IWorkbenchExtensionManagementService);
				if (isWeb) {
					return new Promise<void>((c, e) => {
						const quickInputService = accessor.get(IQuickInputService);
						const disposables = new DisposableStore();
						const quickPick = disposables.add(quickInputService.createQuickPick());
						quickPick.title = localize('installFromLocation', "Install Extension from Location");
						quickPick.customButton = true;
						quickPick.customLabel = localize('install button', "Install");
						quickPick.placeholder = localize('installFromLocationPlaceHolder', "Location of the web extension");
						quickPick.ignoreFocusOut = true;
						disposables.add(Event.any(quickPick.onDidAccept, quickPick.onDidCustom)(async () => {
							quickPick.hide();
							if (quickPick.value) {
								try {
									await extensionManagementService.installFromLocation(URI.parse(quickPick.value));
								} catch (error) {
									e(error);
									return;
								}
							}
							c();
						}));
						disposables.add(quickPick.onDidHide(() => disposables.dispose()));
						quickPick.show();
					});
				} else {
					const fileDialogService = accessor.get(IFileDialogService);
					const extensionLocation = await fileDialogService.showOpenDialog({
						canSelectFolders: true,
						canSelectFiles: false,
						canSelectMany: false,
						title: localize('installFromLocation', "Install Extension from Location"),
					});
					if (extensionLocation?.[0]) {
						await extensionManagementService.installFromLocation(extensionLocation[0]);
					}
				}
			}
		});

		MenuRegistry.appendMenuItem(extensionsSearchActionsMenu, {
			submenu: extensionsFilterSubMenu,
			title: localize('filterExtensions', "Filter Extensions..."),
			group: 'navigation',
			order: 2,
			icon: filterIcon,
		});

		const showFeaturedExtensionsId = 'extensions.filter.featured';
		const featuresExtensionsWhenContext = ContextKeyExpr.and(CONTEXT_HAS_GALLERY, ContextKeyExpr.regex(CONTEXT_GALLERY_FILTER_CAPABILITIES.key, new RegExp(`_${FilterType.Featured}_`)));
		this.registerExtensionAction({
			id: showFeaturedExtensionsId,
			title: localize2('showFeaturedExtensions', 'Show Featured Extensions'),
			category: ExtensionsLocalizedLabel,
			menu: [{
				id: MenuId.CommandPalette,
				when: featuresExtensionsWhenContext
			}, {
				id: extensionsFilterSubMenu,
				when: featuresExtensionsWhenContext,
				group: '1_predefined',
				order: 1,
			}],
			menuTitles: {
				[extensionsFilterSubMenu.id]: localize('featured filter', "Featured")
			},
			run: () => this.extensionsWorkbenchService.openSearch('@featured ')
		});

		this.registerExtensionAction({
			id: 'workbench.extensions.action.showPopularExtensions',
			title: localize2('showPopularExtensions', 'Show Popular Extensions'),
			category: ExtensionsLocalizedLabel,
			menu: [{
				id: MenuId.CommandPalette,
				when: CONTEXT_HAS_GALLERY
			}, {
				id: extensionsFilterSubMenu,
				when: CONTEXT_HAS_GALLERY,
				group: '1_predefined',
				order: 2,
			}],
			menuTitles: {
				[extensionsFilterSubMenu.id]: localize('most popular filter', "Most Popular")
			},
			run: () => this.extensionsWorkbenchService.openSearch('@popular ')
		});

		this.registerExtensionAction({
			id: 'workbench.extensions.action.showRecommendedExtensions',
			title: localize2('showRecommendedExtensions', 'Show Recommended Extensions'),
			category: ExtensionsLocalizedLabel,
			menu: [{
				id: MenuId.CommandPalette,
				when: CONTEXT_HAS_GALLERY
			}, {
				id: extensionsFilterSubMenu,
				when: CONTEXT_HAS_GALLERY,
				group: '1_predefined',
				order: 2,
			}],
			menuTitles: {
				[extensionsFilterSubMenu.id]: localize('most popular recommended', "Recommended")
			},
			run: () => this.extensionsWorkbenchService.openSearch('@recommended ')
		});

		this.registerExtensionAction({
			id: 'workbench.extensions.action.recentlyPublishedExtensions',
			title: localize2('recentlyPublishedExtensions', 'Show Recently Published Extensions'),
			category: ExtensionsLocalizedLabel,
			menu: [{
				id: MenuId.CommandPalette,
				when: CONTEXT_HAS_GALLERY
			}, {
				id: extensionsFilterSubMenu,
				when: CONTEXT_HAS_GALLERY,
				group: '1_predefined',
				order: 2,
			}],
			menuTitles: {
				[extensionsFilterSubMenu.id]: localize('recently published filter', "Recently Published")
			},
			run: () => this.extensionsWorkbenchService.openSearch('@recentlyPublished ')
		});

		const extensionsCategoryFilterSubMenu = new MenuId('extensionsCategoryFilterSubMenu');
		MenuRegistry.appendMenuItem(extensionsFilterSubMenu, {
			submenu: extensionsCategoryFilterSubMenu,
			title: localize('filter by category', "Category"),
			when: ContextKeyExpr.and(CONTEXT_HAS_GALLERY, ContextKeyExpr.regex(CONTEXT_GALLERY_FILTER_CAPABILITIES.key, new RegExp(`_${FilterType.Category}_`))),
			group: '2_categories',
			order: 1,
		});

		EXTENSION_CATEGORIES.forEach((category, index) => {
			this.registerExtensionAction({
				id: `extensions.actions.searchByCategory.${category}`,
				title: category,
				menu: [{
					id: extensionsCategoryFilterSubMenu,
					when: CONTEXT_HAS_GALLERY,
					order: index,
				}],
				run: () => this.extensionsWorkbenchService.openSearch(`@category:"${category.toLowerCase()}"`)
			});
		});

		this.registerExtensionAction({
			id: 'workbench.extensions.action.installedExtensions',
			title: localize2('installedExtensions', 'Show Installed Extensions'),
			category: ExtensionsLocalizedLabel,
			f1: true,
			menu: [{
				id: extensionsFilterSubMenu,
				group: '3_installed',
				order: 1,
			}],
			menuTitles: {
				[extensionsFilterSubMenu.id]: localize('installed filter', "Installed")
			},
			run: () => this.extensionsWorkbenchService.openSearch('@installed ')
		});

		this.registerExtensionAction({
			id: 'workbench.extensions.action.listBuiltInExtensions',
			title: localize2('showBuiltInExtensions', 'Show Built-in Extensions'),
			category: ExtensionsLocalizedLabel,
			menu: [{
				id: MenuId.CommandPalette,
				when: ContextKeyExpr.or(CONTEXT_HAS_LOCAL_SERVER, CONTEXT_HAS_REMOTE_SERVER, CONTEXT_HAS_WEB_SERVER)
			}, {
				id: extensionsFilterSubMenu,
				group: '3_installed',
				order: 3,
			}],
			menuTitles: {
				[extensionsFilterSubMenu.id]: localize('builtin filter', "Built-in")
			},
			run: () => this.extensionsWorkbenchService.openSearch('@builtin ')
		});

		this.registerExtensionAction({
			id: 'workbench.extensions.action.extensionUpdates',
			title: localize2('extensionUpdates', 'Show Extension Updates'),
			category: ExtensionsLocalizedLabel,
			precondition: CONTEXT_HAS_GALLERY,
			f1: true,
			menu: [{
				id: extensionsFilterSubMenu,
				group: '3_installed',
				when: CONTEXT_HAS_GALLERY,
				order: 2,
			}],
			menuTitles: {
				[extensionsFilterSubMenu.id]: localize('extension updates filter', "Updates")
			},
			run: () => this.extensionsWorkbenchService.openSearch('@updates')
		});

		this.registerExtensionAction({
			id: LIST_WORKSPACE_UNSUPPORTED_EXTENSIONS_COMMAND_ID,
			title: localize2('showWorkspaceUnsupportedExtensions', 'Show Extensions Unsupported By Workspace'),
			category: ExtensionsLocalizedLabel,
			menu: [{
				id: MenuId.CommandPalette,
				when: ContextKeyExpr.or(CONTEXT_HAS_LOCAL_SERVER, CONTEXT_HAS_REMOTE_SERVER),
			}, {
				id: extensionsFilterSubMenu,
				group: '3_installed',
				order: 6,
				when: ContextKeyExpr.or(CONTEXT_HAS_LOCAL_SERVER, CONTEXT_HAS_REMOTE_SERVER),
			}],
			menuTitles: {
				[extensionsFilterSubMenu.id]: localize('workspace unsupported filter', "Workspace Unsupported")
			},
			run: () => this.extensionsWorkbenchService.openSearch('@workspaceUnsupported')
		});

		this.registerExtensionAction({
			id: 'workbench.extensions.action.showEnabledExtensions',
			title: localize2('showEnabledExtensions', 'Show Enabled Extensions'),
			category: ExtensionsLocalizedLabel,
			menu: [{
				id: MenuId.CommandPalette,
				when: ContextKeyExpr.or(CONTEXT_HAS_LOCAL_SERVER, CONTEXT_HAS_REMOTE_SERVER, CONTEXT_HAS_WEB_SERVER)
			}, {
				id: extensionsFilterSubMenu,
				group: '3_installed',
				order: 4,
			}],
			menuTitles: {
				[extensionsFilterSubMenu.id]: localize('enabled filter', "Enabled")
			},
			run: () => this.extensionsWorkbenchService.openSearch('@enabled ')
		});

		this.registerExtensionAction({
			id: 'workbench.extensions.action.showDisabledExtensions',
			title: localize2('showDisabledExtensions', 'Show Disabled Extensions'),
			category: ExtensionsLocalizedLabel,
			menu: [{
				id: MenuId.CommandPalette,
				when: ContextKeyExpr.or(CONTEXT_HAS_LOCAL_SERVER, CONTEXT_HAS_REMOTE_SERVER, CONTEXT_HAS_WEB_SERVER)
			}, {
				id: extensionsFilterSubMenu,
				group: '3_installed',
				order: 5,
			}],
			menuTitles: {
				[extensionsFilterSubMenu.id]: localize('disabled filter', "Disabled")
			},
			run: () => this.extensionsWorkbenchService.openSearch('@disabled ')
		});

		const extensionsSortSubMenu = new MenuId('extensionsSortSubMenu');
		MenuRegistry.appendMenuItem(extensionsFilterSubMenu, {
			submenu: extensionsSortSubMenu,
			title: localize('sorty by', "Sort By"),
			when: ContextKeyExpr.and(ContextKeyExpr.or(CONTEXT_HAS_GALLERY, DefaultViewsContext)),
			group: '4_sort',
			order: 1,
		});

		[
			{ id: 'installs', title: localize('sort by installs', "Install Count"), precondition: BuiltInExtensionsContext.negate(), sortCapability: SortBy.InstallCount },
			{ id: 'rating', title: localize('sort by rating', "Rating"), precondition: BuiltInExtensionsContext.negate(), sortCapability: SortBy.WeightedRating },
			{ id: 'name', title: localize('sort by name', "Name"), precondition: BuiltInExtensionsContext.negate(), sortCapability: SortBy.Title },
			{ id: 'publishedDate', title: localize('sort by published date', "Published Date"), precondition: BuiltInExtensionsContext.negate(), sortCapability: SortBy.PublishedDate },
			{ id: 'updateDate', title: localize('sort by update date', "Updated Date"), precondition: ContextKeyExpr.and(SearchMarketplaceExtensionsContext.negate(), RecommendedExtensionsContext.negate(), BuiltInExtensionsContext.negate()), sortCapability: 'UpdateDate' },
		].map(({ id, title, precondition, sortCapability }, index) => {
			const sortCapabilityContext = ContextKeyExpr.regex(CONTEXT_GALLERY_SORT_CAPABILITIES.key, new RegExp(`_${sortCapability}_`));
			this.registerExtensionAction({
				id: `extensions.sort.${id}`,
				title,
				precondition: ContextKeyExpr.and(precondition, ContextKeyExpr.regex(ExtensionsSearchValueContext.key, /^@feature:/).negate(), sortCapabilityContext),
				menu: [{
					id: extensionsSortSubMenu,
					when: ContextKeyExpr.and(ContextKeyExpr.or(CONTEXT_HAS_GALLERY, DefaultViewsContext), sortCapabilityContext),
					order: index,
				}],
				toggled: ExtensionsSortByContext.isEqualTo(id),
				run: async () => {
					const extensionsViewPaneContainer = ((await this.viewsService.openViewContainer(VIEWLET_ID, true))?.getViewPaneContainer()) as IExtensionsViewPaneContainer | undefined;
					const currentQuery = Query.parse(extensionsViewPaneContainer?.searchValue ?? '');
					extensionsViewPaneContainer?.search(new Query(currentQuery.value, id).toString());
					extensionsViewPaneContainer?.focus();
				}
			});
		});

		this.registerExtensionAction({
			id: 'workbench.extensions.action.clearExtensionsSearchResults',
			title: localize2('clearExtensionsSearchResults', 'Clear Extensions Search Results'),
			category: ExtensionsLocalizedLabel,
			icon: clearSearchResultsIcon,
			f1: true,
			precondition: SearchHasTextContext,
			menu: {
				id: extensionsSearchActionsMenu,
				group: 'navigation',
				order: 1,
			},
			run: async (accessor: ServicesAccessor) => {
				const viewPaneContainer = accessor.get(IViewsService).getActiveViewPaneContainerWithId(VIEWLET_ID);
				if (viewPaneContainer) {
					const extensionsViewPaneContainer = viewPaneContainer as IExtensionsViewPaneContainer;
					extensionsViewPaneContainer.search('');
					extensionsViewPaneContainer.focus();
				}
			}
		});

		this.registerExtensionAction({
			id: 'workbench.extensions.action.refreshExtension',
			title: localize2('refreshExtension', 'Refresh'),
			category: ExtensionsLocalizedLabel,
			icon: refreshIcon,
			f1: true,
			menu: {
				id: MenuId.ViewContainerTitle,
				when: ContextKeyExpr.equals('viewContainer', VIEWLET_ID),
				group: 'navigation',
				order: 2
			},
			run: async (accessor: ServicesAccessor) => {
				const viewPaneContainer = accessor.get(IViewsService).getActiveViewPaneContainerWithId(VIEWLET_ID);
				if (viewPaneContainer) {
					await (viewPaneContainer as IExtensionsViewPaneContainer).refresh();
				}
			}
		});

		this.registerExtensionAction({
			id: 'workbench.extensions.action.installWorkspaceRecommendedExtensions',
			title: localize('installWorkspaceRecommendedExtensions', "Install Workspace Recommended Extensions"),
			icon: installWorkspaceRecommendedIcon,
			menu: {
				id: MenuId.ViewTitle,
				when: ContextKeyExpr.equals('view', WORKSPACE_RECOMMENDATIONS_VIEW_ID),
				group: 'navigation',
				order: 1
			},
			run: async (accessor: ServicesAccessor) => {
				const view = accessor.get(IViewsService).getActiveViewWithId(WORKSPACE_RECOMMENDATIONS_VIEW_ID) as IWorkspaceRecommendedExtensionsView;
				return view.installWorkspaceRecommendations();
			}
		});

		this.registerExtensionAction({
			id: ConfigureWorkspaceFolderRecommendedExtensionsAction.ID,
			title: ConfigureWorkspaceFolderRecommendedExtensionsAction.LABEL,
			icon: configureRecommendedIcon,
			menu: [{
				id: MenuId.CommandPalette,
				when: WorkbenchStateContext.notEqualsTo('empty'),
			}, {
				id: MenuId.ViewTitle,
				when: ContextKeyExpr.equals('view', WORKSPACE_RECOMMENDATIONS_VIEW_ID),
				group: 'navigation',
				order: 2
			}],
			run: () => runAction(this.instantiationService.createInstance(ConfigureWorkspaceFolderRecommendedExtensionsAction, ConfigureWorkspaceFolderRecommendedExtensionsAction.ID, ConfigureWorkspaceFolderRecommendedExtensionsAction.LABEL))
		});

		this.registerExtensionAction({
			id: InstallSpecificVersionOfExtensionAction.ID,
			title: { value: InstallSpecificVersionOfExtensionAction.LABEL, original: 'Install Specific Version of Extension...' },
			category: ExtensionsLocalizedLabel,
			menu: {
				id: MenuId.CommandPalette,
				when: ContextKeyExpr.and(CONTEXT_HAS_GALLERY, ContextKeyExpr.or(CONTEXT_HAS_LOCAL_SERVER, CONTEXT_HAS_REMOTE_SERVER, CONTEXT_HAS_WEB_SERVER))
			},
			run: () => runAction(this.instantiationService.createInstance(InstallSpecificVersionOfExtensionAction, InstallSpecificVersionOfExtensionAction.ID, InstallSpecificVersionOfExtensionAction.LABEL))
		});
	}

	// Extension Context Menu
	private registerContextMenuActions(): void {

		this.registerExtensionAction({
			id: SetColorThemeAction.ID,
			title: SetColorThemeAction.TITLE,
			menu: {
				id: MenuId.ExtensionContext,
				group: THEME_ACTIONS_GROUP,
				order: 0,
				when: ContextKeyExpr.and(ContextKeyExpr.not('inExtensionEditor'), ContextKeyExpr.equals('extensionStatus', 'installed'), ContextKeyExpr.has('extensionHasColorThemes'))
			},
			run: async (accessor: ServicesAccessor, extensionId: string) => {
				const extensionWorkbenchService = accessor.get(IExtensionsWorkbenchService);
				const instantiationService = accessor.get(IInstantiationService);
				const extension = extensionWorkbenchService.local.find(e => areSameExtensions(e.identifier, { id: extensionId }));
				if (extension) {
					const action = instantiationService.createInstance(SetColorThemeAction);
					action.extension = extension;
					return action.run();
				}
			}
		});

		this.registerExtensionAction({
			id: SetFileIconThemeAction.ID,
			title: SetFileIconThemeAction.TITLE,
			menu: {
				id: MenuId.ExtensionContext,
				group: THEME_ACTIONS_GROUP,
				order: 0,
				when: ContextKeyExpr.and(ContextKeyExpr.not('inExtensionEditor'), ContextKeyExpr.equals('extensionStatus', 'installed'), ContextKeyExpr.has('extensionHasFileIconThemes'))
			},
			run: async (accessor: ServicesAccessor, extensionId: string) => {
				const extensionWorkbenchService = accessor.get(IExtensionsWorkbenchService);
				const instantiationService = accessor.get(IInstantiationService);
				const extension = extensionWorkbenchService.local.find(e => areSameExtensions(e.identifier, { id: extensionId }));
				if (extension) {
					const action = instantiationService.createInstance(SetFileIconThemeAction);
					action.extension = extension;
					return action.run();
				}
			}
		});

		this.registerExtensionAction({
			id: SetProductIconThemeAction.ID,
			title: SetProductIconThemeAction.TITLE,
			menu: {
				id: MenuId.ExtensionContext,
				group: THEME_ACTIONS_GROUP,
				order: 0,
				when: ContextKeyExpr.and(ContextKeyExpr.not('inExtensionEditor'), ContextKeyExpr.equals('extensionStatus', 'installed'), ContextKeyExpr.has('extensionHasProductIconThemes'))
			},
			run: async (accessor: ServicesAccessor, extensionId: string) => {
				const extensionWorkbenchService = accessor.get(IExtensionsWorkbenchService);
				const instantiationService = accessor.get(IInstantiationService);
				const extension = extensionWorkbenchService.local.find(e => areSameExtensions(e.identifier, { id: extensionId }));
				if (extension) {
					const action = instantiationService.createInstance(SetProductIconThemeAction);
					action.extension = extension;
					return action.run();
				}
			}
		});

		this.registerExtensionAction({
			id: 'workbench.extensions.action.showPreReleaseVersion',
			title: localize2('show pre-release version', 'Show Pre-Release Version'),
			menu: {
				id: MenuId.ExtensionContext,
				group: INSTALL_ACTIONS_GROUP,
				order: 0,
				when: ContextKeyExpr.and(ContextKeyExpr.has('inExtensionEditor'), ContextKeyExpr.has('galleryExtensionHasPreReleaseVersion'), ContextKeyExpr.has('isPreReleaseExtensionAllowed'), ContextKeyExpr.not('showPreReleaseVersion'), ContextKeyExpr.not('isBuiltinExtension'))
			},
			run: async (accessor: ServicesAccessor, extensionId: string) => {
				const extensionWorkbenchService = accessor.get(IExtensionsWorkbenchService);
				const extension = (await extensionWorkbenchService.getExtensions([{ id: extensionId }], CancellationToken.None))[0];
				extensionWorkbenchService.open(extension, { showPreReleaseVersion: true });
			}
		});

		this.registerExtensionAction({
			id: 'workbench.extensions.action.showReleasedVersion',
			title: localize2('show released version', 'Show Release Version'),
			menu: {
				id: MenuId.ExtensionContext,
				group: INSTALL_ACTIONS_GROUP,
				order: 1,
				when: ContextKeyExpr.and(ContextKeyExpr.has('inExtensionEditor'), ContextKeyExpr.has('galleryExtensionHasPreReleaseVersion'), ContextKeyExpr.has('extensionHasReleaseVersion'), ContextKeyExpr.has('showPreReleaseVersion'), ContextKeyExpr.not('isBuiltinExtension'))
			},
			run: async (accessor: ServicesAccessor, extensionId: string) => {
				const extensionWorkbenchService = accessor.get(IExtensionsWorkbenchService);
				const extension = (await extensionWorkbenchService.getExtensions([{ id: extensionId }], CancellationToken.None))[0];
				extensionWorkbenchService.open(extension, { showPreReleaseVersion: false });
			}
		});

		this.registerExtensionAction({
			id: ToggleAutoUpdateForExtensionAction.ID,
			title: ToggleAutoUpdateForExtensionAction.LABEL,
			category: ExtensionsLocalizedLabel,
			precondition: ContextKeyExpr.and(ContextKeyExpr.or(ContextKeyExpr.notEquals(`config.${AutoUpdateConfigurationKey}`, 'onlyEnabledExtensions'), ContextKeyExpr.equals('isExtensionEnabled', true)), ContextKeyExpr.not('extensionDisallowInstall'), ContextKeyExpr.has('isExtensionAllowed')),
			menu: {
				id: MenuId.ExtensionContext,
				group: UPDATE_ACTIONS_GROUP,
				order: 1,
				when: ContextKeyExpr.and(
					ContextKeyExpr.not('inExtensionEditor'),
					ContextKeyExpr.equals('extensionStatus', 'installed'),
					ContextKeyExpr.not('isBuiltinExtension'),
				)
			},
			run: async (accessor: ServicesAccessor, id: string) => {
				const instantiationService = accessor.get(IInstantiationService);
				const extensionWorkbenchService = accessor.get(IExtensionsWorkbenchService);
				const extension = extensionWorkbenchService.local.find(e => areSameExtensions(e.identifier, { id }));
				if (extension) {
					const action = instantiationService.createInstance(ToggleAutoUpdateForExtensionAction);
					action.extension = extension;
					return action.run();
				}
			}
		});

		this.registerExtensionAction({
			id: ToggleAutoUpdatesForPublisherAction.ID,
			title: { value: ToggleAutoUpdatesForPublisherAction.LABEL, original: 'Auto Update (Publisher)' },
			category: ExtensionsLocalizedLabel,
			precondition: ContextKeyExpr.equals(`config.${AutoUpdateConfigurationKey}`, false),
			menu: {
				id: MenuId.ExtensionContext,
				group: UPDATE_ACTIONS_GROUP,
				order: 2,
				when: ContextKeyExpr.and(ContextKeyExpr.equals('extensionStatus', 'installed'), ContextKeyExpr.not('isBuiltinExtension'))
			},
			run: async (accessor: ServicesAccessor, id: string) => {
				const instantiationService = accessor.get(IInstantiationService);
				const extensionWorkbenchService = accessor.get(IExtensionsWorkbenchService);
				const extension = extensionWorkbenchService.local.find(e => areSameExtensions(e.identifier, { id }));
				if (extension) {
					const action = instantiationService.createInstance(ToggleAutoUpdatesForPublisherAction);
					action.extension = extension;
					return action.run();
				}
			}
		});

		this.registerExtensionAction({
			id: 'workbench.extensions.action.switchToPreRlease',
			title: localize('enablePreRleaseLabel', "Switch to Pre-Release Version"),
			category: ExtensionsLocalizedLabel,
			menu: {
				id: MenuId.ExtensionContext,
				group: INSTALL_ACTIONS_GROUP,
				order: 2,
				when: ContextKeyExpr.and(CONTEXT_HAS_GALLERY, ContextKeyExpr.has('galleryExtensionHasPreReleaseVersion'), ContextKeyExpr.has('isPreReleaseExtensionAllowed'), ContextKeyExpr.not('installedExtensionIsOptedToPreRelease'), ContextKeyExpr.not('inExtensionEditor'), ContextKeyExpr.equals('extensionStatus', 'installed'), ContextKeyExpr.not('isBuiltinExtension'))
			},
			run: async (accessor: ServicesAccessor, id: string) => {
				const instantiationService = accessor.get(IInstantiationService);
				const extensionWorkbenchService = accessor.get(IExtensionsWorkbenchService);
				const extension = extensionWorkbenchService.local.find(e => areSameExtensions(e.identifier, { id }));
				if (extension) {
					const action = instantiationService.createInstance(TogglePreReleaseExtensionAction);
					action.extension = extension;
					return action.run();
				}
			}
		});

		this.registerExtensionAction({
			id: 'workbench.extensions.action.switchToRelease',
			title: localize('disablePreRleaseLabel', "Switch to Release Version"),
			category: ExtensionsLocalizedLabel,
			menu: {
				id: MenuId.ExtensionContext,
				group: INSTALL_ACTIONS_GROUP,
				order: 2,
				when: ContextKeyExpr.and(CONTEXT_HAS_GALLERY, ContextKeyExpr.has('galleryExtensionHasPreReleaseVersion'), ContextKeyExpr.has('isExtensionAllowed'), ContextKeyExpr.has('installedExtensionIsOptedToPreRelease'), ContextKeyExpr.not('inExtensionEditor'), ContextKeyExpr.equals('extensionStatus', 'installed'), ContextKeyExpr.not('isBuiltinExtension'))
			},
			run: async (accessor: ServicesAccessor, id: string) => {
				const instantiationService = accessor.get(IInstantiationService);
				const extensionWorkbenchService = accessor.get(IExtensionsWorkbenchService);
				const extension = extensionWorkbenchService.local.find(e => areSameExtensions(e.identifier, { id }));
				if (extension) {
					const action = instantiationService.createInstance(TogglePreReleaseExtensionAction);
					action.extension = extension;
					return action.run();
				}
			}
		});

		this.registerExtensionAction({
			id: ClearLanguageAction.ID,
			title: ClearLanguageAction.TITLE,
			menu: {
				id: MenuId.ExtensionContext,
				group: INSTALL_ACTIONS_GROUP,
				order: 0,
				when: ContextKeyExpr.and(ContextKeyExpr.not('inExtensionEditor'), ContextKeyExpr.has('canSetLanguage'), ContextKeyExpr.has('isActiveLanguagePackExtension'))
			},
			run: async (accessor: ServicesAccessor, extensionId: string) => {
				const instantiationService = accessor.get(IInstantiationService);
				const extensionsWorkbenchService = accessor.get(IExtensionsWorkbenchService);
				const extension = (await extensionsWorkbenchService.getExtensions([{ id: extensionId }], CancellationToken.None))[0];
				const action = instantiationService.createInstance(ClearLanguageAction);
				action.extension = extension;
				return action.run();
			}
		});

		this.registerExtensionAction({
			id: 'workbench.extensions.action.installUnsigned',
			title: localize('install', "Install"),
			menu: {
				id: MenuId.ExtensionContext,
				group: '0_install',
				when: ContextKeyExpr.and(ContextKeyExpr.equals('extensionStatus', 'uninstalled'), ContextKeyExpr.has('isGalleryExtension'), ContextKeyExpr.not('extensionDisallowInstall'), ContextKeyExpr.has('extensionIsUnsigned'),
					ContextKeyExpr.or(ContextKeyExpr.and(CONTEXT_GALLERY_ALL_PUBLIC_REPOSITORY_SIGNED, ContextKeyExpr.not('extensionIsPrivate')), ContextKeyExpr.and(CONTEXT_GALLERY_ALL_PRIVATE_REPOSITORY_SIGNED, ContextKeyExpr.has('extensionIsPrivate')))),
				order: 1
			},
			run: async (accessor: ServicesAccessor, extensionId: string) => {
				const instantiationService = accessor.get(IInstantiationService);
				const extension = this.extensionsWorkbenchService.local.filter(e => areSameExtensions(e.identifier, { id: extensionId }))[0]
					|| (await this.extensionsWorkbenchService.getExtensions([{ id: extensionId }], CancellationToken.None))[0];
				if (extension) {
					const action = instantiationService.createInstance(InstallAction, { installPreReleaseVersion: this.extensionManagementService.preferPreReleases });
					action.extension = extension;
					return action.run();
				}
			}
		});

		this.registerExtensionAction({
			id: 'workbench.extensions.action.installAndDonotSync',
			title: localize('install installAndDonotSync', "Install (Do not Sync)"),
			menu: {
				id: MenuId.ExtensionContext,
				group: '0_install',
				when: ContextKeyExpr.and(ContextKeyExpr.equals('extensionStatus', 'uninstalled'), ContextKeyExpr.has('isGalleryExtension'), ContextKeyExpr.has('isExtensionAllowed'), ContextKeyExpr.not('extensionDisallowInstall'), CONTEXT_SYNC_ENABLEMENT),
				order: 1
			},
			run: async (accessor: ServicesAccessor, extensionId: string) => {
				const instantiationService = accessor.get(IInstantiationService);
				const extension = this.extensionsWorkbenchService.local.filter(e => areSameExtensions(e.identifier, { id: extensionId }))[0]
					|| (await this.extensionsWorkbenchService.getExtensions([{ id: extensionId }], CancellationToken.None))[0];
				if (extension) {
					const action = instantiationService.createInstance(InstallAction, {
						installPreReleaseVersion: this.extensionManagementService.preferPreReleases,
						isMachineScoped: true,
					});
					action.extension = extension;
					return action.run();
				}
			}
		});

		this.registerExtensionAction({
			id: 'workbench.extensions.action.installPrereleaseAndDonotSync',
			title: localize('installPrereleaseAndDonotSync', "Install Pre-Release (Do not Sync)"),
			menu: {
				id: MenuId.ExtensionContext,
				group: '0_install',
				when: ContextKeyExpr.and(ContextKeyExpr.equals('extensionStatus', 'uninstalled'), ContextKeyExpr.has('isGalleryExtension'), ContextKeyExpr.has('extensionHasPreReleaseVersion'), ContextKeyExpr.has('isPreReleaseExtensionAllowed'), ContextKeyExpr.not('extensionDisallowInstall'), CONTEXT_SYNC_ENABLEMENT),
				order: 2
			},
			run: async (accessor: ServicesAccessor, extensionId: string) => {
				const instantiationService = accessor.get(IInstantiationService);
				const extension = this.extensionsWorkbenchService.local.filter(e => areSameExtensions(e.identifier, { id: extensionId }))[0]
					|| (await this.extensionsWorkbenchService.getExtensions([{ id: extensionId }], CancellationToken.None))[0];
				if (extension) {
					const action = instantiationService.createInstance(InstallAction, {
						isMachineScoped: true,
						preRelease: true
					});
					action.extension = extension;
					return action.run();
				}
			}
		});

		this.registerExtensionAction({
			id: InstallAnotherVersionAction.ID,
			title: InstallAnotherVersionAction.LABEL,
			menu: {
				id: MenuId.ExtensionContext,
				group: '0_install',
				when: ContextKeyExpr.and(ContextKeyExpr.equals('extensionStatus', 'uninstalled'), ContextKeyExpr.has('isGalleryExtension'), ContextKeyExpr.has('isExtensionAllowed'), ContextKeyExpr.not('extensionDisallowInstall')),
				order: 3
			},
			run: async (accessor: ServicesAccessor, extensionId: string) => {
				const instantiationService = accessor.get(IInstantiationService);
				const extension = this.extensionsWorkbenchService.local.filter(e => areSameExtensions(e.identifier, { id: extensionId }))[0]
					|| (await this.extensionsWorkbenchService.getExtensions([{ id: extensionId }], CancellationToken.None))[0];
				if (extension) {
					return instantiationService.createInstance(InstallAnotherVersionAction, extension, false).run();
				}
			}
		});

		this.registerExtensionAction({
			id: 'workbench.extensions.action.copyExtension',
			title: localize2('workbench.extensions.action.copyExtension', 'Copy'),
			menu: {
				id: MenuId.ExtensionContext,
				group: '1_copy'
			},
			run: async (accessor: ServicesAccessor, extensionId: string) => {
				const clipboardService = accessor.get(IClipboardService);
				const extension = this.extensionsWorkbenchService.local.filter(e => areSameExtensions(e.identifier, { id: extensionId }))[0]
					|| (await this.extensionsWorkbenchService.getExtensions([{ id: extensionId }], CancellationToken.None))[0];
				if (extension) {
					const name = localize('extensionInfoName', 'Name: {0}', extension.displayName);
					const id = localize('extensionInfoId', 'Id: {0}', extensionId);
					const description = localize('extensionInfoDescription', 'Description: {0}', extension.description);
					const verision = localize('extensionInfoVersion', 'Version: {0}', extension.version);
					const publisher = localize('extensionInfoPublisher', 'Publisher: {0}', extension.publisherDisplayName);
					const link = extension.url ? localize('extensionInfoVSMarketplaceLink', 'VS Marketplace Link: {0}', `${extension.url}`) : null;
					const clipboardStr = `${name}\n${id}\n${description}\n${verision}\n${publisher}${link ? '\n' + link : ''}`;
					await clipboardService.writeText(clipboardStr);
				}
			}
		});

		this.registerExtensionAction({
			id: 'workbench.extensions.action.copyExtensionId',
			title: localize2('workbench.extensions.action.copyExtensionId', 'Copy Extension ID'),
			menu: {
				id: MenuId.ExtensionContext,
				group: '1_copy'
			},
			run: async (accessor: ServicesAccessor, id: string) => accessor.get(IClipboardService).writeText(id)
		});

		this.registerExtensionAction({
			id: 'workbench.extensions.action.copyLink',
			title: localize2('workbench.extensions.action.copyLink', 'Copy Link'),
			menu: {
				id: MenuId.ExtensionContext,
				group: '1_copy',
				when: ContextKeyExpr.and(ContextKeyExpr.has('isGalleryExtension'), CONTEXT_GALLERY_HAS_EXTENSION_LINK),
			},
			run: async (accessor: ServicesAccessor, _, extension: IExtensionArg) => {
				const clipboardService = accessor.get(IClipboardService);
				if (extension.galleryLink) {
					await clipboardService.writeText(extension.galleryLink);
				}
			}
		});

		this.registerExtensionAction({
			id: 'workbench.extensions.action.configure',
			title: localize2('workbench.extensions.action.configure', 'Settings'),
			menu: {
				id: MenuId.ExtensionContext,
				group: '2_configure',
				when: ContextKeyExpr.and(ContextKeyExpr.equals('extensionStatus', 'installed'), ContextKeyExpr.has('extensionHasConfiguration')),
				order: 1
			},
			run: async (accessor: ServicesAccessor, id: string) => accessor.get(IPreferencesService).openSettings({ jsonEditor: false, query: `@ext:${id}` })
		});

		this.registerExtensionAction({
			id: 'workbench.extensions.action.download',
			title: localize('download VSIX', "Download VSIX"),
			menu: {
				id: MenuId.ExtensionContext,
				when: ContextKeyExpr.and(ContextKeyExpr.not('extensionDisallowInstall'), ContextKeyExpr.has('isGalleryExtension')),
				order: this.productService.quality === 'stable' ? 0 : 1
			},
			run: async (accessor: ServicesAccessor, extensionId: string) => {
				accessor.get(IExtensionsWorkbenchService).downloadVSIX(extensionId, 'release');
			}
		});

		this.registerExtensionAction({
			id: 'workbench.extensions.action.downloadPreRelease',
			title: localize('download pre-release', "Download Pre-Release VSIX"),
			menu: {
				id: MenuId.ExtensionContext,
				when: ContextKeyExpr.and(ContextKeyExpr.not('extensionDisallowInstall'), ContextKeyExpr.has('isGalleryExtension'), ContextKeyExpr.has('extensionHasPreReleaseVersion')),
				order: this.productService.quality === 'stable' ? 1 : 0
			},
			run: async (accessor: ServicesAccessor, extensionId: string) => {
				accessor.get(IExtensionsWorkbenchService).downloadVSIX(extensionId, 'prerelease');
			}
		});

		this.registerExtensionAction({
			id: 'workbench.extensions.action.downloadSpecificVersion',
			title: localize('download specific version', "Download Specific Version VSIX..."),
			menu: {
				id: MenuId.ExtensionContext,
				when: ContextKeyExpr.and(ContextKeyExpr.not('extensionDisallowInstall'), ContextKeyExpr.has('isGalleryExtension')),
				order: 2
			},
			run: async (accessor: ServicesAccessor, extensionId: string) => {
				accessor.get(IExtensionsWorkbenchService).downloadVSIX(extensionId, 'any');
			}
		});

		this.registerExtensionAction({
			id: 'workbench.extensions.action.manageAccountPreferences',
			title: localize2('workbench.extensions.action.changeAccountPreference', "Account Preferences"),
			menu: {
				id: MenuId.ExtensionContext,
				group: '2_configure',
				when: ContextKeyExpr.and(ContextKeyExpr.equals('extensionStatus', 'installed'), ContextKeyExpr.has('extensionHasAccountPreferences')),
				order: 2,
			},
			run: (accessor: ServicesAccessor, id: string) => accessor.get(ICommandService).executeCommand('_manageAccountPreferencesForExtension', id)
		});

		this.registerExtensionAction({
			id: 'workbench.extensions.action.configureKeybindings',
			title: localize2('workbench.extensions.action.configureKeybindings', 'Keyboard Shortcuts'),
			menu: {
				id: MenuId.ExtensionContext,
				group: '2_configure',
				when: ContextKeyExpr.and(ContextKeyExpr.equals('extensionStatus', 'installed'), ContextKeyExpr.has('extensionHasKeybindings')),
				order: 2
			},
			run: async (accessor: ServicesAccessor, id: string) => accessor.get(IPreferencesService).openGlobalKeybindingSettings(false, { query: `@ext:${id}` })
		});

		this.registerExtensionAction({
			id: 'workbench.extensions.action.toggleApplyToAllProfiles',
			title: localize2('workbench.extensions.action.toggleApplyToAllProfiles', "Apply Extension to all Profiles"),
			toggled: ContextKeyExpr.has('isApplicationScopedExtension'),
			menu: {
				id: MenuId.ExtensionContext,
				group: '2_configure',
				when: ContextKeyExpr.and(ContextKeyExpr.equals('extensionStatus', 'installed'), ContextKeyExpr.has('isDefaultApplicationScopedExtension').negate(), ContextKeyExpr.has('isBuiltinExtension').negate(), ContextKeyExpr.equals('isWorkspaceScopedExtension', false)),
				order: 3
			},
			run: async (accessor: ServicesAccessor, _: string, extensionArg: IExtensionArg) => {
				const uriIdentityService = accessor.get(IUriIdentityService);
				const extension = extensionArg.location ? this.extensionsWorkbenchService.installed.find(e => uriIdentityService.extUri.isEqual(e.local?.location, extensionArg.location)) : undefined;
				if (extension) {
					return this.extensionsWorkbenchService.toggleApplyExtensionToAllProfiles(extension);
				}
			}
		});

		this.registerExtensionAction({
			id: TOGGLE_IGNORE_EXTENSION_ACTION_ID,
			title: localize2('workbench.extensions.action.toggleIgnoreExtension', "Sync This Extension"),
			menu: {
				id: MenuId.ExtensionContext,
				group: '2_configure',
				when: ContextKeyExpr.and(ContextKeyExpr.equals('extensionStatus', 'installed'), CONTEXT_SYNC_ENABLEMENT, ContextKeyExpr.equals('isWorkspaceScopedExtension', false)),
				order: 4
			},
			run: async (accessor: ServicesAccessor, id: string) => {
				const extension = this.extensionsWorkbenchService.local.find(e => areSameExtensions({ id }, e.identifier));
				if (extension) {
					return this.extensionsWorkbenchService.toggleExtensionIgnoredToSync(extension);
				}
			}
		});

		this.registerExtensionAction({
			id: 'workbench.extensions.action.ignoreRecommendation',
			title: localize2('workbench.extensions.action.ignoreRecommendation', "Ignore Recommendation"),
			menu: {
				id: MenuId.ExtensionContext,
				group: '3_recommendations',
				when: ContextKeyExpr.has('isExtensionRecommended'),
				order: 1
			},
			run: async (accessor: ServicesAccessor, id: string) => accessor.get(IExtensionIgnoredRecommendationsService).toggleGlobalIgnoredRecommendation(id, true)
		});

		this.registerExtensionAction({
			id: 'workbench.extensions.action.undoIgnoredRecommendation',
			title: localize2('workbench.extensions.action.undoIgnoredRecommendation', "Undo Ignored Recommendation"),
			menu: {
				id: MenuId.ExtensionContext,
				group: '3_recommendations',
				when: ContextKeyExpr.has('isUserIgnoredRecommendation'),
				order: 1
			},
			run: async (accessor: ServicesAccessor, id: string) => accessor.get(IExtensionIgnoredRecommendationsService).toggleGlobalIgnoredRecommendation(id, false)
		});

		this.registerExtensionAction({
			id: 'workbench.extensions.action.addExtensionToWorkspaceRecommendations',
			title: localize2('workbench.extensions.action.addExtensionToWorkspaceRecommendations', "Add to Workspace Recommendations"),
			menu: {
				id: MenuId.ExtensionContext,
				group: '3_recommendations',
				when: ContextKeyExpr.and(WorkbenchStateContext.notEqualsTo('empty'), ContextKeyExpr.has('isBuiltinExtension').negate(), ContextKeyExpr.has('isExtensionWorkspaceRecommended').negate(), ContextKeyExpr.has('isUserIgnoredRecommendation').negate(), ContextKeyExpr.notEquals('extensionSource', 'resource')),
				order: 2
			},
			run: (accessor: ServicesAccessor, id: string) => accessor.get(IWorkspaceExtensionsConfigService).toggleRecommendation(id)
		});

		this.registerExtensionAction({
			id: 'workbench.extensions.action.removeExtensionFromWorkspaceRecommendations',
			title: localize2('workbench.extensions.action.removeExtensionFromWorkspaceRecommendations', "Remove from Workspace Recommendations"),
			menu: {
				id: MenuId.ExtensionContext,
				group: '3_recommendations',
				when: ContextKeyExpr.and(WorkbenchStateContext.notEqualsTo('empty'), ContextKeyExpr.has('isBuiltinExtension').negate(), ContextKeyExpr.has('isExtensionWorkspaceRecommended')),
				order: 2
			},
			run: (accessor: ServicesAccessor, id: string) => accessor.get(IWorkspaceExtensionsConfigService).toggleRecommendation(id)
		});

		this.registerExtensionAction({
			id: 'workbench.extensions.action.addToWorkspaceRecommendations',
			title: localize2('workbench.extensions.action.addToWorkspaceRecommendations', "Add Extension to Workspace Recommendations"),
			category: EXTENSIONS_CATEGORY,
			menu: {
				id: MenuId.CommandPalette,
				when: ContextKeyExpr.and(WorkbenchStateContext.isEqualTo('workspace'), ContextKeyExpr.equals('resourceScheme', Schemas.extension)),
			},
			async run(accessor: ServicesAccessor): Promise<any> {
				const editorService = accessor.get(IEditorService);
				const workspaceExtensionsConfigService = accessor.get(IWorkspaceExtensionsConfigService);
				if (!(editorService.activeEditor instanceof ExtensionsInput)) {
					return;
				}
				const extensionId = editorService.activeEditor.extension.identifier.id.toLowerCase();
				const recommendations = await workspaceExtensionsConfigService.getRecommendations();
				if (recommendations.includes(extensionId)) {
					return;
				}
				await workspaceExtensionsConfigService.toggleRecommendation(extensionId);
			}
		});

		this.registerExtensionAction({
			id: 'workbench.extensions.action.addToWorkspaceFolderRecommendations',
			title: localize2('workbench.extensions.action.addToWorkspaceFolderRecommendations', "Add Extension to Workspace Folder Recommendations"),
			category: EXTENSIONS_CATEGORY,
			menu: {
				id: MenuId.CommandPalette,
				when: ContextKeyExpr.and(WorkbenchStateContext.isEqualTo('folder'), ContextKeyExpr.equals('resourceScheme', Schemas.extension)),
			},
			run: () => this.commandService.executeCommand('workbench.extensions.action.addToWorkspaceRecommendations')
		});

		this.registerExtensionAction({
			id: 'workbench.extensions.action.addToWorkspaceIgnoredRecommendations',
			title: localize2('workbench.extensions.action.addToWorkspaceIgnoredRecommendations', "Add Extension to Workspace Ignored Recommendations"),
			category: EXTENSIONS_CATEGORY,
			menu: {
				id: MenuId.CommandPalette,
				when: ContextKeyExpr.and(WorkbenchStateContext.isEqualTo('workspace'), ContextKeyExpr.equals('resourceScheme', Schemas.extension)),
			},
			async run(accessor: ServicesAccessor): Promise<any> {
				const editorService = accessor.get(IEditorService);
				const workspaceExtensionsConfigService = accessor.get(IWorkspaceExtensionsConfigService);
				if (!(editorService.activeEditor instanceof ExtensionsInput)) {
					return;
				}
				const extensionId = editorService.activeEditor.extension.identifier.id.toLowerCase();
				const unwantedRecommendations = await workspaceExtensionsConfigService.getUnwantedRecommendations();
				if (unwantedRecommendations.includes(extensionId)) {
					return;
				}
				await workspaceExtensionsConfigService.toggleUnwantedRecommendation(extensionId);
			}
		});

		this.registerExtensionAction({
			id: 'workbench.extensions.action.addToWorkspaceFolderIgnoredRecommendations',
			title: localize2('workbench.extensions.action.addToWorkspaceFolderIgnoredRecommendations', "Add Extension to Workspace Folder Ignored Recommendations"),
			category: EXTENSIONS_CATEGORY,
			menu: {
				id: MenuId.CommandPalette,
				when: ContextKeyExpr.and(WorkbenchStateContext.isEqualTo('folder'), ContextKeyExpr.equals('resourceScheme', Schemas.extension)),
			},
			run: () => this.commandService.executeCommand('workbench.extensions.action.addToWorkspaceIgnoredRecommendations')
		});

		this.registerExtensionAction({
			id: ConfigureWorkspaceRecommendedExtensionsAction.ID,
			title: { value: ConfigureWorkspaceRecommendedExtensionsAction.LABEL, original: 'Configure Recommended Extensions (Workspace)' },
			category: EXTENSIONS_CATEGORY,
			menu: {
				id: MenuId.CommandPalette,
				when: WorkbenchStateContext.isEqualTo('workspace'),
			},
			run: () => runAction(this.instantiationService.createInstance(ConfigureWorkspaceRecommendedExtensionsAction, ConfigureWorkspaceRecommendedExtensionsAction.ID, ConfigureWorkspaceRecommendedExtensionsAction.LABEL))
		});

		this.registerExtensionAction({
			id: 'workbench.extensions.action.manageTrustedPublishers',
			title: localize2('workbench.extensions.action.manageTrustedPublishers', "Manage Trusted Extension Publishers"),
			category: EXTENSIONS_CATEGORY,
			f1: true,
			run: async (accessor: ServicesAccessor) => {
				const quickInputService = accessor.get(IQuickInputService);
				const extensionManagementService = accessor.get(IWorkbenchExtensionManagementService);
				const trustedPublishers = extensionManagementService.getTrustedPublishers();
				const trustedPublisherItems = trustedPublishers.map(publisher => ({
					id: publisher.publisher,
					label: publisher.publisherDisplayName,
					description: publisher.publisher,
					picked: true,
				})).sort((a, b) => a.label.localeCompare(b.label));
				const result = await quickInputService.pick(trustedPublisherItems, {
					canPickMany: true,
					title: localize('trustedPublishers', "Manage Trusted Extension Publishers"),
					placeHolder: localize('trustedPublishersPlaceholder', "Choose which publishers to trust"),
				});
				if (result) {
					const untrustedPublishers = [];
					for (const { publisher } of trustedPublishers) {
						if (!result.some(r => r.id === publisher)) {
							untrustedPublishers.push(publisher);
						}
					}
					trustedPublishers.filter(publisher => !result.some(r => r.id === publisher.publisher));
					extensionManagementService.untrustPublishers(...untrustedPublishers);
				}
			}
		});

	}

	private registerExtensionAction(extensionActionOptions: IExtensionActionOptions): IDisposable {
		const menus = extensionActionOptions.menu ? Array.isArray(extensionActionOptions.menu) ? extensionActionOptions.menu : [extensionActionOptions.menu] : [];
		let menusWithOutTitles: ({ id: MenuId } & Omit<IMenuItem, 'command'>)[] = [];
		const menusWithTitles: { id: MenuId; item: IMenuItem }[] = [];
		if (extensionActionOptions.menuTitles) {
			for (let index = 0; index < menus.length; index++) {
				const menu = menus[index];
				const menuTitle = extensionActionOptions.menuTitles[menu.id.id];
				if (menuTitle) {
					menusWithTitles.push({ id: menu.id, item: { ...menu, command: { id: extensionActionOptions.id, title: menuTitle } } });
				} else {
					menusWithOutTitles.push(menu);
				}
			}
		} else {
			menusWithOutTitles = menus;
		}
		const disposables = new DisposableStore();
		disposables.add(registerAction2(class extends Action2 {
			constructor() {
				super({
					...extensionActionOptions,
					menu: menusWithOutTitles
				});
			}
			run(accessor: ServicesAccessor, ...args: unknown[]): Promise<any> {
				return extensionActionOptions.run(accessor, ...args);
			}
		}));
		if (menusWithTitles.length) {
			disposables.add(MenuRegistry.appendMenuItems(menusWithTitles));
		}
		return disposables;
	}

}

class ExtensionStorageCleaner implements IWorkbenchContribution {

	constructor(
		@IExtensionManagementService extensionManagementService: IExtensionManagementService,
		@IStorageService storageService: IStorageService,
	) {
		ExtensionStorageService.removeOutdatedExtensionVersions(extensionManagementService, storageService);
	}
}

class TrustedPublishersInitializer implements IWorkbenchContribution {
	constructor(
		@IWorkbenchExtensionManagementService extensionManagementService: IWorkbenchExtensionManagementService,
		@IUserDataProfilesService userDataProfilesService: IUserDataProfilesService,
		@IProductService productService: IProductService,
		@IStorageService storageService: IStorageService,
	) {
		const trustedPublishersInitStatusKey = 'trusted-publishers-init-migration';
		if (!storageService.get(trustedPublishersInitStatusKey, StorageScope.APPLICATION)) {
			for (const profile of userDataProfilesService.profiles) {
				extensionManagementService.getInstalled(ExtensionType.User, profile.extensionsResource)
					.then(async extensions => {
						const trustedPublishers = new Map<string, IPublisherInfo>();
						for (const extension of extensions) {
							if (!extension.publisherDisplayName) {
								continue;
							}
							const publisher = extension.manifest.publisher.toLowerCase();
							if (productService.trustedExtensionPublishers?.includes(publisher)
								|| (extension.publisherDisplayName && productService.trustedExtensionPublishers?.includes(extension.publisherDisplayName.toLowerCase()))) {
								continue;
							}
							trustedPublishers.set(publisher, { publisher, publisherDisplayName: extension.publisherDisplayName });
						}
						if (trustedPublishers.size) {
							extensionManagementService.trustPublishers(...trustedPublishers.values());
						}
						storageService.store(trustedPublishersInitStatusKey, 'true', StorageScope.APPLICATION, StorageTarget.MACHINE);
					});
			}
		}
	}
}

class ExtensionToolsContribution extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'extensions.chat.toolsContribution';

	constructor(
		@ILanguageModelToolsService toolsService: ILanguageModelToolsService,
		@IInstantiationService instantiationService: IInstantiationService,
	) {
		super();
		const searchExtensionsTool = instantiationService.createInstance(SearchExtensionsTool);
		this._register(toolsService.registerTool(SearchExtensionsToolData, searchExtensionsTool));
		this._register(toolsService.vscodeToolSet.addTool(SearchExtensionsToolData));
	}
}

const workbenchRegistry = Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench);
workbenchRegistry.registerWorkbenchContribution(ExtensionsContributions, LifecyclePhase.Restored);
workbenchRegistry.registerWorkbenchContribution(StatusUpdater, LifecyclePhase.Eventually);
workbenchRegistry.registerWorkbenchContribution(MaliciousExtensionChecker, LifecyclePhase.Eventually);
workbenchRegistry.registerWorkbenchContribution(KeymapExtensions, LifecyclePhase.Restored);
workbenchRegistry.registerWorkbenchContribution(ExtensionsViewletViewsContribution, LifecyclePhase.Restored);
workbenchRegistry.registerWorkbenchContribution(ExtensionActivationProgress, LifecyclePhase.Eventually);
workbenchRegistry.registerWorkbenchContribution(ExtensionDependencyChecker, LifecyclePhase.Eventually);
workbenchRegistry.registerWorkbenchContribution(ExtensionEnablementWorkspaceTrustTransitionParticipant, LifecyclePhase.Restored);
workbenchRegistry.registerWorkbenchContribution(ExtensionsCompletionItemsProvider, LifecyclePhase.Restored);
workbenchRegistry.registerWorkbenchContribution(UnsupportedExtensionsMigrationContrib, LifecyclePhase.Eventually);
workbenchRegistry.registerWorkbenchContribution(TrustedPublishersInitializer, LifecyclePhase.Eventually);
workbenchRegistry.registerWorkbenchContribution(ExtensionMarketplaceStatusUpdater, LifecyclePhase.Eventually);
if (isWeb) {
	workbenchRegistry.registerWorkbenchContribution(ExtensionStorageCleaner, LifecyclePhase.Eventually);
}

registerWorkbenchContribution2(ExtensionToolsContribution.ID, ExtensionToolsContribution, WorkbenchPhase.AfterRestored);


// Running Extensions
registerAction2(ShowRuntimeExtensionsAction);

registerAction2(class ExtensionsGallerySignInAction extends Action2 {
	constructor() {
		super({
			id: 'workbench.extensions.actions.gallery.signIn',
			title: localize2('signInToMarketplace', 'Sign in to access Extensions Marketplace'),
			menu: {
				id: MenuId.AccountsContext,
				when: CONTEXT_EXTENSIONS_GALLERY_STATUS.isEqualTo(ExtensionGalleryManifestStatus.RequiresSignIn)
			},
		});
	}
	run(accessor: ServicesAccessor): Promise<void> {
		return accessor.get(ICommandService).executeCommand(DEFAULT_ACCOUNT_SIGN_IN_COMMAND);
	}
});

Registry.as<IConfigurationMigrationRegistry>(ConfigurationMigrationExtensions.ConfigurationMigration)
	.registerConfigurationMigrations([{
		key: AutoUpdateConfigurationKey,
		migrateFn: (value, accessor) => {
			if (value === 'onlySelectedExtensions') {
				return { value: false };
			}
			return [];
		}
	}]);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/extensions/browser/extensions.web.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/extensions/browser/extensions.web.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { EditorPaneDescriptor, IEditorPaneRegistry } from '../../../browser/editor.js';
import { RuntimeExtensionsEditor } from './browserRuntimeExtensionsEditor.js';
import { RuntimeExtensionsInput } from '../common/runtimeExtensionsInput.js';
import { EditorExtensions } from '../../../common/editor.js';

// Running Extensions
Registry.as<IEditorPaneRegistry>(EditorExtensions.EditorPane).registerEditorPane(
	EditorPaneDescriptor.create(RuntimeExtensionsEditor, RuntimeExtensionsEditor.ID, localize('runtimeExtension', "Running Extensions")),
	[new SyncDescriptor(RuntimeExtensionsInput)]
);
```

--------------------------------------------------------------------------------

````
