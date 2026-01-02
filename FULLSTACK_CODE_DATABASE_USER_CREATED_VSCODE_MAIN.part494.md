---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 494
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 494 of 552)

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

---[FILE: src/vs/workbench/electron-browser/desktop.contribution.ts]---
Location: vscode-main/src/vs/workbench/electron-browser/desktop.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Registry } from '../../platform/registry/common/platform.js';
import { localize, localize2 } from '../../nls.js';
import { MenuRegistry, MenuId, registerAction2 } from '../../platform/actions/common/actions.js';
import { IConfigurationRegistry, Extensions as ConfigurationExtensions, ConfigurationScope } from '../../platform/configuration/common/configurationRegistry.js';
import { KeyMod, KeyCode } from '../../base/common/keyCodes.js';
import { isLinux, isMacintosh, isWindows } from '../../base/common/platform.js';
import { ConfigureRuntimeArgumentsAction, ToggleDevToolsAction, ReloadWindowWithExtensionsDisabledAction, OpenUserDataFolderAction, ShowGPUInfoAction, ShowContentTracingAction, StopTracing } from './actions/developerActions.js';
import { ZoomResetAction, ZoomOutAction, ZoomInAction, CloseWindowAction, SwitchWindowAction, QuickSwitchWindowAction, NewWindowTabHandler, ShowPreviousWindowTabHandler, ShowNextWindowTabHandler, MoveWindowTabToNewWindowHandler, MergeWindowTabsHandlerHandler, ToggleWindowTabsBarHandler, ToggleWindowAlwaysOnTopAction, DisableWindowAlwaysOnTopAction, EnableWindowAlwaysOnTopAction, CloseOtherWindowsAction } from './actions/windowActions.js';
import { ContextKeyExpr } from '../../platform/contextkey/common/contextkey.js';
import { KeybindingsRegistry, KeybindingWeight } from '../../platform/keybinding/common/keybindingsRegistry.js';
import { CommandsRegistry } from '../../platform/commands/common/commands.js';
import { ServicesAccessor } from '../../platform/instantiation/common/instantiation.js';
import { IsMacContext } from '../../platform/contextkey/common/contextkeys.js';
import { INativeHostService } from '../../platform/native/common/native.js';
import { IJSONContributionRegistry, Extensions as JSONExtensions } from '../../platform/jsonschemas/common/jsonContributionRegistry.js';
import { IJSONSchema } from '../../base/common/jsonSchema.js';
import { InstallShellScriptAction, UninstallShellScriptAction } from './actions/installActions.js';
import { EditorsVisibleContext, SingleEditorGroupsContext } from '../common/contextkeys.js';
import { TELEMETRY_SETTING_ID } from '../../platform/telemetry/common/telemetry.js';
import { IConfigurationService } from '../../platform/configuration/common/configuration.js';
import { ShutdownReason } from '../services/lifecycle/common/lifecycle.js';
import { NativeWindow } from './window.js';
import { ModifierKeyEmitter } from '../../base/browser/dom.js';
import { applicationConfigurationNodeBase, securityConfigurationNodeBase } from '../common/configuration.js';
import { MAX_ZOOM_LEVEL, MIN_ZOOM_LEVEL } from '../../platform/window/electron-browser/window.js';

// Actions
(function registerActions(): void {

	// Actions: Zoom
	registerAction2(ZoomInAction);
	registerAction2(ZoomOutAction);
	registerAction2(ZoomResetAction);

	// Actions: Window
	registerAction2(SwitchWindowAction);
	registerAction2(QuickSwitchWindowAction);
	registerAction2(CloseWindowAction);
	registerAction2(CloseOtherWindowsAction);
	registerAction2(ToggleWindowAlwaysOnTopAction);
	registerAction2(EnableWindowAlwaysOnTopAction);
	registerAction2(DisableWindowAlwaysOnTopAction);

	if (isMacintosh) {
		// macOS: behave like other native apps that have documents
		// but can run without a document opened and allow to close
		// the window when the last document is closed
		// (https://github.com/microsoft/vscode/issues/126042)
		KeybindingsRegistry.registerKeybindingRule({
			id: CloseWindowAction.ID,
			weight: KeybindingWeight.WorkbenchContrib,
			when: ContextKeyExpr.and(EditorsVisibleContext.toNegated(), SingleEditorGroupsContext),
			primary: KeyMod.CtrlCmd | KeyCode.KeyW
		});
	}

	// Actions: Install Shell Script (macOS only)
	if (isMacintosh) {
		registerAction2(InstallShellScriptAction);
		registerAction2(UninstallShellScriptAction);
	}

	// Quit
	KeybindingsRegistry.registerCommandAndKeybindingRule({
		id: 'workbench.action.quit',
		weight: KeybindingWeight.WorkbenchContrib,
		async handler(accessor: ServicesAccessor) {
			const nativeHostService = accessor.get(INativeHostService);
			const configurationService = accessor.get(IConfigurationService);

			const confirmBeforeClose = configurationService.getValue<'always' | 'never' | 'keyboardOnly'>('window.confirmBeforeClose');
			if (confirmBeforeClose === 'always' || (confirmBeforeClose === 'keyboardOnly' && ModifierKeyEmitter.getInstance().isModifierPressed)) {
				const confirmed = await NativeWindow.confirmOnShutdown(accessor, ShutdownReason.QUIT);
				if (!confirmed) {
					return; // quit prevented by user
				}
			}

			nativeHostService.quit();
		},
		when: undefined,
		mac: { primary: KeyMod.CtrlCmd | KeyCode.KeyQ },
		linux: { primary: KeyMod.CtrlCmd | KeyCode.KeyQ }
	});

	// Actions: macOS Native Tabs
	if (isMacintosh) {
		for (const command of [
			{ handler: NewWindowTabHandler, id: 'workbench.action.newWindowTab', title: localize2('newTab', 'New Window Tab') },
			{ handler: ShowPreviousWindowTabHandler, id: 'workbench.action.showPreviousWindowTab', title: localize2('showPreviousTab', 'Show Previous Window Tab') },
			{ handler: ShowNextWindowTabHandler, id: 'workbench.action.showNextWindowTab', title: localize2('showNextWindowTab', 'Show Next Window Tab') },
			{ handler: MoveWindowTabToNewWindowHandler, id: 'workbench.action.moveWindowTabToNewWindow', title: localize2('moveWindowTabToNewWindow', 'Move Window Tab to New Window') },
			{ handler: MergeWindowTabsHandlerHandler, id: 'workbench.action.mergeAllWindowTabs', title: localize2('mergeAllWindowTabs', 'Merge All Windows') },
			{ handler: ToggleWindowTabsBarHandler, id: 'workbench.action.toggleWindowTabsBar', title: localize2('toggleWindowTabsBar', 'Toggle Window Tabs Bar') }
		]) {
			CommandsRegistry.registerCommand(command.id, command.handler);

			MenuRegistry.appendMenuItem(MenuId.CommandPalette, {
				command,
				when: ContextKeyExpr.equals('config.window.nativeTabs', true)
			});
		}
	}

	// Actions: Developer
	registerAction2(ReloadWindowWithExtensionsDisabledAction);
	registerAction2(ConfigureRuntimeArgumentsAction);
	registerAction2(ToggleDevToolsAction);
	registerAction2(OpenUserDataFolderAction);
	registerAction2(ShowGPUInfoAction);
	registerAction2(ShowContentTracingAction);
	registerAction2(StopTracing);
})();

// Menu
(function registerMenu(): void {

	// Quit
	MenuRegistry.appendMenuItem(MenuId.MenubarFileMenu, {
		group: 'z_Exit',
		command: {
			id: 'workbench.action.quit',
			title: localize({ key: 'miExit', comment: ['&& denotes a mnemonic'] }, "E&&xit")
		},
		order: 1,
		when: IsMacContext.toNegated()
	});
})();

// Configuration
(function registerConfiguration(): void {
	const registry = Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration);

	// Application
	registry.registerConfiguration({
		...applicationConfigurationNodeBase,
		'properties': {
			'application.shellEnvironmentResolutionTimeout': {
				'type': 'number',
				'default': 10,
				'minimum': 1,
				'maximum': 120,
				'included': !isWindows,
				'scope': ConfigurationScope.APPLICATION,
				'markdownDescription': localize('application.shellEnvironmentResolutionTimeout', "Controls the timeout in seconds before giving up resolving the shell environment when the application is not already launched from a terminal. See our [documentation](https://go.microsoft.com/fwlink/?linkid=2149667) for more information.")
			}
		}
	});

	// Window
	registry.registerConfiguration({
		'id': 'window',
		'order': 8,
		'title': localize('windowConfigurationTitle', "Window"),
		'type': 'object',
		'properties': {
			'window.confirmSaveUntitledWorkspace': {
				'type': 'boolean',
				'default': true,
				'description': localize('confirmSaveUntitledWorkspace', "Controls whether a confirmation dialog shows asking to save or discard an opened untitled workspace in the window when switching to another workspace. Disabling the confirmation dialog will always discard the untitled workspace."),
			},
			'window.openWithoutArgumentsInNewWindow': {
				'type': 'string',
				'enum': ['on', 'off'],
				'enumDescriptions': [
					localize('window.openWithoutArgumentsInNewWindow.on', "Open a new empty window."),
					localize('window.openWithoutArgumentsInNewWindow.off', "Focus the last active running instance.")
				],
				'default': isMacintosh ? 'off' : 'on',
				'scope': ConfigurationScope.APPLICATION,
				'markdownDescription': localize('openWithoutArgumentsInNewWindow', "Controls whether a new empty window should open when starting a second instance without arguments or if the last running instance should get focus.\nNote that there can still be cases where this setting is ignored (e.g. when using the `--new-window` or `--reuse-window` command line option).")
			},
			'window.restoreWindows': {
				'type': 'string',
				'enum': ['preserve', 'all', 'folders', 'one', 'none'],
				'enumDescriptions': [
					localize('window.reopenFolders.preserve', "Always reopen all windows. If a folder or workspace is opened (e.g. from the command line) it opens as a new window unless it was opened before. If files are opened they will open in one of the restored windows together with editors that were previously opened."),
					localize('window.reopenFolders.all', "Reopen all windows unless a folder, workspace or file is opened (e.g. from the command line). If a file is opened, it will replace any of the editors that were previously opened in a window."),
					localize('window.reopenFolders.folders', "Reopen all windows that had folders or workspaces opened unless a folder, workspace or file is opened (e.g. from the command line). If a file is opened, it will replace any of the editors that were previously opened in a window."),
					localize('window.reopenFolders.one', "Reopen the last active window unless a folder, workspace or file is opened (e.g. from the command line). If a file is opened, it will replace any of the editors that were previously opened in a window."),
					localize('window.reopenFolders.none', "Never reopen a window. Unless a folder or workspace is opened (e.g. from the command line), an empty window will appear.")
				],
				'default': 'all',
				'scope': ConfigurationScope.APPLICATION,
				'description': localize('restoreWindows', "Controls how windows and editors within are being restored when opening.")
			},
			'window.restoreFullscreen': {
				'type': 'boolean',
				'default': false,
				'scope': ConfigurationScope.APPLICATION,
				'description': localize('restoreFullscreen', "Controls whether a window should restore to full screen mode if it was exited in full screen mode.")
			},
			'window.zoomLevel': {
				'type': 'number',
				'default': 0,
				'minimum': MIN_ZOOM_LEVEL,
				'maximum': MAX_ZOOM_LEVEL,
				'markdownDescription': localize({ comment: ['{0} will be a setting name rendered as a link'], key: 'zoomLevel' }, "Adjust the default zoom level for all windows. Each increment above `0` (e.g. `1`) or below (e.g. `-1`) represents zooming `20%` larger or smaller. You can also enter decimals to adjust the zoom level with a finer granularity. See {0} for configuring if the 'Zoom In' and 'Zoom Out' commands apply the zoom level to all windows or only the active window.", '`#window.zoomPerWindow#`'),
				ignoreSync: true,
				tags: ['accessibility']
			},
			'window.zoomPerWindow': {
				'type': 'boolean',
				'default': true,
				'markdownDescription': localize({ comment: ['{0} will be a setting name rendered as a link'], key: 'zoomPerWindow' }, "Controls if the 'Zoom In' and 'Zoom Out' commands apply the zoom level to all windows or only the active window. See {0} for configuring a default zoom level for all windows.", '`#window.zoomLevel#`'),
				tags: ['accessibility']
			},
			'window.newWindowDimensions': {
				'type': 'string',
				'enum': ['default', 'inherit', 'offset', 'maximized', 'fullscreen'],
				'enumDescriptions': [
					localize('window.newWindowDimensions.default', "Open new windows in the center of the screen."),
					localize('window.newWindowDimensions.inherit', "Open new windows with same dimension as last active one."),
					localize('window.newWindowDimensions.offset', "Open new windows with same dimension as last active one with an offset position."),
					localize('window.newWindowDimensions.maximized', "Open new windows maximized."),
					localize('window.newWindowDimensions.fullscreen', "Open new windows in full screen mode.")
				],
				'default': 'default',
				'scope': ConfigurationScope.APPLICATION,
				'description': localize('newWindowDimensions', "Controls the dimensions of opening a new window when at least one window is already opened. Note that this setting does not have an impact on the first window that is opened. The first window will always restore the size and location as you left it before closing.")
			},
			'window.closeWhenEmpty': {
				'type': 'boolean',
				'default': false,
				'description': localize('closeWhenEmpty', "Controls whether closing the last editor should also close the window. This setting only applies for windows that do not show folders.")
			},
			'window.doubleClickIconToClose': {
				'type': 'boolean',
				'default': false,
				'scope': ConfigurationScope.APPLICATION,
				'markdownDescription': localize('window.doubleClickIconToClose', "If enabled, this setting will close the window when the application icon in the title bar is double-clicked. The window will not be able to be dragged by the icon. This setting is effective only if {0} is set to `custom`.", '`#window.titleBarStyle#`')
			},
			'window.titleBarStyle': {
				'type': 'string',
				'enum': ['native', 'custom'],
				'default': 'custom',
				'scope': ConfigurationScope.APPLICATION,
				'description': localize('titleBarStyle', "Adjust the appearance of the window title bar to be native by the OS or custom. Changes require a full restart to apply."),
			},
			'window.controlsStyle': {
				'type': 'string',
				'enum': ['native', 'custom', 'hidden'],
				'default': 'native',
				'included': !isMacintosh,
				'scope': ConfigurationScope.APPLICATION,
				'description': localize('controlsStyle', "Adjust the appearance of the window controls to be native by the OS, custom drawn or hidden. Changes require a full restart to apply."),
			},
			'window.customTitleBarVisibility': {
				'type': 'string',
				'enum': ['auto', 'windowed', 'never'],
				'markdownEnumDescriptions': [
					localize(`window.customTitleBarVisibility.auto`, "Automatically changes custom title bar visibility."),
					localize(`window.customTitleBarVisibility.windowed`, "Hide custom titlebar in full screen. When not in full screen, automatically change custom title bar visibility."),
					localize(`window.customTitleBarVisibility.never`, "Hide custom titlebar when {0} is set to `native`.", '`#window.titleBarStyle#`'),
				],
				'default': 'auto',
				'scope': ConfigurationScope.APPLICATION,
				'markdownDescription': localize('window.customTitleBarVisibility', "Adjust when the custom title bar should be shown. The custom title bar can be hidden when in full screen mode with `windowed`. The custom title bar can only be hidden in non full screen mode with `never` when {0} is set to `native`.", '`#window.titleBarStyle#`'),
			},
			'window.menuStyle': {
				'type': 'string',
				'enum': ['custom', 'native', 'inherit'],
				'markdownEnumDescriptions': isMacintosh ?
					[
						localize(`window.menuStyle.custom.mac`, "Use the custom context menu."),
						localize(`window.menuStyle.native.mac`, "Use the native context menu."),
						localize(`window.menuStyle.inherit.mac`, "Matches the context menu style to the title bar style defined in {0}.", '`#window.titleBarStyle#`'),
					] :
					[
						localize(`window.menuStyle.custom`, "Use the custom menu."),
						localize(`window.menuStyle.native`, "Use the native menu. This is ignored when {0} is set to {1}.", '`#window.titleBarStyle#`', '`custom`'),
						localize(`window.menuStyle.inherit`, "Matches the menu style to the title bar style defined in {0}.", '`#window.titleBarStyle#`'),
					],
				'default': isMacintosh ? 'native' : 'inherit',
				'scope': ConfigurationScope.APPLICATION,
				'markdownDescription': isMacintosh ?
					localize('window.menuStyle.mac', "Adjust the context menu appearances to either be native by the OS, custom, or inherited from the title bar style defined in {0}.", '`#window.titleBarStyle#`') :
					localize('window.menuStyle', "Adjust the menu style to either be native by the OS, custom, or inherited from the title bar style defined in {0}. This also affects the context menu appearance. Changes require a full restart to apply.", '`#window.titleBarStyle#`'),
			},
			'window.dialogStyle': {
				'type': 'string',
				'enum': ['native', 'custom'],
				'default': 'native',
				'scope': ConfigurationScope.APPLICATION,
				'description': localize('dialogStyle', "Adjust the appearance of dialogs to be native by the OS or custom.")
			},
			'window.nativeTabs': {
				'type': 'boolean',
				'default': false,
				'scope': ConfigurationScope.APPLICATION,
				'description': localize('window.nativeTabs', "Enables macOS native window tabs. Note that changes require a full restart to apply and that native tabs will disable a custom title bar style if configured."),
				'included': isMacintosh,
			},
			'window.nativeFullScreen': {
				'type': 'boolean',
				'default': true,
				'description': localize('window.nativeFullScreen', "Controls if native full-screen should be used on macOS. Disable this option to prevent macOS from creating a new space when going full-screen."),
				'scope': ConfigurationScope.APPLICATION,
				'included': isMacintosh
			},
			'window.clickThroughInactive': {
				'type': 'boolean',
				'default': true,
				'scope': ConfigurationScope.APPLICATION,
				'description': localize('window.clickThroughInactive', "If enabled, clicking on an inactive window will both activate the window and trigger the element under the mouse if it is clickable. If disabled, clicking anywhere on an inactive window will activate it only and a second click is required on the element."),
				'included': isMacintosh
			},
			'window.border': {
				'type': 'string',
				'default': 'default',
				'markdownDescription': (() => {
					let windowBorderDescription = localize('window.border.prefix', "Controls the border color of the window:");
					windowBorderDescription += '\n- ' + [
						localize('window.border.default', "{0}: respect color theme settings, fallback to Windows settings", '`default`'),
						localize('window.border.system', "{0}: respect Windows settings only", '`system`'),
						localize('window.border.off', "{0}: disable border colors", '`off`'),
						localize('window.border.color', "{0}: specific color in Hex, RGB, RGBA, HSL, HSLA format", '`<color>`'),
					].join('\n- ');
					windowBorderDescription += '\n\n' + localize('window.border.suffix', "Use {0} to set different colors for active and inactive windows. This setting is ignored when {1} is set to {2}.", '`#workbench.colorCustomizations#`', '`#window.titleBarStyle#`', '`native`');

					return windowBorderDescription;
				})(),
				'included': isWindows
			}
		}
	});

	// Telemetry
	registry.registerConfiguration({
		'id': 'telemetry',
		'order': 110,
		title: localize('telemetryConfigurationTitle', "Telemetry"),
		'type': 'object',
		'properties': {
			'telemetry.enableCrashReporter': {
				'type': 'boolean',
				'description': localize('telemetry.enableCrashReporting', "Enable crash reports to be collected. This helps us improve stability. \nThis option requires restart to take effect."),
				'default': true,
				'tags': ['usesOnlineServices', 'telemetry'],
				'markdownDeprecationMessage': localize('enableCrashReporterDeprecated', "If this setting is false, no telemetry will be sent regardless of the new setting's value. Deprecated due to being combined into the {0} setting.", `\`#${TELEMETRY_SETTING_ID}#\``),
			}
		}
	});

	// Keybinding
	registry.registerConfiguration({
		'id': 'keyboard',
		'order': 15,
		'type': 'object',
		'title': localize('keyboardConfigurationTitle', "Keyboard"),
		'properties': {
			'keyboard.touchbar.enabled': {
				'type': 'boolean',
				'default': true,
				'description': localize('touchbar.enabled', "Enables the macOS touchbar buttons on the keyboard if available."),
				'included': isMacintosh
			},
			'keyboard.touchbar.ignored': {
				'type': 'array',
				'items': {
					'type': 'string'
				},
				'default': [],
				'markdownDescription': localize('touchbar.ignored', 'A set of identifiers for entries in the touchbar that should not show up (for example `workbench.action.navigateBack`).'),
				'included': isMacintosh
			}
		}
	});

	// Security
	registry.registerConfiguration({
		...securityConfigurationNodeBase,
		'properties': {
			'security.promptForLocalFileProtocolHandling': {
				'type': 'boolean',
				'default': true,
				'markdownDescription': localize('security.promptForLocalFileProtocolHandling', 'If enabled, a dialog will ask for confirmation whenever a local file or workspace is about to open through a protocol handler.'),
				'scope': ConfigurationScope.APPLICATION
			},
			'security.promptForRemoteFileProtocolHandling': {
				'type': 'boolean',
				'default': true,
				'markdownDescription': localize('security.promptForRemoteFileProtocolHandling', 'If enabled, a dialog will ask for confirmation whenever a remote file or workspace is about to open through a protocol handler.'),
				'scope': ConfigurationScope.APPLICATION
			}
		}
	});
})();

