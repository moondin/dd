---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 437
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 437 of 552)

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

---[FILE: src/vs/workbench/contrib/preferences/browser/settingsTree.ts]---
Location: vscode-main/src/vs/workbench/contrib/preferences/browser/settingsTree.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BrowserFeatures } from '../../../../base/browser/canIUse.js';
import * as DOM from '../../../../base/browser/dom.js';
import * as domStylesheetsJs from '../../../../base/browser/domStylesheets.js';
import { StandardKeyboardEvent } from '../../../../base/browser/keyboardEvent.js';
import { renderAsPlaintext } from '../../../../base/browser/markdownRenderer.js';
import { IMouseEvent } from '../../../../base/browser/mouseEvent.js';
import * as aria from '../../../../base/browser/ui/aria/aria.js';
import { Button } from '../../../../base/browser/ui/button/button.js';
import { SimpleIconLabel } from '../../../../base/browser/ui/iconLabel/simpleIconLabel.js';
import { IInputOptions, InputBox } from '../../../../base/browser/ui/inputbox/inputBox.js';
import { CachedListVirtualDelegate } from '../../../../base/browser/ui/list/list.js';
import { DefaultStyleController, IListAccessibilityProvider } from '../../../../base/browser/ui/list/listWidget.js';
import { ISelectOptionItem, SelectBox } from '../../../../base/browser/ui/selectBox/selectBox.js';
import { Toggle, unthemedToggleStyles } from '../../../../base/browser/ui/toggle/toggle.js';
import { ToolBar } from '../../../../base/browser/ui/toolbar/toolbar.js';
import { RenderIndentGuides } from '../../../../base/browser/ui/tree/abstractTree.js';
import { IObjectTreeOptions } from '../../../../base/browser/ui/tree/objectTree.js';
import { ObjectTreeModel } from '../../../../base/browser/ui/tree/objectTreeModel.js';
import { ITreeFilter, ITreeModel, ITreeNode, ITreeRenderer, TreeFilterResult, TreeVisibility } from '../../../../base/browser/ui/tree/tree.js';
import { Action, IAction, Separator } from '../../../../base/common/actions.js';
import { distinct } from '../../../../base/common/arrays.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { IJSONSchema } from '../../../../base/common/jsonSchema.js';
import { KeyCode } from '../../../../base/common/keyCodes.js';
import { Disposable, DisposableStore, isDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { isIOS } from '../../../../base/common/platform.js';
import { escapeRegExpCharacters } from '../../../../base/common/strings.js';
import { isDefined, isUndefinedOrNull } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import { IMarkdownRendererService } from '../../../../platform/markdown/browser/markdownRenderer.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { localize } from '../../../../nls.js';
import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { ConfigurationTarget, IConfigurationService, getLanguageTagSettingPlainKey } from '../../../../platform/configuration/common/configuration.js';
import { ConfigurationScope } from '../../../../platform/configuration/common/configurationRegistry.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService, IContextViewService } from '../../../../platform/contextview/browser/contextView.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { IListService, WorkbenchObjectTree } from '../../../../platform/list/browser/listService.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { defaultButtonStyles, getInputBoxStyle, getListStyles, getSelectBoxStyles } from '../../../../platform/theme/browser/defaultStyles.js';
import { editorBackground, foreground } from '../../../../platform/theme/common/colorRegistry.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IUserDataProfilesService } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { getIgnoredSettings } from '../../../../platform/userDataSync/common/settingsMerge.js';
import { IUserDataSyncEnablementService, getDefaultIgnoredSettings } from '../../../../platform/userDataSync/common/userDataSync.js';
import { hasNativeContextMenu } from '../../../../platform/window/common/window.js';
import { APPLICATION_SCOPES, APPLY_ALL_PROFILES_SETTING, IWorkbenchConfigurationService } from '../../../services/configuration/common/configuration.js';
import { IWorkbenchEnvironmentService } from '../../../services/environment/common/environmentService.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { ISetting, ISettingsGroup, SETTINGS_AUTHORITY, SettingValueType } from '../../../services/preferences/common/preferences.js';
import { getInvalidTypeError } from '../../../services/preferences/common/preferencesValidation.js';
import { IExtensionsWorkbenchService } from '../../extensions/common/extensions.js';
import { LANGUAGE_SETTING_TAG, SETTINGS_EDITOR_COMMAND_SHOW_CONTEXT_MENU, compareTwoNullableNumbers } from '../common/preferences.js';
import { settingsNumberInputBackground, settingsNumberInputBorder, settingsNumberInputForeground, settingsSelectBackground, settingsSelectBorder, settingsSelectForeground, settingsSelectListBorder, settingsTextInputBackground, settingsTextInputBorder, settingsTextInputForeground } from '../common/settingsEditorColorRegistry.js';
import { settingsMoreActionIcon } from './preferencesIcons.js';
import { SettingsTarget } from './preferencesWidgets.js';
import { ISettingOverrideClickEvent, SettingsTreeIndicatorsLabel, getIndicatorsLabelAriaLabel } from './settingsEditorSettingIndicators.js';
import { ITOCEntry, ITOCFilter } from './settingsLayout.js';
import { ISettingsEditorViewState, SettingsTreeElement, SettingsTreeGroupChild, SettingsTreeGroupElement, SettingsTreeNewExtensionsElement, SettingsTreeSettingElement, inspectSetting, objectSettingSupportsRemoveDefaultValue, settingKeyToDisplayFormat } from './settingsTreeModels.js';
import { ExcludeSettingWidget, IBoolObjectDataItem, IIncludeExcludeDataItem, IListDataItem, IObjectDataItem, IObjectEnumOption, IObjectKeySuggester, IObjectValueSuggester, IncludeSettingWidget, ListSettingWidget, ObjectSettingCheckboxWidget, ObjectSettingDropdownWidget, ObjectValue, SettingListEvent } from './settingsWidgets.js';

const $ = DOM.$;

function getIncludeExcludeDisplayValue(element: SettingsTreeSettingElement): IIncludeExcludeDataItem[] {
	const elementDefaultValue: Record<string, unknown> = typeof element.defaultValue === 'object'
		? element.defaultValue ?? {}
		: {};

	const data = element.isConfigured ?
		{ ...elementDefaultValue, ...element.scopeValue } :
		elementDefaultValue;

	return Object.keys(data)
		.filter(key => !!data[key])
		.map(key => {
			const defaultValue = elementDefaultValue[key];

			// Get source if it's a default value
			let source: string | undefined;
			if (defaultValue === data[key] && element.setting.type === 'object' && element.defaultValueSource instanceof Map) {
				const defaultSource = element.defaultValueSource.get(`${element.setting.key}.${key}`);
				source = typeof defaultSource === 'string' ? defaultSource : defaultSource?.displayName;
			}

			const value = data[key];
			const sibling = typeof value === 'boolean' ? undefined : value.when;
			return {
				value: {
					type: 'string',
					data: key
				},
				sibling,
				elementType: element.valueType,
				source
			};
		});
}

function areAllPropertiesDefined(properties: string[], itemsToDisplay: IObjectDataItem[]): boolean {
	const staticProperties = new Set(properties);
	itemsToDisplay.forEach(({ key }) => staticProperties.delete(key.data));
	return staticProperties.size === 0;
}

function getEnumOptionsFromSchema(schema: IJSONSchema): IObjectEnumOption[] {
	if (schema.anyOf) {
		return schema.anyOf.map(getEnumOptionsFromSchema).flat();
	}

	const enumDescriptions = schema.enumDescriptions ?? [];

	return (schema.enum ?? []).map((value, idx) => {
		const description = idx < enumDescriptions.length
			? enumDescriptions[idx]
			: undefined;

		return { value, description };
	});
}

function getObjectValueType(schema: IJSONSchema): ObjectValue['type'] {
	if (schema.anyOf) {
		const subTypes = schema.anyOf.map(getObjectValueType);
		if (subTypes.some(type => type === 'enum')) {
			return 'enum';
		}
		return 'string';
	}

	if (schema.type === 'boolean') {
		return 'boolean';
	} else if (schema.type === 'string' && isDefined(schema.enum) && schema.enum.length > 0) {
		return 'enum';
	} else {
		return 'string';
	}
}

function getObjectEntryValueDisplayValue(type: ObjectValue['type'], data: unknown, options: IObjectEnumOption[]): ObjectValue {
	if (type === 'boolean') {
		return { type, data: !!data };
	} else if (type === 'enum') {
		return { type, data: '' + data, options };
	} else {
		return { type, data: '' + data };
	}
}

function getObjectDisplayValue(element: SettingsTreeSettingElement): IObjectDataItem[] {
	const elementDefaultValue: Record<string, unknown> = typeof element.defaultValue === 'object'
		? element.defaultValue ?? {}
		: {};

	const elementScopeValue: Record<string, unknown> = typeof element.scopeValue === 'object'
		? element.scopeValue ?? {}
		: {};

	const data = element.isConfigured ?
		{ ...elementDefaultValue, ...elementScopeValue } :
		element.hasPolicyValue ? element.scopeValue :
			elementDefaultValue;

	const { objectProperties, objectPatternProperties, objectAdditionalProperties } = element.setting;
	const patternsAndSchemas = Object
		.entries(objectPatternProperties ?? {})
		.map(([pattern, schema]) => ({
			pattern: new RegExp(pattern),
			schema
		}));

	const wellDefinedKeyEnumOptions = Object.entries(objectProperties ?? {}).map(
		([key, schema]) => ({ value: key, description: schema.description })
	);

	return Object.keys(data).map(key => {
		const defaultValue = elementDefaultValue[key];

		// Get source if it's a default value
		let source: string | undefined;
		if (defaultValue === data[key] && element.setting.type === 'object' && element.defaultValueSource instanceof Map) {
			const defaultSource = element.defaultValueSource.get(`${element.setting.key}.${key}`);
			source = typeof defaultSource === 'string' ? defaultSource : defaultSource?.displayName;
		}

		if (isDefined(objectProperties) && key in objectProperties) {
			const valueEnumOptions = getEnumOptionsFromSchema(objectProperties[key]);
			return {
				key: {
					type: 'enum',
					data: key,
					options: wellDefinedKeyEnumOptions,
				},
				value: getObjectEntryValueDisplayValue(getObjectValueType(objectProperties[key]), data[key], valueEnumOptions),
				keyDescription: objectProperties[key].description,
				removable: isUndefinedOrNull(defaultValue),
				resetable: !isUndefinedOrNull(defaultValue),
				source
			} satisfies IObjectDataItem;
		}

		// The row is removable if it doesn't have a default value assigned or the setting supports removing the default value.
		// If a default value is assigned and the user modified the default, it can be reset back to the default.
		const removable = defaultValue === undefined || objectSettingSupportsRemoveDefaultValue(element.setting.key);
		const resetable = !!defaultValue && defaultValue !== data[key];
		const schema = patternsAndSchemas.find(({ pattern }) => pattern.test(key))?.schema;
		if (schema) {
			const valueEnumOptions = getEnumOptionsFromSchema(schema);
			return {
				key: { type: 'string', data: key },
				value: getObjectEntryValueDisplayValue(getObjectValueType(schema), data[key], valueEnumOptions),
				keyDescription: schema.description,
				removable,
				resetable,
				source
			} satisfies IObjectDataItem;
		}

		const additionalValueEnums = getEnumOptionsFromSchema(
			typeof objectAdditionalProperties === 'boolean'
				? {}
				: objectAdditionalProperties ?? {}
		);

		return {
			key: { type: 'string', data: key },
			value: getObjectEntryValueDisplayValue(
				typeof objectAdditionalProperties === 'object' ? getObjectValueType(objectAdditionalProperties) : 'string',
				data[key],
				additionalValueEnums,
			),
			keyDescription: typeof objectAdditionalProperties === 'object' ? objectAdditionalProperties.description : undefined,
			removable,
			resetable,
			source
		} satisfies IObjectDataItem;
	}).filter(item => !isUndefinedOrNull(item.value.data));
}

function getBoolObjectDisplayValue(element: SettingsTreeSettingElement): IBoolObjectDataItem[] {
	const elementDefaultValue: Record<string, unknown> = typeof element.defaultValue === 'object'
		? element.defaultValue ?? {}
		: {};

	const elementScopeValue: Record<string, unknown> = typeof element.scopeValue === 'object'
		? element.scopeValue ?? {}
		: {};

	const data = element.isConfigured ?
		{ ...elementDefaultValue, ...elementScopeValue } :
		elementDefaultValue;

	const { objectProperties } = element.setting;
	const displayValues: IBoolObjectDataItem[] = [];
	for (const key in objectProperties) {
		const defaultValue = elementDefaultValue[key];

		// Get source if it's a default value
		let source: string | undefined;
		if (defaultValue === data[key] && element.setting.type === 'object' && element.defaultValueSource instanceof Map) {
			const defaultSource = element.defaultValueSource.get(key);
			source = typeof defaultSource === 'string' ? defaultSource : defaultSource?.displayName;
		}

		displayValues.push({
			key: {
				type: 'string',
				data: key
			},
			value: {
				type: 'boolean',
				data: !!data[key]
			},
			keyDescription: objectProperties[key].description,
			removable: false,
			resetable: true,
			source
		});
	}
	return displayValues;
}

function createArraySuggester(element: SettingsTreeSettingElement): IObjectKeySuggester {
	return (keys, idx) => {
		const enumOptions: IObjectEnumOption[] = [];

		if (element.setting.enum) {
			element.setting.enum.forEach((key, i) => {
				// include the currently selected value, even if uniqueItems is true
				if (!element.setting.uniqueItems || (idx !== undefined && key === keys[idx]) || !keys.includes(key)) {
					const description = element.setting.enumDescriptions?.[i];
					enumOptions.push({ value: key, description });
				}
			});
		}

		return enumOptions.length > 0
			? { type: 'enum', data: enumOptions[0].value, options: enumOptions }
			: undefined;
	};
}

function createObjectKeySuggester(element: SettingsTreeSettingElement): IObjectKeySuggester {
	const { objectProperties } = element.setting;
	const allStaticKeys = Object.keys(objectProperties ?? {});

	return keys => {
		const existingKeys = new Set(keys);
		const enumOptions: IObjectEnumOption[] = [];

		allStaticKeys.forEach(staticKey => {
			if (!existingKeys.has(staticKey)) {
				enumOptions.push({ value: staticKey, description: objectProperties![staticKey].description });
			}
		});

		return enumOptions.length > 0
			? { type: 'enum', data: enumOptions[0].value, options: enumOptions }
			: undefined;
	};
}

function createObjectValueSuggester(element: SettingsTreeSettingElement): IObjectValueSuggester {
	const { objectProperties, objectPatternProperties, objectAdditionalProperties } = element.setting;

	const patternsAndSchemas = Object
		.entries(objectPatternProperties ?? {})
		.map(([pattern, schema]) => ({
			pattern: new RegExp(pattern),
			schema
		}));

	return (key: string) => {
		let suggestedSchema: IJSONSchema | undefined;

		if (isDefined(objectProperties) && key in objectProperties) {
			suggestedSchema = objectProperties[key];
		}

		const patternSchema = suggestedSchema ?? patternsAndSchemas.find(({ pattern }) => pattern.test(key))?.schema;

		if (isDefined(patternSchema)) {
			suggestedSchema = patternSchema;
		} else if (isDefined(objectAdditionalProperties) && typeof objectAdditionalProperties === 'object') {
			suggestedSchema = objectAdditionalProperties;
		}

		if (isDefined(suggestedSchema)) {
			const type = getObjectValueType(suggestedSchema);

			if (type === 'boolean') {
				return { type, data: suggestedSchema.default ?? true };
			} else if (type === 'enum') {
				const options = getEnumOptionsFromSchema(suggestedSchema);
				return { type, data: suggestedSchema.default ?? options[0].value, options };
			} else {
				return { type, data: suggestedSchema.default ?? '' };
			}
		}

		return;
	};
}

function isNonNullableNumericType(type: unknown): type is 'number' | 'integer' {
	return type === 'number' || type === 'integer';
}

function parseNumericObjectValues(dataElement: SettingsTreeSettingElement, v: Record<string, unknown>): Record<string, unknown> {
	const newRecord: Record<string, unknown> = {};
	for (const key in v) {
		// Set to true/false once we're sure of the answer
		let keyMatchesNumericProperty: boolean | undefined;
		const patternProperties = dataElement.setting.objectPatternProperties;
		const properties = dataElement.setting.objectProperties;
		const additionalProperties = dataElement.setting.objectAdditionalProperties;

		// Match the current record key against the properties of the object
		if (properties) {
			for (const propKey in properties) {
				if (propKey === key) {
					keyMatchesNumericProperty = isNonNullableNumericType(properties[propKey].type);
					break;
				}
			}
		}
		if (keyMatchesNumericProperty === undefined && patternProperties) {
			for (const patternKey in patternProperties) {
				if (key.match(patternKey)) {
					keyMatchesNumericProperty = isNonNullableNumericType(patternProperties[patternKey].type);
					break;
				}
			}
		}
		if (keyMatchesNumericProperty === undefined && additionalProperties && typeof additionalProperties !== 'boolean') {
			if (isNonNullableNumericType(additionalProperties.type)) {
				keyMatchesNumericProperty = true;
			}
		}
		newRecord[key] = keyMatchesNumericProperty ? Number(v[key]) : v[key];
	}
	return newRecord;
}

function getListDisplayValue(element: SettingsTreeSettingElement): IListDataItem[] {
	if (!element.value || !Array.isArray(element.value)) {
		return [];
	}

	if (element.setting.arrayItemType === 'enum') {
		let enumOptions: IObjectEnumOption[] = [];
		if (element.setting.enum) {
			enumOptions = element.setting.enum.map((setting, i) => {
				return {
					value: setting,
					description: element.setting.enumDescriptions?.[i]
				};
			});
		}
		return element.value.map((key: string) => {
			return {
				value: {
					type: 'enum',
					data: key,
					options: enumOptions
				}
			};
		});
	} else {
		return element.value.map((key: string) => {
			return {
				value: {
					type: 'string',
					data: key
				}
			};
		});
	}
}

function getShowAddButtonList(dataElement: SettingsTreeSettingElement, listDisplayValue: IListDataItem[]): boolean {
	if (dataElement.setting.enum && dataElement.setting.uniqueItems) {
		return dataElement.setting.enum.length - listDisplayValue.length > 0;
	} else {
		return true;
	}
}

export function resolveSettingsTree(tocData: ITOCEntry<string>, coreSettingsGroups: ISettingsGroup[], filter: ITOCFilter | undefined, logService: ILogService): { tree: ITOCEntry<ISetting>; leftoverSettings: Set<ISetting> } {
	const allSettings = getFlatSettings(coreSettingsGroups);
	return {
		tree: _resolveSettingsTree(tocData, allSettings, filter, logService),
		leftoverSettings: allSettings
	};
}

export function resolveConfiguredUntrustedSettings(groups: ISettingsGroup[], target: SettingsTarget, languageFilter: string | undefined, configurationService: IWorkbenchConfigurationService): ISetting[] {
	const allSettings = getFlatSettings(groups);
	return [...allSettings].filter(setting => setting.restricted && inspectSetting(setting.key, target, languageFilter, configurationService).isConfigured);
}

export async function createTocTreeForExtensionSettings(extensionService: IExtensionService, groups: ISettingsGroup[], filter: ITOCFilter | undefined): Promise<ITOCEntry<ISetting>> {
	const extGroupTree = new Map<string, ITOCEntry<ISetting>>();
	const addEntryToTree = (extensionId: string, extensionName: string, childEntry: ITOCEntry<ISetting>) => {
		if (!extGroupTree.has(extensionId)) {
			const rootEntry = {
				id: extensionId,
				label: extensionName,
				children: []
			};
			extGroupTree.set(extensionId, rootEntry);
		}
		extGroupTree.get(extensionId)!.children!.push(childEntry);
	};
	const processGroupEntry = async (group: ISettingsGroup) => {
		const flatSettings = group.sections.map(section => section.settings).flat();
		const settings = filter ? getMatchingSettings(new Set(flatSettings), filter) : flatSettings;

		const extensionId = group.extensionInfo!.id;
		const extension = await extensionService.getExtension(extensionId);
		const extensionName = extension?.displayName ?? extension?.name ?? extensionId;

		// There could be multiple groups with the same extension id that all belong to the same extension.
		// To avoid highlighting all groups upon expanding the extension's ToC entry,
		// use the group ID only if it is non-empty and isn't the extension ID.
		// Ref https://github.com/microsoft/vscode/issues/241521.
		const settingGroupId = (group.id && group.id !== extensionId) ? group.id : group.title;

		const childEntry: ITOCEntry<ISetting> = {
			id: settingGroupId,
			label: group.title,
			order: group.order,
			settings
		};
		addEntryToTree(extensionId, extensionName, childEntry);
	};

	const processPromises = groups.map(g => processGroupEntry(g));
	return Promise.all(processPromises).then(() => {
		const extGroups: ITOCEntry<ISetting>[] = [];
		for (const extensionRootEntry of extGroupTree.values()) {
			for (const child of extensionRootEntry.children!) {
				// Sort the individual settings of the child by order.
				// Leave the undefined order settings untouched.
				child.settings?.sort((a, b) => {
					return compareTwoNullableNumbers(a.order, b.order);
				});
			}

			if (extensionRootEntry.children!.length === 1) {
				// There is a single category for this extension.
				// Push a flattened setting.
				extGroups.push({
					id: extensionRootEntry.id,
					label: extensionRootEntry.children![0].label,
					settings: extensionRootEntry.children![0].settings
				});
			} else {
				// Sort the categories.
				// Leave the undefined order categories untouched.
				extensionRootEntry.children!.sort((a, b) => {
					return compareTwoNullableNumbers(a.order, b.order);
				});

				// If there is a category that matches the setting name,
				// add the settings in manually as "ungrouped" settings.
				// https://github.com/microsoft/vscode/issues/137259
				const ungroupedChild = extensionRootEntry.children!.find(child => child.label === extensionRootEntry.label);
				if (ungroupedChild && !ungroupedChild.children) {
					const groupedChildren = extensionRootEntry.children!.filter(child => child !== ungroupedChild);
					extGroups.push({
						id: extensionRootEntry.id,
						label: extensionRootEntry.label,
						settings: ungroupedChild.settings,
						children: groupedChildren
					});
				} else {
					// Push all the groups as-is.
					extGroups.push(extensionRootEntry);
				}
			}
		}

		// Sort the outermost settings.
		extGroups.sort((a, b) => a.label.localeCompare(b.label));

		return {
			id: 'extensions',
			label: localize('extensions', "Extensions"),
			children: extGroups
		};
	});
}

function _resolveSettingsTree(tocData: ITOCEntry<string>, allSettings: Set<ISetting>, filter: ITOCFilter | undefined, logService: ILogService): ITOCEntry<ISetting> {
	let children: ITOCEntry<ISetting>[] | undefined;
	if (tocData.children) {
		children = tocData.children
			.filter(child => child.hide !== true)
			.map(child => _resolveSettingsTree(child, allSettings, filter, logService))
			.filter(child => child.children?.length || child.settings?.length);
	}

	let settings: ISetting[] | undefined;
	if (filter || tocData.settings) {
		settings = getMatchingSettings(allSettings, {
			include: {
				keyPatterns: [...filter?.include?.keyPatterns ?? [], ...tocData.settings ?? []],
				tags: filter?.include?.tags ? [...filter.include.tags] : []
			},
			exclude: filter?.exclude ?? {}
		});
	}

	if (!children && !settings) {
		throw new Error(`TOC node has no child groups or settings: ${tocData.id}`);
	}

	return {
		id: tocData.id,
		label: tocData.label,
		children,
		settings
	};
}

function getMatchingSettings(allSettings: Set<ISetting>, filter: ITOCFilter): ISetting[] {
	const result: ISetting[] = [];

	allSettings.forEach(setting => {
		let shouldInclude = false;
		let shouldExclude = false;

		// Check include filters
		if (filter.include?.keyPatterns) {
			shouldInclude = filter.include.keyPatterns.some(pattern => {
				if (pattern.startsWith('@tag:')) {
					const tagName = pattern.substring(5);
					return setting.tags?.includes(tagName);
				} else {
					return settingMatches(setting, pattern);
				}
			});
		} else {
			shouldInclude = true;
		}

		if (shouldInclude && filter.include?.tags?.length) {
			shouldInclude = filter.include.tags.some(tag => setting.tags?.includes(tag));
		}

		// Check exclude filters (takes precedence)
		if (filter.exclude?.keyPatterns) {
			shouldExclude = filter.exclude.keyPatterns.some(pattern => {
				if (pattern.startsWith('@tag:')) {
					const tagName = pattern.substring(5);
					return setting.tags?.includes(tagName);
				} else {
					return settingMatches(setting, pattern);
				}
			});
		}

		if (!shouldExclude && filter.exclude?.tags?.length) {
			shouldExclude = filter.exclude.tags.some(tag => setting.tags?.includes(tag));
		}

		// Include if matches include filter and doesn't match exclude filter
		if (shouldInclude && !shouldExclude) {
			result.push(setting);
			allSettings.delete(setting);
		}
	});

	return result.sort((a, b) => a.key.localeCompare(b.key));
}

const settingPatternCache = new Map<string, RegExp>();

export function createSettingMatchRegExp(pattern: string): RegExp {
	pattern = escapeRegExpCharacters(pattern)
		.replace(/\\\*/g, '.*');

	return new RegExp(`^${pattern}$`, 'i');
}

function settingMatches(s: ISetting, pattern: string): boolean {
	let regExp = settingPatternCache.get(pattern);
	if (!regExp) {
		regExp = createSettingMatchRegExp(pattern);
		settingPatternCache.set(pattern, regExp);
	}

	return regExp.test(s.key);
}

function getFlatSettings(settingsGroups: ISettingsGroup[]) {
	const result: Set<ISetting> = new Set();

	for (const group of settingsGroups) {
		for (const section of group.sections) {
			for (const s of section.settings) {
				if (!s.overrides || !s.overrides.length) {
					result.add(s);
				}
			}
		}
	}

	return result;
}

interface IDisposableTemplate {
	readonly toDispose: DisposableStore;
}

interface ISettingItemTemplate<T = any> extends IDisposableTemplate {
	onChange?: (value: T) => void;

	context?: SettingsTreeSettingElement;
	containerElement: HTMLElement;
	categoryElement: HTMLElement;
	labelElement: SimpleIconLabel;
	descriptionElement: HTMLElement;
	controlElement: HTMLElement;
	deprecationWarningElement: HTMLElement;
	indicatorsLabel: SettingsTreeIndicatorsLabel;
	toolbar: ToolBar;
	readonly elementDisposables: DisposableStore;
}

interface ISettingBoolItemTemplate extends ISettingItemTemplate<boolean> {
	checkbox: Toggle;
}

interface ISettingExtensionToggleItemTemplate extends ISettingItemTemplate<undefined> {
	actionButton: Button;
	dismissButton: Button;
}

interface ISettingTextItemTemplate extends ISettingItemTemplate<string> {
	inputBox: InputBox;
	validationErrorMessageElement: HTMLElement;
}

type ISettingNumberItemTemplate = ISettingTextItemTemplate;

interface ISettingEnumItemTemplate extends ISettingItemTemplate<number> {
	selectBox: SelectBox;
	selectElement: HTMLSelectElement | null;
	enumDescriptionElement: HTMLElement;
}

interface ISettingComplexItemTemplate extends ISettingItemTemplate<void> {
	button: HTMLElement;
	validationErrorMessageElement: HTMLElement;
}

interface ISettingComplexObjectItemTemplate extends ISettingComplexItemTemplate {
	objectSettingWidget: ObjectSettingDropdownWidget;
}

interface ISettingListItemTemplate extends ISettingItemTemplate<string[] | undefined> {
	listWidget: ListSettingWidget<IListDataItem>;
	validationErrorMessageElement: HTMLElement;
}

interface ISettingIncludeExcludeItemTemplate extends ISettingItemTemplate<void> {
	includeExcludeWidget: ListSettingWidget<IIncludeExcludeDataItem>;
}

interface ISettingObjectItemTemplate extends ISettingItemTemplate<Record<string, unknown> | undefined> {
	objectDropdownWidget?: ObjectSettingDropdownWidget;
	objectCheckboxWidget?: ObjectSettingCheckboxWidget;
	validationErrorMessageElement: HTMLElement;
}

interface ISettingNewExtensionsTemplate extends IDisposableTemplate {
	button: Button;
	context?: SettingsTreeNewExtensionsElement;
}

interface IGroupTitleTemplate extends IDisposableTemplate {
	context?: SettingsTreeGroupElement;
	parent: HTMLElement;
}

const SETTINGS_TEXT_TEMPLATE_ID = 'settings.text.template';
const SETTINGS_MULTILINE_TEXT_TEMPLATE_ID = 'settings.multilineText.template';
const SETTINGS_NUMBER_TEMPLATE_ID = 'settings.number.template';
const SETTINGS_ENUM_TEMPLATE_ID = 'settings.enum.template';
const SETTINGS_BOOL_TEMPLATE_ID = 'settings.bool.template';
const SETTINGS_ARRAY_TEMPLATE_ID = 'settings.array.template';
const SETTINGS_EXCLUDE_TEMPLATE_ID = 'settings.exclude.template';
const SETTINGS_INCLUDE_TEMPLATE_ID = 'settings.include.template';
const SETTINGS_OBJECT_TEMPLATE_ID = 'settings.object.template';
const SETTINGS_BOOL_OBJECT_TEMPLATE_ID = 'settings.boolObject.template';
const SETTINGS_COMPLEX_TEMPLATE_ID = 'settings.complex.template';
const SETTINGS_COMPLEX_OBJECT_TEMPLATE_ID = 'settings.complexObject.template';
const SETTINGS_NEW_EXTENSIONS_TEMPLATE_ID = 'settings.newExtensions.template';
const SETTINGS_ELEMENT_TEMPLATE_ID = 'settings.group.template';
const SETTINGS_EXTENSION_TOGGLE_TEMPLATE_ID = 'settings.extensionToggle.template';

export interface ISettingChangeEvent {
	key: string;
	value: unknown; // undefined => reset/unconfigure
	type: SettingValueType | SettingValueType[];
	manualReset: boolean;
	scope: ConfigurationScope | undefined;
}

export interface ISettingLinkClickEvent {
	source: SettingsTreeSettingElement;
	targetKey: string;
}

function removeChildrenFromTabOrder(node: Element): void {
	// eslint-disable-next-line no-restricted-syntax
	const focusableElements = node.querySelectorAll(`
		[tabindex="0"],
		input:not([tabindex="-1"]),
		select:not([tabindex="-1"]),
		textarea:not([tabindex="-1"]),
		a:not([tabindex="-1"]),
		button:not([tabindex="-1"]),
		area:not([tabindex="-1"])
	`);

	focusableElements.forEach(element => {
		element.setAttribute(AbstractSettingRenderer.ELEMENT_FOCUSABLE_ATTR, 'true');
		element.setAttribute('tabindex', '-1');
	});
}

function addChildrenToTabOrder(node: Element): void {
	// eslint-disable-next-line no-restricted-syntax
	const focusableElements = node.querySelectorAll(
		`[${AbstractSettingRenderer.ELEMENT_FOCUSABLE_ATTR}="true"]`
	);

	focusableElements.forEach(element => {
		element.removeAttribute(AbstractSettingRenderer.ELEMENT_FOCUSABLE_ATTR);
		element.setAttribute('tabindex', '0');
	});
}

export interface HeightChangeParams {
	element: SettingsTreeElement;
	height: number;
}

export abstract class AbstractSettingRenderer extends Disposable implements ITreeRenderer<SettingsTreeElement, never, any> {
	/** To override */
	abstract get templateId(): string;

	static readonly CONTROL_CLASS = 'setting-control-focus-target';
	static readonly CONTROL_SELECTOR = '.' + this.CONTROL_CLASS;
	static readonly CONTENTS_CLASS = 'setting-item-contents';
	static readonly CONTENTS_SELECTOR = '.' + this.CONTENTS_CLASS;
	static readonly ALL_ROWS_SELECTOR = '.monaco-list-row';

	static readonly SETTING_KEY_ATTR = 'data-key';
	static readonly SETTING_ID_ATTR = 'data-id';
	static readonly ELEMENT_FOCUSABLE_ATTR = 'data-focusable';

	private readonly _onDidClickOverrideElement = this._register(new Emitter<ISettingOverrideClickEvent>());
	readonly onDidClickOverrideElement: Event<ISettingOverrideClickEvent> = this._onDidClickOverrideElement.event;

	protected readonly _onDidChangeSetting = this._register(new Emitter<ISettingChangeEvent>());
	readonly onDidChangeSetting: Event<ISettingChangeEvent> = this._onDidChangeSetting.event;

	protected readonly _onDidOpenSettings = this._register(new Emitter<string>());
	readonly onDidOpenSettings: Event<string> = this._onDidOpenSettings.event;

	private readonly _onDidClickSettingLink = this._register(new Emitter<ISettingLinkClickEvent>());
	readonly onDidClickSettingLink: Event<ISettingLinkClickEvent> = this._onDidClickSettingLink.event;

	protected readonly _onDidFocusSetting = this._register(new Emitter<SettingsTreeSettingElement>());
	readonly onDidFocusSetting: Event<SettingsTreeSettingElement> = this._onDidFocusSetting.event;

	private ignoredSettings: string[];
	private readonly _onDidChangeIgnoredSettings = this._register(new Emitter<void>());
	readonly onDidChangeIgnoredSettings: Event<void> = this._onDidChangeIgnoredSettings.event;

	protected readonly _onDidChangeSettingHeight = this._register(new Emitter<HeightChangeParams>());
	readonly onDidChangeSettingHeight: Event<HeightChangeParams> = this._onDidChangeSettingHeight.event;

	protected readonly _onApplyFilter = this._register(new Emitter<string>());
	readonly onApplyFilter: Event<string> = this._onApplyFilter.event;

	constructor(
		private readonly settingActions: IAction[],
		private readonly disposableActionFactory: (setting: ISetting, settingTarget: SettingsTarget) => IAction[],
		@IThemeService protected readonly _themeService: IThemeService,
		@IContextViewService protected readonly _contextViewService: IContextViewService,
		@IOpenerService protected readonly _openerService: IOpenerService,
		@IInstantiationService protected readonly _instantiationService: IInstantiationService,
		@ICommandService protected readonly _commandService: ICommandService,
		@IContextMenuService protected readonly _contextMenuService: IContextMenuService,
		@IKeybindingService protected readonly _keybindingService: IKeybindingService,
		@IConfigurationService protected readonly _configService: IConfigurationService,
		@IExtensionService protected readonly _extensionsService: IExtensionService,
		@IExtensionsWorkbenchService protected readonly _extensionsWorkbenchService: IExtensionsWorkbenchService,
		@IProductService protected readonly _productService: IProductService,
		@ITelemetryService protected readonly _telemetryService: ITelemetryService,
		@IHoverService protected readonly _hoverService: IHoverService,
		@IMarkdownRendererService private readonly _markdownRendererService: IMarkdownRendererService,
	) {
		super();

		this.ignoredSettings = getIgnoredSettings(getDefaultIgnoredSettings(), this._configService);
		this._register(this._configService.onDidChangeConfiguration(e => {
			this.ignoredSettings = getIgnoredSettings(getDefaultIgnoredSettings(), this._configService);
			this._onDidChangeIgnoredSettings.fire();
		}));
	}

	abstract renderTemplate(container: HTMLElement): any;

	abstract renderElement(element: ITreeNode<SettingsTreeSettingElement, never>, index: number, templateData: unknown): void;

	protected renderCommonTemplate(tree: unknown, _container: HTMLElement, typeClass: string): ISettingItemTemplate {
		_container.classList.add('setting-item');
		_container.classList.add('setting-item-' + typeClass);

		const toDispose = new DisposableStore();

		const container = DOM.append(_container, $(AbstractSettingRenderer.CONTENTS_SELECTOR));
		container.classList.add('settings-row-inner-container');
		const titleElement = DOM.append(container, $('.setting-item-title'));
		const labelCategoryContainer = DOM.append(titleElement, $('.setting-item-cat-label-container'));
		const categoryElement = DOM.append(labelCategoryContainer, $('span.setting-item-category'));
		const labelElementContainer = DOM.append(labelCategoryContainer, $('span.setting-item-label'));
		const labelElement = toDispose.add(new SimpleIconLabel(labelElementContainer));
		const indicatorsLabel = toDispose.add(this._instantiationService.createInstance(SettingsTreeIndicatorsLabel, titleElement));

		const descriptionElement = DOM.append(container, $('.setting-item-description'));
		const modifiedIndicatorElement = DOM.append(container, $('.setting-item-modified-indicator'));
		toDispose.add(this._hoverService.setupDelayedHover(modifiedIndicatorElement, {
			content: localize('modified', "The setting has been configured in the current scope.")
		}));

		const valueElement = DOM.append(container, $('.setting-item-value'));
		const controlElement = DOM.append(valueElement, $('div.setting-item-control'));

		const deprecationWarningElement = DOM.append(container, $('.setting-item-deprecation-message'));

		const toolbarContainer = DOM.append(container, $('.setting-toolbar-container'));
		const toolbar = this.renderSettingToolbar(toolbarContainer);

		const template: ISettingItemTemplate = {
			toDispose,
			elementDisposables: toDispose.add(new DisposableStore()),

			containerElement: container,
			categoryElement,
			labelElement,
			descriptionElement,
			controlElement,
			deprecationWarningElement,
			indicatorsLabel,
			toolbar
		};

		// Prevent clicks from being handled by list
		toDispose.add(DOM.addDisposableListener(controlElement, DOM.EventType.MOUSE_DOWN, e => e.stopPropagation()));

		toDispose.add(DOM.addDisposableListener(titleElement, DOM.EventType.MOUSE_ENTER, e => container.classList.add('mouseover')));
		toDispose.add(DOM.addDisposableListener(titleElement, DOM.EventType.MOUSE_LEAVE, e => container.classList.remove('mouseover')));

		return template;
	}

	protected addSettingElementFocusHandler(template: ISettingItemTemplate): void {
		const focusTracker = DOM.trackFocus(template.containerElement);
		template.toDispose.add(focusTracker);
		template.toDispose.add(focusTracker.onDidBlur(() => {
			if (template.containerElement.classList.contains('focused')) {
				template.containerElement.classList.remove('focused');
			}
		}));

		template.toDispose.add(focusTracker.onDidFocus(() => {
			template.containerElement.classList.add('focused');

			if (template.context) {
				this._onDidFocusSetting.fire(template.context);
			}
		}));
	}

	protected renderSettingToolbar(container: HTMLElement): ToolBar {
		const toggleMenuKeybinding = this._keybindingService.lookupKeybinding(SETTINGS_EDITOR_COMMAND_SHOW_CONTEXT_MENU);
		let toggleMenuTitle = localize('settingsContextMenuTitle', "More Actions... ");
		if (toggleMenuKeybinding) {
			toggleMenuTitle += ` (${toggleMenuKeybinding && toggleMenuKeybinding.getLabel()})`;
		}

		const toolbar = new ToolBar(container, this._contextMenuService, {
			toggleMenuTitle,
			renderDropdownAsChildElement: !isIOS,
			moreIcon: settingsMoreActionIcon
		});
		return toolbar;
	}

	protected renderSettingElement(node: ITreeNode<SettingsTreeSettingElement, never>, index: number, template: ISettingItemTemplate | ISettingBoolItemTemplate): void {
		const element = node.element;

		// The element must inspect itself to get information for
		// the modified indicator and the overridden Settings indicators.
		element.inspectSelf();

		template.context = element;
		template.toolbar.context = element;
		const actions = this.disposableActionFactory(element.setting, element.settingsTarget);
		actions.forEach(a => isDisposable(a) && template.elementDisposables.add(a));
		template.toolbar.setActions([], [...this.settingActions, ...actions]);

		const setting = element.setting;

		template.containerElement.classList.toggle('is-configured', element.isConfigured);
		template.containerElement.setAttribute(AbstractSettingRenderer.SETTING_KEY_ATTR, element.setting.key);
		template.containerElement.setAttribute(AbstractSettingRenderer.SETTING_ID_ATTR, element.id);

		const titleTooltip = setting.key + (element.isConfigured ? ' - Modified' : '');
		template.categoryElement.textContent = element.displayCategory ? (element.displayCategory + ': ') : '';
		template.elementDisposables.add(this._hoverService.setupDelayedHover(template.categoryElement, { content: titleTooltip }));

		template.labelElement.text = element.displayLabel;
		template.labelElement.title = titleTooltip;

		template.descriptionElement.innerText = '';
		if (element.setting.descriptionIsMarkdown) {
			const renderedDescription = this.renderSettingMarkdown(element, template.containerElement, element.description, template.elementDisposables);
			template.descriptionElement.appendChild(renderedDescription);
		} else {
			template.descriptionElement.innerText = element.description;
		}

		template.indicatorsLabel.updateScopeOverrides(element, this._onDidClickOverrideElement, this._onApplyFilter);
		template.elementDisposables.add(this._configService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(APPLY_ALL_PROFILES_SETTING)) {
				template.indicatorsLabel.updateScopeOverrides(element, this._onDidClickOverrideElement, this._onApplyFilter);
			}
		}));

		const onChange = (value: unknown) => this._onDidChangeSetting.fire({
			key: element.setting.key,
			value,
			type: template.context!.valueType,
			manualReset: false,
			scope: element.setting.scope
		});
		const deprecationText = element.setting.deprecationMessage || '';
		if (deprecationText && element.setting.deprecationMessageIsMarkdown) {
			template.deprecationWarningElement.innerText = '';
			template.deprecationWarningElement.appendChild(this.renderSettingMarkdown(element, template.containerElement, element.setting.deprecationMessage!, template.elementDisposables));
		} else {
			template.deprecationWarningElement.innerText = deprecationText;
		}
		template.deprecationWarningElement.prepend($('.codicon.codicon-error'));
		template.containerElement.classList.toggle('is-deprecated', !!deprecationText);

		this.renderValue(element, <ISettingItemTemplate>template, onChange);

		template.indicatorsLabel.updateWorkspaceTrust(element);
		template.indicatorsLabel.updateSyncIgnored(element, this.ignoredSettings);
		template.indicatorsLabel.updateDefaultOverrideIndicator(element);
		template.indicatorsLabel.updatePreviewIndicator(element);
		template.indicatorsLabel.updateAdvancedIndicator(element);
		template.elementDisposables.add(this.onDidChangeIgnoredSettings(() => {
			template.indicatorsLabel.updateSyncIgnored(element, this.ignoredSettings);
		}));

		this.updateSettingTabbable(element, template);
		template.elementDisposables.add(element.onDidChangeTabbable(() => {
			this.updateSettingTabbable(element, template);
		}));
	}

	private updateSettingTabbable(element: SettingsTreeSettingElement, template: ISettingItemTemplate | ISettingBoolItemTemplate): void {
		if (element.tabbable) {
			addChildrenToTabOrder(template.containerElement);
		} else {
			removeChildrenFromTabOrder(template.containerElement);
		}
	}

	private renderSettingMarkdown(element: SettingsTreeSettingElement, container: HTMLElement, text: string, disposables: DisposableStore): HTMLElement {
		// Rewrite `#editor.fontSize#` to link format
		text = fixSettingLinks(text);

		const renderedMarkdown = disposables.add(this._markdownRendererService.render({ value: text, isTrusted: true }, {
			actionHandler: (content: string) => {
				if (content.startsWith('#')) {
					const e: ISettingLinkClickEvent = {
						source: element,
						targetKey: content.substring(1)
					};
					this._onDidClickSettingLink.fire(e);
				} else {
					this._openerService.open(content, { allowCommands: true }).catch(onUnexpectedError);
				}
			},
			asyncRenderCallback: () => {
				const height = container.clientHeight;
				if (height) {
					this._onDidChangeSettingHeight.fire({ element, height });
				}
			},
		}));

		renderedMarkdown.element.classList.add('setting-item-markdown');
		cleanRenderedMarkdown(renderedMarkdown.element);
		return renderedMarkdown.element;
	}

	protected abstract renderValue(dataElement: SettingsTreeSettingElement, template: ISettingItemTemplate, onChange: (value: unknown) => void): void;

	disposeTemplate(template: IDisposableTemplate): void {
		template.toDispose.dispose();
	}

	disposeElement(_element: ITreeNode<SettingsTreeElement>, _index: number, template: IDisposableTemplate): void {
		(template as ISettingItemTemplate).elementDisposables?.clear();
	}
}

