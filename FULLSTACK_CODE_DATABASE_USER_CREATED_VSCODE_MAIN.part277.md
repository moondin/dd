---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 277
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 277 of 552)

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

---[FILE: src/vs/platform/keybinding/common/keybindingResolver.ts]---
Location: vscode-main/src/vs/platform/keybinding/common/keybindingResolver.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { implies, ContextKeyExpression, ContextKeyExprType, IContext, IContextKeyService, expressionsAreEqualWithConstantSubstitution } from '../../contextkey/common/contextkey.js';
import { ResolvedKeybindingItem } from './resolvedKeybindingItem.js';

//#region resolution-result

export const enum ResultKind {
	/** No keybinding found this sequence of chords */
	NoMatchingKb,

	/** There're several keybindings that have the given sequence of chords as a prefix */
	MoreChordsNeeded,

	/** A single keybinding found to be dispatched/invoked */
	KbFound
}

export type ResolutionResult =
	| { kind: ResultKind.NoMatchingKb }
	| { kind: ResultKind.MoreChordsNeeded }
	| { kind: ResultKind.KbFound; commandId: string | null; commandArgs: any; isBubble: boolean };


// util definitions to make working with the above types easier within this module:

export const NoMatchingKb: ResolutionResult = { kind: ResultKind.NoMatchingKb };
const MoreChordsNeeded: ResolutionResult = { kind: ResultKind.MoreChordsNeeded };
function KbFound(commandId: string | null, commandArgs: any, isBubble: boolean): ResolutionResult {
	return { kind: ResultKind.KbFound, commandId, commandArgs, isBubble };
}

//#endregion

/**
 * Stores mappings from keybindings to commands and from commands to keybindings.
 * Given a sequence of chords, `resolve`s which keybinding it matches
 */
export class KeybindingResolver {
	private readonly _log: (str: string) => void;
	private readonly _defaultKeybindings: ResolvedKeybindingItem[];
	private readonly _keybindings: ResolvedKeybindingItem[];
	private readonly _defaultBoundCommands: Map</* commandId */ string, boolean>;
	private readonly _map: Map</* 1st chord's keypress */ string, ResolvedKeybindingItem[]>;
	private readonly _lookupMap: Map</* commandId */ string, ResolvedKeybindingItem[]>;

	constructor(
		/** built-in and extension-provided keybindings */
		defaultKeybindings: ResolvedKeybindingItem[],
		/** user's keybindings */
		overrides: ResolvedKeybindingItem[],
		log: (str: string) => void
	) {
		this._log = log;
		this._defaultKeybindings = defaultKeybindings;

		this._defaultBoundCommands = new Map<string, boolean>();
		for (const defaultKeybinding of defaultKeybindings) {
			const command = defaultKeybinding.command;
			if (command && command.charAt(0) !== '-') {
				this._defaultBoundCommands.set(command, true);
			}
		}

		this._map = new Map<string, ResolvedKeybindingItem[]>();
		this._lookupMap = new Map<string, ResolvedKeybindingItem[]>();

		this._keybindings = KeybindingResolver.handleRemovals(([] as ResolvedKeybindingItem[]).concat(defaultKeybindings).concat(overrides));
		for (let i = 0, len = this._keybindings.length; i < len; i++) {
			const k = this._keybindings[i];
			if (k.chords.length === 0) {
				// unbound
				continue;
			}

			// substitute with constants that are registered after startup - https://github.com/microsoft/vscode/issues/174218#issuecomment-1437972127
			const when = k.when?.substituteConstants();

			if (when && when.type === ContextKeyExprType.False) {
				// when condition is false
				continue;
			}

			this._addKeyPress(k.chords[0], k);
		}
	}

	private static _isTargetedForRemoval(defaultKb: ResolvedKeybindingItem, keypress: string[] | null, when: ContextKeyExpression | undefined): boolean {
		if (keypress) {
			for (let i = 0; i < keypress.length; i++) {
				if (keypress[i] !== defaultKb.chords[i]) {
					return false;
				}
			}
		}

		// `true` means always, as does `undefined`
		// so we will treat `true` === `undefined`
		if (when && when.type !== ContextKeyExprType.True) {
			if (!defaultKb.when) {
				return false;
			}
			if (!expressionsAreEqualWithConstantSubstitution(when, defaultKb.when)) {
				return false;
			}
		}
		return true;

	}

	/**
	 * Looks for rules containing "-commandId" and removes them.
	 */
	public static handleRemovals(rules: ResolvedKeybindingItem[]): ResolvedKeybindingItem[] {
		// Do a first pass and construct a hash-map for removals
		const removals = new Map</* commandId */ string, ResolvedKeybindingItem[]>();
		for (let i = 0, len = rules.length; i < len; i++) {
			const rule = rules[i];
			if (rule.command && rule.command.charAt(0) === '-') {
				const command = rule.command.substring(1);
				if (!removals.has(command)) {
					removals.set(command, [rule]);
				} else {
					removals.get(command)!.push(rule);
				}
			}
		}

		if (removals.size === 0) {
			// There are no removals
			return rules;
		}

		// Do a second pass and keep only non-removed keybindings
		const result: ResolvedKeybindingItem[] = [];
		for (let i = 0, len = rules.length; i < len; i++) {
			const rule = rules[i];

			if (!rule.command || rule.command.length === 0) {
				result.push(rule);
				continue;
			}
			if (rule.command.charAt(0) === '-') {
				continue;
			}
			const commandRemovals = removals.get(rule.command);
			if (!commandRemovals || !rule.isDefault) {
				result.push(rule);
				continue;
			}
			let isRemoved = false;
			for (const commandRemoval of commandRemovals) {
				const when = commandRemoval.when;
				if (this._isTargetedForRemoval(rule, commandRemoval.chords, when)) {
					isRemoved = true;
					break;
				}
			}
			if (!isRemoved) {
				result.push(rule);
				continue;
			}
		}
		return result;
	}

	private _addKeyPress(keypress: string, item: ResolvedKeybindingItem): void {

		const conflicts = this._map.get(keypress);

		if (typeof conflicts === 'undefined') {
			// There is no conflict so far
			this._map.set(keypress, [item]);
			this._addToLookupMap(item);
			return;
		}

		for (let i = conflicts.length - 1; i >= 0; i--) {
			const conflict = conflicts[i];

			if (conflict.command === item.command) {
				continue;
			}

			// Test if the shorter keybinding is a prefix of the longer one.
			// If the shorter keybinding is a prefix, it effectively will shadow the longer one and is considered a conflict.
			let isShorterKbPrefix = true;
			for (let i = 1; i < conflict.chords.length && i < item.chords.length; i++) {
				if (conflict.chords[i] !== item.chords[i]) {
					// The ith step does not conflict
					isShorterKbPrefix = false;
					break;
				}
			}
			if (!isShorterKbPrefix) {
				continue;
			}

			if (KeybindingResolver.whenIsEntirelyIncluded(conflict.when, item.when)) {
				// `item` completely overwrites `conflict`
				// Remove conflict from the lookupMap
				this._removeFromLookupMap(conflict);
			}
		}

		conflicts.push(item);
		this._addToLookupMap(item);
	}

	private _addToLookupMap(item: ResolvedKeybindingItem): void {
		if (!item.command) {
			return;
		}

		let arr = this._lookupMap.get(item.command);
		if (typeof arr === 'undefined') {
			arr = [item];
			this._lookupMap.set(item.command, arr);
		} else {
			arr.push(item);
		}
	}

	private _removeFromLookupMap(item: ResolvedKeybindingItem): void {
		if (!item.command) {
			return;
		}
		const arr = this._lookupMap.get(item.command);
		if (typeof arr === 'undefined') {
			return;
		}
		for (let i = 0, len = arr.length; i < len; i++) {
			if (arr[i] === item) {
				arr.splice(i, 1);
				return;
			}
		}
	}

	/**
	 * Returns true if it is provable `a` implies `b`.
	 */
	public static whenIsEntirelyIncluded(a: ContextKeyExpression | null | undefined, b: ContextKeyExpression | null | undefined): boolean {
		if (!b || b.type === ContextKeyExprType.True) {
			return true;
		}
		if (!a || a.type === ContextKeyExprType.True) {
			return false;
		}

		return implies(a, b);
	}

	public getDefaultBoundCommands(): Map<string, boolean> {
		return this._defaultBoundCommands;
	}

	public getDefaultKeybindings(): readonly ResolvedKeybindingItem[] {
		return this._defaultKeybindings;
	}

	public getKeybindings(): readonly ResolvedKeybindingItem[] {
		return this._keybindings;
	}

	public lookupKeybindings(commandId: string): ResolvedKeybindingItem[] {
		const items = this._lookupMap.get(commandId);
		if (typeof items === 'undefined' || items.length === 0) {
			return [];
		}

		// Reverse to get the most specific item first
		const result: ResolvedKeybindingItem[] = [];
		let resultLen = 0;
		for (let i = items.length - 1; i >= 0; i--) {
			result[resultLen++] = items[i];
		}
		return result;
	}

	public lookupPrimaryKeybinding(commandId: string, context: IContextKeyService, enforceContextCheck = false): ResolvedKeybindingItem | null {
		const items = this._lookupMap.get(commandId);
		if (typeof items === 'undefined' || items.length === 0) {
			return null;
		}
		if (items.length === 1 && !enforceContextCheck) {
			return items[0];
		}

		for (let i = items.length - 1; i >= 0; i--) {
			const item = items[i];
			if (context.contextMatchesRules(item.when)) {
				return item;
			}
		}

		if (enforceContextCheck) {
			return null;
		}

		return items[items.length - 1];
	}

	/**
	 * Looks up a keybinding trigged as a result of pressing a sequence of chords - `[...currentChords, keypress]`
	 *
	 * Example: resolving 3 chords pressed sequentially - `cmd+k cmd+p cmd+i`:
	 * 	`currentChords = [ 'cmd+k' , 'cmd+p' ]` and `keypress = `cmd+i` - last pressed chord
	 */
	public resolve(context: IContext, currentChords: string[], keypress: string): ResolutionResult {

		const pressedChords = [...currentChords, keypress];

		this._log(`| Resolving ${pressedChords}`);

		const kbCandidates = this._map.get(pressedChords[0]);
		if (kbCandidates === undefined) {
			// No bindings with such 0-th chord
			this._log(`\\ No keybinding entries.`);
			return NoMatchingKb;
		}

		let lookupMap: ResolvedKeybindingItem[] | null = null;

		if (pressedChords.length < 2) {
			lookupMap = kbCandidates;
		} else {
			// Fetch all chord bindings for `currentChords`
			lookupMap = [];
			for (let i = 0, len = kbCandidates.length; i < len; i++) {

				const candidate = kbCandidates[i];

				if (pressedChords.length > candidate.chords.length) { // # of pressed chords can't be less than # of chords in a keybinding to invoke
					continue;
				}

				let prefixMatches = true;
				for (let i = 1; i < pressedChords.length; i++) {
					if (candidate.chords[i] !== pressedChords[i]) {
						prefixMatches = false;
						break;
					}
				}
				if (prefixMatches) {
					lookupMap.push(candidate);
				}
			}
		}

		// check there's a keybinding with a matching when clause
		const result = this._findCommand(context, lookupMap);
		if (!result) {
			this._log(`\\ From ${lookupMap.length} keybinding entries, no when clauses matched the context.`);
			return NoMatchingKb;
		}

		// check we got all chords necessary to be sure a particular keybinding needs to be invoked
		if (pressedChords.length < result.chords.length) {
			// The chord sequence is not complete
			this._log(`\\ From ${lookupMap.length} keybinding entries, awaiting ${result.chords.length - pressedChords.length} more chord(s), when: ${printWhenExplanation(result.when)}, source: ${printSourceExplanation(result)}.`);
			return MoreChordsNeeded;
		}

		this._log(`\\ From ${lookupMap.length} keybinding entries, matched ${result.command}, when: ${printWhenExplanation(result.when)}, source: ${printSourceExplanation(result)}.`);

		return KbFound(result.command, result.commandArgs, result.bubble);
	}

	private _findCommand(context: IContext, matches: ResolvedKeybindingItem[]): ResolvedKeybindingItem | null {
		for (let i = matches.length - 1; i >= 0; i--) {
			const k = matches[i];

			if (!KeybindingResolver._contextMatchesRules(context, k.when)) {
				continue;
			}

			return k;
		}

		return null;
	}

	private static _contextMatchesRules(context: IContext, rules: ContextKeyExpression | null | undefined): boolean {
		if (!rules) {
			return true;
		}
		return rules.evaluate(context);
	}
}

function printWhenExplanation(when: ContextKeyExpression | undefined): string {
	if (!when) {
		return `no when condition`;
	}
	return `${when.serialize()}`;
}

function printSourceExplanation(kb: ResolvedKeybindingItem): string {
	return (
		kb.extensionId
			? (kb.isBuiltinExtension ? `built-in extension ${kb.extensionId}` : `user extension ${kb.extensionId}`)
			: (kb.isDefault ? `built-in` : `user`)
	);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/keybinding/common/keybindingsRegistry.ts]---
Location: vscode-main/src/vs/platform/keybinding/common/keybindingsRegistry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { decodeKeybinding, Keybinding } from '../../../base/common/keybindings.js';
import { OperatingSystem, OS } from '../../../base/common/platform.js';
import { CommandsRegistry, ICommandHandler, ICommandMetadata } from '../../commands/common/commands.js';
import { ContextKeyExpression } from '../../contextkey/common/contextkey.js';
import { Registry } from '../../registry/common/platform.js';
import { combinedDisposable, DisposableStore, IDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import { LinkedList } from '../../../base/common/linkedList.js';

export interface IKeybindingItem {
	keybinding: Keybinding | null;
	command: string | null;
	commandArgs?: any;
	when: ContextKeyExpression | null | undefined;
	weight1: number;
	weight2: number;
	extensionId: string | null;
	isBuiltinExtension: boolean;
}

export interface IKeybindings {
	primary?: number;
	secondary?: number[];
	win?: {
		primary: number;
		secondary?: number[];
	};
	linux?: {
		primary: number;
		secondary?: number[];
	};
	mac?: {
		primary: number;
		secondary?: number[];
	};
}

export interface IKeybindingRule extends IKeybindings {
	id: string;
	weight: number;
	args?: any;
	/**
	 * Keybinding is disabled if expression returns false.
	 */
	when?: ContextKeyExpression | null | undefined;
}

export interface IExtensionKeybindingRule {
	keybinding: Keybinding | null;
	id: string;
	args?: any;
	weight: number;
	when: ContextKeyExpression | undefined;
	extensionId?: string;
	isBuiltinExtension?: boolean;
}

export const enum KeybindingWeight {
	EditorCore = 0,
	EditorContrib = 100,
	WorkbenchContrib = 200,
	BuiltinExtension = 300,
	ExternalExtension = 400
}

export interface ICommandAndKeybindingRule<Args extends unknown[] = unknown[]> extends IKeybindingRule {
	handler: ICommandHandler<Args>;
	metadata?: ICommandMetadata | null;
}

export interface IKeybindingsRegistry {
	registerKeybindingRule(rule: IKeybindingRule): IDisposable;
	setExtensionKeybindings(rules: IExtensionKeybindingRule[]): void;
	registerCommandAndKeybindingRule<Args extends unknown[] = unknown[]>(desc: ICommandAndKeybindingRule<Args>): IDisposable;
	getDefaultKeybindings(): IKeybindingItem[];
}

/**
 * Stores all built-in and extension-provided keybindings (but not ones that user defines themselves)
 */
class KeybindingsRegistryImpl implements IKeybindingsRegistry {

	private _coreKeybindings: LinkedList<IKeybindingItem>;
	private _extensionKeybindings: IKeybindingItem[];
	private _cachedMergedKeybindings: IKeybindingItem[] | null;

	constructor() {
		this._coreKeybindings = new LinkedList();
		this._extensionKeybindings = [];
		this._cachedMergedKeybindings = null;
	}

	/**
	 * Take current platform into account and reduce to primary & secondary.
	 */
	private static bindToCurrentPlatform(kb: IKeybindings): { primary?: number; secondary?: number[] } {
		if (OS === OperatingSystem.Windows) {
			if (kb && kb.win) {
				return kb.win;
			}
		} else if (OS === OperatingSystem.Macintosh) {
			if (kb && kb.mac) {
				return kb.mac;
			}
		} else {
			if (kb && kb.linux) {
				return kb.linux;
			}
		}

		return kb;
	}

	public registerKeybindingRule(rule: IKeybindingRule): IDisposable {
		const actualKb = KeybindingsRegistryImpl.bindToCurrentPlatform(rule);
		const result = new DisposableStore();

		if (actualKb && actualKb.primary) {
			const kk = decodeKeybinding(actualKb.primary, OS);
			if (kk) {
				result.add(this._registerDefaultKeybinding(kk, rule.id, rule.args, rule.weight, 0, rule.when));
			}
		}

		if (actualKb && Array.isArray(actualKb.secondary)) {
			for (let i = 0, len = actualKb.secondary.length; i < len; i++) {
				const k = actualKb.secondary[i];
				const kk = decodeKeybinding(k, OS);
				if (kk) {
					result.add(this._registerDefaultKeybinding(kk, rule.id, rule.args, rule.weight, -i - 1, rule.when));
				}
			}
		}
		return result;
	}

	public setExtensionKeybindings(rules: IExtensionKeybindingRule[]): void {
		const result: IKeybindingItem[] = [];
		let keybindingsLen = 0;
		for (const rule of rules) {
			if (rule.keybinding) {
				result[keybindingsLen++] = {
					keybinding: rule.keybinding,
					command: rule.id,
					commandArgs: rule.args,
					when: rule.when,
					weight1: rule.weight,
					weight2: 0,
					extensionId: rule.extensionId || null,
					isBuiltinExtension: rule.isBuiltinExtension || false
				};
			}
		}

		this._extensionKeybindings = result;
		this._cachedMergedKeybindings = null;
	}

	public registerCommandAndKeybindingRule(desc: ICommandAndKeybindingRule): IDisposable {
		return combinedDisposable(
			this.registerKeybindingRule(desc),
			CommandsRegistry.registerCommand(desc)
		);
	}

	private _registerDefaultKeybinding(keybinding: Keybinding, commandId: string, commandArgs: any, weight1: number, weight2: number, when: ContextKeyExpression | null | undefined): IDisposable {
		const remove = this._coreKeybindings.push({
			keybinding: keybinding,
			command: commandId,
			commandArgs: commandArgs,
			when: when,
			weight1: weight1,
			weight2: weight2,
			extensionId: null,
			isBuiltinExtension: false
		});
		this._cachedMergedKeybindings = null;

		return toDisposable(() => {
			remove();
			this._cachedMergedKeybindings = null;
		});
	}

	public getDefaultKeybindings(): IKeybindingItem[] {
		if (!this._cachedMergedKeybindings) {
			this._cachedMergedKeybindings = Array.from(this._coreKeybindings).concat(this._extensionKeybindings);
			this._cachedMergedKeybindings.sort(sorter);
		}
		return this._cachedMergedKeybindings.slice(0);
	}
}
export const KeybindingsRegistry: IKeybindingsRegistry = new KeybindingsRegistryImpl();

// Define extension point ids
export const Extensions = {
	EditorModes: 'platform.keybindingsRegistry'
};
Registry.add(Extensions.EditorModes, KeybindingsRegistry);

function sorter(a: IKeybindingItem, b: IKeybindingItem): number {
	if (a.weight1 !== b.weight1) {
		return a.weight1 - b.weight1;
	}
	if (a.command && b.command) {
		if (a.command < b.command) {
			return -1;
		}
		if (a.command > b.command) {
			return 1;
		}
	}
	return a.weight2 - b.weight2;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/keybinding/common/resolvedKeybindingItem.ts]---
Location: vscode-main/src/vs/platform/keybinding/common/resolvedKeybindingItem.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CharCode } from '../../../base/common/charCode.js';
import { ResolvedKeybinding } from '../../../base/common/keybindings.js';
import { ContextKeyExpression } from '../../contextkey/common/contextkey.js';

export class ResolvedKeybindingItem {
	_resolvedKeybindingItemBrand: void = undefined;

	public readonly resolvedKeybinding: ResolvedKeybinding | undefined;
	public readonly chords: string[];
	public readonly bubble: boolean;
	public readonly command: string | null;
	public readonly commandArgs: any;
	public readonly when: ContextKeyExpression | undefined;
	public readonly isDefault: boolean;
	public readonly extensionId: string | null;
	public readonly isBuiltinExtension: boolean;

	constructor(resolvedKeybinding: ResolvedKeybinding | undefined, command: string | null, commandArgs: any, when: ContextKeyExpression | undefined, isDefault: boolean, extensionId: string | null, isBuiltinExtension: boolean) {
		this.resolvedKeybinding = resolvedKeybinding;
		this.chords = resolvedKeybinding ? toEmptyArrayIfContainsNull(resolvedKeybinding.getDispatchChords()) : [];
		if (resolvedKeybinding && this.chords.length === 0) {
			// handle possible single modifier chord keybindings
			this.chords = toEmptyArrayIfContainsNull(resolvedKeybinding.getSingleModifierDispatchChords());
		}
		this.bubble = (command ? command.charCodeAt(0) === CharCode.Caret : false);
		this.command = this.bubble ? command!.substr(1) : command;
		this.commandArgs = commandArgs;
		this.when = when;
		this.isDefault = isDefault;
		this.extensionId = extensionId;
		this.isBuiltinExtension = isBuiltinExtension;
	}
}