// JSON Schemas
(function registerJSONSchemas(): void {
	const argvDefinitionFileSchemaId = 'vscode://schemas/argv';
	const jsonRegistry = Registry.as<IJSONContributionRegistry>(JSONExtensions.JSONContribution);
	const schema: IJSONSchema = {
		id: argvDefinitionFileSchemaId,
		allowComments: true,
		allowTrailingCommas: true,
		description: 'VSCode static command line definition file',
		type: 'object',
		additionalProperties: false,
		properties: {
			locale: {
				type: 'string',
				description: localize('argv.locale', 'The display Language to use. Picking a different language requires the associated language pack to be installed.')
			},
			'disable-lcd-text': {
				type: 'boolean',
				description: localize('argv.disableLcdText', 'Disables LCD font antialiasing.')
			},
			'proxy-bypass-list': {
				type: 'string',
				description: localize('argv.proxyBypassList', 'Bypass any specified proxy for the given semi-colon-separated list of hosts. Example value "<local>;*.microsoft.com;*foo.com;1.2.3.4:5678", will use the proxy server for all hosts except for local addresses (localhost, 127.0.0.1 etc.), microsoft.com subdomains, hosts that contain the suffix foo.com and anything at 1.2.3.4:5678')
			},
			'disable-hardware-acceleration': {
				type: 'boolean',
				description: localize('argv.disableHardwareAcceleration', 'Disables hardware acceleration. ONLY change this option if you encounter graphic issues.')
			},
			'force-color-profile': {
				type: 'string',
				markdownDescription: localize('argv.forceColorProfile', 'Allows to override the color profile to use. If you experience colors appear badly, try to set this to `srgb` and restart.')
			},
			'enable-crash-reporter': {
				type: 'boolean',
				markdownDescription: localize('argv.enableCrashReporter', 'Allows to disable crash reporting, should restart the app if the value is changed.')
			},
			'crash-reporter-id': {
				type: 'string',
				markdownDescription: localize('argv.crashReporterId', 'Unique id used for correlating crash reports sent from this app instance.')
			},
			'enable-proposed-api': {
				type: 'array',
				description: localize('argv.enebleProposedApi', "Enable proposed APIs for a list of extension ids (such as \`vscode.git\`). Proposed APIs are unstable and subject to breaking without warning at any time. This should only be set for extension development and testing purposes."),
				items: {
					type: 'string'
				}
			},
			'log-level': {
				type: ['string', 'array'],
				description: localize('argv.logLevel', "Log level to use. Default is 'info'. Allowed values are 'error', 'warn', 'info', 'debug', 'trace', 'off'.")
			},
			'disable-chromium-sandbox': {
				type: 'boolean',
				description: localize('argv.disableChromiumSandbox', "Disables the Chromium sandbox. This is useful when running VS Code as elevated on Linux and running under Applocker on Windows.")
			},
			'use-inmemory-secretstorage': {
				type: 'boolean',
				description: localize('argv.useInMemorySecretStorage', "Ensures that an in-memory store will be used for secret storage instead of using the OS's credential store. This is often used when running VS Code extension tests or when you're experiencing difficulties with the credential store.")
			},
			'remote-debugging-port': {
				type: 'string',
				description: localize('argv.remoteDebuggingPort', "Specifies the port to use for remote debugging.")
			}
		}
	};
	if (isLinux) {
		schema.properties!['force-renderer-accessibility'] = {
			type: 'boolean',
			description: localize('argv.force-renderer-accessibility', 'Forces the renderer to be accessible. ONLY change this if you are using a screen reader on Linux. On other platforms the renderer will automatically be accessible. This flag is automatically set if you have editor.accessibilitySupport: on.'),
		};
		schema.properties!['password-store'] = {
			type: 'string',
			description: localize('argv.passwordStore', "Configures the backend used to store secrets on Linux. This argument is ignored on Windows & macOS.")
		};
	}
	if (isWindows) {
		schema.properties!['enable-rdp-display-tracking'] = {
			type: 'boolean',
			description: localize('argv.enableRDPDisplayTracking', "Ensures that maximized windows gets restored to correct display during RDP reconnection.")
		};
	}

	jsonRegistry.registerSchema(argvDefinitionFileSchemaId, schema);
})();
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/electron-browser/desktop.main.ts]---
Location: vscode-main/src/vs/workbench/electron-browser/desktop.main.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../nls.js';
import product from '../../platform/product/common/product.js';
import { INativeWindowConfiguration, IWindowsConfiguration } from '../../platform/window/common/window.js';
import { Workbench } from '../browser/workbench.js';
import { NativeWindow } from './window.js';
import { setFullscreen } from '../../base/browser/browser.js';
import { domContentLoaded } from '../../base/browser/dom.js';
import { onUnexpectedError } from '../../base/common/errors.js';
import { URI } from '../../base/common/uri.js';
import { WorkspaceService } from '../services/configuration/browser/configurationService.js';
import { INativeWorkbenchEnvironmentService, NativeWorkbenchEnvironmentService } from '../services/environment/electron-browser/environmentService.js';
import { ServiceCollection } from '../../platform/instantiation/common/serviceCollection.js';
import { ILoggerService, ILogService, LogLevel } from '../../platform/log/common/log.js';
import { NativeWorkbenchStorageService } from '../services/storage/electron-browser/storageService.js';
import { IWorkspaceContextService, isSingleFolderWorkspaceIdentifier, isWorkspaceIdentifier, IAnyWorkspaceIdentifier, reviveIdentifier, toWorkspaceIdentifier } from '../../platform/workspace/common/workspace.js';
import { IWorkbenchConfigurationService } from '../services/configuration/common/configuration.js';
import { IStorageService } from '../../platform/storage/common/storage.js';
import { Disposable } from '../../base/common/lifecycle.js';
import { ISharedProcessService } from '../../platform/ipc/electron-browser/services.js';
import { IMainProcessService } from '../../platform/ipc/common/mainProcessService.js';
import { SharedProcessService } from '../services/sharedProcess/electron-browser/sharedProcessService.js';
import { RemoteAuthorityResolverService } from '../../platform/remote/electron-browser/remoteAuthorityResolverService.js';
import { IRemoteAuthorityResolverService, RemoteConnectionType } from '../../platform/remote/common/remoteAuthorityResolver.js';
import { RemoteAgentService } from '../services/remote/electron-browser/remoteAgentService.js';
import { IRemoteAgentService } from '../services/remote/common/remoteAgentService.js';
import { FileService } from '../../platform/files/common/fileService.js';
import { IFileService } from '../../platform/files/common/files.js';
import { RemoteFileSystemProviderClient } from '../services/remote/common/remoteFileSystemProviderClient.js';
import { ConfigurationCache } from '../services/configuration/common/configurationCache.js';
import { ISignService } from '../../platform/sign/common/sign.js';
import { IProductService } from '../../platform/product/common/productService.js';
import { IUriIdentityService } from '../../platform/uriIdentity/common/uriIdentity.js';
import { UriIdentityService } from '../../platform/uriIdentity/common/uriIdentityService.js';
import { INativeKeyboardLayoutService, NativeKeyboardLayoutService } from '../services/keybinding/electron-browser/nativeKeyboardLayoutService.js';
import { ElectronIPCMainProcessService } from '../../platform/ipc/electron-browser/mainProcessService.js';
import { LoggerChannelClient } from '../../platform/log/common/logIpc.js';
import { ProxyChannel } from '../../base/parts/ipc/common/ipc.js';
import { NativeLogService } from '../services/log/electron-browser/logService.js';
import { WorkspaceTrustEnablementService, WorkspaceTrustManagementService } from '../services/workspaces/common/workspaceTrust.js';
import { IWorkspaceTrustEnablementService, IWorkspaceTrustManagementService } from '../../platform/workspace/common/workspaceTrust.js';
import { safeStringify } from '../../base/common/objects.js';
import { IUtilityProcessWorkerWorkbenchService, UtilityProcessWorkerWorkbenchService } from '../services/utilityProcess/electron-browser/utilityProcessWorkerWorkbenchService.js';
import { isCI, isMacintosh, isTahoeOrNewer } from '../../base/common/platform.js';
import { Schemas } from '../../base/common/network.js';
import { DiskFileSystemProvider } from '../services/files/electron-browser/diskFileSystemProvider.js';
import { FileUserDataProvider } from '../../platform/userData/common/fileUserDataProvider.js';
import { IUserDataProfilesService, reviveProfile } from '../../platform/userDataProfile/common/userDataProfile.js';
import { UserDataProfilesService } from '../../platform/userDataProfile/common/userDataProfileIpc.js';
import { PolicyChannelClient } from '../../platform/policy/common/policyIpc.js';
import { IPolicyService } from '../../platform/policy/common/policy.js';
import { UserDataProfileService } from '../services/userDataProfile/common/userDataProfileService.js';
import { IUserDataProfileService } from '../services/userDataProfile/common/userDataProfile.js';
import { BrowserSocketFactory } from '../../platform/remote/browser/browserSocketFactory.js';
import { RemoteSocketFactoryService, IRemoteSocketFactoryService } from '../../platform/remote/common/remoteSocketFactoryService.js';
import { ElectronRemoteResourceLoader } from '../../platform/remote/electron-browser/electronRemoteResourceLoader.js';
import { IConfigurationService } from '../../platform/configuration/common/configuration.js';
import { applyZoom } from '../../platform/window/electron-browser/window.js';
import { mainWindow } from '../../base/browser/window.js';
import { IDefaultAccountService } from '../../platform/defaultAccount/common/defaultAccount.js';
import { DefaultAccountService } from '../services/accounts/common/defaultAccount.js';
import { AccountPolicyService } from '../services/policies/common/accountPolicyService.js';
import { MultiplexPolicyService } from '../services/policies/common/multiplexPolicyService.js';

export class DesktopMain extends Disposable {

	constructor(
		private readonly configuration: INativeWindowConfiguration
	) {
		super();

		this.init();
	}

	private init(): void {

		// Massage configuration file URIs
		this.reviveUris();

		// Apply fullscreen early if configured
		setFullscreen(!!this.configuration.fullscreen, mainWindow);
	}

	private reviveUris() {

		// Workspace
		const workspace = reviveIdentifier(this.configuration.workspace);
		if (isWorkspaceIdentifier(workspace) || isSingleFolderWorkspaceIdentifier(workspace)) {
			this.configuration.workspace = workspace;
		}

		// Files
		const filesToWait = this.configuration.filesToWait;
		const filesToWaitPaths = filesToWait?.paths;
		for (const paths of [filesToWaitPaths, this.configuration.filesToOpenOrCreate, this.configuration.filesToDiff, this.configuration.filesToMerge]) {
			if (Array.isArray(paths)) {
				for (const path of paths) {
					if (path.fileUri) {
						path.fileUri = URI.revive(path.fileUri);
					}
				}
			}
		}

		if (filesToWait) {
			filesToWait.waitMarkerFileUri = URI.revive(filesToWait.waitMarkerFileUri);
		}
	}

	async open(): Promise<void> {

		// Init services and wait for DOM to be ready in parallel
		const [services] = await Promise.all([this.initServices(), domContentLoaded(mainWindow)]);

		// Apply zoom level early once we have a configuration service
		// and before the workbench is created to prevent flickering.
		// We also need to respect that zoom level can be configured per
		// workspace, so we need the resolved configuration service.
		// Finally, it is possible for the window to have a custom
		// zoom level that is not derived from settings.
		// (fixes https://github.com/microsoft/vscode/issues/187982)
		this.applyWindowZoomLevel(services.configurationService);

		// Create Workbench
		const workbench = new Workbench(mainWindow.document.body, {
			extraClasses: this.getExtraClasses(),
			resetLayout: this.configuration['disable-layout-restore'] === true
		}, services.serviceCollection, services.logService);

		// Listeners
		this.registerListeners(workbench, services.storageService);

		// Startup
		const instantiationService = workbench.startup();

		// Window
		this._register(instantiationService.createInstance(NativeWindow));
	}

	private applyWindowZoomLevel(configurationService: IConfigurationService) {
		let zoomLevel: number | undefined = undefined;
		if (this.configuration.isCustomZoomLevel && typeof this.configuration.zoomLevel === 'number') {
			zoomLevel = this.configuration.zoomLevel;
		} else {
			const windowConfig = configurationService.getValue<IWindowsConfiguration>();
			zoomLevel = typeof windowConfig.window?.zoomLevel === 'number' ? windowConfig.window.zoomLevel : 0;
		}

		applyZoom(zoomLevel, mainWindow);
	}

	private getExtraClasses(): string[] {
		if (isMacintosh && isTahoeOrNewer(this.configuration.os.release)) {
			return ['macos-tahoe'];
		}

		return [];
	}

	private registerListeners(workbench: Workbench, storageService: NativeWorkbenchStorageService): void {

		// Workbench Lifecycle
		this._register(workbench.onWillShutdown(event => event.join(storageService.close(), { id: 'join.closeStorage', label: localize('join.closeStorage', "Saving UI state") })));
		this._register(workbench.onDidShutdown(() => this.dispose()));
	}

	private async initServices(): Promise<{ serviceCollection: ServiceCollection; logService: ILogService; storageService: NativeWorkbenchStorageService; configurationService: IConfigurationService }> {
		const serviceCollection = new ServiceCollection();


		// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		//
		// NOTE: Please do NOT register services here. Use `registerSingleton()`
		//       from `workbench.common.main.ts` if the service is shared between
		//       desktop and web or `workbench.desktop.main.ts` if the service
		//       is desktop only.
		//
		// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


		// Main Process
		const mainProcessService = this._register(new ElectronIPCMainProcessService(this.configuration.windowId));
		serviceCollection.set(IMainProcessService, mainProcessService);

		// Product
		const productService: IProductService = { _serviceBrand: undefined, ...product };
		serviceCollection.set(IProductService, productService);

		// Environment
		const environmentService = new NativeWorkbenchEnvironmentService(this.configuration, productService);
		serviceCollection.set(INativeWorkbenchEnvironmentService, environmentService);

		// Logger
		const loggers = this.configuration.loggers.map(loggerResource => ({ ...loggerResource, resource: URI.revive(loggerResource.resource) }));
		const loggerService = new LoggerChannelClient(this.configuration.windowId, this.configuration.logLevel, environmentService.windowLogsPath, loggers, mainProcessService.getChannel('logger'));
		serviceCollection.set(ILoggerService, loggerService);

		// Log
		const logService = this._register(new NativeLogService(loggerService, environmentService));
		serviceCollection.set(ILogService, logService);
		if (isCI) {
			logService.info('workbench#open()'); // marking workbench open helps to diagnose flaky integration/smoke tests
		}
		if (logService.getLevel() === LogLevel.Trace) {
			logService.trace('workbench#open(): with configuration', safeStringify({ ...this.configuration, nls: undefined /* exclude large property */ }));
		}

		// Default Account
		const defaultAccountService = this._register(new DefaultAccountService());
		serviceCollection.set(IDefaultAccountService, defaultAccountService);

		// Policies
		let policyService: IPolicyService;
		const accountPolicy = new AccountPolicyService(logService, defaultAccountService);
		if (this.configuration.policiesData) {
			const policyChannel = new PolicyChannelClient(this.configuration.policiesData, mainProcessService.getChannel('policy'));
			policyService = new MultiplexPolicyService([policyChannel, accountPolicy], logService);
		} else {
			policyService = accountPolicy;
		}
		serviceCollection.set(IPolicyService, policyService);

		// Shared Process
		const sharedProcessService = new SharedProcessService(this.configuration.windowId, logService);
		serviceCollection.set(ISharedProcessService, sharedProcessService);

		// Utility Process Worker
		const utilityProcessWorkerWorkbenchService = new UtilityProcessWorkerWorkbenchService(this.configuration.windowId, logService, mainProcessService);
		serviceCollection.set(IUtilityProcessWorkerWorkbenchService, utilityProcessWorkerWorkbenchService);

		// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		//
		// NOTE: Please do NOT register services here. Use `registerSingleton()`
		//       from `workbench.common.main.ts` if the service is shared between
		//       desktop and web or `workbench.desktop.main.ts` if the service
		//       is desktop only.
		//
		// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


		// Sign
		const signService = ProxyChannel.toService<ISignService>(mainProcessService.getChannel('sign'));
		serviceCollection.set(ISignService, signService);

		// Files
		const fileService = this._register(new FileService(logService));
		serviceCollection.set(IFileService, fileService);

		// Remote
		const remoteAuthorityResolverService = new RemoteAuthorityResolverService(productService, new ElectronRemoteResourceLoader(environmentService.window.id, mainProcessService, fileService));
		serviceCollection.set(IRemoteAuthorityResolverService, remoteAuthorityResolverService);

		// Local Files
		const diskFileSystemProvider = this._register(new DiskFileSystemProvider(mainProcessService, utilityProcessWorkerWorkbenchService, logService, loggerService));
		fileService.registerProvider(Schemas.file, diskFileSystemProvider);

		// URI Identity
		const uriIdentityService = new UriIdentityService(fileService);
		serviceCollection.set(IUriIdentityService, uriIdentityService);

		// User Data Profiles
		const userDataProfilesService = new UserDataProfilesService(this.configuration.profiles.all, URI.revive(this.configuration.profiles.home).with({ scheme: environmentService.userRoamingDataHome.scheme }), mainProcessService.getChannel('userDataProfiles'));
		serviceCollection.set(IUserDataProfilesService, userDataProfilesService);
		const userDataProfileService = new UserDataProfileService(reviveProfile(this.configuration.profiles.profile, userDataProfilesService.profilesHome.scheme));
		serviceCollection.set(IUserDataProfileService, userDataProfileService);

		// Use FileUserDataProvider for user data to
		// enable atomic read / write operations.
		fileService.registerProvider(Schemas.vscodeUserData, this._register(new FileUserDataProvider(Schemas.file, diskFileSystemProvider, Schemas.vscodeUserData, userDataProfilesService, uriIdentityService, logService)));

		// Remote Agent
		const remoteSocketFactoryService = new RemoteSocketFactoryService();
		remoteSocketFactoryService.register(RemoteConnectionType.WebSocket, new BrowserSocketFactory(null));
		serviceCollection.set(IRemoteSocketFactoryService, remoteSocketFactoryService);
		const remoteAgentService = this._register(new RemoteAgentService(remoteSocketFactoryService, userDataProfileService, environmentService, productService, remoteAuthorityResolverService, signService, logService));
		serviceCollection.set(IRemoteAgentService, remoteAgentService);

		// Remote Files
		this._register(RemoteFileSystemProviderClient.register(remoteAgentService, fileService, logService));

		// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		//
		// NOTE: Please do NOT register services here. Use `registerSingleton()`
		//       from `workbench.common.main.ts` if the service is shared between
		//       desktop and web or `workbench.desktop.main.ts` if the service
		//       is desktop only.
		//
		// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

		// Create services that require resolving in parallel
		const workspace = this.resolveWorkspaceIdentifier(environmentService);
		const [configurationService, storageService] = await Promise.all([
			this.createWorkspaceService(workspace, environmentService, userDataProfileService, userDataProfilesService, fileService, remoteAgentService, uriIdentityService, logService, policyService).then(service => {

				// Workspace
				serviceCollection.set(IWorkspaceContextService, service);

				// Configuration
				serviceCollection.set(IWorkbenchConfigurationService, service);

				return service;
			}),

			this.createStorageService(workspace, environmentService, userDataProfileService, userDataProfilesService, mainProcessService).then(service => {

				// Storage
				serviceCollection.set(IStorageService, service);

				return service;
			}),

			this.createKeyboardLayoutService(mainProcessService).then(service => {

				// KeyboardLayout
				serviceCollection.set(INativeKeyboardLayoutService, service);

				return service;
			})
		]);

		// Workspace Trust Service
		const workspaceTrustEnablementService = new WorkspaceTrustEnablementService(configurationService, environmentService);
		serviceCollection.set(IWorkspaceTrustEnablementService, workspaceTrustEnablementService);

		const workspaceTrustManagementService = new WorkspaceTrustManagementService(configurationService, remoteAuthorityResolverService, storageService, uriIdentityService, environmentService, configurationService, workspaceTrustEnablementService, fileService);
		serviceCollection.set(IWorkspaceTrustManagementService, workspaceTrustManagementService);

		// Update workspace trust so that configuration is updated accordingly
		configurationService.updateWorkspaceTrust(workspaceTrustManagementService.isWorkspaceTrusted());
		this._register(workspaceTrustManagementService.onDidChangeTrust(() => configurationService.updateWorkspaceTrust(workspaceTrustManagementService.isWorkspaceTrusted())));


		// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		//
		// NOTE: Please do NOT register services here. Use `registerSingleton()`
		//       from `workbench.common.main.ts` if the service is shared between
		//       desktop and web or `workbench.desktop.main.ts` if the service
		//       is desktop only.
		//
		// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


		return { serviceCollection, logService, storageService, configurationService };
	}

	private resolveWorkspaceIdentifier(environmentService: INativeWorkbenchEnvironmentService): IAnyWorkspaceIdentifier {

		// Return early for when a folder or multi-root is opened
		if (this.configuration.workspace) {
			return this.configuration.workspace;
		}

		// Otherwise, workspace is empty, so we derive an identifier
		return toWorkspaceIdentifier(this.configuration.backupPath, environmentService.isExtensionDevelopment);
	}

	private async createWorkspaceService(
		workspace: IAnyWorkspaceIdentifier,
		environmentService: INativeWorkbenchEnvironmentService,
		userDataProfileService: IUserDataProfileService,
		userDataProfilesService: IUserDataProfilesService,
		fileService: FileService,
		remoteAgentService: IRemoteAgentService,
		uriIdentityService: IUriIdentityService,
		logService: ILogService,
		policyService: IPolicyService
	): Promise<WorkspaceService> {
		const configurationCache = new ConfigurationCache([Schemas.file, Schemas.vscodeUserData] /* Cache all non native resources */, environmentService, fileService);
		const workspaceService = new WorkspaceService({ remoteAuthority: environmentService.remoteAuthority, configurationCache }, environmentService, userDataProfileService, userDataProfilesService, fileService, remoteAgentService, uriIdentityService, logService, policyService);

		try {
			await workspaceService.initialize(workspace);

			return workspaceService;
		} catch (error) {
			onUnexpectedError(error);

			return workspaceService;
		}
	}

	private async createStorageService(workspace: IAnyWorkspaceIdentifier, environmentService: INativeWorkbenchEnvironmentService, userDataProfileService: IUserDataProfileService, userDataProfilesService: IUserDataProfilesService, mainProcessService: IMainProcessService): Promise<NativeWorkbenchStorageService> {
		const storageService = new NativeWorkbenchStorageService(workspace, userDataProfileService, userDataProfilesService, mainProcessService, environmentService);

		try {
			await storageService.initialize();

			return storageService;
		} catch (error) {
			onUnexpectedError(error);

			return storageService;
		}
	}

	private async createKeyboardLayoutService(mainProcessService: IMainProcessService): Promise<NativeKeyboardLayoutService> {
		const keyboardLayoutService = new NativeKeyboardLayoutService(mainProcessService);

		try {
			await keyboardLayoutService.initialize();

			return keyboardLayoutService;
		} catch (error) {
			onUnexpectedError(error);

			return keyboardLayoutService;
		}
	}
}

export interface IDesktopMain {
	main(configuration: INativeWindowConfiguration): Promise<void>;
}

