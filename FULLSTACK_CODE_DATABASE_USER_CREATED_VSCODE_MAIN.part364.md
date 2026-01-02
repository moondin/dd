---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 364
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 364 of 552)

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

---[FILE: src/vs/workbench/contrib/chat/common/promptSyntax/languageProviders/promptValidator.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/promptSyntax/languageProviders/promptValidator.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isEmptyPattern, parse, splitGlobAware } from '../../../../../../base/common/glob.js';
import { Iterable } from '../../../../../../base/common/iterator.js';
import { Range } from '../../../../../../editor/common/core/range.js';
import { ITextModel } from '../../../../../../editor/common/model.js';
import { IModelService } from '../../../../../../editor/common/services/model.js';
import { localize } from '../../../../../../nls.js';
import { IInstantiationService } from '../../../../../../platform/instantiation/common/instantiation.js';
import { IMarkerData, IMarkerService, MarkerSeverity } from '../../../../../../platform/markers/common/markers.js';
import { IChatMode, IChatModeService } from '../../chatModes.js';
import { ChatModeKind } from '../../constants.js';
import { ILanguageModelChatMetadata, ILanguageModelsService } from '../../languageModels.js';
import { ILanguageModelToolsService, SpecedToolAliases } from '../../languageModelToolsService.js';
import { getPromptsTypeForLanguageId, PromptsType } from '../promptTypes.js';
import { GithubPromptHeaderAttributes, IArrayValue, IHeaderAttribute, IStringValue, ParsedPromptFile, PromptHeaderAttributes, Target } from '../promptFileParser.js';
import { Disposable, DisposableStore, toDisposable } from '../../../../../../base/common/lifecycle.js';
import { Delayer } from '../../../../../../base/common/async.js';
import { ResourceMap } from '../../../../../../base/common/map.js';
import { IFileService } from '../../../../../../platform/files/common/files.js';
import { IPromptsService } from '../service/promptsService.js';
import { ILabelService } from '../../../../../../platform/label/common/label.js';
import { AGENTS_SOURCE_FOLDER, LEGACY_MODE_FILE_EXTENSION } from '../config/promptFileLocations.js';
import { Lazy } from '../../../../../../base/common/lazy.js';

export const MARKERS_OWNER_ID = 'prompts-diagnostics-provider';

export class PromptValidator {
	constructor(
		@ILanguageModelsService private readonly languageModelsService: ILanguageModelsService,
		@ILanguageModelToolsService private readonly languageModelToolsService: ILanguageModelToolsService,
		@IChatModeService private readonly chatModeService: IChatModeService,
		@IFileService private readonly fileService: IFileService,
		@ILabelService private readonly labelService: ILabelService,
		@IPromptsService private readonly promptsService: IPromptsService
	) { }

	public async validate(promptAST: ParsedPromptFile, promptType: PromptsType, report: (markers: IMarkerData) => void): Promise<void> {
		promptAST.header?.errors.forEach(error => report(toMarker(error.message, error.range, MarkerSeverity.Error)));
		this.validateHeader(promptAST, promptType, report);
		await this.validateBody(promptAST, promptType, report);
		await this.validateFileName(promptAST, promptType, report);
	}

	private async validateFileName(promptAST: ParsedPromptFile, promptType: PromptsType, report: (markers: IMarkerData) => void): Promise<void> {
		if (promptType === PromptsType.agent && promptAST.uri.path.endsWith(LEGACY_MODE_FILE_EXTENSION)) {
			const location = this.promptsService.getAgentFileURIFromModeFile(promptAST.uri);
			if (location && await this.fileService.canCreateFile(location)) {
				report(toMarker(localize('promptValidator.chatModesRenamedToAgents', "Chat modes have been renamed to agents. Please move this file to {0}", location.toString()), new Range(1, 1, 1, 4), MarkerSeverity.Warning));
			} else {
				report(toMarker(localize('promptValidator.chatModesRenamedToAgentsNoMove', "Chat modes have been renamed to agents. Please move the file to {0}", AGENTS_SOURCE_FOLDER), new Range(1, 1, 1, 4), MarkerSeverity.Warning));
			}
		}
	}

	private async validateBody(promptAST: ParsedPromptFile, promptType: PromptsType, report: (markers: IMarkerData) => void): Promise<void> {
		const body = promptAST.body;
		if (!body) {
			return;
		}

		// Validate file references
		const fileReferenceChecks: Promise<void>[] = [];
		for (const ref of body.fileReferences) {
			const resolved = body.resolveFilePath(ref.content);
			if (!resolved) {
				report(toMarker(localize('promptValidator.invalidFileReference', "Invalid file reference '{0}'.", ref.content), ref.range, MarkerSeverity.Warning));
				continue;
			}
			if (promptAST.uri.scheme === resolved.scheme) {
				// only validate if the link is in the file system of the prompt file
				fileReferenceChecks.push((async () => {
					try {
						const exists = await this.fileService.exists(resolved);
						if (exists) {
							return;
						}
					} catch {
					}
					const loc = this.labelService.getUriLabel(resolved);
					report(toMarker(localize('promptValidator.fileNotFound', "File '{0}' not found at '{1}'.", ref.content, loc), ref.range, MarkerSeverity.Warning));
				})());
			}
		}

		const isGitHubTarget = isGithubTarget(promptType, promptAST.header?.target);

		// Validate variable references (tool or toolset names)
		if (body.variableReferences.length && !isGitHubTarget) {
			const headerTools = promptAST.header?.tools;
			const headerTarget = promptAST.header?.target;
			const headerToolsMap = headerTools ? this.languageModelToolsService.toToolAndToolSetEnablementMap(headerTools, headerTarget) : undefined;

			const available = new Set<string>(this.languageModelToolsService.getFullReferenceNames());
			const deprecatedNames = this.languageModelToolsService.getDeprecatedFullReferenceNames();
			for (const variable of body.variableReferences) {
				if (!available.has(variable.name)) {
					if (deprecatedNames.has(variable.name)) {
						const currentNames = deprecatedNames.get(variable.name);
						if (currentNames && currentNames.size > 0) {
							if (currentNames.size === 1) {
								const newName = Array.from(currentNames)[0];
								report(toMarker(localize('promptValidator.deprecatedVariableReference', "Tool or toolset '{0}' has been renamed, use '{1}' instead.", variable.name, newName), variable.range, MarkerSeverity.Info));
							} else {
								const newNames = Array.from(currentNames).sort((a, b) => a.localeCompare(b)).join(', ');
								report(toMarker(localize('promptValidator.deprecatedVariableReferenceMultipleNames', "Tool or toolset '{0}' has been renamed, use the following tools instead: {1}", variable.name, newNames), variable.range, MarkerSeverity.Info));
							}
						}
					} else {
						report(toMarker(localize('promptValidator.unknownVariableReference', "Unknown tool or toolset '{0}'.", variable.name), variable.range, MarkerSeverity.Warning));
					}
				} else if (headerToolsMap) {
					const tool = this.languageModelToolsService.getToolByFullReferenceName(variable.name);
					if (tool && headerToolsMap.get(tool) === false) {
						report(toMarker(localize('promptValidator.disabledTool', "Tool or toolset '{0}' also needs to be enabled in the header.", variable.name), variable.range, MarkerSeverity.Warning));
					}
				}
			}
		}

		await Promise.all(fileReferenceChecks);
	}

	private validateHeader(promptAST: ParsedPromptFile, promptType: PromptsType, report: (markers: IMarkerData) => void): void {
		const header = promptAST.header;
		if (!header) {
			return;
		}
		const attributes = header.attributes;
		const isGitHubTarget = isGithubTarget(promptType, header.target);
		this.checkForInvalidArguments(attributes, promptType, isGitHubTarget, report);

		this.validateName(attributes, isGitHubTarget, report);
		this.validateDescription(attributes, report);
		this.validateArgumentHint(attributes, report);
		switch (promptType) {
			case PromptsType.prompt: {
				const agent = this.validateAgent(attributes, report);
				this.validateTools(attributes, agent?.kind ?? ChatModeKind.Agent, header.target, report);
				this.validateModel(attributes, agent?.kind ?? ChatModeKind.Agent, report);
				break;
			}
			case PromptsType.instructions:
				this.validateApplyTo(attributes, report);
				this.validateExcludeAgent(attributes, report);
				break;

			case PromptsType.agent: {
				this.validateTarget(attributes, report);
				this.validateInfer(attributes, report);
				this.validateTools(attributes, ChatModeKind.Agent, header.target, report);
				if (!isGitHubTarget) {
					this.validateModel(attributes, ChatModeKind.Agent, report);
					this.validateHandoffs(attributes, report);
				}
				break;
			}

		}
	}

	private checkForInvalidArguments(attributes: IHeaderAttribute[], promptType: PromptsType, isGitHubTarget: boolean, report: (markers: IMarkerData) => void): void {
		const validAttributeNames = getValidAttributeNames(promptType, true, isGitHubTarget);
		const validGithubCopilotAttributeNames = new Lazy(() => new Set(getValidAttributeNames(promptType, false, true)));
		for (const attribute of attributes) {
			if (!validAttributeNames.includes(attribute.key)) {
				const supportedNames = new Lazy(() => getValidAttributeNames(promptType, false, isGitHubTarget).sort().join(', '));
				switch (promptType) {
					case PromptsType.prompt:
						report(toMarker(localize('promptValidator.unknownAttribute.prompt', "Attribute '{0}' is not supported in prompt files. Supported: {1}.", attribute.key, supportedNames.value), attribute.range, MarkerSeverity.Warning));
						break;
					case PromptsType.agent:
						if (isGitHubTarget) {
							report(toMarker(localize('promptValidator.unknownAttribute.github-agent', "Attribute '{0}' is not supported in custom GitHub Copilot agent files. Supported: {1}.", attribute.key, supportedNames.value), attribute.range, MarkerSeverity.Warning));
						} else {
							if (validGithubCopilotAttributeNames.value.has(attribute.key)) {
								report(toMarker(localize('promptValidator.ignoredAttribute.vscode-agent', "Attribute '{0}' is ignored when running locally in VS Code.", attribute.key), attribute.range, MarkerSeverity.Info));
							} else {
								report(toMarker(localize('promptValidator.unknownAttribute.vscode-agent', "Attribute '{0}' is not supported in VS Code agent files. Supported: {1}.", attribute.key, supportedNames.value), attribute.range, MarkerSeverity.Warning));
							}
						}
						break;
					case PromptsType.instructions:
						report(toMarker(localize('promptValidator.unknownAttribute.instructions', "Attribute '{0}' is not supported in instructions files. Supported: {1}.", attribute.key, supportedNames.value), attribute.range, MarkerSeverity.Warning));
						break;
				}
			}
		}
	}



	private validateName(attributes: IHeaderAttribute[], isGitHubTarget: boolean, report: (markers: IMarkerData) => void): void {
		const nameAttribute = attributes.find(attr => attr.key === PromptHeaderAttributes.name);
		if (!nameAttribute) {
			return;
		}
		if (nameAttribute.value.type !== 'string') {
			report(toMarker(localize('promptValidator.nameMustBeString', "The 'name' attribute must be a string."), nameAttribute.range, MarkerSeverity.Error));
			return;
		}
		if (nameAttribute.value.value.trim().length === 0) {
			report(toMarker(localize('promptValidator.nameShouldNotBeEmpty', "The 'name' attribute must not be empty."), nameAttribute.value.range, MarkerSeverity.Error));
			return;
		}
	}

	private validateDescription(attributes: IHeaderAttribute[], report: (markers: IMarkerData) => void): void {
		const descriptionAttribute = attributes.find(attr => attr.key === PromptHeaderAttributes.description);
		if (!descriptionAttribute) {
			return;
		}
		if (descriptionAttribute.value.type !== 'string') {
			report(toMarker(localize('promptValidator.descriptionMustBeString', "The 'description' attribute must be a string."), descriptionAttribute.range, MarkerSeverity.Error));
			return;
		}
		if (descriptionAttribute.value.value.trim().length === 0) {
			report(toMarker(localize('promptValidator.descriptionShouldNotBeEmpty', "The 'description' attribute should not be empty."), descriptionAttribute.value.range, MarkerSeverity.Error));
			return;
		}
	}

	private validateArgumentHint(attributes: IHeaderAttribute[], report: (markers: IMarkerData) => void): void {
		const argumentHintAttribute = attributes.find(attr => attr.key === PromptHeaderAttributes.argumentHint);
		if (!argumentHintAttribute) {
			return;
		}
		if (argumentHintAttribute.value.type !== 'string') {
			report(toMarker(localize('promptValidator.argumentHintMustBeString', "The 'argument-hint' attribute must be a string."), argumentHintAttribute.range, MarkerSeverity.Error));
			return;
		}
		if (argumentHintAttribute.value.value.trim().length === 0) {
			report(toMarker(localize('promptValidator.argumentHintShouldNotBeEmpty', "The 'argument-hint' attribute should not be empty."), argumentHintAttribute.value.range, MarkerSeverity.Error));
			return;
		}
	}

	private validateModel(attributes: IHeaderAttribute[], agentKind: ChatModeKind, report: (markers: IMarkerData) => void): void {
		const attribute = attributes.find(attr => attr.key === PromptHeaderAttributes.model);
		if (!attribute) {
			return;
		}
		if (attribute.value.type !== 'string') {
			report(toMarker(localize('promptValidator.modelMustBeString', "The 'model' attribute must be a string."), attribute.value.range, MarkerSeverity.Error));
			return;
		}
		const modelName = attribute.value.value.trim();
		if (modelName.length === 0) {
			report(toMarker(localize('promptValidator.modelMustBeNonEmpty', "The 'model' attribute must be a non-empty string."), attribute.value.range, MarkerSeverity.Error));
			return;
		}

		const languageModes = this.languageModelsService.getLanguageModelIds();
		if (languageModes.length === 0) {
			// likely the service is not initialized yet
			return;
		}
		const modelMetadata = this.findModelByName(languageModes, modelName);
		if (!modelMetadata) {
			report(toMarker(localize('promptValidator.modelNotFound', "Unknown model '{0}'.", modelName), attribute.value.range, MarkerSeverity.Warning));

		} else if (agentKind === ChatModeKind.Agent && !ILanguageModelChatMetadata.suitableForAgentMode(modelMetadata)) {
			report(toMarker(localize('promptValidator.modelNotSuited', "Model '{0}' is not suited for agent mode.", modelName), attribute.value.range, MarkerSeverity.Warning));
		}
	}

	private findModelByName(languageModes: string[], modelName: string): ILanguageModelChatMetadata | undefined {
		for (const model of languageModes) {
			const metadata = this.languageModelsService.lookupLanguageModel(model);
			if (metadata && metadata.isUserSelectable !== false && ILanguageModelChatMetadata.matchesQualifiedName(modelName, metadata)) {
				return metadata;
			}
		}
		return undefined;
	}

	private validateAgent(attributes: IHeaderAttribute[], report: (markers: IMarkerData) => void): IChatMode | undefined {
		const agentAttribute = attributes.find(attr => attr.key === PromptHeaderAttributes.agent);
		const modeAttribute = attributes.find(attr => attr.key === PromptHeaderAttributes.mode);
		if (modeAttribute) {
			if (agentAttribute) {
				report(toMarker(localize('promptValidator.modeDeprecated', "The 'mode' attribute has been deprecated. The 'agent' attribute is used instead."), modeAttribute.range, MarkerSeverity.Warning));
			} else {
				report(toMarker(localize('promptValidator.modeDeprecated.useAgent', "The 'mode' attribute has been deprecated. Please rename it to 'agent'."), modeAttribute.range, MarkerSeverity.Error));
			}
		}

		const attribute = attributes.find(attr => attr.key === PromptHeaderAttributes.agent) ?? modeAttribute;
		if (!attribute) {
			return undefined; // default agent for prompts is Agent
		}
		if (attribute.value.type !== 'string') {
			report(toMarker(localize('promptValidator.attributeMustBeString', "The '{0}' attribute must be a string.", attribute.key), attribute.value.range, MarkerSeverity.Error));
			return undefined;
		}
		const agentValue = attribute.value.value;
		if (agentValue.trim().length === 0) {
			report(toMarker(localize('promptValidator.attributeMustBeNonEmpty', "The '{0}' attribute must be a non-empty string.", attribute.key), attribute.value.range, MarkerSeverity.Error));
			return undefined;
		}
		return this.validateAgentValue(attribute.value, report);
	}

	private validateAgentValue(value: IStringValue, report: (markers: IMarkerData) => void): IChatMode | undefined {
		const agents = this.chatModeService.getModes();
		const availableAgents = [];

		// Check if agent exists in builtin or custom agents
		for (const agent of Iterable.concat(agents.builtin, agents.custom)) {
			if (agent.name.get() === value.value) {
				return agent;
			}
			availableAgents.push(agent.name.get()); // collect all available agent names
		}

		const errorMessage = localize('promptValidator.agentNotFound', "Unknown agent '{0}'. Available agents: {1}.", value.value, availableAgents.join(', '));
		report(toMarker(errorMessage, value.range, MarkerSeverity.Warning));
		return undefined;
	}

	private validateTools(attributes: IHeaderAttribute[], agentKind: ChatModeKind, target: string | undefined, report: (markers: IMarkerData) => void): undefined {
		const attribute = attributes.find(attr => attr.key === PromptHeaderAttributes.tools);
		if (!attribute) {
			return;
		}
		if (agentKind !== ChatModeKind.Agent) {
			report(toMarker(localize('promptValidator.toolsOnlyInAgent', "The 'tools' attribute is only supported when using agents. Attribute will be ignored."), attribute.range, MarkerSeverity.Warning));
		}

		switch (attribute.value.type) {
			case 'array':
				if (target === Target.GitHubCopilot) {
					// no validation for github-copilot target
				} else {
					this.validateVSCodeTools(attribute.value, target, report);
				}
				break;
			default:
				report(toMarker(localize('promptValidator.toolsMustBeArrayOrMap', "The 'tools' attribute must be an array."), attribute.value.range, MarkerSeverity.Error));
		}
	}

	private validateVSCodeTools(valueItem: IArrayValue, target: string | undefined, report: (markers: IMarkerData) => void) {
		if (valueItem.items.length > 0) {
			const available = new Set<string>(this.languageModelToolsService.getFullReferenceNames());
			const deprecatedNames = this.languageModelToolsService.getDeprecatedFullReferenceNames();
			for (const item of valueItem.items) {
				if (item.type !== 'string') {
					report(toMarker(localize('promptValidator.eachToolMustBeString', "Each tool name in the 'tools' attribute must be a string."), item.range, MarkerSeverity.Error));
				} else if (item.value) {
					if (!available.has(item.value)) {
						const currentNames = deprecatedNames.get(item.value);
						if (currentNames) {
							if (currentNames?.size === 1) {
								const newName = Array.from(currentNames)[0];
								report(toMarker(localize('promptValidator.toolDeprecated', "Tool or toolset '{0}' has been renamed, use '{1}' instead.", item.value, newName), item.range, MarkerSeverity.Info));
							} else {
								const newNames = Array.from(currentNames).sort((a, b) => a.localeCompare(b)).join(', ');
								report(toMarker(localize('promptValidator.toolDeprecatedMultipleNames', "Tool or toolset '{0}' has been renamed, use the following tools instead: {1}", item.value, newNames), item.range, MarkerSeverity.Info));
							}
						} else {
							report(toMarker(localize('promptValidator.toolNotFound', "Unknown tool '{0}'.", item.value), item.range, MarkerSeverity.Warning));
						}
					}
				}
			}
		}
	}

	private validateApplyTo(attributes: IHeaderAttribute[], report: (markers: IMarkerData) => void): undefined {
		const attribute = attributes.find(attr => attr.key === PromptHeaderAttributes.applyTo);
		if (!attribute) {
			return;
		}
		if (attribute.value.type !== 'string') {
			report(toMarker(localize('promptValidator.applyToMustBeString', "The 'applyTo' attribute must be a string."), attribute.value.range, MarkerSeverity.Error));
			return;
		}
		const pattern = attribute.value.value;
		try {
			const patterns = splitGlobAware(pattern, ',');
			if (patterns.length === 0) {
				report(toMarker(localize('promptValidator.applyToMustBeValidGlob', "The 'applyTo' attribute must be a valid glob pattern."), attribute.value.range, MarkerSeverity.Error));
				return;
			}
			for (const pattern of patterns) {
				const globPattern = parse(pattern);
				if (isEmptyPattern(globPattern)) {
					report(toMarker(localize('promptValidator.applyToMustBeValidGlob', "The 'applyTo' attribute must be a valid glob pattern."), attribute.value.range, MarkerSeverity.Error));
					return;
				}
			}
		} catch (_error) {
			report(toMarker(localize('promptValidator.applyToMustBeValidGlob', "The 'applyTo' attribute must be a valid glob pattern."), attribute.value.range, MarkerSeverity.Error));
		}
	}

