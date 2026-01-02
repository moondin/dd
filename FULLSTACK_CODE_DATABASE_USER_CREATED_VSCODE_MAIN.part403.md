---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 403
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 403 of 552)

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

---[FILE: src/vs/workbench/contrib/issue/electron-browser/issueService.ts]---
Location: vscode-main/src/vs/workbench/contrib/issue/electron-browser/issueService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getZoomLevel } from '../../../../base/browser/browser.js';
import { mainWindow } from '../../../../base/browser/window.js';
import { IExtensionManagementService } from '../../../../platform/extensionManagement/common/extensionManagement.js';
import { ExtensionType } from '../../../../platform/extensions/common/extensions.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { buttonBackground, buttonForeground, buttonHoverBackground, foreground, inputActiveOptionBorder, inputBackground, inputBorder, inputForeground, inputValidationErrorBackground, inputValidationErrorBorder, inputValidationErrorForeground, scrollbarSliderActiveBackground, scrollbarSliderHoverBackground, textLinkActiveForeground, textLinkForeground } from '../../../../platform/theme/common/colorRegistry.js';
import { IColorTheme, IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IWorkspaceTrustManagementService } from '../../../../platform/workspace/common/workspaceTrust.js';
import { SIDE_BAR_BACKGROUND } from '../../../common/theme.js';
import { IIssueFormService, IssueReporterData, IssueReporterExtensionData, IssueReporterStyles, IWorkbenchIssueService } from '../common/issue.js';
import { IWorkbenchAssignmentService } from '../../../services/assignment/common/assignmentService.js';
import { IAuthenticationService } from '../../../services/authentication/common/authentication.js';
import { IWorkbenchExtensionEnablementService } from '../../../services/extensionManagement/common/extensionManagement.js';
import { IIntegrityService } from '../../../services/integrity/common/integrity.js';

export class NativeIssueService implements IWorkbenchIssueService {
	declare readonly _serviceBrand: undefined;

	constructor(
		@IIssueFormService private readonly issueFormService: IIssueFormService,
		@IThemeService private readonly themeService: IThemeService,
		@IExtensionManagementService private readonly extensionManagementService: IExtensionManagementService,
		@IWorkbenchExtensionEnablementService private readonly extensionEnablementService: IWorkbenchExtensionEnablementService,
		@IWorkspaceTrustManagementService private readonly workspaceTrustManagementService: IWorkspaceTrustManagementService,
		@IWorkbenchAssignmentService private readonly experimentService: IWorkbenchAssignmentService,
		@IAuthenticationService private readonly authenticationService: IAuthenticationService,
		@IIntegrityService private readonly integrityService: IIntegrityService,
	) { }

	async openReporter(dataOverrides: Partial<IssueReporterData> = {}): Promise<void> {
		const extensionData: IssueReporterExtensionData[] = [];
		try {
			const extensions = await this.extensionManagementService.getInstalled();
			const enabledExtensions = extensions.filter(extension => this.extensionEnablementService.isEnabled(extension) || (dataOverrides.extensionId && extension.identifier.id === dataOverrides.extensionId));
			extensionData.push(...enabledExtensions.map((extension): IssueReporterExtensionData => {
				const { manifest } = extension;
				const manifestKeys = manifest.contributes ? Object.keys(manifest.contributes) : [];
				const isTheme = !manifest.main && !manifest.browser && manifestKeys.length === 1 && manifestKeys[0] === 'themes';
				const isBuiltin = extension.type === ExtensionType.System;
				return {
					name: manifest.name,
					publisher: manifest.publisher,
					version: manifest.version,
					repositoryUrl: manifest.repository && manifest.repository.url,
					bugsUrl: manifest.bugs && manifest.bugs.url,
					displayName: manifest.displayName,
					id: extension.identifier.id,
					data: dataOverrides.data,
					uri: dataOverrides.uri,
					isTheme,
					isBuiltin,
					extensionData: 'Extensions data loading',
				};
			}));
		} catch (e) {
			extensionData.push({
				name: 'Workbench Issue Service',
				publisher: 'Unknown',
				version: '0.0.0',
				repositoryUrl: undefined,
				bugsUrl: undefined,
				extensionData: 'Extensions data loading',
				displayName: `Extensions not loaded: ${e}`,
				id: 'workbench.issue',
				isTheme: false,
				isBuiltin: true
			});
		}
		const experiments = await this.experimentService.getCurrentExperiments();

		let githubAccessToken = '';
		try {
			const githubSessions = await this.authenticationService.getSessions('github');
			const potentialSessions = githubSessions.filter(session => session.scopes.includes('repo'));
			githubAccessToken = potentialSessions[0]?.accessToken;
		} catch (e) {
			// Ignore
		}

		// air on the side of caution and have false be the default
		let isUnsupported = false;
		try {
			isUnsupported = !(await this.integrityService.isPure()).isPure;
		} catch (e) {
			// Ignore
		}

		const theme = this.themeService.getColorTheme();
		const issueReporterData: IssueReporterData = Object.assign({
			styles: getIssueReporterStyles(theme),
			zoomLevel: getZoomLevel(mainWindow),
			enabledExtensions: extensionData,
			experiments: experiments?.join('\n'),
			restrictedMode: !this.workspaceTrustManagementService.isWorkspaceTrusted(),
			isUnsupported,
			githubAccessToken
		}, dataOverrides);

		return this.issueFormService.openReporter(issueReporterData);
	}

}

export function getIssueReporterStyles(theme: IColorTheme): IssueReporterStyles {
	return {
		backgroundColor: getColor(theme, SIDE_BAR_BACKGROUND),
		color: getColor(theme, foreground),
		textLinkColor: getColor(theme, textLinkForeground),
		textLinkActiveForeground: getColor(theme, textLinkActiveForeground),
		inputBackground: getColor(theme, inputBackground),
		inputForeground: getColor(theme, inputForeground),
		inputBorder: getColor(theme, inputBorder),
		inputActiveBorder: getColor(theme, inputActiveOptionBorder),
		inputErrorBorder: getColor(theme, inputValidationErrorBorder),
		inputErrorBackground: getColor(theme, inputValidationErrorBackground),
		inputErrorForeground: getColor(theme, inputValidationErrorForeground),
		buttonBackground: getColor(theme, buttonBackground),
		buttonForeground: getColor(theme, buttonForeground),
		buttonHoverBackground: getColor(theme, buttonHoverBackground),
		sliderActiveColor: getColor(theme, scrollbarSliderActiveBackground),
		sliderBackgroundColor: getColor(theme, SIDE_BAR_BACKGROUND),
		sliderHoverColor: getColor(theme, scrollbarSliderHoverBackground),
	};
}

function getColor(theme: IColorTheme, key: string): string | undefined {
	const color = theme.getColor(key);
	return color ? color.toString() : undefined;
}

registerSingleton(IWorkbenchIssueService, NativeIssueService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/issue/electron-browser/nativeIssueFormService.ts]---
Location: vscode-main/src/vs/workbench/contrib/issue/electron-browser/nativeIssueFormService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { IMenuService } from '../../../../platform/actions/common/actions.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { INativeEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { INativeHostService } from '../../../../platform/native/common/native.js';
import product from '../../../../platform/product/common/product.js';
import { IAuxiliaryWindowService } from '../../../services/auxiliaryWindow/browser/auxiliaryWindowService.js';
import { IHostService } from '../../../services/host/browser/host.js';
import { IssueFormService } from '../browser/issueFormService.js';
import { IIssueFormService, IssueReporterData } from '../common/issue.js';
import { IssueReporter } from './issueReporterService.js';

export class NativeIssueFormService extends IssueFormService implements IIssueFormService {
	private readonly store = new DisposableStore();

	constructor(
		@IInstantiationService instantiationService: IInstantiationService,
		@IAuxiliaryWindowService auxiliaryWindowService: IAuxiliaryWindowService,
		@ILogService logService: ILogService,
		@IDialogService dialogService: IDialogService,
		@IMenuService menuService: IMenuService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IHostService hostService: IHostService,
		@INativeHostService private readonly nativeHostService: INativeHostService,
		@INativeEnvironmentService private readonly environmentService: INativeEnvironmentService,) {
		super(instantiationService, auxiliaryWindowService, menuService, contextKeyService, logService, dialogService, hostService);
	}

