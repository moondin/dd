---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 97
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 97 of 552)

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

---[FILE: extensions/typescript-language-features/src/languageFeatures/quickFix.ts]---
Location: vscode-main/extensions/typescript-language-features/src/languageFeatures/quickFix.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { Command, CommandManager } from '../commands/commandManager';
import { DocumentSelector } from '../configuration/documentSelector';
import { TelemetryReporter } from '../logging/telemetry';
import * as fixNames from '../tsServer/protocol/fixNames';
import type * as Proto from '../tsServer/protocol/protocol';
import * as typeConverters from '../typeConverters';
import { ClientCapability, ITypeScriptServiceClient } from '../typescriptService';
import { nulToken } from '../utils/cancellation';
import { Lazy } from '../utils/lazy';
import { equals } from '../utils/objects';
import { DiagnosticsManager } from './diagnostics';
import FileConfigurationManager from './fileConfigurationManager';
import { applyCodeActionCommands, getEditForCodeAction } from './util/codeAction';
import { CompositeCommand, EditorChatFollowUp, EditorChatFollowUp_Args, Expand } from './util/copilot';
import { conditionalRegistration, requireSomeCapability } from './util/dependentRegistration';

type ApplyCodeActionCommand_args = {
	readonly document: vscode.TextDocument;
	readonly diagnostic: vscode.Diagnostic;
	readonly action: Proto.CodeFixAction;
	readonly followupAction?: Command;
};

class ApplyCodeActionCommand implements Command {
	public static readonly ID = '_typescript.applyCodeActionCommand';
	public readonly id = ApplyCodeActionCommand.ID;

	constructor(
		private readonly client: ITypeScriptServiceClient,
		private readonly diagnosticManager: DiagnosticsManager,
		private readonly telemetryReporter: TelemetryReporter,
	) { }

	public async execute({ document, action, diagnostic, followupAction }: ApplyCodeActionCommand_args): Promise<boolean> {
		/* __GDPR__
			"quickFix.execute" : {
				"owner": "mjbvz",
				"fixName" : { "classification": "PublicNonPersonalData", "purpose": "FeatureInsight" },
				"${include}": [
					"${TypeScriptCommonProperties}"
				]
			}
		*/
		this.telemetryReporter.logTelemetry('quickFix.execute', {
			fixName: action.fixName
		});

		this.diagnosticManager.deleteDiagnostic(document.uri, diagnostic);
		const codeActionResult = await applyCodeActionCommands(this.client, action.commands, nulToken);
		await followupAction?.execute();
		return codeActionResult;
	}
}

type ApplyFixAllCodeAction_args = {
	readonly action: VsCodeFixAllCodeAction;
};

class ApplyFixAllCodeAction implements Command {
	public static readonly ID = '_typescript.applyFixAllCodeAction';
	public readonly id = ApplyFixAllCodeAction.ID;

	constructor(
		private readonly client: ITypeScriptServiceClient,
		private readonly telemetryReporter: TelemetryReporter,
	) { }

	public async execute(args: ApplyFixAllCodeAction_args): Promise<void> {
		/* __GDPR__
			"quickFixAll.execute" : {
				"owner": "mjbvz",
				"fixName" : { "classification": "PublicNonPersonalData", "purpose": "FeatureInsight" },
				"${include}": [
					"${TypeScriptCommonProperties}"
				]
			}
		*/
		this.telemetryReporter.logTelemetry('quickFixAll.execute', {
			fixName: args.action.tsAction.fixName
		});

		if (args.action.combinedResponse) {
			await applyCodeActionCommands(this.client, args.action.combinedResponse.body.commands, nulToken);
		}
	}
}

/**
 * Unique set of diagnostics keyed on diagnostic range and error code.
 */
class DiagnosticsSet {
	public static from(diagnostics: vscode.Diagnostic[]) {
		const values = new Map<string, vscode.Diagnostic>();
		for (const diagnostic of diagnostics) {
			values.set(DiagnosticsSet.key(diagnostic), diagnostic);
		}
		return new DiagnosticsSet(values);
	}

	private static key(diagnostic: vscode.Diagnostic) {
		const { start, end } = diagnostic.range;
		return `${diagnostic.code}-${start.line},${start.character}-${end.line},${end.character}`;
	}

	private constructor(
		private readonly _values: Map<string, vscode.Diagnostic>
	) { }

	public get values(): Iterable<vscode.Diagnostic> {
		return this._values.values();
	}

	public get size() {
		return this._values.size;
	}
}

class VsCodeCodeAction extends vscode.CodeAction {
	constructor(
		public readonly tsAction: Proto.CodeFixAction,
		title: string,
		kind: vscode.CodeActionKind
	) {
		super(title, kind);
	}
}

class VsCodeFixAllCodeAction extends VsCodeCodeAction {
	constructor(
		tsAction: Proto.CodeFixAction,
		public readonly file: string,
		title: string,
		kind: vscode.CodeActionKind
	) {
		super(tsAction, title, kind);
	}

	public combinedResponse?: Proto.GetCombinedCodeFixResponse;
}

class CodeActionSet {
	private readonly _actions = new Set<VsCodeCodeAction>();
	private readonly _fixAllActions = new Map<{}, VsCodeCodeAction>();
	private readonly _aiActions = new Set<VsCodeCodeAction>();

	public *values(): Iterable<VsCodeCodeAction> {
		yield* this._actions;
		yield* this._aiActions;
	}

	public addAction(action: VsCodeCodeAction) {
		if (action.isAI) {
			// there are no separate fixAllActions for AI, and no duplicates, so return immediately
			this._aiActions.add(action);
			return;
		}
		for (const existing of this._actions) {
			if (action.tsAction.fixName === existing.tsAction.fixName && equals(action.edit, existing.edit)) {
				this._actions.delete(existing);
			}
		}

		this._actions.add(action);

		if (action.tsAction.fixId) {
			// If we have an existing fix all action, then make sure it follows this action
			const existingFixAll = this._fixAllActions.get(action.tsAction.fixId);
			if (existingFixAll) {
				this._actions.delete(existingFixAll);
				this._actions.add(existingFixAll);
			}
		}
	}

	public addFixAllAction(fixId: {}, action: VsCodeCodeAction) {
		const existing = this._fixAllActions.get(fixId);
		if (existing) {
			// reinsert action at back of actions list
			this._actions.delete(existing);
		}
		this.addAction(action);
		this._fixAllActions.set(fixId, action);
	}

	public hasFixAllAction(fixId: {}) {
		return this._fixAllActions.has(fixId);
	}
}

class SupportedCodeActionProvider {
	public constructor(
		private readonly client: ITypeScriptServiceClient
	) { }

	public async getFixableDiagnosticsForContext(diagnostics: readonly vscode.Diagnostic[]): Promise<DiagnosticsSet> {
		const fixableCodes = await this.fixableDiagnosticCodes.value;
		return DiagnosticsSet.from(
			diagnostics.filter(diagnostic => typeof diagnostic.code !== 'undefined' && fixableCodes.has(diagnostic.code + '')));
	}

	private readonly fixableDiagnosticCodes = new Lazy<Thenable<Set<string>>>(() => {
		return this.client.execute('getSupportedCodeFixes', null, nulToken)
			.then(response => response.type === 'response' ? response.body || [] : [])
			.then(codes => new Set(codes));
	});
}

class TypeScriptQuickFixProvider implements vscode.CodeActionProvider<VsCodeCodeAction> {

	private static readonly _maxCodeActionsPerFile: number = 1000;

	public static readonly metadata: vscode.CodeActionProviderMetadata = {
		providedCodeActionKinds: [vscode.CodeActionKind.QuickFix]
	};

	private readonly supportedCodeActionProvider: SupportedCodeActionProvider;

	constructor(
		private readonly client: ITypeScriptServiceClient,
		private readonly formattingConfigurationManager: FileConfigurationManager,
		commandManager: CommandManager,
		private readonly diagnosticsManager: DiagnosticsManager,
		telemetryReporter: TelemetryReporter
	) {
		commandManager.register(new CompositeCommand());
		commandManager.register(new ApplyCodeActionCommand(client, diagnosticsManager, telemetryReporter));
		commandManager.register(new ApplyFixAllCodeAction(client, telemetryReporter));
		commandManager.register(new EditorChatFollowUp(client, telemetryReporter));

		this.supportedCodeActionProvider = new SupportedCodeActionProvider(client);
	}

	public async provideCodeActions(
		document: vscode.TextDocument,
		range: vscode.Range,
		context: vscode.CodeActionContext,
		token: vscode.CancellationToken
	): Promise<VsCodeCodeAction[] | undefined> {
		const file = this.client.toOpenTsFilePath(document);
		if (!file) {
			return;
		}

		let diagnostics = context.diagnostics;
		if (this.client.bufferSyncSupport.hasPendingDiagnostics(document.uri)) {
			// Delay for 500ms when there are pending diagnostics before recomputing up-to-date diagnostics.
			await new Promise((resolve) => {
				setTimeout(resolve, 500);
			});

			if (token.isCancellationRequested) {
				return;
			}
			const allDiagnostics: vscode.Diagnostic[] = [];

			// Match ranges again after getting new diagnostics
			for (const diagnostic of this.diagnosticsManager.getDiagnostics(document.uri)) {
				if (range.intersection(diagnostic.range)) {
					const newLen = allDiagnostics.push(diagnostic);
					if (newLen > TypeScriptQuickFixProvider._maxCodeActionsPerFile) {
						break;
					}
				}
			}
			diagnostics = allDiagnostics;
		}

		const fixableDiagnostics = await this.supportedCodeActionProvider.getFixableDiagnosticsForContext(diagnostics);
		if (!fixableDiagnostics.size || token.isCancellationRequested) {
			return;
		}

		await this.formattingConfigurationManager.ensureConfigurationForDocument(document, token);
		if (token.isCancellationRequested) {
			return;
		}

		const results = new CodeActionSet();
		for (const diagnostic of fixableDiagnostics.values) {
			await this.getFixesForDiagnostic(document, file, diagnostic, results, token);
			if (token.isCancellationRequested) {
				return;
			}
		}

		const allActions = Array.from(results.values());
		for (const action of allActions) {
			action.isPreferred = isPreferredFix(action, allActions);
		}
		return allActions;
	}

	public async resolveCodeAction(codeAction: VsCodeCodeAction, token: vscode.CancellationToken): Promise<VsCodeCodeAction> {
		if (!(codeAction instanceof VsCodeFixAllCodeAction) || !codeAction.tsAction.fixId) {
			return codeAction;
		}

		const arg: Proto.GetCombinedCodeFixRequestArgs = {
			scope: {
				type: 'file',
				args: { file: codeAction.file }
			},
			fixId: codeAction.tsAction.fixId,
		};

		const response = await this.client.execute('getCombinedCodeFix', arg, token);
		if (response.type === 'response') {
			codeAction.combinedResponse = response;
			codeAction.edit = typeConverters.WorkspaceEdit.fromFileCodeEdits(this.client, response.body.changes);
		}

		return codeAction;
	}

	private async getFixesForDiagnostic(
		document: vscode.TextDocument,
		file: string,
		diagnostic: vscode.Diagnostic,
		results: CodeActionSet,
		token: vscode.CancellationToken,
	): Promise<CodeActionSet> {
		const args: Proto.CodeFixRequestArgs = {
			...typeConverters.Range.toFileRangeRequestArgs(file, diagnostic.range),
			errorCodes: [+(diagnostic.code!)]
		};
		const response = await this.client.execute('getCodeFixes', args, token);
		if (response.type !== 'response' || !response.body) {
			return results;
		}

		for (const tsCodeFix of response.body) {
			for (const action of this.getFixesForTsCodeAction(document, diagnostic, tsCodeFix)) {
				results.addAction(action);
			}
			this.addFixAllForTsCodeAction(results, document.uri, file, diagnostic, tsCodeFix as Proto.CodeFixAction);
		}
		return results;
	}

	private getFixesForTsCodeAction(
		document: vscode.TextDocument,
		diagnostic: vscode.Diagnostic,
		action: Proto.CodeFixAction
	): VsCodeCodeAction[] {
		const actions: VsCodeCodeAction[] = [];
		const codeAction = new VsCodeCodeAction(action, action.description, vscode.CodeActionKind.QuickFix);
		codeAction.edit = getEditForCodeAction(this.client, action);
		codeAction.diagnostics = [diagnostic];
		codeAction.ranges = [diagnostic.range];
		codeAction.command = {
			command: ApplyCodeActionCommand.ID,
			arguments: [{ action, diagnostic, document } satisfies ApplyCodeActionCommand_args],
			title: ''
		};
		actions.push(codeAction);

		const copilot = vscode.extensions.getExtension('github.copilot-chat');
		if (copilot?.isActive) {
			let message: string | undefined;
			let expand: Expand | undefined;
			let title = action.description;
			if (action.fixName === fixNames.classIncorrectlyImplementsInterface) {
				title = vscode.l10n.t('{0} with AI', action.description);
				message = vscode.l10n.t('Implement the stubbed-out class members for {0} with a useful implementation.', document.getText(diagnostic.range));
				expand = { kind: 'code-action', action };
			} else if (action.fixName === fixNames.fixClassDoesntImplementInheritedAbstractMember) {
				title = vscode.l10n.t('{0} with AI', action.description);
				message = vscode.l10n.t(`Implement the stubbed-out class members for {0} with a useful implementation.`, document.getText(diagnostic.range));
				expand = { kind: 'code-action', action };
			} else if (action.fixName === fixNames.fixMissingFunctionDeclaration) {
				title = vscode.l10n.t(`Implement missing function declaration '{0}' using AI`, document.getText(diagnostic.range));
				message = vscode.l10n.t(`Provide a reasonable implementation of the function {0} given its type and the context it's called in.`, document.getText(diagnostic.range));
				expand = { kind: 'code-action', action };
			} else if (action.fixName === fixNames.inferFromUsage) {
				const inferFromBody = new VsCodeCodeAction(action, vscode.l10n.t('Infer types using AI'), vscode.CodeActionKind.QuickFix);
				inferFromBody.edit = new vscode.WorkspaceEdit();
				inferFromBody.diagnostics = [diagnostic];
				inferFromBody.ranges = [diagnostic.range];
				inferFromBody.isAI = true;
				inferFromBody.command = {
					command: EditorChatFollowUp.ID,
					arguments: [{
						message: vscode.l10n.t('Add types to this code. Add separate interfaces when possible. Do not change the code except for adding types.'),
						expand: { kind: 'navtree-function', pos: diagnostic.range.start },
						document,
						action: { type: 'quickfix', quickfix: action }
					} satisfies EditorChatFollowUp_Args],
					title: ''
				};
				actions.push(inferFromBody);
			}
			else if (action.fixName === fixNames.addNameToNamelessParameter) {
				const newText = action.changes.map(change => change.textChanges.map(textChange => textChange.newText).join('')).join('');
				title = vscode.l10n.t('Add meaningful parameter name with AI');
				message = vscode.l10n.t(`Rename the parameter {0} with a more meaningful name.`, newText);
				expand = {
					kind: 'navtree-function',
					pos: diagnostic.range.start
				};
			}
			if (expand && message !== undefined) {
				const aiCodeAction = new VsCodeCodeAction(action, title, vscode.CodeActionKind.QuickFix);
				aiCodeAction.edit = getEditForCodeAction(this.client, action);
				aiCodeAction.edit?.insert(document.uri, diagnostic.range.start, '');
				aiCodeAction.diagnostics = [diagnostic];
				aiCodeAction.ranges = [diagnostic.range];
				aiCodeAction.isAI = true;
				aiCodeAction.command = {
					command: CompositeCommand.ID,
					title: '',
					arguments: [{
						command: ApplyCodeActionCommand.ID,
						arguments: [{ action, diagnostic, document } satisfies ApplyCodeActionCommand_args],
						title: ''
					}, {
						command: EditorChatFollowUp.ID,
						title: '',
						arguments: [{
							message,
							expand,
							document,
							action: { type: 'quickfix', quickfix: action }
						} satisfies EditorChatFollowUp_Args],
					}],
				};
				actions.push(aiCodeAction);
			}
		}
		return actions;
	}

	private addFixAllForTsCodeAction(
		results: CodeActionSet,
		resource: vscode.Uri,
		file: string,
		diagnostic: vscode.Diagnostic,
		tsAction: Proto.CodeFixAction,
	): CodeActionSet {
		if (!tsAction.fixId || results.hasFixAllAction(tsAction.fixId)) {
			return results;
		}

		// Make sure there are multiple different diagnostics of the same type in the file
		if (!this.diagnosticsManager.getDiagnostics(resource).some(x => {
			if (x === diagnostic) {
				return false;
			}
			return x.code === diagnostic.code
				|| (fixAllErrorCodes.has(x.code as number) && fixAllErrorCodes.get(x.code as number) === fixAllErrorCodes.get(diagnostic.code as number));
		})) {
			return results;
		}

		const action = new VsCodeFixAllCodeAction(
			tsAction,
			file,
			tsAction.fixAllDescription || vscode.l10n.t("{0} (Fix all in file)", tsAction.description),
			vscode.CodeActionKind.QuickFix);

		action.diagnostics = [diagnostic];
		action.ranges = [diagnostic.range];
		action.command = {
			command: ApplyFixAllCodeAction.ID,
			arguments: [{ action } satisfies ApplyFixAllCodeAction_args],
			title: ''
		};
		results.addFixAllAction(tsAction.fixId, action);
		return results;
	}
}

// Some fix all actions can actually fix multiple different diagnostics. Make sure we still show the fix all action
// in such cases
const fixAllErrorCodes = new Map<number, number>([
	// Missing async
	[2339, 2339],
	[2345, 2339],
]);

const preferredFixes = new Map<string, { readonly priority: number; readonly thereCanOnlyBeOne?: boolean }>([
	[fixNames.annotateWithTypeFromJSDoc, { priority: 2 }],
	[fixNames.constructorForDerivedNeedSuperCall, { priority: 2 }],
	[fixNames.extendsInterfaceBecomesImplements, { priority: 2 }],
	[fixNames.awaitInSyncFunction, { priority: 2 }],
	[fixNames.removeUnnecessaryAwait, { priority: 2 }],
	[fixNames.classIncorrectlyImplementsInterface, { priority: 3 }],
	[fixNames.classDoesntImplementInheritedAbstractMember, { priority: 3 }],
	[fixNames.unreachableCode, { priority: 2 }],
	[fixNames.unusedIdentifier, { priority: 2 }],
	[fixNames.forgottenThisPropertyAccess, { priority: 2 }],
	[fixNames.spelling, { priority: 0 }],
	[fixNames.addMissingAwait, { priority: 2 }],
	[fixNames.addMissingOverride, { priority: 2 }],
	[fixNames.addMissingNewOperator, { priority: 2 }],
	[fixNames.fixImport, { priority: 1, thereCanOnlyBeOne: true }],
]);

function isPreferredFix(
	action: VsCodeCodeAction,
	allActions: readonly VsCodeCodeAction[]
): boolean {
	if (action instanceof VsCodeFixAllCodeAction) {
		return false;
	}

	const fixPriority = preferredFixes.get(action.tsAction.fixName);
	if (!fixPriority) {
		return false;
	}

	return allActions.every(otherAction => {
		if (otherAction === action) {
			return true;
		}

		if (otherAction instanceof VsCodeFixAllCodeAction) {
			return true;
		}

		const otherFixPriority = preferredFixes.get(otherAction.tsAction.fixName);
		if (!otherFixPriority || otherFixPriority.priority < fixPriority.priority) {
			return true;
		} else if (otherFixPriority.priority > fixPriority.priority) {
			return false;
		}

		if (fixPriority.thereCanOnlyBeOne && action.tsAction.fixName === otherAction.tsAction.fixName) {
			return false;
		}

		return true;
	});
}

export function register(
	selector: DocumentSelector,
	client: ITypeScriptServiceClient,
	fileConfigurationManager: FileConfigurationManager,
	commandManager: CommandManager,
	diagnosticsManager: DiagnosticsManager,
	telemetryReporter: TelemetryReporter
) {
	return conditionalRegistration([
		requireSomeCapability(client, ClientCapability.Semantic),
	], () => {
		return vscode.languages.registerCodeActionsProvider(selector.semantic,
			new TypeScriptQuickFixProvider(client, fileConfigurationManager, commandManager, diagnosticsManager, telemetryReporter),
			TypeScriptQuickFixProvider.metadata);
	});
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/languageFeatures/refactor.ts]---
Location: vscode-main/extensions/typescript-language-features/src/languageFeatures/refactor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as path from 'path';
import * as vscode from 'vscode';
import { Utils } from 'vscode-uri';
import { Command, CommandManager } from '../commands/commandManager';
import { LearnMoreAboutRefactoringsCommand } from '../commands/learnMoreAboutRefactorings';
import { DocumentSelector } from '../configuration/documentSelector';
import * as fileSchemes from '../configuration/fileSchemes';
import { Schemes } from '../configuration/schemes';
import { TelemetryReporter } from '../logging/telemetry';
import { API } from '../tsServer/api';
import { CachedResponse } from '../tsServer/cachedResponse';
import type * as Proto from '../tsServer/protocol/protocol';
import * as PConst from '../tsServer/protocol/protocol.const';
import * as typeConverters from '../typeConverters';
import { ClientCapability, ITypeScriptServiceClient } from '../typescriptService';
import { coalesce } from '../utils/arrays';
import { nulToken } from '../utils/cancellation';
import FormattingOptionsManager from './fileConfigurationManager';
import { CompositeCommand, EditorChatFollowUp } from './util/copilot';
import { conditionalRegistration, requireSomeCapability } from './util/dependentRegistration';

