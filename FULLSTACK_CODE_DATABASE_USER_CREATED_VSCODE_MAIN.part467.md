---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 467
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 467 of 552)

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

---[FILE: src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/tools/runInTerminalConfirmationTool.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/tools/runInTerminalConfirmationTool.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../../../base/common/cancellation.js';
import { Codicon } from '../../../../../../base/common/codicons.js';
import { URI } from '../../../../../../base/common/uri.js';
import { localize } from '../../../../../../nls.js';
import { CountTokensCallback, IPreparedToolInvocation, IToolData, IToolInvocation, IToolInvocationPreparationContext, IToolResult, ToolDataSource, ToolInvocationPresentation, ToolProgress } from '../../../../chat/common/languageModelToolsService.js';
import { RunInTerminalTool } from './runInTerminalTool.js';

export const ConfirmTerminalCommandToolData: IToolData = {
	id: 'vscode_get_terminal_confirmation',
	displayName: localize('confirmTerminalCommandTool.displayName', 'Confirm Terminal Command'),
	modelDescription: [
		'This tool allows you to get explicit user confirmation for a terminal command without executing it.',
		'',
		'When to use:',
		'- When you need to verify user approval before executing a command',
		'- When you want to show command details, auto-approval status, and simplified versions to the user',
		'- When you need the user to review a potentially risky command',
		'',
		'The tool will:',
		'- Show the command with syntax highlighting',
		'- Display auto-approval status if enabled',
		'- Show simplified version of the command if applicable',
		'- Provide custom actions for creating auto-approval rules',
		'- Return approval/rejection status',
		'',
		'After confirmation, use a tool to actually execute the command.'
	].join('\n'),
	userDescription: localize('confirmTerminalCommandTool.userDescription', 'Tool for confirming terminal commands'),
	source: ToolDataSource.Internal,
	icon: Codicon.shield,
	inputSchema: {
		type: 'object',
		properties: {
			command: {
				type: 'string',
				description: 'The command to confirm with the user.'
			},
			explanation: {
				type: 'string',
				description: 'A one-sentence description of what the command does. This will be shown to the user in the confirmation dialog.'
			},
			isBackground: {
				type: 'boolean',
				description: 'Whether the command would start a background process. This provides context for the confirmation.'
			},
		},
		required: [
			'command',
			'explanation',
			'isBackground',
		]
	}
};

export class ConfirmTerminalCommandTool extends RunInTerminalTool {
	override async prepareToolInvocation(context: IToolInvocationPreparationContext, token: CancellationToken): Promise<IPreparedToolInvocation | undefined> {
		// Safe-guard: If session is the chat provider specific id
		// then convert it to the session id understood by chat service
		try {
			const sessionUri = context.chatSessionId ? URI.parse(context.chatSessionId) : undefined;
			const sessionId = sessionUri ? this._chatService.getSession(sessionUri)?.sessionId : undefined;
			if (sessionId) {
				context.chatSessionId = sessionId;
			}
		}
		catch {
			// Ignore parse errors or session lookup failures; fallback to using the original chatSessionId.
		}
		const preparedInvocation = await super.prepareToolInvocation(context, token);
		if (preparedInvocation) {
			preparedInvocation.presentation = ToolInvocationPresentation.HiddenAfterComplete;
		}
		return preparedInvocation;
	}
	override async invoke(invocation: IToolInvocation, countTokens: CountTokensCallback, progress: ToolProgress, token: CancellationToken): Promise<IToolResult> {
		// This is a confirmation-only tool - just return success
		return {
			content: [{
				kind: 'text',
				value: 'yes'
			}]
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/tools/runInTerminalTool.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/tools/runInTerminalTool.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { IMarker as IXtermMarker } from '@xterm/xterm';
import { timeout } from '../../../../../../base/common/async.js';
import { CancellationToken, CancellationTokenSource } from '../../../../../../base/common/cancellation.js';
import { Codicon } from '../../../../../../base/common/codicons.js';
import { CancellationError } from '../../../../../../base/common/errors.js';
import { Event } from '../../../../../../base/common/event.js';
import { MarkdownString, type IMarkdownString } from '../../../../../../base/common/htmlContent.js';
import { Disposable, DisposableStore } from '../../../../../../base/common/lifecycle.js';
import { basename } from '../../../../../../base/common/path.js';
import { OperatingSystem, OS } from '../../../../../../base/common/platform.js';
import { count } from '../../../../../../base/common/strings.js';
import { generateUuid } from '../../../../../../base/common/uuid.js';
import { localize } from '../../../../../../nls.js';
import { IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';
import { IInstantiationService, type ServicesAccessor } from '../../../../../../platform/instantiation/common/instantiation.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../../../platform/storage/common/storage.js';
import { TerminalCapability } from '../../../../../../platform/terminal/common/capabilities/capabilities.js';
import { ITerminalLogService, ITerminalProfile } from '../../../../../../platform/terminal/common/terminal.js';
import { IRemoteAgentService } from '../../../../../services/remote/common/remoteAgentService.js';
import { TerminalToolConfirmationStorageKeys } from '../../../../chat/browser/chatContentParts/toolInvocationParts/chatTerminalToolConfirmationSubPart.js';
import { IChatService, type IChatTerminalToolInvocationData } from '../../../../chat/common/chatService.js';
import { CountTokensCallback, ILanguageModelToolsService, IPreparedToolInvocation, IToolData, IToolImpl, IToolInvocation, IToolInvocationPreparationContext, IToolResult, ToolDataSource, ToolInvocationPresentation, ToolProgress } from '../../../../chat/common/languageModelToolsService.js';
import { ITerminalChatService, ITerminalService, type ITerminalInstance } from '../../../../terminal/browser/terminal.js';
import type { XtermTerminal } from '../../../../terminal/browser/xterm/xtermTerminal.js';
import { ITerminalProfileResolverService } from '../../../../terminal/common/terminal.js';
import { TerminalChatAgentToolsSettingId } from '../../common/terminalChatAgentToolsConfiguration.js';
import { getRecommendedToolsOverRunInTerminal } from '../alternativeRecommendation.js';
import { BasicExecuteStrategy } from '../executeStrategy/basicExecuteStrategy.js';
import type { ITerminalExecuteStrategy } from '../executeStrategy/executeStrategy.js';
import { NoneExecuteStrategy } from '../executeStrategy/noneExecuteStrategy.js';
import { RichExecuteStrategy } from '../executeStrategy/richExecuteStrategy.js';
import { getOutput } from '../outputHelpers.js';
import { isFish, isPowerShell, isWindowsPowerShell, isZsh } from '../runInTerminalHelpers.js';
import { RunInTerminalToolTelemetry } from '../runInTerminalToolTelemetry.js';
import { ShellIntegrationQuality, ToolTerminalCreator, type IToolTerminal } from '../toolTerminalCreator.js';
import { TreeSitterCommandParser, TreeSitterCommandParserLanguage } from '../treeSitterCommandParser.js';
import { type ICommandLineAnalyzer, type ICommandLineAnalyzerOptions } from './commandLineAnalyzer/commandLineAnalyzer.js';
import { CommandLineAutoApproveAnalyzer } from './commandLineAnalyzer/commandLineAutoApproveAnalyzer.js';
import { CommandLineFileWriteAnalyzer } from './commandLineAnalyzer/commandLineFileWriteAnalyzer.js';
import { OutputMonitor } from './monitoring/outputMonitor.js';
import { IPollingResult, OutputMonitorState } from './monitoring/types.js';
import { LocalChatSessionUri } from '../../../../chat/common/chatUri.js';
import type { ICommandLineRewriter } from './commandLineRewriter/commandLineRewriter.js';
import { CommandLineCdPrefixRewriter } from './commandLineRewriter/commandLineCdPrefixRewriter.js';
import { CommandLinePwshChainOperatorRewriter } from './commandLineRewriter/commandLinePwshChainOperatorRewriter.js';
import { IWorkspaceContextService } from '../../../../../../platform/workspace/common/workspace.js';
import { IHistoryService } from '../../../../../services/history/common/history.js';
import { TerminalCommandArtifactCollector } from './terminalCommandArtifactCollector.js';
import { isNumber, isString } from '../../../../../../base/common/types.js';
import { ChatConfiguration } from '../../../../chat/common/constants.js';
import { IChatWidgetService } from '../../../../chat/browser/chat.js';

// #region Tool data

const TOOL_REFERENCE_NAME = 'runInTerminal';
const LEGACY_TOOL_REFERENCE_FULL_NAMES = ['runCommands/runInTerminal'];

function createPowerShellModelDescription(shell: string): string {
	const isWinPwsh = isWindowsPowerShell(shell);
	return [
		`This tool allows you to execute ${isWinPwsh ? 'Windows PowerShell 5.1' : 'PowerShell'} commands in a persistent terminal session, preserving environment variables, working directory, and other context across multiple commands.`,
		'',
		'Command Execution:',
		// IMPORTANT: PowerShell 5 does not support `&&` so always re-write them to `;`. Note that
		// the behavior of `&&` differs a little from `;` but in general it's fine
		isWinPwsh ? '- Use semicolons ; to chain commands on one line, NEVER use && even when asked explicitly' : '- Prefer ; when chaining commands on one line',
		'- Prefer pipelines | for object-based data flow',
		'- Never create a sub-shell (eg. powershell -c "command") unless explicitly asked',
		'',
		'Directory Management:',
		'- Must use absolute paths to avoid navigation issues',
		'- Use $PWD or Get-Location for current directory',
		'- Use Push-Location/Pop-Location for directory stack',
		'',
		'Program Execution:',
		'- Supports .NET, Python, Node.js, and other executables',
		'- Install modules via Install-Module, Install-Package',
		'- Use Get-Command to verify cmdlet/function availability',
		'',
		'Background Processes:',
		'- For long-running tasks (e.g., servers), set isBackground=true',
		'- Returns a terminal ID for checking status and runtime later',
		'- Use Start-Job for background PowerShell jobs',
		'',
		'Output Management:',
		'- Output is automatically truncated if longer than 60KB to prevent context overflow',
		'- Use Select-Object, Where-Object, Format-Table to filter output',
		'- Use -First/-Last parameters to limit results',
		'- For pager commands, add | Out-String or | Format-List',
		'',
		'Best Practices:',
		'- Use proper cmdlet names instead of aliases in scripts',
		'- Quote paths with spaces: "C:\\Path With Spaces"',
		'- Prefer PowerShell cmdlets over external commands when available',
		'- Prefer idiomatic PowerShell like Get-ChildItem instead of dir or ls for file listings',
		'- Use Test-Path to check file/directory existence',
		'- Be specific with Select-Object properties to avoid excessive output',
		'- Avoid printing credentials unless absolutely required',
	].join('\n');
}

const genericDescription = `
Command Execution:
- Use && to chain simple commands on one line
- Prefer pipelines | over temporary files for data flow
- Never create a sub-shell (eg. bash -c "command") unless explicitly asked

Directory Management:
- Must use absolute paths to avoid navigation issues
- Use $PWD for current directory references
- Consider using pushd/popd for directory stack management
- Supports directory shortcuts like ~ and -

Program Execution:
- Supports Python, Node.js, and other executables
- Install packages via package managers (brew, apt, etc.)
- Use which or command -v to verify command availability

Background Processes:
- For long-running tasks (e.g., servers), set isBackground=true
- Returns a terminal ID for checking status and runtime later

Output Management:
- Output is automatically truncated if longer than 60KB to prevent context overflow
- Use head, tail, grep, awk to filter and limit output size
- For pager commands, disable paging: git --no-pager or add | cat
- Use wc -l to count lines before displaying large outputs

Best Practices:
- Quote variables: "$var" instead of $var to handle spaces
- Use find with -exec or xargs for file operations
- Be specific with commands to avoid excessive output
- Avoid printing credentials unless absolutely required`;

function createBashModelDescription(): string {
	return [
		'This tool allows you to execute shell commands in a persistent bash terminal session, preserving environment variables, working directory, and other context across multiple commands.',
		genericDescription,
		'- Use [[ ]] for conditional tests instead of [ ]',
		'- Prefer $() over backticks for command substitution',
		'- Use set -e at start of complex commands to exit on errors'
	].join('\n');
}

function createZshModelDescription(): string {
	return [
		'This tool allows you to execute shell commands in a persistent zsh terminal session, preserving environment variables, working directory, and other context across multiple commands.',
		genericDescription,
		'- Use type to check command type (builtin, function, alias)',
		'- Use jobs, fg, bg for job control',
		'- Use [[ ]] for conditional tests instead of [ ]',
		'- Prefer $() over backticks for command substitution',
		'- Use setopt errexit for strict error handling',
		'- Take advantage of zsh globbing features (**, extended globs)'
	].join('\n');
}

function createFishModelDescription(): string {
	return [
		'This tool allows you to execute shell commands in a persistent fish terminal session, preserving environment variables, working directory, and other context across multiple commands.',
		genericDescription,
		'- Use type to check command type (builtin, function, alias)',
		'- Use jobs, fg, bg for job control',
		'- Use test expressions for conditionals (no [[ ]] syntax)',
		'- Prefer command substitution with () syntax',
		'- Variables are arrays by default, use $var[1] for first element',
		'- Use set -e for strict error handling',
		'- Take advantage of fish\'s autosuggestions and completions'
	].join('\n');
}

export async function createRunInTerminalToolData(
	accessor: ServicesAccessor
): Promise<IToolData> {
	const instantiationService = accessor.get(IInstantiationService);

	const profileFetcher = instantiationService.createInstance(TerminalProfileFetcher);
	const shell = await profileFetcher.getCopilotShell();
	const os = await profileFetcher.osBackend;

	let modelDescription: string;
	if (shell && os && isPowerShell(shell, os)) {
		modelDescription = createPowerShellModelDescription(shell);
	} else if (shell && os && isZsh(shell, os)) {
		modelDescription = createZshModelDescription();
	} else if (shell && os && isFish(shell, os)) {
		modelDescription = createFishModelDescription();
	} else {
		modelDescription = createBashModelDescription();
	}

	return {
		id: 'run_in_terminal',
		toolReferenceName: TOOL_REFERENCE_NAME,
		legacyToolReferenceFullNames: LEGACY_TOOL_REFERENCE_FULL_NAMES,
		displayName: localize('runInTerminalTool.displayName', 'Run in Terminal'),
		modelDescription,
		userDescription: localize('runInTerminalTool.userDescription', 'Run commands in the terminal'),
		source: ToolDataSource.Internal,
		icon: Codicon.terminal,
		inputSchema: {
			type: 'object',
			properties: {
				command: {
					type: 'string',
					description: 'The command to run in the terminal.'
				},
				explanation: {
					type: 'string',
					description: 'A one-sentence description of what the command does. This will be shown to the user before the command is run.'
				},
				isBackground: {
					type: 'boolean',
					description: 'Whether the command starts a background process. If true, the command will run in the background and you will not see the output. If false, the tool call will block on the command finishing, and then you will get the output. Examples of background processes: building in watch mode, starting a server. You can check the output of a background process later on by using get_terminal_output.'
				},
			},
			required: [
				'command',
				'explanation',
				'isBackground',
			]
		}
	};
}

// #endregion

// #region Tool implementation

const enum TerminalToolStorageKeysInternal {
	TerminalSession = 'chat.terminalSessions'
}

interface IStoredTerminalAssociation {
	sessionId: string;
	id: string;
	shellIntegrationQuality: ShellIntegrationQuality;
	isBackground?: boolean;
}

export interface IRunInTerminalInputParams {
	command: string;
	explanation: string;
	isBackground: boolean;
}

/**
 * A set of characters to ignore when reporting telemetry
 */
const telemetryIgnoredSequences = [
	'\x1b[I', // Focus in
	'\x1b[O', // Focus out
];

const altBufferMessage = localize('runInTerminalTool.altBufferMessage', "The command opened the alternate buffer.");


export class RunInTerminalTool extends Disposable implements IToolImpl {

	private readonly _terminalToolCreator: ToolTerminalCreator;
	private readonly _treeSitterCommandParser: TreeSitterCommandParser;
	private readonly _telemetry: RunInTerminalToolTelemetry;
	private readonly _commandArtifactCollector: TerminalCommandArtifactCollector;
	protected readonly _profileFetcher: TerminalProfileFetcher;

	private readonly _commandLineRewriters: ICommandLineRewriter[];
	private readonly _commandLineAnalyzers: ICommandLineAnalyzer[];

	protected readonly _sessionTerminalAssociations: Map<string, IToolTerminal> = new Map();

	// Immutable window state
	protected readonly _osBackend: Promise<OperatingSystem>;

	private static readonly _backgroundExecutions = new Map<string, BackgroundTerminalExecution>();
	public static getBackgroundOutput(id: string): string {
		const backgroundExecution = RunInTerminalTool._backgroundExecutions.get(id);
		if (!backgroundExecution) {
			throw new Error('Invalid terminal ID');
		}
		return backgroundExecution.getOutput();
	}

	constructor(
		@IChatService protected readonly _chatService: IChatService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IHistoryService private readonly _historyService: IHistoryService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@ILanguageModelToolsService private readonly _languageModelToolsService: ILanguageModelToolsService,
		@IRemoteAgentService private readonly _remoteAgentService: IRemoteAgentService,
		@IStorageService private readonly _storageService: IStorageService,
		@ITerminalChatService private readonly _terminalChatService: ITerminalChatService,
		@ITerminalLogService private readonly _logService: ITerminalLogService,
		@ITerminalService private readonly _terminalService: ITerminalService,
		@IWorkspaceContextService private readonly _workspaceContextService: IWorkspaceContextService,
		@IChatWidgetService private readonly _chatWidgetService: IChatWidgetService,
	) {
		super();

		this._osBackend = this._remoteAgentService.getEnvironment().then(remoteEnv => remoteEnv?.os ?? OS);

		this._terminalToolCreator = this._instantiationService.createInstance(ToolTerminalCreator);
		this._treeSitterCommandParser = this._register(this._instantiationService.createInstance(TreeSitterCommandParser));
		this._telemetry = this._instantiationService.createInstance(RunInTerminalToolTelemetry);
		this._commandArtifactCollector = this._instantiationService.createInstance(TerminalCommandArtifactCollector);
		this._profileFetcher = this._instantiationService.createInstance(TerminalProfileFetcher);

		this._commandLineRewriters = [
			this._register(this._instantiationService.createInstance(CommandLineCdPrefixRewriter)),
			this._register(this._instantiationService.createInstance(CommandLinePwshChainOperatorRewriter, this._treeSitterCommandParser)),
		];
		this._commandLineAnalyzers = [
			this._register(this._instantiationService.createInstance(CommandLineFileWriteAnalyzer, this._treeSitterCommandParser, (message, args) => this._logService.info(`RunInTerminalTool#CommandLineFileWriteAnalyzer: ${message}`, args))),
			this._register(this._instantiationService.createInstance(CommandLineAutoApproveAnalyzer, this._treeSitterCommandParser, this._telemetry, (message, args) => this._logService.info(`RunInTerminalTool#CommandLineAutoApproveAnalyzer: ${message}`, args))),
		];

		// Clear out warning accepted state if the setting is disabled
		this._register(Event.runAndSubscribe(this._configurationService.onDidChangeConfiguration, e => {
			if (!e || e.affectsConfiguration(TerminalChatAgentToolsSettingId.EnableAutoApprove)) {
				if (this._configurationService.getValue(TerminalChatAgentToolsSettingId.EnableAutoApprove) !== true) {
					this._storageService.remove(TerminalToolConfirmationStorageKeys.TerminalAutoApproveWarningAccepted, StorageScope.APPLICATION);
				}
			}
		}));

		// Restore terminal associations from storage
		this._restoreTerminalAssociations();
		this._register(this._terminalService.onDidDisposeInstance(e => {
			for (const [sessionId, toolTerminal] of this._sessionTerminalAssociations.entries()) {
				if (e === toolTerminal.instance) {
					this._sessionTerminalAssociations.delete(sessionId);
				}
			}
		}));

		// Listen for chat session disposal to clean up associated terminals
		this._register(this._chatService.onDidDisposeSession(e => {
			for (const resource of e.sessionResource) {
				const localSessionId = LocalChatSessionUri.parseLocalSessionId(resource);
				if (localSessionId) {
					this._cleanupSessionTerminals(localSessionId);
				}
			}
		}));
	}

	async prepareToolInvocation(context: IToolInvocationPreparationContext, token: CancellationToken): Promise<IPreparedToolInvocation | undefined> {
		const args = context.parameters as IRunInTerminalInputParams;

		const instance = context.chatSessionId ? this._sessionTerminalAssociations.get(context.chatSessionId)?.instance : undefined;
		const [os, shell, cwd] = await Promise.all([
			this._osBackend,
			this._profileFetcher.getCopilotShell(),
			(async () => {
				let cwd = await instance?.getCwdResource();
				if (!cwd) {
					const activeWorkspaceRootUri = this._historyService.getLastActiveWorkspaceRoot();
					const workspaceFolder = activeWorkspaceRootUri ? this._workspaceContextService.getWorkspaceFolder(activeWorkspaceRootUri) ?? undefined : undefined;
					cwd = workspaceFolder?.uri;
				}
				return cwd;
			})()
		]);
		const language = os === OperatingSystem.Windows ? 'pwsh' : 'sh';

		const terminalToolSessionId = generateUuid();
		// Generate a custom command ID to link the command between renderer and pty host
		const terminalCommandId = `tool-${generateUuid()}`;

		let rewrittenCommand: string | undefined = args.command;
		for (const rewriter of this._commandLineRewriters) {
			const rewriteResult = await rewriter.rewrite({
				commandLine: rewrittenCommand,
				cwd,
				shell,
				os
			});
			if (rewriteResult) {
				rewrittenCommand = rewriteResult.rewritten;
				this._logService.info(`RunInTerminalTool: Command rewritten by ${rewriter.constructor.name}: ${rewriteResult.reasoning}`);
			}
		}

		const toolSpecificData: IChatTerminalToolInvocationData = {
			kind: 'terminal',
			terminalToolSessionId,
			terminalCommandId,
			commandLine: {
				original: args.command,
				toolEdited: rewrittenCommand === args.command ? undefined : rewrittenCommand
			},
			language,
		};

		// HACK: Exit early if there's an alternative recommendation, this is a little hacky but
		// it's the current mechanism for re-routing terminal tool calls to something else.
		const alternativeRecommendation = getRecommendedToolsOverRunInTerminal(args.command, this._languageModelToolsService);
		if (alternativeRecommendation) {
			toolSpecificData.alternativeRecommendation = alternativeRecommendation;
			return {
				confirmationMessages: undefined,
				presentation: ToolInvocationPresentation.Hidden,
				toolSpecificData,
			};
		}

		// Determine auto approval, this happens even when auto approve is off to that reasoning
		// can be reviewed in the terminal channel. It also allows gauging the effective set of
		// commands that would be auto approved if it were enabled.
		const commandLine = rewrittenCommand ?? args.command;

		const isEligibleForAutoApproval = () => {
			const config = this._configurationService.getValue<Record<string, boolean>>(ChatConfiguration.EligibleForAutoApproval);
			if (config && typeof config === 'object') {
				if (Object.prototype.hasOwnProperty.call(config, TOOL_REFERENCE_NAME)) {
					return config[TOOL_REFERENCE_NAME];
				}
				for (const legacyName of LEGACY_TOOL_REFERENCE_FULL_NAMES) {
					if (Object.prototype.hasOwnProperty.call(config, legacyName)) {
						return config[legacyName];
					}
				}
			}
			// Default
			return true;
		};
		const isAutoApproveEnabled = this._configurationService.getValue(TerminalChatAgentToolsSettingId.EnableAutoApprove) === true;
		const isAutoApproveWarningAccepted = this._storageService.getBoolean(TerminalToolConfirmationStorageKeys.TerminalAutoApproveWarningAccepted, StorageScope.APPLICATION, false);
		const isAutoApproveAllowed = isEligibleForAutoApproval() && isAutoApproveEnabled && isAutoApproveWarningAccepted;

		const commandLineAnalyzerOptions: ICommandLineAnalyzerOptions = {
			commandLine,
			cwd,
			os,
			shell,
			treeSitterLanguage: isPowerShell(shell, os) ? TreeSitterCommandParserLanguage.PowerShell : TreeSitterCommandParserLanguage.Bash,
			terminalToolSessionId,
			chatSessionId: context.chatSessionId,
		};
		const commandLineAnalyzerResults = await Promise.all(this._commandLineAnalyzers.map(e => e.analyze(commandLineAnalyzerOptions)));

		const disclaimersRaw = commandLineAnalyzerResults.filter(e => e.disclaimers).flatMap(e => e.disclaimers);
		let disclaimer: IMarkdownString | undefined;
		if (disclaimersRaw.length > 0) {
			disclaimer = new MarkdownString(`$(${Codicon.info.id}) ` + disclaimersRaw.join(' '), { supportThemeIcons: true });
		}

		const analyzersIsAutoApproveAllowed = commandLineAnalyzerResults.every(e => e.isAutoApproveAllowed);
		const customActions = isEligibleForAutoApproval() && analyzersIsAutoApproveAllowed ? commandLineAnalyzerResults.map(e => e.customActions ?? []).flat() : undefined;

		let shellType = basename(shell, '.exe');
		if (shellType === 'powershell') {
			shellType = 'pwsh';
		}

		const isFinalAutoApproved = (
			// Is the setting enabled and the user has opted-in
			isAutoApproveAllowed &&
			// Does at least one analyzer auto approve
			commandLineAnalyzerResults.some(e => e.isAutoApproved) &&
			// No analyzer denies auto approval
			commandLineAnalyzerResults.every(e => e.isAutoApproved !== false) &&
			// All analyzers allow auto approval
			analyzersIsAutoApproveAllowed
		);

		if (isFinalAutoApproved) {
			toolSpecificData.autoApproveInfo = commandLineAnalyzerResults.find(e => e.autoApproveInfo)?.autoApproveInfo;
		}

		const confirmationMessages = isFinalAutoApproved ? undefined : {
			title: args.isBackground
				? localize('runInTerminal.background', "Run `{0}` command? (background terminal)", shellType)
				: localize('runInTerminal', "Run `{0}` command?", shellType),
			message: new MarkdownString(args.explanation),
			disclaimer,
			terminalCustomActions: customActions,
		};

		return {
			confirmationMessages,
			toolSpecificData,
		};
	}

	async invoke(invocation: IToolInvocation, _countTokens: CountTokensCallback, _progress: ToolProgress, token: CancellationToken): Promise<IToolResult> {
		const toolSpecificData = invocation.toolSpecificData as IChatTerminalToolInvocationData | undefined;
		if (!toolSpecificData) {
			throw new Error('toolSpecificData must be provided for this tool');
		}
		const commandId = toolSpecificData.terminalCommandId;
		if (toolSpecificData.alternativeRecommendation) {
			return {
				content: [{
					kind: 'text',
					value: toolSpecificData.alternativeRecommendation
				}]
			};
		}

		const args = invocation.parameters as IRunInTerminalInputParams;
		this._logService.debug(`RunInTerminalTool: Invoking with options ${JSON.stringify(args)}`);
		let toolResultMessage: string | undefined;

		const chatSessionId = invocation.context?.sessionId ?? 'no-chat-session';
		const command = toolSpecificData.commandLine.userEdited ?? toolSpecificData.commandLine.toolEdited ?? toolSpecificData.commandLine.original;
		const didUserEditCommand = (
			toolSpecificData.commandLine.userEdited !== undefined &&
			toolSpecificData.commandLine.userEdited !== toolSpecificData.commandLine.original
		);
		const didToolEditCommand = (
			!didUserEditCommand &&
			toolSpecificData.commandLine.toolEdited !== undefined &&
			toolSpecificData.commandLine.toolEdited !== toolSpecificData.commandLine.original
		);

		if (token.isCancellationRequested) {
			throw new CancellationError();
		}

		let error: string | undefined;
		const isNewSession = !args.isBackground && !this._sessionTerminalAssociations.has(chatSessionId);

		const timingStart = Date.now();
		const termId = generateUuid();
		const terminalToolSessionId = (toolSpecificData as IChatTerminalToolInvocationData).terminalToolSessionId;

		const store = new DisposableStore();

		this._logService.debug(`RunInTerminalTool: Creating ${args.isBackground ? 'background' : 'foreground'} terminal. termId=${termId}, chatSessionId=${chatSessionId}`);
		const toolTerminal = await (args.isBackground
			? this._initBackgroundTerminal(chatSessionId, termId, terminalToolSessionId, token)
			: this._initForegroundTerminal(chatSessionId, termId, terminalToolSessionId, token));

		this._handleTerminalVisibility(toolTerminal, chatSessionId);

		const timingConnectMs = Date.now() - timingStart;

		const xterm = await toolTerminal.instance.xtermReadyPromise;
		if (!xterm) {
			throw new Error('Instance was disposed before xterm.js was ready');
		}

		const commandDetection = toolTerminal.instance.capabilities.get(TerminalCapability.CommandDetection);

		let inputUserChars = 0;
		let inputUserSigint = false;
		store.add(xterm.raw.onData(data => {
			if (!telemetryIgnoredSequences.includes(data)) {
				inputUserChars += data.length;
			}
			inputUserSigint ||= data === '\x03';
		}));

		let outputMonitor: OutputMonitor | undefined;
		if (args.isBackground) {
			let pollingResult: IPollingResult & { pollDurationMs: number } | undefined;
			try {
				this._logService.debug(`RunInTerminalTool: Starting background execution \`${command}\``);
				const execution = new BackgroundTerminalExecution(toolTerminal.instance, xterm, command, chatSessionId, commandId);
				RunInTerminalTool._backgroundExecutions.set(termId, execution);

				outputMonitor = store.add(this._instantiationService.createInstance(OutputMonitor, execution, undefined, invocation.context!, token, command));
				await Event.toPromise(outputMonitor.onDidFinishCommand);
				const pollingResult = outputMonitor.pollingResult;

				if (token.isCancellationRequested) {
					throw new CancellationError();
				}

				await this._commandArtifactCollector.capture(toolSpecificData, toolTerminal.instance, commandId);
				const state = toolSpecificData.terminalCommandState ?? {};
				state.timestamp = state.timestamp ?? timingStart;
				toolSpecificData.terminalCommandState = state;

				let resultText = (
					didUserEditCommand
						? `Note: The user manually edited the command to \`${command}\`, and that command is now running in terminal with ID=${termId}`
						: didToolEditCommand
							? `Note: The tool simplified the command to \`${command}\`, and that command is now running in terminal with ID=${termId}`
							: `Command is running in terminal with ID=${termId}`
				);
				if (pollingResult && pollingResult.modelOutputEvalResponse) {
					resultText += `\n\ The command became idle with output:\n${pollingResult.modelOutputEvalResponse}`;
				} else if (pollingResult) {
					resultText += `\n\ The command is still running, with output:\n${pollingResult.output}`;
				}

				return {
					toolMetadata: {
						exitCode: undefined // Background processes don't have immediate exit codes
					},
					content: [{
						kind: 'text',
						value: resultText,
					}],
				};
			} catch (e) {
				if (termId) {
					RunInTerminalTool._backgroundExecutions.get(termId)?.dispose();
					RunInTerminalTool._backgroundExecutions.delete(termId);
				}
				error = e instanceof CancellationError ? 'canceled' : 'unexpectedException';
				throw e;
			} finally {
				store.dispose();
				this._logService.debug(`RunInTerminalTool: Finished polling \`${pollingResult?.output.length}\` lines of output in \`${pollingResult?.pollDurationMs}\``);
				const timingExecuteMs = Date.now() - timingStart;
				this._telemetry.logInvoke(toolTerminal.instance, {
					terminalToolSessionId: toolSpecificData.terminalToolSessionId,
					didUserEditCommand,
					didToolEditCommand,
					shellIntegrationQuality: toolTerminal.shellIntegrationQuality,
					isBackground: true,
					error,
					exitCode: undefined,
					isNewSession: true,
					timingExecuteMs,
					timingConnectMs,
					terminalExecutionIdleBeforeTimeout: pollingResult?.state === OutputMonitorState.Idle,
					outputLineCount: pollingResult?.output ? count(pollingResult.output, '\n') : 0,
					pollDurationMs: pollingResult?.pollDurationMs,
					inputUserChars,
					inputUserSigint,
					inputToolManualAcceptCount: outputMonitor?.outputMonitorTelemetryCounters.inputToolManualAcceptCount,
					inputToolManualRejectCount: outputMonitor?.outputMonitorTelemetryCounters.inputToolManualRejectCount,
					inputToolManualChars: outputMonitor?.outputMonitorTelemetryCounters.inputToolManualChars,
					inputToolAutoAcceptCount: outputMonitor?.outputMonitorTelemetryCounters.inputToolAutoAcceptCount,
					inputToolAutoChars: outputMonitor?.outputMonitorTelemetryCounters.inputToolAutoChars,
					inputToolManualShownCount: outputMonitor?.outputMonitorTelemetryCounters.inputToolManualShownCount,
					inputToolFreeFormInputCount: outputMonitor?.outputMonitorTelemetryCounters.inputToolFreeFormInputCount,
					inputToolFreeFormInputShownCount: outputMonitor?.outputMonitorTelemetryCounters.inputToolFreeFormInputShownCount
				});
			}
		} else {
			let terminalResult = '';

			let outputLineCount = -1;
			let exitCode: number | undefined;
			let altBufferResult: IToolResult | undefined;
			const executeCancellation = store.add(new CancellationTokenSource(token));
			try {
				let strategy: ITerminalExecuteStrategy;
				switch (toolTerminal.shellIntegrationQuality) {
					case ShellIntegrationQuality.None: {
						strategy = this._instantiationService.createInstance(NoneExecuteStrategy, toolTerminal.instance, () => toolTerminal.receivedUserInput ?? false);
						toolResultMessage = '$(info) Enable [shell integration](https://code.visualstudio.com/docs/terminal/shell-integration) to improve command detection';
						break;
					}
					case ShellIntegrationQuality.Basic: {
						strategy = this._instantiationService.createInstance(BasicExecuteStrategy, toolTerminal.instance, () => toolTerminal.receivedUserInput ?? false, commandDetection!);
						break;
					}
					case ShellIntegrationQuality.Rich: {
						strategy = this._instantiationService.createInstance(RichExecuteStrategy, toolTerminal.instance, commandDetection!);
						break;
					}
				}
				this._logService.debug(`RunInTerminalTool: Using \`${strategy.type}\` execute strategy for command \`${command}\``);
				store.add(strategy.onDidCreateStartMarker(startMarker => {
					if (!outputMonitor) {
						outputMonitor = store.add(this._instantiationService.createInstance(OutputMonitor, { instance: toolTerminal.instance, sessionId: invocation.context?.sessionId, getOutput: (marker?: IXtermMarker) => getOutput(toolTerminal.instance, marker ?? startMarker) }, undefined, invocation.context, token, command));
					}
				}));
				const executeResult = await strategy.execute(command, executeCancellation.token, commandId);
				// Reset user input state after command execution completes
				toolTerminal.receivedUserInput = false;
				if (token.isCancellationRequested) {
					throw new CancellationError();
				}

				if (executeResult.didEnterAltBuffer) {
					const state = toolSpecificData.terminalCommandState ?? {};
					state.timestamp = state.timestamp ?? timingStart;
					toolSpecificData.terminalCommandState = state;
					toolResultMessage = altBufferMessage;
					outputLineCount = 0;
					error = executeResult.error ?? 'alternateBuffer';
					altBufferResult = {
						toolResultMessage,
						toolMetadata: {
							exitCode: undefined
						},
						content: [{
							kind: 'text',
							value: altBufferMessage,
						}]
					};
				} else {
					await this._commandArtifactCollector.capture(toolSpecificData, toolTerminal.instance, commandId);
					{
						const state = toolSpecificData.terminalCommandState ?? {};
						state.timestamp = state.timestamp ?? timingStart;
						if (executeResult.exitCode !== undefined) {
							state.exitCode = executeResult.exitCode;
							if (state.timestamp !== undefined) {
								state.duration = state.duration ?? Math.max(0, Date.now() - state.timestamp);
							}
						}
						toolSpecificData.terminalCommandState = state;
					}

					this._logService.debug(`RunInTerminalTool: Finished \`${strategy.type}\` execute strategy with exitCode \`${executeResult.exitCode}\`, result.length \`${executeResult.output?.length}\`, error \`${executeResult.error}\``);
					outputLineCount = executeResult.output === undefined ? 0 : count(executeResult.output.trim(), '\n') + 1;
					exitCode = executeResult.exitCode;
					error = executeResult.error;

					const resultArr: string[] = [];
					if (executeResult.output !== undefined) {
						resultArr.push(executeResult.output);
					}
					if (executeResult.additionalInformation) {
						resultArr.push(executeResult.additionalInformation);
					}
					terminalResult = resultArr.join('\n\n');
				}

			} catch (e) {
				this._logService.debug(`RunInTerminalTool: Threw exception`);
				toolTerminal.instance.dispose();
				error = e instanceof CancellationError ? 'canceled' : 'unexpectedException';
				throw e;
			} finally {
				store.dispose();
				const timingExecuteMs = Date.now() - timingStart;
				this._telemetry.logInvoke(toolTerminal.instance, {
					terminalToolSessionId: toolSpecificData.terminalToolSessionId,
					didUserEditCommand,
					didToolEditCommand,
					isBackground: false,
					shellIntegrationQuality: toolTerminal.shellIntegrationQuality,
					error,
					isNewSession,
					outputLineCount,
					exitCode,
					timingExecuteMs,
					timingConnectMs,
					inputUserChars,
					inputUserSigint,
					terminalExecutionIdleBeforeTimeout: undefined,
					pollDurationMs: undefined,
					inputToolManualAcceptCount: outputMonitor?.outputMonitorTelemetryCounters?.inputToolManualAcceptCount,
					inputToolManualRejectCount: outputMonitor?.outputMonitorTelemetryCounters?.inputToolManualRejectCount,
					inputToolManualChars: outputMonitor?.outputMonitorTelemetryCounters?.inputToolManualChars,
					inputToolAutoAcceptCount: outputMonitor?.outputMonitorTelemetryCounters?.inputToolAutoAcceptCount,
					inputToolAutoChars: outputMonitor?.outputMonitorTelemetryCounters?.inputToolAutoChars,
					inputToolManualShownCount: outputMonitor?.outputMonitorTelemetryCounters?.inputToolManualShownCount,
					inputToolFreeFormInputCount: outputMonitor?.outputMonitorTelemetryCounters?.inputToolFreeFormInputCount,
					inputToolFreeFormInputShownCount: outputMonitor?.outputMonitorTelemetryCounters?.inputToolFreeFormInputShownCount
				});
			}

			if (altBufferResult) {
				return altBufferResult;
			}

			const resultText: string[] = [];
			if (didUserEditCommand) {
				resultText.push(`Note: The user manually edited the command to \`${command}\`, and this is the output of running that command instead:\n`);
			} else if (didToolEditCommand) {
				resultText.push(`Note: The tool simplified the command to \`${command}\`, and this is the output of running that command instead:\n`);
			}
			resultText.push(terminalResult);

			return {
				toolResultMessage,
				toolMetadata: {
					exitCode: exitCode
				},
				content: [{
					kind: 'text',
					value: resultText.join(''),
				}]
			};
		}
	}

	private _handleTerminalVisibility(toolTerminal: IToolTerminal, chatSessionId: string) {
		const chatSessionOpenInWidget = !!this._chatWidgetService.getWidgetBySessionResource(LocalChatSessionUri.forSession(chatSessionId));
		if (this._configurationService.getValue(TerminalChatAgentToolsSettingId.OutputLocation) === 'terminal' && chatSessionOpenInWidget) {
			this._terminalService.setActiveInstance(toolTerminal.instance);
			this._terminalService.revealTerminal(toolTerminal.instance, true);
		}
	}

	// #region Terminal init

	private async _initBackgroundTerminal(chatSessionId: string, termId: string, terminalToolSessionId: string | undefined, token: CancellationToken): Promise<IToolTerminal> {
		this._logService.debug(`RunInTerminalTool: Creating background terminal with ID=${termId}`);
		const profile = await this._profileFetcher.getCopilotProfile();
		const toolTerminal = await this._terminalToolCreator.createTerminal(profile, token);
		this._terminalChatService.registerTerminalInstanceWithToolSession(terminalToolSessionId, toolTerminal.instance);
		this._terminalChatService.registerTerminalInstanceWithChatSession(chatSessionId, toolTerminal.instance);
		this._registerInputListener(toolTerminal);
		this._sessionTerminalAssociations.set(chatSessionId, toolTerminal);
		if (token.isCancellationRequested) {
			toolTerminal.instance.dispose();
			throw new CancellationError();
		}
		await this._setupProcessIdAssociation(toolTerminal, chatSessionId, termId, true);
		return toolTerminal;
	}

	private async _initForegroundTerminal(chatSessionId: string, termId: string, terminalToolSessionId: string | undefined, token: CancellationToken): Promise<IToolTerminal> {
		const cachedTerminal = this._sessionTerminalAssociations.get(chatSessionId);
		if (cachedTerminal) {
			this._logService.debug(`RunInTerminalTool: Using cached foreground terminal with session ID \`${chatSessionId}\``);
			this._terminalToolCreator.refreshShellIntegrationQuality(cachedTerminal);
			this._terminalChatService.registerTerminalInstanceWithToolSession(terminalToolSessionId, cachedTerminal.instance);
			return cachedTerminal;
		}
		const profile = await this._profileFetcher.getCopilotProfile();
		const toolTerminal = await this._terminalToolCreator.createTerminal(profile, token);
		this._terminalChatService.registerTerminalInstanceWithToolSession(terminalToolSessionId, toolTerminal.instance);
		this._terminalChatService.registerTerminalInstanceWithChatSession(chatSessionId, toolTerminal.instance);
		this._registerInputListener(toolTerminal);
		this._sessionTerminalAssociations.set(chatSessionId, toolTerminal);
		if (token.isCancellationRequested) {
			toolTerminal.instance.dispose();
			throw new CancellationError();
		}
		await this._setupProcessIdAssociation(toolTerminal, chatSessionId, termId, false);
		return toolTerminal;
	}

	private _registerInputListener(toolTerminal: IToolTerminal): void {
		const disposable = toolTerminal.instance.onData(data => {
			if (!telemetryIgnoredSequences.includes(data)) {
				toolTerminal.receivedUserInput = data.length > 0;
			}
		});
		this._register(toolTerminal.instance.onDisposed(() => disposable.dispose()));
	}


	// #endregion

	// #region Session management

	private _restoreTerminalAssociations(): void {
		const storedAssociations = this._storageService.get(TerminalToolStorageKeysInternal.TerminalSession, StorageScope.WORKSPACE, '{}');
		try {
			const associations: Record<number, IStoredTerminalAssociation> = JSON.parse(storedAssociations);

			// Find existing terminals and associate them with sessions
			for (const instance of this._terminalService.instances) {
				if (instance.processId) {
					const association = associations[instance.processId];
					if (association) {
						this._logService.debug(`RunInTerminalTool: Restored terminal association for PID ${instance.processId}, session ${association.sessionId}`);
						const toolTerminal: IToolTerminal = {
							instance,
							shellIntegrationQuality: association.shellIntegrationQuality
						};
						this._sessionTerminalAssociations.set(association.sessionId, toolTerminal);
						this._terminalChatService.registerTerminalInstanceWithChatSession(association.sessionId, instance);

						// Listen for terminal disposal to clean up storage
						this._register(instance.onDisposed(() => {
							this._removeProcessIdAssociation(instance.processId!);
						}));
					}
				}
			}
		} catch (error) {
			this._logService.debug(`RunInTerminalTool: Failed to restore terminal associations: ${error}`);
		}
	}

	private async _setupProcessIdAssociation(toolTerminal: IToolTerminal, chatSessionId: string, termId: string, isBackground: boolean) {
		await this._associateProcessIdWithSession(toolTerminal.instance, chatSessionId, termId, toolTerminal.shellIntegrationQuality, isBackground);
		this._register(toolTerminal.instance.onDisposed(() => {
			if (toolTerminal!.instance.processId) {
				this._removeProcessIdAssociation(toolTerminal!.instance.processId);
			}
		}));
	}

	private async _associateProcessIdWithSession(terminal: ITerminalInstance, sessionId: string, id: string, shellIntegrationQuality: ShellIntegrationQuality, isBackground?: boolean): Promise<void> {
		try {
			// Wait for process ID with timeout
			const pid = await Promise.race([
				terminal.processReady.then(() => terminal.processId),
				timeout(5000).then(() => { throw new Error('Timeout'); })
			]);

			if (isNumber(pid)) {
				const storedAssociations = this._storageService.get(TerminalToolStorageKeysInternal.TerminalSession, StorageScope.WORKSPACE, '{}');
				const associations: Record<number, IStoredTerminalAssociation> = JSON.parse(storedAssociations);

				const existingAssociation = associations[pid] || {};
				associations[pid] = {
					...existingAssociation,
					sessionId,
					shellIntegrationQuality,
					id,
					isBackground
				};

				this._storageService.store(TerminalToolStorageKeysInternal.TerminalSession, JSON.stringify(associations), StorageScope.WORKSPACE, StorageTarget.USER);
				this._logService.debug(`RunInTerminalTool: Associated terminal PID ${pid} with session ${sessionId}`);
			}
		} catch (error) {
			this._logService.debug(`RunInTerminalTool: Failed to associate terminal with session: ${error}`);
		}
	}

	private async _removeProcessIdAssociation(pid: number): Promise<void> {
		try {
			const storedAssociations = this._storageService.get(TerminalToolStorageKeysInternal.TerminalSession, StorageScope.WORKSPACE, '{}');
			const associations: Record<number, IStoredTerminalAssociation> = JSON.parse(storedAssociations);

			if (associations[pid]) {
				delete associations[pid];
				this._storageService.store(TerminalToolStorageKeysInternal.TerminalSession, JSON.stringify(associations), StorageScope.WORKSPACE, StorageTarget.USER);
				this._logService.debug(`RunInTerminalTool: Removed terminal association for PID ${pid}`);
			}
		} catch (error) {
			this._logService.debug(`RunInTerminalTool: Failed to remove terminal association: ${error}`);
		}
	}

	private _cleanupSessionTerminals(sessionId: string): void {
		const toolTerminal = this._sessionTerminalAssociations.get(sessionId);
		if (toolTerminal) {
			this._logService.debug(`RunInTerminalTool: Cleaning up terminal for disposed chat session ${sessionId}`);

			this._sessionTerminalAssociations.delete(sessionId);
			toolTerminal.instance.dispose();

			// Clean up any background executions associated with this session
			const terminalToRemove: string[] = [];
			for (const [termId, execution] of RunInTerminalTool._backgroundExecutions.entries()) {
				if (execution.instance === toolTerminal.instance) {
					execution.dispose();
					terminalToRemove.push(termId);
				}
			}
			for (const termId of terminalToRemove) {
				RunInTerminalTool._backgroundExecutions.delete(termId);
			}
		}
	}

	// #endregion
}

class BackgroundTerminalExecution extends Disposable {
	private _startMarker?: IXtermMarker;

	constructor(
		readonly instance: ITerminalInstance,
		private readonly _xterm: XtermTerminal,
		private readonly _commandLine: string,
		readonly sessionId: string,
		commandId?: string
	) {
		super();

		this._startMarker = this._register(this._xterm.raw.registerMarker());
		this.instance.runCommand(this._commandLine, true, commandId);
	}
	getOutput(marker?: IXtermMarker): string {
		return getOutput(this.instance, marker ?? this._startMarker);
	}
}

export class TerminalProfileFetcher {

	readonly osBackend: Promise<OperatingSystem>;

	constructor(
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@ITerminalProfileResolverService private readonly _terminalProfileResolverService: ITerminalProfileResolverService,
		@IRemoteAgentService private readonly _remoteAgentService: IRemoteAgentService,
	) {
		this.osBackend = this._remoteAgentService.getEnvironment().then(remoteEnv => remoteEnv?.os ?? OS);
	}

	async getCopilotProfile(): Promise<ITerminalProfile> {
		const os = await this.osBackend;

		// Check for chat agent terminal profile first
		const customChatAgentProfile = this._getChatTerminalProfile(os);
		if (customChatAgentProfile) {
			return customChatAgentProfile;
		}

		// When setting is null, use the previous behavior
		const defaultProfile = await this._terminalProfileResolverService.getDefaultProfile({
			os,
			remoteAuthority: this._remoteAgentService.getConnection()?.remoteAuthority
		});

		// Force pwsh over cmd as cmd doesn't have shell integration
		if (basename(defaultProfile.path) === 'cmd.exe') {
			return {
				...defaultProfile,
				path: 'C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe',
				profileName: 'PowerShell'
			};
		}

		// Setting icon: undefined allows the system to use the default AI terminal icon (not overridden or removed)
		return { ...defaultProfile, icon: undefined };
	}

	async getCopilotShell(): Promise<string> {
		return (await this.getCopilotProfile()).path;
	}

	private _getChatTerminalProfile(os: OperatingSystem): ITerminalProfile | undefined {
		let profileSetting: string;
		switch (os) {
			case OperatingSystem.Windows:
				profileSetting = TerminalChatAgentToolsSettingId.TerminalProfileWindows;
				break;
			case OperatingSystem.Macintosh:
				profileSetting = TerminalChatAgentToolsSettingId.TerminalProfileMacOs;
				break;
			case OperatingSystem.Linux:
			default:
				profileSetting = TerminalChatAgentToolsSettingId.TerminalProfileLinux;
				break;
		}

		const profile = this._configurationService.getValue(profileSetting);
		if (this._isValidChatAgentTerminalProfile(profile)) {
			return profile;
		}

		return undefined;
	}

	private _isValidChatAgentTerminalProfile(profile: unknown): profile is ITerminalProfile {
		if (profile === null || profile === undefined || typeof profile !== 'object') {
			return false;
		}
		if ('path' in profile && isString((profile as { path: unknown }).path)) {
			return true;
		}
		return false;
	}
}

// #endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/tools/terminalCommandArtifactCollector.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/tools/terminalCommandArtifactCollector.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../../../base/common/uri.js';
import { IChatTerminalToolInvocationData } from '../../../../chat/common/chatService.js';
import { ITerminalInstance } from '../../../../terminal/browser/terminal.js';
import { getCommandOutputSnapshot } from '../../../../terminal/browser/chatTerminalCommandMirror.js';
import { TerminalCapability, type ITerminalCommand } from '../../../../../../platform/terminal/common/capabilities/capabilities.js';
import { ITerminalLogService } from '../../../../../../platform/terminal/common/terminal.js';

export class TerminalCommandArtifactCollector {
	constructor(
		@ITerminalLogService private readonly _logService: ITerminalLogService,
	) { }

	async capture(
		toolSpecificData: IChatTerminalToolInvocationData,
		instance: ITerminalInstance,
		commandId: string | undefined,
	): Promise<void> {
		if (commandId) {
			try {
				toolSpecificData.terminalCommandUri = this._createTerminalCommandUri(instance, commandId);
			} catch (error) {
				this._logService.warn(`RunInTerminalTool: Failed to create terminal command URI for ${commandId}`, error);
			}

			const command = await this._tryGetCommand(instance, commandId);
			if (command) {
				toolSpecificData.terminalCommandState = {
					exitCode: command.exitCode,
					timestamp: command.timestamp,
					duration: command.duration
				};
				const snapshot = await this._captureCommandOutput(instance, command);
				if (snapshot) {
					toolSpecificData.terminalCommandOutput = snapshot;
				}
				this._applyTheme(toolSpecificData, instance);
				return;
			}
		}

		this._applyTheme(toolSpecificData, instance);
	}

	private async _captureCommandOutput(instance: ITerminalInstance, command: ITerminalCommand): Promise<IChatTerminalToolInvocationData['terminalCommandOutput'] | undefined> {
		try {
			await instance.xtermReadyPromise;
		} catch {
			return undefined;
		}
		const xterm = instance.xterm;
		if (!xterm) {
			return undefined;
		}

		return getCommandOutputSnapshot(xterm, command, (reason, error) => {
			const suffix = reason === 'fallback' ? ' (fallback)' : '';
			this._logService.debug(`RunInTerminalTool: Failed to snapshot command output${suffix}`, error);
		});
	}

	private _applyTheme(toolSpecificData: IChatTerminalToolInvocationData, instance: ITerminalInstance): void {
		const theme = instance.xterm?.getXtermTheme();
		if (theme) {
			toolSpecificData.terminalTheme = { background: theme.background, foreground: theme.foreground };
		}
	}

	private _createTerminalCommandUri(instance: ITerminalInstance, commandId: string): URI {
		const params = new URLSearchParams(instance.resource.query);
		params.set('command', commandId);
		return instance.resource.with({ query: params.toString() });
	}

	private async _tryGetCommand(instance: ITerminalInstance, commandId: string) {
		const commandDetection = instance.capabilities.get(TerminalCapability.CommandDetection);
		return commandDetection?.commands.find(c => c.id === commandId);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/tools/commandLineAnalyzer/commandLineAnalyzer.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/tools/commandLineAnalyzer/commandLineAnalyzer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { IMarkdownString } from '../../../../../../../base/common/htmlContent.js';
import type { IDisposable } from '../../../../../../../base/common/lifecycle.js';
import type { OperatingSystem } from '../../../../../../../base/common/platform.js';
import type { URI } from '../../../../../../../base/common/uri.js';
import type { ToolConfirmationAction } from '../../../../../chat/common/languageModelToolsService.js';
import type { TreeSitterCommandParserLanguage } from '../../treeSitterCommandParser.js';

export interface ICommandLineAnalyzer extends IDisposable {
	analyze(options: ICommandLineAnalyzerOptions): Promise<ICommandLineAnalyzerResult>;
}

export interface ICommandLineAnalyzerOptions {
	commandLine: string;
	cwd: URI | undefined;
	shell: string;
	os: OperatingSystem;
	treeSitterLanguage: TreeSitterCommandParserLanguage;
	terminalToolSessionId: string;
	chatSessionId: string | undefined;
}

export interface ICommandLineAnalyzerResult {
	/**
	 * Whether auto approval is allowed based on the analysis, when false this
	 * will block auto approval.
	*/
	readonly isAutoApproveAllowed: boolean;
	/**
	 * Whether the command line was explicitly auto approved by this analyzer.
	 * - `true`: This analyzer explicitly approves auto-execution
	 * - `false`: This analyzer explicitly denies auto-execution
	 * - `undefined`: This analyzer does not make an approval/denial decision
	 */
	readonly isAutoApproved?: boolean;
	readonly disclaimers?: readonly string[];
	readonly autoApproveInfo?: IMarkdownString;
	readonly customActions?: ToolConfirmationAction[];
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/tools/commandLineAnalyzer/commandLineAutoApproveAnalyzer.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/tools/commandLineAnalyzer/commandLineAutoApproveAnalyzer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { asArray } from '../../../../../../../base/common/arrays.js';
import { createCommandUri, MarkdownString, type IMarkdownString } from '../../../../../../../base/common/htmlContent.js';
import { Disposable } from '../../../../../../../base/common/lifecycle.js';
import type { SingleOrMany } from '../../../../../../../base/common/types.js';
import { localize } from '../../../../../../../nls.js';
import { IConfigurationService } from '../../../../../../../platform/configuration/common/configuration.js';
import { IInstantiationService } from '../../../../../../../platform/instantiation/common/instantiation.js';
import { ITerminalChatService } from '../../../../../terminal/browser/terminal.js';
import { IStorageService, StorageScope } from '../../../../../../../platform/storage/common/storage.js';
import { TerminalToolConfirmationStorageKeys } from '../../../../../chat/browser/chatContentParts/toolInvocationParts/chatTerminalToolConfirmationSubPart.js';
import { ChatConfiguration } from '../../../../../chat/common/constants.js';
import type { ToolConfirmationAction } from '../../../../../chat/common/languageModelToolsService.js';
import { TerminalChatAgentToolsSettingId } from '../../../common/terminalChatAgentToolsConfiguration.js';
import { CommandLineAutoApprover, type IAutoApproveRule, type ICommandApprovalResult, type ICommandApprovalResultWithReason } from '../../commandLineAutoApprover.js';
import { dedupeRules, generateAutoApproveActions, isPowerShell } from '../../runInTerminalHelpers.js';
import type { RunInTerminalToolTelemetry } from '../../runInTerminalToolTelemetry.js';
import { type TreeSitterCommandParser } from '../../treeSitterCommandParser.js';
import type { ICommandLineAnalyzer, ICommandLineAnalyzerOptions, ICommandLineAnalyzerResult } from './commandLineAnalyzer.js';
import { TerminalChatCommandId } from '../../../../chat/browser/terminalChat.js';

const promptInjectionWarningCommandsLower = [
	'curl',
	'wget',
];
const promptInjectionWarningCommandsLowerPwshOnly = [
	'invoke-restmethod',
	'invoke-webrequest',
	'irm',
	'iwr',
];

export class CommandLineAutoApproveAnalyzer extends Disposable implements ICommandLineAnalyzer {
	private readonly _commandLineAutoApprover: CommandLineAutoApprover;

	constructor(
		private readonly _treeSitterCommandParser: TreeSitterCommandParser,
		private readonly _telemetry: RunInTerminalToolTelemetry,
		private readonly _log: (message: string, ...args: unknown[]) => void,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IStorageService private readonly _storageService: IStorageService,
		@ITerminalChatService private readonly _terminalChatService: ITerminalChatService,
	) {
		super();
		this._commandLineAutoApprover = this._register(instantiationService.createInstance(CommandLineAutoApprover));
	}

	async analyze(options: ICommandLineAnalyzerOptions): Promise<ICommandLineAnalyzerResult> {
		if (options.chatSessionId && this._terminalChatService.hasChatSessionAutoApproval(options.chatSessionId)) {
			this._log('Session has auto approval enabled, auto approving command');
			const disableUri = createCommandUri(TerminalChatCommandId.DisableSessionAutoApproval, options.chatSessionId);
			const mdTrustSettings = {
				isTrusted: {
					enabledCommands: [TerminalChatCommandId.DisableSessionAutoApproval]
				}
			};
			return {
				isAutoApproved: true,
				isAutoApproveAllowed: true,
				disclaimers: [],
				autoApproveInfo: new MarkdownString(`${localize('autoApprove.session', 'Auto approved for this session')} ([${localize('autoApprove.session.disable', 'Disable')}](${disableUri.toString()}))`, mdTrustSettings),
			};
		}

		let subCommands: string[] | undefined;
		try {
			subCommands = await this._treeSitterCommandParser.extractSubCommands(options.treeSitterLanguage, options.commandLine);
			this._log(`Parsed sub-commands via ${options.treeSitterLanguage} grammar`, subCommands);
		} catch (e) {
			console.error(e);
			this._log(`Failed to parse sub-commands via ${options.treeSitterLanguage} grammar`);
		}

		let isAutoApproved = false;
		let autoApproveInfo: IMarkdownString | undefined;
		let customActions: ToolConfirmationAction[] | undefined;

		if (!subCommands) {
			return {
				isAutoApproveAllowed: false,
				disclaimers: [],
			};
		}

		const subCommandResults = subCommands.map(e => this._commandLineAutoApprover.isCommandAutoApproved(e, options.shell, options.os));
		const commandLineResult = this._commandLineAutoApprover.isCommandLineAutoApproved(options.commandLine);
		const autoApproveReasons: string[] = [
			...subCommandResults.map(e => e.reason),
			commandLineResult.reason,
		];

		let isDenied = false;
		let autoApproveReason: 'subCommand' | 'commandLine' | undefined;
		let autoApproveDefault: boolean | undefined;

		const deniedSubCommandResult = subCommandResults.find(e => e.result === 'denied');
		if (deniedSubCommandResult) {
			this._log('Sub-command DENIED auto approval');
			isDenied = true;
			autoApproveDefault = deniedSubCommandResult.rule?.isDefaultRule;
			autoApproveReason = 'subCommand';
		} else if (commandLineResult.result === 'denied') {
			this._log('Command line DENIED auto approval');
			isDenied = true;
			autoApproveDefault = commandLineResult.rule?.isDefaultRule;
			autoApproveReason = 'commandLine';
		} else {
			if (subCommandResults.every(e => e.result === 'approved')) {
				this._log('All sub-commands auto-approved');
				autoApproveReason = 'subCommand';
				isAutoApproved = true;
				autoApproveDefault = subCommandResults.every(e => e.rule?.isDefaultRule);
			} else {
				this._log('All sub-commands NOT auto-approved');
				if (commandLineResult.result === 'approved') {
					this._log('Command line auto-approved');
					autoApproveReason = 'commandLine';
					isAutoApproved = true;
					autoApproveDefault = commandLineResult.rule?.isDefaultRule;
				} else {
					this._log('Command line NOT auto-approved');
				}
			}
		}

		// Log detailed auto approval reasoning
		for (const reason of autoApproveReasons) {
			this._log(`- ${reason}`);
		}

		// Apply auto approval or force it off depending on enablement/opt-in state
		const isAutoApproveEnabled = this._configurationService.getValue(TerminalChatAgentToolsSettingId.EnableAutoApprove) === true;
		const isAutoApproveWarningAccepted = this._storageService.getBoolean(TerminalToolConfirmationStorageKeys.TerminalAutoApproveWarningAccepted, StorageScope.APPLICATION, false);
		if (isAutoApproveEnabled && isAutoApproved) {
			autoApproveInfo = this._createAutoApproveInfo(
				isAutoApproved,
				isDenied,
				autoApproveReason,
				subCommandResults,
				commandLineResult,
			);
		} else {
			isAutoApproved = false;
		}

		// Send telemetry about auto approval process
		this._telemetry.logPrepare({
			terminalToolSessionId: options.terminalToolSessionId,
			subCommands,
			autoApproveAllowed: !isAutoApproveEnabled ? 'off' : isAutoApproveWarningAccepted ? 'allowed' : 'needsOptIn',
			autoApproveResult: isAutoApproved ? 'approved' : isDenied ? 'denied' : 'manual',
			autoApproveReason,
			autoApproveDefault
		});

		// Prompt injection warning for common commands that return content from the web
		const disclaimers: string[] = [];
		const subCommandsLowerFirstWordOnly = subCommands.map(command => command.split(' ')[0].toLowerCase());
		if (!isAutoApproved && (
			subCommandsLowerFirstWordOnly.some(command => promptInjectionWarningCommandsLower.includes(command)) ||
			(isPowerShell(options.shell, options.os) && subCommandsLowerFirstWordOnly.some(command => promptInjectionWarningCommandsLowerPwshOnly.includes(command)))
		)) {
			disclaimers.push(localize('runInTerminal.promptInjectionDisclaimer', 'Web content may contain malicious code or attempt prompt injection attacks.'));
		}

		if (!isAutoApproved && isAutoApproveEnabled) {
			customActions = generateAutoApproveActions(options.commandLine, subCommands, { subCommandResults, commandLineResult });
		}

		return {
			isAutoApproved,
			// This is not based on isDenied because we want the user to be able to configure it
			isAutoApproveAllowed: true,
			disclaimers,
			autoApproveInfo,
			customActions,
		};
	}

	private _createAutoApproveInfo(
		isAutoApproved: boolean,
		isDenied: boolean,
		autoApproveReason: 'subCommand' | 'commandLine' | undefined,
		subCommandResults: ICommandApprovalResultWithReason[],
		commandLineResult: ICommandApprovalResultWithReason,
	): IMarkdownString | undefined {
		const formatRuleLinks = (result: SingleOrMany<{ result: ICommandApprovalResult; rule?: IAutoApproveRule; reason: string }>): string => {
			return asArray(result).map(e => {
				const settingsUri = createCommandUri(TerminalChatCommandId.OpenTerminalSettingsLink, e.rule!.sourceTarget);
				return `[\`${e.rule!.sourceText}\`](${settingsUri.toString()} "${localize('ruleTooltip', 'View rule in settings')}")`;
			}).join(', ');
		};

		const mdTrustSettings = {
			isTrusted: {
				enabledCommands: [TerminalChatCommandId.OpenTerminalSettingsLink]
			}
		};

		const config = this._configurationService.inspect<boolean | Record<string, boolean>>(ChatConfiguration.GlobalAutoApprove);
		const isGlobalAutoApproved = config?.value ?? config.defaultValue;
		if (isGlobalAutoApproved) {
			const settingsUri = createCommandUri(TerminalChatCommandId.OpenTerminalSettingsLink, 'global');
			return new MarkdownString(`${localize('autoApprove.global', 'Auto approved by setting {0}', `[\`${ChatConfiguration.GlobalAutoApprove}\`](${settingsUri.toString()} "${localize('ruleTooltip.global', 'View settings')}")`)}`, mdTrustSettings);
		}

		if (isAutoApproved) {
			switch (autoApproveReason) {
				case 'commandLine': {
					if (commandLineResult.rule) {
						return new MarkdownString(localize('autoApprove.rule', 'Auto approved by rule {0}', formatRuleLinks(commandLineResult)), mdTrustSettings);
					}
					break;
				}
				case 'subCommand': {
					const uniqueRules = dedupeRules(subCommandResults);
					if (uniqueRules.length === 1) {
						return new MarkdownString(localize('autoApprove.rule', 'Auto approved by rule {0}', formatRuleLinks(uniqueRules)), mdTrustSettings);
					} else if (uniqueRules.length > 1) {
						return new MarkdownString(localize('autoApprove.rules', 'Auto approved by rules {0}', formatRuleLinks(uniqueRules)), mdTrustSettings);
					}
					break;
				}
			}
		} else if (isDenied) {
			switch (autoApproveReason) {
				case 'commandLine': {
					if (commandLineResult.rule) {
						return new MarkdownString(localize('autoApproveDenied.rule', 'Auto approval denied by rule {0}', formatRuleLinks(commandLineResult)), mdTrustSettings);
					}
					break;
				}
				case 'subCommand': {
					const uniqueRules = dedupeRules(subCommandResults.filter(e => e.result === 'denied'));
					if (uniqueRules.length === 1) {
						return new MarkdownString(localize('autoApproveDenied.rule', 'Auto approval denied by rule {0}', formatRuleLinks(uniqueRules)));
					} else if (uniqueRules.length > 1) {
						return new MarkdownString(localize('autoApproveDenied.rules', 'Auto approval denied by rules {0}', formatRuleLinks(uniqueRules)));
					}
					break;
				}
			}
		}

		return undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/tools/commandLineAnalyzer/commandLineFileWriteAnalyzer.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/tools/commandLineAnalyzer/commandLineFileWriteAnalyzer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../../../../base/common/lifecycle.js';
import { URI } from '../../../../../../../base/common/uri.js';
import { win32, posix } from '../../../../../../../base/common/path.js';
import { localize } from '../../../../../../../nls.js';
import { IConfigurationService } from '../../../../../../../platform/configuration/common/configuration.js';
import { IWorkspaceContextService } from '../../../../../../../platform/workspace/common/workspace.js';
import { TerminalChatAgentToolsSettingId } from '../../../common/terminalChatAgentToolsConfiguration.js';
import { TreeSitterCommandParserLanguage, type TreeSitterCommandParser } from '../../treeSitterCommandParser.js';
import type { ICommandLineAnalyzer, ICommandLineAnalyzerOptions, ICommandLineAnalyzerResult } from './commandLineAnalyzer.js';
import { OperatingSystem } from '../../../../../../../base/common/platform.js';
import { isString } from '../../../../../../../base/common/types.js';
import { ILabelService } from '../../../../../../../platform/label/common/label.js';

const nullDevice = Symbol('null device');

type FileWrite = URI | string | typeof nullDevice;

export class CommandLineFileWriteAnalyzer extends Disposable implements ICommandLineAnalyzer {
	constructor(
		private readonly _treeSitterCommandParser: TreeSitterCommandParser,
		private readonly _log: (message: string, ...args: unknown[]) => void,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@ILabelService private readonly _labelService: ILabelService,
		@IWorkspaceContextService private readonly _workspaceContextService: IWorkspaceContextService,
	) {
		super();
	}

	async analyze(options: ICommandLineAnalyzerOptions): Promise<ICommandLineAnalyzerResult> {
		let fileWrites: FileWrite[];
		try {
			fileWrites = await this._getFileWrites(options);
		} catch (e) {
			console.error(e);
			this._log('Failed to get file writes via grammar', options.treeSitterLanguage);
			return {
				isAutoApproveAllowed: false
			};
		}
		return this._getResult(options, fileWrites);
	}

	private async _getFileWrites(options: ICommandLineAnalyzerOptions): Promise<FileWrite[]> {
		let fileWrites: FileWrite[] = [];
		const capturedFileWrites = (await this._treeSitterCommandParser.getFileWrites(options.treeSitterLanguage, options.commandLine))
			.map(this._mapNullDevice.bind(this, options));
		if (capturedFileWrites.length) {
			const cwd = options.cwd;
			if (cwd) {
				this._log('Detected cwd', cwd.toString());
				fileWrites = capturedFileWrites.map(e => {
					if (e === nullDevice) {
						return e;
					}
					const isAbsolute = options.os === OperatingSystem.Windows ? win32.isAbsolute(e) : posix.isAbsolute(e);
					if (isAbsolute) {
						return URI.file(e);
					} else {
						return URI.joinPath(cwd, e);
					}
				});
			} else {
				this._log('Cwd could not be detected');
				fileWrites = capturedFileWrites;
			}
		}
		this._log('File writes detected', fileWrites.map(e => e.toString()));
		return fileWrites;
	}

	private _mapNullDevice(options: ICommandLineAnalyzerOptions, rawFileWrite: string): string | typeof nullDevice {
		if (options.treeSitterLanguage === TreeSitterCommandParserLanguage.PowerShell) {
			return rawFileWrite === '$null'
				? nullDevice
				: rawFileWrite;
		}
		return rawFileWrite === '/dev/null'
			? nullDevice
			: rawFileWrite;
	}

	private _getResult(options: ICommandLineAnalyzerOptions, fileWrites: FileWrite[]): ICommandLineAnalyzerResult {
		let isAutoApproveAllowed = true;
		if (fileWrites.length > 0) {
			const blockDetectedFileWrites = this._configurationService.getValue<string>(TerminalChatAgentToolsSettingId.BlockDetectedFileWrites);
			switch (blockDetectedFileWrites) {
				case 'all': {
					isAutoApproveAllowed = false;
					this._log('File writes blocked due to "all" setting');
					break;
				}
				case 'outsideWorkspace': {
					const workspaceFolders = this._workspaceContextService.getWorkspace().folders;
					if (workspaceFolders.length > 0) {
						for (const fileWrite of fileWrites) {
							if (fileWrite === nullDevice) {
								this._log('File write to null device allowed', URI.isUri(fileWrite) ? fileWrite.toString() : fileWrite);
								continue;
							}

							if (isString(fileWrite)) {
								const isAbsolute = options.os === OperatingSystem.Windows ? win32.isAbsolute(fileWrite) : posix.isAbsolute(fileWrite);
								if (!isAbsolute) {
									isAutoApproveAllowed = false;
									this._log('File write blocked due to unknown terminal cwd', fileWrite);
									break;
								}
							}
							const fileUri = URI.isUri(fileWrite) ? fileWrite : URI.file(fileWrite);
							// TODO: Handle command substitutions/complex destinations properly https://github.com/microsoft/vscode/issues/274167
							// TODO: Handle environment variables properly https://github.com/microsoft/vscode/issues/274166
							if (fileUri.fsPath.match(/[$\(\){}]/)) {
								isAutoApproveAllowed = false;
								this._log('File write blocked due to likely containing a variable', fileUri.toString());
								break;
							}
							const isInsideWorkspace = workspaceFolders.some(folder =>
								folder.uri.scheme === fileUri.scheme &&
								(fileUri.path.startsWith(folder.uri.path + '/') || fileUri.path === folder.uri.path)
							);
							if (!isInsideWorkspace) {
								isAutoApproveAllowed = false;
								this._log('File write blocked outside workspace', fileUri.toString());
								break;
							}
						}
					} else {
						// No workspace folders, allow safe null device paths even without workspace
						const hasOnlyNullDevices = fileWrites.every(fw => fw === nullDevice);
						if (!hasOnlyNullDevices) {
							isAutoApproveAllowed = false;
							this._log('File writes blocked - no workspace folders');
						}
					}
					break;
				}
				case 'never':
				default: {
					break;
				}
			}
		}

		const disclaimers: string[] = [];
		if (fileWrites.length > 0) {
			const fileWritesList = fileWrites.map(fw => `\`${URI.isUri(fw) ? this._labelService.getUriLabel(fw) : fw === nullDevice ? '/dev/null' : fw.toString()}\``).join(', ');
			if (!isAutoApproveAllowed) {
				disclaimers.push(localize('runInTerminal.fileWriteBlockedDisclaimer', 'File write operations detected that cannot be auto approved: {0}', fileWritesList));
			} else {
				disclaimers.push(localize('runInTerminal.fileWriteDisclaimer', 'File write operations detected: {0}', fileWritesList));
			}
		}
		return {
			isAutoApproveAllowed,
			disclaimers,
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/tools/commandLineRewriter/commandLineCdPrefixRewriter.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/tools/commandLineRewriter/commandLineCdPrefixRewriter.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../../../../base/common/lifecycle.js';
import { OperatingSystem } from '../../../../../../../base/common/platform.js';
import { isPowerShell } from '../../runInTerminalHelpers.js';
import type { ICommandLineRewriter, ICommandLineRewriterOptions, ICommandLineRewriterResult } from './commandLineRewriter.js';

export class CommandLineCdPrefixRewriter extends Disposable implements ICommandLineRewriter {
	rewrite(options: ICommandLineRewriterOptions): ICommandLineRewriterResult | undefined {
		if (!options.cwd) {
			return undefined;
		}

		const isPwsh = isPowerShell(options.shell, options.os);

		// Re-write the command if it starts with `cd <dir> && <suffix>` or `cd <dir>; <suffix>`
		// to just `<suffix>` if the directory matches the current terminal's cwd. This simplifies
		// the result in the chat by removing redundancies that some models like to add.
		const cdPrefixMatch = options.commandLine.match(
			isPwsh
				? /^(?:cd(?: \/d)?|Set-Location(?: -Path)?) (?<dir>[^\s]+) ?(?:&&|;)\s+(?<suffix>.+)$/i
				: /^cd (?<dir>[^\s]+) &&\s+(?<suffix>.+)$/
		);
		const cdDir = cdPrefixMatch?.groups?.dir;
		const cdSuffix = cdPrefixMatch?.groups?.suffix;
		if (cdDir && cdSuffix) {
			// Remove any surrounding quotes
			let cdDirPath = cdDir;
			if (cdDirPath.startsWith('"') && cdDirPath.endsWith('"')) {
				cdDirPath = cdDirPath.slice(1, -1);
			}
			// Normalize trailing slashes
			cdDirPath = cdDirPath.replace(/(?:[\\\/])$/, '');
			let cwdFsPath = options.cwd.fsPath.replace(/(?:[\\\/])$/, '');
			// Case-insensitive comparison on Windows
			if (options.os === OperatingSystem.Windows) {
				cdDirPath = cdDirPath.toLowerCase();
				cwdFsPath = cwdFsPath.toLowerCase();
			}
			if (cdDirPath === cwdFsPath) {
				return { rewritten: cdSuffix, reasoning: 'Removed redundant cd command' };
			}
		}
		return undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/tools/commandLineRewriter/commandLinePwshChainOperatorRewriter.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/tools/commandLineRewriter/commandLinePwshChainOperatorRewriter.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { QueryCapture } from '@vscode/tree-sitter-wasm';
import { Disposable } from '../../../../../../../base/common/lifecycle.js';
import { isPowerShell } from '../../runInTerminalHelpers.js';
import type { TreeSitterCommandParser } from '../../treeSitterCommandParser.js';
import type { ICommandLineRewriter, ICommandLineRewriterOptions, ICommandLineRewriterResult } from './commandLineRewriter.js';

export class CommandLinePwshChainOperatorRewriter extends Disposable implements ICommandLineRewriter {
	constructor(
		private readonly _treeSitterCommandParser: TreeSitterCommandParser,
	) {
		super();
	}

	async rewrite(options: ICommandLineRewriterOptions): Promise<ICommandLineRewriterResult | undefined> {
		// TODO: This should just be Windows PowerShell in the future when the powershell grammar
		// supports chain operators https://github.com/airbus-cert/tree-sitter-powershell/issues/27
		if (isPowerShell(options.shell, options.os)) {
			let doubleAmpersandCaptures: QueryCapture[] | undefined;
			try {
				doubleAmpersandCaptures = await this._treeSitterCommandParser.extractPwshDoubleAmpersandChainOperators(options.commandLine);
			} catch {
				// Swallow tree sitter failures
			}

			if (doubleAmpersandCaptures && doubleAmpersandCaptures.length > 0) {
				let rewritten = options.commandLine;
				for (const capture of doubleAmpersandCaptures.reverse()) {
					rewritten = `${rewritten.substring(0, capture.node.startIndex)};${rewritten.substring(capture.node.endIndex)}`;
				}
				return {
					rewritten,
					reasoning: '&& re-written to ;'
				};
			}
		}

		return undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/tools/commandLineRewriter/commandLineRewriter.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/tools/commandLineRewriter/commandLineRewriter.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { MaybePromise } from '../../../../../../../base/common/async.js';
import type { IDisposable } from '../../../../../../../base/common/lifecycle.js';
import type { OperatingSystem } from '../../../../../../../base/common/platform.js';
import type { URI } from '../../../../../../../base/common/uri.js';

export interface ICommandLineRewriter extends IDisposable {
	rewrite(options: ICommandLineRewriterOptions): MaybePromise<ICommandLineRewriterResult | undefined>;
}

export interface ICommandLineRewriterOptions {
	commandLine: string;
	cwd: URI | undefined;
	shell: string;
	os: OperatingSystem;
}

export interface ICommandLineRewriterResult {
	rewritten: string;
	reasoning: string;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/tools/monitoring/outputMonitor.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/tools/monitoring/outputMonitor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { IMarker as XtermMarker } from '@xterm/xterm';
import { IAction } from '../../../../../../../base/common/actions.js';
import { timeout, type MaybePromise } from '../../../../../../../base/common/async.js';
import { CancellationToken } from '../../../../../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../../../../../base/common/event.js';
import { MarkdownString } from '../../../../../../../base/common/htmlContent.js';
import { Disposable, type IDisposable } from '../../../../../../../base/common/lifecycle.js';
import { isObject, isString } from '../../../../../../../base/common/types.js';
import { localize } from '../../../../../../../nls.js';
import { ExtensionIdentifier } from '../../../../../../../platform/extensions/common/extensions.js';
import { IChatWidgetService } from '../../../../../chat/browser/chat.js';
import { ChatElicitationRequestPart } from '../../../../../chat/browser/chatElicitationRequestPart.js';
import { ChatModel } from '../../../../../chat/common/chatModel.js';
import { ElicitationState, IChatService } from '../../../../../chat/common/chatService.js';
import { ChatAgentLocation } from '../../../../../chat/common/constants.js';
import { ChatMessageRole, ILanguageModelsService } from '../../../../../chat/common/languageModels.js';
import { IToolInvocationContext } from '../../../../../chat/common/languageModelToolsService.js';
import { ITaskService } from '../../../../../tasks/common/taskService.js';
import { ILinkLocation } from '../../taskHelpers.js';
import { IConfirmationPrompt, IExecution, IPollingResult, OutputMonitorState, PollingConsts } from './types.js';
import { getTextResponseFromStream } from './utils.js';
import { IConfigurationService } from '../../../../../../../platform/configuration/common/configuration.js';
import { TerminalChatAgentToolsSettingId } from '../../../common/terminalChatAgentToolsConfiguration.js';
import { ILogService } from '../../../../../../../platform/log/common/log.js';
import { ITerminalService } from '../../../../../terminal/browser/terminal.js';
import { LocalChatSessionUri } from '../../../../../chat/common/chatUri.js';

export interface IOutputMonitor extends Disposable {
	readonly pollingResult: IPollingResult & { pollDurationMs: number } | undefined;
	readonly outputMonitorTelemetryCounters: IOutputMonitorTelemetryCounters;

	readonly onDidFinishCommand: Event<void>;
}

export interface IOutputMonitorTelemetryCounters {
	inputToolManualAcceptCount: number;
	inputToolManualRejectCount: number;
	inputToolManualChars: number;
	inputToolAutoAcceptCount: number;
	inputToolAutoChars: number;
	inputToolManualShownCount: number;
	inputToolFreeFormInputShownCount: number;
	inputToolFreeFormInputCount: number;
}

export class OutputMonitor extends Disposable implements IOutputMonitor {
	private _state: OutputMonitorState = OutputMonitorState.PollingForIdle;
	get state(): OutputMonitorState { return this._state; }

	private _lastPromptMarker: XtermMarker | undefined;

	private _lastPrompt: string | undefined;

	private _promptPart: ChatElicitationRequestPart | undefined;

	private _pollingResult: IPollingResult & { pollDurationMs: number } | undefined;
	get pollingResult(): IPollingResult & { pollDurationMs: number } | undefined { return this._pollingResult; }

	private readonly _outputMonitorTelemetryCounters: IOutputMonitorTelemetryCounters = {
		inputToolManualAcceptCount: 0,
		inputToolManualRejectCount: 0,
		inputToolManualChars: 0,
		inputToolAutoAcceptCount: 0,
		inputToolAutoChars: 0,
		inputToolManualShownCount: 0,
		inputToolFreeFormInputShownCount: 0,
		inputToolFreeFormInputCount: 0,
	};
	get outputMonitorTelemetryCounters(): Readonly<IOutputMonitorTelemetryCounters> { return this._outputMonitorTelemetryCounters; }

	private readonly _onDidFinishCommand = this._register(new Emitter<void>());
	readonly onDidFinishCommand: Event<void> = this._onDidFinishCommand.event;

	constructor(
		private readonly _execution: IExecution,
		private readonly _pollFn: ((execution: IExecution, token: CancellationToken, taskService: ITaskService) => Promise<IPollingResult | undefined>) | undefined,
		invocationContext: IToolInvocationContext | undefined,
		token: CancellationToken,
		command: string,
		@ILanguageModelsService private readonly _languageModelsService: ILanguageModelsService,
		@ITaskService private readonly _taskService: ITaskService,
		@IChatService private readonly _chatService: IChatService,
		@IChatWidgetService private readonly _chatWidgetService: IChatWidgetService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@ILogService private readonly _logService: ILogService,
		@ITerminalService private readonly _terminalService: ITerminalService,
	) {
		super();

		// Start async to ensure listeners are set up
		timeout(0).then(() => {
			this._startMonitoring(command, invocationContext, token);
		});
	}

	private async _startMonitoring(
		command: string,
		invocationContext: IToolInvocationContext | undefined,
		token: CancellationToken
	): Promise<void> {
		const pollStartTime = Date.now();

		let modelOutputEvalResponse;
		let resources;
		let output;

		let extended = false;
		try {
			while (!token.isCancellationRequested) {
				switch (this._state) {
					case OutputMonitorState.PollingForIdle: {
						this._state = await this._waitForIdle(this._execution, extended, token);
						continue;
					}
					case OutputMonitorState.Timeout: {
						const shouldContinuePolling = await this._handleTimeoutState(command, invocationContext, extended, token);
						if (shouldContinuePolling) {
							extended = true;
							continue;
						} else {
							this._promptPart?.hide();
							this._promptPart = undefined;
							break;
						}
					}
					case OutputMonitorState.Cancelled:
						break;
					case OutputMonitorState.Idle: {
						const idleResult = await this._handleIdleState(token);
						if (idleResult.shouldContinuePollling) {
							this._state = OutputMonitorState.PollingForIdle;
							continue;
						} else {
							resources = idleResult.resources;
							modelOutputEvalResponse = idleResult.modelOutputEvalResponse;
							output = idleResult.output;
						}
						break;
					}
				}
				if (this._state === OutputMonitorState.Idle || this._state === OutputMonitorState.Cancelled || this._state === OutputMonitorState.Timeout) {
					break;
				}
			}

			if (token.isCancellationRequested) {
				this._state = OutputMonitorState.Cancelled;
			}
		} finally {
			this._pollingResult = {
				state: this._state,
				output: output ?? this._execution.getOutput(),
				modelOutputEvalResponse: token.isCancellationRequested ? 'Cancelled' : modelOutputEvalResponse,
				pollDurationMs: Date.now() - pollStartTime,
				resources
			};
			const promptPart = this._promptPart;
			this._promptPart = undefined;
			if (promptPart) {
				try {
					promptPart.hide();
				} catch (err) {
					this._logService.error('OutputMonitor: Failed to hide prompt', err);
				}
			}
			this._onDidFinishCommand.fire();
		}
	}


	private async _handleIdleState(token: CancellationToken): Promise<{ resources?: ILinkLocation[]; modelOutputEvalResponse?: string; shouldContinuePollling: boolean; output?: string }> {
		const output = this._execution.getOutput(this._lastPromptMarker);

		if (detectsNonInteractiveHelpPattern(output)) {
			return { shouldContinuePollling: false, output };
		}

		const confirmationPrompt = await this._determineUserInputOptions(this._execution, token);

		if (confirmationPrompt?.detectedRequestForFreeFormInput) {
			this._outputMonitorTelemetryCounters.inputToolFreeFormInputShownCount++;
			const receivedTerminalInput = await this._requestFreeFormTerminalInput(token, this._execution, confirmationPrompt);
			if (receivedTerminalInput) {
				// Small delay to ensure input is processed
				await timeout(200);
				// Continue polling as we sent the input
				return { shouldContinuePollling: true };
			} else {
				// User declined
				return { shouldContinuePollling: false };
			}
		}

		if (confirmationPrompt?.options.length) {
			const suggestedOptionResult = await this._selectAndHandleOption(confirmationPrompt, token);
			if (suggestedOptionResult?.sentToTerminal) {
				// Continue polling as we sent the input
				return { shouldContinuePollling: true };
			}
			const confirmed = await this._confirmRunInTerminal(token, suggestedOptionResult?.suggestedOption ?? confirmationPrompt.options[0], this._execution, confirmationPrompt);
			if (confirmed) {
				// Continue polling as we sent the input
				return { shouldContinuePollling: true };
			} else {
				// User declined
				this._execution.instance.focus(true);
				return { shouldContinuePollling: false };
			}
		}

		// Let custom poller override if provided
		const custom = await this._pollFn?.(this._execution, token, this._taskService);
		const resources = custom?.resources;
		const modelOutputEvalResponse = await this._assessOutputForErrors(this._execution.getOutput(), token);
		return { resources, modelOutputEvalResponse, shouldContinuePollling: false, output: custom?.output ?? output };
	}

	private async _handleTimeoutState(command: string, invocationContext: IToolInvocationContext | undefined, extended: boolean, token: CancellationToken): Promise<boolean> {
		let continuePollingPart: ChatElicitationRequestPart | undefined;
		if (extended) {
			this._state = OutputMonitorState.Cancelled;
			return false;
		}
		extended = true;

		const { promise: p, part } = await this._promptForMorePolling(command, token, invocationContext);
		let continuePollingDecisionP: Promise<boolean> | undefined = p;
		continuePollingPart = part;

		// Start another polling pass and race it against the user's decision
		const nextPollP = this._waitForIdle(this._execution, extended, token)
			.catch((): IPollingResult => ({
				state: OutputMonitorState.Cancelled,
				output: this._execution.getOutput(),
				modelOutputEvalResponse: 'Cancelled'
			}));

		const race = await Promise.race([
			continuePollingDecisionP.then(v => ({ kind: 'decision' as const, v })),
			nextPollP.then(r => ({ kind: 'poll' as const, r }))
		]);

		if (race.kind === 'decision') {
			try { continuePollingPart?.hide(); } catch { /* noop */ }
			continuePollingPart = undefined;

			// User explicitly declined to keep waiting, so finish with the timed-out result
			if (race.v === false) {
				this._state = OutputMonitorState.Cancelled;
				return false;
			}

			// User accepted; keep polling (the loop iterates again).
			// Clear the decision so we don't race on a resolved promise.
			continuePollingDecisionP = undefined;
			return true;
		} else {
			// A background poll completed while waiting for a decision
			const r = race.r;
			// r can be either an OutputMonitorState or an IPollingResult object (from catch)
			const state = (typeof r === 'object' && r !== null) ? r.state : r;

			if (state === OutputMonitorState.Idle || state === OutputMonitorState.Cancelled || state === OutputMonitorState.Timeout) {
				try { continuePollingPart?.hide(); } catch { /* noop */ }
				continuePollingPart = undefined;
				continuePollingDecisionP = undefined;
				this._promptPart = undefined;

				return false;
			}

			// Still timing out; loop and race again with the same prompt.
			return true;
		}
	}

	/**
	 * Single bounded polling pass that returns when:
	 *  - terminal becomes inactive/idle, or
	 *  - timeout window elapses.
	 */
	private async _waitForIdle(
		execution: IExecution,
		extendedPolling: boolean,
		token: CancellationToken,
	): Promise<OutputMonitorState> {

		const maxWaitMs = extendedPolling ? PollingConsts.ExtendedPollingMaxDuration : PollingConsts.FirstPollingMaxDuration;
		const maxInterval = PollingConsts.MaxPollingIntervalDuration;
		let currentInterval = PollingConsts.MinPollingDuration;
		let waited = 0;
		let consecutiveIdleEvents = 0;
		let hasReceivedData = false;
		const onDataDisposable = execution.instance.onData((_data) => {
			hasReceivedData = true;
		});

		try {
			while (!token.isCancellationRequested && waited < maxWaitMs) {
				const waitTime = Math.min(currentInterval, maxWaitMs - waited);
				await timeout(waitTime, token);
				waited += waitTime;
				currentInterval = Math.min(currentInterval * 2, maxInterval);
				const currentOutput = execution.getOutput();

				if (detectsNonInteractiveHelpPattern(currentOutput)) {
					this._state = OutputMonitorState.Idle;
					return this._state;
				}

				const promptResult = detectsInputRequiredPattern(currentOutput);
				if (promptResult) {
					this._state = OutputMonitorState.Idle;
					return this._state;
				}

				if (hasReceivedData) {
					consecutiveIdleEvents = 0;
					hasReceivedData = false;
				} else {
					consecutiveIdleEvents++;
				}

				const recentlyIdle = consecutiveIdleEvents >= PollingConsts.MinIdleEvents;
				const isActive = execution.isActive ? await execution.isActive() : undefined;
				this._logService.trace(`OutputMonitor: waitForIdle check: waited=${waited}ms, recentlyIdle=${recentlyIdle}, isActive=${isActive}`);
				if (recentlyIdle && isActive !== true) {
					this._state = OutputMonitorState.Idle;
					return this._state;
				}
			}
		} finally {
			onDataDisposable.dispose();
		}

		if (token.isCancellationRequested) {
			return OutputMonitorState.Cancelled;
		}

		return OutputMonitorState.Timeout;
	}

	private async _promptForMorePolling(command: string, token: CancellationToken, context: IToolInvocationContext | undefined): Promise<{ promise: Promise<boolean>; part?: ChatElicitationRequestPart }> {
		if (token.isCancellationRequested || this._state === OutputMonitorState.Cancelled) {
			return { promise: Promise.resolve(false) };
		}
		const result = this._createElicitationPart<boolean>(
			token,
			context?.sessionId,
			new MarkdownString(localize('poll.terminal.waiting', "Continue waiting for `{0}`?", command)),
			new MarkdownString(localize('poll.terminal.polling', "This will continue to poll for output to determine when the terminal becomes idle for up to 2 minutes.")),
			'',
			localize('poll.terminal.accept', 'Yes'),
			localize('poll.terminal.reject', 'No'),
			async () => true,
			async () => { this._state = OutputMonitorState.Cancelled; return false; }
		);

		return { promise: result.promise.then(p => p ?? false), part: result.part };
	}



	private async _assessOutputForErrors(buffer: string, token: CancellationToken): Promise<string | undefined> {
		const model = await this._getLanguageModel();
		if (!model) {
			return 'No models available';
		}

		const response = await this._languageModelsService.sendChatRequest(
			model,
			new ExtensionIdentifier('core'),
			[{ role: ChatMessageRole.User, content: [{ type: 'text', value: `Evaluate this terminal output to determine if there were errors. If there are errors, return them. Otherwise, return undefined: ${buffer}.` }] }],
			{},
			token
		);

		try {
			const responseFromStream = getTextResponseFromStream(response);
			await Promise.all([response.result, responseFromStream]);
			return await responseFromStream;
		} catch (err) {
			return 'Error occurred ' + err;
		}
	}

	private async _determineUserInputOptions(execution: IExecution, token: CancellationToken): Promise<IConfirmationPrompt | undefined> {
		if (token.isCancellationRequested) {
			return;
		}
		const model = await this._getLanguageModel();
		if (!model) {
			return undefined;
		}
		const lastLines = execution.getOutput(this._lastPromptMarker).trimEnd().split('\n').slice(-15).join('\n');

		if (detectsNonInteractiveHelpPattern(lastLines)) {
			return undefined;
		}

		const promptText =
			`Analyze the following terminal output. If it contains a prompt requesting user input (such as a confirmation, selection, or yes/no question) and that prompt has NOT already been answered, extract the prompt text. The prompt may ask to choose from a set. If so, extract the possible options as a JSON object with keys 'prompt', 'options' (an array of strings or an object with option to description mappings), and 'freeFormInput': false. If no options are provided, and free form input is requested, for example: Password:, return the word freeFormInput. For example, if the options are "[Y] Yes  [A] Yes to All  [N] No  [L] No to All  [C] Cancel", the option to description mappings would be {"Y": "Yes", "A": "Yes to All", "N": "No", "L": "No to All", "C": "Cancel"}. If there is no such prompt, return null. If the option is ambiguous, return null.
			Examples:
			1. Output: "Do you want to overwrite? (y/n)"
				Response: {"prompt": "Do you want to overwrite?", "options": ["y", "n"], "freeFormInput": false}

			2. Output: "Confirm: [Y] Yes  [A] Yes to All  [N] No  [L] No to All  [C] Cancel"
				Response: {"prompt": "Confirm", "options": ["Y", "A", "N", "L", "C"], "freeFormInput": false}

			3. Output: "Accept license terms? (yes/no)"
				Response: {"prompt": "Accept license terms?", "options": ["yes", "no"], "freeFormInput": false}

			4. Output: "Press Enter to continue"
				Response: {"prompt": "Press Enter to continue", "options": ["Enter"], "freeFormInput": false}

			5. Output: "Type Yes to proceed"
				Response: {"prompt": "Type Yes to proceed", "options": ["Yes"], "freeFormInput": false}

			6. Output: "Continue [y/N]"
				Response: {"prompt": "Continue", "options": ["y", "N"], "freeFormInput": false}

			7. Output: "Press any key to close the terminal."
				Response: null

			8. Output: "Terminal will be reused by tasks, press any key to close it."
				Response: null

			9. Output: "Password:"
				Response: {"prompt": "Password:", "freeFormInput": true, "options": []}
			10. Output: "press ctrl-c to detach, ctrl-d to kill"
				Response: null

			Alternatively, the prompt may request free form input, for example:
			1. Output: "Enter your username:"
				Response: {"prompt": "Enter your username:", "freeFormInput": true, "options": []}
			2. Output: "Password:"
				Response: {"prompt": "Password:", "freeFormInput": true, "options": []}
			Now, analyze this output:
			${lastLines}
			`;

		const response = await this._languageModelsService.sendChatRequest(model, new ExtensionIdentifier('core'), [{ role: ChatMessageRole.User, content: [{ type: 'text', value: promptText }] }], {}, token);
		const responseText = await getTextResponseFromStream(response);
		try {
			const match = responseText.match(/\{[\s\S]*\}/);
			if (match) {
				const obj = JSON.parse(match[0]) as unknown;
				if (
					isObject(obj) &&
					'prompt' in obj && isString(obj.prompt) &&
					'options' in obj &&
					'options' in obj &&
					'freeFormInput' in obj && typeof obj.freeFormInput === 'boolean'
				) {
					if (this._lastPrompt === obj.prompt) {
						return;
					}
					if (obj.freeFormInput === true) {
						return { prompt: obj.prompt, options: [], detectedRequestForFreeFormInput: true };
					}
					if (Array.isArray(obj.options) && obj.options.every(isString)) {
						return { prompt: obj.prompt, options: obj.options, detectedRequestForFreeFormInput: obj.freeFormInput };
					} else if (isObject(obj.options) && Object.values(obj.options).every(isString)) {
						const keys = Object.keys(obj.options);
						if (keys.length === 0) {
							return undefined;
						}
						const descriptions = keys.map(key => (obj.options as Record<string, string>)[key]);
						return { prompt: obj.prompt, options: keys, descriptions, detectedRequestForFreeFormInput: obj.freeFormInput };
					}
				}
			}
		} catch (err) {
			console.error('Failed to parse confirmation prompt from language model response:', err);
		}
		return undefined;
	}

	private async _selectAndHandleOption(
		confirmationPrompt: IConfirmationPrompt | undefined,
		token: CancellationToken,
	): Promise<ISuggestedOptionResult | undefined> {
		if (!confirmationPrompt?.options.length) {
			return undefined;
		}
		const model = this._chatWidgetService.getWidgetsByLocations(ChatAgentLocation.Chat)[0]?.input.currentLanguageModel;
		if (!model) {
			return undefined;
		}

		const models = await this._languageModelsService.selectLanguageModels({ vendor: 'copilot', family: model.replaceAll('copilot/', '') });
		if (!models.length) {
			return undefined;
		}
		const prompt = confirmationPrompt.prompt;
		const options = confirmationPrompt.options;

		const currentMarker = this._execution.instance.registerMarker();
		if (!currentMarker) {
			// Unable to register marker, so cannot track prompt location
			return undefined;
		}

		this._lastPromptMarker = currentMarker;
		this._lastPrompt = prompt;

		const promptText = `Given the following confirmation prompt and options from a terminal output, which option is the default?\nPrompt: "${prompt}"\nOptions: ${JSON.stringify(options)}\nRespond with only the option string.`;
		const response = await this._languageModelsService.sendChatRequest(models[0], new ExtensionIdentifier('core'), [
			{ role: ChatMessageRole.User, content: [{ type: 'text', value: promptText }] }
		], {}, token);

		const suggestedOption = (await getTextResponseFromStream(response)).trim();
		if (!suggestedOption) {
			return;
		}
		const parsed = suggestedOption.replace(/['"`]/g, '').trim();
		const index = confirmationPrompt.options.indexOf(parsed);
		const validOption = confirmationPrompt.options.find(opt => parsed === opt.replace(/['"`]/g, '').trim());
		if (!validOption || index === -1) {
			return;
		}
		let sentToTerminal = false;
		if (this._configurationService.getValue(TerminalChatAgentToolsSettingId.AutoReplyToPrompts)) {
			await this._execution.instance.sendText(validOption, true);
			this._outputMonitorTelemetryCounters.inputToolAutoAcceptCount++;
			this._outputMonitorTelemetryCounters.inputToolAutoChars += validOption?.length || 0;
			sentToTerminal = true;
		}
		const description = confirmationPrompt.descriptions?.[index];
		return description ? { suggestedOption: { description, option: validOption }, sentToTerminal } : { suggestedOption: validOption, sentToTerminal };
	}

	private async _requestFreeFormTerminalInput(token: CancellationToken, execution: IExecution, confirmationPrompt: IConfirmationPrompt): Promise<boolean> {
		const focusTerminalSelection = Symbol('focusTerminalSelection');
		const { promise: userPrompt, part } = this._createElicitationPart<boolean | typeof focusTerminalSelection>(
			token,
			execution.sessionId,
			new MarkdownString(localize('poll.terminal.inputRequest', "The terminal is awaiting input.")),
			new MarkdownString(localize('poll.terminal.requireInput', "{0}\nPlease provide the required input to the terminal.\n\n", confirmationPrompt.prompt)),
			'',
			localize('poll.terminal.enterInput', 'Focus terminal'),
			undefined,
			() => {
				this._showInstance(execution.instance.instanceId);
				return focusTerminalSelection;
			}
		);

		let inputDataDisposable: IDisposable = Disposable.None;
		let instanceDisposedDisposable: IDisposable = Disposable.None;
		const inputPromise = new Promise<boolean>(resolve => {
			let settled = false;
			const settle = (value: boolean, state: OutputMonitorState) => {
				if (settled) {
					return;
				}
				settled = true;
				part.hide();
				inputDataDisposable.dispose();
				instanceDisposedDisposable.dispose();
				this._state = state;
				resolve(value);
			};
			inputDataDisposable = this._register(execution.instance.onDidInputData((data) => {
				if (!data || data === '\r' || data === '\n' || data === '\r\n') {
					this._outputMonitorTelemetryCounters.inputToolFreeFormInputCount++;
					settle(true, OutputMonitorState.PollingForIdle);
				}
			}));
			instanceDisposedDisposable = this._register(execution.instance.onDisposed(() => {
				settle(false, OutputMonitorState.Cancelled);
			}));
		});

		const disposeListeners = () => {
			inputDataDisposable.dispose();
			instanceDisposedDisposable.dispose();
		};

		const result = await Promise.race([userPrompt, inputPromise]);
		if (result === focusTerminalSelection) {
			execution.instance.focus(true);
			return await inputPromise;
		}
		if (result === undefined) {
			disposeListeners();
			// Prompt was dismissed without providing input
			return false;
		}
		disposeListeners();
		return !!result;
	}

	private async _confirmRunInTerminal(token: CancellationToken, suggestedOption: SuggestedOption, execution: IExecution, confirmationPrompt: IConfirmationPrompt): Promise<string | boolean | undefined> {
		const suggestedOptionValue = isString(suggestedOption) ? suggestedOption : suggestedOption.option;
		if (suggestedOptionValue === 'any key') {
			return;
		}
		const focusTerminalSelection = Symbol('focusTerminalSelection');
		let inputDataDisposable: IDisposable = Disposable.None;
		let instanceDisposedDisposable: IDisposable = Disposable.None;
		const { promise: userPrompt, part } = this._createElicitationPart<string | boolean | typeof focusTerminalSelection | undefined>(
			token,
			execution.sessionId,
			new MarkdownString(localize('poll.terminal.confirmRequired', "The terminal is awaiting input.")),
			new MarkdownString(localize('poll.terminal.confirmRunDetail', "{0}\n Do you want to send `{1}`{2} followed by `Enter` to the terminal?", confirmationPrompt.prompt, suggestedOptionValue, isString(suggestedOption) ? '' : suggestedOption.description ? ' (' + suggestedOption.description + ')' : '')),
			'',
			localize('poll.terminal.acceptRun', 'Allow'),
			localize('poll.terminal.rejectRun', 'Focus Terminal'),
			async (value: IAction | true) => {
				let option: string | undefined = undefined;
				if (value === true) {
					option = suggestedOptionValue;
				} else if (typeof value === 'object' && 'label' in value) {
					option = value.label.split(' (')[0];
				}
				this._outputMonitorTelemetryCounters.inputToolManualAcceptCount++;
				this._outputMonitorTelemetryCounters.inputToolManualChars += option?.length || 0;
				return option;
			},
			() => {
				this._showInstance(execution.instance.instanceId);
				this._outputMonitorTelemetryCounters.inputToolManualRejectCount++;
				return focusTerminalSelection;
			},
			getMoreActions(suggestedOption, confirmationPrompt)
		);
		const inputPromise = new Promise<boolean>(resolve => {
			let settled = false;
			const settle = (value: boolean, state: OutputMonitorState) => {
				if (settled) {
					return;
				}
				settled = true;
				part.hide();
				inputDataDisposable.dispose();
				instanceDisposedDisposable.dispose();
				this._state = state;
				resolve(value);
			};
			inputDataDisposable = this._register(execution.instance.onDidInputData(() => {
				settle(true, OutputMonitorState.PollingForIdle);
			}));
			instanceDisposedDisposable = this._register(execution.instance.onDisposed(() => {
				settle(false, OutputMonitorState.Cancelled);
			}));
		});

		const disposeListeners = () => {
			inputDataDisposable.dispose();
			instanceDisposedDisposable.dispose();
		};

		const optionToRun = await Promise.race([userPrompt, inputPromise]);
		if (optionToRun === focusTerminalSelection) {
			execution.instance.focus(true);
			return await inputPromise;
		}
		if (optionToRun === true) {
			disposeListeners();
			return true;
		}
		if (typeof optionToRun === 'string' && optionToRun.length) {
			execution.instance.focus(true);
			disposeListeners();
			await execution.instance.sendText(optionToRun, true);
			return optionToRun;
		}
		disposeListeners();
		return optionToRun;
	}

	private _showInstance(instanceId?: number): void {
		if (!instanceId) {
			return;
		}
		const instance = this._terminalService.getInstanceFromId(instanceId);
		if (!instance) {
			return;
		}
		this._terminalService.setActiveInstance(instance);
		this._terminalService.revealActiveTerminal(true);
	}
	// Helper to create, register, and wire a ChatElicitationRequestPart. Returns the promise that
	// resolves when the part is accepted/rejected and the registered part itself so callers can
	// attach additional listeners (e.g., onDidRequestHide) or compose with other promises.
	private _createElicitationPart<T>(
		token: CancellationToken,
		sessionId: string | undefined,
		title: MarkdownString,
		detail: MarkdownString,
		subtitle: string,
		acceptLabel: string,
		rejectLabel?: string,
		onAccept?: (value: IAction | true) => MaybePromise<T | undefined>,
		onReject?: () => MaybePromise<T | undefined>,
		moreActions?: IAction[] | undefined
	): { promise: Promise<T | undefined>; part: ChatElicitationRequestPart } {
		const chatModel = sessionId && this._chatService.getSession(LocalChatSessionUri.forSession(sessionId));
		if (!(chatModel instanceof ChatModel)) {
			throw new Error('No model');
		}
		const request = chatModel.getRequests().at(-1);
		if (!request) {
			throw new Error('No request');
		}
		let part!: ChatElicitationRequestPart;
		const promise = new Promise<T | undefined>(resolve => {
			const thePart = part = this._register(new ChatElicitationRequestPart(
				title,
				detail,
				subtitle,
				acceptLabel,
				rejectLabel,
				async (value: IAction | true) => {
					thePart.hide();
					this._promptPart = undefined;
					try {
						const r = await (onAccept ? onAccept(value) : undefined);
						resolve(r as T | undefined);
					} catch {
						resolve(undefined);
					}

					return ElicitationState.Accepted;
				},
				async () => {
					thePart.hide();
					this._promptPart = undefined;
					try {
						const r = await (onReject ? onReject() : undefined);
						resolve(r as T | undefined);
					} catch {
						resolve(undefined);
					}

					return ElicitationState.Rejected;
				},
				undefined, // source
				moreActions,
				() => this._outputMonitorTelemetryCounters.inputToolManualShownCount++
			));

			chatModel.acceptResponseProgress(request, thePart);
			this._promptPart = thePart;
		});

		this._register(token.onCancellationRequested(() => part.hide()));

		return { promise, part };
	}

	private async _getLanguageModel(): Promise<string | undefined> {
		let models = await this._languageModelsService.selectLanguageModels({ vendor: 'copilot', id: 'copilot-fast' });

		// Fallback to gpt-4o-mini if copilot-fast is not available for backwards compatibility
		if (!models.length) {
			models = await this._languageModelsService.selectLanguageModels({ vendor: 'copilot', family: 'gpt-4o-mini' });
		}

		return models.length ? models[0] : undefined;
	}
}

function getMoreActions(suggestedOption: SuggestedOption, confirmationPrompt: IConfirmationPrompt): IAction[] | undefined {
	const moreActions: IAction[] = [];
	const moreOptions = confirmationPrompt.options.filter(a => a !== (isString(suggestedOption) ? suggestedOption : suggestedOption.option));
	let i = 0;
	for (const option of moreOptions) {
		const label = option + (confirmationPrompt.descriptions ? ' (' + confirmationPrompt.descriptions[i] + ')' : '');
		const action = {
			label,
			tooltip: label,
			id: `terminal.poll.send.${option}`,
			class: undefined,
			enabled: true,
			run: async () => { }
		};
		i++;
		moreActions.push(action);
	}
	return moreActions.length ? moreActions : undefined;
}

type SuggestedOption = string | { description: string; option: string };
interface ISuggestedOptionResult {
	suggestedOption?: SuggestedOption;
	sentToTerminal?: boolean;
}

export function detectsInputRequiredPattern(cursorLine: string): boolean {
	return [
		// PowerShell-style multi-option line (supports [?] Help and optional default suffix) ending
		// in whitespace
		/\s*(?:\[[^\]]\]\s+[^\[\s][^\[]*\s*)+(?:\(default is\s+"[^"]+"\):)?\s+$/,
		// Bracketed/parenthesized yes/no pairs at end of line: (y/n), [Y/n], (yes/no), [no/yes]
		/(?:\(|\[)\s*(?:y(?:es)?\s*\/\s*n(?:o)?|n(?:o)?\s*\/\s*y(?:es)?)\s*(?:\]|\))\s+$/i,
		// Same as above but allows a preceding '?' or ':' and optional wrappers e.g.
		// "Continue? (y/n)" or "Overwrite: [yes/no]"
		/[?:]\s*(?:\(|\[)?\s*y(?:es)?\s*\/\s*n(?:o)?\s*(?:\]|\))?\s+$/i,
		// Confirmation prompts ending with (y) e.g. "Ok to proceed? (y)"
		/\(y\)\s*$/i,
		// Line ends with ':'
		/:\s*$/,
		// Line contains (END) which is common in pagers
		/\(END\)$/,
		// Password prompt
		/password[:]?$/i,
		// Line ends with '?'
		/\?\s*(?:\([a-z\s]+\))?$/i,
		// "Press a key" or "Press any key"
		/press a(?:ny)? key/i,
	].some(e => e.test(cursorLine));
}

export function detectsNonInteractiveHelpPattern(cursorLine: string): boolean {
	return [
		/press [h?]\s*(?:\+\s*enter)?\s*to (?:show|open|display|get|see)\s*(?:available )?(?:help|commands|options)/i,
		/press h\s*(?:or\s*\?)?\s*(?:\+\s*enter)?\s*for (?:help|commands|options)/i,
		/press \?\s*(?:\+\s*enter)?\s*(?:to|for)?\s*(?:help|commands|options|list)/i,
		/type\s*[h?]\s*(?:\+\s*enter)?\s*(?:for|to see|to show)\s*(?:help|commands|options)/i,
		/hit\s*[h?]\s*(?:\+\s*enter)?\s*(?:for|to see|to show)\s*(?:help|commands|options)/i,
		/press o\s*(?:\+\s*enter)?\s*(?:to|for)?\s*(?:open|launch)(?:\s*(?:the )?(?:app|application|browser)|\s+in\s+(?:the\s+)?browser)?/i,
		/press r\s*(?:\+\s*enter)?\s*(?:to|for)?\s*(?:restart|reload|refresh)(?:\s*(?:the )?(?:server|dev server|service))?/i,
		/press q\s*(?:\+\s*enter)?\s*(?:to|for)?\s*(?:quit|exit|stop)(?:\s*(?:the )?(?:server|app|process))?/i,
		/press u\s*(?:\+\s*enter)?\s*(?:to|for)?\s*(?:show|print|display)\s*(?:the )?(?:server )?urls?/i
	].some(e => e.test(cursorLine));
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/tools/monitoring/types.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/tools/monitoring/types.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { Task } from '../../../../../tasks/common/taskService.js';
import type { ITerminalInstance } from '../../../../../terminal/browser/terminal.js';
import type { ILinkLocation } from '../../taskHelpers.js';
import type { IMarker as XtermMarker } from '@xterm/xterm';

export interface IConfirmationPrompt {
	prompt: string;
	options: string[];
	descriptions?: string[];
	detectedRequestForFreeFormInput: boolean;
}

export interface IExecution {
	getOutput: (marker?: XtermMarker) => string;
	isActive?: () => Promise<boolean>;
	task?: Task | Pick<Task, 'configurationProperties'>;
	dependencyTasks?: Task[];
	instance: Pick<ITerminalInstance, 'sendText' | 'instanceId' | 'onDidInputData' | 'onDisposed' | 'onData' | 'focus' | 'registerMarker'>;
	sessionId: string | undefined;
}

export interface IPollingResult {
	output: string;
	resources?: ILinkLocation[];
	modelOutputEvalResponse?: string;
	state: OutputMonitorState;
}

export enum OutputMonitorState {
	Initial = 'Initial',
	Idle = 'Idle',
	PollingForIdle = 'PollingForIdle',
	Prompting = 'Prompting',
	Timeout = 'Timeout',
	Active = 'Active',
	Cancelled = 'Cancelled',
}

export interface IRacePollingOrPromptResult {
	output: string;
	pollDurationMs?: number;
	modelOutputEvalResponse?: string;
	state: OutputMonitorState;
}

export const enum PollingConsts {
	MinIdleEvents = 2, // Minimum number of idle checks before considering the terminal idle
	MinPollingDuration = 500,
	FirstPollingMaxDuration = 20000, // 20 seconds
	ExtendedPollingMaxDuration = 120000, // 2 minutes
	MaxPollingIntervalDuration = 2000, // 2 seconds
	MaxRecursionCount = 5
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/tools/monitoring/utils.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/tools/monitoring/utils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ILanguageModelChatResponse } from '../../../../../chat/common/languageModels.js';

export async function getTextResponseFromStream(response: ILanguageModelChatResponse): Promise<string> {
	let responseText = '';
	const streaming = (async () => {
		if (!response || !response.stream) {
			return;
		}
		for await (const part of response.stream) {
			if (Array.isArray(part)) {
				for (const p of part) {
					if (p.type === 'text') {
						responseText += p.value;
					}
				}
			} else if (part.type === 'text') {
				responseText += part.value;
			}
		}
	})();

	try {
		await Promise.all([response.result, streaming]);
		return responseText;
	} catch (err) {
		return 'Error occurred ' + err;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/tools/task/createAndRunTaskTool.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/tools/task/createAndRunTaskTool.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { timeout } from '../../../../../../../base/common/async.js';
import { CancellationToken } from '../../../../../../../base/common/cancellation.js';
import { localize } from '../../../../../../../nls.js';
import { ITelemetryService } from '../../../../../../../platform/telemetry/common/telemetry.js';
import { CountTokensCallback, IPreparedToolInvocation, IToolData, IToolImpl, IToolInvocation, IToolInvocationPreparationContext, IToolResult, ToolDataSource, ToolProgress } from '../../../../../chat/common/languageModelToolsService.js';
import { ITaskService, ITaskSummary, Task } from '../../../../../tasks/common/taskService.js';
import { TaskRunSource } from '../../../../../tasks/common/tasks.js';
import { ITerminalInstance, ITerminalService } from '../../../../../terminal/browser/terminal.js';
import { collectTerminalResults, IConfiguredTask, resolveDependencyTasks, tasksMatch } from '../../taskHelpers.js';
import { MarkdownString } from '../../../../../../../base/common/htmlContent.js';
import { URI } from '../../../../../../../base/common/uri.js';
import { IFileService } from '../../../../../../../platform/files/common/files.js';
import { VSBuffer } from '../../../../../../../base/common/buffer.js';
import { IConfigurationService } from '../../../../../../../platform/configuration/common/configuration.js';
import { toolResultDetailsFromResponse, toolResultMessageFromResponse } from './taskHelpers.js';
import { IInstantiationService } from '../../../../../../../platform/instantiation/common/instantiation.js';
import { DisposableStore } from '../../../../../../../base/common/lifecycle.js';
import { TaskToolEvent, TaskToolClassification } from './taskToolsTelemetry.js';

interface ICreateAndRunTaskToolInput {
	workspaceFolder: string;
	task: {
		label: string;
		type: string;
		command: string;
		args?: string[];
		isBackground?: boolean;
		problemMatcher?: string[];
		group?: string;
	};
}

export class CreateAndRunTaskTool implements IToolImpl {

	constructor(
		@ITaskService private readonly _tasksService: ITaskService,
		@ITelemetryService private readonly _telemetryService: ITelemetryService,
		@ITerminalService private readonly _terminalService: ITerminalService,
		@IFileService private readonly _fileService: IFileService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService
	) { }

	async invoke(invocation: IToolInvocation, _countTokens: CountTokensCallback, _progress: ToolProgress, token: CancellationToken): Promise<IToolResult> {
		const args = invocation.parameters as ICreateAndRunTaskToolInput;

		if (!invocation.context) {
			return { content: [{ kind: 'text', value: `No invocation context` }], toolResultMessage: `No invocation context` };
		}

		const tasksJsonUri = URI.file(args.workspaceFolder).with({ path: `${args.workspaceFolder}/.vscode/tasks.json` });
		const exists = await this._fileService.exists(tasksJsonUri);

		const newTask: IConfiguredTask = {
			label: args.task.label,
			type: args.task.type,
			command: args.task.command,
			args: args.task.args,
			isBackground: args.task.isBackground,
			problemMatcher: args.task.problemMatcher,
			group: args.task.group
		};

		const tasksJsonContent = JSON.stringify({
			version: '2.0.0',
			tasks: [newTask]
		}, null, '\t');
		if (!exists) {
			await this._fileService.createFile(tasksJsonUri, VSBuffer.fromString(tasksJsonContent), { overwrite: true });
			_progress.report({ message: 'Created tasks.json file' });
		} else {
			// add to the existing tasks.json file
			const content = await this._fileService.readFile(tasksJsonUri);
			const tasksJson = JSON.parse(content.value.toString());
			tasksJson.tasks.push(newTask);
			await this._fileService.writeFile(tasksJsonUri, VSBuffer.fromString(JSON.stringify(tasksJson, null, '\t')));
			_progress.report({ message: 'Updated tasks.json file' });
		}
		_progress.report({ message: new MarkdownString(localize('copilotChat.fetchingTask', 'Resolving the task')) });

		let task: Task | undefined;
		const start = Date.now();
		while (Date.now() - start < 5000 && !token.isCancellationRequested) {
			task = (await this._tasksService.tasks())?.find(t => t._label === args.task.label);
			if (task) {
				break;
			}
			await timeout(100);
		}
		if (!task) {
			return { content: [{ kind: 'text', value: `Task not found: ${args.task.label}` }], toolResultMessage: new MarkdownString(localize('copilotChat.taskNotFound', 'Task not found: `{0}`', args.task.label)) };
		}

		_progress.report({ message: new MarkdownString(localize('copilotChat.runningTask', 'Running task `{0}`', args.task.label)) });
		const raceResult = await Promise.race([this._tasksService.run(task, undefined, TaskRunSource.ChatAgent), timeout(3000)]);
		const result: ITaskSummary | undefined = raceResult && typeof raceResult === 'object' ? raceResult as ITaskSummary : undefined;

		const dependencyTasks = await resolveDependencyTasks(task, args.workspaceFolder, this._configurationService, this._tasksService);
		const resources = this._tasksService.getTerminalsForTasks(dependencyTasks ?? task);
		const terminals = resources?.map(resource => this._terminalService.instances.find(t => t.resource.path === resource?.path && t.resource.scheme === resource.scheme)).filter(Boolean) as ITerminalInstance[];
		if (!terminals || terminals.length === 0) {
			return { content: [{ kind: 'text', value: `Task started but no terminal was found for: ${args.task.label}` }], toolResultMessage: new MarkdownString(localize('copilotChat.noTerminal', 'Task started but no terminal was found for: `{0}`', args.task.label)) };
		}
		const store = new DisposableStore();
		const terminalResults = await collectTerminalResults(
			terminals,
			task,
			this._instantiationService,
			invocation.context!,
			_progress,
			token,
			store,
			(terminalTask) => this._isTaskActive(terminalTask),
			dependencyTasks,
			this._tasksService
		);
		store.dispose();
		for (const r of terminalResults) {
			this._telemetryService.publicLog2?.<TaskToolEvent, TaskToolClassification>('copilotChat.runTaskTool.createAndRunTask', {
				taskId: args.task.label,
				bufferLength: r.output.length ?? 0,
				pollDurationMs: r.pollDurationMs ?? 0,
				inputToolManualAcceptCount: r.inputToolManualAcceptCount ?? 0,
				inputToolManualRejectCount: r.inputToolManualRejectCount ?? 0,
				inputToolManualChars: r.inputToolManualChars ?? 0,
				inputToolManualShownCount: r.inputToolManualShownCount ?? 0,
				inputToolFreeFormInputCount: r.inputToolFreeFormInputCount ?? 0,
				inputToolFreeFormInputShownCount: r.inputToolFreeFormInputShownCount ?? 0
			});
		}

		const details = terminalResults.map(r => `Terminal: ${r.name}\nOutput:\n${r.output}`);
		const uniqueDetails = Array.from(new Set(details)).join('\n\n');
		const toolResultDetails = toolResultDetailsFromResponse(terminalResults);
		const toolResultMessage = toolResultMessageFromResponse(result, args.task.label, toolResultDetails, terminalResults, undefined, task.configurationProperties.isBackground);
		return {
			content: [{ kind: 'text', value: uniqueDetails }],
			toolResultMessage,
			toolResultDetails
		};
	}

	private async _isTaskActive(task: Task): Promise<boolean> {
		const busyTasks = await this._tasksService.getBusyTasks();
		return busyTasks?.some(t => tasksMatch(t, task)) ?? false;
	}

	async prepareToolInvocation(context: IToolInvocationPreparationContext, token: CancellationToken): Promise<IPreparedToolInvocation | undefined> {
		const args = context.parameters as ICreateAndRunTaskToolInput;
		const task = args.task;

		const allTasks = await this._tasksService.tasks();
		if (allTasks?.find(t => t._label === task.label)) {
			return {
				invocationMessage: new MarkdownString(localize('taskExists', 'Task `{0}` already exists.', task.label)),
				pastTenseMessage: new MarkdownString(localize('taskExistsPast', 'Task `{0}` already exists.', task.label)),
				confirmationMessages: undefined
			};
		}

		const activeTasks = await this._tasksService.getActiveTasks();
		if (activeTasks.find(t => t._label === task.label)) {
			return {
				invocationMessage: new MarkdownString(localize('alreadyRunning', 'Task \`{0}\` is already running.', task.label)),
				pastTenseMessage: new MarkdownString(localize('alreadyRunning', 'Task \`{0}\` is already running.', task.label)),
				confirmationMessages: undefined
			};
		}

		return {
			invocationMessage: new MarkdownString(localize('createdTask', 'Created task \`{0}\`', task.label)),
			pastTenseMessage: new MarkdownString(localize('createdTaskPast', 'Created task \`{0}\`', task.label)),
			confirmationMessages: {
				title: localize('allowTaskCreationExecution', 'Allow task creation and execution?'),
				message: new MarkdownString(
					localize(
						'createTask',
						'A task \`{0}\` with command \`{1}\`{2} will be created.',
						task.label,
						task.command,
						task.args?.length ? ` and args \`${task.args.join(' ')}\`` : ''
					)
				)
			}
		};
	}
}

export const CreateAndRunTaskToolData: IToolData = {
	id: 'create_and_run_task',
	toolReferenceName: 'createAndRunTask',
	legacyToolReferenceFullNames: ['runTasks/createAndRunTask'],
	displayName: localize('createAndRunTask.displayName', 'Create and run Task'),
	modelDescription: 'Creates and runs a build, run, or custom task for the workspace by generating or adding to a tasks.json file based on the project structure (such as package.json or README.md). If the user asks to build, run, launch and they have no tasks.json file, use this tool. If they ask to create or add a task, use this tool.',
	userDescription: localize('createAndRunTask.userDescription', "Create and run a task in the workspace"),
	source: ToolDataSource.Internal,
	inputSchema: {
		'type': 'object',
		'properties': {
			'workspaceFolder': {
				'type': 'string',
				'description': 'The absolute path of the workspace folder where the tasks.json file will be created.'
			},
			'task': {
				'type': 'object',
				'description': 'The task to add to the new tasks.json file.',
				'properties': {
					'label': {
						'type': 'string',
						'description': 'The label of the task.'
					},
					'type': {
						'type': 'string',
						'description': `The type of the task. The only supported value is 'shell'.`,
						'enum': [
							'shell'
						]
					},
					'command': {
						'type': 'string',
						'description': 'The shell command to run for the task. Use this to specify commands for building or running the application.'
					},
					'args': {
						'type': 'array',
						'description': 'The arguments to pass to the command.',
						'items': {
							'type': 'string'
						}
					},
					'isBackground': {
						'type': 'boolean',
						'description': 'Whether the task runs in the background without blocking the UI or other tasks. Set to true for long-running processes like watch tasks or servers that should continue executing without requiring user attention. When false, the task will block the terminal until completion.'
					},
					'problemMatcher': {
						'type': 'array',
						'description': `The problem matcher to use to parse task output for errors and warnings. Can be a predefined matcher like '$tsc' (TypeScript), '$eslint - stylish', '$gcc', etc., or a custom pattern defined in tasks.json. This helps VS Code display errors in the Problems panel and enables quick navigation to error locations.`,
						'items': {
							'type': 'string'
						}
					},
					'group': {
						'type': 'string',
						'description': 'The group to which the task belongs.'
					}
				},
				'required': [
					'label',
					'type',
					'command'
				]
			}
		},
		'required': [
			'task',
			'workspaceFolder'
		]
	},
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/tools/task/getTaskOutputTool.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/tools/task/getTaskOutputTool.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { CancellationToken } from '../../../../../../../base/common/cancellation.js';
import { MarkdownString } from '../../../../../../../base/common/htmlContent.js';
import { Disposable, DisposableStore } from '../../../../../../../base/common/lifecycle.js';
import { localize } from '../../../../../../../nls.js';
import { IConfigurationService } from '../../../../../../../platform/configuration/common/configuration.js';
import { IInstantiationService } from '../../../../../../../platform/instantiation/common/instantiation.js';
import { ITelemetryService } from '../../../../../../../platform/telemetry/common/telemetry.js';
import { ToolDataSource, type CountTokensCallback, type IPreparedToolInvocation, type IToolData, type IToolImpl, type IToolInvocation, type IToolInvocationPreparationContext, type IToolResult, type ToolProgress } from '../../../../../chat/common/languageModelToolsService.js';
import { ITaskService, Task, TasksAvailableContext } from '../../../../../tasks/common/taskService.js';
import { ITerminalService } from '../../../../../terminal/browser/terminal.js';
import { collectTerminalResults, getTaskDefinition, getTaskForTool, resolveDependencyTasks, tasksMatch } from '../../taskHelpers.js';
import { toolResultDetailsFromResponse, toolResultMessageFromResponse } from './taskHelpers.js';
import { TaskToolEvent, TaskToolClassification } from './taskToolsTelemetry.js';

export const GetTaskOutputToolData: IToolData = {
	id: 'get_task_output',
	toolReferenceName: 'getTaskOutput',
	legacyToolReferenceFullNames: ['runTasks/getTaskOutput'],
	displayName: localize('getTaskOutputTool.displayName', 'Get Task Output'),
	modelDescription: 'Get the output of a task',
	source: ToolDataSource.Internal,
	when: TasksAvailableContext,
	inputSchema: {
		type: 'object',
		properties: {
			id: {
				type: 'string',
				description: 'The task ID for which to get the output.'
			},
			workspaceFolder: {
				type: 'string',
				description: 'The workspace folder path containing the task'
			},
		},
		required: [
			'id',
			'workspaceFolder'
		]
	}
};

export interface IGetTaskOutputInputParams {
	id: string;
	workspaceFolder: string;
}

export class GetTaskOutputTool extends Disposable implements IToolImpl {
	constructor(
		@ITaskService private readonly _tasksService: ITaskService,
		@ITerminalService private readonly _terminalService: ITerminalService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@ITelemetryService private readonly _telemetryService: ITelemetryService
	) {
		super();
	}
	async prepareToolInvocation(context: IToolInvocationPreparationContext, token: CancellationToken): Promise<IPreparedToolInvocation | undefined> {
		const args = context.parameters as IGetTaskOutputInputParams;

		const taskDefinition = getTaskDefinition(args.id);
		const task = await getTaskForTool(args.id, taskDefinition, args.workspaceFolder, this._configurationService, this._tasksService, true);
		if (!task) {
			return { invocationMessage: new MarkdownString(localize('copilotChat.taskNotFound', 'Task not found: `{0}`', args.id)) };
		}
		const taskLabel = task._label;
		const activeTasks = await this._tasksService.getActiveTasks();
		if (activeTasks.includes(task)) {
			return { invocationMessage: new MarkdownString(localize('copilotChat.taskAlreadyRunning', 'The task `{0}` is already running.', taskLabel)) };
		}

		return {
			invocationMessage: new MarkdownString(localize('copilotChat.checkingTerminalOutput', 'Checking output for task `{0}`', taskLabel)),
			pastTenseMessage: new MarkdownString(localize('copilotChat.checkedTerminalOutput', 'Checked output for task `{0}`', taskLabel)),
		};
	}

	async invoke(invocation: IToolInvocation, _countTokens: CountTokensCallback, _progress: ToolProgress, token: CancellationToken): Promise<IToolResult> {
		const args = invocation.parameters as IGetTaskOutputInputParams;
		const taskDefinition = getTaskDefinition(args.id);
		const task = await getTaskForTool(args.id, taskDefinition, args.workspaceFolder, this._configurationService, this._tasksService, true);
		if (!task) {
			return { content: [{ kind: 'text', value: `Task not found: ${args.id}` }], toolResultMessage: new MarkdownString(localize('copilotChat.taskNotFound', 'Task not found: `{0}`', args.id)) };
		}

		const dependencyTasks = await resolveDependencyTasks(task, args.workspaceFolder, this._configurationService, this._tasksService);
		const resources = this._tasksService.getTerminalsForTasks(dependencyTasks ?? task);
		const taskLabel = task._label;
		const terminals = resources?.map(resource => this._terminalService.instances.find(t => t.resource.path === resource?.path && t.resource.scheme === resource.scheme)).filter(t => !!t);
		if (!terminals || terminals.length === 0) {
			return { content: [{ kind: 'text', value: `Terminal not found for task ${taskLabel}` }], toolResultMessage: new MarkdownString(localize('copilotChat.terminalNotFound', 'Terminal not found for task `{0}`', taskLabel)) };
		}
		const store = new DisposableStore();
		const terminalResults = await collectTerminalResults(
			terminals,
			task,
			this._instantiationService,
			invocation.context!,
			_progress,
			token,
			store,
			(terminalTask) => this._isTaskActive(terminalTask),
			dependencyTasks,
			this._tasksService
		);
		store.dispose();
		for (const r of terminalResults) {
			this._telemetryService.publicLog2?.<TaskToolEvent, TaskToolClassification>('copilotChat.getTaskOutputTool.get', {
				taskId: args.id,
				bufferLength: r.output.length ?? 0,
				pollDurationMs: r.pollDurationMs ?? 0,
				inputToolManualAcceptCount: r.inputToolManualAcceptCount ?? 0,
				inputToolManualRejectCount: r.inputToolManualRejectCount ?? 0,
				inputToolManualChars: r.inputToolManualChars ?? 0,
				inputToolManualShownCount: r.inputToolManualShownCount ?? 0,
				inputToolFreeFormInputCount: r.inputToolFreeFormInputCount ?? 0,
				inputToolFreeFormInputShownCount: r.inputToolFreeFormInputShownCount ?? 0
			});
		}
		const details = terminalResults.map(r => `Terminal: ${r.name}\nOutput:\n${r.output}`);
		const uniqueDetails = Array.from(new Set(details)).join('\n\n');
		const toolResultDetails = toolResultDetailsFromResponse(terminalResults);
		const toolResultMessage = toolResultMessageFromResponse(undefined, taskLabel, toolResultDetails, terminalResults, true, task.configurationProperties.isBackground);

		return {
			content: [{ kind: 'text', value: uniqueDetails }],
			toolResultMessage,
			toolResultDetails
		};
	}
	private async _isTaskActive(task: Task): Promise<boolean> {
		const busyTasks = await this._tasksService.getBusyTasks();
		return busyTasks?.some(t => tasksMatch(t, task)) ?? false;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/tools/task/runTaskTool.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/tools/task/runTaskTool.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { timeout } from '../../../../../../../base/common/async.js';
import { CancellationToken } from '../../../../../../../base/common/cancellation.js';
import { localize } from '../../../../../../../nls.js';
import { ITelemetryService } from '../../../../../../../platform/telemetry/common/telemetry.js';
import { CountTokensCallback, IPreparedToolInvocation, IToolData, IToolImpl, IToolInvocation, IToolInvocationPreparationContext, IToolResult, ToolDataSource, ToolProgress } from '../../../../../chat/common/languageModelToolsService.js';
import { ITaskService, ITaskSummary, Task, TasksAvailableContext } from '../../../../../tasks/common/taskService.js';
import { TaskRunSource } from '../../../../../tasks/common/tasks.js';
import { ITerminalService } from '../../../../../terminal/browser/terminal.js';
import { collectTerminalResults, getTaskDefinition, getTaskForTool, resolveDependencyTasks, tasksMatch } from '../../taskHelpers.js';
import { MarkdownString } from '../../../../../../../base/common/htmlContent.js';
import { IConfigurationService } from '../../../../../../../platform/configuration/common/configuration.js';
import { Codicon } from '../../../../../../../base/common/codicons.js';
import { toolResultDetailsFromResponse, toolResultMessageFromResponse } from './taskHelpers.js';
import { IInstantiationService } from '../../../../../../../platform/instantiation/common/instantiation.js';
import { DisposableStore } from '../../../../../../../base/common/lifecycle.js';
import { TaskToolClassification, TaskToolEvent } from './taskToolsTelemetry.js';

interface IRunTaskToolInput extends IToolInvocation {
	id: string;
	workspaceFolder: string;
}

export class RunTaskTool implements IToolImpl {

	constructor(
		@ITaskService private readonly _tasksService: ITaskService,
		@ITelemetryService private readonly _telemetryService: ITelemetryService,
		@ITerminalService private readonly _terminalService: ITerminalService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService
	) { }

	async invoke(invocation: IToolInvocation, _countTokens: CountTokensCallback, _progress: ToolProgress, token: CancellationToken): Promise<IToolResult> {
		const args = invocation.parameters as IRunTaskToolInput;

		if (!invocation.context) {
			return { content: [{ kind: 'text', value: `No invocation context` }], toolResultMessage: `No invocation context` };
		}

		const taskDefinition = getTaskDefinition(args.id);
		const task = await getTaskForTool(args.id, taskDefinition, args.workspaceFolder, this._configurationService, this._tasksService, true);
		if (!task) {
			return { content: [{ kind: 'text', value: `Task not found: ${args.id}` }], toolResultMessage: new MarkdownString(localize('chat.taskNotFound', 'Task not found: `{0}`', args.id)) };
		}
		const taskLabel = task._label;
		const activeTasks = await this._tasksService.getActiveTasks();
		if (activeTasks.includes(task)) {
			return { content: [{ kind: 'text', value: `The task ${taskLabel} is already running.` }], toolResultMessage: new MarkdownString(localize('chat.taskAlreadyRunning', 'The task `{0}` is already running.', taskLabel)) };
		}

		const raceResult = await Promise.race([this._tasksService.run(task, undefined, TaskRunSource.ChatAgent), timeout(3000)]);
		const result: ITaskSummary | undefined = raceResult && typeof raceResult === 'object' ? raceResult as ITaskSummary : undefined;

		const dependencyTasks = await resolveDependencyTasks(task, args.workspaceFolder, this._configurationService, this._tasksService);
		const resources = this._tasksService.getTerminalsForTasks(dependencyTasks ?? task);
		if (!resources || resources.length === 0) {
			return { content: [{ kind: 'text', value: `Task started but no terminal was found for: ${taskLabel}` }], toolResultMessage: new MarkdownString(localize('chat.noTerminal', 'Task started but no terminal was found for: `{0}`', taskLabel)) };
		}
		const terminals = this._terminalService.instances.filter(t => resources.some(r => r.path === t.resource.path && r.scheme === t.resource.scheme));
		if (terminals.length === 0) {
			return { content: [{ kind: 'text', value: `Task started but no terminal was found for: ${taskLabel}` }], toolResultMessage: new MarkdownString(localize('chat.noTerminal', 'Task started but no terminal was found for: `{0}`', taskLabel)) };
		}

		const store = new DisposableStore();
		const terminalResults = await collectTerminalResults(
			terminals,
			task,
			this._instantiationService,
			invocation.context!,
			_progress,
			token,
			store,
			(terminalTask) => this._isTaskActive(terminalTask),
			dependencyTasks,
			this._tasksService
		);
		store.dispose();
		for (const r of terminalResults) {
			this._telemetryService.publicLog2?.<TaskToolEvent, TaskToolClassification>('copilotChat.runTaskTool.run', {
				taskId: args.id,
				bufferLength: r.output.length ?? 0,
				pollDurationMs: r.pollDurationMs ?? 0,
				inputToolManualAcceptCount: r.inputToolManualAcceptCount ?? 0,
				inputToolManualRejectCount: r.inputToolManualRejectCount ?? 0,
				inputToolManualChars: r.inputToolManualChars ?? 0,
				inputToolManualShownCount: r.inputToolManualShownCount ?? 0,
				inputToolFreeFormInputShownCount: r.inputToolFreeFormInputShownCount ?? 0,
				inputToolFreeFormInputCount: r.inputToolFreeFormInputCount ?? 0
			});
		}

		const details = terminalResults.map(r => `Terminal: ${r.name}\nOutput:\n${r.output}`);
		const uniqueDetails = Array.from(new Set(details)).join('\n\n');
		const toolResultDetails = toolResultDetailsFromResponse(terminalResults);
		const toolResultMessage = toolResultMessageFromResponse(result, taskLabel, toolResultDetails, terminalResults, undefined, task.configurationProperties.isBackground);

		return {
			content: [{ kind: 'text', value: uniqueDetails }],
			toolResultMessage,
			toolResultDetails
		};
	}

	private async _isTaskActive(task: Task): Promise<boolean> {
		const busyTasks = await this._tasksService.getBusyTasks();
		return busyTasks?.some(t => tasksMatch(t, task)) ?? false;
	}

	async prepareToolInvocation(context: IToolInvocationPreparationContext, token: CancellationToken): Promise<IPreparedToolInvocation | undefined> {
		const args = context.parameters as IRunTaskToolInput;
		const taskDefinition = getTaskDefinition(args.id);

		const task = await getTaskForTool(args.id, taskDefinition, args.workspaceFolder, this._configurationService, this._tasksService, true);
		if (!task) {
			return { invocationMessage: new MarkdownString(localize('chat.taskNotFound', 'Task not found: `{0}`', args.id)) };
		}
		const taskLabel = task._label;
		const activeTasks = await this._tasksService.getActiveTasks();
		if (task && activeTasks.includes(task)) {
			return { invocationMessage: new MarkdownString(localize('chat.taskAlreadyActive', 'The task is already running.')) };
		}

		if (await this._isTaskActive(task)) {
			return {
				invocationMessage: new MarkdownString(localize('chat.taskIsAlreadyRunning', '`{0}` is already running.', taskLabel)),
				pastTenseMessage: new MarkdownString(localize('chat.taskWasAlreadyRunning', '`{0}` was already running.', taskLabel)),
				confirmationMessages: undefined
			};
		}

		return {
			invocationMessage: new MarkdownString(localize('chat.runningTask', 'Running `{0}`', taskLabel)),
			pastTenseMessage: new MarkdownString(task?.configurationProperties.isBackground
				? localize('chat.startedTask', 'Started `{0}`', taskLabel)
				: localize('chat.ranTask', 'Ran `{0}`', taskLabel)),
			confirmationMessages: task
				? { title: localize('chat.allowTaskRunTitle', 'Allow task run?'), message: localize('chat.allowTaskRunMsg', 'Allow to run the task `{0}`?', taskLabel) }
				: undefined
		};
	}
}

export const RunTaskToolData: IToolData = {
	id: 'run_task',
	toolReferenceName: 'runTask',
	legacyToolReferenceFullNames: ['runTasks/runTask'],
	displayName: localize('runInTerminalTool.displayName', 'Run Task'),
	modelDescription: 'Runs a VS Code task.\n\n- If you see that an appropriate task exists for building or running code, prefer to use this tool to run the task instead of using the run_in_terminal tool.\n- Make sure that any appropriate build or watch task is running before trying to run tests or execute code.\n- If the user asks to run a task, use this tool to do so.',
	userDescription: localize('runInTerminalTool.userDescription', 'Run tasks in the workspace'),
	icon: Codicon.tools,
	source: ToolDataSource.Internal,
	when: TasksAvailableContext,
	inputSchema: {
		'type': 'object',
		'properties': {
			'workspaceFolder': {
				'type': 'string',
				'description': 'The workspace folder path containing the task'
			},
			'id': {
				'type': 'string',
				'description': 'The task ID to run.'
			}
		},
		'required': [
			'workspaceFolder',
			'id'
		]
	}
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/tools/task/taskHelpers.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/tools/task/taskHelpers.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../../../../base/common/uri.js';
import { Location } from '../../../../../../../editor/common/languages.js';
import { Range } from '../../../../../../../editor/common/core/range.js';
import { ITaskSummary } from '../../../../../tasks/common/taskService.js';
import { localize } from '../../../../../../../nls.js';
import { OutputMonitorState } from '../monitoring/types.js';
import { MarkdownString } from '../../../../../../../base/common/htmlContent.js';

export function toolResultDetailsFromResponse(terminalResults: { output: string; resources?: ILinkLocation[] }[]): (URI | Location)[] {
	return Array.from(new Map(
		terminalResults
			.flatMap(r =>
				r.resources?.filter(res => res.uri).map(res => {
					const range = res.range;
					const item = range !== undefined ? { uri: res.uri, range } : res.uri;
					const key = range !== undefined
						? `${res.uri.toString()}-${range.toString()}`
						: `${res.uri.toString()}`;
					return [key, item] as [string, URI | Location];
				}) ?? []
			)
	).values());
}

export function toolResultMessageFromResponse(result: ITaskSummary | undefined, taskLabel: string, toolResultDetails: (URI | Location)[], terminalResults: { output: string; resources?: ILinkLocation[]; state: OutputMonitorState }[], getOutputTool?: boolean, isBackground?: boolean): MarkdownString {
	let resultSummary = '';
	if (result?.exitCode) {
		resultSummary = localize('copilotChat.taskFailedWithExitCode', 'Task `{0}` failed with exit code {1}.', taskLabel, result.exitCode);
	} else {
		resultSummary += `\`${taskLabel}\` task `;
		const problemCount = toolResultDetails.length;
		if (getOutputTool) {
			return problemCount ? new MarkdownString(`Got output for ${resultSummary} with \`${problemCount}\` problem${problemCount === 1 ? '' : 's'}`) : new MarkdownString(`Got output for ${resultSummary}`);
		} else {
			const problemCount = toolResultDetails.length;
			resultSummary += terminalResults.every(r => r.state === OutputMonitorState.Idle)
				? (problemCount
					? `finished with \`${problemCount}\` problem${problemCount === 1 ? '' : 's'}`
					: 'finished')
				: (isBackground
					? (problemCount
						? `started and will continue to run in the background with \`${problemCount}\` problem${problemCount === 1 ? '' : 's'}`
						: 'started and will continue to run in the background')
					: (problemCount
						? `started with \`${problemCount}\` problem${problemCount === 1 ? '' : 's'}`
						: 'started'));
		}
	}
	return new MarkdownString(resultSummary);
}

export interface ILinkLocation { uri: URI; range?: Range }
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/tools/task/taskToolsTelemetry.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/tools/task/taskToolsTelemetry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


export type TaskToolClassification = {
	taskId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The ID of the task.' };
	bufferLength: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The length of the terminal buffer as a string.' };
	pollDurationMs: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'How long polling for output took (ms).' };
	inputToolManualAcceptCount: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'The number of times the user manually accepted a detected suggestion' };
	inputToolManualRejectCount: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'The number of times the user manually rejected a detected suggestion' };
	inputToolManualChars: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'The number of characters input by manual acceptance of suggestions' };
	inputToolManualShownCount: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'The number of times the user was prompted to manually accept an input suggestion' };
	inputToolFreeFormInputShownCount: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'The number of times the user was prompted to provide free form input' };
	inputToolFreeFormInputCount: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'The number of times the user provided free form input after prompting' };
	owner: 'meganrogge';
	comment: 'Understanding the usage of the task tools';
};
export type TaskToolEvent = {
	taskId: string;
	bufferLength: number;
	pollDurationMs: number | undefined;
	inputToolManualAcceptCount: number;
	inputToolManualRejectCount: number;
	inputToolManualChars: number;
	inputToolManualShownCount: number;
	inputToolFreeFormInputShownCount: number;
	inputToolFreeFormInputCount: number;
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chatAgentTools/common/terminal.chatAgentTools.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chatAgentTools/common/terminal.chatAgentTools.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const enum TerminalChatAgentToolsCommandId {
	ChatAddTerminalSelection = 'workbench.action.terminal.chat.addTerminalSelection',
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chatAgentTools/common/terminalChatAgentToolsConfiguration.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chatAgentTools/common/terminalChatAgentToolsConfiguration.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { IStringDictionary } from '../../../../../base/common/collections.js';
import type { IJSONSchema } from '../../../../../base/common/jsonSchema.js';
import { localize } from '../../../../../nls.js';
import { type IConfigurationPropertySchema } from '../../../../../platform/configuration/common/configurationRegistry.js';
import { TerminalSettingId } from '../../../../../platform/terminal/common/terminal.js';
import product from '../../../../../platform/product/common/product.js';
import { terminalProfileBaseProperties } from '../../../../../platform/terminal/common/terminalPlatformConfiguration.js';
import { PolicyCategory } from '../../../../../base/common/policy.js';

export const enum TerminalChatAgentToolsSettingId {
	EnableAutoApprove = 'chat.tools.terminal.enableAutoApprove',
	AutoApprove = 'chat.tools.terminal.autoApprove',
	IgnoreDefaultAutoApproveRules = 'chat.tools.terminal.ignoreDefaultAutoApproveRules',
	BlockDetectedFileWrites = 'chat.tools.terminal.blockDetectedFileWrites',
	ShellIntegrationTimeout = 'chat.tools.terminal.shellIntegrationTimeout',
	AutoReplyToPrompts = 'chat.tools.terminal.autoReplyToPrompts',
	OutputLocation = 'chat.tools.terminal.outputLocation',

	TerminalProfileLinux = 'chat.tools.terminal.terminalProfile.linux',
	TerminalProfileMacOs = 'chat.tools.terminal.terminalProfile.osx',
	TerminalProfileWindows = 'chat.tools.terminal.terminalProfile.windows',

	DeprecatedAutoApproveCompatible = 'chat.agent.terminal.autoApprove',
	DeprecatedAutoApprove1 = 'chat.agent.terminal.allowList',
	DeprecatedAutoApprove2 = 'chat.agent.terminal.denyList',
	DeprecatedAutoApprove3 = 'github.copilot.chat.agent.terminal.allowList',
	DeprecatedAutoApprove4 = 'github.copilot.chat.agent.terminal.denyList',
}

export interface ITerminalChatAgentToolsConfiguration {
	autoApprove: { [key: string]: boolean };
	commandReportingAllowList: { [key: string]: boolean };
	shellIntegrationTimeout: number;
}

const autoApproveBoolean: IJSONSchema = {
	type: 'boolean',
	enum: [
		true,
		false,
	],
	enumDescriptions: [
		localize('autoApprove.true', "Automatically approve the pattern."),
		localize('autoApprove.false', "Require explicit approval for the pattern."),
	],
	description: localize('autoApprove.key', "The start of a command to match against. A regular expression can be provided by wrapping the string in `/` characters."),
};

const terminalChatAgentProfileSchema: IJSONSchema = {
	type: 'object',
	required: ['path'],
	properties: {
		path: {
			description: localize('terminalChatAgentProfile.path', "A path to a shell executable."),
			type: 'string',
		},
		...terminalProfileBaseProperties,
	}
};

export const terminalChatAgentToolsConfiguration: IStringDictionary<IConfigurationPropertySchema> = {
	[TerminalChatAgentToolsSettingId.EnableAutoApprove]: {
		description: localize('autoApproveMode.description', "Controls whether to allow auto approval in the run in terminal tool."),
		type: 'boolean',
		default: true,
		policy: {
			name: 'ChatToolsTerminalEnableAutoApprove',
			category: PolicyCategory.IntegratedTerminal,
			minimumVersion: '1.104',
			localization: {
				description: {
					key: 'autoApproveMode.description',
					value: localize('autoApproveMode.description', "Controls whether to allow auto approval in the run in terminal tool."),
				}
			}
		}
	},
	[TerminalChatAgentToolsSettingId.AutoApprove]: {
		markdownDescription: [
			localize('autoApprove.description.intro', "A list of commands or regular expressions that control whether the run in terminal tool commands require explicit approval. These will be matched against the start of a command. A regular expression can be provided by wrapping the string in {0} characters followed by optional flags such as {1} for case-insensitivity.", '`/`', '`i`'),
			localize('autoApprove.description.values', "Set to {0} to automatically approve commands, {1} to always require explicit approval or {2} to unset the value.", '`true`', '`false`', '`null`'),
			localize('autoApprove.description.subCommands', "Note that these commands and regular expressions are evaluated for every _sub-command_ within the full _command line_, so {0} for example will need both {1} and {2} to match a {3} entry and must not match a {4} entry in order to auto approve. Inline commands such as {5} (process substitution) should also be detected.", '`foo && bar`', '`foo`', '`bar`', '`true`', '`false`', '`<(foo)`'),
			localize('autoApprove.description.commandLine', "An object can be used to match against the full command line instead of matching sub-commands and inline commands, for example {0}. In order to be auto approved _both_ the sub-command and command line must not be explicitly denied, then _either_ all sub-commands or command line needs to be approved.", '`{ approve: false, matchCommandLine: true }`'),
			localize('autoApprove.defaults', "Note that there's a default set of rules to allow and also deny commands. Consider setting {0} to {1} to ignore all default rules to ensure there are no conflicts with your own rules. Do this at your own risk, the default denial rules are designed to protect you against running dangerous commands.", `\`#${TerminalChatAgentToolsSettingId.IgnoreDefaultAutoApproveRules}#\``, '`true`'),
			[
				localize('autoApprove.description.examples.title', 'Examples:'),
				`|${localize('autoApprove.description.examples.value', "Value")}|${localize('autoApprove.description.examples.description', "Description")}|`,
				'|---|---|',
				'| `\"mkdir\": true` | ' + localize('autoApprove.description.examples.mkdir', "Allow all commands starting with {0}", '`mkdir`'),
				'| `\"npm run build\": true` | ' + localize('autoApprove.description.examples.npmRunBuild', "Allow all commands starting with {0}", '`npm run build`'),
				'| `\"bin/test.sh\": true` | ' + localize('autoApprove.description.examples.binTest', "Allow all commands that match the path {0} ({1}, {2}, etc.)", '`bin/test.sh`', '`bin\\test.sh`', '`./bin/test.sh`'),
				'| `\"/^git (status\\|show\\\\b.*)$/\": true` | ' + localize('autoApprove.description.examples.regexGit', "Allow {0} and all commands starting with {1}", '`git status`', '`git show`'),
				'| `\"/^Get-ChildItem\\\\b/i\": true` | ' + localize('autoApprove.description.examples.regexCase', "will allow {0} commands regardless of casing", '`Get-ChildItem`'),
				'| `\"/.*/\": true` | ' + localize('autoApprove.description.examples.regexAll', "Allow all commands (denied commands still require approval)"),
				'| `\"rm\": false` | ' + localize('autoApprove.description.examples.rm', "Require explicit approval for all commands starting with {0}", '`rm`'),
				'| `\"/\\\\.ps1/i\": { approve: false, matchCommandLine: true }` | ' + localize('autoApprove.description.examples.ps1', "Require explicit approval for any _command line_ that contains {0} regardless of casing", '`".ps1"`'),
				'| `\"rm\": null` | ' + localize('autoApprove.description.examples.rmUnset', "Unset the default {0} value for {1}", '`false`', '`rm`'),
			].join('\n'),
		].join('\n\n'),
		type: 'object',
		additionalProperties: {
			anyOf: [
				autoApproveBoolean,
				{
					type: 'object',
					properties: {
						approve: autoApproveBoolean,
						matchCommandLine: {
							type: 'boolean',
							enum: [
								true,
								false,
							],
							enumDescriptions: [
								localize('autoApprove.matchCommandLine.true', "Match against the full command line, eg. `foo && bar`."),
								localize('autoApprove.matchCommandLine.false', "Match against sub-commands and inline commands, eg. `foo && bar` will need both `foo` and `bar` to match."),
							],
							description: localize('autoApprove.matchCommandLine', "Whether to match against the full command line, as opposed to splitting by sub-commands and inline commands."),
						}
					},
					required: ['approve']
				},
				{
					type: 'null',
					description: localize('autoApprove.null', "Ignore the pattern, this is useful for unsetting the same pattern set at a higher scope."),
				},
			]
		},
		default: {
			// This is the default set of terminal auto approve commands. Note that these are best
			// effort and do not aim to provide exhaustive coverage to prevent dangerous commands
			// from executing as that is simply not feasible. Workspace trust and warnings of
			// possible prompt injection are _the_ thing protecting the user in agent mode, once
			// that trust boundary has been breached all bets are off as trusting a workspace that
			// contains anything malicious has already compromised the machine.
			//
			// Instead, the focus here is to unblock the user from approving clearly safe commands
			// frequently and cover common edge cases that could arise from the user auto-approving
			// commands.
			//
			// Take for example `find` which looks innocuous and most users are likely to auto
			// approve future calls when offered. However, the `-exec` argument can run anything. So
			// instead of leaving this decision up to the user we provide relatively safe defaults
			// and block common edge cases. So offering these default rules, despite their flaws, is
			// likely to protect the user more in general than leaving everything up to them (plus
			// make agent mode more convenient).

			// #region Safe commands
			//
			// Generally safe and common readonly commands

			cd: true,
			echo: true,
			ls: true,
			pwd: true,
			cat: true,
			head: true,
			tail: true,
			findstr: true,
			wc: true,
			tr: true,
			cut: true,
			cmp: true,
			which: true,
			basename: true,
			dirname: true,
			realpath: true,
			readlink: true,
			stat: true,
			file: true,
			du: true,
			df: true,
			sleep: true,
			nl: true,

			// grep
			// - Variable
			// - `-f`: Read patterns from file, this is an acceptable risk since you can do similar
			//   with cat
			// - `-P`: PCRE risks include denial of service (memory exhaustion, catastrophic
			//   backtracking) which could lock up the terminal. Older PCRE versions allow code
			//   execution via this flag but this has been patched with CVEs.
			// - Variable injection is possible, but requires setting a variable which would need
			//   manual approval.
			grep: true,

			// #endregion

			// #region Safe sub-commands
			//
			// Safe and common sub-commands

			'git status': true,
			'git log': true,
			'git show': true,
			'git diff': true,

			// git grep
			// - `--open-files-in-pager`: This is the configured pager, so no risk of code execution
			// - See notes on `grep`
			'git grep': true,

			// git branch
			// - `-d`, `-D`, `--delete`: Prevent branch deletion
			// - `-m`, `-M`: Prevent branch renaming
			// - `--force`: Generally dangerous
			'git branch': true,
			'/^git branch\\b.*-(d|D|m|M|-delete|-force)\\b/': false,

			// #endregion

			// #region PowerShell

			'Get-ChildItem': true,
			'Get-Content': true,
			'Get-Date': true,
			'Get-Random': true,
			'Get-Location': true,
			'Write-Host': true,
			'Write-Output': true,
			'Split-Path': true,
			'Join-Path': true,
			'Start-Sleep': true,
			'Where-Object': true,

			// Blanket approval of safe verbs
			'/^Select-[a-z0-9]/i': true,
			'/^Measure-[a-z0-9]/i': true,
			'/^Compare-[a-z0-9]/i': true,
			'/^Format-[a-z0-9]/i': true,
			'/^Sort-[a-z0-9]/i': true,

			// #endregion

			// #region Safe + disabled args
			//
			// Commands that are generally allowed with special cases we block. Note that shell
			// expansion is handled by the inline command detection when parsing sub-commands.

			// column
			// - `-c`: We block excessive columns that could lead to memory exhaustion.
			column: true,
			'/^column\\b.*-c\\s+[0-9]{4,}/': false,

			// date
			// -s|--set: Sets the system clock
			date: true,
			'/^date\\b.*(-s|--set)\\b/': false,

			// find
			// - `-delete`: Deletes files or directories.
			// - `-exec`/`-execdir`: Execute on results.
			// - `-fprint`/`fprintf`/`fls`: Writes files.
			// - `-ok`/`-okdir`: Like exec but with a confirmation.
			find: true,
			'/^find\\b.*-(delete|exec|execdir|fprint|fprintf|fls|ok|okdir)\\b/': false,

			// sort
			// - `-o`: Output redirection can write files (`sort -o /etc/something file`) which are
			//   blocked currently
			// - `-S`: Memory exhaustion is possible (`sort -S 100G file`), we allow possible denial
			//   of service.
			sort: true,
			'/^sort\\b.*-(o|S)\\b/': false,

			// tree
			// - `-o`: Output redirection can write files (`tree -o /etc/something file`) which are
			//   blocked currently
			tree: true,
			'/^tree\\b.*-o\\b/': false,

			// #endregion

			// #region Dangerous commands
			//
			// There are countless dangerous commands available on the command line, the defaults
			// here include common ones that the user is likely to want to explicitly approve first.
			// This is not intended to be a catch all as the user needs to opt-in to auto-approve
			// commands, it provides some additional safety when the commands get approved by overly
			// broad user/workspace rules.

			// Deleting files
			rm: false,
			rmdir: false,
			del: false,
			'Remove-Item': false,
			ri: false,
			rd: false,
			erase: false,
			dd: false,

			// Managing/killing processes, dangerous thing to do generally
			kill: false,
			ps: false,
			top: false,
			'Stop-Process': false,
			spps: false,
			taskkill: false,
			'taskkill.exe': false,

			// Web requests, prompt injection concerns
			curl: false,
			wget: false,
			'Invoke-RestMethod': false,
			'Invoke-WebRequest': false,
			'irm': false,
			'iwr': false,

			// File permissions and ownership, messing with these can cause hard to diagnose issues
			chmod: false,
			chown: false,
			'Set-ItemProperty': false,
			'sp': false,
			'Set-Acl': false,

			// General eval/command execution, can lead to anything else running
			jq: false,
			xargs: false,
			eval: false,
			'Invoke-Expression': false,
			iex: false,
			// #endregion
		} satisfies Record<string, boolean | { approve: boolean; matchCommandLine?: boolean }>,
	},
	[TerminalChatAgentToolsSettingId.IgnoreDefaultAutoApproveRules]: {
		type: 'boolean',
		default: false,
		tags: ['experimental'],
		markdownDescription: localize('ignoreDefaultAutoApproveRules.description', "Whether to ignore the built-in default auto-approve rules used by the run in terminal tool as defined in {0}. When this setting is enabled, the run in terminal tool will ignore any rule that comes from the default set but still follow rules defined in the user, remote and workspace settings. Use this setting at your own risk; the default auto-approve rules are designed to protect you against running dangerous commands.", `\`#${TerminalChatAgentToolsSettingId.AutoApprove}#\``),
	},
	[TerminalChatAgentToolsSettingId.BlockDetectedFileWrites]: {
		type: 'string',
		enum: ['never', 'outsideWorkspace', 'all'],
		enumDescriptions: [
			localize('blockFileWrites.never', "Allow all detected file writes."),
			localize('blockFileWrites.outsideWorkspace', "Block file writes detected outside the workspace. This depends on the shell integration feature working correctly to determine the current working directory of the terminal."),
			localize('blockFileWrites.all', "Block all detected file writes."),
		],
		default: 'outsideWorkspace',
		tags: ['experimental'],
		markdownDescription: localize('blockFileWrites.description', "Controls whether detected file write operations are blocked in the run in terminal tool. When detected, this will require explicit approval regardless of whether the command would normally be auto approved. Note that this cannot detect all possible methods of writing files, this is what is currently detected:\n\n- File redirection (detected via the bash or PowerShell tree sitter grammar)"),
	},
	[TerminalChatAgentToolsSettingId.ShellIntegrationTimeout]: {
		markdownDescription: localize('shellIntegrationTimeout.description', "Configures the duration in milliseconds to wait for shell integration to be detected when the run in terminal tool launches a new terminal. Set to `0` to wait the minimum time, the default value `-1` means the wait time is variable based on the value of {0} and whether it's a remote window. A large value can be useful if your shell starts very slowly and a low value if you're intentionally not using shell integration.", `\`#${TerminalSettingId.ShellIntegrationEnabled}#\``),
		type: 'integer',
		minimum: -1,
		maximum: 60000,
		default: -1,
		markdownDeprecationMessage: localize('shellIntegrationTimeout.deprecated', 'Use {0} instead', `\`#${TerminalSettingId.ShellIntegrationTimeout}#\``)
	},
	[TerminalChatAgentToolsSettingId.TerminalProfileLinux]: {
		restricted: true,
		markdownDescription: localize('terminalChatAgentProfile.linux', "The terminal profile to use on Linux for chat agent's run in terminal tool."),
		type: ['object', 'null'],
		default: null,
		'anyOf': [
			{ type: 'null' },
			terminalChatAgentProfileSchema
		],
		defaultSnippets: [
			{
				body: {
					path: '${1}'
				}
			}
		]
	},
	[TerminalChatAgentToolsSettingId.TerminalProfileMacOs]: {
		restricted: true,
		markdownDescription: localize('terminalChatAgentProfile.osx', "The terminal profile to use on macOS for chat agent's run in terminal tool."),
		type: ['object', 'null'],
		default: null,
		'anyOf': [
			{ type: 'null' },
			terminalChatAgentProfileSchema
		],
		defaultSnippets: [
			{
				body: {
					path: '${1}'
				}
			}
		]
	},
	[TerminalChatAgentToolsSettingId.TerminalProfileWindows]: {
		restricted: true,
		markdownDescription: localize('terminalChatAgentProfile.windows', "The terminal profile to use on Windows for chat agent's run in terminal tool."),
		type: ['object', 'null'],
		default: null,
		'anyOf': [
			{ type: 'null' },
			terminalChatAgentProfileSchema
		],
		defaultSnippets: [
			{
				body: {
					path: '${1}'
				}
			}
		]
	},
	[TerminalChatAgentToolsSettingId.AutoReplyToPrompts]: {
		type: 'boolean',
		default: false,
		tags: ['experimental'],
		markdownDescription: localize('autoReplyToPrompts.key', "Whether to automatically respond to prompts in the terminal such as `Confirm? y/n`. This is an experimental feature and may not work in all scenarios."),
	},
	[TerminalChatAgentToolsSettingId.OutputLocation]: {
		markdownDescription: localize('outputLocation.description', "Where to show the output from the run in terminal tool session."),
		type: 'string',
		enum: ['terminal', 'none'],
		enumDescriptions: [
			localize('outputLocation.terminal', "Reveal the terminal when running the command."),
			localize('outputLocation.none', "Do not reveal the terminal automatically."),
		],
		default: product.quality !== 'stable' ? 'none' : 'terminal',
		tags: ['experimental'],
		experiment: {
			mode: 'auto'
		}
	}
};

for (const id of [
	TerminalChatAgentToolsSettingId.DeprecatedAutoApprove1,
	TerminalChatAgentToolsSettingId.DeprecatedAutoApprove2,
	TerminalChatAgentToolsSettingId.DeprecatedAutoApprove3,
	TerminalChatAgentToolsSettingId.DeprecatedAutoApprove4,
	TerminalChatAgentToolsSettingId.DeprecatedAutoApproveCompatible,
]) {
	terminalChatAgentToolsConfiguration[id] = {
		deprecated: true,
		markdownDeprecationMessage: localize('autoApprove.deprecated', 'Use {0} instead', `\`#${TerminalChatAgentToolsSettingId.AutoApprove}#\``)
	};
}
```

--------------------------------------------------------------------------------

````
