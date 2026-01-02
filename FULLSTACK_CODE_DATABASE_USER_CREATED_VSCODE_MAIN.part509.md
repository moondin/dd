---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 509
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 509 of 552)

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

---[FILE: src/vs/workbench/services/extensions/common/extensionsRegistry.ts]---
Location: vscode-main/src/vs/workbench/services/extensions/common/extensionsRegistry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { IJSONSchema } from '../../../../base/common/jsonSchema.js';
import Severity from '../../../../base/common/severity.js';
import { EXTENSION_IDENTIFIER_PATTERN } from '../../../../platform/extensionManagement/common/extensionManagement.js';
import { Extensions, IJSONContributionRegistry } from '../../../../platform/jsonschemas/common/jsonContributionRegistry.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IMessage } from './extensions.js';
import { IExtensionDescription, EXTENSION_CATEGORIES, ExtensionIdentifierSet } from '../../../../platform/extensions/common/extensions.js';
import { ExtensionKind } from '../../../../platform/environment/common/environment.js';
import { productSchemaId } from '../../../../platform/product/common/productService.js';
import { ImplicitActivationEvents, IActivationEventsGenerator } from '../../../../platform/extensionManagement/common/implicitActivationEvents.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { allApiProposals } from '../../../../platform/extensions/common/extensionsApiProposals.js';

const schemaRegistry = Registry.as<IJSONContributionRegistry>(Extensions.JSONContribution);

export class ExtensionMessageCollector {

	private readonly _messageHandler: (msg: IMessage) => void;
	private readonly _extension: IExtensionDescription;
	private readonly _extensionPointId: string;

	constructor(
		messageHandler: (msg: IMessage) => void,
		extension: IExtensionDescription,
		extensionPointId: string
	) {
		this._messageHandler = messageHandler;
		this._extension = extension;
		this._extensionPointId = extensionPointId;
	}

	private _msg(type: Severity, message: string): void {
		this._messageHandler({
			type: type,
			message: message,
			extensionId: this._extension.identifier,
			extensionPointId: this._extensionPointId
		});
	}

	public error(message: string): void {
		this._msg(Severity.Error, message);
	}

	public warn(message: string): void {
		this._msg(Severity.Warning, message);
	}

	public info(message: string): void {
		this._msg(Severity.Info, message);
	}
}

export interface IExtensionPointUser<T> {
	description: IExtensionDescription;
	value: T;
	collector: ExtensionMessageCollector;
}

export type IExtensionPointHandler<T> = (extensions: readonly IExtensionPointUser<T>[], delta: ExtensionPointUserDelta<T>) => void;

export interface IExtensionPoint<T> {
	readonly name: string;
	setHandler(handler: IExtensionPointHandler<T>): IDisposable;
	readonly defaultExtensionKind: ExtensionKind[] | undefined;
	readonly canHandleResolver?: boolean;
}

export class ExtensionPointUserDelta<T> {

	private static _toSet<T>(arr: readonly IExtensionPointUser<T>[]): ExtensionIdentifierSet {
		const result = new ExtensionIdentifierSet();
		for (let i = 0, len = arr.length; i < len; i++) {
			result.add(arr[i].description.identifier);
		}
		return result;
	}

	public static compute<T>(previous: readonly IExtensionPointUser<T>[] | null, current: readonly IExtensionPointUser<T>[]): ExtensionPointUserDelta<T> {
		if (!previous || !previous.length) {
			return new ExtensionPointUserDelta<T>(current, []);
		}
		if (!current || !current.length) {
			return new ExtensionPointUserDelta<T>([], previous);
		}

		const previousSet = this._toSet(previous);
		const currentSet = this._toSet(current);

		const added = current.filter(user => !previousSet.has(user.description.identifier));
		const removed = previous.filter(user => !currentSet.has(user.description.identifier));

		return new ExtensionPointUserDelta<T>(added, removed);
	}

	constructor(
		public readonly added: readonly IExtensionPointUser<T>[],
		public readonly removed: readonly IExtensionPointUser<T>[],
	) { }
}

export class ExtensionPoint<T> implements IExtensionPoint<T> {

	public readonly name: string;
	public readonly defaultExtensionKind: ExtensionKind[] | undefined;
	public readonly canHandleResolver?: boolean;

	private _handler: IExtensionPointHandler<T> | null;
	private _users: IExtensionPointUser<T>[] | null;
	private _delta: ExtensionPointUserDelta<T> | null;

	constructor(name: string, defaultExtensionKind: ExtensionKind[] | undefined, canHandleResolver?: boolean) {
		this.name = name;
		this.defaultExtensionKind = defaultExtensionKind;
		this.canHandleResolver = canHandleResolver;
		this._handler = null;
		this._users = null;
		this._delta = null;
	}

	setHandler(handler: IExtensionPointHandler<T>): IDisposable {
		if (this._handler !== null) {
			throw new Error('Handler already set!');
		}
		this._handler = handler;
		this._handle();

		return {
			dispose: () => {
				this._handler = null;
			}
		};
	}

	acceptUsers(users: IExtensionPointUser<T>[]): void {
		this._delta = ExtensionPointUserDelta.compute(this._users, users);
		this._users = users;
		this._handle();
	}

	private _handle(): void {
		if (this._handler === null || this._users === null || this._delta === null) {
			return;
		}

		try {
			this._handler(this._users, this._delta);
		} catch (err) {
			onUnexpectedError(err);
		}
	}
}

const extensionKindSchema: IJSONSchema = {
	type: 'string',
	enum: [
		'ui',
		'workspace'
	],
	enumDescriptions: [
		nls.localize('ui', "UI extension kind. In a remote window, such extensions are enabled only when available on the local machine."),
		nls.localize('workspace', "Workspace extension kind. In a remote window, such extensions are enabled only when available on the remote."),
	],
};

const schemaId = 'vscode://schemas/vscode-extensions';
export const schema: IJSONSchema = {
	properties: {
		engines: {
			type: 'object',
			description: nls.localize('vscode.extension.engines', "Engine compatibility."),
			properties: {
				'vscode': {
					type: 'string',
					description: nls.localize('vscode.extension.engines.vscode', 'For VS Code extensions, specifies the VS Code version that the extension is compatible with. Cannot be *. For example: ^0.10.5 indicates compatibility with a minimum VS Code version of 0.10.5.'),
					default: '^1.22.0',
				}
			}
		},
		publisher: {
			description: nls.localize('vscode.extension.publisher', 'The publisher of the VS Code extension.'),
			type: 'string'
		},
		displayName: {
			description: nls.localize('vscode.extension.displayName', 'The display name for the extension used in the VS Code gallery.'),
			type: 'string'
		},
		categories: {
			description: nls.localize('vscode.extension.categories', 'The categories used by the VS Code gallery to categorize the extension.'),
			type: 'array',
			uniqueItems: true,
			items: {
				oneOf: [{
					type: 'string',
					enum: EXTENSION_CATEGORIES,
				},
				{
					type: 'string',
					const: 'Languages',
					deprecationMessage: nls.localize('vscode.extension.category.languages.deprecated', 'Use \'Programming  Languages\' instead'),
				}]
			}
		},
		galleryBanner: {
			type: 'object',
			description: nls.localize('vscode.extension.galleryBanner', 'Banner used in the VS Code marketplace.'),
			properties: {
				color: {
					description: nls.localize('vscode.extension.galleryBanner.color', 'The banner color on the VS Code marketplace page header.'),
					type: 'string'
				},
				theme: {
					description: nls.localize('vscode.extension.galleryBanner.theme', 'The color theme for the font used in the banner.'),
					type: 'string',
					enum: ['dark', 'light']
				}
			}
		},
		contributes: {
			description: nls.localize('vscode.extension.contributes', 'All contributions of the VS Code extension represented by this package.'),
			type: 'object',
			// eslint-disable-next-line local/code-no-any-casts
			properties: {
				// extensions will fill in
			} as any as { [key: string]: any },
			default: {}
		},
		preview: {
			type: 'boolean',
			description: nls.localize('vscode.extension.preview', 'Sets the extension to be flagged as a Preview in the Marketplace.'),
		},
		enableProposedApi: {
			type: 'boolean',
			deprecationMessage: nls.localize('vscode.extension.enableProposedApi.deprecated', 'Use `enabledApiProposals` instead.'),
		},
		enabledApiProposals: {
			markdownDescription: nls.localize('vscode.extension.enabledApiProposals', 'Enable API proposals to try them out. Only valid **during development**. Extensions **cannot be published** with this property. For more details visit: https://code.visualstudio.com/api/advanced-topics/using-proposed-api'),
			type: 'array',
			uniqueItems: true,
			items: {
				type: 'string',
				enum: Object.keys(allApiProposals).map(proposalName => proposalName),
				markdownEnumDescriptions: Object.values(allApiProposals).map(value => value.proposal)
			}
		},
		api: {
			markdownDescription: nls.localize('vscode.extension.api', 'Describe the API provided by this extension. For more details visit: https://code.visualstudio.com/api/advanced-topics/remote-extensions#handling-dependencies-with-remote-extensions'),
			type: 'string',
			enum: ['none'],
			enumDescriptions: [
				nls.localize('vscode.extension.api.none', "Give up entirely the ability to export any APIs. This allows other extensions that depend on this extension to run in a separate extension host process or in a remote machine.")
			]
		},
		activationEvents: {
			description: nls.localize('vscode.extension.activationEvents', 'Activation events for the VS Code extension.'),
			type: 'array',
			items: {
				type: 'string',
				defaultSnippets: [
					{
						label: 'onWebviewPanel',
						description: nls.localize('vscode.extension.activationEvents.onWebviewPanel', 'An activation event emmited when a webview is loaded of a certain viewType'),
						body: 'onWebviewPanel:viewType'
					},
					{
						label: 'onLanguage',
						description: nls.localize('vscode.extension.activationEvents.onLanguage', 'An activation event emitted whenever a file that resolves to the specified language gets opened.'),
						body: 'onLanguage:${1:languageId}'
					},
					{
						label: 'onCommand',
						description: nls.localize('vscode.extension.activationEvents.onCommand', 'An activation event emitted whenever the specified command gets invoked.'),
						body: 'onCommand:${2:commandId}'
					},
					{
						label: 'onDebug',
						description: nls.localize('vscode.extension.activationEvents.onDebug', 'An activation event emitted whenever a user is about to start debugging or about to setup debug configurations.'),
						body: 'onDebug'
					},
					{
						label: 'onDebugInitialConfigurations',
						description: nls.localize('vscode.extension.activationEvents.onDebugInitialConfigurations', 'An activation event emitted whenever a "launch.json" needs to be created (and all provideDebugConfigurations methods need to be called).'),
						body: 'onDebugInitialConfigurations'
					},
					{
						label: 'onDebugDynamicConfigurations',
						description: nls.localize('vscode.extension.activationEvents.onDebugDynamicConfigurations', 'An activation event emitted whenever a list of all debug configurations needs to be created (and all provideDebugConfigurations methods for the "dynamic" scope need to be called).'),
						body: 'onDebugDynamicConfigurations'
					},
					{
						label: 'onDebugResolve',
						description: nls.localize('vscode.extension.activationEvents.onDebugResolve', 'An activation event emitted whenever a debug session with the specific type is about to be launched (and a corresponding resolveDebugConfiguration method needs to be called).'),
						body: 'onDebugResolve:${6:type}'
					},
					{
						label: 'onDebugAdapterProtocolTracker',
						description: nls.localize('vscode.extension.activationEvents.onDebugAdapterProtocolTracker', 'An activation event emitted whenever a debug session with the specific type is about to be launched and a debug protocol tracker might be needed.'),
						body: 'onDebugAdapterProtocolTracker:${6:type}'
					},
					{
						label: 'workspaceContains',
						description: nls.localize('vscode.extension.activationEvents.workspaceContains', 'An activation event emitted whenever a folder is opened that contains at least a file matching the specified glob pattern.'),
						body: 'workspaceContains:${4:filePattern}'
					},
					{
						label: 'onStartupFinished',
						description: nls.localize('vscode.extension.activationEvents.onStartupFinished', 'An activation event emitted after the start-up finished (after all `*` activated extensions have finished activating).'),
						body: 'onStartupFinished'
					},
					{
						label: 'onTaskType',
						description: nls.localize('vscode.extension.activationEvents.onTaskType', 'An activation event emitted whenever tasks of a certain type need to be listed or resolved.'),
						body: 'onTaskType:${1:taskType}'
					},
					{
						label: 'onFileSystem',
						description: nls.localize('vscode.extension.activationEvents.onFileSystem', 'An activation event emitted whenever a file or folder is accessed with the given scheme.'),
						body: 'onFileSystem:${1:scheme}'
					},
					{
						label: 'onEditSession',
						description: nls.localize('vscode.extension.activationEvents.onEditSession', 'An activation event emitted whenever an edit session is accessed with the given scheme.'),
						body: 'onEditSession:${1:scheme}'
					},
					{
						label: 'onSearch',
						description: nls.localize('vscode.extension.activationEvents.onSearch', 'An activation event emitted whenever a search is started in the folder with the given scheme.'),
						body: 'onSearch:${7:scheme}'
					},
					{
						label: 'onView',
						body: 'onView:${5:viewId}',
						description: nls.localize('vscode.extension.activationEvents.onView', 'An activation event emitted whenever the specified view is expanded.'),
					},
					{
						label: 'onUri',
						body: 'onUri',
						description: nls.localize('vscode.extension.activationEvents.onUri', 'An activation event emitted whenever a system-wide Uri directed towards this extension is open.'),
					},
					{
						label: 'onOpenExternalUri',
						body: 'onOpenExternalUri',
						description: nls.localize('vscode.extension.activationEvents.onOpenExternalUri', 'An activation event emitted whenever a external uri (such as an http or https link) is being opened.'),
					},
					{
						label: 'onCustomEditor',
						body: 'onCustomEditor:${9:viewType}',
						description: nls.localize('vscode.extension.activationEvents.onCustomEditor', 'An activation event emitted whenever the specified custom editor becomes visible.'),
					},
					{
						label: 'onNotebook',
						body: 'onNotebook:${1:type}',
						description: nls.localize('vscode.extension.activationEvents.onNotebook', 'An activation event emitted whenever the specified notebook document is opened.'),
					},
					{
						label: 'onAuthenticationRequest',
						body: 'onAuthenticationRequest:${11:authenticationProviderId}',
						description: nls.localize('vscode.extension.activationEvents.onAuthenticationRequest', 'An activation event emitted whenever sessions are requested from the specified authentication provider.')
					},
					{
						label: 'onRenderer',
						description: nls.localize('vscode.extension.activationEvents.onRenderer', 'An activation event emitted whenever a notebook output renderer is used.'),
						body: 'onRenderer:${11:rendererId}'
					},
					{
						label: 'onTerminalProfile',
						body: 'onTerminalProfile:${1:terminalId}',
						description: nls.localize('vscode.extension.activationEvents.onTerminalProfile', 'An activation event emitted when a specific terminal profile is launched.'),
					},
					{
						label: 'onTerminalQuickFixRequest',
						body: 'onTerminalQuickFixRequest:${1:quickFixId}',
						description: nls.localize('vscode.extension.activationEvents.onTerminalQuickFixRequest', 'An activation event emitted when a command matches the selector associated with this ID'),
					},
					{
						label: 'onWalkthrough',
						body: 'onWalkthrough:${1:walkthroughID}',
						description: nls.localize('vscode.extension.activationEvents.onWalkthrough', 'An activation event emitted when a specified walkthrough is opened.'),
					},
					{
						label: 'onIssueReporterOpened',
						body: 'onIssueReporterOpened',
						description: nls.localize('vscode.extension.activationEvents.onIssueReporterOpened', 'An activation event emitted when the issue reporter is opened.'),
					},
					{
						label: 'onChatParticipant',
						body: 'onChatParticipant:${1:participantId}',
						description: nls.localize('vscode.extension.activationEvents.onChatParticipant', 'An activation event emitted when the specified chat participant is invoked.'),
					},
					{
						label: 'onLanguageModelChatProvider',
						body: 'onLanguageModelChatProvider:${1:vendor}',
						description: nls.localize('vscode.extension.activationEvents.onLanguageModelChatProvider', 'An activation event emitted when a chat model provider for the given vendor is requested.'),
					},
					{
						label: 'onLanguageModelTool',
						body: 'onLanguageModelTool:${1:toolId}',
						description: nls.localize('vscode.extension.activationEvents.onLanguageModelTool', 'An activation event emitted when the specified language model tool is invoked.'),
					},
					{
						label: 'onTerminal',
						body: 'onTerminal:{1:shellType}',
						description: nls.localize('vscode.extension.activationEvents.onTerminal', 'An activation event emitted when a terminal of the given shell type is opened.'),
					},
					{
						label: 'onTerminalShellIntegration',
						body: 'onTerminalShellIntegration:${1:shellType}',
						description: nls.localize('vscode.extension.activationEvents.onTerminalShellIntegration', 'An activation event emitted when terminal shell integration is activated for the given shell type.'),
					},
					{
						label: 'onMcpCollection',
						description: nls.localize('vscode.extension.activationEvents.onMcpCollection', 'An activation event emitted whenver a tool from the MCP server is requested.'),
						body: 'onMcpCollection:${2:collectionId}',
					},
					{
						label: '*',
						description: nls.localize('vscode.extension.activationEvents.star', 'An activation event emitted on VS Code startup. To ensure a great end user experience, please use this activation event in your extension only when no other activation events combination works in your use-case.'),
						body: '*'
					}
				],
			}
		},
		badges: {
			type: 'array',
			description: nls.localize('vscode.extension.badges', 'Array of badges to display in the sidebar of the Marketplace\'s extension page.'),
			items: {
				type: 'object',
				required: ['url', 'href', 'description'],
				properties: {
					url: {
						type: 'string',
						description: nls.localize('vscode.extension.badges.url', 'Badge image URL.')
					},
					href: {
						type: 'string',
						description: nls.localize('vscode.extension.badges.href', 'Badge link.')
					},
					description: {
						type: 'string',
						description: nls.localize('vscode.extension.badges.description', 'Badge description.')
					}
				}
			}
		},
		markdown: {
			type: 'string',
			description: nls.localize('vscode.extension.markdown', "Controls the Markdown rendering engine used in the Marketplace. Either github (default) or standard."),
			enum: ['github', 'standard'],
			default: 'github'
		},
		qna: {
			default: 'marketplace',
			description: nls.localize('vscode.extension.qna', "Controls the Q&A link in the Marketplace. Set to marketplace to enable the default Marketplace Q & A site. Set to a string to provide the URL of a custom Q & A site. Set to false to disable Q & A altogether."),
			anyOf: [
				{
					type: ['string', 'boolean'],
					enum: ['marketplace', false]
				},
				{
					type: 'string'
				}
			]
		},
		extensionDependencies: {
			description: nls.localize('vscode.extension.extensionDependencies', 'Dependencies to other extensions. The identifier of an extension is always ${publisher}.${name}. For example: vscode.csharp.'),
			type: 'array',
			uniqueItems: true,
			items: {
				type: 'string',
				pattern: EXTENSION_IDENTIFIER_PATTERN
			}
		},
		extensionPack: {
			description: nls.localize('vscode.extension.contributes.extensionPack', "A set of extensions that can be installed together. The identifier of an extension is always ${publisher}.${name}. For example: vscode.csharp."),
			type: 'array',
			uniqueItems: true,
			items: {
				type: 'string',
				pattern: EXTENSION_IDENTIFIER_PATTERN
			}
		},
		extensionKind: {
			description: nls.localize('extensionKind', "Define the kind of an extension. `ui` extensions are installed and run on the local machine while `workspace` extensions run on the remote."),
			type: 'array',
			items: extensionKindSchema,
			default: ['workspace'],
			defaultSnippets: [
				{
					body: ['ui'],
					description: nls.localize('extensionKind.ui', "Define an extension which can run only on the local machine when connected to remote window.")
				},
				{
					body: ['workspace'],
					description: nls.localize('extensionKind.workspace', "Define an extension which can run only on the remote machine when connected remote window.")
				},
				{
					body: ['ui', 'workspace'],
					description: nls.localize('extensionKind.ui-workspace', "Define an extension which can run on either side, with a preference towards running on the local machine.")
				},
				{
					body: ['workspace', 'ui'],
					description: nls.localize('extensionKind.workspace-ui', "Define an extension which can run on either side, with a preference towards running on the remote machine.")
				},
				{
					body: [],
					description: nls.localize('extensionKind.empty', "Define an extension which cannot run in a remote context, neither on the local, nor on the remote machine.")
				}
			]
		},
		capabilities: {
			description: nls.localize('vscode.extension.capabilities', "Declare the set of supported capabilities by the extension."),
			type: 'object',
			properties: {
				virtualWorkspaces: {
					description: nls.localize('vscode.extension.capabilities.virtualWorkspaces', "Declares whether the extension should be enabled in virtual workspaces. A virtual workspace is a workspace which is not backed by any on-disk resources. When false, this extension will be automatically disabled in virtual workspaces. Default is true."),
					type: ['boolean', 'object'],
					defaultSnippets: [
						{ label: 'limited', body: { supported: '${1:limited}', description: '${2}' } },
						{ label: 'false', body: { supported: false, description: '${2}' } },
					],
					default: true.valueOf,
					properties: {
						supported: {
							markdownDescription: nls.localize('vscode.extension.capabilities.virtualWorkspaces.supported', "Declares the level of support for virtual workspaces by the extension."),
							type: ['string', 'boolean'],
							enum: ['limited', true, false],
							enumDescriptions: [
								nls.localize('vscode.extension.capabilities.virtualWorkspaces.supported.limited', "The extension will be enabled in virtual workspaces with some functionality disabled."),
								nls.localize('vscode.extension.capabilities.virtualWorkspaces.supported.true', "The extension will be enabled in virtual workspaces with all functionality enabled."),
								nls.localize('vscode.extension.capabilities.virtualWorkspaces.supported.false', "The extension will not be enabled in virtual workspaces."),
							]
						},
						description: {
							type: 'string',
							markdownDescription: nls.localize('vscode.extension.capabilities.virtualWorkspaces.description', "A description of how virtual workspaces affects the extensions behavior and why it is needed. This only applies when `supported` is not `true`."),
						}
					}
				},
				untrustedWorkspaces: {
					description: nls.localize('vscode.extension.capabilities.untrustedWorkspaces', 'Declares how the extension should be handled in untrusted workspaces.'),
					type: 'object',
					required: ['supported'],
					defaultSnippets: [
						{ body: { supported: '${1:limited}', description: '${2}' } },
					],
					properties: {
						supported: {
							markdownDescription: nls.localize('vscode.extension.capabilities.untrustedWorkspaces.supported', "Declares the level of support for untrusted workspaces by the extension."),
							type: ['string', 'boolean'],
							enum: ['limited', true, false],
							enumDescriptions: [
								nls.localize('vscode.extension.capabilities.untrustedWorkspaces.supported.limited', "The extension will be enabled in untrusted workspaces with some functionality disabled."),
								nls.localize('vscode.extension.capabilities.untrustedWorkspaces.supported.true', "The extension will be enabled in untrusted workspaces with all functionality enabled."),
								nls.localize('vscode.extension.capabilities.untrustedWorkspaces.supported.false', "The extension will not be enabled in untrusted workspaces."),
							]
						},
						restrictedConfigurations: {
							description: nls.localize('vscode.extension.capabilities.untrustedWorkspaces.restrictedConfigurations', "A list of configuration keys contributed by the extension that should not use workspace values in untrusted workspaces."),
							type: 'array',
							items: {
								type: 'string'
							}
						},
						description: {
							type: 'string',
							markdownDescription: nls.localize('vscode.extension.capabilities.untrustedWorkspaces.description', "A description of how workspace trust affects the extensions behavior and why it is needed. This only applies when `supported` is not `true`."),
						}
					}
				}
			}
		},
		sponsor: {
			description: nls.localize('vscode.extension.contributes.sponsor', "Specify the location from where users can sponsor your extension."),
			type: 'object',
			defaultSnippets: [
				{ body: { url: '${1:https:}' } },
			],
			properties: {
				'url': {
					description: nls.localize('vscode.extension.contributes.sponsor.url', "URL from where users can sponsor your extension. It must be a valid URL with a HTTP or HTTPS protocol. Example value: https://github.com/sponsors/nvaccess"),
					type: 'string',
				}
			}
		},
		scripts: {
			type: 'object',
			properties: {
				'vscode:prepublish': {
					description: nls.localize('vscode.extension.scripts.prepublish', 'Script executed before the package is published as a VS Code extension.'),
					type: 'string'
				},
				'vscode:uninstall': {
					description: nls.localize('vscode.extension.scripts.uninstall', 'Uninstall hook for VS Code extension. Script that gets executed when the extension is completely uninstalled from VS Code which is when VS Code is restarted (shutdown and start) after the extension is uninstalled. Only Node scripts are supported.'),
					type: 'string'
				}
			}
		},
		icon: {
			type: 'string',
			description: nls.localize('vscode.extension.icon', 'The path to a 128x128 pixel icon.')
		},
		l10n: {
			type: 'string',
			description: nls.localize({
				key: 'vscode.extension.l10n',
				comment: [
					'{Locked="bundle.l10n._locale_.json"}',
					'{Locked="vscode.l10n API"}'
				]
			}, 'The relative path to a folder containing localization (bundle.l10n.*.json) files. Must be specified if you are using the vscode.l10n API.')
		},
		pricing: {
			type: 'string',
			markdownDescription: nls.localize('vscode.extension.pricing', 'The pricing information for the extension. Can be Free (default) or Trial. For more details visit: https://code.visualstudio.com/api/working-with-extensions/publishing-extension#extension-pricing-label'),
			enum: ['Free', 'Trial'],
			default: 'Free'
		}
	}
};