function toWorkspaceEdit(client: ITypeScriptServiceClient, edits: readonly Proto.FileCodeEdits[]): vscode.WorkspaceEdit {
	const workspaceEdit = new vscode.WorkspaceEdit();
	for (const edit of edits) {
		const resource = client.toResource(edit.fileName);
		if (resource.scheme === fileSchemes.file) {
			workspaceEdit.createFile(resource, { ignoreIfExists: true });
		}
	}
	typeConverters.WorkspaceEdit.withFileCodeEdits(workspaceEdit, client, edits);
	return workspaceEdit;
}


namespace DidApplyRefactoringCommand {
	export interface Args {
		readonly action: string;
		readonly trigger: vscode.CodeActionTriggerKind;
	}
}

class DidApplyRefactoringCommand implements Command {
	public static readonly ID = '_typescript.didApplyRefactoring';
	public readonly id = DidApplyRefactoringCommand.ID;

	constructor(
		private readonly telemetryReporter: TelemetryReporter
	) { }

	public async execute(args: DidApplyRefactoringCommand.Args): Promise<void> {
		/* __GDPR__
			"refactor.execute" : {
				"owner": "mjbvz",
				"action" : { "classification": "PublicNonPersonalData", "purpose": "FeatureInsight" },
				"trigger" : { "classification": "PublicNonPersonalData", "purpose": "FeatureInsight" },
				"${include}": [
					"${TypeScriptCommonProperties}"
				]
			}
		*/
		this.telemetryReporter.logTelemetry('refactor.execute', {
			action: args.action,
			trigger: args.trigger,
		});
	}
}
namespace SelectRefactorCommand {
	export interface Args {
		readonly document: vscode.TextDocument;
		readonly refactor: Proto.ApplicableRefactorInfo;
		readonly rangeOrSelection: vscode.Range | vscode.Selection;
		readonly trigger: vscode.CodeActionTriggerKind;
	}
}

class SelectRefactorCommand implements Command {
	public static readonly ID = '_typescript.selectRefactoring';
	public readonly id = SelectRefactorCommand.ID;

	constructor(
		private readonly client: ITypeScriptServiceClient,
	) { }

	public async execute(args: SelectRefactorCommand.Args): Promise<void> {
		const file = this.client.toOpenTsFilePath(args.document);
		if (!file) {
			return;
		}

		const selected = await vscode.window.showQuickPick(args.refactor.actions.map((action): vscode.QuickPickItem & { action: Proto.RefactorActionInfo } => ({
			action,
			label: action.name,
			description: action.description,
		})));
		if (!selected) {
			return;
		}

		const tsAction = new InlinedCodeAction(this.client, args.document, args.refactor, selected.action, args.rangeOrSelection, args.trigger);
		await tsAction.resolve(nulToken);

		if (tsAction.edit) {
			if (!(await vscode.workspace.applyEdit(tsAction.edit, { isRefactoring: true }))) {
				vscode.window.showErrorMessage(vscode.l10n.t("Could not apply refactoring"));
				return;
			}
		}

		if (tsAction.command) {
			await vscode.commands.executeCommand(tsAction.command.command, ...(tsAction.command.arguments ?? []));
		}
	}
}

namespace MoveToFileRefactorCommand {
	export interface Args {
		readonly document: vscode.TextDocument;
		readonly action: Proto.RefactorActionInfo;
		readonly range: vscode.Range;
		readonly trigger: vscode.CodeActionTriggerKind;
	}
}

class MoveToFileRefactorCommand implements Command {
	public static readonly ID = '_typescript.moveToFileRefactoring';
	public readonly id = MoveToFileRefactorCommand.ID;

	constructor(
		private readonly client: ITypeScriptServiceClient,
		private readonly didApplyCommand: DidApplyRefactoringCommand
	) { }

	public async execute(args: MoveToFileRefactorCommand.Args): Promise<void> {
		const file = this.client.toOpenTsFilePath(args.document);
		if (!file) {
			return;
		}

		const targetFile = await this.getTargetFile(args.document, file, args.range);
		if (!targetFile || targetFile.toString() === file.toString()) {
			return;
		}

		const fileSuggestionArgs: Proto.GetEditsForRefactorRequestArgs = {
			...typeConverters.Range.toFileRangeRequestArgs(file, args.range),
			action: 'Move to file',
			refactor: 'Move to file',
			interactiveRefactorArguments: { targetFile },
		};

		const response = await this.client.execute('getEditsForRefactor', fileSuggestionArgs, nulToken);
		if (response.type !== 'response' || !response.body) {
			return;
		}
		const edit = toWorkspaceEdit(this.client, response.body.edits);
		if (!(await vscode.workspace.applyEdit(edit, { isRefactoring: true }))) {
			vscode.window.showErrorMessage(vscode.l10n.t("Could not apply refactoring"));
			return;
		}

		await this.didApplyCommand.execute({ action: args.action.name, trigger: args.trigger });
	}

	private async getTargetFile(document: vscode.TextDocument, file: string, range: vscode.Range): Promise<string | undefined> {
		const args = typeConverters.Range.toFileRangeRequestArgs(file, range);
		const response = await this.client.execute('getMoveToRefactoringFileSuggestions', args, nulToken);
		if (response.type !== 'response' || !response.body) {
			return;
		}
		const body = response.body;

		type DestinationItem = vscode.QuickPickItem & { readonly file?: string };
		const selectExistingFileItem: vscode.QuickPickItem = { label: vscode.l10n.t("Select existing file...") };
		const selectNewFileItem: vscode.QuickPickItem = { label: vscode.l10n.t("Enter new file path...") };

		const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
		const quickPick = vscode.window.createQuickPick<DestinationItem>();
		quickPick.ignoreFocusOut = true;

		// true so we don't skip computing in the first call
		let quickPickInRelativeMode = true;
		const updateItems = () => {
			const relativeQuery = ['./', '../'].find(str => quickPick.value.startsWith(str));
			if (quickPickInRelativeMode === false && !!relativeQuery === false) {
				return;
			}
			quickPickInRelativeMode = !!relativeQuery;
			const destinationItems = body.files.map((file): DestinationItem | undefined => {
				const uri = this.client.toResource(file);
				const parentDir = Utils.dirname(uri);
				const filename = Utils.basename(uri);

				let description: string | undefined;
				if (workspaceFolder) {
					if (uri.scheme === Schemes.file) {
						description = path.relative(workspaceFolder.uri.fsPath, parentDir.fsPath);
					} else {
						description = path.posix.relative(workspaceFolder.uri.path, parentDir.path);
					}
					if (relativeQuery) {
						const convertRelativePath = (str: string) => {
							return !str.startsWith('../') ? `./${str}` : str;
						};

						const relativePath = convertRelativePath(path.relative(path.dirname(document.uri.fsPath), uri.fsPath));
						if (!relativePath.startsWith(relativeQuery)) {
							return;
						}
						description = relativePath;
					}
				} else {
					description = parentDir.fsPath;
				}

				return {
					file,
					label: Utils.basename(uri),
					description: relativeQuery ? description : path.join(description, filename),
				};
			});
			quickPick.items = [
				selectExistingFileItem,
				selectNewFileItem,
				{ label: vscode.l10n.t("destination files"), kind: vscode.QuickPickItemKind.Separator },
				...coalesce(destinationItems)
			];
		};
		quickPick.title = vscode.l10n.t("Move to File");
		quickPick.placeholder = vscode.l10n.t("Enter file path");
		quickPick.matchOnDescription = true;
		quickPick.onDidChangeValue(updateItems);
		updateItems();

		const picked = await new Promise<DestinationItem | undefined>(resolve => {
			quickPick.onDidAccept(() => {
				resolve(quickPick.selectedItems[0]);
				quickPick.dispose();
			});
			quickPick.onDidHide(() => {
				resolve(undefined);
				quickPick.dispose();
			});
			quickPick.show();
		});
		if (!picked) {
			return;
		}

		if (picked === selectExistingFileItem) {
			const picked = await vscode.window.showOpenDialog({
				title: vscode.l10n.t("Select move destination"),
				openLabel: vscode.l10n.t("Move to File"),
				defaultUri: Utils.dirname(document.uri),
			});
			return picked?.length ? this.client.toTsFilePath(picked[0]) : undefined;
		} else if (picked === selectNewFileItem) {
			const picked = await vscode.window.showSaveDialog({
				title: vscode.l10n.t("Select move destination"),
				saveLabel: vscode.l10n.t("Move to File"),
				defaultUri: this.client.toResource(response.body.newFileName),
			});
			return picked ? this.client.toTsFilePath(picked) : undefined;
		} else {
			return picked.file;
		}
	}
}

interface CodeActionKind {
	readonly kind: vscode.CodeActionKind;
	matches(refactor: Proto.RefactorActionInfo): boolean;
}

const Extract_Function = Object.freeze<CodeActionKind>({
	kind: vscode.CodeActionKind.RefactorExtract.append('function'),
	matches: refactor => refactor.name.startsWith('function_')
});

const Extract_Constant = Object.freeze<CodeActionKind>({
	kind: vscode.CodeActionKind.RefactorExtract.append('constant'),
	matches: refactor => refactor.name.startsWith('constant_')
});

const Extract_Type = Object.freeze<CodeActionKind>({
	kind: vscode.CodeActionKind.RefactorExtract.append('type'),
	matches: refactor => refactor.name.startsWith('Extract to type alias')
});

const Extract_Interface = Object.freeze<CodeActionKind>({
	kind: vscode.CodeActionKind.RefactorExtract.append('interface'),
	matches: refactor => refactor.name.startsWith('Extract to interface')
});

const Move_File = Object.freeze<CodeActionKind>({
	kind: vscode.CodeActionKind.RefactorMove.append('file'),
	matches: refactor => refactor.name.startsWith('Move to file')
});

const Move_NewFile = Object.freeze<CodeActionKind>({
	kind: vscode.CodeActionKind.RefactorMove.append('newFile'),
	matches: refactor => refactor.name.startsWith('Move to a new file')
});

const Rewrite_Import = Object.freeze<CodeActionKind>({
	kind: vscode.CodeActionKind.RefactorRewrite.append('import'),
	matches: refactor => refactor.name.startsWith('Convert namespace import') || refactor.name.startsWith('Convert named imports')
});

const Rewrite_Export = Object.freeze<CodeActionKind>({
	kind: vscode.CodeActionKind.RefactorRewrite.append('export'),
	matches: refactor => refactor.name.startsWith('Convert default export') || refactor.name.startsWith('Convert named export')
});

const Rewrite_Arrow_Braces = Object.freeze<CodeActionKind>({
	kind: vscode.CodeActionKind.RefactorRewrite.append('arrow').append('braces'),
	matches: refactor => refactor.name.startsWith('Convert default export') || refactor.name.startsWith('Convert named export')
});

const Rewrite_Parameters_ToDestructured = Object.freeze<CodeActionKind>({
	kind: vscode.CodeActionKind.RefactorRewrite.append('parameters').append('toDestructured'),
	matches: refactor => refactor.name.startsWith('Convert parameters to destructured object')
});

const Rewrite_Property_GenerateAccessors = Object.freeze<CodeActionKind>({
	kind: vscode.CodeActionKind.RefactorRewrite.append('property').append('generateAccessors'),
	matches: refactor => refactor.name.startsWith('Generate \'get\' and \'set\' accessors')
});

const allKnownCodeActionKinds = [
	Extract_Function,
	Extract_Constant,
	Extract_Type,
	Extract_Interface,
	Move_File,
	Move_NewFile,
	Rewrite_Import,
	Rewrite_Export,
	Rewrite_Arrow_Braces,
	Rewrite_Parameters_ToDestructured,
	Rewrite_Property_GenerateAccessors
];

class InlinedCodeAction extends vscode.CodeAction {
	constructor(
		public readonly client: ITypeScriptServiceClient,
		public readonly document: vscode.TextDocument,
		public readonly refactor: Proto.ApplicableRefactorInfo,
		public readonly action: Proto.RefactorActionInfo,
		public readonly range: vscode.Range,
		trigger: vscode.CodeActionTriggerKind,
	) {
		const title = action.description;
		super(title, InlinedCodeAction.getKind(action));

		if (action.notApplicableReason) {
			this.disabled = { reason: action.notApplicableReason };
		}

		this.command = {
			title,
			command: DidApplyRefactoringCommand.ID,
			arguments: [{ action: action.name, trigger } satisfies DidApplyRefactoringCommand.Args],
		};
	}

	public async resolve(token: vscode.CancellationToken): Promise<undefined> {
		const file = this.client.toOpenTsFilePath(this.document);
		if (!file) {
			return;
		}

		const args: Proto.GetEditsForRefactorRequestArgs = {
			...typeConverters.Range.toFileRangeRequestArgs(file, this.range),
			refactor: this.refactor.name,
			action: this.action.name,
		};

		const response = await this.client.execute('getEditsForRefactor', args, token);
		if (response.type !== 'response' || !response.body) {
			return;
		}

		this.edit = toWorkspaceEdit(this.client, response.body.edits);
		if (!this.edit.size) {
			vscode.window.showErrorMessage(vscode.l10n.t("Could not apply refactoring"));
			return;
		}

		if (response.body.renameLocation) {
			// Disable renames in interactive playground https://github.com/microsoft/vscode/issues/75137
			if (this.document.uri.scheme !== fileSchemes.walkThroughSnippet) {
				this.command = {
					command: CompositeCommand.ID,
					title: '',
					arguments: coalesce([
						this.command,
						{
							command: 'editor.action.rename',
							arguments: [[
								this.document.uri,
								typeConverters.Position.fromLocation(response.body.renameLocation)
							]]
						},
					])
				};
			}
		}
	}

	private static getKind(refactor: Proto.RefactorActionInfo) {
		if ((refactor as Proto.RefactorActionInfo & { kind?: string }).kind) {
			return vscode.CodeActionKind.Empty.append((refactor as Proto.RefactorActionInfo & { kind?: string }).kind!);
		}
		const match = allKnownCodeActionKinds.find(kind => kind.matches(refactor));
		return match ? match.kind : vscode.CodeActionKind.Refactor;
	}
}

class MoveToFileCodeAction extends vscode.CodeAction {
	constructor(
		document: vscode.TextDocument,
		action: Proto.RefactorActionInfo,
		range: vscode.Range,
		trigger: vscode.CodeActionTriggerKind,
	) {
		super(action.description, Move_File.kind);

		if (action.notApplicableReason) {
			this.disabled = { reason: action.notApplicableReason };
		}

		this.command = {
			title: action.description,
			command: MoveToFileRefactorCommand.ID,
			arguments: [{ action, document, range, trigger } satisfies MoveToFileRefactorCommand.Args]
		};
	}
}

class SelectCodeAction extends vscode.CodeAction {
	constructor(
		info: Proto.ApplicableRefactorInfo,
		document: vscode.TextDocument,
		rangeOrSelection: vscode.Range | vscode.Selection,
		trigger: vscode.CodeActionTriggerKind,
	) {
		super(info.description, vscode.CodeActionKind.Refactor);
		this.command = {
			title: info.description,
			command: SelectRefactorCommand.ID,
			arguments: [{ document, refactor: info, rangeOrSelection, trigger } satisfies SelectRefactorCommand.Args]
		};
	}
}
type TsCodeAction = InlinedCodeAction | MoveToFileCodeAction | SelectCodeAction;

class TypeScriptRefactorProvider implements vscode.CodeActionProvider<TsCodeAction> {

	private static readonly _declarationKinds = new Set([
		PConst.Kind.module,
		PConst.Kind.class,
		PConst.Kind.interface,
		PConst.Kind.function,
		PConst.Kind.enum,
		PConst.Kind.type,
		PConst.Kind.const,
		PConst.Kind.variable,
		PConst.Kind.let,
	]);

	private static isOnSignatureName(node: Proto.NavigationTree, range: vscode.Range): boolean {
		if (this._declarationKinds.has(node.kind)) {
			// Show when on the name span
			if (node.nameSpan) {
				const convertedSpan = typeConverters.Range.fromTextSpan(node.nameSpan);
				if (range.intersection(convertedSpan)) {
					return true;
				}
			}

			// Show when on the same line as an exported symbols without a name (handles default exports)
			if (!node.nameSpan && /\bexport\b/.test(node.kindModifiers) && node.spans.length) {
				const convertedSpan = typeConverters.Range.fromTextSpan(node.spans[0]);
				if (range.intersection(new vscode.Range(convertedSpan.start.line, 0, convertedSpan.start.line, Number.MAX_SAFE_INTEGER))) {
					return true;
				}
			}
		}

		// Show if on the signature of any children
		return node.childItems?.some(child => this.isOnSignatureName(child, range)) ?? false;
	}

	constructor(
		private readonly client: ITypeScriptServiceClient,
		private readonly cachedNavTree: CachedResponse<Proto.NavTreeResponse>,
		private readonly formattingOptionsManager: FormattingOptionsManager,
		commandManager: CommandManager,
		telemetryReporter: TelemetryReporter
	) {
		const didApplyRefactoringCommand = new DidApplyRefactoringCommand(telemetryReporter);
		commandManager.register(didApplyRefactoringCommand);

		commandManager.register(new CompositeCommand());
		commandManager.register(new SelectRefactorCommand(this.client));
		commandManager.register(new MoveToFileRefactorCommand(this.client, didApplyRefactoringCommand));
		commandManager.register(new EditorChatFollowUp(this.client, telemetryReporter));
	}

	public static readonly metadata: vscode.CodeActionProviderMetadata = {
		providedCodeActionKinds: [
			vscode.CodeActionKind.Refactor,
			...allKnownCodeActionKinds.map(x => x.kind),
		],
		documentation: [
			{
				kind: vscode.CodeActionKind.Refactor,
				command: {
					command: LearnMoreAboutRefactoringsCommand.id,
					title: vscode.l10n.t("Learn more about JS/TS refactorings")
				}
			}
		]
	};

	public async provideCodeActions(
		document: vscode.TextDocument,
		rangeOrSelection: vscode.Range | vscode.Selection,
		context: vscode.CodeActionContext,
		token: vscode.CancellationToken
	): Promise<TsCodeAction[] | undefined> {
		if (!this.shouldTrigger(context, rangeOrSelection)) {
			return undefined;
		}
		if (!this.client.toOpenTsFilePath(document)) {
			return undefined;
		}

		const response = await this.interruptGetErrIfNeeded(context, () => {
			const file = this.client.toOpenTsFilePath(document);
			if (!file) {
				return undefined;
			}

			this.formattingOptionsManager.ensureConfigurationForDocument(document, token);

			const args: Proto.GetApplicableRefactorsRequestArgs = {
				...typeConverters.Range.toFileRangeRequestArgs(file, rangeOrSelection),
				triggerReason: this.toTsTriggerReason(context),
				kind: context.only?.value,
				includeInteractiveActions: this.client.apiVersion.gte(API.v520),
			};
			return this.client.execute('getApplicableRefactors', args, token);
		});
		if (response?.type !== 'response' || !response.body) {
			return undefined;
		}

		const applicableRefactors = this.convertApplicableRefactors(document, context, response.body, rangeOrSelection);
		const actions = coalesce(await Promise.all(Array.from(applicableRefactors, async action => {
			if (this.client.apiVersion.lt(API.v430)) {
				// Don't show 'infer return type' refactoring unless it has been explicitly requested
				// https://github.com/microsoft/TypeScript/issues/42993
				if (!context.only && action.kind?.value === 'refactor.rewrite.function.returnType') {
					return undefined;
				}
			}

			// Don't include move actions on auto light bulb unless you are on a declaration name
			if (this.client.apiVersion.lt(API.v540) && context.triggerKind === vscode.CodeActionTriggerKind.Automatic) {
				if (action.kind?.value === Move_NewFile.kind.value || action.kind?.value === Move_File.kind.value) {
					const file = this.client.toOpenTsFilePath(document);
					if (!file) {
						return undefined;
					}

					const navTree = await this.cachedNavTree.execute(document, () => this.client.execute('navtree', { file }, token));
					if (navTree.type !== 'response' || !navTree.body || !TypeScriptRefactorProvider.isOnSignatureName(navTree.body, rangeOrSelection)) {
						return undefined;
					}
				}
			}

			return action;
		})));

		if (!context.only) {
			return actions;
		}

		return this.pruneInvalidActions(this.appendInvalidActions(actions), context.only, /* numberOfInvalid = */ 5);
	}

