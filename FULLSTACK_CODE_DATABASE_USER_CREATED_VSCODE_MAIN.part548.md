---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 548
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 548 of 552)

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

---[FILE: src/vscode-dts/vscode.proposed.multiDocumentHighlightProvider.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.multiDocumentHighlightProvider.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	/**
	 * Represents a collection of document highlights from multiple documents.
	 */
	export class MultiDocumentHighlight {

		/**
		 * The URI of the document containing the highlights.
		 */
		uri: Uri;

		/**
		 * The highlights for the document.
		 */
		highlights: DocumentHighlight[];

		/**
		 * Creates a new instance of MultiDocumentHighlight.
		 * @param uri The URI of the document containing the highlights.
		 * @param highlights The highlights for the document.
		 */
		constructor(uri: Uri, highlights: DocumentHighlight[]);
	}

	export interface MultiDocumentHighlightProvider {

		/**
		 * Provide a set of document highlights, like all occurrences of a variable or
		 * all exit-points of a function.
		 *
		 * @param document The document in which the command was invoked.
		 * @param position The position at which the command was invoked.
		 * @param otherDocuments An array of additional valid documents for which highlights should be provided.
		 * @param token A cancellation token.
		 * @returns A Map containing a mapping of the Uri of a document to the document highlights or a thenable that resolves to such. The lack of a result can be
		 * signaled by returning `undefined`, `null`, or an empty map.
		 */
		provideMultiDocumentHighlights(document: TextDocument, position: Position, otherDocuments: TextDocument[], token: CancellationToken): ProviderResult<MultiDocumentHighlight[]>;
	}

	namespace languages {

		/**
		 * Register a multi document highlight provider.
		 *
		 * Multiple providers can be registered for a language. In that case providers are sorted
		 * by their {@link languages.match score} and groups sequentially asked for document highlights.
		 * The process stops when a provider returns a `non-falsy` or `non-failure` result.
		 *
		 * @param selector A selector that defines the documents this provider is applicable to.
		 * @param provider A multi-document highlight provider.
		 * @returns A {@link Disposable} that unregisters this provider when being disposed.
		 */
		export function registerMultiDocumentHighlightProvider(selector: DocumentSelector, provider: MultiDocumentHighlightProvider): Disposable;
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.nativeWindowHandle.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.nativeWindowHandle.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// https://github.com/microsoft/vscode/issues/229431

declare module 'vscode' {

	export namespace window {
		/**
		 * Retrieves the native window handle of the current active window.
		 * This will be updated when the active window changes.
		 */
		export const nativeHandle: Uint8Array | undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.newSymbolNamesProvider.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.newSymbolNamesProvider.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// https://github.com/microsoft/vscode/issues/204345 @ulugbekna

declare module 'vscode' {

	export enum NewSymbolNameTag {
		AIGenerated = 1
	}

	export enum NewSymbolNameTriggerKind {
		Invoke = 0,
		Automatic = 1,
	}

	export class NewSymbolName {
		readonly newSymbolName: string;
		readonly tags?: readonly NewSymbolNameTag[];

		constructor(newSymbolName: string, tags?: readonly NewSymbolNameTag[]);
	}

	export interface NewSymbolNamesProvider {

		/**
		 * @default false
		 */
		readonly supportsAutomaticTriggerKind?: Thenable<boolean>;

		/**
		 * Provide possible new names for the symbol at the given range.
		 *
		 * @param document The document in which the symbol is defined.
		 * @param range The range that spans the symbol being renamed.
		 * @param token A cancellation token.
		 * @return A list of new symbol names.
		 */
		provideNewSymbolNames(document: TextDocument, range: Range, triggerKind: NewSymbolNameTriggerKind, token: CancellationToken): ProviderResult<NewSymbolName[]>;
	}

	export namespace languages {
		export function registerNewSymbolNamesProvider(selector: DocumentSelector, provider: NewSymbolNamesProvider): Disposable;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.notebookCellExecution.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.notebookCellExecution.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	export interface NotebookCellExecution {
		/**
		 * Signal that execution has ended.
		 *
		 * @param success If true, a green check is shown on the cell status bar.
		 * If false, a red X is shown.
		 * If undefined, no check or X icon is shown.
		 * @param endTime The time that execution finished, in milliseconds in the Unix epoch.
		 * @param error Details about an error that occurred during execution if any.
		 */
		end(success: boolean | undefined, endTime?: number, error?: CellExecutionError): void;
	}

	export interface CellExecutionError {
		/**
		 * The error name.
		 */
		readonly name: string;

		/**
		 * The error message.
		 */
		readonly message: string;

		/**
		 * The string from an Error object or parsed details on each stack frame to help with diagnostics.
		 */
		readonly stack: string | CellErrorStackFrame[] | undefined;

		/**
		 * The cell resource which had the error.
		 */
		uri: Uri;

		/**
		 * The location within the resource where the error occurred.
		 */
		readonly location: Range | undefined;
	}

	export class CellErrorStackFrame {
		/**
		 * The location of this stack frame. This should be provided as a URI if the
		 * location of the call frame can be accessed by the editor.
		 */
		readonly uri?: Uri;

		/**
		 * Position of the stack frame within the file.
		 */
		position?: Position;

		/**
		 * The name of the stack frame, typically a method or function name.
		 */
		readonly label: string;

		/**
		 * @param label The name of the stack frame
		 * @param file The file URI of the stack frame
		 * @param position The position of the stack frame within the file
		 */
		constructor(label: string, uri?: Uri, position?: Position);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.notebookControllerAffinityHidden.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.notebookControllerAffinityHidden.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {
	// https://github.com/microsoft/vscode/issues/161144
	export enum NotebookControllerAffinity2 {
		Default = 1,
		Preferred = 2,
		Hidden = -1
	}

	export interface NotebookController {
		updateNotebookAffinity(notebook: NotebookDocument, affinity: NotebookControllerAffinity | NotebookControllerAffinity2): void;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.notebookDeprecated.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.notebookDeprecated.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/106744

	export interface NotebookCellOutput {
		/**
		 * @deprecated
		 */
		id: string;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.notebookExecution.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.notebookExecution.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	/**
	 * A NotebookExecution is how {@link NotebookController notebook controller} can indicate whether the notebook controller is busy or not.
	 *
	 * When {@linkcode NotebookExecution.start start()} is called on the execution task, it causes the Notebook to enter a executing state .
	 * When {@linkcode NotebookExecution.end end()} is called, it enters the idle state.
	 */
	export interface NotebookExecution {
		/**
		 * Signal that the execution has begun.
		 */
		start(): void;

		/**
		 * Signal that execution has ended.
		 */
		end(): void;
	}

	export interface NotebookController {
		/**
		 * Create an execution task.
		 *
		 * _Note_ that there can only be one execution per Notebook, that also includes NotebookCellExecutions and t an error is thrown if
		 * a cell execution or another NotebookExecution is created while another is still active.
		 *
		 * This should be used to indicate the {@link NotebookController notebook controller} is busy even though user may not have executed any cell though the UI.
		 * @param notebook
		 * @returns A notebook execution.
		 */
		createNotebookExecution(notebook: NotebookDocument): NotebookExecution;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.notebookKernelSource.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.notebookKernelSource.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {
	export interface NotebookControllerDetectionTask {
		/**
		 * Dispose and remove the detection task.
		 */
		dispose(): void;
	}

	export class NotebookKernelSourceAction {
		readonly label: string;
		readonly description?: string;
		readonly detail?: string;
		readonly command: string | Command;
		readonly documentation?: Uri;

		constructor(label: string);
	}

	export interface NotebookKernelSourceActionProvider {
		/**
		 * An optional event to signal that the kernel source actions have changed.
		 */
		readonly onDidChangeNotebookKernelSourceActions?: Event<void>;
		/**
		 * Provide kernel source actions
		 */
		provideNotebookKernelSourceActions(token: CancellationToken): ProviderResult<NotebookKernelSourceAction[]>;
	}

	export namespace notebooks {
		/**
		 * Create notebook controller detection task
		 */
		export function createNotebookControllerDetectionTask(notebookType: string): NotebookControllerDetectionTask;

		/**
		 * Register a notebook kernel source action provider
		 */
		export function registerKernelSourceActionProvider(notebookType: string, provider: NotebookKernelSourceActionProvider): Disposable;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.notebookLiveShare.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.notebookLiveShare.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/106744

	export interface NotebookRegistrationData {
		readonly displayName: string;
		readonly filenamePattern: ReadonlyArray<(GlobPattern | { readonly include: GlobPattern; readonly exclude: GlobPattern })>;
		readonly exclusive?: boolean;
	}

	export namespace workspace {

		// SPECIAL overload with NotebookRegistrationData
		export function registerNotebookSerializer(notebookType: string, serializer: NotebookSerializer, options?: NotebookDocumentContentOptions, registration?: NotebookRegistrationData): Disposable;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.notebookMessaging.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.notebookMessaging.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/123601

	/**
	 * Represents a script that is loaded into the notebook renderer before rendering output. This allows
	 * to provide and share functionality for notebook markup and notebook output renderers.
	 */
	export class NotebookRendererScript {

		/**
		 * APIs that the preload provides to the renderer. These are matched
		 * against the `dependencies` and `optionalDependencies` arrays in the
		 * notebook renderer contribution point.
		 */
		provides: readonly string[];

		/**
		 * URI of the JavaScript module to preload.
		 *
		 * This module must export an `activate` function that takes a context object that contains the notebook API.
		 */
		uri: Uri;

		/**
		 * @param uri URI of the JavaScript module to preload
		 * @param provides Value for the `provides` property
		 */
		constructor(uri: Uri, provides?: string | readonly string[]);
	}

	export interface NotebookController {

		// todo@API allow add, not remove
		readonly rendererScripts: NotebookRendererScript[];

		/**
		 * An event that fires when a {@link NotebookController.rendererScripts renderer script} has send a message to
		 * the controller.
		 */
		readonly onDidReceiveMessage: Event<{ readonly editor: NotebookEditor; readonly message: any }>;

		/**
		 * Send a message to the renderer of notebook editors.
		 *
		 * Note that only editors showing documents that are bound to this controller
		 * are receiving the message.
		 *
		 * @param message The message to send.
		 * @param editor A specific editor to send the message to. When `undefined` all applicable editors are receiving the message.
		 * @returns A promise that resolves to a boolean indicating if the message has been send or not.
		 */
		postMessage(message: any, editor?: NotebookEditor): Thenable<boolean>;

		//todo@API validate this works
		asWebviewUri(localResource: Uri): Uri;
	}

	export namespace notebooks {

		export function createNotebookController(id: string, viewType: string, label: string, handler?: (cells: NotebookCell[], notebook: NotebookDocument, controller: NotebookController) => void | Thenable<void>, rendererScripts?: NotebookRendererScript[]): NotebookController;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.notebookMime.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.notebookMime.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/126280 @mjbvz

	export interface NotebookCellData {
		/**
		 * Mime type determines how the cell's `value` is interpreted.
		 *
		 * The mime selects which notebook renders is used to render the cell.
		 *
		 * If not set, internally the cell is treated as having a mime type of `text/plain`.
		 * Cells that set `language` to `markdown` instead are treated as `text/markdown`.
		 */
		mime?: string;
	}

	export interface NotebookCell {
		/**
		 * Mime type determines how the markup cell's `value` is interpreted.
		 *
		 * The mime selects which notebook renders is used to render the cell.
		 *
		 * If not set, internally the cell is treated as having a mime type of `text/plain`.
		 * Cells that set `language` to `markdown` instead are treated as `text/markdown`.
		 */
		mime: string | undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.notebookReplDocument.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.notebookReplDocument.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	export interface NotebookDocumentShowOptions {
		/**
		 * The notebook should be opened in a REPL editor,
		 * where the last cell of the notebook is an input box and the other cells are the read-only history.
		 * When the value is a string, it will be used as the label for the editor tab.
		 */
		readonly asRepl?: boolean | string | {
			/**
			* The label to be used for the editor tab.
			*/
			readonly label: string;
		};
	}

	export interface NotebookEditor {
		/**
		 * Information about the REPL editor if the notebook was opened as a repl.
		 */
		replOptions?: {
			/**
			 * The index where new cells should be appended.
			 */
			appendIndex: number;
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.notebookVariableProvider.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.notebookVariableProvider.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
declare module 'vscode' {

	export interface NotebookController {
		/** Set this to attach a variable provider to this controller. */
		variableProvider?: NotebookVariableProvider;
	}

	export enum NotebookVariablesRequestKind {
		Named = 1,
		Indexed = 2
	}

	export interface VariablesResult {
		variable: Variable;
		hasNamedChildren: boolean;
		indexedChildrenCount: number;
	}

	export interface NotebookVariableProvider {
		readonly onDidChangeVariables: Event<NotebookDocument>;

		/** When parent is undefined, this is requesting global Variables. When a variable is passed, it's requesting child props of that Variable. */
		provideVariables(notebook: NotebookDocument, parent: Variable | undefined, kind: NotebookVariablesRequestKind, start: number, token: CancellationToken): AsyncIterable<VariablesResult>;
	}

	export interface Variable {
		/** The variable's name. */
		name: string;

		/** The variable's value.
			This can be a multi-line text, e.g. for a function the body of a function.
			For structured variables (which do not have a simple value), it is recommended to provide a one-line representation of the structured object.
			This helps to identify the structured object in the collapsed state when its children are not yet visible.
			An empty string can be used if no value should be shown in the UI.
		*/
		value: string;

		/** The code that represents how the variable would be accessed in the runtime environment */
		expression?: string;

		/** The type of the variable's value */
		type?: string;

		/** The interfaces or contracts that the type satisfies */
		interfaces?: string[];

		/** The language of the variable's value */
		language?: string;
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.portsAttributes.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.portsAttributes.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/115616 @alexr00

	/**
	 * The action that should be taken when a port is discovered through automatic port forwarding discovery.
	 */
	export enum PortAutoForwardAction {
		/**
		 * Notify the user that the port is being forwarded. This is the default action.
		 */
		Notify = 1,
		/**
		 * Once the port is forwarded, open the user's web browser to the forwarded port.
		 */
		OpenBrowser = 2,
		/**
		 * Once the port is forwarded, open the preview browser to the forwarded port.
		 */
		OpenPreview = 3,
		/**
		 * Forward the port silently.
		 */
		Silent = 4,
		/**
		 * Do not forward the port.
		 */
		Ignore = 5
	}

	/**
	 * The attributes that a forwarded port can have.
	 */
	export class PortAttributes {
		/**
		 * The action to be taken when this port is detected for auto forwarding.
		 */
		autoForwardAction: PortAutoForwardAction;

		/**
		 * Creates a new PortAttributes object
		 * @param port the port number
		 * @param autoForwardAction the action to take when this port is detected
		 */
		constructor(autoForwardAction: PortAutoForwardAction);
	}

	/**
	 * A provider of port attributes. Port attributes are used to determine what action should be taken when a port is discovered.
	 */
	export interface PortAttributesProvider {
		/**
		 * Provides attributes for the given port. For ports that your extension doesn't know about, simply
		 * return undefined. For example, if `providePortAttributes` is called with ports 3000 but your
		 * extension doesn't know anything about 3000 you should return undefined.
		 * @param port The port number of the port that attributes are being requested for.
		 * @param pid The pid of the process that is listening on the port. If the pid is unknown, undefined will be passed.
		 * @param commandLine The command line of the process that is listening on the port. If the command line is unknown, undefined will be passed.
		 * @param token A cancellation token that indicates the result is no longer needed.
		 */
		providePortAttributes(attributes: { port: number; pid?: number; commandLine?: string }, token: CancellationToken): ProviderResult<PortAttributes>;
	}

	/**
	 * A selector that will be used to filter which {@link PortAttributesProvider} should be called for each port.
	 */
	export interface PortAttributesSelector {
		/**
		 * Specifying a port range will cause your provider to only be called for ports within the range.
		 * The start is inclusive and the end is exclusive.
		 */
		portRange?: [number, number] | number;

		/**
		 * Specifying a command pattern will cause your provider to only be called for processes whose command line matches the pattern.
		 */
		commandPattern?: RegExp;
	}

	export namespace workspace {
		/**
		 * If your extension listens on ports, consider registering a PortAttributesProvider to provide information
		 * about the ports. For example, a debug extension may know about debug ports in it's debuggee. By providing
		 * this information with a PortAttributesProvider the extension can tell the editor that these ports should be
		 * ignored, since they don't need to be user facing.
		 *
		 * The results of the PortAttributesProvider are merged with the user setting `remote.portsAttributes`. If the values conflict, the user setting takes precedence.
		 *
		 * @param portSelector It is best practice to specify a port selector to avoid unnecessary calls to your provider.
		 * If you don't specify a port selector your provider will be called for every port, which will result in slower port forwarding for the user.
		 * @param provider The {@link PortAttributesProvider PortAttributesProvider}.
		 */
		export function registerPortAttributesProvider(portSelector: PortAttributesSelector, provider: PortAttributesProvider): Disposable;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.profileContentHandlers.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.profileContentHandlers.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	export interface ProfileContentHandler {
		readonly name: string;
		readonly description?: string;
		saveProfile(name: string, content: string, token: CancellationToken): Thenable<{ readonly id: string; readonly link: Uri } | null>;
		readProfile(idOrUri: string | Uri, token: CancellationToken): Thenable<string | null>;
	}

	export namespace window {
		export function registerProfileContentHandler(id: string, profileContentHandler: ProfileContentHandler): Disposable;
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.quickDiffProvider.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.quickDiffProvider.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/169012

	export namespace window {
		export function registerQuickDiffProvider(selector: DocumentSelector, quickDiffProvider: QuickDiffProvider, id: string, label: string, rootUri?: Uri): Disposable;
	}

	export interface SourceControl {
		secondaryQuickDiffProvider?: QuickDiffProvider;
	}

	export interface QuickDiffProvider {
		readonly id?: string;
		readonly label?: string;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.quickInputButtonLocation.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.quickInputButtonLocation.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/175662

	/**
	 * Specifies the location where a {@link QuickInputButton} should be rendered.
	 */
	export enum QuickInputButtonLocation {
		/**
		 * The button is rendered in the title bar.
		 */
		Title = 1,

		/**
		 * The button is rendered inline to the right of the input box.
		 */
		Inline = 2,

		/**
		 * The button is rendered at the far end inside the input box.
		 */
		Input = 3
	}

	export interface QuickInputButton {
		/**
		 * The location where the button should be rendered.
		 *
		 * Defaults to {@link QuickInputButtonLocation.Title}.
		 *
		 * **Note:** This property is ignored if the button was added to a {@link QuickPickItem}.
		 */
		location?: QuickInputButtonLocation;

		/**
		 * When present, indicates that the button is a toggle button that can be checked or unchecked.
		 *
		 * **Note:** This property is currently only applicable to buttons with {@link QuickInputButtonLocation.Input} location.
		 * It must be set for such buttons, and the state will be updated when the button is toggled.
		 * It cannot be set for buttons with other location values.
		 */
		readonly toggle?: { checked: boolean };
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.quickPickItemTooltip.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.quickPickItemTooltip.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/175662

	export interface QuickPickItem {
		/**
		 * An optional tooltip that is displayed when hovering over this item.
		 *
		 * When specified, this tooltip takes precedence over the default hover behavior which shows
		 * the {@link QuickPickItem.description description}.
		 */
		tooltip?: string | MarkdownString;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.quickPickSortByLabel.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.quickPickSortByLabel.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/73904

	export interface QuickPick<T extends QuickPickItem> extends QuickInput {
		/**
		 * Controls whether items should be sorted based on the match position in their labels when filtering.
		 *
		 * When `true`, items are sorted by the position of the first match in the label, with items that
		 * match earlier in the label appearing first. When `false`, items maintain their original order.
		 *
		 * Defaults to `true`.
		 */
		// @API is a bug that we need this API at all. why do we change the sort order
		// when extensions give us a (sorted) array of items?
		// @API sortByLabel isn't a great name
		sortByLabel: boolean;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.remoteCodingAgents.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.remoteCodingAgents.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// empty placeholder for coding agent contribution point from core

// @joshspicer
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.resolvers.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.resolvers.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	//resolvers: @alexdima

	export interface MessageOptions {
		/**
		 * Do not render a native message box.
		 */
		useCustom?: boolean;
	}

	export interface RemoteAuthorityResolverContext {
		resolveAttempt: number;
		/**
		 * Exec server from a recursively-resolved remote authority. If the
		 * remote authority includes nested authorities delimited by `@`, it is
		 * resolved from outer to inner authorities with ExecServer passed down
		 * to each resolver in the chain.
		 */
		execServer?: ExecServer;
	}

	export class ResolvedAuthority {
		readonly host: string;
		readonly port: number;
		readonly connectionToken: string | undefined;

		constructor(host: string, port: number, connectionToken?: string);
	}

	export interface ManagedMessagePassing {
		readonly onDidReceiveMessage: Event<Uint8Array>;
		readonly onDidClose: Event<Error | undefined>;
		readonly onDidEnd: Event<void>;

		send: (data: Uint8Array) => void;
		end: () => void;
		drain?: () => Thenable<void>;
	}

	export class ManagedResolvedAuthority {
		readonly makeConnection: () => Thenable<ManagedMessagePassing>;
		readonly connectionToken: string | undefined;

		constructor(makeConnection: () => Thenable<ManagedMessagePassing>, connectionToken?: string);
	}

	export interface ResolvedOptions {
		extensionHostEnv?: { [key: string]: string | null };

		isTrusted?: boolean;

		/**
		 * When provided, remote server will be initialized with the extensions synced using the given user account.
		 */
		authenticationSessionForInitializingExtensions?: AuthenticationSession & { providerId: string };
	}

	export interface TunnelPrivacy {
		themeIcon: string;
		id: string;
		label: string;
	}

	export namespace env {
		/** Quality of the application. May be undefined if running from sources. */
		export const appQuality: string | undefined;
		/** Commit of the application. May be undefined if running from sources. */
		export const appCommit: string | undefined;
	}

	export interface TunnelOptions {
		remoteAddress: { port: number; host: string };
		// The desired local port. If this port can't be used, then another will be chosen.
		localAddressPort?: number;
		label?: string;
		/**
		 * @deprecated Use privacy instead
		 */
		public?: boolean;
		privacy?: string;
		protocol?: string;
	}

	export interface TunnelDescription {
		remoteAddress: { port: number; host: string };
		//The complete local address(ex. localhost:1234)
		localAddress: { port: number; host: string } | string;
		/**
		 * @deprecated Use privacy instead
		 */
		public?: boolean;
		privacy?: string;
		// If protocol is not provided it is assumed to be http, regardless of the localAddress.
		protocol?: string;
	}

	export interface Tunnel extends TunnelDescription {
		// Implementers of Tunnel should fire onDidDispose when dispose is called.
		readonly onDidDispose: Event<void>;
		dispose(): void | Thenable<void>;
	}

	/**
	 * Used as part of the ResolverResult if the extension has any candidate,
	 * published, or forwarded ports.
	 */
	export interface TunnelInformation {
		/**
		 * Tunnels that are detected by the extension. The remotePort is used for display purposes.
		 * The localAddress should be the complete local address (ex. localhost:1234) for connecting to the port. Tunnels provided through
		 * detected are read-only from the forwarded ports UI.
		 */
		environmentTunnels?: TunnelDescription[];

		tunnelFeatures?: {
			elevation: boolean;
			/**
			 * One of the options must have the ID "private".
			 */
			privacyOptions: TunnelPrivacy[];
			/**
			 * Defaults to true for backwards compatibility.
			 */
			protocol?: boolean;
		};
	}

	export interface TunnelCreationOptions {
		/**
		 * True when the local operating system will require elevation to use the requested local port.
		 */
		elevationRequired?: boolean;
	}

	export enum CandidatePortSource {
		None = 0,
		Process = 1,
		Output = 2,
		Hybrid = 3
	}

	export type ResolverResult = (ResolvedAuthority | ManagedResolvedAuthority) & ResolvedOptions & TunnelInformation;

	export class RemoteAuthorityResolverError extends Error {
		static NotAvailable(message?: string, handled?: boolean): RemoteAuthorityResolverError;
		static TemporarilyNotAvailable(message?: string): RemoteAuthorityResolverError;

		constructor(message?: string);
	}

	/**
	 * An ExecServer allows spawning processes on a remote machine. An ExecServer is provided by resolvers. It can be
	 * acquired by `workspace.getRemoteExecServer` or from the context when in a resolver (`RemoteAuthorityResolverContext.execServer`).
	 */
	export interface ExecServer {
		/**
		 * Spawns a given subprocess with the given command and arguments.
		 * @param command The command to execute.
		 * @param args The arguments to pass to the command.
		 * @param options Additional options for the spawned process.
		 * @returns A promise that gives access to the process' stdin, stdout and stderr streams, as well as the process' exit code.
		 */
		spawn(command: string, args: string[], options?: ExecServerSpawnOptions): Thenable<SpawnedCommand>;

		/**
		 * Spawns an connector that allows to start a remote server. It is assumed the command starts a Code CLI. Additional
		 * arguments will be passed to the connector.
		 * @param command The command to execute. It is assumed the command spawns a Code CLI executable.
		 * @param args The arguments to pass to the connector
		 * @param options Additional options for the spawned process.
		 * @returns A promise that gives access to the spawned {@link RemoteServerConnector}. It also provides a stream to which standard
		 * log messages are written.
		 */
		spawnRemoteServerConnector?(command: string, args: string[], options?: ExecServerSpawnOptions): Thenable<RemoteServerConnector>;

		/**
		 * Downloads the CLI executable of the desired platform and quality and pipes it to the
		 * provided process' stdin.
		 * @param buildTarget The CLI build target to download.
		 * @param command The command to execute. The downloaded bits will be piped to the command's stdin.
		 * @param args The arguments to pass to the command.
		 * @param options Additional options for the spawned process.
		 * @returns A promise that resolves when the process exits with a {@link ProcessExit} object.
		 */
		downloadCliExecutable?(buildTarget: CliBuild, command: string, args: string[], options?: ExecServerSpawnOptions): Thenable<ProcessExit>;

		/**
		 * Gets the environment where the exec server is running.
		 * @returns A promise that resolves to an {@link ExecEnvironment} object.
		 */
		env(): Thenable<ExecEnvironment>;

		/**
		 * Kills a process with the given ID.
		 *
		 * @param processId process ID to kill.
		 */
		kill(processId: number): Thenable<void>;

		/**
		 * Connects to the given TCP host/port on the remote.
		 *
		 * @param host The hostname or IP to connect to
		 * @param port The port number to connect to
		 * @returns a duplex stream, and a promise the resolves when both sides
		 * have closed.
		 */
		tcpConnect(
			host: string,
			port: number,
		): Thenable<{ stream: WriteStream & ReadStream; done: Thenable<void> }>;

		/**
		 * Access to the file system of the remote.
		 */
		readonly fs: RemoteFileSystem;
	}

	export type ProcessEnv = Record<string, string>;

	export interface ExecServerSpawnOptions {
		readonly env?: ProcessEnv;
		readonly cwd?: string;
	}

	export interface SpawnedCommand {
		readonly stdin: WriteStream;
		readonly stdout: ReadStream;
		readonly stderr: ReadStream;
		readonly onExit: Thenable<ProcessExit>;
	}

	export interface RemoteServerConnector {
		readonly logs: ReadStream;
		readonly onExit: Thenable<ProcessExit>;
		/**
		 * Connect to a new code server, returning a stream that can be used to communicate with it.
		 * @param params The parameters for the code server.
		 * @returns A promise that resolves to a {@link ManagedMessagePassing} object that can be used with a resolver
		 */
		connect(params: ServeParams): Thenable<ManagedMessagePassing>;
	}

	export interface ProcessExit {
		readonly status: number;
		readonly message?: string;
	}

	export interface ReadStream {
		readonly onDidReceiveMessage: Event<Uint8Array>;
		readonly onEnd: Thenable<void>;
	}

	export interface WriteStream {
		write(data: Uint8Array): void;
		end(): void;
	}

	export interface ServeParams {
		readonly socketId: number;
		readonly commit?: string;
		readonly quality: string;
		readonly extensions: string[];
		/** Whether server traffic should be compressed. */
		readonly compress?: boolean;
		/** Optional explicit connection token for the server. */
		readonly connectionToken?: string;
	}

	export interface CliBuild {
		readonly quality: string;
		/** 'LinuxAlpineX64' | 'LinuxAlpineARM64', 'LinuxX64' | 'LinuxARM64' | 'LinuxARM32' | 'DarwinX64' | 'DarwinARM64' | 'WindowsX64' | 'WindowsX86' | 'WindowsARM64' */
		readonly buildTarget: string;
		readonly commit: string;
	}

	export interface ExecEnvironment {
		readonly env: ProcessEnv;
		/** 'darwin' | 'linux' | 'win32' */
		readonly osPlatform: string;
		/** uname.version or windows version number, undefined if it could not be read. */
		readonly osRelease?: string;
	}

	export interface RemoteFileSystem {
		/**
		 * Retrieve metadata about a file.
		 *
		 * @param path The path of the file to retrieve metadata about.
		 * @returns The file metadata about the file.
		 * @throws an exception when `path` doesn't exist.
		 */
		stat(path: string): Thenable<FileStat>;

		/**
		 * Recursively creates the given directory on the remote.
		 *
		 * @param path The path of the folder to create
		 * @throws an exception when `path` is a file, or other i/o operations happen
		 */
		mkdirp(path: string): Thenable<void>;

		/**
		 * Recursively deletes the given path on the remote.
		 *
		 * @param path The path of the file or folder to delete.
		 * @throws if an i/o error happens during removal. It does not throw if
		 * the path already does not exist.
		 */
		rm(path: string): Thenable<void>;

		/**
		 * Reads the given file from the remote.
		 *
		 * @param path The path of the file to read.
		 * @throws if the path doesn't exist or can't be accessed
		 * @returns a readable stream of the file data
		 */
		read(path: string): Thenable<ReadStream>;

		/**
		 * Writes the given file on the remote. Truncates the file if it exists.
		 *
		 * @param path The path of the file to write.
		 * @throws if the path can't be accessed
		 * @returns a writable `stream` that accepts data, and a `done` promise that
		 * will resolve after `stream.end()` is called once the write is complete.
		 */
		write(path: string): Thenable<{ stream: WriteStream; done: Thenable<void> }>;

		/**
		 * Connects to the given unix socket or named pipe on the remote.
		 *
		 * @param path The path of the unix socket or named pipe
		 * @throws if the path can't be accessed
		 * @returns a duplex stream, and a promise the resolves when both sides
		 * have closed.
		 */
		connect(path: string): Thenable<{ stream: WriteStream & ReadStream; done: Thenable<void> }>;

		/**
		 * Renames the file.
		 *
		 * @param fromPath The existing file path.
		 * @param toPath The new file path.
		 * @throws if the original path doesn't exist, or the toPath can't be accessed
		 */
		rename(fromPath: string, toPath: string): Thenable<void>;

		/**
		 * Reads the contents of a directory.
		 *
		 * @param path The path of the folder to read.
		 * @throws if the folder doesn't exist
		 * @returns a list of directory entries
		 */
		readdir(path: string): Thenable<DirectoryEntry[]>;
	}

	export interface DirectoryEntry {
		/**
		 * The type of the file, e.g. is a regular file, a directory, or symbolic link
		 * to a file.
		 *
		 * *Note:* This value might be a bitmask, e.g. `FileType.File | FileType.SymbolicLink`.
		 */
		type: FileType;

		/**
		 * Non-absolute name of the file in the directory.
		 */
		name: string;
	}

	export interface RemoteAuthorityResolver {
		/**
		 * Resolve the authority part of the current opened `vscode-remote://` URI.
		 *
		 * This method will be invoked once during the startup of the editor and again each time
		 * the editor detects a disconnection.
		 *
		 * @param authority The authority part of the current opened `vscode-remote://` URI.
		 * @param context A context indicating if this is the first call or a subsequent call.
		 */
		resolve(authority: string, context: RemoteAuthorityResolverContext): ResolverResult | Thenable<ResolverResult>;

		/**
		 * Resolves an exec server interface for the authority. Called if an
		 * authority is a midpoint in a transit to the desired remote.
		 *
		 * @param authority The authority part of the current opened `vscode-remote://` URI.
		 * @returns The exec server interface, as defined in a contract between extensions.
		 */
		resolveExecServer?(remoteAuthority: string, context: RemoteAuthorityResolverContext): ExecServer | Thenable<ExecServer>;

		/**
		 * Get the canonical URI (if applicable) for a `vscode-remote://` URI.
		 *
		 * @returns The canonical URI or undefined if the uri is already canonical.
		 */
		getCanonicalURI?(uri: Uri): ProviderResult<Uri>;

		/**
		 * Can be optionally implemented if the extension can forward ports better than the core.
		 * When not implemented, the core will use its default forwarding logic.
		 * When implemented, the core will use this to forward ports.
		 *
		 * To enable the "Change Local Port" action on forwarded ports, make sure to set the `localAddress` of
		 * the returned `Tunnel` to a `{ port: number, host: string; }` and not a string.
		 */
		tunnelFactory?: (tunnelOptions: TunnelOptions, tunnelCreationOptions: TunnelCreationOptions) => Thenable<Tunnel> | undefined;

		/**p
		 * Provides filtering for candidate ports.
		 */
		showCandidatePort?: (host: string, port: number, detail: string) => Thenable<boolean>;

		/**
		 * @deprecated Return tunnelFeatures as part of the resolver result in tunnelInformation.
		 */
		tunnelFeatures?: {
			elevation: boolean;
			public: boolean;
			privacyOptions: TunnelPrivacy[];
		};

		candidatePortSource?: CandidatePortSource;
	}

	export interface ResourceLabelFormatter {
		scheme: string;
		authority?: string;
		formatting: ResourceLabelFormatting;
	}

	export interface ResourceLabelFormatting {
		label: string; // myLabel:/${path}
		// For historic reasons we use an or string here. Once we finalize this API we should start using enums instead and adopt it in extensions.
		// eslint-disable-next-line local/vscode-dts-literal-or-types, local/vscode-dts-string-type-literals
		separator: '/' | '\\' | '';
		tildify?: boolean;
		normalizeDriveLetter?: boolean;
		workspaceSuffix?: string;
		workspaceTooltip?: string;
		authorityPrefix?: string;
		stripPathStartingSeparator?: boolean;
	}

	export namespace workspace {
		export function registerRemoteAuthorityResolver(authorityPrefix: string, resolver: RemoteAuthorityResolver): Disposable;
		export function registerResourceLabelFormatter(formatter: ResourceLabelFormatter): Disposable;
		export function getRemoteExecServer(authority: string): Thenable<ExecServer | undefined>;
	}

	export namespace env {

		/**
		 * The authority part of the current opened `vscode-remote://` URI.
		 * Defined by extensions, e.g. `ssh-remote+${host}` for remotes using a secure shell.
		 *
		 * *Note* that the value is `undefined` when there is no remote extension host but that the
		 * value is defined in all extension hosts (local and remote) in case a remote extension host
		 * exists. Use {@link Extension.extensionKind} to know if
		 * a specific extension runs remote or not.
		 */
		export const remoteAuthority: string | undefined;

	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.scmActionButton.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.scmActionButton.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {
	// https://github.com/microsoft/vscode/issues/133935

	export interface SourceControlActionButton {
		command: Command & { shortTitle?: string };
		secondaryCommands?: Command[][];
		enabled: boolean;
	}

	export interface SourceControl {
		actionButton?: SourceControlActionButton;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.scmArtifactProvider.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.scmArtifactProvider.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {
	// https://github.com/microsoft/vscode/issues/253665

	export interface SourceControl {
		artifactProvider?: SourceControlArtifactProvider;
	}

	export interface SourceControlArtifactProvider {
		readonly onDidChangeArtifacts: Event<string[]>;

		provideArtifactGroups(token: CancellationToken): ProviderResult<SourceControlArtifactGroup[]>;
		provideArtifacts(group: string, token: CancellationToken): ProviderResult<SourceControlArtifact[]>;
	}

	export interface SourceControlArtifactGroup {
		readonly id: string;
		readonly name: string;
		readonly icon?: IconPath;
		readonly supportsFolders?: boolean;
	}

	export interface SourceControlArtifact {
		readonly id: string;
		readonly name: string;
		readonly description?: string;
		readonly icon?: IconPath;
		readonly timestamp?: number;
		readonly command?: Command;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.scmHistoryProvider.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.scmHistoryProvider.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {
	// https://github.com/microsoft/vscode/issues/185269

	export interface SourceControl {
		historyProvider?: SourceControlHistoryProvider;
	}

	export interface SourceControlHistoryProvider {
		readonly currentHistoryItemRef: SourceControlHistoryItemRef | undefined;
		readonly currentHistoryItemRemoteRef: SourceControlHistoryItemRef | undefined;
		readonly currentHistoryItemBaseRef: SourceControlHistoryItemRef | undefined;

		/**
		 * Fires when the current history item refs (local, remote, base)
		 * change after a user action (ex: commit, checkout, fetch, pull, push)
		 */
		readonly onDidChangeCurrentHistoryItemRefs: Event<void>;

		/**
		 * Fires when history item refs change
		 */
		readonly onDidChangeHistoryItemRefs: Event<SourceControlHistoryItemRefsChangeEvent>;

		provideHistoryItemRefs(historyItemRefs: string[] | undefined, token: CancellationToken): ProviderResult<SourceControlHistoryItemRef[]>;
		provideHistoryItems(options: SourceControlHistoryOptions, token: CancellationToken): ProviderResult<SourceControlHistoryItem[]>;
		provideHistoryItemChanges(historyItemId: string, historyItemParentId: string | undefined, token: CancellationToken): ProviderResult<SourceControlHistoryItemChange[]>;

		resolveHistoryItem(historyItemId: string, token: CancellationToken): ProviderResult<SourceControlHistoryItem>;
		resolveHistoryItemChatContext(historyItemId: string, token: CancellationToken): ProviderResult<string>;
		resolveHistoryItemChangeRangeChatContext(historyItemId: string, historyItemParentId: string, path: string, token: CancellationToken): ProviderResult<string>;
		resolveHistoryItemRefsCommonAncestor(historyItemRefs: string[], token: CancellationToken): ProviderResult<string>;
	}

	export interface SourceControlHistoryOptions {
		readonly skip?: number;
		readonly limit?: number | { id?: string };
		readonly historyItemRefs?: readonly string[];
		readonly filterText?: string;
	}

	export interface SourceControlHistoryItemStatistics {
		readonly files: number;
		readonly insertions: number;
		readonly deletions: number;
	}

	export interface SourceControlHistoryItem {
		readonly id: string;
		readonly parentIds: string[];
		readonly subject: string;
		readonly message: string;
		readonly displayId?: string;
		readonly author?: string;
		readonly authorEmail?: string;
		readonly authorIcon?: IconPath;
		readonly timestamp?: number;
		readonly statistics?: SourceControlHistoryItemStatistics;
		readonly references?: SourceControlHistoryItemRef[];
		readonly tooltip?: MarkdownString | Array<MarkdownString> | undefined;
	}

	export interface SourceControlHistoryItemRef {
		readonly id: string;
		readonly name: string;
		readonly description?: string;
		readonly revision?: string;
		readonly category?: string;
		readonly icon?: IconPath;
	}

	export interface SourceControlHistoryItemChange {
		readonly uri: Uri;
		readonly originalUri: Uri | undefined;
		readonly modifiedUri: Uri | undefined;
	}

	export interface SourceControlHistoryItemRefsChangeEvent {
		readonly added: readonly SourceControlHistoryItemRef[];
		readonly removed: readonly SourceControlHistoryItemRef[];
		readonly modified: readonly SourceControlHistoryItemRef[];

		/**
		 * Flag to indicate if the operation that caused the event to trigger was due
		 * to a user action or a background operation (ex: Auto Fetch). The flag is used
		 * to determine whether to automatically refresh the user interface or present
		 * the user with a visual cue that the user interface is outdated.
		 */
		readonly silent: boolean;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.scmMultiDiffEditor.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.scmMultiDiffEditor.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {
	// https://github.com/microsoft/vscode/issues/199291

	export interface SourceControlResourceState {
		/**
		 * The uri that resolves to the original document of this resource (before the change).
		 * Used for the multi diff editor exclusively.
		 */
		readonly multiDiffEditorOriginalUri?: Uri;

		/**
		 * The uri that resolves to the modified document of this resource (after the change).
		 * Used for the multi diff editor exclusively.
		 */
		readonly multiFileDiffEditorModifiedUri?: Uri;
	}

	export interface SourceControl {
		/**
		 * Create a new {@link SourceControlResourceGroup resource group}.
		 * @param id An `id` for the {@link SourceControlResourceGroup resource group}.
		 * @param label A human-readable string for the {@link SourceControlResourceGroup resource group}.
		 * @param options Options for the {@link SourceControlResourceGroup resource group}.
		 * 				Set `multiDiffEditorEnableViewChanges` to `true` to enable the "View Changes" option which opens the multi file diff editor.
		 * @return An instance of {@link SourceControlResourceGroup resource group}.
		 */
		createResourceGroup(id: string, label: string, options: { multiDiffEditorEnableViewChanges?: boolean }): SourceControlResourceGroup;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.scmProviderOptions.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.scmProviderOptions.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {
	// https://github.com/microsoft/vscode/issues/254910

	export interface SourceControl {
		/**
		 * Context value of the source control. This can be used to contribute source control specific actions.
		 * For example, if a source control is given a context value of `repository`, when contributing actions to `scm/sourceControl/context`
		 * using `menus` extension point, you can specify context value for key `scmProviderContext` in `when` expressions, like `scmProviderContext == repository`.
		 * ```json
		 * "contributes": {
		 *   "menus": {
		 *     "scm/sourceControl/context": [
		 *       {
		 *         "command": "extension.gitAction",
		 *         "when": "scmProviderContext == repository"
		 *       }
		 *     ]
		 *   }
		 * }
		 * ```
		 * This will show action `extension.gitAction` only for source controls with `contextValue` equal to `repository`.
		 */
		contextValue?: string;

		/**
		 * Fired when the parent source control is disposed.
		 */
		readonly onDidDisposeParent: Event<void>;
	}

	export namespace scm {
		export function createSourceControl(id: string, label: string, rootUri?: Uri, iconPath?: IconPath, parent?: SourceControl): SourceControl;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.scmSelectedProvider.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.scmSelectedProvider.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// todo@joaomoreno add issue reference

	export interface SourceControl {

		/**
		 * Whether the source control is selected.
		 */
		readonly selected: boolean;

		/**
		 * An event signaling when the selection state changes.
		 */
		readonly onDidChangeSelection: Event<boolean>;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.scmTextDocument.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.scmTextDocument.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {
	// https://github.com/microsoft/vscode/issues/166615

	/**
	 * Represents the input box in the Source Control viewlet.
	 */
	export interface SourceControlInputBox {

		/**
		 * The {@link TextDocument text} of the input box.
		 */
		readonly document: TextDocument;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.scmValidation.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.scmValidation.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// todo@joaomoreno add issue reference

	/**
	 * Represents the validation type of the Source Control input.
	 */
	export enum SourceControlInputBoxValidationType {

		/**
		 * Something not allowed by the rules of a language or other means.
		 */
		Error = 0,

		/**
		 * Something suspicious but allowed.
		 */
		Warning = 1,

		/**
		 * Something to inform about but not a problem.
		 */
		Information = 2
	}

	export interface SourceControlInputBoxValidation {

		/**
		 * The validation message to display.
		 */
		readonly message: string | MarkdownString;

		/**
		 * The validation type.
		 */
		readonly type: SourceControlInputBoxValidationType;
	}

	/**
	 * Represents the input box in the Source Control viewlet.
	 */
	export interface SourceControlInputBox {

		/**
		 * Shows a transient contextual message on the input.
		 */
		showValidationMessage(message: string | MarkdownString, type: SourceControlInputBoxValidationType): void;

		/**
		 * A validation function for the input box. It's possible to change
		 * the validation provider simply by setting this property to a different function.
		 */
		validateInput?(value: string, cursorPosition: number): ProviderResult<SourceControlInputBoxValidation>;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.shareProvider.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.shareProvider.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// https://github.com/microsoft/vscode/issues/176316 @joyceerhl

declare module 'vscode' {

	/**
	 * Data about an item which can be shared.
	 */
	export interface ShareableItem {
		/**
		 * A resource in the workspace that can be shared.
		 */
		resourceUri: Uri;

		/**
		 * If present, a selection within the `resourceUri`.
		 */
		selection?: Range;
	}

	/**
	 * A provider which generates share links for resources in the editor.
	 */
	export interface ShareProvider {

		/**
		 * A unique ID for the provider.
		 * This will be used to activate specific extensions contributing share providers if necessary.
		 */
		readonly id: string;

		/**
		 * A label which will be used to present this provider's options in the UI.
		 */
		readonly label: string;

		/**
		 * The order in which the provider should be listed in the UI when there are multiple providers.
		 */
		readonly priority: number;

		/**
		 *
		 * @param item Data about an item which can be shared.
		 * @param token A cancellation token.
		 * @returns A {@link Uri} representing an external link or sharing text. The provider result
		 * will be copied to the user's clipboard and presented in a confirmation dialog.
		 */
		provideShare(item: ShareableItem, token: CancellationToken): ProviderResult<Uri | string>;
	}

	export namespace window {

		/**
		 * Register a share provider. An extension may register multiple share providers.
		 * There may be multiple share providers for the same {@link ShareableItem}.
		 * @param selector A document selector to filter whether the provider should be shown for a {@link ShareableItem}.
		 * @param provider A share provider.
		 */
		export function registerShareProvider(selector: DocumentSelector, provider: ShareProvider): Disposable;
	}

	export interface TreeItem {

		/**
		 * An optional property which, when set, inlines a `Share` option in the context menu for this tree item.
		 */
		shareableItem?: ShareableItem;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.speech.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.speech.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	export interface SpeechToTextOptions {
		readonly language?: string;
	}

	export enum SpeechToTextStatus {
		Started = 1,
		Recognizing = 2,
		Recognized = 3,
		Stopped = 4,
		Error = 5
	}

	export interface SpeechToTextEvent {
		readonly status: SpeechToTextStatus;
		readonly text?: string;
	}

	export interface SpeechToTextSession {
		readonly onDidChange: Event<SpeechToTextEvent>;
	}

	export interface TextToSpeechOptions {
		readonly language?: string;
	}

	export enum TextToSpeechStatus {
		Started = 1,
		Stopped = 2,
		Error = 3
	}

	export interface TextToSpeechEvent {
		readonly status: TextToSpeechStatus;
		readonly text?: string;
	}

	export interface TextToSpeechSession {
		readonly onDidChange: Event<TextToSpeechEvent>;

		synthesize(text: string): void;
	}

	export enum KeywordRecognitionStatus {
		Recognized = 1,
		Stopped = 2
	}

	export interface KeywordRecognitionEvent {
		readonly status: KeywordRecognitionStatus;
		readonly text?: string;
	}

	export interface KeywordRecognitionSession {
		readonly onDidChange: Event<KeywordRecognitionEvent>;
	}

	export interface SpeechProvider {
		provideSpeechToTextSession(token: CancellationToken, options?: SpeechToTextOptions): ProviderResult<SpeechToTextSession>;
		provideTextToSpeechSession(token: CancellationToken, options?: TextToSpeechOptions): ProviderResult<TextToSpeechSession>;
		provideKeywordRecognitionSession(token: CancellationToken): ProviderResult<KeywordRecognitionSession>;
	}

	export namespace speech {

		export function registerSpeechProvider(id: string, provider: SpeechProvider): Disposable;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.statusBarItemTooltip.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.statusBarItemTooltip.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/234339

	export interface StatusBarItem {

		/**
		 * The tooltip text when you hover over this entry.
		 *
		 * Can optionally return the tooltip in a thenable if the computation is expensive.
		 */
		tooltip2: string | MarkdownString | undefined | ((token: CancellationToken) => ProviderResult<string | MarkdownString | undefined>);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.tabInputMultiDiff.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.tabInputMultiDiff.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// https://github.com/microsoft/vscode/issues/206411

declare module 'vscode' {

	export class TabInputTextMultiDiff {

		readonly textDiffs: TabInputTextDiff[];

		constructor(textDiffs: TabInputTextDiff[]);
	}

	export interface Tab {

		readonly input: TabInputText | TabInputTextDiff | TabInputTextMultiDiff | TabInputCustom | TabInputWebview | TabInputNotebook | TabInputNotebookDiff | TabInputTerminal | unknown;

	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.tabInputTextMerge.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.tabInputTextMerge.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// https://github.com/microsoft/vscode/issues/153213

declare module 'vscode' {

	export class TabInputTextMerge {

		readonly base: Uri;
		readonly input1: Uri;
		readonly input2: Uri;
		readonly result: Uri;

		constructor(base: Uri, input1: Uri, input2: Uri, result: Uri);
	}

	export interface Tab {

		readonly input: TabInputText | TabInputTextDiff | TabInputTextMerge | TabInputCustom | TabInputWebview | TabInputNotebook | TabInputNotebookDiff | TabInputTerminal | unknown;

	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.taskExecutionTerminal.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.taskExecutionTerminal.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// #234440
declare module 'vscode' {

	export interface TaskExecution {
		/**
		 * The terminal associated with this task execution, if any.
		 */
		terminal?: Terminal;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.taskPresentationGroup.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.taskPresentationGroup.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/47265

	export interface TaskPresentationOptions {
		/**
		 * Controls whether the task is executed in a specific terminal group using split panes.
		 */
		group?: string;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.taskProblemMatcherStatus.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.taskProblemMatcherStatus.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


declare module 'vscode' {


	export interface TaskProblemMatcherStartedEvent {
		/**
		 * The task item representing the task for which the problem matcher processing started.
		 */
		readonly execution: TaskExecution;
	}

	export interface TaskProblemMatcherEndedEvent {
		/**
		 * The task item representing the task for which the problem matcher processing ended.
		 */
		readonly execution: TaskExecution;

		/**
		 * Whether errors were found during the task execution
		 */
		readonly hasErrors: boolean;
	}

	export namespace tasks {

		/**
		 * An event that is emitted when the task's problem matchers start processing lines.
		 */
		export const onDidStartTaskProblemMatchers: Event<TaskProblemMatcherStartedEvent>;

		/**
		 * An event that is emitted when the task problem matchers have finished processing lines.
		 */
		export const onDidEndTaskProblemMatchers: Event<TaskProblemMatcherEndedEvent>;
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.telemetry.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.telemetry.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	export interface TelemetryConfiguration {
		/**
		 * Whether or not usage telemetry collection is allowed
		 */
		readonly isUsageEnabled: boolean;
		/**
		 * Whether or not crash error telemetry collection is allowed
		 */
		readonly isErrorsEnabled: boolean;
		/**
		 * Whether or not crash report collection is allowed
		 */
		readonly isCrashEnabled: boolean;
	}

	export namespace env {
		/**
		 * Indicates what telemetry is enabled / disabled
		 * Can be observed to determine what telemetry the extension is allowed to send
		 */
		export const telemetryConfiguration: TelemetryConfiguration;

		/**
		 * An {@link Event} which fires when the collectable state of telemetry changes
		 * Returns a {@link TelemetryConfiguration} object
		 */
		export const onDidChangeTelemetryConfiguration: Event<TelemetryConfiguration | undefined>;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.terminalCompletionProvider.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.terminalCompletionProvider.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/226562

	/**
	 * A provider that supplies terminal completion items.
	 *
	 * Implementations of this interface should return an array of {@link TerminalCompletionItem} or a
	 * {@link TerminalCompletionList} describing completions for the current command line.
	 *
	 * @example <caption>Simple provider returning a single completion</caption>
	 * window.registerTerminalCompletionProvider({
	 * 	provideTerminalCompletions(terminal, context) {
	 * 		return [{ label: '--help', replacementRange: [Math.max(0, context.cursorPosition - 2), context.cursorPosition] }];
	 * 	}
	 * });
	 */
	export interface TerminalCompletionProvider<T extends TerminalCompletionItem = TerminalCompletionItem> {
		/**
		 * Provide completions for the given terminal and context.
		 * @param terminal The terminal for which completions are being provided.
		 * @param context Information about the terminal's current state.
		 * @param token A cancellation token.
		 * @return A list of completions.
		 */
		provideTerminalCompletions(terminal: Terminal, context: TerminalCompletionContext, token: CancellationToken): ProviderResult<T[] | TerminalCompletionList<T>>;
	}

	/**
	 * Represents a completion suggestion for a terminal command line.
	 *
	 * @example <caption>Completion item for `ls -|`</caption>
	 * const item = {
	 * 	label: '-A',
	 * 	replacementRange: [3, 4], // replace the single character at index 3
	 * 	detail: 'List all entries except for . and .. (always set for the super-user)',
	 * 	kind: TerminalCompletionItemKind.Flag
	 * };
	 *
	 * The fields on a completion item describe what text should be shown to the user
	 * and which portion of the command line should be replaced when the item is accepted.
	 */
	export class TerminalCompletionItem {
		/**
		 * The label of the completion.
		 */
		label: string | CompletionItemLabel;

		/**
		 * The range in the command line to replace when the completion is accepted. Defined
		 * as a tuple where the first entry is the inclusive start index and the second entry is the
		 * exclusive end index.
		 */
		replacementRange: readonly [number, number];

		/**
		 * The completion's detail which appears on the right of the list.
		 */
		detail?: string;

		/**
		 * A human-readable string that represents a doc-comment.
		 */
		documentation?: string | MarkdownString;

		/**
		 * The completion's kind. Note that this will map to an icon. If no kind is provided, a generic icon representing plaintext will be provided.
		 */
		kind?: TerminalCompletionItemKind;

		/**
		 * Creates a new terminal completion item.
		 *
		 * @param label The label of the completion.
		 * @param replacementRange The inclusive start and exclusive end index of the text to replace.
		 * @param kind The completion's kind.
		 */
		constructor(
			label: string | CompletionItemLabel,
			replacementRange: readonly [number, number],
			kind?: TerminalCompletionItemKind
		);
	}

	/**
	 * The kind of an individual terminal completion item.
	 *
	 * The kind is used to render an appropriate icon in the suggest list and to convey the semantic
	 * meaning of the suggestion (file, folder, flag, commit, branch, etc.).
	 */
	export enum TerminalCompletionItemKind {
		/**
		 * A file completion item.
		 * Example: `README.md`
		 */
		File = 0,
		/**
		 * A folder completion item.
		 * Example: `src/`
		 */
		Folder = 1,
		/**
		 * A method completion item.
		 * Example: `git commit`
		 */
		Method = 2,
		/**
		 * An alias completion item.
		 * Example: `ll` as an alias for `ls -l`
		 */
		Alias = 3,
		/**
		 * An argument completion item.
		 * Example: `origin` in `git push origin main`
		 */
		Argument = 4,
		/**
		 * An option completion item. An option value is expected to follow.
		 * Example: `--locale` in `code --locale en`
		 */
		Option = 5,
		/**
		 * The value of an option completion item.
		 * Example: `en-US` in `code --locale en-US`
		 */
		OptionValue = 6,
		/**
		 * A flag completion item.
		 * Example: `--amend` in `git commit --amend`
		 */
		Flag = 7,
		/**
		 * A symbolic link file completion item.
		 * Example: `link.txt` (symlink to a file)
		 */
		SymbolicLinkFile = 8,
		/**
		 * A symbolic link folder completion item.
		 * Example: `node_modules/` (symlink to a folder)
		 */
		SymbolicLinkFolder = 9,
		/**
		 * A source control commit completion item.
		 * Example: `abc1234` (commit hash)
		 */
		ScmCommit = 10,
		/**
		 * A source control branch completion item.
		 * Example: `main`
		 */
		ScmBranch = 11,
		/**
		 * A source control tag completion item.
		 * Example: `v1.0.0`
		 */
		ScmTag = 12,
		/**
		 * A source control stash completion item.
		 * Example: `stash@{0}`
		 */
		ScmStash = 13,
		/**
		 * A source control remote completion item.
		 * Example: `origin`
		 */
		ScmRemote = 14,
		/**
		 * A pull request completion item.
		 * Example: `#42 Add new feature`
		 */
		PullRequest = 15,
		/**
		 * A closed pull request completion item.
		 * Example: `#41 Fix bug (closed)`
		 */
		PullRequestDone = 16,
	}

	/**
	 * Context information passed to {@link TerminalCompletionProvider.provideTerminalCompletions}.
	 *
	 * It contains the full command line and the current cursor position.
	 */
	export interface TerminalCompletionContext {
		/**
		 * The complete terminal command line.
		 */
		readonly commandLine: string;
		/**
		 * The index of the cursor in the command line.
		 */
		readonly cursorIndex: number;
	}

	/**
	 * Represents a collection of {@link TerminalCompletionItem completion items} to be presented
	 * in the terminal plus {@link TerminalCompletionList.resourceOptions} which indicate
	 * which file and folder resources should be requested for the terminal's cwd.
	 *
	 * @example <caption>Create a completion list that requests files for the terminal cwd</caption>
	 * const list = new TerminalCompletionList([
	 * 	{ label: 'ls', replacementRange: [0, 0], kind: TerminalCompletionItemKind.Method }
	 * ], { showFiles: true, cwd: Uri.file('/home/user') });
	 */
	export class TerminalCompletionList<T extends TerminalCompletionItem = TerminalCompletionItem> {

		/**
		 * Resources that should be shown in the completions list for the cwd of the terminal.
		 */
		resourceOptions?: TerminalCompletionResourceOptions;

		/**
		 * The completion items.
		 */
		items: T[];

		/**
		 * Creates a new completion list.
		 *
		 * @param items The completion items.
		 * @param resourceOptions Indicates which resources should be shown as completions for the cwd of the terminal.
		 */
		constructor(items: T[], resourceOptions?: TerminalCompletionResourceOptions);
	}

	/**
	 * Configuration for requesting file and folder resources to be shown as completions.
	 *
	 * When a provider indicates that it wants file/folder resources, the terminal will surface completions for files and
	 * folders that match {@link globPattern} from the provided {@link cwd}.
	 */
	export interface TerminalCompletionResourceOptions {
		/**
		 * Show files as completion items.
		 */
		showFiles: boolean;
		/**
		 * Show folders as completion items.
		 */
		showDirectories: boolean;
		/**
		 * A glob pattern string that controls which files suggest should surface. Note that this will only apply if {@param showFiles} or {@param showDirectories} is set to true.
		 */
		globPattern?: string;
		/**
		 * The cwd from which to request resources.
		 */
		cwd: Uri;
	}

	export namespace window {
		/**
		 * Register a completion provider for terminals.
		 * @param provider The completion provider.
		 * @param triggerCharacters Optional characters that trigger completion. When any of these characters is typed,
		 * the completion provider will be invoked. For example, passing `'-'` would cause the provider to be invoked
		 * whenever the user types a dash character.
		 * @returns A {@link Disposable} that unregisters this provider when being disposed.
		 *
		 * @example <caption>Register a provider for an extension</caption>
		 * window.registerTerminalCompletionProvider({
		 * 	provideTerminalCompletions(terminal, context) {
		 * 		return new TerminalCompletionList([
		 * 			{ label: '--version', replacementRange: [Math.max(0, context.cursorPosition - 2), context.cursorPosition] }
		 * 		]);
		 * 	}
		 * });
		 *
		 * @example <caption>Register a provider with trigger characters</caption>
		 * window.registerTerminalCompletionProvider({
		 * 	provideTerminalCompletions(terminal, context) {
		 * 		return new TerminalCompletionList([
		 * 			{ label: '--help', replacementRange: [Math.max(0, context.cursorPosition - 2), context.cursorPosition] }
		 * 		]);
		 * 	}
		 * }, '-');
		 */
		export function registerTerminalCompletionProvider<T extends TerminalCompletionItem>(provider: TerminalCompletionProvider<T>, ...triggerCharacters: string[]): Disposable;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.terminalDataWriteEvent.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.terminalDataWriteEvent.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/78502
	//
	// This API is still proposed but we don't intent on promoting it to stable due to problems
	// around performance. See #145234 for a more likely API to get stabilized.

	export interface TerminalDataWriteEvent {
		/**
		 * The {@link Terminal} for which the data was written.
		 */
		readonly terminal: Terminal;
		/**
		 * The data being written.
		 */
		readonly data: string;
	}

	namespace window {
		/**
		 * An event which fires when the terminal's child pseudo-device is written to (the shell).
		 * In other words, this provides access to the raw data stream from the process running
		 * within the terminal, including VT sequences.
		 */
		export const onDidWriteTerminalData: Event<TerminalDataWriteEvent>;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.terminalDimensions.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.terminalDimensions.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/55718

	/**
	 * An {@link Event} which fires when a {@link Terminal}'s dimensions change.
	 */
	export interface TerminalDimensionsChangeEvent {
		/**
		 * The {@link Terminal} for which the dimensions have changed.
		 */
		readonly terminal: Terminal;
		/**
		 * The new value for the {@link Terminal.dimensions terminal's dimensions}.
		 */
		readonly dimensions: TerminalDimensions;
	}

	export namespace window {
		/**
		 * An event which fires when the {@link Terminal.dimensions dimensions} of the terminal change.
		 */
		export const onDidChangeTerminalDimensions: Event<TerminalDimensionsChangeEvent>;
	}

	export interface Terminal {
		/**
		 * The current dimensions of the terminal. This will be `undefined` immediately after the
		 * terminal is created as the dimensions are not known until shortly after the terminal is
		 * created.
		 */
		readonly dimensions: TerminalDimensions | undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.terminalExecuteCommandEvent.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.terminalExecuteCommandEvent.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/145234

	export interface TerminalExecutedCommand {
		/**
		 * The {@link Terminal} the command was executed in.
		 */
		terminal: Terminal;
		/**
		 * The full command line that was executed, including both the command and the arguments.
		 */
		commandLine: string | undefined;
		/**
		 * The current working directory that was reported by the shell. This will be a {@link Uri}
		 * if the string reported by the shell can reliably be mapped to the connected machine.
		 */
		cwd: Uri | string | undefined;
		/**
		 * The exit code reported by the shell.
		 */
		exitCode: number | undefined;
		/**
		 * The output of the command when it has finished executing. This is the plain text shown in
		 * the terminal buffer and does not include raw escape sequences. Depending on the shell
		 * setup, this may include the command line as part of the output.
		 */
		output: string | undefined;
	}

	export namespace window {
		/**
		 * An event that is emitted when a terminal with shell integration activated has completed
		 * executing a command.
		 *
		 * Note that this event will not fire if the executed command exits the shell, listen to
		 * {@link onDidCloseTerminal} to handle that case.
		 *
		 * @deprecated Use {@link window.onDidStartTerminalShellExecution}
		 */
		export const onDidExecuteTerminalCommand: Event<TerminalExecutedCommand>;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.terminalQuickFixProvider.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.terminalQuickFixProvider.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/162950

	export type SingleOrMany<T> = T[] | T;

	export interface TerminalQuickFixProvider {
		/**
		 * Provides terminal quick fixes
		 * @param commandMatchResult The command match result for which to provide quick fixes
		 * @param token A cancellation token indicating the result is no longer needed
		 * @return Terminal quick fix(es) if any
		 */
		provideTerminalQuickFixes(commandMatchResult: TerminalCommandMatchResult, token: CancellationToken): ProviderResult<SingleOrMany<TerminalQuickFixTerminalCommand | TerminalQuickFixOpener | Command>>;
	}


	export interface TerminalCommandMatchResult {
		commandLine: string;
		commandLineMatch: RegExpMatchArray;
		outputMatch?: {
			regexMatch: RegExpMatchArray;
			outputLines: string[];
		};
	}

	export namespace window {
		/**
		 * @param provider A terminal quick fix provider
		 * @return A {@link Disposable} that unregisters the provider when being disposed
		 */
		export function registerTerminalQuickFixProvider(id: string, provider: TerminalQuickFixProvider): Disposable;
	}

	export class TerminalQuickFixTerminalCommand {
		/**
		 * The terminal command to insert or run
		 */
		terminalCommand: string;
		/**
		 * Whether the command should be executed or just inserted (default)
		 */
		shouldExecute?: boolean;
		constructor(terminalCommand: string, shouldExecute?: boolean);
	}
	export class TerminalQuickFixOpener {
		/**
		 * The uri to open
		 */
		uri: Uri;
		constructor(uri: Uri);
	}

	/**
	 * A matcher that runs on a sub-section of a terminal command's output
	 */
	export interface TerminalOutputMatcher {
		/**
		 * A string or regex to match against the unwrapped line. If this is a regex with the multiline
		 * flag, it will scan an amount of lines equal to `\n` instances in the regex + 1.
		 */
		lineMatcher: string | RegExp;
		/**
		 * Which side of the output to anchor the {@link offset} and {@link length} against.
		 */
		anchor: TerminalOutputAnchor;
		/**
			 * The number of rows above or below the {@link anchor} to start matching against.
			 */
		offset: number;
		/**
		 * The number of wrapped lines to match against, this should be as small as possible for performance
		 * reasons. This is capped at 40.
		 */
		length: number;
	}

	export enum TerminalOutputAnchor {
		Top = 0,
		Bottom = 1
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.terminalSelection.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.terminalSelection.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/188173

	export interface Terminal {
		/**
		 * The selected text of the terminal or undefined if there is no selection.
		 */
		readonly selection: string | undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.terminalShellEnv.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.terminalShellEnv.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {
	// @anthonykim1 @tyriar https://github.com/microsoft/vscode/issues/227467

	export interface TerminalShellIntegrationEnvironment {
		/**
		 * The dictionary of environment variables.
		 */
		value: { [key: string]: string | undefined };

		/**
		 * Whether the environment came from a trusted source and is therefore safe to use its
		 * values in a manner that could lead to execution of arbitrary code. If this value is
		 * `false`, {@link value} should either not be used for something that could lead to arbitrary
		 * code execution, or the user should be warned beforehand.
		 *
		 * This is `true` only when the environment was reported explicitly and it used a nonce for
		 * verification.
		 */
		isTrusted: boolean;
	}

	export interface TerminalShellIntegration {
		/**
		 * The environment of the shell process. This is undefined if the shell integration script
		 * does not send the environment.
		 */
		readonly env: TerminalShellIntegrationEnvironment | undefined;
	}

	// TODO: Is it fine that this shares onDidChangeTerminalShellIntegration with cwd and the shellIntegration object itself?
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.testObserver.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.testObserver.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/107467

	export namespace tests {
		/**
		 * Requests that tests be run by their controller.
		 * @param run Run options to use.
		 * @param token Cancellation token for the test run
		 */
		export function runTests(run: TestRunRequest, token?: CancellationToken): Thenable<void>;

		/**
		 * Registers a provider that can provide follow-up actions for a test failure.
		 */
		export function registerTestFollowupProvider(provider: TestFollowupProvider): Disposable;

		/**
		 * Returns an observer that watches and can request tests.
		 */
		export function createTestObserver(): TestObserver;
		/**
		 * List of test results stored by the editor, sorted in descending
		 * order by their `completedAt` time.
		 */
		export const testResults: ReadonlyArray<TestRunResult>;

		/**
		 * Event that fires when the {@link testResults} array is updated.
		 */
		export const onDidChangeTestResults: Event<void>;
	}

	export interface TestFollowupProvider {
		provideFollowup(result: TestRunResult, test: TestResultSnapshot, taskIndex: number, messageIndex: number, token: CancellationToken): ProviderResult<Command[]>;
	}

	export interface TestObserver {
		/**
		 * List of tests returned by test provider for files in the workspace.
		 */
		readonly tests: ReadonlyArray<TestItem>;

		/**
		 * An event that fires when an existing test in the collection changes, or
		 * null if a top-level test was added or removed. When fired, the consumer
		 * should check the test item and all its children for changes.
		 */
		readonly onDidChangeTest: Event<TestsChangeEvent>;

		/**
		 * Dispose of the observer, allowing the editor to eventually tell test
		 * providers that they no longer need to update tests.
		 */
		dispose(): void;
	}

	export interface TestsChangeEvent {
		/**
		 * List of all tests that are newly added.
		 */
		readonly added: ReadonlyArray<TestItem>;

		/**
		 * List of existing tests that have updated.
		 */
		readonly updated: ReadonlyArray<TestItem>;

		/**
		 * List of existing tests that have been removed.
		 */
		readonly removed: ReadonlyArray<TestItem>;
	}

	/**
	 * TestResults can be provided to the editor in {@link tests.publishTestResult},
	 * or read from it in {@link tests.testResults}.
	 *
	 * The results contain a 'snapshot' of the tests at the point when the test
	 * run is complete. Therefore, information such as its {@link Range} may be
	 * out of date. If the test still exists in the workspace, consumers can use
	 * its `id` to correlate the result instance with the living test.
	 */
	export interface TestRunResult {
		/**
		 * Unix milliseconds timestamp at which the test run was completed.
		 */
		readonly completedAt: number;

		/**
		 * Optional raw output from the test run.
		 */
		readonly output?: string;

		/**
		 * List of test results. The items in this array are the items that
		 * were passed in the {@link tests.runTests} method.
		 */
		readonly results: ReadonlyArray<Readonly<TestResultSnapshot>>;

		/**
		 * Gets coverage information for a URI. This function is available only
		 * when a test run reported coverage.
		 */
		getDetailedCoverage?(uri: Uri, token?: CancellationToken): Thenable<FileCoverageDetail[]>;
	}

	/**
	 * A {@link TestItem}-like interface with an associated result, which appear
	 * or can be provided in {@link TestResult} interfaces.
	 */
	export interface TestResultSnapshot {
		/**
		 * Unique identifier that matches that of the associated TestItem.
		 * This is used to correlate test results and tests in the document with
		 * those in the workspace (test explorer).
		 */
		readonly id: string;

		/**
		 * Parent of this item.
		 */
		readonly parent?: TestResultSnapshot;

		/**
		 * URI this TestItem is associated with. May be a file or file.
		 */
		readonly uri?: Uri;

		/**
		 * Display name describing the test case.
		 */
		readonly label: string;

		/**
		 * Optional description that appears next to the label.
		 */
		readonly description?: string;

		/**
		 * Location of the test item in its `uri`. This is only meaningful if the
		 * `uri` points to a file.
		 */
		readonly range?: Range;

		/**
		 * State of the test in each task. In the common case, a test will only
		 * be executed in a single task and the length of this array will be 1.
		 */
		readonly taskStates: ReadonlyArray<TestSnapshotTaskState>;

		/**
		 * Optional list of nested tests for this item.
		 */
		readonly children: Readonly<TestResultSnapshot>[];
	}

	export interface TestSnapshotTaskState {
		/**
		 * Current result of the test.
		 */
		readonly state: TestResultState;

		/**
		 * The number of milliseconds the test took to run. This is set once the
		 * `state` is `Passed`, `Failed`, or `Errored`.
		 */
		readonly duration?: number;

		/**
		 * Associated test run message. Can, for example, contain assertion
		 * failure information if the test fails.
		 */
		readonly messages: ReadonlyArray<TestMessage>;
	}

	/**
	 * Possible states of tests in a test run.
	 */
	export enum TestResultState {
		// Test will be run, but is not currently running.
		Queued = 1,
		// Test is currently running
		Running = 2,
		// Test run has passed
		Passed = 3,
		// Test run has failed (on an assertion)
		Failed = 4,
		// Test run has been skipped
		Skipped = 5,
		// Test run failed for some other reason (compilation error, timeout, etc)
		Errored = 6
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.testRelatedCode.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.testRelatedCode.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {
	export interface TestController {
		/**
		 * A provider used for associating code location with tests.
		 */
		relatedCodeProvider?: TestRelatedCodeProvider;
	}

	export interface TestRelatedCodeProvider {
		/**
		 * Returns the tests related to the given code location. This may be called
		 * by the user either explicitly via a "go to test" action, or implicitly
		 * when running tests at a cursor position.
		 *
		 * @param document The document in which the code location is located.
		 * @param position The position in the document.
		 * @param token A cancellation token.
		 * @returns A list of tests related to the position in the code.
		 */
		provideRelatedTests?(document: TextDocument, position: Position, token: CancellationToken): ProviderResult<TestItem[]>;

		/**
		 * Returns the code related to the given test case.
		 *
		 * @param test The test for which to provide related code.
		 * @param token A cancellation token.
		 * @returns A list of locations related to the test.
		 */
		provideRelatedCode?(test: TestItem, token: CancellationToken): ProviderResult<Location[]>;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.textDocumentChangeReason.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.textDocumentChangeReason.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	/**
	 * Detailed information about why a text document changed.
	 */
	export interface TextDocumentDetailedChangeReason {
		/**
		 * The source of the change (e.g., 'inline-completion', 'chat-edit', 'extension')
		 */
		readonly source: string;

		/**
		 * Additional context-specific metadata
		 */
		readonly metadata: { readonly [key: string]: any };
	}

	export interface TextDocumentChangeEvent {
		/**
		 * The precise reason for the document change.
		 * Only available to extensions that have enabled the `textDocumentChangeReason` proposed API.
		 */
		readonly detailedReason: TextDocumentDetailedChangeReason | undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.textEditorDiffInformation.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.textEditorDiffInformation.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {
	// https://github.com/microsoft/vscode/issues/84899

	export enum TextEditorChangeKind {
		Addition = 1,
		Deletion = 2,
		Modification = 3
	}

	export interface TextEditorLineRange {
		readonly startLineNumber: number;
		readonly endLineNumberExclusive: number;
	}

	export interface TextEditorChange {
		readonly original: TextEditorLineRange;
		readonly modified: TextEditorLineRange;
		readonly kind: TextEditorChangeKind;
	}

	export interface TextEditorDiffInformation {
		readonly documentVersion: number;
		readonly original: Uri | undefined;
		readonly modified: Uri;
		readonly changes: readonly TextEditorChange[];
		readonly isStale: boolean;
	}

	export interface TextEditorDiffInformationChangeEvent {
		readonly textEditor: TextEditor;
		readonly diffInformation: TextEditorDiffInformation[] | undefined;
	}

	export interface TextEditor {
		readonly diffInformation: TextEditorDiffInformation[] | undefined;
	}

	export namespace window {
		export const onDidChangeTextEditorDiffInformation: Event<TextEditorDiffInformationChangeEvent>;
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.textSearchComplete2.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.textSearchComplete2.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {
	export interface TextSearchComplete2 {
		/**
		 * Additional information regarding the state of the completed search.
		 *
		 * Messages with "Information" style support links in markdown syntax:
		 * - Click to [run a command](command:workbench.action.OpenQuickPick)
		 * - Click to [open a website](https://aka.ms)
		 *
		 * Commands may optionally return { triggerSearch: true } to signal to the editor that the original search should run be again.
		 */
		message?: TextSearchCompleteMessage2[];
	}

	/**
	 * A message regarding a completed search.
	 */
	export interface TextSearchCompleteMessage2 {
		/**
		 * Markdown text of the message.
		 */
		text: string;
		/**
		 * Whether the source of the message is trusted, command links are disabled for untrusted message sources.
		 * Messaged are untrusted by default.
		 */
		trusted?: boolean;
		/**
		 * The message type, this affects how the message will be rendered.
		 */
		type: TextSearchCompleteMessageType;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.textSearchProvider.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.textSearchProvider.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/59921

	/**
	 * The parameters of a query for text search.
	 */
	export interface TextSearchQuery {
		/**
		 * The text pattern to search for.
		 */
		pattern: string;

		/**
		 * Whether or not `pattern` should match multiple lines of text.
		 */
		isMultiline?: boolean;

		/**
		 * Whether or not `pattern` should be interpreted as a regular expression.
		 */
		isRegExp?: boolean;

		/**
		 * Whether or not the search should be case-sensitive.
		 */
		isCaseSensitive?: boolean;

		/**
		 * Whether or not to search for whole word matches only.
		 */
		isWordMatch?: boolean;
	}

	/**
	 * A file glob pattern to match file paths against.
	 * TODO@roblourens merge this with the GlobPattern docs/definition in vscode.d.ts.
	 * @see {@link GlobPattern}
	 */
	export type GlobString = string;

	/**
	 * Options common to file and text search
	 */
	export interface SearchOptions {
		/**
		 * The root folder to search within.
		 */
		folder: Uri;

		/**
		 * Files that match an `includes` glob pattern should be included in the search.
		 */
		includes: GlobString[];

		/**
		 * Files that match an `excludes` glob pattern should be excluded from the search.
		 */
		excludes: GlobString[];

		/**
		 * Whether external files that exclude files, like .gitignore, should be respected.
		 * See the vscode setting `"search.useIgnoreFiles"`.
		 */
		useIgnoreFiles: boolean;

		/**
		 * Whether symlinks should be followed while searching.
		 * See the vscode setting `"search.followSymlinks"`.
		 */
		followSymlinks: boolean;

		/**
		 * Whether global files that exclude files, like .gitignore, should be respected.
		 * See the vscode setting `"search.useGlobalIgnoreFiles"`.
		 */
		useGlobalIgnoreFiles: boolean;

		/**
		 * Whether files in parent directories that exclude files, like .gitignore, should be respected.
		 * See the vscode setting `"search.useParentIgnoreFiles"`.
		 */
		useParentIgnoreFiles: boolean;
	}

	/**
	 * Options to specify the size of the result text preview.
	 * These options don't affect the size of the match itself, just the amount of preview text.
	 */
	export interface TextSearchPreviewOptions {
		/**
		 * The maximum number of lines in the preview.
		 * Only search providers that support multiline search will ever return more than one line in the match.
		 */
		matchLines: number;

		/**
		 * The maximum number of characters included per line.
		 */
		charsPerLine: number;
	}

	/**
	 * Options that apply to text search.
	 */
	export interface TextSearchOptions extends SearchOptions {
		/**
		 * The maximum number of results to be returned.
		 */
		maxResults: number;

		/**
		 * Options to specify the size of the result text preview.
		 */
		previewOptions?: TextSearchPreviewOptions;

		/**
		 * Exclude files larger than `maxFileSize` in bytes.
		 */
		maxFileSize?: number;

		/**
		 * Interpret files using this encoding.
		 * See the vscode setting `"files.encoding"`
		 */
		encoding?: string;

		/**
		 * Number of lines of context to include before each match.
		 */
		beforeContext?: number;

		/**
		 * Number of lines of context to include after each match.
		 */
		afterContext?: number;
	}

	/**
	 * Represents the severity of a TextSearchComplete message.
	 */
	export enum TextSearchCompleteMessageType {
		Information = 1,
		Warning = 2,
	}

	/**
	 * A message regarding a completed search.
	 */
	export interface TextSearchCompleteMessage {
		/**
		 * Markdown text of the message.
		 */
		text: string;
		/**
		 * Whether the source of the message is trusted, command links are disabled for untrusted message sources.
		 * Messaged are untrusted by default.
		 */
		trusted?: boolean;
		/**
		 * The message type, this affects how the message will be rendered.
		 */
		type: TextSearchCompleteMessageType;
	}

	/**
	 * Information collected when text search is complete.
	 */
	export interface TextSearchComplete {
		/**
		 * Whether the search hit the limit on the maximum number of search results.
		 * `maxResults` on {@linkcode TextSearchOptions} specifies the max number of results.
		 * - If exactly that number of matches exist, this should be false.
		 * - If `maxResults` matches are returned and more exist, this should be true.
		 * - If search hits an internal limit which is less than `maxResults`, this should be true.
		 */
		limitHit?: boolean;

		/**
		 * Additional information regarding the state of the completed search.
		 *
		 * Messages with "Information" style support links in markdown syntax:
		 * - Click to [run a command](command:workbench.action.OpenQuickPick)
		 * - Click to [open a website](https://aka.ms)
		 *
		 * Commands may optionally return { triggerSearch: true } to signal to the editor that the original search should run be again.
		 */
		message?: TextSearchCompleteMessage | TextSearchCompleteMessage[];
	}

	/**
	 * A preview of the text result.
	 */
	export interface TextSearchMatchPreview {
		/**
		 * The matching lines of text, or a portion of the matching line that contains the match.
		 */
		text: string;

		/**
		 * The Range within `text` corresponding to the text of the match.
		 * The number of matches must match the TextSearchMatch's range property.
		 */
		matches: Range | Range[];
	}

	/**
	 * A match from a text search
	 */
	export interface TextSearchMatch {
		/**
		 * The uri for the matching document.
		 */
		uri: Uri;

		/**
		 * The range of the match within the document, or multiple ranges for multiple matches.
		 */
		ranges: Range | Range[];

		/**
		 * A preview of the text match.
		 */
		preview: TextSearchMatchPreview;
	}

	/**
	 * A line of context surrounding a TextSearchMatch.
	 */
	export interface TextSearchContext {
		/**
		 * The uri for the matching document.
		 */
		uri: Uri;

		/**
		 * One line of text.
		 * previewOptions.charsPerLine applies to this
		 */
		text: string;

		/**
		 * The line number of this line of context.
		 */
		lineNumber: number;
	}

	export type TextSearchResult = TextSearchMatch | TextSearchContext;

	/**
	 * A TextSearchProvider provides search results for text results inside files in the workspace.
	 */
	export interface TextSearchProvider {
		/**
		 * Provide results that match the given text pattern.
		 * @param query The parameters for this query.
		 * @param options A set of options to consider while searching.
		 * @param progress A progress callback that must be invoked for all results.
		 * @param token A cancellation token.
		 */
		provideTextSearchResults(query: TextSearchQuery, options: TextSearchOptions, progress: Progress<TextSearchResult>, token: CancellationToken): ProviderResult<TextSearchComplete>;
	}

	export namespace workspace {
		/**
		 * Register a text search provider.
		 *
		 * Only one provider can be registered per scheme.
		 *
		 * @param scheme The provider will be invoked for workspace folders that have this file scheme.
		 * @param provider The provider.
		 * @return A {@link Disposable} that unregisters this provider when being disposed.
		 */
		export function registerTextSearchProvider(scheme: string, provider: TextSearchProvider): Disposable;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.textSearchProvider2.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.textSearchProvider2.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/59921

	/**
	 * The parameters of a query for text search. All optional booleans default to `false`.
	 */
	export interface TextSearchQuery2 {
		/**
		 * The text pattern to search for.
		 *
		 * If pattern contains a newline character (`\n`), the default search behavior
		 * will automatically enable {@link isMultiline}.
		 */
		pattern: string;

		/**
		 * Whether or not {@link pattern} should match multiple lines of text.
		 *
		 * If using the default search provider, this will be interpreted as `true` if
		 * {@link pattern} contains a newline character (`\n`).
		 */
		isMultiline?: boolean;

		/**
		 * Whether or not `pattern` should be interpreted as a regular expression.
		 *
		 * If using the default search provider, this will be interpreted case-insensitively
		 * if {@link isCaseSensitive} is `false` or not set.
		 */
		isRegExp?: boolean;

		/**
		 * Whether or not the search should be case-sensitive.
		 *
		 * If using the default search provider, this can be affected by the `search.smartCase` setting.
		 * See the setting description for more information.
		 */
		isCaseSensitive?: boolean;

		/**
		 * Whether or not to search for whole word matches only.
		 *
		 * If enabled, the default search provider will check for boundary characters
		 * (regex pattern `\b`) surrounding the {@link pattern} to see whether something
		 * is a word match.
		 */
		isWordMatch?: boolean;
	}

	/**
	 * Options that apply to text search.
	 */
	export interface TextSearchProviderOptions {

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
				* Use ignore files at the parent directory. If set, `local` in {@link TextSearchProviderFolderOptions.useIgnoreFiles} should also be `true`.
				*/
				parent: boolean;
				/**
				 * Use global ignore files. If set, `local` in {@link TextSearchProviderFolderOptions.useIgnoreFiles} should also be `true`.
				 */
				global: boolean;
			};

			/**
			 * Interpret files using this encoding.
			 * See the vscode setting `"files.encoding"`
			 */
			encoding: string;
		}[];

		/**
		 * The maximum number of results to be returned.
		 */
		maxResults: number;

		/**
		 * Options to specify the size of the result text preview.
		 */
		previewOptions: {
			/**
			 * The maximum number of lines in the preview.
			 * Only search providers that support multiline search will ever return more than one line in the match.
			 * Defaults to 100.
			 */
			matchLines: number;

			/**
			 * The maximum number of characters included per line.
			 * Defaults to 10000.
			 */
			charsPerLine: number;
		};

		/**
		 * Exclude files larger than `maxFileSize` in bytes.
		 */
		maxFileSize: number | undefined;

		/**
		 * Number of lines of context to include before and after each match.
		 */
		surroundingContext: number;
	}

	/**
	 * Information collected when text search is complete.
	 */
	export interface TextSearchComplete2 {
		/**
		 * Whether the search hit the limit on the maximum number of search results.
		 * `maxResults` on {@link TextSearchProviderOptions} specifies the max number of results.
		 * - If exactly that number of matches exist, this should be false.
		 * - If `maxResults` matches are returned and more exist, this should be true.
		 * - If search hits an internal limit which is less than `maxResults`, this should be true.
		 */
		limitHit?: boolean;
	}

	/**
	 * A query match instance in a file.
	 *
	 * For example, consider this excerpt:
	 *
	 * ```ts
	 * const bar = 1;
	 * console.log(bar);
	 * const foo = bar;
	 * ```
	 *
	 * If the query is `log`, then the line `console.log(bar);` should be represented using a {@link TextSearchMatch2}.
	 */
	export class TextSearchMatch2 {
		/**
		 * @param uri The uri for the matching document.
		 * @param ranges The ranges associated with this match.
		 * @param previewText The text that is used to preview the match. The highlighted range in `previewText` is specified in `ranges`.
		 */
		constructor(uri: Uri, ranges: { sourceRange: Range; previewRange: Range }[], previewText: string);

		/**
		 * The uri for the matching document.
		 */
		uri: Uri;

		/**
		 * The ranges associated with this match.
		 */
		ranges: {
			/**
			 * The range of the match within the document, or multiple ranges for multiple matches.
			 */
			sourceRange: Range;
			/**
			 * The Range within `previewText` corresponding to the text of the match.
			 */
			previewRange: Range;
		}[];

		previewText: string;
	}

	/**
	 * The context lines of text that are not a part of a match,
	 * but that surround a match line of type {@link TextSearchMatch2}.
	 *
	 * For example, consider this excerpt:
	 *
	 * ```ts
	 * const bar = 1;
	 * console.log(bar);
	 * const foo = bar;
	 * ```
	 *
	 * If the query is `log`, then the lines `const bar = 1;` and `const foo = bar;`
	 * should be represented using two separate {@link TextSearchContext2} for the search instance.
	 * This example assumes that the finder requests one line of surrounding context.
	 */
	export class TextSearchContext2 {
		/**
		 * @param uri The uri for the matching document.
		 * @param text The line of context text.
		 * @param lineNumber The line number of this line of context.
		 */
		constructor(uri: Uri, text: string, lineNumber: number);

		/**
		 * The uri for the matching document.
		 */
		uri: Uri;

		/**
		 * One line of text.
		 * previewOptions.charsPerLine applies to this
		 */
		text: string;

		/**
		 * The line number of this line of context.
		 */
		lineNumber: number;
	}

	/**
	 * Keyword suggestion for AI search.
	 */
	export class AISearchKeyword {
		/**
		 * @param keyword The keyword associated with the search.
		 */
		constructor(keyword: string);

		/**
		 * The keyword associated with the search.
		 */
		keyword: string;
	}

	/**
	 * A result payload for a text search, pertaining to {@link TextSearchMatch2 matches}
	 * and its associated {@link TextSearchContext2 context} within a single file.
	 */
	export type TextSearchResult2 = TextSearchMatch2 | TextSearchContext2;

	/**
	 * A result payload for an AI search.
	 * This can be a {@link TextSearchMatch2 match} or a {@link AISearchKeyword keyword}.
	 * The result can be a match or a keyword.
	 */
	export type AISearchResult = TextSearchResult2 | AISearchKeyword;

	/**
	 * A TextSearchProvider provides search results for text results inside files in the workspace.
	 */
	export interface TextSearchProvider2 {
		/**
		 * Provide results that match the given text pattern.
		 * @param query The parameters for this query.
		 * @param options A set of options to consider while searching.
		 * @param progress A progress callback that must be invoked for all {@link TextSearchResult2 results}.
		 * These results can be direct matches, or context that surrounds matches.
		 * @param token A cancellation token.
		 */
		provideTextSearchResults(query: TextSearchQuery2, options: TextSearchProviderOptions, progress: Progress<AISearchResult>, token: CancellationToken): ProviderResult<TextSearchComplete2>;
	}

	export namespace workspace {
		/**
		 * Register a text search provider.
		 *
		 * Only one provider can be registered per scheme.
		 *
		 * @param scheme The provider will be invoked for workspace folders that have this file scheme.
		 * @param provider The provider.
		 * @return A {@link Disposable} that unregisters this provider when being disposed.
		 */
		export function registerTextSearchProvider2(scheme: string, provider: TextSearchProvider2): Disposable;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.timeline.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.timeline.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/84297

	export class TimelineItem {
		/**
		 * A timestamp (in milliseconds since 1 January 1970 00:00:00) for when the timeline item occurred.
		 */
		timestamp: number;

		/**
		 * A human-readable string describing the timeline item.
		 */
		label: string;

		/**
		 * Optional id for the timeline item. It must be unique across all the timeline items provided by this source.
		 *
		 * If not provided, an id is generated using the timeline item's timestamp.
		 */
		id?: string;

		/**
		 * The icon path or {@link ThemeIcon} for the timeline item.
		 */
		iconPath?: Uri | { light: Uri; dark: Uri } | ThemeIcon;

		/**
		 * A human readable string describing less prominent details of the timeline item.
		 */
		description?: string;

		/**
		 * The tooltip text when you hover over the timeline item.
		 */
		tooltip?: string | MarkdownString | undefined;

		/**
		 * The {@link Command} that should be executed when the timeline item is selected.
		 */
		command?: Command;

		/**
		 * Context value of the timeline item. This can be used to contribute specific actions to the item.
		 * For example, a timeline item is given a context value as `commit`. When contributing actions to `timeline/item/context`
		 * using `menus` extension point, you can specify context value for key `timelineItem` in `when` expression like `timelineItem == commit`.
		 * ```
		 *	"contributes": {
		 *		"menus": {
		 *			"timeline/item/context": [
		 *				{
		 *					"command": "extension.copyCommitId",
		 *					"when": "timelineItem == commit"
		 *				}
		 *			]
		 *		}
		 *	}
		 * ```
		 * This will show the `extension.copyCommitId` action only for items where `contextValue` is `commit`.
		 */
		contextValue?: string;

		/**
		 * Accessibility information used when screen reader interacts with this timeline item.
		 */
		accessibilityInformation?: AccessibilityInformation;

		/**
		 * @param label A human-readable string describing the timeline item
		 * @param timestamp A timestamp (in milliseconds since 1 January 1970 00:00:00) for when the timeline item occurred
		 */
		constructor(label: string, timestamp: number);
	}

	export interface TimelineChangeEvent {
		/**
		 * The {@link Uri} of the resource for which the timeline changed.
		 */
		uri: Uri;

		/**
		 * A flag which indicates whether the entire timeline should be reset.
		 */
		reset?: boolean;
	}

	export interface Timeline {
		readonly paging?: {
			/**
			 * A provider-defined cursor specifying the starting point of timeline items which are after the ones returned.
			 * Use `undefined` to signal that there are no more items to be returned.
			 */
			readonly cursor: string | undefined;
		};

		/**
		 * An array of {@link TimelineItem timeline items}.
		 */
		readonly items: readonly TimelineItem[];
	}

	export interface TimelineOptions {
		/**
		 * A provider-defined cursor specifying the starting point of the timeline items that should be returned.
		 */
		cursor?: string;

		/**
		 * An optional maximum number timeline items or the all timeline items newer (inclusive) than the timestamp or id that should be returned.
		 * If `undefined` all timeline items should be returned.
		 */
		limit?: number | { timestamp: number; id?: string };
	}

	export interface TimelineProvider {
		/**
		 * An optional event to signal that the timeline for a source has changed.
		 * To signal that the timeline for all resources (uris) has changed, do not pass any argument or pass `undefined`.
		 */
		readonly onDidChange?: Event<TimelineChangeEvent | undefined>;

		/**
		 * An identifier of the source of the timeline items. This can be used to filter sources.
		 */
		readonly id: string;

		/**
		 * A human-readable string describing the source of the timeline items. This can be used as the display label when filtering sources.
		 */
		readonly label: string;

		/**
		 * Provide {@link TimelineItem timeline items} for a {@link Uri}.
		 *
		 * @param uri The {@link Uri} of the file to provide the timeline for.
		 * @param options A set of options to determine how results should be returned.
		 * @param token A cancellation token.
		 * @return The {@link TimelineResult timeline result} or a thenable that resolves to such. The lack of a result
		 * can be signaled by returning `undefined`, `null`, or an empty array.
		 */
		provideTimeline(uri: Uri, options: TimelineOptions, token: CancellationToken): ProviderResult<Timeline>;
	}

	export namespace workspace {
		/**
		 * Register a timeline provider.
		 *
		 * Multiple providers can be registered. In that case, providers are asked in
		 * parallel and the results are merged. A failing provider (rejected promise or exception) will
		 * not cause a failure of the whole operation.
		 *
		 * @param scheme A scheme or schemes that defines which documents this provider is applicable to. Can be `*` to target all documents.
		 * @param provider A timeline provider.
		 * @return A {@link Disposable} that unregisters this provider when being disposed.
		*/
		export function registerTimelineProvider(scheme: string | string[], provider: TimelineProvider): Disposable;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.tokenInformation.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.tokenInformation.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/91555

	export enum StandardTokenType {
		Other = 0,
		Comment = 1,
		String = 2,
		RegEx = 3
	}

	export interface TokenInformation {
		type: StandardTokenType;
		range: Range;
	}

	export namespace languages {
		/** @deprecated */
		export function getTokenInformationAtPosition(document: TextDocument, position: Position): Thenable<TokenInformation>;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.toolProgress.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.toolProgress.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	/**
	 * A progress update during an {@link LanguageModelTool.invoke} call.
	 */
	export interface ToolProgressStep {
		/**
		 * A progress message that represents a chunk of work
		 */
		message?: string | MarkdownString;
		/**
		 * An increment for discrete progress. Increments will be summed up until 100 (100%) is reached
		 */
		increment?: number;
	}

	export interface LanguageModelTool<T> {
		invoke(options: LanguageModelToolInvocationOptions<T>, token: CancellationToken, progress: Progress<ToolProgressStep>): ProviderResult<LanguageModelToolResult>;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.treeItemMarkdownLabel.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.treeItemMarkdownLabel.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// @kycutler https://github.com/microsoft/vscode/issues/271523

	export interface TreeItemLabel2 {
		highlights?: [number, number][];

		/**
		 * A human-readable string or MarkdownString describing the {@link TreeItem Tree item}.
		 *
		 * When using MarkdownString, only the following Markdown syntax is supported:
		 * - Icons (e.g., `$(icon-name)`, when the `supportIcons` flag is also set)
		 * - Bold, italics, and strikethrough formatting, but only when the syntax wraps the entire string
		 *   (e.g., `**bold**`, `_italic_`, `~~strikethrough~~`)
		 */
		label: string | MarkdownString;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.treeViewActiveItem.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.treeViewActiveItem.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/170248

	export interface TreeView<T> extends Disposable {
		/**
		 * Currently active item.
		 */
		readonly activeItem: T | undefined;
		/**
		 * Event that is fired when the {@link TreeView.activeItem active item} has changed
		 */
		readonly onDidChangeActiveItem: Event<TreeViewActiveItemChangeEvent<T>>;
	}

	/**
	 * The event that is fired when there is a change in {@link TreeView.activeItem tree view's active item}
	 */
	export interface TreeViewActiveItemChangeEvent<T> {
		/**
		 * Active item.
		 */
		readonly activeItem: T | undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.treeViewMarkdownMessage.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.treeViewMarkdownMessage.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	export interface TreeView2<T> extends Disposable {
		readonly onDidExpandElement: Event<TreeViewExpansionEvent<T>>;
		readonly onDidCollapseElement: Event<TreeViewExpansionEvent<T>>;
		readonly selection: readonly T[];
		readonly onDidChangeSelection: Event<TreeViewSelectionChangeEvent<T>>;
		readonly visible: boolean;
		readonly onDidChangeVisibility: Event<TreeViewVisibilityChangeEvent>;
		readonly onDidChangeCheckboxState: Event<TreeCheckboxChangeEvent<T>>;
		title?: string;
		description?: string;
		badge?: ViewBadge | undefined;
		reveal(element: T, options?: { select?: boolean; focus?: boolean; expand?: boolean | number }): Thenable<void>;

		/**
		 * An optional human-readable message that will be rendered in the view.
		 * Only a subset of markdown is supported.
		 * Setting the message to null, undefined, or empty string will remove the message from the view.
		 */
		message?: string | MarkdownString;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.treeViewReveal.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.treeViewReveal.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/61313 @alexr00

	export interface TreeView<T> extends Disposable {
		reveal(element: T | undefined, options?: { select?: boolean; focus?: boolean; expand?: boolean | number }): Thenable<void>;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.tunnelFactory.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.tunnelFactory.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {
	/**
	 * Used as part of the ResolverResult if the extension has any candidate,
	 * published, or forwarded ports.
	 */
	export interface TunnelInformation {
		/**
		 * Tunnels that are detected by the extension. The remotePort is used for display purposes.
		 * The localAddress should be the complete local address (ex. localhost:1234) for connecting to the port. Tunnels provided through
		 * environmentTunnels are read-only from the forwarded ports UI.
		 */
		environmentTunnels?: TunnelDescription[];

		tunnelFeatures?: {
			elevation: boolean;
			/**
			 * One of the options must have the ID "private".
			 */
			privacyOptions: TunnelPrivacy[];
			/**
			 * Defaults to true for backwards compatibility.
			 */
			protocol?: boolean;
		};
	}

	export interface TunnelProvider {
		/**
		 * Provides port forwarding capabilities. If there is a resolver that already provides tunnels, then the resolver's provider will
		 * be used. If multiple providers are registered, then only the first will be used.
		 */
		provideTunnel(tunnelOptions: TunnelOptions, tunnelCreationOptions: TunnelCreationOptions, token: CancellationToken): ProviderResult<Tunnel>;
	}

	export namespace workspace {
		/**
		 * Registering a tunnel provider enables port forwarding. This will cause the Ports view to show.
		 * @param provider
		 */
		export function registerTunnelProvider(provider: TunnelProvider, information: TunnelInformation): Thenable<Disposable>;
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.tunnels.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.tunnels.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// tunnels @alexr00

	export interface TunnelOptions {
		remoteAddress: { port: number; host: string };
		// The desired local port. If this port can't be used, then another will be chosen.
		localAddressPort?: number;
		label?: string;
		/**
		 * @deprecated Use privacy instead
		 */
		public?: boolean;
		privacy?: string;
		protocol?: string;
	}

	export interface TunnelDescription {
		remoteAddress: { port: number; host: string };
		//The complete local address(ex. localhost:1234)
		localAddress: { port: number; host: string } | string;
		/**
		 * @deprecated Use privacy instead
		 */
		public?: boolean;
		privacy?: string;
		// If protocol is not provided it is assumed to be http, regardless of the localAddress.
		protocol?: string;
	}

	export interface Tunnel extends TunnelDescription {
		// Implementers of Tunnel should fire onDidDispose when dispose is called.
		readonly onDidDispose: Event<void>;
		dispose(): void | Thenable<void>;
	}

	export namespace workspace {
		/**
		 * Forwards a port. If the current resolver implements RemoteAuthorityResolver:forwardPort then that will be used to make the tunnel.
		 * By default, openTunnel only support localhost; however, RemoteAuthorityResolver:tunnelFactory can be used to support other ips.
		 *
		 * @throws When run in an environment without a remote.
		 *
		 * @param tunnelOptions The `localPort` is a suggestion only. If that port is not available another will be chosen.
		 */
		export function openTunnel(tunnelOptions: TunnelOptions): Thenable<Tunnel>;

		/**
		 * Gets an array of the currently available tunnels. This does not include environment tunnels, only tunnels that have been created by the user.
		 * Note that these are of type TunnelDescription and cannot be disposed.
		 */
		export let tunnels: Thenable<TunnelDescription[]>;

		/**
		 * Fired when the list of tunnels has changed.
		 */
		export const onDidChangeTunnels: Event<void>;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.valueSelectionInQuickPick.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.valueSelectionInQuickPick.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {
	// @CrafterKolyan https://github.com/microsoft/vscode/issues/233274

	export interface QuickPick<T> {
		/**
		 * Selection range in the input value. Defined as tuple of two number where the
		 * first is the inclusive start index and the second the exclusive end index. When
		 * `undefined` the whole pre-filled value will be selected, when empty (start equals end)
		 * only the cursor will be set, otherwise the defined range will be selected.
		 *
		 * This property does not get updated when the user types or makes a selection,
		 * but it can be updated by the extension.
		 */
		valueSelection: readonly [number, number] | undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/vscode.proposed.workspaceTrust.d.ts]---
Location: vscode-main/src/vscode-dts/vscode.proposed.workspaceTrust.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/120173

	/**
	 * The object describing the properties of the workspace trust request
	 */
	export interface WorkspaceTrustRequestOptions {
		/**
		 * Custom message describing the user action that requires workspace
		 * trust. If omitted, a generic message will be displayed in the workspace
		 * trust request dialog.
		 */
		readonly message?: string;
	}

	export namespace workspace {
		/**
		 * Prompt the user to chose whether to trust the current workspace
		 * @param options Optional object describing the properties of the
		 * workspace trust request.
		 */
		export function requestWorkspaceTrust(options?: WorkspaceTrustRequestOptions): Thenable<boolean | undefined>;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: test/.mocharc.json]---
Location: vscode-main/test/.mocharc.json

```json
{
	"$schema": "https://www.schemastore.org/mocharc",
	"ui": "tdd",
	"timeout": 10000
}
```

--------------------------------------------------------------------------------

---[FILE: test/cgmanifest.json]---
Location: vscode-main/test/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "git",
				"git": {
					"name": "Jxck/assert",
					"repositoryUrl": "https://github.com/Jxck/assert",
					"commitHash": "a617d24d4e752e4299a6de4f78b1c23bfa9c49e8"
				}
			},
			"licenseDetail": [
				"The MIT License (MIT)",
				"",
				"Copyright (c) 2011 Jxck",
				"",
				"Originally from node.js (http://nodejs.org)",
				"Copyright Joyent, Inc.",
				"",
				"Permission is hereby granted, free of charge, to any person obtaining a copy",
				"of this software and associated documentation files (the \"Software\"), to deal",
				"in the Software without restriction, including without limitation the rights",
				"to use, copy, modify, merge, publish, distribute, sublicense, and/or sell",
				"copies of the Software, and to permit persons to whom the Software is",
				"furnished to do so, subject to the following conditions:",
				"",
				"The above copyright notice and this permission notice shall be included in all",
				"copies or substantial portions of the Software.",
				"",
				"THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR",
				"IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,",
				"FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE",
				"AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER",
				"LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,",
				"OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE."
			],
			"developmentDependency": true,
			"license": "MIT",
			"version": "1.0.0"
		}
	],
	"version": 1
}
```

--------------------------------------------------------------------------------

---[FILE: test/package.json]---
Location: vscode-main/test/package.json

```json
{
	"type": "commonjs"
}
```

--------------------------------------------------------------------------------

---[FILE: test/README.md]---
Location: vscode-main/test/README.md

```markdown
# VSCode Tests

## Contents

This folder contains the various test runners for VSCode. Please refer to the documentation within for how to run them:

* `unit`: our suite of unit tests ([README](unit/README.md))
* `integration`: our suite of API tests ([README](integration/browser/README.md))
* `smoke`: our suite of automated UI tests ([README](smoke/README.md))
```

--------------------------------------------------------------------------------

---[FILE: test/automation/.gitignore]---
Location: vscode-main/test/automation/.gitignore

```text
.DS_Store
npm-debug.log
Thumbs.db
node_modules/
out/
keybindings.*.json
src/driver.d.ts
*.tgz
```

--------------------------------------------------------------------------------

---[FILE: test/automation/.npmignore]---
Location: vscode-main/test/automation/.npmignore

```text
!/out
/src
/tools
.gitignore
tsconfig.json
*.tgz
```

--------------------------------------------------------------------------------

````
