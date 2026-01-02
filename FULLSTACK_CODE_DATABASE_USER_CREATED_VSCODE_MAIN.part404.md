---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 404
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 404 of 552)

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

---[FILE: src/vs/workbench/contrib/markdown/browser/markdownSettingRenderer.ts]---
Location: vscode-main/src/vs/workbench/contrib/markdown/browser/markdownSettingRenderer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ActionViewItem } from '../../../../base/browser/ui/actionbar/actionViewItems.js';
import { IAction } from '../../../../base/common/actions.js';
import type { Tokens } from '../../../../base/common/marked/marked.js';
import { Schemas } from '../../../../base/common/network.js';
import { URI } from '../../../../base/common/uri.js';
import * as nls from '../../../../nls.js';
import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';
import { ConfigurationTarget, IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IPreferencesService, ISetting } from '../../../services/preferences/common/preferences.js';
import { settingKeyToDisplayFormat } from '../../preferences/browser/settingsTreeModels.js';

export class SimpleSettingRenderer {
	private readonly codeSettingAnchorRegex: RegExp;
	private readonly codeSettingSimpleRegex: RegExp;

	private _updatedSettings = new Map<string, unknown>(); // setting ID to user's original setting value
	private _encounteredSettings = new Map<string, ISetting>(); // setting ID to setting
	private _featuredSettings = new Map<string, unknown>(); // setting ID to feature value

	constructor(
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IContextMenuService private readonly _contextMenuService: IContextMenuService,
		@IPreferencesService private readonly _preferencesService: IPreferencesService,
		@ITelemetryService private readonly _telemetryService: ITelemetryService,
		@IClipboardService private readonly _clipboardService: IClipboardService,
	) {
		this.codeSettingAnchorRegex = new RegExp(`^<a (href)=".*code.*://settings/([^\\s"]+)"(?:\\s*codesetting="([^"]+)")?>`);
		this.codeSettingSimpleRegex = new RegExp(`^setting\\(([^\\s:)]+)(?::([^)]+))?\\)$`);
	}

	get featuredSettingStates(): Map<string, boolean> {
		const result = new Map<string, boolean>();
		for (const [settingId, value] of this._featuredSettings) {
			result.set(settingId, this._configurationService.getValue(settingId) === value);
		}
		return result;
	}

	private replaceAnchor(raw: string): string | undefined {
		const match = this.codeSettingAnchorRegex.exec(raw);
		if (match && match.length === 4) {
			const settingId = match[2];
			const rendered = this.render(settingId, match[3]);
			if (rendered) {
				return raw.replace(this.codeSettingAnchorRegex, rendered);
			}
		}
		return undefined;
	}

	private replaceSimple(raw: string): string | undefined {
		const match = this.codeSettingSimpleRegex.exec(raw);
		if (match && match.length === 3) {
			const settingId = match[1];
			const rendered = this.render(settingId, match[2]);
			if (rendered) {
				return raw.replace(this.codeSettingSimpleRegex, rendered);
			}
		}
		return undefined;
	}

	getHtmlRenderer(): (token: Tokens.HTML | Tokens.Tag) => string {
		return ({ raw }: Tokens.HTML | Tokens.Tag): string => {
			const replacedAnchor = this.replaceAnchor(raw);
			if (replacedAnchor) {
				raw = replacedAnchor;
			}
			return raw;
		};
	}

	getCodeSpanRenderer(): (token: Tokens.Codespan) => string {
		return ({ text }: Tokens.Codespan): string => {
			const replacedSimple = this.replaceSimple(text);
			if (replacedSimple) {
				return replacedSimple;
			}
			return `<code>${text}</code>`;
		};
	}

	settingToUriString(settingId: string, value?: unknown): string {
		return `${Schemas.codeSetting}://${settingId}${value ? `/${value}` : ''}`;
	}

	private getSetting(settingId: string): ISetting | undefined {
		if (this._encounteredSettings.has(settingId)) {
			return this._encounteredSettings.get(settingId);
		}
		return this._preferencesService.getSetting(settingId);
	}

	parseValue(settingId: string, value: string) {
		if (value === 'undefined' || value === '') {
			return undefined;
		}
		const setting = this.getSetting(settingId);
		if (!setting) {
			return value;
		}

		switch (setting.type) {
			case 'boolean':
				return value === 'true';
			case 'number':
				return parseInt(value, 10);
			case 'string':
			default:
				return value;
		}
	}

	private render(settingId: string, newValue: string): string | undefined {
		const setting = this.getSetting(settingId);
		if (!setting) {
			return `<code>${settingId}</code>`;
		}

		return this.renderSetting(setting, newValue);
	}

	private viewInSettingsMessage(settingId: string, alreadyDisplayed: boolean) {
		if (alreadyDisplayed) {
			return nls.localize('viewInSettings', "View in Settings");
		} else {
			const displayName = settingKeyToDisplayFormat(settingId);
			return nls.localize('viewInSettingsDetailed', "View \"{0}: {1}\" in Settings", displayName.category, displayName.label);
		}
	}

	private restorePreviousSettingMessage(settingId: string): string {
		const displayName = settingKeyToDisplayFormat(settingId);
		return nls.localize('restorePreviousValue', "Restore value of \"{0}: {1}\"", displayName.category, displayName.label);
	}

	private isAlreadySet(setting: ISetting, value: string | number | boolean): boolean {
		const currentValue = this._configurationService.getValue<boolean>(setting.key);
		return (currentValue === value || (currentValue === undefined && setting.value === value));
	}

	private booleanSettingMessage(setting: ISetting, booleanValue: boolean): string | undefined {
		const displayName = settingKeyToDisplayFormat(setting.key);
		if (this.isAlreadySet(setting, booleanValue)) {
			if (booleanValue) {
				return nls.localize('alreadysetBoolTrue', "\"{0}: {1}\" is already enabled", displayName.category, displayName.label);
			} else {
				return nls.localize('alreadysetBoolFalse', "\"{0}: {1}\" is already disabled", displayName.category, displayName.label);
			}
		}

		if (booleanValue) {
			return nls.localize('trueMessage', "Enable \"{0}: {1}\"", displayName.category, displayName.label);
		} else {
			return nls.localize('falseMessage', "Disable \"{0}: {1}\"", displayName.category, displayName.label);
		}
	}

	private stringSettingMessage(setting: ISetting, stringValue: string): string | undefined {
		const displayName = settingKeyToDisplayFormat(setting.key);
		if (this.isAlreadySet(setting, stringValue)) {
			return nls.localize('alreadysetString', "\"{0}: {1}\" is already set to \"{2}\"", displayName.category, displayName.label, stringValue);
		}

		return nls.localize('stringValue', "Set \"{0}: {1}\" to \"{2}\"", displayName.category, displayName.label, stringValue);
	}

	private numberSettingMessage(setting: ISetting, numberValue: number): string | undefined {
		const displayName = settingKeyToDisplayFormat(setting.key);
		if (this.isAlreadySet(setting, numberValue)) {
			return nls.localize('alreadysetNum', "\"{0}: {1}\" is already set to {2}", displayName.category, displayName.label, numberValue);
		}

		return nls.localize('numberValue', "Set \"{0}: {1}\" to {2}", displayName.category, displayName.label, numberValue);

	}

	private renderSetting(setting: ISetting, newValue: string | undefined): string | undefined {
		const href = this.settingToUriString(setting.key, newValue);
		const title = nls.localize('changeSettingTitle', "View or change setting");
		return `<code tabindex="0"><a href="${href}" class="codesetting" title="${title}" aria-role="button"><svg width="14" height="14" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M9.1 4.4L8.6 2H7.4l-.5 2.4-.7.3-2-1.3-.9.8 1.3 2-.2.7-2.4.5v1.2l2.4.5.3.8-1.3 2 .8.8 2-1.3.8.3.4 2.3h1.2l.5-2.4.8-.3 2 1.3.8-.8-1.3-2 .3-.8 2.3-.4V7.4l-2.4-.5-.3-.8 1.3-2-.8-.8-2 1.3-.7-.2zM9.4 1l.5 2.4L12 2.1l2 2-1.4 2.1 2.4.4v2.8l-2.4.5L14 12l-2 2-2.1-1.4-.5 2.4H6.6l-.5-2.4L4 13.9l-2-2 1.4-2.1L1 9.4V6.6l2.4-.5L2.1 4l2-2 2.1 1.4.4-2.4h2.8zm.6 7c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zM8 9c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1z"/></svg>
			<span class="separator"></span>
			<span class="setting-name">${setting.key}</span>
		</a></code>`;
	}

	private getSettingMessage(setting: ISetting, newValue: boolean | string | number): string | undefined {
		if (setting.type === 'boolean') {
			return this.booleanSettingMessage(setting, newValue as boolean);
		} else if (setting.type === 'string') {
			return this.stringSettingMessage(setting, newValue as string);
		} else if (setting.type === 'number') {
			return this.numberSettingMessage(setting, newValue as number);
		}
		return undefined;
	}

	async restoreSetting(settingId: string): Promise<void> {
		const userOriginalSettingValue = this._updatedSettings.get(settingId);
		this._updatedSettings.delete(settingId);
		return this._configurationService.updateValue(settingId, userOriginalSettingValue, ConfigurationTarget.USER);
	}

	async setSetting(settingId: string, currentSettingValue: unknown, newSettingValue: unknown): Promise<void> {
		this._updatedSettings.set(settingId, currentSettingValue);
		return this._configurationService.updateValue(settingId, newSettingValue, ConfigurationTarget.USER);
	}

	getActions(uri: URI) {
		if (uri.scheme !== Schemas.codeSetting) {
			return;
		}

		const actions: IAction[] = [];

		const settingId = uri.authority;
		const newSettingValue = this.parseValue(uri.authority, uri.path.substring(1));
		const currentSettingValue = this._configurationService.inspect(settingId).userValue;

		if ((newSettingValue !== undefined) && newSettingValue === currentSettingValue && this._updatedSettings.has(settingId)) {
			const restoreMessage = this.restorePreviousSettingMessage(settingId);
			actions.push({
				class: undefined,
				id: 'restoreSetting',
				enabled: true,
				tooltip: restoreMessage,
				label: restoreMessage,
				run: () => {
					return this.restoreSetting(settingId);
				}
			});
		} else if (newSettingValue !== undefined) {
			const setting = this.getSetting(settingId);
			const trySettingMessage = setting ? this.getSettingMessage(setting, newSettingValue) : undefined;

			if (setting && trySettingMessage) {
				actions.push({
					class: undefined,
					id: 'trySetting',
					enabled: !this.isAlreadySet(setting, newSettingValue),
					tooltip: trySettingMessage,
					label: trySettingMessage,
					run: () => {
						this.setSetting(settingId, currentSettingValue, newSettingValue);
					}
				});
			}
		}

		const viewInSettingsMessage = this.viewInSettingsMessage(settingId, actions.length > 0);
		actions.push({
			class: undefined,
			enabled: true,
			id: 'viewInSettings',
			tooltip: viewInSettingsMessage,
			label: viewInSettingsMessage,
			run: () => {
				return this._preferencesService.openApplicationSettings({ query: `@id:${settingId}` });
			}
		});

		actions.push({
			class: undefined,
			enabled: true,
			id: 'copySettingId',
			tooltip: nls.localize('copySettingId', "Copy Setting ID"),
			label: nls.localize('copySettingId', "Copy Setting ID"),
			run: () => {
				this._clipboardService.writeText(settingId);
			}
		});

		return actions;
	}

	private showContextMenu(uri: URI, x: number, y: number) {
		const actions = this.getActions(uri);
		if (!actions) {
			return;
		}

		this._contextMenuService.showContextMenu({
			getAnchor: () => ({ x, y }),
			getActions: () => actions,
			getActionViewItem: (action) => {
				return new ActionViewItem(action, action, { label: true });
			},
		});
	}