export type removeArray<T> = T extends Array<infer X> ? X : T;

export interface IExtensionPointDescriptor<T> {
	extensionPoint: string;
	deps?: IExtensionPoint<any>[];
	jsonSchema: IJSONSchema;
	defaultExtensionKind?: ExtensionKind[];
	canHandleResolver?: boolean;
	/**
	 * A function which runs before the extension point has been validated and which
	 * should collect automatic activation events from the contribution.
	 */
	activationEventsGenerator?: IActivationEventsGenerator<removeArray<T>>;
}

export class ExtensionsRegistryImpl {

	private readonly _extensionPoints = new Map<string, ExtensionPoint<any>>();

	public registerExtensionPoint<T>(desc: IExtensionPointDescriptor<T>): IExtensionPoint<T> {
		if (this._extensionPoints.has(desc.extensionPoint)) {
			throw new Error('Duplicate extension point: ' + desc.extensionPoint);
		}
		const result = new ExtensionPoint<T>(desc.extensionPoint, desc.defaultExtensionKind, desc.canHandleResolver);
		this._extensionPoints.set(desc.extensionPoint, result);
		if (desc.activationEventsGenerator) {
			ImplicitActivationEvents.register(desc.extensionPoint, desc.activationEventsGenerator);
		}

		schema.properties!['contributes'].properties![desc.extensionPoint] = desc.jsonSchema;
		schemaRegistry.registerSchema(schemaId, schema);

		return result;
	}

	public getExtensionPoints(): ExtensionPoint<any>[] {
		return Array.from(this._extensionPoints.values());
	}
}

const PRExtensions = {
	ExtensionsRegistry: 'ExtensionsRegistry'
};
Registry.add(PRExtensions.ExtensionsRegistry, new ExtensionsRegistryImpl());
export const ExtensionsRegistry: ExtensionsRegistryImpl = Registry.as(PRExtensions.ExtensionsRegistry);

schemaRegistry.registerSchema(schemaId, schema);


