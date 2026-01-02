---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 474
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 474 of 552)

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

---[FILE: src/vs/workbench/contrib/testing/browser/testCoverageBars.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/browser/testCoverageBars.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { h } from '../../../../base/browser/dom.js';
import type { IManagedHover, IManagedHoverTooltipMarkdownString } from '../../../../base/browser/ui/hover/hover.js';
import { getDefaultHoverDelegate } from '../../../../base/browser/ui/hover/hoverDelegateFactory.js';
import { MarkdownString } from '../../../../base/common/htmlContent.js';
import { Lazy } from '../../../../base/common/lazy.js';
import { Disposable, DisposableStore, toDisposable } from '../../../../base/common/lifecycle.js';
import { ITransaction, autorun, observableValue } from '../../../../base/common/observable.js';
import { isDefined } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import { localize } from '../../../../nls.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { ExplorerExtensions, IExplorerFileContribution, IExplorerFileContributionRegistry } from '../../files/browser/explorerFileContrib.js';
import * as coverUtils from './codeCoverageDisplayUtils.js';
import { ITestingCoverageBarThresholds, TestingConfigKeys, getTestingConfiguration, observeTestingConfiguration } from '../common/configuration.js';
import { AbstractFileCoverage } from '../common/testCoverage.js';
import { ITestCoverageService } from '../common/testCoverageService.js';
import { safeIntl } from '../../../../base/common/date.js';

export interface TestCoverageBarsOptions {
	/**
	 * Whether the bars should be shown in a more compact way, where only the
	 * overall bar is shown and more details are given in the hover.
	 */
	compact: boolean;
	/**
	 * Whether the overall stat is shown, defaults to true.
	 */
	overall?: boolean;
	/**
	 * Container in which is render the bars.
	 */
	container: HTMLElement;
}

/** Type that can be used to render coverage bars */
export type CoverageBarSource = Pick<AbstractFileCoverage, 'statement' | 'branch' | 'declaration'>;

export class ManagedTestCoverageBars extends Disposable {
	private _coverage?: CoverageBarSource;
	private readonly el = new Lazy(() => {
		if (this.options.compact) {
			const el = h('.test-coverage-bars.compact', [
				h('.tpc@overall'),
				h('.bar@tpcBar'),
			]);
			this.attachHover(el.tpcBar, getOverallHoverText);
			return el;
		} else {
			const el = h('.test-coverage-bars', [
				h('.tpc@overall'),
				h('.bar@statement'),
				h('.bar@function'),
				h('.bar@branch'),
			]);
			this.attachHover(el.statement, stmtCoverageText);
			this.attachHover(el.function, fnCoverageText);
			this.attachHover(el.branch, branchCoverageText);
			return el;
		}
	});

	private readonly visibleStore = this._register(new DisposableStore());
	private readonly customHovers: IManagedHover[] = [];

	/** Gets whether coverage is currently visible for the resource. */
	public get visible() {
		return !!this._coverage;
	}

	constructor(
		protected readonly options: TestCoverageBarsOptions,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IHoverService private readonly hoverService: IHoverService,
	) {
		super();
	}

	private attachHover(target: HTMLElement, factory: (coverage: CoverageBarSource) => string | IManagedHoverTooltipMarkdownString | undefined) {
		this._register(this.hoverService.setupManagedHover(getDefaultHoverDelegate('element'), target, () => this._coverage && factory(this._coverage)));
	}

	public setCoverageInfo(coverage: CoverageBarSource | undefined) {
		const ds = this.visibleStore;
		if (!coverage) {
			if (this._coverage) {
				this._coverage = undefined;
				this.customHovers.forEach(c => c.hide());
				ds.clear();
			}
			return;
		}

		if (!this._coverage) {
			const root = this.el.value.root;
			ds.add(toDisposable(() => root.remove()));
			this.options.container.appendChild(root);
			ds.add(this.configurationService.onDidChangeConfiguration(c => {
				if (!this._coverage) {
					return;
				}

				if (c.affectsConfiguration(TestingConfigKeys.CoveragePercent) || c.affectsConfiguration(TestingConfigKeys.CoverageBarThresholds)) {
					this.doRender(this._coverage);
				}
			}));
		}

		this._coverage = coverage;
		this.doRender(coverage);
	}

	private doRender(coverage: CoverageBarSource) {
		const el = this.el.value;

		const precision = this.options.compact ? 0 : 2;
		const thresholds = getTestingConfiguration(this.configurationService, TestingConfigKeys.CoverageBarThresholds);
		const overallStat = coverUtils.calculateDisplayedStat(coverage, getTestingConfiguration(this.configurationService, TestingConfigKeys.CoveragePercent));
		if (this.options.overall !== false) {
			el.overall.textContent = coverUtils.displayPercent(overallStat, precision);
		} else {
			el.overall.style.display = 'none';
		}
		if ('tpcBar' in el) { // compact mode
			renderBar(el.tpcBar, overallStat, false, thresholds);
		} else {
			renderBar(el.statement, coverUtils.percent(coverage.statement), coverage.statement.total === 0, thresholds);
			renderBar(el.function, coverage.declaration && coverUtils.percent(coverage.declaration), coverage.declaration?.total === 0, thresholds);
			renderBar(el.branch, coverage.branch && coverUtils.percent(coverage.branch), coverage.branch?.total === 0, thresholds);
		}
	}
}

const barWidth = 16;

const renderBar = (bar: HTMLElement, pct: number | undefined, isZero: boolean, thresholds: ITestingCoverageBarThresholds) => {
	if (pct === undefined) {
		bar.style.display = 'none';
		return;
	}

	bar.style.display = 'block';
	bar.style.width = `${barWidth}px`;
	// this is floored so the bar is only completely filled at 100% and not 99.9%
	bar.style.setProperty('--test-bar-width', `${Math.floor(pct * 16)}px`);

	if (isZero) {
		bar.style.color = 'currentColor';
		bar.style.opacity = '0.5';
		return;
	}

	bar.style.color = coverUtils.getCoverageColor(pct, thresholds);
	bar.style.opacity = '1';
};

const nf = safeIntl.NumberFormat();
const stmtCoverageText = (coverage: CoverageBarSource) => localize('statementCoverage', '{0}/{1} statements covered ({2})', nf.value.format(coverage.statement.covered), nf.value.format(coverage.statement.total), coverUtils.displayPercent(coverUtils.percent(coverage.statement)));
const fnCoverageText = (coverage: CoverageBarSource) => coverage.declaration && localize('functionCoverage', '{0}/{1} functions covered ({2})', nf.value.format(coverage.declaration.covered), nf.value.format(coverage.declaration.total), coverUtils.displayPercent(coverUtils.percent(coverage.declaration)));
const branchCoverageText = (coverage: CoverageBarSource) => coverage.branch && localize('branchCoverage', '{0}/{1} branches covered ({2})', nf.value.format(coverage.branch.covered), nf.value.format(coverage.branch.total), coverUtils.displayPercent(coverUtils.percent(coverage.branch)));

const getOverallHoverText = (coverage: CoverageBarSource): IManagedHoverTooltipMarkdownString => {
	const str = [
		stmtCoverageText(coverage),
		fnCoverageText(coverage),
		branchCoverageText(coverage),
	].filter(isDefined).join('\n\n');

	return {
		markdown: new MarkdownString().appendText(str),
		markdownNotSupportedFallback: str
	};
};

/**
 * Renders test coverage bars for a resource in the given container. It will
 * not render anything unless a test coverage report has been opened.
 */
export class ExplorerTestCoverageBars extends ManagedTestCoverageBars implements IExplorerFileContribution {
	private readonly resource = observableValue<URI | undefined>(this, undefined);
	private static hasRegistered = false;
	public static register() {
		if (this.hasRegistered) {
			return;
		}

		this.hasRegistered = true;
		Registry.as<IExplorerFileContributionRegistry>(ExplorerExtensions.FileContributionRegistry).register({
			create(insta, container) {
				return insta.createInstance(
					ExplorerTestCoverageBars,
					{ compact: true, container }
				);
			},
		});
	}

	constructor(
		options: TestCoverageBarsOptions,
		@IConfigurationService configurationService: IConfigurationService,
		@IHoverService hoverService: IHoverService,
		@ITestCoverageService testCoverageService: ITestCoverageService,
	) {
		super(options, configurationService, hoverService);

		const isEnabled = observeTestingConfiguration(configurationService, TestingConfigKeys.ShowCoverageInExplorer);

		this._register(autorun(async reader => {
			let info: AbstractFileCoverage | undefined;
			const coverage = testCoverageService.selected.read(reader);
			if (coverage && isEnabled.read(reader)) {
				const resource = this.resource.read(reader);
				if (resource) {
					info = coverage.getComputedForUri(resource);
				}
			}

			this.setCoverageInfo(info);
		}));
	}

	/** @inheritdoc */
	public setResource(resource: URI | undefined, transaction?: ITransaction) {
		this.resource.set(resource, transaction);
	}

	public override setCoverageInfo(coverage: AbstractFileCoverage | undefined) {
		super.setCoverageInfo(coverage);
		this.options.container?.classList.toggle('explorer-item-with-test-coverage', this.visible);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/browser/testCoverageView.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/browser/testCoverageView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { ActionBar } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { IIdentityProvider, IListVirtualDelegate } from '../../../../base/browser/ui/list/list.js';
import { ICompressedTreeElement, ICompressedTreeNode } from '../../../../base/browser/ui/tree/compressedObjectTreeModel.js';
import { ICompressibleTreeRenderer } from '../../../../base/browser/ui/tree/objectTree.js';
import { ITreeNode, ITreeSorter } from '../../../../base/browser/ui/tree/tree.js';
import { findLast } from '../../../../base/common/arraysFind.js';
import { assertNever } from '../../../../base/common/assert.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { memoize } from '../../../../base/common/decorators.js';
import { FuzzyScore, createMatches } from '../../../../base/common/filters.js';
import { Iterable } from '../../../../base/common/iterator.js';
import { Disposable, DisposableStore, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { IObservable, autorun, observableValue } from '../../../../base/common/observable.js';
import { IPrefixTreeNode } from '../../../../base/common/prefixTree.js';
import { basenameOrAuthority } from '../../../../base/common/resources.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { URI } from '../../../../base/common/uri.js';
import { Position } from '../../../../editor/common/core/position.js';
import { Range } from '../../../../editor/common/core/range.js';
import { localize, localize2 } from '../../../../nls.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { getActionBarActions } from '../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { Action2, IMenuService, MenuId, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { EditorOpenSource, TextEditorSelectionRevealType } from '../../../../platform/editor/common/editor.js';
import { FileKind } from '../../../../platform/files/common/files.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { WorkbenchCompressibleObjectTree } from '../../../../platform/list/browser/listService.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IQuickInputService, IQuickPickItem, QuickPickInput } from '../../../../platform/quickinput/common/quickInput.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IResourceLabel, ResourceLabels } from '../../../browser/labels.js';
import { IViewPaneOptions, ViewAction, ViewPane } from '../../../browser/parts/views/viewPane.js';
import { IViewDescriptorService } from '../../../common/views.js';
import { ACTIVE_GROUP, IEditorService, SIDE_GROUP } from '../../../services/editor/common/editorService.js';
import { TestCommandId, Testing } from '../common/constants.js';
import { onObservableChange } from '../common/observableUtils.js';
import { BypassedFileCoverage, ComputedFileCoverage, FileCoverage, TestCoverage, getTotalCoveragePercent } from '../common/testCoverage.js';
import { ITestCoverageService } from '../common/testCoverageService.js';
import { TestId } from '../common/testId.js';
import { TestingContextKeys } from '../common/testingContextKeys.js';
import { CoverageDetails, DetailType, ICoverageCount, IDeclarationCoverage, ITestItem, TestResultState } from '../common/testTypes.js';
import * as coverUtils from './codeCoverageDisplayUtils.js';
import { testingStatesToIcons, testingWasCovered } from './icons.js';
import { CoverageBarSource, ManagedTestCoverageBars } from './testCoverageBars.js';

const enum CoverageSortOrder {
	Coverage,
	Location,
	Name,
}

export class TestCoverageView extends ViewPane {
	private readonly tree = new MutableDisposable<TestCoverageTree>();
	public readonly sortOrder = observableValue('sortOrder', CoverageSortOrder.Location);

	constructor(
		options: IViewPaneOptions,
		@IKeybindingService keybindingService: IKeybindingService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IConfigurationService configurationService: IConfigurationService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IOpenerService openerService: IOpenerService,
		@IThemeService themeService: IThemeService,
		@IHoverService hoverService: IHoverService,
		@ITestCoverageService private readonly coverageService: ITestCoverageService,
	) {
		super(options, keybindingService, contextMenuService, configurationService, contextKeyService, viewDescriptorService, instantiationService, openerService, themeService, hoverService);
	}

	protected override renderBody(container: HTMLElement): void {
		super.renderBody(container);

		const labels = this._register(this.instantiationService.createInstance(ResourceLabels, { onDidChangeVisibility: this.onDidChangeBodyVisibility }));

		this._register(autorun(reader => {
			const coverage = this.coverageService.selected.read(reader);
			if (coverage) {
				const t = (this.tree.value ??= this.instantiationService.createInstance(TestCoverageTree, container, labels, this.sortOrder));
				t.setInput(coverage, this.coverageService.filterToTest.read(reader));
			} else {
				this.tree.clear();
			}
		}));
	}

	protected override layoutBody(height: number, width: number): void {
		super.layoutBody(height, width);
		this.tree.value?.layout(height, width);
	}

	public collapseAll(): void {
		this.tree.value?.collapseAll();
	}
}

let fnNodeId = 0;

class DeclarationCoverageNode {
	public readonly id = String(fnNodeId++);
	public readonly containedDetails = new Set<CoverageDetails>();
	public readonly children: DeclarationCoverageNode[] = [];

	public get hits() {
		return this.data.count;
	}

	public get label() {
		return this.data.name;
	}

	public get location() {
		return this.data.location;
	}

	public get tpc() {
		const attr = this.attributableCoverage();
		return attr && getTotalCoveragePercent(attr.statement, attr.branch, undefined);
	}

	constructor(
		public readonly uri: URI,
		private readonly data: IDeclarationCoverage,
		details: readonly CoverageDetails[],
	) {
		if (data.location instanceof Range) {
			for (const detail of details) {
				if (this.contains(detail.location)) {
					this.containedDetails.add(detail);
				}
			}
		}
	}

	/** Gets whether this function has a defined range and contains the given range. */
	public contains(location: Range | Position) {
		const own = this.data.location;
		return own instanceof Range && (location instanceof Range ? own.containsRange(location) : own.containsPosition(location));
	}

	/**
	 * If the function defines a range, we can look at statements within the
	 * function to get total coverage for the function, rather than a boolean
	 * yes/no.
	 */
	@memoize
	public attributableCoverage() {
		const { location, count } = this.data;
		if (!(location instanceof Range) || !count) {
			return;
		}

		const statement: ICoverageCount = { covered: 0, total: 0 };
		const branch: ICoverageCount = { covered: 0, total: 0 };
		for (const detail of this.containedDetails) {
			if (detail.type !== DetailType.Statement) {
				continue;
			}

			statement.covered += detail.count ? 1 : 0;
			statement.total++;
			if (detail.branches) {
				for (const { count } of detail.branches) {
					branch.covered += count ? 1 : 0;
					branch.total++;
				}
			}
		}

		return { statement, branch } satisfies CoverageBarSource;
	}
}

class RevealUncoveredDeclarations {
	public readonly id = String(fnNodeId++);

	public get label() {
		return localize('functionsWithoutCoverage', "{0} declarations without coverage...", this.n);
	}

	constructor(public readonly n: number) { }
}

class CurrentlyFilteredTo {
	public readonly id = String(fnNodeId++);

	public get label() {
		return localize('filteredToTest', "Showing coverage for \"{0}\"", this.testItem.label);
	}

	constructor(public readonly testItem: ITestItem) { }
}

class LoadingDetails {
	public readonly id = String(fnNodeId++);
	public readonly label = localize('loadingCoverageDetails', "Loading Coverage Details...");
}

/** Type of nodes returned from {@link TestCoverage}. Note: value is *always* defined. */
type TestCoverageFileNode = IPrefixTreeNode<ComputedFileCoverage | FileCoverage>;
type CoverageTreeElement = TestCoverageFileNode | DeclarationCoverageNode | LoadingDetails | RevealUncoveredDeclarations | CurrentlyFilteredTo;

const isFileCoverage = (c: CoverageTreeElement): c is TestCoverageFileNode => typeof c === 'object' && 'value' in c;
const isDeclarationCoverage = (c: CoverageTreeElement): c is DeclarationCoverageNode => c instanceof DeclarationCoverageNode;
const shouldShowDeclDetailsOnExpand = (c: CoverageTreeElement): c is IPrefixTreeNode<FileCoverage> =>
	isFileCoverage(c) && c.value instanceof FileCoverage && !!c.value.declaration?.total;

class TestCoverageTree extends Disposable {
	private readonly tree: WorkbenchCompressibleObjectTree<CoverageTreeElement, void>;
	private readonly inputDisposables = this._register(new DisposableStore());

	constructor(
		container: HTMLElement,
		labels: ResourceLabels,
		sortOrder: IObservable<CoverageSortOrder>,
		@IInstantiationService instantiationService: IInstantiationService,
		@IEditorService editorService: IEditorService,
		@ICommandService commandService: ICommandService,
	) {
		super();

		container.classList.add('testing-stdtree');

		this.tree = instantiationService.createInstance(
			WorkbenchCompressibleObjectTree<CoverageTreeElement, void>,
			'TestCoverageView',
			container,
			new TestCoverageTreeListDelegate(),
			[
				instantiationService.createInstance(FileCoverageRenderer, labels),
				instantiationService.createInstance(DeclarationCoverageRenderer),
				instantiationService.createInstance(BasicRenderer),
				instantiationService.createInstance(CurrentlyFilteredToRenderer),
			],
			{
				expandOnlyOnTwistieClick: true,
				sorter: new Sorter(sortOrder),
				keyboardNavigationLabelProvider: {
					getCompressedNodeKeyboardNavigationLabel(elements: CoverageTreeElement[]) {
						return elements.map(e => this.getKeyboardNavigationLabel(e)).join('/');
					},
					getKeyboardNavigationLabel(e: CoverageTreeElement) {
						return isFileCoverage(e)
							? basenameOrAuthority(e.value!.uri)
							: e.label;
					},
				},
				accessibilityProvider: {
					getAriaLabel(element: CoverageTreeElement) {
						if (isFileCoverage(element)) {
							const name = basenameOrAuthority(element.value!.uri);
							return localize('testCoverageItemLabel', "{0} coverage: {0}%", name, (element.value!.tpc * 100).toFixed(2));
						} else {
							return element.label;
						}
					},
					getWidgetAriaLabel() {
						return localize('testCoverageTreeLabel', "Test Coverage Explorer");
					}
				},
				identityProvider: new TestCoverageIdentityProvider(),
			}
		);

		this._register(autorun(reader => {
			sortOrder.read(reader);
			this.tree.resort(null, true);
		}));

		this._register(this.tree);
		this._register(this.tree.onDidChangeCollapseState(e => {
			const el = e.node.element;
			if (!e.node.collapsed && !e.node.children.length && el && shouldShowDeclDetailsOnExpand(el)) {
				if (el.value!.hasSynchronousDetails) {
					this.tree.setChildren(el, [{ element: new LoadingDetails(), incompressible: true }]);
				}

				el.value!.details().then(details => this.updateWithDetails(el, details));
			}
		}));
		this._register(this.tree.onDidOpen(e => {
			let resource: URI | undefined;
			let selection: Range | Position | undefined;
			if (e.element) {
				if (isFileCoverage(e.element) && !e.element.children?.size) {
					resource = e.element.value!.uri;
				} else if (isDeclarationCoverage(e.element)) {
					resource = e.element.uri;
					selection = e.element.location;
				} else if (e.element instanceof CurrentlyFilteredTo) {
					commandService.executeCommand(TestCommandId.CoverageFilterToTest);
					return;
				}
			}
			if (!resource) {
				return;
			}

			editorService.openEditor({
				resource,
				options: {
					selection: selection instanceof Position ? Range.fromPositions(selection, selection) : selection,
					revealIfOpened: true,
					selectionRevealType: TextEditorSelectionRevealType.NearTopIfOutsideViewport,
					preserveFocus: e.editorOptions.preserveFocus,
					pinned: e.editorOptions.pinned,
					source: EditorOpenSource.USER,
				},
			}, e.sideBySide ? SIDE_GROUP : ACTIVE_GROUP);
		}));
	}

	public setInput(coverage: TestCoverage, showOnlyTest?: TestId) {
		this.inputDisposables.clear();

		let tree = coverage.tree;

		// Filter to only a test, generate a new tree with only those items selected
		if (showOnlyTest) {
			tree = coverage.filterTreeForTest(showOnlyTest);
		}

		const files: TestCoverageFileNode[] = [];
		for (let node of tree.nodes) {
			// when showing initial children, only show from the first file or tee
			while (!(node.value instanceof FileCoverage) && node.children?.size === 1) {
				node = Iterable.first(node.children.values())!;
			}
			files.push(node);
		}

		const toChild = (value: TestCoverageFileNode): ICompressedTreeElement<CoverageTreeElement> => {
			const isFile = !value.children?.size;
			return {
				element: value,
				incompressible: isFile,
				collapsed: isFile,
				// directories can be expanded, and items with function info can be expanded
				collapsible: !isFile || !!value.value?.declaration?.total,
				children: value.children && Iterable.map(value.children?.values(), toChild)
			};
		};

		this.inputDisposables.add(onObservableChange(coverage.didAddCoverage, nodes => {
			const toRender = findLast(nodes, n => this.tree.hasElement(n));
			if (toRender) {
				this.tree.setChildren(
					toRender,
					Iterable.map(toRender.children?.values() || [], toChild),
					{ diffIdentityProvider: { getId: el => (el as TestCoverageFileNode).value!.id } }
				);
			}
		}));

		let children = Iterable.map(files, toChild);
		const filteredTo = showOnlyTest && coverage.result.getTestById(showOnlyTest.toString());
		if (filteredTo) {
			children = Iterable.concat(
				Iterable.single<ICompressedTreeElement<CoverageTreeElement>>({
					element: new CurrentlyFilteredTo(filteredTo),
					incompressible: true,
				}),
				children,
			);
		}

		this.tree.setChildren(null, children);
	}

	public layout(height: number, width: number) {
		this.tree.layout(height, width);
	}

	public collapseAll() {
		this.tree.collapseAll();
	}

	private updateWithDetails(el: IPrefixTreeNode<FileCoverage>, details: readonly CoverageDetails[]) {
		if (!this.tree.hasElement(el)) {
			return; // avoid any issues if the tree changes in the meanwhile
		}

		const decl: DeclarationCoverageNode[] = [];
		for (const fn of details) {
			if (fn.type !== DetailType.Declaration) {
				continue;
			}

			let arr = decl;
			while (true) {
				const parent = arr.find(p => p.containedDetails.has(fn));
				if (parent) {
					arr = parent.children;
				} else {
					break;
				}
			}

			arr.push(new DeclarationCoverageNode(el.value!.uri, fn, details));
		}

		const makeChild = (fn: DeclarationCoverageNode): ICompressedTreeElement<CoverageTreeElement> => ({
			element: fn,
			incompressible: true,
			collapsed: true,
			collapsible: fn.children.length > 0,
			children: fn.children.map(makeChild)
		});

		this.tree.setChildren(el, decl.map(makeChild));
	}
}

class TestCoverageTreeListDelegate implements IListVirtualDelegate<CoverageTreeElement> {
	getHeight(element: CoverageTreeElement): number {
		return 22;
	}

	getTemplateId(element: CoverageTreeElement): string {
		if (isFileCoverage(element)) {
			return FileCoverageRenderer.ID;
		}
		if (isDeclarationCoverage(element)) {
			return DeclarationCoverageRenderer.ID;
		}
		if (element instanceof LoadingDetails || element instanceof RevealUncoveredDeclarations) {
			return BasicRenderer.ID;
		}
		if (element instanceof CurrentlyFilteredTo) {
			return CurrentlyFilteredToRenderer.ID;
		}
		assertNever(element);
	}
}

class Sorter implements ITreeSorter<CoverageTreeElement> {
	constructor(private readonly order: IObservable<CoverageSortOrder>) { }
	compare(a: CoverageTreeElement, b: CoverageTreeElement): number {
		const order = this.order.get();
		if (isFileCoverage(a) && isFileCoverage(b)) {
			switch (order) {
				case CoverageSortOrder.Location:
				case CoverageSortOrder.Name:
					return a.value!.uri.toString().localeCompare(b.value!.uri.toString());
				case CoverageSortOrder.Coverage:
					return b.value!.tpc - a.value!.tpc;
			}
		} else if (isDeclarationCoverage(a) && isDeclarationCoverage(b)) {
			switch (order) {
				case CoverageSortOrder.Location:
					return Position.compare(
						a.location instanceof Range ? a.location.getStartPosition() : a.location,
						b.location instanceof Range ? b.location.getStartPosition() : b.location,
					);
				case CoverageSortOrder.Name:
					return a.label.localeCompare(b.label);
				case CoverageSortOrder.Coverage: {
					const attrA = a.tpc;
					const attrB = b.tpc;
					return (attrA !== undefined && attrB !== undefined && attrB - attrA)
						|| (+b.hits - +a.hits)
						|| a.label.localeCompare(b.label);
				}
			}
		} else {
			return 0;
		}
	}
}

interface IFilteredToTemplate {
	label: HTMLElement;
	actions: ActionBar;
}

class CurrentlyFilteredToRenderer implements ICompressibleTreeRenderer<CoverageTreeElement, FuzzyScore, IFilteredToTemplate> {
	public static readonly ID = 'C';
	public readonly templateId = CurrentlyFilteredToRenderer.ID;

	constructor(
		@IMenuService private readonly menuService: IMenuService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
	) { }

	renderCompressedElements(node: ITreeNode<ICompressedTreeNode<CoverageTreeElement>, FuzzyScore>, index: number, templateData: IFilteredToTemplate): void {
		this.renderInner(node.element.elements[node.element.elements.length - 1] as CurrentlyFilteredTo, templateData);
	}

	renderTemplate(container: HTMLElement): IFilteredToTemplate {
		container.classList.add('testing-stdtree-container');
		const label = dom.append(container, dom.$('.label'));
		const menu = this.menuService.getMenuActions(MenuId.TestCoverageFilterItem, this.contextKeyService, {
			shouldForwardArgs: true,
		});

		const actions = new ActionBar(container);
		actions.push(getActionBarActions(menu, 'inline').primary, { icon: true, label: false });
		actions.domNode.style.display = 'block';

		return { label, actions };
	}

	renderElement(element: ITreeNode<CoverageTreeElement, FuzzyScore>, index: number, templateData: IFilteredToTemplate): void {
		this.renderInner(element.element as CurrentlyFilteredTo, templateData);
	}

	disposeTemplate(templateData: IFilteredToTemplate): void {
		templateData.actions.dispose();
	}

	private renderInner(element: CurrentlyFilteredTo, container: IFilteredToTemplate) {
		container.label.innerText = element.label;
	}
}

interface FileTemplateData {
	container: HTMLElement;
	bars: ManagedTestCoverageBars;
	templateDisposables: DisposableStore;
	elementsDisposables: DisposableStore;
	label: IResourceLabel;
}

class FileCoverageRenderer implements ICompressibleTreeRenderer<CoverageTreeElement, FuzzyScore, FileTemplateData> {
	public static readonly ID = 'F';
	public readonly templateId = FileCoverageRenderer.ID;

	constructor(
		private readonly labels: ResourceLabels,
		@ILabelService private readonly labelService: ILabelService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) { }

	/** @inheritdoc */
	public renderTemplate(container: HTMLElement): FileTemplateData {
		const templateDisposables = new DisposableStore();
		container.classList.add('testing-stdtree-container', 'test-coverage-list-item');

		return {
			container,
			bars: templateDisposables.add(this.instantiationService.createInstance(ManagedTestCoverageBars, { compact: false, container })),
			label: templateDisposables.add(this.labels.create(container, {
				supportHighlights: true,
			})),
			elementsDisposables: templateDisposables.add(new DisposableStore()),
			templateDisposables,
		};
	}

	/** @inheritdoc */
	public renderElement(node: ITreeNode<CoverageTreeElement, FuzzyScore>, _index: number, templateData: FileTemplateData): void {
		this.doRender(node.element as TestCoverageFileNode, templateData, node.filterData);
	}

	/** @inheritdoc */
	public renderCompressedElements(node: ITreeNode<ICompressedTreeNode<CoverageTreeElement>, FuzzyScore>, _index: number, templateData: FileTemplateData): void {
		this.doRender(node.element.elements, templateData, node.filterData);
	}

	public disposeTemplate(templateData: FileTemplateData) {
		templateData.templateDisposables.dispose();
	}

	/** @inheritdoc */
	private doRender(element: CoverageTreeElement | CoverageTreeElement[], templateData: FileTemplateData, filterData: FuzzyScore | undefined) {
		templateData.elementsDisposables.clear();

		const stat = (element instanceof Array ? element[element.length - 1] : element) as TestCoverageFileNode;
		const file = stat.value!;
		const name = element instanceof Array ? element.map(e => basenameOrAuthority((e as TestCoverageFileNode).value!.uri)) : basenameOrAuthority(file.uri);
		if (file instanceof BypassedFileCoverage) {
			templateData.bars.setCoverageInfo(undefined);
		} else {
			templateData.elementsDisposables.add(autorun(reader => {
				stat.value?.didChange.read(reader);
				templateData.bars.setCoverageInfo(file);
			}));

			templateData.bars.setCoverageInfo(file);
		}

		templateData.label.setResource({ resource: file.uri, name }, {
			fileKind: stat.children?.size ? FileKind.FOLDER : FileKind.FILE,
			matches: createMatches(filterData),
			separator: this.labelService.getSeparator(file.uri.scheme, file.uri.authority),
			extraClasses: ['label'],
		});
	}
}

interface DeclarationTemplateData {
	container: HTMLElement;
	bars: ManagedTestCoverageBars;
	templateDisposables: DisposableStore;
	icon: HTMLElement;
	label: HTMLElement;
}

class DeclarationCoverageRenderer implements ICompressibleTreeRenderer<CoverageTreeElement, FuzzyScore, DeclarationTemplateData> {
	public static readonly ID = 'N';
	public readonly templateId = DeclarationCoverageRenderer.ID;

	constructor(
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) { }

	/** @inheritdoc */
	public renderTemplate(container: HTMLElement): DeclarationTemplateData {
		const templateDisposables = new DisposableStore();
		container.classList.add('test-coverage-list-item', 'testing-stdtree-container');

		const icon = dom.append(container, dom.$('.state'));
		const label = dom.append(container, dom.$('.label'));

		return {
			container,
			bars: templateDisposables.add(this.instantiationService.createInstance(ManagedTestCoverageBars, { compact: false, container })),
			templateDisposables,
			icon,
			label,
		};
	}

	/** @inheritdoc */
	public renderElement(node: ITreeNode<CoverageTreeElement, FuzzyScore>, _index: number, templateData: DeclarationTemplateData): void {
		this.doRender(node.element as DeclarationCoverageNode, templateData, node.filterData);
	}

	/** @inheritdoc */
	public renderCompressedElements(node: ITreeNode<ICompressedTreeNode<CoverageTreeElement>, FuzzyScore>, _index: number, templateData: DeclarationTemplateData): void {
		this.doRender(node.element.elements[node.element.elements.length - 1] as DeclarationCoverageNode, templateData, node.filterData);
	}

	public disposeTemplate(templateData: DeclarationTemplateData) {
		templateData.templateDisposables.dispose();
	}

	/** @inheritdoc */
	private doRender(element: DeclarationCoverageNode, templateData: DeclarationTemplateData, _filterData: FuzzyScore | undefined) {
		const covered = !!element.hits;
		const icon = covered ? testingWasCovered : testingStatesToIcons.get(TestResultState.Unset);
		templateData.container.classList.toggle('not-covered', !covered);
		templateData.icon.className = `computed-state ${ThemeIcon.asClassName(icon!)}`;
		templateData.label.innerText = element.label;
		templateData.bars.setCoverageInfo(element.attributableCoverage());
	}
}

class BasicRenderer implements ICompressibleTreeRenderer<CoverageTreeElement, FuzzyScore, HTMLElement> {
	public static readonly ID = 'B';
	public readonly templateId = BasicRenderer.ID;

	renderCompressedElements(node: ITreeNode<ICompressedTreeNode<CoverageTreeElement>, FuzzyScore>, _index: number, container: HTMLElement): void {
		this.renderInner(node.element.elements[node.element.elements.length - 1], container);
	}

	renderTemplate(container: HTMLElement): HTMLElement {
		return container;
	}

	renderElement(node: ITreeNode<CoverageTreeElement, FuzzyScore>, index: number, container: HTMLElement): void {
		this.renderInner(node.element, container);
	}

	disposeTemplate(): void {
		// no-op
	}

	private renderInner(element: CoverageTreeElement, container: HTMLElement) {
		container.innerText = (element as RevealUncoveredDeclarations | LoadingDetails).label;
	}
}

class TestCoverageIdentityProvider implements IIdentityProvider<CoverageTreeElement> {
	public getId(element: CoverageTreeElement) {
		return isFileCoverage(element)
			? element.value!.uri.toString()
			: element.id;
	}
}

registerAction2(class TestCoverageChangePerTestFilterAction extends Action2 {
	constructor() {
		super({
			id: TestCommandId.CoverageFilterToTest,
			category: Categories.Test,
			title: localize2('testing.changeCoverageFilter', 'Filter Coverage by Test'),
			icon: Codicon.filter,
			toggled: {
				icon: Codicon.filterFilled,
				condition: TestingContextKeys.isCoverageFilteredToTest,
			},
			menu: [
				{ id: MenuId.CommandPalette, when: TestingContextKeys.hasPerTestCoverage },
				{ id: MenuId.TestCoverageFilterItem, group: 'inline' },
				{
					id: MenuId.ViewTitle,
					when: ContextKeyExpr.and(TestingContextKeys.hasPerTestCoverage, ContextKeyExpr.equals('view', Testing.CoverageViewId)),
					group: 'navigation',
				},
			]
		});
	}

	override run(accessor: ServicesAccessor): void {
		const coverageService = accessor.get(ITestCoverageService);
		const quickInputService = accessor.get(IQuickInputService);
		const coverage = coverageService.selected.get();
		if (!coverage) {
			return;
		}

		const tests = [...coverage.allPerTestIDs()].map(TestId.fromString);
		const commonPrefix = TestId.getLengthOfCommonPrefix(tests.length, i => tests[i]);
		const result = coverage.result;
		const previousSelection = coverageService.filterToTest.get();
		const previousSelectionStr = previousSelection?.toString();

		type TItem = { label: string; testId?: TestId };

		const items: QuickPickInput<TItem>[] = [
			{ label: coverUtils.labels.allTests, id: undefined },
			{ type: 'separator' },
			...tests.map(testId => ({ label: coverUtils.getLabelForItem(result, testId, commonPrefix), testId })),
		];

		quickInputService.pick(items, {
			activeItem: items.find((item): item is TItem => 'testId' in item && item.testId?.toString() === previousSelectionStr),
			placeHolder: coverUtils.labels.pickShowCoverage,
			onDidFocus: (entry) => {
				coverageService.filterToTest.set(entry.testId, undefined);
			},
		}).then(selected => {
			coverageService.filterToTest.set(selected ? selected.testId : previousSelection, undefined);
		});
	}
});

registerAction2(class TestCoverageChangeSortingAction extends ViewAction<TestCoverageView> {
	constructor() {
		super({
			id: TestCommandId.CoverageViewChangeSorting,
			viewId: Testing.CoverageViewId,
			title: localize2('testing.changeCoverageSort', 'Change Sort Order'),
			icon: Codicon.sortPrecedence,
			menu: {
				id: MenuId.ViewTitle,
				when: ContextKeyExpr.equals('view', Testing.CoverageViewId),
				group: 'navigation',
				order: 1,
			}
		});
	}

	override runInView(accessor: ServicesAccessor, view: TestCoverageView) {
		type Item = IQuickPickItem & { value: CoverageSortOrder };

		const disposables = new DisposableStore();
		const quickInput = disposables.add(accessor.get(IQuickInputService).createQuickPick<Item>());
		const items: Item[] = [
			{ label: localize('testing.coverageSortByLocation', 'Sort by Location'), value: CoverageSortOrder.Location, description: localize('testing.coverageSortByLocationDescription', 'Files are sorted alphabetically, declarations are sorted by position') },
			{ label: localize('testing.coverageSortByCoverage', 'Sort by Coverage'), value: CoverageSortOrder.Coverage, description: localize('testing.coverageSortByCoverageDescription', 'Files and declarations are sorted by total coverage') },
			{ label: localize('testing.coverageSortByName', 'Sort by Name'), value: CoverageSortOrder.Name, description: localize('testing.coverageSortByNameDescription', 'Files and declarations are sorted alphabetically') },
		];

		quickInput.placeholder = localize('testing.coverageSortPlaceholder', 'Sort the Test Coverage view...');
		quickInput.items = items;
		quickInput.show();
		disposables.add(quickInput.onDidHide(() => disposables.dispose()));
		disposables.add(quickInput.onDidAccept(() => {
			const picked = quickInput.selectedItems[0]?.value;
			if (picked !== undefined) {
				view.sortOrder.set(picked, undefined);
				quickInput.dispose();
			}
		}));
	}
});

registerAction2(class TestCoverageCollapseAllAction extends ViewAction<TestCoverageView> {
	constructor() {
		super({
			id: TestCommandId.CoverageViewCollapseAll,
			viewId: Testing.CoverageViewId,
			title: localize2('testing.coverageCollapseAll', 'Collapse All Coverage'),
			icon: Codicon.collapseAll,
			menu: {
				id: MenuId.ViewTitle,
				when: ContextKeyExpr.equals('view', Testing.CoverageViewId),
				group: 'navigation',
				order: 2,
			}
		});
	}

	override runInView(_accessor: ServicesAccessor, view: TestCoverageView) {
		view.collapseAll();
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/browser/testExplorerActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/browser/testExplorerActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { distinct } from '../../../../base/common/arrays.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { Iterable } from '../../../../base/common/iterator.js';
import { KeyChord, KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { isDefined } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import { IActiveCodeEditor, ICodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { EmbeddedCodeEditorWidget } from '../../../../editor/browser/widget/codeEditor/embeddedCodeEditorWidget.js';
import { EditorOption, GoToLocationValues } from '../../../../editor/common/config/editorOptions.js';
import { Position } from '../../../../editor/common/core/position.js';
import { Range } from '../../../../editor/common/core/range.js';
import { EditorContextKeys } from '../../../../editor/common/editorContextKeys.js';
import { ITextModel } from '../../../../editor/common/model.js';
import { SymbolNavigationAction } from '../../../../editor/contrib/gotoSymbol/browser/goToCommands.js';
import { ReferencesModel } from '../../../../editor/contrib/gotoSymbol/browser/referencesModel.js';
import { MessageController } from '../../../../editor/contrib/message/browser/messageController.js';
import { PeekContext } from '../../../../editor/contrib/peekView/browser/peekView.js';
import { localize, localize2 } from '../../../../nls.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { Action2, IAction2Options, MenuId } from '../../../../platform/actions/common/actions.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr, ContextKeyExpression, ContextKeyGreaterExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification.js';
import { IProgressService, ProgressLocation } from '../../../../platform/progress/common/progress.js';
import { IQuickInputService, IQuickPickItem, IQuickPickSeparator } from '../../../../platform/quickinput/common/quickInput.js';
import { widgetClose } from '../../../../platform/theme/common/iconRegistry.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { ViewAction } from '../../../browser/parts/views/viewPane.js';
import { FocusedViewContext } from '../../../common/contextkeys.js';
import { IExtensionsWorkbenchService } from '../../extensions/common/extensions.js';
import { TestExplorerTreeElement, TestItemTreeElement } from './explorerProjections/index.js';
import * as icons from './icons.js';
import { TestingExplorerView } from './testingExplorerView.js';
import { TestResultsView } from './testingOutputPeek.js';
import { TestCommandId, TestExplorerViewMode, TestExplorerViewSorting, Testing, testConfigurationGroupNames } from '../common/constants.js';
import { getTestingConfiguration, TestingConfigKeys, TestingResultsViewLayout } from '../common/configuration.js';
import { ITestCoverageService } from '../common/testCoverageService.js';
import { TestId } from '../common/testId.js';
import { ITestProfileService, canUseProfileWithTest } from '../common/testProfileService.js';
import { ITestResult } from '../common/testResult.js';
import { ITestResultService } from '../common/testResultService.js';
import { IMainThreadTestCollection, IMainThreadTestController, ITestService, expandAndGetTestById, testsInFile, testsUnderUri } from '../common/testService.js';
import { ExtTestRunProfileKind, ITestRunProfile, InternalTestItem, TestItemExpandState, TestRunProfileBitset } from '../common/testTypes.js';
import { TestingContextKeys } from '../common/testingContextKeys.js';
import { ITestingContinuousRunService } from '../common/testingContinuousRunService.js';
import { ITestingPeekOpener } from '../common/testingPeekOpener.js';
import { isFailedState } from '../common/testingStates.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';

const category = Categories.Test;

const enum ActionOrder {
	// Navigation:
	Refresh = 10,
	Run,
	Debug,
	Coverage,
	RunContinuous,
	RunUsing,

	// Submenu:
	Collapse,
	ClearResults,
	DisplayMode,
	Sort,
	GoToTest,
	HideTest,
	ContinuousRunTest = -1 >>> 1, // max int, always at the end to avoid shifting on hover
}

const hasAnyTestProvider = ContextKeyGreaterExpr.create(TestingContextKeys.providerCount.key, 0);

const LABEL_RUN_TESTS = localize2('runSelectedTests', "Run Tests");
const LABEL_DEBUG_TESTS = localize2('debugSelectedTests', "Debug Tests");
const LABEL_COVERAGE_TESTS = localize2('coverageSelectedTests', "Run Tests with Coverage");

export class HideTestAction extends Action2 {
	constructor() {
		super({
			id: TestCommandId.HideTestAction,
			title: localize2('hideTest', 'Hide Test'),
			menu: {
				id: MenuId.TestItem,
				group: 'builtin@2',
				when: TestingContextKeys.testItemIsHidden.isEqualTo(false)
			},
		});
	}

	public override run(accessor: ServicesAccessor, ...elements: TestItemTreeElement[]) {
		const service = accessor.get(ITestService);
		for (const element of elements) {
			service.excluded.toggle(element.test, true);
		}
		return Promise.resolve();
	}
}

export class UnhideTestAction extends Action2 {
	constructor() {
		super({
			id: TestCommandId.UnhideTestAction,
			title: localize2('unhideTest', 'Unhide Test'),
			menu: {
				id: MenuId.TestItem,
				order: ActionOrder.HideTest,
				when: TestingContextKeys.testItemIsHidden.isEqualTo(true)
			},
		});
	}

	public override run(accessor: ServicesAccessor, ...elements: InternalTestItem[]) {
		const service = accessor.get(ITestService);
		for (const element of elements) {
			if (element instanceof TestItemTreeElement) {
				service.excluded.toggle(element.test, false);
			}
		}
		return Promise.resolve();
	}
}

export class UnhideAllTestsAction extends Action2 {
	constructor() {
		super({
			id: TestCommandId.UnhideAllTestsAction,
			title: localize2('unhideAllTests', 'Unhide All Tests'),
		});
	}

	public override run(accessor: ServicesAccessor) {
		const service = accessor.get(ITestService);
		service.excluded.clear();
		return Promise.resolve();
	}
}

const testItemInlineAndInContext = (order: ActionOrder, when?: ContextKeyExpression) => [
	{
		id: MenuId.TestItem,
		group: 'inline',
		order,
		when,
	}, {
		id: MenuId.TestItem,
		group: 'builtin@1',
		order,
		when,
	}
];

abstract class RunVisibleAction extends ViewAction<TestingExplorerView> {
	constructor(private readonly bitset: TestRunProfileBitset, desc: Readonly<IAction2Options>) {
		super({
			...desc,
			viewId: Testing.ExplorerViewId,
		});
	}

	/**
	 * @override
	 */
	public runInView(accessor: ServicesAccessor, view: TestingExplorerView, ...elements: TestItemTreeElement[]): Promise<unknown> {
		const { include, exclude } = view.getTreeIncludeExclude(this.bitset, elements.map(e => e.test));
		return accessor.get(ITestService).runTests({
			tests: include,
			exclude,
			group: this.bitset,
		});
	}
}

export class DebugAction extends RunVisibleAction {
	constructor() {
		super(TestRunProfileBitset.Debug, {
			id: TestCommandId.DebugAction,
			title: localize2('debug test', 'Debug Test'),
			icon: icons.testingDebugIcon,
			menu: testItemInlineAndInContext(ActionOrder.Debug, TestingContextKeys.hasDebuggableTests.isEqualTo(true)),
		});
	}
}

export class CoverageAction extends RunVisibleAction {
	constructor() {
		super(TestRunProfileBitset.Coverage, {
			id: TestCommandId.RunWithCoverageAction,
			title: localize2('run with cover test', 'Run Test with Coverage'),
			icon: icons.testingCoverageIcon,
			menu: testItemInlineAndInContext(ActionOrder.Coverage, TestingContextKeys.hasCoverableTests.isEqualTo(true)),
		});
	}
}

export class RunUsingProfileAction extends Action2 {
	constructor() {
		super({
			id: TestCommandId.RunUsingProfileAction,
			title: localize2('testing.runUsing', 'Execute Using Profile...'),
			icon: icons.testingDebugIcon,
			menu: {
				id: MenuId.TestItem,
				order: ActionOrder.RunUsing,
				group: 'builtin@2',
				when: TestingContextKeys.hasNonDefaultProfile.isEqualTo(true),
			},
		});
	}

	public override async run(acessor: ServicesAccessor, ...elements: TestItemTreeElement[]): Promise<void> {
		const commandService = acessor.get(ICommandService);
		const testService = acessor.get(ITestService);
		const profile: ITestRunProfile | undefined = await commandService.executeCommand('vscode.pickTestProfile', {
			onlyForTest: elements[0].test,
		});
		if (!profile) {
			return;
		}

		testService.runResolvedTests({
			group: profile.group,
			targets: [{
				profileId: profile.profileId,
				controllerId: profile.controllerId,
				testIds: elements.filter(t => canUseProfileWithTest(profile, t.test)).map(t => t.test.item.extId)
			}]
		});
	}
}

export class RunAction extends RunVisibleAction {
	constructor() {
		super(TestRunProfileBitset.Run, {
			id: TestCommandId.RunAction,
			title: localize2('run test', 'Run Test'),
			icon: icons.testingRunIcon,
			menu: testItemInlineAndInContext(ActionOrder.Run, TestingContextKeys.hasRunnableTests.isEqualTo(true)),
		});
	}
}

export class SelectDefaultTestProfiles extends Action2 {
	constructor() {
		super({
			id: TestCommandId.SelectDefaultTestProfiles,
			title: localize2('testing.selectDefaultTestProfiles', 'Select Default Profile'),
			icon: icons.testingUpdateProfiles,
			category,
		});
	}

	public override async run(acessor: ServicesAccessor, onlyGroup: TestRunProfileBitset) {
		const commands = acessor.get(ICommandService);
		const testProfileService = acessor.get(ITestProfileService);
		const profiles = await commands.executeCommand<ITestRunProfile[]>('vscode.pickMultipleTestProfiles', {
			showConfigureButtons: false,
			selected: testProfileService.getGroupDefaultProfiles(onlyGroup),
			onlyGroup,
		});

		if (profiles?.length) {
			testProfileService.setGroupDefaultProfiles(onlyGroup, profiles);
		}
	}
}

export class ContinuousRunTestAction extends Action2 {
	constructor() {
		super({
			id: TestCommandId.ToggleContinousRunForTest,
			title: localize2('testing.toggleContinuousRunOn', 'Turn on Continuous Run'),
			icon: icons.testingTurnContinuousRunOn,
			precondition: ContextKeyExpr.or(
				TestingContextKeys.isContinuousModeOn.isEqualTo(true),
				TestingContextKeys.isParentRunningContinuously.isEqualTo(false)
			),
			toggled: {
				condition: TestingContextKeys.isContinuousModeOn.isEqualTo(true),
				icon: icons.testingContinuousIsOn,
				title: localize('testing.toggleContinuousRunOff', 'Turn off Continuous Run'),
			},
			menu: testItemInlineAndInContext(ActionOrder.ContinuousRunTest, TestingContextKeys.supportsContinuousRun.isEqualTo(true)),
		});
	}

	public override async run(accessor: ServicesAccessor, ...elements: TestItemTreeElement[]): Promise<void> {
		const crService = accessor.get(ITestingContinuousRunService);
		for (const element of elements) {
			const id = element.test.item.extId;
			if (crService.isSpecificallyEnabledFor(id)) {
				crService.stop(id);
				continue;
			}

			crService.start(TestRunProfileBitset.Run, id);
		}
	}
}

export class ContinuousRunUsingProfileTestAction extends Action2 {
	constructor() {
		super({
			id: TestCommandId.ContinousRunUsingForTest,
			title: localize2('testing.startContinuousRunUsing', 'Start Continous Run Using...'),
			icon: icons.testingDebugIcon,
			menu: [
				{
					id: MenuId.TestItem,
					order: ActionOrder.RunContinuous,
					group: 'builtin@2',
					when: ContextKeyExpr.and(
						TestingContextKeys.supportsContinuousRun.isEqualTo(true),
						TestingContextKeys.isContinuousModeOn.isEqualTo(false),
					)
				}
			],
		});
	}

	public override async run(accessor: ServicesAccessor, ...elements: TestItemTreeElement[]): Promise<void> {
		const crService = accessor.get(ITestingContinuousRunService);
		const profileService = accessor.get(ITestProfileService);
		const notificationService = accessor.get(INotificationService);
		const quickInputService = accessor.get(IQuickInputService);

		for (const element of elements) {
			const selected = await selectContinuousRunProfiles(crService, notificationService, quickInputService,
				[{ profiles: profileService.getControllerProfiles(element.test.controllerId) }]);

			if (selected.length) {
				crService.start(selected, element.test.item.extId);
			}
		}
	}
}

export class ConfigureTestProfilesAction extends Action2 {
	constructor() {
		super({
			id: TestCommandId.ConfigureTestProfilesAction,
			title: localize2('testing.configureProfile', "Configure Test Profiles"),
			icon: icons.testingUpdateProfiles,
			f1: true,
			category,
			menu: {
				id: MenuId.CommandPalette,
				when: TestingContextKeys.hasConfigurableProfile.isEqualTo(true),
			},
		});
	}

	public override async run(acessor: ServicesAccessor, onlyGroup?: TestRunProfileBitset) {
		const commands = acessor.get(ICommandService);
		const testProfileService = acessor.get(ITestProfileService);
		const profile = await commands.executeCommand<ITestRunProfile>('vscode.pickTestProfile', {
			placeholder: localize('configureProfile', 'Select a profile to update'),
			showConfigureButtons: false,
			onlyConfigurable: true,
			onlyGroup,
		});

		if (profile) {
			testProfileService.configure(profile.controllerId, profile.profileId);
		}
	}
}

const continuousMenus = (whenIsContinuousOn: boolean): IAction2Options['menu'] => [
	{
		id: MenuId.ViewTitle,
		group: 'navigation',
		order: ActionOrder.RunUsing,
		when: ContextKeyExpr.and(
			ContextKeyExpr.equals('view', Testing.ExplorerViewId),
			TestingContextKeys.supportsContinuousRun.isEqualTo(true),
			TestingContextKeys.isContinuousModeOn.isEqualTo(whenIsContinuousOn),
		),
	},
	{
		id: MenuId.CommandPalette,
		when: TestingContextKeys.supportsContinuousRun.isEqualTo(true),
	},
];

class StopContinuousRunAction extends Action2 {
	constructor() {
		super({
			id: TestCommandId.StopContinousRun,
			title: localize2('testing.stopContinuous', 'Stop Continuous Run'),
			category,
			icon: icons.testingTurnContinuousRunOff,
			menu: continuousMenus(true),
		});
	}

	run(accessor: ServicesAccessor): void {
		accessor.get(ITestingContinuousRunService).stop();
	}
}

function selectContinuousRunProfiles(
	crs: ITestingContinuousRunService,
	notificationService: INotificationService,
	quickInputService: IQuickInputService,
	profilesToPickFrom: Iterable<Readonly<{
		controller?: IMainThreadTestController;
		profiles: ITestRunProfile[];
	}>>,
): Promise<ITestRunProfile[]> {
	type ItemType = IQuickPickItem & { profile: ITestRunProfile };

	const items: ItemType[] = [];
	for (const { controller, profiles } of profilesToPickFrom) {
		for (const profile of profiles) {
			if (profile.supportsContinuousRun) {
				items.push({
					label: profile.label || controller?.label.get() || '',
					description: controller?.label.get(),
					profile,
				});
			}
		}
	}

	if (items.length === 0) {
		notificationService.info(localize('testing.noProfiles', 'No test continuous run-enabled profiles were found'));
		return Promise.resolve([]);
	}

	// special case: don't bother to quick a pickpick if there's only a single profile
	if (items.length === 1) {
		return Promise.resolve([items[0].profile]);
	}

	const qpItems: (ItemType | IQuickPickSeparator)[] = [];
	const selectedItems: ItemType[] = [];
	const lastRun = crs.lastRunProfileIds;

	items.sort((a, b) => a.profile.group - b.profile.group
		|| a.profile.controllerId.localeCompare(b.profile.controllerId)
		|| a.label.localeCompare(b.label));

	for (let i = 0; i < items.length; i++) {
		const item = items[i];
		if (i === 0 || items[i - 1].profile.group !== item.profile.group) {
			qpItems.push({ type: 'separator', label: testConfigurationGroupNames[item.profile.group] });
		}

		qpItems.push(item);
		if (lastRun.has(item.profile.profileId)) {
			selectedItems.push(item);
		}
	}

	const disposables = new DisposableStore();
	const quickpick = disposables.add(quickInputService.createQuickPick<IQuickPickItem & { profile: ITestRunProfile }>({ useSeparators: true }));
	quickpick.title = localize('testing.selectContinuousProfiles', 'Select profiles to run when files change:');
	quickpick.canSelectMany = true;
	quickpick.items = qpItems;
	quickpick.selectedItems = selectedItems;
	quickpick.show();
	return new Promise(resolve => {
		disposables.add(quickpick.onDidAccept(() => {
			resolve(quickpick.selectedItems.map(i => i.profile));
			disposables.dispose();
		}));

		disposables.add(quickpick.onDidHide(() => {
			resolve([]);
			disposables.dispose();
		}));
	});
}

class StartContinuousRunAction extends Action2 {
	constructor() {
		super({
			id: TestCommandId.StartContinousRun,
			title: localize2('testing.startContinuous', "Start Continuous Run"),
			category,
			icon: icons.testingTurnContinuousRunOn,
			menu: continuousMenus(false),
		});
	}
	async run(accessor: ServicesAccessor): Promise<void> {
		const crs = accessor.get(ITestingContinuousRunService);
		const profileService = accessor.get(ITestProfileService);

		const lastRunProfiles = [...profileService.all()].flatMap(p => p.profiles.filter(p => crs.lastRunProfileIds.has(p.profileId)));
		if (lastRunProfiles.length) {
			return crs.start(lastRunProfiles);
		}

		const selected = await selectContinuousRunProfiles(crs, accessor.get(INotificationService), accessor.get(IQuickInputService), accessor.get(ITestProfileService).all());
		if (selected.length) {
			crs.start(selected);
		}
	}
}

abstract class ExecuteSelectedAction extends ViewAction<TestingExplorerView> {
	constructor(options: IAction2Options, private readonly group: TestRunProfileBitset) {
		super({
			...options,
			menu: [{
				id: MenuId.ViewTitle,
				order: group === TestRunProfileBitset.Run
					? ActionOrder.Run
					: group === TestRunProfileBitset.Debug
						? ActionOrder.Debug
						: ActionOrder.Coverage,
				group: 'navigation',
				when: ContextKeyExpr.and(
					ContextKeyExpr.equals('view', Testing.ExplorerViewId),
					TestingContextKeys.isRunning.isEqualTo(false),
					TestingContextKeys.capabilityToContextKey[group].isEqualTo(true),
				)
			}],
			category,
			viewId: Testing.ExplorerViewId,
		});
	}

	/**
	 * @override
	 */
	public runInView(accessor: ServicesAccessor, view: TestingExplorerView): Promise<ITestResult | undefined> {
		const { include, exclude } = view.getTreeIncludeExclude(this.group);
		return accessor.get(ITestService).runTests({ tests: include, exclude, group: this.group });
	}
}

export class GetSelectedProfiles extends Action2 {
	constructor() {
		super({ id: TestCommandId.GetSelectedProfiles, title: localize2('getSelectedProfiles', 'Get Selected Profiles') });
	}

	/**
	 * @override
	 */
	public override run(accessor: ServicesAccessor) {
		const profiles = accessor.get(ITestProfileService);
		return [
			...profiles.getGroupDefaultProfiles(TestRunProfileBitset.Run),
			...profiles.getGroupDefaultProfiles(TestRunProfileBitset.Debug),
			...profiles.getGroupDefaultProfiles(TestRunProfileBitset.Coverage),
		].map(p => ({
			controllerId: p.controllerId,
			label: p.label,
			kind: p.group & TestRunProfileBitset.Coverage
				? ExtTestRunProfileKind.Coverage
				: p.group & TestRunProfileBitset.Debug
					? ExtTestRunProfileKind.Debug
					: ExtTestRunProfileKind.Run,
		}));
	}
}

export class GetExplorerSelection extends ViewAction<TestingExplorerView> {
	constructor() {
		super({ id: TestCommandId.GetExplorerSelection, title: localize2('getExplorerSelection', 'Get Explorer Selection'), viewId: Testing.ExplorerViewId });
	}

	/**
	 * @override
	 */
	public override runInView(_accessor: ServicesAccessor, view: TestingExplorerView) {
		const { include, exclude } = view.getTreeIncludeExclude(TestRunProfileBitset.Run, undefined, 'selected');
		const mapper = (i: InternalTestItem) => i.item.extId;
		return { include: include.map(mapper), exclude: exclude.map(mapper) };
	}
}

export class RunSelectedAction extends ExecuteSelectedAction {
	constructor() {
		super({
			id: TestCommandId.RunSelectedAction,
			title: LABEL_RUN_TESTS,
			icon: icons.testingRunAllIcon,
		}, TestRunProfileBitset.Run);
	}
}

export class DebugSelectedAction extends ExecuteSelectedAction {
	constructor() {
		super({
			id: TestCommandId.DebugSelectedAction,
			title: LABEL_DEBUG_TESTS,
			icon: icons.testingDebugAllIcon,
		}, TestRunProfileBitset.Debug);
	}
}

export class CoverageSelectedAction extends ExecuteSelectedAction {
	constructor() {
		super({
			id: TestCommandId.CoverageSelectedAction,
			title: LABEL_COVERAGE_TESTS,
			icon: icons.testingCoverageAllIcon,
		}, TestRunProfileBitset.Coverage);
	}
}

const showDiscoveringWhile = <R>(progress: IProgressService, task: Promise<R>): Promise<R> => {
	return progress.withProgress(
		{
			location: ProgressLocation.Window,
			title: localize('discoveringTests', 'Discovering Tests'),
		},
		() => task,
	);
};

abstract class RunOrDebugAllTestsAction extends Action2 {
	constructor(options: IAction2Options, private readonly group: TestRunProfileBitset, private noTestsFoundError: string) {
		super({
			...options,
			category,
			menu: [{
				id: MenuId.CommandPalette,
				when: TestingContextKeys.capabilityToContextKey[group].isEqualTo(true),
			}]
		});
	}

	public async run(accessor: ServicesAccessor) {
		const testService = accessor.get(ITestService);
		const notifications = accessor.get(INotificationService);

		const roots = [...testService.collection.rootItems].filter(r => r.children.size
			|| r.expand === TestItemExpandState.Expandable || r.expand === TestItemExpandState.BusyExpanding);
		if (!roots.length) {
			notifications.info(this.noTestsFoundError);
			return;
		}

		await testService.runTests({ tests: roots, group: this.group });
	}
}

export class RunAllAction extends RunOrDebugAllTestsAction {
	constructor() {
		super(
			{
				id: TestCommandId.RunAllAction,
				title: localize2('runAllTests', 'Run All Tests'),
				icon: icons.testingRunAllIcon,
				keybinding: {
					weight: KeybindingWeight.WorkbenchContrib,
					primary: KeyChord(KeyMod.CtrlCmd | KeyCode.Semicolon, KeyCode.KeyA),
				},
			},
			TestRunProfileBitset.Run,
			localize('noTestProvider', 'No tests found in this workspace. You may need to install a test provider extension'),
		);
	}
}

export class DebugAllAction extends RunOrDebugAllTestsAction {
	constructor() {
		super(
			{
				id: TestCommandId.DebugAllAction,
				title: localize2('debugAllTests', 'Debug All Tests'),
				icon: icons.testingDebugIcon,
				keybinding: {
					weight: KeybindingWeight.WorkbenchContrib,
					primary: KeyChord(KeyMod.CtrlCmd | KeyCode.Semicolon, KeyMod.CtrlCmd | KeyCode.KeyA),
				},
			},
			TestRunProfileBitset.Debug,
			localize('noDebugTestProvider', 'No debuggable tests found in this workspace. You may need to install a test provider extension'),
		);
	}
}

export class CoverageAllAction extends RunOrDebugAllTestsAction {
	constructor() {
		super(
			{
				id: TestCommandId.RunAllWithCoverageAction,
				title: localize2('runAllWithCoverage', 'Run All Tests with Coverage'),
				icon: icons.testingCoverageIcon,
				keybinding: {
					weight: KeybindingWeight.WorkbenchContrib,
					primary: KeyChord(KeyMod.CtrlCmd | KeyCode.Semicolon, KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyA),
				},
			},
			TestRunProfileBitset.Coverage,
			localize('noCoverageTestProvider', 'No tests with coverage runners found in this workspace. You may need to install a test provider extension'),
		);
	}
}

export class CancelTestRunAction extends Action2 {
	constructor() {
		super({
			id: TestCommandId.CancelTestRunAction,
			title: localize2('testing.cancelRun', 'Cancel Test Run'),
			icon: icons.testingCancelIcon,
			category,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.Semicolon, KeyMod.CtrlCmd | KeyCode.KeyX),
			},
			menu: [{
				id: MenuId.ViewTitle,
				order: ActionOrder.Run,
				group: 'navigation',
				when: ContextKeyExpr.and(
					ContextKeyExpr.equals('view', Testing.ExplorerViewId),
					ContextKeyExpr.equals(TestingContextKeys.isRunning.serialize(), true),
				)
			}, {
				id: MenuId.CommandPalette,
				when: TestingContextKeys.isRunning,
			}]
		});
	}

	/**
	 * @override
	 */
	public async run(accessor: ServicesAccessor, resultId?: string, taskId?: string) {
		const resultService = accessor.get(ITestResultService);
		const testService = accessor.get(ITestService);
		if (resultId) {
			testService.cancelTestRun(resultId, taskId);
		} else {
			for (const run of resultService.results) {
				if (!run.completedAt) {
					testService.cancelTestRun(run.id);
				}
			}
		}
	}
}

export class TestingViewAsListAction extends ViewAction<TestingExplorerView> {
	constructor() {
		super({
			id: TestCommandId.TestingViewAsListAction,
			viewId: Testing.ExplorerViewId,
			title: localize2('testing.viewAsList', 'View as List'),
			toggled: TestingContextKeys.viewMode.isEqualTo(TestExplorerViewMode.List),
			menu: {
				id: MenuId.ViewTitle,
				order: ActionOrder.DisplayMode,
				group: 'viewAs',
				when: ContextKeyExpr.equals('view', Testing.ExplorerViewId)
			}
		});
	}

	/**
	 * @override
	 */
	public runInView(_accessor: ServicesAccessor, view: TestingExplorerView) {
		view.viewModel.viewMode = TestExplorerViewMode.List;
	}
}

export class TestingViewAsTreeAction extends ViewAction<TestingExplorerView> {
	constructor() {
		super({
			id: TestCommandId.TestingViewAsTreeAction,
			viewId: Testing.ExplorerViewId,
			title: localize2('testing.viewAsTree', 'View as Tree'),
			toggled: TestingContextKeys.viewMode.isEqualTo(TestExplorerViewMode.Tree),
			menu: {
				id: MenuId.ViewTitle,
				order: ActionOrder.DisplayMode,
				group: 'viewAs',
				when: ContextKeyExpr.equals('view', Testing.ExplorerViewId)
			}
		});
	}

	/**
	 * @override
	 */
	public runInView(_accessor: ServicesAccessor, view: TestingExplorerView) {
		view.viewModel.viewMode = TestExplorerViewMode.Tree;
	}
}


export class TestingSortByStatusAction extends ViewAction<TestingExplorerView> {
	constructor() {
		super({
			id: TestCommandId.TestingSortByStatusAction,
			viewId: Testing.ExplorerViewId,
			title: localize2('testing.sortByStatus', 'Sort by Status'),
			toggled: TestingContextKeys.viewSorting.isEqualTo(TestExplorerViewSorting.ByStatus),
			menu: {
				id: MenuId.ViewTitle,
				order: ActionOrder.Sort,
				group: 'sortBy',
				when: ContextKeyExpr.equals('view', Testing.ExplorerViewId)
			}
		});
	}

	/**
	 * @override
	 */
	public runInView(_accessor: ServicesAccessor, view: TestingExplorerView) {
		view.viewModel.viewSorting = TestExplorerViewSorting.ByStatus;
	}
}

export class TestingSortByLocationAction extends ViewAction<TestingExplorerView> {
	constructor() {
		super({
			id: TestCommandId.TestingSortByLocationAction,
			viewId: Testing.ExplorerViewId,
			title: localize2('testing.sortByLocation', 'Sort by Location'),
			toggled: TestingContextKeys.viewSorting.isEqualTo(TestExplorerViewSorting.ByLocation),
			menu: {
				id: MenuId.ViewTitle,
				order: ActionOrder.Sort,
				group: 'sortBy',
				when: ContextKeyExpr.equals('view', Testing.ExplorerViewId)
			}
		});
	}

	/**
	 * @override
	 */
	public runInView(_accessor: ServicesAccessor, view: TestingExplorerView) {
		view.viewModel.viewSorting = TestExplorerViewSorting.ByLocation;
	}
}

export class TestingSortByDurationAction extends ViewAction<TestingExplorerView> {
	constructor() {
		super({
			id: TestCommandId.TestingSortByDurationAction,
			viewId: Testing.ExplorerViewId,
			title: localize2('testing.sortByDuration', 'Sort by Duration'),
			toggled: TestingContextKeys.viewSorting.isEqualTo(TestExplorerViewSorting.ByDuration),
			menu: {
				id: MenuId.ViewTitle,
				order: ActionOrder.Sort,
				group: 'sortBy',
				when: ContextKeyExpr.equals('view', Testing.ExplorerViewId)
			}
		});
	}

	/**
	 * @override
	 */
	public runInView(_accessor: ServicesAccessor, view: TestingExplorerView) {
		view.viewModel.viewSorting = TestExplorerViewSorting.ByDuration;
	}
}

export class ShowMostRecentOutputAction extends Action2 {
	constructor() {
		super({
			id: TestCommandId.ShowMostRecentOutputAction,
			title: localize2('testing.showMostRecentOutput', 'Show Output'),
			category,
			icon: Codicon.terminal,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.Semicolon, KeyMod.CtrlCmd | KeyCode.KeyO),
			},
			precondition: TestingContextKeys.hasAnyResults.isEqualTo(true),
			menu: [{
				id: MenuId.ViewTitle,
				order: ActionOrder.Collapse,
				group: 'navigation',
				when: ContextKeyExpr.equals('view', Testing.ExplorerViewId),
			}, {
				id: MenuId.CommandPalette,
				when: TestingContextKeys.hasAnyResults.isEqualTo(true)
			}]
		});
	}

	public async run(accessor: ServicesAccessor) {
		const viewService = accessor.get(IViewsService);
		const testView = await viewService.openView<TestResultsView>(Testing.ResultsViewId, true);
		testView?.showLatestRun();
	}
}

export class CollapseAllAction extends ViewAction<TestingExplorerView> {
	constructor() {
		super({
			id: TestCommandId.CollapseAllAction,
			viewId: Testing.ExplorerViewId,
			title: localize2('testing.collapseAll', 'Collapse All Tests'),
			icon: Codicon.collapseAll,
			menu: {
				id: MenuId.ViewTitle,
				order: ActionOrder.Collapse,
				group: 'displayAction',
				when: ContextKeyExpr.equals('view', Testing.ExplorerViewId)
			}
		});
	}

	/**
	 * @override
	 */
	public runInView(_accessor: ServicesAccessor, view: TestingExplorerView) {
		view.viewModel.collapseAll();
	}
}

export class ClearTestResultsAction extends Action2 {
	constructor() {
		super({
			id: TestCommandId.ClearTestResultsAction,
			title: localize2('testing.clearResults', 'Clear All Results'),
			category,
			icon: Codicon.clearAll,
			menu: [{
				id: MenuId.TestPeekTitle,
			}, {
				id: MenuId.CommandPalette,
				when: TestingContextKeys.hasAnyResults.isEqualTo(true),
			}, {
				id: MenuId.ViewTitle,
				order: ActionOrder.ClearResults,
				group: 'displayAction',
				when: ContextKeyExpr.equals('view', Testing.ExplorerViewId)
			}, {
				id: MenuId.ViewTitle,
				order: ActionOrder.ClearResults,
				group: 'navigation',
				when: ContextKeyExpr.equals('view', Testing.ResultsViewId)
			}],
		});
	}

	/**
	 * @override
	 */
	public run(accessor: ServicesAccessor) {
		accessor.get(ITestResultService).clear();
	}
}

export class GoToTest extends Action2 {
	constructor() {
		super({
			id: TestCommandId.GoToTest,
			title: localize2('testing.editFocusedTest', 'Go to Test'),
			icon: Codicon.goToFile,
			menu: {
				id: MenuId.TestItem,
				group: 'builtin@1',
				order: ActionOrder.GoToTest,
				when: TestingContextKeys.testItemHasUri.isEqualTo(true),
			},
			keybinding: {
				weight: KeybindingWeight.EditorContrib - 10,
				when: FocusedViewContext.isEqualTo(Testing.ExplorerViewId),
				primary: KeyCode.Enter | KeyMod.Alt,
			},
		});
	}

	public override async run(accessor: ServicesAccessor, element?: TestExplorerTreeElement, preserveFocus?: boolean) {
		if (!element) {
			const view = accessor.get(IViewsService).getActiveViewWithId<TestingExplorerView>(Testing.ExplorerViewId);
			element = view?.focusedTreeElements[0];
		}

		if (element && element instanceof TestItemTreeElement) {
			accessor.get(ICommandService).executeCommand('vscode.revealTest', element.test.item.extId, preserveFocus);
		}
	}
}

async function getTestsAtCursor(testService: ITestService, uriIdentityService: IUriIdentityService, uri: URI, position: Position, filter?: (test: InternalTestItem) => boolean) {
	// testsInFile will descend in the test tree. We assume that as we go
	// deeper, ranges get more specific. We'll want to run all tests whose
	// range is equal to the most specific range we find (see #133519)
	//
	// If we don't find any test whose range contains the position, we pick
	// the closest one before the position. Again, if we find several tests
	// whose range is equal to the closest one, we run them all.

	let bestNodes: InternalTestItem[] = [];
	let bestRange: Range | undefined;

	let bestNodesBefore: InternalTestItem[] = [];
	let bestRangeBefore: Range | undefined;

	for await (const tests of testsInFile(testService, uriIdentityService, uri)) {
		for (const test of tests) {
			if (!test.item.range || filter?.(test) === false) {
				continue;
			}

			const irange = Range.lift(test.item.range);
			if (irange.containsPosition(position)) {
				if (bestRange && Range.equalsRange(test.item.range, bestRange)) {
					// check that a parent isn't already included (#180760)
					if (!bestNodes.some(b => TestId.isChild(b.item.extId, test.item.extId))) {
						bestNodes.push(test);
					}
				} else {
					bestRange = irange;
					bestNodes = [test];
				}
			} else if (Position.isBefore(irange.getStartPosition(), position)) {
				if (!bestRangeBefore || bestRangeBefore.getStartPosition().isBefore(irange.getStartPosition())) {
					bestRangeBefore = irange;
					bestNodesBefore = [test];
				} else if (irange.equalsRange(bestRangeBefore) && !bestNodesBefore.some(b => TestId.isChild(b.item.extId, test.item.extId))) {
					bestNodesBefore.push(test);
				}
			}
		}
	}

	return bestNodes.length ? bestNodes : bestNodesBefore;
}

const enum EditorContextOrder {
	RunAtCursor,
	DebugAtCursor,
	RunInFile,
	DebugInFile,
	GoToRelated,
	PeekRelated,
}

abstract class ExecuteTestAtCursor extends Action2 {
	constructor(options: IAction2Options, protected readonly group: TestRunProfileBitset) {
		super({
			...options,
			menu: [{
				id: MenuId.CommandPalette,
				when: hasAnyTestProvider,
			}, {
				id: MenuId.EditorContext,
				group: 'testing',
				order: group === TestRunProfileBitset.Run ? EditorContextOrder.RunAtCursor : EditorContextOrder.DebugAtCursor,
				when: ContextKeyExpr.and(TestingContextKeys.activeEditorHasTests, TestingContextKeys.capabilityToContextKey[group]),
			}]
		});
	}

	/**
	 * @override
	 */
	public async run(accessor: ServicesAccessor) {
		const codeEditorService = accessor.get(ICodeEditorService);
		const editorService = accessor.get(IEditorService);
		const activeEditorPane = editorService.activeEditorPane;
		let editor = codeEditorService.getActiveCodeEditor();
		if (!activeEditorPane || !editor) {
			return;
		}

		if (editor instanceof EmbeddedCodeEditorWidget) {
			editor = editor.getParentEditor();
		}

		const position = editor?.getPosition();
		const model = editor?.getModel();
		if (!position || !model || !('uri' in model)) {
			return;
		}

		const testService = accessor.get(ITestService);
		const profileService = accessor.get(ITestProfileService);
		const uriIdentityService = accessor.get(IUriIdentityService);
		const progressService = accessor.get(IProgressService);
		const configurationService = accessor.get(IConfigurationService);

		const saveBeforeTest = getTestingConfiguration(configurationService, TestingConfigKeys.SaveBeforeTest);
		if (saveBeforeTest) {
			await editorService.save({ editor: activeEditorPane.input, groupId: activeEditorPane.group.id });
			await testService.syncTests();
		}


		// testsInFile will descend in the test tree. We assume that as we go
		// deeper, ranges get more specific. We'll want to run all tests whose
		// range is equal to the most specific range we find (see #133519)
		//
		// If we don't find any test whose range contains the position, we pick
		// the closest one before the position. Again, if we find several tests
		// whose range is equal to the closest one, we run them all.
		const testsToRun = await showDiscoveringWhile(progressService,
			getTestsAtCursor(
				testService,
				uriIdentityService,
				model.uri,
				position,
				test => !!(profileService.capabilitiesForTest(test.item) & this.group)
			)
		);

		if (testsToRun.length) {
			await testService.runTests({ group: this.group, tests: testsToRun });
			return;
		}

		const relatedTests = await testService.getTestsRelatedToCode(model.uri, position);
		if (relatedTests.length) {
			await testService.runTests({ group: this.group, tests: relatedTests });
			return;
		}

		if (editor) {
			MessageController.get(editor)?.showMessage(localize('noTestsAtCursor', "No tests found here"), position);
		}
	}
}

export class RunAtCursor extends ExecuteTestAtCursor {
	constructor() {
		super({
			id: TestCommandId.RunAtCursor,
			title: localize2('testing.runAtCursor', 'Run Test at Cursor'),
			category,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				when: EditorContextKeys.editorTextFocus,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.Semicolon, KeyCode.KeyC),
			},
		}, TestRunProfileBitset.Run);
	}
}

export class DebugAtCursor extends ExecuteTestAtCursor {
	constructor() {
		super({
			id: TestCommandId.DebugAtCursor,
			title: localize2('testing.debugAtCursor', 'Debug Test at Cursor'),
			category,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				when: EditorContextKeys.editorTextFocus,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.Semicolon, KeyMod.CtrlCmd | KeyCode.KeyC),
			},
		}, TestRunProfileBitset.Debug);
	}
}

export class CoverageAtCursor extends ExecuteTestAtCursor {
	constructor() {
		super({
			id: TestCommandId.CoverageAtCursor,
			title: localize2('testing.coverageAtCursor', 'Run Test at Cursor with Coverage'),
			category,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				when: EditorContextKeys.editorTextFocus,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.Semicolon, KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyC),
			},
		}, TestRunProfileBitset.Coverage);
	}
}