	// override to grab platform info
	override async openReporter(data: IssueReporterData): Promise<void> {
		if (this.hasToReload(data)) {
			return;
		}

		const bounds = await this.nativeHostService.getActiveWindowPosition();
		if (!bounds) {
			return;
		}

		await this.openAuxIssueReporter(data, bounds);

		// Get platform information
		const { arch, release, type } = await this.nativeHostService.getOSProperties();
		this.arch = arch;
		this.release = release;
		this.type = type;

		// create issue reporter and instantiate
		if (this.issueReporterWindow) {
			const issueReporter = this.store.add(this.instantiationService.createInstance(IssueReporter, !!this.environmentService.disableExtensions, data, { type: this.type, arch: this.arch, release: this.release }, product, this.issueReporterWindow));
			issueReporter.render();
		} else {
			this.store.dispose();
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/issue/test/browser/testReporterModel.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/issue/test/browser/testReporterModel.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { IssueReporterModel } from '../../browser/issueReporterModel.js';
import { IssueType } from '../../common/issue.js';
import { normalizeGitHubUrl } from '../../common/issueReporterUtil.js';

suite('IssueReporter', () => {
	ensureNoDisposablesAreLeakedInTestSuite();
	test('sets defaults to include all data', () => {
		const issueReporterModel = new IssueReporterModel();
		assert.deepStrictEqual(issueReporterModel.getData(), {
			allExtensions: [],
			includeSystemInfo: true,
			includeExtensionData: true,
			includeWorkspaceInfo: true,
			includeProcessInfo: true,
			includeExtensions: true,
			includeExperiments: true,
			issueType: 0
		});
	});

	test('serializes model skeleton when no data is provided', () => {
		const issueReporterModel = new IssueReporterModel({});
		assert.strictEqual(issueReporterModel.serialize(),
			`
Type: <b>Bug</b>

undefined

VS Code version: undefined
OS version: undefined
Modes:

Extensions: none
<!-- generated by issue reporter -->`);
	});

	test('serializes GPU information when data is provided', () => {
		const issueReporterModel = new IssueReporterModel({
			issueType: 0,
			systemInfo: {
				os: 'Darwin',
				cpus: 'Intel(R) Core(TM) i7-7700HQ CPU @ 2.80GHz (8 x 2800)',
				memory: '16.00GB',
				vmHint: '0%',
				processArgs: '',
				screenReader: 'no',
				remoteData: [],
				gpuStatus: {
					'2d_canvas': 'enabled',
					'checker_imaging': 'disabled_off'
				}
			}
		});
		assert.strictEqual(issueReporterModel.serialize(),
			`
Type: <b>Bug</b>

undefined

VS Code version: undefined
OS version: undefined
Modes:

<details>
<summary>System Info</summary>

|Item|Value|
|---|---|
|CPUs|Intel(R) Core(TM) i7-7700HQ CPU @ 2.80GHz (8 x 2800)|
|GPU Status|2d_canvas: enabled<br>checker_imaging: disabled_off|
|Load (avg)|undefined|
|Memory (System)|16.00GB|
|Process Argv||
|Screen Reader|no|
|VM|0%|
</details>Extensions: none
<!-- generated by issue reporter -->`);
	});

	test('serializes experiment info when data is provided', () => {
		const issueReporterModel = new IssueReporterModel({
			issueType: 0,
			systemInfo: {
				os: 'Darwin',
				cpus: 'Intel(R) Core(TM) i7-7700HQ CPU @ 2.80GHz (8 x 2800)',
				memory: '16.00GB',
				vmHint: '0%',
				processArgs: '',
				screenReader: 'no',
				remoteData: [],
				gpuStatus: {
					'2d_canvas': 'enabled',
					'checker_imaging': 'disabled_off'
				}
			},
			experimentInfo: 'vsliv695:30137379\nvsins829:30139715'
		});
		assert.strictEqual(issueReporterModel.serialize(),
			`
Type: <b>Bug</b>

undefined

VS Code version: undefined
OS version: undefined
Modes:

<details>
<summary>System Info</summary>

|Item|Value|
|---|---|
|CPUs|Intel(R) Core(TM) i7-7700HQ CPU @ 2.80GHz (8 x 2800)|
|GPU Status|2d_canvas: enabled<br>checker_imaging: disabled_off|
|Load (avg)|undefined|
|Memory (System)|16.00GB|
|Process Argv||
|Screen Reader|no|
|VM|0%|
</details>Extensions: none<details>
<summary>A/B Experiments</summary>

\`\`\`
vsliv695:30137379
vsins829:30139715
\`\`\`

</details>

<!-- generated by issue reporter -->`);
	});

	test('serializes Linux environment information when data is provided', () => {
		const issueReporterModel = new IssueReporterModel({
			issueType: 0,
			systemInfo: {
				os: 'Darwin',
				cpus: 'Intel(R) Core(TM) i7-7700HQ CPU @ 2.80GHz (8 x 2800)',
				memory: '16.00GB',
				vmHint: '0%',
				processArgs: '',
				screenReader: 'no',
				remoteData: [],
				gpuStatus: {},
				linuxEnv: {
					desktopSession: 'ubuntu',
					xdgCurrentDesktop: 'ubuntu',
					xdgSessionDesktop: 'ubuntu:GNOME',
					xdgSessionType: 'x11'
				}
			}
		});
		assert.strictEqual(issueReporterModel.serialize(),
			`
Type: <b>Bug</b>

undefined

VS Code version: undefined
OS version: undefined
Modes:

<details>
<summary>System Info</summary>

|Item|Value|
|---|---|
|CPUs|Intel(R) Core(TM) i7-7700HQ CPU @ 2.80GHz (8 x 2800)|
|GPU Status||
|Load (avg)|undefined|
|Memory (System)|16.00GB|
|Process Argv||
|Screen Reader|no|
|VM|0%|
|DESKTOP_SESSION|ubuntu|
|XDG_CURRENT_DESKTOP|ubuntu|
|XDG_SESSION_DESKTOP|ubuntu:GNOME|
|XDG_SESSION_TYPE|x11|
</details>Extensions: none
<!-- generated by issue reporter -->`);
	});

	test('serializes remote information when data is provided', () => {
		const issueReporterModel = new IssueReporterModel({
			issueType: 0,
			systemInfo: {
				os: 'Darwin',
				cpus: 'Intel(R) Core(TM) i7-7700HQ CPU @ 2.80GHz (8 x 2800)',
				memory: '16.00GB',
				vmHint: '0%',
				processArgs: '',
				screenReader: 'no',
				gpuStatus: {
					'2d_canvas': 'enabled',
					'checker_imaging': 'disabled_off'
				},
				remoteData: [
					{
						hostName: 'SSH: Pineapple',
						machineInfo: {
							os: 'Linux x64 4.18.0',
							cpus: 'Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz (2 x 2294)',
							memory: '8GB',
							vmHint: '100%'
						}
					}
				]
			}
		});
		assert.strictEqual(issueReporterModel.serialize(),
			`
Type: <b>Bug</b>

undefined

VS Code version: undefined
OS version: undefined
Modes:
Remote OS version: Linux x64 4.18.0

<details>
<summary>System Info</summary>

|Item|Value|
|---|---|
|CPUs|Intel(R) Core(TM) i7-7700HQ CPU @ 2.80GHz (8 x 2800)|
|GPU Status|2d_canvas: enabled<br>checker_imaging: disabled_off|
|Load (avg)|undefined|
|Memory (System)|16.00GB|
|Process Argv||
|Screen Reader|no|
|VM|0%|

|Item|Value|
|---|---|
|Remote|SSH: Pineapple|
|OS|Linux x64 4.18.0|
|CPUs|Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz (2 x 2294)|
|Memory (System)|8GB|
|VM|100%|
</details>Extensions: none
<!-- generated by issue reporter -->`);
	});

	test('escapes backslashes in processArgs', () => {
		const issueReporterModel = new IssueReporterModel({
			issueType: 0,
			systemInfo: {
				os: 'Darwin',
				cpus: 'Intel(R) Core(TM) i7-7700HQ CPU @ 2.80GHz (8 x 2800)',
				memory: '16.00GB',
				vmHint: '0%',
				processArgs: '\\\\HOST\\path',
				screenReader: 'no',
				remoteData: [],
				gpuStatus: {}
			}
		});
		assert.strictEqual(issueReporterModel.serialize(),
			`
Type: <b>Bug</b>

undefined

VS Code version: undefined
OS version: undefined
Modes:

<details>
<summary>System Info</summary>

|Item|Value|
|---|---|
|CPUs|Intel(R) Core(TM) i7-7700HQ CPU @ 2.80GHz (8 x 2800)|
|GPU Status||
|Load (avg)|undefined|
|Memory (System)|16.00GB|
|Process Argv|\\\\\\\\HOST\\\\path|
|Screen Reader|no|
|VM|0%|
</details>Extensions: none
<!-- generated by issue reporter -->`);
	});

	test('should supply mode if applicable', () => {
		const issueReporterModel = new IssueReporterModel({
			isUnsupported: true,
			restrictedMode: true
		});
		assert.strictEqual(issueReporterModel.serialize(),
			`
Type: <b>Bug</b>

undefined

VS Code version: undefined
OS version: undefined
Modes: Restricted, Unsupported

Extensions: none
<!-- generated by issue reporter -->`);
	});
	test('should normalize GitHub urls', () => {
		[
			'https://github.com/repo',
			'https://github.com/repo/',
			'https://github.com/repo.git',
			'https://github.com/repo/issues',
			'https://github.com/repo/issues/',
			'https://github.com/repo/issues/new',
			'https://github.com/repo/issues/new/'
		].forEach(url => {
			assert.strictEqual('https://github.com/repo', normalizeGitHubUrl(url));
		});
	});

	test('should have support for filing on extensions for bugs, performance issues, and feature requests', () => {
		[
			IssueType.Bug,
			IssueType.FeatureRequest,
			IssueType.PerformanceIssue
		].forEach(type => {
			const issueReporterModel = new IssueReporterModel({
				issueType: type,
				fileOnExtension: true
			});

			assert.strictEqual(issueReporterModel.fileOnExtension(), true);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/keybindings/browser/keybindings.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/keybindings/browser/keybindings.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { Action2, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { showWindowLogActionId } from '../../../services/log/common/logConstants.js';
import { DisposableStore, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { ILayoutService } from '../../../../platform/layout/browser/layoutService.js';
import { $, addDisposableListener, append, getDomNodePagePosition, getWindows, onDidRegisterWindow } from '../../../../base/browser/dom.js';
import { createCSSRule, createStyleSheet } from '../../../../base/browser/domStylesheets.js';
import { Emitter } from '../../../../base/common/event.js';

class ToggleKeybindingsLogAction extends Action2 {
	static disposable: IDisposable | undefined;

	constructor() {
		super({
			id: 'workbench.action.toggleKeybindingsLog',
			title: nls.localize2('toggleKeybindingsLog', "Toggle Keyboard Shortcuts Troubleshooting"),
			category: Categories.Developer,
			f1: true
		});
	}

	run(accessor: ServicesAccessor): void {
		const logging = accessor.get(IKeybindingService).toggleLogging();
		if (logging) {
			const commandService = accessor.get(ICommandService);
			commandService.executeCommand(showWindowLogActionId);
		}

		if (ToggleKeybindingsLogAction.disposable) {
			ToggleKeybindingsLogAction.disposable.dispose();
			ToggleKeybindingsLogAction.disposable = undefined;
			return;
		}

		const layoutService = accessor.get(ILayoutService);
		const disposables = new DisposableStore();

		const container = layoutService.activeContainer;
		const focusMarker = append(container, $('.focus-troubleshooting-marker'));
		disposables.add(toDisposable(() => focusMarker.remove()));

		// Add CSS rule for focus marker
		const stylesheet = createStyleSheet(undefined, undefined, disposables);
		createCSSRule('.focus-troubleshooting-marker', `
			position: fixed;
			pointer-events: none;
			z-index: 100000;
			background-color: rgba(255, 0, 0, 0.2);
			border: 2px solid rgba(255, 0, 0, 0.8);
			border-radius: 2px;
			display: none;
		`, stylesheet);

		const onKeyDown = disposables.add(new Emitter<KeyboardEvent>());

		function registerWindowListeners(window: Window, disposables: DisposableStore): void {
			disposables.add(addDisposableListener(window, 'keydown', e => onKeyDown.fire(e), true));
		}

		for (const { window, disposables } of getWindows()) {
			registerWindowListeners(window, disposables);
		}

		disposables.add(onDidRegisterWindow(({ window, disposables }) => registerWindowListeners(window, disposables)));

		disposables.add(layoutService.onDidChangeActiveContainer(() => {
			layoutService.activeContainer.appendChild(focusMarker);
		}));

		disposables.add(onKeyDown.event(e => {
			const target = e.target as HTMLElement;
			if (target) {
				const position = getDomNodePagePosition(target);
				focusMarker.style.top = `${position.top}px`;
				focusMarker.style.left = `${position.left}px`;
				focusMarker.style.width = `${position.width}px`;
				focusMarker.style.height = `${position.height}px`;
				focusMarker.style.display = 'block';

				// Hide after timeout
				setTimeout(() => {
					focusMarker.style.display = 'none';
				}, 800);
			}
		}));

		ToggleKeybindingsLogAction.disposable = disposables;
	}
}

registerAction2(ToggleKeybindingsLogAction);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/languageDetection/browser/languageDetection.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/languageDetection/browser/languageDetection.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { getCodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { localize, localize2 } from '../../../../nls.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IWorkbenchContributionsRegistry, Extensions as WorkbenchExtensions, IWorkbenchContribution } from '../../../common/contributions.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { IStatusbarEntry, IStatusbarEntryAccessor, IStatusbarService, StatusbarAlignment } from '../../../services/statusbar/browser/statusbar.js';
import { ILanguageDetectionService, LanguageDetectionHintConfig, LanguageDetectionLanguageEventSource } from '../../../services/languageDetection/common/languageDetectionWorkerService.js';
import { ThrottledDelayer } from '../../../../base/common/async.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { ServicesAccessor } from '../../../../editor/browser/editorExtensions.js';
import { registerAction2, Action2 } from '../../../../platform/actions/common/actions.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { NOTEBOOK_EDITOR_EDITABLE } from '../../notebook/common/notebookContextKeys.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { EditorContextKeys } from '../../../../editor/common/editorContextKeys.js';
import { Schemas } from '../../../../base/common/network.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';

const detectLanguageCommandId = 'editor.detectLanguage';

class LanguageDetectionStatusContribution implements IWorkbenchContribution {

	private static readonly _id = 'status.languageDetectionStatus';

	private readonly _disposables = new DisposableStore();
	private _combinedEntry?: IStatusbarEntryAccessor;
	private _delayer = new ThrottledDelayer(1000);
	private readonly _renderDisposables = new DisposableStore();

	constructor(
		@ILanguageDetectionService private readonly _languageDetectionService: ILanguageDetectionService,
		@IStatusbarService private readonly _statusBarService: IStatusbarService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IEditorService private readonly _editorService: IEditorService,
		@ILanguageService private readonly _languageService: ILanguageService,
		@IKeybindingService private readonly _keybindingService: IKeybindingService,
	) {
		_editorService.onDidActiveEditorChange(() => this._update(true), this, this._disposables);
		this._update(false);
	}

	dispose(): void {
		this._disposables.dispose();
		this._delayer.dispose();
		this._combinedEntry?.dispose();
		this._renderDisposables.dispose();
	}

	private _update(clear: boolean): void {
		if (clear) {
			this._combinedEntry?.dispose();
			this._combinedEntry = undefined;
		}
		this._delayer.trigger(() => this._doUpdate());
	}

	private async _doUpdate(): Promise<void> {
		const editor = getCodeEditor(this._editorService.activeTextEditorControl);

		this._renderDisposables.clear();

		// update when editor language changes
		editor?.onDidChangeModelLanguage(() => this._update(true), this, this._renderDisposables);
		editor?.onDidChangeModelContent(() => this._update(false), this, this._renderDisposables);
		const editorModel = editor?.getModel();
		const editorUri = editorModel?.uri;
		const existingId = editorModel?.getLanguageId();
		const enablementConfig = this._configurationService.getValue<LanguageDetectionHintConfig>('workbench.editor.languageDetectionHints');
		const enabled = typeof enablementConfig === 'object' && enablementConfig?.untitledEditors;
		const disableLightbulb = !enabled || editorUri?.scheme !== Schemas.untitled || !existingId;

		if (disableLightbulb || !editorUri) {
			this._combinedEntry?.dispose();
			this._combinedEntry = undefined;
		} else {
			const lang = await this._languageDetectionService.detectLanguage(editorUri);
			const skip: Record<string, string | undefined> = { 'jsonc': 'json' };
			const existing = editorModel.getLanguageId();
			if (lang && lang !== existing && skip[existing] !== lang) {
				const detectedName = this._languageService.getLanguageName(lang) || lang;
				let tooltip = localize('status.autoDetectLanguage', "Accept Detected Language: {0}", detectedName);
				const keybinding = this._keybindingService.lookupKeybinding(detectLanguageCommandId);
				const label = keybinding?.getLabel();
				if (label) {
					tooltip += ` (${label})`;
				}

				const props: IStatusbarEntry = {
					name: localize('langDetection.name', "Language Detection"),
					ariaLabel: localize('langDetection.aria', "Change to Detected Language: {0}", lang),
					tooltip,
					command: detectLanguageCommandId,
					text: '$(lightbulb-autofix)',
				};
				if (!this._combinedEntry) {
					this._combinedEntry = this._statusBarService.addEntry(props, LanguageDetectionStatusContribution._id, StatusbarAlignment.RIGHT, { location: { id: 'status.editor.mode', priority: 100.1 }, alignment: StatusbarAlignment.RIGHT, compact: true });
				} else {
					this._combinedEntry.update(props);
				}
			} else {
				this._combinedEntry?.dispose();
				this._combinedEntry = undefined;
			}
		}
	}
}

Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench).registerWorkbenchContribution(LanguageDetectionStatusContribution, LifecyclePhase.Restored);


registerAction2(class extends Action2 {

	constructor() {
		super({
			id: detectLanguageCommandId,
			title: localize2('detectlang', "Detect Language from Content"),
			f1: true,
			precondition: ContextKeyExpr.and(NOTEBOOK_EDITOR_EDITABLE.toNegated(), EditorContextKeys.editorTextFocus),
			keybinding: { primary: KeyCode.KeyD | KeyMod.Alt | KeyMod.Shift, weight: KeybindingWeight.WorkbenchContrib }
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const editorService = accessor.get(IEditorService);
		const languageDetectionService = accessor.get(ILanguageDetectionService);
		const editor = getCodeEditor(editorService.activeTextEditorControl);
		const notificationService = accessor.get(INotificationService);
		const editorUri = editor?.getModel()?.uri;
		if (editorUri) {
			const lang = await languageDetectionService.detectLanguage(editorUri);
			if (lang) {
				editor.getModel()?.setLanguage(lang, LanguageDetectionLanguageEventSource);
			} else {
				notificationService.warn(localize('noDetection', "Unable to detect editor language"));
			}
		}
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/languageStatus/browser/languageStatus.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/languageStatus/browser/languageStatus.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerWorkbenchContribution2, WorkbenchPhase } from '../../../common/contributions.js';
import { registerAction2 } from '../../../../platform/actions/common/actions.js';
import { LanguageStatusContribution, ResetAction } from './languageStatus.js';


registerWorkbenchContribution2(LanguageStatusContribution.Id, LanguageStatusContribution, WorkbenchPhase.AfterRestored);
registerAction2(ResetAction);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/languageStatus/browser/languageStatus.ts]---
Location: vscode-main/src/vs/workbench/contrib/languageStatus/browser/languageStatus.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/languageStatus.css';
import * as dom from '../../../../base/browser/dom.js';
import { renderLabelWithIcons } from '../../../../base/browser/ui/iconLabel/iconLabels.js';
import { Disposable, DisposableStore, dispose, toDisposable } from '../../../../base/common/lifecycle.js';
import Severity from '../../../../base/common/severity.js';
import { getCodeEditor, ICodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { localize, localize2 } from '../../../../nls.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { ILanguageStatus, ILanguageStatusService } from '../../../services/languageStatus/common/languageStatusService.js';
import { IStatusbarEntry, IStatusbarEntryAccessor, IStatusbarService, ShowTooltipCommand, StatusbarAlignment, StatusbarEntryKind } from '../../../services/statusbar/browser/statusbar.js';
import { parseLinkedText } from '../../../../base/common/linkedText.js';
import { Link } from '../../../../platform/opener/browser/link.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { MarkdownString } from '../../../../base/common/htmlContent.js';
import { ActionBar } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { Action } from '../../../../base/common/actions.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { equals } from '../../../../base/common/arrays.js';
import { URI } from '../../../../base/common/uri.js';
import { Action2 } from '../../../../platform/actions/common/actions.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { IAccessibilityInformation } from '../../../../platform/accessibility/common/accessibility.js';
import { IEditorGroupsService, IEditorPart } from '../../../services/editor/common/editorGroupsService.js';
import { IHoverService, nativeHoverDelegate } from '../../../../platform/hover/browser/hover.js';
import { Event } from '../../../../base/common/event.js';
import { joinStrings } from '../../../../base/common/strings.js';

class LanguageStatusViewModel {

	constructor(
		readonly combined: readonly ILanguageStatus[],
		readonly dedicated: readonly ILanguageStatus[]
	) { }

	isEqual(other: LanguageStatusViewModel) {
		return equals(this.combined, other.combined) && equals(this.dedicated, other.dedicated);
	}
}

class StoredCounter {

	constructor(@IStorageService private readonly _storageService: IStorageService, private readonly _key: string) { }

	get value() {
		return this._storageService.getNumber(this._key, StorageScope.PROFILE, 0);
	}

	increment(): number {
		const n = this.value + 1;
		this._storageService.store(this._key, n, StorageScope.PROFILE, StorageTarget.MACHINE);
		return n;
	}
}

export class LanguageStatusContribution extends Disposable implements IWorkbenchContribution {

	static readonly Id = 'status.languageStatus';

	constructor(
		@IEditorGroupsService private readonly editorGroupService: IEditorGroupsService,
	) {
		super();

		for (const part of editorGroupService.parts) {
			this.createLanguageStatus(part);
		}

		this._register(editorGroupService.onDidCreateAuxiliaryEditorPart(part => this.createLanguageStatus(part)));
	}

	private createLanguageStatus(part: IEditorPart): void {
		const disposables = new DisposableStore();
		Event.once(part.onWillDispose)(() => disposables.dispose());

		const scopedInstantiationService = this.editorGroupService.getScopedInstantiationService(part);
		disposables.add(scopedInstantiationService.createInstance(LanguageStatus));
	}
}

class LanguageStatus {

	private static readonly _id = 'status.languageStatus';

	private static readonly _keyDedicatedItems = 'languageStatus.dedicated';

	private readonly _disposables = new DisposableStore();
	private readonly _interactionCounter: StoredCounter;

	private _dedicated = new Set<string>();

	private _model?: LanguageStatusViewModel;
	private _combinedEntry?: IStatusbarEntryAccessor;
	private _dedicatedEntries = new Map<string, IStatusbarEntryAccessor>();
	private readonly _renderDisposables = new DisposableStore();

	private readonly _combinedEntryTooltip = document.createElement('div');

	constructor(
		@ILanguageStatusService private readonly _languageStatusService: ILanguageStatusService,
		@IStatusbarService private readonly _statusBarService: IStatusbarService,
		@IEditorService private readonly _editorService: IEditorService,
		@IHoverService private readonly _hoverService: IHoverService,
		@IOpenerService private readonly _openerService: IOpenerService,
		@IStorageService private readonly _storageService: IStorageService,
	) {
		_storageService.onDidChangeValue(StorageScope.PROFILE, LanguageStatus._keyDedicatedItems, this._disposables)(this._handleStorageChange, this, this._disposables);
		this._restoreState();
		this._interactionCounter = new StoredCounter(_storageService, 'languageStatus.interactCount');

		_languageStatusService.onDidChange(this._update, this, this._disposables);
		_editorService.onDidActiveEditorChange(this._update, this, this._disposables);
		this._update();

		_statusBarService.onDidChangeEntryVisibility(e => {
			if (!e.visible && this._dedicated.has(e.id)) {
				this._dedicated.delete(e.id);
				this._update();
				this._storeState();
			}
		}, undefined, this._disposables);

	}

	dispose(): void {
		this._disposables.dispose();
		this._combinedEntry?.dispose();
		dispose(this._dedicatedEntries.values());
		this._renderDisposables.dispose();
	}

	// --- persisting dedicated items

	private _handleStorageChange() {
		this._restoreState();
		this._update();
	}

	private _restoreState(): void {
		const raw = this._storageService.get(LanguageStatus._keyDedicatedItems, StorageScope.PROFILE, '[]');
		try {
			const ids = <string[]>JSON.parse(raw);
			this._dedicated = new Set(ids);
		} catch {
			this._dedicated.clear();
		}
	}

	private _storeState(): void {
		if (this._dedicated.size === 0) {
			this._storageService.remove(LanguageStatus._keyDedicatedItems, StorageScope.PROFILE);
		} else {
			const raw = JSON.stringify(Array.from(this._dedicated.keys()));
			this._storageService.store(LanguageStatus._keyDedicatedItems, raw, StorageScope.PROFILE, StorageTarget.USER);
		}
	}

	// --- language status model and UI

	private _createViewModel(editor: ICodeEditor | null): LanguageStatusViewModel {
		if (!editor?.hasModel()) {
			return new LanguageStatusViewModel([], []);
		}
		const all = this._languageStatusService.getLanguageStatus(editor.getModel());
		const combined: ILanguageStatus[] = [];
		const dedicated: ILanguageStatus[] = [];
		for (const item of all) {
			if (this._dedicated.has(item.id)) {
				dedicated.push(item);
			}
			combined.push(item);
		}
		return new LanguageStatusViewModel(combined, dedicated);
	}

	private _update(): void {
		const editor = getCodeEditor(this._editorService.activeTextEditorControl);
		const model = this._createViewModel(editor);

		if (this._model?.isEqual(model)) {
			return;
		}
		this._renderDisposables.clear();

		this._model = model;

		// update when editor language changes
		editor?.onDidChangeModelLanguage(this._update, this, this._renderDisposables);

		// combined status bar item is a single item which hover shows
		// each status item
		if (model.combined.length === 0) {
			// nothing
			this._combinedEntry?.dispose();
			this._combinedEntry = undefined;

		} else {
			const [first] = model.combined;
			const showSeverity = first.severity >= Severity.Warning;
			const text = LanguageStatus._severityToComboCodicon(first.severity);

			let isOneBusy = false;
			const ariaLabels: string[] = [];
			for (const status of model.combined) {
				const isPinned = model.dedicated.includes(status);
				this._renderStatus(this._combinedEntryTooltip, status, showSeverity, isPinned, this._renderDisposables);
				ariaLabels.push(LanguageStatus._accessibilityInformation(status).label);
				isOneBusy = isOneBusy || (!isPinned && status.busy); // unpinned items contribute to the busy-indicator of the composite status item
			}

			const props: IStatusbarEntry = {
				name: localize('langStatus.name', "Editor Language Status"),
				ariaLabel: localize('langStatus.aria', "Editor Language Status: {0}", ariaLabels.join(', next: ')),
				tooltip: this._combinedEntryTooltip,
				command: ShowTooltipCommand,
				text: isOneBusy ? '$(loading~spin)' : text,
			};
			if (!this._combinedEntry) {
				this._combinedEntry = this._statusBarService.addEntry(props, LanguageStatus._id, StatusbarAlignment.RIGHT, { location: { id: 'status.editor.mode', priority: 100.1 }, alignment: StatusbarAlignment.LEFT, compact: true });
			} else {
				this._combinedEntry.update(props);
			}

			// animate the status bar icon whenever language status changes, repeat animation
			// when severity is warning or error, don't show animation when showing progress/busy
			const userHasInteractedWithStatus = this._interactionCounter.value >= 3;
			const targetWindow = dom.getWindow(editor?.getContainerDomNode());
			// eslint-disable-next-line no-restricted-syntax
			const node = targetWindow.document.querySelector('.monaco-workbench .statusbar DIV#status\\.languageStatus A>SPAN.codicon');
			// eslint-disable-next-line no-restricted-syntax
			const container = targetWindow.document.querySelector('.monaco-workbench .statusbar DIV#status\\.languageStatus');
			if (dom.isHTMLElement(node) && container) {
				const _wiggle = 'wiggle';
				const _flash = 'flash';
				if (!isOneBusy) {
					// wiggle icon when severe or "new"
					node.classList.toggle(_wiggle, showSeverity || !userHasInteractedWithStatus);
					this._renderDisposables.add(dom.addDisposableListener(node, 'animationend', _e => node.classList.remove(_wiggle)));
					// flash background when severe
					container.classList.toggle(_flash, showSeverity);
					this._renderDisposables.add(dom.addDisposableListener(container, 'animationend', _e => container.classList.remove(_flash)));
				} else {
					node.classList.remove(_wiggle);
					container.classList.remove(_flash);
				}
			}

			// track when the hover shows (this is automagic and DOM mutation spying is needed...)
			//  use that as signal that the user has interacted/learned language status items work
			if (!userHasInteractedWithStatus) {
				// eslint-disable-next-line no-restricted-syntax
				const hoverTarget = targetWindow.document.querySelector('.monaco-workbench .context-view');
				if (dom.isHTMLElement(hoverTarget)) {
					const observer = new MutationObserver(() => {
						if (targetWindow.document.contains(this._combinedEntryTooltip)) {
							this._interactionCounter.increment();
							observer.disconnect();
						}
					});
					observer.observe(hoverTarget, { childList: true, subtree: true });
					this._renderDisposables.add(toDisposable(() => observer.disconnect()));
				}
			}
		}

		// dedicated status bar items are shows as-is in the status bar
		const newDedicatedEntries = new Map<string, IStatusbarEntryAccessor>();
		for (const status of model.dedicated) {
			const props = LanguageStatus._asStatusbarEntry(status);
			let entry = this._dedicatedEntries.get(status.id);
			if (!entry) {
				entry = this._statusBarService.addEntry(props, status.id, StatusbarAlignment.RIGHT, { location: { id: 'status.editor.mode', priority: 100.1 }, alignment: StatusbarAlignment.RIGHT });
			} else {
				entry.update(props);
				this._dedicatedEntries.delete(status.id);
			}
			newDedicatedEntries.set(status.id, entry);
		}
		dispose(this._dedicatedEntries.values());
		this._dedicatedEntries = newDedicatedEntries;
	}

	private _renderStatus(container: HTMLElement, status: ILanguageStatus, showSeverity: boolean, isPinned: boolean, store: DisposableStore): HTMLElement {

		const parent = document.createElement('div');
		parent.classList.add('hover-language-status');

		container.appendChild(parent);
		store.add(toDisposable(() => parent.remove()));

		const severity = document.createElement('div');
		severity.classList.add('severity', `sev${status.severity}`);
		severity.classList.toggle('show', showSeverity);
		const severityText = LanguageStatus._severityToSingleCodicon(status.severity);
		dom.append(severity, ...renderLabelWithIcons(severityText));
		parent.appendChild(severity);

		const element = document.createElement('div');
		element.classList.add('element');
		parent.appendChild(element);

		const left = document.createElement('div');
		left.classList.add('left');
		element.appendChild(left);

		const label = typeof status.label === 'string' ? status.label : status.label.value;
		dom.append(left, ...renderLabelWithIcons(computeText(label, status.busy)));

		this._renderTextPlus(left, status.detail, store);

		const right = document.createElement('div');
		right.classList.add('right');
		element.appendChild(right);

		// -- command (if available)
		const { command } = status;
		if (command) {
			store.add(new Link(right, {
				label: command.title,
				title: command.tooltip,
				href: URI.from({
					scheme: 'command', path: command.id, query: command.arguments && JSON.stringify(command.arguments)
				}).toString()
			}, { hoverDelegate: nativeHoverDelegate }, this._hoverService, this._openerService));
		}

		// -- pin
		const actionBar = new ActionBar(right, { hoverDelegate: nativeHoverDelegate });
		const actionLabel: string = isPinned ? localize('unpin', "Remove from Status Bar") : localize('pin', "Add to Status Bar");
		actionBar.setAriaLabel(actionLabel);
		store.add(actionBar);
		let action: Action;
		if (!isPinned) {
			action = new Action('pin', actionLabel, ThemeIcon.asClassName(Codicon.pin), true, () => {
				this._dedicated.add(status.id);
				this._statusBarService.updateEntryVisibility(status.id, true);
				this._update();
				this._storeState();
			});
		} else {
			action = new Action('unpin', actionLabel, ThemeIcon.asClassName(Codicon.pinned), true, () => {
				this._dedicated.delete(status.id);
				this._statusBarService.updateEntryVisibility(status.id, false);
				this._update();
				this._storeState();
			});
		}
		actionBar.push(action, { icon: true, label: false });
		store.add(action);

		return parent;
	}

	private static _severityToComboCodicon(sev: Severity): string {
		switch (sev) {
			case Severity.Error: return '$(bracket-error)';
			case Severity.Warning: return '$(bracket-dot)';
			default: return '$(bracket)';
		}
	}

	private static _severityToSingleCodicon(sev: Severity): string {
		switch (sev) {
			case Severity.Error: return '$(error)';
			case Severity.Warning: return '$(info)';
			default: return '$(check)';
		}
	}

	private _renderTextPlus(target: HTMLElement, text: string, store: DisposableStore): void {
		let didRenderSeparator = false;
		for (const node of parseLinkedText(text).nodes) {
			if (!didRenderSeparator) {
				dom.append(target, dom.$('span.separator'));
				didRenderSeparator = true;
			}
			if (typeof node === 'string') {
				const parts = renderLabelWithIcons(node);
				dom.append(target, ...parts);
			} else {
				store.add(new Link(target, node, undefined, this._hoverService, this._openerService));
			}
		}
	}

	private static _accessibilityInformation(status: ILanguageStatus): IAccessibilityInformation {
		if (status.accessibilityInfo) {
			return status.accessibilityInfo;
		}
		const textValue = typeof status.label === 'string' ? status.label : status.label.value;
		if (status.detail) {
			return { label: localize('aria.1', '{0}, {1}', textValue, status.detail) };
		} else {
			return { label: localize('aria.2', '{0}', textValue) };
		}
	}

	// ---

	private static _asStatusbarEntry(item: ILanguageStatus): IStatusbarEntry {

		let kind: StatusbarEntryKind | undefined;
		if (item.severity === Severity.Warning) {
			kind = 'warning';
		} else if (item.severity === Severity.Error) {
			kind = 'error';
		}

		const textValue = typeof item.label === 'string' ? item.label : item.label.shortValue;

		return {
			name: localize('name.pattern', '{0} (Language Status)', item.name),
			text: computeText(textValue, item.busy),
			ariaLabel: LanguageStatus._accessibilityInformation(item).label,
			role: item.accessibilityInfo?.role,
			tooltip: item.command?.tooltip || new MarkdownString(item.detail, { isTrusted: true, supportThemeIcons: true }),
			kind,
			command: item.command
		};
	}
}

export class ResetAction extends Action2 {

	constructor() {
		super({
			id: 'editor.inlayHints.Reset',
			title: localize2('reset', "Reset Language Status Interaction Counter"),
			category: Categories.View,
			f1: true
		});
	}

	run(accessor: ServicesAccessor): void {
		accessor.get(IStorageService).remove('languageStatus.interactCount', StorageScope.PROFILE);
	}
}

function computeText(text: string, loading: boolean): string {
	return joinStrings([text !== '' && text, loading && '$(loading~spin)'], '\u00A0\u00A0');
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/languageStatus/browser/media/languageStatus.css]---
Location: vscode-main/src/vs/workbench/contrib/languageStatus/browser/media/languageStatus.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* status bar animation */

@keyframes wiggle {
	0% {
		transform: rotate(0) scale(1);
	}

	15%,
	45% {
		transform: rotate(.04turn) scale(1.1);
	}

	30%,
	60% {
		transform: rotate(-.04turn) scale(1.2);
	}

	100% {
		transform: rotate(0) scale(1);
	}
}

.monaco-workbench .statusbar DIV#status\.languageStatus A > SPAN.codicon.wiggle {
	animation-duration: .8s;
	animation-iteration-count: 1;
	animation-name: wiggle;
}

@keyframes flash {
	0% {
		background-color: initial;
	}

	50% {
		background-color: var(--vscode-statusBarItem-prominentBackground);
	}

	100% {
		background-color: initial;
	}
}

.monaco-workbench .statusbar DIV#status\.languageStatus.flash A {
	animation-duration: .8s;
	animation-iteration-count: 1;
	animation-name: flash;
}

/* --- hover */

.monaco-workbench .hover-language-status {
	display: flex;
}

.monaco-workbench .hover-language-status:not(:last-child) {
	border-bottom: 1px solid var(--vscode-notifications-border);
}

.monaco-workbench .hover-language-status > .severity {
	padding-right: 8px;
	flex: 1;
	margin: auto;
	display: none;
}

.monaco-workbench .hover-language-status > .severity.sev3 {
	color: var(--vscode-notificationsErrorIcon-foreground)
}

.monaco-workbench .hover-language-status > .severity.sev2 {
	color: var(--vscode-notificationsInfoIcon-foreground)
}

.monaco-workbench .hover-language-status > .severity.show {
	display: inherit;
}

.monaco-workbench .hover-language-status > .element {
	display: flex;
	justify-content: space-between;
	vertical-align: middle;
	flex-grow: 100;
}

.monaco-workbench .hover-language-status > .element > .left > .separator::before {
	content: '\2013';
	padding: 0 2px;
	opacity: 0.6;
}

.monaco-workbench .hover-language-status > .element > .left:empty {
	display: none;
}

.monaco-workbench .hover-language-status > .element .left {
	margin: auto 0;
	display: flex;
	align-items: center;
	gap: 3px;
	white-space: nowrap;
}

.monaco-workbench .hover-language-status > .element .right {
	margin: auto 0;
	display: flex;
}

.monaco-workbench .hover-language-status > .element .right:not(:empty) {
	padding-left: 16px;
}

.monaco-workbench .hover-language-status > .element .right .monaco-link {
	margin: auto 0;
	white-space: nowrap;
	text-decoration: var(--text-link-decoration);
}

.monaco-workbench .hover-language-status > .element .right .monaco-action-bar:not(:first-child) {
	padding-left: 8px;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/limitIndicator/browser/limitIndicator.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/limitIndicator/browser/limitIndicator.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, IDisposable } from '../../../../base/common/lifecycle.js';
import Severity from '../../../../base/common/severity.js';
import { ICodeEditor, getCodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { ILanguageStatus, ILanguageStatusService } from '../../../services/languageStatus/common/languageStatusService.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { Extensions as WorkbenchExtensions, IWorkbenchContributionsRegistry, IWorkbenchContribution } from '../../../common/contributions.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { Event } from '../../../../base/common/event.js';
import * as nls from '../../../../nls.js';

import { FoldingController } from '../../../../editor/contrib/folding/browser/folding.js';
import { ColorDetector } from '../../../../editor/contrib/colorPicker/browser/colorDetector.js';

const openSettingsCommand = 'workbench.action.openSettings';
const configureSettingsLabel = nls.localize('status.button.configure', "Configure");

/**
 * Uses that language status indicator to show information which language features have been limited for performance reasons.
 * Currently this is used for folding ranges and for color decorators.
 */
export class LimitIndicatorContribution extends Disposable implements IWorkbenchContribution {

	constructor(
		@IEditorService editorService: IEditorService,
		@ILanguageStatusService languageStatusService: ILanguageStatusService
	) {
		super();

		const accessors = [new ColorDecorationAccessor(), new FoldingRangeAccessor()];
		const statusEntries = accessors.map(indicator => new LanguageStatusEntry(languageStatusService, indicator));
		statusEntries.forEach(entry => this._register(entry));

		let control: unknown;

		const onActiveEditorChanged = () => {
			const activeControl = editorService.activeTextEditorControl;
			if (activeControl === control) {
				return;
			}
			control = activeControl;
			const editor = getCodeEditor(activeControl);

			statusEntries.forEach(statusEntry => statusEntry.onActiveEditorChanged(editor));
		};
		this._register(editorService.onDidActiveEditorChange(onActiveEditorChanged));

		onActiveEditorChanged();
	}

}


export interface LimitInfo {
	readonly onDidChange: Event<void>;

	readonly computed: number;
	readonly limited: number | false;
}

interface LanguageFeatureAccessor {
	readonly id: string;
	readonly name: string;
	readonly label: string;
	readonly source: string;
	readonly settingsId: string;
	getLimitReporter(editor: ICodeEditor): LimitInfo | undefined;
}

class ColorDecorationAccessor implements LanguageFeatureAccessor {
	readonly id = 'decoratorsLimitInfo';
	readonly name = nls.localize('colorDecoratorsStatusItem.name', 'Color Decorator Status');
	readonly label = nls.localize('status.limitedColorDecorators.short', 'Color decorators');
	readonly source = nls.localize('colorDecoratorsStatusItem.source', 'Color Decorators');
	readonly settingsId = 'editor.colorDecoratorsLimit';

	getLimitReporter(editor: ICodeEditor): LimitInfo | undefined {
		return ColorDetector.get(editor)?.limitReporter;
	}
}

class FoldingRangeAccessor implements LanguageFeatureAccessor {
	readonly id = 'foldingLimitInfo';
	readonly name = nls.localize('foldingRangesStatusItem.name', 'Folding Status');
	readonly label = nls.localize('status.limitedFoldingRanges.short', 'Folding ranges');
	readonly source = nls.localize('foldingRangesStatusItem.source', 'Folding');
	readonly settingsId = 'editor.foldingMaximumRegions';

	getLimitReporter(editor: ICodeEditor): LimitInfo | undefined {
		return FoldingController.get(editor)?.limitReporter;
	}
}

class LanguageStatusEntry implements IDisposable {

	private _limitStatusItem: IDisposable | undefined;
	private _indicatorChangeListener: IDisposable | undefined;

	constructor(private languageStatusService: ILanguageStatusService, private accessor: LanguageFeatureAccessor) {
	}

	onActiveEditorChanged(editor: ICodeEditor | null): boolean {
		if (this._indicatorChangeListener) {
			this._indicatorChangeListener.dispose();
			this._indicatorChangeListener = undefined;
		}

		let info: LimitInfo | undefined;
		if (editor) {
			info = this.accessor.getLimitReporter(editor);
		}
		this.updateStatusItem(info);
		if (info) {
			this._indicatorChangeListener = info.onDidChange(_ => {
				this.updateStatusItem(info);
			});
			return true;
		}
		return false;
	}


	private updateStatusItem(info: LimitInfo | undefined) {
		if (this._limitStatusItem) {
			this._limitStatusItem.dispose();
			this._limitStatusItem = undefined;
		}
		if (info && info.limited !== false) {
			const status: ILanguageStatus = {
				id: this.accessor.id,
				selector: '*',
				name: this.accessor.name,
				severity: Severity.Warning,
				label: this.accessor.label,
				detail: nls.localize('status.limited.details', 'only {0} shown for performance reasons', info.limited),
				command: { id: openSettingsCommand, arguments: [this.accessor.settingsId], title: configureSettingsLabel },
				accessibilityInfo: undefined,
				source: this.accessor.source,
				busy: false
			};
			this._limitStatusItem = this.languageStatusService.addStatus(status);
		}
	}

	public dispose() {
		this._limitStatusItem?.dispose();
		this._limitStatusItem = undefined;
		this._indicatorChangeListener?.dispose();
		this._indicatorChangeListener = undefined;
	}
}

Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench).registerWorkbenchContribution(
	LimitIndicatorContribution,
	LifecyclePhase.Restored
);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/list/browser/list.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/list/browser/list.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IWorkbenchContribution, WorkbenchPhase, registerWorkbenchContribution2 } from '../../../common/contributions.js';
import { registerAction2 } from '../../../../platform/actions/common/actions.js';
import { ListResizeColumnAction } from './listResizeColumnAction.js';

export class ListContext implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.listContext';

	constructor(
		@IContextKeyService contextKeyService: IContextKeyService
	) {
		contextKeyService.createKey<boolean>('listSupportsTypeNavigation', true);

		// @deprecated in favor of listSupportsTypeNavigation
		contextKeyService.createKey('listSupportsKeyboardNavigation', true);
	}
}

registerWorkbenchContribution2(ListContext.ID, ListContext, WorkbenchPhase.BlockStartup);
registerAction2(ListResizeColumnAction);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/list/browser/listResizeColumnAction.ts]---
Location: vscode-main/src/vs/workbench/contrib/list/browser/listResizeColumnAction.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { TableColumnResizeQuickPick } from './tableColumnResizeQuickPick.js';
import { Table } from '../../../../base/browser/ui/table/tableWidget.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { IListService, WorkbenchListFocusContextKey } from '../../../../platform/list/browser/listService.js';
import { Action2 } from '../../../../platform/actions/common/actions.js';
import { localize } from '../../../../nls.js';

export class ListResizeColumnAction extends Action2 {
	constructor() {
		super({
			id: 'list.resizeColumn',
			title: { value: localize('list.resizeColumn', "Resize Column"), original: 'Resize Column' },
			category: { value: localize('list', "List"), original: 'List' },
			precondition: WorkbenchListFocusContextKey,
			f1: true
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const listService = accessor.get(IListService);
		const instantiationService = accessor.get(IInstantiationService);

		const list = listService.lastFocusedList;
		if (list instanceof Table) {
			await instantiationService.createInstance(TableColumnResizeQuickPick, list).show();
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/list/browser/tableColumnResizeQuickPick.ts]---
Location: vscode-main/src/vs/workbench/contrib/list/browser/tableColumnResizeQuickPick.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Table } from '../../../../base/browser/ui/table/tableWidget.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import Severity from '../../../../base/common/severity.js';
import { localize } from '../../../../nls.js';
import { IQuickInputService, IQuickPickItem } from '../../../../platform/quickinput/common/quickInput.js';

interface IColumnResizeQuickPickItem extends IQuickPickItem {
	index: number;
}

export class TableColumnResizeQuickPick extends Disposable {
	constructor(
		private readonly _table: Table<unknown>,
		@IQuickInputService private readonly _quickInputService: IQuickInputService,
	) {
		super();
	}

	async show(): Promise<void> {
		const items: IColumnResizeQuickPickItem[] = [];
		this._table.getColumnLabels().forEach((label, index) => {
			if (label) {
				items.push({ label, index });
			}
		});
		const column = await this._quickInputService.pick<IColumnResizeQuickPickItem>(items, { placeHolder: localize('table.column.selection', "Select the column to resize, type to filter.") });
		if (!column) {
			return;
		}
		const value = await this._quickInputService.input({
			placeHolder: localize('table.column.resizeValue.placeHolder', "i.e. 20, 60, 100..."),
			prompt: localize('table.column.resizeValue.prompt', "Please enter a width in percentage for the '{0}' column.", column.label),
			validateInput: (input: string) => this._validateColumnResizeValue(input)
		});
		const percentageValue = value ? Number.parseInt(value) : undefined;
		if (!percentageValue) {
			return;
		}
		this._table.resizeColumn(column.index, percentageValue);
	}

	private async _validateColumnResizeValue(input: string): Promise<string | { content: string; severity: Severity } | null | undefined> {
		const percentage = Number.parseInt(input);
		if (input && !Number.isInteger(percentage)) {
			return localize('table.column.resizeValue.invalidType', "Please enter an integer.");
		} else if (percentage < 0 || percentage > 100) {
			return localize('table.column.resizeValue.invalidRange', "Please enter a number greater than 0 and less than or equal to 100.");
		}
		return null;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/localHistory/browser/localHistory.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/localHistory/browser/localHistory.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './localHistoryCommands.js';
import { WorkbenchPhase, registerWorkbenchContribution2 } from '../../../common/contributions.js';
import { LocalHistoryTimeline } from './localHistoryTimeline.js';

// Register Local History Timeline
registerWorkbenchContribution2(LocalHistoryTimeline.ID, LocalHistoryTimeline, WorkbenchPhase.BlockRestore /* registrations only */);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/localHistory/browser/localHistory.ts]---
Location: vscode-main/src/vs/workbench/contrib/localHistory/browser/localHistory.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { language } from '../../../../base/common/platform.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';
import { safeIntl } from '../../../../base/common/date.js';

interface ILocalHistoryDateFormatter {
	format: (timestamp: number) => string;
}

let localHistoryDateFormatter: ILocalHistoryDateFormatter | undefined = undefined;

export function getLocalHistoryDateFormatter(): ILocalHistoryDateFormatter {
	if (!localHistoryDateFormatter) {
		const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
		const formatter = safeIntl.DateTimeFormat(language, options).value;
		localHistoryDateFormatter = {
			format: date => formatter.format(date)
		};
	}

	return localHistoryDateFormatter;
}

export const LOCAL_HISTORY_MENU_CONTEXT_VALUE = 'localHistory:item';
export const LOCAL_HISTORY_MENU_CONTEXT_KEY = ContextKeyExpr.equals('timelineItem', LOCAL_HISTORY_MENU_CONTEXT_VALUE);

export const LOCAL_HISTORY_ICON_ENTRY = registerIcon('localHistory-icon', Codicon.circleOutline, localize('localHistoryIcon', "Icon for a local history entry in the timeline view."));
export const LOCAL_HISTORY_ICON_RESTORE = registerIcon('localHistory-restore', Codicon.check, localize('localHistoryRestore', "Icon for restoring contents of a local history entry."));
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/localHistory/browser/localHistoryCommands.ts]---
Location: vscode-main/src/vs/workbench/contrib/localHistory/browser/localHistoryCommands.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize, localize2 } from '../../../../nls.js';
import { URI } from '../../../../base/common/uri.js';
import { Event } from '../../../../base/common/event.js';
import { Schemas } from '../../../../base/common/network.js';
import { toErrorMessage } from '../../../../base/common/errorMessage.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { IWorkingCopyHistoryEntry, IWorkingCopyHistoryService } from '../../../services/workingCopy/common/workingCopyHistory.js';
import { API_OPEN_DIFF_EDITOR_COMMAND_ID } from '../../../browser/parts/editor/editorCommands.js';
import { LocalHistoryFileSystemProvider } from './localHistoryFileSystemProvider.js';
import { ContextKeyExpr, IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { ServicesAccessor } from '../../../../editor/browser/editorExtensions.js';
import { registerAction2, Action2, MenuId, MenuRegistry } from '../../../../platform/actions/common/actions.js';
import { basename, basenameOrAuthority, dirname } from '../../../../base/common/resources.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { EditorResourceAccessor, SaveSourceRegistry, SideBySideEditor } from '../../../common/editor.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IWorkingCopyService } from '../../../services/workingCopy/common/workingCopyService.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { ActiveEditorContext, ResourceContextKey } from '../../../common/contextkeys.js';
import { IQuickInputService, IQuickPickItem } from '../../../../platform/quickinput/common/quickInput.js';
import { getIconClasses } from '../../../../editor/common/services/getIconClasses.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { coalesce } from '../../../../base/common/arrays.js';
import { getLocalHistoryDateFormatter, LOCAL_HISTORY_ICON_RESTORE, LOCAL_HISTORY_MENU_CONTEXT_KEY } from './localHistory.js';
import { IPathService } from '../../../services/path/common/pathService.js';
import { ResourceSet } from '../../../../base/common/map.js';
import { IHistoryService } from '../../../services/history/common/history.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { IEditorOptions } from '../../../../platform/editor/common/editor.js';

const LOCAL_HISTORY_CATEGORY = localize2('localHistory.category', 'Local History');
const CTX_LOCAL_HISTORY_ENABLED = ContextKeyExpr.has('config.workbench.localHistory.enabled');

export interface ITimelineCommandArgument {
	uri: URI;
	handle: string;
}

//#region Compare with File

export const COMPARE_WITH_FILE_LABEL = localize2('localHistory.compareWithFile', 'Compare with File');

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'workbench.action.localHistory.compareWithFile',
			title: COMPARE_WITH_FILE_LABEL,
			menu: {
				id: MenuId.TimelineItemContext,
				group: '1_compare',
				order: 1,
				when: LOCAL_HISTORY_MENU_CONTEXT_KEY
			}
		});
	}
	async run(accessor: ServicesAccessor, item: ITimelineCommandArgument): Promise<void> {
		const commandService = accessor.get(ICommandService);
		const workingCopyHistoryService = accessor.get(IWorkingCopyHistoryService);

		const { entry } = await findLocalHistoryEntry(workingCopyHistoryService, item);
		if (entry) {
			return commandService.executeCommand(API_OPEN_DIFF_EDITOR_COMMAND_ID, ...toDiffEditorArguments(entry, entry.workingCopy.resource));
		}
	}
});

//#endregion

//#region Compare with Previous

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'workbench.action.localHistory.compareWithPrevious',
			title: localize2('localHistory.compareWithPrevious', 'Compare with Previous'),
			menu: {
				id: MenuId.TimelineItemContext,
				group: '1_compare',
				order: 2,
				when: LOCAL_HISTORY_MENU_CONTEXT_KEY
			}
		});
	}
	async run(accessor: ServicesAccessor, item: ITimelineCommandArgument): Promise<void> {
		const commandService = accessor.get(ICommandService);
		const workingCopyHistoryService = accessor.get(IWorkingCopyHistoryService);
		const editorService = accessor.get(IEditorService);

		const { entry, previous } = await findLocalHistoryEntry(workingCopyHistoryService, item);
		if (entry) {

			// Without a previous entry, just show the entry directly
			if (!previous) {
				return openEntry(entry, editorService);
			}

			// Open real diff editor
			return commandService.executeCommand(API_OPEN_DIFF_EDITOR_COMMAND_ID, ...toDiffEditorArguments(previous, entry));
		}
	}
});

//#endregion

//#region Select for Compare / Compare with Selected

let itemSelectedForCompare: ITimelineCommandArgument | undefined = undefined;

const LocalHistoryItemSelectedForCompare = new RawContextKey<boolean>('localHistoryItemSelectedForCompare', false, true);

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'workbench.action.localHistory.selectForCompare',
			title: localize2('localHistory.selectForCompare', 'Select for Compare'),
			menu: {
				id: MenuId.TimelineItemContext,
				group: '2_compare_with',
				order: 2,
				when: LOCAL_HISTORY_MENU_CONTEXT_KEY
			}
		});
	}
	async run(accessor: ServicesAccessor, item: ITimelineCommandArgument): Promise<void> {
		const workingCopyHistoryService = accessor.get(IWorkingCopyHistoryService);
		const contextKeyService = accessor.get(IContextKeyService);

		const { entry } = await findLocalHistoryEntry(workingCopyHistoryService, item);
		if (entry) {
			itemSelectedForCompare = item;
			LocalHistoryItemSelectedForCompare.bindTo(contextKeyService).set(true);
		}
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'workbench.action.localHistory.compareWithSelected',
			title: localize2('localHistory.compareWithSelected', 'Compare with Selected'),
			menu: {
				id: MenuId.TimelineItemContext,
				group: '2_compare_with',
				order: 1,
				when: ContextKeyExpr.and(LOCAL_HISTORY_MENU_CONTEXT_KEY, LocalHistoryItemSelectedForCompare)
			}
		});
	}
	async run(accessor: ServicesAccessor, item: ITimelineCommandArgument): Promise<void> {
		const workingCopyHistoryService = accessor.get(IWorkingCopyHistoryService);
		const commandService = accessor.get(ICommandService);

		if (!itemSelectedForCompare) {
			return;
		}

		const selectedEntry = (await findLocalHistoryEntry(workingCopyHistoryService, itemSelectedForCompare)).entry;
		if (!selectedEntry) {
			return;
		}

		const { entry } = await findLocalHistoryEntry(workingCopyHistoryService, item);
		if (entry) {
			return commandService.executeCommand(API_OPEN_DIFF_EDITOR_COMMAND_ID, ...toDiffEditorArguments(selectedEntry, entry));
		}
	}
});