export function main(configuration: INativeWindowConfiguration): Promise<void> {
	const workbench = new DesktopMain(configuration);

	return workbench.open();
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/electron-browser/window.ts]---
Location: vscode-main/src/vs/workbench/electron-browser/window.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/window.css';
import { localize } from '../../nls.js';
import { URI } from '../../base/common/uri.js';
import { equals } from '../../base/common/objects.js';
import { EventType, EventHelper, addDisposableListener, ModifierKeyEmitter, getActiveElement, hasWindow, getWindowById, getWindows, $ } from '../../base/browser/dom.js';
import { Action, Separator, WorkbenchActionExecutedClassification, WorkbenchActionExecutedEvent } from '../../base/common/actions.js';
import { IFileService } from '../../platform/files/common/files.js';
import { EditorResourceAccessor, IUntitledTextResourceEditorInput, SideBySideEditor, pathsToEditors, IResourceDiffEditorInput, IUntypedEditorInput, IEditorPane, isResourceEditorInput, IResourceMergeEditorInput } from '../common/editor.js';
import { IEditorService } from '../services/editor/common/editorService.js';
import { ITelemetryService } from '../../platform/telemetry/common/telemetry.js';
import { WindowMinimumSize, IOpenFileRequest, IAddRemoveFoldersRequest, INativeRunActionInWindowRequest, INativeRunKeybindingInWindowRequest, INativeOpenFileRequest, hasNativeTitlebar } from '../../platform/window/common/window.js';
import { ITitleService } from '../services/title/browser/titleService.js';
import { IWorkbenchThemeService } from '../services/themes/common/workbenchThemeService.js';
import { ApplyZoomTarget, applyZoom } from '../../platform/window/electron-browser/window.js';
import { setFullscreen, getZoomLevel, onDidChangeZoomLevel, getZoomFactor } from '../../base/browser/browser.js';
import { ICommandService, CommandsRegistry } from '../../platform/commands/common/commands.js';
import { IResourceEditorInput } from '../../platform/editor/common/editor.js';
import { ipcRenderer, process } from '../../base/parts/sandbox/electron-browser/globals.js';
import { IWorkspaceEditingService } from '../services/workspaces/common/workspaceEditing.js';
import { IMenuService, MenuId, IMenu, MenuItemAction, MenuRegistry } from '../../platform/actions/common/actions.js';
import { ICommandAction } from '../../platform/action/common/action.js';
import { getFlatActionBarActions } from '../../platform/actions/browser/menuEntryActionViewItem.js';
import { RunOnceScheduler } from '../../base/common/async.js';
import { Disposable, DisposableStore, MutableDisposable, toDisposable } from '../../base/common/lifecycle.js';
import { LifecyclePhase, ILifecycleService, WillShutdownEvent, ShutdownReason, BeforeShutdownErrorEvent, BeforeShutdownEvent } from '../services/lifecycle/common/lifecycle.js';
import { IWorkspaceFolderCreationData } from '../../platform/workspaces/common/workspaces.js';
import { IIntegrityService } from '../services/integrity/common/integrity.js';
import { isWindows, isMacintosh } from '../../base/common/platform.js';
import { IProductService } from '../../platform/product/common/productService.js';
import { INotificationService, NeverShowAgainScope, NotificationPriority, Severity } from '../../platform/notification/common/notification.js';
import { IKeybindingService } from '../../platform/keybinding/common/keybinding.js';
import { INativeWorkbenchEnvironmentService } from '../services/environment/electron-browser/environmentService.js';
import { IAccessibilityService, AccessibilitySupport } from '../../platform/accessibility/common/accessibility.js';
import { WorkbenchState, IWorkspaceContextService } from '../../platform/workspace/common/workspace.js';
import { coalesce } from '../../base/common/arrays.js';
import { ConfigurationTarget, IConfigurationService } from '../../platform/configuration/common/configuration.js';
import { IStorageService, StorageScope, StorageTarget } from '../../platform/storage/common/storage.js';
import { IOpenerService, IResolvedExternalUri, OpenOptions } from '../../platform/opener/common/opener.js';
import { Schemas } from '../../base/common/network.js';
import { INativeHostService } from '../../platform/native/common/native.js';
import { posix } from '../../base/common/path.js';
import { ITunnelService, RemoteTunnel, extractLocalHostUriMetaDataForPortMapping, extractQueryLocalHostUriMetaDataForPortMapping } from '../../platform/tunnel/common/tunnel.js';
import { IWorkbenchLayoutService, positionFromString, Position } from '../services/layout/browser/layoutService.js';
import { IWorkingCopyService } from '../services/workingCopy/common/workingCopyService.js';
import { WorkingCopyCapabilities } from '../services/workingCopy/common/workingCopy.js';
import { IFilesConfigurationService } from '../services/filesConfiguration/common/filesConfigurationService.js';
import { Event } from '../../base/common/event.js';
import { IRemoteAuthorityResolverService } from '../../platform/remote/common/remoteAuthorityResolver.js';
import { IAddressProvider, IAddress } from '../../platform/remote/common/remoteAgentConnection.js';
import { IEditorGroupsService, IEditorPart } from '../services/editor/common/editorGroupsService.js';
import { IDialogService } from '../../platform/dialogs/common/dialogs.js';
import { AuthInfo } from '../../base/parts/sandbox/electron-browser/electronTypes.js';
import { ILogService } from '../../platform/log/common/log.js';
import { IInstantiationService } from '../../platform/instantiation/common/instantiation.js';
import { whenEditorClosed } from '../browser/editor.js';
import { ISharedProcessService } from '../../platform/ipc/electron-browser/services.js';
import { IProgressService, ProgressLocation } from '../../platform/progress/common/progress.js';
import { toErrorMessage } from '../../base/common/errorMessage.js';
import { ILabelService } from '../../platform/label/common/label.js';
import { dirname } from '../../base/common/resources.js';
import { IBannerService } from '../services/banner/browser/bannerService.js';
import { Codicon } from '../../base/common/codicons.js';
import { IUriIdentityService } from '../../platform/uriIdentity/common/uriIdentity.js';
import { IPreferencesService } from '../services/preferences/common/preferences.js';
import { IUtilityProcessWorkerWorkbenchService } from '../services/utilityProcess/electron-browser/utilityProcessWorkerWorkbenchService.js';
import { registerWindowDriver } from '../services/driver/browser/driver.js';
import { mainWindow } from '../../base/browser/window.js';
import { BaseWindow } from '../browser/window.js';
import { IHostService } from '../services/host/browser/host.js';
import { IStatusbarService, ShowTooltipCommand, StatusbarAlignment } from '../services/statusbar/browser/statusbar.js';
import { ActionBar } from '../../base/browser/ui/actionbar/actionbar.js';
import { ThemeIcon } from '../../base/common/themables.js';
import { getWorkbenchContribution } from '../common/contributions.js';
import { DynamicWorkbenchSecurityConfiguration } from '../common/configuration.js';
import { nativeHoverDelegate } from '../../platform/hover/browser/hover.js';
import { WINDOW_ACTIVE_BORDER, WINDOW_INACTIVE_BORDER } from '../common/theme.js';
import { IContextMenuService } from '../../platform/contextview/browser/contextView.js';

export class NativeWindow extends BaseWindow {

	private readonly customTitleContextMenuDisposable = this._register(new DisposableStore());

	private readonly addRemoveFoldersScheduler = this._register(new RunOnceScheduler(() => this.doAddRemoveFolders(), 100));
	private pendingFoldersToAdd: URI[] = [];
	private pendingFoldersToRemove: URI[] = [];

	private isDocumentedEdited = false;

	constructor(
		@IEditorService private readonly editorService: IEditorService,
		@IEditorGroupsService private readonly editorGroupService: IEditorGroupsService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@ITitleService private readonly titleService: ITitleService,
		@IWorkbenchThemeService protected themeService: IWorkbenchThemeService,
		@INotificationService private readonly notificationService: INotificationService,
		@ICommandService private readonly commandService: ICommandService,
		@IKeybindingService private readonly keybindingService: IKeybindingService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IWorkspaceEditingService private readonly workspaceEditingService: IWorkspaceEditingService,
		@IFileService private readonly fileService: IFileService,
		@IMenuService private readonly menuService: IMenuService,
		@ILifecycleService private readonly lifecycleService: ILifecycleService,
		@IIntegrityService private readonly integrityService: IIntegrityService,
		@INativeWorkbenchEnvironmentService private readonly nativeEnvironmentService: INativeWorkbenchEnvironmentService,
		@IAccessibilityService private readonly accessibilityService: IAccessibilityService,
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService,
		@IOpenerService private readonly openerService: IOpenerService,
		@INativeHostService private readonly nativeHostService: INativeHostService,
		@ITunnelService private readonly tunnelService: ITunnelService,
		@IWorkbenchLayoutService layoutService: IWorkbenchLayoutService,
		@IWorkingCopyService private readonly workingCopyService: IWorkingCopyService,
		@IFilesConfigurationService private readonly filesConfigurationService: IFilesConfigurationService,
		@IProductService private readonly productService: IProductService,
		@IRemoteAuthorityResolverService private readonly remoteAuthorityResolverService: IRemoteAuthorityResolverService,
		@IDialogService private readonly dialogService: IDialogService,
		@IStorageService private readonly storageService: IStorageService,
		@ILogService private readonly logService: ILogService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@ISharedProcessService private readonly sharedProcessService: ISharedProcessService,
		@IProgressService private readonly progressService: IProgressService,
		@ILabelService private readonly labelService: ILabelService,
		@IBannerService private readonly bannerService: IBannerService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@IPreferencesService private readonly preferencesService: IPreferencesService,
		@IUtilityProcessWorkerWorkbenchService private readonly utilityProcessWorkerWorkbenchService: IUtilityProcessWorkerWorkbenchService,
		@IHostService hostService: IHostService,
		@IContextMenuService contextMenuService: IContextMenuService,
	) {
		super(mainWindow, undefined, hostService, nativeEnvironmentService, contextMenuService, layoutService);

		this.configuredWindowZoomLevel = this.resolveConfiguredWindowZoomLevel();

		this.registerListeners();
		this.create();
	}