export function toEmptyArrayIfContainsNull<T>(arr: (T | null)[]): T[] {
	const result: T[] = [];
	for (let i = 0, len = arr.length; i < len; i++) {
		const element = arr[i];
		if (!element) {
			return [];
		}
		result.push(element);
	}
	return result;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/keybinding/common/usLayoutResolvedKeybinding.ts]---
Location: vscode-main/src/vs/platform/keybinding/common/usLayoutResolvedKeybinding.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyCode, KeyCodeUtils, IMMUTABLE_CODE_TO_KEY_CODE, ScanCode } from '../../../base/common/keyCodes.js';
import { SingleModifierChord, Chord, KeyCodeChord, Keybinding } from '../../../base/common/keybindings.js';
import { OperatingSystem } from '../../../base/common/platform.js';
import { BaseResolvedKeybinding } from './baseResolvedKeybinding.js';
import { toEmptyArrayIfContainsNull } from './resolvedKeybindingItem.js';

/**
 * Do not instantiate. Use KeybindingService to get a ResolvedKeybinding seeded with information about the current kb layout.
 */
export class USLayoutResolvedKeybinding extends BaseResolvedKeybinding<KeyCodeChord> {

	constructor(chords: KeyCodeChord[], os: OperatingSystem) {
		super(os, chords);
	}

	private _keyCodeToUILabel(keyCode: KeyCode): string {
		if (this._os === OperatingSystem.Macintosh) {
			switch (keyCode) {
				case KeyCode.LeftArrow:
					return '←';
				case KeyCode.UpArrow:
					return '↑';
				case KeyCode.RightArrow:
					return '→';
				case KeyCode.DownArrow:
					return '↓';
			}
		}
		return KeyCodeUtils.toString(keyCode);
	}

	protected _getLabel(chord: KeyCodeChord): string | null {
		if (chord.isDuplicateModifierCase()) {
			return '';
		}
		return this._keyCodeToUILabel(chord.keyCode);
	}

	protected _getAriaLabel(chord: KeyCodeChord): string | null {
		if (chord.isDuplicateModifierCase()) {
			return '';
		}
		return KeyCodeUtils.toString(chord.keyCode);
	}

	protected _getElectronAccelerator(chord: KeyCodeChord): string | null {
		return KeyCodeUtils.toElectronAccelerator(chord.keyCode);
	}

	protected _getUserSettingsLabel(chord: KeyCodeChord): string | null {
		if (chord.isDuplicateModifierCase()) {
			return '';
		}
		const result = KeyCodeUtils.toUserSettingsUS(chord.keyCode);
		return (result ? result.toLowerCase() : result);
	}

	protected _isWYSIWYG(): boolean {
		return true;
	}

	protected _getChordDispatch(chord: KeyCodeChord): string | null {
		return USLayoutResolvedKeybinding.getDispatchStr(chord);
	}

	public static getDispatchStr(chord: KeyCodeChord): string | null {
		if (chord.isModifierKey()) {
			return null;
		}
		let result = '';

		if (chord.ctrlKey) {
			result += 'ctrl+';
		}
		if (chord.shiftKey) {
			result += 'shift+';
		}
		if (chord.altKey) {
			result += 'alt+';
		}
		if (chord.metaKey) {
			result += 'meta+';
		}
		result += KeyCodeUtils.toString(chord.keyCode);

		return result;
	}

	protected _getSingleModifierChordDispatch(keybinding: KeyCodeChord): SingleModifierChord | null {
		if (keybinding.keyCode === KeyCode.Ctrl && !keybinding.shiftKey && !keybinding.altKey && !keybinding.metaKey) {
			return 'ctrl';
		}
		if (keybinding.keyCode === KeyCode.Shift && !keybinding.ctrlKey && !keybinding.altKey && !keybinding.metaKey) {
			return 'shift';
		}
		if (keybinding.keyCode === KeyCode.Alt && !keybinding.ctrlKey && !keybinding.shiftKey && !keybinding.metaKey) {
			return 'alt';
		}
		if (keybinding.keyCode === KeyCode.Meta && !keybinding.ctrlKey && !keybinding.shiftKey && !keybinding.altKey) {
			return 'meta';
		}
		return null;
	}

	/**
	 * *NOTE*: Check return value for `KeyCode.Unknown`.
	 */
	private static _scanCodeToKeyCode(scanCode: ScanCode): KeyCode {
		const immutableKeyCode = IMMUTABLE_CODE_TO_KEY_CODE[scanCode];
		if (immutableKeyCode !== KeyCode.DependsOnKbLayout) {
			return immutableKeyCode;
		}

		switch (scanCode) {
			case ScanCode.KeyA: return KeyCode.KeyA;
			case ScanCode.KeyB: return KeyCode.KeyB;
			case ScanCode.KeyC: return KeyCode.KeyC;
			case ScanCode.KeyD: return KeyCode.KeyD;
			case ScanCode.KeyE: return KeyCode.KeyE;
			case ScanCode.KeyF: return KeyCode.KeyF;
			case ScanCode.KeyG: return KeyCode.KeyG;
			case ScanCode.KeyH: return KeyCode.KeyH;
			case ScanCode.KeyI: return KeyCode.KeyI;
			case ScanCode.KeyJ: return KeyCode.KeyJ;
			case ScanCode.KeyK: return KeyCode.KeyK;
			case ScanCode.KeyL: return KeyCode.KeyL;
			case ScanCode.KeyM: return KeyCode.KeyM;
			case ScanCode.KeyN: return KeyCode.KeyN;
			case ScanCode.KeyO: return KeyCode.KeyO;
			case ScanCode.KeyP: return KeyCode.KeyP;
			case ScanCode.KeyQ: return KeyCode.KeyQ;
			case ScanCode.KeyR: return KeyCode.KeyR;
			case ScanCode.KeyS: return KeyCode.KeyS;
			case ScanCode.KeyT: return KeyCode.KeyT;
			case ScanCode.KeyU: return KeyCode.KeyU;
			case ScanCode.KeyV: return KeyCode.KeyV;
			case ScanCode.KeyW: return KeyCode.KeyW;
			case ScanCode.KeyX: return KeyCode.KeyX;
			case ScanCode.KeyY: return KeyCode.KeyY;
			case ScanCode.KeyZ: return KeyCode.KeyZ;
			case ScanCode.Digit1: return KeyCode.Digit1;
			case ScanCode.Digit2: return KeyCode.Digit2;
			case ScanCode.Digit3: return KeyCode.Digit3;
			case ScanCode.Digit4: return KeyCode.Digit4;
			case ScanCode.Digit5: return KeyCode.Digit5;
			case ScanCode.Digit6: return KeyCode.Digit6;
			case ScanCode.Digit7: return KeyCode.Digit7;
			case ScanCode.Digit8: return KeyCode.Digit8;
			case ScanCode.Digit9: return KeyCode.Digit9;
			case ScanCode.Digit0: return KeyCode.Digit0;
			case ScanCode.Minus: return KeyCode.Minus;
			case ScanCode.Equal: return KeyCode.Equal;
			case ScanCode.BracketLeft: return KeyCode.BracketLeft;
			case ScanCode.BracketRight: return KeyCode.BracketRight;
			case ScanCode.Backslash: return KeyCode.Backslash;
			case ScanCode.IntlHash: return KeyCode.Unknown; // missing
			case ScanCode.Semicolon: return KeyCode.Semicolon;
			case ScanCode.Quote: return KeyCode.Quote;
			case ScanCode.Backquote: return KeyCode.Backquote;
			case ScanCode.Comma: return KeyCode.Comma;
			case ScanCode.Period: return KeyCode.Period;
			case ScanCode.Slash: return KeyCode.Slash;
			case ScanCode.IntlBackslash: return KeyCode.IntlBackslash;
		}
		return KeyCode.Unknown;
	}

	private static _toKeyCodeChord(chord: Chord | null): KeyCodeChord | null {
		if (!chord) {
			return null;
		}
		if (chord instanceof KeyCodeChord) {
			return chord;
		}
		const keyCode = this._scanCodeToKeyCode(chord.scanCode);
		if (keyCode === KeyCode.Unknown) {
			return null;
		}
		return new KeyCodeChord(chord.ctrlKey, chord.shiftKey, chord.altKey, chord.metaKey, keyCode);
	}