//#endregion

//#region Show Contents

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'workbench.action.localHistory.open',
			title: localize2('localHistory.open', 'Show Contents'),
			menu: {
				id: MenuId.TimelineItemContext,
				group: '3_contents',
				order: 1,
				when: LOCAL_HISTORY_MENU_CONTEXT_KEY
			}
		});
	}
	async run(accessor: ServicesAccessor, item: ITimelineCommandArgument): Promise<void> {
		const workingCopyHistoryService = accessor.get(IWorkingCopyHistoryService);
		const editorService = accessor.get(IEditorService);

		const { entry } = await findLocalHistoryEntry(workingCopyHistoryService, item);
		if (entry) {
			return openEntry(entry, editorService);
		}
	}
});

//#region Restore Contents

const RESTORE_CONTENTS_LABEL = localize2('localHistory.restore', 'Restore Contents');

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'workbench.action.localHistory.restoreViaEditor',
			title: RESTORE_CONTENTS_LABEL,
			menu: {
				id: MenuId.EditorTitle,
				group: 'navigation',
				order: -10,
				when: ResourceContextKey.Scheme.isEqualTo(LocalHistoryFileSystemProvider.SCHEMA)
			},
			icon: LOCAL_HISTORY_ICON_RESTORE
		});
	}
	async run(accessor: ServicesAccessor, uri: URI): Promise<void> {
		const { associatedResource, location } = LocalHistoryFileSystemProvider.fromLocalHistoryFileSystem(uri);

		return restore(accessor, { uri: associatedResource, handle: basenameOrAuthority(location) });
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'workbench.action.localHistory.restore',
			title: RESTORE_CONTENTS_LABEL,
			menu: {
				id: MenuId.TimelineItemContext,
				group: '3_contents',
				order: 2,
				when: LOCAL_HISTORY_MENU_CONTEXT_KEY
			}
		});
	}
	async run(accessor: ServicesAccessor, item: ITimelineCommandArgument): Promise<void> {
		return restore(accessor, item);
	}
});