schemaRegistry.registerSchema(productSchemaId, {
	properties: {
		extensionEnabledApiProposals: {
			description: nls.localize('product.extensionEnabledApiProposals', "API proposals that the respective extensions can freely use."),
			type: 'object',
			properties: {},
			additionalProperties: {
				anyOf: [{
					type: 'array',
					uniqueItems: true,
					items: {
						type: 'string',
						enum: Object.keys(allApiProposals),
						markdownEnumDescriptions: Object.values(allApiProposals).map(value => value.proposal)
					}
				}]
			}
		}
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensions/common/extensionStorageMigration.ts]---
Location: vscode-main/src/vs/workbench/services/extensions/common/extensionStorageMigration.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getErrorMessage } from '../../../../base/common/errors.js';
import { URI } from '../../../../base/common/uri.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { IExtensionStorageService } from '../../../../platform/extensionManagement/common/extensionStorage.js';
import { FileSystemProviderError, FileSystemProviderErrorCode, IFileService } from '../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IUserDataProfilesService } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';

/**
 * An extension storage has following
 * 	- State: Stored using storage service with extension id as key and state as value.
 *  - Resources: Stored under a location scoped to the extension.
 */
export async function migrateExtensionStorage(fromExtensionId: string, toExtensionId: string, global: boolean, instantionService: IInstantiationService): Promise<void> {
	return instantionService.invokeFunction(async serviceAccessor => {
		const environmentService = serviceAccessor.get(IEnvironmentService);
		const userDataProfilesService = serviceAccessor.get(IUserDataProfilesService);
		const extensionStorageService = serviceAccessor.get(IExtensionStorageService);
		const storageService = serviceAccessor.get(IStorageService);
		const uriIdentityService = serviceAccessor.get(IUriIdentityService);
		const fileService = serviceAccessor.get(IFileService);
		const workspaceContextService = serviceAccessor.get(IWorkspaceContextService);
		const logService = serviceAccessor.get(ILogService);
		const storageMigratedKey = `extensionStorage.migrate.${fromExtensionId}-${toExtensionId}`;
		const migrateLowerCaseStorageKey = fromExtensionId.toLowerCase() === toExtensionId.toLowerCase() ? `extension.storage.migrateFromLowerCaseKey.${fromExtensionId.toLowerCase()}` : undefined;

		if (fromExtensionId === toExtensionId) {
			return;
		}

		const getExtensionStorageLocation = (extensionId: string, global: boolean): URI => {
			if (global) {
				return uriIdentityService.extUri.joinPath(userDataProfilesService.defaultProfile.globalStorageHome, extensionId.toLowerCase() /* Extension id is lower cased for global storage */);
			}
			return uriIdentityService.extUri.joinPath(environmentService.workspaceStorageHome, workspaceContextService.getWorkspace().id, extensionId);
		};

		const storageScope = global ? StorageScope.PROFILE : StorageScope.WORKSPACE;
		if (!storageService.getBoolean(storageMigratedKey, storageScope, false) && !(migrateLowerCaseStorageKey && storageService.getBoolean(migrateLowerCaseStorageKey, storageScope, false))) {
			logService.info(`Migrating ${global ? 'global' : 'workspace'} extension storage from ${fromExtensionId} to ${toExtensionId}...`);
			// Migrate state
			const value = extensionStorageService.getExtensionState(fromExtensionId, global);
			if (value) {
				extensionStorageService.setExtensionState(toExtensionId, value, global);
				extensionStorageService.setExtensionState(fromExtensionId, undefined, global);
			}

			// Migrate stored files
			const fromPath = getExtensionStorageLocation(fromExtensionId, global);
			const toPath = getExtensionStorageLocation(toExtensionId, global);
			if (!uriIdentityService.extUri.isEqual(fromPath, toPath)) {
				try {
					await fileService.move(fromPath, toPath, true);
				} catch (error) {
					if ((<FileSystemProviderError>error).code !== FileSystemProviderErrorCode.FileNotFound) {
						logService.info(`Error while migrating ${global ? 'global' : 'workspace'} file storage from '${fromExtensionId}' to '${toExtensionId}'`, getErrorMessage(error));
					}
				}
			}
			logService.info(`Migrated ${global ? 'global' : 'workspace'} extension storage from ${fromExtensionId} to ${toExtensionId}`);
			storageService.store(storageMigratedKey, true, storageScope, StorageTarget.MACHINE);
		}
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensions/common/extensionsUtil.ts]---
Location: vscode-main/src/vs/workbench/services/extensions/common/extensionsUtil.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ExtensionIdentifierMap, IExtensionDescription } from '../../../../platform/extensions/common/extensions.js';
import { localize } from '../../../../nls.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import * as semver from '../../../../base/common/semver/semver.js';
import { Mutable } from '../../../../base/common/types.js';

// TODO: @sandy081 merge this with deduping in extensionsScannerService.ts
export function dedupExtensions(system: IExtensionDescription[], user: IExtensionDescription[], workspace: IExtensionDescription[], development: IExtensionDescription[], logService: ILogService): IExtensionDescription[] {
	const result = new ExtensionIdentifierMap<IExtensionDescription>();
	system.forEach((systemExtension) => {
		const extension = result.get(systemExtension.identifier);
		if (extension) {
			logService.warn(localize('overwritingExtension', "Overwriting extension {0} with {1}.", extension.extensionLocation.fsPath, systemExtension.extensionLocation.fsPath));
		}
		result.set(systemExtension.identifier, systemExtension);
	});
	user.forEach((userExtension) => {
		const extension = result.get(userExtension.identifier);
		if (extension) {
			if (extension.isBuiltin) {
				if (semver.gte(extension.version, userExtension.version)) {
					logService.warn(`Skipping extension ${userExtension.extensionLocation.path} in favour of the builtin extension ${extension.extensionLocation.path}.`);
					return;
				}
				// Overwriting a builtin extension inherits the `isBuiltin` property and it doesn't show a warning
				(<Mutable<IExtensionDescription>>userExtension).isBuiltin = true;
			} else {
				logService.warn(localize('overwritingExtension', "Overwriting extension {0} with {1}.", extension.extensionLocation.fsPath, userExtension.extensionLocation.fsPath));
			}
		} else if (userExtension.isBuiltin) {
			logService.warn(`Skipping obsolete builtin extension ${userExtension.extensionLocation.path}`);
			return;
		}
		result.set(userExtension.identifier, userExtension);
	});
	workspace.forEach(workspaceExtension => {
		const extension = result.get(workspaceExtension.identifier);
		if (extension) {
			logService.warn(localize('overwritingWithWorkspaceExtension', "Overwriting {0} with Workspace Extension {1}.", extension.extensionLocation.fsPath, workspaceExtension.extensionLocation.fsPath));
		}
		result.set(workspaceExtension.identifier, workspaceExtension);
	});
	development.forEach(developedExtension => {
		logService.info(localize('extensionUnderDevelopment', "Loading development extension at {0}", developedExtension.extensionLocation.fsPath));
		const extension = result.get(developedExtension.identifier);
		if (extension) {
			if (extension.isBuiltin) {
				// Overwriting a builtin extension inherits the `isBuiltin` property
				(<Mutable<IExtensionDescription>>developedExtension).isBuiltin = true;
			}
		}
		result.set(developedExtension.identifier, developedExtension);
	});
	return Array.from(result.values());
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensions/common/extHostCustomers.ts]---
Location: vscode-main/src/vs/workbench/services/extensions/common/extHostCustomers.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDisposable } from '../../../../base/common/lifecycle.js';
import { BrandedService, IConstructorSignature } from '../../../../platform/instantiation/common/instantiation.js';
import { ExtensionHostKind } from './extensionHostKind.js';
import { IExtensionHostProxy } from './extensionHostProxy.js';
import { IInternalExtensionService } from './extensions.js';
import { IRPCProtocol, ProxyIdentifier } from './proxyIdentifier.js';

export interface IExtHostContext extends IRPCProtocol {
	readonly remoteAuthority: string | null;
	readonly extensionHostKind: ExtensionHostKind;
}

export interface IInternalExtHostContext extends IExtHostContext {
	readonly internalExtensionService: IInternalExtensionService;
	_setExtensionHostProxy(extensionHostProxy: IExtensionHostProxy): void;
	_setAllMainProxyIdentifiers(mainProxyIdentifiers: ProxyIdentifier<unknown>[]): void;
}

export type IExtHostNamedCustomer<T extends IDisposable> = [ProxyIdentifier<T>, IExtHostCustomerCtor<T>];

export type IExtHostCustomerCtor<T extends IDisposable> = IConstructorSignature<T, [IExtHostContext]>;

export function extHostNamedCustomer<T extends IDisposable>(id: ProxyIdentifier<T>) {
	return function <Services extends BrandedService[]>(ctor: { new(context: IExtHostContext, ...services: Services): T }): void {
		ExtHostCustomersRegistryImpl.INSTANCE.registerNamedCustomer(id, ctor as IExtHostCustomerCtor<T>);
	};
}

export function extHostCustomer<T extends IDisposable, Services extends BrandedService[]>(ctor: { new(context: IExtHostContext, ...services: Services): T }): void {
	ExtHostCustomersRegistryImpl.INSTANCE.registerCustomer(ctor as IExtHostCustomerCtor<T>);
}

export namespace ExtHostCustomersRegistry {

	export function getNamedCustomers(): IExtHostNamedCustomer<IDisposable>[] {
		return ExtHostCustomersRegistryImpl.INSTANCE.getNamedCustomers();
	}

	export function getCustomers(): IExtHostCustomerCtor<IDisposable>[] {
		return ExtHostCustomersRegistryImpl.INSTANCE.getCustomers();
	}
}

class ExtHostCustomersRegistryImpl {

	public static readonly INSTANCE = new ExtHostCustomersRegistryImpl();

	private _namedCustomers: IExtHostNamedCustomer<IDisposable>[];
	private _customers: IExtHostCustomerCtor<IDisposable>[];

	constructor() {
		this._namedCustomers = [];
		this._customers = [];
	}

	public registerNamedCustomer<T extends IDisposable>(id: ProxyIdentifier<T>, ctor: IExtHostCustomerCtor<T>): void {
		const entry: IExtHostNamedCustomer<T> = [id, ctor];
		this._namedCustomers.push(entry);
	}
	public getNamedCustomers(): IExtHostNamedCustomer<IDisposable>[] {
		return this._namedCustomers;
	}

	public registerCustomer<T extends IDisposable>(ctor: IExtHostCustomerCtor<T>): void {
		this._customers.push(ctor);
	}
	public getCustomers(): IExtHostCustomerCtor<IDisposable>[] {
		return this._customers;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensions/common/lazyCreateExtensionHostManager.ts]---
Location: vscode-main/src/vs/workbench/services/extensions/common/lazyCreateExtensionHostManager.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Barrier } from '../../../../base/common/async.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { ExtensionIdentifier, IExtensionDescription } from '../../../../platform/extensions/common/extensions.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { RemoteAuthorityResolverErrorCode } from '../../../../platform/remote/common/remoteAuthorityResolver.js';
import { ExtensionHostKind } from './extensionHostKind.js';
import { ExtensionHostManager, friendlyExtHostName } from './extensionHostManager.js';
import { IExtensionHostManager } from './extensionHostManagers.js';
import { IExtensionDescriptionDelta } from './extensionHostProtocol.js';
import { IResolveAuthorityResult } from './extensionHostProxy.js';
import { ExtensionRunningLocation } from './extensionRunningLocation.js';
import { ActivationKind, ExtensionActivationReason, ExtensionHostStartup, IExtensionHost, IExtensionInspectInfo, IInternalExtensionService } from './extensions.js';
import { ResponsiveState } from './rpcProtocol.js';

/**
 * Waits until `start()` and only if it has extensions proceeds to really start.
 */
export class LazyCreateExtensionHostManager extends Disposable implements IExtensionHostManager {

	public readonly onDidExit: Event<[number, string | null]>;
	private readonly _onDidChangeResponsiveState: Emitter<ResponsiveState> = this._register(new Emitter<ResponsiveState>());
	public readonly onDidChangeResponsiveState: Event<ResponsiveState> = this._onDidChangeResponsiveState.event;

	private readonly _extensionHost: IExtensionHost;
	private _startCalled: Barrier;
	private _actual: ExtensionHostManager | null;

	public get pid(): number | null {
		if (this._actual) {
			return this._actual.pid;
		}
		return null;
	}

	public get kind(): ExtensionHostKind {
		return this._extensionHost.runningLocation.kind;
	}

	public get startup(): ExtensionHostStartup {
		return this._extensionHost.startup;
	}

	public get friendyName(): string {
		return friendlyExtHostName(this.kind, this.pid);
	}

	constructor(
		extensionHost: IExtensionHost,
		private readonly _initialActivationEvents: string[],
		private readonly _internalExtensionService: IInternalExtensionService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@ILogService private readonly _logService: ILogService
	) {
		super();
		this._extensionHost = extensionHost;
		this.onDidExit = extensionHost.onExit;
		this._startCalled = new Barrier();
		this._actual = null;
	}

	override dispose(): void {
		if (!this._actual) {
			this._extensionHost.dispose();
		}
		super.dispose();
	}

	private _createActual(reason: string): ExtensionHostManager {
		this._logService.info(`Creating lazy extension host (${this.friendyName}). Reason: ${reason}`);
		this._actual = this._register(this._instantiationService.createInstance(ExtensionHostManager, this._extensionHost, this._initialActivationEvents, this._internalExtensionService));
		this._register(this._actual.onDidChangeResponsiveState((e) => this._onDidChangeResponsiveState.fire(e)));
		return this._actual;
	}

	private async _getOrCreateActualAndStart(reason: string): Promise<ExtensionHostManager> {
		if (this._actual) {
			// already created/started
			return this._actual;
		}
		const actual = this._createActual(reason);
		await actual.ready();
		return actual;
	}

	public async ready(): Promise<void> {
		await this._startCalled.wait();
		if (this._actual) {
			await this._actual.ready();
		}
	}

	public async disconnect(): Promise<void> {
		await this._actual?.disconnect();
	}

	public representsRunningLocation(runningLocation: ExtensionRunningLocation): boolean {
		return this._extensionHost.runningLocation.equals(runningLocation);
	}

	public async deltaExtensions(extensionsDelta: IExtensionDescriptionDelta): Promise<void> {
		await this._startCalled.wait();
		if (this._actual) {
			return this._actual.deltaExtensions(extensionsDelta);
		}
		if (extensionsDelta.myToAdd.length > 0) {
			const actual = this._createActual(`contains ${extensionsDelta.myToAdd.length} new extension(s) (installed or enabled): ${extensionsDelta.myToAdd.map(extId => extId.value)}`);
			await actual.ready();
			return;
		}
	}

	public containsExtension(extensionId: ExtensionIdentifier): boolean {
		return this._extensionHost.extensions?.containsExtension(extensionId) ?? false;
	}

	public async activate(extension: ExtensionIdentifier, reason: ExtensionActivationReason): Promise<boolean> {
		await this._startCalled.wait();
		if (this._actual) {
			return this._actual.activate(extension, reason);
		}
		return false;
	}

	public async activateByEvent(activationEvent: string, activationKind: ActivationKind): Promise<void> {
		if (activationKind === ActivationKind.Immediate) {
			// this is an immediate request, so we cannot wait for start to be called
			if (this._actual) {
				return this._actual.activateByEvent(activationEvent, activationKind);
			}
			return;
		}
		await this._startCalled.wait();
		if (this._actual) {
			return this._actual.activateByEvent(activationEvent, activationKind);
		}
	}

	public activationEventIsDone(activationEvent: string): boolean {
		if (!this._startCalled.isOpen()) {
			return false;
		}
		if (this._actual) {
			return this._actual.activationEventIsDone(activationEvent);
		}
		return true;
	}

	public async getInspectPort(tryEnableInspector: boolean): Promise<IExtensionInspectInfo | undefined> {
		await this._startCalled.wait();
		return this._actual?.getInspectPort(tryEnableInspector);
	}

	public async resolveAuthority(remoteAuthority: string, resolveAttempt: number): Promise<IResolveAuthorityResult> {
		await this._startCalled.wait();
		if (this._actual) {
			return this._actual.resolveAuthority(remoteAuthority, resolveAttempt);
		}
		return {
			type: 'error',
			error: {
				message: `Cannot resolve authority`,
				code: RemoteAuthorityResolverErrorCode.Unknown,
				detail: undefined
			}
		};
	}

	public async getCanonicalURI(remoteAuthority: string, uri: URI): Promise<URI | null> {
		await this._startCalled.wait();
		if (this._actual) {
			return this._actual.getCanonicalURI(remoteAuthority, uri);
		}
		throw new Error(`Cannot resolve canonical URI`);
	}

	public async start(extensionRegistryVersionId: number, allExtensions: IExtensionDescription[], myExtensions: ExtensionIdentifier[]): Promise<void> {
		if (myExtensions.length > 0) {
			// there are actual extensions, so let's launch the extension host (auto-start)
			const actual = this._createActual(`contains ${myExtensions.length} extension(s): ${myExtensions.map(extId => extId.value)}.`);
			const result = actual.ready();
			this._startCalled.open();
			return result;
		}
		// there are no actual extensions running
		this._startCalled.open();
	}

	public async extensionTestsExecute(): Promise<number> {
		await this._startCalled.wait();
		const actual = await this._getOrCreateActualAndStart(`execute tests.`);
		return actual.extensionTestsExecute();
	}

	public async setRemoteEnvironment(env: { [key: string]: string | null }): Promise<void> {
		await this._startCalled.wait();
		if (this._actual) {
			return this._actual.setRemoteEnvironment(env);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensions/common/lazyPromise.ts]---
Location: vscode-main/src/vs/workbench/services/extensions/common/lazyPromise.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationError, onUnexpectedError } from '../../../../base/common/errors.js';

export class LazyPromise implements Promise<any> {

	private _actual: Promise<any> | null;
	private _actualOk: ((value?: any) => any) | null;
	private _actualErr: ((err?: any) => any) | null;

	private _hasValue: boolean;
	private _value: any;

	protected _hasErr: boolean;
	protected _err: any;

	constructor() {
		this._actual = null;
		this._actualOk = null;
		this._actualErr = null;
		this._hasValue = false;
		this._value = null;
		this._hasErr = false;
		this._err = null;
	}

	get [Symbol.toStringTag](): string {
		return this.toString();
	}

	private _ensureActual(): Promise<any> {
		if (!this._actual) {
			this._actual = new Promise<any>((c, e) => {
				this._actualOk = c;
				this._actualErr = e;

				if (this._hasValue) {
					this._actualOk(this._value);
				}

				if (this._hasErr) {
					this._actualErr(this._err);
				}
			});
		}
		return this._actual;
	}

	public resolveOk(value: any): void {
		if (this._hasValue || this._hasErr) {
			return;
		}

		this._hasValue = true;
		this._value = value;

		if (this._actual) {
			this._actualOk!(value);
		}
	}

	public resolveErr(err: any): void {
		if (this._hasValue || this._hasErr) {
			return;
		}

		this._hasErr = true;
		this._err = err;

		if (this._actual) {
			this._actualErr!(err);
		} else {
			// If nobody's listening at this point, it is safe to assume they never will,
			// since resolving this promise is always "async"
			onUnexpectedError(err);
		}
	}

	public then(success: any, error: any): any {
		return this._ensureActual().then(success, error);
	}

	public catch(error: any): any {
		return this._ensureActual().then(undefined, error);
	}

	public finally(callback: () => void): any {
		return this._ensureActual().finally(callback);
	}
}

export class CanceledLazyPromise extends LazyPromise {
	constructor() {
		super();
		this._hasErr = true;
		this._err = new CancellationError();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensions/common/polyfillNestedWorker.protocol.ts]---
Location: vscode-main/src/vs/workbench/services/extensions/common/polyfillNestedWorker.protocol.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


export interface NewWorkerMessage {
	type: '_newWorker';
	id: string;
	port: any /* MessagePort */;
	url: string;
	options: any /* WorkerOptions */ | undefined;
}

export interface TerminateWorkerMessage {
	type: '_terminateWorker';
	id: string;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensions/common/proxyIdentifier.ts]---
Location: vscode-main/src/vs/workbench/services/extensions/common/proxyIdentifier.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { VSBuffer } from '../../../../base/common/buffer.js';
import type { CancellationToken } from '../../../../base/common/cancellation.js';

export interface IRPCProtocol {
	/**
	 * Returns a proxy to an object addressable/named in the extension host process or in the renderer process.
	 */
	getProxy<T>(identifier: ProxyIdentifier<T>): Proxied<T>;

	/**
	 * Register manually created instance.
	 */
	set<T, R extends T>(identifier: ProxyIdentifier<T>, instance: R): R;

	/**
	 * Assert these identifiers are already registered via `.set`.
	 */
	assertRegistered(identifiers: ProxyIdentifier<unknown>[]): void;

	/**
	 * Wait for the write buffer (if applicable) to become empty.
	 */
	drain(): Promise<void>;

	dispose(): void;
}

export class ProxyIdentifier<T> {
	public static count = 0;
	_proxyIdentifierBrand: void = undefined;

	public readonly sid: string;
	public readonly nid: number;

	constructor(sid: string) {
		this.sid = sid;
		this.nid = (++ProxyIdentifier.count);
	}
}

const identifiers: ProxyIdentifier<unknown>[] = [];

export function createProxyIdentifier<T>(identifier: string): ProxyIdentifier<T> {
	const result = new ProxyIdentifier<T>(identifier);
	identifiers[result.nid] = result;
	return result;
}

/**
 * Mapped-type that replaces all JSONable-types with their toJSON-result type
 */
export type Dto<T> = T extends { toJSON(): infer U }
	? U
	: T extends VSBuffer // VSBuffer is understood by rpc-logic
	? T
	: T extends CancellationToken // CancellationToken is understood by rpc-logic
	? T
	: T extends Function // functions are dropped during JSON-stringify
	? never
	: T extends object // recurse
	? { [k in keyof T]: Dto<T[k]>; }
	: T;

export type Proxied<T> = { [K in keyof T]: T[K] extends (...args: infer A) => infer R
	? (...args: { [K in keyof A]: Dto<A[K]> }) => Promise<Dto<Awaited<R>>>
	: never
};

export function getStringIdentifierForProxy(nid: number): string {
	return identifiers[nid].sid;
}

/**
 * Marks the object as containing buffers that should be serialized more efficiently.
 */
export class SerializableObjectWithBuffers<T> {
	constructor(
		public readonly value: T
	) { }
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensions/common/remoteConsoleUtil.ts]---
Location: vscode-main/src/vs/workbench/services/extensions/common/remoteConsoleUtil.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IRemoteConsoleLog, parse } from '../../../../base/common/console.js';
import { ILogService } from '../../../../platform/log/common/log.js';

export function logRemoteEntry(logService: ILogService, entry: IRemoteConsoleLog, label: string | null = null): void {
	const args = parse(entry).args;
	let firstArg = args.shift();
	if (typeof firstArg !== 'string') {
		return;
	}

	if (!entry.severity) {
		entry.severity = 'info';
	}

	if (label) {
		if (!/^\[/.test(label)) {
			label = `[${label}]`;
		}
		if (!/ $/.test(label)) {
			label = `${label} `;
		}
		firstArg = label + firstArg;
	}

	switch (entry.severity) {
		case 'log':
		case 'info':
			logService.info(firstArg, ...args);
			break;
		case 'warn':
			logService.warn(firstArg, ...args);
			break;
		case 'error':
			logService.error(firstArg, ...args);
			break;
	}
}

export function logRemoteEntryIfError(logService: ILogService, entry: IRemoteConsoleLog, label: string): void {
	const args = parse(entry).args;
	const firstArg = args.shift();
	if (typeof firstArg !== 'string' || entry.severity !== 'error') {
		return;
	}

	if (!/^\[/.test(label)) {
		label = `[${label}]`;
	}
	if (!/ $/.test(label)) {
		label = `${label} `;
	}

	logService.error(label + firstArg, ...args);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensions/common/remoteExtensionHost.ts]---
Location: vscode-main/src/vs/workbench/services/extensions/common/remoteExtensionHost.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../../../base/common/buffer.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../base/common/network.js';
import * as platform from '../../../../base/common/platform.js';
import { URI } from '../../../../base/common/uri.js';
import { IMessagePassingProtocol } from '../../../../base/parts/ipc/common/ipc.js';
import { PersistentProtocol } from '../../../../base/parts/ipc/common/ipc.net.js';
import { IExtensionHostDebugService } from '../../../../platform/debug/common/extensionHostDebug.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { ILogService, ILoggerService } from '../../../../platform/log/common/log.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { IConnectionOptions, IRemoteExtensionHostStartParams, connectRemoteAgentExtensionHost } from '../../../../platform/remote/common/remoteAgentConnection.js';
import { IRemoteAuthorityResolverService, IRemoteConnectionData } from '../../../../platform/remote/common/remoteAuthorityResolver.js';
import { IRemoteSocketFactoryService } from '../../../../platform/remote/common/remoteSocketFactoryService.js';
import { ISignService } from '../../../../platform/sign/common/sign.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { isLoggingOnly } from '../../../../platform/telemetry/common/telemetryUtils.js';
import { IWorkspaceContextService, WorkbenchState } from '../../../../platform/workspace/common/workspace.js';
import { IWorkbenchEnvironmentService } from '../../environment/common/environmentService.js';
import { parseExtensionDevOptions } from './extensionDevOptions.js';
import { IExtensionHostInitData, MessageType, UIKind, createMessageOfType, isMessageOfType } from './extensionHostProtocol.js';
import { RemoteRunningLocation } from './extensionRunningLocation.js';
import { ExtensionHostExtensions, ExtensionHostStartup, IExtensionHost } from './extensions.js';

export interface IRemoteExtensionHostInitData {
	readonly connectionData: IRemoteConnectionData | null;
	readonly pid: number;
	readonly appRoot: URI;
	readonly extensionHostLogsPath: URI;
	readonly globalStorageHome: URI;
	readonly workspaceStorageHome: URI;
	readonly extensions: ExtensionHostExtensions;
}

export interface IRemoteExtensionHostDataProvider {
	readonly remoteAuthority: string;
	getInitData(): Promise<IRemoteExtensionHostInitData>;
}

export class RemoteExtensionHost extends Disposable implements IExtensionHost {

	public readonly pid = null;
	public readonly remoteAuthority: string;
	public readonly startup = ExtensionHostStartup.EagerAutoStart;
	public extensions: ExtensionHostExtensions | null = null;

	private _onExit: Emitter<[number, string | null]> = this._register(new Emitter<[number, string | null]>());
	public readonly onExit: Event<[number, string | null]> = this._onExit.event;

	private _protocol: PersistentProtocol | null;
	private _hasLostConnection: boolean;
	private _terminating: boolean;
	private _hasDisconnected = false;
	private readonly _isExtensionDevHost: boolean;

	constructor(
		public readonly runningLocation: RemoteRunningLocation,
		private readonly _initDataProvider: IRemoteExtensionHostDataProvider,
		@IRemoteSocketFactoryService private readonly remoteSocketFactoryService: IRemoteSocketFactoryService,
		@IWorkspaceContextService private readonly _contextService: IWorkspaceContextService,
		@IWorkbenchEnvironmentService private readonly _environmentService: IWorkbenchEnvironmentService,
		@ITelemetryService private readonly _telemetryService: ITelemetryService,
		@ILogService private readonly _logService: ILogService,
		@ILoggerService protected readonly _loggerService: ILoggerService,
		@ILabelService private readonly _labelService: ILabelService,
		@IRemoteAuthorityResolverService private readonly remoteAuthorityResolverService: IRemoteAuthorityResolverService,
		@IExtensionHostDebugService private readonly _extensionHostDebugService: IExtensionHostDebugService,
		@IProductService private readonly _productService: IProductService,
		@ISignService private readonly _signService: ISignService
	) {
		super();
		this.remoteAuthority = this._initDataProvider.remoteAuthority;
		this._protocol = null;
		this._hasLostConnection = false;
		this._terminating = false;

		const devOpts = parseExtensionDevOptions(this._environmentService);
		this._isExtensionDevHost = devOpts.isExtensionDevHost;
	}

	public start(): Promise<IMessagePassingProtocol> {
		const options: IConnectionOptions = {
			commit: this._productService.commit,
			quality: this._productService.quality,
			addressProvider: {
				getAddress: async () => {
					const { authority } = await this.remoteAuthorityResolverService.resolveAuthority(this._initDataProvider.remoteAuthority);
					return { connectTo: authority.connectTo, connectionToken: authority.connectionToken };
				}
			},
			remoteSocketFactoryService: this.remoteSocketFactoryService,
			signService: this._signService,
			logService: this._logService,
			ipcLogger: null
		};
		return this.remoteAuthorityResolverService.resolveAuthority(this._initDataProvider.remoteAuthority).then((resolverResult) => {

			const startParams: IRemoteExtensionHostStartParams = {
				language: platform.language,
				debugId: this._environmentService.debugExtensionHost.debugId,
				break: this._environmentService.debugExtensionHost.break,
				port: this._environmentService.debugExtensionHost.port,
				env: { ...this._environmentService.debugExtensionHost.env, ...resolverResult.options?.extensionHostEnv },
			};

			const extDevLocs = this._environmentService.extensionDevelopmentLocationURI;

			let debugOk = true;
			if (extDevLocs && extDevLocs.length > 0) {
				// TODO@AW: handles only first path in array
				if (extDevLocs[0].scheme === Schemas.file) {
					debugOk = false;
				}
			}

			if (!debugOk) {
				startParams.break = false;
			}

			return connectRemoteAgentExtensionHost(options, startParams).then(result => {
				this._register(result);
				const { protocol, debugPort, reconnectionToken } = result;
				const isExtensionDevelopmentDebug = typeof debugPort === 'number';
				if (debugOk && this._environmentService.isExtensionDevelopment && this._environmentService.debugExtensionHost.debugId && debugPort) {
					this._extensionHostDebugService.attachSession(this._environmentService.debugExtensionHost.debugId, debugPort, this._initDataProvider.remoteAuthority);
				}

				protocol.onDidDispose(() => {
					this._onExtHostConnectionLost(reconnectionToken);
				});

				protocol.onSocketClose(() => {
					if (this._isExtensionDevHost) {
						this._onExtHostConnectionLost(reconnectionToken);
					}
				});

				// 1) wait for the incoming `ready` event and send the initialization data.
				// 2) wait for the incoming `initialized` event.
				return new Promise<IMessagePassingProtocol>((resolve, reject) => {

					const handle = setTimeout(() => {
						reject('The remote extension host took longer than 60s to send its ready message.');
					}, 60 * 1000);

					const disposable = protocol.onMessage(msg => {

						if (isMessageOfType(msg, MessageType.Ready)) {
							// 1) Extension Host is ready to receive messages, initialize it
							this._createExtHostInitData(isExtensionDevelopmentDebug).then(data => {
								protocol.send(VSBuffer.fromString(JSON.stringify(data)));
							});
							return;
						}

						if (isMessageOfType(msg, MessageType.Initialized)) {
							// 2) Extension Host is initialized

							clearTimeout(handle);

							// stop listening for messages here
							disposable.dispose();

							// release this promise
							this._protocol = protocol;
							resolve(protocol);

							return;
						}

						console.error(`received unexpected message during handshake phase from the extension host: `, msg);
					});

				});
			});
		});
	}

	private _onExtHostConnectionLost(reconnectionToken: string): void {
		if (this._hasLostConnection) {
			// avoid re-entering this method
			return;
		}
		this._hasLostConnection = true;

		if (this._isExtensionDevHost && this._environmentService.debugExtensionHost.debugId) {
			this._extensionHostDebugService.close(this._environmentService.debugExtensionHost.debugId);
		}

		if (this._terminating) {
			// Expected termination path (we asked the process to terminate)
			return;
		}

		this._onExit.fire([0, reconnectionToken]);
	}

	private async _createExtHostInitData(isExtensionDevelopmentDebug: boolean): Promise<IExtensionHostInitData> {
		const remoteInitData = await this._initDataProvider.getInitData();
		this.extensions = remoteInitData.extensions;
		const workspace = this._contextService.getWorkspace();
		return {
			commit: this._productService.commit,
			version: this._productService.version,
			quality: this._productService.quality,
			date: this._productService.date,
			parentPid: remoteInitData.pid,
			environment: {
				isExtensionDevelopmentDebug,
				appRoot: remoteInitData.appRoot,
				appName: this._productService.nameLong,
				appHost: this._productService.embedderIdentifier || 'desktop',
				appUriScheme: this._productService.urlProtocol,
				isExtensionTelemetryLoggingOnly: isLoggingOnly(this._productService, this._environmentService),
				appLanguage: platform.language,
				extensionDevelopmentLocationURI: this._environmentService.extensionDevelopmentLocationURI,
				extensionTestsLocationURI: this._environmentService.extensionTestsLocationURI,
				globalStorageHome: remoteInitData.globalStorageHome,
				workspaceStorageHome: remoteInitData.workspaceStorageHome,
				extensionLogLevel: this._environmentService.extensionLogLevel
			},
			workspace: this._contextService.getWorkbenchState() === WorkbenchState.EMPTY ? null : {
				configuration: workspace.configuration,
				id: workspace.id,
				name: this._labelService.getWorkspaceLabel(workspace),
				transient: workspace.transient
			},
			remote: {
				isRemote: true,
				authority: this._initDataProvider.remoteAuthority,
				connectionData: remoteInitData.connectionData
			},
			consoleForward: {
				includeStack: false,
				logNative: Boolean(this._environmentService.debugExtensionHost.debugId)
			},
			extensions: this.extensions.toSnapshot(),
			telemetryInfo: {
				sessionId: this._telemetryService.sessionId,
				machineId: this._telemetryService.machineId,
				sqmId: this._telemetryService.sqmId,
				devDeviceId: this._telemetryService.devDeviceId ?? this._telemetryService.machineId,
				firstSessionDate: this._telemetryService.firstSessionDate,
				msftInternal: this._telemetryService.msftInternal
			},
			logLevel: this._logService.getLevel(),
			loggers: [...this._loggerService.getRegisteredLoggers()],
			logsLocation: remoteInitData.extensionHostLogsPath,
			autoStart: (this.startup === ExtensionHostStartup.EagerAutoStart),
			uiKind: platform.isWeb ? UIKind.Web : UIKind.Desktop
		};
	}

	getInspectPort(): undefined {
		return undefined;
	}

	enableInspectPort(): Promise<boolean> {
		return Promise.resolve(false);
	}

	async disconnect() {
		if (this._protocol && !this._hasDisconnected) {
			this._protocol.send(createMessageOfType(MessageType.Terminate));
			this._protocol.sendDisconnect();
			this._hasDisconnected = true;
			await this._protocol.drain();
		}
	}

	override dispose(): void {
		super.dispose();

		this._terminating = true;
		this.disconnect();

		if (this._protocol) {
			// Send the extension host a request to terminate itself
			// (graceful termination)
			// setTimeout(() => {
			// console.log(`SENDING TERMINATE TO REMOTE EXT HOST!`);
			this._protocol.getSocket().end();
			// this._protocol.drain();
			this._protocol = null;
			// }, 1000);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensions/common/rpcProtocol.ts]---
Location: vscode-main/src/vs/workbench/services/extensions/common/rpcProtocol.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { RunOnceScheduler } from '../../../../base/common/async.js';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { CharCode } from '../../../../base/common/charCode.js';
import * as errors from '../../../../base/common/errors.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable, DisposableStore, IDisposable } from '../../../../base/common/lifecycle.js';
import { MarshalledObject } from '../../../../base/common/marshalling.js';
import { MarshalledId } from '../../../../base/common/marshallingIds.js';
import { IURITransformer, transformIncomingURIs } from '../../../../base/common/uriIpc.js';
import { IMessagePassingProtocol } from '../../../../base/parts/ipc/common/ipc.js';
import { CanceledLazyPromise, LazyPromise } from './lazyPromise.js';
import { getStringIdentifierForProxy, IRPCProtocol, Proxied, ProxyIdentifier, SerializableObjectWithBuffers } from './proxyIdentifier.js';

export interface JSONStringifyReplacer {
	(key: string, value: any): any;
}

function safeStringify(obj: any, replacer: JSONStringifyReplacer | null): string {
	try {
		return JSON.stringify(obj, <(key: string, value: any) => any>replacer);
	} catch (err) {
		return 'null';
	}
}

const refSymbolName = '$$ref$$';
const undefinedRef = { [refSymbolName]: -1 } as const;

class StringifiedJsonWithBufferRefs {
	constructor(
		public readonly jsonString: string,
		public readonly referencedBuffers: readonly VSBuffer[],
	) { }
}

export function stringifyJsonWithBufferRefs<T>(obj: T, replacer: JSONStringifyReplacer | null = null, useSafeStringify = false): StringifiedJsonWithBufferRefs {
	const foundBuffers: VSBuffer[] = [];
	const serialized = (useSafeStringify ? safeStringify : JSON.stringify)(obj, (key, value) => {
		if (typeof value === 'undefined') {
			return undefinedRef; // JSON.stringify normally converts 'undefined' to 'null'
		} else if (typeof value === 'object') {
			if (value instanceof VSBuffer) {
				const bufferIndex = foundBuffers.push(value) - 1;
				return { [refSymbolName]: bufferIndex };
			}
			if (replacer) {
				return replacer(key, value);
			}
		}
		return value;
	});
	return {
		jsonString: serialized,
		referencedBuffers: foundBuffers
	};
}

export function parseJsonAndRestoreBufferRefs(jsonString: string, buffers: readonly VSBuffer[], uriTransformer: IURITransformer | null): any {
	return JSON.parse(jsonString, (_key, value) => {
		if (value) {
			const ref = value[refSymbolName];
			if (typeof ref === 'number') {
				return buffers[ref];
			}

			if (uriTransformer && (<MarshalledObject>value).$mid === MarshalledId.Uri) {
				return uriTransformer.transformIncoming(value);
			}
		}
		return value;
	});
}


function stringify(obj: any, replacer: JSONStringifyReplacer | null): string {
	return JSON.stringify(obj, <(key: string, value: any) => any>replacer);
}

function createURIReplacer(transformer: IURITransformer | null): JSONStringifyReplacer | null {
	if (!transformer) {
		return null;
	}
	return (key: string, value: any): any => {
		if (value && value.$mid === MarshalledId.Uri) {
			return transformer.transformOutgoing(value);
		}
		return value;
	};
}

export const enum RequestInitiator {
	LocalSide = 0,
	OtherSide = 1
}

export const enum ResponsiveState {
	Responsive = 0,
	Unresponsive = 1
}

export interface IRPCProtocolLogger {
	logIncoming(msgLength: number, req: number, initiator: RequestInitiator, str: string, data?: any): void;
	logOutgoing(msgLength: number, req: number, initiator: RequestInitiator, str: string, data?: any): void;
}

const noop = () => { };

const _RPCProtocolSymbol = Symbol.for('rpcProtocol');
const _RPCProxySymbol = Symbol.for('rpcProxy');

export class RPCProtocol extends Disposable implements IRPCProtocol {

	[_RPCProtocolSymbol] = true;

	private static readonly UNRESPONSIVE_TIME = 3 * 1000; // 3s

	private readonly _onDidChangeResponsiveState: Emitter<ResponsiveState> = this._register(new Emitter<ResponsiveState>());
	public readonly onDidChangeResponsiveState: Event<ResponsiveState> = this._onDidChangeResponsiveState.event;

	private readonly _protocol: IMessagePassingProtocol;
	private readonly _logger: IRPCProtocolLogger | null;
	private readonly _uriTransformer: IURITransformer | null;
	private readonly _uriReplacer: JSONStringifyReplacer | null;
	private _isDisposed: boolean;
	private readonly _locals: any[];
	private readonly _proxies: any[];
	private _lastMessageId: number;
	private readonly _cancelInvokedHandlers: { [req: string]: () => void };
	private readonly _pendingRPCReplies: { [msgId: string]: PendingRPCReply };
	private _responsiveState: ResponsiveState;
	private _unacknowledgedCount: number;
	private _unresponsiveTime: number;
	private _asyncCheckUresponsive: RunOnceScheduler;

	constructor(protocol: IMessagePassingProtocol, logger: IRPCProtocolLogger | null = null, transformer: IURITransformer | null = null) {
		super();
		this._protocol = protocol;
		this._logger = logger;
		this._uriTransformer = transformer;
		this._uriReplacer = createURIReplacer(this._uriTransformer);
		this._isDisposed = false;
		this._locals = [];
		this._proxies = [];
		for (let i = 0, len = ProxyIdentifier.count; i < len; i++) {
			this._locals[i] = null;
			this._proxies[i] = null;
		}
		this._lastMessageId = 0;
		this._cancelInvokedHandlers = Object.create(null);
		this._pendingRPCReplies = {};
		this._responsiveState = ResponsiveState.Responsive;
		this._unacknowledgedCount = 0;
		this._unresponsiveTime = 0;
		this._asyncCheckUresponsive = this._register(new RunOnceScheduler(() => this._checkUnresponsive(), 1000));
		this._register(this._protocol.onMessage((msg) => this._receiveOneMessage(msg)));
	}

	public override dispose(): void {
		this._isDisposed = true;

		// Release all outstanding promises with a canceled error
		Object.keys(this._pendingRPCReplies).forEach((msgId) => {
			const pending = this._pendingRPCReplies[msgId];
			delete this._pendingRPCReplies[msgId];
			pending.resolveErr(errors.canceled());
		});

		super.dispose();
	}

	public drain(): Promise<void> {
		if (typeof this._protocol.drain === 'function') {
			return this._protocol.drain();
		}
		return Promise.resolve();
	}

	private _onWillSendRequest(req: number): void {
		if (this._unacknowledgedCount === 0) {
			// Since this is the first request we are sending in a while,
			// mark this moment as the start for the countdown to unresponsive time
			this._unresponsiveTime = Date.now() + RPCProtocol.UNRESPONSIVE_TIME;
		}
		this._unacknowledgedCount++;
		if (!this._asyncCheckUresponsive.isScheduled()) {
			this._asyncCheckUresponsive.schedule();
		}
	}

	private _onDidReceiveAcknowledge(req: number): void {
		// The next possible unresponsive time is now + delta.
		this._unresponsiveTime = Date.now() + RPCProtocol.UNRESPONSIVE_TIME;
		this._unacknowledgedCount--;
		if (this._unacknowledgedCount === 0) {
			// No more need to check for unresponsive
			this._asyncCheckUresponsive.cancel();
		}
		// The ext host is responsive!
		this._setResponsiveState(ResponsiveState.Responsive);
	}

	private _checkUnresponsive(): void {
		if (this._unacknowledgedCount === 0) {
			// Not waiting for anything => cannot say if it is responsive or not
			return;
		}

		if (Date.now() > this._unresponsiveTime) {
			// Unresponsive!!
			this._setResponsiveState(ResponsiveState.Unresponsive);
		} else {
			// Not (yet) unresponsive, be sure to check again soon
			this._asyncCheckUresponsive.schedule();
		}
	}

	private _setResponsiveState(newResponsiveState: ResponsiveState): void {
		if (this._responsiveState === newResponsiveState) {
			// no change
			return;
		}
		this._responsiveState = newResponsiveState;
		this._onDidChangeResponsiveState.fire(this._responsiveState);
	}

	public get responsiveState(): ResponsiveState {
		return this._responsiveState;
	}

	public transformIncomingURIs<T>(obj: T): T {
		if (!this._uriTransformer) {
			return obj;
		}
		return transformIncomingURIs(obj, this._uriTransformer);
	}

	public getProxy<T>(identifier: ProxyIdentifier<T>): Proxied<T> {
		const { nid: rpcId, sid } = identifier;
		if (!this._proxies[rpcId]) {
			this._proxies[rpcId] = this._createProxy(rpcId, sid);
		}
		return this._proxies[rpcId];
	}

	private _createProxy<T>(rpcId: number, debugName: string): T {
		const handler = {
			get: (target: any, name: PropertyKey) => {
				if (typeof name === 'string' && !target[name] && name.charCodeAt(0) === CharCode.DollarSign) {
					target[name] = (...myArgs: any[]) => {
						return this._remoteCall(rpcId, name, myArgs);
					};
				}
				if (name === _RPCProxySymbol) {
					return debugName;
				}
				return target[name];
			}
		};
		return new Proxy(Object.create(null), handler);
	}

	public set<T, R extends T>(identifier: ProxyIdentifier<T>, value: R): R {
		this._locals[identifier.nid] = value;
		return value;
	}

	public assertRegistered(identifiers: ProxyIdentifier<any>[]): void {
		for (let i = 0, len = identifiers.length; i < len; i++) {
			const identifier = identifiers[i];
			if (!this._locals[identifier.nid]) {
				throw new Error(`Missing proxy instance ${identifier.sid}`);
			}
		}
	}

	private _receiveOneMessage(rawmsg: VSBuffer): void {
		if (this._isDisposed) {
			return;
		}

		const msgLength = rawmsg.byteLength;
		const buff = MessageBuffer.read(rawmsg, 0);
		const messageType = <MessageType>buff.readUInt8();
		const req = buff.readUInt32();

		switch (messageType) {
			case MessageType.RequestJSONArgs:
			case MessageType.RequestJSONArgsWithCancellation: {
				let { rpcId, method, args } = MessageIO.deserializeRequestJSONArgs(buff);
				if (this._uriTransformer) {
					args = transformIncomingURIs(args, this._uriTransformer);
				}
				this._receiveRequest(msgLength, req, rpcId, method, args, (messageType === MessageType.RequestJSONArgsWithCancellation));
				break;
			}
			case MessageType.RequestMixedArgs:
			case MessageType.RequestMixedArgsWithCancellation: {
				let { rpcId, method, args } = MessageIO.deserializeRequestMixedArgs(buff);
				if (this._uriTransformer) {
					args = transformIncomingURIs(args, this._uriTransformer);
				}
				this._receiveRequest(msgLength, req, rpcId, method, args, (messageType === MessageType.RequestMixedArgsWithCancellation));
				break;
			}
			case MessageType.Acknowledged: {
				this._logger?.logIncoming(msgLength, req, RequestInitiator.LocalSide, `ack`);
				this._onDidReceiveAcknowledge(req);
				break;
			}
			case MessageType.Cancel: {
				this._receiveCancel(msgLength, req);
				break;
			}
			case MessageType.ReplyOKEmpty: {
				this._receiveReply(msgLength, req, undefined);
				break;
			}
			case MessageType.ReplyOKJSON: {
				let value = MessageIO.deserializeReplyOKJSON(buff);
				if (this._uriTransformer) {
					value = transformIncomingURIs(value, this._uriTransformer);
				}
				this._receiveReply(msgLength, req, value);
				break;
			}
			case MessageType.ReplyOKJSONWithBuffers: {
				const value = MessageIO.deserializeReplyOKJSONWithBuffers(buff, this._uriTransformer);
				this._receiveReply(msgLength, req, value);
				break;
			}
			case MessageType.ReplyOKVSBuffer: {
				const value = MessageIO.deserializeReplyOKVSBuffer(buff);
				this._receiveReply(msgLength, req, value);
				break;
			}
			case MessageType.ReplyErrError: {
				let err = MessageIO.deserializeReplyErrError(buff);
				if (this._uriTransformer) {
					err = transformIncomingURIs(err, this._uriTransformer);
				}
				this._receiveReplyErr(msgLength, req, err);
				break;
			}
			case MessageType.ReplyErrEmpty: {
				this._receiveReplyErr(msgLength, req, undefined);
				break;
			}
			default:
				console.error(`received unexpected message`);
				console.error(rawmsg);
		}
	}

	private _receiveRequest(msgLength: number, req: number, rpcId: number, method: string, args: any[], usesCancellationToken: boolean): void {
		this._logger?.logIncoming(msgLength, req, RequestInitiator.OtherSide, `receiveRequest ${getStringIdentifierForProxy(rpcId)}.${method}(`, args);
		const callId = String(req);

		let promise: Promise<any>;
		let cancel: () => void;
		if (usesCancellationToken) {
			const cancellationTokenSource = new CancellationTokenSource();
			args.push(cancellationTokenSource.token);
			promise = this._invokeHandler(rpcId, method, args);
			cancel = () => cancellationTokenSource.cancel();
		} else {
			// cannot be cancelled
			promise = this._invokeHandler(rpcId, method, args);
			cancel = noop;
		}

		this._cancelInvokedHandlers[callId] = cancel;

		// Acknowledge the request
		const msg = MessageIO.serializeAcknowledged(req);
		this._logger?.logOutgoing(msg.byteLength, req, RequestInitiator.OtherSide, `ack`);
		this._protocol.send(msg);

		promise.then((r) => {
			delete this._cancelInvokedHandlers[callId];
			const msg = MessageIO.serializeReplyOK(req, r, this._uriReplacer);
			this._logger?.logOutgoing(msg.byteLength, req, RequestInitiator.OtherSide, `reply:`, r);
			this._protocol.send(msg);
		}, (err) => {
			delete this._cancelInvokedHandlers[callId];
			const msg = MessageIO.serializeReplyErr(req, err);
			this._logger?.logOutgoing(msg.byteLength, req, RequestInitiator.OtherSide, `replyErr:`, err);
			this._protocol.send(msg);
		});
	}

	private _receiveCancel(msgLength: number, req: number): void {
		this._logger?.logIncoming(msgLength, req, RequestInitiator.OtherSide, `receiveCancel`);
		const callId = String(req);
		this._cancelInvokedHandlers[callId]?.();
	}

	private _receiveReply(msgLength: number, req: number, value: any): void {
		this._logger?.logIncoming(msgLength, req, RequestInitiator.LocalSide, `receiveReply:`, value);
		const callId = String(req);
		if (!this._pendingRPCReplies.hasOwnProperty(callId)) {
			return;
		}

		const pendingReply = this._pendingRPCReplies[callId];
		delete this._pendingRPCReplies[callId];

		pendingReply.resolveOk(value);
	}

	private _receiveReplyErr(msgLength: number, req: number, value: any): void {
		this._logger?.logIncoming(msgLength, req, RequestInitiator.LocalSide, `receiveReplyErr:`, value);

		const callId = String(req);
		if (!this._pendingRPCReplies.hasOwnProperty(callId)) {
			return;
		}

		const pendingReply = this._pendingRPCReplies[callId];
		delete this._pendingRPCReplies[callId];

		let err: any = undefined;
		if (value) {
			if (value.$isError) {
				err = new Error();
				err.name = value.name;
				err.message = value.message;
				err.stack = value.stack;
			} else {
				err = value;
			}
		}
		pendingReply.resolveErr(err);
	}

	private _invokeHandler(rpcId: number, methodName: string, args: any[]): Promise<any> {
		try {
			return Promise.resolve(this._doInvokeHandler(rpcId, methodName, args));
		} catch (err) {
			return Promise.reject(err);
		}
	}

	private _doInvokeHandler(rpcId: number, methodName: string, args: any[]): any {
		const actor = this._locals[rpcId];
		if (!actor) {
			throw new Error('Unknown actor ' + getStringIdentifierForProxy(rpcId));
		}
		const method = actor[methodName];
		if (typeof method !== 'function') {
			throw new Error('Unknown method ' + methodName + ' on actor ' + getStringIdentifierForProxy(rpcId));
		}
		return method.apply(actor, args);
	}

	private _remoteCall(rpcId: number, methodName: string, args: any[]): Promise<any> {
		if (this._isDisposed) {
			return new CanceledLazyPromise();
		}
		let cancellationToken: CancellationToken | null = null;
		if (args.length > 0 && CancellationToken.isCancellationToken(args[args.length - 1])) {
			cancellationToken = args.pop();
		}

		if (cancellationToken && cancellationToken.isCancellationRequested) {
			// No need to do anything...
			return Promise.reject<any>(errors.canceled());
		}

		const serializedRequestArguments = MessageIO.serializeRequestArguments(args, this._uriReplacer);

		const req = ++this._lastMessageId;
		const callId = String(req);
		const result = new LazyPromise();

		const disposable = new DisposableStore();
		if (cancellationToken) {
			disposable.add(cancellationToken.onCancellationRequested(() => {
				const msg = MessageIO.serializeCancel(req);
				this._logger?.logOutgoing(msg.byteLength, req, RequestInitiator.LocalSide, `cancel`);
				this._protocol.send(msg);
			}));
		}

		this._pendingRPCReplies[callId] = new PendingRPCReply(result, disposable);
		this._onWillSendRequest(req);
		const msg = MessageIO.serializeRequest(req, rpcId, methodName, serializedRequestArguments, !!cancellationToken);
		this._logger?.logOutgoing(msg.byteLength, req, RequestInitiator.LocalSide, `request: ${getStringIdentifierForProxy(rpcId)}.${methodName}(`, args);
		this._protocol.send(msg);
		return result;
	}
}

class PendingRPCReply {
	constructor(
		private readonly _promise: LazyPromise,
		private readonly _disposable: IDisposable
	) { }

	public resolveOk(value: any): void {
		this._promise.resolveOk(value);
		this._disposable.dispose();
	}

	public resolveErr(err: any): void {
		this._promise.resolveErr(err);
		this._disposable.dispose();
	}
}

class MessageBuffer {

	public static alloc(type: MessageType, req: number, messageSize: number): MessageBuffer {
		const result = new MessageBuffer(VSBuffer.alloc(messageSize + 1 /* type */ + 4 /* req */), 0);
		result.writeUInt8(type);
		result.writeUInt32(req);
		return result;
	}

	public static read(buff: VSBuffer, offset: number): MessageBuffer {
		return new MessageBuffer(buff, offset);
	}

	private _buff: VSBuffer;
	private _offset: number;

	public get buffer(): VSBuffer {
		return this._buff;
	}

	private constructor(buff: VSBuffer, offset: number) {
		this._buff = buff;
		this._offset = offset;
	}

	public static sizeUInt8(): number {
		return 1;
	}

	public static readonly sizeUInt32 = 4;

	public writeUInt8(n: number): void {
		this._buff.writeUInt8(n, this._offset); this._offset += 1;
	}

	public readUInt8(): number {
		const n = this._buff.readUInt8(this._offset); this._offset += 1;
		return n;
	}

	public writeUInt32(n: number): void {
		this._buff.writeUInt32BE(n, this._offset); this._offset += 4;
	}

	public readUInt32(): number {
		const n = this._buff.readUInt32BE(this._offset); this._offset += 4;
		return n;
	}

	public static sizeShortString(str: VSBuffer): number {
		return 1 /* string length */ + str.byteLength /* actual string */;
	}

	public writeShortString(str: VSBuffer): void {
		this._buff.writeUInt8(str.byteLength, this._offset); this._offset += 1;
		this._buff.set(str, this._offset); this._offset += str.byteLength;
	}

	public readShortString(): string {
		const strByteLength = this._buff.readUInt8(this._offset); this._offset += 1;
		const strBuff = this._buff.slice(this._offset, this._offset + strByteLength);
		const str = strBuff.toString(); this._offset += strByteLength;
		return str;
	}

	public static sizeLongString(str: VSBuffer): number {
		return 4 /* string length */ + str.byteLength /* actual string */;
	}

	public writeLongString(str: VSBuffer): void {
		this._buff.writeUInt32BE(str.byteLength, this._offset); this._offset += 4;
		this._buff.set(str, this._offset); this._offset += str.byteLength;
	}

	public readLongString(): string {
		const strByteLength = this._buff.readUInt32BE(this._offset); this._offset += 4;
		const strBuff = this._buff.slice(this._offset, this._offset + strByteLength);
		const str = strBuff.toString(); this._offset += strByteLength;
		return str;
	}

	public writeBuffer(buff: VSBuffer): void {
		this._buff.writeUInt32BE(buff.byteLength, this._offset); this._offset += 4;
		this._buff.set(buff, this._offset); this._offset += buff.byteLength;
	}

	public static sizeVSBuffer(buff: VSBuffer): number {
		return 4 /* buffer length */ + buff.byteLength /* actual buffer */;
	}

	public writeVSBuffer(buff: VSBuffer): void {
		this._buff.writeUInt32BE(buff.byteLength, this._offset); this._offset += 4;
		this._buff.set(buff, this._offset); this._offset += buff.byteLength;
	}

	public readVSBuffer(): VSBuffer {
		const buffLength = this._buff.readUInt32BE(this._offset); this._offset += 4;
		const buff = this._buff.slice(this._offset, this._offset + buffLength); this._offset += buffLength;
		return buff;
	}

	public static sizeMixedArray(arr: readonly MixedArg[]): number {
		let size = 0;
		size += 1; // arr length
		for (let i = 0, len = arr.length; i < len; i++) {
			const el = arr[i];
			size += 1; // arg type
			switch (el.type) {
				case ArgType.String:
					size += this.sizeLongString(el.value);
					break;
				case ArgType.VSBuffer:
					size += this.sizeVSBuffer(el.value);
					break;
				case ArgType.SerializedObjectWithBuffers:
					size += this.sizeUInt32; // buffer count
					size += this.sizeLongString(el.value);
					for (let i = 0; i < el.buffers.length; ++i) {
						size += this.sizeVSBuffer(el.buffers[i]);
					}
					break;
				case ArgType.Undefined:
					// empty...
					break;
			}
		}
		return size;
	}

	public writeMixedArray(arr: readonly MixedArg[]): void {
		this._buff.writeUInt8(arr.length, this._offset); this._offset += 1;
		for (let i = 0, len = arr.length; i < len; i++) {
			const el = arr[i];
			switch (el.type) {
				case ArgType.String:
					this.writeUInt8(ArgType.String);
					this.writeLongString(el.value);
					break;
				case ArgType.VSBuffer:
					this.writeUInt8(ArgType.VSBuffer);
					this.writeVSBuffer(el.value);
					break;
				case ArgType.SerializedObjectWithBuffers:
					this.writeUInt8(ArgType.SerializedObjectWithBuffers);
					this.writeUInt32(el.buffers.length);
					this.writeLongString(el.value);
					for (let i = 0; i < el.buffers.length; ++i) {
						this.writeBuffer(el.buffers[i]);
					}
					break;
				case ArgType.Undefined:
					this.writeUInt8(ArgType.Undefined);
					break;
			}
		}
	}

	public readMixedArray(): Array<string | VSBuffer | SerializableObjectWithBuffers<any> | undefined> {
		const arrLen = this._buff.readUInt8(this._offset); this._offset += 1;
		const arr: Array<string | VSBuffer | SerializableObjectWithBuffers<any> | undefined> = new Array(arrLen);
		for (let i = 0; i < arrLen; i++) {
			const argType = <ArgType>this.readUInt8();
			switch (argType) {
				case ArgType.String:
					arr[i] = this.readLongString();
					break;
				case ArgType.VSBuffer:
					arr[i] = this.readVSBuffer();
					break;
				case ArgType.SerializedObjectWithBuffers: {
					const bufferCount = this.readUInt32();
					const jsonString = this.readLongString();
					const buffers: VSBuffer[] = [];
					for (let i = 0; i < bufferCount; ++i) {
						buffers.push(this.readVSBuffer());
					}
					arr[i] = new SerializableObjectWithBuffers(parseJsonAndRestoreBufferRefs(jsonString, buffers, null));
					break;
				}
				case ArgType.Undefined:
					arr[i] = undefined;
					break;
			}
		}
		return arr;
	}
}

const enum SerializedRequestArgumentType {
	Simple,
	Mixed,
}

type SerializedRequestArguments =
	| { readonly type: SerializedRequestArgumentType.Simple; args: string }
	| { readonly type: SerializedRequestArgumentType.Mixed; args: MixedArg[] };


class MessageIO {

	private static _useMixedArgSerialization(arr: any[]): boolean {
		for (let i = 0, len = arr.length; i < len; i++) {
			if (arr[i] instanceof VSBuffer) {
				return true;
			}
			if (arr[i] instanceof SerializableObjectWithBuffers) {
				return true;
			}
			if (typeof arr[i] === 'undefined') {
				return true;
			}
		}
		return false;
	}

	public static serializeRequestArguments(args: any[], replacer: JSONStringifyReplacer | null): SerializedRequestArguments {
		if (this._useMixedArgSerialization(args)) {
			const massagedArgs: MixedArg[] = [];
			for (let i = 0, len = args.length; i < len; i++) {
				const arg = args[i];
				if (arg instanceof VSBuffer) {
					massagedArgs[i] = { type: ArgType.VSBuffer, value: arg };
				} else if (typeof arg === 'undefined') {
					massagedArgs[i] = { type: ArgType.Undefined };
				} else if (arg instanceof SerializableObjectWithBuffers) {
					const { jsonString, referencedBuffers } = stringifyJsonWithBufferRefs(arg.value, replacer);
					massagedArgs[i] = { type: ArgType.SerializedObjectWithBuffers, value: VSBuffer.fromString(jsonString), buffers: referencedBuffers };
				} else {
					massagedArgs[i] = { type: ArgType.String, value: VSBuffer.fromString(stringify(arg, replacer)) };
				}
			}
			return {
				type: SerializedRequestArgumentType.Mixed,
				args: massagedArgs,
			};
		}
		return {
			type: SerializedRequestArgumentType.Simple,
			args: stringify(args, replacer)
		};
	}

	public static serializeRequest(req: number, rpcId: number, method: string, serializedArgs: SerializedRequestArguments, usesCancellationToken: boolean): VSBuffer {
		switch (serializedArgs.type) {
			case SerializedRequestArgumentType.Simple:
				return this._requestJSONArgs(req, rpcId, method, serializedArgs.args, usesCancellationToken);
			case SerializedRequestArgumentType.Mixed:
				return this._requestMixedArgs(req, rpcId, method, serializedArgs.args, usesCancellationToken);
		}
	}

	private static _requestJSONArgs(req: number, rpcId: number, method: string, args: string, usesCancellationToken: boolean): VSBuffer {
		const methodBuff = VSBuffer.fromString(method);
		const argsBuff = VSBuffer.fromString(args);

		let len = 0;
		len += MessageBuffer.sizeUInt8();
		len += MessageBuffer.sizeShortString(methodBuff);
		len += MessageBuffer.sizeLongString(argsBuff);

		const result = MessageBuffer.alloc(usesCancellationToken ? MessageType.RequestJSONArgsWithCancellation : MessageType.RequestJSONArgs, req, len);
		result.writeUInt8(rpcId);
		result.writeShortString(methodBuff);
		result.writeLongString(argsBuff);
		return result.buffer;
	}

	public static deserializeRequestJSONArgs(buff: MessageBuffer): { rpcId: number; method: string; args: any[] } {
		const rpcId = buff.readUInt8();
		const method = buff.readShortString();
		const args = buff.readLongString();
		return {
			rpcId: rpcId,
			method: method,
			args: JSON.parse(args)
		};
	}

	private static _requestMixedArgs(req: number, rpcId: number, method: string, args: readonly MixedArg[], usesCancellationToken: boolean): VSBuffer {
		const methodBuff = VSBuffer.fromString(method);

		let len = 0;
		len += MessageBuffer.sizeUInt8();
		len += MessageBuffer.sizeShortString(methodBuff);
		len += MessageBuffer.sizeMixedArray(args);

		const result = MessageBuffer.alloc(usesCancellationToken ? MessageType.RequestMixedArgsWithCancellation : MessageType.RequestMixedArgs, req, len);
		result.writeUInt8(rpcId);
		result.writeShortString(methodBuff);
		result.writeMixedArray(args);
		return result.buffer;
	}

	public static deserializeRequestMixedArgs(buff: MessageBuffer): { rpcId: number; method: string; args: any[] } {
		const rpcId = buff.readUInt8();
		const method = buff.readShortString();
		const rawargs = buff.readMixedArray();
		const args: any[] = new Array(rawargs.length);
		for (let i = 0, len = rawargs.length; i < len; i++) {
			const rawarg = rawargs[i];
			if (typeof rawarg === 'string') {
				args[i] = JSON.parse(rawarg);
			} else {
				args[i] = rawarg;
			}
		}
		return {
			rpcId: rpcId,
			method: method,
			args: args
		};
	}

	public static serializeAcknowledged(req: number): VSBuffer {
		return MessageBuffer.alloc(MessageType.Acknowledged, req, 0).buffer;
	}

	public static serializeCancel(req: number): VSBuffer {
		return MessageBuffer.alloc(MessageType.Cancel, req, 0).buffer;
	}

	public static serializeReplyOK(req: number, res: any, replacer: JSONStringifyReplacer | null): VSBuffer {
		if (typeof res === 'undefined') {
			return this._serializeReplyOKEmpty(req);
		} else if (res instanceof VSBuffer) {
			return this._serializeReplyOKVSBuffer(req, res);
		} else if (res instanceof SerializableObjectWithBuffers) {
			const { jsonString, referencedBuffers } = stringifyJsonWithBufferRefs(res.value, replacer, true);
			return this._serializeReplyOKJSONWithBuffers(req, jsonString, referencedBuffers);
		} else {
			return this._serializeReplyOKJSON(req, safeStringify(res, replacer));
		}
	}

	private static _serializeReplyOKEmpty(req: number): VSBuffer {
		return MessageBuffer.alloc(MessageType.ReplyOKEmpty, req, 0).buffer;
	}

	private static _serializeReplyOKVSBuffer(req: number, res: VSBuffer): VSBuffer {
		let len = 0;
		len += MessageBuffer.sizeVSBuffer(res);

		const result = MessageBuffer.alloc(MessageType.ReplyOKVSBuffer, req, len);
		result.writeVSBuffer(res);
		return result.buffer;
	}

	public static deserializeReplyOKVSBuffer(buff: MessageBuffer): VSBuffer {
		return buff.readVSBuffer();
	}

	private static _serializeReplyOKJSON(req: number, res: string): VSBuffer {
		const resBuff = VSBuffer.fromString(res);

		let len = 0;
		len += MessageBuffer.sizeLongString(resBuff);

		const result = MessageBuffer.alloc(MessageType.ReplyOKJSON, req, len);
		result.writeLongString(resBuff);
		return result.buffer;
	}

	private static _serializeReplyOKJSONWithBuffers(req: number, res: string, buffers: readonly VSBuffer[]): VSBuffer {
		const resBuff = VSBuffer.fromString(res);

		let len = 0;
		len += MessageBuffer.sizeUInt32; // buffer count
		len += MessageBuffer.sizeLongString(resBuff);
		for (const buffer of buffers) {
			len += MessageBuffer.sizeVSBuffer(buffer);
		}

		const result = MessageBuffer.alloc(MessageType.ReplyOKJSONWithBuffers, req, len);
		result.writeUInt32(buffers.length);
		result.writeLongString(resBuff);
		for (const buffer of buffers) {
			result.writeBuffer(buffer);
		}

		return result.buffer;
	}

	public static deserializeReplyOKJSON(buff: MessageBuffer): any {
		const res = buff.readLongString();
		return JSON.parse(res);
	}

	public static deserializeReplyOKJSONWithBuffers(buff: MessageBuffer, uriTransformer: IURITransformer | null): SerializableObjectWithBuffers<any> {
		const bufferCount = buff.readUInt32();
		const res = buff.readLongString();

		const buffers: VSBuffer[] = [];
		for (let i = 0; i < bufferCount; ++i) {
			buffers.push(buff.readVSBuffer());
		}

		return new SerializableObjectWithBuffers(parseJsonAndRestoreBufferRefs(res, buffers, uriTransformer));
	}

	public static serializeReplyErr(req: number, err: any): VSBuffer {
		const errStr: string | undefined = (err ? safeStringify(errors.transformErrorForSerialization(err), null) : undefined);
		if (typeof errStr !== 'string') {
			return this._serializeReplyErrEmpty(req);
		}
		const errBuff = VSBuffer.fromString(errStr);

		let len = 0;
		len += MessageBuffer.sizeLongString(errBuff);

		const result = MessageBuffer.alloc(MessageType.ReplyErrError, req, len);
		result.writeLongString(errBuff);
		return result.buffer;
	}

	public static deserializeReplyErrError(buff: MessageBuffer): Error {
		const err = buff.readLongString();
		return JSON.parse(err);
	}

	private static _serializeReplyErrEmpty(req: number): VSBuffer {
		return MessageBuffer.alloc(MessageType.ReplyErrEmpty, req, 0).buffer;
	}
}

const enum MessageType {
	RequestJSONArgs = 1,
	RequestJSONArgsWithCancellation = 2,
	RequestMixedArgs = 3,
	RequestMixedArgsWithCancellation = 4,
	Acknowledged = 5,
	Cancel = 6,
	ReplyOKEmpty = 7,
	ReplyOKVSBuffer = 8,
	ReplyOKJSON = 9,
	ReplyOKJSONWithBuffers = 10,
	ReplyErrError = 11,
	ReplyErrEmpty = 12,
}

const enum ArgType {
	String = 1,
	VSBuffer = 2,
	SerializedObjectWithBuffers = 3,
	Undefined = 4,
}


type MixedArg =
	| { readonly type: ArgType.String; readonly value: VSBuffer }
	| { readonly type: ArgType.VSBuffer; readonly value: VSBuffer }
	| { readonly type: ArgType.SerializedObjectWithBuffers; readonly value: VSBuffer; readonly buffers: readonly VSBuffer[] }
	| { readonly type: ArgType.Undefined }
	;
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensions/common/workspaceContains.ts]---
Location: vscode-main/src/vs/workbench/services/extensions/common/workspaceContains.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as resources from '../../../../base/common/resources.js';
import { URI, UriComponents } from '../../../../base/common/uri.js';
import { CancellationTokenSource, CancellationToken } from '../../../../base/common/cancellation.js';
import * as errors from '../../../../base/common/errors.js';
import { ExtensionIdentifier, IExtensionDescription } from '../../../../platform/extensions/common/extensions.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { QueryBuilder } from '../../search/common/queryBuilder.js';
import { ISearchService } from '../../search/common/search.js';
import { toWorkspaceFolder } from '../../../../platform/workspace/common/workspace.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { promiseWithResolvers } from '../../../../base/common/async.js';

const WORKSPACE_CONTAINS_TIMEOUT = 7000;

export interface IExtensionActivationHost {
	readonly logService: ILogService;
	readonly folders: readonly UriComponents[];
	readonly forceUsingSearch: boolean;

	exists(uri: URI): Promise<boolean>;
	checkExists(folders: readonly UriComponents[], includes: string[], token: CancellationToken): Promise<boolean>;
}

export interface IExtensionActivationResult {
	activationEvent: string;
}

export function checkActivateWorkspaceContainsExtension(host: IExtensionActivationHost, desc: IExtensionDescription): Promise<IExtensionActivationResult | undefined> {
	const activationEvents = desc.activationEvents;
	if (!activationEvents) {
		return Promise.resolve(undefined);
	}

	const fileNames: string[] = [];
	const globPatterns: string[] = [];

	for (const activationEvent of activationEvents) {
		if (/^workspaceContains:/.test(activationEvent)) {
			const fileNameOrGlob = activationEvent.substr('workspaceContains:'.length);
			if (fileNameOrGlob.indexOf('*') >= 0 || fileNameOrGlob.indexOf('?') >= 0 || host.forceUsingSearch) {
				globPatterns.push(fileNameOrGlob);
			} else {
				fileNames.push(fileNameOrGlob);
			}
		}
	}

	if (fileNames.length === 0 && globPatterns.length === 0) {
		return Promise.resolve(undefined);
	}

	const { promise, resolve } = promiseWithResolvers<IExtensionActivationResult | undefined>();
	const activate = (activationEvent: string) => resolve({ activationEvent });

	const fileNamePromise = Promise.all(fileNames.map((fileName) => _activateIfFileName(host, fileName, activate))).then(() => { });
	const globPatternPromise = _activateIfGlobPatterns(host, desc.identifier, globPatterns, activate);

	Promise.all([fileNamePromise, globPatternPromise]).then(() => {
		// when all are done, resolve with undefined (relevant only if it was not activated so far)
		resolve(undefined);
	});

	return promise;
}

async function _activateIfFileName(host: IExtensionActivationHost, fileName: string, activate: (activationEvent: string) => void): Promise<void> {
	// find exact path
	for (const uri of host.folders) {
		if (await host.exists(resources.joinPath(URI.revive(uri), fileName))) {
			// the file was found
			activate(`workspaceContains:${fileName}`);
			return;
		}
	}
}

async function _activateIfGlobPatterns(host: IExtensionActivationHost, extensionId: ExtensionIdentifier, globPatterns: string[], activate: (activationEvent: string) => void): Promise<void> {
	if (globPatterns.length === 0) {
		return Promise.resolve(undefined);
	}

	const tokenSource = new CancellationTokenSource();
	const searchP = host.checkExists(host.folders, globPatterns, tokenSource.token);

	const timer = setTimeout(async () => {
		tokenSource.cancel();
		host.logService.info(`Not activating extension '${extensionId.value}': Timed out while searching for 'workspaceContains' pattern ${globPatterns.join(',')}`);
	}, WORKSPACE_CONTAINS_TIMEOUT);

	let exists: boolean = false;
	try {
		exists = await searchP;
	} catch (err) {
		if (!errors.isCancellationError(err)) {
			errors.onUnexpectedError(err);
		}
	}

	tokenSource.dispose();
	clearTimeout(timer);

	if (exists) {
		// a file was found matching one of the glob patterns
		activate(`workspaceContains:${globPatterns.join(',')}`);
	}
}

export function checkGlobFileExists(
	accessor: ServicesAccessor,
	folders: readonly UriComponents[],
	includes: string[],
	token: CancellationToken,
): Promise<boolean> {
	const instantiationService = accessor.get(IInstantiationService);
	const searchService = accessor.get(ISearchService);
	const queryBuilder = instantiationService.createInstance(QueryBuilder);
	const query = queryBuilder.file(folders.map(folder => toWorkspaceFolder(URI.revive(folder))), {
		_reason: 'checkExists',
		includePattern: includes,
		exists: true
	});

	return searchService.fileSearch(query, token).then(
		result => {
			return !!result.limitHit;
		},
		err => {
			if (!errors.isCancellationError(err)) {
				return Promise.reject(err);
			}

			return false;
		});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensions/electron-browser/cachedExtensionScanner.ts]---
Location: vscode-main/src/vs/workbench/services/extensions/electron-browser/cachedExtensionScanner.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as platform from '../../../../base/common/platform.js';
import { IExtensionDescription, IExtension } from '../../../../platform/extensions/common/extensions.js';
import { dedupExtensions } from '../common/extensionsUtil.js';
import { IExtensionsScannerService, IScannedExtension, toExtensionDescription as toExtensionDescriptionFromScannedExtension } from '../../../../platform/extensionManagement/common/extensionsScannerService.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import Severity from '../../../../base/common/severity.js';
import { localize } from '../../../../nls.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { IHostService } from '../../host/browser/host.js';
import { timeout } from '../../../../base/common/async.js';
import { IUserDataProfileService } from '../../userDataProfile/common/userDataProfile.js';
import { getErrorMessage } from '../../../../base/common/errors.js';
import { IWorkbenchExtensionManagementService } from '../../extensionManagement/common/extensionManagement.js';
import { toExtensionDescription } from '../common/extensions.js';
import { IWorkbenchEnvironmentService } from '../../environment/common/environmentService.js';

export class CachedExtensionScanner {

	public readonly scannedExtensions: Promise<IExtensionDescription[]>;
	private _scannedExtensionsResolve!: (result: IExtensionDescription[]) => void;
	private _scannedExtensionsReject!: (err: unknown) => void;

	constructor(
		@INotificationService private readonly _notificationService: INotificationService,
		@IHostService private readonly _hostService: IHostService,
		@IExtensionsScannerService private readonly _extensionsScannerService: IExtensionsScannerService,
		@IUserDataProfileService private readonly _userDataProfileService: IUserDataProfileService,
		@IWorkbenchExtensionManagementService private readonly _extensionManagementService: IWorkbenchExtensionManagementService,
		@IWorkbenchEnvironmentService private readonly _environmentService: IWorkbenchEnvironmentService,
		@ILogService private readonly _logService: ILogService,
	) {
		this.scannedExtensions = new Promise<IExtensionDescription[]>((resolve, reject) => {
			this._scannedExtensionsResolve = resolve;
			this._scannedExtensionsReject = reject;
		});
	}

	public async startScanningExtensions(): Promise<void> {
		try {
			const extensions = await this._scanInstalledExtensions();
			this._scannedExtensionsResolve(extensions);
		} catch (err) {
			this._scannedExtensionsReject(err);
		}
	}

	private async _scanInstalledExtensions(): Promise<IExtensionDescription[]> {
		try {
			const language = platform.language;
			const result = await Promise.allSettled([
				this._extensionsScannerService.scanSystemExtensions({ language, checkControlFile: true }),
				this._extensionsScannerService.scanUserExtensions({ language, profileLocation: this._userDataProfileService.currentProfile.extensionsResource, useCache: true }),
				this._environmentService.remoteAuthority ? [] : this._extensionManagementService.getInstalledWorkspaceExtensions(false)
			]);

			let hasErrors = false;

			let scannedSystemExtensions: IScannedExtension[] = [];
			if (result[0].status === 'fulfilled') {
				scannedSystemExtensions = result[0].value;
			} else {
				hasErrors = true;
				this._logService.error(`Error scanning system extensions:`, getErrorMessage(result[0].reason));
			}

			let scannedUserExtensions: IScannedExtension[] = [];
			if (result[1].status === 'fulfilled') {
				scannedUserExtensions = result[1].value;
			} else {
				hasErrors = true;
				this._logService.error(`Error scanning user extensions:`, getErrorMessage(result[1].reason));
			}

			let workspaceExtensions: IExtension[] = [];
			if (result[2].status === 'fulfilled') {
				workspaceExtensions = result[2].value;
			} else {
				hasErrors = true;
				this._logService.error(`Error scanning workspace extensions:`, getErrorMessage(result[2].reason));
			}

			const scannedDevelopedExtensions: IScannedExtension[] = [];
			try {
				const allScannedDevelopedExtensions = await this._extensionsScannerService.scanExtensionsUnderDevelopment([...scannedSystemExtensions, ...scannedUserExtensions], { language, includeInvalid: true });
				const invalidExtensions: IScannedExtension[] = [];
				for (const extensionUnderDevelopment of allScannedDevelopedExtensions) {
					if (extensionUnderDevelopment.isValid) {
						scannedDevelopedExtensions.push(extensionUnderDevelopment);
					} else {
						invalidExtensions.push(extensionUnderDevelopment);
					}
				}
				if (invalidExtensions.length > 0) {
					this._notificationService.prompt(
						Severity.Warning,
						invalidExtensions.length === 1
							? localize('extensionUnderDevelopment.invalid', "Failed loading extension '{0}' under development because it is invalid: {1}", invalidExtensions[0].location.fsPath, invalidExtensions[0].validations[0][1])
							: localize('extensionsUnderDevelopment.invalid', "Failed loading extensions {0} under development because they are invalid: {1}", invalidExtensions.map(ext => `'${ext.location.fsPath}'`).join(', '), invalidExtensions.map(ext => `${ext.validations[0][1]}`).join(', ')),
						[]
					);
				}
			} catch (error) {
				this._logService.error(error);
			}

			const system = scannedSystemExtensions.map(e => toExtensionDescriptionFromScannedExtension(e, false));
			const user = scannedUserExtensions.map(e => toExtensionDescriptionFromScannedExtension(e, false));
			const workspace = workspaceExtensions.map(e => toExtensionDescription(e, false));
			const development = scannedDevelopedExtensions.map(e => toExtensionDescriptionFromScannedExtension(e, true));
			const r = dedupExtensions(system, user, workspace, development, this._logService);

			if (!hasErrors) {
				const disposable = this._extensionsScannerService.onDidChangeCache(() => {
					disposable.dispose();
					this._notificationService.prompt(
						Severity.Error,
						localize('extensionCache.invalid', "Extensions have been modified on disk. Please reload the window."),
						[{
							label: localize('reloadWindow', "Reload Window"),
							run: () => this._hostService.reload()
						}]
					);
				});
				timeout(5000).then(() => disposable.dispose());
			}

			return r;
		} catch (err) {
			this._logService.error(`Error scanning installed extensions:`);
			this._logService.error(err);
			return [];
		}
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensions/electron-browser/extensionHostProfiler.ts]---
Location: vscode-main/src/vs/workbench/services/extensions/electron-browser/extensionHostProfiler.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { TernarySearchTree } from '../../../../base/common/ternarySearchTree.js';
import { IExtensionHostProfile, IExtensionService, ProfileSegmentId, ProfileSession } from '../common/extensions.js';
import { IExtensionDescription } from '../../../../platform/extensions/common/extensions.js';
import { Schemas } from '../../../../base/common/network.js';
import { URI } from '../../../../base/common/uri.js';
import { IV8InspectProfilingService, IV8Profile, IV8ProfileNode } from '../../../../platform/profiling/common/profiling.js';
import { createSingleCallFunction } from '../../../../base/common/functional.js';

export class ExtensionHostProfiler {

	constructor(
		private readonly _host: string,
		private readonly _port: number,
		@IExtensionService private readonly _extensionService: IExtensionService,
		@IV8InspectProfilingService private readonly _profilingService: IV8InspectProfilingService,
	) {
	}

	public async start(): Promise<ProfileSession> {

		const id = await this._profilingService.startProfiling({ host: this._host, port: this._port });

		return {
			stop: createSingleCallFunction(async () => {
				const profile = await this._profilingService.stopProfiling(id);
				await this._extensionService.whenInstalledExtensionsRegistered();
				const extensions = this._extensionService.extensions;
				return this._distill(profile, extensions);
			})
		};
	}

	private _distill(profile: IV8Profile, extensions: readonly IExtensionDescription[]): IExtensionHostProfile {
		const searchTree = TernarySearchTree.forUris<IExtensionDescription>();
		for (const extension of extensions) {
			if (extension.extensionLocation.scheme === Schemas.file) {
				searchTree.set(URI.file(extension.extensionLocation.fsPath), extension);
			}
		}

		const nodes = profile.nodes;
		const idsToNodes = new Map<number, IV8ProfileNode>();
		const idsToSegmentId = new Map<number, ProfileSegmentId | null>();
		for (const node of nodes) {
			idsToNodes.set(node.id, node);
		}

		function visit(node: IV8ProfileNode, segmentId: ProfileSegmentId | null) {
			if (!segmentId) {
				switch (node.callFrame.functionName) {
					case '(root)':
						break;
					case '(program)':
						segmentId = 'program';
						break;
					case '(garbage collector)':
						segmentId = 'gc';
						break;
					default:
						segmentId = 'self';
						break;
				}
			} else if (segmentId === 'self' && node.callFrame.url) {
				let extension: IExtensionDescription | undefined;
				try {
					extension = searchTree.findSubstr(URI.parse(node.callFrame.url));
				} catch {
					// ignore
				}
				if (extension) {
					segmentId = extension.identifier.value;
				}
			}
			idsToSegmentId.set(node.id, segmentId);

			if (node.children) {
				for (const child of node.children) {
					const childNode = idsToNodes.get(child);
					if (childNode) {
						visit(childNode, segmentId);
					}
				}
			}
		}
		visit(nodes[0], null);

		const samples = profile.samples || [];
		const timeDeltas = profile.timeDeltas || [];
		const distilledDeltas: number[] = [];
		const distilledIds: ProfileSegmentId[] = [];

		let currSegmentTime = 0;
		let currSegmentId: string | undefined;
		for (let i = 0; i < samples.length; i++) {
			const id = samples[i];
			const segmentId = idsToSegmentId.get(id);
			if (segmentId !== currSegmentId) {
				if (currSegmentId) {
					distilledIds.push(currSegmentId);
					distilledDeltas.push(currSegmentTime);
				}
				currSegmentId = segmentId ?? undefined;
				currSegmentTime = 0;
			}
			currSegmentTime += timeDeltas[i];
		}
		if (currSegmentId) {
			distilledIds.push(currSegmentId);
			distilledDeltas.push(currSegmentTime);
		}

		return {
			startTime: profile.startTime,
			endTime: profile.endTime,
			deltas: distilledDeltas,
			ids: distilledIds,
			data: profile,
			getAggregatedTimes: () => {
				const segmentsToTime = new Map<ProfileSegmentId, number>();
				for (let i = 0; i < distilledIds.length; i++) {
					const id = distilledIds[i];
					segmentsToTime.set(id, (segmentsToTime.get(id) || 0) + distilledDeltas[i]);
				}
				return segmentsToTime;
			}
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensions/electron-browser/extensionHostStarter.ts]---
Location: vscode-main/src/vs/workbench/services/extensions/electron-browser/extensionHostStarter.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerMainProcessRemoteService } from '../../../../platform/ipc/electron-browser/services.js';
import { IExtensionHostStarter, ipcExtensionHostStarterChannelName } from '../../../../platform/extensions/common/extensionHostStarter.js';

registerMainProcessRemoteService(IExtensionHostStarter, ipcExtensionHostStarterChannelName);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensions/electron-browser/extensionsScannerService.ts]---
Location: vscode-main/src/vs/workbench/services/extensions/electron-browser/extensionsScannerService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';
import { INativeEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { IExtensionsProfileScannerService } from '../../../../platform/extensionManagement/common/extensionsProfileScannerService.js';
import { IExtensionsScannerService, NativeExtensionsScannerService, } from '../../../../platform/extensionManagement/common/extensionsScannerService.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IUserDataProfilesService } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { IUserDataProfileService } from '../../userDataProfile/common/userDataProfile.js';

export class ExtensionsScannerService extends NativeExtensionsScannerService implements IExtensionsScannerService {

	constructor(
		@IUserDataProfileService userDataProfileService: IUserDataProfileService,
		@IUserDataProfilesService userDataProfilesService: IUserDataProfilesService,
		@IExtensionsProfileScannerService extensionsProfileScannerService: IExtensionsProfileScannerService,
		@IFileService fileService: IFileService,
		@ILogService logService: ILogService,
		@INativeEnvironmentService environmentService: INativeEnvironmentService,
		@IProductService productService: IProductService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
		@IInstantiationService instantiationService: IInstantiationService,
	) {
		super(
			URI.file(environmentService.builtinExtensionsPath),
			URI.file(environmentService.extensionsPath),
			environmentService.userHome,
			userDataProfileService.currentProfile,
			userDataProfilesService, extensionsProfileScannerService, fileService, logService, environmentService, productService, uriIdentityService, instantiationService);
	}

}

registerSingleton(IExtensionsScannerService, ExtensionsScannerService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensions/electron-browser/localProcessExtensionHost.ts]---
Location: vscode-main/src/vs/workbench/services/extensions/electron-browser/localProcessExtensionHost.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { timeout } from '../../../../base/common/async.js';
import { encodeBase64, VSBuffer } from '../../../../base/common/buffer.js';
import { CancellationError } from '../../../../base/common/errors.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable, toDisposable } from '../../../../base/common/lifecycle.js';
import * as objects from '../../../../base/common/objects.js';
import * as platform from '../../../../base/common/platform.js';
import { removeDangerousEnvVariables } from '../../../../base/common/processes.js';
import { StopWatch } from '../../../../base/common/stopwatch.js';
import { URI } from '../../../../base/common/uri.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import { IMessagePassingProtocol } from '../../../../base/parts/ipc/common/ipc.js';
import { BufferedEmitter } from '../../../../base/parts/ipc/common/ipc.net.js';
import { acquirePort } from '../../../../base/parts/ipc/electron-browser/ipc.mp.js';
import * as nls from '../../../../nls.js';
import { IExtensionHostDebugService } from '../../../../platform/debug/common/extensionHostDebug.js';
import { IExtensionHostProcessOptions, IExtensionHostStarter } from '../../../../platform/extensions/common/extensionHostStarter.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { ILogService, ILoggerService } from '../../../../platform/log/common/log.js';
import { INativeHostService } from '../../../../platform/native/common/native.js';
import { INotificationService, NotificationPriority, Severity } from '../../../../platform/notification/common/notification.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { isLoggingOnly } from '../../../../platform/telemetry/common/telemetryUtils.js';
import { IUserDataProfilesService } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { IWorkspaceContextService, WorkbenchState, isUntitledWorkspace } from '../../../../platform/workspace/common/workspace.js';
import { INativeWorkbenchEnvironmentService } from '../../environment/electron-browser/environmentService.js';
import { IShellEnvironmentService } from '../../environment/electron-browser/shellEnvironmentService.js';
import { MessagePortExtHostConnection, writeExtHostConnection } from '../common/extensionHostEnv.js';
import { IExtensionHostInitData, MessageType, NativeLogMarkers, UIKind, isMessageOfType } from '../common/extensionHostProtocol.js';
import { LocalProcessRunningLocation } from '../common/extensionRunningLocation.js';
import { ExtensionHostExtensions, ExtensionHostStartup, IExtensionHost, IExtensionInspectInfo } from '../common/extensions.js';
import { IHostService } from '../../host/browser/host.js';
import { ILifecycleService, WillShutdownEvent } from '../../lifecycle/common/lifecycle.js';
import { parseExtensionDevOptions } from '../common/extensionDevOptions.js';

export interface ILocalProcessExtensionHostInitData {
	readonly extensions: ExtensionHostExtensions;
}

export interface ILocalProcessExtensionHostDataProvider {
	getInitData(): Promise<ILocalProcessExtensionHostInitData>;
}

export class ExtensionHostProcess {

	private readonly _id: string;

	public get onStdout(): Event<string> {
		return this._extensionHostStarter.onDynamicStdout(this._id);
	}

	public get onStderr(): Event<string> {
		return this._extensionHostStarter.onDynamicStderr(this._id);
	}

	public get onMessage(): Event<unknown> {
		return this._extensionHostStarter.onDynamicMessage(this._id);
	}

	public get onExit(): Event<{ code: number; signal: string }> {
		return this._extensionHostStarter.onDynamicExit(this._id);
	}

	constructor(
		id: string,
		private readonly _extensionHostStarter: IExtensionHostStarter,
	) {
		this._id = id;
	}

	public start(opts: IExtensionHostProcessOptions): Promise<{ pid: number | undefined }> {
		return this._extensionHostStarter.start(this._id, opts);
	}

	public enableInspectPort(): Promise<boolean> {
		return this._extensionHostStarter.enableInspectPort(this._id);
	}

	public kill(): Promise<void> {
		return this._extensionHostStarter.kill(this._id);
	}
}

export class NativeLocalProcessExtensionHost extends Disposable implements IExtensionHost {

	public pid: number | null = null;
	public readonly remoteAuthority = null;
	public extensions: ExtensionHostExtensions | null = null;

	private readonly _onExit: Emitter<[number, string]> = this._register(new Emitter<[number, string]>());
	public readonly onExit: Event<[number, string]> = this._onExit.event;

	private readonly _onDidSetInspectPort = this._register(new Emitter<void>());


	private readonly _isExtensionDevHost: boolean;
	private readonly _isExtensionDevDebug: boolean;
	private readonly _isExtensionDevDebugBrk: boolean;
	private readonly _isExtensionDevTestFromCli: boolean;

	// State
	private _terminating: boolean;

	// Resources, in order they get acquired/created when .start() is called:
	private _inspectListener: IExtensionInspectInfo | null;
	private _extensionHostProcess: ExtensionHostProcess | null;
	private _messageProtocol: Promise<IMessagePassingProtocol> | null;

	constructor(
		public readonly runningLocation: LocalProcessRunningLocation,
		public readonly startup: ExtensionHostStartup.EagerAutoStart | ExtensionHostStartup.EagerManualStart,
		private readonly _initDataProvider: ILocalProcessExtensionHostDataProvider,
		@IWorkspaceContextService private readonly _contextService: IWorkspaceContextService,
		@INotificationService private readonly _notificationService: INotificationService,
		@INativeHostService private readonly _nativeHostService: INativeHostService,
		@ILifecycleService private readonly _lifecycleService: ILifecycleService,
		@INativeWorkbenchEnvironmentService private readonly _environmentService: INativeWorkbenchEnvironmentService,
		@IUserDataProfilesService private readonly _userDataProfilesService: IUserDataProfilesService,
		@ITelemetryService private readonly _telemetryService: ITelemetryService,
		@ILogService private readonly _logService: ILogService,
		@ILoggerService private readonly _loggerService: ILoggerService,
		@ILabelService private readonly _labelService: ILabelService,
		@IExtensionHostDebugService private readonly _extensionHostDebugService: IExtensionHostDebugService,
		@IHostService private readonly _hostService: IHostService,
		@IProductService private readonly _productService: IProductService,
		@IShellEnvironmentService private readonly _shellEnvironmentService: IShellEnvironmentService,
		@IExtensionHostStarter private readonly _extensionHostStarter: IExtensionHostStarter,
	) {
		super();
		const devOpts = parseExtensionDevOptions(this._environmentService);
		this._isExtensionDevHost = devOpts.isExtensionDevHost;
		this._isExtensionDevDebug = devOpts.isExtensionDevDebug;
		this._isExtensionDevDebugBrk = devOpts.isExtensionDevDebugBrk;
		this._isExtensionDevTestFromCli = devOpts.isExtensionDevTestFromCli;

		this._terminating = false;

		this._inspectListener = null;
		this._extensionHostProcess = null;
		this._messageProtocol = null;

		this._register(this._lifecycleService.onWillShutdown(e => this._onWillShutdown(e)));
		this._register(this._extensionHostDebugService.onClose(event => {
			if (this._isExtensionDevHost && this._environmentService.debugExtensionHost.debugId === event.sessionId) {
				this._nativeHostService.closeWindow();
			}
		}));
		this._register(this._extensionHostDebugService.onReload(event => {
			if (this._isExtensionDevHost && this._environmentService.debugExtensionHost.debugId === event.sessionId) {
				this._hostService.reload();
			}
		}));
	}

	public override dispose(): void {
		if (this._terminating) {
			return;
		}
		this._terminating = true;
		super.dispose();
		this._messageProtocol = null;
	}

	public start(): Promise<IMessagePassingProtocol> {
		if (this._terminating) {
			// .terminate() was called
			throw new CancellationError();
		}

		if (!this._messageProtocol) {
			this._messageProtocol = this._start();
		}

		return this._messageProtocol;
	}

	private async _start(): Promise<IMessagePassingProtocol> {
		const [extensionHostCreationResult, portNumber, processEnv] = await Promise.all([
			this._extensionHostStarter.createExtensionHost(),
			this._tryFindDebugPort(),
			this._shellEnvironmentService.getShellEnv(),
		]);

		this._extensionHostProcess = new ExtensionHostProcess(extensionHostCreationResult.id, this._extensionHostStarter);

		const env = objects.mixin(processEnv, {
			VSCODE_ESM_ENTRYPOINT: 'vs/workbench/api/node/extensionHostProcess',
			VSCODE_HANDLES_UNCAUGHT_ERRORS: true
		});

		if (this._environmentService.debugExtensionHost.env) {
			objects.mixin(env, this._environmentService.debugExtensionHost.env);
		}

		removeDangerousEnvVariables(env);

		if (this._isExtensionDevHost) {
			// Unset `VSCODE_CODE_CACHE_PATH` when developing extensions because it might
			// be that dependencies, that otherwise would be cached, get modified.
			delete env['VSCODE_CODE_CACHE_PATH'];
		}

		const opts: IExtensionHostProcessOptions = {
			responseWindowId: this._nativeHostService.windowId,
			responseChannel: 'vscode:startExtensionHostMessagePortResult',
			responseNonce: generateUuid(),
			env,
			// We only detach the extension host on windows. Linux and Mac orphan by default
			// and detach under Linux and Mac create another process group.
			// We detach because we have noticed that when the renderer exits, its child processes
			// (i.e. extension host) are taken down in a brutal fashion by the OS
			detached: !!platform.isWindows,
			execArgv: undefined as string[] | undefined,
			silent: true
		};

		const inspectHost = '127.0.0.1';
		if (portNumber !== 0) {
			opts.execArgv = [
				'--nolazy',
				(this._isExtensionDevDebugBrk ? '--inspect-brk=' : '--inspect=') + `${inspectHost}:${portNumber}`
			];
		} else {
			opts.execArgv = ['--inspect-port=0'];
		}

		if (this._environmentService.extensionTestsLocationURI) {
			opts.execArgv.unshift('--expose-gc');
		}

		if (this._environmentService.args['prof-v8-extensions']) {
			opts.execArgv.unshift('--prof');
		}

		// Refs https://github.com/microsoft/vscode/issues/189805
		//
		// Enable experimental network inspection
		// inspector agent is always setup hence add this flag
		// unconditionally.
		opts.execArgv.unshift('--dns-result-order=ipv4first', '--experimental-network-inspection');

		// Catch all output coming from the extension host process
		type Output = { data: string; format: string[] };
		const onStdout = this._handleProcessOutputStream(this._extensionHostProcess.onStdout);
		const onStderr = this._handleProcessOutputStream(this._extensionHostProcess.onStderr);
		const onOutput = Event.any(
			Event.map(onStdout.event, o => ({ data: `%c${o}`, format: [''] })),
			Event.map(onStderr.event, o => ({ data: `%c${o}`, format: ['color: red'] }))
		);

		// Debounce all output, so we can render it in the Chrome console as a group
		const onDebouncedOutput = Event.debounce<Output>(onOutput, (r, o) => {
			return r
				? { data: r.data + o.data, format: [...r.format, ...o.format] }
				: { data: o.data, format: o.format };
		}, 100);

		// Print out extension host output
		this._register(onDebouncedOutput(output => {
			const inspectorUrlMatch = output.data && output.data.match(/ws:\/\/([^\s]+):(\d+)\/([^\s]+)/);
			if (inspectorUrlMatch) {
				const [, host, port, auth] = inspectorUrlMatch;
				const devtoolsUrl = `devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws=${host}:${port}/${auth}`;
				if (!this._environmentService.isBuilt && !this._isExtensionDevTestFromCli) {
					console.debug(`%c[Extension Host] %cdebugger inspector at ${devtoolsUrl}`, 'color: blue', 'color:');
				}
				if (!this._inspectListener || !this._inspectListener.devtoolsUrl) {
					this._inspectListener = { host, port: Number(port), devtoolsUrl };
					this._onDidSetInspectPort.fire();
				}
			} else {
				if (!this._isExtensionDevTestFromCli) {
					console.group('Extension Host');
					console.log(output.data, ...output.format);
					console.groupEnd();
				}
			}
		}));

		// Lifecycle

		this._register(this._extensionHostProcess.onExit(({ code, signal }) => this._onExtHostProcessExit(code, signal)));

		// Notify debugger that we are ready to attach to the process if we run a development extension
		if (portNumber) {
			if (this._isExtensionDevHost && this._isExtensionDevDebug && this._environmentService.debugExtensionHost.debugId) {
				this._extensionHostDebugService.attachSession(this._environmentService.debugExtensionHost.debugId, portNumber);
			}
			this._inspectListener = { port: portNumber, host: inspectHost };
			this._onDidSetInspectPort.fire();
		}

		// Help in case we fail to start it
		let startupTimeoutHandle: Timeout | undefined;
		if (!this._environmentService.isBuilt && !this._environmentService.remoteAuthority || this._isExtensionDevHost) {
			startupTimeoutHandle = setTimeout(() => {
				this._logService.error(`[LocalProcessExtensionHost]: Extension host did not start in 10 seconds (debugBrk: ${this._isExtensionDevDebugBrk})`);

				const msg = this._isExtensionDevDebugBrk
					? nls.localize('extensionHost.startupFailDebug', "Extension host did not start in 10 seconds, it might be stopped on the first line and needs a debugger to continue.")
					: nls.localize('extensionHost.startupFail', "Extension host did not start in 10 seconds, that might be a problem.");

				this._notificationService.prompt(Severity.Warning, msg,
					[{
						label: nls.localize('reloadWindow', "Reload Window"),
						run: () => this._hostService.reload()
					}],
					{
						sticky: true,
						priority: NotificationPriority.URGENT
					}
				);
			}, 10000);
		}

		// Initialize extension host process with hand shakes
		const protocol = await this._establishProtocol(this._extensionHostProcess, opts);
		await this._performHandshake(protocol);
		clearTimeout(startupTimeoutHandle);
		return protocol;
	}

	/**
	 * Find a free port if extension host debugging is enabled.
	 */
	private async _tryFindDebugPort(): Promise<number> {

		if (typeof this._environmentService.debugExtensionHost.port !== 'number') {
			return 0;
		}

		const expected = this._environmentService.debugExtensionHost.port;
		const port = await this._nativeHostService.findFreePort(expected, 10 /* try 10 ports */, 5000 /* try up to 5 seconds */, 2048 /* skip 2048 ports between attempts */);

		if (!this._isExtensionDevTestFromCli) {
			if (!port) {
				console.warn('%c[Extension Host] %cCould not find a free port for debugging', 'color: blue', 'color:');
			} else {
				if (port !== expected) {
					console.warn(`%c[Extension Host] %cProvided debugging port ${expected} is not free, using ${port} instead.`, 'color: blue', 'color:');
				}
				if (this._isExtensionDevDebugBrk) {
					console.warn(`%c[Extension Host] %cSTOPPED on first line for debugging on port ${port}`, 'color: blue', 'color:');
				} else {
					console.debug(`%c[Extension Host] %cdebugger listening on port ${port}`, 'color: blue', 'color:');
				}
			}
		}

		return port || 0;
	}

	private _establishProtocol(extensionHostProcess: ExtensionHostProcess, opts: IExtensionHostProcessOptions): Promise<IMessagePassingProtocol> {

		writeExtHostConnection(new MessagePortExtHostConnection(), opts.env);

		// Get ready to acquire the message port from the shared process worker
		const portPromise = acquirePort(undefined /* we trigger the request via service call! */, opts.responseChannel, opts.responseNonce);

		return new Promise<IMessagePassingProtocol>((resolve, reject) => {

			const handle = setTimeout(() => {
				reject('The local extension host took longer than 60s to connect.');
			}, 60 * 1000);

			portPromise.then((port) => {
				this._register(toDisposable(() => {
					// Close the message port when the extension host is disposed
					port.close();
					port.onmessage = null;
				}));
				clearTimeout(handle);

				const onMessage = new BufferedEmitter<VSBuffer>();
				port.onmessage = ((e) => {
					if (e.data) {
						onMessage.fire(VSBuffer.wrap(e.data));
					}
				});
				port.start();

				resolve({
					onMessage: onMessage.event,
					send: message => port.postMessage(message.buffer),
				});
			});

			// Now that the message port listener is installed, start the ext host process
			const sw = StopWatch.create(false);
			extensionHostProcess.start(opts).then(({ pid }) => {
				if (pid) {
					this.pid = pid;
				}
				this._logService.info(`Started local extension host with pid ${pid}.`);
				const duration = sw.elapsed();
				if (platform.isCI) {
					this._logService.info(`IExtensionHostStarter.start() took ${duration} ms.`);
				}
			}, (err) => {
				// Starting the ext host process resulted in an error
				reject(err);
			});
		});
	}

	private _performHandshake(protocol: IMessagePassingProtocol): Promise<void> {
		// 1) wait for the incoming `ready` event and send the initialization data.
		// 2) wait for the incoming `initialized` event.
		return new Promise<void>((resolve, reject) => {

			let timeoutHandle: Timeout;
			const installTimeoutCheck = () => {
				timeoutHandle = setTimeout(() => {
					reject('The local extension host took longer than 60s to send its ready message.');
				}, 60 * 1000);
			};
			const uninstallTimeoutCheck = () => {
				clearTimeout(timeoutHandle);
			};

			// Wait 60s for the ready message
			installTimeoutCheck();

			const disposable = protocol.onMessage(msg => {

				if (isMessageOfType(msg, MessageType.Ready)) {

					// 1) Extension Host is ready to receive messages, initialize it
					uninstallTimeoutCheck();

					this._createExtHostInitData().then(data => {

						// Wait 60s for the initialized message
						installTimeoutCheck();

						protocol.send(VSBuffer.fromString(JSON.stringify(data)));
					});
					return;
				}

				if (isMessageOfType(msg, MessageType.Initialized)) {

					// 2) Extension Host is initialized
					uninstallTimeoutCheck();

					// stop listening for messages here
					disposable.dispose();

					// release this promise
					resolve();
					return;
				}

				console.error(`received unexpected message during handshake phase from the extension host: `, msg);
			});

		});
	}

	private async _createExtHostInitData(): Promise<IExtensionHostInitData> {
		const initData = await this._initDataProvider.getInitData();
		this.extensions = initData.extensions;
		const workspace = this._contextService.getWorkspace();
		return {
			commit: this._productService.commit,
			version: this._productService.version,
			quality: this._productService.quality,
			date: this._productService.date,
			parentPid: 0,
			environment: {
				isExtensionDevelopmentDebug: this._isExtensionDevDebug,
				appRoot: this._environmentService.appRoot ? URI.file(this._environmentService.appRoot) : undefined,
				appName: this._productService.nameLong,
				appHost: this._productService.embedderIdentifier || 'desktop',
				appUriScheme: this._productService.urlProtocol,
				isExtensionTelemetryLoggingOnly: isLoggingOnly(this._productService, this._environmentService),
				appLanguage: platform.language,
				extensionDevelopmentLocationURI: this._environmentService.extensionDevelopmentLocationURI,
				extensionTestsLocationURI: this._environmentService.extensionTestsLocationURI,
				globalStorageHome: this._userDataProfilesService.defaultProfile.globalStorageHome,
				workspaceStorageHome: this._environmentService.workspaceStorageHome,
				extensionLogLevel: this._environmentService.extensionLogLevel
			},
			workspace: this._contextService.getWorkbenchState() === WorkbenchState.EMPTY ? undefined : {
				configuration: workspace.configuration ?? undefined,
				id: workspace.id,
				name: this._labelService.getWorkspaceLabel(workspace),
				isUntitled: workspace.configuration ? isUntitledWorkspace(workspace.configuration, this._environmentService) : false,
				transient: workspace.transient
			},
			remote: {
				authority: this._environmentService.remoteAuthority,
				connectionData: null,
				isRemote: false
			},
			consoleForward: {
				includeStack: !this._isExtensionDevTestFromCli && (this._isExtensionDevHost || !this._environmentService.isBuilt || this._productService.quality !== 'stable' || this._environmentService.verbose),
				logNative: !this._isExtensionDevTestFromCli && this._isExtensionDevHost
			},
			extensions: this.extensions.toSnapshot(),
			telemetryInfo: {
				sessionId: this._telemetryService.sessionId,
				machineId: this._telemetryService.machineId,
				sqmId: this._telemetryService.sqmId,
				devDeviceId: this._telemetryService.devDeviceId ?? this._telemetryService.machineId,
				firstSessionDate: this._telemetryService.firstSessionDate,
				msftInternal: this._telemetryService.msftInternal
			},
			logLevel: this._logService.getLevel(),
			loggers: [...this._loggerService.getRegisteredLoggers()],
			logsLocation: this._environmentService.extHostLogsPath,
			autoStart: (this.startup === ExtensionHostStartup.EagerAutoStart),
			uiKind: UIKind.Desktop,
			handle: this._environmentService.window.handle ? encodeBase64(this._environmentService.window.handle) : undefined
		};
	}

	private _onExtHostProcessExit(code: number, signal: string): void {
		if (this._terminating) {
			// Expected termination path (we asked the process to terminate)
			return;
		}

		this._onExit.fire([code, signal]);
	}

	private _handleProcessOutputStream(stream: Event<string>) {
		let last = '';
		let isOmitting = false;
		const event = new Emitter<string>();
		stream((chunk) => {
			// not a fancy approach, but this is the same approach used by the split2
			// module which is well-optimized (https://github.com/mcollina/split2)
			last += chunk;
			const lines = last.split(/\r?\n/g);
			last = lines.pop()!;

			// protected against an extension spamming and leaking memory if no new line is written.
			if (last.length > 10_000) {
				lines.push(last);
				last = '';
			}

			for (const line of lines) {
				if (isOmitting) {
					if (line === NativeLogMarkers.End) {
						isOmitting = false;
					}
				} else if (line === NativeLogMarkers.Start) {
					isOmitting = true;
				} else if (line.length) {
					event.fire(line + '\n');
				}
			}
		}, undefined, this._store);

		return event;
	}

	public async enableInspectPort(): Promise<boolean> {
		if (!!this._inspectListener) {
			return true;
		}

		if (!this._extensionHostProcess) {
			return false;
		}

		const result = await this._extensionHostProcess.enableInspectPort();
		if (!result) {
			return false;
		}

		await Promise.race([Event.toPromise(this._onDidSetInspectPort.event), timeout(1000)]);
		return !!this._inspectListener;
	}

	public getInspectPort(): IExtensionInspectInfo | undefined {
		return this._inspectListener ?? undefined;
	}

	private _onWillShutdown(event: WillShutdownEvent): void {
		// If the extension development host was started without debugger attached we need
		// to communicate this back to the main side to terminate the debug session
		if (this._isExtensionDevHost && !this._isExtensionDevTestFromCli && !this._isExtensionDevDebug && this._environmentService.debugExtensionHost.debugId) {
			this._extensionHostDebugService.terminateSession(this._environmentService.debugExtensionHost.debugId);
			event.join(timeout(100 /* wait a bit for IPC to get delivered */), { id: 'join.extensionDevelopment', label: nls.localize('join.extensionDevelopment', "Terminating extension debug session") });
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensions/electron-browser/nativeExtensionService.ts]---
Location: vscode-main/src/vs/workbench/services/extensions/electron-browser/nativeExtensionService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { runWhenWindowIdle } from '../../../../base/browser/dom.js';
import { mainWindow } from '../../../../base/browser/window.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Schemas } from '../../../../base/common/network.js';
import * as performance from '../../../../base/common/performance.js';
import { isCI } from '../../../../base/common/platform.js';
import { URI } from '../../../../base/common/uri.js';
import * as nls from '../../../../nls.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { Action2, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { ExtensionKind } from '../../../../platform/environment/common/environment.js';
import { IExtensionGalleryService } from '../../../../platform/extensionManagement/common/extensionManagement.js';
import { ExtensionIdentifier, IExtensionDescription } from '../../../../platform/extensions/common/extensions.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { INativeHostService } from '../../../../platform/native/common/native.js';
import { INotificationService, IPromptChoice, NotificationPriority, Severity } from '../../../../platform/notification/common/notification.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { PersistentConnectionEventType } from '../../../../platform/remote/common/remoteAgentConnection.js';
import { IRemoteAgentEnvironment } from '../../../../platform/remote/common/remoteAgentEnvironment.js';
import { IRemoteAuthorityResolverService, RemoteAuthorityResolverError, RemoteConnectionType, ResolverResult, getRemoteAuthorityPrefix } from '../../../../platform/remote/common/remoteAuthorityResolver.js';
import { IRemoteExtensionsScannerService } from '../../../../platform/remote/common/remoteExtensionsScanner.js';
import { getRemoteName, parseAuthorityWithPort } from '../../../../platform/remote/common/remoteHosts.js';
import { updateProxyConfigurationsScope } from '../../../../platform/request/common/request.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { IWorkspaceTrustManagementService } from '../../../../platform/workspace/common/workspaceTrust.js';
import { IWorkbenchEnvironmentService } from '../../environment/common/environmentService.js';
import { EnablementState, IWorkbenchExtensionEnablementService, IWorkbenchExtensionManagementService } from '../../extensionManagement/common/extensionManagement.js';
import { IWebWorkerExtensionHostDataProvider, IWebWorkerExtensionHostInitData, WebWorkerExtensionHost } from '../browser/webWorkerExtensionHost.js';
import { AbstractExtensionService, ExtensionHostCrashTracker, IExtensionHostFactory, LocalExtensions, RemoteExtensions, ResolvedExtensions, ResolverExtensions, checkEnabledAndProposedAPI, extensionIsEnabled, isResolverExtension } from '../common/abstractExtensionService.js';
import { ExtensionDescriptionRegistrySnapshot } from '../common/extensionDescriptionRegistry.js';
import { parseExtensionDevOptions } from '../common/extensionDevOptions.js';
import { ExtensionHostKind, ExtensionRunningPreference, IExtensionHostKindPicker, extensionHostKindToString, extensionRunningPreferenceToString } from '../common/extensionHostKind.js';
import { IExtensionHostManager } from '../common/extensionHostManagers.js';
import { ExtensionHostExitCode } from '../common/extensionHostProtocol.js';
import { IExtensionManifestPropertiesService } from '../common/extensionManifestPropertiesService.js';
import { ExtensionRunningLocation, LocalProcessRunningLocation, LocalWebWorkerRunningLocation } from '../common/extensionRunningLocation.js';
import { ExtensionRunningLocationTracker, filterExtensionDescriptions } from '../common/extensionRunningLocationTracker.js';
import { ExtensionHostExtensions, ExtensionHostStartup, IExtensionHost, IExtensionService, WebWorkerExtHostConfigValue, toExtension, webWorkerExtHostConfig } from '../common/extensions.js';
import { ExtensionsProposedApi } from '../common/extensionsProposedApi.js';
import { IRemoteExtensionHostDataProvider, IRemoteExtensionHostInitData, RemoteExtensionHost } from '../common/remoteExtensionHost.js';
import { CachedExtensionScanner } from './cachedExtensionScanner.js';
import { ILocalProcessExtensionHostDataProvider, ILocalProcessExtensionHostInitData, NativeLocalProcessExtensionHost } from './localProcessExtensionHost.js';
import { IHostService } from '../../host/browser/host.js';
import { ILifecycleService, LifecyclePhase } from '../../lifecycle/common/lifecycle.js';
import { IRemoteAgentService } from '../../remote/common/remoteAgentService.js';
import { IRemoteExplorerService } from '../../remote/common/remoteExplorerService.js';
import { AsyncIterableEmitter, AsyncIterableProducer } from '../../../../base/common/async.js';

export class NativeExtensionService extends AbstractExtensionService implements IExtensionService {

	private readonly _extensionScanner: CachedExtensionScanner;
	private readonly _localCrashTracker = new ExtensionHostCrashTracker();

	constructor(
		@IInstantiationService instantiationService: IInstantiationService,
		@INotificationService notificationService: INotificationService,
		@IWorkbenchEnvironmentService environmentService: IWorkbenchEnvironmentService,
		@ITelemetryService telemetryService: ITelemetryService,
		@IWorkbenchExtensionEnablementService extensionEnablementService: IWorkbenchExtensionEnablementService,
		@IFileService fileService: IFileService,
		@IProductService productService: IProductService,
		@IWorkbenchExtensionManagementService extensionManagementService: IWorkbenchExtensionManagementService,
		@IWorkspaceContextService contextService: IWorkspaceContextService,
		@IConfigurationService configurationService: IConfigurationService,
		@IExtensionManifestPropertiesService extensionManifestPropertiesService: IExtensionManifestPropertiesService,
		@ILogService logService: ILogService,
		@IRemoteAgentService remoteAgentService: IRemoteAgentService,
		@IRemoteExtensionsScannerService remoteExtensionsScannerService: IRemoteExtensionsScannerService,
		@ILifecycleService lifecycleService: ILifecycleService,
		@IRemoteAuthorityResolverService remoteAuthorityResolverService: IRemoteAuthorityResolverService,
		@INativeHostService private readonly _nativeHostService: INativeHostService,
		@IHostService private readonly _hostService: IHostService,
		@IRemoteExplorerService private readonly _remoteExplorerService: IRemoteExplorerService,
		@IExtensionGalleryService private readonly _extensionGalleryService: IExtensionGalleryService,
		@IWorkspaceTrustManagementService private readonly _workspaceTrustManagementService: IWorkspaceTrustManagementService,
		@IDialogService dialogService: IDialogService,
	) {
		const extensionsProposedApi = instantiationService.createInstance(ExtensionsProposedApi);
		const extensionScanner = instantiationService.createInstance(CachedExtensionScanner);
		const extensionHostFactory = new NativeExtensionHostFactory(
			extensionsProposedApi,
			extensionScanner,
			() => this._getExtensionRegistrySnapshotWhenReady(),
			instantiationService,
			environmentService,
			extensionEnablementService,
			configurationService,
			remoteAgentService,
			remoteAuthorityResolverService,
			logService
		);
		super(
			{ hasLocalProcess: true, allowRemoteExtensionsInLocalWebWorker: false },
			extensionsProposedApi,
			extensionHostFactory,
			new NativeExtensionHostKindPicker(environmentService, configurationService, logService),
			instantiationService,
			notificationService,
			environmentService,
			telemetryService,
			extensionEnablementService,
			fileService,
			productService,
			extensionManagementService,
			contextService,
			configurationService,
			extensionManifestPropertiesService,
			logService,
			remoteAgentService,
			remoteExtensionsScannerService,
			lifecycleService,
			remoteAuthorityResolverService,
			dialogService
		);

		this._extensionScanner = extensionScanner;

		// delay extension host creation and extension scanning
		// until the workbench is running. we cannot defer the
		// extension host more (LifecyclePhase.Restored) because
		// some editors require the extension host to restore
		// and this would result in a deadlock
		// see https://github.com/microsoft/vscode/issues/41322
		lifecycleService.when(LifecyclePhase.Ready).then(() => {
			// reschedule to ensure this runs after restoring viewlets, panels, and editors
			runWhenWindowIdle(mainWindow, () => {
				this._initialize();
			}, 50 /*max delay*/);
		});
	}

	private async _scanAllLocalExtensions(): Promise<IExtensionDescription[]> {
		return this._extensionScanner.scannedExtensions;
	}

	protected override _onExtensionHostCrashed(extensionHost: IExtensionHostManager, code: number, signal: string | null): void {

		const activatedExtensions: ExtensionIdentifier[] = [];
		const extensionsStatus = this.getExtensionsStatus();
		for (const key of Object.keys(extensionsStatus)) {
			const extensionStatus = extensionsStatus[key];
			if (extensionStatus.activationStarted && extensionHost.containsExtension(extensionStatus.id)) {
				activatedExtensions.push(extensionStatus.id);
			}
		}

		super._onExtensionHostCrashed(extensionHost, code, signal);

		if (extensionHost.kind === ExtensionHostKind.LocalProcess) {
			if (code === ExtensionHostExitCode.VersionMismatch) {
				this._notificationService.prompt(
					Severity.Error,
					nls.localize('extensionService.versionMismatchCrash', "Extension host cannot start: version mismatch."),
					[{
						label: nls.localize('relaunch', "Relaunch VS Code"),
						run: () => {
							this._instantiationService.invokeFunction((accessor) => {
								const hostService = accessor.get(IHostService);
								hostService.restart();
							});
						}
					}]
				);
				return;
			}

			this._logExtensionHostCrash(extensionHost);
			this._sendExtensionHostCrashTelemetry(code, signal, activatedExtensions);

			this._localCrashTracker.registerCrash();

			if (this._localCrashTracker.shouldAutomaticallyRestart()) {
				this._logService.info(`Automatically restarting the extension host.`);
				this._notificationService.status(nls.localize('extensionService.autoRestart', "The extension host terminated unexpectedly. Restarting..."), { hideAfter: 5000 });
				this.startExtensionHosts();
			} else {
				const choices: IPromptChoice[] = [];
				if (this._environmentService.isBuilt) {
					choices.push({
						label: nls.localize('startBisect', "Start Extension Bisect"),
						run: () => {
							this._instantiationService.invokeFunction(accessor => {
								const commandService = accessor.get(ICommandService);
								commandService.executeCommand('extension.bisect.start');
							});
						}
					});
				} else {
					choices.push({
						label: nls.localize('devTools', "Open Developer Tools"),
						run: () => this._nativeHostService.openDevTools()
					});
				}

				choices.push({
					label: nls.localize('restart', "Restart Extension Host"),
					run: () => this.startExtensionHosts()
				});

				if (this._environmentService.isBuilt) {
					choices.push({
						label: nls.localize('learnMore', "Learn More"),
						run: () => {
							this._instantiationService.invokeFunction(accessor => {
								const openerService = accessor.get(IOpenerService);
								openerService.open('https://aka.ms/vscode-extension-bisect');
							});
						}
					});
				}

				this._notificationService.prompt(Severity.Error, nls.localize('extensionService.crash', "Extension host terminated unexpectedly 3 times within the last 5 minutes."), choices);
			}
		}
	}

	private _sendExtensionHostCrashTelemetry(code: number, signal: string | null, activatedExtensions: ExtensionIdentifier[]): void {
		type ExtensionHostCrashClassification = {
			owner: 'alexdima';
			comment: 'The extension host has terminated unexpectedly';
			code: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The exit code of the extension host process.' };
			signal: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The signal that caused the extension host process to exit.' };
			extensionIds: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The list of loaded extensions.' };
		};
		type ExtensionHostCrashEvent = {
			code: number;
			signal: string | null;
			extensionIds: string[];
		};
		this._telemetryService.publicLog2<ExtensionHostCrashEvent, ExtensionHostCrashClassification>('extensionHostCrash', {
			code,
			signal,
			extensionIds: activatedExtensions.map(e => e.value)
		});

		for (const extensionId of activatedExtensions) {
			type ExtensionHostCrashExtensionClassification = {
				owner: 'alexdima';
				comment: 'The extension host has terminated unexpectedly';
				code: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The exit code of the extension host process.' };
				signal: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The signal that caused the extension host process to exit.' };
				extensionId: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The identifier of the extension.' };
			};
			type ExtensionHostCrashExtensionEvent = {
				code: number;
				signal: string | null;
				extensionId: string;
			};
			this._telemetryService.publicLog2<ExtensionHostCrashExtensionEvent, ExtensionHostCrashExtensionClassification>('extensionHostCrashExtension', {
				code,
				signal,
				extensionId: extensionId.value
			});
		}
	}

	// --- impl

	protected async _resolveAuthority(remoteAuthority: string): Promise<ResolverResult> {

		const authorityPlusIndex = remoteAuthority.indexOf('+');
		if (authorityPlusIndex === -1) {
			// This authority does not need to be resolved, simply parse the port number
			const { host, port } = parseAuthorityWithPort(remoteAuthority);
			return {
				authority: {
					authority: remoteAuthority,
					connectTo: {
						type: RemoteConnectionType.WebSocket,
						host,
						port
					},
					connectionToken: undefined
				}
			};
		}

		return this._resolveAuthorityOnExtensionHosts(ExtensionHostKind.LocalProcess, remoteAuthority);
	}

	private async _getCanonicalURI(remoteAuthority: string, uri: URI): Promise<URI> {

		const authorityPlusIndex = remoteAuthority.indexOf('+');
		if (authorityPlusIndex === -1) {
			// This authority does not use a resolver
			return uri;
		}

		const localProcessExtensionHosts = this._getExtensionHostManagers(ExtensionHostKind.LocalProcess);
		if (localProcessExtensionHosts.length === 0) {
			// no local process extension hosts
			throw new Error(`Cannot resolve canonical URI`);
		}

		const results = await Promise.all(localProcessExtensionHosts.map(extHost => extHost.getCanonicalURI(remoteAuthority, uri)));

		for (const result of results) {
			if (result) {
				return result;
			}
		}

		// we can only reach this if there was no resolver extension that can return the cannonical uri
		throw new Error(`Cannot get canonical URI because no extension is installed to resolve ${getRemoteAuthorityPrefix(remoteAuthority)}`);
	}

	protected _resolveExtensions(): AsyncIterable<ResolvedExtensions> {
		return new AsyncIterableProducer(emitter => this._doResolveExtensions(emitter));
	}

	private async _doResolveExtensions(emitter: AsyncIterableEmitter<ResolvedExtensions>): Promise<void> {
		this._extensionScanner.startScanningExtensions();

		const remoteAuthority = this._environmentService.remoteAuthority;

		let remoteEnv: IRemoteAgentEnvironment | null = null;
		let remoteExtensions: IExtensionDescription[] = [];

		if (remoteAuthority) {

			this._remoteAuthorityResolverService._setCanonicalURIProvider(async (uri) => {
				if (uri.scheme !== Schemas.vscodeRemote || uri.authority !== remoteAuthority) {
					// The current remote authority resolver cannot give the canonical URI for this URI
					return uri;
				}
				performance.mark(`code/willGetCanonicalURI/${getRemoteAuthorityPrefix(remoteAuthority)}`);
				if (isCI) {
					this._logService.info(`Invoking getCanonicalURI for authority ${getRemoteAuthorityPrefix(remoteAuthority)}...`);
				}
				try {
					return this._getCanonicalURI(remoteAuthority, uri);
				} finally {
					performance.mark(`code/didGetCanonicalURI/${getRemoteAuthorityPrefix(remoteAuthority)}`);
					if (isCI) {
						this._logService.info(`getCanonicalURI returned for authority ${getRemoteAuthorityPrefix(remoteAuthority)}.`);
					}
				}
			});

			if (isCI) {
				this._logService.info(`Starting to wait on IWorkspaceTrustManagementService.workspaceResolved...`);
			}

			// Now that the canonical URI provider has been registered, we need to wait for the trust state to be
			// calculated. The trust state will be used while resolving the authority, however the resolver can
			// override the trust state through the resolver result.
			await this._workspaceTrustManagementService.workspaceResolved;

			if (isCI) {
				this._logService.info(`Finished waiting on IWorkspaceTrustManagementService.workspaceResolved.`);
			}

			const localExtensions = await this._scanAllLocalExtensions();
			const resolverExtensions = localExtensions.filter(extension => isResolverExtension(extension));
			if (resolverExtensions.length) {
				emitter.emitOne(new ResolverExtensions(resolverExtensions));
			}

			let resolverResult: ResolverResult;
			try {
				resolverResult = await this._resolveAuthorityInitial(remoteAuthority);
			} catch (err) {
				if (RemoteAuthorityResolverError.isNoResolverFound(err)) {
					err.isHandled = await this._handleNoResolverFound(remoteAuthority);
				} else {
					if (RemoteAuthorityResolverError.isHandled(err)) {
						console.log(`Error handled: Not showing a notification for the error`);
					}
				}
				this._remoteAuthorityResolverService._setResolvedAuthorityError(remoteAuthority, err);

				// Proceed with the local extension host
				return this._startLocalExtensionHost(emitter);
			}

			// set the resolved authority
			this._remoteAuthorityResolverService._setResolvedAuthority(resolverResult.authority, resolverResult.options);
			this._remoteExplorerService.setTunnelInformation(resolverResult.tunnelInformation);

			// monitor for breakage
			const connection = this._remoteAgentService.getConnection();
			if (connection) {
				this._register(connection.onDidStateChange(async (e) => {
					if (e.type === PersistentConnectionEventType.ConnectionLost) {
						this._remoteAuthorityResolverService._clearResolvedAuthority(remoteAuthority);
					}
				}));
				this._register(connection.onReconnecting(() => this._resolveAuthorityAgain()));
			}

			// fetch the remote environment
			[remoteEnv, remoteExtensions] = await Promise.all([
				this._remoteAgentService.getEnvironment(),
				this._remoteExtensionsScannerService.scanExtensions()
			]);

			if (!remoteEnv) {
				this._notificationService.notify({ severity: Severity.Error, message: nls.localize('getEnvironmentFailure', "Could not fetch remote environment") });
				// Proceed with the local extension host
				return this._startLocalExtensionHost(emitter);
			}

			const useHostProxyDefault = remoteEnv.useHostProxy;
			this._register(this._configurationService.onDidChangeConfiguration(e => {
				if (e.affectsConfiguration('http.useLocalProxyConfiguration')) {
					updateProxyConfigurationsScope(this._configurationService.getValue('http.useLocalProxyConfiguration'), useHostProxyDefault);
				}
			}));
			updateProxyConfigurationsScope(this._configurationService.getValue('http.useLocalProxyConfiguration'), useHostProxyDefault);
		} else {

			this._remoteAuthorityResolverService._setCanonicalURIProvider(async (uri) => uri);

		}

		return this._startLocalExtensionHost(emitter, remoteExtensions);
	}

	private async _startLocalExtensionHost(emitter: AsyncIterableEmitter<ResolvedExtensions>, remoteExtensions: IExtensionDescription[] = []): Promise<void> {
		// Ensure that the workspace trust state has been fully initialized so
		// that the extension host can start with the correct set of extensions.
		await this._workspaceTrustManagementService.workspaceTrustInitialized;

		if (remoteExtensions.length) {
			emitter.emitOne(new RemoteExtensions(remoteExtensions));
		}

		emitter.emitOne(new LocalExtensions(await this._scanAllLocalExtensions()));
	}

	protected async _onExtensionHostExit(code: number): Promise<void> {
		// Dispose everything associated with the extension host
		await this._doStopExtensionHosts();

		// Dispose the management connection to avoid reconnecting after the extension host exits
		const connection = this._remoteAgentService.getConnection();
		connection?.dispose();

		if (parseExtensionDevOptions(this._environmentService).isExtensionDevTestFromCli) {
			// When CLI testing make sure to exit with proper exit code
			if (isCI) {
				this._logService.info(`Asking native host service to exit with code ${code}.`);
			}
			this._nativeHostService.exit(code);
		} else {
			// Expected development extension termination: When the extension host goes down we also shutdown the window
			this._nativeHostService.closeWindow();
		}
	}

	private async _handleNoResolverFound(remoteAuthority: string): Promise<boolean> {
		const remoteName = getRemoteName(remoteAuthority);
		const recommendation = this._productService.remoteExtensionTips?.[remoteName];
		if (!recommendation) {
			return false;
		}

		const resolverExtensionId = recommendation.extensionId;
		const allExtensions = await this._scanAllLocalExtensions();
		const extension = allExtensions.filter(e => e.identifier.value === resolverExtensionId)[0];
		if (extension) {
			if (!extensionIsEnabled(this._logService, this._extensionEnablementService, extension, false)) {
				const message = nls.localize('enableResolver', "Extension '{0}' is required to open the remote window.\nOK to enable?", recommendation.friendlyName);
				this._notificationService.prompt(Severity.Info, message,
					[{
						label: nls.localize('enable', 'Enable and Reload'),
						run: async () => {
							await this._extensionEnablementService.setEnablement([toExtension(extension)], EnablementState.EnabledGlobally);
							await this._hostService.reload();
						}
					}],
					{
						sticky: true,
						priority: NotificationPriority.URGENT
					}
				);
			}
		} else {
			// Install the Extension and reload the window to handle.
			const message = nls.localize('installResolver', "Extension '{0}' is required to open the remote window.\nDo you want to install the extension?", recommendation.friendlyName);
			this._notificationService.prompt(Severity.Info, message,
				[{
					label: nls.localize('install', 'Install and Reload'),
					run: async () => {
						const [galleryExtension] = await this._extensionGalleryService.getExtensions([{ id: resolverExtensionId }], CancellationToken.None);
						if (galleryExtension) {
							await this._extensionManagementService.installFromGallery(galleryExtension);
							await this._hostService.reload();
						} else {
							this._notificationService.error(nls.localize('resolverExtensionNotFound', "`{0}` not found on marketplace"));
						}

					}
				}],
				{
					sticky: true,
					priority: NotificationPriority.URGENT,
				}
			);

		}
		return true;
	}
}

class NativeExtensionHostFactory implements IExtensionHostFactory {

	private readonly _webWorkerExtHostEnablement: LocalWebWorkerExtHostEnablement;

	constructor(
		private readonly _extensionsProposedApi: ExtensionsProposedApi,
		private readonly _extensionScanner: CachedExtensionScanner,
		private readonly _getExtensionRegistrySnapshotWhenReady: () => Promise<ExtensionDescriptionRegistrySnapshot>,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IWorkbenchEnvironmentService environmentService: IWorkbenchEnvironmentService,
		@IWorkbenchExtensionEnablementService private readonly _extensionEnablementService: IWorkbenchExtensionEnablementService,
		@IConfigurationService configurationService: IConfigurationService,
		@IRemoteAgentService private readonly _remoteAgentService: IRemoteAgentService,
		@IRemoteAuthorityResolverService private readonly _remoteAuthorityResolverService: IRemoteAuthorityResolverService,
		@ILogService private readonly _logService: ILogService,
	) {
		this._webWorkerExtHostEnablement = determineLocalWebWorkerExtHostEnablement(environmentService, configurationService);
	}

	public createExtensionHost(runningLocations: ExtensionRunningLocationTracker, runningLocation: ExtensionRunningLocation, isInitialStart: boolean): IExtensionHost | null {
		switch (runningLocation.kind) {
			case ExtensionHostKind.LocalProcess: {
				const startup = (
					isInitialStart
						? ExtensionHostStartup.EagerManualStart
						: ExtensionHostStartup.EagerAutoStart
				);
				return this._instantiationService.createInstance(NativeLocalProcessExtensionHost, runningLocation, startup, this._createLocalProcessExtensionHostDataProvider(runningLocations, isInitialStart, runningLocation));
			}
			case ExtensionHostKind.LocalWebWorker: {
				if (this._webWorkerExtHostEnablement !== LocalWebWorkerExtHostEnablement.Disabled) {
					const startup = this._webWorkerExtHostEnablement === LocalWebWorkerExtHostEnablement.Lazy ? ExtensionHostStartup.LazyAutoStart : ExtensionHostStartup.EagerManualStart;
					return this._instantiationService.createInstance(WebWorkerExtensionHost, runningLocation, startup, this._createWebWorkerExtensionHostDataProvider(runningLocations, runningLocation));
				}
				return null;
			}
			case ExtensionHostKind.Remote: {
				const remoteAgentConnection = this._remoteAgentService.getConnection();
				if (remoteAgentConnection) {
					return this._instantiationService.createInstance(RemoteExtensionHost, runningLocation, this._createRemoteExtensionHostDataProvider(runningLocations, remoteAgentConnection.remoteAuthority));
				}
				return null;
			}
		}
	}

	private _createLocalProcessExtensionHostDataProvider(runningLocations: ExtensionRunningLocationTracker, isInitialStart: boolean, desiredRunningLocation: LocalProcessRunningLocation): ILocalProcessExtensionHostDataProvider {
		return {
			getInitData: async (): Promise<ILocalProcessExtensionHostInitData> => {
				if (isInitialStart) {
					// Here we load even extensions that would be disabled by workspace trust
					const scannedExtensions = await this._extensionScanner.scannedExtensions;
					if (isCI) {
						this._logService.info(`NativeExtensionHostFactory._createLocalProcessExtensionHostDataProvider.scannedExtensions: ${scannedExtensions.map(ext => ext.identifier.value).join(',')}`);
					}

					const localExtensions = checkEnabledAndProposedAPI(this._logService, this._extensionEnablementService, this._extensionsProposedApi, scannedExtensions, /* ignore workspace trust */true);
					if (isCI) {
						this._logService.info(`NativeExtensionHostFactory._createLocalProcessExtensionHostDataProvider.localExtensions: ${localExtensions.map(ext => ext.identifier.value).join(',')}`);
					}

					const runningLocation = runningLocations.computeRunningLocation(localExtensions, [], false);
					const myExtensions = filterExtensionDescriptions(localExtensions, runningLocation, extRunningLocation => desiredRunningLocation.equals(extRunningLocation));
					const extensions = new ExtensionHostExtensions(0, localExtensions, myExtensions.map(extension => extension.identifier));
					if (isCI) {
						this._logService.info(`NativeExtensionHostFactory._createLocalProcessExtensionHostDataProvider.myExtensions: ${myExtensions.map(ext => ext.identifier.value).join(',')}`);
					}
					return { extensions };
				} else {
					// restart case
					const snapshot = await this._getExtensionRegistrySnapshotWhenReady();
					const myExtensions = runningLocations.filterByRunningLocation(snapshot.extensions, desiredRunningLocation);
					const extensions = new ExtensionHostExtensions(snapshot.versionId, snapshot.extensions, myExtensions.map(extension => extension.identifier));
					return { extensions };
				}
			}
		};
	}

	private _createWebWorkerExtensionHostDataProvider(runningLocations: ExtensionRunningLocationTracker, desiredRunningLocation: LocalWebWorkerRunningLocation): IWebWorkerExtensionHostDataProvider {
		return {
			getInitData: async (): Promise<IWebWorkerExtensionHostInitData> => {
				const snapshot = await this._getExtensionRegistrySnapshotWhenReady();
				const myExtensions = runningLocations.filterByRunningLocation(snapshot.extensions, desiredRunningLocation);
				const extensions = new ExtensionHostExtensions(snapshot.versionId, snapshot.extensions, myExtensions.map(extension => extension.identifier));
				return { extensions };
			}
		};
	}

	private _createRemoteExtensionHostDataProvider(runningLocations: ExtensionRunningLocationTracker, remoteAuthority: string): IRemoteExtensionHostDataProvider {
		return {
			remoteAuthority: remoteAuthority,
			getInitData: async (): Promise<IRemoteExtensionHostInitData> => {
				const snapshot = await this._getExtensionRegistrySnapshotWhenReady();

				const remoteEnv = await this._remoteAgentService.getEnvironment();
				if (!remoteEnv) {
					throw new Error('Cannot provide init data for remote extension host!');
				}

				const myExtensions = runningLocations.filterByExtensionHostKind(snapshot.extensions, ExtensionHostKind.Remote);
				const extensions = new ExtensionHostExtensions(snapshot.versionId, snapshot.extensions, myExtensions.map(extension => extension.identifier));

				return {
					connectionData: this._remoteAuthorityResolverService.getConnectionData(remoteAuthority),
					pid: remoteEnv.pid,
					appRoot: remoteEnv.appRoot,
					extensionHostLogsPath: remoteEnv.extensionHostLogsPath,
					globalStorageHome: remoteEnv.globalStorageHome,
					workspaceStorageHome: remoteEnv.workspaceStorageHome,
					extensions,
				};
			}
		};
	}
}

function determineLocalWebWorkerExtHostEnablement(environmentService: IWorkbenchEnvironmentService, configurationService: IConfigurationService): LocalWebWorkerExtHostEnablement {
	if (environmentService.isExtensionDevelopment && environmentService.extensionDevelopmentKind?.some(k => k === 'web')) {
		return LocalWebWorkerExtHostEnablement.Eager;
	} else {
		const config = configurationService.getValue<WebWorkerExtHostConfigValue>(webWorkerExtHostConfig);
		if (config === true) {
			return LocalWebWorkerExtHostEnablement.Eager;
		} else if (config === 'auto') {
			return LocalWebWorkerExtHostEnablement.Lazy;
		} else {
			return LocalWebWorkerExtHostEnablement.Disabled;
		}
	}
}

const enum LocalWebWorkerExtHostEnablement {
	Disabled = 0,
	Eager = 1,
	Lazy = 2
}

export class NativeExtensionHostKindPicker implements IExtensionHostKindPicker {

	private readonly _hasRemoteExtHost: boolean;
	private readonly _hasWebWorkerExtHost: boolean;

	constructor(
		@IWorkbenchEnvironmentService environmentService: IWorkbenchEnvironmentService,
		@IConfigurationService configurationService: IConfigurationService,
		@ILogService private readonly _logService: ILogService,
	) {
		this._hasRemoteExtHost = Boolean(environmentService.remoteAuthority);
		const webWorkerExtHostEnablement = determineLocalWebWorkerExtHostEnablement(environmentService, configurationService);
		this._hasWebWorkerExtHost = (webWorkerExtHostEnablement !== LocalWebWorkerExtHostEnablement.Disabled);
	}

	public pickExtensionHostKind(extensionId: ExtensionIdentifier, extensionKinds: ExtensionKind[], isInstalledLocally: boolean, isInstalledRemotely: boolean, preference: ExtensionRunningPreference): ExtensionHostKind | null {
		const result = NativeExtensionHostKindPicker.pickExtensionHostKind(extensionKinds, isInstalledLocally, isInstalledRemotely, preference, this._hasRemoteExtHost, this._hasWebWorkerExtHost);
		this._logService.trace(`pickRunningLocation for ${extensionId.value}, extension kinds: [${extensionKinds.join(', ')}], isInstalledLocally: ${isInstalledLocally}, isInstalledRemotely: ${isInstalledRemotely}, preference: ${extensionRunningPreferenceToString(preference)} => ${extensionHostKindToString(result)}`);
		return result;
	}

	public static pickExtensionHostKind(extensionKinds: ExtensionKind[], isInstalledLocally: boolean, isInstalledRemotely: boolean, preference: ExtensionRunningPreference, hasRemoteExtHost: boolean, hasWebWorkerExtHost: boolean): ExtensionHostKind | null {
		const result: ExtensionHostKind[] = [];
		for (const extensionKind of extensionKinds) {
			if (extensionKind === 'ui' && isInstalledLocally) {
				// ui extensions run locally if possible
				if (preference === ExtensionRunningPreference.None || preference === ExtensionRunningPreference.Local) {
					return ExtensionHostKind.LocalProcess;
				} else {
					result.push(ExtensionHostKind.LocalProcess);
				}
			}
			if (extensionKind === 'workspace' && isInstalledRemotely) {
				// workspace extensions run remotely if possible
				if (preference === ExtensionRunningPreference.None || preference === ExtensionRunningPreference.Remote) {
					return ExtensionHostKind.Remote;
				} else {
					result.push(ExtensionHostKind.Remote);
				}
			}
			if (extensionKind === 'workspace' && !hasRemoteExtHost) {
				// workspace extensions also run locally if there is no remote
				if (preference === ExtensionRunningPreference.None || preference === ExtensionRunningPreference.Local) {
					return ExtensionHostKind.LocalProcess;
				} else {
					result.push(ExtensionHostKind.LocalProcess);
				}
			}
			if (extensionKind === 'web' && isInstalledLocally && hasWebWorkerExtHost) {
				// web worker extensions run in the local web worker if possible
				if (preference === ExtensionRunningPreference.None || preference === ExtensionRunningPreference.Local) {
					return ExtensionHostKind.LocalWebWorker;
				} else {
					result.push(ExtensionHostKind.LocalWebWorker);
				}
			}
		}
		return (result.length > 0 ? result[0] : null);
	}
}

class RestartExtensionHostAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.restartExtensionHost',
			title: nls.localize2('restartExtensionHost', "Restart Extension Host"),
			category: Categories.Developer,
			f1: true
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const extensionService = accessor.get(IExtensionService);

		const stopped = await extensionService.stopExtensionHosts(nls.localize('restartExtensionHost.reason', "An explicit request"));
		if (stopped) {
			extensionService.startExtensionHosts();
		}
	}
}

registerAction2(RestartExtensionHostAction);

registerSingleton(IExtensionService, NativeExtensionService, InstantiationType.Eager);
```

--------------------------------------------------------------------------------

````