class SettingGroupRenderer implements ITreeRenderer<SettingsTreeGroupElement, never, IGroupTitleTemplate> {
	templateId = SETTINGS_ELEMENT_TEMPLATE_ID;

	renderTemplate(container: HTMLElement): IGroupTitleTemplate {
		container.classList.add('group-title');

		const template: IGroupTitleTemplate = {
			parent: container,
			toDispose: new DisposableStore()
		};

		return template;
	}

	renderElement(element: ITreeNode<SettingsTreeGroupElement, never>, index: number, templateData: IGroupTitleTemplate): void {
		templateData.parent.innerText = '';
		const labelElement = DOM.append(templateData.parent, $('div.settings-group-title-label.settings-row-inner-container'));
		labelElement.classList.add(`settings-group-level-${element.element.level}`);
		labelElement.textContent = element.element.label;

		if (element.element.isFirstGroup) {
			labelElement.classList.add('settings-group-first');
		}
	}

	disposeTemplate(templateData: IGroupTitleTemplate): void {
		templateData.toDispose.dispose();
	}
}

export class SettingNewExtensionsRenderer implements ITreeRenderer<SettingsTreeNewExtensionsElement, never, ISettingNewExtensionsTemplate> {
	templateId = SETTINGS_NEW_EXTENSIONS_TEMPLATE_ID;