abstract class ExecuteTestsUnderUriAction extends Action2 {
	constructor(options: IAction2Options, protected readonly group: TestRunProfileBitset) {
		super({
			...options,
			menu: [{
				id: MenuId.ExplorerContext,
				when: TestingContextKeys.capabilityToContextKey[group].isEqualTo(true),
				group: '6.5_testing',
				order: (group === TestRunProfileBitset.Run ? ActionOrder.Run : ActionOrder.Debug) + 0.1,
			}],
		});
	}

	public override async run(accessor: ServicesAccessor, uri: URI): Promise<unknown> {
		const testService = accessor.get(ITestService);
		const notificationService = accessor.get(INotificationService);
		const tests = await Iterable.asyncToArray(testsUnderUri(
			testService,
			accessor.get(IUriIdentityService),
			uri
		));

		if (!tests.length) {
			notificationService.notify({ message: localize('noTests', 'No tests found in the selected file or folder'), severity: Severity.Info });
			return;
		}

		return testService.runTests({ tests, group: this.group });
	}
}

class RunTestsUnderUri extends ExecuteTestsUnderUriAction {
	constructor() {
		super({
			id: TestCommandId.RunByUri,
			title: LABEL_RUN_TESTS,
			category,
		}, TestRunProfileBitset.Run);
	}
}