	private interruptGetErrIfNeeded<R>(context: vscode.CodeActionContext, f: () => R): R {
		// Only interrupt diagnostics computation when code actions are explicitly
		// (such as using the refactor command or a keybinding). This is a clear
		// user action so we want to return results as quickly as possible.
		if (context.triggerKind === vscode.CodeActionTriggerKind.Invoke) {
			return this.client.interruptGetErr(f);
		} else {
			return f();
		}
	}

	public async resolveCodeAction(
		codeAction: TsCodeAction,
		token: vscode.CancellationToken,
	): Promise<TsCodeAction> {
		if (codeAction instanceof InlinedCodeAction) {
			await codeAction.resolve(token);
		}
		return codeAction;
	}

	private toTsTriggerReason(context: vscode.CodeActionContext): Proto.RefactorTriggerReason | undefined {
		return context.triggerKind === vscode.CodeActionTriggerKind.Invoke ? 'invoked' : 'implicit';
	}

	private *convertApplicableRefactors(
		document: vscode.TextDocument,
		context: vscode.CodeActionContext,
		refactors: readonly Proto.ApplicableRefactorInfo[],
		rangeOrSelection: vscode.Range | vscode.Selection
	): Iterable<TsCodeAction> {
		for (const refactor of refactors) {
			if (refactor.inlineable === false) {
				yield new SelectCodeAction(refactor, document, rangeOrSelection, context.triggerKind);
			} else {
				for (const action of refactor.actions) {
					for (const codeAction of this.refactorActionToCodeActions(document, context, refactor, action, rangeOrSelection, refactor.actions)) {
						yield codeAction;
					}
				}
			}
		}
	}

	private refactorActionToCodeActions(
		document: vscode.TextDocument,
		context: vscode.CodeActionContext,
		refactor: Proto.ApplicableRefactorInfo,
		action: Proto.RefactorActionInfo,
		rangeOrSelection: vscode.Range | vscode.Selection,
		allActions: readonly Proto.RefactorActionInfo[],
	): TsCodeAction[] {
		const codeActions: TsCodeAction[] = [];
		if (action.name === 'Move to file') {
			codeActions.push(new MoveToFileCodeAction(document, action, rangeOrSelection, context.triggerKind));
		} else {
			codeActions.push(new InlinedCodeAction(this.client, document, refactor, action, rangeOrSelection, context.triggerKind));
		}
		for (const codeAction of codeActions) {
			codeAction.isPreferred = TypeScriptRefactorProvider.isPreferred(action, allActions);
		}
		return codeActions;
	}

	private shouldTrigger(context: vscode.CodeActionContext, rangeOrSelection: vscode.Range | vscode.Selection) {
		if (context.only && !vscode.CodeActionKind.Refactor.contains(context.only)) {
			return false;
		}
		if (context.triggerKind === vscode.CodeActionTriggerKind.Invoke) {
			return true;
		}
		return rangeOrSelection instanceof vscode.Selection;
	}

	private static isPreferred(
		action: Proto.RefactorActionInfo,
		allActions: readonly Proto.RefactorActionInfo[],
	): boolean {
		if (Extract_Constant.matches(action)) {
			// Only mark the action with the lowest scope as preferred
			const getScope = (name: string) => {
				const scope = name.match(/scope_(\d)/)?.[1];
				return scope ? +scope : undefined;
			};
			const scope = getScope(action.name);
			if (typeof scope !== 'number') {
				return false;
			}

			return allActions
				.filter(otherAtion => otherAtion !== action && Extract_Constant.matches(otherAtion))
				.every(otherAction => {
					const otherScope = getScope(otherAction.name);
					return typeof otherScope === 'number' ? scope < otherScope : true;
				});
		}
		if (Extract_Type.matches(action) || Extract_Interface.matches(action)) {
			return true;
		}
		return false;
	}

	private appendInvalidActions(actions: vscode.CodeAction[]): vscode.CodeAction[] {
		if (this.client.apiVersion.gte(API.v400)) {
			// Invalid actions come from TS server instead
			return actions;
		}

		if (!actions.some(action => action.kind && Extract_Constant.kind.contains(action.kind))) {
			const disabledAction = new vscode.CodeAction(
				vscode.l10n.t("Extract to constant"),
				Extract_Constant.kind);

			disabledAction.disabled = {
				reason: vscode.l10n.t("The current selection cannot be extracted"),
			};
			disabledAction.isPreferred = true;

			actions.push(disabledAction);
		}

		if (!actions.some(action => action.kind && Extract_Function.kind.contains(action.kind))) {
			const disabledAction = new vscode.CodeAction(
				vscode.l10n.t("Extract to function"),
				Extract_Function.kind);

			disabledAction.disabled = {
				reason: vscode.l10n.t("The current selection cannot be extracted"),
			};
			actions.push(disabledAction);
		}
		return actions;
	}

	private pruneInvalidActions(actions: vscode.CodeAction[], only?: vscode.CodeActionKind, numberOfInvalid?: number): vscode.CodeAction[] {
		if (this.client.apiVersion.lt(API.v400)) {
			// Older TS version don't return extra actions
			return actions;
		}

		const availableActions: vscode.CodeAction[] = [];
		const invalidCommonActions: vscode.CodeAction[] = [];
		const invalidUncommonActions: vscode.CodeAction[] = [];
		for (const action of actions) {
			if (!action.disabled) {
				availableActions.push(action);
				continue;
			}

			// These are the common refactors that we should always show if applicable.
			if (action.kind && (Extract_Constant.kind.contains(action.kind) || Extract_Function.kind.contains(action.kind))) {
				invalidCommonActions.push(action);
				continue;
			}

			// These are the remaining refactors that we can show if we haven't reached the max limit with just common refactors.
			invalidUncommonActions.push(action);
		}

		const prioritizedActions: vscode.CodeAction[] = [];
		prioritizedActions.push(...invalidCommonActions);
		prioritizedActions.push(...invalidUncommonActions);
		const topNInvalid = prioritizedActions.filter(action => !only || (action.kind && only.contains(action.kind))).slice(0, numberOfInvalid);
		availableActions.push(...topNInvalid);
		return availableActions;
	}
}

export function register(
	selector: DocumentSelector,
	client: ITypeScriptServiceClient,
	cachedNavTree: CachedResponse<Proto.NavTreeResponse>,
	formattingOptionsManager: FormattingOptionsManager,
	commandManager: CommandManager,
	telemetryReporter: TelemetryReporter,
) {
	return conditionalRegistration([
		requireSomeCapability(client, ClientCapability.Semantic),
	], () => {
		return vscode.languages.registerCodeActionsProvider(selector.semantic,
			new TypeScriptRefactorProvider(client, cachedNavTree, formattingOptionsManager, commandManager, telemetryReporter),
			TypeScriptRefactorProvider.metadata);
	});
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/languageFeatures/references.ts]---
Location: vscode-main/extensions/typescript-language-features/src/languageFeatures/references.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { DocumentSelector } from '../configuration/documentSelector';
import * as typeConverters from '../typeConverters';
import { ClientCapability, ITypeScriptServiceClient } from '../typescriptService';
import { conditionalRegistration, requireSomeCapability } from './util/dependentRegistration';

class TypeScriptReferenceSupport implements vscode.ReferenceProvider {
	public constructor(
		private readonly client: ITypeScriptServiceClient) { }

	public async provideReferences(
		document: vscode.TextDocument,
		position: vscode.Position,
		options: vscode.ReferenceContext,
		token: vscode.CancellationToken
	): Promise<vscode.Location[]> {
		const filepath = this.client.toOpenTsFilePath(document);
		if (!filepath) {
			return [];
		}

		const args = typeConverters.Position.toFileLocationRequestArgs(filepath, position);
		const response = await this.client.execute('references', args, token);
		if (response.type !== 'response' || !response.body) {
			return [];
		}

		const result: vscode.Location[] = [];
		for (const ref of response.body.refs) {
			if (!options.includeDeclaration && ref.isDefinition) {
				continue;
			}
			const url = this.client.toResource(ref.file);
			const location = typeConverters.Location.fromTextSpan(url, ref);
			result.push(location);
		}
		return result;
	}
}

export function register(
	selector: DocumentSelector,
	client: ITypeScriptServiceClient
) {
	return conditionalRegistration([
		requireSomeCapability(client, ClientCapability.EnhancedSyntax, ClientCapability.Semantic),
	], () => {
		return vscode.languages.registerReferenceProvider(selector.syntax,
			new TypeScriptReferenceSupport(client));
	});
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/languageFeatures/rename.ts]---
Location: vscode-main/extensions/typescript-language-features/src/languageFeatures/rename.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as path from 'path';
import * as vscode from 'vscode';
import { DocumentSelector } from '../configuration/documentSelector';
import * as languageIds from '../configuration/languageIds';
import { API } from '../tsServer/api';
import type * as Proto from '../tsServer/protocol/protocol';
import * as typeConverters from '../typeConverters';
import { ClientCapability, ITypeScriptServiceClient } from '../typescriptService';
import FileConfigurationManager from './fileConfigurationManager';
import { conditionalRegistration, requireSomeCapability } from './util/dependentRegistration';
import { LanguageDescription } from '../configuration/languageDescription';

type RenameResponse = {
	readonly type: 'rename';
	readonly body: Proto.RenameResponseBody;
} | {
	readonly type: 'jsxLinkedEditing';
	readonly spans: readonly Proto.TextSpan[];
};

class TypeScriptRenameProvider implements vscode.RenameProvider {

	public constructor(
		private readonly language: LanguageDescription,
		private readonly client: ITypeScriptServiceClient,
		private readonly fileConfigurationManager: FileConfigurationManager
	) { }

	public async prepareRename(
		document: vscode.TextDocument,
		position: vscode.Position,
		token: vscode.CancellationToken
	): Promise<vscode.Range | undefined> {
		const response = await this.execRename(document, position, token);
		if (!response) {
			return undefined;
		}

		switch (response.type) {
			case 'rename': {
				const renameInfo = response.body.info;
				if (!renameInfo.canRename) {
					return Promise.reject<vscode.Range>(renameInfo.localizedErrorMessage);
				}
				return typeConverters.Range.fromTextSpan(renameInfo.triggerSpan);
			}
			case 'jsxLinkedEditing': {
				return response.spans
					.map(typeConverters.Range.fromTextSpan)
					.find(range => range.contains(position));
			}
		}
	}

	public async provideRenameEdits(
		document: vscode.TextDocument,
		position: vscode.Position,
		newName: string,
		token: vscode.CancellationToken
	): Promise<vscode.WorkspaceEdit | undefined> {
		const file = this.client.toOpenTsFilePath(document);
		if (!file) {
			return undefined;
		}

		const response = await this.execRename(document, position, token);
		if (!response || token.isCancellationRequested) {
			return undefined;
		}

		switch (response.type) {
			case 'rename': {
				const renameInfo = response.body.info;
				if (!renameInfo.canRename) {
					return Promise.reject<vscode.WorkspaceEdit>(renameInfo.localizedErrorMessage);
				}

				if (renameInfo.fileToRename) {
					const edits = await this.renameFile(renameInfo.fileToRename, renameInfo.fullDisplayName, newName, token);
					if (edits) {
						return edits;
					} else {
						return Promise.reject<vscode.WorkspaceEdit>(vscode.l10n.t("An error occurred while renaming file"));
					}
				}

				return this.updateLocs(response.body.locs, newName);
			}
			case 'jsxLinkedEditing': {
				return this.updateLocs([{
					file,
					locs: response.spans.map((span): Proto.RenameTextSpan => ({ ...span })),
				}], newName);
			}
		}
	}

	public async execRename(
		document: vscode.TextDocument,
		position: vscode.Position,
		token: vscode.CancellationToken
	): Promise<RenameResponse | undefined> {
		const file = this.client.toOpenTsFilePath(document);
		if (!file) {
			return undefined;
		}

		// Prefer renaming matching jsx tag when available
		if (this.client.apiVersion.gte(API.v510) &&
			vscode.workspace.getConfiguration(this.language.id).get('preferences.renameMatchingJsxTags', true) &&
			this.looksLikePotentialJsxTagContext(document, position)
		) {
			const args = typeConverters.Position.toFileLocationRequestArgs(file, position);
			const response = await this.client.execute('linkedEditingRange', args, token);
			if (response.type !== 'response' || !response.body) {
				return undefined;
			}

			return { type: 'jsxLinkedEditing', spans: response.body.ranges };
		}

		const args: Proto.RenameRequestArgs = {
			...typeConverters.Position.toFileLocationRequestArgs(file, position),
			findInStrings: false,
			findInComments: false
		};

		return this.client.interruptGetErr(async () => {
			this.fileConfigurationManager.ensureConfigurationForDocument(document, token);
			const response = await this.client.execute('rename', args, token);
			if (response.type !== 'response' || !response.body) {
				return undefined;
			}
			return { type: 'rename', body: response.body };
		});
	}

	private looksLikePotentialJsxTagContext(document: vscode.TextDocument, position: vscode.Position): boolean {
		if (![languageIds.typescriptreact, languageIds.javascript, languageIds.javascriptreact].includes(document.languageId)) {
			return false;
		}

		const prefix = document.getText(new vscode.Range(position.line, 0, position.line, position.character));
		return /\<\/?\s*[\w\d_$.]*$/.test(prefix);
	}

	private updateLocs(
		locations: ReadonlyArray<Proto.SpanGroup>,
		newName: string
	) {
		const edit = new vscode.WorkspaceEdit();
		for (const spanGroup of locations) {
			const resource = this.client.toResource(spanGroup.file);
			for (const textSpan of spanGroup.locs) {
				edit.replace(resource, typeConverters.Range.fromTextSpan(textSpan),
					(textSpan.prefixText || '') + newName + (textSpan.suffixText || ''));
			}
		}
		return edit;
	}

	private async renameFile(
		fileToRename: string,
		fullDisplayName: string,
		newName: string,
		token: vscode.CancellationToken,
	): Promise<vscode.WorkspaceEdit | undefined> {
		// Make sure we preserve file extension if extension is unchanged or none provided
		if (!path.extname(newName)) {
			newName += path.extname(fileToRename);
		}
		else if (path.extname(newName) === path.extname(fullDisplayName)) {
			newName = newName.slice(0, newName.length - path.extname(newName).length) + path.extname(fileToRename);
		}

		const dirname = path.dirname(fileToRename);
		const newFilePath = path.join(dirname, newName);

		const args: Proto.GetEditsForFileRenameRequestArgs & { file: string } = {
			file: fileToRename,
			oldFilePath: fileToRename,
			newFilePath: newFilePath,
		};
		const response = await this.client.execute('getEditsForFileRename', args, token);
		if (response.type !== 'response' || !response.body) {
			return undefined;
		}

		const edits = typeConverters.WorkspaceEdit.fromFileCodeEdits(this.client, response.body);
		edits.renameFile(vscode.Uri.file(fileToRename), vscode.Uri.file(newFilePath));
		return edits;
	}
}

export function register(
	selector: DocumentSelector,
	language: LanguageDescription,
	client: ITypeScriptServiceClient,
	fileConfigurationManager: FileConfigurationManager,
) {
	return conditionalRegistration([
		requireSomeCapability(client, ClientCapability.Semantic),
	], () => {
		return vscode.languages.registerRenameProvider(selector.semantic,
			new TypeScriptRenameProvider(language, client, fileConfigurationManager));
	});
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/languageFeatures/semanticTokens.ts]---
Location: vscode-main/extensions/typescript-language-features/src/languageFeatures/semanticTokens.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { DocumentSelector } from '../configuration/documentSelector';
import * as Proto from '../tsServer/protocol/protocol';
import { ClientCapability, ITypeScriptServiceClient } from '../typescriptService';
import { conditionalRegistration, requireSomeCapability } from './util/dependentRegistration';

// as we don't do deltas, for performance reasons, don't compute semantic tokens for documents above that limit
const CONTENT_LENGTH_LIMIT = 100000;

export function register(
	selector: DocumentSelector,
	client: ITypeScriptServiceClient,
) {
	return conditionalRegistration([
		requireSomeCapability(client, ClientCapability.Semantic),
	], () => {
		const provider = new DocumentSemanticTokensProvider(client);
		return vscode.languages.registerDocumentRangeSemanticTokensProvider(selector.semantic, provider, provider.getLegend());
	});
}

class DocumentSemanticTokensProvider implements vscode.DocumentSemanticTokensProvider, vscode.DocumentRangeSemanticTokensProvider {

	constructor(
		private readonly client: ITypeScriptServiceClient
	) { }

	public getLegend(): vscode.SemanticTokensLegend {
		return new vscode.SemanticTokensLegend(tokenTypes, tokenModifiers);
	}

	public async provideDocumentSemanticTokens(document: vscode.TextDocument, token: vscode.CancellationToken): Promise<vscode.SemanticTokens | null> {
		const file = this.client.toOpenTsFilePath(document);
		if (!file || document.getText().length > CONTENT_LENGTH_LIMIT) {
			return null;
		}
		return this.provideSemanticTokens(document, { file, start: 0, length: document.getText().length }, token);
	}

	public async provideDocumentRangeSemanticTokens(document: vscode.TextDocument, range: vscode.Range, token: vscode.CancellationToken): Promise<vscode.SemanticTokens | null> {
		const file = this.client.toOpenTsFilePath(document);
		if (!file || (document.offsetAt(range.end) - document.offsetAt(range.start) > CONTENT_LENGTH_LIMIT)) {
			return null;
		}

		const start = document.offsetAt(range.start);
		const length = document.offsetAt(range.end) - start;
		return this.provideSemanticTokens(document, { file, start, length }, token);
	}

	private async provideSemanticTokens(document: vscode.TextDocument, requestArg: Proto.EncodedSemanticClassificationsRequestArgs, token: vscode.CancellationToken): Promise<vscode.SemanticTokens | null> {
		const file = this.client.toOpenTsFilePath(document);
		if (!file) {
			return null;
		}

		const versionBeforeRequest = document.version;

		const response = await this.client.execute('encodedSemanticClassifications-full', { ...requestArg, format: '2020' }, token, {
			cancelOnResourceChange: document.uri
		});
		if (response.type !== 'response' || !response.body) {
			return null;
		}

		const versionAfterRequest = document.version;

		if (versionBeforeRequest !== versionAfterRequest) {
			// cannot convert result's offsets to (line;col) values correctly
			// a new request will come in soon...
			//
			// here we cannot return null, because returning null would remove all semantic tokens.
			// we must throw to indicate that the semantic tokens should not be removed.
			// using the string busy here because it is not logged to error telemetry if the error text contains busy.

			// as the new request will come in right after our response, we first wait for the document activity to stop
			await waitForDocumentChangesToEnd(document);

			throw new vscode.CancellationError();
		}

		const tokenSpan = response.body.spans;

		const builder = new vscode.SemanticTokensBuilder();
		for (let i = 0; i < tokenSpan.length;) {
			const offset = tokenSpan[i++];
			const length = tokenSpan[i++];
			const tsClassification = tokenSpan[i++];

			const tokenType = getTokenTypeFromClassification(tsClassification);
			if (tokenType === undefined) {
				continue;
			}

			const tokenModifiers = getTokenModifierFromClassification(tsClassification);

			// we can use the document's range conversion methods because the result is at the same version as the document
			const startPos = document.positionAt(offset);
			const endPos = document.positionAt(offset + length);

			for (let line = startPos.line; line <= endPos.line; line++) {
				const startCharacter = (line === startPos.line ? startPos.character : 0);
				const endCharacter = (line === endPos.line ? endPos.character : document.lineAt(line).text.length);
				builder.push(line, startCharacter, endCharacter - startCharacter, tokenType, tokenModifiers);
			}
		}

		return builder.build();
	}
}

function waitForDocumentChangesToEnd(document: vscode.TextDocument) {
	let version = document.version;
	return new Promise<void>((resolve) => {
		const iv = setInterval(_ => {
			if (document.version === version) {
				clearInterval(iv);
				resolve();
			}
			version = document.version;
		}, 400);
	});
}


// typescript encodes type and modifiers in the classification:
// TSClassification = (TokenType + 1) << 8 + TokenModifier

const enum TokenType {
	class = 0,
	enum = 1,
	interface = 2,
	namespace = 3,
	typeParameter = 4,
	type = 5,
	parameter = 6,
	variable = 7,
	enumMember = 8,
	property = 9,
	function = 10,
	method = 11,
	_ = 12
}

const enum TokenModifier {
	declaration = 0,
	static = 1,
	async = 2,
	readonly = 3,
	defaultLibrary = 4,
	local = 5,
	_ = 6
}

const enum TokenEncodingConsts {
	typeOffset = 8,
	modifierMask = 255
}

function getTokenTypeFromClassification(tsClassification: number): number | undefined {
	if (tsClassification > TokenEncodingConsts.modifierMask) {
		return (tsClassification >> TokenEncodingConsts.typeOffset) - 1;
	}
	return undefined;
}

function getTokenModifierFromClassification(tsClassification: number) {
	return tsClassification & TokenEncodingConsts.modifierMask;
}