	constructor(
		@ICommandService private readonly _commandService: ICommandService,
	) {
	}

	renderTemplate(container: HTMLElement): ISettingNewExtensionsTemplate {
		const toDispose = new DisposableStore();

		container.classList.add('setting-item-new-extensions');

		const button = new Button(container, { title: true, ...defaultButtonStyles });
		toDispose.add(button);
		toDispose.add(button.onDidClick(() => {
			if (template.context) {
				this._commandService.executeCommand('workbench.extensions.action.showExtensionsWithIds', template.context.extensionIds);
			}
		}));
		button.label = localize('newExtensionsButtonLabel', "Show matching extensions");
		button.element.classList.add('settings-new-extensions-button');

		const template: ISettingNewExtensionsTemplate = {
			button,
			toDispose
		};

		return template;
	}

	renderElement(element: ITreeNode<SettingsTreeNewExtensionsElement, never>, index: number, templateData: ISettingNewExtensionsTemplate): void {
		templateData.context = element.element;
	}

	disposeTemplate(template: IDisposableTemplate): void {
		template.toDispose.dispose();
	}
}

export class SettingComplexRenderer extends AbstractSettingRenderer implements ITreeRenderer<SettingsTreeSettingElement, never, ISettingComplexItemTemplate> {
	private static readonly EDIT_IN_JSON_LABEL = localize('editInSettingsJson', "Edit in settings.json");

	templateId = SETTINGS_COMPLEX_TEMPLATE_ID;

	renderTemplate(container: HTMLElement): ISettingComplexItemTemplate {
		const common = this.renderCommonTemplate(null, container, 'complex');

		const openSettingsButton = DOM.append(common.controlElement, $('a.edit-in-settings-button'));
		openSettingsButton.classList.add(AbstractSettingRenderer.CONTROL_CLASS);
		openSettingsButton.role = 'button';

		const validationErrorMessageElement = $('.setting-item-validation-message');
		common.containerElement.appendChild(validationErrorMessageElement);

		const template: ISettingComplexItemTemplate = {
			...common,
			button: openSettingsButton,
			validationErrorMessageElement
		};

		this.addSettingElementFocusHandler(template);

		return template;
	}

	renderElement(element: ITreeNode<SettingsTreeSettingElement, never>, index: number, templateData: ISettingComplexItemTemplate): void {
		super.renderSettingElement(element, index, templateData);
	}

	protected renderValue(dataElement: SettingsTreeSettingElement, template: ISettingComplexItemTemplate, onChange: (value: string) => void): void {
		const plainKey = getLanguageTagSettingPlainKey(dataElement.setting.key);
		const editLanguageSettingLabel = localize('editLanguageSettingLabel', "Edit settings for {0}", plainKey);
		const isLanguageTagSetting = dataElement.setting.isLanguageTagSetting;
		template.button.textContent = isLanguageTagSetting
			? editLanguageSettingLabel
			: SettingComplexRenderer.EDIT_IN_JSON_LABEL;

		const onClickOrKeydown = (e: UIEvent) => {
			if (isLanguageTagSetting) {
				this._onApplyFilter.fire(`@${LANGUAGE_SETTING_TAG}${plainKey.replaceAll(' ', '')}`);
			} else {
				this._onDidOpenSettings.fire(dataElement.setting.key);
			}
			e.preventDefault();
			e.stopPropagation();
		};
		template.elementDisposables.add(DOM.addDisposableListener(template.button, DOM.EventType.CLICK, (e) => {
			onClickOrKeydown(e);
		}));
		template.elementDisposables.add(DOM.addDisposableListener(template.button, DOM.EventType.KEY_DOWN, (e) => {
			const ev = new StandardKeyboardEvent(e);
			if (ev.equals(KeyCode.Space) || ev.equals(KeyCode.Enter)) {
				onClickOrKeydown(e);
			}
		}));

		this.renderValidations(dataElement, template);

		if (isLanguageTagSetting) {
			template.button.setAttribute('aria-label', editLanguageSettingLabel);
		} else {
			template.button.setAttribute('aria-label', `${SettingComplexRenderer.EDIT_IN_JSON_LABEL}: ${dataElement.setting.key}`);
		}
	}

	private renderValidations(dataElement: SettingsTreeSettingElement, template: ISettingComplexItemTemplate) {
		const errMsg = dataElement.isConfigured && getInvalidTypeError(dataElement.value, dataElement.setting.type);
		if (errMsg) {
			template.containerElement.classList.add('invalid-input');
			template.validationErrorMessageElement.innerText = errMsg;
			return;
		}

		template.containerElement.classList.remove('invalid-input');
	}
}

class SettingComplexObjectRenderer extends SettingComplexRenderer implements ITreeRenderer<SettingsTreeSettingElement, never, ISettingComplexObjectItemTemplate> {

	override templateId = SETTINGS_COMPLEX_OBJECT_TEMPLATE_ID;

	override renderTemplate(container: HTMLElement): ISettingComplexObjectItemTemplate {
		const common = this.renderCommonTemplate(null, container, 'list');

		const objectSettingWidget = common.toDispose.add(this._instantiationService.createInstance(ObjectSettingDropdownWidget, common.controlElement));
		objectSettingWidget.domNode.classList.add(AbstractSettingRenderer.CONTROL_CLASS);

		const openSettingsButton = DOM.append(DOM.append(common.controlElement, $('.complex-object-edit-in-settings-button-container')), $('a.complex-object.edit-in-settings-button'));
		openSettingsButton.classList.add(AbstractSettingRenderer.CONTROL_CLASS);
		openSettingsButton.role = 'button';

		const validationErrorMessageElement = $('.setting-item-validation-message');
		common.containerElement.appendChild(validationErrorMessageElement);

		const template: ISettingComplexObjectItemTemplate = {
			...common,
			button: openSettingsButton,
			validationErrorMessageElement,
			objectSettingWidget
		};

		this.addSettingElementFocusHandler(template);

		return template;
	}

	protected override renderValue(dataElement: SettingsTreeSettingElement, template: ISettingComplexObjectItemTemplate, onChange: (value: string) => void): void {
		const items = getObjectDisplayValue(dataElement);
		template.objectSettingWidget.setValue(items, {
			settingKey: dataElement.setting.key,
			showAddButton: false,
			isReadOnly: true,
		});
		template.button.parentElement?.classList.toggle('hide', dataElement.hasPolicyValue);
		super.renderValue(dataElement, template, onChange);
	}
}

class SettingArrayRenderer extends AbstractSettingRenderer implements ITreeRenderer<SettingsTreeSettingElement, never, ISettingListItemTemplate> {
	templateId = SETTINGS_ARRAY_TEMPLATE_ID;

	renderTemplate(container: HTMLElement): ISettingListItemTemplate {
		const common = this.renderCommonTemplate(null, container, 'list');
		// eslint-disable-next-line no-restricted-syntax
		const descriptionElement = common.containerElement.querySelector('.setting-item-description')!;
		const validationErrorMessageElement = $('.setting-item-validation-message');
		descriptionElement.after(validationErrorMessageElement);

		const listWidget = this._instantiationService.createInstance(ListSettingWidget, common.controlElement);
		listWidget.domNode.classList.add(AbstractSettingRenderer.CONTROL_CLASS);
		common.toDispose.add(listWidget);

		const template: ISettingListItemTemplate = {
			...common,
			listWidget,
			validationErrorMessageElement
		};

		this.addSettingElementFocusHandler(template);

		common.toDispose.add(
			listWidget.onDidChangeList(e => {
				const newList = this.computeNewList(template, e);
				template.onChange?.(newList);
			})
		);

		return template;
	}

	private computeNewList(template: ISettingListItemTemplate, e: SettingListEvent<IListDataItem>): string[] | undefined {
		if (template.context) {
			let newValue: string[] = [];
			if (Array.isArray(template.context.scopeValue)) {
				newValue = [...template.context.scopeValue];
			} else if (Array.isArray(template.context.value)) {
				newValue = [...template.context.value];
			}

			if (e.type === 'move') {
				// A drag and drop occurred
				const sourceIndex = e.sourceIndex;
				const targetIndex = e.targetIndex;
				const splicedElem = newValue.splice(sourceIndex, 1)[0];
				newValue.splice(targetIndex, 0, splicedElem);
			} else if (e.type === 'remove' || e.type === 'reset') {
				newValue.splice(e.targetIndex, 1);
			} else if (e.type === 'change') {
				const itemValueData = e.newItem.value.data.toString();

				// Update value
				if (e.targetIndex > -1) {
					newValue[e.targetIndex] = itemValueData;
				}
				// For some reason, we are updating and cannot find original value
				// Just append the value in this case
				else {
					newValue.push(itemValueData);
				}
			} else if (e.type === 'add') {
				newValue.push(e.newItem.value.data.toString());
			}

			if (
				template.context.defaultValue &&
				Array.isArray(template.context.defaultValue) &&
				template.context.defaultValue.length === newValue.length &&
				template.context.defaultValue.join() === newValue.join()
			) {
				return undefined;
			}
			return newValue;
		}

		return undefined;
	}

	renderElement(element: ITreeNode<SettingsTreeSettingElement, never>, index: number, templateData: ISettingListItemTemplate): void {
		super.renderSettingElement(element, index, templateData);
	}

	protected renderValue(dataElement: SettingsTreeSettingElement, template: ISettingListItemTemplate, onChange: (value: string[] | number[] | undefined) => void): void {
		const value = getListDisplayValue(dataElement);
		const keySuggester = dataElement.setting.enum ? createArraySuggester(dataElement) : undefined;
		template.listWidget.setValue(value, {
			showAddButton: getShowAddButtonList(dataElement, value),
			keySuggester
		});
		template.context = dataElement;

		template.elementDisposables.add(toDisposable(() => {
			template.listWidget.cancelEdit();
		}));

		template.onChange = (v: string[] | undefined) => {
			if (v && !renderArrayValidations(dataElement, template, v, false)) {
				const itemType = dataElement.setting.arrayItemType;
				const arrToSave = isNonNullableNumericType(itemType) ? v.map(a => +a) : v;
				onChange(arrToSave);
			} else {
				// Save the setting unparsed and containing the errors.
				// renderArrayValidations will render relevant error messages.
				onChange(v);
			}
		};

		renderArrayValidations(dataElement, template, value.map(v => v.value.data.toString()), true);
	}
}

abstract class AbstractSettingObjectRenderer extends AbstractSettingRenderer implements ITreeRenderer<SettingsTreeSettingElement, never, ISettingObjectItemTemplate> {

	protected renderTemplateWithWidget(common: ISettingItemTemplate, widget: ObjectSettingCheckboxWidget | ObjectSettingDropdownWidget): ISettingObjectItemTemplate {
		widget.domNode.classList.add(AbstractSettingRenderer.CONTROL_CLASS);
		common.toDispose.add(widget);

		// eslint-disable-next-line no-restricted-syntax
		const descriptionElement = common.containerElement.querySelector('.setting-item-description')!;
		const validationErrorMessageElement = $('.setting-item-validation-message');
		descriptionElement.after(validationErrorMessageElement);

		const template: ISettingObjectItemTemplate = {
			...common,
			validationErrorMessageElement
		};
		if (widget instanceof ObjectSettingCheckboxWidget) {
			template.objectCheckboxWidget = widget;
		} else {
			template.objectDropdownWidget = widget;
		}

		this.addSettingElementFocusHandler(template);
		return template;
	}

	renderElement(element: ITreeNode<SettingsTreeSettingElement, never>, index: number, templateData: ISettingObjectItemTemplate): void {
		super.renderSettingElement(element, index, templateData);
	}
}

class SettingObjectRenderer extends AbstractSettingObjectRenderer implements ITreeRenderer<SettingsTreeSettingElement, never, ISettingObjectItemTemplate> {
	override templateId = SETTINGS_OBJECT_TEMPLATE_ID;

	renderTemplate(container: HTMLElement): ISettingObjectItemTemplate {
		const common = this.renderCommonTemplate(null, container, 'list');
		const widget = this._instantiationService.createInstance(ObjectSettingDropdownWidget, common.controlElement);
		const template = this.renderTemplateWithWidget(common, widget);
		common.toDispose.add(widget.onDidChangeList(e => {
			this.onDidChangeObject(template, e);
		}));
		return template;
	}

