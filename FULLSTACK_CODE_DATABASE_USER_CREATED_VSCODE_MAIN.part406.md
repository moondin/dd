---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 406
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 406 of 552)

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

---[FILE: src/vs/workbench/contrib/mcp/browser/mcpElicitationService.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/browser/mcpElicitationService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Action } from '../../../../base/common/actions.js';
import { assertNever, softAssertNever } from '../../../../base/common/assert.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { CancellationError } from '../../../../base/common/errors.js';
import { MarkdownString } from '../../../../base/common/htmlContent.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { autorun } from '../../../../base/common/observable.js';
import { isDefined } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import { localize } from '../../../../nls.js';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IQuickInputService, IQuickPick, IQuickPickItem } from '../../../../platform/quickinput/common/quickInput.js';
import { ChatElicitationRequestPart } from '../../chat/browser/chatElicitationRequestPart.js';
import { ChatModel } from '../../chat/common/chatModel.js';
import { ElicitationState, IChatService } from '../../chat/common/chatService.js';
import { LocalChatSessionUri } from '../../chat/common/chatUri.js';
import { ElicitationKind, ElicitResult, IFormModeElicitResult, IMcpElicitationService, IMcpServer, IMcpToolCallContext, IUrlModeElicitResult, McpConnectionState, MpcResponseError } from '../common/mcpTypes.js';
import { mcpServerToSourceData } from '../common/mcpTypesUtils.js';
import { MCP } from '../common/modelContextProtocol.js';

const noneItem: IQuickPickItem = { id: undefined, label: localize('mcp.elicit.enum.none', 'None'), description: localize('mcp.elicit.enum.none.description', 'No selection'), alwaysShow: true };

type Pre20251125ElicitationParams = Omit<MCP.ElicitRequestFormParams, 'mode'> & { mode?: undefined };

function isFormElicitation(params: MCP.ElicitRequest['params'] | Pre20251125ElicitationParams): params is (MCP.ElicitRequestFormParams | Pre20251125ElicitationParams) {
	return params.mode === 'form' || (params.mode === undefined && !!(params as Pre20251125ElicitationParams).requestedSchema);
}

function isUrlElicitation(params: MCP.ElicitRequest['params']): params is MCP.ElicitRequestURLParams {
	return params.mode === 'url';
}

function isLegacyTitledEnumSchema(schema: MCP.PrimitiveSchemaDefinition): schema is MCP.LegacyTitledEnumSchema & { enumNames: string[] } {
	const cast = schema as MCP.LegacyTitledEnumSchema;
	return cast.type === 'string' && Array.isArray(cast.enum) && Array.isArray(cast.enumNames);
}

function isUntitledEnumSchema(schema: MCP.PrimitiveSchemaDefinition): schema is MCP.LegacyTitledEnumSchema | MCP.UntitledSingleSelectEnumSchema {
	const cast = schema as MCP.LegacyTitledEnumSchema | MCP.UntitledSingleSelectEnumSchema;
	return cast.type === 'string' && Array.isArray(cast.enum);
}

function isTitledSingleEnumSchema(schema: MCP.PrimitiveSchemaDefinition): schema is MCP.TitledSingleSelectEnumSchema {
	const cast = schema as MCP.TitledSingleSelectEnumSchema;
	return cast.type === 'string' && Array.isArray(cast.oneOf);
}

function isUntitledMultiEnumSchema(schema: MCP.PrimitiveSchemaDefinition): schema is MCP.UntitledMultiSelectEnumSchema {
	const cast = schema as MCP.UntitledMultiSelectEnumSchema;
	return cast.type === 'array' && !!cast.items?.enum;
}

function isTitledMultiEnumSchema(schema: MCP.PrimitiveSchemaDefinition): schema is MCP.TitledMultiSelectEnumSchema {
	const cast = schema as MCP.TitledMultiSelectEnumSchema;
	return cast.type === 'array' && !!cast.items?.anyOf;
}

export class McpElicitationService implements IMcpElicitationService {
	declare readonly _serviceBrand: undefined;

	constructor(
		@INotificationService private readonly _notificationService: INotificationService,
		@IQuickInputService private readonly _quickInputService: IQuickInputService,
		@IChatService private readonly _chatService: IChatService,
		@IOpenerService private readonly _openerService: IOpenerService,
	) { }

	public elicit(server: IMcpServer, context: IMcpToolCallContext | undefined, elicitation: MCP.ElicitRequest['params'], token: CancellationToken): Promise<ElicitResult> {
		if (isFormElicitation(elicitation)) {
			return this._elicitForm(server, context, elicitation, token);
		} else if (isUrlElicitation(elicitation)) {
			return this._elicitUrl(server, context, elicitation, token);
		} else {
			softAssertNever(elicitation);
			return Promise.reject(new MpcResponseError('Unsupported elicitation type', MCP.INVALID_PARAMS, undefined));
		}
	}

	private async _elicitForm(server: IMcpServer, context: IMcpToolCallContext | undefined, elicitation: MCP.ElicitRequestFormParams | Pre20251125ElicitationParams, token: CancellationToken): Promise<IFormModeElicitResult> {
		const store = new DisposableStore();
		const value = await new Promise<MCP.ElicitResult>(resolve => {
			const chatModel = context?.chatSessionId && this._chatService.getSession(LocalChatSessionUri.forSession(context.chatSessionId));
			if (chatModel instanceof ChatModel) {
				const request = chatModel.getRequests().at(-1);
				if (request) {
					const part = new ChatElicitationRequestPart(
						localize('mcp.elicit.title', 'Request for Input'),
						elicitation.message,
						localize('msg.subtitle', "{0} (MCP Server)", server.definition.label),
						localize('mcp.elicit.accept', 'Respond'),
						localize('mcp.elicit.reject', 'Cancel'),
						async () => {
							const p = this._doElicitForm(elicitation, token);
							resolve(p);
							const result = await p;
							part.acceptedResult = result.content;
							return result.action === 'accept' ? ElicitationState.Accepted : ElicitationState.Rejected;
						},
						() => {
							resolve({ action: 'decline' });
							return Promise.resolve(ElicitationState.Rejected);
						},
						mcpServerToSourceData(server),
					);
					chatModel.acceptResponseProgress(request, part);
				}
			} else {
				const handle = this._notificationService.notify({
					message: elicitation.message,
					source: localize('mcp.elicit.source', 'MCP Server ({0})', server.definition.label),
					severity: Severity.Info,
					actions: {
						primary: [store.add(new Action('mcp.elicit.give', localize('mcp.elicit.give', 'Respond'), undefined, true, () => resolve(this._doElicitForm(elicitation, token))))],
						secondary: [store.add(new Action('mcp.elicit.cancel', localize('mcp.elicit.cancel', 'Cancel'), undefined, true, () => resolve({ action: 'decline' })))],
					}
				});
				store.add(handle.onDidClose(() => resolve({ action: 'cancel' })));
				store.add(token.onCancellationRequested(() => resolve({ action: 'cancel' })));
			}

		}).finally(() => store.dispose());

		return { kind: ElicitationKind.Form, value, dispose: () => { } };
	}

	private async _elicitUrl(server: IMcpServer, context: IMcpToolCallContext | undefined, elicitation: MCP.ElicitRequestURLParams, token: CancellationToken): Promise<IUrlModeElicitResult> {
		const promiseStore = new DisposableStore();

		// We create this ahead of time in case e.g. a user manually opens the URL beforehand
		const completePromise = new Promise<void>((resolve, reject) => {
			promiseStore.add(token.onCancellationRequested(() => reject(new CancellationError())));
			promiseStore.add(autorun(reader => {
				const cnx = server.connection.read(reader);
				const handler = cnx?.handler.read(reader);
				if (handler) {
					reader.store.add(handler.onDidReceiveElicitationCompleteNotification(e => {
						if (e.params.elicitationId === elicitation.elicitationId) {
							resolve();
						}
					}));
				} else if (!McpConnectionState.isRunning(server.connectionState.read(reader))) {
					reject(new CancellationError());
				}
			}));
		}).finally(() => promiseStore.dispose());

		const store = new DisposableStore();
		const value = await new Promise<MCP.ElicitResult>(resolve => {
			const chatModel = context?.chatSessionId && this._chatService.getSession(LocalChatSessionUri.forSession(context.chatSessionId));
			if (chatModel instanceof ChatModel) {
				const request = chatModel.getRequests().at(-1);
				if (request) {
					const part = new ChatElicitationRequestPart(
						localize('mcp.elicit.url.title', 'Authorization Required'),
						new MarkdownString().appendText(elicitation.message)
							.appendMarkdown('\n\n' + localize('mcp.elicit.url.instruction', 'Open this URL?'))
							.appendCodeblock('', elicitation.url),
						localize('msg.subtitle', "{0} (MCP Server)", server.definition.label),
						localize('mcp.elicit.url.open', 'Open {0}', URI.parse(elicitation.url).authority),
						localize('mcp.elicit.reject', 'Cancel'),
						async () => {
							const result = await this._doElicitUrl(elicitation, token);
							resolve(result);
							completePromise.then(() => part.hide());
							return result.action === 'accept' ? ElicitationState.Accepted : ElicitationState.Rejected;
						},
						() => {
							resolve({ action: 'decline' });
							return Promise.resolve(ElicitationState.Rejected);
						},
						mcpServerToSourceData(server),
					);
					chatModel.acceptResponseProgress(request, part);
				}
			} else {
				const handle = this._notificationService.notify({
					message: elicitation.message + ' ' + localize('mcp.elicit.url.instruction2', 'This will open {0}', elicitation.url),
					source: localize('mcp.elicit.source', 'MCP Server ({0})', server.definition.label),
					severity: Severity.Info,
					actions: {
						primary: [store.add(new Action('mcp.elicit.url.open2', localize('mcp.elicit.url.open2', 'Open URL'), undefined, true, () => resolve(this._doElicitUrl(elicitation, token))))],
						secondary: [store.add(new Action('mcp.elicit.cancel', localize('mcp.elicit.cancel', 'Cancel'), undefined, true, () => resolve({ action: 'decline' })))],
					}
				});
				store.add(handle.onDidClose(() => resolve({ action: 'cancel' })));
				store.add(token.onCancellationRequested(() => resolve({ action: 'cancel' })));
			}
		}).finally(() => store.dispose());

		return {
			kind: ElicitationKind.URL,
			value,
			wait: completePromise,
			dispose: () => promiseStore.dispose(),
		};
	}

	private async _doElicitUrl(elicitation: MCP.ElicitRequestURLParams, token: CancellationToken): Promise<MCP.ElicitResult> {
		if (token.isCancellationRequested) {
			return { action: 'cancel' };
		}

		try {
			if (await this._openerService.open(elicitation.url, { allowCommands: false })) {
				return { action: 'accept' };
			}
		} catch {
			// ignored
		}

		return { action: 'decline' };
	}

	private async _doElicitForm(elicitation: MCP.ElicitRequestFormParams | Pre20251125ElicitationParams, token: CancellationToken): Promise<MCP.ElicitResult> {
		const quickPick = this._quickInputService.createQuickPick<IQuickPickItem>();
		const store = new DisposableStore();

		try {
			const properties = Object.entries(elicitation.requestedSchema.properties);
			const requiredFields = new Set(elicitation.requestedSchema.required || []);
			const results: Record<string, string | number | boolean | string[]> = {};
			const backSnapshots: { value: string; validationMessage?: string }[] = [];

			quickPick.title = elicitation.message;
			quickPick.totalSteps = properties.length;
			quickPick.ignoreFocusOut = true;

			for (let i = 0; i < properties.length; i++) {
				const [propertyName, schema] = properties[i];
				const isRequired = requiredFields.has(propertyName);
				const restore = backSnapshots.at(i);

				store.clear();
				quickPick.step = i + 1;
				quickPick.title = schema.title || propertyName;
				quickPick.placeholder = this._getFieldPlaceholder(schema, isRequired);
				quickPick.value = restore?.value ?? '';
				quickPick.validationMessage = '';
				quickPick.buttons = i > 0 ? [this._quickInputService.backButton] : [];

				let result: { type: 'value'; value: string | number | boolean | undefined | string[] } | { type: 'back' } | { type: 'cancel' };
				if (schema.type === 'boolean') {
					result = await this._handleEnumField(quickPick, { enum: [{ const: 'true' }, { const: 'false' }], default: schema.default ? String(schema.default) : undefined }, isRequired, store, token);
					if (result.type === 'value') { result.value = result.value === 'true' ? true : false; }
				} else if (isLegacyTitledEnumSchema(schema)) {
					result = await this._handleEnumField(quickPick, { enum: schema.enum.map((v, i) => ({ const: v, title: schema.enumNames[i] })), default: schema.default }, isRequired, store, token);
				} else if (isUntitledEnumSchema(schema)) {
					result = await this._handleEnumField(quickPick, { enum: schema.enum.map(v => ({ const: v })), default: schema.default }, isRequired, store, token);
				} else if (isTitledSingleEnumSchema(schema)) {
					result = await this._handleEnumField(quickPick, { enum: schema.oneOf, default: schema.default }, isRequired, store, token);
				} else if (isTitledMultiEnumSchema(schema)) {
					result = await this._handleMultiEnumField(quickPick, { enum: schema.items.anyOf, default: schema.default }, isRequired, store, token);
				} else if (isUntitledMultiEnumSchema(schema)) {
					result = await this._handleMultiEnumField(quickPick, { enum: schema.items.enum.map(v => ({ const: v })), default: schema.default }, isRequired, store, token);
				} else {
					result = await this._handleInputField(quickPick, schema, isRequired, store, token);
					if (result.type === 'value' && (schema.type === 'number' || schema.type === 'integer')) {
						result.value = Number(result.value);
					}
				}

				if (result.type === 'back') {
					i -= 2;
					continue;
				}
				if (result.type === 'cancel') {
					return { action: 'cancel' };
				}

				backSnapshots[i] = { value: quickPick.value };

				if (result.value === undefined) {
					delete results[propertyName];
				} else {
					results[propertyName] = result.value;
				}
			}

			return {
				action: 'accept',
				content: results,
			};
		} finally {
			store.dispose();
			quickPick.dispose();
		}
	}

	private _getFieldPlaceholder(schema: MCP.PrimitiveSchemaDefinition, required: boolean): string {
		let placeholder = schema.description || '';
		if (!required) {
			placeholder = placeholder ? `${placeholder} (${localize('optional', 'Optional')})` : localize('optional', 'Optional');
		}
		return placeholder;
	}

	private async _handleEnumField(
		quickPick: IQuickPick<IQuickPickItem>,
		schema: { default?: string; enum: { const: string; title?: string }[] },
		required: boolean,
		store: DisposableStore,
		token: CancellationToken
	) {
		const items: IQuickPickItem[] = schema.enum.map(({ const: value, title }) => ({
			id: value,
			label: value,
			description: title,
		}));

		if (!required) {
			items.push(noneItem);
		}

		quickPick.canSelectMany = false;
		quickPick.items = items;
		if (schema.default !== undefined) {
			quickPick.activeItems = items.filter(item => item.id === schema.default);
		}

		return new Promise<{ type: 'value'; value: string | undefined } | { type: 'back' } | { type: 'cancel' }>(resolve => {
			store.add(token.onCancellationRequested(() => resolve({ type: 'cancel' })));
			store.add(quickPick.onDidAccept(() => {
				const selected = quickPick.selectedItems[0];
				if (selected) {
					resolve({ type: 'value', value: selected.id });
				}
			}));
			store.add(quickPick.onDidTriggerButton(() => resolve({ type: 'back' })));
			store.add(quickPick.onDidHide(() => resolve({ type: 'cancel' })));

			quickPick.show();
		});
	}

	private async _handleMultiEnumField(
		quickPick: IQuickPick<IQuickPickItem>,
		schema: { default?: string[]; enum: { const: string; title?: string }[] },
		required: boolean,
		store: DisposableStore,
		token: CancellationToken
	) {
		const items: IQuickPickItem[] = schema.enum.map(({ const: value, title }) => ({
			id: value,
			label: value,
			description: title,
			picked: !!schema.default?.includes(value),
			pickable: true,
		}));

		if (!required) {
			items.push(noneItem);
		}

		quickPick.canSelectMany = true;
		quickPick.items = items;

		return new Promise<{ type: 'value'; value: string[] | undefined } | { type: 'back' } | { type: 'cancel' }>(resolve => {
			store.add(token.onCancellationRequested(() => resolve({ type: 'cancel' })));
			store.add(quickPick.onDidAccept(() => {
				const selected = quickPick.selectedItems[0];
				if (selected.id === undefined) {
					resolve({ type: 'value', value: undefined });
				} else {
					resolve({ type: 'value', value: quickPick.selectedItems.map(i => i.id).filter(isDefined) });
				}
			}));
			store.add(quickPick.onDidTriggerButton(() => resolve({ type: 'back' })));
			store.add(quickPick.onDidHide(() => resolve({ type: 'cancel' })));

			quickPick.show();
		});
	}

	private async _handleInputField(
		quickPick: IQuickPick<IQuickPickItem>,
		schema: MCP.NumberSchema | MCP.StringSchema,
		required: boolean,
		store: DisposableStore,
		token: CancellationToken
	) {
		quickPick.canSelectMany = false;

		const updateItems = () => {
			const items: IQuickPickItem[] = [];
			if (quickPick.value) {
				const validation = this._validateInput(quickPick.value, schema);
				quickPick.validationMessage = validation.message;
				if (validation.isValid) {
					items.push({ id: '$current', label: `\u27A4 ${quickPick.value}` });
				}
			} else {
				quickPick.validationMessage = '';

				if (schema.default) {
					items.push({ id: '$default', label: `${schema.default}`, description: localize('mcp.elicit.useDefault', 'Default value') });
				}
			}


			if (quickPick.validationMessage) {
				quickPick.severity = Severity.Warning;
			} else {
				quickPick.severity = Severity.Ignore;
				if (!required) {
					items.push(noneItem);
				}
			}

			quickPick.items = items;
		};

		updateItems();

		return new Promise<{ type: 'value'; value: string | undefined } | { type: 'back' } | { type: 'cancel' }>(resolve => {
			if (token.isCancellationRequested) {
				resolve({ type: 'cancel' });
				return;
			}

			store.add(token.onCancellationRequested(() => resolve({ type: 'cancel' })));
			store.add(quickPick.onDidChangeValue(updateItems));
			store.add(quickPick.onDidAccept(() => {
				const id = quickPick.selectedItems[0].id;
				if (!id) {
					resolve({ type: 'value', value: undefined });
				} else if (id === '$default') {
					resolve({ type: 'value', value: String(schema.default) });
				} else if (!quickPick.validationMessage) {
					resolve({ type: 'value', value: quickPick.value });
				}
			}));
			store.add(quickPick.onDidTriggerButton(() => resolve({ type: 'back' })));
			store.add(quickPick.onDidHide(() => resolve({ type: 'cancel' })));

			quickPick.show();
		});
	}

	private _validateInput(value: string, schema: MCP.NumberSchema | MCP.StringSchema): { isValid: boolean; message?: string } {
		switch (schema.type) {
			case 'string':
				return this._validateString(value, schema);
			case 'number':
			case 'integer':
				return this._validateNumber(value, schema);
			default:
				assertNever(schema);
		}
	}

	private _validateString(value: string, schema: MCP.StringSchema): { isValid: boolean; parsedValue?: string; message?: string } {
		if (schema.minLength && value.length < schema.minLength) {
			return { isValid: false, message: localize('mcp.elicit.validation.minLength', 'Minimum length is {0}', schema.minLength) };
		}
		if (schema.maxLength && value.length > schema.maxLength) {
			return { isValid: false, message: localize('mcp.elicit.validation.maxLength', 'Maximum length is {0}', schema.maxLength) };
		}
		if (schema.format) {
			const formatValid = this._validateStringFormat(value, schema.format);
			if (!formatValid.isValid) {
				return formatValid;
			}
		}
		return { isValid: true, parsedValue: value };
	}

