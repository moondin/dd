---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 433
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 433 of 552)

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

---[FILE: src/vs/workbench/contrib/notebook/test/browser/view/cellPart.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/test/browser/view/cellPart.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { CodeCellRenderTemplate } from '../../../browser/view/notebookRenderingCommon.js';
import { CodeCellViewModel } from '../../../browser/viewModel/codeCellViewModel.js';
import { CodeCellLayout } from '../../../browser/view/cellParts/codeCell.js';
import { ICodeEditor } from '../../../../../../editor/browser/editorBrowser.js';
import { CodeCellLayoutInfo, IActiveNotebookEditorDelegate } from '../../../browser/notebookBrowser.js';

suite('CellPart', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('CodeCellLayout editor visibility states', () => {
		/**
		 * We construct a very small mock around the parts that `CodeCellLayout` touches. The goal
		 * is to validate the branching logic that sets `_editorVisibility` without mutating any
		 * production code. Each scenario sets up geometry & scroll values then invokes
		 * `layoutEditor()` and asserts the resulting visibility classification.
		 */

		interface TestScenario {
			name: string;
			scrollTop: number;
			viewportHeight: number;
			editorContentHeight: number;
			editorHeight: number; // viewCell.layoutInfo.editorHeight
			outputContainerOffset: number; // elementTop + this offset => editorBottom
			expected: string; // CodeCellLayout.editorVisibility
			postScrollTop?: number; // expected editor scrollTop written into stub editor
			elementTop: number; // now scenario-specific for clarity
			elementHeight: number; // scenario-specific container height
			expectedTop: number; // expected computed CSS top (numeric px)
			expectedEditorScrollTop: number; // expected argument passed to editor.setScrollTop
		}

		const DEFAULT_ELEMENT_TOP = 100; // absolute top of the cell in notebook coordinates
		const DEFAULT_ELEMENT_HEIGHT = 900; // arbitrary, large enough not to constrain
		const STATUSBAR = 22;
		const TOP_MARGIN = 6; // mirrors layoutInfo.topMargin usage
		const OUTLINE = 1;

		const scenarios: TestScenario[] = [
			{
				name: 'Full',
				scrollTop: 0,
				viewportHeight: 400,
				editorContentHeight: 300,
				editorHeight: 300,
				outputContainerOffset: 300, // editorBottom = 100 + 300 = 400, fully inside viewport (scrollBottom=400)
				expected: 'Full',
				elementTop: DEFAULT_ELEMENT_TOP,
				elementHeight: DEFAULT_ELEMENT_HEIGHT,
				expectedTop: 0,
				expectedEditorScrollTop: 0,
			},
			{
				name: 'Bottom Clipped',
				scrollTop: 0,
				viewportHeight: 350, // scrollBottom=350 < editorBottom(400)
				editorContentHeight: 300,
				editorHeight: 300,
				outputContainerOffset: 300,
				expected: 'Bottom Clipped',
				elementTop: DEFAULT_ELEMENT_TOP,
				elementHeight: DEFAULT_ELEMENT_HEIGHT,
				expectedTop: 0,
				expectedEditorScrollTop: 0,
			},
			{
				name: 'Full (Small Viewport)',
				scrollTop: DEFAULT_ELEMENT_TOP + TOP_MARGIN + 20, // scrolled into the cell body
				viewportHeight: 220, // small vs content
				editorContentHeight: 500, // larger than viewport so we clamp
				editorHeight: 500,
				outputContainerOffset: 600, // editorBottom=700 > scrollBottom
				expected: 'Full (Small Viewport)',
				elementTop: DEFAULT_ELEMENT_TOP,
				elementHeight: DEFAULT_ELEMENT_HEIGHT,
				expectedTop: 19, // (scrollTop - elementTop - topMargin - outlineWidth) = (100+6+20 -100 -6 -1)
				expectedEditorScrollTop: 19,
			},
			{
				name: 'Top Clipped',
				scrollTop: DEFAULT_ELEMENT_TOP + TOP_MARGIN + 40, // scrolled further down but not past bottom
				viewportHeight: 600, // larger than content height below (forces branch for Top Clipped)
				editorContentHeight: 200,
				editorHeight: 200,
				outputContainerOffset: 450, // editorBottom=550; scrollBottom= scrollTop+viewportHeight = > 550?  (540+600=1140) but we only need scrollTop < editorBottom
				expected: 'Top Clipped',
				elementTop: DEFAULT_ELEMENT_TOP,
				elementHeight: DEFAULT_ELEMENT_HEIGHT,
				expectedTop: 39, // (100+6+40 -100 -6 -1)
				expectedEditorScrollTop: 40, // contentHeight(200) - computed height(160)
			},
			{
				name: 'Invisible',
				scrollTop: DEFAULT_ELEMENT_TOP + 1000, // well below editor bottom
				viewportHeight: 400,
				editorContentHeight: 300,
				editorHeight: 300,
				outputContainerOffset: 300, // editorBottom=400 < scrollTop
				expected: 'Invisible',
				elementTop: DEFAULT_ELEMENT_TOP,
				elementHeight: DEFAULT_ELEMENT_HEIGHT,
				expectedTop: 278, // adjusted after ensuring minimum line height when possibleEditorHeight < LINE_HEIGHT
				expectedEditorScrollTop: 279, // contentHeight(300) - clamped height(21)
			},
		];

		for (const s of scenarios) {
			// Fresh stub objects per scenario
			const editorScrollState: { scrollTop: number } = { scrollTop: 0 };
			const stubEditor = {
				layoutCalls: [] as { width: number; height: number }[],
				_lastScrollTopSet: -1,
				getLayoutInfo: () => ({ width: 600, height: s.editorHeight }),
				getContentHeight: () => s.editorContentHeight,
				layout: (dim: { width: number; height: number }) => {
					stubEditor.layoutCalls.push(dim);
				},
				setScrollTop: (v: number) => {
					editorScrollState.scrollTop = v;
					stubEditor._lastScrollTopSet = v;
				},
				hasModel: () => true,
			};

			const editorPart = { style: { top: '' } };
			const template: Partial<CodeCellRenderTemplate> = {
				editor: stubEditor as unknown as ICodeEditor,
				editorPart: editorPart as unknown as HTMLElement,
			};

			// viewCell stub with only needed pieces
			const viewCell: Partial<CodeCellViewModel> = {
				isInputCollapsed: false,
				layoutInfo: {
					// values referenced in layout logic
					statusBarHeight: STATUSBAR,
					topMargin: TOP_MARGIN,
					outlineWidth: OUTLINE,
					editorHeight: s.editorHeight,
					outputContainerOffset: s.outputContainerOffset,
				} as unknown as CodeCellLayoutInfo,
			};

			// notebook editor stub
			let scrollBottom = s.scrollTop + s.viewportHeight;
			const notebookEditor = {
				scrollTop: s.scrollTop,
				get scrollBottom() {
					return scrollBottom;
				},
				setScrollTop: (v: number) => {
					notebookEditor.scrollTop = v;
					scrollBottom = v + s.viewportHeight;
				},
				getLayoutInfo: () => ({
					fontInfo: { lineHeight: 21 },
					height: s.viewportHeight,
					stickyHeight: 0,
				}),
				getAbsoluteTopOfElement: () => s.elementTop,
				getAbsoluteBottomOfElement: () =>
					s.elementTop + s.outputContainerOffset,
				getHeightOfElement: () => s.elementHeight,
				notebookOptions: {
					getLayoutConfiguration: () => ({ editorTopPadding: 6 }),
				},
			};

			const layout = new CodeCellLayout(
				/* enabled */ true,
				notebookEditor as unknown as IActiveNotebookEditorDelegate,
				viewCell as CodeCellViewModel,
				template as CodeCellRenderTemplate,
				{
					debug: () => {
						/* no-op */
					},
				},
				{ width: 600, height: s.editorHeight }
			);

			layout.layoutEditor('init');
			assert.strictEqual(
				layout.editorVisibility,
				s.expected,
				`Scenario '${s.name}' (scrollTop=${s.scrollTop}) expected visibility ${s.expected} but got ${layout.editorVisibility}`
			);
			const actualTop = parseInt(
				(editorPart.style.top || '0').replace(/px$/, '')
			); // style.top always like 'NNNpx'
			assert.strictEqual(
				actualTop,
				s.expectedTop,
				`Scenario '${s.name}' (scrollTop=${s.scrollTop}) expected top ${s.expectedTop}px but got ${editorPart.style.top}`
			);
			assert.strictEqual(
				stubEditor._lastScrollTopSet,
				s.expectedEditorScrollTop,
				`Scenario '${s.name}' (scrollTop=${s.scrollTop}) expected editor.setScrollTop(${s.expectedEditorScrollTop}) but got ${stubEditor._lastScrollTopSet}`
			);

			// Basic sanity: style.top should always be set when visible states other than Full (handled) or Invisible.
			if (s.expected !== 'Invisible') {
				assert.notStrictEqual(
					editorPart.style.top,
					'',
					`Scenario '${s.name}' should set a top style value`
				);
			} else {
				// Invisible still sets a top; just ensure layout ran
				assert.ok(
					editorPart.style.top !== undefined,
					'Invisible scenario still performs a layout'
				);
			}
		}
	});

	test('Scrolling', () => {
		/**
		 * Pixel-by-pixel scroll test to validate `CodeCellLayout` calculations for:
		 *  - editorPart.style.top
		 *  - editorVisibility classification
		 *  - editor internal scrollTop passed to setScrollTop
		 *
		 * We intentionally mirror the production math in a helper (duplication acceptable in test) so
		 * that any divergence is caught. Constants chosen to exercise all state transitions.
		 */
		const LINE_HEIGHT = 21; // from getLayoutInfo().fontInfo.lineHeight in stubs
		const CELL_TOP_MARGIN = 6;
		const CELL_OUTLINE_WIDTH = 1;
		const STATUSBAR_HEIGHT = 22;
		const VIEWPORT_HEIGHT = 300; // notebook viewport height
		const ELEMENT_TOP = 100; // absolute top
		const EDITOR_CONTENT_HEIGHT = 800; // tall content so we get clipping and small viewport states
		const EDITOR_HEIGHT = EDITOR_CONTENT_HEIGHT; // initial layoutInfo.editorHeight
		const OUTPUT_CONTAINER_OFFSET = 800; // bottom of editor region relative to elementTop
		const ELEMENT_HEIGHT = 1200; // large container

		function clamp(v: number, min: number, max: number) {
			return Math.min(Math.max(v, min), max);
		}

		function computeExpected(scrollTop: number) {
			const scrollBottom = scrollTop + VIEWPORT_HEIGHT;
			const viewportHeight = VIEWPORT_HEIGHT;
			const editorBottom = ELEMENT_TOP + OUTPUT_CONTAINER_OFFSET;
			let top = Math.max(
				0,
				scrollTop - ELEMENT_TOP - CELL_TOP_MARGIN - CELL_OUTLINE_WIDTH
			);
			const possibleEditorHeight = EDITOR_HEIGHT - top;
			if (possibleEditorHeight < LINE_HEIGHT) {
				top = top - (LINE_HEIGHT - possibleEditorHeight) - CELL_OUTLINE_WIDTH;
			}
			let height = EDITOR_CONTENT_HEIGHT;
			let visibility: string = 'Full';
			let editorScrollTop = 0;
			if (scrollTop <= ELEMENT_TOP + CELL_TOP_MARGIN) {
				const minimumEditorHeight = LINE_HEIGHT + 6; // editorTopPadding from configuration stub (6)
				if (scrollBottom >= editorBottom) {
					height = clamp(
						EDITOR_CONTENT_HEIGHT,
						minimumEditorHeight,
						EDITOR_CONTENT_HEIGHT
					);
					visibility = 'Full';
				} else {
					height =
						clamp(
							scrollBottom - (ELEMENT_TOP + CELL_TOP_MARGIN) - STATUSBAR_HEIGHT,
							minimumEditorHeight,
							EDITOR_CONTENT_HEIGHT
						) +
						2 * CELL_OUTLINE_WIDTH;
					visibility = 'Bottom Clipped';
					editorScrollTop = 0;
				}
			} else {
				if (
					viewportHeight <= EDITOR_CONTENT_HEIGHT &&
					scrollBottom <= editorBottom
				) {
					const minimumEditorHeight = LINE_HEIGHT + 6; // editorTopPadding
					height =
						clamp(
							viewportHeight - STATUSBAR_HEIGHT,
							minimumEditorHeight,
							EDITOR_CONTENT_HEIGHT - STATUSBAR_HEIGHT
						) +
						2 * CELL_OUTLINE_WIDTH;
					visibility = 'Full (Small Viewport)';
					editorScrollTop = top;
				} else {
					const minimumEditorHeight = LINE_HEIGHT;
					height = clamp(
						EDITOR_CONTENT_HEIGHT -
						(scrollTop - (ELEMENT_TOP + CELL_TOP_MARGIN)),
						minimumEditorHeight,
						EDITOR_CONTENT_HEIGHT
					);
					if (scrollTop > editorBottom) {
						visibility = 'Invisible';
					} else {
						visibility = 'Top Clipped';
					}
					editorScrollTop = EDITOR_CONTENT_HEIGHT - height;
				}
			}
			return { top, visibility, editorScrollTop };
		}

		// Shared stubs (we'll mutate scrollTop each iteration) – we re-create layout each iteration to reset internal state changes
		for (
			let scrollTop = 0;
			scrollTop <= VIEWPORT_HEIGHT + OUTPUT_CONTAINER_OFFSET + 20;
			scrollTop++
		) {
			const expected = computeExpected(scrollTop);
			const scrollBottom = scrollTop + VIEWPORT_HEIGHT;
			const stubEditor = {
				_lastScrollTopSet: -1,
				getLayoutInfo: () => ({ width: 600, height: EDITOR_HEIGHT }),
				getContentHeight: () => EDITOR_CONTENT_HEIGHT,
				layout: () => {
					/* no-op */
				},
				setScrollTop: (v: number) => {
					stubEditor._lastScrollTopSet = v;
				},
				hasModel: () => true,
			};
			const editorPart = { style: { top: '' } };
			const template: Partial<CodeCellRenderTemplate> = {
				editor: stubEditor as unknown as ICodeEditor,
				editorPart: editorPart as unknown as HTMLElement,
			};
			const viewCell: Partial<CodeCellViewModel> = {
				isInputCollapsed: false,
				layoutInfo: {
					statusBarHeight: STATUSBAR_HEIGHT,
					topMargin: CELL_TOP_MARGIN,
					outlineWidth: CELL_OUTLINE_WIDTH,
					editorHeight: EDITOR_HEIGHT,
					outputContainerOffset: OUTPUT_CONTAINER_OFFSET,
				} as unknown as CodeCellLayoutInfo,
			};
			const notebookEditor = {
				scrollTop,
				get scrollBottom() {
					return scrollBottom;
				},
				setScrollTop: (v: number) => {
					/* notebook scroll changes are not the focus here */
				},
				getLayoutInfo: () => ({
					fontInfo: { lineHeight: LINE_HEIGHT },
					height: VIEWPORT_HEIGHT,
					stickyHeight: 0,
				}),
				getAbsoluteTopOfElement: () => ELEMENT_TOP,
				getAbsoluteBottomOfElement: () => ELEMENT_TOP + OUTPUT_CONTAINER_OFFSET,
				getHeightOfElement: () => ELEMENT_HEIGHT,
				notebookOptions: {
					getLayoutConfiguration: () => ({ editorTopPadding: 6 }),
				},
			};
			const layout = new CodeCellLayout(
				true,
				notebookEditor as unknown as IActiveNotebookEditorDelegate,
				viewCell as CodeCellViewModel,
				template as CodeCellRenderTemplate,
				{ debug: () => { } },
				{ width: 600, height: EDITOR_HEIGHT }
			);
			layout.layoutEditor('nbDidScroll');
			const actualTop = parseInt(
				(editorPart.style.top || '0').replace(/px$/, '')
			);
			assert.strictEqual(
				actualTop,
				expected.top,
				`scrollTop=${scrollTop}: expected top ${expected.top}, got ${actualTop}`
			);
			assert.strictEqual(
				layout.editorVisibility,
				expected.visibility,
				`scrollTop=${scrollTop}: expected visibility ${expected.visibility}, got ${layout.editorVisibility}`
			);
			assert.strictEqual(
				stubEditor._lastScrollTopSet,
				expected.editorScrollTop,
				`scrollTop=${scrollTop}: expected editorScrollTop ${expected.editorScrollTop}, got ${stubEditor._lastScrollTopSet}`
			);
		}
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/test/browser/__snapshots__/NotebookEditorStickyScroll_test0__should_render_empty___scrollTop_at_0.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/notebook/test/browser/__snapshots__/NotebookEditorStickyScroll_test0__should_render_empty___scrollTop_at_0.0.snap

```text
[  ]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/test/browser/__snapshots__/NotebookEditorStickyScroll_test1__should_render_0-_1___visible_range_3-_8.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/notebook/test/browser/__snapshots__/NotebookEditorStickyScroll_test1__should_render_0-_1___visible_range_3-_8.0.snap

```text
[ "header a", "header aa" ]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/test/browser/__snapshots__/NotebookEditorStickyScroll_test2__should_render_0____visible_range_6-_9_so_collapsing_next_2_against_following_section.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/notebook/test/browser/__snapshots__/NotebookEditorStickyScroll_test2__should_render_0____visible_range_6-_9_so_collapsing_next_2_against_following_section.0.snap

```text
[ "header a" ]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/test/browser/__snapshots__/NotebookEditorStickyScroll_test3__should_render_0-_2___collapsing_against_equivalent_level_header.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/notebook/test/browser/__snapshots__/NotebookEditorStickyScroll_test3__should_render_0-_2___collapsing_against_equivalent_level_header.0.snap

```text
[ "header a", "header aa", "header aab" ]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/test/browser/__snapshots__/NotebookEditorStickyScroll_test4__should_render_0____scrolltop_halfway_through_cell_0.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/notebook/test/browser/__snapshots__/NotebookEditorStickyScroll_test4__should_render_0____scrolltop_halfway_through_cell_0.0.snap

```text
[ "header a" ]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/test/browser/__snapshots__/NotebookEditorStickyScroll_test5__should_render_0-_2___scrolltop_halfway_through_cell_2.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/notebook/test/browser/__snapshots__/NotebookEditorStickyScroll_test5__should_render_0-_2___scrolltop_halfway_through_cell_2.0.snap

```text
[ "header a", "header aa", "header aaa" ]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/test/browser/__snapshots__/NotebookEditorStickyScroll_test6__should_render_6-_7___scrolltop_halfway_through_cell_7.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/notebook/test/browser/__snapshots__/NotebookEditorStickyScroll_test6__should_render_6-_7___scrolltop_halfway_through_cell_7.0.snap

```text
[ "header b", "header bb" ]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/test/browser/__snapshots__/NotebookEditorStickyScroll_test7__should_render_0-_1___collapsing_against_next_section.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/notebook/test/browser/__snapshots__/NotebookEditorStickyScroll_test7__should_render_0-_1___collapsing_against_next_section.0.snap

```text
[ "header a", "header aa" ]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/opener/browser/opener.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/opener/browser/opener.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IOpener, IOpenerService, OpenExternalOptions, OpenInternalOptions } from '../../../../platform/opener/common/opener.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { registerWorkbenchContribution2, WorkbenchPhase } from '../../../common/contributions.js';
import { REVEAL_IN_EXPLORER_COMMAND_ID } from '../../files/browser/fileConstants.js';

class WorkbenchOpenerContribution extends Disposable implements IOpener {
	public static readonly ID = 'workbench.contrib.opener';

	constructor(
		@IOpenerService openerService: IOpenerService,
		@ICommandService private readonly commandService: ICommandService,
		@IFileService private readonly fileService: IFileService,
		@IWorkspaceContextService private readonly workspaceContextService: IWorkspaceContextService,
	) {
		super();

		this._register(openerService.registerOpener(this));
	}

	async open(link: URI | string, options?: OpenInternalOptions | OpenExternalOptions): Promise<boolean> {
		try {
			const uri = typeof link === 'string' ? URI.parse(link) : link;
			if (this.workspaceContextService.isInsideWorkspace(uri)) {
				if ((await this.fileService.stat(uri)).isDirectory) {
					await this.commandService.executeCommand(REVEAL_IN_EXPLORER_COMMAND_ID, uri);
					return true;
				}
			}
		} catch {
			// noop
		}

		return false;
	}
}


registerWorkbenchContribution2(WorkbenchOpenerContribution.ID, WorkbenchOpenerContribution, WorkbenchPhase.Eventually);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/outline/browser/outline.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/outline/browser/outline.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize, localize2 } from '../../../../nls.js';
import { IViewsRegistry, Extensions as ViewExtensions } from '../../../common/views.js';
import { OutlinePane } from './outlinePane.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IConfigurationRegistry, Extensions as ConfigurationExtensions, ConfigurationScope } from '../../../../platform/configuration/common/configurationRegistry.js';
import { VIEW_CONTAINER } from '../../files/browser/explorerViewlet.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';
import { OutlineConfigKeys } from '../../../services/outline/browser/outline.js';
import { IOutlinePane } from './outline.js';

// --- actions

import './outlineActions.js';

// --- view

const outlineViewIcon = registerIcon('outline-view-icon', Codicon.symbolClass, localize('outlineViewIcon', 'View icon of the outline view.'));

Registry.as<IViewsRegistry>(ViewExtensions.ViewsRegistry).registerViews([{
	id: IOutlinePane.Id,
	name: localize2('name', "Outline"),
	containerIcon: outlineViewIcon,
	ctorDescriptor: new SyncDescriptor(OutlinePane),
	canToggleVisibility: true,
	canMoveView: true,
	hideByDefault: false,
	collapsed: true,
	order: 2,
	weight: 30,
	focusCommand: { id: 'outline.focus' }
}], VIEW_CONTAINER);

// --- configurations

Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration).registerConfiguration({
	'id': 'outline',
	'order': 117,
	'title': localize('outlineConfigurationTitle', "Outline"),
	'type': 'object',
	'properties': {
		[OutlineConfigKeys.icons]: {
			'description': localize('outline.showIcons', "Render Outline elements with icons."),
			'type': 'boolean',
			'default': true
		},
		[OutlineConfigKeys.collapseItems]: {
			'description': localize('outline.initialState', "Controls whether Outline items are collapsed or expanded."),
			'type': 'string',
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			'enum': [
				'alwaysCollapse',
				'alwaysExpand'
			],
			'enumDescriptions': [
				localize('outline.initialState.collapsed', "Collapse all items."),
				localize('outline.initialState.expanded', "Expand all items.")
			],
			'default': 'alwaysExpand'
		},
		[OutlineConfigKeys.problemsEnabled]: {
			'markdownDescription': localize('outline.showProblem', "Show errors and warnings on Outline elements. Overwritten by {0} when it is off.", '`#problems.visibility#`'),
			'type': 'boolean',
			'default': true
		},
		[OutlineConfigKeys.problemsColors]: {
			'markdownDescription': localize('outline.problem.colors', "Use colors for errors and warnings on Outline elements. Overwritten by {0} when it is off.", '`#problems.visibility#`'),
			'type': 'boolean',
			'default': true
		},
		[OutlineConfigKeys.problemsBadges]: {
			'markdownDescription': localize('outline.problems.badges', "Use badges for errors and warnings on Outline elements. Overwritten by {0} when it is off.", '`#problems.visibility#`'),
			'type': 'boolean',
			'default': true
		},
		'outline.showFiles': {
			type: 'boolean',
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			default: true,
			markdownDescription: localize('filteredTypes.file', "When enabled, Outline shows `file`-symbols.")
		},
		'outline.showModules': {
			type: 'boolean',
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			default: true,
			markdownDescription: localize('filteredTypes.module', "When enabled, Outline shows `module`-symbols.")
		},
		'outline.showNamespaces': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.namespace', "When enabled, Outline shows `namespace`-symbols.")
		},
		'outline.showPackages': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.package', "When enabled, Outline shows `package`-symbols.")
		},
		'outline.showClasses': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.class', "When enabled, Outline shows `class`-symbols.")
		},
		'outline.showMethods': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.method', "When enabled, Outline shows `method`-symbols.")
		},
		'outline.showProperties': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.property', "When enabled, Outline shows `property`-symbols.")
		},
		'outline.showFields': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.field', "When enabled, Outline shows `field`-symbols.")
		},
		'outline.showConstructors': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.constructor', "When enabled, Outline shows `constructor`-symbols.")
		},
		'outline.showEnums': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.enum', "When enabled, Outline shows `enum`-symbols.")
		},
		'outline.showInterfaces': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.interface', "When enabled, Outline shows `interface`-symbols.")
		},
		'outline.showFunctions': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.function', "When enabled, Outline shows `function`-symbols.")
		},
		'outline.showVariables': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.variable', "When enabled, Outline shows `variable`-symbols.")
		},
		'outline.showConstants': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.constant', "When enabled, Outline shows `constant`-symbols.")
		},
		'outline.showStrings': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.string', "When enabled, Outline shows `string`-symbols.")
		},
		'outline.showNumbers': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.number', "When enabled, Outline shows `number`-symbols.")
		},
		'outline.showBooleans': {
			type: 'boolean',
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			default: true,
			markdownDescription: localize('filteredTypes.boolean', "When enabled, Outline shows `boolean`-symbols.")
		},
		'outline.showArrays': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.array', "When enabled, Outline shows `array`-symbols.")
		},
		'outline.showObjects': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.object', "When enabled, Outline shows `object`-symbols.")
		},
		'outline.showKeys': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.key', "When enabled, Outline shows `key`-symbols.")
		},
		'outline.showNull': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.null', "When enabled, Outline shows `null`-symbols.")
		},
		'outline.showEnumMembers': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.enumMember', "When enabled, Outline shows `enumMember`-symbols.")
		},
		'outline.showStructs': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.struct', "When enabled, Outline shows `struct`-symbols.")
		},
		'outline.showEvents': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.event', "When enabled, Outline shows `event`-symbols.")
		},
		'outline.showOperators': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.operator', "When enabled, Outline shows `operator`-symbols.")
		},
		'outline.showTypeParameters': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.typeParameter', "When enabled, Outline shows `typeParameter`-symbols.")
		}
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/outline/browser/outline.ts]---
Location: vscode-main/src/vs/workbench/contrib/outline/browser/outline.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import type { IView } from '../../../common/views.js';