	private onDidChangeObject(template: ISettingObjectItemTemplate, e: SettingListEvent<IObjectDataItem>): void {
		const widget = template.objectDropdownWidget!;
		if (template.context) {
			const settingSupportsRemoveDefault = objectSettingSupportsRemoveDefaultValue(template.context.setting.key);
			const defaultValue: Record<string, unknown> = typeof template.context.defaultValue === 'object'
				? template.context.defaultValue ?? {}
				: {};

			const scopeValue: Record<string, unknown> = typeof template.context.scopeValue === 'object'
				? template.context.scopeValue ?? {}
				: {};

			const newValue: Record<string, unknown> = { ...template.context.scopeValue }; // Initialize with scoped values as removed default values are not rendered
			const newItems: IObjectDataItem[] = [];

			widget.items.forEach((item, idx) => {
				// Item was updated
				if ((e.type === 'change' || e.type === 'move') && e.targetIndex === idx) {
					// If the key of the default value is changed, remove the default value
					if (e.originalItem.key.data !== e.newItem.key.data && settingSupportsRemoveDefault && e.originalItem.key.data in defaultValue) {
						newValue[e.originalItem.key.data] = null;
					} else {
						delete newValue[e.originalItem.key.data];
					}
					newValue[e.newItem.key.data] = e.newItem.value.data;
					newItems.push(e.newItem);
				}
				// All remaining items, but skip the one that we just updated
				else if ((e.type !== 'change' && e.type !== 'move') || e.newItem.key.data !== item.key.data) {
					newValue[item.key.data] = item.value.data;
					newItems.push(item);
				}
			});

			// Item was deleted
			if (e.type === 'remove' || e.type === 'reset') {
				const objectKey = e.originalItem.key.data;
				const removingDefaultValue = e.type === 'remove' && settingSupportsRemoveDefault && defaultValue[objectKey] === e.originalItem.value.data;
				if (removingDefaultValue) {
					newValue[objectKey] = null;
				} else {
					delete newValue[objectKey];
				}

				const itemToDelete = newItems.findIndex(item => item.key.data === objectKey);
				const defaultItemValue = defaultValue[objectKey] as string | boolean;

				// Item does not have a default or default is bing removed
				if (removingDefaultValue || isUndefinedOrNull(defaultValue[objectKey]) && itemToDelete > -1) {
					newItems.splice(itemToDelete, 1);
				} else if (!removingDefaultValue && itemToDelete > -1) {
					newItems[itemToDelete].value.data = defaultItemValue;
				}
			}
			// New item was added
			else if (e.type === 'add') {
				newValue[e.newItem.key.data] = e.newItem.value.data;
				newItems.push(e.newItem);
			}

			Object.entries(newValue).forEach(([key, value]) => {
				// value from the scope has changed back to the default
				if (scopeValue[key] !== value && defaultValue[key] === value && !(settingSupportsRemoveDefault && value === null)) {
					delete newValue[key];
				}
			});

			const newObject = Object.keys(newValue).length === 0 ? undefined : newValue;
			template.objectDropdownWidget!.setValue(newItems);
			template.onChange?.(newObject);
		}
	}

	protected renderValue(dataElement: SettingsTreeSettingElement, template: ISettingObjectItemTemplate, onChange: (value: Record<string, unknown> | undefined) => void): void {
		const items = getObjectDisplayValue(dataElement);
		const { key, objectProperties, objectPatternProperties, objectAdditionalProperties } = dataElement.setting;

		template.objectDropdownWidget!.setValue(items, {
			settingKey: key,
			showAddButton: objectAdditionalProperties === false
				? (
					!areAllPropertiesDefined(Object.keys(objectProperties ?? {}), items) ||
					isDefined(objectPatternProperties)
				)
				: true,
			keySuggester: createObjectKeySuggester(dataElement),
			valueSuggester: createObjectValueSuggester(dataElement)
		});

		template.context = dataElement;

		template.elementDisposables.add(toDisposable(() => {
			template.objectDropdownWidget!.cancelEdit();
		}));

		template.onChange = (v: Record<string, unknown> | undefined) => {
			if (v && !renderArrayValidations(dataElement, template, v, false)) {
				const parsedRecord = parseNumericObjectValues(dataElement, v);
				onChange(parsedRecord);
			} else {
				// Save the setting unparsed and containing the errors.
				// renderArrayValidations will render relevant error messages.
				onChange(v);
			}
		};
		renderArrayValidations(dataElement, template, dataElement.value, true);
	}
}

class SettingBoolObjectRenderer extends AbstractSettingObjectRenderer implements ITreeRenderer<SettingsTreeSettingElement, never, ISettingObjectItemTemplate> {
	override templateId = SETTINGS_BOOL_OBJECT_TEMPLATE_ID;

	renderTemplate(container: HTMLElement): ISettingObjectItemTemplate {
		const common = this.renderCommonTemplate(null, container, 'list');
		const widget = this._instantiationService.createInstance(ObjectSettingCheckboxWidget, common.controlElement);
		const template = this.renderTemplateWithWidget(common, widget);
		common.toDispose.add(widget.onDidChangeList(e => {
			this.onDidChangeObject(template, e);
		}));
		return template;
	}

	protected onDidChangeObject(template: ISettingObjectItemTemplate, e: SettingListEvent<IBoolObjectDataItem>): void {
		if (template.context) {
			const widget = template.objectCheckboxWidget!;
			const defaultValue: Record<string, unknown> = typeof template.context.defaultValue === 'object'
				? template.context.defaultValue ?? {}
				: {};

			const scopeValue: Record<string, unknown> = typeof template.context.scopeValue === 'object'
				? template.context.scopeValue ?? {}
				: {};

			const newValue: Record<string, unknown> = { ...template.context.scopeValue }; // Initialize with scoped values as removed default values are not rendered
			const newItems: IBoolObjectDataItem[] = [];

			if (e.type !== 'change') {
				console.warn('Unexpected event type', e.type, 'for bool object setting', template.context.setting.key);
				return;
			}

			widget.items.forEach((item, idx) => {
				// Item was updated
				if (e.targetIndex === idx) {
					newValue[e.newItem.key.data] = e.newItem.value.data;
					newItems.push(e.newItem);
				}
				// All remaining items, but skip the one that we just updated
				else if (e.newItem.key.data !== item.key.data) {
					newValue[item.key.data] = item.value.data;
					newItems.push(item);
				}
			});

			Object.entries(newValue).forEach(([key, value]) => {
				// value from the scope has changed back to the default
				if (scopeValue[key] !== value && defaultValue[key] === value) {
					delete newValue[key];
				}
			});

			const newObject = Object.keys(newValue).length === 0 ? undefined : newValue;
			template.objectCheckboxWidget!.setValue(newItems);
			template.onChange?.(newObject);

			// Focus this setting explicitly, in case we were previously
			// focused on another setting and clicked a checkbox/value container
			// for this setting.
			this._onDidFocusSetting.fire(template.context);
		}
	}

	protected renderValue(dataElement: SettingsTreeSettingElement, template: ISettingObjectItemTemplate, onChange: (value: Record<string, unknown> | undefined) => void): void {
		const items = getBoolObjectDisplayValue(dataElement);
		const { key } = dataElement.setting;

		template.objectCheckboxWidget!.setValue(items, {
			settingKey: key
		});

		template.context = dataElement;
		template.onChange = (v: Record<string, unknown> | undefined) => {
			onChange(v);
		};
	}
}

abstract class SettingIncludeExcludeRenderer extends AbstractSettingRenderer implements ITreeRenderer<SettingsTreeSettingElement, never, ISettingIncludeExcludeItemTemplate> {

	protected abstract isExclude(): boolean;

	renderTemplate(container: HTMLElement): ISettingIncludeExcludeItemTemplate {
		const common = this.renderCommonTemplate(null, container, 'list');

		const includeExcludeWidget = this._instantiationService.createInstance(this.isExclude() ? ExcludeSettingWidget : IncludeSettingWidget, common.controlElement);
		includeExcludeWidget.domNode.classList.add(AbstractSettingRenderer.CONTROL_CLASS);
		common.toDispose.add(includeExcludeWidget);

		const template: ISettingIncludeExcludeItemTemplate = {
			...common,
			includeExcludeWidget
		};

		this.addSettingElementFocusHandler(template);

		common.toDispose.add(includeExcludeWidget.onDidChangeList(e => this.onDidChangeIncludeExclude(template, e)));

		return template;
	}

	private onDidChangeIncludeExclude(template: ISettingIncludeExcludeItemTemplate, e: SettingListEvent<IListDataItem>): void {
		if (template.context) {
			const newValue = { ...template.context.scopeValue };

			// first delete the existing entry, if present
			if (e.type !== 'add') {
				if (e.originalItem.value.data.toString() in template.context.defaultValue) {
					// delete a default by overriding it
					newValue[e.originalItem.value.data.toString()] = false;
				} else {
					delete newValue[e.originalItem.value.data.toString()];
				}
			}

			// then add the new or updated entry, if present
			if (e.type === 'change' || e.type === 'add' || e.type === 'move') {
				if (e.newItem.value.data.toString() in template.context.defaultValue && !e.newItem.sibling) {
					// add a default by deleting its override
					delete newValue[e.newItem.value.data.toString()];
				} else {
					newValue[e.newItem.value.data.toString()] = e.newItem.sibling ? { when: e.newItem.sibling } : true;
				}
			}

			function sortKeys<T extends object>(obj: T) {
				const sortedKeys = Object.keys(obj)
					.sort((a, b) => a.localeCompare(b)) as Array<keyof T>;

				const retVal: Partial<T> = {};
				for (const key of sortedKeys) {
					retVal[key] = obj[key];
				}
				return retVal;
			}

			this._onDidChangeSetting.fire({
				key: template.context.setting.key,
				value: Object.keys(newValue).length === 0 ? undefined : sortKeys(newValue),
				type: template.context.valueType,
				manualReset: false,
				scope: template.context.setting.scope
			});
		}
	}

	renderElement(element: ITreeNode<SettingsTreeSettingElement, never>, index: number, templateData: ISettingIncludeExcludeItemTemplate): void {
		super.renderSettingElement(element, index, templateData);
	}

	protected renderValue(dataElement: SettingsTreeSettingElement, template: ISettingIncludeExcludeItemTemplate, onChange: (value: string) => void): void {
		const value = getIncludeExcludeDisplayValue(dataElement);
		template.includeExcludeWidget.setValue(value, { isReadOnly: dataElement.hasPolicyValue });
		template.context = dataElement;
		template.elementDisposables.add(toDisposable(() => {
			template.includeExcludeWidget.cancelEdit();
		}));
	}
}

class SettingExcludeRenderer extends SettingIncludeExcludeRenderer {
	templateId = SETTINGS_EXCLUDE_TEMPLATE_ID;

	protected override isExclude(): boolean {
		return true;
	}
}

class SettingIncludeRenderer extends SettingIncludeExcludeRenderer {
	templateId = SETTINGS_INCLUDE_TEMPLATE_ID;

	protected override isExclude(): boolean {
		return false;
	}
}

const settingsInputBoxStyles = getInputBoxStyle({
	inputBackground: settingsTextInputBackground,
	inputForeground: settingsTextInputForeground,
	inputBorder: settingsTextInputBorder
});

abstract class AbstractSettingTextRenderer extends AbstractSettingRenderer implements ITreeRenderer<SettingsTreeSettingElement, never, ISettingTextItemTemplate> {
	private readonly MULTILINE_MAX_HEIGHT = 150;

	renderTemplate(_container: HTMLElement, useMultiline?: boolean): ISettingTextItemTemplate {
		const common = this.renderCommonTemplate(null, _container, 'text');
		const validationErrorMessageElement = DOM.append(common.containerElement, $('.setting-item-validation-message'));

		const inputBoxOptions: IInputOptions = {
			flexibleHeight: useMultiline,
			flexibleWidth: false,
			flexibleMaxHeight: this.MULTILINE_MAX_HEIGHT,
			inputBoxStyles: settingsInputBoxStyles
		};
		const inputBox = new InputBox(common.controlElement, this._contextViewService, inputBoxOptions);
		common.toDispose.add(inputBox);
		common.toDispose.add(
			inputBox.onDidChange(e => {
				template.onChange?.(e);
			}));
		common.toDispose.add(inputBox);
		inputBox.inputElement.classList.add(AbstractSettingRenderer.CONTROL_CLASS);
		inputBox.inputElement.tabIndex = 0;

		const template: ISettingTextItemTemplate = {
			...common,
			inputBox,
			validationErrorMessageElement
		};

		this.addSettingElementFocusHandler(template);

		return template;
	}

	renderElement(element: ITreeNode<SettingsTreeSettingElement, never>, index: number, templateData: ISettingTextItemTemplate): void {
		super.renderSettingElement(element, index, templateData);
	}

	protected renderValue(dataElement: SettingsTreeSettingElement, template: ISettingTextItemTemplate, onChange: (value: string) => void): void {
		template.onChange = undefined;
		template.inputBox.value = dataElement.value;
		template.inputBox.setEnabled(!dataElement.hasPolicyValue);
		template.inputBox.setAriaLabel(dataElement.setting.key);
		template.onChange = value => {
			if (!renderValidations(dataElement, template, false)) {
				onChange(value);
			}
		};

		renderValidations(dataElement, template, true);
	}
}

class SettingTextRenderer extends AbstractSettingTextRenderer implements ITreeRenderer<SettingsTreeSettingElement, never, ISettingTextItemTemplate> {
	templateId = SETTINGS_TEXT_TEMPLATE_ID;

	override renderTemplate(_container: HTMLElement): ISettingTextItemTemplate {
		const template = super.renderTemplate(_container, false);

		// TODO@9at8: listWidget filters out all key events from input boxes, so we need to come up with a better way
		// Disable ArrowUp and ArrowDown behaviour in favor of list navigation
		template.toDispose.add(DOM.addStandardDisposableListener(template.inputBox.inputElement, DOM.EventType.KEY_DOWN, e => {
			if (e.equals(KeyCode.UpArrow) || e.equals(KeyCode.DownArrow)) {
				e.preventDefault();
			}
		}));

		return template;
	}
}

class SettingMultilineTextRenderer extends AbstractSettingTextRenderer implements ITreeRenderer<SettingsTreeSettingElement, never, ISettingTextItemTemplate> {
	templateId = SETTINGS_MULTILINE_TEXT_TEMPLATE_ID;

	override renderTemplate(_container: HTMLElement): ISettingTextItemTemplate {
		return super.renderTemplate(_container, true);
	}

	protected override renderValue(dataElement: SettingsTreeSettingElement, template: ISettingTextItemTemplate, onChange: (value: string) => void) {
		const onChangeOverride = (value: string) => {
			// Ensure the model is up to date since a different value will be rendered as different height when probing the height.
			dataElement.value = value;
			onChange(value);
		};
		super.renderValue(dataElement, template, onChangeOverride);
		template.elementDisposables.add(
			template.inputBox.onDidHeightChange(e => {
				const height = template.containerElement.clientHeight;
				// Don't fire event if height is reported as 0,
				// which sometimes happens when clicking onto a new setting.
				if (height) {
					this._onDidChangeSettingHeight.fire({
						element: dataElement,
						height: template.containerElement.clientHeight
					});
				}
			})
		);
		template.inputBox.layout();
	}
}

class SettingEnumRenderer extends AbstractSettingRenderer implements ITreeRenderer<SettingsTreeSettingElement, never, ISettingEnumItemTemplate> {
	templateId = SETTINGS_ENUM_TEMPLATE_ID;

	renderTemplate(container: HTMLElement): ISettingEnumItemTemplate {
		const common = this.renderCommonTemplate(null, container, 'enum');

		const styles = getSelectBoxStyles({
			selectBackground: settingsSelectBackground,
			selectForeground: settingsSelectForeground,
			selectBorder: settingsSelectBorder,
			selectListBorder: settingsSelectListBorder
		});

		const selectBox = new SelectBox([], 0, this._contextViewService, styles, {
			useCustomDrawn: !hasNativeContextMenu(this._configService) || !(isIOS && BrowserFeatures.pointerEvents)
		});

		common.toDispose.add(selectBox);
		selectBox.render(common.controlElement);
		// eslint-disable-next-line no-restricted-syntax
		const selectElement = common.controlElement.querySelector('select');
		if (selectElement) {
			selectElement.classList.add(AbstractSettingRenderer.CONTROL_CLASS);
			selectElement.tabIndex = 0;
		}

		common.toDispose.add(
			selectBox.onDidSelect(e => {
				template.onChange?.(e.index);
			}));

		const enumDescriptionElement = common.containerElement.insertBefore($('.setting-item-enumDescription'), common.descriptionElement.nextSibling);

		const template: ISettingEnumItemTemplate = {
			...common,
			selectBox,
			selectElement,
			enumDescriptionElement
		};

		this.addSettingElementFocusHandler(template);

		return template;
	}

	renderElement(element: ITreeNode<SettingsTreeSettingElement, never>, index: number, templateData: ISettingEnumItemTemplate): void {
		super.renderSettingElement(element, index, templateData);
	}

	protected renderValue(dataElement: SettingsTreeSettingElement, template: ISettingEnumItemTemplate, onChange: (value: string) => void): void {
		// Make shallow copies here so that we don't modify the actual dataElement later
		const enumItemLabels = dataElement.setting.enumItemLabels ? [...dataElement.setting.enumItemLabels] : [];
		const enumDescriptions = dataElement.setting.enumDescriptions ? [...dataElement.setting.enumDescriptions] : [];
		const settingEnum = [...dataElement.setting.enum!];
		const enumDescriptionsAreMarkdown = dataElement.setting.enumDescriptionsAreMarkdown;

		const disposables = new DisposableStore();
		template.elementDisposables.add(disposables);

		let createdDefault = false;
		if (!settingEnum.includes(dataElement.defaultValue)) {
			// Add a new potentially blank default setting
			settingEnum.unshift(dataElement.defaultValue);
			enumDescriptions.unshift('');
			enumItemLabels.unshift('');
			createdDefault = true;
		}

		// Use String constructor in case of null or undefined values
		const stringifiedDefaultValue = escapeInvisibleChars(String(dataElement.defaultValue));
		const displayOptions: ISelectOptionItem[] = settingEnum
			.map(String)
			.map(escapeInvisibleChars)
			.map((data, index) => {
				const description = (enumDescriptions[index] && (enumDescriptionsAreMarkdown ? fixSettingLinks(enumDescriptions[index], false) : enumDescriptions[index]));
				return {
					text: enumItemLabels[index] ? enumItemLabels[index] : data,
					detail: enumItemLabels[index] ? data : '',
					description,
					descriptionIsMarkdown: enumDescriptionsAreMarkdown,
					descriptionMarkdownActionHandler: (content) => {
						this._openerService.open(content).catch(onUnexpectedError);
					},
					decoratorRight: (((data === stringifiedDefaultValue) || (createdDefault && index === 0)) ? localize('settings.Default', "default") : '')
				} satisfies ISelectOptionItem;
			});

		template.selectBox.setOptions(displayOptions);
		template.selectBox.setAriaLabel(dataElement.setting.key);
		template.selectBox.setEnabled(!dataElement.hasPolicyValue);

		let idx = settingEnum.indexOf(dataElement.value);
		if (idx === -1) {
			idx = 0;
		}

		template.onChange = undefined;
		template.selectBox.select(idx);
		template.onChange = (idx) => {
			if (createdDefault && idx === 0) {
				onChange(dataElement.defaultValue);
			} else {
				onChange(settingEnum[idx]);
			}
		};

		template.enumDescriptionElement.innerText = '';
	}
}

const settingsNumberInputBoxStyles = getInputBoxStyle({
	inputBackground: settingsNumberInputBackground,
	inputForeground: settingsNumberInputForeground,
	inputBorder: settingsNumberInputBorder
});