const restoreSaveSource = SaveSourceRegistry.registerSource('localHistoryRestore.source', localize('localHistoryRestore.source', "File Restored"));

async function restore(accessor: ServicesAccessor, item: ITimelineCommandArgument): Promise<void> {
	const fileService = accessor.get(IFileService);
	const dialogService = accessor.get(IDialogService);
	const workingCopyService = accessor.get(IWorkingCopyService);
	const workingCopyHistoryService = accessor.get(IWorkingCopyHistoryService);
	const editorService = accessor.get(IEditorService);

	const { entry } = await findLocalHistoryEntry(workingCopyHistoryService, item);
	if (entry) {

		// Ask for confirmation
		const { confirmed } = await dialogService.confirm({
			type: 'warning',
			message: localize('confirmRestoreMessage', "Do you want to restore the contents of '{0}'?", basename(entry.workingCopy.resource)),
			detail: localize('confirmRestoreDetail', "Restoring will discard any unsaved changes."),
			primaryButton: localize({ key: 'restoreButtonLabel', comment: ['&& denotes a mnemonic'] }, "&&Restore")
		});

		if (!confirmed) {
			return;
		}

		// Revert all dirty working copies for target
		const workingCopies = workingCopyService.getAll(entry.workingCopy.resource);
		if (workingCopies) {
			for (const workingCopy of workingCopies) {
				if (workingCopy.isDirty()) {
					await workingCopy.revert({ soft: true });
				}
			}
		}

		// Replace target with contents of history entry
		try {
			await fileService.cloneFile(entry.location, entry.workingCopy.resource);
		} catch (error) {

			// It is possible that we fail to copy the history entry to the
			// destination, for example when the destination is write protected.
			// In that case tell the user and return, it is still possible for
			// the user to manually copy the changes over from the diff editor.

			await dialogService.error(localize('unableToRestore', "Unable to restore '{0}'.", basename(entry.workingCopy.resource)), toErrorMessage(error));

			return;
		}

		// Restore all working copies for target
		if (workingCopies) {
			for (const workingCopy of workingCopies) {
				await workingCopy.revert({ force: true });
			}
		}

		// Open target
		await editorService.openEditor({ resource: entry.workingCopy.resource });

		// Add new entry
		await workingCopyHistoryService.addEntry({
			resource: entry.workingCopy.resource,
			source: restoreSaveSource
		}, CancellationToken.None);

		// Close source
		await closeEntry(entry, editorService);
	}
}

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'workbench.action.localHistory.restoreViaPicker',
			title: localize2('localHistory.restoreViaPicker', 'Find Entry to Restore'),
			f1: true,
			category: LOCAL_HISTORY_CATEGORY,
			precondition: CTX_LOCAL_HISTORY_ENABLED
		});
	}
	async run(accessor: ServicesAccessor): Promise<void> {
		const workingCopyHistoryService = accessor.get(IWorkingCopyHistoryService);
		const quickInputService = accessor.get(IQuickInputService);
		const modelService = accessor.get(IModelService);
		const languageService = accessor.get(ILanguageService);
		const labelService = accessor.get(ILabelService);
		const editorService = accessor.get(IEditorService);
		const fileService = accessor.get(IFileService);
		const commandService = accessor.get(ICommandService);
		const historyService = accessor.get(IHistoryService);

		// Show all resources with associated history entries in picker
		// with progress because this operation will take longer the more
		// files have been saved overall.
		//
		// Sort the resources by history to put more relevant entries
		// to the top.

		const resourcePickerDisposables = new DisposableStore();
		const resourcePicker = resourcePickerDisposables.add(quickInputService.createQuickPick<IQuickPickItem & { resource: URI }>());

		let cts = new CancellationTokenSource();
		resourcePickerDisposables.add(resourcePicker.onDidHide(() => cts.dispose(true)));

		resourcePicker.busy = true;
		resourcePicker.show();

		const resources = new ResourceSet(await workingCopyHistoryService.getAll(cts.token));
		const recentEditorResources = new ResourceSet(coalesce(historyService.getHistory().map(({ resource }) => resource)));

		const resourcesSortedByRecency: URI[] = [];
		for (const resource of recentEditorResources) {
			if (resources.has(resource)) {
				resourcesSortedByRecency.push(resource);
				resources.delete(resource);
			}
		}
		resourcesSortedByRecency.push(...[...resources].sort((r1, r2) => r1.fsPath < r2.fsPath ? -1 : 1));

		resourcePicker.busy = false;
		resourcePicker.placeholder = localize('restoreViaPicker.filePlaceholder', "Select the file to show local history for");
		resourcePicker.matchOnLabel = true;
		resourcePicker.matchOnDescription = true;
		resourcePicker.items = [...resourcesSortedByRecency].map(resource => ({
			resource,
			label: basenameOrAuthority(resource),
			description: labelService.getUriLabel(dirname(resource), { relative: true }),
			iconClasses: getIconClasses(modelService, languageService, resource)
		}));

		await Event.toPromise(resourcePicker.onDidAccept);
		resourcePickerDisposables.dispose();

		const resource = resourcePicker.selectedItems.at(0)?.resource;
		if (!resource) {
			return;
		}

		// Show all entries for the picked resource in another picker
		// and open the entry in the end that was selected by the user

		const entryPickerDisposables = new DisposableStore();
		const entryPicker = entryPickerDisposables.add(quickInputService.createQuickPick<IQuickPickItem & { entry: IWorkingCopyHistoryEntry }>());

		cts = new CancellationTokenSource();
		entryPickerDisposables.add(entryPicker.onDidHide(() => cts.dispose(true)));

		entryPicker.busy = true;
		entryPicker.show();

		const entries = await workingCopyHistoryService.getEntries(resource, cts.token);

		entryPicker.busy = false;
		entryPicker.canAcceptInBackground = true;
		entryPicker.placeholder = localize('restoreViaPicker.entryPlaceholder', "Select the local history entry to open");
		entryPicker.matchOnLabel = true;
		entryPicker.matchOnDescription = true;
		entryPicker.items = Array.from(entries).reverse().map(entry => ({
			entry,
			label: `$(circle-outline) ${SaveSourceRegistry.getSourceLabel(entry.source)}`,
			description: toLocalHistoryEntryDateLabel(entry.timestamp)
		}));

		entryPickerDisposables.add(entryPicker.onDidAccept(async e => {
			if (!e.inBackground) {
				entryPickerDisposables.dispose();
			}

			const selectedItem = entryPicker.selectedItems.at(0);
			if (!selectedItem) {
				return;
			}

			const resourceExists = await fileService.exists(selectedItem.entry.workingCopy.resource);
			if (resourceExists) {
				return commandService.executeCommand(API_OPEN_DIFF_EDITOR_COMMAND_ID, ...toDiffEditorArguments(selectedItem.entry, selectedItem.entry.workingCopy.resource, { preserveFocus: e.inBackground }));
			}

			return openEntry(selectedItem.entry, editorService, { preserveFocus: e.inBackground });
		}));
	}
});

MenuRegistry.appendMenuItem(MenuId.TimelineTitle, { command: { id: 'workbench.action.localHistory.restoreViaPicker', title: localize2('localHistory.restoreViaPickerMenu', 'Local History: Find Entry to Restore...') }, group: 'submenu', order: 1, when: CTX_LOCAL_HISTORY_ENABLED });

//#endregion

//#region Rename

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'workbench.action.localHistory.rename',
			title: localize2('localHistory.rename', 'Rename'),
			menu: {
				id: MenuId.TimelineItemContext,
				group: '5_edit',
				order: 1,
				when: LOCAL_HISTORY_MENU_CONTEXT_KEY
			}
		});
	}
	async run(accessor: ServicesAccessor, item: ITimelineCommandArgument): Promise<void> {
		const workingCopyHistoryService = accessor.get(IWorkingCopyHistoryService);
		const quickInputService = accessor.get(IQuickInputService);

		const { entry } = await findLocalHistoryEntry(workingCopyHistoryService, item);
		if (entry) {
			const disposables = new DisposableStore();
			const inputBox = disposables.add(quickInputService.createInputBox());
			inputBox.title = localize('renameLocalHistoryEntryTitle', "Rename Local History Entry");
			inputBox.ignoreFocusOut = true;
			inputBox.placeholder = localize('renameLocalHistoryPlaceholder', "Enter the new name of the local history entry");
			inputBox.value = SaveSourceRegistry.getSourceLabel(entry.source);
			inputBox.show();
			disposables.add(inputBox.onDidAccept(() => {
				if (inputBox.value) {
					workingCopyHistoryService.updateEntry(entry, { source: inputBox.value }, CancellationToken.None);
				}
				disposables.dispose();
			}));
		}
	}
});

//#endregion

//#region Delete

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'workbench.action.localHistory.delete',
			title: localize2('localHistory.delete', 'Delete'),
			menu: {
				id: MenuId.TimelineItemContext,
				group: '5_edit',
				order: 2,
				when: LOCAL_HISTORY_MENU_CONTEXT_KEY
			}
		});
	}
	async run(accessor: ServicesAccessor, item: ITimelineCommandArgument): Promise<void> {
		const workingCopyHistoryService = accessor.get(IWorkingCopyHistoryService);
		const editorService = accessor.get(IEditorService);
		const dialogService = accessor.get(IDialogService);

		const { entry } = await findLocalHistoryEntry(workingCopyHistoryService, item);
		if (entry) {

			// Ask for confirmation
			const { confirmed } = await dialogService.confirm({
				type: 'warning',
				message: localize('confirmDeleteMessage', "Do you want to delete the local history entry of '{0}' from {1}?", entry.workingCopy.name, toLocalHistoryEntryDateLabel(entry.timestamp)),
				detail: localize('confirmDeleteDetail', "This action is irreversible!"),
				primaryButton: localize({ key: 'deleteButtonLabel', comment: ['&& denotes a mnemonic'] }, "&&Delete"),
			});

			if (!confirmed) {
				return;
			}

			// Remove via service
			await workingCopyHistoryService.removeEntry(entry, CancellationToken.None);

			// Close any opened editors
			await closeEntry(entry, editorService);
		}
	}
});

//#endregion

//#region Delete All

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'workbench.action.localHistory.deleteAll',
			title: localize2('localHistory.deleteAll', 'Delete All'),
			f1: true,
			category: LOCAL_HISTORY_CATEGORY,
			precondition: CTX_LOCAL_HISTORY_ENABLED
		});
	}
	async run(accessor: ServicesAccessor): Promise<void> {
		const dialogService = accessor.get(IDialogService);
		const workingCopyHistoryService = accessor.get(IWorkingCopyHistoryService);

		// Ask for confirmation
		const { confirmed } = await dialogService.confirm({
			type: 'warning',
			message: localize('confirmDeleteAllMessage', "Do you want to delete all entries of all files in local history?"),
			detail: localize('confirmDeleteAllDetail', "This action is irreversible!"),
			primaryButton: localize({ key: 'deleteAllButtonLabel', comment: ['&& denotes a mnemonic'] }, "&&Delete All"),
		});

		if (!confirmed) {
			return;
		}

		// Remove via service
		await workingCopyHistoryService.removeAll(CancellationToken.None);
	}
});

//#endregion

//#region Create

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'workbench.action.localHistory.create',
			title: localize2('localHistory.create', 'Create Entry'),
			f1: true,
			category: LOCAL_HISTORY_CATEGORY,
			precondition: ContextKeyExpr.and(CTX_LOCAL_HISTORY_ENABLED, ActiveEditorContext)
		});
	}
	async run(accessor: ServicesAccessor): Promise<void> {
		const workingCopyHistoryService = accessor.get(IWorkingCopyHistoryService);
		const quickInputService = accessor.get(IQuickInputService);
		const editorService = accessor.get(IEditorService);
		const labelService = accessor.get(ILabelService);
		const pathService = accessor.get(IPathService);

		const resource = EditorResourceAccessor.getOriginalUri(editorService.activeEditor, { supportSideBySide: SideBySideEditor.PRIMARY });
		if (resource?.scheme !== pathService.defaultUriScheme && resource?.scheme !== Schemas.vscodeUserData) {
			return; // only enable for selected schemes
		}

		const disposables = new DisposableStore();
		const inputBox = disposables.add(quickInputService.createInputBox());
		inputBox.title = localize('createLocalHistoryEntryTitle', "Create Local History Entry");
		inputBox.ignoreFocusOut = true;
		inputBox.placeholder = localize('createLocalHistoryPlaceholder', "Enter the new name of the local history entry for '{0}'", labelService.getUriBasenameLabel(resource));
		inputBox.show();
		disposables.add(inputBox.onDidAccept(async () => {
			const entrySource = inputBox.value;
			disposables.dispose();

			if (entrySource) {
				await workingCopyHistoryService.addEntry({ resource, source: inputBox.value }, CancellationToken.None);
			}
		}));
	}
});