	public static resolveKeybinding(keybinding: Keybinding, os: OperatingSystem): USLayoutResolvedKeybinding[] {
		const chords: KeyCodeChord[] = toEmptyArrayIfContainsNull(keybinding.chords.map(chord => this._toKeyCodeChord(chord)));
		if (chords.length > 0) {
			return [new USLayoutResolvedKeybinding(chords, os)];
		}
		return [];
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/keybinding/test/common/abstractKeybindingService.test.ts]---
Location: vscode-main/src/vs/platform/keybinding/test/common/abstractKeybindingService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { KeyChord, KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { createSimpleKeybinding, ResolvedKeybinding, KeyCodeChord, Keybinding } from '../../../../base/common/keybindings.js';
import { Disposable, IDisposable } from '../../../../base/common/lifecycle.js';
import { OS } from '../../../../base/common/platform.js';
import Severity from '../../../../base/common/severity.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { ICommandService } from '../../../commands/common/commands.js';
import { ContextKeyExpr, ContextKeyExpression, IContext, IContextKeyService, IContextKeyServiceTarget } from '../../../contextkey/common/contextkey.js';
import { AbstractKeybindingService } from '../../common/abstractKeybindingService.js';
import { IKeyboardEvent } from '../../common/keybinding.js';
import { KeybindingResolver } from '../../common/keybindingResolver.js';
import { ResolvedKeybindingItem } from '../../common/resolvedKeybindingItem.js';
import { USLayoutResolvedKeybinding } from '../../common/usLayoutResolvedKeybinding.js';
import { createUSLayoutResolvedKeybinding } from './keybindingsTestUtils.js';
import { NullLogService } from '../../../log/common/log.js';
import { INotification, INotificationService, IPromptChoice, IPromptOptions, IStatusMessageOptions, NoOpNotification } from '../../../notification/common/notification.js';
import { NullTelemetryService } from '../../../telemetry/common/telemetryUtils.js';

function createContext(ctx: any) {
	return {
		getValue: (key: string) => {
			return ctx[key];
		}
	};
}

suite('AbstractKeybindingService', () => {

	class TestKeybindingService extends AbstractKeybindingService {
		private _resolver: KeybindingResolver;

		constructor(
			resolver: KeybindingResolver,
			contextKeyService: IContextKeyService,
			commandService: ICommandService,
			notificationService: INotificationService
		) {
			super(contextKeyService, commandService, NullTelemetryService, notificationService, new NullLogService());
			this._resolver = resolver;
		}

		protected _getResolver(): KeybindingResolver {
			return this._resolver;
		}

		protected _documentHasFocus(): boolean {
			return true;
		}

		public resolveKeybinding(kb: Keybinding): ResolvedKeybinding[] {
			return USLayoutResolvedKeybinding.resolveKeybinding(kb, OS);
		}

		public resolveKeyboardEvent(keyboardEvent: IKeyboardEvent): ResolvedKeybinding {
			const chord = new KeyCodeChord(
				keyboardEvent.ctrlKey,
				keyboardEvent.shiftKey,
				keyboardEvent.altKey,
				keyboardEvent.metaKey,
				keyboardEvent.keyCode
			).toKeybinding();
			return this.resolveKeybinding(chord)[0];
		}

		public resolveUserBinding(userBinding: string): ResolvedKeybinding[] {
			return [];
		}

		public testDispatch(kb: number): boolean {
			const keybinding = createSimpleKeybinding(kb, OS);
			return this._dispatch({
				_standardKeyboardEventBrand: true,
				ctrlKey: keybinding.ctrlKey,
				shiftKey: keybinding.shiftKey,
				altKey: keybinding.altKey,
				metaKey: keybinding.metaKey,
				altGraphKey: false,
				keyCode: keybinding.keyCode,
				code: null!
			}, null!);
		}

		public _dumpDebugInfo(): string {
			return '';
		}

		public _dumpDebugInfoJSON(): string {
			return '';
		}

		public registerSchemaContribution(): IDisposable {
			return Disposable.None;
		}

		public enableKeybindingHoldMode() {
			return undefined;
		}
	}

	let createTestKeybindingService: (items: ResolvedKeybindingItem[], contextValue?: any) => TestKeybindingService = null!;
	let currentContextValue: IContext | null = null;
	let executeCommandCalls: { commandId: string; args: unknown[] }[] = null!;
	let showMessageCalls: { sev: Severity; message: any }[] = null!;
	let statusMessageCalls: string[] | null = null;
	let statusMessageCallsDisposed: string[] | null = null;


	teardown(() => {
		currentContextValue = null;
		executeCommandCalls = null!;
		showMessageCalls = null!;
		createTestKeybindingService = null!;
		statusMessageCalls = null;
		statusMessageCallsDisposed = null;
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	setup(() => {
		executeCommandCalls = [];
		showMessageCalls = [];
		statusMessageCalls = [];
		statusMessageCallsDisposed = [];

		createTestKeybindingService = (items: ResolvedKeybindingItem[]): TestKeybindingService => {

			const contextKeyService: IContextKeyService = {
				_serviceBrand: undefined,
				onDidChangeContext: undefined!,
				bufferChangeEvents() { },
				createKey: undefined!,
				contextMatchesRules: undefined!,
				getContextKeyValue: undefined!,
				createScoped: undefined!,
				createOverlay: undefined!,
				getContext: (target: IContextKeyServiceTarget): any => {
					return currentContextValue;
				},
				updateParent: () => { }
			};

			const commandService: ICommandService = {
				_serviceBrand: undefined,
				onWillExecuteCommand: () => Disposable.None,
				onDidExecuteCommand: () => Disposable.None,
				executeCommand: (commandId: string, ...args: unknown[]): Promise<any> => {
					executeCommandCalls.push({
						commandId: commandId,
						args: args
					});
					return Promise.resolve(undefined);
				}
			};

			const notificationService: INotificationService = {
				_serviceBrand: undefined,
				onDidChangeFilter: undefined!,
				notify: (notification: INotification) => {
					showMessageCalls.push({ sev: notification.severity, message: notification.message });
					return new NoOpNotification();
				},
				info: (message: any) => {
					showMessageCalls.push({ sev: Severity.Info, message });
					return new NoOpNotification();
				},
				warn: (message: any) => {
					showMessageCalls.push({ sev: Severity.Warning, message });
					return new NoOpNotification();
				},
				error: (message: any) => {
					showMessageCalls.push({ sev: Severity.Error, message });
					return new NoOpNotification();
				},
				prompt(severity: Severity, message: string, choices: IPromptChoice[], options?: IPromptOptions) {
					throw new Error('not implemented');
				},
				status(message: string, options?: IStatusMessageOptions) {
					statusMessageCalls!.push(message);
					return {
						close: () => {
							statusMessageCallsDisposed!.push(message);
						}
					};
				},
				setFilter() {
					throw new Error('not implemented');
				},
				getFilter() {
					throw new Error('not implemented');
				},
				getFilters() {
					throw new Error('not implemented');
				},
				removeFilter() {
					throw new Error('not implemented');
				}
			};

			const resolver = new KeybindingResolver(items, [], () => { });

			return new TestKeybindingService(resolver, contextKeyService, commandService, notificationService);
		};
	});

	function kbItem(keybinding: number | number[], command: string | null, when?: ContextKeyExpression): ResolvedKeybindingItem {
		return new ResolvedKeybindingItem(
			createUSLayoutResolvedKeybinding(keybinding, OS),
			command,
			null,
			when,
			true,
			null,
			false
		);
	}

	function toUsLabel(keybinding: number): string {
		return createUSLayoutResolvedKeybinding(keybinding, OS)!.getLabel()!;
	}

	suite('simple tests: single- and multi-chord keybindings are dispatched', () => {

		test('a single-chord keybinding is dispatched correctly; this test makes sure the dispatch in general works before we test empty-string/null command ID', () => {

			const key = KeyMod.CtrlCmd | KeyCode.KeyK;
			const kbService = createTestKeybindingService([
				kbItem(key, 'myCommand'),
			]);

			currentContextValue = createContext({});
			const shouldPreventDefault = kbService.testDispatch(key);
			assert.deepStrictEqual(shouldPreventDefault, true);
			assert.deepStrictEqual(executeCommandCalls, ([{ commandId: 'myCommand', args: [null] }]));
			assert.deepStrictEqual(showMessageCalls, []);
			assert.deepStrictEqual(statusMessageCalls, []);
			assert.deepStrictEqual(statusMessageCallsDisposed, []);

			kbService.dispose();
		});

		test('a multi-chord keybinding is dispatched correctly', () => {

			const chord0 = KeyMod.CtrlCmd | KeyCode.KeyK;
			const chord1 = KeyMod.CtrlCmd | KeyCode.KeyI;
			const key = [chord0, chord1];
			const kbService = createTestKeybindingService([
				kbItem(key, 'myCommand'),
			]);

			currentContextValue = createContext({});

			let shouldPreventDefault = kbService.testDispatch(chord0);
			assert.deepStrictEqual(shouldPreventDefault, true);
			assert.deepStrictEqual(executeCommandCalls, []);
			assert.deepStrictEqual(showMessageCalls, []);
			assert.deepStrictEqual(statusMessageCalls, ([`(${toUsLabel(chord0)}) was pressed. Waiting for second key of chord...`]));
			assert.deepStrictEqual(statusMessageCallsDisposed, []);

			shouldPreventDefault = kbService.testDispatch(chord1);
			assert.deepStrictEqual(shouldPreventDefault, true);
			assert.deepStrictEqual(executeCommandCalls, ([{ commandId: 'myCommand', args: [null] }]));
			assert.deepStrictEqual(showMessageCalls, []);
			assert.deepStrictEqual(statusMessageCalls, ([`(${toUsLabel(chord0)}) was pressed. Waiting for second key of chord...`]));
			assert.deepStrictEqual(statusMessageCallsDisposed, ([`(${toUsLabel(chord0)}) was pressed. Waiting for second key of chord...`]));

			kbService.dispose();
		});
	});

	suite('keybindings with empty-string/null command ID', () => {

		test('a single-chord keybinding with an empty string command ID unbinds the keybinding (shouldPreventDefault = false)', () => {

			const kbService = createTestKeybindingService([
				kbItem(KeyMod.CtrlCmd | KeyCode.KeyK, 'myCommand'),
				kbItem(KeyMod.CtrlCmd | KeyCode.KeyK, ''),
			]);

			// send Ctrl/Cmd + K
			currentContextValue = createContext({});
			const shouldPreventDefault = kbService.testDispatch(KeyMod.CtrlCmd | KeyCode.KeyK);
			assert.deepStrictEqual(shouldPreventDefault, false);
			assert.deepStrictEqual(executeCommandCalls, []);
			assert.deepStrictEqual(showMessageCalls, []);
			assert.deepStrictEqual(statusMessageCalls, []);
			assert.deepStrictEqual(statusMessageCallsDisposed, []);

			kbService.dispose();
		});

		test('a single-chord keybinding with a null command ID unbinds the keybinding (shouldPreventDefault = false)', () => {

			const kbService = createTestKeybindingService([
				kbItem(KeyMod.CtrlCmd | KeyCode.KeyK, 'myCommand'),
				kbItem(KeyMod.CtrlCmd | KeyCode.KeyK, null),
			]);

			// send Ctrl/Cmd + K
			currentContextValue = createContext({});
			const shouldPreventDefault = kbService.testDispatch(KeyMod.CtrlCmd | KeyCode.KeyK);
			assert.deepStrictEqual(shouldPreventDefault, false);
			assert.deepStrictEqual(executeCommandCalls, []);
			assert.deepStrictEqual(showMessageCalls, []);
			assert.deepStrictEqual(statusMessageCalls, []);
			assert.deepStrictEqual(statusMessageCallsDisposed, []);

			kbService.dispose();
		});

		test('a multi-chord keybinding with an empty-string command ID keeps the keybinding (shouldPreventDefault = true)', () => {

			const chord0 = KeyMod.CtrlCmd | KeyCode.KeyK;
			const chord1 = KeyMod.CtrlCmd | KeyCode.KeyI;
			const key = [chord0, chord1];
			const kbService = createTestKeybindingService([
				kbItem(key, 'myCommand'),
				kbItem(key, ''),
			]);

			currentContextValue = createContext({});

			let shouldPreventDefault = kbService.testDispatch(KeyMod.CtrlCmd | KeyCode.KeyK);
			assert.deepStrictEqual(shouldPreventDefault, true);
			assert.deepStrictEqual(executeCommandCalls, []);
			assert.deepStrictEqual(showMessageCalls, []);
			assert.deepStrictEqual(statusMessageCalls, ([`(${toUsLabel(chord0)}) was pressed. Waiting for second key of chord...`]));
			assert.deepStrictEqual(statusMessageCallsDisposed, []);

			shouldPreventDefault = kbService.testDispatch(KeyMod.CtrlCmd | KeyCode.KeyI);
			assert.deepStrictEqual(shouldPreventDefault, true);
			assert.deepStrictEqual(executeCommandCalls, []);
			assert.deepStrictEqual(showMessageCalls, []);
			assert.deepStrictEqual(statusMessageCalls, ([`(${toUsLabel(chord0)}) was pressed. Waiting for second key of chord...`, `The key combination (${toUsLabel(chord0)}, ${toUsLabel(chord1)}) is not a command.`]));
			assert.deepStrictEqual(statusMessageCallsDisposed, ([`(${toUsLabel(chord0)}) was pressed. Waiting for second key of chord...`]));

			kbService.dispose();
		});

		test('a multi-chord keybinding with a null command ID keeps the keybinding (shouldPreventDefault = true)', () => {

			const chord0 = KeyMod.CtrlCmd | KeyCode.KeyK;
			const chord1 = KeyMod.CtrlCmd | KeyCode.KeyI;
			const key = [chord0, chord1];
			const kbService = createTestKeybindingService([
				kbItem(key, 'myCommand'),
				kbItem(key, null),
			]);

			currentContextValue = createContext({});

			let shouldPreventDefault = kbService.testDispatch(KeyMod.CtrlCmd | KeyCode.KeyK);
			assert.deepStrictEqual(shouldPreventDefault, true);
			assert.deepStrictEqual(executeCommandCalls, []);
			assert.deepStrictEqual(showMessageCalls, []);
			assert.deepStrictEqual(statusMessageCalls, ([`(${toUsLabel(chord0)}) was pressed. Waiting for second key of chord...`]));
			assert.deepStrictEqual(statusMessageCallsDisposed, []);

			shouldPreventDefault = kbService.testDispatch(KeyMod.CtrlCmd | KeyCode.KeyI);
			assert.deepStrictEqual(shouldPreventDefault, true);
			assert.deepStrictEqual(executeCommandCalls, []);
			assert.deepStrictEqual(showMessageCalls, []);
			assert.deepStrictEqual(statusMessageCalls, ([`(${toUsLabel(chord0)}) was pressed. Waiting for second key of chord...`, `The key combination (${toUsLabel(chord0)}, ${toUsLabel(chord1)}) is not a command.`]));
			assert.deepStrictEqual(statusMessageCallsDisposed, ([`(${toUsLabel(chord0)}) was pressed. Waiting for second key of chord...`]));

			kbService.dispose();
		});

	});

	test('issue #16498: chord mode is quit for invalid chords', () => {

		const kbService = createTestKeybindingService([
			kbItem(KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.KeyX), 'chordCommand'),
			kbItem(KeyCode.Backspace, 'simpleCommand'),
		]);

		// send Ctrl/Cmd + K
		let shouldPreventDefault = kbService.testDispatch(KeyMod.CtrlCmd | KeyCode.KeyK);
		assert.strictEqual(shouldPreventDefault, true);
		assert.deepStrictEqual(executeCommandCalls, []);
		assert.deepStrictEqual(showMessageCalls, []);
		assert.deepStrictEqual(statusMessageCalls, [
			`(${toUsLabel(KeyMod.CtrlCmd | KeyCode.KeyK)}) was pressed. Waiting for second key of chord...`
		]);
		assert.deepStrictEqual(statusMessageCallsDisposed, []);
		executeCommandCalls = [];
		showMessageCalls = [];
		statusMessageCalls = [];
		statusMessageCallsDisposed = [];

		// send backspace
		shouldPreventDefault = kbService.testDispatch(KeyCode.Backspace);
		assert.strictEqual(shouldPreventDefault, true);
		assert.deepStrictEqual(executeCommandCalls, []);
		assert.deepStrictEqual(showMessageCalls, []);
		assert.deepStrictEqual(statusMessageCalls, [
			`The key combination (${toUsLabel(KeyMod.CtrlCmd | KeyCode.KeyK)}, ${toUsLabel(KeyCode.Backspace)}) is not a command.`
		]);
		assert.deepStrictEqual(statusMessageCallsDisposed, [
			`(${toUsLabel(KeyMod.CtrlCmd | KeyCode.KeyK)}) was pressed. Waiting for second key of chord...`
		]);
		executeCommandCalls = [];
		showMessageCalls = [];
		statusMessageCalls = [];
		statusMessageCallsDisposed = [];

		// send backspace
		shouldPreventDefault = kbService.testDispatch(KeyCode.Backspace);
		assert.strictEqual(shouldPreventDefault, true);
		assert.deepStrictEqual(executeCommandCalls, [{
			commandId: 'simpleCommand',
			args: [null]
		}]);
		assert.deepStrictEqual(showMessageCalls, []);
		assert.deepStrictEqual(statusMessageCalls, []);
		assert.deepStrictEqual(statusMessageCallsDisposed, []);
		executeCommandCalls = [];
		showMessageCalls = [];
		statusMessageCalls = [];
		statusMessageCallsDisposed = [];

		kbService.dispose();
	});

	test('issue #16833: Keybinding service should not testDispatch on modifier keys', () => {

		const kbService = createTestKeybindingService([
			kbItem(KeyCode.Ctrl, 'nope'),
			kbItem(KeyCode.Meta, 'nope'),
			kbItem(KeyCode.Alt, 'nope'),
			kbItem(KeyCode.Shift, 'nope'),

			kbItem(KeyMod.CtrlCmd, 'nope'),
			kbItem(KeyMod.WinCtrl, 'nope'),
			kbItem(KeyMod.Alt, 'nope'),
			kbItem(KeyMod.Shift, 'nope'),
		]);

		function assertIsIgnored(keybinding: number): void {
			const shouldPreventDefault = kbService.testDispatch(keybinding);
			assert.strictEqual(shouldPreventDefault, false);
			assert.deepStrictEqual(executeCommandCalls, []);
			assert.deepStrictEqual(showMessageCalls, []);
			assert.deepStrictEqual(statusMessageCalls, []);
			assert.deepStrictEqual(statusMessageCallsDisposed, []);
			executeCommandCalls = [];
			showMessageCalls = [];
			statusMessageCalls = [];
			statusMessageCallsDisposed = [];
		}

		assertIsIgnored(KeyCode.Ctrl);
		assertIsIgnored(KeyCode.Meta);
		assertIsIgnored(KeyCode.Alt);
		assertIsIgnored(KeyCode.Shift);

		assertIsIgnored(KeyMod.CtrlCmd);
		assertIsIgnored(KeyMod.WinCtrl);
		assertIsIgnored(KeyMod.Alt);
		assertIsIgnored(KeyMod.Shift);

		kbService.dispose();
	});

	test('can trigger command that is sharing keybinding with chord', () => {

		const kbService = createTestKeybindingService([
			kbItem(KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.KeyX), 'chordCommand'),
			kbItem(KeyMod.CtrlCmd | KeyCode.KeyK, 'simpleCommand', ContextKeyExpr.has('key1')),
		]);


		// send Ctrl/Cmd + K
		currentContextValue = createContext({
			key1: true
		});
		let shouldPreventDefault = kbService.testDispatch(KeyMod.CtrlCmd | KeyCode.KeyK);
		assert.strictEqual(shouldPreventDefault, true);
		assert.deepStrictEqual(executeCommandCalls, [{
			commandId: 'simpleCommand',
			args: [null]
		}]);
		assert.deepStrictEqual(showMessageCalls, []);
		assert.deepStrictEqual(statusMessageCalls, []);
		assert.deepStrictEqual(statusMessageCallsDisposed, []);
		executeCommandCalls = [];
		showMessageCalls = [];
		statusMessageCalls = [];
		statusMessageCallsDisposed = [];

		// send Ctrl/Cmd + K
		currentContextValue = createContext({});
		shouldPreventDefault = kbService.testDispatch(KeyMod.CtrlCmd | KeyCode.KeyK);
		assert.strictEqual(shouldPreventDefault, true);
		assert.deepStrictEqual(executeCommandCalls, []);
		assert.deepStrictEqual(showMessageCalls, []);
		assert.deepStrictEqual(statusMessageCalls, [
			`(${toUsLabel(KeyMod.CtrlCmd | KeyCode.KeyK)}) was pressed. Waiting for second key of chord...`
		]);
		assert.deepStrictEqual(statusMessageCallsDisposed, []);
		executeCommandCalls = [];
		showMessageCalls = [];
		statusMessageCalls = [];
		statusMessageCallsDisposed = [];

		// send Ctrl/Cmd + X
		currentContextValue = createContext({});
		shouldPreventDefault = kbService.testDispatch(KeyMod.CtrlCmd | KeyCode.KeyX);
		assert.strictEqual(shouldPreventDefault, true);
		assert.deepStrictEqual(executeCommandCalls, [{
			commandId: 'chordCommand',
			args: [null]
		}]);
		assert.deepStrictEqual(showMessageCalls, []);
		assert.deepStrictEqual(statusMessageCalls, []);
		assert.deepStrictEqual(statusMessageCallsDisposed, [
			`(${toUsLabel(KeyMod.CtrlCmd | KeyCode.KeyK)}) was pressed. Waiting for second key of chord...`
		]);
		executeCommandCalls = [];
		showMessageCalls = [];
		statusMessageCalls = [];
		statusMessageCallsDisposed = [];

		kbService.dispose();
	});

	test('cannot trigger chord if command is overwriting', () => {

		const kbService = createTestKeybindingService([
			kbItem(KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.KeyX), 'chordCommand', ContextKeyExpr.has('key1')),
			kbItem(KeyMod.CtrlCmd | KeyCode.KeyK, 'simpleCommand'),
		]);


		// send Ctrl/Cmd + K
		currentContextValue = createContext({});
		let shouldPreventDefault = kbService.testDispatch(KeyMod.CtrlCmd | KeyCode.KeyK);
		assert.strictEqual(shouldPreventDefault, true);
		assert.deepStrictEqual(executeCommandCalls, [{
			commandId: 'simpleCommand',
			args: [null]
		}]);
		assert.deepStrictEqual(showMessageCalls, []);
		assert.deepStrictEqual(statusMessageCalls, []);
		assert.deepStrictEqual(statusMessageCallsDisposed, []);
		executeCommandCalls = [];
		showMessageCalls = [];
		statusMessageCalls = [];
		statusMessageCallsDisposed = [];

		// send Ctrl/Cmd + K
		currentContextValue = createContext({
			key1: true
		});
		shouldPreventDefault = kbService.testDispatch(KeyMod.CtrlCmd | KeyCode.KeyK);
		assert.strictEqual(shouldPreventDefault, true);
		assert.deepStrictEqual(executeCommandCalls, [{
			commandId: 'simpleCommand',
			args: [null]
		}]);
		assert.deepStrictEqual(showMessageCalls, []);
		assert.deepStrictEqual(statusMessageCalls, []);
		assert.deepStrictEqual(statusMessageCallsDisposed, []);
		executeCommandCalls = [];
		showMessageCalls = [];
		statusMessageCalls = [];
		statusMessageCallsDisposed = [];

		// send Ctrl/Cmd + X
		currentContextValue = createContext({
			key1: true
		});
		shouldPreventDefault = kbService.testDispatch(KeyMod.CtrlCmd | KeyCode.KeyX);
		assert.strictEqual(shouldPreventDefault, false);
		assert.deepStrictEqual(executeCommandCalls, []);
		assert.deepStrictEqual(showMessageCalls, []);
		assert.deepStrictEqual(statusMessageCalls, []);
		assert.deepStrictEqual(statusMessageCallsDisposed, []);
		executeCommandCalls = [];
		showMessageCalls = [];
		statusMessageCalls = [];
		statusMessageCallsDisposed = [];

		kbService.dispose();
	});

	test('can have spying command', () => {

		const kbService = createTestKeybindingService([
			kbItem(KeyMod.CtrlCmd | KeyCode.KeyK, '^simpleCommand'),
		]);

		// send Ctrl/Cmd + K
		currentContextValue = createContext({});
		const shouldPreventDefault = kbService.testDispatch(KeyMod.CtrlCmd | KeyCode.KeyK);
		assert.strictEqual(shouldPreventDefault, false);
		assert.deepStrictEqual(executeCommandCalls, [{
			commandId: 'simpleCommand',
			args: [null]
		}]);
		assert.deepStrictEqual(showMessageCalls, []);
		assert.deepStrictEqual(statusMessageCalls, []);
		assert.deepStrictEqual(statusMessageCallsDisposed, []);
		executeCommandCalls = [];
		showMessageCalls = [];
		statusMessageCalls = [];
		statusMessageCallsDisposed = [];

		kbService.dispose();
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/keybinding/test/common/keybindingLabels.test.ts]---
Location: vscode-main/src/vs/platform/keybinding/test/common/keybindingLabels.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { KeyChord, KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { OperatingSystem } from '../../../../base/common/platform.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { createUSLayoutResolvedKeybinding } from './keybindingsTestUtils.js';

suite('KeybindingLabels', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	function assertUSLabel(OS: OperatingSystem, keybinding: number, expected: string): void {
		const usResolvedKeybinding = createUSLayoutResolvedKeybinding(keybinding, OS)!;
		assert.strictEqual(usResolvedKeybinding.getLabel(), expected);
	}

	test('Windows US label', () => {
		// no modifier
		assertUSLabel(OperatingSystem.Windows, KeyCode.KeyA, 'A');

		// one modifier
		assertUSLabel(OperatingSystem.Windows, KeyMod.CtrlCmd | KeyCode.KeyA, 'Ctrl+A');
		assertUSLabel(OperatingSystem.Windows, KeyMod.Shift | KeyCode.KeyA, 'Shift+A');
		assertUSLabel(OperatingSystem.Windows, KeyMod.Alt | KeyCode.KeyA, 'Alt+A');
		assertUSLabel(OperatingSystem.Windows, KeyMod.WinCtrl | KeyCode.KeyA, 'Windows+A');

		// two modifiers
		assertUSLabel(OperatingSystem.Windows, KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyA, 'Ctrl+Shift+A');
		assertUSLabel(OperatingSystem.Windows, KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.KeyA, 'Ctrl+Alt+A');
		assertUSLabel(OperatingSystem.Windows, KeyMod.CtrlCmd | KeyMod.WinCtrl | KeyCode.KeyA, 'Ctrl+Windows+A');
		assertUSLabel(OperatingSystem.Windows, KeyMod.Shift | KeyMod.Alt | KeyCode.KeyA, 'Shift+Alt+A');
		assertUSLabel(OperatingSystem.Windows, KeyMod.Shift | KeyMod.WinCtrl | KeyCode.KeyA, 'Shift+Windows+A');
		assertUSLabel(OperatingSystem.Windows, KeyMod.Alt | KeyMod.WinCtrl | KeyCode.KeyA, 'Alt+Windows+A');

		// three modifiers
		assertUSLabel(OperatingSystem.Windows, KeyMod.CtrlCmd | KeyMod.Shift | KeyMod.Alt | KeyCode.KeyA, 'Ctrl+Shift+Alt+A');
		assertUSLabel(OperatingSystem.Windows, KeyMod.CtrlCmd | KeyMod.Shift | KeyMod.WinCtrl | KeyCode.KeyA, 'Ctrl+Shift+Windows+A');
		assertUSLabel(OperatingSystem.Windows, KeyMod.CtrlCmd | KeyMod.Alt | KeyMod.WinCtrl | KeyCode.KeyA, 'Ctrl+Alt+Windows+A');
		assertUSLabel(OperatingSystem.Windows, KeyMod.Shift | KeyMod.Alt | KeyMod.WinCtrl | KeyCode.KeyA, 'Shift+Alt+Windows+A');

		// four modifiers
		assertUSLabel(OperatingSystem.Windows, KeyMod.CtrlCmd | KeyMod.Shift | KeyMod.Alt | KeyMod.WinCtrl | KeyCode.KeyA, 'Ctrl+Shift+Alt+Windows+A');

		// chord
		assertUSLabel(OperatingSystem.Windows, KeyChord(KeyMod.CtrlCmd | KeyCode.KeyA, KeyMod.CtrlCmd | KeyCode.KeyB), 'Ctrl+A Ctrl+B');
	});

	test('Linux US label', () => {
		// no modifier
		assertUSLabel(OperatingSystem.Linux, KeyCode.KeyA, 'A');

		// one modifier
		assertUSLabel(OperatingSystem.Linux, KeyMod.CtrlCmd | KeyCode.KeyA, 'Ctrl+A');
		assertUSLabel(OperatingSystem.Linux, KeyMod.Shift | KeyCode.KeyA, 'Shift+A');
		assertUSLabel(OperatingSystem.Linux, KeyMod.Alt | KeyCode.KeyA, 'Alt+A');
		assertUSLabel(OperatingSystem.Linux, KeyMod.WinCtrl | KeyCode.KeyA, 'Super+A');

		// two modifiers
		assertUSLabel(OperatingSystem.Linux, KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyA, 'Ctrl+Shift+A');
		assertUSLabel(OperatingSystem.Linux, KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.KeyA, 'Ctrl+Alt+A');
		assertUSLabel(OperatingSystem.Linux, KeyMod.CtrlCmd | KeyMod.WinCtrl | KeyCode.KeyA, 'Ctrl+Super+A');
		assertUSLabel(OperatingSystem.Linux, KeyMod.Shift | KeyMod.Alt | KeyCode.KeyA, 'Shift+Alt+A');
		assertUSLabel(OperatingSystem.Linux, KeyMod.Shift | KeyMod.WinCtrl | KeyCode.KeyA, 'Shift+Super+A');
		assertUSLabel(OperatingSystem.Linux, KeyMod.Alt | KeyMod.WinCtrl | KeyCode.KeyA, 'Alt+Super+A');

		// three modifiers
		assertUSLabel(OperatingSystem.Linux, KeyMod.CtrlCmd | KeyMod.Shift | KeyMod.Alt | KeyCode.KeyA, 'Ctrl+Shift+Alt+A');
		assertUSLabel(OperatingSystem.Linux, KeyMod.CtrlCmd | KeyMod.Shift | KeyMod.WinCtrl | KeyCode.KeyA, 'Ctrl+Shift+Super+A');
		assertUSLabel(OperatingSystem.Linux, KeyMod.CtrlCmd | KeyMod.Alt | KeyMod.WinCtrl | KeyCode.KeyA, 'Ctrl+Alt+Super+A');
		assertUSLabel(OperatingSystem.Linux, KeyMod.Shift | KeyMod.Alt | KeyMod.WinCtrl | KeyCode.KeyA, 'Shift+Alt+Super+A');

		// four modifiers
		assertUSLabel(OperatingSystem.Linux, KeyMod.CtrlCmd | KeyMod.Shift | KeyMod.Alt | KeyMod.WinCtrl | KeyCode.KeyA, 'Ctrl+Shift+Alt+Super+A');

		// chord
		assertUSLabel(OperatingSystem.Linux, KeyChord(KeyMod.CtrlCmd | KeyCode.KeyA, KeyMod.CtrlCmd | KeyCode.KeyB), 'Ctrl+A Ctrl+B');
	});

	test('Mac US label', () => {
		// no modifier
		assertUSLabel(OperatingSystem.Macintosh, KeyCode.KeyA, 'A');

		// one modifier
		assertUSLabel(OperatingSystem.Macintosh, KeyMod.CtrlCmd | KeyCode.KeyA, '⌘A');
		assertUSLabel(OperatingSystem.Macintosh, KeyMod.Shift | KeyCode.KeyA, '⇧A');
		assertUSLabel(OperatingSystem.Macintosh, KeyMod.Alt | KeyCode.KeyA, '⌥A');
		assertUSLabel(OperatingSystem.Macintosh, KeyMod.WinCtrl | KeyCode.KeyA, '⌃A');

		// two modifiers
		assertUSLabel(OperatingSystem.Macintosh, KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyA, '⇧⌘A');
		assertUSLabel(OperatingSystem.Macintosh, KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.KeyA, '⌥⌘A');
		assertUSLabel(OperatingSystem.Macintosh, KeyMod.CtrlCmd | KeyMod.WinCtrl | KeyCode.KeyA, '⌃⌘A');
		assertUSLabel(OperatingSystem.Macintosh, KeyMod.Shift | KeyMod.Alt | KeyCode.KeyA, '⇧⌥A');
		assertUSLabel(OperatingSystem.Macintosh, KeyMod.Shift | KeyMod.WinCtrl | KeyCode.KeyA, '⌃⇧A');
		assertUSLabel(OperatingSystem.Macintosh, KeyMod.Alt | KeyMod.WinCtrl | KeyCode.KeyA, '⌃⌥A');

		// three modifiers
		assertUSLabel(OperatingSystem.Macintosh, KeyMod.CtrlCmd | KeyMod.Shift | KeyMod.Alt | KeyCode.KeyA, '⇧⌥⌘A');
		assertUSLabel(OperatingSystem.Macintosh, KeyMod.CtrlCmd | KeyMod.Shift | KeyMod.WinCtrl | KeyCode.KeyA, '⌃⇧⌘A');
		assertUSLabel(OperatingSystem.Macintosh, KeyMod.CtrlCmd | KeyMod.Alt | KeyMod.WinCtrl | KeyCode.KeyA, '⌃⌥⌘A');
		assertUSLabel(OperatingSystem.Macintosh, KeyMod.Shift | KeyMod.Alt | KeyMod.WinCtrl | KeyCode.KeyA, '⌃⇧⌥A');

		// four modifiers
		assertUSLabel(OperatingSystem.Macintosh, KeyMod.CtrlCmd | KeyMod.Shift | KeyMod.Alt | KeyMod.WinCtrl | KeyCode.KeyA, '⌃⇧⌥⌘A');

		// chord
		assertUSLabel(OperatingSystem.Macintosh, KeyChord(KeyMod.CtrlCmd | KeyCode.KeyA, KeyMod.CtrlCmd | KeyCode.KeyB), '⌘A ⌘B');

		// special keys
		assertUSLabel(OperatingSystem.Macintosh, KeyCode.LeftArrow, '←');
		assertUSLabel(OperatingSystem.Macintosh, KeyCode.UpArrow, '↑');
		assertUSLabel(OperatingSystem.Macintosh, KeyCode.RightArrow, '→');
		assertUSLabel(OperatingSystem.Macintosh, KeyCode.DownArrow, '↓');
	});

	test('Aria label', () => {
		function assertAriaLabel(OS: OperatingSystem, keybinding: number, expected: string): void {
			const usResolvedKeybinding = createUSLayoutResolvedKeybinding(keybinding, OS)!;
			assert.strictEqual(usResolvedKeybinding.getAriaLabel(), expected);
		}

		assertAriaLabel(OperatingSystem.Windows, KeyMod.CtrlCmd | KeyMod.Shift | KeyMod.Alt | KeyMod.WinCtrl | KeyCode.KeyA, 'Control+Shift+Alt+Windows+A');
		assertAriaLabel(OperatingSystem.Linux, KeyMod.CtrlCmd | KeyMod.Shift | KeyMod.Alt | KeyMod.WinCtrl | KeyCode.KeyA, 'Control+Shift+Alt+Super+A');
		assertAriaLabel(OperatingSystem.Macintosh, KeyMod.CtrlCmd | KeyMod.Shift | KeyMod.Alt | KeyMod.WinCtrl | KeyCode.KeyA, 'Control+Shift+Option+Command+A');
	});

	test('Electron Accelerator label', () => {
		function assertElectronAcceleratorLabel(OS: OperatingSystem, keybinding: number, expected: string | null): void {
			const usResolvedKeybinding = createUSLayoutResolvedKeybinding(keybinding, OS)!;
			assert.strictEqual(usResolvedKeybinding.getElectronAccelerator(), expected);
		}

		assertElectronAcceleratorLabel(OperatingSystem.Windows, KeyMod.CtrlCmd | KeyMod.Shift | KeyMod.Alt | KeyMod.WinCtrl | KeyCode.KeyA, 'Ctrl+Shift+Alt+Super+A');
		assertElectronAcceleratorLabel(OperatingSystem.Linux, KeyMod.CtrlCmd | KeyMod.Shift | KeyMod.Alt | KeyMod.WinCtrl | KeyCode.KeyA, 'Ctrl+Shift+Alt+Super+A');
		assertElectronAcceleratorLabel(OperatingSystem.Macintosh, KeyMod.CtrlCmd | KeyMod.Shift | KeyMod.Alt | KeyMod.WinCtrl | KeyCode.KeyA, 'Ctrl+Shift+Alt+Cmd+A');

		// electron cannot handle chords
		assertElectronAcceleratorLabel(OperatingSystem.Windows, KeyChord(KeyMod.CtrlCmd | KeyCode.KeyA, KeyMod.CtrlCmd | KeyCode.KeyB), null);
		assertElectronAcceleratorLabel(OperatingSystem.Linux, KeyChord(KeyMod.CtrlCmd | KeyCode.KeyA, KeyMod.CtrlCmd | KeyCode.KeyB), null);
		assertElectronAcceleratorLabel(OperatingSystem.Macintosh, KeyChord(KeyMod.CtrlCmd | KeyCode.KeyA, KeyMod.CtrlCmd | KeyCode.KeyB), null);

		// electron cannot handle numpad keys
		assertElectronAcceleratorLabel(OperatingSystem.Windows, KeyCode.Numpad1, null);
		assertElectronAcceleratorLabel(OperatingSystem.Linux, KeyCode.Numpad1, null);
		assertElectronAcceleratorLabel(OperatingSystem.Macintosh, KeyCode.Numpad1, null);

		// special
		assertElectronAcceleratorLabel(OperatingSystem.Macintosh, KeyCode.LeftArrow, 'Left');
		assertElectronAcceleratorLabel(OperatingSystem.Macintosh, KeyCode.UpArrow, 'Up');
		assertElectronAcceleratorLabel(OperatingSystem.Macintosh, KeyCode.RightArrow, 'Right');
		assertElectronAcceleratorLabel(OperatingSystem.Macintosh, KeyCode.DownArrow, 'Down');
	});

	test('User Settings label', () => {
		function assertElectronAcceleratorLabel(OS: OperatingSystem, keybinding: number, expected: string): void {
			const usResolvedKeybinding = createUSLayoutResolvedKeybinding(keybinding, OS)!;
			assert.strictEqual(usResolvedKeybinding.getUserSettingsLabel(), expected);
		}

		assertElectronAcceleratorLabel(OperatingSystem.Windows, KeyMod.CtrlCmd | KeyMod.Shift | KeyMod.Alt | KeyMod.WinCtrl | KeyCode.KeyA, 'ctrl+shift+alt+win+a');
		assertElectronAcceleratorLabel(OperatingSystem.Linux, KeyMod.CtrlCmd | KeyMod.Shift | KeyMod.Alt | KeyMod.WinCtrl | KeyCode.KeyA, 'ctrl+shift+alt+meta+a');
		assertElectronAcceleratorLabel(OperatingSystem.Macintosh, KeyMod.CtrlCmd | KeyMod.Shift | KeyMod.Alt | KeyMod.WinCtrl | KeyCode.KeyA, 'ctrl+shift+alt+cmd+a');

		// electron cannot handle chords
		assertElectronAcceleratorLabel(OperatingSystem.Windows, KeyChord(KeyMod.CtrlCmd | KeyCode.KeyA, KeyMod.CtrlCmd | KeyCode.KeyB), 'ctrl+a ctrl+b');
		assertElectronAcceleratorLabel(OperatingSystem.Linux, KeyChord(KeyMod.CtrlCmd | KeyCode.KeyA, KeyMod.CtrlCmd | KeyCode.KeyB), 'ctrl+a ctrl+b');
		assertElectronAcceleratorLabel(OperatingSystem.Macintosh, KeyChord(KeyMod.CtrlCmd | KeyCode.KeyA, KeyMod.CtrlCmd | KeyCode.KeyB), 'cmd+a cmd+b');
	});

	test('issue #91235: Do not end with a +', () => {
		assertUSLabel(OperatingSystem.Windows, KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.Alt, 'Ctrl+Alt');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/keybinding/test/common/keybindingResolver.test.ts]---
Location: vscode-main/src/vs/platform/keybinding/test/common/keybindingResolver.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { decodeKeybinding, createSimpleKeybinding, KeyCodeChord } from '../../../../base/common/keybindings.js';
import { KeyChord, KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { OS } from '../../../../base/common/platform.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { ContextKeyExpr, ContextKeyExpression, IContext } from '../../../contextkey/common/contextkey.js';
import { KeybindingResolver, ResultKind } from '../../common/keybindingResolver.js';
import { ResolvedKeybindingItem } from '../../common/resolvedKeybindingItem.js';
import { USLayoutResolvedKeybinding } from '../../common/usLayoutResolvedKeybinding.js';
import { createUSLayoutResolvedKeybinding } from './keybindingsTestUtils.js';

function createContext(ctx: any) {
	return {
		getValue: (key: string) => {
			return ctx[key];
		}
	};
}

suite('KeybindingResolver', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	function kbItem(keybinding: number | number[], command: string, commandArgs: any, when: ContextKeyExpression | undefined, isDefault: boolean): ResolvedKeybindingItem {
		const resolvedKeybinding = createUSLayoutResolvedKeybinding(keybinding, OS);
		return new ResolvedKeybindingItem(
			resolvedKeybinding,
			command,
			commandArgs,
			when,
			isDefault,
			null,
			false
		);
	}

	function getDispatchStr(chord: KeyCodeChord): string {
		return USLayoutResolvedKeybinding.getDispatchStr(chord)!;
	}

	test('resolve key', () => {
		const keybinding = KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyZ;
		const runtimeKeybinding = createSimpleKeybinding(keybinding, OS);
		const contextRules = ContextKeyExpr.equals('bar', 'baz');
		const keybindingItem = kbItem(keybinding, 'yes', null, contextRules, true);

		assert.strictEqual(contextRules.evaluate(createContext({ bar: 'baz' })), true);
		assert.strictEqual(contextRules.evaluate(createContext({ bar: 'bz' })), false);

		const resolver = new KeybindingResolver([keybindingItem], [], () => { });

		const r1 = resolver.resolve(createContext({ bar: 'baz' }), [], getDispatchStr(runtimeKeybinding));
		assert.ok(r1.kind === ResultKind.KbFound);
		assert.strictEqual(r1.commandId, 'yes');

		const r2 = resolver.resolve(createContext({ bar: 'bz' }), [], getDispatchStr(runtimeKeybinding));
		assert.strictEqual(r2.kind, ResultKind.NoMatchingKb);
	});

	test('resolve key with arguments', () => {
		const commandArgs = { text: 'no' };
		const keybinding = KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyZ;
		const runtimeKeybinding = createSimpleKeybinding(keybinding, OS);
		const contextRules = ContextKeyExpr.equals('bar', 'baz');
		const keybindingItem = kbItem(keybinding, 'yes', commandArgs, contextRules, true);

		const resolver = new KeybindingResolver([keybindingItem], [], () => { });

		const r = resolver.resolve(createContext({ bar: 'baz' }), [], getDispatchStr(runtimeKeybinding));
		assert.ok(r.kind === ResultKind.KbFound);
		assert.strictEqual(r.commandArgs, commandArgs);
	});

	suite('handle keybinding removals', () => {

		test('simple 1', () => {
			const defaults = [
				kbItem(KeyCode.KeyA, 'yes1', null, ContextKeyExpr.equals('1', 'a'), true)
			];
			const overrides = [
				kbItem(KeyCode.KeyB, 'yes2', null, ContextKeyExpr.equals('2', 'b'), false)
			];
			const actual = KeybindingResolver.handleRemovals([...defaults, ...overrides]);
			assert.deepStrictEqual(actual, [
				kbItem(KeyCode.KeyA, 'yes1', null, ContextKeyExpr.equals('1', 'a'), true),
				kbItem(KeyCode.KeyB, 'yes2', null, ContextKeyExpr.equals('2', 'b'), false),
			]);
		});

		test('simple 2', () => {
			const defaults = [
				kbItem(KeyCode.KeyA, 'yes1', null, ContextKeyExpr.equals('1', 'a'), true),
				kbItem(KeyCode.KeyB, 'yes2', null, ContextKeyExpr.equals('2', 'b'), true)
			];
			const overrides = [
				kbItem(KeyCode.KeyC, 'yes3', null, ContextKeyExpr.equals('3', 'c'), false)
			];
			const actual = KeybindingResolver.handleRemovals([...defaults, ...overrides]);
			assert.deepStrictEqual(actual, [
				kbItem(KeyCode.KeyA, 'yes1', null, ContextKeyExpr.equals('1', 'a'), true),
				kbItem(KeyCode.KeyB, 'yes2', null, ContextKeyExpr.equals('2', 'b'), true),
				kbItem(KeyCode.KeyC, 'yes3', null, ContextKeyExpr.equals('3', 'c'), false),
			]);
		});

		test('removal with not matching when', () => {
			const defaults = [
				kbItem(KeyCode.KeyA, 'yes1', null, ContextKeyExpr.equals('1', 'a'), true),
				kbItem(KeyCode.KeyB, 'yes2', null, ContextKeyExpr.equals('2', 'b'), true)
			];
			const overrides = [
				kbItem(KeyCode.KeyA, '-yes1', null, ContextKeyExpr.equals('1', 'b'), false)
			];
			const actual = KeybindingResolver.handleRemovals([...defaults, ...overrides]);
			assert.deepStrictEqual(actual, [
				kbItem(KeyCode.KeyA, 'yes1', null, ContextKeyExpr.equals('1', 'a'), true),
				kbItem(KeyCode.KeyB, 'yes2', null, ContextKeyExpr.equals('2', 'b'), true)
			]);
		});

		test('removal with not matching keybinding', () => {
			const defaults = [
				kbItem(KeyCode.KeyA, 'yes1', null, ContextKeyExpr.equals('1', 'a'), true),
				kbItem(KeyCode.KeyB, 'yes2', null, ContextKeyExpr.equals('2', 'b'), true)
			];
			const overrides = [
				kbItem(KeyCode.KeyB, '-yes1', null, ContextKeyExpr.equals('1', 'a'), false)
			];
			const actual = KeybindingResolver.handleRemovals([...defaults, ...overrides]);
			assert.deepStrictEqual(actual, [
				kbItem(KeyCode.KeyA, 'yes1', null, ContextKeyExpr.equals('1', 'a'), true),
				kbItem(KeyCode.KeyB, 'yes2', null, ContextKeyExpr.equals('2', 'b'), true)
			]);
		});

		test('removal with matching keybinding and when', () => {
			const defaults = [
				kbItem(KeyCode.KeyA, 'yes1', null, ContextKeyExpr.equals('1', 'a'), true),
				kbItem(KeyCode.KeyB, 'yes2', null, ContextKeyExpr.equals('2', 'b'), true)
			];
			const overrides = [
				kbItem(KeyCode.KeyA, '-yes1', null, ContextKeyExpr.equals('1', 'a'), false)
			];
			const actual = KeybindingResolver.handleRemovals([...defaults, ...overrides]);
			assert.deepStrictEqual(actual, [
				kbItem(KeyCode.KeyB, 'yes2', null, ContextKeyExpr.equals('2', 'b'), true)
			]);
		});

		test('removal with unspecified keybinding', () => {
			const defaults = [
				kbItem(KeyCode.KeyA, 'yes1', null, ContextKeyExpr.equals('1', 'a'), true),
				kbItem(KeyCode.KeyB, 'yes2', null, ContextKeyExpr.equals('2', 'b'), true)
			];
			const overrides = [
				kbItem(0, '-yes1', null, ContextKeyExpr.equals('1', 'a'), false)
			];
			const actual = KeybindingResolver.handleRemovals([...defaults, ...overrides]);
			assert.deepStrictEqual(actual, [
				kbItem(KeyCode.KeyB, 'yes2', null, ContextKeyExpr.equals('2', 'b'), true)
			]);
		});

		test('removal with unspecified when', () => {
			const defaults = [
				kbItem(KeyCode.KeyA, 'yes1', null, ContextKeyExpr.equals('1', 'a'), true),
				kbItem(KeyCode.KeyB, 'yes2', null, ContextKeyExpr.equals('2', 'b'), true)
			];
			const overrides = [
				kbItem(KeyCode.KeyA, '-yes1', null, undefined, false)
			];
			const actual = KeybindingResolver.handleRemovals([...defaults, ...overrides]);
			assert.deepStrictEqual(actual, [
				kbItem(KeyCode.KeyB, 'yes2', null, ContextKeyExpr.equals('2', 'b'), true)
			]);
		});

		test('removal with unspecified when and unspecified keybinding', () => {
			const defaults = [
				kbItem(KeyCode.KeyA, 'yes1', null, ContextKeyExpr.equals('1', 'a'), true),
				kbItem(KeyCode.KeyB, 'yes2', null, ContextKeyExpr.equals('2', 'b'), true)
			];
			const overrides = [
				kbItem(0, '-yes1', null, undefined, false)
			];
			const actual = KeybindingResolver.handleRemovals([...defaults, ...overrides]);
			assert.deepStrictEqual(actual, [
				kbItem(KeyCode.KeyB, 'yes2', null, ContextKeyExpr.equals('2', 'b'), true)
			]);
		});

		test('issue #138997 - removal in default list', () => {
			const defaults = [
				kbItem(KeyCode.KeyA, 'yes1', null, undefined, true),
				kbItem(KeyCode.KeyB, 'yes2', null, undefined, true),
				kbItem(0, '-yes1', null, undefined, false)
			];
			const overrides: ResolvedKeybindingItem[] = [];
			const actual = KeybindingResolver.handleRemovals([...defaults, ...overrides]);
			assert.deepStrictEqual(actual, [
				kbItem(KeyCode.KeyB, 'yes2', null, undefined, true)
			]);
		});

		test('issue #612#issuecomment-222109084 cannot remove keybindings for commands with ^', () => {
			const defaults = [
				kbItem(KeyCode.KeyA, '^yes1', null, ContextKeyExpr.equals('1', 'a'), true),
				kbItem(KeyCode.KeyB, 'yes2', null, ContextKeyExpr.equals('2', 'b'), true)
			];
			const overrides = [
				kbItem(KeyCode.KeyA, '-yes1', null, undefined, false)
			];
			const actual = KeybindingResolver.handleRemovals([...defaults, ...overrides]);
			assert.deepStrictEqual(actual, [
				kbItem(KeyCode.KeyB, 'yes2', null, ContextKeyExpr.equals('2', 'b'), true)
			]);
		});

		test('issue #140884 Unable to reassign F1 as keybinding for Show All Commands', () => {
			const defaults = [
				kbItem(KeyCode.KeyA, 'command1', null, undefined, true),
			];
			const overrides = [
				kbItem(KeyCode.KeyA, '-command1', null, undefined, false),
				kbItem(KeyCode.KeyA, 'command1', null, undefined, false),
			];
			const actual = KeybindingResolver.handleRemovals([...defaults, ...overrides]);
			assert.deepStrictEqual(actual, [
				kbItem(KeyCode.KeyA, 'command1', null, undefined, false)
			]);
		});

		test('issue #141638: Keyboard Shortcuts: Change When Expression might actually remove keybinding in Insiders', () => {
			const defaults = [
				kbItem(KeyCode.KeyA, 'command1', null, undefined, true),
			];
			const overrides = [
				kbItem(KeyCode.KeyA, 'command1', null, ContextKeyExpr.equals('a', '1'), false),
				kbItem(KeyCode.KeyA, '-command1', null, undefined, false),
			];
			const actual = KeybindingResolver.handleRemovals([...defaults, ...overrides]);
			assert.deepStrictEqual(actual, [
				kbItem(KeyCode.KeyA, 'command1', null, ContextKeyExpr.equals('a', '1'), false)
			]);
		});

		test('issue #157751: Auto-quoting of context keys prevents removal of keybindings via UI', () => {
			const defaults = [
				kbItem(KeyCode.KeyA, 'command1', null, ContextKeyExpr.deserialize(`editorTextFocus && activeEditor != workbench.editor.notebook && editorLangId in julia.supportedLanguageIds`), true),
			];
			const overrides = [
				kbItem(KeyCode.KeyA, '-command1', null, ContextKeyExpr.deserialize(`editorTextFocus && activeEditor != 'workbench.editor.notebook' && editorLangId in 'julia.supportedLanguageIds'`), false),
			];
			const actual = KeybindingResolver.handleRemovals([...defaults, ...overrides]);
			assert.deepStrictEqual(actual, []);
		});

		test('issue #160604: Remove keybindings with when clause does not work', () => {
			const defaults = [
				kbItem(KeyCode.KeyA, 'command1', null, undefined, true),
			];
			const overrides = [
				kbItem(KeyCode.KeyA, '-command1', null, ContextKeyExpr.true(), false),
			];
			const actual = KeybindingResolver.handleRemovals([...defaults, ...overrides]);
			assert.deepStrictEqual(actual, []);
		});

		test('contextIsEntirelyIncluded', () => {
			const toContextKeyExpression = (expr: ContextKeyExpression | string | null) => {
				if (typeof expr === 'string' || !expr) {
					return ContextKeyExpr.deserialize(expr);
				}
				return expr;
			};
			const assertIsIncluded = (a: ContextKeyExpression | string | null, b: ContextKeyExpression | string | null) => {
				assert.strictEqual(KeybindingResolver.whenIsEntirelyIncluded(toContextKeyExpression(a), toContextKeyExpression(b)), true);
			};
			const assertIsNotIncluded = (a: ContextKeyExpression | string | null, b: ContextKeyExpression | string | null) => {
				assert.strictEqual(KeybindingResolver.whenIsEntirelyIncluded(toContextKeyExpression(a), toContextKeyExpression(b)), false);
			};

			assertIsIncluded(null, null);
			assertIsIncluded(null, ContextKeyExpr.true());
			assertIsIncluded(ContextKeyExpr.true(), null);
			assertIsIncluded(ContextKeyExpr.true(), ContextKeyExpr.true());
			assertIsIncluded('key1', null);
			assertIsIncluded('key1', '');
			assertIsIncluded('key1', 'key1');
			assertIsIncluded('key1', ContextKeyExpr.true());
			assertIsIncluded('!key1', '');
			assertIsIncluded('!key1', '!key1');
			assertIsIncluded('key2', '');
			assertIsIncluded('key2', 'key2');
			assertIsIncluded('key1 && key1 && key2 && key2', 'key2');
			assertIsIncluded('key1 && key2', 'key2');
			assertIsIncluded('key1 && key2', 'key1');
			assertIsIncluded('key1 && key2', '');
			assertIsIncluded('key1', 'key1 || key2');
			assertIsIncluded('key1 || !key1', 'key2 || !key2');
			assertIsIncluded('key1', 'key1 || key2 && key3');

			assertIsNotIncluded('key1', '!key1');
			assertIsNotIncluded('!key1', 'key1');
			assertIsNotIncluded('key1 && key2', 'key3');
			assertIsNotIncluded('key1 && key2', 'key4');
			assertIsNotIncluded('key1', 'key2');
			assertIsNotIncluded('key1 || key2', 'key2');
			assertIsNotIncluded('', 'key2');
			assertIsNotIncluded(null, 'key2');
		});
	});

	suite('resolve command', () => {

		function _kbItem(keybinding: number | number[], command: string, when: ContextKeyExpression | undefined): ResolvedKeybindingItem {
			return kbItem(keybinding, command, null, when, true);
		}

		const items = [
			// This one will never match because its "when" is always overwritten by another one
			_kbItem(
				KeyCode.KeyX,
				'first',
				ContextKeyExpr.and(
					ContextKeyExpr.equals('key1', true),
					ContextKeyExpr.notEquals('key2', false)
				)
			),
			// This one always overwrites first
			_kbItem(
				KeyCode.KeyX,
				'second',
				ContextKeyExpr.equals('key2', true)
			),
			// This one is a secondary mapping for `second`
			_kbItem(
				KeyCode.KeyZ,
				'second',
				undefined
			),
			// This one sometimes overwrites first
			_kbItem(
				KeyCode.KeyX,
				'third',
				ContextKeyExpr.equals('key3', true)
			),
			// This one is always overwritten by another one
			_kbItem(
				KeyMod.CtrlCmd | KeyCode.KeyY,
				'fourth',
				ContextKeyExpr.equals('key4', true)
			),
			// This one overwrites with a chord the previous one
			_kbItem(
				KeyChord(KeyMod.CtrlCmd | KeyCode.KeyY, KeyCode.KeyZ),
				'fifth',
				undefined
			),
			// This one has no keybinding
			_kbItem(
				0,
				'sixth',
				undefined
			),
			_kbItem(
				KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.KeyU),
				'seventh',
				undefined
			),
			_kbItem(
				KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.KeyK),
				'seventh',
				undefined
			),
			_kbItem(
				KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.KeyU),
				'uncomment lines',
				undefined
			),
			_kbItem(
				KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.KeyC), // cmd+k cmd+c
				'comment lines',
				undefined
			),
			_kbItem(
				KeyChord(KeyMod.CtrlCmd | KeyCode.KeyG, KeyMod.CtrlCmd | KeyCode.KeyC), // cmd+g cmd+c
				'unreachablechord',
				undefined
			),
			_kbItem(
				KeyMod.CtrlCmd | KeyCode.KeyG, // cmd+g
				'eleven',
				undefined
			),
			_kbItem(
				[KeyMod.CtrlCmd | KeyCode.KeyK, KeyCode.KeyA, KeyCode.KeyB], // cmd+k a b
				'long multi chord',
				undefined
			),
			_kbItem(
				[KeyMod.CtrlCmd | KeyCode.KeyB, KeyMod.CtrlCmd | KeyCode.KeyC], // cmd+b cmd+c
				'shadowed by long-multi-chord-2',
				undefined
			),
			_kbItem(
				[KeyMod.CtrlCmd | KeyCode.KeyB, KeyMod.CtrlCmd | KeyCode.KeyC, KeyCode.KeyI], // cmd+b cmd+c i
				'long-multi-chord-2',
				undefined
			)
		];

		const resolver = new KeybindingResolver(items, [], () => { });

		const testKbLookupByCommand = (commandId: string, expectedKeys: number[] | number[][]) => {
			// Test lookup
			const lookupResult = resolver.lookupKeybindings(commandId);
			assert.strictEqual(lookupResult.length, expectedKeys.length, 'Length mismatch @ commandId ' + commandId);
			for (let i = 0, len = lookupResult.length; i < len; i++) {
				const expected = createUSLayoutResolvedKeybinding(expectedKeys[i], OS)!;

				assert.strictEqual(lookupResult[i].resolvedKeybinding!.getUserSettingsLabel(), expected.getUserSettingsLabel(), 'value mismatch @ commandId ' + commandId);
			}
		};

		const testResolve = (ctx: IContext, _expectedKey: number | number[], commandId: string) => {
			const expectedKeybinding = decodeKeybinding(_expectedKey, OS)!;

			const previousChord: string[] = [];

			for (let i = 0, len = expectedKeybinding.chords.length; i < len; i++) {

				const chord = getDispatchStr(<KeyCodeChord>expectedKeybinding.chords[i]);

				const result = resolver.resolve(ctx, previousChord, chord);

				if (i === len - 1) {
					// if it's the final chord, then we should find a valid command,
					// and there should not be a chord.
					assert.ok(result.kind === ResultKind.KbFound, `Enters multi chord for ${commandId} at chord ${i}`);
					assert.strictEqual(result.commandId, commandId, `Enters multi chord for ${commandId} at chord ${i}`);
				} else if (i > 0) {
					// if this is an intermediate chord, we should not find a valid command,
					// and there should be an open chord we continue.
					assert.ok(result.kind === ResultKind.MoreChordsNeeded, `Continues multi chord for ${commandId} at chord ${i}`);
				} else {
					// if it's not the final chord and not an intermediate, then we should not
					// find a valid command, and we should enter a chord.
					assert.ok(result.kind === ResultKind.MoreChordsNeeded, `Enters multi chord for ${commandId} at chord ${i}`);
				}
				previousChord.push(chord);
			}
		};

		test('resolve command - 1', () => {
			testKbLookupByCommand('first', []);
		});

		test('resolve command - 2', () => {
			testKbLookupByCommand('second', [KeyCode.KeyZ, KeyCode.KeyX]);
			testResolve(createContext({ key2: true }), KeyCode.KeyX, 'second');
			testResolve(createContext({}), KeyCode.KeyZ, 'second');
		});

		test('resolve command - 3', () => {
			testKbLookupByCommand('third', [KeyCode.KeyX]);
			testResolve(createContext({ key3: true }), KeyCode.KeyX, 'third');
		});

		test('resolve command - 4', () => {
			testKbLookupByCommand('fourth', []);
		});

		test('resolve command - 5', () => {
			testKbLookupByCommand('fifth', [KeyChord(KeyMod.CtrlCmd | KeyCode.KeyY, KeyCode.KeyZ)]);
			testResolve(createContext({}), KeyChord(KeyMod.CtrlCmd | KeyCode.KeyY, KeyCode.KeyZ), 'fifth');
		});

		test('resolve command - 6', () => {
			testKbLookupByCommand('seventh', [KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.KeyK)]);
			testResolve(createContext({}), KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.KeyK), 'seventh');
		});

		test('resolve command - 7', () => {
			testKbLookupByCommand('uncomment lines', [KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.KeyU)]);
			testResolve(createContext({}), KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.KeyU), 'uncomment lines');
		});

		test('resolve command - 8', () => {
			testKbLookupByCommand('comment lines', [KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.KeyC)]);
			testResolve(createContext({}), KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.KeyC), 'comment lines');
		});