export const enum OutlineSortOrder {
	ByPosition,
	ByName,
	ByKind
}

export interface IOutlineViewState {
	followCursor: boolean;
	filterOnType: boolean;
	sortBy: OutlineSortOrder;
}

export namespace IOutlinePane {
	export const Id = 'outline';
}

export interface IOutlinePane extends IView {
	outlineViewState: IOutlineViewState;
	collapseAll(): void;
	expandAll(): void;
}

// --- context keys

export const ctxFollowsCursor = new RawContextKey<boolean>('outlineFollowsCursor', false);
export const ctxFilterOnType = new RawContextKey<boolean>('outlineFiltersOnType', false);
export const ctxSortMode = new RawContextKey<OutlineSortOrder>('outlineSortMode', OutlineSortOrder.ByPosition);
export const ctxAllCollapsed = new RawContextKey<boolean>('outlineAllCollapsed', false);
export const ctxFocused = new RawContextKey<boolean>('outlineFocused', true);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/outline/browser/outlineActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/outline/browser/outlineActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { MenuId, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { ViewAction } from '../../../browser/parts/views/viewPane.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { ctxAllCollapsed, ctxFilterOnType, ctxFollowsCursor, ctxSortMode, IOutlinePane, OutlineSortOrder } from './outline.js';


// --- commands

registerAction2(class CollapseAll extends ViewAction<IOutlinePane> {
	constructor() {
		super({
			viewId: IOutlinePane.Id,
			id: 'outline.collapse',
			title: localize('collapse', "Collapse All"),
			f1: false,
			icon: Codicon.collapseAll,
			menu: {
				id: MenuId.ViewTitle,
				group: 'navigation',
				when: ContextKeyExpr.and(ContextKeyExpr.equals('view', IOutlinePane.Id), ctxAllCollapsed.isEqualTo(false))
			}
		});
	}
	runInView(_accessor: ServicesAccessor, view: IOutlinePane) {
		view.collapseAll();
	}
});

registerAction2(class ExpandAll extends ViewAction<IOutlinePane> {
	constructor() {
		super({
			viewId: IOutlinePane.Id,
			id: 'outline.expand',
			title: localize('expand', "Expand All"),
			f1: false,
			icon: Codicon.expandAll,
			menu: {
				id: MenuId.ViewTitle,
				group: 'navigation',
				when: ContextKeyExpr.and(ContextKeyExpr.equals('view', IOutlinePane.Id), ctxAllCollapsed.isEqualTo(true))
			}
		});
	}
	runInView(_accessor: ServicesAccessor, view: IOutlinePane) {
		view.expandAll();
	}
});

registerAction2(class FollowCursor extends ViewAction<IOutlinePane> {
	constructor() {
		super({
			viewId: IOutlinePane.Id,
			id: 'outline.followCursor',
			title: localize('followCur', "Follow Cursor"),
			f1: false,
			toggled: ctxFollowsCursor,
			menu: {
				id: MenuId.ViewTitle,
				group: 'config',
				order: 1,
				when: ContextKeyExpr.equals('view', IOutlinePane.Id)
			}
		});
	}
	runInView(_accessor: ServicesAccessor, view: IOutlinePane) {
		view.outlineViewState.followCursor = !view.outlineViewState.followCursor;
	}
});

registerAction2(class FilterOnType extends ViewAction<IOutlinePane> {
	constructor() {
		super({
			viewId: IOutlinePane.Id,
			id: 'outline.filterOnType',
			title: localize('filterOnType', "Filter on Type"),
			f1: false,
			toggled: ctxFilterOnType,
			menu: {
				id: MenuId.ViewTitle,
				group: 'config',
				order: 2,
				when: ContextKeyExpr.equals('view', IOutlinePane.Id)
			}
		});
	}
	runInView(_accessor: ServicesAccessor, view: IOutlinePane) {
		view.outlineViewState.filterOnType = !view.outlineViewState.filterOnType;
	}
});


registerAction2(class SortByPosition extends ViewAction<IOutlinePane> {
	constructor() {
		super({
			viewId: IOutlinePane.Id,
			id: 'outline.sortByPosition',
			title: localize('sortByPosition', "Sort By: Position"),
			f1: false,
			toggled: ctxSortMode.isEqualTo(OutlineSortOrder.ByPosition),
			menu: {
				id: MenuId.ViewTitle,
				group: 'sort',
				order: 1,
				when: ContextKeyExpr.equals('view', IOutlinePane.Id)
			}
		});
	}
	runInView(_accessor: ServicesAccessor, view: IOutlinePane) {
		view.outlineViewState.sortBy = OutlineSortOrder.ByPosition;
	}
});

registerAction2(class SortByName extends ViewAction<IOutlinePane> {
	constructor() {
		super({
			viewId: IOutlinePane.Id,
			id: 'outline.sortByName',
			title: localize('sortByName', "Sort By: Name"),
			f1: false,
			toggled: ctxSortMode.isEqualTo(OutlineSortOrder.ByName),
			menu: {
				id: MenuId.ViewTitle,
				group: 'sort',
				order: 2,
				when: ContextKeyExpr.equals('view', IOutlinePane.Id)
			}
		});
	}
	runInView(_accessor: ServicesAccessor, view: IOutlinePane) {
		view.outlineViewState.sortBy = OutlineSortOrder.ByName;
	}
});

registerAction2(class SortByKind extends ViewAction<IOutlinePane> {
	constructor() {
		super({
			viewId: IOutlinePane.Id,
			id: 'outline.sortByKind',
			title: localize('sortByKind', "Sort By: Category"),
			f1: false,
			toggled: ctxSortMode.isEqualTo(OutlineSortOrder.ByKind),
			menu: {
				id: MenuId.ViewTitle,
				group: 'sort',
				order: 3,
				when: ContextKeyExpr.equals('view', IOutlinePane.Id)
			}
		});
	}
	runInView(_accessor: ServicesAccessor, view: IOutlinePane) {
		view.outlineViewState.sortBy = OutlineSortOrder.ByKind;
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/outline/browser/outlinePane.css]---
Location: vscode-main/src/vs/workbench/contrib/outline/browser/outlinePane.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-workbench .outline-pane {
	display: flex;
	flex-direction: column;
}

.monaco-workbench .outline-pane .outline-progress {
	width: 100%;
	height: 2px;
	padding-bottom: 3px;
	position: absolute;
}

.monaco-workbench .outline-pane .outline-tree {
	height: 100%;
}

.monaco-workbench .outline-pane .outline-message {
	display: none;
	padding: 10px 22px 0 22px;
	opacity: 0.5;
	position: absolute;
	pointer-events: none;
}

.monaco-workbench .outline-pane.message .outline-message {
	display: inherit;
}

.monaco-workbench .outline-pane.message .outline-progress,
.monaco-workbench .outline-pane.message .outline-tree {
	display: none;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/outline/browser/outlinePane.ts]---
Location: vscode-main/src/vs/workbench/contrib/outline/browser/outlinePane.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './outlinePane.css';
import * as dom from '../../../../base/browser/dom.js';
import { ProgressBar } from '../../../../base/browser/ui/progressbar/progressbar.js';
import { TimeoutTimer, timeout } from '../../../../base/common/async.js';
import { IDisposable, toDisposable, DisposableStore, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { LRUCache } from '../../../../base/common/map.js';
import { localize } from '../../../../nls.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { WorkbenchDataTree } from '../../../../platform/list/browser/listService.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { ViewPane } from '../../../browser/parts/views/viewPane.js';
import { IViewletViewOptions } from '../../../browser/parts/views/viewsViewlet.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { FuzzyScore } from '../../../../base/common/filters.js';
import { basename } from '../../../../base/common/resources.js';
import { IViewDescriptorService } from '../../../common/views.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { OutlineViewState } from './outlineViewState.js';
import { IOutline, IOutlineComparator, IOutlineService, OutlineTarget } from '../../../services/outline/browser/outline.js';
import { EditorResourceAccessor, IEditorPane } from '../../../common/editor.js';
import { CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { Event } from '../../../../base/common/event.js';
import { ITreeSorter } from '../../../../base/browser/ui/tree/tree.js';
import { AbstractTreeViewState, IAbstractTreeViewState, TreeFindMode } from '../../../../base/browser/ui/tree/abstractTree.js';
import { URI } from '../../../../base/common/uri.js';
import { ctxAllCollapsed, ctxFilterOnType, ctxFocused, ctxFollowsCursor, ctxSortMode, IOutlinePane, OutlineSortOrder } from './outline.js';
import { defaultProgressBarStyles } from '../../../../platform/theme/browser/defaultStyles.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';

class OutlineTreeSorter<E> implements ITreeSorter<E> {

	constructor(
		private _comparator: IOutlineComparator<E>,
		public order: OutlineSortOrder
	) { }

	compare(a: E, b: E): number {
		if (this.order === OutlineSortOrder.ByKind) {
			return this._comparator.compareByType(a, b);
		} else if (this.order === OutlineSortOrder.ByName) {
			return this._comparator.compareByName(a, b);
		} else {
			return this._comparator.compareByPosition(a, b);
		}
	}
}

export class OutlinePane extends ViewPane implements IOutlinePane {

	static readonly Id = 'outline';

	private readonly _disposables = new DisposableStore();

	private readonly _editorControlDisposables = new DisposableStore();
	private readonly _editorPaneDisposables = new DisposableStore();
	private readonly _outlineViewState = new OutlineViewState();

	private readonly _editorListener = new MutableDisposable();

	private _domNode!: HTMLElement;
	private _message!: HTMLDivElement;
	private _progressBar!: ProgressBar;
	private _treeContainer!: HTMLElement;
	private _tree?: WorkbenchDataTree<IOutline<unknown> | undefined, unknown, FuzzyScore>;
	private _treeDimensions?: dom.Dimension;
	private _treeStates = new LRUCache<string, IAbstractTreeViewState>(10);

	private _ctxFollowsCursor!: IContextKey<boolean>;
	private _ctxFilterOnType!: IContextKey<boolean>;
	private _ctxSortMode!: IContextKey<OutlineSortOrder>;
	private _ctxAllCollapsed!: IContextKey<boolean>;

	constructor(
		options: IViewletViewOptions,
		@IOutlineService private readonly _outlineService: IOutlineService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@IStorageService private readonly _storageService: IStorageService,
		@IEditorService private readonly _editorService: IEditorService,
		@IConfigurationService configurationService: IConfigurationService,
		@IKeybindingService keybindingService: IKeybindingService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IOpenerService openerService: IOpenerService,
		@IThemeService themeService: IThemeService,
		@IHoverService hoverService: IHoverService,
	) {
		super(options, keybindingService, contextMenuService, configurationService, contextKeyService, viewDescriptorService, _instantiationService, openerService, themeService, hoverService);
		this._outlineViewState.restore(this._storageService);
		this._disposables.add(this._outlineViewState);

		contextKeyService.bufferChangeEvents(() => {
			this._ctxFollowsCursor = ctxFollowsCursor.bindTo(contextKeyService);
			this._ctxFilterOnType = ctxFilterOnType.bindTo(contextKeyService);
			this._ctxSortMode = ctxSortMode.bindTo(contextKeyService);
			this._ctxAllCollapsed = ctxAllCollapsed.bindTo(contextKeyService);
		});

		const updateContext = () => {
			this._ctxFollowsCursor.set(this._outlineViewState.followCursor);
			this._ctxFilterOnType.set(this._outlineViewState.filterOnType);
			this._ctxSortMode.set(this._outlineViewState.sortBy);
		};
		updateContext();
		this._disposables.add(this._outlineViewState.onDidChange(updateContext));
	}

	override dispose(): void {
		this._disposables.dispose();
		this._editorPaneDisposables.dispose();
		this._editorControlDisposables.dispose();
		this._editorListener.dispose();
		super.dispose();
	}

	override focus(): void {
		this._editorControlChangePromise.then(() => {
			super.focus();
			this._tree?.domFocus();
		});
	}

	protected override renderBody(container: HTMLElement): void {
		super.renderBody(container);

		this._domNode = container;
		container.classList.add('outline-pane');

		const progressContainer = dom.$('.outline-progress');
		this._message = dom.$('.outline-message');

		this._progressBar = new ProgressBar(progressContainer, defaultProgressBarStyles);

		this._treeContainer = dom.$('.outline-tree');
		dom.append(container, progressContainer, this._message, this._treeContainer);

		this._disposables.add(this.onDidChangeBodyVisibility(visible => {
			if (!visible) {
				// stop everything when not visible
				this._editorListener.clear();
				this._editorPaneDisposables.clear();
				this._editorControlDisposables.clear();

			} else if (!this._editorListener.value) {
				const event = Event.any(this._editorService.onDidActiveEditorChange, this._outlineService.onDidChange);
				this._editorListener.value = event(() => this._handleEditorChanged(this._editorService.activeEditorPane));
				this._handleEditorChanged(this._editorService.activeEditorPane);
			}
		}));
	}

	protected override layoutBody(height: number, width: number): void {
		super.layoutBody(height, width);
		this._tree?.layout(height, width);
		this._treeDimensions = new dom.Dimension(width, height);
	}

	collapseAll(): void {
		this._tree?.collapseAll();
	}

	expandAll(): void {
		this._tree?.expandAll();
	}

	get outlineViewState() {
		return this._outlineViewState;
	}

	private _showMessage(message: string) {
		this._domNode.classList.add('message');
		this._progressBar.stop().hide();
		this._message.textContent = message;
	}

	private _captureViewState(uri?: URI): boolean {
		if (this._tree) {
			const oldOutline = this._tree.getInput();
			if (!uri) {
				uri = oldOutline?.uri;
			}
			if (oldOutline && uri) {
				this._treeStates.set(`${oldOutline.outlineKind}/${uri}`, this._tree.getViewState());
				return true;
			}
		}
		return false;
	}

	private _editorControlChangePromise: Promise<void> = Promise.resolve();
	private _handleEditorChanged(pane: IEditorPane | undefined): void {
		this._editorPaneDisposables.clear();

		if (pane) {
			// react to control changes from within pane (https://github.com/microsoft/vscode/issues/134008)
			this._editorPaneDisposables.add(pane.onDidChangeControl(() => {
				this._editorControlChangePromise = this._handleEditorControlChanged(pane);
			}));
		}

		this._editorControlChangePromise = this._handleEditorControlChanged(pane);
	}

	private async _handleEditorControlChanged(pane: IEditorPane | undefined): Promise<void> {

		// persist state
		const resource = EditorResourceAccessor.getOriginalUri(pane?.input);
		const didCapture = this._captureViewState();

		this._editorControlDisposables.clear();

		if (!pane || !this._outlineService.canCreateOutline(pane) || !resource) {
			return this._showMessage(localize('no-editor', "The active editor cannot provide outline information."));
		}

		let loadingMessage: IDisposable | undefined;
		if (!didCapture) {
			loadingMessage = new TimeoutTimer(() => {
				this._showMessage(localize('loading', "Loading document symbols for '{0}'...", basename(resource)));
			}, 100);
		}

		this._progressBar.infinite().show(500);

		const cts = new CancellationTokenSource();
		this._editorControlDisposables.add(toDisposable(() => cts.dispose(true)));

		const newOutline = await this._outlineService.createOutline(pane, OutlineTarget.OutlinePane, cts.token);
		loadingMessage?.dispose();

		if (!newOutline) {
			return;
		}

		if (cts.token.isCancellationRequested) {
			newOutline?.dispose();
			return;
		}

		this._editorControlDisposables.add(newOutline);
		this._progressBar.stop().hide();

		const sorter = new OutlineTreeSorter(newOutline.config.comparator, this._outlineViewState.sortBy);

		const tree = this._instantiationService.createInstance(
			WorkbenchDataTree<IOutline<unknown> | undefined, unknown, FuzzyScore>,
			'OutlinePane',
			this._treeContainer,
			newOutline.config.delegate,
			newOutline.config.renderers,
			newOutline.config.treeDataSource,
			{
				...newOutline.config.options,
				sorter,
				expandOnDoubleClick: false,
				expandOnlyOnTwistieClick: true,
				multipleSelectionSupport: false,
				hideTwistiesOfChildlessElements: true,
				defaultFindMode: this._outlineViewState.filterOnType ? TreeFindMode.Filter : TreeFindMode.Highlight,
				overrideStyles: this.getLocationBasedColors().listOverrideStyles
			}
		);

		ctxFocused.bindTo(tree.contextKeyService);

		// update tree, listen to changes
		const updateTree = () => {
			if (newOutline.isEmpty) {
				// no more elements
				this._showMessage(localize('no-symbols', "No symbols found in document '{0}'", basename(resource)));
				this._captureViewState(resource);
				tree.setInput(undefined);

			} else if (!tree.getInput()) {
				// first: init tree
				this._domNode.classList.remove('message');
				const state = this._treeStates.get(`${newOutline.outlineKind}/${newOutline.uri}`);
				tree.setInput(newOutline, state && AbstractTreeViewState.lift(state));

			} else {
				// update: refresh tree
				this._domNode.classList.remove('message');
				tree.updateChildren();
			}
		};
		updateTree();
		this._editorControlDisposables.add(newOutline.onDidChange(updateTree));

		// feature: apply panel background to tree
		this._editorControlDisposables.add(this.viewDescriptorService.onDidChangeLocation(({ views }) => {
			if (views.some(v => v.id === this.id)) {
				tree.updateOptions({ overrideStyles: this.getLocationBasedColors().listOverrideStyles });
			}
		}));

		// feature: filter on type - keep tree and menu in sync
		this._editorControlDisposables.add(tree.onDidChangeFindMode(mode => this._outlineViewState.filterOnType = mode === TreeFindMode.Filter));

		// feature: reveal outline selection in editor
		// on change -> reveal/select defining range
		let idPool = 0;
		this._editorControlDisposables.add(tree.onDidOpen(async e => {
			const myId = ++idPool;
			const isDoubleClick = e.browserEvent?.type === 'dblclick';
			if (!isDoubleClick) {
				// workaround for https://github.com/microsoft/vscode/issues/206424
				await timeout(150);
				if (myId !== idPool) {
					return;
				}
			}
			await newOutline.reveal(e.element, e.editorOptions, e.sideBySide, isDoubleClick);
		}));
		// feature: reveal editor selection in outline
		const revealActiveElement = () => {
			if (!this._outlineViewState.followCursor || !newOutline.activeElement) {
				return;
			}
			let item = newOutline.activeElement;
			while (item) {
				const top = tree.getRelativeTop(item);
				if (top === null) {
					// not visible -> reveal
					tree.reveal(item, 0.5);
				}
				if (tree.getRelativeTop(item) !== null) {
					tree.setFocus([item]);
					tree.setSelection([item]);
					break;
				}
				// STILL not visible -> try parent
				item = tree.getParentElement(item);
			}
		};
		revealActiveElement();
		this._editorControlDisposables.add(newOutline.onDidChange(revealActiveElement));

		// feature: update view when user state changes
		this._editorControlDisposables.add(this._outlineViewState.onDidChange((e: { followCursor?: boolean; sortBy?: boolean; filterOnType?: boolean }) => {
			this._outlineViewState.persist(this._storageService);
			if (e.filterOnType) {
				tree.findMode = this._outlineViewState.filterOnType ? TreeFindMode.Filter : TreeFindMode.Highlight;
			}
			if (e.followCursor) {
				revealActiveElement();
			}
			if (e.sortBy) {
				sorter.order = this._outlineViewState.sortBy;
				tree.resort();
			}
		}));

		// feature: expand all nodes when filtering (not when finding)
		let viewState: AbstractTreeViewState | undefined;
		this._editorControlDisposables.add(tree.onDidChangeFindPattern(pattern => {
			if (tree.findMode === TreeFindMode.Highlight) {
				return;
			}
			if (!viewState && pattern) {
				viewState = tree.getViewState();
				tree.expandAll();
			} else if (!pattern && viewState) {
				tree.setInput(tree.getInput()!, viewState);
				viewState = undefined;
			}
		}));

		// feature: update all-collapsed context key
		const updateAllCollapsedCtx = () => {
			this._ctxAllCollapsed.set(tree.getNode(null).children.every(node => !node.collapsible || node.collapsed));
		};
		this._editorControlDisposables.add(tree.onDidChangeCollapseState(updateAllCollapsedCtx));
		this._editorControlDisposables.add(tree.onDidChangeModel(updateAllCollapsedCtx));
		updateAllCollapsedCtx();

		// last: set tree property and wire it up to one of our context keys
		tree.layout(this._treeDimensions?.height, this._treeDimensions?.width);
		this._tree = tree;
		this._editorControlDisposables.add(toDisposable(() => {
			tree.dispose();
			this._tree = undefined;
		}));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/outline/browser/outlineViewState.ts]---
Location: vscode-main/src/vs/workbench/contrib/outline/browser/outlineViewState.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../../base/common/event.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IOutlineViewState, OutlineSortOrder } from './outline.js';

export class OutlineViewState implements IOutlineViewState {

	private _followCursor = false;
	private _filterOnType = true;
	private _sortBy = OutlineSortOrder.ByPosition;

	private readonly _onDidChange = new Emitter<{ followCursor?: boolean; sortBy?: boolean; filterOnType?: boolean }>();
	readonly onDidChange = this._onDidChange.event;

	dispose(): void {
		this._onDidChange.dispose();
	}

	set followCursor(value: boolean) {
		if (value !== this._followCursor) {
			this._followCursor = value;
			this._onDidChange.fire({ followCursor: true });
		}
	}

	get followCursor(): boolean {
		return this._followCursor;
	}

	get filterOnType() {
		return this._filterOnType;
	}

	set filterOnType(value) {
		if (value !== this._filterOnType) {
			this._filterOnType = value;
			this._onDidChange.fire({ filterOnType: true });
		}
	}

	set sortBy(value: OutlineSortOrder) {
		if (value !== this._sortBy) {
			this._sortBy = value;
			this._onDidChange.fire({ sortBy: true });
		}
	}

	get sortBy(): OutlineSortOrder {
		return this._sortBy;
	}

	persist(storageService: IStorageService): void {
		storageService.store('outline/state', JSON.stringify({
			followCursor: this.followCursor,
			sortBy: this.sortBy,
			filterOnType: this.filterOnType,
		}), StorageScope.WORKSPACE, StorageTarget.MACHINE);
	}

	restore(storageService: IStorageService): void {
		const raw = storageService.get('outline/state', StorageScope.WORKSPACE);
		if (!raw) {
			return;
		}
		let data;
		try {
			data = JSON.parse(raw);
		} catch (e) {
			return;
		}
		this.followCursor = data.followCursor;
		this.sortBy = data.sortBy ?? OutlineSortOrder.ByPosition;
		if (typeof data.filterOnType === 'boolean') {
			this.filterOnType = data.filterOnType;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/output/browser/output.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/output/browser/output.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { KeyMod, KeyChord, KeyCode } from '../../../../base/common/keyCodes.js';
import { ModesRegistry } from '../../../../editor/common/languages/modesRegistry.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { MenuId, registerAction2, Action2, MenuRegistry } from '../../../../platform/actions/common/actions.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { OutputService } from './outputServices.js';
import { OUTPUT_MODE_ID, OUTPUT_MIME, OUTPUT_VIEW_ID, IOutputService, CONTEXT_IN_OUTPUT, LOG_MODE_ID, LOG_MIME, CONTEXT_OUTPUT_SCROLL_LOCK, IOutputChannelDescriptor, ACTIVE_OUTPUT_CHANNEL_CONTEXT, CONTEXT_ACTIVE_OUTPUT_LEVEL_SETTABLE, IOutputChannelRegistry, Extensions, CONTEXT_ACTIVE_OUTPUT_LEVEL, CONTEXT_ACTIVE_OUTPUT_LEVEL_IS_DEFAULT, SHOW_INFO_FILTER_CONTEXT, SHOW_TRACE_FILTER_CONTEXT, SHOW_DEBUG_FILTER_CONTEXT, SHOW_ERROR_FILTER_CONTEXT, SHOW_WARNING_FILTER_CONTEXT, OUTPUT_FILTER_FOCUS_CONTEXT, CONTEXT_ACTIVE_LOG_FILE_OUTPUT, isSingleSourceOutputChannelDescriptor } from '../../../services/output/common/output.js';
import { OutputViewPane } from './outputView.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { IWorkbenchContributionsRegistry, Extensions as WorkbenchExtensions, IWorkbenchContribution } from '../../../common/contributions.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { ViewContainer, IViewContainersRegistry, ViewContainerLocation, Extensions as ViewContainerExtensions, IViewsRegistry } from '../../../common/views.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { ViewPaneContainer } from '../../../browser/parts/views/viewPaneContainer.js';
import { IConfigurationRegistry, Extensions as ConfigurationExtensions, ConfigurationScope } from '../../../../platform/configuration/common/configurationRegistry.js';
import { IQuickPickItem, IQuickInputService, IQuickPickSeparator, QuickPickInput } from '../../../../platform/quickinput/common/quickInput.js';
import { AUX_WINDOW_GROUP, AUX_WINDOW_GROUP_TYPE, IEditorService } from '../../../services/editor/common/editorService.js';
import { ContextKeyExpr, ContextKeyExpression } from '../../../../platform/contextkey/common/contextkey.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { Disposable, dispose, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { AccessibilitySignal, IAccessibilitySignalService } from '../../../../platform/accessibilitySignal/browser/accessibilitySignalService.js';
import { ILoggerService, LogLevel, LogLevelToLocalizedString, LogLevelToString } from '../../../../platform/log/common/log.js';
import { IDefaultLogLevelsService } from '../../logs/common/defaultLogLevels.js';
import { KeybindingsRegistry, KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { EditorContextKeys } from '../../../../editor/common/editorContextKeys.js';
import { CONTEXT_ACCESSIBILITY_MODE_ENABLED } from '../../../../platform/accessibility/common/accessibility.js';
import { IsWindowsContext } from '../../../../platform/contextkey/common/contextkeys.js';
import { FocusedViewContext } from '../../../common/contextkeys.js';
import { localize, localize2 } from '../../../../nls.js';
import { viewFilterSubmenu } from '../../../browser/parts/views/viewFilter.js';
import { ViewAction } from '../../../browser/parts/views/viewPane.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { IFileDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { basename } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { hasKey } from '../../../../base/common/types.js';

const IMPORTED_LOG_ID_PREFIX = 'importedLog.';

// Register Service
registerSingleton(IOutputService, OutputService, InstantiationType.Delayed);

// Register Output Mode
ModesRegistry.registerLanguage({
	id: OUTPUT_MODE_ID,
	extensions: [],
	mimetypes: [OUTPUT_MIME]
});

// Register Log Output Mode
ModesRegistry.registerLanguage({
	id: LOG_MODE_ID,
	extensions: [],
	mimetypes: [LOG_MIME]
});

// register output container
const outputViewIcon = registerIcon('output-view-icon', Codicon.output, nls.localize('outputViewIcon', 'View icon of the output view.'));
const VIEW_CONTAINER: ViewContainer = Registry.as<IViewContainersRegistry>(ViewContainerExtensions.ViewContainersRegistry).registerViewContainer({
	id: OUTPUT_VIEW_ID,
	title: nls.localize2('output', "Output"),
	icon: outputViewIcon,
	order: 1,
	ctorDescriptor: new SyncDescriptor(ViewPaneContainer, [OUTPUT_VIEW_ID, { mergeViewWithContainerWhenSingleView: true }]),
	storageId: OUTPUT_VIEW_ID,
	hideIfEmpty: true,
}, ViewContainerLocation.Panel, { doNotRegisterOpenCommand: true });

Registry.as<IViewsRegistry>(ViewContainerExtensions.ViewsRegistry).registerViews([{
	id: OUTPUT_VIEW_ID,
	name: nls.localize2('output', "Output"),
	containerIcon: outputViewIcon,
	canMoveView: true,
	canToggleVisibility: true,
	ctorDescriptor: new SyncDescriptor(OutputViewPane),
	openCommandActionDescriptor: {
		id: 'workbench.action.output.toggleOutput',
		mnemonicTitle: nls.localize({ key: 'miToggleOutput', comment: ['&& denotes a mnemonic'] }, "&&Output"),
		keybindings: {
			primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyU,
			linux: {
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.KeyH)  // On Ubuntu Ctrl+Shift+U is taken by some global OS command
			}
		},
		order: 1,
	}
}], VIEW_CONTAINER);

class OutputContribution extends Disposable implements IWorkbenchContribution {
	constructor(
		@IOutputService private readonly outputService: IOutputService,
		@IEditorService private readonly editorService: IEditorService,
	) {
		super();
		this.registerActions();
	}

	private registerActions(): void {
		this.registerSwitchOutputAction();
		this.registerAddCompoundLogAction();
		this.registerRemoveLogAction();
		this.registerShowOutputChannelsAction();
		this.registerClearOutputAction();
		this.registerToggleAutoScrollAction();
		this.registerOpenActiveOutputFileAction();
		this.registerOpenActiveOutputFileInAuxWindowAction();
		this.registerSaveActiveOutputAsAction();
		this.registerShowLogsAction();
		this.registerOpenLogFileAction();
		this.registerConfigureActiveOutputLogLevelAction();
		this.registerLogLevelFilterActions();
		this.registerClearFilterActions();
		this.registerExportLogsAction();
		this.registerImportLogAction();
	}

	private registerSwitchOutputAction(): void {
		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: `workbench.output.action.switchBetweenOutputs`,
					title: nls.localize('switchBetweenOutputs.label', "Switch Output"),
				});
			}
			async run(accessor: ServicesAccessor, channelId: string): Promise<void> {
				if (channelId) {
					accessor.get(IOutputService).showChannel(channelId, true);
				}
			}
		}));
		const switchOutputMenu = new MenuId('workbench.output.menu.switchOutput');
		this._register(MenuRegistry.appendMenuItem(MenuId.ViewTitle, {
			submenu: switchOutputMenu,
			title: nls.localize('switchToOutput.label', "Switch Output"),
			group: 'navigation',
			when: ContextKeyExpr.equals('view', OUTPUT_VIEW_ID),
			order: 1,
			isSelection: true
		}));
		const registeredChannels = new Map<string, IDisposable>();
		this._register(toDisposable(() => dispose(registeredChannels.values())));
		const registerOutputChannels = (channels: IOutputChannelDescriptor[]) => {
			for (const channel of channels) {
				const title = channel.label;
				const group = channel.user ? '2_user_outputchannels' : channel.extensionId ? '0_ext_outputchannels' : '1_core_outputchannels';
				registeredChannels.set(channel.id, registerAction2(class extends Action2 {
					constructor() {
						super({
							id: `workbench.action.output.show.${channel.id}`,
							title,
							toggled: ACTIVE_OUTPUT_CHANNEL_CONTEXT.isEqualTo(channel.id),
							menu: {
								id: switchOutputMenu,
								group,
							}
						});
					}
					async run(accessor: ServicesAccessor): Promise<void> {
						return accessor.get(IOutputService).showChannel(channel.id, true);
					}
				}));
			}
		};
		registerOutputChannels(this.outputService.getChannelDescriptors());
		const outputChannelRegistry = Registry.as<IOutputChannelRegistry>(Extensions.OutputChannels);
		this._register(outputChannelRegistry.onDidRegisterChannel(e => {
			const channel = this.outputService.getChannelDescriptor(e);
			if (channel) {
				registerOutputChannels([channel]);
			}
		}));
		this._register(outputChannelRegistry.onDidRemoveChannel(e => {
			registeredChannels.get(e.id)?.dispose();
			registeredChannels.delete(e.id);
		}));
	}

	private registerAddCompoundLogAction(): void {
		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: 'workbench.action.output.addCompoundLog',
					title: nls.localize2('addCompoundLog', "Add Compound Log..."),
					category: nls.localize2('output', "Output"),
					f1: true,
					menu: [{
						id: MenuId.ViewTitle,
						when: ContextKeyExpr.equals('view', OUTPUT_VIEW_ID),
						group: '2_add',
					}],
				});
			}
			async run(accessor: ServicesAccessor): Promise<void> {
				const outputService = accessor.get(IOutputService);
				const quickInputService = accessor.get(IQuickInputService);

				const extensionLogs: IOutputChannelDescriptor[] = [], logs: IOutputChannelDescriptor[] = [];
				for (const channel of outputService.getChannelDescriptors()) {
					if (channel.log && !channel.user) {
						if (channel.extensionId) {
							extensionLogs.push(channel);
						} else {
							logs.push(channel);
						}
					}
				}
				const entries: Array<IOutputChannelDescriptor | IQuickPickSeparator> = [];
				for (const log of logs.sort((a, b) => a.label.localeCompare(b.label))) {
					entries.push(log);
				}
				if (extensionLogs.length && logs.length) {
					entries.push({ type: 'separator', label: nls.localize('extensionLogs', "Extension Logs") });
				}
				for (const log of extensionLogs.sort((a, b) => a.label.localeCompare(b.label))) {
					entries.push(log);
				}
				const result = await quickInputService.pick(entries, { placeHolder: nls.localize('selectlog', "Select Log"), canPickMany: true });
				if (result?.length) {
					outputService.showChannel(outputService.registerCompoundLogChannel(result));
				}
			}
		}));
	}

	private registerRemoveLogAction(): void {
		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: 'workbench.action.output.remove',
					title: nls.localize2('removeLog', "Remove Output..."),
					category: nls.localize2('output', "Output"),
					f1: true
				});
			}
			async run(accessor: ServicesAccessor): Promise<void> {
				const outputService = accessor.get(IOutputService);
				const quickInputService = accessor.get(IQuickInputService);
				const notificationService = accessor.get(INotificationService);
				const entries: Array<IOutputChannelDescriptor> = outputService.getChannelDescriptors().filter(channel => channel.user);
				if (entries.length === 0) {
					notificationService.info(nls.localize('nocustumoutput', "No custom outputs to remove."));
					return;
				}
				const result = await quickInputService.pick(entries, { placeHolder: nls.localize('selectlog', "Select Log"), canPickMany: true });
				if (!result?.length) {
					return;
				}
				const outputChannelRegistry = Registry.as<IOutputChannelRegistry>(Extensions.OutputChannels);
				for (const channel of result) {
					outputChannelRegistry.removeChannel(channel.id);
				}
			}
		}));
	}

	private registerShowOutputChannelsAction(): void {
		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: 'workbench.action.showOutputChannels',
					title: nls.localize2('showOutputChannels', "Show Output Channels..."),
					category: nls.localize2('output', "Output"),
					f1: true
				});
			}
			async run(accessor: ServicesAccessor): Promise<void> {
				const outputService = accessor.get(IOutputService);
				const quickInputService = accessor.get(IQuickInputService);
				const extensionChannels = [], coreChannels = [];
				for (const channel of outputService.getChannelDescriptors()) {
					if (channel.extensionId) {
						extensionChannels.push(channel);
					} else {
						coreChannels.push(channel);
					}
				}
				const entries: ({ id: string; label: string } | IQuickPickSeparator)[] = [];
				for (const { id, label } of extensionChannels) {
					entries.push({ id, label });
				}
				if (extensionChannels.length && coreChannels.length) {
					entries.push({ type: 'separator' });
				}
				for (const { id, label } of coreChannels) {
					entries.push({ id, label });
				}
				const entry = await quickInputService.pick(entries, { placeHolder: nls.localize('selectOutput', "Select Output Channel") });
				if (entry) {
					return outputService.showChannel(entry.id);
				}
			}
		}));
	}

	private registerClearOutputAction(): void {
		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: `workbench.output.action.clearOutput`,
					title: nls.localize2('clearOutput.label', "Clear Output"),
					category: Categories.View,
					menu: [{
						id: MenuId.ViewTitle,
						when: ContextKeyExpr.equals('view', OUTPUT_VIEW_ID),
						group: 'navigation',
						order: 2
					}, {
						id: MenuId.CommandPalette
					}, {
						id: MenuId.EditorContext,
						when: CONTEXT_IN_OUTPUT
					}],
					icon: Codicon.clearAll
				});
			}
			async run(accessor: ServicesAccessor): Promise<void> {
				const outputService = accessor.get(IOutputService);
				const accessibilitySignalService = accessor.get(IAccessibilitySignalService);
				const activeChannel = outputService.getActiveChannel();
				if (activeChannel) {
					activeChannel.clear();
					accessibilitySignalService.playSignal(AccessibilitySignal.clear);
				}
			}
		}));
	}

	private registerToggleAutoScrollAction(): void {
		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: `workbench.output.action.toggleAutoScroll`,
					title: nls.localize2('toggleAutoScroll', "Toggle Auto Scrolling"),
					tooltip: nls.localize('outputScrollOff', "Turn Auto Scrolling Off"),
					menu: {
						id: MenuId.ViewTitle,
						when: ContextKeyExpr.and(ContextKeyExpr.equals('view', OUTPUT_VIEW_ID)),
						group: 'navigation',
						order: 3,
					},
					icon: Codicon.lock,
					toggled: {
						condition: CONTEXT_OUTPUT_SCROLL_LOCK,
						icon: Codicon.unlock,
						tooltip: nls.localize('outputScrollOn', "Turn Auto Scrolling On")
					}
				});
			}
			async run(accessor: ServicesAccessor): Promise<void> {
				const outputView = accessor.get(IViewsService).getActiveViewWithId<OutputViewPane>(OUTPUT_VIEW_ID)!;
				outputView.scrollLock = !outputView.scrollLock;
			}
		}));
	}

	private registerOpenActiveOutputFileAction(): void {
		const that = this;
		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: `workbench.action.openActiveLogOutputFile`,
					title: nls.localize2('openActiveOutputFile', "Open Output in Editor"),
					menu: [{
						id: MenuId.ViewTitle,
						when: ContextKeyExpr.equals('view', OUTPUT_VIEW_ID),
						group: 'navigation',
						order: 4,
						isHiddenByDefault: true
					}],
					icon: Codicon.goToFile,
				});
			}
			async run(): Promise<void> {
				that.openActiveOutput();
			}
		}));
	}

	private registerOpenActiveOutputFileInAuxWindowAction(): void {
		const that = this;
		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: `workbench.action.openActiveLogOutputFileInNewWindow`,
					title: nls.localize2('openActiveOutputFileInNewWindow', "Open Output in New Window"),
					menu: [{
						id: MenuId.ViewTitle,
						when: ContextKeyExpr.equals('view', OUTPUT_VIEW_ID),
						group: 'navigation',
						order: 5,
						isHiddenByDefault: true
					}],
					icon: Codicon.emptyWindow,
				});
			}
			async run(): Promise<void> {
				that.openActiveOutput(AUX_WINDOW_GROUP);
			}
		}));
	}

	private registerSaveActiveOutputAsAction(): void {
		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: `workbench.action.saveActiveLogOutputAs`,
					title: nls.localize2('saveActiveOutputAs', "Save Output As..."),
					menu: [{
						id: MenuId.ViewTitle,
						when: ContextKeyExpr.equals('view', OUTPUT_VIEW_ID),
						group: '1_export',
						order: 1
					}],
				});
			}
			async run(accessor: ServicesAccessor): Promise<void> {
				const outputService = accessor.get(IOutputService);
				const channel = outputService.getActiveChannel();
				if (channel) {
					const descriptor = outputService.getChannelDescriptors().find(c => c.id === channel.id);
					if (descriptor) {
						await outputService.saveOutputAs(undefined, descriptor);
					}
				}
			}
		}));
	}

	private async openActiveOutput(group?: AUX_WINDOW_GROUP_TYPE): Promise<void> {
		const channel = this.outputService.getActiveChannel();
		if (channel) {
			await this.editorService.openEditor({
				resource: channel.uri,
				options: {
					pinned: true,
				},
			}, group);
		}
	}

	private registerConfigureActiveOutputLogLevelAction(): void {
		const logLevelMenu = new MenuId('workbench.output.menu.logLevel');
		this._register(MenuRegistry.appendMenuItem(MenuId.ViewTitle, {
			submenu: logLevelMenu,
			title: nls.localize('logLevel.label', "Set Log Level..."),
			group: 'navigation',
			when: ContextKeyExpr.and(ContextKeyExpr.equals('view', OUTPUT_VIEW_ID), CONTEXT_ACTIVE_OUTPUT_LEVEL_SETTABLE),
			icon: Codicon.gear,
			order: 6
		}));

		let order = 0;
		const registerLogLevel = (logLevel: LogLevel) => {
			this._register(registerAction2(class extends Action2 {
				constructor() {
					super({
						id: `workbench.action.output.activeOutputLogLevel.${logLevel}`,
						title: LogLevelToLocalizedString(logLevel).value,
						toggled: CONTEXT_ACTIVE_OUTPUT_LEVEL.isEqualTo(LogLevelToString(logLevel)),
						menu: {
							id: logLevelMenu,
							order: order++,
							group: '0_level'
						}
					});
				}
				async run(accessor: ServicesAccessor): Promise<void> {
					const outputService = accessor.get(IOutputService);
					const channel = outputService.getActiveChannel();
					if (channel) {
						const channelDescriptor = outputService.getChannelDescriptor(channel.id);
						if (channelDescriptor) {
							outputService.setLogLevel(channelDescriptor, logLevel);
						}
					}
				}
			}));
		};

		registerLogLevel(LogLevel.Trace);
		registerLogLevel(LogLevel.Debug);
		registerLogLevel(LogLevel.Info);
		registerLogLevel(LogLevel.Warning);
		registerLogLevel(LogLevel.Error);
		registerLogLevel(LogLevel.Off);

		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: `workbench.action.output.activeOutputLogLevelDefault`,
					title: nls.localize('logLevelDefault.label', "Set As Default"),
					menu: {
						id: logLevelMenu,
						order,
						group: '1_default'
					},
					precondition: CONTEXT_ACTIVE_OUTPUT_LEVEL_IS_DEFAULT.negate()
				});
			}
			async run(accessor: ServicesAccessor): Promise<void> {
				const outputService = accessor.get(IOutputService);
				const loggerService = accessor.get(ILoggerService);
				const defaultLogLevelsService = accessor.get(IDefaultLogLevelsService);
				const channel = outputService.getActiveChannel();
				if (channel) {
					const channelDescriptor = outputService.getChannelDescriptor(channel.id);
					if (channelDescriptor && isSingleSourceOutputChannelDescriptor(channelDescriptor)) {
						const logLevel = loggerService.getLogLevel(channelDescriptor.source.resource);
						return await defaultLogLevelsService.setDefaultLogLevel(logLevel, channelDescriptor.extensionId);
					}
				}
			}
		}));
	}

	private registerShowLogsAction(): void {
		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: 'workbench.action.showLogs',
					title: nls.localize2('showLogs', "Show Logs..."),
					category: Categories.Developer,
					menu: {
						id: MenuId.CommandPalette,
					},
				});
			}
			async run(accessor: ServicesAccessor): Promise<void> {
				const outputService = accessor.get(IOutputService);
				const quickInputService = accessor.get(IQuickInputService);
				const extensionLogs = [], logs = [];
				for (const channel of outputService.getChannelDescriptors()) {
					if (channel.log) {
						if (channel.extensionId) {
							extensionLogs.push(channel);
						} else {
							logs.push(channel);
						}
					}
				}
				const entries: ({ id: string; label: string } | IQuickPickSeparator)[] = [];
				for (const { id, label } of logs) {
					entries.push({ id, label });
				}
				if (extensionLogs.length && logs.length) {
					entries.push({ type: 'separator', label: nls.localize('extensionLogs', "Extension Logs") });
				}
				for (const { id, label } of extensionLogs) {
					entries.push({ id, label });
				}
				const entry = await quickInputService.pick(entries, { placeHolder: nls.localize('selectlog', "Select Log") });
				if (entry) {
					return outputService.showChannel(entry.id);
				}
			}
		}));
	}

	private registerOpenLogFileAction(): void {
		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: 'workbench.action.openLogFile',
					title: nls.localize2('openLogFile', "Open Log..."),
					category: Categories.Developer,
					menu: {
						id: MenuId.CommandPalette,
					},
					metadata: {
						description: 'workbench.action.openLogFile',
						args: [{
							name: 'logFile',
							schema: {
								markdownDescription: nls.localize('logFile', "The id of the log file to open, for example `\"window\"`. Currently the best way to get this is to get the ID by checking the `workbench.action.output.show.<id>` commands"),
								type: 'string'
							}
						}]
					},
				});
			}
			async run(accessor: ServicesAccessor, args?: unknown): Promise<void> {
				const outputService = accessor.get(IOutputService);
				const quickInputService = accessor.get(IQuickInputService);
				const editorService = accessor.get(IEditorService);
				let entry: IQuickPickItem | undefined;
				const argName = args && typeof args === 'string' ? args : undefined;
				const extensionChannels: IQuickPickItem[] = [];
				const coreChannels: IQuickPickItem[] = [];
				for (const c of outputService.getChannelDescriptors()) {
					if (c.log) {
						const e = { id: c.id, label: c.label };
						if (c.extensionId) {
							extensionChannels.push(e);
						} else {
							coreChannels.push(e);
						}
						if (e.id === argName) {
							entry = e;
						}
					}
				}
				if (!entry) {
					const entries: QuickPickInput[] = [...extensionChannels.sort((a, b) => a.label.localeCompare(b.label))];
					if (entries.length && coreChannels.length) {
						entries.push({ type: 'separator' });
						entries.push(...coreChannels.sort((a, b) => a.label.localeCompare(b.label)));
					}
					entry = <IQuickPickItem | undefined>await quickInputService.pick(entries, { placeHolder: nls.localize('selectlogFile', "Select Log File") });
				}
				if (entry?.id) {
					const channel = outputService.getChannel(entry.id);
					if (channel) {
						await editorService.openEditor({
							resource: channel.uri,
							options: {
								pinned: true,
							}
						});
					}
				}
			}
		}));
	}

	private registerLogLevelFilterActions(): void {
		let order = 0;
		const registerLogLevel = (logLevel: LogLevel, toggled: ContextKeyExpression) => {
			this._register(registerAction2(class extends ViewAction<OutputViewPane> {
				constructor() {
					super({
						id: `workbench.actions.${OUTPUT_VIEW_ID}.toggle.${LogLevelToString(logLevel)}`,
						title: LogLevelToLocalizedString(logLevel).value,
						metadata: {
							description: localize2('toggleTraceDescription', "Show or hide {0} messages in the output", LogLevelToString(logLevel))
						},
						toggled,
						menu: {
							id: viewFilterSubmenu,
							group: '2_log_filter',
							when: ContextKeyExpr.and(ContextKeyExpr.equals('view', OUTPUT_VIEW_ID), CONTEXT_ACTIVE_LOG_FILE_OUTPUT),
							order: order++
						},
						viewId: OUTPUT_VIEW_ID
					});
				}
				async runInView(serviceAccessor: ServicesAccessor, view: OutputViewPane): Promise<void> {
					this.toggleLogLevelFilter(serviceAccessor.get(IOutputService), logLevel);
				}
				private toggleLogLevelFilter(outputService: IOutputService, logLevel: LogLevel): void {
					switch (logLevel) {
						case LogLevel.Trace:
							outputService.filters.trace = !outputService.filters.trace;
							break;
						case LogLevel.Debug:
							outputService.filters.debug = !outputService.filters.debug;
							break;
						case LogLevel.Info:
							outputService.filters.info = !outputService.filters.info;
							break;
						case LogLevel.Warning:
							outputService.filters.warning = !outputService.filters.warning;
							break;
						case LogLevel.Error:
							outputService.filters.error = !outputService.filters.error;
							break;
					}
				}
			}));
		};

		registerLogLevel(LogLevel.Trace, SHOW_TRACE_FILTER_CONTEXT);
		registerLogLevel(LogLevel.Debug, SHOW_DEBUG_FILTER_CONTEXT);
		registerLogLevel(LogLevel.Info, SHOW_INFO_FILTER_CONTEXT);
		registerLogLevel(LogLevel.Warning, SHOW_WARNING_FILTER_CONTEXT);
		registerLogLevel(LogLevel.Error, SHOW_ERROR_FILTER_CONTEXT);
	}

	private registerClearFilterActions(): void {
		this._register(registerAction2(class extends ViewAction<OutputViewPane> {
			constructor() {
				super({
					id: `workbench.actions.${OUTPUT_VIEW_ID}.clearFilterText`,
					title: localize('clearFiltersText', "Clear filters text"),
					keybinding: {
						when: OUTPUT_FILTER_FOCUS_CONTEXT,
						weight: KeybindingWeight.WorkbenchContrib,
						primary: KeyCode.Escape
					},
					viewId: OUTPUT_VIEW_ID
				});
			}
			async runInView(serviceAccessor: ServicesAccessor, outputView: OutputViewPane): Promise<void> {
				outputView.clearFilterText();
			}
		}));
	}

	private registerExportLogsAction(): void {
		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: `workbench.action.exportLogs`,
					title: nls.localize2('exportLogs', "Export Logs..."),
					f1: true,
					category: Categories.Developer,
					menu: [{
						id: MenuId.ViewTitle,
						when: ContextKeyExpr.equals('view', OUTPUT_VIEW_ID),
						group: '1_export',
						order: 2,
					}],
				});
			}
			async run(accessor: ServicesAccessor, arg?: { outputPath?: URI; outputChannelIds?: string[] }): Promise<void> {
				const outputService = accessor.get(IOutputService);
				const quickInputService = accessor.get(IQuickInputService);
				const extensionLogs: IOutputChannelDescriptor[] = [], logs: IOutputChannelDescriptor[] = [], userLogs: IOutputChannelDescriptor[] = [];
				for (const channel of outputService.getChannelDescriptors()) {
					if (channel.log) {
						if (channel.extensionId) {
							extensionLogs.push(channel);
						} else if (channel.user) {
							userLogs.push(channel);
						} else {
							logs.push(channel);
						}
					}
				}
				const entries: Array<IOutputChannelDescriptor | IQuickPickSeparator> = [];
				for (const log of logs.sort((a, b) => a.label.localeCompare(b.label))) {
					entries.push(log);
				}
				if (extensionLogs.length && logs.length) {
					entries.push({ type: 'separator', label: nls.localize('extensionLogs', "Extension Logs") });
				}
				for (const log of extensionLogs.sort((a, b) => a.label.localeCompare(b.label))) {
					entries.push(log);
				}
				if (userLogs.length && (extensionLogs.length || logs.length)) {
					entries.push({ type: 'separator', label: nls.localize('userLogs', "User Logs") });
				}
				for (const log of userLogs.sort((a, b) => a.label.localeCompare(b.label))) {
					entries.push(log);
				}

				let selectedOutputChannels: IOutputChannelDescriptor[] | undefined;
				if (arg?.outputChannelIds) {
					const requestedIdsNormalized = arg.outputChannelIds.map(id => id.trim().toLowerCase());
					const candidates = entries.filter((e): e is IOutputChannelDescriptor => {
						const isSeparator = hasKey(e, { type: true }) && e.type === 'separator';
						return !isSeparator;
					});
					if (requestedIdsNormalized.includes('*')) {
						selectedOutputChannels = candidates;
					} else {
						selectedOutputChannels = candidates.filter(candidate => requestedIdsNormalized.includes(candidate.id.toLowerCase()));
					}
				} else {
					selectedOutputChannels = await quickInputService.pick(entries, { placeHolder: nls.localize('selectlog', "Select Log"), canPickMany: true });
				}

				if (selectedOutputChannels?.length) {
					await outputService.saveOutputAs(arg?.outputPath, ...selectedOutputChannels);
				}
			}
		}));
	}

	private registerImportLogAction(): void {
		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: `workbench.action.importLog`,
					title: nls.localize2('importLog', "Import Log..."),
					f1: true,
					category: Categories.Developer,
					menu: [{
						id: MenuId.ViewTitle,
						when: ContextKeyExpr.equals('view', OUTPUT_VIEW_ID),
						group: '2_add',
						order: 2,
					}],
				});
			}
			async run(accessor: ServicesAccessor): Promise<void> {
				const outputService = accessor.get(IOutputService);
				const fileDialogService = accessor.get(IFileDialogService);
				const result = await fileDialogService.showOpenDialog({
					title: nls.localize('importLogFile', "Import Log File"),
					canSelectFiles: true,
					canSelectFolders: false,
					canSelectMany: true,
					filters: [{
						name: nls.localize('logFiles', "Log Files"),
						extensions: ['log']
					}]
				});

				if (result?.length) {
					const channelName = basename(result[0]);
					const channelId = `${IMPORTED_LOG_ID_PREFIX}${Date.now()}`;
					// Register and show the channel
					Registry.as<IOutputChannelRegistry>(Extensions.OutputChannels).registerChannel({
						id: channelId,
						label: channelName,
						log: true,
						user: true,
						source: result.length === 1
							? { resource: result[0] }
							: result.map(resource => ({ resource, name: basename(resource).split('.')[0] }))
					});
					outputService.showChannel(channelId);
				}
			}
		}));
	}
}

Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench).registerWorkbenchContribution(OutputContribution, LifecyclePhase.Restored);

Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration).registerConfiguration({
	id: 'output',
	order: 30,
	title: nls.localize('output', "Output"),
	type: 'object',
	properties: {
		'output.smartScroll.enabled': {
			type: 'boolean',
			description: nls.localize('output.smartScroll.enabled', "Enable/disable the ability of smart scrolling in the output view. Smart scrolling allows you to lock scrolling automatically when you click in the output view and unlocks when you click in the last line."),
			default: true,
			scope: ConfigurationScope.WINDOW,
			tags: ['output']
		}
	}
});