class DebugTestsUnderUri extends ExecuteTestsUnderUriAction {
	constructor() {
		super({
			id: TestCommandId.DebugByUri,
			title: LABEL_DEBUG_TESTS,
			category,
		}, TestRunProfileBitset.Debug);
	}
}

class CoverageTestsUnderUri extends ExecuteTestsUnderUriAction {
	constructor() {
		super({
			id: TestCommandId.CoverageByUri,
			title: LABEL_COVERAGE_TESTS,
			category,
		}, TestRunProfileBitset.Coverage);
	}
}

abstract class ExecuteTestsInCurrentFile extends Action2 {
	constructor(options: IAction2Options, protected readonly group: TestRunProfileBitset) {
		super({
			...options,
			menu: [{
				id: MenuId.CommandPalette,
				when: TestingContextKeys.capabilityToContextKey[group].isEqualTo(true),
			}, {
				id: MenuId.EditorContext,
				group: 'testing',
				order: group === TestRunProfileBitset.Run ? EditorContextOrder.RunInFile : EditorContextOrder.DebugInFile,
				when: ContextKeyExpr.and(TestingContextKeys.activeEditorHasTests, TestingContextKeys.capabilityToContextKey[group]),
			}],
		});
	}

	private async _runByUris(accessor: ServicesAccessor, files: URI[]): Promise<{ completedAt: number | undefined }> {
		const uriIdentity = accessor.get(IUriIdentityService);
		const testService = accessor.get(ITestService);
		const discovered: InternalTestItem[] = [];
		for (const uri of files) {
			for await (const files of testsInFile(testService, uriIdentity, uri, undefined, true)) {
				for (const file of files) {
					discovered.push(file);
				}
			}
		}

		if (discovered.length) {
			const r = await testService.runTests({ tests: discovered, group: this.group });
			return { completedAt: r.completedAt };
		}

		return { completedAt: undefined };
	}