class SettingNumberRenderer extends AbstractSettingRenderer implements ITreeRenderer<SettingsTreeSettingElement, never, ISettingNumberItemTemplate> {
	templateId = SETTINGS_NUMBER_TEMPLATE_ID;

	renderTemplate(_container: HTMLElement): ISettingNumberItemTemplate {
		const common = super.renderCommonTemplate(null, _container, 'number');
		const validationErrorMessageElement = DOM.append(common.containerElement, $('.setting-item-validation-message'));

		const inputBox = new InputBox(common.controlElement, this._contextViewService, { type: 'number', inputBoxStyles: settingsNumberInputBoxStyles });
		common.toDispose.add(inputBox);
		common.toDispose.add(
			inputBox.onDidChange(e => {
				template.onChange?.(e);
			}));
		common.toDispose.add(inputBox);
		inputBox.inputElement.classList.add(AbstractSettingRenderer.CONTROL_CLASS);
		inputBox.inputElement.tabIndex = 0;

		const template: ISettingNumberItemTemplate = {
			...common,
			inputBox,
			validationErrorMessageElement
		};

		this.addSettingElementFocusHandler(template);

		return template;
	}

	renderElement(element: ITreeNode<SettingsTreeSettingElement, never>, index: number, templateData: ISettingNumberItemTemplate): void {
		super.renderSettingElement(element, index, templateData);
	}

	protected renderValue(dataElement: SettingsTreeSettingElement, template: ISettingNumberItemTemplate, onChange: (value: number | null) => void): void {
		const numParseFn = (dataElement.valueType === 'integer' || dataElement.valueType === 'nullable-integer')
			? parseInt : parseFloat;

		const nullNumParseFn = (dataElement.valueType === 'nullable-integer' || dataElement.valueType === 'nullable-number')
			? ((v: string) => v === '' ? null : numParseFn(v)) : numParseFn;

		template.onChange = undefined;
		template.inputBox.value = typeof dataElement.value === 'number' ?
			dataElement.value.toString() : '';
		template.inputBox.step = dataElement.valueType.includes('integer') ? '1' : 'any';
		template.inputBox.setAriaLabel(dataElement.setting.key);
		template.inputBox.setEnabled(!dataElement.hasPolicyValue);
		template.onChange = value => {
			if (!renderValidations(dataElement, template, false)) {
				onChange(nullNumParseFn(value));
			}
		};

		renderValidations(dataElement, template, true);
	}
}

class SettingBoolRenderer extends AbstractSettingRenderer implements ITreeRenderer<SettingsTreeSettingElement, never, ISettingBoolItemTemplate> {
	templateId = SETTINGS_BOOL_TEMPLATE_ID;

	renderTemplate(_container: HTMLElement): ISettingBoolItemTemplate {
		_container.classList.add('setting-item');
		_container.classList.add('setting-item-bool');

		const toDispose = new DisposableStore();

		const container = DOM.append(_container, $(AbstractSettingRenderer.CONTENTS_SELECTOR));
		container.classList.add('settings-row-inner-container');

		const titleElement = DOM.append(container, $('.setting-item-title'));
		const categoryElement = DOM.append(titleElement, $('span.setting-item-category'));
		const labelElementContainer = DOM.append(titleElement, $('span.setting-item-label'));
		const labelElement = toDispose.add(new SimpleIconLabel(labelElementContainer));
		const indicatorsLabel = toDispose.add(this._instantiationService.createInstance(SettingsTreeIndicatorsLabel, titleElement));

		const descriptionAndValueElement = DOM.append(container, $('.setting-item-value-description'));
		const controlElement = DOM.append(descriptionAndValueElement, $('.setting-item-bool-control'));
		const descriptionElement = DOM.append(descriptionAndValueElement, $('.setting-item-description'));
		const modifiedIndicatorElement = DOM.append(container, $('.setting-item-modified-indicator'));
		toDispose.add(this._hoverService.setupDelayedHover(modifiedIndicatorElement, {
			content: localize('modified', "The setting has been configured in the current scope.")
		}));

		const deprecationWarningElement = DOM.append(container, $('.setting-item-deprecation-message'));

		const checkbox = new Toggle({ icon: Codicon.check, actionClassName: 'setting-value-checkbox', isChecked: true, title: '', ...unthemedToggleStyles });
		controlElement.appendChild(checkbox.domNode);
		toDispose.add(checkbox);
		toDispose.add(checkbox.onChange(() => {
			template.onChange!(checkbox.checked);
		}));

		checkbox.domNode.classList.add(AbstractSettingRenderer.CONTROL_CLASS);
		const toolbarContainer = DOM.append(container, $('.setting-toolbar-container'));
		const toolbar = this.renderSettingToolbar(toolbarContainer);
		toDispose.add(toolbar);

		const template: ISettingBoolItemTemplate = {
			toDispose,
			elementDisposables: toDispose.add(new DisposableStore()),

			containerElement: container,
			categoryElement,
			labelElement,
			controlElement,
			checkbox,
			descriptionElement,
			deprecationWarningElement,
			indicatorsLabel,
			toolbar
		};

		this.addSettingElementFocusHandler(template);

		// Prevent clicks from being handled by list
		toDispose.add(DOM.addDisposableListener(controlElement, 'mousedown', (e: IMouseEvent) => e.stopPropagation()));
		toDispose.add(DOM.addDisposableListener(titleElement, DOM.EventType.MOUSE_ENTER, e => container.classList.add('mouseover')));
		toDispose.add(DOM.addDisposableListener(titleElement, DOM.EventType.MOUSE_LEAVE, e => container.classList.remove('mouseover')));

		return template;
	}

	renderElement(element: ITreeNode<SettingsTreeSettingElement, never>, index: number, templateData: ISettingBoolItemTemplate): void {
		super.renderSettingElement(element, index, templateData);
	}

	protected renderValue(dataElement: SettingsTreeSettingElement, template: ISettingBoolItemTemplate, onChange: (value: boolean) => void): void {
		template.onChange = undefined;
		template.checkbox.checked = dataElement.value;
		if (dataElement.hasPolicyValue) {
			template.checkbox.disable();
			template.descriptionElement.classList.add('disabled');
		} else {
			template.checkbox.enable();
			template.descriptionElement.classList.remove('disabled');

			// Need to listen for mouse clicks on description and toggle checkbox - use target ID for safety
			// Also have to ignore embedded links - too buried to stop propagation
			template.elementDisposables.add(DOM.addDisposableListener(template.descriptionElement, DOM.EventType.MOUSE_DOWN, (e) => {
				const targetElement = <HTMLElement>e.target;

				// Toggle target checkbox
				if (targetElement.tagName.toLowerCase() !== 'a') {
					template.checkbox.checked = !template.checkbox.checked;
					template.onChange!(template.checkbox.checked);
				}
				DOM.EventHelper.stop(e);
			}));
		}
		template.checkbox.setTitle(dataElement.setting.key);
		template.onChange = onChange;
	}
}

type ManageExtensionClickTelemetryClassification = {
	extensionId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The extension the user went to manage.' };
	owner: 'rzhao271';
	comment: 'Event used to gain insights into when users interact with an extension management setting';
};

class SettingsExtensionToggleRenderer extends AbstractSettingRenderer implements ITreeRenderer<SettingsTreeSettingElement, never, ISettingExtensionToggleItemTemplate> {
	templateId = SETTINGS_EXTENSION_TOGGLE_TEMPLATE_ID;

	private readonly _onDidDismissExtensionSetting = this._register(new Emitter<string>());
	readonly onDidDismissExtensionSetting = this._onDidDismissExtensionSetting.event;

	renderTemplate(_container: HTMLElement): ISettingExtensionToggleItemTemplate {
		const common = super.renderCommonTemplate(null, _container, 'extension-toggle');

		const actionButton = new Button(common.containerElement, {
			title: false,
			...defaultButtonStyles
		});
		actionButton.element.classList.add('setting-item-extension-toggle-button');
		actionButton.label = localize('showExtension', "Show Extension");

		const dismissButton = new Button(common.containerElement, {
			title: false,
			secondary: true,
			...defaultButtonStyles
		});
		dismissButton.element.classList.add('setting-item-extension-dismiss-button');
		dismissButton.label = localize('dismiss', "Dismiss");

		const template: ISettingExtensionToggleItemTemplate = {
			...common,
			actionButton,
			dismissButton
		};

		this.addSettingElementFocusHandler(template);

		return template;
	}

	renderElement(element: ITreeNode<SettingsTreeSettingElement, never>, index: number, templateData: ISettingExtensionToggleItemTemplate): void {
		super.renderSettingElement(element, index, templateData);
	}

	protected renderValue(dataElement: SettingsTreeSettingElement, template: ISettingExtensionToggleItemTemplate, onChange: (_: undefined) => void): void {
		template.elementDisposables.clear();

		const extensionId = dataElement.setting.displayExtensionId!;
		template.elementDisposables.add(template.actionButton.onDidClick(async () => {
			this._telemetryService.publicLog2<{ extensionId: String }, ManageExtensionClickTelemetryClassification>('ManageExtensionClick', { extensionId });
			this._commandService.executeCommand('extension.open', extensionId);
		}));

		template.elementDisposables.add(template.dismissButton.onDidClick(async () => {
			this._telemetryService.publicLog2<{ extensionId: String }, ManageExtensionClickTelemetryClassification>('DismissExtensionClick', { extensionId });
			this._onDidDismissExtensionSetting.fire(extensionId);
		}));
	}
}

export class SettingTreeRenderers extends Disposable {
	readonly onDidClickOverrideElement: Event<ISettingOverrideClickEvent>;

	private readonly _onDidChangeSetting = this._register(new Emitter<ISettingChangeEvent>());
	readonly onDidChangeSetting: Event<ISettingChangeEvent>;

	readonly onDidDismissExtensionSetting: Event<string>;

	readonly onDidOpenSettings: Event<string>;

	readonly onDidClickSettingLink: Event<ISettingLinkClickEvent>;

	readonly onDidFocusSetting: Event<SettingsTreeSettingElement>;

	readonly onDidChangeSettingHeight: Event<HeightChangeParams>;

	readonly onApplyFilter: Event<string>;

	readonly allRenderers: ITreeRenderer<SettingsTreeElement, never, any>[];

	private readonly settingActions: IAction[];

	constructor(
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IContextMenuService private readonly _contextMenuService: IContextMenuService,
		@IContextViewService private readonly _contextViewService: IContextViewService,
		@IUserDataSyncEnablementService private readonly _userDataSyncEnablementService: IUserDataSyncEnablementService,
	) {
		super();
		this.settingActions = [
			new Action('settings.resetSetting', localize('resetSettingLabel', "Reset Setting"), undefined, undefined, async context => {
				if (context instanceof SettingsTreeSettingElement) {
					if (!context.isUntrusted) {
						this._onDidChangeSetting.fire({
							key: context.setting.key,
							value: undefined,
							type: context.setting.type as SettingValueType,
							manualReset: true,
							scope: context.setting.scope
						});
					}
				}
			}),
			new Separator(),
			this._instantiationService.createInstance(CopySettingIdAction),
			this._instantiationService.createInstance(CopySettingAsJSONAction),
			this._instantiationService.createInstance(CopySettingAsURLAction),
		];

		const actionFactory = (setting: ISetting, settingTarget: SettingsTarget) => this.getActionsForSetting(setting, settingTarget);
		const emptyActionFactory = (_: ISetting) => [];
		const extensionRenderer = this._instantiationService.createInstance(SettingsExtensionToggleRenderer, [], emptyActionFactory);
		const settingRenderers = [
			this._instantiationService.createInstance(SettingBoolRenderer, this.settingActions, actionFactory),
			this._instantiationService.createInstance(SettingNumberRenderer, this.settingActions, actionFactory),
			this._instantiationService.createInstance(SettingArrayRenderer, this.settingActions, actionFactory),
			this._instantiationService.createInstance(SettingComplexRenderer, this.settingActions, actionFactory),
			this._instantiationService.createInstance(SettingComplexObjectRenderer, this.settingActions, actionFactory),
			this._instantiationService.createInstance(SettingTextRenderer, this.settingActions, actionFactory),
			this._instantiationService.createInstance(SettingMultilineTextRenderer, this.settingActions, actionFactory),
			this._instantiationService.createInstance(SettingExcludeRenderer, this.settingActions, actionFactory),
			this._instantiationService.createInstance(SettingIncludeRenderer, this.settingActions, actionFactory),
			this._instantiationService.createInstance(SettingEnumRenderer, this.settingActions, actionFactory),
			this._instantiationService.createInstance(SettingObjectRenderer, this.settingActions, actionFactory),
			this._instantiationService.createInstance(SettingBoolObjectRenderer, this.settingActions, actionFactory),
			extensionRenderer
		];

		this.onDidClickOverrideElement = Event.any(...settingRenderers.map(r => r.onDidClickOverrideElement));
		this.onDidChangeSetting = Event.any(
			...settingRenderers.map(r => r.onDidChangeSetting),
			this._onDidChangeSetting.event
		);
		this.onDidDismissExtensionSetting = extensionRenderer.onDidDismissExtensionSetting;
		this.onDidOpenSettings = Event.any(...settingRenderers.map(r => r.onDidOpenSettings));
		this.onDidClickSettingLink = Event.any(...settingRenderers.map(r => r.onDidClickSettingLink));
		this.onDidFocusSetting = Event.any(...settingRenderers.map(r => r.onDidFocusSetting));
		this.onDidChangeSettingHeight = Event.any(...settingRenderers.map(r => r.onDidChangeSettingHeight));
		this.onApplyFilter = Event.any(...settingRenderers.map(r => r.onApplyFilter));

		this.allRenderers = [
			...settingRenderers,
			this._instantiationService.createInstance(SettingGroupRenderer),
			this._instantiationService.createInstance(SettingNewExtensionsRenderer),
		];
	}

	private getActionsForSetting(setting: ISetting, settingTarget: SettingsTarget): IAction[] {
		const actions: IAction[] = [];
		if (!(setting.scope && APPLICATION_SCOPES.includes(setting.scope)) && settingTarget === ConfigurationTarget.USER_LOCAL) {
			actions.push(this._instantiationService.createInstance(ApplySettingToAllProfilesAction, setting));
		}
		if (this._userDataSyncEnablementService.isEnabled() && !setting.disallowSyncIgnore) {
			actions.push(this._instantiationService.createInstance(SyncSettingAction, setting));
		}
		if (actions.length) {
			actions.splice(0, 0, new Separator());
		}
		return actions;
	}

	cancelSuggesters() {
		this._contextViewService.hideContextView();
	}

	showContextMenu(element: SettingsTreeSettingElement, settingDOMElement: HTMLElement): void {
		// eslint-disable-next-line no-restricted-syntax
		const toolbarElement = settingDOMElement.querySelector('.monaco-toolbar');
		if (toolbarElement) {
			this._contextMenuService.showContextMenu({
				getActions: () => this.settingActions,
				getAnchor: () => <HTMLElement>toolbarElement,
				getActionsContext: () => element
			});
		}
	}

	getSettingDOMElementForDOMElement(domElement: HTMLElement): HTMLElement | null {
		const parent = DOM.findParentWithClass(domElement, AbstractSettingRenderer.CONTENTS_CLASS);
		if (parent) {
			return parent;
		}

		return null;
	}

	getDOMElementsForSettingKey(treeContainer: HTMLElement, key: string): NodeListOf<HTMLElement> {
		// eslint-disable-next-line no-restricted-syntax
		return treeContainer.querySelectorAll(`[${AbstractSettingRenderer.SETTING_KEY_ATTR}="${key}"]`);
	}

	getKeyForDOMElementInSetting(element: HTMLElement): string | null {
		const settingElement = this.getSettingDOMElementForDOMElement(element);
		return settingElement && settingElement.getAttribute(AbstractSettingRenderer.SETTING_KEY_ATTR);
	}

	getIdForDOMElementInSetting(element: HTMLElement): string | null {
		const settingElement = this.getSettingDOMElementForDOMElement(element);
		return settingElement && settingElement.getAttribute(AbstractSettingRenderer.SETTING_ID_ATTR);
	}

	override dispose(): void {
		super.dispose();
		this.settingActions.forEach(action => {
			if (isDisposable(action)) {
				action.dispose();
			}
		});
		this.allRenderers.forEach(renderer => {
			if (isDisposable(renderer)) {
				renderer.dispose();
			}
		});
	}
}

/**
 * Validate and render any error message. Returns true if the value is invalid.
 */
function renderValidations(dataElement: SettingsTreeSettingElement, template: ISettingTextItemTemplate, calledOnStartup: boolean): boolean {
	if (dataElement.setting.validator) {
		const errMsg = dataElement.setting.validator(template.inputBox.value);
		if (errMsg) {
			template.containerElement.classList.add('invalid-input');
			template.validationErrorMessageElement.innerText = errMsg;
			const validationError = localize('validationError', "Validation Error.");
			template.inputBox.inputElement.parentElement!.setAttribute('aria-label', [validationError, errMsg].join(' '));
			if (!calledOnStartup) { aria.status(validationError + ' ' + errMsg); }
			return true;
		} else {
			template.inputBox.inputElement.parentElement!.removeAttribute('aria-label');
		}
	}
	template.containerElement.classList.remove('invalid-input');
	return false;
}

/**
 * Validate and render any error message for arrays. Returns true if the value is invalid.
 */
function renderArrayValidations(
	dataElement: SettingsTreeSettingElement,
	template: ISettingListItemTemplate | ISettingObjectItemTemplate,
	value: string[] | Record<string, unknown> | undefined,
	calledOnStartup: boolean
): boolean {
	template.containerElement.classList.add('invalid-input');
	if (dataElement.setting.validator) {
		const errMsg = dataElement.setting.validator(value);
		if (errMsg && errMsg !== '') {
			template.containerElement.classList.add('invalid-input');
			template.validationErrorMessageElement.innerText = errMsg;
			const validationError = localize('validationError', "Validation Error.");
			template.containerElement.setAttribute('aria-label', [dataElement.setting.key, validationError, errMsg].join(' '));
			if (!calledOnStartup) { aria.status(validationError + ' ' + errMsg); }
			return true;
		} else {
			template.containerElement.setAttribute('aria-label', dataElement.setting.key);
			template.containerElement.classList.remove('invalid-input');
		}
	}
	return false;
}

function cleanRenderedMarkdown(element: Node): void {
	for (let i = 0; i < element.childNodes.length; i++) {
		const child = element.childNodes.item(i);

		const tagName = (<Element>child).tagName && (<Element>child).tagName.toLowerCase();
		if (tagName === 'img') {
			child.remove();
		} else {
			cleanRenderedMarkdown(child);
		}
	}
}

function fixSettingLinks(text: string, linkify = true): string {
	return text.replace(/`#([^#\s`]+)#`|'#([^#\s']+)#'/g, (match, backticksGroup, quotesGroup) => {
		const settingKey: string = backticksGroup ?? quotesGroup;
		const targetDisplayFormat = settingKeyToDisplayFormat(settingKey);
		const targetName = `${targetDisplayFormat.category}: ${targetDisplayFormat.label}`;
		return linkify ?
			`[${targetName}](#${settingKey} "${settingKey}")` :
			`"${targetName}"`;
	});
}

function escapeInvisibleChars(enumValue: string): string {
	return enumValue && enumValue
		.replace(/\n/g, '\\n')
		.replace(/\r/g, '\\r');
}


export class SettingsTreeFilter implements ITreeFilter<SettingsTreeElement> {
	constructor(
		private viewState: ISettingsEditorViewState,
		@IWorkbenchEnvironmentService private environmentService: IWorkbenchEnvironmentService,
	) { }

