---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 547
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 547 of 552)

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

---[FILE: src/vscode-dts/vscode.proposed.activeComment.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.activeComment.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {
	// @alexr00 https://github.com/microsoft/vscode/issues/204484

	export interface CommentController {
		/**
		 * The currently active comment or `undefined`. The active comment is the one
		 * that currently has focus or, when none has focus, undefined.
		 */
		// readonly activeComment: Comment | undefined;

		/**
		 * The currently active comment thread or `undefined`. The active comment thread is the one
		 * in the CommentController that most recently had focus or, when a different CommentController's
		 * thread has most recently had focus, undefined.
		 */
		readonly activeCommentThread: CommentThread | undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.aiRelatedInformation.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.aiRelatedInformation.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/190909

	export enum RelatedInformationType {
		SymbolInformation = 1,
		CommandInformation = 2,
		SearchInformation = 3,
		SettingInformation = 4
	}

	export interface RelatedInformationBaseResult {
		type: RelatedInformationType;
		weight: number;
	}

	// TODO: Symbols and Search

	export interface CommandInformationResult extends RelatedInformationBaseResult {
		type: RelatedInformationType.CommandInformation;
		command: string;
	}

	export interface SettingInformationResult extends RelatedInformationBaseResult {
		type: RelatedInformationType.SettingInformation;
		setting: string;
	}

	export type RelatedInformationResult = CommandInformationResult | SettingInformationResult;

	export interface RelatedInformationProvider {
		provideRelatedInformation(query: string, token: CancellationToken): ProviderResult<RelatedInformationResult[]>;
	}

	export interface EmbeddingVectorProvider {
		provideEmbeddingVector(strings: string[], token: CancellationToken): ProviderResult<number[][]>;
	}

	export namespace ai {
		export function getRelatedInformation(query: string, types: RelatedInformationType[], token: CancellationToken): Thenable<RelatedInformationResult[]>;
		export function registerRelatedInformationProvider(type: RelatedInformationType, provider: RelatedInformationProvider): Disposable;
		export function registerEmbeddingVectorProvider(model: string, provider: EmbeddingVectorProvider): Disposable;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.aiSettingsSearch.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.aiSettingsSearch.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {
	export enum SettingsSearchResultKind {
		EMBEDDED = 1,
		LLM_RANKED = 2,
		CANCELED = 3
	}

	export interface SettingsSearchResult {
		query: string;
		kind: SettingsSearchResultKind;
		settings: string[];
	}

	export interface SettingsSearchProviderOptions {
		limit: number;
		embeddingsOnly: boolean;
	}

	export interface SettingsSearchProvider {
		provideSettingsSearchResults(query: string, option: SettingsSearchProviderOptions, progress: Progress<SettingsSearchResult>, token: CancellationToken): Thenable<void>;
	}

	export namespace ai {
		export function registerSettingsSearchProvider(provider: SettingsSearchProvider): Disposable;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.aiTextSearchProvider.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.aiTextSearchProvider.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// version: 2

declare module 'vscode' {
	/**
	 * An AITextSearchProvider provides additional AI text search results in the workspace.
	 */
	export interface AITextSearchProvider {
		/**
		 * The name of the AI searcher. Will be displayed as `{name} Results` in the Search View.
		 */
		readonly name?: string;

		/**
		 *
		 * Provide results that match the given text pattern.
		 * @param query The parameter for this query.
		 * @param options A set of options to consider while searching.
		 * @param progress A progress callback that must be invoked for all results.
		 * @param token A cancellation token.
		 */
		provideAITextSearchResults(query: string, options: TextSearchProviderOptions, progress: Progress<TextSearchResult2>, token: CancellationToken): ProviderResult<TextSearchComplete2>;
	}

	export namespace workspace {
		/**
		 * Register an AI text search provider.
		 *
		 * Only one provider can be registered per scheme.
		 *
		 * @param scheme The provider will be invoked for workspace folders that have this file scheme.
		 * @param provider The provider.
		 * @return A {@link Disposable} that unregisters this provider when being disposed.
		 */
		export function registerAITextSearchProvider(scheme: string, provider: AITextSearchProvider): Disposable;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.authenticationChallenges.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.authenticationChallenges.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/267992
	// and historically: https://github.com/microsoft/vscode/issues/260156

	/**********
	 * "Extension providing auth" API
	 * NOTE: This doesn't need to be finalized with the above
	 *******/

	/**
	 * Represents an authentication challenge from a WWW-Authenticate header.
	 * This is used to handle cases where additional authentication steps are required,
	 * such as when mandatory multi-factor authentication (MFA) is enforced.
	 *
	 * @note For more information on WWW-Authenticate please see https://developer.mozilla.org/docs/Web/HTTP/Reference/Headers/WWW-Authenticate
	 */
	export interface AuthenticationChallenge {
		/**
		 * The authentication scheme (e.g., 'Bearer').
		 */
		readonly scheme: string;

		/**
		 * Parameters for the authentication challenge.
		 * For Bearer challenges, this may include 'claims', 'scope', 'realm', etc.
		 */
		readonly params: Record<string, string>;
	}

	/**
	 * Represents constraints for authentication, including challenges and optional scopes.
	 * This is used when creating or retrieving sessions that must satisfy specific authentication
	 * requirements from WWW-Authenticate headers.
	 *
	 * @note For more information on WWW-Authenticate please see https://developer.mozilla.org/docs/Web/HTTP/Reference/Headers/WWW-Authenticate
	 */
	export interface AuthenticationConstraint {
		/**
		 * Array of authentication challenges parsed from WWW-Authenticate headers.
		 */
		readonly challenges: readonly AuthenticationChallenge[];

		/**
		 * Optional scopes for the session. If not provided, the authentication provider
		 * may extract scopes from the challenges or use default scopes.
		 */
		readonly fallbackScopes?: readonly string[];
	}

	/**
	 * An authentication provider that supports challenge-based authentication.
	 * This extends the base AuthenticationProvider with methods to handle authentication
	 * challenges from WWW-Authenticate headers.
	 *
	 * TODO: Enforce that both of these functions should be defined by creating a new AuthenticationProviderWithChallenges interface.
	 * But this can be done later since this part doesn't need finalization.
	 */
	export interface AuthenticationProvider {
		/**
		 * Get existing sessions that match the given authentication constraints.
		 *
		 * @param constraint The authentication constraint containing challenges and optional scopes
		 * @param options Options for the session request
		 * @returns A thenable that resolves to an array of existing authentication sessions
		 */
		getSessionsFromChallenges?(constraint: AuthenticationConstraint, options: AuthenticationProviderSessionOptions): Thenable<readonly AuthenticationSession[]>;

		/**
		 * Create a new session based on authentication constraints.
		 * This is called when no existing session matches the constraint requirements.
		 *
		 * @param constraint The authentication constraint containing challenges and optional scopes
		 * @param options Options for the session creation
		 * @returns A thenable that resolves to a new authentication session
		 */
		createSessionFromChallenges?(constraint: AuthenticationConstraint, options: AuthenticationProviderSessionOptions): Thenable<AuthenticationSession>;
	}

	export interface AuthenticationProviderOptions {
		supportsChallenges?: boolean;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.authIssuers.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.authIssuers.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {
	export interface AuthenticationProviderOptions {
		/**
		 * When specified, this provider will be associated with these authorization servers. They can still contain globs
		 * just like their extension contribution counterparts.
		 */
		readonly supportedAuthorizationServers?: Uri[];
	}

	export interface AuthenticationProviderSessionOptions {
		/**
		 * When specified, the authentication provider will use the provided authorization server URL to
		 * authenticate the user. This is only used when a provider has `supportsAuthorizationServers` set
		 */
		authorizationServer?: Uri;
	}

	export interface AuthenticationGetSessionOptions {
		/**
		 * When specified, the authentication provider will use the provided authorization server URL to
		 * authenticate the user. This is only used when a provider has `supportsAuthorizationServers` set
		 */
		authorizationServer?: Uri;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.authLearnMore.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.authLearnMore.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/206587

	export interface AuthenticationGetSessionPresentationOptions {
		/**
		 * An optional Uri to open in the browser to learn more about this authentication request.
		 */
		learnMore?: Uri;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.authProviderSpecific.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.authProviderSpecific.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/251648

	export interface AuthenticationProviderSessionOptions {
		/**
		 * Allows the authentication provider to take in additional parameters.
		 * It is up to the provider to define what these parameters are and handle them.
		 * This is useful for passing in additional information that is specific to the provider
		 * and not part of the standard authentication flow.
		 */
		[key: string]: any;
	}

	// TODO: Implement this interface if needed via an extension
	// export interface AuthenticationGetSessionOptions {
	// 	/**
	// 	 * Allows the authentication provider to take in additional parameters.
	// 	 * It is up to the provider to define what these parameters are and handle them.
	// 	 * This is useful for passing in additional information that is specific to the provider
	// 	 * and not part of the standard authentication flow.
	// 	 */
	// 	[key: string]: any;
	// }
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.authSession.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.authSession.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {
	export namespace authentication {
		/**
		 * @deprecated Use {@link getSession()} {@link AuthenticationGetSessionOptions.silent} instead.
		 */
		export function hasSession(providerId: string, scopes: readonly string[]): Thenable<boolean>;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.canonicalUriProvider.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.canonicalUriProvider.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/180582

	export namespace workspace {
		/**
		 *
		 * @param scheme The URI scheme that this provider can provide canonical URIs for.
		 * A canonical URI represents the conversion of a resource's alias into a source of truth URI.
		 * Multiple aliases may convert to the same source of truth URI.
		 * @param provider A provider which can convert URIs of scheme @param scheme to
		 * a canonical URI which is stable across machines.
		 */
		export function registerCanonicalUriProvider(scheme: string, provider: CanonicalUriProvider): Disposable;

		/**
		 *
		 * @param uri The URI to provide a canonical URI for.
		 * @param token A cancellation token for the request.
		 */
		export function getCanonicalUri(uri: Uri, options: CanonicalUriRequestOptions, token: CancellationToken): ProviderResult<Uri>;
	}

	export interface CanonicalUriProvider {
		/**
		 *
		 * @param uri The URI to provide a canonical URI for.
		 * @param options Options that the provider should honor in the URI it returns.
		 * @param token A cancellation token for the request.
		 * @returns The canonical URI for the requested URI or undefined if no canonical URI can be provided.
		 */
		provideCanonicalUri(uri: Uri, options: CanonicalUriRequestOptions, token: CancellationToken): ProviderResult<Uri>;
	}

	export interface CanonicalUriRequestOptions {
		/**
		 *
		 * The desired scheme of the canonical URI.
		 */
		targetScheme: string;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.chatContextProvider.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.chatContextProvider.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/271104 @alexr00

	export namespace chat {

		/**
		 * Register a chat context provider. Chat context can be provided:
		 * - For a resource. Make sure to pass a selector that matches the resource you want to provide context for.
		 *   Providers registered without a selector will not be called for resource-based context.
		 * - Explicitly. These context items are shown as options when the user explicitly attaches context.
		 *
		 * To ensure your extension is activated when chat context is requested, make sure to include the `onChatContextProvider:<id>` activation event in your `package.json`.
		 *
		 * @param selector Optional document selector to filter which resources the provider is called for. If omitted, the provider will only be called for explicit context requests.
		 * @param id Unique identifier for the provider.
		 * @param provider The chat context provider.
		 */
		export function registerChatContextProvider(selector: DocumentSelector | undefined, id: string, provider: ChatContextProvider): Disposable;

	}

	export interface ChatContextItem {
		/**
		 * Icon for the context item.
		 */
		icon: ThemeIcon;
		/**
		 * Human readable label for the context item.
		 */
		label: string;
		/**
		 * An optional description of the context item, e.g. to describe the item to the language model.
		 */
		modelDescription?: string;
		/**
		 * The value of the context item. Can be omitted when returned from one of the `provide` methods if the provider supports `resolveChatContext`.
		 */
		value?: string;
	}

	export interface ChatContextProvider<T extends ChatContextItem = ChatContextItem> {

		/**
		 * An optional event that should be fired when the workspace chat context has changed.
		 */
		onDidChangeWorkspaceChatContext?: Event<void>;

		/**
		 * Provide a list of chat context items to be included as workspace context for all chat sessions.
		 *
		 * @param token A cancellation token.
		 */
		provideWorkspaceChatContext?(token: CancellationToken): ProviderResult<T[]>;

		/**
		 * Provide a list of chat context items that a user can choose from. These context items are shown as options when the user explicitly attaches context.
		 * Chat context items can be provided without a `value`, as the `value` can be resolved later using `resolveChatContext`.
		 * `resolveChatContext` is only called for items that do not have a `value`.
		 *
		 * @param token A cancellation token.
		 */
		provideChatContextExplicit?(token: CancellationToken): ProviderResult<T[]>;

		/**
		 * Given a particular resource, provide a chat context item for it. This is used for implicit context (see the settings `chat.implicitContext.enabled` and `chat.implicitContext.suggestedContext`).
		 * Chat context items can be provided without a `value`, as the `value` can be resolved later using `resolveChatContext`.
		 * `resolveChatContext` is only called for items that do not have a `value`.
		 *
		 * Currently only called when the resource is a webview.
		 *
		 * @param options Options include the resource for which to provide context.
		 * @param token A cancellation token.
		 */
		provideChatContextForResource?(options: { resource: Uri }, token: CancellationToken): ProviderResult<T | undefined>;

		/**
		 * If a chat context item is provided without a `value`, from either of the `provide` methods, this method is called to resolve the `value` for the item.
		 *
		 * @param context The context item to resolve.
		 * @param token A cancellation token.
		 */
		resolveChatContext(context: T, token: CancellationToken): ProviderResult<ChatContextItem>;
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.chatEditing.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.chatEditing.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	export interface ChatRequestDraft {
		readonly prompt: string;
		readonly files: readonly Uri[];
	}

	export interface ChatRelatedFile {
		readonly uri: Uri;
		readonly description: string;
	}

	export interface ChatRelatedFilesProviderMetadata {
		readonly description: string;
	}

	export interface ChatRelatedFilesProvider {
		provideRelatedFiles(chatRequest: ChatRequestDraft, token: CancellationToken): ProviderResult<ChatRelatedFile[]>;
	}

	export namespace chat {
		export function registerRelatedFilesProvider(provider: ChatRelatedFilesProvider, metadata: ChatRelatedFilesProviderMetadata): Disposable;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.chatOutputRenderer.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.chatOutputRenderer.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	/**
	 * Data returned from a tool.
	 *
	 * This is an opaque binary blob that can be rendered by a {@link ChatOutputRenderer}.
	 */
	export interface ToolResultDataOutput {
		/**
		 * The MIME type of the data.
		 */
		mime: string;

		/**
		 * The contents of the data.
		 */
		value: Uint8Array;
	}

	export interface ExtendedLanguageModelToolResult2 extends ExtendedLanguageModelToolResult {
		// Temporary to allow `toolResultDetails` to return a ToolResultDataOutput
		// TODO: Should this live here? Or should we be able to mark each `content` items as user/lm specific?
		// TODO: Should we allow multiple per tool result?
		toolResultDetails2?: Array<Uri | Location> | ToolResultDataOutput;
	}

	/**
	 * The data to be rendered by a {@link ChatOutputRenderer}.
	 */
	export interface ChatOutputDataItem {
		/**
		 * The MIME type of the data.
		 */
		readonly mime: string;

		/**
		 * The contents of the data.
		 */
		readonly value: Uint8Array;
	}

	export interface ChatOutputRenderer {
		/**
		 * Given an output, render it into the provided webview.
		 *
		 * TODO: Figure out what to pass as context? Probably at least basic info such as chat location.
		 *
		 * @param data The data to render.
		 * @param webview The webview to render the data into.
		 * @param token A cancellation token that is cancelled if we no longer care about the rendering before this
		 * call completes.
		 *
		 * @returns A promise that resolves when the webview has been initialized and is ready to be presented to the user.
		 */
		renderChatOutput(data: ChatOutputDataItem, webview: Webview, ctx: {}, token: CancellationToken): Thenable<void>;
	}

	export namespace chat {
		/**
		 * Registers a new renderer for a given mime type.
		 *
		 * Note: To use this API, you should also add a contribution point in your extension's
		 * package.json:
		 *
		 * ```json
		 * "contributes": {
		 *   "chatOutputRenderer": [
		 *     {
		 *       "viewType": "myExt.myChatOutputRenderer",
		 *       "mimeTypes": ["application/your-mime-type"]
		 *     }
		 *   ]
		 * }
		 * ```
		 *
		 * @param viewType Unique identifier for the renderer. This should match the `viewType` in your contribution point.
		 * @param renderer The renderer to register.
		 */
		export function registerChatOutputRenderer(viewType: string, renderer: ChatOutputRenderer): Disposable;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.chatParticipantAdditions.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.chatParticipantAdditions.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	export interface ChatParticipant {
		readonly onDidPerformAction: Event<ChatUserActionEvent>;
	}

	/**
	 * Now only used for the "intent detection" API below
	 */
	export interface ChatCommand {
		readonly name: string;
		readonly description: string;
	}

	export interface ChatVulnerability {
		title: string;
		description: string;
		// id: string; // Later we will need to be able to link these across multiple content chunks.
	}

	export class ChatResponseMarkdownWithVulnerabilitiesPart {
		value: MarkdownString;
		vulnerabilities: ChatVulnerability[];
		constructor(value: string | MarkdownString, vulnerabilities: ChatVulnerability[]);
	}

	export class ChatResponseCodeblockUriPart {
		isEdit?: boolean;
		value: Uri;
		undoStopId?: string;
		constructor(value: Uri, isEdit?: boolean, undoStopId?: string);
	}

	/**
	 * Displays a {@link Command command} as a button in the chat response.
	 */
	export interface ChatCommandButton {
		command: Command;
	}

	export interface ChatDocumentContext {
		uri: Uri;
		version: number;
		ranges: Range[];
	}

	export class ChatResponseTextEditPart {
		uri: Uri;
		edits: TextEdit[];
		isDone?: boolean;
		constructor(uri: Uri, done: true);
		constructor(uri: Uri, edits: TextEdit | TextEdit[]);
	}

	export class ChatResponseNotebookEditPart {
		uri: Uri;
		edits: NotebookEdit[];
		isDone?: boolean;
		constructor(uri: Uri, done: true);
		constructor(uri: Uri, edits: NotebookEdit | NotebookEdit[]);
	}

	export class ChatResponseConfirmationPart {
		title: string;
		message: string | MarkdownString;
		data: any;
		buttons?: string[];
		constructor(title: string, message: string | MarkdownString, data: any, buttons?: string[]);
	}

	export class ChatResponseCodeCitationPart {
		value: Uri;
		license: string;
		snippet: string;
		constructor(value: Uri, license: string, snippet: string);
	}

	export class ChatPrepareToolInvocationPart {
		toolName: string;
		constructor(toolName: string);
	}

	export interface ChatTerminalToolInvocationData {
		commandLine: {
			original: string;
			userEdited?: string;
			toolEdited?: string;
		};
		language: string;
	}

	export class ChatToolInvocationPart {
		toolName: string;
		toolCallId: string;
		isError?: boolean;
		invocationMessage?: string | MarkdownString;
		originMessage?: string | MarkdownString;
		pastTenseMessage?: string | MarkdownString;
		isConfirmed?: boolean;
		isComplete?: boolean;
		toolSpecificData?: ChatTerminalToolInvocationData;
		fromSubAgent?: boolean;
		presentation?: 'hidden' | 'hiddenAfterComplete' | undefined;

		constructor(toolName: string, toolCallId: string, isError?: boolean);
	}

	/**
	 * Represents a single file diff entry in a multi diff view.
	 */
	export interface ChatResponseDiffEntry {
		/**
		 * The original file URI (undefined for new files).
		 */
		originalUri?: Uri;

		/**
		 * The modified file URI (undefined for deleted files).
		 */
		modifiedUri?: Uri;

		/**
		 * Optional URI to navigate to when clicking on the file.
		 */
		goToFileUri?: Uri;

		/**
		 * Added data (e.g. line numbers) to show in the UI
		 */
		added?: number;

		/**
		 * Removed data (e.g. line numbers) to show in the UI
		 */
		removed?: number;
	}

	/**
	 * Represents a part of a chat response that shows multiple file diffs.
	 */
	export class ChatResponseMultiDiffPart {
		/**
		 * Array of file diff entries to display.
		 */
		value: ChatResponseDiffEntry[];

		/**
		 * The title for the multi diff editor.
		 */
		title: string;

		/**
		 * Whether the multi diff editor should be read-only.
		 * When true, users cannot open individual files or interact with file navigation.
		 */
		readOnly?: boolean;

		/**
		 * Create a new ChatResponseMultiDiffPart.
		 * @param value Array of file diff entries.
		 * @param title The title for the multi diff editor.
		 * @param readOnly Optional flag to make the multi diff editor read-only.
		 */
		constructor(value: ChatResponseDiffEntry[], title: string, readOnly?: boolean);
	}

	export class ChatResponseExternalEditPart {
		uris: Uri[];
		callback: () => Thenable<unknown>;
		applied: Thenable<string>;
		constructor(uris: Uri[], callback: () => Thenable<unknown>);
	}

	export type ExtendedChatResponsePart = ChatResponsePart | ChatResponseTextEditPart | ChatResponseNotebookEditPart | ChatResponseConfirmationPart | ChatResponseCodeCitationPart | ChatResponseReferencePart2 | ChatResponseMovePart | ChatResponseExtensionsPart | ChatResponsePullRequestPart | ChatPrepareToolInvocationPart | ChatToolInvocationPart | ChatResponseMultiDiffPart | ChatResponseThinkingProgressPart | ChatResponseExternalEditPart;
	export class ChatResponseWarningPart {
		value: MarkdownString;
		constructor(value: string | MarkdownString);
	}

	export class ChatResponseProgressPart2 extends ChatResponseProgressPart {
		value: string;
		task?: (progress: Progress<ChatResponseWarningPart | ChatResponseReferencePart>) => Thenable<string | void>;
		constructor(value: string, task?: (progress: Progress<ChatResponseWarningPart | ChatResponseReferencePart>) => Thenable<string | void>);
	}

	/**
	 * A specialized progress part for displaying thinking/reasoning steps.
	 */
	export class ChatResponseThinkingProgressPart {
		value: string | string[];
		id?: string;
		metadata?: { readonly [key: string]: any };
		task?: (progress: Progress<LanguageModelThinkingPart>) => Thenable<string | void>;

		/**
		 * Creates a new thinking progress part.
		 * @param value An initial progress message
		 * @param task A task that will emit thinking parts during its execution
		 */
		constructor(value: string | string[], id?: string, metadata?: { readonly [key: string]: any }, task?: (progress: Progress<LanguageModelThinkingPart>) => Thenable<string | void>);
	}

	export class ChatResponseReferencePart2 {
		/**
		 * The reference target.
		 */
		value: Uri | Location | { variableName: string; value?: Uri | Location } | string;

		/**
		 * The icon for the reference.
		 */
		iconPath?: Uri | ThemeIcon | {
			/**
			 * The icon path for the light theme.
			 */
			light: Uri;
			/**
			 * The icon path for the dark theme.
			 */
			dark: Uri;
		};
		options?: { status?: { description: string; kind: ChatResponseReferencePartStatusKind } };

		/**
		 * Create a new ChatResponseReferencePart.
		 * @param value A uri or location
		 * @param iconPath Icon for the reference shown in UI
		 */
		constructor(value: Uri | Location | { variableName: string; value?: Uri | Location } | string, iconPath?: Uri | ThemeIcon | {
			/**
			 * The icon path for the light theme.
			 */
			light: Uri;
			/**
			 * The icon path for the dark theme.
			 */
			dark: Uri;
		}, options?: { status?: { description: string; kind: ChatResponseReferencePartStatusKind } });
	}

	export class ChatResponseMovePart {

		readonly uri: Uri;
		readonly range: Range;

		constructor(uri: Uri, range: Range);
	}

	export interface ChatResponseAnchorPart {
		/**
		 * The target of this anchor.
		 *
		 * If this is a {@linkcode Uri} or {@linkcode Location}, this is rendered as a normal link.
		 *
		 * If this is a {@linkcode SymbolInformation}, this is rendered as a symbol link.
		 *
		 * TODO mjbvz: Should this be a full `SymbolInformation`? Or just the parts we need?
		 * TODO mjbvz: Should we allow a `SymbolInformation` without a location? For example, until `resolve` completes?
		 */
		value2: Uri | Location | SymbolInformation;

		/**
		 * Optional method which fills in the details of the anchor.
		 *
		 * THis is currently only implemented for symbol links.
		 */
		resolve?(token: CancellationToken): Thenable<void>;
	}

	export class ChatResponseExtensionsPart {

		readonly extensions: string[];

		constructor(extensions: string[]);
	}

	export class ChatResponsePullRequestPart {
		readonly uri: Uri;
		readonly linkTag: string;
		readonly title: string;
		readonly description: string;
		readonly author: string;
		constructor(uri: Uri, title: string, description: string, author: string, linkTag: string);
	}

	export interface ChatResponseStream {

		/**
		 * Push a progress part to this stream. Short-hand for
		 * `push(new ChatResponseProgressPart(value))`.
		*
		* @param value A progress message
		* @param task If provided, a task to run while the progress is displayed. When the Thenable resolves, the progress will be marked complete in the UI, and the progress message will be updated to the resolved string if one is specified.
		* @returns This stream.
		*/
		progress(value: string, task?: (progress: Progress<ChatResponseWarningPart | ChatResponseReferencePart>) => Thenable<string | void>): void;

		thinkingProgress(thinkingDelta: ThinkingDelta): void;

		textEdit(target: Uri, edits: TextEdit | TextEdit[]): void;

		textEdit(target: Uri, isDone: true): void;

		notebookEdit(target: Uri, edits: NotebookEdit | NotebookEdit[]): void;

		notebookEdit(target: Uri, isDone: true): void;

		/**
		 * Makes an external edit to one or more resources. Changes to the
		 * resources made within the `callback` and before it resolves will be
		 * tracked as agent edits. This can be used to track edits made from
		 * external tools that don't generate simple {@link textEdit textEdits}.
		 */
		externalEdit(target: Uri | Uri[], callback: () => Thenable<unknown>): Thenable<string>;

		markdownWithVulnerabilities(value: string | MarkdownString, vulnerabilities: ChatVulnerability[]): void;
		codeblockUri(uri: Uri, isEdit?: boolean): void;
		push(part: ChatResponsePart | ChatResponseTextEditPart | ChatResponseWarningPart | ChatResponseProgressPart2): void;

		/**
		 * Show an inline message in the chat view asking the user to confirm an action.
		 * Multiple confirmations may be shown per response. The UI might show "Accept All" / "Reject All" actions.
		 * @param title The title of the confirmation entry
		 * @param message An extra message to display to the user
		 * @param data An arbitrary JSON-stringifiable object that will be included in the ChatRequest when
		 * the confirmation is accepted or rejected
		 * TODO@API should this be MarkdownString?
		 * TODO@API should actually be a more generic function that takes an array of buttons
		 */
		confirmation(title: string, message: string | MarkdownString, data: any, buttons?: string[]): void;

		/**
		 * Push a warning to this stream. Short-hand for
		 * `push(new ChatResponseWarningPart(message))`.
		 *
		 * @param message A warning message
		 * @returns This stream.
		 */
		warning(message: string | MarkdownString): void;

		reference(value: Uri | Location | { variableName: string; value?: Uri | Location }, iconPath?: Uri | ThemeIcon | { light: Uri; dark: Uri }): void;

		reference2(value: Uri | Location | string | { variableName: string; value?: Uri | Location }, iconPath?: Uri | ThemeIcon | { light: Uri; dark: Uri }, options?: { status?: { description: string; kind: ChatResponseReferencePartStatusKind } }): void;

		codeCitation(value: Uri, license: string, snippet: string): void;

		prepareToolInvocation(toolName: string): void;

		push(part: ExtendedChatResponsePart): void;

		clearToPreviousToolInvocation(reason: ChatResponseClearToPreviousToolInvocationReason): void;
	}

	export enum ChatResponseReferencePartStatusKind {
		Complete = 1,
		Partial = 2,
		Omitted = 3
	}

	export type ThinkingDelta = {
		text?: string | string[];
		id: string;
		metadata?: { readonly [key: string]: any };
	} | {
		text?: string | string[];
		id?: string;
		metadata: { readonly [key: string]: any };
	} |
	{
		text: string | string[];
		id?: string;
		metadata?: { readonly [key: string]: any };
	};

	export enum ChatResponseClearToPreviousToolInvocationReason {
		NoReason = 0,
		FilteredContentRetry = 1,
		CopyrightContentRetry = 2,
	}

	/**
	 * Does this piggy-back on the existing ChatRequest, or is it a different type of request entirely?
	 * Does it show up in history?
	 */
	export interface ChatRequest {
		/**
		 * The `data` for any confirmations that were accepted
		 */
		acceptedConfirmationData?: any[];

		/**
		 * The `data` for any confirmations that were rejected
		 */
		rejectedConfirmationData?: any[];
	}

	export interface ChatRequest {

		/**
		 * A map of all tools that should (`true`) and should not (`false`) be used in this request.
		 */
		readonly tools: Map<string, boolean>;
	}

	export namespace lm {
		/**
		 * Fired when the set of tools on a chat request changes.
		 */
		export const onDidChangeChatRequestTools: Event<ChatRequest>;
	}

	export class LanguageModelToolExtensionSource {
		/**
		 * ID of the extension that published the tool.
		 */
		readonly id: string;

		/**
		 * Label of the extension that published the tool.
		 */
		readonly label: string;

		private constructor(id: string, label: string);
	}

	export class LanguageModelToolMCPSource {
		/**
		 * Editor-configured label of the MCP server that published the tool.
		 */
		readonly label: string;

		/**
		 * Server-defined name of the MCP server.
		 */
		readonly name: string;

		/**
		 * Server-defined instructions for MCP tool use.
		 */
		readonly instructions?: string;

		private constructor(label: string, name: string, instructions?: string);
	}

	export interface LanguageModelToolInformation {
		source: LanguageModelToolExtensionSource | LanguageModelToolMCPSource | undefined;
	}

	// TODO@API fit this into the stream
	export interface ChatUsedContext {
		documents: ChatDocumentContext[];
	}

	export interface ChatParticipant {
		/**
		 * Provide a set of variables that can only be used with this participant.
		 */
		participantVariableProvider?: { provider: ChatParticipantCompletionItemProvider; triggerCharacters: string[] };

		/**
		 * Event that fires when a request is paused or unpaused.
		 * Chat requests are initially unpaused in the {@link requestHandler}.
		 */
		readonly onDidChangePauseState: Event<ChatParticipantPauseStateEvent>;
	}

	export interface ChatParticipantPauseStateEvent {
		request: ChatRequest;
		isPaused: boolean;
	}

	export interface ChatParticipantCompletionItemProvider {
		provideCompletionItems(query: string, token: CancellationToken): ProviderResult<ChatCompletionItem[]>;
	}

	export class ChatCompletionItem {
		id: string;
		label: string | CompletionItemLabel;
		values: ChatVariableValue[];
		fullName?: string;
		icon?: ThemeIcon;
		insertText?: string;
		detail?: string;
		documentation?: string | MarkdownString;
		command?: Command;

		constructor(id: string, label: string | CompletionItemLabel, values: ChatVariableValue[]);
	}

	export type ChatExtendedRequestHandler = (request: ChatRequest, context: ChatContext, response: ChatResponseStream, token: CancellationToken) => ProviderResult<ChatResult | void>;

	export interface ChatResult {
		nextQuestion?: {
			prompt: string;
			participant?: string;
			command?: string;
		};
		/**
		 * An optional detail string that will be rendered at the end of the response in certain UI contexts.
		 */
		details?: string;
	}

	export namespace chat {
		/**
		 * Create a chat participant with the extended progress type
		 */
		export function createChatParticipant(id: string, handler: ChatExtendedRequestHandler): ChatParticipant;
	}

	/*
	 * User action events
	 */

	export enum ChatCopyKind {
		// Keyboard shortcut or context menu
		Action = 1,
		Toolbar = 2
	}

	export interface ChatCopyAction {
		// eslint-disable-next-line local/vscode-dts-string-type-literals
		kind: 'copy';
		codeBlockIndex: number;
		copyKind: ChatCopyKind;
		copiedCharacters: number;
		totalCharacters: number;
		copiedText: string;
		totalLines: number;
		copiedLines: number;
		modelId: string;
		languageId?: string;
	}

	export interface ChatInsertAction {
		// eslint-disable-next-line local/vscode-dts-string-type-literals
		kind: 'insert';
		codeBlockIndex: number;
		totalCharacters: number;
		totalLines: number;
		languageId?: string;
		modelId: string;
		newFile?: boolean;
	}

	export interface ChatApplyAction {
		// eslint-disable-next-line local/vscode-dts-string-type-literals
		kind: 'apply';
		codeBlockIndex: number;
		totalCharacters: number;
		totalLines: number;
		languageId?: string;
		modelId: string;
		newFile?: boolean;
		codeMapper?: string;
	}

	export interface ChatTerminalAction {
		// eslint-disable-next-line local/vscode-dts-string-type-literals
		kind: 'runInTerminal';
		codeBlockIndex: number;
		languageId?: string;
	}

	export interface ChatCommandAction {
		// eslint-disable-next-line local/vscode-dts-string-type-literals
		kind: 'command';
		commandButton: ChatCommandButton;
	}

	export interface ChatFollowupAction {
		// eslint-disable-next-line local/vscode-dts-string-type-literals
		kind: 'followUp';
		followup: ChatFollowup;
	}

	export interface ChatBugReportAction {
		// eslint-disable-next-line local/vscode-dts-string-type-literals
		kind: 'bug';
	}

	export interface ChatEditorAction {
		// eslint-disable-next-line local/vscode-dts-string-type-literals
		kind: 'editor';
		accepted: boolean;
	}

	export interface ChatEditingSessionAction {
		// eslint-disable-next-line local/vscode-dts-string-type-literals
		kind: 'chatEditingSessionAction';
		uri: Uri;
		hasRemainingEdits: boolean;
		outcome: ChatEditingSessionActionOutcome;
	}

	export interface ChatEditingHunkAction {
		// eslint-disable-next-line local/vscode-dts-string-type-literals
		kind: 'chatEditingHunkAction';
		uri: Uri;
		lineCount: number;
		linesAdded: number;
		linesRemoved: number;
		outcome: ChatEditingSessionActionOutcome;
		hasRemainingEdits: boolean;
	}

	export enum ChatEditingSessionActionOutcome {
		Accepted = 1,
		Rejected = 2,
		Saved = 3
	}

	export interface ChatUserActionEvent {
		readonly result: ChatResult;
		readonly action: ChatCopyAction | ChatInsertAction | ChatApplyAction | ChatTerminalAction | ChatCommandAction | ChatFollowupAction | ChatBugReportAction | ChatEditorAction | ChatEditingSessionAction | ChatEditingHunkAction;
	}

	export interface ChatPromptReference {
		/**
		 * TODO Needed for now to drive the variableName-type reference, but probably both of these should go away in the future.
		 */
		readonly name: string;

		/**
		 * The list of tools were referenced in the value of the reference
		 */
		readonly toolReferences?: readonly ChatLanguageModelToolReference[];
	}

	export interface ChatResultFeedback {
		readonly unhelpfulReason?: string;
	}

	export namespace lm {
		export function fileIsIgnored(uri: Uri, token?: CancellationToken): Thenable<boolean>;
	}

	export interface ChatVariableValue {
		/**
		 * The detail level of this chat variable value. If possible, variable resolvers should try to offer shorter values that will consume fewer tokens in an LLM prompt.
		 */
		level: ChatVariableLevel;

		/**
		 * The variable's value, which can be included in an LLM prompt as-is, or the chat participant may decide to read the value and do something else with it.
		 */
		value: string | Uri;

		/**
		 * A description of this value, which could be provided to the LLM as a hint.
		 */
		description?: string;
	}

	/**
	 * The detail level of this chat variable value.
	 */
	export enum ChatVariableLevel {
		Short = 1,
		Medium = 2,
		Full = 3
	}

	export interface LanguageModelToolInvocationOptions<T> {
		model?: LanguageModelChat;
	}

	export interface ChatRequest {
		readonly modeInstructions?: string;
		readonly modeInstructions2?: ChatRequestModeInstructions;
	}

	export interface ChatRequestModeInstructions {
		readonly name: string;
		readonly content: string;
		readonly toolReferences?: readonly ChatLanguageModelToolReference[];
		readonly metadata?: Record<string, boolean | string | number>;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.chatParticipantPrivate.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.chatParticipantPrivate.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// version: 11

declare module 'vscode' {

	/**
	 * The location at which the chat is happening.
	 */
	export enum ChatLocation {
		/**
		 * The chat panel
		 */
		Panel = 1,
		/**
		 * Terminal inline chat
		 */
		Terminal = 2,
		/**
		 * Notebook inline chat
		 */
		Notebook = 3,
		/**
		 * Code editor inline chat
		 */
		Editor = 4,
	}

	export class ChatRequestEditorData {

		readonly editor: TextEditor;

		//TODO@API should be the editor
		document: TextDocument;
		selection: Selection;

		/** @deprecated */
		wholeRange: Range;

		constructor(editor: TextEditor, document: TextDocument, selection: Selection, wholeRange: Range);
	}

	export class ChatRequestNotebookData {
		//TODO@API should be the editor
		readonly cell: TextDocument;

		constructor(cell: TextDocument);
	}

	export interface ChatRequest {
		/**
		 * The id of the chat request. Used to identity an interaction with any of the chat surfaces.
		 */
		readonly id: string;
		/**
		 * The attempt number of the request. The first request has attempt number 0.
		 */
		readonly attempt: number;

		/**
		 * The session identifier for this chat request
		 */
		readonly sessionId: string;

		/**
		 * If automatic command detection is enabled.
		 */
		readonly enableCommandDetection: boolean;

		/**
		 * If the chat participant or command was automatically assigned.
		 */
		readonly isParticipantDetected: boolean;

		/**
		 * The location at which the chat is happening. This will always be one of the supported values
		 *
		 * @deprecated
		 */
		readonly location: ChatLocation;

		/**
		 * Information that is specific to the location at which chat is happening, e.g within a document, notebook,
		 * or terminal. Will be `undefined` for the chat panel.
		 */
		readonly location2: ChatRequestEditorData | ChatRequestNotebookData | undefined;

		/**
		 * Events for edited files in this session collected since the last request.
		 */
		readonly editedFileEvents?: ChatRequestEditedFileEvent[];

		readonly isSubagent?: boolean;
	}

	export enum ChatRequestEditedFileEventKind {
		Keep = 1,
		Undo = 2,
		UserModification = 3,
	}

	export interface ChatRequestEditedFileEvent {
		readonly uri: Uri;
		readonly eventKind: ChatRequestEditedFileEventKind;
	}

	/**
	 * ChatRequestTurn + private additions. Note- at runtime this is the SAME as ChatRequestTurn and instanceof is safe.
	 */
	export class ChatRequestTurn2 {
		/**
		 * The prompt as entered by the user.
		 *
		 * Information about references used in this request is stored in {@link ChatRequestTurn.references}.
		 *
		 * *Note* that the {@link ChatParticipant.name name} of the participant and the {@link ChatCommand.name command}
		 * are not part of the prompt.
		 */
		readonly prompt: string;

		/**
		 * The id of the chat participant to which this request was directed.
		 */
		readonly participant: string;

		/**
		 * The name of the {@link ChatCommand command} that was selected for this request.
		 */
		readonly command?: string;

		/**
		 * The references that were used in this message.
		 */
		readonly references: ChatPromptReference[];

		/**
		 * The list of tools were attached to this request.
		 */
		readonly toolReferences: readonly ChatLanguageModelToolReference[];

		/**
		 * Events for edited files in this session collected between the previous request and this one.
		 */
		readonly editedFileEvents?: ChatRequestEditedFileEvent[];

		/**
		 * @hidden
		 */
		constructor(prompt: string, command: string | undefined, references: ChatPromptReference[], participant: string, toolReferences: ChatLanguageModelToolReference[], editedFileEvents: ChatRequestEditedFileEvent[] | undefined);
	}

	export class ChatResponseTurn2 {
		/**
		 * The id of the chat response. Used to identity an interaction with any of the chat surfaces.
		 */
		readonly id?: string;

		/**
		 * The content that was received from the chat participant. Only the stream parts that represent actual content (not metadata) are represented.
		 */
		readonly response: ReadonlyArray<ChatResponseMarkdownPart | ChatResponseFileTreePart | ChatResponseAnchorPart | ChatResponseCommandButtonPart | ExtendedChatResponsePart | ChatToolInvocationPart>;

		/**
		 * The result that was received from the chat participant.
		 */
		readonly result: ChatResult;

		/**
		 * The id of the chat participant that this response came from.
		 */
		readonly participant: string;

		/**
		 * The name of the command that this response came from.
		 */
		readonly command?: string;

		constructor(response: ReadonlyArray<ChatResponseMarkdownPart | ChatResponseFileTreePart | ChatResponseAnchorPart | ChatResponseCommandButtonPart | ExtendedChatResponsePart>, result: ChatResult, participant: string);
	}

	export interface ChatParticipant {
		supportIssueReporting?: boolean;
	}

	export enum ChatErrorLevel {
		Info = 0,
		Warning = 1,
		Error = 2,
	}

	export interface ChatErrorDetails {
		/**
		 * If set to true, the message content is completely hidden. Only ChatErrorDetails#message will be shown.
		 */
		responseIsRedacted?: boolean;

		isQuotaExceeded?: boolean;

		isRateLimited?: boolean;

		level?: ChatErrorLevel;

		code?: string;
	}

	export namespace chat {
		export function createDynamicChatParticipant(id: string, dynamicProps: DynamicChatParticipantProps, handler: ChatExtendedRequestHandler): ChatParticipant;
	}

	/**
	 * These don't get set on the ChatParticipant after creation, like other props, because they are typically defined in package.json and we want them at the time of creation.
	 */
	export interface DynamicChatParticipantProps {
		name: string;
		publisherName: string;
		description?: string;
		fullName?: string;
	}

	export namespace lm {
		export function registerIgnoredFileProvider(provider: LanguageModelIgnoredFileProvider): Disposable;
	}

	export interface LanguageModelIgnoredFileProvider {
		provideFileIgnored(uri: Uri, token: CancellationToken): ProviderResult<boolean>;
	}

	export interface LanguageModelToolInvocationOptions<T> {
		chatRequestId?: string;
		chatSessionId?: string;
		chatInteractionId?: string;
		terminalCommand?: string;
		/**
		 * Lets us add some nicer UI to toolcalls that came from a sub-agent, but in the long run, this should probably just be rendered in a similar way to thinking text + tool call groups
		 */
		fromSubAgent?: boolean;
	}

	export interface LanguageModelToolInvocationPrepareOptions<T> {
		/**
		 * The input that the tool is being invoked with.
		 */
		input: T;
		chatRequestId?: string;
		chatSessionId?: string;
		chatInteractionId?: string;
	}

	export interface PreparedToolInvocation {
		pastTenseMessage?: string | MarkdownString;
		presentation?: 'hidden' | 'hiddenAfterComplete' | undefined;
	}

	export class ExtendedLanguageModelToolResult extends LanguageModelToolResult {
		toolResultMessage?: string | MarkdownString;
		toolResultDetails?: Array<Uri | Location>;
		toolMetadata?: unknown;
		/** Whether there was an error calling the tool. The tool may still have partially succeeded. */
		hasError?: boolean;
	}

	// #region Chat participant detection

	export interface ChatParticipantMetadata {
		participant: string;
		command?: string;
		disambiguation: { category: string; description: string; examples: string[] }[];
	}

	export interface ChatParticipantDetectionResult {
		participant: string;
		command?: string;
	}

	export interface ChatParticipantDetectionProvider {
		provideParticipantDetection(chatRequest: ChatRequest, context: ChatContext, options: { participants?: ChatParticipantMetadata[]; location: ChatLocation }, token: CancellationToken): ProviderResult<ChatParticipantDetectionResult>;
	}

	export namespace chat {
		export function registerChatParticipantDetectionProvider(participantDetectionProvider: ChatParticipantDetectionProvider): Disposable;

		export const onDidDisposeChatSession: Event<string>;
	}

	// #endregion

	// #region ChatErrorDetailsWithConfirmation

	export interface ChatErrorDetails {
		confirmationButtons?: ChatErrorDetailsConfirmationButton[];
	}

	export interface ChatErrorDetailsConfirmationButton {
		data: any;
		label: string;
	}

	// #endregion

	// #region LanguageModelProxyProvider

	/**
	 * Duplicated so that this proposal and languageModelProxy can be independent.
	 */
	export interface LanguageModelProxy extends Disposable {
		readonly uri: Uri;
		readonly key: string;
	}

	export interface LanguageModelProxyProvider {
		provideModelProxy(forExtensionId: string, token: CancellationToken): ProviderResult<LanguageModelProxy>;
	}

	export namespace lm {
		export function registerLanguageModelProxyProvider(provider: LanguageModelProxyProvider): Disposable;
	}

	// #endregion

	// #region CustomAgentsProvider

	/**
	 * Represents a custom agent resource file (e.g., .agent.md or .prompt.md) available for a repository.
	 */
	export interface CustomAgentResource {
		/**
		 * The unique identifier/name of the custom agent resource.
		 */
		readonly name: string;

		/**
		 * A description of what the custom agent resource does.
		 */
		readonly description: string;

		/**
		 * The URI to the agent or prompt resource file.
		 */
		readonly uri: Uri;

		/**
		 * Indicates whether the custom agent resource is editable. Defaults to false.
		 */
		readonly isEditable?: boolean;
	}

	/**
	 * Options for querying custom agents.
	 */
	export interface CustomAgentQueryOptions { }

	/**
	 * A provider that supplies custom agent resources (from .agent.md and .prompt.md files) for repositories.
	 */
	export interface CustomAgentsProvider {
		/**
		 * An optional event to signal that custom agents have changed.
		 */
		readonly onDidChangeCustomAgents?: Event<void>;

		/**
		 * Provide the list of custom agent resources available for a given repository.
		 * @param options Optional query parameters.
		 * @param token A cancellation token.
		 * @returns An array of custom agent resources or a promise that resolves to such.
		 */
		provideCustomAgents(options: CustomAgentQueryOptions, token: CancellationToken): ProviderResult<CustomAgentResource[]>;
	}

	export namespace chat {
		/**
		 * Register a provider for custom agents.
		 * @param provider The custom agents provider.
		 * @returns A disposable that unregisters the provider when disposed.
		 */
		export function registerCustomAgentsProvider(provider: CustomAgentsProvider): Disposable;
	}

	// #endregion
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.chatProvider.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.chatProvider.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// version: 4

declare module 'vscode' {

	/**
	* The provider version of {@linkcode LanguageModelChatRequestOptions}
	*/
	export interface ProvideLanguageModelChatResponseOptions {

		/**
		 * What extension initiated the request to the language model
		 */
		readonly requestInitiator: string;
	}

	/**
	 * All the information representing a single language model contributed by a {@linkcode LanguageModelChatProvider}.
	 */
	export interface LanguageModelChatInformation {

		/**
		 * When present, this gates the use of `requestLanguageModelAccess` behind an authorization flow where
		 * the user must approve of another extension accessing the models contributed by this extension.
		 * Additionally, the extension can provide a label that will be shown in the UI.
		 * A common example of a label is an account name that is signed in.
		 *
		 */
		requiresAuthorization?: true | { label: string };

		/**
		 * Whether or not this will be selected by default in the model picker
		 * NOT BEING FINALIZED
		 */
		readonly isDefault?: boolean;

		/**
		 * Whether or not the model will show up in the model picker immediately upon being made known via {@linkcode LanguageModelChatProvider.provideLanguageModelChatInformation}.
		 * NOT BEING FINALIZED
		 */
		readonly isUserSelectable?: boolean;

		/**
		 * Optional category to group models by in the model picker.
		 * The lower the order, the higher the category appears in the list.
		 * Has no effect if `isUserSelectable` is `false`.
		 *
		 * WONT BE FINALIZED
		 */
		readonly category?: { label: string; order: number };

		readonly statusIcon?: ThemeIcon;
	}

	export interface LanguageModelChatCapabilities {
		/**
		 * The tools the model prefers for making file edits. If not provided or if none of the tools,
		 * are recognized, the editor will try multiple edit tools and pick the best one. The available
		 * edit tools WILL change over time and this capability only serves as a hint to the editor.
		 *
		 * Edit tools currently recognized include:
		 * - 'find-replace': Find and replace text in a document.
		 * - 'multi-find-replace': Find and replace multiple text snippets across documents.
		 * - 'apply-patch': A file-oriented diff format used by some OpenAI models
		 * - 'code-rewrite': A general but slower editing tool that allows the model
		 *   to rewrite and code snippet and provide only the replacement to the editor.
		 *
		 * The order of edit tools in this array has no significance; all of the recognized edit
		 * tools will be made available to the model.
		 */
		readonly editTools?: string[];
	}

	export type LanguageModelResponsePart2 = LanguageModelResponsePart | LanguageModelDataPart | LanguageModelThinkingPart;

	export interface LanguageModelChatProvider<T extends LanguageModelChatInformation = LanguageModelChatInformation> {
		provideLanguageModelChatResponse(model: T, messages: readonly LanguageModelChatRequestMessage[], options: ProvideLanguageModelChatResponseOptions, progress: Progress<LanguageModelResponsePart2>, token: CancellationToken): Thenable<void>;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.chatReferenceBinaryData.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.chatReferenceBinaryData.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	export interface ChatPromptReference {
		/**
		 * The value of this reference. The `string | Uri | Location` types are used today, but this could expand in the future.
		 */
		readonly value: string | Uri | Location | ChatReferenceBinaryData | unknown;
	}

	export class ChatReferenceBinaryData {
		/**
		 * The MIME type of the binary data.
		 */
		readonly mimeType: string;

		/**
		 * Retrieves the binary data of the reference. This is primarily used to receive image attachments from the chat.
		 * @returns A promise that resolves to the binary data as a Uint8Array.
		 */
		data(): Thenable<Uint8Array>;

		/**
		 * Retrieves a URI reference to the binary data, if available.
		 */
		readonly reference?: Uri;

		/**
		 * @param mimeType The MIME type of the binary data.
		 * @param data The binary data of the reference.
		 */
		constructor(mimeType: string, data: () => Thenable<Uint8Array>);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.chatReferenceDiagnostic.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.chatReferenceDiagnostic.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	export interface ChatPromptReference {
		/**
		 * The value of this reference. The `string | Uri | Location` types are used today, but this could expand in the future.
		 */
		readonly value: string | Uri | Location | ChatReferenceDiagnostic | unknown;
	}

	export class ChatReferenceDiagnostic {
		/**
		 * All attached diagnostics. An array of uri-diagnostics tuples or an empty array.
		 */
		readonly diagnostics: [Uri, Diagnostic[]][];

		constructor(diagnostics: [Uri, Diagnostic[]][]);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.chatSessionsProvider.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.chatSessionsProvider.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// version: 3

declare module 'vscode' {
	/**
	 * Represents the status of a chat session.
	 */
	export enum ChatSessionStatus {
		/**
		 * The chat session failed to complete.
		 */
		Failed = 0,

		/**
		 * The chat session completed successfully.
		 */
		Completed = 1,

		/**
		 * The chat session is currently in progress.
		 */
		InProgress = 2
	}

	/**
	 * Provides a list of information about chat sessions.
	 */
	export interface ChatSessionItemProvider {
		/**
		 * Event that the provider can fire to signal that chat sessions have changed.
		 */
		readonly onDidChangeChatSessionItems: Event<void>;

		/**
		 * Provides a list of chat sessions.
		 */
		// TODO: Do we need a flag to try auth if needed?
		provideChatSessionItems(token: CancellationToken): ProviderResult<ChatSessionItem[]>;

		// #region Unstable parts of API

		/**
		 * Event that the provider can fire to signal that the current (original) chat session should be replaced with a new (modified) chat session.
		 * The UI can use this information to gracefully migrate the user to the new session.
		 */
		readonly onDidCommitChatSessionItem: Event<{ original: ChatSessionItem /** untitled */; modified: ChatSessionItem /** newly created */ }>;

		/**
		 * DEPRECATED: Will be removed!
		 * Creates a new chat session.
		 *
		 * @param options Options for the new session including an optional initial prompt and history
		 * @param token A cancellation token
		 * @returns Metadata for the chat session
		 */
		provideNewChatSessionItem?(options: {
			/**
			 * The chat request that initiated the session creation
			 */
			readonly request: ChatRequest;

			/**
			 * Additional metadata to use for session creation
			 */
			metadata?: any;
		}, token: CancellationToken): ProviderResult<ChatSessionItem>;

		// #endregion
	}

	export interface ChatSessionItem {
		/**
		 * The resource associated with the chat session.
		 *
		 * This is uniquely identifies the chat session and is used to open the chat session.
		 */
		resource: Uri;

		/**
		 * Human readable name of the session shown in the UI
		 */
		label: string;

		/**
		 * An icon for the participant shown in UI.
		 */
		iconPath?: IconPath;

		/**
		 * An optional description that provides additional context about the chat session.
		 */
		description?: string | MarkdownString;

		/**
		 * An optional badge that provides additional context about the chat session.
		 */
		badge?: string | MarkdownString;

		/**
		 * An optional status indicating the current state of the session.
		 */
		status?: ChatSessionStatus;

		/**
		 * The tooltip text when you hover over this item.
		 */
		tooltip?: string | MarkdownString;

		/**
		 * The times at which session started and ended
		 */
		timing?: {
			/**
			 * Session start timestamp in milliseconds elapsed since January 1, 1970 00:00:00 UTC.
			 */
			startTime: number;
			/**
			 * Session end timestamp in milliseconds elapsed since January 1, 1970 00:00:00 UTC.
			 */
			endTime?: number;
		};

		/**
		 * Statistics about the chat session.
		 */
		changes?: readonly ChatSessionChangedFile[] | {
			/**
			 * Number of files edited during the session.
			 */
			files: number;

			/**
			 * Number of insertions made during the session.
			 */
			insertions: number;

			/**
			 * Number of deletions made during the session.
			 */
			deletions: number;
		};
	}

	export class ChatSessionChangedFile {
		/**
		 * URI of the file.
		 */
		modifiedUri: Uri;

		/**
		 * File opened when the user takes the 'compare' action.
		 */
		originalUri?: Uri;

		/**
		 * Number of insertions made during the session.
		 */
		insertions: number;

		/**
		 * Number of deletions made during the session.
		 */
		deletions: number;

		constructor(modifiedUri: Uri, insertions: number, deletions: number, originalUri?: Uri);
	}

	export interface ChatSession {
		/**
		 * The full history of the session
		 *
		 * This should not include any currently active responses
		 */
		// TODO: Are these the right types to use?
		// TODO: link request + response to encourage correct usage?
		readonly history: ReadonlyArray<ChatRequestTurn | ChatResponseTurn2>;

		/**
		 * Options configured for this session as key-value pairs.
		 * Keys correspond to option group IDs (e.g., 'models', 'subagents').
		 * Values can be either:
		 * - A string (the option item ID) for backwards compatibility
		 * - A ChatSessionProviderOptionItem object to include metadata like locked state
		 * TODO: Strongly type the keys
		 */
		readonly options?: Record<string, string | ChatSessionProviderOptionItem>;

		/**
		 * Callback invoked by the editor for a currently running response. This allows the session to push items for the
		 * current response and stream these in as them come in. The current response will be considered complete once the
		 * callback resolved.
		 *
		 * If not provided, the chat session is assumed to not currently be running.
		 */
		readonly activeResponseCallback?: (stream: ChatResponseStream, token: CancellationToken) => Thenable<void>;

		/**
		 * Handles new request for the session.
		 *
		 * If not set, then the session will be considered read-only and no requests can be made.
		 */
		// TODO: Should we introduce our own type for `ChatRequestHandler` since not all field apply to chat sessions?
		// TODO: Revisit this to align with code.
		readonly requestHandler: ChatRequestHandler | undefined;
	}

	/**
	 * Event fired when chat session options change.
	 */
	export interface ChatSessionOptionChangeEvent {
		/**
		 * Identifier of the chat session being updated.
		 */
		readonly resource: Uri;
		/**
		 * Collection of option identifiers and their new values. Only the options that changed are included.
		 */
		readonly updates: ReadonlyArray<{
			/**
			 * Identifier of the option that changed (for example `model`).
			 */
			readonly optionId: string;

			/**
			 * The new value assigned to the option. When `undefined`, the option is cleared.
			 */
			readonly value: string | ChatSessionProviderOptionItem;
		}>;
	}

	/**
	 * Provides the content for a chat session rendered using the native chat UI.
	 */
	export interface ChatSessionContentProvider {
		/**
		 * Event that the provider can fire to signal that the options for a chat session have changed.
		 */
		readonly onDidChangeChatSessionOptions?: Event<ChatSessionOptionChangeEvent>;

		/**
		 * Provides the chat session content for a given uri.
		 *
		 * The returned {@linkcode ChatSession} is used to populate the history of the chat UI.
		 *
		 * @param resource The URI of the chat session to resolve.
		 * @param token A cancellation token that can be used to cancel the operation.
		 *
		 * @return The {@link ChatSession chat session} associated with the given URI.
		 */
		provideChatSessionContent(resource: Uri, token: CancellationToken): Thenable<ChatSession> | ChatSession;

		/**
		 * @param resource Identifier of the chat session being updated.
		 * @param updates Collection of option identifiers and their new values. Only the options that changed are included.
		 * @param token A cancellation token that can be used to cancel the notification if the session is disposed.
		 */
		provideHandleOptionsChange?(resource: Uri, updates: ReadonlyArray<ChatSessionOptionUpdate>, token: CancellationToken): void;

		/**
		 * Called as soon as you register (call me once)
		 * @param token
		 */
		provideChatSessionProviderOptions?(token: CancellationToken): Thenable<ChatSessionProviderOptions> | ChatSessionProviderOptions;
	}

	export interface ChatSessionOptionUpdate {
		/**
		 * Identifier of the option that changed (for example `model`).
		 */
		readonly optionId: string;

		/**
		 * The new value assigned to the option. When `undefined`, the option is cleared.
		 */
		readonly value: string | undefined;
	}

	export namespace chat {
		/**
		 * Registers a new {@link ChatSessionItemProvider chat session item provider}.
		 *
		 * To use this, also make sure to also add `chatSessions` contribution in the `package.json`.
		 *
		 * @param chatSessionType The type of chat session the provider is for.
		 * @param provider The provider to register.
		 *
		 * @returns A disposable that unregisters the provider when disposed.
		 */
		export function registerChatSessionItemProvider(chatSessionType: string, provider: ChatSessionItemProvider): Disposable;

		/**
		 * Registers a new {@link ChatSessionContentProvider chat session content provider}.
		 *
		 * @param scheme The uri-scheme to register for. This must be unique.
		 * @param provider The provider to register.
		 *
		 * @returns A disposable that unregisters the provider when disposed.
		 */
		export function registerChatSessionContentProvider(scheme: string, provider: ChatSessionContentProvider, chatParticipant: ChatParticipant, capabilities?: ChatSessionCapabilities): Disposable;
	}

	export interface ChatContext {
		readonly chatSessionContext?: ChatSessionContext;
	}

	export interface ChatSessionContext {
		readonly chatSessionItem: ChatSessionItem; // Maps to URI of chat session editor (could be 'untitled-1', etc..)
		readonly isUntitled: boolean;
	}

	export interface ChatSessionCapabilities {
		/**
		 * Whether sessions can be interrupted and resumed without side-effects.
		 */
		supportsInterruptions?: boolean;
	}

	/**
	 * Represents a single selectable item within a provider option group.
	 */
	export interface ChatSessionProviderOptionItem {
		/**
		 * Unique identifier for the option item.
		 */
		readonly id: string;

		/**
		 * Human-readable name displayed in the UI.
		 */
		readonly name: string;

		/**
		 * Optional description shown in tooltips.
		 */
		readonly description?: string;

		/**
		 * When true, this option is locked and cannot be changed by the user.
		 * The option will still be visible in the UI but will be disabled.
		 * Use this when an option is set but cannot be hot-swapped (e.g., model already initialized).
		 */
		readonly locked?: boolean;

		/**
		 * An icon for the option item shown in UI.
		 */
		readonly icon?: ThemeIcon;
	}

	/**
	 * Represents a group of related provider options (e.g., models, sub-agents).
	 */
	export interface ChatSessionProviderOptionGroup {
		/**
		 * Unique identifier for the option group (e.g., "models", "subagents").
		 */
		readonly id: string;

		/**
		 * Human-readable name for the option group.
		 */
		readonly name: string;

		/**
		 * Optional description providing context about this option group.
		 */
		readonly description?: string;

		/**
		 * The selectable items within this option group.
		 */
		readonly items: ChatSessionProviderOptionItem[];
	}

	export interface ChatSessionProviderOptions {
		/**
		 * Provider-defined option groups (0-2 groups supported).
		 * Examples: models picker, sub-agents picker, etc.
		 */
		optionGroups?: ChatSessionProviderOptionGroup[];
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.chatStatusItem.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.chatStatusItem.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	export interface ChatStatusItem {
		/**
		 * The identifier of this item.
		 */
		readonly id: string;

		/**
		 * The main name of the entry, like 'Indexing Status'
		 */
		title: string | { label: string; link: string };

		/**
		 * Optional additional description of the entry.
		 *
		 * This is rendered after the title. Supports Markdown style links (`[text](http://example.com)`) and rendering of
		 * {@link ThemeIcon theme icons} via the `$(<name>)`-syntax.
		 */
		description: string;

		/**
		 * Optional additional details of the entry.
		 *
		 * This is rendered less prominently after the title. Supports Markdown style links (`[text](http://example.com)`) and rendering of
		 * {@link ThemeIcon theme icons} via the `$(<name>)`-syntax.
		 */
		detail: string | undefined;

		/**
		 * Shows the entry in the chat status.
		 */
		show(): void;

		/**
		 * Hide the entry in the chat status.
		 */
		hide(): void;

		/**
		 * Dispose and free associated resources
		 */
		dispose(): void;
	}

	namespace window {
		/**
		 * Create a new chat status item.
		 *
		 * @param id The unique identifier of the status bar item.
		 *
		 * @returns A new chat status item.
		 */
		export function createChatStatusItem(id: string): ChatStatusItem;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.chatTab.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.chatTab.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {
	/**
	 * The tab represents an interactive window.
	 */
	export class TabInputChat {
		constructor();
	}

	export interface Tab {
		readonly input: TabInputText | TabInputTextDiff | TabInputCustom | TabInputWebview | TabInputNotebook | TabInputNotebookDiff | TabInputTerminal | TabInputChat | unknown;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.codeActionAI.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.codeActionAI.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	export interface CodeAction {
		/**
		 * Marks this as an AI action.
		 *
		 * Ex: A quick fix should be marked AI if it invokes AI.
		 */
		isAI?: boolean;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.codeActionRanges.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.codeActionRanges.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	export interface CodeAction {
		/**
		 * The ranges to which this Code Action applies to, which will be highlighted.
		 * For example: A refactoring action will highlight the range of text that will be affected.
		 */
		ranges?: Range[];
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.codiconDecoration.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.codiconDecoration.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/135591 @alexr00

	// export interface FileDecorationProvider {
	// 	provideFileDecoration(uri: Uri, token: CancellationToken): ProviderResult<FileDecoration | FileDecoration1>;
	// }

	/**
	 * A file decoration represents metadata that can be rendered with a file.
	 */
	export class FileDecoration2 {
		/**
		 * A very short string that represents this decoration.
		 */
		badge?: string | ThemeIcon;

		/**
		 * A human-readable tooltip for this decoration.
		 */
		tooltip?: string;

		/**
		 * The color of this decoration.
		 */
		color?: ThemeColor;

		/**
		 * A flag expressing that this decoration should be
		 * propagated to its parents.
		 */
		propagate?: boolean;

		/**
		 * Creates a new decoration.
		 *
		 * @param badge A letter that represents the decoration.
		 * @param tooltip The tooltip of the decoration.
		 * @param color The color of the decoration.
		 */
		constructor(badge?: string | ThemeIcon, tooltip?: string, color?: ThemeColor);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.commentingRangeHint.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.commentingRangeHint.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// @alexr00 https://github.com/microsoft/vscode/issues/185551

	/**
	 * Commenting range provider for a {@link CommentController comment controller}.
	 */
	export interface CommentingRangeProvider {
		readonly resourceHints?: { schemes: readonly string[] };
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.commentReactor.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.commentReactor.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// @alexr00 https://github.com/microsoft/vscode/issues/201131

	export interface CommentReaction {
		readonly reactors?: readonly CommentAuthorInformation[];
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.commentReveal.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.commentReveal.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// @alexr00 https://github.com/microsoft/vscode/issues/167253

	export enum CommentThreadFocus {
		/**
		 * Focus the comment editor if the thread supports replying.
		 */
		Reply = 1,
		/**
		 * Focus the revealed comment.
		 */
		Comment = 2
	}

	/**
	 * Options to reveal a comment thread in an editor.
	 */
	export interface CommentThreadRevealOptions {

		/**
		 * Where to move the focus to when revealing the comment thread.
		 * If undefined, the focus will not be changed.
		 */
		focus?: CommentThreadFocus;
	}

	export interface CommentThread2 {
		/**
		 * Reveal the comment thread in an editor. If no comment is provided, the first comment in the thread will be revealed.
		 */
		reveal(comment?: Comment, options?: CommentThreadRevealOptions): Thenable<void>;

		/**
		 * Collapse the comment thread in an editor.
		 */
		hide(): Thenable<void>;
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.commentsDraftState.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.commentsDraftState.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/171166

	export enum CommentState {
		Published = 0,
		Draft = 1
	}

	export interface Comment {
		state?: CommentState;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.commentThreadApplicability.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.commentThreadApplicability.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// @alexr00 https://github.com/microsoft/vscode/issues/207402

	export enum CommentThreadApplicability {
		Current = 0,
		Outdated = 1
	}

	export interface CommentThread2 {
		/* @api this is a bit weird for the extension now. The CommentThread is a managed object, which means it listens
		 * to when it's properties are set, but not if it's properties are modified. This means that this will not work to update the resolved state
		 *
		 * thread.state.resolved = CommentThreadState.Resolved;
		 *
		 * but this will work
		 *
		 * thread.state = {
		 *   resolved: CommentThreadState.Resolved
		 *   applicability: thread.state.applicability
		 * };
		 *
		 * Worth noting that we already have this problem for the `comments` property.
		*/
		state?: CommentThreadState | { resolved?: CommentThreadState; applicability?: CommentThreadApplicability };
		readonly uri: Uri;
		range: Range | undefined;
		comments: readonly Comment[];
		collapsibleState: CommentThreadCollapsibleState;
		canReply: boolean | CommentAuthorInformation;
		contextValue?: string;
		label?: string;
		dispose(): void;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.contribAccessibilityHelpContent.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.contribAccessibilityHelpContent.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// empty placeholder declaration for the `accessibilityHelpContent`-property of the `views`-contribution

// https://github.com/microsoft/vscode/issues/209855 @meganrogge

/**
 * View contributions can include an `accessibilityHelpContent` property that provides help content for screen readers
 * when the accessibility help dialog is invoked by the user with focus in the view.
 *
 * The content is provided as a markdown string and can contain commands that will be resolved along with their keybindings.
 */
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.contribCommentEditorActionsMenu.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.contribCommentEditorActionsMenu.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// empty placeholder declaration for the `comments/comment/editorActions` menu
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.contribCommentPeekContext.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.contribCommentPeekContext.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// empty placeholder for comment peek context menus

// https://github.com/microsoft/vscode/issues/151533 @alexr00
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.contribCommentsViewThreadMenus.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.contribCommentsViewThreadMenus.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// empty placeholder declaration for the `commentsView/commentThread/context` menu contribution point
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.contribCommentThreadAdditionalMenu.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.contribCommentThreadAdditionalMenu.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// empty placeholder for comment thread additional menus

// https://github.com/microsoft/vscode/issues/163281
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.contribDebugCreateConfiguration.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.contribDebugCreateConfiguration.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// empty placeholder declaration for the `debugCreateConfiguration` menu
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.contribDiffEditorGutterToolBarMenus.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.contribDiffEditorGutterToolBarMenus.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// empty placeholder declaration for `diffEditor/gutter/*` menus
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.contribEditorContentMenu.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.contribEditorContentMenu.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// empty placeholder declaration for the `editor/content` menu
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.contribEditSessions.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.contribEditSessions.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// empty placeholder for edit sessions contribution point from core

// https://github.com/microsoft/vscode/issues/157734 @joyceerhl
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.contribLabelFormatterWorkspaceTooltip.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.contribLabelFormatterWorkspaceTooltip.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// empty placeholder declaration for the `workspaceTooltip`-property of the `resourceLabelFormatters` contribution poain
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.contribLanguageModelToolSets.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.contribLanguageModelToolSets.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// empty placeholder declaration for the `languageModelToolSets` contribution point
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.contribMenuBarHome.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.contribMenuBarHome.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// empty placeholder declaration for the `menuBar/home` menu
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.contribMergeEditorMenus.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.contribMergeEditorMenus.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// empty placeholder declaration for `mergeEditor/*` menus
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.contribMultiDiffEditorMenus.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.contribMultiDiffEditorMenus.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// empty placeholder declaration for `multiDiffEditor/*` menus
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.contribNotebookStaticPreloads.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.contribNotebookStaticPreloads.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// empty placeholder declaration for the `notebookPreload` contribution point
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.contribRemoteHelp.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.contribRemoteHelp.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// empty placeholder declaration for the `remoteHelp`-contribution point
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.contribShareMenu.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.contribShareMenu.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// empty placeholder declaration for the `file/share`-submenu contribution point
// https://github.com/microsoft/vscode/issues/176316
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.contribSourceControlArtifactGroupMenu.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.contribSourceControlArtifactGroupMenu.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// empty placeholder declaration for the `scm/artifactGroup/context`-menu contribution point
// https://github.com/microsoft/vscode/issues/253665
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.contribSourceControlArtifactMenu.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.contribSourceControlArtifactMenu.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// empty placeholder declaration for the `scm/artifact/context`-menu contribution point
// https://github.com/microsoft/vscode/issues/253665
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.contribSourceControlHistoryItemMenu.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.contribSourceControlHistoryItemMenu.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// empty placeholder declaration for the `scm/historyItem/context`-menu contribution point
// https://github.com/microsoft/vscode/issues/201997
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.contribSourceControlHistoryTitleMenu.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.contribSourceControlHistoryTitleMenu.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// empty placeholder declaration for the `scm/history/title`-menu contribution point
// https://github.com/microsoft/vscode/issues/226144
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.contribSourceControlInputBoxMenu.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.contribSourceControlInputBoxMenu.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// empty placeholder declaration for the `scm/inputBox`-menu contribution point
// https://github.com/microsoft/vscode/issues/195474
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.contribSourceControlTitleMenu.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.contribSourceControlTitleMenu.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// empty placeholder declaration for the `scm/sourceControl/title`-menu contribution point
// https://github.com/microsoft/vscode/issues/203511
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.contribStatusBarItems.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.contribStatusBarItems.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// empty placeholder for status bar items contribution

// https://github.com/microsoft/vscode/issues/167874 @jrieken
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.contribViewContainerTitle.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.contribViewContainerTitle.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// empty placeholder for view container title menus

// https://github.com/microsoft/vscode/issues/200880 @roblourens
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.contribViewsRemote.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.contribViewsRemote.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// empty placeholder declaration for the `remote`-property of the `views`-contribution
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.contribViewsWelcome.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.contribViewsWelcome.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// empty placeholder declaration for the `viewsWelcome`-contribution point
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.customEditorMove.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.customEditorMove.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/86146

	// TODO: Also for custom editor

	export interface CustomTextEditorProvider {

		/**
		 * Handle when the underlying resource for a custom editor is renamed.
		 *
		 * This allows the webview for the editor be preserved throughout the rename. If this method is not implemented,
		 * the editor will destroy the previous custom editor and create a replacement one.
		 *
		 * @param newDocument New text document to use for the custom editor.
		 * @param existingWebviewPanel Webview panel for the custom editor.
		 * @param token A cancellation token that indicates the result is no longer needed.
		 *
		 * @return Thenable indicating that the webview editor has been moved.
		 */
		// eslint-disable-next-line local/vscode-dts-provider-naming
		moveCustomTextEditor?(newDocument: TextDocument, existingWebviewPanel: WebviewPanel, token: CancellationToken): Thenable<void>;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.dataChannels.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.dataChannels.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	export namespace env {
		export function getDataChannel<T>(channelId: string): DataChannel<T>;
	}

	export interface DataChannel<T = unknown> {
		readonly onDidReceiveData: Event<DataChannelEvent<T>>;
	}

	export interface DataChannelEvent<T> {
		data: T;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.debugVisualization.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.debugVisualization.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


declare module 'vscode' {
	export namespace debug {
		/**
		 * Registers a custom data visualization for variables when debugging.
		 *
		 * @param id The corresponding ID in the package.json `debugVisualizers` contribution point.
		 * @param provider The {@link DebugVisualizationProvider} to register
		 */
		export function registerDebugVisualizationProvider<T extends DebugVisualization>(
			id: string,
			provider: DebugVisualizationProvider<T>
		): Disposable;

		/**
		 * Registers a tree that can be referenced by {@link DebugVisualization.visualization}.
		 * @param id
		 * @param provider
		 */
		export function registerDebugVisualizationTreeProvider<T extends DebugTreeItem>(
			id: string,
			provider: DebugVisualizationTree<T>
		): Disposable;
	}

	/**
	 * An item from the {@link DebugVisualizationTree}
	 */
	export interface DebugTreeItem {
		/**
		 * A human-readable string describing this item.
		 */
		label: string;

		/**
		 * A human-readable string which is rendered less prominent.
		 */
		description?: string;

		/**
		 * {@link TreeItemCollapsibleState} of the tree item.
		 */
		collapsibleState?: TreeItemCollapsibleState;

		/**
		 * Context value of the tree item. This can be used to contribute item specific actions in the tree.
		 * For example, a tree item is given a context value as `folder`. When contributing actions to `view/item/context`
		 * using `menus` extension point, you can specify context value for key `viewItem` in `when` expression like `viewItem == folder`.
		 * ```json
		 * "contributes": {
		 *   "menus": {
		 *     "view/item/context": [
		 *       {
		 *         "command": "extension.deleteFolder",
		 *         "when": "viewItem == folder"
		 *       }
		 *     ]
		 *   }
		 * }
		 * ```
		 * This will show action `extension.deleteFolder` only for items with `contextValue` is `folder`.
		 */
		contextValue?: string;

		/**
		 * Whether this item can be edited by the user.
		 */
		canEdit?: boolean;
	}

	/**
	 * Provides a tree that can be referenced in debug visualizations.
	 */
	export interface DebugVisualizationTree<T extends DebugTreeItem = DebugTreeItem> {
		/**
		 * Gets the tree item for an element or the base context item.
		 */
		getTreeItem(context: DebugVisualizationContext): ProviderResult<T>;
		/**
		 * Gets children for the tree item or the best context item.
		 */
		getChildren(element: T): ProviderResult<T[]>;
		/**
		 * Handles the user editing an item.
		 */
		editItem?(item: T, value: string): ProviderResult<T>;
	}

	export class DebugVisualization {
		/**
		 * The name of the visualization to show to the user.
		 */
		name: string;

		/**
		 * An icon for the view when it's show in inline actions.
		 */
		iconPath?: Uri | { light: Uri; dark: Uri } | ThemeIcon;

		/**
		 * Visualization to use for the variable. This may be either:
		 * - A command to run when the visualization is selected for a variable.
		 * - A reference to a previously-registered {@link DebugVisualizationTree}
		 */
		visualization?: Command | { treeId: string };

		/**
		 * Creates a new debug visualization object.
		 * @param name Name of the visualization to show to the user.
		 */
		constructor(name: string);
	}

	export interface DebugVisualizationProvider<T extends DebugVisualization = DebugVisualization> {
		/**
		 * Called for each variable when the debug session stops. It should return
		 * any visualizations the extension wishes to show to the user.
		 *
		 * Note that this is only called when its `when` clause defined under the
		 * `debugVisualizers` contribution point in the `package.json` evaluates
		 * to true.
		 */
		provideDebugVisualization(context: DebugVisualizationContext, token: CancellationToken): ProviderResult<T[]>;

		/**
		 * Invoked for a variable when a user picks the visualizer.
		 *
		 * It may return a {@link TreeView} that's shown in the Debug Console or
		 * inline in a hover. A visualizer may choose to return `undefined` from
		 * this function and instead trigger other actions in the UI, such as opening
		 * a custom {@link WebviewView}.
		 */
		resolveDebugVisualization?(visualization: T, token: CancellationToken): ProviderResult<T>;
	}

	export interface DebugVisualizationContext {
		/**
		 * The Debug Adapter Protocol Variable to be visualized.
		 * @see https://microsoft.github.io/debug-adapter-protocol/specification#Types_Variable
		 */
		variable: any;
		/**
		 * The Debug Adapter Protocol variable reference the type (such as a scope
		 * or another variable) that contained this one. Empty for variables
		 * that came from user evaluations in the Debug Console.
		 * @see https://microsoft.github.io/debug-adapter-protocol/specification#Types_Variable
		 */
		containerId?: number;
		/**
		 * The ID of the Debug Adapter Protocol StackFrame in which the variable was found,
		 * for variables that came from scopes in a stack frame.
		 * @see https://microsoft.github.io/debug-adapter-protocol/specification#Types_StackFrame
		 */
		frameId?: number;
		/**
		 * The ID of the Debug Adapter Protocol Thread in which the variable was found.
		 * @see https://microsoft.github.io/debug-adapter-protocol/specification#Types_StackFrame
		 */
		threadId: number;
		/**
		 * The debug session the variable belongs to.
		 */
		session: DebugSession;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.defaultChatParticipant.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.defaultChatParticipant.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// version: 4

declare module 'vscode' {

	export interface ChatWelcomeMessageContent {
		icon: ThemeIcon;
		title: string;
		message: MarkdownString;
	}

	export interface ChatTitleProvider {
		/**
		 * TODO@API Should this take a ChatResult like the followup provider, or just take a new ChatContext that includes the current message as history?
		 */
		provideChatTitle(context: ChatContext, token: CancellationToken): ProviderResult<string>;
	}

	export interface ChatSummarizer {
		provideChatSummary(context: ChatContext, token: CancellationToken): ProviderResult<string>;
	}

	export interface ChatParticipant {
		/**
		 * A string that will be added before the listing of chat participants in `/help`.
		 */
		helpTextPrefix?: string | MarkdownString;

		/**
		 * A string that will be appended after the listing of chat participants in `/help`.
		 */
		helpTextPostfix?: string | MarkdownString;

		additionalWelcomeMessage?: string | MarkdownString;
		titleProvider?: ChatTitleProvider;
		summarizer?: ChatSummarizer;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.devDeviceId.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.devDeviceId.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	export namespace env {

		/**
		 * An alternative unique identifier for the computer.
		 */
		export const devDeviceId: string;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.diffCommand.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.diffCommand.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/84899

	/**
	 * The contiguous set of modified lines in a diff.
	 */
	export interface LineChange {
		readonly originalStartLineNumber: number;
		readonly originalEndLineNumber: number;
		readonly modifiedStartLineNumber: number;
		readonly modifiedEndLineNumber: number;
	}

	export namespace commands {

		/**
		 * Registers a diff information command that can be invoked via a keyboard shortcut,
		 * a menu item, an action, or directly.
		 *
		 * Diff information commands are different from ordinary {@link commands.registerCommand commands} as
		 * they only execute when there is an active diff editor when the command is called, and the diff
		 * information has been computed. Also, the command handler of an editor command has access to
		 * the diff information.
		 *
		 * @param command A unique identifier for the command.
		 * @param callback A command handler function with access to the {@link LineChange diff information}.
		 * @param thisArg The `this` context used when invoking the handler function.
		 * @return Disposable which unregisters this command on disposal.
		 */
		export function registerDiffInformationCommand(command: string, callback: (diff: LineChange[], ...args: any[]) => any, thisArg?: any): Disposable;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.diffContentOptions.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.diffContentOptions.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {
	// TODO@rebornix: add github issue link

	export interface NotebookDocumentContentOptions {
		/**
		 * Controls if a cell metadata property should be reverted when the cell content
		 * is reverted in notebook diff editor.
		 */
		cellContentMetadata?: { [key: string]: boolean | undefined };
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.documentFiltersExclusive.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.documentFiltersExclusive.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// todo@jrieken add issue reference

	export interface DocumentFilter {
		readonly exclusive?: boolean;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.editorHoverVerbosityLevel.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.editorHoverVerbosityLevel.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	/**
	 * A hover represents additional information for a symbol or word. Hovers are
	 * rendered in a tooltip-like widget.
	 */
	export class VerboseHover extends Hover {

		/**
		 * Can increase the verbosity of the hover
		 */
		canIncreaseVerbosity?: boolean;

		/**
		 * Can decrease the verbosity of the hover
		 */
		canDecreaseVerbosity?: boolean;

		/**
		 * Creates a new hover object.
		 *
		 * @param contents The contents of the hover.
		 * @param range The range to which the hover applies.
		 */
		constructor(contents: MarkdownString | MarkedString | Array<MarkdownString | MarkedString>, range?: Range, canIncreaseVerbosity?: boolean, canDecreaseVerbosity?: boolean);
	}

	export interface HoverContext {

		/**
		 * The delta by which to increase/decrease the hover verbosity level
		 */
		readonly verbosityDelta?: number;

		/**
		 * The previous hover sent for the same position
		 */
		readonly previousHover?: Hover;
	}

	export enum HoverVerbosityAction {
		/**
		 * Increase the hover verbosity
		 */
		Increase = 0,
		/**
		 * Decrease the hover verbosity
		 */
		Decrease = 1
	}

	/**
	 * The hover provider class
	 */
	export interface HoverProvider {

		/**
		 * Provide a hover for the given position and document. Multiple hovers at the same
		 * position will be merged by the editor. A hover can have a range which defaults
		 * to the word range at the position when omitted.
		 *
		 * @param document The document in which the command was invoked.
		 * @param position The position at which the command was invoked.
		 * @param token A cancellation token.
		 * @oaram context A hover context.
		 * @returns A hover or a thenable that resolves to such. The lack of a result can be
		 * signaled by returning `undefined` or `null`.
		 */
		provideHover(document: TextDocument, position: Position, token: CancellationToken, context?: HoverContext): ProviderResult<VerboseHover>;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.editorInsets.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.editorInsets.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// https://github.com/microsoft/vscode/issues/85682

declare module 'vscode' {

	export interface WebviewEditorInset {
		readonly editor: TextEditor;
		readonly line: number;
		readonly height: number;
		readonly webview: Webview;
		readonly onDidDispose: Event<void>;
		dispose(): void;
	}

	export namespace window {
		export function createWebviewTextEditorInset(editor: TextEditor, line: number, height: number, options?: WebviewOptions): WebviewEditorInset;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.editSessionIdentityProvider.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.editSessionIdentityProvider.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/157734

	export namespace workspace {
		/**
		 * An event that is emitted when an edit session identity is about to be requested.
		 */
		export const onWillCreateEditSessionIdentity: Event<EditSessionIdentityWillCreateEvent>;

		/**
		 *
		 * @param scheme The URI scheme that this provider can provide edit session identities for.
		 * @param provider A provider which can convert URIs for workspace folders of scheme @param scheme to
		 * an edit session identifier which is stable across machines. This enables edit sessions to be resolved.
		 */
		export function registerEditSessionIdentityProvider(scheme: string, provider: EditSessionIdentityProvider): Disposable;
	}

	export interface EditSessionIdentityProvider {
		/**
		 *
		 * @param workspaceFolder The workspace folder to provide an edit session identity for.
		 * @param token A cancellation token for the request.
		 * @returns A string representing the edit session identity for the requested workspace folder.
		 */
		provideEditSessionIdentity(workspaceFolder: WorkspaceFolder, token: CancellationToken): ProviderResult<string>;

		/**
		 *
		 * @param identity1 An edit session identity.
		 * @param identity2 A second edit session identity to compare to @param identity1.
		 * @param token A cancellation token for the request.
		 * @returns An {@link EditSessionIdentityMatch} representing the edit session identity match confidence for the provided identities.
		 */
		provideEditSessionIdentityMatch(identity1: string, identity2: string, token: CancellationToken): ProviderResult<EditSessionIdentityMatch>;
	}

	export enum EditSessionIdentityMatch {
		Complete = 100,
		Partial = 50,
		None = 0
	}

	export interface EditSessionIdentityWillCreateEvent {

		/**
		 * A cancellation token.
		 */
		readonly token: CancellationToken;

		/**
		 * The workspace folder to create an edit session identity for.
		 */
		readonly workspaceFolder: WorkspaceFolder;

		/**
		 * Allows to pause the event until the provided thenable resolves.
		 *
		 * *Note:* This function can only be called during event dispatch.
		 *
		 * @param thenable A thenable that delays saving.
		 */
		waitUntil(thenable: Thenable<any>): void;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.embeddings.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.embeddings.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/212083

	export interface Embedding {
		readonly values: number[];
	}

	// TODO@API strictly not the right namespace...
	export namespace lm {

		export const embeddingModels: string[];

		export const onDidChangeEmbeddingModels: Event<void>;

		export function computeEmbeddings(embeddingsModel: string, input: string, token?: CancellationToken): Thenable<Embedding>;

		export function computeEmbeddings(embeddingsModel: string, input: string[], token?: CancellationToken): Thenable<Embedding[]>;
	}

	export interface EmbeddingsProvider {
		provideEmbeddings(input: string[], token: CancellationToken): ProviderResult<Embedding[]>;
	}

	export namespace lm {
		export function registerEmbeddingsProvider(embeddingsModel: string, provider: EmbeddingsProvider): Disposable;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.extensionRuntime.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.extensionRuntime.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/104436

	export enum ExtensionRuntime {
		/**
		 * The extension is running in a NodeJS extension host. Runtime access to NodeJS APIs is available.
		 */
		Node = 1,
		/**
		 * The extension is running in a Webworker extension host. Runtime access is limited to Webworker APIs.
		 */
		Webworker = 2
	}

	export interface ExtensionContext {
		readonly extensionRuntime: ExtensionRuntime;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.extensionsAny.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.extensionsAny.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/145307 @alexdima

	export interface Extension<T> {

		/**
		 * `true` when the extension is associated to another extension host.
		 *
		 * *Note* that an extension from another extension host cannot export
		 * API, e.g {@link Extension.exports its exports} are always `undefined`.
		 */
		readonly isFromDifferentExtensionHost: boolean;
	}

	export namespace extensions {

		/**
		 * Get an extension by its full identifier in the form of: `publisher.name`.
		 *
		 * @param extensionId An extension identifier.
		 * @param includeDifferentExtensionHosts Include extensions from different extension host
		 * @return An extension or `undefined`.
		 */
		export function getExtension<T = any>(extensionId: string, includeDifferentExtensionHosts: boolean): Extension<T> | undefined;
		export function getExtension<T = any>(extensionId: string, includeDifferentExtensionHosts: true): Extension<T | undefined> | undefined;

		/**
		 * All extensions across all extension hosts.
		 *
		 * @see {@link Extension.isFromDifferentExtensionHost}
		 */
		export const allAcrossExtensionHosts: readonly Extension<void>[];

	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.externalUriOpener.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.externalUriOpener.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/109277

	/**
	 * Details if an `ExternalUriOpener` can open a uri.
	 *
	 * The priority is also used to rank multiple openers against each other and determine
	 * if an opener should be selected automatically or if the user should be prompted to
	 * select an opener.
	 *
	 * The editor will try to use the best available opener, as sorted by `ExternalUriOpenerPriority`.
	 * If there are multiple potential "best" openers for a URI, then the user will be prompted
	 * to select an opener.
	 */
	export enum ExternalUriOpenerPriority {
		/**
		 * The opener is disabled and will never be shown to users.
		 *
		 * Note that the opener can still be used if the user specifically
		 * configures it in their settings.
		 */
		None = 0,

		/**
		 * The opener can open the uri but will not cause a prompt on its own
		 * since the editor always contributes a built-in `Default` opener.
		 */
		Option = 1,

		/**
		 * The opener can open the uri.
		 *
		 * The editor's built-in opener has `Default` priority. This means that any additional `Default`
		 * openers will cause the user to be prompted to select from a list of all potential openers.
		 */
		Default = 2,

		/**
		 * The opener can open the uri and should be automatically selected over any
		 * default openers, include the built-in one from the editor.
		 *
		 * A preferred opener will be automatically selected if no other preferred openers
		 * are available. If multiple preferred openers are available, then the user
		 * is shown a prompt with all potential openers (not just preferred openers).
		 */
		Preferred = 3,
	}

	/**
	 * Handles opening uris to external resources, such as http(s) links.
	 *
	 * Extensions can implement an `ExternalUriOpener` to open `http` links to a webserver
	 * inside of the editor instead of having the link be opened by the web browser.
	 *
	 * Currently openers may only be registered for `http` and `https` uris.
	 */
	export interface ExternalUriOpener {

		/**
		 * Check if the opener can open a uri.
		 *
		 * @param uri The uri being opened. This is the uri that the user clicked on. It has
		 * not yet gone through port forwarding.
		 * @param token Cancellation token indicating that the result is no longer needed.
		 *
		 * @return Priority indicating if the opener can open the external uri.
		 */
		canOpenExternalUri(uri: Uri, token: CancellationToken): ExternalUriOpenerPriority | Thenable<ExternalUriOpenerPriority>;

		/**
		 * Open a uri.
		 *
		 * This is invoked when:
		 *
		 * - The user clicks a link which does not have an assigned opener. In this case, first `canOpenExternalUri`
		 *   is called and if the user selects this opener, then `openExternalUri` is called.
		 * - The user sets the default opener for a link in their settings and then visits a link.
		 *
		 * @param resolvedUri The uri to open. This uri may have been transformed by port forwarding, so it
		 * may not match the original uri passed to `canOpenExternalUri`. Use `ctx.originalUri` to check the
		 * original uri.
		 * @param ctx Additional information about the uri being opened.
		 * @param token Cancellation token indicating that opening has been canceled.
		 *
		 * @return Thenable indicating that the opening has completed.
		 */
		openExternalUri(resolvedUri: Uri, ctx: OpenExternalUriContext, token: CancellationToken): Thenable<void> | void;
	}

	/**
	 * Additional information about the uri being opened.
	 */
	export interface OpenExternalUriContext {
		/**
		 * The uri that triggered the open.
		 *
		 * This is the original uri that the user clicked on or that was passed to `openExternal.`
		 * Due to port forwarding, this may not match the `resolvedUri` passed to `openExternalUri`.
		 */
		readonly sourceUri: Uri;
	}

	/**
	 * Additional metadata about a registered `ExternalUriOpener`.
	 */
	export interface ExternalUriOpenerMetadata {

		/**
		 * List of uri schemes the opener is triggered for.
		 *
		 * Currently only `http` and `https` are supported.
		 */
		readonly schemes: readonly string[];

		/**
		 * Text displayed to the user that explains what the opener does.
		 *
		 * For example, 'Open in browser preview'
		 */
		readonly label: string;
	}

	namespace window {
		/**
		 * Register a new `ExternalUriOpener`.
		 *
		 * When a uri is about to be opened, an `onOpenExternalUri:SCHEME` activation event is fired.
		 *
		 * @param id Unique id of the opener, such as `myExtension.browserPreview`. This is used in settings
		 *   and commands to identify the opener.
		 * @param opener Opener to register.
		 * @param metadata Additional information about the opener.
		 *
		* @returns Disposable that unregisters the opener.
		*/
		export function registerExternalUriOpener(id: string, opener: ExternalUriOpener, metadata: ExternalUriOpenerMetadata): Disposable;
	}

	export interface OpenExternalOptions {
		/**
		 * Allows using openers contributed by extensions through  `registerExternalUriOpener`
		 * when opening the resource.
		 *
		 * If `true`, the editor will check if any contributed openers can handle the
		 * uri, and fallback to the default opener behavior.
		 *
		 * If it is string, this specifies the id of the `ExternalUriOpener`
		 * that should be used if it is available. Use `'default'` to force the editor's
		 * standard external opener to be used.
		 */
		readonly allowContributedOpeners?: boolean | string;
	}

	namespace env {
		export function openExternal(target: Uri, options?: OpenExternalOptions): Thenable<boolean>;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.fileSearchProvider.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.fileSearchProvider.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/73524

	/**
	 * The parameters of a query for file search.
	 */
	export interface FileSearchQuery {
		/**
		 * The search pattern to match against file paths.
		 * To be correctly interpreted by Quick Open, this is interpreted in a relaxed way. The picker will apply its own highlighting and scoring on the results.
		 *
		 * Tips for matching in Quick Open:
		 * With the pattern, the picker will use the file name and file paths to score each entry. The score will determine the ordering and filtering.
		 * The scoring prioritizes prefix and substring matching. Then, it checks and it checks whether the pattern's letters appear in the same order as in the target (file name and path).
		 * If a file does not match at all using our criteria, it will be omitted from Quick Open.
		 */
		pattern: string;
	}

	/**
	 * Options that apply to file search.
	 */
	export interface FileSearchOptions extends SearchOptions {
		/**
		 * The maximum number of results to be returned.
		 */
		maxResults?: number;

		/**
		 * A CancellationToken that represents the session for this search query. If the provider chooses to, this object can be used as the key for a cache,
		 * and searches with the same session object can search the same cache. When the token is cancelled, the session is complete and the cache can be cleared.
		 */
		session?: CancellationToken;
	}

	/**
	 * A FileSearchProvider provides search results for files in the given folder that match a query string. It can be invoked by quickopen or other extensions.
	 *
	 * A FileSearchProvider is the more powerful of two ways to implement file search in the editor. Use a FileSearchProvider if you wish to search within a folder for
	 * all files that match the user's query.
	 *
	 * The FileSearchProvider will be invoked on every keypress in quickopen. When `workspace.findFiles` is called, it will be invoked with an empty query string,
	 * and in that case, every file in the folder should be returned.
	 */
	export interface FileSearchProvider {
		/**
		 * Provide the set of files that match a certain file path pattern.
		 * @param query The parameters for this query.
		 * @param options A set of options to consider while searching files.
		 * @param token A cancellation token.
		 */
		provideFileSearchResults(query: FileSearchQuery, options: FileSearchOptions, token: CancellationToken): ProviderResult<Uri[]>;
	}

	export namespace workspace {
		/**
		 * Register a search provider.
		 *
		 * Only one provider can be registered per scheme.
		 *
		 * @param scheme The provider will be invoked for workspace folders that have this file scheme.
		 * @param provider The provider.
		 * @return A {@link Disposable} that unregisters this provider when being disposed.
		 */
		export function registerFileSearchProvider(scheme: string, provider: FileSearchProvider): Disposable;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.fileSearchProvider2.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.fileSearchProvider2.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/73524

	/**
	 * Options that apply to file search.
	 */
	export interface FileSearchProviderOptions {
		folderOptions: {
			/**
			 * The root folder to search within.
			 */
			folder: Uri;

			/**
			 * Files that match an `includes` glob pattern should be included in the search.
			 */
			includes: string[];

			/**
			 * Files that match an `excludes` glob pattern should be excluded from the search.
			 */
			excludes: GlobPattern[];

			/**
			 * Whether symlinks should be followed while searching.
			 * For more info, see the setting description for `search.followSymlinks`.
			 */
			followSymlinks: boolean;

			/**
			 * Which file locations we should look for ignore (.gitignore or .ignore) files to respect.
			 */
			useIgnoreFiles: {
				/**
				 * Use ignore files at the current workspace root.
				 */
				local: boolean;
				/**
				 * Use ignore files at the parent directory. If set, `local` in {@link FileSearchProviderOptions.useIgnoreFiles} should also be `true`.
				 */
				parent: boolean;
				/**
				 * Use global ignore files. If set, `local` in {@link FileSearchProviderOptions.useIgnoreFiles} should also be `true`.
				 */
				global: boolean;
			};
		}[];

		/**
		 * An object with a lifespan that matches the session's lifespan. If the provider chooses to, this object can be used as the key for a cache,
		 * and searches with the same session object can search the same cache. When the object is garbage-collected, the session is complete and the cache can be cleared.
		 * Please do not store any references to the session object, except via a weak reference (e.g. `WeakRef` or `WeakMap`).
		 */
		session: object;

		/**
		 * The maximum number of results to be returned.
		 */
		maxResults: number;
	}

	/**
	 * A FileSearchProvider provides search results for files in the given folder that match a query string. It can be invoked by quickopen or other extensions.
	 *
	 * A FileSearchProvider is the more powerful of two ways to implement file search in the editor. Use a FileSearchProvider if you wish to search within a folder for
	 * all files that match the user's query.
	 *
	 * The FileSearchProvider will be invoked on every keypress in quickopen.
	 */
	export interface FileSearchProvider2 {
		/**
		 * Provide the set of files that match a certain file path pattern.
		 *
		 * @param pattern The search pattern to match against file paths. The `pattern` should be interpreted in a
		 * *relaxed way* as the editor will apply its own highlighting and scoring on the results. A good rule of
		 * thumb is to match case-insensitive and to simply check that the characters of `pattern` appear in their
		 * order in a candidate file path. Don't use prefix, substring, or similar strict matching. When `pattern`
		 * is empty, all files in the folder should be returned.
		 * @param options A set of options to consider while searching files.
		 * @param token A cancellation token.
		 */
		provideFileSearchResults(pattern: string, options: FileSearchProviderOptions, token: CancellationToken): ProviderResult<Uri[]>;
	}

	export namespace workspace {
		/**
		 *
		 * Register a search provider.
		 *
		 * Only one provider can be registered per scheme.
		 *
		 * @param scheme The provider will be invoked for workspace folders that have this file scheme.
		 * @param provider The provider.
		 * @return A {@link Disposable} that unregisters this provider when being disposed.
		 */
		export function registerFileSearchProvider2(scheme: string, provider: FileSearchProvider2): Disposable;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.findFiles2.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.findFiles2.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// version: 2

declare module 'vscode' {

	export interface FindFiles2Options {
		/**
		 * An array of {@link GlobPattern} that defines files to exclude.
		 * The glob patterns will be matched against the file paths of files relative to their workspace or {@link RelativePattern}'s `baseUri` if applicable.
		 *
		 * If more than one value is used, the values are combined with a logical AND.
		 * For example, consider the following code:
		 *
		 * ```ts
		 * const ab = findFiles(['**​/*.js'], {exclude: ['*.ts', '*.js']});
		 * const a = findFiles(['**​/*.js'], {exclude: ['*.ts']});
		 * const b = findFiles(['**​/*.js'], {exclude: ['*.js']});
		 * ```
		 *
		 * In this, `ab` will be the intersection of results from `a` and `b`.
		 */
		exclude?: GlobPattern[];

		/**
		 * Which settings to follow when searching for files. Defaults to `ExcludeSettingOptions.searchAndFilesExclude`.
		 */
		useExcludeSettings?: ExcludeSettingOptions;

		/**
		 * The maximum number of results to search for. Defaults to 20000 results.
		 */
		maxResults?: number;

		/**
		 * Which file locations have ignore (`.gitignore` or `.ignore`) files to follow.
		 *
		 * When any of these fields are `undefined`, the value will either be assumed (e.g. if only one is valid),
		 * or it will follow settings based on the corresponding `search.use*IgnoreFiles` setting.
		 *
		 * Will log an error if an invalid combination is set.
		 *
		 * Although `.ignore` files are uncommon, they can be leveraged if there are patterns
		 * that should not be known to git, but should be known to the search providers.
		 * They should be in the same locations where `.gitignore` files are found, and they follow the same format.
		 */
		useIgnoreFiles?: {
			/**
			 * Use ignore files at the current workspace root.
			 * May default to `search.useIgnoreFiles` setting if not set.
			 */
			local?: boolean;
			/**
			 * Use ignore files at the parent directory. When set to `true`, {@link FindFiles2Options.useIgnoreFiles.local} must also be `true`.
			 * May default to `search.useParentIgnoreFiles` setting if not set.
			 */
			parent?: boolean;
			/**
			 * Use global ignore files. When set to `true`, {@link FindFiles2Options.useIgnoreFiles.local} must also be `true`.
			 * May default to `search.useGlobalIgnoreFiles` setting if not set.
			 */
			global?: boolean;
		};

		/**
		 * Whether symlinks should be followed while searching.
		 * Defaults to the value for `search.followSymlinks` in settings.
		 * For more info, see the setting description for `search.followSymlinks`.
		 */
		followSymlinks?: boolean;
	}

	/**
	 * Options for following search.exclude and files.exclude settings.
	 */
	export enum ExcludeSettingOptions {
		/**
		 * Don't use any exclude settings.
		 */
		None = 1,
		/**
		 * Use the `files.exclude` setting
		 */
		FilesExclude = 2,
		/**
		 * Use the `files.exclude` and `search.exclude` settings
		 */
		SearchAndFilesExclude = 3
	}

	export namespace workspace {
		/**
		 * Find files across all {@link workspace.workspaceFolders workspace folders} in the workspace.
		 *
		 * @example
		 * findFiles(['**​/*.js'], {exclude: ['**​/out/**'], useIgnoreFiles: true, maxResults: 10})
		 *
		 * @param filePattern An array of {@link GlobPattern GlobPattern} that defines the files to search for.
		 * The glob patterns will be matched against the file paths of files relative to their workspace or {@link baseUri GlobPattern.baseUri} if applicable.
		 * Use a {@link RelativePattern RelativePatten} to restrict the search results to a {@link WorkspaceFolder workspace folder}.
		 *
		 * If more than one value is used, the values are combined with a logical OR.
		 *
		 * For example, consider the following code:
		 *
		 * ```ts
		 * const ab = findFiles(['*.ts', '*.js']);
		 * const a = findFiles(['**​/*.ts']);
		 * const b = findFiles(['**​/*.js']);
		 * ```
		 *
		 * In this, `ab` will be the union of results from `a` and `b`.
		 * @param options A set of {@link FindFiles2Options FindFiles2Options} that defines where and how to search (e.g. exclude settings).
		 * @param token A token that can be used to signal cancellation to the underlying search engine.
		 * @returns A thenable that resolves to an array of resource identifiers. Will return no results if no
		 * {@link workspace.workspaceFolders workspace folders} are opened.
		 */
		export function findFiles2(filePattern: GlobPattern[], options?: FindFiles2Options, token?: CancellationToken): Thenable<Uri[]>;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.findTextInFiles.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.findTextInFiles.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/59924

	/**
	 * Options that can be set on a findTextInFiles search.
	 */
	export interface FindTextInFilesOptions {
		/**
		 * A {@link GlobPattern glob pattern} that defines the files to search for. The glob pattern
		 * will be matched against the file paths of files relative to their workspace. Use a {@link RelativePattern relative pattern}
		 * to restrict the search results to a {@link WorkspaceFolder workspace folder}.
		 */
		include?: GlobPattern;

		/**
		 * A {@link GlobPattern glob pattern} that defines files and folders to exclude. The glob pattern
		 * will be matched against the file paths of resulting matches relative to their workspace. When `undefined`, default excludes will
		 * apply.
		 */
		exclude?: GlobPattern;

		/**
		 * Whether to use the default and user-configured excludes. Defaults to true.
		 */
		useDefaultExcludes?: boolean;

		/**
		 * The maximum number of results to search for
		 */
		maxResults?: number;

		/**
		 * Whether external files that exclude files, like .gitignore, should be respected.
		 * See the vscode setting `"search.useIgnoreFiles"`.
		 */
		useIgnoreFiles?: boolean;

		/**
		 * Whether global files that exclude files, like .gitignore, should be respected.
		 * See the vscode setting `"search.useGlobalIgnoreFiles"`.
		 */
		useGlobalIgnoreFiles?: boolean;

		/**
		 * Whether files in parent directories that exclude files, like .gitignore, should be respected.
		 * See the vscode setting `"search.useParentIgnoreFiles"`.
		 */
		useParentIgnoreFiles?: boolean;

		/**
		 * Whether symlinks should be followed while searching.
		 * See the vscode setting `"search.followSymlinks"`.
		 */
		followSymlinks?: boolean;

		/**
		 * Interpret files using this encoding.
		 * See the vscode setting `"files.encoding"`
		 */
		encoding?: string;

		/**
		 * Options to specify the size of the result text preview.
		 */
		previewOptions?: TextSearchPreviewOptions;

		/**
		 * Number of lines of context to include before each match.
		 */
		beforeContext?: number;

		/**
		 * Number of lines of context to include after each match.
		 */
		afterContext?: number;
	}

	export namespace workspace {
		/**
		 * Search text in files across all {@link workspace.workspaceFolders workspace folders} in the workspace.
		 * @param query The query parameters for the search - the search string, whether it's case-sensitive, or a regex, or matches whole words.
		 * @param callback A callback, called for each result
		 * @param token A token that can be used to signal cancellation to the underlying search engine.
		 * @return A thenable that resolves when the search is complete.
		 */
		export function findTextInFiles(query: TextSearchQuery, callback: (result: TextSearchResult) => void, token?: CancellationToken): Thenable<TextSearchComplete>;

		/**
		 * Search text in files across all {@link workspace.workspaceFolders workspace folders} in the workspace.
		 * @param query The query parameters for the search - the search string, whether it's case-sensitive, or a regex, or matches whole words.
		 * @param options An optional set of query options. Include and exclude patterns, maxResults, etc.
		 * @param callback A callback, called for each result
		 * @param token A token that can be used to signal cancellation to the underlying search engine.
		 * @return A thenable that resolves when the search is complete.
		 */
		export function findTextInFiles(query: TextSearchQuery, options: FindTextInFilesOptions, callback: (result: TextSearchResult) => void, token?: CancellationToken): Thenable<TextSearchComplete>;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.findTextInFiles2.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.findTextInFiles2.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/59924

	export interface FindTextInFilesOptions2 {
		/**
		 * An array of {@link GlobPattern} that defines the files to search for.
		 * The glob patterns will be matched against the file paths of files relative to their workspace or {@link GlobPattern}'s `baseUri` if applicable.
		 * Use a {@link RelativePattern} to restrict the search results to a {@link WorkspaceFolder workspace folder}.
		 *
		 * If more than one value is used, the values are combined with a logical OR.
		 *
		 * For example, consider the following code:
		 *
		 * ```ts
		 * const ab = findTextInFiles2('foo', {include: ['*.ts', '*.js']});
		 * const a = findTextInFiles2('foo', {include: ['*.ts']});
		 * const b = findTextInFiles2('foo', {include: ['*.js']});
		 * ```
		 *
		 * In this, `ab` will be the union of results from `a` and `b`.
		 */
		include?: GlobPattern[];

		/**
		 * An array of {@link GlobPattern} that defines files to exclude.
		 * The glob patterns will be matched against the file paths of files relative to their workspace or {@link RelativePattern}'s `baseUri` if applicable.
		 *
		 * If more than one value is used, the values are combined with a logical AND.
		 * For example, consider the following code:
		 *
		 * ```ts
		 * const ab = findTextInFiles2('foo', {exclude: ['*.ts', '*.js']});
		 * const a = findTextInFiles2('foo', {exclude: ['*.ts']});
		 * const b = findTextInFiles2('foo', {exclude: ['*.js']});
		 * ```
		 *
		 * In this, `ab` will be the intersection of results from `a` and `b`.
		 */
		exclude?: GlobPattern[];

		/**
		 * Which settings to follow when searching for files. Defaults to `ExcludeSettingOptions.searchAndFilesExclude`.
		 */
		useExcludeSettings?: ExcludeSettingOptions;

		/**
		 * The maximum number of results to search for. Defaults to 20000 results.
		 */
		maxResults?: number;

		/**
		 * Which file locations have ignore (`.gitignore` or `.ignore`) files to follow.
		 *
		 * When any of these fields are `undefined`, the value will either be assumed (e.g. if only one is valid),
		 * or it will follow settings based on the corresponding `search.use*IgnoreFiles` setting.
		 *
		 * Will log an error if an invalid combination is set.
		 *
		 * Although `.ignore` files are uncommon, they can be leveraged if there are patterns
		 * that should not be known to git, but should be known to the search providers.
		 * They should be in the same locations where `.gitignore` files are found, and they follow the same format.
		 */
		useIgnoreFiles?: {
			/**
			 * Use ignore files at the current workspace root.
			 * May default to `search.useIgnoreFiles` setting if not set.
			 */
			local?: boolean;
			/**
			 * Use ignore files at the parent directory. When set to `true`, `local` in {@link FindTextInFilesOptions2.useIgnoreFiles} must be `true`.
			 * May default to `search.useParentIgnoreFiles` setting if not set.
			 */
			parent?: boolean;
			/**
			 * Use global ignore files. When set to `true`, `local` in {@link FindTextInFilesOptions2.useIgnoreFiles} must also be `true`.
			 * May default to `search.useGlobalIgnoreFiles` setting if not set.
			 */
			global?: boolean;
		};

		/**
		 * Whether symlinks should be followed while searching.
		 * Defaults to the value for `search.followSymlinks` in settings.
		 * For more info, see the setting description for `search.followSymlinks`.
		 */
		followSymlinks?: boolean;

		/**
		 * Interpret files using this encoding.
		 * See the vscode setting `"files.encoding"`
		 */
		encoding?: string;

		/**
		 * Options to specify the size of the result text preview.
		 */
		previewOptions?: {
			/**
			 * The maximum number of lines in the preview of the match itself (not including surrounding context lines).
			 * Only search providers that support multiline search will ever return more than one line in the match.
			 */
			numMatchLines?: number;

			/**
			 * The maximum number of characters included per line.
			 */
			charsPerLine?: number;
		};

		/**
		 * Number of lines of context to include before and after each match.
		 */
		surroundingContext?: number;
	}

	export interface FindTextInFilesResponse {
		/**
		 * The results of the text search, in batches. To get completion information, wait on the `complete` property.
		 */
		results: AsyncIterable<TextSearchResult2>;
		/**
		 * The text search completion information. This resolves on completion.
		 */
		complete: Thenable<TextSearchComplete2>;
	}

	export namespace workspace {
		/**
		 * Search text in files across all {@link workspace.workspaceFolders workspace folders} in the workspace.
		 * @param query The query parameters for the search - the search string, whether it's case-sensitive, or a regex, or matches whole words.
		 * @param options An optional set of query options.
		 * @param callback A callback, called for each {@link TextSearchResult2 result}. This can be a direct match, or context that surrounds a match.
		 * @param token A token that can be used to signal cancellation to the underlying search engine.
		 * @return A thenable that resolves when the search is complete.
		 */
		export function findTextInFiles2(query: TextSearchQuery2, options?: FindTextInFilesOptions2, token?: CancellationToken): FindTextInFilesResponse;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.fsChunks.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.fsChunks.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/84515

	export interface FileSystemProvider {
		open?(resource: Uri, options: { create: boolean }): number | Thenable<number>;
		close?(fd: number): void | Thenable<void>;
		read?(fd: number, pos: number, data: Uint8Array, offset: number, length: number): number | Thenable<number>;
		write?(fd: number, pos: number, data: Uint8Array, offset: number, length: number): number | Thenable<number>;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.inlineCompletionsAdditions.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.inlineCompletionsAdditions.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/124024 @hediet

	export namespace languages {
		/**
		 * Registers an inline completion provider.
		 *
		 * Multiple providers can be registered for a language. In that case providers are asked in
		 * parallel and the results are merged. A failing provider (rejected promise or exception) will
		 * not cause a failure of the whole operation.
		 *
		 * @param selector A selector that defines the documents this provider is applicable to.
		 * @param provider An inline completion provider.
		 * @param metadata Metadata about the provider.
		 * @return A {@link Disposable} that unregisters this provider when being disposed.
		 */
		export function registerInlineCompletionItemProvider(selector: DocumentSelector, provider: InlineCompletionItemProvider, metadata: InlineCompletionItemProviderMetadata): Disposable;

		/**
		 * temporary: to be removed
		 */
		export const inlineCompletionsUnificationState: InlineCompletionsUnificationState;
		/**
		 * temporary: to be removed
		 */
		export const onDidChangeCompletionsUnificationState: Event<void>;
	}

	export interface InlineCompletionItem {
		// insertText: string | SnippetString | undefined;

		/** If set to `true`, this item is treated as inline edit. */
		isInlineEdit?: boolean;

		/**
		 * A range specifying when the edit can be shown based on the cursor position.
		 * If the cursor is within this range, the inline edit can be displayed.
		 */
		showRange?: Range;

		showInlineEditMenu?: boolean;

		/**
		 * If set, specifies where insertText, filterText, range, jumpToPosition apply to.
		*/
		uri?: Uri;

		// TODO: rename to gutterMenuLinkAction
		action?: Command;

		displayLocation?: InlineCompletionDisplayLocation;

		/** Used for telemetry. Can be an arbitrary string. */
		correlationId?: string;

		/**
		 * If set to `true`, unopened closing brackets are removed and unclosed opening brackets are closed.
		 * Defaults to `false`.
		*/
		completeBracketPairs?: boolean;

		warning?: InlineCompletionWarning;

		supportsRename?: boolean;

		jumpToPosition?: Position;
	}


	export interface InlineCompletionDisplayLocation {
		range: Range;
		kind: InlineCompletionDisplayLocationKind;
		label: string;
	}

	export enum InlineCompletionDisplayLocationKind {
		Code = 1,
		Label = 2
	}

	export interface InlineCompletionWarning {
		message: MarkdownString | string;
		icon?: ThemeIcon;
	}

	export interface InlineCompletionItemProviderMetadata {
		/**
		 * Specifies a list of extension ids that this provider yields to if they return a result.
		 * If some inline completion provider registered by such an extension returns a result, this provider is not asked.
		 */
		yieldTo?: string[];
		/**
		 * Can override the extension id for the yieldTo mechanism. Used for testing, so that yieldTo can be tested within one extension.
		*/
		groupId?: string;

		debounceDelayMs?: number;

		displayName?: string;

		excludes?: string[];
	}

	export interface InlineCompletionItemProvider {
		/**
		 * @param completionItem The completion item that was shown.
		 * @param updatedInsertText The actual insert text (after brackets were fixed).
		 */
		// eslint-disable-next-line local/vscode-dts-provider-naming
		handleDidShowCompletionItem?(completionItem: InlineCompletionItem, updatedInsertText: string): void;

		/**
		 * Is called when an inline completion item was accepted partially.
		 * @param info Additional info for the partial accepted trigger.
		 */
		// eslint-disable-next-line local/vscode-dts-provider-naming
		handleDidPartiallyAcceptCompletionItem?(completionItem: InlineCompletionItem, info: PartialAcceptInfo): void;

		/**
		 * Is called when an inline completion item is no longer being used.
		 * Provides a reason of why it is not used anymore.
		*/
		// eslint-disable-next-line local/vscode-dts-provider-naming
		handleEndOfLifetime?(completionItem: InlineCompletionItem, reason: InlineCompletionEndOfLifeReason): void;

		/**
		 * Is called when an inline completion list is no longer being used (same reference as the list returned by provideInlineEditsForRange).
		*/
		// eslint-disable-next-line local/vscode-dts-provider-naming
		handleListEndOfLifetime?(list: InlineCompletionList, reason: InlineCompletionsDisposeReason): void;

		readonly onDidChange?: Event<void>;

		readonly modelInfo?: InlineCompletionModelInfo;
		readonly onDidChangeModelInfo?: Event<void>;
		// eslint-disable-next-line local/vscode-dts-provider-naming
		setCurrentModelId?(modelId: string): Thenable<void>;


		// #region Deprecated methods

		/**
		 * Is called when an inline completion item was accepted partially.
		 * @param acceptedLength The length of the substring of the inline completion that was accepted already.
		 * @deprecated Use `handleDidPartiallyAcceptCompletionItem` with `PartialAcceptInfo` instead.
		 */
		// eslint-disable-next-line local/vscode-dts-provider-naming
		handleDidPartiallyAcceptCompletionItem?(completionItem: InlineCompletionItem, acceptedLength: number): void;

		/**
		 * @param completionItem The completion item that was rejected.
		 * @deprecated Use {@link handleEndOfLifetime} instead.
		*/
		// eslint-disable-next-line local/vscode-dts-provider-naming
		handleDidRejectCompletionItem?(completionItem: InlineCompletionItem): void;

		// #endregion
	}

	export interface InlineCompletionModelInfo {
		readonly models: InlineCompletionModel[];
		readonly currentModelId: string;
	}

	export interface InlineCompletionModel {
		readonly id: string;
		readonly name: string;
	}

	export enum InlineCompletionEndOfLifeReasonKind {
		Accepted = 0,
		Rejected = 1,
		Ignored = 2,
	}

	export type InlineCompletionEndOfLifeReason = {
		kind: InlineCompletionEndOfLifeReasonKind.Accepted; // User did an explicit action to accept
	} | {
		kind: InlineCompletionEndOfLifeReasonKind.Rejected; // User did an explicit action to reject
	} | {
		kind: InlineCompletionEndOfLifeReasonKind.Ignored;
		supersededBy?: InlineCompletionItem;
		userTypingDisagreed: boolean;
	};

	export enum InlineCompletionsDisposeReasonKind {
		Other = 0,
		Empty = 1,
		TokenCancellation = 2,
		LostRace = 3,
		NotTaken = 4,
	}

	export type InlineCompletionsDisposeReason = { kind: InlineCompletionsDisposeReasonKind };

	export interface InlineCompletionContext {
		readonly userPrompt?: string;

		readonly requestUuid: string;

		readonly requestIssuedDateTime: number;

		readonly earliestShownDateTime: number;
	}

	export interface PartialAcceptInfo {
		kind: PartialAcceptTriggerKind;
		/**
		 * The length of the substring of the provided inline completion text that was accepted already.
		*/
		acceptedLength: number;
	}

	export enum PartialAcceptTriggerKind {
		Unknown = 0,
		Word = 1,
		Line = 2,
		Suggest = 3,
	}

	// When finalizing `commands`, make sure to add a corresponding constructor parameter.
	export interface InlineCompletionList {
		/**
		 * A list of commands associated with the inline completions of this list.
		 */
		commands?: Array<Command | { command: Command; icon: ThemeIcon }>;

		/**
		 * When set and the user types a suggestion without deviating from it, the inline suggestion is not updated.
		 * Defaults to false (might change).
		 */
		enableForwardStability?: boolean;
	}

	/**
	 * temporary: to be removed
	 */
	export interface InlineCompletionsUnificationState {
		codeUnification: boolean;
		modelUnification: boolean;
		extensionUnification: boolean;
		expAssignments: string[];
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.interactive.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.interactive.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	export namespace interactive {
		export function transferActiveChat(toWorkspace: Uri): void;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.interactiveWindow.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.interactiveWindow.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {
	/**
	 * The tab represents an interactive window.
	 */
	export class TabInputInteractiveWindow {
		/**
		 * The uri of the history notebook in the interactive window.
		 */
		readonly uri: Uri;
		/**
		 * The uri of the input box in the interactive window.
		 */
		readonly inputBoxUri: Uri;
		private constructor(uri: Uri, inputBoxUri: Uri);
	}

	export interface Tab {
		readonly input: TabInputText | TabInputTextDiff | TabInputCustom | TabInputWebview | TabInputNotebook | TabInputNotebookDiff | TabInputTerminal | TabInputInteractiveWindow | unknown;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.ipc.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.ipc.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	/**
	 * A message passing protocol, which enables sending and receiving messages
	 * between two parties.
	 */
	export interface MessagePassingProtocol {

		/**
		 * Fired when a message is received from the other party.
		 */
		readonly onDidReceiveMessage: Event<any>;

		/**
		 * Post a message to the other party.
		 *
		 * @param message Body of the message. This must be a JSON serializable object.
		 * @param transfer A collection of `ArrayBuffer` instances which can be transferred
		 * to the other party, saving costly memory copy operations.
		 */
		postMessage(message: any, transfer?: ArrayBuffer[]): void;
	}

	export interface ExtensionContext {

		/**
		 * When not `undefined`, this is an instance of {@link MessagePassingProtocol} in
		 * which the other party is owned by the web embedder.
		 */
		readonly messagePassingProtocol: MessagePassingProtocol | undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.languageModelCapabilities.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.languageModelCapabilities.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// TODO - @lramos15 - Issue link

	export interface LanguageModelChat {
		/**
		 * The capabilities of the language model.
		 */
		readonly capabilities: {
			/**
			 * Whether the language model supports tool calling.
			 */
			readonly supportsToolCalling: boolean;
			/**
			 * Whether the language model supports image to text. This means it can take an image as input and produce a text response.
			 */
			readonly supportsImageToText: boolean;

			/**
			 * The tools the model prefers for making file edits. See {@link LanguageModelChatCapabilities.editTools}.
			 */
			readonly editToolsHint?: readonly string[];
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.languageModelProxy.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.languageModelProxy.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {
	export interface LanguageModelProxy extends Disposable {
		readonly uri: Uri;
		readonly key: string;
	}

	export namespace lm {
		/**
		 * Returns false if
		 * - Copilot Chat extension is not installed
		 * - Copilot Chat has not finished activating or finished auth
		 * - The user is not logged in, or isn't the right SKU, with expected model access
		 */
		export const isModelProxyAvailable: boolean;

		/**
		 * Fired when isModelProxyAvailable changes.
		 */
		export const onDidChangeModelProxyAvailability: Event<void>;

		/**
		 * Throws if the server fails to start for some reason, or something else goes wrong.
		 */
		export function getModelProxy(): Thenable<LanguageModelProxy>;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.languageModelSystem.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.languageModelSystem.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/206265

	// TODO@API don't have this dedicated type but as property, e.g anthropic doesn't have a system-role, see
	// https://github.com/anthropics/anthropic-sdk-typescript/blob/c2da9604646ff103fbdbca016a9a9d49b03b387b/src/resources/messages.ts#L384
	// So, we could have `LanguageModelChatRequestOptions#system` which would be more limiting but also more natural?

	export enum LanguageModelChatMessageRole {
		System = 3
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.languageModelThinkingPart.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.languageModelThinkingPart.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// version: 1

declare module 'vscode' {

	/**
	 * A language model response part containing thinking/reasoning content.
	 * Thinking tokens represent the model's internal reasoning process that
	 * typically streams before the final response.
	 */
	export class LanguageModelThinkingPart {
		/**
		 * The thinking/reasoning text content.
		 */
		value: string | string[];

		/**
		 * Optional unique identifier for this thinking sequence.
		 * This ID is typically provided at the end of the thinking stream
		 * and can be used for retrieval or reference purposes.
		 */
		id?: string;

		/**
		 * Optional metadata associated with this thinking sequence.
		 */
		metadata?: { readonly [key: string]: any };

		/**
		 * Construct a thinking part with the given content.
		 * @param value The thinking text content.
		 * @param id Optional unique identifier for this thinking sequence.
		 * @param metadata Optional metadata associated with this thinking sequence.
		 */
		constructor(value: string | string[], id?: string, metadata?: { readonly [key: string]: any });
	}

	export interface LanguageModelChatResponse {
		/**
		 * An async iterable that is a stream of text, thinking, and tool-call parts forming the overall response.
		 * This includes {@link LanguageModelThinkingPart} which represents the model's internal reasoning process.
		 */
		stream: AsyncIterable<LanguageModelTextPart | LanguageModelThinkingPart | LanguageModelToolCallPart | unknown>;
	}

	export interface LanguageModelChat {
		sendRequest(messages: Array<LanguageModelChatMessage | LanguageModelChatMessage2>, options?: LanguageModelChatRequestOptions, token?: CancellationToken): Thenable<LanguageModelChatResponse>;
		countTokens(text: string | LanguageModelChatMessage | LanguageModelChatMessage2, token?: CancellationToken): Thenable<number>;
	}

	/**
	 * Represents a message in a chat. Can assume different roles, like user or assistant.
	 */
	export class LanguageModelChatMessage2 {

		/**
		 * Utility to create a new user message.
		 *
		 * @param content The content of the message.
		 * @param name The optional name of a user for the message.
		 */
		static User(content: string | Array<LanguageModelTextPart | LanguageModelToolResultPart | LanguageModelDataPart>, name?: string): LanguageModelChatMessage2;

		/**
		 * Utility to create a new assistant message.
		 *
		 * @param content The content of the message.
		 * @param name The optional name of a user for the message.
		 */
		static Assistant(content: string | Array<LanguageModelTextPart | LanguageModelToolCallPart | LanguageModelDataPart>, name?: string): LanguageModelChatMessage2;

		/**
		 * The role of this message.
		 */
		role: LanguageModelChatMessageRole;

		/**
		 * A string or heterogeneous array of things that a message can contain as content. Some parts may be message-type
		 * specific for some models.
		 */
		content: Array<LanguageModelTextPart | LanguageModelToolResultPart | LanguageModelToolCallPart | LanguageModelDataPart | LanguageModelThinkingPart>;

		/**
		 * The optional name of a user for this message.
		 */
		name: string | undefined;

		/**
		 * Create a new user message.
		 *
		 * @param role The role of the message.
		 * @param content The content of the message.
		 * @param name The optional name of a user for the message.
		 */
		constructor(role: LanguageModelChatMessageRole, content: string | Array<LanguageModelTextPart | LanguageModelToolResultPart | LanguageModelToolCallPart | LanguageModelDataPart | LanguageModelThinkingPart>, name?: string);
	}

	/**
	 * Temporary alias for LanguageModelToolResultPart to avoid breaking changes in chat.
	 */
	export class LanguageModelToolResultPart2 extends LanguageModelToolResultPart { }

	/**
	 * Temporary alias for LanguageModelToolResult to avoid breaking changes in chat.
	 */
	export class LanguageModelToolResult2 extends LanguageModelToolResult { }
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.languageModelToolResultAudience.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.languageModelToolResultAudience.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	export enum LanguageModelPartAudience {
		/**
		 * The part should be shown to the language model.
		 */
		Assistant = 0,
		/**
		 * The part should be shown to the user.
		 */
		User = 1,
		/**
		 * The part should should be retained for internal bookkeeping within
		 * extensions.
		 */
		Extension = 2,
	}

	/**
	 * A language model response part containing a piece of text, returned from a {@link LanguageModelChatResponse}.
	 */
	export class LanguageModelTextPart2 extends LanguageModelTextPart {
		audience: LanguageModelPartAudience[] | undefined;
		constructor(value: string, audience?: LanguageModelPartAudience[]);
	}

	export class LanguageModelDataPart2 extends LanguageModelDataPart {
		audience: LanguageModelPartAudience[] | undefined;
		constructor(data: Uint8Array, mimeType: string, audience?: LanguageModelPartAudience[]);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.languageStatusText.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.languageStatusText.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	export interface LanguageStatusItem {

		text2: string | { value: string; shortValue: string };
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.mappedEditsProvider.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.mappedEditsProvider.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	/**
	 * @deprecated Part of MappedEditsProvider, use `MappedEditsProvider2` instead.
	 */
	export interface DocumentContextItem {
		readonly uri: Uri;
		readonly version: number;
		readonly ranges: Range[];
	}

	/**
	 * @deprecated Part of MappedEditsProvider, use `MappedEditsProvider2` instead.
	 */
	export interface ConversationRequest {
		// eslint-disable-next-line local/vscode-dts-string-type-literals
		readonly type: 'request';
		readonly message: string;
	}

	/**
	 * @deprecated Part of MappedEditsProvider, use `MappedEditsProvider2` instead.
	 */
	export interface ConversationResponse {
		// eslint-disable-next-line local/vscode-dts-string-type-literals
		readonly type: 'response';
		readonly message: string;
		readonly result?: ChatResult;
		readonly references?: DocumentContextItem[];
	}

	/**
	 * @deprecated Part of MappedEditsProvider, use `MappedEditsProvider2` instead.
	 */
	export interface MappedEditsContext {
		readonly documents: DocumentContextItem[][];
		/**
		 * The conversation that led to the current code block(s).
		 * The last conversation part contains the code block(s) for which the code mapper should provide edits.
		 */
		readonly conversation?: Array<ConversationRequest | ConversationResponse>;
	}

	/**
	 * Interface for providing mapped edits for a given document.
	 * @deprecated Use `MappedEditsProvider2` instead.
	 */
	export interface MappedEditsProvider {
		/**
		 * Provide mapped edits for a given document.
		 * @param document The document to provide mapped edits for.
		 * @param codeBlocks Code blocks that come from an LLM's reply.
		 * 						"Apply in Editor" in the panel chat only sends one edit that the user clicks on, but inline chat can send multiple blocks and let the lang server decide what to do with them.
		 * @param context The context for providing mapped edits.
		 * @param token A cancellation token.
		 * @returns A provider result of text edits.
		 */
		provideMappedEdits(
			document: TextDocument,
			codeBlocks: string[],
			context: MappedEditsContext,
			token: CancellationToken
		): ProviderResult<WorkspaceEdit | null>;
	}

	/**
	 * Interface for providing mapped edits for a given document.
	 */
	export interface MappedEditsRequest {
		readonly codeBlocks: { code: string; resource: Uri; markdownBeforeBlock?: string }[];
		readonly location?: string;
		readonly chatRequestId?: string;
		readonly chatRequestModel?: string;
		readonly chatSessionId?: string;
	}

	export interface MappedEditsResponseStream {
		textEdit(target: Uri, edits: TextEdit | TextEdit[]): void;
		notebookEdit(target: Uri, edits: NotebookEdit | NotebookEdit[]): void;
	}

	export interface MappedEditsResult {
		readonly errorMessage?: string;
	}

	/**
	 * Interface for providing mapped edits for a given document.
	 */
	export interface MappedEditsProvider2 {
		provideMappedEdits(
			request: MappedEditsRequest,
			result: MappedEditsResponseStream,
			token: CancellationToken
		): ProviderResult<MappedEditsResult>;
	}

	namespace chat {
		/**
		 * @deprecated Use `MappedEditsProvider2` instead.
		 */
		export function registerMappedEditsProvider(documentSelector: DocumentSelector, provider: MappedEditsProvider): Disposable;

		export function registerMappedEditsProvider2(provider: MappedEditsProvider2): Disposable;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.markdownAlertSyntax.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.markdownAlertSyntax.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// @kycutler https://github.com/microsoft/vscode/issues/209652

	export interface MarkdownString {

		/**
		 * Indicates that this markdown string can contain alert syntax. Defaults to `false`.
		 *
		 * When `supportAlertSyntax` is true, the markdown renderer will parse GitHub-style alert syntax:
		 *
		 * ```markdown
		 * > [!NOTE]
		 * > This is a note alert
		 *
		 * > [!WARNING]
		 * > This is a warning alert
		 * ```
		 *
		 * Supported alert types: `NOTE`, `TIP`, `IMPORTANT`, `WARNING`, `CAUTION`.
		 */
		supportAlertSyntax?: boolean;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.mcpToolDefinitions.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.mcpToolDefinitions.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/272000 @connor4312

	/**
	 * Defines when a {@link McpServerLanguageModelToolDefinition} is available
	 * for calling.
	 */
	export enum McpToolAvailability {
		/**
		 * The MCP tool is available when the server starts up.
		 */
		Initial = 0,

		/**
		 * The MCP tool is conditionally available when certain preconditions are met.
		 */
		Dynamic = 1,
	}

	/**
	 * The definition for a tool an MCP server provides. Extensions may provide
	 * this as part of their server metadata to allow the editor to defer
	 * starting the server until it's called by a language model.
	 */
	export interface McpServerLanguageModelToolDefinition {
		/**
		 * The definition of the tool as it appears on the MCP protocol. This should
		 * be an object that includes the `inputSchema` and `name`,
		 * among other optional properties.
		 */
		definition?: unknown;

		/**
		 * An indicator for when the tool is available for calling.
		 */
		availability: McpToolAvailability;
	}

	/**
	 * Metadata which the editor can use to hydrate information about the server
	 * prior to starting it. The extension can provide tools and basic server
	 * instructions as they would be expected to appear on MCP itself.
	 *
	 * Once a server is started, the observed values will be cached and take
	 * precedence over those statically declared here unless and until the
	 * server's {@link McpStdioServerDefinition.version version} is updated. If
	 * you can ensure the metadata is always accurate and do not otherwise have
	 * a server `version` to use, it is reasonable to set the server `version`
	 * to a hash of this object to ensure the cache tracks the {@link McpServerMetadata}.
	 */
	export interface McpServerMetadata {
		/**
		 * Tools the MCP server exposes.
		 */
		tools?: McpServerLanguageModelToolDefinition[];

		/**
		 * MCP server instructions as it would appear on the `initialize` result in the protocol.
		 */
		instructions?: string;

		/**
		 * MCP server capabilities as they would appear on the `initialize` result in the protocol.
		 */
		capabilities?: unknown;

		/**
		 * MCP server info as it would appear on the `initialize` result in the protocol.
		 */
		serverInfo?: unknown;
	}


	export class McpStdioServerDefinition2 extends McpStdioServerDefinition {
		metadata?: McpServerMetadata;
		constructor(label: string, command: string, args?: string[], env?: Record<string, string | number | null>, version?: string, metadata?: McpServerMetadata);
	}

	export class McpHttpServerDefinition2 extends McpHttpServerDefinition {
		metadata?: McpServerMetadata;

		/**
		 * Authentication information to use to get a session for the initial MCP server connection.
		 */
		authentication?: {
			providerId: string;
			scopes: string[];
		};

		constructor(label: string, uri: Uri, headers?: Record<string, string>, version?: string, metadata?: McpServerMetadata, authentication?: { providerId: string; scopes: string[] });
	}
}
```

--------------------------------------------------------------------------------

````