		test('resolve command - 9', () => {
			testKbLookupByCommand('unreachablechord', []);
		});

		test('resolve command - 10', () => {
			testKbLookupByCommand('eleven', [KeyMod.CtrlCmd | KeyCode.KeyG]);
			testResolve(createContext({}), KeyMod.CtrlCmd | KeyCode.KeyG, 'eleven');
		});

		test('resolve command - 11', () => {
			testKbLookupByCommand('sixth', []);
		});

		test('resolve command - 12', () => {
			testKbLookupByCommand('long multi chord', [[KeyMod.CtrlCmd | KeyCode.KeyK, KeyCode.KeyA, KeyCode.KeyB]]);
			testResolve(createContext({}), [KeyMod.CtrlCmd | KeyCode.KeyK, KeyCode.KeyA, KeyCode.KeyB], 'long multi chord');
		});

		const emptyContext = createContext({});

		test('KBs having common prefix - the one defined later is returned', () => {
			testResolve(emptyContext, [KeyMod.CtrlCmd | KeyCode.KeyB, KeyMod.CtrlCmd | KeyCode.KeyC, KeyCode.KeyI], 'long-multi-chord-2');
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/keybinding/test/common/keybindingsTestUtils.ts]---
Location: vscode-main/src/vs/platform/keybinding/test/common/keybindingsTestUtils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { decodeKeybinding, ResolvedKeybinding } from '../../../../base/common/keybindings.js';
import { OperatingSystem } from '../../../../base/common/platform.js';
import { USLayoutResolvedKeybinding } from '../../common/usLayoutResolvedKeybinding.js';

export function createUSLayoutResolvedKeybinding(encodedKeybinding: number | number[], OS: OperatingSystem): ResolvedKeybinding | undefined {
	if (encodedKeybinding === 0) {
		return undefined;
	}
	const keybinding = decodeKeybinding(encodedKeybinding, OS);
	if (!keybinding) {
		return undefined;
	}
	const result = USLayoutResolvedKeybinding.resolveKeybinding(keybinding, OS);
	if (result.length > 0) {
		return result[0];
	}
	return undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/keybinding/test/common/mockKeybindingService.ts]---
Location: vscode-main/src/vs/platform/keybinding/test/common/mockKeybindingService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../../base/common/event.js';
import { KeyCodeChord, Keybinding, ResolvedKeybinding } from '../../../../base/common/keybindings.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { OS } from '../../../../base/common/platform.js';
import { ContextKeyExpression, ContextKeyValue, IContextKey, IContextKeyChangeEvent, IContextKeyService, IContextKeyServiceTarget, IScopedContextKeyService } from '../../../contextkey/common/contextkey.js';
import { IKeybindingService, IKeyboardEvent } from '../../common/keybinding.js';
import { NoMatchingKb, ResolutionResult } from '../../common/keybindingResolver.js';
import { ResolvedKeybindingItem } from '../../common/resolvedKeybindingItem.js';
import { USLayoutResolvedKeybinding } from '../../common/usLayoutResolvedKeybinding.js';

class MockKeybindingContextKey<T extends ContextKeyValue = ContextKeyValue> implements IContextKey<T> {
	private _defaultValue: T | undefined;
	private _value: T | undefined;

	constructor(defaultValue: T | undefined) {
		this._defaultValue = defaultValue;
		this._value = this._defaultValue;
	}

	public set(value: T | undefined): void {
		this._value = value;
	}

	public reset(): void {
		this._value = this._defaultValue;
	}

	public get(): T | undefined {
		return this._value;
	}
}

export class MockContextKeyService implements IContextKeyService {

	public _serviceBrand: undefined;
	private _keys = new Map<string, IContextKey<any>>();

	public dispose(): void {
		//
	}
	public createKey<T extends ContextKeyValue = ContextKeyValue>(key: string, defaultValue: T | undefined): IContextKey<T> {
		const ret = new MockKeybindingContextKey(defaultValue);
		this._keys.set(key, ret);
		return ret;
	}
	public contextMatchesRules(rules: ContextKeyExpression): boolean {
		return false;
	}
	public get onDidChangeContext(): Event<IContextKeyChangeEvent> {
		return Event.None;
	}
	public bufferChangeEvents(callback: () => void) { callback(); }
	public getContextKeyValue(key: string) {
		const value = this._keys.get(key);
		if (value) {
			return value.get();
		}
	}
	public getContext(domNode: HTMLElement): any {
		return null;
	}
	public createScoped(domNode: HTMLElement): IScopedContextKeyService {
		return this;
	}
	public createOverlay(): IContextKeyService {
		return this;
	}
	updateParent(_parentContextKeyService: IContextKeyService): void {
		// no-op
	}
}

export class MockScopableContextKeyService extends MockContextKeyService {
	/**
	 * Don't implement this for all tests since we rarely depend on this behavior and it isn't implemented fully
	 */
	public override createScoped(domNote: HTMLElement): IScopedContextKeyService {
		return new MockScopableContextKeyService();
	}
}

export class MockKeybindingService implements IKeybindingService {
	public _serviceBrand: undefined;

	public readonly inChordMode: boolean = false;

	public get onDidUpdateKeybindings(): Event<void> {
		return Event.None;
	}

	public getDefaultKeybindingsContent(): string {
		return '';
	}

	public getDefaultKeybindings(): ResolvedKeybindingItem[] {
		return [];
	}

	public getKeybindings(): ResolvedKeybindingItem[] {
		return [];
	}

	public resolveKeybinding(keybinding: Keybinding): ResolvedKeybinding[] {
		return USLayoutResolvedKeybinding.resolveKeybinding(keybinding, OS);
	}

	public resolveKeyboardEvent(keyboardEvent: IKeyboardEvent): ResolvedKeybinding {
		const chord = new KeyCodeChord(
			keyboardEvent.ctrlKey,
			keyboardEvent.shiftKey,
			keyboardEvent.altKey,
			keyboardEvent.metaKey,
			keyboardEvent.keyCode
		);
		return this.resolveKeybinding(chord.toKeybinding())[0];
	}

	public resolveUserBinding(userBinding: string): ResolvedKeybinding[] {
		return [];
	}

	public lookupKeybindings(commandId: string): ResolvedKeybinding[] {
		return [];
	}

	public lookupKeybinding(commandId: string): ResolvedKeybinding | undefined {
		return undefined;
	}

	public customKeybindingsCount(): number {
		return 0;
	}

	public softDispatch(keybinding: IKeyboardEvent, target: IContextKeyServiceTarget): ResolutionResult {
		return NoMatchingKb;
	}

	public dispatchByUserSettingsLabel(userSettingsLabel: string, target: IContextKeyServiceTarget): void {

	}

	public dispatchEvent(e: IKeyboardEvent, target: IContextKeyServiceTarget): boolean {
		return false;
	}

	public enableKeybindingHoldMode(commandId: string): undefined {
		return undefined;
	}

	public mightProducePrintableCharacter(e: IKeyboardEvent): boolean {
		return false;
	}

	public toggleLogging(): boolean {
		return false;
	}

	public _dumpDebugInfo(): string {
		return '';
	}

	public _dumpDebugInfoJSON(): string {
		return '';
	}

	public registerSchemaContribution() {
		return Disposable.None;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/keyboardLayout/common/keyboardConfig.ts]---
Location: vscode-main/src/vs/platform/keyboardLayout/common/keyboardConfig.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../nls.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { OS, OperatingSystem } from '../../../base/common/platform.js';
import { ConfigurationScope, Extensions as ConfigExtensions, IConfigurationNode, IConfigurationRegistry } from '../../configuration/common/configurationRegistry.js';
import { Registry } from '../../registry/common/platform.js';

export const enum DispatchConfig {
	Code,
	KeyCode
}

export interface IKeyboardConfig {
	dispatch: DispatchConfig;
	mapAltGrToCtrlAlt: boolean;
}

export function readKeyboardConfig(configurationService: IConfigurationService): IKeyboardConfig {
	const keyboard = configurationService.getValue<{ dispatch: string; mapAltGrToCtrlAlt: boolean } | undefined>('keyboard');
	const dispatch = (keyboard?.dispatch === 'keyCode' ? DispatchConfig.KeyCode : DispatchConfig.Code);
	const mapAltGrToCtrlAlt = Boolean(keyboard?.mapAltGrToCtrlAlt);
	return { dispatch, mapAltGrToCtrlAlt };
}

const configurationRegistry = Registry.as<IConfigurationRegistry>(ConfigExtensions.Configuration);
const keyboardConfiguration: IConfigurationNode = {
	'id': 'keyboard',
	'order': 15,
	'type': 'object',
	'title': nls.localize('keyboardConfigurationTitle', "Keyboard"),
	'properties': {
		'keyboard.dispatch': {
			scope: ConfigurationScope.APPLICATION,
			type: 'string',
			enum: ['code', 'keyCode'],
			default: 'code',
			markdownDescription: nls.localize('dispatch', "Controls the dispatching logic for key presses to use either `code` (recommended) or `keyCode`."),
			included: OS === OperatingSystem.Macintosh || OS === OperatingSystem.Linux
		},
		'keyboard.mapAltGrToCtrlAlt': {
			scope: ConfigurationScope.APPLICATION,
			type: 'boolean',
			default: false,
			markdownDescription: nls.localize('mapAltGrToCtrlAlt', "Controls if the AltGraph+ modifier should be treated as Ctrl+Alt+."),
			included: OS === OperatingSystem.Windows
		}
	}
};

configurationRegistry.registerConfiguration(keyboardConfiguration);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/keyboardLayout/common/keyboardLayout.ts]---
Location: vscode-main/src/vs/platform/keyboardLayout/common/keyboardLayout.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../base/common/event.js';
import { ScanCode, ScanCodeUtils } from '../../../base/common/keyCodes.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { IKeyboardEvent } from '../../keybinding/common/keybinding.js';
import { IKeyboardMapper } from './keyboardMapper.js';

export const IKeyboardLayoutService = createDecorator<IKeyboardLayoutService>('keyboardLayoutService');

export interface IWindowsKeyMapping {
	vkey: string;
	value: string;
	withShift: string;
	withAltGr: string;
	withShiftAltGr: string;
}
export interface IWindowsKeyboardMapping {
	[code: string]: IWindowsKeyMapping;
}
export interface ILinuxKeyMapping {
	value: string;
	withShift: string;
	withAltGr: string;
	withShiftAltGr: string;
}
export interface ILinuxKeyboardMapping {
	[code: string]: ILinuxKeyMapping;
}
export interface IMacKeyMapping {
	value: string;
	valueIsDeadKey: boolean;
	withShift: string;
	withShiftIsDeadKey: boolean;
	withAltGr: string;
	withAltGrIsDeadKey: boolean;
	withShiftAltGr: string;
	withShiftAltGrIsDeadKey: boolean;
}
export interface IMacKeyboardMapping {
	[code: string]: IMacKeyMapping;
}

export type IMacLinuxKeyMapping = IMacKeyMapping | ILinuxKeyMapping;
export type IMacLinuxKeyboardMapping = IMacKeyboardMapping | ILinuxKeyboardMapping;
export type IKeyboardMapping = IWindowsKeyboardMapping | ILinuxKeyboardMapping | IMacKeyboardMapping;

export interface IWindowsKeyboardLayoutInfo {
	name: string;
	id: string;
	text: string;
}

export interface ILinuxKeyboardLayoutInfo {
	model: string;
	group: number;
	layout: string;
	variant: string;
	options: string;
	rules: string;
}

export interface IMacKeyboardLayoutInfo {
	id: string;
	lang: string;
	localizedName?: string;
}

export type IKeyboardLayoutInfo = (IWindowsKeyboardLayoutInfo | ILinuxKeyboardLayoutInfo | IMacKeyboardLayoutInfo) & { isUserKeyboardLayout?: boolean; isUSStandard?: true };

export interface IKeyboardLayoutService {
	readonly _serviceBrand: undefined;

	readonly onDidChangeKeyboardLayout: Event<void>;

	getRawKeyboardMapping(): IKeyboardMapping | null;
	getCurrentKeyboardLayout(): IKeyboardLayoutInfo | null;
	getAllKeyboardLayouts(): IKeyboardLayoutInfo[];
	getKeyboardMapper(): IKeyboardMapper;
	validateCurrentKeyboardMapping(keyboardEvent: IKeyboardEvent): void;
}

export function areKeyboardLayoutsEqual(a: IKeyboardLayoutInfo | null, b: IKeyboardLayoutInfo | null): boolean {
	if (!a || !b) {
		return false;
	}

	if ((<IWindowsKeyboardLayoutInfo>a).name && (<IWindowsKeyboardLayoutInfo>b).name && (<IWindowsKeyboardLayoutInfo>a).name === (<IWindowsKeyboardLayoutInfo>b).name) {
		return true;
	}

	if ((<IMacKeyboardLayoutInfo>a).id && (<IMacKeyboardLayoutInfo>b).id && (<IMacKeyboardLayoutInfo>a).id === (<IMacKeyboardLayoutInfo>b).id) {
		return true;
	}

	if ((<ILinuxKeyboardLayoutInfo>a).model &&
		(<ILinuxKeyboardLayoutInfo>b).model &&
		(<ILinuxKeyboardLayoutInfo>a).model === (<ILinuxKeyboardLayoutInfo>b).model &&
		(<ILinuxKeyboardLayoutInfo>a).layout === (<ILinuxKeyboardLayoutInfo>b).layout
	) {
		return true;
	}

	return false;
}

export function parseKeyboardLayoutDescription(layout: IKeyboardLayoutInfo | null): { label: string; description: string } {
	if (!layout) {
		return { label: '', description: '' };
	}

	if ((<IWindowsKeyboardLayoutInfo>layout).name) {
		// windows
		const windowsLayout = <IWindowsKeyboardLayoutInfo>layout;
		return {
			label: windowsLayout.text,
			description: ''
		};
	}

	if ((<IMacKeyboardLayoutInfo>layout).id) {
		const macLayout = <IMacKeyboardLayoutInfo>layout;
		if (macLayout.localizedName) {
			return {
				label: macLayout.localizedName,
				description: ''
			};
		}

		if (/^com\.apple\.keylayout\./.test(macLayout.id)) {
			return {
				label: macLayout.id.replace(/^com\.apple\.keylayout\./, '').replace(/-/, ' '),
				description: ''
			};
		}
		if (/^.*inputmethod\./.test(macLayout.id)) {
			return {
				label: macLayout.id.replace(/^.*inputmethod\./, '').replace(/[-\.]/, ' '),
				description: `Input Method (${macLayout.lang})`
			};
		}

		return {
			label: macLayout.lang,
			description: ''
		};
	}

	const linuxLayout = <ILinuxKeyboardLayoutInfo>layout;

	return {
		label: linuxLayout.layout,
		description: ''
	};
}

export function getKeyboardLayoutId(layout: IKeyboardLayoutInfo): string {
	if ((<IWindowsKeyboardLayoutInfo>layout).name) {
		return (<IWindowsKeyboardLayoutInfo>layout).name;
	}

	if ((<IMacKeyboardLayoutInfo>layout).id) {
		return (<IMacKeyboardLayoutInfo>layout).id;
	}

	return (<ILinuxKeyboardLayoutInfo>layout).layout;
}

function windowsKeyMappingEquals(a: IWindowsKeyMapping, b: IWindowsKeyMapping): boolean {
	if (!a && !b) {
		return true;
	}
	if (!a || !b) {
		return false;
	}
	return (
		a.vkey === b.vkey
		&& a.value === b.value
		&& a.withShift === b.withShift
		&& a.withAltGr === b.withAltGr
		&& a.withShiftAltGr === b.withShiftAltGr
	);
}

export function windowsKeyboardMappingEquals(a: IWindowsKeyboardMapping | null, b: IWindowsKeyboardMapping | null): boolean {
	if (!a && !b) {
		return true;
	}
	if (!a || !b) {
		return false;
	}
	for (let scanCode = 0; scanCode < ScanCode.MAX_VALUE; scanCode++) {
		const strScanCode = ScanCodeUtils.toString(scanCode);
		const aEntry = a[strScanCode];
		const bEntry = b[strScanCode];
		if (!windowsKeyMappingEquals(aEntry, bEntry)) {
			return false;
		}
	}
	return true;
}

function macLinuxKeyMappingEquals(a: IMacLinuxKeyMapping, b: IMacLinuxKeyMapping): boolean {
	if (!a && !b) {
		return true;
	}
	if (!a || !b) {
		return false;
	}
	return (
		a.value === b.value
		&& a.withShift === b.withShift
		&& a.withAltGr === b.withAltGr
		&& a.withShiftAltGr === b.withShiftAltGr
	);
}

export function macLinuxKeyboardMappingEquals(a: IMacLinuxKeyboardMapping | null, b: IMacLinuxKeyboardMapping | null): boolean {
	if (!a && !b) {
		return true;
	}
	if (!a || !b) {
		return false;
	}
	for (let scanCode = 0; scanCode < ScanCode.MAX_VALUE; scanCode++) {
		const strScanCode = ScanCodeUtils.toString(scanCode);
		const aEntry = a[strScanCode];
		const bEntry = b[strScanCode];
		if (!macLinuxKeyMappingEquals(aEntry, bEntry)) {
			return false;
		}
	}
	return true;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/keyboardLayout/common/keyboardLayoutService.ts]---
Location: vscode-main/src/vs/platform/keyboardLayout/common/keyboardLayoutService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../base/common/event.js';
import { IKeyboardLayoutInfo, IKeyboardMapping } from './keyboardLayout.js';

export interface IKeyboardLayoutData {
	keyboardLayoutInfo: IKeyboardLayoutInfo;
	keyboardMapping: IKeyboardMapping;
}

export interface INativeKeyboardLayoutService {
	readonly _serviceBrand: undefined;
	readonly onDidChangeKeyboardLayout: Event<IKeyboardLayoutData>;
	getKeyboardLayoutData(): Promise<IKeyboardLayoutData>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/keyboardLayout/common/keyboardMapper.ts]---
Location: vscode-main/src/vs/platform/keyboardLayout/common/keyboardMapper.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ResolvedKeybinding, Keybinding } from '../../../base/common/keybindings.js';
import { IKeyboardEvent } from '../../keybinding/common/keybinding.js';

export interface IKeyboardMapper {
	dumpDebugInfo(): string;
	resolveKeyboardEvent(keyboardEvent: IKeyboardEvent): ResolvedKeybinding;
	resolveKeybinding(keybinding: Keybinding): ResolvedKeybinding[];
}

export class CachedKeyboardMapper implements IKeyboardMapper {