KeybindingsRegistry.registerKeybindingRule({
	id: 'cursorWordAccessibilityLeft',
	when: ContextKeyExpr.and(EditorContextKeys.textInputFocus, CONTEXT_ACCESSIBILITY_MODE_ENABLED, IsWindowsContext, ContextKeyExpr.equals(FocusedViewContext.key, OUTPUT_VIEW_ID)),
	primary: KeyMod.CtrlCmd | KeyCode.LeftArrow,
	weight: KeybindingWeight.WorkbenchContrib
});
KeybindingsRegistry.registerKeybindingRule({
	id: 'cursorWordAccessibilityLeftSelect',
	when: ContextKeyExpr.and(EditorContextKeys.textInputFocus, CONTEXT_ACCESSIBILITY_MODE_ENABLED, IsWindowsContext, ContextKeyExpr.equals(FocusedViewContext.key, OUTPUT_VIEW_ID)),
	primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.LeftArrow,
	weight: KeybindingWeight.WorkbenchContrib
});
KeybindingsRegistry.registerKeybindingRule({
	id: 'cursorWordAccessibilityRight',
	when: ContextKeyExpr.and(EditorContextKeys.textInputFocus, CONTEXT_ACCESSIBILITY_MODE_ENABLED, IsWindowsContext, ContextKeyExpr.equals(FocusedViewContext.key, OUTPUT_VIEW_ID)),
	primary: KeyMod.CtrlCmd | KeyCode.RightArrow,
	weight: KeybindingWeight.WorkbenchContrib
});
KeybindingsRegistry.registerKeybindingRule({
	id: 'cursorWordAccessibilityRightSelect',
	when: ContextKeyExpr.and(EditorContextKeys.textInputFocus, CONTEXT_ACCESSIBILITY_MODE_ENABLED, IsWindowsContext, ContextKeyExpr.equals(FocusedViewContext.key, OUTPUT_VIEW_ID)),
	primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.RightArrow,
	weight: KeybindingWeight.WorkbenchContrib
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/output/browser/output.css]---
Location: vscode-main/src/vs/workbench/contrib/output/browser/output.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-workbench .part.sidebar .output-view .monaco-editor,
.monaco-workbench .part.sidebar .output-view .monaco-editor .margin,
.monaco-workbench .part.sidebar .output-view .monaco-editor .monaco-editor-background,
.monaco-workbench .part.panel > .content .pane-body.output-view .monaco-editor,
.monaco-workbench .part.panel > .content .pane-body.output-view .monaco-editor .margin,
.monaco-workbench .part.panel > .content .pane-body.output-view .monaco-editor .monaco-editor-background {
	background-color: var(--vscode-outputView-background);
}

.monaco-workbench .part.sidebar .output-view .sticky-widget,
.monaco-workbench .part.panel > .content .pane-body.output-view .sticky-widget {
	background-color: var(--vscode-outputViewStickyScroll-background, var(--vscode-panel-background));
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/output/browser/outputLinkProvider.ts]---
Location: vscode-main/src/vs/workbench/contrib/output/browser/outputLinkProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';
import { RunOnceScheduler } from '../../../../base/common/async.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { ILink } from '../../../../editor/common/languages.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { OUTPUT_MODE_ID, LOG_MODE_ID } from '../../../services/output/common/output.js';
import { OutputLinkComputer } from '../common/outputLinkComputer.js';
import { IDisposable, dispose, Disposable } from '../../../../base/common/lifecycle.js';
import { ILanguageFeaturesService } from '../../../../editor/common/services/languageFeatures.js';
import { WebWorkerDescriptor } from '../../../../platform/webWorker/browser/webWorkerDescriptor.js';
import { IWebWorkerService } from '../../../../platform/webWorker/browser/webWorkerService.js';
import { IWebWorkerClient } from '../../../../base/common/worker/webWorker.js';
import { WorkerTextModelSyncClient } from '../../../../editor/common/services/textModelSync/textModelSync.impl.js';
import { FileAccess } from '../../../../base/common/network.js';

export class OutputLinkProvider extends Disposable {

	private static readonly DISPOSE_WORKER_TIME = 3 * 60 * 1000; // dispose worker after 3 minutes of inactivity

	private worker?: OutputLinkWorkerClient;
	private disposeWorkerScheduler: RunOnceScheduler;
	private linkProviderRegistration: IDisposable | undefined;

	constructor(
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService,
		@IModelService private readonly modelService: IModelService,
		@ILanguageFeaturesService private readonly languageFeaturesService: ILanguageFeaturesService,
		@IWebWorkerService private readonly webWorkerService: IWebWorkerService,
	) {
		super();

		this.disposeWorkerScheduler = new RunOnceScheduler(() => this.disposeWorker(), OutputLinkProvider.DISPOSE_WORKER_TIME);

		this.registerListeners();
		this.updateLinkProviderWorker();
	}

	private registerListeners(): void {
		this._register(this.contextService.onDidChangeWorkspaceFolders(() => this.updateLinkProviderWorker()));
	}

	private updateLinkProviderWorker(): void {

		// Setup link provider depending on folders being opened or not
		const folders = this.contextService.getWorkspace().folders;
		if (folders.length > 0) {
			if (!this.linkProviderRegistration) {
				this.linkProviderRegistration = this.languageFeaturesService.linkProvider.register([{ language: OUTPUT_MODE_ID, scheme: '*' }, { language: LOG_MODE_ID, scheme: '*' }], {
					provideLinks: async model => {
						const links = await this.provideLinks(model.uri);

						return links && { links };
					}
				});
			}
		} else {
			dispose(this.linkProviderRegistration);
			this.linkProviderRegistration = undefined;
		}

		// Dispose worker to recreate with folders on next provideLinks request
		this.disposeWorker();
		this.disposeWorkerScheduler.cancel();
	}

	private getOrCreateWorker(): OutputLinkWorkerClient {
		this.disposeWorkerScheduler.schedule();

		if (!this.worker) {
			this.worker = new OutputLinkWorkerClient(this.contextService, this.modelService, this.webWorkerService);
		}

		return this.worker;
	}

	private async provideLinks(modelUri: URI): Promise<ILink[]> {
		return this.getOrCreateWorker().provideLinks(modelUri);
	}

	private disposeWorker(): void {
		if (this.worker) {
			this.worker.dispose();
			this.worker = undefined;
		}
	}
}

class OutputLinkWorkerClient extends Disposable {
	private readonly _workerClient: IWebWorkerClient<OutputLinkComputer>;
	private readonly _workerTextModelSyncClient: WorkerTextModelSyncClient;
	private readonly _initializeBarrier: Promise<void>;

	constructor(
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService,
		@IModelService modelService: IModelService,
		@IWebWorkerService webWorkerService: IWebWorkerService,
	) {
		super();
		this._workerClient = this._register(webWorkerService.createWorkerClient<OutputLinkComputer>(
			new WebWorkerDescriptor({
				esmModuleLocation: FileAccess.asBrowserUri('vs/workbench/contrib/output/common/outputLinkComputerMain.js'),
				label: 'OutputLinkDetectionWorker'
			})
		));
		this._workerTextModelSyncClient = this._register(WorkerTextModelSyncClient.create(this._workerClient, modelService));
		this._initializeBarrier = this._ensureWorkspaceFolders();
	}

	private async _ensureWorkspaceFolders(): Promise<void> {
		await this._workerClient.proxy.$setWorkspaceFolders(this.contextService.getWorkspace().folders.map(folder => folder.uri.toString()));
	}

	public async provideLinks(modelUri: URI): Promise<ILink[]> {
		await this._initializeBarrier;
		this._workerTextModelSyncClient.ensureSyncedResources([modelUri]);
		return this._workerClient.proxy.$computeLinks(modelUri.toString());
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/output/browser/outputServices.ts]---
Location: vscode-main/src/vs/workbench/contrib/output/browser/outputServices.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event, Emitter } from '../../../../base/common/event.js';
import { Schemas } from '../../../../base/common/network.js';
import { URI } from '../../../../base/common/uri.js';
import { Disposable, DisposableMap } from '../../../../base/common/lifecycle.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IOutputChannel, IOutputService, OUTPUT_VIEW_ID, LOG_MIME, OUTPUT_MIME, OutputChannelUpdateMode, IOutputChannelDescriptor, Extensions, IOutputChannelRegistry, ACTIVE_OUTPUT_CHANNEL_CONTEXT, CONTEXT_ACTIVE_FILE_OUTPUT, CONTEXT_ACTIVE_OUTPUT_LEVEL_SETTABLE, CONTEXT_ACTIVE_OUTPUT_LEVEL, CONTEXT_ACTIVE_OUTPUT_LEVEL_IS_DEFAULT, IOutputViewFilters, SHOW_DEBUG_FILTER_CONTEXT, SHOW_ERROR_FILTER_CONTEXT, SHOW_INFO_FILTER_CONTEXT, SHOW_TRACE_FILTER_CONTEXT, SHOW_WARNING_FILTER_CONTEXT, CONTEXT_ACTIVE_LOG_FILE_OUTPUT, IMultiSourceOutputChannelDescriptor, isSingleSourceOutputChannelDescriptor, HIDE_CATEGORY_FILTER_CONTEXT, isMultiSourceOutputChannelDescriptor, ILogEntry } from '../../../services/output/common/output.js';
import { OutputLinkProvider } from './outputLinkProvider.js';
import { ITextModelService, ITextModelContentProvider } from '../../../../editor/common/services/resolverService.js';
import { ITextModel } from '../../../../editor/common/model.js';
import { ILogService, ILoggerService, LogLevel, LogLevelToString } from '../../../../platform/log/common/log.js';
import { ILifecycleService } from '../../../services/lifecycle/common/lifecycle.js';
import { DelegatedOutputChannelModel, FileOutputChannelModel, IOutputChannelModel, MultiFileOutputChannelModel } from '../common/outputChannelModel.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { OutputViewPane } from './outputView.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IDefaultLogLevelsService } from '../../logs/common/defaultLogLevels.js';
import { IFileDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { localize } from '../../../../nls.js';
import { joinPath } from '../../../../base/common/resources.js';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { telemetryLogId } from '../../../../platform/telemetry/common/telemetryUtils.js';
import { toLocalISOString } from '../../../../base/common/date.js';
import { IWorkbenchEnvironmentService } from '../../../services/environment/common/environmentService.js';

const OUTPUT_ACTIVE_CHANNEL_KEY = 'output.activechannel';

class OutputChannel extends Disposable implements IOutputChannel {

	scrollLock: boolean = false;
	readonly model: IOutputChannelModel;
	readonly id: string;
	readonly label: string;
	readonly uri: URI;

	constructor(
		readonly outputChannelDescriptor: IOutputChannelDescriptor,
		private readonly outputLocation: URI,
		private readonly outputDirPromise: Promise<void>,
		@ILanguageService private readonly languageService: ILanguageService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		super();
		this.id = outputChannelDescriptor.id;
		this.label = outputChannelDescriptor.label;
		this.uri = URI.from({ scheme: Schemas.outputChannel, path: this.id });
		this.model = this._register(this.createOutputChannelModel(this.uri, outputChannelDescriptor));
	}

	private createOutputChannelModel(uri: URI, outputChannelDescriptor: IOutputChannelDescriptor): IOutputChannelModel {
		const language = outputChannelDescriptor.languageId ? this.languageService.createById(outputChannelDescriptor.languageId) : this.languageService.createByMimeType(outputChannelDescriptor.log ? LOG_MIME : OUTPUT_MIME);
		if (isMultiSourceOutputChannelDescriptor(outputChannelDescriptor)) {
			return this.instantiationService.createInstance(MultiFileOutputChannelModel, uri, language, [...outputChannelDescriptor.source]);
		}
		if (isSingleSourceOutputChannelDescriptor(outputChannelDescriptor)) {
			return this.instantiationService.createInstance(FileOutputChannelModel, uri, language, outputChannelDescriptor.source);
		}
		return this.instantiationService.createInstance(DelegatedOutputChannelModel, this.id, uri, language, this.outputLocation, this.outputDirPromise);
	}

	getLogEntries(): ReadonlyArray<ILogEntry> {
		return this.model.getLogEntries();
	}

	append(output: string): void {
		this.model.append(output);
	}

	update(mode: OutputChannelUpdateMode, till?: number): void {
		this.model.update(mode, till, true);
	}

	clear(): void {
		this.model.clear();
	}

	replace(value: string): void {
		this.model.replace(value);
	}
}

interface IOutputFilterOptions {
	filterHistory: string[];
	trace: boolean;
	debug: boolean;
	info: boolean;
	warning: boolean;
	error: boolean;
	sources: string;
}

class OutputViewFilters extends Disposable implements IOutputViewFilters {

	private readonly _onDidChange = this._register(new Emitter<void>());
	readonly onDidChange = this._onDidChange.event;

	constructor(
		options: IOutputFilterOptions,
		private readonly contextKeyService: IContextKeyService
	) {
		super();

		this._trace = SHOW_TRACE_FILTER_CONTEXT.bindTo(this.contextKeyService);
		this._trace.set(options.trace);

		this._debug = SHOW_DEBUG_FILTER_CONTEXT.bindTo(this.contextKeyService);
		this._debug.set(options.debug);

		this._info = SHOW_INFO_FILTER_CONTEXT.bindTo(this.contextKeyService);
		this._info.set(options.info);

		this._warning = SHOW_WARNING_FILTER_CONTEXT.bindTo(this.contextKeyService);
		this._warning.set(options.warning);

		this._error = SHOW_ERROR_FILTER_CONTEXT.bindTo(this.contextKeyService);
		this._error.set(options.error);

		this._categories = HIDE_CATEGORY_FILTER_CONTEXT.bindTo(this.contextKeyService);
		this._categories.set(options.sources);

		this.filterHistory = options.filterHistory;
	}

	filterHistory: string[];

	private _filterText = '';
	private _includePatterns: string[] = [];
	private _excludePatterns: string[] = [];
	get text(): string {
		return this._filterText;
	}
	set text(filterText: string) {
		if (this._filterText !== filterText) {
			this._filterText = filterText;
			const { includePatterns, excludePatterns } = this.parseText(filterText);
			this._includePatterns = includePatterns;
			this._excludePatterns = excludePatterns;
			this._onDidChange.fire();
		}
	}
	private parseText(filterText: string): { includePatterns: string[]; excludePatterns: string[] } {
		const includePatterns: string[] = [];
		const excludePatterns: string[] = [];

		// Parse patterns respecting quoted strings
		const patterns = this.splitByCommaRespectingQuotes(filterText);

		for (const pattern of patterns) {
			const trimmed = pattern.trim();
			if (trimmed.length === 0) {
				continue;
			}

			if (trimmed.startsWith('!')) {
				// Negative filter - remove the ! prefix
				const negativePattern = trimmed.substring(1).trim();
				if (negativePattern.length > 0) {
					excludePatterns.push(negativePattern);
				}
			} else {
				includePatterns.push(trimmed);
			}
		}

		return { includePatterns, excludePatterns };
	}

	get includePatterns(): string[] {
		return this._includePatterns;
	}

	get excludePatterns(): string[] {
		return this._excludePatterns;
	}

	private splitByCommaRespectingQuotes(text: string): string[] {
		const patterns: string[] = [];
		let current = '';
		let inQuotes = false;
		let quoteChar = '';

		for (let i = 0; i < text.length; i++) {
			const char = text[i];

			if (!inQuotes && (char === '"')) {
				// Start of quoted string
				inQuotes = true;
				quoteChar = char;
				current += char;
			} else if (inQuotes && char === quoteChar) {
				// End of quoted string
				inQuotes = false;
				current += char;
			} else if (!inQuotes && char === ',') {
				// Comma outside quotes - split here
				if (current.length > 0) {
					patterns.push(current);
				}
				current = '';
			} else {
				current += char;
			}
		}

		// Add the last pattern
		if (current.length > 0) {
			patterns.push(current);
		}

		return patterns;
	}

	private readonly _trace: IContextKey<boolean>;
	get trace(): boolean {
		return !!this._trace.get();
	}
	set trace(trace: boolean) {
		if (this._trace.get() !== trace) {
			this._trace.set(trace);
			this._onDidChange.fire();
		}
	}

	private readonly _debug: IContextKey<boolean>;
	get debug(): boolean {
		return !!this._debug.get();
	}
	set debug(debug: boolean) {
		if (this._debug.get() !== debug) {
			this._debug.set(debug);
			this._onDidChange.fire();
		}
	}

	private readonly _info: IContextKey<boolean>;
	get info(): boolean {
		return !!this._info.get();
	}
	set info(info: boolean) {
		if (this._info.get() !== info) {
			this._info.set(info);
			this._onDidChange.fire();
		}
	}

	private readonly _warning: IContextKey<boolean>;
	get warning(): boolean {
		return !!this._warning.get();
	}
	set warning(warning: boolean) {
		if (this._warning.get() !== warning) {
			this._warning.set(warning);
			this._onDidChange.fire();
		}
	}

	private readonly _error: IContextKey<boolean>;
	get error(): boolean {
		return !!this._error.get();
	}
	set error(error: boolean) {
		if (this._error.get() !== error) {
			this._error.set(error);
			this._onDidChange.fire();
		}
	}

	private readonly _categories: IContextKey<string>;
	get categories(): string {
		return this._categories.get() || ',';
	}
	set categories(categories: string) {
		this._categories.set(categories);
		this._onDidChange.fire();
	}

	toggleCategory(category: string): void {
		const categories = this.categories;
		if (this.hasCategory(category)) {
			this.categories = categories.replace(`,${category},`, ',');
		} else {
			this.categories = `${categories}${category},`;
		}
	}

	hasCategory(category: string): boolean {
		if (category === ',') {
			return false;
		}
		return this.categories.includes(`,${category},`);
	}
}

export class OutputService extends Disposable implements IOutputService, ITextModelContentProvider {

	declare readonly _serviceBrand: undefined;

	private readonly channels = this._register(new DisposableMap<string, OutputChannel>());
	private activeChannelIdInStorage: string;
	private activeChannel?: OutputChannel;

	private readonly _onActiveOutputChannel = this._register(new Emitter<string>());
	readonly onActiveOutputChannel: Event<string> = this._onActiveOutputChannel.event;

	private readonly activeOutputChannelContext: IContextKey<string>;
	private readonly activeFileOutputChannelContext: IContextKey<boolean>;
	private readonly activeLogOutputChannelContext: IContextKey<boolean>;
	private readonly activeOutputChannelLevelSettableContext: IContextKey<boolean>;
	private readonly activeOutputChannelLevelContext: IContextKey<string>;
	private readonly activeOutputChannelLevelIsDefaultContext: IContextKey<boolean>;

	private readonly outputLocation: URI;

	readonly filters: OutputViewFilters;

	constructor(
		@IStorageService private readonly storageService: IStorageService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@ITextModelService private readonly textModelService: ITextModelService,
		@ILogService private readonly logService: ILogService,
		@ILoggerService private readonly loggerService: ILoggerService,
		@ILifecycleService private readonly lifecycleService: ILifecycleService,
		@IViewsService private readonly viewsService: IViewsService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IDefaultLogLevelsService private readonly defaultLogLevelsService: IDefaultLogLevelsService,
		@IFileDialogService private readonly fileDialogService: IFileDialogService,
		@IFileService private readonly fileService: IFileService,
		@IWorkbenchEnvironmentService environmentService: IWorkbenchEnvironmentService
	) {
		super();
		this.activeChannelIdInStorage = this.storageService.get(OUTPUT_ACTIVE_CHANNEL_KEY, StorageScope.WORKSPACE, '');
		this.activeOutputChannelContext = ACTIVE_OUTPUT_CHANNEL_CONTEXT.bindTo(contextKeyService);
		this.activeOutputChannelContext.set(this.activeChannelIdInStorage);
		this._register(this.onActiveOutputChannel(channel => this.activeOutputChannelContext.set(channel)));

		this.activeFileOutputChannelContext = CONTEXT_ACTIVE_FILE_OUTPUT.bindTo(contextKeyService);
		this.activeLogOutputChannelContext = CONTEXT_ACTIVE_LOG_FILE_OUTPUT.bindTo(contextKeyService);
		this.activeOutputChannelLevelSettableContext = CONTEXT_ACTIVE_OUTPUT_LEVEL_SETTABLE.bindTo(contextKeyService);
		this.activeOutputChannelLevelContext = CONTEXT_ACTIVE_OUTPUT_LEVEL.bindTo(contextKeyService);
		this.activeOutputChannelLevelIsDefaultContext = CONTEXT_ACTIVE_OUTPUT_LEVEL_IS_DEFAULT.bindTo(contextKeyService);

		this.outputLocation = joinPath(environmentService.windowLogsPath, `output_${toLocalISOString(new Date()).replace(/-|:|\.\d+Z$/g, '')}`);

		// Register as text model content provider for output
		this._register(textModelService.registerTextModelContentProvider(Schemas.outputChannel, this));
		this._register(instantiationService.createInstance(OutputLinkProvider));

		// Create output channels for already registered channels
		const registry = Registry.as<IOutputChannelRegistry>(Extensions.OutputChannels);
		for (const channelIdentifier of registry.getChannels()) {
			this.onDidRegisterChannel(channelIdentifier.id);
		}
		this._register(registry.onDidRegisterChannel(id => this.onDidRegisterChannel(id)));
		this._register(registry.onDidUpdateChannelSources(channel => this.onDidUpdateChannelSources(channel)));
		this._register(registry.onDidRemoveChannel(channel => this.onDidRemoveChannel(channel)));

		// Set active channel to first channel if not set
		if (!this.activeChannel) {
			const channels = this.getChannelDescriptors();
			this.setActiveChannel(channels && channels.length > 0 ? this.getChannel(channels[0].id) : undefined);
		}

		this._register(Event.filter(this.viewsService.onDidChangeViewVisibility, e => e.id === OUTPUT_VIEW_ID && e.visible)(() => {
			if (this.activeChannel) {
				this.viewsService.getActiveViewWithId<OutputViewPane>(OUTPUT_VIEW_ID)?.showChannel(this.activeChannel, true);
			}
		}));

		this._register(this.loggerService.onDidChangeLogLevel(() => {
			this.setLevelContext();
			this.setLevelIsDefaultContext();
		}));
		this._register(this.defaultLogLevelsService.onDidChangeDefaultLogLevels(() => {
			this.setLevelIsDefaultContext();
		}));

		this._register(this.lifecycleService.onDidShutdown(() => this.dispose()));

		this.filters = this._register(new OutputViewFilters({
			filterHistory: [],
			trace: true,
			debug: true,
			info: true,
			warning: true,
			error: true,
			sources: '',
		}, contextKeyService));
	}

	provideTextContent(resource: URI): Promise<ITextModel> | null {
		const channel = <OutputChannel>this.getChannel(resource.path);
		if (channel) {
			return channel.model.loadModel();
		}
		return null;
	}

	async showChannel(id: string, preserveFocus?: boolean): Promise<void> {
		const channel = this.getChannel(id);
		if (this.activeChannel?.id !== channel?.id) {
			this.setActiveChannel(channel);
			this._onActiveOutputChannel.fire(id);
		}
		const outputView = await this.viewsService.openView<OutputViewPane>(OUTPUT_VIEW_ID, !preserveFocus);
		if (outputView && channel) {
			outputView.showChannel(channel, !!preserveFocus);
		}
	}

	getChannel(id: string): OutputChannel | undefined {
		return this.channels.get(id);
	}

	getChannelDescriptor(id: string): IOutputChannelDescriptor | undefined {
		return Registry.as<IOutputChannelRegistry>(Extensions.OutputChannels).getChannel(id);
	}

	getChannelDescriptors(): IOutputChannelDescriptor[] {
		return Registry.as<IOutputChannelRegistry>(Extensions.OutputChannels).getChannels();
	}

	getActiveChannel(): IOutputChannel | undefined {
		return this.activeChannel;
	}

	canSetLogLevel(channel: IOutputChannelDescriptor): boolean {
		return channel.log && channel.id !== telemetryLogId;
	}

	getLogLevel(channel: IOutputChannelDescriptor): LogLevel | undefined {
		if (!channel.log) {
			return undefined;
		}
		const sources = isSingleSourceOutputChannelDescriptor(channel) ? [channel.source] : isMultiSourceOutputChannelDescriptor(channel) ? channel.source : [];
		if (sources.length === 0) {
			return undefined;
		}

		const logLevel = this.loggerService.getLogLevel();
		return sources.reduce((prev, curr) => Math.min(prev, this.loggerService.getLogLevel(curr.resource) ?? logLevel), LogLevel.Error);
	}

	setLogLevel(channel: IOutputChannelDescriptor, logLevel: LogLevel): void {
		if (!channel.log) {
			return;
		}
		const sources = isSingleSourceOutputChannelDescriptor(channel) ? [channel.source] : isMultiSourceOutputChannelDescriptor(channel) ? channel.source : [];
		if (sources.length === 0) {
			return;
		}
		for (const source of sources) {
			this.loggerService.setLogLevel(source.resource, logLevel);
		}
	}

	registerCompoundLogChannel(descriptors: IOutputChannelDescriptor[]): string {
		const outputChannelRegistry = Registry.as<IOutputChannelRegistry>(Extensions.OutputChannels);
		descriptors.sort((a, b) => a.label.localeCompare(b.label));
		const id = descriptors.map(r => r.id.toLowerCase()).join('-');
		if (!outputChannelRegistry.getChannel(id)) {
			outputChannelRegistry.registerChannel({
				id,
				label: descriptors.map(r => r.label).join(', '),
				log: descriptors.some(r => r.log),
				user: true,
				source: descriptors.map(descriptor => {
					if (isSingleSourceOutputChannelDescriptor(descriptor)) {
						return [{ resource: descriptor.source.resource, name: descriptor.source.name ?? descriptor.label }];
					}
					if (isMultiSourceOutputChannelDescriptor(descriptor)) {
						return descriptor.source;
					}
					const channel = this.getChannel(descriptor.id);
					if (channel) {
						return channel.model.source;
					}
					return [];
				}).flat(),
			});
		}
		return id;
	}

	async saveOutputAs(outputPath?: URI, ...channels: IOutputChannelDescriptor[]): Promise<void> {
		let channel: IOutputChannel | undefined;
		if (channels.length > 1) {
			const compoundChannelId = this.registerCompoundLogChannel(channels);
			channel = this.getChannel(compoundChannelId);
		} else {
			channel = this.getChannel(channels[0].id);
		}

		if (!channel) {
			return;
		}

		try {
			let uri: URI | undefined = outputPath;
			if (!uri) {
				const name = channels.length > 1 ? 'output' : channels[0].label;
				uri = await this.fileDialogService.showSaveDialog({
					title: localize('saveLog.dialogTitle', "Save Output As"),
					availableFileSystems: [Schemas.file],
					defaultUri: joinPath(await this.fileDialogService.defaultFilePath(), `${name}.log`),
					filters: [{
						name,
						extensions: ['log']
					}]
				});
			}

			if (!uri) {
				return;
			}

			const modelRef = await this.textModelService.createModelReference(channel.uri);
			try {
				await this.fileService.writeFile(uri, VSBuffer.fromString(modelRef.object.textEditorModel.getValue()));
			} finally {
				modelRef.dispose();
			}
			return;
		}
		finally {
			if (channels.length > 1) {
				Registry.as<IOutputChannelRegistry>(Extensions.OutputChannels).removeChannel(channel.id);
			}
		}
	}

	private async onDidRegisterChannel(channelId: string): Promise<void> {
		const channel = this.createChannel(channelId);
		this.channels.set(channelId, channel);
		if (!this.activeChannel || this.activeChannelIdInStorage === channelId) {
			this.setActiveChannel(channel);
			this._onActiveOutputChannel.fire(channelId);
			const outputView = this.viewsService.getActiveViewWithId<OutputViewPane>(OUTPUT_VIEW_ID);
			outputView?.showChannel(channel, true);
		}
	}

	private onDidUpdateChannelSources(channel: IMultiSourceOutputChannelDescriptor): void {
		const outputChannel = this.channels.get(channel.id);
		if (outputChannel) {
			outputChannel.model.updateChannelSources(channel.source);
		}
	}

	private onDidRemoveChannel(channel: IOutputChannelDescriptor): void {
		if (this.activeChannel?.id === channel.id) {
			const channels = this.getChannelDescriptors();
			if (channels[0]) {
				this.showChannel(channels[0].id);
			}
		}
		this.channels.deleteAndDispose(channel.id);
	}

	private createChannel(id: string): OutputChannel {
		const channel = this.instantiateChannel(id);
		this._register(Event.once(channel.model.onDispose)(() => {
			if (this.activeChannel === channel) {
				const channels = this.getChannelDescriptors();
				const channel = channels.length ? this.getChannel(channels[0].id) : undefined;
				if (channel && this.viewsService.isViewVisible(OUTPUT_VIEW_ID)) {
					this.showChannel(channel.id);
				} else {
					this.setActiveChannel(undefined);
				}
			}
			Registry.as<IOutputChannelRegistry>(Extensions.OutputChannels).removeChannel(id);
		}));

		return channel;
	}

	private outputFolderCreationPromise: Promise<void> | null = null;
	private instantiateChannel(id: string): OutputChannel {
		const channelData = Registry.as<IOutputChannelRegistry>(Extensions.OutputChannels).getChannel(id);
		if (!channelData) {
			this.logService.error(`Channel '${id}' is not registered yet`);
			throw new Error(`Channel '${id}' is not registered yet`);
		}
		if (!this.outputFolderCreationPromise) {
			this.outputFolderCreationPromise = this.fileService.createFolder(this.outputLocation).then(() => undefined);
		}
		return this.instantiationService.createInstance(OutputChannel, channelData, this.outputLocation, this.outputFolderCreationPromise);
	}

	private setLevelContext(): void {
		const descriptor = this.activeChannel?.outputChannelDescriptor;
		const channelLogLevel = descriptor ? this.getLogLevel(descriptor) : undefined;
		this.activeOutputChannelLevelContext.set(channelLogLevel !== undefined ? LogLevelToString(channelLogLevel) : '');
	}

	private async setLevelIsDefaultContext(): Promise<void> {
		const descriptor = this.activeChannel?.outputChannelDescriptor;
		const channelLogLevel = descriptor ? this.getLogLevel(descriptor) : undefined;
		if (channelLogLevel !== undefined) {
			const channelDefaultLogLevel = await this.defaultLogLevelsService.getDefaultLogLevel(descriptor?.extensionId);
			this.activeOutputChannelLevelIsDefaultContext.set(channelDefaultLogLevel === channelLogLevel);
		} else {
			this.activeOutputChannelLevelIsDefaultContext.set(false);
		}
	}

	private setActiveChannel(channel: OutputChannel | undefined): void {
		this.activeChannel = channel;
		const descriptor = channel?.outputChannelDescriptor;
		this.activeFileOutputChannelContext.set(!!descriptor && isSingleSourceOutputChannelDescriptor(descriptor));
		this.activeLogOutputChannelContext.set(!!descriptor?.log);
		this.activeOutputChannelLevelSettableContext.set(descriptor !== undefined && this.canSetLogLevel(descriptor));
		this.setLevelIsDefaultContext();
		this.setLevelContext();

		if (this.activeChannel) {
			this.storageService.store(OUTPUT_ACTIVE_CHANNEL_KEY, this.activeChannel.id, StorageScope.WORKSPACE, StorageTarget.MACHINE);
		} else {
			this.storageService.remove(OUTPUT_ACTIVE_CHANNEL_KEY, StorageScope.WORKSPACE);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/output/browser/outputView.ts]---
Location: vscode-main/src/vs/workbench/contrib/output/browser/outputView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import './output.css';
import * as nls from '../../../../nls.js';
import { ICodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { IEditorOptions as ICodeEditorOptions } from '../../../../editor/common/config/editorOptions.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { ITextResourceConfigurationService } from '../../../../editor/common/services/textResourceConfiguration.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IContextKeyService, IContextKey, ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { IEditorOpenContext } from '../../../common/editor.js';
import { AbstractTextResourceEditor } from '../../../browser/parts/editor/textResourceEditor.js';
import { OUTPUT_VIEW_ID, CONTEXT_IN_OUTPUT, IOutputChannel, CONTEXT_OUTPUT_SCROLL_LOCK, IOutputService, IOutputViewFilters, OUTPUT_FILTER_FOCUS_CONTEXT, ILogEntry, HIDE_CATEGORY_FILTER_CONTEXT } from '../../../services/output/common/output.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IEditorGroupsService } from '../../../services/editor/common/editorGroupsService.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { CursorChangeReason } from '../../../../editor/common/cursorEvents.js';
import { IViewPaneOptions, FilterViewPane } from '../../../browser/parts/views/viewPane.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IViewDescriptorService } from '../../../common/views.js';
import { TextResourceEditorInput } from '../../../common/editor/textResourceEditorInput.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { Dimension } from '../../../../base/browser/dom.js';
import { ITextEditorOptions } from '../../../../platform/editor/common/editor.js';
import { CancelablePromise, createCancelablePromise } from '../../../../base/common/async.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { ResourceContextKey } from '../../../common/contextkeys.js';
import { ServiceCollection } from '../../../../platform/instantiation/common/serviceCollection.js';
import { IEditorConfiguration } from '../../../browser/parts/editor/textEditor.js';
import { computeEditorAriaLabel } from '../../../browser/editor.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { localize } from '../../../../nls.js';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { LogLevel } from '../../../../platform/log/common/log.js';
import { IEditorContributionDescription, EditorExtensionsRegistry, EditorContributionInstantiation, EditorContributionCtor } from '../../../../editor/browser/editorExtensions.js';
import { ICodeEditorWidgetOptions } from '../../../../editor/browser/widget/codeEditor/codeEditorWidget.js';
import { IEditorContribution, IEditorDecorationsCollection } from '../../../../editor/common/editorCommon.js';
import { IModelDeltaDecoration, ITextModel } from '../../../../editor/common/model.js';
import { Range } from '../../../../editor/common/core/range.js';
import { FindDecorations } from '../../../../editor/contrib/find/browser/findDecorations.js';
import { Memento } from '../../../common/memento.js';
import { Markers } from '../../markers/common/markers.js';
import { Action2, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { viewFilterSubmenu } from '../../../browser/parts/views/viewFilter.js';
import { escapeRegExpCharacters } from '../../../../base/common/strings.js';

interface IOutputViewState {
	filter?: string;
	showTrace?: boolean;
	showDebug?: boolean;
	showInfo?: boolean;
	showWarning?: boolean;
	showError?: boolean;
	categories?: string;
}

export class OutputViewPane extends FilterViewPane {

	private readonly editor: OutputEditor;
	private channelId: string | undefined;
	private editorPromise: CancelablePromise<void> | null = null;

	private readonly scrollLockContextKey: IContextKey<boolean>;
	get scrollLock(): boolean { return !!this.scrollLockContextKey.get(); }
	set scrollLock(scrollLock: boolean) { this.scrollLockContextKey.set(scrollLock); }

	private readonly memento: Memento<IOutputViewState>;
	private readonly panelState: IOutputViewState;

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
		@IOutputService private readonly outputService: IOutputService,
		@IStorageService storageService: IStorageService,
	) {
		const memento = new Memento<IOutputViewState>(Markers.MARKERS_VIEW_STORAGE_ID, storageService);
		const viewState = memento.getMemento(StorageScope.WORKSPACE, StorageTarget.MACHINE);
		super({
			...options,
			filterOptions: {
				placeholder: localize('outputView.filter.placeholder', "Filter (e.g. text, !excludeText, text1,text2)"),
				focusContextKey: OUTPUT_FILTER_FOCUS_CONTEXT.key,
				text: viewState.filter || '',
				history: []
			}
		}, keybindingService, contextMenuService, configurationService, contextKeyService, viewDescriptorService, instantiationService, openerService, themeService, hoverService);
		this.memento = memento;
		this.panelState = viewState;

		const filters = outputService.filters;
		filters.text = this.panelState.filter || '';
		filters.trace = this.panelState.showTrace ?? true;
		filters.debug = this.panelState.showDebug ?? true;
		filters.info = this.panelState.showInfo ?? true;
		filters.warning = this.panelState.showWarning ?? true;
		filters.error = this.panelState.showError ?? true;
		filters.categories = this.panelState.categories ?? '';

		this.scrollLockContextKey = CONTEXT_OUTPUT_SCROLL_LOCK.bindTo(this.contextKeyService);

		const editorInstantiationService = this._register(instantiationService.createChild(new ServiceCollection([IContextKeyService, this.scopedContextKeyService])));
		this.editor = this._register(editorInstantiationService.createInstance(OutputEditor));
		this._register(this.editor.onTitleAreaUpdate(() => {
			this.updateTitle(this.editor.getTitle());
			this.updateActions();
		}));
		this._register(this.onDidChangeBodyVisibility(() => this.onDidChangeVisibility(this.isBodyVisible())));
		this._register(this.filterWidget.onDidChangeFilterText(text => outputService.filters.text = text));

		this.checkMoreFilters();
		this._register(outputService.filters.onDidChange(() => this.checkMoreFilters()));
	}

	showChannel(channel: IOutputChannel, preserveFocus: boolean): void {
		if (this.channelId !== channel.id) {
			this.setInput(channel);
		}
		if (!preserveFocus) {
			this.focus();
		}
	}

	override focus(): void {
		super.focus();
		this.editorPromise?.then(() => this.editor.focus());
	}

	public clearFilterText(): void {
		this.filterWidget.setFilterText('');
	}

	protected override renderBody(container: HTMLElement): void {
		super.renderBody(container);
		this.editor.create(container);
		container.classList.add('output-view');
		const codeEditor = <ICodeEditor>this.editor.getControl();
		codeEditor.setAriaOptions({ role: 'document', activeDescendant: undefined });
		this._register(codeEditor.onDidChangeModelContent(() => {
			if (!this.scrollLock) {
				this.editor.revealLastLine();
			}
		}));
		this._register(codeEditor.onDidChangeCursorPosition((e) => {
			if (e.reason !== CursorChangeReason.Explicit) {
				return;
			}

			if (!this.configurationService.getValue('output.smartScroll.enabled')) {
				return;
			}

			const model = codeEditor.getModel();
			if (model) {
				const newPositionLine = e.position.lineNumber;
				const lastLine = model.getLineCount();
				this.scrollLock = lastLine !== newPositionLine;
			}
		}));
	}

	protected layoutBodyContent(height: number, width: number): void {
		this.editor.layout(new Dimension(width, height));
	}

	private onDidChangeVisibility(visible: boolean): void {
		this.editor.setVisible(visible);
		if (!visible) {
			this.clearInput();
		}
	}

	private setInput(channel: IOutputChannel): void {
		this.channelId = channel.id;
		this.checkMoreFilters();

		const input = this.createInput(channel);
		if (!this.editor.input || !input.matches(this.editor.input)) {
			this.editorPromise?.cancel();
			this.editorPromise = createCancelablePromise(token => this.editor.setInput(input, { preserveFocus: true }, Object.create(null), token));
		}

	}

	private checkMoreFilters(): void {
		const filters = this.outputService.filters;
		this.filterWidget.checkMoreFilters(!filters.trace || !filters.debug || !filters.info || !filters.warning || !filters.error || (!!this.channelId && filters.categories.includes(`,${this.channelId}:`)));
	}

	private clearInput(): void {
		this.channelId = undefined;
		this.editor.clearInput();
		this.editorPromise = null;
	}

	private createInput(channel: IOutputChannel): TextResourceEditorInput {
		return this.instantiationService.createInstance(TextResourceEditorInput, channel.uri, nls.localize('output model title', "{0} - Output", channel.label), nls.localize('channel', "Output channel for '{0}'", channel.label), undefined, undefined);
	}

	override saveState(): void {
		const filters = this.outputService.filters;
		this.panelState.filter = filters.text;
		this.panelState.showTrace = filters.trace;
		this.panelState.showDebug = filters.debug;
		this.panelState.showInfo = filters.info;
		this.panelState.showWarning = filters.warning;
		this.panelState.showError = filters.error;
		this.panelState.categories = filters.categories;

		this.memento.saveMemento();
		super.saveState();
	}

}

export class OutputEditor extends AbstractTextResourceEditor {
	private readonly resourceContext: ResourceContextKey;

	constructor(
		@ITelemetryService telemetryService: ITelemetryService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IStorageService storageService: IStorageService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@ITextResourceConfigurationService textResourceConfigurationService: ITextResourceConfigurationService,
		@IThemeService themeService: IThemeService,
		@IEditorGroupsService editorGroupService: IEditorGroupsService,
		@IEditorService editorService: IEditorService,
		@IFileService fileService: IFileService
	) {
		super(OUTPUT_VIEW_ID, editorGroupService.activeGroup /* this is not correct but pragmatic */, telemetryService, instantiationService, storageService, textResourceConfigurationService, themeService, editorGroupService, editorService, fileService);

		this.resourceContext = this._register(instantiationService.createInstance(ResourceContextKey));
	}

	override getId(): string {
		return OUTPUT_VIEW_ID;
	}

	override getTitle(): string {
		return nls.localize('output', "Output");
	}

	protected override getConfigurationOverrides(configuration: IEditorConfiguration): ICodeEditorOptions {
		const options = super.getConfigurationOverrides(configuration);
		options.wordWrap = 'on';				// all output editors wrap
		options.lineNumbers = 'off';			// all output editors hide line numbers
		options.glyphMargin = false;
		options.lineDecorationsWidth = 20;
		options.rulers = [];
		options.folding = false;
		options.scrollBeyondLastLine = false;
		options.renderLineHighlight = 'none';
		options.minimap = { enabled: false };
		options.renderValidationDecorations = 'editable';
		options.padding = undefined;
		options.readOnly = true;
		options.domReadOnly = true;
		options.unicodeHighlight = {
			nonBasicASCII: false,
			invisibleCharacters: false,
			ambiguousCharacters: false,
		};

		const outputConfig = this.configurationService.getValue<{ 'editor.minimap.enabled'?: boolean; 'editor.wordWrap'?: 'off' | 'on' | 'wordWrapColumn' | 'bounded' }>('[Log]');
		if (outputConfig) {
			if (outputConfig['editor.minimap.enabled']) {
				options.minimap = { enabled: true };
			}
			if (outputConfig['editor.wordWrap']) {
				options.wordWrap = outputConfig['editor.wordWrap'];
			}
		}

		return options;
	}

	protected getAriaLabel(): string {
		return this.input ? this.input.getAriaLabel() : nls.localize('outputViewAriaLabel', "Output panel");
	}

	protected override computeAriaLabel(): string {
		return this.input ? computeEditorAriaLabel(this.input, undefined, undefined, this.editorGroupService.count) : this.getAriaLabel();
	}

	override async setInput(input: TextResourceEditorInput, options: ITextEditorOptions | undefined, context: IEditorOpenContext, token: CancellationToken): Promise<void> {
		const focus = !(options && options.preserveFocus);
		if (this.input && input.matches(this.input)) {
			return;
		}

		if (this.input) {
			// Dispose previous input (Output panel is not a workbench editor)
			this.input.dispose();
		}
		await super.setInput(input, options, context, token);

		this.resourceContext.set(input.resource);

		if (focus) {
			this.focus();
		}
		this.revealLastLine();
	}

	override clearInput(): void {
		if (this.input) {
			// Dispose current input (Output panel is not a workbench editor)
			this.input.dispose();
		}
		super.clearInput();

		this.resourceContext.reset();
	}

	protected override createEditor(parent: HTMLElement): void {

		parent.setAttribute('role', 'document');

		super.createEditor(parent);

		const scopedContextKeyService = this.scopedContextKeyService;
		if (scopedContextKeyService) {
			CONTEXT_IN_OUTPUT.bindTo(scopedContextKeyService).set(true);
		}
	}

	private _getContributions(): IEditorContributionDescription[] {
		return [
			...EditorExtensionsRegistry.getEditorContributions(),
			{
				id: FilterController.ID,
				ctor: FilterController as EditorContributionCtor,
				instantiation: EditorContributionInstantiation.Eager
			}
		];
	}

	protected override getCodeEditorWidgetOptions(): ICodeEditorWidgetOptions {
		return { contributions: this._getContributions() };
	}

}

export class FilterController extends Disposable implements IEditorContribution {

	public static readonly ID = 'output.editor.contrib.filterController';

	private readonly modelDisposables: DisposableStore = this._register(new DisposableStore());
	private hiddenAreas: Range[] = [];
	private readonly categories = new Map<string, string>();
	private readonly decorationsCollection: IEditorDecorationsCollection;

	constructor(
		private readonly editor: ICodeEditor,
		@IOutputService private readonly outputService: IOutputService,
	) {
		super();
		this.decorationsCollection = editor.createDecorationsCollection();
		this._register(editor.onDidChangeModel(() => this.onDidChangeModel()));
		this._register(this.outputService.filters.onDidChange(() => editor.hasModel() && this.filter(editor.getModel())));
	}

	private onDidChangeModel(): void {
		this.modelDisposables.clear();
		this.hiddenAreas = [];
		this.categories.clear();

		if (!this.editor.hasModel()) {
			return;
		}

		const model = this.editor.getModel();
		this.filter(model);

		const computeEndLineNumber = () => {
			const endLineNumber = model.getLineCount();
			return endLineNumber > 1 && model.getLineMaxColumn(endLineNumber) === 1 ? endLineNumber - 1 : endLineNumber;
		};

		let endLineNumber = computeEndLineNumber();

		this.modelDisposables.add(model.onDidChangeContent(e => {
			if (e.changes.every(e => e.range.startLineNumber > endLineNumber)) {
				this.filterIncremental(model, endLineNumber + 1);
			} else {
				this.filter(model);
			}
			endLineNumber = computeEndLineNumber();
		}));
	}

	private filter(model: ITextModel): void {
		this.hiddenAreas = [];
		this.decorationsCollection.clear();
		this.filterIncremental(model, 1);
	}

	private filterIncremental(model: ITextModel, fromLineNumber: number): void {
		const { findMatches, hiddenAreas, categories: sources } = this.compute(model, fromLineNumber);
		this.hiddenAreas.push(...hiddenAreas);
		this.editor.setHiddenAreas(this.hiddenAreas, this);
		if (findMatches.length) {
			this.decorationsCollection.append(findMatches);
		}
		if (sources.size) {
			const that = this;
			for (const [categoryFilter, categoryName] of sources) {
				if (this.categories.has(categoryFilter)) {
					continue;
				}
				this.categories.set(categoryFilter, categoryName);
				this.modelDisposables.add(registerAction2(class extends Action2 {
					constructor() {
						super({
							id: `workbench.actions.${OUTPUT_VIEW_ID}.toggle.${categoryFilter}`,
							title: categoryName,
							toggled: ContextKeyExpr.regex(HIDE_CATEGORY_FILTER_CONTEXT.key, new RegExp(`.*,${escapeRegExpCharacters(categoryFilter)},.*`)).negate(),
							menu: {
								id: viewFilterSubmenu,
								group: '1_category_filter',
								when: ContextKeyExpr.and(ContextKeyExpr.equals('view', OUTPUT_VIEW_ID)),
							}
						});
					}
					async run(): Promise<void> {
						that.outputService.filters.toggleCategory(categoryFilter);
					}
				}));
			}
		}
	}

	private shouldShowLine(model: ITextModel, range: Range, positive: string[], negative: string[]): { show: boolean; matches: IModelDeltaDecoration[] } {
		const matches: IModelDeltaDecoration[] = [];

		// Check negative filters first - if any match, hide the line
		if (negative.length > 0) {
			for (const pattern of negative) {
				const negativeMatches = model.findMatches(pattern, range, false, false, null, false);
				if (negativeMatches.length > 0) {
					return { show: false, matches: [] };
				}
			}
		}

		// If there are positive filters, at least one must match
		if (positive.length > 0) {
			let hasPositiveMatch = false;
			for (const pattern of positive) {
				const positiveMatches = model.findMatches(pattern, range, false, false, null, false);
				if (positiveMatches.length > 0) {
					hasPositiveMatch = true;
					for (const match of positiveMatches) {
						matches.push({ range: match.range, options: FindDecorations._FIND_MATCH_DECORATION });
					}
				}
			}
			return { show: hasPositiveMatch, matches };
		}

		// No positive filters means show everything (that passed negative filters)
		return { show: true, matches };
	}

	private compute(model: ITextModel, fromLineNumber: number): { findMatches: IModelDeltaDecoration[]; hiddenAreas: Range[]; categories: Map<string, string> } {
		const filters = this.outputService.filters;
		const activeChannel = this.outputService.getActiveChannel();
		const findMatches: IModelDeltaDecoration[] = [];
		const hiddenAreas: Range[] = [];
		const categories = new Map<string, string>();

		const logEntries = activeChannel?.getLogEntries();
		if (activeChannel && logEntries?.length) {
			const hasLogLevelFilter = !filters.trace || !filters.debug || !filters.info || !filters.warning || !filters.error;

			const fromLogLevelEntryIndex = logEntries.findIndex(entry => fromLineNumber >= entry.range.startLineNumber && fromLineNumber <= entry.range.endLineNumber);
			if (fromLogLevelEntryIndex === -1) {
				return { findMatches, hiddenAreas, categories };
			}

			for (let i = fromLogLevelEntryIndex; i < logEntries.length; i++) {
				const entry = logEntries[i];
				if (entry.category) {
					categories.set(`${activeChannel.id}:${entry.category}`, entry.category);
				}
				if (hasLogLevelFilter && !this.shouldShowLogLevel(entry, filters)) {
					hiddenAreas.push(entry.range);
					continue;
				}
				if (!this.shouldShowCategory(activeChannel.id, entry, filters)) {
					hiddenAreas.push(entry.range);
					continue;
				}
				if (filters.includePatterns.length > 0 || filters.excludePatterns.length > 0) {
					const result = this.shouldShowLine(model, entry.range, filters.includePatterns, filters.excludePatterns);
					if (result.show) {
						findMatches.push(...result.matches);
					} else {
						hiddenAreas.push(entry.range);
					}
				}
			}
			return { findMatches, hiddenAreas, categories };
		}

		if (filters.includePatterns.length === 0 && filters.excludePatterns.length === 0) {
			return { findMatches, hiddenAreas, categories };
		}

		const lineCount = model.getLineCount();
		for (let lineNumber = fromLineNumber; lineNumber <= lineCount; lineNumber++) {
			const lineRange = new Range(lineNumber, 1, lineNumber, model.getLineMaxColumn(lineNumber));
			const result = this.shouldShowLine(model, lineRange, filters.includePatterns, filters.excludePatterns);
			if (result.show) {
				findMatches.push(...result.matches);
			} else {
				hiddenAreas.push(lineRange);
			}
		}
		return { findMatches, hiddenAreas, categories };
	}

	private shouldShowLogLevel(entry: ILogEntry, filters: IOutputViewFilters): boolean {
		switch (entry.logLevel) {
			case LogLevel.Trace:
				return filters.trace;
			case LogLevel.Debug:
				return filters.debug;
			case LogLevel.Info:
				return filters.info;
			case LogLevel.Warning:
				return filters.warning;
			case LogLevel.Error:
				return filters.error;
		}
		return true;
	}

	private shouldShowCategory(activeChannelId: string, entry: ILogEntry, filters: IOutputViewFilters): boolean {
		if (!entry.category) {
			return true;
		}
		return !filters.hasCategory(`${activeChannelId}:${entry.category}`);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/output/common/outputChannelModel.ts]---
Location: vscode-main/src/vs/workbench/contrib/output/common/outputChannelModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import * as resources from '../../../../base/common/resources.js';
import { ITextModel } from '../../../../editor/common/model.js';
import { IEditorWorkerService } from '../../../../editor/common/services/editorWorker.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { URI } from '../../../../base/common/uri.js';
import { Promises, ThrottledDelayer } from '../../../../base/common/async.js';
import { FileOperationResult, IFileService, toFileOperationResult } from '../../../../platform/files/common/files.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { ILanguageSelection } from '../../../../editor/common/languages/language.js';
import { Disposable, toDisposable, IDisposable, MutableDisposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { isNumber } from '../../../../base/common/types.js';
import { EditOperation, ISingleEditOperation } from '../../../../editor/common/core/editOperation.js';
import { Position } from '../../../../editor/common/core/position.js';
import { Range } from '../../../../editor/common/core/range.js';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { ILogger, ILoggerService, ILogService, LogLevel } from '../../../../platform/log/common/log.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { ILogEntry, IOutputContentSource, LOG_MIME, OutputChannelUpdateMode } from '../../../services/output/common/output.js';
import { isCancellationError } from '../../../../base/common/errors.js';
import { TextModel } from '../../../../editor/common/model/textModel.js';
import { binarySearch, sortedDiff } from '../../../../base/common/arrays.js';

const LOG_ENTRY_REGEX = /^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3})\s(\[(info|trace|debug|error|warning)\])\s(\[(.*?)\])?/;

export function parseLogEntryAt(model: ITextModel, lineNumber: number): ILogEntry | null {
	const lineContent = model.getLineContent(lineNumber);
	const match = LOG_ENTRY_REGEX.exec(lineContent);
	if (match) {
		const timestamp = new Date(match[1]).getTime();
		const timestampRange = new Range(lineNumber, 1, lineNumber, match[1].length);
		const logLevel = parseLogLevel(match[3]);
		const logLevelRange = new Range(lineNumber, timestampRange.endColumn + 1, lineNumber, timestampRange.endColumn + 1 + match[2].length);
		const category = match[5];
		const startLine = lineNumber;
		let endLine = lineNumber;

		const lineCount = model.getLineCount();
		while (endLine < lineCount) {
			const nextLineContent = model.getLineContent(endLine + 1);
			const isLastLine = endLine + 1 === lineCount && nextLineContent === ''; // Last line will be always empty
			if (LOG_ENTRY_REGEX.test(nextLineContent) || isLastLine) {
				break;
			}
			endLine++;
		}
		const range = new Range(startLine, 1, endLine, model.getLineMaxColumn(endLine));
		return { range, timestamp, timestampRange, logLevel, logLevelRange, category };
	}
	return null;
}

function* logEntryIterator<T>(model: ITextModel, process: (logEntry: ILogEntry) => T): IterableIterator<T> {
	for (let lineNumber = 1; lineNumber <= model.getLineCount(); lineNumber++) {
		const logEntry = parseLogEntryAt(model, lineNumber);
		if (logEntry) {
			yield process(logEntry);
			lineNumber = logEntry.range.endLineNumber;
		}
	}
}

function changeStartLineNumber(logEntry: ILogEntry, lineNumber: number): ILogEntry {
	return {
		...logEntry,
		range: new Range(lineNumber, logEntry.range.startColumn, lineNumber + logEntry.range.endLineNumber - logEntry.range.startLineNumber, logEntry.range.endColumn),
		timestampRange: new Range(lineNumber, logEntry.timestampRange.startColumn, lineNumber, logEntry.timestampRange.endColumn),
		logLevelRange: new Range(lineNumber, logEntry.logLevelRange.startColumn, lineNumber, logEntry.logLevelRange.endColumn),
	};
}

function parseLogLevel(level: string): LogLevel {
	switch (level.toLowerCase()) {
		case 'trace':
			return LogLevel.Trace;
		case 'debug':
			return LogLevel.Debug;
		case 'info':
			return LogLevel.Info;
		case 'warning':
			return LogLevel.Warning;
		case 'error':
			return LogLevel.Error;
		default:
			throw new Error(`Unknown log level: ${level}`);
	}
}

export interface IOutputChannelModel extends IDisposable {
	readonly onDispose: Event<void>;
	readonly source: IOutputContentSource | ReadonlyArray<IOutputContentSource>;
	getLogEntries(): ReadonlyArray<ILogEntry>;
	append(output: string): void;
	update(mode: OutputChannelUpdateMode, till: number | undefined, immediate: boolean): void;
	updateChannelSources(sources: ReadonlyArray<IOutputContentSource>): void;
	loadModel(): Promise<ITextModel>;
	clear(): void;
	replace(value: string): void;
}

interface IContentProvider {
	readonly onDidAppend: Event<void>;
	readonly onDidReset: Event<void>;
	reset(): void;
	watch(): void;
	unwatch(): void;
	getContent(): Promise<{ readonly content: string; readonly consume: () => void }>;
	getLogEntries(): ReadonlyArray<ILogEntry>;
}

class FileContentProvider extends Disposable implements IContentProvider {

	private readonly _onDidAppend = new Emitter<void>();
	get onDidAppend() { return this._onDidAppend.event; }

	private readonly _onDidReset = new Emitter<void>();
	get onDidReset() { return this._onDidReset.event; }

	private watching: boolean = false;
	private syncDelayer: ThrottledDelayer<void>;
	private etag: string | undefined = '';

	private logEntries: ILogEntry[] = [];
	private startOffset: number = 0;
	private endOffset: number = 0;

	readonly resource: URI;
	readonly name: string;

	constructor(
		{ name, resource }: IOutputContentSource,
		@IFileService private readonly fileService: IFileService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@ILogService private readonly logService: ILogService,
	) {
		super();

		this.name = name ?? '';
		this.resource = resource;
		this.syncDelayer = new ThrottledDelayer<void>(500);
		this._register(toDisposable(() => this.unwatch()));
	}

	reset(offset?: number): void {
		this.endOffset = this.startOffset = offset ?? this.startOffset;
		this.logEntries = [];
	}

	resetToEnd(): void {
		this.startOffset = this.endOffset;
		this.logEntries = [];
	}

	watch(): void {
		if (!this.watching) {
			this.logService.trace('Started polling', this.resource.toString());
			this.poll();
			this.watching = true;
		}
	}

	unwatch(): void {
		if (this.watching) {
			this.syncDelayer.cancel();
			this.watching = false;
			this.logService.trace('Stopped polling', this.resource.toString());
		}
	}

	private poll(): void {
		const loop = () => this.doWatch().then(() => this.poll());
		this.syncDelayer.trigger(loop).catch(error => {
			if (!isCancellationError(error)) {
				throw error;
			}
		});
	}

	private async doWatch(): Promise<void> {
		try {
			if (!this.fileService.hasProvider(this.resource)) {
				return;
			}
			const stat = await this.fileService.stat(this.resource);
			if (stat.etag !== this.etag) {
				this.etag = stat.etag;
				if (isNumber(stat.size) && this.endOffset > stat.size) {
					this.reset(0);
					this._onDidReset.fire();
				} else {
					this._onDidAppend.fire();
				}
			}
		} catch (error) {
			if (toFileOperationResult(error) !== FileOperationResult.FILE_NOT_FOUND) {
				throw error;
			}
		}
	}

	getLogEntries(): ReadonlyArray<ILogEntry> {
		return this.logEntries;
	}

	async getContent(donotConsumeLogEntries?: boolean): Promise<{ readonly name: string; readonly content: string; readonly consume: () => void }> {
		try {
			if (!this.fileService.hasProvider(this.resource)) {
				return {
					name: this.name,
					content: '',
					consume: () => { /* No Op */ }
				};
			}
			const fileContent = await this.fileService.readFile(this.resource, { position: this.endOffset });
			const content = fileContent.value.toString();
			const logEntries = donotConsumeLogEntries ? [] : this.parseLogEntries(content, this.logEntries[this.logEntries.length - 1]);
			let consumed = false;
			return {
				name: this.name,
				content,
				consume: () => {
					if (!consumed) {
						consumed = true;
						this.endOffset += fileContent.value.byteLength;
						this.etag = fileContent.etag;
						this.logEntries.push(...logEntries);
					}
				}
			};
		} catch (error) {
			if (toFileOperationResult(error) !== FileOperationResult.FILE_NOT_FOUND) {
				throw error;
			}
			return {
				name: this.name,
				content: '',
				consume: () => { /* No Op */ }
			};
		}
	}

	private parseLogEntries(content: string, lastLogEntry: ILogEntry | undefined): ILogEntry[] {
		const model = this.instantiationService.createInstance(TextModel, content, LOG_MIME, TextModel.DEFAULT_CREATION_OPTIONS, null);
		try {
			if (!parseLogEntryAt(model, 1)) {
				return [];
			}
			const logEntries: ILogEntry[] = [];
			let logEntryStartLineNumber = lastLogEntry ? lastLogEntry.range.endLineNumber + 1 : 1;
			for (const entry of logEntryIterator(model, (e) => changeStartLineNumber(e, logEntryStartLineNumber))) {
				logEntries.push(entry);
				logEntryStartLineNumber = entry.range.endLineNumber + 1;
			}
			return logEntries;
		} finally {
			model.dispose();
		}
	}
}

class MultiFileContentProvider extends Disposable implements IContentProvider {

	private readonly _onDidAppend = this._register(new Emitter<void>());
	readonly onDidAppend = this._onDidAppend.event;
	readonly onDidReset = Event.None;

	private logEntries: ILogEntry[] = [];
	private readonly fileContentProviderItems: [FileContentProvider, DisposableStore][] = [];

	private watching: boolean = false;

	constructor(
		filesInfos: IOutputContentSource[],
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IFileService private readonly fileService: IFileService,
		@ILogService private readonly logService: ILogService,
	) {
		super();
		for (const file of filesInfos) {
			this.fileContentProviderItems.push(this.createFileContentProvider(file));
		}
		this._register(toDisposable(() => {
			for (const [, disposables] of this.fileContentProviderItems) {
				disposables.dispose();
			}
		}));
	}

	private createFileContentProvider(file: IOutputContentSource): [FileContentProvider, DisposableStore] {
		const disposables = new DisposableStore();
		const fileOutput = disposables.add(new FileContentProvider(file, this.fileService, this.instantiationService, this.logService));
		disposables.add(fileOutput.onDidAppend(() => this._onDidAppend.fire()));
		return [fileOutput, disposables];
	}

	watch(): void {
		if (!this.watching) {
			this.watching = true;
			for (const [output] of this.fileContentProviderItems) {
				output.watch();
			}
		}
	}

	unwatch(): void {
		if (this.watching) {
			this.watching = false;
			for (const [output] of this.fileContentProviderItems) {
				output.unwatch();
			}
		}
	}

	updateFiles(files: IOutputContentSource[]): void {
		const wasWatching = this.watching;
		if (wasWatching) {
			this.unwatch();
		}

		const result = sortedDiff(this.fileContentProviderItems.map(([output]) => output), files, (a, b) => resources.extUri.compare(a.resource, b.resource));
		for (const { start, deleteCount, toInsert } of result) {
			const outputs = toInsert.map(file => this.createFileContentProvider(file));
			const outputsToRemove = this.fileContentProviderItems.splice(start, deleteCount, ...outputs);
			for (const [, disposables] of outputsToRemove) {
				disposables.dispose();
			}
		}

		if (wasWatching) {
			this.watch();
		}
	}

	reset(): void {
		for (const [output] of this.fileContentProviderItems) {
			output.reset();
		}
		this.logEntries = [];
	}

	resetToEnd(): void {
		for (const [output] of this.fileContentProviderItems) {
			output.resetToEnd();
		}
		this.logEntries = [];
	}

	getLogEntries(): ReadonlyArray<ILogEntry> {
		return this.logEntries;
	}

	async getContent(): Promise<{ readonly content: string; readonly consume: () => void }> {
		const outputs = await Promise.all(this.fileContentProviderItems.map(([output]) => output.getContent(true)));
		const { content, logEntries } = this.combineLogEntries(outputs, this.logEntries[this.logEntries.length - 1]);
		let consumed = false;
		return {
			content,
			consume: () => {
				if (!consumed) {
					consumed = true;
					outputs.forEach(({ consume }) => consume());
					this.logEntries.push(...logEntries);
				}
			}
		};
	}

	private combineLogEntries(outputs: { content: string; name: string }[], lastEntry: ILogEntry | undefined): { logEntries: ILogEntry[]; content: string } {

		outputs = outputs.filter(output => !!output.content);

		if (outputs.length === 0) {
			return { logEntries: [], content: '' };
		}

		const logEntries: ILogEntry[] = [];
		const contents: string[] = [];
		const process = (model: ITextModel, logEntry: ILogEntry, name: string): [ILogEntry, string] => {
			const lineContent = model.getValueInRange(logEntry.range);
			const content = name ? `${lineContent.substring(0, logEntry.logLevelRange.endColumn)} [${name}]${lineContent.substring(logEntry.logLevelRange.endColumn)}` : lineContent;
			return [{
				...logEntry,
				category: name,
				range: new Range(logEntry.range.startLineNumber, logEntry.logLevelRange.startColumn, logEntry.range.endLineNumber, name ? logEntry.range.endColumn + name.length + 3 : logEntry.range.endColumn),
			}, content];
		};

		const model = this.instantiationService.createInstance(TextModel, outputs[0].content, LOG_MIME, TextModel.DEFAULT_CREATION_OPTIONS, null);
		try {
			for (const [logEntry, content] of logEntryIterator(model, (e) => process(model, e, outputs[0].name))) {
				logEntries.push(logEntry);
				contents.push(content);
			}
		} finally {
			model.dispose();
		}

		for (let index = 1; index < outputs.length; index++) {
			const { content, name } = outputs[index];
			const model = this.instantiationService.createInstance(TextModel, content, LOG_MIME, TextModel.DEFAULT_CREATION_OPTIONS, null);
			try {
				const iterator = logEntryIterator(model, (e) => process(model, e, name));
				let next = iterator.next();
				while (!next.done) {
					const [logEntry, content] = next.value;
					const logEntriesToAdd = [logEntry];
					const contentsToAdd = [content];

					let insertionIndex;

					// If the timestamp is greater than or equal to the last timestamp,
					// we can just append all the entries at the end
					if (logEntry.timestamp >= logEntries[logEntries.length - 1].timestamp) {
						insertionIndex = logEntries.length;
						for (next = iterator.next(); !next.done; next = iterator.next()) {
							logEntriesToAdd.push(next.value[0]);
							contentsToAdd.push(next.value[1]);
						}
					}
					else {
						if (logEntry.timestamp <= logEntries[0].timestamp) {
							// If the timestamp is less than or equal to the first timestamp
							// then insert at the beginning
							insertionIndex = 0;
						} else {
							// Otherwise, find the insertion index
							const idx = binarySearch(logEntries, logEntry, (a, b) => a.timestamp - b.timestamp);
							insertionIndex = idx < 0 ? ~idx : idx;
						}

						// Collect all entries that have a timestamp less than or equal to the timestamp at the insertion index
						for (next = iterator.next(); !next.done && next.value[0].timestamp <= logEntries[insertionIndex].timestamp; next = iterator.next()) {
							logEntriesToAdd.push(next.value[0]);
							contentsToAdd.push(next.value[1]);
						}
					}

					contents.splice(insertionIndex, 0, ...contentsToAdd);
					logEntries.splice(insertionIndex, 0, ...logEntriesToAdd);
				}
			} finally {
				model.dispose();
			}
		}

		let content = '';
		const updatedLogEntries: ILogEntry[] = [];
		let logEntryStartLineNumber = lastEntry ? lastEntry.range.endLineNumber + 1 : 1;
		for (let i = 0; i < logEntries.length; i++) {
			content += contents[i] + '\n';
			const updatedLogEntry = changeStartLineNumber(logEntries[i], logEntryStartLineNumber);
			updatedLogEntries.push(updatedLogEntry);
			logEntryStartLineNumber = updatedLogEntry.range.endLineNumber + 1;
		}

		return { logEntries: updatedLogEntries, content };
	}

}

export abstract class AbstractFileOutputChannelModel extends Disposable implements IOutputChannelModel {

	private readonly _onDispose = this._register(new Emitter<void>());
	readonly onDispose: Event<void> = this._onDispose.event;

	protected loadModelPromise: Promise<ITextModel> | null = null;

	private readonly modelDisposable = this._register(new MutableDisposable<DisposableStore>());
	protected model: ITextModel | null = null;
	private modelUpdateInProgress: boolean = false;
	private readonly modelUpdateCancellationSource = this._register(new MutableDisposable<CancellationTokenSource>());
	private readonly appendThrottler = this._register(new ThrottledDelayer(300));
	private replacePromise: Promise<void> | undefined;

	abstract readonly source: IOutputContentSource | ReadonlyArray<IOutputContentSource>;

	constructor(
		private readonly modelUri: URI,
		private readonly language: ILanguageSelection,
		private readonly outputContentProvider: IContentProvider,
		@IModelService protected readonly modelService: IModelService,
		@IEditorWorkerService private readonly editorWorkerService: IEditorWorkerService,
	) {
		super();
	}

	async loadModel(): Promise<ITextModel> {
		this.loadModelPromise = Promises.withAsyncBody<ITextModel>(async (c, e) => {
			try {
				this.modelDisposable.value = new DisposableStore();
				this.model = this.modelService.createModel('', this.language, this.modelUri);
				const { content, consume } = await this.outputContentProvider.getContent();
				consume();
				this.doAppendContent(this.model, content);
				this.modelDisposable.value.add(this.outputContentProvider.onDidReset(() => this.onDidContentChange(true, true)));
				this.modelDisposable.value.add(this.outputContentProvider.onDidAppend(() => this.onDidContentChange(false, false)));
				this.outputContentProvider.watch();
				this.modelDisposable.value.add(toDisposable(() => this.outputContentProvider.unwatch()));
				this.modelDisposable.value.add(this.model.onWillDispose(() => {
					this.outputContentProvider.reset();
					this.modelDisposable.value = undefined;
					this.cancelModelUpdate();
					this.model = null;
				}));
				c(this.model);
			} catch (error) {
				e(error);
			}
		});
		return this.loadModelPromise;
	}

	getLogEntries(): readonly ILogEntry[] {
		return this.outputContentProvider.getLogEntries();
	}

	private onDidContentChange(reset: boolean, appendImmediately: boolean): void {
		if (reset && !this.modelUpdateInProgress) {
			this.doUpdate(OutputChannelUpdateMode.Clear, true);
		}
		this.doUpdate(OutputChannelUpdateMode.Append, appendImmediately);
	}

	protected doUpdate(mode: OutputChannelUpdateMode, immediate: boolean): void {
		if (mode === OutputChannelUpdateMode.Clear || mode === OutputChannelUpdateMode.Replace) {
			this.cancelModelUpdate();
		}
		if (!this.model) {
			return;
		}

		this.modelUpdateInProgress = true;
		if (!this.modelUpdateCancellationSource.value) {
			this.modelUpdateCancellationSource.value = new CancellationTokenSource();
		}
		const token = this.modelUpdateCancellationSource.value.token;

		if (mode === OutputChannelUpdateMode.Clear) {
			this.clearContent(this.model);
		}

		else if (mode === OutputChannelUpdateMode.Replace) {
			this.replacePromise = this.replaceContent(this.model, token).finally(() => this.replacePromise = undefined);
		}

		else {
			this.appendContent(this.model, immediate, token);
		}
	}

	private clearContent(model: ITextModel): void {
		model.applyEdits([EditOperation.delete(model.getFullModelRange())]);
		this.modelUpdateInProgress = false;
	}

	private appendContent(model: ITextModel, immediate: boolean, token: CancellationToken): void {
		this.appendThrottler.trigger(async () => {
			/* Abort if operation is cancelled */
			if (token.isCancellationRequested) {
				return;
			}

			/* Wait for replace to finish */
			if (this.replacePromise) {
				try { await this.replacePromise; } catch (e) { /* Ignore */ }
				/* Abort if operation is cancelled */
				if (token.isCancellationRequested) {
					return;
				}
			}

			/* Get content to append */
			const { content, consume } = await this.outputContentProvider.getContent();
			/* Abort if operation is cancelled */
			if (token.isCancellationRequested) {
				return;
			}

			/* Appned Content */
			consume();
			this.doAppendContent(model, content);
			this.modelUpdateInProgress = false;
		}, immediate ? 0 : undefined).catch(error => {
			if (!isCancellationError(error)) {
				throw error;
			}
		});
	}

	private doAppendContent(model: ITextModel, content: string): void {
		const lastLine = model.getLineCount();
		const lastLineMaxColumn = model.getLineMaxColumn(lastLine);
		model.applyEdits([EditOperation.insert(new Position(lastLine, lastLineMaxColumn), content)]);
	}

	private async replaceContent(model: ITextModel, token: CancellationToken): Promise<void> {
		/* Get content to replace */
		const { content, consume } = await this.outputContentProvider.getContent();
		/* Abort if operation is cancelled */
		if (token.isCancellationRequested) {
			return;
		}

		/* Compute Edits */
		const edits = await this.getReplaceEdits(model, content.toString());
		/* Abort if operation is cancelled */
		if (token.isCancellationRequested) {
			return;
		}

		consume();
		if (edits.length) {
			/* Apply Edits */
			model.applyEdits(edits);
		}
		this.modelUpdateInProgress = false;
	}

	private async getReplaceEdits(model: ITextModel, contentToReplace: string): Promise<ISingleEditOperation[]> {
		if (!contentToReplace) {
			return [EditOperation.delete(model.getFullModelRange())];
		}
		if (contentToReplace !== model.getValue()) {
			const edits = await this.editorWorkerService.computeMoreMinimalEdits(model.uri, [{ text: contentToReplace.toString(), range: model.getFullModelRange() }]);
			if (edits?.length) {
				return edits.map(edit => EditOperation.replace(Range.lift(edit.range), edit.text));
			}
		}
		return [];
	}

	protected cancelModelUpdate(): void {
		this.modelUpdateCancellationSource.value?.cancel();
		this.modelUpdateCancellationSource.value = undefined;
		this.appendThrottler.cancel();
		this.replacePromise = undefined;
		this.modelUpdateInProgress = false;
	}

	protected isVisible(): boolean {
		return !!this.model;
	}

	override dispose(): void {
		this._onDispose.fire();
		super.dispose();
	}

	append(message: string): void { throw new Error('Not supported'); }
	replace(message: string): void { throw new Error('Not supported'); }

	abstract clear(): void;
	abstract update(mode: OutputChannelUpdateMode, till: number | undefined, immediate: boolean): void;
	abstract updateChannelSources(files: IOutputContentSource[]): void;
}

export class FileOutputChannelModel extends AbstractFileOutputChannelModel implements IOutputChannelModel {

	private readonly fileOutput: FileContentProvider;

	constructor(
		modelUri: URI,
		language: ILanguageSelection,
		readonly source: IOutputContentSource,
		@IFileService fileService: IFileService,
		@IModelService modelService: IModelService,
		@IInstantiationService instantiationService: IInstantiationService,
		@ILogService logService: ILogService,
		@IEditorWorkerService editorWorkerService: IEditorWorkerService,
	) {
		const fileOutput = new FileContentProvider(source, fileService, instantiationService, logService);
		super(modelUri, language, fileOutput, modelService, editorWorkerService);
		this.fileOutput = this._register(fileOutput);
	}

	override clear(): void {
		this.update(OutputChannelUpdateMode.Clear, undefined, true);
	}

	override update(mode: OutputChannelUpdateMode, till: number | undefined, immediate: boolean): void {
		const loadModelPromise = this.loadModelPromise ? this.loadModelPromise : Promise.resolve();
		loadModelPromise.then(() => {
			if (mode === OutputChannelUpdateMode.Clear || mode === OutputChannelUpdateMode.Replace) {
				if (isNumber(till)) {
					this.fileOutput.reset(till);
				} else {
					this.fileOutput.resetToEnd();
				}
			}
			this.doUpdate(mode, immediate);
		});
	}

	override updateChannelSources(files: IOutputContentSource[]): void { throw new Error('Not supported'); }
}

export class MultiFileOutputChannelModel extends AbstractFileOutputChannelModel implements IOutputChannelModel {

	private readonly multifileOutput: MultiFileContentProvider;

	constructor(
		modelUri: URI,
		language: ILanguageSelection,
		readonly source: IOutputContentSource[],
		@IFileService fileService: IFileService,
		@IModelService modelService: IModelService,
		@ILogService logService: ILogService,
		@IEditorWorkerService editorWorkerService: IEditorWorkerService,
		@IInstantiationService instantiationService: IInstantiationService,
	) {
		const multifileOutput = new MultiFileContentProvider(source, instantiationService, fileService, logService);
		super(modelUri, language, multifileOutput, modelService, editorWorkerService);
		this.multifileOutput = this._register(multifileOutput);
	}

	override updateChannelSources(files: IOutputContentSource[]): void {
		this.multifileOutput.unwatch();
		this.multifileOutput.updateFiles(files);
		this.multifileOutput.reset();
		this.doUpdate(OutputChannelUpdateMode.Replace, true);
		if (this.isVisible()) {
			this.multifileOutput.watch();
		}
	}

	override clear(): void {
		const loadModelPromise = this.loadModelPromise ? this.loadModelPromise : Promise.resolve();
		loadModelPromise.then(() => {
			this.multifileOutput.resetToEnd();
			this.doUpdate(OutputChannelUpdateMode.Clear, true);
		});
	}

	override update(mode: OutputChannelUpdateMode, till: number | undefined, immediate: boolean): void { throw new Error('Not supported'); }
}

class OutputChannelBackedByFile extends FileOutputChannelModel implements IOutputChannelModel {

	private logger: ILogger;
	private _offset: number;

	constructor(
		id: string,
		modelUri: URI,
		language: ILanguageSelection,
		file: URI,
		@IFileService fileService: IFileService,
		@IModelService modelService: IModelService,
		@ILoggerService loggerService: ILoggerService,
		@IInstantiationService instantiationService: IInstantiationService,
		@ILogService logService: ILogService,
		@IEditorWorkerService editorWorkerService: IEditorWorkerService
	) {
		super(modelUri, language, { resource: file, name: '' }, fileService, modelService, instantiationService, logService, editorWorkerService);

		// Donot rotate to check for the file reset
		this.logger = loggerService.createLogger(file, { logLevel: 'always', donotRotate: true, donotUseFormatters: true, hidden: true });
		this._offset = 0;
	}

	override append(message: string): void {
		this.write(message);
		this.update(OutputChannelUpdateMode.Append, undefined, this.isVisible());
	}

	override replace(message: string): void {
		const till = this._offset;
		this.write(message);
		this.update(OutputChannelUpdateMode.Replace, till, true);
	}

	private write(content: string): void {
		this._offset += VSBuffer.fromString(content).byteLength;
		this.logger.info(content);
		if (this.isVisible()) {
			this.logger.flush();
		}
	}

}

export class DelegatedOutputChannelModel extends Disposable implements IOutputChannelModel {

	private readonly _onDispose: Emitter<void> = this._register(new Emitter<void>());
	readonly onDispose: Event<void> = this._onDispose.event;

	private readonly outputChannelModel: Promise<IOutputChannelModel>;
	readonly source: IOutputContentSource;

	constructor(
		id: string,
		modelUri: URI,
		language: ILanguageSelection,
		outputDir: URI,
		outputDirCreationPromise: Promise<void>,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IFileService private readonly fileService: IFileService,
	) {
		super();
		this.outputChannelModel = this.createOutputChannelModel(id, modelUri, language, outputDir, outputDirCreationPromise);
		const resource = resources.joinPath(outputDir, `${id.replace(/[\\/:\*\?"<>\|]/g, '')}.log`);
		this.source = { resource };
	}

	private async createOutputChannelModel(id: string, modelUri: URI, language: ILanguageSelection, outputDir: URI, outputDirPromise: Promise<void>): Promise<IOutputChannelModel> {
		await outputDirPromise;
		const file = resources.joinPath(outputDir, `${id.replace(/[\\/:\*\?"<>\|]/g, '')}.log`);
		await this.fileService.createFile(file);
		const outputChannelModel = this._register(this.instantiationService.createInstance(OutputChannelBackedByFile, id, modelUri, language, file));
		this._register(outputChannelModel.onDispose(() => this._onDispose.fire()));
		return outputChannelModel;
	}

	getLogEntries(): readonly ILogEntry[] {
		return [];
	}

	append(output: string): void {
		this.outputChannelModel.then(outputChannelModel => outputChannelModel.append(output));
	}

	update(mode: OutputChannelUpdateMode, till: number | undefined, immediate: boolean): void {
		this.outputChannelModel.then(outputChannelModel => outputChannelModel.update(mode, till, immediate));
	}

	loadModel(): Promise<ITextModel> {
		return this.outputChannelModel.then(outputChannelModel => outputChannelModel.loadModel());
	}

	clear(): void {
		this.outputChannelModel.then(outputChannelModel => outputChannelModel.clear());
	}

	replace(value: string): void {
		this.outputChannelModel.then(outputChannelModel => outputChannelModel.replace(value));
	}

	updateChannelSources(files: IOutputContentSource[]): void {
		this.outputChannelModel.then(outputChannelModel => outputChannelModel.updateChannelSources(files));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/output/common/outputLinkComputer.ts]---
Location: vscode-main/src/vs/workbench/contrib/output/common/outputLinkComputer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ILink } from '../../../../editor/common/languages.js';
import { URI } from '../../../../base/common/uri.js';
import * as extpath from '../../../../base/common/extpath.js';
import * as resources from '../../../../base/common/resources.js';
import * as strings from '../../../../base/common/strings.js';
import { Range } from '../../../../editor/common/core/range.js';
import { isWindows } from '../../../../base/common/platform.js';
import { Schemas } from '../../../../base/common/network.js';
import { IWebWorkerServerRequestHandler, IWebWorkerServer } from '../../../../base/common/worker/webWorker.js';
import { WorkerTextModelSyncServer, ICommonModel } from '../../../../editor/common/services/textModelSync/textModelSync.impl.js';

export interface IResourceCreator {
	toResource: (folderRelativePath: string) => URI | null;
}

export class OutputLinkComputer implements IWebWorkerServerRequestHandler {
	_requestHandlerBrand: void = undefined;

	private readonly workerTextModelSyncServer = new WorkerTextModelSyncServer();
	private patterns = new Map<URI /* folder uri */, RegExp[]>();

	constructor(workerServer: IWebWorkerServer) {
		this.workerTextModelSyncServer.bindToServer(workerServer);
	}

	$setWorkspaceFolders(workspaceFolders: string[]) {
		this.computePatterns(workspaceFolders);
	}

	private computePatterns(_workspaceFolders: string[]): void {

		// Produce patterns for each workspace root we are configured with
		// This means that we will be able to detect links for paths that
		// contain any of the workspace roots as segments.
		const workspaceFolders = _workspaceFolders
			.sort((resourceStrA, resourceStrB) => resourceStrB.length - resourceStrA.length) // longest paths first (for https://github.com/microsoft/vscode/issues/88121)
			.map(resourceStr => URI.parse(resourceStr));

		for (const workspaceFolder of workspaceFolders) {
			const patterns = OutputLinkComputer.createPatterns(workspaceFolder);
			this.patterns.set(workspaceFolder, patterns);
		}
	}

	private getModel(uri: string): ICommonModel | undefined {
		return this.workerTextModelSyncServer.getModel(uri);
	}

	$computeLinks(uri: string): ILink[] {
		const model = this.getModel(uri);
		if (!model) {
			return [];
		}

		const links: ILink[] = [];
		const lines = strings.splitLines(model.getValue());

		// For each workspace root patterns
		for (const [folderUri, folderPatterns] of this.patterns) {
			const resourceCreator: IResourceCreator = {
				toResource: (folderRelativePath: string): URI | null => {
					if (typeof folderRelativePath === 'string') {
						return resources.joinPath(folderUri, folderRelativePath);
					}

					return null;
				}
			};

			for (let i = 0, len = lines.length; i < len; i++) {
				links.push(...OutputLinkComputer.detectLinks(lines[i], i + 1, folderPatterns, resourceCreator));
			}
		}

		return links;
	}

	static createPatterns(workspaceFolder: URI): RegExp[] {
		const patterns: RegExp[] = [];

		const workspaceFolderPath = workspaceFolder.scheme === Schemas.file ? workspaceFolder.fsPath : workspaceFolder.path;
		const workspaceFolderVariants = [workspaceFolderPath];
		if (isWindows && workspaceFolder.scheme === Schemas.file) {
			workspaceFolderVariants.push(extpath.toSlashes(workspaceFolderPath));
		}

		for (const workspaceFolderVariant of workspaceFolderVariants) {
			const validPathCharacterPattern = '[^\\s\\(\\):<>\'"]';
			const validPathCharacterOrSpacePattern = `(?:${validPathCharacterPattern}| ${validPathCharacterPattern})`;
			const pathPattern = `${validPathCharacterOrSpacePattern}+\\.${validPathCharacterPattern}+`;
			const strictPathPattern = `${validPathCharacterPattern}+`;

			// Example: /workspaces/express/server.js on line 8, column 13
			patterns.push(new RegExp(strings.escapeRegExpCharacters(workspaceFolderVariant) + `(${pathPattern}) on line ((\\d+)(, column (\\d+))?)`, 'gi'));

			// Example: /workspaces/express/server.js:line 8, column 13
			patterns.push(new RegExp(strings.escapeRegExpCharacters(workspaceFolderVariant) + `(${pathPattern}):line ((\\d+)(, column (\\d+))?)`, 'gi'));

			// Example: /workspaces/mankala/Features.ts(45): error
			// Example: /workspaces/mankala/Features.ts (45): error
			// Example: /workspaces/mankala/Features.ts(45,18): error
			// Example: /workspaces/mankala/Features.ts (45,18): error
			// Example: /workspaces/mankala/Features Special.ts (45,18): error
			patterns.push(new RegExp(strings.escapeRegExpCharacters(workspaceFolderVariant) + `(${pathPattern})(\\s?\\((\\d+)(,(\\d+))?)\\)`, 'gi'));

			// Example: at /workspaces/mankala/Game.ts
			// Example: at /workspaces/mankala/Game.ts:336
			// Example: at /workspaces/mankala/Game.ts:336:9
			patterns.push(new RegExp(strings.escapeRegExpCharacters(workspaceFolderVariant) + `(${strictPathPattern})(:(\\d+))?(:(\\d+))?`, 'gi'));
		}

		return patterns;
	}

	/**
	 * Detect links. Made static to allow for tests.
	 */
	static detectLinks(line: string, lineIndex: number, patterns: RegExp[], resourceCreator: IResourceCreator): ILink[] {
		const links: ILink[] = [];

		patterns.forEach(pattern => {
			pattern.lastIndex = 0; // the holy grail of software development

			let match: RegExpExecArray | null;
			let offset = 0;
			while ((match = pattern.exec(line)) !== null) {

				// Convert the relative path information to a resource that we can use in links
				const folderRelativePath = strings.rtrim(match[1], '.').replace(/\\/g, '/'); // remove trailing "." that likely indicate end of sentence
				let resourceString: string | undefined;
				try {
					const resource = resourceCreator.toResource(folderRelativePath);
					if (resource) {
						resourceString = resource.toString();
					}
				} catch (error) {
					continue; // we might find an invalid URI and then we dont want to loose all other links
				}

				// Append line/col information to URI if matching
				if (match[3]) {
					const lineNumber = match[3];

					if (match[5]) {
						const columnNumber = match[5];
						resourceString = strings.format('{0}#{1},{2}', resourceString, lineNumber, columnNumber);
					} else {
						resourceString = strings.format('{0}#{1}', resourceString, lineNumber);
					}
				}

				const fullMatch = strings.rtrim(match[0], '.'); // remove trailing "." that likely indicate end of sentence

				const index = line.indexOf(fullMatch, offset);
				offset = index + fullMatch.length;

				const linkRange = {
					startColumn: index + 1,
					startLineNumber: lineIndex,
					endColumn: index + 1 + fullMatch.length,
					endLineNumber: lineIndex
				};

				if (links.some(link => Range.areIntersectingOrTouching(link.range, linkRange))) {
					return; // Do not detect duplicate links
				}

				links.push({
					range: linkRange,
					url: resourceString
				});
			}
		});

		return links;
	}
}

export function create(workerServer: IWebWorkerServer): OutputLinkComputer {
	return new OutputLinkComputer(workerServer);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/output/common/outputLinkComputerMain.ts]---
Location: vscode-main/src/vs/workbench/contrib/output/common/outputLinkComputerMain.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { create } from './outputLinkComputer.js';
import { bootstrapWebWorker } from '../../../../base/common/worker/webWorkerBootstrap.js';

bootstrapWebWorker(create);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/output/test/browser/outputChannelModel.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/output/test/browser/outputChannelModel.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { parseLogEntryAt } from '../../common/outputChannelModel.js';
import { TextModel } from '../../../../../editor/common/model/textModel.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { LogLevel } from '../../../../../platform/log/common/log.js';
import { workbenchInstantiationService } from '../../../../test/browser/workbenchTestServices.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';

suite('Logs Parsing', () => {

	const disposables = ensureNoDisposablesAreLeakedInTestSuite();

	let instantiationService: TestInstantiationService;

	setup(() => {
		instantiationService = disposables.add(workbenchInstantiationService({}, disposables));
	});

	test('should parse log entry with all components', () => {
		const text = '2023-10-15 14:30:45.123 [info] [Git] Initializing repository';
		const model = createModel(text);
		const entry = parseLogEntryAt(model, 1);

		assert.strictEqual(entry?.timestamp, new Date('2023-10-15 14:30:45.123').getTime());
		assert.strictEqual(entry?.logLevel, LogLevel.Info);
		assert.strictEqual(entry?.category, 'Git');
		assert.strictEqual(model.getValueInRange(entry?.range), text);
	});

	test('should parse multi-line log entry', () => {
		const text = [
			'2023-10-15 14:30:45.123 [error] [Extension] Failed with error:',
			'Error: Could not load extension',
			'    at Object.load (/path/to/file:10:5)'
		].join('\n');
		const model = createModel(text);
		const entry = parseLogEntryAt(model, 1);

		assert.strictEqual(entry?.timestamp, new Date('2023-10-15 14:30:45.123').getTime());
		assert.strictEqual(entry?.logLevel, LogLevel.Error);
		assert.strictEqual(entry?.category, 'Extension');
		assert.strictEqual(model.getValueInRange(entry?.range), text);
	});

	test('should parse log entry without category', () => {
		const text = '2023-10-15 14:30:45.123 [warning] System is running low on memory';
		const model = createModel(text);
		const entry = parseLogEntryAt(model, 1);

		assert.strictEqual(entry?.timestamp, new Date('2023-10-15 14:30:45.123').getTime());
		assert.strictEqual(entry?.logLevel, LogLevel.Warning);
		assert.strictEqual(entry?.category, undefined);
		assert.strictEqual(model.getValueInRange(entry?.range), text);
	});

	test('should return null for invalid log entry', () => {
		const model = createModel('Not a valid log entry');
		const entry = parseLogEntryAt(model, 1);

		assert.strictEqual(entry, null);
	});

	test('should parse all supported log levels', () => {
		const levels = {
			info: LogLevel.Info,
			trace: LogLevel.Trace,
			debug: LogLevel.Debug,
			warning: LogLevel.Warning,
			error: LogLevel.Error
		};

		for (const [levelText, expectedLevel] of Object.entries(levels)) {
			const model = createModel(`2023-10-15 14:30:45.123 [${levelText}] Test message`);
			const entry = parseLogEntryAt(model, 1);
			assert.strictEqual(entry?.logLevel, expectedLevel, `Failed for log level: ${levelText}`);
		}
	});

	test('should parse timestamp correctly', () => {
		const timestamps = [
			'2023-01-01 00:00:00.000',
			'2023-12-31 23:59:59.999',
			'2023-06-15 12:30:45.500'
		];

		for (const timestamp of timestamps) {
			const model = createModel(`${timestamp} [info] Test message`);
			const entry = parseLogEntryAt(model, 1);
			assert.strictEqual(entry?.timestamp, new Date(timestamp).getTime(), `Failed for timestamp: ${timestamp}`);
		}
	});

	test('should handle last line of file', () => {
		const model = createModel([
			'2023-10-15 14:30:45.123 [info] First message',
			'2023-10-15 14:30:45.124 [info] Last message',
			''
		].join('\n'));

		let actual = parseLogEntryAt(model, 1);
		assert.strictEqual(actual?.timestamp, new Date('2023-10-15 14:30:45.123').getTime());
		assert.strictEqual(actual?.logLevel, LogLevel.Info);
		assert.strictEqual(actual?.category, undefined);
		assert.strictEqual(model.getValueInRange(actual?.range), '2023-10-15 14:30:45.123 [info] First message');

		actual = parseLogEntryAt(model, 2);
		assert.strictEqual(actual?.timestamp, new Date('2023-10-15 14:30:45.124').getTime());
		assert.strictEqual(actual?.logLevel, LogLevel.Info);
		assert.strictEqual(actual?.category, undefined);
		assert.strictEqual(model.getValueInRange(actual?.range), '2023-10-15 14:30:45.124 [info] Last message');

		actual = parseLogEntryAt(model, 3);
		assert.strictEqual(actual, null);
	});

	test('should parse multi-line log entry with empty lines', () => {
		const text = [
			'2025-01-27 09:53:00.450 [info] Found with version <20.18.1>',
			'Now using node v20.18.1 (npm v10.8.2)',
			'',
			'> husky - npm run -s precommit',
			'> husky - node v20.18.1',
			'',
			'Reading git index versions...'
		].join('\n');
		const model = createModel(text);
		const entry = parseLogEntryAt(model, 1);

		assert.strictEqual(entry?.timestamp, new Date('2025-01-27 09:53:00.450').getTime());
		assert.strictEqual(entry?.logLevel, LogLevel.Info);
		assert.strictEqual(entry?.category, undefined);
		assert.strictEqual(model.getValueInRange(entry?.range), text);

	});

	function createModel(content: string): TextModel {
		return disposables.add(instantiationService.createInstance(TextModel, content, 'log', TextModel.DEFAULT_CREATION_OPTIONS, null));
	}
});
```

--------------------------------------------------------------------------------

````
