---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 470
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 470 of 552)

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

---[FILE: src/vs/workbench/contrib/terminalContrib/links/browser/terminalLinkParsing.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/links/browser/terminalLinkParsing.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * This module is responsible for parsing possible links out of lines with only access to the line
 * text and the target operating system, ie. it does not do any validation that paths actually
 * exist.
 */

import { Lazy } from '../../../../../base/common/lazy.js';
import { OperatingSystem } from '../../../../../base/common/platform.js';

export interface IParsedLink {
	path: ILinkPartialRange;
	prefix?: ILinkPartialRange;
	suffix?: ILinkSuffix;
}

export interface ILinkSuffix {
	row: number | undefined;
	col: number | undefined;
	rowEnd: number | undefined;
	colEnd: number | undefined;
	suffix: ILinkPartialRange;
}

export interface ILinkPartialRange {
	index: number;
	text: string;
}

/**
 * A regex that extracts the link suffix which contains line and column information. The link suffix
 * must terminate at the end of line.
 */
const linkSuffixRegexEol = new Lazy<RegExp>(() => generateLinkSuffixRegex(true));
/**
 * A regex that extracts the link suffix which contains line and column information.
 */
const linkSuffixRegex = new Lazy<RegExp>(() => generateLinkSuffixRegex(false));

function generateLinkSuffixRegex(eolOnly: boolean) {
	let ri = 0;
	let ci = 0;
	let rei = 0;
	let cei = 0;
	function r(): string {
		return `(?<row${ri++}>\\d+)`;
	}
	function c(): string {
		return `(?<col${ci++}>\\d+)`;
	}
	function re(): string {
		return `(?<rowEnd${rei++}>\\d+)`;
	}
	function ce(): string {
		return `(?<colEnd${cei++}>\\d+)`;
	}

	const eolSuffix = eolOnly ? '$' : '';

	// The comments in the regex below use real strings/numbers for better readability, here's
	// the legend:
	// - Path    = foo
	// - Row     = 339
	// - Col     = 12
	// - RowEnd  = 341
	// - ColEnd  = 789
	//
	// These all support single quote ' in the place of " and [] in the place of ()
	//
	// See the tests for an exhaustive list of all supported formats
	const lineAndColumnRegexClauses = [
		// foo:339
		// foo:339:12
		// foo:339:12-789
		// foo:339:12-341.789
		// foo:339.12
		// foo 339
		// foo 339:12                              [#140780]
		// foo 339.12
		// foo#339
		// foo#339:12                              [#190288]
		// foo#339.12
		// foo, 339                                [#217927]
		// "foo",339
		// "foo",339:12
		// "foo",339.12
		// "foo",339.12-789
		// "foo",339.12-341.789
		`(?::|#| |['"],|, )${r()}([:.]${c()}(?:-(?:${re()}\\.)?${ce()})?)?` + eolSuffix,
		// The quotes below are optional           [#171652]
		// "foo", line 339                         [#40468]
		// "foo", line 339, col 12
		// "foo", line 339, column 12
		// "foo":line 339
		// "foo":line 339, col 12
		// "foo":line 339, column 12
		// "foo": line 339
		// "foo": line 339, col 12
		// "foo": line 339, column 12
		// "foo" on line 339
		// "foo" on line 339, col 12
		// "foo" on line 339, column 12
		// "foo" line 339 column 12
		// "foo", line 339, character 12           [#171880]
		// "foo", line 339, characters 12-789      [#171880]
		// "foo", lines 339-341                    [#171880]
		// "foo", lines 339-341, characters 12-789 [#178287]
		`['"]?(?:,? |: ?| on )lines? ${r()}(?:-${re()})?(?:,? (?:col(?:umn)?|characters?) ${c()}(?:-${ce()})?)?` + eolSuffix,
		// () and [] are interchangeable
		// foo(339)
		// foo(339,12)
		// foo(339, 12)
		// foo (339)
		// foo (339,12)
		// foo (339, 12)
		// foo: (339)
		// foo: (339,12)
		// foo: (339, 12)
		// foo(339:12)                             [#229842]
		// foo (339:12)                            [#229842]
		`:? ?[\\[\\(]${r()}(?:(?:, ?|:)${c()})?[\\]\\)]` + eolSuffix,
	];

	const suffixClause = lineAndColumnRegexClauses
		// Join all clauses together
		.join('|')
		// Convert spaces to allow the non-breaking space char (ascii 160)
		.replace(/ /g, `[${'\u00A0'} ]`);

	return new RegExp(`(${suffixClause})`, eolOnly ? undefined : 'g');
}

/**
 * Removes the optional link suffix which contains line and column information.
 * @param link The link to use.
 */
export function removeLinkSuffix(link: string): string {
	const suffix = getLinkSuffix(link)?.suffix;
	if (!suffix) {
		return link;
	}
	return link.substring(0, suffix.index);
}

/**
 * Removes any query string from the link.
 * @param link The link to use.
 */
export function removeLinkQueryString(link: string): string {
	// Skip ? in UNC paths
	const start = link.startsWith('\\\\?\\') ? 4 : 0;
	const index = link.indexOf('?', start);
	if (index === -1) {
		return link;
	}
	return link.substring(0, index);
}

export function detectLinkSuffixes(line: string): ILinkSuffix[] {
	// Find all suffixes on the line. Since the regex global flag is used, lastIndex will be updated
	// in place such that there are no overlapping matches.
	let match: RegExpExecArray | null;
	const results: ILinkSuffix[] = [];
	linkSuffixRegex.value.lastIndex = 0;
	while ((match = linkSuffixRegex.value.exec(line)) !== null) {
		const suffix = toLinkSuffix(match);
		if (suffix === null) {
			break;
		}
		results.push(suffix);
	}
	return results;
}

/**
 * Returns the optional link suffix which contains line and column information.
 * @param link The link to parse.
 */
export function getLinkSuffix(link: string): ILinkSuffix | null {
	return toLinkSuffix(linkSuffixRegexEol.value.exec(link));
}

export function toLinkSuffix(match: RegExpExecArray | null): ILinkSuffix | null {
	const groups = match?.groups;
	if (!groups || match.length < 1) {
		return null;
	}
	return {
		row: parseIntOptional(groups.row0 || groups.row1 || groups.row2),
		col: parseIntOptional(groups.col0 || groups.col1 || groups.col2),
		rowEnd: parseIntOptional(groups.rowEnd0 || groups.rowEnd1 || groups.rowEnd2),
		colEnd: parseIntOptional(groups.colEnd0 || groups.colEnd1 || groups.colEnd2),
		suffix: { index: match.index, text: match[0] }
	};
}

function parseIntOptional(value: string | undefined): number | undefined {
	if (value === undefined) {
		return value;
	}
	return parseInt(value);
}

// This defines valid path characters for a link with a suffix, the first `[]` of the regex includes
// characters the path is not allowed to _start_ with, the second `[]` includes characters not
// allowed at all in the path. If the characters show up in both regexes the link will stop at that
// character, otherwise it will stop at a space character.
const linkWithSuffixPathCharacters = /(?<path>(?:file:\/\/\/)?[^\s\|<>\[\({][^\s\|<>]*)$/;

export function detectLinks(line: string, os: OperatingSystem) {
	// 1: Detect all links on line via suffixes first
	const results = detectLinksViaSuffix(line);

	// 2: Detect all links without suffixes and merge non-conflicting ranges into the results
	const noSuffixPaths = detectPathsNoSuffix(line, os);
	binaryInsertList(results, noSuffixPaths);

	return results;
}

function binaryInsertList(list: IParsedLink[], newItems: IParsedLink[]) {
	if (list.length === 0) {
		list.push(...newItems);
	}
	for (const item of newItems) {
		binaryInsert(list, item, 0, list.length);
	}
}

function binaryInsert(list: IParsedLink[], newItem: IParsedLink, low: number, high: number) {
	if (list.length === 0) {
		list.push(newItem);
		return;
	}
	if (low > high) {
		return;
	}
	// Find the index where the newItem would be inserted
	const mid = Math.floor((low + high) / 2);
	if (
		mid >= list.length ||
		(newItem.path.index < list[mid].path.index && (mid === 0 || newItem.path.index > list[mid - 1].path.index))
	) {
		// Check if it conflicts with an existing link before adding
		if (
			mid >= list.length ||
			(newItem.path.index + newItem.path.text.length < list[mid].path.index && (mid === 0 || newItem.path.index > list[mid - 1].path.index + list[mid - 1].path.text.length))
		) {
			list.splice(mid, 0, newItem);
		}
		return;
	}
	if (newItem.path.index > list[mid].path.index) {
		binaryInsert(list, newItem, mid + 1, high);
	} else {
		binaryInsert(list, newItem, low, mid - 1);
	}
}

function detectLinksViaSuffix(line: string): IParsedLink[] {
	const results: IParsedLink[] = [];

	// 1: Detect link suffixes on the line
	const suffixes = detectLinkSuffixes(line);
	for (const suffix of suffixes) {
		const beforeSuffix = line.substring(0, suffix.suffix.index);
		const possiblePathMatch = beforeSuffix.match(linkWithSuffixPathCharacters);
		if (possiblePathMatch && possiblePathMatch.index !== undefined && possiblePathMatch.groups?.path) {
			let linkStartIndex = possiblePathMatch.index;
			let path = possiblePathMatch.groups.path;
			// Extract a path prefix if it exists (not part of the path, but part of the underlined
			// section)
			let prefix: ILinkPartialRange | undefined = undefined;
			const prefixMatch = path.match(/^(?<prefix>['"]+)/);
			if (prefixMatch?.groups?.prefix) {
				prefix = {
					index: linkStartIndex,
					text: prefixMatch.groups.prefix
				};
				path = path.substring(prefix.text.length);

				// Don't allow suffix links to be returned when the link itself is the empty string
				if (path.trim().length === 0) {
					continue;
				}

				// If there are multiple characters in the prefix, trim the prefix if the _first_
				// suffix character is the same as the last prefix character. For example, for the
				// text `echo "'foo' on line 1"`:
				//
				// - Prefix='
				// - Path=foo
				// - Suffix=' on line 1
				//
				// If this fails on a multi-character prefix, just keep the original.
				if (prefixMatch.groups.prefix.length > 1) {
					if (suffix.suffix.text[0].match(/['"]/) && prefixMatch.groups.prefix[prefixMatch.groups.prefix.length - 1] === suffix.suffix.text[0]) {
						const trimPrefixAmount = prefixMatch.groups.prefix.length - 1;
						prefix.index += trimPrefixAmount;
						prefix.text = prefixMatch.groups.prefix[prefixMatch.groups.prefix.length - 1];
						linkStartIndex += trimPrefixAmount;
					}
				}
			}
			results.push({
				path: {
					index: linkStartIndex + (prefix?.text.length || 0),
					text: path
				},
				prefix,
				suffix
			});

			// If the path contains an opening bracket, provide the path starting immediately after
			// the opening bracket as an additional result
			const openingBracketMatch = path.matchAll(/(?<bracket>[\[\(])(?![\]\)])/g);
			for (const match of openingBracketMatch) {
				const bracket = match.groups?.bracket;
				if (bracket) {
					results.push({
						path: {
							index: linkStartIndex + (prefix?.text.length || 0) + match.index + 1,
							text: path.substring(match.index + bracket.length)
						},
						prefix,
						suffix
					});
				}
			}
		}
	}

	return results;
}

enum RegexPathConstants {
	PathPrefix = '(?:\\.\\.?|\\~|file:\/\/)',
	PathSeparatorClause = '\\/',
	// '":; are allowed in paths but they are often separators so ignore them
	// Also disallow \\ to prevent a catastropic backtracking case #24795
	ExcludedPathCharactersClause = '[^\\0<>\\?\\s!`&*()\'":;\\\\]',
	ExcludedStartPathCharactersClause = '[^\\0<>\\?\\s!`&*()\\[\\]\'":;\\\\]',

	WinOtherPathPrefix = '\\.\\.?|\\~',
	WinPathSeparatorClause = '(?:\\\\|\\/)',
	WinExcludedPathCharactersClause = '[^\\0<>\\?\\|\\/\\s!`&*()\'":;]',
	WinExcludedStartPathCharactersClause = '[^\\0<>\\?\\|\\/\\s!`&*()\\[\\]\'":;]',
}

/**
 * A regex that matches non-Windows paths, such as `/foo`, `~/foo`, `./foo`, `../foo` and
 * `foo/bar`.
 */
const unixLocalLinkClause = '(?:(?:' + RegexPathConstants.PathPrefix + '|(?:' + RegexPathConstants.ExcludedStartPathCharactersClause + RegexPathConstants.ExcludedPathCharactersClause + '*))?(?:' + RegexPathConstants.PathSeparatorClause + '(?:' + RegexPathConstants.ExcludedPathCharactersClause + ')+)+)';

/**
 * A regex clause that matches the start of an absolute path on Windows, such as: `C:`, `c:`,
 * `file:///c:` (uri) and `\\?\C:` (UNC path).
 */
export const winDrivePrefix = '(?:\\\\\\\\\\?\\\\|file:\\/\\/\\/)?[a-zA-Z]:';

/**
 * A regex that matches Windows paths, such as `\\?\c:\foo`, `c:\foo`, `~\foo`, `.\foo`, `..\foo`
 * and `foo\bar`.
 */
const winLocalLinkClause = '(?:(?:' + `(?:${winDrivePrefix}|${RegexPathConstants.WinOtherPathPrefix})` + '|(?:' + RegexPathConstants.WinExcludedStartPathCharactersClause + RegexPathConstants.WinExcludedPathCharactersClause + '*))?(?:' + RegexPathConstants.WinPathSeparatorClause + '(?:' + RegexPathConstants.WinExcludedPathCharactersClause + ')+)+)';

function detectPathsNoSuffix(line: string, os: OperatingSystem): IParsedLink[] {
	const results: IParsedLink[] = [];

	const regex = new RegExp(os === OperatingSystem.Windows ? winLocalLinkClause : unixLocalLinkClause, 'g');
	let match;
	while ((match = regex.exec(line)) !== null) {
		let text = match[0];
		let index = match.index;
		if (!text) {
			// Something matched but does not comply with the given match index, since this would
			// most likely a bug the regex itself we simply do nothing here
			break;
		}

		// Adjust the link range to exclude a/ and b/ if it looks like a git diff
		if (
			// --- a/foo/bar
			// +++ b/foo/bar
			((line.startsWith('--- a/') || line.startsWith('+++ b/')) && index === 4) ||
			// diff --git a/foo/bar b/foo/bar
			(line.startsWith('diff --git') && (text.startsWith('a/') || text.startsWith('b/')))
		) {
			text = text.substring(2);
			index += 2;
		}

		results.push({
			path: {
				index,
				text
			},
			prefix: undefined,
			suffix: undefined
		});
	}

	return results;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/links/browser/terminalLinkProviderService.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/links/browser/terminalLinkProviderService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ITerminalExternalLinkProvider } from '../../../terminal/browser/terminal.js';
import { ITerminalLinkProviderService } from './links.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { IDisposable } from '../../../../../base/common/lifecycle.js';

export class TerminalLinkProviderService implements ITerminalLinkProviderService {
	declare _serviceBrand: undefined;

	private _linkProviders = new Set<ITerminalExternalLinkProvider>();
	get linkProviders(): ReadonlySet<ITerminalExternalLinkProvider> { return this._linkProviders; }

	private readonly _onDidAddLinkProvider = new Emitter<ITerminalExternalLinkProvider>();
	get onDidAddLinkProvider(): Event<ITerminalExternalLinkProvider> { return this._onDidAddLinkProvider.event; }
	private readonly _onDidRemoveLinkProvider = new Emitter<ITerminalExternalLinkProvider>();
	get onDidRemoveLinkProvider(): Event<ITerminalExternalLinkProvider> { return this._onDidRemoveLinkProvider.event; }

	registerLinkProvider(linkProvider: ITerminalExternalLinkProvider): IDisposable {
		const disposables: IDisposable[] = [];
		this._linkProviders.add(linkProvider);
		this._onDidAddLinkProvider.fire(linkProvider);
		return {
			dispose: () => {
				for (const disposable of disposables) {
					disposable.dispose();
				}
				this._linkProviders.delete(linkProvider);
				this._onDidRemoveLinkProvider.fire(linkProvider);
			}
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/links/browser/terminalLinkQuickpick.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/links/browser/terminalLinkQuickpick.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { EventType } from '../../../../../base/browser/dom.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { localize } from '../../../../../nls.js';
import { QuickPickItem, IQuickInputService, IQuickPickItem, QuickInputHideReason } from '../../../../../platform/quickinput/common/quickInput.js';
import { IDetectedLinks } from './terminalLinkManager.js';
import { TerminalLinkQuickPickEvent, type IDetachedTerminalInstance, type ITerminalInstance } from '../../../terminal/browser/terminal.js';
import type { ILink } from '@xterm/xterm';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import type { TerminalLink } from './terminalLink.js';
import { Sequencer, timeout } from '../../../../../base/common/async.js';
import { PickerEditorState } from '../../../../browser/quickaccess.js';
import { getLinkSuffix } from './terminalLinkParsing.js';
import { TerminalBuiltinLinkType } from './links.js';
import { ILabelService } from '../../../../../platform/label/common/label.js';
import { basenameOrAuthority, dirname } from '../../../../../base/common/resources.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { AccessibleViewProviderId, IAccessibleViewService } from '../../../../../platform/accessibility/browser/accessibleView.js';
import { hasKey } from '../../../../../base/common/types.js';

export class TerminalLinkQuickpick extends DisposableStore {

	private readonly _editorSequencer = new Sequencer();
	private readonly _editorViewState: PickerEditorState;

	private _instance: ITerminalInstance | IDetachedTerminalInstance | undefined;

	private readonly _onDidRequestMoreLinks = this.add(new Emitter<void>());
	readonly onDidRequestMoreLinks = this._onDidRequestMoreLinks.event;

	constructor(
		@IAccessibleViewService private readonly _accessibleViewService: IAccessibleViewService,
		@IInstantiationService instantiationService: IInstantiationService,
		@ILabelService private readonly _labelService: ILabelService,
		@IQuickInputService private readonly _quickInputService: IQuickInputService,
	) {
		super();
		this._editorViewState = this.add(instantiationService.createInstance(PickerEditorState));
	}

	async show(instance: ITerminalInstance | IDetachedTerminalInstance, links: { viewport: IDetectedLinks; all: Promise<IDetectedLinks> }): Promise<void> {
		this._instance = instance;

		// Allow all links a small amount of time to elapse to finish, if this is not done in this
		// time they will be loaded upon the first filter.
		const result = await Promise.race([links.all, timeout(500)]);
		const usingAllLinks = typeof result === 'object';
		const resolvedLinks = usingAllLinks ? result : links.viewport;

		// Get raw link picks
		const wordPicks = resolvedLinks.wordLinks ? await this._generatePicks(resolvedLinks.wordLinks) : undefined;
		const filePicks = resolvedLinks.fileLinks ? await this._generatePicks(resolvedLinks.fileLinks) : undefined;
		const folderPicks = resolvedLinks.folderLinks ? await this._generatePicks(resolvedLinks.folderLinks) : undefined;
		const webPicks = resolvedLinks.webLinks ? await this._generatePicks(resolvedLinks.webLinks) : undefined;

		const picks: LinkQuickPickItem[] = [];
		if (webPicks) {
			picks.push({ type: 'separator', label: localize('terminal.integrated.urlLinks', "Url") });
			picks.push(...webPicks);
		}
		if (filePicks) {
			picks.push({ type: 'separator', label: localize('terminal.integrated.localFileLinks', "File") });
			picks.push(...filePicks);
		}
		if (folderPicks) {
			picks.push({ type: 'separator', label: localize('terminal.integrated.localFolderLinks', "Folder") });
			picks.push(...folderPicks);
		}
		if (wordPicks) {
			picks.push({ type: 'separator', label: localize('terminal.integrated.searchLinks', "Workspace Search") });
			picks.push(...wordPicks);
		}

		// Create and show quick pick
		const pick = this._quickInputService.createQuickPick<IQuickPickItem | ITerminalLinkQuickPickItem>({ useSeparators: true });
		const disposables = new DisposableStore();
		disposables.add(pick);
		pick.items = picks;
		pick.placeholder = localize('terminal.integrated.openDetectedLink', "Select the link to open, type to filter all links");
		pick.sortByLabel = false;
		pick.show();
		if (pick.activeItems.length > 0) {
			this._previewItem(pick.activeItems[0]);
		}

		// Show all results only when filtering begins, this is done so the quick pick will show up
		// ASAP with only the viewport entries.
		let accepted = false;
		if (!usingAllLinks) {
			disposables.add(Event.once(pick.onDidChangeValue)(async () => {
				const allLinks = await links.all;
				if (accepted) {
					return;
				}
				const wordIgnoreLinks = [...(allLinks.fileLinks ?? []), ...(allLinks.folderLinks ?? []), ...(allLinks.webLinks ?? [])];

				const wordPicks = allLinks.wordLinks ? await this._generatePicks(allLinks.wordLinks, wordIgnoreLinks) : undefined;
				const filePicks = allLinks.fileLinks ? await this._generatePicks(allLinks.fileLinks) : undefined;
				const folderPicks = allLinks.folderLinks ? await this._generatePicks(allLinks.folderLinks) : undefined;
				const webPicks = allLinks.webLinks ? await this._generatePicks(allLinks.webLinks) : undefined;
				const picks: LinkQuickPickItem[] = [];
				if (webPicks) {
					picks.push({ type: 'separator', label: localize('terminal.integrated.urlLinks', "Url") });
					picks.push(...webPicks);
				}
				if (filePicks) {
					picks.push({ type: 'separator', label: localize('terminal.integrated.localFileLinks', "File") });
					picks.push(...filePicks);
				}
				if (folderPicks) {
					picks.push({ type: 'separator', label: localize('terminal.integrated.localFolderLinks', "Folder") });
					picks.push(...folderPicks);
				}
				if (wordPicks) {
					picks.push({ type: 'separator', label: localize('terminal.integrated.searchLinks', "Workspace Search") });
					picks.push(...wordPicks);
				}
				pick.items = picks;
			}));
		}

		disposables.add(pick.onDidChangeActive(async () => {
			const [item] = pick.activeItems;
			this._previewItem(item);
		}));

		return new Promise(r => {
			disposables.add(pick.onDidHide(({ reason }) => {

				// Restore terminal scroll state
				if (this._terminalScrollStateSaved) {
					const markTracker = this._instance?.xterm?.markTracker;
					if (markTracker) {
						markTracker.restoreScrollState();
						markTracker.clear();
						this._terminalScrollStateSaved = false;
					}
				}

				// Restore view state upon cancellation if we changed it
				// but only when the picker was closed via explicit user
				// gesture and not e.g. when focus was lost because that
				// could mean the user clicked into the editor directly.
				if (reason === QuickInputHideReason.Gesture) {
					this._editorViewState.restore();
				}
				disposables.dispose();
				if (pick.selectedItems.length === 0) {
					this._accessibleViewService.showLastProvider(AccessibleViewProviderId.Terminal);
				}
				r();
			}));
			disposables.add(Event.once(pick.onDidAccept)(() => {
				// Restore terminal scroll state
				if (this._terminalScrollStateSaved) {
					const markTracker = this._instance?.xterm?.markTracker;
					if (markTracker) {
						markTracker.restoreScrollState();
						markTracker.clear();
						this._terminalScrollStateSaved = false;
					}
				}

				accepted = true;
				const event = new TerminalLinkQuickPickEvent(EventType.CLICK);
				const activeItem = pick.activeItems?.[0];
				if (activeItem && hasKey(activeItem, { link: true })) {
					activeItem.link.activate(event, activeItem.label);
				}
				disposables.dispose();
				r();
			}));
		});
	}

	/**
	 * @param ignoreLinks Links with labels to not include in the picks.
	 */
	private async _generatePicks(links: (ILink | TerminalLink)[], ignoreLinks?: ILink[]): Promise<ITerminalLinkQuickPickItem[] | undefined> {
		if (!links) {
			return;
		}
		const linkTextKeys: Set<string> = new Set();
		const linkUriKeys: Set<string> = new Set();
		const picks: ITerminalLinkQuickPickItem[] = [];
		for (const link of links) {
			let label = link.text;
			if (!linkTextKeys.has(label) && (!ignoreLinks || !ignoreLinks.some(e => e.text === label))) {
				linkTextKeys.add(label);

				// Add a consistently formatted resolved URI label to the description if applicable
				let description: string | undefined;
				if (hasKey(link, { uri: true }) && link.uri) {
					// For local files and folders, mimic the presentation of go to file
					if (
						link.type === TerminalBuiltinLinkType.LocalFile ||
						link.type === TerminalBuiltinLinkType.LocalFolderInWorkspace ||
						link.type === TerminalBuiltinLinkType.LocalFolderOutsideWorkspace
					) {
						label = basenameOrAuthority(link.uri);
						description = this._labelService.getUriLabel(dirname(link.uri), { relative: true });
					}

					// Add line and column numbers to the label if applicable
					if (link.type === TerminalBuiltinLinkType.LocalFile) {
						if (link.parsedLink?.suffix?.row !== undefined) {
							label += `:${link.parsedLink.suffix.row}`;
							if (link.parsedLink?.suffix?.rowEnd !== undefined) {
								label += `-${link.parsedLink.suffix.rowEnd}`;
							}
							if (link.parsedLink?.suffix?.col !== undefined) {
								label += `:${link.parsedLink.suffix.col}`;
								if (link.parsedLink?.suffix?.colEnd !== undefined) {
									label += `-${link.parsedLink.suffix.colEnd}`;
								}
							}
						}
					}

					// Skip the link if it's a duplicate URI + line/col
					if (linkUriKeys.has(label + '|' + (description ?? ''))) {
						continue;
					}
					linkUriKeys.add(label + '|' + (description ?? ''));
				}

				picks.push({ label, link, description });
			}
		}
		return picks.length > 0 ? picks : undefined;
	}

	private _previewItem(item: ITerminalLinkQuickPickItem | IQuickPickItem) {
		if (!item || !hasKey(item, { link: true }) || !item.link) {
			return;
		}

		// Any link can be previewed in the termninal
		const link = item.link;
		this._previewItemInTerminal(link);

		if (!hasKey(link, { uri: true }) || !link.uri) {
			return;
		}

		if (link.type !== TerminalBuiltinLinkType.LocalFile) {
			return;
		}

		this._previewItemInEditor(link);
	}

	private _previewItemInEditor(link: TerminalLink) {
		const linkSuffix = link.parsedLink ? link.parsedLink.suffix : getLinkSuffix(link.text);
		const selection = linkSuffix?.row === undefined ? undefined : {
			startLineNumber: linkSuffix.row ?? 1,
			startColumn: linkSuffix.col ?? 1,
			endLineNumber: linkSuffix.rowEnd,
			endColumn: linkSuffix.colEnd
		};

		this._editorViewState.set();
		this._editorSequencer.queue(async () => {
			await this._editorViewState.openTransientEditor({
				resource: link.uri,
				options: { preserveFocus: true, revealIfOpened: true, ignoreError: true, selection }
			});
		});
	}

	private _terminalScrollStateSaved: boolean = false;
	private _previewItemInTerminal(link: ILink) {
		const xterm = this._instance?.xterm;
		if (!xterm) {
			return;
		}
		if (!this._terminalScrollStateSaved) {
			xterm.markTracker.saveScrollState();
			this._terminalScrollStateSaved = true;
		}
		xterm.markTracker.revealRange(link.range);
	}
}

export interface ITerminalLinkQuickPickItem extends IQuickPickItem {
	link: ILink | TerminalLink;
}

type LinkQuickPickItem = ITerminalLinkQuickPickItem | QuickPickItem;
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/links/browser/terminalLinkResolver.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/links/browser/terminalLinkResolver.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ITerminalLinkResolver, ResolvedLink } from './links.js';
import { removeLinkSuffix, removeLinkQueryString, winDrivePrefix } from './terminalLinkParsing.js';
import { URI } from '../../../../../base/common/uri.js';
import { ITerminalProcessManager } from '../../../terminal/common/terminal.js';
import { Schemas } from '../../../../../base/common/network.js';
import { isWindows, OperatingSystem, OS } from '../../../../../base/common/platform.js';
import { IFileService } from '../../../../../platform/files/common/files.js';
import { IPath, posix, win32 } from '../../../../../base/common/path.js';
import { ITerminalBackend } from '../../../../../platform/terminal/common/terminal.js';
import { mainWindow } from '../../../../../base/browser/window.js';

export class TerminalLinkResolver implements ITerminalLinkResolver {
	// Link cache could be shared across all terminals, but that could lead to weird results when
	// both local and remote terminals are present
	private readonly _resolvedLinkCaches: Map<string, LinkCache> = new Map();

	constructor(
		@IFileService private readonly _fileService: IFileService,
	) {
	}

	async resolveLink(processManager: Pick<ITerminalProcessManager, 'initialCwd' | 'os' | 'remoteAuthority' | 'userHome'> & { backend?: Pick<ITerminalBackend, 'getWslPath'> }, link: string, uri?: URI): Promise<ResolvedLink> {
		// Correct scheme and authority for remote terminals
		if (uri && uri.scheme === Schemas.file && processManager.remoteAuthority) {
			uri = uri.with({
				scheme: Schemas.vscodeRemote,
				authority: processManager.remoteAuthority
			});
		}

		// Get the link cache
		let cache = this._resolvedLinkCaches.get(processManager.remoteAuthority ?? '');
		if (!cache) {
			cache = new LinkCache();
			this._resolvedLinkCaches.set(processManager.remoteAuthority ?? '', cache);
		}

		// Check resolved link cache first
		const cached = cache.get(uri || link);
		if (cached !== undefined) {
			return cached;
		}

		if (uri) {
			try {
				const stat = await this._fileService.stat(uri);
				const result = { uri, link, isDirectory: stat.isDirectory };
				cache.set(uri, result);
				return result;
			}
			catch (e) {
				// Does not exist
				cache.set(uri, null);
				return null;
			}
		}

		// Remove any line/col suffix
		let linkUrl = removeLinkSuffix(link);

		// Remove any query string
		linkUrl = removeLinkQueryString(linkUrl);

		// Exit early if the link is determines as not valid already
		if (linkUrl.length === 0) {
			cache.set(link, null);
			return null;
		}

		// If the link looks like a /mnt/ WSL path and this is a Windows frontend, use the backend
		// to get the resolved path from the wslpath util.
		if (isWindows && link.match(/^\/mnt\/[a-z]/i) && processManager.backend) {
			linkUrl = await processManager.backend.getWslPath(linkUrl, 'unix-to-win');
		}
		// Skip preprocessing if it looks like a special Windows -> WSL link
		else if (isWindows && link.match(/^(?:\/\/|\\\\)wsl(?:\$|\.localhost)(\/|\\)/)) {
			// No-op, it's already the right format
		}
		// Handle all non-WSL links
		else {
			const preprocessedLink = this._preprocessPath(linkUrl, processManager.initialCwd, processManager.os, processManager.userHome);
			if (!preprocessedLink) {
				cache.set(link, null);
				return null;
			}
			linkUrl = preprocessedLink;
		}

		try {
			let uri: URI;
			if (processManager.remoteAuthority) {
				uri = URI.from({
					scheme: Schemas.vscodeRemote,
					authority: processManager.remoteAuthority,
					path: linkUrl
				});
			} else {
				uri = URI.file(linkUrl);
			}

			try {
				const stat = await this._fileService.stat(uri);
				const result = { uri, link, isDirectory: stat.isDirectory };
				cache.set(link, result);
				return result;
			}
			catch (e) {
				// Does not exist
				cache.set(link, null);
				return null;
			}
		} catch {
			// Errors in parsing the path
			cache.set(link, null);
			return null;
		}
	}

	protected _preprocessPath(link: string, initialCwd: string, os: OperatingSystem | undefined, userHome: string | undefined): string | null {
		const osPath = this._getOsPath(os);
		if (link.charAt(0) === '~') {
			// Resolve ~ -> userHome
			if (!userHome) {
				return null;
			}
			link = osPath.join(userHome, link.substring(1));
		} else if (link.charAt(0) !== '/' && link.charAt(0) !== '~') {
			// Resolve workspace path . | .. | <relative_path> -> <path>/. | <path>/.. | <path>/<relative_path>
			if (os === OperatingSystem.Windows) {
				if (!link.match('^' + winDrivePrefix) && !link.startsWith('\\\\?\\')) {
					if (!initialCwd) {
						// Abort if no workspace is open
						return null;
					}
					link = osPath.join(initialCwd, link);
				} else {
					// Remove \\?\ from paths so that they share the same underlying
					// uri and don't open multiple tabs for the same file
					link = link.replace(/^\\\\\?\\/, '');
				}
			} else {
				if (!initialCwd) {
					// Abort if no workspace is open
					return null;
				}
				link = osPath.join(initialCwd, link);
			}
		}
		link = osPath.normalize(link);

		return link;
	}

	private _getOsPath(os: OperatingSystem | undefined): IPath {
		return (os ?? OS) === OperatingSystem.Windows ? win32 : posix;
	}
}

const enum LinkCacheConstants {
	/**
	 * How long to cache links for in milliseconds, the TTL resets whenever a new value is set in
	 * the cache.
	 */
	TTL = 10000
}

class LinkCache {
	private readonly _cache = new Map<string, ResolvedLink>();
	private _cacheTilTimeout = 0;

	set(link: string | URI, value: ResolvedLink) {
		// Reset cached link TTL on any set
		if (this._cacheTilTimeout) {
			mainWindow.clearTimeout(this._cacheTilTimeout);
		}
		this._cacheTilTimeout = mainWindow.setTimeout(() => this._cache.clear(), LinkCacheConstants.TTL);
		this._cache.set(this._getKey(link), value);
	}

	get(link: string | URI): ResolvedLink | undefined {
		return this._cache.get(this._getKey(link));
	}

	private _getKey(link: string | URI): string {
		if (URI.isUri(link)) {
			return link.toString();
		}
		return link;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/links/browser/terminalLocalLinkDetector.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/links/browser/terminalLocalLinkDetector.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { OS } from '../../../../../base/common/platform.js';
import { URI } from '../../../../../base/common/uri.js';
import { IUriIdentityService } from '../../../../../platform/uriIdentity/common/uriIdentity.js';
import { IWorkspaceContextService } from '../../../../../platform/workspace/common/workspace.js';
import { ITerminalLinkDetector, ITerminalLinkResolver, ITerminalSimpleLink, ResolvedLink, TerminalBuiltinLinkType } from './links.js';
import { convertLinkRangeToBuffer, getXtermLineContent, getXtermRangesByAttr, osPathModule, updateLinkWithRelativeCwd } from './terminalLinkHelpers.js';
import { ITerminalCapabilityStore, TerminalCapability } from '../../../../../platform/terminal/common/capabilities/capabilities.js';
import type { IBufferLine, IBufferRange, Terminal } from '@xterm/xterm';
import { ITerminalProcessManager } from '../../../terminal/common/terminal.js';
import { detectLinks } from './terminalLinkParsing.js';
import { ITerminalBackend, ITerminalLogService } from '../../../../../platform/terminal/common/terminal.js';

const enum Constants {
	/**
	 * The max line length to try extract word links from.
	 */
	MaxLineLength = 2000,

	/**
	 * The maximum number of links in a line to resolve against the file system. This limit is put
	 * in place to avoid sending excessive data when remote connections are in place.
	 */
	MaxResolvedLinksInLine = 10,

	/**
	 * The maximum length of a link to resolve against the file system. This limit is put in place
	 * to avoid sending excessive data when remote connections are in place.
	 */
	MaxResolvedLinkLength = 1024,
}

const fallbackMatchers: RegExp[] = [
	// Python style error: File "<path>", line <line>
	/^ *File (?<link>"(?<path>.+)"(, line (?<line>\d+))?)/,
	// Unknown tool #200166: FILE  <path>:<line>:<col>
	/^ +FILE +(?<link>(?<path>.+)(?::(?<line>\d+)(?::(?<col>\d+))?)?)/,
	// Some C++ compile error formats:
	// C:\foo\bar baz(339) : error ...
	// C:\foo\bar baz(339,12) : error ...
	// C:\foo\bar baz(339, 12) : error ...
	// C:\foo\bar baz(339): error ...       [#178584, Visual Studio CL/NVIDIA CUDA compiler]
	// C:\foo\bar baz(339,12): ...
	// C:\foo\bar baz(339, 12): ...
	/^(?<link>(?<path>.+)\((?<line>\d+)(?:, ?(?<col>\d+))?\)) ?:/,
	// C:\foo/bar baz:339 : error ...
	// C:\foo/bar baz:339:12 : error ...
	// C:\foo/bar baz:339: error ...
	// C:\foo/bar baz:339:12: error ...     [#178584, Clang]
	/^(?<link>(?<path>.+):(?<line>\d+)(?::(?<col>\d+))?) ?:/,
	// PowerShell and cmd prompt
	/^(?:PS\s+)?(?<link>(?<path>[^>]+))>/,
	// The whole line is the path
	/^ *(?<link>(?<path>.+))/
];

export class TerminalLocalLinkDetector implements ITerminalLinkDetector {
	static id = 'local';

	// This was chosen as a reasonable maximum line length given the tradeoff between performance
	// and how likely it is to encounter such a large line length. Some useful reference points:
	// - Window old max length: 260 ($MAX_PATH)
	// - Linux max length: 4096 ($PATH_MAX)
	readonly maxLinkLength = 500;

	constructor(
		readonly xterm: Terminal,
		private readonly _capabilities: ITerminalCapabilityStore,
		private readonly _processManager: Pick<ITerminalProcessManager, 'initialCwd' | 'os' | 'remoteAuthority' | 'userHome'> & { backend?: Pick<ITerminalBackend, 'getWslPath'> },
		private readonly _linkResolver: ITerminalLinkResolver,
		@ITerminalLogService private readonly _logService: ITerminalLogService,
		@IUriIdentityService private readonly _uriIdentityService: IUriIdentityService,
		@IWorkspaceContextService private readonly _workspaceContextService: IWorkspaceContextService
	) {
	}

	async detect(lines: IBufferLine[], startLine: number, endLine: number): Promise<ITerminalSimpleLink[]> {
		const links: ITerminalSimpleLink[] = [];

		// Get the text representation of the wrapped line
		const text = getXtermLineContent(this.xterm.buffer.active, startLine, endLine, this.xterm.cols);
		if (text === '' || text.length > Constants.MaxLineLength) {
			return [];
		}

		let stringIndex = -1;
		let resolvedLinkCount = 0;

		const os = this._processManager.os || OS;
		const parsedLinks = detectLinks(text, os);
		this._logService.trace('terminalLocalLinkDetector#detect text', text);
		this._logService.trace('terminalLocalLinkDetector#detect parsedLinks', parsedLinks);
		for (const parsedLink of parsedLinks) {

			// Don't try resolve any links of excessive length
			if (parsedLink.path.text.length > Constants.MaxResolvedLinkLength) {
				continue;
			}

			// Convert the link text's string index into a wrapped buffer range
			const bufferRange = convertLinkRangeToBuffer(lines, this.xterm.cols, {
				startColumn: (parsedLink.prefix?.index ?? parsedLink.path.index) + 1,
				startLineNumber: 1,
				endColumn: parsedLink.path.index + parsedLink.path.text.length + (parsedLink.suffix?.suffix.text.length ?? 0) + 1,
				endLineNumber: 1
			}, startLine);

			// Get a single link candidate if the cwd of the line is known
			const linkCandidates: string[] = [];
			const osPath = osPathModule(os);
			const isUri = parsedLink.path.text.startsWith('file://');
			if (osPath.isAbsolute(parsedLink.path.text) || parsedLink.path.text.startsWith('~') || isUri) {
				linkCandidates.push(parsedLink.path.text);
			} else {
				if (this._capabilities.has(TerminalCapability.CommandDetection)) {
					const absolutePath = updateLinkWithRelativeCwd(this._capabilities, bufferRange.start.y, parsedLink.path.text, osPath, this._logService);
					// Only add a single exact link candidate if the cwd is available, this may cause
					// the link to not be resolved but that should only occur when the actual file does
					// not exist. Doing otherwise could cause unexpected results where handling via the
					// word link detector is preferable.
					if (absolutePath) {
						linkCandidates.push(...absolutePath);
					}
				}
				// Fallback to resolving against the initial cwd, removing any relative directory prefixes
				if (linkCandidates.length === 0) {
					linkCandidates.push(parsedLink.path.text);
					if (parsedLink.path.text.match(/^(\.\.[\/\\])+/)) {
						linkCandidates.push(parsedLink.path.text.replace(/^(\.\.[\/\\])+/, ''));
					}
				}
			}

			// If any candidates end with special characters that are likely to not be part of the
			// link, add a candidate excluding them.
			const specialEndCharRegex = /[\[\]"'\.]$/;
			const trimRangeMap: Map<string, number> = new Map();
			const specialEndLinkCandidates: string[] = [];
			for (const candidate of linkCandidates) {
				let previous = candidate;
				let removed = previous.replace(specialEndCharRegex, '');
				let trimRange = 0;
				while (removed !== previous) {
					// Only trim the link if there is no suffix, otherwise the underline would be incorrect
					if (!parsedLink.suffix) {
						trimRange++;
					}
					specialEndLinkCandidates.push(removed);
					trimRangeMap.set(removed, trimRange);
					previous = removed;
					removed = removed.replace(specialEndCharRegex, '');
				}
			}
			linkCandidates.push(...specialEndLinkCandidates);
			this._logService.trace('terminalLocalLinkDetector#detect linkCandidates', linkCandidates);

			// Validate the path and convert to the outgoing type
			const simpleLink = await this._validateAndGetLink(undefined, bufferRange, linkCandidates, trimRangeMap);
			if (simpleLink) {
				simpleLink.parsedLink = parsedLink;
				simpleLink.text = text.substring(
					parsedLink.prefix?.index ?? parsedLink.path.index,
					parsedLink.suffix ? parsedLink.suffix.suffix.index + parsedLink.suffix.suffix.text.length : parsedLink.path.index + parsedLink.path.text.length
				);
				this._logService.trace('terminalLocalLinkDetector#detect verified link', simpleLink);
				links.push(simpleLink);
			}

			// Stop early if too many links exist in the line
			if (++resolvedLinkCount >= Constants.MaxResolvedLinksInLine) {
				break;
			}
		}

		// Match against the fallback matchers which are mainly designed to catch paths with spaces
		// that aren't possible using the regular mechanism.
		if (links.length === 0) {
			for (const matcher of fallbackMatchers) {
				const match = text.match(matcher);
				const group = match?.groups;
				if (!group) {
					continue;
				}
				const link = group?.link;
				const path = group?.path;
				const line = group?.line;
				const col = group?.col;
				if (!link || !path) {
					continue;
				}

				// Don't try resolve any links of excessive length
				if (link.length > Constants.MaxResolvedLinkLength) {
					continue;
				}

				// Convert the link text's string index into a wrapped buffer range
				stringIndex = text.indexOf(link);
				const bufferRange = convertLinkRangeToBuffer(lines, this.xterm.cols, {
					startColumn: stringIndex + 1,
					startLineNumber: 1,
					endColumn: stringIndex + link.length + 1,
					endLineNumber: 1
				}, startLine);

				// Validate and add link
				const suffix = line ? `:${line}${col ? `:${col}` : ''}` : '';
				const simpleLink = await this._validateAndGetLink(`${path}${suffix}`, bufferRange, [path]);
				if (simpleLink) {
					links.push(simpleLink);
				}

			}
		}

		// Sometimes links are styled specially in the terminal like underlined or bolded, try split
		// the line by attributes and test whether it matches a path
		if (links.length === 0) {
			const rangeCandidates = getXtermRangesByAttr(this.xterm.buffer.active, startLine, endLine, this.xterm.cols);
			for (const rangeCandidate of rangeCandidates) {
				let text = '';
				for (let y = rangeCandidate.start.y; y <= rangeCandidate.end.y; y++) {
					const line = this.xterm.buffer.active.getLine(y);
					if (!line) {
						break;
					}
					const lineStartX = y === rangeCandidate.start.y ? rangeCandidate.start.x : 0;
					const lineEndX = y === rangeCandidate.end.y ? rangeCandidate.end.x : this.xterm.cols - 1;
					text += line.translateToString(false, lineStartX, lineEndX);
				}

				// HACK: Adjust to 1-based for link API
				rangeCandidate.start.x++;
				rangeCandidate.start.y++;
				rangeCandidate.end.y++;

				// Validate and add link
				const simpleLink = await this._validateAndGetLink(text, rangeCandidate, [text]);
				if (simpleLink) {
					links.push(simpleLink);
				}

				// Stop early if too many links exist in the line
				if (++resolvedLinkCount >= Constants.MaxResolvedLinksInLine) {
					break;
				}
			}
		}

		return links;
	}
	private async _validateLinkCandidates(linkCandidates: string[]): Promise<ResolvedLink | undefined> {
		for (const link of linkCandidates) {
			let uri: URI | undefined;
			if (link.startsWith('file://')) {
				uri = URI.parse(link);
			}
			const result = await this._linkResolver.resolveLink(this._processManager, link, uri);
			if (result) {
				return result;
			}
		}
		return undefined;
	}

	/**
	 * Validates a set of link candidates and returns a link if validated.
	 * @param linkText The link text, this should be undefined to use the link stat value
	 * @param trimRangeMap A map of link candidates to the amount of buffer range they need trimmed.
	 */
	private async _validateAndGetLink(linkText: string | undefined, bufferRange: IBufferRange, linkCandidates: string[], trimRangeMap?: Map<string, number>): Promise<ITerminalSimpleLink | undefined> {
		const linkStat = await this._validateLinkCandidates(linkCandidates);
		if (linkStat) {
			const type = getTerminalLinkType(linkStat.uri, linkStat.isDirectory, this._uriIdentityService, this._workspaceContextService);

			// Offset the buffer range if the link range was trimmed
			const trimRange = trimRangeMap?.get(linkStat.link);
			if (trimRange) {
				bufferRange.end.x -= trimRange;
				if (bufferRange.end.x < 0) {
					bufferRange.end.y--;
					bufferRange.end.x += this.xterm.cols;
				}
			}

			return {
				text: linkText ?? linkStat.link,
				uri: linkStat.uri,
				bufferRange: bufferRange,
				type
			};
		}
		return undefined;
	}
}

export function getTerminalLinkType(
	uri: URI,
	isDirectory: boolean,
	uriIdentityService: IUriIdentityService,
	workspaceContextService: IWorkspaceContextService
): TerminalBuiltinLinkType {
	if (isDirectory) {
		// Check if directory is inside workspace
		const folders = workspaceContextService.getWorkspace().folders;
		for (let i = 0; i < folders.length; i++) {
			if (uriIdentityService.extUri.isEqualOrParent(uri, folders[i].uri)) {
				return TerminalBuiltinLinkType.LocalFolderInWorkspace;
			}
		}
		return TerminalBuiltinLinkType.LocalFolderOutsideWorkspace;
	} else {
		return TerminalBuiltinLinkType.LocalFile;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/links/browser/terminalMultiLineLinkDetector.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/links/browser/terminalMultiLineLinkDetector.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IUriIdentityService } from '../../../../../platform/uriIdentity/common/uriIdentity.js';
import { IWorkspaceContextService } from '../../../../../platform/workspace/common/workspace.js';
import { ITerminalLinkDetector, ITerminalLinkResolver, ITerminalSimpleLink } from './links.js';
import { convertLinkRangeToBuffer, getXtermLineContent } from './terminalLinkHelpers.js';
import { getTerminalLinkType } from './terminalLocalLinkDetector.js';
import type { IBufferLine, Terminal } from '@xterm/xterm';
import { ITerminalProcessManager } from '../../../terminal/common/terminal.js';
import { ITerminalBackend, ITerminalLogService } from '../../../../../platform/terminal/common/terminal.js';

const enum Constants {
	/**
	 * The max line length to try extract word links from.
	 */
	MaxLineLength = 2000,

	/**
	 * The maximum length of a link to resolve against the file system. This limit is put in place
	 * to avoid sending excessive data when remote connections are in place.
	 */
	MaxResolvedLinkLength = 1024,
}

const lineNumberPrefixMatchers = [
	// Ripgrep:
	//   /some/file
	//   16:searchresult
	//   16:    searchresult
	// Eslint:
	//   /some/file
	//     16:5  error ...
	/^ *(?<link>(?<line>\d+):(?<col>\d+)?)/
];

const gitDiffMatchers = [
	// --- a/some/file
	// +++ b/some/file
	// @@ -8,11 +8,11 @@ file content...
	/^(?<link>@@ .+ \+(?<toFileLine>\d+),(?<toFileCount>\d+) @@)/
];

export class TerminalMultiLineLinkDetector implements ITerminalLinkDetector {
	static id = 'multiline';

	// This was chosen as a reasonable maximum line length given the tradeoff between performance
	// and how likely it is to encounter such a large line length. Some useful reference points:
	// - Window old max length: 260 ($MAX_PATH)
	// - Linux max length: 4096 ($PATH_MAX)
	readonly maxLinkLength = 500;

	constructor(
		readonly xterm: Terminal,
		private readonly _processManager: Pick<ITerminalProcessManager, 'initialCwd' | 'os' | 'remoteAuthority' | 'userHome'> & { backend?: Pick<ITerminalBackend, 'getWslPath'> },
		private readonly _linkResolver: ITerminalLinkResolver,
		@ITerminalLogService private readonly _logService: ITerminalLogService,
		@IUriIdentityService private readonly _uriIdentityService: IUriIdentityService,
		@IWorkspaceContextService private readonly _workspaceContextService: IWorkspaceContextService
	) {
	}

	async detect(lines: IBufferLine[], startLine: number, endLine: number): Promise<ITerminalSimpleLink[]> {
		const links: ITerminalSimpleLink[] = [];

		// Get the text representation of the wrapped line
		const text = getXtermLineContent(this.xterm.buffer.active, startLine, endLine, this.xterm.cols);
		if (text === '' || text.length > Constants.MaxLineLength) {
			return [];
		}

		this._logService.trace('terminalMultiLineLinkDetector#detect text', text);

		// Match against the fallback matchers which are mainly designed to catch paths with spaces
		// that aren't possible using the regular mechanism.
		for (const matcher of lineNumberPrefixMatchers) {
			const match = text.match(matcher);
			const group = match?.groups;
			if (!group) {
				continue;
			}
			const link = group?.link;
			const line = group?.line;
			const col = group?.col;
			if (!link || line === undefined) {
				continue;
			}

			// Don't try resolve any links of excessive length
			if (link.length > Constants.MaxResolvedLinkLength) {
				continue;
			}

			this._logService.trace('terminalMultiLineLinkDetector#detect candidate', link);

			// Scan up looking for the first line that could be a path
			let possiblePath: string | undefined;
			for (let index = startLine - 1; index >= 0; index--) {
				// Ignore lines that aren't at the beginning of a wrapped line
				if (this.xterm.buffer.active.getLine(index)!.isWrapped) {
					continue;
				}
				const text = getXtermLineContent(this.xterm.buffer.active, index, index, this.xterm.cols);
				if (!text.match(/^\s*\d/)) {
					possiblePath = text;
					break;
				}
			}
			if (!possiblePath) {
				continue;
			}

			// Check if the first non-matching line is an absolute or relative link
			const linkStat = await this._linkResolver.resolveLink(this._processManager, possiblePath);
			if (linkStat) {
				const type = getTerminalLinkType(linkStat.uri, linkStat.isDirectory, this._uriIdentityService, this._workspaceContextService);

				// Convert the entire line's text string index into a wrapped buffer range
				const bufferRange = convertLinkRangeToBuffer(lines, this.xterm.cols, {
					startColumn: 1,
					startLineNumber: 1,
					endColumn: 1 + text.length,
					endLineNumber: 1
				}, startLine);

				const simpleLink: ITerminalSimpleLink = {
					text: link,
					uri: linkStat.uri,
					selection: {
						startLineNumber: parseInt(line),
						startColumn: col ? parseInt(col) : 1
					},
					disableTrimColon: true,
					bufferRange: bufferRange,
					type
				};
				this._logService.trace('terminalMultiLineLinkDetector#detect verified link', simpleLink);
				links.push(simpleLink);

				// Break on the first match
				break;
			}
		}

		if (links.length === 0) {
			for (const matcher of gitDiffMatchers) {
				const match = text.match(matcher);
				const group = match?.groups;
				if (!group) {
					continue;
				}
				const link = group?.link;
				const toFileLine = group?.toFileLine;
				const toFileCount = group?.toFileCount;
				if (!link || toFileLine === undefined) {
					continue;
				}

				// Don't try resolve any links of excessive length
				if (link.length > Constants.MaxResolvedLinkLength) {
					continue;
				}

				this._logService.trace('terminalMultiLineLinkDetector#detect candidate', link);


				// Scan up looking for the first line that could be a path
				let possiblePath: string | undefined;
				for (let index = startLine - 1; index >= 0; index--) {
					// Ignore lines that aren't at the beginning of a wrapped line
					if (this.xterm.buffer.active.getLine(index)!.isWrapped) {
						continue;
					}
					const text = getXtermLineContent(this.xterm.buffer.active, index, index, this.xterm.cols);
					const match = text.match(/\+\+\+ b\/(?<path>.+)/);
					if (match) {
						possiblePath = match.groups?.path;
						break;
					}
				}
				if (!possiblePath) {
					continue;
				}

				// Check if the first non-matching line is an absolute or relative link
				const linkStat = await this._linkResolver.resolveLink(this._processManager, possiblePath);
				if (linkStat) {
					const type = getTerminalLinkType(linkStat.uri, linkStat.isDirectory, this._uriIdentityService, this._workspaceContextService);

					// Convert the link to the buffer range
					const bufferRange = convertLinkRangeToBuffer(lines, this.xterm.cols, {
						startColumn: 1,
						startLineNumber: 1,
						endColumn: 1 + link.length,
						endLineNumber: 1
					}, startLine);

					const simpleLink: ITerminalSimpleLink = {
						text: link,
						uri: linkStat.uri,
						selection: {
							startLineNumber: parseInt(toFileLine),
							startColumn: 1,
							endLineNumber: parseInt(toFileLine) + parseInt(toFileCount)
						},
						bufferRange: bufferRange,
						type
					};
					this._logService.trace('terminalMultiLineLinkDetector#detect verified link', simpleLink);
					links.push(simpleLink);

					// Break on the first match
					break;
				}
			}
		}

		return links;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/links/browser/terminalUriLinkDetector.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/links/browser/terminalUriLinkDetector.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Schemas } from '../../../../../base/common/network.js';
import { URI } from '../../../../../base/common/uri.js';
import { ILinkComputerTarget, LinkComputer } from '../../../../../editor/common/languages/linkComputer.js';
import { IUriIdentityService } from '../../../../../platform/uriIdentity/common/uriIdentity.js';
import { IWorkspaceContextService } from '../../../../../platform/workspace/common/workspace.js';
import { ITerminalLinkDetector, ITerminalLinkResolver, ITerminalSimpleLink, TerminalBuiltinLinkType } from './links.js';
import { convertLinkRangeToBuffer, getXtermLineContent } from './terminalLinkHelpers.js';
import { getTerminalLinkType } from './terminalLocalLinkDetector.js';
import { ITerminalProcessManager } from '../../../terminal/common/terminal.js';
import type { IBufferLine, Terminal } from '@xterm/xterm';
import { ITerminalBackend, ITerminalLogService } from '../../../../../platform/terminal/common/terminal.js';
import { isString } from '../../../../../base/common/types.js';

const enum Constants {
	/**
	 * The maximum number of links in a line to resolve against the file system. This limit is put
	 * in place to avoid sending excessive data when remote connections are in place.
	 */
	MaxResolvedLinksInLine = 10
}

export class TerminalUriLinkDetector implements ITerminalLinkDetector {
	static id = 'uri';

	// 2048 is the maximum URL length
	readonly maxLinkLength = 2048;

	constructor(
		readonly xterm: Terminal,
		private readonly _processManager: Pick<ITerminalProcessManager, 'initialCwd' | 'os' | 'remoteAuthority' | 'userHome'> & { backend?: Pick<ITerminalBackend, 'getWslPath'> },
		private readonly _linkResolver: ITerminalLinkResolver,
		@ITerminalLogService private readonly _logService: ITerminalLogService,
		@IUriIdentityService private readonly _uriIdentityService: IUriIdentityService,
		@IWorkspaceContextService private readonly _workspaceContextService: IWorkspaceContextService
	) {
	}

	async detect(lines: IBufferLine[], startLine: number, endLine: number): Promise<ITerminalSimpleLink[]> {
		const links: ITerminalSimpleLink[] = [];

		const linkComputerTarget = new TerminalLinkAdapter(this.xterm, startLine, endLine);
		const computedLinks = LinkComputer.computeLinks(linkComputerTarget);

		let resolvedLinkCount = 0;
		this._logService.trace('terminalUriLinkDetector#detect computedLinks', computedLinks);
		for (const computedLink of computedLinks) {
			const bufferRange = convertLinkRangeToBuffer(lines, this.xterm.cols, computedLink.range, startLine);

			// Check if the link is within the mouse position
			const uri = computedLink.url
				? (isString(computedLink.url) ? URI.parse(this._excludeLineAndColSuffix(computedLink.url)) : computedLink.url)
				: undefined;

			if (!uri) {
				continue;
			}

			const text = computedLink.url?.toString() || '';

			// Don't try resolve any links of excessive length
			if (text.length > this.maxLinkLength) {
				continue;
			}

			// Handle non-file scheme links
			if (uri.scheme !== Schemas.file) {
				links.push({
					text,
					uri,
					bufferRange,
					type: TerminalBuiltinLinkType.Url
				});
				continue;
			}

			// Filter out URI with unrecognized authorities
			if (uri.authority.length !== 2 && uri.authority.endsWith(':')) {
				continue;
			}

			// As a fallback URI, treat the authority as local to the workspace. This is required
			// for `ls --hyperlink` support for example which includes the hostname in the URI like
			// `file://Some-Hostname/mnt/c/foo/bar`.
			const uriCandidates: URI[] = [uri];
			if (uri.authority.length > 0) {
				uriCandidates.push(URI.from({ ...uri, authority: undefined }));
			}

			// Iterate over all candidates, pushing the candidate on the first that's verified
			this._logService.trace('terminalUriLinkDetector#detect uriCandidates', uriCandidates);
			for (const uriCandidate of uriCandidates) {
				const linkStat = await this._linkResolver.resolveLink(this._processManager, text, uriCandidate);

				// Create the link if validated
				if (linkStat) {
					const type = getTerminalLinkType(uriCandidate, linkStat.isDirectory, this._uriIdentityService, this._workspaceContextService);
					const simpleLink: ITerminalSimpleLink = {
						// Use computedLink.url if it's a string to retain the line/col suffix
						text: isString(computedLink.url) ? computedLink.url : linkStat.link,
						uri: uriCandidate,
						bufferRange,
						type
					};
					this._logService.trace('terminalUriLinkDetector#detect verified link', simpleLink);
					links.push(simpleLink);
					resolvedLinkCount++;
					break;
				}
			}

			// Stop early if too many links exist in the line
			if (++resolvedLinkCount >= Constants.MaxResolvedLinksInLine) {
				break;
			}
		}

		return links;
	}

	private _excludeLineAndColSuffix(path: string): string {
		return path.replace(/:\d+(:\d+)?$/, '');
	}
}

class TerminalLinkAdapter implements ILinkComputerTarget {
	constructor(
		private _xterm: Terminal,
		private _lineStart: number,
		private _lineEnd: number
	) { }

	getLineCount(): number {
		return 1;
	}

	getLineContent(): string {
		return getXtermLineContent(this._xterm.buffer.active, this._lineStart, this._lineEnd, this._xterm.cols);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/links/browser/terminalWordLinkDetector.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/links/browser/terminalWordLinkDetector.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../../base/common/lifecycle.js';
import { escapeRegExpCharacters } from '../../../../../base/common/strings.js';
import { URI } from '../../../../../base/common/uri.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { matchesScheme } from '../../../../../base/common/network.js';
import { IProductService } from '../../../../../platform/product/common/productService.js';
import { TerminalSettingId } from '../../../../../platform/terminal/common/terminal.js';
import { ITerminalSimpleLink, ITerminalLinkDetector, TerminalBuiltinLinkType } from './links.js';
import { convertLinkRangeToBuffer, getXtermLineContent } from './terminalLinkHelpers.js';
import { ITerminalConfiguration, TERMINAL_CONFIG_SECTION } from '../../../terminal/common/terminal.js';
import type { IBufferLine, Terminal } from '@xterm/xterm';

const enum Constants {
	/**
	 * The max line length to try extract word links from.
	 */
	MaxLineLength = 2000
}

interface Word {
	startIndex: number;
	endIndex: number;
	text: string;
}

export class TerminalWordLinkDetector extends Disposable implements ITerminalLinkDetector {
	static id = 'word';

	// Word links typically search the workspace so it makes sense that their maximum link length is
	// quite small.
	readonly maxLinkLength = 100;

	private _separatorRegex!: RegExp;

	constructor(
		readonly xterm: Terminal,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IProductService private readonly _productService: IProductService,
	) {
		super();

		this._refreshSeparatorCodes();
		this._register(this._configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(TerminalSettingId.WordSeparators)) {
				this._refreshSeparatorCodes();
			}
		}));
	}

	detect(lines: IBufferLine[], startLine: number, endLine: number): ITerminalSimpleLink[] {
		const links: ITerminalSimpleLink[] = [];

		// Get the text representation of the wrapped line
		const text = getXtermLineContent(this.xterm.buffer.active, startLine, endLine, this.xterm.cols);
		if (text === '' || text.length > Constants.MaxLineLength) {
			return [];
		}

		// Parse out all words from the wrapped line
		const words: Word[] = this._parseWords(text);

		// Map the words to ITerminalLink objects
		for (const word of words) {
			if (word.text === '') {
				continue;
			}
			if (word.text.length > 0 && word.text.charAt(word.text.length - 1) === ':') {
				word.text = word.text.slice(0, -1);
				word.endIndex--;
			}
			const bufferRange = convertLinkRangeToBuffer(
				lines,
				this.xterm.cols,
				{
					startColumn: word.startIndex + 1,
					startLineNumber: 1,
					endColumn: word.endIndex + 1,
					endLineNumber: 1
				},
				startLine
			);

			// Support this product's URL protocol
			if (matchesScheme(word.text, this._productService.urlProtocol)) {
				const uri = URI.parse(word.text);
				if (uri) {
					links.push({
						text: word.text,
						uri,
						bufferRange,
						type: TerminalBuiltinLinkType.Url
					});
				}
				continue;
			}

			// Search links
			links.push({
				text: word.text,
				bufferRange,
				type: TerminalBuiltinLinkType.Search,
				contextLine: text
			});
		}

		return links;
	}

	private _parseWords(text: string): Word[] {
		const words: Word[] = [];
		const splitWords = text.split(this._separatorRegex);
		let runningIndex = 0;
		for (let i = 0; i < splitWords.length; i++) {
			words.push({
				text: splitWords[i],
				startIndex: runningIndex,
				endIndex: runningIndex + splitWords[i].length
			});
			runningIndex += splitWords[i].length + 1;
		}
		return words;
	}

	private _refreshSeparatorCodes(): void {
		const separators = this._configurationService.getValue<ITerminalConfiguration>(TERMINAL_CONFIG_SECTION).wordSeparators;
		let powerlineSymbols = '';
		for (let i = 0xe0b0; i <= 0xe0bf; i++) {
			powerlineSymbols += String.fromCharCode(i);
		}
		this._separatorRegex = new RegExp(`[${escapeRegExpCharacters(separators)}${powerlineSymbols}]`, 'g');
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/links/common/terminal.links.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/links/common/terminal.links.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const enum TerminalLinksCommandId {
	OpenDetectedLink = 'workbench.action.terminal.openDetectedLink',
	OpenWordLink = 'workbench.action.terminal.openWordLink',
	OpenFileLink = 'workbench.action.terminal.openFileLink',
	OpenWebLink = 'workbench.action.terminal.openUrlLink',
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/links/test/browser/linkTestUtils.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/links/test/browser/linkTestUtils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { deepStrictEqual } from 'assert';
import { ITerminalLinkDetector, TerminalLinkType } from '../../browser/links.js';
import { URI } from '../../../../../../base/common/uri.js';
import type { IBufferLine } from '@xterm/xterm';
import { hasKey } from '../../../../../../base/common/types.js';

export async function assertLinkHelper(
	text: string,
	expected: ({ uri: URI; range: [number, number][] } | { text: string; range: [number, number][] })[],
	detector: ITerminalLinkDetector,
	expectedType: TerminalLinkType
) {
	detector.xterm.reset();

	// Write the text and wait for the parser to finish
	await new Promise<void>(r => detector.xterm.write(text, r));
	const textSplit = text.split('\r\n');
	const lastLineIndex = textSplit.filter((e, i) => i !== textSplit.length - 1).reduce((p, c) => {
		return p + Math.max(Math.ceil(c.length / 80), 1);
	}, 0);

	// Ensure all links are provided
	const lines: IBufferLine[] = [];
	for (let i = 0; i < detector.xterm.buffer.active.cursorY + 1; i++) {
		lines.push(detector.xterm.buffer.active.getLine(i)!);
	}

	// Detect links always on the last line with content
	const actualLinks = (await detector.detect(lines, lastLineIndex, detector.xterm.buffer.active.cursorY)).map(e => {
		return {
			link: e.uri?.toString() ?? e.text,
			type: expectedType,
			bufferRange: e.bufferRange
		};
	});
	const expectedLinks = expected.map(e => {
		return {
			type: expectedType,
			link: hasKey(e, { uri: true }) ? e.uri.toString() : e.text,
			bufferRange: {
				start: { x: e.range[0][0], y: e.range[0][1] },
				end: { x: e.range[1][0], y: e.range[1][1] },
			}
		};
	});
	deepStrictEqual(actualLinks, expectedLinks);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/links/test/browser/terminalLinkHelpers.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/links/test/browser/terminalLinkHelpers.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import type { IBufferLine, IBufferCell } from '@xterm/xterm';
import { convertLinkRangeToBuffer } from '../../browser/terminalLinkHelpers.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';

suite('Workbench - Terminal Link Helpers', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	suite('convertLinkRangeToBuffer', () => {
		test('should convert ranges for ascii characters', () => {
			const lines = createBufferLineArray([
				{ text: 'AA http://t', width: 11 },
				{ text: '.com/f/', width: 8 }
			]);
			const bufferRange = convertLinkRangeToBuffer(lines, 11, { startColumn: 4, startLineNumber: 1, endColumn: 19, endLineNumber: 1 }, 0);
			assert.deepStrictEqual(bufferRange, {
				start: { x: 4, y: 1 },
				end: { x: 7, y: 2 }
			});
		});
		test('should convert ranges for wide characters before the link', () => {
			const lines = createBufferLineArray([
				{ text: 'A文 http://', width: 11 },
				{ text: 't.com/f/', width: 9 }
			]);
			const bufferRange = convertLinkRangeToBuffer(lines, 11, { startColumn: 4, startLineNumber: 1, endColumn: 19, endLineNumber: 1 }, 0);
			assert.deepStrictEqual(bufferRange, {
				start: { x: 4 + 1, y: 1 },
				end: { x: 7 + 1, y: 2 }
			});
		});
		test('should give correct range for links containing multi-character emoji', () => {
			const lines = createBufferLineArray([
				{ text: 'A🙂 http://', width: 11 }
			]);
			const bufferRange = convertLinkRangeToBuffer(lines, 11, { startColumn: 0 + 1, startLineNumber: 1, endColumn: 2 + 1, endLineNumber: 1 }, 0);
			assert.deepStrictEqual(bufferRange, {
				start: { x: 1, y: 1 },
				end: { x: 2, y: 1 }
			});
		});
		test('should convert ranges for combining characters before the link', () => {
			const lines = createBufferLineArray([
				{ text: 'A🙂 http://', width: 11 },
				{ text: 't.com/f/', width: 9 }
			]);
			const bufferRange = convertLinkRangeToBuffer(lines, 11, { startColumn: 4 + 1, startLineNumber: 1, endColumn: 19 + 1, endLineNumber: 1 }, 0);
			assert.deepStrictEqual(bufferRange, {
				start: { x: 6, y: 1 },
				end: { x: 9, y: 2 }
			});
		});
		test('should convert ranges for wide characters inside the link', () => {
			const lines = createBufferLineArray([
				{ text: 'AA http://t', width: 11 },
				{ text: '.com/文/', width: 8 }
			]);
			const bufferRange = convertLinkRangeToBuffer(lines, 11, { startColumn: 4, startLineNumber: 1, endColumn: 19, endLineNumber: 1 }, 0);
			assert.deepStrictEqual(bufferRange, {
				start: { x: 4, y: 1 },
				end: { x: 7 + 1, y: 2 }
			});
		});
		test('should convert ranges for wide characters before and inside the link', () => {
			const lines = createBufferLineArray([
				{ text: 'A文 http://', width: 11 },
				{ text: 't.com/文/', width: 9 }
			]);
			const bufferRange = convertLinkRangeToBuffer(lines, 11, { startColumn: 4, startLineNumber: 1, endColumn: 19, endLineNumber: 1 }, 0);
			assert.deepStrictEqual(bufferRange, {
				start: { x: 4 + 1, y: 1 },
				end: { x: 7 + 2, y: 2 }
			});
		});
		test('should convert ranges for emoji before and wide inside the link', () => {
			const lines = createBufferLineArray([
				{ text: 'A🙂 http://', width: 11 },
				{ text: 't.com/文/', width: 9 }
			]);
			const bufferRange = convertLinkRangeToBuffer(lines, 11, { startColumn: 4 + 1, startLineNumber: 1, endColumn: 19 + 1, endLineNumber: 1 }, 0);
			assert.deepStrictEqual(bufferRange, {
				start: { x: 6, y: 1 },
				end: { x: 10 + 1, y: 2 }
			});
		});
		test('should convert ranges for ascii characters (link starts on wrapped)', () => {
			const lines = createBufferLineArray([
				{ text: 'AAAAAAAAAAA', width: 11 },
				{ text: 'AA http://t', width: 11 },
				{ text: '.com/f/', width: 8 }
			]);
			const bufferRange = convertLinkRangeToBuffer(lines, 11, { startColumn: 15, startLineNumber: 1, endColumn: 30, endLineNumber: 1 }, 0);
			assert.deepStrictEqual(bufferRange, {
				start: { x: 4, y: 2 },
				end: { x: 7, y: 3 }
			});
		});
		test('should convert ranges for wide characters before the link (link starts on wrapped)', () => {
			const lines = createBufferLineArray([
				{ text: 'AAAAAAAAAAA', width: 11 },
				{ text: 'A文 http://', width: 11 },
				{ text: 't.com/f/', width: 9 }
			]);
			const bufferRange = convertLinkRangeToBuffer(lines, 11, { startColumn: 15, startLineNumber: 1, endColumn: 30, endLineNumber: 1 }, 0);
			assert.deepStrictEqual(bufferRange, {
				start: { x: 4 + 1, y: 2 },
				end: { x: 7 + 1, y: 3 }
			});
		});
		test('regression test #147619: 获取模板 25235168 的预览图失败', () => {
			const lines = createBufferLineArray([
				{ text: '获取模板 25235168 的预览图失败', width: 30 }
			]);
			assert.deepStrictEqual(convertLinkRangeToBuffer(lines, 30, {
				startColumn: 1,
				startLineNumber: 1,
				endColumn: 5,
				endLineNumber: 1
			}, 0), {
				start: { x: 1, y: 1 },
				end: { x: 8, y: 1 }
			});
			assert.deepStrictEqual(convertLinkRangeToBuffer(lines, 30, {
				startColumn: 6,
				startLineNumber: 1,
				endColumn: 14,
				endLineNumber: 1
			}, 0), {
				start: { x: 10, y: 1 },
				end: { x: 17, y: 1 }
			});
			assert.deepStrictEqual(convertLinkRangeToBuffer(lines, 30, {
				startColumn: 15,
				startLineNumber: 1,
				endColumn: 21,
				endLineNumber: 1
			}, 0), {
				start: { x: 19, y: 1 },
				end: { x: 30, y: 1 }
			});
		});
		test('should convert ranges for wide characters inside the link (link starts on wrapped)', () => {
			const lines = createBufferLineArray([
				{ text: 'AAAAAAAAAAA', width: 11 },
				{ text: 'AA http://t', width: 11 },
				{ text: '.com/文/', width: 8 }
			]);
			const bufferRange = convertLinkRangeToBuffer(lines, 11, { startColumn: 15, startLineNumber: 1, endColumn: 30, endLineNumber: 1 }, 0);
			assert.deepStrictEqual(bufferRange, {
				start: { x: 4, y: 2 },
				end: { x: 7 + 1, y: 3 }
			});
		});
		test('should convert ranges for wide characters before and inside the link #2', () => {
			const lines = createBufferLineArray([
				{ text: 'AAAAAAAAAAA', width: 11 },
				{ text: 'A文 http://', width: 11 },
				{ text: 't.com/文/', width: 9 }
			]);
			const bufferRange = convertLinkRangeToBuffer(lines, 11, { startColumn: 15, startLineNumber: 1, endColumn: 30, endLineNumber: 1 }, 0);
			assert.deepStrictEqual(bufferRange, {
				start: { x: 4 + 1, y: 2 },
				end: { x: 7 + 2, y: 3 }
			});
		});
		test('should convert ranges for several wide characters before the link', () => {
			const lines = createBufferLineArray([
				{ text: 'A文文AAAAAA', width: 11 },
				{ text: 'AA文文 http', width: 11 },
				{ text: '://t.com/f/', width: 11 }
			]);
			const bufferRange = convertLinkRangeToBuffer(lines, 11, { startColumn: 15, startLineNumber: 1, endColumn: 30, endLineNumber: 1 }, 0);
			// This test ensures that the start offset is applied to the end before it's counted
			assert.deepStrictEqual(bufferRange, {
				start: { x: 3 + 4, y: 2 },
				end: { x: 6 + 4, y: 3 }
			});
		});
		test('should convert ranges for several wide characters before and inside the link', () => {
			const lines = createBufferLineArray([
				{ text: 'A文文AAAAAA', width: 11 },
				{ text: 'AA文文 http', width: 11 },
				{ text: '://t.com/文', width: 11 },
				{ text: '文/', width: 3 }
			]);
			const bufferRange = convertLinkRangeToBuffer(lines, 11, { startColumn: 14, startLineNumber: 1, endColumn: 31, endLineNumber: 1 }, 0);
			// This test ensures that the start offset is applies to the end before it's counted
			assert.deepStrictEqual(bufferRange, {
				start: { x: 5, y: 2 },
				end: { x: 1, y: 4 }
			});
		});
	});
});

const TEST_WIDE_CHAR = '文';
const TEST_NULL_CHAR = 'C';

function createBufferLineArray(lines: { text: string; width: number }[]): IBufferLine[] {
	const result: IBufferLine[] = [];
	lines.forEach((l, i) => {
		result.push(new TestBufferLine(
			l.text,
			l.width,
			i + 1 !== lines.length
		));
	});
	return result;
}

class TestBufferLine implements IBufferLine {
	constructor(
		private _text: string,
		public length: number,
		public isWrapped: boolean
	) {

	}
	getCell(x: number): IBufferCell | undefined {
		// Create a fake line of cells and use that to resolve the width
		const cells: string[] = [];
		let wideNullCellOffset = 0; // There is no null 0 width char after a wide char
		const emojiOffset = 0; // Skip chars as emoji are multiple characters
		for (let i = 0; i <= x - wideNullCellOffset + emojiOffset; i++) {
			let char = this._text.charAt(i);
			if (char === '\ud83d') {
				// Make "🙂"
				char += '\ude42';
			}
			cells.push(char);
			if (this._text.charAt(i) === TEST_WIDE_CHAR || char.charCodeAt(0) > 255) {
				// Skip the next character as it's width is 0
				cells.push(TEST_NULL_CHAR);
				wideNullCellOffset++;
			}
		}
		// eslint-disable-next-line local/code-no-any-casts
		return {
			getChars: () => {
				return x >= cells.length ? '' : cells[x];
			},
			getWidth: () => {
				switch (cells[x]) {
					case TEST_WIDE_CHAR: return 2;
					case TEST_NULL_CHAR: return 0;
					default: {
						// Naive measurement, assume anything our of ascii in tests are wide
						if (cells[x].charCodeAt(0) > 255) {
							return 2;
						}
						return 1;
					}
				}
			}
		} as any;
	}
	translateToString(): string {
		throw new Error('Method not implemented.');
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/links/test/browser/terminalLinkManager.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/links/test/browser/terminalLinkManager.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { deepStrictEqual, strictEqual } from 'assert';
import { equals } from '../../../../../../base/common/arrays.js';
import { IEditorOptions } from '../../../../../../editor/common/config/editorOptions.js';
import { IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../../../platform/configuration/test/common/testConfigurationService.js';
import { ContextMenuService } from '../../../../../../platform/contextview/browser/contextMenuService.js';
import { IContextMenuService } from '../../../../../../platform/contextview/browser/contextView.js';
import { TestInstantiationService } from '../../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { ILogService, NullLogService } from '../../../../../../platform/log/common/log.js';
import { IStorageService } from '../../../../../../platform/storage/common/storage.js';
import { IThemeService } from '../../../../../../platform/theme/common/themeService.js';
import { TestThemeService } from '../../../../../../platform/theme/test/common/testThemeService.js';
import { IViewDescriptorService } from '../../../../../common/views.js';
import { IDetectedLinks, TerminalLinkManager } from '../../browser/terminalLinkManager.js';
import { ITerminalCapabilityImplMap, ITerminalCapabilityStore, TerminalCapability } from '../../../../../../platform/terminal/common/capabilities/capabilities.js';
import { ITerminalConfiguration, ITerminalProcessManager } from '../../../../terminal/common/terminal.js';
import { TestViewDescriptorService } from '../../../../terminal/test/browser/xterm/xtermTerminal.test.js';
import { TestStorageService } from '../../../../../test/common/workbenchTestServices.js';
import type { ILink, Terminal } from '@xterm/xterm';
import { TerminalLinkResolver } from '../../browser/terminalLinkResolver.js';
import { importAMDNodeModule } from '../../../../../../amdX.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';

const defaultTerminalConfig: Partial<ITerminalConfiguration> = {
	fontFamily: 'monospace',
	fontWeight: 'normal',
	fontWeightBold: 'normal',
	gpuAcceleration: 'off',
	scrollback: 1000,
	fastScrollSensitivity: 2,
	mouseWheelScrollSensitivity: 1,
	unicodeVersion: '11',
	wordSeparators: ' ()[]{}\',"`─‘’“”'
};

class TestLinkManager extends TerminalLinkManager {
	private _links: IDetectedLinks | undefined;
	protected override async _getLinksForType(y: number, type: 'word' | 'url' | 'localFile'): Promise<ILink[] | undefined> {
		switch (type) {
			case 'word':
				return this._links?.wordLinks?.[y] ? [this._links?.wordLinks?.[y]] : undefined;
			case 'url':
				return this._links?.webLinks?.[y] ? [this._links?.webLinks?.[y]] : undefined;
			case 'localFile':
				return this._links?.fileLinks?.[y] ? [this._links?.fileLinks?.[y]] : undefined;
		}
	}
	setLinks(links: IDetectedLinks): void {
		this._links = links;
	}
}

suite('TerminalLinkManager', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	let instantiationService: TestInstantiationService;
	let configurationService: TestConfigurationService;
	let themeService: TestThemeService;
	let viewDescriptorService: TestViewDescriptorService;
	let xterm: Terminal;
	let linkManager: TestLinkManager;

	setup(async () => {
		configurationService = new TestConfigurationService({
			editor: {
				fastScrollSensitivity: 2,
				mouseWheelScrollSensitivity: 1
			} as Partial<IEditorOptions>,
			terminal: {
				integrated: defaultTerminalConfig
			}
		});
		themeService = new TestThemeService();
		viewDescriptorService = new TestViewDescriptorService();

		instantiationService = store.add(new TestInstantiationService());
		instantiationService.stub(IContextMenuService, store.add(instantiationService.createInstance(ContextMenuService)));
		instantiationService.stub(IConfigurationService, configurationService);
		instantiationService.stub(ILogService, new NullLogService());
		instantiationService.stub(IStorageService, store.add(new TestStorageService()));
		instantiationService.stub(IThemeService, themeService);
		instantiationService.stub(IViewDescriptorService, viewDescriptorService);

		const TerminalCtor = (await importAMDNodeModule<typeof import('@xterm/xterm')>('@xterm/xterm', 'lib/xterm.js')).Terminal;
		xterm = store.add(new TerminalCtor({ allowProposedApi: true, cols: 80, rows: 30 }));
		linkManager = store.add(instantiationService.createInstance(TestLinkManager, xterm, upcastPartial<ITerminalProcessManager>({
			get initialCwd() {
				return '';
			}
			// eslint-disable-next-line local/code-no-any-casts
		}), {
			get<T extends TerminalCapability>(capability: T): ITerminalCapabilityImplMap[T] | undefined {
				return undefined;
			}
		} as Partial<ITerminalCapabilityStore> as any, instantiationService.createInstance(TerminalLinkResolver)));
	});

	suite('registerExternalLinkProvider', () => {
		test('should not leak disposables if the link manager is already disposed', () => {
			linkManager.externalProvideLinksCb = async () => undefined;
			linkManager.dispose();
			linkManager.externalProvideLinksCb = async () => undefined;
		});
	});

	suite('getLinks and open recent link', () => {
		test('should return no links', async () => {
			const links = await linkManager.getLinks();
			equals(links.viewport.webLinks, []);
			equals(links.viewport.wordLinks, []);
			equals(links.viewport.fileLinks, []);
			const webLink = await linkManager.openRecentLink('url');
			strictEqual(webLink, undefined);
			const fileLink = await linkManager.openRecentLink('localFile');
			strictEqual(fileLink, undefined);
		});
		test('should return word links in order', async () => {
			const link1 = {
				range: {
					start: { x: 1, y: 1 }, end: { x: 14, y: 1 }
				},
				text: '1_我是学生.txt',
				activate: () => Promise.resolve('')
			};
			const link2 = {
				range: {
					start: { x: 1, y: 1 }, end: { x: 14, y: 1 }
				},
				text: '2_我是学生.txt',
				activate: () => Promise.resolve('')
			};
			linkManager.setLinks({ wordLinks: [link1, link2] });
			const links = await linkManager.getLinks();
			deepStrictEqual(links.viewport.wordLinks?.[0].text, link2.text);
			deepStrictEqual(links.viewport.wordLinks?.[1].text, link1.text);
			const webLink = await linkManager.openRecentLink('url');
			strictEqual(webLink, undefined);
			const fileLink = await linkManager.openRecentLink('localFile');
			strictEqual(fileLink, undefined);
		});
		test('should return web links in order', async () => {
			const link1 = {
				range: { start: { x: 5, y: 1 }, end: { x: 40, y: 1 } },
				text: 'https://foo.bar/[this is foo site 1]',
				activate: () => Promise.resolve('')
			};
			const link2 = {
				range: { start: { x: 5, y: 2 }, end: { x: 40, y: 2 } },
				text: 'https://foo.bar/[this is foo site 2]',
				activate: () => Promise.resolve('')
			};
			linkManager.setLinks({ webLinks: [link1, link2] });
			const links = await linkManager.getLinks();
			deepStrictEqual(links.viewport.webLinks?.[0].text, link2.text);
			deepStrictEqual(links.viewport.webLinks?.[1].text, link1.text);
			const webLink = await linkManager.openRecentLink('url');
			strictEqual(webLink, link2);
			const fileLink = await linkManager.openRecentLink('localFile');
			strictEqual(fileLink, undefined);
		});
		test('should return file links in order', async () => {
			const link1 = {
				range: { start: { x: 1, y: 1 }, end: { x: 32, y: 1 } },
				text: 'file:///C:/users/test/file_1.txt',
				activate: () => Promise.resolve('')
			};
			const link2 = {
				range: { start: { x: 1, y: 2 }, end: { x: 32, y: 2 } },
				text: 'file:///C:/users/test/file_2.txt',
				activate: () => Promise.resolve('')
			};
			linkManager.setLinks({ fileLinks: [link1, link2] });
			const links = await linkManager.getLinks();
			deepStrictEqual(links.viewport.fileLinks?.[0].text, link2.text);
			deepStrictEqual(links.viewport.fileLinks?.[1].text, link1.text);
			const webLink = await linkManager.openRecentLink('url');
			strictEqual(webLink, undefined);
			linkManager.setLinks({ fileLinks: [link2] });
			const fileLink = await linkManager.openRecentLink('localFile');
			strictEqual(fileLink, link2);
		});
	});
});
function upcastPartial<T>(v: Partial<T>): T {
	return v as T;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/links/test/browser/terminalLinkOpeners.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/links/test/browser/terminalLinkOpeners.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { deepStrictEqual } from 'assert';
import { Schemas } from '../../../../../../base/common/network.js';
import { OperatingSystem } from '../../../../../../base/common/platform.js';
import { URI } from '../../../../../../base/common/uri.js';
import { ITextEditorSelection, ITextResourceEditorInput } from '../../../../../../platform/editor/common/editor.js';
import { IFileService, IFileStatWithPartialMetadata } from '../../../../../../platform/files/common/files.js';
import { FileService } from '../../../../../../platform/files/common/fileService.js';
import { TestInstantiationService } from '../../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { ILogService, NullLogService } from '../../../../../../platform/log/common/log.js';
import { IQuickInputService } from '../../../../../../platform/quickinput/common/quickInput.js';
import { IWorkspaceContextService } from '../../../../../../platform/workspace/common/workspace.js';
import { CommandDetectionCapability } from '../../../../../../platform/terminal/common/capabilities/commandDetectionCapability.js';
import { TerminalBuiltinLinkType } from '../../browser/links.js';
import { TerminalLocalFileLinkOpener, TerminalLocalFolderInWorkspaceLinkOpener, TerminalSearchLinkOpener } from '../../browser/terminalLinkOpeners.js';
import { TerminalCapability } from '../../../../../../platform/terminal/common/capabilities/capabilities.js';
import { TerminalCapabilityStore } from '../../../../../../platform/terminal/common/capabilities/terminalCapabilityStore.js';
import { IEditorService } from '../../../../../services/editor/common/editorService.js';
import { IWorkbenchEnvironmentService } from '../../../../../services/environment/common/environmentService.js';
import { TestContextService } from '../../../../../test/common/workbenchTestServices.js';
import type { Terminal } from '@xterm/xterm';
import { IFileQuery, ISearchComplete, ISearchService } from '../../../../../services/search/common/search.js';
import { SearchService } from '../../../../../services/search/common/searchService.js';
import { ITerminalLogService } from '../../../../../../platform/terminal/common/terminal.js';
import { importAMDNodeModule } from '../../../../../../amdX.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { TerminalCommand } from '../../../../../../platform/terminal/common/capabilities/commandDetection/terminalCommand.js';
import type { IMarker } from '@xterm/headless';
import { generateUuid } from '../../../../../../base/common/uuid.js';

interface ITerminalLinkActivationResult {
	source: 'editor' | 'search';
	link: string;
	selection?: ITextEditorSelection;
}

class TestCommandDetectionCapability extends CommandDetectionCapability {
	setCommands(commands: TerminalCommand[]) {
		this._commands = commands;
	}
}

class TestFileService extends FileService {
	private _files: URI[] | '*' = '*';
	override async stat(resource: URI): Promise<IFileStatWithPartialMetadata> {
		if (this._files === '*' || this._files.some(e => e.toString() === resource.toString())) {
			return { isFile: true, isDirectory: false, isSymbolicLink: false } as IFileStatWithPartialMetadata;
		}
		throw new Error('ENOENT');
	}
	setFiles(files: URI[] | '*'): void {
		this._files = files;
	}
}

class TestSearchService extends SearchService {
	private _searchResult: ISearchComplete | undefined;
	override async fileSearch(query: IFileQuery): Promise<ISearchComplete> {
		return this._searchResult!;
	}
	setSearchResult(result: ISearchComplete) {
		this._searchResult = result;
	}
}

class TestTerminalSearchLinkOpener extends TerminalSearchLinkOpener {
	setFileQueryBuilder(value: any) {
		this._fileQueryBuilder = value;
	}
}

suite('Workbench - TerminalLinkOpeners', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	let instantiationService: TestInstantiationService;
	let fileService: TestFileService;
	let searchService: TestSearchService;
	let activationResult: ITerminalLinkActivationResult | undefined;
	let xterm: Terminal;

	setup(async () => {
		instantiationService = store.add(new TestInstantiationService());
		fileService = store.add(new TestFileService(new NullLogService()));
		searchService = store.add(new TestSearchService(null!, null!, null!, null!, null!, null!, null!));
		instantiationService.set(IFileService, fileService);
		instantiationService.set(ILogService, new NullLogService());
		instantiationService.set(ISearchService, searchService);
		instantiationService.set(IWorkspaceContextService, new TestContextService());
		instantiationService.stub(ITerminalLogService, new NullLogService());
		instantiationService.stub(IWorkbenchEnvironmentService, {
			remoteAuthority: undefined
		} as Partial<IWorkbenchEnvironmentService>);
		// Allow intercepting link activations
		activationResult = undefined;
		instantiationService.stub(IQuickInputService, {
			quickAccess: {
				show(link: string) {
					activationResult = { link, source: 'search' };
				}
			}
		} as Partial<IQuickInputService>);
		instantiationService.stub(IEditorService, {
			async openEditor(editor: ITextResourceEditorInput): Promise<any> {
				activationResult = {
					source: 'editor',
					link: editor.resource?.toString()
				};
				// Only assert on selection if it's not the default value
				if (editor.options?.selection && (editor.options.selection.startColumn !== 1 || editor.options.selection.startLineNumber !== 1)) {
					activationResult.selection = editor.options.selection;
				}
			}
		} as Partial<IEditorService>);
		const TerminalCtor = (await importAMDNodeModule<typeof import('@xterm/xterm')>('@xterm/xterm', 'lib/xterm.js')).Terminal;
		xterm = store.add(new TerminalCtor({ allowProposedApi: true }));
	});

	suite('TerminalSearchLinkOpener', () => {
		let opener: TestTerminalSearchLinkOpener;
		let capabilities: TerminalCapabilityStore;
		let commandDetection: TestCommandDetectionCapability;
		let localFileOpener: TerminalLocalFileLinkOpener;

		setup(() => {
			capabilities = store.add(new TerminalCapabilityStore());
			commandDetection = store.add(instantiationService.createInstance(TestCommandDetectionCapability, xterm));
			capabilities.add(TerminalCapability.CommandDetection, commandDetection);
		});

		test('should open single exact match against cwd when searching if it exists when command detection cwd is available', async () => {
			localFileOpener = instantiationService.createInstance(TerminalLocalFileLinkOpener);
			const localFolderOpener = instantiationService.createInstance(TerminalLocalFolderInWorkspaceLinkOpener);
			opener = instantiationService.createInstance(TestTerminalSearchLinkOpener, capabilities, '/initial/cwd', localFileOpener, localFolderOpener, () => OperatingSystem.Linux);
			// Set a fake detected command starting as line 0 to establish the cwd
			commandDetection.setCommands([new TerminalCommand(xterm, {
				command: '',
				commandLineConfidence: 'low',
				exitCode: 0,
				commandStartLineContent: '',
				markProperties: {},
				isTrusted: true,
				cwd: '/initial/cwd',
				timestamp: 0,
				duration: 0,
				executedX: undefined,
				startX: undefined,
				// eslint-disable-next-line local/code-no-any-casts
				marker: {
					line: 0
				} as Partial<IMarker> as any,
				id: generateUuid()
			})]);
			fileService.setFiles([
				URI.from({ scheme: Schemas.file, path: '/initial/cwd/foo/bar.txt' }),
				URI.from({ scheme: Schemas.file, path: '/initial/cwd/foo2/bar.txt' })
			]);
			await opener.open({
				text: 'foo/bar.txt',
				bufferRange: { start: { x: 1, y: 1 }, end: { x: 8, y: 1 } },
				type: TerminalBuiltinLinkType.Search
			});
			deepStrictEqual(activationResult, {
				link: 'file:///initial/cwd/foo/bar.txt',
				source: 'editor'
			});
		});

		test('should open single exact match against cwd for paths containing a separator when searching if it exists, even when command detection isn\'t available', async () => {
			localFileOpener = instantiationService.createInstance(TerminalLocalFileLinkOpener);
			const localFolderOpener = instantiationService.createInstance(TerminalLocalFolderInWorkspaceLinkOpener);
			opener = instantiationService.createInstance(TestTerminalSearchLinkOpener, capabilities, '/initial/cwd', localFileOpener, localFolderOpener, () => OperatingSystem.Linux);
			fileService.setFiles([
				URI.from({ scheme: Schemas.file, path: '/initial/cwd/foo/bar.txt' }),
				URI.from({ scheme: Schemas.file, path: '/initial/cwd/foo2/bar.txt' })
			]);
			await opener.open({
				text: 'foo/bar.txt',
				bufferRange: { start: { x: 1, y: 1 }, end: { x: 8, y: 1 } },
				type: TerminalBuiltinLinkType.Search
			});
			deepStrictEqual(activationResult, {
				link: 'file:///initial/cwd/foo/bar.txt',
				source: 'editor'
			});
		});

		test('should open single exact match against any folder for paths not containing a separator when there is a single search result, even when command detection isn\'t available', async () => {
			localFileOpener = instantiationService.createInstance(TerminalLocalFileLinkOpener);
			const localFolderOpener = instantiationService.createInstance(TerminalLocalFolderInWorkspaceLinkOpener);
			opener = instantiationService.createInstance(TestTerminalSearchLinkOpener, capabilities, '/initial/cwd', localFileOpener, localFolderOpener, () => OperatingSystem.Linux);
			capabilities.remove(TerminalCapability.CommandDetection);
			opener.setFileQueryBuilder({ file: () => null! });
			fileService.setFiles([
				URI.from({ scheme: Schemas.file, path: '/initial/cwd/foo/bar.txt' }),
				URI.from({ scheme: Schemas.file, path: '/initial/cwd/foo2/baz.txt' })
			]);
			searchService.setSearchResult({
				messages: [],
				results: [
					{ resource: URI.from({ scheme: Schemas.file, path: '/initial/cwd/foo/bar.txt' }) }
				]
			});
			await opener.open({
				text: 'bar.txt',
				bufferRange: { start: { x: 1, y: 1 }, end: { x: 8, y: 1 } },
				type: TerminalBuiltinLinkType.Search
			});
			deepStrictEqual(activationResult, {
				link: 'file:///initial/cwd/foo/bar.txt',
				source: 'editor'
			});
		});

		test('should open single exact match against any folder for paths not containing a separator when there are multiple search results, even when command detection isn\'t available', async () => {
			localFileOpener = instantiationService.createInstance(TerminalLocalFileLinkOpener);
			const localFolderOpener = instantiationService.createInstance(TerminalLocalFolderInWorkspaceLinkOpener);
			opener = instantiationService.createInstance(TestTerminalSearchLinkOpener, capabilities, '/initial/cwd', localFileOpener, localFolderOpener, () => OperatingSystem.Linux);
			capabilities.remove(TerminalCapability.CommandDetection);
			opener.setFileQueryBuilder({ file: () => null! });
			fileService.setFiles([
				URI.from({ scheme: Schemas.file, path: '/initial/cwd/foo/bar.txt' }),
				URI.from({ scheme: Schemas.file, path: '/initial/cwd/foo/bar.test.txt' }),
				URI.from({ scheme: Schemas.file, path: '/initial/cwd/foo2/bar.test.txt' })
			]);
			searchService.setSearchResult({
				messages: [],
				results: [
					{ resource: URI.from({ scheme: Schemas.file, path: '/initial/cwd/foo/bar.txt' }) },
					{ resource: URI.from({ scheme: Schemas.file, path: '/initial/cwd/foo/bar.test.txt' }) },
					{ resource: URI.from({ scheme: Schemas.file, path: '/initial/cwd/foo2/bar.test.txt' }) }
				]
			});
			await opener.open({
				text: 'bar.txt',
				bufferRange: { start: { x: 1, y: 1 }, end: { x: 8, y: 1 } },
				type: TerminalBuiltinLinkType.Search
			});
			deepStrictEqual(activationResult, {
				link: 'file:///initial/cwd/foo/bar.txt',
				source: 'editor'
			});
		});

		test('should not open single exact match for paths not containing a when command detection isn\'t available', async () => {
			localFileOpener = instantiationService.createInstance(TerminalLocalFileLinkOpener);
			const localFolderOpener = instantiationService.createInstance(TerminalLocalFolderInWorkspaceLinkOpener);
			opener = instantiationService.createInstance(TestTerminalSearchLinkOpener, capabilities, '/initial/cwd', localFileOpener, localFolderOpener, () => OperatingSystem.Linux);
			fileService.setFiles([
				URI.from({ scheme: Schemas.file, path: '/initial/cwd/foo/bar.txt' }),
				URI.from({ scheme: Schemas.file, path: '/initial/cwd/foo2/bar.txt' })
			]);
			await opener.open({
				text: 'bar.txt',
				bufferRange: { start: { x: 1, y: 1 }, end: { x: 8, y: 1 } },
				type: TerminalBuiltinLinkType.Search
			});
			deepStrictEqual(activationResult, {
				link: 'bar.txt',
				source: 'search'
			});
		});

		suite('macOS/Linux', () => {
			setup(() => {
				localFileOpener = instantiationService.createInstance(TerminalLocalFileLinkOpener);
				const localFolderOpener = instantiationService.createInstance(TerminalLocalFolderInWorkspaceLinkOpener);
				opener = instantiationService.createInstance(TestTerminalSearchLinkOpener, capabilities, '', localFileOpener, localFolderOpener, () => OperatingSystem.Linux);
			});

			test('should apply the cwd to the link only when the file exists and cwdDetection is enabled', async () => {
				const cwd = '/Users/home/folder';
				const absoluteFile = '/Users/home/folder/file.txt';
				fileService.setFiles([
					URI.from({ scheme: Schemas.file, path: absoluteFile }),
					URI.from({ scheme: Schemas.file, path: '/Users/home/folder/other/file.txt' })
				]);

				// Set a fake detected command starting as line 0 to establish the cwd
				commandDetection.setCommands([new TerminalCommand(xterm, {
					command: '',
					commandLineConfidence: 'low',
					isTrusted: true,
					cwd,
					timestamp: 0,
					duration: 0,
					executedX: undefined,
					startX: undefined,
					// eslint-disable-next-line local/code-no-any-casts
					marker: {
						line: 0
					} as Partial<IMarker> as any,
					exitCode: 0,
					commandStartLineContent: '',
					markProperties: {},
					id: generateUuid()
				})]);
				await opener.open({
					text: 'file.txt',
					bufferRange: { start: { x: 1, y: 1 }, end: { x: 8, y: 1 } },
					type: TerminalBuiltinLinkType.Search
				});
				deepStrictEqual(activationResult, {
					link: 'file:///Users/home/folder/file.txt',
					source: 'editor'
				});

				// Clear detected commands and ensure the same request results in a search since there are 2 matches
				commandDetection.setCommands([]);
				opener.setFileQueryBuilder({ file: () => null! });
				searchService.setSearchResult({
					messages: [],
					results: [
						{ resource: URI.from({ scheme: Schemas.file, path: 'file:///Users/home/folder/file.txt' }) },
						{ resource: URI.from({ scheme: Schemas.file, path: 'file:///Users/home/folder/other/file.txt' }) }
					]
				});
				await opener.open({
					text: 'file.txt',
					bufferRange: { start: { x: 1, y: 1 }, end: { x: 8, y: 1 } },
					type: TerminalBuiltinLinkType.Search
				});
				deepStrictEqual(activationResult, {
					link: 'file.txt',
					source: 'search'
				});
			});

			test('should extract column and/or line numbers from links in a workspace containing spaces', async () => {
				localFileOpener = instantiationService.createInstance(TerminalLocalFileLinkOpener);
				const localFolderOpener = instantiationService.createInstance(TerminalLocalFolderInWorkspaceLinkOpener);
				opener = instantiationService.createInstance(TestTerminalSearchLinkOpener, capabilities, '/space folder', localFileOpener, localFolderOpener, () => OperatingSystem.Linux);
				fileService.setFiles([
					URI.from({ scheme: Schemas.file, path: '/space folder/foo/bar.txt' })
				]);
				await opener.open({
					text: './foo/bar.txt:10:5',
					bufferRange: { start: { x: 1, y: 1 }, end: { x: 8, y: 1 } },
					type: TerminalBuiltinLinkType.Search
				});
				deepStrictEqual(activationResult, {
					link: 'file:///space%20folder/foo/bar.txt',
					source: 'editor',
					selection: {
						startColumn: 5,
						startLineNumber: 10,
						endColumn: undefined,
						endLineNumber: undefined
					},
				});
				await opener.open({
					text: './foo/bar.txt:10',
					bufferRange: { start: { x: 1, y: 1 }, end: { x: 8, y: 1 } },
					type: TerminalBuiltinLinkType.Search
				});
				deepStrictEqual(activationResult, {
					link: 'file:///space%20folder/foo/bar.txt',
					source: 'editor',
					selection: {
						startColumn: 1,
						startLineNumber: 10,
						endColumn: undefined,
						endLineNumber: undefined
					},
				});
			});

			test('should extract column and/or line numbers from links and remove trailing periods', async () => {
				localFileOpener = instantiationService.createInstance(TerminalLocalFileLinkOpener);
				const localFolderOpener = instantiationService.createInstance(TerminalLocalFolderInWorkspaceLinkOpener);
				opener = instantiationService.createInstance(TestTerminalSearchLinkOpener, capabilities, '/folder', localFileOpener, localFolderOpener, () => OperatingSystem.Linux);
				fileService.setFiles([
					URI.from({ scheme: Schemas.file, path: '/folder/foo/bar.txt' })
				]);
				await opener.open({
					text: './foo/bar.txt.',
					bufferRange: { start: { x: 1, y: 1 }, end: { x: 8, y: 1 } },
					type: TerminalBuiltinLinkType.Search
				});
				deepStrictEqual(activationResult, {
					link: 'file:///folder/foo/bar.txt',
					source: 'editor',
				});
				await opener.open({
					text: './foo/bar.txt:10:5.',
					bufferRange: { start: { x: 1, y: 1 }, end: { x: 8, y: 1 } },
					type: TerminalBuiltinLinkType.Search
				});
				deepStrictEqual(activationResult, {
					link: 'file:///folder/foo/bar.txt',
					source: 'editor',
					selection: {
						startColumn: 5,
						startLineNumber: 10,
						endColumn: undefined,
						endLineNumber: undefined
					},
				});
				await opener.open({
					text: './foo/bar.txt:10.',
					bufferRange: { start: { x: 1, y: 1 }, end: { x: 8, y: 1 } },
					type: TerminalBuiltinLinkType.Search
				});
				deepStrictEqual(activationResult, {
					link: 'file:///folder/foo/bar.txt',
					source: 'editor',
					selection: {
						startColumn: 1,
						startLineNumber: 10,
						endColumn: undefined,
						endLineNumber: undefined
					},
				});
			});

			test('should extract column and/or line numbers from links and remove grepped lines', async () => {
				localFileOpener = instantiationService.createInstance(TerminalLocalFileLinkOpener);
				const localFolderOpener = instantiationService.createInstance(TerminalLocalFolderInWorkspaceLinkOpener);
				opener = instantiationService.createInstance(TestTerminalSearchLinkOpener, capabilities, '/folder', localFileOpener, localFolderOpener, () => OperatingSystem.Linux);
				fileService.setFiles([
					URI.from({ scheme: Schemas.file, path: '/folder/foo/bar.txt' })
				]);
				await opener.open({
					text: './foo/bar.txt:10:5:import { ILoveVSCode } from \'./foo/bar.ts\';',
					bufferRange: { start: { x: 1, y: 1 }, end: { x: 8, y: 1 } },
					type: TerminalBuiltinLinkType.Search
				});
				deepStrictEqual(activationResult, {
					link: 'file:///folder/foo/bar.txt',
					source: 'editor',
					selection: {
						startColumn: 5,
						startLineNumber: 10,
						endColumn: undefined,
						endLineNumber: undefined
					},
				});
				await opener.open({
					text: './foo/bar.txt:10:import { ILoveVSCode } from \'./foo/bar.ts\';',
					bufferRange: { start: { x: 1, y: 1 }, end: { x: 8, y: 1 } },
					type: TerminalBuiltinLinkType.Search
				});
				deepStrictEqual(activationResult, {
					link: 'file:///folder/foo/bar.txt',
					source: 'editor',
					selection: {
						startColumn: 1,
						startLineNumber: 10,
						endColumn: undefined,
						endLineNumber: undefined
					},
				});
			});

			// Test for https://github.com/microsoft/vscode/pull/200919#discussion_r1428124196
			test('should extract column and/or line numbers from links and remove grepped lines incl singular spaces', async () => {
				localFileOpener = instantiationService.createInstance(TerminalLocalFileLinkOpener);
				const localFolderOpener = instantiationService.createInstance(TerminalLocalFolderInWorkspaceLinkOpener);
				opener = instantiationService.createInstance(TestTerminalSearchLinkOpener, capabilities, '/folder', localFileOpener, localFolderOpener, () => OperatingSystem.Linux);
				fileService.setFiles([
					URI.from({ scheme: Schemas.file, path: '/folder/foo/bar.txt' })
				]);
				await opener.open({
					text: './foo/bar.txt:10:5: ',
					bufferRange: { start: { x: 1, y: 1 }, end: { x: 8, y: 1 } },
					type: TerminalBuiltinLinkType.Search
				});
				deepStrictEqual(activationResult, {
					link: 'file:///folder/foo/bar.txt',
					source: 'editor',
					selection: {
						startColumn: 5,
						startLineNumber: 10,
						endColumn: undefined,
						endLineNumber: undefined
					},
				});
				await opener.open({
					text: './foo/bar.txt:10: ',
					bufferRange: { start: { x: 1, y: 1 }, end: { x: 8, y: 1 } },
					type: TerminalBuiltinLinkType.Search
				});
				deepStrictEqual(activationResult, {
					link: 'file:///folder/foo/bar.txt',
					source: 'editor',
					selection: {
						startColumn: 1,
						startLineNumber: 10,
						endColumn: undefined,
						endLineNumber: undefined
					},
				});
			});

			test('should extract line numbers from links and remove ruby stack traces', async () => {
				localFileOpener = instantiationService.createInstance(TerminalLocalFileLinkOpener);
				const localFolderOpener = instantiationService.createInstance(TerminalLocalFolderInWorkspaceLinkOpener);
				opener = instantiationService.createInstance(TestTerminalSearchLinkOpener, capabilities, '/folder', localFileOpener, localFolderOpener, () => OperatingSystem.Linux);
				fileService.setFiles([
					URI.from({ scheme: Schemas.file, path: '/folder/foo/bar.rb' })
				]);
				await opener.open({
					text: './foo/bar.rb:30:in `<main>`',
					bufferRange: { start: { x: 1, y: 1 }, end: { x: 8, y: 1 } },
					type: TerminalBuiltinLinkType.Search
				});
				deepStrictEqual(activationResult, {
					link: 'file:///folder/foo/bar.rb',
					source: 'editor',
					selection: {
						startColumn: 1,
						startLineNumber: 30,
						endColumn: undefined,
						endLineNumber: undefined
					},
				});
			});

			test('should not misinterpret ISO 8601 timestamps as line:column numbers', async () => {
				localFileOpener = instantiationService.createInstance(TerminalLocalFileLinkOpener);
				const localFolderOpener = instantiationService.createInstance(TerminalLocalFolderInWorkspaceLinkOpener);
				opener = instantiationService.createInstance(TestTerminalSearchLinkOpener, capabilities, '/folder', localFileOpener, localFolderOpener, () => OperatingSystem.Linux);
				// Intentionally not set the file so it does not get picked up as localFile.
				fileService.setFiles([]);
				await opener.open({
					text: 'test-2025-04-28T11:03:09+02:00.log',
					bufferRange: { start: { x: 1, y: 1 }, end: { x: 34, y: 1 } },
					type: TerminalBuiltinLinkType.Search
				});
				deepStrictEqual(activationResult, {
					link: 'test-2025-04-28T11:03:09+02:00.log',
					source: 'search'
				});
				await opener.open({
					text: './test-2025-04-28T11:03:09+02:00.log',
					bufferRange: { start: { x: 1, y: 1 }, end: { x: 36, y: 1 } },
					type: TerminalBuiltinLinkType.Search
				});
				deepStrictEqual(activationResult, {
					link: 'test-2025-04-28T11:03:09+02:00.log',
					source: 'search'
				});

				// Test when file exists, and there are preceding arguments
				fileService.setFiles([
					URI.from({ scheme: Schemas.file, path: '/folder/test-2025-04-28T14:30:00+02:00.log' })
				]);
				await opener.open({
					text: './test-2025-04-28T14:30:00+02:00.log',
					bufferRange: { start: { x: 10, y: 1 }, end: { x: 45, y: 1 } },
					type: TerminalBuiltinLinkType.LocalFile
				});
				deepStrictEqual(activationResult, {
					link: 'file:///folder/test-2025-04-28T14%3A30%3A00%2B02%3A00.log',
					source: 'editor'
				});
			});


		});

		suite('Windows', () => {
			setup(() => {
				localFileOpener = instantiationService.createInstance(TerminalLocalFileLinkOpener);
				const localFolderOpener = instantiationService.createInstance(TerminalLocalFolderInWorkspaceLinkOpener);
				opener = instantiationService.createInstance(TestTerminalSearchLinkOpener, capabilities, '', localFileOpener, localFolderOpener, () => OperatingSystem.Windows);
			});

			test('should apply the cwd to the link only when the file exists and cwdDetection is enabled', async () => {
				localFileOpener = instantiationService.createInstance(TerminalLocalFileLinkOpener);
				const localFolderOpener = instantiationService.createInstance(TerminalLocalFolderInWorkspaceLinkOpener);
				opener = instantiationService.createInstance(TestTerminalSearchLinkOpener, capabilities, 'c:\\Users', localFileOpener, localFolderOpener, () => OperatingSystem.Windows);

				const cwd = 'c:\\Users\\home\\folder';
				const absoluteFile = 'c:\\Users\\home\\folder\\file.txt';

				fileService.setFiles([
					URI.file('/c:/Users/home/folder/file.txt')
				]);

				// Set a fake detected command starting as line 0 to establish the cwd
				commandDetection.setCommands([new TerminalCommand(xterm, {
					exitCode: 0,
					commandStartLineContent: '',
					markProperties: {},
					command: '',
					commandLineConfidence: 'low',
					isTrusted: true,
					cwd,
					executedX: undefined,
					startX: undefined,
					timestamp: 0,
					duration: 0,
					// eslint-disable-next-line local/code-no-any-casts
					marker: {
						line: 0
					} as Partial<IMarker> as any,
					id: generateUuid()
				})]);
				await opener.open({
					text: 'file.txt',
					bufferRange: { start: { x: 1, y: 1 }, end: { x: 8, y: 1 } },
					type: TerminalBuiltinLinkType.Search
				});
				deepStrictEqual(activationResult, {
					link: 'file:///c%3A/Users/home/folder/file.txt',
					source: 'editor'
				});

				// Clear detected commands and ensure the same request results in a search
				commandDetection.setCommands([]);
				opener.setFileQueryBuilder({ file: () => null! });
				searchService.setSearchResult({
					messages: [],
					results: [
						{ resource: URI.file(absoluteFile) },
						{ resource: URI.file('/c:/Users/home/folder/other/file.txt') }
					]
				});
				await opener.open({
					text: 'file.txt',
					bufferRange: { start: { x: 1, y: 1 }, end: { x: 8, y: 1 } },
					type: TerminalBuiltinLinkType.Search
				});
				deepStrictEqual(activationResult, {
					link: 'file.txt',
					source: 'search'
				});
			});

			test('should extract column and/or line numbers from links in a workspace containing spaces', async () => {
				localFileOpener = instantiationService.createInstance(TerminalLocalFileLinkOpener);
				const localFolderOpener = instantiationService.createInstance(TerminalLocalFolderInWorkspaceLinkOpener);
				opener = instantiationService.createInstance(TestTerminalSearchLinkOpener, capabilities, 'c:/space folder', localFileOpener, localFolderOpener, () => OperatingSystem.Windows);
				fileService.setFiles([
					URI.from({ scheme: Schemas.file, path: 'c:/space folder/foo/bar.txt' })
				]);
				await opener.open({
					text: './foo/bar.txt:10:5',
					bufferRange: { start: { x: 1, y: 1 }, end: { x: 8, y: 1 } },
					type: TerminalBuiltinLinkType.Search
				});
				deepStrictEqual(activationResult, {
					link: 'file:///c%3A/space%20folder/foo/bar.txt',
					source: 'editor',
					selection: {
						startColumn: 5,
						startLineNumber: 10,
						endColumn: undefined,
						endLineNumber: undefined
					},
				});
				await opener.open({
					text: './foo/bar.txt:10',
					bufferRange: { start: { x: 1, y: 1 }, end: { x: 8, y: 1 } },
					type: TerminalBuiltinLinkType.Search
				});
				deepStrictEqual(activationResult, {
					link: 'file:///c%3A/space%20folder/foo/bar.txt',
					source: 'editor',
					selection: {
						startColumn: 1,
						startLineNumber: 10,
						endColumn: undefined,
						endLineNumber: undefined
					},
				});
				await opener.open({
					text: '.\\foo\\bar.txt:10:5',
					bufferRange: { start: { x: 1, y: 1 }, end: { x: 8, y: 1 } },
					type: TerminalBuiltinLinkType.Search
				});
				deepStrictEqual(activationResult, {
					link: 'file:///c%3A/space%20folder/foo/bar.txt',
					source: 'editor',
					selection: {
						startColumn: 5,
						startLineNumber: 10,
						endColumn: undefined,
						endLineNumber: undefined
					},
				});
				await opener.open({
					text: '.\\foo\\bar.txt:10',
					bufferRange: { start: { x: 1, y: 1 }, end: { x: 8, y: 1 } },
					type: TerminalBuiltinLinkType.Search
				});
				deepStrictEqual(activationResult, {
					link: 'file:///c%3A/space%20folder/foo/bar.txt',
					source: 'editor',
					selection: {
						startColumn: 1,
						startLineNumber: 10,
						endColumn: undefined,
						endLineNumber: undefined
					},
				});
			});

			test('should extract column and/or line numbers from links and remove trailing periods', async () => {
				localFileOpener = instantiationService.createInstance(TerminalLocalFileLinkOpener);
				const localFolderOpener = instantiationService.createInstance(TerminalLocalFolderInWorkspaceLinkOpener);
				opener = instantiationService.createInstance(TestTerminalSearchLinkOpener, capabilities, 'c:/folder', localFileOpener, localFolderOpener, () => OperatingSystem.Windows);
				fileService.setFiles([
					URI.from({ scheme: Schemas.file, path: 'c:/folder/foo/bar.txt' })
				]);
				await opener.open({
					text: './foo/bar.txt.',
					bufferRange: { start: { x: 1, y: 1 }, end: { x: 8, y: 1 } },
					type: TerminalBuiltinLinkType.Search
				});
				deepStrictEqual(activationResult, {
					link: 'file:///c%3A/folder/foo/bar.txt',
					source: 'editor',
				});
				await opener.open({
					text: './foo/bar.txt:10:5.',
					bufferRange: { start: { x: 1, y: 1 }, end: { x: 8, y: 1 } },
					type: TerminalBuiltinLinkType.Search
				});
				deepStrictEqual(activationResult, {
					link: 'file:///c%3A/folder/foo/bar.txt',
					source: 'editor',
					selection: {
						startColumn: 5,
						startLineNumber: 10,
						endColumn: undefined,
						endLineNumber: undefined
					},
				});
				await opener.open({
					text: './foo/bar.txt:10.',
					bufferRange: { start: { x: 1, y: 1 }, end: { x: 8, y: 1 } },
					type: TerminalBuiltinLinkType.Search
				});
				deepStrictEqual(activationResult, {
					link: 'file:///c%3A/folder/foo/bar.txt',
					source: 'editor',
					selection: {
						startColumn: 1,
						startLineNumber: 10,
						endColumn: undefined,
						endLineNumber: undefined
					},
				});
				await opener.open({
					text: '.\\foo\\bar.txt.',
					bufferRange: { start: { x: 1, y: 1 }, end: { x: 8, y: 1 } },
					type: TerminalBuiltinLinkType.Search
				});
				deepStrictEqual(activationResult, {
					link: 'file:///c%3A/folder/foo/bar.txt',
					source: 'editor',
				});
				await opener.open({
					text: '.\\foo\\bar.txt:2:5.',
					bufferRange: { start: { x: 1, y: 1 }, end: { x: 8, y: 1 } },
					type: TerminalBuiltinLinkType.Search
				});
				deepStrictEqual(activationResult, {
					link: 'file:///c%3A/folder/foo/bar.txt',
					source: 'editor',
					selection: {
						startColumn: 5,
						startLineNumber: 2,
						endColumn: undefined,
						endLineNumber: undefined
					},
				});
				await opener.open({
					text: '.\\foo\\bar.txt:2.',
					bufferRange: { start: { x: 1, y: 1 }, end: { x: 8, y: 1 } },
					type: TerminalBuiltinLinkType.Search
				});
				deepStrictEqual(activationResult, {
					link: 'file:///c%3A/folder/foo/bar.txt',
					source: 'editor',
					selection: {
						startColumn: 1,
						startLineNumber: 2,
						endColumn: undefined,
						endLineNumber: undefined
					},
				});
			});

			test('should extract column and/or line numbers from links and remove grepped lines', async () => {
				localFileOpener = instantiationService.createInstance(TerminalLocalFileLinkOpener);
				const localFolderOpener = instantiationService.createInstance(TerminalLocalFolderInWorkspaceLinkOpener);
				opener = instantiationService.createInstance(TestTerminalSearchLinkOpener, capabilities, 'c:/folder', localFileOpener, localFolderOpener, () => OperatingSystem.Windows);
				fileService.setFiles([
					URI.from({ scheme: Schemas.file, path: 'c:/folder/foo/bar.txt' })
				]);
				await opener.open({
					text: './foo/bar.txt:10:5:import { ILoveVSCode } from \'./foo/bar.ts\';',
					bufferRange: { start: { x: 1, y: 1 }, end: { x: 8, y: 1 } },
					type: TerminalBuiltinLinkType.Search
				});
				deepStrictEqual(activationResult, {
					link: 'file:///c%3A/folder/foo/bar.txt',
					source: 'editor',
					selection: {
						startColumn: 5,
						startLineNumber: 10,
						endColumn: undefined,
						endLineNumber: undefined
					},
				});
				await opener.open({
					text: './foo/bar.txt:10:import { ILoveVSCode } from \'./foo/bar.ts\';',
					bufferRange: { start: { x: 1, y: 1 }, end: { x: 8, y: 1 } },
					type: TerminalBuiltinLinkType.Search
				});
				deepStrictEqual(activationResult, {
					link: 'file:///c%3A/folder/foo/bar.txt',
					source: 'editor',
					selection: {
						startColumn: 1,
						startLineNumber: 10,
						endColumn: undefined,
						endLineNumber: undefined
					},
				});
				await opener.open({
					text: '.\\foo\\bar.txt:10:5:import { ILoveVSCode } from \'./foo/bar.ts\';',
					bufferRange: { start: { x: 1, y: 1 }, end: { x: 8, y: 1 } },
					type: TerminalBuiltinLinkType.Search
				});
				deepStrictEqual(activationResult, {
					link: 'file:///c%3A/folder/foo/bar.txt',
					source: 'editor',
					selection: {
						startColumn: 5,
						startLineNumber: 10,
						endColumn: undefined,
						endLineNumber: undefined
					},
				});
				await opener.open({
					text: '.\\foo\\bar.txt:10:import { ILoveVSCode } from \'./foo/bar.ts\';',
					bufferRange: { start: { x: 1, y: 1 }, end: { x: 8, y: 1 } },
					type: TerminalBuiltinLinkType.Search
				});
				deepStrictEqual(activationResult, {
					link: 'file:///c%3A/folder/foo/bar.txt',
					source: 'editor',
					selection: {
						startColumn: 1,
						startLineNumber: 10,
						endColumn: undefined,
						endLineNumber: undefined
					},
				});
			});

			// Test for https://github.com/microsoft/vscode/pull/200919#discussion_r1428124196
			test('should extract column and/or line numbers from links and remove grepped lines incl singular spaces', async () => {
				localFileOpener = instantiationService.createInstance(TerminalLocalFileLinkOpener);
				const localFolderOpener = instantiationService.createInstance(TerminalLocalFolderInWorkspaceLinkOpener);
				opener = instantiationService.createInstance(TestTerminalSearchLinkOpener, capabilities, 'c:/folder', localFileOpener, localFolderOpener, () => OperatingSystem.Windows);
				fileService.setFiles([
					URI.from({ scheme: Schemas.file, path: 'c:/folder/foo/bar.txt' })
				]);
				await opener.open({
					text: './foo/bar.txt:10:5: ',
					bufferRange: { start: { x: 1, y: 1 }, end: { x: 8, y: 1 } },
					type: TerminalBuiltinLinkType.Search
				});
				deepStrictEqual(activationResult, {
					link: 'file:///c%3A/folder/foo/bar.txt',
					source: 'editor',
					selection: {
						startColumn: 5,
						startLineNumber: 10,
						endColumn: undefined,
						endLineNumber: undefined
					},
				});
				await opener.open({
					text: './foo/bar.txt:10: ',
					bufferRange: { start: { x: 1, y: 1 }, end: { x: 8, y: 1 } },
					type: TerminalBuiltinLinkType.Search
				});
				deepStrictEqual(activationResult, {
					link: 'file:///c%3A/folder/foo/bar.txt',
					source: 'editor',
					selection: {
						startColumn: 1,
						startLineNumber: 10,
						endColumn: undefined,
						endLineNumber: undefined
					},
				});
				await opener.open({
					text: '.\\foo\\bar.txt:10:5: ',
					bufferRange: { start: { x: 1, y: 1 }, end: { x: 8, y: 1 } },
					type: TerminalBuiltinLinkType.Search
				});
				deepStrictEqual(activationResult, {
					link: 'file:///c%3A/folder/foo/bar.txt',
					source: 'editor',
					selection: {
						startColumn: 5,
						startLineNumber: 10,
						endColumn: undefined,
						endLineNumber: undefined
					},
				});
				await opener.open({
					text: '.\\foo\\bar.txt:10: ',
					bufferRange: { start: { x: 1, y: 1 }, end: { x: 8, y: 1 } },
					type: TerminalBuiltinLinkType.Search
				});
				deepStrictEqual(activationResult, {
					link: 'file:///c%3A/folder/foo/bar.txt',
					source: 'editor',
					selection: {
						startColumn: 1,
						startLineNumber: 10,
						endColumn: undefined,
						endLineNumber: undefined
					},
				});
			});

			test('should extract line numbers from links and remove ruby stack traces', async () => {
				localFileOpener = instantiationService.createInstance(TerminalLocalFileLinkOpener);
				const localFolderOpener = instantiationService.createInstance(TerminalLocalFolderInWorkspaceLinkOpener);
				opener = instantiationService.createInstance(TestTerminalSearchLinkOpener, capabilities, 'c:/folder', localFileOpener, localFolderOpener, () => OperatingSystem.Windows);
				fileService.setFiles([
					URI.from({ scheme: Schemas.file, path: 'c:/folder/foo/bar.rb' })
				]);
				await opener.open({
					text: './foo/bar.rb:30:in `<main>`',
					bufferRange: { start: { x: 1, y: 1 }, end: { x: 8, y: 1 } },
					type: TerminalBuiltinLinkType.Search
				});
				deepStrictEqual(activationResult, {
					link: 'file:///c%3A/folder/foo/bar.rb',
					source: 'editor',
					selection: {
						startColumn: 1, // Since Ruby doesn't appear to put columns in stack traces, this should be 1
						startLineNumber: 30,
						endColumn: undefined,
						endLineNumber: undefined
					},
				});
				await opener.open({
					text: '.\\foo\\bar.rb:30:in `<main>`',
					bufferRange: { start: { x: 1, y: 1 }, end: { x: 8, y: 1 } },
					type: TerminalBuiltinLinkType.Search
				});
				deepStrictEqual(activationResult, {
					link: 'file:///c%3A/folder/foo/bar.rb',
					source: 'editor',
					selection: {
						startColumn: 1, // Since Ruby doesn't appear to put columns in stack traces, this should be 1
						startLineNumber: 30,
						endColumn: undefined,
						endLineNumber: undefined
					},
				});
			});

			test('should not misinterpret ISO 8601 timestamps as line:column numbers', async () => {
				localFileOpener = instantiationService.createInstance(TerminalLocalFileLinkOpener);
				const localFolderOpener = instantiationService.createInstance(TerminalLocalFolderInWorkspaceLinkOpener);
				opener = instantiationService.createInstance(TestTerminalSearchLinkOpener, capabilities, 'c:/folder', localFileOpener, localFolderOpener, () => OperatingSystem.Windows);
				// Intentionally not set the file so it does not get picked up as localFile.
				fileService.setFiles([]);
				await opener.open({
					text: 'test-2025-04-28T11:03:09+02:00.log',
					bufferRange: { start: { x: 1, y: 1 }, end: { x: 34, y: 1 } },
					type: TerminalBuiltinLinkType.Search
				});
				deepStrictEqual(activationResult, {
					link: 'test-2025-04-28T11:03:09+02:00.log',
					source: 'search'
				});
				await opener.open({
					text: '.\\test-2025-04-28T11:03:09+02:00.log',
					bufferRange: { start: { x: 1, y: 1 }, end: { x: 36, y: 1 } },
					type: TerminalBuiltinLinkType.Search
				});
				deepStrictEqual(activationResult, {
					link: 'test-2025-04-28T11:03:09+02:00.log',
					source: 'search'
				});

				// Test when file exists, and there are preceding arguments
				fileService.setFiles([
					URI.from({ scheme: Schemas.file, path: 'c:/folder/test-2025-04-28T14:30:00+02:00.log' })
				]);
				await opener.open({
					text: '.\\test-2025-04-28T14:30:00+02:00.log',
					bufferRange: { start: { x: 10, y: 1 }, end: { x: 45, y: 1 } },
					type: TerminalBuiltinLinkType.LocalFile
				});
				deepStrictEqual(activationResult, {
					link: 'file:///c%3A/folder/test-2025-04-28T14%3A30%3A00%2B02%3A00.log',
					source: 'editor'
				});
			});
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/links/test/browser/terminalLinkParsing.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/links/test/browser/terminalLinkParsing.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { deepStrictEqual, ok, strictEqual } from 'assert';
import { OperatingSystem } from '../../../../../../base/common/platform.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { detectLinks, detectLinkSuffixes, getLinkSuffix, IParsedLink, removeLinkQueryString, removeLinkSuffix } from '../../browser/terminalLinkParsing.js';

interface ITestLink {
	link: string;
	prefix: string | undefined;
	suffix: string | undefined;
	// TODO: These has vars would be nicer as a flags enum
	hasRow: boolean;
	hasCol: boolean;
	hasRowEnd?: boolean;
	hasColEnd?: boolean;
}

const operatingSystems: ReadonlyArray<OperatingSystem> = [
	OperatingSystem.Linux,
	OperatingSystem.Macintosh,
	OperatingSystem.Windows
];
const osTestPath: { [key: number | OperatingSystem]: string } = {
	[OperatingSystem.Linux]: '/test/path/linux',
	[OperatingSystem.Macintosh]: '/test/path/macintosh',
	[OperatingSystem.Windows]: 'C:\\test\\path\\windows'
};
const osLabel: { [key: number | OperatingSystem]: string } = {
	[OperatingSystem.Linux]: '[Linux]',
	[OperatingSystem.Macintosh]: '[macOS]',
	[OperatingSystem.Windows]: '[Windows]'
};

const testRow = 339;
const testCol = 12;
const testRowEnd = 341;
const testColEnd = 789;
const testLinks: ITestLink[] = [
	// Simple
	{ link: 'foo', prefix: undefined, suffix: undefined, hasRow: false, hasCol: false },
	{ link: 'foo:339', prefix: undefined, suffix: ':339', hasRow: true, hasCol: false },
	{ link: 'foo:339:12', prefix: undefined, suffix: ':339:12', hasRow: true, hasCol: true },
	{ link: 'foo:339:12-789', prefix: undefined, suffix: ':339:12-789', hasRow: true, hasCol: true, hasRowEnd: false, hasColEnd: true },
	{ link: 'foo:339.12', prefix: undefined, suffix: ':339.12', hasRow: true, hasCol: true },
	{ link: 'foo:339.12-789', prefix: undefined, suffix: ':339.12-789', hasRow: true, hasCol: true, hasRowEnd: false, hasColEnd: true },
	{ link: 'foo:339.12-341.789', prefix: undefined, suffix: ':339.12-341.789', hasRow: true, hasCol: true, hasRowEnd: true, hasColEnd: true },
	{ link: 'foo#339', prefix: undefined, suffix: '#339', hasRow: true, hasCol: false },
	{ link: 'foo#339:12', prefix: undefined, suffix: '#339:12', hasRow: true, hasCol: true },
	{ link: 'foo#339:12-789', prefix: undefined, suffix: '#339:12-789', hasRow: true, hasCol: true, hasRowEnd: false, hasColEnd: true },
	{ link: 'foo#339.12', prefix: undefined, suffix: '#339.12', hasRow: true, hasCol: true },
	{ link: 'foo#339.12-789', prefix: undefined, suffix: '#339.12-789', hasRow: true, hasCol: true, hasRowEnd: false, hasColEnd: true },
	{ link: 'foo#339.12-341.789', prefix: undefined, suffix: '#339.12-341.789', hasRow: true, hasCol: true, hasRowEnd: true, hasColEnd: true },
	{ link: 'foo 339', prefix: undefined, suffix: ' 339', hasRow: true, hasCol: false },
	{ link: 'foo 339:12', prefix: undefined, suffix: ' 339:12', hasRow: true, hasCol: true },
	{ link: 'foo 339:12-789', prefix: undefined, suffix: ' 339:12-789', hasRow: true, hasCol: true, hasRowEnd: false, hasColEnd: true },
	{ link: 'foo 339.12', prefix: undefined, suffix: ' 339.12', hasRow: true, hasCol: true },
	{ link: 'foo 339.12-789', prefix: undefined, suffix: ' 339.12-789', hasRow: true, hasCol: true, hasRowEnd: false, hasColEnd: true },
	{ link: 'foo 339.12-341.789', prefix: undefined, suffix: ' 339.12-341.789', hasRow: true, hasCol: true, hasRowEnd: true, hasColEnd: true },
	{ link: 'foo, 339', prefix: undefined, suffix: ', 339', hasRow: true, hasCol: false },

	// Double quotes
	{ link: '"foo",339', prefix: '"', suffix: '",339', hasRow: true, hasCol: false },
	{ link: '"foo",339:12', prefix: '"', suffix: '",339:12', hasRow: true, hasCol: true },
	{ link: '"foo",339.12', prefix: '"', suffix: '",339.12', hasRow: true, hasCol: true },
	{ link: '"foo", line 339', prefix: '"', suffix: '", line 339', hasRow: true, hasCol: false },
	{ link: '"foo", line 339, col 12', prefix: '"', suffix: '", line 339, col 12', hasRow: true, hasCol: true },
	{ link: '"foo", line 339, column 12', prefix: '"', suffix: '", line 339, column 12', hasRow: true, hasCol: true },
	{ link: '"foo":line 339', prefix: '"', suffix: '":line 339', hasRow: true, hasCol: false },
	{ link: '"foo":line 339, col 12', prefix: '"', suffix: '":line 339, col 12', hasRow: true, hasCol: true },
	{ link: '"foo":line 339, column 12', prefix: '"', suffix: '":line 339, column 12', hasRow: true, hasCol: true },
	{ link: '"foo": line 339', prefix: '"', suffix: '": line 339', hasRow: true, hasCol: false },
	{ link: '"foo": line 339, col 12', prefix: '"', suffix: '": line 339, col 12', hasRow: true, hasCol: true },
	{ link: '"foo": line 339, column 12', prefix: '"', suffix: '": line 339, column 12', hasRow: true, hasCol: true },
	{ link: '"foo" on line 339', prefix: '"', suffix: '" on line 339', hasRow: true, hasCol: false },
	{ link: '"foo" on line 339, col 12', prefix: '"', suffix: '" on line 339, col 12', hasRow: true, hasCol: true },
	{ link: '"foo" on line 339, column 12', prefix: '"', suffix: '" on line 339, column 12', hasRow: true, hasCol: true },
	{ link: '"foo" line 339', prefix: '"', suffix: '" line 339', hasRow: true, hasCol: false },
	{ link: '"foo" line 339 column 12', prefix: '"', suffix: '" line 339 column 12', hasRow: true, hasCol: true },

	// Single quotes
	{ link: '\'foo\',339', prefix: '\'', suffix: '\',339', hasRow: true, hasCol: false },
	{ link: '\'foo\',339:12', prefix: '\'', suffix: '\',339:12', hasRow: true, hasCol: true },
	{ link: '\'foo\',339.12', prefix: '\'', suffix: '\',339.12', hasRow: true, hasCol: true },
	{ link: '\'foo\', line 339', prefix: '\'', suffix: '\', line 339', hasRow: true, hasCol: false },
	{ link: '\'foo\', line 339, col 12', prefix: '\'', suffix: '\', line 339, col 12', hasRow: true, hasCol: true },
	{ link: '\'foo\', line 339, column 12', prefix: '\'', suffix: '\', line 339, column 12', hasRow: true, hasCol: true },
	{ link: '\'foo\':line 339', prefix: '\'', suffix: '\':line 339', hasRow: true, hasCol: false },
	{ link: '\'foo\':line 339, col 12', prefix: '\'', suffix: '\':line 339, col 12', hasRow: true, hasCol: true },
	{ link: '\'foo\':line 339, column 12', prefix: '\'', suffix: '\':line 339, column 12', hasRow: true, hasCol: true },
	{ link: '\'foo\': line 339', prefix: '\'', suffix: '\': line 339', hasRow: true, hasCol: false },
	{ link: '\'foo\': line 339, col 12', prefix: '\'', suffix: '\': line 339, col 12', hasRow: true, hasCol: true },
	{ link: '\'foo\': line 339, column 12', prefix: '\'', suffix: '\': line 339, column 12', hasRow: true, hasCol: true },
	{ link: '\'foo\' on line 339', prefix: '\'', suffix: '\' on line 339', hasRow: true, hasCol: false },
	{ link: '\'foo\' on line 339, col 12', prefix: '\'', suffix: '\' on line 339, col 12', hasRow: true, hasCol: true },
	{ link: '\'foo\' on line 339, column 12', prefix: '\'', suffix: '\' on line 339, column 12', hasRow: true, hasCol: true },
	{ link: '\'foo\' line 339', prefix: '\'', suffix: '\' line 339', hasRow: true, hasCol: false },
	{ link: '\'foo\' line 339 column 12', prefix: '\'', suffix: '\' line 339 column 12', hasRow: true, hasCol: true },

	// No quotes
	{ link: 'foo, line 339', prefix: undefined, suffix: ', line 339', hasRow: true, hasCol: false },
	{ link: 'foo, line 339, col 12', prefix: undefined, suffix: ', line 339, col 12', hasRow: true, hasCol: true },
	{ link: 'foo, line 339, column 12', prefix: undefined, suffix: ', line 339, column 12', hasRow: true, hasCol: true },
	{ link: 'foo:line 339', prefix: undefined, suffix: ':line 339', hasRow: true, hasCol: false },
	{ link: 'foo:line 339, col 12', prefix: undefined, suffix: ':line 339, col 12', hasRow: true, hasCol: true },
	{ link: 'foo:line 339, column 12', prefix: undefined, suffix: ':line 339, column 12', hasRow: true, hasCol: true },
	{ link: 'foo: line 339', prefix: undefined, suffix: ': line 339', hasRow: true, hasCol: false },
	{ link: 'foo: line 339, col 12', prefix: undefined, suffix: ': line 339, col 12', hasRow: true, hasCol: true },
	{ link: 'foo: line 339, column 12', prefix: undefined, suffix: ': line 339, column 12', hasRow: true, hasCol: true },
	{ link: 'foo on line 339', prefix: undefined, suffix: ' on line 339', hasRow: true, hasCol: false },
	{ link: 'foo on line 339, col 12', prefix: undefined, suffix: ' on line 339, col 12', hasRow: true, hasCol: true },
	{ link: 'foo on line 339, column 12', prefix: undefined, suffix: ' on line 339, column 12', hasRow: true, hasCol: true },
	{ link: 'foo line 339', prefix: undefined, suffix: ' line 339', hasRow: true, hasCol: false },
	{ link: 'foo line 339 column 12', prefix: undefined, suffix: ' line 339 column 12', hasRow: true, hasCol: true },

	// Parentheses
	{ link: 'foo(339)', prefix: undefined, suffix: '(339)', hasRow: true, hasCol: false },
	{ link: 'foo(339,12)', prefix: undefined, suffix: '(339,12)', hasRow: true, hasCol: true },
	{ link: 'foo(339, 12)', prefix: undefined, suffix: '(339, 12)', hasRow: true, hasCol: true },
	{ link: 'foo (339)', prefix: undefined, suffix: ' (339)', hasRow: true, hasCol: false },
	{ link: 'foo (339,12)', prefix: undefined, suffix: ' (339,12)', hasRow: true, hasCol: true },
	{ link: 'foo (339, 12)', prefix: undefined, suffix: ' (339, 12)', hasRow: true, hasCol: true },
	{ link: 'foo: (339)', prefix: undefined, suffix: ': (339)', hasRow: true, hasCol: false },
	{ link: 'foo: (339,12)', prefix: undefined, suffix: ': (339,12)', hasRow: true, hasCol: true },
	{ link: 'foo: (339, 12)', prefix: undefined, suffix: ': (339, 12)', hasRow: true, hasCol: true },
	{ link: 'foo(339:12)', prefix: undefined, suffix: '(339:12)', hasRow: true, hasCol: true },
	{ link: 'foo (339:12)', prefix: undefined, suffix: ' (339:12)', hasRow: true, hasCol: true },

	// Square brackets
	{ link: 'foo[339]', prefix: undefined, suffix: '[339]', hasRow: true, hasCol: false },
	{ link: 'foo[339,12]', prefix: undefined, suffix: '[339,12]', hasRow: true, hasCol: true },
	{ link: 'foo[339, 12]', prefix: undefined, suffix: '[339, 12]', hasRow: true, hasCol: true },
	{ link: 'foo [339]', prefix: undefined, suffix: ' [339]', hasRow: true, hasCol: false },
	{ link: 'foo [339,12]', prefix: undefined, suffix: ' [339,12]', hasRow: true, hasCol: true },
	{ link: 'foo [339, 12]', prefix: undefined, suffix: ' [339, 12]', hasRow: true, hasCol: true },
	{ link: 'foo: [339]', prefix: undefined, suffix: ': [339]', hasRow: true, hasCol: false },
	{ link: 'foo: [339,12]', prefix: undefined, suffix: ': [339,12]', hasRow: true, hasCol: true },
	{ link: 'foo: [339, 12]', prefix: undefined, suffix: ': [339, 12]', hasRow: true, hasCol: true },
	{ link: 'foo[339:12]', prefix: undefined, suffix: '[339:12]', hasRow: true, hasCol: true },
	{ link: 'foo [339:12]', prefix: undefined, suffix: ' [339:12]', hasRow: true, hasCol: true },

	// OCaml-style
	{ link: '"foo", line 339, character 12', prefix: '"', suffix: '", line 339, character 12', hasRow: true, hasCol: true },
	{ link: '"foo", line 339, characters 12-789', prefix: '"', suffix: '", line 339, characters 12-789', hasRow: true, hasCol: true, hasColEnd: true },
	{ link: '"foo", lines 339-341', prefix: '"', suffix: '", lines 339-341', hasRow: true, hasCol: false, hasRowEnd: true },
	{ link: '"foo", lines 339-341, characters 12-789', prefix: '"', suffix: '", lines 339-341, characters 12-789', hasRow: true, hasCol: true, hasRowEnd: true, hasColEnd: true },

	// Non-breaking space
	{ link: 'foo\u00A0339:12', prefix: undefined, suffix: '\u00A0339:12', hasRow: true, hasCol: true },
	{ link: '"foo" on line 339,\u00A0column 12', prefix: '"', suffix: '" on line 339,\u00A0column 12', hasRow: true, hasCol: true },
	{ link: '\'foo\' on line\u00A0339, column 12', prefix: '\'', suffix: '\' on line\u00A0339, column 12', hasRow: true, hasCol: true },
	{ link: 'foo (339,\u00A012)', prefix: undefined, suffix: ' (339,\u00A012)', hasRow: true, hasCol: true },
	{ link: 'foo\u00A0[339, 12]', prefix: undefined, suffix: '\u00A0[339, 12]', hasRow: true, hasCol: true },
];
const testLinksWithSuffix = testLinks.filter(e => !!e.suffix);

suite('TerminalLinkParsing', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	suite('removeLinkSuffix', () => {
		for (const testLink of testLinks) {
			test('`' + testLink.link + '`', () => {
				deepStrictEqual(
					removeLinkSuffix(testLink.link),
					testLink.suffix === undefined ? testLink.link : testLink.link.replace(testLink.suffix, '')
				);
			});
		}
	});
	suite('getLinkSuffix', () => {
		for (const testLink of testLinks) {
			test('`' + testLink.link + '`', () => {
				deepStrictEqual(
					getLinkSuffix(testLink.link),
					testLink.suffix === undefined ? null : {
						row: testLink.hasRow ? testRow : undefined,
						col: testLink.hasCol ? testCol : undefined,
						rowEnd: testLink.hasRowEnd ? testRowEnd : undefined,
						colEnd: testLink.hasColEnd ? testColEnd : undefined,
						suffix: {
							index: testLink.link.length - testLink.suffix.length,
							text: testLink.suffix
						}
					} as ReturnType<typeof getLinkSuffix>
				);
			});
		}
	});
	suite('detectLinkSuffixes', () => {
		for (const testLink of testLinks) {
			test('`' + testLink.link + '`', () => {
				deepStrictEqual(
					detectLinkSuffixes(testLink.link),
					testLink.suffix === undefined ? [] : [{
						row: testLink.hasRow ? testRow : undefined,
						col: testLink.hasCol ? testCol : undefined,
						rowEnd: testLink.hasRowEnd ? testRowEnd : undefined,
						colEnd: testLink.hasColEnd ? testColEnd : undefined,
						suffix: {
							index: testLink.link.length - testLink.suffix.length,
							text: testLink.suffix
						}
					} as ReturnType<typeof getLinkSuffix>]
				);
			});
		}

		test('foo(1, 2) bar[3, 4] baz on line 5', () => {
			deepStrictEqual(
				detectLinkSuffixes('foo(1, 2) bar[3, 4] baz on line 5'),
				[
					{
						col: 2,
						row: 1,
						rowEnd: undefined,
						colEnd: undefined,
						suffix: {
							index: 3,
							text: '(1, 2)'
						}
					},
					{
						col: 4,
						row: 3,
						rowEnd: undefined,
						colEnd: undefined,
						suffix: {
							index: 13,
							text: '[3, 4]'
						}
					},
					{
						col: undefined,
						row: 5,
						rowEnd: undefined,
						colEnd: undefined,
						suffix: {
							index: 23,
							text: ' on line 5'
						}
					}
				]
			);
		});
	});
	suite('removeLinkQueryString', () => {
		test('should remove any query string from the link', () => {
			strictEqual(removeLinkQueryString('?a=b'), '');
			strictEqual(removeLinkQueryString('foo?a=b'), 'foo');
			strictEqual(removeLinkQueryString('./foo?a=b'), './foo');
			strictEqual(removeLinkQueryString('/foo/bar?a=b'), '/foo/bar');
			strictEqual(removeLinkQueryString('foo?a=b?'), 'foo');
			strictEqual(removeLinkQueryString('foo?a=b&c=d'), 'foo');
		});
		test('should respect ? in UNC paths', () => {
			strictEqual(removeLinkQueryString('\\\\?\\foo?a=b'), '\\\\?\\foo');
		});
	});
	suite('detectLinks', () => {
		test('foo(1, 2) bar[3, 4] "baz" on line 5', () => {
			deepStrictEqual(
				detectLinks('foo(1, 2) bar[3, 4] "baz" on line 5', OperatingSystem.Linux),
				[
					{
						path: {
							index: 0,
							text: 'foo'
						},
						prefix: undefined,
						suffix: {
							col: 2,
							row: 1,
							rowEnd: undefined,
							colEnd: undefined,
							suffix: {
								index: 3,
								text: '(1, 2)'
							}
						}
					},
					{
						path: {
							index: 10,
							text: 'bar'
						},
						prefix: undefined,
						suffix: {
							col: 4,
							row: 3,
							rowEnd: undefined,
							colEnd: undefined,
							suffix: {
								index: 13,
								text: '[3, 4]'
							}
						}
					},
					{
						path: {
							index: 21,
							text: 'baz'
						},
						prefix: {
							index: 20,
							text: '"'
						},
						suffix: {
							col: undefined,
							row: 5,
							rowEnd: undefined,
							colEnd: undefined,
							suffix: {
								index: 24,
								text: '" on line 5'
							}
						}
					}
				] as IParsedLink[]
			);
		});

		test('should detect multiple links when opening brackets are in the text', () => {
			deepStrictEqual(
				detectLinks('notlink[foo:45]', OperatingSystem.Linux),
				[
					{
						path: {
							index: 0,
							text: 'notlink[foo'
						},
						prefix: undefined,
						suffix: {
							col: undefined,
							row: 45,
							rowEnd: undefined,
							colEnd: undefined,
							suffix: {
								index: 11,
								text: ':45'
							}
						}
					},
					{
						path: {
							index: 8,
							text: 'foo'
						},
						prefix: undefined,
						suffix: {
							col: undefined,
							row: 45,
							rowEnd: undefined,
							colEnd: undefined,
							suffix: {
								index: 11,
								text: ':45'
							}
						}
					},
				] as IParsedLink[]
			);
		});

		test('should extract the link prefix', () => {
			deepStrictEqual(
				detectLinks('"foo", line 5, col 6', OperatingSystem.Linux),
				[
					{
						path: {
							index: 1,
							text: 'foo'
						},
						prefix: {
							index: 0,
							text: '"',
						},
						suffix: {
							row: 5,
							col: 6,
							rowEnd: undefined,
							colEnd: undefined,
							suffix: {
								index: 4,
								text: '", line 5, col 6'
							}
						}
					},
				] as IParsedLink[]
			);
		});

		test('should be smart about determining the link prefix when multiple prefix characters exist', () => {
			deepStrictEqual(
				detectLinks('echo \'"foo", line 5, col 6\'', OperatingSystem.Linux),
				[
					{
						path: {
							index: 7,
							text: 'foo'
						},
						prefix: {
							index: 6,
							text: '"',
						},
						suffix: {
							row: 5,
							col: 6,
							rowEnd: undefined,
							colEnd: undefined,
							suffix: {
								index: 10,
								text: '", line 5, col 6'
							}
						}
					},
				] as IParsedLink[],
				'The outer single quotes should be excluded from the link prefix and suffix'
			);
		});

		test('should detect both suffix and non-suffix links on a single line', () => {
			deepStrictEqual(
				detectLinks('PS C:\\Github\\microsoft\\vscode> echo \'"foo", line 5, col 6\'', OperatingSystem.Windows),
				[
					{
						path: {
							index: 3,
							text: 'C:\\Github\\microsoft\\vscode'
						},
						prefix: undefined,
						suffix: undefined
					},
					{
						path: {
							index: 38,
							text: 'foo'
						},
						prefix: {
							index: 37,
							text: '"',
						},
						suffix: {
							row: 5,
							col: 6,
							rowEnd: undefined,
							colEnd: undefined,
							suffix: {
								index: 41,
								text: '", line 5, col 6'
							}
						}
					}
				] as IParsedLink[]
			);
		});

		suite('"|"', () => {
			test('should exclude pipe characters from link paths', () => {
				deepStrictEqual(
					detectLinks('|C:\\Github\\microsoft\\vscode|', OperatingSystem.Windows),
					[
						{
							path: {
								index: 1,
								text: 'C:\\Github\\microsoft\\vscode'
							},
							prefix: undefined,
							suffix: undefined
						}
					] as IParsedLink[]
				);
			});
			test('should exclude pipe characters from link paths with suffixes', () => {
				deepStrictEqual(
					detectLinks('|C:\\Github\\microsoft\\vscode:400|', OperatingSystem.Windows),
					[
						{
							path: {
								index: 1,
								text: 'C:\\Github\\microsoft\\vscode'
							},
							prefix: undefined,
							suffix: {
								col: undefined,
								row: 400,
								rowEnd: undefined,
								colEnd: undefined,
								suffix: {
									index: 27,
									text: ':400'
								}
							}
						}
					] as IParsedLink[]
				);
			});
		});

		suite('"<>"', () => {
			for (const os of operatingSystems) {
				test(`should exclude bracket characters from link paths ${osLabel[os]}`, () => {
					deepStrictEqual(
						detectLinks(`<${osTestPath[os]}<`, os),
						[
							{
								path: {
									index: 1,
									text: osTestPath[os]
								},
								prefix: undefined,
								suffix: undefined
							}
						] as IParsedLink[]
					);
					deepStrictEqual(
						detectLinks(`>${osTestPath[os]}>`, os),
						[
							{
								path: {
									index: 1,
									text: osTestPath[os]
								},
								prefix: undefined,
								suffix: undefined
							}
						] as IParsedLink[]
					);
				});
				test(`should exclude bracket characters from link paths with suffixes ${osLabel[os]}`, () => {
					deepStrictEqual(
						detectLinks(`<${osTestPath[os]}:400<`, os),
						[
							{
								path: {
									index: 1,
									text: osTestPath[os]
								},
								prefix: undefined,
								suffix: {
									col: undefined,
									row: 400,
									rowEnd: undefined,
									colEnd: undefined,
									suffix: {
										index: 1 + osTestPath[os].length,
										text: ':400'
									}
								}
							}
						] as IParsedLink[]
					);
					deepStrictEqual(
						detectLinks(`>${osTestPath[os]}:400>`, os),
						[
							{
								path: {
									index: 1,
									text: osTestPath[os]
								},
								prefix: undefined,
								suffix: {
									col: undefined,
									row: 400,
									rowEnd: undefined,
									colEnd: undefined,
									suffix: {
										index: 1 + osTestPath[os].length,
										text: ':400'
									}
								}
							}
						] as IParsedLink[]
					);
				});
			}
		});

		suite('query strings', () => {
			for (const os of operatingSystems) {
				test(`should exclude query strings from link paths ${osLabel[os]}`, () => {
					deepStrictEqual(
						detectLinks(`${osTestPath[os]}?a=b`, os),
						[
							{
								path: {
									index: 0,
									text: osTestPath[os]
								},
								prefix: undefined,
								suffix: undefined
							}
						] as IParsedLink[]
					);
					deepStrictEqual(
						detectLinks(`${osTestPath[os]}?a=b&c=d`, os),
						[
							{
								path: {
									index: 0,
									text: osTestPath[os]
								},
								prefix: undefined,
								suffix: undefined
							}
						] as IParsedLink[]
					);
				});
				test('should not detect links starting with ? within query strings that contain posix-style paths (#204195)', () => {
					// ? appended to the cwd will exist since it's just the cwd
					strictEqual(detectLinks(`http://foo.com/?bar=/a/b&baz=c`, os).some(e => e.path.text.startsWith('?')), false);
				});
				test('should not detect links starting with ? within query strings that contain Windows-style paths (#204195)', () => {
					// ? appended to the cwd will exist since it's just the cwd
					strictEqual(detectLinks(`http://foo.com/?bar=a:\\b&baz=c`, os).some(e => e.path.text.startsWith('?')), false);
				});
			}
		});

		suite('should detect file names in git diffs', () => {
			test('--- a/foo/bar', () => {
				deepStrictEqual(
					detectLinks('--- a/foo/bar', OperatingSystem.Linux),
					[
						{
							path: {
								index: 6,
								text: 'foo/bar'
							},
							prefix: undefined,
							suffix: undefined
						}
					] as IParsedLink[]
				);
			});
			test('+++ b/foo/bar', () => {
				deepStrictEqual(
					detectLinks('+++ b/foo/bar', OperatingSystem.Linux),
					[
						{
							path: {
								index: 6,
								text: 'foo/bar'
							},
							prefix: undefined,
							suffix: undefined
						}
					] as IParsedLink[]
				);
			});
			test('diff --git a/foo/bar b/foo/baz', () => {
				deepStrictEqual(
					detectLinks('diff --git a/foo/bar b/foo/baz', OperatingSystem.Linux),
					[
						{
							path: {
								index: 13,
								text: 'foo/bar'
							},
							prefix: undefined,
							suffix: undefined
						},
						{
							path: {
								index: 23,
								text: 'foo/baz'
							},
							prefix: undefined,
							suffix: undefined
						}
					] as IParsedLink[]
				);
			});
		});

		suite('should detect 3 suffix links on a single line', () => {
			for (let i = 0; i < testLinksWithSuffix.length - 2; i++) {
				const link1 = testLinksWithSuffix[i];
				const link2 = testLinksWithSuffix[i + 1];
				const link3 = testLinksWithSuffix[i + 2];
				const line = ` ${link1.link} ${link2.link} ${link3.link} `;
				test('`' + line.replaceAll('\u00A0', '<nbsp>') + '`', () => {
					strictEqual(detectLinks(line, OperatingSystem.Linux).length, 3);
					ok(link1.suffix);
					ok(link2.suffix);
					ok(link3.suffix);
					const detectedLink1: IParsedLink = {
						prefix: link1.prefix ? {
							index: 1,
							text: link1.prefix
						} : undefined,
						path: {
							index: 1 + (link1.prefix?.length ?? 0),
							text: link1.link.replace(link1.suffix, '').replace(link1.prefix || '', '')
						},
						suffix: {
							row: link1.hasRow ? testRow : undefined,
							col: link1.hasCol ? testCol : undefined,
							rowEnd: link1.hasRowEnd ? testRowEnd : undefined,
							colEnd: link1.hasColEnd ? testColEnd : undefined,
							suffix: {
								index: 1 + (link1.link.length - link1.suffix.length),
								text: link1.suffix
							}
						}
					};
					const detectedLink2: IParsedLink = {
						prefix: link2.prefix ? {
							index: (detectedLink1.prefix?.index ?? detectedLink1.path.index) + link1.link.length + 1,
							text: link2.prefix
						} : undefined,
						path: {
							index: (detectedLink1.prefix?.index ?? detectedLink1.path.index) + link1.link.length + 1 + (link2.prefix ?? '').length,
							text: link2.link.replace(link2.suffix, '').replace(link2.prefix ?? '', '')
						},
						suffix: {
							row: link2.hasRow ? testRow : undefined,
							col: link2.hasCol ? testCol : undefined,
							rowEnd: link2.hasRowEnd ? testRowEnd : undefined,
							colEnd: link2.hasColEnd ? testColEnd : undefined,
							suffix: {
								index: (detectedLink1.prefix?.index ?? detectedLink1.path.index) + link1.link.length + 1 + (link2.link.length - link2.suffix.length),
								text: link2.suffix
							}
						}
					};
					const detectedLink3: IParsedLink = {
						prefix: link3.prefix ? {
							index: (detectedLink2.prefix?.index ?? detectedLink2.path.index) + link2.link.length + 1,
							text: link3.prefix
						} : undefined,
						path: {
							index: (detectedLink2.prefix?.index ?? detectedLink2.path.index) + link2.link.length + 1 + (link3.prefix ?? '').length,
							text: link3.link.replace(link3.suffix, '').replace(link3.prefix ?? '', '')
						},
						suffix: {
							row: link3.hasRow ? testRow : undefined,
							col: link3.hasCol ? testCol : undefined,
							rowEnd: link3.hasRowEnd ? testRowEnd : undefined,
							colEnd: link3.hasColEnd ? testColEnd : undefined,
							suffix: {
								index: (detectedLink2.prefix?.index ?? detectedLink2.path.index) + link2.link.length + 1 + (link3.link.length - link3.suffix.length),
								text: link3.suffix
							}
						}
					};
					deepStrictEqual(
						detectLinks(line, OperatingSystem.Linux),
						[detectedLink1, detectedLink2, detectedLink3]
					);
				});
			}
		});
		suite('should ignore links with suffixes when the path itself is the empty string', () => {
			deepStrictEqual(
				detectLinks('""",1', OperatingSystem.Linux),
				[] as IParsedLink[]
			);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/links/test/browser/terminalLocalLinkDetector.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/links/test/browser/terminalLocalLinkDetector.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isWindows, OperatingSystem } from '../../../../../../base/common/platform.js';
import { format } from '../../../../../../base/common/strings.js';
import { IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../../../platform/configuration/test/common/testConfigurationService.js';
import { TestInstantiationService } from '../../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { TerminalBuiltinLinkType } from '../../browser/links.js';
import { TerminalLocalLinkDetector } from '../../browser/terminalLocalLinkDetector.js';
import { TerminalCapabilityStore } from '../../../../../../platform/terminal/common/capabilities/terminalCapabilityStore.js';
import { assertLinkHelper } from './linkTestUtils.js';
import type { Terminal } from '@xterm/xterm';
import { timeout } from '../../../../../../base/common/async.js';
import { strictEqual } from 'assert';
import { TerminalLinkResolver } from '../../browser/terminalLinkResolver.js';
import { IFileService, IFileStatWithPartialMetadata } from '../../../../../../platform/files/common/files.js';
import { TestContextService } from '../../../../../test/common/workbenchTestServices.js';
import { URI } from '../../../../../../base/common/uri.js';
import { NullLogService } from '../../../../../../platform/log/common/log.js';
import { ITerminalLogService } from '../../../../../../platform/terminal/common/terminal.js';
import { importAMDNodeModule } from '../../../../../../amdX.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { IWorkspaceContextService } from '../../../../../../platform/workspace/common/workspace.js';
import { IUriIdentityService } from '../../../../../../platform/uriIdentity/common/uriIdentity.js';
import { UriIdentityService } from '../../../../../../platform/uriIdentity/common/uriIdentityService.js';
import { FileService } from '../../../../../../platform/files/common/fileService.js';
import { isString } from '../../../../../../base/common/types.js';

const unixLinks: (string | { link: string; resource: URI })[] = [
	// Absolute
	'/foo',
	'/foo/bar',
	'/foo/[bar]',
	'/foo/[bar].baz',
	'/foo/[bar]/baz',
	'/foo/bar+more',
	// URI file://
	{ link: 'file:///foo', resource: URI.file('/foo') },
	{ link: 'file:///foo/bar', resource: URI.file('/foo/bar') },
	{ link: 'file:///foo/bar%20baz', resource: URI.file('/foo/bar baz') },
	// User home
	{ link: '~/foo', resource: URI.file('/home/foo') },
	// Relative
	{ link: './foo', resource: URI.file('/parent/cwd/foo') },
	{ link: './$foo', resource: URI.file('/parent/cwd/$foo') },
	{ link: '../foo', resource: URI.file('/parent/foo') },
	{ link: 'foo/bar', resource: URI.file('/parent/cwd/foo/bar') },
	{ link: 'foo/bar+more', resource: URI.file('/parent/cwd/foo/bar+more') },
];

const unixLinksWithIso: (string | { link: string; resource: URI })[] = [
	// ISO 8601 timestamps - tested separately to avoid line/column suffix conflicts
	{ link: './test-2025-04-28T11:03:09+02:00.log', resource: URI.file('/parent/cwd/test-2025-04-28T11:03:09+02:00.log') },
];

const windowsLinks: (string | { link: string; resource: URI })[] = [
	// Absolute
	'c:\\foo',
	{ link: '\\\\?\\C:\\foo', resource: URI.file('C:\\foo') },
	'c:/foo',
	'c:/foo/bar',
	'c:\\foo\\bar',
	'c:\\foo\\bar+more',
	'c:\\foo/bar\\baz',
	// URI file://
	{ link: 'file:///c:/foo', resource: URI.file('c:\\foo') },
	{ link: 'file:///c:/foo/bar', resource: URI.file('c:\\foo\\bar') },
	{ link: 'file:///c:/foo/bar%20baz', resource: URI.file('c:\\foo\\bar baz') },
	// User home
	{ link: '~\\foo', resource: URI.file('C:\\Home\\foo') },
	{ link: '~/foo', resource: URI.file('C:\\Home\\foo') },
	// Relative
	{ link: '.\\foo', resource: URI.file('C:\\Parent\\Cwd\\foo') },
	{ link: './foo', resource: URI.file('C:\\Parent\\Cwd\\foo') },
	{ link: './$foo', resource: URI.file('C:\\Parent\\Cwd\\$foo') },
	{ link: '..\\foo', resource: URI.file('C:\\Parent\\foo') },
	{ link: 'foo/bar', resource: URI.file('C:\\Parent\\Cwd\\foo\\bar') },
	{ link: 'foo/bar', resource: URI.file('C:\\Parent\\Cwd\\foo\\bar') },
	{ link: 'foo/[bar]', resource: URI.file('C:\\Parent\\Cwd\\foo\\[bar]') },
	{ link: 'foo/[bar].baz', resource: URI.file('C:\\Parent\\Cwd\\foo\\[bar].baz') },
	{ link: 'foo/[bar]/baz', resource: URI.file('C:\\Parent\\Cwd\\foo\\[bar]/baz') },
	{ link: 'foo\\bar', resource: URI.file('C:\\Parent\\Cwd\\foo\\bar') },
	{ link: 'foo\\[bar].baz', resource: URI.file('C:\\Parent\\Cwd\\foo\\[bar].baz') },
	{ link: 'foo\\[bar]\\baz', resource: URI.file('C:\\Parent\\Cwd\\foo\\[bar]\\baz') },
	{ link: 'foo\\bar+more', resource: URI.file('C:\\Parent\\Cwd\\foo\\bar+more') },
];

const windowsLinksWithIso: (string | { link: string; resource: URI })[] = [
	// ISO 8601 timestamps - tested separately to avoid line/column suffix conflicts
	{ link: '.\\test-2025-04-28T11:03:09+02:00.log', resource: URI.file('C:\\Parent\\Cwd\\test-2025-04-28T11:03:09+02:00.log') },
];

interface LinkFormatInfo {
	urlFormat: string;
	/**
	 * The start offset to the buffer range that is not in the actual link (but is in the matched
	 * area.
	 */
	linkCellStartOffset?: number;
	/**
	 * The end offset to the buffer range that is not in the actual link (but is in the matched
	 * area.
	 */
	linkCellEndOffset?: number;
	line?: string;
	column?: string;
}

const supportedLinkFormats: LinkFormatInfo[] = [
	{ urlFormat: '{0}' },
	{ urlFormat: '{0}" on line {1}', line: '5' },
	{ urlFormat: '{0}" on line {1}, column {2}', line: '5', column: '3' },
	{ urlFormat: '{0}":line {1}', line: '5' },
	{ urlFormat: '{0}":line {1}, column {2}', line: '5', column: '3' },
	{ urlFormat: '{0}": line {1}', line: '5' },
	{ urlFormat: '{0}": line {1}, col {2}', line: '5', column: '3' },
	{ urlFormat: '{0}({1})', line: '5' },
	{ urlFormat: '{0} ({1})', line: '5' },
	{ urlFormat: '{0}, {1}', line: '5' },
	{ urlFormat: '{0}({1},{2})', line: '5', column: '3' },
	{ urlFormat: '{0} ({1},{2})', line: '5', column: '3' },
	{ urlFormat: '{0}: ({1},{2})', line: '5', column: '3' },
	{ urlFormat: '{0}({1}, {2})', line: '5', column: '3' },
	{ urlFormat: '{0} ({1}, {2})', line: '5', column: '3' },
	{ urlFormat: '{0}: ({1}, {2})', line: '5', column: '3' },
	{ urlFormat: '{0}({1}:{2})', line: '5', column: '3' },
	{ urlFormat: '{0} ({1}:{2})', line: '5', column: '3' },
	{ urlFormat: '{0}:{1}', line: '5' },
	{ urlFormat: '{0}:{1}:{2}', line: '5', column: '3' },
	{ urlFormat: '{0} {1}:{2}', line: '5', column: '3' },
	{ urlFormat: '{0}[{1}]', line: '5' },
	{ urlFormat: '{0} [{1}]', line: '5' },
	{ urlFormat: '{0}[{1},{2}]', line: '5', column: '3' },
	{ urlFormat: '{0} [{1},{2}]', line: '5', column: '3' },
	{ urlFormat: '{0}: [{1},{2}]', line: '5', column: '3' },
	{ urlFormat: '{0}[{1}, {2}]', line: '5', column: '3' },
	{ urlFormat: '{0} [{1}, {2}]', line: '5', column: '3' },
	{ urlFormat: '{0}: [{1}, {2}]', line: '5', column: '3' },
	{ urlFormat: '{0}[{1}:{2}]', line: '5', column: '3' },
	{ urlFormat: '{0} [{1}:{2}]', line: '5', column: '3' },
	{ urlFormat: '{0}",{1}', line: '5' },
	{ urlFormat: '{0}\',{1}', line: '5' },
	{ urlFormat: '{0}#{1}', line: '5' },
	{ urlFormat: '{0}#{1}:{2}', line: '5', column: '5' }
];

const windowsFallbackLinks: (string | { link: string; resource: URI })[] = [
	'C:\\foo bar',
	'C:\\foo bar\\baz',
	'C:\\foo\\bar baz',
	'C:\\foo/bar baz'
];

const supportedFallbackLinkFormats: LinkFormatInfo[] = [
	// Python style error: File "<path>", line <line>
	{ urlFormat: 'File "{0}"', linkCellStartOffset: 5 },
	{ urlFormat: 'File "{0}", line {1}', line: '5', linkCellStartOffset: 5 },
	// Unknown tool #200166: FILE  <path>:<line>:<col>
	{ urlFormat: ' FILE  {0}', linkCellStartOffset: 7 },
	{ urlFormat: ' FILE  {0}:{1}', line: '5', linkCellStartOffset: 7 },
	{ urlFormat: ' FILE  {0}:{1}:{2}', line: '5', column: '3', linkCellStartOffset: 7 },
	// Some C++ compile error formats
	{ urlFormat: '{0}({1}) :', line: '5', linkCellEndOffset: -2 },
	{ urlFormat: '{0}({1},{2}) :', line: '5', column: '3', linkCellEndOffset: -2 },
	{ urlFormat: '{0}({1}, {2}) :', line: '5', column: '3', linkCellEndOffset: -2 },
	{ urlFormat: '{0}({1}):', line: '5', linkCellEndOffset: -1 },
	{ urlFormat: '{0}({1},{2}):', line: '5', column: '3', linkCellEndOffset: -1 },
	{ urlFormat: '{0}({1}, {2}):', line: '5', column: '3', linkCellEndOffset: -1 },
	{ urlFormat: '{0}:{1} :', line: '5', linkCellEndOffset: -2 },
	{ urlFormat: '{0}:{1}:{2} :', line: '5', column: '3', linkCellEndOffset: -2 },
	{ urlFormat: '{0}:{1}:', line: '5', linkCellEndOffset: -1 },
	{ urlFormat: '{0}:{1}:{2}:', line: '5', column: '3', linkCellEndOffset: -1 },
	// PowerShell prompt
	{ urlFormat: 'PS {0}>', linkCellStartOffset: 3, linkCellEndOffset: -1 },
	// Cmd prompt
	{ urlFormat: '{0}>', linkCellEndOffset: -1 },
	// The whole line is the path
	{ urlFormat: '{0}' },
];

class TestFileService extends FileService {
	private _files: URI[] | '*' = '*';
	override async stat(resource: URI): Promise<IFileStatWithPartialMetadata> {
		if (this._files === '*' || this._files.some(e => e.toString() === resource.toString())) {
			return { isFile: true, isDirectory: false, isSymbolicLink: false } as IFileStatWithPartialMetadata;
		}
		throw new Error('ENOENT');
	}
	setFiles(files: URI[] | '*'): void {
		this._files = files;
	}
}

suite('Workbench - TerminalLocalLinkDetector', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	let instantiationService: TestInstantiationService;
	let configurationService: TestConfigurationService;
	let fileService: TestFileService;
	let detector: TerminalLocalLinkDetector;
	let resolver: TerminalLinkResolver;
	let xterm: Terminal;
	let validResources: URI[];

	async function assertLinks(
		type: TerminalBuiltinLinkType,
		text: string,
		expected: ({ uri: URI; range: [number, number][] })[]
	) {
		let to;
		const race = await Promise.race([
			assertLinkHelper(text, expected, detector, type).then(() => 'success'),
			(to = timeout(2)).then(() => 'timeout')
		]);
		strictEqual(race, 'success', `Awaiting link assertion for "${text}" timed out`);
		to.cancel();
	}

	async function assertLinksWithWrapped(link: string, resource?: URI) {
		const uri = resource ?? URI.file(link);
		await assertLinks(TerminalBuiltinLinkType.LocalFile, link, [{ uri, range: [[1, 1], [link.length, 1]] }]);
		await assertLinks(TerminalBuiltinLinkType.LocalFile, ` ${link} `, [{ uri, range: [[2, 1], [link.length + 1, 1]] }]);
		await assertLinks(TerminalBuiltinLinkType.LocalFile, `(${link})`, [{ uri, range: [[2, 1], [link.length + 1, 1]] }]);
		await assertLinks(TerminalBuiltinLinkType.LocalFile, `[${link}]`, [{ uri, range: [[2, 1], [link.length + 1, 1]] }]);
	}

	setup(async () => {
		instantiationService = store.add(new TestInstantiationService());
		configurationService = new TestConfigurationService();
		fileService = store.add(new TestFileService(new NullLogService()));
		instantiationService.stub(IConfigurationService, configurationService);
		// Override the setFiles method to work with validResources for testing
		fileService.setFiles(validResources);
		instantiationService.set(IFileService, fileService);
		instantiationService.set(IWorkspaceContextService, new TestContextService());
		instantiationService.set(IUriIdentityService, store.add(new UriIdentityService(fileService)));
		instantiationService.stub(ITerminalLogService, new NullLogService());
		resolver = instantiationService.createInstance(TerminalLinkResolver);
		validResources = [];

		const TerminalCtor = (await importAMDNodeModule<typeof import('@xterm/xterm')>('@xterm/xterm', 'lib/xterm.js')).Terminal;
		xterm = new TerminalCtor({ allowProposedApi: true, cols: 80, rows: 30 });
	});

	suite('platform independent', () => {
		setup(() => {
			detector = instantiationService.createInstance(TerminalLocalLinkDetector, xterm, store.add(new TerminalCapabilityStore()), {
				initialCwd: '/parent/cwd',
				os: OperatingSystem.Linux,
				remoteAuthority: undefined,
				userHome: '/home',
				backend: undefined
			}, resolver);
		});

		test('should support multiple link results', async () => {
			validResources = [
				URI.file('/parent/cwd/foo'),
				URI.file('/parent/cwd/bar')
			];
			fileService.setFiles(validResources);
			await assertLinks(TerminalBuiltinLinkType.LocalFile, './foo ./bar', [
				{ range: [[1, 1], [5, 1]], uri: URI.file('/parent/cwd/foo') },
				{ range: [[7, 1], [11, 1]], uri: URI.file('/parent/cwd/bar') }
			]);
		});

		test('should support trimming extra quotes', async () => {
			validResources = [URI.file('/parent/cwd/foo')];
			fileService.setFiles(validResources);
			await assertLinks(TerminalBuiltinLinkType.LocalFile, '"foo"" on line 5', [
				{ range: [[1, 1], [16, 1]], uri: URI.file('/parent/cwd/foo') }
			]);
		});

		test('should support trimming extra square brackets', async () => {
			validResources = [URI.file('/parent/cwd/foo')];
			fileService.setFiles(validResources);
			await assertLinks(TerminalBuiltinLinkType.LocalFile, '"foo]" on line 5', [
				{ range: [[1, 1], [16, 1]], uri: URI.file('/parent/cwd/foo') }
			]);
		});

		test('should support finding links after brackets', async () => {
			validResources = [URI.file('/parent/cwd/foo')];
			fileService.setFiles(validResources);
			await assertLinks(TerminalBuiltinLinkType.LocalFile, 'bar[foo:5', [
				{ range: [[5, 1], [9, 1]], uri: URI.file('/parent/cwd/foo') }
			]);
		});
	});

	suite('macOS/Linux', () => {
		setup(() => {
			detector = instantiationService.createInstance(TerminalLocalLinkDetector, xterm, store.add(new TerminalCapabilityStore()), {
				initialCwd: '/parent/cwd',
				os: OperatingSystem.Linux,
				remoteAuthority: undefined,
				userHome: '/home',
				backend: undefined
			}, resolver);
		});

		for (const l of unixLinks) {
			const baseLink = isString(l) ? l : l.link;
			const resource = isString(l) ? URI.file(l) : l.resource;
			suite(`Link: ${baseLink}`, () => {
				for (let i = 0; i < supportedLinkFormats.length; i++) {
					const linkFormat = supportedLinkFormats[i];
					const formattedLink = format(linkFormat.urlFormat, baseLink, linkFormat.line, linkFormat.column);
					test(`should detect in "${formattedLink}"`, async () => {
						validResources = [resource];
						fileService.setFiles(validResources);
						await assertLinksWithWrapped(formattedLink, resource);
					});
				}
			});
		}

		test('Git diff links', async () => {
			validResources = [URI.file('/parent/cwd/foo/bar')];
			fileService.setFiles(validResources);
			await assertLinks(TerminalBuiltinLinkType.LocalFile, `diff --git a/foo/bar b/foo/bar`, [
				{ uri: validResources[0], range: [[14, 1], [20, 1]] },
				{ uri: validResources[0], range: [[24, 1], [30, 1]] }
			]);
			await assertLinks(TerminalBuiltinLinkType.LocalFile, `--- a/foo/bar`, [{ uri: validResources[0], range: [[7, 1], [13, 1]] }]);
			await assertLinks(TerminalBuiltinLinkType.LocalFile, `+++ b/foo/bar`, [{ uri: validResources[0], range: [[7, 1], [13, 1]] }]);
		});

		// Test ISO 8601 links separately with only base format to avoid suffix conflicts
		// Note: Only test plain format as colons are excluded path characters in the regex,
		// so wrapped contexts (spaces, parentheses, brackets) won't work
		for (const l of unixLinksWithIso) {
			const baseLink = typeof l === 'string' ? l : l.link;
			const resource = typeof l === 'string' ? URI.file(l) : l.resource;
			test(`should detect ISO 8601 link: ${baseLink}`, async () => {
				validResources = [resource];
				fileService.setFiles(validResources);
				await assertLinks(TerminalBuiltinLinkType.LocalFile, baseLink, [{ uri: resource, range: [[1, 1], [baseLink.length, 1]] }]);
			});
		}
	});

	// Only test these when on Windows because there is special behavior around replacing separators
	// in URI that cannot be changed
	if (isWindows) {
		suite('Windows', () => {
			const wslUnixToWindowsPathMap: Map<string, string> = new Map();

			setup(() => {
				detector = instantiationService.createInstance(TerminalLocalLinkDetector, xterm, store.add(new TerminalCapabilityStore()), {
					initialCwd: 'C:\\Parent\\Cwd',
					os: OperatingSystem.Windows,
					remoteAuthority: undefined,
					userHome: 'C:\\Home',
					backend: {
						async getWslPath(original: string, direction: 'unix-to-win' | 'win-to-unix') {
							if (direction === 'unix-to-win') {
								return wslUnixToWindowsPathMap.get(original) ?? original;
							}
							return original;
						},
					}
				}, resolver);
				wslUnixToWindowsPathMap.clear();
			});

			for (const l of windowsLinks) {
				const baseLink = isString(l) ? l : l.link;
				const resource = isString(l) ? URI.file(l) : l.resource;
				suite(`Link "${baseLink}"`, () => {
					for (let i = 0; i < supportedLinkFormats.length; i++) {
						const linkFormat = supportedLinkFormats[i];
						const formattedLink = format(linkFormat.urlFormat, baseLink, linkFormat.line, linkFormat.column);
						test(`should detect in "${formattedLink}"`, async () => {
							validResources = [resource];
							fileService.setFiles(validResources);
							await assertLinksWithWrapped(formattedLink, resource);
						});
					}
				});
			}

			for (const l of windowsFallbackLinks) {
				const baseLink = isString(l) ? l : l.link;
				const resource = isString(l) ? URI.file(l) : l.resource;
				suite(`Fallback link "${baseLink}"`, () => {
					for (let i = 0; i < supportedFallbackLinkFormats.length; i++) {
						const linkFormat = supportedFallbackLinkFormats[i];
						const formattedLink = format(linkFormat.urlFormat, baseLink, linkFormat.line, linkFormat.column);
						const linkCellStartOffset = linkFormat.linkCellStartOffset ?? 0;
						const linkCellEndOffset = linkFormat.linkCellEndOffset ?? 0;
						test(`should detect in "${formattedLink}"`, async () => {
							validResources = [resource];
							fileService.setFiles(validResources);
							await assertLinks(TerminalBuiltinLinkType.LocalFile, formattedLink, [{ uri: resource, range: [[1 + linkCellStartOffset, 1], [formattedLink.length + linkCellEndOffset, 1]] }]);
						});
					}
				});
			}

			test('Git diff links', async () => {
				const resource = URI.file('C:\\Parent\\Cwd\\foo\\bar');
				validResources = [resource];
				fileService.setFiles(validResources);
				await assertLinks(TerminalBuiltinLinkType.LocalFile, `diff --git a/foo/bar b/foo/bar`, [
					{ uri: resource, range: [[14, 1], [20, 1]] },
					{ uri: resource, range: [[24, 1], [30, 1]] }
				]);
				await assertLinks(TerminalBuiltinLinkType.LocalFile, `--- a/foo/bar`, [{ uri: resource, range: [[7, 1], [13, 1]] }]);
				await assertLinks(TerminalBuiltinLinkType.LocalFile, `+++ b/foo/bar`, [{ uri: resource, range: [[7, 1], [13, 1]] }]);
			});

			// Test ISO 8601 links separately with only base format to avoid suffix conflicts
			// Note: Only test plain format as colons are excluded path characters in the regex,
			// so wrapped contexts (spaces, parentheses, brackets) won't work
			for (const l of windowsLinksWithIso) {
				const baseLink = typeof l === 'string' ? l : l.link;
				const resource = typeof l === 'string' ? URI.file(l) : l.resource;
				test(`should detect ISO 8601 link: ${baseLink}`, async () => {
					validResources = [resource];
					fileService.setFiles(validResources);
					await assertLinks(TerminalBuiltinLinkType.LocalFile, baseLink, [{ uri: resource, range: [[1, 1], [baseLink.length, 1]] }]);
				});
			}

			suite('WSL', () => {
				test('Unix -> Windows /mnt/ style links', async () => {
					wslUnixToWindowsPathMap.set('/mnt/c/foo/bar', 'C:\\foo\\bar');
					validResources = [URI.file('C:\\foo\\bar')];
					fileService.setFiles(validResources);
					await assertLinksWithWrapped('/mnt/c/foo/bar', validResources[0]);
				});

				test('Windows -> Unix \\\\wsl$\\ style links', async () => {
					validResources = [URI.file('\\\\wsl$\\Debian\\home\\foo\\bar')];
					fileService.setFiles(validResources);
					await assertLinksWithWrapped('\\\\wsl$\\Debian\\home\\foo\\bar');
				});

				test('Windows -> Unix \\\\wsl.localhost\\ style links', async () => {
					validResources = [URI.file('\\\\wsl.localhost\\Debian\\home\\foo\\bar')];
					fileService.setFiles(validResources);
					await assertLinksWithWrapped('\\\\wsl.localhost\\Debian\\home\\foo\\bar');
				});
			});
		});
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/links/test/browser/terminalMultiLineLinkDetector.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/links/test/browser/terminalMultiLineLinkDetector.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isWindows, OperatingSystem } from '../../../../../../base/common/platform.js';
import { format } from '../../../../../../base/common/strings.js';
import { IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../../../platform/configuration/test/common/testConfigurationService.js';
import { TestInstantiationService } from '../../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { TerminalBuiltinLinkType } from '../../browser/links.js';
import { assertLinkHelper } from './linkTestUtils.js';
import type { Terminal } from '@xterm/xterm';
import { timeout } from '../../../../../../base/common/async.js';
import { strictEqual } from 'assert';
import { TerminalLinkResolver } from '../../browser/terminalLinkResolver.js';
import { IFileService } from '../../../../../../platform/files/common/files.js';
import { createFileStat } from '../../../../../test/common/workbenchTestServices.js';
import { URI } from '../../../../../../base/common/uri.js';
import { NullLogService } from '../../../../../../platform/log/common/log.js';
import { ITerminalLogService } from '../../../../../../platform/terminal/common/terminal.js';
import { TerminalMultiLineLinkDetector } from '../../browser/terminalMultiLineLinkDetector.js';
import { importAMDNodeModule } from '../../../../../../amdX.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { isString } from '../../../../../../base/common/types.js';

const unixLinks: (string | { link: string; resource: URI })[] = [
	// Absolute
	'/foo',
	'/foo/bar',
	'/foo/[bar]',
	'/foo/[bar].baz',
	'/foo/[bar]/baz',
	'/foo/bar+more',
	// User home
	{ link: '~/foo', resource: URI.file('/home/foo') },
	// Relative
	{ link: './foo', resource: URI.file('/parent/cwd/foo') },
	{ link: './$foo', resource: URI.file('/parent/cwd/$foo') },
	{ link: '../foo', resource: URI.file('/parent/foo') },
	{ link: 'foo/bar', resource: URI.file('/parent/cwd/foo/bar') },
	{ link: 'foo/bar+more', resource: URI.file('/parent/cwd/foo/bar+more') },
];

const windowsLinks: (string | { link: string; resource: URI })[] = [
	// Absolute
	'c:\\foo',
	{ link: '\\\\?\\C:\\foo', resource: URI.file('C:\\foo') },
	'c:/foo',
	'c:/foo/bar',
	'c:\\foo\\bar',
	'c:\\foo\\bar+more',
	'c:\\foo/bar\\baz',
	// User home
	{ link: '~\\foo', resource: URI.file('C:\\Home\\foo') },
	{ link: '~/foo', resource: URI.file('C:\\Home\\foo') },
	// Relative
	{ link: '.\\foo', resource: URI.file('C:\\Parent\\Cwd\\foo') },
	{ link: './foo', resource: URI.file('C:\\Parent\\Cwd\\foo') },
	{ link: './$foo', resource: URI.file('C:\\Parent\\Cwd\\$foo') },
	{ link: '..\\foo', resource: URI.file('C:\\Parent\\foo') },
	{ link: 'foo/bar', resource: URI.file('C:\\Parent\\Cwd\\foo\\bar') },
	{ link: 'foo/bar', resource: URI.file('C:\\Parent\\Cwd\\foo\\bar') },
	{ link: 'foo/[bar]', resource: URI.file('C:\\Parent\\Cwd\\foo\\[bar]') },
	{ link: 'foo/[bar].baz', resource: URI.file('C:\\Parent\\Cwd\\foo\\[bar].baz') },
	{ link: 'foo/[bar]/baz', resource: URI.file('C:\\Parent\\Cwd\\foo\\[bar]/baz') },
	{ link: 'foo\\bar', resource: URI.file('C:\\Parent\\Cwd\\foo\\bar') },
	{ link: 'foo\\[bar].baz', resource: URI.file('C:\\Parent\\Cwd\\foo\\[bar].baz') },
	{ link: 'foo\\[bar]\\baz', resource: URI.file('C:\\Parent\\Cwd\\foo\\[bar]\\baz') },
	{ link: 'foo\\bar+more', resource: URI.file('C:\\Parent\\Cwd\\foo\\bar+more') },
];

interface LinkFormatInfo {
	urlFormat: string;
	/**
	 * The start offset to the buffer range that is not in the actual link (but is in the matched
	 * area.
	 */
	linkCellStartOffset?: number;
	/**
	 * The end offset to the buffer range that is not in the actual link (but is in the matched
	 * area.
	 */
	linkCellEndOffset?: number;
	line?: string;
	column?: string;
}

const supportedLinkFormats: LinkFormatInfo[] = [
	// 5: file content...                         [#181837]
	//   5:3  error                               [#181837]
	{ urlFormat: '{0}\r\n{1}:foo', line: '5' },
	{ urlFormat: '{0}\r\n{1}: foo', line: '5' },
	{ urlFormat: '{0}\r\n5:another link\r\n{1}:{2} foo', line: '5', column: '3' },
	{ urlFormat: '{0}\r\n  {1}:{2} foo', line: '5', column: '3' },
	{ urlFormat: '{0}\r\n  5:6  error  another one\r\n  {1}:{2}  error', line: '5', column: '3' },
	{ urlFormat: `{0}\r\n  5:6  error  ${'a'.repeat(80)}\r\n  {1}:{2}  error`, line: '5', column: '3' },

	// @@ ... <to-file-range> @@ content...       [#182878]   (tests check the entire line, so they don't include the line content at the end of the last @@)
	{ urlFormat: '+++ b/{0}\r\n@@ -7,6 +{1},7 @@', line: '5' },
	{ urlFormat: '+++ b/{0}\r\n@@ -1,1 +1,1 @@\r\nfoo\r\nbar\r\n@@ -7,6 +{1},7 @@', line: '5' },
];

suite('Workbench - TerminalMultiLineLinkDetector', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	let instantiationService: TestInstantiationService;
	let configurationService: TestConfigurationService;
	let detector: TerminalMultiLineLinkDetector;
	let resolver: TerminalLinkResolver;
	let xterm: Terminal;
	let validResources: URI[];

	async function assertLinks(
		type: TerminalBuiltinLinkType,
		text: string,
		expected: ({ uri: URI; range: [number, number][] })[]
	) {
		let to;
		const race = await Promise.race([
			assertLinkHelper(text, expected, detector, type).then(() => 'success'),
			(to = timeout(2)).then(() => 'timeout')
		]);
		strictEqual(race, 'success', `Awaiting link assertion for "${text}" timed out`);
		to.cancel();
	}

	async function assertLinksMain(link: string, resource?: URI) {
		const uri = resource ?? URI.file(link);
		const lines = link.split('\r\n');
		const lastLine = lines.at(-1)!;
		// Count lines, accounting for wrapping
		let lineCount = 0;
		for (const line of lines) {
			lineCount += Math.max(Math.ceil(line.length / 80), 1);
		}
		await assertLinks(TerminalBuiltinLinkType.LocalFile, link, [{ uri, range: [[1, lineCount], [lastLine.length, lineCount]] }]);
	}

	setup(async () => {
		instantiationService = store.add(new TestInstantiationService());
		configurationService = new TestConfigurationService();
		instantiationService.stub(IConfigurationService, configurationService);
		instantiationService.stub(IFileService, {
			async stat(resource) {
				if (!validResources.map(e => e.path).includes(resource.path)) {
					throw new Error('Doesn\'t exist');
				}
				return createFileStat(resource);
			}
		});
		instantiationService.stub(ITerminalLogService, new NullLogService());
		resolver = instantiationService.createInstance(TerminalLinkResolver);
		validResources = [];

		const TerminalCtor = (await importAMDNodeModule<typeof import('@xterm/xterm')>('@xterm/xterm', 'lib/xterm.js')).Terminal;
		xterm = new TerminalCtor({ allowProposedApi: true, cols: 80, rows: 30 });
	});

	suite('macOS/Linux', () => {
		setup(() => {
			detector = instantiationService.createInstance(TerminalMultiLineLinkDetector, xterm, {
				initialCwd: '/parent/cwd',
				os: OperatingSystem.Linux,
				remoteAuthority: undefined,
				userHome: '/home',
				backend: undefined
			}, resolver);
		});

		for (const l of unixLinks) {
			const baseLink = isString(l) ? l : l.link;
			const resource = isString(l) ? URI.file(l) : l.resource;
			suite(`Link: ${baseLink}`, () => {
				for (let i = 0; i < supportedLinkFormats.length; i++) {
					const linkFormat = supportedLinkFormats[i];
					const formattedLink = format(linkFormat.urlFormat, baseLink, linkFormat.line, linkFormat.column);
					test(`should detect in "${escapeMultilineTestName(formattedLink)}"`, async () => {
						validResources = [resource];
						await assertLinksMain(formattedLink, resource);
					});
				}
			});
		}
	});

	// Only test these when on Windows because there is special behavior around replacing separators
	// in URI that cannot be changed
	if (isWindows) {
		suite('Windows', () => {
			setup(() => {
				detector = instantiationService.createInstance(TerminalMultiLineLinkDetector, xterm, {
					initialCwd: 'C:\\Parent\\Cwd',
					os: OperatingSystem.Windows,
					remoteAuthority: undefined,
					userHome: 'C:\\Home',
				}, resolver);
			});

			for (const l of windowsLinks) {
				const baseLink = isString(l) ? l : l.link;
				const resource = isString(l) ? URI.file(l) : l.resource;
				suite(`Link "${baseLink}"`, () => {
					for (let i = 0; i < supportedLinkFormats.length; i++) {
						const linkFormat = supportedLinkFormats[i];
						const formattedLink = format(linkFormat.urlFormat, baseLink, linkFormat.line, linkFormat.column);
						test(`should detect in "${escapeMultilineTestName(formattedLink)}"`, async () => {
							validResources = [resource];
							await assertLinksMain(formattedLink, resource);
						});
					}
				});
			}
		});
	}
});

function escapeMultilineTestName(text: string): string {
	return text.replaceAll('\r\n', '\\r\\n');
}
```

--------------------------------------------------------------------------------

````