	protected registerListeners(): void {

		// Layout
		this._register(addDisposableListener(mainWindow, EventType.RESIZE, () => this.layoutService.layout()));

		// React to editor input changes
		this._register(this.editorService.onDidActiveEditorChange(() => this.updateTouchbarMenu()));

		// Prevent opening a real URL inside the window
		for (const event of [EventType.DRAG_OVER, EventType.DROP]) {
			this._register(addDisposableListener(mainWindow.document.body, event, (e: DragEvent) => {
				EventHelper.stop(e);
			}));
		}

		// Support `runAction` event
		ipcRenderer.on('vscode:runAction', async (event: unknown, ...argsRaw: unknown[]) => {
			const request = argsRaw[0] as INativeRunActionInWindowRequest;
			const args: unknown[] = request.args || [];

			// If we run an action from the touchbar, we fill in the currently active resource
			// as payload because the touch bar items are context aware depending on the editor
			if (request.from === 'touchbar') {
				const activeEditor = this.editorService.activeEditor;
				if (activeEditor) {
					const resource = EditorResourceAccessor.getOriginalUri(activeEditor, { supportSideBySide: SideBySideEditor.PRIMARY });
					if (resource) {
						args.push(resource);
					}
				}
			} else {
				args.push({ from: request.from });
			}

			try {
				await this.commandService.executeCommand(request.id, ...args);

				this.telemetryService.publicLog2<WorkbenchActionExecutedEvent, WorkbenchActionExecutedClassification>('workbenchActionExecuted', { id: request.id, from: request.from });
			} catch (error) {
				this.notificationService.error(error);
			}
		});

		// Support runKeybinding event
		ipcRenderer.on('vscode:runKeybinding', (event: unknown, ...argsRaw: unknown[]) => {
			const request = argsRaw[0] as INativeRunKeybindingInWindowRequest;
			const activeElement = getActiveElement();
			if (activeElement) {
				this.keybindingService.dispatchByUserSettingsLabel(request.userSettingsLabel, activeElement);
			}
		});

		// Shared Process crash reported from main
		ipcRenderer.on('vscode:reportSharedProcessCrash', (event: unknown, ...argsRaw: unknown[]) => {
			this.notificationService.prompt(
				Severity.Error,
				localize('sharedProcessCrash', "A shared background process terminated unexpectedly. Please restart the application to recover."),
				[{
					label: localize('restart', "Restart"),
					run: () => this.nativeHostService.relaunch()
				}],
				{
					priority: NotificationPriority.URGENT
				}
			);
		});

		// Support openFiles event for existing and new files
		ipcRenderer.on('vscode:openFiles', (event: unknown, ...argsRaw: unknown[]) => { this.onOpenFiles(argsRaw[0] as IOpenFileRequest); });

		// Support addRemoveFolders event for workspace management
		ipcRenderer.on('vscode:addRemoveFolders', (event: unknown, ...argsRaw: unknown[]) => this.onAddRemoveFoldersRequest(argsRaw[0] as IAddRemoveFoldersRequest));

		// Message support
		ipcRenderer.on('vscode:showInfoMessage', (event: unknown, ...argsRaw: unknown[]) => this.notificationService.info(argsRaw[0] as string));

		// Shell Environment Issue Notifications
		ipcRenderer.on('vscode:showResolveShellEnvError', (event: unknown, ...argsRaw: unknown[]) => {
			const message = argsRaw[0] as string;
			this.notificationService.prompt(
				Severity.Error,
				message,
				[{
					label: localize('restart', "Restart"),
					run: () => this.nativeHostService.relaunch()
				},
				{
					label: localize('configure', "Configure"),
					run: () => this.preferencesService.openUserSettings({ query: 'application.shellEnvironmentResolutionTimeout' })
				},
				{
					label: localize('learnMore', "Learn More"),
					run: () => this.openerService.open('https://go.microsoft.com/fwlink/?linkid=2149667')
				}]
			);
		});

		ipcRenderer.on('vscode:showCredentialsError', (event: unknown, ...argsRaw: unknown[]) => {
			const message = argsRaw[0] as string;
			this.notificationService.prompt(
				Severity.Error,
				localize('keychainWriteError', "Writing login information to the keychain failed with error '{0}'.", message),
				[{
					label: localize('troubleshooting', "Troubleshooting Guide"),
					run: () => this.openerService.open('https://go.microsoft.com/fwlink/?linkid=2190713')
				}]
			);
		});

		ipcRenderer.on('vscode:showTranslatedBuildWarning', () => {
			this.notificationService.prompt(
				Severity.Warning,
				localize("runningTranslated", "You are running an emulated version of {0}. For better performance download the native arm64 version of {0} build for your machine.", this.productService.nameLong),
				[{
					label: localize('downloadArmBuild', "Download"),
					run: () => {
						const quality = this.productService.quality;
						const stableURL = 'https://code.visualstudio.com/docs/?dv=osx';
						const insidersURL = 'https://code.visualstudio.com/docs/?dv=osx&build=insiders';
						this.openerService.open(quality === 'stable' ? stableURL : insidersURL);
					}
				}],
				{
					priority: NotificationPriority.URGENT
				}
			);
		});

		ipcRenderer.on('vscode:showArgvParseWarning', () => {
			this.notificationService.prompt(
				Severity.Warning,
				localize("showArgvParseWarning", "The runtime arguments file 'argv.json' contains errors. Please correct them and restart."),
				[{
					label: localize('showArgvParseWarningAction', "Open File"),
					run: () => this.editorService.openEditor({ resource: this.nativeEnvironmentService.argvResource })
				}],
				{
					priority: NotificationPriority.URGENT
				}
			);
		});

		// Fullscreen Events
		ipcRenderer.on('vscode:enterFullScreen', () => setFullscreen(true, mainWindow));
		ipcRenderer.on('vscode:leaveFullScreen', () => setFullscreen(false, mainWindow));

		// Proxy Login Dialog
		ipcRenderer.on('vscode:openProxyAuthenticationDialog', async (event: unknown, ...argsRaw: unknown[]) => {
			const payload = argsRaw[0] as { authInfo: AuthInfo; username?: string; password?: string; replyChannel: string };
			const rememberCredentialsKey = 'window.rememberProxyCredentials';
			const rememberCredentials = this.storageService.getBoolean(rememberCredentialsKey, StorageScope.APPLICATION);
			const result = await this.dialogService.input({
				type: 'warning',
				message: localize('proxyAuthRequired', "Proxy Authentication Required"),
				primaryButton: localize({ key: 'loginButton', comment: ['&& denotes a mnemonic'] }, "&&Log In"),
				inputs:
					[
						{ placeholder: localize('username', "Username"), value: payload.username },
						{ placeholder: localize('password', "Password"), type: 'password', value: payload.password }
					],
				detail: localize('proxyDetail', "The proxy {0} requires a username and password.", `${payload.authInfo.host}:${payload.authInfo.port}`),
				checkbox: {
					label: localize('rememberCredentials', "Remember my credentials"),
					checked: rememberCredentials
				}
			});

			// Reply back to the channel without result to indicate
			// that the login dialog was cancelled
			if (!result.confirmed || !result.values) {
				ipcRenderer.send(payload.replyChannel);
			}

			// Other reply back with the picked credentials
			else {

				// Update state based on checkbox
				if (result.checkboxChecked) {
					this.storageService.store(rememberCredentialsKey, true, StorageScope.APPLICATION, StorageTarget.MACHINE);
				} else {
					this.storageService.remove(rememberCredentialsKey, StorageScope.APPLICATION);
				}

				// Reply back to main side with credentials
				const [username, password] = result.values;
				ipcRenderer.send(payload.replyChannel, { username, password, remember: !!result.checkboxChecked });
			}
		});

		// Accessibility support changed event
		ipcRenderer.on('vscode:accessibilitySupportChanged', (event: unknown, ...argsRaw: unknown[]) => {
			const accessibilitySupportEnabled = argsRaw[0] as boolean;
			this.accessibilityService.setAccessibilitySupport(accessibilitySupportEnabled ? AccessibilitySupport.Enabled : AccessibilitySupport.Disabled);
		});

		// Allow to update security settings around allowed UNC Host
		ipcRenderer.on('vscode:configureAllowedUNCHost', async (event: unknown, ...argsRaw: unknown[]) => {
			const host = argsRaw[0] as string;
			if (!isWindows) {
				return; // only supported on Windows
			}

			const allowedUncHosts = new Set<string>();

			const configuredAllowedUncHosts = this.configurationService.getValue<string[] | undefined>('security.allowedUNCHosts',) ?? [];
			if (Array.isArray(configuredAllowedUncHosts)) {
				for (const configuredAllowedUncHost of configuredAllowedUncHosts) {
					if (typeof configuredAllowedUncHost === 'string') {
						allowedUncHosts.add(configuredAllowedUncHost);
					}
				}
			}

			if (!allowedUncHosts.has(host)) {
				allowedUncHosts.add(host);

				await getWorkbenchContribution<DynamicWorkbenchSecurityConfiguration>(DynamicWorkbenchSecurityConfiguration.ID).ready; // ensure this setting is registered
				this.configurationService.updateValue('security.allowedUNCHosts', [...allowedUncHosts.values()], ConfigurationTarget.USER);
			}
		});

		// Allow to update security settings around protocol handlers
		ipcRenderer.on('vscode:disablePromptForProtocolHandling', (event: unknown, ...argsRaw: unknown[]) => {
			const kind = argsRaw[0] as 'local' | 'remote';
			const setting = kind === 'local' ? 'security.promptForLocalFileProtocolHandling' : 'security.promptForRemoteFileProtocolHandling';
			this.configurationService.updateValue(setting, false);
		});

		// Window Settings
		this._register(this.configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('window.zoomLevel') || (e.affectsConfiguration('window.zoomPerWindow') && this.configurationService.getValue('window.zoomPerWindow') === false)) {
				this.onDidChangeConfiguredWindowZoomLevel();
			} else if (e.affectsConfiguration('keyboard.touchbar.enabled') || e.affectsConfiguration('keyboard.touchbar.ignored')) {
				this.updateTouchbarMenu();
			} else if (e.affectsConfiguration('window.border')) {
				this.updateWindowBorder();
			}
		}));

		this._register(onDidChangeZoomLevel(targetWindowId => this.handleOnDidChangeZoomLevel(targetWindowId)));

		for (const part of this.editorGroupService.parts) {
			this.createWindowZoomStatusEntry(part);
		}

		this._register(this.editorGroupService.onDidCreateAuxiliaryEditorPart(part => this.createWindowZoomStatusEntry(part)));

		// Listen to visible editor changes (debounced in case a new editor opens immediately after)
		this._register(Event.debounce(this.editorService.onDidVisibleEditorsChange, () => undefined, 0, undefined, undefined, undefined, this._store)(() => this.maybeCloseWindow()));

		// Listen to editor closing (if we run with --wait)
		const filesToWait = this.nativeEnvironmentService.filesToWait;
		if (filesToWait) {
			this.trackClosedWaitFiles(filesToWait.waitMarkerFileUri, coalesce(filesToWait.paths.map(path => path.fileUri)));
		}

		// macOS OS integration: represented file name
		if (isMacintosh) {
			for (const part of this.editorGroupService.parts) {
				this.handleRepresentedFilename(part);
			}

			this._register(this.editorGroupService.onDidCreateAuxiliaryEditorPart(part => this.handleRepresentedFilename(part)));
		}

		// Document edited: indicate for dirty working copies
		this._register(this.workingCopyService.onDidChangeDirty(workingCopy => {
			const gotDirty = workingCopy.isDirty();
			if (gotDirty && !(workingCopy.capabilities & WorkingCopyCapabilities.Untitled) && this.filesConfigurationService.hasShortAutoSaveDelay(workingCopy.resource)) {
				return; // do not indicate dirty of working copies that are auto saved after short delay
			}

			this.updateDocumentEdited(gotDirty ? true : undefined);
		}));

		this.updateDocumentEdited(undefined);

		// Detect minimize / maximize
		this._register(Event.any(
			Event.map(Event.filter(this.nativeHostService.onDidMaximizeWindow, windowId => !!hasWindow(windowId)), windowId => ({ maximized: true, windowId })),
			Event.map(Event.filter(this.nativeHostService.onDidUnmaximizeWindow, windowId => !!hasWindow(windowId)), windowId => ({ maximized: false, windowId }))
		)(e => this.layoutService.updateWindowMaximizedState(getWindowById(e.windowId)!.window, e.maximized)));
		this.layoutService.updateWindowMaximizedState(mainWindow, this.nativeEnvironmentService.window.maximized ?? false);

		// Detect panel position to determine minimum width
		this._register(this.layoutService.onDidChangePanelPosition(pos => this.onDidChangePanelPosition(positionFromString(pos))));
		this.onDidChangePanelPosition(this.layoutService.getPanelPosition());

		// Border
		this._register(this.themeService.onDidColorThemeChange(() => this.updateWindowBorder()));
		this._register(this.hostService.onDidChangeActiveWindow(() => this.updateWindowBorder()));
		this._register(this.hostService.onDidChangeFocus(() => this.updateWindowBorder()));

		// Lifecycle
		this._register(this.lifecycleService.onBeforeShutdown(e => this.onBeforeShutdown(e)));
		this._register(this.lifecycleService.onBeforeShutdownError(e => this.onBeforeShutdownError(e)));
		this._register(this.lifecycleService.onWillShutdown(e => this.onWillShutdown(e)));
	}

	private handleRepresentedFilename(part: IEditorPart): void {
		const disposables = new DisposableStore();
		Event.once(part.onWillDispose)(() => disposables.dispose());

		this.editorGroupService.getScopedInstantiationService(part).invokeFunction(accessor => {
			const editorService = accessor.get(IEditorService);
			disposables.add(editorService.onDidActiveEditorChange(() => this.updateRepresentedFilename(editorService, part.windowId)));
		});
	}

	private updateRepresentedFilename(editorService: IEditorService, targetWindowId: number): void {
		const file = EditorResourceAccessor.getOriginalUri(editorService.activeEditor, { supportSideBySide: SideBySideEditor.PRIMARY, filterByScheme: Schemas.file });

		// Represented Filename
		this.nativeHostService.setRepresentedFilename(file?.fsPath ?? '', { targetWindowId });

		// Custom title menu (main window only currently)
		if (targetWindowId === mainWindow.vscodeWindowId) {
			this.provideCustomTitleContextMenu(file?.fsPath);
		}
	}

	//#region Window Lifecycle

	private onBeforeShutdown({ veto, reason }: BeforeShutdownEvent): void {
		if (reason === ShutdownReason.CLOSE) {
			const confirmBeforeCloseSetting = this.configurationService.getValue<'always' | 'never' | 'keyboardOnly'>('window.confirmBeforeClose');

			const confirmBeforeClose = confirmBeforeCloseSetting === 'always' || (confirmBeforeCloseSetting === 'keyboardOnly' && ModifierKeyEmitter.getInstance().isModifierPressed);
			if (confirmBeforeClose) {

				// When we need to confirm on close or quit, veto the shutdown
				// with a long running promise to figure out whether shutdown
				// can proceed or not.

				return veto((async () => {
					let actualReason: ShutdownReason = reason;
					if (reason === ShutdownReason.CLOSE && !isMacintosh) {
						const windowCount = await this.nativeHostService.getWindowCount();
						if (windowCount === 1) {
							actualReason = ShutdownReason.QUIT; // Windows/Linux: closing last window means to QUIT
						}
					}

					let confirmed = true;
					if (confirmBeforeClose) {
						confirmed = await this.instantiationService.invokeFunction(accessor => NativeWindow.confirmOnShutdown(accessor, actualReason));
					}

					// Progress for long running shutdown
					if (confirmed) {
						this.progressOnBeforeShutdown(reason);
					}

					return !confirmed;
				})(), 'veto.confirmBeforeClose');
			}
		}

		// Progress for long running shutdown
		this.progressOnBeforeShutdown(reason);
	}

	private progressOnBeforeShutdown(reason: ShutdownReason): void {
		this.progressService.withProgress({
			location: ProgressLocation.Window, 	// use window progress to not be too annoying about this operation
			delay: 800,							// delay so that it only appears when operation takes a long time
			title: this.toShutdownLabel(reason, false),
		}, () => {
			return Event.toPromise(Event.any(
				this.lifecycleService.onWillShutdown, 	// dismiss this dialog when we shutdown
				this.lifecycleService.onShutdownVeto, 	// or when shutdown was vetoed
				this.dialogService.onWillShowDialog		// or when a dialog asks for input
			));
		});
	}

	private onBeforeShutdownError({ error, reason }: BeforeShutdownErrorEvent): void {
		this.dialogService.error(this.toShutdownLabel(reason, true), localize('shutdownErrorDetail', "Error: {0}", toErrorMessage(error)));
	}

	private onWillShutdown({ reason, force, joiners }: WillShutdownEvent): void {

		// Delay so that the dialog only appears after timeout
		const shutdownDialogScheduler = new RunOnceScheduler(() => {
			const pendingJoiners = joiners();

			this.progressService.withProgress({
				location: ProgressLocation.Dialog, 				// use a dialog to prevent the user from making any more interactions now
				buttons: [this.toForceShutdownLabel(reason)],	// allow to force shutdown anyway
				cancellable: false,								// do not allow to cancel
				sticky: true,									// do not allow to dismiss
				title: this.toShutdownLabel(reason, false),
				detail: pendingJoiners.length > 0 ? localize('willShutdownDetail', "The following operations are still running: \n{0}", pendingJoiners.map(joiner => `- ${joiner.label}`).join('\n')) : undefined
			}, () => {
				return Event.toPromise(this.lifecycleService.onDidShutdown); // dismiss this dialog when we actually shutdown
			}, () => {
				force();
			});
		}, 1200);
		shutdownDialogScheduler.schedule();

		// Dispose scheduler when we actually shutdown
		Event.once(this.lifecycleService.onDidShutdown)(() => shutdownDialogScheduler.dispose());
	}

	private toShutdownLabel(reason: ShutdownReason, isError: boolean): string {
		if (isError) {
			switch (reason) {
				case ShutdownReason.CLOSE:
					return localize('shutdownErrorClose', "An unexpected error prevented the window to close");
				case ShutdownReason.QUIT:
					return localize('shutdownErrorQuit', "An unexpected error prevented the application to quit");
				case ShutdownReason.RELOAD:
					return localize('shutdownErrorReload', "An unexpected error prevented the window to reload");
				case ShutdownReason.LOAD:
					return localize('shutdownErrorLoad', "An unexpected error prevented to change the workspace");
			}
		}

		switch (reason) {
			case ShutdownReason.CLOSE:
				return localize('shutdownTitleClose', "Closing the window is taking a bit longer...");
			case ShutdownReason.QUIT:
				return localize('shutdownTitleQuit', "Quitting the application is taking a bit longer...");
			case ShutdownReason.RELOAD:
				return localize('shutdownTitleReload', "Reloading the window is taking a bit longer...");
			case ShutdownReason.LOAD:
				return localize('shutdownTitleLoad', "Changing the workspace is taking a bit longer...");
		}
	}

	private toForceShutdownLabel(reason: ShutdownReason): string {
		switch (reason) {
			case ShutdownReason.CLOSE:
				return localize('shutdownForceClose', "Close Anyway");
			case ShutdownReason.QUIT:
				return localize('shutdownForceQuit', "Quit Anyway");
			case ShutdownReason.RELOAD:
				return localize('shutdownForceReload', "Reload Anyway");
			case ShutdownReason.LOAD:
				return localize('shutdownForceLoad', "Change Anyway");
		}
	}

	//#endregion

	private updateDocumentEdited(documentEdited: true | undefined): void {
		let setDocumentEdited: boolean;
		if (typeof documentEdited === 'boolean') {
			setDocumentEdited = documentEdited;
		} else {
			setDocumentEdited = this.workingCopyService.hasDirty;
		}

		if ((!this.isDocumentedEdited && setDocumentEdited) || (this.isDocumentedEdited && !setDocumentEdited)) {
			this.isDocumentedEdited = setDocumentEdited;

			this.nativeHostService.setDocumentEdited(setDocumentEdited);
		}
	}

	private getWindowMinimumWidth(panelPosition: Position = this.layoutService.getPanelPosition()): number {

		// if panel is on the side, then return the larger minwidth
		const panelOnSide = panelPosition === Position.LEFT || panelPosition === Position.RIGHT;
		if (panelOnSide) {
			return WindowMinimumSize.WIDTH_WITH_VERTICAL_PANEL;
		}

		return WindowMinimumSize.WIDTH;
	}

	private onDidChangePanelPosition(pos: Position): void {
		const minWidth = this.getWindowMinimumWidth(pos);

		this.nativeHostService.setMinimumSize(minWidth, undefined);
	}

	private maybeCloseWindow(): void {
		const closeWhenEmpty = this.configurationService.getValue('window.closeWhenEmpty') || this.nativeEnvironmentService.args.wait;
		if (!closeWhenEmpty) {
			return; // return early if configured to not close when empty
		}

		// Close empty editor groups based on setting and environment
		for (const editorPart of this.editorGroupService.parts) {
			if (editorPart.groups.some(group => !group.isEmpty)) {
				continue; // not empty
			}

			if (editorPart === this.editorGroupService.mainPart && (
				this.contextService.getWorkbenchState() !== WorkbenchState.EMPTY ||	// only for empty windows
				this.environmentService.isExtensionDevelopment ||					// not when developing an extension
				this.editorService.visibleEditors.length > 0						// not when there are still editors open in other windows
			)) {
				continue;
			}

			if (editorPart === this.editorGroupService.mainPart) {
				this.nativeHostService.closeWindow();
			} else {
				editorPart.removeGroup(editorPart.activeGroup);
			}
		}
	}

	private provideCustomTitleContextMenu(filePath: string | undefined): void {

		// Clear old menu
		this.customTitleContextMenuDisposable.clear();

		// Only provide a menu when we have a file path and custom titlebar
		if (!filePath || hasNativeTitlebar(this.configurationService)) {
			return;
		}

		// Split up filepath into segments
		const segments = filePath.split(posix.sep);
		for (let i = segments.length; i > 0; i--) {
			const isFile = (i === segments.length);

			let pathOffset = i;
			if (!isFile) {
				pathOffset++; // for segments which are not the file name we want to open the folder
			}

			const path = URI.file(segments.slice(0, pathOffset).join(posix.sep));

			let label: string;
			if (!isFile) {
				label = this.labelService.getUriBasenameLabel(dirname(path));
			} else {
				label = this.labelService.getUriBasenameLabel(path);
			}

			const commandId = `workbench.action.revealPathInFinder${i}`;
			this.customTitleContextMenuDisposable.add(CommandsRegistry.registerCommand(commandId, () => this.nativeHostService.showItemInFolder(path.fsPath)));
			this.customTitleContextMenuDisposable.add(MenuRegistry.appendMenuItem(MenuId.TitleBarTitleContext, { command: { id: commandId, title: label || posix.sep }, order: -i, group: '1_file' }));
		}
	}

	protected create(): void {

		// Handle open calls
		this.setupOpenHandlers();

		// Notify some services about lifecycle phases
		this.lifecycleService.when(LifecyclePhase.Ready).then(() => this.nativeHostService.notifyReady());
		this.lifecycleService.when(LifecyclePhase.Restored).then(() => {
			this.sharedProcessService.notifyRestored();
			this.utilityProcessWorkerWorkbenchService.notifyRestored();
		});

		// Check for situations that are worth warning the user about
		this.handleWarnings();

		// Touchbar menu (if enabled)
		this.updateTouchbarMenu();

		// Window border
		this.updateWindowBorder();

		// Smoke Test Driver
		if (this.environmentService.enableSmokeTestDriver) {
			registerWindowDriver(this.instantiationService);
		}
	}

	private async handleWarnings(): Promise<void> {

		// After restored phase is fine for the following ones
		await this.lifecycleService.when(LifecyclePhase.Restored);

		// Integrity / Root warning
		(async () => {
			const isAdmin = await this.nativeHostService.isAdmin();
			const { isPure } = await this.integrityService.isPure();

			// Update to title
			this.titleService.updateProperties({ isPure, isAdmin });

			// Show warning message (unix only)
			if (isAdmin && !isWindows) {
				this.notificationService.warn(localize('runningAsRoot', "It is not recommended to run {0} as root user.", this.productService.nameShort));
			}
		})();

		// Installation Dir Warning
		if (this.environmentService.isBuilt && !this.environmentService.extensionDevelopmentLocationURI?.length) {
			let installLocationUri: URI;
			if (isMacintosh) {
				// appRoot = /Applications/Visual Studio Code - Insiders.app/Contents/Resources/app
				installLocationUri = dirname(dirname(dirname(URI.file(this.nativeEnvironmentService.appRoot))));
			} else {
				// appRoot = C:\Users\<name>\AppData\Local\Programs\Microsoft VS Code Insiders\resources\app
				// appRoot = /usr/share/code-insiders/resources/app
				installLocationUri = dirname(dirname(URI.file(this.nativeEnvironmentService.appRoot)));
			}

			for (const folder of this.contextService.getWorkspace().folders) {
				if (this.uriIdentityService.extUri.isEqualOrParent(folder.uri, installLocationUri)) {
					this.bannerService.show({
						id: 'appRootWarning.banner',
						message: localize('appRootWarning.banner', "Files you store within the installation folder ('{0}') may be OVERWRITTEN or DELETED IRREVERSIBLY without warning at update time.", this.labelService.getUriLabel(installLocationUri)),
						icon: Codicon.warning
					});

					break;
				}
			}
		}

		// macOS 11 warning
		if (isMacintosh) {
			const majorVersion = this.nativeEnvironmentService.os.release.split('.')[0];
			const eolReleases = new Map<string, string>([
				['20', 'macOS Big Sur'],
			]);

			if (eolReleases.has(majorVersion)) {
				const message = localize('macoseolmessage', "{0} on {1} will soon stop receiving updates. Consider upgrading your macOS version.", this.productService.nameLong, eolReleases.get(majorVersion));

				this.notificationService.prompt(
					Severity.Warning,
					message,
					[{
						label: localize('learnMore', "Learn More"),
						run: () => this.openerService.open(URI.parse('https://aka.ms/vscode-faq-old-macOS'))
					}],
					{
						neverShowAgain: { id: 'macoseol', isSecondary: true, scope: NeverShowAgainScope.APPLICATION },
						priority: NotificationPriority.URGENT,
						sticky: true
					}
				);
			}
		}

		// Slow shell environment progress indicator
		const shellEnv = process.shellEnv();
		this.progressService.withProgress({
			title: localize('resolveShellEnvironment', "Resolving shell environment..."),
			location: ProgressLocation.Window,
			delay: 1600,
			buttons: [localize('learnMore', "Learn More")]
		}, () => shellEnv, () => this.openerService.open('https://go.microsoft.com/fwlink/?linkid=2149667'));
	}

	async resolveExternalUri(uri: URI, options?: OpenOptions): Promise<IResolvedExternalUri | undefined> {
		let queryTunnel: RemoteTunnel | string | undefined;
		if (options?.allowTunneling) {
			const portMappingRequest = extractLocalHostUriMetaDataForPortMapping(uri);
			const queryPortMapping = extractQueryLocalHostUriMetaDataForPortMapping(uri);
			if (queryPortMapping) {
				queryTunnel = await this.openTunnel(queryPortMapping.address, queryPortMapping.port);
				if (queryTunnel && (typeof queryTunnel !== 'string')) {
					// If the tunnel was mapped to a different port, dispose it, because some services
					// validate the port number in the query string.
					if (queryTunnel.tunnelRemotePort !== queryPortMapping.port) {
						queryTunnel.dispose();
						queryTunnel = undefined;
					} else {
						if (!portMappingRequest) {
							const tunnel = queryTunnel;
							return {
								resolved: uri,
								dispose: () => tunnel.dispose()
							};
						}
					}
				}
			}

			if (portMappingRequest) {
				const tunnel = await this.openTunnel(portMappingRequest.address, portMappingRequest.port);
				if (tunnel && (typeof tunnel !== 'string')) {
					const addressAsUri = URI.parse(tunnel.localAddress).with({ path: uri.path });
					const resolved = addressAsUri.scheme.startsWith(uri.scheme) ? addressAsUri : uri.with({ authority: tunnel.localAddress });
					return {
						resolved,
						dispose() {
							tunnel.dispose();
							if (queryTunnel && (typeof queryTunnel !== 'string')) {
								queryTunnel.dispose();
							}
						}
					};
				}
			}
		}

		if (!options?.openExternal) {
			const canHandleResource = await this.fileService.canHandleResource(uri);
			if (canHandleResource) {
				return {
					resolved: URI.from({
						scheme: this.productService.urlProtocol,
						path: 'workspace',
						query: uri.toString()
					}),
					dispose() { }
				};
			}
		}

		return undefined;
	}

	private async openTunnel(address: string, port: number): Promise<RemoteTunnel | string | undefined> {
		const remoteAuthority = this.environmentService.remoteAuthority;
		const addressProvider: IAddressProvider | undefined = remoteAuthority ? {
			getAddress: async (): Promise<IAddress> => {
				return (await this.remoteAuthorityResolverService.resolveAuthority(remoteAuthority)).authority;
			}
		} : undefined;

		const tunnel = await this.tunnelService.getExistingTunnel(address, port);
		if (!tunnel || (typeof tunnel === 'string')) {
			return this.tunnelService.openTunnel(addressProvider, address, port);
		}

		return tunnel;
	}

	private setupOpenHandlers(): void {

		// Handle external open() calls
		this.openerService.setDefaultExternalOpener({
			openExternal: async (href: string) => {
				const success = await this.nativeHostService.openExternal(href, this.configurationService.getValue<string>('workbench.externalBrowser'));
				if (!success) {
					const fileCandidate = URI.parse(href);
					if (fileCandidate.scheme === Schemas.file) {
						// if opening failed, and this is a file, we can still try to reveal it
						await this.nativeHostService.showItemInFolder(fileCandidate.fsPath);
					}
				}

				return true;
			}
		});

		// Register external URI resolver
		this.openerService.registerExternalUriResolver({
			resolveExternalUri: async (uri: URI, options?: OpenOptions) => {
				return this.resolveExternalUri(uri, options);
			}
		});
	}

	//#region Touchbar

	private touchBarMenu: IMenu | undefined;
	private readonly touchBarDisposables = this._register(new DisposableStore());
	private lastInstalledTouchedBar: ICommandAction[][] | undefined;

	private updateTouchbarMenu(): void {
		if (!isMacintosh) {
			return; // macOS only
		}

		// Dispose old
		this.touchBarDisposables.clear();
		this.touchBarMenu = undefined;

		// Create new (delayed)
		const scheduler: RunOnceScheduler = this.touchBarDisposables.add(new RunOnceScheduler(() => this.doUpdateTouchbarMenu(scheduler), 300));
		scheduler.schedule();
	}

	private doUpdateTouchbarMenu(scheduler: RunOnceScheduler): void {
		if (!this.touchBarMenu) {
			const scopedContextKeyService = this.editorService.activeEditorPane?.scopedContextKeyService || this.editorGroupService.activeGroup.scopedContextKeyService;
			this.touchBarMenu = this.menuService.createMenu(MenuId.TouchBarContext, scopedContextKeyService);
			this.touchBarDisposables.add(this.touchBarMenu);
			this.touchBarDisposables.add(this.touchBarMenu.onDidChange(() => scheduler.schedule()));
		}

		const disabled = this.configurationService.getValue('keyboard.touchbar.enabled') === false;
		const touchbarIgnored = this.configurationService.getValue('keyboard.touchbar.ignored');
		const ignoredItems = Array.isArray(touchbarIgnored) ? touchbarIgnored : [];

		// Fill actions into groups respecting order
		const actions = getFlatActionBarActions(this.touchBarMenu.getActions());

		// Convert into command action multi array
		const items: ICommandAction[][] = [];
		let group: ICommandAction[] = [];
		if (!disabled) {
			for (const action of actions) {

				// Command
				if (action instanceof MenuItemAction) {
					if (ignoredItems.indexOf(action.item.id) >= 0) {
						continue; // ignored
					}

					group.push(action.item);
				}

				// Separator
				else if (action instanceof Separator) {
					if (group.length) {
						items.push(group);
					}

					group = [];
				}
			}

			if (group.length) {
				items.push(group);
			}
		}

		// Only update if the actions have changed
		if (!equals(this.lastInstalledTouchedBar, items)) {
			this.lastInstalledTouchedBar = items;
			this.nativeHostService.updateTouchBar(items);
		}
	}

	//#endregion

	//#region Window Border

	private updateWindowBorder(): void {
		if (!isWindows) {
			return; // windows only
		}

		const theme = this.themeService.getColorTheme();

		let activeBorder = theme.getColor(WINDOW_ACTIVE_BORDER)?.toString();
		let inactiveBorder = theme.getColor(WINDOW_INACTIVE_BORDER)?.toString();

		const borderSetting = this.configurationService.getValue<string>('window.border');
		if (borderSetting === 'off') {
			activeBorder = 'off';
			inactiveBorder = undefined;
		} else if (borderSetting === 'default') {
			activeBorder = activeBorder ?? 'default';
		} else if (borderSetting === 'system') {
			activeBorder = 'default';
			inactiveBorder = undefined;
		} else {
			activeBorder = borderSetting;
			inactiveBorder = undefined;
		}

		this.nativeHostService.updateWindowAccentColor(activeBorder, inactiveBorder);
	}

	//#endregion

	private onAddRemoveFoldersRequest(request: IAddRemoveFoldersRequest): void {

		// Buffer all pending requests
		this.pendingFoldersToAdd.push(...request.foldersToAdd.map(folder => URI.revive(folder)));
		this.pendingFoldersToRemove.push(...request.foldersToRemove.map(folder => URI.revive(folder)));

		// Delay the adding of folders a bit to buffer in case more requests are coming
		if (!this.addRemoveFoldersScheduler.isScheduled()) {
			this.addRemoveFoldersScheduler.schedule();
		}
	}

	private async doAddRemoveFolders(): Promise<void> {
		const foldersToAdd: IWorkspaceFolderCreationData[] = this.pendingFoldersToAdd.map(folder => ({ uri: folder }));
		const foldersToRemove = this.pendingFoldersToRemove.slice(0);

		this.pendingFoldersToAdd = [];
		this.pendingFoldersToRemove = [];

		if (foldersToAdd.length) {
			await this.workspaceEditingService.addFolders(foldersToAdd);
		}

		if (foldersToRemove.length) {
			await this.workspaceEditingService.removeFolders(foldersToRemove);
		}
	}

	private async onOpenFiles(request: INativeOpenFileRequest): Promise<void> {
		const diffMode = !!(request.filesToDiff && (request.filesToDiff.length === 2));
		const mergeMode = !!(request.filesToMerge && (request.filesToMerge.length === 4));

		const inputs = coalesce(await pathsToEditors(mergeMode ? request.filesToMerge : diffMode ? request.filesToDiff : request.filesToOpenOrCreate, this.fileService, this.logService));
		if (inputs.length) {
			const openedEditorPanes = await this.openResources(inputs, diffMode, mergeMode);

			if (request.filesToWait) {

				// In wait mode, listen to changes to the editors and wait until the files
				// are closed that the user wants to wait for. When this happens we delete
				// the wait marker file to signal to the outside that editing is done.
				// However, it is possible that opening of the editors failed, as such we
				// check for whether editor panes got opened and otherwise delete the marker
				// right away.

				if (openedEditorPanes.length) {
					return this.trackClosedWaitFiles(URI.revive(request.filesToWait.waitMarkerFileUri), coalesce(request.filesToWait.paths.map(path => URI.revive(path.fileUri))));
				} else {
					return this.fileService.del(URI.revive(request.filesToWait.waitMarkerFileUri));
				}
			}
		}
	}

	private async trackClosedWaitFiles(waitMarkerFile: URI, resourcesToWaitFor: URI[]): Promise<void> {

		// Wait for the resources to be closed in the text editor...
		await this.instantiationService.invokeFunction(accessor => whenEditorClosed(accessor, resourcesToWaitFor));

		// ...before deleting the wait marker file
		await this.fileService.del(waitMarkerFile);
	}

	private async openResources(resources: Array<IResourceEditorInput | IUntitledTextResourceEditorInput>, diffMode: boolean, mergeMode: boolean): Promise<readonly IEditorPane[]> {
		const editors: IUntypedEditorInput[] = [];

		if (mergeMode && isResourceEditorInput(resources[0]) && isResourceEditorInput(resources[1]) && isResourceEditorInput(resources[2]) && isResourceEditorInput(resources[3])) {
			const mergeEditor: IResourceMergeEditorInput = {
				input1: { resource: resources[0].resource },
				input2: { resource: resources[1].resource },
				base: { resource: resources[2].resource },
				result: { resource: resources[3].resource },
				options: { pinned: true }
			};
			editors.push(mergeEditor);
		} else if (diffMode && isResourceEditorInput(resources[0]) && isResourceEditorInput(resources[1])) {
			const diffEditor: IResourceDiffEditorInput = {
				original: { resource: resources[0].resource },
				modified: { resource: resources[1].resource },
				options: { pinned: true }
			};
			editors.push(diffEditor);
		} else {
			editors.push(...resources);
		}

		return this.editorService.openEditors(editors, undefined, { validateTrust: true });
	}

	//#region Window Zoom

	private readonly mapWindowIdToZoomStatusEntry = new Map<number, ZoomStatusEntry>();

	private configuredWindowZoomLevel: number;

	private resolveConfiguredWindowZoomLevel(): number {
		const windowZoomLevel = this.configurationService.getValue('window.zoomLevel');

		return typeof windowZoomLevel === 'number' ? windowZoomLevel : 0;
	}

	private handleOnDidChangeZoomLevel(targetWindowId: number): void {

		// Zoom status entry
		this.updateWindowZoomStatusEntry(targetWindowId);

		// Notify main process about a custom zoom level
		if (targetWindowId === mainWindow.vscodeWindowId) {
			const currentWindowZoomLevel = getZoomLevel(mainWindow);

			let notifyZoomLevel: number | undefined = undefined;
			if (this.configuredWindowZoomLevel !== currentWindowZoomLevel) {
				notifyZoomLevel = currentWindowZoomLevel;
			}

			ipcRenderer.invoke('vscode:notifyZoomLevel', notifyZoomLevel);
		}
	}

	private createWindowZoomStatusEntry(part: IEditorPart): void {
		const disposables = new DisposableStore();
		Event.once(part.onWillDispose)(() => disposables.dispose());

		const scopedInstantiationService = this.editorGroupService.getScopedInstantiationService(part);
		this.mapWindowIdToZoomStatusEntry.set(part.windowId, disposables.add(scopedInstantiationService.createInstance(ZoomStatusEntry)));
		disposables.add(toDisposable(() => this.mapWindowIdToZoomStatusEntry.delete(part.windowId)));

		this.updateWindowZoomStatusEntry(part.windowId);
	}

	private updateWindowZoomStatusEntry(targetWindowId: number): void {
		const targetWindow = getWindowById(targetWindowId);
		const entry = this.mapWindowIdToZoomStatusEntry.get(targetWindowId);
		if (entry && targetWindow) {
			const currentZoomLevel = getZoomLevel(targetWindow.window);

			let text: string | undefined = undefined;
			if (currentZoomLevel < this.configuredWindowZoomLevel) {
				text = '$(zoom-out)';
			} else if (currentZoomLevel > this.configuredWindowZoomLevel) {
				text = '$(zoom-in)';
			}

			entry.updateZoomEntry(text ?? false, targetWindowId);
		}
	}

	private onDidChangeConfiguredWindowZoomLevel(): void {
		this.configuredWindowZoomLevel = this.resolveConfiguredWindowZoomLevel();

		let applyZoomLevel = false;
		for (const { window } of getWindows()) {
			if (getZoomLevel(window) !== this.configuredWindowZoomLevel) {
				applyZoomLevel = true;
				break;
			}
		}

		if (applyZoomLevel) {
			applyZoom(this.configuredWindowZoomLevel, ApplyZoomTarget.ALL_WINDOWS);
		}

		for (const [windowId] of this.mapWindowIdToZoomStatusEntry) {
			this.updateWindowZoomStatusEntry(windowId);
		}
	}

	//#endregion

	override dispose(): void {
		super.dispose();

		for (const [, entry] of this.mapWindowIdToZoomStatusEntry) {
			entry.dispose();
		}
	}
}

