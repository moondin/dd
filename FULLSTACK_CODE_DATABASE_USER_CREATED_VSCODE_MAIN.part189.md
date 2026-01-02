---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 189
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 189 of 552)

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

---[FILE: src/vs/base/test/common/filters.perf.test.ts]---
Location: vscode-main/src/vs/base/test/common/filters.perf.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { importAMDNodeModule } from '../../../amdX.js';
import * as filters from '../../common/filters.js';
import { FileAccess } from '../../common/network.js';

const patterns = ['cci', 'ida', 'pos', 'CCI', 'enbled', 'callback', 'gGame', 'cons', 'zyx', 'aBc'];

const _enablePerf = false;

function perfSuite(name: string, callback: (this: Mocha.Suite) => void) {
	if (_enablePerf) {
		suite(name, callback);
	}
}

perfSuite('Performance - fuzzyMatch', async function () {

	const uri = FileAccess.asBrowserUri('vs/base/test/common/filters.perf.data').toString(true);
	const { data } = await importAMDNodeModule<typeof import('./filters.perf.data.js')>(uri, '');

	// suiteSetup(() => console.profile());
	// suiteTeardown(() => console.profileEnd());

	console.log(`Matching ${data.length} items against ${patterns.length} patterns (${data.length * patterns.length} operations) `);

	function perfTest(name: string, match: filters.FuzzyScorer) {
		test(name, () => {

			const t1 = Date.now();
			let count = 0;
			for (let i = 0; i < 2; i++) {
				for (const pattern of patterns) {
					const patternLow = pattern.toLowerCase();
					for (const item of data) {
						count += 1;
						match(pattern, patternLow, 0, item, item.toLowerCase(), 0);
					}
				}
			}
			const d = Date.now() - t1;
			console.log(name, `${d}ms, ${Math.round(count / d) * 15}/15ms, ${Math.round(count / d)}/1ms`);
		});
	}

	perfTest('fuzzyScore', filters.fuzzyScore);
	perfTest('fuzzyScoreGraceful', filters.fuzzyScoreGraceful);
	perfTest('fuzzyScoreGracefulAggressive', filters.fuzzyScoreGracefulAggressive);
});