	async updateSetting(uri: URI, x: number, y: number) {
		if (uri.scheme === Schemas.codeSetting) {
			type ReleaseNotesSettingUsedClassification = {
				owner: 'alexr00';
				comment: 'Used to understand if the action to update settings from the release notes is used.';
				settingId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The id of the setting that was clicked on in the release notes' };
			};
			type ReleaseNotesSettingUsed = {
				settingId: string;
			};
			this._telemetryService.publicLog2<ReleaseNotesSettingUsed, ReleaseNotesSettingUsedClassification>('releaseNotesSettingAction', {
				settingId: uri.authority
			});
			return this.showContextMenu(uri, x, y);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/markdown/browser/markedGfmHeadingIdPlugin.ts]---
Location: vscode-main/src/vs/workbench/contrib/markdown/browser/markedGfmHeadingIdPlugin.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as marked from '../../../../base/common/marked/marked.js';

// Copied from https://github.com/Flet/github-slugger since we can't use esm yet.
// eslint-disable-next-line no-misleading-character-class
const githubSlugReplaceRegex = /[\0-\x1F!-,\.\/:-@\[-\^`\{-\xA9\xAB-\xB4\xB6-\xB9\xBB-\xBF\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0378\u0379\u037E\u0380-\u0385\u0387\u038B\u038D\u03A2\u03F6\u0482\u0530\u0557\u0558\u055A-\u055F\u0589-\u0590\u05BE\u05C0\u05C3\u05C6\u05C8-\u05CF\u05EB-\u05EE\u05F3-\u060F\u061B-\u061F\u066A-\u066D\u06D4\u06DD\u06DE\u06E9\u06FD\u06FE\u0700-\u070F\u074B\u074C\u07B2-\u07BF\u07F6-\u07F9\u07FB\u07FC\u07FE\u07FF\u082E-\u083F\u085C-\u085F\u086B-\u089F\u08B5\u08C8-\u08D2\u08E2\u0964\u0965\u0970\u0984\u098D\u098E\u0991\u0992\u09A9\u09B1\u09B3-\u09B5\u09BA\u09BB\u09C5\u09C6\u09C9\u09CA\u09CF-\u09D6\u09D8-\u09DB\u09DE\u09E4\u09E5\u09F2-\u09FB\u09FD\u09FF\u0A00\u0A04\u0A0B-\u0A0E\u0A11\u0A12\u0A29\u0A31\u0A34\u0A37\u0A3A\u0A3B\u0A3D\u0A43-\u0A46\u0A49\u0A4A\u0A4E-\u0A50\u0A52-\u0A58\u0A5D\u0A5F-\u0A65\u0A76-\u0A80\u0A84\u0A8E\u0A92\u0AA9\u0AB1\u0AB4\u0ABA\u0ABB\u0AC6\u0ACA\u0ACE\u0ACF\u0AD1-\u0ADF\u0AE4\u0AE5\u0AF0-\u0AF8\u0B00\u0B04\u0B0D\u0B0E\u0B11\u0B12\u0B29\u0B31\u0B34\u0B3A\u0B3B\u0B45\u0B46\u0B49\u0B4A\u0B4E-\u0B54\u0B58-\u0B5B\u0B5E\u0B64\u0B65\u0B70\u0B72-\u0B81\u0B84\u0B8B-\u0B8D\u0B91\u0B96-\u0B98\u0B9B\u0B9D\u0BA0-\u0BA2\u0BA5-\u0BA7\u0BAB-\u0BAD\u0BBA-\u0BBD\u0BC3-\u0BC5\u0BC9\u0BCE\u0BCF\u0BD1-\u0BD6\u0BD8-\u0BE5\u0BF0-\u0BFF\u0C0D\u0C11\u0C29\u0C3A-\u0C3C\u0C45\u0C49\u0C4E-\u0C54\u0C57\u0C5B-\u0C5F\u0C64\u0C65\u0C70-\u0C7F\u0C84\u0C8D\u0C91\u0CA9\u0CB4\u0CBA\u0CBB\u0CC5\u0CC9\u0CCE-\u0CD4\u0CD7-\u0CDD\u0CDF\u0CE4\u0CE5\u0CF0\u0CF3-\u0CFF\u0D0D\u0D11\u0D45\u0D49\u0D4F-\u0D53\u0D58-\u0D5E\u0D64\u0D65\u0D70-\u0D79\u0D80\u0D84\u0D97-\u0D99\u0DB2\u0DBC\u0DBE\u0DBF\u0DC7-\u0DC9\u0DCB-\u0DCE\u0DD5\u0DD7\u0DE0-\u0DE5\u0DF0\u0DF1\u0DF4-\u0E00\u0E3B-\u0E3F\u0E4F\u0E5A-\u0E80\u0E83\u0E85\u0E8B\u0EA4\u0EA6\u0EBE\u0EBF\u0EC5\u0EC7\u0ECE\u0ECF\u0EDA\u0EDB\u0EE0-\u0EFF\u0F01-\u0F17\u0F1A-\u0F1F\u0F2A-\u0F34\u0F36\u0F38\u0F3A-\u0F3D\u0F48\u0F6D-\u0F70\u0F85\u0F98\u0FBD-\u0FC5\u0FC7-\u0FFF\u104A-\u104F\u109E\u109F\u10C6\u10C8-\u10CC\u10CE\u10CF\u10FB\u1249\u124E\u124F\u1257\u1259\u125E\u125F\u1289\u128E\u128F\u12B1\u12B6\u12B7\u12BF\u12C1\u12C6\u12C7\u12D7\u1311\u1316\u1317\u135B\u135C\u1360-\u137F\u1390-\u139F\u13F6\u13F7\u13FE-\u1400\u166D\u166E\u1680\u169B-\u169F\u16EB-\u16ED\u16F9-\u16FF\u170D\u1715-\u171F\u1735-\u173F\u1754-\u175F\u176D\u1771\u1774-\u177F\u17D4-\u17D6\u17D8-\u17DB\u17DE\u17DF\u17EA-\u180A\u180E\u180F\u181A-\u181F\u1879-\u187F\u18AB-\u18AF\u18F6-\u18FF\u191F\u192C-\u192F\u193C-\u1945\u196E\u196F\u1975-\u197F\u19AC-\u19AF\u19CA-\u19CF\u19DA-\u19FF\u1A1C-\u1A1F\u1A5F\u1A7D\u1A7E\u1A8A-\u1A8F\u1A9A-\u1AA6\u1AA8-\u1AAF\u1AC1-\u1AFF\u1B4C-\u1B4F\u1B5A-\u1B6A\u1B74-\u1B7F\u1BF4-\u1BFF\u1C38-\u1C3F\u1C4A-\u1C4C\u1C7E\u1C7F\u1C89-\u1C8F\u1CBB\u1CBC\u1CC0-\u1CCF\u1CD3\u1CFB-\u1CFF\u1DFA\u1F16\u1F17\u1F1E\u1F1F\u1F46\u1F47\u1F4E\u1F4F\u1F58\u1F5A\u1F5C\u1F5E\u1F7E\u1F7F\u1FB5\u1FBD\u1FBF-\u1FC1\u1FC5\u1FCD-\u1FCF\u1FD4\u1FD5\u1FDC-\u1FDF\u1FED-\u1FF1\u1FF5\u1FFD-\u203E\u2041-\u2053\u2055-\u2070\u2072-\u207E\u2080-\u208F\u209D-\u20CF\u20F1-\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F-\u215F\u2189-\u24B5\u24EA-\u2BFF\u2C2F\u2C5F\u2CE5-\u2CEA\u2CF4-\u2CFF\u2D26\u2D28-\u2D2C\u2D2E\u2D2F\u2D68-\u2D6E\u2D70-\u2D7E\u2D97-\u2D9F\u2DA7\u2DAF\u2DB7\u2DBF\u2DC7\u2DCF\u2DD7\u2DDF\u2E00-\u2E2E\u2E30-\u3004\u3008-\u3020\u3030\u3036\u3037\u303D-\u3040\u3097\u3098\u309B\u309C\u30A0\u30FB\u3100-\u3104\u3130\u318F-\u319F\u31C0-\u31EF\u3200-\u33FF\u4DC0-\u4DFF\u9FFD-\u9FFF\uA48D-\uA4CF\uA4FE\uA4FF\uA60D-\uA60F\uA62C-\uA63F\uA673\uA67E\uA6F2-\uA716\uA720\uA721\uA789\uA78A\uA7C0\uA7C1\uA7CB-\uA7F4\uA828-\uA82B\uA82D-\uA83F\uA874-\uA87F\uA8C6-\uA8CF\uA8DA-\uA8DF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA954-\uA95F\uA97D-\uA97F\uA9C1-\uA9CE\uA9DA-\uA9DF\uA9FF\uAA37-\uAA3F\uAA4E\uAA4F\uAA5A-\uAA5F\uAA77-\uAA79\uAAC3-\uAADA\uAADE\uAADF\uAAF0\uAAF1\uAAF7-\uAB00\uAB07\uAB08\uAB0F\uAB10\uAB17-\uAB1F\uAB27\uAB2F\uAB5B\uAB6A-\uAB6F\uABEB\uABEE\uABEF\uABFA-\uABFF\uD7A4-\uD7AF\uD7C7-\uD7CA\uD7FC-\uD7FF\uE000-\uF8FF\uFA6E\uFA6F\uFADA-\uFAFF\uFB07-\uFB12\uFB18-\uFB1C\uFB29\uFB37\uFB3D\uFB3F\uFB42\uFB45\uFBB2-\uFBD2\uFD3E-\uFD4F\uFD90\uFD91\uFDC8-\uFDEF\uFDFC-\uFDFF\uFE10-\uFE1F\uFE30-\uFE32\uFE35-\uFE4C\uFE50-\uFE6F\uFE75\uFEFD-\uFF0F\uFF1A-\uFF20\uFF3B-\uFF3E\uFF40\uFF5B-\uFF65\uFFBF-\uFFC1\uFFC8\uFFC9\uFFD0\uFFD1\uFFD8\uFFD9\uFFDD-\uFFFF]|\uD800[\uDC0C\uDC27\uDC3B\uDC3E\uDC4E\uDC4F\uDC5E-\uDC7F\uDCFB-\uDD3F\uDD75-\uDDFC\uDDFE-\uDE7F\uDE9D-\uDE9F\uDED1-\uDEDF\uDEE1-\uDEFF\uDF20-\uDF2C\uDF4B-\uDF4F\uDF7B-\uDF7F\uDF9E\uDF9F\uDFC4-\uDFC7\uDFD0\uDFD6-\uDFFF]|\uD801[\uDC9E\uDC9F\uDCAA-\uDCAF\uDCD4-\uDCD7\uDCFC-\uDCFF\uDD28-\uDD2F\uDD64-\uDDFF\uDF37-\uDF3F\uDF56-\uDF5F\uDF68-\uDFFF]|\uD802[\uDC06\uDC07\uDC09\uDC36\uDC39-\uDC3B\uDC3D\uDC3E\uDC56-\uDC5F\uDC77-\uDC7F\uDC9F-\uDCDF\uDCF3\uDCF6-\uDCFF\uDD16-\uDD1F\uDD3A-\uDD7F\uDDB8-\uDDBD\uDDC0-\uDDFF\uDE04\uDE07-\uDE0B\uDE14\uDE18\uDE36\uDE37\uDE3B-\uDE3E\uDE40-\uDE5F\uDE7D-\uDE7F\uDE9D-\uDEBF\uDEC8\uDEE7-\uDEFF\uDF36-\uDF3F\uDF56-\uDF5F\uDF73-\uDF7F\uDF92-\uDFFF]|\uD803[\uDC49-\uDC7F\uDCB3-\uDCBF\uDCF3-\uDCFF\uDD28-\uDD2F\uDD3A-\uDE7F\uDEAA\uDEAD-\uDEAF\uDEB2-\uDEFF\uDF1D-\uDF26\uDF28-\uDF2F\uDF51-\uDFAF\uDFC5-\uDFDF\uDFF7-\uDFFF]|\uD804[\uDC47-\uDC65\uDC70-\uDC7E\uDCBB-\uDCCF\uDCE9-\uDCEF\uDCFA-\uDCFF\uDD35\uDD40-\uDD43\uDD48-\uDD4F\uDD74\uDD75\uDD77-\uDD7F\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDFF\uDE12\uDE38-\uDE3D\uDE3F-\uDE7F\uDE87\uDE89\uDE8E\uDE9E\uDEA9-\uDEAF\uDEEB-\uDEEF\uDEFA-\uDEFF\uDF04\uDF0D\uDF0E\uDF11\uDF12\uDF29\uDF31\uDF34\uDF3A\uDF45\uDF46\uDF49\uDF4A\uDF4E\uDF4F\uDF51-\uDF56\uDF58-\uDF5C\uDF64\uDF65\uDF6D-\uDF6F\uDF75-\uDFFF]|\uD805[\uDC4B-\uDC4F\uDC5A-\uDC5D\uDC62-\uDC7F\uDCC6\uDCC8-\uDCCF\uDCDA-\uDD7F\uDDB6\uDDB7\uDDC1-\uDDD7\uDDDE-\uDDFF\uDE41-\uDE43\uDE45-\uDE4F\uDE5A-\uDE7F\uDEB9-\uDEBF\uDECA-\uDEFF\uDF1B\uDF1C\uDF2C-\uDF2F\uDF3A-\uDFFF]|\uD806[\uDC3B-\uDC9F\uDCEA-\uDCFE\uDD07\uDD08\uDD0A\uDD0B\uDD14\uDD17\uDD36\uDD39\uDD3A\uDD44-\uDD4F\uDD5A-\uDD9F\uDDA8\uDDA9\uDDD8\uDDD9\uDDE2\uDDE5-\uDDFF\uDE3F-\uDE46\uDE48-\uDE4F\uDE9A-\uDE9C\uDE9E-\uDEBF\uDEF9-\uDFFF]|\uD807[\uDC09\uDC37\uDC41-\uDC4F\uDC5A-\uDC71\uDC90\uDC91\uDCA8\uDCB7-\uDCFF\uDD07\uDD0A\uDD37-\uDD39\uDD3B\uDD3E\uDD48-\uDD4F\uDD5A-\uDD5F\uDD66\uDD69\uDD8F\uDD92\uDD99-\uDD9F\uDDAA-\uDEDF\uDEF7-\uDFAF\uDFB1-\uDFFF]|\uD808[\uDF9A-\uDFFF]|\uD809[\uDC6F-\uDC7F\uDD44-\uDFFF]|[\uD80A\uD80B\uD80E-\uD810\uD812-\uD819\uD824-\uD82B\uD82D\uD82E\uD830-\uD833\uD837\uD839\uD83D\uD83F\uD87B-\uD87D\uD87F\uD885-\uDB3F\uDB41-\uDBFF][\uDC00-\uDFFF]|\uD80D[\uDC2F-\uDFFF]|\uD811[\uDE47-\uDFFF]|\uD81A[\uDE39-\uDE3F\uDE5F\uDE6A-\uDECF\uDEEE\uDEEF\uDEF5-\uDEFF\uDF37-\uDF3F\uDF44-\uDF4F\uDF5A-\uDF62\uDF78-\uDF7C\uDF90-\uDFFF]|\uD81B[\uDC00-\uDE3F\uDE80-\uDEFF\uDF4B-\uDF4E\uDF88-\uDF8E\uDFA0-\uDFDF\uDFE2\uDFE5-\uDFEF\uDFF2-\uDFFF]|\uD821[\uDFF8-\uDFFF]|\uD823[\uDCD6-\uDCFF\uDD09-\uDFFF]|\uD82C[\uDD1F-\uDD4F\uDD53-\uDD63\uDD68-\uDD6F\uDEFC-\uDFFF]|\uD82F[\uDC6B-\uDC6F\uDC7D-\uDC7F\uDC89-\uDC8F\uDC9A-\uDC9C\uDC9F-\uDFFF]|\uD834[\uDC00-\uDD64\uDD6A-\uDD6C\uDD73-\uDD7A\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDE41\uDE45-\uDFFF]|\uD835[\uDC55\uDC9D\uDCA0\uDCA1\uDCA3\uDCA4\uDCA7\uDCA8\uDCAD\uDCBA\uDCBC\uDCC4\uDD06\uDD0B\uDD0C\uDD15\uDD1D\uDD3A\uDD3F\uDD45\uDD47-\uDD49\uDD51\uDEA6\uDEA7\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3\uDFCC\uDFCD]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85-\uDE9A\uDEA0\uDEB0-\uDFFF]|\uD838[\uDC07\uDC19\uDC1A\uDC22\uDC25\uDC2B-\uDCFF\uDD2D-\uDD2F\uDD3E\uDD3F\uDD4A-\uDD4D\uDD4F-\uDEBF\uDEFA-\uDFFF]|\uD83A[\uDCC5-\uDCCF\uDCD7-\uDCFF\uDD4C-\uDD4F\uDD5A-\uDFFF]|\uD83B[\uDC00-\uDDFF\uDE04\uDE20\uDE23\uDE25\uDE26\uDE28\uDE33\uDE38\uDE3A\uDE3C-\uDE41\uDE43-\uDE46\uDE48\uDE4A\uDE4C\uDE50\uDE53\uDE55\uDE56\uDE58\uDE5A\uDE5C\uDE5E\uDE60\uDE63\uDE65\uDE66\uDE6B\uDE73\uDE78\uDE7D\uDE7F\uDE8A\uDE9C-\uDEA0\uDEA4\uDEAA\uDEBC-\uDFFF]|\uD83C[\uDC00-\uDD2F\uDD4A-\uDD4F\uDD6A-\uDD6F\uDD8A-\uDFFF]|\uD83E[\uDC00-\uDFEF\uDFFA-\uDFFF]|\uD869[\uDEDE-\uDEFF]|\uD86D[\uDF35-\uDF3F]|\uD86E[\uDC1E\uDC1F]|\uD873[\uDEA2-\uDEAF]|\uD87A[\uDFE1-\uDFFF]|\uD87E[\uDE1E-\uDFFF]|\uD884[\uDF4B-\uDFFF]|\uDB40[\uDC00-\uDCFF\uDDF0-\uDFFF]/g;

function slugify(heading: string): string {
	const slugifiedHeading = heading.trim()
		.toLowerCase()
		.replace(githubSlugReplaceRegex, '')
		.replace(/\s/g, '-'); // Replace whitespace with -

	return slugifiedHeading;
}

// Copied from https://github.com/markedjs/marked-gfm-heading-id/blob/main/src/index.js
// Removed logic for handling duplicate header ids for now

// unescape from marked helpers
const unescapeTest = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig;
function unescape(html: string) {
	// explicitly match decimal, hex, and named HTML entities
	return html.replace(unescapeTest, (_, n) => {
		n = n.toLowerCase();
		if (n === 'colon') { return ':'; }
		if (n.charAt(0) === '#') {
			return n.charAt(1) === 'x'
				? String.fromCharCode(parseInt(n.substring(2), 16))
				: String.fromCharCode(+n.substring(1));
		}
		return '';
	});
}

export function markedGfmHeadingIdPlugin({ prefix = '', globalSlugs = false } = {}): marked.MarkedExtension {
	return {
		// hooks: {
		// 	preprocess(src: string) {
		// 		if (!globalSlugs) {
		// 			resetHeadings();
		// 		}
		// 		return src;
		// 	},
		// },
		renderer: {
			heading({ tokens, depth }) {
				const text = this.parser.parseInline(tokens);
				const raw = unescape(this.parser.parseInline(tokens, this.parser.textRenderer))
					.trim()
					.replace(/<[!\/a-z].*?>/gi, '');
				const level = depth;
				const id = `${prefix}${slugify(raw)}`;
				// const heading = { level, text, id, raw };
				// headings.push(heading);
				return `<h${level} id="${id}">${text}</h${level}>\n`;
			},
		},
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/markdown/browser/markedKatexSupport.ts]---
Location: vscode-main/src/vs/workbench/contrib/markdown/browser/markedKatexSupport.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { importAMDNodeModule, resolveAmdNodeModulePath } from '../../../../amdX.js';
import * as domSanitize from '../../../../base/browser/domSanitize.js';
import { MarkdownSanitizerConfig } from '../../../../base/browser/markdownRenderer.js';
import { CodeWindow } from '../../../../base/browser/window.js';
import { Lazy } from '../../../../base/common/lazy.js';
import type * as marked from '../../../../base/common/marked/marked.js';
import { katexContainerLatexAttributeName, MarkedKatexExtension } from '../common/markedKatexExtension.js';

export class MarkedKatexSupport {

	public static getSanitizerOptions(baseConfig: {
		readonly allowedTags: readonly string[];
		readonly allowedAttributes: ReadonlyArray<string | domSanitize.SanitizeAttributeRule>;
	}): MarkdownSanitizerConfig {
		return {
			allowedTags: {
				override: [
					...baseConfig.allowedTags,
					...trustedMathMlTags,
				]
			},
			allowedAttributes: {
				override: [
					...baseConfig.allowedAttributes,

					// Math
					'stretchy',
					'encoding',
					'accent',
					katexContainerLatexAttributeName,

					// SVG
					'd',
					'viewBox',
					'preserveAspectRatio',

					// Allow all classes since we don't have a list of allowed katex classes
					'class',

					// Sanitize allowed styles for katex
					{
						attributeName: 'style',
						shouldKeep: (_el, data) => this.sanitizeKatexStyles(data.attrValue),
					},
				]
			},
		};
	}

	private static tempSanitizerRule = new Lazy(() => {
		// Create a CSSStyleDeclaration object via a style sheet rule
		const styleSheet = new CSSStyleSheet();
		styleSheet.insertRule(`.temp{}`);
		const rule = styleSheet.cssRules[0];
		if (!(rule instanceof CSSStyleRule)) {
			throw new Error('Invalid CSS rule');
		}
		return rule.style;
	});

	private static sanitizeStyles(styleString: string, allowedProperties: readonly string[]): string {
		const style = this.tempSanitizerRule.value;
		style.cssText = styleString;

		const sanitizedProps = [];

		for (let i = 0; i < style.length; i++) {
			const prop = style[i];
			if (allowedProperties.includes(prop)) {
				const value = style.getPropertyValue(prop);
				// Allow through lists of numbers with units or bare words like 'block'
				// Main goal is to block things like 'url()'.
				if (/^(([\d\.\-]+\w*\s?)+|\w+)$/.test(value)) {
					sanitizedProps.push(`${prop}: ${value}`);
				}
			}
		}

		return sanitizedProps.join('; ');
	}

	private static sanitizeKatexStyles(styleString: string): string {
		const allowedProperties = [
			'display',
			'position',
			'font-family',
			'font-style',
			'font-weight',
			'font-size',
			'height',
			'min-height',
			'max-height',
			'width',
			'min-width',
			'max-width',
			'margin',
			'margin-top',
			'margin-right',
			'margin-bottom',
			'margin-left',
			'padding',
			'padding-top',
			'padding-right',
			'padding-bottom',
			'padding-left',
			'top',
			'left',
			'right',
			'bottom',
			'vertical-align',
			'transform',
			'border',
			'border-top-width',
			'border-right-width',
			'border-bottom-width',
			'border-left-width',
			'color',
			'white-space',
			'text-align',
			'line-height',
			'float',
			'clear',
		];
		return this.sanitizeStyles(styleString, allowedProperties);
	}

	private static _katex?: typeof import('katex').default;
	private static _katexPromise = new Lazy(async () => {
		this._katex = await importAMDNodeModule<typeof import('katex').default>('katex', 'dist/katex.min.js');
		return this._katex;
	});

	public static getExtension(window: CodeWindow, options: MarkedKatexExtension.MarkedKatexOptions = {}): marked.MarkedExtension | undefined {
		if (!this._katex) {
			return undefined;
		}

		this.ensureKatexStyles(window);
		return MarkedKatexExtension.extension(this._katex, options);
	}

	public static async loadExtension(window: CodeWindow, options: MarkedKatexExtension.MarkedKatexOptions = {}): Promise<marked.MarkedExtension> {
		const katex = await this._katexPromise.value;
		this.ensureKatexStyles(window);
		return MarkedKatexExtension.extension(katex, options);
	}

	public static ensureKatexStyles(window: CodeWindow) {
		const doc = window.document;
		// eslint-disable-next-line no-restricted-syntax
		if (!doc.querySelector('link.katex')) {
			const katexStyle = document.createElement('link');
			katexStyle.classList.add('katex');
			katexStyle.rel = 'stylesheet';
			katexStyle.href = resolveAmdNodeModulePath('katex', 'dist/katex.min.css');
			doc.head.appendChild(katexStyle);
		}
	}
}

const trustedMathMlTags = Object.freeze([
	'semantics',
	'annotation',
	'math',
	'menclose',
	'merror',
	'mfenced',
	'mfrac',
	'mglyph',
	'mi',
	'mlabeledtr',
	'mmultiscripts',
	'mn',
	'mo',
	'mover',
	'mpadded',
	'mphantom',
	'mroot',
	'mrow',
	'ms',
	'mspace',
	'msqrt',
	'mstyle',
	'msub',
	'msup',
	'msubsup',
	'mtable',
	'mtd',
	'mtext',
	'mtr',
	'munder',
	'munderover',
	'mprescripts',

	// svg tags
	'svg',
	'altglyph',
	'altglyphdef',
	'altglyphitem',
	'circle',
	'clippath',
	'defs',
	'desc',
	'ellipse',
	'filter',
	'font',
	'g',
	'glyph',
	'glyphref',
	'hkern',
	'line',
	'lineargradient',
	'marker',
	'mask',
	'metadata',
	'mpath',
	'path',
	'pattern',
	'polygon',
	'polyline',
	'radialgradient',
	'rect',
	'stop',
	'style',
	'switch',
	'symbol',
	'text',
	'textpath',
	'title',
	'tref',
	'tspan',
	'view',
	'vkern',
]);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/markdown/browser/media/markdown.css]---
Location: vscode-main/src/vs/workbench/contrib/markdown/browser/media/markdown.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* Alert color mappings using theme variables */
blockquote[data-severity="note"] {
	--vscode-textBlockQuote-border: var(--vscode-markdownAlert-note-foreground);
}

blockquote[data-severity="tip"] {
	--vscode-textBlockQuote-border: var(--vscode-markdownAlert-tip-foreground);
}

blockquote[data-severity="important"] {
	--vscode-textBlockQuote-border: var(--vscode-markdownAlert-important-foreground);
}

blockquote[data-severity="warning"] {
	--vscode-textBlockQuote-border: var(--vscode-markdownAlert-warning-foreground);
}

blockquote[data-severity="caution"] {
	--vscode-textBlockQuote-border: var(--vscode-markdownAlert-caution-foreground);
}

/* Alert title styling */
blockquote[data-severity] > p > :first-child {
	display: inline-flex;
	align-items: center;
	color: var(--vscode-textBlockQuote-border);
	font-weight: bolder;
}

blockquote[data-severity] > p > :first-child .codicon {
	color: var(--vscode-textBlockQuote-border);
	padding-right: 6px;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/markdown/common/markdownColors.ts]---
Location: vscode-main/src/vs/workbench/contrib/markdown/common/markdownColors.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { registerColor, editorInfoForeground, editorWarningForeground, editorErrorForeground } from '../../../../platform/theme/common/colorRegistry.js';
import { chartsGreen, chartsPurple } from '../../../../platform/theme/common/colors/chartsColors.js';

/*
 * Markdown alert colors for GitHub-style alert syntax.
 */

export const markdownAlertNoteColor = registerColor('markdownAlert.note.foreground',
	editorInfoForeground,
	localize('markdownAlertNoteForeground', "Foreground color for note alerts in markdown."));

export const markdownAlertTipColor = registerColor('markdownAlert.tip.foreground',
	chartsGreen,
	localize('markdownAlertTipForeground', "Foreground color for tip alerts in markdown."));

export const markdownAlertImportantColor = registerColor('markdownAlert.important.foreground',
	chartsPurple,
	localize('markdownAlertImportantForeground', "Foreground color for important alerts in markdown."));

export const markdownAlertWarningColor = registerColor('markdownAlert.warning.foreground',
	editorWarningForeground,
	localize('markdownAlertWarningForeground', "Foreground color for warning alerts in markdown."));

export const markdownAlertCautionColor = registerColor('markdownAlert.caution.foreground',
	editorErrorForeground,
	localize('markdownAlertCautionForeground', "Foreground color for caution alerts in markdown."));
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/markdown/common/markedKatexExtension.ts]---
Location: vscode-main/src/vs/workbench/contrib/markdown/common/markedKatexExtension.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import type * as marked from '../../../../base/common/marked/marked.js';
import { htmlAttributeEncodeValue } from '../../../../base/common/strings.js';

export const mathInlineRegExp = /(?<![a-zA-Z0-9])(?<dollars>\${1,2})(?!\.|\(["'])((?:\\.|[^\\\n])*?(?:\\.|[^\\\n\$]))\k<dollars>(?![a-zA-Z0-9])/; // Non-standard, but ensure opening $ is not preceded and closing $ is not followed by word/number characters, opening $ not followed by ., (", ('
export const katexContainerClassName = 'vscode-katex-container';
export const katexContainerLatexAttributeName = 'data-latex';

const inlineRule = new RegExp('^' + mathInlineRegExp.source);

export namespace MarkedKatexExtension {
	type KatexOptions = import('katex').KatexOptions;

	// From https://github.com/UziTech/marked-katex-extension/blob/main/src/index.js
	// From https://github.com/UziTech/marked-katex-extension/blob/main/src/index.js
	export interface MarkedKatexOptions extends KatexOptions { }

	const blockRule = /^(\${1,2})\n((?:\\[^]|[^\\])+?)\n\1(?:\n|$)/;

	export function extension(katex: typeof import('katex').default, options: MarkedKatexOptions = {}): marked.MarkedExtension {
		return {
			extensions: [
				inlineKatex(options, createRenderer(katex, options, false)),
				blockKatex(options, createRenderer(katex, options, true)),
			],
		};
	}

	function createRenderer(katex: typeof import('katex').default, options: MarkedKatexOptions, isBlock: boolean): marked.RendererExtensionFunction {
		return (token: marked.Tokens.Generic) => {
			let out: string;
			try {
				const html = katex.renderToString(token.text, {
					...options,
					throwOnError: true,
					displayMode: token.displayMode,
				});

				// Wrap in a container with attribute as a fallback for extracting the original LaTeX source
				// This ensures we can always retrieve the source even if the annotation element is not present
				out = `<span class="${katexContainerClassName}" ${katexContainerLatexAttributeName}="${htmlAttributeEncodeValue(token.text)}">${html}</span>`;
			} catch {
				// On failure, just use the original text including the wrapping $ or $$
				out = token.raw;
			}
			return out + (isBlock ? '\n' : '');
		};
	}

	function inlineKatex(options: MarkedKatexOptions, renderer: marked.RendererExtensionFunction): marked.TokenizerAndRendererExtension {
		const ruleReg = inlineRule;
		return {
			name: 'inlineKatex',
			level: 'inline',
			start(src: string) {
				let index;
				let indexSrc = src;

				while (indexSrc) {
					index = indexSrc.indexOf('$');
					if (index === -1) {
						return;
					}

					const possibleKatex = indexSrc.substring(index);
					if (possibleKatex.match(ruleReg)) {
						return index;
					}

					indexSrc = indexSrc.substring(index + 1).replace(/^\$+/, '');
				}
				return;
			},
			tokenizer(src: string, tokens: marked.Token[]) {
				const match = src.match(ruleReg);
				if (match) {
					return {
						type: 'inlineKatex',
						raw: match[0],
						text: match[2].trim(),
						displayMode: match[1].length === 2,
					};
				}
				return;
			},
			renderer,
		};
	}

	function blockKatex(options: MarkedKatexOptions, renderer: marked.RendererExtensionFunction): marked.TokenizerAndRendererExtension {
		return {
			name: 'blockKatex',
			level: 'block',
			start(src: string) {
				return src.match(new RegExp(blockRule.source, 'm'))?.index;
			},
			tokenizer(src: string, tokens: marked.Token[]) {
				const match = src.match(blockRule);
				if (match) {
					return {
						type: 'blockKatex',
						raw: match[0],
						text: match[2].trim(),
						displayMode: match[1].length === 2,
					};
				}
				return;
			},
			renderer,
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/markdown/test/browser/markdownDocumentRenderer.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/markdown/test/browser/markdownDocumentRenderer.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { ILanguageService } from '../../../../../editor/common/languages/language.js';
import { createCodeEditorServices } from '../../../../../editor/test/browser/testCodeEditor.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { IExtensionService } from '../../../../services/extensions/common/extensions.js';
import { renderMarkdownDocument } from '../../browser/markdownDocumentRenderer.js';


suite('Markdown Document Renderer Test', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	let instantiationService: TestInstantiationService;
	let extensionService: IExtensionService;
	let languageService: ILanguageService;

	setup(() => {
		instantiationService = createCodeEditorServices(store);
		extensionService = instantiationService.get(IExtensionService);
		languageService = instantiationService.get(ILanguageService);
	});

	test('Should remove images with relative paths by default', async () => {
		const result = await renderMarkdownDocument('![alt](src/img.png)', extensionService, languageService, {});
		assert.strictEqual(result.toString(), `<p><img alt="alt"></p>\n`);
	});

	test('Can enable images with relative paths using setting', async () => {
		const result = await renderMarkdownDocument('![alt](src/img.png)', extensionService, languageService, {
			sanitizerConfig: {
				allowRelativeMediaPaths: true,
			}
		});

		assert.strictEqual(result.toString(), `<p><img src="src/img.png" alt="alt"></p>\n`);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/markdown/test/browser/markdownKatexSupport.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/markdown/test/browser/markdownKatexSupport.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { getWindow } from '../../../../../base/browser/dom.js';
import { basicMarkupHtmlTags, defaultAllowedAttrs } from '../../../../../base/browser/domSanitize.js';
import { renderMarkdown } from '../../../../../base/browser/markdownRenderer.js';
import { MarkdownString } from '../../../../../base/common/htmlContent.js';
import { assertSnapshot } from '../../../../../base/test/common/snapshot.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { MarkedKatexSupport } from '../../browser/markedKatexSupport.js';


suite('Markdown Katex Support Test', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	async function renderMarkdownWithKatex(str: string) {
		const katex = await MarkedKatexSupport.loadExtension(getWindow(document), {});
		const rendered = store.add(renderMarkdown(new MarkdownString(str), {
			sanitizerConfig: MarkedKatexSupport.getSanitizerOptions({
				allowedTags: basicMarkupHtmlTags,
				allowedAttributes: defaultAllowedAttrs,
			}),
			markedExtensions: [katex],
		}));
		return rendered;
	}

	test('Basic inline equation', async () => {
		const rendered = await renderMarkdownWithKatex('Hello $\\frac{1}{2}$ World!');
		assert.ok(rendered.element.innerHTML.includes('katex'));
		await assertSnapshot(rendered.element.innerHTML);
	});

	test('Should support inline equation wrapped in parans', async () => {
		const rendered = await renderMarkdownWithKatex('Hello ($\\frac{1}{2}$) World!');
		assert.ok(rendered.element.innerHTML.includes('katex'));
		await assertSnapshot(rendered.element.innerHTML);
	});

	test('Should support blocks immediately after paragraph', async () => {
		const rendered = await renderMarkdownWithKatex([
			'Block example:',
			'$$',
			'\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}',
			'$$',
		].join('\n'));
		assert.ok(rendered.element.innerHTML.includes('katex'));
		await assertSnapshot(rendered.element.innerHTML);
	});

	test('Should not render math when dollar sign is preceded by word character', async () => {
		const rendered = await renderMarkdownWithKatex('for ($i = 1; $i -le 20; $i++) { echo "hello world"; Start-Sleep 1 }');
		assert.ok(!rendered.element.innerHTML.includes('katex'));
		await assertSnapshot(rendered.element.innerHTML);
	});

	test('Should not render math when dollar sign is followed by word character', async () => {
		const rendered = await renderMarkdownWithKatex('The cost is $10dollars for this item');
		assert.ok(!rendered.element.innerHTML.includes('katex'));
		await assertSnapshot(rendered.element.innerHTML);
	});

	test('Should still render math with special characters around dollars', async () => {
		const rendered = await renderMarkdownWithKatex('Hello ($\\frac{1}{2}$) and [$x^2$] work fine');
		assert.ok(rendered.element.innerHTML.includes('katex'));
		await assertSnapshot(rendered.element.innerHTML);
	});

	test('Should still render math at start and end of line', async () => {
		const rendered = await renderMarkdownWithKatex('$\\frac{1}{2}$ at start, and at end $x^2$');
		assert.ok(rendered.element.innerHTML.includes('katex'));
		await assertSnapshot(rendered.element.innerHTML);
	});

	test('Should not render math when dollar signs appear in jQuery expressions', async () => {
		const rendered = await renderMarkdownWithKatex('$.getJSON, $.ajax, $.get and $("#dialogDetalleZona").dialog(...) / $("#dialogDetallePDC").dialog(...)');
		assert.ok(!rendered.element.innerHTML.includes('katex'));
		await assertSnapshot(rendered.element.innerHTML);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/markdown/test/browser/markdownSettingRenderer.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/markdown/test/browser/markdownSettingRenderer.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { IAction } from '../../../../../base/common/actions.js';
import { URI } from '../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { ConfigurationScope, Extensions, IConfigurationNode, IConfigurationRegistry } from '../../../../../platform/configuration/common/configurationRegistry.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { IContextMenuService } from '../../../../../platform/contextview/browser/contextView.js';
import { Registry } from '../../../../../platform/registry/common/platform.js';
import { SimpleSettingRenderer } from '../../browser/markdownSettingRenderer.js';
import { IPreferencesService } from '../../../../services/preferences/common/preferences.js';

const configuration: IConfigurationNode = {
	'id': 'examples',
	'title': 'Examples',
	'type': 'object',
	'properties': {
		'example.booleanSetting': {
			'type': 'boolean',
			'default': false,
			'scope': ConfigurationScope.APPLICATION
		},
		'example.booleanSetting2': {
			'type': 'boolean',
			'default': true,
			'scope': ConfigurationScope.APPLICATION
		},
		'example.stringSetting': {
			'type': 'string',
			'default': 'one',
			'scope': ConfigurationScope.APPLICATION
		},
		'example.numberSetting': {
			'type': 'number',
			'default': 3,
			'scope': ConfigurationScope.APPLICATION
		}
	}
};

class MarkdownConfigurationService extends TestConfigurationService {
	override async updateValue(key: string, value: any): Promise<void> {
		const [section, setting] = key.split('.');
		return this.setUserConfiguration(section, { [setting]: value });
	}
}

suite('Markdown Setting Renderer Test', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	let configurationService: TestConfigurationService;
	let preferencesService: IPreferencesService;
	let contextMenuService: IContextMenuService;
	let settingRenderer: SimpleSettingRenderer;

	suiteSetup(() => {
		configurationService = new MarkdownConfigurationService();
		preferencesService = <IPreferencesService>{
			getSetting: (setting) => {
				let type = 'boolean';
				if (setting.includes('string')) {
					type = 'string';
				}
				return { type, key: setting };
			}
		};
		contextMenuService = <IContextMenuService>{};
		Registry.as<IConfigurationRegistry>(Extensions.Configuration).registerConfiguration(configuration);
		// eslint-disable-next-line local/code-no-any-casts
		settingRenderer = new SimpleSettingRenderer(configurationService, contextMenuService, preferencesService, { publicLog2: () => { } } as any, { writeText: async () => { } } as any);
	});

	suiteTeardown(() => {
		Registry.as<IConfigurationRegistry>(Extensions.Configuration).deregisterConfigurations([configuration]);
	});

	test('render code setting button with value', () => {
		const htmlRenderer = settingRenderer.getHtmlRenderer();
		const htmlNoValue = '<a href="code-oss://settings/example.booleanSetting" codesetting="true">';
		const renderedHtmlNoValue = htmlRenderer({ block: false, raw: htmlNoValue, pre: false, text: '', type: 'html' });
		assert.strictEqual(renderedHtmlNoValue,
			`<code tabindex="0"><a href="code-setting://example.booleanSetting/true" class="codesetting" title="View or change setting" aria-role="button"><svg width="14" height="14" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M9.1 4.4L8.6 2H7.4l-.5 2.4-.7.3-2-1.3-.9.8 1.3 2-.2.7-2.4.5v1.2l2.4.5.3.8-1.3 2 .8.8 2-1.3.8.3.4 2.3h1.2l.5-2.4.8-.3 2 1.3.8-.8-1.3-2 .3-.8 2.3-.4V7.4l-2.4-.5-.3-.8 1.3-2-.8-.8-2 1.3-.7-.2zM9.4 1l.5 2.4L12 2.1l2 2-1.4 2.1 2.4.4v2.8l-2.4.5L14 12l-2 2-2.1-1.4-.5 2.4H6.6l-.5-2.4L4 13.9l-2-2 1.4-2.1L1 9.4V6.6l2.4-.5L2.1 4l2-2 2.1 1.4.4-2.4h2.8zm.6 7c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zM8 9c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1z"/></svg>
			<span class="separator"></span>
			<span class="setting-name">example.booleanSetting</span>
		</a></code>`);
	});

	test('actions with no value', () => {
		const uri = URI.parse(settingRenderer.settingToUriString('example.booleanSetting'));
		const actions = settingRenderer.getActions(uri);
		assert.strictEqual(actions?.length, 2);
		assert.strictEqual(actions[0].label, 'View "Example: Boolean Setting" in Settings');
	});

	test('actions with value + updating and restoring', async () => {
		await configurationService.setUserConfiguration('example', { stringSetting: 'two' });
		const uri = URI.parse(settingRenderer.settingToUriString('example.stringSetting', 'three'));

		const verifyOriginalState = (actions: IAction[] | undefined): actions is IAction[] => {
			assert.strictEqual(actions?.length, 3);
			assert.strictEqual(actions[0].label, 'Set "Example: String Setting" to "three"');
			assert.strictEqual(actions[1].label, 'View in Settings');
			assert.strictEqual(configurationService.getValue('example.stringSetting'), 'two');
			return true;
		};

		const actions = settingRenderer.getActions(uri);
		if (verifyOriginalState(actions)) {
			// Update the value
			await actions[0].run();
			assert.strictEqual(configurationService.getValue('example.stringSetting'), 'three');
			const actionsUpdated = settingRenderer.getActions(uri);
			assert.strictEqual(actionsUpdated?.length, 3);
			assert.strictEqual(actionsUpdated[0].label, 'Restore value of "Example: String Setting"');
			assert.strictEqual(actions[1].label, 'View in Settings');
			assert.strictEqual(actions[2].label, 'Copy Setting ID');
			assert.strictEqual(configurationService.getValue('example.stringSetting'), 'three');

			// Restore the value
			await actionsUpdated[0].run();
			verifyOriginalState(settingRenderer.getActions(uri));
		}
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/markdown/test/browser/__snapshots__/Markdown_Katex_Support_Test_Basic_inline_equation.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/markdown/test/browser/__snapshots__/Markdown_Katex_Support_Test_Basic_inline_equation.0.snap

```text
<p>Hello <span class="vscode-katex-container" data-latex="\frac{1}{2}"><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mfrac><mn>1</mn><mn>2</mn></mfrac></mrow><annotation encoding="application/x-tex">\frac{1}{2}</annotation></semantics></math></span><span class="katex-html"><span class="base"><span class="strut" style="height: 1.1901em; vertical-align: -0.345em"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 0.8451em"><span style="top: -2.655em"><span class="pstrut" style="height: 3em"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">2</span></span></span></span><span style="top: -3.23em"><span class="pstrut" style="height: 3em"></span><span class="frac-line" style="border-bottom-width: 0.04em"></span></span><span style="top: -3.394em"><span class="pstrut" style="height: 3em"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">1</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height: 0.345em"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span></span></span> World!</p>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/markdown/test/browser/__snapshots__/Markdown_Katex_Support_Test_Should_not_render_math_when_dollar_signs_appear_in_jQuery_expressions.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/markdown/test/browser/__snapshots__/Markdown_Katex_Support_Test_Should_not_render_math_when_dollar_signs_appear_in_jQuery_expressions.0.snap

```text
<p>$.getJSON, $.ajax, $.get and $("#dialogDetalleZona").dialog(...) / $("#dialogDetallePDC").dialog(...)</p>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/markdown/test/browser/__snapshots__/Markdown_Katex_Support_Test_Should_not_render_math_when_dollar_sign_is_followed_by_word_character.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/markdown/test/browser/__snapshots__/Markdown_Katex_Support_Test_Should_not_render_math_when_dollar_sign_is_followed_by_word_character.0.snap

```text
<p>The cost is $10dollars for this item</p>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/markdown/test/browser/__snapshots__/Markdown_Katex_Support_Test_Should_not_render_math_when_dollar_sign_is_preceded_by_word_character.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/markdown/test/browser/__snapshots__/Markdown_Katex_Support_Test_Should_not_render_math_when_dollar_sign_is_preceded_by_word_character.0.snap

```text
<p>for ($i = 1; $i -le 20; $i++) { echo "hello world"; Start-Sleep 1 }</p>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/markdown/test/browser/__snapshots__/Markdown_Katex_Support_Test_Should_still_render_math_at_start_and_end_of_line.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/markdown/test/browser/__snapshots__/Markdown_Katex_Support_Test_Should_still_render_math_at_start_and_end_of_line.0.snap

```text
<p><span class="vscode-katex-container" data-latex="\frac{1}{2}"><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mfrac><mn>1</mn><mn>2</mn></mfrac></mrow><annotation encoding="application/x-tex">\frac{1}{2}</annotation></semantics></math></span><span class="katex-html"><span class="base"><span class="strut" style="height: 1.1901em; vertical-align: -0.345em"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 0.8451em"><span style="top: -2.655em"><span class="pstrut" style="height: 3em"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">2</span></span></span></span><span style="top: -3.23em"><span class="pstrut" style="height: 3em"></span><span class="frac-line" style="border-bottom-width: 0.04em"></span></span><span style="top: -3.394em"><span class="pstrut" style="height: 3em"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">1</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height: 0.345em"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span></span></span> at start, and at end <span class="vscode-katex-container" data-latex="x^2"><span class="katex"><span class="katex-mathml"><math><semantics><mrow><msup><mi>x</mi><mn>2</mn></msup></mrow><annotation encoding="application/x-tex">x^2</annotation></semantics></math></span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.8141em"></span><span class="mord"><span class="mord mathnormal">x</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.8141em"><span style="top: -3.063em; margin-right: 0.05em"><span class="pstrut" style="height: 2.7em"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span></span></span></span></span></p>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/markdown/test/browser/__snapshots__/Markdown_Katex_Support_Test_Should_still_render_math_with_special_characters_around_dollars.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/markdown/test/browser/__snapshots__/Markdown_Katex_Support_Test_Should_still_render_math_with_special_characters_around_dollars.0.snap

```text
<p>Hello (<span class="vscode-katex-container" data-latex="\frac{1}{2}"><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mfrac><mn>1</mn><mn>2</mn></mfrac></mrow><annotation encoding="application/x-tex">\frac{1}{2}</annotation></semantics></math></span><span class="katex-html"><span class="base"><span class="strut" style="height: 1.1901em; vertical-align: -0.345em"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 0.8451em"><span style="top: -2.655em"><span class="pstrut" style="height: 3em"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">2</span></span></span></span><span style="top: -3.23em"><span class="pstrut" style="height: 3em"></span><span class="frac-line" style="border-bottom-width: 0.04em"></span></span><span style="top: -3.394em"><span class="pstrut" style="height: 3em"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">1</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height: 0.345em"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span></span></span>) and [<span class="vscode-katex-container" data-latex="x^2"><span class="katex"><span class="katex-mathml"><math><semantics><mrow><msup><mi>x</mi><mn>2</mn></msup></mrow><annotation encoding="application/x-tex">x^2</annotation></semantics></math></span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.8141em"></span><span class="mord"><span class="mord mathnormal">x</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.8141em"><span style="top: -3.063em; margin-right: 0.05em"><span class="pstrut" style="height: 2.7em"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span></span></span></span></span>] work fine</p>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/markdown/test/browser/__snapshots__/Markdown_Katex_Support_Test_Should_support_blocks_immediately_after_paragraph.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/markdown/test/browser/__snapshots__/Markdown_Katex_Support_Test_Should_support_blocks_immediately_after_paragraph.0.snap

```text
<p>Block example:</p><span class="vscode-katex-container" data-latex="\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}"><span class="katex-display"><span class="katex"><span class="katex-mathml"><math><semantics><mrow><msubsup><mo>∫</mo><mrow><mo>−</mo><mi>∞</mi></mrow><mi>∞</mi></msubsup><msup><mi>e</mi><mrow><mo>−</mo><msup><mi>x</mi><mn>2</mn></msup></mrow></msup><mi>d</mi><mi>x</mi><mo>=</mo><msqrt><mi>π</mi></msqrt></mrow><annotation encoding="application/x-tex">\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}</annotation></semantics></math></span><span class="katex-html"><span class="base"><span class="strut" style="height: 2.3846em; vertical-align: -0.9703em"></span><span class="mop"><span class="mop op-symbol large-op" style="margin-right: 0.44445em; position: relative; top: -0.0011em">∫</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 1.4143em"><span style="top: -1.7881em; margin-left: -0.4445em; margin-right: 0.05em"><span class="pstrut" style="height: 2.7em"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">−</span><span class="mord mtight">∞</span></span></span></span><span style="top: -3.8129em; margin-right: 0.05em"><span class="pstrut" style="height: 2.7em"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">∞</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height: 0.9703em"><span></span></span></span></span></span></span><span class="mspace" style="margin-right: 0.1667em"></span><span class="mord"><span class="mord mathnormal">e</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 1.0369em"><span style="top: -3.113em; margin-right: 0.05em"><span class="pstrut" style="height: 2.7em"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">−</span><span class="mord mtight"><span class="mord mathnormal mtight">x</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height: 0.8913em"><span style="top: -2.931em; margin-right: 0.0714em"><span class="pstrut" style="height: 2.5em"></span><span class="sizing reset-size3 size1 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span><span class="mord mathnormal">d</span><span class="mord mathnormal">x</span><span class="mspace" style="margin-right: 0.2778em"></span><span class="mrel">=</span><span class="mspace" style="margin-right: 0.2778em"></span></span><span class="base"><span class="strut" style="height: 1.04em; vertical-align: -0.1908em"></span><span class="mord sqrt"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 0.8492em"><span class="svg-align" style="top: -3em"><span class="pstrut" style="height: 3em"></span><span class="mord" style="padding-left: 0.833em"><span class="mord mathnormal" style="margin-right: 0.03588em">π</span></span></span><span style="top: -2.8092em"><span class="pstrut" style="height: 3em"></span><span class="hide-tail" style="min-width: 0.853em; height: 1.08em"><svg width="400em" height="1.08em" viewBox="0 0 400000 1080" preserveAspectRatio="xMinYMin slice"><path d="M95,702
c-2.7,0,-7.17,-2.7,-13.5,-8c-5.8,-5.3,-9.5,-10,-9.5,-14
c0,-2,0.3,-3.3,1,-4c1.3,-2.7,23.83,-20.7,67.5,-54
c44.2,-33.3,65.8,-50.3,66.5,-51c1.3,-1.3,3,-2,5,-2c4.7,0,8.7,3.3,12,10
s173,378,173,378c0.7,0,35.3,-71,104,-213c68.7,-142,137.5,-285,206.5,-429
c69,-144,104.5,-217.7,106.5,-221
l0 -0
c5.3,-9.3,12,-14,20,-14
H400000v40H845.2724
s-225.272,467,-225.272,467s-235,486,-235,486c-2.7,4.7,-9,7,-19,7
c-6,0,-10,-1,-12,-3s-194,-422,-194,-422s-65,47,-65,47z
M834 80h400000v40h-400000z"></path></svg></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height: 0.1908em"><span></span></span></span></span></span></span></span></span></span></span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/markdown/test/browser/__snapshots__/Markdown_Katex_Support_Test_Should_support_inline_equation_wrapped_in_parans.0.snap]---
Location: vscode-main/src/vs/workbench/contrib/markdown/test/browser/__snapshots__/Markdown_Katex_Support_Test_Should_support_inline_equation_wrapped_in_parans.0.snap

```text
<p>Hello (<span class="vscode-katex-container" data-latex="\frac{1}{2}"><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mfrac><mn>1</mn><mn>2</mn></mfrac></mrow><annotation encoding="application/x-tex">\frac{1}{2}</annotation></semantics></math></span><span class="katex-html"><span class="base"><span class="strut" style="height: 1.1901em; vertical-align: -0.345em"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 0.8451em"><span style="top: -2.655em"><span class="pstrut" style="height: 3em"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">2</span></span></span></span><span style="top: -3.23em"><span class="pstrut" style="height: 3em"></span><span class="frac-line" style="border-bottom-width: 0.04em"></span></span><span style="top: -3.394em"><span class="pstrut" style="height: 3em"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">1</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height: 0.345em"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span></span></span>) World!</p>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/markers/browser/markers.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/markers/browser/markers.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './markersFileDecorations.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { Extensions, IConfigurationRegistry } from '../../../../platform/configuration/common/configurationRegistry.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { KeybindingsRegistry, KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { localize, localize2 } from '../../../../nls.js';
import { Marker, RelatedInformation, ResourceMarkers } from './markersModel.js';
import { MarkersView } from './markersView.js';
import { MenuId, registerAction2, Action2 } from '../../../../platform/actions/common/actions.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { MarkersViewMode, Markers, MarkersContextKeys } from '../common/markers.js';
import Messages from './messages.js';
import { IWorkbenchContributionsRegistry, Extensions as WorkbenchExtensions, IWorkbenchContribution, registerWorkbenchContribution2, WorkbenchPhase } from '../../../common/contributions.js';
import { IMarkersView } from './markers.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';
import { Disposable, IDisposable, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { IStatusbarEntryAccessor, IStatusbarService, StatusbarAlignment, IStatusbarEntry } from '../../../services/statusbar/browser/statusbar.js';
import { IMarkerService, MarkerStatistics } from '../../../../platform/markers/common/markers.js';
import { ViewContainer, IViewContainersRegistry, Extensions as ViewContainerExtensions, ViewContainerLocation, IViewsRegistry } from '../../../common/views.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { getVisbileViewContextKey, FocusedViewContext } from '../../../common/contextkeys.js';
import { ViewPaneContainer } from '../../../browser/parts/views/viewPaneContainer.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';
import { ViewAction } from '../../../browser/parts/views/viewPane.js';
import { IActivityService, NumberBadge } from '../../../services/activity/common/activity.js';
import { viewFilterSubmenu } from '../../../browser/parts/views/viewFilter.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { problemsConfigurationNodeBase } from '../../../common/configuration.js';
import { MarkerChatContextContribution } from './markersChatContext.js';

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: Markers.MARKER_OPEN_ACTION_ID,
	weight: KeybindingWeight.WorkbenchContrib,
	when: ContextKeyExpr.and(MarkersContextKeys.MarkerFocusContextKey),
	primary: KeyCode.Enter,
	mac: {
		primary: KeyCode.Enter,
		secondary: [KeyMod.CtrlCmd | KeyCode.DownArrow]
	},
	handler: (accessor, args: any) => {
		const markersView = accessor.get(IViewsService).getActiveViewWithId<MarkersView>(Markers.MARKERS_VIEW_ID)!;
		markersView.openFileAtElement(markersView.getFocusElement(), false, false, true);
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: Markers.MARKER_OPEN_SIDE_ACTION_ID,
	weight: KeybindingWeight.WorkbenchContrib,
	when: ContextKeyExpr.and(MarkersContextKeys.MarkerFocusContextKey),
	primary: KeyMod.CtrlCmd | KeyCode.Enter,
	mac: {
		primary: KeyMod.WinCtrl | KeyCode.Enter
	},
	handler: (accessor, args: any) => {
		const markersView = accessor.get(IViewsService).getActiveViewWithId<MarkersView>(Markers.MARKERS_VIEW_ID)!;
		markersView.openFileAtElement(markersView.getFocusElement(), false, true, true);
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: Markers.MARKER_SHOW_PANEL_ID,
	weight: KeybindingWeight.WorkbenchContrib,
	when: undefined,
	primary: undefined,
	handler: async (accessor, args: any) => {
		await accessor.get(IViewsService).openView(Markers.MARKERS_VIEW_ID);
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: Markers.MARKER_SHOW_QUICK_FIX,
	weight: KeybindingWeight.WorkbenchContrib,
	when: MarkersContextKeys.MarkerFocusContextKey,
	primary: KeyMod.CtrlCmd | KeyCode.Period,
	handler: (accessor, args: any) => {
		const markersView = accessor.get(IViewsService).getActiveViewWithId<MarkersView>(Markers.MARKERS_VIEW_ID)!;
		const focusedElement = markersView.getFocusElement();
		if (focusedElement instanceof Marker) {
			markersView.showQuickFixes(focusedElement);
		}
	}
});

// configuration
Registry.as<IConfigurationRegistry>(Extensions.Configuration).registerConfiguration({
	...problemsConfigurationNodeBase,
	'properties': {
		'problems.autoReveal': {
			'description': Messages.PROBLEMS_PANEL_CONFIGURATION_AUTO_REVEAL,
			'type': 'boolean',
			'default': true
		},
		'problems.defaultViewMode': {
			'description': Messages.PROBLEMS_PANEL_CONFIGURATION_VIEW_MODE,
			'type': 'string',
			'default': 'tree',
			'enum': ['table', 'tree'],
		},
		'problems.showCurrentInStatus': {
			'description': Messages.PROBLEMS_PANEL_CONFIGURATION_SHOW_CURRENT_STATUS,
			'type': 'boolean',
			'default': false
		},
		'problems.sortOrder': {
			'description': Messages.PROBLEMS_PANEL_CONFIGURATION_COMPARE_ORDER,
			'type': 'string',
			'default': 'severity',
			'enum': ['severity', 'position'],
			'enumDescriptions': [
				Messages.PROBLEMS_PANEL_CONFIGURATION_COMPARE_ORDER_SEVERITY,
				Messages.PROBLEMS_PANEL_CONFIGURATION_COMPARE_ORDER_POSITION,
			],
		},
	}
});

const markersViewIcon = registerIcon('markers-view-icon', Codicon.warning, localize('markersViewIcon', 'View icon of the markers view.'));

// markers view container
const VIEW_CONTAINER: ViewContainer = Registry.as<IViewContainersRegistry>(ViewContainerExtensions.ViewContainersRegistry).registerViewContainer({
	id: Markers.MARKERS_CONTAINER_ID,
	title: Messages.MARKERS_PANEL_TITLE_PROBLEMS,
	icon: markersViewIcon,
	hideIfEmpty: true,
	order: 0,
	ctorDescriptor: new SyncDescriptor(ViewPaneContainer, [Markers.MARKERS_CONTAINER_ID, { mergeViewWithContainerWhenSingleView: true }]),
	storageId: Markers.MARKERS_VIEW_STORAGE_ID,
}, ViewContainerLocation.Panel, { doNotRegisterOpenCommand: true });

Registry.as<IViewsRegistry>(ViewContainerExtensions.ViewsRegistry).registerViews([{
	id: Markers.MARKERS_VIEW_ID,
	containerIcon: markersViewIcon,
	name: Messages.MARKERS_PANEL_TITLE_PROBLEMS,
	canToggleVisibility: true,
	canMoveView: true,
	ctorDescriptor: new SyncDescriptor(MarkersView),
	openCommandActionDescriptor: {
		id: 'workbench.actions.view.problems',
		mnemonicTitle: localize({ key: 'miMarker', comment: ['&& denotes a mnemonic'] }, "&&Problems"),
		keybindings: { primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyM },
		order: 0,
	}
}], VIEW_CONTAINER);

// workbench
const workbenchRegistry = Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench);

// actions
registerAction2(class extends ViewAction<IMarkersView> {
	constructor() {
		super({
			id: `workbench.actions.table.${Markers.MARKERS_VIEW_ID}.viewAsTree`,
			title: localize('viewAsTree', "View as Tree"),
			metadata: {
				description: localize2('viewAsTreeDescription', "Show the problems view as a tree.")
			},
			menu: {
				id: MenuId.ViewTitle,
				when: ContextKeyExpr.and(ContextKeyExpr.equals('view', Markers.MARKERS_VIEW_ID), MarkersContextKeys.MarkersViewModeContextKey.isEqualTo(MarkersViewMode.Table)),
				group: 'navigation',
				order: 3
			},
			icon: Codicon.listTree,
			viewId: Markers.MARKERS_VIEW_ID
		});
	}

	async runInView(serviceAccessor: ServicesAccessor, view: IMarkersView): Promise<void> {
		view.setViewMode(MarkersViewMode.Tree);
	}
});

registerAction2(class extends ViewAction<IMarkersView> {
	constructor() {
		super({
			id: `workbench.actions.table.${Markers.MARKERS_VIEW_ID}.viewAsTable`,
			title: localize('viewAsTable', "View as Table"),
			metadata: {
				description: localize2('viewAsTableDescription', "Show the problems view as a table.")
			},
			menu: {
				id: MenuId.ViewTitle,
				when: ContextKeyExpr.and(ContextKeyExpr.equals('view', Markers.MARKERS_VIEW_ID), MarkersContextKeys.MarkersViewModeContextKey.isEqualTo(MarkersViewMode.Tree)),
				group: 'navigation',
				order: 3
			},
			icon: Codicon.listFlat,
			viewId: Markers.MARKERS_VIEW_ID
		});
	}

	async runInView(serviceAccessor: ServicesAccessor, view: IMarkersView): Promise<void> {
		view.setViewMode(MarkersViewMode.Table);
	}
});

registerAction2(class extends ViewAction<IMarkersView> {
	constructor() {
		super({
			id: `workbench.actions.${Markers.MARKERS_VIEW_ID}.toggleErrors`,
			title: localize('show errors', "Show Errors"),
			metadata: {
				description: localize2('toggleErrorsDescription', "Show or hide errors in the problems view.")
			},
			category: localize('problems', "Problems"),
			toggled: MarkersContextKeys.ShowErrorsFilterContextKey,
			menu: {
				id: viewFilterSubmenu,
				group: '1_filter',
				when: ContextKeyExpr.equals('view', Markers.MARKERS_VIEW_ID),
				order: 1
			},
			viewId: Markers.MARKERS_VIEW_ID
		});
	}

	async runInView(serviceAccessor: ServicesAccessor, view: IMarkersView): Promise<void> {
		view.filters.showErrors = !view.filters.showErrors;
	}
});

registerAction2(class extends ViewAction<IMarkersView> {
	constructor() {
		super({
			id: `workbench.actions.${Markers.MARKERS_VIEW_ID}.toggleWarnings`,
			title: localize('show warnings', "Show Warnings"),
			metadata: {
				description: localize2('toggleWarningsDescription', "Show or hide warnings in the problems view.")
			},
			category: localize('problems', "Problems"),
			toggled: MarkersContextKeys.ShowWarningsFilterContextKey,
			menu: {
				id: viewFilterSubmenu,
				group: '1_filter',
				when: ContextKeyExpr.equals('view', Markers.MARKERS_VIEW_ID),
				order: 2
			},
			viewId: Markers.MARKERS_VIEW_ID
		});
	}

	async runInView(serviceAccessor: ServicesAccessor, view: IMarkersView): Promise<void> {
		view.filters.showWarnings = !view.filters.showWarnings;
	}
});

registerAction2(class extends ViewAction<IMarkersView> {
	constructor() {
		super({
			id: `workbench.actions.${Markers.MARKERS_VIEW_ID}.toggleInfos`,
			title: localize('show infos', "Show Infos"),
			category: localize('problems', "Problems"),
			toggled: MarkersContextKeys.ShowInfoFilterContextKey,
			metadata: {
				description: localize2('toggleInfosDescription', "Show or hide infos in the problems view.")
			},
			menu: {
				id: viewFilterSubmenu,
				group: '1_filter',
				when: ContextKeyExpr.equals('view', Markers.MARKERS_VIEW_ID),
				order: 3
			},
			viewId: Markers.MARKERS_VIEW_ID
		});
	}

	async runInView(serviceAccessor: ServicesAccessor, view: IMarkersView): Promise<void> {
		view.filters.showInfos = !view.filters.showInfos;
	}
});

registerAction2(class extends ViewAction<IMarkersView> {
	constructor() {
		super({
			id: `workbench.actions.${Markers.MARKERS_VIEW_ID}.toggleActiveFile`,
			title: localize('show active file', "Show Active File Only"),
			metadata: {
				description: localize2('toggleActiveFileDescription', "Show or hide problems (errors, warnings, info) only from the active file in the problems view.")
			},
			category: localize('problems', "Problems"),
			toggled: MarkersContextKeys.ShowActiveFileFilterContextKey,
			menu: {
				id: viewFilterSubmenu,
				group: '2_filter',
				when: ContextKeyExpr.equals('view', Markers.MARKERS_VIEW_ID),
				order: 1
			},
			viewId: Markers.MARKERS_VIEW_ID
		});
	}

	async runInView(serviceAccessor: ServicesAccessor, view: IMarkersView): Promise<void> {
		view.filters.activeFile = !view.filters.activeFile;
	}
});

registerAction2(class extends ViewAction<IMarkersView> {
	constructor() {
		super({
			id: `workbench.actions.${Markers.MARKERS_VIEW_ID}.toggleExcludedFiles`,
			title: localize('show excluded files', "Show Excluded Files"),
			metadata: {
				description: localize2('toggleExcludedFilesDescription', "Show or hide excluded files in the problems view.")
			},
			category: localize('problems', "Problems"),
			toggled: MarkersContextKeys.ShowExcludedFilesFilterContextKey.negate(),
			menu: {
				id: viewFilterSubmenu,
				group: '2_filter',
				when: ContextKeyExpr.equals('view', Markers.MARKERS_VIEW_ID),
				order: 2
			},
			viewId: Markers.MARKERS_VIEW_ID
		});
	}

	async runInView(serviceAccessor: ServicesAccessor, view: IMarkersView): Promise<void> {
		view.filters.excludedFiles = !view.filters.excludedFiles;
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'workbench.action.problems.focus',
			title: Messages.MARKERS_PANEL_SHOW_LABEL,
			category: Categories.View,
			f1: true,
		});
	}
	async run(accessor: ServicesAccessor): Promise<void> {
		accessor.get(IViewsService).openView(Markers.MARKERS_VIEW_ID, true);
	}
});

abstract class MarkersViewAction extends ViewAction<IMarkersView> {

	protected getSelectedMarkers(markersView: IMarkersView): Marker[] {
		const selection = markersView.getFocusedSelectedElements() || markersView.getAllResourceMarkers();
		const markers: Marker[] = [];
		const addMarker = (marker: Marker) => {
			if (!markers.includes(marker)) {
				markers.push(marker);
			}
		};
		for (const selected of selection) {
			if (selected instanceof ResourceMarkers) {
				selected.markers.forEach(addMarker);
			} else if (selected instanceof Marker) {
				addMarker(selected);
			}
		}
		return markers;
	}
}

registerAction2(class extends MarkersViewAction {
	constructor() {
		const when = ContextKeyExpr.and(FocusedViewContext.isEqualTo(Markers.MARKERS_VIEW_ID), MarkersContextKeys.MarkersTreeVisibilityContextKey, MarkersContextKeys.RelatedInformationFocusContextKey.toNegated());
		super({
			id: Markers.MARKER_COPY_ACTION_ID,
			title: localize2('copyMarker', 'Copy'),
			menu: {
				id: MenuId.ProblemsPanelContext,
				when,
				group: 'navigation'
			},
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.CtrlCmd | KeyCode.KeyC,
				when
			},
			viewId: Markers.MARKERS_VIEW_ID
		});
	}
	async runInView(serviceAccessor: ServicesAccessor, markersView: IMarkersView): Promise<void> {
		const clipboardService = serviceAccessor.get(IClipboardService);
		const markers = this.getSelectedMarkers(markersView);
		if (markers.length) {
			await clipboardService.writeText(`[${markers}]`);
		}
	}
});

registerAction2(class extends MarkersViewAction {
	constructor() {
		super({
			id: Markers.MARKER_COPY_MESSAGE_ACTION_ID,
			title: localize2('copyMessage', 'Copy Message'),
			menu: {
				id: MenuId.ProblemsPanelContext,
				when: MarkersContextKeys.MarkerFocusContextKey,
				group: 'navigation'
			},
			viewId: Markers.MARKERS_VIEW_ID
		});
	}
	async runInView(serviceAccessor: ServicesAccessor, markersView: IMarkersView): Promise<void> {
		const clipboardService = serviceAccessor.get(IClipboardService);

		const markers = this.getSelectedMarkers(markersView);
		if (markers.length) {
			await clipboardService.writeText(markers.map(m => m.marker.message).join('\n'));
		}
	}
});

registerAction2(class extends ViewAction<IMarkersView> {
	constructor() {
		super({
			id: Markers.RELATED_INFORMATION_COPY_MESSAGE_ACTION_ID,
			title: localize2('copyMessage', 'Copy Message'),
			menu: {
				id: MenuId.ProblemsPanelContext,
				when: MarkersContextKeys.RelatedInformationFocusContextKey,
				group: 'navigation'
			},
			viewId: Markers.MARKERS_VIEW_ID
		});
	}
	async runInView(serviceAccessor: ServicesAccessor, markersView: IMarkersView): Promise<void> {
		const clipboardService = serviceAccessor.get(IClipboardService);
		const element = markersView.getFocusElement();
		if (element instanceof RelatedInformation) {
			await clipboardService.writeText(element.raw.message);
		}
	}
});

registerAction2(class extends ViewAction<IMarkersView> {
	constructor() {
		super({
			id: Markers.FOCUS_PROBLEMS_FROM_FILTER,
			title: localize('focusProblemsList', "Focus problems view"),
			keybinding: {
				when: MarkersContextKeys.MarkerViewFilterFocusContextKey,
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.CtrlCmd | KeyCode.DownArrow
			},
			viewId: Markers.MARKERS_VIEW_ID
		});
	}
	async runInView(serviceAccessor: ServicesAccessor, markersView: IMarkersView): Promise<void> {
		markersView.focus();
	}
});

registerAction2(class extends ViewAction<IMarkersView> {
	constructor() {
		super({
			id: Markers.MARKERS_VIEW_FOCUS_FILTER,
			title: localize('focusProblemsFilter', "Focus problems filter"),
			keybinding: {
				when: FocusedViewContext.isEqualTo(Markers.MARKERS_VIEW_ID),
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.CtrlCmd | KeyCode.KeyF
			},
			viewId: Markers.MARKERS_VIEW_ID
		});
	}
	async runInView(serviceAccessor: ServicesAccessor, markersView: IMarkersView): Promise<void> {
		markersView.focusFilter();
	}
});

registerAction2(class extends ViewAction<IMarkersView> {
	constructor() {
		super({
			id: Markers.MARKERS_VIEW_SHOW_MULTILINE_MESSAGE,
			title: localize2('show multiline', "Show message in multiple lines"),
			category: localize('problems', "Problems"),
			menu: {
				id: MenuId.CommandPalette,
				when: ContextKeyExpr.has(getVisbileViewContextKey(Markers.MARKERS_VIEW_ID))
			},
			viewId: Markers.MARKERS_VIEW_ID
		});
	}
	async runInView(serviceAccessor: ServicesAccessor, markersView: IMarkersView): Promise<void> {
		markersView.setMultiline(true);
	}
});

registerAction2(class extends ViewAction<IMarkersView> {
	constructor() {
		super({
			id: Markers.MARKERS_VIEW_SHOW_SINGLELINE_MESSAGE,
			title: localize2('show singleline', "Show message in single line"),
			category: localize('problems', "Problems"),
			menu: {
				id: MenuId.CommandPalette,
				when: ContextKeyExpr.has(getVisbileViewContextKey(Markers.MARKERS_VIEW_ID))
			},
			viewId: Markers.MARKERS_VIEW_ID
		});
	}
	async runInView(serviceAccessor: ServicesAccessor, markersView: IMarkersView): Promise<void> {
		markersView.setMultiline(false);
	}
});

registerAction2(class extends ViewAction<IMarkersView> {
	constructor() {
		super({
			id: Markers.MARKERS_VIEW_CLEAR_FILTER_TEXT,
			title: localize('clearFiltersText', "Clear filters text"),
			category: localize('problems', "Problems"),
			keybinding: {
				when: MarkersContextKeys.MarkerViewFilterFocusContextKey,
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyCode.Escape
			},
			viewId: Markers.MARKERS_VIEW_ID
		});
	}
	async runInView(serviceAccessor: ServicesAccessor, markersView: IMarkersView): Promise<void> {
		markersView.clearFilterText();
	}
});

registerAction2(class extends ViewAction<IMarkersView> {
	constructor() {
		super({
			id: `workbench.actions.treeView.${Markers.MARKERS_VIEW_ID}.collapseAll`,
			title: localize('collapseAll', "Collapse All"),
			menu: {
				id: MenuId.ViewTitle,
				when: ContextKeyExpr.and(ContextKeyExpr.equals('view', Markers.MARKERS_VIEW_ID), MarkersContextKeys.MarkersViewModeContextKey.isEqualTo(MarkersViewMode.Tree)),
				group: 'navigation',
				order: 2,
			},
			icon: Codicon.collapseAll,
			viewId: Markers.MARKERS_VIEW_ID
		});
	}
	async runInView(serviceAccessor: ServicesAccessor, view: IMarkersView): Promise<void> {
		return view.collapseAll();
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: Markers.TOGGLE_MARKERS_VIEW_ACTION_ID,
			title: Messages.MARKERS_PANEL_TOGGLE_LABEL,
		});
	}
	async run(accessor: ServicesAccessor): Promise<void> {
		const viewsService = accessor.get(IViewsService);
		if (viewsService.isViewVisible(Markers.MARKERS_VIEW_ID)) {
			viewsService.closeView(Markers.MARKERS_VIEW_ID);
		} else {
			viewsService.openView(Markers.MARKERS_VIEW_ID, true);
		}
	}
});

class MarkersStatusBarContributions extends Disposable implements IWorkbenchContribution {

	private markersStatusItem: IStatusbarEntryAccessor;
	private markersStatusItemOff: IStatusbarEntryAccessor | undefined;

	constructor(
		@IMarkerService private readonly markerService: IMarkerService,
		@IStatusbarService private readonly statusbarService: IStatusbarService,
		@IConfigurationService private readonly configurationService: IConfigurationService
	) {
		super();
		this.markersStatusItem = this._register(this.statusbarService.addEntry(this.getMarkersItem(), 'status.problems', StatusbarAlignment.LEFT, 50 /* Medium Priority */));

		const addStatusBarEntry = () => {
			this.markersStatusItemOff = this.statusbarService.addEntry(this.getMarkersItemTurnedOff(), 'status.problemsVisibility', StatusbarAlignment.LEFT, 49);
		};

		// Add the status bar entry if the problems is not visible
		let config = this.configurationService.getValue('problems.visibility');
		if (!config) {
			addStatusBarEntry();
		}

		this._register(this.markerService.onMarkerChanged(() => {
			this.markersStatusItem.update(this.getMarkersItem());
		}));

		this._register(this.configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('problems.visibility')) {
				this.markersStatusItem.update(this.getMarkersItem());

				// Update based on what setting was changed to.
				config = this.configurationService.getValue('problems.visibility');
				if (!config && !this.markersStatusItemOff) {
					addStatusBarEntry();
				} else if (config && this.markersStatusItemOff) {
					this.markersStatusItemOff.dispose();
					this.markersStatusItemOff = undefined;
				}
			}
		}));
	}

	private getMarkersItem(): IStatusbarEntry {
		const markersStatistics = this.markerService.getStatistics();
		const tooltip = this.getMarkersTooltip(markersStatistics);
		return {
			name: localize('status.problems', "Problems"),
			text: this.getMarkersText(markersStatistics),
			ariaLabel: tooltip,
			tooltip,
			command: 'workbench.actions.view.toggleProblems'
		};
	}

	private getMarkersItemTurnedOff(): IStatusbarEntry {
		// Update to true, config checked before `getMarkersItemTurnedOff` is called.
		this.statusbarService.updateEntryVisibility('status.problemsVisibility', true);
		const openSettingsCommand = 'workbench.action.openSettings';
		const configureSettingsLabel = '@id:problems.visibility';
		const tooltip = localize('status.problemsVisibilityOff', "Problems are turned off. Click to open settings.");
		return {
			name: localize('status.problemsVisibility', "Problems Visibility"),
			text: '$(whole-word)',
			ariaLabel: tooltip,
			tooltip,
			kind: 'warning',
			command: { title: openSettingsCommand, arguments: [configureSettingsLabel], id: openSettingsCommand }
		};
	}

	private getMarkersTooltip(stats: MarkerStatistics): string {
		const errorTitle = (n: number) => localize('totalErrors', "Errors: {0}", n);
		const warningTitle = (n: number) => localize('totalWarnings', "Warnings: {0}", n);
		const infoTitle = (n: number) => localize('totalInfos', "Infos: {0}", n);

		const titles: string[] = [];

		if (stats.errors > 0) {
			titles.push(errorTitle(stats.errors));
		}

		if (stats.warnings > 0) {
			titles.push(warningTitle(stats.warnings));
		}

		if (stats.infos > 0) {
			titles.push(infoTitle(stats.infos));
		}

		if (titles.length === 0) {
			return localize('noProblems', "No Problems");
		}

		return titles.join(', ');
	}

	private getMarkersText(stats: MarkerStatistics): string {
		const problemsText: string[] = [];

		// Errors
		problemsText.push('$(error) ' + this.packNumber(stats.errors));

		// Warnings
		problemsText.push('$(warning) ' + this.packNumber(stats.warnings));

		// Info (only if any)
		if (stats.infos > 0) {
			problemsText.push('$(info) ' + this.packNumber(stats.infos));
		}

		return problemsText.join(' ');
	}

	private packNumber(n: number): string {
		const manyProblems = localize('manyProblems', "10K+");
		return n > 9999 ? manyProblems : n > 999 ? n.toString().charAt(0) + 'K' : n.toString();
	}
}

workbenchRegistry.registerWorkbenchContribution(MarkersStatusBarContributions, LifecyclePhase.Restored);

registerWorkbenchContribution2(MarkerChatContextContribution.ID, MarkerChatContextContribution, WorkbenchPhase.AfterRestored);

class ActivityUpdater extends Disposable implements IWorkbenchContribution {

	private readonly activity = this._register(new MutableDisposable<IDisposable>());

	constructor(
		@IActivityService private readonly activityService: IActivityService,
		@IMarkerService private readonly markerService: IMarkerService
	) {
		super();
		this._register(this.markerService.onMarkerChanged(() => this.updateBadge()));
		this.updateBadge();
	}

	private updateBadge(): void {
		const { errors, warnings, infos } = this.markerService.getStatistics();
		const total = errors + warnings + infos;
		if (total > 0) {
			const message = localize('totalProblems', 'Total {0} Problems', total);
			this.activity.value = this.activityService.showViewActivity(Markers.MARKERS_VIEW_ID, { badge: new NumberBadge(total, () => message) });
		} else {
			this.activity.value = undefined;
		}
	}
}

workbenchRegistry.registerWorkbenchContribution(ActivityUpdater, LifecyclePhase.Restored);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/markers/browser/markers.ts]---
Location: vscode-main/src/vs/workbench/contrib/markers/browser/markers.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { MarkersFilters } from './markersViewActions.js';
import { IView } from '../../../common/views.js';
import { MarkerElement, ResourceMarkers } from './markersModel.js';
import { MarkersViewMode } from '../common/markers.js';

export interface IMarkersView extends IView {

	readonly filters: MarkersFilters;
	focusFilter(): void;
	clearFilterText(): void;
	getFilterStats(): { total: number; filtered: number };

	getFocusElement(): MarkerElement | undefined;
	getFocusedSelectedElements(): MarkerElement[] | null;
	getAllResourceMarkers(): ResourceMarkers[];

	collapseAll(): void;
	setMultiline(multiline: boolean): void;
	setViewMode(viewMode: MarkersViewMode): void;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/markers/browser/markersChatContext.ts]---
Location: vscode-main/src/vs/workbench/contrib/markers/browser/markersChatContext.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


import { groupBy } from '../../../../base/common/arrays.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { extUri } from '../../../../base/common/resources.js';
import { localize } from '../../../../nls.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { IMarkerService, MarkerSeverity } from '../../../../platform/markers/common/markers.js';
import { IQuickPickSeparator } from '../../../../platform/quickinput/common/quickInput.js';
import { EditorResourceAccessor } from '../../../common/editor.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IChatContextPickerItem, IChatContextPickerPickItem, IChatContextPickService, IChatContextPicker, picksWithPromiseFn } from '../../chat/browser/chatContextPickService.js';
import { IDiagnosticVariableEntryFilterData } from '../../chat/common/chatVariableEntries.js';
import { IChatWidget } from '../../chat/browser/chat.js';

class MarkerChatContextPick implements IChatContextPickerItem {

	readonly type = 'pickerPick';
	readonly label = localize('chatContext.diagnstic', 'Problems...');
	readonly icon = Codicon.error;
	readonly ordinal = -100;

	constructor(
		@IMarkerService private readonly _markerService: IMarkerService,
		@ILabelService private readonly _labelService: ILabelService,
		@IEditorService private readonly _editorService: IEditorService,
	) { }

	isEnabled(widget: IChatWidget): Promise<boolean> | boolean {
		return !!widget.attachmentCapabilities.supportsProblemAttachments;
	}
	asPicker(): IChatContextPicker {
		return {
			placeholder: localize('chatContext.diagnstic.placeholder', 'Select a problem to attach'),
			picks: picksWithPromiseFn(async (query: string, token: CancellationToken) => {
				return this.getPicksForQuery(query);
			})
		};
	}

	/**
	 * @internal For testing purposes only
	 */
	getPicksForQuery(query: string): (IChatContextPickerPickItem | IQuickPickSeparator)[] {
		const markers = this._markerService.read({ severities: MarkerSeverity.Error | MarkerSeverity.Warning | MarkerSeverity.Info });
		const grouped = groupBy(markers, (a, b) => extUri.compare(a.resource, b.resource));

		// Get the active editor URI for prioritization
		const activeEditorUri = EditorResourceAccessor.getCanonicalUri(this._editorService.activeEditor);

		// Sort groups to prioritize active file
		const sortedGroups = grouped.sort((groupA, groupB) => {
			const resourceA = groupA[0].resource;
			const resourceB = groupB[0].resource;

			// If one group is from the active file, prioritize it
			if (activeEditorUri) {
				const isAActiveFile = extUri.isEqual(resourceA, activeEditorUri);
				const isBActiveFile = extUri.isEqual(resourceB, activeEditorUri);

				if (isAActiveFile && !isBActiveFile) {
					return -1; // A comes first
				}
				if (!isAActiveFile && isBActiveFile) {
					return 1; // B comes first
				}
			}

			// Otherwise, sort by resource URI as before
			return extUri.compare(resourceA, resourceB);
		});

		const severities = new Set<MarkerSeverity>();
		const items: (IChatContextPickerPickItem | IQuickPickSeparator)[] = [];

		let pickCount = 0;
		for (const group of sortedGroups) {
			const resource = group[0].resource;
			const isActiveFile = activeEditorUri && extUri.isEqual(resource, activeEditorUri);
			const fileLabel = this._labelService.getUriLabel(resource, { relative: true });
			const separatorLabel = isActiveFile ? `${fileLabel} (current file)` : fileLabel;

			items.push({ type: 'separator', label: separatorLabel });
			for (const marker of group) {
				pickCount++;
				severities.add(marker.severity);

				items.push({
					label: marker.message,
					description: localize('markers.panel.at.ln.col.number', "[Ln {0}, Col {1}]", '' + marker.startLineNumber, '' + marker.startColumn),
					asAttachment() {
						return IDiagnosticVariableEntryFilterData.toEntry(IDiagnosticVariableEntryFilterData.fromMarker(marker));
					}
				});
			}
		}

		items.unshift({
			label: localize('markers.panel.allErrors', 'All Problems'),
			asAttachment() {
				return IDiagnosticVariableEntryFilterData.toEntry({
					filterSeverity: MarkerSeverity.Info
				});
			},
		});

		return items;
	}
}


export class MarkerChatContextContribution extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.chat.markerChatContextContribution';

	constructor(
		@IChatContextPickService contextPickService: IChatContextPickService,
		@IInstantiationService instantiationService: IInstantiationService,
	) {
		super();
		this._store.add(contextPickService.registerChatContextItem(instantiationService.createInstance(MarkerChatContextPick)));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/markers/browser/markersFileDecorations.ts]---
Location: vscode-main/src/vs/workbench/contrib/markers/browser/markersFileDecorations.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IWorkbenchContribution, IWorkbenchContributionsRegistry, Extensions as WorkbenchExtensions } from '../../../common/contributions.js';
import { IMarkerService, IMarker, MarkerSeverity } from '../../../../platform/markers/common/markers.js';
import { IDecorationsService, IDecorationsProvider, IDecorationData } from '../../../services/decorations/common/decorations.js';
import { IDisposable, dispose } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { Event } from '../../../../base/common/event.js';
import { localize } from '../../../../nls.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { listErrorForeground, listWarningForeground } from '../../../../platform/theme/common/colorRegistry.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IConfigurationRegistry, Extensions as ConfigurationExtensions } from '../../../../platform/configuration/common/configurationRegistry.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';

class MarkersDecorationsProvider implements IDecorationsProvider {

	readonly label: string = localize('label', "Problems");
	readonly onDidChange: Event<readonly URI[]>;

	constructor(
		private readonly _markerService: IMarkerService
	) {
		this.onDidChange = _markerService.onMarkerChanged;
	}

	provideDecorations(resource: URI): IDecorationData | undefined {
		const markers = this._markerService.read({
			resource,
			severities: MarkerSeverity.Error | MarkerSeverity.Warning
		});
		let first: IMarker | undefined;
		for (const marker of markers) {
			if (!first || marker.severity > first.severity) {
				first = marker;
			}
		}

		if (!first) {
			return undefined;
		}

		return {
			weight: 100 * first.severity,
			bubble: true,
			tooltip: markers.length === 1 ? localize('tooltip.1', "1 problem in this file") : localize('tooltip.N', "{0} problems in this file", markers.length),
			letter: markers.length < 10 ? markers.length.toString() : '9+',
			color: first.severity === MarkerSeverity.Error ? listErrorForeground : listWarningForeground,
		};
	}
}

class MarkersFileDecorations implements IWorkbenchContribution {

	private readonly _disposables: IDisposable[];
	private _provider?: IDisposable;
	private _enabled?: boolean;

	constructor(
		@IMarkerService private readonly _markerService: IMarkerService,
		@IDecorationsService private readonly _decorationsService: IDecorationsService,
		@IConfigurationService private readonly _configurationService: IConfigurationService
	) {
		this._disposables = [
			this._configurationService.onDidChangeConfiguration(e => {
				if (e.affectsConfiguration('problems.visibility')) {
					this._updateEnablement();
				}
			}),
		];
		this._updateEnablement();
	}

	dispose(): void {
		dispose(this._provider);
		dispose(this._disposables);
	}

	private _updateEnablement(): void {
		const problem = this._configurationService.getValue('problems.visibility');
		if (problem === undefined) {
			return;
		}
		const value = this._configurationService.getValue<{ decorations: { enabled: boolean } }>('problems');
		const shouldEnable = (problem && value.decorations.enabled);

		if (shouldEnable === this._enabled) {
			if (!problem || !value.decorations.enabled) {
				this._provider?.dispose();
				this._provider = undefined;
			}
			return;
		}

		this._enabled = shouldEnable as boolean;
		if (this._enabled) {
			const provider = new MarkersDecorationsProvider(this._markerService);
			this._provider = this._decorationsService.registerDecorationsProvider(provider);
		} else if (this._provider) {
			this._provider.dispose();
		}
	}
}

Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration).registerConfiguration({
	'id': 'problems',
	'order': 101,
	'type': 'object',
	'properties': {
		'problems.decorations.enabled': {
			'markdownDescription': localize('markers.showOnFile', "Show Errors & Warnings on files and folder. Overwritten by {0} when it is off.", '`#problems.visibility#`'),
			'type': 'boolean',
			'default': true
		}
	}
});