class ZoomStatusEntry extends Disposable {

	private readonly disposable = this._register(new MutableDisposable<DisposableStore>());

	private zoomLevelLabel: Action | undefined = undefined;

	constructor(
		@IStatusbarService private readonly statusbarService: IStatusbarService,
		@ICommandService private readonly commandService: ICommandService,
		@IKeybindingService private readonly keybindingService: IKeybindingService
	) {
		super();
	}

	updateZoomEntry(visibleOrText: false | string, targetWindowId: number): void {
		if (typeof visibleOrText === 'string') {
			if (!this.disposable.value) {
				this.createZoomEntry(visibleOrText);
			}

			this.updateZoomLevelLabel(targetWindowId);
		} else {
			this.disposable.clear();
		}
	}

	private createZoomEntry(visibleOrText: string): void {
		const disposables = new DisposableStore();
		this.disposable.value = disposables;

		const container = $('.zoom-status');

		const left = $('.zoom-status-left');
		container.appendChild(left);

		const zoomOutAction: Action = disposables.add(new Action('workbench.action.zoomOut', localize('zoomOut', "Zoom Out"), ThemeIcon.asClassName(Codicon.remove), true, () => this.commandService.executeCommand(zoomOutAction.id)));
		const zoomInAction: Action = disposables.add(new Action('workbench.action.zoomIn', localize('zoomIn', "Zoom In"), ThemeIcon.asClassName(Codicon.plus), true, () => this.commandService.executeCommand(zoomInAction.id)));
		const zoomResetAction: Action = disposables.add(new Action('workbench.action.zoomReset', localize('zoomReset', "Reset"), undefined, true, () => this.commandService.executeCommand(zoomResetAction.id)));
		zoomResetAction.tooltip = localize('zoomResetLabel', "{0} ({1})", zoomResetAction.label, this.keybindingService.lookupKeybinding(zoomResetAction.id)?.getLabel());
		const zoomSettingsAction: Action = disposables.add(new Action('workbench.action.openSettings', localize('zoomSettings', "Settings"), ThemeIcon.asClassName(Codicon.settingsGear), true, () => this.commandService.executeCommand(zoomSettingsAction.id, 'window.zoom')));
		const zoomLevelLabel = disposables.add(new Action('zoomLabel', undefined, undefined, false));

		this.zoomLevelLabel = zoomLevelLabel;
		disposables.add(toDisposable(() => this.zoomLevelLabel = undefined));

		const actionBarLeft = disposables.add(new ActionBar(left, { hoverDelegate: nativeHoverDelegate }));
		actionBarLeft.push(zoomOutAction, { icon: true, label: false, keybinding: this.keybindingService.lookupKeybinding(zoomOutAction.id)?.getLabel() });
		actionBarLeft.push(this.zoomLevelLabel, { icon: false, label: true });
		actionBarLeft.push(zoomInAction, { icon: true, label: false, keybinding: this.keybindingService.lookupKeybinding(zoomInAction.id)?.getLabel() });

		const right = $('.zoom-status-right');
		container.appendChild(right);

		const actionBarRight = disposables.add(new ActionBar(right, { hoverDelegate: nativeHoverDelegate }));

		actionBarRight.push(zoomResetAction, { icon: false, label: true });
		actionBarRight.push(zoomSettingsAction, { icon: true, label: false, keybinding: this.keybindingService.lookupKeybinding(zoomSettingsAction.id)?.getLabel() });

		const name = localize('status.windowZoom', "Window Zoom");
		disposables.add(this.statusbarService.addEntry({
			name,
			text: visibleOrText,
			tooltip: container,
			ariaLabel: name,
			command: ShowTooltipCommand,
			kind: 'prominent'
		}, 'status.windowZoom', StatusbarAlignment.RIGHT, 102));
	}

	private updateZoomLevelLabel(targetWindowId: number): void {
		if (this.zoomLevelLabel) {
			const targetWindow = getWindowById(targetWindowId, true).window;
			const zoomFactor = Math.round(getZoomFactor(targetWindow) * 100);
			const zoomLevel = getZoomLevel(targetWindow);

			this.zoomLevelLabel.label = `${zoomLevel}`;
			this.zoomLevelLabel.tooltip = localize('zoomNumber', "Zoom Level: {0} ({1}%)", zoomLevel, zoomFactor);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/electron-browser/actions/developerActions.ts]---
Location: vscode-main/src/vs/workbench/electron-browser/actions/developerActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize, localize2 } from '../../../nls.js';
import { INativeHostService } from '../../../platform/native/common/native.js';
import { IEditorService } from '../../services/editor/common/editorService.js';
import { Action2, MenuId } from '../../../platform/actions/common/actions.js';
import { Categories } from '../../../platform/action/common/actionCommonCategories.js';
import { ServicesAccessor } from '../../../platform/instantiation/common/instantiation.js';
import { IWorkbenchEnvironmentService } from '../../services/environment/common/environmentService.js';
import { KeybindingWeight } from '../../../platform/keybinding/common/keybindingsRegistry.js';
import { IsDevelopmentContext } from '../../../platform/contextkey/common/contextkeys.js';
import { KeyCode, KeyMod } from '../../../base/common/keyCodes.js';
import { INativeWorkbenchEnvironmentService } from '../../services/environment/electron-browser/environmentService.js';
import { URI } from '../../../base/common/uri.js';
import { getActiveWindow } from '../../../base/browser/dom.js';
import { IDialogService } from '../../../platform/dialogs/common/dialogs.js';
import { INativeEnvironmentService } from '../../../platform/environment/common/environment.js';
import { IProgressService, ProgressLocation } from '../../../platform/progress/common/progress.js';

export class ToggleDevToolsAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.toggleDevTools',
			title: localize2('toggleDevTools', 'Toggle Developer Tools'),
			category: Categories.Developer,
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib + 50,
				when: IsDevelopmentContext,
				primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyI,
				mac: { primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.KeyI }
			},
			menu: {
				id: MenuId.MenubarHelpMenu,
				group: '5_tools',
				order: 1
			}
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const nativeHostService = accessor.get(INativeHostService);

		return nativeHostService.toggleDevTools({ targetWindowId: getActiveWindow().vscodeWindowId });
	}
}

export class ConfigureRuntimeArgumentsAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.configureRuntimeArguments',
			title: localize2('configureRuntimeArguments', 'Configure Runtime Arguments'),
			category: Categories.Preferences,
			f1: true
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const editorService = accessor.get(IEditorService);
		const environmentService = accessor.get(IWorkbenchEnvironmentService);

		await editorService.openEditor({
			resource: environmentService.argvResource,
			options: { pinned: true }
		});
	}
}

export class ReloadWindowWithExtensionsDisabledAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.reloadWindowWithExtensionsDisabled',
			title: localize2('reloadWindowWithExtensionsDisabled', 'Reload with Extensions Disabled'),
			category: Categories.Developer,
			f1: true
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		return accessor.get(INativeHostService).reload({ disableExtensions: true });
	}
}

export class OpenUserDataFolderAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.revealUserDataFolder',
			title: localize2('revealUserDataFolder', 'Reveal User Data Folder'),
			category: Categories.Developer,
			f1: true
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const nativeHostService = accessor.get(INativeHostService);
		const environmentService = accessor.get(INativeWorkbenchEnvironmentService);

		return nativeHostService.showItemInFolder(URI.file(environmentService.userDataPath).fsPath);
	}
}

export class ShowGPUInfoAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.showGPUInfo',
			title: localize2('showGPUInfo', 'Show GPU Info'),
			category: Categories.Developer,
			f1: true
		});
	}

	run(accessor: ServicesAccessor) {
		const nativeHostService = accessor.get(INativeHostService);
		nativeHostService.openGPUInfoWindow();
	}
}

export class ShowContentTracingAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.showContentTracing',
			title: localize2('showContentTracing', 'Show Content Tracing'),
			category: Categories.Developer,
			f1: true
		});
	}

	run(accessor: ServicesAccessor) {
		const nativeHostService = accessor.get(INativeHostService);
		nativeHostService.openContentTracingWindow();
	}
}

export class StopTracing extends Action2 {

	static readonly ID = 'workbench.action.stopTracing';

	constructor() {
		super({
			id: StopTracing.ID,
			title: localize2('stopTracing', 'Stop Tracing'),
			category: Categories.Developer,
			f1: true
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const environmentService = accessor.get(INativeEnvironmentService);
		const dialogService = accessor.get(IDialogService);
		const nativeHostService = accessor.get(INativeHostService);
		const progressService = accessor.get(IProgressService);

		if (!environmentService.args.trace) {
			const { confirmed } = await dialogService.confirm({
				message: localize('stopTracing.message', "Tracing requires to launch with a '--trace' argument"),
				primaryButton: localize({ key: 'stopTracing.button', comment: ['&& denotes a mnemonic'] }, "&&Relaunch and Enable Tracing"),
			});

			if (confirmed) {
				return nativeHostService.relaunch({ addArgs: ['--trace'] });
			}
		}

		await progressService.withProgress({
			location: ProgressLocation.Dialog,
			title: localize('stopTracing.title', "Creating trace file..."),
			cancellable: false,
			detail: localize('stopTracing.detail', "This can take up to one minute to complete.")
		}, () => nativeHostService.stopTracing());
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/electron-browser/actions/installActions.ts]---
Location: vscode-main/src/vs/workbench/electron-browser/actions/installActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize, localize2 } from '../../../nls.js';
import { Action2 } from '../../../platform/actions/common/actions.js';
import { ILocalizedString } from '../../../platform/action/common/action.js';
import product from '../../../platform/product/common/product.js';
import { IDialogService } from '../../../platform/dialogs/common/dialogs.js';
import { ServicesAccessor } from '../../../platform/instantiation/common/instantiation.js';
import { INativeHostService } from '../../../platform/native/common/native.js';
import { toErrorMessage } from '../../../base/common/errorMessage.js';
import { IProductService } from '../../../platform/product/common/productService.js';
import { isCancellationError } from '../../../base/common/errors.js';

const shellCommandCategory: ILocalizedString = localize2('shellCommand', 'Shell Command');

export class InstallShellScriptAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.installCommandLine',
			title: localize2('install', "Install '{0}' command in PATH", product.applicationName),
			category: shellCommandCategory,
			f1: true
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const nativeHostService = accessor.get(INativeHostService);
		const dialogService = accessor.get(IDialogService);
		const productService = accessor.get(IProductService);

		try {
			await nativeHostService.installShellCommand();

			dialogService.info(localize('successIn', "Shell command '{0}' successfully installed in PATH.", productService.applicationName));
		} catch (error) {
			if (isCancellationError(error)) {
				return;
			}

			dialogService.error(toErrorMessage(error));
		}
	}
}

export class UninstallShellScriptAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.uninstallCommandLine',
			title: localize2('uninstall', "Uninstall '{0}' command from PATH", product.applicationName),
			category: shellCommandCategory,
			f1: true
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const nativeHostService = accessor.get(INativeHostService);
		const dialogService = accessor.get(IDialogService);
		const productService = accessor.get(IProductService);

		try {
			await nativeHostService.uninstallShellCommand();

			dialogService.info(localize('successFrom', "Shell command '{0}' successfully uninstalled from PATH.", productService.applicationName));
		} catch (error) {
			if (isCancellationError(error)) {
				return;
			}

			dialogService.error(toErrorMessage(error));
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/electron-browser/actions/windowActions.ts]---
Location: vscode-main/src/vs/workbench/electron-browser/actions/windowActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/actions.css';
import { URI } from '../../../base/common/uri.js';
import { localize, localize2 } from '../../../nls.js';
import { ApplyZoomTarget, MAX_ZOOM_LEVEL, MIN_ZOOM_LEVEL, applyZoom } from '../../../platform/window/electron-browser/window.js';
import { IKeybindingService } from '../../../platform/keybinding/common/keybinding.js';
import { getZoomLevel } from '../../../base/browser/browser.js';
import { FileKind } from '../../../platform/files/common/files.js';
import { IModelService } from '../../../editor/common/services/model.js';
import { ILanguageService } from '../../../editor/common/languages/language.js';
import { IQuickInputService, IQuickInputButton, IQuickPickItem, QuickPickInput } from '../../../platform/quickinput/common/quickInput.js';
import { getIconClasses } from '../../../editor/common/services/getIconClasses.js';
import { ICommandHandler } from '../../../platform/commands/common/commands.js';
import { ServicesAccessor } from '../../../platform/instantiation/common/instantiation.js';
import { IConfigurationService } from '../../../platform/configuration/common/configuration.js';
import { INativeHostService } from '../../../platform/native/common/native.js';
import { Codicon } from '../../../base/common/codicons.js';
import { ThemeIcon } from '../../../base/common/themables.js';
import { isSingleFolderWorkspaceIdentifier, isWorkspaceIdentifier } from '../../../platform/workspace/common/workspace.js';
import { Action2, MenuId } from '../../../platform/actions/common/actions.js';
import { Categories } from '../../../platform/action/common/actionCommonCategories.js';
import { KeyCode, KeyMod } from '../../../base/common/keyCodes.js';
import { KeybindingWeight } from '../../../platform/keybinding/common/keybindingsRegistry.js';
import { isMacintosh } from '../../../base/common/platform.js';
import { getActiveWindow } from '../../../base/browser/dom.js';
import { IOpenedAuxiliaryWindow, IOpenedMainWindow, isOpenedAuxiliaryWindow } from '../../../platform/window/common/window.js';
import { IsAuxiliaryWindowContext, IsAuxiliaryWindowFocusedContext, IsWindowAlwaysOnTopContext } from '../../common/contextkeys.js';
import { isAuxiliaryWindow } from '../../../base/browser/window.js';
import { ContextKeyExpr } from '../../../platform/contextkey/common/contextkey.js';

export class CloseWindowAction extends Action2 {

	static readonly ID = 'workbench.action.closeWindow';

	constructor() {
		super({
			id: CloseWindowAction.ID,
			title: {
				...localize2('closeWindow', "Close Window"),
				mnemonicTitle: localize({ key: 'miCloseWindow', comment: ['&& denotes a mnemonic'] }, "Clos&&e Window"),
			},
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				mac: { primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyW },
				linux: { primary: KeyMod.Alt | KeyCode.F4, secondary: [KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyW] },
				win: { primary: KeyMod.Alt | KeyCode.F4, secondary: [KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyW] }
			},
			menu: {
				id: MenuId.MenubarFileMenu,
				group: '6_close',
				order: 4
			}
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const nativeHostService = accessor.get(INativeHostService);

		return nativeHostService.closeWindow({ targetWindowId: getActiveWindow().vscodeWindowId });
	}
}

export class CloseOtherWindowsAction extends Action2 {

	private static readonly ID = 'workbench.action.closeOtherWindows';

	constructor() {
		super({
			id: CloseOtherWindowsAction.ID,
			title: localize2('closeOtherWindows', "Close Other Windows"),
			f1: true
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const nativeHostService = accessor.get(INativeHostService);

		const currentWindowId = getActiveWindow().vscodeWindowId;
		const windows = await nativeHostService.getWindows({ includeAuxiliaryWindows: false });

		for (const window of windows) {
			if (window.id !== currentWindowId) {
				nativeHostService.closeWindow({ targetWindowId: window.id });
			}
		}
	}
}

abstract class BaseZoomAction extends Action2 {

	private static readonly ZOOM_LEVEL_SETTING_KEY = 'window.zoomLevel';
	private static readonly ZOOM_PER_WINDOW_SETTING_KEY = 'window.zoomPerWindow';

	protected async setZoomLevel(accessor: ServicesAccessor, levelOrReset: number | true): Promise<void> {
		const configurationService = accessor.get(IConfigurationService);

		let target: ApplyZoomTarget;
		if (configurationService.getValue(BaseZoomAction.ZOOM_PER_WINDOW_SETTING_KEY) !== false) {
			target = ApplyZoomTarget.ACTIVE_WINDOW;
		} else {
			target = ApplyZoomTarget.ALL_WINDOWS;
		}

		let level: number;
		if (typeof levelOrReset === 'number') {
			level = Math.round(levelOrReset); // prevent fractional zoom levels
		} else {

			// reset to 0 when we apply to all windows
			if (target === ApplyZoomTarget.ALL_WINDOWS) {
				level = 0;
			}

			// otherwise, reset to the default zoom level
			else {
				const defaultLevel = configurationService.getValue(BaseZoomAction.ZOOM_LEVEL_SETTING_KEY);
				if (typeof defaultLevel === 'number') {
					level = defaultLevel;
				} else {
					level = 0;
				}
			}
		}

		if (level > MAX_ZOOM_LEVEL || level < MIN_ZOOM_LEVEL) {
			return; // https://github.com/microsoft/vscode/issues/48357
		}

		if (target === ApplyZoomTarget.ALL_WINDOWS) {
			await configurationService.updateValue(BaseZoomAction.ZOOM_LEVEL_SETTING_KEY, level);
		}

		applyZoom(level, target);
	}
}

export class ZoomInAction extends BaseZoomAction {

	constructor() {
		super({
			id: 'workbench.action.zoomIn',
			title: {
				...localize2('zoomIn', "Zoom In"),
				mnemonicTitle: localize({ key: 'miZoomIn', comment: ['&& denotes a mnemonic'] }, "&&Zoom In"),
			},
			category: Categories.View,
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.CtrlCmd | KeyCode.Equal,
				secondary: [KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.Equal, KeyMod.CtrlCmd | KeyCode.NumpadAdd]
			},
			menu: {
				id: MenuId.MenubarAppearanceMenu,
				group: '5_zoom',
				order: 1
			}
		});
	}

	override run(accessor: ServicesAccessor): Promise<void> {
		return super.setZoomLevel(accessor, getZoomLevel(getActiveWindow()) + 1);
	}
}

export class ZoomOutAction extends BaseZoomAction {

