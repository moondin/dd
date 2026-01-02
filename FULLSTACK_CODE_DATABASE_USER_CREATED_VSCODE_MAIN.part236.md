---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 236
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 236 of 552)

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

---[FILE: src/vs/editor/contrib/semanticTokens/common/semanticTokensConfig.ts]---
Location: vscode-main/src/vs/editor/contrib/semanticTokens/common/semanticTokensConfig.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ITextModel } from '../../../common/model.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';

export const SEMANTIC_HIGHLIGHTING_SETTING_ID = 'editor.semanticHighlighting';

export interface IEditorSemanticHighlightingOptions {
	enabled: true | false | 'configuredByTheme';
}

export function isSemanticColoringEnabled(model: ITextModel, themeService: IThemeService, configurationService: IConfigurationService): boolean {
	const setting = configurationService.getValue<IEditorSemanticHighlightingOptions>(SEMANTIC_HIGHLIGHTING_SETTING_ID, { overrideIdentifier: model.getLanguageId(), resource: model.uri })?.enabled;
	if (typeof setting === 'boolean') {
		return setting;
	}
	return themeService.getColorTheme().semanticHighlighting;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/semanticTokens/test/browser/documentSemanticTokens.test.ts]---
Location: vscode-main/src/vs/editor/contrib/semanticTokens/test/browser/documentSemanticTokens.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Barrier, timeout } from '../../../../../base/common/async.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { mock } from '../../../../../base/test/common/mock.js';
import { runWithFakedTimers } from '../../../../../base/test/common/timeTravelScheduler.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { Range } from '../../../../common/core/range.js';
import { DocumentSemanticTokensProvider, SemanticTokens, SemanticTokensEdits, SemanticTokensLegend } from '../../../../common/languages.js';
import { ILanguageService } from '../../../../common/languages/language.js';
import { ILanguageConfigurationService } from '../../../../common/languages/languageConfigurationRegistry.js';
import { ITextModel } from '../../../../common/model.js';
import { LanguageFeatureDebounceService } from '../../../../common/services/languageFeatureDebounce.js';
import { ILanguageFeaturesService } from '../../../../common/services/languageFeatures.js';
import { LanguageFeaturesService } from '../../../../common/services/languageFeaturesService.js';
import { LanguageService } from '../../../../common/services/languageService.js';
import { IModelService } from '../../../../common/services/model.js';
import { ModelService } from '../../../../common/services/modelService.js';
import { SemanticTokensStylingService } from '../../../../common/services/semanticTokensStylingService.js';
import { DocumentSemanticTokensFeature } from '../../browser/documentSemanticTokens.js';
import { getDocumentSemanticTokens, isSemanticTokens } from '../../common/getSemanticTokens.js';
import { TestLanguageConfigurationService } from '../../../../test/common/modes/testLanguageConfigurationService.js';
import { TestTextResourcePropertiesService } from '../../../../test/common/services/testTextResourcePropertiesService.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { TestDialogService } from '../../../../../platform/dialogs/test/common/testDialogService.js';
import { IEnvironmentService } from '../../../../../platform/environment/common/environment.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { NullLogService } from '../../../../../platform/log/common/log.js';
import { TestNotificationService } from '../../../../../platform/notification/test/common/testNotificationService.js';
import { ColorScheme } from '../../../../../platform/theme/common/theme.js';
import { TestColorTheme, TestThemeService } from '../../../../../platform/theme/test/common/testThemeService.js';
import { UndoRedoService } from '../../../../../platform/undoRedo/common/undoRedoService.js';
import { ITreeSitterLibraryService } from '../../../../common/services/treeSitter/treeSitterLibraryService.js';
import { TestTreeSitterLibraryService } from '../../../../test/common/services/testTreeSitterLibraryService.js';