//#endregion

//#region Helpers

async function openEntry(entry: IWorkingCopyHistoryEntry, editorService: IEditorService, options?: IEditorOptions): Promise<void> {
	const resource = LocalHistoryFileSystemProvider.toLocalHistoryFileSystem({ location: entry.location, associatedResource: entry.workingCopy.resource });

	await editorService.openEditor({
		resource,
		label: localize('localHistoryEditorLabel', "{0} ({1} • {2})", entry.workingCopy.name, SaveSourceRegistry.getSourceLabel(entry.source), toLocalHistoryEntryDateLabel(entry.timestamp)),
		options
	});
}

async function closeEntry(entry: IWorkingCopyHistoryEntry, editorService: IEditorService): Promise<void> {
	const resource = LocalHistoryFileSystemProvider.toLocalHistoryFileSystem({ location: entry.location, associatedResource: entry.workingCopy.resource });

	const editors = editorService.findEditors(resource, { supportSideBySide: SideBySideEditor.ANY });
	await editorService.closeEditors(editors, { preserveFocus: true });
}

export function toDiffEditorArguments(entry: IWorkingCopyHistoryEntry, resource: URI, options?: IEditorOptions): unknown[];
export function toDiffEditorArguments(previousEntry: IWorkingCopyHistoryEntry, entry: IWorkingCopyHistoryEntry, options?: IEditorOptions): unknown[];
export function toDiffEditorArguments(arg1: IWorkingCopyHistoryEntry, arg2: IWorkingCopyHistoryEntry | URI, options?: IEditorOptions): unknown[] {

	// Left hand side is always a working copy history entry
	const originalResource = LocalHistoryFileSystemProvider.toLocalHistoryFileSystem({ location: arg1.location, associatedResource: arg1.workingCopy.resource });

	let label: string;

	// Right hand side depends on how the method was called
	// and is either another working copy history entry
	// or the file on disk.

	let modifiedResource: URI;

	// Compare with file on disk
	if (URI.isUri(arg2)) {
		const resource = arg2;

		modifiedResource = resource;
		label = localize('localHistoryCompareToFileEditorLabel', "{0} ({1} • {2}) ↔ {3}", arg1.workingCopy.name, SaveSourceRegistry.getSourceLabel(arg1.source), toLocalHistoryEntryDateLabel(arg1.timestamp), arg1.workingCopy.name);
	}

	// Compare with another entry
	else {
		const modified = arg2;

		modifiedResource = LocalHistoryFileSystemProvider.toLocalHistoryFileSystem({ location: modified.location, associatedResource: modified.workingCopy.resource });
		label = localize('localHistoryCompareToPreviousEditorLabel', "{0} ({1} • {2}) ↔ {3} ({4} • {5})", arg1.workingCopy.name, SaveSourceRegistry.getSourceLabel(arg1.source), toLocalHistoryEntryDateLabel(arg1.timestamp), modified.workingCopy.name, SaveSourceRegistry.getSourceLabel(modified.source), toLocalHistoryEntryDateLabel(modified.timestamp));
	}

	return [
		originalResource,
		modifiedResource,
		label,
		options ? [undefined, options] : undefined
	];
}

export async function findLocalHistoryEntry(workingCopyHistoryService: IWorkingCopyHistoryService, descriptor: ITimelineCommandArgument): Promise<{ entry: IWorkingCopyHistoryEntry | undefined; previous: IWorkingCopyHistoryEntry | undefined }> {
	const entries = await workingCopyHistoryService.getEntries(descriptor.uri, CancellationToken.None);

	let currentEntry: IWorkingCopyHistoryEntry | undefined = undefined;
	let previousEntry: IWorkingCopyHistoryEntry | undefined = undefined;
	for (let i = 0; i < entries.length; i++) {
		const entry = entries[i];

		if (entry.id === descriptor.handle) {
			currentEntry = entry;
			previousEntry = entries[i - 1];
			break;
		}
	}

	return {
		entry: currentEntry,
		previous: previousEntry
	};
}

const SEP = /\//g;
function toLocalHistoryEntryDateLabel(timestamp: number): string {
	return `${getLocalHistoryDateFormatter().format(timestamp).replace(SEP, '-')}`; // preserving `/` will break editor labels, so replace it with a non-path symbol
}

//#endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/localHistory/browser/localHistoryFileSystemProvider.ts]---
Location: vscode-main/src/vs/workbench/contrib/localHistory/browser/localHistoryFileSystemProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../../base/common/event.js';
import { Disposable, IDisposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { IFileDeleteOptions, IFileOverwriteOptions, FileSystemProviderCapabilities, FileType, IFileWriteOptions, hasReadWriteCapability, IFileService, IFileSystemProvider, IFileSystemProviderWithFileReadWriteCapability, IStat, IWatchOptions } from '../../../../platform/files/common/files.js';
import { isEqual } from '../../../../base/common/resources.js';
import { VSBuffer } from '../../../../base/common/buffer.js';

interface ILocalHistoryResource {

	/**
	 * The location of the local history entry to read from.
	 */
	readonly location: URI;

	/**
	 * The associated resource the local history entry is about.
	 */
	readonly associatedResource: URI;
}

interface ISerializedLocalHistoryResource {
	readonly location: string;
	readonly associatedResource: string;
}

/**
 * A wrapper around a standard file system provider
 * that is entirely readonly.
 */
export class LocalHistoryFileSystemProvider implements IFileSystemProvider, IFileSystemProviderWithFileReadWriteCapability {

	static readonly SCHEMA = 'vscode-local-history';

	static toLocalHistoryFileSystem(resource: ILocalHistoryResource): URI {
		const serializedLocalHistoryResource: ISerializedLocalHistoryResource = {
			location: resource.location.toString(true),
			associatedResource: resource.associatedResource.toString(true)
		};

		// Try to preserve the associated resource as much as possible
		// and only keep the `query` part dynamic. This enables other
		// components (e.g. other timeline providers) to continue
		// providing timeline entries even when our resource is active.
		return resource.associatedResource.with({
			scheme: LocalHistoryFileSystemProvider.SCHEMA,
			query: JSON.stringify(serializedLocalHistoryResource)
		});
	}

	static fromLocalHistoryFileSystem(resource: URI): ILocalHistoryResource {
		const serializedLocalHistoryResource: ISerializedLocalHistoryResource = JSON.parse(resource.query);

		return {
			location: URI.parse(serializedLocalHistoryResource.location),
			associatedResource: URI.parse(serializedLocalHistoryResource.associatedResource)
		};
	}

	private static readonly EMPTY_RESOURCE = URI.from({ scheme: LocalHistoryFileSystemProvider.SCHEMA, path: '/empty' });

	static readonly EMPTY: ILocalHistoryResource = {
		location: LocalHistoryFileSystemProvider.EMPTY_RESOURCE,
		associatedResource: LocalHistoryFileSystemProvider.EMPTY_RESOURCE
	};

	get capabilities() {
		return FileSystemProviderCapabilities.FileReadWrite | FileSystemProviderCapabilities.Readonly;
	}

	constructor(private readonly fileService: IFileService) { }

	private readonly mapSchemeToProvider = new Map<string, Promise<IFileSystemProvider>>();

	private async withProvider(resource: URI): Promise<IFileSystemProvider> {
		const scheme = resource.scheme;

		let providerPromise = this.mapSchemeToProvider.get(scheme);
		if (!providerPromise) {

			// Resolve early when provider already exists
			const provider = this.fileService.getProvider(scheme);
			if (provider) {
				providerPromise = Promise.resolve(provider);
			}

			// Otherwise wait for registration
			else {
				providerPromise = new Promise<IFileSystemProvider>(resolve => {
					const disposable = this.fileService.onDidChangeFileSystemProviderRegistrations(e => {
						if (e.added && e.provider && e.scheme === scheme) {
							disposable.dispose();

							resolve(e.provider);
						}
					});
				});
			}

			this.mapSchemeToProvider.set(scheme, providerPromise);
		}

		return providerPromise;
	}

	//#region Supported File Operations

	async stat(resource: URI): Promise<IStat> {
		const location = LocalHistoryFileSystemProvider.fromLocalHistoryFileSystem(resource).location;

		// Special case: empty resource
		if (isEqual(LocalHistoryFileSystemProvider.EMPTY_RESOURCE, location)) {
			return { type: FileType.File, ctime: 0, mtime: 0, size: 0 };
		}

		// Otherwise delegate to provider
		return (await this.withProvider(location)).stat(location);
	}

	async readFile(resource: URI): Promise<Uint8Array> {
		const location = LocalHistoryFileSystemProvider.fromLocalHistoryFileSystem(resource).location;

		// Special case: empty resource
		if (isEqual(LocalHistoryFileSystemProvider.EMPTY_RESOURCE, location)) {
			return VSBuffer.fromString('').buffer;
		}

		// Otherwise delegate to provider
		const provider = await this.withProvider(location);
		if (hasReadWriteCapability(provider)) {
			return provider.readFile(location);
		}

		throw new Error('Unsupported');
	}

	//#endregion

	//#region Unsupported File Operations

	readonly onDidChangeCapabilities = Event.None;
	readonly onDidChangeFile = Event.None;

	async writeFile(resource: URI, content: Uint8Array, opts: IFileWriteOptions): Promise<void> { }

	async mkdir(resource: URI): Promise<void> { }
	async readdir(resource: URI): Promise<[string, FileType][]> { return []; }

	async rename(from: URI, to: URI, opts: IFileOverwriteOptions): Promise<void> { }
	async delete(resource: URI, opts: IFileDeleteOptions): Promise<void> { }

	watch(resource: URI, opts: IWatchOptions): IDisposable { return Disposable.None; }

	//#endregion
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/localHistory/browser/localHistoryTimeline.ts]---
Location: vscode-main/src/vs/workbench/contrib/localHistory/browser/localHistoryTimeline.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { Emitter } from '../../../../base/common/event.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Disposable, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { ITimelineService, Timeline, TimelineChangeEvent, TimelineItem, TimelineOptions, TimelineProvider } from '../../timeline/common/timeline.js';
import { IWorkingCopyHistoryEntry, IWorkingCopyHistoryService } from '../../../services/workingCopy/common/workingCopyHistory.js';
import { URI } from '../../../../base/common/uri.js';
import { IPathService } from '../../../services/path/common/pathService.js';
import { API_OPEN_DIFF_EDITOR_COMMAND_ID } from '../../../browser/parts/editor/editorCommands.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { LocalHistoryFileSystemProvider } from './localHistoryFileSystemProvider.js';
import { IWorkbenchEnvironmentService } from '../../../services/environment/common/environmentService.js';
import { SaveSourceRegistry } from '../../../common/editor.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { COMPARE_WITH_FILE_LABEL, toDiffEditorArguments } from './localHistoryCommands.js';
import { MarkdownString } from '../../../../base/common/htmlContent.js';
import { getLocalHistoryDateFormatter, LOCAL_HISTORY_ICON_ENTRY, LOCAL_HISTORY_MENU_CONTEXT_VALUE } from './localHistory.js';
import { Schemas } from '../../../../base/common/network.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { getVirtualWorkspaceAuthority } from '../../../../platform/workspace/common/virtualWorkspace.js';

export class LocalHistoryTimeline extends Disposable implements IWorkbenchContribution, TimelineProvider {

	static readonly ID = 'workbench.contrib.localHistoryTimeline';

	private static readonly LOCAL_HISTORY_ENABLED_SETTINGS_KEY = 'workbench.localHistory.enabled';

	readonly id = 'timeline.localHistory';

	readonly label = localize('localHistory', "Local History");

	readonly scheme = '*'; // we try to show local history for all schemes if possible

	private readonly _onDidChange = this._register(new Emitter<TimelineChangeEvent>());
	readonly onDidChange = this._onDidChange.event;

	private readonly timelineProviderDisposable = this._register(new MutableDisposable());

	constructor(
		@ITimelineService private readonly timelineService: ITimelineService,
		@IWorkingCopyHistoryService private readonly workingCopyHistoryService: IWorkingCopyHistoryService,
		@IPathService private readonly pathService: IPathService,
		@IFileService private readonly fileService: IFileService,
		@IWorkbenchEnvironmentService private readonly environmentService: IWorkbenchEnvironmentService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService
	) {
		super();

		this.registerComponents();
		this.registerListeners();
	}

	private registerComponents(): void {

		// Timeline (if enabled)
		this.updateTimelineRegistration();

		// File Service Provider
		this._register(this.fileService.registerProvider(LocalHistoryFileSystemProvider.SCHEMA, new LocalHistoryFileSystemProvider(this.fileService)));
	}

	private updateTimelineRegistration(): void {
		if (this.configurationService.getValue<boolean>(LocalHistoryTimeline.LOCAL_HISTORY_ENABLED_SETTINGS_KEY)) {
			this.timelineProviderDisposable.value = this.timelineService.registerTimelineProvider(this);
		} else {
			this.timelineProviderDisposable.clear();
		}
	}

	private registerListeners(): void {

		// History changes
		this._register(this.workingCopyHistoryService.onDidAddEntry(e => this.onDidChangeWorkingCopyHistoryEntry(e.entry)));
		this._register(this.workingCopyHistoryService.onDidChangeEntry(e => this.onDidChangeWorkingCopyHistoryEntry(e.entry)));
		this._register(this.workingCopyHistoryService.onDidReplaceEntry(e => this.onDidChangeWorkingCopyHistoryEntry(e.entry)));
		this._register(this.workingCopyHistoryService.onDidRemoveEntry(e => this.onDidChangeWorkingCopyHistoryEntry(e.entry)));
		this._register(this.workingCopyHistoryService.onDidRemoveEntries(() => this.onDidChangeWorkingCopyHistoryEntry(undefined /* all entries */)));
		this._register(this.workingCopyHistoryService.onDidMoveEntries(() => this.onDidChangeWorkingCopyHistoryEntry(undefined /* all entries */)));

		// Configuration changes
		this._register(this.configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(LocalHistoryTimeline.LOCAL_HISTORY_ENABLED_SETTINGS_KEY)) {
				this.updateTimelineRegistration();
			}
		}));
	}

	private onDidChangeWorkingCopyHistoryEntry(entry: IWorkingCopyHistoryEntry | undefined): void {

		// Re-emit as timeline change event
		this._onDidChange.fire({
			id: this.id,
			uri: entry?.workingCopy.resource,
			reset: true // there is no other way to indicate that items might have been replaced/removed
		});
	}

	async provideTimeline(uri: URI, options: TimelineOptions, token: CancellationToken): Promise<Timeline> {
		const items: TimelineItem[] = [];

		// Try to convert the provided `uri` into a form that is likely
		// for the provider to find entries for so that we can ensure
		// the timeline is always providing local history entries

		let resource: URI | undefined = undefined;
		if (uri.scheme === LocalHistoryFileSystemProvider.SCHEMA) {
			// `vscode-local-history`: convert back to the associated resource
			resource = LocalHistoryFileSystemProvider.fromLocalHistoryFileSystem(uri).associatedResource;
		} else if (uri.scheme === this.pathService.defaultUriScheme || uri.scheme === Schemas.vscodeUserData) {
			// default-scheme / settings: keep as is
			resource = uri;
		} else if (this.fileService.hasProvider(uri)) {
			// anything that is backed by a file system provider:
			// try best to convert the URI back into a form that is
			// likely to match the workspace URIs. That means:
			// - change to the default URI scheme
			// - change to the remote authority or virtual workspace authority
			// - preserve the path
			resource = URI.from({
				scheme: this.pathService.defaultUriScheme,
				authority: this.environmentService.remoteAuthority ?? getVirtualWorkspaceAuthority(this.contextService.getWorkspace()),
				path: uri.path
			});
		}

		if (resource) {

			// Retrieve from working copy history
			const entries = await this.workingCopyHistoryService.getEntries(resource, token);

			// Convert to timeline items
			for (const entry of entries) {
				items.push(this.toTimelineItem(entry));
			}
		}

		return {
			source: this.id,
			items
		};
	}

	private toTimelineItem(entry: IWorkingCopyHistoryEntry): TimelineItem {
		return {
			handle: entry.id,
			label: SaveSourceRegistry.getSourceLabel(entry.source),
			tooltip: new MarkdownString(`$(history) ${getLocalHistoryDateFormatter().format(entry.timestamp)}\n\n${SaveSourceRegistry.getSourceLabel(entry.source)}${entry.sourceDescription ? ` (${entry.sourceDescription})` : ``}`, { supportThemeIcons: true }),
			source: this.id,
			timestamp: entry.timestamp,
			themeIcon: LOCAL_HISTORY_ICON_ENTRY,
			contextValue: LOCAL_HISTORY_MENU_CONTEXT_VALUE,
			command: {
				id: API_OPEN_DIFF_EDITOR_COMMAND_ID,
				title: COMPARE_WITH_FILE_LABEL.value,
				arguments: toDiffEditorArguments(entry, entry.workingCopy.resource)
			}
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/localHistory/electron-browser/localHistory.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/localHistory/electron-browser/localHistory.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './localHistoryCommands.js';
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/localHistory/electron-browser/localHistoryCommands.ts]---
Location: vscode-main/src/vs/workbench/contrib/localHistory/electron-browser/localHistoryCommands.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize2 } from '../../../../nls.js';
import { IWorkingCopyHistoryService } from '../../../services/workingCopy/common/workingCopyHistory.js';
import { ServicesAccessor } from '../../../../editor/browser/editorExtensions.js';
import { registerAction2, Action2, MenuId } from '../../../../platform/actions/common/actions.js';
import { LOCAL_HISTORY_MENU_CONTEXT_KEY } from '../browser/localHistory.js';
import { findLocalHistoryEntry, ITimelineCommandArgument } from '../browser/localHistoryCommands.js';
import { isMacintosh, isWindows } from '../../../../base/common/platform.js';
import { INativeHostService } from '../../../../platform/native/common/native.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { Schemas } from '../../../../base/common/network.js';
import { ResourceContextKey } from '../../../common/contextkeys.js';

//#region Delete

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'workbench.action.localHistory.revealInOS',
			title: isWindows ? localize2('revealInWindows', "Reveal in File Explorer") : isMacintosh ? localize2('revealInMac', "Reveal in Finder") : localize2('openContainer', "Open Containing Folder"),
			menu: {
				id: MenuId.TimelineItemContext,
				group: '4_reveal',
				order: 1,
				when: ContextKeyExpr.and(LOCAL_HISTORY_MENU_CONTEXT_KEY, ResourceContextKey.Scheme.isEqualTo(Schemas.file))
			}
		});
	}
	async run(accessor: ServicesAccessor, item: ITimelineCommandArgument): Promise<void> {
		const workingCopyHistoryService = accessor.get(IWorkingCopyHistoryService);
		const nativeHostService = accessor.get(INativeHostService);

		const { entry } = await findLocalHistoryEntry(workingCopyHistoryService, item);
		if (entry) {
			await nativeHostService.showItemInFolder(entry.location.with({ scheme: Schemas.file }).fsPath);
		}
	}
});

//#endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/localization/browser/localization.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/localization/browser/localization.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BaseLocalizationWorkbenchContribution } from '../common/localization.contribution.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { Extensions as WorkbenchExtensions, IWorkbenchContributionsRegistry } from '../../../common/contributions.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';

export class WebLocalizationWorkbenchContribution extends BaseLocalizationWorkbenchContribution { }

