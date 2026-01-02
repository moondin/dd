---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 173
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 173 of 552)

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

---[FILE: src/vs/base/common/comparers.ts]---
Location: vscode-main/src/vs/base/common/comparers.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { safeIntl } from './date.js';
import { Lazy } from './lazy.js';
import { sep } from './path.js';

// When comparing large numbers of strings it's better for performance to create an
// Intl.Collator object and use the function provided by its compare property
// than it is to use String.prototype.localeCompare()

// A collator with numeric sorting enabled, and no sensitivity to case, accents or diacritics.
const intlFileNameCollatorBaseNumeric: Lazy<{ collator: Intl.Collator; collatorIsNumeric: boolean }> = new Lazy(() => {
	const collator = safeIntl.Collator(undefined, { numeric: true, sensitivity: 'base' }).value;
	return {
		collator,
		collatorIsNumeric: collator.resolvedOptions().numeric
	};
});

// A collator with numeric sorting enabled.
const intlFileNameCollatorNumeric: Lazy<{ collator: Intl.Collator }> = new Lazy(() => {
	const collator = safeIntl.Collator(undefined, { numeric: true }).value;
	return {
		collator
	};
});

// A collator with numeric sorting enabled, and sensitivity to accents and diacritics but not case.
const intlFileNameCollatorNumericCaseInsensitive: Lazy<{ collator: Intl.Collator }> = new Lazy(() => {
	const collator = safeIntl.Collator(undefined, { numeric: true, sensitivity: 'accent' }).value;
	return {
		collator
	};
});

/** Compares filenames without distinguishing the name from the extension. Disambiguates by unicode comparison. */
export function compareFileNames(one: string | null, other: string | null, caseSensitive = false): number {
	const a = one || '';
	const b = other || '';
	const result = intlFileNameCollatorBaseNumeric.value.collator.compare(a, b);

	// Using the numeric option will make compare(`foo1`, `foo01`) === 0. Disambiguate.
	if (intlFileNameCollatorBaseNumeric.value.collatorIsNumeric && result === 0 && a !== b) {
		return a < b ? -1 : 1;
	}

	return result;
}

/** Compares full filenames without grouping by case. */
export function compareFileNamesDefault(one: string | null, other: string | null): number {
	const collatorNumeric = intlFileNameCollatorNumeric.value.collator;
	one = one || '';
	other = other || '';

	return compareAndDisambiguateByLength(collatorNumeric, one, other);
}

/** Compares full filenames grouping uppercase names before lowercase. */
export function compareFileNamesUpper(one: string | null, other: string | null) {
	const collatorNumeric = intlFileNameCollatorNumeric.value.collator;
	one = one || '';
	other = other || '';

	return compareCaseUpperFirst(one, other) || compareAndDisambiguateByLength(collatorNumeric, one, other);
}

/** Compares full filenames grouping lowercase names before uppercase. */
export function compareFileNamesLower(one: string | null, other: string | null) {
	const collatorNumeric = intlFileNameCollatorNumeric.value.collator;
	one = one || '';
	other = other || '';

	return compareCaseLowerFirst(one, other) || compareAndDisambiguateByLength(collatorNumeric, one, other);
}

/** Compares full filenames by unicode value. */
export function compareFileNamesUnicode(one: string | null, other: string | null) {
	one = one || '';
	other = other || '';

	if (one === other) {
		return 0;
	}

	return one < other ? -1 : 1;
}

/** Compares filenames by extension, then by name. Disambiguates by unicode comparison. */
export function compareFileExtensions(one: string | null, other: string | null): number {
	const [oneName, oneExtension] = extractNameAndExtension(one);
	const [otherName, otherExtension] = extractNameAndExtension(other);

	let result = intlFileNameCollatorBaseNumeric.value.collator.compare(oneExtension, otherExtension);

	if (result === 0) {
		// Using the numeric option will  make compare(`foo1`, `foo01`) === 0. Disambiguate.
		if (intlFileNameCollatorBaseNumeric.value.collatorIsNumeric && oneExtension !== otherExtension) {
			return oneExtension < otherExtension ? -1 : 1;
		}

		// Extensions are equal, compare filenames
		result = intlFileNameCollatorBaseNumeric.value.collator.compare(oneName, otherName);

		if (intlFileNameCollatorBaseNumeric.value.collatorIsNumeric && result === 0 && oneName !== otherName) {
			return oneName < otherName ? -1 : 1;
		}
	}

	return result;
}

/** Compares filenames by extension, then by full filename. Mixes uppercase and lowercase names together. */
export function compareFileExtensionsDefault(one: string | null, other: string | null): number {
	one = one || '';
	other = other || '';
	const oneExtension = extractExtension(one);
	const otherExtension = extractExtension(other);
	const collatorNumeric = intlFileNameCollatorNumeric.value.collator;
	const collatorNumericCaseInsensitive = intlFileNameCollatorNumericCaseInsensitive.value.collator;

	return compareAndDisambiguateByLength(collatorNumericCaseInsensitive, oneExtension, otherExtension) ||
		compareAndDisambiguateByLength(collatorNumeric, one, other);
}

/** Compares filenames by extension, then case, then full filename. Groups uppercase names before lowercase. */
export function compareFileExtensionsUpper(one: string | null, other: string | null): number {
	one = one || '';
	other = other || '';
	const oneExtension = extractExtension(one);
	const otherExtension = extractExtension(other);
	const collatorNumeric = intlFileNameCollatorNumeric.value.collator;
	const collatorNumericCaseInsensitive = intlFileNameCollatorNumericCaseInsensitive.value.collator;

	return compareAndDisambiguateByLength(collatorNumericCaseInsensitive, oneExtension, otherExtension) ||
		compareCaseUpperFirst(one, other) ||
		compareAndDisambiguateByLength(collatorNumeric, one, other);
}

/** Compares filenames by extension, then case, then full filename. Groups lowercase names before uppercase. */
export function compareFileExtensionsLower(one: string | null, other: string | null): number {
	one = one || '';
	other = other || '';
	const oneExtension = extractExtension(one);
	const otherExtension = extractExtension(other);
	const collatorNumeric = intlFileNameCollatorNumeric.value.collator;
	const collatorNumericCaseInsensitive = intlFileNameCollatorNumericCaseInsensitive.value.collator;

	return compareAndDisambiguateByLength(collatorNumericCaseInsensitive, oneExtension, otherExtension) ||
		compareCaseLowerFirst(one, other) ||
		compareAndDisambiguateByLength(collatorNumeric, one, other);
}

/** Compares filenames by case-insensitive extension unicode value, then by full filename unicode value. */
export function compareFileExtensionsUnicode(one: string | null, other: string | null) {
	one = one || '';
	other = other || '';
	const oneExtension = extractExtension(one).toLowerCase();
	const otherExtension = extractExtension(other).toLowerCase();

	// Check for extension differences
	if (oneExtension !== otherExtension) {
		return oneExtension < otherExtension ? -1 : 1;
	}

	// Check for full filename differences.
	if (one !== other) {
		return one < other ? -1 : 1;
	}

	return 0;
}

const FileNameMatch = /^(.*?)(\.([^.]*))?$/;

/** Extracts the name and extension from a full filename, with optional special handling for dotfiles */
function extractNameAndExtension(str?: string | null, dotfilesAsNames = false): [string, string] {
	const match = str ? FileNameMatch.exec(str) as Array<string> : ([] as Array<string>);

	let result: [string, string] = [(match && match[1]) || '', (match && match[3]) || ''];

	// if the dotfilesAsNames option is selected, treat an empty filename with an extension
	// or a filename that starts with a dot, as a dotfile name
	if (dotfilesAsNames && (!result[0] && result[1] || result[0] && result[0].charAt(0) === '.')) {
		result = [result[0] + '.' + result[1], ''];
	}

	return result;
}

/** Extracts the extension from a full filename. Treats dotfiles as names, not extensions. */
function extractExtension(str?: string | null): string {
	const match = str ? FileNameMatch.exec(str) as Array<string> : ([] as Array<string>);

	return (match && match[1] && match[1].charAt(0) !== '.' && match[3]) || '';
}

function compareAndDisambiguateByLength(collator: Intl.Collator, one: string, other: string) {
	// Check for differences
	const result = collator.compare(one, other);
	if (result !== 0) {
		return result;
	}

	// In a numeric comparison, `foo1` and `foo01` will compare as equivalent.
	// Disambiguate by sorting the shorter string first.
	if (one.length !== other.length) {
		return one.length < other.length ? -1 : 1;
	}

	return 0;
}

/** @returns `true` if the string is starts with a lowercase letter. Otherwise, `false`. */
function startsWithLower(string: string) {
	const character = string.charAt(0);

	return (character.toLocaleUpperCase() !== character) ? true : false;
}

/** @returns `true` if the string starts with an uppercase letter. Otherwise, `false`. */
function startsWithUpper(string: string) {
	const character = string.charAt(0);

	return (character.toLocaleLowerCase() !== character) ? true : false;
}

/**
 * Compares the case of the provided strings - lowercase before uppercase
 *
 * @returns
 * ```text
 *   -1 if one is lowercase and other is uppercase
 *    1 if one is uppercase and other is lowercase
 *    0 otherwise
 * ```
 */
function compareCaseLowerFirst(one: string, other: string): number {
	if (startsWithLower(one) && startsWithUpper(other)) {
		return -1;
	}
	return (startsWithUpper(one) && startsWithLower(other)) ? 1 : 0;
}

/**
 * Compares the case of the provided strings - uppercase before lowercase
 *
 * @returns
 * ```text
 *   -1 if one is uppercase and other is lowercase
 *    1 if one is lowercase and other is uppercase
 *    0 otherwise
 * ```
 */
function compareCaseUpperFirst(one: string, other: string): number {
	if (startsWithUpper(one) && startsWithLower(other)) {
		return -1;
	}
	return (startsWithLower(one) && startsWithUpper(other)) ? 1 : 0;
}

function comparePathComponents(one: string, other: string, caseSensitive = false): number {
	if (!caseSensitive) {
		one = one && one.toLowerCase();
		other = other && other.toLowerCase();
	}

	if (one === other) {
		return 0;
	}

	return one < other ? -1 : 1;
}

export function comparePaths(one: string, other: string, caseSensitive = false): number {
	const oneParts = one.split(sep);
	const otherParts = other.split(sep);

	const lastOne = oneParts.length - 1;
	const lastOther = otherParts.length - 1;
	let endOne: boolean, endOther: boolean;

	for (let i = 0; ; i++) {
		endOne = lastOne === i;
		endOther = lastOther === i;

		if (endOne && endOther) {
			return compareFileNames(oneParts[i], otherParts[i], caseSensitive);
		} else if (endOne) {
			return -1;
		} else if (endOther) {
			return 1;
		}

		const result = comparePathComponents(oneParts[i], otherParts[i], caseSensitive);

		if (result !== 0) {
			return result;
		}
	}
}

export function compareAnything(one: string, other: string, lookFor: string): number {
	const elementAName = one.toLowerCase();
	const elementBName = other.toLowerCase();

	// Sort prefix matches over non prefix matches
	const prefixCompare = compareByPrefix(one, other, lookFor);
	if (prefixCompare) {
		return prefixCompare;
	}

	// Sort suffix matches over non suffix matches
	const elementASuffixMatch = elementAName.endsWith(lookFor);
	const elementBSuffixMatch = elementBName.endsWith(lookFor);
	if (elementASuffixMatch !== elementBSuffixMatch) {
		return elementASuffixMatch ? -1 : 1;
	}

	// Understand file names
	const r = compareFileNames(elementAName, elementBName);
	if (r !== 0) {
		return r;
	}

	// Compare by name
	return elementAName.localeCompare(elementBName);
}

export function compareByPrefix(one: string, other: string, lookFor: string): number {
	const elementAName = one.toLowerCase();
	const elementBName = other.toLowerCase();

	// Sort prefix matches over non prefix matches
	const elementAPrefixMatch = elementAName.startsWith(lookFor);
	const elementBPrefixMatch = elementBName.startsWith(lookFor);
	if (elementAPrefixMatch !== elementBPrefixMatch) {
		return elementAPrefixMatch ? -1 : 1;
	}

	// Same prefix: Sort shorter matches to the top to have those on top that match more precisely
	else if (elementAPrefixMatch && elementBPrefixMatch) {
		if (elementAName.length < elementBName.length) {
			return -1;
		}

		if (elementAName.length > elementBName.length) {
			return 1;
		}
	}

	return 0;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/console.ts]---
Location: vscode-main/src/vs/base/common/console.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from './uri.js';

export interface IRemoteConsoleLog {
	type: string;
	severity: string;
	arguments: string;
}

export interface IStackArgument {
	__$stack: string;
}

export interface IStackFrame {
	uri: URI;
	line: number;
	column: number;
}

export function isRemoteConsoleLog(obj: unknown): obj is IRemoteConsoleLog {
	const entry = obj as IRemoteConsoleLog;

	return entry && typeof entry.type === 'string' && typeof entry.severity === 'string';
}

export function parse(entry: IRemoteConsoleLog): { args: any[]; stack?: string } {
	const args: any[] = [];
	let stack: string | undefined;

	// Parse Entry
	try {
		const parsedArguments: any[] = JSON.parse(entry.arguments);

		// Check for special stack entry as last entry
		const stackArgument = parsedArguments[parsedArguments.length - 1] as IStackArgument;
		if (stackArgument && stackArgument.__$stack) {
			parsedArguments.pop(); // stack is handled specially
			stack = stackArgument.__$stack;
		}

		args.push(...parsedArguments);
	} catch (error) {
		args.push('Unable to log remote console arguments', entry.arguments);
	}

	return { args, stack };
}

export function getFirstFrame(entry: IRemoteConsoleLog): IStackFrame | undefined;
export function getFirstFrame(stack: string | undefined): IStackFrame | undefined;
export function getFirstFrame(arg0: IRemoteConsoleLog | string | undefined): IStackFrame | undefined {
	if (typeof arg0 !== 'string') {
		return getFirstFrame(parse(arg0!).stack);
	}

	// Parse a source information out of the stack if we have one. Format can be:
	// at vscode.commands.registerCommand (/Users/someone/Desktop/test-ts/out/src/extension.js:18:17)
	// or
	// at /Users/someone/Desktop/test-ts/out/src/extension.js:18:17
	// or
	// at c:\Users\someone\Desktop\end-js\extension.js:19:17
	// or
	// at e.$executeContributedCommand(c:\Users\someone\Desktop\end-js\extension.js:19:17)
	const stack = arg0;
	if (stack) {
		const topFrame = findFirstFrame(stack);

		// at [^\/]* => line starts with "at" followed by any character except '/' (to not capture unix paths too late)
		// (?:(?:[a-zA-Z]+:)|(?:[\/])|(?:\\\\) => windows drive letter OR unix root OR unc root
		// (?:.+) => simple pattern for the path, only works because of the line/col pattern after
		// :(?:\d+):(?:\d+) => :line:column data
		const matches = /at [^\/]*((?:(?:[a-zA-Z]+:)|(?:[\/])|(?:\\\\))(?:.+)):(\d+):(\d+)/.exec(topFrame || '');
		if (matches && matches.length === 4) {
			return {
				uri: URI.file(matches[1]),
				line: Number(matches[2]),
				column: Number(matches[3])
			};
		}
	}

	return undefined;
}

function findFirstFrame(stack: string | undefined): string | undefined {
	if (!stack) {
		return stack;
	}

	const newlineIndex = stack.indexOf('\n');
	if (newlineIndex === -1) {
		return stack;
	}

	return stack.substring(0, newlineIndex);
}

export function log(entry: IRemoteConsoleLog, label: string): void {
	const { args, stack } = parse(entry);

	const isOneStringArg = typeof args[0] === 'string' && args.length === 1;

	let topFrame = findFirstFrame(stack);
	if (topFrame) {
		topFrame = `(${topFrame.trim()})`;
	}

	let consoleArgs: string[] = [];

	// First arg is a string
	if (typeof args[0] === 'string') {
		if (topFrame && isOneStringArg) {
			consoleArgs = [`%c[${label}] %c${args[0]} %c${topFrame}`, color('blue'), color(''), color('grey')];
		} else {
			consoleArgs = [`%c[${label}] %c${args[0]}`, color('blue'), color(''), ...args.slice(1)];
		}
	}

	// First arg is something else, just apply all
	else {
		consoleArgs = [`%c[${label}]%`, color('blue'), ...args];
	}

	// Stack: add to args unless already added
	if (topFrame && !isOneStringArg) {
		consoleArgs.push(topFrame);
	}

	// Log it
	// eslint-disable-next-line local/code-no-any-casts
	if (typeof (console as any)[entry.severity] !== 'function') {
		throw new Error('Unknown console method');
	}
	// eslint-disable-next-line local/code-no-any-casts
	(console as any)[entry.severity].apply(console, consoleArgs);
}

function color(color: string): string {
	return `color: ${color}`;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/controlFlow.ts]---
Location: vscode-main/src/vs/base/common/controlFlow.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { BugIndicatingError } from './errors.js';

/*
 * This file contains helper classes to manage control flow.
*/

/**
 * Prevents code from being re-entrant.
*/
export class ReentrancyBarrier {
	private _isOccupied = false;

	/**
	 * Calls `runner` if the barrier is not occupied.
	 * During the call, the barrier becomes occupied.
	 */
	public runExclusivelyOrSkip(runner: () => void): void {
		if (this._isOccupied) {
			return;
		}
		this._isOccupied = true;
		try {
			runner();
		} finally {
			this._isOccupied = false;
		}
	}

	/**
	 * Calls `runner`. If the barrier is occupied, throws an error.
	 * During the call, the barrier becomes active.
	 */
	public runExclusivelyOrThrow(runner: () => void): void {
		if (this._isOccupied) {
			throw new BugIndicatingError(`ReentrancyBarrier: reentrant call detected!`);
		}
		this._isOccupied = true;
		try {
			runner();
		} finally {
			this._isOccupied = false;
		}
	}

	/**
	 * Indicates if some runner occupies this barrier.
	*/
	public get isOccupied() {
		return this._isOccupied;
	}