perfSuite('Performance - IFilter', async function () {

	const uri = FileAccess.asBrowserUri('vs/base/test/common/filters.perf.data').toString(true);
	const { data } = await importAMDNodeModule<typeof import('./filters.perf.data.js')>(uri, '');

	function perfTest(name: string, match: filters.IFilter) {
		test(name, () => {

			const t1 = Date.now();
			let count = 0;
			for (let i = 0; i < 2; i++) {
				for (const pattern of patterns) {
					for (const item of data) {
						count += 1;
						match(pattern, item);
					}
				}
			}
			const d = Date.now() - t1;
			console.log(name, `${d}ms, ${Math.round(count / d) * 15}/15ms, ${Math.round(count / d)}/1ms`);
		});
	}

	perfTest('matchesFuzzy', filters.matchesFuzzy);
	perfTest('matchesFuzzy2', filters.matchesFuzzy2);
	perfTest('matchesPrefix', filters.matchesPrefix);
	perfTest('matchesContiguousSubString', filters.matchesContiguousSubString);
	perfTest('matchesCamelCase', filters.matchesCamelCase);
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/filters.test.ts]---
Location: vscode-main/src/vs/base/test/common/filters.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { anyScore, createMatches, fuzzyScore, fuzzyScoreGraceful, fuzzyScoreGracefulAggressive, FuzzyScorer, IFilter, IMatch, matchesBaseContiguousSubString, matchesCamelCase, matchesContiguousSubString, matchesPrefix, matchesStrictPrefix, matchesSubString, matchesWords, or } from '../../common/filters.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';

function filterOk(filter: IFilter, word: string, wordToMatchAgainst: string, highlights?: { start: number; end: number }[]) {
	const r = filter(word, wordToMatchAgainst);
	assert(r, `${word} didn't match ${wordToMatchAgainst}`);
	if (highlights) {
		assert.deepStrictEqual(r, highlights);
	}
}

function filterNotOk(filter: IFilter, word: string, wordToMatchAgainst: string) {
	assert(!filter(word, wordToMatchAgainst), `${word} matched ${wordToMatchAgainst}`);
}

suite('Filters', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('or', () => {
		let filter: IFilter;
		let counters: number[];
		const newFilter = function (i: number, r: boolean): IFilter {
			// eslint-disable-next-line local/code-no-any-casts
			return function (): IMatch[] { counters[i]++; return r as any; };
		};

		counters = [0, 0];
		filter = or(newFilter(0, false), newFilter(1, false));
		filterNotOk(filter, 'anything', 'anything');
		assert.deepStrictEqual(counters, [1, 1]);

		counters = [0, 0];
		filter = or(newFilter(0, true), newFilter(1, false));
		filterOk(filter, 'anything', 'anything');
		assert.deepStrictEqual(counters, [1, 0]);

		counters = [0, 0];
		filter = or(newFilter(0, true), newFilter(1, true));
		filterOk(filter, 'anything', 'anything');
		assert.deepStrictEqual(counters, [1, 0]);

		counters = [0, 0];
		filter = or(newFilter(0, false), newFilter(1, true));
		filterOk(filter, 'anything', 'anything');
		assert.deepStrictEqual(counters, [1, 1]);
	});

	test('PrefixFilter - case sensitive', function () {
		filterNotOk(matchesStrictPrefix, '', '');
		filterOk(matchesStrictPrefix, '', 'anything', []);
		filterOk(matchesStrictPrefix, 'alpha', 'alpha', [{ start: 0, end: 5 }]);
		filterOk(matchesStrictPrefix, 'alpha', 'alphasomething', [{ start: 0, end: 5 }]);
		filterNotOk(matchesStrictPrefix, 'alpha', 'alp');
		filterOk(matchesStrictPrefix, 'a', 'alpha', [{ start: 0, end: 1 }]);
		filterNotOk(matchesStrictPrefix, 'x', 'alpha');
		filterNotOk(matchesStrictPrefix, 'A', 'alpha');
		filterNotOk(matchesStrictPrefix, 'AlPh', 'alPHA');
	});

	test('PrefixFilter - ignore case', function () {
		filterOk(matchesPrefix, 'alpha', 'alpha', [{ start: 0, end: 5 }]);
		filterOk(matchesPrefix, 'alpha', 'alphasomething', [{ start: 0, end: 5 }]);
		filterNotOk(matchesPrefix, 'alpha', 'alp');
		filterOk(matchesPrefix, 'a', 'alpha', [{ start: 0, end: 1 }]);
		filterOk(matchesPrefix, 'ä', 'Älpha', [{ start: 0, end: 1 }]);
		filterNotOk(matchesPrefix, 'x', 'alpha');
		filterOk(matchesPrefix, 'A', 'alpha', [{ start: 0, end: 1 }]);
		filterOk(matchesPrefix, 'AlPh', 'alPHA', [{ start: 0, end: 4 }]);
		filterNotOk(matchesPrefix, 'T', '4'); // see https://github.com/microsoft/vscode/issues/22401
	});

	test('CamelCaseFilter', () => {
		filterNotOk(matchesCamelCase, '', '');
		filterOk(matchesCamelCase, '', 'anything', []);
		filterOk(matchesCamelCase, 'alpha', 'alpha', [{ start: 0, end: 5 }]);
		filterOk(matchesCamelCase, 'AlPhA', 'alpha', [{ start: 0, end: 5 }]);
		filterOk(matchesCamelCase, 'alpha', 'alphasomething', [{ start: 0, end: 5 }]);
		filterNotOk(matchesCamelCase, 'alpha', 'alp');

		filterOk(matchesCamelCase, 'c', 'CamelCaseRocks', [
			{ start: 0, end: 1 }
		]);
		filterOk(matchesCamelCase, 'cc', 'CamelCaseRocks', [
			{ start: 0, end: 1 },
			{ start: 5, end: 6 }
		]);
		filterOk(matchesCamelCase, 'ccr', 'CamelCaseRocks', [
			{ start: 0, end: 1 },
			{ start: 5, end: 6 },
			{ start: 9, end: 10 }
		]);
		filterOk(matchesCamelCase, 'cacr', 'CamelCaseRocks', [
			{ start: 0, end: 2 },
			{ start: 5, end: 6 },
			{ start: 9, end: 10 }
		]);
		filterOk(matchesCamelCase, 'cacar', 'CamelCaseRocks', [
			{ start: 0, end: 2 },
			{ start: 5, end: 7 },
			{ start: 9, end: 10 }
		]);
		filterOk(matchesCamelCase, 'ccarocks', 'CamelCaseRocks', [
			{ start: 0, end: 1 },
			{ start: 5, end: 7 },
			{ start: 9, end: 14 }
		]);
		filterOk(matchesCamelCase, 'cr', 'CamelCaseRocks', [
			{ start: 0, end: 1 },
			{ start: 9, end: 10 }
		]);
		filterOk(matchesCamelCase, 'fba', 'FooBarAbe', [
			{ start: 0, end: 1 },
			{ start: 3, end: 5 }
		]);
		filterOk(matchesCamelCase, 'fbar', 'FooBarAbe', [
			{ start: 0, end: 1 },
			{ start: 3, end: 6 }
		]);
		filterOk(matchesCamelCase, 'fbara', 'FooBarAbe', [
			{ start: 0, end: 1 },
			{ start: 3, end: 7 }
		]);
		filterOk(matchesCamelCase, 'fbaa', 'FooBarAbe', [
			{ start: 0, end: 1 },
			{ start: 3, end: 5 },
			{ start: 6, end: 7 }
		]);
		filterOk(matchesCamelCase, 'fbaab', 'FooBarAbe', [
			{ start: 0, end: 1 },
			{ start: 3, end: 5 },
			{ start: 6, end: 8 }
		]);
		filterOk(matchesCamelCase, 'c2d', 'canvasCreation2D', [
			{ start: 0, end: 1 },
			{ start: 14, end: 16 }
		]);
		filterOk(matchesCamelCase, 'cce', '_canvasCreationEvent', [
			{ start: 1, end: 2 },
			{ start: 7, end: 8 },
			{ start: 15, end: 16 }
		]);
	});

	test('CamelCaseFilter - #19256', function () {
		assert(matchesCamelCase('Debug Console', 'Open: Debug Console'));
		assert(matchesCamelCase('Debug console', 'Open: Debug Console'));
		assert(matchesCamelCase('debug console', 'Open: Debug Console'));
	});

	test('matchesContiguousSubString', () => {
		filterOk(matchesContiguousSubString, 'cela', 'cancelAnimationFrame()', [
			{ start: 3, end: 7 }
		]);
	});

	test('matchesBaseContiguousSubString', () => {
		filterOk(matchesBaseContiguousSubString, 'cela', 'cancelAnimationFrame()', [
			{ start: 3, end: 7 }
		]);
		filterOk(matchesBaseContiguousSubString, 'cafe', 'café', [
			{ start: 0, end: 4 }
		]);
		filterOk(matchesBaseContiguousSubString, 'cafe', 'caféBar', [
			{ start: 0, end: 4 }
		]);
		filterOk(matchesBaseContiguousSubString, 'resume', 'résumé', [
			{ start: 0, end: 6 }
		]);
		filterOk(matchesBaseContiguousSubString, 'naïve', 'naïve', [
			{ start: 0, end: 5 }
		]);
		filterOk(matchesBaseContiguousSubString, 'naive', 'naïve', [
			{ start: 0, end: 5 }
		]);
		filterOk(matchesBaseContiguousSubString, 'aeou', 'àéöü', [
			{ start: 0, end: 4 }
		]);
	});

	test('matchesSubString', () => {
		filterOk(matchesSubString, 'cmm', 'cancelAnimationFrame()', [
			{ start: 0, end: 1 },
			{ start: 9, end: 10 },
			{ start: 18, end: 19 }
		]);
		filterOk(matchesSubString, 'abc', 'abcabc', [
			{ start: 0, end: 3 },
		]);
		filterOk(matchesSubString, 'abc', 'aaabbbccc', [
			{ start: 0, end: 1 },
			{ start: 3, end: 4 },
			{ start: 6, end: 7 },
		]);
	});

	test('matchesSubString performance (#35346)', function () {
		filterNotOk(matchesSubString, 'aaaaaaaaaaaaaaaaaaaax', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
	});

	test('WordFilter', () => {
		filterOk(matchesWords, 'alpha', 'alpha', [{ start: 0, end: 5 }]);
		filterOk(matchesWords, 'alpha', 'alphasomething', [{ start: 0, end: 5 }]);
		filterNotOk(matchesWords, 'alpha', 'alp');
		filterOk(matchesWords, 'a', 'alpha', [{ start: 0, end: 1 }]);
		filterNotOk(matchesWords, 'x', 'alpha');
		filterOk(matchesWords, 'A', 'alpha', [{ start: 0, end: 1 }]);
		filterOk(matchesWords, 'AlPh', 'alPHA', [{ start: 0, end: 4 }]);
		assert(matchesWords('Debug Console', 'Open: Debug Console'));

		filterOk(matchesWords, 'gp', 'Git: Pull', [{ start: 0, end: 1 }, { start: 5, end: 6 }]);
		filterOk(matchesWords, 'g p', 'Git: Pull', [{ start: 0, end: 1 }, { start: 5, end: 6 }]);
		filterOk(matchesWords, 'gipu', 'Git: Pull', [{ start: 0, end: 2 }, { start: 5, end: 7 }]);

		filterOk(matchesWords, 'gp', 'Category: Git: Pull', [{ start: 10, end: 11 }, { start: 15, end: 16 }]);
		filterOk(matchesWords, 'g p', 'Category: Git: Pull', [{ start: 10, end: 11 }, { start: 15, end: 16 }]);
		filterOk(matchesWords, 'gipu', 'Category: Git: Pull', [{ start: 10, end: 12 }, { start: 15, end: 17 }]);

		filterNotOk(matchesWords, 'it', 'Git: Pull');
		filterNotOk(matchesWords, 'll', 'Git: Pull');

		filterOk(matchesWords, 'git: プル', 'git: プル', [{ start: 0, end: 7 }]);
		filterOk(matchesWords, 'git プル', 'git: プル', [{ start: 0, end: 3 }, { start: 5, end: 7 }]);

		filterOk(matchesWords, 'öäk', 'Öhm: Älles Klar', [{ start: 0, end: 1 }, { start: 5, end: 6 }, { start: 11, end: 12 }]);

		// Handles issue #123915
		filterOk(matchesWords, 'C++', 'C/C++: command', [{ start: 2, end: 5 }]);

		// Handles issue #154533
		filterOk(matchesWords, '.', ':', []);
		filterOk(matchesWords, '.', '.', [{ start: 0, end: 1 }]);

		// assert.ok(matchesWords('gipu', 'Category: Git: Pull', true) === null);
		// assert.deepStrictEqual(matchesWords('pu', 'Category: Git: Pull', true), [{ start: 15, end: 17 }]);

		filterOk(matchesWords, 'bar', 'foo-bar');
		filterOk(matchesWords, 'bar test', 'foo-bar test');
		filterOk(matchesWords, 'fbt', 'foo-bar test');
		filterOk(matchesWords, 'bar test', 'foo-bar (test)');
		filterOk(matchesWords, 'foo bar', 'foo (bar)');

		filterNotOk(matchesWords, 'bar est', 'foo-bar test');
		filterNotOk(matchesWords, 'fo ar', 'foo-bar test');
		filterNotOk(matchesWords, 'for', 'foo-bar test');

		filterOk(matchesWords, 'foo bar', 'foo-bar');
		filterOk(matchesWords, 'foo bar', '123 foo-bar 456');
		filterOk(matchesWords, 'foo-bar', 'foo bar');
		filterOk(matchesWords, 'foo:bar', 'foo:bar');
	});

	function assertMatches(pattern: string, word: string, decoratedWord: string | undefined, filter: FuzzyScorer, opts: { patternPos?: number; wordPos?: number; firstMatchCanBeWeak?: boolean } = {}) {
		const r = filter(pattern, pattern.toLowerCase(), opts.patternPos || 0, word, word.toLowerCase(), opts.wordPos || 0, { firstMatchCanBeWeak: opts.firstMatchCanBeWeak ?? false, boostFullMatch: true });
		assert.ok(!decoratedWord === !r);
		if (r) {
			const matches = createMatches(r);
			let actualWord = '';
			let pos = 0;
			for (const match of matches) {
				actualWord += word.substring(pos, match.start);
				actualWord += '^' + word.substring(match.start, match.end).split('').join('^');
				pos = match.end;
			}
			actualWord += word.substring(pos);
			assert.strictEqual(actualWord, decoratedWord);
		}
	}

	test('fuzzyScore, #23215', function () {
		assertMatches('tit', 'win.tit', 'win.^t^i^t', fuzzyScore);
		assertMatches('title', 'win.title', 'win.^t^i^t^l^e', fuzzyScore);
		assertMatches('WordCla', 'WordCharacterClassifier', '^W^o^r^dCharacter^C^l^assifier', fuzzyScore);
		assertMatches('WordCCla', 'WordCharacterClassifier', '^W^o^r^d^Character^C^l^assifier', fuzzyScore);
	});

	test('fuzzyScore, #23332', function () {
		assertMatches('dete', '"editor.quickSuggestionsDelay"', undefined, fuzzyScore);
	});

	test('fuzzyScore, #23190', function () {
		assertMatches('c:\\do', '& \'C:\\Documents and Settings\'', '& \'^C^:^\\^D^ocuments and Settings\'', fuzzyScore);
		assertMatches('c:\\do', '& \'c:\\Documents and Settings\'', '& \'^c^:^\\^D^ocuments and Settings\'', fuzzyScore);
	});

	test('fuzzyScore, #23581', function () {
		assertMatches('close', 'css.lint.importStatement', '^css.^lint.imp^ort^Stat^ement', fuzzyScore);
		assertMatches('close', 'css.colorDecorators.enable', '^css.co^l^orDecorator^s.^enable', fuzzyScore);
		assertMatches('close', 'workbench.quickOpen.closeOnFocusOut', 'workbench.quickOpen.^c^l^o^s^eOnFocusOut', fuzzyScore);
		assertTopScore(fuzzyScore, 'close', 2, 'css.lint.importStatement', 'css.colorDecorators.enable', 'workbench.quickOpen.closeOnFocusOut');
	});

	test('fuzzyScore, #23458', function () {
		assertMatches('highlight', 'editorHoverHighlight', 'editorHover^H^i^g^h^l^i^g^h^t', fuzzyScore);
		assertMatches('hhighlight', 'editorHoverHighlight', 'editor^Hover^H^i^g^h^l^i^g^h^t', fuzzyScore);
		assertMatches('dhhighlight', 'editorHoverHighlight', undefined, fuzzyScore);
	});
	test('fuzzyScore, #23746', function () {
		assertMatches('-moz', '-moz-foo', '^-^m^o^z-foo', fuzzyScore);
		assertMatches('moz', '-moz-foo', '-^m^o^z-foo', fuzzyScore);
		assertMatches('moz', '-moz-animation', '-^m^o^z-animation', fuzzyScore);
		assertMatches('moza', '-moz-animation', '-^m^o^z-^animation', fuzzyScore);
	});

	test('fuzzyScore', () => {
		assertMatches('ab', 'abA', '^a^bA', fuzzyScore);
		assertMatches('ccm', 'cacmelCase', '^ca^c^melCase', fuzzyScore);
		assertMatches('bti', 'the_black_knight', undefined, fuzzyScore);
		assertMatches('ccm', 'camelCase', undefined, fuzzyScore);
		assertMatches('cmcm', 'camelCase', undefined, fuzzyScore);
		assertMatches('BK', 'the_black_knight', 'the_^black_^knight', fuzzyScore);
		assertMatches('KeyboardLayout=', 'KeyboardLayout', undefined, fuzzyScore);
		assertMatches('LLL', 'SVisualLoggerLogsList', 'SVisual^Logger^Logs^List', fuzzyScore);
		assertMatches('LLLL', 'SVilLoLosLi', undefined, fuzzyScore);
		assertMatches('LLLL', 'SVisualLoggerLogsList', undefined, fuzzyScore);
		assertMatches('TEdit', 'TextEdit', '^Text^E^d^i^t', fuzzyScore);
		assertMatches('TEdit', 'TextEditor', '^Text^E^d^i^tor', fuzzyScore);
		assertMatches('TEdit', 'Textedit', '^Text^e^d^i^t', fuzzyScore);
		assertMatches('TEdit', 'text_edit', '^text_^e^d^i^t', fuzzyScore);
		assertMatches('TEditDit', 'TextEditorDecorationType', '^Text^E^d^i^tor^Decorat^ion^Type', fuzzyScore);
		assertMatches('TEdit', 'TextEditorDecorationType', '^Text^E^d^i^torDecorationType', fuzzyScore);
		assertMatches('Tedit', 'TextEdit', '^Text^E^d^i^t', fuzzyScore);
		assertMatches('ba', '?AB?', undefined, fuzzyScore);
		assertMatches('bkn', 'the_black_knight', 'the_^black_^k^night', fuzzyScore);
		assertMatches('bt', 'the_black_knight', 'the_^black_knigh^t', fuzzyScore);
		assertMatches('ccm', 'camelCasecm', '^camel^Casec^m', fuzzyScore);
		assertMatches('fdm', 'findModel', '^fin^d^Model', fuzzyScore);
		assertMatches('fob', 'foobar', '^f^oo^bar', fuzzyScore);
		assertMatches('fobz', 'foobar', undefined, fuzzyScore);
		assertMatches('foobar', 'foobar', '^f^o^o^b^a^r', fuzzyScore);
		assertMatches('form', 'editor.formatOnSave', 'editor.^f^o^r^matOnSave', fuzzyScore);
		assertMatches('g p', 'Git: Pull', '^Git:^ ^Pull', fuzzyScore);
		assertMatches('g p', 'Git: Pull', '^Git:^ ^Pull', fuzzyScore);
		assertMatches('gip', 'Git: Pull', '^G^it: ^Pull', fuzzyScore);
		assertMatches('gip', 'Git: Pull', '^G^it: ^Pull', fuzzyScore);
		assertMatches('gp', 'Git: Pull', '^Git: ^Pull', fuzzyScore);
		assertMatches('gp', 'Git_Git_Pull', '^Git_Git_^Pull', fuzzyScore);
		assertMatches('is', 'ImportStatement', '^Import^Statement', fuzzyScore);
		assertMatches('is', 'isValid', '^i^sValid', fuzzyScore);
		assertMatches('lowrd', 'lowWord', '^l^o^wWo^r^d', fuzzyScore);
		assertMatches('myvable', 'myvariable', '^m^y^v^aria^b^l^e', fuzzyScore);
		assertMatches('no', '', undefined, fuzzyScore);
		assertMatches('no', 'match', undefined, fuzzyScore);
		assertMatches('ob', 'foobar', undefined, fuzzyScore);
		assertMatches('sl', 'SVisualLoggerLogsList', '^SVisual^LoggerLogsList', fuzzyScore);
		assertMatches('sllll', 'SVisualLoggerLogsList', '^SVisua^l^Logger^Logs^List', fuzzyScore);
		assertMatches('Three', 'HTMLHRElement', undefined, fuzzyScore);
		assertMatches('Three', 'Three', '^T^h^r^e^e', fuzzyScore);
		assertMatches('fo', 'barfoo', undefined, fuzzyScore);
		assertMatches('fo', 'bar_foo', 'bar_^f^oo', fuzzyScore);
		assertMatches('fo', 'bar_Foo', 'bar_^F^oo', fuzzyScore);
		assertMatches('fo', 'bar foo', 'bar ^f^oo', fuzzyScore);
		assertMatches('fo', 'bar.foo', 'bar.^f^oo', fuzzyScore);
		assertMatches('fo', 'bar/foo', 'bar/^f^oo', fuzzyScore);
		assertMatches('fo', 'bar\\foo', 'bar\\^f^oo', fuzzyScore);
	});

	test('fuzzyScore (first match can be weak)', function () {

		assertMatches('Three', 'HTMLHRElement', 'H^TML^H^R^El^ement', fuzzyScore, { firstMatchCanBeWeak: true });
		assertMatches('tor', 'constructor', 'construc^t^o^r', fuzzyScore, { firstMatchCanBeWeak: true });
		assertMatches('ur', 'constructor', 'constr^ucto^r', fuzzyScore, { firstMatchCanBeWeak: true });
		assertTopScore(fuzzyScore, 'tor', 2, 'constructor', 'Thor', 'cTor');
	});

	test('fuzzyScore, many matches', function () {

		assertMatches(
			'aaaaaa',
			'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
			'^a^a^a^a^a^aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
			fuzzyScore
		);
	});

	test('Freeze when fjfj -> jfjf, https://github.com/microsoft/vscode/issues/91807', function () {
		assertMatches(
			'jfjfj',
			'fjfjfjfjfjfjfjfjfjfjfj',
			undefined, fuzzyScore
		);
		assertMatches(
			'jfjfjfjfjfjfjfjfjfj',
			'fjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfj',
			undefined, fuzzyScore
		);
		assertMatches(
			'jfjfjfjfjfjfjfjfjfjjfjfjfjfjfjfjfjfjfjjfjfjfjfjfjfjfjfjfjjfjfjfjfjfjfjfjfjfjjfjfjfjfjfjfjfjfjfjjfjfjfjfjfjfjfjfjfj',
			'fjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfj',
			undefined, fuzzyScore
		);
		assertMatches(
			'jfjfjfjfjfjfjfjfjfj',
			'fJfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfj',
			'f^J^f^j^f^j^f^j^f^j^f^j^f^j^f^j^f^j^f^jfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfj', // strong match
			fuzzyScore
		);
		assertMatches(
			'jfjfjfjfjfjfjfjfjfj',
			'fjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfj',
			'f^j^f^j^f^j^f^j^f^j^f^j^f^j^f^j^f^j^f^jfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfjfj', // any match
			fuzzyScore, { firstMatchCanBeWeak: true }
		);
	});

	test('fuzzyScore, issue #26423', function () {

		assertMatches('baba', 'abababab', undefined, fuzzyScore);

		assertMatches(
			'fsfsfs',
			'dsafdsafdsafdsafdsafdsafdsafasdfdsa',
			undefined,
			fuzzyScore
		);
		assertMatches(
			'fsfsfsfsfsfsfsf',
			'dsafdsafdsafdsafdsafdsafdsafasdfdsafdsafdsafdsafdsfdsafdsfdfdfasdnfdsajfndsjnafjndsajlknfdsa',
			undefined,
			fuzzyScore
		);
	});

	test('Fuzzy IntelliSense matching vs Haxe metadata completion, #26995', function () {
		assertMatches('f', ':Foo', ':^Foo', fuzzyScore);
		assertMatches('f', ':foo', ':^foo', fuzzyScore);
	});

	test('Separator only match should not be weak #79558', function () {
		assertMatches('.', 'foo.bar', 'foo^.bar', fuzzyScore);
	});

	test('Cannot set property \'1\' of undefined, #26511', function () {
		const word = new Array<void>(123).join('a');
		const pattern = new Array<void>(120).join('a');
		fuzzyScore(pattern, pattern.toLowerCase(), 0, word, word.toLowerCase(), 0);
		assert.ok(true); // must not explode
	});

	test('Vscode 1.12 no longer obeys \'sortText\' in completion items (from language server), #26096', function () {
		assertMatches('  ', '  group', undefined, fuzzyScore, { patternPos: 2 });
		assertMatches('  g', '  group', '  ^group', fuzzyScore, { patternPos: 2 });
		assertMatches('g', '  group', '  ^group', fuzzyScore);
		assertMatches('g g', '  groupGroup', undefined, fuzzyScore);
		assertMatches('g g', '  group Group', '  ^group^ ^Group', fuzzyScore);
		assertMatches(' g g', '  group Group', '  ^group^ ^Group', fuzzyScore, { patternPos: 1 });
		assertMatches('zz', 'zzGroup', '^z^zGroup', fuzzyScore);
		assertMatches('zzg', 'zzGroup', '^z^z^Group', fuzzyScore);
		assertMatches('g', 'zzGroup', 'zz^Group', fuzzyScore);
	});

	test('patternPos isn\'t working correctly #79815', function () {
		assertMatches(':p'.substr(1), 'prop', '^prop', fuzzyScore, { patternPos: 0 });
		assertMatches(':p', 'prop', '^prop', fuzzyScore, { patternPos: 1 });
		assertMatches(':p', 'prop', undefined, fuzzyScore, { patternPos: 2 });
		assertMatches(':p', 'proP', 'pro^P', fuzzyScore, { patternPos: 1, wordPos: 1 });
		assertMatches(':p', 'aprop', 'a^prop', fuzzyScore, { patternPos: 1, firstMatchCanBeWeak: true });
		assertMatches(':p', 'aprop', undefined, fuzzyScore, { patternPos: 1, firstMatchCanBeWeak: false });
	});

	function assertTopScore(filter: typeof fuzzyScore, pattern: string, expected: number, ...words: string[]) {
		let topScore = -(100 * 10);
		let topIdx = 0;
		for (let i = 0; i < words.length; i++) {
			const word = words[i];
			const m = filter(pattern, pattern.toLowerCase(), 0, word, word.toLowerCase(), 0);
			if (m) {
				const [score] = m;
				if (score > topScore) {
					topScore = score;
					topIdx = i;
				}
			}
		}
		assert.strictEqual(topIdx, expected, `${pattern} -> actual=${words[topIdx]} <> expected=${words[expected]}`);
	}

	test('topScore - fuzzyScore', function () {

		assertTopScore(fuzzyScore, 'cons', 2, 'ArrayBufferConstructor', 'Console', 'console');
		assertTopScore(fuzzyScore, 'Foo', 1, 'foo', 'Foo', 'foo');

		// #24904
		assertTopScore(fuzzyScore, 'onMess', 1, 'onmessage', 'onMessage', 'onThisMegaEscape');

		assertTopScore(fuzzyScore, 'CC', 1, 'camelCase', 'CamelCase');
		assertTopScore(fuzzyScore, 'cC', 0, 'camelCase', 'CamelCase');
		// assertTopScore(fuzzyScore, 'cC', 1, 'ccfoo', 'camelCase');
		// assertTopScore(fuzzyScore, 'cC', 1, 'ccfoo', 'camelCase', 'foo-cC-bar');

		// issue #17836
		// assertTopScore(fuzzyScore, 'TEdit', 1, 'TextEditorDecorationType', 'TextEdit', 'TextEditor');
		assertTopScore(fuzzyScore, 'p', 4, 'parse', 'posix', 'pafdsa', 'path', 'p');
		assertTopScore(fuzzyScore, 'pa', 0, 'parse', 'pafdsa', 'path');

		// issue #14583
		assertTopScore(fuzzyScore, 'log', 3, 'HTMLOptGroupElement', 'ScrollLogicalPosition', 'SVGFEMorphologyElement', 'log', 'logger');
		assertTopScore(fuzzyScore, 'e', 2, 'AbstractWorker', 'ActiveXObject', 'else');

		// issue #14446
		assertTopScore(fuzzyScore, 'workbench.sideb', 1, 'workbench.editor.defaultSideBySideLayout', 'workbench.sideBar.location');

		// issue #11423
		assertTopScore(fuzzyScore, 'editor.r', 2, 'diffEditor.renderSideBySide', 'editor.overviewRulerlanes', 'editor.renderControlCharacter', 'editor.renderWhitespace');
		// assertTopScore(fuzzyScore, 'editor.R', 1, 'diffEditor.renderSideBySide', 'editor.overviewRulerlanes', 'editor.renderControlCharacter', 'editor.renderWhitespace');
		// assertTopScore(fuzzyScore, 'Editor.r', 0, 'diffEditor.renderSideBySide', 'editor.overviewRulerlanes', 'editor.renderControlCharacter', 'editor.renderWhitespace');

		assertTopScore(fuzzyScore, '-mo', 1, '-ms-ime-mode', '-moz-columns');
		// dupe, issue #14861
		assertTopScore(fuzzyScore, 'convertModelPosition', 0, 'convertModelPositionToViewPosition', 'convertViewToModelPosition');
		// dupe, issue #14942
		assertTopScore(fuzzyScore, 'is', 0, 'isValidViewletId', 'import statement');

		assertTopScore(fuzzyScore, 'title', 1, 'files.trimTrailingWhitespace', 'window.title');

		assertTopScore(fuzzyScore, 'const', 1, 'constructor', 'const', 'cuOnstrul');
	});

	test('Unexpected suggestion scoring, #28791', function () {
		assertTopScore(fuzzyScore, '_lines', 1, '_lineStarts', '_lines');
		assertTopScore(fuzzyScore, '_lines', 1, '_lineS', '_lines');
		assertTopScore(fuzzyScore, '_lineS', 0, '_lineS', '_lines');
	});

	test.skip('Bad completion ranking changes valid variable name to class name when pressing "." #187055', function () {
		assertTopScore(fuzzyScore, 'a', 1, 'A', 'a');
		assertTopScore(fuzzyScore, 'theme', 1, 'Theme', 'theme');
	});

	test('HTML closing tag proposal filtered out #38880', function () {
		assertMatches('\t\t<', '\t\t</body>', '^\t^\t^</body>', fuzzyScore, { patternPos: 0 });
		assertMatches('\t\t<', '\t\t</body>', '\t\t^</body>', fuzzyScore, { patternPos: 2 });
		assertMatches('\t<', '\t</body>', '\t^</body>', fuzzyScore, { patternPos: 1 });
	});

	test('fuzzyScoreGraceful', () => {

		assertMatches('rlut', 'result', undefined, fuzzyScore);
		assertMatches('rlut', 'result', '^res^u^l^t', fuzzyScoreGraceful);

		assertMatches('cno', 'console', '^co^ns^ole', fuzzyScore);
		assertMatches('cno', 'console', '^co^ns^ole', fuzzyScoreGraceful);
		assertMatches('cno', 'console', '^c^o^nsole', fuzzyScoreGracefulAggressive);
		assertMatches('cno', 'co_new', '^c^o_^new', fuzzyScoreGraceful);
		assertMatches('cno', 'co_new', '^c^o_^new', fuzzyScoreGracefulAggressive);
	});

	test('List highlight filter: Not all characters from match are highlighterd #66923', () => {
		assertMatches('foo', 'barbarbarbarbarbarbarbarbarbarbarbarbarbarbarbar_foo', 'barbarbarbarbarbarbarbarbarbarbarbarbarbarbarbar_^f^o^o', fuzzyScore);
	});

	test('Autocompletion is matched against truncated filterText to 54 characters #74133', () => {
		assertMatches(
			'foo',
			'ffffffffffffffffffffffffffffbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbar_foo',
			'ffffffffffffffffffffffffffffbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbar_^f^o^o',
			fuzzyScore
		);
		assertMatches(
			'Aoo',
			'Affffffffffffffffffffffffffffbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbar_foo',
			'^Affffffffffffffffffffffffffffbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbar_f^o^o',
			fuzzyScore
		);
		assertMatches(
			'foo',
			'Gffffffffffffffffffffffffffffbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbarbar_foo',
			undefined,
			fuzzyScore
		);
	});

	test('"Go to Symbol" with the exact method name doesn\'t work as expected #84787', function () {
		const match = fuzzyScore(':get', ':get', 1, 'get', 'get', 0, { firstMatchCanBeWeak: true, boostFullMatch: true });
		assert.ok(Boolean(match));
	});

	test('Wrong highlight after emoji #113404', function () {
		assertMatches('di', '✨div classname=""></div>', '✨^d^iv classname=""></div>', fuzzyScore);
		assertMatches('di', 'adiv classname=""></div>', 'adiv classname=""></^d^iv>', fuzzyScore);
	});

	test('Suggestion is not highlighted #85826', function () {
		assertMatches('SemanticTokens', 'SemanticTokensEdits', '^S^e^m^a^n^t^i^c^T^o^k^e^n^sEdits', fuzzyScore);
		assertMatches('SemanticTokens', 'SemanticTokensEdits', '^S^e^m^a^n^t^i^c^T^o^k^e^n^sEdits', fuzzyScoreGracefulAggressive);
	});

	test('IntelliSense completion not correctly highlighting text in front of cursor #115250', function () {
		assertMatches('lo', 'log', '^l^og', fuzzyScore);
		assertMatches('.lo', 'log', '^l^og', anyScore);
		assertMatches('.', 'log', 'log', anyScore);
	});

	test('anyScore should not require a strong first match', function () {
		assertMatches('bar', 'foobAr', 'foo^b^A^r', anyScore);
		assertMatches('bar', 'foobar', 'foo^b^a^r', anyScore);
	});

	test('configurable full match boost', function () {
		const prefix = 'create';
		const a = 'createModelServices';
		const b = 'create';

		let aBoost = fuzzyScore(prefix, prefix, 0, a, a.toLowerCase(), 0, { boostFullMatch: true, firstMatchCanBeWeak: true });
		let bBoost = fuzzyScore(prefix, prefix, 0, b, b.toLowerCase(), 0, { boostFullMatch: true, firstMatchCanBeWeak: true });
		assert.ok(aBoost);
		assert.ok(bBoost);
		assert.ok(aBoost[0] < bBoost[0]);

		// also works with wordStart > 0 (https://github.com/microsoft/vscode/issues/187921)
		const wordPrefix = '$(symbol-function) ';
		aBoost = fuzzyScore(prefix, prefix, 0, `${wordPrefix}${a}`, `${wordPrefix}${a}`.toLowerCase(), wordPrefix.length, { boostFullMatch: true, firstMatchCanBeWeak: true });
		bBoost = fuzzyScore(prefix, prefix, 0, `${wordPrefix}${b}`, `${wordPrefix}${b}`.toLowerCase(), wordPrefix.length, { boostFullMatch: true, firstMatchCanBeWeak: true });
		assert.ok(aBoost);
		assert.ok(bBoost);
		assert.ok(aBoost[0] < bBoost[0]);

		const aScore = fuzzyScore(prefix, prefix, 0, a, a.toLowerCase(), 0, { boostFullMatch: false, firstMatchCanBeWeak: true });
		const bScore = fuzzyScore(prefix, prefix, 0, b, b.toLowerCase(), 0, { boostFullMatch: false, firstMatchCanBeWeak: true });
		assert.ok(aScore);
		assert.ok(bScore);
		assert.ok(aScore[0] === bScore[0]);
	});

	test('Unexpected suggest highlighting ignores whole word match in favor of matching first letter#147423', function () {

		assertMatches('i', 'machine/{id}', 'machine/{^id}', fuzzyScore);
		assertMatches('ok', 'obobobf{ok}/user', '^obobobf{o^k}/user', fuzzyScore);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/fuzzyScorer.test.ts]---
Location: vscode-main/src/vs/base/test/common/fuzzyScorer.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { compareItemsByFuzzyScore, FuzzyScore, FuzzyScore2, FuzzyScorerCache, IItemAccessor, IItemScore, pieceToQuery, prepareQuery, scoreFuzzy, scoreFuzzy2, scoreItemFuzzy } from '../../common/fuzzyScorer.js';
import { Schemas } from '../../common/network.js';
import { basename, dirname, posix, sep, win32 } from '../../common/path.js';
import { isWindows } from '../../common/platform.js';
import { URI } from '../../common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';

class ResourceAccessorClass implements IItemAccessor<URI> {

	getItemLabel(resource: URI): string {
		return basename(resource.fsPath);
	}

	getItemDescription(resource: URI): string {
		return dirname(resource.fsPath);
	}

	getItemPath(resource: URI): string {
		return resource.fsPath;
	}
}

const ResourceAccessor = new ResourceAccessorClass();

class ResourceWithSlashAccessorClass implements IItemAccessor<URI> {

	getItemLabel(resource: URI): string {
		return basename(resource.fsPath);
	}

	getItemDescription(resource: URI): string {
		return posix.normalize(dirname(resource.path));
	}

	getItemPath(resource: URI): string {
		return posix.normalize(resource.path);
	}
}

const ResourceWithSlashAccessor = new ResourceWithSlashAccessorClass();

class ResourceWithBackslashAccessorClass implements IItemAccessor<URI> {

	getItemLabel(resource: URI): string {
		return basename(resource.fsPath);
	}

	getItemDescription(resource: URI): string {
		return win32.normalize(dirname(resource.path));
	}

	getItemPath(resource: URI): string {
		return win32.normalize(resource.path);
	}
}

const ResourceWithBackslashAccessor = new ResourceWithBackslashAccessorClass();

class NullAccessorClass implements IItemAccessor<URI> {

	getItemLabel(resource: URI): string {
		return undefined!;
	}

	getItemDescription(resource: URI): string {
		return undefined!;
	}

	getItemPath(resource: URI): string {
		return undefined!;
	}
}

function _doScore(target: string, query: string, allowNonContiguousMatches?: boolean): FuzzyScore {
	const preparedQuery = prepareQuery(query);

	return scoreFuzzy(target, preparedQuery.normalized, preparedQuery.normalizedLowercase, allowNonContiguousMatches ?? !preparedQuery.expectContiguousMatch);
}

function _doScore2(target: string, query: string, matchOffset: number = 0): FuzzyScore2 {
	const preparedQuery = prepareQuery(query);

	return scoreFuzzy2(target, preparedQuery, 0, matchOffset);
}

function scoreItem<T>(item: T, query: string, allowNonContiguousMatches: boolean, accessor: IItemAccessor<T>, cache: FuzzyScorerCache = Object.create(null)): IItemScore {
	return scoreItemFuzzy(item, prepareQuery(query), allowNonContiguousMatches, accessor, cache);
}

function compareItemsByScore<T>(itemA: T, itemB: T, query: string, allowNonContiguousMatches: boolean, accessor: IItemAccessor<T>): number {
	return compareItemsByFuzzyScore(itemA, itemB, prepareQuery(query), allowNonContiguousMatches, accessor, Object.create(null));
}

const NullAccessor = new NullAccessorClass();

suite('Fuzzy Scorer', () => {

	test('score (fuzzy)', function () {
		const target = 'HelLo-World';

		const scores: FuzzyScore[] = [];
		scores.push(_doScore(target, 'HelLo-World', true)); // direct case match
		scores.push(_doScore(target, 'hello-world', true)); // direct mix-case match
		scores.push(_doScore(target, 'HW', true)); // direct case prefix (multiple)
		scores.push(_doScore(target, 'hw', true)); // direct mix-case prefix (multiple)
		scores.push(_doScore(target, 'H', true)); // direct case prefix
		scores.push(_doScore(target, 'h', true)); // direct mix-case prefix
		scores.push(_doScore(target, 'W', true)); // direct case word prefix
		scores.push(_doScore(target, 'Ld', true)); // in-string case match (multiple)
		scores.push(_doScore(target, 'ld', true)); // in-string mix-case match (consecutive, avoids scattered hit)
		scores.push(_doScore(target, 'w', true)); // direct mix-case word prefix
		scores.push(_doScore(target, 'L', true)); // in-string case match
		scores.push(_doScore(target, 'l', true)); // in-string mix-case match
		scores.push(_doScore(target, '4', true)); // no match

		// Assert scoring order
		const sortedScores = scores.concat().sort((a, b) => b[0] - a[0]);
		assert.deepStrictEqual(scores, sortedScores);

		// Assert scoring positions
		// let positions = scores[0][1];
		// assert.strictEqual(positions.length, 'HelLo-World'.length);

		// positions = scores[2][1];
		// assert.strictEqual(positions.length, 'HW'.length);
		// assert.strictEqual(positions[0], 0);
		// assert.strictEqual(positions[1], 6);
	});

	test('score (non fuzzy)', function () {
		const target = 'HelLo-World';

		assert.ok(_doScore(target, 'HelLo-World', false)[0] > 0);
		assert.strictEqual(_doScore(target, 'HelLo-World', false)[1].length, 'HelLo-World'.length);

		assert.ok(_doScore(target, 'hello-world', false)[0] > 0);
		assert.strictEqual(_doScore(target, 'HW', false)[0], 0);
		assert.ok(_doScore(target, 'h', false)[0] > 0);
		assert.ok(_doScore(target, 'ello', false)[0] > 0);
		assert.ok(_doScore(target, 'ld', false)[0] > 0);
		assert.strictEqual(_doScore(target, 'eo', false)[0], 0);
	});

	test('scoreItem - matches are proper', function () {
		let res = scoreItem(null, 'something', true, ResourceAccessor);
		assert.ok(!res.score);

		const resource = URI.file('/xyz/some/path/someFile123.txt');

		res = scoreItem(resource, 'something', true, NullAccessor);
		assert.ok(!res.score);

		// Path Identity
		const identityRes = scoreItem(resource, ResourceAccessor.getItemPath(resource), true, ResourceAccessor);
		assert.ok(identityRes.score);
		assert.strictEqual(identityRes.descriptionMatch!.length, 1);
		assert.strictEqual(identityRes.labelMatch!.length, 1);
		assert.strictEqual(identityRes.descriptionMatch![0].start, 0);
		assert.strictEqual(identityRes.descriptionMatch![0].end, ResourceAccessor.getItemDescription(resource).length);
		assert.strictEqual(identityRes.labelMatch![0].start, 0);
		assert.strictEqual(identityRes.labelMatch![0].end, ResourceAccessor.getItemLabel(resource).length);

		// Basename Prefix
		const basenamePrefixRes = scoreItem(resource, 'som', true, ResourceAccessor);
		assert.ok(basenamePrefixRes.score);
		assert.ok(!basenamePrefixRes.descriptionMatch);
		assert.strictEqual(basenamePrefixRes.labelMatch!.length, 1);
		assert.strictEqual(basenamePrefixRes.labelMatch![0].start, 0);
		assert.strictEqual(basenamePrefixRes.labelMatch![0].end, 'som'.length);

		// Basename Camelcase
		const basenameCamelcaseRes = scoreItem(resource, 'sF', true, ResourceAccessor);
		assert.ok(basenameCamelcaseRes.score);
		assert.ok(!basenameCamelcaseRes.descriptionMatch);
		assert.strictEqual(basenameCamelcaseRes.labelMatch!.length, 2);
		assert.strictEqual(basenameCamelcaseRes.labelMatch![0].start, 0);
		assert.strictEqual(basenameCamelcaseRes.labelMatch![0].end, 1);
		assert.strictEqual(basenameCamelcaseRes.labelMatch![1].start, 4);
		assert.strictEqual(basenameCamelcaseRes.labelMatch![1].end, 5);

		// Basename Match
		const basenameRes = scoreItem(resource, 'of', true, ResourceAccessor);
		assert.ok(basenameRes.score);
		assert.ok(!basenameRes.descriptionMatch);
		assert.strictEqual(basenameRes.labelMatch!.length, 2);
		assert.strictEqual(basenameRes.labelMatch![0].start, 1);
		assert.strictEqual(basenameRes.labelMatch![0].end, 2);
		assert.strictEqual(basenameRes.labelMatch![1].start, 4);
		assert.strictEqual(basenameRes.labelMatch![1].end, 5);

		// Path Match
		const pathRes = scoreItem(resource, 'xyz123', true, ResourceAccessor);
		assert.ok(pathRes.score);
		assert.ok(pathRes.descriptionMatch);
		assert.ok(pathRes.labelMatch);
		assert.strictEqual(pathRes.labelMatch.length, 1);
		assert.strictEqual(pathRes.labelMatch[0].start, 8);
		assert.strictEqual(pathRes.labelMatch[0].end, 11);
		assert.strictEqual(pathRes.descriptionMatch.length, 1);
		assert.strictEqual(pathRes.descriptionMatch[0].start, 1);
		assert.strictEqual(pathRes.descriptionMatch[0].end, 4);

		// Ellipsis Match
		const ellipsisRes = scoreItem(resource, '…me/path/someFile123.txt', true, ResourceAccessor);
		assert.ok(ellipsisRes.score);
		assert.ok(pathRes.descriptionMatch);
		assert.ok(pathRes.labelMatch);
		assert.strictEqual(pathRes.labelMatch.length, 1);
		assert.strictEqual(pathRes.labelMatch[0].start, 8);
		assert.strictEqual(pathRes.labelMatch[0].end, 11);
		assert.strictEqual(pathRes.descriptionMatch.length, 1);
		assert.strictEqual(pathRes.descriptionMatch[0].start, 1);
		assert.strictEqual(pathRes.descriptionMatch[0].end, 4);

		// No Match
		const noRes = scoreItem(resource, '987', true, ResourceAccessor);
		assert.ok(!noRes.score);
		assert.ok(!noRes.labelMatch);
		assert.ok(!noRes.descriptionMatch);

		// No Exact Match
		const noExactRes = scoreItem(resource, '"sF"', true, ResourceAccessor);
		assert.ok(!noExactRes.score);
		assert.ok(!noExactRes.labelMatch);
		assert.ok(!noExactRes.descriptionMatch);
		assert.strictEqual(noRes.score, noExactRes.score);

		// Verify Scores
		assert.ok(identityRes.score > basenamePrefixRes.score);
		assert.ok(basenamePrefixRes.score > basenameRes.score);
		assert.ok(basenameRes.score > pathRes.score);
		assert.ok(pathRes.score > noRes.score);
	});

	test('scoreItem - multiple', function () {
		const resource = URI.file('/xyz/some/path/someFile123.txt');

		const res1 = scoreItem(resource, 'xyz some', true, ResourceAccessor);
		assert.ok(res1.score);
		assert.strictEqual(res1.labelMatch?.length, 1);
		assert.strictEqual(res1.labelMatch[0].start, 0);
		assert.strictEqual(res1.labelMatch[0].end, 4);
		assert.strictEqual(res1.descriptionMatch?.length, 1);
		assert.strictEqual(res1.descriptionMatch[0].start, 1);
		assert.strictEqual(res1.descriptionMatch[0].end, 4);

		const res2 = scoreItem(resource, 'some xyz', true, ResourceAccessor);
		assert.ok(res2.score);
		assert.strictEqual(res1.score, res2.score);
		assert.strictEqual(res2.labelMatch?.length, 1);
		assert.strictEqual(res2.labelMatch[0].start, 0);
		assert.strictEqual(res2.labelMatch[0].end, 4);
		assert.strictEqual(res2.descriptionMatch?.length, 1);
		assert.strictEqual(res2.descriptionMatch[0].start, 1);
		assert.strictEqual(res2.descriptionMatch[0].end, 4);

		const res3 = scoreItem(resource, 'some xyz file file123', true, ResourceAccessor);
		assert.ok(res3.score);
		assert.ok(res3.score > res2.score);
		assert.strictEqual(res3.labelMatch?.length, 1);
		assert.strictEqual(res3.labelMatch[0].start, 0);
		assert.strictEqual(res3.labelMatch[0].end, 11);
		assert.strictEqual(res3.descriptionMatch?.length, 1);
		assert.strictEqual(res3.descriptionMatch[0].start, 1);
		assert.strictEqual(res3.descriptionMatch[0].end, 4);

		const res4 = scoreItem(resource, 'path z y', true, ResourceAccessor);
		assert.ok(res4.score);
		assert.ok(res4.score < res2.score);
		assert.strictEqual(res4.labelMatch?.length, 0);
		assert.strictEqual(res4.descriptionMatch?.length, 2);
		assert.strictEqual(res4.descriptionMatch[0].start, 2);
		assert.strictEqual(res4.descriptionMatch[0].end, 4);
		assert.strictEqual(res4.descriptionMatch[1].start, 10);
		assert.strictEqual(res4.descriptionMatch[1].end, 14);
	});

	test('scoreItem - multiple with cache yields different results', function () {
		const resource = URI.file('/xyz/some/path/someFile123.txt');
		const cache = {};
		const res1 = scoreItem(resource, 'xyz sm', true, ResourceAccessor, cache);
		assert.ok(res1.score);

		// from the cache's perspective this should be a totally different query
		const res2 = scoreItem(resource, 'xyz "sm"', true, ResourceAccessor, cache);
		assert.ok(!res2.score);
	});

	test('scoreItem - invalid input', function () {

		let res = scoreItem(null, null!, true, ResourceAccessor);
		assert.strictEqual(res.score, 0);

		res = scoreItem(null, 'null', true, ResourceAccessor);
		assert.strictEqual(res.score, 0);
	});

	test('scoreItem - optimize for file paths', function () {
		const resource = URI.file('/xyz/others/spath/some/xsp/file123.txt');

		// xsp is more relevant to the end of the file path even though it matches
		// fuzzy also in the beginning. we verify the more relevant match at the
		// end gets returned.
		const pathRes = scoreItem(resource, 'xspfile123', true, ResourceAccessor);
		assert.ok(pathRes.score);
		assert.ok(pathRes.descriptionMatch);
		assert.ok(pathRes.labelMatch);
		assert.strictEqual(pathRes.labelMatch.length, 1);
		assert.strictEqual(pathRes.labelMatch[0].start, 0);
		assert.strictEqual(pathRes.labelMatch[0].end, 7);
		assert.strictEqual(pathRes.descriptionMatch.length, 1);
		assert.strictEqual(pathRes.descriptionMatch[0].start, 23);
		assert.strictEqual(pathRes.descriptionMatch[0].end, 26);
	});

	test('scoreItem - avoid match scattering (bug #36119)', function () {
		const resource = URI.file('projects/ui/cula/ats/target.mk');

		const pathRes = scoreItem(resource, 'tcltarget.mk', true, ResourceAccessor);
		assert.ok(pathRes.score);
		assert.ok(pathRes.descriptionMatch);
		assert.ok(pathRes.labelMatch);
		assert.strictEqual(pathRes.labelMatch.length, 1);
		assert.strictEqual(pathRes.labelMatch[0].start, 0);
		assert.strictEqual(pathRes.labelMatch[0].end, 9);
	});

	test('scoreItem - prefers more compact matches', function () {
		const resource = URI.file('/1a111d1/11a1d1/something.txt');

		// expect "ad" to be matched towards the end of the file because the
		// match is more compact
		const res = scoreItem(resource, 'ad', true, ResourceAccessor);
		assert.ok(res.score);
		assert.ok(res.descriptionMatch);
		assert.ok(!res.labelMatch!.length);
		assert.strictEqual(res.descriptionMatch.length, 2);
		assert.strictEqual(res.descriptionMatch[0].start, 11);
		assert.strictEqual(res.descriptionMatch[0].end, 12);
		assert.strictEqual(res.descriptionMatch[1].start, 13);
		assert.strictEqual(res.descriptionMatch[1].end, 14);
	});

	test('scoreItem - proper target offset', function () {
		const resource = URI.file('etem');

		const res = scoreItem(resource, 'teem', true, ResourceAccessor);
		assert.ok(!res.score);
	});

	test('scoreItem - proper target offset #2', function () {
		const resource = URI.file('ede');

		const res = scoreItem(resource, 'de', true, ResourceAccessor);

		assert.strictEqual(res.labelMatch!.length, 1);
		assert.strictEqual(res.labelMatch![0].start, 1);
		assert.strictEqual(res.labelMatch![0].end, 3);
	});

	test('scoreItem - proper target offset #3', function () {
		const resource = URI.file('/src/vs/editor/browser/viewParts/lineNumbers/flipped-cursor-2x.svg');

		const res = scoreItem(resource, 'debug', true, ResourceAccessor);

		assert.strictEqual(res.descriptionMatch!.length, 3);
		assert.strictEqual(res.descriptionMatch![0].start, 9);
		assert.strictEqual(res.descriptionMatch![0].end, 10);
		assert.strictEqual(res.descriptionMatch![1].start, 36);
		assert.strictEqual(res.descriptionMatch![1].end, 37);
		assert.strictEqual(res.descriptionMatch![2].start, 40);
		assert.strictEqual(res.descriptionMatch![2].end, 41);

		assert.strictEqual(res.labelMatch!.length, 2);
		assert.strictEqual(res.labelMatch![0].start, 9);
		assert.strictEqual(res.labelMatch![0].end, 10);
		assert.strictEqual(res.labelMatch![1].start, 20);
		assert.strictEqual(res.labelMatch![1].end, 21);
	});

	test('scoreItem - no match unless query contained in sequence', function () {
		const resource = URI.file('abcde');

		const res = scoreItem(resource, 'edcda', true, ResourceAccessor);
		assert.ok(!res.score);
	});

	test('scoreItem - match if using slash or backslash (local, remote resource)', function () {
		const localResource = URI.file('abcde/super/duper');
		const remoteResource = URI.from({ scheme: Schemas.vscodeRemote, path: 'abcde/super/duper' });

		for (const resource of [localResource, remoteResource]) {
			let res = scoreItem(resource, 'abcde\\super\\duper', true, ResourceAccessor);
			assert.ok(res.score);

			res = scoreItem(resource, 'abcde\\super\\duper', true, ResourceWithSlashAccessor);
			assert.ok(res.score);

			res = scoreItem(resource, 'abcde\\super\\duper', true, ResourceWithBackslashAccessor);
			assert.ok(res.score);

			res = scoreItem(resource, 'abcde/super/duper', true, ResourceAccessor);
			assert.ok(res.score);

			res = scoreItem(resource, 'abcde/super/duper', true, ResourceWithSlashAccessor);
			assert.ok(res.score);

			res = scoreItem(resource, 'abcde/super/duper', true, ResourceWithBackslashAccessor);
			assert.ok(res.score);
		}
	});

	test('scoreItem - ensure upper case bonus only applies on non-consecutive matches (bug #134723)', function () {
		const resourceWithUpper = URI.file('ASDFasdfasdf');
		const resourceAllLower = URI.file('asdfasdfasdf');

		assert.ok(scoreItem(resourceAllLower, 'asdf', true, ResourceAccessor).score > scoreItem(resourceWithUpper, 'asdf', true, ResourceAccessor).score);
	});

	test('compareItemsByScore - identity', function () {
		const resourceA = URI.file('/some/path/fileA.txt');
		const resourceB = URI.file('/some/path/other/fileB.txt');
		const resourceC = URI.file('/unrelated/some/path/other/fileC.txt');

		// Full resource A path
		let query = ResourceAccessor.getItemPath(resourceA);

		let res = [resourceA, resourceB, resourceC].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceA);
		assert.strictEqual(res[1], resourceB);
		assert.strictEqual(res[2], resourceC);

		res = [resourceC, resourceB, resourceA].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceA);
		assert.strictEqual(res[1], resourceB);
		assert.strictEqual(res[2], resourceC);

		// Full resource B path
		query = ResourceAccessor.getItemPath(resourceB);

		res = [resourceA, resourceB, resourceC].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);
		assert.strictEqual(res[1], resourceA);
		assert.strictEqual(res[2], resourceC);

		res = [resourceC, resourceB, resourceA].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);
		assert.strictEqual(res[1], resourceA);
		assert.strictEqual(res[2], resourceC);
	});

	test('compareFilesByScore - basename prefix', function () {
		const resourceA = URI.file('/some/path/fileA.txt');
		const resourceB = URI.file('/some/path/other/fileB.txt');
		const resourceC = URI.file('/unrelated/some/path/other/fileC.txt');

		// Full resource A basename
		let query = ResourceAccessor.getItemLabel(resourceA);

		let res = [resourceA, resourceB, resourceC].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceA);
		assert.strictEqual(res[1], resourceB);
		assert.strictEqual(res[2], resourceC);

		res = [resourceC, resourceB, resourceA].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceA);
		assert.strictEqual(res[1], resourceB);
		assert.strictEqual(res[2], resourceC);

		// Full resource B basename
		query = ResourceAccessor.getItemLabel(resourceB);

		res = [resourceA, resourceB, resourceC].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);
		assert.strictEqual(res[1], resourceA);
		assert.strictEqual(res[2], resourceC);

		res = [resourceC, resourceB, resourceA].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);
		assert.strictEqual(res[1], resourceA);
		assert.strictEqual(res[2], resourceC);
	});

	test('compareFilesByScore - basename camelcase', function () {
		const resourceA = URI.file('/some/path/fileA.txt');
		const resourceB = URI.file('/some/path/other/fileB.txt');
		const resourceC = URI.file('/unrelated/some/path/other/fileC.txt');

		// resource A camelcase
		let query = 'fA';

		let res = [resourceA, resourceB, resourceC].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceA);
		assert.strictEqual(res[1], resourceB);
		assert.strictEqual(res[2], resourceC);

		res = [resourceC, resourceB, resourceA].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceA);
		assert.strictEqual(res[1], resourceB);
		assert.strictEqual(res[2], resourceC);

		// resource B camelcase
		query = 'fB';

		res = [resourceA, resourceB, resourceC].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);
		assert.strictEqual(res[1], resourceA);
		assert.strictEqual(res[2], resourceC);

		res = [resourceC, resourceB, resourceA].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);
		assert.strictEqual(res[1], resourceA);
		assert.strictEqual(res[2], resourceC);
	});

	test('compareFilesByScore - basename scores', function () {
		const resourceA = URI.file('/some/path/fileA.txt');
		const resourceB = URI.file('/some/path/other/fileB.txt');
		const resourceC = URI.file('/unrelated/some/path/other/fileC.txt');

		// Resource A part of basename
		let query = 'fileA';

		let res = [resourceA, resourceB, resourceC].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceA);
		assert.strictEqual(res[1], resourceB);
		assert.strictEqual(res[2], resourceC);

		res = [resourceC, resourceB, resourceA].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceA);
		assert.strictEqual(res[1], resourceB);
		assert.strictEqual(res[2], resourceC);

		// Resource B part of basename
		query = 'fileB';

		res = [resourceA, resourceB, resourceC].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);
		assert.strictEqual(res[1], resourceA);
		assert.strictEqual(res[2], resourceC);

		res = [resourceC, resourceB, resourceA].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);
		assert.strictEqual(res[1], resourceA);
		assert.strictEqual(res[2], resourceC);
	});

	test('compareFilesByScore - path scores', function () {
		const resourceA = URI.file('/some/path/fileA.txt');
		const resourceB = URI.file('/some/path/other/fileB.txt');
		const resourceC = URI.file('/unrelated/some/path/other/fileC.txt');

		// Resource A part of path
		let query = 'pathfileA';

		let res = [resourceA, resourceB, resourceC].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceA);
		assert.strictEqual(res[1], resourceB);
		assert.strictEqual(res[2], resourceC);

		res = [resourceC, resourceB, resourceA].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceA);
		assert.strictEqual(res[1], resourceB);
		assert.strictEqual(res[2], resourceC);

		// Resource B part of path
		query = 'pathfileB';

		res = [resourceA, resourceB, resourceC].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);
		assert.strictEqual(res[1], resourceA);
		assert.strictEqual(res[2], resourceC);

		res = [resourceC, resourceB, resourceA].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);
		assert.strictEqual(res[1], resourceA);
		assert.strictEqual(res[2], resourceC);
	});

	test('compareFilesByScore - prefer shorter basenames', function () {
		const resourceA = URI.file('/some/path/fileA.txt');
		const resourceB = URI.file('/some/path/other/fileBLonger.txt');
		const resourceC = URI.file('/unrelated/the/path/other/fileC.txt');

		// Resource A part of path
		const query = 'somepath';

		let res = [resourceA, resourceB, resourceC].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceA);
		assert.strictEqual(res[1], resourceB);
		assert.strictEqual(res[2], resourceC);

		res = [resourceC, resourceB, resourceA].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceA);
		assert.strictEqual(res[1], resourceB);
		assert.strictEqual(res[2], resourceC);
	});

	test('compareFilesByScore - prefer shorter basenames (match on basename)', function () {
		const resourceA = URI.file('/some/path/fileA.txt');
		const resourceB = URI.file('/some/path/other/fileBLonger.txt');
		const resourceC = URI.file('/unrelated/the/path/other/fileC.txt');

		// Resource A part of path
		const query = 'file';

		let res = [resourceA, resourceB, resourceC].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceA);
		assert.strictEqual(res[1], resourceC);
		assert.strictEqual(res[2], resourceB);

		res = [resourceC, resourceB, resourceA].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceA);
		assert.strictEqual(res[1], resourceC);
		assert.strictEqual(res[2], resourceB);
	});

	test('compareFilesByScore - prefer shorter paths', function () {
		const resourceA = URI.file('/some/path/fileA.txt');
		const resourceB = URI.file('/some/path/other/fileB.txt');
		const resourceC = URI.file('/unrelated/some/path/other/fileC.txt');

		// Resource A part of path
		const query = 'somepath';

		let res = [resourceA, resourceB, resourceC].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceA);
		assert.strictEqual(res[1], resourceB);
		assert.strictEqual(res[2], resourceC);

		res = [resourceC, resourceB, resourceA].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceA);
		assert.strictEqual(res[1], resourceB);
		assert.strictEqual(res[2], resourceC);
	});

	test('compareFilesByScore - prefer shorter paths (bug #17443)', function () {
		const resourceA = URI.file('config/test/t1.js');
		const resourceB = URI.file('config/test.js');
		const resourceC = URI.file('config/test/t2.js');

		const query = 'co/te';

		const res = [resourceA, resourceB, resourceC].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);
		assert.strictEqual(res[1], resourceA);
		assert.strictEqual(res[2], resourceC);
	});

	test('compareFilesByScore - prefer matches in label over description if scores are otherwise equal', function () {
		const resourceA = URI.file('parts/quick/arrow-left-dark.svg');
		const resourceB = URI.file('parts/quickopen/quickopen.ts');

		const query = 'partsquick';

		const res = [resourceA, resourceB].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);
		assert.strictEqual(res[1], resourceA);
	});

	test('compareFilesByScore - prefer camel case matches', function () {
		const resourceA = URI.file('config/test/NullPointerException.java');
		const resourceB = URI.file('config/test/nopointerexception.java');

		for (const query of ['npe', 'NPE']) {
			let res = [resourceA, resourceB].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
			assert.strictEqual(res[0], resourceA);
			assert.strictEqual(res[1], resourceB);

			res = [resourceB, resourceA].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
			assert.strictEqual(res[0], resourceA);
			assert.strictEqual(res[1], resourceB);
		}
	});

	test('compareFilesByScore - prefer more compact camel case matches', function () {
		const resourceA = URI.file('config/test/openthisAnythingHandler.js');
		const resourceB = URI.file('config/test/openthisisnotsorelevantforthequeryAnyHand.js');

		const query = 'AH';

		let res = [resourceA, resourceB].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);
		assert.strictEqual(res[1], resourceA);

		res = [resourceB, resourceA].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);
		assert.strictEqual(res[1], resourceA);
	});

	test('compareFilesByScore - prefer more compact matches (label)', function () {
		const resourceA = URI.file('config/test/examasdaple.js');
		const resourceB = URI.file('config/test/exampleasdaasd.ts');

		const query = 'xp';

		let res = [resourceA, resourceB].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);
		assert.strictEqual(res[1], resourceA);

		res = [resourceB, resourceA].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);
		assert.strictEqual(res[1], resourceA);
	});

	test('compareFilesByScore - prefer more compact matches (path)', function () {
		const resourceA = URI.file('config/test/examasdaple/file.js');
		const resourceB = URI.file('config/test/exampleasdaasd/file.ts');

		const query = 'xp';

		let res = [resourceA, resourceB].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);
		assert.strictEqual(res[1], resourceA);

		res = [resourceB, resourceA].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);
		assert.strictEqual(res[1], resourceA);
	});

	test('compareFilesByScore - prefer more compact matches (label and path)', function () {
		const resourceA = URI.file('config/example/thisfile.ts');
		const resourceB = URI.file('config/24234243244/example/file.js');

		const query = 'exfile';

		let res = [resourceA, resourceB].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);
		assert.strictEqual(res[1], resourceA);

		res = [resourceB, resourceA].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);
		assert.strictEqual(res[1], resourceA);
	});

	test('compareFilesByScore - avoid match scattering (bug #34210)', function () {
		const resourceA = URI.file('node_modules1/bundle/lib/model/modules/ot1/index.js');
		const resourceB = URI.file('node_modules1/bundle/lib/model/modules/un1/index.js');
		const resourceC = URI.file('node_modules1/bundle/lib/model/modules/modu1/index.js');
		const resourceD = URI.file('node_modules1/bundle/lib/model/modules/oddl1/index.js');

		let query = isWindows ? 'modu1\\index.js' : 'modu1/index.js';

		let res = [resourceA, resourceB, resourceC, resourceD].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceC);

		res = [resourceC, resourceB, resourceA, resourceD].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceC);

		query = isWindows ? 'un1\\index.js' : 'un1/index.js';

		res = [resourceA, resourceB, resourceC, resourceD].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);

		res = [resourceC, resourceB, resourceA, resourceD].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);
	});

	test('compareFilesByScore - avoid match scattering (bug #21019 1.)', function () {
		const resourceA = URI.file('app/containers/Services/NetworkData/ServiceDetails/ServiceLoad/index.js');
		const resourceB = URI.file('app/containers/Services/NetworkData/ServiceDetails/ServiceDistribution/index.js');
		const resourceC = URI.file('app/containers/Services/NetworkData/ServiceDetailTabs/ServiceTabs/StatVideo/index.js');

		const query = 'StatVideoindex';

		let res = [resourceA, resourceB, resourceC].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceC);

		res = [resourceC, resourceB, resourceA].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceC);
	});

	test('compareFilesByScore - avoid match scattering (bug #21019 2.)', function () {
		const resourceA = URI.file('src/build-helper/store/redux.ts');
		const resourceB = URI.file('src/repository/store/redux.ts');

		const query = 'reproreduxts';

		let res = [resourceA, resourceB].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);

		res = [resourceB, resourceA].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);
	});

	test('compareFilesByScore - avoid match scattering (bug #26649)', function () {
		const resourceA = URI.file('photobook/src/components/AddPagesButton/index.js');
		const resourceB = URI.file('photobook/src/components/ApprovalPageHeader/index.js');
		const resourceC = URI.file('photobook/src/canvasComponents/BookPage/index.js');

		const query = 'bookpageIndex';

		let res = [resourceA, resourceB, resourceC].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceC);

		res = [resourceC, resourceB, resourceA].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceC);
	});

	test('compareFilesByScore - avoid match scattering (bug #33247)', function () {
		const resourceA = URI.file('ui/src/utils/constants.js');
		const resourceB = URI.file('ui/src/ui/Icons/index.js');

		const query = isWindows ? 'ui\\icons' : 'ui/icons';

		let res = [resourceA, resourceB].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);

		res = [resourceB, resourceA].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);
	});

	test('compareFilesByScore - avoid match scattering (bug #33247 comment)', function () {
		const resourceA = URI.file('ui/src/components/IDInput/index.js');
		const resourceB = URI.file('ui/src/ui/Input/index.js');

		const query = isWindows ? 'ui\\input\\index' : 'ui/input/index';

		let res = [resourceA, resourceB].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);

		res = [resourceB, resourceA].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);
	});

	test('compareFilesByScore - avoid match scattering (bug #36166)', function () {
		const resourceA = URI.file('django/contrib/sites/locale/ga/LC_MESSAGES/django.mo');
		const resourceB = URI.file('django/core/signals.py');

		const query = 'djancosig';

		let res = [resourceA, resourceB].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);

		res = [resourceB, resourceA].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);
	});

	test('compareFilesByScore - avoid match scattering (bug #32918)', function () {
		const resourceA = URI.file('adsys/protected/config.php');
		const resourceB = URI.file('adsys/protected/framework/smarty/sysplugins/smarty_internal_config.php');
		const resourceC = URI.file('duowanVideo/wap/protected/config.php');

		const query = 'protectedconfig.php';

		let res = [resourceA, resourceB, resourceC].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceA);
		assert.strictEqual(res[1], resourceC);
		assert.strictEqual(res[2], resourceB);

		res = [resourceC, resourceB, resourceA].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceA);
		assert.strictEqual(res[1], resourceC);
		assert.strictEqual(res[2], resourceB);
	});

	test('compareFilesByScore - avoid match scattering (bug #14879)', function () {
		const resourceA = URI.file('pkg/search/gradient/testdata/constraint_attrMatchString.yml');
		const resourceB = URI.file('cmd/gradient/main.go');

		const query = 'gradientmain';

		let res = [resourceA, resourceB].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);

		res = [resourceB, resourceA].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);
	});

	test('compareFilesByScore - avoid match scattering (bug #14727 1)', function () {
		const resourceA = URI.file('alpha-beta-cappa.txt');
		const resourceB = URI.file('abc.txt');

		const query = 'abc';

		let res = [resourceA, resourceB].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);

		res = [resourceB, resourceA].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);
	});

	test('compareFilesByScore - avoid match scattering (bug #14727 2)', function () {
		const resourceA = URI.file('xerxes-yak-zubba/index.js');
		const resourceB = URI.file('xyz/index.js');

		const query = 'xyz';

		let res = [resourceA, resourceB].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);

		res = [resourceB, resourceA].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);
	});

	test('compareFilesByScore - avoid match scattering (bug #18381)', function () {
		const resourceA = URI.file('AssymblyInfo.cs');
		const resourceB = URI.file('IAsynchronousTask.java');

		const query = 'async';

		let res = [resourceA, resourceB].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);

		res = [resourceB, resourceA].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);
	});

	test('compareFilesByScore - avoid match scattering (bug #35572)', function () {
		const resourceA = URI.file('static/app/source/angluar/-admin/-organization/-settings/layout/layout.js');
		const resourceB = URI.file('static/app/source/angular/-admin/-project/-settings/_settings/settings.js');

		const query = 'partisettings';

		let res = [resourceA, resourceB].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);

		res = [resourceB, resourceA].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);
	});

	test('compareFilesByScore - avoid match scattering (bug #36810)', function () {
		const resourceA = URI.file('Trilby.TrilbyTV.Web.Portal/Views/Systems/Index.cshtml');
		const resourceB = URI.file('Trilby.TrilbyTV.Web.Portal/Areas/Admins/Views/Tips/Index.cshtml');

		const query = 'tipsindex.cshtml';

		let res = [resourceA, resourceB].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);

		res = [resourceB, resourceA].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);
	});

	test('compareFilesByScore - prefer shorter hit (bug #20546)', function () {
		const resourceA = URI.file('editor/core/components/tests/list-view-spec.js');
		const resourceB = URI.file('editor/core/components/list-view.js');

		const query = 'listview';

		let res = [resourceA, resourceB].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);

		res = [resourceB, resourceA].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);
	});

	test('compareFilesByScore - avoid match scattering (bug #12095)', function () {
		const resourceA = URI.file('src/vs/workbench/contrib/files/common/explorerViewModel.ts');
		const resourceB = URI.file('src/vs/workbench/contrib/files/browser/views/explorerView.ts');
		const resourceC = URI.file('src/vs/workbench/contrib/files/browser/views/explorerViewer.ts');

		const query = 'filesexplorerview.ts';

		let res = [resourceA, resourceB, resourceC].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);

		res = [resourceA, resourceC, resourceB].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);
	});

	test('compareFilesByScore - prefer case match (bug #96122)', function () {
		const resourceA = URI.file('lists.php');
		const resourceB = URI.file('lib/Lists.php');

		const query = 'Lists.php';

		let res = [resourceA, resourceB].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);

		res = [resourceB, resourceA].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);
	});

	test('compareFilesByScore - prefer shorter match (bug #103052) - foo bar', function () {
		const resourceA = URI.file('app/emails/foo.bar.js');
		const resourceB = URI.file('app/emails/other-footer.other-bar.js');

		for (const query of ['foo bar', 'foobar']) {
			let res = [resourceA, resourceB].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
			assert.strictEqual(res[0], resourceA);
			assert.strictEqual(res[1], resourceB);

			res = [resourceB, resourceA].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
			assert.strictEqual(res[0], resourceA);
			assert.strictEqual(res[1], resourceB);
		}
	});

	test('compareFilesByScore - prefer shorter match (bug #103052) - payment model', function () {
		const resourceA = URI.file('app/components/payment/payment.model.js');
		const resourceB = URI.file('app/components/online-payments-history/online-payments-history.model.js');

		for (const query of ['payment model', 'paymentmodel']) {
			let res = [resourceA, resourceB].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
			assert.strictEqual(res[0], resourceA);
			assert.strictEqual(res[1], resourceB);

			res = [resourceB, resourceA].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
			assert.strictEqual(res[0], resourceA);
			assert.strictEqual(res[1], resourceB);
		}
	});

	test('compareFilesByScore - prefer shorter match (bug #103052) - color', function () {
		const resourceA = URI.file('app/constants/color.js');
		const resourceB = URI.file('app/components/model/input/pick-avatar-color.js');

		for (const query of ['color js', 'colorjs']) {
			let res = [resourceA, resourceB].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
			assert.strictEqual(res[0], resourceA);
			assert.strictEqual(res[1], resourceB);

			res = [resourceB, resourceA].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
			assert.strictEqual(res[0], resourceA);
			assert.strictEqual(res[1], resourceB);
		}
	});

	test('compareFilesByScore - prefer strict case prefix', function () {
		const resourceA = URI.file('app/constants/color.js');
		const resourceB = URI.file('app/components/model/input/Color.js');

		let query = 'Color';

		let res = [resourceA, resourceB].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);
		assert.strictEqual(res[1], resourceA);

		res = [resourceB, resourceA].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);
		assert.strictEqual(res[1], resourceA);

		query = 'color';

		res = [resourceA, resourceB].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceA);
		assert.strictEqual(res[1], resourceB);

		res = [resourceB, resourceA].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceA);
		assert.strictEqual(res[1], resourceB);
	});

	test('compareFilesByScore - prefer prefix (bug #103052)', function () {
		const resourceA = URI.file('test/smoke/src/main.ts');
		const resourceB = URI.file('src/vs/editor/common/services/semantikTokensProviderStyling.ts');

		const query = 'smoke main.ts';

		let res = [resourceA, resourceB].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceA);
		assert.strictEqual(res[1], resourceB);

		res = [resourceB, resourceA].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceA);
		assert.strictEqual(res[1], resourceB);
	});

	test('compareFilesByScore - boost better prefix match if multiple queries are used', function () {
		const resourceA = URI.file('src/vs/workbench/services/host/browser/browserHostService.ts');
		const resourceB = URI.file('src/vs/workbench/browser/workbench.ts');

		for (const query of ['workbench.ts browser', 'browser workbench.ts', 'browser workbench', 'workbench browser']) {
			let res = [resourceA, resourceB].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
			assert.strictEqual(res[0], resourceB);
			assert.strictEqual(res[1], resourceA);

			res = [resourceB, resourceA].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
			assert.strictEqual(res[0], resourceB);
			assert.strictEqual(res[1], resourceA);
		}
	});

	test('compareFilesByScore - boost shorter prefix match if multiple queries are used', function () {
		const resourceA = URI.file('src/vs/workbench/node/actions/windowActions.ts');
		const resourceB = URI.file('src/vs/workbench/electron-node/window.ts');

		for (const query of ['window node', 'window.ts node']) {
			let res = [resourceA, resourceB].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
			assert.strictEqual(res[0], resourceB);
			assert.strictEqual(res[1], resourceA);

			res = [resourceB, resourceA].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
			assert.strictEqual(res[0], resourceB);
			assert.strictEqual(res[1], resourceA);
		}
	});

	test('compareFilesByScore - skip preference on label match when using path sep', function () {
		const resourceA = URI.file('djangosite/ufrela/def.py');
		const resourceB = URI.file('djangosite/urls/default.py');

		const query = 'url/def';

		let res = [resourceA, resourceB].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);
		assert.strictEqual(res[1], resourceA);

		res = [resourceB, resourceA].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);
		assert.strictEqual(res[1], resourceA);
	});

	test('compareFilesByScore - boost shorter prefix match if multiple queries are used (#99171)', function () {
		const resourceA = URI.file('mesh_editor_lifetime_job.h');
		const resourceB = URI.file('lifetime_job.h');

		const query = 'm life, life m';

		let res = [resourceA, resourceB].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);
		assert.strictEqual(res[1], resourceA);

		res = [resourceB, resourceA].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);
		assert.strictEqual(res[1], resourceA);
	});

	test('compareFilesByScore - boost consecutive matches in the beginning over end', function () {
		const resourceA = URI.file('src/vs/server/node/extensionHostStatusService.ts');
		const resourceB = URI.file('src/vs/workbench/browser/parts/notifications/notificationsStatus.ts');

		const query = 'notStatus';

		let res = [resourceA, resourceB].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);
		assert.strictEqual(res[1], resourceA);

		res = [resourceB, resourceA].sort((r1, r2) => compareItemsByScore(r1, r2, query, true, ResourceAccessor));
		assert.strictEqual(res[0], resourceB);
		assert.strictEqual(res[1], resourceA);
	});

	test('prepareQuery', () => {
		assert.strictEqual(prepareQuery(' f*a ').normalized, 'fa');
		assert.strictEqual(prepareQuery(' f…a ').normalized, 'fa');
		assert.strictEqual(prepareQuery('model Tester.ts').original, 'model Tester.ts');
		assert.strictEqual(prepareQuery('model Tester.ts').originalLowercase, 'model Tester.ts'.toLowerCase());
		assert.strictEqual(prepareQuery('model Tester.ts').normalized, 'modelTester.ts');
		assert.strictEqual(prepareQuery('model Tester.ts').expectContiguousMatch, false); // doesn't have quotes in it
		assert.strictEqual(prepareQuery('Model Tester.ts').normalizedLowercase, 'modeltester.ts');
		assert.strictEqual(prepareQuery('ModelTester.ts').containsPathSeparator, false);
		assert.strictEqual(prepareQuery('Model' + sep + 'Tester.ts').containsPathSeparator, true);
		assert.strictEqual(prepareQuery('"hello"').expectContiguousMatch, true);
		assert.strictEqual(prepareQuery('"hello"').normalized, 'hello');

		// with spaces
		let query = prepareQuery('He*llo World');
		assert.strictEqual(query.original, 'He*llo World');
		assert.strictEqual(query.normalized, 'HelloWorld');
		assert.strictEqual(query.normalizedLowercase, 'HelloWorld'.toLowerCase());
		assert.strictEqual(query.values?.length, 2);
		assert.strictEqual(query.values?.[0].original, 'He*llo');
		assert.strictEqual(query.values?.[0].normalized, 'Hello');
		assert.strictEqual(query.values?.[0].normalizedLowercase, 'Hello'.toLowerCase());
		assert.strictEqual(query.values?.[1].original, 'World');
		assert.strictEqual(query.values?.[1].normalized, 'World');
		assert.strictEqual(query.values?.[1].normalizedLowercase, 'World'.toLowerCase());

		const restoredQuery = pieceToQuery(query.values);
		assert.strictEqual(restoredQuery.original, query.original);
		assert.strictEqual(restoredQuery.values?.length, query.values?.length);
		assert.strictEqual(restoredQuery.containsPathSeparator, query.containsPathSeparator);

		// with spaces that are empty
		query = prepareQuery(' Hello   World  	');
		assert.strictEqual(query.original, ' Hello   World  	');
		assert.strictEqual(query.originalLowercase, ' Hello   World  	'.toLowerCase());
		assert.strictEqual(query.normalized, 'HelloWorld');
		assert.strictEqual(query.normalizedLowercase, 'HelloWorld'.toLowerCase());
		assert.strictEqual(query.values?.length, 2);
		assert.strictEqual(query.values?.[0].original, 'Hello');
		assert.strictEqual(query.values?.[0].originalLowercase, 'Hello'.toLowerCase());
		assert.strictEqual(query.values?.[0].normalized, 'Hello');
		assert.strictEqual(query.values?.[0].normalizedLowercase, 'Hello'.toLowerCase());
		assert.strictEqual(query.values?.[1].original, 'World');
		assert.strictEqual(query.values?.[1].originalLowercase, 'World'.toLowerCase());
		assert.strictEqual(query.values?.[1].normalized, 'World');
		assert.strictEqual(query.values?.[1].normalizedLowercase, 'World'.toLowerCase());

		// Path related
		if (isWindows) {
			assert.strictEqual(prepareQuery('C:\\some\\path').pathNormalized, 'C:\\some\\path');
			assert.strictEqual(prepareQuery('C:\\some\\path').normalized, 'C:\\some\\path');
			assert.strictEqual(prepareQuery('C:\\some\\path').containsPathSeparator, true);
			assert.strictEqual(prepareQuery('C:/some/path').pathNormalized, 'C:\\some\\path');
			assert.strictEqual(prepareQuery('C:/some/path').normalized, 'C:\\some\\path');
			assert.strictEqual(prepareQuery('C:/some/path').containsPathSeparator, true);
		} else {
			assert.strictEqual(prepareQuery('/some/path').pathNormalized, '/some/path');
			assert.strictEqual(prepareQuery('/some/path').normalized, '/some/path');
			assert.strictEqual(prepareQuery('/some/path').containsPathSeparator, true);
			assert.strictEqual(prepareQuery('\\some\\path').pathNormalized, '/some/path');
			assert.strictEqual(prepareQuery('\\some\\path').normalized, '/some/path');
			assert.strictEqual(prepareQuery('\\some\\path').containsPathSeparator, true);
		}
	});

	test('fuzzyScore2 (matching)', function () {
		const target = 'HelLo-World';

		for (const offset of [0, 3]) {
			let [score, matches] = _doScore2(offset === 0 ? target : `123${target}`, 'HelLo-World', offset);

			assert.ok(score);
			assert.strictEqual(matches.length, 1);
			assert.strictEqual(matches[0].start, 0 + offset);
			assert.strictEqual(matches[0].end, target.length + offset);

			[score, matches] = _doScore2(offset === 0 ? target : `123${target}`, 'HW', offset);

			assert.ok(score);
			assert.strictEqual(matches.length, 2);
			assert.strictEqual(matches[0].start, 0 + offset);
			assert.strictEqual(matches[0].end, 1 + offset);
			assert.strictEqual(matches[1].start, 6 + offset);
			assert.strictEqual(matches[1].end, 7 + offset);
		}
	});

	test('fuzzyScore2 (multiple queries)', function () {
		const target = 'HelLo-World';

		const [firstSingleScore, firstSingleMatches] = _doScore2(target, 'HelLo');
		const [secondSingleScore, secondSingleMatches] = _doScore2(target, 'World');
		const firstAndSecondSingleMatches = [...firstSingleMatches || [], ...secondSingleMatches || []];

		let [multiScore, multiMatches] = _doScore2(target, 'HelLo World');

		function assertScore() {
			assert.ok(multiScore ?? 0 >= ((firstSingleScore ?? 0) + (secondSingleScore ?? 0)));
			for (let i = 0; multiMatches && i < multiMatches.length; i++) {
				const multiMatch = multiMatches[i];
				const firstAndSecondSingleMatch = firstAndSecondSingleMatches[i];

				if (multiMatch && firstAndSecondSingleMatch) {
					assert.strictEqual(multiMatch.start, firstAndSecondSingleMatch.start);
					assert.strictEqual(multiMatch.end, firstAndSecondSingleMatch.end);
				} else {
					assert.fail();
				}
			}
		}

		function assertNoScore() {
			assert.strictEqual(multiScore, undefined);
			assert.strictEqual(multiMatches.length, 0);
		}

		assertScore();

		[multiScore, multiMatches] = _doScore2(target, 'World HelLo');
		assertScore();

		[multiScore, multiMatches] = _doScore2(target, 'World HelLo World');
		assertScore();

		[multiScore, multiMatches] = _doScore2(target, 'World HelLo Nothing');
		assertNoScore();

		[multiScore, multiMatches] = _doScore2(target, 'More Nothing');
		assertNoScore();
	});

	test('fuzzyScore2 (#95716)', function () {
		const target = '# ❌ Wow';

		const score = _doScore2(target, '❌');
		assert.ok(score);
		assert.ok(typeof score[0] === 'number');
		assert.ok(score[1].length > 0);
	});

	test('Using quotes should expect contiguous matches match', function () {
		// missing the "i" in the query
		assert.strictEqual(_doScore('contiguous', '"contguous"')[0], 0);

		const score = _doScore('contiguous', '"contiguous"');
		assert.ok(score[0] > 0);
	});

	test('Using quotes should highlight contiguous indexes', function () {
		const score = _doScore('2021-7-26.md', '"26"');
		assert.strictEqual(score[0], 14);

		// The indexes of the 2 and 6 of "26"
		assert.strictEqual(score[1][0], 7);
		assert.strictEqual(score[1][1], 8);
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/glob.test.ts]---
Location: vscode-main/src/vs/base/test/common/glob.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import * as glob from '../../common/glob.js';
import { sep } from '../../common/path.js';
import { isLinux, isMacintosh, isWindows } from '../../common/platform.js';
import { URI } from '../../common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';

suite('Glob', () => {

	// test('perf', () => {

	// 	let patterns = [
	// 		'{**/*.cs,**/*.json,**/*.csproj,**/*.sln}',
	// 		'{**/*.cs,**/*.csproj,**/*.sln}',
	// 		'{**/*.ts,**/*.tsx,**/*.js,**/*.jsx,**/*.es6,**/*.mjs,**/*.cjs}',
	// 		'**/*.go',
	// 		'{**/*.ps,**/*.ps1}',
	// 		'{**/*.c,**/*.cpp,**/*.h}',
	// 		'{**/*.fsx,**/*.fsi,**/*.fs,**/*.ml,**/*.mli}',
	// 		'{**/*.js,**/*.jsx,**/*.es6,**/*.mjs,**/*.cjs}',
	// 		'{**/*.ts,**/*.tsx}',
	// 		'{**/*.php}',
	// 		'{**/*.php}',
	// 		'{**/*.php}',
	// 		'{**/*.php}',
	// 		'{**/*.py}',
	// 		'{**/*.py}',
	// 		'{**/*.py}',
	// 		'{**/*.rs,**/*.rslib}',
	// 		'{**/*.cpp,**/*.cc,**/*.h}',
	// 		'{**/*.md}',
	// 		'{**/*.md}',
	// 		'{**/*.md}'
	// 	];

	// 	let paths = [
	// 		'/DNXConsoleApp/Program.cs',
	// 		'C:\\DNXConsoleApp\\foo\\Program.cs',
	// 		'test/qunit',
	// 		'test/test.txt',
	// 		'test/node_modules',
	// 		'.hidden.txt',
	// 		'/node_module/test/foo.js'
	// 	];

	// 	let results = 0;
	// 	let c = 1000;
	// 	console.profile('glob.match');
	// 	while (c-- > 0) {
	// 		for (let path of paths) {
	// 			for (let pattern of patterns) {
	// 				let r = glob.match(pattern, path);
	// 				if (r) {
	// 					results += 42;
	// 				}
	// 			}
	// 		}
	// 	}
	// 	console.profileEnd();
	// });

	function assertGlobMatch(pattern: string | glob.IRelativePattern, input: string, ignoreCase?: boolean) {
		assert(glob.match(pattern, input, { ignoreCase }), `${JSON.stringify(pattern)} should match ${input}`);
		assert(glob.match(pattern, nativeSep(input), { ignoreCase }), `${pattern} should match ${nativeSep(input)}`);
	}

	function assertNoGlobMatch(pattern: string | glob.IRelativePattern, input: string, ignoreCase?: boolean) {
		assert(!glob.match(pattern, input, { ignoreCase }), `${pattern} should not match ${input}`);
		assert(!glob.match(pattern, nativeSep(input), { ignoreCase }), `${pattern} should not match ${nativeSep(input)}`);
	}

	test('simple', () => {
		let p = 'node_modules';

		assertGlobMatch(p, 'node_modules');
		assertNoGlobMatch(p, 'node_module');
		assertNoGlobMatch(p, '/node_modules');
		assertNoGlobMatch(p, 'test/node_modules');

		p = 'test.txt';
		assertGlobMatch(p, 'test.txt');
		assertNoGlobMatch(p, 'test?txt');
		assertNoGlobMatch(p, '/text.txt');
		assertNoGlobMatch(p, 'test/test.txt');

		p = 'test(.txt';
		assertGlobMatch(p, 'test(.txt');
		assertNoGlobMatch(p, 'test?txt');

		p = 'qunit';

		assertGlobMatch(p, 'qunit');
		assertNoGlobMatch(p, 'qunit.css');
		assertNoGlobMatch(p, 'test/qunit');

		// Absolute

		p = '/DNXConsoleApp/**/*.cs';
		assertGlobMatch(p, '/DNXConsoleApp/Program.cs');
		assertGlobMatch(p, '/DNXConsoleApp/foo/Program.cs');

		p = 'C:/DNXConsoleApp/**/*.cs';
		assertGlobMatch(p, 'C:\\DNXConsoleApp\\Program.cs');
		assertGlobMatch(p, 'C:\\DNXConsoleApp\\foo\\Program.cs');

		p = '*';
		assertGlobMatch(p, '');
	});

	test('dot hidden', function () {
		let p = '.*';

		assertGlobMatch(p, '.git');
		assertGlobMatch(p, '.hidden.txt');
		assertNoGlobMatch(p, 'git');
		assertNoGlobMatch(p, 'hidden.txt');
		assertNoGlobMatch(p, 'path/.git');
		assertNoGlobMatch(p, 'path/.hidden.txt');

		p = '**/.*';
		assertGlobMatch(p, '.git');
		assertGlobMatch(p, '/.git');
		assertGlobMatch(p, '.hidden.txt');
		assertNoGlobMatch(p, 'git');
		assertNoGlobMatch(p, 'hidden.txt');
		assertGlobMatch(p, 'path/.git');
		assertGlobMatch(p, 'path/.hidden.txt');
		assertGlobMatch(p, '/path/.git');
		assertGlobMatch(p, '/path/.hidden.txt');
		assertNoGlobMatch(p, 'path/git');
		assertNoGlobMatch(p, 'pat.h/hidden.txt');

		p = '._*';

		assertGlobMatch(p, '._git');
		assertGlobMatch(p, '._hidden.txt');
		assertNoGlobMatch(p, 'git');
		assertNoGlobMatch(p, 'hidden.txt');
		assertNoGlobMatch(p, 'path/._git');
		assertNoGlobMatch(p, 'path/._hidden.txt');

		p = '**/._*';
		assertGlobMatch(p, '._git');
		assertGlobMatch(p, '._hidden.txt');
		assertNoGlobMatch(p, 'git');
		assertNoGlobMatch(p, 'hidden._txt');
		assertGlobMatch(p, 'path/._git');
		assertGlobMatch(p, 'path/._hidden.txt');
		assertGlobMatch(p, '/path/._git');
		assertGlobMatch(p, '/path/._hidden.txt');
		assertNoGlobMatch(p, 'path/git');
		assertNoGlobMatch(p, 'pat.h/hidden._txt');
	});

	test('file pattern', function () {
		let p = '*.js';

		assertGlobMatch(p, 'foo.js');
		assertNoGlobMatch(p, 'folder/foo.js');
		assertNoGlobMatch(p, '/node_modules/foo.js');
		assertNoGlobMatch(p, 'foo.jss');
		assertNoGlobMatch(p, 'some.js/test');

		p = 'html.*';
		assertGlobMatch(p, 'html.js');
		assertGlobMatch(p, 'html.txt');
		assertNoGlobMatch(p, 'htm.txt');

		p = '*.*';
		assertGlobMatch(p, 'html.js');
		assertGlobMatch(p, 'html.txt');
		assertGlobMatch(p, 'htm.txt');
		assertNoGlobMatch(p, 'folder/foo.js');
		assertNoGlobMatch(p, '/node_modules/foo.js');

		p = 'node_modules/test/*.js';
		assertGlobMatch(p, 'node_modules/test/foo.js');
		assertNoGlobMatch(p, 'folder/foo.js');
		assertNoGlobMatch(p, '/node_module/test/foo.js');
		assertNoGlobMatch(p, 'foo.jss');
		assertNoGlobMatch(p, 'some.js/test');
	});

	test('star', () => {
		let p = 'node*modules';

		assertGlobMatch(p, 'node_modules');
		assertGlobMatch(p, 'node_super_modules');
		assertNoGlobMatch(p, 'node_module');
		assertNoGlobMatch(p, '/node_modules');
		assertNoGlobMatch(p, 'test/node_modules');

		p = '*';
		assertGlobMatch(p, 'html.js');
		assertGlobMatch(p, 'html.txt');
		assertGlobMatch(p, 'htm.txt');
		assertNoGlobMatch(p, 'folder/foo.js');
		assertNoGlobMatch(p, '/node_modules/foo.js');
	});

	test('file / folder match', function () {
		const p = '**/node_modules/**';

		assertGlobMatch(p, 'node_modules');
		assertGlobMatch(p, 'node_modules/');
		assertGlobMatch(p, 'a/node_modules');
		assertGlobMatch(p, 'a/node_modules/');
		assertGlobMatch(p, 'node_modules/foo');
		assertGlobMatch(p, 'foo/node_modules/foo/bar');

		assertGlobMatch(p, '/node_modules');
		assertGlobMatch(p, '/node_modules/');
		assertGlobMatch(p, '/a/node_modules');
		assertGlobMatch(p, '/a/node_modules/');
		assertGlobMatch(p, '/node_modules/foo');
		assertGlobMatch(p, '/foo/node_modules/foo/bar');
	});

	test('questionmark', () => {
		let p = 'node?modules';

		assertGlobMatch(p, 'node_modules');
		assertNoGlobMatch(p, 'node_super_modules');
		assertNoGlobMatch(p, 'node_module');
		assertNoGlobMatch(p, '/node_modules');
		assertNoGlobMatch(p, 'test/node_modules');

		p = '?';
		assertGlobMatch(p, 'h');
		assertNoGlobMatch(p, 'html.txt');
		assertNoGlobMatch(p, 'htm.txt');
		assertNoGlobMatch(p, 'folder/foo.js');
		assertNoGlobMatch(p, '/node_modules/foo.js');
	});

	test('globstar', () => {
		let p = '**/*.js';

		assertGlobMatch(p, 'foo.js');
		assertGlobMatch(p, '/foo.js');
		assertGlobMatch(p, 'folder/foo.js');
		assertGlobMatch(p, '/node_modules/foo.js');
		assertNoGlobMatch(p, 'foo.jss');
		assertNoGlobMatch(p, 'some.js/test');
		assertNoGlobMatch(p, '/some.js/test');
		assertNoGlobMatch(p, '\\some.js\\test');

		p = '**/project.json';

		assertGlobMatch(p, 'project.json');
		assertGlobMatch(p, '/project.json');
		assertGlobMatch(p, 'some/folder/project.json');
		assertGlobMatch(p, '/some/folder/project.json');
		assertNoGlobMatch(p, 'some/folder/file_project.json');
		assertNoGlobMatch(p, 'some/folder/fileproject.json');
		assertNoGlobMatch(p, 'some/rrproject.json');
		assertNoGlobMatch(p, 'some\\rrproject.json');

		p = 'test/**';
		assertGlobMatch(p, 'test');
		assertGlobMatch(p, 'test/foo');
		assertGlobMatch(p, 'test/foo/');
		assertGlobMatch(p, 'test/foo.js');
		assertGlobMatch(p, 'test/other/foo.js');
		assertNoGlobMatch(p, 'est/other/foo.js');

		p = '**';
		assertGlobMatch(p, '/');
		assertGlobMatch(p, 'foo.js');
		assertGlobMatch(p, 'folder/foo.js');
		assertGlobMatch(p, 'folder/foo/');
		assertGlobMatch(p, '/node_modules/foo.js');
		assertGlobMatch(p, 'foo.jss');
		assertGlobMatch(p, 'some.js/test');

		p = 'test/**/*.js';
		assertGlobMatch(p, 'test/foo.js');
		assertGlobMatch(p, 'test/other/foo.js');
		assertGlobMatch(p, 'test/other/more/foo.js');
		assertNoGlobMatch(p, 'test/foo.ts');
		assertNoGlobMatch(p, 'test/other/foo.ts');
		assertNoGlobMatch(p, 'test/other/more/foo.ts');

		p = '**/**/*.js';

		assertGlobMatch(p, 'foo.js');
		assertGlobMatch(p, '/foo.js');
		assertGlobMatch(p, 'folder/foo.js');
		assertGlobMatch(p, '/node_modules/foo.js');
		assertNoGlobMatch(p, 'foo.jss');
		assertNoGlobMatch(p, 'some.js/test');

		p = '**/node_modules/**/*.js';

		assertNoGlobMatch(p, 'foo.js');
		assertNoGlobMatch(p, 'folder/foo.js');
		assertGlobMatch(p, 'node_modules/foo.js');
		assertGlobMatch(p, '/node_modules/foo.js');
		assertGlobMatch(p, 'node_modules/some/folder/foo.js');
		assertGlobMatch(p, '/node_modules/some/folder/foo.js');
		assertNoGlobMatch(p, 'node_modules/some/folder/foo.ts');
		assertNoGlobMatch(p, 'foo.jss');
		assertNoGlobMatch(p, 'some.js/test');

		p = '{**/node_modules/**,**/.git/**,**/bower_components/**}';

		assertGlobMatch(p, 'node_modules');
		assertGlobMatch(p, '/node_modules');
		assertGlobMatch(p, '/node_modules/more');
		assertGlobMatch(p, 'some/test/node_modules');
		assertGlobMatch(p, 'some\\test\\node_modules');
		assertGlobMatch(p, '/some/test/node_modules');
		assertGlobMatch(p, '\\some\\test\\node_modules');
		assertGlobMatch(p, 'C:\\\\some\\test\\node_modules');
		assertGlobMatch(p, 'C:\\\\some\\test\\node_modules\\more');

		assertGlobMatch(p, 'bower_components');
		assertGlobMatch(p, 'bower_components/more');
		assertGlobMatch(p, '/bower_components');
		assertGlobMatch(p, 'some/test/bower_components');
		assertGlobMatch(p, 'some\\test\\bower_components');
		assertGlobMatch(p, '/some/test/bower_components');
		assertGlobMatch(p, '\\some\\test\\bower_components');
		assertGlobMatch(p, 'C:\\\\some\\test\\bower_components');
		assertGlobMatch(p, 'C:\\\\some\\test\\bower_components\\more');

		assertGlobMatch(p, '.git');
		assertGlobMatch(p, '/.git');
		assertGlobMatch(p, 'some/test/.git');
		assertGlobMatch(p, 'some\\test\\.git');
		assertGlobMatch(p, '/some/test/.git');
		assertGlobMatch(p, '\\some\\test\\.git');
		assertGlobMatch(p, 'C:\\\\some\\test\\.git');

		assertNoGlobMatch(p, 'tempting');
		assertNoGlobMatch(p, '/tempting');
		assertNoGlobMatch(p, 'some/test/tempting');
		assertNoGlobMatch(p, 'some\\test\\tempting');
		assertNoGlobMatch(p, '/some/test/tempting');
		assertNoGlobMatch(p, '\\some\\test\\tempting');
		assertNoGlobMatch(p, 'C:\\\\some\\test\\tempting');

		p = '{**/package.json,**/project.json}';
		assertGlobMatch(p, 'package.json');
		assertGlobMatch(p, '/package.json');
		assertNoGlobMatch(p, 'xpackage.json');
		assertNoGlobMatch(p, '/xpackage.json');
	});

	test('issue 41724', function () {
		let p = 'some/**/*.js';

		assertGlobMatch(p, 'some/foo.js');
		assertGlobMatch(p, 'some/folder/foo.js');
		assertNoGlobMatch(p, 'something/foo.js');
		assertNoGlobMatch(p, 'something/folder/foo.js');

		p = 'some/**/*';

		assertGlobMatch(p, 'some/foo.js');
		assertGlobMatch(p, 'some/folder/foo.js');
		assertNoGlobMatch(p, 'something/foo.js');
		assertNoGlobMatch(p, 'something/folder/foo.js');
	});

	test('brace expansion', function () {
		let p = '*.{html,js}';

		assertGlobMatch(p, 'foo.js');
		assertGlobMatch(p, 'foo.html');
		assertNoGlobMatch(p, 'folder/foo.js');
		assertNoGlobMatch(p, '/node_modules/foo.js');
		assertNoGlobMatch(p, 'foo.jss');
		assertNoGlobMatch(p, 'some.js/test');

		p = '*.{html}';

		assertGlobMatch(p, 'foo.html');
		assertNoGlobMatch(p, 'foo.js');
		assertNoGlobMatch(p, 'folder/foo.js');
		assertNoGlobMatch(p, '/node_modules/foo.js');
		assertNoGlobMatch(p, 'foo.jss');
		assertNoGlobMatch(p, 'some.js/test');

		p = '{node_modules,testing}';
		assertGlobMatch(p, 'node_modules');
		assertGlobMatch(p, 'testing');
		assertNoGlobMatch(p, 'node_module');
		assertNoGlobMatch(p, 'dtesting');

		p = '**/{foo,bar}';
		assertGlobMatch(p, 'foo');
		assertGlobMatch(p, 'bar');
		assertGlobMatch(p, 'test/foo');
		assertGlobMatch(p, 'test/bar');
		assertGlobMatch(p, 'other/more/foo');
		assertGlobMatch(p, 'other/more/bar');
		assertGlobMatch(p, '/foo');
		assertGlobMatch(p, '/bar');
		assertGlobMatch(p, '/test/foo');
		assertGlobMatch(p, '/test/bar');
		assertGlobMatch(p, '/other/more/foo');
		assertGlobMatch(p, '/other/more/bar');

		p = '{foo,bar}/**';
		assertGlobMatch(p, 'foo');
		assertGlobMatch(p, 'bar');
		assertGlobMatch(p, 'bar/');
		assertGlobMatch(p, 'foo/test');
		assertGlobMatch(p, 'bar/test');
		assertGlobMatch(p, 'bar/test/');
		assertGlobMatch(p, 'foo/other/more');
		assertGlobMatch(p, 'bar/other/more');
		assertGlobMatch(p, 'bar/other/more/');

		p = '{**/*.d.ts,**/*.js}';

		assertGlobMatch(p, 'foo.js');
		assertGlobMatch(p, 'testing/foo.js');
		assertGlobMatch(p, 'testing\\foo.js');
		assertGlobMatch(p, '/testing/foo.js');
		assertGlobMatch(p, '\\testing\\foo.js');
		assertGlobMatch(p, 'C:\\testing\\foo.js');

		assertGlobMatch(p, 'foo.d.ts');
		assertGlobMatch(p, 'testing/foo.d.ts');
		assertGlobMatch(p, 'testing\\foo.d.ts');
		assertGlobMatch(p, '/testing/foo.d.ts');
		assertGlobMatch(p, '\\testing\\foo.d.ts');
		assertGlobMatch(p, 'C:\\testing\\foo.d.ts');

		assertNoGlobMatch(p, 'foo.d');
		assertNoGlobMatch(p, 'testing/foo.d');
		assertNoGlobMatch(p, 'testing\\foo.d');
		assertNoGlobMatch(p, '/testing/foo.d');
		assertNoGlobMatch(p, '\\testing\\foo.d');
		assertNoGlobMatch(p, 'C:\\testing\\foo.d');

		p = '{**/*.d.ts,**/*.js,path/simple.jgs}';

		assertGlobMatch(p, 'foo.js');
		assertGlobMatch(p, 'testing/foo.js');
		assertGlobMatch(p, 'testing\\foo.js');
		assertGlobMatch(p, '/testing/foo.js');
		assertGlobMatch(p, 'path/simple.jgs');
		assertNoGlobMatch(p, '/path/simple.jgs');
		assertGlobMatch(p, '\\testing\\foo.js');
		assertGlobMatch(p, 'C:\\testing\\foo.js');

		p = '{**/*.d.ts,**/*.js,foo.[0-9]}';

		assertGlobMatch(p, 'foo.5');
		assertGlobMatch(p, 'foo.8');
		assertNoGlobMatch(p, 'bar.5');
		assertNoGlobMatch(p, 'foo.f');
		assertGlobMatch(p, 'foo.js');

		p = 'prefix/{**/*.d.ts,**/*.js,foo.[0-9]}';

		assertGlobMatch(p, 'prefix/foo.5');
		assertGlobMatch(p, 'prefix/foo.8');
		assertNoGlobMatch(p, 'prefix/bar.5');
		assertNoGlobMatch(p, 'prefix/foo.f');
		assertGlobMatch(p, 'prefix/foo.js');
	});

	test('expression support (single)', function () {
		const siblings = ['test.html', 'test.txt', 'test.ts', 'test.js'];
		const hasSibling = (name: string) => siblings.indexOf(name) !== -1;

		// { "**/*.js": { "when": "$(basename).ts" } }
		let expression: glob.IExpression = {
			'**/*.js': {
				when: '$(basename).ts'
			}
		};

		assert.strictEqual('**/*.js', glob.parse(expression)('test.js', undefined, hasSibling));
		assert.strictEqual(glob.parse(expression)('test.js', undefined, () => false), null);
		assert.strictEqual(glob.parse(expression)('test.js', undefined, name => name === 'te.ts'), null);
		assert.strictEqual(glob.parse(expression)('test.js', undefined), null);

		expression = {
			'**/*.js': {
				when: ''
			}
		};

		assert.strictEqual(glob.parse(expression)('test.js', undefined, hasSibling), null);

		expression = {
			// eslint-disable-next-line local/code-no-any-casts
			'**/*.js': {
			} as any
		};

		assert.strictEqual('**/*.js', glob.parse(expression)('test.js', undefined, hasSibling));

		expression = {};

		assert.strictEqual(glob.parse(expression)('test.js', undefined, hasSibling), null);
	});

	test('expression support (multiple)', function () {
		const siblings = ['test.html', 'test.txt', 'test.ts', 'test.js'];
		const hasSibling = (name: string) => siblings.indexOf(name) !== -1;

		// { "**/*.js": { "when": "$(basename).ts" } }
		const expression: glob.IExpression = {
			'**/*.js': { when: '$(basename).ts' },
			'**/*.as': true,
			'**/*.foo': false,
			// eslint-disable-next-line local/code-no-any-casts
			'**/*.bananas': { bananas: true } as any
		};

		assert.strictEqual('**/*.js', glob.parse(expression)('test.js', undefined, hasSibling));
		assert.strictEqual('**/*.as', glob.parse(expression)('test.as', undefined, hasSibling));
		assert.strictEqual('**/*.bananas', glob.parse(expression)('test.bananas', undefined, hasSibling));
		assert.strictEqual('**/*.bananas', glob.parse(expression)('test.bananas', undefined));
		assert.strictEqual(glob.parse(expression)('test.foo', undefined, hasSibling), null);
	});

	test('brackets', () => {
		let p = 'foo.[0-9]';

		assertGlobMatch(p, 'foo.5');
		assertGlobMatch(p, 'foo.8');
		assertNoGlobMatch(p, 'bar.5');
		assertNoGlobMatch(p, 'foo.f');

		p = 'foo.[^0-9]';

		assertNoGlobMatch(p, 'foo.5');
		assertNoGlobMatch(p, 'foo.8');
		assertNoGlobMatch(p, 'bar.5');
		assertGlobMatch(p, 'foo.f');

		p = 'foo.[!0-9]';

		assertNoGlobMatch(p, 'foo.5');
		assertNoGlobMatch(p, 'foo.8');
		assertNoGlobMatch(p, 'bar.5');
		assertGlobMatch(p, 'foo.f');

		p = 'foo.[0!^*?]';

		assertNoGlobMatch(p, 'foo.5');
		assertNoGlobMatch(p, 'foo.8');
		assertGlobMatch(p, 'foo.0');
		assertGlobMatch(p, 'foo.!');
		assertGlobMatch(p, 'foo.^');
		assertGlobMatch(p, 'foo.*');
		assertGlobMatch(p, 'foo.?');

		p = 'foo[/]bar';

		assertNoGlobMatch(p, 'foo/bar');

		p = 'foo.[[]';

		assertGlobMatch(p, 'foo.[');

		p = 'foo.[]]';

		assertGlobMatch(p, 'foo.]');

		p = 'foo.[][!]';

		assertGlobMatch(p, 'foo.]');
		assertGlobMatch(p, 'foo.[');
		assertGlobMatch(p, 'foo.!');

		p = 'foo.[]-]';

		assertGlobMatch(p, 'foo.]');
		assertGlobMatch(p, 'foo.-');
	});

	test('full path', function () {
		assertGlobMatch('testing/this/foo.txt', 'testing/this/foo.txt');
	});

	test('ending path', function () {
		assertGlobMatch('**/testing/this/foo.txt', 'some/path/testing/this/foo.txt');
	});

	test('prefix agnostic', function () {
		let p = '**/*.js';

		assertGlobMatch(p, 'foo.js');
		assertGlobMatch(p, '/foo.js');
		assertGlobMatch(p, '\\foo.js');
		assertGlobMatch(p, 'testing/foo.js');
		assertGlobMatch(p, 'testing\\foo.js');
		assertGlobMatch(p, '/testing/foo.js');
		assertGlobMatch(p, '\\testing\\foo.js');
		assertGlobMatch(p, 'C:\\testing\\foo.js');

		assertNoGlobMatch(p, 'foo.ts');
		assertNoGlobMatch(p, 'testing/foo.ts');
		assertNoGlobMatch(p, 'testing\\foo.ts');
		assertNoGlobMatch(p, '/testing/foo.ts');
		assertNoGlobMatch(p, '\\testing\\foo.ts');
		assertNoGlobMatch(p, 'C:\\testing\\foo.ts');

		assertNoGlobMatch(p, 'foo.js.txt');
		assertNoGlobMatch(p, 'testing/foo.js.txt');
		assertNoGlobMatch(p, 'testing\\foo.js.txt');
		assertNoGlobMatch(p, '/testing/foo.js.txt');
		assertNoGlobMatch(p, '\\testing\\foo.js.txt');
		assertNoGlobMatch(p, 'C:\\testing\\foo.js.txt');

		assertNoGlobMatch(p, 'testing.js/foo');
		assertNoGlobMatch(p, 'testing.js\\foo');
		assertNoGlobMatch(p, '/testing.js/foo');
		assertNoGlobMatch(p, '\\testing.js\\foo');
		assertNoGlobMatch(p, 'C:\\testing.js\\foo');

		p = '**/foo.js';

		assertGlobMatch(p, 'foo.js');
		assertGlobMatch(p, '/foo.js');
		assertGlobMatch(p, '\\foo.js');
		assertGlobMatch(p, 'testing/foo.js');
		assertGlobMatch(p, 'testing\\foo.js');
		assertGlobMatch(p, '/testing/foo.js');
		assertGlobMatch(p, '\\testing\\foo.js');
		assertGlobMatch(p, 'C:\\testing\\foo.js');
	});

	test('cached properly', function () {
		const p = '**/*.js';

		assertGlobMatch(p, 'foo.js');
		assertGlobMatch(p, 'testing/foo.js');
		assertGlobMatch(p, 'testing\\foo.js');
		assertGlobMatch(p, '/testing/foo.js');
		assertGlobMatch(p, '\\testing\\foo.js');
		assertGlobMatch(p, 'C:\\testing\\foo.js');

		assertNoGlobMatch(p, 'foo.ts');
		assertNoGlobMatch(p, 'testing/foo.ts');
		assertNoGlobMatch(p, 'testing\\foo.ts');
		assertNoGlobMatch(p, '/testing/foo.ts');
		assertNoGlobMatch(p, '\\testing\\foo.ts');
		assertNoGlobMatch(p, 'C:\\testing\\foo.ts');

		assertNoGlobMatch(p, 'foo.js.txt');
		assertNoGlobMatch(p, 'testing/foo.js.txt');
		assertNoGlobMatch(p, 'testing\\foo.js.txt');
		assertNoGlobMatch(p, '/testing/foo.js.txt');
		assertNoGlobMatch(p, '\\testing\\foo.js.txt');
		assertNoGlobMatch(p, 'C:\\testing\\foo.js.txt');

		assertNoGlobMatch(p, 'testing.js/foo');
		assertNoGlobMatch(p, 'testing.js\\foo');
		assertNoGlobMatch(p, '/testing.js/foo');
		assertNoGlobMatch(p, '\\testing.js\\foo');
		assertNoGlobMatch(p, 'C:\\testing.js\\foo');

		// Run again and make sure the regex are properly reused

		assertGlobMatch(p, 'foo.js');
		assertGlobMatch(p, 'testing/foo.js');
		assertGlobMatch(p, 'testing\\foo.js');
		assertGlobMatch(p, '/testing/foo.js');
		assertGlobMatch(p, '\\testing\\foo.js');
		assertGlobMatch(p, 'C:\\testing\\foo.js');

		assertNoGlobMatch(p, 'foo.ts');
		assertNoGlobMatch(p, 'testing/foo.ts');
		assertNoGlobMatch(p, 'testing\\foo.ts');
		assertNoGlobMatch(p, '/testing/foo.ts');
		assertNoGlobMatch(p, '\\testing\\foo.ts');
		assertNoGlobMatch(p, 'C:\\testing\\foo.ts');

		assertNoGlobMatch(p, 'foo.js.txt');
		assertNoGlobMatch(p, 'testing/foo.js.txt');
		assertNoGlobMatch(p, 'testing\\foo.js.txt');
		assertNoGlobMatch(p, '/testing/foo.js.txt');
		assertNoGlobMatch(p, '\\testing\\foo.js.txt');
		assertNoGlobMatch(p, 'C:\\testing\\foo.js.txt');

		assertNoGlobMatch(p, 'testing.js/foo');
		assertNoGlobMatch(p, 'testing.js\\foo');
		assertNoGlobMatch(p, '/testing.js/foo');
		assertNoGlobMatch(p, '\\testing.js\\foo');
		assertNoGlobMatch(p, 'C:\\testing.js\\foo');
	});

	test('invalid glob', function () {
		const p = '**/*(.js';

		assertNoGlobMatch(p, 'foo.js');
	});

	test('split glob aware', function () {
		assert.deepStrictEqual(glob.splitGlobAware('foo,bar', ','), ['foo', 'bar']);
		assert.deepStrictEqual(glob.splitGlobAware('foo', ','), ['foo']);
		assert.deepStrictEqual(glob.splitGlobAware('{foo,bar}', ','), ['{foo,bar}']);
		assert.deepStrictEqual(glob.splitGlobAware('foo,bar,{foo,bar}', ','), ['foo', 'bar', '{foo,bar}']);
		assert.deepStrictEqual(glob.splitGlobAware('{foo,bar},foo,bar,{foo,bar}', ','), ['{foo,bar}', 'foo', 'bar', '{foo,bar}']);

		assert.deepStrictEqual(glob.splitGlobAware('[foo,bar]', ','), ['[foo,bar]']);
		assert.deepStrictEqual(glob.splitGlobAware('foo,bar,[foo,bar]', ','), ['foo', 'bar', '[foo,bar]']);
		assert.deepStrictEqual(glob.splitGlobAware('[foo,bar],foo,bar,[foo,bar]', ','), ['[foo,bar]', 'foo', 'bar', '[foo,bar]']);
	});

	test('expression with disabled glob', function () {
		const expr = { '**/*.js': false };

		assert.strictEqual(glob.match(expr, 'foo.js'), null);
	});

	test('expression with two non-trivia globs', function () {
		const expr = {
			'**/*.j?': true,
			'**/*.t?': true
		};

		assert.strictEqual(glob.match(expr, 'foo.js'), '**/*.j?');
		assert.strictEqual(glob.match(expr, 'foo.as'), null);
	});

	test('expression with non-trivia glob (issue 144458)', function () {
		const pattern = '**/p*';

		assert.strictEqual(glob.match(pattern, 'foo/barp'), false);
		assert.strictEqual(glob.match(pattern, 'foo/bar/ap'), false);
		assert.strictEqual(glob.match(pattern, 'ap'), false);

		assert.strictEqual(glob.match(pattern, 'foo/barp1'), false);
		assert.strictEqual(glob.match(pattern, 'foo/bar/ap1'), false);
		assert.strictEqual(glob.match(pattern, 'ap1'), false);

		assert.strictEqual(glob.match(pattern, '/foo/barp'), false);
		assert.strictEqual(glob.match(pattern, '/foo/bar/ap'), false);
		assert.strictEqual(glob.match(pattern, '/ap'), false);

		assert.strictEqual(glob.match(pattern, '/foo/barp1'), false);
		assert.strictEqual(glob.match(pattern, '/foo/bar/ap1'), false);
		assert.strictEqual(glob.match(pattern, '/ap1'), false);

		assert.strictEqual(glob.match(pattern, 'foo/pbar'), true);
		assert.strictEqual(glob.match(pattern, '/foo/pbar'), true);
		assert.strictEqual(glob.match(pattern, 'foo/bar/pa'), true);
		assert.strictEqual(glob.match(pattern, '/p'), true);
	});

	test('expression with empty glob', function () {
		const expr = { '': true };

		assert.strictEqual(glob.match(expr, 'foo.js'), null);
	});

	test('expression with other falsy value', function () {
		// eslint-disable-next-line local/code-no-any-casts
		const expr = { '**/*.js': 0 } as any;

		assert.strictEqual(glob.match(expr, 'foo.js'), '**/*.js');
	});

	test('expression with two basename globs', function () {
		const expr = {
			'**/bar': true,
			'**/baz': true
		};

		assert.strictEqual(glob.match(expr, 'bar'), '**/bar');
		assert.strictEqual(glob.match(expr, 'foo'), null);
		assert.strictEqual(glob.match(expr, 'foo/bar'), '**/bar');
		assert.strictEqual(glob.match(expr, 'foo\\bar'), '**/bar');
		assert.strictEqual(glob.match(expr, 'foo/foo'), null);
	});

	test('expression with two basename globs and a siblings expression', function () {
		const expr = {
			'**/bar': true,
			'**/baz': true,
			'**/*.js': { when: '$(basename).ts' }
		};

		const siblings = ['foo.ts', 'foo.js', 'foo', 'bar'];
		const hasSibling = (name: string) => siblings.indexOf(name) !== -1;

		assert.strictEqual(glob.parse(expr)('bar', undefined, hasSibling), '**/bar');
		assert.strictEqual(glob.parse(expr)('foo', undefined, hasSibling), null);
		assert.strictEqual(glob.parse(expr)('foo/bar', undefined, hasSibling), '**/bar');
		if (isWindows) {
			// backslash is a valid file name character on posix
			assert.strictEqual(glob.parse(expr)('foo\\bar', undefined, hasSibling), '**/bar');
		}
		assert.strictEqual(glob.parse(expr)('foo/foo', undefined, hasSibling), null);
		assert.strictEqual(glob.parse(expr)('foo.js', undefined, hasSibling), '**/*.js');
		assert.strictEqual(glob.parse(expr)('bar.js', undefined, hasSibling), null);
	});

	test('expression with multipe basename globs', function () {
		const expr = {
			'**/bar': true,
			'{**/baz,**/foo}': true
		};

		assert.strictEqual(glob.match(expr, 'bar'), '**/bar');
		assert.strictEqual(glob.match(expr, 'foo'), '{**/baz,**/foo}');
		assert.strictEqual(glob.match(expr, 'baz'), '{**/baz,**/foo}');
		assert.strictEqual(glob.match(expr, 'abc'), null);
	});

	test('falsy expression/pattern', function () {
		assert.strictEqual(glob.match(null!, 'foo'), false);
		assert.strictEqual(glob.match('', 'foo'), false);
		assert.strictEqual(glob.parse(null!)('foo'), false);
		assert.strictEqual(glob.parse('')('foo'), false);
	});

	test('falsy path', function () {
		assert.strictEqual(glob.parse('foo')(null!), false);
		assert.strictEqual(glob.parse('foo')(''), false);
		assert.strictEqual(glob.parse('**/*.j?')(null!), false);
		assert.strictEqual(glob.parse('**/*.j?')(''), false);
		assert.strictEqual(glob.parse('**/*.foo')(null!), false);
		assert.strictEqual(glob.parse('**/*.foo')(''), false);
		assert.strictEqual(glob.parse('**/foo')(null!), false);
		assert.strictEqual(glob.parse('**/foo')(''), false);
		assert.strictEqual(glob.parse('{**/baz,**/foo}')(null!), false);
		assert.strictEqual(glob.parse('{**/baz,**/foo}')(''), false);
		assert.strictEqual(glob.parse('{**/*.baz,**/*.foo}')(null!), false);
		assert.strictEqual(glob.parse('{**/*.baz,**/*.foo}')(''), false);
	});

	test('expression/pattern basename', function () {
		assert.strictEqual(glob.parse('**/foo')('bar/baz', 'baz'), false);
		assert.strictEqual(glob.parse('**/foo')('bar/foo', 'foo'), true);

		assert.strictEqual(glob.parse('{**/baz,**/foo}')('baz/bar', 'bar'), false);
		assert.strictEqual(glob.parse('{**/baz,**/foo}')('baz/foo', 'foo'), true);

		const expr = { '**/*.js': { when: '$(basename).ts' } };
		const siblings = ['foo.ts', 'foo.js'];
		const hasSibling = (name: string) => siblings.indexOf(name) !== -1;

		assert.strictEqual(glob.parse(expr)('bar/baz.js', 'baz.js', hasSibling), null);
		assert.strictEqual(glob.parse(expr)('bar/foo.js', 'foo.js', hasSibling), '**/*.js');
	});

	test('expression/pattern basename terms', function () {
		assert.deepStrictEqual(glob.getBasenameTerms(glob.parse('**/*.foo')), []);
		assert.deepStrictEqual(glob.getBasenameTerms(glob.parse('**/foo')), ['foo']);
		assert.deepStrictEqual(glob.getBasenameTerms(glob.parse('**/foo/')), ['foo']);
		assert.deepStrictEqual(glob.getBasenameTerms(glob.parse('{**/baz,**/foo}')), ['baz', 'foo']);
		assert.deepStrictEqual(glob.getBasenameTerms(glob.parse('{**/baz/,**/foo/}')), ['baz', 'foo']);

		assert.deepStrictEqual(glob.getBasenameTerms(glob.parse({
			'**/foo': true,
			'{**/bar,**/baz}': true,
			'{**/bar2/,**/baz2/}': true,
			'**/bulb': false
		})), ['foo', 'bar', 'baz', 'bar2', 'baz2']);
		assert.deepStrictEqual(glob.getBasenameTerms(glob.parse({
			'**/foo': { when: '$(basename).zip' },
			'**/bar': true
		})), ['bar']);
	});

	test('expression/pattern optimization for basenames', function () {
		assert.deepStrictEqual(glob.getBasenameTerms(glob.parse('**/foo/**')), []);
		assert.deepStrictEqual(glob.getBasenameTerms(glob.parse('**/foo/**', { trimForExclusions: true })), ['foo']);

		testOptimizationForBasenames('**/*.foo/**', [], [['baz/bar.foo/bar/baz', true]]);
		testOptimizationForBasenames('**/foo/**', ['foo'], [['bar/foo', true], ['bar/foo/baz', false]]);
		testOptimizationForBasenames('{**/baz/**,**/foo/**}', ['baz', 'foo'], [['bar/baz', true], ['bar/foo', true]]);

		testOptimizationForBasenames({
			'**/foo/**': true,
			'{**/bar/**,**/baz/**}': true,
			'**/bulb/**': false
		}, ['foo', 'bar', 'baz'], [
			['bar/foo', '**/foo/**'],
			['foo/bar', '{**/bar/**,**/baz/**}'],
			['bar/nope', null!]
		]);

		const siblings = ['baz', 'baz.zip', 'nope'];
		const hasSibling = (name: string) => siblings.indexOf(name) !== -1;
		testOptimizationForBasenames({
			'**/foo/**': { when: '$(basename).zip' },
			'**/bar/**': true
		}, ['bar'], [
			['bar/foo', null!],
			['bar/foo/baz', null!],
			['bar/foo/nope', null!],
			['foo/bar', '**/bar/**'],
		], [
			null!,
			hasSibling,
			hasSibling
		]);
	});

	function testOptimizationForBasenames(pattern: string | glob.IExpression, basenameTerms: string[], matches: [string, string | boolean][], siblingsFns: ((name: string) => boolean)[] = []) {
		const parsed = glob.parse(<glob.IExpression>pattern, { trimForExclusions: true });
		assert.deepStrictEqual(glob.getBasenameTerms(parsed), basenameTerms);
		matches.forEach(([text, result], i) => {
			assert.strictEqual(parsed(text, null!, siblingsFns[i]), result);
		});
	}

	test('trailing slash', function () {
		// Testing existing (more or less intuitive) behavior
		assert.strictEqual(glob.parse('**/foo/')('bar/baz', 'baz'), false);
		assert.strictEqual(glob.parse('**/foo/')('bar/foo', 'foo'), true);
		assert.strictEqual(glob.parse('**/*.foo/')('bar/file.baz', 'file.baz'), false);
		assert.strictEqual(glob.parse('**/*.foo/')('bar/file.foo', 'file.foo'), true);
		assert.strictEqual(glob.parse('{**/foo/,**/abc/}')('bar/baz', 'baz'), false);
		assert.strictEqual(glob.parse('{**/foo/,**/abc/}')('bar/foo', 'foo'), true);
		assert.strictEqual(glob.parse('{**/foo/,**/abc/}')('bar/abc', 'abc'), true);
		assert.strictEqual(glob.parse('{**/foo/,**/abc/}', { trimForExclusions: true })('bar/baz', 'baz'), false);
		assert.strictEqual(glob.parse('{**/foo/,**/abc/}', { trimForExclusions: true })('bar/foo', 'foo'), true);
		assert.strictEqual(glob.parse('{**/foo/,**/abc/}', { trimForExclusions: true })('bar/abc', 'abc'), true);
	});

	test('expression/pattern path', function () {
		assert.strictEqual(glob.parse('**/foo/bar')(nativeSep('foo/baz'), 'baz'), false);
		assert.strictEqual(glob.parse('**/foo/bar')(nativeSep('foo/bar'), 'bar'), true);
		assert.strictEqual(glob.parse('**/foo/bar')(nativeSep('bar/foo/bar'), 'bar'), true);
		assert.strictEqual(glob.parse('**/foo/bar/**')(nativeSep('bar/foo/bar'), 'bar'), true);
		assert.strictEqual(glob.parse('**/foo/bar/**')(nativeSep('bar/foo/bar/baz'), 'baz'), true);
		assert.strictEqual(glob.parse('**/foo/bar/**', { trimForExclusions: true })(nativeSep('bar/foo/bar'), 'bar'), true);
		assert.strictEqual(glob.parse('**/foo/bar/**', { trimForExclusions: true })(nativeSep('bar/foo/bar/baz'), 'baz'), false);

		assert.strictEqual(glob.parse('foo/bar')(nativeSep('foo/baz'), 'baz'), false);
		assert.strictEqual(glob.parse('foo/bar')(nativeSep('foo/bar'), 'bar'), true);
		assert.strictEqual(glob.parse('foo/bar/baz')(nativeSep('foo/bar/baz'), 'baz'), true); // #15424
		assert.strictEqual(glob.parse('foo/bar')(nativeSep('bar/foo/bar'), 'bar'), false);
		assert.strictEqual(glob.parse('foo/bar/**')(nativeSep('foo/bar/baz'), 'baz'), true);
		assert.strictEqual(glob.parse('foo/bar/**', { trimForExclusions: true })(nativeSep('foo/bar'), 'bar'), true);
		assert.strictEqual(glob.parse('foo/bar/**', { trimForExclusions: true })(nativeSep('foo/bar/baz'), 'baz'), false);
	});

	test('expression/pattern paths', function () {
		assert.deepStrictEqual(glob.getPathTerms(glob.parse('**/*.foo')), []);
		assert.deepStrictEqual(glob.getPathTerms(glob.parse('**/foo')), []);
		assert.deepStrictEqual(glob.getPathTerms(glob.parse('**/foo/bar')), ['*/foo/bar']);
		assert.deepStrictEqual(glob.getPathTerms(glob.parse('**/foo/bar/')), ['*/foo/bar']);
		// Not supported
		// assert.deepStrictEqual(glob.getPathTerms(glob.parse('{**/baz/bar,**/foo/bar,**/bar}')), ['*/baz/bar', '*/foo/bar']);
		// assert.deepStrictEqual(glob.getPathTerms(glob.parse('{**/baz/bar/,**/foo/bar/,**/bar/}')), ['*/baz/bar', '*/foo/bar']);

		const parsed = glob.parse({
			'**/foo/bar': true,
			'**/foo2/bar2': true,
			// Not supported
			// '{**/bar/foo,**/baz/foo}': true,
			// '{**/bar2/foo/,**/baz2/foo/}': true,
			'**/bulb': true,
			'**/bulb2': true,
			'**/bulb/foo': false
		});
		assert.deepStrictEqual(glob.getPathTerms(parsed), ['*/foo/bar', '*/foo2/bar2']);
		assert.deepStrictEqual(glob.getBasenameTerms(parsed), ['bulb', 'bulb2']);
		assert.deepStrictEqual(glob.getPathTerms(glob.parse({
			'**/foo/bar': { when: '$(basename).zip' },
			'**/bar/foo': true,
			'**/bar2/foo2': true
		})), ['*/bar/foo', '*/bar2/foo2']);
	});

	test('expression/pattern optimization for paths', function () {
		assert.deepStrictEqual(glob.getPathTerms(glob.parse('**/foo/bar/**')), []);
		assert.deepStrictEqual(glob.getPathTerms(glob.parse('**/foo/bar/**', { trimForExclusions: true })), ['*/foo/bar']);

		testOptimizationForPaths('**/*.foo/bar/**', [], [[nativeSep('baz/bar.foo/bar/baz'), true]]);
		testOptimizationForPaths('**/foo/bar/**', ['*/foo/bar'], [[nativeSep('bar/foo/bar'), true], [nativeSep('bar/foo/bar/baz'), false]]);
		// Not supported
		// testOptimizationForPaths('{**/baz/bar/**,**/foo/bar/**}', ['*/baz/bar', '*/foo/bar'], [[nativeSep('bar/baz/bar'), true], [nativeSep('bar/foo/bar'), true]]);

		testOptimizationForPaths({
			'**/foo/bar/**': true,
			// Not supported
			// '{**/bar/bar/**,**/baz/bar/**}': true,
			'**/bulb/bar/**': false
		}, ['*/foo/bar'], [
			[nativeSep('bar/foo/bar'), '**/foo/bar/**'],
			// Not supported
			// [nativeSep('foo/bar/bar'), '{**/bar/bar/**,**/baz/bar/**}'],
			[nativeSep('/foo/bar/nope'), null!]
		]);

		const siblings = ['baz', 'baz.zip', 'nope'];
		const hasSibling = (name: string) => siblings.indexOf(name) !== -1;
		testOptimizationForPaths({
			'**/foo/123/**': { when: '$(basename).zip' },
			'**/bar/123/**': true
		}, ['*/bar/123'], [
			[nativeSep('bar/foo/123'), null!],
			[nativeSep('bar/foo/123/baz'), null!],
			[nativeSep('bar/foo/123/nope'), null!],
			[nativeSep('foo/bar/123'), '**/bar/123/**'],
		], [
			null!,
			hasSibling,
			hasSibling
		]);
	});

	function testOptimizationForPaths(pattern: string | glob.IExpression, pathTerms: string[], matches: [string, string | boolean][], siblingsFns: ((name: string) => boolean)[] = []) {
		const parsed = glob.parse(<glob.IExpression>pattern, { trimForExclusions: true });
		assert.deepStrictEqual(glob.getPathTerms(parsed), pathTerms);
		matches.forEach(([text, result], i) => {
			assert.strictEqual(parsed(text, null!, siblingsFns[i]), result);
		});
	}

	function nativeSep(slashPath: string): string {
		return slashPath.replace(/\//g, sep);
	}

	test('relative pattern - glob star', function () {
		if (isWindows) {
			const p: glob.IRelativePattern = { base: 'C:\\DNXConsoleApp\\foo', pattern: '**/*.cs' };
			assertGlobMatch(p, 'C:\\DNXConsoleApp\\foo\\Program.cs');
			assertGlobMatch(p, 'C:\\DNXConsoleApp\\foo\\bar\\Program.cs');
			assertNoGlobMatch(p, 'C:\\DNXConsoleApp\\foo\\Program.ts');
			assertNoGlobMatch(p, 'C:\\DNXConsoleApp\\Program.cs');
			assertNoGlobMatch(p, 'C:\\other\\DNXConsoleApp\\foo\\Program.ts');
		} else {
			const p: glob.IRelativePattern = { base: '/DNXConsoleApp/foo', pattern: '**/*.cs' };
			assertGlobMatch(p, '/DNXConsoleApp/foo/Program.cs');
			assertGlobMatch(p, '/DNXConsoleApp/foo/bar/Program.cs');
			assertNoGlobMatch(p, '/DNXConsoleApp/foo/Program.ts');
			assertNoGlobMatch(p, '/DNXConsoleApp/Program.cs');
			assertNoGlobMatch(p, '/other/DNXConsoleApp/foo/Program.ts');
		}
	});

	test('relative pattern - single star', function () {
		if (isWindows) {
			const p: glob.IRelativePattern = { base: 'C:\\DNXConsoleApp\\foo', pattern: '*.cs' };
			assertGlobMatch(p, 'C:\\DNXConsoleApp\\foo\\Program.cs');
			assertNoGlobMatch(p, 'C:\\DNXConsoleApp\\foo\\bar\\Program.cs');
			assertNoGlobMatch(p, 'C:\\DNXConsoleApp\\foo\\Program.ts');
			assertNoGlobMatch(p, 'C:\\DNXConsoleApp\\Program.cs');
			assertNoGlobMatch(p, 'C:\\other\\DNXConsoleApp\\foo\\Program.ts');
		} else {
			const p: glob.IRelativePattern = { base: '/DNXConsoleApp/foo', pattern: '*.cs' };
			assertGlobMatch(p, '/DNXConsoleApp/foo/Program.cs');
			assertNoGlobMatch(p, '/DNXConsoleApp/foo/bar/Program.cs');
			assertNoGlobMatch(p, '/DNXConsoleApp/foo/Program.ts');
			assertNoGlobMatch(p, '/DNXConsoleApp/Program.cs');
			assertNoGlobMatch(p, '/other/DNXConsoleApp/foo/Program.ts');
		}
	});

	test('relative pattern - single star with path', function () {
		if (isWindows) {
			const p: glob.IRelativePattern = { base: 'C:\\DNXConsoleApp\\foo', pattern: 'something/*.cs' };
			assertGlobMatch(p, 'C:\\DNXConsoleApp\\foo\\something\\Program.cs');
			assertNoGlobMatch(p, 'C:\\DNXConsoleApp\\foo\\Program.cs');
		} else {
			const p: glob.IRelativePattern = { base: '/DNXConsoleApp/foo', pattern: 'something/*.cs' };
			assertGlobMatch(p, '/DNXConsoleApp/foo/something/Program.cs');
			assertNoGlobMatch(p, '/DNXConsoleApp/foo/Program.cs');
		}
	});

	test('relative pattern - single star alone', function () {
		if (isWindows) {
			const p: glob.IRelativePattern = { base: 'C:\\DNXConsoleApp\\foo\\something\\Program.cs', pattern: '*' };
			assertGlobMatch(p, 'C:\\DNXConsoleApp\\foo\\something\\Program.cs');
			assertNoGlobMatch(p, 'C:\\DNXConsoleApp\\foo\\Program.cs');
		} else {
			const p: glob.IRelativePattern = { base: '/DNXConsoleApp/foo/something/Program.cs', pattern: '*' };
			assertGlobMatch(p, '/DNXConsoleApp/foo/something/Program.cs');
			assertNoGlobMatch(p, '/DNXConsoleApp/foo/Program.cs');
		}
	});

	test('relative pattern - ignores case on macOS/Windows', function () {
		if (isWindows) {
			const p: glob.IRelativePattern = { base: 'C:\\DNXConsoleApp\\foo', pattern: 'something/*.cs' };
			assertGlobMatch(p, 'C:\\DNXConsoleApp\\foo\\something\\Program.cs'.toLowerCase());
		} else if (isMacintosh) {
			const p: glob.IRelativePattern = { base: '/DNXConsoleApp/foo', pattern: 'something/*.cs' };
			assertGlobMatch(p, '/DNXConsoleApp/foo/something/Program.cs'.toLowerCase());
		} else if (isLinux) {
			const p: glob.IRelativePattern = { base: '/DNXConsoleApp/foo', pattern: 'something/*.cs' };
			assertNoGlobMatch(p, '/DNXConsoleApp/foo/something/Program.cs'.toLowerCase());
		}
	});

	test('relative pattern - trailing slash / backslash (#162498)', function () {
		if (isWindows) {
			let p: glob.IRelativePattern = { base: 'C:\\', pattern: 'foo.cs' };
			assertGlobMatch(p, 'C:\\foo.cs');

			p = { base: 'C:\\bar\\', pattern: 'foo.cs' };
			assertGlobMatch(p, 'C:\\bar\\foo.cs');
		} else {
			let p: glob.IRelativePattern = { base: '/', pattern: 'foo.cs' };
			assertGlobMatch(p, '/foo.cs');

			p = { base: '/bar/', pattern: 'foo.cs' };
			assertGlobMatch(p, '/bar/foo.cs');
		}
	});

	test('pattern with "base" does not explode - #36081', function () {
		assert.ok(glob.match({ 'base': true }, 'base'));
	});

	test('relative pattern - #57475', function () {
		if (isWindows) {
			const p: glob.IRelativePattern = { base: 'C:\\DNXConsoleApp\\foo', pattern: 'styles/style.css' };
			assertGlobMatch(p, 'C:\\DNXConsoleApp\\foo\\styles\\style.css');
			assertNoGlobMatch(p, 'C:\\DNXConsoleApp\\foo\\Program.cs');
		} else {
			const p: glob.IRelativePattern = { base: '/DNXConsoleApp/foo', pattern: 'styles/style.css' };
			assertGlobMatch(p, '/DNXConsoleApp/foo/styles/style.css');
			assertNoGlobMatch(p, '/DNXConsoleApp/foo/Program.cs');
		}
	});

	test('URI match', () => {
		const p = 'scheme:/**/*.md';
		assertGlobMatch(p, URI.file('super/duper/long/some/file.md').with({ scheme: 'scheme' }).toString());
	});

	test('expression fails when siblings use promises (https://github.com/microsoft/vscode/issues/146294)', async function () {
		const siblings = ['test.html', 'test.txt', 'test.ts'];
		const hasSibling = (name: string) => Promise.resolve(siblings.indexOf(name) !== -1);

		// { "**/*.js": { "when": "$(basename).ts" } }
		const expression: glob.IExpression = {
			'**/test.js': { when: '$(basename).js' },
			'**/*.js': { when: '$(basename).ts' }
		};

		const parsedExpression = glob.parse(expression);

		assert.strictEqual('**/*.js', await parsedExpression('test.js', undefined, hasSibling));
	});

	test('patternsEquals', () => {
		assert.ok(glob.patternsEquals(['a'], ['a']));
		assert.ok(!glob.patternsEquals(['a'], ['b']));

		assert.ok(glob.patternsEquals(['a', 'b', 'c'], ['a', 'b', 'c']));
		assert.ok(!glob.patternsEquals(['1', '2'], ['1', '3']));

		assert.ok(glob.patternsEquals([{ base: 'a', pattern: '*' }, 'b', 'c'], [{ base: 'a', pattern: '*' }, 'b', 'c']));

		assert.ok(glob.patternsEquals(undefined, undefined));
		assert.ok(!glob.patternsEquals(undefined, ['b']));
		assert.ok(!glob.patternsEquals(['a'], undefined));
	});

	test('isEmptyPattern', () => {
		assert.ok(glob.isEmptyPattern(glob.parse('')));
		assert.ok(glob.isEmptyPattern(glob.parse(undefined!)));
		assert.ok(glob.isEmptyPattern(glob.parse(null!)));

		assert.ok(glob.isEmptyPattern(glob.parse({})));
		assert.ok(glob.isEmptyPattern(glob.parse({ '': true })));
		assert.ok(glob.isEmptyPattern(glob.parse({ '**/*.js': false })));
	});

	test('caseInsensitiveMatch', () => {
		assertNoGlobMatch('PATH/FOO.js', 'path/foo.js');
		assertGlobMatch('PATH/FOO.js', 'path/foo.js', true);
		// T1
		assertNoGlobMatch('**/*.JS', 'bar/foo.js');
		assertGlobMatch('**/*.JS', 'bar/foo.js', true);
		// T2
		assertNoGlobMatch('**/package', 'bar/Package');
		assertGlobMatch('**/package', 'bar/Package', true);
		// T3
		assertNoGlobMatch('{**/*.JS,**/*.TS}', 'bar/foo.ts');
		assertNoGlobMatch('{**/*.JS,**/*.TS}', 'bar/foo.js');
		assertGlobMatch('{**/*.JS,**/*.TS}', 'bar/foo.ts', true);
		assertGlobMatch('{**/*.JS,**/*.TS}', 'bar/foo.js', true);
		// T4
		assertNoGlobMatch('**/FOO/Bar', 'bar/foo/bar');
		assertGlobMatch('**/FOO/Bar', 'bar/foo/bar', true);
		// T5
		assertNoGlobMatch('FOO/Bar', 'foo/bar');
		assertGlobMatch('FOO/Bar', 'foo/bar', true);
		// Other
		assertNoGlobMatch('some/*/Random/*/Path.FILE', 'some/very/random/unusual/path.file');
		assertGlobMatch('some/*/Random/*/Path.FILE', 'some/very/random/unusual/path.file', true);
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/history.test.ts]---
Location: vscode-main/src/vs/base/test/common/history.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { HistoryNavigator, HistoryNavigator2 } from '../../common/history.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';

suite('History Navigator', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('create reduces the input to limit', () => {
		const testObject = new HistoryNavigator(new Set(['1', '2', '3', '4']), 2);

		assert.deepStrictEqual(['3', '4'], toArray(testObject));
	});

	test('create sets the position after last', () => {
		const testObject = new HistoryNavigator(new Set(['1', '2', '3', '4']), 100);

		assert.strictEqual(testObject.current(), null);
		assert.strictEqual(testObject.isNowhere(), true);
		assert.strictEqual(testObject.isFirst(), false);
		assert.strictEqual(testObject.isLast(), false);
		assert.strictEqual(testObject.next(), null);
		assert.strictEqual(testObject.previous(), '4');
		assert.strictEqual(testObject.isNowhere(), false);
		assert.strictEqual(testObject.isFirst(), false);
		assert.strictEqual(testObject.isLast(), true);
	});

	test('last returns last element', () => {
		const testObject = new HistoryNavigator(new Set(['1', '2', '3', '4']), 100);

		assert.strictEqual(testObject.first(), '1');
		assert.strictEqual(testObject.last(), '4');
		assert.strictEqual(testObject.isFirst(), false);
		assert.strictEqual(testObject.isLast(), true);
	});

	test('first returns first element', () => {
		const testObject = new HistoryNavigator(new Set(['1', '2', '3', '4']), 3);

		assert.strictEqual('2', testObject.first());
		assert.strictEqual(testObject.isFirst(), true);
		assert.strictEqual(testObject.isLast(), false);
	});

	test('next returns next element', () => {
		const testObject = new HistoryNavigator(new Set(['1', '2', '3', '4']), 3);

		testObject.first();

		assert.strictEqual(testObject.next(), '3');
		assert.strictEqual(testObject.next(), '4');
		assert.strictEqual(testObject.next(), null);
	});

	test('previous returns previous element', () => {
		const testObject = new HistoryNavigator(new Set(['1', '2', '3', '4']), 3);

		assert.strictEqual(testObject.previous(), '4');
		assert.strictEqual(testObject.previous(), '3');
		assert.strictEqual(testObject.previous(), '2');
		assert.strictEqual(testObject.previous(), null);
	});

	test('next on last element returns null and remains on last', () => {
		const testObject = new HistoryNavigator(new Set(['1', '2', '3', '4']), 3);

		testObject.first();
		testObject.last();

		assert.strictEqual(testObject.isLast(), true);
		assert.strictEqual(testObject.current(), '4');
		assert.strictEqual(testObject.next(), null);
		assert.strictEqual(testObject.isLast(), false); // Stepping past the last element, is no longer "last"
	});

	test('previous on first element returns null and remains on first', () => {
		const testObject = new HistoryNavigator(new Set(['1', '2', '3', '4']), 3);

		testObject.first();

		assert.strictEqual(testObject.isFirst(), true);
		assert.strictEqual(testObject.current(), '2');
		assert.strictEqual(testObject.previous(), null);
		assert.strictEqual(testObject.isFirst(), true);
	});

	test('add reduces the input to limit', () => {
		const testObject = new HistoryNavigator(new Set(['1', '2', '3', '4']), 2);

		testObject.add('5');

		assert.deepStrictEqual(toArray(testObject), ['4', '5']);
	});

	test('adding existing element changes the position', () => {
		const testObject = new HistoryNavigator(new Set(['1', '2', '3', '4']), 5);

		testObject.add('2');

		assert.deepStrictEqual(toArray(testObject), ['1', '3', '4', '2']);
	});

	test('add resets the navigator to last', () => {
		const testObject = new HistoryNavigator(new Set(['1', '2', '3', '4']), 3);

		testObject.first();
		testObject.add('5');

		assert.strictEqual(testObject.previous(), '5');
		assert.strictEqual(testObject.isLast(), true);
		assert.strictEqual(testObject.next(), null);
		assert.strictEqual(testObject.isLast(), false);
	});

	test('adding an existing item changes the order', () => {
		const testObject = new HistoryNavigator(new Set(['1', '2', '3']));

		testObject.add('1');

		assert.deepStrictEqual(['2', '3', '1'], toArray(testObject));
	});

	test('previous returns null if the current position is the first one', () => {
		const testObject = new HistoryNavigator(new Set(['1', '2', '3']));

		testObject.first();

		assert.deepStrictEqual(testObject.previous(), null);
		assert.strictEqual(testObject.isFirst(), true);
	});

	test('previous returns object if the current position is not the first one', () => {
		const testObject = new HistoryNavigator(new Set(['1', '2', '3']));

		testObject.first();
		testObject.next();

		assert.deepStrictEqual(testObject.previous(), '1');
	});

	test('next returns null if the current position is the last one', () => {
		const testObject = new HistoryNavigator(new Set(['1', '2', '3']));

		testObject.last();

		assert.strictEqual(testObject.isLast(), true);
		assert.deepStrictEqual(testObject.next(), null);
		assert.strictEqual(testObject.isLast(), false);
	});

	test('next returns object if the current position is not the last one', () => {
		const testObject = new HistoryNavigator(new Set(['1', '2', '3']));

		testObject.last();
		testObject.previous();

		assert.deepStrictEqual(testObject.next(), '3');
	});

	test('clear', () => {
		const testObject = new HistoryNavigator(new Set(['a', 'b', 'c']));
		assert.strictEqual(testObject.previous(), 'c');
		testObject.clear();
		assert.strictEqual(testObject.current(), null);
		assert.strictEqual(testObject.isNowhere(), true);
	});

	function toArray(historyNavigator: HistoryNavigator<string>): Array<string | null> {
		const result: Array<string | null> = [];
		historyNavigator.first();
		if (historyNavigator.current()) {
			do {
				result.push(historyNavigator.current()!);
			} while (historyNavigator.next());
		}
		return result;
	}
});

suite('History Navigator 2', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('constructor', () => {
		const testObject = new HistoryNavigator2(['1', '2', '3', '4']);

		assert.strictEqual(testObject.current(), '4');
		assert.strictEqual(testObject.isAtEnd(), true);
	});

	test('constructor - initial history is not empty', () => {
		assert.throws(() => new HistoryNavigator2([]));
	});

	test('constructor - capacity limit', () => {
		const testObject = new HistoryNavigator2(['1', '2', '3', '4'], 3);

		assert.strictEqual(testObject.current(), '4');
		assert.strictEqual(testObject.isAtEnd(), true);
		assert.strictEqual(testObject.has('1'), false);
	});

	test('constructor - duplicate values', () => {
		const testObject = new HistoryNavigator2(['1', '2', '3', '4', '3', '2', '1']);

		assert.strictEqual(testObject.current(), '1');
		assert.strictEqual(testObject.isAtEnd(), true);
	});

	test('navigation', () => {
		const testObject = new HistoryNavigator2(['1', '2', '3', '4']);

		assert.strictEqual(testObject.current(), '4');
		assert.strictEqual(testObject.isAtEnd(), true);

		assert.strictEqual(testObject.next(), '4');
		assert.strictEqual(testObject.previous(), '3');
		assert.strictEqual(testObject.previous(), '2');
		assert.strictEqual(testObject.previous(), '1');
		assert.strictEqual(testObject.previous(), '1');

		assert.strictEqual(testObject.current(), '1');
		assert.strictEqual(testObject.next(), '2');
		assert.strictEqual(testObject.resetCursor(), '4');
	});

	test('add', () => {
		const testObject = new HistoryNavigator2(['1', '2', '3', '4']);
		testObject.add('5');

		assert.strictEqual(testObject.current(), '5');
		assert.strictEqual(testObject.isAtEnd(), true);
	});

	test('add - existing value', () => {
		const testObject = new HistoryNavigator2(['1', '2', '3', '4']);
		testObject.add('2');

		assert.strictEqual(testObject.current(), '2');
		assert.strictEqual(testObject.isAtEnd(), true);

		assert.strictEqual(testObject.previous(), '4');
		assert.strictEqual(testObject.previous(), '3');
		assert.strictEqual(testObject.previous(), '1');
	});

	test('replaceLast', () => {
		const testObject = new HistoryNavigator2(['1', '2', '3', '4']);
		testObject.replaceLast('5');

		assert.strictEqual(testObject.current(), '5');
		assert.strictEqual(testObject.isAtEnd(), true);
		assert.strictEqual(testObject.has('4'), false);

		assert.strictEqual(testObject.previous(), '3');
		assert.strictEqual(testObject.previous(), '2');
		assert.strictEqual(testObject.previous(), '1');
	});

	test('replaceLast - existing value', () => {
		const testObject = new HistoryNavigator2(['1', '2', '3', '4']);
		testObject.replaceLast('2');

		assert.strictEqual(testObject.current(), '2');
		assert.strictEqual(testObject.isAtEnd(), true);
		assert.strictEqual(testObject.has('4'), false);

		assert.strictEqual(testObject.previous(), '3');
		assert.strictEqual(testObject.previous(), '1');
	});

	test('prepend', () => {
		const testObject = new HistoryNavigator2(['1', '2', '3', '4']);
		assert.strictEqual(testObject.current(), '4');
		assert.ok(testObject.isAtEnd());
		assert.deepStrictEqual(Array.from(testObject), ['1', '2', '3', '4']);

		testObject.prepend('0');
		assert.strictEqual(testObject.current(), '4');
		assert.ok(testObject.isAtEnd());
		assert.deepStrictEqual(Array.from(testObject), ['0', '1', '2', '3', '4']);

		testObject.prepend('2');
		assert.strictEqual(testObject.current(), '4');
		assert.ok(testObject.isAtEnd());
		assert.deepStrictEqual(Array.from(testObject), ['0', '1', '2', '3', '4']);
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/iconLabels.test.ts]---
Location: vscode-main/src/vs/base/test/common/iconLabels.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { IMatch } from '../../common/filters.js';
import { escapeIcons, getCodiconAriaLabel, IParsedLabelWithIcons, markdownEscapeEscapedIcons, matchesFuzzyIconAware, parseLabelWithIcons, stripIcons } from '../../common/iconLabels.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';

interface IIconFilter {
	// Returns null if word doesn't match.
	(query: string, target: IParsedLabelWithIcons): IMatch[] | null;
}

function filterOk(filter: IIconFilter, word: string, target: IParsedLabelWithIcons, highlights?: { start: number; end: number }[]) {
	const r = filter(word, target);
	assert(r);
	if (highlights) {
		assert.deepStrictEqual(r, highlights);
	}
}

suite('Icon Labels', () => {
	test('Can get proper aria labels', () => {
		// note, the spaces in the results are important
		const testCases = new Map<string, string>([
			['', ''],
			['asdf', 'asdf'],
			['asdf$(squirrel)asdf', 'asdf squirrel asdf'],
			['asdf $(squirrel) asdf', 'asdf  squirrel  asdf'],
			['$(rocket)asdf', 'rocket asdf'],
			['$(rocket) asdf', 'rocket  asdf'],
			['$(rocket)$(rocket)$(rocket)asdf', 'rocket  rocket  rocket asdf'],
			['$(rocket) asdf $(rocket)', 'rocket  asdf  rocket'],
			['$(rocket)asdf$(rocket)', 'rocket asdf rocket'],
		]);

		for (const [input, expected] of testCases) {
			assert.strictEqual(getCodiconAriaLabel(input), expected);
		}
	});

	test('matchesFuzzyIconAware', () => {

		// Camel Case

		filterOk(matchesFuzzyIconAware, 'ccr', parseLabelWithIcons('$(codicon)CamelCaseRocks$(codicon)'), [
			{ start: 10, end: 11 },
			{ start: 15, end: 16 },
			{ start: 19, end: 20 }
		]);

		filterOk(matchesFuzzyIconAware, 'ccr', parseLabelWithIcons('$(codicon) CamelCaseRocks $(codicon)'), [
			{ start: 11, end: 12 },
			{ start: 16, end: 17 },
			{ start: 20, end: 21 }
		]);

		filterOk(matchesFuzzyIconAware, 'iut', parseLabelWithIcons('$(codicon) Indent $(octico) Using $(octic) Tpaces'), [
			{ start: 11, end: 12 },
			{ start: 28, end: 29 },
			{ start: 43, end: 44 },
		]);

		// Prefix

		filterOk(matchesFuzzyIconAware, 'using', parseLabelWithIcons('$(codicon) Indent Using Spaces'), [
			{ start: 18, end: 23 },
		]);

		// Broken Codicon

		filterOk(matchesFuzzyIconAware, 'codicon', parseLabelWithIcons('This $(codicon Indent Using Spaces'), [
			{ start: 7, end: 14 },
		]);

		filterOk(matchesFuzzyIconAware, 'indent', parseLabelWithIcons('This $codicon Indent Using Spaces'), [
			{ start: 14, end: 20 },
		]);

		// Testing #59343
		filterOk(matchesFuzzyIconAware, 'unt', parseLabelWithIcons('$(primitive-dot) $(file-text) Untitled-1'), [
			{ start: 30, end: 33 },
		]);

		// Testing #136172
		filterOk(matchesFuzzyIconAware, 's', parseLabelWithIcons('$(loading~spin) start'), [
			{ start: 16, end: 17 },
		]);
	});

	test('stripIcons', () => {
		assert.strictEqual(stripIcons('Hello World'), 'Hello World');
		assert.strictEqual(stripIcons('$(Hello World'), '$(Hello World');
		assert.strictEqual(stripIcons('$(Hello) World'), ' World');
		assert.strictEqual(stripIcons('$(Hello) W$(oi)rld'), ' Wrld');
	});


	test('escapeIcons', () => {
		assert.strictEqual(escapeIcons('Hello World'), 'Hello World');
		assert.strictEqual(escapeIcons('$(Hello World'), '$(Hello World');
		assert.strictEqual(escapeIcons('$(Hello) World'), '\\$(Hello) World');
		assert.strictEqual(escapeIcons('\\$(Hello) W$(oi)rld'), '\\$(Hello) W\\$(oi)rld');
	});

	test('markdownEscapeEscapedIcons', () => {
		assert.strictEqual(markdownEscapeEscapedIcons('Hello World'), 'Hello World');
		assert.strictEqual(markdownEscapeEscapedIcons('$(Hello) World'), '$(Hello) World');
		assert.strictEqual(markdownEscapeEscapedIcons('\\$(Hello) World'), '\\\\$(Hello) World');
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/iterativePaging.test.ts]---
Location: vscode-main/src/vs/base/test/common/iterativePaging.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { CancellationToken, CancellationTokenSource } from '../../common/cancellation.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';
import { IterativePagedModel, IIterativePager, IIterativePage } from '../../common/paging.js';

function createTestPager(pageSize: number, maxPages: number): IIterativePager<number> {
	let currentPage = 0;

	const createPage = (page: number): IIterativePage<number> => {
		const start = page * pageSize;
		const items: number[] = [];
		for (let i = 0; i < pageSize; i++) {
			items.push(start + i);
		}
		const hasMore = page + 1 < maxPages;
		return { items, hasMore };
	};

	return {
		firstPage: createPage(currentPage++),
		getNextPage: async (cancellationToken: CancellationToken): Promise<IIterativePage<number>> => {
			if (currentPage >= maxPages) {
				return { items: [], hasMore: false };
			}
			return createPage(currentPage++);
		}
	};
}

suite('IterativePagedModel', () => {

	const store = ensureNoDisposablesAreLeakedInTestSuite();

	test('initial state', () => {
		const pager = createTestPager(10, 3);
		const model = store.add(new IterativePagedModel(pager));

		// Initially first page is loaded, so length should be 10 + 1 sentinel
		assert.strictEqual(model.length, 11);
		assert.strictEqual(model.isResolved(0), true);
		assert.strictEqual(model.isResolved(9), true);
		assert.strictEqual(model.isResolved(10), false); // sentinel
	});

	test('load first page via sentinel access', async () => {
		const pager = createTestPager(10, 3);
		const model = store.add(new IterativePagedModel(pager));

		// Access an item in the first page (already loaded)
		const item = await model.resolve(0, CancellationToken.None);

		assert.strictEqual(item, 0);
		assert.strictEqual(model.length, 11); // 10 items + 1 sentinel
		assert.strictEqual(model.isResolved(0), true);
		assert.strictEqual(model.isResolved(9), true);
		assert.strictEqual(model.isResolved(10), false); // sentinel
	});

	test('load multiple pages', async () => {
		const pager = createTestPager(10, 3);
		const model = store.add(new IterativePagedModel(pager));

		// First page already loaded
		assert.strictEqual(model.length, 11);

		// Load second page by accessing its sentinel
		await model.resolve(10, CancellationToken.None);
		assert.strictEqual(model.length, 21); // 20 items + 1 sentinel
		assert.strictEqual(model.get(10), 10); // First item of second page

		// Load third (final) page
		await model.resolve(20, CancellationToken.None);
		assert.strictEqual(model.length, 30); // 30 items, no sentinel (no more pages)
	});

	test('onDidIncrementLength event fires correctly', async () => {
		const pager = createTestPager(10, 3);
		const model = store.add(new IterativePagedModel(pager));
		const lengths: number[] = [];

		store.add(model.onDidIncrementLength((length: number) => lengths.push(length)));

		// Load second page
		await model.resolve(10, CancellationToken.None);

		assert.strictEqual(lengths.length, 1);
		assert.strictEqual(lengths[0], 21); // 20 items + 1 sentinel

		// Load third page
		await model.resolve(20, CancellationToken.None);

		assert.strictEqual(lengths.length, 2);
		assert.strictEqual(lengths[1], 30); // 30 items, no sentinel
	});

	test('accessing regular items does not trigger loading', async () => {
		const pager = createTestPager(10, 3);
		const model = store.add(new IterativePagedModel(pager));

		const initialLength = model.length;

		// Access items within the loaded range
		assert.strictEqual(model.get(5), 5);
		assert.strictEqual(model.isResolved(5), true);

		// Length should not change
		assert.strictEqual(model.length, initialLength);
	});

	test('reaching end of data removes sentinel', async () => {
		const pager = createTestPager(10, 3);
		const model = store.add(new IterativePagedModel(pager));

		// Load all pages
		await model.resolve(10, CancellationToken.None);  // Page 2
		await model.resolve(20, CancellationToken.None);  // Page 3 (final)

		// After loading all data, there should be no more pages
		assert.strictEqual(model.length, 30); // Exactly 30 items, no sentinel

		// Accessing resolved items should work
		assert.strictEqual(model.isResolved(29), true);
		assert.strictEqual(model.isResolved(30), false);
	});

	test('concurrent access to sentinel only loads once', async () => {
		const pager = createTestPager(10, 3);
		const model = store.add(new IterativePagedModel(pager));

		// Access sentinel concurrently
		const [item1, item2, item3] = await Promise.all([
			model.resolve(10, CancellationToken.None),
			model.resolve(10, CancellationToken.None),
			model.resolve(10, CancellationToken.None)
		]);

		// All should get the same item
		assert.strictEqual(item1, 10);
		assert.strictEqual(item2, 10);
		assert.strictEqual(item3, 10);
		assert.strictEqual(model.length, 21); // 20 items + 1 sentinel
	});

	test('empty pager with no items', () => {
		const emptyPager: IIterativePager<number> = {
			firstPage: { items: [], hasMore: false },
			getNextPage: async () => ({ items: [], hasMore: false })
		};
		const model = store.add(new IterativePagedModel(emptyPager));

		assert.strictEqual(model.length, 0);
		assert.strictEqual(model.isResolved(0), false);
	});

	test('single page pager with no more pages', () => {
		const singlePagePager: IIterativePager<number> = {
			firstPage: { items: [1, 2, 3], hasMore: false },
			getNextPage: async () => ({ items: [], hasMore: false })
		};
		const model = store.add(new IterativePagedModel(singlePagePager));

		assert.strictEqual(model.length, 3); // No sentinel
		assert.strictEqual(model.isResolved(0), true);
		assert.strictEqual(model.isResolved(2), true);
		assert.strictEqual(model.isResolved(3), false);
		assert.strictEqual(model.get(0), 1);
		assert.strictEqual(model.get(2), 3);
	});

	test('accessing item beyond loaded range throws', () => {
		const pager = createTestPager(10, 3);
		const model = store.add(new IterativePagedModel(pager));

		// Try to access item beyond current length
		assert.throws(() => model.get(15), /Item not resolved yet/);
	});

	test('resolving item beyond all pages throws', async () => {
		const pager = createTestPager(10, 3);
		const model = store.add(new IterativePagedModel(pager));

		// Load all pages
		await model.resolve(10, CancellationToken.None);
		await model.resolve(20, CancellationToken.None);

		// Try to resolve beyond the last item
		await assert.rejects(
			async () => model.resolve(30, CancellationToken.None),
			/Index out of bounds/
		);
	});

	test('cancelled token during initial resolve', async () => {
		const pager = createTestPager(10, 3);
		const model = store.add(new IterativePagedModel(pager));

		const cts = new CancellationTokenSource();
		cts.cancel();

		await assert.rejects(
			async () => model.resolve(0, cts.token),
			/Canceled/
		);
	});

	test('event fires for each page load', async () => {
		const pager = createTestPager(5, 4);
		const model = store.add(new IterativePagedModel(pager));
		const lengths: number[] = [];

		store.add(model.onDidIncrementLength((length: number) => lengths.push(length)));

		// Initially has first page (5 items + 1 sentinel = 6)
		assert.strictEqual(model.length, 6);

		// Load page 2
		await model.resolve(5, CancellationToken.None);
		assert.deepStrictEqual(lengths, [11]); // 10 items + 1 sentinel

		// Load page 3
		await model.resolve(10, CancellationToken.None);
		assert.deepStrictEqual(lengths, [11, 16]); // 15 items + 1 sentinel

		// Load page 4 (final)
		await model.resolve(15, CancellationToken.None);
		assert.deepStrictEqual(lengths, [11, 16, 20]); // 20 items, no sentinel
	});

	test('sequential page loads work correctly', async () => {
		const pager = createTestPager(5, 3);
		const model = store.add(new IterativePagedModel(pager));

		// Load pages sequentially
		for (let page = 1; page < 3; page++) {
			const sentinelIndex = page * 5;
			await model.resolve(sentinelIndex, CancellationToken.None);
		}

		// Verify all items are accessible
		assert.strictEqual(model.length, 15); // 3 pages * 5 items, no sentinel
		for (let i = 0; i < 15; i++) {
			assert.strictEqual(model.get(i), i);
			assert.strictEqual(model.isResolved(i), true);
		}
	});

	test('accessing items after loading all pages', async () => {
		const pager = createTestPager(10, 2);
		const model = store.add(new IterativePagedModel(pager));

		// Load second page
		await model.resolve(10, CancellationToken.None);

		// No sentinel after loading all pages
		assert.strictEqual(model.length, 20);
		assert.strictEqual(model.isResolved(19), true);
		assert.strictEqual(model.isResolved(20), false);

		// All items should be accessible
		for (let i = 0; i < 20; i++) {
			assert.strictEqual(model.get(i), i);
		}
	});

	test('pager with varying page sizes', async () => {
		let pageNum = 0;
		const varyingPager: IIterativePager<string> = {
			firstPage: { items: ['a', 'b', 'c'], hasMore: true },
			getNextPage: async (): Promise<IIterativePage<string>> => {
				pageNum++;
				if (pageNum === 1) {
					return { items: ['d', 'e'], hasMore: true };
				} else if (pageNum === 2) {
					return { items: ['f', 'g', 'h', 'i'], hasMore: false };
				}
				return { items: [], hasMore: false };
			}
		};

		const model = store.add(new IterativePagedModel(varyingPager));

		assert.strictEqual(model.length, 4); // 3 items + 1 sentinel

		// Load second page (2 items)
		await model.resolve(3, CancellationToken.None);
		assert.strictEqual(model.length, 6); // 5 items + 1 sentinel
		assert.strictEqual(model.get(3), 'd');

		// Load third page (4 items)
		await model.resolve(5, CancellationToken.None);
		assert.strictEqual(model.length, 9); // 9 items, no sentinel
		assert.strictEqual(model.get(5), 'f');
		assert.strictEqual(model.get(8), 'i');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/iterator.test.ts]---
Location: vscode-main/src/vs/base/test/common/iterator.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Iterable } from '../../common/iterator.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';

suite('Iterable', function () {

	ensureNoDisposablesAreLeakedInTestSuite();

	const customIterable = new class {

		*[Symbol.iterator]() {
			yield 'one';
			yield 'two';
			yield 'three';
		}
	};

	test('first', function () {

		assert.strictEqual(Iterable.first([]), undefined);
		assert.strictEqual(Iterable.first([1]), 1);
		assert.strictEqual(Iterable.first(customIterable), 'one');
		assert.strictEqual(Iterable.first(customIterable), 'one'); // fresh
	});

	test('wrap', function () {
		assert.deepStrictEqual([...Iterable.wrap(1)], [1]);
		assert.deepStrictEqual([...Iterable.wrap([1, 2, 3])], [1, 2, 3]);
	});

	test('every', function () {
		// Empty iterable should return true (vacuous truth)
		assert.strictEqual(Iterable.every([], () => false), true);

		// All elements match predicate
		assert.strictEqual(Iterable.every([2, 4, 6, 8], x => x % 2 === 0), true);
		assert.strictEqual(Iterable.every([1, 2, 3], x => x > 0), true);

		// Not all elements match predicate
		assert.strictEqual(Iterable.every([1, 2, 3, 4], x => x % 2 === 0), false);
		assert.strictEqual(Iterable.every([1, 2, 3], x => x > 2), false);

		// Single element - matches
		assert.strictEqual(Iterable.every([5], x => x === 5), true);

		// Single element - doesn't match
		assert.strictEqual(Iterable.every([5], x => x === 6), false);

		// Test index parameter in predicate
		const numbers = [10, 11, 12, 13];
		assert.strictEqual(Iterable.every(numbers, (x, i) => x === 10 + i), true);
		assert.strictEqual(Iterable.every(numbers, (x, i) => i < 2), false);

		// Test early termination - predicate should not be called for all elements
		let callCount = 0;
		const result = Iterable.every([1, 2, 3, 4, 5], x => {
			callCount++;
			return x < 3;
		});
		assert.strictEqual(result, false);
		assert.strictEqual(callCount, 3); // Should stop at the third element

		// Test with truthy/falsy values
		assert.strictEqual(Iterable.every([1, 2, 3], x => x), true);
		assert.strictEqual(Iterable.every([1, 0, 3], x => x), false);
		assert.strictEqual(Iterable.every(['a', 'b', 'c'], x => x), true);
		assert.strictEqual(Iterable.every(['a', '', 'c'], x => x), false);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/json.test.ts]---
Location: vscode-main/src/vs/base/test/common/json.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { createScanner, Node, parse, ParseError, ParseErrorCode, ParseOptions, parseTree, ScanError, SyntaxKind } from '../../common/json.js';
import { getParseErrorMessage } from '../../common/jsonErrorMessages.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';

function assertKinds(text: string, ...kinds: SyntaxKind[]): void {
	const scanner = createScanner(text);
	let kind: SyntaxKind;
	while ((kind = scanner.scan()) !== SyntaxKind.EOF) {
		assert.strictEqual(kind, kinds.shift());
	}
	assert.strictEqual(kinds.length, 0);
}
function assertScanError(text: string, expectedKind: SyntaxKind, scanError: ScanError): void {
	const scanner = createScanner(text);
	scanner.scan();
	assert.strictEqual(scanner.getToken(), expectedKind);
	assert.strictEqual(scanner.getTokenError(), scanError);
}

function assertValidParse(input: string, expected: any, options?: ParseOptions): void {
	const errors: ParseError[] = [];
	const actual = parse(input, errors, options);

	if (errors.length !== 0) {
		assert(false, getParseErrorMessage(errors[0].error));
	}
	assert.deepStrictEqual(actual, expected);
}

function assertInvalidParse(input: string, expected: any, options?: ParseOptions): void {
	const errors: ParseError[] = [];
	const actual = parse(input, errors, options);

	assert(errors.length > 0);
	assert.deepStrictEqual(actual, expected);
}

function assertTree(input: string, expected: any, expectedErrors: number[] = [], options?: ParseOptions): void {
	const errors: ParseError[] = [];
	const actual = parseTree(input, errors, options);

	assert.deepStrictEqual(errors.map(e => e.error, expected), expectedErrors);
	const checkParent = (node: Node) => {
		if (node.children) {
			for (const child of node.children) {
				assert.strictEqual(node, child.parent);
				// eslint-disable-next-line local/code-no-any-casts
				delete (<any>child).parent; // delete to avoid recursion in deep equal
				checkParent(child);
			}
		}
	};
	checkParent(actual);

	assert.deepStrictEqual(actual, expected);
}

suite('JSON', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('tokens', () => {
		assertKinds('{', SyntaxKind.OpenBraceToken);
		assertKinds('}', SyntaxKind.CloseBraceToken);
		assertKinds('[', SyntaxKind.OpenBracketToken);
		assertKinds(']', SyntaxKind.CloseBracketToken);
		assertKinds(':', SyntaxKind.ColonToken);
		assertKinds(',', SyntaxKind.CommaToken);
	});

	test('comments', () => {
		assertKinds('// this is a comment', SyntaxKind.LineCommentTrivia);
		assertKinds('// this is a comment\n', SyntaxKind.LineCommentTrivia, SyntaxKind.LineBreakTrivia);
		assertKinds('/* this is a comment*/', SyntaxKind.BlockCommentTrivia);
		assertKinds('/* this is a \r\ncomment*/', SyntaxKind.BlockCommentTrivia);
		assertKinds('/* this is a \ncomment*/', SyntaxKind.BlockCommentTrivia);

		// unexpected end
		assertKinds('/* this is a', SyntaxKind.BlockCommentTrivia);
		assertKinds('/* this is a \ncomment', SyntaxKind.BlockCommentTrivia);

		// broken comment
		assertKinds('/ ttt', SyntaxKind.Unknown, SyntaxKind.Trivia, SyntaxKind.Unknown);
	});

	test('strings', () => {
		assertKinds('"test"', SyntaxKind.StringLiteral);
		assertKinds('"\\""', SyntaxKind.StringLiteral);
		assertKinds('"\\/"', SyntaxKind.StringLiteral);
		assertKinds('"\\b"', SyntaxKind.StringLiteral);
		assertKinds('"\\f"', SyntaxKind.StringLiteral);
		assertKinds('"\\n"', SyntaxKind.StringLiteral);
		assertKinds('"\\r"', SyntaxKind.StringLiteral);
		assertKinds('"\\t"', SyntaxKind.StringLiteral);
		assertKinds('"\\v"', SyntaxKind.StringLiteral);
		assertKinds('"\u88ff"', SyntaxKind.StringLiteral);
		assertKinds('"​\u2028"', SyntaxKind.StringLiteral);

		// unexpected end
		assertKinds('"test', SyntaxKind.StringLiteral);
		assertKinds('"test\n"', SyntaxKind.StringLiteral, SyntaxKind.LineBreakTrivia, SyntaxKind.StringLiteral);

		// invalid characters
		assertScanError('"\t"', SyntaxKind.StringLiteral, ScanError.InvalidCharacter);
		assertScanError('"\t "', SyntaxKind.StringLiteral, ScanError.InvalidCharacter);
	});

	test('numbers', () => {
		assertKinds('0', SyntaxKind.NumericLiteral);
		assertKinds('0.1', SyntaxKind.NumericLiteral);
		assertKinds('-0.1', SyntaxKind.NumericLiteral);
		assertKinds('-1', SyntaxKind.NumericLiteral);
		assertKinds('1', SyntaxKind.NumericLiteral);
		assertKinds('123456789', SyntaxKind.NumericLiteral);
		assertKinds('10', SyntaxKind.NumericLiteral);
		assertKinds('90', SyntaxKind.NumericLiteral);
		assertKinds('90E+123', SyntaxKind.NumericLiteral);
		assertKinds('90e+123', SyntaxKind.NumericLiteral);
		assertKinds('90e-123', SyntaxKind.NumericLiteral);
		assertKinds('90E-123', SyntaxKind.NumericLiteral);
		assertKinds('90E123', SyntaxKind.NumericLiteral);
		assertKinds('90e123', SyntaxKind.NumericLiteral);

		// zero handling
		assertKinds('01', SyntaxKind.NumericLiteral, SyntaxKind.NumericLiteral);
		assertKinds('-01', SyntaxKind.NumericLiteral, SyntaxKind.NumericLiteral);

		// unexpected end
		assertKinds('-', SyntaxKind.Unknown);
		assertKinds('.0', SyntaxKind.Unknown);
	});

	test('keywords: true, false, null', () => {
		assertKinds('true', SyntaxKind.TrueKeyword);
		assertKinds('false', SyntaxKind.FalseKeyword);
		assertKinds('null', SyntaxKind.NullKeyword);


		assertKinds('true false null',
			SyntaxKind.TrueKeyword,
			SyntaxKind.Trivia,
			SyntaxKind.FalseKeyword,
			SyntaxKind.Trivia,
			SyntaxKind.NullKeyword);

		// invalid words
		assertKinds('nulllll', SyntaxKind.Unknown);
		assertKinds('True', SyntaxKind.Unknown);
		assertKinds('foo-bar', SyntaxKind.Unknown);
		assertKinds('foo bar', SyntaxKind.Unknown, SyntaxKind.Trivia, SyntaxKind.Unknown);
	});

	test('trivia', () => {
		assertKinds(' ', SyntaxKind.Trivia);
		assertKinds('  \t  ', SyntaxKind.Trivia);
		assertKinds('  \t  \n  \t  ', SyntaxKind.Trivia, SyntaxKind.LineBreakTrivia, SyntaxKind.Trivia);
		assertKinds('\r\n', SyntaxKind.LineBreakTrivia);
		assertKinds('\r', SyntaxKind.LineBreakTrivia);
		assertKinds('\n', SyntaxKind.LineBreakTrivia);
		assertKinds('\n\r', SyntaxKind.LineBreakTrivia, SyntaxKind.LineBreakTrivia);
		assertKinds('\n   \n', SyntaxKind.LineBreakTrivia, SyntaxKind.Trivia, SyntaxKind.LineBreakTrivia);
	});

	test('parse: literals', () => {

		assertValidParse('true', true);
		assertValidParse('false', false);
		assertValidParse('null', null);
		assertValidParse('"foo"', 'foo');
		assertValidParse('"\\"-\\\\-\\/-\\b-\\f-\\n-\\r-\\t"', '"-\\-/-\b-\f-\n-\r-\t');
		assertValidParse('"\\u00DC"', 'Ü');
		assertValidParse('9', 9);
		assertValidParse('-9', -9);
		assertValidParse('0.129', 0.129);
		assertValidParse('23e3', 23e3);
		assertValidParse('1.2E+3', 1.2E+3);
		assertValidParse('1.2E-3', 1.2E-3);
		assertValidParse('1.2E-3 // comment', 1.2E-3);
	});

	test('parse: objects', () => {
		assertValidParse('{}', {});
		assertValidParse('{ "foo": true }', { foo: true });
		assertValidParse('{ "bar": 8, "xoo": "foo" }', { bar: 8, xoo: 'foo' });
		assertValidParse('{ "hello": [], "world": {} }', { hello: [], world: {} });
		assertValidParse('{ "a": false, "b": true, "c": [ 7.4 ] }', { a: false, b: true, c: [7.4] });
		assertValidParse('{ "lineComment": "//", "blockComment": ["/*", "*/"], "brackets": [ ["{", "}"], ["[", "]"], ["(", ")"] ] }', { lineComment: '//', blockComment: ['/*', '*/'], brackets: [['{', '}'], ['[', ']'], ['(', ')']] });
		assertValidParse('{ "hello": [], "world": {} }', { hello: [], world: {} });
		assertValidParse('{ "hello": { "again": { "inside": 5 }, "world": 1 }}', { hello: { again: { inside: 5 }, world: 1 } });
		assertValidParse('{ "foo": /*hello*/true }', { foo: true });
	});

	test('parse: arrays', () => {
		assertValidParse('[]', []);
		assertValidParse('[ [],  [ [] ]]', [[], [[]]]);
		assertValidParse('[ 1, 2, 3 ]', [1, 2, 3]);
		assertValidParse('[ { "a": null } ]', [{ a: null }]);
	});

	test('parse: objects with errors', () => {
		assertInvalidParse('{,}', {});
		assertInvalidParse('{ "foo": true, }', { foo: true }, { allowTrailingComma: false });
		assertInvalidParse('{ "bar": 8 "xoo": "foo" }', { bar: 8, xoo: 'foo' });
		assertInvalidParse('{ ,"bar": 8 }', { bar: 8 });
		assertInvalidParse('{ ,"bar": 8, "foo" }', { bar: 8 });
		assertInvalidParse('{ "bar": 8, "foo": }', { bar: 8 });
		assertInvalidParse('{ 8, "foo": 9 }', { foo: 9 });
	});

	test('parse: array with errors', () => {
		assertInvalidParse('[,]', []);
		assertInvalidParse('[ 1, 2, ]', [1, 2], { allowTrailingComma: false });
		assertInvalidParse('[ 1 2, 3 ]', [1, 2, 3]);
		assertInvalidParse('[ ,1, 2, 3 ]', [1, 2, 3]);
		assertInvalidParse('[ ,1, 2, 3, ]', [1, 2, 3], { allowTrailingComma: false });
	});

	test('parse: disallow commments', () => {
		const options = { disallowComments: true };

		assertValidParse('[ 1, 2, null, "foo" ]', [1, 2, null, 'foo'], options);
		assertValidParse('{ "hello": [], "world": {} }', { hello: [], world: {} }, options);

		assertInvalidParse('{ "foo": /*comment*/ true }', { foo: true }, options);
	});

	test('parse: trailing comma', () => {
		// default is allow
		assertValidParse('{ "hello": [], }', { hello: [] });

		let options = { allowTrailingComma: true };
		assertValidParse('{ "hello": [], }', { hello: [] }, options);
		assertValidParse('{ "hello": [] }', { hello: [] }, options);
		assertValidParse('{ "hello": [], "world": {}, }', { hello: [], world: {} }, options);
		assertValidParse('{ "hello": [], "world": {} }', { hello: [], world: {} }, options);
		assertValidParse('{ "hello": [1,] }', { hello: [1] }, options);

		options = { allowTrailingComma: false };
		assertInvalidParse('{ "hello": [], }', { hello: [] }, options);
		assertInvalidParse('{ "hello": [], "world": {}, }', { hello: [], world: {} }, options);
	});

	test('tree: literals', () => {
		assertTree('true', { type: 'boolean', offset: 0, length: 4, value: true });
		assertTree('false', { type: 'boolean', offset: 0, length: 5, value: false });
		assertTree('null', { type: 'null', offset: 0, length: 4, value: null });
		assertTree('23', { type: 'number', offset: 0, length: 2, value: 23 });
		assertTree('-1.93e-19', { type: 'number', offset: 0, length: 9, value: -1.93e-19 });
		assertTree('"hello"', { type: 'string', offset: 0, length: 7, value: 'hello' });
	});

	test('tree: arrays', () => {
		assertTree('[]', { type: 'array', offset: 0, length: 2, children: [] });
		assertTree('[ 1 ]', { type: 'array', offset: 0, length: 5, children: [{ type: 'number', offset: 2, length: 1, value: 1 }] });
		assertTree('[ 1,"x"]', {
			type: 'array', offset: 0, length: 8, children: [
				{ type: 'number', offset: 2, length: 1, value: 1 },
				{ type: 'string', offset: 4, length: 3, value: 'x' }
			]
		});
		assertTree('[[]]', {
			type: 'array', offset: 0, length: 4, children: [
				{ type: 'array', offset: 1, length: 2, children: [] }
			]
		});
	});

	test('tree: objects', () => {
		assertTree('{ }', { type: 'object', offset: 0, length: 3, children: [] });
		assertTree('{ "val": 1 }', {
			type: 'object', offset: 0, length: 12, children: [
				{
					type: 'property', offset: 2, length: 8, colonOffset: 7, children: [
						{ type: 'string', offset: 2, length: 5, value: 'val' },
						{ type: 'number', offset: 9, length: 1, value: 1 }
					]
				}
			]
		});
		assertTree('{"id": "$", "v": [ null, null] }',
			{
				type: 'object', offset: 0, length: 32, children: [
					{
						type: 'property', offset: 1, length: 9, colonOffset: 5, children: [
							{ type: 'string', offset: 1, length: 4, value: 'id' },
							{ type: 'string', offset: 7, length: 3, value: '$' }
						]
					},
					{
						type: 'property', offset: 12, length: 18, colonOffset: 15, children: [
							{ type: 'string', offset: 12, length: 3, value: 'v' },
							{
								type: 'array', offset: 17, length: 13, children: [
									{ type: 'null', offset: 19, length: 4, value: null },
									{ type: 'null', offset: 25, length: 4, value: null }
								]
							}
						]
					}
				]
			}
		);
		assertTree('{  "id": { "foo": { } } , }',
			{
				type: 'object', offset: 0, length: 27, children: [
					{
						type: 'property', offset: 3, length: 20, colonOffset: 7, children: [
							{ type: 'string', offset: 3, length: 4, value: 'id' },
							{
								type: 'object', offset: 9, length: 14, children: [
									{
										type: 'property', offset: 11, length: 10, colonOffset: 16, children: [
											{ type: 'string', offset: 11, length: 5, value: 'foo' },
											{ type: 'object', offset: 18, length: 3, children: [] }
										]
									}
								]
							}
						]
					}
				]
			}
			, [ParseErrorCode.PropertyNameExpected, ParseErrorCode.ValueExpected], { allowTrailingComma: false });
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/jsonEdit.test.ts]---
Location: vscode-main/src/vs/base/test/common/jsonEdit.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { removeProperty, setProperty } from '../../common/jsonEdit.js';
import { Edit, FormattingOptions } from '../../common/jsonFormatter.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';

suite('JSON - edits', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	function assertEdit(content: string, edits: Edit[], expected: string) {
		assert(edits);
		let lastEditOffset = content.length;
		for (let i = edits.length - 1; i >= 0; i--) {
			const edit = edits[i];
			assert(edit.offset >= 0 && edit.length >= 0 && edit.offset + edit.length <= content.length);
			assert(typeof edit.content === 'string');
			assert(lastEditOffset >= edit.offset + edit.length); // make sure all edits are ordered
			lastEditOffset = edit.offset;
			content = content.substring(0, edit.offset) + edit.content + content.substring(edit.offset + edit.length);
		}
		assert.strictEqual(content, expected);
	}

	const formatterOptions: FormattingOptions = {
		insertSpaces: true,
		tabSize: 2,
		eol: '\n'
	};

	test('set property', () => {
		let content = '{\n  "x": "y"\n}';
		let edits = setProperty(content, ['x'], 'bar', formatterOptions);
		assertEdit(content, edits, '{\n  "x": "bar"\n}');

		content = 'true';
		edits = setProperty(content, [], 'bar', formatterOptions);
		assertEdit(content, edits, '"bar"');

		content = '{\n  "x": "y"\n}';
		edits = setProperty(content, ['x'], { key: true }, formatterOptions);
		assertEdit(content, edits, '{\n  "x": {\n    "key": true\n  }\n}');
		content = '{\n  "a": "b",  "x": "y"\n}';
		edits = setProperty(content, ['a'], null, formatterOptions);
		assertEdit(content, edits, '{\n  "a": null,  "x": "y"\n}');
	});

	test('insert property', () => {
		let content = '{}';
		let edits = setProperty(content, ['foo'], 'bar', formatterOptions);
		assertEdit(content, edits, '{\n  "foo": "bar"\n}');

		edits = setProperty(content, ['foo', 'foo2'], 'bar', formatterOptions);
		assertEdit(content, edits, '{\n  "foo": {\n    "foo2": "bar"\n  }\n}');

		content = '{\n}';
		edits = setProperty(content, ['foo'], 'bar', formatterOptions);
		assertEdit(content, edits, '{\n  "foo": "bar"\n}');

		content = '  {\n  }';
		edits = setProperty(content, ['foo'], 'bar', formatterOptions);
		assertEdit(content, edits, '  {\n    "foo": "bar"\n  }');

		content = '{\n  "x": "y"\n}';
		edits = setProperty(content, ['foo'], 'bar', formatterOptions);
		assertEdit(content, edits, '{\n  "x": "y",\n  "foo": "bar"\n}');

		content = '{\n  "x": "y"\n}';
		edits = setProperty(content, ['e'], 'null', formatterOptions);
		assertEdit(content, edits, '{\n  "x": "y",\n  "e": "null"\n}');

		edits = setProperty(content, ['x'], 'bar', formatterOptions);
		assertEdit(content, edits, '{\n  "x": "bar"\n}');

		content = '{\n  "x": {\n    "a": 1,\n    "b": true\n  }\n}\n';
		edits = setProperty(content, ['x'], 'bar', formatterOptions);
		assertEdit(content, edits, '{\n  "x": "bar"\n}\n');

		edits = setProperty(content, ['x', 'b'], 'bar', formatterOptions);
		assertEdit(content, edits, '{\n  "x": {\n    "a": 1,\n    "b": "bar"\n  }\n}\n');

		edits = setProperty(content, ['x', 'c'], 'bar', formatterOptions, () => 0);
		assertEdit(content, edits, '{\n  "x": {\n    "c": "bar",\n    "a": 1,\n    "b": true\n  }\n}\n');

		edits = setProperty(content, ['x', 'c'], 'bar', formatterOptions, () => 1);
		assertEdit(content, edits, '{\n  "x": {\n    "a": 1,\n    "c": "bar",\n    "b": true\n  }\n}\n');

		edits = setProperty(content, ['x', 'c'], 'bar', formatterOptions, () => 2);
		assertEdit(content, edits, '{\n  "x": {\n    "a": 1,\n    "b": true,\n    "c": "bar"\n  }\n}\n');

		edits = setProperty(content, ['c'], 'bar', formatterOptions);
		assertEdit(content, edits, '{\n  "x": {\n    "a": 1,\n    "b": true\n  },\n  "c": "bar"\n}\n');

		content = '{\n  "a": [\n    {\n    } \n  ]  \n}';
		edits = setProperty(content, ['foo'], 'bar', formatterOptions);
		assertEdit(content, edits, '{\n  "a": [\n    {\n    } \n  ],\n  "foo": "bar"\n}');

		content = '';
		edits = setProperty(content, ['foo', 0], 'bar', formatterOptions);
		assertEdit(content, edits, '{\n  "foo": [\n    "bar"\n  ]\n}');

		content = '//comment';
		edits = setProperty(content, ['foo', 0], 'bar', formatterOptions);
		assertEdit(content, edits, '{\n  "foo": [\n    "bar"\n  ]\n} //comment');
	});

	test('remove property', () => {
		let content = '{\n  "x": "y"\n}';
		let edits = removeProperty(content, ['x'], formatterOptions);
		assertEdit(content, edits, '{\n}');

		content = '{\n  "x": "y", "a": []\n}';
		edits = removeProperty(content, ['x'], formatterOptions);
		assertEdit(content, edits, '{\n  "a": []\n}');

		content = '{\n  "x": "y", "a": []\n}';
		edits = removeProperty(content, ['a'], formatterOptions);
		assertEdit(content, edits, '{\n  "x": "y"\n}');
	});

	test('insert item at 0', () => {
		const content = '[\n  2,\n  3\n]';
		const edits = setProperty(content, [0], 1, formatterOptions);
		assertEdit(content, edits, '[\n  1,\n  2,\n  3\n]');
	});

	test('insert item at 0 in empty array', () => {
		const content = '[\n]';
		const edits = setProperty(content, [0], 1, formatterOptions);
		assertEdit(content, edits, '[\n  1\n]');
	});

	test('insert item at an index', () => {
		const content = '[\n  1,\n  3\n]';
		const edits = setProperty(content, [1], 2, formatterOptions);
		assertEdit(content, edits, '[\n  1,\n  2,\n  3\n]');
	});

	test('insert item at an index im empty array', () => {
		const content = '[\n]';
		const edits = setProperty(content, [1], 1, formatterOptions);
		assertEdit(content, edits, '[\n  1\n]');
	});

	test('insert item at end index', () => {
		const content = '[\n  1,\n  2\n]';
		const edits = setProperty(content, [2], 3, formatterOptions);
		assertEdit(content, edits, '[\n  1,\n  2,\n  3\n]');
	});

	test('insert item at end to empty array', () => {
		const content = '[\n]';
		const edits = setProperty(content, [-1], 'bar', formatterOptions);
		assertEdit(content, edits, '[\n  "bar"\n]');
	});

	test('insert item at end', () => {
		const content = '[\n  1,\n  2\n]';
		const edits = setProperty(content, [-1], 'bar', formatterOptions);
		assertEdit(content, edits, '[\n  1,\n  2,\n  "bar"\n]');
	});

	test('remove item in array with one item', () => {
		const content = '[\n  1\n]';
		const edits = setProperty(content, [0], undefined, formatterOptions);
		assertEdit(content, edits, '[]');
	});

	test('remove item in the middle of the array', () => {
		const content = '[\n  1,\n  2,\n  3\n]';
		const edits = setProperty(content, [1], undefined, formatterOptions);
		assertEdit(content, edits, '[\n  1,\n  3\n]');
	});

	test('remove last item in the array', () => {
		const content = '[\n  1,\n  2,\n  "bar"\n]';
		const edits = setProperty(content, [2], undefined, formatterOptions);
		assertEdit(content, edits, '[\n  1,\n  2\n]');
	});

	test('remove last item in the array if ends with comma', () => {
		const content = '[\n  1,\n  "foo",\n  "bar",\n]';
		const edits = setProperty(content, [2], undefined, formatterOptions);
		assertEdit(content, edits, '[\n  1,\n  "foo"\n]');
	});

	test('remove last item in the array if there is a comment in the beginning', () => {
		const content = '// This is a comment\n[\n  1,\n  "foo",\n  "bar"\n]';
		const edits = setProperty(content, [2], undefined, formatterOptions);
		assertEdit(content, edits, '// This is a comment\n[\n  1,\n  "foo"\n]');
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/test/common/jsonFormatter.test.ts]---
Location: vscode-main/src/vs/base/test/common/jsonFormatter.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import * as Formatter from '../../common/jsonFormatter.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';

suite('JSON - formatter', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	function format(content: string, expected: string, insertSpaces = true) {
		let range: Formatter.Range | undefined = undefined;
		const rangeStart = content.indexOf('|');
		const rangeEnd = content.lastIndexOf('|');
		if (rangeStart !== -1 && rangeEnd !== -1) {
			content = content.substring(0, rangeStart) + content.substring(rangeStart + 1, rangeEnd) + content.substring(rangeEnd + 1);
			range = { offset: rangeStart, length: rangeEnd - rangeStart };
		}

		const edits = Formatter.format(content, range, { tabSize: 2, insertSpaces: insertSpaces, eol: '\n' });

		let lastEditOffset = content.length;
		for (let i = edits.length - 1; i >= 0; i--) {
			const edit = edits[i];
			assert(edit.offset >= 0 && edit.length >= 0 && edit.offset + edit.length <= content.length);
			assert(typeof edit.content === 'string');
			assert(lastEditOffset >= edit.offset + edit.length); // make sure all edits are ordered
			lastEditOffset = edit.offset;
			content = content.substring(0, edit.offset) + edit.content + content.substring(edit.offset + edit.length);
		}

		assert.strictEqual(content, expected);
	}

	test('object - single property', () => {
		const content = [
			'{"x" : 1}'
		].join('\n');

		const expected = [
			'{',
			'  "x": 1',
			'}'
		].join('\n');

		format(content, expected);
	});
	test('object - multiple properties', () => {
		const content = [
			'{"x" : 1,  "y" : "foo", "z"  : true}'
		].join('\n');

		const expected = [
			'{',
			'  "x": 1,',
			'  "y": "foo",',
			'  "z": true',
			'}'
		].join('\n');

		format(content, expected);
	});
	test('object - no properties ', () => {
		const content = [
			'{"x" : {    },  "y" : {}}'
		].join('\n');

		const expected = [
			'{',
			'  "x": {},',
			'  "y": {}',
			'}'
		].join('\n');

		format(content, expected);
	});
	test('object - nesting', () => {
		const content = [
			'{"x" : {  "y" : { "z"  : { }}, "a": true}}'
		].join('\n');

		const expected = [
			'{',
			'  "x": {',
			'    "y": {',
			'      "z": {}',
			'    },',
			'    "a": true',
			'  }',
			'}'
		].join('\n');

		format(content, expected);
	});

	test('array - single items', () => {
		const content = [
			'["[]"]'
		].join('\n');

		const expected = [
			'[',
			'  "[]"',
			']'
		].join('\n');

		format(content, expected);
	});

	test('array - multiple items', () => {
		const content = [
			'[true,null,1.2]'
		].join('\n');

		const expected = [
			'[',
			'  true,',
			'  null,',
			'  1.2',
			']'
		].join('\n');

		format(content, expected);
	});

	test('array - no items', () => {
		const content = [
			'[      ]'
		].join('\n');

		const expected = [
			'[]'
		].join('\n');

		format(content, expected);
	});

	test('array - nesting', () => {
		const content = [
			'[ [], [ [ {} ], "a" ]  ]'
		].join('\n');

		const expected = [
			'[',
			'  [],',
			'  [',
			'    [',
			'      {}',
			'    ],',
			'    "a"',
			'  ]',
			']',
		].join('\n');

		format(content, expected);
	});

	test('syntax errors', () => {
		const content = [
			'[ null 1.2 ]'
		].join('\n');

		const expected = [
			'[',
			'  null 1.2',
			']',
		].join('\n');

		format(content, expected);
	});

	test('empty lines', () => {
		const content = [
			'{',
			'"a": true,',
			'',
			'"b": true',
			'}',
		].join('\n');

		const expected = [
			'{',
			'\t"a": true,',
			'\t"b": true',
			'}',
		].join('\n');

		format(content, expected, false);
	});
	test('single line comment', () => {
		const content = [
			'[ ',
			'//comment',
			'"foo", "bar"',
			'] '
		].join('\n');

		const expected = [
			'[',
			'  //comment',
			'  "foo",',
			'  "bar"',
			']',
		].join('\n');

		format(content, expected);
	});
	test('block line comment', () => {
		const content = [
			'[{',
			'        /*comment*/     ',
			'"foo" : true',
			'}] '
		].join('\n');

		const expected = [
			'[',
			'  {',
			'    /*comment*/',
			'    "foo": true',
			'  }',
			']',
		].join('\n');

		format(content, expected);
	});
	test('single line comment on same line', () => {
		const content = [
			' {  ',
			'        "a": {}// comment    ',
			' } '
		].join('\n');

		const expected = [
			'{',
			'  "a": {} // comment    ',
			'}',
		].join('\n');

		format(content, expected);
	});
	test('single line comment on same line 2', () => {
		const content = [
			'{ //comment',
			'}'
		].join('\n');

		const expected = [
			'{ //comment',
			'}'
		].join('\n');

		format(content, expected);
	});
	test('block comment on same line', () => {
		const content = [
			'{      "a": {}, /*comment*/    ',
			'        /*comment*/ "b": {},    ',
			'        "c": {/*comment*/}    } ',
		].join('\n');

		const expected = [
			'{',
			'  "a": {}, /*comment*/',
			'  /*comment*/ "b": {},',
			'  "c": { /*comment*/}',
			'}',
		].join('\n');

		format(content, expected);
	});

	test('block comment on same line advanced', () => {
		const content = [
			' {       "d": [',
			'             null',
			'        ] /*comment*/',
			'        ,"e": /*comment*/ [null] }',
		].join('\n');

		const expected = [
			'{',
			'  "d": [',
			'    null',
			'  ] /*comment*/,',
			'  "e": /*comment*/ [',
			'    null',
			'  ]',
			'}',
		].join('\n');

		format(content, expected);
	});

	test('multiple block comments on same line', () => {
		const content = [
			'{      "a": {} /*comment*/, /*comment*/   ',
			'        /*comment*/ "b": {}  /*comment*/  } '
		].join('\n');

		const expected = [
			'{',
			'  "a": {} /*comment*/, /*comment*/',
			'  /*comment*/ "b": {} /*comment*/',
			'}',
		].join('\n');

		format(content, expected);
	});
	test('multiple mixed comments on same line', () => {
		const content = [
			'[ /*comment*/  /*comment*/   // comment ',
			']'
		].join('\n');

		const expected = [
			'[ /*comment*/ /*comment*/ // comment ',
			']'
		].join('\n');

		format(content, expected);
	});

	test('range', () => {
		const content = [
			'{ "a": {},',
			'|"b": [null, null]|',
			'} '
		].join('\n');

		const expected = [
			'{ "a": {},',
			'"b": [',
			'  null,',
			'  null',
			']',
			'} ',
		].join('\n');

		format(content, expected);
	});

	test('range with existing indent', () => {
		const content = [
			'{ "a": {},',
			'   |"b": [null],',
			'"c": {}',
			'}|'
		].join('\n');

		const expected = [
			'{ "a": {},',
			'   "b": [',
			'    null',
			'  ],',
			'  "c": {}',
			'}',
		].join('\n');

		format(content, expected);
	});

	test('range with existing indent - tabs', () => {
		const content = [
			'{ "a": {},',
			'|  "b": [null],   ',
			'"c": {}',
			'} |    '
		].join('\n');

		const expected = [
			'{ "a": {},',
			'\t"b": [',
			'\t\tnull',
			'\t],',
			'\t"c": {}',
			'}',
		].join('\n');

		format(content, expected, false);
	});


	test('block comment none-line breaking symbols', () => {
		const content = [
			'{ "a": [ 1',
			'/* comment */',
			', 2',
			'/* comment */',
			']',
			'/* comment */',
			',',
			' "b": true',
			'/* comment */',
			'}'
		].join('\n');

		const expected = [
			'{',
			'  "a": [',
			'    1',
			'    /* comment */',
			'    ,',
			'    2',
			'    /* comment */',
			'  ]',
			'  /* comment */',
			'  ,',
			'  "b": true',
			'  /* comment */',
			'}',
		].join('\n');

		format(content, expected);
	});
	test('line comment after none-line breaking symbols', () => {
		const content = [
			'{ "a":',
			'// comment',
			'null,',
			' "b"',
			'// comment',
			': null',
			'// comment',
			'}'
		].join('\n');

		const expected = [
			'{',
			'  "a":',
			'  // comment',
			'  null,',
			'  "b"',
			'  // comment',
			'  : null',
			'  // comment',
			'}',
		].join('\n');

		format(content, expected);
	});

	test('toFormattedString', () => {
		const obj = {
			a: { b: 1, d: ['hello'] }
		};


		const getExpected = (tab: string, eol: string) => {
			return [
				`{`,
				`${tab}"a": {`,
				`${tab}${tab}"b": 1,`,
				`${tab}${tab}"d": [`,
				`${tab}${tab}${tab}"hello"`,
				`${tab}${tab}]`,
				`${tab}}`,
				'}'
			].join(eol);
		};

		let actual = Formatter.toFormattedString(obj, { insertSpaces: true, tabSize: 2, eol: '\n' });
		assert.strictEqual(actual, getExpected('  ', '\n'));

		actual = Formatter.toFormattedString(obj, { insertSpaces: true, tabSize: 2, eol: '\r\n' });
		assert.strictEqual(actual, getExpected('  ', '\r\n'));

		actual = Formatter.toFormattedString(obj, { insertSpaces: false, eol: '\r\n' });
		assert.strictEqual(actual, getExpected('\t', '\r\n'));
	});
});
```

--------------------------------------------------------------------------------

````