const workbenchRegistry = Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench);
workbenchRegistry.registerWorkbenchContribution(WebLocalizationWorkbenchContribution, LifecyclePhase.Eventually);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/localization/common/localization.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/localization/common/localization.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { localize } from '../../../../nls.js';
import { registerAction2 } from '../../../../platform/actions/common/actions.js';
import { IExtensionManifest } from '../../../../platform/extensions/common/extensions.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { ClearDisplayLanguageAction, ConfigureDisplayLanguageAction } from './localizationsActions.js';
import { IExtensionFeatureTableRenderer, IRenderedData, ITableData, IRowData, IExtensionFeaturesRegistry, Extensions } from '../../../services/extensionManagement/common/extensionFeatures.js';
import { ExtensionsRegistry } from '../../../services/extensions/common/extensionsRegistry.js';

export class BaseLocalizationWorkbenchContribution extends Disposable implements IWorkbenchContribution {
	constructor() {
		super();

		// Register action to configure locale and related settings
		registerAction2(ConfigureDisplayLanguageAction);
		registerAction2(ClearDisplayLanguageAction);

		ExtensionsRegistry.registerExtensionPoint({
			extensionPoint: 'localizations',
			defaultExtensionKind: ['ui', 'workspace'],
			jsonSchema: {
				description: localize('vscode.extension.contributes.localizations', "Contributes localizations to the editor"),
				type: 'array',
				default: [],
				items: {
					type: 'object',
					required: ['languageId', 'translations'],
					defaultSnippets: [{ body: { languageId: '', languageName: '', localizedLanguageName: '', translations: [{ id: 'vscode', path: '' }] } }],
					properties: {
						languageId: {
							description: localize('vscode.extension.contributes.localizations.languageId', 'Id of the language into which the display strings are translated.'),
							type: 'string'
						},
						languageName: {
							description: localize('vscode.extension.contributes.localizations.languageName', 'Name of the language in English.'),
							type: 'string'
						},
						localizedLanguageName: {
							description: localize('vscode.extension.contributes.localizations.languageNameLocalized', 'Name of the language in contributed language.'),
							type: 'string'
						},
						translations: {
							description: localize('vscode.extension.contributes.localizations.translations', 'List of translations associated to the language.'),
							type: 'array',
							default: [{ id: 'vscode', path: '' }],
							items: {
								type: 'object',
								required: ['id', 'path'],
								properties: {
									id: {
										type: 'string',
										description: localize('vscode.extension.contributes.localizations.translations.id', "Id of VS Code or Extension for which this translation is contributed to. Id of VS Code is always `vscode` and of extension should be in format `publisherId.extensionName`."),
										pattern: '^((vscode)|([a-z0-9A-Z][a-z0-9A-Z-]*)\\.([a-z0-9A-Z][a-z0-9A-Z-]*))$',
										patternErrorMessage: localize('vscode.extension.contributes.localizations.translations.id.pattern', "Id should be `vscode` or in format `publisherId.extensionName` for translating VS code or an extension respectively.")
									},
									path: {
										type: 'string',
										description: localize('vscode.extension.contributes.localizations.translations.path', "A relative path to a file containing translations for the language.")
									}
								},
								defaultSnippets: [{ body: { id: '', path: '' } }],
							},
						}
					}
				}
			}
		});
	}
}

class LocalizationsDataRenderer extends Disposable implements IExtensionFeatureTableRenderer {

	readonly type = 'table';

	shouldRender(manifest: IExtensionManifest): boolean {
		return !!manifest.contributes?.localizations;
	}

	render(manifest: IExtensionManifest): IRenderedData<ITableData> {
		const localizations = manifest.contributes?.localizations || [];
		if (!localizations.length) {
			return { data: { headers: [], rows: [] }, dispose: () => { } };
		}

		const headers = [
			localize('language id', "Language ID"),
			localize('localizations language name', "Language Name"),
			localize('localizations localized language name', "Language Name (Localized)"),
		];

		const rows: IRowData[][] = localizations
			.sort((a, b) => a.languageId.localeCompare(b.languageId))
			.map(localization => {
				return [
					localization.languageId,
					localization.languageName ?? '',
					localization.localizedLanguageName ?? ''
				];
			});

		return {
			data: {
				headers,
				rows
			},
			dispose: () => { }
		};
	}
}

Registry.as<IExtensionFeaturesRegistry>(Extensions.ExtensionFeaturesRegistry).registerExtensionFeature({
	id: 'localizations',
	label: localize('localizations', "Language Packs"),
	access: {
		canToggle: false
	},
	renderer: new SyncDescriptor(LocalizationsDataRenderer),
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/localization/common/localizationsActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/localization/common/localizationsActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize, localize2 } from '../../../../nls.js';
import { IQuickInputService, IQuickPickSeparator } from '../../../../platform/quickinput/common/quickInput.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { Action2, MenuId } from '../../../../platform/actions/common/actions.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { ILanguagePackItem, ILanguagePackService } from '../../../../platform/languagePacks/common/languagePacks.js';
import { ILocaleService } from '../../../services/localization/common/locale.js';
import { IExtensionsWorkbenchService } from '../../extensions/common/extensions.js';

export class ConfigureDisplayLanguageAction extends Action2 {
	public static readonly ID = 'workbench.action.configureLocale';

	constructor() {
		super({
			id: ConfigureDisplayLanguageAction.ID,
			title: localize2('configureLocale', "Configure Display Language"),
			menu: {
				id: MenuId.CommandPalette
			},
			metadata: {
				description: localize2('configureLocaleDescription', "Changes the locale of VS Code based on installed language packs. Common languages include French, Chinese, Spanish, Japanese, German, Korean, and more.")
			}
		});
	}

	public async run(accessor: ServicesAccessor): Promise<void> {
		const languagePackService: ILanguagePackService = accessor.get(ILanguagePackService);
		const quickInputService: IQuickInputService = accessor.get(IQuickInputService);
		const localeService: ILocaleService = accessor.get(ILocaleService);
		const extensionWorkbenchService: IExtensionsWorkbenchService = accessor.get(IExtensionsWorkbenchService);

		const installedLanguages = await languagePackService.getInstalledLanguages();

		const disposables = new DisposableStore();
		const qp = disposables.add(quickInputService.createQuickPick<ILanguagePackItem>({ useSeparators: true }));
		qp.matchOnDescription = true;
		qp.placeholder = localize('chooseLocale', "Select Display Language");

		if (installedLanguages?.length) {
			const items: Array<ILanguagePackItem | IQuickPickSeparator> = [{ type: 'separator', label: localize('installed', "Installed") }];
			qp.items = items.concat(this.withMoreInfoButton(installedLanguages));
		}

		disposables.add(qp.onDidHide(() => {
			disposables.dispose();
		}));

		const installedSet = new Set<string>(installedLanguages?.map(language => language.id!) ?? []);
		languagePackService.getAvailableLanguages().then(availableLanguages => {
			const newLanguages = availableLanguages.filter(l => l.id && !installedSet.has(l.id));
			if (newLanguages.length) {
				qp.items = [
					...qp.items,
					{ type: 'separator', label: localize('available', "Available") },
					...this.withMoreInfoButton(newLanguages)
				];
			}
			qp.busy = false;
		});

		disposables.add(qp.onDidAccept(async () => {
			const selectedLanguage = qp.activeItems[0] as ILanguagePackItem | undefined;
			if (selectedLanguage) {
				qp.hide();
				await localeService.setLocale(selectedLanguage);
			}
		}));

		disposables.add(qp.onDidTriggerItemButton(async e => {
			qp.hide();
			if (e.item.extensionId) {
				await extensionWorkbenchService.open(e.item.extensionId);
			}
		}));

		qp.show();
		qp.busy = true;
	}

	private withMoreInfoButton(items: ILanguagePackItem[]): ILanguagePackItem[] {
		for (const item of items) {
			if (item.extensionId) {
				item.buttons = [{
					tooltip: localize('moreInfo', "More Info"),
					iconClass: 'codicon-info'
				}];
			}
		}
		return items;
	}
}

export class ClearDisplayLanguageAction extends Action2 {
	public static readonly ID = 'workbench.action.clearLocalePreference';
	public static readonly LABEL = localize2('clearDisplayLanguage', "Clear Display Language Preference");

	constructor() {
		super({
			id: ClearDisplayLanguageAction.ID,
			title: ClearDisplayLanguageAction.LABEL,
			menu: {
				id: MenuId.CommandPalette
			}
		});
	}

	public async run(accessor: ServicesAccessor): Promise<void> {
		const localeService: ILocaleService = accessor.get(ILocaleService);
		await localeService.clearLocalePreference();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/localization/electron-browser/localization.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/localization/electron-browser/localization.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { Extensions as WorkbenchExtensions, IWorkbenchContributionsRegistry } from '../../../common/contributions.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import * as platform from '../../../../base/common/platform.js';
import { IExtensionManagementService, IExtensionGalleryService, InstallOperation, ILocalExtension, InstallExtensionResult, DidUninstallExtensionEvent } from '../../../../platform/extensionManagement/common/extensionManagement.js';
import { INotificationService, NeverShowAgainScope, NotificationPriority } from '../../../../platform/notification/common/notification.js';
import Severity from '../../../../base/common/severity.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IExtensionsWorkbenchService } from '../../extensions/common/extensions.js';
import { minimumTranslatedStrings } from './minimalTranslations.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { ILocaleService } from '../../../services/localization/common/locale.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { BaseLocalizationWorkbenchContribution } from '../common/localization.contribution.js';

class NativeLocalizationWorkbenchContribution extends BaseLocalizationWorkbenchContribution {
	private static LANGUAGEPACK_SUGGESTION_IGNORE_STORAGE_KEY = 'extensionsAssistant/languagePackSuggestionIgnore';

	constructor(
		@INotificationService private readonly notificationService: INotificationService,
		@ILocaleService private readonly localeService: ILocaleService,
		@IProductService private readonly productService: IProductService,
		@IStorageService private readonly storageService: IStorageService,
		@IExtensionManagementService private readonly extensionManagementService: IExtensionManagementService,
		@IExtensionGalleryService private readonly galleryService: IExtensionGalleryService,
		@IExtensionsWorkbenchService private readonly extensionsWorkbenchService: IExtensionsWorkbenchService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
	) {
		super();

		this.checkAndInstall();
		this._register(this.extensionManagementService.onDidInstallExtensions(e => this.onDidInstallExtensions(e)));
		this._register(this.extensionManagementService.onDidUninstallExtension(e => this.onDidUninstallExtension(e)));
	}

	private async onDidInstallExtensions(results: readonly InstallExtensionResult[]): Promise<void> {
		for (const result of results) {
			if (result.operation === InstallOperation.Install && result.local) {
				await this.onDidInstallExtension(result.local, !!result.context?.extensionsSync);
			}
		}

	}

	private async onDidInstallExtension(localExtension: ILocalExtension, fromSettingsSync: boolean): Promise<void> {
		const localization = localExtension.manifest.contributes?.localizations?.[0];
		if (!localization || platform.language === localization.languageId) {
			return;
		}
		const { languageId, languageName } = localization;

		this.notificationService.prompt(
			Severity.Info,
			localize('updateLocale', "Would you like to change {0}'s display language to {1} and restart?", this.productService.nameLong, languageName || languageId),
			[{
				label: localize('changeAndRestart', "Change Language and Restart"),
				run: async () => {
					await this.localeService.setLocale({
						id: languageId,
						label: languageName ?? languageId,
						extensionId: localExtension.identifier.id,
						// If settings sync installs the language pack, then we would have just shown the notification so no
						// need to show the dialog.
					}, true);
				}
			}],
			{
				sticky: true,
				priority: NotificationPriority.URGENT,
				neverShowAgain: { id: 'langugage.update.donotask', isSecondary: true, scope: NeverShowAgainScope.APPLICATION }
			}
		);
	}

	private async onDidUninstallExtension(_event: DidUninstallExtensionEvent): Promise<void> {
		if (!await this.isLocaleInstalled(platform.language)) {
			this.localeService.setLocale({
				id: 'en',
				label: 'English'
			});
		}
	}

	private async checkAndInstall(): Promise<void> {
		const language = platform.language;
		let locale = platform.locale ?? '';
		const languagePackSuggestionIgnoreList: string[] = JSON.parse(
			this.storageService.get(
				NativeLocalizationWorkbenchContribution.LANGUAGEPACK_SUGGESTION_IGNORE_STORAGE_KEY,
				StorageScope.APPLICATION,
				'[]'
			)
		);

		if (!this.galleryService.isEnabled()) {
			return;
		}
		if (!language || !locale || platform.Language.isDefaultVariant()) {
			return;
		}
		if (locale.startsWith(language) || languagePackSuggestionIgnoreList.includes(locale)) {
			return;
		}

		const installed = await this.isLocaleInstalled(locale);
		if (installed) {
			return;
		}

		const fullLocale = locale;
		let tagResult = await this.galleryService.query({ text: `tag:lp-${locale}` }, CancellationToken.None);
		if (tagResult.total === 0) {
			// Trim the locale and try again.
			locale = locale.split('-')[0];
			tagResult = await this.galleryService.query({ text: `tag:lp-${locale}` }, CancellationToken.None);
			if (tagResult.total === 0) {
				return;
			}
		}

		const extensionToInstall = tagResult.total === 1 ? tagResult.firstPage[0] : tagResult.firstPage.find(e => e.publisher === 'MS-CEINTL' && e.name.startsWith('vscode-language-pack'));
		const extensionToFetchTranslationsFrom = extensionToInstall ?? tagResult.firstPage[0];

		if (!extensionToFetchTranslationsFrom.assets.manifest) {
			return;
		}

		const [manifest, translation] = await Promise.all([
			this.galleryService.getManifest(extensionToFetchTranslationsFrom, CancellationToken.None),
			this.galleryService.getCoreTranslation(extensionToFetchTranslationsFrom, locale)
		]);
		const loc = manifest?.contributes?.localizations?.find(x => locale.startsWith(x.languageId.toLowerCase()));
		const languageName = loc ? (loc.languageName || locale) : locale;
		const languageDisplayName = loc ? (loc.localizedLanguageName || loc.languageName || locale) : locale;
		const translationsFromPack: { [key: string]: string } = translation?.contents?.['vs/workbench/contrib/localization/electron-browser/minimalTranslations'] ?? {};
		const promptMessageKey = extensionToInstall ? 'installAndRestartMessage' : 'showLanguagePackExtensions';
		const useEnglish = !translationsFromPack[promptMessageKey];

		const translations: { [key: string]: string } = {};
		Object.keys(minimumTranslatedStrings).forEach(key => {
			if (!translationsFromPack[key] || useEnglish) {
				translations[key] = minimumTranslatedStrings[key].replace('{0}', () => languageName);
			} else {
				translations[key] = `${translationsFromPack[key].replace('{0}', () => languageDisplayName)} (${minimumTranslatedStrings[key].replace('{0}', () => languageName)})`;
			}
		});

		const logUserReaction = (userReaction: string) => {
			/* __GDPR__
				"languagePackSuggestion:popup" : {
					"owner": "TylerLeonhardt",
					"userReaction" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
					"language": { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
				}
			*/
			this.telemetryService.publicLog('languagePackSuggestion:popup', { userReaction, language: locale });
		};

		const searchAction = {
			label: translations['searchMarketplace'],
			run: async () => {
				logUserReaction('search');
				await this.extensionsWorkbenchService.openSearch(`tag:lp-${locale}`);
			}
		};

		const installAndRestartAction = {
			label: translations['installAndRestart'],
			run: async () => {
				logUserReaction('installAndRestart');
				await this.localeService.setLocale({
					id: locale,
					label: languageName,
					extensionId: extensionToInstall?.identifier.id,
					galleryExtension: extensionToInstall
					// The user will be prompted if they want to install the language pack before this.
				}, true);
			}
		};

		const promptMessage = translations[promptMessageKey];

		this.notificationService.prompt(
			Severity.Info,
			promptMessage,
			[extensionToInstall ? installAndRestartAction : searchAction,
			{
				label: localize('neverAgain', "Don't Show Again"),
				isSecondary: true,
				run: () => {
					languagePackSuggestionIgnoreList.push(fullLocale);
					this.storageService.store(
						NativeLocalizationWorkbenchContribution.LANGUAGEPACK_SUGGESTION_IGNORE_STORAGE_KEY,
						JSON.stringify(languagePackSuggestionIgnoreList),
						StorageScope.APPLICATION,
						StorageTarget.USER
					);
					logUserReaction('neverShowAgain');
				}
			}],
			{
				priority: NotificationPriority.OPTIONAL,
				onCancel: () => {
					logUserReaction('cancelled');
				}
			}
		);
	}

	private async isLocaleInstalled(locale: string): Promise<boolean> {
		const installed = await this.extensionManagementService.getInstalled();
		return installed.some(i => !!i.manifest.contributes?.localizations?.length
			&& i.manifest.contributes.localizations.some(l => locale.startsWith(l.languageId.toLowerCase())));
	}
}

const workbenchRegistry = Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench);
workbenchRegistry.registerWorkbenchContribution(NativeLocalizationWorkbenchContribution, LifecyclePhase.Eventually);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/localization/electron-browser/minimalTranslations.ts]---
Location: vscode-main/src/vs/workbench/contrib/localization/electron-browser/minimalTranslations.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';

// The strings localized in this file will get pulled into the manifest of the language packs.
// So that they are available for VS Code to use without downloading the entire language pack.

export const minimumTranslatedStrings: { [key: string]: string } = {
	showLanguagePackExtensions: localize('showLanguagePackExtensions', "Search language packs in the Marketplace to change the display language to {0}."),
	searchMarketplace: localize('searchMarketplace', "Search Marketplace"),
	installAndRestartMessage: localize('installAndRestartMessage', "Install language pack to change the display language to {0}."),
	installAndRestart: localize('installAndRestart', "Install and Restart")
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/logs/browser/logs.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/logs/browser/logs.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Registry } from '../../../../platform/registry/common/platform.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { Action2, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { OpenWindowSessionLogFileAction } from '../common/logsActions.js';
import { IWorkbenchContribution, IWorkbenchContributionsRegistry, Extensions as WorkbenchExtensions } from '../../../common/contributions.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { LogsDataCleaner } from '../common/logsDataCleaner.js';

class WebLogOutputChannels extends Disposable implements IWorkbenchContribution {

	constructor(
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		super();
		this.registerWebContributions();
	}

	private registerWebContributions(): void {
		this.instantiationService.createInstance(LogsDataCleaner);

		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: OpenWindowSessionLogFileAction.ID,
					title: OpenWindowSessionLogFileAction.TITLE,
					category: Categories.Developer,
					f1: true
				});
			}
			run(servicesAccessor: ServicesAccessor): Promise<void> {
				return servicesAccessor.get(IInstantiationService).createInstance(OpenWindowSessionLogFileAction, OpenWindowSessionLogFileAction.ID, OpenWindowSessionLogFileAction.TITLE.value).run();
			}
		}));

	}

}

Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench).registerWorkbenchContribution(WebLogOutputChannels, LifecyclePhase.Restored);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/logs/common/defaultLogLevels.ts]---
Location: vscode-main/src/vs/workbench/contrib/logs/common/defaultLogLevels.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ILogService, ILoggerService, LogLevel, LogLevelToString, getLogLevel, parseLogLevel } from '../../../../platform/log/common/log.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IWorkbenchEnvironmentService } from '../../../services/environment/common/environmentService.js';
import { FileOperationResult, IFileService, toFileOperationResult } from '../../../../platform/files/common/files.js';
import { IJSONEditingService } from '../../../services/configuration/common/jsonEditing.js';
import { isString, isUndefined } from '../../../../base/common/types.js';
import { EXTENSION_IDENTIFIER_WITH_LOG_REGEX } from '../../../../platform/environment/common/environmentService.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { parse } from '../../../../base/common/json.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { Emitter, Event } from '../../../../base/common/event.js';

