---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 300
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 300 of 552)

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

---[FILE: src/vs/workbench/workbench.desktop.main.ts]---
Location: vscode-main/src/vs/workbench/workbench.desktop.main.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


// #######################################################################
// ###                                                                 ###
// ### !!! PLEASE ADD COMMON IMPORTS INTO WORKBENCH.COMMON.MAIN.TS !!! ###
// ###                                                                 ###
// #######################################################################

//#region --- workbench common

import './workbench.common.main.js';

//#endregion


//#region --- workbench (desktop main)

import './electron-browser/desktop.main.js';
import './electron-browser/desktop.contribution.js';

//#endregion


//#region --- workbench parts

import './electron-browser/parts/dialogs/dialog.contribution.js';

//#endregion


//#region --- workbench services

import './services/textfile/electron-browser/nativeTextFileService.js';
import './services/dialogs/electron-browser/fileDialogService.js';
import './services/workspaces/electron-browser/workspacesService.js';
import './services/menubar/electron-browser/menubarService.js';
import './services/update/electron-browser/updateService.js';
import './services/url/electron-browser/urlService.js';
import './services/lifecycle/electron-browser/lifecycleService.js';
import './services/title/electron-browser/titleService.js';
import './services/host/electron-browser/nativeHostService.js';
import './services/request/electron-browser/requestService.js';
import './services/clipboard/electron-browser/clipboardService.js';
import './services/contextmenu/electron-browser/contextmenuService.js';
import './services/workspaces/electron-browser/workspaceEditingService.js';
import './services/configurationResolver/electron-browser/configurationResolverService.js';
import './services/accessibility/electron-browser/accessibilityService.js';
import './services/keybinding/electron-browser/nativeKeyboardLayout.js';
import './services/path/electron-browser/pathService.js';
import './services/themes/electron-browser/nativeHostColorSchemeService.js';
import './services/extensionManagement/electron-browser/extensionManagementService.js';
import './services/mcp/electron-browser/mcpGalleryManifestService.js';
import './services/mcp/electron-browser/mcpWorkbenchManagementService.js';
import './services/encryption/electron-browser/encryptionService.js';
import './services/imageResize/electron-browser/imageResizeService.js';
import './services/browserElements/electron-browser/browserElementsService.js';
import './services/secrets/electron-browser/secretStorageService.js';
import './services/localization/electron-browser/languagePackService.js';
import './services/telemetry/electron-browser/telemetryService.js';
import './services/extensions/electron-browser/extensionHostStarter.js';
import '../platform/extensionResourceLoader/common/extensionResourceLoaderService.js';
import './services/localization/electron-browser/localeService.js';
import './services/extensions/electron-browser/extensionsScannerService.js';
import './services/extensionManagement/electron-browser/extensionManagementServerService.js';
import './services/extensionManagement/electron-browser/extensionGalleryManifestService.js';
import './services/extensionManagement/electron-browser/extensionTipsService.js';
import './services/userDataSync/electron-browser/userDataSyncService.js';
import './services/userDataSync/electron-browser/userDataAutoSyncService.js';
import './services/timer/electron-browser/timerService.js';
import './services/environment/electron-browser/shellEnvironmentService.js';
import './services/integrity/electron-browser/integrityService.js';
import './services/workingCopy/electron-browser/workingCopyBackupService.js';
import './services/checksum/electron-browser/checksumService.js';
import '../platform/remote/electron-browser/sharedProcessTunnelService.js';
import './services/tunnel/electron-browser/tunnelService.js';
import '../platform/diagnostics/electron-browser/diagnosticsService.js';
import '../platform/profiling/electron-browser/profilingService.js';
import '../platform/telemetry/electron-browser/customEndpointTelemetryService.js';
import '../platform/remoteTunnel/electron-browser/remoteTunnelService.js';
import './services/files/electron-browser/elevatedFileService.js';
import './services/search/electron-browser/searchService.js';
import './services/workingCopy/electron-browser/workingCopyHistoryService.js';
import './services/userDataSync/browser/userDataSyncEnablementService.js';
import './services/extensions/electron-browser/nativeExtensionService.js';
import '../platform/userDataProfile/electron-browser/userDataProfileStorageService.js';
import './services/auxiliaryWindow/electron-browser/auxiliaryWindowService.js';
import '../platform/extensionManagement/electron-browser/extensionsProfileScannerService.js';
import '../platform/webContentExtractor/electron-browser/webContentExtractorService.js';
import './services/process/electron-browser/processService.js';

import { registerSingleton } from '../platform/instantiation/common/extensions.js';
import { IUserDataInitializationService, UserDataInitializationService } from './services/userData/browser/userDataInit.js';
import { SyncDescriptor } from '../platform/instantiation/common/descriptors.js';

registerSingleton(IUserDataInitializationService, new SyncDescriptor(UserDataInitializationService, [[]], true));


//#endregion


//#region --- workbench contributions

// Logs
import './contrib/logs/electron-browser/logs.contribution.js';

// Localizations
import './contrib/localization/electron-browser/localization.contribution.js';

// Explorer
import './contrib/files/electron-browser/fileActions.contribution.js';

// CodeEditor Contributions
import './contrib/codeEditor/electron-browser/codeEditor.contribution.js';

// Debug
import './contrib/debug/electron-browser/extensionHostDebugService.js';

// Extensions Management
import './contrib/extensions/electron-browser/extensions.contribution.js';

// Issues
import './contrib/issue/electron-browser/issue.contribution.js';

// Process Explorer
import './contrib/processExplorer/electron-browser/processExplorer.contribution.js';

// Remote
import './contrib/remote/electron-browser/remote.contribution.js';

// Terminal
import './contrib/terminal/electron-browser/terminal.contribution.js';

// Themes
import './contrib/themes/browser/themes.test.contribution.js';
import './services/themes/electron-browser/themes.contribution.js';
// User Data Sync
import './contrib/userDataSync/electron-browser/userDataSync.contribution.js';

// Tags
import './contrib/tags/electron-browser/workspaceTagsService.js';
import './contrib/tags/electron-browser/tags.contribution.js';
// Performance
import './contrib/performance/electron-browser/performance.contribution.js';

// Tasks
import './contrib/tasks/electron-browser/taskService.js';

// External terminal
import './contrib/externalTerminal/electron-browser/externalTerminal.contribution.js';

// Webview
import './contrib/webview/electron-browser/webview.contribution.js';

// Splash
import './contrib/splash/electron-browser/splash.contribution.js';

// Local History
import './contrib/localHistory/electron-browser/localHistory.contribution.js';

// Merge Editor
import './contrib/mergeEditor/electron-browser/mergeEditor.contribution.js';

// Multi Diff Editor
import './contrib/multiDiffEditor/browser/multiDiffEditor.contribution.js';

// Remote Tunnel
import './contrib/remoteTunnel/electron-browser/remoteTunnel.contribution.js';

// Chat
import './contrib/chat/electron-browser/chat.contribution.js';
import './contrib/inlineChat/electron-browser/inlineChat.contribution.js';
// Encryption
import './contrib/encryption/electron-browser/encryption.contribution.js';

// Emergency Alert
import './contrib/emergencyAlert/electron-browser/emergencyAlert.contribution.js';

// MCP
import './contrib/mcp/electron-browser/mcp.contribution.js';

// Policy Export
import './contrib/policyExport/electron-browser/policyExport.contribution.js';

//#endregion


export { main } from './electron-browser/desktop.main.js';
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/workbench.web.main.internal.ts]---
Location: vscode-main/src/vs/workbench/workbench.web.main.internal.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


// #######################################################################
// ###                                                                 ###
// ### !!! PLEASE ADD COMMON IMPORTS INTO WORKBENCH.COMMON.MAIN.TS !!! ###
// ###                                                                 ###
// #######################################################################


//#region --- workbench common

import './workbench.common.main.js';

//#endregion


//#region --- workbench parts

import './browser/parts/dialogs/dialog.web.contribution.js';

//#endregion


//#region --- workbench (web main)

import './browser/web.main.js';

//#endregion


//#region --- workbench services

import './services/integrity/browser/integrityService.js';
import './services/search/browser/searchService.js';
import './services/textfile/browser/browserTextFileService.js';
import './services/keybinding/browser/keyboardLayoutService.js';
import './services/extensions/browser/extensionService.js';
import './services/extensionManagement/browser/extensionsProfileScannerService.js';
import './services/extensions/browser/extensionsScannerService.js';
import './services/extensionManagement/browser/webExtensionsScannerService.js';
import './services/extensionManagement/common/extensionManagementServerService.js';
import './services/mcp/browser/mcpWorkbenchManagementService.js';
import './services/extensionManagement/browser/extensionGalleryManifestService.js';
import './services/telemetry/browser/telemetryService.js';
import './services/url/browser/urlService.js';
import './services/update/browser/updateService.js';
import './services/workspaces/browser/workspacesService.js';
import './services/workspaces/browser/workspaceEditingService.js';
import './services/dialogs/browser/fileDialogService.js';
import './services/host/browser/browserHostService.js';
import './services/lifecycle/browser/lifecycleService.js';
import './services/clipboard/browser/clipboardService.js';
import './services/localization/browser/localeService.js';
import './services/path/browser/pathService.js';
import './services/themes/browser/browserHostColorSchemeService.js';
import './services/encryption/browser/encryptionService.js';
import './services/imageResize/browser/imageResizeService.js';
import './services/secrets/browser/secretStorageService.js';
import './services/workingCopy/browser/workingCopyBackupService.js';
import './services/tunnel/browser/tunnelService.js';
import './services/files/browser/elevatedFileService.js';
import './services/workingCopy/browser/workingCopyHistoryService.js';
import './services/userDataSync/browser/webUserDataSyncEnablementService.js';
import './services/userDataProfile/browser/userDataProfileStorageService.js';
import './services/configurationResolver/browser/configurationResolverService.js';
import '../platform/extensionResourceLoader/browser/extensionResourceLoaderService.js';
import './services/auxiliaryWindow/browser/auxiliaryWindowService.js';
import './services/browserElements/browser/webBrowserElementsService.js';

import { InstantiationType, registerSingleton } from '../platform/instantiation/common/extensions.js';
import { IAccessibilityService } from '../platform/accessibility/common/accessibility.js';
import { IContextMenuService } from '../platform/contextview/browser/contextView.js';
import { ContextMenuService } from '../platform/contextview/browser/contextMenuService.js';
import { IExtensionTipsService } from '../platform/extensionManagement/common/extensionManagement.js';
import { ExtensionTipsService } from '../platform/extensionManagement/common/extensionTipsService.js';
import { IWorkbenchExtensionManagementService } from './services/extensionManagement/common/extensionManagement.js';
import { ExtensionManagementService } from './services/extensionManagement/common/extensionManagementService.js';
import { LogLevel } from '../platform/log/common/log.js';
import { UserDataSyncMachinesService, IUserDataSyncMachinesService } from '../platform/userDataSync/common/userDataSyncMachines.js';
import { IUserDataSyncStoreService, IUserDataSyncService, IUserDataAutoSyncService, IUserDataSyncLocalStoreService, IUserDataSyncResourceProviderService } from '../platform/userDataSync/common/userDataSync.js';
import { UserDataSyncStoreService } from '../platform/userDataSync/common/userDataSyncStoreService.js';
import { UserDataSyncLocalStoreService } from '../platform/userDataSync/common/userDataSyncLocalStoreService.js';
import { UserDataSyncService } from '../platform/userDataSync/common/userDataSyncService.js';
import { IUserDataSyncAccountService, UserDataSyncAccountService } from '../platform/userDataSync/common/userDataSyncAccount.js';
import { UserDataAutoSyncService } from '../platform/userDataSync/common/userDataAutoSyncService.js';
import { AccessibilityService } from '../platform/accessibility/browser/accessibilityService.js';
import { ICustomEndpointTelemetryService } from '../platform/telemetry/common/telemetry.js';
import { NullEndpointTelemetryService } from '../platform/telemetry/common/telemetryUtils.js';
import { ITitleService } from './services/title/browser/titleService.js';
import { BrowserTitleService } from './browser/parts/titlebar/titlebarPart.js';
import { ITimerService, TimerService } from './services/timer/browser/timerService.js';
import { IDiagnosticsService, NullDiagnosticsService } from '../platform/diagnostics/common/diagnostics.js';
import { ILanguagePackService } from '../platform/languagePacks/common/languagePacks.js';
import { WebLanguagePacksService } from '../platform/languagePacks/browser/languagePacks.js';
import { IWebContentExtractorService, NullWebContentExtractorService, ISharedWebContentExtractorService, NullSharedWebContentExtractorService } from '../platform/webContentExtractor/common/webContentExtractor.js';
import { IMcpGalleryManifestService } from '../platform/mcp/common/mcpGalleryManifest.js';
import { WorkbenchMcpGalleryManifestService } from './services/mcp/browser/mcpGalleryManifestService.js';

registerSingleton(IWorkbenchExtensionManagementService, ExtensionManagementService, InstantiationType.Delayed);
registerSingleton(IAccessibilityService, AccessibilityService, InstantiationType.Delayed);
registerSingleton(IContextMenuService, ContextMenuService, InstantiationType.Delayed);
registerSingleton(IUserDataSyncStoreService, UserDataSyncStoreService, InstantiationType.Delayed);
registerSingleton(IUserDataSyncMachinesService, UserDataSyncMachinesService, InstantiationType.Delayed);
registerSingleton(IUserDataSyncLocalStoreService, UserDataSyncLocalStoreService, InstantiationType.Delayed);
registerSingleton(IUserDataSyncAccountService, UserDataSyncAccountService, InstantiationType.Delayed);
registerSingleton(IUserDataSyncService, UserDataSyncService, InstantiationType.Delayed);
registerSingleton(IUserDataSyncResourceProviderService, UserDataSyncResourceProviderService, InstantiationType.Delayed);
registerSingleton(IUserDataAutoSyncService, UserDataAutoSyncService, InstantiationType.Eager /* Eager to start auto sync */);
registerSingleton(ITitleService, BrowserTitleService, InstantiationType.Eager);
registerSingleton(IExtensionTipsService, ExtensionTipsService, InstantiationType.Delayed);
registerSingleton(ITimerService, TimerService, InstantiationType.Delayed);
registerSingleton(ICustomEndpointTelemetryService, NullEndpointTelemetryService, InstantiationType.Delayed);
registerSingleton(IDiagnosticsService, NullDiagnosticsService, InstantiationType.Delayed);
registerSingleton(ILanguagePackService, WebLanguagePacksService, InstantiationType.Delayed);
registerSingleton(IWebContentExtractorService, NullWebContentExtractorService, InstantiationType.Delayed);
registerSingleton(ISharedWebContentExtractorService, NullSharedWebContentExtractorService, InstantiationType.Delayed);
registerSingleton(IMcpGalleryManifestService, WorkbenchMcpGalleryManifestService, InstantiationType.Delayed);

//#endregion


//#region --- workbench contributions

// Logs
import './contrib/logs/browser/logs.contribution.js';

// Localization
import './contrib/localization/browser/localization.contribution.js';

// Performance
import './contrib/performance/browser/performance.web.contribution.js';

// Preferences
import './contrib/preferences/browser/keyboardLayoutPicker.js';

// Debug
import './contrib/debug/browser/extensionHostDebugService.js';

// Welcome Banner
import './contrib/welcomeBanner/browser/welcomeBanner.contribution.js';

// Webview
import './contrib/webview/browser/webview.web.contribution.js';

// Extensions Management
import './contrib/extensions/browser/extensions.web.contribution.js';

// Terminal
import './contrib/terminal/browser/terminal.web.contribution.js';
import './contrib/externalTerminal/browser/externalTerminal.contribution.js';
import './contrib/terminal/browser/terminalInstanceService.js';

// Tasks
import './contrib/tasks/browser/taskService.js';

// Tags
import './contrib/tags/browser/workspaceTagsService.js';

// Issues
import './contrib/issue/browser/issue.contribution.js';

// Splash
import './contrib/splash/browser/splash.contribution.js';

// Remote Start Entry for the Web
import './contrib/remote/browser/remoteStartEntry.contribution.js';

// Process Explorer
import './contrib/processExplorer/browser/processExplorer.web.contribution.js';

//#endregion


//#region --- export workbench factory

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//
// Do NOT change these exports in a way that something is removed unless
// intentional. These exports are used by web embedders and thus require
// an adoption when something changes.
//
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

import { create, commands, env, window, workspace, logger } from './browser/web.factory.js';
import { Menu } from './browser/web.api.js';
import { URI } from '../base/common/uri.js';
import { Event, Emitter } from '../base/common/event.js';
import { Disposable } from '../base/common/lifecycle.js';
import { GroupOrientation } from './services/editor/common/editorGroupsService.js';
import { UserDataSyncResourceProviderService } from '../platform/userDataSync/common/userDataSyncResourceProvider.js';
import { RemoteAuthorityResolverError, RemoteAuthorityResolverErrorCode } from '../platform/remote/common/remoteAuthorityResolver.js';

// TODO@esm remove me once we stop supporting our web-esm-bridge
// eslint-disable-next-line local/code-no-any-casts
if ((globalThis as any).__VSCODE_WEB_ESM_PROMISE) {
	const exports = {

		// Factory
		create: create,

		// Basic Types
		URI: URI,
		Event: Event,
		Emitter: Emitter,
		Disposable: Disposable,
		// GroupOrientation,
		LogLevel: LogLevel,
		RemoteAuthorityResolverError: RemoteAuthorityResolverError,
		RemoteAuthorityResolverErrorCode: RemoteAuthorityResolverErrorCode,

		// Facade API
		env: env,
		window: window,
		workspace: workspace,
		commands: commands,
		logger: logger,
		Menu: Menu
	};
	// eslint-disable-next-line local/code-no-any-casts
	(globalThis as any).__VSCODE_WEB_ESM_PROMISE(exports);
	// eslint-disable-next-line local/code-no-any-casts
	delete (globalThis as any).__VSCODE_WEB_ESM_PROMISE;
}

export {

	// Factory
	create,

	// Basic Types
	URI,
	Event,
	Emitter,
	Disposable,
	GroupOrientation,
	LogLevel,
	RemoteAuthorityResolverError,
	RemoteAuthorityResolverErrorCode,

	// Facade API
	env,
	window,
	workspace,
	commands,
	logger,
	Menu
};

//#endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/workbench.web.main.ts]---
Location: vscode-main/src/vs/workbench/workbench.web.main.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


// ####################################
// ###                              ###
// ### !!! PLEASE DO NOT MODIFY !!! ###
// ###                              ###
// ####################################

// TODO@esm remove me once we stop supporting our web-esm-bridge

(function () {

	// #region Types
	type IGlobalDefine = {
		(moduleName: string, dependencies: string[], callback: (...args: any[]) => any): any;
		(moduleName: string, dependencies: string[], definition: any): any;
		(moduleName: string, callback: (...args: any[]) => any): any;
		(moduleName: string, definition: any): any;
		(dependencies: string[], callback: (...args: any[]) => any): any;
		(dependencies: string[], definition: any): any;
	};

	interface ILoaderPlugin {
		load: (pluginParam: string, parentRequire: IRelativeRequire, loadCallback: IPluginLoadCallback, options: IConfigurationOptions) => void;
		write?: (pluginName: string, moduleName: string, write: IPluginWriteCallback) => void;
		writeFile?: (pluginName: string, moduleName: string, req: IRelativeRequire, write: IPluginWriteFileCallback, config: IConfigurationOptions) => void;
		finishBuild?: (write: (filename: string, contents: string) => void) => void;
	}
	interface IRelativeRequire {
		(dependencies: string[], callback: Function, errorback?: (error: Error) => void): void;
		toUrl(id: string): string;
	}
	interface IPluginLoadCallback {
		(value: any): void;
		error(err: any): void;
	}
	interface IConfigurationOptions {
		isBuild: boolean | undefined;
		[key: string]: any;
	}
	interface IPluginWriteCallback {
		(contents: string): void;
		getEntryPoint(): string;
		asModule(moduleId: string, contents: string): void;
	}
	interface IPluginWriteFileCallback {
		(filename: string, contents: string): void;
		getEntryPoint(): string;
		asModule(moduleId: string, contents: string): void;
	}

	//#endregion

	// eslint-disable-next-line local/code-no-any-casts
	const define: IGlobalDefine = (globalThis as any).define;
	// eslint-disable-next-line local/code-no-any-casts
	const require: { getConfig?(): any } | undefined = (globalThis as any).require;

	if (!define || !require || typeof require.getConfig !== 'function') {
		throw new Error('Expected global define() and require() functions. Please only load this module in an AMD context!');
	}

	let baseUrl = require?.getConfig().baseUrl;
	if (!baseUrl) {
		throw new Error('Failed to determine baseUrl for loading AMD modules (tried require.getConfig().baseUrl)');
	}
	if (!baseUrl.endsWith('/')) {
		baseUrl = baseUrl + '/';
	}
	globalThis._VSCODE_FILE_ROOT = baseUrl;

	const trustedTypesPolicy: Pick<import('trusted-types/lib/index.js').TrustedTypePolicy<{ createScriptURL(value: string): string }>, 'name' | 'createScriptURL'> | undefined = require.getConfig().trustedTypesPolicy;
	if (trustedTypesPolicy) {
		globalThis._VSCODE_WEB_PACKAGE_TTP = trustedTypesPolicy;
	}

	const promise = new Promise(resolve => {
		// eslint-disable-next-line local/code-no-any-casts
		(globalThis as any).__VSCODE_WEB_ESM_PROMISE = resolve;
	});

	define('vs/web-api', [], (): ILoaderPlugin => {
		return {
			load: (_name, _req, _load, _config) => {
				const script: any = document.createElement('script');
				script.type = 'module';
				// eslint-disable-next-line local/code-no-any-casts
				script.src = trustedTypesPolicy ? trustedTypesPolicy.createScriptURL(`${baseUrl}vs/workbench/workbench.web.main.internal.js`) as any as string : `${baseUrl}vs/workbench/workbench.web.main.internal.js`;
				document.head.appendChild(script);

				return promise.then(mod => _load(mod));
			}
		};
	});

	define(
		'vs/workbench/workbench.web.main',
		['require', 'exports', 'vs/web-api!'],
		function (_require, exports, webApi) {
			Object.assign(exports, webApi);
		}
	);
})();
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/extensionHost.contribution.ts]---
Location: vscode-main/src/vs/workbench/api/browser/extensionHost.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IWorkbenchContribution, WorkbenchPhase, registerWorkbenchContribution2 } from '../../common/contributions.js';
import { IInstantiationService } from '../../../platform/instantiation/common/instantiation.js';