	private _actual: IKeyboardMapper;
	private _cache: Map<string, ResolvedKeybinding[]>;

	constructor(actual: IKeyboardMapper) {
		this._actual = actual;
		this._cache = new Map<string, ResolvedKeybinding[]>();
	}

	public dumpDebugInfo(): string {
		return this._actual.dumpDebugInfo();
	}

	public resolveKeyboardEvent(keyboardEvent: IKeyboardEvent): ResolvedKeybinding {
		return this._actual.resolveKeyboardEvent(keyboardEvent);
	}

	public resolveKeybinding(keybinding: Keybinding): ResolvedKeybinding[] {
		const hashCode = keybinding.getHashCode();
		const resolved = this._cache.get(hashCode);
		if (!resolved) {
			const r = this._actual.resolveKeybinding(keybinding);
			this._cache.set(hashCode, r);
			return r;
		}
		return resolved;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/keyboardLayout/electron-main/keyboardLayoutMainService.ts]---
Location: vscode-main/src/vs/platform/keyboardLayout/electron-main/keyboardLayoutMainService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type * as nativeKeymap from 'native-keymap';
import * as platform from '../../../base/common/platform.js';
import { Emitter } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { IKeyboardLayoutData, INativeKeyboardLayoutService } from '../common/keyboardLayoutService.js';
import { ILifecycleMainService, LifecycleMainPhase } from '../../lifecycle/electron-main/lifecycleMainService.js';

export const IKeyboardLayoutMainService = createDecorator<IKeyboardLayoutMainService>('keyboardLayoutMainService');

export interface IKeyboardLayoutMainService extends INativeKeyboardLayoutService { }

export class KeyboardLayoutMainService extends Disposable implements INativeKeyboardLayoutService {