interface ParsedArgvLogLevels {
	default?: LogLevel;
	extensions?: [string, LogLevel][];
}

export type DefaultLogLevels = Required<Readonly<ParsedArgvLogLevels>>;

export const IDefaultLogLevelsService = createDecorator<IDefaultLogLevelsService>('IDefaultLogLevelsService');

export interface IDefaultLogLevelsService {

	readonly _serviceBrand: undefined;

	/**
	 * An event which fires when default log levels are changed
	 */
	readonly onDidChangeDefaultLogLevels: Event<void>;

	getDefaultLogLevels(): Promise<DefaultLogLevels>;

	getDefaultLogLevel(extensionId?: string): Promise<LogLevel>;

	setDefaultLogLevel(logLevel: LogLevel, extensionId?: string): Promise<void>;
}

class DefaultLogLevelsService extends Disposable implements IDefaultLogLevelsService {

	_serviceBrand: undefined;

	private _onDidChangeDefaultLogLevels = this._register(new Emitter<void>);
	readonly onDidChangeDefaultLogLevels = this._onDidChangeDefaultLogLevels.event;

	constructor(
		@IWorkbenchEnvironmentService private readonly environmentService: IWorkbenchEnvironmentService,
		@IFileService private readonly fileService: IFileService,
		@IJSONEditingService private readonly jsonEditingService: IJSONEditingService,
		@ILogService private readonly logService: ILogService,
		@ILoggerService private readonly loggerService: ILoggerService,
	) {
		super();
	}

	async getDefaultLogLevels(): Promise<DefaultLogLevels> {
		const argvLogLevel = await this._parseLogLevelsFromArgv();
		return {
			default: argvLogLevel?.default ?? this._getDefaultLogLevelFromEnv(),
			extensions: argvLogLevel?.extensions ?? this._getExtensionsDefaultLogLevelsFromEnv()
		};
	}

	async getDefaultLogLevel(extensionId?: string): Promise<LogLevel> {
		const argvLogLevel = await this._parseLogLevelsFromArgv() ?? {};
		if (extensionId) {
			extensionId = extensionId.toLowerCase();
			return this._getDefaultLogLevel(argvLogLevel, extensionId);
		} else {
			return this._getDefaultLogLevel(argvLogLevel);
		}
	}

	async setDefaultLogLevel(defaultLogLevel: LogLevel, extensionId?: string): Promise<void> {
		const argvLogLevel = await this._parseLogLevelsFromArgv() ?? {};
		if (extensionId) {
			extensionId = extensionId.toLowerCase();
			const currentDefaultLogLevel = this._getDefaultLogLevel(argvLogLevel, extensionId);
			argvLogLevel.extensions = argvLogLevel.extensions ?? [];
			const extension = argvLogLevel.extensions.find(([extension]) => extension === extensionId);
			if (extension) {
				extension[1] = defaultLogLevel;
			} else {
				argvLogLevel.extensions.push([extensionId, defaultLogLevel]);
			}
			await this._writeLogLevelsToArgv(argvLogLevel);
			const extensionLoggers = [...this.loggerService.getRegisteredLoggers()].filter(logger => logger.extensionId && logger.extensionId.toLowerCase() === extensionId);
			for (const { resource } of extensionLoggers) {
				if (this.loggerService.getLogLevel(resource) === currentDefaultLogLevel) {
					this.loggerService.setLogLevel(resource, defaultLogLevel);
				}
			}
		} else {
			const currentLogLevel = this._getDefaultLogLevel(argvLogLevel);
			argvLogLevel.default = defaultLogLevel;
			await this._writeLogLevelsToArgv(argvLogLevel);
			if (this.loggerService.getLogLevel() === currentLogLevel) {
				this.loggerService.setLogLevel(defaultLogLevel);
			}
		}
		this._onDidChangeDefaultLogLevels.fire();
	}

	private _getDefaultLogLevel(argvLogLevels: ParsedArgvLogLevels, extension?: string): LogLevel {
		if (extension) {
			const extensionLogLevel = argvLogLevels.extensions?.find(([extensionId]) => extensionId === extension);
			if (extensionLogLevel) {
				return extensionLogLevel[1];
			}
		}
		return argvLogLevels.default ?? getLogLevel(this.environmentService);
	}

	private async _writeLogLevelsToArgv(logLevels: ParsedArgvLogLevels): Promise<void> {
		const logLevelsValue: string[] = [];
		if (!isUndefined(logLevels.default)) {
			logLevelsValue.push(LogLevelToString(logLevels.default));
		}
		for (const [extension, logLevel] of logLevels.extensions ?? []) {
			logLevelsValue.push(`${extension}=${LogLevelToString(logLevel)}`);
		}
		await this.jsonEditingService.write(this.environmentService.argvResource, [{ path: ['log-level'], value: logLevelsValue.length ? logLevelsValue : undefined }], true);
	}

	private async _parseLogLevelsFromArgv(): Promise<ParsedArgvLogLevels | undefined> {
		const result: ParsedArgvLogLevels = { extensions: [] };
		const logLevels = await this._readLogLevelsFromArgv();
		for (const extensionLogLevel of logLevels) {
			const matches = EXTENSION_IDENTIFIER_WITH_LOG_REGEX.exec(extensionLogLevel);
			if (matches && matches[1] && matches[2]) {
				const logLevel = parseLogLevel(matches[2]);
				if (!isUndefined(logLevel)) {
					result.extensions?.push([matches[1].toLowerCase(), logLevel]);
				}
			} else {
				const logLevel = parseLogLevel(extensionLogLevel);
				if (!isUndefined(logLevel)) {
					result.default = logLevel;
				}
			}
		}
		return !isUndefined(result.default) || result.extensions?.length ? result : undefined;
	}

	private async _readLogLevelsFromArgv(): Promise<string[]> {
		try {
			const content = await this.fileService.readFile(this.environmentService.argvResource);
			const argv: { 'log-level'?: string | string[] } = parse(content.value.toString());
			return isString(argv['log-level']) ? [argv['log-level']] : Array.isArray(argv['log-level']) ? argv['log-level'] : [];
		} catch (error) {
			if (toFileOperationResult(error) !== FileOperationResult.FILE_NOT_FOUND) {
				this.logService.error(error);
			}
		}
		return [];
	}

	private _getDefaultLogLevelFromEnv(): LogLevel {
		return getLogLevel(this.environmentService);
	}

	private _getExtensionsDefaultLogLevelsFromEnv(): [string, LogLevel][] {
		const result: [string, LogLevel][] = [];
		for (const [extension, logLevelValue] of this.environmentService.extensionLogLevel ?? []) {
			const logLevel = parseLogLevel(logLevelValue);
			if (!isUndefined(logLevel)) {
				result.push([extension, logLevel]);
			}
		}
		return result;
	}
}

registerSingleton(IDefaultLogLevelsService, DefaultLogLevelsService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/logs/common/logs.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/logs/common/logs.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { Action2, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { SetLogLevelAction } from './logsActions.js';
import { IWorkbenchContribution, IWorkbenchContributionsRegistry, Extensions as WorkbenchExtensions } from '../../../common/contributions.js';
import { IOutputChannelRegistry, IOutputService, Extensions, isMultiSourceOutputChannelDescriptor, isSingleSourceOutputChannelDescriptor } from '../../../services/output/common/output.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { CONTEXT_LOG_LEVEL, ILoggerResource, ILoggerService, LogLevel, LogLevelToString, isLogLevel } from '../../../../platform/log/common/log.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { Event } from '../../../../base/common/event.js';
import { windowLogId, showWindowLogActionId } from '../../../services/log/common/logConstants.js';
import { IDefaultLogLevelsService } from './defaultLogLevels.js';
import { ContextKeyExpr, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { CounterSet } from '../../../../base/common/map.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { Schemas } from '../../../../base/common/network.js';

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: SetLogLevelAction.ID,
			title: SetLogLevelAction.TITLE,
			category: Categories.Developer,
			f1: true
		});
	}
	run(servicesAccessor: ServicesAccessor): Promise<void> {
		const action = servicesAccessor.get(IInstantiationService).createInstance(SetLogLevelAction, SetLogLevelAction.ID, SetLogLevelAction.TITLE.value);
		return action.run().finally(() => action.dispose());
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'workbench.action.setDefaultLogLevel',
			title: nls.localize2('setDefaultLogLevel', "Set Default Log Level"),
			category: Categories.Developer,
		});
	}
	run(servicesAccessor: ServicesAccessor, logLevel: LogLevel, extensionId?: string): Promise<void> {
		return servicesAccessor.get(IDefaultLogLevelsService).setDefaultLogLevel(logLevel, extensionId);
	}
});

class LogOutputChannels extends Disposable implements IWorkbenchContribution {

	private readonly contextKeys = new CounterSet<string>();
	private readonly outputChannelRegistry = Registry.as<IOutputChannelRegistry>(Extensions.OutputChannels);

	constructor(
		@ILoggerService private readonly loggerService: ILoggerService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
	) {
		super();
		const contextKey = CONTEXT_LOG_LEVEL.bindTo(contextKeyService);
		contextKey.set(LogLevelToString(loggerService.getLogLevel()));
		this._register(loggerService.onDidChangeLogLevel(e => {
			if (isLogLevel(e)) {
				contextKey.set(LogLevelToString(loggerService.getLogLevel()));
			}
		}));

		this.onDidAddLoggers(loggerService.getRegisteredLoggers());
		this._register(loggerService.onDidChangeLoggers(({ added, removed }) => {
			this.onDidAddLoggers(added);
			this.onDidRemoveLoggers(removed);
		}));
		this._register(loggerService.onDidChangeVisibility(([resource, visibility]) => {
			const logger = loggerService.getRegisteredLogger(resource);
			if (logger) {
				if (visibility) {
					this.registerLogChannel(logger);
				} else {
					this.deregisterLogChannel(logger);
				}
			}
		}));
		this.registerShowWindowLogAction();
		this._register(Event.filter(contextKeyService.onDidChangeContext, e => e.affectsSome(this.contextKeys))(() => this.onDidChangeContext()));
	}

	private onDidAddLoggers(loggers: Iterable<ILoggerResource>): void {
		for (const logger of loggers) {
			if (logger.when) {
				const contextKeyExpr = ContextKeyExpr.deserialize(logger.when);
				if (contextKeyExpr) {
					for (const key of contextKeyExpr.keys()) {
						this.contextKeys.add(key);
					}
					if (!this.contextKeyService.contextMatchesRules(contextKeyExpr)) {
						continue;
					}
				}
			}
			if (logger.hidden) {
				continue;
			}
			this.registerLogChannel(logger);
		}
	}

	private onDidChangeContext(): void {
		for (const logger of this.loggerService.getRegisteredLoggers()) {
			if (logger.when) {
				if (this.contextKeyService.contextMatchesRules(ContextKeyExpr.deserialize(logger.when))) {
					this.registerLogChannel(logger);
				} else {
					this.deregisterLogChannel(logger);
				}
			}
		}
	}

	private onDidRemoveLoggers(loggers: Iterable<ILoggerResource>): void {
		for (const logger of loggers) {
			if (logger.when) {
				const contextKeyExpr = ContextKeyExpr.deserialize(logger.when);
				if (contextKeyExpr) {
					for (const key of contextKeyExpr.keys()) {
						this.contextKeys.delete(key);
					}
				}
			}
			this.deregisterLogChannel(logger);
		}
	}

	private registerLogChannel(logger: ILoggerResource): void {
		if (logger.group) {
			this.registerCompoundLogChannel(logger.group.id, logger.group.name, logger);
			return;
		}

		const channel = this.outputChannelRegistry.getChannel(logger.id);
		if (channel && isSingleSourceOutputChannelDescriptor(channel) && this.uriIdentityService.extUri.isEqual(channel.source.resource, logger.resource)) {
			return;
		}

		const existingChannel = this.outputChannelRegistry.getChannel(logger.id);
		const remoteLogger = existingChannel && isSingleSourceOutputChannelDescriptor(existingChannel) && existingChannel.source.resource.scheme === Schemas.vscodeRemote ? this.loggerService.getRegisteredLogger(existingChannel.source.resource) : undefined;
		if (remoteLogger) {
			this.deregisterLogChannel(remoteLogger);
		}
		const hasToAppendRemote = existingChannel && logger.resource.scheme === Schemas.vscodeRemote;
		const id = hasToAppendRemote ? `${logger.id}.remote` : logger.id;
		const label = hasToAppendRemote ? nls.localize('remote name', "{0} (Remote)", logger.name ?? logger.id) : logger.name ?? logger.id;
		this.outputChannelRegistry.registerChannel({ id, label, source: { resource: logger.resource }, log: true, extensionId: logger.extensionId });
	}

	private registerCompoundLogChannel(id: string, name: string, logger: ILoggerResource): void {
		const channel = this.outputChannelRegistry.getChannel(id);
		const source = { resource: logger.resource, name: logger.name ?? logger.id };
		if (channel) {
			if (isMultiSourceOutputChannelDescriptor(channel) && !channel.source.some(({ resource }) => this.uriIdentityService.extUri.isEqual(resource, logger.resource))) {
				this.outputChannelRegistry.updateChannelSources(id, [...channel.source, source]);
			}
		} else {
			this.outputChannelRegistry.registerChannel({ id, label: name, log: true, source: [source] });
		}
	}

	private deregisterLogChannel(logger: ILoggerResource): void {
		if (logger.group) {
			const channel = this.outputChannelRegistry.getChannel(logger.group.id);
			if (channel && isMultiSourceOutputChannelDescriptor(channel)) {
				this.outputChannelRegistry.updateChannelSources(logger.group.id, channel.source.filter(({ resource }) => !this.uriIdentityService.extUri.isEqual(resource, logger.resource)));
			}
		} else {
			this.outputChannelRegistry.removeChannel(logger.id);
		}
	}

	private registerShowWindowLogAction(): void {
		this._register(registerAction2(class ShowWindowLogAction extends Action2 {
			constructor() {
				super({
					id: showWindowLogActionId,
					title: nls.localize2('show window log', "Show Window Log"),
					category: Categories.Developer,
					f1: true
				});
			}
			async run(servicesAccessor: ServicesAccessor): Promise<void> {
				const outputService = servicesAccessor.get(IOutputService);
				outputService.showChannel(windowLogId);
			}
		}));
	}
}

Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench).registerWorkbenchContribution(LogOutputChannels, LifecyclePhase.Restored);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/logs/common/logsActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/logs/common/logsActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { Action } from '../../../../base/common/actions.js';
import { ILoggerService, LogLevel, LogLevelToLocalizedString, isLogLevel } from '../../../../platform/log/common/log.js';
import { IQuickInputButton, IQuickInputService, IQuickPickItem, IQuickPickSeparator } from '../../../../platform/quickinput/common/quickInput.js';
import { URI } from '../../../../base/common/uri.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IWorkbenchEnvironmentService } from '../../../services/environment/common/environmentService.js';
import { dirname, basename, isEqual } from '../../../../base/common/resources.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IOutputChannelDescriptor, IOutputService, isMultiSourceOutputChannelDescriptor, isSingleSourceOutputChannelDescriptor } from '../../../services/output/common/output.js';
import { IDefaultLogLevelsService } from './defaultLogLevels.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';

type LogLevelQuickPickItem = IQuickPickItem & { level: LogLevel };
type LogChannelQuickPickItem = IQuickPickItem & { id: string; channel: IOutputChannelDescriptor };

export class SetLogLevelAction extends Action {

	static readonly ID = 'workbench.action.setLogLevel';
	static readonly TITLE = nls.localize2('setLogLevel', "Set Log Level...");

	constructor(id: string, label: string,
		@IQuickInputService private readonly quickInputService: IQuickInputService,
		@ILoggerService private readonly loggerService: ILoggerService,
		@IOutputService private readonly outputService: IOutputService,
		@IDefaultLogLevelsService private readonly defaultLogLevelsService: IDefaultLogLevelsService,
	) {
		super(id, label);
	}

	override async run(): Promise<void> {
		const logLevelOrChannel = await this.selectLogLevelOrChannel();
		if (logLevelOrChannel !== null) {
			if (isLogLevel(logLevelOrChannel)) {
				this.loggerService.setLogLevel(logLevelOrChannel);
			} else {
				await this.setLogLevelForChannel(logLevelOrChannel);
			}
		}
	}

	private async selectLogLevelOrChannel(): Promise<LogChannelQuickPickItem | LogLevel | null> {
		const defaultLogLevels = await this.defaultLogLevelsService.getDefaultLogLevels();
		const extensionLogs: LogChannelQuickPickItem[] = [], logs: LogChannelQuickPickItem[] = [];
		const logLevel = this.loggerService.getLogLevel();
		for (const channel of this.outputService.getChannelDescriptors()) {
			if (!this.outputService.canSetLogLevel(channel)) {
				continue;
			}
			const sources = isSingleSourceOutputChannelDescriptor(channel) ? [channel.source] : isMultiSourceOutputChannelDescriptor(channel) ? channel.source : [];
			if (!sources.length) {
				continue;
			}
			const channelLogLevel = sources.reduce((prev, curr) => Math.min(prev, this.loggerService.getLogLevel(curr.resource) ?? logLevel), logLevel);
			const item: LogChannelQuickPickItem = {
				id: channel.id,
				label: channel.label,
				description: channelLogLevel !== logLevel ? this.getLabel(channelLogLevel) : undefined,
				channel
			};
			if (channel.extensionId) {
				extensionLogs.push(item);
			} else {
				logs.push(item);
			}
		}
		const entries: (LogLevelQuickPickItem | LogChannelQuickPickItem | IQuickPickSeparator)[] = [];
		entries.push({ type: 'separator', label: nls.localize('all', "All") });
		entries.push(...this.getLogLevelEntries(defaultLogLevels.default, this.loggerService.getLogLevel(), true));
		if (extensionLogs.length) {
			entries.push({ type: 'separator', label: nls.localize('extensionLogs', "Extension Logs") });
			entries.push(...extensionLogs.sort((a, b) => a.label.localeCompare(b.label)));
		}
		entries.push({ type: 'separator', label: nls.localize('loggers', "Logs") });
		entries.push(...logs.sort((a, b) => a.label.localeCompare(b.label)));

		return new Promise((resolve, reject) => {
			const disposables = new DisposableStore();
			const quickPick = disposables.add(this.quickInputService.createQuickPick({ useSeparators: true }));
			quickPick.placeholder = nls.localize('selectlog', "Set Log Level");
			quickPick.items = entries;
			let selectedItem: IQuickPickItem | undefined;
			disposables.add(quickPick.onDidTriggerItemButton(e => {
				quickPick.hide();
				this.defaultLogLevelsService.setDefaultLogLevel((<LogLevelQuickPickItem>e.item).level);
			}));
			disposables.add(quickPick.onDidAccept(e => {
				selectedItem = quickPick.selectedItems[0];
				quickPick.hide();
			}));
			disposables.add(quickPick.onDidHide(() => {
				const result = selectedItem ? (<LogLevelQuickPickItem>selectedItem).level ?? <LogChannelQuickPickItem>selectedItem : null;
				disposables.dispose();
				resolve(result);
			}));
			quickPick.show();
		});
	}