	constructor() {
		super({
			id: 'workbench.action.zoomOut',
			title: {
				...localize2('zoomOut', "Zoom Out"),
				mnemonicTitle: localize({ key: 'miZoomOut', comment: ['&& denotes a mnemonic'] }, "&&Zoom Out"),
			},
			category: Categories.View,
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.CtrlCmd | KeyCode.Minus,
				secondary: [KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.Minus, KeyMod.CtrlCmd | KeyCode.NumpadSubtract],
				linux: {
					primary: KeyMod.CtrlCmd | KeyCode.Minus,
					secondary: [KeyMod.CtrlCmd | KeyCode.NumpadSubtract]
				}
			},
			menu: {
				id: MenuId.MenubarAppearanceMenu,
				group: '5_zoom',
				order: 2
			}
		});
	}

	override run(accessor: ServicesAccessor): Promise<void> {
		return super.setZoomLevel(accessor, getZoomLevel(getActiveWindow()) - 1);
	}
}

export class ZoomResetAction extends BaseZoomAction {

	constructor() {
		super({
			id: 'workbench.action.zoomReset',
			title: {
				...localize2('zoomReset', "Reset Zoom"),
				mnemonicTitle: localize({ key: 'miZoomReset', comment: ['&& denotes a mnemonic'] }, "&&Reset Zoom"),
			},
			category: Categories.View,
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.CtrlCmd | KeyCode.Numpad0
			},
			menu: {
				id: MenuId.MenubarAppearanceMenu,
				group: '5_zoom',
				order: 3
			}
		});
	}

	override run(accessor: ServicesAccessor): Promise<void> {
		return super.setZoomLevel(accessor, true);
	}
}

abstract class BaseSwitchWindow extends Action2 {

	private readonly closeWindowAction: IQuickInputButton = {
		iconClass: ThemeIcon.asClassName(Codicon.removeClose),
		tooltip: localize('close', "Close Window")
	};

	private readonly closeDirtyWindowAction: IQuickInputButton = {
		iconClass: 'dirty-window ' + ThemeIcon.asClassName(Codicon.closeDirty),
		tooltip: localize('close', "Close Window"),
		alwaysVisible: true
	};

	private readonly closeActiveWindowAction: IQuickInputButton = {
		iconClass: 'active-window ' + ThemeIcon.asClassName(Codicon.windowActive),
		tooltip: localize('closeActive', "Close Active Window"),
		alwaysVisible: true
	};

	protected abstract isQuickNavigate(): boolean;

	override async run(accessor: ServicesAccessor): Promise<void> {
		const quickInputService = accessor.get(IQuickInputService);
		const keybindingService = accessor.get(IKeybindingService);
		const modelService = accessor.get(IModelService);
		const languageService = accessor.get(ILanguageService);
		const nativeHostService = accessor.get(INativeHostService);

		const currentWindowId = getActiveWindow().vscodeWindowId;

		const windows = await nativeHostService.getWindows({ includeAuxiliaryWindows: true });

		const mainWindows = new Set<IOpenedMainWindow>();
		const mapMainWindowToAuxiliaryWindows = new Map<number, Set<IOpenedAuxiliaryWindow>>();
		for (const window of windows) {
			if (isOpenedAuxiliaryWindow(window)) {
				let auxiliaryWindows = mapMainWindowToAuxiliaryWindows.get(window.parentId);
				if (!auxiliaryWindows) {
					auxiliaryWindows = new Set<IOpenedAuxiliaryWindow>();
					mapMainWindowToAuxiliaryWindows.set(window.parentId, auxiliaryWindows);
				}
				auxiliaryWindows.add(window);
			} else {
				mainWindows.add(window);
			}
		}

		interface IWindowPickItem extends IQuickPickItem {
			readonly windowId: number;
		}

		function isWindowPickItem(candidate: unknown): candidate is IWindowPickItem {
			const windowPickItem = candidate as IWindowPickItem | undefined;

			return typeof windowPickItem?.windowId === 'number';
		}

		const picks: Array<QuickPickInput<IWindowPickItem>> = [];
		for (const window of mainWindows) {
			const auxiliaryWindows = mapMainWindowToAuxiliaryWindows.get(window.id);
			if (mapMainWindowToAuxiliaryWindows.size > 0) {
				picks.push({ type: 'separator', label: auxiliaryWindows ? localize('windowGroup', "window group") : undefined });
			}

			const resource = window.filename ? URI.file(window.filename) : isSingleFolderWorkspaceIdentifier(window.workspace) ? window.workspace.uri : isWorkspaceIdentifier(window.workspace) ? window.workspace.configPath : undefined;
			const fileKind = window.filename ? FileKind.FILE : isSingleFolderWorkspaceIdentifier(window.workspace) ? FileKind.FOLDER : isWorkspaceIdentifier(window.workspace) ? FileKind.ROOT_FOLDER : FileKind.FILE;
			const pick: IWindowPickItem = {
				windowId: window.id,
				label: window.title,
				ariaLabel: window.dirty ? localize('windowDirtyAriaLabel', "{0}, window with unsaved changes", window.title) : window.title,
				iconClasses: getIconClasses(modelService, languageService, resource, fileKind),
				description: (currentWindowId === window.id) ? localize('current', "Current Window") : undefined,
				buttons: window.dirty ? [this.closeDirtyWindowAction] : currentWindowId === window.id ? [this.closeActiveWindowAction] : [this.closeWindowAction]
			};
			picks.push(pick);

			if (auxiliaryWindows) {
				for (const auxiliaryWindow of auxiliaryWindows) {
					const pick: IWindowPickItem = {
						windowId: auxiliaryWindow.id,
						label: auxiliaryWindow.title,
						iconClasses: getIconClasses(modelService, languageService, auxiliaryWindow.filename ? URI.file(auxiliaryWindow.filename) : undefined, FileKind.FILE),
						description: (currentWindowId === auxiliaryWindow.id) ? localize('current', "Current Window") : undefined,
						buttons: currentWindowId === auxiliaryWindow.id ? [this.closeActiveWindowAction] : [this.closeWindowAction]
					};
					picks.push(pick);
				}
			}
		}

		const pick = await quickInputService.pick(picks, {
			contextKey: 'inWindowsPicker',
			activeItem: (() => {
				for (let i = 0; i < picks.length; i++) {
					const pick = picks[i];
					if (isWindowPickItem(pick) && pick.windowId === currentWindowId) {
						let nextPick = picks[i + 1]; // try to select next window unless it's a separator
						if (isWindowPickItem(nextPick)) {
							return nextPick;
						}

						nextPick = picks[i + 2]; // otherwise try to select the next window after the separator
						if (isWindowPickItem(nextPick)) {
							return nextPick;
						}
					}
				}

				return undefined;
			})(),
			placeHolder: localize('switchWindowPlaceHolder', "Select a window to switch to"),
			quickNavigate: this.isQuickNavigate() ? { keybindings: keybindingService.lookupKeybindings(this.desc.id) } : undefined,
			hideInput: this.isQuickNavigate(),
			onDidTriggerItemButton: async context => {
				await nativeHostService.closeWindow({ targetWindowId: context.item.windowId });
				context.removeItem();
			}
		});

		if (pick) {
			nativeHostService.focusWindow({ targetWindowId: pick.windowId });
		}
	}
}

export class SwitchWindowAction extends BaseSwitchWindow {

	constructor() {
		super({
			id: 'workbench.action.switchWindow',
			title: localize2('switchWindow', 'Switch Window...'),
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: 0,
				mac: { primary: KeyMod.WinCtrl | KeyCode.KeyW }
			}
		});
	}

	protected isQuickNavigate(): boolean {
		return false;
	}
}

export class QuickSwitchWindowAction extends BaseSwitchWindow {

	constructor() {
		super({
			id: 'workbench.action.quickSwitchWindow',
			title: localize2('quickSwitchWindow', 'Quick Switch Window...'),
			f1: false // hide quick pickers from command palette to not confuse with the other entry that shows a input field
		});
	}

	protected isQuickNavigate(): boolean {
		return true;
	}
}

function canRunNativeTabsHandler(accessor: ServicesAccessor): boolean {
	if (!isMacintosh) {
		return false;
	}

	const configurationService = accessor.get(IConfigurationService);
	return configurationService.getValue<unknown>('window.nativeTabs') === true;
}

export const NewWindowTabHandler: ICommandHandler = function (accessor: ServicesAccessor) {
	if (!canRunNativeTabsHandler(accessor)) {
		return;
	}

	return accessor.get(INativeHostService).newWindowTab();
};

export const ShowPreviousWindowTabHandler: ICommandHandler = function (accessor: ServicesAccessor) {
	if (!canRunNativeTabsHandler(accessor)) {
		return;
	}

	return accessor.get(INativeHostService).showPreviousWindowTab();
};

export const ShowNextWindowTabHandler: ICommandHandler = function (accessor: ServicesAccessor) {
	if (!canRunNativeTabsHandler(accessor)) {
		return;
	}

	return accessor.get(INativeHostService).showNextWindowTab();
};

export const MoveWindowTabToNewWindowHandler: ICommandHandler = function (accessor: ServicesAccessor) {
	if (!canRunNativeTabsHandler(accessor)) {
		return;
	}

	return accessor.get(INativeHostService).moveWindowTabToNewWindow();
};

export const MergeWindowTabsHandlerHandler: ICommandHandler = function (accessor: ServicesAccessor) {
	if (!canRunNativeTabsHandler(accessor)) {
		return;
	}

	return accessor.get(INativeHostService).mergeAllWindowTabs();
};

export const ToggleWindowTabsBarHandler: ICommandHandler = function (accessor: ServicesAccessor) {
	if (!canRunNativeTabsHandler(accessor)) {
		return;
	}

	return accessor.get(INativeHostService).toggleWindowTabsBar();
};

export class ToggleWindowAlwaysOnTopAction extends Action2 {

	static readonly ID = 'workbench.action.toggleWindowAlwaysOnTop';