const tokenTypes: string[] = [];
tokenTypes[TokenType.class] = 'class';
tokenTypes[TokenType.enum] = 'enum';
tokenTypes[TokenType.interface] = 'interface';
tokenTypes[TokenType.namespace] = 'namespace';
tokenTypes[TokenType.typeParameter] = 'typeParameter';
tokenTypes[TokenType.type] = 'type';
tokenTypes[TokenType.parameter] = 'parameter';
tokenTypes[TokenType.variable] = 'variable';
tokenTypes[TokenType.enumMember] = 'enumMember';
tokenTypes[TokenType.property] = 'property';
tokenTypes[TokenType.function] = 'function';
tokenTypes[TokenType.method] = 'method';

const tokenModifiers: string[] = [];
tokenModifiers[TokenModifier.async] = 'async';
tokenModifiers[TokenModifier.declaration] = 'declaration';
tokenModifiers[TokenModifier.readonly] = 'readonly';
tokenModifiers[TokenModifier.static] = 'static';
tokenModifiers[TokenModifier.local] = 'local';
tokenModifiers[TokenModifier.defaultLibrary] = 'defaultLibrary';
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/languageFeatures/signatureHelp.ts]---
Location: vscode-main/extensions/typescript-language-features/src/languageFeatures/signatureHelp.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { DocumentSelector } from '../configuration/documentSelector';
import type * as Proto from '../tsServer/protocol/protocol';
import * as typeConverters from '../typeConverters';
import { ClientCapability, ITypeScriptServiceClient } from '../typescriptService';
import { conditionalRegistration, requireSomeCapability } from './util/dependentRegistration';
import * as Previewer from './util/textRendering';

class TypeScriptSignatureHelpProvider implements vscode.SignatureHelpProvider {

	public static readonly triggerCharacters = ['(', ',', '<'];
	public static readonly retriggerCharacters = [')'];

	public constructor(
		private readonly client: ITypeScriptServiceClient
	) { }

	public async provideSignatureHelp(
		document: vscode.TextDocument,
		position: vscode.Position,
		token: vscode.CancellationToken,
		context: vscode.SignatureHelpContext,
	): Promise<vscode.SignatureHelp | undefined> {
		const filepath = this.client.toOpenTsFilePath(document);
		if (!filepath) {
			return undefined;
		}

		const args: Proto.SignatureHelpRequestArgs = {
			...typeConverters.Position.toFileLocationRequestArgs(filepath, position),
			triggerReason: toTsTriggerReason(context)
		};
		const response = await this.client.interruptGetErr(() => this.client.execute('signatureHelp', args, token));
		if (response.type !== 'response' || !response.body) {
			return undefined;
		}

		const info = response.body;
		const result = new vscode.SignatureHelp();
		result.signatures = info.items.map(signature => this.convertSignature(signature, document.uri));
		result.activeSignature = this.getActiveSignature(context, info, result.signatures);
		result.activeParameter = this.getActiveParameter(info);

		return result;
	}

	private getActiveSignature(context: vscode.SignatureHelpContext, info: Proto.SignatureHelpItems, signatures: readonly vscode.SignatureInformation[]): number {
		// Try matching the previous active signature's label to keep it selected
		const previouslyActiveSignature = context.activeSignatureHelp?.signatures[context.activeSignatureHelp.activeSignature];
		if (previouslyActiveSignature && context.isRetrigger) {
			const existingIndex = signatures.findIndex(other => other.label === previouslyActiveSignature?.label);
			if (existingIndex >= 0) {
				return existingIndex;
			}
		}

		return info.selectedItemIndex;
	}

	private getActiveParameter(info: Proto.SignatureHelpItems): number {
		const activeSignature = info.items[info.selectedItemIndex];
		if (activeSignature?.isVariadic) {
			return Math.min(info.argumentIndex, activeSignature.parameters.length - 1);
		}
		return info.argumentIndex;
	}

	private convertSignature(item: Proto.SignatureHelpItem, baseUri: vscode.Uri) {
		const signature = new vscode.SignatureInformation(
			Previewer.asPlainTextWithLinks(item.prefixDisplayParts, this.client),
			Previewer.documentationToMarkdown(item.documentation, item.tags.filter(x => x.name !== 'param'), this.client, baseUri));

		let textIndex = signature.label.length;
		const separatorLabel = Previewer.asPlainTextWithLinks(item.separatorDisplayParts, this.client);
		for (let i = 0; i < item.parameters.length; ++i) {
			const parameter = item.parameters[i];
			const label = Previewer.asPlainTextWithLinks(parameter.displayParts, this.client);

			signature.parameters.push(
				new vscode.ParameterInformation(
					[textIndex, textIndex + label.length],
					Previewer.documentationToMarkdown(parameter.documentation, [], this.client, baseUri)));

			textIndex += label.length;
			signature.label += label;

			if (i !== item.parameters.length - 1) {
				signature.label += separatorLabel;
				textIndex += separatorLabel.length;
			}
		}

		signature.label += Previewer.asPlainTextWithLinks(item.suffixDisplayParts, this.client);
		return signature;
	}
}

function toTsTriggerReason(context: vscode.SignatureHelpContext): Proto.SignatureHelpTriggerReason {
	switch (context.triggerKind) {
		case vscode.SignatureHelpTriggerKind.TriggerCharacter:
			if (context.triggerCharacter) {
				if (context.isRetrigger) {
					return { kind: 'retrigger', triggerCharacter: context.triggerCharacter as Proto.SignatureHelpRetriggerCharacter };
				} else {
					return { kind: 'characterTyped', triggerCharacter: context.triggerCharacter as Proto.SignatureHelpTriggerCharacter };
				}
			} else {
				return { kind: 'invoked' };
			}

		case vscode.SignatureHelpTriggerKind.ContentChange:
			return context.isRetrigger ? { kind: 'retrigger' } : { kind: 'invoked' };

		case vscode.SignatureHelpTriggerKind.Invoke:
		default:
			return { kind: 'invoked' };
	}
}
export function register(
	selector: DocumentSelector,
	client: ITypeScriptServiceClient,
) {
	return conditionalRegistration([
		requireSomeCapability(client, ClientCapability.EnhancedSyntax, ClientCapability.Semantic),
	], () => {
		return vscode.languages.registerSignatureHelpProvider(selector.syntax,
			new TypeScriptSignatureHelpProvider(client), {
			triggerCharacters: TypeScriptSignatureHelpProvider.triggerCharacters,
			retriggerCharacters: TypeScriptSignatureHelpProvider.retriggerCharacters
		});
	});
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/languageFeatures/smartSelect.ts]---
Location: vscode-main/extensions/typescript-language-features/src/languageFeatures/smartSelect.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { DocumentSelector } from '../configuration/documentSelector';
import type * as Proto from '../tsServer/protocol/protocol';
import * as typeConverters from '../typeConverters';
import { ITypeScriptServiceClient } from '../typescriptService';

class SmartSelection implements vscode.SelectionRangeProvider {

	public constructor(
		private readonly client: ITypeScriptServiceClient
	) { }

	public async provideSelectionRanges(
		document: vscode.TextDocument,
		positions: vscode.Position[],
		token: vscode.CancellationToken,
	): Promise<vscode.SelectionRange[] | undefined> {
		const file = this.client.toOpenTsFilePath(document);
		if (!file) {
			return undefined;
		}

		const args: Proto.SelectionRangeRequestArgs = {
			file,
			locations: positions.map(typeConverters.Position.toLocation)
		};
		const response = await this.client.execute('selectionRange', args, token);
		if (response.type !== 'response' || !response.body) {
			return undefined;
		}
		return response.body.map(SmartSelection.convertSelectionRange);
	}

	private static convertSelectionRange(
		selectionRange: Proto.SelectionRange
	): vscode.SelectionRange {
		return new vscode.SelectionRange(
			typeConverters.Range.fromTextSpan(selectionRange.textSpan),
			selectionRange.parent ? SmartSelection.convertSelectionRange(selectionRange.parent) : undefined,
		);
	}
}

export function register(
	selector: DocumentSelector,
	client: ITypeScriptServiceClient,
) {
	return vscode.languages.registerSelectionRangeProvider(selector.syntax, new SmartSelection(client));
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/languageFeatures/sourceDefinition.ts]---
Location: vscode-main/extensions/typescript-language-features/src/languageFeatures/sourceDefinition.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { Command, CommandManager } from '../commands/commandManager';
import { isSupportedLanguageMode } from '../configuration/languageIds';
import { API } from '../tsServer/api';
import * as typeConverters from '../typeConverters';
import { ITypeScriptServiceClient } from '../typescriptService';


class SourceDefinitionCommand implements Command {

	public static readonly context = 'tsSupportsSourceDefinition';
	public static readonly minVersion = API.v470;

	public readonly id = 'typescript.goToSourceDefinition';

	public constructor(
		private readonly client: ITypeScriptServiceClient
	) { }

	public async execute() {
		if (this.client.apiVersion.lt(SourceDefinitionCommand.minVersion)) {
			vscode.window.showErrorMessage(vscode.l10n.t("Go to Source Definition failed. Requires TypeScript 4.7+."));
			return;
		}

		const activeEditor = vscode.window.activeTextEditor;
		if (!activeEditor) {
			vscode.window.showErrorMessage(vscode.l10n.t("Go to Source Definition failed. No resource provided."));
			return;
		}

		const resource = activeEditor.document.uri;
		const document = await vscode.workspace.openTextDocument(resource);
		if (!isSupportedLanguageMode(document)) {
			vscode.window.showErrorMessage(vscode.l10n.t("Go to Source Definition failed. Unsupported file type."));
			return;
		}

		const openedFiledPath = this.client.toOpenTsFilePath(document);
		if (!openedFiledPath) {
			vscode.window.showErrorMessage(vscode.l10n.t("Go to Source Definition failed. Unknown file type."));
			return;
		}

		await vscode.window.withProgress({
			location: vscode.ProgressLocation.Window,
			title: vscode.l10n.t("Finding source definitions")
		}, async (_progress, token) => {

			const position = activeEditor.selection.anchor;
			const args = typeConverters.Position.toFileLocationRequestArgs(openedFiledPath, position);
			const response = await this.client.execute('findSourceDefinition', args, token);
			if (response.type === 'response' && response.body) {
				const locations: vscode.Location[] = response.body.map(reference =>
					typeConverters.Location.fromTextSpan(this.client.toResource(reference.file), reference));

				if (locations.length) {
					if (locations.length === 1) {
						vscode.commands.executeCommand('vscode.open', locations[0].uri.with({
							fragment: `L${locations[0].range.start.line + 1},${locations[0].range.start.character + 1}`
						}));
					} else {
						vscode.commands.executeCommand('editor.action.showReferences', resource, position, locations);
					}
					return;
				}
			}

			vscode.window.showErrorMessage(vscode.l10n.t("No source definitions found."));
		});
	}
}


export function register(
	client: ITypeScriptServiceClient,
	commandManager: CommandManager
): vscode.Disposable {
	function updateContext(overrideValue?: boolean) {
		vscode.commands.executeCommand('setContext', SourceDefinitionCommand.context, overrideValue ?? client.apiVersion.gte(SourceDefinitionCommand.minVersion));
	}
	updateContext();

	commandManager.register(new SourceDefinitionCommand(client));
	return vscode.Disposable.from(
		client.onTsServerStarted(() => updateContext()),
		new vscode.Disposable(() => updateContext(false)),
	);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/languageFeatures/tagClosing.ts]---
Location: vscode-main/extensions/typescript-language-features/src/languageFeatures/tagClosing.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { DocumentSelector } from '../configuration/documentSelector';
import { LanguageDescription } from '../configuration/languageDescription';
import type * as Proto from '../tsServer/protocol/protocol';
import * as typeConverters from '../typeConverters';
import { ITypeScriptServiceClient } from '../typescriptService';
import { Disposable } from '../utils/dispose';
import { Condition, conditionalRegistration } from './util/dependentRegistration';

class TagClosing extends Disposable {

	private _disposed = false;
	private _timeout: NodeJS.Timeout | undefined = undefined;
	private _cancel: vscode.CancellationTokenSource | undefined = undefined;

	constructor(
		private readonly client: ITypeScriptServiceClient
	) {
		super();
		vscode.workspace.onDidChangeTextDocument(
			event => this.onDidChangeTextDocument(event),
			null,
			this._disposables);
	}

	public override dispose() {
		super.dispose();
		this._disposed = true;

		if (this._timeout) {
			clearTimeout(this._timeout);
			this._timeout = undefined;
		}

		if (this._cancel) {
			this._cancel.cancel();
			this._cancel.dispose();
			this._cancel = undefined;
		}
	}

	private onDidChangeTextDocument(
		{ document, contentChanges, reason }: vscode.TextDocumentChangeEvent
	) {
		if (contentChanges.length === 0 || reason === vscode.TextDocumentChangeReason.Undo || reason === vscode.TextDocumentChangeReason.Redo) {
			return;
		}

		const activeDocument = vscode.window.activeTextEditor?.document;
		if (document !== activeDocument) {
			return;
		}

		const filepath = this.client.toOpenTsFilePath(document);
		if (!filepath) {
			return;
		}

		if (typeof this._timeout !== 'undefined') {
			clearTimeout(this._timeout);
		}

		if (this._cancel) {
			this._cancel.cancel();
			this._cancel.dispose();
			this._cancel = undefined;
		}

		const lastChange = contentChanges[contentChanges.length - 1];
		const lastCharacter = lastChange.text[lastChange.text.length - 1];
		if (lastChange.rangeLength > 0 || lastCharacter !== '>' && lastCharacter !== '/') {
			return;
		}

		const priorCharacter = lastChange.range.start.character > 0
			? document.getText(new vscode.Range(lastChange.range.start.translate({ characterDelta: -1 }), lastChange.range.start))
			: '';
		if (priorCharacter === '>') {
			return;
		}

		const version = document.version;
		this._timeout = setTimeout(async () => {
			this._timeout = undefined;

			if (this._disposed) {
				return;
			}

			const addedLines = lastChange.text.split(/\r\n|\n/g);
			const position = addedLines.length <= 1
				? lastChange.range.start.translate({ characterDelta: lastChange.text.length })
				: new vscode.Position(lastChange.range.start.line + addedLines.length - 1, addedLines[addedLines.length - 1].length);

			const args: Proto.JsxClosingTagRequestArgs = typeConverters.Position.toFileLocationRequestArgs(filepath, position);
			this._cancel = new vscode.CancellationTokenSource();
			const response = await this.client.execute('jsxClosingTag', args, this._cancel.token);
			if (response.type !== 'response' || !response.body) {
				return;
			}

			if (this._disposed) {
				return;
			}

			const activeEditor = vscode.window.activeTextEditor;
			if (!activeEditor) {
				return;
			}

			const insertion = response.body;
			const activeDocument = activeEditor.document;
			if (document === activeDocument && activeDocument.version === version) {
				activeEditor.insertSnippet(
					this.getTagSnippet(insertion),
					this.getInsertionPositions(activeEditor, position));
			}
		}, 100);
	}

	private getTagSnippet(closingTag: Proto.TextInsertion): vscode.SnippetString {
		const snippet = new vscode.SnippetString();
		snippet.appendPlaceholder('', 0);
		snippet.appendText(closingTag.newText);
		return snippet;
	}

	private getInsertionPositions(editor: vscode.TextEditor, position: vscode.Position) {
		const activeSelectionPositions = editor.selections.map(s => s.active);
		return activeSelectionPositions.some(p => p.isEqual(position))
			? activeSelectionPositions
			: position;
	}
}

function requireActiveDocumentSetting(
	selector: vscode.DocumentSelector,
	language: LanguageDescription,
) {
	return new Condition(
		() => {
			const editor = vscode.window.activeTextEditor;
			if (!editor || !vscode.languages.match(selector, editor.document)) {
				return false;
			}

			return !!vscode.workspace.getConfiguration(language.id, editor.document).get('autoClosingTags');
		},
		handler => {
			return vscode.Disposable.from(
				vscode.window.onDidChangeActiveTextEditor(handler),
				vscode.workspace.onDidOpenTextDocument(handler),
				vscode.workspace.onDidChangeConfiguration(handler));
		});
}

export function register(
	selector: DocumentSelector,
	language: LanguageDescription,
	client: ITypeScriptServiceClient,
) {
	return conditionalRegistration([
		requireActiveDocumentSetting(selector.syntax, language)
	], () => new TagClosing(client));
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/languageFeatures/tsconfig.ts]---
Location: vscode-main/extensions/typescript-language-features/src/languageFeatures/tsconfig.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as jsonc from 'jsonc-parser';
import { isAbsolute, posix } from 'path';
import * as vscode from 'vscode';
import { Utils } from 'vscode-uri';
import { coalesce } from '../utils/arrays';
import { exists, looksLikeAbsoluteWindowsPath } from '../utils/fs';

function mapChildren<R>(node: jsonc.Node | undefined, f: (x: jsonc.Node) => R): R[] {
	return node && node.type === 'array' && node.children
		? node.children.map(f)
		: [];
}

const openExtendsLinkCommandId = '_typescript.openExtendsLink';

enum TsConfigLinkType {
	Extends,
	References
}

type OpenExtendsLinkCommandArgs = {
	readonly resourceUri: vscode.Uri;
	readonly extendsValue: string;
	readonly linkType: TsConfigLinkType;
};


class TsconfigLinkProvider implements vscode.DocumentLinkProvider {

	public provideDocumentLinks(
		document: vscode.TextDocument,
		_token: vscode.CancellationToken
	): vscode.DocumentLink[] {
		const root = jsonc.parseTree(document.getText());
		if (!root) {
			return [];
		}

		return coalesce([
			this.getExtendsLink(document, root),
			...this.getFilesLinks(document, root),
			...this.getReferencesLinks(document, root)
		]);
	}

	private getExtendsLink(document: vscode.TextDocument, root: jsonc.Node): vscode.DocumentLink | undefined {
		const node = jsonc.findNodeAtLocation(root, ['extends']);
		return node && this.tryCreateTsConfigLink(document, node, TsConfigLinkType.Extends);
	}

	private getReferencesLinks(document: vscode.TextDocument, root: jsonc.Node) {
		return mapChildren(
			jsonc.findNodeAtLocation(root, ['references']),
			child => {
				const pathNode = jsonc.findNodeAtLocation(child, ['path']);
				return pathNode && this.tryCreateTsConfigLink(document, pathNode, TsConfigLinkType.References);
			});
	}

	private tryCreateTsConfigLink(document: vscode.TextDocument, node: jsonc.Node, linkType: TsConfigLinkType): vscode.DocumentLink | undefined {
		if (!this.isPathValue(node)) {
			return undefined;
		}

		const args: OpenExtendsLinkCommandArgs = {
			resourceUri: { ...document.uri.toJSON(), $mid: undefined },
			extendsValue: node.value,
			linkType
		};

		const link = new vscode.DocumentLink(
			this.getRange(document, node),
			vscode.Uri.parse(`command:${openExtendsLinkCommandId}?${JSON.stringify(args)}`));
		link.tooltip = vscode.l10n.t("Follow link");
		return link;
	}

	private getFilesLinks(document: vscode.TextDocument, root: jsonc.Node) {
		return mapChildren(
			jsonc.findNodeAtLocation(root, ['files']),
			child => this.pathNodeToLink(document, child));
	}

	private pathNodeToLink(
		document: vscode.TextDocument,
		node: jsonc.Node | undefined
	): vscode.DocumentLink | undefined {
		return this.isPathValue(node)
			? new vscode.DocumentLink(this.getRange(document, node), this.getFileTarget(document, node))
			: undefined;
	}

	private isPathValue(node: jsonc.Node | undefined): node is jsonc.Node {
		return node
			&& node.type === 'string'
			&& node.value
			&& !(node.value as string).includes('*'); // don't treat globs as links.
	}

	private getFileTarget(document: vscode.TextDocument, node: jsonc.Node): vscode.Uri {
		if (isAbsolute(node.value)) {
			return vscode.Uri.file(node.value);
		}

		return vscode.Uri.joinPath(Utils.dirname(document.uri), node.value);
	}

	private getRange(document: vscode.TextDocument, node: jsonc.Node) {
		const offset = node.offset;
		const start = document.positionAt(offset + 1);
		const end = document.positionAt(offset + (node.length - 1));
		return new vscode.Range(start, end);
	}
}