	/**
	 * @override
	 */
	public run(accessor: ServicesAccessor, files?: URI[]) {
		if (files?.length) {
			return this._runByUris(accessor, files);
		}

		const uriIdentity = accessor.get(IUriIdentityService);
		let editor = accessor.get(ICodeEditorService).getActiveCodeEditor();
		if (!editor) {
			return;
		}
		if (editor instanceof EmbeddedCodeEditorWidget) {
			editor = editor.getParentEditor();
		}
		const position = editor?.getPosition();
		const model = editor?.getModel();
		if (!position || !model || !('uri' in model)) {
			return;
		}

		const testService = accessor.get(ITestService);

		// Iterate through the entire collection and run any tests that are in the
		// uri. See #138007.
		const queue = [testService.collection.rootIds];
		const discovered: InternalTestItem[] = [];
		while (queue.length) {
			for (const id of queue.pop()!) {
				const node = testService.collection.getNodeById(id)!;
				if (uriIdentity.extUri.isEqual(node.item.uri, model.uri)) {
					discovered.push(node);
				} else {
					queue.push(node.children);
				}
			}
		}

		if (discovered.length) {
			return testService.runTests({
				tests: discovered,
				group: this.group,
			});
		}

		if (editor) {
			MessageController.get(editor)?.showMessage(localize('noTestsInFile', "No tests found in this file"), position);
		}

		return undefined;
	}
}

export class RunCurrentFile extends ExecuteTestsInCurrentFile {

	constructor() {
		super({
			id: TestCommandId.RunCurrentFile,
			title: localize2('testing.runCurrentFile', 'Run Tests in Current File'),
			category,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				when: EditorContextKeys.editorTextFocus,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.Semicolon, KeyCode.KeyF),
			},
		}, TestRunProfileBitset.Run);
	}
}

export class DebugCurrentFile extends ExecuteTestsInCurrentFile {
	constructor() {
		super({
			id: TestCommandId.DebugCurrentFile,
			title: localize2('testing.debugCurrentFile', 'Debug Tests in Current File'),
			category,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				when: EditorContextKeys.editorTextFocus,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.Semicolon, KeyMod.CtrlCmd | KeyCode.KeyF),
			},
		}, TestRunProfileBitset.Debug);
	}
}

export class CoverageCurrentFile extends ExecuteTestsInCurrentFile {
	constructor() {
		super({
			id: TestCommandId.CoverageCurrentFile,
			title: localize2('testing.coverageCurrentFile', 'Run Tests with Coverage in Current File'),
			category,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				when: EditorContextKeys.editorTextFocus,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.Semicolon, KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyF),
			},
		}, TestRunProfileBitset.Coverage);
	}
}

export const discoverAndRunTests = async (
	collection: IMainThreadTestCollection,
	progress: IProgressService,
	ids: ReadonlyArray<string>,
	runTests: (tests: ReadonlyArray<InternalTestItem>) => Promise<ITestResult>,
): Promise<ITestResult | undefined> => {
	const todo = Promise.all(ids.map(p => expandAndGetTestById(collection, p)));
	const tests = (await showDiscoveringWhile(progress, todo)).filter(isDefined);
	return tests.length ? await runTests(tests) : undefined;
};

abstract class RunOrDebugExtsByPath extends Action2 {
	/**
	 * @override
	 */
	public async run(accessor: ServicesAccessor, ...args: unknown[]) {
		const testService = accessor.get(ITestService);
		await discoverAndRunTests(
			accessor.get(ITestService).collection,
			accessor.get(IProgressService),
			[...this.getTestExtIdsToRun(accessor, ...args)],
			tests => this.runTest(testService, tests),
		);
	}

	protected abstract getTestExtIdsToRun(accessor: ServicesAccessor, ...args: unknown[]): Iterable<string>;

	protected abstract runTest(service: ITestService, node: readonly InternalTestItem[]): Promise<ITestResult>;
}

abstract class RunOrDebugFailedTests extends RunOrDebugExtsByPath {
	constructor(options: IAction2Options) {
		super({
			...options,
			menu: {
				id: MenuId.CommandPalette,
				when: hasAnyTestProvider,
			},
		});
	}
	/**
	 * @inheritdoc
	 */
	protected getTestExtIdsToRun(accessor: ServicesAccessor) {
		const { results } = accessor.get(ITestResultService);
		const ids = new Set<string>();
		for (let i = results.length - 1; i >= 0; i--) {
			const resultSet = results[i];
			for (const test of resultSet.tests) {
				if (isFailedState(test.ownComputedState)) {
					ids.add(test.item.extId);
				} else {
					ids.delete(test.item.extId);
				}
			}
		}

		return ids;
	}
}


abstract class RunOrDebugLastRun extends Action2 {
	constructor(options: IAction2Options) {
		super({
			...options,
			menu: {
				id: MenuId.CommandPalette,
				when: ContextKeyExpr.and(
					hasAnyTestProvider,
					TestingContextKeys.hasAnyResults.isEqualTo(true),
				),
			},
		});
	}

	protected abstract getGroup(): TestRunProfileBitset;

	protected getLastTestRunRequest(accessor: ServicesAccessor, runId?: string) {
		const resultService = accessor.get(ITestResultService);
		const lastResult = runId ? resultService.results.find(r => r.id === runId) : resultService.results[0];
		return lastResult?.request;
	}

	/** @inheritdoc */
	public override async run(accessor: ServicesAccessor, runId?: string) {
		const resultService = accessor.get(ITestResultService);
		const lastResult = runId ? resultService.results.find(r => r.id === runId) : resultService.results[0];
		if (!lastResult) {
			return;
		}

		const req = lastResult.request;
		const testService = accessor.get(ITestService);
		const profileService = accessor.get(ITestProfileService);
		const profileExists = (t: { controllerId: string; profileId: number }) =>
			profileService.getControllerProfiles(t.controllerId).some(p => p.profileId === t.profileId);

		await discoverAndRunTests(
			testService.collection,
			accessor.get(IProgressService),
			req.targets.flatMap(t => t.testIds),
			tests => {
				// If we're requesting a re-run in the same group and have the same profiles
				// as were used before, then use those exactly. Otherwise guess naively.
				if (this.getGroup() & req.group && req.targets.every(profileExists)) {
					return testService.runResolvedTests({
						targets: req.targets,
						group: req.group,
						exclude: req.exclude,
					});
				} else {
					return testService.runTests({ tests, group: this.getGroup() });
				}
			},
		);
	}
}

export class ReRunFailedTests extends RunOrDebugFailedTests {
	constructor() {
		super({
			id: TestCommandId.ReRunFailedTests,
			title: localize2('testing.reRunFailTests', 'Rerun Failed Tests'),
			category,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.Semicolon, KeyCode.KeyE),
			},
		});
	}

	protected runTest(service: ITestService, internalTests: InternalTestItem[]): Promise<ITestResult> {
		return service.runTests({
			group: TestRunProfileBitset.Run,
			tests: internalTests,
		});
	}
}

export class DebugFailedTests extends RunOrDebugFailedTests {
	constructor() {
		super({
			id: TestCommandId.DebugFailedTests,
			title: localize2('testing.debugFailTests', 'Debug Failed Tests'),
			category,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.Semicolon, KeyMod.CtrlCmd | KeyCode.KeyE),
			},
		});
	}

	protected runTest(service: ITestService, internalTests: InternalTestItem[]): Promise<ITestResult> {
		return service.runTests({
			group: TestRunProfileBitset.Debug,
			tests: internalTests,
		});
	}
}

export class ReRunLastRun extends RunOrDebugLastRun {
	constructor() {
		super({
			id: TestCommandId.ReRunLastRun,
			title: localize2('testing.reRunLastRun', 'Rerun Last Run'),
			category,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.Semicolon, KeyCode.KeyL),
			},
		});
	}

	protected override getGroup(): TestRunProfileBitset {
		return TestRunProfileBitset.Run;
	}
}

export class DebugLastRun extends RunOrDebugLastRun {
	constructor() {
		super({
			id: TestCommandId.DebugLastRun,
			title: localize2('testing.debugLastRun', 'Debug Last Run'),
			category,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.Semicolon, KeyMod.CtrlCmd | KeyCode.KeyL),
			},
		});
	}

	protected override getGroup(): TestRunProfileBitset {
		return TestRunProfileBitset.Debug;
	}
}

export class CoverageLastRun extends RunOrDebugLastRun {
	constructor() {
		super({
			id: TestCommandId.CoverageLastRun,
			title: localize2('testing.coverageLastRun', 'Rerun Last Run with Coverage'),
			category,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.Semicolon, KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyL),
			},
		});
	}

	protected override getGroup(): TestRunProfileBitset {
		return TestRunProfileBitset.Coverage;
	}
}

abstract class RunOrDebugFailedFromLastRun extends Action2 {
	constructor(options: IAction2Options) {
		super({
			...options,
			menu: {
				id: MenuId.CommandPalette,
				when: ContextKeyExpr.and(
					hasAnyTestProvider,
					TestingContextKeys.hasAnyResults.isEqualTo(true),
				),
			},
		});
	}

	protected abstract getGroup(): TestRunProfileBitset;

	/** @inheritdoc */
	public override async run(accessor: ServicesAccessor, runId?: string) {
		const resultService = accessor.get(ITestResultService);
		const testService = accessor.get(ITestService);
		const progressService = accessor.get(IProgressService);

		const lastResult = runId ? resultService.results.find(r => r.id === runId) : resultService.results[0];
		if (!lastResult) {
			return;
		}

		const failedTestIds = new Set<string>();
		for (const test of lastResult.tests) {
			if (isFailedState(test.ownComputedState)) {
				failedTestIds.add(test.item.extId);
			}
		}

		if (failedTestIds.size === 0) {
			return;
		}

		await discoverAndRunTests(
			testService.collection,
			progressService,
			Array.from(failedTestIds),
			tests => testService.runTests({ tests, group: this.getGroup() }),
		);
	}
}

export class ReRunFailedFromLastRun extends RunOrDebugFailedFromLastRun {
	constructor() {
		super({
			id: TestCommandId.ReRunFailedFromLastRun,
			title: localize2('testing.reRunFailedFromLastRun', 'Rerun Failed Tests from Last Run'),
			category,
		});
	}

	protected override getGroup(): TestRunProfileBitset {
		return TestRunProfileBitset.Run;
	}
}

export class DebugFailedFromLastRun extends RunOrDebugFailedFromLastRun {
	constructor() {
		super({
			id: TestCommandId.DebugFailedFromLastRun,
			title: localize2('testing.debugFailedFromLastRun', 'Debug Failed Tests from Last Run'),
			category,
		});
	}

	protected override getGroup(): TestRunProfileBitset {
		return TestRunProfileBitset.Debug;
	}
}

export class SearchForTestExtension extends Action2 {
	constructor() {
		super({
			id: TestCommandId.SearchForTestExtension,
			title: localize2('testing.searchForTestExtension', 'Search for Test Extension'),
		});
	}

	public async run(accessor: ServicesAccessor) {
		accessor.get(IExtensionsWorkbenchService).openSearch('@category:"testing"');
	}
}

export class OpenOutputPeek extends Action2 {
	constructor() {
		super({
			id: TestCommandId.OpenOutputPeek,
			title: localize2('testing.openOutputPeek', 'Peek Output'),
			category,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.Semicolon, KeyMod.CtrlCmd | KeyCode.KeyM),
			},
			menu: {
				id: MenuId.CommandPalette,
				when: TestingContextKeys.hasAnyResults.isEqualTo(true),
			},
		});
	}

	public async run(accessor: ServicesAccessor) {
		accessor.get(ITestingPeekOpener).open();
	}
}