	constructor() {
		super({
			id: ToggleWindowAlwaysOnTopAction.ID,
			title: localize2('toggleWindowAlwaysOnTop', "Toggle Window Always on Top"),
			f1: true,
			precondition: IsAuxiliaryWindowFocusedContext
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const nativeHostService = accessor.get(INativeHostService);

		const targetWindow = getActiveWindow();
		if (!isAuxiliaryWindow(targetWindow.window)) {
			return; // Currently, we only support toggling always on top for auxiliary windows
		}

		return nativeHostService.toggleWindowAlwaysOnTop({ targetWindowId: getActiveWindow().vscodeWindowId });
	}
}

export class EnableWindowAlwaysOnTopAction extends Action2 {

	static readonly ID = 'workbench.action.enableWindowAlwaysOnTop';

	constructor() {
		super({
			id: EnableWindowAlwaysOnTopAction.ID,
			title: localize('enableWindowAlwaysOnTop', "Turn On Always on Top"),
			icon: Codicon.pin,
			menu: {
				id: MenuId.LayoutControlMenu,
				when: ContextKeyExpr.and(IsWindowAlwaysOnTopContext.toNegated(), IsAuxiliaryWindowContext),
				order: 1
			}
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const nativeHostService = accessor.get(INativeHostService);

		const targetWindow = getActiveWindow();
		if (!isAuxiliaryWindow(targetWindow.window)) {
			return; // Currently, we only support toggling always on top for auxiliary windows
		}

		return nativeHostService.setWindowAlwaysOnTop(true, { targetWindowId: targetWindow.vscodeWindowId });
	}
}

export class DisableWindowAlwaysOnTopAction extends Action2 {

	static readonly ID = 'workbench.action.disableWindowAlwaysOnTop';

	constructor() {
		super({
			id: DisableWindowAlwaysOnTopAction.ID,
			title: localize('disableWindowAlwaysOnTop', "Turn Off Always on Top"),
			icon: Codicon.pinned,
			menu: {
				id: MenuId.LayoutControlMenu,
				when: ContextKeyExpr.and(IsWindowAlwaysOnTopContext, IsAuxiliaryWindowContext),
				order: 1
			}
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const nativeHostService = accessor.get(INativeHostService);

		const targetWindow = getActiveWindow();
		if (!isAuxiliaryWindow(targetWindow.window)) {
			return; // Currently, we only support toggling always on top for auxiliary windows
		}

		return nativeHostService.setWindowAlwaysOnTop(false, { targetWindowId: targetWindow.vscodeWindowId });
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/electron-browser/actions/media/actions.css]---
Location: vscode-main/src/vs/workbench/electron-browser/actions/media/actions.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-workbench .quick-input-list .quick-input-list-entry.has-actions:hover .quick-input-list-entry-action-bar .action-label.dirty-window::before,
.monaco-workbench .quick-input-list .quick-input-list-entry.has-actions:hover .quick-input-list-entry-action-bar .action-label.active-window::before {
	/* Close icon flips between black dot and "X" for dirty open editors and active window */
	content: var(--vscode-icon-x-content);
	font-family: var(--vscode-icon-x-font-family);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/electron-browser/media/window.css]---
Location: vscode-main/src/vs/workbench/electron-browser/media/window.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-workbench .zoom-status {
	display: flex;
}

.monaco-workbench .zoom-status .monaco-action-bar .action-label.codicon::before {
	/*
	 * the hover sets font-size: inherit which makes actions
	 * have a size of 13px. but codicons have a size of 16px
	 * so we want to ensure the icon is still centered
	 */
	margin: auto;
}

.monaco-workbench .zoom-status > .zoom-status-left {
	display: flex;
}

.monaco-workbench .zoom-status > .zoom-status-left .monaco-action-bar .action-label.disabled,
.monaco-workbench .zoom-status > .zoom-status-left .monaco-action-bar .action-label.disabled:hover {
	/*
	 * we use a disabled action as label for the zoom level
	 * so we override the style to not show it disabled
	 */
	opacity: 1;
	color: unset;
}

.monaco-workbench .zoom-status > .zoom-status-right {
	display: flex;
	margin-left: 10px;
}

.monaco-workbench .zoom-status > .zoom-status-right .monaco-action-bar .action-label {
	color: unset;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/electron-browser/parts/dialogs/dialog.contribution.ts]---
Location: vscode-main/src/vs/workbench/electron-browser/parts/dialogs/dialog.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IDialogHandler, IDialogResult, IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { ILayoutService } from '../../../../platform/layout/browser/layoutService.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { INativeHostService } from '../../../../platform/native/common/native.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { IWorkbenchContribution, WorkbenchPhase, registerWorkbenchContribution2 } from '../../../common/contributions.js';
import { IDialogsModel, IDialogViewItem } from '../../../common/dialogs.js';
import { BrowserDialogHandler } from '../../../browser/parts/dialogs/dialogHandler.js';
import { NativeDialogHandler } from './dialogHandler.js';
import { DialogService } from '../../../services/dialogs/common/dialogService.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { Lazy } from '../../../../base/common/lazy.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { createNativeAboutDialogDetails } from '../../../../platform/dialogs/electron-browser/dialog.js';
import { IWorkbenchEnvironmentService } from '../../../services/environment/common/environmentService.js';
import { IMarkdownRendererService } from '../../../../platform/markdown/browser/markdownRenderer.js';

export class DialogHandlerContribution extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.dialogHandler';

	private nativeImpl: Lazy<IDialogHandler>;
	private browserImpl: Lazy<IDialogHandler>;

	private model: IDialogsModel;
	private currentDialog: IDialogViewItem | undefined;

	constructor(
		@IConfigurationService private configurationService: IConfigurationService,
		@IDialogService private dialogService: IDialogService,
		@ILogService logService: ILogService,
		@ILayoutService layoutService: ILayoutService,
		@IKeybindingService keybindingService: IKeybindingService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IProductService private productService: IProductService,
		@IClipboardService clipboardService: IClipboardService,
		@INativeHostService private nativeHostService: INativeHostService,
		@IWorkbenchEnvironmentService private environmentService: IWorkbenchEnvironmentService,
		@IOpenerService openerService: IOpenerService,
		@IMarkdownRendererService markdownRendererService: IMarkdownRendererService,
	) {
		super();

		this.browserImpl = new Lazy(() => new BrowserDialogHandler(logService, layoutService, keybindingService, instantiationService, clipboardService, openerService, markdownRendererService));
		this.nativeImpl = new Lazy(() => new NativeDialogHandler(logService, nativeHostService, clipboardService));

		this.model = (this.dialogService as DialogService).model;

		this._register(this.model.onWillShowDialog(() => {
			if (!this.currentDialog) {
				this.processDialogs();
			}
		}));

		this.processDialogs();
	}

	private async processDialogs(): Promise<void> {
		while (this.model.dialogs.length) {
			this.currentDialog = this.model.dialogs[0];

			let result: IDialogResult | Error | undefined = undefined;
			try {

				// Confirm
				if (this.currentDialog.args.confirmArgs) {
					const args = this.currentDialog.args.confirmArgs;
					result = (this.useCustomDialog || args?.confirmation.custom) ?
						await this.browserImpl.value.confirm(args.confirmation) :
						await this.nativeImpl.value.confirm(args.confirmation);
				}

				// Input (custom only)
				else if (this.currentDialog.args.inputArgs) {
					const args = this.currentDialog.args.inputArgs;
					result = await this.browserImpl.value.input(args.input);
				}

				// Prompt
				else if (this.currentDialog.args.promptArgs) {
					const args = this.currentDialog.args.promptArgs;
					result = (this.useCustomDialog || args?.prompt.custom) ?
						await this.browserImpl.value.prompt(args.prompt) :
						await this.nativeImpl.value.prompt(args.prompt);
				}

				// About
				else {
					const aboutDialogDetails = createNativeAboutDialogDetails(this.productService, await this.nativeHostService.getOSProperties());

					if (this.useCustomDialog) {
						await this.browserImpl.value.about(aboutDialogDetails.title, aboutDialogDetails.details, aboutDialogDetails.detailsToCopy);
					} else {
						await this.nativeImpl.value.about(aboutDialogDetails.title, aboutDialogDetails.details, aboutDialogDetails.detailsToCopy);
					}
				}
			} catch (error) {
				result = error;
			}

			this.currentDialog.close(result);
			this.currentDialog = undefined;
		}
	}

	private get useCustomDialog(): boolean {
		return this.configurationService.getValue('window.dialogStyle') === 'custom' ||
			// Use the custom dialog while driven so that the driver can interact with it
			!!this.environmentService.enableSmokeTestDriver;
	}
}

registerWorkbenchContribution2(
	DialogHandlerContribution.ID,
	DialogHandlerContribution,
	WorkbenchPhase.BlockStartup // Block to allow for dialogs to show before restore finished
);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/electron-browser/parts/dialogs/dialogHandler.ts]---
Location: vscode-main/src/vs/workbench/electron-browser/parts/dialogs/dialogHandler.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';
import { AbstractDialogHandler, IConfirmation, IConfirmationResult, IPrompt, IAsyncPromptResult } from '../../../../platform/dialogs/common/dialogs.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { INativeHostService } from '../../../../platform/native/common/native.js';
import { getActiveWindow } from '../../../../base/browser/dom.js';

export class NativeDialogHandler extends AbstractDialogHandler {

	constructor(
		@ILogService private readonly logService: ILogService,
		@INativeHostService private readonly nativeHostService: INativeHostService,
		@IClipboardService private readonly clipboardService: IClipboardService
	) {
		super();
	}

	async prompt<T>(prompt: IPrompt<T>): Promise<IAsyncPromptResult<T>> {
		this.logService.trace('DialogService#prompt', prompt.message);

		const buttons = this.getPromptButtons(prompt);

		const { response, checkboxChecked } = await this.nativeHostService.showMessageBox({
			type: this.getDialogType(prompt.type),
			title: prompt.title,
			message: prompt.message,
			detail: prompt.detail,
			buttons,
			cancelId: prompt.cancelButton ? buttons.length - 1 : -1 /* Disabled */,
			checkboxLabel: prompt.checkbox?.label,
			checkboxChecked: prompt.checkbox?.checked,
			targetWindowId: getActiveWindow().vscodeWindowId
		});

		return this.getPromptResult(prompt, response, checkboxChecked);
	}

	async confirm(confirmation: IConfirmation): Promise<IConfirmationResult> {
		this.logService.trace('DialogService#confirm', confirmation.message);

		const buttons = this.getConfirmationButtons(confirmation);

		const { response, checkboxChecked } = await this.nativeHostService.showMessageBox({
			type: this.getDialogType(confirmation.type) ?? 'question',
			title: confirmation.title,
			message: confirmation.message,
			detail: confirmation.detail,
			buttons,
			cancelId: buttons.length - 1,
			checkboxLabel: confirmation.checkbox?.label,
			checkboxChecked: confirmation.checkbox?.checked,
			targetWindowId: getActiveWindow().vscodeWindowId
		});

		return { confirmed: response === 0, checkboxChecked };
	}

	input(): never {
		throw new Error('Unsupported'); // we have no native API for password dialogs in Electron
	}

	async about(title: string, details: string, detailsToCopy: string): Promise<void> {
		const { response } = await this.nativeHostService.showMessageBox({
			type: 'info',
			message: title,
			detail: `\n${details}`,
			buttons: [
				localize({ key: 'copy', comment: ['&& denotes a mnemonic'] }, "&&Copy"),
				localize('okButton', "OK")
			],
			targetWindowId: getActiveWindow().vscodeWindowId
		});

		if (response === 0) {
			this.clipboardService.writeText(detailsToCopy);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/electron-browser/parts/titlebar/menubarControl.ts]---
Location: vscode-main/src/vs/workbench/electron-browser/parts/titlebar/menubarControl.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IAction, Separator } from '../../../../base/common/actions.js';
import { IMenuService, SubmenuItemAction, MenuItemAction } from '../../../../platform/actions/common/actions.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IWorkspacesService } from '../../../../platform/workspaces/common/workspaces.js';
import { isMacintosh } from '../../../../base/common/platform.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { INativeWorkbenchEnvironmentService } from '../../../services/environment/electron-browser/environmentService.js';
import { IAccessibilityService } from '../../../../platform/accessibility/common/accessibility.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { IUpdateService } from '../../../../platform/update/common/update.js';
import { IOpenRecentAction, MenubarControl } from '../../../browser/parts/titlebar/menubarControl.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { IMenubarData, IMenubarMenu, IMenubarKeybinding, IMenubarMenuItemSubmenu, IMenubarMenuItemAction, MenubarMenuItem } from '../../../../platform/menubar/common/menubar.js';
import { IMenubarService } from '../../../../platform/menubar/electron-browser/menubar.js';
import { INativeHostService } from '../../../../platform/native/common/native.js';
import { IHostService } from '../../../services/host/browser/host.js';
import { IPreferencesService } from '../../../services/preferences/common/preferences.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { OpenRecentAction } from '../../../browser/actions/windowActions.js';
import { isICommandActionToggleInfo } from '../../../../platform/action/common/action.js';
import { getFlatContextMenuActions } from '../../../../platform/actions/browser/menuEntryActionViewItem.js';

export class NativeMenubarControl extends MenubarControl {

	constructor(
		@IMenuService menuService: IMenuService,
		@IWorkspacesService workspacesService: IWorkspacesService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IKeybindingService keybindingService: IKeybindingService,
		@IConfigurationService configurationService: IConfigurationService,
		@ILabelService labelService: ILabelService,
		@IUpdateService updateService: IUpdateService,
		@IStorageService storageService: IStorageService,
		@INotificationService notificationService: INotificationService,
		@IPreferencesService preferencesService: IPreferencesService,
		@INativeWorkbenchEnvironmentService environmentService: INativeWorkbenchEnvironmentService,
		@IAccessibilityService accessibilityService: IAccessibilityService,
		@IMenubarService private readonly menubarService: IMenubarService,
		@IHostService hostService: IHostService,
		@INativeHostService private readonly nativeHostService: INativeHostService,
		@ICommandService commandService: ICommandService,
	) {
		super(menuService, workspacesService, contextKeyService, keybindingService, configurationService, labelService, updateService, storageService, notificationService, preferencesService, environmentService, accessibilityService, hostService, commandService);

		(async () => {
			this.recentlyOpened = await this.workspacesService.getRecentlyOpened();

			this.doUpdateMenubar();
		})();

		this.registerListeners();
	}

	protected override setupMainMenu(): void {
		super.setupMainMenu();

		for (const topLevelMenuName of Object.keys(this.topLevelTitles)) {
			const menu = this.menus[topLevelMenuName];
			if (menu) {
				this.mainMenuDisposables.add(menu.onDidChange(() => this.updateMenubar()));
			}
		}
	}

	protected doUpdateMenubar(): void {
		// Since the native menubar is shared between windows (main process)
		// only allow the focused window to update the menubar
		if (!this.hostService.hasFocus) {
			return;
		}

		// Send menus to main process to be rendered by Electron
		const menubarData = { menus: {}, keybindings: {} };
		if (this.getMenubarMenus(menubarData)) {
			this.menubarService.updateMenubar(this.nativeHostService.windowId, menubarData);
		}
	}

	private getMenubarMenus(menubarData: IMenubarData): boolean {
		if (!menubarData) {
			return false;
		}

		menubarData.keybindings = this.getAdditionalKeybindings();
		for (const topLevelMenuName of Object.keys(this.topLevelTitles)) {
			const menu = this.menus[topLevelMenuName];
			if (menu) {
				const menubarMenu: IMenubarMenu = { items: [] };
				const menuActions = getFlatContextMenuActions(menu.getActions({ shouldForwardArgs: true }));
				this.populateMenuItems(menuActions, menubarMenu, menubarData.keybindings);
				if (menubarMenu.items.length === 0) {
					return false; // Menus are incomplete
				}
				menubarData.menus[topLevelMenuName] = menubarMenu;
			}
		}

		return true;
	}

	private populateMenuItems(menuActions: readonly IAction[], menuToPopulate: IMenubarMenu, keybindings: { [id: string]: IMenubarKeybinding | undefined }) {
		for (const menuItem of menuActions) {
			if (menuItem instanceof Separator) {
				menuToPopulate.items.push({ id: 'vscode.menubar.separator' });
			} else if (menuItem instanceof MenuItemAction || menuItem instanceof SubmenuItemAction) {

				// use mnemonicTitle whenever possible
				const title = typeof menuItem.item.title === 'string'
					? menuItem.item.title
					: menuItem.item.title.mnemonicTitle ?? menuItem.item.title.value;

				if (menuItem instanceof SubmenuItemAction) {
					const submenu = { items: [] };

					this.populateMenuItems(menuItem.actions, submenu, keybindings);

					if (submenu.items.length > 0) {
						const menubarSubmenuItem: IMenubarMenuItemSubmenu = {
							id: menuItem.id,
							label: title,
							submenu
						};

						menuToPopulate.items.push(menubarSubmenuItem);
					}
				} else {
					if (menuItem.id === OpenRecentAction.ID) {
						const actions = this.getOpenRecentActions().map(this.transformOpenRecentAction);
						menuToPopulate.items.push(...actions);
					}

					const menubarMenuItem: IMenubarMenuItemAction = {
						id: menuItem.id,
						label: title
					};

					if (isICommandActionToggleInfo(menuItem.item.toggled)) {
						menubarMenuItem.label = menuItem.item.toggled.mnemonicTitle ?? menuItem.item.toggled.title ?? title;
					}

					if (menuItem.checked) {
						menubarMenuItem.checked = true;
					}

					if (!menuItem.enabled) {
						menubarMenuItem.enabled = false;
					}

					keybindings[menuItem.id] = this.getMenubarKeybinding(menuItem.id);
					menuToPopulate.items.push(menubarMenuItem);
				}
			}
		}
	}

	private transformOpenRecentAction(action: Separator | IOpenRecentAction): MenubarMenuItem {
		if (action instanceof Separator) {
			return { id: 'vscode.menubar.separator' };
		}

		return {
			id: action.id,
			uri: action.uri,
			remoteAuthority: action.remoteAuthority,
			enabled: action.enabled,
			label: action.label
		};
	}

	private getAdditionalKeybindings(): { [id: string]: IMenubarKeybinding } {
		const keybindings: { [id: string]: IMenubarKeybinding } = {};
		if (isMacintosh) {
			const keybinding = this.getMenubarKeybinding('workbench.action.quit');
			if (keybinding) {
				keybindings['workbench.action.quit'] = keybinding;
			}
		}

		return keybindings;
	}

	private getMenubarKeybinding(id: string): IMenubarKeybinding | undefined {
		const binding = this.keybindingService.lookupKeybinding(id);
		if (!binding) {
			return undefined;
		}

		// first try to resolve a native accelerator
		const electronAccelerator = binding.getElectronAccelerator();
		if (electronAccelerator) {
			return { label: electronAccelerator, userSettingsLabel: binding.getUserSettingsLabel() ?? undefined };
		}

		// we need this fallback to support keybindings that cannot show in electron menus (e.g. chords)
		const acceleratorLabel = binding.getLabel();
		if (acceleratorLabel) {
			return { label: acceleratorLabel, isNative: false, userSettingsLabel: binding.getUserSettingsLabel() ?? undefined };
		}

		return undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/electron-browser/parts/titlebar/titlebarPart.ts]---
Location: vscode-main/src/vs/workbench/electron-browser/parts/titlebar/titlebarPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../../base/common/event.js';
import { getZoomFactor } from '../../../../base/browser/browser.js';
import { $, addDisposableListener, append, EventType, getWindow, getWindowId, hide, show } from '../../../../base/browser/dom.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IConfigurationService, IConfigurationChangeEvent } from '../../../../platform/configuration/common/configuration.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { INativeWorkbenchEnvironmentService } from '../../../services/environment/electron-browser/environmentService.js';
import { IHostService } from '../../../services/host/browser/host.js';
import { isMacintosh, isWindows, isLinux, isTahoeOrNewer } from '../../../../base/common/platform.js';
import { IMenuService, MenuId } from '../../../../platform/actions/common/actions.js';
import { BrowserTitlebarPart, BrowserTitleService, IAuxiliaryTitlebarPart } from '../../../browser/parts/titlebar/titlebarPart.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IWorkbenchLayoutService, Parts } from '../../../services/layout/browser/layoutService.js';
import { INativeHostService } from '../../../../platform/native/common/native.js';
import { hasNativeTitlebar, useWindowControlsOverlay, DEFAULT_CUSTOM_TITLEBAR_HEIGHT, hasNativeMenu } from '../../../../platform/window/common/window.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { NativeMenubarControl } from './menubarControl.js';
import { IEditorGroupsContainer, IEditorGroupsService } from '../../../services/editor/common/editorGroupsService.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { CodeWindow, mainWindow } from '../../../../base/browser/window.js';
import { IsWindowAlwaysOnTopContext } from '../../../common/contextkeys.js';

export class NativeTitlebarPart extends BrowserTitlebarPart {

	//#region IView

	override get minimumHeight(): number {
		if (!isMacintosh) {
			return super.minimumHeight;
		}

		return (this.isCommandCenterVisible ? DEFAULT_CUSTOM_TITLEBAR_HEIGHT : this.macTitlebarSize) / (this.preventZoom ? getZoomFactor(getWindow(this.element)) : 1);
	}
	override get maximumHeight(): number { return this.minimumHeight; }

	private tahoeOrNewer: boolean;
	private get macTitlebarSize() {
		if (this.tahoeOrNewer) {
			return 32;
		}

		return 28;
	}

	//#endregion

	private maxRestoreControl: HTMLElement | undefined;
	private resizer: HTMLElement | undefined;

	private cachedWindowControlStyles: { bgColor: string; fgColor: string } | undefined;
	private cachedWindowControlHeight: number | undefined;

	constructor(
		id: string,
		targetWindow: CodeWindow,
		editorGroupsContainer: IEditorGroupsContainer,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IConfigurationService configurationService: IConfigurationService,
		@INativeWorkbenchEnvironmentService environmentService: INativeWorkbenchEnvironmentService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IThemeService themeService: IThemeService,
		@IStorageService storageService: IStorageService,
		@IWorkbenchLayoutService layoutService: IWorkbenchLayoutService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IHostService hostService: IHostService,
		@INativeHostService private readonly nativeHostService: INativeHostService,
		@IEditorGroupsService editorGroupService: IEditorGroupsService,
		@IEditorService editorService: IEditorService,
		@IMenuService menuService: IMenuService,
		@IKeybindingService keybindingService: IKeybindingService
	) {
		super(id, targetWindow, editorGroupsContainer, contextMenuService, configurationService, environmentService, instantiationService, themeService, storageService, layoutService, contextKeyService, hostService, editorService, menuService, keybindingService);

		this.tahoeOrNewer = isTahoeOrNewer(environmentService.os.release);

		this.handleWindowsAlwaysOnTop(targetWindow.vscodeWindowId);
	}

	private async handleWindowsAlwaysOnTop(targetWindowId: number): Promise<void> {
		const isWindowAlwaysOnTopContext = IsWindowAlwaysOnTopContext.bindTo(this.contextKeyService);

		this._register(this.nativeHostService.onDidChangeWindowAlwaysOnTop(({ windowId, alwaysOnTop }) => {
			if (windowId === targetWindowId) {
				isWindowAlwaysOnTopContext.set(alwaysOnTop);
			}
		}));

		isWindowAlwaysOnTopContext.set(await this.nativeHostService.isWindowAlwaysOnTop({ targetWindowId }));
	}

	protected override onMenubarVisibilityChanged(visible: boolean): void {

		// Hide title when toggling menu bar
		if ((isWindows || isLinux) && this.currentMenubarVisibility === 'toggle' && visible) {

			// Hack to fix issue #52522 with layered webkit-app-region elements appearing under cursor
			if (this.dragRegion) {
				hide(this.dragRegion);
				setTimeout(() => show(this.dragRegion!), 50);
			}
		}

		super.onMenubarVisibilityChanged(visible);
	}

	protected override onConfigurationChanged(event: IConfigurationChangeEvent): void {
		super.onConfigurationChanged(event);

		if (event.affectsConfiguration('window.doubleClickIconToClose')) {
			if (this.appIcon) {
				this.onUpdateAppIconDragBehavior();
			}
		}
	}

	private onUpdateAppIconDragBehavior(): void {
		const setting = this.configurationService.getValue('window.doubleClickIconToClose');
		if (setting && this.appIcon) {
			(this.appIcon.style as CSSStyleDeclaration & { '-webkit-app-region': string })['-webkit-app-region'] = 'no-drag';
		} else if (this.appIcon) {
			(this.appIcon.style as CSSStyleDeclaration & { '-webkit-app-region': string })['-webkit-app-region'] = 'drag';
		}
	}

	protected override installMenubar(): void {
		super.installMenubar();

		if (this.menubar) {
			return;
		}

		if (this.customMenubar.value) {
			this._register(this.customMenubar.value.onFocusStateChange(e => this.onMenubarFocusChanged(e)));
		}
	}

	private onMenubarFocusChanged(focused: boolean): void {
		if ((isWindows || isLinux) && this.currentMenubarVisibility !== 'compact' && this.dragRegion) {
			if (focused) {
				hide(this.dragRegion);
			} else {
				show(this.dragRegion);
			}
		}
	}

	protected override createContentArea(parent: HTMLElement): HTMLElement {
		const result = super.createContentArea(parent);
		const targetWindow = getWindow(parent);
		const targetWindowId = getWindowId(targetWindow);

		// Native menu controller
		if (isMacintosh || hasNativeMenu(this.configurationService)) {
			this._register(this.instantiationService.createInstance(NativeMenubarControl));
		}

		// App Icon (Native Windows/Linux)
		if (this.appIcon) {
			this.onUpdateAppIconDragBehavior();

			this._register(addDisposableListener(this.appIcon, EventType.DBLCLICK, (() => {
				this.nativeHostService.closeWindow({ targetWindowId });
			})));
		}

		// Custom Window Controls (Native Windows/Linux)
		if (
			!hasNativeTitlebar(this.configurationService) &&		// not for native title bars
			!useWindowControlsOverlay(this.configurationService) &&	// not when controls are natively drawn
			this.windowControlsContainer
		) {

			// Minimize
			const minimizeIcon = append(this.windowControlsContainer, $('div.window-icon.window-minimize' + ThemeIcon.asCSSSelector(Codicon.chromeMinimize)));
			this._register(addDisposableListener(minimizeIcon, EventType.CLICK, () => {
				this.nativeHostService.minimizeWindow({ targetWindowId });
			}));

			// Restore
			this.maxRestoreControl = append(this.windowControlsContainer, $('div.window-icon.window-max-restore'));
			this._register(addDisposableListener(this.maxRestoreControl, EventType.CLICK, async () => {
				const maximized = await this.nativeHostService.isMaximized({ targetWindowId });
				if (maximized) {
					return this.nativeHostService.unmaximizeWindow({ targetWindowId });
				}

				return this.nativeHostService.maximizeWindow({ targetWindowId });
			}));

			// Close
			const closeIcon = append(this.windowControlsContainer, $('div.window-icon.window-close' + ThemeIcon.asCSSSelector(Codicon.chromeClose)));
			this._register(addDisposableListener(closeIcon, EventType.CLICK, () => {
				this.nativeHostService.closeWindow({ targetWindowId });
			}));

			// Resizer
			this.resizer = append(this.rootContainer, $('div.resizer'));
			this._register(Event.runAndSubscribe(this.layoutService.onDidChangeWindowMaximized, ({ windowId, maximized }) => {
				if (windowId === targetWindowId) {
					this.onDidChangeWindowMaximized(maximized);
				}
			}, { windowId: targetWindowId, maximized: this.layoutService.isWindowMaximized(targetWindow) }));
		}

		// Window System Context Menu
		// See https://github.com/electron/electron/issues/24893
		if (isWindows && !hasNativeTitlebar(this.configurationService)) {
			this._register(this.nativeHostService.onDidTriggerWindowSystemContextMenu(({ windowId, x, y }) => {
				if (targetWindowId !== windowId) {
					return;
				}

				const zoomFactor = getZoomFactor(getWindow(this.element));
				this.onContextMenu(new MouseEvent(EventType.MOUSE_UP, { clientX: x / zoomFactor, clientY: y / zoomFactor }), MenuId.TitleBarContext);
			}));
		}

		return result;
	}

	private onDidChangeWindowMaximized(maximized: boolean): void {
		if (this.maxRestoreControl) {
			if (maximized) {
				this.maxRestoreControl.classList.remove(...ThemeIcon.asClassNameArray(Codicon.chromeMaximize));
				this.maxRestoreControl.classList.add(...ThemeIcon.asClassNameArray(Codicon.chromeRestore));
			} else {
				this.maxRestoreControl.classList.remove(...ThemeIcon.asClassNameArray(Codicon.chromeRestore));
				this.maxRestoreControl.classList.add(...ThemeIcon.asClassNameArray(Codicon.chromeMaximize));
			}
		}

		if (this.resizer) {
			if (maximized) {
				hide(this.resizer);
			} else {
				show(this.resizer);
			}
		}
	}

	override updateStyles(): void {
		super.updateStyles();

		// Part container
		if (this.element) {
			if (useWindowControlsOverlay(this.configurationService)) {
				if (
					!this.cachedWindowControlStyles ||
					this.cachedWindowControlStyles.bgColor !== this.element.style.backgroundColor ||
					this.cachedWindowControlStyles.fgColor !== this.element.style.color
				) {
					this.nativeHostService.updateWindowControls({
						targetWindowId: getWindowId(getWindow(this.element)),
						backgroundColor: this.element.style.backgroundColor,
						foregroundColor: this.element.style.color
					});
				}
			}
		}
	}

	override layout(width: number, height: number): void {
		super.layout(width, height);

		if (useWindowControlsOverlay(this.configurationService)) {
			const newHeight = Math.round(height * getZoomFactor(getWindow(this.element)));
			if (newHeight !== this.cachedWindowControlHeight) {
				this.cachedWindowControlHeight = newHeight;
				this.nativeHostService.updateWindowControls({
					targetWindowId: getWindowId(getWindow(this.element)),
					height: newHeight
				});
			}
		}
	}
}

export class MainNativeTitlebarPart extends NativeTitlebarPart {

	constructor(
		@IContextMenuService contextMenuService: IContextMenuService,
		@IConfigurationService configurationService: IConfigurationService,
		@INativeWorkbenchEnvironmentService environmentService: INativeWorkbenchEnvironmentService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IThemeService themeService: IThemeService,
		@IStorageService storageService: IStorageService,
		@IWorkbenchLayoutService layoutService: IWorkbenchLayoutService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IHostService hostService: IHostService,
		@INativeHostService nativeHostService: INativeHostService,
		@IEditorGroupsService editorGroupService: IEditorGroupsService,
		@IEditorService editorService: IEditorService,
		@IMenuService menuService: IMenuService,
		@IKeybindingService keybindingService: IKeybindingService
	) {
		super(Parts.TITLEBAR_PART, mainWindow, editorGroupService.mainPart, contextMenuService, configurationService, environmentService, instantiationService, themeService, storageService, layoutService, contextKeyService, hostService, nativeHostService, editorGroupService, editorService, menuService, keybindingService);
	}
}

export class AuxiliaryNativeTitlebarPart extends NativeTitlebarPart implements IAuxiliaryTitlebarPart {

	private static COUNTER = 1;

	get height() { return this.minimumHeight; }

	constructor(
		readonly container: HTMLElement,
		editorGroupsContainer: IEditorGroupsContainer,
		private readonly mainTitlebar: BrowserTitlebarPart,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IConfigurationService configurationService: IConfigurationService,
		@INativeWorkbenchEnvironmentService environmentService: INativeWorkbenchEnvironmentService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IThemeService themeService: IThemeService,
		@IStorageService storageService: IStorageService,
		@IWorkbenchLayoutService layoutService: IWorkbenchLayoutService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IHostService hostService: IHostService,
		@INativeHostService nativeHostService: INativeHostService,
		@IEditorGroupsService editorGroupService: IEditorGroupsService,
		@IEditorService editorService: IEditorService,
		@IMenuService menuService: IMenuService,
		@IKeybindingService keybindingService: IKeybindingService
	) {
		const id = AuxiliaryNativeTitlebarPart.COUNTER++;
		super(`workbench.parts.auxiliaryTitle.${id}`, getWindow(container), editorGroupsContainer, contextMenuService, configurationService, environmentService, instantiationService, themeService, storageService, layoutService, contextKeyService, hostService, nativeHostService, editorGroupService, editorService, menuService, keybindingService);
	}

	override get preventZoom(): boolean {

		// Prevent zooming behavior if any of the following conditions are met:
		// 1. Shrinking below the window control size (zoom < 1)
		// 2. No custom items are present in the main title bar
		// The auxiliary title bar never contains any zoomable items itself,
		// but we want to match the behavior of the main title bar.

		return getZoomFactor(getWindow(this.element)) < 1 || !this.mainTitlebar.hasZoomableElements;
	}
}

export class NativeTitleService extends BrowserTitleService {

	protected override createMainTitlebarPart(): MainNativeTitlebarPart {
		return this.instantiationService.createInstance(MainNativeTitlebarPart);
	}

	protected override doCreateAuxiliaryTitlebarPart(container: HTMLElement, editorGroupsContainer: IEditorGroupsContainer, instantiationService: IInstantiationService): AuxiliaryNativeTitlebarPart {
		return instantiationService.createInstance(AuxiliaryNativeTitlebarPart, container, editorGroupsContainer, this.mainPart);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/accessibility/common/accessibleViewInformationService.ts]---
Location: vscode-main/src/vs/workbench/services/accessibility/common/accessibleViewInformationService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { ACCESSIBLE_VIEW_SHOWN_STORAGE_PREFIX } from '../../../../platform/accessibility/common/accessibility.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IStorageService, StorageScope } from '../../../../platform/storage/common/storage.js';

export interface IAccessibleViewInformationService {
	_serviceBrand: undefined;
	hasShownAccessibleView(viewId: string): boolean;
}

export const IAccessibleViewInformationService = createDecorator<IAccessibleViewInformationService>('accessibleViewInformationService');

export class AccessibleViewInformationService extends Disposable implements IAccessibleViewInformationService {
	declare readonly _serviceBrand: undefined;
	constructor(@IStorageService private readonly _storageService: IStorageService) {
		super();
	}
	hasShownAccessibleView(viewId: string): boolean {
		return this._storageService.getBoolean(`${ACCESSIBLE_VIEW_SHOWN_STORAGE_PREFIX}${viewId}`, StorageScope.APPLICATION, false) === true;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/accessibility/electron-browser/accessibilityService.ts]---
Location: vscode-main/src/vs/workbench/services/accessibility/electron-browser/accessibilityService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IAccessibilityService, AccessibilitySupport } from '../../../../platform/accessibility/common/accessibility.js';
import { isWindows, isLinux } from '../../../../base/common/platform.js';
import { INativeWorkbenchEnvironmentService } from '../../environment/electron-browser/environmentService.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { AccessibilityService } from '../../../../platform/accessibility/browser/accessibilityService.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IJSONEditingService } from '../../configuration/common/jsonEditing.js';
import { IWorkbenchContribution, WorkbenchPhase, registerWorkbenchContribution2 } from '../../../common/contributions.js';
import { INativeHostService } from '../../../../platform/native/common/native.js';
import { ILayoutService } from '../../../../platform/layout/browser/layoutService.js';

interface AccessibilityMetrics {
	enabled: boolean;
}
type AccessibilityMetricsClassification = {
	owner: 'isidorn';
	comment: 'Helps gain an understanding of when accessibility features are being used';
	enabled: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether or not accessibility features are enabled' };
};

export class NativeAccessibilityService extends AccessibilityService implements IAccessibilityService {

	private didSendTelemetry = false;
	private shouldAlwaysUnderlineAccessKeys: boolean | undefined = undefined;

	constructor(
		@INativeWorkbenchEnvironmentService environmentService: INativeWorkbenchEnvironmentService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IConfigurationService configurationService: IConfigurationService,
		@ILayoutService _layoutService: ILayoutService,
		@ITelemetryService private readonly _telemetryService: ITelemetryService,
		@INativeHostService private readonly nativeHostService: INativeHostService
	) {
		super(contextKeyService, _layoutService, configurationService);
		this.setAccessibilitySupport(environmentService.window.accessibilitySupport ? AccessibilitySupport.Enabled : AccessibilitySupport.Disabled);
	}

	override async alwaysUnderlineAccessKeys(): Promise<boolean> {
		if (!isWindows) {
			return false;
		}

		if (typeof this.shouldAlwaysUnderlineAccessKeys !== 'boolean') {
			const windowsKeyboardAccessibility = await this.nativeHostService.windowsGetStringRegKey('HKEY_CURRENT_USER', 'Control Panel\\Accessibility\\Keyboard Preference', 'On');
			this.shouldAlwaysUnderlineAccessKeys = (windowsKeyboardAccessibility === '1');
		}

		return this.shouldAlwaysUnderlineAccessKeys;
	}

	override setAccessibilitySupport(accessibilitySupport: AccessibilitySupport): void {
		super.setAccessibilitySupport(accessibilitySupport);

		if (!this.didSendTelemetry && accessibilitySupport === AccessibilitySupport.Enabled) {
			this._telemetryService.publicLog2<AccessibilityMetrics, AccessibilityMetricsClassification>('accessibility', { enabled: true });
			this.didSendTelemetry = true;
		}
	}
}

registerSingleton(IAccessibilityService, NativeAccessibilityService, InstantiationType.Delayed);

// On linux we do not automatically detect that a screen reader is detected, thus we have to implicitly notify the renderer to enable accessibility when user configures it in settings
class LinuxAccessibilityContribution implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.linuxAccessibility';

	constructor(
		@IJSONEditingService jsonEditingService: IJSONEditingService,
		@IAccessibilityService accessibilityService: IAccessibilityService,
		@INativeWorkbenchEnvironmentService environmentService: INativeWorkbenchEnvironmentService
	) {
		const forceRendererAccessibility = () => {
			if (accessibilityService.isScreenReaderOptimized()) {
				jsonEditingService.write(environmentService.argvResource, [{ path: ['force-renderer-accessibility'], value: true }], true);
			}
		};
		forceRendererAccessibility();
		accessibilityService.onDidChangeScreenReaderOptimized(forceRendererAccessibility);
	}
}

if (isLinux) {
	registerWorkbenchContribution2(LinuxAccessibilityContribution.ID, LinuxAccessibilityContribution, WorkbenchPhase.BlockRestore);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/accounts/common/defaultAccount.ts]---
Location: vscode-main/src/vs/workbench/services/accounts/common/defaultAccount.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { AuthenticationSession, IAuthenticationService } from '../../authentication/common/authentication.js';
import { asJson, IRequestService } from '../../../../platform/request/common/request.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IExtensionService } from '../../extensions/common/extensions.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IContextKey, IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { Action2, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { localize } from '../../../../nls.js';
import { IWorkbenchContribution, registerWorkbenchContribution2, WorkbenchPhase } from '../../../common/contributions.js';
import { Barrier, timeout } from '../../../../base/common/async.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { getErrorMessage } from '../../../../base/common/errors.js';
import { IDefaultAccount } from '../../../../base/common/defaultAccount.js';
import { isString } from '../../../../base/common/types.js';
import { IWorkbenchEnvironmentService } from '../../environment/common/environmentService.js';
import { isWeb } from '../../../../base/common/platform.js';
import { IDefaultAccountService } from '../../../../platform/defaultAccount/common/defaultAccount.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';

export const DEFAULT_ACCOUNT_SIGN_IN_COMMAND = 'workbench.actions.accounts.signIn';

const enum DefaultAccountStatus {
	Uninitialized = 'uninitialized',
	Unavailable = 'unavailable',
	Available = 'available',
}

const CONTEXT_DEFAULT_ACCOUNT_STATE = new RawContextKey<string>('defaultAccountStatus', DefaultAccountStatus.Uninitialized);

interface IChatEntitlementsResponse {
	readonly access_type_sku: string;
	readonly copilot_plan: string;
	readonly assigned_date: string;
	readonly can_signup_for_limited: boolean;
	readonly chat_enabled: boolean;
	readonly analytics_tracking_id: string;
	readonly limited_user_quotas?: {
		readonly chat: number;
		readonly completions: number;
	};
	readonly monthly_quotas?: {
		readonly chat: number;
		readonly completions: number;
	};
	readonly limited_user_reset_date: string;
}

interface ITokenEntitlementsResponse {
	token: string;
}

interface IMcpRegistryProvider {
	readonly url: string;
	readonly registry_access: 'allow_all' | 'registry_only';
	readonly owner: {
		readonly login: string;
		readonly id: number;
		readonly type: string;
		readonly parent_login: string | null;
		readonly priority: number;
	};
}

interface IMcpRegistryResponse {
	readonly mcp_registries: ReadonlyArray<IMcpRegistryProvider>;
}

export class DefaultAccountService extends Disposable implements IDefaultAccountService {
	declare _serviceBrand: undefined;

	private _defaultAccount: IDefaultAccount | null | undefined = undefined;
	get defaultAccount(): IDefaultAccount | null { return this._defaultAccount ?? null; }

	private readonly initBarrier = new Barrier();

	private readonly _onDidChangeDefaultAccount = this._register(new Emitter<IDefaultAccount | null>());
	readonly onDidChangeDefaultAccount = this._onDidChangeDefaultAccount.event;

	async getDefaultAccount(): Promise<IDefaultAccount | null> {
		await this.initBarrier.wait();
		return this.defaultAccount;
	}

	setDefaultAccount(account: IDefaultAccount | null): void {
		const oldAccount = this._defaultAccount;
		this._defaultAccount = account;

		if (oldAccount !== this._defaultAccount) {
			this._onDidChangeDefaultAccount.fire(this._defaultAccount);
		}

		this.initBarrier.open();
	}

}

export class DefaultAccountManagementContribution extends Disposable implements IWorkbenchContribution {

	static ID = 'workbench.contributions.defaultAccountManagement';

	private defaultAccount: IDefaultAccount | null = null;
	private readonly accountStatusContext: IContextKey<string>;

	constructor(
		@IDefaultAccountService private readonly defaultAccountService: IDefaultAccountService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IAuthenticationService private readonly authenticationService: IAuthenticationService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IExtensionService private readonly extensionService: IExtensionService,
		@IProductService private readonly productService: IProductService,
		@IRequestService private readonly requestService: IRequestService,
		@ILogService private readonly logService: ILogService,
		@IWorkbenchEnvironmentService private readonly environmentService: IWorkbenchEnvironmentService,
		@IContextKeyService contextKeyService: IContextKeyService,
	) {
		super();
		this.accountStatusContext = CONTEXT_DEFAULT_ACCOUNT_STATE.bindTo(contextKeyService);
		this.initialize().then(() => {
			type DefaultAccountStatusTelemetry = {
				status: string;
				initial: boolean;
			};
			type DefaultAccountStatusTelemetryClassification = {
				owner: 'sandy081';
				comment: 'Log default account availability status';
				status: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Indicates whether default account is available or not.' };
				initial: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Indicates whether this is the initial status report.' };
			};
			this.telemetryService.publicLog2<DefaultAccountStatusTelemetry, DefaultAccountStatusTelemetryClassification>('defaultaccount:status', { status: this.defaultAccount ? 'available' : 'unavailable', initial: true });

			this._register(this.authenticationService.onDidChangeSessions(async e => {
				if (e.providerId !== this.getDefaultAccountProviderId()) {
					return;
				}
				if (this.defaultAccount && e.event.removed?.some(session => session.id === this.defaultAccount?.sessionId)) {
					this.setDefaultAccount(null);
				} else {
					this.setDefaultAccount(await this.getDefaultAccountFromAuthenticatedSessions(e.providerId, this.productService.defaultAccount!.authenticationProvider.scopes));
				}

				this.telemetryService.publicLog2<DefaultAccountStatusTelemetry, DefaultAccountStatusTelemetryClassification>('defaultaccount:status', { status: this.defaultAccount ? 'available' : 'unavailable', initial: false });
			}));
		});
	}

	private async initialize(): Promise<void> {
		this.logService.debug('[DefaultAccount] Starting initialization');
		let defaultAccount: IDefaultAccount | null = null;
		try {
			defaultAccount = await this.fetchDefaultAccount();
		} catch (error) {
			this.logService.error('[DefaultAccount] Error during initialization', getErrorMessage(error));
		}
		this.setDefaultAccount(defaultAccount);
		this.logService.debug('[DefaultAccount] Initialization complete');
	}

	private async fetchDefaultAccount(): Promise<IDefaultAccount | null> {
		if (!this.productService.defaultAccount) {
			this.logService.debug('[DefaultAccount] No default account configuration in product service, skipping initialization');
			return null;
		}

		if (isWeb && !this.environmentService.remoteAuthority) {
			this.logService.debug('[DefaultAccount] Running in web without remote, skipping initialization');
			return null;
		}

		const defaultAccountProviderId = this.getDefaultAccountProviderId();
		this.logService.debug('[DefaultAccount] Default account provider ID:', defaultAccountProviderId);
		if (!defaultAccountProviderId) {
			return null;
		}

		await this.extensionService.whenInstalledExtensionsRegistered();
		this.logService.debug('[DefaultAccount] Installed extensions registered.');

		const declaredProvider = this.authenticationService.declaredProviders.find(provider => provider.id === defaultAccountProviderId);
		if (!declaredProvider) {
			this.logService.info(`[DefaultAccount] Authentication provider is not declared.`, defaultAccountProviderId);
			return null;
		}

		this.registerSignInAction(defaultAccountProviderId, this.productService.defaultAccount.authenticationProvider.scopes[0]);
		return await this.getDefaultAccountFromAuthenticatedSessions(defaultAccountProviderId, this.productService.defaultAccount.authenticationProvider.scopes);
	}

	private setDefaultAccount(account: IDefaultAccount | null): void {
		this.defaultAccount = account;
		this.defaultAccountService.setDefaultAccount(this.defaultAccount);
		if (this.defaultAccount) {
			this.accountStatusContext.set(DefaultAccountStatus.Available);
			this.logService.debug('[DefaultAccount] Account status set to Available');
		} else {
			this.accountStatusContext.set(DefaultAccountStatus.Unavailable);
			this.logService.debug('[DefaultAccount] Account status set to Unavailable');
		}
	}

	private extractFromToken(token: string): Map<string, string> {
		const result = new Map<string, string>();
		const firstPart = token?.split(':')[0];
		const fields = firstPart?.split(';');
		for (const field of fields) {
			const [key, value] = field.split('=');
			result.set(key, value);
		}
		this.logService.debug(`[DefaultAccount] extractFromToken: ${JSON.stringify(Object.fromEntries(result))}`);
		return result;
	}

	private async getDefaultAccountFromAuthenticatedSessions(authProviderId: string, scopes: string[][]): Promise<IDefaultAccount | null> {
		try {
			this.logService.debug('[DefaultAccount] Getting Default Account from authenticated sessions for provider:', authProviderId);
			const session = await this.findMatchingProviderSession(authProviderId, scopes);

			if (!session) {
				this.logService.debug('[DefaultAccount] No matching session found for provider:', authProviderId);
				return null;
			}

			const [chatEntitlements, tokenEntitlements] = await Promise.all([
				this.getChatEntitlements(session.accessToken),
				this.getTokenEntitlements(session.accessToken),
			]);

			const mcpRegistryProvider = tokenEntitlements.mcp ? await this.getMcpRegistryProvider(session.accessToken) : undefined;

			const account = {
				sessionId: session.id,
				enterprise: this.isEnterpriseAuthenticationProvider(authProviderId) || session.account.label.includes('_'),
				...chatEntitlements,
				...tokenEntitlements,
				mcpRegistryUrl: mcpRegistryProvider?.url,
				mcpAccess: mcpRegistryProvider?.registry_access,
			};
			this.logService.debug('[DefaultAccount] Successfully created default account for provider:', authProviderId);
			return account;
		} catch (error) {
			this.logService.error('[DefaultAccount] Failed to create default account for provider:', authProviderId, getErrorMessage(error));
			return null;
		}
	}

	private async findMatchingProviderSession(authProviderId: string, allScopes: string[][]): Promise<AuthenticationSession | undefined> {
		const sessions = await this.getSessions(authProviderId);
		for (const session of sessions) {
			this.logService.debug('[DefaultAccount] Checking session with scopes', session.scopes);
			for (const scopes of allScopes) {
				if (this.scopesMatch(session.scopes, scopes)) {
					return session;
				}
			}
		}
		return undefined;
	}

	private async getSessions(authProviderId: string): Promise<readonly AuthenticationSession[]> {
		for (let attempt = 1; attempt <= 3; attempt++) {
			try {
				return await this.authenticationService.getSessions(authProviderId, undefined, undefined, true);
			} catch (error) {
				this.logService.warn(`[DefaultAccount] Attempt ${attempt} to get sessions failed:`, getErrorMessage(error));
				if (attempt === 3) {
					throw error;
				}
				await timeout(500);
			}
		}
		throw new Error('Unable to get sessions after multiple attempts');
	}

	private scopesMatch(scopes: ReadonlyArray<string>, expectedScopes: string[]): boolean {
		return expectedScopes.every(scope => scopes.includes(scope));
	}

	private async getTokenEntitlements(accessToken: string): Promise<Partial<IDefaultAccount>> {
		const tokenEntitlementsUrl = this.getTokenEntitlementUrl();
		if (!tokenEntitlementsUrl) {
			this.logService.debug('[DefaultAccount] No token entitlements URL found');
			return {};
		}

		this.logService.debug('[DefaultAccount] Fetching token entitlements from:', tokenEntitlementsUrl);
		try {
			const chatContext = await this.requestService.request({
				type: 'GET',
				url: tokenEntitlementsUrl,
				disableCache: true,
				headers: {
					'Authorization': `Bearer ${accessToken}`
				}
			}, CancellationToken.None);

			const chatData = await asJson<ITokenEntitlementsResponse>(chatContext);
			if (chatData) {
				const tokenMap = this.extractFromToken(chatData.token);
				return {
					// Editor preview features are disabled if the flag is present and set to 0
					chat_preview_features_enabled: tokenMap.get('editor_preview_features') !== '0',
					chat_agent_enabled: tokenMap.get('agent_mode') !== '0',
					// MCP is disabled if the flag is present and set to 0
					mcp: tokenMap.get('mcp') !== '0',
				};
			}
			this.logService.error('Failed to fetch token entitlements', 'No data returned');
		} catch (error) {
			this.logService.error('Failed to fetch token entitlements', getErrorMessage(error));
		}

		return {};
	}

	private async getChatEntitlements(accessToken: string): Promise<Partial<IChatEntitlementsResponse>> {
		const chatEntitlementsUrl = this.getChatEntitlementUrl();
		if (!chatEntitlementsUrl) {
			this.logService.debug('[DefaultAccount] No chat entitlements URL found');
			return {};
		}

		this.logService.debug('[DefaultAccount] Fetching chat entitlements from:', chatEntitlementsUrl);
		try {
			const context = await this.requestService.request({
				type: 'GET',
				url: chatEntitlementsUrl,
				disableCache: true,
				headers: {
					'Authorization': `Bearer ${accessToken}`
				}
			}, CancellationToken.None);

			const data = await asJson<IChatEntitlementsResponse>(context);
			if (data) {
				return data;
			}
			this.logService.error('Failed to fetch entitlements', 'No data returned');
		} catch (error) {
			this.logService.error('Failed to fetch entitlements', getErrorMessage(error));
		}
		return {};
	}

	private async getMcpRegistryProvider(accessToken: string): Promise<IMcpRegistryProvider | undefined> {
		const mcpRegistryDataUrl = this.getMcpRegistryDataUrl();
		if (!mcpRegistryDataUrl) {
			this.logService.debug('[DefaultAccount] No MCP registry data URL found');
			return undefined;
		}

		try {
			const context = await this.requestService.request({
				type: 'GET',
				url: mcpRegistryDataUrl,
				disableCache: true,
				headers: {
					'Authorization': `Bearer ${accessToken}`
				}
			}, CancellationToken.None);

			const data = await asJson<IMcpRegistryResponse>(context);
			if (data) {
				this.logService.debug('Fetched MCP registry providers', data.mcp_registries);
				return data.mcp_registries[0];
			}
			this.logService.debug('Failed to fetch MCP registry providers', 'No data returned');
		} catch (error) {
			this.logService.error('Failed to fetch MCP registry providers', getErrorMessage(error));
		}
		return undefined;
	}

	private getChatEntitlementUrl(): string | undefined {
		if (!this.productService.defaultAccount) {
			return undefined;
		}

		if (this.isEnterpriseAuthenticationProvider(this.getDefaultAccountProviderId())) {
			try {
				const enterpriseUrl = this.getEnterpriseUrl();
				if (!enterpriseUrl) {
					return undefined;
				}
				return `${enterpriseUrl.protocol}//api.${enterpriseUrl.hostname}${enterpriseUrl.port ? ':' + enterpriseUrl.port : ''}/copilot_internal/user`;
			} catch (error) {
				this.logService.error(error);
			}
		}

		return this.productService.defaultAccount?.chatEntitlementUrl;
	}

	private getTokenEntitlementUrl(): string | undefined {
		if (!this.productService.defaultAccount) {
			return undefined;
		}

		if (this.isEnterpriseAuthenticationProvider(this.getDefaultAccountProviderId())) {
			try {
				const enterpriseUrl = this.getEnterpriseUrl();
				if (!enterpriseUrl) {
					return undefined;
				}
				return `${enterpriseUrl.protocol}//api.${enterpriseUrl.hostname}${enterpriseUrl.port ? ':' + enterpriseUrl.port : ''}/copilot_internal/v2/token`;
			} catch (error) {
				this.logService.error(error);
			}
		}

		return this.productService.defaultAccount?.tokenEntitlementUrl;
	}

	private getMcpRegistryDataUrl(): string | undefined {
		if (!this.productService.defaultAccount) {
			return undefined;
		}

		if (this.isEnterpriseAuthenticationProvider(this.getDefaultAccountProviderId())) {
			try {
				const enterpriseUrl = this.getEnterpriseUrl();
				if (!enterpriseUrl) {
					return undefined;
				}
				return `${enterpriseUrl.protocol}//api.${enterpriseUrl.hostname}${enterpriseUrl.port ? ':' + enterpriseUrl.port : ''}/copilot/mcp_registry`;
			} catch (error) {
				this.logService.error(error);
			}
		}

		return this.productService.defaultAccount?.mcpRegistryDataUrl;
	}

	private getDefaultAccountProviderId(): string | undefined {
		if (this.productService.defaultAccount && this.configurationService.getValue<string | undefined>(this.productService.defaultAccount.authenticationProvider.enterpriseProviderConfig) === this.productService.defaultAccount?.authenticationProvider.enterpriseProviderId) {
			return this.productService.defaultAccount?.authenticationProvider.enterpriseProviderId;
		}
		return this.productService.defaultAccount?.authenticationProvider.id;
	}

	private isEnterpriseAuthenticationProvider(providerId: string | undefined): boolean {
		if (!providerId) {
			return false;
		}

		return providerId === this.productService.defaultAccount?.authenticationProvider.enterpriseProviderId;
	}

	private getEnterpriseUrl(): URL | undefined {
		if (!this.productService.defaultAccount) {
			return undefined;
		}
		const value = this.configurationService.getValue(this.productService.defaultAccount.authenticationProvider.enterpriseProviderUriSetting);
		if (!isString(value)) {
			return undefined;
		}
		return new URL(value);
	}

	private registerSignInAction(authProviderId: string, scopes: string[]): void {
		const that = this;
		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: DEFAULT_ACCOUNT_SIGN_IN_COMMAND,
					title: localize('sign in', "Sign in"),
				});
			}
			run(): Promise<AuthenticationSession> {
				return that.authenticationService.createSession(authProviderId, scopes);
			}
		}));
	}

}

registerWorkbenchContribution2('workbench.contributions.defaultAccountManagement', DefaultAccountManagementContribution, WorkbenchPhase.AfterRestored);
```

--------------------------------------------------------------------------------

````