async function resolveNodeModulesPath(baseDirUri: vscode.Uri, pathCandidates: string[]): Promise<vscode.Uri | undefined> {
	let currentUri = baseDirUri;
	const baseCandidate = pathCandidates[0];
	const sepIndex = baseCandidate.startsWith('@') ? 2 : 1;
	const moduleBasePath = baseCandidate.split(posix.sep).slice(0, sepIndex).join(posix.sep);
	while (true) {
		const moduleAbsoluteUrl = vscode.Uri.joinPath(currentUri, 'node_modules', moduleBasePath);
		let moduleStat: vscode.FileStat | undefined;
		try {
			moduleStat = await vscode.workspace.fs.stat(moduleAbsoluteUrl);
		} catch (err) {
			// noop
		}

		if (moduleStat && (moduleStat.type & vscode.FileType.Directory)) {
			for (const uriCandidate of pathCandidates
				.map((relativePath) => relativePath.split(posix.sep).slice(sepIndex).join(posix.sep))
				// skip empty paths within module
				.filter(Boolean)
				.map((relativeModulePath) => vscode.Uri.joinPath(moduleAbsoluteUrl, relativeModulePath))
			) {
				if (await exists(uriCandidate)) {
					return uriCandidate;
				}
			}
			// Continue to looking for potentially another version
		}

		const oldUri = currentUri;
		currentUri = vscode.Uri.joinPath(currentUri, '..');

		// Can't go next. Reached the system root
		if (oldUri.path === currentUri.path) {
			return;
		}
	}
}

// Reference Extends:https://github.com/microsoft/TypeScript/blob/febfd442cdba343771f478cf433b0892f213ad2f/src/compiler/commandLineParser.ts#L3005
// Reference Project References: https://github.com/microsoft/TypeScript/blob/7377f5cb9db19d79a6167065b323a45611c812b5/src/compiler/tsbuild.ts#L188C1-L194C2
/**
* @returns Returns undefined in case of lack of result while trying to resolve from node_modules
*/
async function getTsconfigPath(baseDirUri: vscode.Uri, pathValue: string, linkType: TsConfigLinkType): Promise<vscode.Uri | undefined> {
	async function resolve(absolutePath: vscode.Uri): Promise<vscode.Uri> {
		if (absolutePath.path.endsWith('.json') || await exists(absolutePath)) {
			return absolutePath;
		}
		return absolutePath.with({
			path: `${absolutePath.path}${linkType === TsConfigLinkType.References ? '/tsconfig.json' : '.json'}`
		});
	}

	const isRelativePath = ['./', '../'].some(str => pathValue.startsWith(str));
	if (isRelativePath) {
		return resolve(vscode.Uri.joinPath(baseDirUri, pathValue));
	}

	if (pathValue.startsWith('/') || looksLikeAbsoluteWindowsPath(pathValue)) {
		return resolve(vscode.Uri.file(pathValue));
	}

	// Otherwise resolve like a module
	return resolveNodeModulesPath(baseDirUri, [
		pathValue,
		...pathValue.endsWith('.json') ? [] : [
			`${pathValue}.json`,
			`${pathValue}/tsconfig.json`,
		]
	]);
}

export function register() {
	const patterns: vscode.GlobPattern[] = [
		'**/[jt]sconfig.json',
		'**/[jt]sconfig.*.json',
	];

	const languages = ['json', 'jsonc'];

	const selector: vscode.DocumentSelector =
		languages.map(language => patterns.map((pattern): vscode.DocumentFilter => ({ language, pattern })))
			.flat();

	return vscode.Disposable.from(
		vscode.commands.registerCommand(openExtendsLinkCommandId, async ({ resourceUri, extendsValue, linkType }: OpenExtendsLinkCommandArgs) => {
			const tsconfigPath = await getTsconfigPath(Utils.dirname(vscode.Uri.from(resourceUri)), extendsValue, linkType);
			if (tsconfigPath === undefined) {
				vscode.window.showErrorMessage(vscode.l10n.t("Failed to resolve {0} as module", extendsValue));
				return;
			}
			// Will suggest to create a .json variant if it doesn't exist yet (but only for relative paths)
			await vscode.commands.executeCommand('vscode.open', tsconfigPath);
		}),
		vscode.languages.registerDocumentLinkProvider(selector, new TsconfigLinkProvider()),
	);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/languageFeatures/typeDefinitions.ts]---
Location: vscode-main/extensions/typescript-language-features/src/languageFeatures/typeDefinitions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { DocumentSelector } from '../configuration/documentSelector';
import { ClientCapability, ITypeScriptServiceClient } from '../typescriptService';
import DefinitionProviderBase from './definitionProviderBase';
import { conditionalRegistration, requireSomeCapability } from './util/dependentRegistration';

export default class TypeScriptTypeDefinitionProvider extends DefinitionProviderBase implements vscode.TypeDefinitionProvider {
	public provideTypeDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Promise<vscode.Definition | undefined> {
		return this.getSymbolLocations('typeDefinition', document, position, token);
	}
}

export function register(
	selector: DocumentSelector,
	client: ITypeScriptServiceClient,
) {
	return conditionalRegistration([
		requireSomeCapability(client, ClientCapability.EnhancedSyntax, ClientCapability.Semantic),
	], () => {
		return vscode.languages.registerTypeDefinitionProvider(selector.syntax,
			new TypeScriptTypeDefinitionProvider(client));
	});
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/languageFeatures/updatePathsOnRename.ts]---
Location: vscode-main/extensions/typescript-language-features/src/languageFeatures/updatePathsOnRename.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as path from 'path';
import * as vscode from 'vscode';
import * as fileSchemes from '../configuration/fileSchemes';
import { doesResourceLookLikeATypeScriptFile } from '../configuration/languageDescription';
import type * as Proto from '../tsServer/protocol/protocol';
import * as typeConverters from '../typeConverters';
import { ClientCapability, ITypeScriptServiceClient } from '../typescriptService';
import { Delayer } from '../utils/async';
import { nulToken } from '../utils/cancellation';
import { Disposable } from '../utils/dispose';
import FileConfigurationManager from './fileConfigurationManager';
import { conditionalRegistration, requireSomeCapability } from './util/dependentRegistration';


const updateImportsOnFileMoveName = 'updateImportsOnFileMove.enabled';

async function isDirectory(resource: vscode.Uri): Promise<boolean> {
	try {
		return (await vscode.workspace.fs.stat(resource)).type === vscode.FileType.Directory;
	} catch {
		return false;
	}
}

const enum UpdateImportsOnFileMoveSetting {
	Prompt = 'prompt',
	Always = 'always',
	Never = 'never',
}

interface RenameAction {
	readonly oldUri: vscode.Uri;
	readonly newUri: vscode.Uri;
	readonly newFilePath: string;
	readonly oldFilePath: string;
	readonly jsTsFileThatIsBeingMoved: vscode.Uri;
}

class UpdateImportsOnFileRenameHandler extends Disposable {

	private readonly _delayer = new Delayer(50);
	private readonly _pendingRenames = new Set<RenameAction>();

	public constructor(
		private readonly client: ITypeScriptServiceClient,
		private readonly fileConfigurationManager: FileConfigurationManager,
		private readonly _handles: (uri: vscode.Uri) => Promise<boolean>,
	) {
		super();

		this._register(vscode.workspace.onDidRenameFiles(async (e) => {
			for (const { newUri, oldUri } of e.files) {
				const newFilePath = this.client.toTsFilePath(newUri);
				if (!newFilePath) {
					continue;
				}

				const oldFilePath = this.client.toTsFilePath(oldUri);
				if (!oldFilePath) {
					continue;
				}

				const config = this.getConfiguration(newUri);
				const setting = config.get<UpdateImportsOnFileMoveSetting>(updateImportsOnFileMoveName);
				if (setting === UpdateImportsOnFileMoveSetting.Never) {
					continue;
				}

				// Try to get a js/ts file that is being moved
				// For directory moves, this returns a js/ts file under the directory.
				const jsTsFileThatIsBeingMoved = await this.getJsTsFileBeingMoved(newUri);
				if (!jsTsFileThatIsBeingMoved || !this.client.toTsFilePath(jsTsFileThatIsBeingMoved)) {
					continue;
				}

				this._pendingRenames.add({ oldUri, newUri, newFilePath, oldFilePath, jsTsFileThatIsBeingMoved });

				this._delayer.trigger(() => {
					vscode.window.withProgress({
						location: vscode.ProgressLocation.Window,
						title: vscode.l10n.t("Checking for update of JS/TS imports")
					}, () => this.flushRenames());
				});
			}
		}));
	}

	private async flushRenames(): Promise<void> {
		const renames = Array.from(this._pendingRenames);
		this._pendingRenames.clear();
		for (const group of this.groupRenames(renames)) {
			const edits = new vscode.WorkspaceEdit();
			const resourcesBeingRenamed: vscode.Uri[] = [];

			for (const { oldUri, newUri, newFilePath, oldFilePath, jsTsFileThatIsBeingMoved } of group) {
				const document = await vscode.workspace.openTextDocument(jsTsFileThatIsBeingMoved);

				// Make sure TS knows about file
				this.client.bufferSyncSupport.closeResource(oldUri);
				this.client.bufferSyncSupport.openTextDocument(document);

				if (await this.withEditsForFileRename(edits, document, oldFilePath, newFilePath)) {
					resourcesBeingRenamed.push(newUri);
				}
			}

			if (edits.size) {
				if (await this.confirmActionWithUser(resourcesBeingRenamed)) {
					await vscode.workspace.applyEdit(edits, { isRefactoring: true });
				}
			}
		}
	}

	private async confirmActionWithUser(newResources: readonly vscode.Uri[]): Promise<boolean> {
		if (!newResources.length) {
			return false;
		}

		const config = this.getConfiguration(newResources[0]);
		const setting = config.get<UpdateImportsOnFileMoveSetting>(updateImportsOnFileMoveName);
		switch (setting) {
			case UpdateImportsOnFileMoveSetting.Always:
				return true;
			case UpdateImportsOnFileMoveSetting.Never:
				return false;
			case UpdateImportsOnFileMoveSetting.Prompt:
			default:
				return this.promptUser(newResources);
		}
	}

	private getConfiguration(resource: vscode.Uri) {
		return vscode.workspace.getConfiguration(doesResourceLookLikeATypeScriptFile(resource) ? 'typescript' : 'javascript', resource);
	}

	private async promptUser(newResources: readonly vscode.Uri[]): Promise<boolean> {
		if (!newResources.length) {
			return false;
		}

		const rejectItem: vscode.MessageItem = {
			title: vscode.l10n.t("No"),
			isCloseAffordance: true,
		};

		const acceptItem: vscode.MessageItem = {
			title: vscode.l10n.t("Yes"),
		};

		const alwaysItem: vscode.MessageItem = {
			title: vscode.l10n.t("Always"),
		};

		const neverItem: vscode.MessageItem = {
			title: vscode.l10n.t("Never"),
		};

		const response = await vscode.window.showInformationMessage(
			newResources.length === 1
				? vscode.l10n.t("Update imports for '{0}'?", path.basename(newResources[0].fsPath))
				: this.getConfirmMessage(vscode.l10n.t("Update imports for the following {0} files?", newResources.length), newResources), {
			modal: true,
		}, rejectItem, acceptItem, alwaysItem, neverItem);


		switch (response) {
			case acceptItem: {
				return true;
			}
			case rejectItem: {
				return false;
			}
			case alwaysItem: {
				const config = this.getConfiguration(newResources[0]);
				config.update(
					updateImportsOnFileMoveName,
					UpdateImportsOnFileMoveSetting.Always,
					this.getConfigTargetScope(config, updateImportsOnFileMoveName));
				return true;
			}
			case neverItem: {
				const config = this.getConfiguration(newResources[0]);
				config.update(
					updateImportsOnFileMoveName,
					UpdateImportsOnFileMoveSetting.Never,
					this.getConfigTargetScope(config, updateImportsOnFileMoveName));
				return false;
			}
			default: {
				return false;
			}
		}
	}

	private async getJsTsFileBeingMoved(resource: vscode.Uri): Promise<vscode.Uri | undefined> {
		if (resource.scheme !== fileSchemes.file) {
			return undefined;
		}

		if (await isDirectory(resource)) {
			const files = await vscode.workspace.findFiles(new vscode.RelativePattern(resource, '**/*.{ts,tsx,js,jsx}'), '**/node_modules/**', 1);
			return files[0];
		}

		return (await this._handles(resource)) ? resource : undefined;
	}

	private async withEditsForFileRename(
		edits: vscode.WorkspaceEdit,
		document: vscode.TextDocument,
		oldFilePath: string,
		newFilePath: string,
	): Promise<boolean> {
		const response = await this.client.interruptGetErr(() => {
			this.fileConfigurationManager.setGlobalConfigurationFromDocument(document, nulToken);
			const args: Proto.GetEditsForFileRenameRequestArgs = {
				oldFilePath,
				newFilePath,
			};
			return this.client.execute('getEditsForFileRename', args, nulToken);
		});
		if (response.type !== 'response' || !response.body.length) {
			return false;
		}

		typeConverters.WorkspaceEdit.withFileCodeEdits(edits, this.client, response.body);
		return true;
	}

	private groupRenames(renames: Iterable<RenameAction>): Iterable<Iterable<RenameAction>> {
		const groups = new Map<string, Set<RenameAction>>();

		for (const rename of renames) {
			// Group renames by type (js/ts) and by workspace.
			const key = `${this.client.getWorkspaceRootForResource(rename.jsTsFileThatIsBeingMoved)?.fsPath}@@@${doesResourceLookLikeATypeScriptFile(rename.jsTsFileThatIsBeingMoved)}`;
			if (!groups.has(key)) {
				groups.set(key, new Set());
			}
			groups.get(key)!.add(rename);
		}

		return groups.values();
	}

	private getConfirmMessage(start: string, resourcesToConfirm: readonly vscode.Uri[]): string {
		const MAX_CONFIRM_FILES = 10;

		const paths = [start];
		paths.push('');
		paths.push(...resourcesToConfirm.slice(0, MAX_CONFIRM_FILES).map(r => path.basename(r.fsPath)));

		if (resourcesToConfirm.length > MAX_CONFIRM_FILES) {
			if (resourcesToConfirm.length - MAX_CONFIRM_FILES === 1) {
				paths.push(vscode.l10n.t("...1 additional file not shown"));
			} else {
				paths.push(vscode.l10n.t("...{0} additional files not shown", resourcesToConfirm.length - MAX_CONFIRM_FILES));
			}
		}

		paths.push('');
		return paths.join('\n');
	}

	private getConfigTargetScope(config: vscode.WorkspaceConfiguration, settingsName: string): vscode.ConfigurationTarget {
		const inspected = config.inspect(settingsName);
		if (inspected?.workspaceFolderValue) {
			return vscode.ConfigurationTarget.WorkspaceFolder;
		}

		if (inspected?.workspaceValue) {
			return vscode.ConfigurationTarget.Workspace;
		}

		return vscode.ConfigurationTarget.Global;
	}
}

export function register(
	client: ITypeScriptServiceClient,
	fileConfigurationManager: FileConfigurationManager,
	handles: (uri: vscode.Uri) => Promise<boolean>,
) {
	return conditionalRegistration([
		requireSomeCapability(client, ClientCapability.Semantic),
	], () => {
		return new UpdateImportsOnFileRenameHandler(client, fileConfigurationManager, handles);
	});
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/languageFeatures/workspaceSymbols.ts]---
Location: vscode-main/extensions/typescript-language-features/src/languageFeatures/workspaceSymbols.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import * as fileSchemes from '../configuration/fileSchemes';
import { doesResourceLookLikeAJavaScriptFile, doesResourceLookLikeATypeScriptFile } from '../configuration/languageDescription';
import { API } from '../tsServer/api';
import { parseKindModifier } from '../tsServer/protocol/modifiers';
import type * as Proto from '../tsServer/protocol/protocol';
import * as PConst from '../tsServer/protocol/protocol.const';
import * as typeConverters from '../typeConverters';
import { ITypeScriptServiceClient } from '../typescriptService';
import { coalesce } from '../utils/arrays';

function getSymbolKind(item: Proto.NavtoItem): vscode.SymbolKind {
	switch (item.kind) {
		case PConst.Kind.method: return vscode.SymbolKind.Method;
		case PConst.Kind.enum: return vscode.SymbolKind.Enum;
		case PConst.Kind.enumMember: return vscode.SymbolKind.EnumMember;
		case PConst.Kind.function: return vscode.SymbolKind.Function;
		case PConst.Kind.class: return vscode.SymbolKind.Class;
		case PConst.Kind.interface: return vscode.SymbolKind.Interface;
		case PConst.Kind.type: return vscode.SymbolKind.Class;
		case PConst.Kind.memberVariable: return vscode.SymbolKind.Field;
		case PConst.Kind.memberGetAccessor: return vscode.SymbolKind.Field;
		case PConst.Kind.memberSetAccessor: return vscode.SymbolKind.Field;
		case PConst.Kind.variable: return vscode.SymbolKind.Variable;
		default: return vscode.SymbolKind.Variable;
	}
}

class TypeScriptWorkspaceSymbolProvider implements vscode.WorkspaceSymbolProvider {

	public constructor(
		private readonly client: ITypeScriptServiceClient,
		private readonly modeIds: readonly string[],
	) { }

	public async provideWorkspaceSymbols(
		search: string,
		token: vscode.CancellationToken
	): Promise<vscode.SymbolInformation[]> {
		let file: string | undefined;
		if (this.searchAllOpenProjects) {
			file = undefined;
		} else {
			const document = this.getDocument();
			file = document ? await this.toOpenedFiledPath(document) : undefined;

			if (!file && this.client.apiVersion.lt(API.v390)) {
				return [];
			}
		}

		const args: Proto.NavtoRequestArgs = {
			file,
			searchValue: search,
			maxResultCount: 256,
		};

		const response = await this.client.execute('navto', args, token);
		if (response.type !== 'response' || !response.body) {
			return [];
		}

		return coalesce(response.body.map(item => this.toSymbolInformation(item)));
	}

	private get searchAllOpenProjects() {
		return this.client.apiVersion.gte(API.v390)
			&& vscode.workspace.getConfiguration('typescript').get('workspaceSymbols.scope', 'allOpenProjects') === 'allOpenProjects';
	}

	private async toOpenedFiledPath(document: vscode.TextDocument) {
		if (document.uri.scheme === fileSchemes.git) {
			try {
				const path = vscode.Uri.file(JSON.parse(document.uri.query)?.path);
				if (doesResourceLookLikeATypeScriptFile(path) || doesResourceLookLikeAJavaScriptFile(path)) {
					const document = await vscode.workspace.openTextDocument(path);
					return this.client.toOpenTsFilePath(document);
				}
			} catch {
				// noop
			}
		}
		return this.client.toOpenTsFilePath(document);
	}

	private toSymbolInformation(item: Proto.NavtoItem): vscode.SymbolInformation | undefined {
		if (item.kind === 'alias' && !item.containerName) {
			return;
		}

		const uri = this.client.toResource(item.file);
		if (fileSchemes.isOfScheme(uri, fileSchemes.chatCodeBlock)) {
			return;
		}

		const label = TypeScriptWorkspaceSymbolProvider.getLabel(item);
		const info = new vscode.SymbolInformation(
			label,
			getSymbolKind(item),
			item.containerName || '',
			typeConverters.Location.fromTextSpan(uri, item));
		const kindModifiers = item.kindModifiers ? parseKindModifier(item.kindModifiers) : undefined;
		if (kindModifiers?.has(PConst.KindModifiers.deprecated)) {
			info.tags = [vscode.SymbolTag.Deprecated];
		}
		return info;
	}

	private static getLabel(item: Proto.NavtoItem) {
		const label = item.name;
		if (item.kind === 'method' || item.kind === 'function') {
			return label + '()';
		}
		return label;
	}

	private getDocument(): vscode.TextDocument | undefined {
		// typescript wants to have a resource even when asking
		// general questions so we check the active editor. If this
		// doesn't match we take the first TS document.

		const activeDocument = vscode.window.activeTextEditor?.document;
		if (activeDocument) {
			if (this.modeIds.includes(activeDocument.languageId)) {
				return activeDocument;
			}
		}

		const documents = vscode.workspace.textDocuments;
		for (const document of documents) {
			if (this.modeIds.includes(document.languageId)) {
				return document;
			}
		}
		return undefined;
	}
}

export function register(
	client: ITypeScriptServiceClient,
	modeIds: readonly string[],
) {
	return vscode.languages.registerWorkspaceSymbolProvider(
		new TypeScriptWorkspaceSymbolProvider(client, modeIds));
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/languageFeatures/codeLens/baseCodeLensProvider.ts]---
Location: vscode-main/extensions/typescript-language-features/src/languageFeatures/codeLens/baseCodeLensProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { CachedResponse } from '../../tsServer/cachedResponse';
import type * as Proto from '../../tsServer/protocol/protocol';
import * as typeConverters from '../../typeConverters';
import { ITypeScriptServiceClient } from '../../typescriptService';
import { escapeRegExp } from '../../utils/regexp';
import { Disposable } from '../../utils/dispose';


export class ReferencesCodeLens extends vscode.CodeLens {
	constructor(
		public document: vscode.Uri,
		public file: string,
		range: vscode.Range
	) {
		super(range);
	}
}

export abstract class TypeScriptBaseCodeLensProvider extends Disposable implements vscode.CodeLensProvider<ReferencesCodeLens> {
	protected changeEmitter = this._register(new vscode.EventEmitter<void>());
	public onDidChangeCodeLenses = this.changeEmitter.event;

	public static readonly cancelledCommand: vscode.Command = {
		// Cancellation is not an error. Just show nothing until we can properly re-compute the code lens
		title: '',
		command: ''
	};