export class ToggleInlineTestOutput extends Action2 {
	constructor() {
		super({
			id: TestCommandId.ToggleInlineTestOutput,
			title: localize2('testing.toggleInlineTestOutput', 'Toggle Inline Test Output'),
			category,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.Semicolon, KeyMod.CtrlCmd | KeyCode.KeyI),
			},
			menu: {
				id: MenuId.CommandPalette,
				when: TestingContextKeys.hasAnyResults.isEqualTo(true),
			},
		});
	}

	public async run(accessor: ServicesAccessor) {
		const testService = accessor.get(ITestService);
		testService.showInlineOutput.value = !testService.showInlineOutput.value;
	}
}

const refreshMenus = (whenIsRefreshing: boolean): IAction2Options['menu'] => [
	{
		id: MenuId.TestItem,
		group: 'inline',
		order: ActionOrder.Refresh,
		when: ContextKeyExpr.and(
			TestingContextKeys.canRefreshTests.isEqualTo(true),
			TestingContextKeys.isRefreshingTests.isEqualTo(whenIsRefreshing),
		),
	},
	{
		id: MenuId.ViewTitle,
		group: 'navigation',
		order: ActionOrder.Refresh,
		when: ContextKeyExpr.and(
			ContextKeyExpr.equals('view', Testing.ExplorerViewId),
			TestingContextKeys.canRefreshTests.isEqualTo(true),
			TestingContextKeys.isRefreshingTests.isEqualTo(whenIsRefreshing),
		),
	},
	{
		id: MenuId.CommandPalette,
		when: TestingContextKeys.canRefreshTests.isEqualTo(true),
	},
];

export class RefreshTestsAction extends Action2 {
	constructor() {
		super({
			id: TestCommandId.RefreshTestsAction,
			title: localize2('testing.refreshTests', 'Refresh Tests'),
			category,
			icon: icons.testingRefreshTests,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.Semicolon, KeyMod.CtrlCmd | KeyCode.KeyR),
				when: TestingContextKeys.canRefreshTests.isEqualTo(true),
			},
			menu: refreshMenus(false),
		});
	}

	public async run(accessor: ServicesAccessor, ...elements: TestItemTreeElement[]) {
		const testService = accessor.get(ITestService);
		const progressService = accessor.get(IProgressService);

		const controllerIds = distinct(elements.filter(isDefined).map(e => e.test.controllerId));
		return progressService.withProgress({ location: Testing.ViewletId }, async () => {
			if (controllerIds.length) {
				await Promise.all(controllerIds.map(id => testService.refreshTests(id)));
			} else {
				await testService.refreshTests();
			}
		});
	}
}

export class CancelTestRefreshAction extends Action2 {
	constructor() {
		super({
			id: TestCommandId.CancelTestRefreshAction,
			title: localize2('testing.cancelTestRefresh', 'Cancel Test Refresh'),
			category,
			icon: icons.testingCancelRefreshTests,
			menu: refreshMenus(true),
		});
	}

	public async run(accessor: ServicesAccessor) {
		accessor.get(ITestService).cancelRefreshTests();
	}
}

export class CleareCoverage extends Action2 {
	constructor() {
		super({
			id: TestCommandId.CoverageClear,
			title: localize2('testing.clearCoverage', 'Clear Coverage'),
			icon: widgetClose,
			category,
			menu: [{
				id: MenuId.ViewTitle,
				group: 'navigation',
				order: ActionOrder.Refresh,
				when: ContextKeyExpr.equals('view', Testing.CoverageViewId)
			}, {
				id: MenuId.CommandPalette,
				when: TestingContextKeys.isTestCoverageOpen.isEqualTo(true),
			}]
		});
	}

	public override run(accessor: ServicesAccessor) {
		accessor.get(ITestCoverageService).closeCoverage();
	}
}

export class OpenCoverage extends Action2 {
	constructor() {
		super({
			id: TestCommandId.OpenCoverage,
			title: localize2('testing.openCoverage', 'Open Coverage'),
			category,
			menu: [{
				id: MenuId.CommandPalette,
				when: TestingContextKeys.hasAnyResults.isEqualTo(true),
			}]
		});
	}

	public override run(accessor: ServicesAccessor) {
		const results = accessor.get(ITestResultService).results;
		const task = results.length && results[0].tasks.find(r => r.coverage);
		if (!task) {
			const notificationService = accessor.get(INotificationService);
			notificationService.info(localize('testing.noCoverage', 'No coverage information available on the last test run.'));
			return;
		}

		accessor.get(ITestCoverageService).openCoverage(task, true);
	}
}

abstract class TestNavigationAction extends SymbolNavigationAction {
	protected testService!: ITestService; // little hack...
	protected uriIdentityService!: IUriIdentityService;

	override runEditorCommand(accessor: ServicesAccessor, editor: ICodeEditor, ...args: unknown[]) {
		this.testService = accessor.get(ITestService);
		this.uriIdentityService = accessor.get(IUriIdentityService);
		return super.runEditorCommand(accessor, editor, ...args);
	}

	protected override _getAlternativeCommand(editor: IActiveCodeEditor): string {
		return editor.getOption(EditorOption.gotoLocation).alternativeTestsCommand;
	}
	protected override _getGoToPreference(editor: IActiveCodeEditor): GoToLocationValues {
		return editor.getOption(EditorOption.gotoLocation).multipleTests || 'peek';
	}
}

abstract class GoToRelatedTestAction extends TestNavigationAction {
	protected override async _getLocationModel(_languageFeaturesService: unknown, model: ITextModel, position: Position, token: CancellationToken): Promise<ReferencesModel | undefined> {
		const tests = await this.testService.getTestsRelatedToCode(model.uri, position, token);
		return new ReferencesModel(
			tests.map(t => t.item.uri && ({ uri: t.item.uri, range: t.item.range || new Range(1, 1, 1, 1) })).filter(isDefined),
			localize('relatedTests', 'Related Tests'),
		);
	}

	protected override _getNoResultFoundMessage(): string {
		return localize('noTestFound', 'No related tests found.');
	}
}

class GoToRelatedTest extends GoToRelatedTestAction {
	constructor() {
		super({
			openToSide: false,
			openInPeek: false,
			muteMessage: false
		}, {
			id: TestCommandId.GoToRelatedTest,
			title: localize2('testing.goToRelatedTest', 'Go to Related Test'),
			category,
			precondition: ContextKeyExpr.and(
				// todo@connor4312: make this more explicit based on cursor position
				ContextKeyExpr.not(TestingContextKeys.activeEditorHasTests.key), TestingContextKeys.canGoToRelatedTest,
			),
			menu: [{
				id: MenuId.EditorContext,
				group: 'testing',
				order: EditorContextOrder.GoToRelated,
			}]
		});
	}
}

class PeekRelatedTest extends GoToRelatedTestAction {
	constructor() {
		super({
			openToSide: false,
			openInPeek: true,
			muteMessage: false
		}, {
			id: TestCommandId.PeekRelatedTest,
			title: localize2('testing.peekToRelatedTest', 'Peek Related Test'),
			category,
			precondition: ContextKeyExpr.and(
				TestingContextKeys.canGoToRelatedTest,
				// todo@connor4312: make this more explicit based on cursor position
				ContextKeyExpr.not(TestingContextKeys.activeEditorHasTests.key),
				PeekContext.notInPeekEditor,
				EditorContextKeys.isInEmbeddedEditor.toNegated()
			),
			menu: [{
				id: MenuId.EditorContext,
				group: 'testing',
				order: EditorContextOrder.PeekRelated,
			}]
		});
	}
}

abstract class GoToRelatedCodeAction extends TestNavigationAction {
	protected override async _getLocationModel(_languageFeaturesService: unknown, model: ITextModel, position: Position, token: CancellationToken): Promise<ReferencesModel | undefined> {
		const testsAtCursor = await getTestsAtCursor(this.testService, this.uriIdentityService, model.uri, position);
		const code = await Promise.all(testsAtCursor.map(t => this.testService.getCodeRelatedToTest(t)));
		return new ReferencesModel(code.flat(), localize('relatedCode', 'Related Code'));
	}

	protected override _getNoResultFoundMessage(): string {
		return localize('noRelatedCode', 'No related code found.');
	}
}

class GoToRelatedCode extends GoToRelatedCodeAction {
	constructor() {
		super({
			openToSide: false,
			openInPeek: false,
			muteMessage: false
		}, {
			id: TestCommandId.GoToRelatedCode,
			title: localize2('testing.goToRelatedCode', 'Go to Related Code'),
			category,
			precondition: ContextKeyExpr.and(
				TestingContextKeys.activeEditorHasTests,
				TestingContextKeys.canGoToRelatedCode,
			),
			menu: [{
				id: MenuId.EditorContext,
				group: 'testing',
				order: EditorContextOrder.GoToRelated,
			}]
		});
	}
}

class PeekRelatedCode extends GoToRelatedCodeAction {
	constructor() {
		super({
			openToSide: false,
			openInPeek: true,
			muteMessage: false
		}, {
			id: TestCommandId.PeekRelatedCode,
			title: localize2('testing.peekToRelatedCode', 'Peek Related Code'),
			category,
			precondition: ContextKeyExpr.and(
				TestingContextKeys.activeEditorHasTests,
				TestingContextKeys.canGoToRelatedCode,
				PeekContext.notInPeekEditor,
				EditorContextKeys.isInEmbeddedEditor.toNegated()
			),
			menu: [{
				id: MenuId.EditorContext,
				group: 'testing',
				order: EditorContextOrder.PeekRelated,
			}]
		});
	}
}

export class ToggleResultsViewLayoutAction extends Action2 {
	constructor() {
		super({
			id: TestCommandId.ToggleResultsViewLayoutAction,
			title: localize2('testing.toggleResultsViewLayout', 'Toggle Tree Position'),
			category,
			icon: Codicon.arrowSwap,
			menu: {
				id: MenuId.ViewTitle,
				order: ActionOrder.DisplayMode,
				group: 'navigation',
				when: ContextKeyExpr.equals('view', Testing.ResultsViewId)
			}
		});
	}

	public override async run(accessor: ServicesAccessor) {
		const configurationService = accessor.get(IConfigurationService);
		const currentLayout = getTestingConfiguration(configurationService, TestingConfigKeys.ResultsViewLayout);
		const newLayout = currentLayout === TestingResultsViewLayout.TreeLeft ? TestingResultsViewLayout.TreeRight : TestingResultsViewLayout.TreeLeft;

		await configurationService.updateValue(TestingConfigKeys.ResultsViewLayout, newLayout);
	}
}

export const allTestActions = [
	CancelTestRefreshAction,
	CancelTestRunAction,
	CleareCoverage,
	ClearTestResultsAction,
	CollapseAllAction,
	ConfigureTestProfilesAction,
	ContinuousRunTestAction,
	ContinuousRunUsingProfileTestAction,
	CoverageAction,
	CoverageAllAction,
	CoverageAtCursor,
	CoverageCurrentFile,
	CoverageLastRun,
	CoverageSelectedAction,
	CoverageTestsUnderUri,
	DebugAction,
	DebugAllAction,
	DebugAtCursor,
	DebugCurrentFile,
	DebugFailedTests,
	DebugLastRun,
	DebugSelectedAction,
	DebugTestsUnderUri,
	GetExplorerSelection,
	GetSelectedProfiles,
	GoToRelatedCode,
	GoToRelatedTest,
	GoToTest,
	HideTestAction,
	OpenCoverage,
	OpenOutputPeek,
	PeekRelatedCode,
	PeekRelatedTest,
	RefreshTestsAction,
	ReRunFailedTests,
	ReRunLastRun,
	RunAction,
	RunAllAction,
	RunAtCursor,
	RunCurrentFile,
	RunSelectedAction,
	RunTestsUnderUri,
	RunUsingProfileAction,
	SearchForTestExtension,
	SelectDefaultTestProfiles,
	ShowMostRecentOutputAction,
	StartContinuousRunAction,
	StopContinuousRunAction,
	TestingSortByDurationAction,
	TestingSortByLocationAction,
	TestingSortByStatusAction,
	TestingViewAsListAction,
	TestingViewAsTreeAction,
	ToggleInlineTestOutput,
	ToggleResultsViewLayoutAction,
	UnhideAllTestsAction,
	UnhideTestAction,
	ReRunFailedFromLastRun,
	DebugFailedFromLastRun,
];
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/browser/testing.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/browser/testing.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';
import { EditorContributionInstantiation, registerEditorContribution } from '../../../../editor/browser/editorExtensions.js';
import { localize, localize2 } from '../../../../nls.js';
import { registerAction2 } from '../../../../platform/actions/common/actions.js';
import { CommandsRegistry, ICommandService } from '../../../../platform/commands/common/commands.js';
import { Extensions as ConfigurationExtensions, IConfigurationRegistry } from '../../../../platform/configuration/common/configurationRegistry.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IProgressService } from '../../../../platform/progress/common/progress.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { ViewPaneContainer } from '../../../browser/parts/views/viewPaneContainer.js';
import { registerWorkbenchContribution2, WorkbenchPhase } from '../../../common/contributions.js';
import { IViewContainersRegistry, IViewsRegistry, Extensions as ViewContainerExtensions, ViewContainerLocation } from '../../../common/views.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { REVEAL_IN_EXPLORER_COMMAND_ID } from '../../files/browser/fileConstants.js';
import { testingConfiguration } from '../common/configuration.js';
import { TestCommandId, Testing } from '../common/constants.js';
import { ITestCoverageService, TestCoverageService } from '../common/testCoverageService.js';
import { ITestExplorerFilterState, TestExplorerFilterState } from '../common/testExplorerFilterState.js';
import { TestId, TestPosition } from '../common/testId.js';
import { canUseProfileWithTest, ITestProfileService, TestProfileService } from '../common/testProfileService.js';
import { ITestResultService, TestResultService } from '../common/testResultService.js';
import { ITestResultStorage, TestResultStorage } from '../common/testResultStorage.js';
import { ITestService } from '../common/testService.js';
import { TestService } from '../common/testServiceImpl.js';
import { ITestItem, ITestRunProfileReference, TestRunProfileBitset } from '../common/testTypes.js';
import { TestingChatAgentToolContribution } from '../common/testingChatAgentTool.js';
import { TestingContentProvider } from '../common/testingContentProvider.js';
import { TestingContextKeys } from '../common/testingContextKeys.js';
import { ITestingContinuousRunService, TestingContinuousRunService } from '../common/testingContinuousRunService.js';
import { ITestingDecorationsService } from '../common/testingDecorations.js';
import { ITestingPeekOpener } from '../common/testingPeekOpener.js';
import { CodeCoverageDecorations } from './codeCoverageDecorations.js';
import { testingResultsIcon, testingViewIcon } from './icons.js';
import { TestCoverageView } from './testCoverageView.js';
import { allTestActions, discoverAndRunTests } from './testExplorerActions.js';
import './testingConfigurationUi.js';
import { TestingDecorations, TestingDecorationService } from './testingDecorations.js';
import { TestingExplorerView } from './testingExplorerView.js';
import { CloseTestPeek, CollapsePeekStack, GoToNextMessageAction, GoToPreviousMessageAction, OpenMessageInEditorAction, TestingOutputPeekController, TestingPeekOpener, TestResultsView, ToggleTestingPeekHistory } from './testingOutputPeek.js';
import { TestingProgressTrigger } from './testingProgressUiService.js';
import { TestingViewPaneContainer } from './testingViewPaneContainer.js';

registerSingleton(ITestService, TestService, InstantiationType.Delayed);
registerSingleton(ITestResultStorage, TestResultStorage, InstantiationType.Delayed);
registerSingleton(ITestProfileService, TestProfileService, InstantiationType.Delayed);
registerSingleton(ITestCoverageService, TestCoverageService, InstantiationType.Delayed);
registerSingleton(ITestingContinuousRunService, TestingContinuousRunService, InstantiationType.Delayed);
registerSingleton(ITestResultService, TestResultService, InstantiationType.Delayed);
registerSingleton(ITestExplorerFilterState, TestExplorerFilterState, InstantiationType.Delayed);
registerSingleton(ITestingPeekOpener, TestingPeekOpener, InstantiationType.Delayed);
registerSingleton(ITestingDecorationsService, TestingDecorationService, InstantiationType.Delayed);

const viewContainer = Registry.as<IViewContainersRegistry>(ViewContainerExtensions.ViewContainersRegistry).registerViewContainer({
	id: Testing.ViewletId,
	title: localize2('test', 'Testing'),
	ctorDescriptor: new SyncDescriptor(TestingViewPaneContainer),
	icon: testingViewIcon,
	alwaysUseContainerInfo: true,
	order: 6,
	openCommandActionDescriptor: {
		id: Testing.ViewletId,
		mnemonicTitle: localize({ key: 'miViewTesting', comment: ['&& denotes a mnemonic'] }, "T&&esting"),
		// todo: coordinate with joh whether this is available
		// keybindings: { primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.US_SEMICOLON },
		order: 4,
	},
	hideIfEmpty: true,
}, ViewContainerLocation.Sidebar);


const testResultsViewContainer = Registry.as<IViewContainersRegistry>(ViewContainerExtensions.ViewContainersRegistry).registerViewContainer({
	id: Testing.ResultsPanelId,
	title: localize2('testResultsPanelName', "Test Results"),
	icon: testingResultsIcon,
	ctorDescriptor: new SyncDescriptor(ViewPaneContainer, [Testing.ResultsPanelId, { mergeViewWithContainerWhenSingleView: true }]),
	hideIfEmpty: true,
	order: 3,
}, ViewContainerLocation.Panel, { doNotRegisterOpenCommand: true });

const viewsRegistry = Registry.as<IViewsRegistry>(ViewContainerExtensions.ViewsRegistry);


viewsRegistry.registerViews([{
	id: Testing.ResultsViewId,
	name: localize2('testResultsPanelName', "Test Results"),
	containerIcon: testingResultsIcon,
	canToggleVisibility: false,
	canMoveView: true,
	when: TestingContextKeys.hasAnyResults.isEqualTo(true),
	ctorDescriptor: new SyncDescriptor(TestResultsView),
}], testResultsViewContainer);

viewsRegistry.registerViewWelcomeContent(Testing.ExplorerViewId, {
	content: localize('noTestProvidersRegistered', "No tests have been found in this workspace yet."),
});

viewsRegistry.registerViewWelcomeContent(Testing.ExplorerViewId, {
	content: '[' + localize('searchForAdditionalTestExtensions', "Install Additional Test Extensions...") + `](command:${TestCommandId.SearchForTestExtension})`,
	order: 10
});

viewsRegistry.registerViews([{
	id: Testing.ExplorerViewId,
	name: localize2('testExplorer', "Test Explorer"),
	ctorDescriptor: new SyncDescriptor(TestingExplorerView),
	canToggleVisibility: true,
	canMoveView: true,
	weight: 80,
	order: -999,
	containerIcon: testingViewIcon,
	when: ContextKeyExpr.greater(TestingContextKeys.providerCount.key, 0),
}, {
	id: Testing.CoverageViewId,
	name: localize2('testCoverage', "Test Coverage"),
	ctorDescriptor: new SyncDescriptor(TestCoverageView),
	canToggleVisibility: true,
	canMoveView: true,
	weight: 80,
	order: -998,
	containerIcon: testingViewIcon,
	when: TestingContextKeys.isTestCoverageOpen,
}], viewContainer);

allTestActions.forEach(registerAction2);
registerAction2(OpenMessageInEditorAction);
registerAction2(GoToPreviousMessageAction);
registerAction2(GoToNextMessageAction);
registerAction2(CloseTestPeek);
registerAction2(ToggleTestingPeekHistory);
registerAction2(CollapsePeekStack);

registerWorkbenchContribution2(TestingContentProvider.ID, TestingContentProvider, WorkbenchPhase.AfterRestored);
registerWorkbenchContribution2(TestingPeekOpener.ID, TestingPeekOpener, WorkbenchPhase.Eventually);
registerWorkbenchContribution2(TestingProgressTrigger.ID, TestingProgressTrigger, WorkbenchPhase.Eventually);
registerWorkbenchContribution2(TestingChatAgentToolContribution.ID, TestingChatAgentToolContribution, WorkbenchPhase.Eventually);

registerEditorContribution(Testing.OutputPeekContributionId, TestingOutputPeekController, EditorContributionInstantiation.AfterFirstRender);
registerEditorContribution(Testing.DecorationsContributionId, TestingDecorations, EditorContributionInstantiation.AfterFirstRender);
registerEditorContribution(Testing.CoverageDecorationsContributionId, CodeCoverageDecorations, EditorContributionInstantiation.Eventually);

CommandsRegistry.registerCommand({
	id: '_revealTestInExplorer',
	handler: async (accessor: ServicesAccessor, testId: string | ITestItem, focus?: boolean) => {
		accessor.get(ITestExplorerFilterState).reveal.set(typeof testId === 'string' ? testId : testId.extId, undefined);
		accessor.get(IViewsService).openView(Testing.ExplorerViewId, focus);
	}
});
CommandsRegistry.registerCommand({
	id: TestCommandId.StartContinousRunFromExtension,
	handler: async (accessor: ServicesAccessor, profileRef: ITestRunProfileReference, tests: readonly ITestItem[]) => {
		const profiles = accessor.get(ITestProfileService);
		const collection = accessor.get(ITestService).collection;
		const profile = profiles.getControllerProfiles(profileRef.controllerId).find(p => p.profileId === profileRef.profileId);
		if (!profile?.supportsContinuousRun) {
			return;
		}

		const crService = accessor.get(ITestingContinuousRunService);
		for (const test of tests) {
			const found = collection.getNodeById(test.extId);
			if (found && canUseProfileWithTest(profile, found)) {
				crService.start([profile], found.item.extId);
			}
		}
	}
});
CommandsRegistry.registerCommand({
	id: TestCommandId.StopContinousRunFromExtension,
	handler: async (accessor: ServicesAccessor, tests: readonly ITestItem[]) => {
		const crService = accessor.get(ITestingContinuousRunService);
		for (const test of tests) {
			crService.stop(test.extId);
		}
	}
});

CommandsRegistry.registerCommand({
	id: 'vscode.peekTestError',
	handler: async (accessor: ServicesAccessor, extId: string) => {
		const lookup = accessor.get(ITestResultService).getStateById(extId);
		if (!lookup) {
			return false;
		}

		const [result, ownState] = lookup;
		const opener = accessor.get(ITestingPeekOpener);
		if (opener.tryPeekFirstError(result, ownState)) { // fast path
			return true;
		}

		for (const test of result.tests) {
			if (TestId.compare(ownState.item.extId, test.item.extId) === TestPosition.IsChild && opener.tryPeekFirstError(result, test)) {
				return true;
			}
		}

		return false;
	}
});