	private async setLogLevelForChannel(logChannel: LogChannelQuickPickItem): Promise<void> {
		const defaultLogLevels = await this.defaultLogLevelsService.getDefaultLogLevels();
		const defaultLogLevel = defaultLogLevels.extensions.find(e => e[0] === logChannel.channel.extensionId?.toLowerCase())?.[1] ?? defaultLogLevels.default;
		const entries = this.getLogLevelEntries(defaultLogLevel, this.outputService.getLogLevel(logChannel.channel) ?? defaultLogLevel, !!logChannel.channel.extensionId);

		return new Promise((resolve, reject) => {
			const disposables = new DisposableStore();
			const quickPick = disposables.add(this.quickInputService.createQuickPick());
			quickPick.placeholder = logChannel ? nls.localize('selectLogLevelFor', " {0}: Select log level", logChannel?.label) : nls.localize('selectLogLevel', "Select log level");
			quickPick.items = entries;
			quickPick.activeItems = entries.filter((entry) => entry.level === this.loggerService.getLogLevel());
			let selectedItem: LogLevelQuickPickItem | undefined;
			disposables.add(quickPick.onDidTriggerItemButton(e => {
				quickPick.hide();
				this.defaultLogLevelsService.setDefaultLogLevel((<LogLevelQuickPickItem>e.item).level, logChannel.channel.extensionId);
			}));
			disposables.add(quickPick.onDidAccept(e => {
				selectedItem = quickPick.selectedItems[0] as LogLevelQuickPickItem;
				quickPick.hide();
			}));
			disposables.add(quickPick.onDidHide(() => {
				if (selectedItem) {
					this.outputService.setLogLevel(logChannel.channel, selectedItem.level);
				}
				disposables.dispose();
				resolve();
			}));
			quickPick.show();
		});
	}

	private getLogLevelEntries(defaultLogLevel: LogLevel, currentLogLevel: LogLevel, canSetDefaultLogLevel: boolean): LogLevelQuickPickItem[] {
		const button: IQuickInputButton | undefined = canSetDefaultLogLevel ? { iconClass: ThemeIcon.asClassName(Codicon.checkAll), tooltip: nls.localize('resetLogLevel', "Set as Default Log Level") } : undefined;
		return [
			{ label: this.getLabel(LogLevel.Trace, currentLogLevel), level: LogLevel.Trace, description: this.getDescription(LogLevel.Trace, defaultLogLevel), buttons: button && defaultLogLevel !== LogLevel.Trace ? [button] : undefined },
			{ label: this.getLabel(LogLevel.Debug, currentLogLevel), level: LogLevel.Debug, description: this.getDescription(LogLevel.Debug, defaultLogLevel), buttons: button && defaultLogLevel !== LogLevel.Debug ? [button] : undefined },
			{ label: this.getLabel(LogLevel.Info, currentLogLevel), level: LogLevel.Info, description: this.getDescription(LogLevel.Info, defaultLogLevel), buttons: button && defaultLogLevel !== LogLevel.Info ? [button] : undefined },
			{ label: this.getLabel(LogLevel.Warning, currentLogLevel), level: LogLevel.Warning, description: this.getDescription(LogLevel.Warning, defaultLogLevel), buttons: button && defaultLogLevel !== LogLevel.Warning ? [button] : undefined },
			{ label: this.getLabel(LogLevel.Error, currentLogLevel), level: LogLevel.Error, description: this.getDescription(LogLevel.Error, defaultLogLevel), buttons: button && defaultLogLevel !== LogLevel.Error ? [button] : undefined },
			{ label: this.getLabel(LogLevel.Off, currentLogLevel), level: LogLevel.Off, description: this.getDescription(LogLevel.Off, defaultLogLevel), buttons: button && defaultLogLevel !== LogLevel.Off ? [button] : undefined },
		];
	}

	private getLabel(level: LogLevel, current?: LogLevel): string {
		const label = LogLevelToLocalizedString(level).value;
		return level === current ? `$(check) ${label}` : label;
	}

	private getDescription(level: LogLevel, defaultLogLevel: LogLevel): string | undefined {
		return defaultLogLevel === level ? nls.localize('default', "Default") : undefined;
	}

}

export class OpenWindowSessionLogFileAction extends Action {

	static readonly ID = 'workbench.action.openSessionLogFile';
	static readonly TITLE = nls.localize2('openSessionLogFile', "Open Window Log File (Session)...");

	constructor(id: string, label: string,
		@IWorkbenchEnvironmentService private readonly environmentService: IWorkbenchEnvironmentService,
		@IFileService private readonly fileService: IFileService,
		@IQuickInputService private readonly quickInputService: IQuickInputService,
		@IEditorService private readonly editorService: IEditorService,
	) {
		super(id, label);
	}

	override async run(): Promise<void> {
		const sessionResult = await this.quickInputService.pick(
			this.getSessions().then(sessions => sessions.map((s, index): IQuickPickItem => ({
				id: s.toString(),
				label: basename(s),
				description: index === 0 ? nls.localize('current', "Current") : undefined
			}))),
			{
				canPickMany: false,
				placeHolder: nls.localize('sessions placeholder', "Select Session")
			});
		if (sessionResult) {
			const logFileResult = await this.quickInputService.pick(
				this.getLogFiles(URI.parse(sessionResult.id!)).then(logFiles => logFiles.map((s): IQuickPickItem => ({
					id: s.toString(),
					label: basename(s)
				}))),
				{
					canPickMany: false,
					placeHolder: nls.localize('log placeholder', "Select Log file")
				});
			if (logFileResult) {
				return this.editorService.openEditor({ resource: URI.parse(logFileResult.id!), options: { pinned: true } }).then(() => undefined);
			}
		}
	}

	private async getSessions(): Promise<URI[]> {
		const logsPath = this.environmentService.logsHome.with({ scheme: this.environmentService.logFile.scheme });
		const result: URI[] = [logsPath];
		const stat = await this.fileService.resolve(dirname(logsPath));
		if (stat.children) {
			result.push(...stat.children
				.filter(stat => !isEqual(stat.resource, logsPath) && stat.isDirectory && /^\d{8}T\d{6}$/.test(stat.name))
				.sort()
				.reverse()
				.map(d => d.resource));
		}
		return result;
	}

	private async getLogFiles(session: URI): Promise<URI[]> {
		const stat = await this.fileService.resolve(session);
		if (stat.children) {
			return stat.children.filter(stat => !stat.isDirectory).map(stat => stat.resource);
		}
		return [];
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/logs/common/logsDataCleaner.ts]---
Location: vscode-main/src/vs/workbench/contrib/logs/common/logsDataCleaner.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { basename, dirname } from '../../../../base/common/resources.js';
import { IWorkbenchEnvironmentService } from '../../../services/environment/common/environmentService.js';
import { ILifecycleService } from '../../../services/lifecycle/common/lifecycle.js';
import { Promises } from '../../../../base/common/async.js';

export class LogsDataCleaner extends Disposable {

	constructor(
		@IWorkbenchEnvironmentService private readonly environmentService: IWorkbenchEnvironmentService,
		@IFileService private readonly fileService: IFileService,
		@ILifecycleService private readonly lifecycleService: ILifecycleService,
	) {
		super();
		this.cleanUpOldLogsSoon();
	}

	private cleanUpOldLogsSoon(): void {
		let handle: Timeout | undefined = setTimeout(async () => {
			handle = undefined;
			const stat = await this.fileService.resolve(dirname(this.environmentService.logsHome));
			if (stat.children) {
				const currentLog = basename(this.environmentService.logsHome);
				const allSessions = stat.children.filter(stat => stat.isDirectory && /^\d{8}T\d{6}$/.test(stat.name));
				const oldSessions = allSessions.sort().filter((d, i) => d.name !== currentLog);
				const toDelete = oldSessions.slice(0, Math.max(0, oldSessions.length - 49));
				Promises.settled(toDelete.map(stat => this.fileService.del(stat.resource, { recursive: true })));
			}
		}, 10 * 1000);
		this.lifecycleService.onWillShutdown(() => {
			if (handle) {
				clearTimeout(handle);
				handle = undefined;
			}
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/logs/electron-browser/logs.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/logs/electron-browser/logs.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { Action2, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { OpenLogsFolderAction, OpenExtensionLogsFolderAction } from './logsActions.js';
import { ServicesAccessor } from '../../../../editor/browser/editorExtensions.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: OpenLogsFolderAction.ID,
			title: OpenLogsFolderAction.TITLE,
			category: Categories.Developer,
			f1: true
		});
	}
	run(servicesAccessor: ServicesAccessor): Promise<void> {
		return servicesAccessor.get(IInstantiationService).createInstance(OpenLogsFolderAction, OpenLogsFolderAction.ID, OpenLogsFolderAction.TITLE.value).run();
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: OpenExtensionLogsFolderAction.ID,
			title: OpenExtensionLogsFolderAction.TITLE,
			category: Categories.Developer,
			f1: true
		});
	}
	run(servicesAccessor: ServicesAccessor): Promise<void> {
		return servicesAccessor.get(IInstantiationService).createInstance(OpenExtensionLogsFolderAction, OpenExtensionLogsFolderAction.ID, OpenExtensionLogsFolderAction.TITLE.value).run();
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/logs/electron-browser/logsActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/logs/electron-browser/logsActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Action } from '../../../../base/common/actions.js';
import * as nls from '../../../../nls.js';
import { INativeHostService } from '../../../../platform/native/common/native.js';
import { INativeWorkbenchEnvironmentService } from '../../../services/environment/electron-browser/environmentService.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { joinPath } from '../../../../base/common/resources.js';
import { Schemas } from '../../../../base/common/network.js';

export class OpenLogsFolderAction extends Action {

	static readonly ID = 'workbench.action.openLogsFolder';
	static readonly TITLE = nls.localize2('openLogsFolder', "Open Logs Folder");

	constructor(id: string, label: string,
		@INativeWorkbenchEnvironmentService private readonly environmentService: INativeWorkbenchEnvironmentService,
		@INativeHostService private readonly nativeHostService: INativeHostService,
	) {
		super(id, label);
	}

	override run(): Promise<void> {
		return this.nativeHostService.showItemInFolder(joinPath(this.environmentService.logsHome, 'main.log').with({ scheme: Schemas.file }).fsPath);
	}
}

export class OpenExtensionLogsFolderAction extends Action {

	static readonly ID = 'workbench.action.openExtensionLogsFolder';
	static readonly TITLE = nls.localize2('openExtensionLogsFolder', "Open Extension Logs Folder");

	constructor(id: string, label: string,
		@INativeWorkbenchEnvironmentService private readonly environmentSerice: INativeWorkbenchEnvironmentService,
		@IFileService private readonly fileService: IFileService,
		@INativeHostService private readonly nativeHostService: INativeHostService
	) {
		super(id, label);
	}

	override async run(): Promise<void> {
		const folderStat = await this.fileService.resolve(this.environmentSerice.extHostLogsPath);
		if (folderStat.children && folderStat.children[0]) {
			return this.nativeHostService.showItemInFolder(folderStat.children[0].resource.with({ scheme: Schemas.file }).fsPath);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/markdown/browser/markdown.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/markdown/browser/markdown.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import '../common/markdownColors.js';
import './media/markdown.css';
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/markdown/browser/markdownDocumentRenderer.ts]---
Location: vscode-main/src/vs/workbench/contrib/markdown/browser/markdownDocumentRenderer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { sanitizeHtml } from '../../../../base/browser/domSanitize.js';
import { allowedMarkdownHtmlAttributes, allowedMarkdownHtmlTags } from '../../../../base/browser/markdownRenderer.js';
import { raceCancellationError } from '../../../../base/common/async.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import * as marked from '../../../../base/common/marked/marked.js';
import { Schemas } from '../../../../base/common/network.js';
import { escape } from '../../../../base/common/strings.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { tokenizeToString } from '../../../../editor/common/languages/textToHtmlTokenizer.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { markedGfmHeadingIdPlugin } from './markedGfmHeadingIdPlugin.js';

export const DEFAULT_MARKDOWN_STYLES = `
body {
	padding: 10px 20px;
	line-height: 22px;
	max-width: 882px;
	margin: 0 auto;
}

body *:last-child {
	margin-bottom: 0;
}

img {
	max-width: 100%;
	max-height: 100%;
}

a {
	text-decoration: var(--text-link-decoration);
}

a:hover {
	text-decoration: underline;
}

a:focus,
input:focus,
select:focus,
textarea:focus {
	outline: 1px solid -webkit-focus-ring-color;
	outline-offset: -1px;
}

hr {
	border: 0;
	height: 2px;
	border-bottom: 2px solid;
}

h1 {
	padding-bottom: 0.3em;
	line-height: 1.2;
	border-bottom-width: 1px;
	border-bottom-style: solid;
}

h1, h2, h3 {
	font-weight: normal;
}

table {
	border-collapse: collapse;
}

th {
	text-align: left;
	border-bottom: 1px solid;
}

th,
td {
	padding: 5px 10px;
}

table > tbody > tr + tr > td {
	border-top-width: 1px;
	border-top-style: solid;
}

blockquote {
	margin: 0 7px 0 5px;
	padding: 0 16px 0 10px;
	border-left-width: 5px;
	border-left-style: solid;
}

code {
	font-family: "SF Mono", Monaco, Menlo, Consolas, "Ubuntu Mono", "Liberation Mono", "DejaVu Sans Mono", "Courier New", monospace;
}

pre {
	padding: 16px;
	border-radius: 3px;
	overflow: auto;
}

pre code {
	font-family: var(--vscode-editor-font-family);
	font-weight: var(--vscode-editor-font-weight);
	font-size: var(--vscode-editor-font-size);
	line-height: 1.5;
	color: var(--vscode-editor-foreground);
	tab-size: 4;
}

.monaco-tokenized-source {
	white-space: pre;
}

/** Theming */

.pre {
	background-color: var(--vscode-textCodeBlock-background);
}

.vscode-high-contrast h1 {
	border-color: rgb(0, 0, 0);
}

.vscode-light th {
	border-color: rgba(0, 0, 0, 0.69);
}

.vscode-dark th {
	border-color: rgba(255, 255, 255, 0.69);
}

.vscode-light h1,
.vscode-light hr,
.vscode-light td {
	border-color: rgba(0, 0, 0, 0.18);
}

.vscode-dark h1,
.vscode-dark hr,
.vscode-dark td {
	border-color: rgba(255, 255, 255, 0.18);
}

@media (forced-colors: active) and (prefers-color-scheme: light){
	body {
		forced-color-adjust: none;
	}
}

@media (forced-colors: active) and (prefers-color-scheme: dark){
	body {
		forced-color-adjust: none;
	}
}
`;

const defaultAllowedLinkProtocols = Object.freeze([
	Schemas.http,
	Schemas.https,
]);

function sanitize(documentContent: string, sanitizerConfig: MarkdownDocumentSanitizerConfig | undefined): TrustedHTML {
	return sanitizeHtml(documentContent, {
		allowedLinkProtocols: {
			override: sanitizerConfig?.allowedLinkProtocols?.override ?? defaultAllowedLinkProtocols,
		},
		allowRelativeLinkPaths: sanitizerConfig?.allowRelativeLinkPaths,
		allowedMediaProtocols: sanitizerConfig?.allowedMediaProtocols,
		allowRelativeMediaPaths: sanitizerConfig?.allowRelativeMediaPaths,
		allowedTags: {
			override: allowedMarkdownHtmlTags,
			augment: sanitizerConfig?.allowedTags?.augment
		},
		allowedAttributes: {
			override: [
				...allowedMarkdownHtmlAttributes,
				'name',
				'id',
				'class',
				'role',
				'tabindex',
				'placeholder',
			],
			augment: sanitizerConfig?.allowedAttributes?.augment ?? [],
		}
	});
}

interface MarkdownDocumentSanitizerConfig {
	readonly allowedLinkProtocols?: {
		readonly override: readonly string[] | '*';
	};
	readonly allowRelativeLinkPaths?: boolean;

	readonly allowedMediaProtocols?: {
		readonly override: readonly string[] | '*';
	};
	readonly allowRelativeMediaPaths?: boolean;

	readonly allowedTags?: {
		readonly augment: readonly string[];
	};

	readonly allowedAttributes?: {
		readonly augment: readonly string[];
	};
}

interface IRenderMarkdownDocumentOptions {
	readonly sanitizerConfig?: MarkdownDocumentSanitizerConfig;
	readonly markedExtensions?: readonly marked.MarkedExtension[];
}

/**
 * Renders a string of markdown for use in an external document context.
 *
 * Uses VS Code's syntax highlighting code blocks. Also does not attach all the hooks and customization that normal
 * markdown renderer.
 */
export async function renderMarkdownDocument(
	text: string,
	extensionService: IExtensionService,
	languageService: ILanguageService,
	options?: IRenderMarkdownDocumentOptions,
	token: CancellationToken = CancellationToken.None,
): Promise<TrustedHTML> {
	const m = new marked.Marked(
		MarkedHighlight.markedHighlight({
			async: true,
			async highlight(code: string, lang: string): Promise<string> {
				if (typeof lang !== 'string') {
					return escape(code);
				}

				await extensionService.whenInstalledExtensionsRegistered();
				if (token?.isCancellationRequested) {
					return '';
				}

				const languageId = languageService.getLanguageIdByLanguageName(lang) ?? languageService.getLanguageIdByLanguageName(lang.split(/\s+|:|,|(?!^)\{|\?]/, 1)[0]);
				return tokenizeToString(languageService, code, languageId);
			}
		}),
		markedGfmHeadingIdPlugin(),
		...(options?.markedExtensions ?? []),
	);

	const raw = await raceCancellationError(m.parse(text, { async: true }), token ?? CancellationToken.None);
	return sanitize(raw, options?.sanitizerConfig);
}

namespace MarkedHighlight {
	// Copied from https://github.com/markedjs/marked-highlight/blob/main/src/index.js

	export function markedHighlight(options: marked.MarkedOptions & { highlight: (code: string, lang: string) => string | Promise<string> }): marked.MarkedExtension {
		if (typeof options === 'function') {
			options = {
				highlight: options,
			};
		}

		if (!options || typeof options.highlight !== 'function') {
			throw new Error('Must provide highlight function');
		}

		return {
			async: !!options.async,
			walkTokens(token: marked.Token): Promise<void> | void {
				if (token.type !== 'code') {
					return;
				}

				if (options.async) {
					return Promise.resolve(options.highlight(token.text, token.lang)).then(updateToken(token));
				}

				const code = options.highlight(token.text, token.lang);
				if (code instanceof Promise) {
					throw new Error('markedHighlight is not set to async but the highlight function is async. Set the async option to true on markedHighlight to await the async highlight function.');
				}
				updateToken(token)(code);
			},
			renderer: {
				code({ text, lang, escaped }: marked.Tokens.Code) {
					const classAttr = lang
						? ` class="language-${escape(lang)}"`
						: '';
					text = text.replace(/\n$/, '');
					return `<pre><code${classAttr}>${escaped ? text : escape(text, true)}\n</code></pre>`;
				},
			},
		};
	}

	function updateToken(token: any) {
		return (code: string) => {
			if (typeof code === 'string' && code !== token.text) {
				token.escaped = true;
				token.text = code;
			}
		};
	}

	// copied from marked helpers
	const escapeTest = /[&<>"']/;
	const escapeReplace = new RegExp(escapeTest.source, 'g');
	const escapeTestNoEncode = /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/;
	const escapeReplaceNoEncode = new RegExp(escapeTestNoEncode.source, 'g');
	const escapeReplacement: Record<string, string> = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		[`'`]: '&#39;',
	};
	const getEscapeReplacement = (ch: string) => escapeReplacement[ch];
	function escape(html: string, encode?: boolean) {
		if (encode) {
			if (escapeTest.test(html)) {
				return html.replace(escapeReplace, getEscapeReplacement);
			}
		} else {
			if (escapeTestNoEncode.test(html)) {
				return html.replace(escapeReplaceNoEncode, getEscapeReplacement);
			}
		}

		return html;
	}
}
```

--------------------------------------------------------------------------------

````