	declare readonly _serviceBrand: undefined;

	private readonly _onDidChangeKeyboardLayout = this._register(new Emitter<IKeyboardLayoutData>());
	readonly onDidChangeKeyboardLayout = this._onDidChangeKeyboardLayout.event;

	private _initPromise: Promise<void> | null;
	private _keyboardLayoutData: IKeyboardLayoutData | null;

	constructor(
		@ILifecycleMainService lifecycleMainService: ILifecycleMainService
	) {
		super();
		this._initPromise = null;
		this._keyboardLayoutData = null;

		// perf: automatically trigger initialize after windows
		// have opened so that we can do this work in parallel
		// to the window load.
		lifecycleMainService.when(LifecycleMainPhase.AfterWindowOpen).then(() => this._initialize());
	}

	private _initialize(): Promise<void> {
		if (!this._initPromise) {
			this._initPromise = this._doInitialize();
		}
		return this._initPromise;
	}

	private async _doInitialize(): Promise<void> {
		const nativeKeymapMod = await import('native-keymap');

		this._keyboardLayoutData = readKeyboardLayoutData(nativeKeymapMod);
		if (!platform.isCI) {
			// See https://github.com/microsoft/vscode/issues/152840
			// Do not register the keyboard layout change listener in CI because it doesn't work
			// on the build machines and it just adds noise to the build logs.
			nativeKeymapMod.onDidChangeKeyboardLayout(() => {
				this._keyboardLayoutData = readKeyboardLayoutData(nativeKeymapMod);
				this._onDidChangeKeyboardLayout.fire(this._keyboardLayoutData);
			});
		}
	}

	public async getKeyboardLayoutData(): Promise<IKeyboardLayoutData> {
		await this._initialize();
		return this._keyboardLayoutData!;
	}
}

function readKeyboardLayoutData(nativeKeymapMod: typeof nativeKeymap): IKeyboardLayoutData {
	const keyboardMapping = nativeKeymapMod.getKeyMap();
	const keyboardLayoutInfo = nativeKeymapMod.getCurrentKeyboardLayout();
	return { keyboardMapping, keyboardLayoutInfo };
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/label/common/label.ts]---
Location: vscode-main/src/vs/platform/label/common/label.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../base/common/event.js';
import { IDisposable } from '../../../base/common/lifecycle.js';
import { URI } from '../../../base/common/uri.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { IWorkspace, ISingleFolderWorkspaceIdentifier, IWorkspaceIdentifier } from '../../workspace/common/workspace.js';

export const ILabelService = createDecorator<ILabelService>('labelService');

export interface ILabelService {

	readonly _serviceBrand: undefined;

	/**
	 * Gets the human readable label for a uri.
	 * If `relative` is passed returns a label relative to the workspace root that the uri belongs to.
	 * If `noPrefix` is passed does not tildify the label and also does not prepand the root name for relative labels in a multi root scenario.
	 * If `separator` is passed, will use that over the defined path separator of the formatter.
	 * If `appendWorkspaceSuffix` is passed, will append the name of the workspace to the label.
	 */
	getUriLabel(resource: URI, options?: { relative?: boolean; noPrefix?: boolean; separator?: '/' | '\\'; appendWorkspaceSuffix?: boolean }): string;
	getUriBasenameLabel(resource: URI): string;
	getWorkspaceLabel(workspace: (IWorkspaceIdentifier | ISingleFolderWorkspaceIdentifier | URI | IWorkspace), options?: { verbose: Verbosity }): string;
	getHostLabel(scheme: string, authority?: string): string;
	getHostTooltip(scheme: string, authority?: string): string | undefined;
	getSeparator(scheme: string, authority?: string): '/' | '\\';

	registerFormatter(formatter: ResourceLabelFormatter): IDisposable;
	readonly onDidChangeFormatters: Event<IFormatterChangeEvent>;

	/**
	 * Registers a formatter that's cached for the machine beyond the lifecycle
	 * of the current window. Disposing the formatter _will not_ remove it from
	 * the cache.
	 */
	registerCachedFormatter(formatter: ResourceLabelFormatter): IDisposable;
}

export const enum Verbosity {
	SHORT,
	MEDIUM,
	LONG
}

export interface IFormatterChangeEvent {
	scheme: string;
}

export interface ResourceLabelFormatter {
	scheme: string;
	authority?: string;
	priority?: boolean;
	formatting: ResourceLabelFormatting;
}

export interface ResourceLabelFormatting {
	label: string; // myLabel:/${path}
	separator: '/' | '\\' | '';
	tildify?: boolean;
	normalizeDriveLetter?: boolean;
	workspaceSuffix?: string;
	workspaceTooltip?: string;
	authorityPrefix?: string;
	stripPathStartingSeparator?: boolean;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/languagePacks/browser/languagePacks.ts]---
Location: vscode-main/src/vs/platform/languagePacks/browser/languagePacks.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationTokenSource } from '../../../base/common/cancellation.js';
import { URI } from '../../../base/common/uri.js';
import { IExtensionGalleryService } from '../../extensionManagement/common/extensionManagement.js';
import { IExtensionResourceLoaderService } from '../../extensionResourceLoader/common/extensionResourceLoader.js';
import { ILanguagePackItem, LanguagePackBaseService } from '../common/languagePacks.js';
import { ILogService } from '../../log/common/log.js';

export class WebLanguagePacksService extends LanguagePackBaseService {
	constructor(
		@IExtensionResourceLoaderService private readonly extensionResourceLoaderService: IExtensionResourceLoaderService,
		@IExtensionGalleryService extensionGalleryService: IExtensionGalleryService,
		@ILogService private readonly logService: ILogService
	) {
		super(extensionGalleryService);
	}

	async getBuiltInExtensionTranslationsUri(id: string, language: string): Promise<URI | undefined> {

		const queryTimeout = new CancellationTokenSource();
		setTimeout(() => queryTimeout.cancel(), 1000);

		// First get the extensions that supports the language (there should only be one but just in case let's include more results)
		let result;
		try {
			result = await this.extensionGalleryService.query({
				text: `tag:"lp-${language}"`,
				pageSize: 5
			}, queryTimeout.token);
		} catch (err) {
			this.logService.error(err);
			return undefined;
		}

		const languagePackExtensions = result.firstPage.find(e => e.properties.localizedLanguages?.length);
		if (!languagePackExtensions) {
			this.logService.trace(`No language pack found for language ${language}`);
			return undefined;
		}

		// Then get the manifest for that extension
		const manifestTimeout = new CancellationTokenSource();
		setTimeout(() => queryTimeout.cancel(), 1000);
		const manifest = await this.extensionGalleryService.getManifest(languagePackExtensions, manifestTimeout.token);

		// Find the translation from the language pack
		const localization = manifest?.contributes?.localizations?.find(l => l.languageId === language);
		const translation = localization?.translations.find(t => t.id === id);
		if (!translation) {
			this.logService.trace(`No translation found for id '${id}, in ${manifest?.name}`);
			return undefined;
		}

		// get the resource uri and return it
		const uri = await this.extensionResourceLoaderService.getExtensionGalleryResourceURL({
			// If translation is defined then manifest should have been defined.
			name: manifest!.name,
			publisher: manifest!.publisher,
			version: manifest!.version
		});
		if (!uri) {
			this.logService.trace('Gallery does not provide extension resources.');
			return undefined;
		}

		return URI.joinPath(uri, translation.path);
	}

	// Web doesn't have a concept of language packs, so we just return an empty array
	getInstalledLanguages(): Promise<ILanguagePackItem[]> {
		return Promise.resolve([]);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/languagePacks/common/languagePacks.ts]---
Location: vscode-main/src/vs/platform/languagePacks/common/languagePacks.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationTokenSource } from '../../../base/common/cancellation.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { language } from '../../../base/common/platform.js';
import { URI } from '../../../base/common/uri.js';
import { IQuickPickItem } from '../../quickinput/common/quickInput.js';
import { localize } from '../../../nls.js';
import { IExtensionGalleryService, IGalleryExtension } from '../../extensionManagement/common/extensionManagement.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';

export function getLocale(extension: IGalleryExtension): string | undefined {
	return extension.tags.find(t => t.startsWith('lp-'))?.split('lp-')[1];
}

export const ILanguagePackService = createDecorator<ILanguagePackService>('languagePackService');

export interface ILanguagePackItem extends IQuickPickItem {
	readonly extensionId?: string;
	readonly galleryExtension?: IGalleryExtension;
}

export interface ILanguagePackService {
	readonly _serviceBrand: undefined;
	getAvailableLanguages(): Promise<Array<ILanguagePackItem>>;
	getInstalledLanguages(): Promise<Array<ILanguagePackItem>>;
	getBuiltInExtensionTranslationsUri(id: string, language: string): Promise<URI | undefined>;
}

export abstract class LanguagePackBaseService extends Disposable implements ILanguagePackService {
	declare readonly _serviceBrand: undefined;

	constructor(@IExtensionGalleryService protected readonly extensionGalleryService: IExtensionGalleryService) {
		super();
	}

	abstract getBuiltInExtensionTranslationsUri(id: string, language: string): Promise<URI | undefined>;

	abstract getInstalledLanguages(): Promise<Array<ILanguagePackItem>>;

	async getAvailableLanguages(): Promise<ILanguagePackItem[]> {
		const timeout = new CancellationTokenSource();
		setTimeout(() => timeout.cancel(), 1000);

		let result;
		try {
			result = await this.extensionGalleryService.query({
				text: 'category:"language packs"',
				pageSize: 20
			}, timeout.token);
		} catch (_) {
			// This method is best effort. So, we ignore any errors.
			return [];
		}

		const languagePackExtensions = result.firstPage.filter(e => e.properties.localizedLanguages?.length && e.tags.some(t => t.startsWith('lp-')));
		const allFromMarketplace: ILanguagePackItem[] = languagePackExtensions.map(lp => {
			const languageName = lp.properties.localizedLanguages?.[0];
			const locale = getLocale(lp)!;
			const baseQuickPick = this.createQuickPickItem(locale, languageName, lp);
			return {
				...baseQuickPick,
				extensionId: lp.identifier.id,
				galleryExtension: lp
			};
		});

		allFromMarketplace.push(this.createQuickPickItem('en', 'English'));

		return allFromMarketplace;
	}