// --- other interested parties
import { JSONValidationExtensionPoint } from '../common/jsonValidationExtensionPoint.js';
import { ColorExtensionPoint } from '../../services/themes/common/colorExtensionPoint.js';
import { IconExtensionPoint } from '../../services/themes/common/iconExtensionPoint.js';
import { TokenClassificationExtensionPoints } from '../../services/themes/common/tokenClassificationExtensionPoint.js';
import { LanguageConfigurationFileHandler } from '../../contrib/codeEditor/common/languageConfigurationExtensionPoint.js';
import { StatusBarItemsExtensionPoint } from './statusBarExtensionPoint.js';

// --- mainThread participants
import './mainThreadLocalization.js';
import './mainThreadBulkEdits.js';
import './mainThreadLanguageModels.js';
import './mainThreadChatAgents2.js';
import './mainThreadChatCodeMapper.js';
import './mainThreadLanguageModelTools.js';
import './mainThreadEmbeddings.js';
import './mainThreadCodeInsets.js';
import './mainThreadCLICommands.js';
import './mainThreadClipboard.js';
import './mainThreadCommands.js';
import './mainThreadConfiguration.js';
import './mainThreadConsole.js';
import './mainThreadDebugService.js';
import './mainThreadDecorations.js';
import './mainThreadDiagnostics.js';
import './mainThreadDialogs.js';
import './mainThreadDocumentContentProviders.js';
import './mainThreadDocuments.js';
import './mainThreadDocumentsAndEditors.js';
import './mainThreadEditor.js';
import './mainThreadEditors.js';
import './mainThreadEditorTabs.js';
import './mainThreadErrors.js';
import './mainThreadExtensionService.js';
import './mainThreadFileSystem.js';
import './mainThreadFileSystemEventService.js';
import './mainThreadLanguageFeatures.js';
import './mainThreadLanguages.js';
import './mainThreadLogService.js';
import './mainThreadMessageService.js';
import './mainThreadManagedSockets.js';
import './mainThreadOutputService.js';
import './mainThreadProgress.js';
import './mainThreadQuickDiff.js';
import './mainThreadQuickOpen.js';
import './mainThreadRemoteConnectionData.js';
import './mainThreadSaveParticipant.js';
import './mainThreadSpeech.js';
import './mainThreadEditSessionIdentityParticipant.js';
import './mainThreadSCM.js';
import './mainThreadSearch.js';
import './mainThreadStatusBar.js';
import './mainThreadStorage.js';
import './mainThreadTelemetry.js';
import './mainThreadTerminalService.js';
import './mainThreadTerminalShellIntegration.js';
import './mainThreadTheming.js';
import './mainThreadTreeViews.js';
import './mainThreadDownloadService.js';
import './mainThreadUrls.js';
import './mainThreadUriOpeners.js';
import './mainThreadWindow.js';
import './mainThreadWebviewManager.js';
import './mainThreadWorkspace.js';
import './mainThreadComments.js';
import './mainThreadNotebook.js';
import './mainThreadNotebookKernels.js';
import './mainThreadNotebookDocumentsAndEditors.js';
import './mainThreadNotebookRenderers.js';
import './mainThreadNotebookSaveParticipant.js';
import './mainThreadInteractive.js';
import './mainThreadTask.js';
import './mainThreadLabelService.js';
import './mainThreadTunnelService.js';
import './mainThreadAuthentication.js';
import './mainThreadTimeline.js';
import './mainThreadTesting.js';
import './mainThreadSecretState.js';
import './mainThreadShare.js';
import './mainThreadProfileContentHandlers.js';
import './mainThreadAiRelatedInformation.js';
import './mainThreadAiEmbeddingVector.js';
import './mainThreadAiSettingsSearch.js';
import './mainThreadMcp.js';
import './mainThreadChatContext.js';
import './mainThreadChatStatus.js';
import './mainThreadChatOutputRenderer.js';
import './mainThreadChatSessions.js';
import './mainThreadDataChannels.js';

export class ExtensionPoints implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.extensionPoints';

	constructor(
		@IInstantiationService private readonly instantiationService: IInstantiationService
	) {
		// Classes that handle extension points...
		this.instantiationService.createInstance(JSONValidationExtensionPoint);
		this.instantiationService.createInstance(ColorExtensionPoint);
		this.instantiationService.createInstance(IconExtensionPoint);
		this.instantiationService.createInstance(TokenClassificationExtensionPoints);
		this.instantiationService.createInstance(LanguageConfigurationFileHandler);
		this.instantiationService.createInstance(StatusBarItemsExtensionPoint);
	}
}

registerWorkbenchContribution2(ExtensionPoints.ID, ExtensionPoints, WorkbenchPhase.BlockStartup);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadAiEmbeddingVector.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadAiEmbeddingVector.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../base/common/cancellation.js';
import { Disposable, DisposableMap } from '../../../base/common/lifecycle.js';
import { ExtHostAiEmbeddingVectorShape, ExtHostContext, MainContext, MainThreadAiEmbeddingVectorShape } from '../common/extHost.protocol.js';
import { IAiEmbeddingVectorProvider, IAiEmbeddingVectorService } from '../../services/aiEmbeddingVector/common/aiEmbeddingVectorService.js';
import { IExtHostContext, extHostNamedCustomer } from '../../services/extensions/common/extHostCustomers.js';

@extHostNamedCustomer(MainContext.MainThreadAiEmbeddingVector)
export class MainThreadAiEmbeddingVector extends Disposable implements MainThreadAiEmbeddingVectorShape {
	private readonly _proxy: ExtHostAiEmbeddingVectorShape;
	private readonly _registrations = this._register(new DisposableMap<number>());

	constructor(
		context: IExtHostContext,
		@IAiEmbeddingVectorService private readonly _AiEmbeddingVectorService: IAiEmbeddingVectorService,
	) {
		super();
		this._proxy = context.getProxy(ExtHostContext.ExtHostAiEmbeddingVector);
	}

	$registerAiEmbeddingVectorProvider(model: string, handle: number): void {
		const provider: IAiEmbeddingVectorProvider = {
			provideAiEmbeddingVector: (strings: string[], token: CancellationToken) => {
				return this._proxy.$provideAiEmbeddingVector(
					handle,
					strings,
					token
				);
			},
		};
		this._registrations.set(handle, this._AiEmbeddingVectorService.registerAiEmbeddingVectorProvider(model, provider));
	}