	public static readonly errorCommand: vscode.Command = {
		title: vscode.l10n.t("Could not determine references"),
		command: ''
	};

	public constructor(
		protected client: ITypeScriptServiceClient,
		private readonly cachedResponse: CachedResponse<Proto.NavTreeResponse>
	) {
		super();
	}

	async provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): Promise<ReferencesCodeLens[]> {
		const filepath = this.client.toOpenTsFilePath(document);
		if (!filepath) {
			return [];
		}

		const response = await this.cachedResponse.execute(document, () => this.client.execute('navtree', { file: filepath }, token));
		if (response.type !== 'response') {
			return [];
		}

		const referenceableSpans: vscode.Range[] = [];
		response.body?.childItems?.forEach(item => this.walkNavTree(document, item, undefined, referenceableSpans));
		return referenceableSpans.map(span => new ReferencesCodeLens(document.uri, filepath, span));
	}

	protected abstract extractSymbol(
		document: vscode.TextDocument,
		item: Proto.NavigationTree,
		parent: Proto.NavigationTree | undefined
	): vscode.Range | undefined;

	private walkNavTree(
		document: vscode.TextDocument,
		item: Proto.NavigationTree,
		parent: Proto.NavigationTree | undefined,
		results: vscode.Range[]
	): void {
		const range = this.extractSymbol(document, item, parent);
		if (range) {
			results.push(range);
		}

		item.childItems?.forEach(child => this.walkNavTree(document, child, item, results));
	}
}

export function getSymbolRange(
	document: vscode.TextDocument,
	item: Proto.NavigationTree
): vscode.Range | undefined {
	if (item.nameSpan) {
		return typeConverters.Range.fromTextSpan(item.nameSpan);
	}

	// In older versions, we have to calculate this manually. See #23924
	const span = item.spans?.[0];
	if (!span) {
		return undefined;
	}

	const range = typeConverters.Range.fromTextSpan(span);
	const text = document.getText(range);

	const identifierMatch = new RegExp(`^(.*?(\\b|\\W))${escapeRegExp(item.text || '')}(\\b|\\W)`, 'gm');
	const match = identifierMatch.exec(text);
	const prefixLength = match ? match.index + match[1].length : 0;
	const startOffset = document.offsetAt(new vscode.Position(range.start.line, range.start.character)) + prefixLength;
	return new vscode.Range(
		document.positionAt(startOffset),
		document.positionAt(startOffset + item.text.length));
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/languageFeatures/codeLens/implementationsCodeLens.ts]---
Location: vscode-main/extensions/typescript-language-features/src/languageFeatures/codeLens/implementationsCodeLens.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { DocumentSelector } from '../../configuration/documentSelector';
import { LanguageDescription } from '../../configuration/languageDescription';
import { CachedResponse } from '../../tsServer/cachedResponse';
import type * as Proto from '../../tsServer/protocol/protocol';
import * as PConst from '../../tsServer/protocol/protocol.const';
import * as typeConverters from '../../typeConverters';
import { ClientCapability, ITypeScriptServiceClient } from '../../typescriptService';
import { conditionalRegistration, requireGlobalConfiguration, requireSomeCapability } from '../util/dependentRegistration';
import { ReferencesCodeLens, TypeScriptBaseCodeLensProvider, getSymbolRange } from './baseCodeLensProvider';
import { ExecutionTarget } from '../../tsServer/server';


export default class TypeScriptImplementationsCodeLensProvider extends TypeScriptBaseCodeLensProvider {
	public constructor(
		client: ITypeScriptServiceClient,
		protected _cachedResponse: CachedResponse<Proto.NavTreeResponse>,
		private readonly language: LanguageDescription
	) {
		super(client, _cachedResponse);
		this._register(
			vscode.workspace.onDidChangeConfiguration(evt => {
				if (evt.affectsConfiguration(`${language.id}.implementationsCodeLens.showOnInterfaceMethods`) ||
					evt.affectsConfiguration(`${language.id}.implementationsCodeLens.showOnAllClassMethods`)) {
					this.changeEmitter.fire();
				}
			})
		);
	}

	public async resolveCodeLens(
		codeLens: ReferencesCodeLens,
		token: vscode.CancellationToken,
	): Promise<vscode.CodeLens> {
		const args = typeConverters.Position.toFileLocationRequestArgs(codeLens.file, codeLens.range.start);
		const response = await this.client.execute('implementation', args, token, {
			lowPriority: true,
			executionTarget: ExecutionTarget.Semantic,
			cancelOnResourceChange: codeLens.document,
		});
		if (response.type !== 'response' || !response.body) {
			codeLens.command = response.type === 'cancelled'
				? TypeScriptBaseCodeLensProvider.cancelledCommand
				: TypeScriptBaseCodeLensProvider.errorCommand;
			return codeLens;
		}

		const locations = response.body
			.map(reference =>
				// Only take first line on implementation: https://github.com/microsoft/vscode/issues/23924
				new vscode.Location(this.client.toResource(reference.file),
					reference.start.line === reference.end.line
						? typeConverters.Range.fromTextSpan(reference)
						: new vscode.Range(
							typeConverters.Position.fromLocation(reference.start),
							new vscode.Position(reference.start.line, 0))))
			// Exclude original from implementations
			.filter(location =>
				!(location.uri.toString() === codeLens.document.toString() &&
					location.range.start.line === codeLens.range.start.line &&
					location.range.start.character === codeLens.range.start.character));

		codeLens.command = this.getCommand(locations, codeLens);
		return codeLens;
	}

	private getCommand(locations: vscode.Location[], codeLens: ReferencesCodeLens): vscode.Command | undefined {
		return {
			title: this.getTitle(locations),
			command: locations.length ? 'editor.action.showReferences' : '',
			arguments: [codeLens.document, codeLens.range.start, locations]
		};
	}

	private getTitle(locations: vscode.Location[]): string {
		return locations.length === 1
			? vscode.l10n.t("1 implementation")
			: vscode.l10n.t("{0} implementations", locations.length);
	}

	protected extractSymbol(
		document: vscode.TextDocument,
		item: Proto.NavigationTree,
		parent: Proto.NavigationTree | undefined
	): vscode.Range | undefined {
		const cfg = vscode.workspace.getConfiguration(this.language.id);

		// Always show on interfaces
		if (item.kind === PConst.Kind.interface) {
			return getSymbolRange(document, item);
		}

		// Always show on abstract classes/properties
		if (
			(item.kind === PConst.Kind.class ||
				item.kind === PConst.Kind.method ||
				item.kind === PConst.Kind.memberVariable ||
				item.kind === PConst.Kind.memberGetAccessor ||
				item.kind === PConst.Kind.memberSetAccessor) &&
			/\babstract\b/.test(item.kindModifiers ?? '')
		) {
			return getSymbolRange(document, item);
		}

		// If configured, show on interface methods
		if (
			item.kind === PConst.Kind.method &&
			parent?.kind === PConst.Kind.interface &&
			cfg.get<boolean>('implementationsCodeLens.showOnInterfaceMethods', false)
		) {
			return getSymbolRange(document, item);
		}


		// If configured, show on all class methods
		if (
			item.kind === PConst.Kind.method &&
			parent?.kind === PConst.Kind.class &&
			cfg.get<boolean>('implementationsCodeLens.showOnAllClassMethods', false)
		) {
			// But not private ones as these can never be overridden
			if (/\bprivate\b/.test(item.kindModifiers ?? '')) {
				return undefined;
			}
			return getSymbolRange(document, item);
		}

		return undefined;
	}
}

export function register(
	selector: DocumentSelector,
	language: LanguageDescription,
	client: ITypeScriptServiceClient,
	cachedResponse: CachedResponse<Proto.NavTreeResponse>,
) {
	return conditionalRegistration([
		requireGlobalConfiguration(language.id, 'implementationsCodeLens.enabled'),
		requireSomeCapability(client, ClientCapability.Semantic),
	], () => {
		return vscode.languages.registerCodeLensProvider(selector.semantic,
			new TypeScriptImplementationsCodeLensProvider(client, cachedResponse, language));
	});
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/languageFeatures/codeLens/referencesCodeLens.ts]---
Location: vscode-main/extensions/typescript-language-features/src/languageFeatures/codeLens/referencesCodeLens.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { DocumentSelector } from '../../configuration/documentSelector';
import { LanguageDescription } from '../../configuration/languageDescription';
import { CachedResponse } from '../../tsServer/cachedResponse';
import type * as Proto from '../../tsServer/protocol/protocol';
import * as PConst from '../../tsServer/protocol/protocol.const';
import { ExecutionTarget } from '../../tsServer/server';
import * as typeConverters from '../../typeConverters';
import { ClientCapability, ITypeScriptServiceClient } from '../../typescriptService';
import { conditionalRegistration, requireGlobalConfiguration, requireSomeCapability } from '../util/dependentRegistration';
import { ReferencesCodeLens, TypeScriptBaseCodeLensProvider, getSymbolRange } from './baseCodeLensProvider';


export class TypeScriptReferencesCodeLensProvider extends TypeScriptBaseCodeLensProvider {
	public constructor(
		client: ITypeScriptServiceClient,
		protected _cachedResponse: CachedResponse<Proto.NavTreeResponse>,
		private readonly language: LanguageDescription
	) {
		super(client, _cachedResponse);
		this._register(
			vscode.workspace.onDidChangeConfiguration(evt => {
				if (evt.affectsConfiguration(`${language.id}.referencesCodeLens.showOnAllFunctions`)) {
					this.changeEmitter.fire();
				}
			})
		);
	}

	public async resolveCodeLens(codeLens: ReferencesCodeLens, token: vscode.CancellationToken): Promise<vscode.CodeLens> {
		const args = typeConverters.Position.toFileLocationRequestArgs(codeLens.file, codeLens.range.start);
		const response = await this.client.execute('references', args, token, {
			lowPriority: true,
			executionTarget: ExecutionTarget.Semantic,
			cancelOnResourceChange: codeLens.document,
		});
		if (response.type !== 'response' || !response.body) {
			codeLens.command = response.type === 'cancelled'
				? TypeScriptBaseCodeLensProvider.cancelledCommand
				: TypeScriptBaseCodeLensProvider.errorCommand;
			return codeLens;
		}

		const locations = response.body.refs
			.filter(reference => !reference.isDefinition)
			.map(reference =>
				typeConverters.Location.fromTextSpan(this.client.toResource(reference.file), reference));

		codeLens.command = {
			title: this.getCodeLensLabel(locations),
			command: locations.length ? 'editor.action.showReferences' : '',
			arguments: [codeLens.document, codeLens.range.start, locations]
		};
		return codeLens;
	}

	private getCodeLensLabel(locations: ReadonlyArray<vscode.Location>): string {
		return locations.length === 1
			? vscode.l10n.t("1 reference")
			: vscode.l10n.t("{0} references", locations.length);
	}

	protected extractSymbol(
		document: vscode.TextDocument,
		item: Proto.NavigationTree,
		parent: Proto.NavigationTree | undefined
	): vscode.Range | undefined {
		if (parent && parent.kind === PConst.Kind.enum) {
			return getSymbolRange(document, item);
		}

		switch (item.kind) {
			case PConst.Kind.function: {
				const showOnAllFunctions = vscode.workspace.getConfiguration(this.language.id).get<boolean>('referencesCodeLens.showOnAllFunctions');
				if (showOnAllFunctions && item.nameSpan) {
					return getSymbolRange(document, item);
				}
			}
			// fallthrough

			case PConst.Kind.const:
			case PConst.Kind.let:
			case PConst.Kind.variable:
				// Only show references for exported variables
				if (/\bexport\b/.test(item.kindModifiers)) {
					return getSymbolRange(document, item);
				}
				break;

			case PConst.Kind.class:
				if (item.text === '<class>') {
					break;
				}
				return getSymbolRange(document, item);

			case PConst.Kind.interface:
			case PConst.Kind.type:
			case PConst.Kind.enum:
				return getSymbolRange(document, item);

			case PConst.Kind.method:
			case PConst.Kind.memberGetAccessor:
			case PConst.Kind.memberSetAccessor:
			case PConst.Kind.constructorImplementation:
			case PConst.Kind.memberVariable:
				// Don't show if child and parent have same start
				// For https://github.com/microsoft/vscode/issues/90396
				if (parent &&
					typeConverters.Position.fromLocation(parent.spans[0].start).isEqual(typeConverters.Position.fromLocation(item.spans[0].start))
				) {
					return undefined;
				}

				// Only show if parent is a class type object (not a literal)
				switch (parent?.kind) {
					case PConst.Kind.class:
					case PConst.Kind.interface:
					case PConst.Kind.type:
						return getSymbolRange(document, item);
				}
				break;
		}

		return undefined;
	}
}

export function register(
	selector: DocumentSelector,
	language: LanguageDescription,
	client: ITypeScriptServiceClient,
	cachedResponse: CachedResponse<Proto.NavTreeResponse>,
) {
	return conditionalRegistration([
		requireGlobalConfiguration(language.id, 'referencesCodeLens.enabled'),
		requireSomeCapability(client, ClientCapability.Semantic),
	], () => {
		return vscode.languages.registerCodeLensProvider(selector.semantic,
			new TypeScriptReferencesCodeLensProvider(client, cachedResponse, language));
	});
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/languageFeatures/util/codeAction.ts]---
Location: vscode-main/extensions/typescript-language-features/src/languageFeatures/util/codeAction.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import type * as Proto from '../../tsServer/protocol/protocol';
import * as typeConverters from '../../typeConverters';
import { ITypeScriptServiceClient } from '../../typescriptService';

export function getEditForCodeAction(
	client: ITypeScriptServiceClient,
	action: Proto.CodeAction
): vscode.WorkspaceEdit | undefined {
	return action.changes?.length
		? typeConverters.WorkspaceEdit.fromFileCodeEdits(client, action.changes)
		: undefined;
}

export async function applyCodeAction(
	client: ITypeScriptServiceClient,
	action: Proto.CodeAction,
	token: vscode.CancellationToken
): Promise<boolean> {
	const workspaceEdit = getEditForCodeAction(client, action);
	if (workspaceEdit) {
		if (!(await vscode.workspace.applyEdit(workspaceEdit))) {
			return false;
		}
	}
	return applyCodeActionCommands(client, action.commands, token);
}

export async function applyCodeActionCommands(
	client: ITypeScriptServiceClient,
	commands: ReadonlyArray<{}> | undefined,
	token: vscode.CancellationToken,
): Promise<boolean> {
	if (commands?.length) {
		for (const command of commands) {
			await client.execute('applyCodeActionCommand', { command }, token);
		}
	}
	return true;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/languageFeatures/util/copilot.ts]---
Location: vscode-main/extensions/typescript-language-features/src/languageFeatures/util/copilot.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { Command } from '../../commands/commandManager';
import { nulToken } from '../../utils/cancellation';
import type * as Proto from '../../tsServer/protocol/protocol';
import * as typeConverters from '../../typeConverters';
import { ITypeScriptServiceClient } from '../../typescriptService';
import { TelemetryReporter } from '../../logging/telemetry';

export class EditorChatFollowUp implements Command {
	public static readonly ID = '_typescript.quickFix.editorChatReplacement2';
	public readonly id = EditorChatFollowUp.ID;

	constructor(
		private readonly client: ITypeScriptServiceClient,
		private readonly telemetryReporter: TelemetryReporter,
	) { }

	async execute({ message, document, expand, action }: EditorChatFollowUp_Args) {
		if (action.type === 'quickfix') {
			/* __GDPR__
				"aiQuickfix.execute" : {
					"owner": "mjbvz",
					"action" : { "classification": "PublicNonPersonalData", "purpose": "FeatureInsight" },
					"${include}": [
						"${TypeScriptCommonProperties}"
					]
				}
			*/
			this.telemetryReporter.logTelemetry('aiQuickfix.execute', {
				action: action.quickfix.fixName,
			});
		} else {
			/* __GDPR__
				"aiRefactor.execute" : {
					"owner": "mjbvz",
					"action" : { "classification": "PublicNonPersonalData", "purpose": "FeatureInsight" },
					"${include}": [
						"${TypeScriptCommonProperties}"
					]
				}
			*/
			this.telemetryReporter.logTelemetry('aiRefactor.execute', {
				action: action.refactor.name,
			});
		}

		const initialRange =
			expand.kind === 'navtree-function'
				? await findScopeEndLineFromNavTree(
					this.client,
					document,
					expand.pos.line
				)
				: expand.kind === 'refactor-info'
					? await findEditScope(
						this.client,
						document,
						expand.refactor.edits.flatMap((e) => e.textChanges)
					)
					: expand.kind === 'code-action'
						? await findEditScope(
							this.client,
							document,
							expand.action.changes.flatMap((c) => c.textChanges)
						)
						: expand.range;
		const initialSelection = initialRange ? new vscode.Selection(initialRange.start, initialRange.end) : undefined;
		await vscode.commands.executeCommand('vscode.editorChat.start', {
			initialRange,
			initialSelection,
			message,
			autoSend: true,
		});
	}
}
export interface EditorChatFollowUp_Args {
	readonly message: string;
	readonly document: vscode.TextDocument;
	readonly expand: Expand;
	readonly action: {
		readonly type: 'refactor';
		readonly refactor: Proto.RefactorActionInfo;
	} | {
		readonly type: 'quickfix';
		readonly quickfix: Proto.CodeFixAction;
	};
}

export class CompositeCommand implements Command {
	public static readonly ID = '_typescript.compositeCommand';
	public readonly id = CompositeCommand.ID;

	public async execute(...commands: vscode.Command[]): Promise<void> {
		for (const command of commands) {
			await vscode.commands.executeCommand(
				command.command,
				...(command.arguments ?? [])
			);
		}
	}
}

export type Expand =
	| { kind: 'none'; readonly range: vscode.Range }
	| { kind: 'navtree-function'; readonly pos: vscode.Position }
	| { kind: 'refactor-info'; readonly refactor: Proto.RefactorEditInfo }
	| { kind: 'code-action'; readonly action: Proto.CodeAction };

function findScopeEndLineFromNavTreeWorker(
	startLine: number,
	navigationTree: Proto.NavigationTree[]
): vscode.Range | undefined {
	for (const node of navigationTree) {
		const range = typeConverters.Range.fromTextSpan(node.spans[0]);
		if (startLine === range.start.line) {
			return range;
		} else if (
			startLine > range.start.line &&
			startLine <= range.end.line &&
			node.childItems
		) {
			return findScopeEndLineFromNavTreeWorker(startLine, node.childItems);
		}
	}
	return undefined;
}

async function findScopeEndLineFromNavTree(
	client: ITypeScriptServiceClient,
	document: vscode.TextDocument,
	startLine: number
) {
	const filepath = client.toOpenTsFilePath(document);
	if (!filepath) {
		return;
	}
	const response = await client.execute(
		'navtree',
		{ file: filepath },
		nulToken
	);
	if (response.type !== 'response' || !response.body?.childItems) {
		return;
	}
	return findScopeEndLineFromNavTreeWorker(startLine, response.body.childItems);
}

async function findEditScope(
	client: ITypeScriptServiceClient,
	document: vscode.TextDocument,
	edits: Proto.CodeEdit[]
): Promise<vscode.Range> {
	let first = typeConverters.Position.fromLocation(edits[0].start);
	let firstEdit = edits[0];
	let lastEdit = edits[0];
	let last = typeConverters.Position.fromLocation(edits[0].start);
	for (const edit of edits) {
		const start = typeConverters.Position.fromLocation(edit.start);
		const end = typeConverters.Position.fromLocation(edit.end);
		if (start.compareTo(first) < 0) {
			first = start;
			firstEdit = edit;
		}
		if (end.compareTo(last) > 0) {
			last = end;
			lastEdit = edit;
		}
	}
	const text = document.getText();
	const startIndex = text.indexOf(firstEdit.newText);
	const start = startIndex > -1 ? document.positionAt(startIndex) : first;
	const endIndex = text.lastIndexOf(lastEdit.newText);
	const end =
		endIndex > -1
			? document.positionAt(endIndex + lastEdit.newText.length)
			: last;
	const expandEnd = await findScopeEndLineFromNavTree(
		client,
		document,
		end.line
	);
	return new vscode.Range(start, expandEnd?.end ?? end);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/languageFeatures/util/dependentRegistration.ts]---
Location: vscode-main/extensions/typescript-language-features/src/languageFeatures/util/dependentRegistration.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { API } from '../../tsServer/api';
import { ClientCapability, ITypeScriptServiceClient } from '../../typescriptService';
import { Disposable } from '../../utils/dispose';

export class Condition extends Disposable {
	private _value: boolean;

	constructor(
		private readonly getValue: () => boolean,
		onUpdate: (handler: () => void) => void,
	) {
		super();
		this._value = this.getValue();

		onUpdate(() => {
			const newValue = this.getValue();
			if (newValue !== this._value) {
				this._value = newValue;
				this._onDidChange.fire();
			}
		});
	}