	private validateExcludeAgent(attributes: IHeaderAttribute[], report: (markers: IMarkerData) => void): undefined {
		const attribute = attributes.find(attr => attr.key === PromptHeaderAttributes.excludeAgent);
		if (!attribute) {
			return;
		}
		if (attribute.value.type !== 'array') {
			report(toMarker(localize('promptValidator.excludeAgentMustBeArray', "The 'excludeAgent' attribute must be an array."), attribute.value.range, MarkerSeverity.Error));
			return;
		}
	}

	private validateHandoffs(attributes: IHeaderAttribute[], report: (markers: IMarkerData) => void): undefined {
		const attribute = attributes.find(attr => attr.key === PromptHeaderAttributes.handOffs);
		if (!attribute) {
			return;
		}
		if (attribute.value.type !== 'array') {
			report(toMarker(localize('promptValidator.handoffsMustBeArray', "The 'handoffs' attribute must be an array."), attribute.value.range, MarkerSeverity.Error));
			return;
		}
		for (const item of attribute.value.items) {
			if (item.type !== 'object') {
				report(toMarker(localize('promptValidator.eachHandoffMustBeObject', "Each handoff in the 'handoffs' attribute must be an object with 'label', 'agent', 'prompt' and optional 'send'."), item.range, MarkerSeverity.Error));
				continue;
			}
			const required = new Set(['label', 'agent', 'prompt']);
			for (const prop of item.properties) {
				switch (prop.key.value) {
					case 'label':
						if (prop.value.type !== 'string' || prop.value.value.trim().length === 0) {
							report(toMarker(localize('promptValidator.handoffLabelMustBeNonEmptyString', "The 'label' property in a handoff must be a non-empty string."), prop.value.range, MarkerSeverity.Error));
						}
						break;
					case 'agent':
						if (prop.value.type !== 'string' || prop.value.value.trim().length === 0) {
							report(toMarker(localize('promptValidator.handoffAgentMustBeNonEmptyString', "The 'agent' property in a handoff must be a non-empty string."), prop.value.range, MarkerSeverity.Error));
						} else {
							this.validateAgentValue(prop.value, report);
						}
						break;
					case 'prompt':
						if (prop.value.type !== 'string') {
							report(toMarker(localize('promptValidator.handoffPromptMustBeString', "The 'prompt' property in a handoff must be a string."), prop.value.range, MarkerSeverity.Error));
						}
						break;
					case 'send':
						if (prop.value.type !== 'boolean') {
							report(toMarker(localize('promptValidator.handoffSendMustBeBoolean', "The 'send' property in a handoff must be a boolean."), prop.value.range, MarkerSeverity.Error));
						}
						break;
					case 'showContinueOn':
						if (prop.value.type !== 'boolean') {
							report(toMarker(localize('promptValidator.handoffShowContinueOnMustBeBoolean', "The 'showContinueOn' property in a handoff must be a boolean."), prop.value.range, MarkerSeverity.Error));
						}
						break;
					default:
						report(toMarker(localize('promptValidator.unknownHandoffProperty', "Unknown property '{0}' in handoff object. Supported properties are 'label', 'agent', 'prompt' and optional 'send', 'showContinueOn'.", prop.key.value), prop.value.range, MarkerSeverity.Warning));
				}
				required.delete(prop.key.value);
			}
			if (required.size > 0) {
				report(toMarker(localize('promptValidator.missingHandoffProperties', "Missing required properties {0} in handoff object.", Array.from(required).map(s => `'${s}'`).join(', ')), item.range, MarkerSeverity.Error));
			}
		}
	}

	private validateInfer(attributes: IHeaderAttribute[], report: (markers: IMarkerData) => void): undefined {
		const attribute = attributes.find(attr => attr.key === PromptHeaderAttributes.infer);
		if (!attribute) {
			return;
		}
		if (attribute.value.type !== 'boolean') {
			report(toMarker(localize('promptValidator.inferMustBeBoolean', "The 'infer' attribute must be a boolean."), attribute.value.range, MarkerSeverity.Error));
			return;
		}
	}

	private validateTarget(attributes: IHeaderAttribute[], report: (markers: IMarkerData) => void): undefined {
		const attribute = attributes.find(attr => attr.key === PromptHeaderAttributes.target);
		if (!attribute) {
			return;
		}
		if (attribute.value.type !== 'string') {
			report(toMarker(localize('promptValidator.targetMustBeString', "The 'target' attribute must be a string."), attribute.value.range, MarkerSeverity.Error));
			return;
		}
		const targetValue = attribute.value.value.trim();
		if (targetValue.length === 0) {
			report(toMarker(localize('promptValidator.targetMustBeNonEmpty', "The 'target' attribute must be a non-empty string."), attribute.value.range, MarkerSeverity.Error));
			return;
		}
		const validTargets = ['github-copilot', 'vscode'];
		if (!validTargets.includes(targetValue)) {
			report(toMarker(localize('promptValidator.targetInvalidValue', "The 'target' attribute must be one of: {0}.", validTargets.join(', ')), attribute.value.range, MarkerSeverity.Error));
		}
	}
}

const allAttributeNames = {
	[PromptsType.prompt]: [PromptHeaderAttributes.name, PromptHeaderAttributes.description, PromptHeaderAttributes.model, PromptHeaderAttributes.tools, PromptHeaderAttributes.mode, PromptHeaderAttributes.agent, PromptHeaderAttributes.argumentHint],
	[PromptsType.instructions]: [PromptHeaderAttributes.name, PromptHeaderAttributes.description, PromptHeaderAttributes.applyTo, PromptHeaderAttributes.excludeAgent],
	[PromptsType.agent]: [PromptHeaderAttributes.name, PromptHeaderAttributes.description, PromptHeaderAttributes.model, PromptHeaderAttributes.tools, PromptHeaderAttributes.advancedOptions, PromptHeaderAttributes.handOffs, PromptHeaderAttributes.argumentHint, PromptHeaderAttributes.target, PromptHeaderAttributes.infer]
};
const githubCopilotAgentAttributeNames = [PromptHeaderAttributes.name, PromptHeaderAttributes.description, PromptHeaderAttributes.tools, PromptHeaderAttributes.target, GithubPromptHeaderAttributes.mcpServers, PromptHeaderAttributes.infer];
const recommendedAttributeNames = {
	[PromptsType.prompt]: allAttributeNames[PromptsType.prompt].filter(name => !isNonRecommendedAttribute(name)),
	[PromptsType.instructions]: allAttributeNames[PromptsType.instructions].filter(name => !isNonRecommendedAttribute(name)),
	[PromptsType.agent]: allAttributeNames[PromptsType.agent].filter(name => !isNonRecommendedAttribute(name))
};

export function getValidAttributeNames(promptType: PromptsType, includeNonRecommended: boolean, isGitHubTarget: boolean): string[] {
	if (isGitHubTarget && promptType === PromptsType.agent) {
		return githubCopilotAgentAttributeNames;
	}
	return includeNonRecommended ? allAttributeNames[promptType] : recommendedAttributeNames[promptType];
}

export function isNonRecommendedAttribute(attributeName: string): boolean {
	return attributeName === PromptHeaderAttributes.advancedOptions || attributeName === PromptHeaderAttributes.excludeAgent || attributeName === PromptHeaderAttributes.mode;
}

// The list of tools known to be used by GitHub Copilot custom agents
export const knownGithubCopilotTools = [
	SpecedToolAliases.execute, SpecedToolAliases.read, SpecedToolAliases.edit, SpecedToolAliases.search, SpecedToolAliases.agent,
];

export function isGithubTarget(promptType: PromptsType, target: string | undefined): boolean {
	return promptType === PromptsType.agent && target === Target.GitHubCopilot;
}

function toMarker(message: string, range: Range, severity = MarkerSeverity.Error): IMarkerData {
	return { severity, message, ...range };
}

export class PromptValidatorContribution extends Disposable {

	private readonly validator: PromptValidator;
	private readonly localDisposables = this._register(new DisposableStore());

	constructor(
		@IModelService private modelService: IModelService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IMarkerService private readonly markerService: IMarkerService,
		@IPromptsService private readonly promptsService: IPromptsService,
		@ILanguageModelsService private readonly languageModelsService: ILanguageModelsService,
		@ILanguageModelToolsService private readonly languageModelToolsService: ILanguageModelToolsService,
		@IChatModeService private readonly chatModeService: IChatModeService,
	) {
		super();
		this.validator = instantiationService.createInstance(PromptValidator);

		this.updateRegistration();
	}

	updateRegistration(): void {
		this.localDisposables.clear();
		const trackers = new ResourceMap<ModelTracker>();
		this.localDisposables.add(toDisposable(() => {
			trackers.forEach(tracker => tracker.dispose());
			trackers.clear();
		}));
		this.modelService.getModels().forEach(model => {
			const promptType = getPromptsTypeForLanguageId(model.getLanguageId());
			if (promptType) {
				trackers.set(model.uri, new ModelTracker(model, promptType, this.validator, this.promptsService, this.markerService));
			}
		});

		this.localDisposables.add(this.modelService.onModelAdded((model) => {
			const promptType = getPromptsTypeForLanguageId(model.getLanguageId());
			if (promptType && !trackers.has(model.uri)) {
				trackers.set(model.uri, new ModelTracker(model, promptType, this.validator, this.promptsService, this.markerService));
			}
		}));
		this.localDisposables.add(this.modelService.onModelRemoved((model) => {
			const tracker = trackers.get(model.uri);
			if (tracker) {
				tracker.dispose();
				trackers.delete(model.uri);
			}
		}));
		this.localDisposables.add(this.modelService.onModelLanguageChanged((event) => {
			const { model } = event;
			const tracker = trackers.get(model.uri);
			if (tracker) {
				tracker.dispose();
				trackers.delete(model.uri);
			}
			const promptType = getPromptsTypeForLanguageId(model.getLanguageId());
			if (promptType) {
				trackers.set(model.uri, new ModelTracker(model, promptType, this.validator, this.promptsService, this.markerService));
			}
		}));

		const validateAll = (): void => trackers.forEach(tracker => tracker.validate());
		this.localDisposables.add(this.languageModelToolsService.onDidChangeTools(() => validateAll()));
		this.localDisposables.add(this.chatModeService.onDidChangeChatModes(() => validateAll()));
		this.localDisposables.add(this.languageModelsService.onDidChangeLanguageModels(() => validateAll()));
	}
}

class ModelTracker extends Disposable {

	private readonly delayer: Delayer<void>;

	constructor(
		private readonly textModel: ITextModel,
		private readonly promptType: PromptsType,
		private readonly validator: PromptValidator,
		@IPromptsService private readonly promptsService: IPromptsService,
		@IMarkerService private readonly markerService: IMarkerService,
	) {
		super();
		this.delayer = this._register(new Delayer<void>(200));
		this._register(textModel.onDidChangeContent(() => this.validate()));
		this.validate();
	}

	public validate(): void {
		this.delayer.trigger(async () => {
			const markers: IMarkerData[] = [];
			const ast = this.promptsService.getParsedPromptFile(this.textModel);
			await this.validator.validate(ast, this.promptType, m => markers.push(m));
			this.markerService.changeOne(MARKERS_OWNER_ID, this.textModel.uri, markers);
		});
	}