suite('ModelSemanticColoring', () => {

	const disposables = new DisposableStore();
	let modelService: IModelService;
	let languageService: ILanguageService;
	let languageFeaturesService: ILanguageFeaturesService;

	setup(() => {
		const configService = new TestConfigurationService({ editor: { semanticHighlighting: true } });
		const themeService = new TestThemeService();
		themeService.setTheme(new TestColorTheme({}, ColorScheme.DARK, true));
		const logService = new NullLogService();
		languageFeaturesService = new LanguageFeaturesService();
		languageService = disposables.add(new LanguageService(false));
		const semanticTokensStylingService = disposables.add(new SemanticTokensStylingService(themeService, logService, languageService));
		const instantiationService = new TestInstantiationService();
		instantiationService.set(ILanguageService, languageService);
		instantiationService.set(ILanguageConfigurationService, new TestLanguageConfigurationService());
		instantiationService.set(ITreeSitterLibraryService, new TestTreeSitterLibraryService());
		modelService = disposables.add(new ModelService(
			configService,
			new TestTextResourcePropertiesService(configService),
			new UndoRedoService(new TestDialogService(), new TestNotificationService()),
			instantiationService
		));
		const envService = new class extends mock<IEnvironmentService>() {
			override isBuilt: boolean = true;
			override isExtensionDevelopment: boolean = false;
		};
		disposables.add(new DocumentSemanticTokensFeature(semanticTokensStylingService, modelService, themeService, configService, new LanguageFeatureDebounceService(logService, envService), languageFeaturesService));
	});

	teardown(() => {
		disposables.clear();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('DocumentSemanticTokens should be fetched when the result is empty if there are pending changes', async () => {
		await runWithFakedTimers({}, async () => {

			disposables.add(languageService.registerLanguage({ id: 'testMode' }));

			const inFirstCall = new Barrier();
			const delayFirstResult = new Barrier();
			const secondResultProvided = new Barrier();
			let callCount = 0;

			disposables.add(languageFeaturesService.documentSemanticTokensProvider.register('testMode', new class implements DocumentSemanticTokensProvider {
				getLegend(): SemanticTokensLegend {
					return { tokenTypes: ['class'], tokenModifiers: [] };
				}
				async provideDocumentSemanticTokens(model: ITextModel, lastResultId: string | null, token: CancellationToken): Promise<SemanticTokens | SemanticTokensEdits | null> {
					callCount++;
					if (callCount === 1) {
						assert.ok('called once');
						inFirstCall.open();
						await delayFirstResult.wait();
						await timeout(0); // wait for the simple scheduler to fire to check that we do actually get rescheduled
						return null;
					}
					if (callCount === 2) {
						assert.ok('called twice');
						secondResultProvided.open();
						return null;
					}
					assert.fail('Unexpected call');
				}
				releaseDocumentSemanticTokens(resultId: string | undefined): void {
				}
			}));

			const textModel = disposables.add(modelService.createModel('Hello world', languageService.createById('testMode')));
			// pretend the text model is attached to an editor (so that semantic tokens are computed)
			textModel.onBeforeAttached();

			// wait for the provider to be called
			await inFirstCall.wait();

			// the provider is now in the provide call
			// change the text buffer while the provider is running
			textModel.applyEdits([{ range: new Range(1, 1, 1, 1), text: 'x' }]);

			// let the provider finish its first result
			delayFirstResult.open();

			// we need to check that the provider is called again, even if it returns null
			await secondResultProvided.wait();

			// assert that it got called twice
			assert.strictEqual(callCount, 2);
		});
	});

	test('issue #149412: VS Code hangs when bad semantic token data is received', async () => {
		await runWithFakedTimers({}, async () => {

			disposables.add(languageService.registerLanguage({ id: 'testMode' }));

			let lastResult: SemanticTokens | SemanticTokensEdits | null = null;

			disposables.add(languageFeaturesService.documentSemanticTokensProvider.register('testMode', new class implements DocumentSemanticTokensProvider {
				getLegend(): SemanticTokensLegend {
					return { tokenTypes: ['class'], tokenModifiers: [] };
				}
				async provideDocumentSemanticTokens(model: ITextModel, lastResultId: string | null, token: CancellationToken): Promise<SemanticTokens | SemanticTokensEdits | null> {
					if (!lastResultId) {
						// this is the first call
						lastResult = {
							resultId: '1',
							data: new Uint32Array([4294967293, 0, 7, 16, 0, 1, 4, 3, 11, 1])
						};
					} else {
						// this is the second call
						lastResult = {
							resultId: '2',
							edits: [{
								start: 4294967276,
								deleteCount: 0,
								data: new Uint32Array([2, 0, 3, 11, 0])
							}]
						};
					}
					return lastResult;
				}
				releaseDocumentSemanticTokens(resultId: string | undefined): void {
				}
			}));

			const textModel = disposables.add(modelService.createModel('', languageService.createById('testMode')));
			// pretend the text model is attached to an editor (so that semantic tokens are computed)
			textModel.onBeforeAttached();

			// wait for the semantic tokens to be fetched
			await Event.toPromise(textModel.onDidChangeTokens);
			assert.strictEqual(lastResult!.resultId, '1');

			// edit the text
			textModel.applyEdits([{ range: new Range(1, 1, 1, 1), text: 'foo' }]);

			// wait for the semantic tokens to be fetched again
			await Event.toPromise(textModel.onDidChangeTokens);
			assert.strictEqual(lastResult!.resultId, '2');
		});
	});

	test('issue #161573: onDidChangeSemanticTokens doesn\'t consistently trigger provideDocumentSemanticTokens', async () => {
		await runWithFakedTimers({}, async () => {

			disposables.add(languageService.registerLanguage({ id: 'testMode' }));

			const emitter = new Emitter<void>();
			let requestCount = 0;
			disposables.add(languageFeaturesService.documentSemanticTokensProvider.register('testMode', new class implements DocumentSemanticTokensProvider {
				onDidChange = emitter.event;
				getLegend(): SemanticTokensLegend {
					return { tokenTypes: ['class'], tokenModifiers: [] };
				}
				async provideDocumentSemanticTokens(model: ITextModel, lastResultId: string | null, token: CancellationToken): Promise<SemanticTokens | SemanticTokensEdits | null> {
					requestCount++;
					if (requestCount === 1) {
						await timeout(1000);
						// send a change event
						emitter.fire();
						await timeout(1000);
						return null;
					}
					return null;
				}
				releaseDocumentSemanticTokens(resultId: string | undefined): void {
				}
			}));

			const textModel = disposables.add(modelService.createModel('', languageService.createById('testMode')));
			// pretend the text model is attached to an editor (so that semantic tokens are computed)
			textModel.onBeforeAttached();

			await timeout(5000);
			assert.deepStrictEqual(requestCount, 2);
		});
	});

	test('DocumentSemanticTokens should be pick the token provider with actual items', async () => {
		await runWithFakedTimers({}, async () => {

			let callCount = 0;
			disposables.add(languageService.registerLanguage({ id: 'testMode2' }));
			disposables.add(languageFeaturesService.documentSemanticTokensProvider.register('testMode2', new class implements DocumentSemanticTokensProvider {
				getLegend(): SemanticTokensLegend {
					return { tokenTypes: ['class1'], tokenModifiers: [] };
				}
				async provideDocumentSemanticTokens(model: ITextModel, lastResultId: string | null, token: CancellationToken): Promise<SemanticTokens | SemanticTokensEdits | null> {
					callCount++;
					// For a secondary request return a different value
					if (lastResultId) {
						return {
							data: new Uint32Array([2, 1, 1, 1, 1, 0, 2, 1, 1, 1])
						};
					}
					return {
						resultId: '1',
						data: new Uint32Array([0, 1, 1, 1, 1, 0, 2, 1, 1, 1])
					};
				}
				releaseDocumentSemanticTokens(resultId: string | undefined): void {
				}
			}));
			disposables.add(languageFeaturesService.documentSemanticTokensProvider.register('testMode2', new class implements DocumentSemanticTokensProvider {
				getLegend(): SemanticTokensLegend {
					return { tokenTypes: ['class2'], tokenModifiers: [] };
				}
				async provideDocumentSemanticTokens(model: ITextModel, lastResultId: string | null, token: CancellationToken): Promise<SemanticTokens | SemanticTokensEdits | null> {
					callCount++;
					return null;
				}
				releaseDocumentSemanticTokens(resultId: string | undefined): void {
				}
			}));

			function toArr(arr: Uint32Array): number[] {
				const result: number[] = [];
				for (let i = 0; i < arr.length; i++) {
					result[i] = arr[i];
				}
				return result;
			}

			const textModel = modelService.createModel('Hello world 2', languageService.createById('testMode2'));
			try {
				let result = await getDocumentSemanticTokens(languageFeaturesService.documentSemanticTokensProvider, textModel, null, null, CancellationToken.None);
				assert.ok(result, `We should have tokens (1)`);
				assert.ok(result.tokens, `Tokens are found from multiple providers (1)`);
				assert.ok(isSemanticTokens(result.tokens), `Tokens are full (1)`);
				assert.ok(result.tokens.resultId, `Token result id found from multiple providers (1)`);
				assert.deepStrictEqual(toArr(result.tokens.data), [0, 1, 1, 1, 1, 0, 2, 1, 1, 1], `Token data returned for multiple providers (1)`);
				assert.deepStrictEqual(callCount, 2, `Called both token providers (1)`);
				assert.deepStrictEqual(result.provider.getLegend(), { tokenTypes: ['class1'], tokenModifiers: [] }, `Legend matches the tokens (1)`);

				// Make a second request. Make sure we get the secondary value
				result = await getDocumentSemanticTokens(languageFeaturesService.documentSemanticTokensProvider, textModel, result.provider, result.tokens.resultId, CancellationToken.None);
				assert.ok(result, `We should have tokens (2)`);
				assert.ok(result.tokens, `Tokens are found from multiple providers (2)`);
				assert.ok(isSemanticTokens(result.tokens), `Tokens are full (2)`);
				assert.ok(!result.tokens.resultId, `Token result id found from multiple providers (2)`);
				assert.deepStrictEqual(toArr(result.tokens.data), [2, 1, 1, 1, 1, 0, 2, 1, 1, 1], `Token data returned for multiple providers (2)`);
				assert.deepStrictEqual(callCount, 4, `Called both token providers (2)`);
				assert.deepStrictEqual(result.provider.getLegend(), { tokenTypes: ['class1'], tokenModifiers: [] }, `Legend matches the tokens (2)`);
			} finally {
				disposables.clear();

				// Wait for scheduler to finish
				await timeout(0);

				// Now dispose the text model
				textModel.dispose();
			}
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/semanticTokens/test/browser/getSemanticTokens.test.ts]---
Location: vscode-main/src/vs/editor/contrib/semanticTokens/test/browser/getSemanticTokens.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { canceled } from '../../../../../base/common/errors.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { LanguageFeatureRegistry } from '../../../../common/languageFeatureRegistry.js';
import { DocumentSemanticTokensProvider, ProviderResult, SemanticTokens, SemanticTokensEdits, SemanticTokensLegend } from '../../../../common/languages.js';
import { ITextModel } from '../../../../common/model.js';
import { getDocumentSemanticTokens } from '../../common/getSemanticTokens.js';
import { createTextModel } from '../../../../test/common/testTextModel.js';

suite('getSemanticTokens', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('issue #136540: semantic highlighting flickers', async () => {
		const disposables = new DisposableStore();
		const registry = new LanguageFeatureRegistry<DocumentSemanticTokensProvider>();
		const provider = new class implements DocumentSemanticTokensProvider {
			getLegend(): SemanticTokensLegend {
				return { tokenTypes: ['test'], tokenModifiers: [] };
			}
			provideDocumentSemanticTokens(model: ITextModel, lastResultId: string | null, token: CancellationToken): ProviderResult<SemanticTokens | SemanticTokensEdits> {
				throw canceled();
			}
			releaseDocumentSemanticTokens(resultId: string | undefined): void {
			}
		};

		disposables.add(registry.register('testLang', provider));

		const textModel = disposables.add(createTextModel('example', 'testLang'));

		await getDocumentSemanticTokens(registry, textModel, null, null, CancellationToken.None).then((res) => {
			assert.fail();
		}, (err) => {
			assert.ok(!!err);
		});

		disposables.dispose();
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/semanticTokens/test/browser/viewportSemanticTokens.test.ts]---
Location: vscode-main/src/vs/editor/contrib/semanticTokens/test/browser/viewportSemanticTokens.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Barrier, timeout } from '../../../../../base/common/async.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { Emitter } from '../../../../../base/common/event.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { mock } from '../../../../../base/test/common/mock.js';
import { runWithFakedTimers } from '../../../../../base/test/common/timeTravelScheduler.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { Range } from '../../../../common/core/range.js';
import { DocumentRangeSemanticTokensProvider, SemanticTokens, SemanticTokensLegend } from '../../../../common/languages.js';
import { ILanguageService } from '../../../../common/languages/language.js';
import { ITextModel } from '../../../../common/model.js';
import { ILanguageFeatureDebounceService, LanguageFeatureDebounceService } from '../../../../common/services/languageFeatureDebounce.js';
import { ILanguageFeaturesService } from '../../../../common/services/languageFeatures.js';
import { LanguageFeaturesService } from '../../../../common/services/languageFeaturesService.js';
import { LanguageService } from '../../../../common/services/languageService.js';
import { ISemanticTokensStylingService } from '../../../../common/services/semanticTokensStyling.js';
import { SemanticTokensStylingService } from '../../../../common/services/semanticTokensStylingService.js';
import { ViewportSemanticTokensContribution } from '../../browser/viewportSemanticTokens.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { IEnvironmentService } from '../../../../../platform/environment/common/environment.js';
import { NullLogService } from '../../../../../platform/log/common/log.js';
import { ColorScheme } from '../../../../../platform/theme/common/theme.js';
import { IThemeService } from '../../../../../platform/theme/common/themeService.js';
import { TestColorTheme, TestThemeService } from '../../../../../platform/theme/test/common/testThemeService.js';
import { createTextModel } from '../../../../test/common/testTextModel.js';
import { createTestCodeEditor } from '../../../../test/browser/testCodeEditor.js';
import { ServiceCollection } from '../../../../../platform/instantiation/common/serviceCollection.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';

suite('ViewportSemanticTokens', () => {

	const disposables = new DisposableStore();
	let languageService: ILanguageService;
	let languageFeaturesService: ILanguageFeaturesService;
	let serviceCollection: ServiceCollection;

	setup(() => {
		const configService = new TestConfigurationService({ editor: { semanticHighlighting: true } });
		const themeService = new TestThemeService();
		themeService.setTheme(new TestColorTheme({}, ColorScheme.DARK, true));
		languageFeaturesService = new LanguageFeaturesService();
		languageService = disposables.add(new LanguageService(false));

		const logService = new NullLogService();
		const semanticTokensStylingService = new SemanticTokensStylingService(themeService, logService, languageService);
		const envService = new class extends mock<IEnvironmentService>() {
			override isBuilt: boolean = true;
			override isExtensionDevelopment: boolean = false;
		};
		const languageFeatureDebounceService = new LanguageFeatureDebounceService(logService, envService);

		serviceCollection = new ServiceCollection(
			[ILanguageFeaturesService, languageFeaturesService],
			[ILanguageFeatureDebounceService, languageFeatureDebounceService],
			[ISemanticTokensStylingService, semanticTokensStylingService],
			[IThemeService, themeService],
			[IConfigurationService, configService]
		);
	});

	teardown(() => {
		disposables.clear();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('DocumentRangeSemanticTokens provider onDidChange event should trigger refresh', async () => {
		await runWithFakedTimers({}, async () => {

			disposables.add(languageService.registerLanguage({ id: 'testMode' }));

			const inFirstCall = new Barrier();
			const inRefreshCall = new Barrier();

			const emitter = new Emitter<void>();
			let requestCount = 0;
			disposables.add(languageFeaturesService.documentRangeSemanticTokensProvider.register('testMode', new class implements DocumentRangeSemanticTokensProvider {
				onDidChange = emitter.event;
				getLegend(): SemanticTokensLegend {
					return { tokenTypes: ['class'], tokenModifiers: [] };
				}
				async provideDocumentRangeSemanticTokens(model: ITextModel, range: Range, token: CancellationToken): Promise<SemanticTokens | null> {
					requestCount++;
					if (requestCount === 1) {
						inFirstCall.open();
					} else if (requestCount === 2) {
						inRefreshCall.open();
					}
					return {
						data: new Uint32Array([0, 1, 1, 1, 1])
					};
				}
			}));

			const textModel = disposables.add(createTextModel('Hello world', 'testMode'));
			const editor = disposables.add(createTestCodeEditor(textModel, { serviceCollection }));
			const instantiationService = new TestInstantiationService(serviceCollection);
			disposables.add(instantiationService.createInstance(ViewportSemanticTokensContribution, editor));

			textModel.onBeforeAttached();

			await inFirstCall.wait();

			assert.strictEqual(requestCount, 1, 'Initial request should have been made');

			// Make sure no other requests are made for a little while
			await timeout(1000);
			assert.strictEqual(requestCount, 1, 'No additional requests should have been made');

			// Fire the provider's onDidChange event
			emitter.fire();

			await inRefreshCall.wait();

			assert.strictEqual(requestCount, 2, 'Provider onDidChange should trigger a refresh of viewport semantic tokens');
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/smartSelect/browser/bracketSelections.ts]---
Location: vscode-main/src/vs/editor/contrib/smartSelect/browser/bracketSelections.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { LinkedList } from '../../../../base/common/linkedList.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { ITextModel } from '../../../common/model.js';
import { SelectionRange, SelectionRangeProvider } from '../../../common/languages.js';

export class BracketSelectionRangeProvider implements SelectionRangeProvider {

	async provideSelectionRanges(model: ITextModel, positions: Position[]): Promise<SelectionRange[][]> {
		const result: SelectionRange[][] = [];

		for (const position of positions) {
			const bucket: SelectionRange[] = [];
			result.push(bucket);

			const ranges = new Map<string, LinkedList<Range>>();
			await new Promise<void>(resolve => BracketSelectionRangeProvider._bracketsRightYield(resolve, 0, model, position, ranges));
			await new Promise<void>(resolve => BracketSelectionRangeProvider._bracketsLeftYield(resolve, 0, model, position, ranges, bucket));
		}

		return result;
	}

	public static _maxDuration = 30;
	private static readonly _maxRounds = 2;

	private static _bracketsRightYield(resolve: () => void, round: number, model: ITextModel, pos: Position, ranges: Map<string, LinkedList<Range>>): void {
		const counts = new Map<string, number>();
		const t1 = Date.now();
		while (true) {
			if (round >= BracketSelectionRangeProvider._maxRounds) {
				resolve();
				break;
			}
			if (!pos) {
				resolve();
				break;
			}
			const bracket = model.bracketPairs.findNextBracket(pos);
			if (!bracket) {
				resolve();
				break;
			}
			const d = Date.now() - t1;
			if (d > BracketSelectionRangeProvider._maxDuration) {
				setTimeout(() => BracketSelectionRangeProvider._bracketsRightYield(resolve, round + 1, model, pos, ranges));
				break;
			}
			if (bracket.bracketInfo.isOpeningBracket) {
				const key = bracket.bracketInfo.bracketText;
				// wait for closing
				const val = counts.has(key) ? counts.get(key)! : 0;
				counts.set(key, val + 1);
			} else {
				const key = bracket.bracketInfo.getOpeningBrackets()[0].bracketText;
				// process closing
				let val = counts.has(key) ? counts.get(key)! : 0;
				val -= 1;
				counts.set(key, Math.max(0, val));
				if (val < 0) {
					let list = ranges.get(key);
					if (!list) {
						list = new LinkedList();
						ranges.set(key, list);
					}
					list.push(bracket.range);
				}
			}
			pos = bracket.range.getEndPosition();
		}
	}

	private static _bracketsLeftYield(resolve: () => void, round: number, model: ITextModel, pos: Position, ranges: Map<string, LinkedList<Range>>, bucket: SelectionRange[]): void {
		const counts = new Map<string, number>();
		const t1 = Date.now();
		while (true) {
			if (round >= BracketSelectionRangeProvider._maxRounds && ranges.size === 0) {
				resolve();
				break;
			}
			if (!pos) {
				resolve();
				break;
			}
			const bracket = model.bracketPairs.findPrevBracket(pos);
			if (!bracket) {
				resolve();
				break;
			}
			const d = Date.now() - t1;
			if (d > BracketSelectionRangeProvider._maxDuration) {
				setTimeout(() => BracketSelectionRangeProvider._bracketsLeftYield(resolve, round + 1, model, pos, ranges, bucket));
				break;
			}
			if (!bracket.bracketInfo.isOpeningBracket) {
				const key = bracket.bracketInfo.getOpeningBrackets()[0].bracketText;
				// wait for opening
				const val = counts.has(key) ? counts.get(key)! : 0;
				counts.set(key, val + 1);
			} else {
				const key = bracket.bracketInfo.bracketText;
				// opening
				let val = counts.has(key) ? counts.get(key)! : 0;
				val -= 1;
				counts.set(key, Math.max(0, val));
				if (val < 0) {
					const list = ranges.get(key);
					if (list) {
						const closing = list.shift();
						if (list.size === 0) {
							ranges.delete(key);
						}
						const innerBracket = Range.fromPositions(bracket.range.getEndPosition(), closing!.getStartPosition());
						const outerBracket = Range.fromPositions(bracket.range.getStartPosition(), closing!.getEndPosition());
						bucket.push({ range: innerBracket });
						bucket.push({ range: outerBracket });
						BracketSelectionRangeProvider._addBracketLeading(model, outerBracket, bucket);
					}
				}
			}
			pos = bracket.range.getStartPosition();
		}
	}

	private static _addBracketLeading(model: ITextModel, bracket: Range, bucket: SelectionRange[]): void {
		if (bracket.startLineNumber === bracket.endLineNumber) {
			return;
		}
		// xxxxxxxx {
		//
		// }
		const startLine = bracket.startLineNumber;
		const column = model.getLineFirstNonWhitespaceColumn(startLine);
		if (column !== 0 && column !== bracket.startColumn) {
			bucket.push({ range: Range.fromPositions(new Position(startLine, column), bracket.getEndPosition()) });
			bucket.push({ range: Range.fromPositions(new Position(startLine, 1), bracket.getEndPosition()) });
		}

		// xxxxxxxx
		// {
		//
		// }
		const aboveLine = startLine - 1;
		if (aboveLine > 0) {
			const column = model.getLineFirstNonWhitespaceColumn(aboveLine);
			if (column === bracket.startColumn && column !== model.getLineLastNonWhitespaceColumn(aboveLine)) {
				bucket.push({ range: Range.fromPositions(new Position(aboveLine, column), bracket.getEndPosition()) });
				bucket.push({ range: Range.fromPositions(new Position(aboveLine, 1), bracket.getEndPosition()) });
			}
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/smartSelect/browser/smartSelect.ts]---
Location: vscode-main/src/vs/editor/contrib/smartSelect/browser/smartSelect.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as arrays from '../../../../base/common/arrays.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { onUnexpectedExternalError } from '../../../../base/common/errors.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { EditorAction, EditorContributionInstantiation, IActionOptions, registerEditorAction, registerEditorContribution, ServicesAccessor } from '../../../browser/editorExtensions.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { Selection } from '../../../common/core/selection.js';
import { IEditorContribution } from '../../../common/editorCommon.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import { ITextModel } from '../../../common/model.js';
import * as languages from '../../../common/languages.js';
import { BracketSelectionRangeProvider } from './bracketSelections.js';
import { WordSelectionRangeProvider } from './wordSelections.js';
import * as nls from '../../../../nls.js';
import { MenuId } from '../../../../platform/actions/common/actions.js';
import { CommandsRegistry } from '../../../../platform/commands/common/commands.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { LanguageFeatureRegistry } from '../../../common/languageFeatureRegistry.js';
import { ITextModelService } from '../../../common/services/resolverService.js';
import { assertType, isArrayOf } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';

class SelectionRanges {

	constructor(
		readonly index: number,
		readonly ranges: Range[]
	) { }

	mov(fwd: boolean): SelectionRanges {
		const index = this.index + (fwd ? 1 : -1);
		if (index < 0 || index >= this.ranges.length) {
			return this;
		}
		const res = new SelectionRanges(index, this.ranges);
		if (res.ranges[index].equalsRange(this.ranges[this.index])) {
			// next range equals this range, retry with next-next
			return res.mov(fwd);
		}
		return res;
	}
}

export class SmartSelectController implements IEditorContribution {

	static readonly ID = 'editor.contrib.smartSelectController';

	static get(editor: ICodeEditor): SmartSelectController | null {
		return editor.getContribution<SmartSelectController>(SmartSelectController.ID);
	}

	private _state?: SelectionRanges[];
	private _selectionListener?: IDisposable;
	private _ignoreSelection: boolean = false;

	constructor(
		private readonly _editor: ICodeEditor,
		@ILanguageFeaturesService private readonly _languageFeaturesService: ILanguageFeaturesService,
	) { }

	dispose(): void {
		this._selectionListener?.dispose();
	}

	async run(forward: boolean): Promise<void> {
		if (!this._editor.hasModel()) {
			return;
		}

		const selections = this._editor.getSelections();
		const model = this._editor.getModel();

		if (!this._state) {

			await provideSelectionRanges(this._languageFeaturesService.selectionRangeProvider, model, selections.map(s => s.getPosition()), this._editor.getOption(EditorOption.smartSelect), CancellationToken.None).then(ranges => {
				if (!arrays.isNonEmptyArray(ranges) || ranges.length !== selections.length) {
					// invalid result
					return;
				}
				if (!this._editor.hasModel() || !arrays.equals(this._editor.getSelections(), selections, (a, b) => a.equalsSelection(b))) {
					// invalid editor state
					return;
				}

				for (let i = 0; i < ranges.length; i++) {
					ranges[i] = ranges[i].filter(range => {
						// filter ranges inside the selection
						return range.containsPosition(selections[i].getStartPosition()) && range.containsPosition(selections[i].getEndPosition());
					});
					// prepend current selection
					ranges[i].unshift(selections[i]);
				}


				this._state = ranges.map(ranges => new SelectionRanges(0, ranges));

				// listen to caret move and forget about state
				this._selectionListener?.dispose();
				this._selectionListener = this._editor.onDidChangeCursorPosition(() => {
					if (!this._ignoreSelection) {
						this._selectionListener?.dispose();
						this._state = undefined;
					}
				});
			});
		}

		if (!this._state) {
			// no state
			return;
		}
		this._state = this._state.map(state => state.mov(forward));
		const newSelections = this._state.map(state => Selection.fromPositions(state.ranges[state.index].getStartPosition(), state.ranges[state.index].getEndPosition()));
		this._ignoreSelection = true;
		try {
			this._editor.setSelections(newSelections);
		} finally {
			this._ignoreSelection = false;
		}
	}
}

abstract class AbstractSmartSelect extends EditorAction {

	private readonly _forward: boolean;

	constructor(forward: boolean, opts: IActionOptions) {
		super(opts);
		this._forward = forward;
	}

	async run(_accessor: ServicesAccessor, editor: ICodeEditor): Promise<void> {
		const controller = SmartSelectController.get(editor);
		if (controller) {
			await controller.run(this._forward);
		}
	}
}

class GrowSelectionAction extends AbstractSmartSelect {
	constructor() {
		super(true, {
			id: 'editor.action.smartSelect.expand',
			label: nls.localize2('smartSelect.expand', "Expand Selection"),
			precondition: undefined,
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyMod.Shift | KeyMod.Alt | KeyCode.RightArrow,
				mac: {
					primary: KeyMod.CtrlCmd | KeyMod.WinCtrl | KeyMod.Shift | KeyCode.RightArrow,
					secondary: [KeyMod.WinCtrl | KeyMod.Shift | KeyCode.RightArrow],
				},
				weight: KeybindingWeight.EditorContrib
			},
			menuOpts: {
				menuId: MenuId.MenubarSelectionMenu,
				group: '1_basic',
				title: nls.localize({ key: 'miSmartSelectGrow', comment: ['&& denotes a mnemonic'] }, "&&Expand Selection"),
				order: 2
			}
		});
	}
}

// renamed command id
CommandsRegistry.registerCommandAlias('editor.action.smartSelect.grow', 'editor.action.smartSelect.expand');

class ShrinkSelectionAction extends AbstractSmartSelect {
	constructor() {
		super(false, {
			id: 'editor.action.smartSelect.shrink',
			label: nls.localize2('smartSelect.shrink', "Shrink Selection"),
			precondition: undefined,
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyMod.Shift | KeyMod.Alt | KeyCode.LeftArrow,
				mac: {
					primary: KeyMod.CtrlCmd | KeyMod.WinCtrl | KeyMod.Shift | KeyCode.LeftArrow,
					secondary: [KeyMod.WinCtrl | KeyMod.Shift | KeyCode.LeftArrow],
				},
				weight: KeybindingWeight.EditorContrib
			},
			menuOpts: {
				menuId: MenuId.MenubarSelectionMenu,
				group: '1_basic',
				title: nls.localize({ key: 'miSmartSelectShrink', comment: ['&& denotes a mnemonic'] }, "&&Shrink Selection"),
				order: 3
			}
		});
	}
}

registerEditorContribution(SmartSelectController.ID, SmartSelectController, EditorContributionInstantiation.Lazy);
registerEditorAction(GrowSelectionAction);
registerEditorAction(ShrinkSelectionAction);

export interface SelectionRangesOptions {
	selectLeadingAndTrailingWhitespace: boolean;
	selectSubwords: boolean;
}

export async function provideSelectionRanges(registry: LanguageFeatureRegistry<languages.SelectionRangeProvider>, model: ITextModel, positions: Position[], options: SelectionRangesOptions, token: CancellationToken): Promise<Range[][]> {

	const providers = registry.all(model)
		.concat(new WordSelectionRangeProvider(options.selectSubwords)); // ALWAYS have word based selection range

	if (providers.length === 1) {
		// add word selection and bracket selection when no provider exists
		providers.unshift(new BracketSelectionRangeProvider());
	}

	const work: Promise<any>[] = [];
	const allRawRanges: Range[][] = [];

	for (const provider of providers) {

		work.push(Promise.resolve(provider.provideSelectionRanges(model, positions, token)).then(allProviderRanges => {
			if (arrays.isNonEmptyArray(allProviderRanges) && allProviderRanges.length === positions.length) {
				for (let i = 0; i < positions.length; i++) {
					if (!allRawRanges[i]) {
						allRawRanges[i] = [];
					}
					for (const oneProviderRanges of allProviderRanges[i]) {
						if (Range.isIRange(oneProviderRanges.range) && Range.containsPosition(oneProviderRanges.range, positions[i])) {
							allRawRanges[i].push(Range.lift(oneProviderRanges.range));
						}
					}
				}
			}
		}, onUnexpectedExternalError));
	}

	await Promise.all(work);

	return allRawRanges.map(oneRawRanges => {

		if (oneRawRanges.length === 0) {
			return [];
		}

		// sort all by start/end position
		oneRawRanges.sort((a, b) => {
			if (Position.isBefore(a.getStartPosition(), b.getStartPosition())) {
				return 1;
			} else if (Position.isBefore(b.getStartPosition(), a.getStartPosition())) {
				return -1;
			} else if (Position.isBefore(a.getEndPosition(), b.getEndPosition())) {
				return -1;
			} else if (Position.isBefore(b.getEndPosition(), a.getEndPosition())) {
				return 1;
			} else {
				return 0;
			}
		});

		// remove ranges that don't contain the former range or that are equal to the
		// former range
		const oneRanges: Range[] = [];
		let last: Range | undefined;
		for (const range of oneRawRanges) {
			if (!last || (Range.containsRange(range, last) && !Range.equalsRange(range, last))) {
				oneRanges.push(range);
				last = range;
			}
		}

		if (!options.selectLeadingAndTrailingWhitespace) {
			return oneRanges;
		}

		// add ranges that expand trivia at line starts and ends whenever a range
		// wraps onto the a new line
		const oneRangesWithTrivia: Range[] = [oneRanges[0]];
		for (let i = 1; i < oneRanges.length; i++) {
			const prev = oneRanges[i - 1];
			const cur = oneRanges[i];
			if (cur.startLineNumber !== prev.startLineNumber || cur.endLineNumber !== prev.endLineNumber) {
				// add line/block range without leading/failing whitespace
				const rangeNoWhitespace = new Range(prev.startLineNumber, model.getLineFirstNonWhitespaceColumn(prev.startLineNumber), prev.endLineNumber, model.getLineLastNonWhitespaceColumn(prev.endLineNumber));
				if (rangeNoWhitespace.containsRange(prev) && !rangeNoWhitespace.equalsRange(prev) && cur.containsRange(rangeNoWhitespace) && !cur.equalsRange(rangeNoWhitespace)) {
					oneRangesWithTrivia.push(rangeNoWhitespace);
				}
				// add line/block range
				const rangeFull = new Range(prev.startLineNumber, 1, prev.endLineNumber, model.getLineMaxColumn(prev.endLineNumber));
				if (rangeFull.containsRange(prev) && !rangeFull.equalsRange(rangeNoWhitespace) && cur.containsRange(rangeFull) && !cur.equalsRange(rangeFull)) {
					oneRangesWithTrivia.push(rangeFull);
				}
			}
			oneRangesWithTrivia.push(cur);
		}
		return oneRangesWithTrivia;
	});
}


CommandsRegistry.registerCommand('_executeSelectionRangeProvider', async function (accessor, ...args) {

	const [resource, positions] = args;
	assertType(URI.isUri(resource));
	assertType(isArrayOf(positions, p => Position.isIPosition(p)));

	const registry = accessor.get(ILanguageFeaturesService).selectionRangeProvider;
	const reference = await accessor.get(ITextModelService).createModelReference(resource);

	try {
		return provideSelectionRanges(registry, reference.object.textEditorModel, positions.map(Position.lift), { selectLeadingAndTrailingWhitespace: true, selectSubwords: true }, CancellationToken.None);
	} finally {
		reference.dispose();
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/smartSelect/browser/wordSelections.ts]---
Location: vscode-main/src/vs/editor/contrib/smartSelect/browser/wordSelections.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CharCode } from '../../../../base/common/charCode.js';
import { isLowerAsciiLetter, isUpperAsciiLetter } from '../../../../base/common/strings.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { ITextModel } from '../../../common/model.js';
import { SelectionRange, SelectionRangeProvider } from '../../../common/languages.js';

export class WordSelectionRangeProvider implements SelectionRangeProvider {

	constructor(private readonly selectSubwords = true) { }

	provideSelectionRanges(model: ITextModel, positions: Position[]): SelectionRange[][] {
		const result: SelectionRange[][] = [];
		for (const position of positions) {
			const bucket: SelectionRange[] = [];
			result.push(bucket);
			if (this.selectSubwords) {
				this._addInWordRanges(bucket, model, position);
			}
			this._addWordRanges(bucket, model, position);
			this._addWhitespaceLine(bucket, model, position);
			bucket.push({ range: model.getFullModelRange() });
		}
		return result;
	}

	private _addInWordRanges(bucket: SelectionRange[], model: ITextModel, pos: Position): void {
		const obj = model.getWordAtPosition(pos);
		if (!obj) {
			return;
		}

		const { word, startColumn } = obj;
		const offset = pos.column - startColumn;
		let start = offset;
		let end = offset;
		let lastCh: number = 0;

		// LEFT anchor (start)
		for (; start >= 0; start--) {
			const ch = word.charCodeAt(start);
			if ((start !== offset) && (ch === CharCode.Underline || ch === CharCode.Dash)) {
				// foo-bar OR foo_bar
				break;
			} else if (isLowerAsciiLetter(ch) && isUpperAsciiLetter(lastCh)) {
				// fooBar
				break;
			}
			lastCh = ch;
		}
		start += 1;

		// RIGHT anchor (end)
		for (; end < word.length; end++) {
			const ch = word.charCodeAt(end);
			if (isUpperAsciiLetter(ch) && isLowerAsciiLetter(lastCh)) {
				// fooBar
				break;
			} else if (ch === CharCode.Underline || ch === CharCode.Dash) {
				// foo-bar OR foo_bar
				break;
			}
			lastCh = ch;
		}

		if (start < end) {
			bucket.push({ range: new Range(pos.lineNumber, startColumn + start, pos.lineNumber, startColumn + end) });
		}
	}

	private _addWordRanges(bucket: SelectionRange[], model: ITextModel, pos: Position): void {
		const word = model.getWordAtPosition(pos);
		if (word) {
			bucket.push({ range: new Range(pos.lineNumber, word.startColumn, pos.lineNumber, word.endColumn) });
		}
	}

	private _addWhitespaceLine(bucket: SelectionRange[], model: ITextModel, pos: Position): void {
		if (model.getLineLength(pos.lineNumber) > 0
			&& model.getLineFirstNonWhitespaceColumn(pos.lineNumber) === 0
			&& model.getLineLastNonWhitespaceColumn(pos.lineNumber) === 0
		) {
			bucket.push({ range: new Range(pos.lineNumber, 1, pos.lineNumber, model.getLineMaxColumn(pos.lineNumber)) });
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/smartSelect/test/browser/smartSelect.test.ts]---
Location: vscode-main/src/vs/editor/contrib/smartSelect/test/browser/smartSelect.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { Event } from '../../../../../base/common/event.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { URI } from '../../../../../base/common/uri.js';
import { Position } from '../../../../common/core/position.js';
import { IRange, Range } from '../../../../common/core/range.js';
import { SelectionRangeProvider } from '../../../../common/languages.js';
import { ILanguageConfigurationService } from '../../../../common/languages/languageConfigurationRegistry.js';
import { IModelService } from '../../../../common/services/model.js';
import { BracketSelectionRangeProvider } from '../../browser/bracketSelections.js';
import { provideSelectionRanges } from '../../browser/smartSelect.js';
import { WordSelectionRangeProvider } from '../../browser/wordSelections.js';
import { createModelServices } from '../../../../test/common/testTextModel.js';
import { javascriptOnEnterRules } from '../../../../test/common/modes/supports/onEnterRules.js';
import { LanguageFeatureRegistry } from '../../../../common/languageFeatureRegistry.js';
import { ILanguageSelection, ILanguageService } from '../../../../common/languages/language.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';

class StaticLanguageSelector implements ILanguageSelection {
	readonly onDidChange: Event<string> = Event.None;
	constructor(public readonly languageId: string) { }
}

suite('SmartSelect', () => {

	const OriginalBracketSelectionRangeProviderMaxDuration = BracketSelectionRangeProvider._maxDuration;

	suiteSetup(() => {
		BracketSelectionRangeProvider._maxDuration = 5000; // 5 seconds
	});

	suiteTeardown(() => {
		BracketSelectionRangeProvider._maxDuration = OriginalBracketSelectionRangeProviderMaxDuration;
	});

	const languageId = 'mockJSMode';
	let disposables: DisposableStore;
	let modelService: IModelService;
	const providers = new LanguageFeatureRegistry<SelectionRangeProvider>();

	setup(() => {
		disposables = new DisposableStore();
		const instantiationService = createModelServices(disposables);
		modelService = instantiationService.get(IModelService);
		const languagConfigurationService = instantiationService.get(ILanguageConfigurationService);
		const languageService = instantiationService.get(ILanguageService);
		disposables.add(languageService.registerLanguage({ id: languageId }));
		disposables.add(languagConfigurationService.register(languageId, {
			brackets: [
				['(', ')'],
				['{', '}'],
				['[', ']']
			],
			onEnterRules: javascriptOnEnterRules,
			wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\#\$\%\^\&\*\(\)\=\+\[\{\]\}\\\;\:\'\"\,\.\<\>\/\?\s]+)/g
		}));
	});

	teardown(() => {
		disposables.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	async function assertGetRangesToPosition(text: string[], lineNumber: number, column: number, ranges: Range[], selectLeadingAndTrailingWhitespace = true): Promise<void> {
		const uri = URI.file('test.js');
		const model = modelService.createModel(text.join('\n'), new StaticLanguageSelector(languageId), uri);
		const [actual] = await provideSelectionRanges(providers, model, [new Position(lineNumber, column)], { selectLeadingAndTrailingWhitespace, selectSubwords: true }, CancellationToken.None);
		const actualStr = actual.map(r => new Range(r.startLineNumber, r.startColumn, r.endLineNumber, r.endColumn).toString());
		const desiredStr = ranges.reverse().map(r => String(r));

		assert.deepStrictEqual(actualStr, desiredStr, `\nA: ${actualStr} VS \nE: ${desiredStr}`);
		modelService.destroyModel(uri);
	}

	test('getRangesToPosition #1', () => {

		return assertGetRangesToPosition([
			'function a(bar, foo){',
			'\tif (bar) {',
			'\t\treturn (bar + (2 * foo))',
			'\t}',
			'}'
		], 3, 20, [
			new Range(1, 1, 5, 2), // all
			new Range(1, 21, 5, 2), // {} outside
			new Range(1, 22, 5, 1), // {} inside
			new Range(2, 1, 4, 3), // block
			new Range(2, 1, 4, 3),
			new Range(2, 2, 4, 3),
			new Range(2, 11, 4, 3),
			new Range(2, 12, 4, 2),
			new Range(3, 1, 3, 27), // line w/ triva
			new Range(3, 3, 3, 27), // line w/o triva
			new Range(3, 10, 3, 27), // () outside
			new Range(3, 11, 3, 26), // () inside
			new Range(3, 17, 3, 26), // () outside
			new Range(3, 18, 3, 25), // () inside
		]);
	});

	test('config: selectLeadingAndTrailingWhitespace', async () => {

		await assertGetRangesToPosition([
			'aaa',
			'\tbbb',
			''
		], 2, 3, [
			new Range(1, 1, 3, 1), // all
			new Range(2, 1, 2, 5), // line w/ triva
			new Range(2, 2, 2, 5), // bbb
		], true);

		await assertGetRangesToPosition([
			'aaa',
			'\tbbb',
			''
		], 2, 3, [
			new Range(1, 1, 3, 1), // all
			new Range(2, 2, 2, 5), // () inside
		], false);
	});

	test('getRangesToPosition #56886. Skip empty lines correctly.', () => {

		return assertGetRangesToPosition([
			'function a(bar, foo){',
			'\tif (bar) {',
			'',
			'\t}',
			'}'
		], 3, 1, [
			new Range(1, 1, 5, 2),
			new Range(1, 21, 5, 2),
			new Range(1, 22, 5, 1),
			new Range(2, 1, 4, 3),
			new Range(2, 1, 4, 3),
			new Range(2, 2, 4, 3),
			new Range(2, 11, 4, 3),
			new Range(2, 12, 4, 2),
		]);
	});

	test('getRangesToPosition #56886. Do not skip lines with only whitespaces.', () => {

		return assertGetRangesToPosition([
			'function a(bar, foo){',
			'\tif (bar) {',
			' ',
			'\t}',
			'}'
		], 3, 1, [
			new Range(1, 1, 5, 2), // all
			new Range(1, 21, 5, 2), // {} outside
			new Range(1, 22, 5, 1), // {} inside
			new Range(2, 1, 4, 3),
			new Range(2, 1, 4, 3),
			new Range(2, 2, 4, 3),
			new Range(2, 11, 4, 3),
			new Range(2, 12, 4, 2),
			new Range(3, 1, 3, 2), // block
			new Range(3, 1, 3, 2) // empty line
		]);
	});

	test('getRangesToPosition #40658. Cursor at first position inside brackets should select line inside.', () => {

		return assertGetRangesToPosition([
			' [ ]',
			' { } ',
			'( ) '
		], 2, 3, [
			new Range(1, 1, 3, 5),
			new Range(2, 1, 2, 6), // line w/ triava
			new Range(2, 2, 2, 5), // {} inside, line w/o triva
			new Range(2, 3, 2, 4) // {} inside
		]);
	});

	test('getRangesToPosition #40658. Cursor in empty brackets should reveal brackets first.', () => {

		return assertGetRangesToPosition([
			' [] ',
			' { } ',
			'  ( ) '
		], 1, 3, [
			new Range(1, 1, 3, 7), // all
			new Range(1, 1, 1, 5), // line w/ trival
			new Range(1, 2, 1, 4), // [] outside, line w/o trival
			new Range(1, 3, 1, 3), // [] inside
		]);
	});

	test('getRangesToPosition #40658. Tokens before bracket will be revealed first.', () => {

		return assertGetRangesToPosition([
			'  [] ',
			' { } ',
			'selectthis( ) '
		], 3, 11, [
			new Range(1, 1, 3, 15), // all
			new Range(3, 1, 3, 15), // line w/ trivia
			new Range(3, 1, 3, 14), // line w/o trivia
			new Range(3, 1, 3, 11) // word
		]);
	});

	// -- bracket selections

	async function assertRanges(provider: SelectionRangeProvider, value: string, ...expected: IRange[]): Promise<void> {
		const index = value.indexOf('|');
		value = value.replace('|', ''); // CodeQL [SM02383] js/incomplete-sanitization this is purpose only the first | character

		const model = modelService.createModel(value, new StaticLanguageSelector(languageId), URI.parse('fake:lang'));
		const pos = model.getPositionAt(index);
		const all = await provider.provideSelectionRanges(model, [pos], CancellationToken.None);
		const ranges = all![0];

		modelService.destroyModel(model.uri);

		assert.strictEqual(expected.length, ranges.length);
		for (const range of ranges) {
			const exp = expected.shift() || null;
			assert.ok(Range.equalsRange(range.range, exp), `A=${range.range} <> E=${exp}`);
		}
	}

	test('bracket selection', async () => {
		await assertRanges(new BracketSelectionRangeProvider(), '(|)',
			new Range(1, 2, 1, 2), new Range(1, 1, 1, 3)
		);

		await assertRanges(new BracketSelectionRangeProvider(), '[[[](|)]]',
			new Range(1, 6, 1, 6), new Range(1, 5, 1, 7), // ()
			new Range(1, 3, 1, 7), new Range(1, 2, 1, 8), // [[]()]
			new Range(1, 2, 1, 8), new Range(1, 1, 1, 9), // [[[]()]]
		);

		await assertRanges(new BracketSelectionRangeProvider(), '[a[](|)a]',
			new Range(1, 6, 1, 6), new Range(1, 5, 1, 7),
			new Range(1, 2, 1, 8), new Range(1, 1, 1, 9),
		);

		// no bracket
		await assertRanges(new BracketSelectionRangeProvider(), 'fofof|fofo');

		// empty
		await assertRanges(new BracketSelectionRangeProvider(), '[[[]()]]|');
		await assertRanges(new BracketSelectionRangeProvider(), '|[[[]()]]');

		// edge
		await assertRanges(new BracketSelectionRangeProvider(), '[|[[]()]]', new Range(1, 2, 1, 8), new Range(1, 1, 1, 9));
		await assertRanges(new BracketSelectionRangeProvider(), '[[[]()]|]', new Range(1, 2, 1, 8), new Range(1, 1, 1, 9));

		await assertRanges(new BracketSelectionRangeProvider(), 'aaa(aaa)bbb(b|b)ccc(ccc)', new Range(1, 13, 1, 15), new Range(1, 12, 1, 16));
		await assertRanges(new BracketSelectionRangeProvider(), '(aaa(aaa)bbb(b|b)ccc(ccc))', new Range(1, 14, 1, 16), new Range(1, 13, 1, 17), new Range(1, 2, 1, 25), new Range(1, 1, 1, 26));
	});

	test('bracket with leading/trailing', async () => {

		await assertRanges(new BracketSelectionRangeProvider(), 'for(a of b){\n  foo(|);\n}',
			new Range(2, 7, 2, 7), new Range(2, 6, 2, 8),
			new Range(1, 13, 3, 1), new Range(1, 12, 3, 2),
			new Range(1, 1, 3, 2), new Range(1, 1, 3, 2),
		);

		await assertRanges(new BracketSelectionRangeProvider(), 'for(a of b)\n{\n  foo(|);\n}',
			new Range(3, 7, 3, 7), new Range(3, 6, 3, 8),
			new Range(2, 2, 4, 1), new Range(2, 1, 4, 2),
			new Range(1, 1, 4, 2), new Range(1, 1, 4, 2),
		);
	});

	test('in-word ranges', async () => {

		await assertRanges(new WordSelectionRangeProvider(), 'f|ooBar',
			new Range(1, 1, 1, 4), // foo
			new Range(1, 1, 1, 7), // fooBar
			new Range(1, 1, 1, 7), // doc
		);

		await assertRanges(new WordSelectionRangeProvider(), 'f|oo_Ba',
			new Range(1, 1, 1, 4),
			new Range(1, 1, 1, 7),
			new Range(1, 1, 1, 7),
		);

		await assertRanges(new WordSelectionRangeProvider(), 'f|oo-Ba',
			new Range(1, 1, 1, 4),
			new Range(1, 1, 1, 7),
			new Range(1, 1, 1, 7),
		);
	});

	test('in-word ranges with selectSubwords=false', async () => {

		await assertRanges(new WordSelectionRangeProvider(false), 'f|ooBar',
			new Range(1, 1, 1, 7),
			new Range(1, 1, 1, 7),
		);

		await assertRanges(new WordSelectionRangeProvider(false), 'f|oo_Ba',
			new Range(1, 1, 1, 7),
			new Range(1, 1, 1, 7),
		);

		await assertRanges(new WordSelectionRangeProvider(false), 'f|oo-Ba',
			new Range(1, 1, 1, 7),
			new Range(1, 1, 1, 7),
		);
	});

	test('Default selection should select current word/hump first in camelCase #67493', async function () {

		await assertRanges(new WordSelectionRangeProvider(), 'Abs|tractSmartSelect',
			new Range(1, 1, 1, 9),
			new Range(1, 1, 1, 20),
			new Range(1, 1, 1, 20),
		);

		await assertRanges(new WordSelectionRangeProvider(), 'AbstractSma|rtSelect',
			new Range(1, 9, 1, 14),
			new Range(1, 1, 1, 20),
			new Range(1, 1, 1, 20),
		);

		await assertRanges(new WordSelectionRangeProvider(), 'Abstrac-Sma|rt-elect',
			new Range(1, 9, 1, 14),
			new Range(1, 1, 1, 20),
			new Range(1, 1, 1, 20),
		);

		await assertRanges(new WordSelectionRangeProvider(), 'Abstrac_Sma|rt_elect',
			new Range(1, 9, 1, 14),
			new Range(1, 1, 1, 20),
			new Range(1, 1, 1, 20),
		);

		await assertRanges(new WordSelectionRangeProvider(), 'Abstrac_Sma|rt-elect',
			new Range(1, 9, 1, 14),
			new Range(1, 1, 1, 20),
			new Range(1, 1, 1, 20),
		);

		await assertRanges(new WordSelectionRangeProvider(), 'Abstrac_Sma|rtSelect',
			new Range(1, 9, 1, 14),
			new Range(1, 1, 1, 20),
			new Range(1, 1, 1, 20),
		);
	});

	test('Smart select: only add line ranges if they\'re contained by the next range #73850', async function () {

		const reg = providers.register('*', {
			provideSelectionRanges() {
				return [[
					{ range: { startLineNumber: 1, startColumn: 10, endLineNumber: 1, endColumn: 11 } },
					{ range: { startLineNumber: 1, startColumn: 10, endLineNumber: 3, endColumn: 2 } },
					{ range: { startLineNumber: 1, startColumn: 1, endLineNumber: 3, endColumn: 2 } },
				]];
			}
		});

		await assertGetRangesToPosition(['type T = {', '\tx: number', '}'], 1, 10, [
			new Range(1, 1, 3, 2), // all
			new Range(1, 10, 3, 2), // { ... }
			new Range(1, 10, 1, 11), // {
		]);

		reg.dispose();
	});

	test('Expand selection in words with underscores is inconsistent #90589', async function () {

		await assertRanges(new WordSelectionRangeProvider(), 'Hel|lo_World',
			new Range(1, 1, 1, 6),
			new Range(1, 1, 1, 12),
			new Range(1, 1, 1, 12),
		);

		await assertRanges(new WordSelectionRangeProvider(), 'Hello_Wo|rld',
			new Range(1, 7, 1, 12),
			new Range(1, 1, 1, 12),
			new Range(1, 1, 1, 12),
		);

		await assertRanges(new WordSelectionRangeProvider(), 'Hello|_World',
			new Range(1, 1, 1, 6),
			new Range(1, 1, 1, 12),
			new Range(1, 1, 1, 12),
		);

		await assertRanges(new WordSelectionRangeProvider(), 'Hello_|World',
			new Range(1, 7, 1, 12),
			new Range(1, 1, 1, 12),
			new Range(1, 1, 1, 12),
		);

		await assertRanges(new WordSelectionRangeProvider(), 'Hello|-World',
			new Range(1, 1, 1, 6),
			new Range(1, 1, 1, 12),
			new Range(1, 1, 1, 12),
		);

		await assertRanges(new WordSelectionRangeProvider(), 'Hello-|World',
			new Range(1, 7, 1, 12),
			new Range(1, 1, 1, 12),
			new Range(1, 1, 1, 12),
		);

		await assertRanges(new WordSelectionRangeProvider(), 'Hello|World',
			new Range(1, 6, 1, 11),
			new Range(1, 1, 1, 11),
			new Range(1, 1, 1, 11),
		);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/snippet/browser/snippet.md]---
Location: vscode-main/src/vs/editor/contrib/snippet/browser/snippet.md

```markdown

Tabstops
--

With tabstops you can make the editor cursor move inside a snippet. Use `$1`, `$2` to specify cursor locations. The number is the order in which tabstops will be visited, whereas `$0` denotes the final cursor position. Multiple tabstops are linked and updated in sync.

Placeholders
--

Placeholders are tabstops with values, like `${1:foo}`. The placeholder text will be inserted and selected such that it can be easily changed. Placeholders can nested, like `${1:another ${2:placeholder}}`.

Choice
--

Placeholders can have choices as values. The syntax is a comma-separated enumeration of values, enclosed with the pipe-character, e.g. `${1|one,two,three|}`. When inserted and selected choices will prompt the user to pick one of the values.

Variables
--

With `$name` or `${name:default}` you can insert the value of a variable. When a variable isn't set its *default* or the empty string is inserted. When a variable is unknown (that is, its name isn't defined) the name of the variable is inserted and it is transformed into a placeholder. The following variables can be used:

* `TM_SELECTED_TEXT` The currently selected text or the empty string
* `TM_CURRENT_LINE` The contents of the current line
* `TM_CURRENT_WORD` The contents of the word under cursor or the empty string
* `TM_LINE_INDEX` The zero-index based line number
* `TM_LINE_NUMBER` The one-index based line number
* `TM_FILENAME` The filename of the current document
* `TM_FILENAME_BASE` The filename of the current document without its extensions
* `TM_DIRECTORY` The directory of the current document
* `TM_DIRECTORY_BASE` The base directory name of the current document
* `TM_FILEPATH` The full file path of the current document
* `RELATIVE_FILEPATH` The relative (to the opened workspace or folder) file path of the current document
* `CLIPBOARD` The contents of your clipboard
* `WORKSPACE_NAME` The name of the opened workspace or folder
* `WORKSPACE_FOLDER` The path of the opened workspace or folder

For inserting the current date and time:

* `CURRENT_YEAR` The current year
* `CURRENT_YEAR_SHORT` The current year's last two digits
* `CURRENT_MONTH` The month as two digits (example '02')
* `CURRENT_MONTH_NAME` The full name of the month (example 'July')
* `CURRENT_MONTH_NAME_SHORT` The short name of the month (example 'Jul')
* `CURRENT_DATE` The day of the month
* `CURRENT_DAY_NAME` The name of day (example 'Monday')
* `CURRENT_DAY_NAME_SHORT` The short name of the day (example 'Mon')
* `CURRENT_HOUR` The current hour in 24-hour clock format
* `CURRENT_MINUTE` The current minute
* `CURRENT_SECOND` The current second
* `CURRENT_SECONDS_UNIX` The number of seconds since the Unix epoch

For inserting random values:

* `RANDOM` 6 random Base-10 digits
* `RANDOM_HEX` 6 random Base-16 digits
* `UUID` A Version 4 UUID

Variable-Transform
--

Transformations allow to modify the value of a variable before it is being inserted. The definition of a transformation consists of three parts:

1. A regular expression that is matched against the value of a variable, or the empty string when the variable cannot be resolved.
2. A "format string" that allows to reference matching groups from the regular expression. The format string allows for conditional inserts and simple modifications.
3. Options that are passed to the regular expression

The following sample inserts the name of the current file without its ending, so from `foo.txt` it makes `foo`.

```
${TM_FILENAME/(.*)\..+$/$1/}
  |           |         | |
  |           |         | |-> no options
  |           |         |
  |           |         |-> references the contents of the first
  |           |             capture group
  |           |
  |           |-> regex to capture everything before
  |               the final `.suffix`
  |
  |-> resolves to the filename
```

Placeholder-Transform
--

Like a Variable-Transform, a transformation of a placeholder allows changing the inserted text for the placeholder when moving to the next tab stop.
The inserted text is matched with the regular expression and the match or matches - depending on the options - are replaced with the specified replacement format text.
Every occurrence of a placeholder can define its own transformation independently using the value of the first placeholder.
The format for Placeholder-Transforms is the same as for Variable-Transforms.

The following sample removes an underscore at the beginning of the text. `_transform` becomes `transform`.

```
${1/^_(.*)/$1/}
  |   |    |  |-> No options
  |   |    |
  |   |    |-> Replace it with the first capture group
  |   |
  |   |-> Regular expression to capture everything after the underscore
  |
  |-> Placeholder Index
```

Grammar
--

Below is the EBNF for snippets.

```
any         ::= tabstop | placeholder | choice | variable | text
tabstop     ::= '$' int
                | '${' int '}'
                | '${' int  transform '}'
placeholder ::= '${' int ':' any '}'
choice      ::= '${' int '|' text (',' text)* '|}'
variable    ::= '$' var | '${' var }'
                | '${' var ':' any '}'
                | '${' var transform '}'
transform   ::= '/' regex '/' (format | text)+ '/' options
format      ::= '$' int | '${' int '}'
                | '${' int ':' '/upcase' | '/downcase' | '/capitalize' | '/camelcase' | '/pascalcase' | '/kebabcase' | '/snakecase' '}'
                | '${' int ':+' if '}'
                | '${' int ':?' if ':' else '}'
                | '${' int ':-' else '}' | '${' int ':' else '}'
regex       ::= JavaScript Regular Expression value (ctor-string)
options     ::= JavaScript Regular Expression option (ctor-options)
var         ::= [_a-zA-Z] [_a-zA-Z0-9]*
int         ::= [0-9]+
text        ::= .*
```

Escaping is done with with the `\` (backslash) character. The rule of thumb is that you can escape characters that otherwise would have a syntactic meaning, e.g within text you can escape `$`, `}` and `\`, within choice elements you can escape `|`, `,` and `\`, and within transform elements you can escape `/` and `\`. Also note that in JSON you need to escape `\` as `\\`.
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/snippet/browser/snippetController2.ts]---
Location: vscode-main/src/vs/editor/contrib/snippet/browser/snippetController2.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { DisposableStore, IDisposable } from '../../../../base/common/lifecycle.js';
import { assertType } from '../../../../base/common/types.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { EditorCommand, EditorContributionInstantiation, registerEditorCommand, registerEditorContribution } from '../../../browser/editorExtensions.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { IEditorContribution } from '../../../common/editorCommon.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import { CompletionItem, CompletionItemKind, CompletionItemProvider } from '../../../common/languages.js';
import { ILanguageConfigurationService } from '../../../common/languages/languageConfigurationRegistry.js';
import { ITextModel } from '../../../common/model.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { Choice } from './snippetParser.js';
import { showSimpleSuggestions } from '../../suggest/browser/suggest.js';
import { OvertypingCapturer } from '../../suggest/browser/suggestOvertypingCapturer.js';
import { localize } from '../../../../nls.js';
import { ContextKeyExpr, IContextKey, IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { ISnippetEdit, SnippetSession } from './snippetSession.js';
import { TextModelEditSource } from '../../../common/textModelEditSource.js';
import { IObservable, observableValue } from '../../../../base/common/observable.js';

export interface ISnippetInsertOptions {
	overwriteBefore: number;
	overwriteAfter: number;
	adjustWhitespace: boolean;
	undoStopBefore: boolean;
	undoStopAfter: boolean;
	clipboardText: string | undefined;
	overtypingCapturer: OvertypingCapturer | undefined;
	reason?: TextModelEditSource;
}

const _defaultOptions: ISnippetInsertOptions = {
	overwriteBefore: 0,
	overwriteAfter: 0,
	undoStopBefore: true,
	undoStopAfter: true,
	adjustWhitespace: true,
	clipboardText: undefined,
	overtypingCapturer: undefined
};

export class SnippetController2 implements IEditorContribution {

	public static readonly ID = 'snippetController2';

	static get(editor: ICodeEditor): SnippetController2 | null {
		return editor.getContribution<SnippetController2>(SnippetController2.ID);
	}

	static readonly InSnippetMode = new RawContextKey('inSnippetMode', false, localize('inSnippetMode', "Whether the editor in current in snippet mode"));
	static readonly HasNextTabstop = new RawContextKey('hasNextTabstop', false, localize('hasNextTabstop', "Whether there is a next tab stop when in snippet mode"));
	static readonly HasPrevTabstop = new RawContextKey('hasPrevTabstop', false, localize('hasPrevTabstop', "Whether there is a previous tab stop when in snippet mode"));

	private readonly _inSnippet: IContextKey<boolean>;
	private readonly _inSnippetObservable = observableValue(this, false);
	private readonly _hasNextTabstop: IContextKey<boolean>;
	private readonly _hasPrevTabstop: IContextKey<boolean>;

	private _session?: SnippetSession;
	private readonly _snippetListener = new DisposableStore();
	private _modelVersionId: number = -1;
	private _currentChoice?: Choice;

	private _choiceCompletions?: { provider: CompletionItemProvider; enable(): void; disable(): void };

	constructor(
		private readonly _editor: ICodeEditor,
		@ILogService private readonly _logService: ILogService,
		@ILanguageFeaturesService private readonly _languageFeaturesService: ILanguageFeaturesService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@ILanguageConfigurationService private readonly _languageConfigurationService: ILanguageConfigurationService,
	) {
		this._inSnippet = SnippetController2.InSnippetMode.bindTo(contextKeyService);
		this._hasNextTabstop = SnippetController2.HasNextTabstop.bindTo(contextKeyService);
		this._hasPrevTabstop = SnippetController2.HasPrevTabstop.bindTo(contextKeyService);
	}

	dispose(): void {
		this._inSnippet.reset();
		this._inSnippetObservable.set(false, undefined);
		this._hasPrevTabstop.reset();
		this._hasNextTabstop.reset();
		this._session?.dispose();
		this._snippetListener.dispose();
	}

	apply(edits: ISnippetEdit[], opts?: Partial<ISnippetInsertOptions>) {
		try {
			this._doInsert(edits, typeof opts === 'undefined' ? _defaultOptions : { ..._defaultOptions, ...opts });

		} catch (e) {
			this.cancel();
			this._logService.error(e);
			this._logService.error('snippet_error');
			this._logService.error('insert_edits=', edits);
			this._logService.error('existing_template=', this._session ? this._session._logInfo() : '<no_session>');
		}
	}

	insert(
		template: string,
		opts?: Partial<ISnippetInsertOptions>
	): void {
		// this is here to find out more about the yet-not-understood
		// error that sometimes happens when we fail to inserted a nested
		// snippet
		try {
			this._doInsert(template, typeof opts === 'undefined' ? _defaultOptions : { ..._defaultOptions, ...opts });

		} catch (e) {
			this.cancel();
			this._logService.error(e);
			this._logService.error('snippet_error');
			this._logService.error('insert_template=', template);
			this._logService.error('existing_template=', this._session ? this._session._logInfo() : '<no_session>');
		}
	}

	private _doInsert(
		template: string | ISnippetEdit[],
		opts: ISnippetInsertOptions,
	): void {
		if (!this._editor.hasModel()) {
			return;
		}

		// don't listen while inserting the snippet
		// as that is the inflight state causing cancelation
		this._snippetListener.clear();

		if (opts.undoStopBefore) {
			this._editor.getModel().pushStackElement();
		}

		// don't merge
		if (this._session && typeof template !== 'string') {
			this.cancel();
		}

		if (!this._session) {
			this._modelVersionId = this._editor.getModel().getAlternativeVersionId();
			this._session = new SnippetSession(this._editor, template, opts, this._languageConfigurationService);
			this._session.insert(opts.reason);
		} else {
			assertType(typeof template === 'string');
			this._session.merge(template, opts);
		}

		if (opts.undoStopAfter) {
			this._editor.getModel().pushStackElement();
		}

		// regster completion item provider when there is any choice element
		if (this._session?.hasChoice) {
			const provider: CompletionItemProvider = {
				_debugDisplayName: 'snippetChoiceCompletions',
				provideCompletionItems: (model: ITextModel, position: Position) => {
					if (!this._session || model !== this._editor.getModel() || !Position.equals(this._editor.getPosition(), position)) {
						return undefined;
					}
					const { activeChoice } = this._session;
					if (!activeChoice || activeChoice.choice.options.length === 0) {
						return undefined;
					}

					const word = model.getValueInRange(activeChoice.range);
					const isAnyOfOptions = Boolean(activeChoice.choice.options.find(o => o.value === word));
					const suggestions: CompletionItem[] = [];
					for (let i = 0; i < activeChoice.choice.options.length; i++) {
						const option = activeChoice.choice.options[i];
						suggestions.push({
							kind: CompletionItemKind.Value,
							label: option.value,
							insertText: option.value,
							sortText: 'a'.repeat(i + 1),
							range: activeChoice.range,
							filterText: isAnyOfOptions ? `${word}_${option.value}` : undefined,
							command: { id: 'jumpToNextSnippetPlaceholder', title: localize('next', 'Go to next placeholder...') }
						});
					}
					return { suggestions };
				}
			};

			const model = this._editor.getModel();

			let registration: IDisposable | undefined;
			let isRegistered = false;
			const disable = () => {
				registration?.dispose();
				isRegistered = false;
			};

			const enable = () => {
				if (!isRegistered) {
					registration = this._languageFeaturesService.completionProvider.register({
						language: model.getLanguageId(),
						pattern: model.uri.fsPath,
						scheme: model.uri.scheme,
						exclusive: true
					}, provider);
					this._snippetListener.add(registration);
					isRegistered = true;
				}
			};

			this._choiceCompletions = { provider, enable, disable };
		}

		this._updateState();

		this._snippetListener.add(this._editor.onDidChangeModelContent(e => e.isFlush && this.cancel()));
		this._snippetListener.add(this._editor.onDidChangeModel(() => this.cancel()));
		this._snippetListener.add(this._editor.onDidChangeCursorSelection(() => this._updateState()));
	}

	private _updateState(): void {
		if (!this._session || !this._editor.hasModel()) {
			// canceled in the meanwhile
			return;
		}

		if (this._modelVersionId === this._editor.getModel().getAlternativeVersionId()) {
			// undo until the 'before' state happened
			// and makes use cancel snippet mode
			return this.cancel();
		}

		if (!this._session.hasPlaceholder) {
			// don't listen for selection changes and don't
			// update context keys when the snippet is plain text
			return this.cancel();
		}

		if (this._session.isAtLastPlaceholder || !this._session.isSelectionWithinPlaceholders()) {
			this._editor.getModel().pushStackElement();
			return this.cancel();
		}

		this._inSnippet.set(true);
		this._inSnippetObservable.set(true, undefined);
		this._hasPrevTabstop.set(!this._session.isAtFirstPlaceholder);
		this._hasNextTabstop.set(!this._session.isAtLastPlaceholder);

		this._handleChoice();
	}

	private _handleChoice(): void {
		if (!this._session || !this._editor.hasModel()) {
			this._currentChoice = undefined;
			return;
		}

		const { activeChoice } = this._session;
		if (!activeChoice || !this._choiceCompletions) {
			this._choiceCompletions?.disable();
			this._currentChoice = undefined;
			return;
		}

		if (this._currentChoice !== activeChoice.choice) {
			this._currentChoice = activeChoice.choice;

			this._choiceCompletions.enable();

			// trigger suggest with the special choice completion provider
			queueMicrotask(() => {
				showSimpleSuggestions(this._editor, this._choiceCompletions!.provider);
			});
		}
	}

	finish(): void {
		while (this._inSnippet.get()) {
			this.next();
		}
	}

	cancel(resetSelection: boolean = false): void {
		this._inSnippet.reset();
		this._inSnippetObservable.set(false, undefined);
		this._hasPrevTabstop.reset();
		this._hasNextTabstop.reset();
		this._snippetListener.clear();

		this._currentChoice = undefined;

		this._session?.dispose();
		this._session = undefined;
		this._modelVersionId = -1;
		if (resetSelection) {
			// reset selection to the primary cursor when being asked
			// for. this happens when explicitly cancelling snippet mode,
			// e.g. when pressing ESC
			this._editor.setSelections([this._editor.getSelection()!]);
		}
	}

	prev(): void {
		this._session?.prev();
		this._updateState();
	}

	next(): void {
		this._session?.next();
		this._updateState();
	}

	isInSnippet(): boolean {
		return Boolean(this._inSnippet.get());
	}

	get isInSnippetObservable(): IObservable<boolean> {
		return this._inSnippetObservable;
	}

	getSessionEnclosingRange(): Range | undefined {
		if (this._session) {
			return this._session.getEnclosingRange();
		}
		return undefined;
	}
}


registerEditorContribution(SnippetController2.ID, SnippetController2, EditorContributionInstantiation.Lazy);

const CommandCtor = EditorCommand.bindToContribution<SnippetController2>(SnippetController2.get);

registerEditorCommand(new CommandCtor({
	id: 'jumpToNextSnippetPlaceholder',
	precondition: ContextKeyExpr.and(SnippetController2.InSnippetMode, SnippetController2.HasNextTabstop),
	handler: ctrl => ctrl.next(),
	kbOpts: {
		weight: KeybindingWeight.EditorContrib + 30,
		kbExpr: EditorContextKeys.textInputFocus,
		primary: KeyCode.Tab
	}
}));
registerEditorCommand(new CommandCtor({
	id: 'jumpToPrevSnippetPlaceholder',
	precondition: ContextKeyExpr.and(SnippetController2.InSnippetMode, SnippetController2.HasPrevTabstop),
	handler: ctrl => ctrl.prev(),
	kbOpts: {
		weight: KeybindingWeight.EditorContrib + 30,
		kbExpr: EditorContextKeys.textInputFocus,
		primary: KeyMod.Shift | KeyCode.Tab
	}
}));
registerEditorCommand(new CommandCtor({
	id: 'leaveSnippet',
	precondition: SnippetController2.InSnippetMode,
	handler: ctrl => ctrl.cancel(true),
	kbOpts: {
		weight: KeybindingWeight.EditorContrib + 30,
		kbExpr: EditorContextKeys.textInputFocus,
		primary: KeyCode.Escape,
		secondary: [KeyMod.Shift | KeyCode.Escape]
	}
}));

registerEditorCommand(new CommandCtor({
	id: 'acceptSnippet',
	precondition: SnippetController2.InSnippetMode,
	handler: ctrl => ctrl.finish(),
	// kbOpts: {
	// 	weight: KeybindingWeight.EditorContrib + 30,
	// 	kbExpr: EditorContextKeys.textFocus,
	// 	primary: KeyCode.Enter,
	// }
}));
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/snippet/browser/snippetParser.ts]---
Location: vscode-main/src/vs/editor/contrib/snippet/browser/snippetParser.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CharCode } from '../../../../base/common/charCode.js';

export const enum TokenType {
	Dollar,
	Colon,
	Comma,
	CurlyOpen,
	CurlyClose,
	Backslash,
	Forwardslash,
	Pipe,
	Int,
	VariableName,
	Format,
	Plus,
	Dash,
	QuestionMark,
	EOF
}

export interface Token {
	type: TokenType;
	pos: number;
	len: number;
}


export class Scanner {

	private static _table: { [ch: number]: TokenType } = {
		[CharCode.DollarSign]: TokenType.Dollar,
		[CharCode.Colon]: TokenType.Colon,
		[CharCode.Comma]: TokenType.Comma,
		[CharCode.OpenCurlyBrace]: TokenType.CurlyOpen,
		[CharCode.CloseCurlyBrace]: TokenType.CurlyClose,
		[CharCode.Backslash]: TokenType.Backslash,
		[CharCode.Slash]: TokenType.Forwardslash,
		[CharCode.Pipe]: TokenType.Pipe,
		[CharCode.Plus]: TokenType.Plus,
		[CharCode.Dash]: TokenType.Dash,
		[CharCode.QuestionMark]: TokenType.QuestionMark,
	};

	static isDigitCharacter(ch: number): boolean {
		return ch >= CharCode.Digit0 && ch <= CharCode.Digit9;
	}

	static isVariableCharacter(ch: number): boolean {
		return ch === CharCode.Underline
			|| (ch >= CharCode.a && ch <= CharCode.z)
			|| (ch >= CharCode.A && ch <= CharCode.Z);
	}

	value: string = '';
	pos: number = 0;

	text(value: string) {
		this.value = value;
		this.pos = 0;
	}

	tokenText(token: Token): string {
		return this.value.substr(token.pos, token.len);
	}

	next(): Token {

		if (this.pos >= this.value.length) {
			return { type: TokenType.EOF, pos: this.pos, len: 0 };
		}

		const pos = this.pos;
		let len = 0;
		let ch = this.value.charCodeAt(pos);
		let type: TokenType;

		// static types
		type = Scanner._table[ch];
		if (typeof type === 'number') {
			this.pos += 1;
			return { type, pos, len: 1 };
		}

		// number
		if (Scanner.isDigitCharacter(ch)) {
			type = TokenType.Int;
			do {
				len += 1;
				ch = this.value.charCodeAt(pos + len);
			} while (Scanner.isDigitCharacter(ch));

			this.pos += len;
			return { type, pos, len };
		}

		// variable name
		if (Scanner.isVariableCharacter(ch)) {
			type = TokenType.VariableName;
			do {
				ch = this.value.charCodeAt(pos + (++len));
			} while (Scanner.isVariableCharacter(ch) || Scanner.isDigitCharacter(ch));

			this.pos += len;
			return { type, pos, len };
		}


		// format
		type = TokenType.Format;
		do {
			len += 1;
			ch = this.value.charCodeAt(pos + len);
		} while (
			!isNaN(ch)
			&& typeof Scanner._table[ch] === 'undefined' // not static token
			&& !Scanner.isDigitCharacter(ch) // not number
			&& !Scanner.isVariableCharacter(ch) // not variable
		);

		this.pos += len;
		return { type, pos, len };
	}
}

export abstract class Marker {

	readonly _markerBrand: undefined;

	public parent!: Marker;
	protected _children: Marker[] = [];

	appendChild(child: Marker): this {
		if (child instanceof Text && this._children[this._children.length - 1] instanceof Text) {
			// this and previous child are text -> merge them
			(<Text>this._children[this._children.length - 1]).value += child.value;
		} else {
			// normal adoption of child
			child.parent = this;
			this._children.push(child);
		}
		return this;
	}

	replace(child: Marker, others: Marker[]): void {
		const { parent } = child;
		const idx = parent.children.indexOf(child);
		const newChildren = parent.children.slice(0);
		newChildren.splice(idx, 1, ...others);
		parent._children = newChildren;

		(function _fixParent(children: Marker[], parent: Marker) {
			for (const child of children) {
				child.parent = parent;
				_fixParent(child.children, child);
			}
		})(others, parent);
	}

	get children(): Marker[] {
		return this._children;
	}

	get rightMostDescendant(): Marker {
		if (this._children.length > 0) {
			return this._children[this._children.length - 1].rightMostDescendant;
		}
		return this;
	}

	get snippet(): TextmateSnippet | undefined {
		let candidate: Marker = this;
		while (true) {
			if (!candidate) {
				return undefined;
			}
			if (candidate instanceof TextmateSnippet) {
				return candidate;
			}
			candidate = candidate.parent;
		}
	}

	toString(): string {
		return this.children.reduce((prev, cur) => prev + cur.toString(), '');
	}

	abstract toTextmateString(): string;

	len(): number {
		return 0;
	}

	abstract clone(): Marker;
}

export class Text extends Marker {

	static escape(value: string): string {
		return value.replace(/\$|}|\\/g, '\\$&');
	}

	constructor(public value: string) {
		super();
	}
	override toString() {
		return this.value;
	}
	toTextmateString(): string {
		return Text.escape(this.value);
	}
	override len(): number {
		return this.value.length;
	}
	clone(): Text {
		return new Text(this.value);
	}
}

export abstract class TransformableMarker extends Marker {
	public transform?: Transform;
}

export class Placeholder extends TransformableMarker {
	static compareByIndex(a: Placeholder, b: Placeholder): number {
		if (a.index === b.index) {
			return 0;
		} else if (a.isFinalTabstop) {
			return 1;
		} else if (b.isFinalTabstop) {
			return -1;
		} else if (a.index < b.index) {
			return -1;
		} else if (a.index > b.index) {
			return 1;
		} else {
			return 0;
		}
	}

	constructor(public index: number) {
		super();
	}

	get isFinalTabstop() {
		return this.index === 0;
	}

	get choice(): Choice | undefined {
		return this._children.length === 1 && this._children[0] instanceof Choice
			? this._children[0]
			: undefined;
	}

	toTextmateString(): string {
		let transformString = '';
		if (this.transform) {
			transformString = this.transform.toTextmateString();
		}
		if (this.children.length === 0 && !this.transform) {
			return `\$${this.index}`;
		} else if (this.children.length === 0) {
			return `\${${this.index}${transformString}}`;
		} else if (this.choice) {
			return `\${${this.index}|${this.choice.toTextmateString()}|${transformString}}`;
		} else {
			return `\${${this.index}:${this.children.map(child => child.toTextmateString()).join('')}${transformString}}`;
		}
	}

	clone(): Placeholder {
		const ret = new Placeholder(this.index);
		if (this.transform) {
			ret.transform = this.transform.clone();
		}
		ret._children = this.children.map(child => child.clone());
		return ret;
	}
}

export class Choice extends Marker {

	readonly options: Text[] = [];

	override appendChild(marker: Marker): this {
		if (marker instanceof Text) {
			marker.parent = this;
			this.options.push(marker);
		}
		return this;
	}

	override toString() {
		return this.options[0].value;
	}

	toTextmateString(): string {
		return this.options
			.map(option => option.value.replace(/\||,|\\/g, '\\$&'))
			.join(',');
	}

	override len(): number {
		return this.options[0].len();
	}

	clone(): Choice {
		const ret = new Choice();
		this.options.forEach(ret.appendChild, ret);
		return ret;
	}
}

export class Transform extends Marker {

	regexp: RegExp = new RegExp('');

	resolve(value: string): string {
		const _this = this;
		let didMatch = false;
		let ret = value.replace(this.regexp, function () {
			didMatch = true;
			return _this._replace(Array.prototype.slice.call(arguments, 0, -2));
		});
		// when the regex didn't match and when the transform has
		// else branches, then run those
		if (!didMatch && this._children.some(child => child instanceof FormatString && Boolean(child.elseValue))) {
			ret = this._replace([]);
		}
		return ret;
	}

	private _replace(groups: string[]): string {
		let ret = '';
		for (const marker of this._children) {
			if (marker instanceof FormatString) {
				let value = groups[marker.index] || '';
				value = marker.resolve(value);
				ret += value;
			} else {
				ret += marker.toString();
			}
		}
		return ret;
	}

	override toString(): string {
		return '';
	}

	toTextmateString(): string {
		return `/${this.regexp.source}/${this.children.map(c => c.toTextmateString())}/${(this.regexp.ignoreCase ? 'i' : '') + (this.regexp.global ? 'g' : '')}`;
	}

	clone(): Transform {
		const ret = new Transform();
		ret.regexp = new RegExp(this.regexp.source, '' + (this.regexp.ignoreCase ? 'i' : '') + (this.regexp.global ? 'g' : ''));
		ret._children = this.children.map(child => child.clone());
		return ret;
	}

}

export class FormatString extends Marker {

	constructor(
		readonly index: number,
		readonly shorthandName?: string,
		readonly ifValue?: string,
		readonly elseValue?: string,
	) {
		super();
	}

	resolve(value?: string): string {
		if (this.shorthandName === 'upcase') {
			return !value ? '' : value.toLocaleUpperCase();
		} else if (this.shorthandName === 'downcase') {
			return !value ? '' : value.toLocaleLowerCase();
		} else if (this.shorthandName === 'capitalize') {
			return !value ? '' : (value[0].toLocaleUpperCase() + value.substr(1));
		} else if (this.shorthandName === 'pascalcase') {
			return !value ? '' : this._toPascalCase(value);
		} else if (this.shorthandName === 'camelcase') {
			return !value ? '' : this._toCamelCase(value);
		} else if (this.shorthandName === 'kebabcase') {
			return !value ? '' : this._toKebabCase(value);
		} else if (this.shorthandName === 'snakecase') {
			return !value ? '' : this._toSnakeCase(value);
		} else if (Boolean(value) && typeof this.ifValue === 'string') {
			return this.ifValue;
		} else if (!Boolean(value) && typeof this.elseValue === 'string') {
			return this.elseValue;
		} else {
			return value || '';
		}
	}

	private _toKebabCase(value: string): string {
		const match = value.match(/[a-z0-9]+/gi);
		if (!match) {
			return value;
		}

		if (!value.match(/[a-z0-9]/)) {
			return value
				.trim()
				.toLowerCase()
				.replace(/^_+|_+$/g, '')
				.replace(/[\s_]+/g, '-');
		}

		const match2 = value
			.trim()
			.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g);

		if (!match2) {
			return value;
		}

		return match2
			.map(x => x.toLowerCase())
			.join('-');
	}

	private _toPascalCase(value: string): string {
		const match = value.match(/[a-z0-9]+/gi);
		if (!match) {
			return value;
		}
		return match.map(word => {
			return word.charAt(0).toUpperCase() + word.substr(1);
		})
			.join('');
	}

	private _toCamelCase(value: string): string {
		const match = value.match(/[a-z0-9]+/gi);
		if (!match) {
			return value;
		}
		return match.map((word, index) => {
			if (index === 0) {
				return word.charAt(0).toLowerCase() + word.substr(1);
			}
			return word.charAt(0).toUpperCase() + word.substr(1);
		})
			.join('');
	}

	private _toSnakeCase(value: string): string {
		return value.replace(/([a-z])([A-Z])/g, '$1_$2')
			.replace(/[\s\-]+/g, '_')
			.toLowerCase();
	}

	toTextmateString(): string {
		let value = '${';
		value += this.index;
		if (this.shorthandName) {
			value += `:/${this.shorthandName}`;

		} else if (this.ifValue && this.elseValue) {
			value += `:?${this.ifValue}:${this.elseValue}`;
		} else if (this.ifValue) {
			value += `:+${this.ifValue}`;
		} else if (this.elseValue) {
			value += `:-${this.elseValue}`;
		}
		value += '}';
		return value;
	}

	clone(): FormatString {
		const ret = new FormatString(this.index, this.shorthandName, this.ifValue, this.elseValue);
		return ret;
	}
}

export class Variable extends TransformableMarker {

	constructor(public name: string) {
		super();
	}

	resolve(resolver: VariableResolver): boolean {
		let value = resolver.resolve(this);
		if (this.transform) {
			value = this.transform.resolve(value || '');
		}
		if (value !== undefined) {
			this._children = [new Text(value)];
			return true;
		}
		return false;
	}

	toTextmateString(): string {
		let transformString = '';
		if (this.transform) {
			transformString = this.transform.toTextmateString();
		}
		if (this.children.length === 0) {
			return `\${${this.name}${transformString}}`;
		} else {
			return `\${${this.name}:${this.children.map(child => child.toTextmateString()).join('')}${transformString}}`;
		}
	}

	clone(): Variable {
		const ret = new Variable(this.name);
		if (this.transform) {
			ret.transform = this.transform.clone();
		}
		ret._children = this.children.map(child => child.clone());
		return ret;
	}
}

export interface VariableResolver {
	resolve(variable: Variable): string | undefined;
}

function walk(marker: Marker[], visitor: (marker: Marker) => boolean): void {
	const stack = [...marker];
	while (stack.length > 0) {
		const marker = stack.shift()!;
		const recurse = visitor(marker);
		if (!recurse) {
			break;
		}
		stack.unshift(...marker.children);
	}
}

export class TextmateSnippet extends Marker {

	private _placeholders?: { all: Placeholder[]; last?: Placeholder };

	get placeholderInfo() {
		if (!this._placeholders) {
			// fill in placeholders
			const all: Placeholder[] = [];
			let last: Placeholder | undefined;
			this.walk(function (candidate) {
				if (candidate instanceof Placeholder) {
					all.push(candidate);
					last = !last || last.index < candidate.index ? candidate : last;
				}
				return true;
			});
			this._placeholders = { all, last };
		}
		return this._placeholders;
	}

	get placeholders(): Placeholder[] {
		const { all } = this.placeholderInfo;
		return all;
	}

	offset(marker: Marker): number {
		let pos = 0;
		let found = false;
		this.walk(candidate => {
			if (candidate === marker) {
				found = true;
				return false;
			}
			pos += candidate.len();
			return true;
		});

		if (!found) {
			return -1;
		}
		return pos;
	}

	fullLen(marker: Marker): number {
		let ret = 0;
		walk([marker], marker => {
			ret += marker.len();
			return true;
		});
		return ret;
	}

	enclosingPlaceholders(placeholder: Placeholder): Placeholder[] {
		const ret: Placeholder[] = [];
		let { parent } = placeholder;
		while (parent) {
			if (parent instanceof Placeholder) {
				ret.push(parent);
			}
			parent = parent.parent;
		}
		return ret;
	}

	resolveVariables(resolver: VariableResolver): this {
		this.walk(candidate => {
			if (candidate instanceof Variable) {
				if (candidate.resolve(resolver)) {
					this._placeholders = undefined;
				}
			}
			return true;
		});
		return this;
	}

	override appendChild(child: Marker) {
		this._placeholders = undefined;
		return super.appendChild(child);
	}

	override replace(child: Marker, others: Marker[]): void {
		this._placeholders = undefined;
		return super.replace(child, others);
	}

	toTextmateString(): string {
		return this.children.reduce((prev, cur) => prev + cur.toTextmateString(), '');
	}

	clone(): TextmateSnippet {
		const ret = new TextmateSnippet();
		this._children = this.children.map(child => child.clone());
		return ret;
	}

	walk(visitor: (marker: Marker) => boolean): void {
		walk(this.children, visitor);
	}
}

export class SnippetParser {

	static escape(value: string): string {
		return value.replace(/\$|}|\\/g, '\\$&');
	}

	/**
	 * Takes a snippet and returns the insertable string, e.g return the snippet-string
	 * without any placeholder, tabstop, variables etc...
	 */
	static asInsertText(value: string): string {
		return new SnippetParser().parse(value).toString();
	}

	static guessNeedsClipboard(template: string): boolean {
		return /\${?CLIPBOARD/.test(template);
	}

	private _scanner: Scanner = new Scanner();
	private _token: Token = { type: TokenType.EOF, pos: 0, len: 0 };

	parse(value: string, insertFinalTabstop?: boolean, enforceFinalTabstop?: boolean): TextmateSnippet {
		const snippet = new TextmateSnippet();
		this.parseFragment(value, snippet);
		this.ensureFinalTabstop(snippet, enforceFinalTabstop ?? false, insertFinalTabstop ?? false);
		return snippet;
	}

	parseFragment(value: string, snippet: TextmateSnippet): readonly Marker[] {

		const offset = snippet.children.length;
		this._scanner.text(value);
		this._token = this._scanner.next();
		while (this._parse(snippet)) {
			// nothing
		}

		// fill in values for placeholders. the first placeholder of an index
		// that has a value defines the value for all placeholders with that index
		const placeholderDefaultValues = new Map<number, Marker[] | undefined>();
		const incompletePlaceholders: Placeholder[] = [];
		snippet.walk(marker => {
			if (marker instanceof Placeholder) {
				if (marker.isFinalTabstop) {
					placeholderDefaultValues.set(0, undefined);
				} else if (!placeholderDefaultValues.has(marker.index) && marker.children.length > 0) {
					placeholderDefaultValues.set(marker.index, marker.children);
				} else {
					incompletePlaceholders.push(marker);
				}
			}
			return true;
		});

		const fillInIncompletePlaceholder = (placeholder: Placeholder, stack: Set<number>) => {
			const defaultValues = placeholderDefaultValues.get(placeholder.index);
			if (!defaultValues) {
				return;
			}
			const clone = new Placeholder(placeholder.index);
			clone.transform = placeholder.transform;
			for (const child of defaultValues) {
				const newChild = child.clone();
				clone.appendChild(newChild);

				// "recurse" on children that are again placeholders
				if (newChild instanceof Placeholder && placeholderDefaultValues.has(newChild.index) && !stack.has(newChild.index)) {
					stack.add(newChild.index);
					fillInIncompletePlaceholder(newChild, stack);
					stack.delete(newChild.index);
				}
			}
			snippet.replace(placeholder, [clone]);
		};

		const stack = new Set<number>();
		for (const placeholder of incompletePlaceholders) {
			fillInIncompletePlaceholder(placeholder, stack);
		}

		return snippet.children.slice(offset);
	}

	ensureFinalTabstop(snippet: TextmateSnippet, enforceFinalTabstop: boolean, insertFinalTabstop: boolean) {

		if (enforceFinalTabstop || insertFinalTabstop && snippet.placeholders.length > 0) {
			const finalTabstop = snippet.placeholders.find(p => p.index === 0);
			if (!finalTabstop) {
				// the snippet uses placeholders but has no
				// final tabstop defined -> insert at the end
				snippet.appendChild(new Placeholder(0));
			}
		}

	}

	private _accept(type?: TokenType): boolean;
	private _accept(type: TokenType | undefined, value: true): string;
	private _accept(type: TokenType, value?: boolean): boolean | string {
		if (type === undefined || this._token.type === type) {
			const ret = !value ? true : this._scanner.tokenText(this._token);
			this._token = this._scanner.next();
			return ret;
		}
		return false;
	}

	private _backTo(token: Token): false {
		this._scanner.pos = token.pos + token.len;
		this._token = token;
		return false;
	}

	private _until(type: TokenType): false | string {
		const start = this._token;
		while (this._token.type !== type) {
			if (this._token.type === TokenType.EOF) {
				return false;
			} else if (this._token.type === TokenType.Backslash) {
				const nextToken = this._scanner.next();
				if (nextToken.type !== TokenType.Dollar
					&& nextToken.type !== TokenType.CurlyClose
					&& nextToken.type !== TokenType.Backslash) {
					return false;
				}
			}
			this._token = this._scanner.next();
		}
		const value = this._scanner.value.substring(start.pos, this._token.pos).replace(/\\(\$|}|\\)/g, '$1');
		this._token = this._scanner.next();
		return value;
	}

	private _parse(marker: Marker): boolean {
		return this._parseEscaped(marker)
			|| this._parseTabstopOrVariableName(marker)
			|| this._parseComplexPlaceholder(marker)
			|| this._parseComplexVariable(marker)
			|| this._parseAnything(marker);
	}

	// \$, \\, \} -> just text
	private _parseEscaped(marker: Marker): boolean {
		let value: string;
		if (value = this._accept(TokenType.Backslash, true)) {
			// saw a backslash, append escaped token or that backslash
			value = this._accept(TokenType.Dollar, true)
				|| this._accept(TokenType.CurlyClose, true)
				|| this._accept(TokenType.Backslash, true)
				|| value;

			marker.appendChild(new Text(value));
			return true;
		}
		return false;
	}

	// $foo -> variable, $1 -> tabstop
	private _parseTabstopOrVariableName(parent: Marker): boolean {
		let value: string;
		const token = this._token;
		const match = this._accept(TokenType.Dollar)
			&& (value = this._accept(TokenType.VariableName, true) || this._accept(TokenType.Int, true));

		if (!match) {
			return this._backTo(token);
		}

		parent.appendChild(/^\d+$/.test(value!)
			? new Placeholder(Number(value!))
			: new Variable(value!)
		);
		return true;
	}

	// ${1:<children>}, ${1} -> placeholder
	private _parseComplexPlaceholder(parent: Marker): boolean {
		let index: string;
		const token = this._token;
		const match = this._accept(TokenType.Dollar)
			&& this._accept(TokenType.CurlyOpen)
			&& (index = this._accept(TokenType.Int, true));

		if (!match) {
			return this._backTo(token);
		}

		const placeholder = new Placeholder(Number(index!));

		if (this._accept(TokenType.Colon)) {
			// ${1:<children>}
			while (true) {

				// ...} -> done
				if (this._accept(TokenType.CurlyClose)) {
					parent.appendChild(placeholder);
					return true;
				}

				if (this._parse(placeholder)) {
					continue;
				}

				// fallback
				parent.appendChild(new Text('${' + index! + ':'));
				placeholder.children.forEach(parent.appendChild, parent);
				return true;
			}
		} else if (placeholder.index > 0 && this._accept(TokenType.Pipe)) {
			// ${1|one,two,three|}
			const choice = new Choice();

			while (true) {
				if (this._parseChoiceElement(choice)) {

					if (this._accept(TokenType.Comma)) {
						// opt, -> more
						continue;
					}

					if (this._accept(TokenType.Pipe)) {
						placeholder.appendChild(choice);
						if (this._accept(TokenType.CurlyClose)) {
							// ..|} -> done
							parent.appendChild(placeholder);
							return true;
						}
					}
				}

				this._backTo(token);
				return false;
			}

		} else if (this._accept(TokenType.Forwardslash)) {
			// ${1/<regex>/<format>/<options>}
			if (this._parseTransform(placeholder)) {
				parent.appendChild(placeholder);
				return true;
			}

			this._backTo(token);
			return false;

		} else if (this._accept(TokenType.CurlyClose)) {
			// ${1}
			parent.appendChild(placeholder);
			return true;

		} else {
			// ${1 <- missing curly or colon
			return this._backTo(token);
		}
	}

	private _parseChoiceElement(parent: Choice): boolean {
		const token = this._token;
		const values: string[] = [];

		while (true) {
			if (this._token.type === TokenType.Comma || this._token.type === TokenType.Pipe) {
				break;
			}
			let value: string;
			if (value = this._accept(TokenType.Backslash, true)) {
				// \, \|, or \\
				value = this._accept(TokenType.Comma, true)
					|| this._accept(TokenType.Pipe, true)
					|| this._accept(TokenType.Backslash, true)
					|| value;
			} else {
				value = this._accept(undefined, true);
			}
			if (!value) {
				// EOF
				this._backTo(token);
				return false;
			}
			values.push(value);
		}

		if (values.length === 0) {
			this._backTo(token);
			return false;
		}

		parent.appendChild(new Text(values.join('')));
		return true;
	}

	// ${foo:<children>}, ${foo} -> variable
	private _parseComplexVariable(parent: Marker): boolean {
		let name: string;
		const token = this._token;
		const match = this._accept(TokenType.Dollar)
			&& this._accept(TokenType.CurlyOpen)
			&& (name = this._accept(TokenType.VariableName, true));

		if (!match) {
			return this._backTo(token);
		}

		const variable = new Variable(name!);

		if (this._accept(TokenType.Colon)) {
			// ${foo:<children>}
			while (true) {

				// ...} -> done
				if (this._accept(TokenType.CurlyClose)) {
					parent.appendChild(variable);
					return true;
				}

				if (this._parse(variable)) {
					continue;
				}

				// fallback
				parent.appendChild(new Text('${' + name! + ':'));
				variable.children.forEach(parent.appendChild, parent);
				return true;
			}

		} else if (this._accept(TokenType.Forwardslash)) {
			// ${foo/<regex>/<format>/<options>}
			if (this._parseTransform(variable)) {
				parent.appendChild(variable);
				return true;
			}

			this._backTo(token);
			return false;

		} else if (this._accept(TokenType.CurlyClose)) {
			// ${foo}
			parent.appendChild(variable);
			return true;

		} else {
			// ${foo <- missing curly or colon
			return this._backTo(token);
		}
	}

	private _parseTransform(parent: TransformableMarker): boolean {
		// ...<regex>/<format>/<options>}

		const transform = new Transform();
		let regexValue = '';
		let regexOptions = '';

		// (1) /regex
		while (true) {
			if (this._accept(TokenType.Forwardslash)) {
				break;
			}

			let escaped: string;
			if (escaped = this._accept(TokenType.Backslash, true)) {
				escaped = this._accept(TokenType.Forwardslash, true) || escaped;
				regexValue += escaped;
				continue;
			}

			if (this._token.type !== TokenType.EOF) {
				regexValue += this._accept(undefined, true);
				continue;
			}
			return false;
		}

		// (2) /format
		while (true) {
			if (this._accept(TokenType.Forwardslash)) {
				break;
			}

			let escaped: string;
			if (escaped = this._accept(TokenType.Backslash, true)) {
				escaped = this._accept(TokenType.Backslash, true) || this._accept(TokenType.Forwardslash, true) || escaped;
				transform.appendChild(new Text(escaped));
				continue;
			}

			if (this._parseFormatString(transform) || this._parseAnything(transform)) {
				continue;
			}
			return false;
		}

		// (3) /option
		while (true) {
			if (this._accept(TokenType.CurlyClose)) {
				break;
			}
			if (this._token.type !== TokenType.EOF) {
				regexOptions += this._accept(undefined, true);
				continue;
			}
			return false;
		}

		try {
			transform.regexp = new RegExp(regexValue, regexOptions);
		} catch (e) {
			// invalid regexp
			return false;
		}

		parent.transform = transform;
		return true;
	}

	private _parseFormatString(parent: Transform): boolean {

		const token = this._token;
		if (!this._accept(TokenType.Dollar)) {
			return false;
		}

		let complex = false;
		if (this._accept(TokenType.CurlyOpen)) {
			complex = true;
		}

		const index = this._accept(TokenType.Int, true);

		if (!index) {
			this._backTo(token);
			return false;

		} else if (!complex) {
			// $1
			parent.appendChild(new FormatString(Number(index)));
			return true;

		} else if (this._accept(TokenType.CurlyClose)) {
			// ${1}
			parent.appendChild(new FormatString(Number(index)));
			return true;

		} else if (!this._accept(TokenType.Colon)) {
			this._backTo(token);
			return false;
		}

		if (this._accept(TokenType.Forwardslash)) {
			// ${1:/upcase}
			const shorthand = this._accept(TokenType.VariableName, true);
			if (!shorthand || !this._accept(TokenType.CurlyClose)) {
				this._backTo(token);
				return false;
			} else {
				parent.appendChild(new FormatString(Number(index), shorthand));
				return true;
			}

		} else if (this._accept(TokenType.Plus)) {
			// ${1:+<if>}
			const ifValue = this._until(TokenType.CurlyClose);
			if (ifValue) {
				parent.appendChild(new FormatString(Number(index), undefined, ifValue, undefined));
				return true;
			}

		} else if (this._accept(TokenType.Dash)) {
			// ${2:-<else>}
			const elseValue = this._until(TokenType.CurlyClose);
			if (elseValue) {
				parent.appendChild(new FormatString(Number(index), undefined, undefined, elseValue));
				return true;
			}

		} else if (this._accept(TokenType.QuestionMark)) {
			// ${2:?<if>:<else>}
			const ifValue = this._until(TokenType.Colon);
			if (ifValue) {
				const elseValue = this._until(TokenType.CurlyClose);
				if (elseValue) {
					parent.appendChild(new FormatString(Number(index), undefined, ifValue, elseValue));
					return true;
				}
			}

		} else {
			// ${1:<else>}
			const elseValue = this._until(TokenType.CurlyClose);
			if (elseValue) {
				parent.appendChild(new FormatString(Number(index), undefined, undefined, elseValue));
				return true;
			}
		}

		this._backTo(token);
		return false;
	}

	private _parseAnything(marker: Marker): boolean {
		if (this._token.type !== TokenType.EOF) {
			marker.appendChild(new Text(this._scanner.tokenText(this._token)));
			this._accept(undefined);
			return true;
		}
		return false;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/snippet/browser/snippetSession.css]---
Location: vscode-main/src/vs/editor/contrib/snippet/browser/snippetSession.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-editor .snippet-placeholder {
	min-width: 2px;
	outline-style: solid;
	outline-width: 1px;
	background-color: var(--vscode-editor-snippetTabstopHighlightBackground, transparent);
	outline-color: var(--vscode-editor-snippetTabstopHighlightBorder, transparent);
}

.monaco-editor .finish-snippet-placeholder {
	outline-style: solid;
	outline-width: 1px;
	background-color: var(--vscode-editor-snippetFinalTabstopHighlightBackground, transparent);
	outline-color: var(--vscode-editor-snippetFinalTabstopHighlightBorder, transparent);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/snippet/browser/snippetSession.ts]---
Location: vscode-main/src/vs/editor/contrib/snippet/browser/snippetSession.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { groupBy } from '../../../../base/common/arrays.js';
import { CharCode } from '../../../../base/common/charCode.js';
import { dispose } from '../../../../base/common/lifecycle.js';
import { getLeadingWhitespace } from '../../../../base/common/strings.js';
import './snippetSession.css';
import { IActiveCodeEditor } from '../../../browser/editorBrowser.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { EditOperation, ISingleEditOperation } from '../../../common/core/editOperation.js';
import { IPosition } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { Selection } from '../../../common/core/selection.js';
import { TextChange } from '../../../common/core/textChange.js';
import { ILanguageConfigurationService } from '../../../common/languages/languageConfigurationRegistry.js';
import { IIdentifiedSingleEditOperation, ITextModel, TrackedRangeStickiness } from '../../../common/model.js';
import { ModelDecorationOptions } from '../../../common/model/textModel.js';
import { OvertypingCapturer } from '../../suggest/browser/suggestOvertypingCapturer.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { Choice, Marker, Placeholder, SnippetParser, Text, TextmateSnippet } from './snippetParser.js';
import { ClipboardBasedVariableResolver, CommentBasedVariableResolver, CompositeSnippetVariableResolver, ModelBasedVariableResolver, RandomBasedVariableResolver, SelectionBasedVariableResolver, TimeBasedVariableResolver, WorkspaceBasedVariableResolver } from './snippetVariables.js';
import { EditSources, TextModelEditSource } from '../../../common/textModelEditSource.js';

export class OneSnippet {

	private _placeholderDecorations?: Map<Placeholder, string>;
	private _placeholderGroups: Placeholder[][];
	private _offset: number = -1;
	_placeholderGroupsIdx: number;
	_nestingLevel: number = 1;

	private static readonly _decor = {
		active: ModelDecorationOptions.register({ description: 'snippet-placeholder-1', stickiness: TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges, className: 'snippet-placeholder' }),
		inactive: ModelDecorationOptions.register({ description: 'snippet-placeholder-2', stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, className: 'snippet-placeholder' }),
		activeFinal: ModelDecorationOptions.register({ description: 'snippet-placeholder-3', stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, className: 'finish-snippet-placeholder' }),
		inactiveFinal: ModelDecorationOptions.register({ description: 'snippet-placeholder-4', stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, className: 'finish-snippet-placeholder' }),
	};

	constructor(
		private readonly _editor: IActiveCodeEditor,
		private readonly _snippet: TextmateSnippet,
		private readonly _snippetLineLeadingWhitespace: string
	) {
		this._placeholderGroups = groupBy(_snippet.placeholders, Placeholder.compareByIndex);
		this._placeholderGroupsIdx = -1;
	}

	initialize(textChange: TextChange): void {
		this._offset = textChange.newPosition;
	}

	dispose(): void {
		if (this._placeholderDecorations) {
			this._editor.removeDecorations([...this._placeholderDecorations.values()]);
		}
		this._placeholderGroups.length = 0;
	}

	private _initDecorations(): void {

		if (this._offset === -1) {
			throw new Error(`Snippet not initialized!`);
		}

		if (this._placeholderDecorations) {
			// already initialized
			return;
		}

		this._placeholderDecorations = new Map<Placeholder, string>();
		const model = this._editor.getModel();

		this._editor.changeDecorations(accessor => {
			// create a decoration for each placeholder
			for (const placeholder of this._snippet.placeholders) {
				const placeholderOffset = this._snippet.offset(placeholder);
				const placeholderLen = this._snippet.fullLen(placeholder);
				const range = Range.fromPositions(
					model.getPositionAt(this._offset + placeholderOffset),
					model.getPositionAt(this._offset + placeholderOffset + placeholderLen)
				);
				const options = placeholder.isFinalTabstop ? OneSnippet._decor.inactiveFinal : OneSnippet._decor.inactive;
				const handle = accessor.addDecoration(range, options);
				this._placeholderDecorations!.set(placeholder, handle);
			}
		});
	}

	move(fwd: boolean | undefined): Selection[] {
		if (!this._editor.hasModel()) {
			return [];
		}

		this._initDecorations();

		// Transform placeholder text if necessary
		if (this._placeholderGroupsIdx >= 0) {
			const operations: ISingleEditOperation[] = [];

			for (const placeholder of this._placeholderGroups[this._placeholderGroupsIdx]) {
				// Check if the placeholder has a transformation
				if (placeholder.transform) {
					const id = this._placeholderDecorations!.get(placeholder)!;
					const range = this._editor.getModel().getDecorationRange(id)!;
					const currentValue = this._editor.getModel().getValueInRange(range);
					const transformedValueLines = placeholder.transform.resolve(currentValue).split(/\r\n|\r|\n/);
					// fix indentation for transformed lines
					for (let i = 1; i < transformedValueLines.length; i++) {
						transformedValueLines[i] = this._editor.getModel().normalizeIndentation(this._snippetLineLeadingWhitespace + transformedValueLines[i]);
					}
					operations.push(EditOperation.replace(range, transformedValueLines.join(this._editor.getModel().getEOL())));
				}
			}
			if (operations.length > 0) {
				this._editor.executeEdits('snippet.placeholderTransform', operations);
			}
		}

		let couldSkipThisPlaceholder = false;
		if (fwd === true && this._placeholderGroupsIdx < this._placeholderGroups.length - 1) {
			this._placeholderGroupsIdx += 1;
			couldSkipThisPlaceholder = true;

		} else if (fwd === false && this._placeholderGroupsIdx > 0) {
			this._placeholderGroupsIdx -= 1;
			couldSkipThisPlaceholder = true;

		} else {
			// the selection of the current placeholder might
			// not acurate any more -> simply restore it
		}

		const newSelections = this._editor.getModel().changeDecorations(accessor => {

			const activePlaceholders = new Set<Placeholder>();

			// change stickiness to always grow when typing at its edges
			// because these decorations represent the currently active
			// tabstop.
			// Special case #1: reaching the final tabstop
			// Special case #2: placeholders enclosing active placeholders
			const selections: Selection[] = [];
			for (const placeholder of this._placeholderGroups[this._placeholderGroupsIdx]) {
				const id = this._placeholderDecorations!.get(placeholder)!;
				const range = this._editor.getModel().getDecorationRange(id)!;
				selections.push(new Selection(range.startLineNumber, range.startColumn, range.endLineNumber, range.endColumn));

				// consider to skip this placeholder index when the decoration
				// range is empty but when the placeholder wasn't. that's a strong
				// hint that the placeholder has been deleted. (all placeholder must match this)
				couldSkipThisPlaceholder = couldSkipThisPlaceholder && this._hasPlaceholderBeenCollapsed(placeholder);

				accessor.changeDecorationOptions(id, placeholder.isFinalTabstop ? OneSnippet._decor.activeFinal : OneSnippet._decor.active);
				activePlaceholders.add(placeholder);

				for (const enclosingPlaceholder of this._snippet.enclosingPlaceholders(placeholder)) {
					const id = this._placeholderDecorations!.get(enclosingPlaceholder)!;
					accessor.changeDecorationOptions(id, enclosingPlaceholder.isFinalTabstop ? OneSnippet._decor.activeFinal : OneSnippet._decor.active);
					activePlaceholders.add(enclosingPlaceholder);
				}
			}

			// change stickness to never grow when typing at its edges
			// so that in-active tabstops never grow
			for (const [placeholder, id] of this._placeholderDecorations!) {
				if (!activePlaceholders.has(placeholder)) {
					accessor.changeDecorationOptions(id, placeholder.isFinalTabstop ? OneSnippet._decor.inactiveFinal : OneSnippet._decor.inactive);
				}
			}

			return selections;
		});

		return !couldSkipThisPlaceholder ? newSelections ?? [] : this.move(fwd);
	}

	private _hasPlaceholderBeenCollapsed(placeholder: Placeholder): boolean {
		// A placeholder is empty when it wasn't empty when authored but
		// when its tracking decoration is empty. This also applies to all
		// potential parent placeholders
		let marker: Marker | undefined = placeholder;
		while (marker) {
			if (marker instanceof Placeholder) {
				const id = this._placeholderDecorations!.get(marker)!;
				const range = this._editor.getModel().getDecorationRange(id)!;
				if (range.isEmpty() && marker.toString().length > 0) {
					return true;
				}
			}
			marker = marker.parent;
		}
		return false;
	}

	get isAtFirstPlaceholder() {
		return this._placeholderGroupsIdx <= 0 || this._placeholderGroups.length === 0;
	}

	get isAtLastPlaceholder() {
		return this._placeholderGroupsIdx === this._placeholderGroups.length - 1;
	}

	get hasPlaceholder() {
		return this._snippet.placeholders.length > 0;
	}

	/**
	 * A snippet is trivial when it has no placeholder or only a final placeholder at
	 * its very end
	 */
	get isTrivialSnippet(): boolean {
		if (this._snippet.placeholders.length === 0) {
			return true;
		}
		if (this._snippet.placeholders.length === 1) {
			const [placeholder] = this._snippet.placeholders;
			if (placeholder.isFinalTabstop) {
				if (this._snippet.rightMostDescendant === placeholder) {
					return true;
				}
			}
		}
		return false;
	}

	computePossibleSelections() {
		const result = new Map<number, Range[]>();
		for (const placeholdersWithEqualIndex of this._placeholderGroups) {
			let ranges: Range[] | undefined;

			for (const placeholder of placeholdersWithEqualIndex) {
				if (placeholder.isFinalTabstop) {
					// ignore those
					break;
				}

				if (!ranges) {
					ranges = [];
					result.set(placeholder.index, ranges);
				}

				const id = this._placeholderDecorations!.get(placeholder)!;
				const range = this._editor.getModel().getDecorationRange(id);
				if (!range) {
					// one of the placeholder lost its decoration and
					// therefore we bail out and pretend the placeholder
					// (with its mirrors) doesn't exist anymore.
					result.delete(placeholder.index);
					break;
				}

				ranges.push(range);
			}
		}
		return result;
	}

	get activeChoice(): { choice: Choice; range: Range } | undefined {
		if (!this._placeholderDecorations) {
			return undefined;
		}
		const placeholder = this._placeholderGroups[this._placeholderGroupsIdx][0];
		if (!placeholder?.choice) {
			return undefined;
		}
		const id = this._placeholderDecorations.get(placeholder);
		if (!id) {
			return undefined;
		}
		const range = this._editor.getModel().getDecorationRange(id);
		if (!range) {
			return undefined;
		}
		return { range, choice: placeholder.choice };
	}

	get hasChoice(): boolean {
		let result = false;
		this._snippet.walk(marker => {
			result = marker instanceof Choice;
			return !result;
		});
		return result;
	}

	merge(others: OneSnippet[]): void {

		const model = this._editor.getModel();
		this._nestingLevel *= 10;

		this._editor.changeDecorations(accessor => {

			// For each active placeholder take one snippet and merge it
			// in that the placeholder (can be many for `$1foo$1foo`). Because
			// everything is sorted by editor selection we can simply remove
			// elements from the beginning of the array
			for (const placeholder of this._placeholderGroups[this._placeholderGroupsIdx]) {
				const nested = others.shift()!;
				console.assert(nested._offset !== -1);
				console.assert(!nested._placeholderDecorations);

				// Massage placeholder-indicies of the nested snippet to be
				// sorted right after the insertion point. This ensures we move
				// through the placeholders in the correct order
				const indexLastPlaceholder = nested._snippet.placeholderInfo.last!.index;

				for (const nestedPlaceholder of nested._snippet.placeholderInfo.all) {
					if (nestedPlaceholder.isFinalTabstop) {
						nestedPlaceholder.index = placeholder.index + ((indexLastPlaceholder + 1) / this._nestingLevel);
					} else {
						nestedPlaceholder.index = placeholder.index + (nestedPlaceholder.index / this._nestingLevel);
					}
				}
				this._snippet.replace(placeholder, nested._snippet.children);

				// Remove the placeholder at which position are inserting
				// the snippet and also remove its decoration.
				const id = this._placeholderDecorations!.get(placeholder)!;
				accessor.removeDecoration(id);
				this._placeholderDecorations!.delete(placeholder);

				// For each *new* placeholder we create decoration to monitor
				// how and if it grows/shrinks.
				for (const placeholder of nested._snippet.placeholders) {
					const placeholderOffset = nested._snippet.offset(placeholder);
					const placeholderLen = nested._snippet.fullLen(placeholder);
					const range = Range.fromPositions(
						model.getPositionAt(nested._offset + placeholderOffset),
						model.getPositionAt(nested._offset + placeholderOffset + placeholderLen)
					);
					const handle = accessor.addDecoration(range, OneSnippet._decor.inactive);
					this._placeholderDecorations!.set(placeholder, handle);
				}
			}

			// Last, re-create the placeholder groups by sorting placeholders by their index.
			this._placeholderGroups = groupBy(this._snippet.placeholders, Placeholder.compareByIndex);
		});
	}

	getEnclosingRange(): Range | undefined {
		let result: Range | undefined;
		const model = this._editor.getModel();
		for (const decorationId of this._placeholderDecorations!.values()) {
			const placeholderRange = model.getDecorationRange(decorationId) ?? undefined;
			if (!result) {
				result = placeholderRange;
			} else {
				result = result.plusRange(placeholderRange!);
			}
		}
		return result;
	}
}

export interface ISnippetSessionInsertOptions {
	overwriteBefore: number;
	overwriteAfter: number;
	adjustWhitespace: boolean;
	clipboardText: string | undefined;
	overtypingCapturer: OvertypingCapturer | undefined;
}

const _defaultOptions: ISnippetSessionInsertOptions = {
	overwriteBefore: 0,
	overwriteAfter: 0,
	adjustWhitespace: true,
	clipboardText: undefined,
	overtypingCapturer: undefined
};

export interface ISnippetEdit {
	range: Range;
	template: string;
	keepWhitespace?: boolean;
}

export class SnippetSession {

	static adjustWhitespace(model: ITextModel, position: IPosition, adjustIndentation: boolean, snippet: TextmateSnippet, filter?: Set<Marker>): string {
		const line = model.getLineContent(position.lineNumber);
		const lineLeadingWhitespace = getLeadingWhitespace(line, 0, position.column - 1);

		// the snippet as inserted
		let snippetTextString: string | undefined;

		snippet.walk(marker => {
			// all text elements that are not inside choice
			if (!(marker instanceof Text) || marker.parent instanceof Choice) {
				return true;
			}

			// check with filter (iff provided)
			if (filter && !filter.has(marker)) {
				return true;
			}

			const lines = marker.value.split(/\r\n|\r|\n/);

			if (adjustIndentation) {
				// adjust indentation of snippet test
				// -the snippet-start doesn't get extra-indented (lineLeadingWhitespace), only normalized
				// -all N+1 lines get extra-indented and normalized
				// -the text start get extra-indented and normalized when following a linebreak
				const offset = snippet.offset(marker);
				if (offset === 0) {
					// snippet start
					lines[0] = model.normalizeIndentation(lines[0]);

				} else {
					// check if text start is after a linebreak
					snippetTextString = snippetTextString ?? snippet.toString();
					const prevChar = snippetTextString.charCodeAt(offset - 1);
					if (prevChar === CharCode.LineFeed || prevChar === CharCode.CarriageReturn) {
						lines[0] = model.normalizeIndentation(lineLeadingWhitespace + lines[0]);
					}
				}
				for (let i = 1; i < lines.length; i++) {
					lines[i] = model.normalizeIndentation(lineLeadingWhitespace + lines[i]);
				}
			}

			const newValue = lines.join(model.getEOL());
			if (newValue !== marker.value) {
				marker.parent.replace(marker, [new Text(newValue)]);
				snippetTextString = undefined;
			}
			return true;
		});

		return lineLeadingWhitespace;
	}

	static adjustSelection(model: ITextModel, selection: Selection, overwriteBefore: number, overwriteAfter: number): Selection {
		if (overwriteBefore !== 0 || overwriteAfter !== 0) {
			// overwrite[Before|After] is compute using the position, not the whole
			// selection. therefore we adjust the selection around that position
			const { positionLineNumber, positionColumn } = selection;
			const positionColumnBefore = positionColumn - overwriteBefore;
			const positionColumnAfter = positionColumn + overwriteAfter;

			const range = model.validateRange({
				startLineNumber: positionLineNumber,
				startColumn: positionColumnBefore,
				endLineNumber: positionLineNumber,
				endColumn: positionColumnAfter
			});

			selection = Selection.createWithDirection(
				range.startLineNumber, range.startColumn,
				range.endLineNumber, range.endColumn,
				selection.getDirection()
			);
		}
		return selection;
	}

	static createEditsAndSnippetsFromSelections(editor: IActiveCodeEditor, template: string, overwriteBefore: number, overwriteAfter: number, enforceFinalTabstop: boolean, adjustWhitespace: boolean, clipboardText: string | undefined, overtypingCapturer: OvertypingCapturer | undefined, languageConfigurationService: ILanguageConfigurationService): { edits: IIdentifiedSingleEditOperation[]; snippets: OneSnippet[] } {
		const edits: IIdentifiedSingleEditOperation[] = [];
		const snippets: OneSnippet[] = [];

		if (!editor.hasModel()) {
			return { edits, snippets };
		}
		const model = editor.getModel();

		const workspaceService = editor.invokeWithinContext(accessor => accessor.get(IWorkspaceContextService));
		const modelBasedVariableResolver = editor.invokeWithinContext(accessor => new ModelBasedVariableResolver(accessor.get(ILabelService), model));
		const readClipboardText = () => clipboardText;

		// know what text the overwrite[Before|After] extensions
		// of the primary cursor have selected because only when
		// secondary selections extend to the same text we can grow them
		const firstBeforeText = model.getValueInRange(SnippetSession.adjustSelection(model, editor.getSelection(), overwriteBefore, 0));
		const firstAfterText = model.getValueInRange(SnippetSession.adjustSelection(model, editor.getSelection(), 0, overwriteAfter));

		// remember the first non-whitespace column to decide if
		// `keepWhitespace` should be overruled for secondary selections
		const firstLineFirstNonWhitespace = model.getLineFirstNonWhitespaceColumn(editor.getSelection().positionLineNumber);

		// sort selections by their start position but remeber
		// the original index. that allows you to create correct
		// offset-based selection logic without changing the
		// primary selection
		const indexedSelections = editor.getSelections()
			.map((selection, idx) => ({ selection, idx }))
			.sort((a, b) => Range.compareRangesUsingStarts(a.selection, b.selection));

		for (const { selection, idx } of indexedSelections) {

			// extend selection with the `overwriteBefore` and `overwriteAfter` and then
			// compare if this matches the extensions of the primary selection
			let extensionBefore = SnippetSession.adjustSelection(model, selection, overwriteBefore, 0);
			let extensionAfter = SnippetSession.adjustSelection(model, selection, 0, overwriteAfter);
			if (firstBeforeText !== model.getValueInRange(extensionBefore)) {
				extensionBefore = selection;
			}
			if (firstAfterText !== model.getValueInRange(extensionAfter)) {
				extensionAfter = selection;
			}

			// merge the before and after selection into one
			const snippetSelection = selection
				.setStartPosition(extensionBefore.startLineNumber, extensionBefore.startColumn)
				.setEndPosition(extensionAfter.endLineNumber, extensionAfter.endColumn);

			const snippet = new SnippetParser().parse(template, true, enforceFinalTabstop);

			// adjust the template string to match the indentation and
			// whitespace rules of this insert location (can be different for each cursor)
			// happens when being asked for (default) or when this is a secondary
			// cursor and the leading whitespace is different
			const start = snippetSelection.getStartPosition();
			const snippetLineLeadingWhitespace = SnippetSession.adjustWhitespace(
				model, start,
				adjustWhitespace || (idx > 0 && firstLineFirstNonWhitespace !== model.getLineFirstNonWhitespaceColumn(selection.positionLineNumber)),
				snippet,
			);

			snippet.resolveVariables(new CompositeSnippetVariableResolver([
				modelBasedVariableResolver,
				new ClipboardBasedVariableResolver(readClipboardText, idx, indexedSelections.length, editor.getOption(EditorOption.multiCursorPaste) === 'spread'),
				new SelectionBasedVariableResolver(model, selection, idx, overtypingCapturer),
				new CommentBasedVariableResolver(model, selection, languageConfigurationService),
				new TimeBasedVariableResolver,
				new WorkspaceBasedVariableResolver(workspaceService),
				new RandomBasedVariableResolver,
			]));

			// store snippets with the index of their originating selection.
			// that ensures the primary cursor stays primary despite not being
			// the one with lowest start position
			edits[idx] = EditOperation.replace(snippetSelection, snippet.toString());
			edits[idx].identifier = { major: idx, minor: 0 }; // mark the edit so only our undo edits will be used to generate end cursors
			edits[idx]._isTracked = true;
			snippets[idx] = new OneSnippet(editor, snippet, snippetLineLeadingWhitespace);
		}

		return { edits, snippets };
	}

	static createEditsAndSnippetsFromEdits(editor: IActiveCodeEditor, snippetEdits: ISnippetEdit[], enforceFinalTabstop: boolean, adjustWhitespace: boolean, clipboardText: string | undefined, overtypingCapturer: OvertypingCapturer | undefined, languageConfigurationService: ILanguageConfigurationService): { edits: IIdentifiedSingleEditOperation[]; snippets: OneSnippet[] } {

		if (!editor.hasModel() || snippetEdits.length === 0) {
			return { edits: [], snippets: [] };
		}

		const edits: IIdentifiedSingleEditOperation[] = [];
		const model = editor.getModel();

		const parser = new SnippetParser();
		const snippet = new TextmateSnippet();

		// snippet variables resolver
		const resolver = new CompositeSnippetVariableResolver([
			editor.invokeWithinContext(accessor => new ModelBasedVariableResolver(accessor.get(ILabelService), model)),
			new ClipboardBasedVariableResolver(() => clipboardText, 0, editor.getSelections().length, editor.getOption(EditorOption.multiCursorPaste) === 'spread'),
			new SelectionBasedVariableResolver(model, editor.getSelection(), 0, overtypingCapturer),
			new CommentBasedVariableResolver(model, editor.getSelection(), languageConfigurationService),
			new TimeBasedVariableResolver,
			new WorkspaceBasedVariableResolver(editor.invokeWithinContext(accessor => accessor.get(IWorkspaceContextService))),
			new RandomBasedVariableResolver,
		]);

		//
		snippetEdits = snippetEdits.sort((a, b) => Range.compareRangesUsingStarts(a.range, b.range));
		let offset = 0;
		for (let i = 0; i < snippetEdits.length; i++) {

			const { range, template, keepWhitespace } = snippetEdits[i];

			// gaps between snippet edits are appended as text nodes. this
			// ensures placeholder-offsets are later correct
			if (i > 0) {
				const lastRange = snippetEdits[i - 1].range;
				const textRange = Range.fromPositions(lastRange.getEndPosition(), range.getStartPosition());
				const textNode = new Text(model.getValueInRange(textRange));
				snippet.appendChild(textNode);
				offset += textNode.value.length;
			}

			const newNodes = parser.parseFragment(template, snippet);
			SnippetSession.adjustWhitespace(model, range.getStartPosition(), keepWhitespace !== undefined ? !keepWhitespace : adjustWhitespace, snippet, new Set(newNodes));
			snippet.resolveVariables(resolver);

			const snippetText = snippet.toString();
			const snippetFragmentText = snippetText.slice(offset);
			offset = snippetText.length;

			// make edit
			const edit: IIdentifiedSingleEditOperation = EditOperation.replace(range, snippetFragmentText);
			edit.identifier = { major: i, minor: 0 }; // mark the edit so only our undo edits will be used to generate end cursors
			edit._isTracked = true;
			edits.push(edit);
		}

		//
		parser.ensureFinalTabstop(snippet, enforceFinalTabstop, true);

		return {
			edits,
			snippets: [new OneSnippet(editor, snippet, '')]
		};
	}

	private readonly _templateMerges: [number, number, string | ISnippetEdit[]][] = [];
	private _snippets: OneSnippet[] = [];

	constructor(
		private readonly _editor: IActiveCodeEditor,
		private readonly _template: string | ISnippetEdit[],
		private readonly _options: ISnippetSessionInsertOptions = _defaultOptions,
		@ILanguageConfigurationService private readonly _languageConfigurationService: ILanguageConfigurationService
	) { }

	dispose(): void {
		dispose(this._snippets);
	}

	_logInfo(): string {
		return `template="${this._template}", merged_templates="${this._templateMerges.join(' -> ')}"`;
	}

	insert(editReason?: TextModelEditSource): void {
		if (!this._editor.hasModel()) {
			return;
		}

		// make insert edit and start with first selections
		const { edits, snippets } = typeof this._template === 'string'
			? SnippetSession.createEditsAndSnippetsFromSelections(this._editor, this._template, this._options.overwriteBefore, this._options.overwriteAfter, false, this._options.adjustWhitespace, this._options.clipboardText, this._options.overtypingCapturer, this._languageConfigurationService)
			: SnippetSession.createEditsAndSnippetsFromEdits(this._editor, this._template, false, this._options.adjustWhitespace, this._options.clipboardText, this._options.overtypingCapturer, this._languageConfigurationService);

		this._snippets = snippets;

		this._editor.executeEdits(editReason ?? EditSources.snippet(), edits, _undoEdits => {
			// Sometimes, the text buffer will remove automatic whitespace when doing any edits,
			// so we need to look only at the undo edits relevant for us.
			// Our edits have an identifier set so that's how we can distinguish them
			const undoEdits = _undoEdits.filter(edit => !!edit.identifier);
			for (let idx = 0; idx < snippets.length; idx++) {
				snippets[idx].initialize(undoEdits[idx].textChange);
			}

			if (this._snippets[0].hasPlaceholder) {
				return this._move(true);
			} else {
				return undoEdits
					.map(edit => Selection.fromPositions(edit.range.getEndPosition()));
			}
		});
		this._editor.revealRange(this._editor.getSelections()[0]);
	}

	merge(template: string, options: ISnippetSessionInsertOptions = _defaultOptions): void {
		if (!this._editor.hasModel()) {
			return;
		}
		this._templateMerges.push([this._snippets[0]._nestingLevel, this._snippets[0]._placeholderGroupsIdx, template]);
		const { edits, snippets } = SnippetSession.createEditsAndSnippetsFromSelections(this._editor, template, options.overwriteBefore, options.overwriteAfter, true, options.adjustWhitespace, options.clipboardText, options.overtypingCapturer, this._languageConfigurationService);

		this._editor.executeEdits('snippet', edits, _undoEdits => {
			// Sometimes, the text buffer will remove automatic whitespace when doing any edits,
			// so we need to look only at the undo edits relevant for us.
			// Our edits have an identifier set so that's how we can distinguish them
			const undoEdits = _undoEdits.filter(edit => !!edit.identifier);
			for (let idx = 0; idx < snippets.length; idx++) {
				snippets[idx].initialize(undoEdits[idx].textChange);
			}

			// Trivial snippets have no placeholder or are just the final placeholder. That means they
			// are just text insertions and we don't need to merge the nested snippet into the existing
			// snippet
			const isTrivialSnippet = snippets[0].isTrivialSnippet;
			if (!isTrivialSnippet) {
				for (const snippet of this._snippets) {
					snippet.merge(snippets);
				}
				console.assert(snippets.length === 0);
			}

			if (this._snippets[0].hasPlaceholder && !isTrivialSnippet) {
				return this._move(undefined);
			} else {
				return undoEdits.map(edit => Selection.fromPositions(edit.range.getEndPosition()));
			}
		});
	}

	next(): void {
		const newSelections = this._move(true);
		this._editor.setSelections(newSelections);
		this._editor.revealPositionInCenterIfOutsideViewport(newSelections[0].getPosition());
	}

	prev(): void {
		const newSelections = this._move(false);
		this._editor.setSelections(newSelections);
		this._editor.revealPositionInCenterIfOutsideViewport(newSelections[0].getPosition());
	}

	private _move(fwd: boolean | undefined): Selection[] {
		const selections: Selection[] = [];
		for (const snippet of this._snippets) {
			const oneSelection = snippet.move(fwd);
			selections.push(...oneSelection);
		}
		return selections;
	}

	get isAtFirstPlaceholder() {
		return this._snippets[0].isAtFirstPlaceholder;
	}

	get isAtLastPlaceholder() {
		return this._snippets[0].isAtLastPlaceholder;
	}

	get hasPlaceholder() {
		return this._snippets[0].hasPlaceholder;
	}

	get hasChoice(): boolean {
		return this._snippets[0].hasChoice;
	}

	get activeChoice(): { choice: Choice; range: Range } | undefined {
		return this._snippets[0].activeChoice;
	}

	isSelectionWithinPlaceholders(): boolean {

		if (!this.hasPlaceholder) {
			return false;
		}

		const selections = this._editor.getSelections();
		if (selections.length < this._snippets.length) {
			// this means we started snippet mode with N
			// selections and have M (N > M) selections.
			// So one snippet is without selection -> cancel
			return false;
		}

		const allPossibleSelections = new Map<number, Range[]>();
		for (const snippet of this._snippets) {

			const possibleSelections = snippet.computePossibleSelections();

			// for the first snippet find the placeholder (and its ranges)
			// that contain at least one selection. for all remaining snippets
			// the same placeholder (and their ranges) must be used.
			if (allPossibleSelections.size === 0) {
				for (const [index, ranges] of possibleSelections) {
					ranges.sort(Range.compareRangesUsingStarts);
					for (const selection of selections) {
						if (ranges[0].containsRange(selection)) {
							allPossibleSelections.set(index, []);
							break;
						}
					}
				}
			}

			if (allPossibleSelections.size === 0) {
				// return false if we couldn't associate a selection to
				// this (the first) snippet
				return false;
			}

			// add selections from 'this' snippet so that we know all
			// selections for this placeholder
			allPossibleSelections.forEach((array, index) => {
				array.push(...possibleSelections.get(index)!);
			});
		}

		// sort selections (and later placeholder-ranges). then walk both
		// arrays and make sure the placeholder-ranges contain the corresponding
		// selection
		selections.sort(Range.compareRangesUsingStarts);

		for (const [index, ranges] of allPossibleSelections) {
			if (ranges.length !== selections.length) {
				allPossibleSelections.delete(index);
				continue;
			}

			ranges.sort(Range.compareRangesUsingStarts);

			for (let i = 0; i < ranges.length; i++) {
				if (!ranges[i].containsRange(selections[i])) {
					allPossibleSelections.delete(index);
					continue;
				}
			}
		}

		// from all possible selections we have deleted those
		// that don't match with the current selection. if we don't
		// have any left, we don't have a selection anymore
		return allPossibleSelections.size > 0;
	}

	public getEnclosingRange(): Range | undefined {
		let result: Range | undefined;
		for (const snippet of this._snippets) {
			const snippetRange = snippet.getEnclosingRange();
			if (!result) {
				result = snippetRange;
			} else {
				result = result.plusRange(snippetRange!);
			}
		}
		return result;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/snippet/browser/snippetVariables.ts]---
Location: vscode-main/src/vs/editor/contrib/snippet/browser/snippetVariables.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { normalizeDriveLetter } from '../../../../base/common/labels.js';
import * as path from '../../../../base/common/path.js';
import { dirname } from '../../../../base/common/resources.js';
import { commonPrefixLength, getLeadingWhitespace, isFalsyOrWhitespace, splitLines } from '../../../../base/common/strings.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import { Selection } from '../../../common/core/selection.js';
import { ITextModel } from '../../../common/model.js';
import { ILanguageConfigurationService } from '../../../common/languages/languageConfigurationRegistry.js';
import { Text, Variable, VariableResolver } from './snippetParser.js';
import { OvertypingCapturer } from '../../suggest/browser/suggestOvertypingCapturer.js';
import * as nls from '../../../../nls.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { WORKSPACE_EXTENSION, isSingleFolderWorkspaceIdentifier, toWorkspaceIdentifier, IWorkspaceContextService, ISingleFolderWorkspaceIdentifier, IWorkspaceIdentifier, isEmptyWorkspaceIdentifier } from '../../../../platform/workspace/common/workspace.js';

export const KnownSnippetVariableNames = Object.freeze<{ [key: string]: true }>({
	'CURRENT_YEAR': true,
	'CURRENT_YEAR_SHORT': true,
	'CURRENT_MONTH': true,
	'CURRENT_DATE': true,
	'CURRENT_HOUR': true,
	'CURRENT_MINUTE': true,
	'CURRENT_SECOND': true,
	'CURRENT_DAY_NAME': true,
	'CURRENT_DAY_NAME_SHORT': true,
	'CURRENT_MONTH_NAME': true,
	'CURRENT_MONTH_NAME_SHORT': true,
	'CURRENT_SECONDS_UNIX': true,
	'CURRENT_TIMEZONE_OFFSET': true,
	'SELECTION': true,
	'CLIPBOARD': true,
	'TM_SELECTED_TEXT': true,
	'TM_CURRENT_LINE': true,
	'TM_CURRENT_WORD': true,
	'TM_LINE_INDEX': true,
	'TM_LINE_NUMBER': true,
	'TM_FILENAME': true,
	'TM_FILENAME_BASE': true,
	'TM_DIRECTORY': true,
	'TM_DIRECTORY_BASE': true,
	'TM_FILEPATH': true,
	'CURSOR_INDEX': true, // 0-offset
	'CURSOR_NUMBER': true, // 1-offset
	'RELATIVE_FILEPATH': true,
	'BLOCK_COMMENT_START': true,
	'BLOCK_COMMENT_END': true,
	'LINE_COMMENT': true,
	'WORKSPACE_NAME': true,
	'WORKSPACE_FOLDER': true,
	'RANDOM': true,
	'RANDOM_HEX': true,
	'UUID': true
});

export class CompositeSnippetVariableResolver implements VariableResolver {

	constructor(private readonly _delegates: VariableResolver[]) {
		//
	}

	resolve(variable: Variable): string | undefined {
		for (const delegate of this._delegates) {
			const value = delegate.resolve(variable);
			if (value !== undefined) {
				return value;
			}
		}
		return undefined;
	}
}

export class SelectionBasedVariableResolver implements VariableResolver {

	constructor(
		private readonly _model: ITextModel,
		private readonly _selection: Selection,
		private readonly _selectionIdx: number,
		private readonly _overtypingCapturer: OvertypingCapturer | undefined
	) {
		//
	}

	resolve(variable: Variable): string | undefined {

		const { name } = variable;

		if (name === 'SELECTION' || name === 'TM_SELECTED_TEXT') {
			let value = this._model.getValueInRange(this._selection) || undefined;
			let isMultiline = this._selection.startLineNumber !== this._selection.endLineNumber;

			// If there was no selected text, try to get last overtyped text
			if (!value && this._overtypingCapturer) {
				const info = this._overtypingCapturer.getLastOvertypedInfo(this._selectionIdx);
				if (info) {
					value = info.value;
					isMultiline = info.multiline;
				}
			}

			if (value && isMultiline && variable.snippet) {
				// Selection is a multiline string which we indentation we now
				// need to adjust. We compare the indentation of this variable
				// with the indentation at the editor position and add potential
				// extra indentation to the value

				const line = this._model.getLineContent(this._selection.startLineNumber);
				const lineLeadingWhitespace = getLeadingWhitespace(line, 0, this._selection.startColumn - 1);

				let varLeadingWhitespace = lineLeadingWhitespace;
				variable.snippet.walk(marker => {
					if (marker === variable) {
						return false;
					}
					if (marker instanceof Text) {
						varLeadingWhitespace = getLeadingWhitespace(splitLines(marker.value).pop()!);
					}
					return true;
				});
				const whitespaceCommonLength = commonPrefixLength(varLeadingWhitespace, lineLeadingWhitespace);

				value = value.replace(
					/(\r\n|\r|\n)(.*)/g,
					(m, newline, rest) => `${newline}${varLeadingWhitespace.substr(whitespaceCommonLength)}${rest}`
				);
			}
			return value;

		} else if (name === 'TM_CURRENT_LINE') {
			return this._model.getLineContent(this._selection.positionLineNumber);

		} else if (name === 'TM_CURRENT_WORD') {
			const info = this._model.getWordAtPosition({
				lineNumber: this._selection.positionLineNumber,
				column: this._selection.positionColumn
			});
			return info && info.word || undefined;

		} else if (name === 'TM_LINE_INDEX') {
			return String(this._selection.positionLineNumber - 1);

		} else if (name === 'TM_LINE_NUMBER') {
			return String(this._selection.positionLineNumber);

		} else if (name === 'CURSOR_INDEX') {
			return String(this._selectionIdx);

		} else if (name === 'CURSOR_NUMBER') {
			return String(this._selectionIdx + 1);
		}
		return undefined;
	}
}

export class ModelBasedVariableResolver implements VariableResolver {

	constructor(
		private readonly _labelService: ILabelService,
		private readonly _model: ITextModel
	) {
		//
	}

	resolve(variable: Variable): string | undefined {

		const { name } = variable;

		if (name === 'TM_FILENAME') {
			return path.basename(this._model.uri.fsPath);

		} else if (name === 'TM_FILENAME_BASE') {
			const name = path.basename(this._model.uri.fsPath);
			const idx = name.lastIndexOf('.');
			if (idx <= 0) {
				return name;
			} else {
				return name.slice(0, idx);
			}

		} else if (name === 'TM_DIRECTORY') {
			if (path.dirname(this._model.uri.fsPath) === '.') {
				return '';
			}
			return this._labelService.getUriLabel(dirname(this._model.uri));

		} else if (name === 'TM_DIRECTORY_BASE') {
			if (path.dirname(this._model.uri.fsPath) === '.') {
				return '';
			}
			return path.basename(path.dirname(this._model.uri.fsPath));

		} else if (name === 'TM_FILEPATH') {
			return this._labelService.getUriLabel(this._model.uri);
		} else if (name === 'RELATIVE_FILEPATH') {
			return this._labelService.getUriLabel(this._model.uri, { relative: true, noPrefix: true });
		}

		return undefined;
	}
}

export interface IReadClipboardText {
	(): string | undefined;
}

export class ClipboardBasedVariableResolver implements VariableResolver {

	constructor(
		private readonly _readClipboardText: IReadClipboardText,
		private readonly _selectionIdx: number,
		private readonly _selectionCount: number,
		private readonly _spread: boolean
	) {
		//
	}

	resolve(variable: Variable): string | undefined {
		if (variable.name !== 'CLIPBOARD') {
			return undefined;
		}

		const clipboardText = this._readClipboardText();
		if (!clipboardText) {
			return undefined;
		}

		// `spread` is assigning each cursor a line of the clipboard
		// text whenever there the line count equals the cursor count
		// and when enabled
		if (this._spread) {
			const lines = clipboardText.split(/\r\n|\n|\r/).filter(s => !isFalsyOrWhitespace(s));
			if (lines.length === this._selectionCount) {
				return lines[this._selectionIdx];
			}
		}
		return clipboardText;
	}
}
export class CommentBasedVariableResolver implements VariableResolver {
	constructor(
		private readonly _model: ITextModel,
		private readonly _selection: Selection,
		@ILanguageConfigurationService private readonly _languageConfigurationService: ILanguageConfigurationService
	) {
		//
	}
	resolve(variable: Variable): string | undefined {
		const { name } = variable;
		const langId = this._model.getLanguageIdAtPosition(this._selection.selectionStartLineNumber, this._selection.selectionStartColumn);
		const config = this._languageConfigurationService.getLanguageConfiguration(langId).comments;
		if (!config) {
			return undefined;
		}
		if (name === 'LINE_COMMENT') {
			return config.lineCommentToken || undefined;
		} else if (name === 'BLOCK_COMMENT_START') {
			return config.blockCommentStartToken || undefined;
		} else if (name === 'BLOCK_COMMENT_END') {
			return config.blockCommentEndToken || undefined;
		}
		return undefined;
	}
}
export class TimeBasedVariableResolver implements VariableResolver {

	private static readonly dayNames = [nls.localize('Sunday', "Sunday"), nls.localize('Monday', "Monday"), nls.localize('Tuesday', "Tuesday"), nls.localize('Wednesday', "Wednesday"), nls.localize('Thursday', "Thursday"), nls.localize('Friday', "Friday"), nls.localize('Saturday', "Saturday")];
	private static readonly dayNamesShort = [nls.localize('SundayShort', "Sun"), nls.localize('MondayShort', "Mon"), nls.localize('TuesdayShort', "Tue"), nls.localize('WednesdayShort', "Wed"), nls.localize('ThursdayShort', "Thu"), nls.localize('FridayShort', "Fri"), nls.localize('SaturdayShort', "Sat")];
	private static readonly monthNames = [nls.localize('January', "January"), nls.localize('February', "February"), nls.localize('March', "March"), nls.localize('April', "April"), nls.localize('May', "May"), nls.localize('June', "June"), nls.localize('July', "July"), nls.localize('August', "August"), nls.localize('September', "September"), nls.localize('October', "October"), nls.localize('November', "November"), nls.localize('December', "December")];
	private static readonly monthNamesShort = [nls.localize('JanuaryShort', "Jan"), nls.localize('FebruaryShort', "Feb"), nls.localize('MarchShort', "Mar"), nls.localize('AprilShort', "Apr"), nls.localize('MayShort', "May"), nls.localize('JuneShort', "Jun"), nls.localize('JulyShort', "Jul"), nls.localize('AugustShort', "Aug"), nls.localize('SeptemberShort', "Sep"), nls.localize('OctoberShort', "Oct"), nls.localize('NovemberShort', "Nov"), nls.localize('DecemberShort', "Dec")];

	private readonly _date = new Date();

	resolve(variable: Variable): string | undefined {
		const { name } = variable;

		if (name === 'CURRENT_YEAR') {
			return String(this._date.getFullYear());
		} else if (name === 'CURRENT_YEAR_SHORT') {
			return String(this._date.getFullYear()).slice(-2);
		} else if (name === 'CURRENT_MONTH') {
			return String(this._date.getMonth().valueOf() + 1).padStart(2, '0');
		} else if (name === 'CURRENT_DATE') {
			return String(this._date.getDate().valueOf()).padStart(2, '0');
		} else if (name === 'CURRENT_HOUR') {
			return String(this._date.getHours().valueOf()).padStart(2, '0');
		} else if (name === 'CURRENT_MINUTE') {
			return String(this._date.getMinutes().valueOf()).padStart(2, '0');
		} else if (name === 'CURRENT_SECOND') {
			return String(this._date.getSeconds().valueOf()).padStart(2, '0');
		} else if (name === 'CURRENT_DAY_NAME') {
			return TimeBasedVariableResolver.dayNames[this._date.getDay()];
		} else if (name === 'CURRENT_DAY_NAME_SHORT') {
			return TimeBasedVariableResolver.dayNamesShort[this._date.getDay()];
		} else if (name === 'CURRENT_MONTH_NAME') {
			return TimeBasedVariableResolver.monthNames[this._date.getMonth()];
		} else if (name === 'CURRENT_MONTH_NAME_SHORT') {
			return TimeBasedVariableResolver.monthNamesShort[this._date.getMonth()];
		} else if (name === 'CURRENT_SECONDS_UNIX') {
			return String(Math.floor(this._date.getTime() / 1000));
		} else if (name === 'CURRENT_TIMEZONE_OFFSET') {
			const rawTimeOffset = this._date.getTimezoneOffset();
			const sign = rawTimeOffset > 0 ? '-' : '+';
			const hours = Math.trunc(Math.abs(rawTimeOffset / 60));
			const hoursString = (hours < 10 ? '0' + hours : hours);
			const minutes = Math.abs(rawTimeOffset) - hours * 60;
			const minutesString = (minutes < 10 ? '0' + minutes : minutes);
			return sign + hoursString + ':' + minutesString;
		}

		return undefined;
	}
}

export class WorkspaceBasedVariableResolver implements VariableResolver {
	constructor(
		private readonly _workspaceService: IWorkspaceContextService | undefined,
	) {
		//
	}

	resolve(variable: Variable): string | undefined {
		if (!this._workspaceService) {
			return undefined;
		}

		const workspaceIdentifier = toWorkspaceIdentifier(this._workspaceService.getWorkspace());
		if (isEmptyWorkspaceIdentifier(workspaceIdentifier)) {
			return undefined;
		}

		if (variable.name === 'WORKSPACE_NAME') {
			return this._resolveWorkspaceName(workspaceIdentifier);
		} else if (variable.name === 'WORKSPACE_FOLDER') {
			return this._resoveWorkspacePath(workspaceIdentifier);
		}

		return undefined;
	}
	private _resolveWorkspaceName(workspaceIdentifier: IWorkspaceIdentifier | ISingleFolderWorkspaceIdentifier): string | undefined {
		if (isSingleFolderWorkspaceIdentifier(workspaceIdentifier)) {
			return path.basename(workspaceIdentifier.uri.path);
		}

		let filename = path.basename(workspaceIdentifier.configPath.path);
		if (filename.endsWith(WORKSPACE_EXTENSION)) {
			filename = filename.substr(0, filename.length - WORKSPACE_EXTENSION.length - 1);
		}
		return filename;
	}
	private _resoveWorkspacePath(workspaceIdentifier: IWorkspaceIdentifier | ISingleFolderWorkspaceIdentifier): string | undefined {
		if (isSingleFolderWorkspaceIdentifier(workspaceIdentifier)) {
			return normalizeDriveLetter(workspaceIdentifier.uri.fsPath);
		}

		const filename = path.basename(workspaceIdentifier.configPath.path);
		let folderpath = workspaceIdentifier.configPath.fsPath;
		if (folderpath.endsWith(filename)) {
			folderpath = folderpath.substr(0, folderpath.length - filename.length - 1);
		}
		return (folderpath ? normalizeDriveLetter(folderpath) : '/');
	}
}

export class RandomBasedVariableResolver implements VariableResolver {
	resolve(variable: Variable): string | undefined {
		const { name } = variable;

		if (name === 'RANDOM') {
			return Math.random().toString().slice(-6);
		} else if (name === 'RANDOM_HEX') {
			return Math.random().toString(16).slice(-6);
		} else if (name === 'UUID') {
			return generateUuid();
		}

		return undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/snippet/test/browser/snippetController2.old.test.ts]---
Location: vscode-main/src/vs/editor/contrib/snippet/test/browser/snippetController2.old.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { mock } from '../../../../../base/test/common/mock.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { ICodeEditor } from '../../../../browser/editorBrowser.js';
import { Position } from '../../../../common/core/position.js';
import { Selection } from '../../../../common/core/selection.js';
import { LanguageFeaturesService } from '../../../../common/services/languageFeaturesService.js';
import { SnippetController2 } from '../../browser/snippetController2.js';
import { ITestCodeEditor, withTestCodeEditor } from '../../../../test/browser/testCodeEditor.js';
import { TestLanguageConfigurationService } from '../../../../test/common/modes/testLanguageConfigurationService.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { ServiceCollection } from '../../../../../platform/instantiation/common/serviceCollection.js';
import { ILabelService } from '../../../../../platform/label/common/label.js';
import { NullLogService } from '../../../../../platform/log/common/log.js';
import { IWorkspaceContextService } from '../../../../../platform/workspace/common/workspace.js';

class TestSnippetController extends SnippetController2 {

	private _testLanguageConfigurationService: TestLanguageConfigurationService;

	constructor(
		editor: ICodeEditor,
		@IContextKeyService private readonly _contextKeyService: IContextKeyService
	) {
		const testLanguageConfigurationService = new TestLanguageConfigurationService();
		super(editor, new NullLogService(), new LanguageFeaturesService(), _contextKeyService, testLanguageConfigurationService);
		this._testLanguageConfigurationService = testLanguageConfigurationService;
	}

	override dispose(): void {
		super.dispose();
		this._testLanguageConfigurationService.dispose();
	}

	isInSnippetMode(): boolean {
		return SnippetController2.InSnippetMode.getValue(this._contextKeyService)!;
	}
}

suite('SnippetController', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	function snippetTest(cb: (editor: ITestCodeEditor, template: string, snippetController: TestSnippetController) => void, lines?: string[]): void {

		if (!lines) {
			lines = [
				'function test() {',
				'\tvar x = 3;',
				'\tvar arr = [];',
				'\t',
				'}'
			];
		}

		const serviceCollection = new ServiceCollection(
			[ILabelService, new class extends mock<ILabelService>() { }],
			[IWorkspaceContextService, new class extends mock<IWorkspaceContextService>() { }],
		);

		withTestCodeEditor(lines, { serviceCollection }, (editor) => {
			editor.getModel()!.updateOptions({
				insertSpaces: false
			});
			const snippetController = editor.registerAndInstantiateContribution(TestSnippetController.ID, TestSnippetController);
			const template = [
				'for (var ${1:index}; $1 < ${2:array}.length; $1++) {',
				'\tvar element = $2[$1];',
				'\t$0',
				'}'
			].join('\n');

			cb(editor, template, snippetController);
			snippetController.dispose();
		});
	}

	test('Simple accepted', () => {
		snippetTest((editor, template, snippetController) => {
			editor.setPosition({ lineNumber: 4, column: 2 });

			snippetController.insert(template);
			assert.strictEqual(editor.getModel()!.getLineContent(4), '\tfor (var index; index < array.length; index++) {');
			assert.strictEqual(editor.getModel()!.getLineContent(5), '\t\tvar element = array[index];');
			assert.strictEqual(editor.getModel()!.getLineContent(6), '\t\t');
			assert.strictEqual(editor.getModel()!.getLineContent(7), '\t}');

			editor.trigger('test', 'type', { text: 'i' });
			assert.strictEqual(editor.getModel()!.getLineContent(4), '\tfor (var i; i < array.length; i++) {');
			assert.strictEqual(editor.getModel()!.getLineContent(5), '\t\tvar element = array[i];');
			assert.strictEqual(editor.getModel()!.getLineContent(6), '\t\t');
			assert.strictEqual(editor.getModel()!.getLineContent(7), '\t}');

			snippetController.next();
			editor.trigger('test', 'type', { text: 'arr' });
			assert.strictEqual(editor.getModel()!.getLineContent(4), '\tfor (var i; i < arr.length; i++) {');
			assert.strictEqual(editor.getModel()!.getLineContent(5), '\t\tvar element = arr[i];');
			assert.strictEqual(editor.getModel()!.getLineContent(6), '\t\t');
			assert.strictEqual(editor.getModel()!.getLineContent(7), '\t}');

			snippetController.prev();
			editor.trigger('test', 'type', { text: 'j' });
			assert.strictEqual(editor.getModel()!.getLineContent(4), '\tfor (var j; j < arr.length; j++) {');
			assert.strictEqual(editor.getModel()!.getLineContent(5), '\t\tvar element = arr[j];');
			assert.strictEqual(editor.getModel()!.getLineContent(6), '\t\t');
			assert.strictEqual(editor.getModel()!.getLineContent(7), '\t}');

			snippetController.next();
			snippetController.next();
			assert.deepStrictEqual(editor.getPosition(), new Position(6, 3));
		});
	});

	test('Simple canceled', () => {
		snippetTest((editor, template, snippetController) => {
			editor.setPosition({ lineNumber: 4, column: 2 });

			snippetController.insert(template);
			assert.strictEqual(editor.getModel()!.getLineContent(4), '\tfor (var index; index < array.length; index++) {');
			assert.strictEqual(editor.getModel()!.getLineContent(5), '\t\tvar element = array[index];');
			assert.strictEqual(editor.getModel()!.getLineContent(6), '\t\t');
			assert.strictEqual(editor.getModel()!.getLineContent(7), '\t}');

			snippetController.cancel();
			assert.deepStrictEqual(editor.getPosition(), new Position(4, 16));
		});
	});

	// test('Stops when deleting lines above', () => {
	// 	snippetTest((editor, codeSnippet, snippetController) => {
	// 		editor.setPosition({ lineNumber: 4, column: 2 });
	// 		snippetController.insert(codeSnippet, 0, 0);

	// 		editor.getModel()!.applyEdits([{
	// 			forceMoveMarkers: false,
	// 			identifier: null,
	// 			isAutoWhitespaceEdit: false,
	// 			range: new Range(1, 1, 3, 1),
	// 			text: null
	// 		}]);

	// 		assert.strictEqual(snippetController.isInSnippetMode(), false);
	// 	});
	// });

	// test('Stops when deleting lines below', () => {
	// 	snippetTest((editor, codeSnippet, snippetController) => {
	// 		editor.setPosition({ lineNumber: 4, column: 2 });
	// 		snippetController.run(codeSnippet, 0, 0);

	// 		editor.getModel()!.applyEdits([{
	// 			forceMoveMarkers: false,
	// 			identifier: null,
	// 			isAutoWhitespaceEdit: false,
	// 			range: new Range(8, 1, 8, 100),
	// 			text: null
	// 		}]);

	// 		assert.strictEqual(snippetController.isInSnippetMode(), false);
	// 	});
	// });

	// test('Stops when inserting lines above', () => {
	// 	snippetTest((editor, codeSnippet, snippetController) => {
	// 		editor.setPosition({ lineNumber: 4, column: 2 });
	// 		snippetController.run(codeSnippet, 0, 0);

	// 		editor.getModel()!.applyEdits([{
	// 			forceMoveMarkers: false,
	// 			identifier: null,
	// 			isAutoWhitespaceEdit: false,
	// 			range: new Range(1, 100, 1, 100),
	// 			text: '\nHello'
	// 		}]);

	// 		assert.strictEqual(snippetController.isInSnippetMode(), false);
	// 	});
	// });

	// test('Stops when inserting lines below', () => {
	// 	snippetTest((editor, codeSnippet, snippetController) => {
	// 		editor.setPosition({ lineNumber: 4, column: 2 });
	// 		snippetController.run(codeSnippet, 0, 0);

	// 		editor.getModel()!.applyEdits([{
	// 			forceMoveMarkers: false,
	// 			identifier: null,
	// 			isAutoWhitespaceEdit: false,
	// 			range: new Range(8, 100, 8, 100),
	// 			text: '\nHello'
	// 		}]);

	// 		assert.strictEqual(snippetController.isInSnippetMode(), false);
	// 	});
	// });

	test('Stops when calling model.setValue()', () => {
		snippetTest((editor, codeSnippet, snippetController) => {
			editor.setPosition({ lineNumber: 4, column: 2 });
			snippetController.insert(codeSnippet);

			editor.getModel()!.setValue('goodbye');

			assert.strictEqual(snippetController.isInSnippetMode(), false);
		});
	});

	test('Stops when undoing', () => {
		snippetTest((editor, codeSnippet, snippetController) => {
			editor.setPosition({ lineNumber: 4, column: 2 });
			snippetController.insert(codeSnippet);

			editor.getModel()!.undo();

			assert.strictEqual(snippetController.isInSnippetMode(), false);
		});
	});

	test('Stops when moving cursor outside', () => {
		snippetTest((editor, codeSnippet, snippetController) => {
			editor.setPosition({ lineNumber: 4, column: 2 });
			snippetController.insert(codeSnippet);

			editor.setPosition({ lineNumber: 1, column: 1 });

			assert.strictEqual(snippetController.isInSnippetMode(), false);
		});
	});

	test('Stops when disconnecting editor model', () => {
		snippetTest((editor, codeSnippet, snippetController) => {
			editor.setPosition({ lineNumber: 4, column: 2 });
			snippetController.insert(codeSnippet);

			editor.setModel(null);

			assert.strictEqual(snippetController.isInSnippetMode(), false);
		});
	});

	test('Stops when disposing editor', () => {
		snippetTest((editor, codeSnippet, snippetController) => {
			editor.setPosition({ lineNumber: 4, column: 2 });
			snippetController.insert(codeSnippet);

			snippetController.dispose();

			assert.strictEqual(snippetController.isInSnippetMode(), false);
		});
	});

	test('Final tabstop with multiple selections', () => {
		snippetTest((editor, codeSnippet, snippetController) => {
			editor.setSelections([
				new Selection(1, 1, 1, 1),
				new Selection(2, 1, 2, 1),
			]);

			codeSnippet = 'foo$0';
			snippetController.insert(codeSnippet);

			assert.strictEqual(editor.getSelections()!.length, 2);
			const [first, second] = editor.getSelections()!;
			assert.ok(first.equalsRange({ startLineNumber: 1, startColumn: 4, endLineNumber: 1, endColumn: 4 }), first.toString());
			assert.ok(second.equalsRange({ startLineNumber: 2, startColumn: 4, endLineNumber: 2, endColumn: 4 }), second.toString());
		});

		snippetTest((editor, codeSnippet, snippetController) => {
			editor.setSelections([
				new Selection(1, 1, 1, 1),
				new Selection(2, 1, 2, 1),
			]);

			codeSnippet = 'foo$0bar';
			snippetController.insert(codeSnippet);

			assert.strictEqual(editor.getSelections()!.length, 2);
			const [first, second] = editor.getSelections()!;
			assert.ok(first.equalsRange({ startLineNumber: 1, startColumn: 4, endLineNumber: 1, endColumn: 4 }), first.toString());
			assert.ok(second.equalsRange({ startLineNumber: 2, startColumn: 4, endLineNumber: 2, endColumn: 4 }), second.toString());
		});

		snippetTest((editor, codeSnippet, snippetController) => {
			editor.setSelections([
				new Selection(1, 1, 1, 1),
				new Selection(1, 5, 1, 5),
			]);

			codeSnippet = 'foo$0bar';
			snippetController.insert(codeSnippet);

			assert.strictEqual(editor.getSelections()!.length, 2);
			const [first, second] = editor.getSelections()!;
			assert.ok(first.equalsRange({ startLineNumber: 1, startColumn: 4, endLineNumber: 1, endColumn: 4 }), first.toString());
			assert.ok(second.equalsRange({ startLineNumber: 1, startColumn: 14, endLineNumber: 1, endColumn: 14 }), second.toString());
		});

		snippetTest((editor, codeSnippet, snippetController) => {
			editor.setSelections([
				new Selection(1, 1, 1, 1),
				new Selection(1, 5, 1, 5),
			]);

			codeSnippet = 'foo\n$0\nbar';
			snippetController.insert(codeSnippet);

			assert.strictEqual(editor.getSelections()!.length, 2);
			const [first, second] = editor.getSelections()!;
			assert.ok(first.equalsRange({ startLineNumber: 2, startColumn: 1, endLineNumber: 2, endColumn: 1 }), first.toString());
			assert.ok(second.equalsRange({ startLineNumber: 4, startColumn: 1, endLineNumber: 4, endColumn: 1 }), second.toString());
		});

		snippetTest((editor, codeSnippet, snippetController) => {
			editor.setSelections([
				new Selection(1, 1, 1, 1),
				new Selection(1, 5, 1, 5),
			]);

			codeSnippet = 'foo\n$0\nbar';
			snippetController.insert(codeSnippet);

			assert.strictEqual(editor.getSelections()!.length, 2);
			const [first, second] = editor.getSelections()!;
			assert.ok(first.equalsRange({ startLineNumber: 2, startColumn: 1, endLineNumber: 2, endColumn: 1 }), first.toString());
			assert.ok(second.equalsRange({ startLineNumber: 4, startColumn: 1, endLineNumber: 4, endColumn: 1 }), second.toString());
		});

		snippetTest((editor, codeSnippet, snippetController) => {
			editor.setSelections([
				new Selection(2, 7, 2, 7),
			]);

			codeSnippet = 'xo$0r';
			snippetController.insert(codeSnippet, { overwriteBefore: 1 });

			assert.strictEqual(editor.getSelections()!.length, 1);
			assert.ok(editor.getSelection()!.equalsRange({ startLineNumber: 2, startColumn: 8, endColumn: 8, endLineNumber: 2 }));
		});
	});

	test('Final tabstop, #11742 simple', () => {
		snippetTest((editor, codeSnippet, controller) => {

			editor.setSelection(new Selection(1, 19, 1, 19));

			codeSnippet = '{{% url_**$1** %}}';
			controller.insert(codeSnippet, { overwriteBefore: 2 });

			assert.strictEqual(editor.getSelections()!.length, 1);
			assert.ok(editor.getSelection()!.equalsRange({ startLineNumber: 1, startColumn: 27, endLineNumber: 1, endColumn: 27 }));
			assert.strictEqual(editor.getModel()!.getValue(), 'example example {{% url_**** %}}');

		}, ['example example sc']);

		snippetTest((editor, codeSnippet, controller) => {

			editor.setSelection(new Selection(1, 3, 1, 3));

			codeSnippet = [
				'afterEach((done) => {',
				'\t${1}test',
				'});'
			].join('\n');

			controller.insert(codeSnippet, { overwriteBefore: 2 });

			assert.strictEqual(editor.getSelections()!.length, 1);
			assert.ok(editor.getSelection()!.equalsRange({ startLineNumber: 2, startColumn: 2, endLineNumber: 2, endColumn: 2 }), editor.getSelection()!.toString());
			assert.strictEqual(editor.getModel()!.getValue(), 'afterEach((done) => {\n\ttest\n});');

		}, ['af']);

		snippetTest((editor, codeSnippet, controller) => {

			editor.setSelection(new Selection(1, 3, 1, 3));

			codeSnippet = [
				'afterEach((done) => {',
				'${1}\ttest',
				'});'
			].join('\n');

			controller.insert(codeSnippet, { overwriteBefore: 2 });

			assert.strictEqual(editor.getSelections()!.length, 1);
			assert.ok(editor.getSelection()!.equalsRange({ startLineNumber: 2, startColumn: 1, endLineNumber: 2, endColumn: 1 }), editor.getSelection()!.toString());
			assert.strictEqual(editor.getModel()!.getValue(), 'afterEach((done) => {\n\ttest\n});');

		}, ['af']);

		snippetTest((editor, codeSnippet, controller) => {

			editor.setSelection(new Selection(1, 9, 1, 9));

			codeSnippet = [
				'aft${1}er'
			].join('\n');

			controller.insert(codeSnippet, { overwriteBefore: 8 });

			assert.strictEqual(editor.getModel()!.getValue(), 'after');
			assert.strictEqual(editor.getSelections()!.length, 1);
			assert.ok(editor.getSelection()!.equalsRange({ startLineNumber: 1, startColumn: 4, endLineNumber: 1, endColumn: 4 }), editor.getSelection()!.toString());

		}, ['afterone']);
	});

	test('Final tabstop, #11742 different indents', () => {

		snippetTest((editor, codeSnippet, controller) => {

			editor.setSelections([
				new Selection(2, 4, 2, 4),
				new Selection(1, 3, 1, 3)
			]);

			codeSnippet = [
				'afterEach((done) => {',
				'\t${0}test',
				'});'
			].join('\n');

			controller.insert(codeSnippet, { overwriteBefore: 2 });

			assert.strictEqual(editor.getSelections()!.length, 2);
			const [first, second] = editor.getSelections()!;

			assert.ok(first.equalsRange({ startLineNumber: 5, startColumn: 3, endLineNumber: 5, endColumn: 3 }), first.toString());
			assert.ok(second.equalsRange({ startLineNumber: 2, startColumn: 2, endLineNumber: 2, endColumn: 2 }), second.toString());

		}, ['af', '\taf']);
	});

	test('Final tabstop, #11890 stay at the beginning', () => {

		snippetTest((editor, codeSnippet, controller) => {

			editor.setSelections([
				new Selection(1, 5, 1, 5)
			]);

			codeSnippet = [
				'afterEach((done) => {',
				'${1}\ttest',
				'});'
			].join('\n');

			controller.insert(codeSnippet, { overwriteBefore: 2 });

			assert.strictEqual(editor.getSelections()!.length, 1);
			const [first] = editor.getSelections()!;

			assert.ok(first.equalsRange({ startLineNumber: 2, startColumn: 3, endLineNumber: 2, endColumn: 3 }), first.toString());

		}, ['  af']);
	});

	test('Final tabstop, no tabstop', () => {

		snippetTest((editor, codeSnippet, controller) => {

			editor.setSelections([
				new Selection(1, 3, 1, 3)
			]);

			codeSnippet = 'afterEach';

			controller.insert(codeSnippet, { overwriteBefore: 2 });

			assert.ok(editor.getSelection()!.equalsRange({ startLineNumber: 1, startColumn: 10, endLineNumber: 1, endColumn: 10 }));

		}, ['af', '\taf']);
	});

	test('Multiple cursor and overwriteBefore/After, issue #11060', () => {

		snippetTest((editor, codeSnippet, controller) => {

			editor.setSelections([
				new Selection(1, 7, 1, 7),
				new Selection(2, 4, 2, 4)
			]);

			codeSnippet = '_foo';
			controller.insert(codeSnippet, { overwriteBefore: 1 });
			assert.strictEqual(editor.getModel()!.getValue(), 'this._foo\nabc_foo');

		}, ['this._', 'abc']);

		snippetTest((editor, codeSnippet, controller) => {

			editor.setSelections([
				new Selection(1, 7, 1, 7),
				new Selection(2, 4, 2, 4)
			]);

			codeSnippet = 'XX';
			controller.insert(codeSnippet, { overwriteBefore: 1 });
			assert.strictEqual(editor.getModel()!.getValue(), 'this.XX\nabcXX');

		}, ['this._', 'abc']);

		snippetTest((editor, codeSnippet, controller) => {

			editor.setSelections([
				new Selection(1, 7, 1, 7),
				new Selection(2, 4, 2, 4),
				new Selection(3, 5, 3, 5)
			]);

			codeSnippet = '_foo';
			controller.insert(codeSnippet, { overwriteBefore: 1 });
			assert.strictEqual(editor.getModel()!.getValue(), 'this._foo\nabc_foo\ndef_foo');

		}, ['this._', 'abc', 'def_']);

		snippetTest((editor, codeSnippet, controller) => {

			editor.setSelections([
				new Selection(1, 7, 1, 7), // primary at `this._`
				new Selection(2, 4, 2, 4),
				new Selection(3, 6, 3, 6)
			]);

			codeSnippet = '._foo';
			controller.insert(codeSnippet, { overwriteBefore: 2 });
			assert.strictEqual(editor.getModel()!.getValue(), 'this._foo\nabc._foo\ndef._foo');

		}, ['this._', 'abc', 'def._']);

		snippetTest((editor, codeSnippet, controller) => {

			editor.setSelections([
				new Selection(3, 6, 3, 6), // primary at `def._`
				new Selection(1, 7, 1, 7),
				new Selection(2, 4, 2, 4),
			]);

			codeSnippet = '._foo';
			controller.insert(codeSnippet, { overwriteBefore: 2 });
			assert.strictEqual(editor.getModel()!.getValue(), 'this._foo\nabc._foo\ndef._foo');

		}, ['this._', 'abc', 'def._']);

		snippetTest((editor, codeSnippet, controller) => {

			editor.setSelections([
				new Selection(2, 4, 2, 4), // primary at `abc`
				new Selection(3, 6, 3, 6),
				new Selection(1, 7, 1, 7),
			]);

			codeSnippet = '._foo';
			controller.insert(codeSnippet, { overwriteBefore: 2 });
			assert.strictEqual(editor.getModel()!.getValue(), 'this._._foo\na._foo\ndef._._foo');

		}, ['this._', 'abc', 'def._']);

	});

	test('Multiple cursor and overwriteBefore/After, #16277', () => {
		snippetTest((editor, codeSnippet, controller) => {

			editor.setSelections([
				new Selection(1, 5, 1, 5),
				new Selection(2, 5, 2, 5),
			]);

			codeSnippet = 'document';
			controller.insert(codeSnippet, { overwriteBefore: 3 });
			assert.strictEqual(editor.getModel()!.getValue(), '{document}\n{document && true}');

		}, ['{foo}', '{foo && true}']);
	});

	test('Insert snippet twice, #19449', () => {

		snippetTest((editor, codeSnippet, controller) => {

			editor.setSelections([
				new Selection(1, 1, 1, 1)
			]);

			codeSnippet = 'for (var ${1:i}=0; ${1:i}<len; ${1:i}++) { $0 }';
			controller.insert(codeSnippet);
			assert.strictEqual(editor.getModel()!.getValue(), 'for (var i=0; i<len; i++) {  }for (var i=0; i<len; i++) {  }');

		}, ['for (var i=0; i<len; i++) {  }']);


		snippetTest((editor, codeSnippet, controller) => {

			editor.setSelections([
				new Selection(1, 1, 1, 1)
			]);

			codeSnippet = 'for (let ${1:i}=0; ${1:i}<len; ${1:i}++) { $0 }';
			controller.insert(codeSnippet);
			assert.strictEqual(editor.getModel()!.getValue(), 'for (let i=0; i<len; i++) {  }for (var i=0; i<len; i++) {  }');

		}, ['for (var i=0; i<len; i++) {  }']);

	});
});
```

--------------------------------------------------------------------------------

````