	filter(element: SettingsTreeElement, parentVisibility: TreeVisibility): TreeFilterResult<void> {
		// Filter during search
		if (this.viewState.filterToCategory && element instanceof SettingsTreeSettingElement) {
			if (!this.settingContainedInGroup(element.setting, this.viewState.filterToCategory)) {
				return false;
			}
		}

		// Non-user scope selected
		if (element instanceof SettingsTreeSettingElement && this.viewState.settingsTarget !== ConfigurationTarget.USER_LOCAL) {
			const isRemote = !!this.environmentService.remoteAuthority;
			if (!element.matchesScope(this.viewState.settingsTarget, isRemote)) {
				return false;
			}
		}

		// Group with no visible children
		if (element instanceof SettingsTreeGroupElement) {
			if (typeof element.count === 'number') {
				return element.count > 0;
			}

			return TreeVisibility.Recurse;
		}

		// Filtered "new extensions" button
		if (element instanceof SettingsTreeNewExtensionsElement) {
			if (this.viewState.tagFilters?.size || this.viewState.filterToCategory) {
				return false;
			}
		}

		return true;
	}

	private settingContainedInGroup(setting: ISetting, group: SettingsTreeGroupElement): boolean {
		return group.children.some(child => {
			if (child instanceof SettingsTreeGroupElement) {
				return this.settingContainedInGroup(setting, child);
			} else if (child instanceof SettingsTreeSettingElement) {
				return child.setting.key === setting.key;
			} else {
				return false;
			}
		});
	}
}

class SettingsTreeDelegate extends CachedListVirtualDelegate<SettingsTreeGroupChild> {

	getTemplateId(element: SettingsTreeGroupElement | SettingsTreeSettingElement | SettingsTreeNewExtensionsElement): string {
		if (element instanceof SettingsTreeGroupElement) {
			return SETTINGS_ELEMENT_TEMPLATE_ID;
		}

		if (element instanceof SettingsTreeSettingElement) {
			if (element.valueType === SettingValueType.ExtensionToggle) {
				return SETTINGS_EXTENSION_TOGGLE_TEMPLATE_ID;
			}

			const invalidTypeError = element.isConfigured && getInvalidTypeError(element.value, element.setting.type);
			if (invalidTypeError) {
				return SETTINGS_COMPLEX_TEMPLATE_ID;
			}

			if (element.valueType === SettingValueType.Boolean) {
				return SETTINGS_BOOL_TEMPLATE_ID;
			}

			if (element.valueType === SettingValueType.Integer ||
				element.valueType === SettingValueType.Number ||
				element.valueType === SettingValueType.NullableInteger ||
				element.valueType === SettingValueType.NullableNumber) {
				return SETTINGS_NUMBER_TEMPLATE_ID;
			}

			if (element.valueType === SettingValueType.MultilineString) {
				return SETTINGS_MULTILINE_TEXT_TEMPLATE_ID;
			}

			if (element.valueType === SettingValueType.String) {
				return SETTINGS_TEXT_TEMPLATE_ID;
			}

			if (element.valueType === SettingValueType.Enum) {
				return SETTINGS_ENUM_TEMPLATE_ID;
			}

			if (element.valueType === SettingValueType.Array) {
				return SETTINGS_ARRAY_TEMPLATE_ID;
			}

			if (element.valueType === SettingValueType.Exclude) {
				return SETTINGS_EXCLUDE_TEMPLATE_ID;
			}

			if (element.valueType === SettingValueType.Include) {
				return SETTINGS_INCLUDE_TEMPLATE_ID;
			}

			if (element.valueType === SettingValueType.Object) {
				return SETTINGS_OBJECT_TEMPLATE_ID;
			}

			if (element.valueType === SettingValueType.BooleanObject) {
				return SETTINGS_BOOL_OBJECT_TEMPLATE_ID;
			}

			if (element.valueType === SettingValueType.ComplexObject) {
				return SETTINGS_COMPLEX_OBJECT_TEMPLATE_ID;
			}

			if (element.valueType === SettingValueType.LanguageTag) {
				return SETTINGS_COMPLEX_TEMPLATE_ID;
			}

			return SETTINGS_COMPLEX_TEMPLATE_ID;
		}

		if (element instanceof SettingsTreeNewExtensionsElement) {
			return SETTINGS_NEW_EXTENSIONS_TEMPLATE_ID;
		}

		throw new Error('unknown element type: ' + element);
	}

	hasDynamicHeight(element: SettingsTreeGroupElement | SettingsTreeSettingElement | SettingsTreeNewExtensionsElement): boolean {
		return !(element instanceof SettingsTreeGroupElement);
	}

	protected estimateHeight(element: SettingsTreeGroupChild): number {
		if (element instanceof SettingsTreeGroupElement) {
			return 42;
		}

		return element instanceof SettingsTreeSettingElement && element.valueType === SettingValueType.Boolean ? 78 : 104;
	}
}

export class NonCollapsibleObjectTreeModel<T> extends ObjectTreeModel<T> {
	override isCollapsible(element: T): boolean {
		return false;
	}

	override setCollapsed(element: T, collapsed?: boolean, recursive?: boolean): boolean {
		return false;
	}
}

class SettingsTreeAccessibilityProvider implements IListAccessibilityProvider<SettingsTreeElement> {
	constructor(private readonly configurationService: IWorkbenchConfigurationService, private readonly languageService: ILanguageService, private readonly userDataProfilesService: IUserDataProfilesService) {
	}

	getAriaLabel(element: SettingsTreeElement) {
		if (element instanceof SettingsTreeSettingElement) {
			const ariaLabelSections: string[] = [];
			ariaLabelSections.push(`${element.displayCategory} ${element.displayLabel}.`);

			if (element.isConfigured) {
				const modifiedText = localize('settings.Modified', 'Modified.');
				ariaLabelSections.push(modifiedText);
			}

			const indicatorsLabelAriaLabel = getIndicatorsLabelAriaLabel(element, this.configurationService, this.userDataProfilesService, this.languageService);
			if (indicatorsLabelAriaLabel.length) {
				ariaLabelSections.push(`${indicatorsLabelAriaLabel}.`);
			}

			const descriptionWithoutSettingLinks = renderAsPlaintext({ value: fixSettingLinks(element.description, false) });
			if (descriptionWithoutSettingLinks.length) {
				ariaLabelSections.push(descriptionWithoutSettingLinks);
			}
			return ariaLabelSections.join(' ');
		} else if (element instanceof SettingsTreeGroupElement) {
			return element.label;
		} else {
			return element.id;
		}
	}

	getWidgetAriaLabel() {
		return localize('settings', "Settings");
	}
}

export class SettingsTree extends WorkbenchObjectTree<SettingsTreeElement> {
	constructor(
		container: HTMLElement,
		viewState: ISettingsEditorViewState,
		renderers: ITreeRenderer<any, void, any>[],
		@IContextKeyService contextKeyService: IContextKeyService,
		@IListService listService: IListService,
		@IWorkbenchConfigurationService configurationService: IWorkbenchConfigurationService,
		@IInstantiationService instantiationService: IInstantiationService,
		@ILanguageService languageService: ILanguageService,
		@IUserDataProfilesService userDataProfilesService: IUserDataProfilesService
	) {
		super('SettingsTree', container,
			new SettingsTreeDelegate(),
			renderers,
			{
				horizontalScrolling: false,
				supportDynamicHeights: true,
				scrollToActiveElement: true,
				identityProvider: {
					getId(e) {
						return e.id;
					}
				},
				accessibilityProvider: new SettingsTreeAccessibilityProvider(configurationService, languageService, userDataProfilesService),
				styleController: id => new DefaultStyleController(domStylesheetsJs.createStyleSheet(container), id),
				filter: instantiationService.createInstance(SettingsTreeFilter, viewState),
				smoothScrolling: configurationService.getValue<boolean>('workbench.list.smoothScrolling'),
				multipleSelectionSupport: false,
				findWidgetEnabled: false,
				renderIndentGuides: RenderIndentGuides.None,
				transformOptimization: false // Disable transform optimization #177470
			},
			instantiationService,
			contextKeyService,
			listService,
			configurationService,
		);

		this.getHTMLElement().classList.add('settings-editor-tree');

		this.style(getListStyles({
			listBackground: editorBackground,
			listActiveSelectionBackground: editorBackground,
			listActiveSelectionForeground: foreground,
			listFocusAndSelectionBackground: editorBackground,
			listFocusAndSelectionForeground: foreground,
			listFocusBackground: editorBackground,
			listFocusForeground: foreground,
			listHoverForeground: foreground,
			listHoverBackground: editorBackground,
			listHoverOutline: editorBackground,
			listFocusOutline: editorBackground,
			listInactiveSelectionBackground: editorBackground,
			listInactiveSelectionForeground: foreground,
			listInactiveFocusBackground: editorBackground,
			listInactiveFocusOutline: editorBackground,
			treeIndentGuidesStroke: undefined,
			treeInactiveIndentGuidesStroke: undefined,
		}));

		this.disposables.add(configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('workbench.list.smoothScrolling')) {
				this.updateOptions({
					smoothScrolling: configurationService.getValue<boolean>('workbench.list.smoothScrolling')
				});
			}
		}));
	}

	protected override createModel(user: string, options: IObjectTreeOptions<SettingsTreeElement | null, void>): ITreeModel<SettingsTreeGroupChild | null, void, SettingsTreeGroupChild | null> {
		return new NonCollapsibleObjectTreeModel<SettingsTreeGroupChild>(user, options);
	}
}

class CopySettingIdAction extends Action {
	static readonly ID = 'settings.copySettingId';
	static readonly LABEL = localize('copySettingIdLabel', "Copy Setting ID");

	constructor(
		@IClipboardService private readonly clipboardService: IClipboardService
	) {
		super(CopySettingIdAction.ID, CopySettingIdAction.LABEL);
	}

	override async run(context: SettingsTreeSettingElement): Promise<void> {
		if (context) {
			await this.clipboardService.writeText(context.setting.key);
		}

		return Promise.resolve(undefined);
	}
}

class CopySettingAsJSONAction extends Action {
	static readonly ID = 'settings.copySettingAsJSON';
	static readonly LABEL = localize('copySettingAsJSONLabel', "Copy Setting as JSON");

	constructor(
		@IClipboardService private readonly clipboardService: IClipboardService
	) {
		super(CopySettingAsJSONAction.ID, CopySettingAsJSONAction.LABEL);
	}

	override async run(context: SettingsTreeSettingElement): Promise<void> {
		if (context) {
			const jsonResult = `"${context.setting.key}": ${JSON.stringify(context.value, undefined, '  ')}`;
			await this.clipboardService.writeText(jsonResult);
		}

		return Promise.resolve(undefined);
	}
}

class CopySettingAsURLAction extends Action {
	static readonly ID = 'settings.copySettingAsURL';
	static readonly LABEL = localize('copySettingAsURLLabel', "Copy Setting as URL");

	constructor(
		@IClipboardService private readonly clipboardService: IClipboardService,
		@IProductService private readonly productService: IProductService,
	) {
		super(CopySettingAsURLAction.ID, CopySettingAsURLAction.LABEL);
	}

	override async run(context: SettingsTreeSettingElement): Promise<void> {
		if (context) {
			const settingKey = context.setting.key;
			const product = this.productService.urlProtocol;
			const uri = URI.from({ scheme: product, authority: SETTINGS_AUTHORITY, path: `/${settingKey}` }, true);
			await this.clipboardService.writeText(uri.toString());
		}

		return Promise.resolve(undefined);
	}
}

class SyncSettingAction extends Action {
	static readonly ID = 'settings.stopSyncingSetting';
	static readonly LABEL = localize('stopSyncingSetting', "Sync This Setting");

	constructor(
		private readonly setting: ISetting,
		@IConfigurationService private readonly configService: IConfigurationService,
	) {
		super(SyncSettingAction.ID, SyncSettingAction.LABEL);
		this._register(Event.filter(configService.onDidChangeConfiguration, e => e.affectsConfiguration('settingsSync.ignoredSettings'))(() => this.update()));
		this.update();
	}

	async update() {
		const ignoredSettings = getIgnoredSettings(getDefaultIgnoredSettings(), this.configService);
		this.checked = !ignoredSettings.includes(this.setting.key);
	}

	override async run(): Promise<void> {
		// first remove the current setting completely from ignored settings
		let currentValue = [...this.configService.getValue<string[]>('settingsSync.ignoredSettings')];
		currentValue = currentValue.filter(v => v !== this.setting.key && v !== `-${this.setting.key}`);

		const defaultIgnoredSettings = getDefaultIgnoredSettings();
		const isDefaultIgnored = defaultIgnoredSettings.includes(this.setting.key);
		const askedToSync = !this.checked;

		// If asked to sync, then add only if it is ignored by default
		if (askedToSync && isDefaultIgnored) {
			currentValue.push(`-${this.setting.key}`);
		}

		// If asked not to sync, then add only if it is not ignored by default
		if (!askedToSync && !isDefaultIgnored) {
			currentValue.push(this.setting.key);
		}

		this.configService.updateValue('settingsSync.ignoredSettings', currentValue.length ? currentValue : undefined, ConfigurationTarget.USER);

		return Promise.resolve(undefined);
	}

}

class ApplySettingToAllProfilesAction extends Action {
	static readonly ID = 'settings.applyToAllProfiles';
	static readonly LABEL = localize('applyToAllProfiles', "Apply Setting to all Profiles");

	constructor(
		private readonly setting: ISetting,
		@IWorkbenchConfigurationService private readonly configService: IWorkbenchConfigurationService,
	) {
		super(ApplySettingToAllProfilesAction.ID, ApplySettingToAllProfilesAction.LABEL);
		this._register(Event.filter(configService.onDidChangeConfiguration, e => e.affectsConfiguration(APPLY_ALL_PROFILES_SETTING))(() => this.update()));
		this.update();
	}

	update() {
		const allProfilesSettings = this.configService.getValue<string[]>(APPLY_ALL_PROFILES_SETTING);
		this.checked = allProfilesSettings.includes(this.setting.key);
	}

	override async run(): Promise<void> {
		// first remove the current setting completely from ignored settings
		const value = this.configService.getValue<string[]>(APPLY_ALL_PROFILES_SETTING) ?? [];

		if (this.checked) {
			value.splice(value.indexOf(this.setting.key), 1);
		} else {
			value.push(this.setting.key);
		}

		const newValue = distinct(value);
		if (this.checked) {
			await this.configService.updateValue(this.setting.key, this.configService.inspect(this.setting.key).application?.value, ConfigurationTarget.USER_LOCAL);
			await this.configService.updateValue(APPLY_ALL_PROFILES_SETTING, newValue.length ? newValue : undefined, ConfigurationTarget.USER_LOCAL);
		} else {
			await this.configService.updateValue(APPLY_ALL_PROFILES_SETTING, newValue.length ? newValue : undefined, ConfigurationTarget.USER_LOCAL);
			await this.configService.updateValue(this.setting.key, this.configService.inspect(this.setting.key).userLocal?.value, ConfigurationTarget.USER_LOCAL);
		}
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/preferences/browser/settingsTreeModels.ts]---
Location: vscode-main/src/vs/workbench/contrib/preferences/browser/settingsTreeModels.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as arrays from '../../../../base/common/arrays.js';
import { Emitter } from '../../../../base/common/event.js';
import { IJSONSchema } from '../../../../base/common/jsonSchema.js';
import { Disposable, IDisposable } from '../../../../base/common/lifecycle.js';
import { escapeRegExpCharacters, isFalsyOrWhitespace } from '../../../../base/common/strings.js';
import { isUndefinedOrNull } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { ConfigurationTarget, getLanguageTagSettingPlainKey, IConfigurationValue } from '../../../../platform/configuration/common/configuration.js';
import { ConfigurationDefaultValueSource, ConfigurationScope, EditPresentationTypes, Extensions, IConfigurationRegistry } from '../../../../platform/configuration/common/configurationRegistry.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { USER_LOCAL_AND_REMOTE_SETTINGS } from '../../../../platform/request/common/request.js';
import { APPLICATION_SCOPES, FOLDER_SCOPES, IWorkbenchConfigurationService, LOCAL_MACHINE_SCOPES, REMOTE_MACHINE_SCOPES, WORKSPACE_SCOPES } from '../../../services/configuration/common/configuration.js';
import { IWorkbenchEnvironmentService } from '../../../services/environment/common/environmentService.js';
import { IExtensionSetting, ISearchResult, ISetting, ISettingMatch, SettingMatchType, SettingValueType } from '../../../services/preferences/common/preferences.js';
import { IUserDataProfileService } from '../../../services/userDataProfile/common/userDataProfile.js';
import { ENABLE_EXTENSION_TOGGLE_SETTINGS, ENABLE_LANGUAGE_FILTER, MODIFIED_SETTING_TAG, POLICY_SETTING_TAG, REQUIRE_TRUSTED_WORKSPACE_SETTING_TAG, compareTwoNullableNumbers, wordifyKey } from '../common/preferences.js';
import { SettingsTarget } from './preferencesWidgets.js';
import { ITOCEntry, tocData } from './settingsLayout.js';

export const ONLINE_SERVICES_SETTING_TAG = 'usesOnlineServices';

export interface ISettingsEditorViewState {
	settingsTarget: SettingsTarget;
	query?: string; // used to keep track of loading from setInput vs loading from cache
	tagFilters?: Set<string>;
	extensionFilters?: Set<string>;
	featureFilters?: Set<string>;
	idFilters?: Set<string>;
	languageFilter?: string;
	filterToCategory?: SettingsTreeGroupElement;
}

export abstract class SettingsTreeElement extends Disposable {
	id: string;
	parent?: SettingsTreeGroupElement;

	private _tabbable = false;

	private readonly _onDidChangeTabbable = this._register(new Emitter<void>());
	get onDidChangeTabbable() { return this._onDidChangeTabbable.event; }

	constructor(_id: string) {
		super();
		this.id = _id;
	}

	get tabbable(): boolean {
		return this._tabbable;
	}

	set tabbable(value: boolean) {
		this._tabbable = value;
		this._onDidChangeTabbable.fire();
	}
}

export type SettingsTreeGroupChild = (SettingsTreeGroupElement | SettingsTreeSettingElement | SettingsTreeNewExtensionsElement);

export class SettingsTreeGroupElement extends SettingsTreeElement {
	count?: number;
	label: string;
	level: number;
	isFirstGroup: boolean;

	private _childSettingKeys: Set<string> = new Set();
	private _children: SettingsTreeGroupChild[] = [];

	get children(): SettingsTreeGroupChild[] {
		return this._children;
	}

	set children(newChildren: SettingsTreeGroupChild[]) {
		this._children = newChildren;

		this._childSettingKeys = new Set();
		this._children.forEach(child => {
			if (child instanceof SettingsTreeSettingElement) {
				this._childSettingKeys.add(child.setting.key);
			}
		});
	}

	constructor(_id: string, count: number | undefined, label: string, level: number, isFirstGroup: boolean) {
		super(_id);

		this.count = count;
		this.label = label;
		this.level = level;
		this.isFirstGroup = isFirstGroup;
	}

	/**
	 * Returns whether this group contains the given child key (to a depth of 1 only)
	 */
	containsSetting(key: string): boolean {
		return this._childSettingKeys.has(key);
	}
}

export class SettingsTreeNewExtensionsElement extends SettingsTreeElement {
	constructor(_id: string, public readonly extensionIds: string[]) {
		super(_id);
	}
}

export class SettingsTreeSettingElement extends SettingsTreeElement {
	private static readonly MAX_DESC_LINES = 20;

