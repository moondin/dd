---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 409
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 409 of 552)

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

---[FILE: src/vs/workbench/contrib/mcp/common/modelContextProtocol.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/common/modelContextProtocol.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* eslint-disable local/code-no-unexternalized-strings */

//#region proposals
/**
 * MCP protocol proposals.
 * - Proposals here MUST have an MCP PR linked to them
 * - Proposals here are subject to change and SHALL be removed when
 *   the upstream MCP PR is merged or closed.
 */
export namespace MCP {

	// Nothing, yet

}

//#endregion

/**
 * Schema updated from the Model Context Protocol repository at
 * https://github.com/modelcontextprotocol/specification/tree/main/schema
 *
 * ⚠️ Do not edit within `namespace` manually except to update schema versions ⚠️
 */
export namespace MCP {
	/* JSON-RPC types */

	/**
	 * Refers to any valid JSON-RPC object that can be decoded off the wire, or encoded to be sent.
	 *
	 * @category JSON-RPC
	 */
	export type JSONRPCMessage =
		| JSONRPCRequest
		| JSONRPCNotification
		| JSONRPCResponse
		| JSONRPCError;

	/** @internal */
	export const LATEST_PROTOCOL_VERSION = "2025-11-25";
	/** @internal */
	export const JSONRPC_VERSION = "2.0";

	/**
	 * A progress token, used to associate progress notifications with the original request.
	 *
	 * @category Common Types
	 */
	export type ProgressToken = string | number;

	/**
	 * An opaque token used to represent a cursor for pagination.
	 *
	 * @category Common Types
	 */
	export type Cursor = string;

	/**
	 * Common params for any task-augmented request.
	 *
	 * @internal
	 */
	export interface TaskAugmentedRequestParams extends RequestParams {
		/**
		 * If specified, the caller is requesting task-augmented execution for this request.
		 * The request will return a CreateTaskResult immediately, and the actual result can be
		 * retrieved later via tasks/result.
		 *
		 * Task augmentation is subject to capability negotiation - receivers MUST declare support
		 * for task augmentation of specific request types in their capabilities.
		 */
		task?: TaskMetadata;
	}
	/**
	 * Common params for any request.
	 *
	 * @internal
	 */
	export interface RequestParams {
		/**
		 * See [General fields: `_meta`](/specification/draft/basic/index#meta) for notes on `_meta` usage.
		 */
		_meta?: {
			/**
			 * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
			 */
			progressToken?: ProgressToken;
			[key: string]: unknown;
		};
	}

	/** @internal */
	export interface Request {
		method: string;
		// Allow unofficial extensions of `Request.params` without impacting `RequestParams`.
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		params?: { [key: string]: any };
	}

	/** @internal */
	export interface NotificationParams {
		/**
		 * See [General fields: `_meta`](/specification/draft/basic/index#meta) for notes on `_meta` usage.
		 */
		_meta?: { [key: string]: unknown };
	}

	/** @internal */
	export interface Notification {
		method: string;
		// Allow unofficial extensions of `Notification.params` without impacting `NotificationParams`.
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		params?: { [key: string]: any };
	}

	/**
	 * @category Common Types
	 */
	export interface Result {
		/**
		 * See [General fields: `_meta`](/specification/draft/basic/index#meta) for notes on `_meta` usage.
		 */
		_meta?: { [key: string]: unknown };
		[key: string]: unknown;
	}

	/**
	 * @category Common Types
	 */
	export interface Error {
		/**
		 * The error type that occurred.
		 */
		code: number;
		/**
		 * A short description of the error. The message SHOULD be limited to a concise single sentence.
		 */
		message: string;
		/**
		 * Additional information about the error. The value of this member is defined by the sender (e.g. detailed error information, nested errors etc.).
		 */
		data?: unknown;
	}

	/**
	 * A uniquely identifying ID for a request in JSON-RPC.
	 *
	 * @category Common Types
	 */
	export type RequestId = string | number;

	/**
	 * A request that expects a response.
	 *
	 * @category JSON-RPC
	 */
	export interface JSONRPCRequest extends Request {
		jsonrpc: typeof JSONRPC_VERSION;
		id: RequestId;
	}

	/**
	 * A notification which does not expect a response.
	 *
	 * @category JSON-RPC
	 */
	export interface JSONRPCNotification extends Notification {
		jsonrpc: typeof JSONRPC_VERSION;
	}

	/**
	 * A successful (non-error) response to a request.
	 *
	 * @category JSON-RPC
	 */
	export interface JSONRPCResponse {
		jsonrpc: typeof JSONRPC_VERSION;
		id: RequestId;
		result: Result;
	}

	// Standard JSON-RPC error codes
	export const PARSE_ERROR = -32700;
	export const INVALID_REQUEST = -32600;
	export const METHOD_NOT_FOUND = -32601;
	export const INVALID_PARAMS = -32602;
	export const INTERNAL_ERROR = -32603;

	// Implementation-specific JSON-RPC error codes [-32000, -32099]
	/** @internal */
	export const URL_ELICITATION_REQUIRED = -32042;

	/**
	 * A response to a request that indicates an error occurred.
	 *
	 * @category JSON-RPC
	 */
	export interface JSONRPCError {
		jsonrpc: typeof JSONRPC_VERSION;
		id: RequestId;
		error: Error;
	}

	/**
	 * An error response that indicates that the server requires the client to provide additional information via an elicitation request.
	 *
	 * @internal
	 */
	export interface URLElicitationRequiredError
		extends Omit<JSONRPCError, "error"> {
		error: Error & {
			code: typeof URL_ELICITATION_REQUIRED;
			data: {
				elicitations: ElicitRequestURLParams[];
				[key: string]: unknown;
			};
		};
	}

	/* Empty result */
	/**
	 * A response that indicates success but carries no data.
	 *
	 * @category Common Types
	 */
	export type EmptyResult = Result;

	/* Cancellation */
	/**
	 * Parameters for a `notifications/cancelled` notification.
	 *
	 * @category `notifications/cancelled`
	 */
	export interface CancelledNotificationParams extends NotificationParams {
		/**
		 * The ID of the request to cancel.
		 *
		 * This MUST correspond to the ID of a request previously issued in the same direction.
		 * This MUST be provided for cancelling non-task requests.
		 * This MUST NOT be used for cancelling tasks (use the `tasks/cancel` request instead).
		 */
		requestId?: RequestId;

		/**
		 * An optional string describing the reason for the cancellation. This MAY be logged or presented to the user.
		 */
		reason?: string;
	}

	/**
	 * This notification can be sent by either side to indicate that it is cancelling a previously-issued request.
	 *
	 * The request SHOULD still be in-flight, but due to communication latency, it is always possible that this notification MAY arrive after the request has already finished.
	 *
	 * This notification indicates that the result will be unused, so any associated processing SHOULD cease.
	 *
	 * A client MUST NOT attempt to cancel its `initialize` request.
	 *
	 * For task cancellation, use the `tasks/cancel` request instead of this notification.
	 *
	 * @category `notifications/cancelled`
	 */
	export interface CancelledNotification extends JSONRPCNotification {
		method: "notifications/cancelled";
		params: CancelledNotificationParams;
	}

	/* Initialization */
	/**
	 * Parameters for an `initialize` request.
	 *
	 * @category `initialize`
	 */
	export interface InitializeRequestParams extends RequestParams {
		/**
		 * The latest version of the Model Context Protocol that the client supports. The client MAY decide to support older versions as well.
		 */
		protocolVersion: string;
		capabilities: ClientCapabilities;
		clientInfo: Implementation;
	}

	/**
	 * This request is sent from the client to the server when it first connects, asking it to begin initialization.
	 *
	 * @category `initialize`
	 */
	export interface InitializeRequest extends JSONRPCRequest {
		method: "initialize";
		params: InitializeRequestParams;
	}

	/**
	 * After receiving an initialize request from the client, the server sends this response.
	 *
	 * @category `initialize`
	 */
	export interface InitializeResult extends Result {
		/**
		 * The version of the Model Context Protocol that the server wants to use. This may not match the version that the client requested. If the client cannot support this version, it MUST disconnect.
		 */
		protocolVersion: string;
		capabilities: ServerCapabilities;
		serverInfo: Implementation;

		/**
		 * Instructions describing how to use the server and its features.
		 *
		 * This can be used by clients to improve the LLM's understanding of available tools, resources, etc. It can be thought of like a "hint" to the model. For example, this information MAY be added to the system prompt.
		 */
		instructions?: string;
	}

	/**
	 * This notification is sent from the client to the server after initialization has finished.
	 *
	 * @category `notifications/initialized`
	 */
	export interface InitializedNotification extends JSONRPCNotification {
		method: "notifications/initialized";
		params?: NotificationParams;
	}

	/**
	 * Capabilities a client may support. Known capabilities are defined here, in this schema, but this is not a closed set: any client can define its own, additional capabilities.
	 *
	 * @category `initialize`
	 */
	export interface ClientCapabilities {
		/**
		 * Experimental, non-standard capabilities that the client supports.
		 */
		experimental?: { [key: string]: object };
		/**
		 * Present if the client supports listing roots.
		 */
		roots?: {
			/**
			 * Whether the client supports notifications for changes to the roots list.
			 */
			listChanged?: boolean;
		};
		/**
		 * Present if the client supports sampling from an LLM.
		 */
		sampling?: {
			/**
			 * Whether the client supports context inclusion via includeContext parameter.
			 * If not declared, servers SHOULD only use `includeContext: "none"` (or omit it).
			 */
			context?: object;
			/**
			 * Whether the client supports tool use via tools and toolChoice parameters.
			 */
			tools?: object;
		};
		/**
		 * Present if the client supports elicitation from the server.
		 */
		elicitation?: { form?: object; url?: object };

		/**
		 * Present if the client supports task-augmented requests.
		 */
		tasks?: {
			/**
			 * Whether this client supports tasks/list.
			 */
			list?: object;
			/**
			 * Whether this client supports tasks/cancel.
			 */
			cancel?: object;
			/**
			 * Specifies which request types can be augmented with tasks.
			 */
			requests?: {
				/**
				 * Task support for sampling-related requests.
				 */
				sampling?: {
					/**
					 * Whether the client supports task-augmented sampling/createMessage requests.
					 */
					createMessage?: object;
				};
				/**
				 * Task support for elicitation-related requests.
				 */
				elicitation?: {
					/**
					 * Whether the client supports task-augmented elicitation/create requests.
					 */
					create?: object;
				};
			};
		};
	}

	/**
	 * Capabilities that a server may support. Known capabilities are defined here, in this schema, but this is not a closed set: any server can define its own, additional capabilities.
	 *
	 * @category `initialize`
	 */
	export interface ServerCapabilities {
		/**
		 * Experimental, non-standard capabilities that the server supports.
		 */
		experimental?: { [key: string]: object };
		/**
		 * Present if the server supports sending log messages to the client.
		 */
		logging?: object;
		/**
		 * Present if the server supports argument autocompletion suggestions.
		 */
		completions?: object;
		/**
		 * Present if the server offers any prompt templates.
		 */
		prompts?: {
			/**
			 * Whether this server supports notifications for changes to the prompt list.
			 */
			listChanged?: boolean;
		};
		/**
		 * Present if the server offers any resources to read.
		 */
		resources?: {
			/**
			 * Whether this server supports subscribing to resource updates.
			 */
			subscribe?: boolean;
			/**
			 * Whether this server supports notifications for changes to the resource list.
			 */
			listChanged?: boolean;
		};
		/**
		 * Present if the server offers any tools to call.
		 */
		tools?: {
			/**
			 * Whether this server supports notifications for changes to the tool list.
			 */
			listChanged?: boolean;
		};
		/**
		 * Present if the server supports task-augmented requests.
		 */
		tasks?: {
			/**
			 * Whether this server supports tasks/list.
			 */
			list?: object;
			/**
			 * Whether this server supports tasks/cancel.
			 */
			cancel?: object;
			/**
			 * Specifies which request types can be augmented with tasks.
			 */
			requests?: {
				/**
				 * Task support for tool-related requests.
				 */
				tools?: {
					/**
					 * Whether the server supports task-augmented tools/call requests.
					 */
					call?: object;
				};
			};
		};
	}

	/**
	 * An optionally-sized icon that can be displayed in a user interface.
	 *
	 * @category Common Types
	 */
	export interface Icon {
		/**
		 * A standard URI pointing to an icon resource. May be an HTTP/HTTPS URL or a
		 * `data:` URI with Base64-encoded image data.
		 *
		 * Consumers SHOULD takes steps to ensure URLs serving icons are from the
		 * same domain as the client/server or a trusted domain.
		 *
		 * Consumers SHOULD take appropriate precautions when consuming SVGs as they can contain
		 * executable JavaScript.
		 *
		 * @format uri
		 */
		src: string;

		/**
		 * Optional MIME type override if the source MIME type is missing or generic.
		 * For example: `"image/png"`, `"image/jpeg"`, or `"image/svg+xml"`.
		 */
		mimeType?: string;

		/**
		 * Optional array of strings that specify sizes at which the icon can be used.
		 * Each string should be in WxH format (e.g., `"48x48"`, `"96x96"`) or `"any"` for scalable formats like SVG.
		 *
		 * If not provided, the client should assume that the icon can be used at any size.
		 */
		sizes?: string[];

		/**
		 * Optional specifier for the theme this icon is designed for. `light` indicates
		 * the icon is designed to be used with a light background, and `dark` indicates
		 * the icon is designed to be used with a dark background.
		 *
		 * If not provided, the client should assume the icon can be used with any theme.
		 */
		theme?: "light" | "dark";
	}

	/**
	 * Base interface to add `icons` property.
	 *
	 * @internal
	 */
	export interface Icons {
		/**
		 * Optional set of sized icons that the client can display in a user interface.
		 *
		 * Clients that support rendering icons MUST support at least the following MIME types:
		 * - `image/png` - PNG images (safe, universal compatibility)
		 * - `image/jpeg` (and `image/jpg`) - JPEG images (safe, universal compatibility)
		 *
		 * Clients that support rendering icons SHOULD also support:
		 * - `image/svg+xml` - SVG images (scalable but requires security precautions)
		 * - `image/webp` - WebP images (modern, efficient format)
		 */
		icons?: Icon[];
	}

	/**
	 * Base interface for metadata with name (identifier) and title (display name) properties.
	 *
	 * @internal
	 */
	export interface BaseMetadata {
		/**
		 * Intended for programmatic or logical use, but used as a display name in past specs or fallback (if title isn't present).
		 */
		name: string;

		/**
		 * Intended for UI and end-user contexts - optimized to be human-readable and easily understood,
		 * even by those unfamiliar with domain-specific terminology.
		 *
		 * If not provided, the name should be used for display (except for Tool,
		 * where `annotations.title` should be given precedence over using `name`,
		 * if present).
		 */
		title?: string;
	}

	/**
	 * Describes the MCP implementation.
	 *
	 * @category `initialize`
	 */
	export interface Implementation extends BaseMetadata, Icons {
		version: string;

		/**
		 * An optional human-readable description of what this implementation does.
		 *
		 * This can be used by clients or servers to provide context about their purpose
		 * and capabilities. For example, a server might describe the types of resources
		 * or tools it provides, while a client might describe its intended use case.
		 */
		description?: string;

		/**
		 * An optional URL of the website for this implementation.
		 *
		 * @format uri
		 */
		websiteUrl?: string;
	}

	/* Ping */
	/**
	 * A ping, issued by either the server or the client, to check that the other party is still alive. The receiver must promptly respond, or else may be disconnected.
	 *
	 * @category `ping`
	 */
	export interface PingRequest extends JSONRPCRequest {
		method: "ping";
		params?: RequestParams;
	}

	/* Progress notifications */

	/**
	 * Parameters for a `notifications/progress` notification.
	 *
	 * @category `notifications/progress`
	 */
	export interface ProgressNotificationParams extends NotificationParams {
		/**
		 * The progress token which was given in the initial request, used to associate this notification with the request that is proceeding.
		 */
		progressToken: ProgressToken;
		/**
		 * The progress thus far. This should increase every time progress is made, even if the total is unknown.
		 *
		 * @TJS-type number
		 */
		progress: number;
		/**
		 * Total number of items to process (or total progress required), if known.
		 *
		 * @TJS-type number
		 */
		total?: number;
		/**
		 * An optional message describing the current progress.
		 */
		message?: string;
	}

	/**
	 * An out-of-band notification used to inform the receiver of a progress update for a long-running request.
	 *
	 * @category `notifications/progress`
	 */
	export interface ProgressNotification extends JSONRPCNotification {
		method: "notifications/progress";
		params: ProgressNotificationParams;
	}

	/* Pagination */
	/**
	 * Common parameters for paginated requests.
	 *
	 * @internal
	 */
	export interface PaginatedRequestParams extends RequestParams {
		/**
		 * An opaque token representing the current pagination position.
		 * If provided, the server should return results starting after this cursor.
		 */
		cursor?: Cursor;
	}

	/** @internal */
	export interface PaginatedRequest extends JSONRPCRequest {
		params?: PaginatedRequestParams;
	}

	/** @internal */
	export interface PaginatedResult extends Result {
		/**
		 * An opaque token representing the pagination position after the last returned result.
		 * If present, there may be more results available.
		 */
		nextCursor?: Cursor;
	}

	/* Resources */
	/**
	 * Sent from the client to request a list of resources the server has.
	 *
	 * @category `resources/list`
	 */
	export interface ListResourcesRequest extends PaginatedRequest {
		method: "resources/list";
	}

	/**
	 * The server's response to a resources/list request from the client.
	 *
	 * @category `resources/list`
	 */
	export interface ListResourcesResult extends PaginatedResult {
		resources: Resource[];
	}

	/**
	 * Sent from the client to request a list of resource templates the server has.
	 *
	 * @category `resources/templates/list`
	 */
	export interface ListResourceTemplatesRequest extends PaginatedRequest {
		method: "resources/templates/list";
	}

	/**
	 * The server's response to a resources/templates/list request from the client.
	 *
	 * @category `resources/templates/list`
	 */
	export interface ListResourceTemplatesResult extends PaginatedResult {
		resourceTemplates: ResourceTemplate[];
	}

	/**
	 * Common parameters when working with resources.
	 *
	 * @internal
	 */
	export interface ResourceRequestParams extends RequestParams {
		/**
		 * The URI of the resource. The URI can use any protocol; it is up to the server how to interpret it.
		 *
		 * @format uri
		 */
		uri: string;
	}

	/**
	 * Parameters for a `resources/read` request.
	 *
	 * @category `resources/read`
	 */
	export interface ReadResourceRequestParams extends ResourceRequestParams { }

	/**
	 * Sent from the client to the server, to read a specific resource URI.
	 *
	 * @category `resources/read`
	 */
	export interface ReadResourceRequest extends JSONRPCRequest {
		method: "resources/read";
		params: ReadResourceRequestParams;
	}

	/**
	 * The server's response to a resources/read request from the client.
	 *
	 * @category `resources/read`
	 */
	export interface ReadResourceResult extends Result {
		contents: (TextResourceContents | BlobResourceContents)[];
	}

	/**
	 * An optional notification from the server to the client, informing it that the list of resources it can read from has changed. This may be issued by servers without any previous subscription from the client.
	 *
	 * @category `notifications/resources/list_changed`
	 */
	export interface ResourceListChangedNotification extends JSONRPCNotification {
		method: "notifications/resources/list_changed";
		params?: NotificationParams;
	}

	/**
	 * Parameters for a `resources/subscribe` request.
	 *
	 * @category `resources/subscribe`
	 */
	export interface SubscribeRequestParams extends ResourceRequestParams { }

	/**
	 * Sent from the client to request resources/updated notifications from the server whenever a particular resource changes.
	 *
	 * @category `resources/subscribe`
	 */
	export interface SubscribeRequest extends JSONRPCRequest {
		method: "resources/subscribe";
		params: SubscribeRequestParams;
	}

	/**
	 * Parameters for a `resources/unsubscribe` request.
	 *
	 * @category `resources/unsubscribe`
	 */
	export interface UnsubscribeRequestParams extends ResourceRequestParams { }

	/**
	 * Sent from the client to request cancellation of resources/updated notifications from the server. This should follow a previous resources/subscribe request.
	 *
	 * @category `resources/unsubscribe`
	 */
	export interface UnsubscribeRequest extends JSONRPCRequest {
		method: "resources/unsubscribe";
		params: UnsubscribeRequestParams;
	}

	/**
	 * Parameters for a `notifications/resources/updated` notification.
	 *
	 * @category `notifications/resources/updated`
	 */
	export interface ResourceUpdatedNotificationParams extends NotificationParams {
		/**
		 * The URI of the resource that has been updated. This might be a sub-resource of the one that the client actually subscribed to.
		 *
		 * @format uri
		 */
		uri: string;
	}

	/**
	 * A notification from the server to the client, informing it that a resource has changed and may need to be read again. This should only be sent if the client previously sent a resources/subscribe request.
	 *
	 * @category `notifications/resources/updated`
	 */
	export interface ResourceUpdatedNotification extends JSONRPCNotification {
		method: "notifications/resources/updated";
		params: ResourceUpdatedNotificationParams;
	}

	/**
	 * A known resource that the server is capable of reading.
	 *
	 * @category `resources/list`
	 */
	export interface Resource extends BaseMetadata, Icons {
		/**
		 * The URI of this resource.
		 *
		 * @format uri
		 */
		uri: string;

		/**
		 * A description of what this resource represents.
		 *
		 * This can be used by clients to improve the LLM's understanding of available resources. It can be thought of like a "hint" to the model.
		 */
		description?: string;

		/**
		 * The MIME type of this resource, if known.
		 */
		mimeType?: string;

		/**
		 * Optional annotations for the client.
		 */
		annotations?: Annotations;

		/**
		 * The size of the raw resource content, in bytes (i.e., before base64 encoding or any tokenization), if known.
		 *
		 * This can be used by Hosts to display file sizes and estimate context window usage.
		 */
		size?: number;

		/**
		 * See [General fields: `_meta`](/specification/draft/basic/index#meta) for notes on `_meta` usage.
		 */
		_meta?: { [key: string]: unknown };
	}

	/**
	 * A template description for resources available on the server.
	 *
	 * @category `resources/templates/list`
	 */
	export interface ResourceTemplate extends BaseMetadata, Icons {
		/**
		 * A URI template (according to RFC 6570) that can be used to construct resource URIs.
		 *
		 * @format uri-template
		 */
		uriTemplate: string;

		/**
		 * A description of what this template is for.
		 *
		 * This can be used by clients to improve the LLM's understanding of available resources. It can be thought of like a "hint" to the model.
		 */
		description?: string;

		/**
		 * The MIME type for all resources that match this template. This should only be included if all resources matching this template have the same type.
		 */
		mimeType?: string;

		/**
		 * Optional annotations for the client.
		 */
		annotations?: Annotations;

		/**
		 * See [General fields: `_meta`](/specification/draft/basic/index#meta) for notes on `_meta` usage.
		 */
		_meta?: { [key: string]: unknown };
	}

	/**
	 * The contents of a specific resource or sub-resource.
	 *
	 * @internal
	 */
	export interface ResourceContents {
		/**
		 * The URI of this resource.
		 *
		 * @format uri
		 */
		uri: string;
		/**
		 * The MIME type of this resource, if known.
		 */
		mimeType?: string;

		/**
		 * See [General fields: `_meta`](/specification/draft/basic/index#meta) for notes on `_meta` usage.
		 */
		_meta?: { [key: string]: unknown };
	}

	/**
	 * @category Content
	 */
	export interface TextResourceContents extends ResourceContents {
		/**
		 * The text of the item. This must only be set if the item can actually be represented as text (not binary data).
		 */
		text: string;
	}

	/**
	 * @category Content
	 */
	export interface BlobResourceContents extends ResourceContents {
		/**
		 * A base64-encoded string representing the binary data of the item.
		 *
		 * @format byte
		 */
		blob: string;
	}

	/* Prompts */
	/**
	 * Sent from the client to request a list of prompts and prompt templates the server has.
	 *
	 * @category `prompts/list`
	 */
	export interface ListPromptsRequest extends PaginatedRequest {
		method: "prompts/list";
	}

	/**
	 * The server's response to a prompts/list request from the client.
	 *
	 * @category `prompts/list`
	 */
	export interface ListPromptsResult extends PaginatedResult {
		prompts: Prompt[];
	}

	/**
	 * Parameters for a `prompts/get` request.
	 *
	 * @category `prompts/get`
	 */
	export interface GetPromptRequestParams extends RequestParams {
		/**
		 * The name of the prompt or prompt template.
		 */
		name: string;
		/**
		 * Arguments to use for templating the prompt.
		 */
		arguments?: { [key: string]: string };
	}

	/**
	 * Used by the client to get a prompt provided by the server.
	 *
	 * @category `prompts/get`
	 */
	export interface GetPromptRequest extends JSONRPCRequest {
		method: "prompts/get";
		params: GetPromptRequestParams;
	}

	/**
	 * The server's response to a prompts/get request from the client.
	 *
	 * @category `prompts/get`
	 */
	export interface GetPromptResult extends Result {
		/**
		 * An optional description for the prompt.
		 */
		description?: string;
		messages: PromptMessage[];
	}

	/**
	 * A prompt or prompt template that the server offers.
	 *
	 * @category `prompts/list`
	 */
	export interface Prompt extends BaseMetadata, Icons {
		/**
		 * An optional description of what this prompt provides
		 */
		description?: string;

		/**
		 * A list of arguments to use for templating the prompt.
		 */
		arguments?: PromptArgument[];

		/**
		 * See [General fields: `_meta`](/specification/draft/basic/index#meta) for notes on `_meta` usage.
		 */
		_meta?: { [key: string]: unknown };
	}

	/**
	 * Describes an argument that a prompt can accept.
	 *
	 * @category `prompts/list`
	 */
	export interface PromptArgument extends BaseMetadata {
		/**
		 * A human-readable description of the argument.
		 */
		description?: string;
		/**
		 * Whether this argument must be provided.
		 */
		required?: boolean;
	}

	/**
	 * The sender or recipient of messages and data in a conversation.
	 *
	 * @category Common Types
	 */
	export type Role = "user" | "assistant";

	/**
	 * Describes a message returned as part of a prompt.
	 *
	 * This is similar to `SamplingMessage`, but also supports the embedding of
	 * resources from the MCP server.
	 *
	 * @category `prompts/get`
	 */
	export interface PromptMessage {
		role: Role;
		content: ContentBlock;
	}

	/**
	 * A resource that the server is capable of reading, included in a prompt or tool call result.
	 *
	 * Note: resource links returned by tools are not guaranteed to appear in the results of `resources/list` requests.
	 *
	 * @category Content
	 */
	export interface ResourceLink extends Resource {
		type: "resource_link";
	}

	/**
	 * The contents of a resource, embedded into a prompt or tool call result.
	 *
	 * It is up to the client how best to render embedded resources for the benefit
	 * of the LLM and/or the user.
	 *
	 * @category Content
	 */
	export interface EmbeddedResource {
		type: "resource";
		resource: TextResourceContents | BlobResourceContents;

		/**
		 * Optional annotations for the client.
		 */
		annotations?: Annotations;

		/**
		 * See [General fields: `_meta`](/specification/draft/basic/index#meta) for notes on `_meta` usage.
		 */
		_meta?: { [key: string]: unknown };
	}
	/**
	 * An optional notification from the server to the client, informing it that the list of prompts it offers has changed. This may be issued by servers without any previous subscription from the client.
	 *
	 * @category `notifications/prompts/list_changed`
	 */
	export interface PromptListChangedNotification extends JSONRPCNotification {
		method: "notifications/prompts/list_changed";
		params?: NotificationParams;
	}

	/* Tools */
	/**
	 * Sent from the client to request a list of tools the server has.
	 *
	 * @category `tools/list`
	 */
	export interface ListToolsRequest extends PaginatedRequest {
		method: "tools/list";
	}

	/**
	 * The server's response to a tools/list request from the client.
	 *
	 * @category `tools/list`
	 */
	export interface ListToolsResult extends PaginatedResult {
		tools: Tool[];
	}

	/**
	 * The server's response to a tool call.
	 *
	 * @category `tools/call`
	 */
	export interface CallToolResult extends Result {
		/**
		 * A list of content objects that represent the unstructured result of the tool call.
		 */
		content: ContentBlock[];

		/**
		 * An optional JSON object that represents the structured result of the tool call.
		 */
		structuredContent?: { [key: string]: unknown };

		/**
		 * Whether the tool call ended in an error.
		 *
		 * If not set, this is assumed to be false (the call was successful).
		 *
		 * Any errors that originate from the tool SHOULD be reported inside the result
		 * object, with `isError` set to true, _not_ as an MCP protocol-level error
		 * response. Otherwise, the LLM would not be able to see that an error occurred
		 * and self-correct.
		 *
		 * However, any errors in _finding_ the tool, an error indicating that the
		 * server does not support tool calls, or any other exceptional conditions,
		 * should be reported as an MCP error response.
		 */
		isError?: boolean;
	}

	/**
	 * Parameters for a `tools/call` request.
	 *
	 * @category `tools/call`
	 */
	export interface CallToolRequestParams extends TaskAugmentedRequestParams {
		/**
		 * The name of the tool.
		 */
		name: string;
		/**
		 * Arguments to use for the tool call.
		 */
		arguments?: { [key: string]: unknown };
	}

	/**
	 * Used by the client to invoke a tool provided by the server.
	 *
	 * @category `tools/call`
	 */
	export interface CallToolRequest extends JSONRPCRequest {
		method: "tools/call";
		params: CallToolRequestParams;
	}

	/**
	 * An optional notification from the server to the client, informing it that the list of tools it offers has changed. This may be issued by servers without any previous subscription from the client.
	 *
	 * @category `notifications/tools/list_changed`
	 */
	export interface ToolListChangedNotification extends JSONRPCNotification {
		method: "notifications/tools/list_changed";
		params?: NotificationParams;
	}

	/**
	 * Additional properties describing a Tool to clients.
	 *
	 * NOTE: all properties in ToolAnnotations are **hints**.
	 * They are not guaranteed to provide a faithful description of
	 * tool behavior (including descriptive properties like `title`).
	 *
	 * Clients should never make tool use decisions based on ToolAnnotations
	 * received from untrusted servers.
	 *
	 * @category `tools/list`
	 */
	export interface ToolAnnotations {
		/**
		 * A human-readable title for the tool.
		 */
		title?: string;

		/**
		 * If true, the tool does not modify its environment.
		 *
		 * Default: false
		 */
		readOnlyHint?: boolean;

		/**
		 * If true, the tool may perform destructive updates to its environment.
		 * If false, the tool performs only additive updates.
		 *
		 * (This property is meaningful only when `readOnlyHint == false`)
		 *
		 * Default: true
		 */
		destructiveHint?: boolean;

		/**
		 * If true, calling the tool repeatedly with the same arguments
		 * will have no additional effect on its environment.
		 *
		 * (This property is meaningful only when `readOnlyHint == false`)
		 *
		 * Default: false
		 */
		idempotentHint?: boolean;

		/**
		 * If true, this tool may interact with an "open world" of external
		 * entities. If false, the tool's domain of interaction is closed.
		 * For example, the world of a web search tool is open, whereas that
		 * of a memory tool is not.
		 *
		 * Default: true
		 */
		openWorldHint?: boolean;
	}

	/**
	 * Execution-related properties for a tool.
	 *
	 * @category `tools/list`
	 */
	export interface ToolExecution {
		/**
		 * Indicates whether this tool supports task-augmented execution.
		 * This allows clients to handle long-running operations through polling
		 * the task system.
		 *
		 * - "forbidden": Tool does not support task-augmented execution (default when absent)
		 * - "optional": Tool may support task-augmented execution
		 * - "required": Tool requires task-augmented execution
		 *
		 * Default: "forbidden"
		 */
		taskSupport?: "forbidden" | "optional" | "required";
	}

	/**
	 * Definition for a tool the client can call.
	 *
	 * @category `tools/list`
	 */
	export interface Tool extends BaseMetadata, Icons {
		/**
		 * A human-readable description of the tool.
		 *
		 * This can be used by clients to improve the LLM's understanding of available tools. It can be thought of like a "hint" to the model.
		 */
		description?: string;

		/**
		 * A JSON Schema object defining the expected parameters for the tool.
		 */
		inputSchema: {
			$schema?: string;
			type: "object";
			properties?: { [key: string]: object };
			required?: string[];
		};

		/**
		 * Execution-related properties for this tool.
		 */
		execution?: ToolExecution;

		/**
		 * An optional JSON Schema object defining the structure of the tool's output returned in
		 * the structuredContent field of a CallToolResult.
		 *
		 * Defaults to JSON Schema 2020-12 when no explicit $schema is provided.
		 * Currently restricted to type: "object" at the root level.
		 */
		outputSchema?: {
			$schema?: string;
			type: "object";
			properties?: { [key: string]: object };
			required?: string[];
		};

		/**
		 * Optional additional tool information.
		 *
		 * Display name precedence order is: title, annotations.title, then name.
		 */
		annotations?: ToolAnnotations;

		/**
		 * See [General fields: `_meta`](/specification/draft/basic/index#meta) for notes on `_meta` usage.
		 */
		_meta?: { [key: string]: unknown };
	}

	/* Tasks */

	/**
	 * The status of a task.
	 *
	 * @category `tasks`
	 */
	export type TaskStatus =
		| "working" // The request is currently being processed
		| "input_required" // The task is waiting for input (e.g., elicitation or sampling)
		| "completed" // The request completed successfully and results are available
		| "failed" // The associated request did not complete successfully. For tool calls specifically, this includes cases where the tool call result has `isError` set to true.
		| "cancelled"; // The request was cancelled before completion

	/**
	 * Metadata for augmenting a request with task execution.
	 * Include this in the `task` field of the request parameters.
	 *
	 * @category `tasks`
	 */
	export interface TaskMetadata {
		/**
		 * Requested duration in milliseconds to retain task from creation.
		 */
		ttl?: number;
	}

	/**
	 * Metadata for associating messages with a task.
	 * Include this in the `_meta` field under the key `io.modelcontextprotocol/related-task`.
	 *
	 * @category `tasks`
	 */
	export interface RelatedTaskMetadata {
		/**
		 * The task identifier this message is associated with.
		 */
		taskId: string;
	}

	/**
	 * Data associated with a task.
	 *
	 * @category `tasks`
	 */
	export interface Task {
		/**
		 * The task identifier.
		 */
		taskId: string;

		/**
		 * Current task state.
		 */
		status: TaskStatus;

		/**
		 * Optional human-readable message describing the current task state.
		 * This can provide context for any status, including:
		 * - Reasons for "cancelled" status
		 * - Summaries for "completed" status
		 * - Diagnostic information for "failed" status (e.g., error details, what went wrong)
		 */
		statusMessage?: string;

		/**
		 * ISO 8601 timestamp when the task was created.
		 */
		createdAt: string;

		/**
		 * Actual retention duration from creation in milliseconds, null for unlimited.
		 */
		ttl: number | null;

		/**
		 * Suggested polling interval in milliseconds.
		 */
		pollInterval?: number;
	}

	/**
	 * A response to a task-augmented request.
	 *
	 * @category `tasks`
	 */
	export interface CreateTaskResult extends Result {
		task: Task;
	}

	/**
	 * A request to retrieve the state of a task.
	 *
	 * @category `tasks/get`
	 */
	export interface GetTaskRequest extends JSONRPCRequest {
		method: "tasks/get";
		params: {
			/**
			 * The task identifier to query.
			 */
			taskId: string;
		};
	}

	/**
	 * The response to a tasks/get request.
	 *
	 * @category `tasks/get`
	 */
	export type GetTaskResult = Result & Task;

	/**
	 * A request to retrieve the result of a completed task.
	 *
	 * @category `tasks/result`
	 */
	export interface GetTaskPayloadRequest extends JSONRPCRequest {
		method: "tasks/result";
		params: {
			/**
			 * The task identifier to retrieve results for.
			 */
			taskId: string;
		};
	}

	/**
	 * The response to a tasks/result request.
	 * The structure matches the result type of the original request.
	 * For example, a tools/call task would return the CallToolResult structure.
	 *
	 * @category `tasks/result`
	 */
	export interface GetTaskPayloadResult extends Result {
		[key: string]: unknown;
	}

	/**
	 * A request to cancel a task.
	 *
	 * @category `tasks/cancel`
	 */
	export interface CancelTaskRequest extends JSONRPCRequest {
		method: "tasks/cancel";
		params: {
			/**
			 * The task identifier to cancel.
			 */
			taskId: string;
		};
	}

	/**
	 * The response to a tasks/cancel request.
	 *
	 * @category `tasks/cancel`
	 */
	export type CancelTaskResult = Result & Task;

	/**
	 * A request to retrieve a list of tasks.
	 *
	 * @category `tasks/list`
	 */
	export interface ListTasksRequest extends PaginatedRequest {
		method: "tasks/list";
	}

	/**
	 * The response to a tasks/list request.
	 *
	 * @category `tasks/list`
	 */
	export interface ListTasksResult extends PaginatedResult {
		tasks: Task[];
	}

	/**
	 * Parameters for a `notifications/tasks/status` notification.
	 *
	 * @category `notifications/tasks/status`
	 */
	export type TaskStatusNotificationParams = NotificationParams & Task;

	/**
	 * An optional notification from the receiver to the requestor, informing them that a task's status has changed. Receivers are not required to send these notifications.
	 *
	 * @category `notifications/tasks/status`
	 */
	export interface TaskStatusNotification extends JSONRPCNotification {
		method: "notifications/tasks/status";
		params: TaskStatusNotificationParams;
	}

	/* Logging */

	/**
	 * Parameters for a `logging/setLevel` request.
	 *
	 * @category `logging/setLevel`
	 */
	export interface SetLevelRequestParams extends RequestParams {
		/**
		 * The level of logging that the client wants to receive from the server. The server should send all logs at this level and higher (i.e., more severe) to the client as notifications/message.
		 */
		level: LoggingLevel;
	}

	/**
	 * A request from the client to the server, to enable or adjust logging.
	 *
	 * @category `logging/setLevel`
	 */
	export interface SetLevelRequest extends JSONRPCRequest {
		method: "logging/setLevel";
		params: SetLevelRequestParams;
	}

	/**
	 * Parameters for a `notifications/message` notification.
	 *
	 * @category `notifications/message`
	 */
	export interface LoggingMessageNotificationParams extends NotificationParams {
		/**
		 * The severity of this log message.
		 */
		level: LoggingLevel;
		/**
		 * An optional name of the logger issuing this message.
		 */
		logger?: string;
		/**
		 * The data to be logged, such as a string message or an object. Any JSON serializable type is allowed here.
		 */
		data: unknown;
	}

	/**
	 * JSONRPCNotification of a log message passed from server to client. If no logging/setLevel request has been sent from the client, the server MAY decide which messages to send automatically.
	 *
	 * @category `notifications/message`
	 */
	export interface LoggingMessageNotification extends JSONRPCNotification {
		method: "notifications/message";
		params: LoggingMessageNotificationParams;
	}

	/**
	 * The severity of a log message.
	 *
	 * These map to syslog message severities, as specified in RFC-5424:
	 * https://datatracker.ietf.org/doc/html/rfc5424#section-6.2.1
	 *
	 * @category Common Types
	 */
	export type LoggingLevel =
		| "debug"
		| "info"
		| "notice"
		| "warning"
		| "error"
		| "critical"
		| "alert"
		| "emergency";

	/* Sampling */
	/**
	 * Parameters for a `sampling/createMessage` request.
	 *
	 * @category `sampling/createMessage`
	 */
	export interface CreateMessageRequestParams extends TaskAugmentedRequestParams {
		messages: SamplingMessage[];
		/**
		 * The server's preferences for which model to select. The client MAY ignore these preferences.
		 */
		modelPreferences?: ModelPreferences;
		/**
		 * An optional system prompt the server wants to use for sampling. The client MAY modify or omit this prompt.
		 */
		systemPrompt?: string;
		/**
		 * A request to include context from one or more MCP servers (including the caller), to be attached to the prompt.
		 * The client MAY ignore this request.
		 *
		 * Default is "none". Values "thisServer" and "allServers" are soft-deprecated. Servers SHOULD only use these values if the client
		 * declares ClientCapabilities.sampling.context. These values may be removed in future spec releases.
		 */
		includeContext?: "none" | "thisServer" | "allServers";
		/**
		 * @TJS-type number
		 */
		temperature?: number;
		/**
		 * The requested maximum number of tokens to sample (to prevent runaway completions).
		 *
		 * The client MAY choose to sample fewer tokens than the requested maximum.
		 */
		maxTokens: number;
		stopSequences?: string[];
		/**
		 * Optional metadata to pass through to the LLM provider. The format of this metadata is provider-specific.
		 */
		metadata?: object;
		/**
		 * Tools that the model may use during generation.
		 * The client MUST return an error if this field is provided but ClientCapabilities.sampling.tools is not declared.
		 */
		tools?: Tool[];
		/**
		 * Controls how the model uses tools.
		 * The client MUST return an error if this field is provided but ClientCapabilities.sampling.tools is not declared.
		 * Default is `{ mode: "auto" }`.
		 */
		toolChoice?: ToolChoice;
	}

	/**
	 * Controls tool selection behavior for sampling requests.
	 *
	 * @category `sampling/createMessage`
	 */
	export interface ToolChoice {
		/**
		 * Controls the tool use ability of the model:
		 * - "auto": Model decides whether to use tools (default)
		 * - "required": Model MUST use at least one tool before completing
		 * - "none": Model MUST NOT use any tools
		 */
		mode?: "auto" | "required" | "none";
	}

	/**
	 * A request from the server to sample an LLM via the client. The client has full discretion over which model to select. The client should also inform the user before beginning sampling, to allow them to inspect the request (human in the loop) and decide whether to approve it.
	 *
	 * @category `sampling/createMessage`
	 */
	export interface CreateMessageRequest extends JSONRPCRequest {
		method: "sampling/createMessage";
		params: CreateMessageRequestParams;
	}

	/**
	 * The client's response to a sampling/createMessage request from the server.
	 * The client should inform the user before returning the sampled message, to allow them
	 * to inspect the response (human in the loop) and decide whether to allow the server to see it.
	 *
	 * @category `sampling/createMessage`
	 */
	export interface CreateMessageResult extends Result, SamplingMessage {
		/**
		 * The name of the model that generated the message.
		 */
		model: string;

		/**
		 * The reason why sampling stopped, if known.
		 *
		 * Standard values:
		 * - "endTurn": Natural end of the assistant's turn
		 * - "stopSequence": A stop sequence was encountered
		 * - "maxTokens": Maximum token limit was reached
		 * - "toolUse": The model wants to use one or more tools
		 *
		 * This field is an open string to allow for provider-specific stop reasons.
		 */
		stopReason?: "endTurn" | "stopSequence" | "maxTokens" | "toolUse" | string;
	}

	/**
	 * Describes a message issued to or received from an LLM API.
	 *
	 * @category `sampling/createMessage`
	 */
	export interface SamplingMessage {
		role: Role;
		content: SamplingMessageContentBlock | SamplingMessageContentBlock[];
		/**
		 * See [General fields: `_meta`](/specification/draft/basic/index#meta) for notes on `_meta` usage.
		 */
		_meta?: { [key: string]: unknown };
	}
	export type SamplingMessageContentBlock =
		| TextContent
		| ImageContent
		| AudioContent
		| ToolUseContent
		| ToolResultContent;

	/**
	 * Optional annotations for the client. The client can use annotations to inform how objects are used or displayed
	 *
	 * @category Common Types
	 */
	export interface Annotations {
		/**
		 * Describes who the intended audience of this object or data is.
		 *
		 * It can include multiple entries to indicate content useful for multiple audiences (e.g., `["user", "assistant"]`).
		 */
		audience?: Role[];

		/**
		 * Describes how important this data is for operating the server.
		 *
		 * A value of 1 means "most important," and indicates that the data is
		 * effectively required, while 0 means "least important," and indicates that
		 * the data is entirely optional.
		 *
		 * @TJS-type number
		 * @minimum 0
		 * @maximum 1
		 */
		priority?: number;

		/**
		 * The moment the resource was last modified, as an ISO 8601 formatted string.
		 *
		 * Should be an ISO 8601 formatted string (e.g., "2025-01-12T15:00:58Z").
		 *
		 * Examples: last activity timestamp in an open file, timestamp when the resource
		 * was attached, etc.
		 */
		lastModified?: string;
	}

	/**
	 * @category Content
	 */
	export type ContentBlock =
		| TextContent
		| ImageContent
		| AudioContent
		| ResourceLink
		| EmbeddedResource;

	/**
	 * Text provided to or from an LLM.
	 *
	 * @category Content
	 */
	export interface TextContent {
		type: "text";

		/**
		 * The text content of the message.
		 */
		text: string;

		/**
		 * Optional annotations for the client.
		 */
		annotations?: Annotations;

		/**
		 * See [General fields: `_meta`](/specification/draft/basic/index#meta) for notes on `_meta` usage.
		 */
		_meta?: { [key: string]: unknown };
	}

	/**
	 * An image provided to or from an LLM.
	 *
	 * @category Content
	 */
	export interface ImageContent {
		type: "image";

		/**
		 * The base64-encoded image data.
		 *
		 * @format byte
		 */
		data: string;

		/**
		 * The MIME type of the image. Different providers may support different image types.
		 */
		mimeType: string;

		/**
		 * Optional annotations for the client.
		 */
		annotations?: Annotations;

		/**
		 * See [General fields: `_meta`](/specification/draft/basic/index#meta) for notes on `_meta` usage.
		 */
		_meta?: { [key: string]: unknown };
	}

	/**
	 * Audio provided to or from an LLM.
	 *
	 * @category Content
	 */
	export interface AudioContent {
		type: "audio";

		/**
		 * The base64-encoded audio data.
		 *
		 * @format byte
		 */
		data: string;

		/**
		 * The MIME type of the audio. Different providers may support different audio types.
		 */
		mimeType: string;

		/**
		 * Optional annotations for the client.
		 */
		annotations?: Annotations;

		/**
		 * See [General fields: `_meta`](/specification/draft/basic/index#meta) for notes on `_meta` usage.
		 */
		_meta?: { [key: string]: unknown };
	}

	/**
	 * A request from the assistant to call a tool.
	 *
	 * @category `sampling/createMessage`
	 */
	export interface ToolUseContent {
		type: "tool_use";

		/**
		 * A unique identifier for this tool use.
		 *
		 * This ID is used to match tool results to their corresponding tool uses.
		 */
		id: string;

		/**
		 * The name of the tool to call.
		 */
		name: string;

		/**
		 * The arguments to pass to the tool, conforming to the tool's input schema.
		 */
		input: { [key: string]: unknown };

		/**
		 * Optional metadata about the tool use. Clients SHOULD preserve this field when
		 * including tool uses in subsequent sampling requests to enable caching optimizations.
		 *
		 * See [General fields: `_meta`](/specification/draft/basic/index#meta) for notes on `_meta` usage.
		 */
		_meta?: { [key: string]: unknown };
	}

	/**
	 * The result of a tool use, provided by the user back to the assistant.
	 *
	 * @category `sampling/createMessage`
	 */
	export interface ToolResultContent {
		type: "tool_result";

		/**
		 * The ID of the tool use this result corresponds to.
		 *
		 * This MUST match the ID from a previous ToolUseContent.
		 */
		toolUseId: string;

		/**
		 * The unstructured result content of the tool use.
		 *
		 * This has the same format as CallToolResult.content and can include text, images,
		 * audio, resource links, and embedded resources.
		 */
		content: ContentBlock[];

		/**
		 * An optional structured result object.
		 *
		 * If the tool defined an outputSchema, this SHOULD conform to that schema.
		 */
		structuredContent?: { [key: string]: unknown };

		/**
		 * Whether the tool use resulted in an error.
		 *
		 * If true, the content typically describes the error that occurred.
		 * Default: false
		 */
		isError?: boolean;

		/**
		 * Optional metadata about the tool result. Clients SHOULD preserve this field when
		 * including tool results in subsequent sampling requests to enable caching optimizations.
		 *
		 * See [General fields: `_meta`](/specification/draft/basic/index#meta) for notes on `_meta` usage.
		 */
		_meta?: { [key: string]: unknown };
	}

	/**
	 * The server's preferences for model selection, requested of the client during sampling.
	 *
	 * Because LLMs can vary along multiple dimensions, choosing the "best" model is
	 * rarely straightforward.  Different models excel in different areas-some are
	 * faster but less capable, others are more capable but more expensive, and so
	 * on. This interface allows servers to express their priorities across multiple
	 * dimensions to help clients make an appropriate selection for their use case.
	 *
	 * These preferences are always advisory. The client MAY ignore them. It is also
	 * up to the client to decide how to interpret these preferences and how to
	 * balance them against other considerations.
	 *
	 * @category `sampling/createMessage`
	 */
	export interface ModelPreferences {
		/**
		 * Optional hints to use for model selection.
		 *
		 * If multiple hints are specified, the client MUST evaluate them in order
		 * (such that the first match is taken).
		 *
		 * The client SHOULD prioritize these hints over the numeric priorities, but
		 * MAY still use the priorities to select from ambiguous matches.
		 */
		hints?: ModelHint[];

		/**
		 * How much to prioritize cost when selecting a model. A value of 0 means cost
		 * is not important, while a value of 1 means cost is the most important
		 * factor.
		 *
		 * @TJS-type number
		 * @minimum 0
		 * @maximum 1
		 */
		costPriority?: number;

		/**
		 * How much to prioritize sampling speed (latency) when selecting a model. A
		 * value of 0 means speed is not important, while a value of 1 means speed is
		 * the most important factor.
		 *
		 * @TJS-type number
		 * @minimum 0
		 * @maximum 1
		 */
		speedPriority?: number;

		/**
		 * How much to prioritize intelligence and capabilities when selecting a
		 * model. A value of 0 means intelligence is not important, while a value of 1
		 * means intelligence is the most important factor.
		 *
		 * @TJS-type number
		 * @minimum 0
		 * @maximum 1
		 */
		intelligencePriority?: number;
	}

	/**
	 * Hints to use for model selection.
	 *
	 * Keys not declared here are currently left unspecified by the spec and are up
	 * to the client to interpret.
	 *
	 * @category `sampling/createMessage`
	 */
	export interface ModelHint {
		/**
		 * A hint for a model name.
		 *
		 * The client SHOULD treat this as a substring of a model name; for example:
		 *  - `claude-3-5-sonnet` should match `claude-3-5-sonnet-20241022`
		 *  - `sonnet` should match `claude-3-5-sonnet-20241022`, `claude-3-sonnet-20240229`, etc.
		 *  - `claude` should match any Claude model
		 *
		 * The client MAY also map the string to a different provider's model name or a different model family, as long as it fills a similar niche; for example:
		 *  - `gemini-1.5-flash` could match `claude-3-haiku-20240307`
		 */
		name?: string;
	}

	/* Autocomplete */
	/**
	 * Parameters for a `completion/complete` request.
	 *
	 * @category `completion/complete`
	 */
	export interface CompleteRequestParams extends RequestParams {
		ref: PromptReference | ResourceTemplateReference;
		/**
		 * The argument's information
		 */
		argument: {
			/**
			 * The name of the argument
			 */
			name: string;
			/**
			 * The value of the argument to use for completion matching.
			 */
			value: string;
		};

		/**
		 * Additional, optional context for completions
		 */
		context?: {
			/**
			 * Previously-resolved variables in a URI template or prompt.
			 */
			arguments?: { [key: string]: string };
		};
	}

	/**
	 * A request from the client to the server, to ask for completion options.
	 *
	 * @category `completion/complete`
	 */
	export interface CompleteRequest extends JSONRPCRequest {
		method: "completion/complete";
		params: CompleteRequestParams;
	}

	/**
	 * The server's response to a completion/complete request
	 *
	 * @category `completion/complete`
	 */
	export interface CompleteResult extends Result {
		completion: {
			/**
			 * An array of completion values. Must not exceed 100 items.
			 */
			values: string[];
			/**
			 * The total number of completion options available. This can exceed the number of values actually sent in the response.
			 */
			total?: number;
			/**
			 * Indicates whether there are additional completion options beyond those provided in the current response, even if the exact total is unknown.
			 */
			hasMore?: boolean;
		};
	}

	/**
	 * A reference to a resource or resource template definition.
	 *
	 * @category `completion/complete`
	 */
	export interface ResourceTemplateReference {
		type: "ref/resource";
		/**
		 * The URI or URI template of the resource.
		 *
		 * @format uri-template
		 */
		uri: string;
	}

	/**
	 * Identifies a prompt.
	 *
	 * @category `completion/complete`
	 */
	export interface PromptReference extends BaseMetadata {
		type: "ref/prompt";
	}

	/* Roots */
	/**
	 * Sent from the server to request a list of root URIs from the client. Roots allow
	 * servers to ask for specific directories or files to operate on. A common example
	 * for roots is providing a set of repositories or directories a server should operate
	 * on.
	 *
	 * This request is typically used when the server needs to understand the file system
	 * structure or access specific locations that the client has permission to read from.
	 *
	 * @category `roots/list`
	 */
	export interface ListRootsRequest extends JSONRPCRequest {
		method: "roots/list";
		params?: RequestParams;
	}

	/**
	 * The client's response to a roots/list request from the server.
	 * This result contains an array of Root objects, each representing a root directory
	 * or file that the server can operate on.
	 *
	 * @category `roots/list`
	 */
	export interface ListRootsResult extends Result {
		roots: Root[];
	}

	/**
	 * Represents a root directory or file that the server can operate on.
	 *
	 * @category `roots/list`
	 */
	export interface Root {
		/**
		 * The URI identifying the root. This *must* start with file:// for now.
		 * This restriction may be relaxed in future versions of the protocol to allow
		 * other URI schemes.
		 *
		 * @format uri
		 */
		uri: string;
		/**
		 * An optional name for the root. This can be used to provide a human-readable
		 * identifier for the root, which may be useful for display purposes or for
		 * referencing the root in other parts of the application.
		 */
		name?: string;

		/**
		 * See [General fields: `_meta`](/specification/draft/basic/index#meta) for notes on `_meta` usage.
		 */
		_meta?: { [key: string]: unknown };
	}

	/**
	 * A notification from the client to the server, informing it that the list of roots has changed.
	 * This notification should be sent whenever the client adds, removes, or modifies any root.
	 * The server should then request an updated list of roots using the ListRootsRequest.
	 *
	 * @category `notifications/roots/list_changed`
	 */
	export interface RootsListChangedNotification extends JSONRPCNotification {
		method: "notifications/roots/list_changed";
		params?: NotificationParams;
	}

	/**
	 * The parameters for a request to elicit non-sensitive information from the user via a form in the client.
	 *
	 * @category `elicitation/create`
	 */
	export interface ElicitRequestFormParams extends TaskAugmentedRequestParams {
		/**
		 * The elicitation mode.
		 */
		mode?: "form";

		/**
		 * The message to present to the user describing what information is being requested.
		 */
		message: string;

		/**
		 * A restricted subset of JSON Schema.
		 * Only top-level properties are allowed, without nesting.
		 */
		requestedSchema: {
			$schema?: string;
			type: "object";
			properties: {
				[key: string]: PrimitiveSchemaDefinition;
			};
			required?: string[];
		};
	}

	/**
	 * The parameters for a request to elicit information from the user via a URL in the client.
	 *
	 * @category `elicitation/create`
	 */
	export interface ElicitRequestURLParams extends TaskAugmentedRequestParams {
		/**
		 * The elicitation mode.
		 */
		mode: "url";

		/**
		 * The message to present to the user explaining why the interaction is needed.
		 */
		message: string;

		/**
		 * The ID of the elicitation, which must be unique within the context of the server.
		 * The client MUST treat this ID as an opaque value.
		 */
		elicitationId: string;

		/**
		 * The URL that the user should navigate to.
		 *
		 * @format uri
		 */
		url: string;
	}

	/**
	 * The parameters for a request to elicit additional information from the user via the client.
	 *
	 * @category `elicitation/create`
	 */
	export type ElicitRequestParams =
		| ElicitRequestFormParams
		| ElicitRequestURLParams;

	/**
	 * A request from the server to elicit additional information from the user via the client.
	 *
	 * @category `elicitation/create`
	 */
	export interface ElicitRequest extends JSONRPCRequest {
		method: "elicitation/create";
		params: ElicitRequestParams;
	}

	/**
	 * Restricted schema definitions that only allow primitive types
	 * without nested objects or arrays.
	 *
	 * @category `elicitation/create`
	 */
	export type PrimitiveSchemaDefinition =
		| StringSchema
		| NumberSchema
		| BooleanSchema
		| EnumSchema;

	/**
	 * @category `elicitation/create`
	 */
	export interface StringSchema {
		type: "string";
		title?: string;
		description?: string;
		minLength?: number;
		maxLength?: number;
		format?: "email" | "uri" | "date" | "date-time";
		default?: string;
	}

	/**
	 * @category `elicitation/create`
	 */
	export interface NumberSchema {
		type: "number" | "integer";
		title?: string;
		description?: string;
		minimum?: number;
		maximum?: number;
		default?: number;
	}

	/**
	 * @category `elicitation/create`
	 */
	export interface BooleanSchema {
		type: "boolean";
		title?: string;
		description?: string;
		default?: boolean;
	}

	/**
	 * Schema for single-selection enumeration without display titles for options.
	 *
	 * @category `elicitation/create`
	 */
	export interface UntitledSingleSelectEnumSchema {
		type: "string";
		/**
		 * Optional title for the enum field.
		 */
		title?: string;
		/**
		 * Optional description for the enum field.
		 */
		description?: string;
		/**
		 * Array of enum values to choose from.
		 */
		enum: string[];
		/**
		 * Optional default value.
		 */
		default?: string;
	}

	/**
	 * Schema for single-selection enumeration with display titles for each option.
	 *
	 * @category `elicitation/create`
	 */
	export interface TitledSingleSelectEnumSchema {
		type: "string";
		/**
		 * Optional title for the enum field.
		 */
		title?: string;
		/**
		 * Optional description for the enum field.
		 */
		description?: string;
		/**
		 * Array of enum options with values and display labels.
		 */
		oneOf: Array<{
			/**
			 * The enum value.
			 */
			const: string;
			/**
			 * Display label for this option.
			 */
			title: string;
		}>;
		/**
		 * Optional default value.
		 */
		default?: string;
	}

	/**
	 * @category `elicitation/create`
	 */
	// Combined single selection enumeration
	export type SingleSelectEnumSchema =
		| UntitledSingleSelectEnumSchema
		| TitledSingleSelectEnumSchema;

	/**
	 * Schema for multiple-selection enumeration without display titles for options.
	 *
	 * @category `elicitation/create`
	 */
	export interface UntitledMultiSelectEnumSchema {
		type: "array";
		/**
		 * Optional title for the enum field.
		 */
		title?: string;
		/**
		 * Optional description for the enum field.
		 */
		description?: string;
		/**
		 * Minimum number of items to select.
		 */
		minItems?: number;
		/**
		 * Maximum number of items to select.
		 */
		maxItems?: number;
		/**
		 * Schema for the array items.
		 */
		items: {
			type: "string";
			/**
			 * Array of enum values to choose from.
			 */
			enum: string[];
		};
		/**
		 * Optional default value.
		 */
		default?: string[];
	}

	/**
	 * Schema for multiple-selection enumeration with display titles for each option.
	 *
	 * @category `elicitation/create`
	 */
	export interface TitledMultiSelectEnumSchema {
		type: "array";
		/**
		 * Optional title for the enum field.
		 */
		title?: string;
		/**
		 * Optional description for the enum field.
		 */
		description?: string;
		/**
		 * Minimum number of items to select.
		 */
		minItems?: number;
		/**
		 * Maximum number of items to select.
		 */
		maxItems?: number;
		/**
		 * Schema for array items with enum options and display labels.
		 */
		items: {
			/**
			 * Array of enum options with values and display labels.
			 */
			anyOf: Array<{
				/**
				 * The constant enum value.
				 */
				const: string;
				/**
				 * Display title for this option.
				 */
				title: string;
			}>;
		};
		/**
		 * Optional default value.
		 */
		default?: string[];
	}

	/**
	 * @category `elicitation/create`
	 */
	// Combined multiple selection enumeration
	export type MultiSelectEnumSchema =
		| UntitledMultiSelectEnumSchema
		| TitledMultiSelectEnumSchema;

	/**
	 * Use TitledSingleSelectEnumSchema instead.
	 * This interface will be removed in a future version.
	 *
	 * @category `elicitation/create`
	 */
	export interface LegacyTitledEnumSchema {
		type: "string";
		title?: string;
		description?: string;
		enum: string[];
		/**
		 * (Legacy) Display names for enum values.
		 * Non-standard according to JSON schema 2020-12.
		 */
		enumNames?: string[];
		default?: string;
	}

	/**
	 * @category `elicitation/create`
	 */
	// Union type for all enum schemas
	export type EnumSchema =
		| SingleSelectEnumSchema
		| MultiSelectEnumSchema
		| LegacyTitledEnumSchema;

	/**
	 * The client's response to an elicitation request.
	 *
	 * @category `elicitation/create`
	 */
	export interface ElicitResult extends Result {
		/**
		 * The user action in response to the elicitation.
		 * - "accept": User submitted the form/confirmed the action
		 * - "decline": User explicitly decline the action
		 * - "cancel": User dismissed without making an explicit choice
		 */
		action: "accept" | "decline" | "cancel";

		/**
		 * The submitted form data, only present when action is "accept" and mode was "form".
		 * Contains values matching the requested schema.
		 * Omitted for out-of-band mode responses.
		 */
		content?: { [key: string]: string | number | boolean | string[] };
	}

	/**
	 * An optional notification from the server to the client, informing it of a completion of a out-of-band elicitation request.
	 *
	 * @category `notifications/elicitation/complete`
	 */
	export interface ElicitationCompleteNotification extends JSONRPCNotification {
		method: "notifications/elicitation/complete";
		params: {
			/**
			 * The ID of the elicitation that completed.
			 */
			elicitationId: string;
		};
	}

	/* Client messages */
	/** @internal */
	export type ClientRequest =
		| PingRequest
		| InitializeRequest
		| CompleteRequest
		| SetLevelRequest
		| GetPromptRequest
		| ListPromptsRequest
		| ListResourcesRequest
		| ListResourceTemplatesRequest
		| ReadResourceRequest
		| SubscribeRequest
		| UnsubscribeRequest
		| CallToolRequest
		| ListToolsRequest
		| GetTaskRequest
		| GetTaskPayloadRequest
		| ListTasksRequest
		| CancelTaskRequest;

	/** @internal */
	export type ClientNotification =
		| CancelledNotification
		| ProgressNotification
		| InitializedNotification
		| RootsListChangedNotification
		| TaskStatusNotification;

	/** @internal */
	export type ClientResult =
		| EmptyResult
		| CreateMessageResult
		| ListRootsResult
		| ElicitResult
		| GetTaskResult
		| GetTaskPayloadResult
		| ListTasksResult
		| CancelTaskResult;

	/* Server messages */
	/** @internal */
	export type ServerRequest =
		| PingRequest
		| CreateMessageRequest
		| ListRootsRequest
		| ElicitRequest
		| GetTaskRequest
		| GetTaskPayloadRequest
		| ListTasksRequest
		| CancelTaskRequest;

	/** @internal */
	export type ServerNotification =
		| CancelledNotification
		| ProgressNotification
		| LoggingMessageNotification
		| ResourceUpdatedNotification
		| ResourceListChangedNotification
		| ToolListChangedNotification
		| PromptListChangedNotification
		| ElicitationCompleteNotification
		| TaskStatusNotification;

	/** @internal */
	export type ServerResult =
		| EmptyResult
		| InitializeResult
		| CompleteResult
		| GetPromptResult
		| ListPromptsResult
		| ListResourceTemplatesResult
		| ListResourcesResult
		| ReadResourceResult
		| CallToolResult
		| ListToolsResult
		| GetTaskResult
		| GetTaskPayloadResult
		| ListTasksResult
		| CancelTaskResult;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/common/uriTemplate.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/common/uriTemplate.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export interface IUriTemplateVariable {
	readonly explodable: boolean;
	readonly name: string;
	readonly optional: boolean;
	readonly prefixLength?: number;
	readonly repeatable: boolean;
}

interface IUriTemplateComponent {
	readonly expression: string;
	readonly operator: string;
	readonly variables: readonly IUriTemplateVariable[];
}

/**
 * Represents an RFC 6570 URI Template.
 */
export class UriTemplate {
	/**
	 * The parsed template components (expressions).
	 */
	public readonly components: ReadonlyArray<IUriTemplateComponent | string>;

	private constructor(
		public readonly template: string,
		components: ReadonlyArray<IUriTemplateComponent | string>
	) {
		this.template = template;
		this.components = components;
	}

	/**
	 * Parses a URI template string into a UriTemplate instance.
	 */
	public static parse(template: string): UriTemplate {
		const components: Array<IUriTemplateComponent | string> = [];
		const regex = /\{([^{}]+)\}/g;
		let match: RegExpExecArray | null;
		let lastPos = 0;
		while ((match = regex.exec(template))) {
			const [expression, inner] = match;
			components.push(template.slice(lastPos, match.index));
			lastPos = match.index + expression.length;

			// Handle escaped braces: treat '{{' and '}}' as literals, not expressions
			if (template[match.index - 1] === '{' || template[lastPos] === '}') {
				components.push(inner);
				continue;
			}

			let operator = '';
			let rest = inner;
			if (rest.length > 0 && UriTemplate._isOperator(rest[0])) {
				operator = rest[0];
				rest = rest.slice(1);
			}
			const variables = rest.split(',').map((v): IUriTemplateVariable => {
				let name = v;
				let explodable = false;
				let repeatable = false;
				let prefixLength: number | undefined = undefined;
				let optional = false;
				if (name.endsWith('*')) {
					explodable = true;
					repeatable = true;
					name = name.slice(0, -1);
				}
				const prefixMatch = name.match(/^(.*?):(\d+)$/);
				if (prefixMatch) {
					name = prefixMatch[1];
					prefixLength = parseInt(prefixMatch[2], 10);
				}
				if (name.endsWith('?')) {
					optional = true;
					name = name.slice(0, -1);
				}
				return { explodable, name, optional, prefixLength, repeatable };
			});
			components.push({ expression, operator, variables });
		}
		components.push(template.slice(lastPos));

		return new UriTemplate(template, components);
	}

	private static _operators = ['+', '#', '.', '/', ';', '?', '&'] as const;
	private static _isOperator(ch: string): boolean {
		return (UriTemplate._operators as readonly string[]).includes(ch);
	}

	/**
	 * Resolves the template with the given variables.
	 */
	public resolve(variables: Record<string, unknown>): string {
		let result = '';
		for (const comp of this.components) {
			if (typeof comp === 'string') {
				result += comp;
			} else {
				result += this._expand(comp, variables);
			}
		}
		return result;
	}

	private _expand(comp: IUriTemplateComponent, variables: Record<string, unknown>): string {
		const op = comp.operator;
		const varSpecs = comp.variables;
		if (varSpecs.length === 0) {
			return comp.expression;
		}
		const vals: string[] = [];
		const isNamed = op === ';' || op === '?' || op === '&';
		const isReserved = op === '+' || op === '#';
		const isFragment = op === '#';
		const isLabel = op === '.';
		const isPath = op === '/';
		const isForm = op === '?';
		const isFormCont = op === '&';
		const isParam = op === ';';

		let prefix = '';
		if (op === '+') { prefix = ''; }
		else if (op === '#') { prefix = '#'; }
		else if (op === '.') { prefix = '.'; }
		else if (op === '/') { prefix = ''; }
		else if (op === ';') { prefix = ';'; }
		else if (op === '?') { prefix = '?'; }
		else if (op === '&') { prefix = '&'; }

		for (const v of varSpecs) {
			const value = variables[v.name];
			const defined = Object.prototype.hasOwnProperty.call(variables, v.name);
			if (value === undefined || value === null || (Array.isArray(value) && value.length === 0)) {
				if (isParam) {
					if (defined && (value === null || value === undefined)) {
						vals.push(v.name);
					}
					continue;
				}
				if (isForm || isFormCont) {
					if (defined) {
						vals.push(UriTemplate._formPair(v.name, '', isNamed));
					}
					continue;
				}
				continue;
			}
			if (typeof value === 'object' && !Array.isArray(value)) {
				if (v.explodable) {
					const pairs: string[] = [];
					for (const k in value) {
						if (Object.prototype.hasOwnProperty.call(value, k)) {
							const thisVal = String((value as Record<string, unknown>)[k]);
							if (isParam) {
								pairs.push(k + '=' + thisVal);
							} else if (isForm || isFormCont) {
								pairs.push(k + '=' + thisVal);
							} else if (isLabel) {
								pairs.push(k + '=' + thisVal);
							} else if (isPath) {
								pairs.push('/' + k + '=' + UriTemplate._encode(thisVal, isReserved));
							} else {
								pairs.push(k + '=' + UriTemplate._encode(thisVal, isReserved));
							}
						}
					}
					if (isLabel) {
						vals.push(pairs.join('.'));
					} else if (isPath) {
						vals.push(pairs.join(''));
					} else if (isParam) {
						vals.push(pairs.join(';'));
					} else if (isForm || isFormCont) {
						vals.push(pairs.join('&'));
					} else {
						vals.push(pairs.join(','));
					}
				} else {
					// Not explodable: join as k1,v1,k2,v2,... and assign to variable name
					const pairs: string[] = [];
					for (const k in value) {
						if (Object.prototype.hasOwnProperty.call(value, k)) {
							pairs.push(k);
							pairs.push(String((value as Record<string, unknown>)[k]));
						}
					}
					// For label, param, form, join as keys=semi,;,dot,.,comma,, (no encoding of , or ;)
					const joined = pairs.join(',');
					if (isLabel) {
						vals.push(joined);
					} else if (isParam || isForm || isFormCont) {
						vals.push(v.name + '=' + joined);
					} else {
						vals.push(joined);
					}
				}
				continue;
			}
			if (Array.isArray(value)) {
				if (v.explodable) {
					if (isLabel) {
						vals.push(value.join('.'));
					} else if (isPath) {
						vals.push(value.map(x => '/' + UriTemplate._encode(x, isReserved)).join(''));
					} else if (isParam) {
						vals.push(value.map(x => v.name + '=' + String(x)).join(';'));
					} else if (isForm || isFormCont) {
						vals.push(value.map(x => v.name + '=' + String(x)).join('&'));
					} else {
						vals.push(value.map(x => UriTemplate._encode(x, isReserved)).join(','));
					}
				} else {
					if (isLabel) {
						vals.push(value.join(','));
					} else if (isParam) {
						vals.push(v.name + '=' + value.join(','));
					} else if (isForm || isFormCont) {
						vals.push(v.name + '=' + value.join(','));
					} else {
						vals.push(value.map(x => UriTemplate._encode(x, isReserved)).join(','));
					}
				}
				continue;
			}
			let str = String(value);
			if (v.prefixLength !== undefined) {
				str = str.substring(0, v.prefixLength);
			}
			// For simple expansion, encode ! as well (not reserved)
			// Only + and # are reserved
			const enc = UriTemplate._encode(str, op === '+' || op === '#');
			if (isParam) {
				vals.push(v.name + '=' + enc);
			} else if (isForm || isFormCont) {
				vals.push(v.name + '=' + enc);
			} else if (isLabel) {
				vals.push(enc);
			} else if (isPath) {
				vals.push('/' + enc);
			} else {
				vals.push(enc);
			}
		}

		let joined = '';
		if (isLabel) {
			// Remove trailing dot for missing values
			const filtered = vals.filter(v => v !== '');
			joined = filtered.length ? prefix + filtered.join('.') : '';
		} else if (isPath) {
			// Remove empty segments for undefined/null
			const filtered = vals.filter(v => v !== '');
			joined = filtered.length ? filtered.join('') : '';
			if (joined && !joined.startsWith('/')) {
				joined = '/' + joined;
			}
		} else if (isParam) {
			// For param, if value is empty string, just append ;name
			joined = vals.length ? prefix + vals.map(v => v.replace(/=\s*$/, '')).join(';') : '';
		} else if (isForm) {
			joined = vals.length ? prefix + vals.join('&') : '';
		} else if (isFormCont) {
			joined = vals.length ? prefix + vals.join('&') : '';
		} else if (isFragment) {
			joined = prefix + vals.join(',');
		} else if (isReserved) {
			joined = vals.join(',');
		} else {
			joined = vals.join(',');
		}
		return joined;
	}

	private static _encode(str: string, reserved: boolean): string {
		return reserved ? encodeURI(str) : pctEncode(str);
	}

	private static _formPair(k: string, v: unknown, named: boolean): string {
		return named ? k + '=' + encodeURIComponent(String(v)) : encodeURIComponent(String(v));
	}
}

function pctEncode(str: string): string {
	let out = '';
	for (let i = 0; i < str.length; i++) {
		const chr = str.charCodeAt(i);
		if (
			// alphanum ranges:
			(chr >= 0x30 && chr <= 0x39 || chr >= 0x41 && chr <= 0x5a || chr >= 0x61 && chr <= 0x7a) ||
			// unreserved characters:
			(chr === 0x2d || chr === 0x2e || chr === 0x5f || chr === 0x7e)
		) {
			out += str[i];
		} else {
			out += '%' + chr.toString(16).toUpperCase();
		}
	}
	return out;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/common/discovery/extensionMcpDiscovery.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/common/discovery/extensionMcpDiscovery.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, DisposableMap } from '../../../../../base/common/lifecycle.js';
import { observableValue } from '../../../../../base/common/observable.js';
import { isFalsyOrWhitespace } from '../../../../../base/common/strings.js';
import { localize } from '../../../../../nls.js';
import { ConfigurationTarget } from '../../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr, IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { IMcpCollectionContribution } from '../../../../../platform/extensions/common/extensions.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../../platform/storage/common/storage.js';
import { IExtensionService } from '../../../../services/extensions/common/extensions.js';
import * as extensionsRegistry from '../../../../services/extensions/common/extensionsRegistry.js';
import { mcpActivationEvent, mcpContributionPoint } from '../mcpConfiguration.js';
import { IMcpRegistry } from '../mcpRegistryTypes.js';
import { extensionPrefixedIdentifier, McpServerDefinition, McpServerTrust } from '../mcpTypes.js';
import { IMcpDiscovery } from './mcpDiscovery.js';

const cacheKey = 'mcp.extCachedServers';

interface IServerCacheEntry {
	readonly servers: readonly McpServerDefinition.Serialized[];
}

const _mcpExtensionPoint = extensionsRegistry.ExtensionsRegistry.registerExtensionPoint(mcpContributionPoint);

const enum PersistWhen {
	CollectionExists,
	Always,
}

export class ExtensionMcpDiscovery extends Disposable implements IMcpDiscovery {

	readonly fromGallery = false;

	private readonly _extensionCollectionIdsToPersist = new Map<string, PersistWhen>();
	private readonly cachedServers: { [collcetionId: string]: IServerCacheEntry };
	private readonly _conditionalCollections = this._register(new DisposableMap<string>());

	constructor(
		@IMcpRegistry private readonly _mcpRegistry: IMcpRegistry,
		@IStorageService storageService: IStorageService,
		@IExtensionService private readonly _extensionService: IExtensionService,
		@IContextKeyService private readonly _contextKeyService: IContextKeyService,
	) {
		super();
		this.cachedServers = storageService.getObject(cacheKey, StorageScope.WORKSPACE, {});

		this._register(storageService.onWillSaveState(() => {
			let updated = false;
			for (const [collectionId, behavior] of this._extensionCollectionIdsToPersist.entries()) {
				const collection = this._mcpRegistry.collections.get().find(c => c.id === collectionId);
				let defs = collection?.serverDefinitions.get();
				if (!collection || collection.lazy) {
					if (behavior === PersistWhen.Always) {
						defs = [];
					} else {
						continue;
					}
				}

				if (defs) {
					updated = true;
					this.cachedServers[collectionId] = { servers: defs.map(McpServerDefinition.toSerialized) };
				}
			}

			if (updated) {
				storageService.store(cacheKey, this.cachedServers, StorageScope.WORKSPACE, StorageTarget.MACHINE);
			}
		}));
	}

	public start(): void {
		const extensionCollections = this._register(new DisposableMap<string>());
		this._register(_mcpExtensionPoint.setHandler((_extensions, delta) => {
			const { added, removed } = delta;

			for (const collections of removed) {
				for (const coll of collections.value) {
					const id = extensionPrefixedIdentifier(collections.description.identifier, coll.id);
					extensionCollections.deleteAndDispose(id);
					this._conditionalCollections.deleteAndDispose(id);
				}
			}

			for (const collections of added) {

				if (!ExtensionMcpDiscovery._validate(collections)) {
					continue;
				}

				for (const coll of collections.value) {
					const id = extensionPrefixedIdentifier(collections.description.identifier, coll.id);
					this._extensionCollectionIdsToPersist.set(id, PersistWhen.CollectionExists);

					// Handle conditional collections with 'when' clause
					if (coll.when) {
						this._registerConditionalCollection(id, coll, collections, extensionCollections);
					} else {
						// Register collection immediately if no 'when' clause
						this._registerCollection(id, coll, collections, extensionCollections);
					}
				}
			}
		}));
	}

	private _registerCollection(
		id: string,
		coll: IMcpCollectionContribution,
		collections: extensionsRegistry.IExtensionPointUser<IMcpCollectionContribution[]>,
		extensionCollections: DisposableMap<string>
	) {
		const serverDefs = this.cachedServers.hasOwnProperty(id) ? this.cachedServers[id].servers : undefined;
		const dispo = this._mcpRegistry.registerCollection({
			id,
			label: coll.label,
			remoteAuthority: null,
			trustBehavior: McpServerTrust.Kind.Trusted,
			scope: StorageScope.WORKSPACE,
			configTarget: ConfigurationTarget.USER,
			serverDefinitions: observableValue<McpServerDefinition[]>(this, serverDefs?.map(McpServerDefinition.fromSerialized) || []),
			lazy: {
				isCached: !!serverDefs,
				load: () => this._activateExtensionServers(coll.id).then(() => {
					// persist (an empty collection) in case the extension doesn't end up publishing one
					this._extensionCollectionIdsToPersist.set(id, PersistWhen.Always);
				}),
				removed: () => {
					extensionCollections.deleteAndDispose(id);
					this._conditionalCollections.deleteAndDispose(id);
				},
			},
			source: collections.description.identifier
		});

		extensionCollections.set(id, dispo);
	}

	private _registerConditionalCollection(
		id: string,
		coll: IMcpCollectionContribution,
		collections: extensionsRegistry.IExtensionPointUser<IMcpCollectionContribution[]>,
		extensionCollections: DisposableMap<string>
	) {
		const whenClause = ContextKeyExpr.deserialize(coll.when!);
		if (!whenClause) {
			// Invalid when clause, treat as always false
			return;
		}

		const evaluate = () => {
			const nowSatisfied = this._contextKeyService.contextMatchesRules(whenClause);
			const isRegistered = extensionCollections.has(id);
			if (nowSatisfied && !isRegistered) {
				this._registerCollection(id, coll, collections, extensionCollections);
			} else if (!nowSatisfied && isRegistered) {
				extensionCollections.deleteAndDispose(id);
			}
		};

		const contextKeyListener = this._contextKeyService.onDidChangeContext(evaluate);
		evaluate();

		// Store disposable for this conditional collection
		this._conditionalCollections.set(id, contextKeyListener);
	}

	private async _activateExtensionServers(collectionId: string): Promise<void> {
		await this._extensionService.activateByEvent(mcpActivationEvent(collectionId));
		await Promise.all(this._mcpRegistry.delegates.get()
			.map(r => r.waitForInitialProviderPromises()));
	}

	private static _validate(user: extensionsRegistry.IExtensionPointUser<IMcpCollectionContribution[]>): boolean {

		if (!Array.isArray(user.value)) {
			user.collector.error(localize('invalidData', "Expected an array of MCP collections"));
			return false;
		}

		for (const contribution of user.value) {
			if (typeof contribution.id !== 'string' || isFalsyOrWhitespace(contribution.id)) {
				user.collector.error(localize('invalidId', "Expected 'id' to be a non-empty string."));
				return false;
			}
			if (typeof contribution.label !== 'string' || isFalsyOrWhitespace(contribution.label)) {
				user.collector.error(localize('invalidLabel', "Expected 'label' to be a non-empty string."));
				return false;
			}
			if (contribution.when !== undefined && (typeof contribution.when !== 'string' || isFalsyOrWhitespace(contribution.when))) {
				user.collector.error(localize('invalidWhen', "Expected 'when' to be a non-empty string."));
				return false;
			}
		}

		return true;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/common/discovery/installedMcpServersDiscovery.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/common/discovery/installedMcpServersDiscovery.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { equals } from '../../../../../base/common/arrays.js';
import { Throttler } from '../../../../../base/common/async.js';
import { Disposable, DisposableMap, DisposableStore, IDisposable } from '../../../../../base/common/lifecycle.js';
import { ResourceMap } from '../../../../../base/common/map.js';
import { ISettableObservable, observableValue } from '../../../../../base/common/observable.js';
import { URI } from '../../../../../base/common/uri.js';
import { Location } from '../../../../../editor/common/languages.js';
import { ITextModelService } from '../../../../../editor/common/services/resolverService.js';
import { ConfigurationTarget } from '../../../../../platform/configuration/common/configuration.js';
import { ILogService } from '../../../../../platform/log/common/log.js';
import { StorageScope } from '../../../../../platform/storage/common/storage.js';
import { IWorkbenchLocalMcpServer } from '../../../../services/mcp/common/mcpWorkbenchManagementService.js';
import { getMcpServerMapping } from '../mcpConfigFileUtils.js';
import { mcpConfigurationSection } from '../mcpConfiguration.js';
import { IMcpRegistry } from '../mcpRegistryTypes.js';
import { IMcpConfigPath, IMcpWorkbenchService, McpCollectionDefinition, McpServerDefinition, McpServerLaunch, McpServerTransportType, McpServerTrust } from '../mcpTypes.js';
import { IMcpDiscovery } from './mcpDiscovery.js';

interface CollectionState extends IDisposable {
	definition: McpCollectionDefinition;
	serverDefinitions: ISettableObservable<readonly McpServerDefinition[]>;
}

export class InstalledMcpServersDiscovery extends Disposable implements IMcpDiscovery {

	readonly fromGallery = true;
	private readonly collections = this._register(new DisposableMap<string, CollectionState>());

	constructor(
		@IMcpWorkbenchService private readonly mcpWorkbenchService: IMcpWorkbenchService,
		@IMcpRegistry private readonly mcpRegistry: IMcpRegistry,
		@ITextModelService private readonly textModelService: ITextModelService,
		@ILogService private readonly logService: ILogService,
	) {
		super();
	}

	public start(): void {
		const throttler = this._register(new Throttler());
		this._register(this.mcpWorkbenchService.onChange(() => throttler.queue(() => this.sync())));
		this.sync();
	}

	private async getServerIdMapping(resource: URI, pathToServers: string[]): Promise<Map<string, Location>> {
		const store = new DisposableStore();
		try {
			const ref = await this.textModelService.createModelReference(resource);
			store.add(ref);
			const serverIdMapping = getMcpServerMapping({ model: ref.object.textEditorModel, pathToServers });
			return serverIdMapping;
		} catch {
			return new Map();
		} finally {
			store.dispose();
		}
	}

	private async sync(): Promise<void> {
		try {
			const collections = new Map<string, [IMcpConfigPath | undefined, McpServerDefinition[]]>();
			const mcpConfigPathInfos = new ResourceMap<Promise<IMcpConfigPath & { locations: Map<string, Location> } | undefined>>();
			for (const server of this.mcpWorkbenchService.getEnabledLocalMcpServers()) {
				let mcpConfigPathPromise = mcpConfigPathInfos.get(server.mcpResource);
				if (!mcpConfigPathPromise) {
					mcpConfigPathPromise = (async (local: IWorkbenchLocalMcpServer) => {
						const mcpConfigPath = this.mcpWorkbenchService.getMcpConfigPath(local);
						const locations = mcpConfigPath?.uri ? await this.getServerIdMapping(mcpConfigPath?.uri, mcpConfigPath.section ? [...mcpConfigPath.section, 'servers'] : ['servers']) : new Map();
						return mcpConfigPath ? { ...mcpConfigPath, locations } : undefined;
					})(server);
					mcpConfigPathInfos.set(server.mcpResource, mcpConfigPathPromise);
				}

				const config = server.config;
				const mcpConfigPath = await mcpConfigPathPromise;
				const collectionId = `mcp.config.${mcpConfigPath ? mcpConfigPath.id : 'unknown'}`;

				let definitions = collections.get(collectionId);
				if (!definitions) {
					definitions = [mcpConfigPath, []];
					collections.set(collectionId, definitions);
				}

				const launch: McpServerLaunch = config.type === 'http' ? {
					type: McpServerTransportType.HTTP,
					uri: URI.parse(config.url),
					headers: Object.entries(config.headers || {}),
				} : {
					type: McpServerTransportType.Stdio,
					command: config.command,
					args: config.args || [],
					env: config.env || {},
					envFile: config.envFile,
					cwd: config.cwd,
				};

				definitions[1].push({
					id: `${collectionId}.${server.name}`,
					label: server.name,
					launch,
					cacheNonce: await McpServerLaunch.hash(launch),
					roots: mcpConfigPath?.workspaceFolder ? [mcpConfigPath.workspaceFolder.uri] : undefined,
					variableReplacement: {
						folder: mcpConfigPath?.workspaceFolder,
						section: mcpConfigurationSection,
						target: mcpConfigPath?.target ?? ConfigurationTarget.USER,
					},
					devMode: config.dev,
					presentation: {
						order: mcpConfigPath?.order,
						origin: mcpConfigPath?.locations.get(server.name)
					}
				});
			}

			for (const [id] of this.collections) {
				if (!collections.has(id)) {
					this.collections.deleteAndDispose(id);
				}
			}

			for (const [id, [mcpConfigPath, serverDefinitions]] of collections) {
				const newServerDefinitions = observableValue<readonly McpServerDefinition[]>(this, serverDefinitions);
				const newCollection: McpCollectionDefinition = {
					id,
					label: mcpConfigPath?.label ?? '',
					presentation: {
						order: serverDefinitions[0]?.presentation?.order,
						origin: mcpConfigPath?.uri,
					},
					remoteAuthority: mcpConfigPath?.remoteAuthority ?? null,
					serverDefinitions: newServerDefinitions,
					trustBehavior: McpServerTrust.Kind.Trusted,
					configTarget: mcpConfigPath?.target ?? ConfigurationTarget.USER,
					scope: mcpConfigPath?.scope ?? StorageScope.PROFILE,
				};
				const existingCollection = this.collections.get(id);

				const collectionDefinitionsChanged = existingCollection ? !McpCollectionDefinition.equals(existingCollection.definition, newCollection) : true;
				if (!collectionDefinitionsChanged) {
					const serverDefinitionsChanged = existingCollection ? !equals(existingCollection.definition.serverDefinitions.get(), newCollection.serverDefinitions.get(), McpServerDefinition.equals) : true;
					if (serverDefinitionsChanged) {
						existingCollection?.serverDefinitions.set(serverDefinitions, undefined);
					}
					continue;
				}

				this.collections.deleteAndDispose(id);
				const disposable = this.mcpRegistry.registerCollection(newCollection);
				this.collections.set(id, {
					definition: newCollection,
					serverDefinitions: newServerDefinitions,
					dispose: () => disposable.dispose()
				});
			}

		} catch (error) {
			this.logService.error(error);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/common/discovery/mcpDiscovery.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/common/discovery/mcpDiscovery.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDisposable } from '../../../../../base/common/lifecycle.js';
import { SyncDescriptor0 } from '../../../../../platform/instantiation/common/descriptors.js';


export interface IMcpDiscovery extends IDisposable {
	readonly fromGallery: boolean;
	start(): void;
}

class McpDiscoveryRegistry {
	private readonly _discovery: SyncDescriptor0<IMcpDiscovery>[] = [];

	register(discovery: SyncDescriptor0<IMcpDiscovery>): void {
		this._discovery.push(discovery);
	}

	getAll(): readonly SyncDescriptor0<IMcpDiscovery>[] {
		return this._discovery;
	}
}

export const mcpDiscoveryRegistry = new McpDiscoveryRegistry();
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/common/discovery/nativeMcpDiscoveryAbstract.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/common/discovery/nativeMcpDiscoveryAbstract.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { RunOnceScheduler } from '../../../../../base/common/async.js';
import { VSBuffer } from '../../../../../base/common/buffer.js';
import { Disposable, DisposableStore, IDisposable, MutableDisposable } from '../../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../../base/common/network.js';
import { autorun, IObservable, IReader, ISettableObservable, observableValue } from '../../../../../base/common/observable.js';
import { URI } from '../../../../../base/common/uri.js';
import { localize } from '../../../../../nls.js';
import { ConfigurationTarget, IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IFileService } from '../../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { ILabelService } from '../../../../../platform/label/common/label.js';
import { INativeMcpDiscoveryData } from '../../../../../platform/mcp/common/nativeMcpDiscoveryHelper.js';
import { observableConfigValue } from '../../../../../platform/observable/common/platformObservableUtils.js';
import { StorageScope } from '../../../../../platform/storage/common/storage.js';
import { Dto } from '../../../../services/extensions/common/proxyIdentifier.js';
import { DiscoverySource, discoverySourceLabel, mcpDiscoverySection } from '../mcpConfiguration.js';
import { IMcpRegistry } from '../mcpRegistryTypes.js';
import { McpCollectionDefinition, McpCollectionSortOrder, McpServerDefinition, McpServerTrust } from '../mcpTypes.js';
import { IMcpDiscovery } from './mcpDiscovery.js';
import { ClaudeDesktopMpcDiscoveryAdapter, CursorDesktopMpcDiscoveryAdapter, NativeMpcDiscoveryAdapter, WindsurfDesktopMpcDiscoveryAdapter } from './nativeMcpDiscoveryAdapters.js';

export type WritableMcpCollectionDefinition = McpCollectionDefinition & { serverDefinitions: ISettableObservable<readonly McpServerDefinition[]> };

export abstract class FilesystemMcpDiscovery extends Disposable implements IMcpDiscovery {

	readonly fromGallery: boolean = false;

	protected readonly _fsDiscoveryEnabled: IObservable<{ [K in DiscoverySource]: boolean } | undefined>;

	constructor(
		@IConfigurationService configurationService: IConfigurationService,
		@IFileService private readonly _fileService: IFileService,
		@IMcpRegistry private readonly _mcpRegistry: IMcpRegistry,
	) {
		super();

		this._fsDiscoveryEnabled = observableConfigValue(mcpDiscoverySection, undefined, configurationService);
	}

	protected _isDiscoveryEnabled(reader: IReader, discoverySource: DiscoverySource): boolean {
		const fsDiscovery = this._fsDiscoveryEnabled.read(reader);
		if (typeof fsDiscovery === 'boolean') {
			return fsDiscovery; // old commands
		}
		if (discoverySource && fsDiscovery?.[discoverySource] === true) {
			return true;
		}
		return false;
	}

	protected watchFile(
		file: URI,
		collection: WritableMcpCollectionDefinition,
		discoverySource: DiscoverySource,
		adaptFile: (contents: VSBuffer) => Promise<McpServerDefinition[] | undefined>,
	): IDisposable {
		const store = new DisposableStore();
		const collectionRegistration = store.add(new MutableDisposable());
		const updateFile = async () => {
			let definitions: McpServerDefinition[] = [];
			try {
				const contents = await this._fileService.readFile(file);
				definitions = await adaptFile(contents.value) || [];
			} catch {
				// ignored
			}
			if (!definitions.length) {
				collectionRegistration.clear();
			} else {
				collection.serverDefinitions.set(definitions, undefined);
				if (!collectionRegistration.value) {
					collectionRegistration.value = this._mcpRegistry.registerCollection(collection);
				}
			}
		};

		store.add(autorun(reader => {
			if (!this._isDiscoveryEnabled(reader, discoverySource)) {
				collectionRegistration.clear();
				return;
			}

			const throttler = reader.store.add(new RunOnceScheduler(updateFile, 500));
			const watcher = reader.store.add(this._fileService.createWatcher(file, { recursive: false, excludes: [] }));
			reader.store.add(watcher.onDidChange(() => throttler.schedule()));
			updateFile();
		}));

		return store;
	}

	public abstract start(): void;
}

/**
 * Base class that discovers MCP servers on a filesystem, outside of the ones
 * defined in VS Code settings.
 */
export abstract class NativeFilesystemMcpDiscovery extends FilesystemMcpDiscovery implements IMcpDiscovery {
	private readonly adapters: readonly NativeMpcDiscoveryAdapter[];
	private suffix = '';

	constructor(
		remoteAuthority: string | null,
		@ILabelService labelService: ILabelService,
		@IFileService fileService: IFileService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IMcpRegistry mcpRegistry: IMcpRegistry,
		@IConfigurationService configurationService: IConfigurationService,
	) {
		super(configurationService, fileService, mcpRegistry);
		if (remoteAuthority) {
			this.suffix = ' ' + localize('onRemoteLabel', ' on {0}', labelService.getHostLabel(Schemas.vscodeRemote, remoteAuthority));
		}

		this.adapters = [
			instantiationService.createInstance(ClaudeDesktopMpcDiscoveryAdapter, remoteAuthority),
			instantiationService.createInstance(CursorDesktopMpcDiscoveryAdapter, remoteAuthority),
			instantiationService.createInstance(WindsurfDesktopMpcDiscoveryAdapter, remoteAuthority),
		];
	}

	protected setDetails(detailsDto: Dto<INativeMcpDiscoveryData> | undefined) {
		if (!detailsDto) {
			return;
		}

		const details: INativeMcpDiscoveryData = {
			...detailsDto,
			homedir: URI.revive(detailsDto.homedir),
			xdgHome: detailsDto.xdgHome ? URI.revive(detailsDto.xdgHome) : undefined,
			winAppData: detailsDto.winAppData ? URI.revive(detailsDto.winAppData) : undefined,
		};

		for (const adapter of this.adapters) {
			const file = adapter.getFilePath(details);
			if (!file) {
				continue;
			}

			const collection: WritableMcpCollectionDefinition = {
				id: adapter.id,
				label: discoverySourceLabel[adapter.discoverySource] + this.suffix,
				remoteAuthority: adapter.remoteAuthority,
				configTarget: ConfigurationTarget.USER,
				scope: StorageScope.PROFILE,
				trustBehavior: McpServerTrust.Kind.TrustedOnNonce,
				serverDefinitions: observableValue<readonly McpServerDefinition[]>(this, []),
				presentation: {
					origin: file,
					order: adapter.order + (adapter.remoteAuthority ? McpCollectionSortOrder.RemoteBoost : 0),
				},
			};

			this._register(this.watchFile(file, collection, adapter.discoverySource, contents => adapter.adaptFile(contents, details)));
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/common/discovery/nativeMcpDiscoveryAdapters.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/common/discovery/nativeMcpDiscoveryAdapters.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../../../../base/common/buffer.js';
import { Platform } from '../../../../../base/common/platform.js';
import { Mutable } from '../../../../../base/common/types.js';
import { URI } from '../../../../../base/common/uri.js';
import { INativeMcpDiscoveryData } from '../../../../../platform/mcp/common/nativeMcpDiscoveryHelper.js';
import { DiscoverySource } from '../mcpConfiguration.js';
import { McpCollectionSortOrder, McpServerDefinition, McpServerLaunch, McpServerTransportType } from '../mcpTypes.js';

export interface NativeMpcDiscoveryAdapter {
	readonly remoteAuthority: string | null;
	readonly id: string;
	readonly order: number;
	readonly discoverySource: DiscoverySource;

	getFilePath(details: INativeMcpDiscoveryData): URI | undefined;
	adaptFile(contents: VSBuffer, details: INativeMcpDiscoveryData): Promise<McpServerDefinition[] | undefined>;
}

export async function claudeConfigToServerDefinition(idPrefix: string, contents: VSBuffer, cwd?: URI) {
	let parsed: {
		mcpServers: Record<string, {
			command: string;
			args?: string[];
			env?: Record<string, string>;
			url?: string;
		}>;
	};

	try {
		parsed = JSON.parse(contents.toString());
	} catch {
		return;
	}

	return Promise.all(Object.entries(parsed.mcpServers).map(async ([name, server]): Promise<Mutable<McpServerDefinition>> => {
		const launch: McpServerLaunch = server.url ? {
			type: McpServerTransportType.HTTP,
			uri: URI.parse(server.url),
			headers: [],
		} : {
			type: McpServerTransportType.Stdio,
			args: server.args || [],
			command: server.command,
			env: server.env || {},
			envFile: undefined,
			cwd: cwd?.fsPath,
		};

		return {
			id: `${idPrefix}.${name}`,
			label: name,
			launch,
			cacheNonce: await McpServerLaunch.hash(launch),
		};
	}));
}

export class ClaudeDesktopMpcDiscoveryAdapter implements NativeMpcDiscoveryAdapter {
	public id: string;
	public readonly order = McpCollectionSortOrder.Filesystem;
	public readonly discoverySource: DiscoverySource = DiscoverySource.ClaudeDesktop;

	constructor(public readonly remoteAuthority: string | null) {
		this.id = `claude-desktop.${this.remoteAuthority}`;
	}

	getFilePath({ platform, winAppData, xdgHome, homedir }: INativeMcpDiscoveryData): URI | undefined {
		if (platform === Platform.Windows) {
			const appData = winAppData || URI.joinPath(homedir, 'AppData', 'Roaming');
			return URI.joinPath(appData, 'Claude', 'claude_desktop_config.json');
		} else if (platform === Platform.Mac) {
			return URI.joinPath(homedir, 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json');
		} else {
			const configDir = xdgHome || URI.joinPath(homedir, '.config');
			return URI.joinPath(configDir, 'Claude', 'claude_desktop_config.json');
		}
	}

	adaptFile(contents: VSBuffer, { homedir }: INativeMcpDiscoveryData): Promise<McpServerDefinition[] | undefined> {
		return claudeConfigToServerDefinition(this.id, contents, homedir);
	}
}

export class WindsurfDesktopMpcDiscoveryAdapter extends ClaudeDesktopMpcDiscoveryAdapter {
	public override readonly discoverySource: DiscoverySource = DiscoverySource.Windsurf;

	constructor(remoteAuthority: string | null) {
		super(remoteAuthority);
		this.id = `windsurf.${this.remoteAuthority}`;
	}

	override getFilePath({ homedir }: INativeMcpDiscoveryData): URI | undefined {
		return URI.joinPath(homedir, '.codeium', 'windsurf', 'mcp_config.json');
	}
}

export class CursorDesktopMpcDiscoveryAdapter extends ClaudeDesktopMpcDiscoveryAdapter {
	public override readonly discoverySource: DiscoverySource = DiscoverySource.CursorGlobal;

	constructor(remoteAuthority: string | null) {
		super(remoteAuthority);
		this.id = `cursor.${this.remoteAuthority}`;
	}

	override getFilePath({ homedir }: INativeMcpDiscoveryData): URI | undefined {
		return URI.joinPath(homedir, '.cursor', 'mcp.json');
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/common/discovery/nativeMcpRemoteDiscovery.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/common/discovery/nativeMcpRemoteDiscovery.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ProxyChannel } from '../../../../../base/parts/ipc/common/ipc.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IFileService } from '../../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { ILabelService } from '../../../../../platform/label/common/label.js';
import { ILogService } from '../../../../../platform/log/common/log.js';
import { INativeMcpDiscoveryHelperService, NativeMcpDiscoveryHelperChannelName } from '../../../../../platform/mcp/common/nativeMcpDiscoveryHelper.js';
import { IRemoteAgentService } from '../../../../services/remote/common/remoteAgentService.js';
import { IMcpRegistry } from '../mcpRegistryTypes.js';
import { NativeFilesystemMcpDiscovery } from './nativeMcpDiscoveryAbstract.js';

/**
 * Discovers MCP servers on the remote filesystem, if any.
 */
export class RemoteNativeMpcDiscovery extends NativeFilesystemMcpDiscovery {
	constructor(
		@IRemoteAgentService private readonly remoteAgent: IRemoteAgentService,
		@ILogService private readonly logService: ILogService,
		@ILabelService labelService: ILabelService,
		@IFileService fileService: IFileService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IMcpRegistry mcpRegistry: IMcpRegistry,
		@IConfigurationService configurationService: IConfigurationService,
	) {
		super(remoteAgent.getConnection()?.remoteAuthority || null, labelService, fileService, instantiationService, mcpRegistry, configurationService);
	}

	public override async start() {
		const connection = this.remoteAgent.getConnection();
		if (!connection) {
			return this.setDetails(undefined);
		}

		await connection.withChannel(NativeMcpDiscoveryHelperChannelName, async channel => {
			const service = ProxyChannel.toService<INativeMcpDiscoveryHelperService>(channel);

			service.load().then(
				data => this.setDetails(data),
				err => {
					this.logService.warn('Error getting remote process MCP environment', err);
					this.setDetails(undefined);
				}
			);
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/common/discovery/workspaceMcpDiscoveryAdapter.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/common/discovery/workspaceMcpDiscoveryAdapter.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DisposableMap, IDisposable } from '../../../../../base/common/lifecycle.js';
import { observableValue } from '../../../../../base/common/observable.js';
import { joinPath } from '../../../../../base/common/resources.js';
import { URI } from '../../../../../base/common/uri.js';
import { ConfigurationTarget, IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IFileService } from '../../../../../platform/files/common/files.js';
import { StorageScope } from '../../../../../platform/storage/common/storage.js';
import { IWorkspaceContextService, IWorkspaceFolder } from '../../../../../platform/workspace/common/workspace.js';
import { IRemoteAgentService } from '../../../../services/remote/common/remoteAgentService.js';
import { DiscoverySource } from '../mcpConfiguration.js';
import { IMcpRegistry } from '../mcpRegistryTypes.js';
import { McpCollectionSortOrder, McpServerTrust } from '../mcpTypes.js';
import { IMcpDiscovery } from './mcpDiscovery.js';
import { FilesystemMcpDiscovery, WritableMcpCollectionDefinition } from './nativeMcpDiscoveryAbstract.js';
import { claudeConfigToServerDefinition } from './nativeMcpDiscoveryAdapters.js';

export class CursorWorkspaceMcpDiscoveryAdapter extends FilesystemMcpDiscovery implements IMcpDiscovery {
	private readonly _collections = this._register(new DisposableMap<string, IDisposable>());

	constructor(
		@IFileService fileService: IFileService,
		@IWorkspaceContextService private readonly _workspaceContextService: IWorkspaceContextService,
		@IMcpRegistry mcpRegistry: IMcpRegistry,
		@IConfigurationService configurationService: IConfigurationService,
		@IRemoteAgentService private readonly _remoteAgentService: IRemoteAgentService,
	) {
		super(configurationService, fileService, mcpRegistry);
	}

	start(): void {
		this._register(this._workspaceContextService.onDidChangeWorkspaceFolders(e => {
			for (const removed of e.removed) {
				this._collections.deleteAndDispose(removed.uri.toString());
			}
			for (const added of e.added) {
				this.watchFolder(added);
			}
		}));

		for (const folder of this._workspaceContextService.getWorkspace().folders) {
			this.watchFolder(folder);
		}
	}

	private watchFolder(folder: IWorkspaceFolder) {
		const configFile = joinPath(folder.uri, '.cursor', 'mcp.json');
		const collection: WritableMcpCollectionDefinition = {
			id: `cursor-workspace.${folder.index}`,
			label: `${folder.name}/.cursor/mcp.json`,
			remoteAuthority: this._remoteAgentService.getConnection()?.remoteAuthority || null,
			scope: StorageScope.WORKSPACE,
			trustBehavior: McpServerTrust.Kind.TrustedOnNonce,
			serverDefinitions: observableValue(this, []),
			configTarget: ConfigurationTarget.WORKSPACE_FOLDER,
			presentation: {
				origin: configFile,
				order: McpCollectionSortOrder.WorkspaceFolder + 1,
			},
		};

		this._collections.set(folder.uri.toString(), this.watchFile(
			URI.joinPath(folder.uri, '.cursor', 'mcp.json'),
			collection,
			DiscoverySource.CursorWorkspace,
			async contents => {
				const defs = await claudeConfigToServerDefinition(collection.id, contents, folder.uri);
				defs?.forEach(d => d.roots = [folder.uri]);
				return defs;
			}
		));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/electron-browser/mcp.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/electron-browser/mcp.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { mcpDiscoveryRegistry } from '../common/discovery/mcpDiscovery.js';
import { IMcpDevModeDebugging } from '../common/mcpDevMode.js';
import { McpDevModeDebuggingNode } from './mcpDevModeDebuggingNode.js';
import { NativeMcpDiscovery } from './nativeMpcDiscovery.js';

mcpDiscoveryRegistry.register(new SyncDescriptor(NativeMcpDiscovery));
registerSingleton(IMcpDevModeDebugging, McpDevModeDebuggingNode, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/electron-browser/mcpDevModeDebuggingNode.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/electron-browser/mcpDevModeDebuggingNode.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { timeout } from '../../../../base/common/async.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { INativeHostService } from '../../../../platform/native/common/native.js';
import { IDebugService } from '../../debug/common/debug.js';
import { McpDevModeDebugging } from '../common/mcpDevMode.js';

export class McpDevModeDebuggingNode extends McpDevModeDebugging {
	constructor(
		@IDebugService debugService: IDebugService,
		@ICommandService commandService: ICommandService,
		@INativeHostService private readonly _nativeHostService: INativeHostService,
	) {
		super(debugService, commandService);
	}

	protected override async ensureListeningOnPort(port: number): Promise<void> {
		const deadline = Date.now() + 30_000;
		while (await this._nativeHostService.isPortFree(port) && Date.now() < deadline) {
			await timeout(50);
		}
	}

	protected override getDebugPort() {
		return this._nativeHostService.findFreePort(5000, 10 /* try 10 ports */, 5000 /* try up to 5 seconds */, 2048 /* skip 2048 ports between attempts */);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/electron-browser/nativeMpcDiscovery.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/electron-browser/nativeMpcDiscovery.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ProxyChannel } from '../../../../base/parts/ipc/common/ipc.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IMainProcessService } from '../../../../platform/ipc/common/mainProcessService.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { INativeMcpDiscoveryHelperService, NativeMcpDiscoveryHelperChannelName } from '../../../../platform/mcp/common/nativeMcpDiscoveryHelper.js';
import { NativeFilesystemMcpDiscovery } from '../common/discovery/nativeMcpDiscoveryAbstract.js';
import { IMcpRegistry } from '../common/mcpRegistryTypes.js';

export class NativeMcpDiscovery extends NativeFilesystemMcpDiscovery {
	constructor(
		@IMainProcessService private readonly mainProcess: IMainProcessService,
		@ILogService private readonly logService: ILogService,
		@ILabelService labelService: ILabelService,
		@IFileService fileService: IFileService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IMcpRegistry mcpRegistry: IMcpRegistry,
		@IConfigurationService configurationService: IConfigurationService,
	) {
		super(null, labelService, fileService, instantiationService, mcpRegistry, configurationService);
	}

	public override start(): void {
		const service = ProxyChannel.toService<INativeMcpDiscoveryHelperService>(
			this.mainProcess.getChannel(NativeMcpDiscoveryHelperChannelName));

		service.load().then(
			data => this.setDetails(data),
			err => {
				this.logService.warn('Error getting main process MCP environment', err);
				this.setDetails(undefined);
			}
		);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/node/mcpStdioStateHandler.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/node/mcpStdioStateHandler.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ChildProcessWithoutNullStreams } from 'child_process';
import { TimeoutTimer } from '../../../../base/common/async.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { killTree } from '../../../../base/node/processes.js';
import { isWindows } from '../../../../base/common/platform.js';

const enum McpProcessState {
	Running,
	StdinEnded,
	KilledPolite,
	KilledForceful,
}

/**
 * Manages graceful shutdown of MCP stdio connections following the MCP specification.
 *
 * Per spec, shutdown should:
 * 1. Close the input stream to the child process
 * 2. Wait for the server to exit, or send SIGTERM if it doesn't exit within 10 seconds
 * 3. Send SIGKILL if the server doesn't exit within 10 seconds after SIGTERM
 * 4. Allow forceful killing if called twice
 */
export class McpStdioStateHandler implements IDisposable {
	private static readonly GRACE_TIME_MS = 10_000;

	private _procState = McpProcessState.Running;
	private _nextTimeout?: IDisposable;

	public get stopped() {
		return this._procState !== McpProcessState.Running;
	}

	constructor(
		private readonly _child: ChildProcessWithoutNullStreams,
		private readonly _graceTimeMs: number = McpStdioStateHandler.GRACE_TIME_MS
	) { }

	/**
	 * Initiates graceful shutdown. If called while shutdown is already in progress,
	 * forces immediate termination.
	 */
	public stop(): void {
		if (this._procState === McpProcessState.Running) {
			let graceTime = this._graceTimeMs;
			try {
				this._child.stdin.end();
			} catch (error) {
				// If stdin.end() fails, continue with termination sequence
				// This can happen if the stream is already in an error state
				graceTime = 1;
			}
			this._procState = McpProcessState.StdinEnded;
			this._nextTimeout = new TimeoutTimer(() => this.killPolite(), graceTime);
		} else {
			this._nextTimeout?.dispose();
			this.killForceful();
		}
	}

	private async killPolite() {
		this._procState = McpProcessState.KilledPolite;
		this._nextTimeout = new TimeoutTimer(() => this.killForceful(), this._graceTimeMs);

		if (this._child.pid) {
			if (!isWindows) {
				await killTree(this._child.pid, false).catch(() => {
					this._child.kill('SIGTERM');
				});
			}
		} else {
			this._child.kill('SIGTERM');
		}
	}

	private async killForceful() {
		this._procState = McpProcessState.KilledForceful;

		if (this._child.pid) {
			await killTree(this._child.pid, true).catch(() => {
				this._child.kill('SIGKILL');
			});
		} else {
			this._child.kill();
		}
	}

	public write(message: string): void {
		if (!this.stopped) {
			this._child.stdin.write(message + '\n');
		}
	}

	public dispose() {
		this._nextTimeout?.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/test/common/mcpIcons.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/test/common/mcpIcons.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { URI } from '../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { NullLogger } from '../../../../../platform/log/common/log.js';
import { McpIcons, parseAndValidateMcpIcon } from '../../common/mcpIcons.js';
import { McpServerTransportHTTP, McpServerTransportStdio, McpServerTransportType } from '../../common/mcpTypes.js';

const createHttpLaunch = (url: string): McpServerTransportHTTP => ({
	type: McpServerTransportType.HTTP,
	uri: URI.parse(url),
	headers: []
});

const createStdioLaunch = (): McpServerTransportStdio => ({
	type: McpServerTransportType.Stdio,
	cwd: undefined,
	command: 'cmd',
	args: [],
	env: {},
	envFile: undefined
});

suite('MCP Icons', () => {
	suite('parseAndValidateMcpIcon', () => {
		ensureNoDisposablesAreLeakedInTestSuite();

		test('includes supported icons and sorts sizes ascending', () => {
			const logger = new NullLogger();
			const launch = createHttpLaunch('https://example.com');

			const result = parseAndValidateMcpIcon({
				icons: [
					{ src: 'ftp://example.com/ignored.png', mimeType: 'image/png' },
					{ src: 'data:image/png;base64,AAA', mimeType: 'image/png', sizes: ['64x64', '16x16'] },
					{ src: 'https://example.com/icon.png', mimeType: 'image/png', sizes: ['128x128'] }
				]
			}, launch, logger);

			assert.strictEqual(result.length, 2);
			assert.strictEqual((result[0].src as URI).toString(true), 'data:image/png;base64,AAA');
			assert.deepStrictEqual(result[0].sizes.map(s => s.width), [16, 64]);
			assert.strictEqual(result[1].src.toString(), 'https://example.com/icon.png');
			assert.deepStrictEqual(result[1].sizes, [{ width: 128, height: 128 }]);
		});

		test('requires http transport with matching authority for remote icons', () => {
			const logger = new NullLogger();
			const httpLaunch = createHttpLaunch('https://example.com');
			const stdioLaunch = createStdioLaunch();

			const icons = {
				icons: [
					{ src: 'https://example.com/icon.png', mimeType: 'image/png', sizes: ['64x64'] },
					{ src: 'https://other.com/icon.png', mimeType: 'image/png', sizes: ['64x64'] }
				]
			};

			const httpResult = parseAndValidateMcpIcon(icons, httpLaunch, logger);
			assert.deepStrictEqual(httpResult.map(icon => icon.src.toString()), ['https://example.com/icon.png']);

			const stdioResult = parseAndValidateMcpIcon(icons, stdioLaunch, logger);
			assert.strictEqual(stdioResult.length, 0);
		});

		test('accepts file icons only for stdio transport', () => {
			const logger = new NullLogger();
			const stdioLaunch = createStdioLaunch();
			const httpLaunch = createHttpLaunch('https://example.com');

			const icons = {
				icons: [
					{ src: 'file:///tmp/icon.png', mimeType: 'image/png', sizes: ['32x32'] }
				]
			};

			const stdioResult = parseAndValidateMcpIcon(icons, stdioLaunch, logger);
			assert.strictEqual(stdioResult.length, 1);
			assert.strictEqual(stdioResult[0].src.scheme, 'file');

			const httpResult = parseAndValidateMcpIcon(icons, httpLaunch, logger);
			assert.strictEqual(httpResult.length, 0);
		});
	});

	suite('McpIcons', () => {
		ensureNoDisposablesAreLeakedInTestSuite();

		test('getUrl returns undefined when no icons are available', () => {
			const icons = McpIcons.fromParsed(undefined);
			assert.strictEqual(icons.getUrl(16), undefined);
		});

		test('getUrl prefers theme-specific icons and keeps light fallback', () => {
			const logger = new NullLogger();
			const launch = createHttpLaunch('https://example.com');
			const parsed = parseAndValidateMcpIcon({
				icons: [
					{ src: 'https://example.com/dark.png', mimeType: 'image/png', sizes: ['16x16', '48x48'], theme: 'dark' },
					{ src: 'https://example.com/any.png', mimeType: 'image/png', sizes: ['24x24'] },
					{ src: 'https://example.com/light.png', mimeType: 'image/png', sizes: ['64x64'], theme: 'light' }
				]
			}, launch, logger);
			const icons = McpIcons.fromParsed(parsed);
			const result = icons.getUrl(32);

			assert.ok(result);
			assert.strictEqual(result!.dark.toString(), 'https://example.com/dark.png');
			assert.strictEqual(result!.light?.toString(), 'https://example.com/light.png');
		});

		test('getUrl falls back to any-theme icons when no exact size exists', () => {
			const logger = new NullLogger();
			const launch = createHttpLaunch('https://example.com');
			const parsed = parseAndValidateMcpIcon({
				icons: [
					{ src: 'https://example.com/dark.png', mimeType: 'image/png', sizes: ['16x16'], theme: 'dark' },
					{ src: 'https://example.com/any.png', mimeType: 'image/png', sizes: ['64x64'] }
				]
			}, launch, logger);
			const icons = McpIcons.fromParsed(parsed);
			const result = icons.getUrl(60);

			assert.ok(result);
			assert.strictEqual(result!.dark.toString(), 'https://example.com/any.png');
			assert.strictEqual(result!.light, undefined);
		});

		test('getUrl reuses light icons when dark theme assets are missing', () => {
			const logger = new NullLogger();
			const launch = createHttpLaunch('https://example.com');
			const parsed = parseAndValidateMcpIcon({
				icons: [
					{ src: 'https://example.com/light.png', mimeType: 'image/png', sizes: ['32x32'], theme: 'light' }
				]
			}, launch, logger);
			const icons = McpIcons.fromParsed(parsed);
			const result = icons.getUrl(16);

			assert.ok(result);
			assert.strictEqual(result!.dark.toString(), 'https://example.com/light.png');
			assert.strictEqual(result!.light?.toString(), 'https://example.com/light.png');
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/test/common/mcpRegistry.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/test/common/mcpRegistry.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import * as sinon from 'sinon';
import { timeout } from '../../../../../base/common/async.js';
import { ISettableObservable, observableValue } from '../../../../../base/common/observable.js';
import { upcast } from '../../../../../base/common/types.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { ConfigurationTarget, IConfigurationChangeEvent, IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { IDialogService, IPrompt } from '../../../../../platform/dialogs/common/dialogs.js';
import { ServiceCollection } from '../../../../../platform/instantiation/common/serviceCollection.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { ILogger, ILoggerService, ILogService, NullLogger, NullLogService } from '../../../../../platform/log/common/log.js';
import { mcpAccessConfig, McpAccessValue } from '../../../../../platform/mcp/common/mcpManagement.js';
import { IProductService } from '../../../../../platform/product/common/productService.js';
import { ISecretStorageService } from '../../../../../platform/secrets/common/secrets.js';
import { TestSecretStorageService } from '../../../../../platform/secrets/test/common/testSecretStorageService.js';
import { IStorageService, StorageScope } from '../../../../../platform/storage/common/storage.js';
import { IWorkspaceFolderData } from '../../../../../platform/workspace/common/workspace.js';
import { IConfigurationResolverService } from '../../../../services/configurationResolver/common/configurationResolver.js';
import { ConfigurationResolverExpression, Replacement } from '../../../../services/configurationResolver/common/configurationResolverExpression.js';
import { IOutputService } from '../../../../services/output/common/output.js';
import { TestLoggerService, TestStorageService } from '../../../../test/common/workbenchTestServices.js';
import { McpRegistry } from '../../common/mcpRegistry.js';
import { IMcpHostDelegate, IMcpMessageTransport } from '../../common/mcpRegistryTypes.js';
import { McpServerConnection } from '../../common/mcpServerConnection.js';
import { McpTaskManager } from '../../common/mcpTaskManager.js';
import { LazyCollectionState, McpCollectionDefinition, McpServerDefinition, McpServerLaunch, McpServerTransportStdio, McpServerTransportType, McpServerTrust, McpStartServerInteraction } from '../../common/mcpTypes.js';
import { TestMcpMessageTransport } from './mcpRegistryTypes.js';

class TestConfigurationResolverService {
	declare readonly _serviceBrand: undefined;

	private interactiveCounter = 0;

	// Used to simulate stored/resolved variables
	private readonly resolvedVariables = new Map<string, string>();

	constructor() {
		// Add some test variables
		this.resolvedVariables.set('workspaceFolder', '/test/workspace');
		this.resolvedVariables.set('fileBasename', 'test.txt');
	}

	resolveAsync<T>(folder: IWorkspaceFolderData | undefined, value: T): Promise<unknown> {
		const parsed = ConfigurationResolverExpression.parse(value);
		for (const variable of parsed.unresolved()) {
			const resolved = this.resolvedVariables.get(variable.inner);
			if (resolved) {
				parsed.resolve(variable, resolved);
			}
		}

		return Promise.resolve(parsed.toObject());
	}

	resolveWithInteraction(folder: IWorkspaceFolderData | undefined, config: unknown, section?: string, variables?: Record<string, string>, target?: ConfigurationTarget): Promise<Map<string, string> | undefined> {
		const parsed = ConfigurationResolverExpression.parse(config);
		// For testing, we simulate interaction by returning a map with some variables
		const result = new Map<string, string>();
		result.set('input:testInteractive', `interactiveValue${this.interactiveCounter++}`);
		result.set('command:testCommand', `commandOutput${this.interactiveCounter++}}`);

		// If variables are provided, include those too
		for (const [k, v] of result.entries()) {
			const replacement: Replacement = {
				id: '${' + k + '}',
				inner: k,
				name: k.split(':')[0] || k,
				arg: k.split(':')[1]
			};
			parsed.resolve(replacement, v);
		}

		return Promise.resolve(result);
	}
}

class TestMcpHostDelegate implements IMcpHostDelegate {
	priority = 0;

	substituteVariables(serverDefinition: McpServerDefinition, launch: McpServerLaunch): Promise<McpServerLaunch> {
		return Promise.resolve(launch);
	}

	canStart(): boolean {
		return true;
	}

	start(): IMcpMessageTransport {
		return new TestMcpMessageTransport();
	}

	waitForInitialProviderPromises(): Promise<void> {
		return Promise.resolve();
	}
}

class TestDialogService {
	declare readonly _serviceBrand: undefined;

	private _promptResult: boolean | undefined = true;
	private _promptSpy: sinon.SinonStub;

	constructor() {
		this._promptSpy = sinon.stub();
		this._promptSpy.callsFake(() => {
			return Promise.resolve({ result: this._promptResult });
		});
	}

	setPromptResult(result: boolean | undefined): void {
		this._promptResult = result;
	}

	get promptSpy(): sinon.SinonStub {
		return this._promptSpy;
	}

	prompt<T>(options: IPrompt<T>): Promise<{ result?: T }> {
		return this._promptSpy(options);
	}
}

class TestMcpRegistry extends McpRegistry {
	public nextDefinitionIdsToTrust: string[] | undefined;

	protected override _promptForTrustOpenDialog(): Promise<string[] | undefined> {
		return Promise.resolve(this.nextDefinitionIdsToTrust);
	}
}

suite('Workbench - MCP - Registry', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	let registry: TestMcpRegistry;
	let testStorageService: TestStorageService;
	let testConfigResolverService: TestConfigurationResolverService;
	let testDialogService: TestDialogService;
	let testCollection: McpCollectionDefinition & { serverDefinitions: ISettableObservable<McpServerDefinition[]> };
	let baseDefinition: McpServerDefinition;
	let configurationService: TestConfigurationService;
	let logger: ILogger;
	let trustNonceBearer: { trustedAtNonce: string | undefined };
	let taskManager: McpTaskManager;

	setup(() => {
		testConfigResolverService = new TestConfigurationResolverService();
		testStorageService = store.add(new TestStorageService());
		testDialogService = new TestDialogService();
		configurationService = new TestConfigurationService({ [mcpAccessConfig]: McpAccessValue.All });
		trustNonceBearer = { trustedAtNonce: undefined };

		const services = new ServiceCollection(
			[IConfigurationService, configurationService],
			[IConfigurationResolverService, testConfigResolverService],
			[IStorageService, testStorageService],
			[ISecretStorageService, new TestSecretStorageService()],
			[ILoggerService, store.add(new TestLoggerService())],
			[ILogService, store.add(new NullLogService())],
			[IOutputService, upcast({ showChannel: () => { } })],
			[IDialogService, testDialogService],
			[IProductService, {}],
		);

		logger = new NullLogger();
		taskManager = store.add(new McpTaskManager());

		const instaService = store.add(new TestInstantiationService(services));
		registry = store.add(instaService.createInstance(TestMcpRegistry));

		// Create test collection that can be reused
		testCollection = {
			id: 'test-collection',
			label: 'Test Collection',
			remoteAuthority: null,
			serverDefinitions: observableValue('serverDefs', []),
			trustBehavior: McpServerTrust.Kind.Trusted,
			scope: StorageScope.APPLICATION,
			configTarget: ConfigurationTarget.USER,
		};

		// Create base definition that can be reused
		baseDefinition = {
			id: 'test-server',
			label: 'Test Server',
			cacheNonce: 'a',
			launch: {
				type: McpServerTransportType.Stdio,
				command: 'test-command',
				args: [],
				env: {},
				envFile: undefined,
				cwd: '/test',
			}
		};
	});

	test('registerCollection adds collection to registry', () => {
		const disposable = registry.registerCollection(testCollection);
		store.add(disposable);

		assert.strictEqual(registry.collections.get().length, 1);
		assert.strictEqual(registry.collections.get()[0], testCollection);

		disposable.dispose();
		assert.strictEqual(registry.collections.get().length, 0);
	});

	test('collections are not visible when not enabled', () => {
		const disposable = registry.registerCollection(testCollection);
		store.add(disposable);

		assert.strictEqual(registry.collections.get().length, 1);

		configurationService.setUserConfiguration(mcpAccessConfig, McpAccessValue.None);
		configurationService.onDidChangeConfigurationEmitter.fire({
			affectsConfiguration: () => true,
			affectedKeys: new Set([mcpAccessConfig]),
			change: { keys: [mcpAccessConfig], overrides: [] },
			source: ConfigurationTarget.USER
		} as IConfigurationChangeEvent); assert.strictEqual(registry.collections.get().length, 0);

		configurationService.setUserConfiguration(mcpAccessConfig, McpAccessValue.All);
		configurationService.onDidChangeConfigurationEmitter.fire({
			affectsConfiguration: () => true,
			affectedKeys: new Set([mcpAccessConfig]),
			change: { keys: [mcpAccessConfig], overrides: [] },
			source: ConfigurationTarget.USER
		} as IConfigurationChangeEvent);
	});

	test('registerDelegate adds delegate to registry', () => {
		const delegate = new TestMcpHostDelegate();
		const disposable = registry.registerDelegate(delegate);
		store.add(disposable);

		assert.strictEqual(registry.delegates.get().length, 1);
		assert.strictEqual(registry.delegates.get()[0], delegate);

		disposable.dispose();
		assert.strictEqual(registry.delegates.get().length, 0);
	});

	test('resolveConnection creates connection with resolved variables and memorizes them until cleared', async () => {
		const definition: McpServerDefinition = {
			...baseDefinition,
			launch: {
				type: McpServerTransportType.Stdio,
				command: '${workspaceFolder}/cmd',
				args: ['--file', '${fileBasename}'],
				env: {
					PATH: '${input:testInteractive}'
				},
				envFile: undefined,
				cwd: '/test',
			},
			variableReplacement: {
				section: 'mcp',
				target: ConfigurationTarget.WORKSPACE,
			}
		};

		const delegate = new TestMcpHostDelegate();
		store.add(registry.registerDelegate(delegate));
		testCollection.serverDefinitions.set([definition], undefined);
		store.add(registry.registerCollection(testCollection));

		const connection = await registry.resolveConnection({ collectionRef: testCollection, definitionRef: definition, logger, trustNonceBearer, taskManager }) as McpServerConnection;

		assert.ok(connection);
		assert.strictEqual(connection.definition, definition);
		assert.strictEqual((connection.launchDefinition as unknown as { command: string }).command, '/test/workspace/cmd');
		assert.strictEqual((connection.launchDefinition as unknown as { env: { PATH: string } }).env.PATH, 'interactiveValue0');
		connection.dispose();

		const connection2 = await registry.resolveConnection({ collectionRef: testCollection, definitionRef: definition, logger, trustNonceBearer, taskManager }) as McpServerConnection;

		assert.ok(connection2);
		assert.strictEqual((connection2.launchDefinition as unknown as { env: { PATH: string } }).env.PATH, 'interactiveValue0');
		connection2.dispose();

		registry.clearSavedInputs(StorageScope.WORKSPACE);

		const connection3 = await registry.resolveConnection({ collectionRef: testCollection, definitionRef: definition, logger, trustNonceBearer, taskManager }) as McpServerConnection;

		assert.ok(connection3);
		assert.strictEqual((connection3.launchDefinition as unknown as { env: { PATH: string } }).env.PATH, 'interactiveValue4');
		connection3.dispose();
	});

	test('resolveConnection uses user-provided launch configuration', async () => {
		// Create a collection with custom launch resolver
		const customCollection: McpCollectionDefinition = {
			...testCollection,
			resolveServerLanch: async (def) => {
				return {
					...(def.launch as McpServerTransportStdio),
					env: { CUSTOM_ENV: 'value' },
				};
			}
		};

		// Create a definition with variable replacement
		const definition: McpServerDefinition = {
			...baseDefinition,
			variableReplacement: {
				section: 'mcp',
				target: ConfigurationTarget.WORKSPACE,
			}
		};

		const delegate = new TestMcpHostDelegate();
		store.add(registry.registerDelegate(delegate));
		testCollection.serverDefinitions.set([definition], undefined);
		store.add(registry.registerCollection(customCollection));

		// Resolve connection should use the custom launch configuration
		const connection = await registry.resolveConnection({
			collectionRef: customCollection,
			definitionRef: definition,
			logger,
			trustNonceBearer,
			taskManager,
		}) as McpServerConnection;

		assert.ok(connection);

		// Verify the launch configuration passed to _replaceVariablesInLaunch was the custom one
		assert.deepStrictEqual((connection.launchDefinition as McpServerTransportStdio).env, { CUSTOM_ENV: 'value' });

		connection.dispose();
	});

	suite('Lazy Collections', () => {
		let lazyCollection: McpCollectionDefinition;
		let normalCollection: McpCollectionDefinition;
		let removedCalled: boolean;

		setup(() => {
			removedCalled = false;
			lazyCollection = {
				...testCollection,
				id: 'lazy-collection',
				lazy: {
					isCached: false,
					load: () => Promise.resolve(),
					removed: () => { removedCalled = true; }
				}
			};
			normalCollection = {
				...testCollection,
				id: 'lazy-collection',
				serverDefinitions: observableValue('serverDefs', [baseDefinition])
			};
		});

		test('registers lazy collection', () => {
			const disposable = registry.registerCollection(lazyCollection);
			store.add(disposable);

			assert.strictEqual(registry.collections.get().length, 1);
			assert.strictEqual(registry.collections.get()[0], lazyCollection);
			assert.strictEqual(registry.lazyCollectionState.get().state, LazyCollectionState.HasUnknown);
		});

		test('lazy collection is replaced by normal collection', () => {
			store.add(registry.registerCollection(lazyCollection));
			store.add(registry.registerCollection(normalCollection));

			const collections = registry.collections.get();
			assert.strictEqual(collections.length, 1);
			assert.strictEqual(collections[0], normalCollection);
			assert.strictEqual(collections[0].lazy, undefined);
			assert.strictEqual(registry.lazyCollectionState.get().state, LazyCollectionState.AllKnown);
		});

		test('lazyCollectionState updates correctly during loading', async () => {
			lazyCollection = {
				...lazyCollection,
				lazy: {
					...lazyCollection.lazy!,
					load: async () => {
						await timeout(0);
						store.add(registry.registerCollection(normalCollection));
						return Promise.resolve();
					}
				}
			};

			store.add(registry.registerCollection(lazyCollection));
			assert.strictEqual(registry.lazyCollectionState.get().state, LazyCollectionState.HasUnknown);

			const loadingPromise = registry.discoverCollections();
			assert.strictEqual(registry.lazyCollectionState.get().state, LazyCollectionState.LoadingUnknown);

			await loadingPromise;

			// The collection wasn't replaced, so it should be removed
			assert.strictEqual(registry.collections.get().length, 1);
			assert.strictEqual(registry.lazyCollectionState.get().state, LazyCollectionState.AllKnown);
			assert.strictEqual(removedCalled, false);
		});

		test('removed callback is called when lazy collection is not replaced', async () => {
			store.add(registry.registerCollection(lazyCollection));
			await registry.discoverCollections();

			assert.strictEqual(removedCalled, true);
		});

		test('cached lazy collections are tracked correctly', () => {
			lazyCollection.lazy!.isCached = true;
			store.add(registry.registerCollection(lazyCollection));

			assert.strictEqual(registry.lazyCollectionState.get().state, LazyCollectionState.AllKnown);

			// Adding an uncached lazy collection changes the state
			const uncachedLazy = {
				...lazyCollection,
				id: 'uncached-lazy',
				lazy: {
					...lazyCollection.lazy!,
					isCached: false
				}
			};
			store.add(registry.registerCollection(uncachedLazy));

			assert.strictEqual(registry.lazyCollectionState.get().state, LazyCollectionState.HasUnknown);
		});
	});

	suite('Trust Flow', () => {
		/**
		 * Helper to create a test MCP collection with a specific trust behavior
		 */
		function createTestCollection(trustBehavior: McpServerTrust.Kind.Trusted | McpServerTrust.Kind.TrustedOnNonce, id = 'test-collection'): McpCollectionDefinition & { serverDefinitions: ISettableObservable<McpServerDefinition[]> } {
			return {
				id,
				label: 'Test Collection',
				remoteAuthority: null,
				serverDefinitions: observableValue('serverDefs', []),
				trustBehavior,
				scope: StorageScope.APPLICATION,
				configTarget: ConfigurationTarget.USER,
			};
		}

		/**
		 * Helper to create a test server definition with a specific cache nonce
		 */
		function createTestDefinition(id = 'test-server', cacheNonce = 'nonce-a'): McpServerDefinition {
			return {
				id,
				label: 'Test Server',
				cacheNonce,
				launch: {
					type: McpServerTransportType.Stdio,
					command: 'test-command',
					args: [],
					env: {},
					envFile: undefined,
					cwd: '/test',
				}
			};
		}

		/**
		 * Helper to set up a basic registry with delegate and collection
		 */
		function setupRegistry(trustBehavior: McpServerTrust.Kind.Trusted | McpServerTrust.Kind.TrustedOnNonce = McpServerTrust.Kind.TrustedOnNonce, cacheNonce = 'nonce-a') {
			const delegate = new TestMcpHostDelegate();
			store.add(registry.registerDelegate(delegate));

			const collection = createTestCollection(trustBehavior);
			const definition = createTestDefinition('test-server', cacheNonce);
			collection.serverDefinitions.set([definition], undefined);
			store.add(registry.registerCollection(collection));

			return { collection, definition, delegate };
		}

		test('trusted collection allows connection without prompting', async () => {
			const { collection, definition } = setupRegistry(McpServerTrust.Kind.Trusted);

			const connection = await registry.resolveConnection({
				collectionRef: collection,
				definitionRef: definition,
				logger,
				trustNonceBearer,
				taskManager,
			});

			assert.ok(connection, 'Connection should be created for trusted collection');
			assert.strictEqual(registry.nextDefinitionIdsToTrust, undefined, 'Trust dialog should not have been called');
			connection!.dispose();
		});

		test('nonce-based trust allows connection when nonce matches', async () => {
			const { collection, definition } = setupRegistry(McpServerTrust.Kind.TrustedOnNonce, 'nonce-a');
			trustNonceBearer.trustedAtNonce = 'nonce-a';

			const connection = await registry.resolveConnection({
				collectionRef: collection,
				definitionRef: definition,
				logger,
				trustNonceBearer,
				taskManager,
			});

			assert.ok(connection, 'Connection should be created when nonce matches');
			assert.strictEqual(registry.nextDefinitionIdsToTrust, undefined, 'Trust dialog should not have been called');
			connection!.dispose();
		});

		test('nonce-based trust prompts when nonce changes', async () => {
			const { collection, definition } = setupRegistry(McpServerTrust.Kind.TrustedOnNonce, 'nonce-b');
			trustNonceBearer.trustedAtNonce = 'nonce-a'; // Different nonce
			registry.nextDefinitionIdsToTrust = [definition.id]; // User trusts the server

			const connection = await registry.resolveConnection({
				collectionRef: collection,
				definitionRef: definition,
				logger,
				trustNonceBearer, taskManager,
			});

			assert.ok(connection, 'Connection should be created when user trusts');
			assert.strictEqual(trustNonceBearer.trustedAtNonce, 'nonce-b', 'Nonce should be updated');
			connection!.dispose();
		});

		test('nonce-based trust denies connection when user rejects', async () => {
			const { collection, definition } = setupRegistry(McpServerTrust.Kind.TrustedOnNonce, 'nonce-b');
			trustNonceBearer.trustedAtNonce = 'nonce-a'; // Different nonce
			registry.nextDefinitionIdsToTrust = []; // User does not trust the server

			const connection = await registry.resolveConnection({
				collectionRef: collection,
				definitionRef: definition,
				logger,
				trustNonceBearer, taskManager,
			});

			assert.strictEqual(connection, undefined, 'Connection should not be created when user rejects');
			assert.strictEqual(trustNonceBearer.trustedAtNonce, '__vscode_not_trusted', 'Should mark as explicitly not trusted');
		});

		test('autoTrustChanges bypasses prompt when nonce changes', async () => {
			const { collection, definition } = setupRegistry(McpServerTrust.Kind.TrustedOnNonce, 'nonce-b');
			trustNonceBearer.trustedAtNonce = 'nonce-a'; // Different nonce

			const connection = await registry.resolveConnection({
				collectionRef: collection,
				definitionRef: definition,
				logger,
				trustNonceBearer,
				autoTrustChanges: true,
				taskManager,
			});

			assert.ok(connection, 'Connection should be created with autoTrustChanges');
			assert.strictEqual(trustNonceBearer.trustedAtNonce, 'nonce-b', 'Nonce should be updated');
			assert.strictEqual(registry.nextDefinitionIdsToTrust, undefined, 'Trust dialog should not have been called');
			connection!.dispose();
		});

		test('promptType "never" skips prompt and fails silently', async () => {
			const { collection, definition } = setupRegistry(McpServerTrust.Kind.TrustedOnNonce, 'nonce-b');
			trustNonceBearer.trustedAtNonce = 'nonce-a'; // Different nonce

			const connection = await registry.resolveConnection({
				collectionRef: collection,
				definitionRef: definition,
				logger,
				trustNonceBearer,
				promptType: 'never',
				taskManager,
			});

			assert.strictEqual(connection, undefined, 'Connection should not be created with promptType "never"');
			assert.strictEqual(registry.nextDefinitionIdsToTrust, undefined, 'Trust dialog should not have been called');
		});

		test('promptType "only-new" skips previously untrusted servers', async () => {
			const { collection, definition } = setupRegistry(McpServerTrust.Kind.TrustedOnNonce, 'nonce-b');
			trustNonceBearer.trustedAtNonce = '__vscode_not_trusted'; // Previously explicitly denied

			const connection = await registry.resolveConnection({
				collectionRef: collection,
				definitionRef: definition,
				logger,
				trustNonceBearer,
				promptType: 'only-new',
				taskManager,
			});

			assert.strictEqual(connection, undefined, 'Connection should not be created for previously untrusted server');
			assert.strictEqual(registry.nextDefinitionIdsToTrust, undefined, 'Trust dialog should not have been called');
		});

		test('promptType "all-untrusted" prompts for previously untrusted servers', async () => {
			const { collection, definition } = setupRegistry(McpServerTrust.Kind.TrustedOnNonce, 'nonce-b');
			trustNonceBearer.trustedAtNonce = '__vscode_not_trusted'; // Previously explicitly denied
			registry.nextDefinitionIdsToTrust = [definition.id]; // User now trusts the server

			const connection = await registry.resolveConnection({
				collectionRef: collection,
				definitionRef: definition,
				logger,
				trustNonceBearer,
				promptType: 'all-untrusted',
				taskManager,
			});

			assert.ok(connection, 'Connection should be created when user trusts previously untrusted server');
			assert.strictEqual(trustNonceBearer.trustedAtNonce, 'nonce-b', 'Nonce should be updated');
			connection!.dispose();
		});

		test('concurrent resolveConnection calls with same interaction are grouped', async () => {
			const { collection, definition } = setupRegistry(McpServerTrust.Kind.TrustedOnNonce, 'nonce-b');
			trustNonceBearer.trustedAtNonce = 'nonce-a'; // Different nonce

			// Create a second definition that also needs trust
			const definition2 = createTestDefinition('test-server-2', 'nonce-c');
			collection.serverDefinitions.set([definition, definition2], undefined);

			// Create shared interaction
			const interaction = new McpStartServerInteraction();

			// Manually set participants as mentioned in the requirements
			interaction.participants.set(definition.id, { s: 'unknown' });
			interaction.participants.set(definition2.id, { s: 'unknown' });

			const trustNonceBearer2 = { trustedAtNonce: 'nonce-b' }; // Different nonce for second server

			// Trust both servers
			registry.nextDefinitionIdsToTrust = [definition.id, definition2.id];

			// Start both connections concurrently with the same interaction
			const [connection1, connection2] = await Promise.all([
				registry.resolveConnection({
					collectionRef: collection,
					definitionRef: definition,
					logger,
					trustNonceBearer,
					interaction,
					taskManager,
				}),
				registry.resolveConnection({
					collectionRef: collection,
					definitionRef: definition2,
					logger,
					trustNonceBearer: trustNonceBearer2,
					interaction,
					taskManager,
				})
			]);

			assert.ok(connection1, 'First connection should be created');
			assert.ok(connection2, 'Second connection should be created');
			assert.strictEqual(trustNonceBearer.trustedAtNonce, 'nonce-b', 'First nonce should be updated');
			assert.strictEqual(trustNonceBearer2.trustedAtNonce, 'nonce-c', 'Second nonce should be updated');

			connection1!.dispose();
			connection2!.dispose();
		});

		test('user cancelling trust dialog returns undefined for all pending connections', async () => {
			const { collection, definition } = setupRegistry(McpServerTrust.Kind.TrustedOnNonce, 'nonce-b');
			trustNonceBearer.trustedAtNonce = 'nonce-a'; // Different nonce

			// Create a second definition that also needs trust
			const definition2 = createTestDefinition('test-server-2', 'nonce-c');
			collection.serverDefinitions.set([definition, definition2], undefined);

			// Create shared interaction
			const interaction = new McpStartServerInteraction();

			// Manually set participants as mentioned in the requirements
			interaction.participants.set(definition.id, { s: 'unknown' });
			interaction.participants.set(definition2.id, { s: 'unknown' });

			const trustNonceBearer2 = { trustedAtNonce: 'nonce-b' }; // Different nonce for second server

			// User cancels the dialog
			registry.nextDefinitionIdsToTrust = undefined;

			// Start both connections concurrently with the same interaction
			const [connection1, connection2] = await Promise.all([
				registry.resolveConnection({
					collectionRef: collection,
					definitionRef: definition,
					logger,
					trustNonceBearer,
					interaction,
					taskManager,
				}),
				registry.resolveConnection({
					collectionRef: collection,
					definitionRef: definition2,
					logger,
					trustNonceBearer: trustNonceBearer2,
					interaction,
					taskManager,
				})
			]);

			assert.strictEqual(connection1, undefined, 'First connection should not be created when user cancels');
			assert.strictEqual(connection2, undefined, 'Second connection should not be created when user cancels');
		});

		test('partial trust selection in grouped interaction', async () => {
			const { collection, definition } = setupRegistry(McpServerTrust.Kind.TrustedOnNonce, 'nonce-b');
			trustNonceBearer.trustedAtNonce = 'nonce-a'; // Different nonce

			// Create a second definition that also needs trust
			const definition2 = createTestDefinition('test-server-2', 'nonce-c');
			collection.serverDefinitions.set([definition, definition2], undefined);

			// Create shared interaction
			const interaction = new McpStartServerInteraction();

			// Manually set participants as mentioned in the requirements
			interaction.participants.set(definition.id, { s: 'unknown' });
			interaction.participants.set(definition2.id, { s: 'unknown' });

			const trustNonceBearer2 = { trustedAtNonce: 'nonce-b' }; // Different nonce for second server

			// User trusts only the first server
			registry.nextDefinitionIdsToTrust = [definition.id];

			// Start both connections concurrently with the same interaction
			const [connection1, connection2] = await Promise.all([
				registry.resolveConnection({
					collectionRef: collection,
					definitionRef: definition,
					logger,
					trustNonceBearer,
					interaction,
					taskManager,
				}),
				registry.resolveConnection({
					collectionRef: collection,
					definitionRef: definition2,
					logger,
					trustNonceBearer: trustNonceBearer2,
					interaction,
					taskManager,
				})
			]);

			assert.ok(connection1, 'First connection should be created when trusted');
			assert.strictEqual(connection2, undefined, 'Second connection should not be created when not trusted');
			assert.strictEqual(trustNonceBearer.trustedAtNonce, 'nonce-b', 'First nonce should be updated');
			assert.strictEqual(trustNonceBearer2.trustedAtNonce, '__vscode_not_trusted', 'Second nonce should be marked as not trusted');

			connection1!.dispose();
		});
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/test/common/mcpRegistryInputStorage.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/test/common/mcpRegistryInputStorage.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { ILogService, NullLogService } from '../../../../../platform/log/common/log.js';
import { TestSecretStorageService } from '../../../../../platform/secrets/test/common/testSecretStorageService.js';
import { StorageScope, StorageTarget } from '../../../../../platform/storage/common/storage.js';
import { TestStorageService } from '../../../../test/common/workbenchTestServices.js';
import { McpRegistryInputStorage } from '../../common/mcpRegistryInputStorage.js';

suite('Workbench - MCP - RegistryInputStorage', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	let testStorageService: TestStorageService;
	let testSecretStorageService: TestSecretStorageService;
	let testLogService: ILogService;
	let mcpInputStorage: McpRegistryInputStorage;

	setup(() => {
		testStorageService = store.add(new TestStorageService());
		testSecretStorageService = new TestSecretStorageService();
		testLogService = store.add(new NullLogService());

		// Create the input storage with APPLICATION scope
		mcpInputStorage = store.add(new McpRegistryInputStorage(
			StorageScope.APPLICATION,
			StorageTarget.MACHINE,
			testStorageService,
			testSecretStorageService,
			testLogService
		));
	});

	test('setPlainText stores values that can be retrieved with getMap', async () => {
		const values = {
			'key1': { value: 'value1' },
			'key2': { value: 'value2' }
		};

		await mcpInputStorage.setPlainText(values);
		const result = await mcpInputStorage.getMap();

		assert.strictEqual(result.key1.value, 'value1');
		assert.strictEqual(result.key2.value, 'value2');
	});

	test('setSecrets stores encrypted values that can be retrieved with getMap', async () => {
		const secrets = {
			'secretKey1': { value: 'secretValue1' },
			'secretKey2': { value: 'secretValue2' }
		};

		await mcpInputStorage.setSecrets(secrets);
		const result = await mcpInputStorage.getMap();

		assert.strictEqual(result.secretKey1.value, 'secretValue1');
		assert.strictEqual(result.secretKey2.value, 'secretValue2');
	});

	test('getMap returns combined plain text and secret values', async () => {
		await mcpInputStorage.setPlainText({
			'plainKey': { value: 'plainValue' }
		});

		await mcpInputStorage.setSecrets({
			'secretKey': { value: 'secretValue' }
		});

		const result = await mcpInputStorage.getMap();

		assert.strictEqual(result.plainKey.value, 'plainValue');
		assert.strictEqual(result.secretKey.value, 'secretValue');
	});

	test('clear removes specific values', async () => {
		await mcpInputStorage.setPlainText({
			'key1': { value: 'value1' },
			'key2': { value: 'value2' }
		});

		await mcpInputStorage.setSecrets({
			'secretKey1': { value: 'secretValue1' },
			'secretKey2': { value: 'secretValue2' }
		});

		// Clear one plain and one secret value
		await mcpInputStorage.clear('key1');
		await mcpInputStorage.clear('secretKey1');

		const result = await mcpInputStorage.getMap();

		assert.strictEqual(result.key1, undefined);
		assert.strictEqual(result.key2.value, 'value2');
		assert.strictEqual(result.secretKey1, undefined);
		assert.strictEqual(result.secretKey2.value, 'secretValue2');
	});

	test('clearAll removes all values', async () => {
		await mcpInputStorage.setPlainText({
			'key1': { value: 'value1' }
		});

		await mcpInputStorage.setSecrets({
			'secretKey1': { value: 'secretValue1' }
		});

		mcpInputStorage.clearAll();

		const result = await mcpInputStorage.getMap();

		assert.deepStrictEqual(result, {});
	});

	test('updates to plain text values overwrite existing values', async () => {
		await mcpInputStorage.setPlainText({
			'key1': { value: 'value1' },
			'key2': { value: 'value2' }
		});

		await mcpInputStorage.setPlainText({
			'key1': { value: 'updatedValue1' }
		});

		const result = await mcpInputStorage.getMap();

		assert.strictEqual(result.key1.value, 'updatedValue1');
		assert.strictEqual(result.key2.value, 'value2');
	});

	test('updates to secret values overwrite existing values', async () => {
		await mcpInputStorage.setSecrets({
			'secretKey1': { value: 'secretValue1' },
			'secretKey2': { value: 'secretValue2' }
		});

		await mcpInputStorage.setSecrets({
			'secretKey1': { value: 'updatedSecretValue1' }
		});

		const result = await mcpInputStorage.getMap();

		assert.strictEqual(result.secretKey1.value, 'updatedSecretValue1');
		assert.strictEqual(result.secretKey2.value, 'secretValue2');
	});

	test('storage persists values across instances', async () => {
		// Set values on first instance
		await mcpInputStorage.setPlainText({
			'key1': { value: 'value1' }
		});

		await mcpInputStorage.setSecrets({
			'secretKey1': { value: 'secretValue1' }
		});

		await testStorageService.flush();

		// Create a second instance that should have access to the same storage
		const secondInstance = store.add(new McpRegistryInputStorage(
			StorageScope.APPLICATION,
			StorageTarget.MACHINE,
			testStorageService,
			testSecretStorageService,
			testLogService
		));

		const result = await secondInstance.getMap();

		assert.strictEqual(result.key1.value, 'value1');
		assert.strictEqual(result.secretKey1.value, 'secretValue1');

		assert.ok(!testStorageService.get('mcpInputs', StorageScope.APPLICATION)?.includes('secretValue1'));
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/test/common/mcpRegistryTypes.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/test/common/mcpRegistryTypes.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../../base/common/event.js';
import { Disposable, IDisposable } from '../../../../../base/common/lifecycle.js';
import { IObservable, observableValue } from '../../../../../base/common/observable.js';
import { ConfigurationTarget } from '../../../../../platform/configuration/common/configuration.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { LogLevel, NullLogger } from '../../../../../platform/log/common/log.js';
import { StorageScope } from '../../../../../platform/storage/common/storage.js';
import { IWorkspaceFolderData } from '../../../../../platform/workspace/common/workspace.js';
import { IResolvedValue } from '../../../../services/configurationResolver/common/configurationResolverExpression.js';
import { IMcpHostDelegate, IMcpMessageTransport, IMcpRegistry, IMcpResolveConnectionOptions } from '../../common/mcpRegistryTypes.js';
import { McpServerConnection } from '../../common/mcpServerConnection.js';
import { IMcpServerConnection, LazyCollectionState, McpCollectionDefinition, McpCollectionReference, McpConnectionState, McpDefinitionReference, McpServerDefinition, McpServerTransportType, McpServerTrust } from '../../common/mcpTypes.js';
import { MCP } from '../../common/modelContextProtocol.js';

/**
 * Implementation of IMcpMessageTransport for testing purposes.
 * Allows tests to easily send/receive messages and control the connection state.
 */
export class TestMcpMessageTransport extends Disposable implements IMcpMessageTransport {
	private readonly _onDidLog = this._register(new Emitter<{ level: LogLevel; message: string }>());
	public readonly onDidLog = this._onDidLog.event;

	private readonly _onDidReceiveMessage = this._register(new Emitter<MCP.JSONRPCMessage>());
	public readonly onDidReceiveMessage = this._onDidReceiveMessage.event;

	private readonly _stateValue = observableValue<McpConnectionState>('testTransportState', { state: McpConnectionState.Kind.Starting });
	public readonly state = this._stateValue;

	private readonly _sentMessages: MCP.JSONRPCMessage[] = [];

	constructor() {
		super();

		this.setResponder('initialize', () => ({
			jsonrpc: MCP.JSONRPC_VERSION,
			id: 1, // The handler uses 1 for the first request
			result: {
				protocolVersion: MCP.LATEST_PROTOCOL_VERSION,
				serverInfo: {
					name: 'Test MCP Server',
					version: '1.0.0',
				},
				capabilities: {
					resources: {
						supportedTypes: ['text/plain'],
					},
					tools: {
						supportsCancellation: true,
					}
				}
			}
		}));
	}

	/**
	 * Set a responder function for a specific method.
	 * The responder receives the sent message and should return a response object,
	 * which will be simulated as a server response.
	 */
	public setResponder(method: string, responder: (message: unknown) => MCP.JSONRPCMessage | undefined): void {
		if (!this._responders) {
			this._responders = new Map();
		}
		this._responders.set(method, responder);
	}

	private _responders?: Map<string, (message: MCP.JSONRPCMessage) => MCP.JSONRPCMessage | undefined>;

	/**
	 * Send a message through the transport.
	 */
	public send(message: MCP.JSONRPCMessage): void {
		this._sentMessages.push(message);
		if (this._responders && 'method' in message && typeof message.method === 'string') {
			const responder = this._responders.get(message.method);
			if (responder) {
				const response = responder(message);
				if (response) {
					setTimeout(() => this.simulateReceiveMessage(response));
				}
			}
		}
	}

	/**
	 * Stop the transport.
	 */
	public stop(): void {
		this._stateValue.set({ state: McpConnectionState.Kind.Stopped }, undefined);
	}

	// Test Helper Methods

	/**
	 * Simulate receiving a message from the server.
	 */
	public simulateReceiveMessage(message: MCP.JSONRPCMessage): void {
		this._onDidReceiveMessage.fire(message);
	}

	/**
	 * Simulates a reply to an 'initialized' request.
	 */
	public simulateInitialized() {
		if (!this._sentMessages.length) {
			throw new Error('initialize was not called yet');
		}

		this.simulateReceiveMessage({
			jsonrpc: MCP.JSONRPC_VERSION,
			id: (this.getSentMessages()[0] as MCP.JSONRPCRequest).id,
			result: {
				protocolVersion: MCP.LATEST_PROTOCOL_VERSION,
				capabilities: {
					tools: {},
				},
				serverInfo: {
					name: 'Test Server',
					version: '1.0.0'
				},
			} satisfies MCP.InitializeResult
		});
	}

	/**
	 * Simulate a log event.
	 */
	public simulateLog(message: string): void {
		this._onDidLog.fire({ level: LogLevel.Info, message });
	}

	/**
	 * Set the connection state.
	 */
	public setConnectionState(state: McpConnectionState): void {
		this._stateValue.set(state, undefined);
	}

	/**
	 * Get all messages that have been sent.
	 */
	public getSentMessages(): readonly MCP.JSONRPCMessage[] {
		return [...this._sentMessages];
	}

	/**
	 * Clear the sent messages history.
	 */
	public clearSentMessages(): void {
		this._sentMessages.length = 0;
	}
}

export class TestMcpRegistry implements IMcpRegistry {
	public makeTestTransport = () => new TestMcpMessageTransport();

	constructor(@IInstantiationService private readonly _instantiationService: IInstantiationService) { }

	_serviceBrand: undefined;
	onDidChangeInputs = Event.None;
	collections = observableValue<readonly McpCollectionDefinition[]>(this, [{
		id: 'test-collection',
		remoteAuthority: null,
		label: 'Test Collection',
		configTarget: ConfigurationTarget.USER,
		serverDefinitions: observableValue(this, [{
			id: 'test-server',
			label: 'Test Server',
			launch: { type: McpServerTransportType.Stdio, command: 'echo', args: ['Hello MCP'], env: {}, envFile: undefined, cwd: undefined },
			cacheNonce: 'a',
		} satisfies McpServerDefinition]),
		trustBehavior: McpServerTrust.Kind.Trusted,
		scope: StorageScope.APPLICATION,
	}]);
	delegates = observableValue<readonly IMcpHostDelegate[]>(this, [{
		priority: 0,
		canStart: () => true,
		substituteVariables(serverDefinition, launch) {
			return Promise.resolve(launch);
		},
		start: () => {
			const t = this.makeTestTransport();
			setTimeout(() => t.setConnectionState({ state: McpConnectionState.Kind.Running }));
			return t;
		},
		waitForInitialProviderPromises: () => Promise.resolve(),
	}]);
	lazyCollectionState = observableValue(this, { state: LazyCollectionState.AllKnown, collections: [] });
	collectionToolPrefix(collection: McpCollectionReference): IObservable<string> {
		return observableValue<string>(this, `mcp-${collection.id}-`);
	}
	getServerDefinition(collectionRef: McpDefinitionReference, definitionRef: McpDefinitionReference): IObservable<{ server: McpServerDefinition | undefined; collection: McpCollectionDefinition | undefined }> {
		const collectionObs = this.collections.map(cols => cols.find(c => c.id === collectionRef.id));
		return collectionObs.map((collection, reader) => {
			const server = collection?.serverDefinitions.read(reader).find(s => s.id === definitionRef.id);
			return { collection, server };
		});
	}
	discoverCollections(): Promise<McpCollectionDefinition[]> {
		throw new Error('Method not implemented.');
	}
	registerDelegate(delegate: IMcpHostDelegate): IDisposable {
		throw new Error('Method not implemented.');
	}
	registerCollection(collection: McpCollectionDefinition): IDisposable {
		throw new Error('Method not implemented.');
	}
	resetTrust(): void {
		throw new Error('Method not implemented.');
	}
	clearSavedInputs(scope: StorageScope, inputId?: string): Promise<void> {
		throw new Error('Method not implemented.');
	}
	editSavedInput(inputId: string, folderData: IWorkspaceFolderData | undefined, configSection: string, target: ConfigurationTarget): Promise<void> {
		throw new Error('Method not implemented.');
	}
	setSavedInput(inputId: string, target: ConfigurationTarget, value: string): Promise<void> {
		throw new Error('Method not implemented.');
	}
	getSavedInputs(scope: StorageScope): Promise<{ [id: string]: IResolvedValue }> {
		throw new Error('Method not implemented.');
	}
	resolveConnection(options: IMcpResolveConnectionOptions): Promise<IMcpServerConnection | undefined> {
		const collection = this.collections.get().find(c => c.id === options.collectionRef.id);
		const definition = collection?.serverDefinitions.get().find(d => d.id === options.definitionRef.id);
		if (!collection || !definition) {
			throw new Error(`Collection or definition not found: ${options.collectionRef.id}, ${options.definitionRef.id}`);
		}
		const del = this.delegates.get()[0];
		return Promise.resolve(new McpServerConnection(
			collection,
			definition,
			del,
			definition.launch,
			new NullLogger(),
			false,
			options.taskManager,
			this._instantiationService,
		));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/test/common/mcpResourceFilesystem.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/test/common/mcpResourceFilesystem.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { Barrier, timeout } from '../../../../../base/common/async.js';
import { URI } from '../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { FileChangeType, FileSystemProviderErrorCode, FileType, IFileChange, IFileService, toFileSystemProviderErrorCode } from '../../../../../platform/files/common/files.js';
import { ServiceCollection } from '../../../../../platform/instantiation/common/serviceCollection.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { ILoggerService, NullLogService } from '../../../../../platform/log/common/log.js';
import { IProductService } from '../../../../../platform/product/common/productService.js';
import { IStorageService } from '../../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { NullTelemetryService } from '../../../../../platform/telemetry/common/telemetryUtils.js';
import { IWorkspaceContextService } from '../../../../../platform/workspace/common/workspace.js';
import { IWorkbenchEnvironmentService } from '../../../../services/environment/common/environmentService.js';
import { TestContextService, TestLoggerService, TestProductService, TestStorageService } from '../../../../test/common/workbenchTestServices.js';
import { IMcpRegistry } from '../../common/mcpRegistryTypes.js';
import { McpResourceFilesystem } from '../../common/mcpResourceFilesystem.js';
import { McpService } from '../../common/mcpService.js';
import { IMcpService } from '../../common/mcpTypes.js';
import { MCP } from '../../common/modelContextProtocol.js';
import { TestMcpMessageTransport, TestMcpRegistry } from './mcpRegistryTypes.js';


suite('Workbench - MCP - ResourceFilesystem', () => {

	const ds = ensureNoDisposablesAreLeakedInTestSuite();

	let transport: TestMcpMessageTransport;
	let fs: McpResourceFilesystem;

	setup(() => {
		const services = new ServiceCollection(
			[IFileService, { registerProvider: () => { } }],
			[IStorageService, ds.add(new TestStorageService())],
			[ILoggerService, ds.add(new TestLoggerService())],
			[IWorkspaceContextService, new TestContextService()],
			[IWorkbenchEnvironmentService, {}],
			[ITelemetryService, NullTelemetryService],
			[IProductService, TestProductService],
		);

		const parentInsta1 = ds.add(new TestInstantiationService(services));
		const registry = new TestMcpRegistry(parentInsta1);

		const parentInsta2 = ds.add(parentInsta1.createChild(new ServiceCollection([IMcpRegistry, registry])));
		const mcpService = ds.add(new McpService(parentInsta2, registry, new NullLogService(), new TestConfigurationService()));
		mcpService.updateCollectedServers();

		const instaService = ds.add(parentInsta2.createChild(new ServiceCollection(
			[IMcpRegistry, registry],
			[IMcpService, mcpService],
		)));

		fs = ds.add(instaService.createInstance(McpResourceFilesystem));

		transport = ds.add(new TestMcpMessageTransport());
		registry.makeTestTransport = () => transport;
	});

	test('reads a basic file', async () => {
		transport.setResponder('resources/read', msg => {
			const request = msg as { id: string | number; params: { uri: string } };
			assert.strictEqual(request.params.uri, 'custom://hello/world.txt');
			return {
				id: request.id,
				jsonrpc: '2.0',
				result: {
					contents: [{ uri: request.params.uri, text: 'Hello World' }],
				} satisfies MCP.ReadResourceResult
			};
		});

		const response = await fs.readFile(URI.parse('mcp-resource://746573742D736572766572/custom/hello/world.txt'));
		assert.strictEqual(new TextDecoder().decode(response), 'Hello World');
	});

	test('stat returns file information', async () => {
		transport.setResponder('resources/read', msg => {
			const request = msg as { id: string | number; params: { uri: string } };
			assert.strictEqual(request.params.uri, 'custom://hello/world.txt');
			return {
				id: request.id,
				jsonrpc: '2.0',
				result: {
					contents: [{ uri: request.params.uri, text: 'Hello World' }],
				} satisfies MCP.ReadResourceResult
			};
		});

		const fileStats = await fs.stat(URI.parse('mcp-resource://746573742D736572766572/custom/hello/world.txt'));
		assert.strictEqual(fileStats.type, FileType.File);
		assert.strictEqual(fileStats.size, 'Hello World'.length);
	});

	test('stat returns directory information', async () => {
		transport.setResponder('resources/read', msg => {
			const request = msg as { id: string | number; params: { uri: string } };
			assert.strictEqual(request.params.uri, 'custom://hello');
			return {
				id: request.id,
				jsonrpc: '2.0',
				result: {
					contents: [
						{ uri: 'custom://hello/file1.txt', text: 'File 1' },
						{ uri: 'custom://hello/file2.txt', text: 'File 2' },
					],
				} satisfies MCP.ReadResourceResult
			};
		});

		const dirStats = await fs.stat(URI.parse('mcp-resource://746573742D736572766572/custom/hello/'));
		assert.strictEqual(dirStats.type, FileType.Directory);
		// Size should be sum of all file contents in the directory
		assert.strictEqual(dirStats.size, 'File 1'.length + 'File 2'.length);
	});

	test('stat throws FileNotFound for nonexistent resources', async () => {
		transport.setResponder('resources/read', msg => {
			const request = msg as { id: string | number };
			return {
				id: request.id,
				jsonrpc: '2.0',
				result: {
					contents: [],
				} satisfies MCP.ReadResourceResult
			};
		});

		await assert.rejects(
			() => fs.stat(URI.parse('mcp-resource://746573742D736572766572/custom/nonexistent.txt')),
			(err: Error) => toFileSystemProviderErrorCode(err) === FileSystemProviderErrorCode.FileNotFound
		);
	});

	test('readdir returns directory contents', async () => {
		transport.setResponder('resources/read', msg => {
			const request = msg as { id: string | number; params: { uri: string } };
			assert.strictEqual(request.params.uri, 'custom://hello/dir');
			return {
				id: request.id,
				jsonrpc: '2.0',
				result: {
					contents: [
						{ uri: 'custom://hello/dir/file1.txt', text: 'File 1' },
						{ uri: 'custom://hello/dir/file2.txt', text: 'File 2' },
						{ uri: 'custom://hello/dir/subdir/file3.txt', text: 'File 3' },
					],
				} satisfies MCP.ReadResourceResult
			};
		});

		const dirEntries = await fs.readdir(URI.parse('mcp-resource://746573742D736572766572/custom/hello/dir/'));
		assert.deepStrictEqual(dirEntries, [
			['file1.txt', FileType.File],
			['file2.txt', FileType.File],
			['subdir', FileType.Directory],
		]);
	});

	test('readdir throws when reading a file as directory', async () => {
		transport.setResponder('resources/read', msg => {
			const request = msg as { id: string | number; params: { uri: string } };
			return {
				id: request.id,
				jsonrpc: '2.0',
				result: {
					contents: [{ uri: request.params.uri, text: 'This is a file' }],
				} satisfies MCP.ReadResourceResult
			};
		});

		await assert.rejects(
			() => fs.readdir(URI.parse('mcp-resource://746573742D736572766572/custom/hello/file.txt')),
			(err: Error) => toFileSystemProviderErrorCode(err) === FileSystemProviderErrorCode.FileNotADirectory
		);
	});

	test('watch file emits change events', async () => {
		// Set up the responder for resource reading
		transport.setResponder('resources/read', msg => {
			const request = msg as { id: string | number; params: { uri: string } };
			return {
				id: request.id,
				jsonrpc: '2.0',
				result: {
					contents: [{ uri: request.params.uri, text: 'File content' }],
				} satisfies MCP.ReadResourceResult
			};
		});

		const didSubscribe = new Barrier();

		// Set up the responder for resource subscription
		transport.setResponder('resources/subscribe', msg => {
			const request = msg as { id: string | number };
			didSubscribe.open();
			return {
				id: request.id,
				jsonrpc: '2.0',
				result: {},
			};
		});

		const uri = URI.parse('mcp-resource://746573742D736572766572/custom/hello/file.txt');
		const fileChanges: IFileChange[] = [];

		// Create a listener for file change events
		const disposable = fs.onDidChangeFile(events => {
			fileChanges.push(...events);
		});

		// Start watching the file
		const watchDisposable = fs.watch(uri, { excludes: [], recursive: false });

		// Simulate a file update notification from the server
		await didSubscribe.wait();
		await timeout(10); // wait for listeners to attach

		transport.simulateReceiveMessage({
			jsonrpc: '2.0',
			method: 'notifications/resources/updated',
			params: {
				uri: 'custom://hello/file.txt',
			},
		});
		transport.simulateReceiveMessage({
			jsonrpc: '2.0',
			method: 'notifications/resources/updated',
			params: {
				uri: 'custom://hello/unrelated.txt',
			},
		});

		// Check that we received a file change event
		assert.strictEqual(fileChanges.length, 1);
		assert.strictEqual(fileChanges[0].type, FileChangeType.UPDATED);
		assert.strictEqual(fileChanges[0].resource.toString(), uri.toString());

		// Clean up
		disposable.dispose();
		watchDisposable.dispose();
	});

	test('read blob resource', async () => {
		const blobBase64 = 'SGVsbG8gV29ybGQgYXMgQmxvYg=='; // "Hello World as Blob" in base64

		transport.setResponder('resources/read', msg => {
			const params = (msg as { id: string | number; params: { uri: string } });
			assert.strictEqual(params.params.uri, 'custom://hello/blob.bin');
			return {
				id: params.id,
				jsonrpc: '2.0',
				result: {
					contents: [{ uri: params.params.uri, blob: blobBase64 }],
				} satisfies MCP.ReadResourceResult
			};
		});

		const response = await fs.readFile(URI.parse('mcp-resource://746573742D736572766572/custom/hello/blob.bin'));
		assert.strictEqual(new TextDecoder().decode(response), 'Hello World as Blob');
	});

	test('throws error for write operations', async () => {
		const uri = URI.parse('mcp-resource://746573742D736572766572/custom/hello/file.txt');

		await assert.rejects(
			async () => fs.writeFile(uri, new Uint8Array(), { create: true, overwrite: true, atomic: false, unlock: false }),
			(err: Error) => toFileSystemProviderErrorCode(err) === FileSystemProviderErrorCode.NoPermissions
		);

		await assert.rejects(
			async () => fs.delete(uri, { recursive: false, useTrash: false, atomic: false }),
			(err: Error) => toFileSystemProviderErrorCode(err) === FileSystemProviderErrorCode.NoPermissions
		);

		await assert.rejects(
			async () => fs.mkdir(uri),
			(err: Error) => toFileSystemProviderErrorCode(err) === FileSystemProviderErrorCode.NoPermissions
		);

		await assert.rejects(
			async () => fs.rename(uri, URI.parse('mcp-resource://746573742D736572766572/custom/hello/newfile.txt'), { overwrite: false }),
			(err: Error) => toFileSystemProviderErrorCode(err) === FileSystemProviderErrorCode.NoPermissions
		);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/test/common/mcpSamplingLog.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/test/common/mcpSamplingLog.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import * as sinon from 'sinon';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import {
	StorageScope
} from '../../../../../platform/storage/common/storage.js';
import { TestStorageService } from '../../../../test/common/workbenchTestServices.js';
import { ISamplingStoredData, McpSamplingLog } from '../../common/mcpSamplingLog.js';
import { IMcpServer } from '../../common/mcpTypes.js';
import { asArray } from '../../../../../base/common/arrays.js';

suite('MCP - Sampling Log', () => {
	const ds = ensureNoDisposablesAreLeakedInTestSuite();
	const fakeServer: IMcpServer = {
		definition: { id: 'testServer' },
		readDefinitions: () => ({
			get: () => ({ collection: { scope: StorageScope.APPLICATION } }),
		}),
	} as IMcpServer;

	let log: McpSamplingLog;
	let storage: TestStorageService;
	let clock: sinon.SinonFakeTimers;

	setup(() => {
		storage = ds.add(new TestStorageService());
		log = ds.add(new McpSamplingLog(storage));
		clock = sinon.useFakeTimers();
		clock.setSystemTime(new Date('2023-10-01T00:00:00Z').getTime());
	});

	teardown(() => {
		clock.restore();
	});

	test('logs a single request', async () => {
		log.add(
			fakeServer,
			[{ role: 'user', content: { type: 'text', text: 'test request' } }],
			'test response here',
			'foobar9000',
		);

		// storage.testEmitWillSaveState(WillSaveStateReason.NONE);
		await storage.flush();
		assert.deepStrictEqual(
			(storage.getObject('mcp.sampling.logs', StorageScope.APPLICATION) as unknown),
			[
				[
					'testServer',
					{
						head: 19631,
						bins: [1, 0, 0, 0, 0, 0, 0],
						lastReqs: [
							{
								request: [{ role: 'user', content: { type: 'text', text: 'test request' } }],
								response: 'test response here',
								at: 1696118400000,
								model: 'foobar9000',
							},
						],
					},
				],
			],
		);
	});

	test('logs multiple requests on the same day', async () => {
		// First request
		log.add(
			fakeServer,
			[{ role: 'user', content: { type: 'text', text: 'first request' } }],
			'first response',
			'foobar9000',
		);

		// Advance time by a few hours but stay on the same day
		clock.tick(5 * 60 * 60 * 1000); // 5 hours

		// Second request
		log.add(
			fakeServer,
			[{ role: 'user', content: { type: 'text', text: 'second request' } }],
			'second response',
			'foobar9000',
		);

		await storage.flush();
		const data = (storage.getObject('mcp.sampling.logs', StorageScope.APPLICATION) as [string, any][])[0][1];

		// Verify the bin for the current day has 2 requests
		assert.strictEqual(data.bins[0], 2);

		// Verify both requests are in the lastReqs array, with the most recent first
		assert.strictEqual(data.lastReqs.length, 2);
		assert.strictEqual(data.lastReqs[0].request[0].content.text, 'second request');
		assert.strictEqual(data.lastReqs[1].request[0].content.text, 'first request');
	});

	test('shifts bins when adding requests on different days', async () => {
		// First request on day 1
		log.add(
			fakeServer,
			[{ role: 'user', content: { type: 'text', text: 'day 1 request' } }],
			'day 1 response',
			'foobar9000',
		);

		// Advance time to the next day
		clock.tick(24 * 60 * 60 * 1000);

		// Second request on day 2
		log.add(
			fakeServer,
			[{ role: 'user', content: { type: 'text', text: 'day 2 request' } }],
			'day 2 response',
			'foobar9000',
		);

		await storage.flush();
		const data = (storage.getObject('mcp.sampling.logs', StorageScope.APPLICATION) as [string, ISamplingStoredData][])[0][1];

		// Verify the bins: day 2 should have 1 request, day 1 should have 1 request
		assert.strictEqual(data.bins[0], 1); // day 2
		assert.strictEqual(data.bins[1], 1); // day 1

		// Advance time by 5 more days
		clock.tick(5 * 24 * 60 * 60 * 1000);

		// Request on day 7
		log.add(
			fakeServer,
			[{ role: 'user', content: { type: 'text', text: 'day 7 request' } }],
			'day 7 response',
			'foobar9000',
		);

		await storage.flush();
		const updatedData = (storage.getObject('mcp.sampling.logs', StorageScope.APPLICATION) as [string, ISamplingStoredData][])[0][1];

		// Verify the bins have shifted correctly
		assert.strictEqual(updatedData.bins[0], 1); // day 7
		assert.strictEqual(updatedData.bins[5], 1); // day 2
		assert.strictEqual(updatedData.bins[6], 1); // day 1
	});

	test('limits the number of stored requests', async () => {
		// Add more than the maximum number of requests (Constants.SamplingLastNMessage = 30)
		for (let i = 0; i < 35; i++) {
			log.add(
				fakeServer,
				[{ role: 'user', content: { type: 'text', text: `request ${i}` } }],
				`response ${i}`,
				'foobar9000',
			);
		}

		await storage.flush();
		const data = (storage.getObject('mcp.sampling.logs', StorageScope.APPLICATION) as [string, ISamplingStoredData][])[0][1];

		// Verify only the last 30 requests are kept
		assert.strictEqual(data.lastReqs.length, 30);
		assert.strictEqual((data.lastReqs[0].request[0].content as { type: 'text'; text: string }).text, 'request 34');
		assert.strictEqual((data.lastReqs[29].request[0].content as { type: 'text'; text: string }).text, 'request 5');
	});

	test('handles different content types', async () => {
		// Add a request with text content
		log.add(
			fakeServer,
			[{ role: 'user', content: { type: 'text', text: 'text request' } }],
			'text response',
			'foobar9000',
		);

		// Add a request with image content
		log.add(
			fakeServer,
			[{
				role: 'user',
				content: {
					type: 'image',
					data: 'base64data',
					mimeType: 'image/png'
				}
			}],
			'image response',
			'foobar9000',
		);

		// Add a request with mixed content
		log.add(
			fakeServer,
			[
				{ role: 'user', content: { type: 'text', text: 'text and image' } },
				{
					role: 'assistant',
					content: {
						type: 'image',
						data: 'base64data',
						mimeType: 'image/jpeg'
					}
				}
			],
			'mixed response',
			'foobar9000',
		);

		await storage.flush();
		const data = (storage.getObject('mcp.sampling.logs', StorageScope.APPLICATION) as [string, ISamplingStoredData][])[0][1];

		// Verify all requests are stored correctly
		assert.strictEqual(data.lastReqs.length, 3);
		assert.strictEqual(data.lastReqs[0].request.length, 2); // Mixed content request has 2 messages
		assert.strictEqual(asArray(data.lastReqs[1].request[0].content)[0].type, 'image');
		assert.strictEqual(asArray(data.lastReqs[2].request[0].content)[0].type, 'text');
	});

	test('handles multiple servers', async () => {
		const fakeServer2: IMcpServer = {
			definition: { id: 'testServer2' },
			readDefinitions: () => ({
				get: () => ({ collection: { scope: StorageScope.APPLICATION } }),
			}),
		} as IMcpServer;

		log.add(
			fakeServer,
			[{ role: 'user', content: { type: 'text', text: 'server1 request' } }],
			'server1 response',
			'foobar9000',
		);

		log.add(
			fakeServer2,
			[{ role: 'user', content: { type: 'text', text: 'server2 request' } }],
			'server2 response',
			'foobar9000',
		);

		await storage.flush();
		const storageData = (storage.getObject('mcp.sampling.logs', StorageScope.APPLICATION) as [string, ISamplingStoredData][]);

		// Verify both servers have their data stored
		assert.strictEqual(storageData.length, 2);
		assert.strictEqual(storageData[0][0], 'testServer');
		assert.strictEqual(storageData[1][0], 'testServer2');
	});
});
```

--------------------------------------------------------------------------------

````