	public get value(): boolean { return this._value; }

	private readonly _onDidChange = this._register(new vscode.EventEmitter<void>());
	public readonly onDidChange = this._onDidChange.event;
}

class ConditionalRegistration {
	private state?: {
		readonly enabled: boolean;
		readonly registration: vscode.Disposable | undefined;
	};

	public constructor(
		private readonly conditions: readonly Condition[],
		private readonly doRegister: () => vscode.Disposable,
		private readonly elseDoRegister?: () => vscode.Disposable
	) {
		for (const condition of conditions) {
			condition.onDidChange(() => this.update());
		}
		this.update();
	}

	public dispose() {
		this.state?.registration?.dispose();
		this.state = undefined;
	}

	private update() {
		const enabled = this.conditions.every(condition => condition.value);
		if (enabled) {
			if (!this.state?.enabled) {
				this.state?.registration?.dispose();
				this.state = { enabled: true, registration: this.doRegister() };
			}
		} else {
			if (this.state?.enabled || !this.state) {
				this.state?.registration?.dispose();
				this.state = { enabled: false, registration: this.elseDoRegister?.() };
			}
		}
	}
}

export function conditionalRegistration(
	conditions: readonly Condition[],
	doRegister: () => vscode.Disposable,
	elseDoRegister?: () => vscode.Disposable
): vscode.Disposable {
	return new ConditionalRegistration(conditions, doRegister, elseDoRegister);
}

export function requireMinVersion(
	client: ITypeScriptServiceClient,
	minVersion: API,
) {
	return new Condition(
		() => client.apiVersion.gte(minVersion),
		client.onTsServerStarted
	);
}

export function requireGlobalConfiguration(
	section: string,
	configValue: string,
) {
	return new Condition(
		() => {
			const config = vscode.workspace.getConfiguration(section, null);
			return !!config.get<boolean>(configValue);
		},
		vscode.workspace.onDidChangeConfiguration
	);
}

export function requireSomeCapability(
	client: ITypeScriptServiceClient,
	...capabilities: readonly ClientCapability[]
) {
	return new Condition(
		() => capabilities.some(requiredCapability => client.capabilities.has(requiredCapability)),
		client.onDidChangeCapabilities
	);
}

export function requireHasVsCodeExtension(
	extensionId: string
) {
	return new Condition(
		() => {
			return !!vscode.extensions.getExtension(extensionId);
		},
		vscode.extensions.onDidChange
	);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/languageFeatures/util/snippetForFunctionCall.ts]---
Location: vscode-main/extensions/typescript-language-features/src/languageFeatures/util/snippetForFunctionCall.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import type * as Proto from '../../tsServer/protocol/protocol';
import * as PConst from '../../tsServer/protocol/protocol.const';

export function snippetForFunctionCall(
	item: { insertText?: string | vscode.SnippetString; label: string },
	displayParts: ReadonlyArray<Proto.SymbolDisplayPart>
): { snippet: vscode.SnippetString; parameterCount: number } {
	if (item.insertText && typeof item.insertText !== 'string') {
		return { snippet: item.insertText, parameterCount: 0 };
	}

	const parameterListParts = getParameterListParts(displayParts);
	const snippet = new vscode.SnippetString();
	snippet.appendText(`${item.insertText || item.label}(`);
	appendJoinedPlaceholders(snippet, parameterListParts.parts, ', ');
	if (parameterListParts.hasOptionalParameters) {
		snippet.appendTabstop();
	}
	snippet.appendText(')');
	snippet.appendTabstop(0);
	return { snippet, parameterCount: parameterListParts.parts.length + (parameterListParts.hasOptionalParameters ? 1 : 0) };
}

function appendJoinedPlaceholders(
	snippet: vscode.SnippetString,
	parts: ReadonlyArray<Proto.SymbolDisplayPart>,
	joiner: string
) {
	for (let i = 0; i < parts.length; ++i) {
		const paramterPart = parts[i];
		snippet.appendPlaceholder(paramterPart.text);
		if (i !== parts.length - 1) {
			snippet.appendText(joiner);
		}
	}
}

interface ParamterListParts {
	readonly parts: ReadonlyArray<Proto.SymbolDisplayPart>;
	readonly hasOptionalParameters: boolean;
}

function getParameterListParts(
	displayParts: ReadonlyArray<Proto.SymbolDisplayPart>
): ParamterListParts {
	const parts: Proto.SymbolDisplayPart[] = [];
	let optionalParams: Proto.SymbolDisplayPart[] = [];
	let isInMethod = false;
	let hasOptionalParameters = false;
	let parenCount = 0;
	let braceCount = 0;

	outer: for (let i = 0; i < displayParts.length; ++i) {
		const part = displayParts[i];
		switch (part.kind) {
			case PConst.DisplayPartKind.methodName:
			case PConst.DisplayPartKind.functionName:
			case PConst.DisplayPartKind.text:
			case PConst.DisplayPartKind.propertyName:
				if (parenCount === 0 && braceCount === 0) {
					isInMethod = true;
				}
				break;

			case PConst.DisplayPartKind.parameterName:
				if (parenCount === 1 && braceCount === 0 && isInMethod) {
					// Only take top level paren names
					const next = displayParts[i + 1];
					// Skip optional parameters
					const nameIsFollowedByOptionalIndicator = next && next.text === '?';
					// Skip this parameter
					const nameIsThis = part.text === 'this';

					/* Add optional param to temp array. Once a non-optional param is encountered,
					this means that previous optional params were mid-list ones, thus they should
					be displayed */
					if (nameIsFollowedByOptionalIndicator) {
						optionalParams.push(part);
					} else {
						parts.push(...optionalParams);
						optionalParams = [];
					}

					if (!nameIsFollowedByOptionalIndicator && !nameIsThis) {
						parts.push(part);
					}
					hasOptionalParameters = hasOptionalParameters || nameIsFollowedByOptionalIndicator;
				}
				break;

			case PConst.DisplayPartKind.punctuation:
				if (part.text === '(') {
					++parenCount;
				} else if (part.text === ')') {
					--parenCount;
					if (parenCount <= 0 && isInMethod) {
						break outer;
					}
				} else if (part.text === '...' && parenCount === 1) {
					// Found rest parmeter. Do not fill in any further arguments
					hasOptionalParameters = true;
					break outer;
				} else if (part.text === '{') {
					++braceCount;
				} else if (part.text === '}') {
					--braceCount;
				}
				break;
		}
	}

	return { hasOptionalParameters, parts };
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/languageFeatures/util/textRendering.ts]---
Location: vscode-main/extensions/typescript-language-features/src/languageFeatures/util/textRendering.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { OpenJsDocLinkCommand, OpenJsDocLinkCommand_Args } from '../../commands/openJsDocLink';
import type * as Proto from '../../tsServer/protocol/protocol';
import * as typeConverters from '../../typeConverters';

export interface IFilePathToResourceConverter {
	/**
	 * Convert a typescript filepath to a VS Code resource.
	 */
	toResource(filepath: string): vscode.Uri;
}

function getTagBodyText(
	tag: Proto.JSDocTagInfo,
	filePathConverter: IFilePathToResourceConverter,
): string | undefined {
	if (!tag.text) {
		return undefined;
	}

	// Convert to markdown code block if it does not already contain one
	function makeCodeblock(text: string): string {
		if (/^\s*[~`]{3}/m.test(text)) {
			return text;
		}
		return '```tsx\n' + text + '\n```';
	}

	let text = convertLinkTags(tag.text, filePathConverter);
	switch (tag.name) {
		case 'example': {
			// Example text does not support `{@link}` as it is considered code.
			// TODO: should we support it if it appears outside of an explicit code block?
			text = asPlainText(tag.text);

			// check for caption tags, fix for #79704
			const captionTagMatches = text.match(/<caption>(.*?)<\/caption>\s*(\r\n|\n)/);
			if (captionTagMatches && captionTagMatches.index === 0) {
				return captionTagMatches[1] + '\n' + makeCodeblock(text.substr(captionTagMatches[0].length));
			} else {
				return makeCodeblock(text);
			}
		}
		case 'author': {
			// fix obsucated email address, #80898
			const emailMatch = text.match(/(.+)\s<([-.\w]+@[-.\w]+)>/);
			if (emailMatch === null) {
				return text;
			} else {
				return `${emailMatch[1]} ${emailMatch[2]}`;
			}
		}
		case 'default': {
			return makeCodeblock(text);
		}
		default: {
			return text;
		}
	}
}

function getTagDocumentation(
	tag: Proto.JSDocTagInfo,
	filePathConverter: IFilePathToResourceConverter,
): string | undefined {
	switch (tag.name) {
		case 'augments':
		case 'extends':
		case 'param':
		case 'template': {
			const body = getTagBody(tag, filePathConverter);
			if (body?.length === 3) {
				const param = body[1];
				const doc = body[2];
				const label = `*@${tag.name}* \`${param}\``;
				if (!doc) {
					return label;
				}
				return label + (doc.match(/\r\n|\n/g) ? '  \n' + doc : ` \u2014 ${doc}`);
			}
			break;
		}
		case 'return':
		case 'returns': {
			// For return(s), we require a non-empty body
			if (!tag.text?.length) {
				return undefined;
			}

			break;
		}
	}


	// Generic tag
	const label = `*@${tag.name}*`;
	const text = getTagBodyText(tag, filePathConverter);
	if (!text) {
		return label;
	}
	return label + (text.match(/\r\n|\n/g) ? '  \n' + text : ` \u2014 ${text}`);
}

function getTagBody(tag: Proto.JSDocTagInfo, filePathConverter: IFilePathToResourceConverter): Array<string> | undefined {
	if (tag.name === 'template') {
		const parts = tag.text;
		if (parts && typeof (parts) !== 'string') {
			const params = parts.filter(p => p.kind === 'typeParameterName').map(p => p.text).join(', ');
			const docs = parts.filter(p => p.kind === 'text').map(p => convertLinkTags(p.text.replace(/^\s*-?\s*/, ''), filePathConverter)).join(' ');
			return params ? ['', params, docs] : undefined;
		}
	}
	return (convertLinkTags(tag.text, filePathConverter)).split(/^(\S+)\s*-?\s*/);
}

function asPlainText(parts: readonly Proto.SymbolDisplayPart[] | string): string {
	if (typeof parts === 'string') {
		return parts;
	}
	return parts.map(part => part.text).join('');
}

export function asPlainTextWithLinks(
	parts: readonly Proto.SymbolDisplayPart[] | string,
	filePathConverter: IFilePathToResourceConverter,
): string {
	return convertLinkTags(parts, filePathConverter);
}

/**
 * Convert `@link` inline tags to markdown links
 */
function convertLinkTags(
	parts: readonly Proto.SymbolDisplayPart[] | string | undefined,
	filePathConverter: IFilePathToResourceConverter,
): string {
	if (!parts) {
		return '';
	}

	if (typeof parts === 'string') {
		return parts;
	}

	const out: string[] = [];

	let currentLink: { name?: string; target?: Proto.FileSpan; text?: string; readonly linkcode: boolean } | undefined;
	for (const part of parts) {
		switch (part.kind) {
			case 'link':
				if (currentLink) {
					if (currentLink.target) {
						const file = filePathConverter.toResource(currentLink.target.file);
						const args: OpenJsDocLinkCommand_Args = {
							file: { ...file.toJSON(), $mid: undefined }, // Prevent VS Code from trying to transform the uri,
							position: typeConverters.Position.fromLocation(currentLink.target.start)
						};
						const command = `command:${OpenJsDocLinkCommand.id}?${encodeURIComponent(JSON.stringify([args]))}`;

						const linkText = currentLink.text ? currentLink.text : escapeMarkdownSyntaxTokensForCode(currentLink.name ?? '');
						out.push(`[${currentLink.linkcode ? '`' + linkText + '`' : linkText}](${command} "${vscode.l10n.t('Open symbol link')}")`);
					} else {
						const text = currentLink.text ?? currentLink.name;
						if (text) {
							if (/^https?:/.test(text)) {
								const parts = text.split(' ');
								if (parts.length === 1 && !currentLink.linkcode) {
									out.push(`<${parts[0]}>`);
								} else {
									const linkText = parts.length > 1 ? parts.slice(1).join(' ') : parts[0];
									out.push(`[${currentLink.linkcode ? '`' + escapeMarkdownSyntaxTokensForCode(linkText) + '`' : linkText}](${parts[0]})`);
								}
							} else {
								out.push(escapeMarkdownSyntaxTokensForCode(text));
							}
						}
					}
					currentLink = undefined;
				} else {
					currentLink = {
						linkcode: part.text === '{@linkcode '
					};
				}
				break;

			case 'linkName':
				if (currentLink) {
					currentLink.name = part.text;
					currentLink.target = (part as Proto.JSDocLinkDisplayPart).target;
				}
				break;

			case 'linkText':
				if (currentLink) {
					currentLink.text = part.text;
				}
				break;

			default:
				out.push(part.text);
				break;
		}
	}
	return out.join('');
}