	setting: ISetting;

	private _displayCategory: string | null = null;
	private _displayLabel: string | null = null;

	/**
	 * scopeValue || defaultValue, for rendering convenience.
	 */
	value: any;

	/**
	 * The value in the current settings scope.
	 */
	scopeValue: any;

	/**
	 * The default value
	 */
	defaultValue?: any;

	/**
	 * The source of the default value to display.
	 * This value also accounts for extension-contributed language-specific default value overrides.
	 */
	defaultValueSource: ConfigurationDefaultValueSource | undefined;

	/**
	 * Whether the setting is configured in the selected scope.
	 */
	isConfigured = false;

	/**
	 * Whether the setting requires trusted target
	 */
	isUntrusted = false;

	/**
	 * Whether the setting is under a policy that blocks all changes.
	 */
	hasPolicyValue = false;

	tags?: Set<string>;
	overriddenScopeList: string[] = [];
	overriddenDefaultsLanguageList: string[] = [];

	/**
	 * For each language that contributes setting values or default overrides, we can see those values here.
	 */
	languageOverrideValues: Map<string, IConfigurationValue<unknown>> = new Map<string, IConfigurationValue<unknown>>();

	description!: string;
	valueType!: SettingValueType;

	constructor(
		setting: ISetting,
		parent: SettingsTreeGroupElement,
		readonly settingsTarget: SettingsTarget,
		private readonly isWorkspaceTrusted: boolean,
		private readonly languageFilter: string | undefined,
		private readonly languageService: ILanguageService,
		private readonly productService: IProductService,
		private readonly userDataProfileService: IUserDataProfileService,
		private readonly configurationService: IWorkbenchConfigurationService,
	) {
		super(sanitizeId(parent.id + '_' + setting.key));
		this.setting = setting;
		this.parent = parent;

		// Make sure description and valueType are initialized
		this.initSettingDescription();
		this.initSettingValueType();
	}

	get displayCategory(): string {
		if (!this._displayCategory) {
			this.initLabels();
		}

		return this._displayCategory!;
	}

	get displayLabel(): string {
		if (!this._displayLabel) {
			this.initLabels();
		}

		return this._displayLabel!;
	}

	private initLabels(): void {
		if (this.setting.title) {
			this._displayLabel = this.setting.title;
			this._displayCategory = this.setting.categoryLabel ?? null;
			return;
		}
		const displayKeyFormat = settingKeyToDisplayFormat(this.setting.key, this.parent!.id, this.setting.isLanguageTagSetting);
		this._displayLabel = displayKeyFormat.label;
		this._displayCategory = displayKeyFormat.category;
	}

	private initSettingDescription() {
		if (this.setting.description.length > SettingsTreeSettingElement.MAX_DESC_LINES) {
			const truncatedDescLines = this.setting.description.slice(0, SettingsTreeSettingElement.MAX_DESC_LINES);
			truncatedDescLines.push('[...]');
			this.description = truncatedDescLines.join('\n');
		} else {
			this.description = this.setting.description.join('\n');
		}
	}

	private initSettingValueType() {
		if (isExtensionToggleSetting(this.setting, this.productService)) {
			this.valueType = SettingValueType.ExtensionToggle;
		} else if (this.setting.enum && (!this.setting.type || settingTypeEnumRenderable(this.setting.type))) {
			this.valueType = SettingValueType.Enum;
		} else if (this.setting.type === 'string') {
			if (this.setting.editPresentation === EditPresentationTypes.Multiline) {
				this.valueType = SettingValueType.MultilineString;
			} else {
				this.valueType = SettingValueType.String;
			}
		} else if (isExcludeSetting(this.setting)) {
			this.valueType = SettingValueType.Exclude;
		} else if (isIncludeSetting(this.setting)) {
			this.valueType = SettingValueType.Include;
		} else if (this.setting.type === 'integer') {
			this.valueType = SettingValueType.Integer;
		} else if (this.setting.type === 'number') {
			this.valueType = SettingValueType.Number;
		} else if (this.setting.type === 'boolean') {
			this.valueType = SettingValueType.Boolean;
		} else if (this.setting.type === 'array' && this.setting.arrayItemType &&
			['string', 'enum', 'number', 'integer'].includes(this.setting.arrayItemType)) {
			this.valueType = SettingValueType.Array;
		} else if (Array.isArray(this.setting.type) && this.setting.type.includes(SettingValueType.Null) && this.setting.type.length === 2) {
			if (this.setting.type.includes(SettingValueType.Integer)) {
				this.valueType = SettingValueType.NullableInteger;
			} else if (this.setting.type.includes(SettingValueType.Number)) {
				this.valueType = SettingValueType.NullableNumber;
			} else {
				this.valueType = SettingValueType.Complex;
			}
		} else {
			const schemaType = getObjectSettingSchemaType(this.setting);
			if (schemaType) {
				if (this.setting.allKeysAreBoolean) {
					this.valueType = SettingValueType.BooleanObject;
				} else if (schemaType === 'simple') {
					this.valueType = SettingValueType.Object;
				} else {
					this.valueType = SettingValueType.ComplexObject;
				}
			} else if (this.setting.isLanguageTagSetting) {
				this.valueType = SettingValueType.LanguageTag;
			} else {
				this.valueType = SettingValueType.Complex;
			}
		}
	}

	inspectSelf() {
		const targetToInspect = this.getTargetToInspect(this.setting);
		const inspectResult = inspectSetting(this.setting.key, targetToInspect, this.languageFilter, this.configurationService);
		this.update(inspectResult, this.isWorkspaceTrusted);
	}

	private getTargetToInspect(setting: ISetting): SettingsTarget {
		if (!this.userDataProfileService.currentProfile.isDefault && !this.userDataProfileService.currentProfile.useDefaultFlags?.settings) {
			if (setting.scope === ConfigurationScope.APPLICATION) {
				return ConfigurationTarget.APPLICATION;
			}
			if (this.configurationService.isSettingAppliedForAllProfiles(setting.key) && this.settingsTarget === ConfigurationTarget.USER_LOCAL) {
				return ConfigurationTarget.APPLICATION;
			}
		}
		return this.settingsTarget;
	}

	private update(inspectResult: IInspectResult, isWorkspaceTrusted: boolean): void {
		let { isConfigured, inspected, targetSelector, inspectedLanguageOverrides, languageSelector } = inspectResult;

		switch (targetSelector) {
			case 'workspaceFolderValue':
			case 'workspaceValue':
				this.isUntrusted = !!this.setting.restricted && !isWorkspaceTrusted;
				break;
		}

		let displayValue = isConfigured ? inspected[targetSelector] : inspected.defaultValue;
		const overriddenScopeList: string[] = [];
		const overriddenDefaultsLanguageList: string[] = [];
		if ((languageSelector || targetSelector !== 'workspaceValue') && typeof inspected.workspaceValue !== 'undefined') {
			overriddenScopeList.push('workspace:');
		}
		if ((languageSelector || targetSelector !== 'userRemoteValue') && typeof inspected.userRemoteValue !== 'undefined') {
			overriddenScopeList.push('remote:');
		}
		if ((languageSelector || targetSelector !== 'userLocalValue') && typeof inspected.userLocalValue !== 'undefined') {
			overriddenScopeList.push('user:');
		}

		if (inspected.overrideIdentifiers) {
			for (const overrideIdentifier of inspected.overrideIdentifiers) {
				const inspectedOverride = inspectedLanguageOverrides.get(overrideIdentifier);
				if (inspectedOverride) {
					if (this.languageService.isRegisteredLanguageId(overrideIdentifier)) {
						if (languageSelector !== overrideIdentifier && typeof inspectedOverride.default?.override !== 'undefined') {
							overriddenDefaultsLanguageList.push(overrideIdentifier);
						}
						if ((languageSelector !== overrideIdentifier || targetSelector !== 'workspaceValue') && typeof inspectedOverride.workspace?.override !== 'undefined') {
							overriddenScopeList.push(`workspace:${overrideIdentifier}`);
						}
						if ((languageSelector !== overrideIdentifier || targetSelector !== 'userRemoteValue') && typeof inspectedOverride.userRemote?.override !== 'undefined') {
							overriddenScopeList.push(`remote:${overrideIdentifier}`);
						}
						if ((languageSelector !== overrideIdentifier || targetSelector !== 'userLocalValue') && typeof inspectedOverride.userLocal?.override !== 'undefined') {
							overriddenScopeList.push(`user:${overrideIdentifier}`);
						}
					}
					this.languageOverrideValues.set(overrideIdentifier, inspectedOverride);
				}
			}
		}
		this.overriddenScopeList = overriddenScopeList;
		this.overriddenDefaultsLanguageList = overriddenDefaultsLanguageList;

		// The user might have added, removed, or modified a language filter,
		// so we reset the default value source to the non-language-specific default value source for now.
		this.defaultValueSource = this.setting.nonLanguageSpecificDefaultValueSource;

		if (inspected.policyValue !== undefined) {
			this.hasPolicyValue = true;
			isConfigured = false; // The user did not manually configure the setting themselves.
			displayValue = inspected.policyValue;
			this.scopeValue = inspected.policyValue;
			this.defaultValue = inspected.defaultValue;
		} else if (languageSelector && this.languageOverrideValues.has(languageSelector)) {
			const overrideValues = this.languageOverrideValues.get(languageSelector)!;
			// In the worst case, go back to using the previous display value.
			// Also, sometimes the override is in the form of a default value override, so consider that second.
			displayValue = (isConfigured ? overrideValues[targetSelector] : overrideValues.defaultValue) ?? displayValue;
			this.scopeValue = isConfigured && overrideValues[targetSelector];
			this.defaultValue = overrideValues.defaultValue ?? inspected.defaultValue;

			const registryValues = Registry.as<IConfigurationRegistry>(Extensions.Configuration).getConfigurationDefaultsOverrides();
			const source = registryValues.get(`[${languageSelector}]`)?.source;
			const overrideValueSource = source instanceof Map ? source.get(this.setting.key) : undefined;
			if (overrideValueSource) {
				this.defaultValueSource = overrideValueSource;
			}
		} else {
			this.scopeValue = isConfigured && inspected[targetSelector];
			this.defaultValue = inspected.defaultValue;
		}

		this.value = displayValue;
		this.isConfigured = isConfigured;
		if (isConfigured || this.setting.tags || this.tags || this.setting.restricted || this.hasPolicyValue) {
			// Don't create an empty Set for all 1000 settings, only if needed
			this.tags = new Set<string>();
			if (isConfigured) {
				this.tags.add(MODIFIED_SETTING_TAG);
			}

			this.setting.tags?.forEach(tag => this.tags!.add(tag));

			if (this.setting.restricted) {
				this.tags.add(REQUIRE_TRUSTED_WORKSPACE_SETTING_TAG);
			}

			if (this.hasPolicyValue) {
				this.tags.add(POLICY_SETTING_TAG);
			}
		}
	}

	matchesAllTags(tagFilters?: Set<string>): boolean {
		if (!tagFilters?.size) {
			// This setting, which may have tags,
			// matches against a query with no tags.
			return true;
		}

		if (!this.tags) {
			// The setting must inspect itself to get tag information
			// including for the hasPolicy tag.
			this.inspectSelf();
		}

		// Handle the special 'stable' tag filter
		if (tagFilters.has('stable')) {
			// For stable filter, exclude preview and experimental settings
			if (this.tags?.has('preview') || this.tags?.has('experimental')) {
				return false;
			}
			// Check other filters (excluding 'stable' itself)
			const otherFilters = new Set(Array.from(tagFilters).filter(tag => tag !== 'stable'));
			if (otherFilters.size === 0) {
				return true;
			}
			return !!this.tags?.size &&
				Array.from(otherFilters).every(tag => this.tags!.has(tag));
		}

		// Check that the filter tags are a subset of this setting's tags
		return !!this.tags?.size &&
			Array.from(tagFilters).every(tag => this.tags!.has(tag));
	}

	matchesScope(scope: SettingsTarget, isRemote: boolean): boolean {
		const configTarget = URI.isUri(scope) ? ConfigurationTarget.WORKSPACE_FOLDER : scope;

		if (!this.setting.scope) {
			return true;
		}

		if (configTarget === ConfigurationTarget.APPLICATION) {
			return APPLICATION_SCOPES.includes(this.setting.scope);
		}

		if (configTarget === ConfigurationTarget.WORKSPACE_FOLDER) {
			return FOLDER_SCOPES.includes(this.setting.scope);
		}

		if (configTarget === ConfigurationTarget.WORKSPACE) {
			return WORKSPACE_SCOPES.includes(this.setting.scope);
		}

		if (configTarget === ConfigurationTarget.USER_REMOTE) {
			return REMOTE_MACHINE_SCOPES.includes(this.setting.scope) || USER_LOCAL_AND_REMOTE_SETTINGS.includes(this.setting.key);
		}

		if (configTarget === ConfigurationTarget.USER_LOCAL) {
			if (isRemote) {
				return LOCAL_MACHINE_SCOPES.includes(this.setting.scope) || USER_LOCAL_AND_REMOTE_SETTINGS.includes(this.setting.key);
			}
		}

		return true;
	}

	matchesAnyExtension(extensionFilters?: Set<string>): boolean {
		if (!extensionFilters || !extensionFilters.size) {
			return true;
		}

		if (!this.setting.extensionInfo) {
			return false;
		}

		return Array.from(extensionFilters).some(extensionId => extensionId.toLowerCase() === this.setting.extensionInfo!.id.toLowerCase());
	}

	matchesAnyFeature(featureFilters?: Set<string>): boolean {
		if (!featureFilters || !featureFilters.size) {
			return true;
		}

		const features = tocData.children!.find(child => child.id === 'features');

		return Array.from(featureFilters).some(filter => {
			if (features && features.children) {
				const feature = features.children.find(feature => 'features/' + filter === feature.id);
				if (feature) {
					const patterns = feature.settings?.map(setting => createSettingMatchRegExp(setting));
					return patterns && !this.setting.extensionInfo && patterns.some(pattern => pattern.test(this.setting.key.toLowerCase()));
				} else {
					return false;
				}
			} else {
				return false;
			}
		});
	}

	matchesAnyId(idFilters?: Set<string>): boolean {
		if (!idFilters || !idFilters.size) {
			return true;
		}

		// Check for exact match first
		if (idFilters.has(this.setting.key)) {
			return true;
		}

		// Check for wildcard patterns (ending with .*)
		for (const filter of idFilters) {
			if (filter.endsWith('*')) {
				const prefix = filter.slice(0, -1); // Remove '*' suffix
				if (this.setting.key.startsWith(prefix)) {
					return true;
				}
			}
		}

		return false;
	}

	matchesAllLanguages(languageFilter?: string): boolean {
		if (!languageFilter) {
			// We're not filtering by language.
			return true;
		}

		if (!this.languageService.isRegisteredLanguageId(languageFilter)) {
			// We're trying to filter by an invalid language.
			return false;
		}

		// We have a language filter in the search widget at this point.
		// We decide to show all language overridable settings to make the
		// lang filter act more like a scope filter,
		// rather than adding on an implicit @modified as well.
		if (this.setting.scope === ConfigurationScope.LANGUAGE_OVERRIDABLE) {
			return true;
		}

		return false;
	}
}


function createSettingMatchRegExp(pattern: string): RegExp {
	pattern = escapeRegExpCharacters(pattern)
		.replace(/\\\*/g, '.*');

	return new RegExp(`^${pattern}$`, 'i');
}

export class SettingsTreeModel implements IDisposable {
	protected _root!: SettingsTreeGroupElement;
	private _tocRoot!: ITOCEntry<ISetting>;
	private readonly _treeElementsBySettingName = new Map<string, SettingsTreeSettingElement[]>();

	constructor(
		protected readonly _viewState: ISettingsEditorViewState,
		private _isWorkspaceTrusted: boolean,
		@IWorkbenchConfigurationService private readonly _configurationService: IWorkbenchConfigurationService,
		@ILanguageService private readonly _languageService: ILanguageService,
		@IUserDataProfileService private readonly _userDataProfileService: IUserDataProfileService,
		@IProductService private readonly _productService: IProductService
	) {
	}

	get root(): SettingsTreeGroupElement {
		return this._root;
	}

	update(newTocRoot = this._tocRoot): void {
		this._treeElementsBySettingName.clear();

		const newRoot = this.createSettingsTreeGroupElement(newTocRoot);
		if (newRoot.children[0] instanceof SettingsTreeGroupElement) {
			(<SettingsTreeGroupElement>newRoot.children[0]).isFirstGroup = true;
		}

		if (this._root) {
			this.disposeChildren(this._root.children);
			this._root.children = newRoot.children;
			newRoot.dispose();
		} else {
			this._root = newRoot;
		}
	}

	updateWorkspaceTrust(workspaceTrusted: boolean): void {
		this._isWorkspaceTrusted = workspaceTrusted;
		this.updateRequireTrustedTargetElements();
	}

	private disposeChildren(children: SettingsTreeGroupChild[]) {
		for (const child of children) {
			this.disposeChildAndRecurse(child);
		}
	}

	private disposeChildAndRecurse(element: SettingsTreeElement) {
		if (element instanceof SettingsTreeGroupElement) {
			this.disposeChildren(element.children);
		}

		element.dispose();
	}

	getElementsByName(name: string): SettingsTreeSettingElement[] | null {
		return this._treeElementsBySettingName.get(name) ?? null;
	}

	updateElementsByName(name: string): void {
		if (!this._treeElementsBySettingName.has(name)) {
			return;
		}

		this.reinspectSettings(this._treeElementsBySettingName.get(name)!);
	}

	private updateRequireTrustedTargetElements(): void {
		this.reinspectSettings([...this._treeElementsBySettingName.values()].flat().filter(s => s.isUntrusted));
	}

	private reinspectSettings(settings: SettingsTreeSettingElement[]): void {
		for (const element of settings) {
			element.inspectSelf();
		}
	}

	private createSettingsTreeGroupElement(tocEntry: ITOCEntry<ISetting>, parent?: SettingsTreeGroupElement): SettingsTreeGroupElement {
		const depth = parent ? this.getDepth(parent) + 1 : 0;
		const element = new SettingsTreeGroupElement(tocEntry.id, undefined, tocEntry.label, depth, false);
		element.parent = parent;

		const children: SettingsTreeGroupChild[] = [];
		if (tocEntry.settings) {
			const settingChildren = tocEntry.settings.map(s => this.createSettingsTreeSettingElement(s, element));
			for (const child of settingChildren) {
				if (!child.setting.deprecationMessage) {
					children.push(child);
				} else {
					child.inspectSelf();
					if (child.isConfigured) {
						children.push(child);
					} else {
						child.dispose();
					}
				}
			}
		}

		if (tocEntry.children) {
			const groupChildren = tocEntry.children.map(child => this.createSettingsTreeGroupElement(child, element));
			children.push(...groupChildren);
		}

		element.children = children;

		return element;
	}

	private getDepth(element: SettingsTreeElement): number {
		if (element.parent) {
			return 1 + this.getDepth(element.parent);
		} else {
			return 0;
		}
	}

	private createSettingsTreeSettingElement(setting: ISetting, parent: SettingsTreeGroupElement): SettingsTreeSettingElement {
		const element = new SettingsTreeSettingElement(
			setting,
			parent,
			this._viewState.settingsTarget,
			this._isWorkspaceTrusted,
			this._viewState.languageFilter,
			this._languageService,
			this._productService,
			this._userDataProfileService,
			this._configurationService);

		const nameElements = this._treeElementsBySettingName.get(setting.key) ?? [];
		nameElements.push(element);
		this._treeElementsBySettingName.set(setting.key, nameElements);
		return element;
	}