	$unregisterAiEmbeddingVectorProvider(handle: number): void {
		this._registrations.deleteAndDispose(handle);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadAiRelatedInformation.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadAiRelatedInformation.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../base/common/cancellation.js';
import { Disposable, DisposableMap } from '../../../base/common/lifecycle.js';
import { ExtHostAiRelatedInformationShape, ExtHostContext, MainContext, MainThreadAiRelatedInformationShape } from '../common/extHost.protocol.js';
import { RelatedInformationType } from '../common/extHostTypes.js';
import { IAiRelatedInformationProvider, IAiRelatedInformationService, RelatedInformationResult } from '../../services/aiRelatedInformation/common/aiRelatedInformation.js';
import { IExtHostContext, extHostNamedCustomer } from '../../services/extensions/common/extHostCustomers.js';

@extHostNamedCustomer(MainContext.MainThreadAiRelatedInformation)
export class MainThreadAiRelatedInformation extends Disposable implements MainThreadAiRelatedInformationShape {
	private readonly _proxy: ExtHostAiRelatedInformationShape;
	private readonly _registrations = this._register(new DisposableMap<number>());

	constructor(
		context: IExtHostContext,
		@IAiRelatedInformationService private readonly _aiRelatedInformationService: IAiRelatedInformationService,
	) {
		super();
		this._proxy = context.getProxy(ExtHostContext.ExtHostAiRelatedInformation);
	}

	$getAiRelatedInformation(query: string, types: RelatedInformationType[]): Promise<RelatedInformationResult[]> {
		// TODO: use a real cancellation token
		return this._aiRelatedInformationService.getRelatedInformation(query, types, CancellationToken.None);
	}

	$registerAiRelatedInformationProvider(handle: number, type: RelatedInformationType): void {
		const provider: IAiRelatedInformationProvider = {
			provideAiRelatedInformation: (query, token) => {
				return this._proxy.$provideAiRelatedInformation(handle, query, token);
			},
		};
		this._registrations.set(handle, this._aiRelatedInformationService.registerAiRelatedInformationProvider(type, provider));
	}

	$unregisterAiRelatedInformationProvider(handle: number): void {
		this._registrations.deleteAndDispose(handle);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadAiSettingsSearch.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadAiSettingsSearch.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, DisposableMap } from '../../../base/common/lifecycle.js';
import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { AiSettingsSearchResult, IAiSettingsSearchProvider, IAiSettingsSearchService } from '../../services/aiSettingsSearch/common/aiSettingsSearch.js';
import { ExtHostContext, ExtHostAiSettingsSearchShape, MainContext, MainThreadAiSettingsSearchShape, } from '../common/extHost.protocol.js';

@extHostNamedCustomer(MainContext.MainThreadAiSettingsSearch)
export class MainThreadAiSettingsSearch extends Disposable implements MainThreadAiSettingsSearchShape {
	private readonly _proxy: ExtHostAiSettingsSearchShape;
	private readonly _registrations = this._register(new DisposableMap<number>());

	constructor(
		context: IExtHostContext,
		@IAiSettingsSearchService private readonly _settingsSearchService: IAiSettingsSearchService,
	) {
		super();
		this._proxy = context.getProxy(ExtHostContext.ExtHostAiSettingsSearch);
	}

	$registerAiSettingsSearchProvider(handle: number): void {
		const provider: IAiSettingsSearchProvider = {
			searchSettings: (query, option, token) => {
				return this._proxy.$startSearch(handle, query, option, token);
			}
		};
		this._registrations.set(handle, this._settingsSearchService.registerSettingsSearchProvider(provider));
	}

	$unregisterAiSettingsSearchProvider(handle: number): void {
		this._registrations.deleteAndDispose(handle);
	}

	$handleSearchResult(handle: number, result: AiSettingsSearchResult): void {
		if (!this._registrations.has(handle)) {
			throw new Error(`No AI settings search provider found`);
		}

		this._settingsSearchService.handleSearchResult(result);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadAuthentication.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadAuthentication.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, DisposableMap } from '../../../base/common/lifecycle.js';
import * as nls from '../../../nls.js';
import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { AuthenticationSession, AuthenticationSessionsChangeEvent, IAuthenticationProvider, IAuthenticationService, IAuthenticationExtensionsService, AuthenticationSessionAccount, IAuthenticationProviderSessionOptions, isAuthenticationWwwAuthenticateRequest, IAuthenticationConstraint, IAuthenticationWwwAuthenticateRequest } from '../../services/authentication/common/authentication.js';
import { ExtHostAuthenticationShape, ExtHostContext, IRegisterAuthenticationProviderDetails, IRegisterDynamicAuthenticationProviderDetails, MainContext, MainThreadAuthenticationShape } from '../common/extHost.protocol.js';
import { IDialogService, IPromptButton } from '../../../platform/dialogs/common/dialogs.js';
import Severity from '../../../base/common/severity.js';
import { INotificationService } from '../../../platform/notification/common/notification.js';
import { ActivationKind, IExtensionService } from '../../services/extensions/common/extensions.js';
import { ITelemetryService } from '../../../platform/telemetry/common/telemetry.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { IAuthenticationAccessService } from '../../services/authentication/browser/authenticationAccessService.js';
import { IAuthenticationUsageService } from '../../services/authentication/browser/authenticationUsageService.js';
import { getAuthenticationProviderActivationEvent } from '../../services/authentication/browser/authenticationService.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { IOpenerService } from '../../../platform/opener/common/opener.js';
import { CancellationError } from '../../../base/common/errors.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { ExtensionHostKind } from '../../services/extensions/common/extensionHostKind.js';
import { IURLService } from '../../../platform/url/common/url.js';
import { DeferredPromise, raceTimeout } from '../../../base/common/async.js';
import { IAuthorizationTokenResponse } from '../../../base/common/oauth.js';
import { IDynamicAuthenticationProviderStorageService } from '../../services/authentication/common/dynamicAuthenticationProviderStorage.js';
import { IClipboardService } from '../../../platform/clipboard/common/clipboardService.js';
import { IQuickInputService } from '../../../platform/quickinput/common/quickInput.js';
import { IProductService } from '../../../platform/product/common/productService.js';

export interface AuthenticationInteractiveOptions {
	detail?: string;
	learnMore?: UriComponents;
	sessionToRecreate?: AuthenticationSession;
}

export interface AuthenticationGetSessionOptions {
	clearSessionPreference?: boolean;
	createIfNone?: boolean | AuthenticationInteractiveOptions;
	forceNewSession?: boolean | AuthenticationInteractiveOptions;
	silent?: boolean;
	account?: AuthenticationSessionAccount;
	authorizationServer?: UriComponents;
}

class MainThreadAuthenticationProvider extends Disposable implements IAuthenticationProvider {

	readonly onDidChangeSessions: Event<AuthenticationSessionsChangeEvent>;

	constructor(
		protected readonly _proxy: ExtHostAuthenticationShape,
		public readonly id: string,
		public readonly label: string,
		public readonly supportsMultipleAccounts: boolean,
		public readonly authorizationServers: ReadonlyArray<URI>,
		public readonly resourceServer: URI | undefined,
		onDidChangeSessionsEmitter: Emitter<AuthenticationSessionsChangeEvent>,
	) {
		super();
		this.onDidChangeSessions = onDidChangeSessionsEmitter.event;
	}

	async getSessions(scopes: string[] | undefined, options: IAuthenticationProviderSessionOptions) {
		return this._proxy.$getSessions(this.id, scopes, options);
	}

	createSession(scopes: string[], options: IAuthenticationProviderSessionOptions): Promise<AuthenticationSession> {
		return this._proxy.$createSession(this.id, scopes, options);
	}

	async removeSession(sessionId: string): Promise<void> {
		await this._proxy.$removeSession(this.id, sessionId);
	}
}

class MainThreadAuthenticationProviderWithChallenges extends MainThreadAuthenticationProvider implements IAuthenticationProvider {

	constructor(
		proxy: ExtHostAuthenticationShape,
		id: string,
		label: string,
		supportsMultipleAccounts: boolean,
		authorizationServers: ReadonlyArray<URI>,
		resourceServer: URI | undefined,
		onDidChangeSessionsEmitter: Emitter<AuthenticationSessionsChangeEvent>,
	) {
		super(
			proxy,
			id,
			label,
			supportsMultipleAccounts,
			authorizationServers,
			resourceServer,
			onDidChangeSessionsEmitter
		);
	}

	getSessionsFromChallenges(constraint: IAuthenticationConstraint, options: IAuthenticationProviderSessionOptions): Promise<readonly AuthenticationSession[]> {
		return this._proxy.$getSessionsFromChallenges(this.id, constraint, options);
	}

	createSessionFromChallenges(constraint: IAuthenticationConstraint, options: IAuthenticationProviderSessionOptions): Promise<AuthenticationSession> {
		return this._proxy.$createSessionFromChallenges(this.id, constraint, options);
	}
}

@extHostNamedCustomer(MainContext.MainThreadAuthentication)
export class MainThreadAuthentication extends Disposable implements MainThreadAuthenticationShape {
	private readonly _proxy: ExtHostAuthenticationShape;

	private readonly _registrations = this._register(new DisposableMap<string>());
	private _sentProviderUsageEvents = new Set<string>();
	private _suppressUnregisterEvent = false;

	constructor(
		extHostContext: IExtHostContext,
		@IProductService private readonly productService: IProductService,
		@IAuthenticationService private readonly authenticationService: IAuthenticationService,
		@IAuthenticationExtensionsService private readonly authenticationExtensionsService: IAuthenticationExtensionsService,
		@IAuthenticationAccessService private readonly authenticationAccessService: IAuthenticationAccessService,
		@IAuthenticationUsageService private readonly authenticationUsageService: IAuthenticationUsageService,
		@IDialogService private readonly dialogService: IDialogService,
		@INotificationService private readonly notificationService: INotificationService,
		@IExtensionService private readonly extensionService: IExtensionService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IOpenerService private readonly openerService: IOpenerService,
		@ILogService private readonly logService: ILogService,
		@IURLService private readonly urlService: IURLService,
		@IDynamicAuthenticationProviderStorageService private readonly dynamicAuthProviderStorageService: IDynamicAuthenticationProviderStorageService,
		@IClipboardService private readonly clipboardService: IClipboardService,
		@IQuickInputService private readonly quickInputService: IQuickInputService
	) {
		super();
		this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostAuthentication);

		this._register(this.authenticationService.onDidChangeSessions(e => this._proxy.$onDidChangeAuthenticationSessions(e.providerId, e.label)));
		this._register(this.authenticationService.onDidUnregisterAuthenticationProvider(e => {
			if (!this._suppressUnregisterEvent) {
				this._proxy.$onDidUnregisterAuthenticationProvider(e.id);
			}
		}));
		this._register(this.authenticationExtensionsService.onDidChangeAccountPreference(e => {
			const providerInfo = this.authenticationService.getProvider(e.providerId);
			this._proxy.$onDidChangeAuthenticationSessions(providerInfo.id, providerInfo.label, e.extensionIds);
		}));

		// Listen for dynamic authentication provider token changes
		this._register(this.dynamicAuthProviderStorageService.onDidChangeTokens(e => {
			this._proxy.$onDidChangeDynamicAuthProviderTokens(e.authProviderId, e.clientId, e.tokens);
		}));

		this._register(authenticationService.registerAuthenticationProviderHostDelegate({
			// Prefer Node.js extension hosts when they're available. No CORS issues etc.
			priority: extHostContext.extensionHostKind === ExtensionHostKind.LocalWebWorker ? 0 : 1,
			create: async (authorizationServer, serverMetadata, resource) => {
				// Auth Provider Id is a combination of the authorization server and the resource, if provided.
				const authProviderId = resource ? `${authorizationServer.toString(true)} ${resource.resource}` : authorizationServer.toString(true);
				const clientDetails = await this.dynamicAuthProviderStorageService.getClientRegistration(authProviderId);
				let clientId = clientDetails?.clientId;
				const clientSecret = clientDetails?.clientSecret;
				let initialTokens: (IAuthorizationTokenResponse & { created_at: number })[] | undefined = undefined;
				if (clientId) {
					initialTokens = await this.dynamicAuthProviderStorageService.getSessionsForDynamicAuthProvider(authProviderId, clientId);
					// If we don't already have a client id, check if the server supports the Client Id Metadata flow (see docs on the property)
					// and add the "client id" if so.
				} else if (serverMetadata.client_id_metadata_document_supported) {
					clientId = this.productService.authClientIdMetadataUrl;
				}
				return await this._proxy.$registerDynamicAuthProvider(
					authorizationServer,
					serverMetadata,
					resource,
					clientId,
					clientSecret,
					initialTokens
				);
			}
		}));
	}

	async $registerAuthenticationProvider({ id, label, supportsMultipleAccounts, resourceServer, supportedAuthorizationServers, supportsChallenges }: IRegisterAuthenticationProviderDetails): Promise<void> {
		if (!this.authenticationService.declaredProviders.find(p => p.id === id)) {
			// If telemetry shows that this is not happening much, we can instead throw an error here.
			this.logService.warn(`Authentication provider ${id} was not declared in the Extension Manifest.`);
			type AuthProviderNotDeclaredClassification = {
				owner: 'TylerLeonhardt';
				comment: 'An authentication provider was not declared in the Extension Manifest.';
				id: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The provider id.' };
			};
			this.telemetryService.publicLog2<{ id: string }, AuthProviderNotDeclaredClassification>('authentication.providerNotDeclared', { id });
		}
		const emitter = new Emitter<AuthenticationSessionsChangeEvent>();
		this._registrations.set(id, emitter);
		const supportedAuthorizationServerUris = (supportedAuthorizationServers ?? []).map(i => URI.revive(i));
		const provider =
			supportsChallenges
				? new MainThreadAuthenticationProviderWithChallenges(
					this._proxy,
					id,
					label,
					supportsMultipleAccounts,
					supportedAuthorizationServerUris,
					resourceServer ? URI.revive(resourceServer) : undefined,
					emitter
				)
				: new MainThreadAuthenticationProvider(
					this._proxy,
					id,
					label,
					supportsMultipleAccounts,
					supportedAuthorizationServerUris,
					resourceServer ? URI.revive(resourceServer) : undefined,
					emitter
				);
		this.authenticationService.registerAuthenticationProvider(id, provider);
	}

	async $unregisterAuthenticationProvider(id: string): Promise<void> {
		this._registrations.deleteAndDispose(id);
		// The ext host side already unregisters the provider, so we can suppress the event here.
		this._suppressUnregisterEvent = true;
		try {
			this.authenticationService.unregisterAuthenticationProvider(id);
		} finally {
			this._suppressUnregisterEvent = false;
		}
	}

	async $ensureProvider(id: string): Promise<void> {
		if (!this.authenticationService.isAuthenticationProviderRegistered(id)) {
			return await this.extensionService.activateByEvent(getAuthenticationProviderActivationEvent(id), ActivationKind.Immediate);
		}
	}

	async $sendDidChangeSessions(providerId: string, event: AuthenticationSessionsChangeEvent): Promise<void> {
		const obj = this._registrations.get(providerId);
		if (obj instanceof Emitter) {
			obj.fire(event);
		}
	}

	$removeSession(providerId: string, sessionId: string): Promise<void> {
		return this.authenticationService.removeSession(providerId, sessionId);
	}

	async $waitForUriHandler(expectedUri: UriComponents): Promise<UriComponents> {
		const deferredPromise = new DeferredPromise<UriComponents>();
		const disposable = this.urlService.registerHandler({
			handleURL: async (uri: URI) => {
				if (uri.scheme !== expectedUri.scheme || uri.authority !== expectedUri.authority || uri.path !== expectedUri.path) {
					return false;
				}
				deferredPromise.complete(uri);
				disposable.dispose();
				return true;
			}
		});
		const result = await raceTimeout(deferredPromise.p, 5 * 60 * 1000); // 5 minutes
		if (!result) {
			throw new Error('Timed out waiting for URI handler');
		}
		return await deferredPromise.p;
	}

	$showContinueNotification(message: string): Promise<boolean> {
		const yes = nls.localize('yes', "Yes");
		const no = nls.localize('no', "No");
		const deferredPromise = new DeferredPromise<boolean>();
		let result = false;
		const handle = this.notificationService.prompt(
			Severity.Warning,
			message,
			[{
				label: yes,
				run: () => result = true
			}, {
				label: no,
				run: () => result = false
			}]);
		const disposable = handle.onDidClose(() => {
			deferredPromise.complete(result);
			disposable.dispose();
		});
		return deferredPromise.p;
	}

	async $registerDynamicAuthenticationProvider(details: IRegisterDynamicAuthenticationProviderDetails): Promise<void> {
		await this.$registerAuthenticationProvider({
			id: details.id,
			label: details.label,
			supportsMultipleAccounts: true,
			supportedAuthorizationServers: [details.authorizationServer],
			resourceServer: details.resourceServer,
		});
		await this.dynamicAuthProviderStorageService.storeClientRegistration(details.id, URI.revive(details.authorizationServer).toString(true), details.clientId, details.clientSecret, details.label);
	}

	async $setSessionsForDynamicAuthProvider(authProviderId: string, clientId: string, sessions: (IAuthorizationTokenResponse & { created_at: number })[]): Promise<void> {
		await this.dynamicAuthProviderStorageService.setSessionsForDynamicAuthProvider(authProviderId, clientId, sessions);
	}

	async $sendDidChangeDynamicProviderInfo({ providerId, clientId, authorizationServer, label, clientSecret }: Partial<{ providerId: string; clientId: string; authorizationServer: UriComponents; label: string; clientSecret: string }>): Promise<void> {
		this.logService.info(`Client ID for authentication provider ${providerId} changed to ${clientId}`);
		const existing = this.dynamicAuthProviderStorageService.getInteractedProviders().find(p => p.providerId === providerId);
		if (!existing) {
			throw new Error(`Dynamic authentication provider ${providerId} not found. Has it been registered?`);
		}

		// Store client credentials together
		await this.dynamicAuthProviderStorageService.storeClientRegistration(
			providerId || existing.providerId,
			authorizationServer ? URI.revive(authorizationServer).toString(true) : existing.authorizationServer,
			clientId || existing.clientId,
			clientSecret,
			label || existing.label
		);
	}

	private async loginPrompt(provider: IAuthenticationProvider, extensionName: string, recreatingSession: boolean, options?: AuthenticationInteractiveOptions): Promise<boolean> {
		let message: string;

		// Check if the provider has a custom confirmation message
		const customMessage = provider.confirmation?.(extensionName, recreatingSession);
		if (customMessage) {
			message = customMessage;
		} else {
			message = recreatingSession
				? nls.localize('confirmRelogin', "The extension '{0}' wants you to sign in again using {1}.", extensionName, provider.label)
				: nls.localize('confirmLogin', "The extension '{0}' wants to sign in using {1}.", extensionName, provider.label);
		}

		const buttons: IPromptButton<boolean | undefined>[] = [
			{
				label: nls.localize({ key: 'allow', comment: ['&& denotes a mnemonic'] }, "&&Allow"),
				run() {
					return true;
				},
			}
		];
		if (options?.learnMore) {
			buttons.push({
				label: nls.localize('learnMore', "Learn more"),
				run: async () => {
					const result = this.loginPrompt(provider, extensionName, recreatingSession, options);
					await this.openerService.open(URI.revive(options.learnMore!), { allowCommands: true });
					return await result;
				}
			});
		}
		const { result } = await this.dialogService.prompt({
			type: Severity.Info,
			message,
			buttons,
			detail: options?.detail,
			cancelButton: true,
		});

		return result ?? false;
	}

	private async continueWithIncorrectAccountPrompt(chosenAccountLabel: string, requestedAccountLabel: string): Promise<boolean> {
		const result = await this.dialogService.prompt({
			message: nls.localize('incorrectAccount', "Incorrect account detected"),
			detail: nls.localize('incorrectAccountDetail', "The chosen account, {0}, does not match the requested account, {1}.", chosenAccountLabel, requestedAccountLabel),
			type: Severity.Warning,
			cancelButton: true,
			buttons: [
				{
					label: nls.localize('keep', 'Keep {0}', chosenAccountLabel),
					run: () => chosenAccountLabel
				},
				{
					label: nls.localize('loginWith', 'Login with {0}', requestedAccountLabel),
					run: () => requestedAccountLabel
				}
			],
		});

		if (!result.result) {
			throw new CancellationError();
		}

		return result.result === chosenAccountLabel;
	}

	private async doGetSession(providerId: string, scopeListOrRequest: ReadonlyArray<string> | IAuthenticationWwwAuthenticateRequest, extensionId: string, extensionName: string, options: AuthenticationGetSessionOptions): Promise<AuthenticationSession | undefined> {
		const authorizationServer = URI.revive(options.authorizationServer);
		const sessions = await this.authenticationService.getSessions(providerId, scopeListOrRequest, { account: options.account, authorizationServer }, true);
		const provider = this.authenticationService.getProvider(providerId);

		// Error cases
		if (options.forceNewSession && options.createIfNone) {
			throw new Error('Invalid combination of options. Please remove one of the following: forceNewSession, createIfNone');
		}
		if (options.forceNewSession && options.silent) {
			throw new Error('Invalid combination of options. Please remove one of the following: forceNewSession, silent');
		}
		if (options.createIfNone && options.silent) {
			throw new Error('Invalid combination of options. Please remove one of the following: createIfNone, silent');
		}

		if (options.clearSessionPreference) {
			// Clearing the session preference is usually paired with createIfNone, so just remove the preference and
			// defer to the rest of the logic in this function to choose the session.
			this.authenticationExtensionsService.removeAccountPreference(extensionId, providerId);
		}

		const matchingAccountPreferenceSession =
			// If an account was passed in, that takes precedence over the account preference
			options.account
				// We only support one session per account per set of scopes so grab the first one here
				? sessions[0]
				: this._getAccountPreference(extensionId, providerId, sessions);

		// Check if the sessions we have are valid
		if (!options.forceNewSession && sessions.length) {
			// If we have an existing session preference, use that. If not, we'll return any valid session at the end of this function.
			if (matchingAccountPreferenceSession && this.authenticationAccessService.isAccessAllowed(providerId, matchingAccountPreferenceSession.account.label, extensionId)) {
				return matchingAccountPreferenceSession;
			}
			// If we only have one account for a single auth provider, lets just check if it's allowed and return it if it is.
			if (!provider.supportsMultipleAccounts && this.authenticationAccessService.isAccessAllowed(providerId, sessions[0].account.label, extensionId)) {
				return sessions[0];
			}
		}

		// We may need to prompt because we don't have a valid session
		// modal flows
		if (options.createIfNone || options.forceNewSession) {
			let uiOptions: AuthenticationInteractiveOptions | undefined;
			if (typeof options.forceNewSession === 'object') {
				uiOptions = options.forceNewSession;
			} else if (typeof options.createIfNone === 'object') {
				uiOptions = options.createIfNone;
			}

			// We only want to show the "recreating session" prompt if we are using forceNewSession & there are sessions
			// that we will be "forcing through".
			const recreatingSession = !!(options.forceNewSession && sessions.length);
			const isAllowed = await this.loginPrompt(provider, extensionName, recreatingSession, uiOptions);
			if (!isAllowed) {
				throw new Error('User did not consent to login.');
			}

			let session: AuthenticationSession;
			if (sessions?.length && !options.forceNewSession) {
				session = provider.supportsMultipleAccounts && !options.account
					? await this.authenticationExtensionsService.selectSession(providerId, extensionId, extensionName, scopeListOrRequest, sessions)
					: sessions[0];
			} else {
				const accountToCreate: AuthenticationSessionAccount | undefined = options.account ?? matchingAccountPreferenceSession?.account;
				do {
					session = await this.authenticationService.createSession(
						providerId,
						scopeListOrRequest,
						{
							activateImmediate: true,
							account: accountToCreate,
							authorizationServer
						});
				} while (
					accountToCreate
					&& accountToCreate.label !== session.account.label
					&& !await this.continueWithIncorrectAccountPrompt(session.account.label, accountToCreate.label)
				);
			}

			this.authenticationAccessService.updateAllowedExtensions(providerId, session.account.label, [{ id: extensionId, name: extensionName, allowed: true }]);
			this.authenticationExtensionsService.updateNewSessionRequests(providerId, [session]);
			this.authenticationExtensionsService.updateAccountPreference(extensionId, providerId, session.account);
			return session;
		}

		// For the silent flows, if we have a session but we don't have a session preference, we'll return the first one that is valid.
		if (!matchingAccountPreferenceSession && !this.authenticationExtensionsService.getAccountPreference(extensionId, providerId)) {
			const validSession = sessions.find(session => this.authenticationAccessService.isAccessAllowed(providerId, session.account.label, extensionId));
			if (validSession) {
				return validSession;
			}
		}

		// passive flows (silent or default)
		if (!options.silent) {
			// If there is a potential session, but the extension doesn't have access to it, use the "grant access" flow,
			// otherwise request a new one.
			sessions.length
				? this.authenticationExtensionsService.requestSessionAccess(providerId, extensionId, extensionName, scopeListOrRequest, sessions)
				: await this.authenticationExtensionsService.requestNewSession(providerId, scopeListOrRequest, extensionId, extensionName);
		}
		return undefined;
	}

	async $getSession(providerId: string, scopeListOrRequest: ReadonlyArray<string> | IAuthenticationWwwAuthenticateRequest, extensionId: string, extensionName: string, options: AuthenticationGetSessionOptions): Promise<AuthenticationSession | undefined> {
		const scopes = isAuthenticationWwwAuthenticateRequest(scopeListOrRequest) ? scopeListOrRequest.fallbackScopes : scopeListOrRequest;
		if (scopes) {
			this.sendClientIdUsageTelemetry(extensionId, providerId, scopes);
		}
		const session = await this.doGetSession(providerId, scopeListOrRequest, extensionId, extensionName, options);

		if (session) {
			this.sendProviderUsageTelemetry(extensionId, providerId);
			this.authenticationUsageService.addAccountUsage(providerId, session.account.label, session.scopes, extensionId, extensionName);
		}

		return session;
	}

	async $getAccounts(providerId: string): Promise<ReadonlyArray<AuthenticationSessionAccount>> {
		const accounts = await this.authenticationService.getAccounts(providerId);
		return accounts;
	}

	// TODO@TylerLeonhardt this is a temporary addition to telemetry to understand what extensions are overriding the client id.
	// We can use this telemetry to reach out to these extension authors and let them know that they many need configuration changes
	// due to the adoption of the Microsoft broker.
	// Remove this in a few iterations.
	private _sentClientIdUsageEvents = new Set<string>();
	private sendClientIdUsageTelemetry(extensionId: string, providerId: string, scopes: readonly string[]): void {
		const containsVSCodeClientIdScope = scopes.some(scope => scope.startsWith('VSCODE_CLIENT_ID:'));
		const key = `${extensionId}|${providerId}|${containsVSCodeClientIdScope}`;
		if (this._sentClientIdUsageEvents.has(key)) {
			return;
		}
		this._sentClientIdUsageEvents.add(key);
		if (containsVSCodeClientIdScope) {
			type ClientIdUsageClassification = {
				owner: 'TylerLeonhardt';
				comment: 'Used to see which extensions are using the VSCode client id override';
				extensionId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The extension id.' };
			};
			this.telemetryService.publicLog2<{ extensionId: string }, ClientIdUsageClassification>('authentication.clientIdUsage', { extensionId });
		}
	}

	private sendProviderUsageTelemetry(extensionId: string, providerId: string): void {
		const key = `${extensionId}|${providerId}`;
		if (this._sentProviderUsageEvents.has(key)) {
			return;
		}
		this._sentProviderUsageEvents.add(key);
		type AuthProviderUsageClassification = {
			owner: 'TylerLeonhardt';
			comment: 'Used to see which extensions are using which providers';
			extensionId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The extension id.' };
			providerId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The provider id.' };
		};
		this.telemetryService.publicLog2<{ extensionId: string; providerId: string }, AuthProviderUsageClassification>('authentication.providerUsage', { providerId, extensionId });
	}

	//#region Account Preferences
	// TODO@TylerLeonhardt: Update this after a few iterations to no longer fallback to the session preference

	private _getAccountPreference(extensionId: string, providerId: string, sessions: ReadonlyArray<AuthenticationSession>): AuthenticationSession | undefined {
		if (sessions.length === 0) {
			return undefined;
		}
		const accountNamePreference = this.authenticationExtensionsService.getAccountPreference(extensionId, providerId);
		if (accountNamePreference) {
			const session = sessions.find(session => session.account.label === accountNamePreference);
			return session;
		}
		return undefined;
	}
	//#endregion

	async $showDeviceCodeModal(userCode: string, verificationUri: string): Promise<boolean> {
		const { result } = await this.dialogService.prompt({
			type: Severity.Info,
			message: nls.localize('deviceCodeTitle', "Device Code Authentication"),
			detail: nls.localize('deviceCodeDetail', "Your code: {0}\n\nTo complete authentication, navigate to {1} and enter the code above.", userCode, verificationUri),
			buttons: [
				{
					label: nls.localize('copyAndContinue', "Copy & Continue"),
					run: () => true
				}
			],
			cancelButton: true
		});

		if (result) {
			// Open verification URI
			try {
				await this.clipboardService.writeText(userCode);
				return await this.openerService.open(URI.parse(verificationUri));
			} catch (error) {
				this.notificationService.error(nls.localize('failedToOpenUri', "Failed to open {0}", verificationUri));
			}
		}
		return false;
	}

	async $promptForClientRegistration(authorizationServerUrl: string): Promise<{ clientId: string; clientSecret?: string } | undefined> {
		const redirectUrls = 'http://127.0.0.1:33418\nhttps://vscode.dev/redirect';

		// Show modal dialog first to explain the situation and get user consent
		const result = await this.dialogService.prompt({
			type: Severity.Info,
			message: nls.localize('dcrNotSupported', "Dynamic Client Registration not supported"),
			detail: nls.localize('dcrNotSupportedDetail', "The authorization server '{0}' does not support automatic client registration. Do you want to proceed by manually providing a client registration (client ID)?\n\nNote: When registering your OAuth application, make sure to include these redirect URIs:\n{1}", authorizationServerUrl, redirectUrls),
			buttons: [
				{
					label: nls.localize('dcrCopyUrlsAndProceed', "Copy URIs & Proceed"),
					run: async () => {
						try {
							await this.clipboardService.writeText(redirectUrls);
						} catch (error) {
							this.notificationService.error(nls.localize('dcrFailedToCopy', "Failed to copy redirect URIs to clipboard."));
						}
						return true;
					}
				},
			],
			cancelButton: {
				label: nls.localize('cancel', "Cancel"),
				run: () => false
			}
		});

		if (!result) {
			return undefined;
		}

		const sharedTitle = nls.localize('addClientRegistrationDetails', "Add Client Registration Details");

		const clientId = await this.quickInputService.input({
			title: sharedTitle,
			prompt: nls.localize('clientIdPrompt', "Enter an existing client ID that has been registered with the following redirect URIs: http://127.0.0.1:33418, https://vscode.dev/redirect"),
			placeHolder: nls.localize('clientIdPlaceholder', "OAuth client ID (azye39d...)"),
			ignoreFocusLost: true,
			validateInput: async (value: string) => {
				if (!value || value.trim().length === 0) {
					return nls.localize('clientIdRequired', "Client ID is required");
				}
				return undefined;
			}
		});

		if (!clientId || clientId.trim().length === 0) {
			return undefined;
		}

		const clientSecret = await this.quickInputService.input({
			title: sharedTitle,
			prompt: nls.localize('clientSecretPrompt', "(optional) Enter an existing client secret associated with the client id '{0}' or leave this field blank", clientId),
			placeHolder: nls.localize('clientSecretPlaceholder', "OAuth client secret (wer32o50f...) or leave it blank"),
			password: true,
			ignoreFocusLost: true
		});

		return {
			clientId: clientId.trim(),
			clientSecret: clientSecret?.trim() || undefined
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadBulkEdits.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadBulkEdits.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer, decodeBase64 } from '../../../base/common/buffer.js';
import { revive } from '../../../base/common/marshalling.js';
import { IBulkEditService, ResourceFileEdit, ResourceTextEdit } from '../../../editor/browser/services/bulkEditService.js';
import { WorkspaceEdit } from '../../../editor/common/languages.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { IUriIdentityService } from '../../../platform/uriIdentity/common/uriIdentity.js';
import { IWorkspaceCellEditDto, IWorkspaceEditDto, IWorkspaceFileEditDto, MainContext, MainThreadBulkEditsShape } from '../common/extHost.protocol.js';
import { ResourceNotebookCellEdit } from '../../contrib/bulkEdit/browser/bulkCellEdits.js';
import { CellEditType } from '../../contrib/notebook/common/notebookCommon.js';
import { IExtHostContext, extHostNamedCustomer } from '../../services/extensions/common/extHostCustomers.js';
import { SerializableObjectWithBuffers } from '../../services/extensions/common/proxyIdentifier.js';


@extHostNamedCustomer(MainContext.MainThreadBulkEdits)
export class MainThreadBulkEdits implements MainThreadBulkEditsShape {

	constructor(
		_extHostContext: IExtHostContext,
		@IBulkEditService private readonly _bulkEditService: IBulkEditService,
		@ILogService private readonly _logService: ILogService,
		@IUriIdentityService private readonly _uriIdentService: IUriIdentityService
	) { }

	dispose(): void { }

	$tryApplyWorkspaceEdit(dto: SerializableObjectWithBuffers<IWorkspaceEditDto>, undoRedoGroupId?: number, isRefactoring?: boolean): Promise<boolean> {
		const edits = reviveWorkspaceEditDto(dto.value, this._uriIdentService);
		return this._bulkEditService.apply(edits, { undoRedoGroupId, respectAutoSaveConfig: isRefactoring }).then((res) => res.isApplied, err => {
			this._logService.warn(`IGNORING workspace edit: ${err}`);
			return false;
		});
	}
}

export function reviveWorkspaceEditDto(data: IWorkspaceEditDto, uriIdentityService: IUriIdentityService, resolveDataTransferFile?: (id: string) => Promise<VSBuffer>): WorkspaceEdit;
export function reviveWorkspaceEditDto(data: IWorkspaceEditDto | undefined, uriIdentityService: IUriIdentityService, resolveDataTransferFile?: (id: string) => Promise<VSBuffer>): WorkspaceEdit | undefined;
export function reviveWorkspaceEditDto(data: IWorkspaceEditDto | undefined, uriIdentityService: IUriIdentityService, resolveDataTransferFile?: (id: string) => Promise<VSBuffer>): WorkspaceEdit | undefined {
	if (!data || !data.edits) {
		return <WorkspaceEdit>data;
	}
	const result = revive<WorkspaceEdit>(data);
	for (const edit of result.edits) {
		if (ResourceTextEdit.is(edit)) {
			edit.resource = uriIdentityService.asCanonicalUri(edit.resource);
		}
		if (ResourceFileEdit.is(edit)) {
			if (edit.options) {
				const inContents = (edit as IWorkspaceFileEditDto).options?.contents;
				if (inContents) {
					if (inContents.type === 'base64') {
						edit.options.contents = Promise.resolve(decodeBase64(inContents.value));
					} else {
						if (resolveDataTransferFile) {
							edit.options.contents = resolveDataTransferFile(inContents.id);
						} else {
							throw new Error('Could not revive data transfer file');
						}
					}
				}
			}
			edit.newResource = edit.newResource && uriIdentityService.asCanonicalUri(edit.newResource);
			edit.oldResource = edit.oldResource && uriIdentityService.asCanonicalUri(edit.oldResource);
		}
		if (ResourceNotebookCellEdit.is(edit)) {
			edit.resource = uriIdentityService.asCanonicalUri(edit.resource);
			const cellEdit = (edit as IWorkspaceCellEditDto).cellEdit;
			if (cellEdit.editType === CellEditType.Replace) {
				edit.cellEdit = {
					...cellEdit,
					cells: cellEdit.cells.map(cell => ({
						...cell,
						outputs: cell.outputs.map(output => ({
							...output,
							outputs: output.items.map(item => {
								return {
									mime: item.mime,
									data: item.valueBytes
								};
							})
						}))
					}))
				};
			}
		}
	}
	return <WorkspaceEdit>data;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadChatAgents2.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadChatAgents2.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DeferredPromise } from '../../../base/common/async.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { IMarkdownString } from '../../../base/common/htmlContent.js';
import { Disposable, DisposableMap, IDisposable } from '../../../base/common/lifecycle.js';
import { revive } from '../../../base/common/marshalling.js';
import { Schemas } from '../../../base/common/network.js';
import { escapeRegExpCharacters } from '../../../base/common/strings.js';
import { ThemeIcon } from '../../../base/common/themables.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { Position } from '../../../editor/common/core/position.js';
import { Range } from '../../../editor/common/core/range.js';
import { getWordAtText } from '../../../editor/common/core/wordHelper.js';
import { CompletionContext, CompletionItem, CompletionItemKind, CompletionList } from '../../../editor/common/languages.js';
import { ITextModel } from '../../../editor/common/model.js';
import { ILanguageFeaturesService } from '../../../editor/common/services/languageFeatures.js';
import { ExtensionIdentifier } from '../../../platform/extensions/common/extensions.js';
import { IInstantiationService } from '../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { IUriIdentityService } from '../../../platform/uriIdentity/common/uriIdentity.js';
import { IChatWidgetService } from '../../contrib/chat/browser/chat.js';
import { AddDynamicVariableAction, IAddDynamicVariableContext } from '../../contrib/chat/browser/contrib/chatDynamicVariables.js';
import { IChatAgentHistoryEntry, IChatAgentImplementation, IChatAgentRequest, IChatAgentService } from '../../contrib/chat/common/chatAgents.js';
import { ICustomAgentQueryOptions, IPromptsService } from '../../contrib/chat/common/promptSyntax/service/promptsService.js';
import { IChatEditingService, IChatRelatedFileProviderMetadata } from '../../contrib/chat/common/chatEditingService.js';
import { IChatModel } from '../../contrib/chat/common/chatModel.js';
import { ChatRequestAgentPart } from '../../contrib/chat/common/chatParserTypes.js';
import { ChatRequestParser } from '../../contrib/chat/common/chatRequestParser.js';
import { IChatContentInlineReference, IChatContentReference, IChatFollowup, IChatNotebookEdit, IChatProgress, IChatService, IChatTask, IChatTaskSerialized, IChatWarningMessage } from '../../contrib/chat/common/chatService.js';
import { IChatSessionsService } from '../../contrib/chat/common/chatSessionsService.js';
import { ChatAgentLocation, ChatModeKind } from '../../contrib/chat/common/constants.js';
import { IExtHostContext, extHostNamedCustomer } from '../../services/extensions/common/extHostCustomers.js';
import { IExtensionService } from '../../services/extensions/common/extensions.js';
import { Dto } from '../../services/extensions/common/proxyIdentifier.js';
import { ExtHostChatAgentsShape2, ExtHostContext, IChatNotebookEditDto, IChatParticipantMetadata, IChatProgressDto, IDynamicChatAgentProps, IExtensionChatAgentMetadata, MainContext, MainThreadChatAgentsShape2 } from '../common/extHost.protocol.js';
import { NotebookDto } from './mainThreadNotebookDto.js';

interface AgentData {
	dispose: () => void;
	id: string;
	extensionId: ExtensionIdentifier;
	hasFollowups?: boolean;
}

export class MainThreadChatTask implements IChatTask {
	public readonly kind = 'progressTask';

	public readonly deferred = new DeferredPromise<string | void>();

	private readonly _onDidAddProgress = new Emitter<IChatWarningMessage | IChatContentReference>();
	public get onDidAddProgress(): Event<IChatWarningMessage | IChatContentReference> { return this._onDidAddProgress.event; }

	public readonly progress: (IChatWarningMessage | IChatContentReference)[] = [];

	constructor(public content: IMarkdownString) { }

	task() {
		return this.deferred.p;
	}

	isSettled() {
		return this.deferred.isSettled;
	}

	complete(v: string | void) {
		this.deferred.complete(v);
	}

	add(progress: IChatWarningMessage | IChatContentReference): void {
		this.progress.push(progress);
		this._onDidAddProgress.fire(progress);
	}

	toJSON(): IChatTaskSerialized {
		return {
			kind: 'progressTaskSerialized',
			content: this.content,
			progress: this.progress
		};
	}
}

@extHostNamedCustomer(MainContext.MainThreadChatAgents2)
export class MainThreadChatAgents2 extends Disposable implements MainThreadChatAgentsShape2 {

	private readonly _agents = this._register(new DisposableMap<number, AgentData>());
	private readonly _agentCompletionProviders = this._register(new DisposableMap<number, IDisposable>());
	private readonly _agentIdsToCompletionProviders = this._register(new DisposableMap<string, IDisposable>);

	private readonly _chatParticipantDetectionProviders = this._register(new DisposableMap<number, IDisposable>());

	private readonly _chatRelatedFilesProviders = this._register(new DisposableMap<number, IDisposable>());

	private readonly _customAgentsProviders = this._register(new DisposableMap<number, IDisposable>());
	private readonly _customAgentsProviderEmitters = this._register(new DisposableMap<number, Emitter<void>>());

	private readonly _pendingProgress = new Map<string, { progress: (parts: IChatProgress[]) => void; chatSession: IChatModel | undefined }>();
	private readonly _proxy: ExtHostChatAgentsShape2;

	private readonly _activeTasks = new Map<string, IChatTask>();

	private readonly _unresolvedAnchors = new Map</* requestId */string, Map</* id */ string, IChatContentInlineReference>>();

	constructor(
		extHostContext: IExtHostContext,
		@IChatAgentService private readonly _chatAgentService: IChatAgentService,
		@IChatSessionsService private readonly _chatSessionService: IChatSessionsService,
		@IChatService private readonly _chatService: IChatService,
		@IChatEditingService private readonly _chatEditingService: IChatEditingService,
		@ILanguageFeaturesService private readonly _languageFeaturesService: ILanguageFeaturesService,
		@IChatWidgetService private readonly _chatWidgetService: IChatWidgetService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@ILogService private readonly _logService: ILogService,
		@IExtensionService private readonly _extensionService: IExtensionService,
		@IUriIdentityService private readonly _uriIdentityService: IUriIdentityService,
		@IPromptsService private readonly _promptsService: IPromptsService,
	) {
		super();
		this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostChatAgents2);

		this._register(this._chatService.onDidDisposeSession(e => {
			for (const resource of e.sessionResource) {
				this._proxy.$releaseSession(resource);
			}
		}));
		this._register(this._chatService.onDidPerformUserAction(e => {
			if (typeof e.agentId === 'string') {
				for (const [handle, agent] of this._agents) {
					if (agent.id === e.agentId) {
						if (e.action.kind === 'vote') {
							this._proxy.$acceptFeedback(handle, e.result ?? {}, e.action);
						} else {
							this._proxy.$acceptAction(handle, e.result || {}, e);
						}
						break;
					}
				}
			}
		}));
	}

	$unregisterAgent(handle: number): void {
		this._agents.deleteAndDispose(handle);
	}

	$transferActiveChatSession(toWorkspace: UriComponents): void {
		const widget = this._chatWidgetService.lastFocusedWidget;
		const model = widget?.viewModel?.model;
		if (!model) {
			this._logService.error(`MainThreadChat#$transferActiveChatSession: No active chat session found`);
			return;
		}

		const location = widget.location;
		this._chatService.transferChatSession({ sessionId: model.sessionId, inputState: model.inputModel.state.get(), location }, URI.revive(toWorkspace));
	}

	async $registerAgent(handle: number, extension: ExtensionIdentifier, id: string, metadata: IExtensionChatAgentMetadata, dynamicProps: IDynamicChatAgentProps | undefined): Promise<void> {
		await this._extensionService.whenInstalledExtensionsRegistered();
		const staticAgentRegistration = this._chatAgentService.getAgent(id, true);
		const chatSessionRegistration = this._chatSessionService.getAllChatSessionContributions().find(c => c.type === id || c.alternativeIds?.includes(id));
		if (!staticAgentRegistration && !chatSessionRegistration && !dynamicProps) {
			if (this._chatAgentService.getAgentsByName(id).length) {
				// Likely some extension authors will not adopt the new ID, so give a hint if they register a
				// participant by name instead of ID.
				throw new Error(`chatParticipant must be declared with an ID in package.json. The "id" property may be missing! "${id}"`);
			}

			throw new Error(`chatParticipant must be declared in package.json: ${id}`);
		}

		const impl: IChatAgentImplementation = {
			invoke: async (request, progress, history, token) => {
				const chatSession = this._chatService.getSession(request.sessionResource);
				this._pendingProgress.set(request.requestId, { progress, chatSession });
				try {
					return await this._proxy.$invokeAgent(handle, request, {
						history,
						chatSessionContext: chatSession?.contributedChatSession
					}, token) ?? {};
				} finally {
					this._pendingProgress.delete(request.requestId);
				}
			},
			setRequestTools: (requestId, tools) => {
				this._proxy.$setRequestTools(requestId, tools);
			},
			provideFollowups: async (request, result, history, token): Promise<IChatFollowup[]> => {
				if (!this._agents.get(handle)?.hasFollowups) {
					return [];
				}

				return this._proxy.$provideFollowups(request, handle, result, { history }, token);
			},
			provideChatTitle: (history, token) => {
				return this._proxy.$provideChatTitle(handle, history, token);
			},
			provideChatSummary: (history, token) => {
				return this._proxy.$provideChatSummary(handle, history, token);
			},
		};

		// Do not attempt to register migrated chatSession providers
		if (chatSessionRegistration?.alternativeIds?.includes(id)) {
			return;
		}

		let disposable: IDisposable;
		if (!staticAgentRegistration && dynamicProps) {
			const extensionDescription = this._extensionService.extensions.find(e => ExtensionIdentifier.equals(e.identifier, extension));
			disposable = this._chatAgentService.registerDynamicAgent(
				{
					id,
					name: dynamicProps.name,
					description: dynamicProps.description,
					extensionId: extension,
					extensionVersion: extensionDescription?.version,
					extensionDisplayName: extensionDescription?.displayName ?? extension.value,
					extensionPublisherId: extensionDescription?.publisher ?? '',
					publisherDisplayName: dynamicProps.publisherName,
					fullName: dynamicProps.fullName,
					metadata: revive(metadata),
					slashCommands: [],
					disambiguation: [],
					locations: [ChatAgentLocation.Chat],
					modes: [ChatModeKind.Ask, ChatModeKind.Agent, ChatModeKind.Edit],
				},
				impl);
		} else {
			disposable = this._chatAgentService.registerAgentImplementation(id, impl);
		}

		this._agents.set(handle, {
			id: id,
			extensionId: extension,
			dispose: () => disposable.dispose(),
			hasFollowups: metadata.hasFollowups
		});
	}

	async $updateAgent(handle: number, metadataUpdate: IExtensionChatAgentMetadata): Promise<void> {
		await this._extensionService.whenInstalledExtensionsRegistered();
		const data = this._agents.get(handle);
		if (!data) {
			this._logService.error(`MainThreadChatAgents2#$updateAgent: No agent with handle ${handle} registered`);
			return;
		}
		data.hasFollowups = metadataUpdate.hasFollowups;
		this._chatAgentService.updateAgent(data.id, revive(metadataUpdate));
	}

	async $handleProgressChunk(requestId: string, chunks: (IChatProgressDto | [IChatProgressDto, number])[]): Promise<void> {
		const pendingProgress = this._pendingProgress.get(requestId);
		if (!pendingProgress) {
			this._logService.warn(`MainThreadChatAgents2#$handleProgressChunk: No pending progress for requestId ${requestId}`);
			return;
		}

		const { progress, chatSession } = pendingProgress;
		const chatProgressParts: IChatProgress[] = [];

		for (const item of chunks) {
			const [progress, responsePartHandle] = Array.isArray(item) ? item : [item];

			if (progress.kind === 'externalEdits') {
				// todo@connor4312: be more specific here, pass response model through to invocation?
				const response = chatSession?.getRequests().at(-1)?.response;
				if (chatSession?.editingSession && responsePartHandle !== undefined && response) {
					const parts = progress.start
						? await chatSession.editingSession.startExternalEdits(response, responsePartHandle, revive(progress.resources), progress.undoStopId)
						: await chatSession.editingSession.stopExternalEdits(response, responsePartHandle);
					chatProgressParts.push(...parts);
				}
				continue;
			}

			const revivedProgress = progress.kind === 'notebookEdit'
				? ChatNotebookEdit.fromChatEdit(progress)
				: revive(progress) as IChatProgress;

			if (revivedProgress.kind === 'notebookEdit'
				|| revivedProgress.kind === 'textEdit'
				|| revivedProgress.kind === 'codeblockUri'
			) {
				// make sure to use the canonical uri
				revivedProgress.uri = this._uriIdentityService.asCanonicalUri(revivedProgress.uri);
			}

			if (responsePartHandle !== undefined) {

				if (revivedProgress.kind === 'progressTask') {
					const handle = responsePartHandle;
					const responsePartId = `${requestId}_${handle}`;
					const task = new MainThreadChatTask(revivedProgress.content);
					this._activeTasks.set(responsePartId, task);
					chatProgressParts.push(task);
				} else if (responsePartHandle !== undefined) {
					const responsePartId = `${requestId}_${responsePartHandle}`;
					const task = this._activeTasks.get(responsePartId);
					switch (revivedProgress.kind) {
						case 'progressTaskResult':
							if (task && revivedProgress.content) {
								task.complete(revivedProgress.content.value);
								this._activeTasks.delete(responsePartId);
							} else {
								task?.complete(undefined);
							}
							break;
						case 'warning':
						case 'reference':
							task?.add(revivedProgress);
							break;
					}
				}
				continue;
			}

			if (revivedProgress.kind === 'inlineReference' && revivedProgress.resolveId) {
				if (!this._unresolvedAnchors.has(requestId)) {
					this._unresolvedAnchors.set(requestId, new Map());
				}
				this._unresolvedAnchors.get(requestId)?.set(revivedProgress.resolveId, revivedProgress);
			}

			chatProgressParts.push(revivedProgress);
		}

		progress(chatProgressParts);
	}

	$handleAnchorResolve(requestId: string, handle: string, resolveAnchor: Dto<IChatContentInlineReference> | undefined): void {
		const anchor = this._unresolvedAnchors.get(requestId)?.get(handle);
		if (!anchor) {
			return;
		}

		this._unresolvedAnchors.get(requestId)?.delete(handle);
		if (resolveAnchor) {
			const revivedAnchor = revive(resolveAnchor) as IChatContentInlineReference;
			anchor.inlineReference = revivedAnchor.inlineReference;
		}
	}

	$registerAgentCompletionsProvider(handle: number, id: string, triggerCharacters: string[]): void {
		const provide = async (query: string, token: CancellationToken) => {
			const completions = await this._proxy.$invokeCompletionProvider(handle, query, token);
			return completions.map((c) => ({ ...c, icon: c.icon ? ThemeIcon.fromId(c.icon) : undefined }));
		};
		this._agentIdsToCompletionProviders.set(id, this._chatAgentService.registerAgentCompletionProvider(id, provide));

		this._agentCompletionProviders.set(handle, this._languageFeaturesService.completionProvider.register({ scheme: Schemas.vscodeChatInput, hasAccessToAllModels: true }, {
			_debugDisplayName: 'chatAgentCompletions:' + handle,
			triggerCharacters,
			provideCompletionItems: async (model: ITextModel, position: Position, _context: CompletionContext, token: CancellationToken) => {
				const widget = this._chatWidgetService.getWidgetByInputUri(model.uri);
				if (!widget || !widget.viewModel) {
					return;
				}

				const triggerCharsPart = triggerCharacters.map(c => escapeRegExpCharacters(c)).join('');
				const wordRegex = new RegExp(`[${triggerCharsPart}]\\S*`, 'g');
				const query = getWordAtText(position.column, wordRegex, model.getLineContent(position.lineNumber), 0)?.word ?? '';

				if (query && !triggerCharacters.some(c => query.startsWith(c))) {
					return;
				}

				const parsedRequest = this._instantiationService.createInstance(ChatRequestParser).parseChatRequest(widget.viewModel.sessionResource, model.getValue()).parts;
				const agentPart = parsedRequest.find((part): part is ChatRequestAgentPart => part instanceof ChatRequestAgentPart);
				const thisAgentId = this._agents.get(handle)?.id;
				if (agentPart?.agent.id !== thisAgentId) {
					return;
				}

				const range = computeCompletionRanges(model, position, wordRegex);
				if (!range) {
					return null;
				}

				const result = await provide(query, token);
				const variableItems = result.map(v => {
					const insertText = v.insertText ?? (typeof v.label === 'string' ? v.label : v.label.label);
					const rangeAfterInsert = new Range(range.insert.startLineNumber, range.insert.startColumn, range.insert.endLineNumber, range.insert.startColumn + insertText.length);
					return {
						label: v.label,
						range,
						insertText: insertText + ' ',
						kind: CompletionItemKind.Text,
						detail: v.detail,
						documentation: v.documentation,
						command: { id: AddDynamicVariableAction.ID, title: '', arguments: [{ id: v.id, widget, range: rangeAfterInsert, variableData: revive(v.value), command: v.command } satisfies IAddDynamicVariableContext] }
					} satisfies CompletionItem;
				});

				return {
					suggestions: variableItems
				} satisfies CompletionList;
			}
		}));
	}

	$unregisterAgentCompletionsProvider(handle: number, id: string): void {
		this._agentCompletionProviders.deleteAndDispose(handle);
		this._agentIdsToCompletionProviders.deleteAndDispose(id);
	}

	$registerChatParticipantDetectionProvider(handle: number): void {
		this._chatParticipantDetectionProviders.set(handle, this._chatAgentService.registerChatParticipantDetectionProvider(handle,
			{
				provideParticipantDetection: async (request: IChatAgentRequest, history: IChatAgentHistoryEntry[], options: { location: ChatAgentLocation; participants: IChatParticipantMetadata[] }, token: CancellationToken) => {
					return await this._proxy.$detectChatParticipant(handle, request, { history }, options, token);
				}
			}
		));
	}

	$unregisterChatParticipantDetectionProvider(handle: number): void {
		this._chatParticipantDetectionProviders.deleteAndDispose(handle);
	}

	$registerRelatedFilesProvider(handle: number, metadata: IChatRelatedFileProviderMetadata): void {
		this._chatRelatedFilesProviders.set(handle, this._chatEditingService.registerRelatedFilesProvider(handle, {
			description: metadata.description,
			provideRelatedFiles: async (request, token) => {
				return (await this._proxy.$provideRelatedFiles(handle, request, token))?.map((v) => ({ uri: URI.from(v.uri), description: v.description })) ?? [];
			}
		}));
	}

	$unregisterRelatedFilesProvider(handle: number): void {
		this._chatRelatedFilesProviders.deleteAndDispose(handle);
	}

	async $registerCustomAgentsProvider(handle: number, extensionId: ExtensionIdentifier): Promise<void> {
		const extension = await this._extensionService.getExtension(extensionId.value);
		if (!extension) {
			this._logService.error(`[MainThreadChatAgents2] Could not find extension for CustomAgentsProvider: ${extensionId.value}`);
			return;
		}

		const emitter = new Emitter<void>();
		this._customAgentsProviderEmitters.set(handle, emitter);

		const disposable = this._promptsService.registerCustomAgentsProvider(extension, {
			onDidChangeCustomAgents: emitter.event,
			provideCustomAgents: async (options: ICustomAgentQueryOptions, token: CancellationToken) => {
				const agents = await this._proxy.$provideCustomAgents(handle, options, token);
				if (!agents) {
					return undefined;
				}
				// Convert UriComponents to URI
				return agents.map(agent => ({
					...agent,
					uri: URI.revive(agent.uri)
				}));
			}
		});

		this._customAgentsProviders.set(handle, disposable);
	}

	$unregisterCustomAgentsProvider(handle: number): void {
		this._customAgentsProviders.deleteAndDispose(handle);
		this._customAgentsProviderEmitters.deleteAndDispose(handle);
	}

	$onDidChangeCustomAgents(handle: number): void {
		const emitter = this._customAgentsProviderEmitters.get(handle);
		if (emitter) {
			emitter.fire();
		}
	}
}


function computeCompletionRanges(model: ITextModel, position: Position, reg: RegExp): { insert: Range; replace: Range } | undefined {
	const varWord = getWordAtText(position.column, reg, model.getLineContent(position.lineNumber), 0);
	if (!varWord && model.getWordUntilPosition(position).word) {
		// inside a "normal" word
		return;
	}

	let insert: Range;
	let replace: Range;
	if (!varWord) {
		insert = replace = Range.fromPositions(position);
	} else {
		insert = new Range(position.lineNumber, varWord.startColumn, position.lineNumber, position.column);
		replace = new Range(position.lineNumber, varWord.startColumn, position.lineNumber, varWord.endColumn);
	}

	return { insert, replace };
}

namespace ChatNotebookEdit {
	export function fromChatEdit(part: IChatNotebookEditDto): IChatNotebookEdit {
		return {
			kind: 'notebookEdit',
			uri: URI.revive(part.uri),
			done: part.done,
			edits: part.edits.map(NotebookDto.fromCellEditOperationDto)
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadChatCodeMapper.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadChatCodeMapper.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { CancellationToken } from '../../../base/common/cancellation.js';
import { Disposable, DisposableMap, IDisposable } from '../../../base/common/lifecycle.js';
import { URI } from '../../../base/common/uri.js';
import { TextEdit } from '../../../editor/common/languages.js';
import { ICodeMapperProvider, ICodeMapperRequest, ICodeMapperResponse, ICodeMapperService } from '../../contrib/chat/common/chatCodeMapperService.js';
import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { ExtHostCodeMapperShape, ExtHostContext, ICodeMapperProgressDto, ICodeMapperRequestDto, MainContext, MainThreadCodeMapperShape } from '../common/extHost.protocol.js';
import { NotebookDto } from './mainThreadNotebookDto.js';

@extHostNamedCustomer(MainContext.MainThreadCodeMapper)
export class MainThreadChatCodemapper extends Disposable implements MainThreadCodeMapperShape {

	private providers = this._register(new DisposableMap<number, IDisposable>());
	private readonly _proxy: ExtHostCodeMapperShape;
	private static _requestHandlePool: number = 0;
	private _responseMap = new Map<string, ICodeMapperResponse>();

	constructor(
		extHostContext: IExtHostContext,
		@ICodeMapperService private readonly codeMapperService: ICodeMapperService
	) {
		super();
		this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostCodeMapper);
	}

	$registerCodeMapperProvider(handle: number, displayName: string): void {
		const impl: ICodeMapperProvider = {
			displayName,
			mapCode: async (uiRequest: ICodeMapperRequest, response: ICodeMapperResponse, token: CancellationToken) => {
				const requestId = String(MainThreadChatCodemapper._requestHandlePool++);
				this._responseMap.set(requestId, response);
				const extHostRequest: ICodeMapperRequestDto = {
					requestId,
					codeBlocks: uiRequest.codeBlocks,
					chatRequestId: uiRequest.chatRequestId,
					chatRequestModel: uiRequest.chatRequestModel,
					chatSessionResource: uiRequest.chatSessionResource,
					location: uiRequest.location
				};
				try {
					return await this._proxy.$mapCode(handle, extHostRequest, token).then((result) => result ?? undefined);
				} finally {
					this._responseMap.delete(requestId);
				}
			}
		};

		const disposable = this.codeMapperService.registerCodeMapperProvider(handle, impl);
		this.providers.set(handle, disposable);
	}

	$unregisterCodeMapperProvider(handle: number): void {
		this.providers.deleteAndDispose(handle);
	}

	$handleProgress(requestId: string, data: ICodeMapperProgressDto): Promise<void> {
		const response = this._responseMap.get(requestId);
		if (response) {
			const edits = data.edits;
			const resource = URI.revive(data.uri);
			if (!edits.length) {
				response.textEdit(resource, []);
			} else if (edits.every(TextEdit.isTextEdit)) {
				response.textEdit(resource, edits);
			} else {
				response.notebookEdit(resource, edits.map(NotebookDto.fromCellEditOperationDto));
			}
		}
		return Promise.resolve();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadChatContext.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadChatContext.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../base/common/cancellation.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { ThemeIcon } from '../../../base/common/themables.js';
import { IChatContextItem, IChatContextSupport } from '../../contrib/chat/common/chatContext.js';
import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { ExtHostChatContextShape, ExtHostContext, IDocumentFilterDto, MainContext, MainThreadChatContextShape } from '../common/extHost.protocol.js';
import { IChatContextService } from '../../contrib/chat/browser/chatContextService.js';
import { URI } from '../../../base/common/uri.js';

@extHostNamedCustomer(MainContext.MainThreadChatContext)
export class MainThreadChatContext extends Disposable implements MainThreadChatContextShape {
	private readonly _proxy: ExtHostChatContextShape;
	private readonly _providers = new Map<number, { id: string; selector: IDocumentFilterDto[] | undefined; support: IChatContextSupport }>();

	constructor(
		extHostContext: IExtHostContext,
		@IChatContextService private readonly _chatContextService: IChatContextService
	) {
		super();
		this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostChatContext);
	}

	$registerChatContextProvider(handle: number, id: string, selector: IDocumentFilterDto[] | undefined, _options: { icon: ThemeIcon }, support: IChatContextSupport): void {
		this._providers.set(handle, { selector, support, id });
		this._chatContextService.registerChatContextProvider(id, selector, {
			provideChatContext: (token: CancellationToken) => {
				return this._proxy.$provideChatContext(handle, token);
			},
			resolveChatContext: support.supportsResolve ? (context: IChatContextItem, token: CancellationToken) => {
				return this._proxy.$resolveChatContext(handle, context, token);
			} : undefined,
			provideChatContextForResource: support.supportsResource ? (resource: URI, withValue: boolean, token: CancellationToken) => {
				return this._proxy.$provideChatContextForResource(handle, { resource, withValue }, token);
			} : undefined
		});
	}

	$unregisterChatContextProvider(handle: number): void {
		const provider = this._providers.get(handle);
		if (!provider) {
			return;
		}
		this._chatContextService.unregisterChatContextProvider(provider.id);
		this._providers.delete(handle);
	}

	$updateWorkspaceContextItems(handle: number, items: IChatContextItem[]): void {
		const provider = this._providers.get(handle);
		if (!provider) {
			return;
		}
		this._chatContextService.updateWorkspaceContextItems(provider.id, items);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadChatOutputRenderer.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadChatOutputRenderer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../../base/common/buffer.js';
import { Disposable, IDisposable } from '../../../base/common/lifecycle.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { ExtensionIdentifier } from '../../../platform/extensions/common/extensions.js';
import { IChatOutputRendererService } from '../../contrib/chat/browser/chatOutputItemRenderer.js';
import { IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { ExtHostChatOutputRendererShape, ExtHostContext, MainThreadChatOutputRendererShape } from '../common/extHost.protocol.js';
import { MainThreadWebviews } from './mainThreadWebviews.js';

export class MainThreadChatOutputRenderer extends Disposable implements MainThreadChatOutputRendererShape {

	private readonly _proxy: ExtHostChatOutputRendererShape;

	private _webviewHandlePool = 0;

	private readonly registeredRenderers = new Map</* viewType */ string, IDisposable>();

	constructor(
		extHostContext: IExtHostContext,
		private readonly _mainThreadWebview: MainThreadWebviews,
		@IChatOutputRendererService private readonly _rendererService: IChatOutputRendererService,
	) {
		super();
		this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostChatOutputRenderer);
	}

	override dispose(): void {
		super.dispose();

		this.registeredRenderers.forEach(disposable => disposable.dispose());
		this.registeredRenderers.clear();
	}

	$registerChatOutputRenderer(viewType: string, extensionId: ExtensionIdentifier, extensionLocation: UriComponents): void {
		this._rendererService.registerRenderer(viewType, {
			renderOutputPart: async (mime, data, webview, token) => {
				const webviewHandle = `chat-output-${++this._webviewHandlePool}`;

				this._mainThreadWebview.addWebview(webviewHandle, webview, {
					serializeBuffersForPostMessage: true,
				});

				this._proxy.$renderChatOutput(viewType, mime, VSBuffer.wrap(data), webviewHandle, token);
			},
		}, {
			extension: { id: extensionId, location: URI.revive(extensionLocation) }
		});
	}

	$unregisterChatOutputRenderer(viewType: string): void {
		this.registeredRenderers.get(viewType)?.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadChatSessions.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadChatSessions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { raceCancellationError } from '../../../base/common/async.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { IMarkdownString, MarkdownString } from '../../../base/common/htmlContent.js';
import { Disposable, DisposableMap, DisposableStore, IDisposable } from '../../../base/common/lifecycle.js';
import { ResourceMap } from '../../../base/common/map.js';
import { revive } from '../../../base/common/marshalling.js';
import { autorun, IObservable, observableValue } from '../../../base/common/observable.js';
import { isEqual } from '../../../base/common/resources.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { localize } from '../../../nls.js';
import { IDialogService } from '../../../platform/dialogs/common/dialogs.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { hasValidDiff, IAgentSession } from '../../contrib/chat/browser/agentSessions/agentSessionsModel.js';
import { ChatViewPaneTarget, IChatWidgetService, isIChatViewViewContext } from '../../contrib/chat/browser/chat.js';
import { IChatEditorOptions } from '../../contrib/chat/browser/chatEditor.js';
import { ChatEditorInput } from '../../contrib/chat/browser/chatEditorInput.js';
import { awaitStatsForSession } from '../../contrib/chat/common/chat.js';
import { IChatAgentRequest } from '../../contrib/chat/common/chatAgents.js';
import { IChatModel } from '../../contrib/chat/common/chatModel.js';
import { IChatContentInlineReference, IChatProgress, IChatService, ResponseModelState } from '../../contrib/chat/common/chatService.js';
import { ChatSessionStatus, IChatSession, IChatSessionContentProvider, IChatSessionHistoryItem, IChatSessionItem, IChatSessionItemProvider, IChatSessionProviderOptionItem, IChatSessionsService } from '../../contrib/chat/common/chatSessionsService.js';
import { IChatRequestVariableEntry } from '../../contrib/chat/common/chatVariableEntries.js';
import { ChatAgentLocation } from '../../contrib/chat/common/constants.js';
import { IEditorGroupsService } from '../../services/editor/common/editorGroupsService.js';
import { IEditorService } from '../../services/editor/common/editorService.js';
import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { Dto } from '../../services/extensions/common/proxyIdentifier.js';
import { ExtHostChatSessionsShape, ExtHostContext, IChatProgressDto, IChatSessionHistoryItemDto, MainContext, MainThreadChatSessionsShape } from '../common/extHost.protocol.js';

export class ObservableChatSession extends Disposable implements IChatSession {

	readonly sessionResource: URI;
	readonly providerHandle: number;
	readonly history: Array<IChatSessionHistoryItem>;
	private _options?: Record<string, string | IChatSessionProviderOptionItem>;
	public get options(): Record<string, string | IChatSessionProviderOptionItem> | undefined {
		return this._options;
	}
	private readonly _progressObservable = observableValue<IChatProgress[]>(this, []);
	private readonly _isCompleteObservable = observableValue<boolean>(this, false);

	private readonly _onWillDispose = new Emitter<void>();
	readonly onWillDispose = this._onWillDispose.event;

	private readonly _pendingProgressChunks = new Map<string, IChatProgress[]>();
	private _isInitialized = false;
	private _interruptionWasCanceled = false;
	private _disposalPending = false;

	private _initializationPromise?: Promise<void>;

	interruptActiveResponseCallback?: () => Promise<boolean>;
	requestHandler?: (
		request: IChatAgentRequest,
		progress: (progress: IChatProgress[]) => void,
		history: any[],
		token: CancellationToken
	) => Promise<void>;

	private readonly _proxy: ExtHostChatSessionsShape;
	private readonly _providerHandle: number;
	private readonly _logService: ILogService;
	private readonly _dialogService: IDialogService;

	get progressObs(): IObservable<IChatProgress[]> {
		return this._progressObservable;
	}

	get isCompleteObs(): IObservable<boolean> {
		return this._isCompleteObservable;
	}

	constructor(
		resource: URI,
		providerHandle: number,
		proxy: ExtHostChatSessionsShape,
		logService: ILogService,
		dialogService: IDialogService
	) {
		super();

		this.sessionResource = resource;
		this.providerHandle = providerHandle;
		this.history = [];
		this._proxy = proxy;
		this._providerHandle = providerHandle;
		this._logService = logService;
		this._dialogService = dialogService;
	}

	initialize(token: CancellationToken): Promise<void> {
		if (!this._initializationPromise) {
			this._initializationPromise = this._doInitializeContent(token);
		}
		return this._initializationPromise;
	}

	private async _doInitializeContent(token: CancellationToken): Promise<void> {
		try {
			const sessionContent = await raceCancellationError(
				this._proxy.$provideChatSessionContent(this._providerHandle, this.sessionResource, token),
				token
			);

			this._options = sessionContent.options;
			this.history.length = 0;
			this.history.push(...sessionContent.history.map((turn: IChatSessionHistoryItemDto) => {
				if (turn.type === 'request') {
					const variables = turn.variableData?.variables.map(v => {
						const entry = {
							...v,
							value: revive(v.value)
						};
						return entry as IChatRequestVariableEntry;
					});

					return {
						type: 'request' as const,
						prompt: turn.prompt,
						participant: turn.participant,
						command: turn.command,
						variableData: variables ? { variables } : undefined,
						id: turn.id
					};
				}

				return {
					type: 'response' as const,
					parts: turn.parts.map((part: IChatProgressDto) => revive(part) as IChatProgress),
					participant: turn.participant
				};
			}));

			if (sessionContent.hasActiveResponseCallback && !this.interruptActiveResponseCallback) {
				this.interruptActiveResponseCallback = async () => {
					const confirmInterrupt = () => {
						if (this._disposalPending) {
							this._proxy.$disposeChatSessionContent(this._providerHandle, this.sessionResource);
							this._disposalPending = false;
						}
						this._proxy.$interruptChatSessionActiveResponse(this._providerHandle, this.sessionResource, 'ongoing');
						return true;
					};

					if (sessionContent.supportsInterruption) {
						// If the session supports hot reload, interrupt without confirmation
						return confirmInterrupt();
					}

					// Prompt the user to confirm interruption
					return this._dialogService.confirm({
						message: localize('interruptActiveResponse', 'Are you sure you want to interrupt the active session?')
					}).then(confirmed => {
						if (confirmed.confirmed) {
							// User confirmed interruption - dispose the session content on extension host
							return confirmInterrupt();
						} else {
							// When user cancels the interruption, fire an empty progress message to keep the session alive
							// This matches the behavior of the old implementation
							this._addProgress([{
								kind: 'progressMessage',
								content: { value: '', isTrusted: false }
							}]);
							// Set flag to prevent completion when extension host calls handleProgressComplete
							this._interruptionWasCanceled = true;
							// User canceled interruption - cancel the deferred disposal
							if (this._disposalPending) {
								this._logService.info(`Canceling deferred disposal for session ${this.sessionResource} (user canceled interruption)`);
								this._disposalPending = false;
							}
							return false;
						}
					});
				};
			}

			if (sessionContent.hasRequestHandler && !this.requestHandler) {
				this.requestHandler = async (
					request: IChatAgentRequest,
					progress: (progress: IChatProgress[]) => void,
					history: any[],
					token: CancellationToken
				) => {
					// Clear previous progress and mark as active
					this._progressObservable.set([], undefined);
					this._isCompleteObservable.set(false, undefined);

					// Set up reactive progress observation before starting the request
					let lastProgressLength = 0;
					const progressDisposable = autorun(reader => {
						const progressArray = this._progressObservable.read(reader);
						const isComplete = this._isCompleteObservable.read(reader);

						if (progressArray.length > lastProgressLength) {
							const newProgress = progressArray.slice(lastProgressLength);
							progress(newProgress);
							lastProgressLength = progressArray.length;
						}

						if (isComplete) {
							progressDisposable.dispose();
						}
					});

					try {
						await this._proxy.$invokeChatSessionRequestHandler(this._providerHandle, this.sessionResource, request, history, token);

						// Only mark as complete if there's no active response callback
						// Sessions with active response callbacks should only complete when explicitly told to via handleProgressComplete
						if (!this._isCompleteObservable.get() && !this.interruptActiveResponseCallback) {
							this._markComplete();
						}
					} catch (error) {
						const errorProgress: IChatProgress = {
							kind: 'progressMessage',
							content: { value: `Error: ${error instanceof Error ? error.message : String(error)}`, isTrusted: false }
						};

						this._addProgress([errorProgress]);
						this._markComplete();
						throw error;
					} finally {
						// Ensure progress observation is cleaned up
						progressDisposable.dispose();
					}
				};
			}

			this._isInitialized = true;

			// Process any pending progress chunks
			const hasActiveResponse = sessionContent.hasActiveResponseCallback;
			const hasRequestHandler = sessionContent.hasRequestHandler;
			const hasAnyCapability = hasActiveResponse || hasRequestHandler;

			for (const [requestId, chunks] of this._pendingProgressChunks) {
				this._logService.debug(`Processing ${chunks.length} pending progress chunks for session ${this.sessionResource}, requestId ${requestId}`);
				this._addProgress(chunks);
			}
			this._pendingProgressChunks.clear();

			// If session has no active response callback and no request handler, mark it as complete
			if (!hasAnyCapability) {
				this._isCompleteObservable.set(true, undefined);
			}

		} catch (error) {
			this._logService.error(`Failed to initialize chat session ${this.sessionResource}:`, error);
			throw error;
		}
	}

	/**
	 * Handle progress chunks coming from the extension host.
	 * If the session is not initialized yet, the chunks will be queued.
	 */
	handleProgressChunk(requestId: string, progress: IChatProgress[]): void {
		if (!this._isInitialized) {
			const existing = this._pendingProgressChunks.get(requestId) || [];
			this._pendingProgressChunks.set(requestId, [...existing, ...progress]);
			this._logService.debug(`Queuing ${progress.length} progress chunks for session ${this.sessionResource}, requestId ${requestId} (session not initialized)`);
			return;
		}

		this._addProgress(progress);
	}

	/**
	 * Handle progress completion from the extension host.
	 */
	handleProgressComplete(requestId: string): void {
		// Clean up any pending chunks for this request
		this._pendingProgressChunks.delete(requestId);

		if (this._isInitialized) {
			// Don't mark as complete if user canceled the interruption
			if (!this._interruptionWasCanceled) {
				this._markComplete();
			} else {
				// Reset the flag and don't mark as complete
				this._interruptionWasCanceled = false;
			}
		}
	}

	private _addProgress(progress: IChatProgress[]): void {
		const currentProgress = this._progressObservable.get();
		this._progressObservable.set([...currentProgress, ...progress], undefined);
	}

	private _markComplete(): void {
		if (!this._isCompleteObservable.get()) {
			this._isCompleteObservable.set(true, undefined);
		}
	}

	override dispose(): void {
		this._onWillDispose.fire();
		this._onWillDispose.dispose();
		this._pendingProgressChunks.clear();

		// If this session has an active response callback and disposal is happening,
		// defer the actual session content disposal until we know the user's choice
		if (this.interruptActiveResponseCallback && !this._interruptionWasCanceled) {
			this._disposalPending = true;
			// The actual disposal will happen in the interruption callback based on user's choice
		} else {
			// No active response callback or user already canceled interruption - dispose immediately
			this._proxy.$disposeChatSessionContent(this._providerHandle, this.sessionResource);
		}
		super.dispose();
	}
}

@extHostNamedCustomer(MainContext.MainThreadChatSessions)
export class MainThreadChatSessions extends Disposable implements MainThreadChatSessionsShape {
	private readonly _itemProvidersRegistrations = this._register(new DisposableMap<number, IDisposable & {
		readonly provider: IChatSessionItemProvider;
		readonly onDidChangeItems: Emitter<void>;
	}>());
	private readonly _contentProvidersRegistrations = this._register(new DisposableMap<number>());
	private readonly _sessionTypeToHandle = new Map<string, number>();

	private readonly _activeSessions = new ResourceMap<ObservableChatSession>();
	private readonly _sessionDisposables = new ResourceMap<IDisposable>();

	private readonly _proxy: ExtHostChatSessionsShape;

	constructor(
		private readonly _extHostContext: IExtHostContext,
		@IChatSessionsService private readonly _chatSessionsService: IChatSessionsService,
		@IChatService private readonly _chatService: IChatService,
		@IChatWidgetService private readonly _chatWidgetService: IChatWidgetService,
		@IDialogService private readonly _dialogService: IDialogService,
		@IEditorService private readonly _editorService: IEditorService,
		@IEditorGroupsService private readonly editorGroupService: IEditorGroupsService,
		@ILogService private readonly _logService: ILogService,
	) {
		super();

		this._proxy = this._extHostContext.getProxy(ExtHostContext.ExtHostChatSessions);

		this._chatSessionsService.setOptionsChangeCallback(async (sessionResource: URI, updates: ReadonlyArray<{ optionId: string; value: string | IChatSessionProviderOptionItem }>) => {
			const handle = this._getHandleForSessionType(sessionResource.scheme);
			if (handle !== undefined) {
				await this.notifyOptionsChange(handle, sessionResource, updates);
			}
		});
	}

	private _getHandleForSessionType(chatSessionType: string): number | undefined {
		return this._sessionTypeToHandle.get(chatSessionType);
	}

	$registerChatSessionItemProvider(handle: number, chatSessionType: string): void {
		// Register the provider handle - this tracks that a provider exists
		const disposables = new DisposableStore();
		const changeEmitter = disposables.add(new Emitter<void>());
		const provider: IChatSessionItemProvider = {
			chatSessionType,
			onDidChangeChatSessionItems: Event.debounce(changeEmitter.event, (_, e) => e, 200),
			provideChatSessionItems: (token) => this._provideChatSessionItems(handle, token),
		};
		disposables.add(this._chatSessionsService.registerChatSessionItemProvider(provider));

		this._itemProvidersRegistrations.set(handle, {
			dispose: () => disposables.dispose(),
			provider,
			onDidChangeItems: changeEmitter,
		});

		disposables.add(this._chatSessionsService.registerChatModelChangeListeners(
			this._chatService,
			chatSessionType,
			() => changeEmitter.fire()
		));
	}


	$onDidChangeChatSessionItems(handle: number): void {
		this._itemProvidersRegistrations.get(handle)?.onDidChangeItems.fire();
	}

	$onDidChangeChatSessionOptions(handle: number, sessionResourceComponents: UriComponents, updates: ReadonlyArray<{ optionId: string; value: string }>): void {
		const sessionResource = URI.revive(sessionResourceComponents);

		this._chatSessionsService.notifySessionOptionsChange(sessionResource, updates);
	}

	async $onDidCommitChatSessionItem(handle: number, originalComponents: UriComponents, modifiedCompoennts: UriComponents): Promise<void> {
		const originalResource = URI.revive(originalComponents);
		const modifiedResource = URI.revive(modifiedCompoennts);

		this._logService.trace(`$onDidCommitChatSessionItem: handle(${handle}), original(${originalResource}), modified(${modifiedResource})`);
		const chatSessionType = this._itemProvidersRegistrations.get(handle)?.provider.chatSessionType;
		if (!chatSessionType) {
			this._logService.error(`No chat session type found for provider handle ${handle}`);
			return;
		}

		const originalEditor = this._editorService.editors.find(editor => editor.resource?.toString() === originalResource.toString());
		const originalModel = this._chatService.getSession(originalResource);
		const contribution = this._chatSessionsService.getAllChatSessionContributions().find(c => c.type === chatSessionType);

		// Find the group containing the original editor
		const originalGroup =
			this.editorGroupService.groups.find(group => group.editors.some(editor => isEqual(editor.resource, originalResource)))
			?? this.editorGroupService.activeGroup;

		const options: IChatEditorOptions = {
			title: {
				preferred: originalEditor?.getName() || undefined,
				fallback: localize('chatEditorContributionName', "{0}", contribution?.displayName),
			}
		};

		// Prefetch the chat session content to make the subsequent editor swap quick
		const newSession = await this._chatSessionsService.getOrCreateChatSession(
			URI.revive(modifiedResource),
			CancellationToken.None,
		);

		if (originalEditor) {
			newSession.transferredState = originalEditor instanceof ChatEditorInput
				? { editingSession: originalEditor.transferOutEditingSession(), inputState: originalModel?.inputModel.toJSON() }
				: undefined;

			this._editorService.replaceEditors([{
				editor: originalEditor,
				replacement: {
					resource: modifiedResource,
					options,
				},
			}], originalGroup);
			return;
		}

		// If chat editor is in the side panel, then those are not listed as editors.
		// In that case we need to transfer editing session using the original model.
		if (originalModel) {
			newSession.transferredState = {
				editingSession: originalModel.editingSession,
				inputState: originalModel.inputModel.toJSON()
			};
		}

		const chatViewWidget = this._chatWidgetService.getWidgetBySessionResource(originalResource);
		if (chatViewWidget && isIChatViewViewContext(chatViewWidget.viewContext)) {
			await this._chatWidgetService.openSession(modifiedResource, ChatViewPaneTarget, { preserveFocus: true });
		} else {
			// Loading the session to ensure the session is created and editing session is transferred.
			const ref = await this._chatService.loadSessionForResource(modifiedResource, ChatAgentLocation.Chat, CancellationToken.None);
			ref?.dispose();
		}
	}

	private async _provideChatSessionItems(handle: number, token: CancellationToken): Promise<IChatSessionItem[]> {
		try {
			// Get all results as an array from the RPC call
			const sessions = await this._proxy.$provideChatSessionItems(handle, token);
			return Promise.all(sessions.map(async session => {
				const uri = URI.revive(session.resource);
				const model = this._chatService.getSession(uri);
				if (model) {
					session = await this.handleSessionModelOverrides(model, session);
				}

				// We can still get stats if there is no model or if fetching from model failed
				if (!session.changes || !model) {
					const stats = (await this._chatService.getMetadataForSession(uri))?.stats;
					// TODO: we shouldn't be converting this, the types should match
					const diffs: IAgentSession['changes'] = {
						files: stats?.fileCount || 0,
						insertions: stats?.added || 0,
						deletions: stats?.removed || 0
					};
					if (hasValidDiff(diffs)) {
						session.changes = diffs;
					}
				}

				return {
					...session,
					changes: revive(session.changes),
					resource: uri,
					iconPath: session.iconPath,
					tooltip: session.tooltip ? this._reviveTooltip(session.tooltip) : undefined,
				} satisfies IChatSessionItem;
			}));
		} catch (error) {
			this._logService.error('Error providing chat sessions:', error);
		}
		return [];
	}

	private async handleSessionModelOverrides(model: IChatModel, session: Dto<IChatSessionItem>): Promise<Dto<IChatSessionItem>> {
		// Override desciription if there's an in-progress count
		const inProgress = model.getRequests().filter(r => r.response && !r.response.isComplete);
		if (inProgress.length) {
			session.description = this._chatSessionsService.getInProgressSessionDescription(model);
		}

		// Override changes
		// TODO: @osortega we don't really use statistics anymore, we need to clarify that in the API
		if (!(session.changes instanceof Array)) {
			const modelStats = await awaitStatsForSession(model);
			if (modelStats) {
				session.changes = {
					files: modelStats.fileCount,
					insertions: modelStats.added,
					deletions: modelStats.removed
				};
			}
		}

		// Override status if the models needs input
		if (model.lastRequest?.response?.state === ResponseModelState.NeedsInput) {
			session.status = ChatSessionStatus.NeedsInput;
		}

		return session;
	}

	private async _provideChatSessionContent(providerHandle: number, sessionResource: URI, token: CancellationToken): Promise<IChatSession> {
		let session = this._activeSessions.get(sessionResource);

		if (!session) {
			session = new ObservableChatSession(
				sessionResource,
				providerHandle,
				this._proxy,
				this._logService,
				this._dialogService
			);
			this._activeSessions.set(sessionResource, session);
			const disposable = session.onWillDispose(() => {
				this._activeSessions.delete(sessionResource);
				this._sessionDisposables.get(sessionResource)?.dispose();
				this._sessionDisposables.delete(sessionResource);
			});
			this._sessionDisposables.set(sessionResource, disposable);
		}

		try {
			await session.initialize(token);
			if (session.options) {
				for (const [_, handle] of this._sessionTypeToHandle) {
					if (handle === providerHandle) {
						for (const [optionId, value] of Object.entries(session.options)) {
							this._chatSessionsService.setSessionOption(sessionResource, optionId, value);
						}
						break;
					}
				}
			}
			return session;
		} catch (error) {
			session.dispose();
			this._logService.error(`Error providing chat session content for handle ${providerHandle} and resource ${sessionResource.toString()}:`, error);
			throw error;
		}
	}

	$unregisterChatSessionItemProvider(handle: number): void {
		this._itemProvidersRegistrations.deleteAndDispose(handle);
	}

	$registerChatSessionContentProvider(handle: number, chatSessionScheme: string): void {
		const provider: IChatSessionContentProvider = {
			provideChatSessionContent: (resource, token) => this._provideChatSessionContent(handle, resource, token)
		};

		this._sessionTypeToHandle.set(chatSessionScheme, handle);
		this._contentProvidersRegistrations.set(handle, this._chatSessionsService.registerChatSessionContentProvider(chatSessionScheme, provider));
		this._proxy.$provideChatSessionProviderOptions(handle, CancellationToken.None).then(options => {
			if (options?.optionGroups && options.optionGroups.length) {
				this._chatSessionsService.setOptionGroupsForSessionType(chatSessionScheme, handle, options.optionGroups);
			}
		}).catch(err => this._logService.error('Error fetching chat session options', err));
	}

	$unregisterChatSessionContentProvider(handle: number): void {
		this._contentProvidersRegistrations.deleteAndDispose(handle);
		for (const [sessionType, h] of this._sessionTypeToHandle) {
			if (h === handle) {
				this._sessionTypeToHandle.delete(sessionType);
				break;
			}
		}

		// dispose all sessions from this provider and clean up its disposables
		for (const [key, session] of this._activeSessions) {
			if (session.providerHandle === handle) {
				session.dispose();
				this._activeSessions.delete(key);
			}
		}
	}

	async $handleProgressChunk(handle: number, sessionResource: UriComponents, requestId: string, chunks: (IChatProgressDto | [IChatProgressDto, number])[]): Promise<void> {
		const resource = URI.revive(sessionResource);
		const observableSession = this._activeSessions.get(resource);
		if (!observableSession) {
			this._logService.warn(`No session found for progress chunks: handle ${handle}, sessionResource ${resource}, requestId ${requestId}`);
			return;
		}

		const chatProgressParts: IChatProgress[] = chunks.map(chunk => {
			const [progress] = Array.isArray(chunk) ? chunk : [chunk];
			return revive(progress) as IChatProgress;
		});

		observableSession.handleProgressChunk(requestId, chatProgressParts);
	}

	$handleProgressComplete(handle: number, sessionResource: UriComponents, requestId: string) {
		const resource = URI.revive(sessionResource);
		const observableSession = this._activeSessions.get(resource);
		if (!observableSession) {
			this._logService.warn(`No session found for progress completion: handle ${handle}, sessionResource ${resource}, requestId ${requestId}`);
			return;
		}

		observableSession.handleProgressComplete(requestId);
	}

	$handleAnchorResolve(handle: number, sesssionResource: UriComponents, requestId: string, requestHandle: string, anchor: Dto<IChatContentInlineReference>): void {
		// throw new Error('Method not implemented.');
	}

	override dispose(): void {
		for (const session of this._activeSessions.values()) {
			session.dispose();
		}
		this._activeSessions.clear();

		for (const disposable of this._sessionDisposables.values()) {
			disposable.dispose();
		}
		this._sessionDisposables.clear();

		super.dispose();
	}

	private _reviveTooltip(tooltip: string | IMarkdownString | undefined): string | MarkdownString | undefined {
		if (!tooltip) {
			return undefined;
		}

		// If it's already a string, return as-is
		if (typeof tooltip === 'string') {
			return tooltip;
		}

		// If it's a serialized IMarkdownString, revive it to MarkdownString
		if (typeof tooltip === 'object' && 'value' in tooltip) {
			return MarkdownString.lift(tooltip);
		}

		return undefined;
	}

	/**
	 * Notify the extension about option changes for a session
	 */
	async notifyOptionsChange(handle: number, sessionResource: URI, updates: ReadonlyArray<{ optionId: string; value: string | IChatSessionProviderOptionItem | undefined }>): Promise<void> {
		try {
			await this._proxy.$provideHandleOptionsChange(handle, sessionResource, updates, CancellationToken.None);
		} catch (error) {
			this._logService.error(`Error notifying extension about options change for handle ${handle}, sessionResource ${sessionResource}:`, error);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadChatStatus.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadChatStatus.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../base/common/lifecycle.js';
import { IChatStatusItemService } from '../../contrib/chat/browser/chatStatus/chatStatusItemService.js';
import { IExtHostContext, extHostNamedCustomer } from '../../services/extensions/common/extHostCustomers.js';
import { ChatStatusItemDto, MainContext, MainThreadChatStatusShape } from '../common/extHost.protocol.js';

@extHostNamedCustomer(MainContext.MainThreadChatStatus)
export class MainThreadChatStatus extends Disposable implements MainThreadChatStatusShape {

	constructor(
		_extHostContext: IExtHostContext,
		@IChatStatusItemService private readonly _chatStatusItemService: IChatStatusItemService,
	) {
		super();
	}

	$setEntry(id: string, entry: ChatStatusItemDto): void {
		this._chatStatusItemService.setOrUpdateEntry({
			id,
			label: entry.title,
			description: entry.description,
			detail: entry.detail,
		});
	}

	$disposeEntry(id: string): void {
		this._chatStatusItemService.deleteEntry(id);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadCLICommands.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadCLICommands.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Schemas } from '../../../base/common/network.js';
import { isWeb } from '../../../base/common/platform.js';
import { isString } from '../../../base/common/types.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { localize } from '../../../nls.js';
import { CommandsRegistry, ICommandService } from '../../../platform/commands/common/commands.js';
import { IExtensionGalleryService, IExtensionManagementService } from '../../../platform/extensionManagement/common/extensionManagement.js';
import { ExtensionManagementCLI } from '../../../platform/extensionManagement/common/extensionManagementCLI.js';
import { getExtensionId } from '../../../platform/extensionManagement/common/extensionManagementUtil.js';
import { IExtensionManifest } from '../../../platform/extensions/common/extensions.js';
import { IInstantiationService, ServicesAccessor } from '../../../platform/instantiation/common/instantiation.js';
import { ServiceCollection } from '../../../platform/instantiation/common/serviceCollection.js';
import { ILabelService } from '../../../platform/label/common/label.js';
import { AbstractMessageLogger, ILogger, LogLevel } from '../../../platform/log/common/log.js';
import { IOpenerService } from '../../../platform/opener/common/opener.js';
import { IOpenWindowOptions, IWindowOpenable } from '../../../platform/window/common/window.js';
import { IWorkbenchEnvironmentService } from '../../services/environment/common/environmentService.js';
import { IExtensionManagementServerService } from '../../services/extensionManagement/common/extensionManagement.js';
import { IExtensionManifestPropertiesService } from '../../services/extensions/common/extensionManifestPropertiesService.js';


// this class contains the commands that the CLI server is reying on

CommandsRegistry.registerCommand('_remoteCLI.openExternal', function (accessor: ServicesAccessor, uri: UriComponents | string): Promise<boolean> {
	const openerService = accessor.get(IOpenerService);
	return openerService.open(isString(uri) ? uri : URI.revive(uri), { openExternal: true, allowTunneling: true });
});

CommandsRegistry.registerCommand('_remoteCLI.windowOpen', function (accessor: ServicesAccessor, toOpen: IWindowOpenable[], options: IOpenWindowOptions) {
	const commandService = accessor.get(ICommandService);
	if (!toOpen.length) {
		return commandService.executeCommand('_files.newWindow', options);
	}
	return commandService.executeCommand('_files.windowOpen', toOpen, options);
});

CommandsRegistry.registerCommand('_remoteCLI.getSystemStatus', function (accessor: ServicesAccessor): Promise<string | undefined> {
	const commandService = accessor.get(ICommandService);
	return commandService.executeCommand<string>('_issues.getSystemStatus');
});

interface ManageExtensionsArgs {
	list?: { showVersions?: boolean; category?: string };
	install?: (string | URI)[];
	uninstall?: string[];
	force?: boolean;
}

CommandsRegistry.registerCommand('_remoteCLI.manageExtensions', async function (accessor: ServicesAccessor, args: ManageExtensionsArgs): Promise<string | undefined> {
	const instantiationService = accessor.get(IInstantiationService);
	const extensionManagementServerService = accessor.get(IExtensionManagementServerService);
	const remoteExtensionManagementService = extensionManagementServerService.remoteExtensionManagementServer?.extensionManagementService;
	if (!remoteExtensionManagementService) {
		return;
	}

	const lines: string[] = [];
	const logger = new class extends AbstractMessageLogger {
		protected override log(level: LogLevel, message: string): void {
			lines.push(message);
		}
	}();
	const childInstantiationService = instantiationService.createChild(new ServiceCollection([IExtensionManagementService, remoteExtensionManagementService]));
	try {
		const cliService = childInstantiationService.createInstance(RemoteExtensionManagementCLI, logger);

		if (args.list) {
			await cliService.listExtensions(!!args.list.showVersions, args.list.category, undefined);
		} else {
			const revive = (inputs: (string | UriComponents)[]) => inputs.map(input => isString(input) ? input : URI.revive(input));
			if (Array.isArray(args.install) && args.install.length) {
				try {
					await cliService.installExtensions(revive(args.install), [], { isMachineScoped: true }, !!args.force);
				} catch (e) {
					lines.push(e.message);
				}
			}
			if (Array.isArray(args.uninstall) && args.uninstall.length) {
				try {
					await cliService.uninstallExtensions(revive(args.uninstall), !!args.force, undefined);
				} catch (e) {
					lines.push(e.message);
				}
			}
		}
		return lines.join('\n');
	} finally {
		childInstantiationService.dispose();
	}

});

class RemoteExtensionManagementCLI extends ExtensionManagementCLI {

	private _location: string | undefined;

	constructor(
		logger: ILogger,
		@IExtensionManagementService extensionManagementService: IExtensionManagementService,
		@IExtensionGalleryService extensionGalleryService: IExtensionGalleryService,
		@ILabelService labelService: ILabelService,
		@IWorkbenchEnvironmentService envService: IWorkbenchEnvironmentService,
		@IExtensionManifestPropertiesService private readonly _extensionManifestPropertiesService: IExtensionManifestPropertiesService,
	) {
		super(logger, extensionManagementService, extensionGalleryService);

		const remoteAuthority = envService.remoteAuthority;
		this._location = remoteAuthority ? labelService.getHostLabel(Schemas.vscodeRemote, remoteAuthority) : undefined;
	}

	protected override get location(): string | undefined {
		return this._location;
	}

	protected override validateExtensionKind(manifest: IExtensionManifest): boolean {
		if (!this._extensionManifestPropertiesService.canExecuteOnWorkspace(manifest)
			// Web extensions installed on remote can be run in web worker extension host
			&& !(isWeb && this._extensionManifestPropertiesService.canExecuteOnWeb(manifest))) {
			this.logger.info(localize('cannot be installed', "Cannot install the '{0}' extension because it is declared to not run in this setup.", getExtensionId(manifest.publisher, manifest.name)));
			return false;
		}
		return true;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadClipboard.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadClipboard.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { MainContext, MainThreadClipboardShape } from '../common/extHost.protocol.js';
import { IClipboardService } from '../../../platform/clipboard/common/clipboardService.js';
import { ILogService } from '../../../platform/log/common/log.js';

@extHostNamedCustomer(MainContext.MainThreadClipboard)
export class MainThreadClipboard implements MainThreadClipboardShape {

	constructor(
		_context: IExtHostContext,
		@IClipboardService private readonly _clipboardService: IClipboardService,
		@ILogService private readonly _logService: ILogService
	) { }

	dispose(): void {
		// nothing
	}

	$readText(): Promise<string> {
		this._logService.trace('MainThreadClipboard#readText');
		const readText = this._clipboardService.readText();
		return readText;
	}

	$writeText(value: string): Promise<void> {
		this._logService.trace('MainThreadClipboard#writeText with text.length : ', value.length);
		return this._clipboardService.writeText(value);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadCodeInsets.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadCodeInsets.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getWindow } from '../../../base/browser/dom.js';
import { DisposableStore } from '../../../base/common/lifecycle.js';
import { isEqual } from '../../../base/common/resources.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { IActiveCodeEditor, IViewZone } from '../../../editor/browser/editorBrowser.js';
import { ICodeEditorService } from '../../../editor/browser/services/codeEditorService.js';
import { ExtensionIdentifier } from '../../../platform/extensions/common/extensions.js';
import { reviveWebviewContentOptions } from './mainThreadWebviews.js';
import { ExtHostContext, ExtHostEditorInsetsShape, IWebviewContentOptions, MainContext, MainThreadEditorInsetsShape } from '../common/extHost.protocol.js';
import { IWebviewService, IWebviewElement } from '../../contrib/webview/browser/webview.js';
import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';

// todo@jrieken move these things back into something like contrib/insets
class EditorWebviewZone implements IViewZone {

	readonly domNode: HTMLElement;
	readonly afterLineNumber: number;
	readonly afterColumn: number;
	readonly heightInLines: number;

	private _id?: string;
	// suppressMouseDown?: boolean | undefined;
	// heightInPx?: number | undefined;
	// minWidthInPx?: number | undefined;
	// marginDomNode?: HTMLElement | null | undefined;
	// onDomNodeTop?: ((top: number) => void) | undefined;
	// onComputedHeight?: ((height: number) => void) | undefined;

	constructor(
		readonly editor: IActiveCodeEditor,
		readonly line: number,
		readonly height: number,
		readonly webview: IWebviewElement,
	) {
		this.domNode = document.createElement('div');
		this.domNode.style.zIndex = '10'; // without this, the webview is not interactive
		this.afterLineNumber = line;
		this.afterColumn = 1;
		this.heightInLines = height;

		editor.changeViewZones(accessor => this._id = accessor.addZone(this));
		webview.mountTo(this.domNode, getWindow(editor.getDomNode()));
	}

	dispose(): void {
		this.editor.changeViewZones(accessor => this._id && accessor.removeZone(this._id));
	}
}

@extHostNamedCustomer(MainContext.MainThreadEditorInsets)
export class MainThreadEditorInsets implements MainThreadEditorInsetsShape {

	private readonly _proxy: ExtHostEditorInsetsShape;
	private readonly _disposables = new DisposableStore();
	private readonly _insets = new Map<number, EditorWebviewZone>();

	constructor(
		context: IExtHostContext,
		@ICodeEditorService private readonly _editorService: ICodeEditorService,
		@IWebviewService private readonly _webviewService: IWebviewService,
	) {
		this._proxy = context.getProxy(ExtHostContext.ExtHostEditorInsets);
	}

	dispose(): void {
		this._disposables.dispose();
	}

	async $createEditorInset(handle: number, id: string, uri: UriComponents, line: number, height: number, options: IWebviewContentOptions, extensionId: ExtensionIdentifier, extensionLocation: UriComponents): Promise<void> {

		let editor: IActiveCodeEditor | undefined;
		id = id.substr(0, id.indexOf(',')); //todo@jrieken HACK

		for (const candidate of this._editorService.listCodeEditors()) {
			if (candidate.getId() === id && candidate.hasModel() && isEqual(candidate.getModel().uri, URI.revive(uri))) {
				editor = candidate;
				break;
			}
		}

		if (!editor) {
			setTimeout(() => this._proxy.$onDidDispose(handle));
			return;
		}

		const disposables = new DisposableStore();

		const webview = this._webviewService.createWebviewElement({
			title: undefined,
			options: {
				enableFindWidget: false,
			},
			contentOptions: reviveWebviewContentOptions(options),
			extension: { id: extensionId, location: URI.revive(extensionLocation) }
		});

		const webviewZone = new EditorWebviewZone(editor, line, height, webview);

		const remove = () => {
			disposables.dispose();
			this._proxy.$onDidDispose(handle);
			this._insets.delete(handle);
		};

		disposables.add(editor.onDidChangeModel(remove));
		disposables.add(editor.onDidDispose(remove));
		disposables.add(webviewZone);
		disposables.add(webview);
		disposables.add(webview.onMessage(msg => this._proxy.$onDidReceiveMessage(handle, msg.message)));

		this._insets.set(handle, webviewZone);
	}

	$disposeEditorInset(handle: number): void {
		const inset = this.getInset(handle);
		this._insets.delete(handle);
		inset.dispose();
	}

	$setHtml(handle: number, value: string): void {
		const inset = this.getInset(handle);
		inset.webview.setHtml(value);
	}

	$setOptions(handle: number, options: IWebviewContentOptions): void {
		const inset = this.getInset(handle);
		inset.webview.contentOptions = reviveWebviewContentOptions(options);
	}

	async $postMessage(handle: number, value: unknown): Promise<boolean> {
		const inset = this.getInset(handle);
		inset.webview.postMessage(value);
		return true;
	}

	private getInset(handle: number): EditorWebviewZone {
		const inset = this._insets.get(handle);
		if (!inset) {
			throw new Error('Unknown inset');
		}
		return inset;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadCommands.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadCommands.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DisposableMap, IDisposable } from '../../../base/common/lifecycle.js';
import { revive } from '../../../base/common/marshalling.js';
import { CommandsRegistry, ICommandMetadata, ICommandService } from '../../../platform/commands/common/commands.js';
import { IExtHostContext, extHostNamedCustomer } from '../../services/extensions/common/extHostCustomers.js';
import { IExtensionService } from '../../services/extensions/common/extensions.js';
import { Dto, SerializableObjectWithBuffers } from '../../services/extensions/common/proxyIdentifier.js';
import { ExtHostCommandsShape, ExtHostContext, MainContext, MainThreadCommandsShape } from '../common/extHost.protocol.js';
import { isString } from '../../../base/common/types.js';


@extHostNamedCustomer(MainContext.MainThreadCommands)
export class MainThreadCommands implements MainThreadCommandsShape {

	private readonly _commandRegistrations = new DisposableMap<string>();
	private readonly _generateCommandsDocumentationRegistration: IDisposable;
	private readonly _proxy: ExtHostCommandsShape;

	constructor(
		extHostContext: IExtHostContext,
		@ICommandService private readonly _commandService: ICommandService,
		@IExtensionService private readonly _extensionService: IExtensionService,
	) {
		this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostCommands);

		this._generateCommandsDocumentationRegistration = CommandsRegistry.registerCommand('_generateCommandsDocumentation', () => this._generateCommandsDocumentation());
	}

	dispose() {
		this._commandRegistrations.dispose();
		this._generateCommandsDocumentationRegistration.dispose();
	}

	private async _generateCommandsDocumentation(): Promise<void> {
		const result = await this._proxy.$getContributedCommandMetadata();

		// add local commands
		const commands = CommandsRegistry.getCommands();
		for (const [id, command] of commands) {
			if (command.metadata) {
				result[id] = command.metadata;
			}
		}

		// print all as markdown
		const all: string[] = [];
		for (const id in result) {
			all.push('`' + id + '` - ' + _generateMarkdown(result[id]));
		}
		console.log(all.join('\n'));
	}

	$registerCommand(id: string): void {
		this._commandRegistrations.set(
			id,
			CommandsRegistry.registerCommand(id, (accessor, ...args) => {
				return this._proxy.$executeContributedCommand(id, ...args).then(result => {
					return revive(result);
				});
			})
		);
	}

	$unregisterCommand(id: string): void {
		this._commandRegistrations.deleteAndDispose(id);
	}

	$fireCommandActivationEvent(id: string): void {
		const activationEvent = `onCommand:${id}`;
		if (!this._extensionService.activationEventIsDone(activationEvent)) {
			// this is NOT awaited because we only use it as drive-by-activation
			// for commands that are already known inside the extension host
			this._extensionService.activateByEvent(activationEvent);
		}
	}

	async $executeCommand<T>(id: string, args: unknown[] | SerializableObjectWithBuffers<unknown[]>, retry: boolean): Promise<T | undefined> {
		if (args instanceof SerializableObjectWithBuffers) {
			args = args.value;
		}
		for (let i = 0; i < args.length; i++) {
			args[i] = revive(args[i]);
		}
		if (retry && args.length > 0 && !CommandsRegistry.getCommand(id)) {
			await this._extensionService.activateByEvent(`onCommand:${id}`);
			throw new Error('$executeCommand:retry');
		}
		return this._commandService.executeCommand<T>(id, ...args);
	}

	$getCommands(): Promise<string[]> {
		return Promise.resolve([...CommandsRegistry.getCommands().keys()]);
	}
}

// --- command doc

function _generateMarkdown(description: string | Dto<ICommandMetadata> | ICommandMetadata): string {
	if (typeof description === 'string') {
		return description;
	} else {
		const descriptionString = isString(description.description)
			? description.description
			// Our docs website is in English, so keep the original here.
			: description.description.original;
		const parts = [descriptionString];
		parts.push('\n\n');
		if (description.args) {
			for (const arg of description.args) {
				parts.push(`* _${arg.name}_ - ${arg.description || ''}\n`);
			}
		}
		if (description.returns) {
			parts.push(`* _(returns)_ - ${description.returns}`);
		}
		parts.push('\n\n');
		return parts.join('');
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadComments.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadComments.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable, DisposableMap, DisposableStore, IDisposable, MutableDisposable } from '../../../base/common/lifecycle.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { IRange, Range } from '../../../editor/common/core/range.js';
import * as languages from '../../../editor/common/languages.js';
import { ExtensionIdentifier } from '../../../platform/extensions/common/extensions.js';
import { Registry } from '../../../platform/registry/common/platform.js';
import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { ICommentController, ICommentService } from '../../contrib/comments/browser/commentService.js';
import { CommentsPanel } from '../../contrib/comments/browser/commentsView.js';
import { CommentProviderFeatures, ExtHostCommentsShape, ExtHostContext, MainContext, MainThreadCommentsShape, CommentThreadChanges } from '../common/extHost.protocol.js';
import { COMMENTS_VIEW_ID, COMMENTS_VIEW_STORAGE_ID, COMMENTS_VIEW_TITLE } from '../../contrib/comments/browser/commentsTreeViewer.js';
import { ViewContainer, IViewContainersRegistry, Extensions as ViewExtensions, ViewContainerLocation, IViewsRegistry, IViewDescriptorService } from '../../common/views.js';
import { SyncDescriptor } from '../../../platform/instantiation/common/descriptors.js';
import { ViewPaneContainer } from '../../browser/parts/views/viewPaneContainer.js';
import { Codicon } from '../../../base/common/codicons.js';
import { registerIcon } from '../../../platform/theme/common/iconRegistry.js';
import { localize } from '../../../nls.js';
import { MarshalledId } from '../../../base/common/marshallingIds.js';
import { ICellRange } from '../../contrib/notebook/common/notebookRange.js';
import { Schemas } from '../../../base/common/network.js';
import { IViewsService } from '../../services/views/common/viewsService.js';
import { MarshalledCommentThread } from '../../common/comments.js';
import { revealCommentThread } from '../../contrib/comments/browser/commentsController.js';
import { IEditorService } from '../../services/editor/common/editorService.js';
import { IUriIdentityService } from '../../../platform/uriIdentity/common/uriIdentity.js';

export class MainThreadCommentThread<T> implements languages.CommentThread<T> {
	private _input?: languages.CommentInput;
	get input(): languages.CommentInput | undefined {
		return this._input;
	}

	set input(value: languages.CommentInput | undefined) {
		this._input = value;
		this._onDidChangeInput.fire(value);
	}

	private readonly _onDidChangeInput = new Emitter<languages.CommentInput | undefined>();
	get onDidChangeInput(): Event<languages.CommentInput | undefined> { return this._onDidChangeInput.event; }

	private _label: string | undefined;

	get label(): string | undefined {
		return this._label;
	}

	set label(label: string | undefined) {
		this._label = label;
		this._onDidChangeLabel.fire(this._label);
	}

	private _contextValue: string | undefined;

	get contextValue(): string | undefined {
		return this._contextValue;
	}

	set contextValue(context: string | undefined) {
		this._contextValue = context;
	}

	private readonly _onDidChangeLabel = new Emitter<string | undefined>();
	readonly onDidChangeLabel: Event<string | undefined> = this._onDidChangeLabel.event;

	private _comments: ReadonlyArray<languages.Comment> | undefined;

	public get comments(): ReadonlyArray<languages.Comment> | undefined {
		return this._comments;
	}

	public set comments(newComments: ReadonlyArray<languages.Comment> | undefined) {
		this._comments = newComments;
		this._onDidChangeComments.fire(this._comments);
	}

	private readonly _onDidChangeComments = new Emitter<readonly languages.Comment[] | undefined>();
	get onDidChangeComments(): Event<readonly languages.Comment[] | undefined> { return this._onDidChangeComments.event; }

	set range(range: T | undefined) {
		this._range = range;
	}

	get range(): T | undefined {
		return this._range;
	}

	private readonly _onDidChangeCanReply = new Emitter<boolean>();
	get onDidChangeCanReply(): Event<boolean> { return this._onDidChangeCanReply.event; }
	set canReply(state: boolean | languages.CommentAuthorInformation) {
		this._canReply = state;
		this._onDidChangeCanReply.fire(!!this._canReply);
	}

	get canReply() {
		return this._canReply;
	}

	private _collapsibleState: languages.CommentThreadCollapsibleState | undefined = languages.CommentThreadCollapsibleState.Collapsed;
	get collapsibleState() {
		return this._collapsibleState;
	}

	set collapsibleState(newState: languages.CommentThreadCollapsibleState | undefined) {
		if (this.initialCollapsibleState === undefined) {
			this.initialCollapsibleState = newState;
		}

		if (newState !== this._collapsibleState) {
			this._collapsibleState = newState;
			this._onDidChangeCollapsibleState.fire(this._collapsibleState);
		}
	}

	private _initialCollapsibleState: languages.CommentThreadCollapsibleState | undefined;
	get initialCollapsibleState() {
		return this._initialCollapsibleState;
	}

	private set initialCollapsibleState(initialCollapsibleState: languages.CommentThreadCollapsibleState | undefined) {
		this._initialCollapsibleState = initialCollapsibleState;
		this._onDidChangeInitialCollapsibleState.fire(initialCollapsibleState);
	}

	private readonly _onDidChangeCollapsibleState = new Emitter<languages.CommentThreadCollapsibleState | undefined>();
	public onDidChangeCollapsibleState = this._onDidChangeCollapsibleState.event;
	private readonly _onDidChangeInitialCollapsibleState = new Emitter<languages.CommentThreadCollapsibleState | undefined>();
	public onDidChangeInitialCollapsibleState = this._onDidChangeInitialCollapsibleState.event;

	private _isDisposed: boolean;

	get isDisposed(): boolean {
		return this._isDisposed;
	}

	isDocumentCommentThread(): this is languages.CommentThread<IRange> {
		return this._range === undefined || Range.isIRange(this._range);
	}

	private _state: languages.CommentThreadState | undefined;
	get state() {
		return this._state;
	}

	set state(newState: languages.CommentThreadState | undefined) {
		this._state = newState;
		this._onDidChangeState.fire(this._state);
	}

	private _applicability: languages.CommentThreadApplicability | undefined;

	get applicability(): languages.CommentThreadApplicability | undefined {
		return this._applicability;
	}

	set applicability(value: languages.CommentThreadApplicability | undefined) {
		this._applicability = value;
		this._onDidChangeApplicability.fire(value);
	}

	private readonly _onDidChangeApplicability = new Emitter<languages.CommentThreadApplicability | undefined>();
	readonly onDidChangeApplicability: Event<languages.CommentThreadApplicability | undefined> = this._onDidChangeApplicability.event;

	public get isTemplate(): boolean {
		return this._isTemplate;
	}

	private readonly _onDidChangeState = new Emitter<languages.CommentThreadState | undefined>();
	public onDidChangeState = this._onDidChangeState.event;

	constructor(
		public commentThreadHandle: number,
		public controllerHandle: number,
		public extensionId: string,
		public threadId: string,
		public resource: string,
		private _range: T | undefined,
		comments: languages.Comment[] | undefined,
		private _canReply: boolean | languages.CommentAuthorInformation,
		private _isTemplate: boolean,
		public editorId?: string
	) {
		this._isDisposed = false;
		if (_isTemplate) {
			this.comments = [];
		} else if (comments) {
			this._comments = comments;
		}
	}

	batchUpdate(changes: CommentThreadChanges<T>) {
		const modified = (value: keyof CommentThreadChanges): boolean =>
			Object.prototype.hasOwnProperty.call(changes, value);

		if (modified('range')) { this._range = changes.range!; }
		if (modified('label')) { this._label = changes.label; }
		if (modified('contextValue')) { this._contextValue = changes.contextValue === null ? undefined : changes.contextValue; }
		if (modified('comments')) { this.comments = changes.comments; }
		if (modified('collapseState')) { this.collapsibleState = changes.collapseState; }
		if (modified('canReply')) { this.canReply = changes.canReply!; }
		if (modified('state')) { this.state = changes.state!; }
		if (modified('applicability')) { this.applicability = changes.applicability!; }
		if (modified('isTemplate')) { this._isTemplate = changes.isTemplate!; }
	}

	hasComments(): boolean {
		return !!this.comments && this.comments.length > 0;
	}

	dispose() {
		this._isDisposed = true;
		this._onDidChangeCollapsibleState.dispose();
		this._onDidChangeComments.dispose();
		this._onDidChangeInput.dispose();
		this._onDidChangeLabel.dispose();
		this._onDidChangeState.dispose();
	}

	toJSON(): MarshalledCommentThread {
		return {
			$mid: MarshalledId.CommentThread,
			commentControlHandle: this.controllerHandle,
			commentThreadHandle: this.commentThreadHandle,
		};
	}
}

class CommentThreadWithDisposable {
	public readonly disposableStore: DisposableStore = new DisposableStore();
	constructor(public readonly thread: MainThreadCommentThread<IRange | ICellRange>) { }
	dispose() {
		this.disposableStore.dispose();
	}
}

export class MainThreadCommentController extends Disposable implements ICommentController {
	get handle(): number {
		return this._handle;
	}

	get id(): string {
		return this._id;
	}

	get contextValue(): string {
		return this._id;
	}

	get proxy(): ExtHostCommentsShape {
		return this._proxy;
	}

	get label(): string {
		return this._label;
	}

	private _reactions: languages.CommentReaction[] | undefined;

	get reactions() {
		return this._reactions;
	}

	set reactions(reactions: languages.CommentReaction[] | undefined) {
		this._reactions = reactions;
	}

	get options() {
		return this._features.options;
	}

	private readonly _threads: DisposableMap<number, CommentThreadWithDisposable> = this._register(new DisposableMap<number, CommentThreadWithDisposable>());
	public activeEditingCommentThread?: MainThreadCommentThread<IRange | ICellRange>;

	get features(): CommentProviderFeatures {
		return this._features;
	}

	get owner() {
		return this._id;
	}

	constructor(
		private readonly _proxy: ExtHostCommentsShape,
		private readonly _commentService: ICommentService,
		private readonly _handle: number,
		private readonly _uniqueId: string,
		private readonly _id: string,
		private readonly _label: string,
		private _features: CommentProviderFeatures
	) {
		super();
	}

	get activeComment() {
		return this._activeComment;
	}

	private _activeComment: { thread: languages.CommentThread; comment?: languages.Comment } | undefined;
	async setActiveCommentAndThread(commentInfo: { thread: languages.CommentThread; comment?: languages.Comment } | undefined) {
		this._activeComment = commentInfo;
		return this._proxy.$setActiveComment(this._handle, commentInfo ? { commentThreadHandle: commentInfo.thread.commentThreadHandle, uniqueIdInThread: commentInfo.comment?.uniqueIdInThread } : undefined);
	}

	updateFeatures(features: CommentProviderFeatures) {
		this._features = features;
	}

	createCommentThread(extensionId: string,
		commentThreadHandle: number,
		threadId: string,
		resource: UriComponents,
		range: IRange | ICellRange | undefined,
		comments: languages.Comment[],
		isTemplate: boolean,
		editorId?: string
	): languages.CommentThread<IRange | ICellRange> {
		const thread = new MainThreadCommentThread(
			commentThreadHandle,
			this.handle,
			extensionId,
			threadId,
			URI.revive(resource).toString(),
			range,
			comments,
			true,
			isTemplate,
			editorId
		);

		const threadWithDisposable = new CommentThreadWithDisposable(thread);
		this._threads.set(commentThreadHandle, threadWithDisposable);
		threadWithDisposable.disposableStore.add(thread.onDidChangeCollapsibleState(() => {
			this.proxy.$updateCommentThread(this.handle, thread.commentThreadHandle, { collapseState: thread.collapsibleState });
		}));


		if (thread.isDocumentCommentThread()) {
			this._commentService.updateComments(this._uniqueId, {
				added: [thread],
				removed: [],
				changed: [],
				pending: []
			});
		} else {
			this._commentService.updateNotebookComments(this._uniqueId, {
				added: [thread as MainThreadCommentThread<ICellRange>],
				removed: [],
				changed: [],
				pending: []
			});
		}

		return thread;
	}

	updateCommentThread(commentThreadHandle: number,
		threadId: string,
		resource: UriComponents,
		changes: CommentThreadChanges): void {
		const thread = this.getKnownThread(commentThreadHandle);
		thread.batchUpdate(changes);

		if (thread.isDocumentCommentThread()) {
			this._commentService.updateComments(this._uniqueId, {
				added: [],
				removed: [],
				changed: [thread],
				pending: []
			});
		} else {
			this._commentService.updateNotebookComments(this._uniqueId, {
				added: [],
				removed: [],
				changed: [thread as MainThreadCommentThread<ICellRange>],
				pending: []
			});
		}

	}

	deleteCommentThread(commentThreadHandle: number) {
		const thread = this.getKnownThread(commentThreadHandle);
		this._threads.deleteAndDispose(commentThreadHandle);
		thread.dispose();

		if (thread.isDocumentCommentThread()) {
			this._commentService.updateComments(this._uniqueId, {
				added: [],
				removed: [thread],
				changed: [],
				pending: []
			});
		} else {
			this._commentService.updateNotebookComments(this._uniqueId, {
				added: [],
				removed: [thread as MainThreadCommentThread<ICellRange>],
				changed: [],
				pending: []
			});
		}
	}

	deleteCommentThreadMain(commentThreadId: string) {
		for (const { thread } of this._threads.values()) {
			if (thread.threadId === commentThreadId) {
				this._proxy.$deleteCommentThread(this._handle, thread.commentThreadHandle);
			}
		}
	}

	updateInput(input: string) {
		const thread = this.activeEditingCommentThread;

		if (thread && thread.input) {
			const commentInput = thread.input;
			commentInput.value = input;
			thread.input = commentInput;
		}
	}

	updateCommentingRanges(resourceHints?: languages.CommentingRangeResourceHint) {
		this._commentService.updateCommentingRanges(this._uniqueId, resourceHints);
	}

	private getKnownThread(commentThreadHandle: number): MainThreadCommentThread<IRange | ICellRange> {
		const thread = this._threads.get(commentThreadHandle);
		if (!thread) {
			throw new Error('unknown thread');
		}
		return thread.thread;
	}

	async getDocumentComments(resource: URI, token: CancellationToken) {
		if (resource.scheme === Schemas.vscodeNotebookCell) {
			return {
				uniqueOwner: this._uniqueId,
				label: this.label,
				threads: [],
				commentingRanges: {
					resource: resource,
					ranges: [],
					fileComments: false
				}
			};
		}

		const ret: languages.CommentThread<IRange>[] = [];
		for (const thread of [...this._threads.keys()]) {
			const commentThread = this._threads.get(thread)!;
			if (commentThread.thread.resource === resource.toString()) {
				if (commentThread.thread.isDocumentCommentThread()) {
					ret.push(commentThread.thread);
				}
			}
		}

		const commentingRanges = await this._proxy.$provideCommentingRanges(this.handle, resource, token);

		return {
			uniqueOwner: this._uniqueId,
			label: this.label,
			threads: ret,
			commentingRanges: {
				resource: resource,
				ranges: commentingRanges?.ranges || [],
				fileComments: !!commentingRanges?.fileComments
			}
		};
	}

	async getNotebookComments(resource: URI, token: CancellationToken) {
		if (resource.scheme !== Schemas.vscodeNotebookCell) {
			return {
				uniqueOwner: this._uniqueId,
				label: this.label,
				threads: []
			};
		}

		const ret: languages.CommentThread<ICellRange>[] = [];
		for (const thread of [...this._threads.keys()]) {
			const commentThread = this._threads.get(thread)!;
			if (commentThread.thread.resource === resource.toString()) {
				if (!commentThread.thread.isDocumentCommentThread()) {
					ret.push(commentThread.thread as languages.CommentThread<ICellRange>);
				}
			}
		}

		return {
			uniqueOwner: this._uniqueId,
			label: this.label,
			threads: ret
		};
	}

	async toggleReaction(uri: URI, thread: languages.CommentThread, comment: languages.Comment, reaction: languages.CommentReaction, token: CancellationToken): Promise<void> {
		return this._proxy.$toggleReaction(this._handle, thread.commentThreadHandle, uri, comment, reaction);
	}

	getAllComments(): MainThreadCommentThread<IRange | ICellRange>[] {
		const ret: MainThreadCommentThread<IRange | ICellRange>[] = [];
		for (const thread of [...this._threads.keys()]) {
			ret.push(this._threads.get(thread)!.thread);
		}

		return ret;
	}

	createCommentThreadTemplate(resource: UriComponents, range: IRange | undefined, editorId?: string): Promise<void> {
		return this._proxy.$createCommentThreadTemplate(this.handle, resource, range, editorId);
	}

	async updateCommentThreadTemplate(threadHandle: number, range: IRange) {
		await this._proxy.$updateCommentThreadTemplate(this.handle, threadHandle, range);
	}

	toJSON() {
		return {
			$mid: MarshalledId.CommentController,
			handle: this.handle
		};
	}
}


const commentsViewIcon = registerIcon('comments-view-icon', Codicon.commentDiscussion, localize('commentsViewIcon', 'View icon of the comments view.'));

@extHostNamedCustomer(MainContext.MainThreadComments)
export class MainThreadComments extends Disposable implements MainThreadCommentsShape {
	private readonly _proxy: ExtHostCommentsShape;

	private _handlers = new Map<number, string>();
	private _commentControllers = new Map<number, MainThreadCommentController>();

	private _activeEditingCommentThread?: MainThreadCommentThread<IRange | ICellRange>;
	private readonly _activeEditingCommentThreadDisposables = this._register(new DisposableStore());

	private readonly _openViewListener: MutableDisposable<IDisposable> = this._register(new MutableDisposable());
	private readonly _onChangeContainerListener: MutableDisposable<IDisposable> = this._register(new MutableDisposable());
	private readonly _onChangeContainerLocationListener: MutableDisposable<IDisposable> = this._register(new MutableDisposable());

	constructor(
		extHostContext: IExtHostContext,
		@ICommentService private readonly _commentService: ICommentService,
		@IViewsService private readonly _viewsService: IViewsService,
		@IViewDescriptorService private readonly _viewDescriptorService: IViewDescriptorService,
		@IUriIdentityService private readonly _uriIdentityService: IUriIdentityService,
		@IEditorService private readonly _editorService: IEditorService
	) {
		super();
		this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostComments);
		this._commentService.unregisterCommentController();

		this._register(this._commentService.onDidChangeActiveEditingCommentThread(async thread => {
			const handle = (thread as MainThreadCommentThread<IRange | ICellRange>).controllerHandle;
			const controller = this._commentControllers.get(handle);

			if (!controller) {
				return;
			}

			this._activeEditingCommentThreadDisposables.clear();
			this._activeEditingCommentThread = thread as MainThreadCommentThread<IRange | ICellRange>;
			controller.activeEditingCommentThread = this._activeEditingCommentThread;
		}));
	}

	$registerCommentController(handle: number, id: string, label: string, extensionId: string): void {
		const providerId = `${id}-${extensionId}`;
		this._handlers.set(handle, providerId);

		const provider = new MainThreadCommentController(this._proxy, this._commentService, handle, providerId, id, label, {});
		this._commentService.registerCommentController(providerId, provider);
		this._commentControllers.set(handle, provider);

		this._register(this._commentService.onResourceHasCommentingRanges(e => {
			this.registerView();
		}));

		this._register(this._commentService.onDidUpdateCommentThreads(e => {
			this.registerView();
		}));

		this._commentService.setWorkspaceComments(String(handle), []);
	}

	$unregisterCommentController(handle: number): void {
		const providerId = this._handlers.get(handle);
		this._handlers.delete(handle);
		this._commentControllers.get(handle)?.dispose();
		this._commentControllers.delete(handle);

		if (typeof providerId !== 'string') {
			return;
			// throw new Error('unknown handler');
		} else {
			this._commentService.unregisterCommentController(providerId);
		}
	}

	$updateCommentControllerFeatures(handle: number, features: CommentProviderFeatures): void {
		const provider = this._commentControllers.get(handle);

		if (!provider) {
			return undefined;
		}

		provider.updateFeatures(features);
	}

	$createCommentThread(handle: number,
		commentThreadHandle: number,
		threadId: string,
		resource: UriComponents,
		range: IRange | ICellRange | undefined,
		comments: languages.Comment[],
		extensionId: ExtensionIdentifier,
		isTemplate: boolean,
		editorId?: string
	): languages.CommentThread<IRange | ICellRange> | undefined {
		const provider = this._commentControllers.get(handle);

		if (!provider) {
			return undefined;
		}

		return provider.createCommentThread(extensionId.value, commentThreadHandle, threadId, resource, range, comments, isTemplate, editorId);
	}

	$updateCommentThread(handle: number,
		commentThreadHandle: number,
		threadId: string,
		resource: UriComponents,
		changes: CommentThreadChanges): void {
		const provider = this._commentControllers.get(handle);

		if (!provider) {
			return undefined;
		}

		return provider.updateCommentThread(commentThreadHandle, threadId, resource, changes);
	}

	$deleteCommentThread(handle: number, commentThreadHandle: number) {
		const provider = this._commentControllers.get(handle);

		if (!provider) {
			return;
		}

		return provider.deleteCommentThread(commentThreadHandle);
	}

	$updateCommentingRanges(handle: number, resourceHints?: languages.CommentingRangeResourceHint) {
		const provider = this._commentControllers.get(handle);

		if (!provider) {
			return;
		}

		provider.updateCommentingRanges(resourceHints);
	}

	async $revealCommentThread(handle: number, commentThreadHandle: number, commentUniqueIdInThread: number, options: languages.CommentThreadRevealOptions): Promise<void> {
		const provider = this._commentControllers.get(handle);

		if (!provider) {
			return Promise.resolve();
		}

		const thread = provider.getAllComments().find(thread => thread.commentThreadHandle === commentThreadHandle);
		if (!thread || !thread.isDocumentCommentThread()) {
			return Promise.resolve();
		}

		const comment = thread.comments?.find(comment => comment.uniqueIdInThread === commentUniqueIdInThread);

		revealCommentThread(this._commentService, this._editorService, this._uriIdentityService, thread, comment, options.focusReply, undefined, options.preserveFocus);
	}

	async $hideCommentThread(handle: number, commentThreadHandle: number): Promise<void> {
		const provider = this._commentControllers.get(handle);

		if (!provider) {
			return Promise.resolve();
		}

		const thread = provider.getAllComments().find(thread => thread.commentThreadHandle === commentThreadHandle);
		if (!thread || !thread.isDocumentCommentThread()) {
			return Promise.resolve();
		}

		thread.collapsibleState = languages.CommentThreadCollapsibleState.Collapsed;
	}

	private registerView() {
		const commentsPanelAlreadyConstructed = !!this._viewDescriptorService.getViewDescriptorById(COMMENTS_VIEW_ID);
		if (!commentsPanelAlreadyConstructed) {
			const VIEW_CONTAINER: ViewContainer = Registry.as<IViewContainersRegistry>(ViewExtensions.ViewContainersRegistry).registerViewContainer({
				id: COMMENTS_VIEW_ID,
				title: COMMENTS_VIEW_TITLE,
				ctorDescriptor: new SyncDescriptor(ViewPaneContainer, [COMMENTS_VIEW_ID, { mergeViewWithContainerWhenSingleView: true }]),
				storageId: COMMENTS_VIEW_STORAGE_ID,
				hideIfEmpty: true,
				icon: commentsViewIcon,
				order: 10,
			}, ViewContainerLocation.Panel);

			Registry.as<IViewsRegistry>(ViewExtensions.ViewsRegistry).registerViews([{
				id: COMMENTS_VIEW_ID,
				name: COMMENTS_VIEW_TITLE,
				canToggleVisibility: false,
				ctorDescriptor: new SyncDescriptor(CommentsPanel),
				canMoveView: true,
				containerIcon: commentsViewIcon,
				focusCommand: {
					id: 'workbench.action.focusCommentsPanel'
				}
			}], VIEW_CONTAINER);
		}
		this.registerViewListeners(commentsPanelAlreadyConstructed);
	}

	private setComments() {
		[...this._commentControllers.keys()].forEach(handle => {
			const threads = this._commentControllers.get(handle)!.getAllComments();

			if (threads.length) {
				const providerId = this.getHandler(handle);
				this._commentService.setWorkspaceComments(providerId, threads);
			}
		});
	}

	private registerViewOpenedListener() {
		if (!this._openViewListener.value) {
			this._openViewListener.value = this._viewsService.onDidChangeViewVisibility(e => {
				if (e.id === COMMENTS_VIEW_ID && e.visible) {
					this.setComments();
					if (this._openViewListener) {
						this._openViewListener.dispose();
					}
				}
			});
		}
	}

	/**
	 * If the comments view has never been opened, the constructor for it has not yet run so it has
	 * no listeners for comment threads being set or updated. Listen for the view opening for the
	 * first time and send it comments then.
	 */
	private registerViewListeners(commentsPanelAlreadyConstructed: boolean) {
		if (!commentsPanelAlreadyConstructed) {
			this.registerViewOpenedListener();
		}

		if (!this._onChangeContainerListener.value) {
			this._onChangeContainerListener.value = this._viewDescriptorService.onDidChangeContainer(e => {
				if (e.views.find(view => view.id === COMMENTS_VIEW_ID)) {
					this.setComments();
					this.registerViewOpenedListener();
				}
			});
		}

		if (!this._onChangeContainerLocationListener.value) {
			this._onChangeContainerLocationListener.value = this._viewDescriptorService.onDidChangeContainerLocation(e => {
				const commentsContainer = this._viewDescriptorService.getViewContainerByViewId(COMMENTS_VIEW_ID);
				if (e.viewContainer.id === commentsContainer?.id) {
					this.setComments();
					this.registerViewOpenedListener();
				}
			});
		}
	}

	private getHandler(handle: number) {
		if (!this._handlers.has(handle)) {
			throw new Error('Unknown handler');
		}
		return this._handlers.get(handle)!;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadConfiguration.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadConfiguration.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../base/common/uri.js';
import { IDisposable } from '../../../base/common/lifecycle.js';
import { Registry } from '../../../platform/registry/common/platform.js';
import { IConfigurationRegistry, Extensions as ConfigurationExtensions, ConfigurationScope, getScopes } from '../../../platform/configuration/common/configurationRegistry.js';
import { IWorkspaceContextService, WorkbenchState } from '../../../platform/workspace/common/workspace.js';
import { MainThreadConfigurationShape, MainContext, ExtHostContext, IConfigurationInitData } from '../common/extHost.protocol.js';
import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { ConfigurationTarget, IConfigurationService, IConfigurationOverrides } from '../../../platform/configuration/common/configuration.js';
import { IEnvironmentService } from '../../../platform/environment/common/environment.js';

@extHostNamedCustomer(MainContext.MainThreadConfiguration)
export class MainThreadConfiguration implements MainThreadConfigurationShape {

	private readonly _configurationListener: IDisposable;

	constructor(
		extHostContext: IExtHostContext,
		@IWorkspaceContextService private readonly _workspaceContextService: IWorkspaceContextService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IEnvironmentService private readonly _environmentService: IEnvironmentService,
	) {
		const proxy = extHostContext.getProxy(ExtHostContext.ExtHostConfiguration);

		proxy.$initializeConfiguration(this._getConfigurationData());
		this._configurationListener = configurationService.onDidChangeConfiguration(e => {
			proxy.$acceptConfigurationChanged(this._getConfigurationData(), e.change);
		});
	}

	private _getConfigurationData(): IConfigurationInitData {
		const configurationData: IConfigurationInitData = { ...(this.configurationService.getConfigurationData()!), configurationScopes: [] };
		// Send configurations scopes only in development mode.
		if (!this._environmentService.isBuilt || this._environmentService.isExtensionDevelopment) {
			configurationData.configurationScopes = getScopes();
		}
		return configurationData;
	}

	public dispose(): void {
		this._configurationListener.dispose();
	}

	$updateConfigurationOption(target: ConfigurationTarget | null, key: string, value: unknown, overrides: IConfigurationOverrides | undefined, scopeToLanguage: boolean | undefined): Promise<void> {
		overrides = { resource: overrides?.resource ? URI.revive(overrides.resource) : undefined, overrideIdentifier: overrides?.overrideIdentifier };
		return this.writeConfiguration(target, key, value, overrides, scopeToLanguage);
	}

	$removeConfigurationOption(target: ConfigurationTarget | null, key: string, overrides: IConfigurationOverrides | undefined, scopeToLanguage: boolean | undefined): Promise<void> {
		overrides = { resource: overrides?.resource ? URI.revive(overrides.resource) : undefined, overrideIdentifier: overrides?.overrideIdentifier };
		return this.writeConfiguration(target, key, undefined, overrides, scopeToLanguage);
	}

	private writeConfiguration(target: ConfigurationTarget | null, key: string, value: unknown, overrides: IConfigurationOverrides, scopeToLanguage: boolean | undefined): Promise<void> {
		target = target !== null && target !== undefined ? target : this.deriveConfigurationTarget(key, overrides);
		const configurationValue = this.configurationService.inspect(key, overrides);
		switch (target) {
			case ConfigurationTarget.MEMORY:
				return this._updateValue(key, value, target, configurationValue?.memory?.override, overrides, scopeToLanguage);
			case ConfigurationTarget.WORKSPACE_FOLDER:
				return this._updateValue(key, value, target, configurationValue?.workspaceFolder?.override, overrides, scopeToLanguage);
			case ConfigurationTarget.WORKSPACE:
				return this._updateValue(key, value, target, configurationValue?.workspace?.override, overrides, scopeToLanguage);
			case ConfigurationTarget.USER_REMOTE:
				return this._updateValue(key, value, target, configurationValue?.userRemote?.override, overrides, scopeToLanguage);
			default:
				return this._updateValue(key, value, target, configurationValue?.userLocal?.override, overrides, scopeToLanguage);
		}
	}

	private _updateValue(key: string, value: unknown, configurationTarget: ConfigurationTarget, overriddenValue: unknown | undefined, overrides: IConfigurationOverrides, scopeToLanguage: boolean | undefined): Promise<void> {
		overrides = scopeToLanguage === true ? overrides
			: scopeToLanguage === false ? { resource: overrides.resource }
				: overrides.overrideIdentifier && overriddenValue !== undefined ? overrides
					: { resource: overrides.resource };
		return this.configurationService.updateValue(key, value, overrides, configurationTarget, { donotNotifyError: true });
	}

	private deriveConfigurationTarget(key: string, overrides: IConfigurationOverrides): ConfigurationTarget {
		if (overrides.resource && this._workspaceContextService.getWorkbenchState() === WorkbenchState.WORKSPACE) {
			const configurationProperties = Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration).getConfigurationProperties();
			if (configurationProperties[key] && (configurationProperties[key].scope === ConfigurationScope.RESOURCE || configurationProperties[key].scope === ConfigurationScope.LANGUAGE_OVERRIDABLE)) {
				return ConfigurationTarget.WORKSPACE_FOLDER;
			}
		}
		return ConfigurationTarget.WORKSPACE;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadConsole.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadConsole.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { MainContext, MainThreadConsoleShape } from '../common/extHost.protocol.js';
import { IEnvironmentService } from '../../../platform/environment/common/environment.js';
import { IRemoteConsoleLog, log } from '../../../base/common/console.js';
import { logRemoteEntry, logRemoteEntryIfError } from '../../services/extensions/common/remoteConsoleUtil.js';
import { parseExtensionDevOptions } from '../../services/extensions/common/extensionDevOptions.js';
import { ILogService } from '../../../platform/log/common/log.js';

@extHostNamedCustomer(MainContext.MainThreadConsole)
export class MainThreadConsole implements MainThreadConsoleShape {

	private readonly _isExtensionDevTestFromCli: boolean;

	constructor(
		_extHostContext: IExtHostContext,
		@IEnvironmentService private readonly _environmentService: IEnvironmentService,
		@ILogService private readonly _logService: ILogService,
	) {
		const devOpts = parseExtensionDevOptions(this._environmentService);
		this._isExtensionDevTestFromCli = devOpts.isExtensionDevTestFromCli;
	}

	dispose(): void {
		//
	}

	$logExtensionHostMessage(entry: IRemoteConsoleLog): void {
		if (this._isExtensionDevTestFromCli) {
			// If running tests from cli, log to the log service everything
			logRemoteEntry(this._logService, entry);
		} else {
			// Log to the log service only errors and log everything to local console
			logRemoteEntryIfError(this._logService, entry, 'Extension Host');
			log(entry, 'Extension Host');
		}
	}
}
```

--------------------------------------------------------------------------------

````