	protected createQuickPickItem(locale: string, languageName?: string, languagePack?: IGalleryExtension): IQuickPickItem {
		const label = languageName ?? locale;
		let description: string | undefined;
		if (label !== locale) {
			description = `(${locale})`;
		}

		if (locale.toLowerCase() === language.toLowerCase()) {
			description ??= '';
			description += localize('currentDisplayLanguage', " (Current)");
		}

		if (languagePack?.installCount) {
			description ??= '';

			const count = languagePack.installCount;
			let countLabel: string;
			if (count > 1000000) {
				countLabel = `${Math.floor(count / 100000) / 10}M`;
			} else if (count > 1000) {
				countLabel = `${Math.floor(count / 1000)}K`;
			} else {
				countLabel = String(count);
			}
			description += ` $(cloud-download) ${countLabel}`;
		}

		return {
			id: locale,
			label,
			description
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/languagePacks/common/localizedStrings.ts]---
Location: vscode-main/src/vs/platform/languagePacks/common/localizedStrings.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../nls.js';

/**
 * These are some predefined strings that we test during smoke testing that they are localized
 * correctly. Don't change these strings!!
 */

const open: string = nls.localize('open', 'open');
const close: string = nls.localize('close', 'close');
const find: string = nls.localize('find', 'find');

export default {
	open: open,
	close: close,
	find: find
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/languagePacks/node/languagePacks.ts]---
Location: vscode-main/src/vs/platform/languagePacks/node/languagePacks.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fs from 'fs';
import { createHash } from 'crypto';
import { equals } from '../../../base/common/arrays.js';
import { Queue } from '../../../base/common/async.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { Schemas } from '../../../base/common/network.js';
import { join } from '../../../base/common/path.js';
import { Promises } from '../../../base/node/pfs.js';
import { INativeEnvironmentService } from '../../environment/common/environment.js';
import { IExtensionGalleryService, IExtensionIdentifier, IExtensionManagementService, ILocalExtension } from '../../extensionManagement/common/extensionManagement.js';
import { areSameExtensions } from '../../extensionManagement/common/extensionManagementUtil.js';
import { ILogService } from '../../log/common/log.js';
import { ILocalizationContribution } from '../../extensions/common/extensions.js';
import { ILanguagePackItem, LanguagePackBaseService } from '../common/languagePacks.js';
import { URI } from '../../../base/common/uri.js';

interface ILanguagePack {
	hash: string;
	label: string | undefined;
	extensions: {
		extensionIdentifier: IExtensionIdentifier;
		version: string;
	}[];
	translations: { [id: string]: string };
}

export class NativeLanguagePackService extends LanguagePackBaseService {
	private readonly cache: LanguagePacksCache;

	constructor(
		@IExtensionManagementService private readonly extensionManagementService: IExtensionManagementService,
		@INativeEnvironmentService environmentService: INativeEnvironmentService,
		@IExtensionGalleryService extensionGalleryService: IExtensionGalleryService,
		@ILogService private readonly logService: ILogService
	) {
		super(extensionGalleryService);
		this.cache = this._register(new LanguagePacksCache(environmentService, logService));
		this.extensionManagementService.registerParticipant({
			postInstall: async (extension: ILocalExtension): Promise<void> => {
				return this.postInstallExtension(extension);
			},
			postUninstall: async (extension: ILocalExtension): Promise<void> => {
				return this.postUninstallExtension(extension);
			}
		});
	}

	async getBuiltInExtensionTranslationsUri(id: string, language: string): Promise<URI | undefined> {
		const packs = await this.cache.getLanguagePacks();
		const pack = packs[language];
		if (!pack) {
			this.logService.warn(`No language pack found for ${language}`);
			return undefined;
		}

		const translation = pack.translations[id];
		return translation ? URI.file(translation) : undefined;
	}

	async getInstalledLanguages(): Promise<Array<ILanguagePackItem>> {
		const languagePacks = await this.cache.getLanguagePacks();
		const languages: ILanguagePackItem[] = Object.keys(languagePacks).map(locale => {
			const languagePack = languagePacks[locale];
			const baseQuickPick = this.createQuickPickItem(locale, languagePack.label);
			return {
				...baseQuickPick,
				extensionId: languagePack.extensions[0].extensionIdentifier.id,
			};
		});
		languages.push(this.createQuickPickItem('en', 'English'));
		languages.sort((a, b) => a.label.localeCompare(b.label));
		return languages;
	}

	private async postInstallExtension(extension: ILocalExtension): Promise<void> {
		if (extension && extension.manifest && extension.manifest.contributes && extension.manifest.contributes.localizations && extension.manifest.contributes.localizations.length) {
			this.logService.info('Adding language packs from the extension', extension.identifier.id);
			await this.update();
		}
	}

	private async postUninstallExtension(extension: ILocalExtension): Promise<void> {
		const languagePacks = await this.cache.getLanguagePacks();
		if (Object.keys(languagePacks).some(language => languagePacks[language] && languagePacks[language].extensions.some(e => areSameExtensions(e.extensionIdentifier, extension.identifier)))) {
			this.logService.info('Removing language packs from the extension', extension.identifier.id);
			await this.update();
		}
	}

	async update(): Promise<boolean> {
		const [current, installed] = await Promise.all([this.cache.getLanguagePacks(), this.extensionManagementService.getInstalled()]);
		const updated = await this.cache.update(installed);
		return !equals(Object.keys(current), Object.keys(updated));
	}
}

class LanguagePacksCache extends Disposable {

	private languagePacks: { [language: string]: ILanguagePack } = {};
	private languagePacksFilePath: string;
	private languagePacksFileLimiter: Queue<any>;
	private initializedCache: boolean | undefined;

	constructor(
		@INativeEnvironmentService environmentService: INativeEnvironmentService,
		@ILogService private readonly logService: ILogService
	) {
		super();
		this.languagePacksFilePath = join(environmentService.userDataPath, 'languagepacks.json');
		this.languagePacksFileLimiter = new Queue();
	}

	getLanguagePacks(): Promise<{ [language: string]: ILanguagePack }> {
		// if queue is not empty, fetch from disk
		if (this.languagePacksFileLimiter.size || !this.initializedCache) {
			return this.withLanguagePacks()
				.then(() => this.languagePacks);
		}
		return Promise.resolve(this.languagePacks);
	}

	update(extensions: ILocalExtension[]): Promise<{ [language: string]: ILanguagePack }> {
		return this.withLanguagePacks(languagePacks => {
			Object.keys(languagePacks).forEach(language => delete languagePacks[language]);
			this.createLanguagePacksFromExtensions(languagePacks, ...extensions);
		}).then(() => this.languagePacks);
	}

	private createLanguagePacksFromExtensions(languagePacks: { [language: string]: ILanguagePack }, ...extensions: ILocalExtension[]): void {
		for (const extension of extensions) {
			if (extension && extension.manifest && extension.manifest.contributes && extension.manifest.contributes.localizations && extension.manifest.contributes.localizations.length) {
				this.createLanguagePacksFromExtension(languagePacks, extension);
			}
		}
		Object.keys(languagePacks).forEach(languageId => this.updateHash(languagePacks[languageId]));
	}

	private createLanguagePacksFromExtension(languagePacks: { [language: string]: ILanguagePack }, extension: ILocalExtension): void {
		const extensionIdentifier = extension.identifier;
		const localizations = extension.manifest.contributes && extension.manifest.contributes.localizations ? extension.manifest.contributes.localizations : [];
		for (const localizationContribution of localizations) {
			if (extension.location.scheme === Schemas.file && isValidLocalization(localizationContribution)) {
				let languagePack = languagePacks[localizationContribution.languageId];
				if (!languagePack) {
					languagePack = {
						hash: '',
						extensions: [],
						translations: {},
						label: localizationContribution.localizedLanguageName ?? localizationContribution.languageName
					};
					languagePacks[localizationContribution.languageId] = languagePack;
				}
				const extensionInLanguagePack = languagePack.extensions.filter(e => areSameExtensions(e.extensionIdentifier, extensionIdentifier))[0];
				if (extensionInLanguagePack) {
					extensionInLanguagePack.version = extension.manifest.version;
				} else {
					languagePack.extensions.push({ extensionIdentifier, version: extension.manifest.version });
				}
				for (const translation of localizationContribution.translations) {
					languagePack.translations[translation.id] = join(extension.location.fsPath, translation.path);
				}
			}
		}
	}

	private updateHash(languagePack: ILanguagePack): void {
		if (languagePack) {
			const md5 = createHash('md5'); // CodeQL [SM04514] Used to create an hash for language pack extension version, which is not a security issue
			for (const extension of languagePack.extensions) {
				md5.update(extension.extensionIdentifier.uuid || extension.extensionIdentifier.id).update(extension.version); // CodeQL [SM01510] The extension UUID is not sensitive info and is not manually created by a user
			}
			languagePack.hash = md5.digest('hex');
		}
	}

	private withLanguagePacks<T>(fn: (languagePacks: { [language: string]: ILanguagePack }) => T | null = () => null): Promise<T> {
		return this.languagePacksFileLimiter.queue(() => {
			let result: T | null = null;
			return fs.promises.readFile(this.languagePacksFilePath, 'utf8')
				.then(undefined, err => err.code === 'ENOENT' ? Promise.resolve('{}') : Promise.reject(err))
				.then<{ [language: string]: ILanguagePack }>(raw => { try { return JSON.parse(raw); } catch (e) { return {}; } })
				.then(languagePacks => { result = fn(languagePacks); return languagePacks; })
				.then(languagePacks => {
					for (const language of Object.keys(languagePacks)) {
						if (!languagePacks[language]) {
							delete languagePacks[language];
						}
					}
					this.languagePacks = languagePacks;
					this.initializedCache = true;
					const raw = JSON.stringify(this.languagePacks);
					this.logService.debug('Writing language packs', raw);
					return Promises.writeFile(this.languagePacksFilePath, raw);
				})
				.then(() => result, error => this.logService.error(error));
		});
	}
}

function isValidLocalization(localization: ILocalizationContribution): boolean {
	if (typeof localization.languageId !== 'string') {
		return false;
	}
	if (!Array.isArray(localization.translations) || localization.translations.length === 0) {
		return false;
	}
	for (const translation of localization.translations) {
		if (typeof translation.id !== 'string') {
			return false;
		}
		if (typeof translation.path !== 'string') {
			return false;
		}
	}
	if (localization.languageName && typeof localization.languageName !== 'string') {
		return false;
	}
	if (localization.localizedLanguageName && typeof localization.localizedLanguageName !== 'string') {
		return false;
	}
	return true;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/launch/electron-main/launchMainService.ts]---
Location: vscode-main/src/vs/platform/launch/electron-main/launchMainService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { app } from 'electron';
import { coalesce } from '../../../base/common/arrays.js';
import { IProcessEnvironment, isMacintosh } from '../../../base/common/platform.js';
import { URI } from '../../../base/common/uri.js';
import { whenDeleted } from '../../../base/node/pfs.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { NativeParsedArgs } from '../../environment/common/argv.js';
import { isLaunchedFromCli } from '../../environment/node/argvHelper.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { ILogService } from '../../log/common/log.js';
import { IURLService } from '../../url/common/url.js';
import { ICodeWindow } from '../../window/electron-main/window.js';
import { IWindowSettings } from '../../window/common/window.js';
import { IOpenConfiguration, IWindowsMainService, OpenContext } from '../../windows/electron-main/windows.js';
import { IProtocolUrl } from '../../url/electron-main/url.js';

export const ID = 'launchMainService';
export const ILaunchMainService = createDecorator<ILaunchMainService>(ID);

export interface IStartArguments {
	readonly args: NativeParsedArgs;
	readonly userEnv: IProcessEnvironment;
}

export interface ILaunchMainService {

	readonly _serviceBrand: undefined;

	start(args: NativeParsedArgs, userEnv: IProcessEnvironment): Promise<void>;

	getMainProcessId(): Promise<number>;
}

export class LaunchMainService implements ILaunchMainService {

	declare readonly _serviceBrand: undefined;

	constructor(
		@ILogService private readonly logService: ILogService,
		@IWindowsMainService private readonly windowsMainService: IWindowsMainService,
		@IURLService private readonly urlService: IURLService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
	) { }

	async start(args: NativeParsedArgs, userEnv: IProcessEnvironment): Promise<void> {
		this.logService.trace('Received data from other instance: ', args, userEnv);

		// macOS: Electron > 7.x changed its behaviour to not
		// bring the application to the foreground when a window
		// is focused programmatically. Only via `app.focus` and
		// the option `steal: true` can you get the previous
		// behaviour back. The only reason to use this option is
		// when a window is getting focused while the application
		// is not in the foreground and since we got instructed
		// to open a new window from another instance, we ensure
		// that the app has focus.
		if (isMacintosh) {
			app.focus({ steal: true });
		}

		// Check early for open-url which is handled in URL service
		const urlsToOpen = this.parseOpenUrl(args);
		if (urlsToOpen.length) {
			let whenWindowReady: Promise<unknown> = Promise.resolve();

			// Create a window if there is none
			if (this.windowsMainService.getWindowCount() === 0) {
				const window = (await this.windowsMainService.openEmptyWindow({ context: OpenContext.DESKTOP })).at(0);
				if (window) {
					whenWindowReady = window.ready();
				}
			}

			// Make sure a window is open, ready to receive the url event
			whenWindowReady.then(() => {
				for (const { uri, originalUrl } of urlsToOpen) {
					this.urlService.open(uri, { originalUrl });
				}
			});
		}

		// Otherwise handle in windows service
		else {
			return this.startOpenWindow(args, userEnv);
		}
	}

	private parseOpenUrl(args: NativeParsedArgs): IProtocolUrl[] {
		if (args['open-url'] && args._urls && args._urls.length > 0) {

			// --open-url must contain -- followed by the url(s)
			// process.argv is used over args._ as args._ are resolved to file paths at this point

			return coalesce(args._urls
				.map(url => {
					try {
						return { uri: URI.parse(url), originalUrl: url };
					} catch (err) {
						return null;
					}
				}));
		}

		return [];
	}

	private async startOpenWindow(args: NativeParsedArgs, userEnv: IProcessEnvironment): Promise<void> {
		const context = isLaunchedFromCli(userEnv) ? OpenContext.CLI : OpenContext.DESKTOP;
		let usedWindows: ICodeWindow[] = [];

		const waitMarkerFileURI = args.wait && args.waitMarkerFilePath ? URI.file(args.waitMarkerFilePath) : undefined;
		const remoteAuthority = args.remote || undefined;

		const baseConfig: IOpenConfiguration = {
			context,
			cli: args,
			/**
			 * When opening a new window from a second instance that sent args and env
			 * over to this instance, we want to preserve the environment only if that second
			 * instance was spawned from the CLI or used the `--preserve-env` flag (example:
			 * when using `open -n "VSCode.app" --args --preserve-env WORKSPACE_FOLDER`).
			 *
			 * This is done to ensure that the second window gets treated exactly the same
			 * as the first window, for example, it gets the same resolved user shell environment.
			 *
			 * https://github.com/microsoft/vscode/issues/194736
			 */
			userEnv: (args['preserve-env'] || context === OpenContext.CLI) ? userEnv : undefined,
			waitMarkerFileURI,
			remoteAuthority,
			forceProfile: args.profile,
			forceTempProfile: args['profile-temp']
		};

		// Special case extension development
		if (args.extensionDevelopmentPath) {
			await this.windowsMainService.openExtensionDevelopmentHostWindow(args.extensionDevelopmentPath, baseConfig);
		}

		// Start without file/folder arguments
		else if (!args._.length && !args['folder-uri'] && !args['file-uri']) {
			let openNewWindow = false;

			// Force new window
			if (args['new-window'] || baseConfig.forceProfile || baseConfig.forceTempProfile) {
				openNewWindow = true;
			}

			// Force reuse window
			else if (args['reuse-window']) {
				openNewWindow = false;
			}

			// Otherwise check for settings
			else {
				const windowConfig = this.configurationService.getValue<IWindowSettings | undefined>('window');
				const openWithoutArgumentsInNewWindowConfig = windowConfig?.openWithoutArgumentsInNewWindow || 'default' /* default */;
				switch (openWithoutArgumentsInNewWindowConfig) {
					case 'on':
						openNewWindow = true;
						break;
					case 'off':
						openNewWindow = false;
						break;
					default:
						openNewWindow = !isMacintosh; // prefer to restore running instance on macOS
				}
			}

			// Open new Window
			if (openNewWindow) {
				usedWindows = await this.windowsMainService.open({
					...baseConfig,
					forceNewWindow: true,
					forceEmpty: true
				});
			}

			// Focus existing window or open if none opened
			else {
				const lastActive = this.windowsMainService.getLastActiveWindow();
				if (lastActive) {
					this.windowsMainService.openExistingWindow(lastActive, baseConfig);

					usedWindows = [lastActive];
				} else {
					usedWindows = await this.windowsMainService.open({
						...baseConfig,
						forceEmpty: true
					});
				}
			}
		}

		// Start with file/folder arguments
		else {
			usedWindows = await this.windowsMainService.open({
				...baseConfig,
				forceNewWindow: args['new-window'],
				preferNewWindow: !args['reuse-window'] && !args.wait,
				forceReuseWindow: args['reuse-window'],
				diffMode: args.diff,
				mergeMode: args.merge,
				addMode: args.add,
				removeMode: args.remove,
				noRecentEntry: !!args['skip-add-to-recently-opened'],
				gotoLineMode: args.goto
			});
		}

		// If the other instance is waiting to be killed, we hook up a window listener if one window
		// is being used and only then resolve the startup promise which will kill this second instance.
		// In addition, we poll for the wait marker file to be deleted to return.
		if (waitMarkerFileURI && usedWindows.length === 1 && usedWindows[0]) {
			return Promise.race([
				usedWindows[0].whenClosedOrLoaded,
				whenDeleted(waitMarkerFileURI.fsPath)
			]).then(() => undefined, () => undefined);
		}
	}

	async getMainProcessId(): Promise<number> {
		this.logService.trace('Received request for process ID from other instance.');

		return process.pid;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/layout/browser/layoutService.ts]---
Location: vscode-main/src/vs/platform/layout/browser/layoutService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDimension } from '../../../base/browser/dom.js';
import { Event } from '../../../base/common/event.js';
import { DisposableStore } from '../../../base/common/lifecycle.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';

export const ILayoutService = createDecorator<ILayoutService>('layoutService');

export interface ILayoutOffsetInfo {

	/**
	 * Generic top offset
	 */
	readonly top: number;

	/**
	 * Quick pick specific top offset.
	 */
	readonly quickPickTop: number;
}

export interface ILayoutService {

	readonly _serviceBrand: undefined;

	/**
	 * An event that is emitted when the main container is layed out.
	 */
	readonly onDidLayoutMainContainer: Event<IDimension>;

	/**
	 * An event that is emitted when any container is layed out.
	 */
	readonly onDidLayoutContainer: Event<{ readonly container: HTMLElement; readonly dimension: IDimension }>;

	/**
	 * An event that is emitted when the active container is layed out.
	 */
	readonly onDidLayoutActiveContainer: Event<IDimension>;

	/**
	 * An event that is emitted when a new container is added. This
	 * can happen in multi-window environments.
	 */
	readonly onDidAddContainer: Event<{ readonly container: HTMLElement; readonly disposables: DisposableStore }>;

	/**
	 * An event that is emitted when the active container changes.
	 */
	readonly onDidChangeActiveContainer: Event<void>;

	/**
	 * The dimensions of the main container.
	 */
	readonly mainContainerDimension: IDimension;

	/**
	 * The dimensions of the active container.
	 */
	readonly activeContainerDimension: IDimension;

	/**
	 * Main container of the application.
	 */
	readonly mainContainer: HTMLElement;

	/**
	 * Active container of the application. When multiple windows are opened, will return
	 * the container of the active, focused window.
	 */
	readonly activeContainer: HTMLElement;

	/**
	 * All the containers of the application. There can be one container per window.
	 */
	readonly containers: Iterable<HTMLElement>;

	/**
	 * Get the container for the given window.
	 */
	getContainer(window: Window): HTMLElement;

	/**
	 * Ensures that the styles for the container associated
	 * to the window have loaded. For the main window, this
	 * will resolve instantly, but for floating windows, this
	 * will resolve once the styles have been loaded and helps
	 * for when certain layout assumptions are made.
	 */
	whenContainerStylesLoaded(window: Window): Promise<void> | undefined;

	/**
	 * An offset to use for positioning elements inside the main container.
	 */
	readonly mainContainerOffset: ILayoutOffsetInfo;

	/**
	 * An offset to use for positioning elements inside the container.
	 */
	readonly activeContainerOffset: ILayoutOffsetInfo;

	/**
	 * Focus the primary component of the active container.
	 */
	focus(): void;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/layout/browser/zIndexRegistry.ts]---
Location: vscode-main/src/vs/platform/layout/browser/zIndexRegistry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { clearNode } from '../../../base/browser/dom.js';
import { createCSSRule, createStyleSheet } from '../../../base/browser/domStylesheets.js';
import { RunOnceScheduler } from '../../../base/common/async.js';

export enum ZIndex {
	Base = 0,
	Sash = 35,
	SuggestWidget = 40,
	Hover = 50,
	DragImage = 1000,
	MenubarMenuItemsHolder = 2000, // quick-input-widget
	ContextView = 2500,
	ModalDialog = 2600,
	PaneDropOverlay = 10000
}

const ZIndexValues = Object.keys(ZIndex).filter(key => !isNaN(Number(key))).map(key => Number(key)).sort((a, b) => b - a);
function findBase(z: number) {
	for (const zi of ZIndexValues) {
		if (z >= zi) {
			return zi;
		}
	}

	return -1;
}

class ZIndexRegistry {
	private styleSheet: HTMLStyleElement;
	private zIndexMap: Map<string, number>;
	private scheduler: RunOnceScheduler;
	constructor() {
		this.styleSheet = createStyleSheet();
		this.zIndexMap = new Map<string, number>();
		this.scheduler = new RunOnceScheduler(() => this.updateStyleElement(), 200);
	}

	registerZIndex(relativeLayer: ZIndex, z: number, name: string): string {
		if (this.zIndexMap.get(name)) {
			throw new Error(`z-index with name ${name} has already been registered.`);
		}

		const proposedZValue = relativeLayer + z;
		if (findBase(proposedZValue) !== relativeLayer) {
			throw new Error(`Relative layer: ${relativeLayer} + z-index: ${z} exceeds next layer ${proposedZValue}.`);
		}

		this.zIndexMap.set(name, proposedZValue);
		this.scheduler.schedule();
		return this.getVarName(name);
	}

	private getVarName(name: string): string {
		return `--z-index-${name}`;
	}

	private updateStyleElement(): void {
		clearNode(this.styleSheet);
		let ruleBuilder = '';
		this.zIndexMap.forEach((zIndex, name) => {
			ruleBuilder += `${this.getVarName(name)}: ${zIndex};\n`;
		});
		createCSSRule(':root', ruleBuilder, this.styleSheet);
	}
}

const zIndexRegistry = new ZIndexRegistry();

export function registerZIndex(relativeLayer: ZIndex, z: number, name: string): string {
	return zIndexRegistry.registerZIndex(relativeLayer, z, name);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/lifecycle/common/lifecycle.ts]---
Location: vscode-main/src/vs/platform/lifecycle/common/lifecycle.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isThenable, Promises } from '../../../base/common/async.js';

// Shared veto handling across main and renderer
export function handleVetos(vetos: (boolean | Promise<boolean>)[], onError: (error: Error) => void): Promise<boolean /* veto */> {
	if (vetos.length === 0) {
		return Promise.resolve(false);
	}

	const promises: Promise<void>[] = [];
	let lazyValue = false;

	for (const valueOrPromise of vetos) {

		// veto, done
		if (valueOrPromise === true) {
			return Promise.resolve(true);
		}

		if (isThenable(valueOrPromise)) {
			promises.push(valueOrPromise.then(value => {
				if (value) {
					lazyValue = true; // veto, done
				}
			}, err => {
				onError(err); // error, treated like a veto, done
				lazyValue = true;
			}));
		}
	}

	return Promises.settled(promises).then(() => lazyValue);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/lifecycle/electron-main/lifecycleMainService.ts]---
Location: vscode-main/src/vs/platform/lifecycle/electron-main/lifecycleMainService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import electron from 'electron';
import { validatedIpcMain } from '../../../base/parts/ipc/electron-main/ipcMain.js';
import { Barrier, Promises, timeout } from '../../../base/common/async.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable, DisposableStore } from '../../../base/common/lifecycle.js';
import { isMacintosh, isWindows } from '../../../base/common/platform.js';
import { cwd } from '../../../base/common/process.js';
import { assertReturnsDefined } from '../../../base/common/types.js';
import { NativeParsedArgs } from '../../environment/common/argv.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { ILogService } from '../../log/common/log.js';
import { IStateService } from '../../state/node/state.js';
import { ICodeWindow, LoadReason, UnloadReason } from '../../window/electron-main/window.js';
import { ISingleFolderWorkspaceIdentifier, IWorkspaceIdentifier } from '../../workspace/common/workspace.js';
import { IEnvironmentMainService } from '../../environment/electron-main/environmentMainService.js';
import { IAuxiliaryWindow } from '../../auxiliaryWindow/electron-main/auxiliaryWindow.js';
import { getAllWindowsExcludingOffscreen } from '../../windows/electron-main/windows.js';

export const ILifecycleMainService = createDecorator<ILifecycleMainService>('lifecycleMainService');

interface WindowLoadEvent {

	/**
	 * The window that is loaded to a new workspace.
	 */
	readonly window: ICodeWindow;

	/**
	 * The workspace the window is loaded into.
	 */
	readonly workspace: IWorkspaceIdentifier | ISingleFolderWorkspaceIdentifier | undefined;

	/**
	 * More details why the window loads to a new workspace.
	 */
	readonly reason: LoadReason;
}

export const enum ShutdownReason {

	/**
	 * The application exits normally.
	 */
	QUIT = 1,

	/**
	 * The application exits abnormally and is being
	 * killed with an exit code (e.g. from integration
	 * test run)
	 */
	KILL
}

export interface ShutdownEvent {

	/**
	 * More details why the application is shutting down.
	 */
	reason: ShutdownReason;

	/**
	 * Allows to join the shutdown. The promise can be a long running operation but it
	 * will block the application from closing.
	 */
	join(id: string, promise: Promise<void>): void;
}

export interface IRelaunchHandler {

	/**
	 * Allows a handler to deal with relaunching the application. The return
	 * value indicates if the relaunch is handled or not.
	 */
	handleRelaunch(options?: IRelaunchOptions): boolean;
}

export interface IRelaunchOptions {
	readonly addArgs?: string[];
	readonly removeArgs?: string[];
}

export interface ILifecycleMainService {

	readonly _serviceBrand: undefined;

	/**
	 * Will be true if the program was restarted (e.g. due to explicit request or update).
	 */
	readonly wasRestarted: boolean;

	/**
	 * Will be true if the program was requested to quit.
	 */
	readonly quitRequested: boolean;

	/**
	 * A flag indicating in what phase of the lifecycle we currently are.
	 */
	phase: LifecycleMainPhase;