	private _validateStringFormat(value: string, format: string): { isValid: boolean; message?: string } {
		switch (format) {
			case 'email':
				return value.includes('@')
					? { isValid: true }
					: { isValid: false, message: localize('mcp.elicit.validation.email', 'Please enter a valid email address') };
			case 'uri':
				if (URL.canParse(value)) {
					return { isValid: true };
				} else {
					return { isValid: false, message: localize('mcp.elicit.validation.uri', 'Please enter a valid URI') };
				}
			case 'date': {
				const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
				if (!dateRegex.test(value)) {
					return { isValid: false, message: localize('mcp.elicit.validation.date', 'Please enter a valid date (YYYY-MM-DD)') };
				}
				const date = new Date(value);
				return !isNaN(date.getTime())
					? { isValid: true }
					: { isValid: false, message: localize('mcp.elicit.validation.date', 'Please enter a valid date (YYYY-MM-DD)') };
			}
			case 'date-time': {
				const dateTime = new Date(value);
				return !isNaN(dateTime.getTime())
					? { isValid: true }
					: { isValid: false, message: localize('mcp.elicit.validation.dateTime', 'Please enter a valid date-time') };
			}
			default:
				return { isValid: true };
		}
	}

	private _validateNumber(value: string, schema: MCP.NumberSchema): { isValid: boolean; parsedValue?: number; message?: string } {
		const parsed = Number(value);
		if (isNaN(parsed)) {
			return { isValid: false, message: localize('mcp.elicit.validation.number', 'Please enter a valid number') };
		}
		if (schema.type === 'integer' && !Number.isInteger(parsed)) {
			return { isValid: false, message: localize('mcp.elicit.validation.integer', 'Please enter a valid integer') };
		}
		if (schema.minimum !== undefined && parsed < schema.minimum) {
			return { isValid: false, message: localize('mcp.elicit.validation.minimum', 'Minimum value is {0}', schema.minimum) };
		}
		if (schema.maximum !== undefined && parsed > schema.maximum) {
			return { isValid: false, message: localize('mcp.elicit.validation.maximum', 'Maximum value is {0}', schema.maximum) };
		}
		return { isValid: true, parsedValue: parsed };
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/browser/mcpLanguageFeatures.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/browser/mcpLanguageFeatures.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { computeLevenshteinDistance } from '../../../../base/common/diff/diff.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { createMarkdownCommandLink, MarkdownString } from '../../../../base/common/htmlContent.js';
import { findNodeAtLocation, Node, parseTree } from '../../../../base/common/json.js';
import { Disposable, DisposableStore, dispose, IDisposable, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { IObservable } from '../../../../base/common/observable.js';
import { isEqual } from '../../../../base/common/resources.js';
import { Range } from '../../../../editor/common/core/range.js';
import { CodeLens, CodeLensList, CodeLensProvider, InlayHint, InlayHintList } from '../../../../editor/common/languages.js';
import { ITextModel } from '../../../../editor/common/model.js';
import { ILanguageFeaturesService } from '../../../../editor/common/services/languageFeatures.js';
import { localize } from '../../../../nls.js';
import { IMarkerData, IMarkerService, MarkerSeverity } from '../../../../platform/markers/common/markers.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { IConfigurationResolverService } from '../../../services/configurationResolver/common/configurationResolver.js';
import { ConfigurationResolverExpression, IResolvedValue } from '../../../services/configurationResolver/common/configurationResolverExpression.js';
import { McpCommandIds } from '../common/mcpCommandIds.js';
import { mcpConfigurationSection } from '../common/mcpConfiguration.js';
import { IMcpRegistry } from '../common/mcpRegistryTypes.js';
import { IMcpConfigPath, IMcpServerStartOpts, IMcpService, IMcpWorkbenchService, McpConnectionState } from '../common/mcpTypes.js';

const diagnosticOwner = 'vscode.mcp';

export class McpLanguageFeatures extends Disposable implements IWorkbenchContribution {
	private readonly _cachedMcpSection = this._register(new MutableDisposable<{ model: ITextModel; inConfig: IMcpConfigPath; tree: Node } & IDisposable>());

	constructor(
		@ILanguageFeaturesService languageFeaturesService: ILanguageFeaturesService,
		@IMcpRegistry private readonly _mcpRegistry: IMcpRegistry,
		@IMcpWorkbenchService private readonly _mcpWorkbenchService: IMcpWorkbenchService,
		@IMcpService private readonly _mcpService: IMcpService,
		@IMarkerService private readonly _markerService: IMarkerService,
		@IConfigurationResolverService private readonly _configurationResolverService: IConfigurationResolverService,
	) {
		super();

		const patterns = [
			{ pattern: '**/mcp.json' },
			{ pattern: '**/workspace.json' },
		];

		const onDidChangeCodeLens = this._register(new Emitter<CodeLensProvider>());
		const codeLensProvider: CodeLensProvider = {
			onDidChange: onDidChangeCodeLens.event,
			provideCodeLenses: (model, range) => this._provideCodeLenses(model, () => onDidChangeCodeLens.fire(codeLensProvider)),
		};
		this._register(languageFeaturesService.codeLensProvider.register(patterns, codeLensProvider));

		this._register(languageFeaturesService.inlayHintsProvider.register(patterns, {
			onDidChangeInlayHints: _mcpRegistry.onDidChangeInputs,
			provideInlayHints: (model, range) => this._provideInlayHints(model, range),
		}));
	}

	/** Simple mechanism to avoid extra json parsing for hints+lenses */
	private async _parseModel(model: ITextModel) {
		if (this._cachedMcpSection.value?.model === model) {
			return this._cachedMcpSection.value;
		}

		const uri = model.uri;
		const inConfig = await this._mcpWorkbenchService.getMcpConfigPath(model.uri);
		if (!inConfig) {
			return undefined;
		}

		const value = model.getValue();
		const tree = parseTree(value);
		const listeners = [
			model.onDidChangeContent(() => this._cachedMcpSection.clear()),
			model.onWillDispose(() => this._cachedMcpSection.clear()),
		];
		this._addDiagnostics(model, value, tree, inConfig);

		return this._cachedMcpSection.value = {
			model,
			tree,
			inConfig,
			dispose: () => {
				this._markerService.remove(diagnosticOwner, [uri]);
				dispose(listeners);
			}
		};
	}

	private _addDiagnostics(tm: ITextModel, value: string, tree: Node, inConfig: IMcpConfigPath) {
		const serversNode = findNodeAtLocation(tree, inConfig.section ? [...inConfig.section, 'servers'] : ['servers']);
		if (!serversNode) {
			return;
		}

		const getClosestMatchingVariable = (name: string) => {
			let bestValue = '';
			let bestDistance = Infinity;
			for (const variable of this._configurationResolverService.resolvableVariables) {
				const distance = computeLevenshteinDistance(name, variable);
				if (distance < bestDistance) {
					bestDistance = distance;
					bestValue = variable;
				}
			}
			return bestValue;
		};

		const diagnostics: IMarkerData[] = [];
		forEachPropertyWithReplacement(serversNode, node => {
			const expr = ConfigurationResolverExpression.parse(node.value);

			for (const { id, name, arg } of expr.unresolved()) {
				if (!this._configurationResolverService.resolvableVariables.has(name)) {
					const position = value.indexOf(id, node.offset);
					if (position === -1) { continue; } // unreachable?

					const start = tm.getPositionAt(position);
					const end = tm.getPositionAt(position + id.length);
					diagnostics.push({
						severity: MarkerSeverity.Warning,
						message: localize('mcp.variableNotFound', 'Variable `{0}` not found, did you mean ${{1}}?', name, getClosestMatchingVariable(name) + (arg ? `:${arg}` : '')),
						startLineNumber: start.lineNumber,
						startColumn: start.column,
						endLineNumber: end.lineNumber,
						endColumn: end.column,
						modelVersionId: tm.getVersionId(),
					});
				}
			}
		});

		if (diagnostics.length) {
			this._markerService.changeOne(diagnosticOwner, tm.uri, diagnostics);
		} else {
			this._markerService.remove(diagnosticOwner, [tm.uri]);
		}
	}

	private async _provideCodeLenses(model: ITextModel, onDidChangeCodeLens: () => void): Promise<CodeLensList | undefined> {
		const parsed = await this._parseModel(model);
		if (!parsed) {
			return undefined;
		}

		const { tree, inConfig } = parsed;
		const serversNode = findNodeAtLocation(tree, inConfig.section ? [...inConfig.section, 'servers'] : ['servers']);
		if (!serversNode) {
			return undefined;
		}

		const store = new DisposableStore();
		const lenses: CodeLens[] = [];
		const lensList: CodeLensList = { lenses, dispose: () => store.dispose() };
		const read = <T>(observable: IObservable<T>): T => {
			store.add(Event.fromObservableLight(observable)(onDidChangeCodeLens));
			return observable.get();
		};

		const collection = read(this._mcpRegistry.collections).find(c => isEqual(c.presentation?.origin, model.uri));
		if (!collection) {
			return lensList;
		}

		const mcpServers = read(this._mcpService.servers).filter(s => s.collection.id === collection.id);
		for (const node of serversNode.children || []) {
			if (node.type !== 'property' || node.children?.[0]?.type !== 'string') {
				continue;
			}

			const name = node.children[0].value as string;
			const server = mcpServers.find(s => s.definition.label === name);
			if (!server) {
				continue;
			}

			const range = Range.fromPositions(model.getPositionAt(node.children[0].offset));
			const canDebug = !!server.readDefinitions().get().server?.devMode?.debug;
			const state = read(server.connectionState).state;
			switch (state) {
				case McpConnectionState.Kind.Error:
					lenses.push({
						range,
						command: {
							id: McpCommandIds.ShowOutput,
							title: '$(error) ' + localize('server.error', 'Error'),
							arguments: [server.definition.id],
						},
					}, {
						range,
						command: {
							id: McpCommandIds.RestartServer,
							title: localize('mcp.restart', "Restart"),
							arguments: [server.definition.id, { autoTrustChanges: true } satisfies IMcpServerStartOpts],
						},
					});
					if (canDebug) {
						lenses.push({
							range,
							command: {
								id: McpCommandIds.RestartServer,
								title: localize('mcp.debug', "Debug"),
								arguments: [server.definition.id, { debug: true, autoTrustChanges: true } satisfies IMcpServerStartOpts],
							},
						});
					}
					break;
				case McpConnectionState.Kind.Starting:
					lenses.push({
						range,
						command: {
							id: McpCommandIds.ShowOutput,
							title: '$(loading~spin) ' + localize('server.starting', 'Starting'),
							arguments: [server.definition.id],
						},
					}, {
						range,
						command: {
							id: McpCommandIds.StopServer,
							title: localize('cancel', "Cancel"),
							arguments: [server.definition.id],
						},
					});
					break;
				case McpConnectionState.Kind.Running:
					lenses.push({
						range,
						command: {
							id: McpCommandIds.ShowOutput,
							title: '$(check) ' + localize('server.running', 'Running'),
							arguments: [server.definition.id],
						},
					}, {
						range,
						command: {
							id: McpCommandIds.StopServer,
							title: localize('mcp.stop', "Stop"),
							arguments: [server.definition.id],
						},
					}, {
						range,
						command: {
							id: McpCommandIds.RestartServer,
							title: localize('mcp.restart', "Restart"),
							arguments: [server.definition.id, { autoTrustChanges: true } satisfies IMcpServerStartOpts],
						},
					});
					if (canDebug) {
						lenses.push({
							range,
							command: {
								id: McpCommandIds.RestartServer,
								title: localize('mcp.debug', "Debug"),
								arguments: [server.definition.id, { autoTrustChanges: true, debug: true } satisfies IMcpServerStartOpts],
							},
						});
					}
					break;
				case McpConnectionState.Kind.Stopped:
					lenses.push({
						range,
						command: {
							id: McpCommandIds.StartServer,
							title: '$(debug-start) ' + localize('mcp.start', "Start"),
							arguments: [server.definition.id, { autoTrustChanges: true } satisfies IMcpServerStartOpts],
						},
					});
					if (canDebug) {
						lenses.push({
							range,
							command: {
								id: McpCommandIds.StartServer,
								title: localize('mcp.debug', "Debug"),
								arguments: [server.definition.id, { autoTrustChanges: true, debug: true } satisfies IMcpServerStartOpts],
							},
						});
					}
			}


			if (state !== McpConnectionState.Kind.Error) {
				const toolCount = read(server.tools).length;
				if (toolCount) {
					lenses.push({
						range,
						command: {
							id: '',
							title: localize('server.toolCount', '{0} tools', toolCount),
						}
					});
				}


				const promptCount = read(server.prompts).length;
				if (promptCount) {
					lenses.push({
						range,
						command: {
							id: McpCommandIds.StartPromptForServer,
							title: localize('server.promptcount', '{0} prompts', promptCount),
							arguments: [server],
						}
					});
				}

				lenses.push({
					range,
					command: {
						id: McpCommandIds.ServerOptions,
						title: localize('mcp.server.more', 'More...'),
						arguments: [server.definition.id],
					}
				});
			}
		}

		return lensList;
	}

	private async _provideInlayHints(model: ITextModel, range: Range): Promise<InlayHintList | undefined> {
		const parsed = await this._parseModel(model);
		if (!parsed) {
			return undefined;
		}

		const { tree, inConfig } = parsed;
		const mcpSection = inConfig.section ? findNodeAtLocation(tree, [...inConfig.section]) : tree;
		if (!mcpSection) {
			return undefined;
		}

		const inputsNode = findNodeAtLocation(mcpSection, ['inputs']);
		if (!inputsNode) {
			return undefined;
		}

		const inputs = await this._mcpRegistry.getSavedInputs(inConfig.scope);
		const hints: InlayHint[] = [];

		const serversNode = findNodeAtLocation(mcpSection, ['servers']);
		if (serversNode) {
			annotateServers(serversNode);
		}
		annotateInputs(inputsNode);

		return { hints, dispose: () => { } };

		function annotateServers(servers: Node) {
			forEachPropertyWithReplacement(servers, node => {
				const expr = ConfigurationResolverExpression.parse(node.value);
				for (const { id } of expr.unresolved()) {
					const saved = inputs[id];
					if (saved) {
						pushAnnotation(id, node.offset + node.value.indexOf(id) + id.length, saved);
					}
				}
			});
		}

		function annotateInputs(node: Node) {
			if (node.type !== 'array' || !node.children) {
				return;
			}

			for (const input of node.children) {
				if (input.type !== 'object' || !input.children) {
					continue;
				}

				const idProp = input.children.find(c => c.type === 'property' && c.children?.[0].value === 'id');
				if (!idProp) {
					continue;
				}

				const id = idProp.children![1];
				if (!id || id.type !== 'string' || !id.value) {
					continue;
				}

				const savedId = '${input:' + id.value + '}';
				const saved = inputs[savedId];
				if (saved) {
					pushAnnotation(savedId, id.offset + 1 + id.length, saved);
				}
			}
		}

		function pushAnnotation(savedId: string, offset: number, saved: IResolvedValue): InlayHint {
			const tooltip = new MarkdownString([
				createMarkdownCommandLink({ id: McpCommandIds.EditStoredInput, title: localize('edit', 'Edit'), arguments: [savedId, model.uri, mcpConfigurationSection, inConfig!.target] }),
				createMarkdownCommandLink({ id: McpCommandIds.RemoveStoredInput, title: localize('clear', 'Clear'), arguments: [inConfig!.scope, savedId] }),
				createMarkdownCommandLink({ id: McpCommandIds.RemoveStoredInput, title: localize('clearAll', 'Clear All'), arguments: [inConfig!.scope] }),
			].join(' | '), { isTrusted: true });

			const hint: InlayHint = {
				label: '= ' + (saved.input?.type === 'promptString' && saved.input.password ? '*'.repeat(10) : (saved.value || '')),
				position: model.getPositionAt(offset),
				tooltip,
				paddingLeft: true,
			};

			hints.push(hint);
			return hint;
		}
	}
}



function forEachPropertyWithReplacement(node: Node, callback: (node: Node) => void) {
	if (node.type === 'string' && typeof node.value === 'string' && node.value.includes(ConfigurationResolverExpression.VARIABLE_LHS)) {
		callback(node);
	} else if (node.type === 'property') {
		// skip the property name
		node.children?.slice(1).forEach(n => forEachPropertyWithReplacement(n, callback));
	} else {
		node.children?.forEach(n => forEachPropertyWithReplacement(n, callback));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/browser/mcpMigration.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/browser/mcpMigration.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { ConfigurationTarget } from '../../../../platform/configuration/common/configuration.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IMcpServerConfiguration, IMcpServerVariable, IMcpStdioServerConfiguration, McpServerType } from '../../../../platform/mcp/common/mcpPlatformTypes.js';
import { IStringDictionary } from '../../../../base/common/collections.js';
import { mcpConfigurationSection } from '../../../contrib/mcp/common/mcpConfiguration.js';
import { IWorkbenchMcpManagementService } from '../../../services/mcp/common/mcpWorkbenchManagementService.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { IUserDataProfileService } from '../../../services/userDataProfile/common/userDataProfile.js';
import { FileOperationResult, IFileService, toFileOperationResult } from '../../../../platform/files/common/files.js';
import { URI } from '../../../../base/common/uri.js';
import { parse } from '../../../../base/common/jsonc.js';
import { isObject, Mutable } from '../../../../base/common/types.js';
import { IRemoteAgentService } from '../../../services/remote/common/remoteAgentService.js';
import { IJSONEditingService } from '../../../services/configuration/common/jsonEditing.js';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { McpCommandIds } from '../common/mcpCommandIds.js';
import { localize } from '../../../../nls.js';

interface IMcpConfiguration {
	inputs?: IMcpServerVariable[];
	servers?: IStringDictionary<IMcpServerConfiguration>;
}

export class McpConfigMigrationContribution extends Disposable implements IWorkbenchContribution {

	static ID = 'workbench.mcp.config.migration';

	constructor(
		@IWorkbenchMcpManagementService private readonly mcpManagementService: IWorkbenchMcpManagementService,
		@IUserDataProfileService private readonly userDataProfileService: IUserDataProfileService,
		@IFileService private readonly fileService: IFileService,
		@IRemoteAgentService private readonly remoteAgentService: IRemoteAgentService,
		@IJSONEditingService private readonly jsonEditingService: IJSONEditingService,
		@ILogService private readonly logService: ILogService,
		@INotificationService private readonly notificationService: INotificationService,
		@ICommandService private readonly commandService: ICommandService,
	) {
		super();
		this.migrateMcpConfig();
	}

	private async migrateMcpConfig(): Promise<void> {
		try {
			const userMcpConfig = await this.parseMcpConfig(this.userDataProfileService.currentProfile.settingsResource);
			if (userMcpConfig && userMcpConfig.servers && Object.keys(userMcpConfig.servers).length > 0) {
				await Promise.all(Object.entries(userMcpConfig.servers).map(([name, config], index) => this.mcpManagementService.install({ name, config, inputs: index === 0 ? userMcpConfig.inputs : undefined })));
				await this.removeMcpConfig(this.userDataProfileService.currentProfile.settingsResource);
			}
		} catch (error) {
			this.logService.error(`MCP migration: Failed to migrate user MCP config`, error);
		}
		this.watchForMcpConfiguration(this.userDataProfileService.currentProfile.settingsResource, false);

		const remoteEnvironment = await this.remoteAgentService.getEnvironment();
		if (remoteEnvironment) {
			try {
				const userRemoteMcpConfig = await this.parseMcpConfig(remoteEnvironment.settingsPath);
				if (userRemoteMcpConfig && userRemoteMcpConfig.servers && Object.keys(userRemoteMcpConfig.servers).length > 0) {
					await Promise.all(Object.entries(userRemoteMcpConfig.servers).map(([name, config], index) => this.mcpManagementService.install({ name, config, inputs: index === 0 ? userRemoteMcpConfig.inputs : undefined }, { target: ConfigurationTarget.USER_REMOTE })));
					await this.removeMcpConfig(remoteEnvironment.settingsPath);
				}
			} catch (error) {
				this.logService.error(`MCP migration: Failed to migrate remote MCP config`, error);
			}
			this.watchForMcpConfiguration(remoteEnvironment.settingsPath, true);
		}

	}

	private watchForMcpConfiguration(file: URI, isRemote: boolean): void {
		this._register(this.fileService.watch(file));
		this._register(this.fileService.onDidFilesChange(e => {
			if (e.contains(file)) {
				this.checkForMcpConfigInFile(file, isRemote);
			}
		}));
	}

	private async checkForMcpConfigInFile(settingsFile: URI, isRemote: boolean): Promise<void> {
		try {
			const mcpConfig = await this.parseMcpConfig(settingsFile);
			if (mcpConfig && mcpConfig.servers && Object.keys(mcpConfig.servers).length > 0) {
				this.showMcpConfigErrorNotification(isRemote);
			}
		} catch (error) {
			// Ignore parsing errors - file might not exist or be malformed
		}
	}

	private showMcpConfigErrorNotification(isRemote: boolean): void {
		const message = isRemote
			? localize('mcp.migration.remoteConfigFound', 'MCP servers should no longer be configured in remote user settings. Use the dedicated MCP configuration instead.')
			: localize('mcp.migration.userConfigFound', 'MCP servers should no longer be configured in user settings. Use the dedicated MCP configuration instead.');

		const openConfigLabel = isRemote
			? localize('mcp.migration.openRemoteConfig', 'Open Remote User MCP Configuration')
			: localize('mcp.migration.openUserConfig', 'Open User MCP Configuration');

		const commandId = isRemote ? McpCommandIds.OpenRemoteUserMcp : McpCommandIds.OpenUserMcp;

		this.notificationService.prompt(
			Severity.Error,
			message,
			[{
				label: localize('mcp.migration.update', 'Update Now'),
				run: async () => {
					await this.migrateMcpConfig();
					await this.commandService.executeCommand(commandId);
				},
			}, {
				label: openConfigLabel,
				keepOpen: true,
				run: () => this.commandService.executeCommand(commandId)
			}]
		);
	}

	private async parseMcpConfig(settingsFile: URI): Promise<IMcpConfiguration | undefined> {
		try {
			const content = await this.fileService.readFile(settingsFile);
			const settingsObject: IStringDictionary<unknown> = parse(content.value.toString());
			if (!isObject(settingsObject)) {
				return undefined;
			}
			const mcpConfiguration = settingsObject[mcpConfigurationSection] as IMcpConfiguration;
			if (mcpConfiguration && mcpConfiguration.servers) {
				for (const [, config] of Object.entries(mcpConfiguration.servers)) {
					if (config.type === undefined) {
						(<Mutable<IMcpServerConfiguration>>config).type = (<IMcpStdioServerConfiguration>config).command ? McpServerType.LOCAL : McpServerType.REMOTE;
					}
				}
			}
			return mcpConfiguration;
		} catch (error) {
			if (toFileOperationResult(error) !== FileOperationResult.FILE_NOT_FOUND) {
				this.logService.warn(`MCP migration: Failed to parse MCP config from ${settingsFile}:`, error);
			}
			return;
		}
	}

	private async removeMcpConfig(settingsFile: URI): Promise<void> {
		try {
			await this.jsonEditingService.write(settingsFile, [
				{
					path: [mcpConfigurationSection],
					value: undefined
				}
			], true);
		} catch (error) {
			this.logService.warn(`MCP migration: Failed to remove MCP config from ${settingsFile}:`, error);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/browser/mcpPromptArgumentPick.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/browser/mcpPromptArgumentPick.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { assertNever } from '../../../../base/common/assert.js';
import { disposableTimeout, RunOnceScheduler, timeout } from '../../../../base/common/async.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { Disposable, DisposableStore, toDisposable } from '../../../../base/common/lifecycle.js';
import { autorun, derived, IObservable, ObservablePromise, observableSignalFromEvent, observableValue } from '../../../../base/common/observable.js';
import { basename } from '../../../../base/common/resources.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { URI } from '../../../../base/common/uri.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { getIconClasses } from '../../../../editor/common/services/getIconClasses.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { localize } from '../../../../nls.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { IQuickInputService, IQuickPick, IQuickPickItem, IQuickPickSeparator } from '../../../../platform/quickinput/common/quickInput.js';
import { ICommandDetectionCapability, TerminalCapability } from '../../../../platform/terminal/common/capabilities/capabilities.js';
import { TerminalLocation } from '../../../../platform/terminal/common/terminal.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { QueryBuilder } from '../../../services/search/common/queryBuilder.js';
import { ISearchService } from '../../../services/search/common/search.js';
import { ITerminalGroupService, ITerminalInstance, ITerminalService } from '../../terminal/browser/terminal.js';
import { IMcpPrompt } from '../common/mcpTypes.js';
import { MCP } from '../common/modelContextProtocol.js';

type PickItem = IQuickPickItem & (
	| { action: 'text' | 'command' | 'suggest' }
	| { action: 'file'; uri: URI }
	| { action: 'selectedText'; uri: URI; selectedText: string }
);

const SHELL_INTEGRATION_TIMEOUT = 5000;
const NO_SHELL_INTEGRATION_IDLE = 1000;
const SUGGEST_DEBOUNCE = 200;

type Action = { type: 'arg'; value: string | undefined } | { type: 'back' } | { type: 'cancel' };

export class McpPromptArgumentPick extends Disposable {
	private readonly quickPick: IQuickPick<PickItem, { useSeparators: true }>;
	private _terminal?: ITerminalInstance;

	constructor(
		private readonly prompt: IMcpPrompt,
		@IQuickInputService private readonly _quickInputService: IQuickInputService,
		@ITerminalService private readonly _terminalService: ITerminalService,
		@ISearchService private readonly _searchService: ISearchService,
		@IWorkspaceContextService private readonly _workspaceContextService: IWorkspaceContextService,
		@ILabelService private readonly _labelService: ILabelService,
		@IFileService private readonly _fileService: IFileService,
		@IModelService private readonly _modelService: IModelService,
		@ILanguageService private readonly _languageService: ILanguageService,
		@ITerminalGroupService private readonly _terminalGroupService: ITerminalGroupService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@ICodeEditorService private readonly _codeEditorService: ICodeEditorService,
		@IEditorService private readonly _editorService: IEditorService,
	) {
		super();
		this.quickPick = this._register(_quickInputService.createQuickPick({ useSeparators: true }));
	}

	public async createArgs(token?: CancellationToken): Promise<Record<string, string | undefined> | undefined> {
		const { quickPick, prompt } = this;

		quickPick.totalSteps = prompt.arguments.length;
		quickPick.step = 0;
		quickPick.ignoreFocusOut = true;
		quickPick.sortByLabel = false;

		const args: Record<string, string | undefined> = {};
		const backSnapshots: { value: string; items: readonly (PickItem | IQuickPickSeparator)[]; activeItems: readonly PickItem[] }[] = [];
		for (let i = 0; i < prompt.arguments.length; i++) {
			const arg = prompt.arguments[i];
			const restore = backSnapshots.at(i);
			quickPick.step = i + 1;
			quickPick.placeholder = arg.required ? arg.description : `${arg.description || ''} (${localize('optional', 'Optional')})`;
			quickPick.title = localize('mcp.prompt.pick.title', 'Value for: {0}', arg.title || arg.name);
			quickPick.value = restore?.value ?? ((args.hasOwnProperty(arg.name) && args[arg.name]) || '');
			quickPick.items = restore?.items ?? [];
			quickPick.activeItems = restore?.activeItems ?? [];
			quickPick.buttons = i > 0 ? [this._quickInputService.backButton] : [];

			const value = await this._getArg(arg, !!restore, args, token);
			if (value.type === 'back') {
				i -= 2;
			} else if (value.type === 'cancel') {
				return undefined;
			} else if (value.type === 'arg') {
				backSnapshots[i] = { value: quickPick.value, items: quickPick.items.slice(), activeItems: quickPick.activeItems.slice() };
				args[arg.name] = value.value;
			} else {
				assertNever(value);
			}
		}

		quickPick.value = '';
		quickPick.placeholder = localize('loading', 'Loading...');
		quickPick.busy = true;

		return args;
	}

	private async _getArg(arg: MCP.PromptArgument, didRestoreState: boolean, argsSoFar: Record<string, string | undefined>, token?: CancellationToken): Promise<Action> {
		const { quickPick } = this;
		const store = new DisposableStore();

		const input$ = observableValue(this, quickPick.value);
		const asyncPicks = [
			{
				name: localize('mcp.arg.suggestions', 'Suggestions'),
				observer: this._promptCompletions(arg, input$, argsSoFar),
			},
			{
				name: localize('mcp.arg.activeFiles', 'Active File'),
				observer: this._activeFileCompletions(),
			},
			{
				name: localize('mcp.arg.files', 'Files'),
				observer: this._fileCompletions(input$),
			}
		];

		store.add(autorun(reader => {
			if (didRestoreState) {
				input$.read(reader);
				return; // don't overwrite initial items until the user types
			}

			let items: (PickItem | IQuickPickSeparator)[] = [];
			items.push({ id: 'insert-text', label: localize('mcp.arg.asText', 'Insert as text'), iconClass: ThemeIcon.asClassName(Codicon.textSize), action: 'text', alwaysShow: true });
			items.push({ id: 'run-command', label: localize('mcp.arg.asCommand', 'Run as Command'), description: localize('mcp.arg.asCommand.description', 'Inserts the command output as the prompt argument'), iconClass: ThemeIcon.asClassName(Codicon.terminal), action: 'command', alwaysShow: true });

			let busy = false;
			for (const pick of asyncPicks) {
				const state = pick.observer.read(reader);
				busy ||= state.busy;
				if (state.picks) {
					items.push({ label: pick.name, type: 'separator' });
					items = items.concat(state.picks);
				}
			}

			const previouslyActive = quickPick.activeItems;
			quickPick.busy = busy;
			quickPick.items = items;

			const lastActive = items.find(i => previouslyActive.some(a => a.id === i.id)) as PickItem | undefined;
			const serverSuggestions = asyncPicks[0].observer;
			// Keep any selection state, but otherwise select the first completion item, and avoid default-selecting the top item unless there are no compltions
			if (lastActive) {
				quickPick.activeItems = [lastActive];
			} else if (serverSuggestions.read(reader).picks?.length) {
				quickPick.activeItems = [items[3] as PickItem];
			} else if (busy) {
				quickPick.activeItems = [];
			} else {
				quickPick.activeItems = [items[0] as PickItem];
			}
		}));

		try {
			const value = await new Promise<PickItem | 'back' | undefined>(resolve => {
				if (token) {
					store.add(token.onCancellationRequested(() => {
						resolve(undefined);
					}));
				}
				store.add(quickPick.onDidChangeValue(value => {
					quickPick.validationMessage = undefined;
					input$.set(value, undefined);
				}));
				store.add(quickPick.onDidAccept(() => {
					const item = quickPick.selectedItems[0];
					if (!quickPick.value && arg.required && (!item || item.action === 'text' || item.action === 'command')) {
						quickPick.validationMessage = localize('mcp.arg.required', "This argument is required");
					} else if (!item) {
						// For optional arguments when no item is selected, return empty text action
						resolve({ id: 'insert-text', label: '', action: 'text' });
					} else {
						resolve(item);
					}
				}));
				store.add(quickPick.onDidTriggerButton(() => {
					resolve('back');
				}));
				store.add(quickPick.onDidHide(() => {
					resolve(undefined);
				}));
				quickPick.show();
			});

			if (value === 'back') {
				return { type: 'back' };
			}

			if (value === undefined) {
				return { type: 'cancel' };
			}

			store.clear();
			const cts = new CancellationTokenSource();
			store.add(toDisposable(() => cts.dispose(true)));
			store.add(quickPick.onDidHide(() => store.dispose()));

			switch (value.action) {
				case 'text':
					return { type: 'arg', value: quickPick.value || undefined };
				case 'command':
					if (!quickPick.value) {
						return { type: 'arg', value: undefined };
					}
					quickPick.busy = true;
					return { type: 'arg', value: await this._getTerminalOutput(quickPick.value, cts.token) };
				case 'suggest':
					return { type: 'arg', value: value.label };
				case 'file':
					quickPick.busy = true;
					return { type: 'arg', value: await this._fileService.readFile(value.uri).then(c => c.value.toString()) };
				case 'selectedText':
					return { type: 'arg', value: value.selectedText };
				default:
					assertNever(value);
			}
		} finally {
			store.dispose();
		}
	}

	private _promptCompletions(arg: MCP.PromptArgument, input: IObservable<string>, argsSoFar: Record<string, string | undefined>) {
		const alreadyResolved: Record<string, string> = {};
		for (const [key, value] of Object.entries(argsSoFar)) {
			if (value) {
				alreadyResolved[key] = value;
			}
		}

		return this._asyncCompletions(input, async (i, t) => {
			const items = await this.prompt.complete(arg.name, i, alreadyResolved, t);
			return items.map((i): PickItem => ({ id: `suggest:${i}`, label: i, action: 'suggest' }));
		});
	}

	private _fileCompletions(input: IObservable<string>) {
		const qb = this._instantiationService.createInstance(QueryBuilder);
		return this._asyncCompletions(input, async (i, token) => {
			if (!i) {
				return [];
			}

			const query = qb.file(this._workspaceContextService.getWorkspace().folders, {
				filePattern: i,
				maxResults: 10,
			});

			const { results } = await this._searchService.fileSearch(query, token);

			return results.map((i): PickItem => ({
				id: i.resource.toString(),
				label: basename(i.resource),
				description: this._labelService.getUriLabel(i.resource),
				iconClasses: getIconClasses(this._modelService, this._languageService, i.resource),
				uri: i.resource,
				action: 'file',
			}));
		});
	}

	private _activeFileCompletions() {
		const activeEditorChange = observableSignalFromEvent(this, this._editorService.onDidActiveEditorChange);
		const activeEditor = derived(reader => {
			activeEditorChange.read(reader);
			return this._codeEditorService.getActiveCodeEditor();
		});

		const resourceObs = activeEditor
			.map(e => e ? observableSignalFromEvent(this, e.onDidChangeModel).map(() => e.getModel()?.uri) : undefined)
			.map((o, reader) => o?.read(reader));
		const selectionObs = activeEditor
			.map(e => e ? observableSignalFromEvent(this, e.onDidChangeCursorSelection).map(() => ({ range: e.getSelection(), model: e.getModel() })) : undefined)
			.map((o, reader) => o?.read(reader));

		return derived(reader => {
			const resource = resourceObs.read(reader);
			if (!resource) {
				return { busy: false, picks: [] };
			}

			const items: PickItem[] = [];

			// Add active file option
			items.push({
				id: 'active-file',
				label: localize('mcp.arg.activeFile', 'Active File'),
				description: this._labelService.getUriLabel(resource),
				iconClasses: getIconClasses(this._modelService, this._languageService, resource),
				uri: resource,
				action: 'file',
			});

			const selection = selectionObs.read(reader);
			// Add selected text option if there's a selection
			if (selection && selection.model && selection.range && !selection.range.isEmpty()) {
				const selectedText = selection.model.getValueInRange(selection.range);
				const lineCount = selection.range.endLineNumber - selection.range.startLineNumber + 1;
				const description = lineCount === 1
					? localize('mcp.arg.selectedText.singleLine', 'line {0}', selection.range.startLineNumber)
					: localize('mcp.arg.selectedText.multiLine', '{0} lines', lineCount);

				items.push({
					id: 'selected-text',
					label: localize('mcp.arg.selectedText', 'Selected Text'),
					description,
					selectedText,
					iconClass: ThemeIcon.asClassName(Codicon.selection),
					uri: resource,
					action: 'selectedText',
				});
			}

			return { picks: items, busy: false };
		});
	}

	private _asyncCompletions(input: IObservable<string>, mapper: (input: string, token: CancellationToken) => Promise<PickItem[]>): IObservable<{ busy: boolean; picks: PickItem[] | undefined }> {
		const promise = derived(reader => {
			const queryValue = input.read(reader);
			const cts = new CancellationTokenSource();
			reader.store.add(toDisposable(() => cts.dispose(true)));
			return new ObservablePromise(
				timeout(SUGGEST_DEBOUNCE, cts.token)
					.then(() => mapper(queryValue, cts.token))
					.catch(() => [])
			);
		});

		return promise.map((value, reader) => {
			const result = value.promiseResult.read(reader);
			return { picks: result?.data || [], busy: result === undefined };
		});
	}

	private async _getTerminalOutput(command: string, token: CancellationToken): Promise<string | undefined> {
		// The terminal outlives the specific pick argument. This is both a feature and a bug.
		// Feature: we can reuse the terminal if the user puts in multiple args
		// Bug workaround: if we dispose the terminal here and that results in the panel
		// closing, then focus moves out of the quickpick and into the active editor pane (chat input)
		// https://github.com/microsoft/vscode/blob/6a016f2507cd200b12ca6eecdab2f59da15aacb1/src/vs/workbench/browser/parts/editor/editorGroupView.ts#L1084
		const terminal = (this._terminal ??= this._register(await this._terminalService.createTerminal({
			config: {
				name: localize('mcp.terminal.name', "MCP Terminal"),
				isTransient: true,
				forceShellIntegration: true,
				isFeatureTerminal: true,
			},
			location: TerminalLocation.Panel,
		})));

		this._terminalService.setActiveInstance(terminal);
		this._terminalGroupService.showPanel(false);

		const shellIntegration = terminal.capabilities.get(TerminalCapability.CommandDetection);
		if (shellIntegration) {
			return this._getTerminalOutputInner(terminal, command, shellIntegration, token);
		}

		const store = new DisposableStore();
		return await new Promise<string | undefined>(resolve => {
			store.add(terminal.capabilities.onDidAddCapability(e => {
				if (e.id === TerminalCapability.CommandDetection) {
					store.dispose();
					resolve(this._getTerminalOutputInner(terminal, command, e.capability, token));
				}
			}));
			store.add(token.onCancellationRequested(() => {
				store.dispose();
				resolve(undefined);
			}));
			store.add(disposableTimeout(() => {
				store.dispose();
				resolve(this._getTerminalOutputInner(terminal, command, undefined, token));
			}, SHELL_INTEGRATION_TIMEOUT));
		});
	}

	private async _getTerminalOutputInner(terminal: ITerminalInstance, command: string, shellIntegration: ICommandDetectionCapability | undefined, token: CancellationToken) {
		const store = new DisposableStore();
		return new Promise<string | undefined>(resolve => {
			let allData: string = '';
			store.add(terminal.onLineData(d => allData += d + '\n'));
			if (shellIntegration) {
				store.add(shellIntegration.onCommandFinished(e => resolve(e.getOutput() || allData)));
			} else {
				const done = store.add(new RunOnceScheduler(() => resolve(allData), NO_SHELL_INTEGRATION_IDLE));
				store.add(terminal.onData(() => done.schedule()));
			}
			store.add(token.onCancellationRequested(() => resolve(undefined)));
			store.add(terminal.onDisposed(() => resolve(undefined)));

			terminal.runCommand(command, true);
		}).finally(() => {
			store.dispose();
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/browser/mcpResourceQuickAccess.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/browser/mcpResourceQuickAccess.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DeferredPromise, disposableTimeout, RunOnceScheduler } from '../../../../base/common/async.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { Event } from '../../../../base/common/event.js';
import { DisposableStore, IDisposable, toDisposable, Disposable } from '../../../../base/common/lifecycle.js';
import { autorun, derived, observableValue, IObservable } from '../../../../base/common/observable.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { URI } from '../../../../base/common/uri.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import { localize } from '../../../../nls.js';
import { ByteSize, IFileService, IFileStat } from '../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { DefaultQuickAccessFilterValue, IQuickAccessProvider, IQuickAccessProviderRunOptions } from '../../../../platform/quickinput/common/quickAccess.js';
import { IQuickInputService, IQuickPick, IQuickPickItem, IQuickPickSeparator } from '../../../../platform/quickinput/common/quickInput.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { IChatWidgetService } from '../../chat/browser/chat.js';
import { IChatAttachmentResolveService } from '../../chat/browser/chatAttachmentResolveService.js';
import { IChatRequestVariableEntry } from '../../chat/common/chatVariableEntries.js';
import { IMcpResource, IMcpResourceTemplate, IMcpServer, IMcpService, isMcpResourceTemplate, McpCapability, McpConnectionState, McpResourceURI } from '../common/mcpTypes.js';
import { McpIcons } from '../common/mcpIcons.js';
import { IUriTemplateVariable } from '../common/uriTemplate.js';
import { openPanelChatAndGetWidget } from './openPanelChatAndGetWidget.js';
import { LinkedList } from '../../../../base/common/linkedList.js';
import { ChatContextPickAttachment } from '../../chat/browser/chatContextPickService.js';
import { asArray } from '../../../../base/common/arrays.js';

export class McpResourcePickHelper extends Disposable {
	private _resources = observableValue<{ picks: Map<IMcpServer, (IMcpResourceTemplate | IMcpResource)[]>; isBusy: boolean }>(this, { picks: new Map(), isBusy: true });
	private _pickItemsStack: LinkedList<{ server: IMcpServer; resources: (IMcpResource | IMcpResourceTemplate)[] }> = new LinkedList();
	private _inDirectory = observableValue<undefined | { server: IMcpServer; resources: (IMcpResource | IMcpResourceTemplate)[] }>(this, undefined);
	public static sep(server: IMcpServer): IQuickPickSeparator {
		return {
			id: server.definition.id,
			type: 'separator',
			label: server.definition.label,
		};
	}

	public addCurrentMCPQuickPickItemLevel(server: IMcpServer, resources: (IMcpResource | IMcpResourceTemplate)[]): void {
		let isValidPush: boolean = false;
		isValidPush = this._pickItemsStack.isEmpty();
		if (!isValidPush) {
			const stackedItem = this._pickItemsStack.peek();
			if (stackedItem?.server === server && stackedItem.resources === resources) {
				isValidPush = false;
			} else {
				isValidPush = true;
			}
		}
		if (isValidPush) {
			this._pickItemsStack.push({ server, resources });
		}

	}

	public navigateBack(): boolean {
		const items = this._pickItemsStack.pop();
		if (items) {
			this._inDirectory.set({ server: items.server, resources: items.resources }, undefined);
			return true;
		} else {
			return false;
		}
	}

	public static item(resource: IMcpResource | IMcpResourceTemplate): IQuickPickItem {
		const iconPath = resource.icons.getUrl(22);
		if (isMcpResourceTemplate(resource)) {
			return {
				id: resource.template.template,
				label: resource.title || resource.name,
				description: resource.description,
				detail: localize('mcp.resource.template', 'Resource template: {0}', resource.template.template),
				iconPath,
			};
		}

		return {
			id: resource.uri.toString(),
			label: resource.title || resource.name,
			description: resource.description,
			detail: resource.mcpUri + (resource.sizeInBytes !== undefined ? ' (' + ByteSize.formatSize(resource.sizeInBytes) + ')' : ''),
			iconPath,
		};
	}

	public hasServersWithResources = derived(reader => {
		let enabled = false;
		for (const server of this._mcpService.servers.read(reader)) {
			const cap = server.capabilities.read(undefined);
			if (cap === undefined) {
				enabled = true; // until we know more
			} else if (cap & McpCapability.Resources) {
				enabled = true;
				break;
			}
		}

		return enabled;
	});

	public explicitServers?: IMcpServer[];

	constructor(
		@IMcpService private readonly _mcpService: IMcpService,
		@IFileService private readonly _fileService: IFileService,
		@IQuickInputService private readonly _quickInputService: IQuickInputService,
		@INotificationService private readonly _notificationService: INotificationService,
		@IChatAttachmentResolveService private readonly _chatAttachmentResolveService: IChatAttachmentResolveService
	) {
		super();
	}

	/**
	 * Navigate to a resource if it's a directory.
	 * Returns true if the resource is a directory with children (navigation succeeded).
	 * Returns false if the resource is a leaf file (no navigation).
	 * When returning true, statefully updates the picker state to display directory contents.
	 */
	public async navigate(resource: IMcpResource | IMcpResourceTemplate, server: IMcpServer): Promise<boolean> {
		if (isMcpResourceTemplate(resource)) {
			return false;
		}

		const uri = resource.uri;
		let stat: IFileStat | undefined = undefined;
		try {
			stat = await this._fileService.resolve(uri, { resolveMetadata: false });
		} catch (e) {
			return false;
		}

		if (stat && this._isDirectoryResource(resource) && (stat.children?.length ?? 0) > 0) {
			// Save current state to stack before navigating
			const currentResources = this._resources.get().picks.get(server);
			if (currentResources) {
				this.addCurrentMCPQuickPickItemLevel(server, currentResources);
			}

			// Convert all the children to IMcpResource objects
			const childResources: IMcpResource[] = stat.children!.map(child => {
				const mcpUri = McpResourceURI.fromServer(server.definition, child.resource.toString());
				return {
					uri: mcpUri,
					mcpUri: child.resource.path,
					name: child.name,
					title: child.name,
					description: resource.description,
					mimeType: undefined,
					sizeInBytes: child.size,
					icons: McpIcons.fromParsed(undefined)
				};
			});
			this._inDirectory.set({ server, resources: childResources }, undefined);
			return true;
		}
		return false;
	}

	public toAttachment(resource: IMcpResource | IMcpResourceTemplate, server: IMcpServer): Promise<ChatContextPickAttachment> | 'noop' {
		const noop = 'noop';
		if (this._isDirectoryResource(resource)) {
			//Check if directory
			this.checkIfDirectoryAndPopulate(resource, server);
			return noop;
		}
		if (isMcpResourceTemplate(resource)) {
			return this._resourceTemplateToAttachment(resource).then(val => val || noop);
		} else {
			return this._resourceToAttachment(resource).then(val => val || noop);
		}
	}

	public async checkIfDirectoryAndPopulate(resource: IMcpResource | IMcpResourceTemplate, server: IMcpServer): Promise<boolean> {
		try {
			return !await this.navigate(resource, server);
		} catch (error) {
			return false;
		}
	}

	public async toURI(resource: IMcpResource | IMcpResourceTemplate): Promise<URI | undefined> {
		if (isMcpResourceTemplate(resource)) {
			const maybeUri = await this._resourceTemplateToURI(resource);
			return maybeUri && await this._verifyUriIfNeeded(maybeUri);
		} else {
			return resource.uri;
		}
	}

	public checkIfNestedResources = () => !this._pickItemsStack.isEmpty();

	private async _resourceToAttachment(resource: { uri: URI; name: string; mimeType?: string }): Promise<IChatRequestVariableEntry | undefined> {
		const asImage = await this._chatAttachmentResolveService.resolveImageEditorAttachContext(resource.uri, undefined, resource.mimeType);
		if (asImage) {
			return asImage;
		}

		return {
			id: resource.uri.toString(),
			kind: 'file',
			name: resource.name,
			value: resource.uri,
		};
	}

	private async _resourceTemplateToAttachment(rt: IMcpResourceTemplate) {
		const maybeUri = await this._resourceTemplateToURI(rt);
		const uri = maybeUri && await this._verifyUriIfNeeded(maybeUri);
		return uri && this._resourceToAttachment({
			uri,
			name: rt.name,
			mimeType: rt.mimeType,
		});

	}

	private async _verifyUriIfNeeded({ uri, needsVerification }: { uri: URI; needsVerification: boolean }): Promise<URI | undefined> {
		if (!needsVerification) {
			return uri;
		}

		const exists = await this._fileService.exists(uri);
		if (exists) {
			return uri;
		}

		this._notificationService.warn(localize('mcp.resource.template.notFound', "The resource {0} was not found.", McpResourceURI.toServer(uri).resourceURL.toString()));
		return undefined;
	}

	private async _resourceTemplateToURI(rt: IMcpResourceTemplate) {
		const todo = rt.template.components.flatMap(c => typeof c === 'object' ? c.variables : []);

		const quickInput = this._quickInputService.createQuickPick();
		const cts = new CancellationTokenSource();

		const vars: Record<string, string | string[]> = {};
		quickInput.totalSteps = todo.length;
		quickInput.ignoreFocusOut = true;
		let needsVerification = false;

		try {
			for (let i = 0; i < todo.length; i++) {
				const variable = todo[i];
				const resolved = await this._promptForTemplateValue(quickInput, variable, vars, rt);
				if (resolved === undefined) {
					return undefined;
				}
				// mark the URI as needing verification if any part was not a completion pick
				needsVerification ||= !resolved.completed;
				vars[todo[i].name] = variable.repeatable ? resolved.value.split('/') : resolved.value;
			}
			return { uri: rt.resolveURI(vars), needsVerification };
		} finally {
			cts.dispose(true);
			quickInput.dispose();
		}
	}

	private _promptForTemplateValue(input: IQuickPick<IQuickPickItem>, variable: IUriTemplateVariable, variablesSoFar: Record<string, string | string[]>, rt: IMcpResourceTemplate): Promise<{ value: string; completed: boolean } | undefined> {
		const store = new DisposableStore();
		const completions = new Map<string, Promise<string[]>>([]);

		const variablesWithPlaceholders = { ...variablesSoFar };
		for (const variable of rt.template.components.flatMap(c => typeof c === 'object' ? c.variables : [])) {
			if (!variablesWithPlaceholders.hasOwnProperty(variable.name)) {
				variablesWithPlaceholders[variable.name] = `$${variable.name.toUpperCase()}`;
			}
		}

		let placeholder = localize('mcp.resource.template.placeholder', "Value for ${0} in {1}", variable.name.toUpperCase(), rt.template.resolve(variablesWithPlaceholders).replaceAll('%24', '$'));
		if (variable.optional) {
			placeholder += ' (' + localize('mcp.resource.template.optional', "Optional") + ')';
		}

		input.placeholder = placeholder;
		input.value = '';
		input.items = [];
		input.show();

		const currentID = generateUuid();
		const setItems = (value: string, completed: string[] = []) => {
			const items = completed.filter(c => c !== value).map(c => ({ id: c, label: c }));
			if (value) {
				items.unshift({ id: currentID, label: value });
			} else if (variable.optional) {
				items.unshift({ id: currentID, label: localize('mcp.resource.template.empty', "<Empty>") });
			}

			input.items = items;
		};

		let changeCancellation = new CancellationTokenSource();
		store.add(toDisposable(() => changeCancellation.dispose(true)));

		const getCompletionItems = () => {
			const inputValue = input.value;
			let promise = completions.get(inputValue);
			if (!promise) {
				promise = rt.complete(variable.name, inputValue, variablesSoFar, changeCancellation.token);
				completions.set(inputValue, promise);
			}

			promise.then(values => {
				if (!changeCancellation.token.isCancellationRequested) {
					setItems(inputValue, values);
				}
			}).catch(() => {
				completions.delete(inputValue);
			}).finally(() => {
				if (!changeCancellation.token.isCancellationRequested) {
					input.busy = false;
				}
			});
		};

		const getCompletionItemsScheduler = store.add(new RunOnceScheduler(getCompletionItems, 300));

		return new Promise<{ value: string; completed: boolean } | undefined>(resolve => {
			store.add(input.onDidHide(() => resolve(undefined)));
			store.add(input.onDidAccept(() => {
				const item = input.selectedItems[0];
				if (item.id === currentID) {
					resolve({ value: input.value, completed: false });
				} else if (variable.explodable && item.label.endsWith('/') && item.label !== input.value) {
					// if navigating in a path structure, picking a `/` should let the user pick in a subdirectory
					input.value = item.label;
				} else {
					resolve({ value: item.label, completed: true });
				}
			}));
			store.add(input.onDidChangeValue(value => {
				input.busy = true;
				changeCancellation.dispose(true);
				changeCancellation = new CancellationTokenSource();
				getCompletionItemsScheduler.cancel();
				setItems(value);

				if (completions.has(input.value)) {
					getCompletionItems();
				} else {
					getCompletionItemsScheduler.schedule();
				}
			}));

			getCompletionItems();
		}).finally(() => store.dispose());
	}

	private _isDirectoryResource(resource: IMcpResource | IMcpResourceTemplate): boolean {

		if (resource.mimeType && resource.mimeType === 'inode/directory') {
			return true;
		} else if (isMcpResourceTemplate(resource)) {
			return resource.template.template.endsWith('/');
		} else {
			return resource.uri.path.endsWith('/');
		}
	}

	public getPicks(token?: CancellationToken): IObservable<{ picks: Map<IMcpServer, (IMcpResourceTemplate | IMcpResource)[]>; isBusy: boolean }> {
		const cts = new CancellationTokenSource(token);
		let isBusyLoadingPicks = true;
		this._register(toDisposable(() => cts.dispose(true)));
		// We try to show everything in-sequence to avoid flickering (#250411) as long as
		// it loads within 5 seconds. Otherwise we just show things as the load in parallel.
		let showInSequence = true;
		this._register(disposableTimeout(() => {
			showInSequence = false;
			publish();
		}, 5_000));

		const publish = () => {
			const output = new Map<IMcpServer, (IMcpResourceTemplate | IMcpResource)[]>();
			for (const [server, rec] of servers) {
				const r: (IMcpResourceTemplate | IMcpResource)[] = [];
				output.set(server, r);
				if (rec.templates.isResolved) {
					r.push(...rec.templates.value!);
				} else if (showInSequence) {
					break;
				}

				r.push(...rec.resourcesSoFar);
				if (!rec.resources.isSettled && showInSequence) {
					break;
				}
			}
			this._resources.set({ picks: output, isBusy: isBusyLoadingPicks }, undefined);
		};

		type Rec = { templates: DeferredPromise<IMcpResourceTemplate[]>; resourcesSoFar: IMcpResource[]; resources: DeferredPromise<unknown> };

		const servers = new Map<IMcpServer, Rec>();
		// Enumerate servers and start servers that need to be started to get capabilities
		Promise.all((this.explicitServers || this._mcpService.servers.get()).map(async server => {
			let cap = server.capabilities.get();
			const rec: Rec = {
				templates: new DeferredPromise(),
				resourcesSoFar: [],
				resources: new DeferredPromise(),
			};
			servers.set(server, rec); // always add it to retain order

			if (cap === undefined) {
				cap = await new Promise(resolve => {
					server.start().then(state => {
						if (state.state === McpConnectionState.Kind.Error || state.state === McpConnectionState.Kind.Stopped) {
							resolve(undefined);
						}
					});
					this._register(cts.token.onCancellationRequested(() => resolve(undefined)));
					this._register(autorun(reader => {
						const cap2 = server.capabilities.read(reader);
						if (cap2 !== undefined) {
							resolve(cap2);
						}
					}));
				});
			}

			if (cap && (cap & McpCapability.Resources)) {
				await Promise.all([
					rec.templates.settleWith(server.resourceTemplates(cts.token).catch(() => [])).finally(publish),
					rec.resources.settleWith((async () => {
						for await (const page of server.resources(cts.token)) {
							rec.resourcesSoFar = rec.resourcesSoFar.concat(page);
							publish();
						}
					})())
				]);
			} else {
				rec.templates.complete([]);
				rec.resources.complete([]);
			}
		})).finally(() => {
			isBusyLoadingPicks = false;
			publish();
		});

		// Use derived to compute the appropriate resource map based on directory navigation state
		return derived(this, reader => {
			const directoryResource = this._inDirectory.read(reader);
			return directoryResource
				? { picks: new Map([[directoryResource.server, directoryResource.resources]]), isBusy: false }
				: this._resources.read(reader);
		});
	}
}

export abstract class AbstractMcpResourceAccessPick {
	constructor(
		private readonly _scopeTo: IMcpServer | undefined,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IEditorService private readonly _editorService: IEditorService,
		@IChatWidgetService protected readonly _chatWidgetService: IChatWidgetService,
		@IViewsService private readonly _viewsService: IViewsService,
	) {
	}

	protected applyToPick(picker: IQuickPick<IQuickPickItem, { useSeparators: true }>, token: CancellationToken, runOptions?: IQuickAccessProviderRunOptions) {
		picker.canAcceptInBackground = true;
		picker.busy = true;
		picker.keepScrollPosition = true;
		const store = new DisposableStore();
		const goBackId = '_goback_';

		type ResourceQuickPickItem = IQuickPickItem & { resource: IMcpResource | IMcpResourceTemplate; server: IMcpServer };

		const attachButton = localize('mcp.quickaccess.attach', "Attach to chat");

		const helper = store.add(this._instantiationService.createInstance(McpResourcePickHelper));
		if (this._scopeTo) {
			helper.explicitServers = [this._scopeTo];
		}
		const picksObservable = helper.getPicks(token);
		store.add(autorun(reader => {
			const pickItems = picksObservable.read(reader);
			const isBusy = pickItems.isBusy;
			const items: (ResourceQuickPickItem | IQuickPickSeparator | IQuickPickItem)[] = [];
			for (const [server, resources] of pickItems.picks) {
				items.push(McpResourcePickHelper.sep(server));
				for (const resource of resources) {
					const pickItem = McpResourcePickHelper.item(resource);
					pickItem.buttons = [{ iconClass: ThemeIcon.asClassName(Codicon.attach), tooltip: attachButton }];
					items.push({ ...pickItem, resource, server });
				}
			}
			if (helper.checkIfNestedResources()) {
				// Add go back item
				const goBackItem: IQuickPickItem = {
					id: goBackId,
					label: localize('goBack', 'Go back ↩'),
					alwaysShow: true
				};
				items.push(goBackItem);
			}
			picker.items = items;
			picker.busy = isBusy;
		}));

		store.add(picker.onDidTriggerItemButton(event => {
			if (event.button.tooltip === attachButton) {
				picker.busy = true;
				const resourceItem = event.item as ResourceQuickPickItem;
				const attachment = helper.toAttachment(resourceItem.resource, resourceItem.server);
				if (attachment instanceof Promise) {
					attachment.then(async a => {
						if (a !== 'noop') {
							const widget = await openPanelChatAndGetWidget(this._viewsService, this._chatWidgetService);
							widget?.attachmentModel.addContext(...asArray(a));
						}
						picker.hide();
					});
				}
			}
		}));

		store.add(picker.onDidHide(() => {
			helper.dispose();
		}));

		store.add(picker.onDidAccept(async event => {
			try {
				picker.busy = true;
				const [item] = picker.selectedItems;

				// Check if go back item was selected
				if (item.id === goBackId) {
					helper.navigateBack();
					picker.busy = false;
					return;
				}

				const resourceItem = item as ResourceQuickPickItem;
				const resource = resourceItem.resource;
				// Try to navigate into the resource if it's a directory
				const isNested = await helper.navigate(resource, resourceItem.server);
				if (!isNested) {
					const uri = await helper.toURI(resource);
					if (uri) {
						picker.hide();
						this._editorService.openEditor({ resource: uri, options: { preserveFocus: event.inBackground } });
					}
				}
			} finally {
				picker.busy = false;
			}
		}));
		return store;
	}
}

export class McpResourceQuickPick extends AbstractMcpResourceAccessPick {
	constructor(
		scopeTo: IMcpServer | undefined,
		@IInstantiationService instantiationService: IInstantiationService,
		@IEditorService editorService: IEditorService,
		@IChatWidgetService chatWidgetService: IChatWidgetService,
		@IViewsService viewsService: IViewsService,
		@IQuickInputService private readonly _quickInputService: IQuickInputService,
	) {
		super(scopeTo, instantiationService, editorService, chatWidgetService, viewsService);
	}

	public async pick(token = CancellationToken.None) {
		const store = new DisposableStore();
		const qp = store.add(this._quickInputService.createQuickPick({ useSeparators: true }));
		qp.placeholder = localize('mcp.quickaccess.placeholder', "Search for resources");
		store.add(this.applyToPick(qp, token));
		store.add(qp.onDidHide(() => store.dispose()));
		qp.show();
		await Event.toPromise(qp.onDidHide);
	}
}

export class McpResourceQuickAccess extends AbstractMcpResourceAccessPick implements IQuickAccessProvider {
	public static readonly PREFIX = 'mcpr ';

	defaultFilterValue = DefaultQuickAccessFilterValue.LAST;

	constructor(
		@IInstantiationService instantiationService: IInstantiationService,
		@IEditorService editorService: IEditorService,
		@IChatWidgetService chatWidgetService: IChatWidgetService,
		@IViewsService viewsService: IViewsService
	) {
		super(undefined, instantiationService, editorService, chatWidgetService, viewsService);
	}

	provide(picker: IQuickPick<IQuickPickItem, { useSeparators: true }>, token: CancellationToken, runOptions?: IQuickAccessProviderRunOptions): IDisposable {
		return this.applyToPick(picker, token, runOptions);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/browser/mcpServerActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/browser/mcpServerActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getDomNodePagePosition } from '../../../../base/browser/dom.js';
import { ActionViewItem, IActionViewItemOptions } from '../../../../base/browser/ui/actionbar/actionViewItems.js';
import { alert } from '../../../../base/browser/ui/aria/aria.js';
import { Action, IAction, IActionChangeEvent, Separator } from '../../../../base/common/actions.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { IMarkdownString } from '../../../../base/common/htmlContent.js';
import { disposeIfDisposable } from '../../../../base/common/lifecycle.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { URI } from '../../../../base/common/uri.js';
import { localize } from '../../../../nls.js';
import { Location } from '../../../../editor/common/languages.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IAuthenticationService } from '../../../services/authentication/common/authentication.js';
import { IAccountQuery, IAuthenticationQueryService } from '../../../services/authentication/common/authenticationQuery.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { errorIcon, infoIcon, manageExtensionIcon, trustIcon, warningIcon } from '../../extensions/browser/extensionsIcons.js';
import { McpCommandIds } from '../common/mcpCommandIds.js';
import { IMcpRegistry } from '../common/mcpRegistryTypes.js';
import { IMcpSamplingService, IMcpServer, IMcpServerContainer, IMcpService, IMcpWorkbenchService, IWorkbenchMcpServer, McpCapability, McpConnectionState, McpServerEditorTab, McpServerInstallState } from '../common/mcpTypes.js';
import { startServerByFilter } from '../common/mcpTypesUtils.js';
import { ConfigurationTarget } from '../../../../platform/configuration/common/configuration.js';
import { IWorkspaceContextService, IWorkspaceFolder, WorkbenchState } from '../../../../platform/workspace/common/workspace.js';
import { IQuickInputService, QuickPickItem } from '../../../../platform/quickinput/common/quickInput.js';
import { IWorkbenchEnvironmentService } from '../../../services/environment/common/environmentService.js';
import { Schemas } from '../../../../base/common/network.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { LocalMcpServerScope } from '../../../services/mcp/common/mcpWorkbenchManagementService.js';
import { ExtensionAction } from '../../extensions/browser/extensionsActions.js';
import { ActionWithDropdownActionViewItem, IActionWithDropdownActionViewItemOptions } from '../../../../base/browser/ui/dropdown/dropdownActionViewItem.js';
import { IContextMenuProvider } from '../../../../base/browser/contextmenu.js';
import Severity from '../../../../base/common/severity.js';

export interface IMcpServerActionChangeEvent extends IActionChangeEvent {
	readonly hidden?: boolean;
	readonly menuActions?: IAction[];
}

export abstract class McpServerAction extends Action implements IMcpServerContainer {

	protected override _onDidChange = this._register(new Emitter<IMcpServerActionChangeEvent>());
	override get onDidChange() { return this._onDidChange.event; }

	static readonly EXTENSION_ACTION_CLASS = 'extension-action';
	static readonly TEXT_ACTION_CLASS = `${McpServerAction.EXTENSION_ACTION_CLASS} text`;
	static readonly LABEL_ACTION_CLASS = `${McpServerAction.EXTENSION_ACTION_CLASS} label`;
	static readonly PROMINENT_LABEL_ACTION_CLASS = `${McpServerAction.LABEL_ACTION_CLASS} prominent`;
	static readonly ICON_ACTION_CLASS = `${McpServerAction.EXTENSION_ACTION_CLASS} icon`;

	private _hidden: boolean = false;
	get hidden(): boolean { return this._hidden; }
	set hidden(hidden: boolean) {
		if (this._hidden !== hidden) {
			this._hidden = hidden;
			this._onDidChange.fire({ hidden });
		}
	}

	protected override _setEnabled(value: boolean): void {
		super._setEnabled(value);
		if (this.hideOnDisabled) {
			this.hidden = !value;
		}
	}

	protected hideOnDisabled: boolean = true;

	private _mcpServer: IWorkbenchMcpServer | null = null;
	get mcpServer(): IWorkbenchMcpServer | null { return this._mcpServer; }
	set mcpServer(mcpServer: IWorkbenchMcpServer | null) { this._mcpServer = mcpServer; this.update(); }

	abstract update(): void;
}

export class ButtonWithDropDownExtensionAction extends McpServerAction {

	private primaryAction: IAction | undefined;

	readonly menuActionClassNames: string[] = [];
	private _menuActions: IAction[] = [];
	get menuActions(): IAction[] { return [...this._menuActions]; }

	override get mcpServer(): IWorkbenchMcpServer | null {
		return super.mcpServer;
	}

	override set mcpServer(mcpServer: IWorkbenchMcpServer | null) {
		this.actions.forEach(a => a.mcpServer = mcpServer);
		super.mcpServer = mcpServer;
	}

	protected readonly actions: McpServerAction[];

	constructor(
		id: string,
		clazz: string,
		private readonly actionsGroups: McpServerAction[][],
	) {
		clazz = `${clazz} action-dropdown`;
		super(id, undefined, clazz);
		this.menuActionClassNames = clazz.split(' ');
		this.hideOnDisabled = false;
		this.actions = actionsGroups.flat();
		this.update();
		this._register(Event.any(...this.actions.map(a => a.onDidChange))(() => this.update(true)));
		this.actions.forEach(a => this._register(a));
	}

	update(donotUpdateActions?: boolean): void {
		if (!donotUpdateActions) {
			this.actions.forEach(a => a.update());
		}

		const actionsGroups = this.actionsGroups.map(actionsGroup => actionsGroup.filter(a => !a.hidden));

		let actions: IAction[] = [];
		for (const visibleActions of actionsGroups) {
			if (visibleActions.length) {
				actions = [...actions, ...visibleActions, new Separator()];
			}
		}
		actions = actions.length ? actions.slice(0, actions.length - 1) : actions;

		this.primaryAction = actions[0];
		this._menuActions = actions.length > 1 ? actions : [];
		this._onDidChange.fire({ menuActions: this._menuActions });

		if (this.primaryAction) {
			this.enabled = this.primaryAction.enabled;
			this.label = this.getLabel(this.primaryAction as ExtensionAction);
			this.tooltip = this.primaryAction.tooltip;
		} else {
			this.enabled = false;
		}
	}

	override async run(): Promise<void> {
		if (this.enabled) {
			await this.primaryAction?.run();
		}
	}

	protected getLabel(action: ExtensionAction): string {
		return action.label;
	}
}

export class ButtonWithDropdownExtensionActionViewItem extends ActionWithDropdownActionViewItem {

	constructor(
		action: ButtonWithDropDownExtensionAction,
		options: IActionViewItemOptions & IActionWithDropdownActionViewItemOptions,
		contextMenuProvider: IContextMenuProvider
	) {
		super(null, action, options, contextMenuProvider);
		this._register(action.onDidChange(e => {
			if (e.hidden !== undefined || e.menuActions !== undefined) {
				this.updateClass();
			}
		}));
	}

	override render(container: HTMLElement): void {
		super.render(container);
		this.updateClass();
	}

	protected override updateClass(): void {
		super.updateClass();
		if (this.element && this.dropdownMenuActionViewItem?.element) {
			this.element.classList.toggle('hide', (<ButtonWithDropDownExtensionAction>this._action).hidden);
			const isMenuEmpty = (<ButtonWithDropDownExtensionAction>this._action).menuActions.length === 0;
			this.element.classList.toggle('empty', isMenuEmpty);
			this.dropdownMenuActionViewItem.element.classList.toggle('hide', isMenuEmpty);
		}
	}

}

export abstract class DropDownAction extends McpServerAction {

	constructor(
		id: string,
		label: string,
		cssClass: string,
		enabled: boolean,
		@IInstantiationService protected instantiationService: IInstantiationService
	) {
		super(id, label, cssClass, enabled);
	}

	private _actionViewItem: DropDownExtensionActionViewItem | null = null;
	createActionViewItem(options: IActionViewItemOptions): DropDownExtensionActionViewItem {
		this._actionViewItem = this.instantiationService.createInstance(DropDownExtensionActionViewItem, this, options);
		return this._actionViewItem;
	}

	public override run(actionGroups: IAction[][]): Promise<void> {
		this._actionViewItem?.showMenu(actionGroups);
		return Promise.resolve();
	}
}

export class DropDownExtensionActionViewItem extends ActionViewItem {

	constructor(
		action: IAction,
		options: IActionViewItemOptions,
		@IContextMenuService private readonly contextMenuService: IContextMenuService
	) {
		super(null, action, { ...options, icon: true, label: true });
	}

	public showMenu(menuActionGroups: IAction[][]): void {
		if (this.element) {
			const actions = this.getActions(menuActionGroups);
			const elementPosition = getDomNodePagePosition(this.element);
			const anchor = { x: elementPosition.left, y: elementPosition.top + elementPosition.height + 10 };
			this.contextMenuService.showContextMenu({
				getAnchor: () => anchor,
				getActions: () => actions,
				actionRunner: this.actionRunner,
				onHide: () => disposeIfDisposable(actions)
			});
		}
	}

	private getActions(menuActionGroups: IAction[][]): IAction[] {
		let actions: IAction[] = [];
		for (const menuActions of menuActionGroups) {
			actions = [...actions, ...menuActions, new Separator()];
		}
		return actions.length ? actions.slice(0, actions.length - 1) : actions;
	}
}

export class InstallAction extends McpServerAction {

	static readonly CLASS = `${this.LABEL_ACTION_CLASS} prominent install`;
	private static readonly HIDE = `${this.CLASS} hide`;

	constructor(
		private readonly open: boolean,
		@IMcpWorkbenchService private readonly mcpWorkbenchService: IMcpWorkbenchService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IMcpService private readonly mcpService: IMcpService,
	) {
		super('extensions.install', localize('install', "Install"), InstallAction.CLASS, false);
		this.update();
	}

	update(): void {
		this.enabled = false;
		this.class = InstallAction.HIDE;
		if (!this.mcpServer?.gallery && !this.mcpServer?.installable) {
			return;
		}
		if (this.mcpServer.installState !== McpServerInstallState.Uninstalled) {
			return;
		}
		this.class = InstallAction.CLASS;
		this.enabled = this.mcpWorkbenchService.canInstall(this.mcpServer) === true;
	}

	override async run(): Promise<void> {
		if (!this.mcpServer) {
			return;
		}

		if (this.open) {
			this.mcpWorkbenchService.open(this.mcpServer);
			alert(localize('mcpServerInstallation', "Installing MCP Server {0} started. An editor is now open with more details on this MCP Server", this.mcpServer.label));
		}

		type McpServerInstallClassification = {
			owner: 'sandy081';
			comment: 'Used to understand if the action to install the MCP server is used.';
			name?: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The gallery name of the MCP server being installed' };
		};
		type McpServerInstall = {
			name?: string;
		};
		this.telemetryService.publicLog2<McpServerInstall, McpServerInstallClassification>('mcp:action:install', { name: this.mcpServer.gallery?.name });

		const installed = await this.mcpWorkbenchService.install(this.mcpServer);

		await startServerByFilter(this.mcpService, s => {
			return s.definition.label === installed.name;
		});
	}
}

export class InstallInWorkspaceAction extends McpServerAction {

	static readonly CLASS = `${this.LABEL_ACTION_CLASS} prominent install`;
	private static readonly HIDE = `${this.CLASS} hide`;

	constructor(
		private readonly open: boolean,
		@IMcpWorkbenchService private readonly mcpWorkbenchService: IMcpWorkbenchService,
		@IWorkspaceContextService private readonly workspaceService: IWorkspaceContextService,
		@IQuickInputService private readonly quickInputService: IQuickInputService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IMcpService private readonly mcpService: IMcpService,
	) {
		super('extensions.installWorkspace', localize('installInWorkspace', "Install in Workspace"), InstallAction.CLASS, false);
		this.update();
	}

	update(): void {
		this.enabled = false;
		this.class = InstallInWorkspaceAction.HIDE;
		if (this.workspaceService.getWorkbenchState() === WorkbenchState.EMPTY) {
			return;
		}
		if (!this.mcpServer?.gallery && !this.mcpServer?.installable) {
			return;
		}
		if (this.mcpServer.installState !== McpServerInstallState.Uninstalled && this.mcpServer.local?.scope === LocalMcpServerScope.Workspace) {
			return;
		}
		this.class = InstallAction.CLASS;
		this.enabled = this.mcpWorkbenchService.canInstall(this.mcpServer) === true;
	}

	override async run(): Promise<void> {
		if (!this.mcpServer) {
			return;
		}

		if (this.open) {
			this.mcpWorkbenchService.open(this.mcpServer, { preserveFocus: true });
			alert(localize('mcpServerInstallation', "Installing MCP Server {0} started. An editor is now open with more details on this MCP Server", this.mcpServer.label));
		}

		const target = await this.getConfigurationTarget();
		if (!target) {
			return;
		}

		type McpServerInstallClassification = {
			owner: 'sandy081';
			comment: 'Used to understand if the action to install the MCP server is used.';
			name?: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The gallery name of the MCP server being installed' };
		};
		type McpServerInstall = {
			name?: string;
		};
		this.telemetryService.publicLog2<McpServerInstall, McpServerInstallClassification>('mcp:action:install:workspace', { name: this.mcpServer.gallery?.name });

		const installed = await this.mcpWorkbenchService.install(this.mcpServer, { target });
		await startServerByFilter(this.mcpService, s => {
			return s.definition.label === installed.name;
		});
	}

	private async getConfigurationTarget(): Promise<ConfigurationTarget | IWorkspaceFolder | undefined> {
		type OptionQuickPickItem = QuickPickItem & { target?: ConfigurationTarget | IWorkspaceFolder };
		const options: OptionQuickPickItem[] = [];

		for (const folder of this.workspaceService.getWorkspace().folders) {
			options.push({ target: folder, label: folder.name, description: localize('install in workspace folder', "Workspace Folder") });
		}

		if (this.workspaceService.getWorkbenchState() === WorkbenchState.WORKSPACE) {
			if (options.length > 0) {
				options.push({ type: 'separator' });
			}
			options.push({ target: ConfigurationTarget.WORKSPACE, label: localize('mcp.target.workspace', "Workspace") });
		}

		if (options.length === 1) {
			return options[0].target;
		}

		const targetPick = await this.quickInputService.pick(options, {
			title: localize('mcp.target.title', "Choose where to install the MCP server"),
		});

		return (targetPick as OptionQuickPickItem)?.target;
	}
}

export class InstallInRemoteAction extends McpServerAction {

	static readonly CLASS = `${this.LABEL_ACTION_CLASS} prominent install`;
	private static readonly HIDE = `${this.CLASS} hide`;

	constructor(
		private readonly open: boolean,
		@IMcpWorkbenchService private readonly mcpWorkbenchService: IMcpWorkbenchService,
		@IWorkbenchEnvironmentService private readonly environmentService: IWorkbenchEnvironmentService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@ILabelService private readonly labelService: ILabelService,
		@IMcpService private readonly mcpService: IMcpService,
	) {
		super('extensions.installRemote', localize('installInRemote', "Install (Remote)"), InstallAction.CLASS, false);
		const remoteLabel = this.labelService.getHostLabel(Schemas.vscodeRemote, this.environmentService.remoteAuthority);
		this.label = localize('installInRemoteLabel', "Install in {0}", remoteLabel);
		this.update();
	}

	update(): void {
		this.enabled = false;
		this.class = InstallInRemoteAction.HIDE;
		if (!this.environmentService.remoteAuthority) {
			return;
		}
		if (!this.mcpServer?.gallery && !this.mcpServer?.installable) {
			return;
		}
		if (this.mcpServer.installState !== McpServerInstallState.Uninstalled) {
			if (this.mcpServer.local?.scope === LocalMcpServerScope.RemoteUser) {
				return;
			}
			if (this.mcpWorkbenchService.local.find(mcpServer => mcpServer.name === this.mcpServer?.name && mcpServer.local?.scope === LocalMcpServerScope.RemoteUser)) {
				return;
			}
		}
		this.class = InstallAction.CLASS;
		this.enabled = this.mcpWorkbenchService.canInstall(this.mcpServer) === true;
	}

	override async run(): Promise<void> {
		if (!this.mcpServer) {
			return;
		}

		if (this.open) {
			this.mcpWorkbenchService.open(this.mcpServer);
			alert(localize('mcpServerInstallation', "Installing MCP Server {0} started. An editor is now open with more details on this MCP Server", this.mcpServer.label));
		}

		type McpServerInstallClassification = {
			owner: 'sandy081';
			comment: 'Used to understand if the action to install the MCP server is used.';
			name?: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The gallery name of the MCP server being installed' };
		};
		type McpServerInstall = {
			name?: string;
		};
		this.telemetryService.publicLog2<McpServerInstall, McpServerInstallClassification>('mcp:action:install:remote', { name: this.mcpServer.gallery?.name });

		const installed = await this.mcpWorkbenchService.install(this.mcpServer, { target: ConfigurationTarget.USER_REMOTE });
		await startServerByFilter(this.mcpService, s => {
			return s.definition.label === installed.name;
		});
	}

}

export class InstallingLabelAction extends McpServerAction {

	private static readonly LABEL = localize('installing', "Installing");
	private static readonly CLASS = `${McpServerAction.LABEL_ACTION_CLASS} install installing`;

	constructor() {
		super('extension.installing', InstallingLabelAction.LABEL, InstallingLabelAction.CLASS, false);
	}

	update(): void {
		this.class = `${InstallingLabelAction.CLASS}${this.mcpServer && this.mcpServer.installState === McpServerInstallState.Installing ? '' : ' hide'}`;
	}
}

export class UninstallAction extends McpServerAction {

	static readonly CLASS = `${this.LABEL_ACTION_CLASS} prominent uninstall`;
	private static readonly HIDE = `${this.CLASS} hide`;

	constructor(
		@IMcpWorkbenchService private readonly mcpWorkbenchService: IMcpWorkbenchService,
	) {
		super('extensions.uninstall', localize('uninstall', "Uninstall"), UninstallAction.CLASS, false);
		this.update();
	}

	update(): void {
		this.enabled = false;
		this.class = UninstallAction.HIDE;
		if (!this.mcpServer) {
			return;
		}
		if (!this.mcpServer.local) {
			return;
		}
		if (this.mcpServer.installState !== McpServerInstallState.Installed) {
			this.enabled = false;
			return;
		}
		this.class = UninstallAction.CLASS;
		this.enabled = true;
		this.label = localize('uninstall', "Uninstall");
	}

	override async run(): Promise<void> {
		if (!this.mcpServer) {
			return;
		}
		await this.mcpWorkbenchService.uninstall(this.mcpServer);
	}
}

export function getContextMenuActions(mcpServer: IWorkbenchMcpServer, isEditorAction: boolean, instantiationService: IInstantiationService): IAction[][] {
	return instantiationService.invokeFunction(accessor => {
		const workspaceService = accessor.get(IWorkspaceContextService);
		const environmentService = accessor.get(IWorkbenchEnvironmentService);

		const groups: McpServerAction[][] = [];
		const isInstalled = mcpServer.installState === McpServerInstallState.Installed;

		if (isInstalled) {
			groups.push([
				instantiationService.createInstance(StartServerAction),
			]);
			groups.push([
				instantiationService.createInstance(StopServerAction),
				instantiationService.createInstance(RestartServerAction),
			]);
			groups.push([
				instantiationService.createInstance(AuthServerAction),
			]);
			groups.push([
				instantiationService.createInstance(ShowServerOutputAction),
				instantiationService.createInstance(ShowServerConfigurationAction),
				instantiationService.createInstance(ShowServerJsonConfigurationAction),
			]);
			groups.push([
				instantiationService.createInstance(ConfigureModelAccessAction),
				instantiationService.createInstance(ShowSamplingRequestsAction),
			]);
			groups.push([
				instantiationService.createInstance(BrowseResourcesAction),
			]);
			if (!isEditorAction) {
				const installGroup: McpServerAction[] = [instantiationService.createInstance(UninstallAction)];
				if (workspaceService.getWorkbenchState() !== WorkbenchState.EMPTY) {
					installGroup.push(instantiationService.createInstance(InstallInWorkspaceAction, false));
				}
				if (environmentService.remoteAuthority && mcpServer.local?.scope !== LocalMcpServerScope.RemoteUser) {
					installGroup.push(instantiationService.createInstance(InstallInRemoteAction, false));
				}
				groups.push(installGroup);
			}
		} else {
			const installGroup = [];
			if (workspaceService.getWorkbenchState() !== WorkbenchState.EMPTY) {
				installGroup.push(instantiationService.createInstance(InstallInWorkspaceAction, !isEditorAction));
			}
			if (environmentService.remoteAuthority) {
				installGroup.push(instantiationService.createInstance(InstallInRemoteAction, !isEditorAction));
			}
			groups.push(installGroup);
		}
		groups.forEach(group => group.forEach(extensionAction => extensionAction.mcpServer = mcpServer));

		return groups;
	});
}

export class ManageMcpServerAction extends DropDownAction {

	static readonly ID = 'mcpServer.manage';

	private static readonly Class = `${McpServerAction.ICON_ACTION_CLASS} manage ` + ThemeIcon.asClassName(manageExtensionIcon);
	private static readonly HideManageExtensionClass = `${this.Class} hide`;

	constructor(
		private readonly isEditorAction: boolean,
		@IInstantiationService instantiationService: IInstantiationService,
	) {

		super(ManageMcpServerAction.ID, '', '', true, instantiationService);
		this.tooltip = localize('manage', "Manage");
		this.update();
	}

	override async run(): Promise<void> {
		return super.run(this.mcpServer ? getContextMenuActions(this.mcpServer, this.isEditorAction, this.instantiationService) : []);
	}

	update(): void {
		this.class = ManageMcpServerAction.HideManageExtensionClass;
		this.enabled = false;
		if (!this.mcpServer) {
			return;
		}
		if (this.isEditorAction) {
			this.enabled = true;
			this.class = ManageMcpServerAction.Class;
		} else {
			this.enabled = !!this.mcpServer.local;
			this.class = this.enabled ? ManageMcpServerAction.Class : ManageMcpServerAction.HideManageExtensionClass;
		}
	}
}

export class StartServerAction extends McpServerAction {

	static readonly CLASS = `${this.LABEL_ACTION_CLASS} prominent start`;
	private static readonly HIDE = `${this.CLASS} hide`;

	constructor(
		@IMcpService private readonly mcpService: IMcpService,
	) {
		super('extensions.start', localize('start', "Start Server"), StartServerAction.CLASS, false);
		this.update();
	}

	update(): void {
		this.enabled = false;
		this.class = StartServerAction.HIDE;
		const server = this.getServer();
		if (!server) {
			return;
		}
		const serverState = server.connectionState.get();
		if (!McpConnectionState.canBeStarted(serverState.state)) {
			return;
		}
		this.class = StartServerAction.CLASS;
		this.enabled = true;
		this.label = localize('start', "Start Server");
	}

	override async run(): Promise<void> {
		const server = this.getServer();
		if (!server) {
			return;
		}
		await server.start({ promptType: 'all-untrusted' });
		server.showOutput();
	}

	private getServer(): IMcpServer | undefined {
		if (!this.mcpServer) {
			return;
		}
		if (!this.mcpServer.local) {
			return;
		}
		return this.mcpService.servers.get().find(s => s.definition.id === this.mcpServer?.id);
	}
}

export class StopServerAction extends McpServerAction {

	static readonly CLASS = `${this.LABEL_ACTION_CLASS} prominent stop`;
	private static readonly HIDE = `${this.CLASS} hide`;

	constructor(
		@IMcpService private readonly mcpService: IMcpService,
	) {
		super('extensions.stop', localize('stop', "Stop Server"), StopServerAction.CLASS, false);
		this.update();
	}

	update(): void {
		this.enabled = false;
		this.class = StopServerAction.HIDE;
		const server = this.getServer();
		if (!server) {
			return;
		}
		const serverState = server.connectionState.get();
		if (McpConnectionState.canBeStarted(serverState.state)) {
			return;
		}
		this.class = StopServerAction.CLASS;
		this.enabled = true;
		this.label = localize('stop', "Stop Server");
	}

	override async run(): Promise<void> {
		const server = this.getServer();
		if (!server) {
			return;
		}
		await server.stop();
	}

	private getServer(): IMcpServer | undefined {
		if (!this.mcpServer) {
			return;
		}
		if (!this.mcpServer.local) {
			return;
		}
		return this.mcpService.servers.get().find(s => s.definition.id === this.mcpServer?.id);
	}
}

export class RestartServerAction extends McpServerAction {

	static readonly CLASS = `${this.LABEL_ACTION_CLASS} prominent restart`;
	private static readonly HIDE = `${this.CLASS} hide`;

	constructor(
		@IMcpService private readonly mcpService: IMcpService,
	) {
		super('extensions.restart', localize('restart', "Restart Server"), RestartServerAction.CLASS, false);
		this.update();
	}

	update(): void {
		this.enabled = false;
		this.class = RestartServerAction.HIDE;
		const server = this.getServer();
		if (!server) {
			return;
		}
		const serverState = server.connectionState.get();
		if (McpConnectionState.canBeStarted(serverState.state)) {
			return;
		}
		this.class = RestartServerAction.CLASS;
		this.enabled = true;
		this.label = localize('restart', "Restart Server");
	}

	override async run(): Promise<void> {
		const server = this.getServer();
		if (!server) {
			return;
		}
		await server.stop();
		await server.start({ promptType: 'all-untrusted' });
		server.showOutput();
	}

	private getServer(): IMcpServer | undefined {
		if (!this.mcpServer) {
			return;
		}
		if (!this.mcpServer.local) {
			return;
		}
		return this.mcpService.servers.get().find(s => s.definition.id === this.mcpServer?.id);
	}
}

export class AuthServerAction extends McpServerAction {

	static readonly CLASS = `${this.LABEL_ACTION_CLASS} prominent account`;
	private static readonly HIDE = `${this.CLASS} hide`;

	private static readonly SIGN_OUT = localize('mcp.signOut', 'Sign Out');
	private static readonly DISCONNECT = localize('mcp.disconnect', 'Disconnect Account');

	private _accountQuery: IAccountQuery | undefined;

	constructor(
		@IMcpService private readonly mcpService: IMcpService,
		@IAuthenticationQueryService private readonly _authenticationQueryService: IAuthenticationQueryService,
		@IAuthenticationService private readonly _authenticationService: IAuthenticationService
	) {
		super('extensions.restart', localize('restart', "Restart Server"), RestartServerAction.CLASS, false);
		this.update();
	}

	update(): void {
		this.enabled = false;
		this.class = AuthServerAction.HIDE;
		const server = this.getServer();
		if (!server) {
			return;
		}
		const accountQuery = this.getAccountQuery();
		if (!accountQuery) {
			return;
		}
		this._accountQuery = accountQuery;
		this.class = AuthServerAction.CLASS;
		this.enabled = true;
		let label = accountQuery.entities().getEntityCount().total > 1 ? AuthServerAction.DISCONNECT : AuthServerAction.SIGN_OUT;
		label += ` (${accountQuery.accountName})`;
		this.label = label;
	}

	override async run(): Promise<void> {
		const server = this.getServer();
		if (!server) {
			return;
		}
		const accountQuery = this.getAccountQuery();
		if (!accountQuery) {
			return;
		}
		await server.stop();
		const { providerId, accountName } = accountQuery;
		accountQuery.mcpServer(server.definition.id).setAccessAllowed(false, server.definition.label);
		if (this.label === AuthServerAction.SIGN_OUT) {
			const accounts = await this._authenticationService.getAccounts(providerId);
			const account = accounts.find(a => a.label === accountName);
			if (account) {
				const sessions = await this._authenticationService.getSessions(providerId, undefined, { account });
				for (const session of sessions) {
					await this._authenticationService.removeSession(providerId, session.id);
				}
			}
		}
	}

	private getServer(): IMcpServer | undefined {
		if (!this.mcpServer) {
			return;
		}
		if (!this.mcpServer.local) {
			return;
		}
		return this.mcpService.servers.get().find(s => s.definition.id === this.mcpServer?.id);
	}

	private getAccountQuery(): IAccountQuery | undefined {
		const server = this.getServer();
		if (!server) {
			return undefined;
		}
		if (this._accountQuery) {
			return this._accountQuery;
		}
		const serverId = server.definition.id;
		const preferences = this._authenticationQueryService.mcpServer(serverId).getAllAccountPreferences();
		if (!preferences.size) {
			return undefined;
		}
		for (const [providerId, accountName] of preferences) {
			const accountQuery = this._authenticationQueryService.provider(providerId).account(accountName);
			if (!accountQuery.mcpServer(serverId).isAccessAllowed()) {
				continue; // skip accounts that are not allowed
			}
			return accountQuery;
		}
		return undefined;
	}

}

export class ShowServerOutputAction extends McpServerAction {

	static readonly CLASS = `${this.LABEL_ACTION_CLASS} prominent output`;
	private static readonly HIDE = `${this.CLASS} hide`;

	constructor(
		@IMcpService private readonly mcpService: IMcpService,
	) {
		super('extensions.output', localize('output', "Show Output"), ShowServerOutputAction.CLASS, false);
		this.update();
	}

	update(): void {
		this.enabled = false;
		this.class = ShowServerOutputAction.HIDE;
		const server = this.getServer();
		if (!server) {
			return;
		}
		this.class = ShowServerOutputAction.CLASS;
		this.enabled = true;
		this.label = localize('output', "Show Output");
	}

	override async run(): Promise<void> {
		const server = this.getServer();
		if (!server) {
			return;
		}
		server.showOutput();
	}

	private getServer(): IMcpServer | undefined {
		if (!this.mcpServer) {
			return;
		}
		if (!this.mcpServer.local) {
			return;
		}
		return this.mcpService.servers.get().find(s => s.definition.id === this.mcpServer?.id);
	}
}

export class ShowServerConfigurationAction extends McpServerAction {

	static readonly CLASS = `${this.LABEL_ACTION_CLASS} prominent config`;
	private static readonly HIDE = `${this.CLASS} hide`;

	constructor(
		@IMcpWorkbenchService private readonly mcpWorkbenchService: IMcpWorkbenchService
	) {
		super('extensions.config', localize('config', "Show Configuration"), ShowServerConfigurationAction.CLASS, false);
		this.update();
	}

	update(): void {
		this.enabled = false;
		this.class = ShowServerConfigurationAction.HIDE;
		if (!this.mcpServer?.local) {
			return;
		}
		this.class = ShowServerConfigurationAction.CLASS;
		this.enabled = true;
	}

	override async run(): Promise<void> {
		if (!this.mcpServer?.local) {
			return;
		}
		this.mcpWorkbenchService.open(this.mcpServer, { tab: McpServerEditorTab.Configuration });
	}

}

export class ShowServerJsonConfigurationAction extends McpServerAction {

	static readonly CLASS = `${this.LABEL_ACTION_CLASS} prominent config`;
	private static readonly HIDE = `${this.CLASS} hide`;

	constructor(
		@IMcpService private readonly mcpService: IMcpService,
		@IMcpRegistry private readonly mcpRegistry: IMcpRegistry,
		@IEditorService private readonly editorService: IEditorService,
	) {
		super('extensions.jsonConfig', localize('configJson', "Show Configuration (JSON)"), ShowServerJsonConfigurationAction.CLASS, false);
		this.update();
	}

	update(): void {
		this.enabled = false;
		this.class = ShowServerJsonConfigurationAction.HIDE;
		const configurationTarget = this.getConfigurationTarget();
		if (!configurationTarget) {
			return;
		}
		this.class = ShowServerConfigurationAction.CLASS;
		this.enabled = true;
	}

	override async run(): Promise<void> {
		const configurationTarget = this.getConfigurationTarget();
		if (!configurationTarget) {
			return;
		}
		this.editorService.openEditor({
			resource: URI.isUri(configurationTarget) ? configurationTarget : configurationTarget!.uri,
			options: { selection: URI.isUri(configurationTarget) ? undefined : configurationTarget!.range }
		});
	}

	private getConfigurationTarget(): Location | URI | undefined {
		if (!this.mcpServer) {
			return;
		}
		if (!this.mcpServer.local) {
			return;
		}
		const server = this.mcpService.servers.get().find(s => s.definition.label === this.mcpServer?.name);
		if (!server) {
			return;
		}
		const collection = this.mcpRegistry.collections.get().find(c => c.id === server.collection.id);
		const serverDefinition = collection?.serverDefinitions.get().find(s => s.id === server.definition.id);
		return serverDefinition?.presentation?.origin || collection?.presentation?.origin;
	}
}

export class ConfigureModelAccessAction extends McpServerAction {

	static readonly CLASS = `${this.LABEL_ACTION_CLASS} prominent config`;
	private static readonly HIDE = `${this.CLASS} hide`;

	constructor(
		@IMcpService private readonly mcpService: IMcpService,
		@ICommandService private readonly commandService: ICommandService,
	) {
		super('extensions.config', localize('mcp.configAccess', 'Configure Model Access'), ConfigureModelAccessAction.CLASS, false);
		this.update();
	}

	update(): void {
		this.enabled = false;
		this.class = ConfigureModelAccessAction.HIDE;
		const server = this.getServer();
		if (!server) {
			return;
		}
		this.class = ConfigureModelAccessAction.CLASS;
		this.enabled = true;
		this.label = localize('mcp.configAccess', 'Configure Model Access');
	}

	override async run(): Promise<void> {
		const server = this.getServer();
		if (!server) {
			return;
		}
		this.commandService.executeCommand(McpCommandIds.ConfigureSamplingModels, server);
	}

	private getServer(): IMcpServer | undefined {
		if (!this.mcpServer) {
			return;
		}
		if (!this.mcpServer.local) {
			return;
		}
		return this.mcpService.servers.get().find(s => s.definition.id === this.mcpServer?.id);
	}
}

export class ShowSamplingRequestsAction extends McpServerAction {

	static readonly CLASS = `${this.LABEL_ACTION_CLASS} prominent config`;
	private static readonly HIDE = `${this.CLASS} hide`;

	constructor(
		@IMcpService private readonly mcpService: IMcpService,
		@IMcpSamplingService private readonly samplingService: IMcpSamplingService,
		@IEditorService private readonly editorService: IEditorService,
	) {
		super('extensions.config', localize('mcp.samplingLog', 'Show Sampling Requests'), ShowSamplingRequestsAction.CLASS, false);
		this.update();
	}

	update(): void {
		this.enabled = false;
		this.class = ShowSamplingRequestsAction.HIDE;
		const server = this.getServer();
		if (!server) {
			return;
		}
		if (!this.samplingService.hasLogs(server)) {
			return;
		}
		this.class = ShowSamplingRequestsAction.CLASS;
		this.enabled = true;
	}

	override async run(): Promise<void> {
		const server = this.getServer();
		if (!server) {
			return;
		}
		if (!this.samplingService.hasLogs(server)) {
			return;
		}
		this.editorService.openEditor({
			resource: undefined,
			contents: this.samplingService.getLogText(server),
			label: localize('mcp.samplingLog.title', 'MCP Sampling: {0}', server.definition.label),
		});
	}

	private getServer(): IMcpServer | undefined {
		if (!this.mcpServer) {
			return;
		}
		if (!this.mcpServer.local) {
			return;
		}
		return this.mcpService.servers.get().find(s => s.definition.id === this.mcpServer?.id);
	}
}

export class BrowseResourcesAction extends McpServerAction {

	static readonly CLASS = `${this.LABEL_ACTION_CLASS} prominent config`;
	private static readonly HIDE = `${this.CLASS} hide`;

	constructor(
		@IMcpService private readonly mcpService: IMcpService,
		@ICommandService private readonly commandService: ICommandService,
	) {
		super('extensions.config', localize('mcp.resources', 'Browse Resources'), BrowseResourcesAction.CLASS, false);
		this.update();
	}

	update(): void {
		this.enabled = false;
		this.class = BrowseResourcesAction.HIDE;
		const server = this.getServer();
		if (!server) {
			return;
		}
		const capabilities = server.capabilities.get();
		if (capabilities !== undefined && !(capabilities & McpCapability.Resources)) {
			return;
		}
		this.class = BrowseResourcesAction.CLASS;
		this.enabled = true;
	}

	override async run(): Promise<void> {
		const server = this.getServer();
		if (!server) {
			return;
		}
		const capabilities = server.capabilities.get();
		if (capabilities !== undefined && !(capabilities & McpCapability.Resources)) {
			return;
		}
		return this.commandService.executeCommand(McpCommandIds.BrowseResources, server);
	}

	private getServer(): IMcpServer | undefined {
		if (!this.mcpServer) {
			return;
		}
		if (!this.mcpServer.local) {
			return;
		}
		return this.mcpService.servers.get().find(s => s.definition.id === this.mcpServer?.id);
	}
}

export type McpServerStatus = { readonly message: IMarkdownString; readonly icon?: ThemeIcon };

export class McpServerStatusAction extends McpServerAction {

	private static readonly CLASS = `${McpServerAction.ICON_ACTION_CLASS} extension-status`;

	private _status: McpServerStatus[] = [];
	get status(): McpServerStatus[] { return this._status; }

	private readonly _onDidChangeStatus = this._register(new Emitter<void>());
	readonly onDidChangeStatus = this._onDidChangeStatus.event;

	constructor(
		@IMcpWorkbenchService private readonly mcpWorkbenchService: IMcpWorkbenchService,
		@ICommandService private readonly commandService: ICommandService,
	) {
		super('extensions.status', '', `${McpServerStatusAction.CLASS} hide`, false);
		this.update();
	}

	update(): void {
		this.computeAndUpdateStatus();
	}

	private computeAndUpdateStatus(): void {
		this.updateStatus(undefined, true);
		this.enabled = false;

		if (!this.mcpServer) {
			return;
		}

		if ((this.mcpServer.gallery || this.mcpServer.installable) && this.mcpServer.installState === McpServerInstallState.Uninstalled) {
			const result = this.mcpWorkbenchService.canInstall(this.mcpServer);
			if (result !== true) {
				this.updateStatus({ icon: warningIcon, message: result }, true);
				return;
			}
		}

		const runtimeState = this.mcpServer.runtimeStatus;
		if (runtimeState?.message) {
			this.updateStatus({ icon: runtimeState.message.severity === Severity.Warning ? warningIcon : runtimeState.message.severity === Severity.Error ? errorIcon : infoIcon, message: runtimeState.message.text }, true);
		}
	}

	private updateStatus(status: McpServerStatus | undefined, updateClass: boolean): void {
		if (status) {
			if (this._status.some(s => s.message.value === status.message.value && s.icon?.id === status.icon?.id)) {
				return;
			}
		} else {
			if (this._status.length === 0) {
				return;
			}
			this._status = [];
		}

		if (status) {
			this._status.push(status);
			this._status.sort((a, b) =>
				b.icon === trustIcon ? -1 :
					a.icon === trustIcon ? 1 :
						b.icon === errorIcon ? -1 :
							a.icon === errorIcon ? 1 :
								b.icon === warningIcon ? -1 :
									a.icon === warningIcon ? 1 :
										b.icon === infoIcon ? -1 :
											a.icon === infoIcon ? 1 :
												0
			);
		}

		if (updateClass) {
			if (status?.icon === errorIcon) {
				this.class = `${McpServerStatusAction.CLASS} extension-status-error ${ThemeIcon.asClassName(errorIcon)}`;
			}
			else if (status?.icon === warningIcon) {
				this.class = `${McpServerStatusAction.CLASS} extension-status-warning ${ThemeIcon.asClassName(warningIcon)}`;
			}
			else if (status?.icon === infoIcon) {
				this.class = `${McpServerStatusAction.CLASS} extension-status-info ${ThemeIcon.asClassName(infoIcon)}`;
			}
			else if (status?.icon === trustIcon) {
				this.class = `${McpServerStatusAction.CLASS} ${ThemeIcon.asClassName(trustIcon)}`;
			}
			else {
				this.class = `${McpServerStatusAction.CLASS} hide`;
			}
		}
		this._onDidChangeStatus.fire();
	}

	override async run(): Promise<void> {
		if (this._status[0]?.icon === trustIcon) {
			return this.commandService.executeCommand('workbench.trust.manage');
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/browser/mcpServerEditor.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/browser/mcpServerEditor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/mcpServerEditor.css';
import { $, Dimension, append, clearNode, setParentFlowTo } from '../../../../base/browser/dom.js';
import { ActionBar } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { getDefaultHoverDelegate } from '../../../../base/browser/ui/hover/hoverDelegateFactory.js';
import { DomScrollableElement } from '../../../../base/browser/ui/scrollbar/scrollableElement.js';
import { Action, IAction } from '../../../../base/common/actions.js';
import * as arrays from '../../../../base/common/arrays.js';
import { Cache, CacheResult } from '../../../../base/common/cache.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { isCancellationError } from '../../../../base/common/errors.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable, DisposableStore, MutableDisposable, dispose, toDisposable } from '../../../../base/common/lifecycle.js';
import { Schemas, matchesScheme } from '../../../../base/common/network.js';
import { URI } from '../../../../base/common/uri.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import { TokenizationRegistry } from '../../../../editor/common/languages.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { generateTokensCSSForColorMap } from '../../../../editor/common/languages/supports/tokenization.js';
import { localize } from '../../../../nls.js';
import { IContextKeyService, IScopedContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { EditorPane } from '../../../browser/parts/editor/editorPane.js';
import { IEditorOpenContext } from '../../../common/editor.js';
import { DEFAULT_MARKDOWN_STYLES, renderMarkdownDocument } from '../../markdown/browser/markdownDocumentRenderer.js';
import { IWebview, IWebviewService } from '../../webview/browser/webview.js';
import { IEditorGroup } from '../../../services/editor/common/editorGroupsService.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { IMcpServerContainer, IMcpServerEditorOptions, IMcpWorkbenchService, IWorkbenchMcpServer, McpServerContainers, McpServerInstallState } from '../common/mcpTypes.js';
import { StarredWidget, McpServerIconWidget, McpServerStatusWidget, McpServerWidget, onClick, PublisherWidget, McpServerScopeBadgeWidget, LicenseWidget } from './mcpServerWidgets.js';
import { ButtonWithDropDownExtensionAction, ButtonWithDropdownExtensionActionViewItem, DropDownAction, InstallAction, InstallingLabelAction, InstallInRemoteAction, InstallInWorkspaceAction, ManageMcpServerAction, McpServerStatusAction, UninstallAction } from './mcpServerActions.js';
import { McpServerEditorInput } from './mcpServerEditorInput.js';
import { ILocalMcpServer, IGalleryMcpServerConfiguration, IMcpServerPackage, IMcpServerKeyValueInput, RegistryType } from '../../../../platform/mcp/common/mcpManagement.js';
import { IActionViewItemOptions } from '../../../../base/browser/ui/actionbar/actionViewItems.js';
import { McpServerType } from '../../../../platform/mcp/common/mcpPlatformTypes.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { getMcpGalleryManifestResourceUri, IMcpGalleryManifestService, McpGalleryResourceType } from '../../../../platform/mcp/common/mcpGalleryManifest.js';
import { fromNow } from '../../../../base/common/date.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';

const enum McpServerEditorTab {
	Readme = 'readme',
	Configuration = 'configuration',
	Manifest = 'manifest',
}

class NavBar extends Disposable {

	private _onChange = this._register(new Emitter<{ id: string | null; focus: boolean }>());
	get onChange(): Event<{ id: string | null; focus: boolean }> { return this._onChange.event; }

	private _currentId: string | null = null;
	get currentId(): string | null { return this._currentId; }

	private actions: Action[];
	private actionbar: ActionBar;

	constructor(container: HTMLElement) {
		super();
		const element = append(container, $('.navbar'));
		this.actions = [];
		this.actionbar = this._register(new ActionBar(element));
	}

	push(id: string, label: string, tooltip: string, index?: number): void {
		const action = new Action(id, label, undefined, true, () => this.update(id, true));

		action.tooltip = tooltip;

		if (typeof index === 'number') {
			this.actions.splice(index, 0, action);
		} else {
			this.actions.push(action);
		}
		this.actionbar.push(action, { index });

		if (this.actions.length === 1) {
			this.update(id);
		}
	}

	remove(id: string): void {
		const index = this.actions.findIndex(action => action.id === id);
		if (index !== -1) {
			this.actions.splice(index, 1);
			this.actionbar.pull(index);
			if (this._currentId === id) {
				this.switch(this.actions[0]?.id);
			}
		}
	}

	clear(): void {
		this.actions = dispose(this.actions);
		this.actionbar.clear();
	}

	switch(id: string): boolean {
		const action = this.actions.find(action => action.id === id);
		if (action) {
			action.run();
			return true;
		}
		return false;
	}

	has(id: string): boolean {
		return this.actions.some(action => action.id === id);
	}

	private update(id: string, focus?: boolean): void {
		this._currentId = id;
		this._onChange.fire({ id, focus: !!focus });
		this.actions.forEach(a => a.checked = a.id === id);
	}
}

interface ILayoutParticipant {
	layout(): void;
}

interface IActiveElement {
	focus(): void;
}

interface IExtensionEditorTemplate {
	name: HTMLElement;
	description: HTMLElement;
	actionsAndStatusContainer: HTMLElement;
	actionBar: ActionBar;
	navbar: NavBar;
	content: HTMLElement;
	header: HTMLElement;
	mcpServer: IWorkbenchMcpServer;
}

const enum WebviewIndex {
	Readme,
	Changelog
}

export class McpServerEditor extends EditorPane {

	static readonly ID: string = 'workbench.editor.mcpServer';

	private readonly _scopedContextKeyService = this._register(new MutableDisposable<IScopedContextKeyService>());
	private template: IExtensionEditorTemplate | undefined;

	private mcpServerReadme: Cache<string> | null;
	private mcpServerManifest: Cache<IGalleryMcpServerConfiguration> | null;

	// Some action bar items use a webview whose vertical scroll position we track in this map
	private initialScrollProgress: Map<WebviewIndex, number> = new Map();

	// Spot when an ExtensionEditor instance gets reused for a different extension, in which case the vertical scroll positions must be zeroed
	private currentIdentifier: string = '';

	private layoutParticipants: ILayoutParticipant[] = [];
	private readonly contentDisposables = this._register(new DisposableStore());
	private readonly transientDisposables = this._register(new DisposableStore());
	private activeElement: IActiveElement | null = null;
	private dimension: Dimension | undefined;

	constructor(
		group: IEditorGroup,
		@ITelemetryService telemetryService: ITelemetryService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IThemeService themeService: IThemeService,
		@INotificationService private readonly notificationService: INotificationService,
		@IOpenerService private readonly openerService: IOpenerService,
		@IStorageService storageService: IStorageService,
		@IExtensionService private readonly extensionService: IExtensionService,
		@IWebviewService private readonly webviewService: IWebviewService,
		@ILanguageService private readonly languageService: ILanguageService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IMcpWorkbenchService private readonly mcpWorkbenchService: IMcpWorkbenchService,
		@IHoverService private readonly hoverService: IHoverService,
		@IContextMenuService private readonly contextMenuService: IContextMenuService,
	) {
		super(McpServerEditor.ID, group, telemetryService, themeService, storageService);
		this.mcpServerReadme = null;
		this.mcpServerManifest = null;
	}

	override get scopedContextKeyService(): IContextKeyService | undefined {
		return this._scopedContextKeyService.value;
	}

	protected createEditor(parent: HTMLElement): void {
		const root = append(parent, $('.extension-editor.mcp-server-editor'));
		this._scopedContextKeyService.value = this.contextKeyService.createScoped(root);
		this._scopedContextKeyService.value.createKey('inExtensionEditor', true);

		root.tabIndex = 0; // this is required for the focus tracker on the editor
		root.style.outline = 'none';
		root.setAttribute('role', 'document');
		const header = append(root, $('.header'));

		const iconContainer = append(header, $('.icon-container'));
		const iconWidget = this.instantiationService.createInstance(McpServerIconWidget, iconContainer);
		const scopeWidget = this.instantiationService.createInstance(McpServerScopeBadgeWidget, iconContainer);

		const details = append(header, $('.details'));
		const title = append(details, $('.title'));
		const name = append(title, $('span.name.clickable', { role: 'heading', tabIndex: 0 }));
		this._register(this.hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), name, localize('name', "Extension name")));

		const subtitle = append(details, $('.subtitle'));
		const subTitleEntryContainers: HTMLElement[] = [];

		const publisherContainer = append(subtitle, $('.subtitle-entry'));
		subTitleEntryContainers.push(publisherContainer);
		const publisherWidget = this.instantiationService.createInstance(PublisherWidget, publisherContainer, false);

		const starredContainer = append(subtitle, $('.subtitle-entry'));
		subTitleEntryContainers.push(starredContainer);
		const installCountWidget = this.instantiationService.createInstance(StarredWidget, starredContainer, false);

		const licenseContainer = append(subtitle, $('.subtitle-entry'));
		subTitleEntryContainers.push(licenseContainer);
		const licenseWidget = this.instantiationService.createInstance(LicenseWidget, licenseContainer);

		const widgets: McpServerWidget[] = [
			iconWidget,
			publisherWidget,
			installCountWidget,
			scopeWidget,
			licenseWidget
		];

		const description = append(details, $('.description'));

		const actions = [
			this.instantiationService.createInstance(InstallAction, false),
			this.instantiationService.createInstance(InstallingLabelAction),
			this.instantiationService.createInstance(ButtonWithDropDownExtensionAction, 'extensions.uninstall', UninstallAction.CLASS, [
				[
					this.instantiationService.createInstance(UninstallAction),
					this.instantiationService.createInstance(InstallInWorkspaceAction, false),
					this.instantiationService.createInstance(InstallInRemoteAction, false)
				]
			]),
			this.instantiationService.createInstance(ManageMcpServerAction, true),
		];

		const actionsAndStatusContainer = append(details, $('.actions-status-container.mcp-server-actions'));
		const actionBar = this._register(new ActionBar(actionsAndStatusContainer, {
			actionViewItemProvider: (action: IAction, options: IActionViewItemOptions) => {
				if (action instanceof DropDownAction) {
					return action.createActionViewItem(options);
				}
				if (action instanceof ButtonWithDropDownExtensionAction) {
					return new ButtonWithDropdownExtensionActionViewItem(
						action,
						{
							...options,
							icon: true,
							label: true,
							menuActionsOrProvider: { getActions: () => action.menuActions },
							menuActionClassNames: action.menuActionClassNames
						},
						this.contextMenuService);
				}
				return undefined;
			},
			focusOnlyEnabledItems: true
		}));

		actionBar.push(actions, { icon: true, label: true });
		actionBar.setFocusable(true);
		// update focusable elements when the enablement of an action changes
		this._register(Event.any(...actions.map(a => Event.filter(a.onDidChange, e => e.enabled !== undefined)))(() => {
			actionBar.setFocusable(false);
			actionBar.setFocusable(true);
		}));

		const otherContainers: IMcpServerContainer[] = [];
		const mcpServerStatusAction = this.instantiationService.createInstance(McpServerStatusAction);
		const mcpServerStatusWidget = this._register(this.instantiationService.createInstance(McpServerStatusWidget, append(actionsAndStatusContainer, $('.status')), mcpServerStatusAction));
		this._register(Event.any(mcpServerStatusWidget.onDidRender)(() => {
			if (this.dimension) {
				this.layout(this.dimension);
			}
		}));

		otherContainers.push(mcpServerStatusAction, new class extends McpServerWidget {
			render() {
				actionsAndStatusContainer.classList.toggle('list-layout', this.mcpServer?.installState === McpServerInstallState.Installed);
			}
		}());

		const mcpServerContainers: McpServerContainers = this.instantiationService.createInstance(McpServerContainers, [...actions, ...widgets, ...otherContainers]);
		for (const disposable of [...actions, ...widgets, ...otherContainers, mcpServerContainers]) {
			this._register(disposable);
		}

		const onError = Event.chain(actionBar.onDidRun, $ =>
			$.map(({ error }) => error)
				.filter(error => !!error)
		);

		this._register(onError(this.onError, this));

		const body = append(root, $('.body'));
		const navbar = new NavBar(body);

		const content = append(body, $('.content'));
		content.id = generateUuid(); // An id is needed for the webview parent flow to

		this.template = {
			content,
			description,
			header,
			name,
			navbar,
			actionsAndStatusContainer,
			actionBar: actionBar,
			set mcpServer(mcpServer: IWorkbenchMcpServer) {
				mcpServerContainers.mcpServer = mcpServer;
				let lastNonEmptySubtitleEntryContainer;
				for (const subTitleEntryElement of subTitleEntryContainers) {
					subTitleEntryElement.classList.remove('last-non-empty');
					if (subTitleEntryElement.children.length > 0) {
						lastNonEmptySubtitleEntryContainer = subTitleEntryElement;
					}
				}
				if (lastNonEmptySubtitleEntryContainer) {
					lastNonEmptySubtitleEntryContainer.classList.add('last-non-empty');
				}
			}
		};
	}

	override async setInput(input: McpServerEditorInput, options: IMcpServerEditorOptions | undefined, context: IEditorOpenContext, token: CancellationToken): Promise<void> {
		await super.setInput(input, options, context, token);
		if (this.template) {
			await this.render(input.mcpServer, this.template, !!options?.preserveFocus);
		}
	}

	private async render(mcpServer: IWorkbenchMcpServer, template: IExtensionEditorTemplate, preserveFocus: boolean): Promise<void> {
		this.activeElement = null;
		this.transientDisposables.clear();

		const token = this.transientDisposables.add(new CancellationTokenSource()).token;

		this.mcpServerReadme = new Cache(() => mcpServer.getReadme(token));
		this.mcpServerManifest = new Cache(() => mcpServer.getManifest(token));
		template.mcpServer = mcpServer;

		template.name.textContent = mcpServer.label;
		template.name.classList.toggle('clickable', !!mcpServer.gallery?.webUrl);
		template.description.textContent = mcpServer.description;
		if (mcpServer.gallery?.webUrl) {
			this.transientDisposables.add(onClick(template.name, () => this.openerService.open(URI.parse(mcpServer.gallery?.webUrl!))));
		}

		this.renderNavbar(mcpServer, template, preserveFocus);
	}

	override setOptions(options: IMcpServerEditorOptions | undefined): void {
		super.setOptions(options);
		if (options?.tab) {
			this.template?.navbar.switch(options.tab);
		}
	}

	private renderNavbar(extension: IWorkbenchMcpServer, template: IExtensionEditorTemplate, preserveFocus: boolean): void {
		template.content.innerText = '';
		template.navbar.clear();

		if (this.currentIdentifier !== extension.id) {
			this.initialScrollProgress.clear();
			this.currentIdentifier = extension.id;
		}

		if (extension.readmeUrl || extension.gallery?.readme) {
			template.navbar.push(McpServerEditorTab.Readme, localize('details', "Details"), localize('detailstooltip', "Extension details, rendered from the extension's 'README.md' file"));
		}

		if (extension.gallery || extension.local?.manifest) {
			template.navbar.push(McpServerEditorTab.Manifest, localize('manifest', "Manifest"), localize('manifesttooltip', "Server manifest details"));
		}

		if (extension.config) {
			template.navbar.push(McpServerEditorTab.Configuration, localize('configuration', "Configuration"), localize('configurationtooltip', "Server configuration details"));
		}

		this.transientDisposables.add(this.mcpWorkbenchService.onChange(e => {
			if (e === extension) {
				if (e.config && !template.navbar.has(McpServerEditorTab.Configuration)) {
					template.navbar.push(McpServerEditorTab.Configuration, localize('configuration', "Configuration"), localize('configurationtooltip', "Server configuration details"), extension.readmeUrl ? 1 : 0);
				}
				if (!e.config && template.navbar.has(McpServerEditorTab.Configuration)) {
					template.navbar.remove(McpServerEditorTab.Configuration);
				}
			}
		}));

		if ((<IMcpServerEditorOptions | undefined>this.options)?.tab) {
			template.navbar.switch((<IMcpServerEditorOptions>this.options).tab!);
		}

		if (template.navbar.currentId) {
			this.onNavbarChange(extension, { id: template.navbar.currentId, focus: !preserveFocus }, template);
		}
		template.navbar.onChange(e => this.onNavbarChange(extension, e, template), this, this.transientDisposables);
	}

	override clearInput(): void {
		this.contentDisposables.clear();
		this.transientDisposables.clear();

		super.clearInput();
	}

	override focus(): void {
		super.focus();
		this.activeElement?.focus();
	}

	showFind(): void {
		this.activeWebview?.showFind();
	}

	runFindAction(previous: boolean): void {
		this.activeWebview?.runFindAction(previous);
	}

	public get activeWebview(): IWebview | undefined {
		if (!this.activeElement || !(this.activeElement as IWebview).runFindAction) {
			return undefined;
		}
		return this.activeElement as IWebview;
	}

	private onNavbarChange(extension: IWorkbenchMcpServer, { id, focus }: { id: string | null; focus: boolean }, template: IExtensionEditorTemplate): void {
		this.contentDisposables.clear();
		template.content.innerText = '';
		this.activeElement = null;
		if (id) {
			const cts = new CancellationTokenSource();
			this.contentDisposables.add(toDisposable(() => cts.dispose(true)));
			this.open(id, extension, template, cts.token)
				.then(activeElement => {
					if (cts.token.isCancellationRequested) {
						return;
					}
					this.activeElement = activeElement;
					if (focus) {
						this.focus();
					}
				});
		}
	}

	private open(id: string, extension: IWorkbenchMcpServer, template: IExtensionEditorTemplate, token: CancellationToken): Promise<IActiveElement | null> {
		switch (id) {
			case McpServerEditorTab.Configuration: return this.openConfiguration(extension, template, token);
			case McpServerEditorTab.Readme: return this.openDetails(extension, template, token);
			case McpServerEditorTab.Manifest: return extension.readmeUrl ? this.openManifest(extension, template.content, token) : this.openManifestWithAdditionalDetails(extension, template, token);
		}
		return Promise.resolve(null);
	}

	private async openMarkdown(extension: IWorkbenchMcpServer, cacheResult: CacheResult<string>, noContentCopy: string, container: HTMLElement, webviewIndex: WebviewIndex, title: string, token: CancellationToken): Promise<IActiveElement | null> {
		try {
			const body = await this.renderMarkdown(extension, cacheResult, container, token);
			if (token.isCancellationRequested) {
				return Promise.resolve(null);
			}

			const webview = this.contentDisposables.add(this.webviewService.createWebviewOverlay({
				title,
				options: {
					enableFindWidget: true,
					tryRestoreScrollPosition: true,
					disableServiceWorker: true,
				},
				contentOptions: {},
				extension: undefined,
			}));

			webview.initialScrollProgress = this.initialScrollProgress.get(webviewIndex) || 0;

			webview.claim(this, this.window, this.scopedContextKeyService);
			setParentFlowTo(webview.container, container);
			webview.layoutWebviewOverElement(container);

			webview.setHtml(body);
			webview.claim(this, this.window, undefined);

			this.contentDisposables.add(webview.onDidFocus(() => this._onDidFocus?.fire()));

			this.contentDisposables.add(webview.onDidScroll(() => this.initialScrollProgress.set(webviewIndex, webview.initialScrollProgress)));

			const removeLayoutParticipant = arrays.insert(this.layoutParticipants, {
				layout: () => {
					webview.layoutWebviewOverElement(container);
				}
			});
			this.contentDisposables.add(toDisposable(removeLayoutParticipant));

			let isDisposed = false;
			this.contentDisposables.add(toDisposable(() => { isDisposed = true; }));

			this.contentDisposables.add(this.themeService.onDidColorThemeChange(async () => {
				// Render again since syntax highlighting of code blocks may have changed
				const body = await this.renderMarkdown(extension, cacheResult, container);
				if (!isDisposed) { // Make sure we weren't disposed of in the meantime
					webview.setHtml(body);
				}
			}));

			this.contentDisposables.add(webview.onDidClickLink(link => {
				if (!link) {
					return;
				}
				// Only allow links with specific schemes
				if (matchesScheme(link, Schemas.http) || matchesScheme(link, Schemas.https) || matchesScheme(link, Schemas.mailto)) {
					this.openerService.open(link);
				}
			}));

			return webview;
		} catch (e) {
			const p = append(container, $('p.nocontent'));
			p.textContent = noContentCopy;
			return p;
		}
	}

	private async renderMarkdown(extension: IWorkbenchMcpServer, cacheResult: CacheResult<string>, container: HTMLElement, token?: CancellationToken): Promise<string> {
		const contents = await this.loadContents(() => cacheResult, container);
		if (token?.isCancellationRequested) {
			return '';
		}

		const content = await renderMarkdownDocument(contents, this.extensionService, this.languageService, {}, token);
		if (token?.isCancellationRequested) {
			return '';
		}

		return this.renderBody(content);
	}

	private renderBody(body: TrustedHTML): string {
		const nonce = generateUuid();
		const colorMap = TokenizationRegistry.getColorMap();
		const css = colorMap ? generateTokensCSSForColorMap(colorMap) : '';
		return `<!DOCTYPE html>
		<html>
			<head>
				<meta http-equiv="Content-type" content="text/html;charset=UTF-8">
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src https: data:; media-src https:; script-src 'none'; style-src 'nonce-${nonce}';">
				<style nonce="${nonce}">
					${DEFAULT_MARKDOWN_STYLES}

					/* prevent scroll-to-top button from blocking the body text */
					body {
						padding-bottom: 75px;
					}

					#scroll-to-top {
						position: fixed;
						width: 32px;
						height: 32px;
						right: 25px;
						bottom: 25px;
						background-color: var(--vscode-button-secondaryBackground);
						border-color: var(--vscode-button-border);
						border-radius: 50%;
						cursor: pointer;
						box-shadow: 1px 1px 1px rgba(0,0,0,.25);
						outline: none;
						display: flex;
						justify-content: center;
						align-items: center;
					}

					#scroll-to-top:hover {
						background-color: var(--vscode-button-secondaryHoverBackground);
						box-shadow: 2px 2px 2px rgba(0,0,0,.25);
					}

					body.vscode-high-contrast #scroll-to-top {
						border-width: 2px;
						border-style: solid;
						box-shadow: none;
					}

					#scroll-to-top span.icon::before {
						content: "";
						display: block;
						background: var(--vscode-button-secondaryForeground);
						/* Chevron up icon */
						webkit-mask-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAxNiAxNiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTYgMTY7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbDojRkZGRkZGO30KCS5zdDF7ZmlsbDpub25lO30KPC9zdHlsZT4KPHRpdGxlPnVwY2hldnJvbjwvdGl0bGU+CjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik04LDUuMWwtNy4zLDcuM0wwLDExLjZsOC04bDgsOGwtMC43LDAuN0w4LDUuMXoiLz4KPHJlY3QgY2xhc3M9InN0MSIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2Ii8+Cjwvc3ZnPgo=');
						-webkit-mask-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAxNiAxNiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTYgMTY7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbDojRkZGRkZGO30KCS5zdDF7ZmlsbDpub25lO30KPC9zdHlsZT4KPHRpdGxlPnVwY2hldnJvbjwvdGl0bGU+CjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik04LDUuMWwtNy4zLDcuM0wwLDExLjZsOC04bDgsOGwtMC43LDAuN0w4LDUuMXoiLz4KPHJlY3QgY2xhc3M9InN0MSIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2Ii8+Cjwvc3ZnPgo=');
						width: 16px;
						height: 16px;
					}
					${css}
				</style>
			</head>
			<body>
				<a id="scroll-to-top" role="button" aria-label="scroll to top" href="#"><span class="icon"></span></a>
				${body}
			</body>
		</html>`;
	}

	private async openDetails(extension: IWorkbenchMcpServer, template: IExtensionEditorTemplate, token: CancellationToken): Promise<IActiveElement | null> {
		const details = append(template.content, $('.details'));
		const readmeContainer = append(details, $('.readme-container'));
		const additionalDetailsContainer = append(details, $('.additional-details-container'));

		const layout = () => details.classList.toggle('narrow', this.dimension && this.dimension.width < 500);
		layout();
		this.contentDisposables.add(toDisposable(arrays.insert(this.layoutParticipants, { layout })));

		const activeElement = await this.openMarkdown(extension, this.mcpServerReadme!.get(), localize('noReadme', "No README available."), readmeContainer, WebviewIndex.Readme, localize('Readme title', "Readme"), token);
		this.renderAdditionalDetails(additionalDetailsContainer, extension);
		return activeElement;
	}

	private async openConfiguration(mcpServer: IWorkbenchMcpServer, template: IExtensionEditorTemplate, token: CancellationToken): Promise<IActiveElement | null> {
		const configContainer = append(template.content, $('.configuration'));
		const content = $('div', { class: 'configuration-content' });

		this.renderConfigurationDetails(content, mcpServer);

		const scrollableContent = new DomScrollableElement(content, {});
		const layout = () => scrollableContent.scanDomNode();
		this.contentDisposables.add(toDisposable(arrays.insert(this.layoutParticipants, { layout })));

		append(configContainer, scrollableContent.getDomNode());

		return { focus: () => content.focus() };
	}

	private async openManifestWithAdditionalDetails(mcpServer: IWorkbenchMcpServer, template: IExtensionEditorTemplate, token: CancellationToken): Promise<IActiveElement | null> {
		const details = append(template.content, $('.details'));

		const readmeContainer = append(details, $('.readme-container'));
		const additionalDetailsContainer = append(details, $('.additional-details-container'));

		const layout = () => details.classList.toggle('narrow', this.dimension && this.dimension.width < 500);
		layout();
		this.contentDisposables.add(toDisposable(arrays.insert(this.layoutParticipants, { layout })));

		const activeElement = await this.openManifest(mcpServer, readmeContainer, token);

		this.renderAdditionalDetails(additionalDetailsContainer, mcpServer);
		return activeElement;
	}

	private async openManifest(mcpServer: IWorkbenchMcpServer, parent: HTMLElement, token: CancellationToken): Promise<IActiveElement | null> {
		const manifestContainer = append(parent, $('.manifest'));
		const content = $('div', { class: 'manifest-content' });

		try {
			const manifest = await this.loadContents(() => this.mcpServerManifest!.get(), content);
			if (token.isCancellationRequested) {
				return null;
			}
			this.renderManifestDetails(content, manifest);
		} catch (error) {
			// Handle error - show no manifest message
			while (content.firstChild) {
				content.removeChild(content.firstChild);
			}
			const noManifestMessage = append(content, $('.no-manifest'));
			noManifestMessage.textContent = localize('noManifest', "No manifest available for this MCP server.");
		}

		const scrollableContent = new DomScrollableElement(content, {});
		const layout = () => scrollableContent.scanDomNode();
		this.contentDisposables.add(toDisposable(arrays.insert(this.layoutParticipants, { layout })));

		append(manifestContainer, scrollableContent.getDomNode());

		return { focus: () => content.focus() };
	}

	private renderConfigurationDetails(container: HTMLElement, mcpServer: IWorkbenchMcpServer): void {
		clearNode(container);

		const config = mcpServer.config;

		if (!config) {
			const noConfigMessage = append(container, $('.no-config'));
			noConfigMessage.textContent = localize('noConfig', "No configuration available for this MCP server.");
			return;
		}

		// Server Name
		const nameSection = append(container, $('.config-section'));
		const nameLabel = append(nameSection, $('.config-label'));
		nameLabel.textContent = localize('serverName', "Name:");
		const nameValue = append(nameSection, $('.config-value'));
		nameValue.textContent = mcpServer.name;

		// Server Type
		const typeSection = append(container, $('.config-section'));
		const typeLabel = append(typeSection, $('.config-label'));
		typeLabel.textContent = localize('serverType', "Type:");
		const typeValue = append(typeSection, $('.config-value'));
		typeValue.textContent = config.type;

		// Type-specific configuration
		if (config.type === McpServerType.LOCAL) {
			// Command
			const commandSection = append(container, $('.config-section'));
			const commandLabel = append(commandSection, $('.config-label'));
			commandLabel.textContent = localize('command', "Command:");
			const commandValue = append(commandSection, $('code.config-value'));
			commandValue.textContent = config.command;

			// Arguments (if present)
			if (config.args && config.args.length > 0) {
				const argsSection = append(container, $('.config-section'));
				const argsLabel = append(argsSection, $('.config-label'));
				argsLabel.textContent = localize('arguments', "Arguments:");
				const argsValue = append(argsSection, $('code.config-value'));
				argsValue.textContent = config.args.join(' ');
			}
		} else if (config.type === McpServerType.REMOTE) {
			// URL
			const urlSection = append(container, $('.config-section'));
			const urlLabel = append(urlSection, $('.config-label'));
			urlLabel.textContent = localize('url', "URL:");
			const urlValue = append(urlSection, $('code.config-value'));
			urlValue.textContent = config.url;
		}
	}

	private renderManifestDetails(container: HTMLElement, manifest: IGalleryMcpServerConfiguration): void {
		clearNode(container);

		if (manifest.packages && manifest.packages.length > 0) {
			const packagesByType = new Map<RegistryType, IMcpServerPackage[]>();
			for (const pkg of manifest.packages) {
				const type = pkg.registryType;
				let packages = packagesByType.get(type);
				if (!packages) {
					packagesByType.set(type, packages = []);
				}
				packages.push(pkg);
			}

			append(container, $('.manifest-section', undefined, $('.manifest-section-title', undefined, localize('packages', "Packages"))));

			for (const [packageType, packages] of packagesByType) {
				const packageSection = append(container, $('.package-section', undefined, $('.package-section-title', undefined, packageType.toUpperCase())));
				const packagesGrid = append(packageSection, $('.package-details'));

				for (let i = 0; i < packages.length; i++) {
					const pkg = packages[i];
					append(packagesGrid, $('.package-detail', undefined, $('.detail-label', undefined, localize('packageName', "Package:")), $('.detail-value', undefined, pkg.identifier)));
					if (pkg.packageArguments && pkg.packageArguments.length > 0) {
						const argStrings: string[] = [];
						for (const arg of pkg.packageArguments) {
							if (arg.type === 'named') {
								argStrings.push(arg.name);
								if (arg.value) {
									argStrings.push(arg.value);
								}
							}
							if (arg.type === 'positional') {
								const val = arg.value ?? arg.valueHint;
								if (val) {
									argStrings.push(val);
								}
							}
						}
						append(packagesGrid, $('.package-detail', undefined, $('.detail-label', undefined, localize('packagearguments', "Package Arguments:")), $('code.detail-value', undefined, argStrings.join(' '))));
					}
					if (pkg.runtimeArguments && pkg.runtimeArguments.length > 0) {
						const argStrings: string[] = [];
						for (const arg of pkg.runtimeArguments) {
							if (arg.type === 'named') {
								argStrings.push(arg.name);
								if (arg.value) {
									argStrings.push(arg.value);
								}
							}
							if (arg.type === 'positional') {
								const val = arg.value ?? arg.valueHint;
								if (val) {
									argStrings.push(val);
								}
							}
						}
						append(packagesGrid, $('.package-detail', undefined, $('.detail-label', undefined, localize('runtimeargs', "Runtime Arguments:")), $('code.detail-value', undefined, argStrings.join(' '))));
					}
					if (pkg.environmentVariables && pkg.environmentVariables.length > 0) {
						const envStrings = pkg.environmentVariables.map((envVar: IMcpServerKeyValueInput) => `${envVar.name}=${envVar.value ?? ''}`);
						append(packagesGrid, $('.package-detail', undefined, $('.detail-label', undefined, localize('environmentVariables', "Environment Variables:")), $('code.detail-value', undefined, envStrings.join(' '))));
					}
					if (i < packages.length - 1) {
						append(packagesGrid, $('.package-separator'));
					}
				}
			}
		}

		if (manifest.remotes && manifest.remotes.length > 0) {
			const packageSection = append(container, $('.package-section', undefined, $('.package-section-title', undefined, localize('remotes', "Remote").toLocaleUpperCase())));
			for (const remote of manifest.remotes) {
				const packagesGrid = append(packageSection, $('.package-details'));
				append(packagesGrid, $('.package-detail', undefined, $('.detail-label', undefined, localize('url', "URL:")), $('.detail-value', undefined, remote.url)));
				if (remote.type) {
					append(packagesGrid, $('.package-detail', undefined, $('.detail-label', undefined, localize('transport', "Transport:")), $('.detail-value', undefined, remote.type)));
				}
				if (remote.headers && remote.headers.length > 0) {
					const headerStrings = remote.headers.map((header: IMcpServerKeyValueInput) => `${header.name}: ${header.value ?? ''}`);
					append(packagesGrid, $('.package-detail', undefined, $('.detail-label', undefined, localize('headers', "Headers:")), $('.detail-value', undefined, headerStrings.join(', '))));
				}
			}
		}
	}

	private renderAdditionalDetails(container: HTMLElement, extension: IWorkbenchMcpServer): void {
		const content = $('div', { class: 'additional-details-content', tabindex: '0' });
		const scrollableContent = new DomScrollableElement(content, {});
		const layout = () => scrollableContent.scanDomNode();
		const removeLayoutParticipant = arrays.insert(this.layoutParticipants, { layout });
		this.contentDisposables.add(toDisposable(removeLayoutParticipant));
		this.contentDisposables.add(scrollableContent);

		this.contentDisposables.add(this.instantiationService.createInstance(AdditionalDetailsWidget, content, extension));

		append(container, scrollableContent.getDomNode());
		scrollableContent.scanDomNode();
	}

	private loadContents<T>(loadingTask: () => CacheResult<T>, container: HTMLElement): Promise<T> {
		container.classList.add('loading');

		const result = this.contentDisposables.add(loadingTask());
		const onDone = () => container.classList.remove('loading');
		result.promise.then(onDone, onDone);

		return result.promise;
	}

	layout(dimension: Dimension): void {
		this.dimension = dimension;
		this.layoutParticipants.forEach(p => p.layout());
	}

	private onError(err: Error): void {
		if (isCancellationError(err)) {
			return;
		}

		this.notificationService.error(err);
	}
}

class AdditionalDetailsWidget extends Disposable {

	private readonly disposables = this._register(new DisposableStore());

	constructor(
		private readonly container: HTMLElement,
		extension: IWorkbenchMcpServer,
		@IMcpGalleryManifestService private readonly mcpGalleryManifestService: IMcpGalleryManifestService,
		@IHoverService private readonly hoverService: IHoverService,
		@IOpenerService private readonly openerService: IOpenerService,
	) {
		super();
		this.render(extension);
		this._register(this.mcpGalleryManifestService.onDidChangeMcpGalleryManifest(() => this.render(extension)));
	}

	private render(extension: IWorkbenchMcpServer): void {
		this.container.innerText = '';
		this.disposables.clear();

		if (extension.local) {
			this.renderInstallInfo(this.container, extension.local);
		}

		if (extension.gallery) {
			this.renderMarketplaceInfo(this.container, extension);
		}
		this.renderTags(this.container, extension);
		this.renderExtensionResources(this.container, extension);
	}

	private renderTags(container: HTMLElement, extension: IWorkbenchMcpServer): void {
		if (extension.gallery?.topics?.length) {
			const categoriesContainer = append(container, $('.categories-container.additional-details-element'));
			append(categoriesContainer, $('.additional-details-title', undefined, localize('tags', "Tags")));
			const categoriesElement = append(categoriesContainer, $('.categories'));
			for (const category of extension.gallery.topics) {
				append(categoriesElement, $('span.category', { tabindex: '0' }, category));
			}
		}
	}

	private async renderExtensionResources(container: HTMLElement, extension: IWorkbenchMcpServer): Promise<void> {
		const resources: [string, ThemeIcon, URI][] = [];
		const manifest = await this.mcpGalleryManifestService.getMcpGalleryManifest();
		if (extension.repository) {
			try {
				resources.push([localize('repository', "Repository"), ThemeIcon.fromId(Codicon.repo.id), URI.parse(extension.repository)]);
			} catch (error) {/* Ignore */ }
		}
		if (manifest) {
			const supportUri = getMcpGalleryManifestResourceUri(manifest, McpGalleryResourceType.ContactSupportUri);
			if (supportUri) {
				try {
					resources.push([localize('support', "Contact Support"), ThemeIcon.fromId(Codicon.commentDiscussion.id), URI.parse(supportUri)]);
				} catch (error) {/* Ignore */ }
			}
		}
		if (resources.length) {
			const extensionResourcesContainer = append(container, $('.resources-container.additional-details-element'));
			append(extensionResourcesContainer, $('.additional-details-title', undefined, localize('resources', "Resources")));
			const resourcesElement = append(extensionResourcesContainer, $('.resources'));
			for (const [label, icon, uri] of resources) {
				const resourceElement = append(resourcesElement, $('.resource'));
				append(resourceElement, $(ThemeIcon.asCSSSelector(icon)));
				append(resourceElement, $('a', { tabindex: '0' }, label));
				this.disposables.add(onClick(resourceElement, () => this.openerService.open(uri)));
				this.disposables.add(this.hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), resourceElement, uri.toString()));
			}
		}
	}

	private renderInstallInfo(container: HTMLElement, extension: ILocalMcpServer): void {
		const installInfoContainer = append(container, $('.more-info-container.additional-details-element'));
		append(installInfoContainer, $('.additional-details-title', undefined, localize('Install Info', "Installation")));
		const installInfo = append(installInfoContainer, $('.more-info'));
		append(installInfo,
			$('.more-info-entry', undefined,
				$('div.more-info-entry-name', undefined, localize('id', "Identifier")),
				$('code', undefined, extension.name)
			));
		if (extension.version) {
			append(installInfo,
				$('.more-info-entry', undefined,
					$('div.more-info-entry-name', undefined, localize('Version', "Version")),
					$('code', undefined, extension.version)
				)
			);
		}
	}

	private renderMarketplaceInfo(container: HTMLElement, extension: IWorkbenchMcpServer): void {
		const gallery = extension.gallery;
		const moreInfoContainer = append(container, $('.more-info-container.additional-details-element'));
		append(moreInfoContainer, $('.additional-details-title', undefined, localize('Marketplace Info', "Marketplace")));
		const moreInfo = append(moreInfoContainer, $('.more-info'));
		if (gallery) {
			if (!extension.local) {
				append(moreInfo,
					$('.more-info-entry', undefined,
						$('div.more-info-entry-name', undefined, localize('id', "Identifier")),
						$('code', undefined, extension.name)
					));
				if (gallery.version) {
					append(moreInfo,
						$('.more-info-entry', undefined,
							$('div.more-info-entry-name', undefined, localize('Version', "Version")),
							$('code', undefined, gallery.version)
						)
					);
				}
			}
			if (gallery.lastUpdated) {
				append(moreInfo,
					$('.more-info-entry', undefined,
						$('div.more-info-entry-name', undefined, localize('last updated', "Last Released")),
						$('div', {
							'title': new Date(gallery.lastUpdated).toString()
						}, fromNow(gallery.lastUpdated, true, true, true))
					)
				);
			}
			if (gallery.publishDate) {
				append(moreInfo,
					$('.more-info-entry', undefined,
						$('div.more-info-entry-name', undefined, localize('published', "Published")),
						$('div', {
							'title': new Date(gallery.publishDate).toString()
						}, fromNow(gallery.publishDate, true, true, true))
					)
				);
			}
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/browser/mcpServerEditorInput.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/browser/mcpServerEditorInput.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Schemas } from '../../../../base/common/network.js';
import { URI } from '../../../../base/common/uri.js';
import { localize } from '../../../../nls.js';
import { EditorInputCapabilities, IUntypedEditorInput } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { join } from '../../../../base/common/path.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';
import { IWorkbenchMcpServer } from '../common/mcpTypes.js';

const MCPServerEditorIcon = registerIcon('mcp-server-editor-icon', Codicon.mcp, localize('mcpServerEditorLabelIcon', 'Icon of the MCP Server editor.'));

export class McpServerEditorInput extends EditorInput {

	static readonly ID = 'workbench.mcpServer.input2';

	override get typeId(): string {
		return McpServerEditorInput.ID;
	}

	override get capabilities(): EditorInputCapabilities {
		return EditorInputCapabilities.Readonly | EditorInputCapabilities.Singleton;
	}

	override get resource() {
		return URI.from({
			scheme: Schemas.extension,
			path: join(this.mcpServer.id, 'mcpServer')
		});
	}

	constructor(private _mcpServer: IWorkbenchMcpServer) {
		super();
	}

	get mcpServer(): IWorkbenchMcpServer { return this._mcpServer; }

	override getName(): string {
		return localize('extensionsInputName', "MCP Server: {0}", this._mcpServer.label);
	}

	override getIcon(): ThemeIcon | undefined {
		return MCPServerEditorIcon;
	}

	override matches(other: EditorInput | IUntypedEditorInput): boolean {
		if (super.matches(other)) {
			return true;
		}

		return other instanceof McpServerEditorInput && this._mcpServer.id === other._mcpServer.id;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/browser/mcpServerIcons.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/browser/mcpServerIcons.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from '../../../../base/common/codicons.js';
import { localize } from '../../../../nls.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';

export const mcpServerIcon = registerIcon('mcp-server', Codicon.mcp, localize('mcpServer', 'Icon used for the MCP server.'));
export const mcpServerRemoteIcon = registerIcon('mcp-server-remote', Codicon.remote, localize('mcpServerRemoteIcon', 'Icon to indicate that an MCP server is for the remote user scope.'));
export const mcpServerWorkspaceIcon = registerIcon('mcp-server-workspace', Codicon.rootFolder, localize('mcpServerWorkspaceIcon', 'Icon to indicate that an MCP server is for the workspace scope.'));
export const mcpStarredIcon = registerIcon('mcp-server-starred', Codicon.starFull, localize('starredIcon', 'Icon shown along with the starred status.'));
export const mcpLicenseIcon = registerIcon('mcp-server-license', Codicon.law, localize('licenseIcon', 'Icon shown along with the license status.'));
```

--------------------------------------------------------------------------------

````