// register file decorations
Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench)
	.registerWorkbenchContribution(MarkersFileDecorations, LifecyclePhase.Restored);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/markers/browser/markersFilterOptions.ts]---
Location: vscode-main/src/vs/workbench/contrib/markers/browser/markersFilterOptions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IFilter, matchesFuzzy, matchesFuzzy2 } from '../../../../base/common/filters.js';
import { IExpression, splitGlobAware, getEmptyExpression, ParsedExpression, parse } from '../../../../base/common/glob.js';
import * as strings from '../../../../base/common/strings.js';
import { URI } from '../../../../base/common/uri.js';
import { relativePath } from '../../../../base/common/resources.js';
import { TernarySearchTree } from '../../../../base/common/ternarySearchTree.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';

const SOURCE_FILTER_REGEX = /(!)?@source:("[^"]*"|[^\s,]+)(\s*)/i;

export class ResourceGlobMatcher {

	private readonly globalExpression: ParsedExpression;
	private readonly expressionsByRoot: TernarySearchTree<URI, { root: URI; expression: ParsedExpression }>;

	constructor(
		globalExpression: IExpression,
		rootExpressions: { root: URI; expression: IExpression }[],
		uriIdentityService: IUriIdentityService
	) {
		this.globalExpression = parse(globalExpression);
		this.expressionsByRoot = TernarySearchTree.forUris<{ root: URI; expression: ParsedExpression }>(uri => uriIdentityService.extUri.ignorePathCasing(uri));
		for (const expression of rootExpressions) {
			this.expressionsByRoot.set(expression.root, { root: expression.root, expression: parse(expression.expression) });
		}
	}