	/**
	 * An event that fires when the application is about to shutdown before any window is closed.
	 * The shutdown can still be prevented by any window that vetos this event.
	 */
	readonly onBeforeShutdown: Event<void>;

	/**
	 * An event that fires after the onBeforeShutdown event has been fired and after no window has
	 * vetoed the shutdown sequence. At this point listeners are ensured that the application will
	 * quit without veto.
	 */
	readonly onWillShutdown: Event<ShutdownEvent>;

	/**
	 * An event that fires when a window is loading. This can either be a window opening for the
	 * first time or a window reloading or changing to another URL.
	 */
	readonly onWillLoadWindow: Event<WindowLoadEvent>;

	/**
	 * An event that fires before a window closes. This event is fired after any veto has been dealt
	 * with so that listeners know for sure that the window will close without veto.
	 */
	readonly onBeforeCloseWindow: Event<ICodeWindow>;

	/**
	 * Make a `ICodeWindow` known to the lifecycle main service.
	 */
	registerWindow(window: ICodeWindow): void;

	/**
	 * Make a `IAuxiliaryWindow` known to the lifecycle main service.
	 */
	registerAuxWindow(auxWindow: IAuxiliaryWindow): void;

	/**
	 * Reload a window. All lifecycle event handlers are triggered.
	 */
	reload(window: ICodeWindow, cli?: NativeParsedArgs): Promise<void>;

	/**
	 * Unload a window for the provided reason. All lifecycle event handlers are triggered.
	 */
	unload(window: ICodeWindow, reason: UnloadReason): Promise<boolean /* veto */>;

	/**
	 * Restart the application with optional arguments (CLI). All lifecycle event handlers are triggered.
	 */
	relaunch(options?: IRelaunchOptions): Promise<void>;

	/**
	 * Sets a custom handler for relaunching the application.
	 */
	setRelaunchHandler(handler: IRelaunchHandler): void;

	/**
	 * Shutdown the application normally. All lifecycle event handlers are triggered.
	 */
	quit(willRestart?: boolean): Promise<boolean /* veto */>;

	/**
	 * Forcefully shutdown the application and optionally set an exit code.
	 *
	 * This method should only be used in rare situations where it is important
	 * to set an exit code (e.g. running tests) or when the application is
	 * not in a healthy state and should terminate asap.
	 *
	 * This method does not fire the normal lifecycle events to the windows,
	 * that normally can be vetoed. Windows are destroyed without a chance
	 * of components to participate. The only lifecycle event handler that
	 * is triggered is `onWillShutdown` in the main process.
	 */
	kill(code?: number): Promise<void>;

	/**
	 * Returns a promise that resolves when a certain lifecycle phase
	 * has started.
	 */
	when(phase: LifecycleMainPhase): Promise<void>;
}

export const enum LifecycleMainPhase {

	/**
	 * The first phase signals that we are about to startup.
	 */
	Starting = 1,

	/**
	 * Services are ready and first window is about to open.
	 */
	Ready = 2,

	/**
	 * This phase signals a point in time after the window has opened
	 * and is typically the best place to do work that is not required
	 * for the window to open.
	 */
	AfterWindowOpen = 3,

	/**
	 * The last phase after a window has opened and some time has passed
	 * (2-5 seconds).
	 */
	Eventually = 4
}

export class LifecycleMainService extends Disposable implements ILifecycleMainService {

	declare readonly _serviceBrand: undefined;

	private static readonly QUIT_AND_RESTART_KEY = 'lifecycle.quitAndRestart';

	private readonly _onBeforeShutdown = this._register(new Emitter<void>());
	readonly onBeforeShutdown = this._onBeforeShutdown.event;

	private readonly _onWillShutdown = this._register(new Emitter<ShutdownEvent>());
	readonly onWillShutdown = this._onWillShutdown.event;

	private readonly _onWillLoadWindow = this._register(new Emitter<WindowLoadEvent>());
	readonly onWillLoadWindow = this._onWillLoadWindow.event;

	private readonly _onBeforeCloseWindow = this._register(new Emitter<ICodeWindow>());
	readonly onBeforeCloseWindow = this._onBeforeCloseWindow.event;

	private _quitRequested = false;
	get quitRequested(): boolean { return this._quitRequested; }

	private _wasRestarted = false;
	get wasRestarted(): boolean { return this._wasRestarted; }

	private _phase = LifecycleMainPhase.Starting;
	get phase(): LifecycleMainPhase { return this._phase; }

	private readonly windowToCloseRequest = new Set<number>();
	private oneTimeListenerTokenGenerator = 0;
	private windowCounter = 0;

	private pendingQuitPromise: Promise<boolean> | undefined = undefined;
	private pendingQuitPromiseResolve: { (veto: boolean): void } | undefined = undefined;

	private pendingWillShutdownPromise: Promise<void> | undefined = undefined;

	private readonly mapWindowIdToPendingUnload = new Map<number, Promise<boolean>>();

	private readonly phaseWhen = new Map<LifecycleMainPhase, Barrier>();

	private relaunchHandler: IRelaunchHandler | undefined = undefined;

	constructor(
		@ILogService private readonly logService: ILogService,
		@IStateService private readonly stateService: IStateService,
		@IEnvironmentMainService private readonly environmentMainService: IEnvironmentMainService
	) {
		super();

		this.resolveRestarted();
		this.when(LifecycleMainPhase.Ready).then(() => this.registerListeners());
	}

	private resolveRestarted(): void {
		this._wasRestarted = !!this.stateService.getItem(LifecycleMainService.QUIT_AND_RESTART_KEY);

		if (this._wasRestarted) {
			// remove the marker right after if found
			this.stateService.removeItem(LifecycleMainService.QUIT_AND_RESTART_KEY);
		}
	}

	private registerListeners(): void {

		// before-quit: an event that is fired if application quit was
		// requested but before any window was closed.
		const beforeQuitListener = () => {
			if (this._quitRequested) {
				return;
			}

			this.trace('Lifecycle#app.on(before-quit)');
			this._quitRequested = true;

			// Emit event to indicate that we are about to shutdown
			this.trace('Lifecycle#onBeforeShutdown.fire()');
			this._onBeforeShutdown.fire();

			// macOS: can run without any window open. in that case we fire
			// the onWillShutdown() event directly because there is no veto
			// to be expected.
			if (isMacintosh && this.windowCounter === 0) {
				this.fireOnWillShutdown(ShutdownReason.QUIT);
			}
		};
		electron.app.addListener('before-quit', beforeQuitListener);

		// window-all-closed: an event that only fires when the last window
		// was closed. We override this event to be in charge if app.quit()
		// should be called or not.
		const windowAllClosedListener = () => {
			this.trace('Lifecycle#app.on(window-all-closed)');

			// Windows/Linux: we quit when all windows have closed
			// Mac: we only quit when quit was requested
			if (this._quitRequested || !isMacintosh) {
				electron.app.quit();
			}
		};
		electron.app.addListener('window-all-closed', windowAllClosedListener);

		// will-quit: an event that is fired after all windows have been
		// closed, but before actually quitting.
		electron.app.once('will-quit', e => {
			this.trace('Lifecycle#app.on(will-quit) - begin');

			// Prevent the quit until the shutdown promise was resolved
			e.preventDefault();

			// Start shutdown sequence
			const shutdownPromise = this.fireOnWillShutdown(ShutdownReason.QUIT);

			// Wait until shutdown is signaled to be complete
			shutdownPromise.finally(() => {
				this.trace('Lifecycle#app.on(will-quit) - after fireOnWillShutdown');

				// Resolve pending quit promise now without veto
				this.resolvePendingQuitPromise(false /* no veto */);

				// Quit again, this time do not prevent this, since our
				// will-quit listener is only installed "once". Also
				// remove any listener we have that is no longer needed

				electron.app.removeListener('before-quit', beforeQuitListener);
				electron.app.removeListener('window-all-closed', windowAllClosedListener);

				this.trace('Lifecycle#app.on(will-quit) - calling app.quit()');

				electron.app.quit();
			});
		});
	}

	private fireOnWillShutdown(reason: ShutdownReason): Promise<void> {
		if (this.pendingWillShutdownPromise) {
			return this.pendingWillShutdownPromise; // shutdown is already running
		}

		const logService = this.logService;
		this.trace('Lifecycle#onWillShutdown.fire()');

		const joiners: Promise<void>[] = [];

		this._onWillShutdown.fire({
			reason,
			join(id, promise) {
				logService.trace(`Lifecycle#onWillShutdown - begin '${id}'`);
				joiners.push(promise.finally(() => {
					logService.trace(`Lifecycle#onWillShutdown - end '${id}'`);
				}));
			}
		});

		this.pendingWillShutdownPromise = (async () => {

			// Settle all shutdown event joiners
			try {
				await Promises.settled(joiners);
			} catch (error) {
				this.logService.error(error);
			}

			// Then, always make sure at the end
			// the state service is flushed.
			try {
				await this.stateService.close();
			} catch (error) {
				this.logService.error(error);
			}
		})();

		return this.pendingWillShutdownPromise;
	}

	set phase(value: LifecycleMainPhase) {
		if (value < this.phase) {
			throw new Error('Lifecycle cannot go backwards');
		}

		if (this._phase === value) {
			return;
		}

		this.trace(`lifecycle (main): phase changed (value: ${value})`);

		this._phase = value;

		const barrier = this.phaseWhen.get(this._phase);
		if (barrier) {
			barrier.open();
			this.phaseWhen.delete(this._phase);
		}
	}

	async when(phase: LifecycleMainPhase): Promise<void> {
		if (phase <= this._phase) {
			return;
		}

		let barrier = this.phaseWhen.get(phase);
		if (!barrier) {
			barrier = new Barrier();
			this.phaseWhen.set(phase, barrier);
		}

		await barrier.wait();
	}

	registerWindow(window: ICodeWindow): void {
		const windowListeners = new DisposableStore();

		// track window count
		this.windowCounter++;

		// Window Will Load
		windowListeners.add(window.onWillLoad(e => this._onWillLoadWindow.fire({ window, workspace: e.workspace, reason: e.reason })));

		// Window Before Closing: Main -> Renderer
		const win = assertReturnsDefined(window.win);
		windowListeners.add(Event.fromNodeEventEmitter<electron.Event>(win, 'close')(e => {

			// The window already acknowledged to be closed
			const windowId = window.id;
			if (this.windowToCloseRequest.delete(windowId)) {
				return;
			}

			this.trace(`Lifecycle#window.on('close') - window ID ${window.id}`);

			// Otherwise prevent unload and handle it from window
			e.preventDefault();
			this.unload(window, UnloadReason.CLOSE).then(veto => {
				if (veto) {
					this.windowToCloseRequest.delete(windowId);
					return;
				}

				this.windowToCloseRequest.add(windowId);

				// Fire onBeforeCloseWindow before actually closing
				this.trace(`Lifecycle#onBeforeCloseWindow.fire() - window ID ${windowId}`);
				this._onBeforeCloseWindow.fire(window);

				// No veto, close window now
				window.close();
			});
		}));
		windowListeners.add(Event.fromNodeEventEmitter<electron.Event>(win, 'closed')(() => {
			this.trace(`Lifecycle#window.on('closed') - window ID ${window.id}`);

			// update window count
			this.windowCounter--;

			// clear window listeners
			windowListeners.dispose();

			// if there are no more code windows opened, fire the onWillShutdown event, unless
			// we are on macOS where it is perfectly fine to close the last window and
			// the application continues running (unless quit was actually requested)
			if (this.windowCounter === 0 && (!isMacintosh || this._quitRequested)) {
				this.fireOnWillShutdown(ShutdownReason.QUIT);
			}
		}));
	}

	registerAuxWindow(auxWindow: IAuxiliaryWindow): void {
		const win = assertReturnsDefined(auxWindow.win);

		const windowListeners = new DisposableStore();
		windowListeners.add(Event.fromNodeEventEmitter<electron.Event>(win, 'close')(e => {
			this.trace(`Lifecycle#auxWindow.on('close') - window ID ${auxWindow.id}`);

			if (this._quitRequested) {
				this.trace(`Lifecycle#auxWindow.on('close') - preventDefault() because quit requested`);

				// When quit is requested, Electron will close all
				// auxiliary windows before closing the main windows.
				// This prevents us from storing the auxiliary window
				// state on shutdown and thus we prevent closing if
				// quit is requested.
				//
				// Interestingly, this will not prevent the application
				// from quitting because the auxiliary windows will still
				// close once the owning window closes.

				e.preventDefault();
			}
		}));
		windowListeners.add(Event.fromNodeEventEmitter<electron.Event>(win, 'closed')(() => {
			this.trace(`Lifecycle#auxWindow.on('closed') - window ID ${auxWindow.id}`);

			windowListeners.dispose();
		}));
	}

	async reload(window: ICodeWindow, cli?: NativeParsedArgs): Promise<void> {

		// Only reload when the window has not vetoed this
		const veto = await this.unload(window, UnloadReason.RELOAD);
		if (!veto) {
			window.reload(cli);
		}
	}

	unload(window: ICodeWindow, reason: UnloadReason): Promise<boolean /* veto */> {

		// Ensure there is only 1 unload running at the same time
		const pendingUnloadPromise = this.mapWindowIdToPendingUnload.get(window.id);
		if (pendingUnloadPromise) {
			return pendingUnloadPromise;
		}

		// Start unload and remember in map until finished
		const unloadPromise = this.doUnload(window, reason).finally(() => {
			this.mapWindowIdToPendingUnload.delete(window.id);
		});
		this.mapWindowIdToPendingUnload.set(window.id, unloadPromise);

		return unloadPromise;
	}

	private async doUnload(window: ICodeWindow, reason: UnloadReason): Promise<boolean /* veto */> {

		// Always allow to unload a window that is not yet ready
		if (!window.isReady) {
			return false;
		}

		this.trace(`Lifecycle#unload() - window ID ${window.id}`);

		// first ask the window itself if it vetos the unload
		const windowUnloadReason = this._quitRequested ? UnloadReason.QUIT : reason;
		const veto = await this.onBeforeUnloadWindowInRenderer(window, windowUnloadReason);
		if (veto) {
			this.trace(`Lifecycle#unload() - veto in renderer (window ID ${window.id})`);

			return this.handleWindowUnloadVeto(veto);
		}

		// finally if there are no vetos, unload the renderer
		await this.onWillUnloadWindowInRenderer(window, windowUnloadReason);

		return false;
	}

	private handleWindowUnloadVeto(veto: boolean): boolean {
		if (!veto) {
			return false; // no veto
		}

		// a veto resolves any pending quit with veto
		this.resolvePendingQuitPromise(true /* veto */);

		// a veto resets the pending quit request flag
		this._quitRequested = false;

		return true; // veto
	}

	private resolvePendingQuitPromise(veto: boolean): void {
		if (this.pendingQuitPromiseResolve) {
			this.pendingQuitPromiseResolve(veto);
			this.pendingQuitPromiseResolve = undefined;
			this.pendingQuitPromise = undefined;
		}
	}

	private onBeforeUnloadWindowInRenderer(window: ICodeWindow, reason: UnloadReason): Promise<boolean /* veto */> {
		return new Promise<boolean>(resolve => {
			const oneTimeEventToken = this.oneTimeListenerTokenGenerator++;
			const okChannel = `vscode:ok${oneTimeEventToken}`;
			const cancelChannel = `vscode:cancel${oneTimeEventToken}`;

			validatedIpcMain.once(okChannel, () => {
				resolve(false); // no veto
			});

			validatedIpcMain.once(cancelChannel, () => {
				resolve(true); // veto
			});

			window.send('vscode:onBeforeUnload', { okChannel, cancelChannel, reason });
		});
	}

	private onWillUnloadWindowInRenderer(window: ICodeWindow, reason: UnloadReason): Promise<void> {
		return new Promise<void>(resolve => {
			const oneTimeEventToken = this.oneTimeListenerTokenGenerator++;
			const replyChannel = `vscode:reply${oneTimeEventToken}`;

			validatedIpcMain.once(replyChannel, () => resolve());

			window.send('vscode:onWillUnload', { replyChannel, reason });
		});
	}

	quit(willRestart?: boolean): Promise<boolean /* veto */> {
		return this.doQuit(willRestart).then(veto => {
			if (!veto && willRestart) {
				// Windows: we are about to restart and as such we need to restore the original
				// current working directory we had on startup to get the exact same startup
				// behaviour. As such, we briefly change back to that directory and then when
				// Code starts it will set it back to the installation directory again.
				try {
					if (isWindows) {
						const currentWorkingDir = cwd();
						if (currentWorkingDir !== process.cwd()) {
							process.chdir(currentWorkingDir);
						}
					}
				} catch (err) {
					this.logService.error(err);
				}
			}

			return veto;
		});
	}

	private doQuit(willRestart?: boolean): Promise<boolean /* veto */> {
		this.trace(`Lifecycle#quit() - begin (willRestart: ${willRestart})`);

		if (this.pendingQuitPromise) {
			this.trace('Lifecycle#quit() - returning pending quit promise');

			return this.pendingQuitPromise;
		}

		// Remember if we are about to restart
		if (willRestart) {
			this.stateService.setItem(LifecycleMainService.QUIT_AND_RESTART_KEY, true);
		}

		this.pendingQuitPromise = new Promise(resolve => {

			// Store as field to access it from a window cancellation
			this.pendingQuitPromiseResolve = resolve;

			// Calling app.quit() will trigger the close handlers of each opened window
			// and only if no window vetoed the shutdown, we will get the will-quit event
			this.trace('Lifecycle#quit() - calling app.quit()');
			electron.app.quit();
		});

		return this.pendingQuitPromise;
	}

	private trace(msg: string): void {
		if (this.environmentMainService.args['enable-smoke-test-driver']) {
			this.logService.info(msg); // helps diagnose issues with exiting from smoke tests
		} else {
			this.logService.trace(msg);
		}
	}

	setRelaunchHandler(handler: IRelaunchHandler): void {
		this.relaunchHandler = handler;
	}

	async relaunch(options?: IRelaunchOptions): Promise<void> {
		this.trace('Lifecycle#relaunch()');

		const args = process.argv.slice(1);
		if (options?.addArgs) {
			args.push(...options.addArgs);
		}

		if (options?.removeArgs) {
			for (const a of options.removeArgs) {
				const idx = args.indexOf(a);
				if (idx >= 0) {
					args.splice(idx, 1);
				}
			}
		}

		const quitListener = () => {
			if (!this.relaunchHandler?.handleRelaunch(options)) {
				this.trace('Lifecycle#relaunch() - calling app.relaunch()');
				electron.app.relaunch({ args });
			}
		};
		electron.app.once('quit', quitListener);

		// `app.relaunch()` does not quit automatically, so we quit first,
		// check for vetoes and then relaunch from the `app.on('quit')` event
		const veto = await this.quit(true /* will restart */);
		if (veto) {
			electron.app.removeListener('quit', quitListener);
		}
	}

	async kill(code?: number): Promise<void> {
		this.trace('Lifecycle#kill()');

		// Give main process participants a chance to orderly shutdown
		await this.fireOnWillShutdown(ShutdownReason.KILL);

		// From extension tests we have seen issues where calling app.exit()
		// with an opened window can lead to native crashes (Linux). As such,
		// we should make sure to destroy any opened window before calling
		// `app.exit()`.
		//
		// Note: Electron implements a similar logic here:
		// https://github.com/electron/electron/blob/fe5318d753637c3903e23fc1ed1b263025887b6a/spec-main/window-helpers.ts#L5

		await Promise.race([

			// Still do not block more than 1s
			timeout(1000),

			// Destroy any opened window: we do not unload windows here because
			// there is a chance that the unload is veto'd or long running due
			// to a participant within the window. this is not wanted when we
			// are asked to kill the application.
			(async () => {
				for (const window of getAllWindowsExcludingOffscreen()) {
					if (window && !window.isDestroyed()) {
						let whenWindowClosed: Promise<void>;
						if (window.webContents && !window.webContents.isDestroyed()) {
							whenWindowClosed = new Promise(resolve => window.once('closed', resolve));
						} else {
							whenWindowClosed = Promise.resolve();
						}

						window.destroy();
						await whenWindowClosed;
					}
				}
			})()
		]);

		// Now exit either after 1s or all windows destroyed
		electron.app.exit(code);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/lifecycle/node/sharedProcessLifecycleService.ts]---
Location: vscode-main/src/vs/platform/lifecycle/node/sharedProcessLifecycleService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { ILogService } from '../../log/common/log.js';

export const ISharedProcessLifecycleService = createDecorator<ISharedProcessLifecycleService>('sharedProcessLifecycleService');

export interface ISharedProcessLifecycleService {

	readonly _serviceBrand: undefined;

	/**
	 * An event for when the application will shutdown
	 */
	readonly onWillShutdown: Event<void>;
}

export class SharedProcessLifecycleService extends Disposable implements ISharedProcessLifecycleService {

	declare readonly _serviceBrand: undefined;

	private readonly _onWillShutdown = this._register(new Emitter<void>());
	readonly onWillShutdown = this._onWillShutdown.event;

	constructor(
		@ILogService private readonly logService: ILogService
	) {
		super();
	}

	fireOnWillShutdown(): void {
		this.logService.trace('Lifecycle#onWillShutdown.fire()');

		this._onWillShutdown.fire();
	}
}
```

--------------------------------------------------------------------------------

````