	dispose() {
		this._treeElementsBySettingName.clear();
		this.disposeChildAndRecurse(this._root);
	}
}

interface IInspectResult {
	isConfigured: boolean;
	inspected: IConfigurationValue<unknown>;
	targetSelector: 'applicationValue' | 'userLocalValue' | 'userRemoteValue' | 'workspaceValue' | 'workspaceFolderValue';
	inspectedLanguageOverrides: Map<string, IConfigurationValue<unknown>>;
	languageSelector: string | undefined;
}

export function inspectSetting(key: string, target: SettingsTarget, languageFilter: string | undefined, configurationService: IWorkbenchConfigurationService): IInspectResult {
	const inspectOverrides = URI.isUri(target) ? { resource: target } : undefined;
	const inspected = configurationService.inspect(key, inspectOverrides);
	const targetSelector = target === ConfigurationTarget.APPLICATION ? 'applicationValue' :
		target === ConfigurationTarget.USER_LOCAL ? 'userLocalValue' :
			target === ConfigurationTarget.USER_REMOTE ? 'userRemoteValue' :
				target === ConfigurationTarget.WORKSPACE ? 'workspaceValue' :
					'workspaceFolderValue';
	const targetOverrideSelector = target === ConfigurationTarget.APPLICATION ? 'application' :
		target === ConfigurationTarget.USER_LOCAL ? 'userLocal' :
			target === ConfigurationTarget.USER_REMOTE ? 'userRemote' :
				target === ConfigurationTarget.WORKSPACE ? 'workspace' :
					'workspaceFolder';
	let isConfigured = typeof inspected[targetSelector] !== 'undefined';

	const overrideIdentifiers = inspected.overrideIdentifiers;
	const inspectedLanguageOverrides = new Map<string, IConfigurationValue<unknown>>();

	// We must reset isConfigured to be false if languageFilter is set, and manually
	// determine whether it can be set to true later.
	if (languageFilter) {
		isConfigured = false;
	}
	if (overrideIdentifiers) {
		// The setting we're looking at has language overrides.
		for (const overrideIdentifier of overrideIdentifiers) {
			inspectedLanguageOverrides.set(overrideIdentifier, configurationService.inspect(key, { overrideIdentifier }));
		}

		// For all language filters, see if there's an override for that filter.
		if (languageFilter) {
			if (inspectedLanguageOverrides.has(languageFilter)) {
				const overrideValue = inspectedLanguageOverrides.get(languageFilter)![targetOverrideSelector]?.override;
				if (typeof overrideValue !== 'undefined') {
					isConfigured = true;
				}
			}
		}
	}

	return { isConfigured, inspected, targetSelector, inspectedLanguageOverrides, languageSelector: languageFilter };
}

function sanitizeId(id: string): string {
	return id.replace(/[\.\/]/, '_');
}

export function settingKeyToDisplayFormat(key: string, groupId: string = '', isLanguageTagSetting: boolean = false): { category: string; label: string } {
	const lastDotIdx = key.lastIndexOf('.');
	let category = '';
	if (lastDotIdx >= 0) {
		category = key.substring(0, lastDotIdx);
		key = key.substring(lastDotIdx + 1);
	}

	groupId = groupId.replace(/\//g, '.');
	category = trimCategoryForGroup(category, groupId);
	category = wordifyKey(category);

	if (isLanguageTagSetting) {
		key = getLanguageTagSettingPlainKey(key);
		key = '$(bracket) ' + key;
	}

	const label = wordifyKey(key);
	return { category, label };
}

/**
 * Removes redundant sections of the category label.
 * A redundant section is a section already reflected in the groupId.
 *
 * @param category The category of the specific setting.
 * @param groupId The author + extension ID.
 * @returns The new category label to use.
 */
function trimCategoryForGroup(category: string, groupId: string): string {
	const doTrim = (forward: boolean) => {
		// Remove the Insiders portion if the category doesn't use it.
		if (!/insiders$/i.test(category)) {
			groupId = groupId.replace(/-?insiders$/i, '');
		}
		const parts = groupId.split('.')
			.map(part => {
				// Remove hyphens, but only if that results in a match with the category.
				if (part.replace(/-/g, '').toLowerCase() === category.toLowerCase()) {
					return part.replace(/-/g, '');
				} else {
					return part;
				}
			});
		while (parts.length) {
			const reg = new RegExp(`^${parts.join('\\.')}(\\.|$)`, 'i');
			if (reg.test(category)) {
				return category.replace(reg, '');
			}

			if (forward) {
				parts.pop();
			} else {
				parts.shift();
			}
		}

		return null;
	};

	let trimmed = doTrim(true);
	if (trimmed === null) {
		trimmed = doTrim(false);
	}

	if (trimmed === null) {
		trimmed = category;
	}

	return trimmed;
}

function isExtensionToggleSetting(setting: ISetting, productService: IProductService): boolean {
	return ENABLE_EXTENSION_TOGGLE_SETTINGS &&
		!!productService.extensionRecommendations &&
		!!setting.displayExtensionId;
}

function isExcludeSetting(setting: ISetting): boolean {
	return setting.key === 'files.exclude' ||
		setting.key === 'search.exclude' ||
		setting.key === 'workbench.localHistory.exclude' ||
		setting.key === 'explorer.autoRevealExclude' ||
		setting.key === 'files.readonlyExclude' ||
		setting.key === 'files.watcherExclude';
}

function isIncludeSetting(setting: ISetting): boolean {
	return setting.key === 'files.readonlyInclude';
}

// The values of the following settings when a default values has been removed
export function objectSettingSupportsRemoveDefaultValue(key: string): boolean {
	return key === 'workbench.editor.customLabels.patterns';
}

function isSimpleType(type: string | undefined): boolean {
	return type === 'string' || type === 'boolean' || type === 'integer' || type === 'number';
}

function getObjectRenderableSchemaType(schema: IJSONSchema, key: string): 'simple' | 'complex' | false {
	const { type } = schema;

	if (Array.isArray(type)) {
		if (objectSettingSupportsRemoveDefaultValue(key) && type.length === 2) {
			if (type.includes('null') && (type.includes('string') || type.includes('boolean') || type.includes('integer') || type.includes('number'))) {
				return 'simple';
			}
		}

		for (const t of type) {
			if (!isSimpleType(t)) {
				return false;
			}
		}
		return 'complex';
	}

	if (isSimpleType(type)) {
		return 'simple';
	}

	if (type === 'array') {
		if (schema.items) {
			const itemSchemas = Array.isArray(schema.items) ? schema.items : [schema.items];
			for (const { type } of itemSchemas) {
				if (Array.isArray(type)) {
					for (const t of type) {
						if (!isSimpleType(t)) {
							return false;
						}
					}
					return 'complex';
				}
				if (!isSimpleType(type)) {
					return false;
				}
				return 'complex';
			}
		}
		return false;
	}

	return false;
}

function getObjectSettingSchemaType({
	key,
	type,
	objectProperties,
	objectPatternProperties,
	objectAdditionalProperties
}: ISetting): 'simple' | 'complex' | false {
	if (type !== 'object') {
		return false;
	}

	// object can have any shape
	if (
		isUndefinedOrNull(objectProperties) &&
		isUndefinedOrNull(objectPatternProperties) &&
		isUndefinedOrNull(objectAdditionalProperties)
	) {
		return false;
	}

	// objectAdditionalProperties allow the setting to have any shape,
	// but if there's a pattern property that handles everything, then every
	// property will match that patternProperty, so we don't need to look at
	// the value of objectAdditionalProperties in that case.
	if ((objectAdditionalProperties === true || objectAdditionalProperties === undefined)
		&& !Object.keys(objectPatternProperties ?? {}).includes('.*')) {
		return false;
	}

	const schemas = [...Object.values(objectProperties ?? {}), ...Object.values(objectPatternProperties ?? {})];

	if (objectAdditionalProperties && typeof objectAdditionalProperties === 'object') {
		schemas.push(objectAdditionalProperties);
	}

	let schemaType: 'simple' | 'complex' | false = 'simple';
	for (const schema of schemas) {
		for (const subSchema of Array.isArray(schema.anyOf) ? schema.anyOf : [schema]) {
			const subSchemaType = getObjectRenderableSchemaType(subSchema, key);
			if (subSchemaType === false) {
				return false;
			}
			if (subSchemaType === 'complex') {
				schemaType = 'complex';
			}
		}
	}

	return schemaType;
}

function settingTypeEnumRenderable(_type: string | string[]) {
	const enumRenderableSettingTypes = ['string', 'boolean', 'null', 'integer', 'number'];
	const type = Array.isArray(_type) ? _type : [_type];
	return type.every(type => enumRenderableSettingTypes.includes(type));
}

export const enum SearchResultIdx {
	Local = 0,
	Remote = 1,
	NewExtensions = 2,
	Embeddings = 3,
	AiSelected = 4
}

export class SearchResultModel extends SettingsTreeModel {
	private rawSearchResults: ISearchResult[] | null = null;
	private cachedUniqueSearchResults: Map<boolean, ISearchResult | null>;
	private newExtensionSearchResults: ISearchResult | null = null;
	private searchResultCount: number | null = null;
	private settingsOrderByTocIndex: Map<string, number> | null;
	private aiFilterEnabled: boolean = false;

	readonly id = 'searchResultModel';

	constructor(
		viewState: ISettingsEditorViewState,
		settingsOrderByTocIndex: Map<string, number> | null,
		isWorkspaceTrusted: boolean,
		@IWorkbenchConfigurationService configurationService: IWorkbenchConfigurationService,
		@IWorkbenchEnvironmentService private readonly environmentService: IWorkbenchEnvironmentService,
		@ILanguageService languageService: ILanguageService,
		@IUserDataProfileService userDataProfileService: IUserDataProfileService,
		@IProductService productService: IProductService
	) {
		super(viewState, isWorkspaceTrusted, configurationService, languageService, userDataProfileService, productService);
		this.settingsOrderByTocIndex = settingsOrderByTocIndex;
		this.cachedUniqueSearchResults = new Map();
		this.update({ id: 'searchResultModel', label: '' });
	}

	set showAiResults(show: boolean) {
		this.aiFilterEnabled = show;
		this.updateChildren();
	}

	private sortResults(filterMatches: ISettingMatch[]): ISettingMatch[] {
		if (this.settingsOrderByTocIndex) {
			for (const match of filterMatches) {
				match.setting.internalOrder = this.settingsOrderByTocIndex.get(match.setting.key);
			}
		}

		// The search only has filters, so we can sort by the order in the TOC.
		if (!this._viewState.query) {
			return filterMatches.sort((a, b) => compareTwoNullableNumbers(a.setting.internalOrder, b.setting.internalOrder));
		}

		// Sort the settings according to their relevancy.
		// https://github.com/microsoft/vscode/issues/197773
		filterMatches.sort((a, b) => {
			if (a.matchType !== b.matchType) {
				// Sort by match type if the match types are not the same.
				// The priority of the match type is given by the SettingMatchType enum.
				return b.matchType - a.matchType;
			} else if ((a.matchType & SettingMatchType.NonContiguousWordsInSettingsLabel) || (a.matchType & SettingMatchType.ContiguousWordsInSettingsLabel)) {
				// The match types of a and b are the same and can be sorted by their number of matched words.
				// If those numbers are the same, sort by the order in the table of contents.
				return (b.keyMatchScore - a.keyMatchScore) || compareTwoNullableNumbers(a.setting.internalOrder, b.setting.internalOrder);
			} else if (a.matchType === SettingMatchType.RemoteMatch) {
				// The match types are the same and are RemoteMatch.
				// Sort by score.
				return b.score - a.score;
			} else {
				// The match types are the same but are not RemoteMatch.
				// Sort by their order in the table of contents.
				return compareTwoNullableNumbers(a.setting.internalOrder, b.setting.internalOrder);
			}
		});

		// Remove duplicates, which sometimes occur with settings
		// such as the experimental toggle setting.
		return arrays.distinct(filterMatches, (match) => match.setting.key);
	}

	getUniqueSearchResults(): ISearchResult | null {
		const cachedResults = this.cachedUniqueSearchResults.get(this.aiFilterEnabled);
		if (cachedResults) {
			return cachedResults;
		}

		if (!this.rawSearchResults) {
			return null;
		}

		let combinedFilterMatches: ISettingMatch[] = [];

		if (this.aiFilterEnabled) {
			const aiSelectedKeys = new Set<string>();
			const aiSelectedResult = this.rawSearchResults[SearchResultIdx.AiSelected];
			if (aiSelectedResult) {
				aiSelectedResult.filterMatches.forEach(m => aiSelectedKeys.add(m.setting.key));
				combinedFilterMatches = aiSelectedResult.filterMatches;
			}

			const embeddingsResult = this.rawSearchResults[SearchResultIdx.Embeddings];
			if (embeddingsResult) {
				embeddingsResult.filterMatches = embeddingsResult.filterMatches.filter(m => !aiSelectedKeys.has(m.setting.key));
				combinedFilterMatches = combinedFilterMatches.concat(embeddingsResult.filterMatches);
			}
			const result = {
				filterMatches: combinedFilterMatches,
				exactMatch: false
			};
			this.cachedUniqueSearchResults.set(true, result);
			return result;
		}

		const localMatchKeys = new Set<string>();
		const localResult = this.rawSearchResults[SearchResultIdx.Local];
		if (localResult) {
			localResult.filterMatches.forEach(m => localMatchKeys.add(m.setting.key));
			combinedFilterMatches = localResult.filterMatches;
		}

		const remoteResult = this.rawSearchResults[SearchResultIdx.Remote];
		if (remoteResult) {
			remoteResult.filterMatches = remoteResult.filterMatches.filter(m => !localMatchKeys.has(m.setting.key));
			combinedFilterMatches = combinedFilterMatches.concat(remoteResult.filterMatches);

			this.newExtensionSearchResults = this.rawSearchResults[SearchResultIdx.NewExtensions];
		}
		combinedFilterMatches = this.sortResults(combinedFilterMatches);
		const result = {
			filterMatches: combinedFilterMatches,
			exactMatch: localResult.exactMatch // remote results should never have an exact match
		};
		this.cachedUniqueSearchResults.set(false, result);
		return result;
	}

	getRawResults(): ISearchResult[] {
		return this.rawSearchResults ?? [];
	}

	private getUniqueSearchResultSettings(): ISetting[] {
		return this.getUniqueSearchResults()?.filterMatches.map(m => m.setting) ?? [];
	}

	updateChildren(): void {
		this.update({
			id: 'searchResultModel',
			label: 'searchResultModel',
			settings: this.getUniqueSearchResultSettings()
		});

		// Save time by filtering children in the search model instead of relying on the tree filter, which still requires heights to be calculated.
		const isRemote = !!this.environmentService.remoteAuthority;

		const newChildren = [];
		for (const child of this.root.children) {
			if (child instanceof SettingsTreeSettingElement
				&& child.matchesAllTags(this._viewState.tagFilters)
				&& child.matchesScope(this._viewState.settingsTarget, isRemote)
				&& child.matchesAnyExtension(this._viewState.extensionFilters)
				&& child.matchesAnyId(this._viewState.idFilters)
				&& child.matchesAnyFeature(this._viewState.featureFilters)
				&& child.matchesAllLanguages(this._viewState.languageFilter)) {
				newChildren.push(child);
			} else {
				child.dispose();
			}
		}
		this.root.children = newChildren;
		this.searchResultCount = this.root.children.length;

		if (this.newExtensionSearchResults?.filterMatches.length) {
			let resultExtensionIds = this.newExtensionSearchResults.filterMatches
				.map(result => (<IExtensionSetting>result.setting))
				.filter(setting => setting.extensionName && setting.extensionPublisher)
				.map(setting => `${setting.extensionPublisher}.${setting.extensionName}`);
			resultExtensionIds = arrays.distinct(resultExtensionIds);

			if (resultExtensionIds.length) {
				const newExtElement = new SettingsTreeNewExtensionsElement('newExtensions', resultExtensionIds);
				newExtElement.parent = this._root;
				this._root.children.push(newExtElement);
			}
		}
	}

	setResult(order: SearchResultIdx, result: ISearchResult | null): void {
		this.cachedUniqueSearchResults.clear();
		this.newExtensionSearchResults = null;

		if (this.rawSearchResults && order === SearchResultIdx.Local) {
			// To prevent the Settings editor from showing
			// stale remote results mid-search.
			delete this.rawSearchResults[SearchResultIdx.Remote];
		}

		this.rawSearchResults ??= [];
		if (!result) {
			delete this.rawSearchResults[order];
			return;
		}

		this.rawSearchResults[order] = result;
		this.updateChildren();
	}

	getUniqueResultsCount(): number {
		return this.searchResultCount ?? 0;
	}
}

export interface IParsedQuery {
	tags: string[];
	query: string;
	extensionFilters: string[];
	idFilters: string[];
	featureFilters: string[];
	languageFilter: string | undefined;
}

const tagRegex = /(^|\s)@tag:("([^"]*)"|[^"]\S*)/g;
const extensionRegex = /(^|\s)@ext:("([^"]*)"|[^"]\S*)?/g;
const featureRegex = /(^|\s)@feature:("([^"]*)"|[^"]\S*)?/g;
const idRegex = /(^|\s)@id:("([^"]*)"|[^"]\S*)?/g;
const languageRegex = /(^|\s)@lang:("([^"]*)"|[^"]\S*)?/g;

export function parseQuery(query: string): IParsedQuery {
	/**
	 * A helper function to parse the query on one type of regex.
	 *
	 * @param query The search query
	 * @param filterRegex The regex to use on the query
	 * @param parsedParts The parts that the regex parses out will be appended to the array passed in here.
	 * @returns The query with the parsed parts removed
	 */
	function getTagsForType(query: string, filterRegex: RegExp, parsedParts: string[]): string {
		return query.replace(filterRegex, (_, __, quotedParsedElement, unquotedParsedElement) => {
			const parsedElement: string = unquotedParsedElement || quotedParsedElement;
			if (parsedElement) {
				parsedParts.push(...parsedElement.split(',').map(s => s.trim()).filter(s => !isFalsyOrWhitespace(s)));
			}
			return '';
		});
	}

	const tags: string[] = [];
	query = query.replace(tagRegex, (_, __, quotedTag, tag) => {
		tags.push(tag || quotedTag);
		return '';
	});

	query = query.replace(`@${MODIFIED_SETTING_TAG}`, () => {
		tags.push(MODIFIED_SETTING_TAG);
		return '';
	});

	query = query.replace(`@${POLICY_SETTING_TAG}`, () => {
		tags.push(POLICY_SETTING_TAG);
		return '';
	});

	// Handle @stable by excluding preview and experimental tags
	query = query.replace(/@stable/g, () => {
		tags.push('stable');
		return '';
	});

	const extensions: string[] = [];
	const features: string[] = [];
	const ids: string[] = [];
	const langs: string[] = [];
	query = getTagsForType(query, extensionRegex, extensions);
	query = getTagsForType(query, featureRegex, features);
	query = getTagsForType(query, idRegex, ids);

	if (ENABLE_LANGUAGE_FILTER) {
		query = getTagsForType(query, languageRegex, langs);
	}

	query = query.trim();

	// For now, only return the first found language filter
	return {
		tags,
		extensionFilters: extensions,
		featureFilters: features,
		idFilters: ids,
		languageFilter: langs.length ? langs[0] : undefined,
		query,
	};
}
```

--------------------------------------------------------------------------------

````