	matches(resource: URI): boolean {
		const rootExpression = this.expressionsByRoot.findSubstr(resource);
		if (rootExpression) {
			const path = relativePath(rootExpression.root, resource);
			if (path && !!rootExpression.expression(path)) {
				return true;
			}
		}
		return !!this.globalExpression(resource.path);
	}
}

export class FilterOptions {

	static readonly _filter: IFilter = matchesFuzzy2;
	static readonly _messageFilter: IFilter = matchesFuzzy;

	readonly showWarnings: boolean = false;
	readonly showErrors: boolean = false;
	readonly showInfos: boolean = false;
	readonly textFilter: { readonly text: string; readonly negate: boolean };
	readonly excludesMatcher: ResourceGlobMatcher;
	readonly includesMatcher: ResourceGlobMatcher;

	readonly includeSourceFilters: string[];
	readonly excludeSourceFilters: string[];

	static EMPTY(uriIdentityService: IUriIdentityService) { return new FilterOptions('', [], false, false, false, uriIdentityService); }

	constructor(
		readonly filter: string,
		filesExclude: { root: URI; expression: IExpression }[] | IExpression,
		showWarnings: boolean,
		showErrors: boolean,
		showInfos: boolean,
		uriIdentityService: IUriIdentityService
	) {
		filter = filter.trim();
		this.showWarnings = showWarnings;
		this.showErrors = showErrors;
		this.showInfos = showInfos;

		const filesExcludeByRoot = Array.isArray(filesExclude) ? filesExclude : [];
		const excludesExpression: IExpression = Array.isArray(filesExclude) ? getEmptyExpression() : filesExclude;

		for (const { expression } of filesExcludeByRoot) {
			for (const pattern of Object.keys(expression)) {
				if (!pattern.endsWith('/**')) {
					// Append `/**` to pattern to match a parent folder #103631
					expression[`${strings.rtrim(pattern, '/')}/**`] = expression[pattern];
				}
			}
		}

		const includeSourceFilters: string[] = [];
		const excludeSourceFilters: string[] = [];
		let sourceMatch;
		while ((sourceMatch = SOURCE_FILTER_REGEX.exec(filter)) !== null) {
			const negate = !!sourceMatch[1];
			let source = sourceMatch[2];
			// Remove quotes if present
			if (source.startsWith('"') && source.endsWith('"')) {
				source = source.slice(1, -1);
			}
			if (negate) {
				excludeSourceFilters.push(source.toLowerCase());
			} else {
				includeSourceFilters.push(source.toLowerCase());
			}
			// Remove the entire match (including trailing whitespace)
			filter = (filter.substring(0, sourceMatch.index) + filter.substring(sourceMatch.index + sourceMatch[0].length)).trim();
		}
		this.includeSourceFilters = includeSourceFilters;
		this.excludeSourceFilters = excludeSourceFilters;

		const negate = filter.startsWith('!');
		this.textFilter = { text: (negate ? strings.ltrim(filter, '!') : filter).trim(), negate };
		const includeExpression: IExpression = getEmptyExpression();

		if (filter) {
			const filters = splitGlobAware(filter, ',').map(s => s.trim()).filter(s => !!s.length);
			for (const f of filters) {
				if (f.startsWith('!')) {
					const filterText = strings.ltrim(f, '!');
					if (filterText) {
						this.setPattern(excludesExpression, filterText);
					}
				} else {
					this.setPattern(includeExpression, f);
				}
			}
		}

		this.excludesMatcher = new ResourceGlobMatcher(excludesExpression, filesExcludeByRoot, uriIdentityService);
		this.includesMatcher = new ResourceGlobMatcher(includeExpression, [], uriIdentityService);
	}