CommandsRegistry.registerCommand({
	id: 'vscode.revealTest',
	handler: async (accessor: ServicesAccessor, extId: string, opts?: { preserveFocus?: boolean; openToSide?: boolean }) => {
		const test = accessor.get(ITestService).collection.getNodeById(extId);
		if (!test) {
			return;
		}
		const commandService = accessor.get(ICommandService);
		const fileService = accessor.get(IFileService);
		const openerService = accessor.get(IOpenerService);

		const { range, uri } = test.item;
		if (!uri) {
			return;
		}

		// If an editor has the file open, there are decorations. Try to adjust the
		// revealed range to those decorations (#133441).
		const position = accessor.get(ITestingDecorationsService).getDecoratedTestPosition(uri, extId) || range?.getStartPosition();

		accessor.get(ITestExplorerFilterState).reveal.set(extId, undefined);
		accessor.get(ITestingPeekOpener).closeAllPeeks();

		let isFile = true;
		try {
			if (!(await fileService.stat(uri)).isFile) {
				isFile = false;
			}
		} catch {
			// ignored
		}

		if (!isFile) {
			await commandService.executeCommand(REVEAL_IN_EXPLORER_COMMAND_ID, uri);
			return;
		}

		await openerService.open(position
			? uri.with({ fragment: `L${position.lineNumber}:${position.column}` })
			: uri,
			{
				openToSide: opts?.openToSide,
				editorOptions: {
					preserveFocus: opts?.preserveFocus,
				}
			}
		);
	}
});

CommandsRegistry.registerCommand({
	id: 'vscode.runTestsById',
	handler: async (accessor: ServicesAccessor, group: TestRunProfileBitset, ...testIds: string[]) => {
		const testService = accessor.get(ITestService);
		await discoverAndRunTests(
			accessor.get(ITestService).collection,
			accessor.get(IProgressService),
			testIds,
			tests => testService.runTests({ group, tests }),
		);
	}
});

CommandsRegistry.registerCommand({
	id: 'vscode.testing.getControllersWithTests',
	handler: async (accessor: ServicesAccessor) => {
		const testService = accessor.get(ITestService);
		return [...testService.collection.rootItems]
			.filter(r => r.children.size > 0)
			.map(r => r.controllerId);
	}
});

CommandsRegistry.registerCommand({
	id: 'vscode.testing.getTestsInFile',
	handler: async (accessor: ServicesAccessor, uri: URI) => {
		const testService = accessor.get(ITestService);
		return [...testService.collection.getNodeByUrl(uri)].map(t => TestId.split(t.item.extId));
	}
});

Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration).registerConfiguration(testingConfiguration);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/browser/testingConfigurationUi.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/browser/testingConfigurationUi.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { groupBy } from '../../../../base/common/arrays.js';
import { isDefined } from '../../../../base/common/types.js';
import { ServicesAccessor } from '../../../../editor/browser/editorExtensions.js';
import { localize } from '../../../../nls.js';
import { CommandsRegistry } from '../../../../platform/commands/common/commands.js';
import { QuickPickInput, IQuickPickItem, IQuickInputService, IQuickPickItemButtonEvent } from '../../../../platform/quickinput/common/quickInput.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { testingUpdateProfiles } from './icons.js';
import { testConfigurationGroupNames } from '../common/constants.js';
import { InternalTestItem, ITestRunProfile, TestRunProfileBitset } from '../common/testTypes.js';
import { canUseProfileWithTest, ITestProfileService } from '../common/testProfileService.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';

interface IConfigurationPickerOptions {
	/** Placeholder text */
	placeholder?: string;
	/** Show buttons to trigger configuration */
	showConfigureButtons?: boolean;
	/** Only show configurations from this controller */
	onlyForTest?: InternalTestItem;
	/** Only show this group */
	onlyGroup?: TestRunProfileBitset;
	/** Only show items which are configurable */
	onlyConfigurable?: boolean;
}

function buildPicker(accessor: ServicesAccessor, {
	onlyGroup,
	showConfigureButtons = true,
	onlyForTest,
	onlyConfigurable,
	placeholder = localize('testConfigurationUi.pick', 'Pick a test profile to use'),
}: IConfigurationPickerOptions) {
	const profileService = accessor.get(ITestProfileService);
	const items: QuickPickInput<IQuickPickItem & { profile: ITestRunProfile }>[] = [];
	const pushItems = (allProfiles: ITestRunProfile[], description?: string) => {
		for (const profiles of groupBy(allProfiles, (a, b) => a.group - b.group)) {
			let addedHeader = false;
			if (onlyGroup) {
				if (profiles[0].group !== onlyGroup) {
					continue;
				}

				addedHeader = true; // showing one group, no need for label
			}

			for (const profile of profiles) {
				if (onlyConfigurable && !profile.hasConfigurationHandler) {
					continue;
				}

				if (!addedHeader) {
					items.push({ type: 'separator', label: testConfigurationGroupNames[profiles[0].group] });
					addedHeader = true;
				}

				items.push(({
					type: 'item',
					profile,
					label: profile.label,
					description,
					alwaysShow: true,
					buttons: profile.hasConfigurationHandler && showConfigureButtons
						? [{
							iconClass: ThemeIcon.asClassName(testingUpdateProfiles),
							tooltip: localize('updateTestConfiguration', 'Update Test Configuration')
						}] : []
				}));
			}
		}
	};

	if (onlyForTest !== undefined) {
		pushItems(profileService.getControllerProfiles(onlyForTest.controllerId).filter(p => canUseProfileWithTest(p, onlyForTest)));
	} else {
		for (const { profiles, controller } of profileService.all()) {
			pushItems(profiles, controller.label.get());
		}
	}

	const quickpick = accessor.get(IQuickInputService).createQuickPick<IQuickPickItem & { profile: ITestRunProfile }>({ useSeparators: true });
	quickpick.items = items;
	quickpick.placeholder = placeholder;
	return quickpick;
}

const triggerButtonHandler = (service: ITestProfileService, resolve: (arg: undefined) => void) =>
	(evt: IQuickPickItemButtonEvent<IQuickPickItem>) => {
		const profile = (evt.item as { profile?: ITestRunProfile }).profile;
		if (profile) {
			service.configure(profile.controllerId, profile.profileId);
			resolve(undefined);
		}
	};

CommandsRegistry.registerCommand({
	id: 'vscode.pickMultipleTestProfiles',
	handler: async (accessor: ServicesAccessor, options: IConfigurationPickerOptions & {
		selected?: ITestRunProfile[];
	}) => {
		const profileService = accessor.get(ITestProfileService);
		const quickpick = buildPicker(accessor, options);
		if (!quickpick) {
			return;
		}

		const disposables = new DisposableStore();
		disposables.add(quickpick);

		quickpick.canSelectMany = true;
		if (options.selected) {
			quickpick.selectedItems = quickpick.items
				.filter((i): i is IQuickPickItem & { profile: ITestRunProfile } => i.type === 'item')
				.filter(i => options.selected!.some(s => s.controllerId === i.profile.controllerId && s.profileId === i.profile.profileId));
		}

		const pick = await new Promise<ITestRunProfile[] | undefined>(resolve => {
			disposables.add(quickpick.onDidAccept(() => {
				const selected = quickpick.selectedItems as readonly { profile?: ITestRunProfile }[];
				resolve(selected.map(s => s.profile).filter(isDefined));
			}));
			disposables.add(quickpick.onDidHide(() => resolve(undefined)));
			disposables.add(quickpick.onDidTriggerItemButton(triggerButtonHandler(profileService, resolve)));
			quickpick.show();
		});

		disposables.dispose();
		return pick;
	}
});