function escapeMarkdownSyntaxTokensForCode(text: string): string {
	return text.replace(/`/g, '\\$&'); // CodeQL [SM02383] This is only meant to escape backticks. The Markdown is fully sanitized after being rendered.
}

export function tagsToMarkdown(
	tags: readonly Proto.JSDocTagInfo[],
	filePathConverter: IFilePathToResourceConverter,
): string {
	return tags.map(tag => getTagDocumentation(tag, filePathConverter)).join('  \n\n');
}

export function documentationToMarkdown(
	documentation: readonly Proto.SymbolDisplayPart[] | string,
	tags: readonly Proto.JSDocTagInfo[],
	filePathConverter: IFilePathToResourceConverter,
	baseUri: vscode.Uri | undefined,
): vscode.MarkdownString {
	const out = new vscode.MarkdownString();
	appendDocumentationAsMarkdown(out, documentation, tags, filePathConverter);
	out.baseUri = baseUri;
	out.isTrusted = { enabledCommands: [OpenJsDocLinkCommand.id] };
	return out;
}

export function appendDocumentationAsMarkdown(
	out: vscode.MarkdownString,
	documentation: readonly Proto.SymbolDisplayPart[] | string | undefined,
	tags: readonly Proto.JSDocTagInfo[] | undefined,
	converter: IFilePathToResourceConverter,
): vscode.MarkdownString {
	if (documentation) {
		out.appendMarkdown(asPlainTextWithLinks(documentation, converter));
	}

	if (tags) {
		const tagsPreview = tagsToMarkdown(tags, converter);
		if (tagsPreview) {
			out.appendMarkdown('\n\n' + tagsPreview);
		}
	}

	out.isTrusted = { enabledCommands: [OpenJsDocLinkCommand.id] };

	return out;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/logging/logger.ts]---
Location: vscode-main/extensions/typescript-language-features/src/logging/logger.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { Lazy } from '../utils/lazy';

export class Logger {

	private readonly output = new Lazy<vscode.LogOutputChannel>(() => {
		return vscode.window.createOutputChannel('TypeScript', { log: true });
	});

	public get logLevel(): vscode.LogLevel {
		return this.output.value.logLevel;
	}

	public info(message: string, ...args: unknown[]): void {
		this.output.value.info(message, ...args);
	}

	public trace(message: string, ...args: unknown[]): void {
		this.output.value.trace(message, ...args);
	}

	public error(message: string, data?: unknown): void {
		// See https://github.com/microsoft/TypeScript/issues/10496
		if (data && (data as { message?: string }).message === 'No content available.') {
			return;
		}
		this.output.value.error(message, ...(data ? [data] : []));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/logging/logLevelMonitor.ts]---
Location: vscode-main/extensions/typescript-language-features/src/logging/logLevelMonitor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { TsServerLogLevel } from '../configuration/configuration';
import { Disposable } from '../utils/dispose';


export class LogLevelMonitor extends Disposable {

	private static readonly logLevelConfigKey = 'typescript.tsserver.log';
	private static readonly logLevelChangedStorageKey = 'typescript.tsserver.logLevelChanged';
	private static readonly doNotPromptLogLevelStorageKey = 'typescript.tsserver.doNotPromptLogLevel';

	constructor(private readonly context: vscode.ExtensionContext) {
		super();

		this._register(vscode.workspace.onDidChangeConfiguration(this.onConfigurationChange, this, this._disposables));

		if (this.shouldNotifyExtendedLogging()) {
			this.notifyExtendedLogging();
		}
	}

	private onConfigurationChange(event: vscode.ConfigurationChangeEvent) {
		const logLevelChanged = event.affectsConfiguration(LogLevelMonitor.logLevelConfigKey);
		if (!logLevelChanged) {
			return;
		}
		this.context.globalState.update(LogLevelMonitor.logLevelChangedStorageKey, new Date());
	}

	private get logLevel(): TsServerLogLevel {
		return TsServerLogLevel.fromString(vscode.workspace.getConfiguration().get<string>(LogLevelMonitor.logLevelConfigKey, 'off'));
	}

	/**
	 * Last date change if it exists and can be parsed as a date,
	 * otherwise undefined.
	 */
	private get lastLogLevelChange(): Date | undefined {
		const lastChange = this.context.globalState.get<string | undefined>(LogLevelMonitor.logLevelChangedStorageKey);

		if (lastChange) {
			const date = new Date(lastChange);
			if (date instanceof Date && !isNaN(date.valueOf())) {
				return date;
			}
		}
		return undefined;
	}

	private get doNotPrompt(): boolean {
		return this.context.globalState.get<boolean | undefined>(LogLevelMonitor.doNotPromptLogLevelStorageKey) || false;
	}

	private shouldNotifyExtendedLogging(): boolean {
		const lastChangeMilliseconds = this.lastLogLevelChange ? new Date(this.lastLogLevelChange).valueOf() : 0;
		const lastChangePlusOneWeek = new Date(lastChangeMilliseconds + /* 7 days in milliseconds */ 86400000 * 7);

		if (!this.doNotPrompt && this.logLevel !== TsServerLogLevel.Off && lastChangePlusOneWeek.valueOf() < Date.now()) {
			return true;
		}
		return false;
	}

	private notifyExtendedLogging() {
		const enum Choice {
			DisableLogging = 0,
			DoNotShowAgain = 1
		}
		interface Item extends vscode.MessageItem {
			readonly choice: Choice;
		}

		vscode.window.showInformationMessage<Item>(
			vscode.l10n.t("TS Server logging is currently enabled which may impact performance."),
			{
				title: vscode.l10n.t("Disable logging"),
				choice: Choice.DisableLogging
			},
			{
				title: vscode.l10n.t("Don't show again"),
				choice: Choice.DoNotShowAgain
			})
			.then(selection => {
				if (!selection) {
					return;
				}
				if (selection.choice === Choice.DisableLogging) {
					return vscode.workspace.getConfiguration().update(LogLevelMonitor.logLevelConfigKey, 'off', true);
				} else if (selection.choice === Choice.DoNotShowAgain) {
					return this.context.globalState.update(LogLevelMonitor.doNotPromptLogLevelStorageKey, true);
				}
				return;
			});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/logging/telemetry.ts]---
Location: vscode-main/extensions/typescript-language-features/src/logging/telemetry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IExperimentationTelemetryReporter } from '../experimentTelemetryReporter';

export interface TelemetryProperties {
	readonly [prop: string]: string | number | boolean | undefined;
}

export interface TelemetryReporter {
	logTelemetry(eventName: string, properties?: TelemetryProperties): void;
	logTraceEvent(tracePoint: string, correlationId: string, command?: string): void;
}

export class VSCodeTelemetryReporter implements TelemetryReporter {
	constructor(
		private readonly reporter: IExperimentationTelemetryReporter | undefined,
		private readonly clientVersionDelegate: () => string
	) { }

	public logTelemetry(eventName: string, properties: { [prop: string]: string } = {}) {
		const reporter = this.reporter;
		if (!reporter) {
			return;
		}

		/* __GDPR__FRAGMENT__
			"TypeScriptCommonProperties" : {
				"version" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
			}
		*/
		properties['version'] = this.clientVersionDelegate();

		reporter.postEventObj(eventName, properties);
	}

	public logTraceEvent(point: string, traceId: string, data?: string): void {
		const event: { point: string; traceId: string; data?: string | undefined } = {
			point,
			traceId
		};
		if (data) {
			event.data = data;
		}

		/* __GDPR__
			"typeScriptExtension.trace" : {
				"owner": "dirkb",
				"${include}": [
					"${TypeScriptCommonProperties}"
				],
				"point" : { "classification": "SystemMetaData", "purpose": "FeatureInsight", "comment": "The trace point." },
				"traceId" : { "classification": "SystemMetaData", "purpose": "FeatureInsight", "comment": "The traceId is used to correlate the request with other trace points." },
				"data": { "classification": "SystemMetaData", "purpose": "FeatureInsight", "comment": "Additional data" }
			}
		*/
		this.logTelemetry('typeScriptExtension.trace', event);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/logging/tracer.ts]---
Location: vscode-main/extensions/typescript-language-features/src/logging/tracer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import type * as Proto from '../tsServer/protocol/protocol';
import { Disposable } from '../utils/dispose';
import { Logger } from './logger';

interface RequestExecutionMetadata {
	readonly queuingStartTime: number;
}

export default class Tracer extends Disposable {

	constructor(
		private readonly logger: Logger
	) {
		super();
	}

	public traceRequest(serverId: string, request: Proto.Request, responseExpected: boolean, queueLength: number): void {
		if (this.logger.logLevel === vscode.LogLevel.Trace) {
			this.trace(serverId, `Sending request: ${request.command} (${request.seq}). Response expected: ${responseExpected ? 'yes' : 'no'}. Current queue length: ${queueLength}`, request.arguments);
		}
	}

	public traceResponse(serverId: string, response: Proto.Response, meta: RequestExecutionMetadata): void {
		if (this.logger.logLevel === vscode.LogLevel.Trace) {
			this.trace(serverId, `Response received: ${response.command} (${response.request_seq}). Request took ${Date.now() - meta.queuingStartTime} ms. Success: ${response.success} ${!response.success ? '. Message: ' + response.message : ''}`, response.body);
		}
	}

	public traceRequestCompleted(serverId: string, command: string, request_seq: number, meta: RequestExecutionMetadata): void {
		if (this.logger.logLevel === vscode.LogLevel.Trace) {
			this.trace(serverId, `Async response received: ${command} (${request_seq}). Request took ${Date.now() - meta.queuingStartTime} ms.`);
		}
	}

	public traceEvent(serverId: string, event: Proto.Event): void {
		if (this.logger.logLevel === vscode.LogLevel.Trace) {
			this.trace(serverId, `Event received: ${event.event} (${event.seq}).`, event.body);
		}
	}

	public trace(serverId: string, message: string, data?: unknown): void {
		this.logger.trace(`<${serverId}> ${message}`, ...(data ? [JSON.stringify(data, null, 4)] : []));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/task/taskProvider.ts]---
Location: vscode-main/extensions/typescript-language-features/src/task/taskProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as jsonc from 'jsonc-parser';
import * as path from 'path';
import * as vscode from 'vscode';
import { wait } from '../test/testUtils';
import { ITypeScriptServiceClient, ServerResponse } from '../typescriptService';
import { coalesce } from '../utils/arrays';
import { Disposable } from '../utils/dispose';
import { exists } from '../utils/fs';
import { isTsConfigFileName } from '../configuration/languageDescription';
import { Lazy } from '../utils/lazy';
import { isImplicitProjectConfigFile } from '../tsconfig';
import { TSConfig, TsConfigProvider } from './tsconfigProvider';


enum AutoDetect {
	on = 'on',
	off = 'off',
	build = 'build',
	watch = 'watch'
}


interface TypeScriptTaskDefinition extends vscode.TaskDefinition {
	tsconfig: string;
	option?: string;
}

/**
 * Provides tasks for building `tsconfig.json` files in a project.
 */
class TscTaskProvider extends Disposable implements vscode.TaskProvider {

	private readonly projectInfoRequestTimeout = 2000;
	private readonly findConfigFilesTimeout = 5000;

	private autoDetect = AutoDetect.on;
	private readonly tsconfigProvider: TsConfigProvider;

	public constructor(
		private readonly client: Lazy<ITypeScriptServiceClient>
	) {
		super();
		this.tsconfigProvider = new TsConfigProvider();

		this._register(vscode.workspace.onDidChangeConfiguration(this.onConfigurationChanged, this));
		this.onConfigurationChanged();
	}

	public async provideTasks(token: vscode.CancellationToken): Promise<vscode.Task[]> {
		const folders = vscode.workspace.workspaceFolders;
		if ((this.autoDetect === AutoDetect.off) || !folders?.length) {
			return [];
		}

		const configPaths = new Set<string>();
		const tasks: vscode.Task[] = [];
		for (const project of await this.getAllTsConfigs(token)) {
			if (!configPaths.has(project.fsPath)) {
				configPaths.add(project.fsPath);
				tasks.push(...(await this.getTasksForProject(project)));
			}
		}
		return tasks;
	}

	public async resolveTask(task: vscode.Task): Promise<vscode.Task | undefined> {
		const definition = <TypeScriptTaskDefinition>task.definition;
		if (/\\tsconfig.*\.json/.test(definition.tsconfig)) {
			// Warn that the task has the wrong slash type
			vscode.window.showWarningMessage(vscode.l10n.t("TypeScript Task in tasks.json contains \"\\\\\". TypeScript tasks tsconfig must use \"/\""));
			return undefined;
		}

		const tsconfigPath = definition.tsconfig;
		if (!tsconfigPath) {
			return undefined;
		}

		if (task.scope === undefined || task.scope === vscode.TaskScope.Global || task.scope === vscode.TaskScope.Workspace) {
			// scope is required to be a WorkspaceFolder for resolveTask
			return undefined;
		}
		const tsconfigUri = task.scope.uri.with({ path: task.scope.uri.path + '/' + tsconfigPath });
		const tsconfig: TSConfig = {
			uri: tsconfigUri,
			fsPath: tsconfigUri.fsPath,
			posixPath: tsconfigUri.path,
			workspaceFolder: task.scope
		};
		return this.getTasksForProjectAndDefinition(tsconfig, definition);
	}

	private async getAllTsConfigs(token: vscode.CancellationToken): Promise<TSConfig[]> {
		const configs = (await Promise.all([
			this.getTsConfigForActiveFile(token),
			this.getTsConfigsInWorkspace(token),
		])).flat();

		return Promise.all(
			configs.map(async config => await exists(config.uri) ? config : undefined),
		).then(coalesce);
	}

	private async getTsConfigForActiveFile(token: vscode.CancellationToken): Promise<TSConfig[]> {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			if (isTsConfigFileName(editor.document.fileName)) {
				const uri = editor.document.uri;
				return [{
					uri,
					fsPath: uri.fsPath,
					posixPath: uri.path,
					workspaceFolder: vscode.workspace.getWorkspaceFolder(uri)
				}];
			}
		}

		const file = this.getActiveTypeScriptFile();
		if (!file) {
			return [];
		}

		const response = await Promise.race([
			this.client.value.execute(
				'projectInfo',
				{ file, needFileNameList: false },
				token),
			new Promise<typeof ServerResponse.NoContent>(resolve => setTimeout(() => resolve(ServerResponse.NoContent), this.projectInfoRequestTimeout))
		]);
		if (response.type !== 'response' || !response.body) {
			return [];
		}

		const { configFileName } = response.body;
		if (configFileName && !isImplicitProjectConfigFile(configFileName)) {
			const normalizedConfigPath = path.normalize(configFileName);
			const uri = vscode.Uri.file(normalizedConfigPath);
			const folder = vscode.workspace.getWorkspaceFolder(uri);
			return [{
				uri,
				fsPath: normalizedConfigPath,
				posixPath: uri.path,
				workspaceFolder: folder
			}];
		}

		return [];
	}

	private async getTsConfigsInWorkspace(token: vscode.CancellationToken): Promise<TSConfig[]> {
		const getConfigsTimeout = new vscode.CancellationTokenSource();
		token.onCancellationRequested(() => getConfigsTimeout.cancel());

		return Promise.race([
			this.tsconfigProvider.getConfigsForWorkspace(getConfigsTimeout.token).then(x => Array.from(x)),
			wait(this.findConfigFilesTimeout).then(() => {
				getConfigsTimeout.cancel();
				return [];
			}),
		]);
	}

	private static async getCommand(project: TSConfig): Promise<string> {
		if (project.workspaceFolder) {
			const localTsc = await TscTaskProvider.getLocalTscAtPath(path.dirname(project.fsPath));
			if (localTsc) {
				return localTsc;
			}

			const workspaceTsc = await TscTaskProvider.getLocalTscAtPath(project.workspaceFolder.uri.fsPath);
			if (workspaceTsc) {
				return workspaceTsc;
			}
		}

		// Use global tsc version
		return 'tsc';
	}

	private static async getLocalTscAtPath(folderPath: string): Promise<string | undefined> {
		const platform = process.platform;
		const bin = path.join(folderPath, 'node_modules', '.bin');
		if (platform === 'win32' && await exists(vscode.Uri.file(path.join(bin, 'tsc.cmd')))) {
			return path.join(bin, 'tsc.cmd');
		} else if ((platform === 'linux' || platform === 'darwin') && await exists(vscode.Uri.file(path.join(bin, 'tsc')))) {
			return path.join(bin, 'tsc');
		}
		return undefined;
	}

	private getActiveTypeScriptFile(): string | undefined {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const document = editor.document;
			if (document && (document.languageId === 'typescript' || document.languageId === 'typescriptreact')) {
				return this.client.value.toTsFilePath(document.uri);
			}
		}
		return undefined;
	}

	private getBuildTask(workspaceFolder: vscode.WorkspaceFolder | undefined, label: string, command: string, args: string[], buildTaskidentifier: TypeScriptTaskDefinition): vscode.Task {
		const buildTask = new vscode.Task(
			buildTaskidentifier,
			workspaceFolder || vscode.TaskScope.Workspace,
			vscode.l10n.t("build - {0}", label),
			'tsc',
			new vscode.ShellExecution(command, args),
			'$tsc');
		buildTask.group = vscode.TaskGroup.Build;
		buildTask.isBackground = false;
		return buildTask;
	}

	private getWatchTask(workspaceFolder: vscode.WorkspaceFolder | undefined, label: string, command: string, args: string[], watchTaskidentifier: TypeScriptTaskDefinition) {
		const watchTask = new vscode.Task(
			watchTaskidentifier,
			workspaceFolder || vscode.TaskScope.Workspace,
			vscode.l10n.t("watch - {0}", label),
			'tsc',
			new vscode.ShellExecution(command, [...args, '--watch']),
			'$tsc-watch');
		watchTask.group = vscode.TaskGroup.Build;
		watchTask.isBackground = true;
		return watchTask;
	}

	private async getTasksForProject(project: TSConfig): Promise<vscode.Task[]> {
		const command = await TscTaskProvider.getCommand(project);
		const args = await this.getBuildShellArgs(project);
		const label = this.getLabelForTasks(project);

		const tasks: vscode.Task[] = [];

		if (this.autoDetect === AutoDetect.build || this.autoDetect === AutoDetect.on) {
			tasks.push(this.getBuildTask(project.workspaceFolder, label, command, args, { type: 'typescript', tsconfig: label }));
		}

		if (this.autoDetect === AutoDetect.watch || this.autoDetect === AutoDetect.on) {
			tasks.push(this.getWatchTask(project.workspaceFolder, label, command, args, { type: 'typescript', tsconfig: label, option: 'watch' }));
		}

		return tasks;
	}

	private async getTasksForProjectAndDefinition(project: TSConfig, definition: TypeScriptTaskDefinition): Promise<vscode.Task | undefined> {
		const command = await TscTaskProvider.getCommand(project);
		const args = await this.getBuildShellArgs(project);
		const label = this.getLabelForTasks(project);

		let task: vscode.Task | undefined;

		if (definition.option === undefined) {
			task = this.getBuildTask(project.workspaceFolder, label, command, args, definition);
		} else if (definition.option === 'watch') {
			task = this.getWatchTask(project.workspaceFolder, label, command, args, definition);
		}

		return task;
	}

	private async getBuildShellArgs(project: TSConfig): Promise<Array<string>> {
		const defaultArgs = ['-p', project.fsPath];
		try {
			const bytes = await vscode.workspace.fs.readFile(project.uri);
			const text = Buffer.from(bytes).toString('utf-8');
			const tsconfig = jsonc.parse(text);
			if (tsconfig?.references) {
				return ['-b', project.fsPath];
			}
		} catch {
			// noops
		}
		return defaultArgs;
	}

	private getLabelForTasks(project: TSConfig): string {
		if (project.workspaceFolder) {
			const workspaceNormalizedUri = vscode.Uri.file(path.normalize(project.workspaceFolder.uri.fsPath)); // Make sure the drive letter is lowercase
			return path.posix.relative(workspaceNormalizedUri.path, project.posixPath);
		}

		return project.posixPath;
	}

	private onConfigurationChanged(): void {
		const type = vscode.workspace.getConfiguration('typescript.tsc').get<AutoDetect>('autoDetect');
		this.autoDetect = typeof type === 'undefined' ? AutoDetect.on : type;
	}
}

export function register(
	lazyClient: Lazy<ITypeScriptServiceClient>,
) {
	return vscode.tasks.registerTaskProvider('typescript', new TscTaskProvider(lazyClient));
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/task/tsconfigProvider.ts]---
Location: vscode-main/extensions/typescript-language-features/src/task/tsconfigProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';

export interface TSConfig {
	readonly uri: vscode.Uri;
	readonly fsPath: string;
	readonly posixPath: string;
	readonly workspaceFolder?: vscode.WorkspaceFolder;
}

export class TsConfigProvider {
	public async getConfigsForWorkspace(token: vscode.CancellationToken): Promise<Iterable<TSConfig>> {
		if (!vscode.workspace.workspaceFolders) {
			return [];
		}

		const configs = new Map<string, TSConfig>();
		for (const config of await this.findConfigFiles(token)) {
			const root = vscode.workspace.getWorkspaceFolder(config);
			if (root) {
				configs.set(config.fsPath, {
					uri: config,
					fsPath: config.fsPath,
					posixPath: config.path,
					workspaceFolder: root
				});
			}
		}
		return configs.values();
	}

	private async findConfigFiles(token: vscode.CancellationToken): Promise<vscode.Uri[]> {
		return await vscode.workspace.findFiles('**/tsconfig*.json', '**/{node_modules,.*}/**', undefined, token);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/test/index.ts]---
Location: vscode-main/extensions/typescript-language-features/src/test/index.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//
// PLEASE DO NOT MODIFY / DELETE UNLESS YOU KNOW WHAT YOU ARE DOING
//
// This file is providing the test runner to use when running extension tests.
// By default the test runner in use is Mocha based.
//
// You can provide your own test runner if you want to override it by exporting
// a function run(testRoot: string, clb: (error:Error) => void) that the extension
// host can call to run the tests. The test runner is expected to use console.log
// to report the results back to the caller. When the tests are finished, return
// a possible error to the callback or null if none.

const testRunner = require('../../../../test/integration/electron/testrunner');

// You can directly control Mocha options by uncommenting the following lines
// See https://github.com/mochajs/mocha/wiki/Using-mocha-programmatically#set-options for more info
testRunner.configure({
	ui: 'tdd', 		// the TDD UI is being used in extension.test.ts (suite, test, etc.)
	color: true,
	timeout: 60000,
});

export = testRunner;
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/test/suggestTestHelpers.ts]---
Location: vscode-main/extensions/typescript-language-features/src/test/suggestTestHelpers.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import 'mocha';
import * as vscode from 'vscode';
import { onChangedDocument, retryUntilDocumentChanges, wait } from './testUtils';

export async function acceptFirstSuggestion(uri: vscode.Uri, _disposables: vscode.Disposable[]) {
	return retryUntilDocumentChanges(uri, { retries: 10, timeout: 0 }, _disposables, async () => {
		await vscode.commands.executeCommand('editor.action.triggerSuggest');
		await wait(1000);
		await vscode.commands.executeCommand('acceptSelectedSuggestion');
	});
}

export async function typeCommitCharacter(uri: vscode.Uri, character: string, _disposables: vscode.Disposable[]) {
	const didChangeDocument = onChangedDocument(uri, _disposables);
	await vscode.commands.executeCommand('editor.action.triggerSuggest');
	await wait(3000); // Give time for suggestions to show
	await vscode.commands.executeCommand('type', { text: character });
	return await didChangeDocument;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/test/testUtils.ts]---
Location: vscode-main/extensions/typescript-language-features/src/test/testUtils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import * as fs from 'fs';
import * as os from 'os';
import { join } from 'path';
import * as vscode from 'vscode';

export function rndName() {
	let name = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 10; i++) {
		name += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return name;
}

export function createRandomFile(contents = '', fileExtension = 'txt'): Thenable<vscode.Uri> {
	return new Promise((resolve, reject) => {
		const tmpFile = join(os.tmpdir(), rndName() + '.' + fileExtension);
		fs.writeFile(tmpFile, contents, (error) => {
			if (error) {
				return reject(error);
			}

			resolve(vscode.Uri.file(tmpFile));
		});
	});
}


export function deleteFile(file: vscode.Uri): Thenable<boolean> {
	return new Promise((resolve, reject) => {
		fs.unlink(file.fsPath, (err) => {
			if (err) {
				reject(err);
			} else {
				resolve(true);
			}
		});
	});
}

export const CURSOR = '$$CURSOR$$';

export function withRandomFileEditor(
	contents: string,
	fileExtension: string,
	run: (editor: vscode.TextEditor, doc: vscode.TextDocument) => Thenable<void>
): Thenable<boolean> {
	const cursorIndex = contents.indexOf(CURSOR);
	return createRandomFile(contents.replace(CURSOR, ''), fileExtension).then(file => {
		return vscode.workspace.openTextDocument(file).then(doc => {
			return vscode.window.showTextDocument(doc).then((editor) => {
				if (cursorIndex >= 0) {
					const pos = doc.positionAt(cursorIndex);
					editor.selection = new vscode.Selection(pos, pos);
				}
				return run(editor, doc).then(_ => {
					if (doc.isDirty) {
						return doc.save().then(() => {
							return deleteFile(file);
						});
					} else {
						return deleteFile(file);
					}
				});
			});
		});
	});
}

export const wait = (ms: number) => new Promise<void>(resolve => setTimeout(() => resolve(), ms));

export const joinLines = (...args: string[]) => args.join(os.platform() === 'win32' ? '\r\n' : '\n');

export async function createTestEditor(uri: vscode.Uri, ...lines: string[]) {
	const document = await vscode.workspace.openTextDocument(uri);
	const editor = await vscode.window.showTextDocument(document);
	await editor.insertSnippet(new vscode.SnippetString(joinLines(...lines)), new vscode.Range(0, 0, 1000, 0));
	return editor;
}

export function assertEditorContents(editor: vscode.TextEditor, expectedDocContent: string, message?: string): void {
	const cursorIndex = expectedDocContent.indexOf(CURSOR);

	assert.strictEqual(
		editor.document.getText(),
		expectedDocContent.replace(CURSOR, ''),
		message);

	if (cursorIndex >= 0) {
		const expectedCursorPos = editor.document.positionAt(cursorIndex);
		assert.deepStrictEqual(
			{ line: editor.selection.active.line, character: editor.selection.active.line },
			{ line: expectedCursorPos.line, character: expectedCursorPos.line },
			'Cursor position'
		);
	}
}

export type VsCodeConfiguration = { [key: string]: any };

export async function updateConfig(documentUri: vscode.Uri, newConfig: VsCodeConfiguration): Promise<VsCodeConfiguration> {
	const oldConfig: VsCodeConfiguration = {};
	const config = vscode.workspace.getConfiguration(undefined, documentUri);

	for (const configKey of Object.keys(newConfig)) {
		oldConfig[configKey] = config.get(configKey);
		await new Promise<void>((resolve, reject) =>
			config.update(configKey, newConfig[configKey], vscode.ConfigurationTarget.Global)
				.then(() => resolve(), reject));
	}
	return oldConfig;
}

export const Config = Object.freeze({
	autoClosingBrackets: 'editor.autoClosingBrackets',
	typescriptCompleteFunctionCalls: 'typescript.suggest.completeFunctionCalls',
	insertMode: 'editor.suggest.insertMode',
	snippetSuggestions: 'editor.snippetSuggestions',
	suggestSelection: 'editor.suggestSelection',
	javascriptQuoteStyle: 'javascript.preferences.quoteStyle',
	typescriptQuoteStyle: 'typescript.preferences.quoteStyle',
} as const);

export const insertModesValues = Object.freeze(['insert', 'replace']);

export async function enumerateConfig(
	documentUri: vscode.Uri,
	configKey: string,
	values: readonly string[],
	f: (message: string) => Promise<void>
): Promise<void> {
	for (const value of values) {
		const newConfig = { [configKey]: value };
		await updateConfig(documentUri, newConfig);
		await f(JSON.stringify(newConfig));
	}
}


export function onChangedDocument(documentUri: vscode.Uri, disposables: vscode.Disposable[]) {
	return new Promise<vscode.TextDocument>(resolve => vscode.workspace.onDidChangeTextDocument(e => {
		if (e.document.uri.toString() === documentUri.toString()) {
			resolve(e.document);
		}
	}, undefined, disposables));
}

export async function retryUntilDocumentChanges(
	documentUri: vscode.Uri,
	options: { retries: number; timeout: number },
	disposables: vscode.Disposable[],
	exec: () => Thenable<unknown>,
) {
	const didChangeDocument = onChangedDocument(documentUri, disposables);

	let done = false;

	const result = await Promise.race([
		didChangeDocument,
		(async () => {
			for (let i = 0; i < options.retries; ++i) {
				await wait(options.timeout);
				if (done) {
					return;
				}
				await exec();
			}
		})(),
	]);
	done = true;
	return result;
}
```

--------------------------------------------------------------------------------

````