	matchesSourceFilters(markerSource: string | undefined): boolean {
		if (this.includeSourceFilters.length === 0 && this.excludeSourceFilters.length === 0) {
			return true;
		}

		const source = markerSource?.toLowerCase();

		// Check negative filters first - if any match, exclude
		if (source && this.excludeSourceFilters.includes(source)) {
			return false;
		}

		// If there are positive filters, check if any match
		if (this.includeSourceFilters.length > 0) {
			return source ? this.includeSourceFilters.includes(source) : false;
		}

		return true;
	}

	private setPattern(expression: IExpression, pattern: string) {
		if (pattern[0] === '.') {
			pattern = '*' + pattern; // convert ".js" to "*.js"
		}
		expression[`**/${pattern}/**`] = true;
		expression[`**/${pattern}`] = true;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/markers/browser/markersModel.ts]---
Location: vscode-main/src/vs/workbench/contrib/markers/browser/markersModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isNonEmptyArray } from '../../../../base/common/arrays.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { IMatch } from '../../../../base/common/filters.js';
import { hash } from '../../../../base/common/hash.js';
import { ResourceMap } from '../../../../base/common/map.js';
import { basename, extUri } from '../../../../base/common/resources.js';
import { splitLines } from '../../../../base/common/strings.js';
import { URI } from '../../../../base/common/uri.js';
import { IRange, Range } from '../../../../editor/common/core/range.js';
import { IMarker, IMarkerData, IRelatedInformation, MarkerSeverity } from '../../../../platform/markers/common/markers.js';
import { unsupportedSchemas } from '../../../../platform/markers/common/markerService.js';