CommandsRegistry.registerCommand({
	id: 'vscode.pickTestProfile',
	handler: async (accessor: ServicesAccessor, options: IConfigurationPickerOptions) => {
		const profileService = accessor.get(ITestProfileService);
		const quickpick = buildPicker(accessor, options);
		if (!quickpick) {
			return;
		}

		const disposables = new DisposableStore();
		disposables.add(quickpick);

		const pick = await new Promise<ITestRunProfile | undefined>(resolve => {
			disposables.add(quickpick.onDidAccept(() => resolve((quickpick.selectedItems[0] as { profile?: ITestRunProfile })?.profile)));
			disposables.add(quickpick.onDidHide(() => resolve(undefined)));
			disposables.add(quickpick.onDidTriggerItemButton(triggerButtonHandler(profileService, resolve)));
			quickpick.show();
		});

		disposables.dispose();
		return pick;
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/browser/testingDecorations.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/browser/testingDecorations.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { StandardKeyboardEvent } from '../../../../base/browser/keyboardEvent.js';
import { renderAsPlaintext } from '../../../../base/browser/markdownRenderer.js';
import { Action, IAction, Separator, SubmenuAction } from '../../../../base/common/actions.js';
import { equals } from '../../../../base/common/arrays.js';
import { mapFindFirst } from '../../../../base/common/arraysFind.js';
import { RunOnceScheduler, Throttler, timeout } from '../../../../base/common/async.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { IMarkdownString, MarkdownString } from '../../../../base/common/htmlContent.js';
import { stripIcons } from '../../../../base/common/iconLabels.js';
import { Iterable } from '../../../../base/common/iterator.js';
import { KeyCode } from '../../../../base/common/keyCodes.js';
import { Disposable, DisposableMap, DisposableStore, IReference, MutableDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { ResourceMap } from '../../../../base/common/map.js';
import { clamp } from '../../../../base/common/numbers.js';
import { autorun } from '../../../../base/common/observable.js';
import { isMacintosh } from '../../../../base/common/platform.js';
import { count, truncateMiddle } from '../../../../base/common/strings.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { Constants } from '../../../../base/common/uint.js';
import { URI } from '../../../../base/common/uri.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import { ContentWidgetPositionPreference, ICodeEditor, IContentWidget, IContentWidgetPosition, IContentWidgetRenderedCoordinate, IEditorMouseEvent, MouseTargetType } from '../../../../editor/browser/editorBrowser.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { EditorOption } from '../../../../editor/common/config/editorOptions.js';
import { overviewRulerError, overviewRulerInfo } from '../../../../editor/common/core/editorColorRegistry.js';
import { Position } from '../../../../editor/common/core/position.js';
import { IRange } from '../../../../editor/common/core/range.js';
import { IEditorContribution } from '../../../../editor/common/editorCommon.js';
import { GlyphMarginLane, IModelDecorationOptions, IModelDecorationsChangeAccessor, IModelDeltaDecoration, ITextModel, OverviewRulerLane, TrackedRangeStickiness } from '../../../../editor/common/model.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { localize } from '../../../../nls.js';
import { getFlatContextMenuActions } from '../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { IMenuService, MenuId } from '../../../../platform/actions/common/actions.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IQuickInputService, IQuickPickItem } from '../../../../platform/quickinput/common/quickInput.js';
import { themeColorFromId } from '../../../../platform/theme/common/themeService.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { EditorLineNumberContextMenu, GutterActionsRegistry } from '../../codeEditor/browser/editorLineNumberMenu.js';
import { DefaultGutterClickAction, TestingConfigKeys, getTestingConfiguration } from '../common/configuration.js';
import { TestCommandId, Testing, labelForTestInState } from '../common/constants.js';
import { TestId } from '../common/testId.js';
import { ITestProfileService } from '../common/testProfileService.js';
import { ITestResult, LiveTestResult, TestResultItemChangeReason } from '../common/testResult.js';
import { ITestResultService } from '../common/testResultService.js';
import { ITestService, getContextForTestItem, simplifyTestsToExecute, testsInFile } from '../common/testService.js';
import { ITestErrorMessage, ITestMessage, ITestRunProfile, IncrementalTestCollectionItem, InternalTestItem, TestDiffOpType, TestMessageType, TestResultItem, TestResultState, TestRunProfileBitset } from '../common/testTypes.js';
import { ITestDecoration as IPublicTestDecoration, ITestingDecorationsService, TestDecorations } from '../common/testingDecorations.js';
import { ITestingPeekOpener } from '../common/testingPeekOpener.js';
import { isFailedState, maxPriority } from '../common/testingStates.js';
import { TestUriType, buildTestUri, parseTestUri } from '../common/testingUri.js';
import { getTestItemContextOverlay } from './explorerProjections/testItemContextOverlay.js';
import { testingDebugAllIcon, testingDebugIcon, testingRunAllIcon, testingRunIcon, testingStatesToIcons } from './icons.js';
import { renderTestMessageAsText } from './testMessageColorizer.js';
import { MessageSubject } from './testResultsView/testResultsSubject.js';
import { TestingOutputPeekController } from './testingOutputPeek.js';

const MAX_INLINE_MESSAGE_LENGTH = 128;
const MAX_TESTS_IN_SUBMENU = 30;
const GLYPH_MARGIN_LANE = GlyphMarginLane.Center;

function isOriginalInDiffEditor(codeEditorService: ICodeEditorService, codeEditor: ICodeEditor): boolean {
	const diffEditors = codeEditorService.listDiffEditors();

	for (const diffEditor of diffEditors) {
		if (diffEditor.getOriginalEditor() === codeEditor) {
			return true;
		}
	}

	return false;
}

interface ITestDecoration extends IPublicTestDecoration {
	id: string;
	click(e: IEditorMouseEvent): boolean;
}

/** Value for saved decorations, providing fast accessors for the hot 'syncDecorations' path */
class CachedDecorations {
	private readonly runByIdKey = new Map<string, RunTestDecoration>();

	public get size() {
		return this.runByIdKey.size;
	}

	/** Gets a test run decoration that contains exactly the given test IDs */
	public getForExactTests(testIds: string[]) {
		const key = testIds.sort().join('\0\0');
		return this.runByIdKey.get(key);
	}
	/** Adds a new test run decroation */
	public addTest(d: RunTestDecoration) {
		const key = d.testIds.sort().join('\0\0');
		this.runByIdKey.set(key, d);
	}

	/** Finds an extension by VS Code event ID */
	public getById(decorationId: string) {
		for (const d of this.runByIdKey.values()) {
			if (d.id === decorationId) {
				return d;
			}
		}
		return undefined;
	}

	/** Iterate over all decorations */
	*[Symbol.iterator](): IterableIterator<ITestDecoration> {
		for (const d of this.runByIdKey.values()) {
			yield d;
		}
	}
}

export class TestingDecorationService extends Disposable implements ITestingDecorationsService {
	declare public _serviceBrand: undefined;

	private generation = 0;
	private readonly changeEmitter = new Emitter<void>();
	private readonly decorationCache = new ResourceMap<{
		/** The document version at which ranges have been updated, requiring rerendering */
		rangeUpdateVersionId?: number;
		/** Counter for the results rendered in the document */
		generation: number;
		isAlt?: boolean;
		value: CachedDecorations;
	}>();

	/**
	 * List of messages that should be hidden because an editor changed their
	 * underlying ranges. I think this is good enough, because:
	 *  - Message decorations are never shown across reloads; this does not
	 *    need to persist
	 *  - Message instances are stable for any completed test results for
	 *    the duration of the session.
	 */
	private readonly invalidatedMessages = new WeakSet<ITestMessage>();

	/** @inheritdoc */
	public readonly onDidChange = this.changeEmitter.event;

	constructor(
		@ICodeEditorService codeEditorService: ICodeEditorService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@ITestService private readonly testService: ITestService,
		@ITestResultService private readonly results: ITestResultService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IModelService private readonly modelService: IModelService,
	) {
		super();
		this._register(codeEditorService.registerDecorationType('test-message-decoration', TestMessageDecoration.decorationId, {}, undefined));

		this._register(modelService.onModelRemoved(e => this.decorationCache.delete(e.uri)));

		const debounceInvalidate = this._register(new RunOnceScheduler(() => this.invalidate(), 100));

		// If ranges were updated in the document, mark that we should explicitly
		// sync decorations to the published lines, since we assume that everything
		// is up to date. This prevents issues, as in #138632, #138835, #138922.
		this._register(this.testService.onWillProcessDiff(diff => {
			for (const entry of diff) {
				if (entry.op !== TestDiffOpType.DocumentSynced) {
					continue;
				}

				const rec = this.decorationCache.get(entry.uri);
				if (rec) {
					rec.rangeUpdateVersionId = entry.docv;
				}
			}

			if (!debounceInvalidate.isScheduled()) {
				debounceInvalidate.schedule();
			}
		}));

		this._register(Event.any(
			this.results.onResultsChanged,
			this.results.onTestChanged,
			this.testService.excluded.onTestExclusionsChanged,
			Event.filter(configurationService.onDidChangeConfiguration, e => e.affectsConfiguration(TestingConfigKeys.GutterEnabled)),
		)(() => {
			if (!debounceInvalidate.isScheduled()) {
				debounceInvalidate.schedule();
			}
		}));

		this._register(GutterActionsRegistry.registerGutterActionsGenerator((context, result) => {
			const model = context.editor.getModel();
			const testingDecorations = TestingDecorations.get(context.editor);
			if (!model || !testingDecorations?.currentUri) {
				return;
			}

			const currentDecorations = this.syncDecorations(testingDecorations.currentUri);
			if (!currentDecorations.size) {
				return;
			}

			const modelDecorations = model.getLinesDecorations(context.lineNumber, context.lineNumber);
			for (const { id } of modelDecorations) {
				const decoration = currentDecorations.getById(id);
				if (decoration) {
					const { object: actions } = decoration.getContextMenuActions();
					for (const action of actions) {
						result.push(action, '1_testing');
					}
				}
			}
		}));
	}

	/** @inheritdoc */
	public invalidateResultMessage(message: ITestMessage) {
		this.invalidatedMessages.add(message);
		this.invalidate();
	}

	/** @inheritdoc */
	public syncDecorations(resource: URI): CachedDecorations {
		const model = this.modelService.getModel(resource);
		if (!model) {
			return new CachedDecorations();
		}

		const cached = this.decorationCache.get(resource);
		if (cached && cached.generation === this.generation && (cached.rangeUpdateVersionId === undefined || cached.rangeUpdateVersionId !== model.getVersionId())) {
			return cached.value;
		}

		return this.applyDecorations(model);
	}

	/** @inheritdoc */
	public getDecoratedTestPosition(resource: URI, testId: string) {
		const model = this.modelService.getModel(resource);
		if (!model) {
			return undefined;
		}

		const decoration = Iterable.find(this.syncDecorations(resource), v => v instanceof RunTestDecoration && v.isForTest(testId));
		if (!decoration) {
			return undefined;
		}

		// decoration is collapsed, so the range is meaningless; only position matters.
		return model.getDecorationRange(decoration.id)?.getStartPosition();
	}

	private invalidate() {
		this.generation++;
		this.changeEmitter.fire();
	}

	/**
	 * Sets whether alternate actions are shown for the model.
	 */
	public updateDecorationsAlternateAction(resource: URI, isAlt: boolean) {
		const model = this.modelService.getModel(resource);
		const cached = this.decorationCache.get(resource);
		if (!model || !cached || cached.isAlt === isAlt) {
			return;
		}

		cached.isAlt = isAlt;
		model.changeDecorations(accessor => {
			for (const decoration of cached.value) {
				if (decoration instanceof RunTestDecoration && decoration.editorDecoration.alternate) {
					accessor.changeDecorationOptions(
						decoration.id,
						isAlt ? decoration.editorDecoration.alternate : decoration.editorDecoration.options,
					);
				}
			}
		});
	}

	/**
	 * Applies the current set of test decorations to the given text model.
	 */
	private applyDecorations(model: ITextModel) {
		const gutterEnabled = getTestingConfiguration(this.configurationService, TestingConfigKeys.GutterEnabled);
		const cached = this.decorationCache.get(model.uri);
		const testRangesUpdated = cached?.rangeUpdateVersionId === model.getVersionId();
		const lastDecorations = cached?.value ?? new CachedDecorations();

		const newDecorations = model.changeDecorations(accessor => {
			const newDecorations = new CachedDecorations();
			const runDecorations = new TestDecorations<{ line: number; id: ''; test: IncrementalTestCollectionItem; resultItem: TestResultItem | undefined }>();
			for (const test of this.testService.collection.getNodeByUrl(model.uri)) {
				if (!test.item.range) {
					continue;
				}

				const stateLookup = this.results.getStateById(test.item.extId);
				const line = test.item.range.startLineNumber;
				runDecorations.push({ line, id: '', test, resultItem: stateLookup?.[1] });
			}

			for (const [line, tests] of runDecorations.lines()) {
				const multi = tests.length > 1;
				let existing = lastDecorations.getForExactTests(tests.map(t => t.test.item.extId));

				// see comment in the constructor for what's going on here
				if (existing && testRangesUpdated && model.getDecorationRange(existing.id)?.startLineNumber !== line) {
					existing = undefined;
				}

				if (existing) {
					if (existing.replaceOptions(tests, gutterEnabled)) {
						accessor.changeDecorationOptions(existing.id, existing.editorDecoration.options);
					}
					newDecorations.addTest(existing);
				} else {
					newDecorations.addTest(multi
						? this.instantiationService.createInstance(MultiRunTestDecoration, tests, gutterEnabled, model)
						: this.instantiationService.createInstance(RunSingleTestDecoration, tests[0].test, tests[0].resultItem, model, gutterEnabled));
				}
			}

			const saveFromRemoval = new Set<string>();
			for (const decoration of newDecorations) {
				if (decoration.id === '') {
					decoration.id = accessor.addDecoration(decoration.editorDecoration.range, decoration.editorDecoration.options);
				} else {
					saveFromRemoval.add(decoration.id);
				}
			}

			for (const decoration of lastDecorations) {
				if (!saveFromRemoval.has(decoration.id)) {
					accessor.removeDecoration(decoration.id);
				}
			}

			this.decorationCache.set(model.uri, {
				generation: this.generation,
				rangeUpdateVersionId: cached?.rangeUpdateVersionId,
				value: newDecorations,
			});

			return newDecorations;
		});

		return newDecorations || lastDecorations;
	}
}

export class TestingDecorations extends Disposable implements IEditorContribution {
	/**
	 * Results invalidated by editor changes.
	 */
	public static invalidatedTests = new WeakSet<TestResultItem | ITestMessage>();

	/**
	 * Gets the decorations associated with the given code editor.
	 */
	public static get(editor: ICodeEditor): TestingDecorations | null {
		return editor.getContribution<TestingDecorations>(Testing.DecorationsContributionId);
	}

	public get currentUri() { return this._currentUri; }

	private _currentUri?: URI;
	private readonly expectedWidget = this._register(new MutableDisposable<ExpectedLensContentWidget>());
	private readonly actualWidget = this._register(new MutableDisposable<ActualLensContentWidget>());

	private readonly errorContentWidgets = this._register(new DisposableMap<ITestMessage, TestErrorContentWidget>());
	private readonly loggedMessageDecorations = new Map<ITestMessage, {
		id: string;
		line: number;
		resultItem: TestResultItem | undefined;
	}>();

	constructor(
		private readonly editor: ICodeEditor,
		@ICodeEditorService private readonly codeEditorService: ICodeEditorService,
		@ITestService private readonly testService: ITestService,
		@ITestingDecorationsService private readonly decorations: ITestingDecorationsService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@ITestResultService private readonly results: ITestResultService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		super();

		this._register(codeEditorService.registerDecorationType('test-message-decoration', TestMessageDecoration.decorationId, {}, undefined, editor));

		this.attachModel(editor.getModel()?.uri);
		this._register(decorations.onDidChange(() => {
			if (this._currentUri) {
				decorations.syncDecorations(this._currentUri);
			}
		}));

		const msgThrottler = this._register(new Throttler());
		this._register(this.results.onTestChanged(ev => {
			if (ev.reason !== TestResultItemChangeReason.NewMessage) {
				return;
			}

			msgThrottler.queue(() => {
				this.applyResults();
				return timeout(100);
			});
		}));

		this._register(Event.any(
			this.results.onResultsChanged,
			editor.onDidChangeModel,
			this.testService.showInlineOutput.onDidChange,
		)(() => this.applyResults()));

		const win = dom.getWindow(editor.getDomNode());
		this._register(dom.addDisposableListener(win, 'keydown', e => {
			if (new StandardKeyboardEvent(e).keyCode === KeyCode.Alt && this._currentUri) {
				decorations.updateDecorationsAlternateAction(this._currentUri, true);
			}
		}));
		this._register(dom.addDisposableListener(win, 'keyup', e => {
			if (new StandardKeyboardEvent(e).keyCode === KeyCode.Alt && this._currentUri) {
				decorations.updateDecorationsAlternateAction(this._currentUri, false);
			}
		}));
		this._register(dom.addDisposableListener(win, 'blur', () => {
			if (this._currentUri) {
				decorations.updateDecorationsAlternateAction(this._currentUri, false);
			}
		}));
		this._register(this.editor.onKeyUp(e => {
			if (e.keyCode === KeyCode.Alt && this._currentUri) {
				decorations.updateDecorationsAlternateAction(this._currentUri!, false);
			}
		}));
		this._register(this.editor.onDidChangeModel(e => this.attachModel(e.newModelUrl || undefined)));
		this._register(this.editor.onMouseDown(e => {
			if (e.target.position && this.currentUri) {
				const modelDecorations = editor.getModel()?.getLineDecorations(e.target.position.lineNumber) ?? [];
				if (!modelDecorations.length) {
					return;
				}

				const cache = decorations.syncDecorations(this.currentUri);
				for (const { id } of modelDecorations) {
					if ((cache.getById(id) as ITestDecoration | undefined)?.click(e)) {
						e.event.stopPropagation();
						return;
					}
				}
			}
		}));
		this._register(Event.accumulate(this.editor.onDidChangeModelContent, 0, undefined, this._store)(evts => {
			const model = editor.getModel();
			if (!this._currentUri || !model) {
				return;
			}

			let changed = false;
			for (const [message, deco] of this.loggedMessageDecorations) {
				// invalidate decorations if either the line they're on was changed,
				// or if the range of the test was changed. The range of the test is
				// not always present, so check bo.
				const invalidate = evts.some(e => e.changes.some(c =>
					c.range.startLineNumber <= deco.line && c.range.endLineNumber >= deco.line
					|| (deco.resultItem?.item.range && deco.resultItem.item.range.startLineNumber <= c.range.startLineNumber && deco.resultItem.item.range.endLineNumber >= c.range.endLineNumber)
				));

				if (invalidate) {
					changed = true;
					TestingDecorations.invalidatedTests.add(deco.resultItem || message);
				}
			}

			if (changed) {
				this.applyResults();
			}
		}));

		const updateFontFamilyVar = () => {
			this.editor.getContainerDomNode().style.setProperty('--testMessageDecorationFontFamily', editor.getOption(EditorOption.fontFamily));
			this.editor.getContainerDomNode().style.setProperty('--testMessageDecorationFontSize', `${editor.getOption(EditorOption.fontSize)}px`);
		};
		this._register(this.editor.onDidChangeConfiguration((e) => {
			if (e.hasChanged(EditorOption.fontFamily)) {
				updateFontFamilyVar();
			}
		}));
		updateFontFamilyVar();
	}

	private attachModel(uri?: URI) {
		switch (uri && parseTestUri(uri)?.type) {
			case TestUriType.ResultExpectedOutput:
				this.expectedWidget.value = new ExpectedLensContentWidget(this.editor);
				this.actualWidget.clear();
				break;
			case TestUriType.ResultActualOutput:
				this.expectedWidget.clear();
				this.actualWidget.value = new ActualLensContentWidget(this.editor);
				break;
			default:
				this.expectedWidget.clear();
				this.actualWidget.clear();
		}

		if (isOriginalInDiffEditor(this.codeEditorService, this.editor)) {
			uri = undefined;
		}

		this._currentUri = uri;

		if (!uri) {
			return;
		}

		this.decorations.syncDecorations(uri);

		(async () => {
			for await (const _tests of testsInFile(this.testService, this.uriIdentityService, uri, false)) {
				// consume the iterator so that all tests in the file get expanded. Or
				// at least until the URI changes. If new items are requested, changes
				// will be trigged in the `onDidProcessDiff` callback.
				if (this._currentUri !== uri) {
					break;
				}
			}
		})();
	}

	private applyResults() {
		const model = this.editor.getModel();
		if (!model) {
			return this.clearResults();
		}

		const uriStr = model.uri.toString();
		const seenLines = new Set<number>();
		this.applyResultsContentWidgets(uriStr, seenLines);
		this.applyResultsLoggedMessages(uriStr, seenLines);
	}

	private clearResults() {
		this.errorContentWidgets.clearAndDisposeAll();
	}

	private isMessageInvalidated(message: ITestMessage) {
		return TestingDecorations.invalidatedTests.has(message);
	}

	private applyResultsContentWidgets(uriStr: string, seenLines: Set<number>) {
		const seen = new Set<ITestMessage>();
		if (getTestingConfiguration(this.configurationService, TestingConfigKeys.ShowAllMessages)) {
			this.results.results.forEach(lastResult => this.applyContentWidgetsFromResult(lastResult, uriStr, seen, seenLines));
		} else if (this.results.results.length) {
			this.applyContentWidgetsFromResult(this.results.results[0], uriStr, seen, seenLines);
		}

		for (const message of this.errorContentWidgets.keys()) {
			if (!seen.has(message)) {
				this.errorContentWidgets.deleteAndDispose(message);
			}
		}
	}

	private applyContentWidgetsFromResult(lastResult: ITestResult, uriStr: string, seen: Set<ITestMessage>, seenLines: Set<number>) {
		for (const test of lastResult.tests) {
			if (TestingDecorations.invalidatedTests.has(test)) {
				continue;
			}
			for (let taskId = 0; taskId < test.tasks.length; taskId++) {
				const state = test.tasks[taskId];
				// push error decorations first so they take precedence over normal output
				for (let i = 0; i < state.messages.length; i++) {
					const m = state.messages[i];
					if (m.type !== TestMessageType.Error || this.isMessageInvalidated(m)) {
						continue;
					}

					const line: number | undefined = m.location?.uri.toString() === uriStr
						? m.location.range.startLineNumber
						: m.stackTrace && mapFindFirst(m.stackTrace, (f) => f.position && f.uri?.toString() === uriStr ? f.position.lineNumber : undefined);
					if (line === undefined || seenLines.has(line)) {
						continue;
					}

					seenLines.add(line);
					let deco = this.errorContentWidgets.get(m);
					if (!deco) {
						const lineLength = this.editor.getModel()?.getLineLength(line) ?? 100;
						deco = this.instantiationService.createInstance(
							TestErrorContentWidget,
							this.editor,
							new Position(line, lineLength + 1),
							m,
							test,
							buildTestUri({
								type: TestUriType.ResultActualOutput,
								messageIndex: i,
								taskIndex: taskId,
								resultId: lastResult.id,
								testExtId: test.item.extId,
							})
						);
						this.errorContentWidgets.set(m, deco);
					}
					seen.add(m);
				}
			}
		}
	}

	private applyResultsLoggedMessages(uriStr: string, messageLines: Set<number>) {
		this.editor.changeDecorations(accessor => {
			const seen = new Set<ITestMessage>();
			if (getTestingConfiguration(this.configurationService, TestingConfigKeys.ShowAllMessages)) {
				this.results.results.forEach(r => this.applyLoggedMessageFromResult(r, uriStr, seen, messageLines, accessor));
			} else if (this.results.results.length) {
				this.applyLoggedMessageFromResult(this.results.results[0], uriStr, seen, messageLines, accessor);
			}

			for (const [message, { id }] of this.loggedMessageDecorations) {
				if (!seen.has(message)) {
					accessor.removeDecoration(id);
				}
			}
		});
	}

	private applyLoggedMessageFromResult(lastResult: ITestResult, uriStr: string, seen: Set<ITestMessage>, messageLines: Set<number>, accessor: IModelDecorationsChangeAccessor) {
		if (!this.testService.showInlineOutput.value || !(lastResult instanceof LiveTestResult)) {
			return;
		}

		const tryAdd = (resultItem: TestResultItem | undefined, m: ITestMessage, uri?: URI) => {
			if (this.isMessageInvalidated(m) || m.location?.uri.toString() !== uriStr) {
				return;
			}

			seen.add(m);
			const line = m.location.range.startLineNumber;
			if (messageLines.has(line) || this.loggedMessageDecorations.has(m)) {
				return;
			}

			const deco = this.instantiationService.createInstance(TestMessageDecoration, m, uri, this.editor.getModel()!);

			messageLines.add(line);
			const id = accessor.addDecoration(
				deco.editorDecoration.range,
				deco.editorDecoration.options,
			);
			this.loggedMessageDecorations.set(m, { id, line, resultItem });
		};

		for (const test of lastResult.tests) {
			if (TestingDecorations.invalidatedTests.has(test)) {
				continue;
			}

			for (let taskId = 0; taskId < test.tasks.length; taskId++) {
				const state = test.tasks[taskId];
				for (let i = state.messages.length - 1; i >= 0; i--) {
					const m = state.messages[i];
					if (m.type === TestMessageType.Output) {
						tryAdd(test, m, buildTestUri({
							type: TestUriType.ResultActualOutput,
							messageIndex: i,
							taskIndex: taskId,
							resultId: lastResult.id,
							testExtId: test.item.extId,
						}));
					}
				}
			}
		}

		for (const task of lastResult.tasks) {
			for (const m of task.otherMessages) {
				tryAdd(undefined, m);
			}
		}
	}
}

const collapseRange = (originalRange: IRange) => ({
	startLineNumber: originalRange.startLineNumber,
	endLineNumber: originalRange.startLineNumber,
	startColumn: originalRange.startColumn,
	endColumn: originalRange.startColumn,
});

const createRunTestDecoration = (
	tests: readonly IncrementalTestCollectionItem[],
	states: readonly (TestResultItem | undefined)[],
	visible: boolean,
	defaultGutterAction: DefaultGutterClickAction,
): IModelDeltaDecoration & { alternate?: IModelDecorationOptions } => {
	const range = tests[0]?.item.range;
	if (!range) {
		throw new Error('Test decorations can only be created for tests with a range');
	}

	if (!visible) {
		return {
			range: collapseRange(range),
			options: { isWholeLine: true, description: 'run-test-decoration' },
		};
	}

	let computedState = TestResultState.Unset;
	const hoverMessageParts: string[] = [];
	let testIdWithMessages: string | undefined;
	let retired = false;
	for (let i = 0; i < tests.length; i++) {
		const test = tests[i];
		const resultItem = states[i];
		const state = resultItem?.computedState ?? TestResultState.Unset;
		if (hoverMessageParts.length < 10) {
			hoverMessageParts.push(labelForTestInState(test.item.label, state));
		}
		computedState = maxPriority(computedState, state);
		retired = retired || !!resultItem?.retired;
		if (!testIdWithMessages && resultItem?.tasks.some(t => t.messages.length)) {
			testIdWithMessages = test.item.extId;
		}
	}

	const hasMultipleTests = tests.length > 1 || tests[0].children.size > 0;

	const primaryIcon = computedState === TestResultState.Unset
		? (hasMultipleTests ? testingRunAllIcon : testingRunIcon)
		: testingStatesToIcons.get(computedState)!;

	const alternateIcon = defaultGutterAction === DefaultGutterClickAction.Debug
		? (hasMultipleTests ? testingRunAllIcon : testingRunIcon)
		: (hasMultipleTests ? testingDebugAllIcon : testingDebugIcon);

	let hoverMessage: IMarkdownString | undefined;

	let glyphMarginClassName = 'testing-run-glyph';
	if (retired) {
		glyphMarginClassName += ' retired';
	}

	const defaultOptions: IModelDecorationOptions = {
		description: 'run-test-decoration',
		showIfCollapsed: true,
		get hoverMessage() {
			if (!hoverMessage) {
				const building = hoverMessage = new MarkdownString('', true).appendText(hoverMessageParts.join(', ') + '.');
				if (testIdWithMessages) {
					const args = encodeURIComponent(JSON.stringify([testIdWithMessages]));
					building.appendMarkdown(` [${localize('peekTestOutout', 'Peek Test Output')}](command:vscode.peekTestError?${args})`);
				}
			}

			return hoverMessage;
		},
		glyphMargin: { position: GLYPH_MARGIN_LANE },
		glyphMarginClassName: `${ThemeIcon.asClassName(primaryIcon)} ${glyphMarginClassName}`,
		stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
		zIndex: 10000,
	};

	const alternateOptions: IModelDecorationOptions = {
		...defaultOptions,
		glyphMarginClassName: `${ThemeIcon.asClassName(alternateIcon)} ${glyphMarginClassName}`,
	};

	return {
		range: collapseRange(range),
		options: defaultOptions,
		alternate: alternateOptions,
	};
};

const enum LensContentWidgetVars {
	FontFamily = 'testingDiffLensFontFamily',
	FontFeatures = 'testingDiffLensFontFeatures',
}

abstract class TitleLensContentWidget {
	/** @inheritdoc */
	public readonly allowEditorOverflow = false;
	/** @inheritdoc */
	public readonly suppressMouseDown = true;

	private readonly _domNode = dom.$('span');
	private viewZoneId?: string;

	constructor(private readonly editor: ICodeEditor) {
		queueMicrotask(() => {
			this.applyStyling();
			this.editor.addContentWidget(this);
		});
	}

	private applyStyling() {
		let fontSize = this.editor.getOption(EditorOption.codeLensFontSize);
		let height: number;
		if (!fontSize || fontSize < 5) {
			fontSize = (this.editor.getOption(EditorOption.fontSize) * .9) | 0;
			height = this.editor.getOption(EditorOption.lineHeight);
		} else {
			height = (fontSize * Math.max(1.3, this.editor.getOption(EditorOption.lineHeight) / this.editor.getOption(EditorOption.fontSize))) | 0;
		}

		const editorFontInfo = this.editor.getOption(EditorOption.fontInfo);
		const node = this._domNode;
		node.classList.add('testing-diff-lens-widget');
		node.textContent = this.getText();
		node.style.lineHeight = `${height}px`;
		node.style.fontSize = `${fontSize}px`;
		node.style.fontFamily = `var(--${LensContentWidgetVars.FontFamily})`;
		node.style.fontFeatureSettings = `var(--${LensContentWidgetVars.FontFeatures})`;

		const containerStyle = this.editor.getContainerDomNode().style;
		containerStyle.setProperty(LensContentWidgetVars.FontFamily, this.editor.getOption(EditorOption.codeLensFontFamily) ?? 'inherit');
		containerStyle.setProperty(LensContentWidgetVars.FontFeatures, editorFontInfo.fontFeatureSettings);

		this.editor.changeViewZones(accessor => {
			if (this.viewZoneId) {
				accessor.removeZone(this.viewZoneId);
			}

			this.viewZoneId = accessor.addZone({
				afterLineNumber: 0,
				afterColumn: Constants.MAX_SAFE_SMALL_INTEGER,
				domNode: document.createElement('div'),
				heightInPx: 20,
			});
		});
	}

	/** @inheritdoc */
	public abstract getId(): string;

	/** @inheritdoc */
	public getDomNode() {
		return this._domNode;
	}

	/** @inheritdoc */
	public dispose() {
		this.editor.changeViewZones(accessor => {
			if (this.viewZoneId) {
				accessor.removeZone(this.viewZoneId);
			}
		});

		this.editor.removeContentWidget(this);
	}

	/** @inheritdoc */
	public getPosition(): IContentWidgetPosition {
		return {
			position: { column: 0, lineNumber: 0 },
			preference: [ContentWidgetPositionPreference.ABOVE],
		};
	}

	protected abstract getText(): string;
}

class ExpectedLensContentWidget extends TitleLensContentWidget {
	public getId() {
		return 'expectedTestingLens';
	}

	protected override getText() {
		return localize('expected.title', 'Expected');
	}
}


class ActualLensContentWidget extends TitleLensContentWidget {
	public getId() {
		return 'actualTestingLens';
	}

	protected override getText() {
		return localize('actual.title', 'Actual');
	}
}

abstract class RunTestDecoration {
	/** @inheritdoc */
	public id = '';

	public get line() {
		return this.editorDecoration.range.startLineNumber;
	}

	public get testIds() {
		return this.tests.map(t => t.test.item.extId);
	}

	public editorDecoration: IModelDeltaDecoration & { alternate?: IModelDecorationOptions };
	public displayedStates: readonly (TestResultState | undefined)[];

	constructor(
		protected tests: readonly {
			test: IncrementalTestCollectionItem;
			resultItem: TestResultItem | undefined;
		}[],
		private visible: boolean,
		protected readonly model: ITextModel,
		@ICodeEditorService private readonly codeEditorService: ICodeEditorService,
		@ITestService protected readonly testService: ITestService,
		@IContextMenuService protected readonly contextMenuService: IContextMenuService,
		@ICommandService protected readonly commandService: ICommandService,
		@IConfigurationService protected readonly configurationService: IConfigurationService,
		@ITestProfileService protected readonly testProfileService: ITestProfileService,
		@IContextKeyService protected readonly contextKeyService: IContextKeyService,
		@IMenuService protected readonly menuService: IMenuService,
	) {
		this.displayedStates = tests.map(t => t.resultItem?.computedState);
		this.editorDecoration = createRunTestDecoration(
			tests.map(t => t.test),
			tests.map(t => t.resultItem),
			visible,
			getTestingConfiguration(this.configurationService, TestingConfigKeys.DefaultGutterClickAction),
		);
		this.editorDecoration.options.glyphMarginHoverMessage = new MarkdownString().appendText(this.getGutterLabel());
	}

	/** @inheritdoc */
	public click(e: IEditorMouseEvent): boolean {
		if (e.target.type !== MouseTargetType.GUTTER_GLYPH_MARGIN
			|| e.target.detail.glyphMarginLane !== GLYPH_MARGIN_LANE
			// handled by editor gutter context menu
			|| e.event.rightButton
			|| isMacintosh && e.event.leftButton && e.event.ctrlKey
		) {
			return false;
		}

		const alternateAction = e.event.altKey;
		switch (getTestingConfiguration(this.configurationService, TestingConfigKeys.DefaultGutterClickAction)) {
			case DefaultGutterClickAction.ContextMenu:
				this.showContextMenu(e);
				break;
			case DefaultGutterClickAction.Debug:
				this.runWith(alternateAction ? TestRunProfileBitset.Run : TestRunProfileBitset.Debug);
				break;
			case DefaultGutterClickAction.Coverage:
				this.runWith(alternateAction ? TestRunProfileBitset.Debug : TestRunProfileBitset.Coverage);
				break;
			case DefaultGutterClickAction.Run:
			default:
				this.runWith(alternateAction ? TestRunProfileBitset.Debug : TestRunProfileBitset.Run);
				break;
		}

		return true;
	}

	/**
	 * Updates the decoration to match the new set of tests.
	 * @returns true if options were changed, false otherwise
	 */
	public replaceOptions(newTests: readonly {
		test: IncrementalTestCollectionItem;
		resultItem: TestResultItem | undefined;
	}[], visible: boolean): boolean {
		const displayedStates = newTests.map(t => t.resultItem?.computedState);
		if (visible === this.visible && equals(this.displayedStates, displayedStates)) {
			return false;
		}

		this.tests = newTests;
		this.displayedStates = displayedStates;
		this.visible = visible;

		const { options, alternate } = createRunTestDecoration(
			newTests.map(t => t.test),
			newTests.map(t => t.resultItem),
			visible,
			getTestingConfiguration(this.configurationService, TestingConfigKeys.DefaultGutterClickAction)
		);

		this.editorDecoration.options = options;
		this.editorDecoration.alternate = alternate;
		this.editorDecoration.options.glyphMarginHoverMessage = new MarkdownString().appendText(this.getGutterLabel());
		return true;
	}

	/**
	 * Gets whether this decoration serves as the run button for the given test ID.
	 */
	public isForTest(testId: string) {
		return this.tests.some(t => t.test.item.extId === testId);
	}

	/**
	 * Called when the decoration is clicked on.
	 */
	abstract getContextMenuActions(): IReference<IAction[]>;

	protected runWith(profile: TestRunProfileBitset) {
		return this.testService.runTests({
			tests: simplifyTestsToExecute(this.testService.collection, this.tests.map(({ test }) => test)),
			group: profile,
		});
	}

	private showContextMenu(e: IEditorMouseEvent) {
		const editor = this.codeEditorService.listCodeEditors().find(e => e.getModel() === this.model);
		editor?.getContribution<EditorLineNumberContextMenu>(EditorLineNumberContextMenu.ID)?.show(e);
	}

	private getGutterLabel() {
		switch (getTestingConfiguration(this.configurationService, TestingConfigKeys.DefaultGutterClickAction)) {
			case DefaultGutterClickAction.ContextMenu:
				return localize('testing.gutterMsg.contextMenu', 'Click for test options');
			case DefaultGutterClickAction.Debug:
				return localize('testing.gutterMsg.debug', 'Click to debug tests, right click for more options');
			case DefaultGutterClickAction.Coverage:
				return localize('testing.gutterMsg.coverage', 'Click to run tests with coverage, right click for more options');
			case DefaultGutterClickAction.Run:
			default:
				return localize('testing.gutterMsg.run', 'Click to run tests, right click for more options');
		}
	}

	/**
	 * Gets context menu actions relevant for a singel test.
	 */
	protected getTestContextMenuActions(test: InternalTestItem, resultItem?: TestResultItem): IReference<IAction[]> {
		const testActions: Action[] = [];
		const capabilities = this.testProfileService.capabilitiesForTest(test.item);

		[
			{ bitset: TestRunProfileBitset.Run, label: localize('run test', 'Run Test') },
			{ bitset: TestRunProfileBitset.Debug, label: localize('debug test', 'Debug Test') },
			{ bitset: TestRunProfileBitset.Coverage, label: localize('coverage test', 'Run with Coverage') },
		].forEach(({ bitset, label }) => {
			if (capabilities & bitset) {
				testActions.push(new Action(`testing.gutter.${bitset}`, label, undefined, undefined,
					() => this.testService.runTests({ group: bitset, tests: [test] })));
			}
		});

		if (capabilities & TestRunProfileBitset.HasNonDefaultProfile) {
			testActions.push(new Action('testing.runUsing', localize('testing.runUsing', 'Execute Using Profile...'), undefined, undefined, async () => {
				const profile: ITestRunProfile | undefined = await this.commandService.executeCommand('vscode.pickTestProfile', { onlyForTest: test });
				if (!profile) {
					return;
				}

				this.testService.runResolvedTests({
					group: profile.group,
					targets: [{
						profileId: profile.profileId,
						controllerId: profile.controllerId,
						testIds: [test.item.extId]
					}]
				});
			}));
		}

		if (resultItem && isFailedState(resultItem.computedState)) {
			testActions.push(new Action('testing.gutter.peekFailure', localize('peek failure', 'Peek Error'), undefined, undefined,
				() => this.commandService.executeCommand('vscode.peekTestError', test.item.extId)));
		}

		if (resultItem?.computedState === TestResultState.Running) {
			testActions.push(new Action('testing.gutter.cancel', localize('testing.cancelRun', 'Cancel Test Run'), undefined, undefined,
				() => this.commandService.executeCommand(TestCommandId.CancelTestRunAction)));
		}

		testActions.push(new Action('testing.gutter.reveal', localize('reveal test', 'Reveal in Test Explorer'), undefined, undefined,
			() => this.commandService.executeCommand('_revealTestInExplorer', test.item.extId)));

		const contributed = this.getContributedTestActions(test, capabilities);
		return { object: Separator.join(testActions, contributed), dispose() { testActions.forEach(a => a.dispose()); } };
	}

	private getContributedTestActions(test: InternalTestItem, capabilities: number): IAction[] {
		const contextOverlay = this.contextKeyService.createOverlay(getTestItemContextOverlay(test, capabilities));

		const arg = getContextForTestItem(this.testService.collection, test.item.extId);
		const menu = this.menuService.getMenuActions(MenuId.TestItemGutter, contextOverlay, { shouldForwardArgs: true, arg });
		return getFlatContextMenuActions(menu);
	}
}

interface IMultiRunTest {
	currentLabel: string;
	parent: TestId | undefined;
	testItem: {
		test: IncrementalTestCollectionItem;
		resultItem: TestResultItem | undefined;
	};
}

class MultiRunTestDecoration extends RunTestDecoration implements ITestDecoration {
	constructor(
		tests: readonly {
			test: IncrementalTestCollectionItem;
			resultItem: TestResultItem | undefined;
		}[],
		visible: boolean,
		model: ITextModel,
		@ICodeEditorService codeEditorService: ICodeEditorService,
		@ITestService testService: ITestService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@ICommandService commandService: ICommandService,
		@IConfigurationService configurationService: IConfigurationService,
		@ITestProfileService testProfileService: ITestProfileService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IMenuService menuService: IMenuService,
		@IQuickInputService private readonly quickInputService: IQuickInputService,
	) {
		super(tests, visible, model, codeEditorService, testService, contextMenuService, commandService, configurationService, testProfileService, contextKeyService, menuService);
	}

	public override getContextMenuActions() {
		const disposable = new DisposableStore();
		const allActions: Action[] = [];
		[
			{ bitset: TestRunProfileBitset.Run, label: localize('run all test', 'Run All Tests') },
			{ bitset: TestRunProfileBitset.Coverage, label: localize('run all test with coverage', 'Run All Tests with Coverage') },
			{ bitset: TestRunProfileBitset.Debug, label: localize('debug all test', 'Debug All Tests') },
		].forEach(({ bitset, label }, i) => {
			const canRun = this.tests.some(({ test }) => this.testProfileService.capabilitiesForTest(test.item) & bitset);
			if (canRun) {
				allActions.push(new Action(`testing.gutter.run${i}`, label, undefined, undefined, () => this.runWith(bitset)));
			}
		});

		disposable.add(toDisposable(() => allActions.forEach(a => a.dispose())));

		const testItems = this.tests.map((testItem): IMultiRunTest => ({
			currentLabel: testItem.test.item.label,
			testItem,
			parent: TestId.fromString(testItem.test.item.extId).parentId,
		}));

		const getLabelConflicts = (tests: typeof testItems) => {
			const labelCount = new Map<string, number>();
			for (const test of tests) {
				labelCount.set(test.currentLabel, (labelCount.get(test.currentLabel) || 0) + 1);
			}

			return tests.filter(e => labelCount.get(e.currentLabel)! > 1);
		};

		let conflicts, hasParent = true;
		while ((conflicts = getLabelConflicts(testItems)).length && hasParent) {
			for (const conflict of conflicts) {
				if (conflict.parent) {
					const parent = this.testService.collection.getNodeById(conflict.parent.toString());
					conflict.currentLabel = parent?.item.label + ' > ' + conflict.currentLabel;
					conflict.parent = conflict.parent.parentId;
				} else {
					hasParent = false;
				}
			}
		}

		testItems.sort((a, b) => {
			const ai = a.testItem.test.item;
			const bi = b.testItem.test.item;
			return (ai.sortText || ai.label).localeCompare(bi.sortText || bi.label);
		});

		let testSubmenus: IAction[] = testItems.map(({ currentLabel, testItem }) => {
			const actions = this.getTestContextMenuActions(testItem.test, testItem.resultItem);
			disposable.add(actions);
			let label = stripIcons(currentLabel);
			const lf = label.indexOf('\n');
			if (lf !== -1) {
				label = label.slice(0, lf);
			}

			return new SubmenuAction(testItem.test.item.extId, label, actions.object);
		});


		const overflow = testSubmenus.length - MAX_TESTS_IN_SUBMENU;
		if (overflow > 0) {
			testSubmenus = testSubmenus.slice(0, MAX_TESTS_IN_SUBMENU);
			testSubmenus.push(new Action(
				'testing.gutter.overflow',
				localize('testOverflowItems', '{0} more tests...', overflow),
				undefined,
				undefined,
				() => this.pickAndRun(testItems),
			));
		}

		return { object: Separator.join(allActions, testSubmenus), dispose: () => disposable.dispose() };
	}

	private async pickAndRun(testItems: IMultiRunTest[]) {
		const doPick = <T extends IQuickPickItem>(items: T[], title: string) => new Promise<T | undefined>(resolve => {
			const disposables = new DisposableStore();
			const pick = disposables.add(this.quickInputService.createQuickPick<T>());
			pick.placeholder = title;
			pick.items = items;
			disposables.add(pick.onDidHide(() => {
				resolve(undefined);
				disposables.dispose();
			}));
			disposables.add(pick.onDidAccept(() => {
				resolve(pick.selectedItems[0]);
				disposables.dispose();
			}));
			pick.show();
		});

		const item = await doPick(
			testItems.map(({ currentLabel, testItem }) => ({ label: currentLabel, test: testItem.test, result: testItem.resultItem })),
			localize('selectTestToRun', 'Select a test to run'),
		);

		if (!item) {
			return;
		}

		const actions = this.getTestContextMenuActions(item.test, item.result);
		try {
			(await doPick(actions.object, item.label))?.run();
		} finally {
			actions.dispose();
		}
	}
}

class RunSingleTestDecoration extends RunTestDecoration implements ITestDecoration {
	constructor(
		test: IncrementalTestCollectionItem,
		resultItem: TestResultItem | undefined,
		model: ITextModel,
		visible: boolean,
		@ICodeEditorService codeEditorService: ICodeEditorService,
		@ITestService testService: ITestService,
		@ICommandService commandService: ICommandService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IConfigurationService configurationService: IConfigurationService,
		@ITestProfileService testProfiles: ITestProfileService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IMenuService menuService: IMenuService,
	) {
		super([{ test, resultItem }], visible, model, codeEditorService, testService, contextMenuService, commandService, configurationService, testProfiles, contextKeyService, menuService);
	}

	override getContextMenuActions() {
		return this.getTestContextMenuActions(this.tests[0].test, this.tests[0].resultItem);
	}
}

const lineBreakRe = /\r?\n\s*/g;

class TestMessageDecoration implements ITestDecoration {
	public static readonly inlineClassName = 'test-message-inline-content';
	public static readonly decorationId = `testmessage-${generateUuid()}`;

	public id = '';

	public readonly editorDecoration: IModelDeltaDecoration;
	public readonly line: number;

	private readonly contentIdClass = `test-message-inline-content-id${generateUuid()}`;

	constructor(
		public readonly testMessage: ITestMessage,
		private readonly messageUri: URI | undefined,
		textModel: ITextModel,
		@ITestingPeekOpener private readonly peekOpener: ITestingPeekOpener,
		@ICodeEditorService editorService: ICodeEditorService,
	) {
		const location = testMessage.location!;
		this.line = clamp(location.range.startLineNumber, 0, textModel.getLineCount());
		const severity = testMessage.type;
		const message = testMessage.message;

		const options = editorService.resolveDecorationOptions(TestMessageDecoration.decorationId, true);
		options.hoverMessage = typeof message === 'string' ? new MarkdownString().appendText(message) : message;
		options.zIndex = 10; // todo: in spite of the z-index, this appears behind gitlens
		options.className = `testing-inline-message-severity-${severity}`;
		options.isWholeLine = true;
		options.stickiness = TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges;
		options.collapseOnReplaceEdit = true;

		let inlineText = renderTestMessageAsText(message).replace(lineBreakRe, ' ');
		if (inlineText.length > MAX_INLINE_MESSAGE_LENGTH) {
			inlineText = inlineText.slice(0, MAX_INLINE_MESSAGE_LENGTH - 1) + '…';
		}

		options.after = {
			content: inlineText,
			inlineClassName: `test-message-inline-content test-message-inline-content-s${severity} ${this.contentIdClass} ${messageUri ? 'test-message-inline-content-clickable' : ''}`
		};
		options.showIfCollapsed = true;

		const rulerColor = severity === TestMessageType.Error
			? overviewRulerError
			: overviewRulerInfo;

		if (rulerColor) {
			options.overviewRuler = { color: themeColorFromId(rulerColor), position: OverviewRulerLane.Right };
		}

		const lineLength = textModel.getLineLength(this.line);
		const column = lineLength ? (lineLength + 1) : location.range.endColumn;
		this.editorDecoration = {
			options,
			range: {
				startLineNumber: this.line,
				startColumn: column,
				endColumn: column,
				endLineNumber: this.line,
			}
		};
	}

	click(e: IEditorMouseEvent): boolean {
		if (e.event.rightButton) {
			return false;
		}

		if (!this.messageUri) {
			return false;
		}

		if (e.target.element?.className.includes(this.contentIdClass)) {
			this.peekOpener.peekUri(this.messageUri);
		}

		return false;
	}

	getContextMenuActions() {
		return { object: [], dispose: () => { } };
	}
}

const ERROR_CONTENT_WIDGET_HEIGHT = 20;

class TestErrorContentWidget extends Disposable implements IContentWidget {
	private readonly id = generateUuid();

	/** @inheritdoc */
	public readonly allowEditorOverflow = false;

	private readonly node = dom.h('div.test-error-content-widget', [
		dom.h('div.inner@inner', [
			dom.h('div.arrow@arrow'),
			dom.h(`span${ThemeIcon.asCSSSelector(testingStatesToIcons.get(TestResultState.Failed)!)}`),
			dom.h('span.content@name'),
		]),
	]);

	public get line() {
		return this.position.lineNumber;
	}

	constructor(
		private readonly editor: ICodeEditor,
		private position: Position,
		public readonly message: ITestErrorMessage,
		public readonly resultItem: TestResultItem,
		uri: URI,
		@ITestingPeekOpener readonly peekOpener: ITestingPeekOpener,
	) {
		super();

		const setMarginTop = () => {
			const lineHeight = editor.getLineHeightForPosition(position);
			this.node.root.style.marginTop = (lineHeight - ERROR_CONTENT_WIDGET_HEIGHT) / 2 + 'px';
		};

		setMarginTop();
		this._register(editor.onDidChangeLineHeight(e => {
			if (e.affects(position)) {
				setMarginTop();
			}
		}));

		this._register(editor.onDidChangeConfiguration(e => {
			if (e.hasChanged(EditorOption.lineHeight)) {
				setMarginTop();
			}
		}));

		let text: string;
		if (message.expected !== undefined && message.actual !== undefined) {
			text = `${truncateMiddle(message.actual.replace(/\s+/g, ' '), 30)} != ${truncateMiddle(message.expected.replace(/\s+/g, ' '), 30)}`;
		} else {
			const msg = renderAsPlaintext(message.message);
			const lf = msg.indexOf('\n');
			text = lf === -1 ? msg : msg.slice(0, lf);
		}

		this._register(dom.addDisposableListener(this.node.root, dom.EventType.CLICK, e => {
			this.peekOpener.peekUri(uri);
			e.preventDefault();
		}));

		const ctrl = TestingOutputPeekController.get(editor);
		if (ctrl) {
			this._register(autorun(reader => {
				const subject = ctrl.subject.read(reader);
				const isCurrent = subject instanceof MessageSubject && subject.message === message;
				this.node.root.classList.toggle('is-current', isCurrent);
			}));
		}

		this.node.name.innerText = text || 'Test Failed';

		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg.setAttribute('width', '15');
		svg.setAttribute('height', '10');
		svg.setAttribute('preserveAspectRatio', 'none');
		svg.setAttribute('viewBox', '0 0 15 10');

		const leftArrow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		leftArrow.setAttribute('d', 'M15 0 L10 0 L0 5 L10 10 L15 10 Z');
		svg.append(leftArrow);

		this.node.arrow.appendChild(svg);

		this._register(editor.onDidChangeModelContent(e => {
			for (const c of e.changes) {
				if (c.range.startLineNumber > this.line) {
					continue;
				}
				if (
					c.range.startLineNumber <= this.line && c.range.endLineNumber >= this.line
					|| (resultItem.item.range && resultItem.item.range.startLineNumber <= c.range.startLineNumber && resultItem.item.range.endLineNumber >= c.range.endLineNumber)
				) {
					TestingDecorations.invalidatedTests.add(this.resultItem);
					this.dispose(); // todo
				}

				const adjust = count(c.text, '\n') - (c.range.endLineNumber - c.range.startLineNumber);
				if (adjust !== 0) {
					this.position = this.position.delta(adjust);
					this.editor.layoutContentWidget(this);
				}
			}
		}));

		editor.addContentWidget(this);
		this._register(toDisposable(() => editor.removeContentWidget(this)));
	}

	public getId(): string {
		return this.id;
	}

	public getDomNode(): HTMLElement {
		return this.node.root;
	}

	public getPosition(): IContentWidgetPosition | null {
		return {
			position: this.position,
			preference: [ContentWidgetPositionPreference.EXACT],
		};
	}

	afterRender(_position: ContentWidgetPositionPreference | null, coordinate: IContentWidgetRenderedCoordinate | null): void {
		if (coordinate) {
			const { verticalScrollbarWidth } = this.editor.getLayoutInfo();
			const scrollWidth = this.editor.getScrollWidth();
			this.node.inner.style.maxWidth = `${scrollWidth - verticalScrollbarWidth - coordinate.left - 20}px`;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/testing/browser/testingExplorerFilter.ts]---
Location: vscode-main/src/vs/workbench/contrib/testing/browser/testingExplorerFilter.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { ActionBar } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { BaseActionViewItem, IActionViewItemOptions, IBaseActionViewItemOptions } from '../../../../base/browser/ui/actionbar/actionViewItems.js';
import { AnchorAlignment } from '../../../../base/browser/ui/contextview/contextview.js';
import { DropdownMenuActionViewItem } from '../../../../base/browser/ui/dropdown/dropdownActionViewItem.js';
import { Action, IAction, IActionRunner, Separator } from '../../../../base/common/actions.js';
import { Delayer } from '../../../../base/common/async.js';
import { Emitter } from '../../../../base/common/event.js';
import { Iterable } from '../../../../base/common/iterator.js';
import { localize } from '../../../../nls.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { ContextScopedSuggestEnabledInputWithHistory, SuggestEnabledInputWithHistory, SuggestResultsProvider } from '../../codeEditor/browser/suggestEnabledInput/suggestEnabledInput.js';
import { testingFilterIcon } from './icons.js';
import { StoredValue } from '../common/storedValue.js';
import { ITestExplorerFilterState, TestFilterTerm } from '../common/testExplorerFilterState.js';
import { ITestService } from '../common/testService.js';
import { denamespaceTestTag } from '../common/testTypes.js';

const testFilterDescriptions: { [K in TestFilterTerm]: string } = {
	[TestFilterTerm.Failed]: localize('testing.filters.showOnlyFailed', "Show Only Failed Tests"),
	[TestFilterTerm.Executed]: localize('testing.filters.showOnlyExecuted', "Show Only Executed Tests"),
	[TestFilterTerm.CurrentDoc]: localize('testing.filters.currentFile', "Show in Active File Only"),
	[TestFilterTerm.OpenedFiles]: localize('testing.filters.openedFiles', "Show in Opened Files Only"),
	[TestFilterTerm.Hidden]: localize('testing.filters.showExcludedTests', "Show Hidden Tests"),
};

export class TestingExplorerFilter extends BaseActionViewItem {
	private input!: SuggestEnabledInputWithHistory;
	private wrapper!: HTMLDivElement;
	private readonly focusEmitter = this._register(new Emitter<void>());
	public readonly onDidFocus = this.focusEmitter.event;
	private readonly history: StoredValue<{ values: string[]; lastValue: string } | string[]>;

	private readonly filtersAction = new Action('markersFiltersAction', localize('testing.filters.menu', "More Filters..."), 'testing-filter-button ' + ThemeIcon.asClassName(testingFilterIcon));

	constructor(
		action: IAction,
		options: IBaseActionViewItemOptions,
		@ITestExplorerFilterState private readonly state: ITestExplorerFilterState,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@ITestService private readonly testService: ITestService,
	) {
		super(null, action, options);
		this.history = this._register(instantiationService.createInstance(StoredValue, {
			key: 'testing.filterHistory2',
			scope: StorageScope.WORKSPACE,
			target: StorageTarget.MACHINE
		}));
		this.updateFilterActiveState();
		this._register(testService.excluded.onTestExclusionsChanged(this.updateFilterActiveState, this));
	}

	/**
	 * @override
	 */
	public override render(container: HTMLElement) {
		container.classList.add('testing-filter-action-item');

		const updateDelayer = this._register(new Delayer<void>(400));
		const wrapper = this.wrapper = dom.$('.testing-filter-wrapper');
		container.appendChild(wrapper);

		let history = this.history.get({ lastValue: '', values: [] });
		if (history instanceof Array) {
			history = { lastValue: '', values: history };
		}
		if (history.lastValue) {
			this.state.setText(history.lastValue);
		}

		const input = this.input = this._register(this.instantiationService.createInstance(ContextScopedSuggestEnabledInputWithHistory, {
			id: 'testing.explorer.filter',
			ariaLabel: localize('testExplorerFilterLabel', "Filter text for tests in the explorer"),
			parent: wrapper,
			suggestionProvider: {
				triggerCharacters: ['@'],
				provideResults: () => [
					...Object.entries(testFilterDescriptions).map(([label, detail]) => ({ label, detail })),
					...Iterable.map(this.testService.collection.tags.values(), tag => {
						const { ctrlId, tagId } = denamespaceTestTag(tag.id);
						const insertText = `@${ctrlId}:${tagId}`;
						return ({
							label: `@${ctrlId}:${tagId}`,
							detail: this.testService.collection.getNodeById(ctrlId)?.item.label,
							insertText: tagId.includes(' ') ? `@${ctrlId}:"${tagId.replace(/(["\\])/g, '\\$1')}"` : insertText,
						});
					}),
				].filter(r => !this.state.text.value.includes(r.label)),
			} satisfies SuggestResultsProvider,
			resourceHandle: 'testing:filter',
			suggestOptions: {
				value: this.state.text.value,
				placeholderText: localize('testExplorerFilter', "Filter (e.g. text, !exclude, @tag)"),
			},
			history: history.values
		}));

		this._register(this.state.text.onDidChange(newValue => {
			if (input.getValue() !== newValue) {
				input.setValue(newValue);
			}
		}));

		this._register(this.state.onDidRequestInputFocus(() => {
			input.focus();
		}));

		this._register(input.onDidFocus(() => {
			this.focusEmitter.fire();
		}));

		this._register(input.onInputDidChange(() => updateDelayer.trigger(() => {
			input.addToHistory();
			this.state.setText(input.getValue());
		})));

		const actionbar = this._register(new ActionBar(container, {
			actionViewItemProvider: (action, options) => {
				if (action.id === this.filtersAction.id) {
					return this.instantiationService.createInstance(FiltersDropdownMenuActionViewItem, action, options, this.state, this.actionRunner);
				}
				return undefined;
			},
		}));
		actionbar.push(this.filtersAction, { icon: true, label: false });

		this.layout(this.wrapper.clientWidth);
	}

	public layout(width: number) {
		this.input.layout(new dom.Dimension(
			width - /* horizontal padding */ 24 - /* editor padding */ 8 - /* filter button padding */ 22,
			20, // line height from suggestEnabledInput.ts
		));
	}


	/**
	 * Focuses the filter input.
	 */
	public override focus(): void {
		this.input.focus();
	}

	/**
	 * Persists changes to the input history.
	 */
	public saveState() {
		this.history.store({ lastValue: this.input.getValue(), values: this.input.getHistory() });
	}

	/**
	 * @override
	 */
	public override dispose() {
		this.saveState();
		super.dispose();
	}

	/**
	 * Updates the 'checked' state of the filter submenu.
	 */
	private updateFilterActiveState() {
		this.filtersAction.checked = this.testService.excluded.hasAny;
	}
}


class FiltersDropdownMenuActionViewItem extends DropdownMenuActionViewItem {

	constructor(
		action: IAction,
		options: IActionViewItemOptions,
		private readonly filters: ITestExplorerFilterState,
		actionRunner: IActionRunner,
		@IContextMenuService contextMenuService: IContextMenuService,
		@ITestService private readonly testService: ITestService,
	) {
		super(action,
			{ getActions: () => this.getActions() },
			contextMenuService,
			{
				actionRunner,
				classNames: action.class,
				anchorAlignmentProvider: () => AnchorAlignment.RIGHT,
				menuAsChild: true
			}
		);
	}

	override render(container: HTMLElement): void {
		super.render(container);
		this.updateChecked();
	}

	private getActions(): IAction[] {
		return [
			...[TestFilterTerm.Failed, TestFilterTerm.Executed, TestFilterTerm.CurrentDoc, TestFilterTerm.OpenedFiles].map(term => ({
				checked: this.filters.isFilteringFor(term),
				class: undefined,
				enabled: true,
				id: term,
				label: testFilterDescriptions[term],
				run: () => this.filters.toggleFilteringFor(term),
				tooltip: '',
				dispose: () => null
			})),
			new Separator(),
			{
				checked: this.filters.fuzzy.value,
				class: undefined,
				enabled: true,
				id: 'fuzzy',
				label: localize('testing.filters.fuzzyMatch', "Fuzzy Match"),
				run: () => this.filters.fuzzy.value = !this.filters.fuzzy.value,
				tooltip: ''
			},
			new Separator(),
			{
				checked: this.filters.isFilteringFor(TestFilterTerm.Hidden),
				class: undefined,
				enabled: this.testService.excluded.hasAny,
				id: 'showExcluded',
				label: localize('testing.filters.showExcludedTests', "Show Hidden Tests"),
				run: () => this.filters.toggleFilteringFor(TestFilterTerm.Hidden),
				tooltip: ''
			},
			{
				class: undefined,
				enabled: this.testService.excluded.hasAny,
				id: 'removeExcluded',
				label: localize('testing.filters.removeTestExclusions', "Unhide All Tests"),
				run: async () => this.testService.excluded.clear(),
				tooltip: ''
			}
		];
	}

	protected override updateChecked(): void {
		this.element!.classList.toggle('checked', this._action.checked);
	}
}
```

--------------------------------------------------------------------------------

````