	public override dispose() {
		this.markerService.remove(MARKERS_OWNER_ID, [this.textModel.uri]);
		super.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/promptSyntax/service/promptsService.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/promptSyntax/service/promptsService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../../../base/common/cancellation.js';
import { Event } from '../../../../../../base/common/event.js';
import { IDisposable } from '../../../../../../base/common/lifecycle.js';
import { URI } from '../../../../../../base/common/uri.js';
import { ITextModel } from '../../../../../../editor/common/model.js';
import { ExtensionIdentifier, IExtensionDescription } from '../../../../../../platform/extensions/common/extensions.js';
import { createDecorator } from '../../../../../../platform/instantiation/common/instantiation.js';
import { IChatModeInstructions, IVariableReference } from '../../chatModes.js';
import { PromptsType } from '../promptTypes.js';
import { IHandOff, ParsedPromptFile } from '../promptFileParser.js';
import { ResourceSet } from '../../../../../../base/common/map.js';

/**
 * Activation event for custom agent providers.
 */
export const CUSTOM_AGENTS_PROVIDER_ACTIVATION_EVENT = 'onCustomAgentsProvider';

/**
 * Options for querying custom agents.
 */
export interface ICustomAgentQueryOptions { }

/**
 * Represents a custom agent resource from an external provider.
 */
export interface IExternalCustomAgent {
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
	readonly uri: URI;

	/**
	 * Indicates whether the custom agent resource is editable. Defaults to false.
	 */
	readonly isEditable?: boolean;
}

/**
 * Provides prompt services.
 */
export const IPromptsService = createDecorator<IPromptsService>('IPromptsService');

/**
 * Where the prompt is stored.
 */
export enum PromptsStorage {
	local = 'local',
	user = 'user',
	extension = 'extension'
}

/**
 * The type of source for extension agents.
 */
export enum ExtensionAgentSourceType {
	contribution = 'contribution',
	provider = 'provider',
}

/**
 * Represents a prompt path with its type.
 * This is used for both prompt files and prompt source folders.
 */
export type IPromptPath = IExtensionPromptPath | ILocalPromptPath | IUserPromptPath;


export interface IPromptPathBase {
	/**
	 * URI of the prompt.
	 */
	readonly uri: URI;

	/**
	 * Storage of the prompt.
	 */
	readonly storage: PromptsStorage;

	/**
	 * Type of the prompt (e.g. 'prompt' or 'instructions').
	 */
	readonly type: PromptsType;

	/**
	 * Identifier of the contributing extension (only when storage === PromptsStorage.extension).
	 */
	readonly extension?: IExtensionDescription;

	readonly name?: string;

	readonly description?: string;
}

export interface IExtensionPromptPath extends IPromptPathBase {
	readonly storage: PromptsStorage.extension;
	readonly extension: IExtensionDescription;
	readonly source: ExtensionAgentSourceType;
	readonly name?: string;
	readonly description?: string;
}
export interface ILocalPromptPath extends IPromptPathBase {
	readonly storage: PromptsStorage.local;
}
export interface IUserPromptPath extends IPromptPathBase {
	readonly storage: PromptsStorage.user;
}

export type IAgentSource = {
	readonly storage: PromptsStorage.extension;
	readonly extensionId: ExtensionIdentifier;
	readonly type: ExtensionAgentSourceType;
} | {
	readonly storage: PromptsStorage.local | PromptsStorage.user;
};

export interface ICustomAgent {
	/**
	 * URI of a custom agent file.
	 */
	readonly uri: URI;

	/**
	 * Name of the custom agent as used in prompt files or contexts
	 */
	readonly name: string;

	/**
	 * Description of the agent
	 */
	readonly description?: string;

	/**
	 * Tools metadata in the prompt header.
	 */
	readonly tools?: readonly string[];

	/**
	 * Model metadata in the prompt header.
	 */
	readonly model?: string;

	/**
	 * Argument hint metadata in the prompt header that describes what inputs the agent expects or supports.
	 */
	readonly argumentHint?: string;

	/**
	 * Target metadata in the prompt header.
	 */
	readonly target?: string;

	/**
	 * Infer metadata in the prompt header.
	 */
	readonly infer?: boolean;

	/**
	 * Contents of the custom agent file body and other agent instructions.
	 */
	readonly agentInstructions: IChatModeInstructions;

	/**
	 * Hand-offs defined in the custom agent file.
	 */
	readonly handOffs?: readonly IHandOff[];

	/**
	 * Where the agent was loaded from.
	 */
	readonly source: IAgentSource;
}

export interface IAgentInstructions {
	readonly content: string;
	readonly toolReferences: readonly IVariableReference[];
	readonly metadata?: Record<string, boolean | string | number>;
}

export interface IChatPromptSlashCommand {
	readonly name: string;
	readonly description: string | undefined;
	readonly argumentHint: string | undefined;
	readonly promptPath: IPromptPath;
	readonly parsedPromptFile: ParsedPromptFile;
}

export interface IAgentSkill {
	readonly uri: URI;
	readonly type: 'personal' | 'project';
	readonly name: string;
	readonly description: string | undefined;
}

/**
 * Provides prompt services.
 */
export interface IPromptsService extends IDisposable {
	readonly _serviceBrand: undefined;

	/**
	 * The parsed prompt file for the provided text model.
	 * @param textModel Returns the parsed prompt file.
	 */
	getParsedPromptFile(textModel: ITextModel): ParsedPromptFile;

	/**
	 * List all available prompt files.
	 */
	listPromptFiles(type: PromptsType, token: CancellationToken): Promise<readonly IPromptPath[]>;

	/**
	 * List all available prompt files.
	 */
	listPromptFilesForStorage(type: PromptsType, storage: PromptsStorage, token: CancellationToken): Promise<readonly IPromptPath[]>;

	/**
	 * Get a list of prompt source folders based on the provided prompt type.
	 */
	getSourceFolders(type: PromptsType): readonly IPromptPath[];

	/**
	 * Validates if the provided command name is a valid prompt slash command.
	 */
	isValidSlashCommandName(name: string): boolean;

	/**
	 * Gets the prompt file for a slash command.
	 */
	resolvePromptSlashCommand(command: string, token: CancellationToken): Promise<IChatPromptSlashCommand | undefined>;

	/**
	 * Event that is triggered when the slash command to ParsedPromptFile cache is updated.
	 * Event handlers can use {@link resolvePromptSlashCommand} to retrieve the latest data.
	 */
	readonly onDidChangeSlashCommands: Event<void>;

	/**
	 * Returns a prompt command if the command name is valid.
	 */
	getPromptSlashCommands(token: CancellationToken): Promise<readonly IChatPromptSlashCommand[]>;

	/**
	 * Returns the prompt command name for the given URI.
	 */
	getPromptSlashCommandName(uri: URI, token: CancellationToken): Promise<string>;

	/**
	 * Event that is triggered when the list of custom agents changes.
	 */
	readonly onDidChangeCustomAgents: Event<void>;

	/**
	 * Finds all available custom agents
	 */
	getCustomAgents(token: CancellationToken): Promise<readonly ICustomAgent[]>;

	/**
	 * Parses the provided URI
	 * @param uris
	 */
	parseNew(uri: URI, token: CancellationToken): Promise<ParsedPromptFile>;

	/**
	 * Internal: register a contributed file. Returns a disposable that removes the contribution.
	 * Not intended for extension authors; used by contribution point handler.
	 */
	registerContributedFile(type: PromptsType, uri: URI, extension: IExtensionDescription, name: string | undefined, description: string | undefined): IDisposable;


	getPromptLocationLabel(promptPath: IPromptPath): string;

	/**
	 * Gets list of all AGENTS.md files in the workspace.
	 */
	findAgentMDsInWorkspace(token: CancellationToken): Promise<URI[]>;

	/**
	 * Gets list of AGENTS.md files.
	 * @param includeNested Whether to include AGENTS.md files from subfolders, or only from the root.
	 */
	listAgentMDs(token: CancellationToken, includeNested: boolean): Promise<URI[]>;

	/**
	 * Gets list of .github/copilot-instructions.md files.
	 */
	listCopilotInstructionsMDs(token: CancellationToken): Promise<URI[]>;

	/**
	 * For a chat mode file URI, return the name of the agent file that it should use.
	 * @param oldURI
	 */
	getAgentFileURIFromModeFile(oldURI: URI): URI | undefined;

	/**
	 * Returns the list of disabled prompt file URIs for a given type. By default no prompt files are disabled.
	 */
	getDisabledPromptFiles(type: PromptsType): ResourceSet;

	/**
	 * Persists the set of disabled prompt file URIs for the given type.
	 */
	setDisabledPromptFiles(type: PromptsType, uris: ResourceSet): void;

	/**
	 * Registers a CustomAgentsProvider that can provide custom agents for repositories.
	 * This is part of the proposed API and requires the chatParticipantPrivate proposal.
	 * @param extension The extension registering the provider.
	 * @param provider The provider implementation with optional change event.
	 * @returns A disposable that unregisters the provider when disposed.
	 */
	registerCustomAgentsProvider(extension: IExtensionDescription, provider: {
		onDidChangeCustomAgents?: Event<void>;
		provideCustomAgents: (options: ICustomAgentQueryOptions, token: CancellationToken) => Promise<IExternalCustomAgent[] | undefined>;
	}): IDisposable;

	/**
	 * Gets list of agent skills files.
	 */
	findAgentSkills(token: CancellationToken): Promise<IAgentSkill[] | undefined>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/promptSyntax/service/promptsServiceImpl.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/promptSyntax/service/promptsServiceImpl.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../../../base/common/cancellation.js';
import { CancellationError } from '../../../../../../base/common/errors.js';
import { Emitter, Event } from '../../../../../../base/common/event.js';
import { Disposable, DisposableStore, IDisposable } from '../../../../../../base/common/lifecycle.js';
import { ResourceMap, ResourceSet } from '../../../../../../base/common/map.js';
import { dirname, isEqual } from '../../../../../../base/common/resources.js';
import { URI } from '../../../../../../base/common/uri.js';
import { OffsetRange } from '../../../../../../editor/common/core/ranges/offsetRange.js';
import { type ITextModel } from '../../../../../../editor/common/model.js';
import { IModelService } from '../../../../../../editor/common/services/model.js';
import { localize } from '../../../../../../nls.js';
import { IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';
import { IExtensionDescription } from '../../../../../../platform/extensions/common/extensions.js';
import { FileOperationError, FileOperationResult, IFileService } from '../../../../../../platform/files/common/files.js';
import { IExtensionService } from '../../../../../services/extensions/common/extensions.js';
import { IInstantiationService } from '../../../../../../platform/instantiation/common/instantiation.js';
import { ILabelService } from '../../../../../../platform/label/common/label.js';
import { ILogService } from '../../../../../../platform/log/common/log.js';
import { IFilesConfigurationService } from '../../../../../services/filesConfiguration/common/filesConfigurationService.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../../../platform/storage/common/storage.js';
import { IUserDataProfileService } from '../../../../../services/userDataProfile/common/userDataProfile.js';
import { IVariableReference } from '../../chatModes.js';
import { PromptsConfig } from '../config/config.js';
import { IDefaultAccountService } from '../../../../../../platform/defaultAccount/common/defaultAccount.js';
import { getCleanPromptName } from '../config/promptFileLocations.js';
import { PROMPT_LANGUAGE_ID, PromptsType, getPromptsTypeForLanguageId } from '../promptTypes.js';
import { PromptFilesLocator } from '../utils/promptFilesLocator.js';
import { PromptFileParser, ParsedPromptFile, PromptHeaderAttributes } from '../promptFileParser.js';
import { IAgentInstructions, IAgentSource, IChatPromptSlashCommand, ICustomAgent, IExtensionPromptPath, ILocalPromptPath, IPromptPath, IPromptsService, IAgentSkill, IUserPromptPath, PromptsStorage, ICustomAgentQueryOptions, IExternalCustomAgent, ExtensionAgentSourceType, CUSTOM_AGENTS_PROVIDER_ACTIVATION_EVENT } from './promptsService.js';
import { Delayer } from '../../../../../../base/common/async.js';
import { Schemas } from '../../../../../../base/common/network.js';

/**
 * Provides prompt services.
 */
export class PromptsService extends Disposable implements IPromptsService {
	public declare readonly _serviceBrand: undefined;

	/**
	 * Prompt files locator utility.
	 */
	private readonly fileLocator: PromptFilesLocator;

	/**
	 * Cached custom agents. Caching only happens if the `onDidChangeCustomAgents` event is used.
	 */
	private readonly cachedCustomAgents: CachedPromise<readonly ICustomAgent[]>;

	/**
	 * Cached slash commands. Caching only happens if the `onDidChangeSlashCommands` event is used.
	 */
	private readonly cachedSlashCommands: CachedPromise<readonly IChatPromptSlashCommand[]>;

	/**
	 * Cache for parsed prompt files keyed by URI.
	 * The number in the returned tuple is textModel.getVersionId(), which is an internal VS Code counter that increments every time the text model's content changes.
	 */
	private readonly cachedParsedPromptFromModels = new ResourceMap<[number, ParsedPromptFile]>();

	/**
	 * Cached file locations commands. Caching only happens if the corresponding `fileLocatorEvents` event is used.
	 */
	private readonly cachedFileLocations: { [key in PromptsType]?: Promise<readonly IPromptPath[]> } = {};

	/**
	 * Lazily created events that notify listeners when the file locations for a given prompt type change.
	 * An event is created on demand for each prompt type and can be used by consumers to react to updates
	 * in the set of prompt files (e.g., when prompt files are added, removed, or modified).
	 */
	private readonly fileLocatorEvents: { [key in PromptsType]?: Event<void> } = {};


	/**
	 * Contributed files from extensions keyed by prompt type then name.
	 */
	private readonly contributedFiles = {
		[PromptsType.prompt]: new ResourceMap<Promise<IExtensionPromptPath>>(),
		[PromptsType.instructions]: new ResourceMap<Promise<IExtensionPromptPath>>(),
		[PromptsType.agent]: new ResourceMap<Promise<IExtensionPromptPath>>(),
	};

	constructor(
		@ILogService public readonly logger: ILogService,
		@ILabelService private readonly labelService: ILabelService,
		@IModelService private readonly modelService: IModelService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IUserDataProfileService private readonly userDataService: IUserDataProfileService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IFileService private readonly fileService: IFileService,
		@IFilesConfigurationService private readonly filesConfigService: IFilesConfigurationService,
		@IStorageService private readonly storageService: IStorageService,
		@IExtensionService private readonly extensionService: IExtensionService,
		@IDefaultAccountService private readonly defaultAccountService: IDefaultAccountService
	) {
		super();

		this.fileLocator = this.instantiationService.createInstance(PromptFilesLocator);
		this._register(this.modelService.onModelRemoved((model) => {
			this.cachedParsedPromptFromModels.delete(model.uri);
		}));

		const modelChangeEvent = this._register(new ModelChangeTracker(this.modelService)).onDidPromptChange;
		this.cachedCustomAgents = this._register(new CachedPromise(
			(token) => this.computeCustomAgents(token),
			() => Event.any(this.getFileLocatorEvent(PromptsType.agent), Event.filter(modelChangeEvent, e => e.promptType === PromptsType.agent))
		));

		this.cachedSlashCommands = this._register(new CachedPromise(
			(token) => this.computePromptSlashCommands(token),
			() => Event.any(this.getFileLocatorEvent(PromptsType.prompt), Event.filter(modelChangeEvent, e => e.promptType === PromptsType.prompt))
		));
	}

	private getFileLocatorEvent(type: PromptsType): Event<void> {
		let event = this.fileLocatorEvents[type];
		if (!event) {
			event = this.fileLocatorEvents[type] = this._register(this.fileLocator.createFilesUpdatedEvent(type)).event;
			this._register(event(() => {
				this.cachedFileLocations[type] = undefined;
			}));
		}
		return event;
	}

	public getParsedPromptFile(textModel: ITextModel): ParsedPromptFile {
		const cached = this.cachedParsedPromptFromModels.get(textModel.uri);
		if (cached && cached[0] === textModel.getVersionId()) {
			return cached[1];
		}
		const ast = new PromptFileParser().parse(textModel.uri, textModel.getValue());
		if (!cached || cached[0] < textModel.getVersionId()) {
			this.cachedParsedPromptFromModels.set(textModel.uri, [textModel.getVersionId(), ast]);
		}
		return ast;
	}

	public async listPromptFiles(type: PromptsType, token: CancellationToken): Promise<readonly IPromptPath[]> {
		let listPromise = this.cachedFileLocations[type];
		if (!listPromise) {
			listPromise = this.computeListPromptFiles(type, token);
			if (!this.fileLocatorEvents[type]) {
				return listPromise;
			}
			this.cachedFileLocations[type] = listPromise;
			return listPromise;
		}
		return listPromise;
	}

	private async computeListPromptFiles(type: PromptsType, token: CancellationToken): Promise<readonly IPromptPath[]> {
		const prompts = await Promise.all([
			this.fileLocator.listFiles(type, PromptsStorage.user, token).then(uris => uris.map(uri => ({ uri, storage: PromptsStorage.user, type } satisfies IUserPromptPath))),
			this.fileLocator.listFiles(type, PromptsStorage.local, token).then(uris => uris.map(uri => ({ uri, storage: PromptsStorage.local, type } satisfies ILocalPromptPath))),
			this.getExtensionPromptFiles(type, token),
		]);

		return [...prompts.flat()];
	}

	/**
	 * Registry of CustomAgentsProvider instances. Extensions can register providers via the proposed API.
	 */
	private readonly customAgentsProviders: Array<{
		extension: IExtensionDescription;
		onDidChangeCustomAgents?: Event<void>;
		provideCustomAgents: (options: ICustomAgentQueryOptions, token: CancellationToken) => Promise<IExternalCustomAgent[] | undefined>;
	}> = [];

	/**
	 * Registers a CustomAgentsProvider. This will be called by the extension host bridge when
	 * an extension registers a provider via vscode.chat.registerCustomAgentsProvider().
	 */
	public registerCustomAgentsProvider(extension: IExtensionDescription, provider: {
		onDidChangeCustomAgents?: Event<void>;
		provideCustomAgents: (options: ICustomAgentQueryOptions, token: CancellationToken) => Promise<IExternalCustomAgent[] | undefined>;
	}): IDisposable {
		const providerEntry = { extension, ...provider };
		this.customAgentsProviders.push(providerEntry);

		const disposables = new DisposableStore();

		// Listen to provider change events to rerun computeListPromptFiles
		if (provider.onDidChangeCustomAgents) {
			disposables.add(provider.onDidChangeCustomAgents(() => {
				this.cachedFileLocations[PromptsType.agent] = undefined;
				this.cachedCustomAgents.refresh();
			}));
		}

		// Invalidate agent cache when providers change
		this.cachedFileLocations[PromptsType.agent] = undefined;
		this.cachedCustomAgents.refresh();

		disposables.add({
			dispose: () => {
				const index = this.customAgentsProviders.findIndex((p) => p === providerEntry);
				if (index >= 0) {
					this.customAgentsProviders.splice(index, 1);
					this.cachedFileLocations[PromptsType.agent] = undefined;
					this.cachedCustomAgents.refresh();
				}
			}
		});

		return disposables;
	}

	private async listCustomAgentsFromProvider(token: CancellationToken): Promise<IPromptPath[]> {
		const result: IPromptPath[] = [];

		if (this.customAgentsProviders.length === 0) {
			return result;
		}

		// Activate extensions that might provide custom agents
		await this.extensionService.activateByEvent(CUSTOM_AGENTS_PROVIDER_ACTIVATION_EVENT);

		// Collect agents from all providers
		for (const providerEntry of this.customAgentsProviders) {
			try {
				const agents = await providerEntry.provideCustomAgents({}, token);
				if (!agents || token.isCancellationRequested) {
					continue;
				}

				for (const agent of agents) {
					if (!agent.isEditable) {
						try {
							await this.filesConfigService.updateReadonly(agent.uri, true);
						} catch (e) {
							const msg = e instanceof Error ? e.message : String(e);
							this.logger.error(`[listCustomAgentsFromProvider] Failed to make agent file readonly: ${agent.uri}`, msg);
						}
					}

					result.push({
						uri: agent.uri,
						name: agent.name,
						description: agent.description,
						storage: PromptsStorage.extension,
						type: PromptsType.agent,
						extension: providerEntry.extension,
						source: ExtensionAgentSourceType.provider
					} satisfies IExtensionPromptPath);
				}
			} catch (e) {
				this.logger.error(`[listCustomAgentsFromProvider] Failed to get custom agents from provider`, e instanceof Error ? e.message : String(e));
			}
		}

		return result;
	}



	public async listPromptFilesForStorage(type: PromptsType, storage: PromptsStorage, token: CancellationToken): Promise<readonly IPromptPath[]> {
		switch (storage) {
			case PromptsStorage.extension:
				return this.getExtensionPromptFiles(type, token);
			case PromptsStorage.local:
				return this.fileLocator.listFiles(type, PromptsStorage.local, token).then(uris => uris.map(uri => ({ uri, storage: PromptsStorage.local, type } satisfies ILocalPromptPath)));
			case PromptsStorage.user:
				return this.fileLocator.listFiles(type, PromptsStorage.user, token).then(uris => uris.map(uri => ({ uri, storage: PromptsStorage.user, type } satisfies IUserPromptPath)));
			default:
				throw new Error(`[listPromptFilesForStorage] Unsupported prompt storage type: ${storage}`);
		}
	}

	private async getExtensionPromptFiles(type: PromptsType, token: CancellationToken): Promise<IPromptPath[]> {
		await this.extensionService.whenInstalledExtensionsRegistered();
		const contributedFiles = await Promise.all(this.contributedFiles[type].values());
		if (type === PromptsType.agent) {
			const providerAgents = await this.listCustomAgentsFromProvider(token);
			return [...contributedFiles, ...providerAgents];
		}
		return contributedFiles;
	}

	public getSourceFolders(type: PromptsType): readonly IPromptPath[] {
		const result: IPromptPath[] = [];

		if (type === PromptsType.agent) {
			const folders = this.fileLocator.getAgentSourceFolder();
			for (const uri of folders) {
				result.push({ uri, storage: PromptsStorage.local, type });
			}
		} else {
			for (const uri of this.fileLocator.getConfigBasedSourceFolders(type)) {
				result.push({ uri, storage: PromptsStorage.local, type });
			}
		}

		const userHome = this.userDataService.currentProfile.promptsHome;
		result.push({ uri: userHome, storage: PromptsStorage.user, type });

		return result;
	}

	// slash prompt commands

	/**
	 * Emitter for slash commands change events.
	 */
	public get onDidChangeSlashCommands(): Event<void> {
		return this.cachedSlashCommands.onDidChange;
	}

	public async getPromptSlashCommands(token: CancellationToken): Promise<readonly IChatPromptSlashCommand[]> {
		return this.cachedSlashCommands.get(token);
	}

	private async computePromptSlashCommands(token: CancellationToken): Promise<readonly IChatPromptSlashCommand[]> {
		const promptFiles = await this.listPromptFiles(PromptsType.prompt, token);
		const details = await Promise.all(promptFiles.map(async promptPath => {
			try {
				const parsedPromptFile = await this.parseNew(promptPath.uri, token);
				return this.asChatPromptSlashCommand(parsedPromptFile, promptPath);
			} catch (e) {
				this.logger.error(`[computePromptSlashCommands] Failed to parse prompt file for slash command: ${promptPath.uri}`, e instanceof Error ? e.message : String(e));
				return undefined;
			}
		}));
		const result = [];
		const seen = new ResourceSet();
		for (const detail of details) {
			if (detail) {
				result.push(detail);
				seen.add(detail.promptPath.uri);
			}
		}
		for (const model of this.modelService.getModels()) {
			if (model.getLanguageId() === PROMPT_LANGUAGE_ID && model.uri.scheme === Schemas.untitled && !seen.has(model.uri)) {
				const parsedPromptFile = this.getParsedPromptFile(model);
				result.push(this.asChatPromptSlashCommand(parsedPromptFile, { uri: model.uri, storage: PromptsStorage.local, type: PromptsType.prompt }));
			}
		}
		return result;
	}

	public isValidSlashCommandName(command: string): boolean {
		return command.match(/^[\p{L}\d_\-\.]+$/u) !== null;
	}

	public async resolvePromptSlashCommand(name: string, token: CancellationToken): Promise<IChatPromptSlashCommand | undefined> {
		const commands = await this.getPromptSlashCommands(token);
		return commands.find(cmd => cmd.name === name);
	}

	private asChatPromptSlashCommand(parsedPromptFile: ParsedPromptFile, promptPath: IPromptPath): IChatPromptSlashCommand {
		let name = parsedPromptFile?.header?.name ?? promptPath.name ?? getCleanPromptName(promptPath.uri);
		name = name.replace(/[^\p{L}\d_\-\.]+/gu, '-'); // replace spaces with dashes
		return {
			name: name,
			description: parsedPromptFile?.header?.description ?? promptPath.description,
			argumentHint: parsedPromptFile?.header?.argumentHint,
			parsedPromptFile,
			promptPath
		};
	}

	public async getPromptSlashCommandName(uri: URI, token: CancellationToken): Promise<string> {
		const slashCommands = await this.getPromptSlashCommands(token);
		const slashCommand = slashCommands.find(c => isEqual(c.promptPath.uri, uri));
		if (!slashCommand) {
			return getCleanPromptName(uri);
		}
		return slashCommand.name;
	}

	// custom agents

	/**
	 * Emitter for custom agents change events.
	 */
	public get onDidChangeCustomAgents(): Event<void> {
		return this.cachedCustomAgents.onDidChange;
	}

	public async getCustomAgents(token: CancellationToken): Promise<readonly ICustomAgent[]> {
		return this.cachedCustomAgents.get(token);
	}

	private async computeCustomAgents(token: CancellationToken): Promise<readonly ICustomAgent[]> {
		let agentFiles = await this.listPromptFiles(PromptsType.agent, token);
		const disabledAgents = this.getDisabledPromptFiles(PromptsType.agent);
		agentFiles = agentFiles.filter(promptPath => !disabledAgents.has(promptPath.uri));
		const customAgentsResults = await Promise.allSettled(
			agentFiles.map(async (promptPath): Promise<ICustomAgent> => {
				const uri = promptPath.uri;
				const ast = await this.parseNew(uri, token);

				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				let metadata: any | undefined;
				if (ast.header) {
					const advanced = ast.header.getAttribute(PromptHeaderAttributes.advancedOptions);
					if (advanced && advanced.value.type === 'object') {
						metadata = {};
						for (const [key, value] of Object.entries(advanced.value)) {
							if (['string', 'number', 'boolean'].includes(value.type)) {
								metadata[key] = value;
							}
						}
					}
				}
				const toolReferences: IVariableReference[] = [];
				if (ast.body) {
					const bodyOffset = ast.body.offset;
					const bodyVarRefs = ast.body.variableReferences;
					for (let i = bodyVarRefs.length - 1; i >= 0; i--) { // in reverse order
						const { name, offset } = bodyVarRefs[i];
						const range = new OffsetRange(offset - bodyOffset, offset - bodyOffset + name.length + 1);
						toolReferences.push({ name, range });
					}
				}

				const agentInstructions = {
					content: ast.body?.getContent() ?? '',
					toolReferences,
					metadata,
				} satisfies IAgentInstructions;

				const name = ast.header?.name ?? promptPath.name ?? getCleanPromptName(uri);

				const source: IAgentSource = IAgentSource.fromPromptPath(promptPath);
				if (!ast.header) {
					return { uri, name, agentInstructions, source };
				}
				const { description, model, tools, handOffs, argumentHint, target, infer } = ast.header;
				return { uri, name, description, model, tools, handOffs, argumentHint, target, infer, agentInstructions, source };
			})
		);

		const customAgents: ICustomAgent[] = [];
		for (let i = 0; i < customAgentsResults.length; i++) {
			const result = customAgentsResults[i];
			if (result.status === 'fulfilled') {
				customAgents.push(result.value);
			} else {
				const uri = agentFiles[i].uri;
				const error = result.reason;
				if (error instanceof FileOperationError && error.fileOperationResult === FileOperationResult.FILE_NOT_FOUND) {
					this.logger.warn(`[computeCustomAgents] Skipping agent file that does not exist: ${uri}`, error.message);
				} else {
					this.logger.error(`[computeCustomAgents] Failed to parse agent file: ${uri}`, error);
				}
			}
		}

		return customAgents;
	}


	public async parseNew(uri: URI, token: CancellationToken): Promise<ParsedPromptFile> {
		const model = this.modelService.getModel(uri);
		if (model) {
			return this.getParsedPromptFile(model);
		}
		const fileContent = await this.fileService.readFile(uri);
		if (token.isCancellationRequested) {
			throw new CancellationError();
		}
		return new PromptFileParser().parse(uri, fileContent.value.toString());
	}

	public registerContributedFile(type: PromptsType, uri: URI, extension: IExtensionDescription, name?: string, description?: string) {
		const bucket = this.contributedFiles[type];
		if (bucket.has(uri)) {
			// keep first registration per extension (handler filters duplicates per extension already)
			return Disposable.None;
		}
		const entryPromise = (async () => {
			try {
				await this.filesConfigService.updateReadonly(uri, true);
			} catch (e) {
				const msg = e instanceof Error ? e.message : String(e);
				this.logger.error(`[registerContributedFile] Failed to make prompt file readonly: ${uri}`, msg);
			}
			return { uri, name, description, storage: PromptsStorage.extension, type, extension, source: ExtensionAgentSourceType.contribution } satisfies IExtensionPromptPath;
		})();
		bucket.set(uri, entryPromise);

		const flushCachesIfRequired = () => {
			this.cachedFileLocations[type] = undefined;
			switch (type) {
				case PromptsType.agent:
					this.cachedCustomAgents.refresh();
					break;
				case PromptsType.prompt:
					this.cachedSlashCommands.refresh();
					break;
			}
		};
		flushCachesIfRequired();
		return {
			dispose: () => {
				bucket.delete(uri);
				flushCachesIfRequired();
			}
		};
	}

	getPromptLocationLabel(promptPath: IPromptPath): string {
		switch (promptPath.storage) {
			case PromptsStorage.local: return this.labelService.getUriLabel(dirname(promptPath.uri), { relative: true });
			case PromptsStorage.user: return localize('user-data-dir.capitalized', 'User Data');
			case PromptsStorage.extension: {
				return localize('extension.with.id', 'Extension: {0}', promptPath.extension.displayName ?? promptPath.extension.id);
			}
			default: throw new Error('Unknown prompt storage type');
		}
	}

	findAgentMDsInWorkspace(token: CancellationToken): Promise<URI[]> {
		return this.fileLocator.findAgentMDsInWorkspace(token);
	}

	public async listAgentMDs(token: CancellationToken, includeNested: boolean): Promise<URI[]> {
		const useAgentMD = this.configurationService.getValue(PromptsConfig.USE_AGENT_MD);
		if (!useAgentMD) {
			return [];
		}
		if (includeNested) {
			return await this.fileLocator.findAgentMDsInWorkspace(token);
		} else {
			return await this.fileLocator.findAgentMDsInWorkspaceRoots(token);
		}
	}

	public async listCopilotInstructionsMDs(token: CancellationToken): Promise<URI[]> {
		const useCopilotInstructionsFiles = this.configurationService.getValue(PromptsConfig.USE_COPILOT_INSTRUCTION_FILES);
		if (!useCopilotInstructionsFiles) {
			return [];
		}
		return await this.fileLocator.findCopilotInstructionsMDsInWorkspace(token);
	}

	public getAgentFileURIFromModeFile(oldURI: URI): URI | undefined {
		return this.fileLocator.getAgentFileURIFromModeFile(oldURI);
	}

	// --- Enabled Prompt Files -----------------------------------------------------------

	private readonly disabledPromptsStorageKeyPrefix = 'chat.disabledPromptFiles.';

	public getDisabledPromptFiles(type: PromptsType): ResourceSet {
		// Migration: if disabled key absent but legacy enabled key present, convert once.
		const disabledKey = this.disabledPromptsStorageKeyPrefix + type;
		const value = this.storageService.get(disabledKey, StorageScope.PROFILE, '[]');
		const result = new ResourceSet();
		try {
			const arr = JSON.parse(value);
			if (Array.isArray(arr)) {
				for (const s of arr) {
					try {
						result.add(URI.revive(s));
					} catch {
						// ignore
					}
				}
			}
		} catch {
			// ignore invalid storage values
		}
		return result;
	}

	public setDisabledPromptFiles(type: PromptsType, uris: ResourceSet): void {
		const disabled = Array.from(uris).map(uri => uri.toJSON());
		this.storageService.store(this.disabledPromptsStorageKeyPrefix + type, JSON.stringify(disabled), StorageScope.PROFILE, StorageTarget.USER);
		if (type === PromptsType.agent) {
			this.cachedCustomAgents.refresh();
		}
	}

	// Agent skills

	private sanitizeAgentSkillText(text: string): string {
		// Remove XML tags
		return text.replace(/<[^>]+>/g, '');
	}

	private truncateAgentSkillName(name: string, uri: URI): string {
		const MAX_NAME_LENGTH = 64;
		const sanitized = this.sanitizeAgentSkillText(name);
		if (sanitized !== name) {
			this.logger.warn(`[findAgentSkills] Agent skill name contains XML tags, removed: ${uri}`);
		}
		if (sanitized.length > MAX_NAME_LENGTH) {
			this.logger.warn(`[findAgentSkills] Agent skill name exceeds ${MAX_NAME_LENGTH} characters, truncated: ${uri}`);
			return sanitized.substring(0, MAX_NAME_LENGTH);
		}
		return sanitized;
	}

	private truncateAgentSkillDescription(description: string | undefined, uri: URI): string | undefined {
		if (!description) {
			return undefined;
		}
		const MAX_DESCRIPTION_LENGTH = 1024;
		const sanitized = this.sanitizeAgentSkillText(description);
		if (sanitized !== description) {
			this.logger.warn(`[findAgentSkills] Agent skill description contains XML tags, removed: ${uri}`);
		}
		if (sanitized.length > MAX_DESCRIPTION_LENGTH) {
			this.logger.warn(`[findAgentSkills] Agent skill description exceeds ${MAX_DESCRIPTION_LENGTH} characters, truncated: ${uri}`);
			return sanitized.substring(0, MAX_DESCRIPTION_LENGTH);
		}
		return sanitized;
	}

	public async findAgentSkills(token: CancellationToken): Promise<IAgentSkill[] | undefined> {
		const useAgentSkills = this.configurationService.getValue(PromptsConfig.USE_AGENT_SKILLS);
		const defaultAccount = await this.defaultAccountService.getDefaultAccount();
		const previewFeaturesEnabled = defaultAccount?.chat_preview_features_enabled ?? true;
		if (useAgentSkills && previewFeaturesEnabled) {
			const result: IAgentSkill[] = [];
			const process = async (uri: URI, type: 'personal' | 'project'): Promise<void> => {
				try {
					const parsedFile = await this.parseNew(uri, token);
					const name = parsedFile.header?.name;
					if (name) {
						const sanitizedName = this.truncateAgentSkillName(name, uri);
						const sanitizedDescription = this.truncateAgentSkillDescription(parsedFile.header?.description, uri);
						result.push({ uri, type, name: sanitizedName, description: sanitizedDescription } satisfies IAgentSkill);
					} else {
						this.logger.error(`[findAgentSkills] Agent skill file missing name attribute: ${uri}`);
					}
				} catch (e) {
					this.logger.error(`[findAgentSkills] Failed to parse Agent skill file: ${uri}`, e instanceof Error ? e.message : String(e));
				}
			};

			const workspaceSkills = await this.fileLocator.findAgentSkillsInWorkspace(token);
			await Promise.all(workspaceSkills.map(uri => process(uri, 'project')));
			const userSkills = await this.fileLocator.findAgentSkillsInUserHome(token);
			await Promise.all(userSkills.map(uri => process(uri, 'personal')));
			return result;
		}
		return undefined;
	}
}

// helpers

class CachedPromise<T> extends Disposable {
	private cachedPromise: Promise<T> | undefined = undefined;
	private onDidUpdatePromiseEmitter: Emitter<void> | undefined = undefined;

	constructor(private readonly computeFn: (token: CancellationToken) => Promise<T>, private readonly getEvent: () => Event<void>, private readonly delay: number = 0) {
		super();
	}

	public get onDidChange(): Event<void> {
		if (!this.onDidUpdatePromiseEmitter) {
			const emitter = this.onDidUpdatePromiseEmitter = this._register(new Emitter<void>());
			const delayer = this._register(new Delayer<void>(this.delay));
			this._register(this.getEvent()(() => {
				this.cachedPromise = undefined;
				delayer.trigger(() => emitter.fire());
			}));
		}
		return this.onDidUpdatePromiseEmitter.event;
	}

	public get(token: CancellationToken): Promise<T> {
		if (this.cachedPromise !== undefined) {
			return this.cachedPromise;
		}
		const result = this.computeFn(token);
		if (!this.onDidUpdatePromiseEmitter) {
			return result; // only cache if there is an event listener
		}
		this.cachedPromise = result;
		this.onDidUpdatePromiseEmitter.fire();
		return result;
	}

	public refresh(): void {
		this.cachedPromise = undefined;
		this.onDidUpdatePromiseEmitter?.fire();
	}
}

interface ModelChangeEvent {
	readonly promptType: PromptsType;
	readonly uri: URI;
}

class ModelChangeTracker extends Disposable {

	private readonly listeners = new ResourceMap<IDisposable>();
	private readonly onDidPromptModelChange: Emitter<ModelChangeEvent>;

	public get onDidPromptChange(): Event<ModelChangeEvent> {
		return this.onDidPromptModelChange.event;
	}

	constructor(modelService: IModelService) {
		super();
		this.onDidPromptModelChange = this._register(new Emitter<ModelChangeEvent>());
		const onAdd = (model: ITextModel) => {
			const promptType = getPromptsTypeForLanguageId(model.getLanguageId());
			if (promptType !== undefined) {
				this.listeners.set(model.uri, model.onDidChangeContent(() => this.onDidPromptModelChange.fire({ uri: model.uri, promptType })));
			}
		};
		const onRemove = (languageId: string, uri: URI) => {
			const promptType = getPromptsTypeForLanguageId(languageId);
			if (promptType !== undefined) {
				this.listeners.get(uri)?.dispose();
				this.listeners.delete(uri);
				this.onDidPromptModelChange.fire({ uri, promptType });
			}
		};
		this._register(modelService.onModelAdded(model => onAdd(model)));
		this._register(modelService.onModelLanguageChanged(e => {
			onRemove(e.oldLanguageId, e.model.uri);
			onAdd(e.model);
		}));
		this._register(modelService.onModelRemoved(model => onRemove(model.getLanguageId(), model.uri)));
	}

	public override dispose(): void {
		super.dispose();
		this.listeners.forEach(listener => listener.dispose());
		this.listeners.clear();
	}
}

namespace IAgentSource {
	export function fromPromptPath(promptPath: IPromptPath): IAgentSource {
		if (promptPath.storage === PromptsStorage.extension) {
			return {
				storage: PromptsStorage.extension,
				extensionId: promptPath.extension.identifier,
				type: promptPath.source
			};
		} else {
			return {
				storage: promptPath.storage
			};
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/promptSyntax/utils/promptFilesLocator.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/promptSyntax/utils/promptFilesLocator.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../../../base/common/uri.js';
import { isAbsolute } from '../../../../../../base/common/path.js';
import { ResourceSet } from '../../../../../../base/common/map.js';
import { IFileService } from '../../../../../../platform/files/common/files.js';
import { getPromptFileLocationsConfigKey, PromptsConfig } from '../config/config.js';
import { basename, dirname, isEqualOrParent, joinPath } from '../../../../../../base/common/resources.js';
import { IWorkspaceContextService } from '../../../../../../platform/workspace/common/workspace.js';
import { IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';
import { COPILOT_CUSTOM_INSTRUCTIONS_FILENAME, AGENTS_SOURCE_FOLDER, getPromptFileExtension, getPromptFileType, LEGACY_MODE_FILE_EXTENSION, getCleanPromptName, AGENT_FILE_EXTENSION, DEFAULT_AGENT_SKILLS_WORKSPACE_FOLDERS, DEFAULT_AGENT_SKILLS_USER_HOME_FOLDERS } from '../config/promptFileLocations.js';
import { PromptsType } from '../promptTypes.js';
import { IWorkbenchEnvironmentService } from '../../../../../services/environment/common/environmentService.js';
import { Schemas } from '../../../../../../base/common/network.js';
import { getExcludes, IFileQuery, ISearchConfiguration, ISearchService, QueryType } from '../../../../../services/search/common/search.js';
import { CancellationToken } from '../../../../../../base/common/cancellation.js';
import { isCancellationError } from '../../../../../../base/common/errors.js';
import { PromptsStorage } from '../service/promptsService.js';
import { IUserDataProfileService } from '../../../../../services/userDataProfile/common/userDataProfile.js';
import { Emitter, Event } from '../../../../../../base/common/event.js';
import { DisposableStore } from '../../../../../../base/common/lifecycle.js';
import { ILogService } from '../../../../../../platform/log/common/log.js';
import { IPathService } from '../../../../../services/path/common/pathService.js';

/**
 * Utility class to locate prompt files.
 */
export class PromptFilesLocator {

	constructor(
		@IFileService private readonly fileService: IFileService,
		@IConfigurationService private readonly configService: IConfigurationService,
		@IWorkspaceContextService private readonly workspaceService: IWorkspaceContextService,
		@IWorkbenchEnvironmentService private readonly environmentService: IWorkbenchEnvironmentService,
		@ISearchService private readonly searchService: ISearchService,
		@IUserDataProfileService private readonly userDataService: IUserDataProfileService,
		@ILogService private readonly logService: ILogService,
		@IPathService private readonly pathService: IPathService,
	) {
	}

	/**
	 * List all prompt files from the filesystem.
	 *
	 * @returns List of prompt files found in the workspace.
	 */
	public async listFiles(type: PromptsType, storage: PromptsStorage, token: CancellationToken): Promise<readonly URI[]> {
		if (storage === PromptsStorage.local) {
			return await this.listFilesInLocal(type, token);
		} else if (storage === PromptsStorage.user) {
			return await this.listFilesInUserData(type, token);
		}
		throw new Error(`Unsupported prompt file storage: ${storage}`);
	}

	private async listFilesInUserData(type: PromptsType, token: CancellationToken): Promise<readonly URI[]> {
		const files = await this.resolveFilesAtLocation(this.userDataService.currentProfile.promptsHome, token);
		return files.filter(file => getPromptFileType(file) === type);
	}

	public createFilesUpdatedEvent(type: PromptsType): { readonly event: Event<void>; dispose: () => void } {
		const disposables = new DisposableStore();
		const eventEmitter = disposables.add(new Emitter<void>());

		const userDataFolder = this.userDataService.currentProfile.promptsHome;

		const key = getPromptFileLocationsConfigKey(type);
		let parentFolders = this.getLocalParentFolders(type);

		const externalFolderWatchers = disposables.add(new DisposableStore());
		const updateExternalFolderWatchers = () => {
			externalFolderWatchers.clear();
			for (const folder of parentFolders) {
				if (!this.workspaceService.getWorkspaceFolder(folder.parent)) {
					// if the folder is not part of the workspace, we need to watch it
					const recursive = folder.filePattern !== undefined;
					externalFolderWatchers.add(this.fileService.watch(folder.parent, { recursive, excludes: [] }));
				}
			}
		};
		updateExternalFolderWatchers();
		disposables.add(this.configService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(key)) {
				parentFolders = this.getLocalParentFolders(type);
				updateExternalFolderWatchers();
				eventEmitter.fire();
			}
		}));
		disposables.add(this.fileService.onDidFilesChange(e => {
			if (e.affects(userDataFolder)) {
				eventEmitter.fire();
				return;
			}
			if (parentFolders.some(folder => e.affects(folder.parent))) {
				eventEmitter.fire();
				return;
			}
		}));
		disposables.add(this.fileService.watch(userDataFolder));

		return { event: eventEmitter.event, dispose: () => disposables.dispose() };
	}

	public getAgentSourceFolder(): readonly URI[] {
		return this.toAbsoluteLocations([AGENTS_SOURCE_FOLDER]);
	}

	/**
	 * Get all possible unambiguous prompt file source folders based on
	 * the current workspace folder structure.
	 *
	 * This method is currently primarily used by the `> Create Prompt`
	 * command that providers users with the list of destination folders
	 * for a newly created prompt file. Because such a list cannot contain
	 * paths that include `glob pattern` in them, we need to process config
	 * values and try to create a list of clear and unambiguous locations.
	 *
	 * @returns List of possible unambiguous prompt file folders.
	 */
	public getConfigBasedSourceFolders(type: PromptsType): readonly URI[] {
		const configuredLocations = PromptsConfig.promptSourceFolders(this.configService, type);
		const absoluteLocations = this.toAbsoluteLocations(configuredLocations);

		// locations in the settings can contain glob patterns so we need
		// to process them to get "clean" paths; the goal here is to have
		// a list of unambiguous folder paths where prompt files are stored
		const result = new ResourceSet();
		for (let absoluteLocation of absoluteLocations) {
			const baseName = basename(absoluteLocation);

			// if a path ends with a well-known "any file" pattern, remove
			// it so we can get the dirname path of that setting value
			const filePatterns = ['*.md', `*${getPromptFileExtension(type)}`];
			for (const filePattern of filePatterns) {
				if (baseName === filePattern) {
					absoluteLocation = dirname(absoluteLocation);
					continue;
				}
			}

			// likewise, if the pattern ends with single `*` (any file name)
			// remove it to get the dirname path of the setting value
			if (baseName === '*') {
				absoluteLocation = dirname(absoluteLocation);
			}

			// if after replacing the "file name" glob pattern, the path
			// still contains a glob pattern, then ignore the path
			if (isValidGlob(absoluteLocation.path) === true) {
				continue;
			}

			result.add(absoluteLocation);
		}

		return [...result];
	}

	/**
	 * Finds all existent prompt files in the configured local source folders.
	 *
	 * @returns List of prompt files found in the local source folders.
	 */
	private async listFilesInLocal(type: PromptsType, token: CancellationToken): Promise<readonly URI[]> {
		// find all prompt files in the provided locations, then match
		// the found file paths against (possible) glob patterns
		const paths = new ResourceSet();

		for (const { parent, filePattern } of this.getLocalParentFolders(type)) {
			const files = (filePattern === undefined)
				? await this.resolveFilesAtLocation(parent, token) // if the location does not contain a glob pattern, resolve the location directly
				: await this.searchFilesInLocation(parent, filePattern, token);
			for (const file of files) {
				if (getPromptFileType(file) === type) {
					paths.add(file);
				}
			}
			if (token.isCancellationRequested) {
				return [];
			}
		}

		return [...paths];
	}

	private getLocalParentFolders(type: PromptsType): readonly { parent: URI; filePattern?: string }[] {
		const configuredLocations = PromptsConfig.promptSourceFolders(this.configService, type);
		if (type === PromptsType.agent) {
			configuredLocations.push(AGENTS_SOURCE_FOLDER);
		}
		const absoluteLocations = this.toAbsoluteLocations(configuredLocations);
		return absoluteLocations.map(firstNonGlobParentAndPattern);
	}

	/**
	 * Converts locations defined in `settings` to absolute filesystem path URIs.
	 * This conversion is needed because locations in settings can be relative,
	 * hence we need to resolve them based on the current workspace folders.
	 */
	private toAbsoluteLocations(configuredLocations: readonly string[]): readonly URI[] {
		const result = new ResourceSet();
		const { folders } = this.workspaceService.getWorkspace();

		for (const configuredLocation of configuredLocations) {
			try {
				if (isAbsolute(configuredLocation)) {
					let uri = URI.file(configuredLocation);
					const remoteAuthority = this.environmentService.remoteAuthority;
					if (remoteAuthority) {
						// if the location is absolute and we are in a remote environment,
						// we need to convert it to a file URI with the remote authority
						uri = uri.with({ scheme: Schemas.vscodeRemote, authority: remoteAuthority });
					}
					result.add(uri);
				} else {
					for (const workspaceFolder of folders) {
						const absolutePath = joinPath(workspaceFolder.uri, configuredLocation);
						result.add(absolutePath);
					}
				}
			} catch (error) {
				this.logService.error(`Failed to resolve prompt file location: ${configuredLocation}`, error);
			}
		}

		return [...result];
	}

	/**
	 * Uses the file service to resolve the provided location and return either the file at the location of files in the directory.
	 */
	private async resolveFilesAtLocation(location: URI, token: CancellationToken): Promise<URI[]> {
		try {
			const info = await this.fileService.resolve(location);
			if (info.isFile) {
				return [info.resource];
			} else if (info.isDirectory && info.children) {
				const result: URI[] = [];
				for (const child of info.children) {
					if (child.isFile) {
						result.push(child.resource);
					}
				}
				return result;
			}
		} catch (error) {
		}
		return [];
	}

	/**
	 * Uses the search service to find all files at the provided location
	 */
	private async searchFilesInLocation(folder: URI, filePattern: string | undefined, token: CancellationToken): Promise<URI[]> {
		const disregardIgnoreFiles = this.configService.getValue<boolean>('explorer.excludeGitIgnore');

		const workspaceRoot = this.workspaceService.getWorkspaceFolder(folder);

		const getExcludePattern = (folder: URI) => getExcludes(this.configService.getValue<ISearchConfiguration>({ resource: folder })) || {};
		const searchOptions: IFileQuery = {
			folderQueries: [{ folder, disregardIgnoreFiles }],
			type: QueryType.File,
			shouldGlobMatchFilePattern: true,
			excludePattern: workspaceRoot ? getExcludePattern(workspaceRoot.uri) : undefined,
			sortByScore: true,
			filePattern
		};

		try {
			const searchResult = await this.searchService.fileSearch(searchOptions, token);
			if (token.isCancellationRequested) {
				return [];
			}
			return searchResult.results.map(r => r.resource);
		} catch (e) {
			if (!isCancellationError(e)) {
				throw e;
			}
		}
		return [];
	}

	public async findCopilotInstructionsMDsInWorkspace(token: CancellationToken): Promise<URI[]> {
		const result: URI[] = [];
		const { folders } = this.workspaceService.getWorkspace();
		for (const folder of folders) {
			const file = joinPath(folder.uri, `.github/` + COPILOT_CUSTOM_INSTRUCTIONS_FILENAME);
			try {
				const stat = await this.fileService.stat(file);
				if (stat.isFile) {
					result.push(file);
				}
			} catch (error) {
				this.logService.trace(`[PromptFilesLocator] Skipping copilot-instructions.md at ${file.toString()}: ${error}`);
			}
		}
		return result;
	}

	/**
	 * Gets list of `AGENTS.md` files anywhere in the workspace.
	 */
	public async findAgentMDsInWorkspace(token: CancellationToken): Promise<URI[]> {
		const result = await Promise.all(this.workspaceService.getWorkspace().folders.map(folder => this.findAgentMDsInFolder(folder.uri, token)));
		return result.flat(1);
	}

	private async findAgentMDsInFolder(folder: URI, token: CancellationToken): Promise<URI[]> {
		const disregardIgnoreFiles = this.configService.getValue<boolean>('explorer.excludeGitIgnore');
		const getExcludePattern = (folder: URI) => getExcludes(this.configService.getValue<ISearchConfiguration>({ resource: folder })) || {};
		const searchOptions: IFileQuery = {
			folderQueries: [{ folder, disregardIgnoreFiles }],
			type: QueryType.File,
			shouldGlobMatchFilePattern: true,
			excludePattern: getExcludePattern(folder),
			filePattern: '**/AGENTS.md',
		};

		try {
			const searchResult = await this.searchService.fileSearch(searchOptions, token);
			if (token.isCancellationRequested) {
				return [];
			}
			return searchResult.results.map(r => r.resource);
		} catch (e) {
			if (!isCancellationError(e)) {
				throw e;
			}
		}
		return [];

	}

	/**
	 * Gets list of `AGENTS.md` files only at the root workspace folder(s).
	 */
	public async findAgentMDsInWorkspaceRoots(token: CancellationToken): Promise<URI[]> {
		const result: URI[] = [];
		const { folders } = this.workspaceService.getWorkspace();
		const resolvedRoots = await this.fileService.resolveAll(folders.map(f => ({ resource: f.uri })));
		for (const root of resolvedRoots) {
			if (root.success && root.stat?.children) {
				const agentMd = root.stat.children.find(c => c.isFile && c.name.toLowerCase() === 'agents.md');
				if (agentMd) {
					result.push(agentMd.resource);
				}
			}
		}
		return result;
	}

	public getAgentFileURIFromModeFile(oldURI: URI): URI | undefined {
		if (oldURI.path.endsWith(LEGACY_MODE_FILE_EXTENSION)) {
			let newLocation;
			const workspaceFolder = this.workspaceService.getWorkspaceFolder(oldURI);
			if (workspaceFolder) {
				newLocation = joinPath(workspaceFolder.uri, AGENTS_SOURCE_FOLDER, getCleanPromptName(oldURI) + AGENT_FILE_EXTENSION);
			} else if (isEqualOrParent(oldURI, this.userDataService.currentProfile.promptsHome)) {
				newLocation = joinPath(this.userDataService.currentProfile.promptsHome, getCleanPromptName(oldURI) + AGENT_FILE_EXTENSION);
			}
			return newLocation;
		}
		return undefined;
	}

	private async findAgentSkillsInFolder(uri: URI, relativePath: string, token: CancellationToken): Promise<URI[]> {
		const result = [];
		try {
			const stat = await this.fileService.resolve(joinPath(uri, relativePath));
			if (token.isCancellationRequested) {
				return [];
			}
			if (stat.isDirectory && stat.children) {
				for (const skillDir of stat.children) {
					if (skillDir.isDirectory) {
						const skillFile = joinPath(skillDir.resource, 'SKILL.md');
						if (await this.fileService.exists(skillFile)) {
							result.push(skillFile);
						}
					}
				}
			}
		} catch (error) {
			// no such folder, return empty list
			return [];
		}

		return result;
	}

	/**
	 * Searches for skills in all default directories in the workspace.
	 * Each skill is stored in its own subdirectory with a SKILL.md file.
	 */
	public async findAgentSkillsInWorkspace(token: CancellationToken): Promise<URI[]> {
		const workspace = this.workspaceService.getWorkspace();
		const allResults: URI[] = [];
		for (const folder of workspace.folders) {
			for (const skillsFolder of DEFAULT_AGENT_SKILLS_WORKSPACE_FOLDERS) {
				const results = await this.findAgentSkillsInFolder(folder.uri, skillsFolder, token);
				allResults.push(...results);
			}
		}
		return allResults;
	}

	/**
	 * Searches for skills in all default directories in the home folder.
	 * Each skill is stored in its own subdirectory with a SKILL.md file.
	 */
	public async findAgentSkillsInUserHome(token: CancellationToken): Promise<URI[]> {
		const userHome = await this.pathService.userHome();
		const allResults: URI[] = [];
		for (const skillsFolder of DEFAULT_AGENT_SKILLS_USER_HOME_FOLDERS) {
			const results = await this.findAgentSkillsInFolder(userHome, skillsFolder, token);
			allResults.push(...results);
		}
		return allResults;
	}
}


/**
 * Checks if the provided `pattern` could be a valid glob pattern.
 */
export function isValidGlob(pattern: string): boolean {
	let squareBrackets = false;
	let squareBracketsCount = 0;

	let curlyBrackets = false;
	let curlyBracketsCount = 0;

	let previousCharacter: string | undefined;
	for (const char of pattern) {
		// skip all escaped characters
		if (previousCharacter === '\\') {
			previousCharacter = char;
			continue;
		}

		if (char === '*') {
			return true;
		}

		if (char === '?') {
			return true;
		}

		if (char === '[') {
			squareBrackets = true;
			squareBracketsCount++;

			previousCharacter = char;
			continue;
		}

		if (char === ']') {
			squareBrackets = true;
			squareBracketsCount--;
			previousCharacter = char;
			continue;
		}

		if (char === '{') {
			curlyBrackets = true;
			curlyBracketsCount++;
			continue;
		}

		if (char === '}') {
			curlyBrackets = true;
			curlyBracketsCount--;
			previousCharacter = char;
			continue;
		}

		previousCharacter = char;
	}

	// if square brackets exist and are in pairs, this is a `valid glob`
	if (squareBrackets && (squareBracketsCount === 0)) {
		return true;
	}

	// if curly brackets exist and are in pairs, this is a `valid glob`
	if (curlyBrackets && (curlyBracketsCount === 0)) {
		return true;
	}

	return false;
}

/**
 * Finds the first parent of the provided location that does not contain a `glob pattern`.
 *
 * Asumes that the location that is provided has a valid path (is abstract)
 *
 * ## Examples
 *
 * ```typescript
 * assert.strictDeepEqual(
 *     firstNonGlobParentAndPattern(URI.file('/home/user/{folder1,folder2}/file.md')).path,
 *     { parent: URI.file('/home/user'), filePattern: '{folder1,folder2}/file.md' },
 *     'Must find correct non-glob parent dirname.',
 * );
 * ```
 */
function firstNonGlobParentAndPattern(location: URI): { parent: URI; filePattern?: string } {
	const segments = location.path.split('/');
	let i = 0;
	while (i < segments.length && isValidGlob(segments[i]) === false) {
		i++;
	}
	if (i === segments.length) {
		// the path does not contain a glob pattern, so we can
		// just find all prompt files in the provided location
		return { parent: location };
	}
	const parent = location.with({ path: segments.slice(0, i).join('/') });
	if (i === segments.length - 1 && segments[i] === '*' || segments[i] === ``) {
		return { parent };
	}

	// the path contains a glob pattern, so we search in last folder that does not contain a glob pattern
	return {
		parent,
		filePattern: segments.slice(i).join('/')
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/tools/confirmationTool.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/tools/confirmationTool.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { MarkdownString } from '../../../../../base/common/htmlContent.js';
import { IChatTerminalToolInvocationData } from '../chatService.js';
import { CountTokensCallback, IPreparedToolInvocation, IToolData, IToolImpl, IToolInvocation, IToolInvocationPreparationContext, IToolResult, ToolDataSource, ToolInvocationPresentation, ToolProgress } from '../languageModelToolsService.js';

export const ConfirmationToolId = 'vscode_get_confirmation';

export const ConfirmationToolData: IToolData = {
	id: ConfirmationToolId,
	displayName: 'Confirmation Tool',
	modelDescription: 'A tool that demonstrates different types of confirmations. Takes a title, message, and confirmation type (basic or terminal).',
	source: ToolDataSource.Internal,
	inputSchema: {
		type: 'object',
		properties: {
			title: {
				type: 'string',
				description: 'Title for the confirmation dialog'
			},
			message: {
				type: 'string',
				description: 'Message to show in the confirmation dialog'
			},
			confirmationType: {
				type: 'string',
				enum: ['basic', 'terminal'],
				description: 'Type of confirmation to show - basic for simple confirmation, terminal for terminal command confirmation'
			},
			terminalCommand: {
				type: 'string',
				description: 'Terminal command to show (only used when confirmationType is "terminal")'
			}
		},
		required: ['title', 'message', 'confirmationType'],
		additionalProperties: false
	}
};

export interface IConfirmationToolParams {
	title: string;
	message: string;
	confirmationType?: 'basic' | 'terminal';
	terminalCommand?: string;
}

export class ConfirmationTool implements IToolImpl {
	async prepareToolInvocation(context: IToolInvocationPreparationContext, token: CancellationToken): Promise<IPreparedToolInvocation | undefined> {
		const parameters = context.parameters as IConfirmationToolParams;
		if (!parameters.title || !parameters.message) {
			throw new Error('Missing required parameters for ConfirmationTool');
		}

		const confirmationType = parameters.confirmationType ?? 'basic';

		// Create different tool-specific data based on confirmation type
		let toolSpecificData: IChatTerminalToolInvocationData | undefined;

		if (confirmationType === 'terminal') {
			// For terminal confirmations, use the terminal tool data structure
			toolSpecificData = {
				kind: 'terminal',
				commandLine: {
					original: parameters.terminalCommand ?? ''
				},
				language: 'bash'
			};
		} else {
			// For basic confirmations, don't set toolSpecificData - this will use the default confirmation UI
			toolSpecificData = undefined;
		}

		return {
			confirmationMessages: {
				title: parameters.title,
				message: new MarkdownString(parameters.message),
				allowAutoConfirm: true
			},
			toolSpecificData,
			presentation: ToolInvocationPresentation.HiddenAfterComplete
		};
	}

	async invoke(invocation: IToolInvocation, countTokens: CountTokensCallback, progress: ToolProgress, token: CancellationToken): Promise<IToolResult> {
		// This is a no-op tool - just return success
		return {
			content: [{
				kind: 'text',
				value: 'yes' // Consumers should check for this label to know whether the tool was confirmed or skipped
			}]
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/tools/editFileTool.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/tools/editFileTool.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { MarkdownString } from '../../../../../base/common/htmlContent.js';
import { IDisposable } from '../../../../../base/common/lifecycle.js';
import { autorun } from '../../../../../base/common/observable.js';
import { URI, UriComponents } from '../../../../../base/common/uri.js';
import { CellUri } from '../../../notebook/common/notebookCommon.js';
import { INotebookService } from '../../../notebook/common/notebookService.js';
import { ICodeMapperService } from '../../common/chatCodeMapperService.js';
import { ChatModel } from '../../common/chatModel.js';
import { IChatService } from '../../common/chatService.js';
import { CountTokensCallback, IPreparedToolInvocation, IToolData, IToolImpl, IToolInvocation, IToolInvocationPreparationContext, IToolResult, ToolDataSource, ToolInvocationPresentation, ToolProgress } from '../../common/languageModelToolsService.js';
import { LocalChatSessionUri } from '../chatUri.js';

export const ExtensionEditToolId = 'vscode_editFile';
export const InternalEditToolId = 'vscode_editFile_internal';
export const EditToolData: IToolData = {
	id: InternalEditToolId,
	displayName: '', // not used
	modelDescription: '', // Not used
	source: ToolDataSource.Internal,
};

export interface EditToolParams {
	uri: UriComponents;
	explanation: string;
	code: string;
}

export class EditTool implements IToolImpl {

	constructor(
		@IChatService private readonly chatService: IChatService,
		@ICodeMapperService private readonly codeMapperService: ICodeMapperService,
		@INotebookService private readonly notebookService: INotebookService,
	) { }

	async invoke(invocation: IToolInvocation, countTokens: CountTokensCallback, _progress: ToolProgress, token: CancellationToken): Promise<IToolResult> {
		if (!invocation.context) {
			throw new Error('toolInvocationToken is required for this tool');
		}

		const parameters = invocation.parameters as EditToolParams;
		const fileUri = URI.revive(parameters.uri);
		const uri = CellUri.parse(fileUri)?.notebook || fileUri;

		const model = this.chatService.getSession(LocalChatSessionUri.forSession(invocation.context?.sessionId)) as ChatModel;
		const request = model.getRequests().at(-1)!;

		model.acceptResponseProgress(request, {
			kind: 'markdownContent',
			content: new MarkdownString('\n````\n')
		});
		model.acceptResponseProgress(request, {
			kind: 'codeblockUri',
			uri,
			isEdit: true
		});
		model.acceptResponseProgress(request, {
			kind: 'markdownContent',
			content: new MarkdownString('\n````\n')
		});
		// Signal start.
		if (this.notebookService.hasSupportedNotebooks(uri) && (this.notebookService.getNotebookTextModel(uri))) {
			model.acceptResponseProgress(request, {
				kind: 'notebookEdit',
				edits: [],
				uri
			});
		} else {
			model.acceptResponseProgress(request, {
				kind: 'textEdit',
				edits: [],
				uri
			});
		}

		const editSession = model.editingSession;
		if (!editSession) {
			throw new Error('This tool must be called from within an editing session');
		}

		const result = await this.codeMapperService.mapCode({
			codeBlocks: [{ code: parameters.code, resource: uri, markdownBeforeBlock: parameters.explanation }],
			location: 'tool',
			chatRequestId: invocation.chatRequestId,
			chatRequestModel: invocation.modelId,
			chatSessionResource: invocation.context.sessionResource,
		}, {
			textEdit: (target, edits) => {
				model.acceptResponseProgress(request, { kind: 'textEdit', uri: target, edits });
			},
			notebookEdit(target, edits) {
				model.acceptResponseProgress(request, { kind: 'notebookEdit', uri: target, edits });
			},
		}, token);

		// Signal end.
		if (this.notebookService.hasSupportedNotebooks(uri) && (this.notebookService.getNotebookTextModel(uri))) {
			model.acceptResponseProgress(request, { kind: 'notebookEdit', uri, edits: [], done: true });
		} else {
			model.acceptResponseProgress(request, { kind: 'textEdit', uri, edits: [], done: true });
		}

		if (result?.errorMessage) {
			throw new Error(result.errorMessage);
		}

		let dispose: IDisposable;
		await new Promise((resolve) => {
			// The file will not be modified until the first edits start streaming in,
			// so wait until we see that it _was_ modified before waiting for it to be done.
			let wasFileBeingModified = false;

			dispose = autorun((r) => {

				const entries = editSession.entries.read(r);
				const currentFile = entries?.find((e) => e.modifiedURI.toString() === uri.toString());
				if (currentFile) {
					if (currentFile.isCurrentlyBeingModifiedBy.read(r)) {
						wasFileBeingModified = true;
					} else if (wasFileBeingModified) {
						resolve(true);
					}
				}
			});
		}).finally(() => {
			dispose.dispose();
		});

		return {
			content: [{ kind: 'text', value: 'The file was edited successfully' }]
		};
	}

	async prepareToolInvocation(context: IToolInvocationPreparationContext, token: CancellationToken): Promise<IPreparedToolInvocation | undefined> {
		return {
			presentation: ToolInvocationPresentation.Hidden
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/tools/languageModelToolsContribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/tools/languageModelToolsContribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isFalsyOrEmpty } from '../../../../../base/common/arrays.js';
import { MarkdownString } from '../../../../../base/common/htmlContent.js';
import { IJSONSchema } from '../../../../../base/common/jsonSchema.js';
import { Disposable, DisposableMap, DisposableStore, IDisposable } from '../../../../../base/common/lifecycle.js';
import { transaction } from '../../../../../base/common/observable.js';
import { joinPath } from '../../../../../base/common/resources.js';
import { isFalsyOrWhitespace } from '../../../../../base/common/strings.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { localize } from '../../../../../nls.js';
import { ContextKeyExpr } from '../../../../../platform/contextkey/common/contextkey.js';
import { ExtensionIdentifier, IExtensionManifest } from '../../../../../platform/extensions/common/extensions.js';
import { SyncDescriptor } from '../../../../../platform/instantiation/common/descriptors.js';
import { IProductService } from '../../../../../platform/product/common/productService.js';
import { Registry } from '../../../../../platform/registry/common/platform.js';
import { IWorkbenchContribution } from '../../../../common/contributions.js';
import { Extensions, IExtensionFeaturesRegistry, IExtensionFeatureTableRenderer, IRenderedData, IRowData, ITableData } from '../../../../services/extensionManagement/common/extensionFeatures.js';
import { isProposedApiEnabled } from '../../../../services/extensions/common/extensions.js';
import * as extensionsRegistry from '../../../../services/extensions/common/extensionsRegistry.js';
import { ILanguageModelToolsService, IToolData, ToolDataSource, ToolSet } from '../languageModelToolsService.js';
import { toolsParametersSchemaSchemaId } from './languageModelToolsParametersSchema.js';

export interface IRawToolContribution {
	name: string;
	displayName: string;
	modelDescription: string;
	toolReferenceName?: string;
	legacyToolReferenceFullNames?: string[];
	icon?: string | { light: string; dark: string };
	when?: string;
	tags?: string[];
	userDescription?: string;
	inputSchema?: IJSONSchema;
	canBeReferencedInPrompt?: boolean;
}

const languageModelToolsExtensionPoint = extensionsRegistry.ExtensionsRegistry.registerExtensionPoint<IRawToolContribution[]>({
	extensionPoint: 'languageModelTools',
	activationEventsGenerator: function* (contributions: readonly IRawToolContribution[]) {
		for (const contrib of contributions) {
			yield `onLanguageModelTool:${contrib.name}`;
		}
	},
	jsonSchema: {
		description: localize('vscode.extension.contributes.tools', 'Contributes a tool that can be invoked by a language model in a chat session, or from a standalone command. Registered tools can be used by all extensions.'),
		type: 'array',
		items: {
			additionalProperties: false,
			type: 'object',
			defaultSnippets: [{
				body: {
					name: '${1}',
					modelDescription: '${2}',
					inputSchema: {
						type: 'object',
						properties: {
							'${3:name}': {
								type: 'string',
								description: '${4:description}'
							}
						}
					},
				}
			}],
			required: ['name', 'displayName', 'modelDescription'],
			properties: {
				name: {
					description: localize('toolName', "A unique name for this tool. This name must be a globally unique identifier, and is also used as a name when presenting this tool to a language model."),
					type: 'string',
					// [\\w-]+ is OpenAI's requirement for tool names
					pattern: '^(?!copilot_|vscode_)[\\w-]+$'
				},
				toolReferenceName: {
					markdownDescription: localize('toolName2', "If {0} is enabled for this tool, the user may use '#' with this name to invoke the tool in a query. Otherwise, the name is not required. Name must not contain whitespace.", '`canBeReferencedInPrompt`'),
					type: 'string',
					pattern: '^[\\w-]+$'
				},
				displayName: {
					description: localize('toolDisplayName', "A human-readable name for this tool that may be used to describe it in the UI."),
					type: 'string'
				},
				userDescription: {
					description: localize('toolUserDescription', "A description of this tool that may be shown to the user."),
					type: 'string'
				},
				// eslint-disable-next-line local/code-no-localized-model-description
				modelDescription: {
					description: localize('toolModelDescription', "A description of this tool that may be used by a language model to select it."),
					type: 'string'
				},
				inputSchema: {
					description: localize('parametersSchema', "A JSON schema for the input this tool accepts. The input must be an object at the top level. A particular language model may not support all JSON schema features. See the documentation for the language model family you are using for more information."),
					$ref: toolsParametersSchemaSchemaId
				},
				canBeReferencedInPrompt: {
					markdownDescription: localize('canBeReferencedInPrompt', "If true, this tool shows up as an attachment that the user can add manually to their request. Chat participants will receive the tool in {0}.", '`ChatRequest#toolReferences`'),
					type: 'boolean'
				},
				icon: {
					markdownDescription: localize('icon', 'An icon that represents this tool. Either a file path, an object with file paths for dark and light themes, or a theme icon reference, like "\\$(zap)"'),
					anyOf: [{
						type: 'string'
					},
					{
						type: 'object',
						properties: {
							light: {
								description: localize('icon.light', 'Icon path when a light theme is used'),
								type: 'string'
							},
							dark: {
								description: localize('icon.dark', 'Icon path when a dark theme is used'),
								type: 'string'
							}
						}
					}]
				},
				when: {
					markdownDescription: localize('condition', "Condition which must be true for this tool to be enabled. Note that a tool may still be invoked by another extension even when its `when` condition is false."),
					type: 'string'
				},
				tags: {
					description: localize('toolTags', "A set of tags that roughly describe the tool's capabilities. A tool user may use these to filter the set of tools to just ones that are relevant for the task at hand, or they may want to pick a tag that can be used to identify just the tools contributed by this extension."),
					type: 'array',
					items: {
						type: 'string',
						pattern: '^(?!copilot_|vscode_)'
					}
				}
			}
		}
	}
});

export interface IRawToolSetContribution {
	name: string;
	/**
	 * @deprecated
	 */
	referenceName?: string;
	legacyFullNames?: string[];
	description: string;
	icon?: string;
	tools: string[];
}

const languageModelToolSetsExtensionPoint = extensionsRegistry.ExtensionsRegistry.registerExtensionPoint<IRawToolSetContribution[]>({
	extensionPoint: 'languageModelToolSets',
	deps: [languageModelToolsExtensionPoint],
	jsonSchema: {
		description: localize('vscode.extension.contributes.toolSets', 'Contributes a set of language model tools that can be used together.'),
		type: 'array',
		items: {
			additionalProperties: false,
			type: 'object',
			defaultSnippets: [{
				body: {
					name: '${1}',
					description: '${2}',
					tools: ['${3}']
				}
			}],
			required: ['name', 'description', 'tools'],
			properties: {
				name: {
					description: localize('toolSetName', "A name for this tool set. Used as reference and should not contain whitespace."),
					type: 'string',
					pattern: '^[\\w-]+$'
				},
				description: {
					description: localize('toolSetDescription', "A description of this tool set."),
					type: 'string'
				},
				icon: {
					markdownDescription: localize('toolSetIcon', "An icon that represents this tool set, like `$(zap)`"),
					type: 'string'
				},
				tools: {
					markdownDescription: localize('toolSetTools', "A list of tools or tool sets to include in this tool set. Cannot be empty and must reference tools by their `toolReferenceName`."),
					type: 'array',
					minItems: 1,
					items: {
						type: 'string'
					}
				}
			}
		}
	}
});

function toToolKey(extensionIdentifier: ExtensionIdentifier, toolName: string) {
	return `${extensionIdentifier.value}/${toolName}`;
}

function toToolSetKey(extensionIdentifier: ExtensionIdentifier, toolName: string) {
	return `toolset:${extensionIdentifier.value}/${toolName}`;
}

export class LanguageModelToolsExtensionPointHandler implements IWorkbenchContribution {
	static readonly ID = 'workbench.contrib.toolsExtensionPointHandler';

	private _registrationDisposables = new DisposableMap<string>();

	constructor(
		@IProductService productService: IProductService,
		@ILanguageModelToolsService languageModelToolsService: ILanguageModelToolsService,
	) {

		languageModelToolsExtensionPoint.setHandler((_extensions, delta) => {
			for (const extension of delta.added) {
				for (const rawTool of extension.value) {
					if (!rawTool.name || !rawTool.modelDescription || !rawTool.displayName) {
						extension.collector.error(`Extension '${extension.description.identifier.value}' CANNOT register tool without name, modelDescription, and displayName: ${JSON.stringify(rawTool)}`);
						continue;
					}

					if (!rawTool.name.match(/^[\w-]+$/)) {
						extension.collector.error(`Extension '${extension.description.identifier.value}' CANNOT register tool with invalid id: ${rawTool.name}. The id must match /^[\\w-]+$/.`);
						continue;
					}

					if (rawTool.canBeReferencedInPrompt && !rawTool.toolReferenceName) {
						extension.collector.error(`Extension '${extension.description.identifier.value}' CANNOT register tool with 'canBeReferencedInPrompt' set without a 'toolReferenceName': ${JSON.stringify(rawTool)}`);
						continue;
					}

					if ((rawTool.name.startsWith('copilot_') || rawTool.name.startsWith('vscode_')) && !isProposedApiEnabled(extension.description, 'chatParticipantPrivate')) {
						extension.collector.error(`Extension '${extension.description.identifier.value}' CANNOT register tool with name starting with "vscode_" or "copilot_"`);
						continue;
					}

					if (rawTool.tags?.some(tag => tag.startsWith('copilot_') || tag.startsWith('vscode_')) && !isProposedApiEnabled(extension.description, 'chatParticipantPrivate')) {
						extension.collector.error(`Extension '${extension.description.identifier.value}' CANNOT register tool with tags starting with "vscode_" or "copilot_"`);
					}

					if (rawTool.legacyToolReferenceFullNames && !isProposedApiEnabled(extension.description, 'chatParticipantPrivate')) {
						extension.collector.error(`Extension '${extension.description.identifier.value}' CANNOT use 'legacyToolReferenceFullNames' without the 'chatParticipantPrivate' API proposal enabled`);
						continue;
					}

					const rawIcon = rawTool.icon;
					let icon: IToolData['icon'] | undefined;
					if (typeof rawIcon === 'string') {
						icon = ThemeIcon.fromString(rawIcon) ?? {
							dark: joinPath(extension.description.extensionLocation, rawIcon),
							light: joinPath(extension.description.extensionLocation, rawIcon)
						};
					} else if (rawIcon) {
						icon = {
							dark: joinPath(extension.description.extensionLocation, rawIcon.dark),
							light: joinPath(extension.description.extensionLocation, rawIcon.light)
						};
					}

					// If OSS and the product.json is not set up, fall back to checking api proposal
					const isBuiltinTool = productService.defaultChatAgent?.chatExtensionId ?
						ExtensionIdentifier.equals(extension.description.identifier, productService.defaultChatAgent.chatExtensionId) :
						isProposedApiEnabled(extension.description, 'chatParticipantPrivate');

					const source: ToolDataSource = isBuiltinTool
						? ToolDataSource.Internal
						: { type: 'extension', label: extension.description.displayName ?? extension.description.name, extensionId: extension.description.identifier };

					const tool: IToolData = {
						...rawTool,
						source,
						inputSchema: rawTool.inputSchema,
						id: rawTool.name,
						icon,
						when: rawTool.when ? ContextKeyExpr.deserialize(rawTool.when) : undefined,
						alwaysDisplayInputOutput: !isBuiltinTool,
					};
					try {
						const disposable = languageModelToolsService.registerToolData(tool);
						this._registrationDisposables.set(toToolKey(extension.description.identifier, rawTool.name), disposable);
					} catch (e) {
						extension.collector.error(`Failed to register tool '${rawTool.name}': ${e}`);
					}
				}
			}

			for (const extension of delta.removed) {
				for (const tool of extension.value) {
					this._registrationDisposables.deleteAndDispose(toToolKey(extension.description.identifier, tool.name));
				}
			}
		});

		languageModelToolSetsExtensionPoint.setHandler((_extensions, delta) => {

			for (const extension of delta.added) {

				if (!isProposedApiEnabled(extension.description, 'contribLanguageModelToolSets')) {
					extension.collector.error(`Extension '${extension.description.identifier.value}' CANNOT register language model tools because the 'contribLanguageModelToolSets' API proposal is not enabled.`);
					continue;
				}

				const isBuiltinTool = productService.defaultChatAgent?.chatExtensionId ?
					ExtensionIdentifier.equals(extension.description.identifier, productService.defaultChatAgent.chatExtensionId) :
					isProposedApiEnabled(extension.description, 'chatParticipantPrivate');

				const source: ToolDataSource = isBuiltinTool
					? ToolDataSource.Internal
					: { type: 'extension', label: extension.description.displayName ?? extension.description.name, extensionId: extension.description.identifier };


				for (const toolSet of extension.value) {

					if (isFalsyOrWhitespace(toolSet.name)) {
						extension.collector.error(`Tool set '${toolSet.name}' CANNOT have an empty name`);
						continue;
					}

					if (toolSet.legacyFullNames && !isProposedApiEnabled(extension.description, 'contribLanguageModelToolSets')) {
						extension.collector.error(`Tool set '${toolSet.name}' CANNOT use 'legacyFullNames' without the 'contribLanguageModelToolSets' API proposal enabled`);
						continue;
					}

					if (isFalsyOrEmpty(toolSet.tools)) {
						extension.collector.error(`Tool set '${toolSet.name}' CANNOT have an empty tools array`);
						continue;
					}

					const tools: IToolData[] = [];
					const toolSets: ToolSet[] = [];

					for (const toolName of toolSet.tools) {
						const toolObj = languageModelToolsService.getToolByName(toolName, true);
						if (toolObj) {
							tools.push(toolObj);
							continue;
						}
						const toolSetObj = languageModelToolsService.getToolSetByName(toolName);
						if (toolSetObj) {
							toolSets.push(toolSetObj);
							continue;
						}
						extension.collector.warn(`Tool set '${toolSet.name}' CANNOT find tool or tool set by name: ${toolName}`);
					}

					if (toolSets.length === 0 && tools.length === 0) {
						extension.collector.error(`Tool set '${toolSet.name}' CANNOT have an empty tools array (none of the tools were found)`);
						continue;
					}

					const store = new DisposableStore();
					const referenceName = toolSet.referenceName ?? toolSet.name;
					const existingToolSet = languageModelToolsService.getToolSetByName(referenceName);
					const mergeExisting = isBuiltinTool && existingToolSet?.source === ToolDataSource.Internal;

					let obj: ToolSet & IDisposable;
					// Allow built-in tool to update the tool set if it already exists
					if (mergeExisting) {
						obj = existingToolSet as ToolSet & IDisposable;
					} else {
						obj = languageModelToolsService.createToolSet(
							source,
							toToolSetKey(extension.description.identifier, toolSet.name),
							referenceName,
							{ icon: toolSet.icon ? ThemeIcon.fromString(toolSet.icon) : undefined, description: toolSet.description, legacyFullNames: toolSet.legacyFullNames }
						);
					}

					transaction(tx => {
						if (!mergeExisting) {
							store.add(obj);
						}
						tools.forEach(tool => store.add(obj.addTool(tool, tx)));
						toolSets.forEach(toolSet => store.add(obj.addToolSet(toolSet, tx)));
					});

					this._registrationDisposables.set(toToolSetKey(extension.description.identifier, toolSet.name), store);
				}
			}

			for (const extension of delta.removed) {
				for (const toolSet of extension.value) {
					this._registrationDisposables.deleteAndDispose(toToolSetKey(extension.description.identifier, toolSet.name));
				}
			}
		});
	}
}


// --- render

class LanguageModelToolDataRenderer extends Disposable implements IExtensionFeatureTableRenderer {
	readonly type = 'table';

	shouldRender(manifest: IExtensionManifest): boolean {
		return !!manifest.contributes?.languageModelTools;
	}

	render(manifest: IExtensionManifest): IRenderedData<ITableData> {
		const contribs = manifest.contributes?.languageModelTools ?? [];
		if (!contribs.length) {
			return { data: { headers: [], rows: [] }, dispose: () => { } };
		}

		const headers = [
			localize('toolTableName', "Name"),
			localize('toolTableDisplayName', "Display Name"),
			localize('toolTableDescription', "Description"),
		];

		const rows: IRowData[][] = contribs.map(t => {
			return [
				new MarkdownString(`\`${t.name}\``),
				t.displayName,
				t.userDescription ?? t.modelDescription,
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
	id: 'languageModelTools',
	label: localize('langModelTools', "Language Model Tools"),
	access: {
		canToggle: false
	},
	renderer: new SyncDescriptor(LanguageModelToolDataRenderer),
});


class LanguageModelToolSetDataRenderer extends Disposable implements IExtensionFeatureTableRenderer {

	readonly type = 'table';

	shouldRender(manifest: IExtensionManifest): boolean {
		return !!manifest.contributes?.languageModelToolSets;
	}

	render(manifest: IExtensionManifest): IRenderedData<ITableData> {
		const contribs = manifest.contributes?.languageModelToolSets ?? [];
		if (!contribs.length) {
			return { data: { headers: [], rows: [] }, dispose: () => { } };
		}

		const headers = [
			localize('name', "Name"),
			localize('reference', "Reference Name"),
			localize('tools', "Tools"),
			localize('descriptions', "Description"),
		];

		const rows: IRowData[][] = contribs.map(t => {
			return [
				new MarkdownString(`\`${t.name}\``),
				t.referenceName ? new MarkdownString(`\`#${t.referenceName}\``) : 'none',
				t.tools.join(', '),
				t.description,
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
	id: 'languageModelToolSets',
	label: localize('langModelToolSets', "Language Model Tool Sets"),
	access: {
		canToggle: false
	},
	renderer: new SyncDescriptor(LanguageModelToolSetDataRenderer),
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/tools/languageModelToolsParametersSchema.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/tools/languageModelToolsParametersSchema.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IJSONSchema } from '../../../../../base/common/jsonSchema.js';
import { Extensions as JSONExtensions, IJSONContributionRegistry } from '../../../../../platform/jsonschemas/common/jsonContributionRegistry.js';
import { Registry } from '../../../../../platform/registry/common/platform.js';

/**
 * A schema for parametersSchema
 * This is a subset of https://json-schema.org/draft-07/schema to capture what is actually supported by language models for tools, mainly, that they must be an object at the top level.
 * Possibly it can be whittled down some more based on which attributes are supported by language models.
 */
export const toolsParametersSchemaSchemaId = 'vscode://schemas/toolsParameters';
const toolsParametersSchemaSchema: IJSONSchema = {
	definitions: {
		schemaArray: {
			type: 'array',
			minItems: 1,
			items: {
				$ref: '#'
			}
		},
		nonNegativeInteger: {
			type: 'integer',
			minimum: 0
		},
		nonNegativeIntegerDefault0: {
			allOf: [
				{
					$ref: '#/definitions/nonNegativeInteger'
				},
				{
					default: 0
				}
			]
		},
		simpleTypes: {
			enum: [
				'array',
				'boolean',
				'integer',
				'null',
				'number',
				'object',
				'string'
			]
		},
		stringArray: {
			type: 'array',
			items: {
				type: 'string'
			},
			uniqueItems: true,
			default: []
		}
	},
	type: ['object'],
	properties: {
		$id: {
			type: 'string',
			format: 'uri-reference'
		},
		$schema: {
			type: 'string',
			format: 'uri'
		},
		$ref: {
			type: 'string',
			format: 'uri-reference'
		},
		$comment: {
			type: 'string'
		},
		title: {
			type: 'string'
		},
		description: {
			type: 'string'
		},
		readOnly: {
			type: 'boolean',
			default: false
		},
		writeOnly: {
			type: 'boolean',
			default: false
		},
		multipleOf: {
			type: 'number',
			exclusiveMinimum: 0
		},
		maximum: {
			type: 'number'
		},
		exclusiveMaximum: {
			type: 'number'
		},
		minimum: {
			type: 'number'
		},
		exclusiveMinimum: {
			type: 'number'
		},
		maxLength: {
			$ref: '#/definitions/nonNegativeInteger'
		},
		minLength: {
			$ref: '#/definitions/nonNegativeIntegerDefault0'
		},
		pattern: {
			type: 'string',
			format: 'regex'
		},
		additionalItems: {
			$ref: '#'
		},
		items: {
			anyOf: [
				{
					$ref: '#'
				},
				{
					$ref: '#/definitions/schemaArray'
				}
			],
			default: true
		},
		maxItems: {
			$ref: '#/definitions/nonNegativeInteger'
		},
		minItems: {
			$ref: '#/definitions/nonNegativeIntegerDefault0'
		},
		uniqueItems: {
			type: 'boolean',
			default: false
		},
		contains: {
			$ref: '#'
		},
		maxProperties: {
			$ref: '#/definitions/nonNegativeInteger'
		},
		minProperties: {
			$ref: '#/definitions/nonNegativeIntegerDefault0'
		},
		required: {
			$ref: '#/definitions/stringArray'
		},
		additionalProperties: {
			$ref: '#'
		},
		definitions: {
			type: 'object',
			additionalProperties: {
				$ref: '#'
			},
			default: {}
		},
		properties: {
			type: 'object',
			additionalProperties: {
				$ref: '#'
			},
			default: {}
		},
		patternProperties: {
			type: 'object',
			additionalProperties: {
				$ref: '#'
			},
			propertyNames: {
				format: 'regex'
			},
			default: {}
		},
		dependencies: {
			type: 'object',
			additionalProperties: {
				anyOf: [
					{
						$ref: '#'
					},
					{
						$ref: '#/definitions/stringArray'
					}
				]
			}
		},
		propertyNames: {
			$ref: '#'
		},
		enum: {
			type: 'array',
			minItems: 1,
			uniqueItems: true
		},
		type: {
			anyOf: [
				{
					$ref: '#/definitions/simpleTypes'
				},
				{
					type: 'array',
					items: {
						$ref: '#/definitions/simpleTypes'
					},
					minItems: 1,
					uniqueItems: true
				}
			]
		},
		format: {
			type: 'string'
		},
		contentMediaType: {
			type: 'string'
		},
		contentEncoding: {
			type: 'string'
		},
		if: {
			$ref: '#'
		},
		then: {
			$ref: '#'
		},
		else: {
			$ref: '#'
		},
		allOf: {
			$ref: '#/definitions/schemaArray'
		},
		anyOf: {
			$ref: '#/definitions/schemaArray'
		},
		oneOf: {
			$ref: '#/definitions/schemaArray'
		},
		not: {
			$ref: '#'
		}
	},
	defaultSnippets: [{
		body: {
			type: 'object',
			properties: {
				'${1:paramName}': {
					type: 'string',
					description: '${2:description}'
				}
			}
		},
	}],
};
const contributionRegistry = Registry.as<IJSONContributionRegistry>(JSONExtensions.JSONContribution);
contributionRegistry.registerSchema(toolsParametersSchemaSchemaId, toolsParametersSchemaSchema);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/tools/manageTodoListTool.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/tools/manageTodoListTool.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import {
	IToolData,
	IToolImpl,
	IToolInvocation,
	IToolResult,
	ToolDataSource,
	IToolInvocationPreparationContext,
	IPreparedToolInvocation
} from '../languageModelToolsService.js';
import { ILogService } from '../../../../../platform/log/common/log.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { IChatTodo, IChatTodoListService } from '../chatTodoListService.js';
import { localize } from '../../../../../nls.js';
import { MarkdownString } from '../../../../../base/common/htmlContent.js';
import { URI } from '../../../../../base/common/uri.js';
import { chatSessionResourceToId, LocalChatSessionUri } from '../chatUri.js';

export const TodoListToolWriteOnlySettingId = 'chat.todoListTool.writeOnly';
export const TodoListToolDescriptionFieldSettingId = 'chat.todoListTool.descriptionField';

export const ManageTodoListToolToolId = 'manage_todo_list';

export function createManageTodoListToolData(writeOnly: boolean, includeDescription: boolean = true): IToolData {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const baseProperties: any = {
		todoList: {
			type: 'array',
			description: writeOnly
				? 'Complete array of all todo items. Must include ALL items - both existing and new.'
				: 'Complete array of all todo items (required for write operation, ignored for read). Must include ALL items - both existing and new.',
			items: {
				type: 'object',
				properties: {
					id: {
						type: 'number',
						description: 'Unique identifier for the todo. Use sequential numbers starting from 1.'
					},
					title: {
						type: 'string',
						description: 'Concise action-oriented todo label (3-7 words). Displayed in UI.'
					},
					...(includeDescription && {
						description: {
							type: 'string',
							description: 'Detailed context, requirements, or implementation notes. Include file paths, specific methods, or acceptance criteria.'
						}
					}),
					status: {
						type: 'string',
						enum: ['not-started', 'in-progress', 'completed'],
						description: 'not-started: Not begun | in-progress: Currently working (max 1) | completed: Fully finished with no blockers'
					},
				},
				required: includeDescription ? ['id', 'title', 'description', 'status'] : ['id', 'title', 'status']
			}
		}
	};

	// Only require the full todoList when operating in write-only mode.
	// In read/write mode, the write path validates todoList at runtime, so it's not schema-required.
	const requiredFields = writeOnly ? ['todoList'] : [] as string[];

	if (!writeOnly) {
		baseProperties.operation = {
			type: 'string',
			enum: ['write', 'read'],
			description: 'write: Replace entire todo list with new content. read: Retrieve current todo list. ALWAYS provide complete list when writing - partial updates not supported.'
		};
		requiredFields.unshift('operation');
	}

	return {
		id: ManageTodoListToolToolId,
		toolReferenceName: 'todo',
		legacyToolReferenceFullNames: ['todos'],
		canBeReferencedInPrompt: true,
		icon: ThemeIcon.fromId(Codicon.checklist.id),
		displayName: localize('tool.manageTodoList.displayName', 'Manage and track todo items for task planning'),
		userDescription: localize('tool.manageTodoList.userDescription', 'Manage and track todo items for task planning'),
		modelDescription: 'Manage a structured todo list to track progress and plan tasks throughout your coding session. Use this tool VERY frequently to ensure task visibility and proper planning.\n\nWhen to use this tool:\n- Complex multi-step work requiring planning and tracking\n- When user provides multiple tasks or requests (numbered/comma-separated)\n- After receiving new instructions that require multiple steps\n- BEFORE starting work on any todo (mark as in-progress)\n- IMMEDIATELY after completing each todo (mark completed individually)\n- When breaking down larger tasks into smaller actionable steps\n- To give users visibility into your progress and planning\n\nWhen NOT to use:\n- Single, trivial tasks that can be completed in one step\n- Purely conversational/informational requests\n- When just reading files or performing simple searches\n\nCRITICAL workflow:\n1. Plan tasks by writing todo list with specific, actionable items\n2. Mark ONE todo as in-progress before starting work\n3. Complete the work for that specific todo\n4. Mark that todo as completed IMMEDIATELY\n5. Move to next todo and repeat\n\nTodo states:\n- not-started: Todo not yet begun\n- in-progress: Currently working (limit ONE at a time)\n- completed: Finished successfully\n\nIMPORTANT: Mark todos completed as soon as they are done. Do not batch completions.',
		source: ToolDataSource.Internal,
		inputSchema: {
			type: 'object',
			properties: baseProperties,
			required: requiredFields
		}
	};
}

export const ManageTodoListToolData: IToolData = createManageTodoListToolData(false);

interface IManageTodoListToolInputParams {
	operation?: 'write' | 'read'; // Optional in write-only mode
	todoList: Array<{
		id: number;
		title: string;
		description?: string;
		status: 'not-started' | 'in-progress' | 'completed';
	}>;
	chatSessionId?: string;
}

export class ManageTodoListTool extends Disposable implements IToolImpl {

	constructor(
		private readonly writeOnly: boolean,
		private readonly includeDescription: boolean,
		@IChatTodoListService private readonly chatTodoListService: IChatTodoListService,
		@ILogService private readonly logService: ILogService,
		@ITelemetryService private readonly telemetryService: ITelemetryService
	) {
		super();
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async invoke(invocation: IToolInvocation, _countTokens: any, _progress: any, _token: CancellationToken): Promise<IToolResult> {
		const args = invocation.parameters as IManageTodoListToolInputParams;
		// For: #263001 Use default sessionId
		const DEFAULT_TODO_SESSION_ID = 'default';
		const chatSessionId = invocation.context?.sessionId ?? args.chatSessionId ?? DEFAULT_TODO_SESSION_ID;

		this.logService.debug(`ManageTodoListTool: Invoking with options ${JSON.stringify(args)}`);

		try {
			// Determine operation: in writeOnly mode, always write; otherwise use args.operation
			const operation = this.writeOnly ? 'write' : args.operation;

			if (!operation) {
				return {
					content: [{
						kind: 'text',
						value: 'Error: operation parameter is required'
					}]
				};
			}

			if (operation === 'read') {
				return this.handleReadOperation(LocalChatSessionUri.forSession(chatSessionId));
			} else if (operation === 'write') {
				return this.handleWriteOperation(args, LocalChatSessionUri.forSession(chatSessionId));
			} else {
				return {
					content: [{
						kind: 'text',
						value: 'Error: Unknown operation'
					}]
				};
			}

		} catch (error) {
			const errorMessage = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
			return {
				content: [{
					kind: 'text',
					value: errorMessage
				}]
			};
		}
	}

	async prepareToolInvocation(context: IToolInvocationPreparationContext, _token: CancellationToken): Promise<IPreparedToolInvocation | undefined> {
		const args = context.parameters as IManageTodoListToolInputParams;
		// For: #263001 Use default sessionId
		const DEFAULT_TODO_SESSION_ID = 'default';
		const chatSessionId = context.chatSessionId ?? args.chatSessionId ?? DEFAULT_TODO_SESSION_ID;

		const currentTodoItems = this.chatTodoListService.getTodos(LocalChatSessionUri.forSession(chatSessionId));
		let message: string | undefined;


		const operation = this.writeOnly ? 'write' : args.operation;
		switch (operation) {
			case 'write': {
				if (args.todoList) {
					message = this.generatePastTenseMessage(currentTodoItems, args.todoList);
				}
				break;
			}
			case 'read': {
				message = localize('todo.readOperation', "Read todo list");
				break;
			}
			default:
				break;
		}

		const items = args.todoList ?? currentTodoItems;
		const todoList = items.map(todo => ({
			id: todo.id.toString(),
			title: todo.title,
			description: todo.description || '',
			status: todo.status
		}));

		return {
			pastTenseMessage: new MarkdownString(message ?? localize('todo.updatedList', "Updated todo list")),
			toolSpecificData: {
				kind: 'todoList',
				sessionId: chatSessionId,
				todoList: todoList
			}
		};
	}

	private generatePastTenseMessage(currentTodos: IChatTodo[], newTodos: IManageTodoListToolInputParams['todoList']): string {
		// If no current todos, this is creating new ones
		if (currentTodos.length === 0) {
			return newTodos.length === 1
				? localize('todo.created.single', "Created 1 todo")
				: localize('todo.created.multiple', "Created {0} todos", newTodos.length);
		}

		// Create map for easier comparison
		const currentTodoMap = new Map(currentTodos.map(todo => [todo.id, todo]));

		// Check for newly started todos (marked as in-progress) - highest priority
		const startedTodos = newTodos.filter(newTodo => {
			const currentTodo = currentTodoMap.get(newTodo.id);
			return currentTodo && currentTodo.status !== 'in-progress' && newTodo.status === 'in-progress';
		});

		if (startedTodos.length > 0) {
			const startedTodo = startedTodos[0]; // Should only be one in-progress at a time
			const totalTodos = newTodos.length;
			const currentPosition = newTodos.findIndex(todo => todo.id === startedTodo.id) + 1;
			return localize('todo.starting', "Starting: *{0}* ({1}/{2})", startedTodo.title, currentPosition, totalTodos);
		}

		// Check for newly completed todos
		const completedTodos = newTodos.filter(newTodo => {
			const currentTodo = currentTodoMap.get(newTodo.id);
			return currentTodo && currentTodo.status !== 'completed' && newTodo.status === 'completed';
		});

		if (completedTodos.length > 0) {
			const completedTodo = completedTodos[0]; // Get the first completed todo for the message
			const totalTodos = newTodos.length;
			const currentPosition = newTodos.findIndex(todo => todo.id === completedTodo.id) + 1;
			return localize('todo.completed', "Completed: *{0}* ({1}/{2})", completedTodo.title, currentPosition, totalTodos);
		}

		// Check for new todos added
		const addedTodos = newTodos.filter(newTodo => !currentTodoMap.has(newTodo.id));
		if (addedTodos.length > 0) {
			return addedTodos.length === 1
				? localize('todo.added.single', "Added 1 todo")
				: localize('todo.added.multiple', "Added {0} todos", addedTodos.length);
		}

		// Default message for other updates
		return localize('todo.updated', "Updated todo list");
	}

	private handleRead(todoItems: IChatTodo[], sessionResource: URI): string {
		if (todoItems.length === 0) {
			return 'No todo list found.';
		}

		const markdownTaskList = this.formatTodoListAsMarkdownTaskList(todoItems);
		return `# Todo List\n\n${markdownTaskList}`;
	}

	private handleReadOperation(chatSessionResource: URI): IToolResult {
		const todoItems = this.chatTodoListService.getTodos(chatSessionResource);
		const readResult = this.handleRead(todoItems, chatSessionResource);
		const statusCounts = this.calculateStatusCounts(todoItems);

		this.telemetryService.publicLog2<TodoListToolInvokedEvent, TodoListToolInvokedClassification>(
			'todoListToolInvoked',
			{
				operation: 'read',
				notStartedCount: statusCounts.notStartedCount,
				inProgressCount: statusCounts.inProgressCount,
				completedCount: statusCounts.completedCount,
				chatSessionId: chatSessionResourceToId(chatSessionResource)
			}
		);

		return {
			content: [{
				kind: 'text',
				value: readResult
			}]
		};
	}

	private handleWriteOperation(args: IManageTodoListToolInputParams, chatSessionResource: URI): IToolResult {
		if (!args.todoList) {
			return {
				content: [{
					kind: 'text',
					value: 'Error: todoList is required for write operation'
				}]
			};
		}

		const todoList: IChatTodo[] = args.todoList.map((parsedTodo) => ({
			id: parsedTodo.id,
			title: parsedTodo.title,
			description: parsedTodo.description || '',
			status: parsedTodo.status
		}));

		const existingTodos = this.chatTodoListService.getTodos(chatSessionResource);
		const changes = this.calculateTodoChanges(existingTodos, todoList);

		this.chatTodoListService.setTodos(chatSessionResource, todoList);
		const statusCounts = this.calculateStatusCounts(todoList);

		// Build warnings
		const warnings: string[] = [];
		if (todoList.length < 3) {
			warnings.push('Warning: Small todo list (<3 items). This task might not need a todo list.');
		}
		else if (todoList.length > 10) {
			warnings.push('Warning: Large todo list (>10 items). Consider keeping the list focused and actionable.');
		}

		if (changes > 3) {
			warnings.push('Warning: Did you mean to update so many todos at the same time? Consider working on them one by one.');
		}

		this.telemetryService.publicLog2<TodoListToolInvokedEvent, TodoListToolInvokedClassification>(
			'todoListToolInvoked',
			{
				operation: 'write',
				notStartedCount: statusCounts.notStartedCount,
				inProgressCount: statusCounts.inProgressCount,
				completedCount: statusCounts.completedCount,
				chatSessionId: chatSessionResourceToId(chatSessionResource)
			}
		);

		return {
			content: [{
				kind: 'text',
				value: `Successfully wrote todo list${warnings.length ? '\n\n' + warnings.join('\n') : ''}`
			}],
			toolMetadata: {
				warnings: warnings
			}
		};
	}

	private calculateStatusCounts(todos: IChatTodo[]): { notStartedCount: number; inProgressCount: number; completedCount: number } {
		const notStartedCount = todos.filter(todo => todo.status === 'not-started').length;
		const inProgressCount = todos.filter(todo => todo.status === 'in-progress').length;
		const completedCount = todos.filter(todo => todo.status === 'completed').length;
		return { notStartedCount, inProgressCount, completedCount };
	}

	private formatTodoListAsMarkdownTaskList(todoList: IChatTodo[]): string {
		if (todoList.length === 0) {
			return '';
		}

		return todoList.map(todo => {
			let checkbox: string;
			switch (todo.status) {
				case 'completed':
					checkbox = '[x]';
					break;
				case 'in-progress':
					checkbox = '[-]';
					break;
				case 'not-started':
				default:
					checkbox = '[ ]';
					break;
			}

			const lines = [`- ${checkbox} ${todo.title}`];
			if (this.includeDescription && todo.description && todo.description.trim()) {
				lines.push(`  - ${todo.description.trim()}`);
			}

			return lines.join('\n');
		}).join('\n');
	}

	private calculateTodoChanges(oldList: IChatTodo[], newList: IChatTodo[]): number {
		// Assume arrays are equivalent in order; compare index-by-index
		let modified = 0;
		const minLen = Math.min(oldList.length, newList.length);
		for (let i = 0; i < minLen; i++) {
			const o = oldList[i];
			const n = newList[i];
			if (o.title !== n.title || (o.description ?? '') !== (n.description ?? '') || o.status !== n.status) {
				modified++;
			}
		}

		const added = Math.max(0, newList.length - oldList.length);
		const removed = Math.max(0, oldList.length - newList.length);
		const totalChanges = added + removed + modified;
		return totalChanges;
	}
}

type TodoListToolInvokedEvent = {
	operation: 'read' | 'write';
	notStartedCount: number;
	inProgressCount: number;
	completedCount: number;
	chatSessionId: string | undefined;
};

type TodoListToolInvokedClassification = {
	operation: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The operation performed on the todo list (read or write).' };
	notStartedCount: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'The number of tasks with not-started status.' };
	inProgressCount: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'The number of tasks with in-progress status.' };
	completedCount: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'The number of tasks with completed status.' };
	chatSessionId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The ID of the chat session that the tool was used within, if applicable.' };
	owner: 'bhavyaus';
	comment: 'Provides insight into the usage of the todo list tool including detailed task status distribution.';
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/tools/promptTsxTypes.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/tools/promptTsxTypes.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * This is a subset of the types export from jsonTypes.d.ts in @vscode/prompt-tsx.
 * It's just the types needed to stringify prompt-tsx tool results.
 * It should be kept in sync with the types in that file.
 */

export declare const enum PromptNodeType {
	Piece = 1,
	Text = 2
}
export interface TextJSON {
	type: PromptNodeType.Text;
	text: string;
	lineBreakBefore: boolean | undefined;
}
/**
 * Constructor kind of the node represented by {@link PieceJSON}. This is
 * less descriptive than the actual constructor, as we only care to preserve
 * the element data that the renderer cares about.
 */
export declare const enum PieceCtorKind {
	BaseChatMessage = 1,
	Other = 2,
	ImageChatMessage = 3
}
export interface BasePieceJSON {
	type: PromptNodeType.Piece;
	ctor: PieceCtorKind.BaseChatMessage | PieceCtorKind.Other;
	children: PromptNodeJSON[];
}
export interface ImageChatMessagePieceJSON {
	type: PromptNodeType.Piece;
	ctor: PieceCtorKind.ImageChatMessage;
	children: PromptNodeJSON[];
	props: {
		src: string;
		detail?: 'low' | 'high';
	};
}
export type PieceJSON = BasePieceJSON | ImageChatMessagePieceJSON;
export type PromptNodeJSON = PieceJSON | TextJSON;
export interface PromptElementJSON {
	node: PieceJSON;
}

export function stringifyPromptElementJSON(element: PromptElementJSON): string {
	const strs: string[] = [];
	stringifyPromptNodeJSON(element.node, strs);
	return strs.join('');
}

function stringifyPromptNodeJSON(node: PromptNodeJSON, strs: string[]): void {
	if (node.type === PromptNodeType.Text) {
		if (node.lineBreakBefore) {
			strs.push('\n');
		}

		if (typeof node.text === 'string') {
			strs.push(node.text);
		}
	} else if (node.ctor === PieceCtorKind.ImageChatMessage) {
		// This case currently can't be hit by prompt-tsx
		strs.push('<image>');
	} else if (node.ctor === PieceCtorKind.BaseChatMessage || node.ctor === PieceCtorKind.Other) {
		for (const child of node.children) {
			stringifyPromptNodeJSON(child, strs);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/tools/runSubagentTool.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/tools/runSubagentTool.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { Event } from '../../../../../base/common/event.js';
import { MarkdownString } from '../../../../../base/common/htmlContent.js';
import { IJSONSchema, IJSONSchemaMap } from '../../../../../base/common/jsonSchema.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { localize } from '../../../../../nls.js';
import { IConfigurationChangeEvent, IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../../platform/log/common/log.js';
import { IChatAgentRequest, IChatAgentService, UserSelectedTools } from '../chatAgents.js';
import { ChatModel, IChatRequestModeInstructions } from '../chatModel.js';
import { IChatModeService } from '../chatModes.js';
import { IChatProgress, IChatService } from '../chatService.js';
import { ChatRequestVariableSet } from '../chatVariableEntries.js';
import { ChatAgentLocation, ChatConfiguration, ChatModeKind } from '../constants.js';
import { ILanguageModelChatMetadata, ILanguageModelsService } from '../languageModels.js';
import {
	CountTokensCallback,
	ILanguageModelToolsService,
	IPreparedToolInvocation,
	IToolData,
	IToolImpl,
	IToolInvocation,
	IToolInvocationPreparationContext,
	IToolResult,
	ToolDataSource,
	ToolProgress,
	ToolSet,
	VSCodeToolReference,
	IToolAndToolSetEnablementMap
} from '../languageModelToolsService.js';
import { ComputeAutomaticInstructions } from '../promptSyntax/computeAutomaticInstructions.js';
import { ManageTodoListToolToolId } from './manageTodoListTool.js';
import { createToolSimpleTextResult } from './toolHelpers.js';

export const RunSubagentToolId = 'runSubagent';

const BaseModelDescription = `Launch a new agent to handle complex, multi-step tasks autonomously. This tool is good at researching complex questions, searching for code, and executing multi-step tasks. When you are searching for a keyword or file and are not confident that you will find the right match in the first few tries, use this agent to perform the search for you.

- Agents do not run async or in the background, you will wait for the agent\'s result.
- When the agent is done, it will return a single message back to you. The result returned by the agent is not visible to the user. To show the user the result, you should send a text message back to the user with a concise summary of the result.
- Each agent invocation is stateless. You will not be able to send additional messages to the agent, nor will the agent be able to communicate with you outside of its final report. Therefore, your prompt should contain a highly detailed task description for the agent to perform autonomously and you should specify exactly what information the agent should return back to you in its final and only message to you.
- The agent's outputs should generally be trusted
- Clearly tell the agent whether you expect it to write code or just to do research (search, file reads, web fetches, etc.), since it is not aware of the user\'s intent`;

interface IRunSubagentToolInputParams {
	prompt: string;
	description: string;
	agentName?: string;
}

export class RunSubagentTool extends Disposable implements IToolImpl {

	readonly onDidUpdateToolData: Event<IConfigurationChangeEvent>;

	constructor(
		@IChatAgentService private readonly chatAgentService: IChatAgentService,
		@IChatService private readonly chatService: IChatService,
		@IChatModeService private readonly chatModeService: IChatModeService,
		@ILanguageModelToolsService private readonly languageModelToolsService: ILanguageModelToolsService,
		@ILanguageModelsService private readonly languageModelsService: ILanguageModelsService,
		@ILogService private readonly logService: ILogService,
		@ILanguageModelToolsService private readonly toolsService: ILanguageModelToolsService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		super();
		this.onDidUpdateToolData = Event.filter(this.configurationService.onDidChangeConfiguration, e => e.affectsConfiguration(ChatConfiguration.SubagentToolCustomAgents));
	}

	getToolData(): IToolData {
		let modelDescription = BaseModelDescription;
		const inputSchema: IJSONSchema & { properties: IJSONSchemaMap } = {
			type: 'object',
			properties: {
				prompt: {
					type: 'string',
					description: 'A detailed description of the task for the agent to perform'
				},
				description: {
					type: 'string',
					description: 'A short (3-5 word) description of the task'
				}
			},
			required: ['prompt', 'description']
		};

		if (this.configurationService.getValue(ChatConfiguration.SubagentToolCustomAgents)) {
			inputSchema.properties.agentName = {
				type: 'string',
				description: 'Optional name of a specific agent to invoke. If not provided, uses the current agent.'
			};
			modelDescription += `\n- If the user asks for a certain agent, you MUST provide that EXACT agent name (case-sensitive) to invoke that specific agent.`;
		}
		const runSubagentToolData: IToolData = {
			id: RunSubagentToolId,
			toolReferenceName: VSCodeToolReference.runSubagent,
			icon: ThemeIcon.fromId(Codicon.organization.id),
			displayName: localize('tool.runSubagent.displayName', 'Run Subagent'),
			userDescription: localize('tool.runSubagent.userDescription', 'Run a task within an isolated subagent context to enable efficient organization of tasks and context window management.'),
			modelDescription: modelDescription,
			source: ToolDataSource.Internal,
			inputSchema: inputSchema
		};
		return runSubagentToolData;
	}

	async invoke(invocation: IToolInvocation, _countTokens: CountTokensCallback, _progress: ToolProgress, token: CancellationToken): Promise<IToolResult> {
		const args = invocation.parameters as IRunSubagentToolInputParams;

		this.logService.debug(`RunSubagentTool: Invoking with prompt: ${args.prompt.substring(0, 100)}...`);

		if (!invocation.context) {
			throw new Error('toolInvocationToken is required for this tool');
		}

		// Get the chat model and request for writing progress
		const model = this.chatService.getSession(invocation.context.sessionResource) as ChatModel | undefined;
		if (!model) {
			throw new Error('Chat model not found for session');
		}

		const request = model.getRequests().at(-1)!;

		try {
			// Get the default agent
			const defaultAgent = this.chatAgentService.getDefaultAgent(ChatAgentLocation.Chat, ChatModeKind.Agent);
			if (!defaultAgent) {
				return createToolSimpleTextResult('Error: No default agent available');
			}

			// Resolve mode-specific configuration if subagentId is provided
			let modeModelId = invocation.modelId;
			let modeTools = invocation.userSelectedTools;
			let modeInstructions: IChatRequestModeInstructions | undefined;

			if (args.agentName) {
				const mode = this.chatModeService.findModeByName(args.agentName);
				if (mode) {
					// Use mode-specific model if available
					const modeModelQualifiedName = mode.model?.get();
					if (modeModelQualifiedName) {
						// Find the actual model identifier from the qualified name
						const modelIds = this.languageModelsService.getLanguageModelIds();
						for (const modelId of modelIds) {
							const metadata = this.languageModelsService.lookupLanguageModel(modelId);
							if (metadata && ILanguageModelChatMetadata.matchesQualifiedName(modeModelQualifiedName, metadata)) {
								modeModelId = modelId;
								break;
							}
						}
					}

					// Use mode-specific tools if available
					const modeCustomTools = mode.customTools?.get();
					if (modeCustomTools) {
						// Convert the mode's custom tools (array of qualified names) to UserSelectedTools format
						const enablementMap = this.languageModelToolsService.toToolAndToolSetEnablementMap(modeCustomTools, mode.target?.get());
						// Convert enablement map to UserSelectedTools (Record<string, boolean>)
						modeTools = {};
						for (const [tool, enabled] of enablementMap) {
							if (!(tool instanceof ToolSet)) {
								modeTools[tool.id] = enabled;
							}
						}
					}

					const instructions = mode.modeInstructions?.get();
					modeInstructions = instructions && {
						name: mode.name.get(),
						content: instructions.content,
						toolReferences: this.toolsService.toToolReferences(instructions.toolReferences),
						metadata: instructions.metadata,
					};
				} else {
					this.logService.warn(`RunSubagentTool: Agent '${args.agentName}' not found, using current configuration`);
				}
			}

			// Track whether we should collect markdown (after the last prepare tool invocation)
			const markdownParts: string[] = [];

			let inEdit = false;
			const progressCallback = (parts: IChatProgress[]) => {
				for (const part of parts) {
					// Write certain parts immediately to the model
					if (part.kind === 'prepareToolInvocation' || part.kind === 'textEdit' || part.kind === 'notebookEdit' || part.kind === 'codeblockUri') {
						if (part.kind === 'codeblockUri' && !inEdit) {
							inEdit = true;
							model.acceptResponseProgress(request, { kind: 'markdownContent', content: new MarkdownString('```\n'), fromSubagent: true });
						}
						model.acceptResponseProgress(request, part);

						// When we see a prepare tool invocation, reset markdown collection
						if (part.kind === 'prepareToolInvocation') {
							markdownParts.length = 0; // Clear previously collected markdown
						}
					} else if (part.kind === 'markdownContent') {
						if (inEdit) {
							model.acceptResponseProgress(request, { kind: 'markdownContent', content: new MarkdownString('\n```\n\n'), fromSubagent: true });
							inEdit = false;
						}

						// Collect markdown content for the tool result
						markdownParts.push(part.content.value);
					}
				}
			};

			if (modeTools) {
				modeTools[RunSubagentToolId] = false;
				modeTools[ManageTodoListToolToolId] = false;
			}

			const variableSet = await this.collectVariables(modeTools, token);

			// Build the agent request
			const agentRequest: IChatAgentRequest = {
				sessionResource: invocation.context.sessionResource,
				requestId: invocation.callId ?? `subagent-${Date.now()}`,
				agentId: defaultAgent.id,
				message: args.prompt,
				variables: { variables: variableSet.asArray() },
				location: ChatAgentLocation.Chat,
				isSubagent: true,
				userSelectedModelId: modeModelId,
				userSelectedTools: modeTools,
				modeInstructions,
			};

			// Invoke the agent
			const result = await this.chatAgentService.invokeAgent(
				defaultAgent.id,
				agentRequest,
				progressCallback,
				[],
				token
			);

			// Check for errors
			if (result.errorDetails) {
				return createToolSimpleTextResult(`Agent error: ${result.errorDetails.message}`);
			}

			return createToolSimpleTextResult(markdownParts.join('') || 'Agent completed with no output');

		} catch (error) {
			const errorMessage = `Error invoking subagent: ${error instanceof Error ? error.message : 'Unknown error'}`;
			this.logService.error(errorMessage, error);
			return createToolSimpleTextResult(errorMessage);
		}
	}

	async prepareToolInvocation(context: IToolInvocationPreparationContext, _token: CancellationToken): Promise<IPreparedToolInvocation | undefined> {
		const args = context.parameters as IRunSubagentToolInputParams;

		return {
			invocationMessage: args.description,
		};
	}

	private async collectVariables(modeTools: UserSelectedTools | undefined, token: CancellationToken): Promise<ChatRequestVariableSet> {
		let enabledTools: IToolAndToolSetEnablementMap | undefined;

		if (modeTools) {
			// Convert tool IDs to full reference names

			const enabledToolIds = Object.entries(modeTools).filter(([, enabled]) => enabled).map(([id]) => id);
			const tools = enabledToolIds.map(id => this.languageModelToolsService.getTool(id)).filter(tool => !!tool);

			const fullReferenceNames = tools.map(tool => this.languageModelToolsService.getFullReferenceName(tool));
			if (fullReferenceNames.length > 0) {
				enabledTools = this.languageModelToolsService.toToolAndToolSetEnablementMap(fullReferenceNames, undefined);
			}
		}

		const variableSet = new ChatRequestVariableSet();
		const computer = this.instantiationService.createInstance(ComputeAutomaticInstructions, enabledTools);
		await computer.collect(variableSet, token);

		return variableSet;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/tools/toolHelpers.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/tools/toolHelpers.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IToolResult } from '../languageModelToolsService.js';

/**
 * Creates a tool result with a single text content part.
 */
export function createToolSimpleTextResult(value: string): IToolResult {
	return {
		content: [{
			kind: 'text',
			value
		}]
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/tools/tools.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/tools/tools.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from '../../../../../base/common/codicons.js';
import { Disposable, IDisposable } from '../../../../../base/common/lifecycle.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { localize } from '../../../../../nls.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IWorkbenchContribution } from '../../../../common/contributions.js';
import { ILanguageModelToolsService, SpecedToolAliases, ToolDataSource } from '../../common/languageModelToolsService.js';
import { ConfirmationTool, ConfirmationToolData } from './confirmationTool.js';
import { EditTool, EditToolData } from './editFileTool.js';
import { createManageTodoListToolData, ManageTodoListTool, TodoListToolDescriptionFieldSettingId, TodoListToolWriteOnlySettingId } from './manageTodoListTool.js';
import { RunSubagentTool } from './runSubagentTool.js';

export class BuiltinToolsContribution extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'chat.builtinTools';

	constructor(
		@ILanguageModelToolsService toolsService: ILanguageModelToolsService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
	) {
		super();

		const editTool = instantiationService.createInstance(EditTool);
		this._register(toolsService.registerTool(EditToolData, editTool));

		// Check if write-only mode is enabled for the todo tool
		const writeOnlyMode = this.configurationService.getValue<boolean>(TodoListToolWriteOnlySettingId) === true;
		const includeDescription = this.configurationService.getValue<boolean>(TodoListToolDescriptionFieldSettingId) !== false;
		const todoToolData = createManageTodoListToolData(writeOnlyMode, includeDescription);
		const manageTodoListTool = this._register(instantiationService.createInstance(ManageTodoListTool, writeOnlyMode, includeDescription));
		this._register(toolsService.registerTool(todoToolData, manageTodoListTool));

		// Register the confirmation tool
		const confirmationTool = instantiationService.createInstance(ConfirmationTool);
		this._register(toolsService.registerTool(ConfirmationToolData, confirmationTool));

		const runSubagentTool = this._register(instantiationService.createInstance(RunSubagentTool));
		const customAgentToolSet = this._register(toolsService.createToolSet(ToolDataSource.Internal, 'custom-agent', SpecedToolAliases.agent, {
			icon: ThemeIcon.fromId(Codicon.agent.id),
			description: localize('toolset.custom-agent', 'Delegate tasks to other agents'),
		}));

		let runSubagentRegistration: IDisposable | undefined;
		let toolSetRegistration: IDisposable | undefined;
		const registerRunSubagentTool = () => {
			runSubagentRegistration?.dispose();
			toolSetRegistration?.dispose();
			const runSubagentToolData = runSubagentTool.getToolData();
			runSubagentRegistration = toolsService.registerTool(runSubagentToolData, runSubagentTool);
			toolSetRegistration = customAgentToolSet.addTool(runSubagentToolData);
		};
		registerRunSubagentTool();
		this._register(runSubagentTool.onDidUpdateToolData(registerRunSubagentTool));
		this._register({
			dispose: () => {
				runSubagentRegistration?.dispose();
				toolSetRegistration?.dispose();
			}
		});


	}
}

export const InternalFetchWebPageToolId = 'vscode_fetchWebPage_internal';
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/electron-browser/chat.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/electron-browser/chat.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { autorun } from '../../../../base/common/observable.js';
import { resolve } from '../../../../base/common/path.js';
import { isMacintosh } from '../../../../base/common/platform.js';
import { URI } from '../../../../base/common/uri.js';
import { ipcRenderer } from '../../../../base/parts/sandbox/electron-browser/globals.js';
import { localize } from '../../../../nls.js';
import { registerAction2 } from '../../../../platform/actions/common/actions.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { INativeHostService } from '../../../../platform/native/common/native.js';
import { IWorkspaceTrustRequestService } from '../../../../platform/workspace/common/workspaceTrust.js';
import { IWorkbenchContribution, WorkbenchPhase, registerWorkbenchContribution2 } from '../../../common/contributions.js';
import { ViewContainerLocation } from '../../../common/views.js';
import { INativeWorkbenchEnvironmentService } from '../../../services/environment/electron-browser/environmentService.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { IWorkbenchLayoutService } from '../../../services/layout/browser/layoutService.js';
import { ILifecycleService, ShutdownReason } from '../../../services/lifecycle/common/lifecycle.js';
import { ACTION_ID_NEW_CHAT, CHAT_OPEN_ACTION_ID, IChatViewOpenOptions } from '../browser/actions/chatActions.js';
import { IChatWidgetService } from '../browser/chat.js';
import { ChatContextKeys } from '../common/chatContextKeys.js';
import { ChatConfiguration, ChatModeKind } from '../common/constants.js';
import { IChatService } from '../common/chatService.js';
import { ChatUrlFetchingConfirmationContribution } from '../common/chatUrlFetchingConfirmation.js';
import { ILanguageModelToolsConfirmationService } from '../common/languageModelToolsConfirmationService.js';
import { ILanguageModelToolsService } from '../common/languageModelToolsService.js';
import { InternalFetchWebPageToolId } from '../common/tools/tools.js';
import { registerChatDeveloperActions } from './actions/chatDeveloperActions.js';
import { HoldToVoiceChatInChatViewAction, InlineVoiceChatAction, KeywordActivationContribution, QuickVoiceChatAction, ReadChatResponseAloud, StartVoiceChatAction, StopListeningAction, StopListeningAndSubmitAction, StopReadAloud, StopReadChatItemAloud, VoiceChatInChatViewAction } from './actions/voiceChatActions.js';
import { FetchWebPageTool, FetchWebPageToolData, IFetchWebPageToolParams } from './tools/fetchPageTool.js';

class NativeBuiltinToolsContribution extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'chat.nativeBuiltinTools';

	constructor(
		@ILanguageModelToolsService toolsService: ILanguageModelToolsService,
		@IInstantiationService instantiationService: IInstantiationService,
		@ILanguageModelToolsConfirmationService confirmationService: ILanguageModelToolsConfirmationService,
	) {
		super();

		const editTool = instantiationService.createInstance(FetchWebPageTool);
		this._register(toolsService.registerTool(FetchWebPageToolData, editTool));

		this._register(confirmationService.registerConfirmationContribution(
			InternalFetchWebPageToolId,
			instantiationService.createInstance(
				ChatUrlFetchingConfirmationContribution,
				params => (params as IFetchWebPageToolParams).urls
			)
		));
	}
}

class ChatCommandLineHandler extends Disposable {

	static readonly ID = 'workbench.contrib.chatCommandLineHandler';

	constructor(
		@INativeWorkbenchEnvironmentService private readonly environmentService: INativeWorkbenchEnvironmentService,
		@ICommandService private readonly commandService: ICommandService,
		@IWorkspaceTrustRequestService private readonly workspaceTrustRequestService: IWorkspaceTrustRequestService,
		@ILogService private readonly logService: ILogService,
		@IWorkbenchLayoutService private readonly layoutService: IWorkbenchLayoutService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService
	) {
		super();

		this.registerListeners();
	}

	private registerListeners() {
		ipcRenderer.on('vscode:handleChatRequest', (_, ...args: unknown[]) => {
			const chatArgs = args[0] as typeof this.environmentService.args.chat;
			this.logService.trace('vscode:handleChatRequest', chatArgs);

			this.prompt(chatArgs);
		});
	}

	private async prompt(args: typeof this.environmentService.args.chat): Promise<void> {
		if (!Array.isArray(args?._)) {
			return;
		}

		const trusted = await this.workspaceTrustRequestService.requestWorkspaceTrust({
			message: localize('copilotWorkspaceTrust', "AI features are currently only supported in trusted workspaces.")
		});

		if (!trusted) {
			return;
		}

		const opts: IChatViewOpenOptions = {
			query: args._.length > 0 ? args._.join(' ') : '',
			mode: args.mode ?? ChatModeKind.Agent,
			attachFiles: args['add-file']?.map(file => URI.file(resolve(file))), // use `resolve` to deal with relative paths properly
		};

		if (args.maximize) {
			const location = this.contextKeyService.getContextKeyValue<ViewContainerLocation>(ChatContextKeys.panelLocation.key);
			if (location === ViewContainerLocation.AuxiliaryBar) {
				this.layoutService.setAuxiliaryBarMaximized(true);
			} else if (location === ViewContainerLocation.Panel && !this.layoutService.isPanelMaximized()) {
				this.layoutService.toggleMaximizedPanel();
			}
		}

		await this.commandService.executeCommand(ACTION_ID_NEW_CHAT);
		await this.commandService.executeCommand(CHAT_OPEN_ACTION_ID, opts);
	}
}

class ChatSuspendThrottlingHandler extends Disposable {

	static readonly ID = 'workbench.contrib.chatSuspendThrottlingHandler';

	constructor(
		@INativeHostService nativeHostService: INativeHostService,
		@IChatService chatService: IChatService,
		@IConfigurationService configurationService: IConfigurationService
	) {
		super();

		if (!configurationService.getValue<boolean>(ChatConfiguration.SuspendThrottling)) {
			return;
		}

		this._register(autorun(reader => {
			const running = chatService.requestInProgressObs.read(reader);

			// When a chat request is in progress, we must ensure that background
			// throttling is not applied so that the chat session can continue
			// even when the window is not in focus.
			nativeHostService.setBackgroundThrottling(!running);
		}));
	}
}

class ChatLifecycleHandler extends Disposable {

	static readonly ID = 'workbench.contrib.chatLifecycleHandler';

	constructor(
		@ILifecycleService lifecycleService: ILifecycleService,
		@IChatService private readonly chatService: IChatService,
		@IDialogService private readonly dialogService: IDialogService,
		@IChatWidgetService private readonly widgetService: IChatWidgetService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IExtensionService extensionService: IExtensionService,
	) {
		super();

		this._register(lifecycleService.onBeforeShutdown(e => {
			e.veto(this.shouldVetoShutdown(e.reason), 'veto.chat');
		}));

		this._register(extensionService.onWillStop(e => {
			e.veto(this.chatService.requestInProgressObs.get(), localize('chatRequestInProgress', "A chat request is in progress."));
		}));
	}

	private shouldVetoShutdown(reason: ShutdownReason): boolean | Promise<boolean> {
		const running = this.chatService.requestInProgressObs.read(undefined);
		if (!running) {
			return false;
		}

		if (ChatContextKeys.skipChatRequestInProgressMessage.getValue(this.contextKeyService) === true) {
			return false;
		}

		return this.doShouldVetoShutdown(reason);
	}

	private async doShouldVetoShutdown(reason: ShutdownReason): Promise<boolean> {

		this.widgetService.revealWidget();

		let message: string;
		let detail: string;
		switch (reason) {
			case ShutdownReason.CLOSE:
				message = localize('closeTheWindow.message', "A chat request is in progress. Are you sure you want to close the window?");
				detail = localize('closeTheWindow.detail', "The chat request will stop if you close the window.");
				break;
			case ShutdownReason.LOAD:
				message = localize('changeWorkspace.message', "A chat request is in progress. Are you sure you want to change the workspace?");
				detail = localize('changeWorkspace.detail', "The chat request will stop if you change the workspace.");
				break;
			case ShutdownReason.RELOAD:
				message = localize('reloadTheWindow.message', "A chat request is in progress. Are you sure you want to reload the window?");
				detail = localize('reloadTheWindow.detail', "The chat request will stop if you reload the window.");
				break;
			default:
				message = isMacintosh ? localize('quit.message', "A chat request is in progress. Are you sure you want to quit?") : localize('exit.message', "A chat request is in progress. Are you sure you want to exit?");
				detail = isMacintosh ? localize('quit.detail', "The chat request will stop if you quit.") : localize('exit.detail', "The chat request will stop if you exit.");
				break;
		}

		const result = await this.dialogService.confirm({ message, detail });

		return !result.confirmed;
	}
}

registerAction2(StartVoiceChatAction);

registerAction2(VoiceChatInChatViewAction);
registerAction2(HoldToVoiceChatInChatViewAction);
registerAction2(QuickVoiceChatAction);
registerAction2(InlineVoiceChatAction);

registerAction2(StopListeningAction);
registerAction2(StopListeningAndSubmitAction);

registerAction2(ReadChatResponseAloud);
registerAction2(StopReadChatItemAloud);
registerAction2(StopReadAloud);

registerChatDeveloperActions();

registerWorkbenchContribution2(KeywordActivationContribution.ID, KeywordActivationContribution, WorkbenchPhase.AfterRestored);
registerWorkbenchContribution2(NativeBuiltinToolsContribution.ID, NativeBuiltinToolsContribution, WorkbenchPhase.AfterRestored);
registerWorkbenchContribution2(ChatCommandLineHandler.ID, ChatCommandLineHandler, WorkbenchPhase.BlockRestore);
registerWorkbenchContribution2(ChatSuspendThrottlingHandler.ID, ChatSuspendThrottlingHandler, WorkbenchPhase.AfterRestored);
registerWorkbenchContribution2(ChatLifecycleHandler.ID, ChatLifecycleHandler, WorkbenchPhase.AfterRestored);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/electron-browser/actions/chatDeveloperActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/electron-browser/actions/chatDeveloperActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Codicon } from '../../../../../base/common/codicons.js';
import { ServicesAccessor } from '../../../../../editor/browser/editorExtensions.js';
import { localize2 } from '../../../../../nls.js';
import { Categories } from '../../../../../platform/action/common/actionCommonCategories.js';
import { Action2, registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { INativeHostService } from '../../../../../platform/native/common/native.js';
import { ChatContextKeys } from '../../common/chatContextKeys.js';
import { IChatService } from '../../common/chatService.js';

export function registerChatDeveloperActions() {
	registerAction2(OpenChatStorageFolderAction);
}

class OpenChatStorageFolderAction extends Action2 {
	static readonly ID = 'workbench.action.chat.openStorageFolder';

	constructor() {
		super({
			id: OpenChatStorageFolderAction.ID,
			title: localize2('workbench.action.chat.openStorageFolder.label', "Open Chat Storage Folder"),
			icon: Codicon.attach,
			category: Categories.Developer,
			f1: true,
			precondition: ChatContextKeys.enabled
		});
	}

	override async run(accessor: ServicesAccessor, ...args: unknown[]): Promise<void> {
		const chatService = accessor.get(IChatService);
		const nativeHostService = accessor.get(INativeHostService);
		const storagePath = chatService.getChatStorageFolder();
		nativeHostService.showItemInFolder(storagePath.fsPath);
	}
}
```

--------------------------------------------------------------------------------

````