export type MarkerElement = ResourceMarkers | Marker | RelatedInformation;

export function compareMarkersByUri(a: IMarker, b: IMarker) {
	return extUri.compare(a.resource, b.resource);
}

function compareResourceMarkers(a: ResourceMarkers, b: ResourceMarkers): number {
	const [firstMarkerOfA] = a.markers;
	const [firstMarkerOfB] = b.markers;
	let res = 0;
	if (firstMarkerOfA && firstMarkerOfB) {
		res = MarkerSeverity.compare(firstMarkerOfA.marker.severity, firstMarkerOfB.marker.severity);
	}
	if (res === 0) {
		res = a.path.localeCompare(b.path) || a.name.localeCompare(b.name);
	}
	return res;
}


export class ResourceMarkers {

	readonly path: string;

	readonly name: string;

	private _markersMap = new ResourceMap<Marker[]>();
	private _cachedMarkers: Marker[] | undefined;
	private _total: number = 0;

	constructor(readonly id: string, readonly resource: URI) {
		this.path = this.resource.fsPath;
		this.name = basename(this.resource);
	}

	get markers(): readonly Marker[] {
		if (!this._cachedMarkers) {
			this._cachedMarkers = [...this._markersMap.values()].flat().sort(ResourceMarkers._compareMarkers);
		}
		return this._cachedMarkers;
	}

	has(uri: URI) {
		return this._markersMap.has(uri);
	}

	set(uri: URI, marker: Marker[]) {
		this.delete(uri);
		if (isNonEmptyArray(marker)) {
			this._markersMap.set(uri, marker);
			this._total += marker.length;
			this._cachedMarkers = undefined;
		}
	}

	delete(uri: URI) {
		const array = this._markersMap.get(uri);
		if (array) {
			this._total -= array.length;
			this._cachedMarkers = undefined;
			this._markersMap.delete(uri);
		}
	}

	get total() {
		return this._total;
	}

	private static _compareMarkers(a: Marker, b: Marker): number {
		return MarkerSeverity.compare(a.marker.severity, b.marker.severity)
			|| extUri.compare(a.resource, b.resource)
			|| Range.compareRangesUsingStarts(a.marker, b.marker);
	}
}

export class Marker {

	get resource(): URI { return this.marker.resource; }
	get range(): IRange { return this.marker; }

	private _lines: string[] | undefined;
	get lines(): string[] {
		if (!this._lines) {
			this._lines = splitLines(this.marker.message);
		}
		return this._lines;
	}

	constructor(
		readonly id: string,
		readonly marker: IMarker,
		readonly relatedInformation: RelatedInformation[] = []
	) { }

	toString(): string {
		return JSON.stringify({
			...this.marker,
			resource: this.marker.resource.path,
			relatedInformation: this.relatedInformation.length ? this.relatedInformation.map(r => ({ ...r.raw, resource: r.raw.resource.path })) : undefined
		}, null, '\t');
	}
}

export class MarkerTableItem extends Marker {
	constructor(
		marker: Marker,
		readonly sourceMatches?: IMatch[],
		readonly codeMatches?: IMatch[],
		readonly messageMatches?: IMatch[],
		readonly fileMatches?: IMatch[]
	) {
		super(marker.id, marker.marker, marker.relatedInformation);
	}
}

export class RelatedInformation {

	constructor(
		readonly id: string,
		readonly marker: IMarker,
		readonly raw: IRelatedInformation
	) { }
}

export interface MarkerChangesEvent {
	readonly added: Set<ResourceMarkers>;
	readonly removed: Set<ResourceMarkers>;
	readonly updated: Set<ResourceMarkers>;
}

export class MarkersModel {

	private cachedSortedResources: ResourceMarkers[] | undefined = undefined;

	private readonly _onDidChange = new Emitter<MarkerChangesEvent>();
	readonly onDidChange: Event<MarkerChangesEvent> = this._onDidChange.event;

	get resourceMarkers(): ResourceMarkers[] {
		if (!this.cachedSortedResources) {
			this.cachedSortedResources = [...this.resourcesByUri.values()].sort(compareResourceMarkers);
		}
		return this.cachedSortedResources;
	}

	private resourcesByUri: Map<string, ResourceMarkers>;

	constructor() {
		this.resourcesByUri = new Map<string, ResourceMarkers>();
	}

	reset(): void {
		const removed = new Set<ResourceMarkers>();
		for (const resourceMarker of this.resourcesByUri.values()) {
			removed.add(resourceMarker);
		}
		this.resourcesByUri.clear();
		this._total = 0;
		this._onDidChange.fire({ removed, added: new Set<ResourceMarkers>(), updated: new Set<ResourceMarkers>() });
	}

	private _total: number = 0;
	get total(): number {
		return this._total;
	}

	getResourceMarkers(resource: URI): ResourceMarkers | null {
		return this.resourcesByUri.get(extUri.getComparisonKey(resource, true)) ?? null;
	}

	setResourceMarkers(resourcesMarkers: [URI, IMarker[]][]): void {
		const change: MarkerChangesEvent = { added: new Set(), removed: new Set(), updated: new Set() };
		for (const [resource, rawMarkers] of resourcesMarkers) {

			if (unsupportedSchemas.has(resource.scheme)) {
				continue;
			}

			const key = extUri.getComparisonKey(resource, true);
			let resourceMarkers = this.resourcesByUri.get(key);

			if (isNonEmptyArray(rawMarkers)) {
				// update, add
				if (!resourceMarkers) {
					const resourceMarkersId = this.id(resource.toString());
					resourceMarkers = new ResourceMarkers(resourceMarkersId, resource.with({ fragment: null }));
					this.resourcesByUri.set(key, resourceMarkers);
					change.added.add(resourceMarkers);
				} else {
					change.updated.add(resourceMarkers);
				}
				const markersCountByKey = new Map<string, number>();
				const markers = rawMarkers.map((rawMarker) => {
					const key = IMarkerData.makeKey(rawMarker);
					const index = markersCountByKey.get(key) || 0;
					markersCountByKey.set(key, index + 1);

					const markerId = this.id(resourceMarkers!.id, key, index, rawMarker.resource.toString());

					let relatedInformation: RelatedInformation[] | undefined = undefined;
					if (rawMarker.relatedInformation) {
						relatedInformation = rawMarker.relatedInformation.map((r, index) => new RelatedInformation(this.id(markerId, r.resource.toString(), r.startLineNumber, r.startColumn, r.endLineNumber, r.endColumn, index), rawMarker, r));
					}

					return new Marker(markerId, rawMarker, relatedInformation);
				});

				this._total -= resourceMarkers.total;
				resourceMarkers.set(resource, markers);
				this._total += resourceMarkers.total;

			} else if (resourceMarkers) {
				// clear
				this._total -= resourceMarkers.total;
				resourceMarkers.delete(resource);
				this._total += resourceMarkers.total;
				if (resourceMarkers.total === 0) {
					this.resourcesByUri.delete(key);
					change.removed.add(resourceMarkers);
				} else {
					change.updated.add(resourceMarkers);
				}
			}
		}

		this.cachedSortedResources = undefined;
		if (change.added.size || change.removed.size || change.updated.size) {
			this._onDidChange.fire(change);
		}
	}

	private id(...values: (string | number)[]): string {
		return `${hash(values)}`;
	}

	dispose(): void {
		this._onDidChange.dispose();
		this.resourcesByUri.clear();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/markers/browser/markersTable.ts]---
Location: vscode-main/src/vs/workbench/contrib/markers/browser/markersTable.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import * as DOM from '../../../../base/browser/dom.js';
import { Event } from '../../../../base/common/event.js';
import { ITableContextMenuEvent, ITableEvent, ITableRenderer, ITableVirtualDelegate } from '../../../../base/browser/ui/table/table.js';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IOpenEvent, IWorkbenchTableOptions, WorkbenchTable } from '../../../../platform/list/browser/listService.js';
import { HighlightedLabel } from '../../../../base/browser/ui/highlightedlabel/highlightedLabel.js';
import { compareMarkersByUri, Marker, MarkerTableItem, ResourceMarkers } from './markersModel.js';
import { MarkerSeverity } from '../../../../platform/markers/common/markers.js';
import { SeverityIcon } from '../../../../base/browser/ui/severityIcon/severityIcon.js';
import { ActionBar } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { FilterOptions } from './markersFilterOptions.js';
import { Link } from '../../../../platform/opener/browser/link.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { MarkersViewModel } from './markersTreeViewer.js';
import { IAction } from '../../../../base/common/actions.js';
import { QuickFixAction, QuickFixActionViewItem } from './markersViewActions.js';
import { DomEmitter } from '../../../../base/browser/event.js';
import Messages from './messages.js';
import { isUndefinedOrNull } from '../../../../base/common/types.js';
import { IProblemsWidget } from './markersView.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { Range } from '../../../../editor/common/core/range.js';
import { unsupportedSchemas } from '../../../../platform/markers/common/markerService.js';
import Severity from '../../../../base/common/severity.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';

const $ = DOM.$;

interface IMarkerIconColumnTemplateData {
	readonly icon: HTMLElement;
	readonly actionBar: ActionBar;
}

interface IMarkerCodeColumnTemplateData {
	readonly codeColumn: HTMLElement;
	readonly sourceLabel: HighlightedLabel;
	readonly codeLabel: HighlightedLabel;
	readonly codeLink: Link;
	readonly templateDisposable: DisposableStore;
}

interface IMarkerFileColumnTemplateData {
	readonly columnElement: HTMLElement;
	readonly fileLabel: HighlightedLabel;
	readonly positionLabel: HighlightedLabel;
}


interface IMarkerHighlightedLabelColumnTemplateData {
	readonly columnElement: HTMLElement;
	readonly highlightedLabel: HighlightedLabel;
}

class MarkerSeverityColumnRenderer implements ITableRenderer<MarkerTableItem, IMarkerIconColumnTemplateData> {

	static readonly TEMPLATE_ID = 'severity';

	readonly templateId: string = MarkerSeverityColumnRenderer.TEMPLATE_ID;

	constructor(
		private readonly markersViewModel: MarkersViewModel,
		@IInstantiationService private readonly instantiationService: IInstantiationService
	) { }

	renderTemplate(container: HTMLElement): IMarkerIconColumnTemplateData {
		const severityColumn = DOM.append(container, $('.severity'));
		const icon = DOM.append(severityColumn, $(''));

		const actionBarColumn = DOM.append(container, $('.actions'));
		const actionBar = new ActionBar(actionBarColumn, {
			actionViewItemProvider: (action: IAction, options) => action.id === QuickFixAction.ID ? this.instantiationService.createInstance(QuickFixActionViewItem, <QuickFixAction>action, options) : undefined
		});

		return { actionBar, icon };
	}

	renderElement(element: MarkerTableItem, index: number, templateData: IMarkerIconColumnTemplateData): void {
		const toggleQuickFix = (enabled?: boolean) => {
			if (!isUndefinedOrNull(enabled)) {
				const container = DOM.findParentWithClass(templateData.icon, 'monaco-table-td')!;
				container.classList.toggle('quickFix', enabled);
			}
		};

		templateData.icon.title = MarkerSeverity.toString(element.marker.severity);
		templateData.icon.className = `marker-icon ${Severity.toString(MarkerSeverity.toSeverity(element.marker.severity))} codicon ${SeverityIcon.className(MarkerSeverity.toSeverity(element.marker.severity))}`;

		templateData.actionBar.clear();
		const viewModel = this.markersViewModel.getViewModel(element);
		if (viewModel) {
			const quickFixAction = viewModel.quickFixAction;
			templateData.actionBar.push([quickFixAction], { icon: true, label: false });
			toggleQuickFix(viewModel.quickFixAction.enabled);

			quickFixAction.onDidChange(({ enabled }) => toggleQuickFix(enabled));
			quickFixAction.onShowQuickFixes(() => {
				const quickFixActionViewItem = <QuickFixActionViewItem>templateData.actionBar.viewItems[0];
				if (quickFixActionViewItem) {
					quickFixActionViewItem.showQuickFixes();
				}
			});
		}
	}

	disposeTemplate(templateData: IMarkerIconColumnTemplateData): void { }
}

class MarkerCodeColumnRenderer implements ITableRenderer<MarkerTableItem, IMarkerCodeColumnTemplateData> {
	static readonly TEMPLATE_ID = 'code';

	readonly templateId: string = MarkerCodeColumnRenderer.TEMPLATE_ID;

	constructor(
		@IHoverService private readonly hoverService: IHoverService,
		@IOpenerService private readonly openerService: IOpenerService
	) { }

	renderTemplate(container: HTMLElement): IMarkerCodeColumnTemplateData {
		const templateDisposable = new DisposableStore();
		const codeColumn = DOM.append(container, $('.code'));

		const sourceLabel = templateDisposable.add(new HighlightedLabel(codeColumn));
		sourceLabel.element.classList.add('source-label');

		const codeLabel = templateDisposable.add(new HighlightedLabel(codeColumn));
		codeLabel.element.classList.add('code-label');

		const codeLink = templateDisposable.add(new Link(codeColumn, { href: '', label: '' }, {}, this.hoverService, this.openerService));

		return { codeColumn, sourceLabel, codeLabel, codeLink, templateDisposable };
	}

	renderElement(element: MarkerTableItem, index: number, templateData: IMarkerCodeColumnTemplateData): void {
		templateData.codeColumn.classList.remove('code-label');
		templateData.codeColumn.classList.remove('code-link');

		if (element.marker.source && element.marker.code) {
			if (typeof element.marker.code === 'string') {
				templateData.codeColumn.classList.add('code-label');
				templateData.codeColumn.title = `${element.marker.source} (${element.marker.code})`;
				templateData.sourceLabel.set(element.marker.source, element.sourceMatches);
				templateData.codeLabel.set(element.marker.code, element.codeMatches);
			} else {
				templateData.codeColumn.classList.add('code-link');
				templateData.codeColumn.title = `${element.marker.source} (${element.marker.code.value})`;
				templateData.sourceLabel.set(element.marker.source, element.sourceMatches);

				const codeLinkLabel = templateData.templateDisposable.add(new HighlightedLabel($('.code-link-label')));
				codeLinkLabel.set(element.marker.code.value, element.codeMatches);

				templateData.codeLink.link = {
					href: element.marker.code.target.toString(true),
					title: element.marker.code.target.toString(true),
					label: codeLinkLabel.element,
				};
			}
		} else {
			templateData.codeColumn.title = '';
			templateData.sourceLabel.set('-');
		}
	}

	disposeTemplate(templateData: IMarkerCodeColumnTemplateData): void {
		templateData.templateDisposable.dispose();
	}
}

class MarkerMessageColumnRenderer implements ITableRenderer<MarkerTableItem, IMarkerHighlightedLabelColumnTemplateData> {

	static readonly TEMPLATE_ID = 'message';

	readonly templateId: string = MarkerMessageColumnRenderer.TEMPLATE_ID;

	renderTemplate(container: HTMLElement): IMarkerHighlightedLabelColumnTemplateData {
		const columnElement = DOM.append(container, $('.message'));
		const highlightedLabel = new HighlightedLabel(columnElement);

		return { columnElement, highlightedLabel };
	}

	renderElement(element: MarkerTableItem, index: number, templateData: IMarkerHighlightedLabelColumnTemplateData): void {
		templateData.columnElement.title = element.marker.message;
		templateData.highlightedLabel.set(element.marker.message, element.messageMatches);
	}

	disposeTemplate(templateData: IMarkerHighlightedLabelColumnTemplateData): void {
		templateData.highlightedLabel.dispose();
	}
}

class MarkerFileColumnRenderer implements ITableRenderer<MarkerTableItem, IMarkerFileColumnTemplateData> {

	static readonly TEMPLATE_ID = 'file';

	readonly templateId: string = MarkerFileColumnRenderer.TEMPLATE_ID;

	constructor(
		@ILabelService private readonly labelService: ILabelService
	) { }

	renderTemplate(container: HTMLElement): IMarkerFileColumnTemplateData {
		const columnElement = DOM.append(container, $('.file'));
		const fileLabel = new HighlightedLabel(columnElement);
		fileLabel.element.classList.add('file-label');
		const positionLabel = new HighlightedLabel(columnElement);
		positionLabel.element.classList.add('file-position');

		return { columnElement, fileLabel, positionLabel };
	}

	renderElement(element: MarkerTableItem, index: number, templateData: IMarkerFileColumnTemplateData): void {
		const positionLabel = Messages.MARKERS_PANEL_AT_LINE_COL_NUMBER(element.marker.startLineNumber, element.marker.startColumn);

		templateData.columnElement.title = `${this.labelService.getUriLabel(element.marker.resource, { relative: false })} ${positionLabel}`;
		templateData.fileLabel.set(this.labelService.getUriLabel(element.marker.resource, { relative: true }), element.fileMatches);
		templateData.positionLabel.set(positionLabel, undefined);
	}

	disposeTemplate(templateData: IMarkerFileColumnTemplateData): void {
		templateData.fileLabel.dispose();
		templateData.positionLabel.dispose();
	}
}

class MarkerSourceColumnRenderer implements ITableRenderer<MarkerTableItem, IMarkerHighlightedLabelColumnTemplateData> {

	static readonly TEMPLATE_ID = 'source';

	readonly templateId: string = MarkerSourceColumnRenderer.TEMPLATE_ID;

	renderTemplate(container: HTMLElement): IMarkerHighlightedLabelColumnTemplateData {
		const columnElement = DOM.append(container, $('.source'));
		const highlightedLabel = new HighlightedLabel(columnElement);
		return { columnElement, highlightedLabel };
	}

	renderElement(element: MarkerTableItem, index: number, templateData: IMarkerHighlightedLabelColumnTemplateData): void {
		templateData.columnElement.title = element.marker.source ?? '';
		templateData.highlightedLabel.set(element.marker.source ?? '', element.sourceMatches);
	}

	disposeTemplate(templateData: IMarkerHighlightedLabelColumnTemplateData): void {
		templateData.highlightedLabel.dispose();
	}
}

class MarkersTableVirtualDelegate implements ITableVirtualDelegate<MarkerTableItem> {
	static readonly HEADER_ROW_HEIGHT = 24;
	static readonly ROW_HEIGHT = 24;
	readonly headerRowHeight = MarkersTableVirtualDelegate.HEADER_ROW_HEIGHT;

	getHeight(item: MarkerTableItem) {
		return MarkersTableVirtualDelegate.ROW_HEIGHT;
	}
}

export class MarkersTable extends Disposable implements IProblemsWidget {

	private _itemCount: number = 0;
	private readonly table: WorkbenchTable<MarkerTableItem>;