	public makeExclusiveOrSkip<TArgs extends unknown[]>(fn: (...args: TArgs) => void): (...args: TArgs) => void {
		return ((...args: TArgs) => {
			if (this._isOccupied) {
				return;
			}
			this._isOccupied = true;
			try {
				return fn(...args);
			} finally {
				this._isOccupied = false;
			}
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/dataTransfer.ts]---
Location: vscode-main/src/vs/base/common/dataTransfer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { distinct } from './arrays.js';
import { Iterable } from './iterator.js';
import { URI } from './uri.js';
import { generateUuid } from './uuid.js';

export interface IDataTransferFile {
	readonly id: string;
	readonly name: string;
	readonly uri?: URI;
	data(): Promise<Uint8Array>;
}

export interface IDataTransferItem {
	id?: string;
	asString(): Thenable<string>;
	asFile(): IDataTransferFile | undefined;
	value: unknown;
}

export function createStringDataTransferItem(stringOrPromise: string | Promise<string>, id?: string): IDataTransferItem {
	return {
		id,
		asString: async () => stringOrPromise,
		asFile: () => undefined,
		value: typeof stringOrPromise === 'string' ? stringOrPromise : undefined,
	};
}

export function createFileDataTransferItem(fileName: string, uri: URI | undefined, data: () => Promise<Uint8Array>, id?: string): IDataTransferItem {
	const file = { id: generateUuid(), name: fileName, uri, data };
	return {
		id,
		asString: async () => '',
		asFile: () => file,
		value: undefined,
	};
}

export interface IReadonlyVSDataTransfer extends Iterable<readonly [string, IDataTransferItem]> {
	/**
	 * Get the total number of entries in this data transfer.
	 */
	get size(): number;

	/**
	 * Check if this data transfer contains data for `mimeType`.
	 *
	 * This uses exact matching and does not support wildcards.
	 */
	has(mimeType: string): boolean;

	/**
	 * Check if this data transfer contains data matching `pattern`.
	 *
	 * This allows matching for wildcards, such as `image/*`.
	 *
	 * Use the special `files` mime type to match any file in the data transfer.
	 */
	matches(pattern: string): boolean;

	/**
	 * Retrieve the first entry for `mimeType`.
	 *
	 * Note that if you want to find all entries for a given mime type, use {@link IReadonlyVSDataTransfer.entries} instead.
	 */
	get(mimeType: string): IDataTransferItem | undefined;
}

export class VSDataTransfer implements IReadonlyVSDataTransfer {

	private readonly _entries = new Map<string, IDataTransferItem[]>();

	public get size(): number {
		let size = 0;
		for (const _ of this._entries) {
			size++;
		}
		return size;
	}

	public has(mimeType: string): boolean {
		return this._entries.has(this.toKey(mimeType));
	}

	public matches(pattern: string): boolean {
		const mimes = [...this._entries.keys()];
		if (Iterable.some(this, ([_, item]) => item.asFile())) {
			mimes.push('files');
		}

		return matchesMimeType_normalized(normalizeMimeType(pattern), mimes);
	}

	public get(mimeType: string): IDataTransferItem | undefined {
		return this._entries.get(this.toKey(mimeType))?.[0];
	}

	/**
	 * Add a new entry to this data transfer.
	 *
	 * This does not replace existing entries for `mimeType`.
	 */
	public append(mimeType: string, value: IDataTransferItem): void {
		const existing = this._entries.get(mimeType);
		if (existing) {
			existing.push(value);
		} else {
			this._entries.set(this.toKey(mimeType), [value]);
		}
	}

	/**
	 * Set the entry for a given mime type.
	 *
	 * This replaces all existing entries for `mimeType`.
	 */
	public replace(mimeType: string, value: IDataTransferItem): void {
		this._entries.set(this.toKey(mimeType), [value]);
	}

	/**
	 * Remove all entries for `mimeType`.
	 */
	public delete(mimeType: string) {
		this._entries.delete(this.toKey(mimeType));
	}

	/**
	 * Iterate over all `[mime, item]` pairs in this data transfer.
	 *
	 * There may be multiple entries for each mime type.
	 */
	public *[Symbol.iterator](): IterableIterator<readonly [string, IDataTransferItem]> {
		for (const [mine, items] of this._entries) {
			for (const item of items) {
				yield [mine, item];
			}
		}
	}

	private toKey(mimeType: string): string {
		return normalizeMimeType(mimeType);
	}
}

function normalizeMimeType(mimeType: string): string {
	return mimeType.toLowerCase();
}

export function matchesMimeType(pattern: string, mimeTypes: readonly string[]): boolean {
	return matchesMimeType_normalized(
		normalizeMimeType(pattern),
		mimeTypes.map(normalizeMimeType));
}

function matchesMimeType_normalized(normalizedPattern: string, normalizedMimeTypes: readonly string[]): boolean {
	// Anything wildcard
	if (normalizedPattern === '*/*') {
		return normalizedMimeTypes.length > 0;
	}

	// Exact match
	if (normalizedMimeTypes.includes(normalizedPattern)) {
		return true;
	}

	// Wildcard, such as `image/*`
	const wildcard = normalizedPattern.match(/^([a-z]+)\/([a-z]+|\*)$/i);
	if (!wildcard) {
		return false;
	}

	const [_, type, subtype] = wildcard;
	if (subtype === '*') {
		return normalizedMimeTypes.some(mime => mime.startsWith(type + '/'));
	}

	return false;
}


export const UriList = Object.freeze({
	// http://amundsen.com/hypermedia/urilist/
	create: (entries: ReadonlyArray<string | URI>): string => {
		return distinct(entries.map(x => x.toString())).join('\r\n');
	},
	split: (str: string): string[] => {
		return str.split('\r\n');
	},
	parse: (str: string): string[] => {
		return UriList.split(str).filter(value => !value.startsWith('#'));
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/date.ts]---
Location: vscode-main/src/vs/base/common/date.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../nls.js';
import { Lazy } from './lazy.js';
import { LANGUAGE_DEFAULT } from './platform.js';

const minute = 60;
const hour = minute * 60;
const day = hour * 24;
const week = day * 7;
const month = day * 30;
const year = day * 365;

/**
 * Create a localized difference of the time between now and the specified date.
 * @param date The date to generate the difference from.
 * @param appendAgoLabel Whether to append the " ago" to the end.
 * @param useFullTimeWords Whether to use full words (eg. seconds) instead of
 * shortened (eg. secs).
 * @param disallowNow Whether to disallow the string "now" when the difference
 * is less than 30 seconds.
 */
export function fromNow(date: number | Date, appendAgoLabel?: boolean, useFullTimeWords?: boolean, disallowNow?: boolean): string {
	if (typeof date !== 'number') {
		date = date.getTime();
	}

	const seconds = Math.round((new Date().getTime() - date) / 1000);
	if (seconds < -30) {
		return localize('date.fromNow.in', 'in {0}', fromNow(new Date().getTime() + seconds * 1000, false));
	}

	if (!disallowNow && seconds < 30) {
		return localize('date.fromNow.now', 'now');
	}

	let value: number;
	if (seconds < minute) {
		value = seconds;

		if (appendAgoLabel) {
			if (value === 1) {
				return useFullTimeWords
					? localize('date.fromNow.seconds.singular.ago.fullWord', '{0} second ago', value)
					: localize('date.fromNow.seconds.singular.ago', '{0} sec ago', value);
			} else {
				return useFullTimeWords
					? localize('date.fromNow.seconds.plural.ago.fullWord', '{0} seconds ago', value)
					: localize('date.fromNow.seconds.plural.ago', '{0} secs ago', value);
			}
		} else {
			if (value === 1) {
				return useFullTimeWords
					? localize('date.fromNow.seconds.singular.fullWord', '{0} second', value)
					: localize('date.fromNow.seconds.singular', '{0} sec', value);
			} else {
				return useFullTimeWords
					? localize('date.fromNow.seconds.plural.fullWord', '{0} seconds', value)
					: localize('date.fromNow.seconds.plural', '{0} secs', value);
			}
		}
	}

	if (seconds < hour) {
		value = Math.floor(seconds / minute);
		if (appendAgoLabel) {
			if (value === 1) {
				return useFullTimeWords
					? localize('date.fromNow.minutes.singular.ago.fullWord', '{0} minute ago', value)
					: localize('date.fromNow.minutes.singular.ago', '{0} min ago', value);
			} else {
				return useFullTimeWords
					? localize('date.fromNow.minutes.plural.ago.fullWord', '{0} minutes ago', value)
					: localize('date.fromNow.minutes.plural.ago', '{0} mins ago', value);
			}
		} else {
			if (value === 1) {
				return useFullTimeWords
					? localize('date.fromNow.minutes.singular.fullWord', '{0} minute', value)
					: localize('date.fromNow.minutes.singular', '{0} min', value);
			} else {
				return useFullTimeWords
					? localize('date.fromNow.minutes.plural.fullWord', '{0} minutes', value)
					: localize('date.fromNow.minutes.plural', '{0} mins', value);
			}
		}
	}

	if (seconds < day) {
		value = Math.floor(seconds / hour);
		if (appendAgoLabel) {
			if (value === 1) {
				return useFullTimeWords
					? localize('date.fromNow.hours.singular.ago.fullWord', '{0} hour ago', value)
					: localize('date.fromNow.hours.singular.ago', '{0} hr ago', value);
			} else {
				return useFullTimeWords
					? localize('date.fromNow.hours.plural.ago.fullWord', '{0} hours ago', value)
					: localize('date.fromNow.hours.plural.ago', '{0} hrs ago', value);
			}
		} else {
			if (value === 1) {
				return useFullTimeWords
					? localize('date.fromNow.hours.singular.fullWord', '{0} hour', value)
					: localize('date.fromNow.hours.singular', '{0} hr', value);
			} else {
				return useFullTimeWords
					? localize('date.fromNow.hours.plural.fullWord', '{0} hours', value)
					: localize('date.fromNow.hours.plural', '{0} hrs', value);
			}
		}
	}

	if (seconds < week) {
		value = Math.floor(seconds / day);
		if (appendAgoLabel) {
			return value === 1
				? localize('date.fromNow.days.singular.ago', '{0} day ago', value)
				: localize('date.fromNow.days.plural.ago', '{0} days ago', value);
		} else {
			return value === 1
				? localize('date.fromNow.days.singular', '{0} day', value)
				: localize('date.fromNow.days.plural', '{0} days', value);
		}
	}

	if (seconds < month) {
		value = Math.floor(seconds / week);
		if (appendAgoLabel) {
			if (value === 1) {
				return useFullTimeWords
					? localize('date.fromNow.weeks.singular.ago.fullWord', '{0} week ago', value)
					: localize('date.fromNow.weeks.singular.ago', '{0} wk ago', value);
			} else {
				return useFullTimeWords
					? localize('date.fromNow.weeks.plural.ago.fullWord', '{0} weeks ago', value)
					: localize('date.fromNow.weeks.plural.ago', '{0} wks ago', value);
			}
		} else {
			if (value === 1) {
				return useFullTimeWords
					? localize('date.fromNow.weeks.singular.fullWord', '{0} week', value)
					: localize('date.fromNow.weeks.singular', '{0} wk', value);
			} else {
				return useFullTimeWords
					? localize('date.fromNow.weeks.plural.fullWord', '{0} weeks', value)
					: localize('date.fromNow.weeks.plural', '{0} wks', value);
			}
		}
	}

	if (seconds < year) {
		value = Math.floor(seconds / month);
		if (appendAgoLabel) {
			if (value === 1) {
				return useFullTimeWords
					? localize('date.fromNow.months.singular.ago.fullWord', '{0} month ago', value)
					: localize('date.fromNow.months.singular.ago', '{0} mo ago', value);
			} else {
				return useFullTimeWords
					? localize('date.fromNow.months.plural.ago.fullWord', '{0} months ago', value)
					: localize('date.fromNow.months.plural.ago', '{0} mos ago', value);
			}
		} else {
			if (value === 1) {
				return useFullTimeWords
					? localize('date.fromNow.months.singular.fullWord', '{0} month', value)
					: localize('date.fromNow.months.singular', '{0} mo', value);
			} else {
				return useFullTimeWords
					? localize('date.fromNow.months.plural.fullWord', '{0} months', value)
					: localize('date.fromNow.months.plural', '{0} mos', value);
			}
		}
	}

	value = Math.floor(seconds / year);
	if (appendAgoLabel) {
		if (value === 1) {
			return useFullTimeWords
				? localize('date.fromNow.years.singular.ago.fullWord', '{0} year ago', value)
				: localize('date.fromNow.years.singular.ago', '{0} yr ago', value);
		} else {
			return useFullTimeWords
				? localize('date.fromNow.years.plural.ago.fullWord', '{0} years ago', value)
				: localize('date.fromNow.years.plural.ago', '{0} yrs ago', value);
		}
	} else {
		if (value === 1) {
			return useFullTimeWords
				? localize('date.fromNow.years.singular.fullWord', '{0} year', value)
				: localize('date.fromNow.years.singular', '{0} yr', value);
		} else {
			return useFullTimeWords
				? localize('date.fromNow.years.plural.fullWord', '{0} years', value)
				: localize('date.fromNow.years.plural', '{0} yrs', value);
		}
	}
}

export function fromNowByDay(date: number | Date, appendAgoLabel?: boolean, useFullTimeWords?: boolean): string {
	if (typeof date !== 'number') {
		date = date.getTime();
	}

	const todayMidnightTime = new Date();
	todayMidnightTime.setHours(0, 0, 0, 0);
	const yesterdayMidnightTime = new Date(todayMidnightTime.getTime());
	yesterdayMidnightTime.setDate(yesterdayMidnightTime.getDate() - 1);

	if (date > todayMidnightTime.getTime()) {
		return localize('today', 'Today');
	}

	if (date > yesterdayMidnightTime.getTime()) {
		return localize('yesterday', 'Yesterday');
	}

	return fromNow(date, appendAgoLabel, useFullTimeWords);
}

/**
 * Gets a readable duration with intelligent/lossy precision. For example "40ms" or "3.040s")
 * @param ms The duration to get in milliseconds.
 * @param useFullTimeWords Whether to use full words (eg. seconds) instead of
 * shortened (eg. secs).
 */
export function getDurationString(ms: number, useFullTimeWords?: boolean) {
	const seconds = Math.abs(ms / 1000);
	if (seconds < 1) {
		return useFullTimeWords
			? localize('duration.ms.full', '{0} milliseconds', ms)
			: localize('duration.ms', '{0}ms', ms);
	}
	if (seconds < minute) {
		return useFullTimeWords
			? localize('duration.s.full', '{0} seconds', Math.round(ms) / 1000)
			: localize('duration.s', '{0}s', Math.round(ms) / 1000);
	}
	if (seconds < hour) {
		return useFullTimeWords
			? localize('duration.m.full', '{0} minutes', Math.round(ms / (1000 * minute)))
			: localize('duration.m', '{0} mins', Math.round(ms / (1000 * minute)));
	}
	if (seconds < day) {
		return useFullTimeWords
			? localize('duration.h.full', '{0} hours', Math.round(ms / (1000 * hour)))
			: localize('duration.h', '{0} hrs', Math.round(ms / (1000 * hour)));
	}
	return localize('duration.d', '{0} days', Math.round(ms / (1000 * day)));
}

export function toLocalISOString(date: Date): string {
	return date.getFullYear() +
		'-' + String(date.getMonth() + 1).padStart(2, '0') +
		'-' + String(date.getDate()).padStart(2, '0') +
		'T' + String(date.getHours()).padStart(2, '0') +
		':' + String(date.getMinutes()).padStart(2, '0') +
		':' + String(date.getSeconds()).padStart(2, '0') +
		'.' + (date.getMilliseconds() / 1000).toFixed(3).slice(2, 5) +
		'Z';
}

export const safeIntl = {
	DateTimeFormat(locales?: Intl.LocalesArgument, options?: Intl.DateTimeFormatOptions): Lazy<Intl.DateTimeFormat> {
		return new Lazy(() => {
			try {
				return new Intl.DateTimeFormat(locales, options);
			} catch {
				return new Intl.DateTimeFormat(undefined, options);
			}
		});
	},
	Collator(locales?: Intl.LocalesArgument, options?: Intl.CollatorOptions): Lazy<Intl.Collator> {
		return new Lazy(() => {
			try {
				return new Intl.Collator(locales, options);
			} catch {
				return new Intl.Collator(undefined, options);
			}
		});
	},
	Segmenter(locales?: Intl.LocalesArgument, options?: Intl.SegmenterOptions): Lazy<Intl.Segmenter> {
		return new Lazy(() => {
			try {
				return new Intl.Segmenter(locales, options);
			} catch {
				return new Intl.Segmenter(undefined, options);
			}
		});
	},
	Locale(tag: Intl.Locale | string, options?: Intl.LocaleOptions): Lazy<Intl.Locale> {
		return new Lazy(() => {
			try {
				return new Intl.Locale(tag, options);
			} catch {
				return new Intl.Locale(LANGUAGE_DEFAULT, options);
			}
		});
	},
	NumberFormat(locales?: Intl.LocalesArgument, options?: Intl.NumberFormatOptions): Lazy<Intl.NumberFormat> {
		return new Lazy(() => {
			try {
				return new Intl.NumberFormat(locales, options);
			} catch {
				return new Intl.NumberFormat(undefined, options);
			}
		});
	}
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/decorators.ts]---
Location: vscode-main/src/vs/base/common/decorators.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

function createDecorator(mapFn: (fn: Function, key: string) => Function): MethodDecorator {
	return (_target: Object, key: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
		let fnKey: 'value' | 'get' | null = null;
		let fn: Function | null = null;

		if (typeof descriptor.value === 'function') {
			fnKey = 'value';
			fn = descriptor.value;
		} else if (typeof descriptor.get === 'function') {
			fnKey = 'get';
			fn = descriptor.get;
		}

		if (!fn || typeof key === 'symbol') {
			throw new Error('not supported');
		}

		descriptor[fnKey!] = mapFn(fn, key);
	};
}

export function memoize(_target: Object, key: string, descriptor: PropertyDescriptor) {
	let fnKey: 'value' | 'get' | null = null;
	let fn: Function | null = null;

	if (typeof descriptor.value === 'function') {
		fnKey = 'value';
		fn = descriptor.value;

		if (fn!.length !== 0) {
			console.warn('Memoize should only be used in functions with zero parameters');
		}
	} else if (typeof descriptor.get === 'function') {
		fnKey = 'get';
		fn = descriptor.get;
	}

	if (!fn) {
		throw new Error('not supported');
	}

	const memoizeKey = `$memoize$${key}`;
	descriptor[fnKey!] = function (...args: any[]) {
		if (!this.hasOwnProperty(memoizeKey)) {
			Object.defineProperty(this, memoizeKey, {
				configurable: false,
				enumerable: false,
				writable: false,
				value: fn.apply(this, args)
			});
		}
		// eslint-disable-next-line local/code-no-any-casts
		return (this as any)[memoizeKey];
	};
}

export interface IDebounceReducer<T> {
	(previousValue: T, ...args: any[]): T;
}

export function debounce<T>(delay: number, reducer?: IDebounceReducer<T>, initialValueProvider?: () => T) {
	return createDecorator((fn, key) => {
		const timerKey = `$debounce$${key}`;
		const resultKey = `$debounce$result$${key}`;

		return function (this: any, ...args: any[]) {
			if (!this[resultKey]) {
				this[resultKey] = initialValueProvider ? initialValueProvider() : undefined;
			}

			clearTimeout(this[timerKey]);

			if (reducer) {
				this[resultKey] = reducer(this[resultKey], ...args);
				args = [this[resultKey]];
			}

			this[timerKey] = setTimeout(() => {
				fn.apply(this, args);
				this[resultKey] = initialValueProvider ? initialValueProvider() : undefined;
			}, delay);
		};
	});
}

export function throttle<T>(delay: number, reducer?: IDebounceReducer<T>, initialValueProvider?: () => T) {
	return createDecorator((fn, key) => {
		const timerKey = `$throttle$timer$${key}`;
		const resultKey = `$throttle$result$${key}`;
		const lastRunKey = `$throttle$lastRun$${key}`;
		const pendingKey = `$throttle$pending$${key}`;

		return function (this: any, ...args: any[]) {
			if (!this[resultKey]) {
				this[resultKey] = initialValueProvider ? initialValueProvider() : undefined;
			}
			if (this[lastRunKey] === null || this[lastRunKey] === undefined) {
				this[lastRunKey] = -Number.MAX_VALUE;
			}

			if (reducer) {
				this[resultKey] = reducer(this[resultKey], ...args);
			}

			if (this[pendingKey]) {
				return;
			}

			const nextTime = this[lastRunKey] + delay;
			if (nextTime <= Date.now()) {
				this[lastRunKey] = Date.now();
				fn.apply(this, [this[resultKey]]);
				this[resultKey] = initialValueProvider ? initialValueProvider() : undefined;
			} else {
				this[pendingKey] = true;
				this[timerKey] = setTimeout(() => {
					this[pendingKey] = false;
					this[lastRunKey] = Date.now();
					fn.apply(this, [this[resultKey]]);
					this[resultKey] = initialValueProvider ? initialValueProvider() : undefined;
				}, nextTime - Date.now());
			}
		};
	});
}

export { cancelPreviousCalls } from './decorators/cancelPreviousCalls.js';
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/defaultAccount.ts]---
Location: vscode-main/src/vs/base/common/defaultAccount.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export interface IDefaultAccount {
	readonly sessionId: string;
	readonly enterprise: boolean;
	readonly access_type_sku?: string;
	readonly copilot_plan?: string;
	readonly assigned_date?: string;
	readonly can_signup_for_limited?: boolean;
	readonly chat_enabled?: boolean;
	readonly chat_preview_features_enabled?: boolean;
	readonly mcp?: boolean;
	readonly mcpRegistryUrl?: string;
	readonly mcpAccess?: 'allow_all' | 'registry_only';
	readonly analytics_tracking_id?: string;
	readonly limited_user_quotas?: {
		readonly chat: number;
		readonly completions: number;
	};
	readonly monthly_quotas?: {
		readonly chat: number;
		readonly completions: number;
	};
	readonly limited_user_reset_date?: string;
	readonly chat_agent_enabled?: boolean;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/desktopEnvironmentInfo.ts]---
Location: vscode-main/src/vs/base/common/desktopEnvironmentInfo.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { env } from './process.js';

// Define the enumeration for Desktop Environments
enum DesktopEnvironment {
	UNKNOWN = 'UNKNOWN',
	CINNAMON = 'CINNAMON',
	DEEPIN = 'DEEPIN',
	GNOME = 'GNOME',
	KDE3 = 'KDE3',
	KDE4 = 'KDE4',
	KDE5 = 'KDE5',
	KDE6 = 'KDE6',
	PANTHEON = 'PANTHEON',
	UNITY = 'UNITY',
	XFCE = 'XFCE',
	UKUI = 'UKUI',
	LXQT = 'LXQT',
}

const kXdgCurrentDesktopEnvVar = 'XDG_CURRENT_DESKTOP';
const kKDESessionEnvVar = 'KDE_SESSION_VERSION';

export function getDesktopEnvironment(): DesktopEnvironment {
	const xdgCurrentDesktop = env[kXdgCurrentDesktopEnvVar];
	if (xdgCurrentDesktop) {
		const values = xdgCurrentDesktop.split(':').map(value => value.trim()).filter(value => value.length > 0);
		for (const value of values) {
			switch (value) {
				case 'Unity': {
					const desktopSessionUnity = env['DESKTOP_SESSION'];
					if (desktopSessionUnity && desktopSessionUnity.includes('gnome-fallback')) {
						return DesktopEnvironment.GNOME;
					}

					return DesktopEnvironment.UNITY;
				}
				case 'Deepin':
					return DesktopEnvironment.DEEPIN;
				case 'GNOME':
					return DesktopEnvironment.GNOME;
				case 'X-Cinnamon':
					return DesktopEnvironment.CINNAMON;
				case 'KDE': {
					const kdeSession = env[kKDESessionEnvVar];
					if (kdeSession === '5') { return DesktopEnvironment.KDE5; }
					if (kdeSession === '6') { return DesktopEnvironment.KDE6; }
					return DesktopEnvironment.KDE4;
				}
				case 'Pantheon':
					return DesktopEnvironment.PANTHEON;
				case 'XFCE':
					return DesktopEnvironment.XFCE;
				case 'UKUI':
					return DesktopEnvironment.UKUI;
				case 'LXQt':
					return DesktopEnvironment.LXQT;
			}
		}
	}

	const desktopSession = env['DESKTOP_SESSION'];
	if (desktopSession) {
		switch (desktopSession) {
			case 'deepin':
				return DesktopEnvironment.DEEPIN;
			case 'gnome':
			case 'mate':
				return DesktopEnvironment.GNOME;
			case 'kde4':
			case 'kde-plasma':
				return DesktopEnvironment.KDE4;
			case 'kde':
				if (kKDESessionEnvVar in env) {
					return DesktopEnvironment.KDE4;
				}
				return DesktopEnvironment.KDE3;
			case 'xfce':
			case 'xubuntu':
				return DesktopEnvironment.XFCE;
			case 'ukui':
				return DesktopEnvironment.UKUI;
		}
	}

	if ('GNOME_DESKTOP_SESSION_ID' in env) {
		return DesktopEnvironment.GNOME;
	}
	if ('KDE_FULL_SESSION' in env) {
		if (kKDESessionEnvVar in env) {
			return DesktopEnvironment.KDE4;
		}
		return DesktopEnvironment.KDE3;
	}

	return DesktopEnvironment.UNKNOWN;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/envfile.ts]---
Location: vscode-main/src/vs/base/common/envfile.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Parses a standard .env/.envrc file into a map of the environment variables
 * it defines.
 *
 * todo@connor4312: this can go away (if only used in Node.js targets) and be
 * replaced with `util.parseEnv`. However, currently calling that makes the
 * extension host crash.
 */
export function parseEnvFile(src: string) {
	const result = new Map<string, string>();

	// Normalize line breaks
	const normalizedSrc = src.replace(/\r\n?/g, '\n');
	const lines = normalizedSrc.split('\n');

	for (let line of lines) {
		// Skip empty lines and comments
		line = line.trim();
		if (!line || line.startsWith('#')) {
			continue;
		}

		// Parse the line into key and value
		const [key, value] = parseLine(line);
		if (key) {
			result.set(key, value);
		}
	}

	return result;

	function parseLine(line: string): [string, string] | [null, null] {
		// Handle export prefix
		if (line.startsWith('export ')) {
			line = line.substring(7).trim();
		}

		// Find the key-value separator
		const separatorIndex = findIndexOutsideQuotes(line, c => c === '=' || c === ':');
		if (separatorIndex === -1) {
			return [null, null];
		}

		const key = line.substring(0, separatorIndex).trim();
		let value = line.substring(separatorIndex + 1).trim();

		// Handle comments and remove them
		const commentIndex = findIndexOutsideQuotes(value, c => c === '#');
		if (commentIndex !== -1) {
			value = value.substring(0, commentIndex).trim();
		}

		// Process quoted values
		if (value.length >= 2) {
			const firstChar = value[0];
			const lastChar = value[value.length - 1];

			if ((firstChar === '"' && lastChar === '"') ||
				(firstChar === '\'' && lastChar === '\'') ||
				(firstChar === '`' && lastChar === '`')) {
				// Remove surrounding quotes
				value = value.substring(1, value.length - 1);

				// Handle escaped characters in double quotes
				if (firstChar === '"') {
					value = value.replace(/\\n/g, '\n').replace(/\\r/g, '\r');
				}
			}
		}

		return [key, value];
	}

	function findIndexOutsideQuotes(text: string, predicate: (char: string) => boolean): number {
		let inQuote = false;
		let quoteChar = '';

		for (let i = 0; i < text.length; i++) {
			const char = text[i];

			if (inQuote) {
				if (char === quoteChar && text[i - 1] !== '\\') {
					inQuote = false;
				}
			} else if (char === '"' || char === '\'' || char === '`') {
				inQuote = true;
				quoteChar = char;
			} else if (predicate(char)) {
				return i;
			}
		}

		return -1;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/equals.ts]---
Location: vscode-main/src/vs/base/common/equals.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as arrays from './arrays.js';

/*
 * Each function in this file which offers an equality comparison, has an accompanying
 * `*C` variant which returns an EqualityComparer function.
 *
 * The `*C` variant allows for easier composition of equality comparers and improved type-inference.
*/


/** Represents a function that decides if two values are equal. */
export type EqualityComparer<T> = (a: T, b: T) => boolean;

export interface IEquatable<T> {
	equals(other: T): boolean;
}

/**
 * Compares two items for equality using strict equality.
*/
export function strictEquals<T>(a: T, b: T): boolean {
	return a === b;
}

export function strictEqualsC<T>(): EqualityComparer<T> {
	return (a, b) => a === b;
}

/**
 * Checks if the items of two arrays are equal.
 * By default, strict equality is used to compare elements, but a custom equality comparer can be provided.
 */
export function arrayEquals<T>(a: readonly T[], b: readonly T[], itemEquals?: EqualityComparer<T>): boolean {
	return arrays.equals(a, b, itemEquals ?? strictEquals);
}

/**
 * Checks if the items of two arrays are equal.
 * By default, strict equality is used to compare elements, but a custom equality comparer can be provided.
 */
export function arrayEqualsC<T>(itemEquals?: EqualityComparer<T>): EqualityComparer<readonly T[]> {
	return (a, b) => arrays.equals(a, b, itemEquals ?? strictEquals);
}

/**
 * Drills into arrays (items ordered) and objects (keys unordered) and uses strict equality on everything else.
*/
export function structuralEquals<T>(a: T, b: T): boolean {
	if (a === b) {
		return true;
	}

	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) {
			return false;
		}
		for (let i = 0; i < a.length; i++) {
			if (!structuralEquals(a[i], b[i])) {
				return false;
			}
		}
		return true;
	}

	if (a && typeof a === 'object' && b && typeof b === 'object') {
		if (Object.getPrototypeOf(a) === Object.prototype && Object.getPrototypeOf(b) === Object.prototype) {
			const aObj = a as Record<string, unknown>;
			const bObj = b as Record<string, unknown>;
			const keysA = Object.keys(aObj);
			const keysB = Object.keys(bObj);
			const keysBSet = new Set(keysB);

			if (keysA.length !== keysB.length) {
				return false;
			}

			for (const key of keysA) {
				if (!keysBSet.has(key)) {
					return false;
				}
				if (!structuralEquals(aObj[key], bObj[key])) {
					return false;
				}
			}

			return true;
		}
	}

	return false;
}

export function structuralEqualsC<T>(): EqualityComparer<T> {
	return (a, b) => structuralEquals(a, b);
}

/**
 * `getStructuralKey(a) === getStructuralKey(b) <=> structuralEquals(a, b)`
 * (assuming that a and b are not cyclic structures and nothing extends globalThis Array).
*/
export function getStructuralKey(t: unknown): string {
	return JSON.stringify(toNormalizedJsonStructure(t));
}

let objectId = 0;
const objIds = new WeakMap<object, number>();

function toNormalizedJsonStructure(t: unknown): unknown {
	if (Array.isArray(t)) {
		return t.map(toNormalizedJsonStructure);
	}

	if (t && typeof t === 'object') {
		if (Object.getPrototypeOf(t) === Object.prototype) {
			const tObj = t as Record<string, unknown>;
			const res: Record<string, unknown> = Object.create(null);
			for (const key of Object.keys(tObj).sort()) {
				res[key] = toNormalizedJsonStructure(tObj[key]);
			}
			return res;
		} else {
			let objId = objIds.get(t);
			if (objId === undefined) {
				objId = objectId++;
				objIds.set(t, objId);
			}
			// Random string to prevent collisions
			return objId + '----2b76a038c20c4bcc';
		}
	}
	return t;
}


/**
 * Two items are considered equal, if their stringified representations are equal.
*/
export function jsonStringifyEquals<T>(a: T, b: T): boolean {
	return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * Two items are considered equal, if their stringified representations are equal.
*/
export function jsonStringifyEqualsC<T>(): EqualityComparer<T> {
	return (a, b) => JSON.stringify(a) === JSON.stringify(b);
}

/**
 * Uses `item.equals(other)` to determine equality.
 */
export function thisEqualsC<T extends IEquatable<T>>(): EqualityComparer<T> {
	return (a, b) => a.equals(b);
}

/**
 * Checks if two items are both null or undefined, or are equal according to the provided equality comparer.
*/
export function equalsIfDefined<T>(v1: T | undefined | null, v2: T | undefined | null, equals: EqualityComparer<T>): boolean {
	if (v1 === undefined || v1 === null || v2 === undefined || v2 === null) {
		return v2 === v1;
	}
	return equals(v1, v2);
}

/**
 * Returns an equality comparer that checks if two items are both null or undefined, or are equal according to the provided equality comparer.
*/
export function equalsIfDefinedC<T>(equals: EqualityComparer<T>): EqualityComparer<T | undefined | null> {
	return (v1, v2) => {
		if (v1 === undefined || v1 === null || v2 === undefined || v2 === null) {
			return v2 === v1;
		}
		return equals(v1, v2);
	};
}

/**
 * Each function in this file which offers an equality comparison, has an accompanying
 * `*C` variant which returns an EqualityComparer function.
 *
 * The `*C` variant allows for easier composition of equality comparers and improved type-inference.
*/
export namespace equals {
	export const strict = strictEquals;
	export const strictC = strictEqualsC;

	export const array = arrayEquals;
	export const arrayC = arrayEqualsC;

	export const structural = structuralEquals;
	export const structuralC = structuralEqualsC;

	export const jsonStringify = jsonStringifyEquals;
	export const jsonStringifyC = jsonStringifyEqualsC;

	export const thisC = thisEqualsC;

	export const ifDefined = equalsIfDefined;
	export const ifDefinedC = equalsIfDefinedC;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/errorMessage.ts]---
Location: vscode-main/src/vs/base/common/errorMessage.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as arrays from './arrays.js';
import * as types from './types.js';
import * as nls from '../../nls.js';
import { IAction } from './actions.js';

function exceptionToErrorMessage(exception: any, verbose: boolean): string {
	if (verbose && (exception.stack || exception.stacktrace)) {
		return nls.localize('stackTrace.format', "{0}: {1}", detectSystemErrorMessage(exception), stackToString(exception.stack) || stackToString(exception.stacktrace));
	}

	return detectSystemErrorMessage(exception);
}

function stackToString(stack: string[] | string | undefined): string | undefined {
	if (Array.isArray(stack)) {
		return stack.join('\n');
	}

	return stack;
}

function detectSystemErrorMessage(exception: any): string {

	// Custom node.js error from us
	if (exception.code === 'ERR_UNC_HOST_NOT_ALLOWED') {
		return `${exception.message}. Please update the 'security.allowedUNCHosts' setting if you want to allow this host.`;
	}

	// See https://nodejs.org/api/errors.html#errors_class_system_error
	if (typeof exception.code === 'string' && typeof exception.errno === 'number' && typeof exception.syscall === 'string') {
		return nls.localize('nodeExceptionMessage', "A system error occurred ({0})", exception.message);
	}

	return exception.message || nls.localize('error.defaultMessage', "An unknown error occurred. Please consult the log for more details.");
}

/**
 * Tries to generate a human readable error message out of the error. If the verbose parameter
 * is set to true, the error message will include stacktrace details if provided.
 *
 * @returns A string containing the error message.
 */
export function toErrorMessage(error: any = null, verbose: boolean = false): string {
	if (!error) {
		return nls.localize('error.defaultMessage', "An unknown error occurred. Please consult the log for more details.");
	}

	if (Array.isArray(error)) {
		const errors: any[] = arrays.coalesce(error);
		const msg = toErrorMessage(errors[0], verbose);

		if (errors.length > 1) {
			return nls.localize('error.moreErrors', "{0} ({1} errors in total)", msg, errors.length);
		}

		return msg;
	}

	if (types.isString(error)) {
		return error;
	}

	if (error.detail) {
		const detail = error.detail;

		if (detail.error) {
			return exceptionToErrorMessage(detail.error, verbose);
		}

		if (detail.exception) {
			return exceptionToErrorMessage(detail.exception, verbose);
		}
	}

	if (error.stack) {
		return exceptionToErrorMessage(error, verbose);
	}

	if (error.message) {
		return error.message;
	}

	return nls.localize('error.defaultMessage', "An unknown error occurred. Please consult the log for more details.");
}


export interface IErrorWithActions extends Error {
	actions: IAction[];
}

export function isErrorWithActions(obj: unknown): obj is IErrorWithActions {
	const candidate = obj as IErrorWithActions | undefined;

	return candidate instanceof Error && Array.isArray(candidate.actions);
}

export function createErrorWithActions(messageOrError: string | Error, actions: IAction[]): IErrorWithActions {
	let error: IErrorWithActions;
	if (typeof messageOrError === 'string') {
		error = new Error(messageOrError) as IErrorWithActions;
	} else {
		error = messageOrError as IErrorWithActions;
	}

	error.actions = actions;

	return error;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/errors.ts]---
Location: vscode-main/src/vs/base/common/errors.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export interface ErrorListenerCallback {
	(error: any): void;
}

export interface ErrorListenerUnbind {
	(): void;
}

// Avoid circular dependency on EventEmitter by implementing a subset of the interface.
export class ErrorHandler {
	private unexpectedErrorHandler: (e: any) => void;
	private listeners: ErrorListenerCallback[];

	constructor() {

		this.listeners = [];

		this.unexpectedErrorHandler = function (e: any) {
			setTimeout(() => {
				if (e.stack) {
					if (ErrorNoTelemetry.isErrorNoTelemetry(e)) {
						throw new ErrorNoTelemetry(e.message + '\n\n' + e.stack);
					}

					throw new Error(e.message + '\n\n' + e.stack);
				}

				throw e;
			}, 0);
		};
	}

	addListener(listener: ErrorListenerCallback): ErrorListenerUnbind {
		this.listeners.push(listener);

		return () => {
			this._removeListener(listener);
		};
	}

	private emit(e: any): void {
		this.listeners.forEach((listener) => {
			listener(e);
		});
	}

	private _removeListener(listener: ErrorListenerCallback): void {
		this.listeners.splice(this.listeners.indexOf(listener), 1);
	}

	setUnexpectedErrorHandler(newUnexpectedErrorHandler: (e: any) => void): void {
		this.unexpectedErrorHandler = newUnexpectedErrorHandler;
	}

	getUnexpectedErrorHandler(): (e: any) => void {
		return this.unexpectedErrorHandler;
	}

	onUnexpectedError(e: any): void {
		this.unexpectedErrorHandler(e);
		this.emit(e);
	}

	// For external errors, we don't want the listeners to be called
	onUnexpectedExternalError(e: any): void {
		this.unexpectedErrorHandler(e);
	}
}

export const errorHandler = new ErrorHandler();

/** @skipMangle */
export function setUnexpectedErrorHandler(newUnexpectedErrorHandler: (e: any) => void): void {
	errorHandler.setUnexpectedErrorHandler(newUnexpectedErrorHandler);
}

/**
 * Returns if the error is a SIGPIPE error. SIGPIPE errors should generally be
 * logged at most once, to avoid a loop.
 *
 * @see https://github.com/microsoft/vscode-remote-release/issues/6481
 */
export function isSigPipeError(e: unknown): e is Error {
	if (!e || typeof e !== 'object') {
		return false;
	}

	const cast = e as Record<string, string | undefined>;
	return cast.code === 'EPIPE' && cast.syscall?.toUpperCase() === 'WRITE';
}

/**
 * This function should only be called with errors that indicate a bug in the product.
 * E.g. buggy extensions/invalid user-input/network issues should not be able to trigger this code path.
 * If they are, this indicates there is also a bug in the product.
*/
export function onBugIndicatingError(e: any): undefined {
	errorHandler.onUnexpectedError(e);
	return undefined;
}

export function onUnexpectedError(e: any): undefined {
	// ignore errors from cancelled promises
	if (!isCancellationError(e)) {
		errorHandler.onUnexpectedError(e);
	}
	return undefined;
}

export function onUnexpectedExternalError(e: any): undefined {
	// ignore errors from cancelled promises
	if (!isCancellationError(e)) {
		errorHandler.onUnexpectedExternalError(e);
	}
	return undefined;
}

export interface SerializedError {
	readonly $isError: true;
	readonly name: string;
	readonly message: string;
	readonly stack: string;
	readonly noTelemetry: boolean;
	readonly code?: string;
	readonly cause?: SerializedError;
}

type ErrorWithCode = Error & {
	code: string | undefined;
};

export function transformErrorForSerialization(error: Error): SerializedError;
export function transformErrorForSerialization(error: any): any;
export function transformErrorForSerialization(error: any): any {
	if (error instanceof Error) {
		const { name, message, cause } = error;
		// eslint-disable-next-line local/code-no-any-casts
		const stack: string = (<any>error).stacktrace || (<any>error).stack;
		return {
			$isError: true,
			name,
			message,
			stack,
			noTelemetry: ErrorNoTelemetry.isErrorNoTelemetry(error),
			cause: cause ? transformErrorForSerialization(cause) : undefined,
			code: (<ErrorWithCode>error).code
		};
	}

	// return as is
	return error;
}

export function transformErrorFromSerialization(data: SerializedError): Error {
	let error: Error;
	if (data.noTelemetry) {
		error = new ErrorNoTelemetry();
	} else {
		error = new Error();
		error.name = data.name;
	}
	error.message = data.message;
	error.stack = data.stack;
	if (data.code) {
		(<ErrorWithCode>error).code = data.code;
	}
	if (data.cause) {
		error.cause = transformErrorFromSerialization(data.cause);
	}
	return error;
}

// see https://github.com/v8/v8/wiki/Stack%20Trace%20API#basic-stack-traces
export interface V8CallSite {
	getThis(): unknown;
	getTypeName(): string | null;
	getFunction(): Function | undefined;
	getFunctionName(): string | null;
	getMethodName(): string | null;
	getFileName(): string | null;
	getLineNumber(): number | null;
	getColumnNumber(): number | null;
	getEvalOrigin(): string | undefined;
	isToplevel(): boolean;
	isEval(): boolean;
	isNative(): boolean;
	isConstructor(): boolean;
	toString(): string;
}

export const canceledName = 'Canceled';

/**
 * Checks if the given error is a promise in canceled state
 */
export function isCancellationError(error: any): boolean {
	if (error instanceof CancellationError) {
		return true;
	}
	return error instanceof Error && error.name === canceledName && error.message === canceledName;
}

// !!!IMPORTANT!!!
// Do NOT change this class because it is also used as an API-type.
export class CancellationError extends Error {
	constructor() {
		super(canceledName);
		this.name = this.message;
	}
}

export class PendingMigrationError extends Error {

	private static readonly _name = 'PendingMigrationError';

	static is(error: unknown): error is PendingMigrationError {
		return error instanceof PendingMigrationError || (error instanceof Error && error.name === PendingMigrationError._name);
	}

	constructor(message: string) {
		super(message);
		this.name = PendingMigrationError._name;
	}
}

/**
 * @deprecated use {@link CancellationError `new CancellationError()`} instead
 */
export function canceled(): Error {
	const error = new Error(canceledName);
	error.name = error.message;
	return error;
}

export function illegalArgument(name?: string): Error {
	if (name) {
		return new Error(`Illegal argument: ${name}`);
	} else {
		return new Error('Illegal argument');
	}
}

export function illegalState(name?: string): Error {
	if (name) {
		return new Error(`Illegal state: ${name}`);
	} else {
		return new Error('Illegal state');
	}
}

export class ReadonlyError extends TypeError {
	constructor(name?: string) {
		super(name ? `${name} is read-only and cannot be changed` : 'Cannot change read-only property');
	}
}

export function getErrorMessage(err: any): string {
	if (!err) {
		return 'Error';
	}

	if (err.message) {
		return err.message;
	}

	if (err.stack) {
		return err.stack.split('\n')[0];
	}

	return String(err);
}

export class NotImplementedError extends Error {
	constructor(message?: string) {
		super('NotImplemented');
		if (message) {
			this.message = message;
		}
	}
}

export class NotSupportedError extends Error {
	constructor(message?: string) {
		super('NotSupported');
		if (message) {
			this.message = message;
		}
	}
}

export class ExpectedError extends Error {
	readonly isExpected = true;
}

/**
 * Error that when thrown won't be logged in telemetry as an unhandled error.
 */
export class ErrorNoTelemetry extends Error {
	override readonly name: string;

	constructor(msg?: string) {
		super(msg);
		this.name = 'CodeExpectedError';
	}

	public static fromError(err: Error): ErrorNoTelemetry {
		if (err instanceof ErrorNoTelemetry) {
			return err;
		}

		const result = new ErrorNoTelemetry();
		result.message = err.message;
		result.stack = err.stack;
		return result;
	}

	public static isErrorNoTelemetry(err: Error): err is ErrorNoTelemetry {
		return err.name === 'CodeExpectedError';
	}
}

/**
 * This error indicates a bug.
 * Do not throw this for invalid user input.
 * Only catch this error to recover gracefully from bugs.
 */
export class BugIndicatingError extends Error {
	constructor(message?: string) {
		super(message || 'An unexpected bug occurred.');
		Object.setPrototypeOf(this, BugIndicatingError.prototype);

		// Because we know for sure only buggy code throws this,
		// we definitely want to break here and fix the bug.
		// debugger;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/event.ts]---
Location: vscode-main/src/vs/base/common/event.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancelablePromise } from './async.js';
import { CancellationToken } from './cancellation.js';
import { diffSets } from './collections.js';
import { onUnexpectedError } from './errors.js';
import { createSingleCallFunction } from './functional.js';
import { combinedDisposable, Disposable, DisposableMap, DisposableStore, IDisposable, toDisposable } from './lifecycle.js';
import { LinkedList } from './linkedList.js';
import { IObservable, IObservableWithChange, IObserver } from './observable.js';
import { StopWatch } from './stopwatch.js';
import { MicrotaskDelay } from './symbols.js';


// -----------------------------------------------------------------------------------------------------------------------
// Uncomment the next line to print warnings whenever an emitter with listeners is disposed. That is a sign of code smell.
// -----------------------------------------------------------------------------------------------------------------------
const _enableDisposeWithListenerWarning = false
	// || Boolean("TRUE") // causes a linter warning so that it cannot be pushed
	;


// -----------------------------------------------------------------------------------------------------------------------
// Uncomment the next line to print warnings whenever a snapshotted event is used repeatedly without cleanup.
// See https://github.com/microsoft/vscode/issues/142851
// -----------------------------------------------------------------------------------------------------------------------
const _enableSnapshotPotentialLeakWarning = false
	// || Boolean("TRUE") // causes a linter warning so that it cannot be pushed
	;

/**
 * An event with zero or one parameters that can be subscribed to. The event is a function itself.
 */
export interface Event<T> {
	(listener: (e: T) => unknown, thisArgs?: any, disposables?: IDisposable[] | DisposableStore): IDisposable;
}

export namespace Event {
	export const None: Event<any> = () => Disposable.None;

	function _addLeakageTraceLogic(options: EmitterOptions) {
		if (_enableSnapshotPotentialLeakWarning) {
			const { onDidAddListener: origListenerDidAdd } = options;
			const stack = Stacktrace.create();
			let count = 0;
			options.onDidAddListener = () => {
				if (++count === 2) {
					console.warn('snapshotted emitter LIKELY used public and SHOULD HAVE BEEN created with DisposableStore. snapshotted here');
					stack.print();
				}
				origListenerDidAdd?.();
			};
		}
	}

	/**
	 * Given an event, returns another event which debounces calls and defers the listeners to a later task via a shared
	 * `setTimeout`. The event is converted into a signal (`Event<void>`) to avoid additional object creation as a
	 * result of merging events and to try prevent race conditions that could arise when using related deferred and
	 * non-deferred events.
	 *
	 * This is useful for deferring non-critical work (eg. general UI updates) to ensure it does not block critical work
	 * (eg. latency of keypress to text rendered).
	 *
	 * *NOTE* that this function returns an `Event` and it MUST be called with a `DisposableStore` whenever the returned
	 * event is accessible to "third parties", e.g the event is a public property. Otherwise a leaked listener on the
	 * returned event causes this utility to leak a listener on the original event.
	 *
	 * @param event The event source for the new event.
	 * @param flushOnListenerRemove Whether to fire all debounced events when a listener is removed. If this is not
	 * specified, some events could go missing. Use this if it's important that all events are processed, even if the
	 * listener gets disposed before the debounced event fires.
	 * @param disposable A disposable store to add the new EventEmitter to.
	 */
	export function defer(event: Event<unknown>, flushOnListenerRemove?: boolean, disposable?: DisposableStore): Event<void> {
		return debounce<unknown, void>(event, () => void 0, 0, undefined, flushOnListenerRemove ?? true, undefined, disposable);
	}

	/**
	 * Given an event, returns another event which only fires once.
	 *
	 * @param event The event source for the new event.
	 */
	export function once<T>(event: Event<T>): Event<T> {
		return (listener, thisArgs = null, disposables?) => {
			// we need this, in case the event fires during the listener call
			let didFire = false;
			let result: IDisposable | undefined = undefined;
			result = event(e => {
				if (didFire) {
					return;
				} else if (result) {
					result.dispose();
				} else {
					didFire = true;
				}

				return listener.call(thisArgs, e);
			}, null, disposables);

			if (didFire) {
				result.dispose();
			}

			return result;
		};
	}

	/**
	 * Given an event, returns another event which only fires once, and only when the condition is met.
	 *
	 * @param event The event source for the new event.
	 */
	export function onceIf<T>(event: Event<T>, condition: (e: T) => boolean): Event<T> {
		return Event.once(Event.filter(event, condition));
	}

	/**
	 * Maps an event of one type into an event of another type using a mapping function, similar to how
	 * `Array.prototype.map` works.
	 *
	 * *NOTE* that this function returns an `Event` and it MUST be called with a `DisposableStore` whenever the returned
	 * event is accessible to "third parties", e.g the event is a public property. Otherwise a leaked listener on the
	 * returned event causes this utility to leak a listener on the original event.
	 *
	 * @param event The event source for the new event.
	 * @param map The mapping function.
	 * @param disposable A disposable store to add the new EventEmitter to.
	 */
	export function map<I, O>(event: Event<I>, map: (i: I) => O, disposable?: DisposableStore): Event<O> {
		return snapshot((listener, thisArgs = null, disposables?) => event(i => listener.call(thisArgs, map(i)), null, disposables), disposable);
	}

	/**
	 * Wraps an event in another event that performs some function on the event object before firing.
	 *
	 * *NOTE* that this function returns an `Event` and it MUST be called with a `DisposableStore` whenever the returned
	 * event is accessible to "third parties", e.g the event is a public property. Otherwise a leaked listener on the
	 * returned event causes this utility to leak a listener on the original event.
	 *
	 * @param event The event source for the new event.
	 * @param each The function to perform on the event object.
	 * @param disposable A disposable store to add the new EventEmitter to.
	 */
	export function forEach<I>(event: Event<I>, each: (i: I) => void, disposable?: DisposableStore): Event<I> {
		return snapshot((listener, thisArgs = null, disposables?) => event(i => { each(i); listener.call(thisArgs, i); }, null, disposables), disposable);
	}

	/**
	 * Wraps an event in another event that fires only when some condition is met.
	 *
	 * *NOTE* that this function returns an `Event` and it MUST be called with a `DisposableStore` whenever the returned
	 * event is accessible to "third parties", e.g the event is a public property. Otherwise a leaked listener on the
	 * returned event causes this utility to leak a listener on the original event.
	 *
	 * @param event The event source for the new event.
	 * @param filter The filter function that defines the condition. The event will fire for the object if this function
	 * returns true.
	 * @param disposable A disposable store to add the new EventEmitter to.
	 */
	export function filter<T, U>(event: Event<T | U>, filter: (e: T | U) => e is T, disposable?: DisposableStore): Event<T>;
	export function filter<T>(event: Event<T>, filter: (e: T) => boolean, disposable?: DisposableStore): Event<T>;
	export function filter<T, R>(event: Event<T | R>, filter: (e: T | R) => e is R, disposable?: DisposableStore): Event<R>;
	export function filter<T>(event: Event<T>, filter: (e: T) => boolean, disposable?: DisposableStore): Event<T> {
		return snapshot((listener, thisArgs = null, disposables?) => event(e => filter(e) && listener.call(thisArgs, e), null, disposables), disposable);
	}

	/**
	 * Given an event, returns the same event but typed as `Event<void>`.
	 */
	export function signal<T>(event: Event<T>): Event<void> {
		return event as Event<any> as Event<void>;
	}

	/**
	 * Given a collection of events, returns a single event which emits whenever any of the provided events emit.
	 */
	export function any<T>(...events: Event<T>[]): Event<T>;
	export function any(...events: Event<any>[]): Event<void>;
	export function any<T>(...events: Event<T>[]): Event<T> {
		return (listener, thisArgs = null, disposables?) => {
			const disposable = combinedDisposable(...events.map(event => event(e => listener.call(thisArgs, e))));
			return addAndReturnDisposable(disposable, disposables);
		};
	}

	/**
	 * *NOTE* that this function returns an `Event` and it MUST be called with a `DisposableStore` whenever the returned
	 * event is accessible to "third parties", e.g the event is a public property. Otherwise a leaked listener on the
	 * returned event causes this utility to leak a listener on the original event.
	 */
	export function reduce<I, O>(event: Event<I>, merge: (last: O | undefined, event: I) => O, initial?: O, disposable?: DisposableStore): Event<O> {
		let output: O | undefined = initial;

		return map<I, O>(event, e => {
			output = merge(output, e);
			return output;
		}, disposable);
	}

	function snapshot<T>(event: Event<T>, disposable: DisposableStore | undefined): Event<T> {
		let listener: IDisposable | undefined;

		const options: EmitterOptions | undefined = {
			onWillAddFirstListener() {
				listener = event(emitter.fire, emitter);
			},
			onDidRemoveLastListener() {
				listener?.dispose();
			}
		};

		if (!disposable) {
			_addLeakageTraceLogic(options);
		}

		const emitter = new Emitter<T>(options);

		disposable?.add(emitter);

		return emitter.event;
	}

	/**
	 * Adds the IDisposable to the store if it's set, and returns it. Useful to
	 * Event function implementation.
	 */
	function addAndReturnDisposable<T extends IDisposable>(d: T, store: DisposableStore | IDisposable[] | undefined): T {
		if (store instanceof Array) {
			store.push(d);
		} else if (store) {
			store.add(d);
		}
		return d;
	}

	/**
	 * Given an event, creates a new emitter that event that will debounce events based on {@link delay} and give an
	 * array event object of all events that fired.
	 *
	 * *NOTE* that this function returns an `Event` and it MUST be called with a `DisposableStore` whenever the returned
	 * event is accessible to "third parties", e.g the event is a public property. Otherwise a leaked listener on the
	 * returned event causes this utility to leak a listener on the original event.
	 *
	 * @param event The original event to debounce.
	 * @param merge A function that reduces all events into a single event.
	 * @param delay The number of milliseconds to debounce.
	 * @param leading Whether to fire a leading event without debouncing.
	 * @param flushOnListenerRemove Whether to fire all debounced events when a listener is removed. If this is not
	 * specified, some events could go missing. Use this if it's important that all events are processed, even if the
	 * listener gets disposed before the debounced event fires.
	 * @param leakWarningThreshold See {@link EmitterOptions.leakWarningThreshold}.
	 * @param disposable A disposable store to register the debounce emitter to.
	 */
	export function debounce<T>(event: Event<T>, merge: (last: T | undefined, event: T) => T, delay?: number | typeof MicrotaskDelay, leading?: boolean, flushOnListenerRemove?: boolean, leakWarningThreshold?: number, disposable?: DisposableStore): Event<T>;
	export function debounce<I, O>(event: Event<I>, merge: (last: O | undefined, event: I) => O, delay?: number | typeof MicrotaskDelay, leading?: boolean, flushOnListenerRemove?: boolean, leakWarningThreshold?: number, disposable?: DisposableStore): Event<O>;
	export function debounce<I, O>(event: Event<I>, merge: (last: O | undefined, event: I) => O, delay: number | typeof MicrotaskDelay = 100, leading = false, flushOnListenerRemove = false, leakWarningThreshold?: number, disposable?: DisposableStore): Event<O> {
		let subscription: IDisposable;
		let output: O | undefined = undefined;
		let handle: Timeout | undefined | null = undefined;
		let numDebouncedCalls = 0;
		let doFire: (() => void) | undefined;

		const options: EmitterOptions | undefined = {
			leakWarningThreshold,
			onWillAddFirstListener() {
				subscription = event(cur => {
					numDebouncedCalls++;
					output = merge(output, cur);

					if (leading && !handle) {
						emitter.fire(output);
						output = undefined;
					}

					doFire = () => {
						const _output = output;
						output = undefined;
						handle = undefined;
						if (!leading || numDebouncedCalls > 1) {
							emitter.fire(_output!);
						}
						numDebouncedCalls = 0;
					};

					if (typeof delay === 'number') {
						if (handle) {
							clearTimeout(handle);
						}
						handle = setTimeout(doFire, delay);
					} else {
						if (handle === undefined) {
							handle = null;
							queueMicrotask(doFire);
						}
					}
				});
			},
			onWillRemoveListener() {
				if (flushOnListenerRemove && numDebouncedCalls > 0) {
					doFire?.();
				}
			},
			onDidRemoveLastListener() {
				doFire = undefined;
				subscription.dispose();
			}
		};

		if (!disposable) {
			_addLeakageTraceLogic(options);
		}

		const emitter = new Emitter<O>(options);

		disposable?.add(emitter);

		return emitter.event;
	}

	/**
	 * Debounces an event, firing after some delay (default=0) with an array of all event original objects.
	 *
	 * *NOTE* that this function returns an `Event` and it MUST be called with a `DisposableStore` whenever the returned
	 * event is accessible to "third parties", e.g the event is a public property. Otherwise a leaked listener on the
	 * returned event causes this utility to leak a listener on the original event.
	 *
	 * @param event The event source for the new event.
	 * @param delay The number of milliseconds to debounce.
	 * @param flushOnListenerRemove Whether to fire all debounced events when a listener is removed. If this is not
	 * specified, some events could go missing. Use this if it's important that all events are processed, even if the
	 * listener gets disposed before the debounced event fires.
	 * @param disposable A disposable store to add the new EventEmitter to.
	 */
	export function accumulate<T>(event: Event<T>, delay: number | typeof MicrotaskDelay = 0, flushOnListenerRemove?: boolean, disposable?: DisposableStore): Event<T[]> {
		return Event.debounce<T, T[]>(event, (last, e) => {
			if (!last) {
				return [e];
			}
			last.push(e);
			return last;
		}, delay, undefined, flushOnListenerRemove ?? true, undefined, disposable);
	}

	/**
	 * Filters an event such that some condition is _not_ met more than once in a row, effectively ensuring duplicate
	 * event objects from different sources do not fire the same event object.
	 *
	 * *NOTE* that this function returns an `Event` and it MUST be called with a `DisposableStore` whenever the returned
	 * event is accessible to "third parties", e.g the event is a public property. Otherwise a leaked listener on the
	 * returned event causes this utility to leak a listener on the original event.
	 *
	 * @param event The event source for the new event.
	 * @param equals The equality condition.
	 * @param disposable A disposable store to add the new EventEmitter to.
	 *
	 * @example
	 * ```
	 * // Fire only one time when a single window is opened or focused
	 * Event.latch(Event.any(onDidOpenWindow, onDidFocusWindow))
	 * ```
	 */
	export function latch<T>(event: Event<T>, equals: (a: T, b: T) => boolean = (a, b) => a === b, disposable?: DisposableStore): Event<T> {
		let firstCall = true;
		let cache: T;

		return filter(event, value => {
			const shouldEmit = firstCall || !equals(value, cache);
			firstCall = false;
			cache = value;
			return shouldEmit;
		}, disposable);
	}

	/**
	 * Splits an event whose parameter is a union type into 2 separate events for each type in the union.
	 *
	 * *NOTE* that this function returns an `Event` and it MUST be called with a `DisposableStore` whenever the returned
	 * event is accessible to "third parties", e.g the event is a public property. Otherwise a leaked listener on the
	 * returned event causes this utility to leak a listener on the original event.
	 *
	 * @example
	 * ```
	 * const event = new EventEmitter<number | undefined>().event;
	 * const [numberEvent, undefinedEvent] = Event.split(event, isUndefined);
	 * ```
	 *
	 * @param event The event source for the new event.
	 * @param isT A function that determines what event is of the first type.
	 * @param disposable A disposable store to add the new EventEmitter to.
	 */
	export function split<T, U>(event: Event<T | U>, isT: (e: T | U) => e is T, disposable?: DisposableStore): [Event<T>, Event<U>] {
		return [
			Event.filter(event, isT, disposable),
			Event.filter(event, e => !isT(e), disposable) as Event<U>,
		];
	}

	/**
	 * Buffers an event until it has a listener attached.
	 *
	 * *NOTE* that this function returns an `Event` and it MUST be called with a `DisposableStore` whenever the returned
	 * event is accessible to "third parties", e.g the event is a public property. Otherwise a leaked listener on the
	 * returned event causes this utility to leak a listener on the original event.
	 *
	 * @param event The event source for the new event.
	 * @param flushAfterTimeout Determines whether to flush the buffer after a timeout immediately or after a
	 * `setTimeout` when the first event listener is added.
	 * @param _buffer Internal: A source event array used for tests.
	 *
	 * @example
	 * ```
	 * // Start accumulating events, when the first listener is attached, flush
	 * // the event after a timeout such that multiple listeners attached before
	 * // the timeout would receive the event
	 * this.onInstallExtension = Event.buffer(service.onInstallExtension, true);
	 * ```
	 */
	export function buffer<T>(event: Event<T>, flushAfterTimeout = false, _buffer: T[] = [], disposable?: DisposableStore): Event<T> {
		let buffer: T[] | null = _buffer.slice();

		let listener: IDisposable | null = event(e => {
			if (buffer) {
				buffer.push(e);
			} else {
				emitter.fire(e);
			}
		});

		if (disposable) {
			disposable.add(listener);
		}

		const flush = () => {
			buffer?.forEach(e => emitter.fire(e));
			buffer = null;
		};

		const emitter = new Emitter<T>({
			onWillAddFirstListener() {
				if (!listener) {
					listener = event(e => emitter.fire(e));
					if (disposable) {
						disposable.add(listener);
					}
				}
			},

			onDidAddFirstListener() {
				if (buffer) {
					if (flushAfterTimeout) {
						setTimeout(flush);
					} else {
						flush();
					}
				}
			},

			onDidRemoveLastListener() {
				if (listener) {
					listener.dispose();
				}
				listener = null;
			}
		});

		if (disposable) {
			disposable.add(emitter);
		}

		return emitter.event;
	}
	/**
	 * Wraps the event in an {@link IChainableEvent}, allowing a more functional programming style.
	 *
	 * @example
	 * ```
	 * // Normal
	 * const onEnterPressNormal = Event.filter(
	 *   Event.map(onKeyPress.event, e => new StandardKeyboardEvent(e)),
	 *   e.keyCode === KeyCode.Enter
	 * ).event;
	 *
	 * // Using chain
	 * const onEnterPressChain = Event.chain(onKeyPress.event, $ => $
	 *   .map(e => new StandardKeyboardEvent(e))
	 *   .filter(e => e.keyCode === KeyCode.Enter)
	 * );
	 * ```
	 */
	export function chain<T, R>(event: Event<T>, sythensize: ($: IChainableSythensis<T>) => IChainableSythensis<R>): Event<R> {
		const fn: Event<R> = (listener, thisArgs, disposables) => {
			const cs = sythensize(new ChainableSynthesis()) as ChainableSynthesis;
			return event(function (value) {
				const result = cs.evaluate(value);
				if (result !== HaltChainable) {
					listener.call(thisArgs, result);
				}
			}, undefined, disposables);
		};

		return fn;
	}

	const HaltChainable = Symbol('HaltChainable');

	class ChainableSynthesis implements IChainableSythensis<any> {
		private readonly steps: ((input: any) => unknown)[] = [];

		map<O>(fn: (i: any) => O): this {
			this.steps.push(fn);
			return this;
		}

		forEach(fn: (i: any) => void): this {
			this.steps.push(v => {
				fn(v);
				return v;
			});
			return this;
		}

		filter(fn: (e: any) => boolean): this {
			this.steps.push(v => fn(v) ? v : HaltChainable);
			return this;
		}

		reduce<R>(merge: (last: R | undefined, event: any) => R, initial?: R | undefined): this {
			let last = initial;
			this.steps.push(v => {
				last = merge(last, v);
				return last;
			});
			return this;
		}

		latch(equals: (a: any, b: any) => boolean = (a, b) => a === b): ChainableSynthesis {
			let firstCall = true;
			let cache: any;
			this.steps.push(value => {
				const shouldEmit = firstCall || !equals(value, cache);
				firstCall = false;
				cache = value;
				return shouldEmit ? value : HaltChainable;
			});

			return this;
		}

		public evaluate(value: any) {
			for (const step of this.steps) {
				value = step(value);
				if (value === HaltChainable) {
					break;
				}
			}

			return value;
		}
	}

	export interface IChainableSythensis<T> {
		map<O>(fn: (i: T) => O): IChainableSythensis<O>;
		forEach(fn: (i: T) => void): IChainableSythensis<T>;
		filter<R extends T>(fn: (e: T) => e is R): IChainableSythensis<R>;
		filter(fn: (e: T) => boolean): IChainableSythensis<T>;
		reduce<R>(merge: (last: R, event: T) => R, initial: R): IChainableSythensis<R>;
		reduce<R>(merge: (last: R | undefined, event: T) => R): IChainableSythensis<R>;
		latch(equals?: (a: T, b: T) => boolean): IChainableSythensis<T>;
	}

	export interface NodeEventEmitter {
		on(event: string | symbol, listener: Function): unknown;
		removeListener(event: string | symbol, listener: Function): unknown;
	}

	/**
	 * Creates an {@link Event} from a node event emitter.
	 */
	export function fromNodeEventEmitter<T>(emitter: NodeEventEmitter, eventName: string, map: (...args: any[]) => T = id => id): Event<T> {
		const fn = (...args: any[]) => result.fire(map(...args));
		const onFirstListenerAdd = () => emitter.on(eventName, fn);
		const onLastListenerRemove = () => emitter.removeListener(eventName, fn);
		const result = new Emitter<T>({ onWillAddFirstListener: onFirstListenerAdd, onDidRemoveLastListener: onLastListenerRemove });

		return result.event;
	}

	export interface DOMEventEmitter {
		addEventListener(event: string | symbol, listener: Function): void;
		removeEventListener(event: string | symbol, listener: Function): void;
	}

	/**
	 * Creates an {@link Event} from a DOM event emitter.
	 */
	export function fromDOMEventEmitter<T>(emitter: DOMEventEmitter, eventName: string, map: (...args: any[]) => T = id => id): Event<T> {
		const fn = (...args: any[]) => result.fire(map(...args));
		const onFirstListenerAdd = () => emitter.addEventListener(eventName, fn);
		const onLastListenerRemove = () => emitter.removeEventListener(eventName, fn);
		const result = new Emitter<T>({ onWillAddFirstListener: onFirstListenerAdd, onDidRemoveLastListener: onLastListenerRemove });

		return result.event;
	}

	/**
	 * Creates a promise out of an event, using the {@link Event.once} helper.
	 */
	export function toPromise<T>(event: Event<T>, disposables?: IDisposable[] | DisposableStore): CancelablePromise<T> {
		let cancelRef: () => void;
		let listener: IDisposable;
		const promise = new Promise((resolve) => {
			listener = once(event)(resolve);
			addToDisposables(listener, disposables);

			// not resolved, matching the behavior of a normal disposal
			cancelRef = () => {
				disposeAndRemove(listener, disposables);
			};
		}) as CancelablePromise<T>;
		promise.cancel = cancelRef!;

		if (disposables) {
			promise.finally(() => disposeAndRemove(listener, disposables));
		}

		return promise;
	}

	/**
	 * A convenience function for forwarding an event to another emitter which
	 * improves readability.
	 *
	 * This is similar to {@link Relay} but allows instantiating and forwarding
	 * on a single line and also allows for multiple source events.
	 * @param from The event to forward.
	 * @param to The emitter to forward the event to.
	 * @example
	 * Event.forward(event, emitter);
	 * // equivalent to
	 * event(e => emitter.fire(e));
	 * // equivalent to
	 * event(emitter.fire, emitter);
	 */
	export function forward<T>(from: Event<T>, to: Emitter<T>): IDisposable {
		return from(e => to.fire(e));
	}

	/**
	 * Adds a listener to an event and calls the listener immediately with undefined as the event object.
	 *
	 * @example
	 * ```
	 * // Initialize the UI and update it when dataChangeEvent fires
	 * runAndSubscribe(dataChangeEvent, () => this._updateUI());
	 * ```
	 */
	export function runAndSubscribe<T>(event: Event<T>, handler: (e: T) => unknown, initial: T): IDisposable;
	export function runAndSubscribe<T>(event: Event<T>, handler: (e: T | undefined) => unknown): IDisposable;
	export function runAndSubscribe<T>(event: Event<T>, handler: (e: T | undefined) => unknown, initial?: T): IDisposable {
		handler(initial);
		return event(e => handler(e));
	}

	class EmitterObserver<T> implements IObserver {

		readonly emitter: Emitter<T>;

		private _counter = 0;
		private _hasChanged = false;

		constructor(readonly _observable: IObservable<T>, store: DisposableStore | undefined) {
			const options: EmitterOptions = {
				onWillAddFirstListener: () => {
					_observable.addObserver(this);

					// Communicate to the observable that we received its current value and would like to be notified about future changes.
					this._observable.reportChanges();
				},
				onDidRemoveLastListener: () => {
					_observable.removeObserver(this);
				}
			};
			if (!store) {
				_addLeakageTraceLogic(options);
			}
			this.emitter = new Emitter<T>(options);
			if (store) {
				store.add(this.emitter);
			}
		}

		beginUpdate<T>(_observable: IObservable<T>): void {
			// assert(_observable === this.obs);
			this._counter++;
		}

		handlePossibleChange<T>(_observable: IObservable<T>): void {
			// assert(_observable === this.obs);
		}

		handleChange<T, TChange>(_observable: IObservableWithChange<T, TChange>, _change: TChange): void {
			// assert(_observable === this.obs);
			this._hasChanged = true;
		}

		endUpdate<T>(_observable: IObservable<T>): void {
			// assert(_observable === this.obs);
			this._counter--;
			if (this._counter === 0) {
				this._observable.reportChanges();
				if (this._hasChanged) {
					this._hasChanged = false;
					this.emitter.fire(this._observable.get());
				}
			}
		}
	}

	/**
	 * Creates an event emitter that is fired when the observable changes.
	 * Each listeners subscribes to the emitter.
	 */
	export function fromObservable<T>(obs: IObservable<T>, store?: DisposableStore): Event<T> {
		const observer = new EmitterObserver(obs, store);
		return observer.emitter.event;
	}

	/**
	 * Each listener is attached to the observable directly.
	 */
	export function fromObservableLight(observable: IObservable<unknown>): Event<void> {
		return (listener, thisArgs, disposables) => {
			let count = 0;
			let didChange = false;
			const observer: IObserver = {
				beginUpdate() {
					count++;
				},
				endUpdate() {
					count--;
					if (count === 0) {
						observable.reportChanges();
						if (didChange) {
							didChange = false;
							listener.call(thisArgs);
						}
					}
				},
				handlePossibleChange() {
					// noop
				},
				handleChange() {
					didChange = true;
				}
			};
			observable.addObserver(observer);
			observable.reportChanges();
			const disposable = {
				dispose() {
					observable.removeObserver(observer);
				}
			};

			addToDisposables(disposable, disposables);

			return disposable;
		};
	}
}

export interface EmitterOptions {
	/**
	 * Optional function that's called *before* the very first listener is added
	 */
	onWillAddFirstListener?: Function;
	/**
	 * Optional function that's called *after* the very first listener is added
	 */
	onDidAddFirstListener?: Function;
	/**
	 * Optional function that's called after a listener is added
	 */
	onDidAddListener?: Function;
	/**
	 * Optional function that's called *after* remove the very last listener
	 */
	onDidRemoveLastListener?: Function;
	/**
	 * Optional function that's called *before* a listener is removed
	 */
	onWillRemoveListener?: Function;
	/**
	 * Optional function that's called when a listener throws an error. Defaults to
	 * {@link onUnexpectedError}
	 */
	onListenerError?: (e: any) => void;
	/**
	 * Number of listeners that are allowed before assuming a leak. Default to
	 * a globally configured value
	 *
	 * @see setGlobalLeakWarningThreshold
	 */
	leakWarningThreshold?: number;
	/**
	 * Pass in a delivery queue, which is useful for ensuring
	 * in order event delivery across multiple emitters.
	 */
	deliveryQueue?: EventDeliveryQueue;

	/** ONLY enable this during development */
	_profName?: string;
}


export class EventProfiling {

	static readonly all = new Set<EventProfiling>();

	private static _idPool = 0;

	readonly name: string;
	public listenerCount: number = 0;
	public invocationCount = 0;
	public elapsedOverall = 0;
	public durations: number[] = [];

	private _stopWatch?: StopWatch;

	constructor(name: string) {
		this.name = `${name}_${EventProfiling._idPool++}`;
		EventProfiling.all.add(this);
	}

	start(listenerCount: number): void {
		this._stopWatch = new StopWatch();
		this.listenerCount = listenerCount;
	}

	stop(): void {
		if (this._stopWatch) {
			const elapsed = this._stopWatch.elapsed();
			this.durations.push(elapsed);
			this.elapsedOverall += elapsed;
			this.invocationCount += 1;
			this._stopWatch = undefined;
		}
	}
}

let _globalLeakWarningThreshold = -1;
export function setGlobalLeakWarningThreshold(n: number): IDisposable {
	const oldValue = _globalLeakWarningThreshold;
	_globalLeakWarningThreshold = n;
	return {
		dispose() {
			_globalLeakWarningThreshold = oldValue;
		}
	};
}

class LeakageMonitor {

	private static _idPool = 1;

	private _stacks: Map<string, number> | undefined;
	private _warnCountdown: number = 0;

	constructor(
		private readonly _errorHandler: (err: Error) => void,
		readonly threshold: number,
		readonly name: string = (LeakageMonitor._idPool++).toString(16).padStart(3, '0')
	) { }

	dispose(): void {
		this._stacks?.clear();
	}

	check(stack: Stacktrace, listenerCount: number): undefined | (() => void) {

		const threshold = this.threshold;
		if (threshold <= 0 || listenerCount < threshold) {
			return undefined;
		}

		if (!this._stacks) {
			this._stacks = new Map();
		}
		const count = (this._stacks.get(stack.value) || 0);
		this._stacks.set(stack.value, count + 1);
		this._warnCountdown -= 1;

		if (this._warnCountdown <= 0) {
			// only warn on first exceed and then every time the limit
			// is exceeded by 50% again
			this._warnCountdown = threshold * 0.5;

			const [topStack, topCount] = this.getMostFrequentStack()!;
			const message = `[${this.name}] potential listener LEAK detected, having ${listenerCount} listeners already. MOST frequent listener (${topCount}):`;
			console.warn(message);
			console.warn(topStack);

			const error = new ListenerLeakError(message, topStack);
			this._errorHandler(error);
		}

		return () => {
			const count = (this._stacks!.get(stack.value) || 0);
			this._stacks!.set(stack.value, count - 1);
		};
	}

	getMostFrequentStack(): [string, number] | undefined {
		if (!this._stacks) {
			return undefined;
		}
		let topStack: [string, number] | undefined;
		let topCount: number = 0;
		for (const [stack, count] of this._stacks) {
			if (!topStack || topCount < count) {
				topStack = [stack, count];
				topCount = count;
			}
		}
		return topStack;
	}
}

class Stacktrace {

	static create() {
		const err = new Error();
		return new Stacktrace(err.stack ?? '');
	}

	private constructor(readonly value: string) { }

	print() {
		console.warn(this.value.split('\n').slice(2).join('\n'));
	}
}

// error that is logged when going over the configured listener threshold
export class ListenerLeakError extends Error {
	constructor(message: string, stack: string) {
		super(message);
		this.name = 'ListenerLeakError';
		this.stack = stack;
	}
}

// SEVERE error that is logged when having gone way over the configured listener
// threshold so that the emitter refuses to accept more listeners
export class ListenerRefusalError extends Error {
	constructor(message: string, stack: string) {
		super(message);
		this.name = 'ListenerRefusalError';
		this.stack = stack;
	}
}

let id = 0;
class UniqueContainer<T> {
	stack?: Stacktrace;
	public id = id++;
	constructor(public readonly value: T) { }
}
const compactionThreshold = 2;

type ListenerContainer<T> = UniqueContainer<(data: T) => void>;
type ListenerOrListeners<T> = (ListenerContainer<T> | undefined)[] | ListenerContainer<T>;

const forEachListener = <T>(listeners: ListenerOrListeners<T>, fn: (c: ListenerContainer<T>) => void) => {
	if (listeners instanceof UniqueContainer) {
		fn(listeners);
	} else {
		for (let i = 0; i < listeners.length; i++) {
			const l = listeners[i];
			if (l) {
				fn(l);
			}
		}
	}
};

/**
 * The Emitter can be used to expose an Event to the public
 * to fire it from the insides.
 * Sample:
	class Document {

		private readonly _onDidChange = new Emitter<(value:string)=>any>();

		public onDidChange = this._onDidChange.event;

		// getter-style
		// get onDidChange(): Event<(value:string)=>any> {
		// 	return this._onDidChange.event;
		// }

		private _doIt() {
			//...
			this._onDidChange.fire(value);
		}
	}
 */
export class Emitter<T> {

	private readonly _options?: EmitterOptions;
	private readonly _leakageMon?: LeakageMonitor;
	private readonly _perfMon?: EventProfiling;
	private _disposed?: true;
	private _event?: Event<T>;

	/**
	 * A listener, or list of listeners. A single listener is the most common
	 * for event emitters (#185789), so we optimize that special case to avoid
	 * wrapping it in an array (just like Node.js itself.)
	 *
	 * A list of listeners never 'downgrades' back to a plain function if
	 * listeners are removed, for two reasons:
	 *
	 *  1. That's complicated (especially with the deliveryQueue)
	 *  2. A listener with >1 listener is likely to have >1 listener again at
	 *     some point, and swapping between arrays and functions may[citation needed]
	 *     introduce unnecessary work and garbage.
	 *
	 * The array listeners can be 'sparse', to avoid reallocating the array
	 * whenever any listener is added or removed. If more than `1 / compactionThreshold`
	 * of the array is empty, only then is it resized.
	 */
	protected _listeners?: ListenerOrListeners<T>;

	/**
	 * Always to be defined if _listeners is an array. It's no longer a true
	 * queue, but holds the dispatching 'state'. If `fire()` is called on an
	 * emitter, any work left in the _deliveryQueue is finished first.
	 */
	private _deliveryQueue?: EventDeliveryQueuePrivate;
	protected _size = 0;

	constructor(options?: EmitterOptions) {
		this._options = options;
		this._leakageMon = (_globalLeakWarningThreshold > 0 || this._options?.leakWarningThreshold)
			? new LeakageMonitor(options?.onListenerError ?? onUnexpectedError, this._options?.leakWarningThreshold ?? _globalLeakWarningThreshold) :
			undefined;
		this._perfMon = this._options?._profName ? new EventProfiling(this._options._profName) : undefined;
		this._deliveryQueue = this._options?.deliveryQueue as EventDeliveryQueuePrivate | undefined;
	}

	dispose() {
		if (!this._disposed) {
			this._disposed = true;

			// It is bad to have listeners at the time of disposing an emitter, it is worst to have listeners keep the emitter
			// alive via the reference that's embedded in their disposables. Therefore we loop over all remaining listeners and
			// unset their subscriptions/disposables. Looping and blaming remaining listeners is done on next tick because the
			// the following programming pattern is very popular:
			//
			// const someModel = this._disposables.add(new ModelObject()); // (1) create and register model
			// this._disposables.add(someModel.onDidChange(() => { ... }); // (2) subscribe and register model-event listener
			// ...later...
			// this._disposables.dispose(); disposes (1) then (2): don't warn after (1) but after the "overall dispose" is done

			if (this._deliveryQueue?.current === this) {
				this._deliveryQueue.reset();
			}
			if (this._listeners) {
				if (_enableDisposeWithListenerWarning) {
					const listeners = this._listeners;
					queueMicrotask(() => {
						forEachListener(listeners, l => l.stack?.print());
					});
				}

				this._listeners = undefined;
				this._size = 0;
			}
			this._options?.onDidRemoveLastListener?.();
			this._leakageMon?.dispose();
		}
	}

	/**
	 * For the public to allow to subscribe
	 * to events from this Emitter
	 */
	get event(): Event<T> {
		this._event ??= (callback: (e: T) => unknown, thisArgs?: any, disposables?: IDisposable[] | DisposableStore) => {
			if (this._leakageMon && this._size > this._leakageMon.threshold ** 2) {
				const message = `[${this._leakageMon.name}] REFUSES to accept new listeners because it exceeded its threshold by far (${this._size} vs ${this._leakageMon.threshold})`;
				console.warn(message);

				const tuple = this._leakageMon.getMostFrequentStack() ?? ['UNKNOWN stack', -1];
				const error = new ListenerRefusalError(`${message}. HINT: Stack shows most frequent listener (${tuple[1]}-times)`, tuple[0]);
				const errorHandler = this._options?.onListenerError || onUnexpectedError;
				errorHandler(error);

				return Disposable.None;
			}

			if (this._disposed) {
				// todo: should we warn if a listener is added to a disposed emitter? This happens often
				return Disposable.None;
			}

			if (thisArgs) {
				callback = callback.bind(thisArgs);
			}

			const contained = new UniqueContainer(callback);

			let removeMonitor: Function | undefined;
			let stack: Stacktrace | undefined;
			if (this._leakageMon && this._size >= Math.ceil(this._leakageMon.threshold * 0.2)) {
				// check and record this emitter for potential leakage
				contained.stack = Stacktrace.create();
				removeMonitor = this._leakageMon.check(contained.stack, this._size + 1);
			}

			if (_enableDisposeWithListenerWarning) {
				contained.stack = stack ?? Stacktrace.create();
			}

			if (!this._listeners) {
				this._options?.onWillAddFirstListener?.(this);
				this._listeners = contained;
				this._options?.onDidAddFirstListener?.(this);
			} else if (this._listeners instanceof UniqueContainer) {
				this._deliveryQueue ??= new EventDeliveryQueuePrivate();
				this._listeners = [this._listeners, contained];
			} else {
				this._listeners.push(contained);
			}
			this._options?.onDidAddListener?.(this);

			this._size++;


			const result = toDisposable(() => {
				removeMonitor?.();
				this._removeListener(contained);
			});
			addToDisposables(result, disposables);

			return result;
		};

		return this._event;
	}

	private _removeListener(listener: ListenerContainer<T>) {
		this._options?.onWillRemoveListener?.(this);

		if (!this._listeners) {
			return; // expected if a listener gets disposed
		}

		if (this._size === 1) {
			this._listeners = undefined;
			this._options?.onDidRemoveLastListener?.(this);
			this._size = 0;
			return;
		}

		// size > 1 which requires that listeners be a list:
		const listeners = this._listeners as (ListenerContainer<T> | undefined)[];

		const index = listeners.indexOf(listener);
		if (index === -1) {
			console.log('disposed?', this._disposed);
			console.log('size?', this._size);
			console.log('arr?', JSON.stringify(this._listeners));
			throw new Error('Attempted to dispose unknown listener');
		}

		this._size--;
		listeners[index] = undefined;

		const adjustDeliveryQueue = this._deliveryQueue!.current === this;
		if (this._size * compactionThreshold <= listeners.length) {
			let n = 0;
			for (let i = 0; i < listeners.length; i++) {
				if (listeners[i]) {
					listeners[n++] = listeners[i];
				} else if (adjustDeliveryQueue && n < this._deliveryQueue!.end) {
					this._deliveryQueue!.end--;
					if (n < this._deliveryQueue!.i) {
						this._deliveryQueue!.i--;
					}
				}
			}
			listeners.length = n;
		}
	}

	private _deliver(listener: undefined | UniqueContainer<(value: T) => void>, value: T) {
		if (!listener) {
			return;
		}

		const errorHandler = this._options?.onListenerError || onUnexpectedError;
		if (!errorHandler) {
			listener.value(value);
			return;
		}

		try {
			listener.value(value);
		} catch (e) {
			errorHandler(e);
		}
	}

	/** Delivers items in the queue. Assumes the queue is ready to go. */
	private _deliverQueue(dq: EventDeliveryQueuePrivate) {
		const listeners = dq.current!._listeners! as (ListenerContainer<T> | undefined)[];
		while (dq.i < dq.end) {
			// important: dq.i is incremented before calling deliver() because it might reenter deliverQueue()
			this._deliver(listeners[dq.i++], dq.value as T);
		}
		dq.reset();
	}

	/**
	 * To be kept private to fire an event to
	 * subscribers
	 */
	fire(event: T): void {
		if (this._deliveryQueue?.current) {
			this._deliverQueue(this._deliveryQueue);
			this._perfMon?.stop(); // last fire() will have starting perfmon, stop it before starting the next dispatch
		}

		this._perfMon?.start(this._size);

		if (!this._listeners) {
			// no-op
		} else if (this._listeners instanceof UniqueContainer) {
			this._deliver(this._listeners, event);
		} else {
			const dq = this._deliveryQueue!;
			dq.enqueue(this, event, this._listeners.length);
			this._deliverQueue(dq);
		}

		this._perfMon?.stop();
	}

	hasListeners(): boolean {
		return this._size > 0;
	}
}

export interface EventDeliveryQueue {
	_isEventDeliveryQueue: true;
}

export const createEventDeliveryQueue = (): EventDeliveryQueue => new EventDeliveryQueuePrivate();

class EventDeliveryQueuePrivate implements EventDeliveryQueue {
	declare _isEventDeliveryQueue: true;

	/**
	 * Index in current's listener list.
	 */
	public i = -1;

	/**
	 * The last index in the listener's list to deliver.
	 */
	public end = 0;

	/**
	 * Emitter currently being dispatched on. Emitter._listeners is always an array.
	 */
	public current?: Emitter<any>;
	/**
	 * Currently emitting value. Defined whenever `current` is.
	 */
	public value?: unknown;

	public enqueue<T>(emitter: Emitter<T>, value: T, end: number) {
		this.i = 0;
		this.end = end;
		this.current = emitter;
		this.value = value;
	}

	public reset() {
		this.i = this.end; // force any current emission loop to stop, mainly for during dispose
		this.current = undefined;
		this.value = undefined;
	}
}

export interface IWaitUntil {
	token: CancellationToken;
	waitUntil(thenable: Promise<unknown>): void;
}

export type IWaitUntilData<T> = Omit<Omit<T, 'waitUntil'>, 'token'>;

export class AsyncEmitter<T extends IWaitUntil> extends Emitter<T> {

	private _asyncDeliveryQueue?: LinkedList<[(ev: T) => void, IWaitUntilData<T>]>;

	async fireAsync(data: IWaitUntilData<T>, token: CancellationToken, promiseJoin?: (p: Promise<unknown>, listener: Function) => Promise<unknown>): Promise<void> {
		if (!this._listeners) {
			return;
		}

		if (!this._asyncDeliveryQueue) {
			this._asyncDeliveryQueue = new LinkedList();
		}

		forEachListener(this._listeners, listener => this._asyncDeliveryQueue!.push([listener.value, data]));

		while (this._asyncDeliveryQueue.size > 0 && !token.isCancellationRequested) {

			const [listener, data] = this._asyncDeliveryQueue.shift()!;
			const thenables: Promise<unknown>[] = [];

			// eslint-disable-next-line local/code-no-dangerous-type-assertions
			const event = <T>{
				...data,
				token,
				waitUntil: (p: Promise<unknown>): void => {
					if (Object.isFrozen(thenables)) {
						throw new Error('waitUntil can NOT be called asynchronous');
					}
					if (promiseJoin) {
						p = promiseJoin(p, listener);
					}
					thenables.push(p);
				}
			};

			try {
				listener(event);
			} catch (e) {
				onUnexpectedError(e);
				continue;
			}

			// freeze thenables-collection to enforce sync-calls to
			// wait until and then wait for all thenables to resolve
			Object.freeze(thenables);

			await Promise.allSettled(thenables).then(values => {
				for (const value of values) {
					if (value.status === 'rejected') {
						onUnexpectedError(value.reason);
					}
				}
			});
		}
	}
}


export class PauseableEmitter<T> extends Emitter<T> {

	private _isPaused = 0;
	protected _eventQueue = new LinkedList<T>();
	private _mergeFn?: (input: T[]) => T;

	public get isPaused(): boolean {
		return this._isPaused !== 0;
	}

	constructor(options?: EmitterOptions & { merge?: (input: T[]) => T }) {
		super(options);
		this._mergeFn = options?.merge;
	}

	pause(): void {
		this._isPaused++;
	}

	resume(): void {
		if (this._isPaused !== 0 && --this._isPaused === 0) {
			if (this._mergeFn) {
				// use the merge function to create a single composite
				// event. make a copy in case firing pauses this emitter
				if (this._eventQueue.size > 0) {
					const events = Array.from(this._eventQueue);
					this._eventQueue.clear();
					super.fire(this._mergeFn(events));
				}

			} else {
				// no merging, fire each event individually and test
				// that this emitter isn't paused halfway through
				while (!this._isPaused && this._eventQueue.size !== 0) {
					super.fire(this._eventQueue.shift()!);
				}
			}
		}
	}

	override fire(event: T): void {
		if (this._size) {
			if (this._isPaused !== 0) {
				this._eventQueue.push(event);
			} else {
				super.fire(event);
			}
		}
	}
}

export class DebounceEmitter<T> extends PauseableEmitter<T> {

	private readonly _delay: number;
	private _handle: Timeout | undefined;

	constructor(options: EmitterOptions & { merge: (input: T[]) => T; delay?: number }) {
		super(options);
		this._delay = options.delay ?? 100;
	}

	override fire(event: T): void {
		if (!this._handle) {
			this.pause();
			this._handle = setTimeout(() => {
				this._handle = undefined;
				this.resume();
			}, this._delay);
		}
		super.fire(event);
	}
}

/**
 * An emitter which queue all events and then process them at the
 * end of the event loop.
 */
export class MicrotaskEmitter<T> extends Emitter<T> {
	private _queuedEvents: T[] = [];
	private _mergeFn?: (input: T[]) => T;

	constructor(options?: EmitterOptions & { merge?: (input: T[]) => T }) {
		super(options);
		this._mergeFn = options?.merge;
	}
	override fire(event: T): void {

		if (!this.hasListeners()) {
			return;
		}

		this._queuedEvents.push(event);
		if (this._queuedEvents.length === 1) {
			queueMicrotask(() => {
				if (this._mergeFn) {
					super.fire(this._mergeFn(this._queuedEvents));
				} else {
					this._queuedEvents.forEach(e => super.fire(e));
				}
				this._queuedEvents = [];
			});
		}
	}
}

/**
 * An event emitter that multiplexes many events into a single event.
 *
 * @example Listen to the `onData` event of all `Thing`s, dynamically adding and removing `Thing`s
 * to the multiplexer as needed.
 *
 * ```typescript
 * const anythingDataMultiplexer = new EventMultiplexer<{ data: string }>();
 *
 * const thingListeners = DisposableMap<Thing, IDisposable>();
 *
 * thingService.onDidAddThing(thing => {
 *   thingListeners.set(thing, anythingDataMultiplexer.add(thing.onData);
 * });
 * thingService.onDidRemoveThing(thing => {
 *   thingListeners.deleteAndDispose(thing);
 * });
 *
 * anythingDataMultiplexer.event(e => {
 *   console.log('Something fired data ' + e.data)
 * });
 * ```
 */
export class EventMultiplexer<T> implements IDisposable {

	private readonly emitter: Emitter<T>;
	private hasListeners = false;
	private events: { event: Event<T>; listener: IDisposable | null }[] = [];

	constructor() {
		this.emitter = new Emitter<T>({
			onWillAddFirstListener: () => this.onFirstListenerAdd(),
			onDidRemoveLastListener: () => this.onLastListenerRemove()
		});
	}

	get event(): Event<T> {
		return this.emitter.event;
	}

	add(event: Event<T>): IDisposable {
		const e = { event: event, listener: null };
		this.events.push(e);

		if (this.hasListeners) {
			this.hook(e);
		}

		const dispose = () => {
			if (this.hasListeners) {
				this.unhook(e);
			}

			const idx = this.events.indexOf(e);
			this.events.splice(idx, 1);
		};

		return toDisposable(createSingleCallFunction(dispose));
	}

	private onFirstListenerAdd(): void {
		this.hasListeners = true;
		this.events.forEach(e => this.hook(e));
	}

	private onLastListenerRemove(): void {
		this.hasListeners = false;
		this.events.forEach(e => this.unhook(e));
	}

	private hook(e: { event: Event<T>; listener: IDisposable | null }): void {
		e.listener = e.event(r => this.emitter.fire(r));
	}

	private unhook(e: { event: Event<T>; listener: IDisposable | null }): void {
		e.listener?.dispose();
		e.listener = null;
	}

	dispose(): void {
		this.emitter.dispose();

		for (const e of this.events) {
			e.listener?.dispose();
		}
		this.events = [];
	}
}

export interface IDynamicListEventMultiplexer<TEventType> extends IDisposable {
	readonly event: Event<TEventType>;
}
export class DynamicListEventMultiplexer<TItem, TEventType> implements IDynamicListEventMultiplexer<TEventType> {
	private readonly _store = new DisposableStore();

	readonly event: Event<TEventType>;

	constructor(
		items: TItem[],
		onAddItem: Event<TItem>,
		onRemoveItem: Event<TItem>,
		getEvent: (item: TItem) => Event<TEventType>
	) {
		const multiplexer = this._store.add(new EventMultiplexer<TEventType>());
		const itemListeners = this._store.add(new DisposableMap<TItem, IDisposable>());

		function addItem(instance: TItem) {
			itemListeners.set(instance, multiplexer.add(getEvent(instance)));
		}

		// Existing items
		for (const instance of items) {
			addItem(instance);
		}

		// Added items
		this._store.add(onAddItem(instance => {
			addItem(instance);
		}));

		// Removed items
		this._store.add(onRemoveItem(instance => {
			itemListeners.deleteAndDispose(instance);
		}));

		this.event = multiplexer.event;
	}

	dispose() {
		this._store.dispose();
	}
}

/**
 * The EventBufferer is useful in situations in which you want
 * to delay firing your events during some code.
 * You can wrap that code and be sure that the event will not
 * be fired during that wrap.
 *
 * ```
 * const emitter: Emitter;
 * const delayer = new EventDelayer();
 * const delayedEvent = delayer.wrapEvent(emitter.event);
 *
 * delayedEvent(console.log);
 *
 * delayer.bufferEvents(() => {
 *   emitter.fire(); // event will not be fired yet
 * });
 *
 * // event will only be fired at this point
 * ```
 */
export class EventBufferer {

	private data: { buffers: Function[] }[] = [];

	wrapEvent<T>(event: Event<T>): Event<T>;
	wrapEvent<T>(event: Event<T>, reduce: (last: T | undefined, event: T) => T): Event<T>;
	wrapEvent<T, O>(event: Event<T>, reduce: (last: O | undefined, event: T) => O, initial: O): Event<O>;
	wrapEvent<T, O>(event: Event<T>, reduce?: (last: T | O | undefined, event: T) => T | O, initial?: O): Event<O | T> {
		return (listener, thisArgs?, disposables?) => {
			return event(i => {
				const data = this.data[this.data.length - 1];

				// Non-reduce scenario
				if (!reduce) {
					// Buffering case
					if (data) {
						data.buffers.push(() => listener.call(thisArgs, i));
					} else {
						// Not buffering case
						listener.call(thisArgs, i);
					}
					return;
				}

				// Reduce scenario
				const reduceData = data as typeof data & {
					/**
					 * The accumulated items that will be reduced.
					 */
					items?: T[];
					/**
					 * The reduced result cached to be shared with other listeners.
					 */
					reducedResult?: T | O;
				};

				// Not buffering case
				if (!reduceData) {
					// TODO: Is there a way to cache this reduce call for all listeners?
					listener.call(thisArgs, reduce(initial, i));
					return;
				}

				// Buffering case
				reduceData.items ??= [];
				reduceData.items.push(i);
				if (reduceData.buffers.length === 0) {
					// Include a single buffered function that will reduce all events when we're done buffering events
					data.buffers.push(() => {
						// cache the reduced result so that the value can be shared across all listeners
						reduceData.reducedResult ??= initial
							? reduceData.items!.reduce(reduce as (last: O | undefined, event: T) => O, initial)
							: reduceData.items!.reduce(reduce as (last: T | undefined, event: T) => T);
						listener.call(thisArgs, reduceData.reducedResult);
					});
				}
			}, undefined, disposables);
		};
	}

	bufferEvents<R = void>(fn: () => R): R {
		const data = { buffers: new Array<Function>() };
		this.data.push(data);
		const r = fn();
		this.data.pop();
		data.buffers.forEach(flush => flush());
		return r;
	}
}

/**
 * A Relay is an event forwarder which functions as a replugabble event pipe.
 * Once created, you can connect an input event to it and it will simply forward
 * events from that input event through its own `event` property. The `input`
 * can be changed at any point in time.
 */
export class Relay<T> implements IDisposable {

	private listening = false;
	private inputEvent: Event<T> = Event.None;
	private inputEventListener: IDisposable = Disposable.None;

	private readonly emitter = new Emitter<T>({
		onDidAddFirstListener: () => {
			this.listening = true;
			this.inputEventListener = this.inputEvent(this.emitter.fire, this.emitter);
		},
		onDidRemoveLastListener: () => {
			this.listening = false;
			this.inputEventListener.dispose();
		}
	});

	readonly event: Event<T> = this.emitter.event;

	set input(event: Event<T>) {
		this.inputEvent = event;

		if (this.listening) {
			this.inputEventListener.dispose();
			this.inputEventListener = event(this.emitter.fire, this.emitter);
		}
	}

	dispose() {
		this.inputEventListener.dispose();
		this.emitter.dispose();
	}
}

export interface IValueWithChangeEvent<T> {
	readonly onDidChange: Event<void>;
	get value(): T;
}

export class ValueWithChangeEvent<T> implements IValueWithChangeEvent<T> {
	public static const<T>(value: T): IValueWithChangeEvent<T> {
		return new ConstValueWithChangeEvent(value);
	}

	private readonly _onDidChange = new Emitter<void>();
	readonly onDidChange: Event<void> = this._onDidChange.event;

	constructor(private _value: T) { }

	get value(): T {
		return this._value;
	}

	set value(value: T) {
		if (value !== this._value) {
			this._value = value;
			this._onDidChange.fire(undefined);
		}
	}
}

class ConstValueWithChangeEvent<T> implements IValueWithChangeEvent<T> {
	public readonly onDidChange: Event<void> = Event.None;

	constructor(readonly value: T) { }
}

/**
 * @param handleItem Is called for each item in the set (but only the first time the item is seen in the set).
 * 	The returned disposable is disposed if the item is no longer in the set.
 */
export function trackSetChanges<T>(getData: () => ReadonlySet<T>, onDidChangeData: Event<unknown>, handleItem: (d: T) => IDisposable): IDisposable {
	const map = new DisposableMap<T, IDisposable>();
	let oldData = new Set(getData());
	for (const d of oldData) {
		map.set(d, handleItem(d));
	}

	const store = new DisposableStore();
	store.add(onDidChangeData(() => {
		const newData = getData();
		const diff = diffSets(oldData, newData);
		for (const r of diff.removed) {
			map.deleteAndDispose(r);
		}
		for (const a of diff.added) {
			map.set(a, handleItem(a));
		}
		oldData = new Set(newData);
	}));
	store.add(map);
	return store;
}


function addToDisposables(result: IDisposable, disposables: DisposableStore | IDisposable[] | undefined) {
	if (disposables instanceof DisposableStore) {
		disposables.add(result);
	} else if (Array.isArray(disposables)) {
		disposables.push(result);
	}
}

function disposeAndRemove(result: IDisposable, disposables: DisposableStore | IDisposable[] | undefined) {
	if (disposables instanceof DisposableStore) {
		disposables.delete(result);
	} else if (Array.isArray(disposables)) {
		const index = disposables.indexOf(result);
		if (index !== -1) {
			disposables.splice(index, 1);
		}
	}
	result.dispose();
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/extpath.ts]---
Location: vscode-main/src/vs/base/common/extpath.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CharCode } from './charCode.js';
import { isAbsolute, join, normalize, posix, sep } from './path.js';
import { isWindows } from './platform.js';
import { equalsIgnoreCase, rtrim, startsWithIgnoreCase } from './strings.js';
import { isNumber } from './types.js';

export function isPathSeparator(code: number) {
	return code === CharCode.Slash || code === CharCode.Backslash;
}

/**
 * Takes a Windows OS path and changes backward slashes to forward slashes.
 * This should only be done for OS paths from Windows (or user provided paths potentially from Windows).
 * Using it on a Linux or MaxOS path might change it.
 */
export function toSlashes(osPath: string) {
	return osPath.replace(/[\\/]/g, posix.sep);
}

/**
 * Takes a Windows OS path (using backward or forward slashes) and turns it into a posix path:
 * - turns backward slashes into forward slashes
 * - makes it absolute if it starts with a drive letter
 * This should only be done for OS paths from Windows (or user provided paths potentially from Windows).
 * Using it on a Linux or MaxOS path might change it.
 */
export function toPosixPath(osPath: string) {
	if (osPath.indexOf('/') === -1) {
		osPath = toSlashes(osPath);
	}
	if (/^[a-zA-Z]:(\/|$)/.test(osPath)) { // starts with a drive letter
		osPath = '/' + osPath;
	}
	return osPath;
}

/**
 * Computes the _root_ this path, like `getRoot('c:\files') === c:\`,
 * `getRoot('files:///files/path') === files:///`,
 * or `getRoot('\\server\shares\path') === \\server\shares\`
 */
export function getRoot(path: string, sep: string = posix.sep): string {
	if (!path) {
		return '';
	}

	const len = path.length;
	const firstLetter = path.charCodeAt(0);
	if (isPathSeparator(firstLetter)) {
		if (isPathSeparator(path.charCodeAt(1))) {
			// UNC candidate \\localhost\shares\ddd
			//               ^^^^^^^^^^^^^^^^^^^
			if (!isPathSeparator(path.charCodeAt(2))) {
				let pos = 3;
				const start = pos;
				for (; pos < len; pos++) {
					if (isPathSeparator(path.charCodeAt(pos))) {
						break;
					}
				}
				if (start !== pos && !isPathSeparator(path.charCodeAt(pos + 1))) {
					pos += 1;
					for (; pos < len; pos++) {
						if (isPathSeparator(path.charCodeAt(pos))) {
							return path.slice(0, pos + 1) // consume this separator
								.replace(/[\\/]/g, sep);
						}
					}
				}
			}
		}

		// /user/far
		// ^
		return sep;

	} else if (isWindowsDriveLetter(firstLetter)) {
		// check for windows drive letter c:\ or c:

		if (path.charCodeAt(1) === CharCode.Colon) {
			if (isPathSeparator(path.charCodeAt(2))) {
				// C:\fff
				// ^^^
				return path.slice(0, 2) + sep;
			} else {
				// C:
				// ^^
				return path.slice(0, 2);
			}
		}
	}

	// check for URI
	// scheme://authority/path
	// ^^^^^^^^^^^^^^^^^^^
	let pos = path.indexOf('://');
	if (pos !== -1) {
		pos += 3; // 3 -> "://".length
		for (; pos < len; pos++) {
			if (isPathSeparator(path.charCodeAt(pos))) {
				return path.slice(0, pos + 1); // consume this separator
			}
		}
	}

	return '';
}

/**
 * Check if the path follows this pattern: `\\hostname\sharename`.
 *
 * @see https://msdn.microsoft.com/en-us/library/gg465305.aspx
 * @return A boolean indication if the path is a UNC path, on none-windows
 * always false.
 */
export function isUNC(path: string): boolean {
	if (!isWindows) {
		// UNC is a windows concept
		return false;
	}

	if (!path || path.length < 5) {
		// at least \\a\b
		return false;
	}

	let code = path.charCodeAt(0);
	if (code !== CharCode.Backslash) {
		return false;
	}

	code = path.charCodeAt(1);

	if (code !== CharCode.Backslash) {
		return false;
	}

	let pos = 2;
	const start = pos;
	for (; pos < path.length; pos++) {
		code = path.charCodeAt(pos);
		if (code === CharCode.Backslash) {
			break;
		}
	}

	if (start === pos) {
		return false;
	}

	code = path.charCodeAt(pos + 1);

	if (isNaN(code) || code === CharCode.Backslash) {
		return false;
	}

	return true;
}

// Reference: https://en.wikipedia.org/wiki/Filename
const WINDOWS_INVALID_FILE_CHARS = /[\\/:\*\?"<>\|]/g;
const UNIX_INVALID_FILE_CHARS = /[/]/g;
const WINDOWS_FORBIDDEN_NAMES = /^(con|prn|aux|clock\$|nul|lpt[0-9]|com[0-9])(\.(.*?))?$/i;
export function isValidBasename(name: string | null | undefined, isWindowsOS: boolean = isWindows): boolean {
	const invalidFileChars = isWindowsOS ? WINDOWS_INVALID_FILE_CHARS : UNIX_INVALID_FILE_CHARS;

	if (!name || name.length === 0 || /^\s+$/.test(name)) {
		return false; // require a name that is not just whitespace
	}

	invalidFileChars.lastIndex = 0; // the holy grail of software development
	if (invalidFileChars.test(name)) {
		return false; // check for certain invalid file characters
	}

	if (isWindowsOS && WINDOWS_FORBIDDEN_NAMES.test(name)) {
		return false; // check for certain invalid file names
	}

	if (name === '.' || name === '..') {
		return false; // check for reserved values
	}

	if (isWindowsOS && name[name.length - 1] === '.') {
		return false; // Windows: file cannot end with a "."
	}

	if (isWindowsOS && name.length !== name.trim().length) {
		return false; // Windows: file cannot end with a whitespace
	}

	if (name.length > 255) {
		return false; // most file systems do not allow files > 255 length
	}

	return true;
}

/**
 * @deprecated please use `IUriIdentityService.extUri.isEqual` instead. If you are
 * in a context without services, consider to pass down the `extUri` from the outside
 * or use `extUriBiasedIgnorePathCase` if you know what you are doing.
 */
export function isEqual(pathA: string, pathB: string, ignoreCase?: boolean): boolean {
	const identityEquals = (pathA === pathB);
	if (!ignoreCase || identityEquals) {
		return identityEquals;
	}

	if (!pathA || !pathB) {
		return false;
	}

	return equalsIgnoreCase(pathA, pathB);
}

/**
 * @deprecated please use `IUriIdentityService.extUri.isEqualOrParent` instead. If
 * you are in a context without services, consider to pass down the `extUri` from the
 * outside, or use `extUriBiasedIgnorePathCase` if you know what you are doing.
 */
export function isEqualOrParent(base: string, parentCandidate: string, ignoreCase?: boolean, separator = sep): boolean {
	if (base === parentCandidate) {
		return true;
	}

	if (!base || !parentCandidate) {
		return false;
	}

	if (parentCandidate.length > base.length) {
		return false;
	}

	if (ignoreCase) {
		const beginsWith = startsWithIgnoreCase(base, parentCandidate);
		if (!beginsWith) {
			return false;
		}

		if (parentCandidate.length === base.length) {
			return true; // same path, different casing
		}

		let sepOffset = parentCandidate.length;
		if (parentCandidate.charAt(parentCandidate.length - 1) === separator) {
			sepOffset--; // adjust the expected sep offset in case our candidate already ends in separator character
		}

		return base.charAt(sepOffset) === separator;
	}

	if (parentCandidate.charAt(parentCandidate.length - 1) !== separator) {
		parentCandidate += separator;
	}

	return base.indexOf(parentCandidate) === 0;
}

export function isWindowsDriveLetter(char0: number): boolean {
	return char0 >= CharCode.A && char0 <= CharCode.Z || char0 >= CharCode.a && char0 <= CharCode.z;
}

export function sanitizeFilePath(candidate: string, cwd: string): string {

	// Special case: allow to open a drive letter without trailing backslash
	if (isWindows && candidate.endsWith(':')) {
		candidate += sep;
	}

	// Ensure absolute
	if (!isAbsolute(candidate)) {
		candidate = join(cwd, candidate);
	}

	// Ensure normalized
	candidate = normalize(candidate);

	// Ensure no trailing slash/backslash
	return removeTrailingPathSeparator(candidate);
}

export function removeTrailingPathSeparator(candidate: string): string {
	if (isWindows) {
		candidate = rtrim(candidate, sep);

		// Special case: allow to open drive root ('C:\')
		if (candidate.endsWith(':')) {
			candidate += sep;
		}

	} else {
		candidate = rtrim(candidate, sep);

		// Special case: allow to open root ('/')
		if (!candidate) {
			candidate = sep;
		}
	}

	return candidate;
}

export function isRootOrDriveLetter(path: string): boolean {
	const pathNormalized = normalize(path);

	if (isWindows) {
		if (path.length > 3) {
			return false;
		}

		return hasDriveLetter(pathNormalized) &&
			(path.length === 2 || pathNormalized.charCodeAt(2) === CharCode.Backslash);
	}

	return pathNormalized === posix.sep;
}

export function hasDriveLetter(path: string, isWindowsOS: boolean = isWindows): boolean {
	if (isWindowsOS) {
		return isWindowsDriveLetter(path.charCodeAt(0)) && path.charCodeAt(1) === CharCode.Colon;
	}

	return false;
}

export function getDriveLetter(path: string, isWindowsOS: boolean = isWindows): string | undefined {
	return hasDriveLetter(path, isWindowsOS) ? path[0] : undefined;
}

export function indexOfPath(path: string, candidate: string, ignoreCase?: boolean): number {
	if (candidate.length > path.length) {
		return -1;
	}

	if (path === candidate) {
		return 0;
	}

	if (ignoreCase) {
		path = path.toLowerCase();
		candidate = candidate.toLowerCase();
	}

	return path.indexOf(candidate);
}

export interface IPathWithLineAndColumn {
	path: string;
	line?: number;
	column?: number;
}

export function parseLineAndColumnAware(rawPath: string): IPathWithLineAndColumn {
	const segments = rawPath.split(':'); // C:\file.txt:<line>:<column>

	let path: string | undefined;
	let line: number | undefined;
	let column: number | undefined;

	for (const segment of segments) {
		const segmentAsNumber = Number(segment);
		if (!isNumber(segmentAsNumber)) {
			path = path ? [path, segment].join(':') : segment; // a colon can well be part of a path (e.g. C:\...)
		} else if (line === undefined) {
			line = segmentAsNumber;
		} else if (column === undefined) {
			column = segmentAsNumber;
		}
	}

	if (!path) {
		throw new Error('Format for `--goto` should be: `FILE:LINE(:COLUMN)`');
	}

	return {
		path,
		line: line !== undefined ? line : undefined,
		column: column !== undefined ? column : line !== undefined ? 1 : undefined // if we have a line, make sure column is also set
	};
}

const pathChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const windowsSafePathFirstChars = 'BDEFGHIJKMOQRSTUVWXYZbdefghijkmoqrstuvwxyz0123456789';

export function randomPath(parent?: string, prefix?: string, randomLength = 8): string {
	let suffix = '';
	for (let i = 0; i < randomLength; i++) {
		let pathCharsTouse: string;
		if (i === 0 && isWindows && !prefix && (randomLength === 3 || randomLength === 4)) {

			// Windows has certain reserved file names that cannot be used, such
			// as AUX, CON, PRN, etc. We want to avoid generating a random name
			// that matches that pattern, so we use a different set of characters
			// for the first character of the name that does not include any of
			// the reserved names first characters.

			pathCharsTouse = windowsSafePathFirstChars;
		} else {
			pathCharsTouse = pathChars;
		}

		suffix += pathCharsTouse.charAt(Math.floor(Math.random() * pathCharsTouse.length));
	}

	let randomFileName: string;
	if (prefix) {
		randomFileName = `${prefix}-${suffix}`;
	} else {
		randomFileName = suffix;
	}

	if (parent) {
		return join(parent, randomFileName);
	}

	return randomFileName;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/filters.ts]---
Location: vscode-main/src/vs/base/common/filters.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CharCode } from './charCode.js';
import { LRUCache } from './map.js';
import { getKoreanAltChars } from './naturalLanguage/korean.js';
import { tryNormalizeToBase } from './normalization.js';
import * as strings from './strings.js';

export interface IFilter {
	// Returns null if word doesn't match.
	(word: string, wordToMatchAgainst: string): IMatch[] | null;
}

export interface IMatch {
	start: number;
	end: number;
}

// Combined filters

/**
 * @returns A filter which combines the provided set
 * of filters with an or. The *first* filters that
 * matches defined the return value of the returned
 * filter.
 */
export function or(...filter: IFilter[]): IFilter {
	return function (word: string, wordToMatchAgainst: string): IMatch[] | null {
		for (let i = 0, len = filter.length; i < len; i++) {
			const match = filter[i](word, wordToMatchAgainst);
			if (match) {
				return match;
			}
		}
		return null;
	};
}

// Prefix

export const matchesStrictPrefix: IFilter = _matchesPrefix.bind(undefined, false);
export const matchesPrefix: IFilter = _matchesPrefix.bind(undefined, true);

function _matchesPrefix(ignoreCase: boolean, word: string, wordToMatchAgainst: string): IMatch[] | null {
	if (!wordToMatchAgainst || wordToMatchAgainst.length < word.length) {
		return null;
	}

	let matches: boolean;
	if (ignoreCase) {
		matches = strings.startsWithIgnoreCase(wordToMatchAgainst, word);
	} else {
		matches = wordToMatchAgainst.indexOf(word) === 0;
	}

	if (!matches) {
		return null;
	}

	return word.length > 0 ? [{ start: 0, end: word.length }] : [];
}

// Contiguous Substring

export function matchesContiguousSubString(word: string, wordToMatchAgainst: string): IMatch[] | null {
	if (word.length > wordToMatchAgainst.length) {
		return null;
	}

	const index = wordToMatchAgainst.toLowerCase().indexOf(word.toLowerCase());
	if (index === -1) {
		return null;
	}

	return [{ start: index, end: index + word.length }];
}

export function matchesBaseContiguousSubString(word: string, wordToMatchAgainst: string): IMatch[] | null {
	if (word.length > wordToMatchAgainst.length) {
		return null;
	}

	word = tryNormalizeToBase(word);
	wordToMatchAgainst = tryNormalizeToBase(wordToMatchAgainst);
	const index = wordToMatchAgainst.indexOf(word);
	if (index === -1) {
		return null;
	}

	return [{ start: index, end: index + word.length }];
}

// Substring

export function matchesSubString(word: string, wordToMatchAgainst: string): IMatch[] | null {
	if (word.length > wordToMatchAgainst.length) {
		return null;
	}

	return _matchesSubString(word.toLowerCase(), wordToMatchAgainst.toLowerCase(), 0, 0);
}

function _matchesSubString(word: string, wordToMatchAgainst: string, i: number, j: number): IMatch[] | null {
	if (i === word.length) {
		return [];
	} else if (j === wordToMatchAgainst.length) {
		return null;
	} else {
		if (word[i] === wordToMatchAgainst[j]) {
			let result: IMatch[] | null = null;
			if (result = _matchesSubString(word, wordToMatchAgainst, i + 1, j + 1)) {
				return join({ start: j, end: j + 1 }, result);
			}
			return null;
		}

		return _matchesSubString(word, wordToMatchAgainst, i, j + 1);
	}
}

// CamelCase

function isLower(code: number): boolean {
	return CharCode.a <= code && code <= CharCode.z;
}

export function isUpper(code: number): boolean {
	return CharCode.A <= code && code <= CharCode.Z;
}

function isNumber(code: number): boolean {
	return CharCode.Digit0 <= code && code <= CharCode.Digit9;
}

function isWhitespace(code: number): boolean {
	return (
		code === CharCode.Space
		|| code === CharCode.Tab
		|| code === CharCode.LineFeed
		|| code === CharCode.CarriageReturn
	);
}

const wordSeparators = new Set<number>();
// These are chosen as natural word separators based on written text.
// It is a subset of the word separators used by the monaco editor.
'()[]{}<>`\'"-/;:,.?!'
	.split('')
	.forEach(s => wordSeparators.add(s.charCodeAt(0)));

function isWordSeparator(code: number): boolean {
	return isWhitespace(code) || wordSeparators.has(code);
}

function charactersMatch(codeA: number, codeB: number): boolean {
	return (codeA === codeB) || (isWordSeparator(codeA) && isWordSeparator(codeB));
}

const alternateCharsCache: Map<number, ArrayLike<number> | undefined> = new Map();
/**
 * Gets alternative codes to the character code passed in. This comes in the
 * form of an array of character codes, all of which must match _in order_ to
 * successfully match.
 *
 * @param code The character code to check.
 */
function getAlternateCodes(code: number): ArrayLike<number> | undefined {
	if (alternateCharsCache.has(code)) {
		return alternateCharsCache.get(code);
	}

	// NOTE: This function is written in such a way that it can be extended in
	// the future, but right now the return type takes into account it's only
	// supported by a single "alt codes provider".
	// `ArrayLike<ArrayLike<number>>` is a more appropriate type if changed.
	let result: ArrayLike<number> | undefined;
	const codes = getKoreanAltChars(code);
	if (codes) {
		result = codes;
	}

	alternateCharsCache.set(code, result);
	return result;
}

function isAlphanumeric(code: number): boolean {
	return isLower(code) || isUpper(code) || isNumber(code);
}

function join(head: IMatch, tail: IMatch[]): IMatch[] {
	if (tail.length === 0) {
		tail = [head];
	} else if (head.end === tail[0].start) {
		tail[0].start = head.start;
	} else {
		tail.unshift(head);
	}
	return tail;
}

function nextAnchor(camelCaseWord: string, start: number): number {
	for (let i = start; i < camelCaseWord.length; i++) {
		const c = camelCaseWord.charCodeAt(i);
		if (isUpper(c) || isNumber(c) || (i > 0 && !isAlphanumeric(camelCaseWord.charCodeAt(i - 1)))) {
			return i;
		}
	}
	return camelCaseWord.length;
}

function _matchesCamelCase(word: string, camelCaseWord: string, i: number, j: number): IMatch[] | null {
	if (i === word.length) {
		return [];
	} else if (j === camelCaseWord.length) {
		return null;
	} else if (word[i] !== camelCaseWord[j].toLowerCase()) {
		return null;
	} else {
		let result: IMatch[] | null = null;
		let nextUpperIndex = j + 1;
		result = _matchesCamelCase(word, camelCaseWord, i + 1, j + 1);
		while (!result && (nextUpperIndex = nextAnchor(camelCaseWord, nextUpperIndex)) < camelCaseWord.length) {
			result = _matchesCamelCase(word, camelCaseWord, i + 1, nextUpperIndex);
			nextUpperIndex++;
		}
		return result === null ? null : join({ start: j, end: j + 1 }, result);
	}
}

interface ICamelCaseAnalysis {
	upperPercent: number;
	lowerPercent: number;
	alphaPercent: number;
	numericPercent: number;
}

// Heuristic to avoid computing camel case matcher for words that don't
// look like camelCaseWords.
function analyzeCamelCaseWord(word: string): ICamelCaseAnalysis {
	let upper = 0, lower = 0, alpha = 0, numeric = 0, code = 0;

	for (let i = 0; i < word.length; i++) {
		code = word.charCodeAt(i);

		if (isUpper(code)) { upper++; }
		if (isLower(code)) { lower++; }
		if (isAlphanumeric(code)) { alpha++; }
		if (isNumber(code)) { numeric++; }
	}

	const upperPercent = upper / word.length;
	const lowerPercent = lower / word.length;
	const alphaPercent = alpha / word.length;
	const numericPercent = numeric / word.length;

	return { upperPercent, lowerPercent, alphaPercent, numericPercent };
}

function isUpperCaseWord(analysis: ICamelCaseAnalysis): boolean {
	const { upperPercent, lowerPercent } = analysis;
	return lowerPercent === 0 && upperPercent > 0.6;
}

function isCamelCaseWord(analysis: ICamelCaseAnalysis): boolean {
	const { upperPercent, lowerPercent, alphaPercent, numericPercent } = analysis;
	return lowerPercent > 0.2 && upperPercent < 0.8 && alphaPercent > 0.6 && numericPercent < 0.2;
}

// Heuristic to avoid computing camel case matcher for words that don't
// look like camel case patterns.
function isCamelCasePattern(word: string): boolean {
	let upper = 0, lower = 0, code = 0, whitespace = 0;

	for (let i = 0; i < word.length; i++) {
		code = word.charCodeAt(i);

		if (isUpper(code)) { upper++; }
		if (isLower(code)) { lower++; }
		if (isWhitespace(code)) { whitespace++; }
	}

	if ((upper === 0 || lower === 0) && whitespace === 0) {
		return word.length <= 30;
	} else {
		return upper <= 5;
	}
}

export function matchesCamelCase(word: string, camelCaseWord: string): IMatch[] | null {
	if (!camelCaseWord) {
		return null;
	}

	camelCaseWord = camelCaseWord.trim();

	if (camelCaseWord.length === 0) {
		return null;
	}

	if (!isCamelCasePattern(word)) {
		return null;
	}

	// TODO: Consider removing this check
	if (camelCaseWord.length > 60) {
		camelCaseWord = camelCaseWord.substring(0, 60);
	}

	const analysis = analyzeCamelCaseWord(camelCaseWord);

	if (!isCamelCaseWord(analysis)) {
		if (!isUpperCaseWord(analysis)) {
			return null;
		}

		camelCaseWord = camelCaseWord.toLowerCase();
	}

	let result: IMatch[] | null = null;
	let i = 0;

	word = word.toLowerCase();
	while (i < camelCaseWord.length && (result = _matchesCamelCase(word, camelCaseWord, 0, i)) === null) {
		i = nextAnchor(camelCaseWord, i + 1);
	}

	return result;
}

// Matches beginning of words supporting non-ASCII languages
// If `contiguous` is true then matches word with beginnings of the words in the target. E.g. "pul" will match "Git: Pull"
// Otherwise also matches sub string of the word with beginnings of the words in the target. E.g. "gp" or "g p" will match "Git: Pull"
// Useful in cases where the target is words (e.g. command labels)

export function matchesWords(word: string, target: string, contiguous: boolean = false): IMatch[] | null {
	if (!target || target.length === 0) {
		return null;
	}

	let result: IMatch[] | null = null;
	let targetIndex = 0;

	word = tryNormalizeToBase(word);
	target = tryNormalizeToBase(target);
	while (targetIndex < target.length) {
		result = _matchesWords(word, target, 0, targetIndex, contiguous);
		if (result !== null) {
			break;
		}
		targetIndex = nextWord(target, targetIndex + 1);
	}

	return result;
}

function _matchesWords(word: string, target: string, wordIndex: number, targetIndex: number, contiguous: boolean): IMatch[] | null {
	let targetIndexOffset = 0;

	if (wordIndex === word.length) {
		return [];
	} else if (targetIndex === target.length) {
		return null;
	} else if (!charactersMatch(word.charCodeAt(wordIndex), target.charCodeAt(targetIndex))) {
		// Verify alternate characters before exiting
		const altChars = getAlternateCodes(word.charCodeAt(wordIndex));
		if (!altChars) {
			return null;
		}
		for (let k = 0; k < altChars.length; k++) {
			if (!charactersMatch(altChars[k], target.charCodeAt(targetIndex + k))) {
				return null;
			}
		}
		targetIndexOffset += altChars.length - 1;
	}

	let result: IMatch[] | null = null;
	let nextWordIndex = targetIndex + targetIndexOffset + 1;
	result = _matchesWords(word, target, wordIndex + 1, nextWordIndex, contiguous);
	if (!contiguous) {
		while (!result && (nextWordIndex = nextWord(target, nextWordIndex)) < target.length) {
			result = _matchesWords(word, target, wordIndex + 1, nextWordIndex, contiguous);
			nextWordIndex++;
		}
	}

	if (!result) {
		return null;
	}

	// If the characters don't exactly match, then they must be word separators (see charactersMatch(...)).
	// We don't want to include this in the matches but we don't want to throw the target out all together so we return `result`.
	if (word.charCodeAt(wordIndex) !== target.charCodeAt(targetIndex)) {
		// Verify alternate characters before exiting
		const altChars = getAlternateCodes(word.charCodeAt(wordIndex));
		if (!altChars) {
			return result;
		}
		for (let k = 0; k < altChars.length; k++) {
			if (altChars[k] !== target.charCodeAt(targetIndex + k)) {
				return result;
			}
		}
	}

	return join({ start: targetIndex, end: targetIndex + targetIndexOffset + 1 }, result);
}

function nextWord(word: string, start: number): number {
	for (let i = start; i < word.length; i++) {
		if (isWordSeparator(word.charCodeAt(i)) ||
			(i > 0 && isWordSeparator(word.charCodeAt(i - 1)))) {
			return i;
		}
	}
	return word.length;
}

// Fuzzy

const fuzzyContiguousFilter = or(matchesPrefix, matchesCamelCase, matchesContiguousSubString);
const fuzzySeparateFilter = or(matchesPrefix, matchesCamelCase, matchesSubString);
const fuzzyRegExpCache = new LRUCache<string, RegExp>(10000); // bounded to 10000 elements

export function matchesFuzzy(word: string, wordToMatchAgainst: string, enableSeparateSubstringMatching = false): IMatch[] | null {
	if (typeof word !== 'string' || typeof wordToMatchAgainst !== 'string') {
		return null; // return early for invalid input
	}

	// Form RegExp for wildcard matches
	let regexp = fuzzyRegExpCache.get(word);
	if (!regexp) {
		regexp = new RegExp(strings.convertSimple2RegExpPattern(word), 'i');
		fuzzyRegExpCache.set(word, regexp);
	}

	// RegExp Filter
	const match = regexp.exec(wordToMatchAgainst);
	if (match) {
		return [{ start: match.index, end: match.index + match[0].length }];
	}

	// Default Filter
	return enableSeparateSubstringMatching ? fuzzySeparateFilter(word, wordToMatchAgainst) : fuzzyContiguousFilter(word, wordToMatchAgainst);
}

/**
 * Match pattern against word in a fuzzy way. As in IntelliSense and faster and more
 * powerful than `matchesFuzzy`
 */
export function matchesFuzzy2(pattern: string, word: string): IMatch[] | null {
	const score = fuzzyScore(pattern, pattern.toLowerCase(), 0, word, word.toLowerCase(), 0, { firstMatchCanBeWeak: true, boostFullMatch: true });
	return score ? createMatches(score) : null;
}

export function anyScore(pattern: string, lowPattern: string, patternPos: number, word: string, lowWord: string, wordPos: number): FuzzyScore {
	const max = Math.min(13, pattern.length);
	for (; patternPos < max; patternPos++) {
		const result = fuzzyScore(pattern, lowPattern, patternPos, word, lowWord, wordPos, { firstMatchCanBeWeak: true, boostFullMatch: true });
		if (result) {
			return result;
		}
	}
	return [0, wordPos];
}

//#region --- fuzzyScore ---

export function createMatches(score: undefined | FuzzyScore): IMatch[] {
	if (typeof score === 'undefined') {
		return [];
	}
	const res: IMatch[] = [];
	const wordPos = score[1];
	for (let i = score.length - 1; i > 1; i--) {
		const pos = score[i] + wordPos;
		const last = res[res.length - 1];
		if (last && last.end === pos) {
			last.end = pos + 1;
		} else {
			res.push({ start: pos, end: pos + 1 });
		}
	}
	return res;
}

const _maxLen = 128;

function initTable() {
	const table: number[][] = [];
	const row: number[] = [];
	for (let i = 0; i <= _maxLen; i++) {
		row[i] = 0;
	}
	for (let i = 0; i <= _maxLen; i++) {
		table.push(row.slice(0));
	}
	return table;
}

function initArr(maxLen: number) {
	const row: number[] = [];
	for (let i = 0; i <= maxLen; i++) {
		row[i] = 0;
	}
	return row;
}

const _minWordMatchPos = initArr(2 * _maxLen); // min word position for a certain pattern position
const _maxWordMatchPos = initArr(2 * _maxLen); // max word position for a certain pattern position
const _diag = initTable(); // the length of a contiguous diagonal match
const _table = initTable();
const _arrows = <Arrow[][]>initTable();
const _debug = false;

function printTable(table: number[][], pattern: string, patternLen: number, word: string, wordLen: number): string {
	function pad(s: string, n: number, pad = ' ') {
		while (s.length < n) {
			s = pad + s;
		}
		return s;
	}
	let ret = ` |   |${word.split('').map(c => pad(c, 3)).join('|')}\n`;

	for (let i = 0; i <= patternLen; i++) {
		if (i === 0) {
			ret += ' |';
		} else {
			ret += `${pattern[i - 1]}|`;
		}
		ret += table[i].slice(0, wordLen + 1).map(n => pad(n.toString(), 3)).join('|') + '\n';
	}
	return ret;
}

function printTables(pattern: string, patternStart: number, word: string, wordStart: number): void {
	pattern = pattern.substr(patternStart);
	word = word.substr(wordStart);
	console.log(printTable(_table, pattern, pattern.length, word, word.length));
	console.log(printTable(_arrows, pattern, pattern.length, word, word.length));
	console.log(printTable(_diag, pattern, pattern.length, word, word.length));
}

function isSeparatorAtPos(value: string, index: number): boolean {
	if (index < 0 || index >= value.length) {
		return false;
	}
	const code = value.codePointAt(index);
	switch (code) {
		case CharCode.Underline:
		case CharCode.Dash:
		case CharCode.Period:
		case CharCode.Space:
		case CharCode.Slash:
		case CharCode.Backslash:
		case CharCode.SingleQuote:
		case CharCode.DoubleQuote:
		case CharCode.Colon:
		case CharCode.DollarSign:
		case CharCode.LessThan:
		case CharCode.GreaterThan:
		case CharCode.OpenParen:
		case CharCode.CloseParen:
		case CharCode.OpenSquareBracket:
		case CharCode.CloseSquareBracket:
		case CharCode.OpenCurlyBrace:
		case CharCode.CloseCurlyBrace:
			return true;
		case undefined:
			return false;
		default:
			if (strings.isEmojiImprecise(code)) {
				return true;
			}
			return false;
	}
}

function isWhitespaceAtPos(value: string, index: number): boolean {
	if (index < 0 || index >= value.length) {
		return false;
	}
	const code = value.charCodeAt(index);
	switch (code) {
		case CharCode.Space:
		case CharCode.Tab:
			return true;
		default:
			return false;
	}
}

function isUpperCaseAtPos(pos: number, word: string, wordLow: string): boolean {
	return word[pos] !== wordLow[pos];
}

export function isPatternInWord(patternLow: string, patternPos: number, patternLen: number, wordLow: string, wordPos: number, wordLen: number, fillMinWordPosArr = false): boolean {
	while (patternPos < patternLen && wordPos < wordLen) {
		if (patternLow[patternPos] === wordLow[wordPos]) {
			if (fillMinWordPosArr) {
				// Remember the min word position for each pattern position
				_minWordMatchPos[patternPos] = wordPos;
			}
			patternPos += 1;
		}
		wordPos += 1;
	}
	return patternPos === patternLen; // pattern must be exhausted
}

const enum Arrow { Diag = 1, Left = 2, LeftLeft = 3 }

/**
 * An array representing a fuzzy match.
 *
 * 0. the score
 * 1. the offset at which matching started
 * 2. `<match_pos_N>`
 * 3. `<match_pos_1>`
 * 4. `<match_pos_0>` etc
 */
export type FuzzyScore = [score: number, wordStart: number, ...matches: number[]];

export namespace FuzzyScore {
	/**
	 * No matches and value `-100`
	 */
	export const Default: FuzzyScore = ([-100, 0]);

	export function isDefault(score?: FuzzyScore): score is [-100, 0] {
		return !score || (score.length === 2 && score[0] === -100 && score[1] === 0);
	}
}

export abstract class FuzzyScoreOptions {

	static default = { boostFullMatch: true, firstMatchCanBeWeak: false };

	constructor(
		readonly firstMatchCanBeWeak: boolean,
		readonly boostFullMatch: boolean,
	) { }
}

export interface FuzzyScorer {
	(pattern: string, lowPattern: string, patternPos: number, word: string, lowWord: string, wordPos: number, options?: FuzzyScoreOptions): FuzzyScore | undefined;
}

export function fuzzyScore(pattern: string, patternLow: string, patternStart: number, word: string, wordLow: string, wordStart: number, options: FuzzyScoreOptions = FuzzyScoreOptions.default): FuzzyScore | undefined {

	const patternLen = pattern.length > _maxLen ? _maxLen : pattern.length;
	const wordLen = word.length > _maxLen ? _maxLen : word.length;

	if (patternStart >= patternLen || wordStart >= wordLen || (patternLen - patternStart) > (wordLen - wordStart)) {
		return undefined;
	}

	// Run a simple check if the characters of pattern occur
	// (in order) at all in word. If that isn't the case we
	// stop because no match will be possible
	if (!isPatternInWord(patternLow, patternStart, patternLen, wordLow, wordStart, wordLen, true)) {
		return undefined;
	}

	// Find the max matching word position for each pattern position
	// NOTE: the min matching word position was filled in above, in the `isPatternInWord` call
	_fillInMaxWordMatchPos(patternLen, wordLen, patternStart, wordStart, patternLow, wordLow);

	let row: number = 1;
	let column: number = 1;
	let patternPos = patternStart;
	let wordPos = wordStart;

	const hasStrongFirstMatch = [false];

	// There will be a match, fill in tables
	for (row = 1, patternPos = patternStart; patternPos < patternLen; row++, patternPos++) {

		// Reduce search space to possible matching word positions and to possible access from next row
		const minWordMatchPos = _minWordMatchPos[patternPos];
		const maxWordMatchPos = _maxWordMatchPos[patternPos];
		const nextMaxWordMatchPos = (patternPos + 1 < patternLen ? _maxWordMatchPos[patternPos + 1] : wordLen);

		for (column = minWordMatchPos - wordStart + 1, wordPos = minWordMatchPos; wordPos < nextMaxWordMatchPos; column++, wordPos++) {

			let score = Number.MIN_SAFE_INTEGER;
			let canComeDiag = false;

			if (wordPos <= maxWordMatchPos) {
				score = _doScore(
					pattern, patternLow, patternPos, patternStart,
					word, wordLow, wordPos, wordLen, wordStart,
					_diag[row - 1][column - 1] === 0,
					hasStrongFirstMatch
				);
			}

			let diagScore = 0;
			if (score !== Number.MIN_SAFE_INTEGER) {
				canComeDiag = true;
				diagScore = score + _table[row - 1][column - 1];
			}

			const canComeLeft = wordPos > minWordMatchPos;
			const leftScore = canComeLeft ? _table[row][column - 1] + (_diag[row][column - 1] > 0 ? -5 : 0) : 0; // penalty for a gap start

			const canComeLeftLeft = wordPos > minWordMatchPos + 1 && _diag[row][column - 1] > 0;
			const leftLeftScore = canComeLeftLeft ? _table[row][column - 2] + (_diag[row][column - 2] > 0 ? -5 : 0) : 0; // penalty for a gap start

			if (canComeLeftLeft && (!canComeLeft || leftLeftScore >= leftScore) && (!canComeDiag || leftLeftScore >= diagScore)) {
				// always prefer choosing left left to jump over a diagonal because that means a match is earlier in the word
				_table[row][column] = leftLeftScore;
				_arrows[row][column] = Arrow.LeftLeft;
				_diag[row][column] = 0;
			} else if (canComeLeft && (!canComeDiag || leftScore >= diagScore)) {
				// always prefer choosing left since that means a match is earlier in the word
				_table[row][column] = leftScore;
				_arrows[row][column] = Arrow.Left;
				_diag[row][column] = 0;
			} else if (canComeDiag) {
				_table[row][column] = diagScore;
				_arrows[row][column] = Arrow.Diag;
				_diag[row][column] = _diag[row - 1][column - 1] + 1;
			} else {
				throw new Error(`not possible`);
			}
		}
	}

	if (_debug) {
		printTables(pattern, patternStart, word, wordStart);
	}

	if (!hasStrongFirstMatch[0] && !options.firstMatchCanBeWeak) {
		return undefined;
	}

	row--;
	column--;

	const result: FuzzyScore = [_table[row][column], wordStart];

	let backwardsDiagLength = 0;
	let maxMatchColumn = 0;

	while (row >= 1) {
		// Find the column where we go diagonally up
		let diagColumn = column;
		do {
			const arrow = _arrows[row][diagColumn];
			if (arrow === Arrow.LeftLeft) {
				diagColumn = diagColumn - 2;
			} else if (arrow === Arrow.Left) {
				diagColumn = diagColumn - 1;
			} else {
				// found the diagonal
				break;
			}
		} while (diagColumn >= 1);

		// Overturn the "forwards" decision if keeping the "backwards" diagonal would give a better match
		if (
			backwardsDiagLength > 1 // only if we would have a contiguous match of 3 characters
			&& patternLow[patternStart + row - 1] === wordLow[wordStart + column - 1] // only if we can do a contiguous match diagonally
			&& !isUpperCaseAtPos(diagColumn + wordStart - 1, word, wordLow) // only if the forwards chose diagonal is not an uppercase
			&& backwardsDiagLength + 1 > _diag[row][diagColumn] // only if our contiguous match would be longer than the "forwards" contiguous match
		) {
			diagColumn = column;
		}

		if (diagColumn === column) {
			// this is a contiguous match
			backwardsDiagLength++;
		} else {
			backwardsDiagLength = 1;
		}

		if (!maxMatchColumn) {
			// remember the last matched column
			maxMatchColumn = diagColumn;
		}

		row--;
		column = diagColumn - 1;
		result.push(column);
	}

	if (wordLen - wordStart === patternLen && options.boostFullMatch) {
		// the word matches the pattern with all characters!
		// giving the score a total match boost (to come up ahead other words)
		result[0] += 2;
	}

	// Add 1 penalty for each skipped character in the word
	const skippedCharsCount = maxMatchColumn - patternLen;
	result[0] -= skippedCharsCount;

	return result;
}

function _fillInMaxWordMatchPos(patternLen: number, wordLen: number, patternStart: number, wordStart: number, patternLow: string, wordLow: string) {
	let patternPos = patternLen - 1;
	let wordPos = wordLen - 1;
	while (patternPos >= patternStart && wordPos >= wordStart) {
		if (patternLow[patternPos] === wordLow[wordPos]) {
			_maxWordMatchPos[patternPos] = wordPos;
			patternPos--;
		}
		wordPos--;
	}
}

function _doScore(
	pattern: string, patternLow: string, patternPos: number, patternStart: number,
	word: string, wordLow: string, wordPos: number, wordLen: number, wordStart: number,
	newMatchStart: boolean,
	outFirstMatchStrong: boolean[],
): number {
	if (patternLow[patternPos] !== wordLow[wordPos]) {
		return Number.MIN_SAFE_INTEGER;
	}

	let score = 1;
	let isGapLocation = false;
	if (wordPos === (patternPos - patternStart)) {
		// common prefix: `foobar <-> foobaz`
		//                            ^^^^^
		score = pattern[patternPos] === word[wordPos] ? 7 : 5;

	} else if (isUpperCaseAtPos(wordPos, word, wordLow) && (wordPos === 0 || !isUpperCaseAtPos(wordPos - 1, word, wordLow))) {
		// hitting upper-case: `foo <-> forOthers`
		//                              ^^ ^
		score = pattern[patternPos] === word[wordPos] ? 7 : 5;
		isGapLocation = true;

	} else if (isSeparatorAtPos(wordLow, wordPos) && (wordPos === 0 || !isSeparatorAtPos(wordLow, wordPos - 1))) {
		// hitting a separator: `. <-> foo.bar`
		//                                ^
		score = 5;

	} else if (isSeparatorAtPos(wordLow, wordPos - 1) || isWhitespaceAtPos(wordLow, wordPos - 1)) {
		// post separator: `foo <-> bar_foo`
		//                              ^^^
		score = 5;
		isGapLocation = true;
	}

	if (score > 1 && patternPos === patternStart) {
		outFirstMatchStrong[0] = true;
	}

	if (!isGapLocation) {
		isGapLocation = isUpperCaseAtPos(wordPos, word, wordLow) || isSeparatorAtPos(wordLow, wordPos - 1) || isWhitespaceAtPos(wordLow, wordPos - 1);
	}

	//
	if (patternPos === patternStart) { // first character in pattern
		if (wordPos > wordStart) {
			// the first pattern character would match a word character that is not at the word start
			// so introduce a penalty to account for the gap preceding this match
			score -= isGapLocation ? 3 : 5;
		}
	} else {
		if (newMatchStart) {
			// this would be the beginning of a new match (i.e. there would be a gap before this location)
			score += isGapLocation ? 2 : 0;
		} else {
			// this is part of a contiguous match, so give it a slight bonus, but do so only if it would not be a preferred gap location
			score += isGapLocation ? 0 : 1;
		}
	}

	if (wordPos + 1 === wordLen) {
		// we always penalize gaps, but this gives unfair advantages to a match that would match the last character in the word
		// so pretend there is a gap after the last character in the word to normalize things
		score -= isGapLocation ? 3 : 5;
	}

	return score;
}

//#endregion


//#region --- graceful ---

export function fuzzyScoreGracefulAggressive(pattern: string, lowPattern: string, patternPos: number, word: string, lowWord: string, wordPos: number, options?: FuzzyScoreOptions): FuzzyScore | undefined {
	return fuzzyScoreWithPermutations(pattern, lowPattern, patternPos, word, lowWord, wordPos, true, options);
}

export function fuzzyScoreGraceful(pattern: string, lowPattern: string, patternPos: number, word: string, lowWord: string, wordPos: number, options?: FuzzyScoreOptions): FuzzyScore | undefined {
	return fuzzyScoreWithPermutations(pattern, lowPattern, patternPos, word, lowWord, wordPos, false, options);
}

function fuzzyScoreWithPermutations(pattern: string, lowPattern: string, patternPos: number, word: string, lowWord: string, wordPos: number, aggressive: boolean, options?: FuzzyScoreOptions): FuzzyScore | undefined {
	let top = fuzzyScore(pattern, lowPattern, patternPos, word, lowWord, wordPos, options);

	if (top && !aggressive) {
		// when using the original pattern yield a result we`
		// return it unless we are aggressive and try to find
		// a better alignment, e.g. `cno` -> `^co^ns^ole` or `^c^o^nsole`.
		return top;
	}

	if (pattern.length >= 3) {
		// When the pattern is long enough then try a few (max 7)
		// permutations of the pattern to find a better match. The
		// permutations only swap neighbouring characters, e.g
		// `cnoso` becomes `conso`, `cnsoo`, `cnoos`.
		const tries = Math.min(7, pattern.length - 1);
		for (let movingPatternPos = patternPos + 1; movingPatternPos < tries; movingPatternPos++) {
			const newPattern = nextTypoPermutation(pattern, movingPatternPos);
			if (newPattern) {
				const candidate = fuzzyScore(newPattern, newPattern.toLowerCase(), patternPos, word, lowWord, wordPos, options);
				if (candidate) {
					candidate[0] -= 3; // permutation penalty
					if (!top || candidate[0] > top[0]) {
						top = candidate;
					}
				}
			}
		}
	}

	return top;
}

function nextTypoPermutation(pattern: string, patternPos: number): string | undefined {

	if (patternPos + 1 >= pattern.length) {
		return undefined;
	}

	const swap1 = pattern[patternPos];
	const swap2 = pattern[patternPos + 1];

	if (swap1 === swap2) {
		return undefined;
	}

	return pattern.slice(0, patternPos)
		+ swap2
		+ swap1
		+ pattern.slice(patternPos + 2);
}

//#endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/functional.ts]---
Location: vscode-main/src/vs/base/common/functional.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Given a function, returns a function that is only calling that function once.
 */
export function createSingleCallFunction<T extends Function>(this: unknown, fn: T, fnDidRunCallback?: () => void): T {
	const _this = this;
	let didCall = false;
	let result: unknown;

	return function () {
		if (didCall) {
			return result;
		}

		didCall = true;
		if (fnDidRunCallback) {
			try {
				result = fn.apply(_this, arguments);
			} finally {
				fnDidRunCallback();
			}
		} else {
			result = fn.apply(_this, arguments);
		}

		return result;
	} as unknown as T;
}
```

--------------------------------------------------------------------------------

````