	constructor(
		private readonly container: HTMLElement,
		private readonly markersViewModel: MarkersViewModel,
		private resourceMarkers: ResourceMarkers[],
		private filterOptions: FilterOptions,
		options: IWorkbenchTableOptions<MarkerTableItem>,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@ILabelService private readonly labelService: ILabelService,
	) {
		super();

		this.table = this.instantiationService.createInstance(WorkbenchTable,
			'Markers',
			this.container,
			new MarkersTableVirtualDelegate(),
			[
				{
					label: '',
					tooltip: '',
					weight: 0,
					minimumWidth: 36,
					maximumWidth: 36,
					templateId: MarkerSeverityColumnRenderer.TEMPLATE_ID,
					project(row: Marker): Marker { return row; }
				},
				{
					label: localize('codeColumnLabel', "Code"),
					tooltip: '',
					weight: 1,
					minimumWidth: 100,
					maximumWidth: 300,
					templateId: MarkerCodeColumnRenderer.TEMPLATE_ID,
					project(row: Marker): Marker { return row; }
				},
				{
					label: localize('messageColumnLabel', "Message"),
					tooltip: '',
					weight: 4,
					templateId: MarkerMessageColumnRenderer.TEMPLATE_ID,
					project(row: Marker): Marker { return row; }
				},
				{
					label: localize('fileColumnLabel', "File"),
					tooltip: '',
					weight: 2,
					templateId: MarkerFileColumnRenderer.TEMPLATE_ID,
					project(row: Marker): Marker { return row; }
				},
				{
					label: localize('sourceColumnLabel', "Source"),
					tooltip: '',
					weight: 1,
					minimumWidth: 100,
					maximumWidth: 300,
					templateId: MarkerSourceColumnRenderer.TEMPLATE_ID,
					project(row: Marker): Marker { return row; }
				}
			],
			[
				this.instantiationService.createInstance(MarkerSeverityColumnRenderer, this.markersViewModel),
				this.instantiationService.createInstance(MarkerCodeColumnRenderer),
				this.instantiationService.createInstance(MarkerMessageColumnRenderer),
				this.instantiationService.createInstance(MarkerFileColumnRenderer),
				this.instantiationService.createInstance(MarkerSourceColumnRenderer),
			],
			options
		) as WorkbenchTable<MarkerTableItem>;

		// eslint-disable-next-line no-restricted-syntax
		const list = this.table.domNode.querySelector('.monaco-list-rows')! as HTMLElement;

		// mouseover/mouseleave event handlers
		const onRowHover = Event.chain(this._register(new DomEmitter(list, 'mouseover')).event, $ =>
			$.map(e => DOM.findParentWithClass(e.target as HTMLElement, 'monaco-list-row', 'monaco-list-rows'))
				.filter<HTMLElement>(e => !!e)
				.map(e => parseInt(e.getAttribute('data-index')!))
		);

		const onListLeave = Event.map(this._register(new DomEmitter(list, 'mouseleave')).event, () => -1);

		const onRowHoverOrLeave = Event.latch(Event.any(onRowHover, onListLeave));
		const onRowPermanentHover = Event.debounce(onRowHoverOrLeave, (_, e) => e, 500);

		this._register(onRowPermanentHover(e => {
			if (e !== -1 && this.table.row(e)) {
				this.markersViewModel.onMarkerMouseHover(this.table.row(e));
			}
		}));
	}

	get contextKeyService(): IContextKeyService {
		return this.table.contextKeyService;
	}

	get onContextMenu(): Event<ITableContextMenuEvent<MarkerTableItem>> {
		return this.table.onContextMenu;
	}

	get onDidOpen(): Event<IOpenEvent<MarkerTableItem | undefined>> {
		return this.table.onDidOpen;
	}

	get onDidChangeFocus(): Event<ITableEvent<MarkerTableItem>> {
		return this.table.onDidChangeFocus;
	}

	get onDidChangeSelection(): Event<ITableEvent<MarkerTableItem>> {
		return this.table.onDidChangeSelection;
	}

	collapseMarkers(): void { }

	domFocus(): void {
		this.table.domFocus();
	}

	filterMarkers(resourceMarkers: ResourceMarkers[], filterOptions: FilterOptions): void {
		this.filterOptions = filterOptions;
		this.reset(resourceMarkers);
	}

	getFocus(): (MarkerTableItem | null)[] {
		const focus = this.table.getFocus();
		return focus.length > 0 ? [...focus.map(f => this.table.row(f))] : [];
	}

	getHTMLElement(): HTMLElement {
		return this.table.getHTMLElement();
	}

	getRelativeTop(marker: MarkerTableItem | null): number | null {
		return marker ? this.table.getRelativeTop(this.table.indexOf(marker)) : null;
	}

	getSelection(): (MarkerTableItem | null)[] {
		const selection = this.table.getSelection();
		return selection.length > 0 ? [...selection.map(i => this.table.row(i))] : [];
	}

	getVisibleItemCount(): number {
		return this._itemCount;
	}

	isVisible(): boolean {
		return !this.container.classList.contains('hidden');
	}

	layout(height: number, width: number): void {
		this.container.style.height = `${height}px`;
		this.table.layout(height, width);
	}

	reset(resourceMarkers: ResourceMarkers[]): void {
		this.resourceMarkers = resourceMarkers;

		const items: MarkerTableItem[] = [];
		for (const resourceMarker of this.resourceMarkers) {
			for (const marker of resourceMarker.markers) {
				if (unsupportedSchemas.has(marker.resource.scheme)) {
					continue;
				}

				// Exclude pattern
				if (this.filterOptions.excludesMatcher.matches(marker.resource)) {
					continue;
				}

				// Include pattern
				if (this.filterOptions.includesMatcher.matches(marker.resource)) {
					items.push(new MarkerTableItem(marker));
					continue;
				}

				// Severity filter
				const matchesSeverity = this.filterOptions.showErrors && MarkerSeverity.Error === marker.marker.severity ||
					this.filterOptions.showWarnings && MarkerSeverity.Warning === marker.marker.severity ||
					this.filterOptions.showInfos && MarkerSeverity.Info === marker.marker.severity;

				if (!matchesSeverity) {
					continue;
				}

				// Source filters
				if (!this.filterOptions.matchesSourceFilters(marker.marker.source)) {
					continue;
				}

				// Text filter
				if (this.filterOptions.textFilter.text) {
					const sourceMatches = marker.marker.source ? FilterOptions._filter(this.filterOptions.textFilter.text, marker.marker.source) ?? undefined : undefined;
					const codeMatches = marker.marker.code ? FilterOptions._filter(this.filterOptions.textFilter.text, typeof marker.marker.code === 'string' ? marker.marker.code : marker.marker.code.value) ?? undefined : undefined;
					const messageMatches = FilterOptions._messageFilter(this.filterOptions.textFilter.text, marker.marker.message) ?? undefined;
					const fileMatches = FilterOptions._messageFilter(this.filterOptions.textFilter.text, this.labelService.getUriLabel(marker.resource, { relative: true })) ?? undefined;

					const matched = sourceMatches || codeMatches || messageMatches || fileMatches;
					if ((matched && !this.filterOptions.textFilter.negate) || (!matched && this.filterOptions.textFilter.negate)) {
						items.push(new MarkerTableItem(marker, sourceMatches, codeMatches, messageMatches, fileMatches));
					}

					continue;
				}

				items.push(new MarkerTableItem(marker));
			}
		}
		this._itemCount = items.length;
		this.table.splice(0, Number.POSITIVE_INFINITY, items.sort((a, b) => {
			let result = MarkerSeverity.compare(a.marker.severity, b.marker.severity);

			if (result === 0) {
				result = compareMarkersByUri(a.marker, b.marker);
			}

			if (result === 0) {
				result = Range.compareRangesUsingStarts(a.marker, b.marker);
			}

			return result;
		}));
	}

	revealMarkers(activeResource: ResourceMarkers | null, focus: boolean, lastSelectedRelativeTop: number): void {
		if (activeResource) {
			const activeResourceIndex = this.resourceMarkers.indexOf(activeResource);

			if (activeResourceIndex !== -1) {
				if (this.hasSelectedMarkerFor(activeResource)) {
					const tableSelection = this.table.getSelection();
					this.table.reveal(tableSelection[0], lastSelectedRelativeTop);

					if (focus) {
						this.table.setFocus(tableSelection);
					}
				} else {
					this.table.reveal(activeResourceIndex, 0);

					if (focus) {
						this.table.setFocus([activeResourceIndex]);
						this.table.setSelection([activeResourceIndex]);
					}
				}
			}
		} else if (focus) {
			this.table.setSelection([]);
			this.table.focusFirst();
		}
	}

	setAriaLabel(label: string): void {
		this.table.domNode.ariaLabel = label;
	}

	setMarkerSelection(selection?: Marker[], focus?: Marker[]): void {
		if (this.isVisible()) {
			if (selection && selection.length > 0) {
				this.table.setSelection(selection.map(m => this.findMarkerIndex(m)));

				if (focus && focus.length > 0) {
					this.table.setFocus(focus.map(f => this.findMarkerIndex(f)));
				} else {
					this.table.setFocus([this.findMarkerIndex(selection[0])]);
				}

				this.table.reveal(this.findMarkerIndex(selection[0]));
			} else if (this.getSelection().length === 0 && this.getVisibleItemCount() > 0) {
				this.table.setSelection([0]);
				this.table.setFocus([0]);
				this.table.reveal(0);
			}
		}
	}

	toggleVisibility(hide: boolean): void {
		this.container.classList.toggle('hidden', hide);
	}

	update(resourceMarkers: ResourceMarkers[]): void {
		for (const resourceMarker of resourceMarkers) {
			const index = this.resourceMarkers.indexOf(resourceMarker);
			this.resourceMarkers.splice(index, 1, resourceMarker);
		}
		this.reset(this.resourceMarkers);
	}

	updateMarker(marker: Marker): void {
		this.table.rerender();
	}

	private findMarkerIndex(marker: Marker): number {
		for (let index = 0; index < this.table.length; index++) {
			if (this.table.row(index).marker === marker.marker) {
				return index;
			}
		}

		return -1;
	}

	private hasSelectedMarkerFor(resource: ResourceMarkers): boolean {
		const selectedElement = this.getSelection();
		if (selectedElement && selectedElement.length > 0) {
			if (selectedElement[0] instanceof Marker) {
				if (resource.has((<Marker>selectedElement[0]).marker.resource)) {
					return true;
				}
			}
		}

		return false;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/markers/browser/markersTreeViewer.ts]---
Location: vscode-main/src/vs/workbench/contrib/markers/browser/markersTreeViewer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import * as paths from '../../../../base/common/path.js';
import { CountBadge } from '../../../../base/browser/ui/countBadge/countBadge.js';
import { ResourceLabels, IResourceLabel } from '../../../browser/labels.js';
import { HighlightedLabel } from '../../../../base/browser/ui/highlightedlabel/highlightedLabel.js';
import { IMarker, MarkerSeverity } from '../../../../platform/markers/common/markers.js';
import { ResourceMarkers, Marker, RelatedInformation, MarkerElement, MarkerTableItem } from './markersModel.js';
import Messages from './messages.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { IDisposable, dispose, Disposable, toDisposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { ActionBar } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { QuickFixAction, QuickFixActionViewItem } from './markersViewActions.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { basename, isEqual } from '../../../../base/common/resources.js';
import { IListVirtualDelegate } from '../../../../base/browser/ui/list/list.js';
import { ITreeFilter, TreeVisibility, TreeFilterResult, ITreeRenderer, ITreeNode } from '../../../../base/browser/ui/tree/tree.js';
import { FilterOptions } from './markersFilterOptions.js';
import { IMatch } from '../../../../base/common/filters.js';
import { Event, Emitter } from '../../../../base/common/event.js';
import { IListAccessibilityProvider } from '../../../../base/browser/ui/list/listWidget.js';
import { isUndefinedOrNull } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import { Action, IAction, toAction } from '../../../../base/common/actions.js';
import { localize } from '../../../../nls.js';
import { CancelablePromise, createCancelablePromise, Delayer } from '../../../../base/common/async.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { Range } from '../../../../editor/common/core/range.js';
import { applyCodeAction, ApplyCodeActionReason, getCodeActions } from '../../../../editor/contrib/codeAction/browser/codeAction.js';
import { CodeActionKind, CodeActionSet, CodeActionTriggerSource } from '../../../../editor/contrib/codeAction/common/types.js';
import { ITextModel } from '../../../../editor/common/model.js';
import { IEditorService, ACTIVE_GROUP } from '../../../services/editor/common/editorService.js';
import { SeverityIcon } from '../../../../base/browser/ui/severityIcon/severityIcon.js';
import { CodeActionTriggerType } from '../../../../editor/common/languages.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { Progress } from '../../../../platform/progress/common/progress.js';
import { ActionViewItem } from '../../../../base/browser/ui/actionbar/actionViewItems.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';
import { Link } from '../../../../platform/opener/browser/link.js';
import { ILanguageFeaturesService } from '../../../../editor/common/services/languageFeatures.js';
import { IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { MarkersContextKeys, MarkersViewMode } from '../common/markers.js';
import { unsupportedSchemas } from '../../../../platform/markers/common/markerService.js';
import { defaultCountBadgeStyles } from '../../../../platform/theme/browser/defaultStyles.js';
import Severity from '../../../../base/common/severity.js';
import { getDefaultHoverDelegate } from '../../../../base/browser/ui/hover/hoverDelegateFactory.js';
import type { IManagedHover } from '../../../../base/browser/ui/hover/hover.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';

interface IResourceMarkersTemplateData {
	readonly resourceLabel: IResourceLabel;
	readonly count: CountBadge;
}

interface IMarkerTemplateData {
	markerWidget: MarkerWidget;
}

interface IRelatedInformationTemplateData {
	resourceLabel: HighlightedLabel;
	lnCol: HTMLElement;
	description: HighlightedLabel;
}

export class MarkersWidgetAccessibilityProvider implements IListAccessibilityProvider<MarkerElement | MarkerTableItem> {

	constructor(@ILabelService private readonly labelService: ILabelService) { }

	getWidgetAriaLabel(): string {
		return localize('problemsView', "Problems View");
	}

	public getAriaLabel(element: MarkerElement | MarkerTableItem): string | null {
		if (element instanceof ResourceMarkers) {
			const path = this.labelService.getUriLabel(element.resource, { relative: true }) || element.resource.fsPath;
			return Messages.MARKERS_TREE_ARIA_LABEL_RESOURCE(element.markers.length, element.name, paths.dirname(path));
		}
		if (element instanceof Marker || element instanceof MarkerTableItem) {
			return Messages.MARKERS_TREE_ARIA_LABEL_MARKER(element);
		}
		if (element instanceof RelatedInformation) {
			return Messages.MARKERS_TREE_ARIA_LABEL_RELATED_INFORMATION(element.raw);
		}
		return null;
	}
}

const enum TemplateId {
	ResourceMarkers = 'rm',
	Marker = 'm',
	RelatedInformation = 'ri'
}

export class VirtualDelegate implements IListVirtualDelegate<MarkerElement> {

	static LINE_HEIGHT: number = 22;

	constructor(private readonly markersViewState: MarkersViewModel) { }

	getHeight(element: MarkerElement): number {
		if (element instanceof Marker) {
			const viewModel = this.markersViewState.getViewModel(element);
			const noOfLines = !viewModel || viewModel.multiline ? element.lines.length : 1;
			return noOfLines * VirtualDelegate.LINE_HEIGHT;
		}
		return VirtualDelegate.LINE_HEIGHT;
	}

	getTemplateId(element: MarkerElement): string {
		if (element instanceof ResourceMarkers) {
			return TemplateId.ResourceMarkers;
		} else if (element instanceof Marker) {
			return TemplateId.Marker;
		} else {
			return TemplateId.RelatedInformation;
		}
	}
}

const enum FilterDataType {
	ResourceMarkers,
	Marker,
	RelatedInformation
}

interface ResourceMarkersFilterData {
	type: FilterDataType.ResourceMarkers;
	uriMatches: IMatch[];
}

interface MarkerFilterData {
	type: FilterDataType.Marker;
	lineMatches: IMatch[][];
	sourceMatches: IMatch[];
	codeMatches: IMatch[];
}

interface RelatedInformationFilterData {
	type: FilterDataType.RelatedInformation;
	uriMatches: IMatch[];
	messageMatches: IMatch[];
}

export type FilterData = ResourceMarkersFilterData | MarkerFilterData | RelatedInformationFilterData;

export class ResourceMarkersRenderer implements ITreeRenderer<ResourceMarkers, ResourceMarkersFilterData, IResourceMarkersTemplateData> {

	private renderedNodes = new Map<ResourceMarkers, IResourceMarkersTemplateData[]>();
	private readonly disposables = new DisposableStore();

	constructor(
		private labels: ResourceLabels,
		onDidChangeRenderNodeCount: Event<ITreeNode<ResourceMarkers, ResourceMarkersFilterData>>,
	) {
		onDidChangeRenderNodeCount(this.onDidChangeRenderNodeCount, this, this.disposables);
	}

	templateId = TemplateId.ResourceMarkers;

	renderTemplate(container: HTMLElement): IResourceMarkersTemplateData {
		const resourceLabelContainer = dom.append(container, dom.$('.resource-label-container'));
		const resourceLabel = this.labels.create(resourceLabelContainer, { supportHighlights: true });

		const badgeWrapper = dom.append(container, dom.$('.count-badge-wrapper'));
		const count = new CountBadge(badgeWrapper, {}, defaultCountBadgeStyles);

		return { count, resourceLabel };
	}

	renderElement(node: ITreeNode<ResourceMarkers, ResourceMarkersFilterData>, _: number, templateData: IResourceMarkersTemplateData): void {
		const resourceMarkers = node.element;
		const uriMatches = node.filterData && node.filterData.uriMatches || [];

		templateData.resourceLabel.setFile(resourceMarkers.resource, { matches: uriMatches });

		this.updateCount(node, templateData);
		const nodeRenders = this.renderedNodes.get(resourceMarkers) ?? [];
		this.renderedNodes.set(resourceMarkers, [...nodeRenders, templateData]);
	}

	disposeElement(node: ITreeNode<ResourceMarkers, ResourceMarkersFilterData>, index: number, templateData: IResourceMarkersTemplateData): void {
		const nodeRenders = this.renderedNodes.get(node.element) ?? [];
		const nodeRenderIndex = nodeRenders.findIndex(nodeRender => templateData === nodeRender);

		if (nodeRenderIndex < 0) {
			throw new Error('Disposing unknown resource marker');
		}

		if (nodeRenders.length === 1) {
			this.renderedNodes.delete(node.element);
		} else {
			nodeRenders.splice(nodeRenderIndex, 1);
		}
	}

	disposeTemplate(templateData: IResourceMarkersTemplateData): void {
		templateData.resourceLabel.dispose();
		templateData.count.dispose();
	}

	private onDidChangeRenderNodeCount(node: ITreeNode<ResourceMarkers, ResourceMarkersFilterData>): void {
		const nodeRenders = this.renderedNodes.get(node.element);

		if (!nodeRenders) {
			return;
		}

		nodeRenders.forEach(nodeRender => this.updateCount(node, nodeRender));
	}

	private updateCount(node: ITreeNode<ResourceMarkers, ResourceMarkersFilterData>, templateData: IResourceMarkersTemplateData): void {
		templateData.count.setCount(node.children.reduce((r, n) => r + (n.visible ? 1 : 0), 0));
	}

	dispose(): void {
		this.disposables.dispose();
	}
}

export class FileResourceMarkersRenderer extends ResourceMarkersRenderer {
}

export class MarkerRenderer implements ITreeRenderer<Marker, MarkerFilterData, IMarkerTemplateData> {

	constructor(
		private readonly markersViewState: MarkersViewModel,
		@IHoverService protected hoverService: IHoverService,
		@IInstantiationService protected instantiationService: IInstantiationService,
		@IOpenerService protected openerService: IOpenerService,
	) { }

	templateId = TemplateId.Marker;

	renderTemplate(container: HTMLElement): IMarkerTemplateData {
		const data: IMarkerTemplateData = Object.create(null);
		data.markerWidget = new MarkerWidget(container, this.markersViewState, this.hoverService, this.openerService, this.instantiationService);
		return data;
	}

	renderElement(node: ITreeNode<Marker, MarkerFilterData>, _: number, templateData: IMarkerTemplateData): void {
		templateData.markerWidget.render(node.element, node.filterData);
	}

	disposeTemplate(templateData: IMarkerTemplateData): void {
		templateData.markerWidget.dispose();
	}

}

const expandedIcon = registerIcon('markers-view-multi-line-expanded', Codicon.chevronUp, localize('expandedIcon', 'Icon indicating that multiple lines are shown in the markers view.'));
const collapsedIcon = registerIcon('markers-view-multi-line-collapsed', Codicon.chevronDown, localize('collapsedIcon', 'Icon indicating that multiple lines are collapsed in the markers view.'));

const toggleMultilineAction = 'problems.action.toggleMultiline';

class ToggleMultilineActionViewItem extends ActionViewItem {

	override render(container: HTMLElement): void {
		super.render(container);
		this.updateExpandedAttribute();
	}

	protected override updateClass(): void {
		super.updateClass();
		this.updateExpandedAttribute();
	}

	private updateExpandedAttribute(): void {
		this.element?.setAttribute('aria-expanded', `${this._action.class === ThemeIcon.asClassName(expandedIcon)}`);
	}

}

class MarkerWidget extends Disposable {

	private readonly actionBar: ActionBar;
	private readonly icon: HTMLElement;
	private readonly iconContainer: HTMLElement;
	private readonly messageAndDetailsContainer: HTMLElement;
	private readonly messageAndDetailsContainerHover: IManagedHover;
	private readonly disposables = this._register(new DisposableStore());

	constructor(
		private parent: HTMLElement,
		private readonly markersViewModel: MarkersViewModel,
		private readonly _hoverService: IHoverService,
		private readonly _openerService: IOpenerService,
		_instantiationService: IInstantiationService
	) {
		super();
		this.actionBar = this._register(new ActionBar(dom.append(parent, dom.$('.actions')), {
			actionViewItemProvider: (action: IAction, options) => action.id === QuickFixAction.ID ? _instantiationService.createInstance(QuickFixActionViewItem, <QuickFixAction>action, options) : undefined
		}));

		// wrap the icon in a container that get the icon color as foreground color. That way, if the
		// list view does not have a specific color for the icon (=the color variable is invalid) it
		// falls back to the foreground color of container (inherit)
		this.iconContainer = dom.append(parent, dom.$(''));
		this.icon = dom.append(this.iconContainer, dom.$(''));
		this.messageAndDetailsContainer = dom.append(parent, dom.$('.marker-message-details-container'));
		this.messageAndDetailsContainerHover = this._register(this._hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), this.messageAndDetailsContainer, ''));
	}

	render(element: Marker, filterData: MarkerFilterData | undefined): void {
		this.actionBar.clear();
		this.disposables.clear();
		dom.clearNode(this.messageAndDetailsContainer);

		this.iconContainer.className = `marker-icon ${Severity.toString(MarkerSeverity.toSeverity(element.marker.severity))}`;
		this.icon.className = `codicon ${SeverityIcon.className(MarkerSeverity.toSeverity(element.marker.severity))}`;
		this.renderQuickfixActionbar(element);

		this.renderMessageAndDetails(element, filterData);
		this.disposables.add(dom.addDisposableListener(this.parent, dom.EventType.MOUSE_OVER, () => this.markersViewModel.onMarkerMouseHover(element)));
		this.disposables.add(dom.addDisposableListener(this.parent, dom.EventType.MOUSE_LEAVE, () => this.markersViewModel.onMarkerMouseLeave(element)));
	}

	private renderQuickfixActionbar(marker: Marker): void {
		const viewModel = this.markersViewModel.getViewModel(marker);
		if (viewModel) {
			const quickFixAction = viewModel.quickFixAction;
			this.actionBar.push([quickFixAction], { icon: true, label: false });
			this.iconContainer.classList.toggle('quickFix', quickFixAction.enabled);
			quickFixAction.onDidChange(({ enabled }) => {
				if (!isUndefinedOrNull(enabled)) {
					this.iconContainer.classList.toggle('quickFix', enabled);
				}
			}, this, this.disposables);
			quickFixAction.onShowQuickFixes(() => {
				const quickFixActionViewItem = <QuickFixActionViewItem>this.actionBar.viewItems[0];
				if (quickFixActionViewItem) {
					quickFixActionViewItem.showQuickFixes();
				}
			}, this, this.disposables);
		}
	}

	private renderMultilineActionbar(marker: Marker, parent: HTMLElement): void {
		const multilineActionbar = this.disposables.add(new ActionBar(dom.append(parent, dom.$('.multiline-actions')), {
			actionViewItemProvider: (action, options) => {
				if (action.id === toggleMultilineAction) {
					return new ToggleMultilineActionViewItem(undefined, action, { ...options, icon: true });
				}
				return undefined;
			}
		}));
		this.disposables.add(multilineActionbar);

		const viewModel = this.markersViewModel.getViewModel(marker);
		const multiline = viewModel && viewModel.multiline;
		const action = this.disposables.add(new Action(toggleMultilineAction));
		action.enabled = !!viewModel && marker.lines.length > 1;
		action.tooltip = multiline ? localize('single line', "Show message in single line") : localize('multi line', "Show message in multiple lines");
		action.class = ThemeIcon.asClassName(multiline ? expandedIcon : collapsedIcon);
		action.run = () => { if (viewModel) { viewModel.multiline = !viewModel.multiline; } return Promise.resolve(); };
		multilineActionbar.push([action], { icon: true, label: false });
	}

	private renderMessageAndDetails(element: Marker, filterData: MarkerFilterData | undefined): void {
		const { marker, lines } = element;
		const viewState = this.markersViewModel.getViewModel(element);
		const multiline = !viewState || viewState.multiline;
		const lineMatches = filterData && filterData.lineMatches || [];
		this.messageAndDetailsContainerHover.update(element.marker.message);

		const lineElements: HTMLElement[] = [];
		for (let index = 0; index < (multiline ? lines.length : 1); index++) {
			const lineElement = dom.append(this.messageAndDetailsContainer, dom.$('.marker-message-line'));
			const messageElement = dom.append(lineElement, dom.$('.marker-message'));
			const highlightedLabel = this.disposables.add(new HighlightedLabel(messageElement));
			highlightedLabel.set(lines[index].length > 1000 ? `${lines[index].substring(0, 1000)}...` : lines[index], lineMatches[index]);
			if (lines[index] === '') {
				lineElement.style.height = `${VirtualDelegate.LINE_HEIGHT}px`;
			}
			lineElements.push(lineElement);
		}
		this.renderDetails(marker, filterData, lineElements[0]);
		this.renderMultilineActionbar(element, lineElements[0]);
	}

	private renderDetails(marker: IMarker, filterData: MarkerFilterData | undefined, parent: HTMLElement): void {
		parent.classList.add('details-container');

		if (marker.source || marker.code) {
			const source = this.disposables.add(new HighlightedLabel(dom.append(parent, dom.$('.marker-source'))));
			const sourceMatches = filterData && filterData.sourceMatches || [];
			source.set(marker.source, sourceMatches);

			if (marker.code) {
				if (typeof marker.code === 'string') {
					const code = this.disposables.add(new HighlightedLabel(dom.append(parent, dom.$('.marker-code'))));
					const codeMatches = filterData && filterData.codeMatches || [];
					code.set(marker.code, codeMatches);
				} else {
					const container = dom.$('.marker-code');
					const code = this.disposables.add(new HighlightedLabel(container));
					const link = marker.code.target.toString(true);
					this.disposables.add(new Link(parent, { href: link, label: container, title: link }, undefined, this._hoverService, this._openerService));
					const codeMatches = filterData && filterData.codeMatches || [];
					code.set(marker.code.value, codeMatches);
				}
			}
		}

		const lnCol = dom.append(parent, dom.$('span.marker-line'));
		lnCol.textContent = Messages.MARKERS_PANEL_AT_LINE_COL_NUMBER(marker.startLineNumber, marker.startColumn);
	}

}

export class RelatedInformationRenderer implements ITreeRenderer<RelatedInformation, RelatedInformationFilterData, IRelatedInformationTemplateData> {

	constructor(
		@ILabelService private readonly labelService: ILabelService
	) { }

	templateId = TemplateId.RelatedInformation;

	renderTemplate(container: HTMLElement): IRelatedInformationTemplateData {
		const data: IRelatedInformationTemplateData = Object.create(null);

		dom.append(container, dom.$('.actions'));
		dom.append(container, dom.$('.icon'));

		data.resourceLabel = new HighlightedLabel(dom.append(container, dom.$('.related-info-resource')));
		data.lnCol = dom.append(container, dom.$('span.marker-line'));

		const separator = dom.append(container, dom.$('span.related-info-resource-separator'));
		separator.textContent = ':';
		separator.style.paddingRight = '4px';

		data.description = new HighlightedLabel(dom.append(container, dom.$('.marker-description')));
		return data;
	}

	renderElement(node: ITreeNode<RelatedInformation, RelatedInformationFilterData>, _: number, templateData: IRelatedInformationTemplateData): void {
		const relatedInformation = node.element.raw;
		const uriMatches = node.filterData && node.filterData.uriMatches || [];
		const messageMatches = node.filterData && node.filterData.messageMatches || [];

		const resourceLabelTitle = this.labelService.getUriLabel(relatedInformation.resource, { relative: true });
		templateData.resourceLabel.set(basename(relatedInformation.resource), uriMatches, resourceLabelTitle);
		templateData.lnCol.textContent = Messages.MARKERS_PANEL_AT_LINE_COL_NUMBER(relatedInformation.startLineNumber, relatedInformation.startColumn);
		templateData.description.set(relatedInformation.message, messageMatches, relatedInformation.message);
	}

	disposeTemplate(templateData: IRelatedInformationTemplateData): void {
		templateData.resourceLabel.dispose();
		templateData.description.dispose();
	}
}

export class Filter implements ITreeFilter<MarkerElement, FilterData> {

	constructor(public options: FilterOptions) { }

	filter(element: MarkerElement, parentVisibility: TreeVisibility): TreeFilterResult<FilterData> {
		if (element instanceof ResourceMarkers) {
			return this.filterResourceMarkers(element);
		} else if (element instanceof Marker) {
			return this.filterMarker(element, parentVisibility);
		} else {
			return this.filterRelatedInformation(element, parentVisibility);
		}
	}

	private filterResourceMarkers(resourceMarkers: ResourceMarkers): TreeFilterResult<FilterData> {
		if (unsupportedSchemas.has(resourceMarkers.resource.scheme)) {
			return false;
		}

		// Filter resource by pattern first (globs)
		// Excludes pattern
		if (this.options.excludesMatcher.matches(resourceMarkers.resource)) {
			return false;
		}

		// Includes pattern
		if (this.options.includesMatcher.matches(resourceMarkers.resource)) {
			return true;
		}

		// Fiter by text. Do not apply negated filters on resources instead use exclude patterns
		if (this.options.textFilter.text && !this.options.textFilter.negate) {
			const uriMatches = FilterOptions._filter(this.options.textFilter.text, basename(resourceMarkers.resource));
			if (uriMatches) {
				return { visibility: true, data: { type: FilterDataType.ResourceMarkers, uriMatches: uriMatches || [] } };
			}
		}

		return TreeVisibility.Recurse;
	}

	private filterMarker(marker: Marker, parentVisibility: TreeVisibility): TreeFilterResult<FilterData> {

		const matchesSeverity = this.options.showErrors && MarkerSeverity.Error === marker.marker.severity ||
			this.options.showWarnings && MarkerSeverity.Warning === marker.marker.severity ||
			this.options.showInfos && MarkerSeverity.Info === marker.marker.severity;

		if (!matchesSeverity) {
			return false;
		}

		// Check source filters if present
		if (!this.options.matchesSourceFilters(marker.marker.source)) {
			return false;
		}

		if (!this.options.textFilter.text) {
			return true;
		}

		const lineMatches: IMatch[][] = [];
		for (const line of marker.lines) {
			const lineMatch = FilterOptions._messageFilter(this.options.textFilter.text, line);
			lineMatches.push(lineMatch || []);
		}

		const sourceMatches = marker.marker.source ? FilterOptions._filter(this.options.textFilter.text, marker.marker.source) : undefined;
		const codeMatches = marker.marker.code ? FilterOptions._filter(this.options.textFilter.text, typeof marker.marker.code === 'string' ? marker.marker.code : marker.marker.code.value) : undefined;
		const matched = sourceMatches || codeMatches || lineMatches.some(lineMatch => lineMatch.length > 0);

		// Matched and not negated
		if (matched && !this.options.textFilter.negate) {
			return { visibility: true, data: { type: FilterDataType.Marker, lineMatches, sourceMatches: sourceMatches || [], codeMatches: codeMatches || [] } };
		}

		// Matched and negated - exclude it only if parent visibility is not set
		if (matched && this.options.textFilter.negate && parentVisibility === TreeVisibility.Recurse) {
			return false;
		}

		// Not matched and negated - include it only if parent visibility is not set
		if (!matched && this.options.textFilter.negate && parentVisibility === TreeVisibility.Recurse) {
			return true;
		}

		return parentVisibility;
	}

	private filterRelatedInformation(relatedInformation: RelatedInformation, parentVisibility: TreeVisibility): TreeFilterResult<FilterData> {
		if (!this.options.textFilter.text) {
			return true;
		}

		const uriMatches = FilterOptions._filter(this.options.textFilter.text, basename(relatedInformation.raw.resource));
		const messageMatches = FilterOptions._messageFilter(this.options.textFilter.text, paths.basename(relatedInformation.raw.message));
		const matched = uriMatches || messageMatches;

		// Matched and not negated
		if (matched && !this.options.textFilter.negate) {
			return { visibility: true, data: { type: FilterDataType.RelatedInformation, uriMatches: uriMatches || [], messageMatches: messageMatches || [] } };
		}

		// Matched and negated - exclude it only if parent visibility is not set
		if (matched && this.options.textFilter.negate && parentVisibility === TreeVisibility.Recurse) {
			return false;
		}

		// Not matched and negated - include it only if parent visibility is not set
		if (!matched && this.options.textFilter.negate && parentVisibility === TreeVisibility.Recurse) {
			return true;
		}

		return parentVisibility;
	}
}

export class MarkerViewModel extends Disposable {

	private readonly _onDidChange: Emitter<void> = this._register(new Emitter<void>());
	readonly onDidChange: Event<void> = this._onDidChange.event;

	private modelPromise: CancelablePromise<ITextModel> | null = null;
	private codeActionsPromise: CancelablePromise<CodeActionSet> | null = null;

	constructor(
		private readonly marker: Marker,
		@IModelService private modelService: IModelService,
		@IInstantiationService private instantiationService: IInstantiationService,
		@IEditorService private readonly editorService: IEditorService,
		@ILanguageFeaturesService private readonly languageFeaturesService: ILanguageFeaturesService,
	) {
		super();
		this._register(toDisposable(() => {
			if (this.modelPromise) {
				this.modelPromise.cancel();
			}
			if (this.codeActionsPromise) {
				this.codeActionsPromise.cancel();
			}
		}));
	}

	private _multiline: boolean = true;
	get multiline(): boolean {
		return this._multiline;
	}

	set multiline(value: boolean) {
		if (this._multiline !== value) {
			this._multiline = value;
			this._onDidChange.fire();
		}
	}

	private _quickFixAction: QuickFixAction | null = null;
	get quickFixAction(): QuickFixAction {
		if (!this._quickFixAction) {
			this._quickFixAction = this._register(this.instantiationService.createInstance(QuickFixAction, this.marker));
		}
		return this._quickFixAction;
	}

	showLightBulb(): void {
		this.setQuickFixes(true);
	}

	private async setQuickFixes(waitForModel: boolean): Promise<void> {
		const codeActions = await this.getCodeActions(waitForModel);
		this.quickFixAction.quickFixes = codeActions ? this.toActions(codeActions) : [];
		this.quickFixAction.autoFixable(!!codeActions && codeActions.hasAutoFix);
	}

	private getCodeActions(waitForModel: boolean): Promise<CodeActionSet | null> {
		if (this.codeActionsPromise !== null) {
			return this.codeActionsPromise;
		}
		return this.getModel(waitForModel)
			.then<CodeActionSet | null>(model => {
				if (model) {
					if (!this.codeActionsPromise) {
						this.codeActionsPromise = createCancelablePromise(cancellationToken => {
							return getCodeActions(this.languageFeaturesService.codeActionProvider, model, new Range(this.marker.range.startLineNumber, this.marker.range.startColumn, this.marker.range.endLineNumber, this.marker.range.endColumn), {
								type: CodeActionTriggerType.Invoke, triggerAction: CodeActionTriggerSource.ProblemsView, filter: { include: CodeActionKind.QuickFix }
							}, Progress.None, cancellationToken).then(actions => {
								return this._register(actions);
							});
						});
					}
					return this.codeActionsPromise;
				}
				return null;
			});
	}

	private toActions(codeActions: CodeActionSet): IAction[] {
		return codeActions.validActions.map(item => toAction({
			id: item.action.command ? item.action.command.id : item.action.title,
			label: item.action.title,
			run: async () => {
				await this.openFileAtMarker(this.marker);
				return await this.instantiationService.invokeFunction(applyCodeAction, item, ApplyCodeActionReason.FromProblemsView);
			}
		}));
	}

	private openFileAtMarker(element: Marker): Promise<void> {
		const { resource, selection } = { resource: element.resource, selection: element.range };
		return this.editorService.openEditor({
			resource,
			options: {
				selection,
				preserveFocus: true,
				pinned: false,
				revealIfVisible: true
			},
		}, ACTIVE_GROUP).then(() => undefined);
	}

	private getModel(waitForModel: boolean): Promise<ITextModel | null> {
		const model = this.modelService.getModel(this.marker.resource);
		if (model) {
			return Promise.resolve(model);
		}
		if (waitForModel) {
			if (!this.modelPromise) {
				this.modelPromise = createCancelablePromise(cancellationToken => {
					return new Promise((c) => {
						this._register(this.modelService.onModelAdded(model => {
							if (isEqual(model.uri, this.marker.resource)) {
								c(model);
							}
						}));
					});
				});
			}
			return this.modelPromise;
		}
		return Promise.resolve(null);
	}

}

export class MarkersViewModel extends Disposable {

	private readonly _onDidChange: Emitter<Marker | undefined> = this._register(new Emitter<Marker | undefined>());
	readonly onDidChange: Event<Marker | undefined> = this._onDidChange.event;

	private readonly _onDidChangeViewMode: Emitter<MarkersViewMode> = this._register(new Emitter<MarkersViewMode>());
	readonly onDidChangeViewMode: Event<MarkersViewMode> = this._onDidChangeViewMode.event;

	private readonly markersViewStates: Map<string, { viewModel: MarkerViewModel; disposables: IDisposable[] }> = new Map<string, { viewModel: MarkerViewModel; disposables: IDisposable[] }>();
	private readonly markersPerResource: Map<string, Marker[]> = new Map<string, Marker[]>();

	private bulkUpdate: boolean = false;

	private hoveredMarker: Marker | null = null;
	private hoverDelayer: Delayer<void> = new Delayer<void>(300);
	private viewModeContextKey: IContextKey<MarkersViewMode>;

	constructor(
		multiline: boolean = true,
		viewMode: MarkersViewMode = MarkersViewMode.Tree,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IInstantiationService private readonly instantiationService: IInstantiationService
	) {
		super();
		this._multiline = multiline;
		this._viewMode = viewMode;

		this.viewModeContextKey = MarkersContextKeys.MarkersViewModeContextKey.bindTo(this.contextKeyService);
		this.viewModeContextKey.set(viewMode);
	}

	add(marker: Marker): void {
		if (!this.markersViewStates.has(marker.id)) {
			const viewModel = this.instantiationService.createInstance(MarkerViewModel, marker);
			const disposables: IDisposable[] = [viewModel];
			viewModel.multiline = this.multiline;
			viewModel.onDidChange(() => {
				if (!this.bulkUpdate) {
					this._onDidChange.fire(marker);
				}
			}, this, disposables);
			this.markersViewStates.set(marker.id, { viewModel, disposables });

			const markers = this.markersPerResource.get(marker.resource.toString()) || [];
			markers.push(marker);
			this.markersPerResource.set(marker.resource.toString(), markers);
		}
	}

	remove(resource: URI): void {
		const markers = this.markersPerResource.get(resource.toString()) || [];
		for (const marker of markers) {
			const value = this.markersViewStates.get(marker.id);
			if (value) {
				dispose(value.disposables);
			}
			this.markersViewStates.delete(marker.id);
			if (this.hoveredMarker === marker) {
				this.hoveredMarker = null;
			}
		}
		this.markersPerResource.delete(resource.toString());
	}

	getViewModel(marker: Marker): MarkerViewModel | null {
		const value = this.markersViewStates.get(marker.id);
		return value ? value.viewModel : null;
	}

	onMarkerMouseHover(marker: Marker): void {
		this.hoveredMarker = marker;
		this.hoverDelayer.trigger(() => {
			if (this.hoveredMarker) {
				const model = this.getViewModel(this.hoveredMarker);
				if (model) {
					model.showLightBulb();
				}
			}
		});
	}

	onMarkerMouseLeave(marker: Marker): void {
		if (this.hoveredMarker === marker) {
			this.hoveredMarker = null;
		}
	}

	private _multiline: boolean = true;
	get multiline(): boolean {
		return this._multiline;
	}

	set multiline(value: boolean) {
		let changed = false;
		if (this._multiline !== value) {
			this._multiline = value;
			changed = true;
		}
		this.bulkUpdate = true;
		this.markersViewStates.forEach(({ viewModel }) => {
			if (viewModel.multiline !== value) {
				viewModel.multiline = value;
				changed = true;
			}
		});
		this.bulkUpdate = false;
		if (changed) {
			this._onDidChange.fire(undefined);
		}
	}

	private _viewMode: MarkersViewMode = MarkersViewMode.Tree;
	get viewMode(): MarkersViewMode {
		return this._viewMode;
	}

	set viewMode(value: MarkersViewMode) {
		if (this._viewMode === value) {
			return;
		}

		this._viewMode = value;
		this._onDidChangeViewMode.fire(value);
		this.viewModeContextKey.set(value);
	}

	override dispose(): void {
		this.markersViewStates.forEach(({ disposables }) => dispose(disposables));
		this.markersViewStates.clear();
		this.markersPerResource.clear();
		super.dispose();
	}

}
```

--------------------------------------------------------------------------------

````
