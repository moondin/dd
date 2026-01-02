---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 235
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 235 of 552)

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

---[FILE: src/vs/editor/contrib/parameterHints/test/browser/parameterHintsModel.test.ts]---
Location: vscode-main/src/vs/editor/contrib/parameterHints/test/browser/parameterHintsModel.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { promiseWithResolvers } from '../../../../../base/common/async.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { URI } from '../../../../../base/common/uri.js';
import { runWithFakedTimers } from '../../../../../base/test/common/timeTravelScheduler.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { Position } from '../../../../common/core/position.js';
import { Handler } from '../../../../common/editorCommon.js';
import { LanguageFeatureRegistry } from '../../../../common/languageFeatureRegistry.js';
import * as languages from '../../../../common/languages.js';
import { ITextModel } from '../../../../common/model.js';
import { ParameterHintsModel } from '../../browser/parameterHintsModel.js';
import { createTestCodeEditor } from '../../../../test/browser/testCodeEditor.js';
import { createTextModel } from '../../../../test/common/testTextModel.js';
import { ServiceCollection } from '../../../../../platform/instantiation/common/serviceCollection.js';
import { InMemoryStorageService, IStorageService } from '../../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { NullTelemetryService } from '../../../../../platform/telemetry/common/telemetryUtils.js';

const mockFile = URI.parse('test:somefile.ttt');
const mockFileSelector = { scheme: 'test' };


const emptySigHelp: languages.SignatureHelp = {
	signatures: [{
		label: 'none',
		parameters: []
	}],
	activeParameter: 0,
	activeSignature: 0
};

const emptySigHelpResult: languages.SignatureHelpResult = {
	value: emptySigHelp,
	dispose: () => { }
};

suite('ParameterHintsModel', () => {
	const disposables = new DisposableStore();
	let registry: LanguageFeatureRegistry<languages.SignatureHelpProvider>;

	setup(() => {
		disposables.clear();
		registry = new LanguageFeatureRegistry<languages.SignatureHelpProvider>();
	});

	teardown(() => {
		disposables.clear();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	function createMockEditor(fileContents: string) {
		const textModel = disposables.add(createTextModel(fileContents, undefined, undefined, mockFile));
		const editor = disposables.add(createTestCodeEditor(textModel, {
			serviceCollection: new ServiceCollection(
				[ITelemetryService, NullTelemetryService],
				[IStorageService, disposables.add(new InMemoryStorageService())]
			)
		}));
		return editor;
	}

	function getNextHint(model: ParameterHintsModel) {
		return new Promise<languages.SignatureHelpResult | undefined>(resolve => {
			const sub = disposables.add(model.onChangedHints(e => {
				sub.dispose();
				return resolve(e ? { value: e, dispose: () => { } } : undefined);
			}));
		});
	}

	test('Provider should get trigger character on type', async () => {
		const { promise: donePromise, resolve: done } = promiseWithResolvers<void>();

		const triggerChar = '(';

		const editor = createMockEditor('');
		disposables.add(new ParameterHintsModel(editor, registry));

		disposables.add(registry.register(mockFileSelector, new class implements languages.SignatureHelpProvider {
			signatureHelpTriggerCharacters = [triggerChar];
			signatureHelpRetriggerCharacters = [];

			provideSignatureHelp(_model: ITextModel, _position: Position, _token: CancellationToken, context: languages.SignatureHelpContext) {
				assert.strictEqual(context.triggerKind, languages.SignatureHelpTriggerKind.TriggerCharacter);
				assert.strictEqual(context.triggerCharacter, triggerChar);
				done();
				return undefined;
			}
		}));

		await runWithFakedTimers({ useFakeTimers: true }, async () => {
			editor.trigger('keyboard', Handler.Type, { text: triggerChar });
			await donePromise;
		});
	});

	test('Provider should be retriggered if already active', async () => {
		const { promise: donePromise, resolve: done } = promiseWithResolvers<void>();

		const triggerChar = '(';

		const editor = createMockEditor('');
		disposables.add(new ParameterHintsModel(editor, registry));

		let invokeCount = 0;
		disposables.add(registry.register(mockFileSelector, new class implements languages.SignatureHelpProvider {
			signatureHelpTriggerCharacters = [triggerChar];
			signatureHelpRetriggerCharacters = [];

			provideSignatureHelp(_model: ITextModel, _position: Position, _token: CancellationToken, context: languages.SignatureHelpContext): languages.SignatureHelpResult | Promise<languages.SignatureHelpResult> {
				++invokeCount;
				try {
					if (invokeCount === 1) {
						assert.strictEqual(context.triggerKind, languages.SignatureHelpTriggerKind.TriggerCharacter);
						assert.strictEqual(context.triggerCharacter, triggerChar);
						assert.strictEqual(context.isRetrigger, false);
						assert.strictEqual(context.activeSignatureHelp, undefined);

						// Retrigger
						setTimeout(() => editor.trigger('keyboard', Handler.Type, { text: triggerChar }), 0);
					} else {
						assert.strictEqual(invokeCount, 2);
						assert.strictEqual(context.triggerKind, languages.SignatureHelpTriggerKind.TriggerCharacter);
						assert.strictEqual(context.isRetrigger, true);
						assert.strictEqual(context.triggerCharacter, triggerChar);
						assert.strictEqual(context.activeSignatureHelp, emptySigHelp);

						done();
					}
					return emptySigHelpResult;
				} catch (err) {
					console.error(err);
					throw err;
				}
			}
		}));

		await runWithFakedTimers({ useFakeTimers: true }, async () => {
			editor.trigger('keyboard', Handler.Type, { text: triggerChar });
			await donePromise;
		});
	});

	test('Provider should not be retriggered if previous help is canceled first', async () => {
		const { promise: donePromise, resolve: done } = promiseWithResolvers<void>();

		const triggerChar = '(';

		const editor = createMockEditor('');
		const hintModel = disposables.add(new ParameterHintsModel(editor, registry));

		let invokeCount = 0;
		disposables.add(registry.register(mockFileSelector, new class implements languages.SignatureHelpProvider {
			signatureHelpTriggerCharacters = [triggerChar];
			signatureHelpRetriggerCharacters = [];

			provideSignatureHelp(_model: ITextModel, _position: Position, _token: CancellationToken, context: languages.SignatureHelpContext): languages.SignatureHelpResult | Promise<languages.SignatureHelpResult> {
				try {
					++invokeCount;
					if (invokeCount === 1) {
						assert.strictEqual(context.triggerKind, languages.SignatureHelpTriggerKind.TriggerCharacter);
						assert.strictEqual(context.triggerCharacter, triggerChar);
						assert.strictEqual(context.isRetrigger, false);
						assert.strictEqual(context.activeSignatureHelp, undefined);

						// Cancel and retrigger
						hintModel.cancel();
						editor.trigger('keyboard', Handler.Type, { text: triggerChar });
					} else {
						assert.strictEqual(invokeCount, 2);
						assert.strictEqual(context.triggerKind, languages.SignatureHelpTriggerKind.TriggerCharacter);
						assert.strictEqual(context.triggerCharacter, triggerChar);
						assert.strictEqual(context.isRetrigger, true);
						assert.strictEqual(context.activeSignatureHelp, undefined);
						done();
					}
					return emptySigHelpResult;
				} catch (err) {
					console.error(err);
					throw err;
				}
			}
		}));

		await runWithFakedTimers({ useFakeTimers: true }, () => {
			editor.trigger('keyboard', Handler.Type, { text: triggerChar });
			return donePromise;
		});
	});

	test('Provider should get last trigger character when triggered multiple times and only be invoked once', async () => {
		const { promise: donePromise, resolve: done } = promiseWithResolvers<void>();

		const editor = createMockEditor('');
		disposables.add(new ParameterHintsModel(editor, registry, 5));

		let invokeCount = 0;
		disposables.add(registry.register(mockFileSelector, new class implements languages.SignatureHelpProvider {
			signatureHelpTriggerCharacters = ['a', 'b', 'c'];
			signatureHelpRetriggerCharacters = [];

			provideSignatureHelp(_model: ITextModel, _position: Position, _token: CancellationToken, context: languages.SignatureHelpContext) {
				try {
					++invokeCount;

					assert.strictEqual(context.triggerKind, languages.SignatureHelpTriggerKind.TriggerCharacter);
					assert.strictEqual(context.isRetrigger, false);
					assert.strictEqual(context.triggerCharacter, 'c');

					// Give some time to allow for later triggers
					setTimeout(() => {
						assert.strictEqual(invokeCount, 1);

						done();
					}, 50);
					return undefined;
				} catch (err) {
					console.error(err);
					throw err;
				}
			}
		}));

		await runWithFakedTimers({ useFakeTimers: true }, async () => {
			editor.trigger('keyboard', Handler.Type, { text: 'a' });
			editor.trigger('keyboard', Handler.Type, { text: 'b' });
			editor.trigger('keyboard', Handler.Type, { text: 'c' });

			await donePromise;
		});
	});

	test('Provider should be retriggered if already active', async () => {
		const { promise: donePromise, resolve: done } = promiseWithResolvers<void>();

		const editor = createMockEditor('');
		disposables.add(new ParameterHintsModel(editor, registry, 5));

		let invokeCount = 0;

		disposables.add(registry.register(mockFileSelector, new class implements languages.SignatureHelpProvider {
			signatureHelpTriggerCharacters = ['a', 'b'];
			signatureHelpRetriggerCharacters = [];

			provideSignatureHelp(_model: ITextModel, _position: Position, _token: CancellationToken, context: languages.SignatureHelpContext): languages.SignatureHelpResult | Promise<languages.SignatureHelpResult> {
				try {
					++invokeCount;
					if (invokeCount === 1) {
						assert.strictEqual(context.triggerKind, languages.SignatureHelpTriggerKind.TriggerCharacter);
						assert.strictEqual(context.triggerCharacter, 'a');

						// retrigger after delay for widget to show up
						setTimeout(() => editor.trigger('keyboard', Handler.Type, { text: 'b' }), 50);
					} else if (invokeCount === 2) {
						assert.strictEqual(context.triggerKind, languages.SignatureHelpTriggerKind.TriggerCharacter);
						assert.ok(context.isRetrigger);
						assert.strictEqual(context.triggerCharacter, 'b');
						done();
					} else {
						assert.fail('Unexpected invoke');
					}

					return emptySigHelpResult;
				} catch (err) {
					console.error(err);
					throw err;
				}
			}
		}));

		await runWithFakedTimers({ useFakeTimers: true }, () => {
			editor.trigger('keyboard', Handler.Type, { text: 'a' });
			return donePromise;
		});
	});

	test('Should cancel existing request when new request comes in', async () => {

		const editor = createMockEditor('abc def');
		const hintsModel = disposables.add(new ParameterHintsModel(editor, registry));

		let didRequestCancellationOf = -1;
		let invokeCount = 0;
		const longRunningProvider = new class implements languages.SignatureHelpProvider {
			signatureHelpTriggerCharacters = [];
			signatureHelpRetriggerCharacters = [];


			provideSignatureHelp(_model: ITextModel, _position: Position, token: CancellationToken): languages.SignatureHelpResult | Promise<languages.SignatureHelpResult> {
				try {
					const count = invokeCount++;
					disposables.add(token.onCancellationRequested(() => { didRequestCancellationOf = count; }));

					// retrigger on first request
					if (count === 0) {
						hintsModel.trigger({ triggerKind: languages.SignatureHelpTriggerKind.Invoke }, 0);
					}

					return new Promise<languages.SignatureHelpResult>(resolve => {
						setTimeout(() => {
							resolve({
								value: {
									signatures: [{
										label: '' + count,
										parameters: []
									}],
									activeParameter: 0,
									activeSignature: 0
								},
								dispose: () => { }
							});
						}, 100);
					});
				} catch (err) {
					console.error(err);
					throw err;
				}
			}
		};

		disposables.add(registry.register(mockFileSelector, longRunningProvider));

		await runWithFakedTimers({ useFakeTimers: true }, async () => {

			hintsModel.trigger({ triggerKind: languages.SignatureHelpTriggerKind.Invoke }, 0);
			assert.strictEqual(-1, didRequestCancellationOf);

			return new Promise<void>((resolve, reject) =>
				disposables.add(hintsModel.onChangedHints(newParamterHints => {
					try {
						assert.strictEqual(0, didRequestCancellationOf);
						assert.strictEqual('1', newParamterHints!.signatures[0].label);
						resolve();
					} catch (e) {
						reject(e);
					}
				})));
		});
	});

	test('Provider should be retriggered by retrigger character', async () => {
		const { promise: donePromise, resolve: done } = promiseWithResolvers<void>();

		const triggerChar = 'a';
		const retriggerChar = 'b';

		const editor = createMockEditor('');
		disposables.add(new ParameterHintsModel(editor, registry, 5));

		let invokeCount = 0;
		disposables.add(registry.register(mockFileSelector, new class implements languages.SignatureHelpProvider {
			signatureHelpTriggerCharacters = [triggerChar];
			signatureHelpRetriggerCharacters = [retriggerChar];

			provideSignatureHelp(_model: ITextModel, _position: Position, _token: CancellationToken, context: languages.SignatureHelpContext): languages.SignatureHelpResult | Promise<languages.SignatureHelpResult> {
				try {
					++invokeCount;
					if (invokeCount === 1) {
						assert.strictEqual(context.triggerKind, languages.SignatureHelpTriggerKind.TriggerCharacter);
						assert.strictEqual(context.triggerCharacter, triggerChar);

						// retrigger after delay for widget to show up
						setTimeout(() => editor.trigger('keyboard', Handler.Type, { text: retriggerChar }), 50);
					} else if (invokeCount === 2) {
						assert.strictEqual(context.triggerKind, languages.SignatureHelpTriggerKind.TriggerCharacter);
						assert.ok(context.isRetrigger);
						assert.strictEqual(context.triggerCharacter, retriggerChar);
						done();
					} else {
						assert.fail('Unexpected invoke');
					}

					return emptySigHelpResult;
				} catch (err) {
					console.error(err);
					throw err;
				}
			}
		}));

		await runWithFakedTimers({ useFakeTimers: true }, async () => {
			// This should not trigger anything
			editor.trigger('keyboard', Handler.Type, { text: retriggerChar });

			// But a trigger character should
			editor.trigger('keyboard', Handler.Type, { text: triggerChar });

			return donePromise;
		});
	});

	test('should use first result from multiple providers', async () => {
		const triggerChar = 'a';
		const firstProviderId = 'firstProvider';
		const secondProviderId = 'secondProvider';
		const paramterLabel = 'parameter';

		const editor = createMockEditor('');
		const model = disposables.add(new ParameterHintsModel(editor, registry, 5));

		disposables.add(registry.register(mockFileSelector, new class implements languages.SignatureHelpProvider {
			signatureHelpTriggerCharacters = [triggerChar];
			signatureHelpRetriggerCharacters = [];

			async provideSignatureHelp(_model: ITextModel, _position: Position, _token: CancellationToken, context: languages.SignatureHelpContext): Promise<languages.SignatureHelpResult | undefined> {
				try {
					if (!context.isRetrigger) {
						// retrigger after delay for widget to show up
						setTimeout(() => editor.trigger('keyboard', Handler.Type, { text: triggerChar }), 50);

						return {
							value: {
								activeParameter: 0,
								activeSignature: 0,
								signatures: [{
									label: firstProviderId,
									parameters: [
										{ label: paramterLabel }
									]
								}]
							},
							dispose: () => { }
						};
					}

					return undefined;
				} catch (err) {
					console.error(err);
					throw err;
				}
			}
		}));

		disposables.add(registry.register(mockFileSelector, new class implements languages.SignatureHelpProvider {
			signatureHelpTriggerCharacters = [triggerChar];
			signatureHelpRetriggerCharacters = [];

			async provideSignatureHelp(_model: ITextModel, _position: Position, _token: CancellationToken, context: languages.SignatureHelpContext): Promise<languages.SignatureHelpResult | undefined> {
				if (context.isRetrigger) {
					return {
						value: {
							activeParameter: 0,
							activeSignature: context.activeSignatureHelp ? context.activeSignatureHelp.activeSignature + 1 : 0,
							signatures: [{
								label: secondProviderId,
								parameters: context.activeSignatureHelp ? context.activeSignatureHelp.signatures[0].parameters : []
							}]
						},
						dispose: () => { }
					};
				}

				return undefined;
			}
		}));

		await runWithFakedTimers({ useFakeTimers: true }, async () => {
			editor.trigger('keyboard', Handler.Type, { text: triggerChar });

			const firstHint = (await getNextHint(model))!.value;
			assert.strictEqual(firstHint.signatures[0].label, firstProviderId);
			assert.strictEqual(firstHint.activeSignature, 0);
			assert.strictEqual(firstHint.signatures[0].parameters[0].label, paramterLabel);

			const secondHint = (await getNextHint(model))!.value;
			assert.strictEqual(secondHint.signatures[0].label, secondProviderId);
			assert.strictEqual(secondHint.activeSignature, 1);
			assert.strictEqual(secondHint.signatures[0].parameters[0].label, paramterLabel);
		});
	});

	test('Quick typing should use the first trigger character', async () => {
		const editor = createMockEditor('');
		const model = disposables.add(new ParameterHintsModel(editor, registry, 50));

		const triggerCharacter = 'a';

		let invokeCount = 0;
		disposables.add(registry.register(mockFileSelector, new class implements languages.SignatureHelpProvider {
			signatureHelpTriggerCharacters = [triggerCharacter];
			signatureHelpRetriggerCharacters = [];

			provideSignatureHelp(_model: ITextModel, _position: Position, _token: CancellationToken, context: languages.SignatureHelpContext): languages.SignatureHelpResult | Promise<languages.SignatureHelpResult> {
				try {
					++invokeCount;

					if (invokeCount === 1) {
						assert.strictEqual(context.triggerKind, languages.SignatureHelpTriggerKind.TriggerCharacter);
						assert.strictEqual(context.triggerCharacter, triggerCharacter);
					} else {
						assert.fail('Unexpected invoke');
					}

					return emptySigHelpResult;
				} catch (err) {
					console.error(err);
					throw err;
				}
			}
		}));

		await runWithFakedTimers({ useFakeTimers: true }, async () => {
			editor.trigger('keyboard', Handler.Type, { text: triggerCharacter });
			editor.trigger('keyboard', Handler.Type, { text: 'x' });

			await getNextHint(model);
		});
	});

	test('Retrigger while a pending resolve is still going on should preserve last active signature #96702', async () => {
		const { promise: donePromise, resolve: done } = promiseWithResolvers<void>();

		const editor = createMockEditor('');
		const model = disposables.add(new ParameterHintsModel(editor, registry, 50));

		const triggerCharacter = 'a';
		const retriggerCharacter = 'b';

		let invokeCount = 0;
		disposables.add(registry.register(mockFileSelector, new class implements languages.SignatureHelpProvider {
			signatureHelpTriggerCharacters = [triggerCharacter];
			signatureHelpRetriggerCharacters = [retriggerCharacter];

			async provideSignatureHelp(_model: ITextModel, _position: Position, _token: CancellationToken, context: languages.SignatureHelpContext): Promise<languages.SignatureHelpResult> {
				try {
					++invokeCount;

					if (invokeCount === 1) {
						assert.strictEqual(context.triggerKind, languages.SignatureHelpTriggerKind.TriggerCharacter);
						assert.strictEqual(context.triggerCharacter, triggerCharacter);
						setTimeout(() => editor.trigger('keyboard', Handler.Type, { text: retriggerCharacter }), 50);
					} else if (invokeCount === 2) {
						// Trigger again while we wait for resolve to take place
						setTimeout(() => editor.trigger('keyboard', Handler.Type, { text: retriggerCharacter }), 50);
						await new Promise(resolve => setTimeout(resolve, 1000));
					} else if (invokeCount === 3) {
						// Make sure that in a retrigger during a pending resolve, we still have the old active signature.
						assert.strictEqual(context.activeSignatureHelp, emptySigHelp);
						done();
					} else {
						assert.fail('Unexpected invoke');
					}

					return emptySigHelpResult;
				} catch (err) {
					console.error(err);
					done(err);
					throw err;
				}
			}
		}));

		await runWithFakedTimers({ useFakeTimers: true }, async () => {

			editor.trigger('keyboard', Handler.Type, { text: triggerCharacter });

			await getNextHint(model);
			await getNextHint(model);

			await donePromise;
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/peekView/browser/peekView.ts]---
Location: vscode-main/src/vs/editor/contrib/peekView/browser/peekView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { IMouseEvent } from '../../../../base/browser/mouseEvent.js';
import { ActionBar, ActionsOrientation, IActionBarOptions } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { Action } from '../../../../base/common/actions.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { Color } from '../../../../base/common/color.js';
import { Emitter } from '../../../../base/common/event.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import * as objects from '../../../../base/common/objects.js';
import './media/peekViewWidget.css';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { EditorContributionInstantiation, registerEditorContribution } from '../../../browser/editorExtensions.js';
import { EmbeddedCodeEditorWidget } from '../../../browser/widget/codeEditor/embeddedCodeEditorWidget.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { IEditorContribution } from '../../../common/editorCommon.js';
import { IOptions, IStyles, ZoneWidget } from '../../zoneWidget/browser/zoneWidget.js';
import * as nls from '../../../../nls.js';
import { createActionViewItem } from '../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { createDecorator, IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { activeContrastBorder, contrastBorder, editorForeground, editorInfoForeground, registerColor } from '../../../../platform/theme/common/colorRegistry.js';
import { observableCodeEditor } from '../../../browser/observableCodeEditor.js';

export const IPeekViewService = createDecorator<IPeekViewService>('IPeekViewService');
export interface IPeekViewService {
	readonly _serviceBrand: undefined;
	addExclusiveWidget(editor: ICodeEditor, widget: PeekViewWidget): void;
}

registerSingleton(IPeekViewService, class implements IPeekViewService {
	declare readonly _serviceBrand: undefined;

	private readonly _widgets = new Map<ICodeEditor, { widget: PeekViewWidget; listener: IDisposable }>();

	addExclusiveWidget(editor: ICodeEditor, widget: PeekViewWidget): void {
		const existing = this._widgets.get(editor);
		if (existing) {
			existing.listener.dispose();
			existing.widget.dispose();
		}
		const remove = () => {
			const data = this._widgets.get(editor);
			if (data && data.widget === widget) {
				data.listener.dispose();
				this._widgets.delete(editor);
			}
		};
		this._widgets.set(editor, { widget, listener: widget.onDidClose(remove) });
	}
}, InstantiationType.Delayed);

export namespace PeekContext {
	export const inPeekEditor = new RawContextKey<boolean>('inReferenceSearchEditor', true, nls.localize('inReferenceSearchEditor', "Whether the current code editor is embedded inside peek"));
	export const notInPeekEditor = inPeekEditor.toNegated();
}

class PeekContextController implements IEditorContribution {

	static readonly ID = 'editor.contrib.referenceController';

	constructor(
		editor: ICodeEditor,
		@IContextKeyService contextKeyService: IContextKeyService
	) {
		if (editor instanceof EmbeddedCodeEditorWidget) {
			PeekContext.inPeekEditor.bindTo(contextKeyService);
		}
	}

	dispose(): void { }
}

registerEditorContribution(PeekContextController.ID, PeekContextController, EditorContributionInstantiation.Eager); // eager because it needs to define a context key

export interface IPeekViewStyles extends IStyles {
	headerBackgroundColor?: Color;
	primaryHeadingColor?: Color;
	secondaryHeadingColor?: Color;
}

export type IPeekViewOptions = IOptions & IPeekViewStyles & {
	supportOnTitleClick?: boolean;
};

const defaultOptions: IPeekViewOptions = {
	headerBackgroundColor: Color.white,
	primaryHeadingColor: Color.fromHex('#333333'),
	secondaryHeadingColor: Color.fromHex('#6c6c6cb3')
};

export abstract class PeekViewWidget extends ZoneWidget {

	declare readonly _serviceBrand: undefined;

	private readonly _onDidClose = new Emitter<PeekViewWidget>();
	readonly onDidClose = this._onDidClose.event;
	private disposed?: true;

	protected _headElement?: HTMLDivElement;
	protected _titleElement?: HTMLDivElement;
	protected _primaryHeading?: HTMLElement;
	protected _secondaryHeading?: HTMLElement;
	protected _metaHeading?: HTMLElement;
	protected _actionbarWidget?: ActionBar;
	protected _bodyElement?: HTMLDivElement;

	constructor(
		editor: ICodeEditor,
		options: IPeekViewOptions,
		@IInstantiationService protected readonly instantiationService: IInstantiationService
	) {
		super(editor, options);
		objects.mixin(this.options, defaultOptions, false);

		const e = observableCodeEditor(this.editor);
		e.openedPeekWidgets.set(e.openedPeekWidgets.get() + 1, undefined);
	}

	override dispose(): void {
		if (!this.disposed) {
			this.disposed = true; // prevent consumers who dispose on onDidClose from looping
			super.dispose();
			this._onDidClose.fire(this);

			const e = observableCodeEditor(this.editor);
			e.openedPeekWidgets.set(e.openedPeekWidgets.get() - 1, undefined);
		}
	}

	override style(styles: IPeekViewStyles): void {
		const options = <IPeekViewOptions>this.options;
		if (styles.headerBackgroundColor) {
			options.headerBackgroundColor = styles.headerBackgroundColor;
		}
		if (styles.primaryHeadingColor) {
			options.primaryHeadingColor = styles.primaryHeadingColor;
		}
		if (styles.secondaryHeadingColor) {
			options.secondaryHeadingColor = styles.secondaryHeadingColor;
		}
		super.style(styles);
	}

	protected override _applyStyles(): void {
		super._applyStyles();
		const options = <IPeekViewOptions>this.options;
		if (this._headElement && options.headerBackgroundColor) {
			this._headElement.style.backgroundColor = options.headerBackgroundColor.toString();
		}
		if (this._primaryHeading && options.primaryHeadingColor) {
			this._primaryHeading.style.color = options.primaryHeadingColor.toString();
		}
		if (this._secondaryHeading && options.secondaryHeadingColor) {
			this._secondaryHeading.style.color = options.secondaryHeadingColor.toString();
		}
		if (this._bodyElement && options.frameColor) {
			this._bodyElement.style.borderColor = options.frameColor.toString();
		}
	}

	protected _fillContainer(container: HTMLElement): void {
		this.setCssClass('peekview-widget');

		this._headElement = dom.$<HTMLDivElement>('.head');
		this._bodyElement = dom.$<HTMLDivElement>('.body');

		this._fillHead(this._headElement);
		this._fillBody(this._bodyElement);

		container.appendChild(this._headElement);
		container.appendChild(this._bodyElement);
	}

	protected _fillHead(container: HTMLElement, noCloseAction?: boolean): void {
		this._titleElement = dom.$('.peekview-title');
		if ((this.options as IPeekViewOptions).supportOnTitleClick) {
			this._titleElement.classList.add('clickable');
			dom.addStandardDisposableListener(this._titleElement, 'click', event => this._onTitleClick(event));
		}
		dom.append(this._headElement!, this._titleElement);

		this._fillTitleIcon(this._titleElement);
		this._primaryHeading = dom.$('span.filename');
		this._secondaryHeading = dom.$('span.dirname');
		this._metaHeading = dom.$('span.meta');
		dom.append(this._titleElement, this._primaryHeading, this._secondaryHeading, this._metaHeading);

		const actionsContainer = dom.$('.peekview-actions');
		dom.append(this._headElement!, actionsContainer);

		const actionBarOptions = this._getActionBarOptions();
		this._actionbarWidget = new ActionBar(actionsContainer, actionBarOptions);
		this._disposables.add(this._actionbarWidget);

		if (!noCloseAction) {
			this._actionbarWidget.push(this._disposables.add(new Action('peekview.close', nls.localize('label.close', "Close"), ThemeIcon.asClassName(Codicon.close), true, () => {
				this.dispose();
				return Promise.resolve();
			})), { label: false, icon: true });
		}
	}

	protected _fillTitleIcon(container: HTMLElement): void {
	}

	protected _getActionBarOptions(): IActionBarOptions {
		return {
			actionViewItemProvider: createActionViewItem.bind(undefined, this.instantiationService),
			orientation: ActionsOrientation.HORIZONTAL
		};
	}

	protected _onTitleClick(event: IMouseEvent): void {
		// implement me if supportOnTitleClick option is set
	}

	setTitle(primaryHeading: string, secondaryHeading?: string): void {
		if (this._primaryHeading && this._secondaryHeading) {
			this._primaryHeading.innerText = primaryHeading;
			this._primaryHeading.setAttribute('title', primaryHeading);
			if (secondaryHeading) {
				this._secondaryHeading.innerText = secondaryHeading;
			} else {
				dom.clearNode(this._secondaryHeading);
			}
		}
	}

	setMetaTitle(value: string): void {
		if (this._metaHeading) {
			if (value) {
				this._metaHeading.innerText = value;
				dom.show(this._metaHeading);
			} else {
				dom.hide(this._metaHeading);
			}
		}
	}

	protected abstract _fillBody(container: HTMLElement): void;

	protected override _doLayout(heightInPixel: number, widthInPixel: number): void {

		if (!this._isShowing && heightInPixel < 0) {
			// Looks like the view zone got folded away!
			this.dispose();
			return;
		}

		const headHeight = Math.ceil(this.editor.getOption(EditorOption.lineHeight) * 1.2);
		const bodyHeight = Math.round(heightInPixel - (headHeight + 1 /* the border-top width */));

		this._doLayoutHead(headHeight, widthInPixel);
		this._doLayoutBody(bodyHeight, widthInPixel);
	}

	protected _doLayoutHead(heightInPixel: number, widthInPixel: number): void {
		if (this._headElement) {
			this._headElement.style.height = `${heightInPixel}px`;
			this._headElement.style.lineHeight = this._headElement.style.height;
		}
	}

	protected _doLayoutBody(heightInPixel: number, widthInPixel: number): void {
		if (this._bodyElement) {
			this._bodyElement.style.height = `${heightInPixel}px`;
		}
	}
}


export const peekViewTitleBackground = registerColor('peekViewTitle.background', { dark: '#252526', light: '#F3F3F3', hcDark: Color.black, hcLight: Color.white }, nls.localize('peekViewTitleBackground', 'Background color of the peek view title area.'));
export const peekViewTitleForeground = registerColor('peekViewTitleLabel.foreground', { dark: Color.white, light: Color.black, hcDark: Color.white, hcLight: editorForeground }, nls.localize('peekViewTitleForeground', 'Color of the peek view title.'));
export const peekViewTitleInfoForeground = registerColor('peekViewTitleDescription.foreground', { dark: '#ccccccb3', light: '#616161', hcDark: '#FFFFFF99', hcLight: '#292929' }, nls.localize('peekViewTitleInfoForeground', 'Color of the peek view title info.'));
export const peekViewBorder = registerColor('peekView.border', { dark: editorInfoForeground, light: editorInfoForeground, hcDark: contrastBorder, hcLight: contrastBorder }, nls.localize('peekViewBorder', 'Color of the peek view borders and arrow.'));

export const peekViewResultsBackground = registerColor('peekViewResult.background', { dark: '#252526', light: '#F3F3F3', hcDark: Color.black, hcLight: Color.white }, nls.localize('peekViewResultsBackground', 'Background color of the peek view result list.'));
export const peekViewResultsMatchForeground = registerColor('peekViewResult.lineForeground', { dark: '#bbbbbb', light: '#646465', hcDark: Color.white, hcLight: editorForeground }, nls.localize('peekViewResultsMatchForeground', 'Foreground color for line nodes in the peek view result list.'));
export const peekViewResultsFileForeground = registerColor('peekViewResult.fileForeground', { dark: Color.white, light: '#1E1E1E', hcDark: Color.white, hcLight: editorForeground }, nls.localize('peekViewResultsFileForeground', 'Foreground color for file nodes in the peek view result list.'));
export const peekViewResultsSelectionBackground = registerColor('peekViewResult.selectionBackground', { dark: '#3399ff33', light: '#3399ff33', hcDark: null, hcLight: null }, nls.localize('peekViewResultsSelectionBackground', 'Background color of the selected entry in the peek view result list.'));
export const peekViewResultsSelectionForeground = registerColor('peekViewResult.selectionForeground', { dark: Color.white, light: '#6C6C6C', hcDark: Color.white, hcLight: editorForeground }, nls.localize('peekViewResultsSelectionForeground', 'Foreground color of the selected entry in the peek view result list.'));
export const peekViewEditorBackground = registerColor('peekViewEditor.background', { dark: '#001F33', light: '#F2F8FC', hcDark: Color.black, hcLight: Color.white }, nls.localize('peekViewEditorBackground', 'Background color of the peek view editor.'));
export const peekViewEditorGutterBackground = registerColor('peekViewEditorGutter.background', peekViewEditorBackground, nls.localize('peekViewEditorGutterBackground', 'Background color of the gutter in the peek view editor.'));
export const peekViewEditorStickyScrollBackground = registerColor('peekViewEditorStickyScroll.background', peekViewEditorBackground, nls.localize('peekViewEditorStickScrollBackground', 'Background color of sticky scroll in the peek view editor.'));
export const peekViewEditorStickyScrollGutterBackground = registerColor('peekViewEditorStickyScrollGutter.background', peekViewEditorBackground, nls.localize('peekViewEditorStickyScrollGutterBackground', 'Background color of the gutter part of sticky scroll in the peek view editor.'));

export const peekViewResultsMatchHighlight = registerColor('peekViewResult.matchHighlightBackground', { dark: '#ea5c004d', light: '#ea5c004d', hcDark: null, hcLight: null }, nls.localize('peekViewResultsMatchHighlight', 'Match highlight color in the peek view result list.'));
export const peekViewEditorMatchHighlight = registerColor('peekViewEditor.matchHighlightBackground', { dark: '#ff8f0099', light: '#f5d802de', hcDark: null, hcLight: null }, nls.localize('peekViewEditorMatchHighlight', 'Match highlight color in the peek view editor.'));
export const peekViewEditorMatchHighlightBorder = registerColor('peekViewEditor.matchHighlightBorder', { dark: null, light: null, hcDark: activeContrastBorder, hcLight: activeContrastBorder }, nls.localize('peekViewEditorMatchHighlightBorder', 'Match highlight border in the peek view editor.'));
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/peekView/browser/media/peekViewWidget.css]---
Location: vscode-main/src/vs/editor/contrib/peekView/browser/media/peekViewWidget.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-editor .peekview-widget .head {
	box-sizing: border-box;
	display: flex;
	justify-content: space-between;
	flex-wrap: nowrap;
}

.monaco-editor .peekview-widget .head .peekview-title {
	display: flex;
	align-items: baseline;
	font-size: 13px;
	margin-left: 20px;
	min-width: 0;
	text-overflow: ellipsis;
	overflow: hidden;
}

.monaco-editor .peekview-widget .head .peekview-title.clickable {
	cursor: pointer;
}

.monaco-editor .peekview-widget .head .peekview-title .dirname:not(:empty) {
	font-size: 0.9em;
	margin-left: 0.5em;
}

.monaco-editor .peekview-widget .head .peekview-title .meta {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.monaco-editor .peekview-widget .head .peekview-title .dirname {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.monaco-editor .peekview-widget .head .peekview-title .filename {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.monaco-editor .peekview-widget .head .peekview-title .meta:not(:empty)::before {
	content: '-';
	padding: 0 0.3em;
}

.monaco-editor .peekview-widget .head .peekview-actions {
	flex: 1;
	text-align: right;
	padding-right: 2px;
}

.monaco-editor .peekview-widget .head .peekview-actions > .monaco-action-bar {
	display: inline-block;
}

.monaco-editor .peekview-widget .head .peekview-actions > .monaco-action-bar,
.monaco-editor .peekview-widget .head .peekview-actions > .monaco-action-bar > .actions-container {
	height: 100%;
}

.monaco-editor .peekview-widget > .body {
	border-top: 1px solid;
	position: relative;
}

.monaco-editor .peekview-widget .head .peekview-title .codicon {
	margin-right: 4px;
	align-self: center;
}

.monaco-editor .peekview-widget .monaco-list .monaco-list-row.focused .codicon {
	color: inherit !important;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/placeholderText/browser/placeholderText.contribution.ts]---
Location: vscode-main/src/vs/editor/contrib/placeholderText/browser/placeholderText.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './placeholderText.css';
import { EditorContributionInstantiation, registerEditorContribution } from '../../../browser/editorExtensions.js';
import { ghostTextForeground } from '../../../common/core/editorColorRegistry.js';
import { localize } from '../../../../nls.js';
import { registerColor } from '../../../../platform/theme/common/colorUtils.js';
import { PlaceholderTextContribution } from './placeholderTextContribution.js';
import { wrapInReloadableClass1 } from '../../../../platform/observable/common/wrapInReloadableClass.js';

registerEditorContribution(PlaceholderTextContribution.ID, wrapInReloadableClass1(() => PlaceholderTextContribution), EditorContributionInstantiation.Eager);

registerColor('editor.placeholder.foreground', ghostTextForeground, localize('placeholderForeground', 'Foreground color of the placeholder text in the editor.'));
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/placeholderText/browser/placeholderText.css]---
Location: vscode-main/src/vs/editor/contrib/placeholderText/browser/placeholderText.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-editor {
	.editorPlaceholder {
		top: 0px;
		position: absolute;
		overflow: hidden;
		text-overflow: ellipsis;
		text-wrap: nowrap;
		pointer-events: none;

		color: var(--vscode-editor-placeholder-foreground);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/placeholderText/browser/placeholderTextContribution.ts]---
Location: vscode-main/src/vs/editor/contrib/placeholderText/browser/placeholderTextContribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { h } from '../../../../base/browser/dom.js';
import { structuralEquals } from '../../../../base/common/equals.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { autorun, constObservable, DebugOwner, derivedObservableWithCache, derivedOpts, derived, IObservable, IReader } from '../../../../base/common/observable.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { observableCodeEditor } from '../../../browser/observableCodeEditor.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { IEditorContribution } from '../../../common/editorCommon.js';

/**
 * Use the editor option to set the placeholder text.
*/
export class PlaceholderTextContribution extends Disposable implements IEditorContribution {
	public static get(editor: ICodeEditor): PlaceholderTextContribution {
		return editor.getContribution<PlaceholderTextContribution>(PlaceholderTextContribution.ID)!;
	}

	public static readonly ID = 'editor.contrib.placeholderText';
	private readonly _editorObs;

	private readonly _placeholderText;

	private readonly _state;

	private readonly _shouldViewBeAlive;

	private readonly _view;

	constructor(
		private readonly _editor: ICodeEditor,
	) {
		super();
		this._editorObs = observableCodeEditor(this._editor);
		this._placeholderText = this._editorObs.getOption(EditorOption.placeholder);
		this._state = derivedOpts<{ placeholder: string } | undefined>({ owner: this, equalsFn: structuralEquals }, reader => {
			const p = this._placeholderText.read(reader);
			if (!p) { return undefined; }
			if (!this._editorObs.valueIsEmpty.read(reader)) { return undefined; }
			return { placeholder: p };
		});
		this._shouldViewBeAlive = isOrWasTrue(this, reader => this._state.read(reader)?.placeholder !== undefined);
		this._view = derived((reader) => {
			if (!this._shouldViewBeAlive.read(reader)) { return; }

			const element = h('div.editorPlaceholder');

			reader.store.add(autorun(reader => {
				const data = this._state.read(reader);
				const shouldBeVisibile = data?.placeholder !== undefined;
				element.root.style.display = shouldBeVisibile ? 'block' : 'none';
				element.root.innerText = data?.placeholder ?? '';
			}));
			reader.store.add(autorun(reader => {
				const info = this._editorObs.layoutInfo.read(reader);
				element.root.style.left = `${info.contentLeft}px`;
				element.root.style.width = (info.contentWidth - info.verticalScrollbarWidth) + 'px';
				element.root.style.top = `${this._editor.getTopForLineNumber(0)}px`;
			}));
			reader.store.add(autorun(reader => {
				element.root.style.fontFamily = this._editorObs.getOption(EditorOption.fontFamily).read(reader);
				element.root.style.fontSize = this._editorObs.getOption(EditorOption.fontSize).read(reader) + 'px';
				element.root.style.lineHeight = this._editorObs.getOption(EditorOption.lineHeight).read(reader) + 'px';
			}));
			reader.store.add(this._editorObs.createOverlayWidget({
				allowEditorOverflow: false,
				minContentWidthInPx: constObservable(0),
				position: constObservable(null),
				domNode: element.root,
			}));
		});
		this._view.recomputeInitiallyAndOnChange(this._store);
	}
}

function isOrWasTrue(owner: DebugOwner, fn: (reader: IReader) => boolean): IObservable<boolean> {
	return derivedObservableWithCache<boolean>(owner, (reader, lastValue) => {
		if (lastValue === true) { return true; }
		return fn(reader);
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/quickAccess/browser/commandsQuickAccess.ts]---
Location: vscode-main/src/vs/editor/contrib/quickAccess/browser/commandsQuickAccess.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { stripIcons } from '../../../../base/common/iconLabels.js';
import { IEditor } from '../../../common/editorCommon.js';
import { ILocalizedString } from '../../../../nls.js';
import { isLocalizedString } from '../../../../platform/action/common/action.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { AbstractCommandsQuickAccessProvider, ICommandQuickPick, ICommandsQuickAccessOptions } from '../../../../platform/quickinput/browser/commandsQuickAccess.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';

export abstract class AbstractEditorCommandsQuickAccessProvider extends AbstractCommandsQuickAccessProvider {

	constructor(
		options: ICommandsQuickAccessOptions,
		instantiationService: IInstantiationService,
		keybindingService: IKeybindingService,
		commandService: ICommandService,
		telemetryService: ITelemetryService,
		dialogService: IDialogService
	) {
		super(options, instantiationService, keybindingService, commandService, telemetryService, dialogService);
	}

	/**
	 * Subclasses to provide the current active editor control.
	 */
	protected abstract activeTextEditorControl: IEditor | undefined;

	protected getCodeEditorCommandPicks(): ICommandQuickPick[] {
		const activeTextEditorControl = this.activeTextEditorControl;
		if (!activeTextEditorControl) {
			return [];
		}

		const editorCommandPicks: ICommandQuickPick[] = [];
		for (const editorAction of activeTextEditorControl.getSupportedActions()) {
			let commandDescription: undefined | ILocalizedString;
			if (editorAction.metadata?.description) {
				if (isLocalizedString(editorAction.metadata.description)) {
					commandDescription = editorAction.metadata.description;
				} else {
					commandDescription = { original: editorAction.metadata.description, value: editorAction.metadata.description };
				}
			}
			editorCommandPicks.push({
				commandId: editorAction.id,
				commandAlias: editorAction.alias,
				commandDescription,
				label: stripIcons(editorAction.label) || editorAction.id,
			});
		}

		return editorCommandPicks;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/quickAccess/browser/editorNavigationQuickAccess.ts]---
Location: vscode-main/src/vs/editor/contrib/quickAccess/browser/editorNavigationQuickAccess.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Event } from '../../../../base/common/event.js';
import { createSingleCallFunction } from '../../../../base/common/functional.js';
import { DisposableStore, IDisposable, MutableDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { getCodeEditor, isDiffEditor } from '../../../browser/editorBrowser.js';
import { IRange } from '../../../common/core/range.js';
import { IDiffEditor, IEditor, ScrollType } from '../../../common/editorCommon.js';
import { IModelDeltaDecoration, ITextModel, OverviewRulerLane } from '../../../common/model.js';
import { overviewRulerRangeHighlight } from '../../../common/core/editorColorRegistry.js';
import { IQuickAccessProvider, IQuickAccessProviderRunOptions } from '../../../../platform/quickinput/common/quickAccess.js';
import { IKeyMods, IQuickPick, IQuickPickItem } from '../../../../platform/quickinput/common/quickInput.js';
import { themeColorFromId } from '../../../../platform/theme/common/themeService.js';
import { status } from '../../../../base/browser/ui/aria/aria.js';
import { TextEditorSelectionSource } from '../../../../platform/editor/common/editor.js';

interface IEditorLineDecoration {
	readonly rangeHighlightId: string;
	readonly overviewRulerDecorationId: string;
}

export interface IEditorNavigationQuickAccessOptions {
	canAcceptInBackground?: boolean;
}

export interface IQuickAccessTextEditorContext {

	/**
	 * The current active editor.
	 */
	readonly editor: IEditor;

	/**
	 * If defined, allows to restore the original view state
	 * the text editor had before quick access opened.
	 */
	restoreViewState?: () => void;
}

/**
 * A reusable quick access provider for the editor with support
 * for adding decorations for navigating in the currently active file
 * (for example "Go to line", "Go to symbol").
 */
export abstract class AbstractEditorNavigationQuickAccessProvider implements IQuickAccessProvider {

	constructor(protected options?: IEditorNavigationQuickAccessOptions) { }

	//#region Provider methods

	provide(picker: IQuickPick<IQuickPickItem, { useSeparators: true }>, token: CancellationToken, runOptions?: IQuickAccessProviderRunOptions): IDisposable {
		const disposables = new DisposableStore();

		// Apply options if any
		picker.canAcceptInBackground = !!this.options?.canAcceptInBackground;

		// Disable filtering & sorting, we control the results
		picker.matchOnLabel = picker.matchOnDescription = picker.matchOnDetail = picker.sortByLabel = false;

		// Provide based on current active editor
		const pickerDisposable = disposables.add(new MutableDisposable());
		pickerDisposable.value = this.doProvide(picker, token, runOptions);

		// Re-create whenever the active editor changes
		disposables.add(this.onDidActiveTextEditorControlChange(() => {

			// Clear old
			pickerDisposable.value = undefined;

			// Add new
			pickerDisposable.value = this.doProvide(picker, token);
		}));

		return disposables;
	}

	private doProvide(picker: IQuickPick<IQuickPickItem, { useSeparators: true }>, token: CancellationToken, runOptions?: IQuickAccessProviderRunOptions): IDisposable {
		const disposables = new DisposableStore();

		// With text control
		const editor = this.activeTextEditorControl;
		if (editor && this.canProvideWithTextEditor(editor)) {
			const context: IQuickAccessTextEditorContext = { editor };

			// Restore any view state if this picker was closed
			// without actually going to a line
			const codeEditor = getCodeEditor(editor);
			if (codeEditor) {

				// Remember view state and update it when the cursor position
				// changes even later because it could be that the user has
				// configured quick access to remain open when focus is lost and
				// we always want to restore the current location.
				let lastKnownEditorViewState = editor.saveViewState() ?? undefined;
				disposables.add(codeEditor.onDidChangeCursorPosition(() => {
					lastKnownEditorViewState = editor.saveViewState() ?? undefined;
				}));

				context.restoreViewState = () => {
					if (lastKnownEditorViewState && editor === this.activeTextEditorControl) {
						editor.restoreViewState(lastKnownEditorViewState);
					}
				};

				disposables.add(createSingleCallFunction(token.onCancellationRequested)(() => context.restoreViewState?.()));
			}

			// Clean up decorations on dispose
			disposables.add(toDisposable(() => this.clearDecorations(editor)));

			// Ask subclass for entries
			disposables.add(this.provideWithTextEditor(context, picker, token, runOptions));
		}

		// Without text control
		else {
			disposables.add(this.provideWithoutTextEditor(picker, token));
		}

		return disposables;
	}

	/**
	 * Subclasses to implement if they can operate on the text editor.
	 */
	protected canProvideWithTextEditor(editor: IEditor): boolean {
		return true;
	}

	/**
	 * Subclasses to implement to provide picks for the picker when an editor is active.
	 */
	protected abstract provideWithTextEditor(context: IQuickAccessTextEditorContext, picker: IQuickPick<IQuickPickItem, { useSeparators: true }>, token: CancellationToken, runOptions?: IQuickAccessProviderRunOptions): IDisposable;

	/**
	 * Subclasses to implement to provide picks for the picker when no editor is active.
	 */
	protected abstract provideWithoutTextEditor(picker: IQuickPick<IQuickPickItem, { useSeparators: true }>, token: CancellationToken): IDisposable;

	protected gotoLocation({ editor }: IQuickAccessTextEditorContext, options: { range: IRange; keyMods: IKeyMods; forceSideBySide?: boolean; preserveFocus?: boolean }): void {
		editor.setSelection(options.range, TextEditorSelectionSource.JUMP);
		editor.revealRangeInCenter(options.range, ScrollType.Smooth);
		if (!options.preserveFocus) {
			editor.focus();
		}

		const model = this.getModel(editor);
		if (model) {
			status(`${model.getLineContent(options.range.startLineNumber)}`);
		}
	}

	protected getModel(editor: IEditor | IDiffEditor): ITextModel | undefined {
		return isDiffEditor(editor) ?
			editor.getModel()?.modified :
			editor.getModel() as ITextModel;
	}

	//#endregion


	//#region Editor access

	/**
	 * Subclasses to provide an event when the active editor control changes.
	 */
	protected abstract readonly onDidActiveTextEditorControlChange: Event<void>;

	/**
	 * Subclasses to provide the current active editor control.
	 */
	protected abstract activeTextEditorControl: IEditor | undefined;

	//#endregion


	//#region Decorations Utils

	private rangeHighlightDecorationId: IEditorLineDecoration | undefined = undefined;

	addDecorations(editor: IEditor, range: IRange): void {
		editor.changeDecorations(changeAccessor => {

			// Reset old decorations if any
			const deleteDecorations: string[] = [];
			if (this.rangeHighlightDecorationId) {
				deleteDecorations.push(this.rangeHighlightDecorationId.overviewRulerDecorationId);
				deleteDecorations.push(this.rangeHighlightDecorationId.rangeHighlightId);

				this.rangeHighlightDecorationId = undefined;
			}

			// Add new decorations for the range
			const newDecorations: IModelDeltaDecoration[] = [

				// highlight the entire line on the range
				{
					range,
					options: {
						description: 'quick-access-range-highlight',
						className: 'rangeHighlight',
						isWholeLine: true
					}
				},

				// also add overview ruler highlight
				{
					range,
					options: {
						description: 'quick-access-range-highlight-overview',
						overviewRuler: {
							color: themeColorFromId(overviewRulerRangeHighlight),
							position: OverviewRulerLane.Full
						}
					}
				}
			];

			const [rangeHighlightId, overviewRulerDecorationId] = changeAccessor.deltaDecorations(deleteDecorations, newDecorations);

			this.rangeHighlightDecorationId = { rangeHighlightId, overviewRulerDecorationId };
		});
	}

	clearDecorations(editor: IEditor): void {
		const rangeHighlightDecorationId = this.rangeHighlightDecorationId;
		if (rangeHighlightDecorationId) {
			editor.changeDecorations(changeAccessor => {
				changeAccessor.deltaDecorations([
					rangeHighlightDecorationId.overviewRulerDecorationId,
					rangeHighlightDecorationId.rangeHighlightId
				], []);
			});

			this.rangeHighlightDecorationId = undefined;
		}
	}

	//#endregion
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/quickAccess/browser/gotoLineQuickAccess.ts]---
Location: vscode-main/src/vs/editor/contrib/quickAccess/browser/gotoLineQuickAccess.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { Disposable, DisposableStore, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { localize } from '../../../../nls.js';
import { IQuickInputButton, IQuickPick, IQuickPickItem, QuickInputButtonLocation } from '../../../../platform/quickinput/common/quickInput.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { getCodeEditor } from '../../../browser/editorBrowser.js';
import { EditorOption, RenderLineNumbersType } from '../../../common/config/editorOptions.js';
import { IPosition } from '../../../common/core/position.js';
import { IRange } from '../../../common/core/range.js';
import { IEditor, ScrollType } from '../../../common/editorCommon.js';
import { AbstractEditorNavigationQuickAccessProvider, IQuickAccessTextEditorContext } from './editorNavigationQuickAccess.js';

interface IGotoLineQuickPickItem extends IQuickPickItem, Partial<IPosition> { }

export abstract class AbstractGotoLineQuickAccessProvider extends AbstractEditorNavigationQuickAccessProvider {

	static readonly GO_TO_LINE_PREFIX = ':';
	static readonly GO_TO_OFFSET_PREFIX = '::';
	private static readonly ZERO_BASED_OFFSET_STORAGE_KEY = 'gotoLine.useZeroBasedOffset';

	constructor() {
		super({ canAcceptInBackground: true });
	}

	protected abstract readonly storageService: IStorageService;

	private get useZeroBasedOffset() {
		return this.storageService.getBoolean(
			AbstractGotoLineQuickAccessProvider.ZERO_BASED_OFFSET_STORAGE_KEY,
			StorageScope.APPLICATION,
			false);
	}

	private set useZeroBasedOffset(value: boolean) {
		this.storageService.store(
			AbstractGotoLineQuickAccessProvider.ZERO_BASED_OFFSET_STORAGE_KEY,
			value,
			StorageScope.APPLICATION,
			StorageTarget.USER);
	}

	protected provideWithoutTextEditor(picker: IQuickPick<IGotoLineQuickPickItem, { useSeparators: true }>): IDisposable {
		const label = localize('gotoLine.noEditor', "Open a text editor first to go to a line or an offset.");

		picker.items = [{ label }];
		picker.ariaLabel = label;

		return Disposable.None;
	}

	protected provideWithTextEditor(context: IQuickAccessTextEditorContext, picker: IQuickPick<IGotoLineQuickPickItem, { useSeparators: true }>, token: CancellationToken): IDisposable {
		const editor = context.editor;
		const disposables = new DisposableStore();

		// Goto line once picked
		disposables.add(picker.onDidAccept(event => {
			const [item] = picker.selectedItems;
			if (item) {
				if (!item.lineNumber) {
					return;
				}

				this.gotoLocation(context, { range: this.toRange(item.lineNumber, item.column), keyMods: picker.keyMods, preserveFocus: event.inBackground });

				if (!event.inBackground) {
					picker.hide();
				}
			}
		}));

		// Add a toggle to switch between 1- and 0-based offsets.
		const offsetButton: IQuickInputButton = {
			iconClass: ThemeIcon.asClassName(Codicon.indexZero),
			tooltip: localize('gotoLineToggleButton', "Toggle Zero-Based Offset"),
			location: QuickInputButtonLocation.Input,
			toggle: { checked: this.useZeroBasedOffset }
		};

		// React to picker changes
		const updatePickerAndEditor = () => {
			const inputText = picker.value.trim().substring(AbstractGotoLineQuickAccessProvider.GO_TO_LINE_PREFIX.length);
			const { inOffsetMode, lineNumber, column, label } = this.parsePosition(editor, inputText);

			// Show toggle only when input text starts with '::'.
			picker.buttons = inOffsetMode ? [offsetButton] : [];

			// Picker
			picker.items = [{
				lineNumber,
				column,
				label,
			}];

			// ARIA Label
			const cursor = editor.getPosition() ?? { lineNumber: 1, column: 1 };
			picker.ariaLabel = localize(
				{
					key: 'gotoLine.ariaLabel',
					comment: ['{0} is the line number, {1} is the column number, {2} is instructions for typing in the Go To Line picker']
				},
				"Current position: line {0}, column {1}. {2}", cursor.lineNumber, cursor.column, label
			);

			// Clear decorations for invalid range
			if (!lineNumber) {
				this.clearDecorations(editor);
				return;
			}

			// Reveal
			const range = this.toRange(lineNumber, column);
			editor.revealRangeInCenter(range, ScrollType.Smooth);

			// Decorate
			this.addDecorations(editor, range);
		};

		disposables.add(picker.onDidTriggerButton(button => {
			if (button === offsetButton) {
				this.useZeroBasedOffset = button.toggle?.checked ?? !this.useZeroBasedOffset;
				updatePickerAndEditor();
			}
		}));

		updatePickerAndEditor();
		disposables.add(picker.onDidChangeValue(() => updatePickerAndEditor()));

		// Adjust line number visibility as needed
		const codeEditor = getCodeEditor(editor);
		if (codeEditor) {
			const options = codeEditor.getOptions();
			const lineNumbers = options.get(EditorOption.lineNumbers);
			if (lineNumbers.renderType === RenderLineNumbersType.Relative) {
				codeEditor.updateOptions({ lineNumbers: 'on' });

				disposables.add(toDisposable(() => codeEditor.updateOptions({ lineNumbers: 'relative' })));
			}
		}

		return disposables;
	}

	private toRange(lineNumber = 1, column = 1): IRange {
		return {
			startLineNumber: lineNumber,
			startColumn: column,
			endLineNumber: lineNumber,
			endColumn: column
		};
	}

	protected parsePosition(editor: IEditor, value: string): Partial<IPosition> & { inOffsetMode?: boolean; label: string } {
		const model = this.getModel(editor);
		if (!model) {
			return {
				label: localize('gotoLine.noEditor', "Open a text editor first to go to a line or an offset.")
			};
		}

		// Support ::<offset> notation to navigate to a specific offset in the model.
		if (value.startsWith(':')) {
			let offset = parseInt(value.substring(1), 10);
			const maxOffset = model.getValueLength();
			if (isNaN(offset)) {
				// No valid offset specified.
				return {
					inOffsetMode: true,
					label: this.useZeroBasedOffset ?
						localize('gotoLine.offsetPromptZero', "Type a character position to go to (from 0 to {0}).", maxOffset - 1) :
						localize('gotoLine.offsetPrompt', "Type a character position to go to (from 1 to {0}).", maxOffset)
				};
			} else {
				const reverse = offset < 0;
				if (!this.useZeroBasedOffset) {
					// Convert 1-based offset to model's 0-based.
					offset -= Math.sign(offset);
				}
				if (reverse) {
					// Offset from the end of the buffer
					offset += maxOffset;
				}
				const pos = model.getPositionAt(offset);
				return {
					...pos,
					inOffsetMode: true,
					label: localize('gotoLine.goToPosition', "Press 'Enter' to go to line {0} at column {1}.", pos.lineNumber, pos.column)
				};
			}
		} else {
			// Support line-col formats of `line,col`, `line:col`, `line#col`
			const parts = value.split(/,|:|#/);

			const maxLine = model.getLineCount();
			let lineNumber = parseInt(parts[0]?.trim(), 10);
			if (parts.length < 1 || isNaN(lineNumber)) {
				return {
					label: localize('gotoLine.linePrompt', "Type a line number to go to (from 1 to {0}).", maxLine)
				};
			}

			// Handle negative line numbers and clip to valid range.
			lineNumber = lineNumber >= 0 ? lineNumber : (maxLine + 1) + lineNumber;
			lineNumber = Math.min(Math.max(1, lineNumber), maxLine);

			const maxColumn = model.getLineMaxColumn(lineNumber);
			let column = parseInt(parts[1]?.trim(), 10);
			if (parts.length < 2 || isNaN(column)) {
				return {
					lineNumber,
					column: 1,
					label: parts.length < 2 ?
						localize('gotoLine.lineColumnPrompt', "Press 'Enter' to go to line {0} or enter colon : to add a column number.", lineNumber) :
						localize('gotoLine.columnPrompt', "Press 'Enter' to go to line {0} or enter a column number (from 1 to {1}).", lineNumber, maxColumn)
				};
			}

			// Handle negative column numbers and clip to valid range.
			column = column >= 0 ? column : maxColumn + column;
			column = Math.min(Math.max(1, column), maxColumn);

			return {
				lineNumber,
				column,
				label: localize('gotoLine.goToPosition', "Press 'Enter' to go to line {0} at column {1}.", lineNumber, column)
			};
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/quickAccess/browser/gotoSymbolQuickAccess.ts]---
Location: vscode-main/src/vs/editor/contrib/quickAccess/browser/gotoSymbolQuickAccess.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DeferredPromise } from '../../../../base/common/async.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { IMatch } from '../../../../base/common/filters.js';
import { IPreparedQuery, pieceToQuery, prepareQuery, scoreFuzzy2 } from '../../../../base/common/fuzzyScorer.js';
import { Disposable, DisposableStore, IDisposable, MutableDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { format, trim } from '../../../../base/common/strings.js';
import { IRange, Range } from '../../../common/core/range.js';
import { ScrollType } from '../../../common/editorCommon.js';
import { ITextModel } from '../../../common/model.js';
import { DocumentSymbol, SymbolKind, SymbolKinds, SymbolTag, getAriaLabelForSymbol } from '../../../common/languages.js';
import { IOutlineModelService } from '../../documentSymbols/browser/outlineModel.js';
import { AbstractEditorNavigationQuickAccessProvider, IEditorNavigationQuickAccessOptions, IQuickAccessTextEditorContext } from './editorNavigationQuickAccess.js';
import { localize } from '../../../../nls.js';
import { IQuickInputButton, IQuickPick, IQuickPickItem, IQuickPickSeparator } from '../../../../platform/quickinput/common/quickInput.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { Position } from '../../../common/core/position.js';
import { findLast } from '../../../../base/common/arraysFind.js';
import { IQuickAccessProviderRunOptions } from '../../../../platform/quickinput/common/quickAccess.js';
import { URI } from '../../../../base/common/uri.js';

export interface IGotoSymbolQuickPickItem extends IQuickPickItem {
	kind: SymbolKind;
	index: number;
	score?: number;
	uri?: URI;
	symbolName?: string;
	range?: { decoration: IRange; selection: IRange };
}

export interface IGotoSymbolQuickAccessProviderOptions extends IEditorNavigationQuickAccessOptions {
	openSideBySideDirection?: () => undefined | 'right' | 'down';
	/**
	 * A handler to invoke when an item is accepted for
	 * this particular showing of the quick access.
	 * @param item The item that was accepted.
	 */
	readonly handleAccept?: (item: IQuickPickItem) => void;
}

export abstract class AbstractGotoSymbolQuickAccessProvider extends AbstractEditorNavigationQuickAccessProvider {

	static PREFIX = '@';
	static SCOPE_PREFIX = ':';
	static PREFIX_BY_CATEGORY = `${this.PREFIX}${this.SCOPE_PREFIX}`;

	protected override readonly options: IGotoSymbolQuickAccessProviderOptions;

	constructor(
		@ILanguageFeaturesService private readonly _languageFeaturesService: ILanguageFeaturesService,
		@IOutlineModelService private readonly _outlineModelService: IOutlineModelService,
		options: IGotoSymbolQuickAccessProviderOptions = Object.create(null)
	) {
		super(options);

		this.options = options;
		this.options.canAcceptInBackground = true;
	}

	protected provideWithoutTextEditor(picker: IQuickPick<IGotoSymbolQuickPickItem, { useSeparators: true }>): IDisposable {
		this.provideLabelPick(picker, localize('cannotRunGotoSymbolWithoutEditor', "To go to a symbol, first open a text editor with symbol information."));

		return Disposable.None;
	}

	protected provideWithTextEditor(context: IQuickAccessTextEditorContext, picker: IQuickPick<IGotoSymbolQuickPickItem, { useSeparators: true }>, token: CancellationToken, runOptions?: IQuickAccessProviderRunOptions): IDisposable {
		const editor = context.editor;
		const model = this.getModel(editor);
		if (!model) {
			return Disposable.None;
		}

		// Provide symbols from model if available in registry
		if (this._languageFeaturesService.documentSymbolProvider.has(model)) {
			return this.doProvideWithEditorSymbols(context, model, picker, token, runOptions);
		}

		// Otherwise show an entry for a model without registry
		// But give a chance to resolve the symbols at a later
		// point if possible
		return this.doProvideWithoutEditorSymbols(context, model, picker, token);
	}

	private doProvideWithoutEditorSymbols(context: IQuickAccessTextEditorContext, model: ITextModel, picker: IQuickPick<IGotoSymbolQuickPickItem, { useSeparators: true }>, token: CancellationToken): IDisposable {
		const disposables = new DisposableStore();

		// Generic pick for not having any symbol information
		this.provideLabelPick(picker, localize('cannotRunGotoSymbolWithoutSymbolProvider', "The active text editor does not provide symbol information."));

		// Wait for changes to the registry and see if eventually
		// we do get symbols. This can happen if the picker is opened
		// very early after the model has loaded but before the
		// language registry is ready.
		// https://github.com/microsoft/vscode/issues/70607
		(async () => {
			const result = await this.waitForLanguageSymbolRegistry(model, disposables);
			if (!result || token.isCancellationRequested) {
				return;
			}

			disposables.add(this.doProvideWithEditorSymbols(context, model, picker, token));
		})();

		return disposables;
	}

	private provideLabelPick(picker: IQuickPick<IGotoSymbolQuickPickItem, { useSeparators: true }>, label: string): void {
		picker.items = [{ label, index: 0, kind: SymbolKind.String }];
		picker.ariaLabel = label;
	}

	protected async waitForLanguageSymbolRegistry(model: ITextModel, disposables: DisposableStore): Promise<boolean> {
		if (this._languageFeaturesService.documentSymbolProvider.has(model)) {
			return true;
		}

		const symbolProviderRegistryPromise = new DeferredPromise<boolean>();

		// Resolve promise when registry knows model
		const symbolProviderListener = disposables.add(this._languageFeaturesService.documentSymbolProvider.onDidChange(() => {
			if (this._languageFeaturesService.documentSymbolProvider.has(model)) {
				symbolProviderListener.dispose();

				symbolProviderRegistryPromise.complete(true);
			}
		}));

		// Resolve promise when we get disposed too
		disposables.add(toDisposable(() => symbolProviderRegistryPromise.complete(false)));

		return symbolProviderRegistryPromise.p;
	}

	private doProvideWithEditorSymbols(context: IQuickAccessTextEditorContext, model: ITextModel, picker: IQuickPick<IGotoSymbolQuickPickItem, { useSeparators: true }>, token: CancellationToken, runOptions?: IQuickAccessProviderRunOptions): IDisposable {
		const editor = context.editor;
		const disposables = new DisposableStore();

		// Goto symbol once picked
		disposables.add(picker.onDidAccept(event => {
			const [item] = picker.selectedItems;
			if (item && item.range) {
				this.gotoLocation(context, { range: item.range.selection, keyMods: picker.keyMods, preserveFocus: event.inBackground });

				runOptions?.handleAccept?.(item, event.inBackground);

				if (!event.inBackground) {
					picker.hide();
				}
			}
		}));

		// Goto symbol side by side if enabled
		disposables.add(picker.onDidTriggerItemButton(({ item }) => {
			if (item && item.range) {
				this.gotoLocation(context, { range: item.range.selection, keyMods: picker.keyMods, forceSideBySide: true });

				picker.hide();
			}
		}));

		// Resolve symbols from document once and reuse this
		// request for all filtering and typing then on
		const symbolsPromise = this.getDocumentSymbols(model, token);

		// Set initial picks and update on type
		const picksCts = disposables.add(new MutableDisposable<CancellationTokenSource>());
		const updatePickerItems = async (positionToEnclose: Position | undefined) => {

			// Cancel any previous ask for picks and busy
			picksCts?.value?.cancel();
			picker.busy = false;

			// Create new cancellation source for this run
			picksCts.value = new CancellationTokenSource();

			// Collect symbol picks
			picker.busy = true;
			try {
				const query = prepareQuery(picker.value.substr(AbstractGotoSymbolQuickAccessProvider.PREFIX.length).trim());
				const items = await this.doGetSymbolPicks(symbolsPromise, query, undefined, picksCts.value.token, model);
				if (token.isCancellationRequested) {
					return;
				}

				if (items.length > 0) {
					picker.items = items;
					if (positionToEnclose && query.original.length === 0) {
						const candidate = <IGotoSymbolQuickPickItem>findLast(items, item => Boolean(item.type !== 'separator' && item.range && Range.containsPosition(item.range.decoration, positionToEnclose)));
						if (candidate) {
							picker.activeItems = [candidate];
						}
					}

				} else {
					if (query.original.length > 0) {
						this.provideLabelPick(picker, localize('noMatchingSymbolResults', "No matching editor symbols"));
					} else {
						this.provideLabelPick(picker, localize('noSymbolResults', "No editor symbols"));
					}
				}
			} finally {
				if (!token.isCancellationRequested) {
					picker.busy = false;
				}
			}
		};
		disposables.add(picker.onDidChangeValue(() => updatePickerItems(undefined)));
		updatePickerItems(editor.getSelection()?.getPosition());


		// Reveal and decorate when active item changes
		disposables.add(picker.onDidChangeActive(() => {
			const [item] = picker.activeItems;
			if (item && item.range) {

				// Reveal
				editor.revealRangeInCenter(item.range.selection, ScrollType.Smooth);

				// Decorate
				this.addDecorations(editor, item.range.decoration);
			}
		}));

		return disposables;
	}

	protected async doGetSymbolPicks(symbolsPromise: Promise<DocumentSymbol[]>, query: IPreparedQuery, options: { extraContainerLabel?: string } | undefined, token: CancellationToken, model: ITextModel): Promise<Array<IGotoSymbolQuickPickItem | IQuickPickSeparator>> {
		const symbols = await symbolsPromise;
		if (token.isCancellationRequested) {
			return [];
		}

		const filterBySymbolKind = query.original.indexOf(AbstractGotoSymbolQuickAccessProvider.SCOPE_PREFIX) === 0;
		const filterPos = filterBySymbolKind ? 1 : 0;

		// Split between symbol and container query
		let symbolQuery: IPreparedQuery;
		let containerQuery: IPreparedQuery | undefined;
		if (query.values && query.values.length > 1) {
			symbolQuery = pieceToQuery(query.values[0]); 		  // symbol: only match on first part
			containerQuery = pieceToQuery(query.values.slice(1)); // container: match on all but first parts
		} else {
			symbolQuery = query;
		}

		// Convert to symbol picks and apply filtering

		let buttons: IQuickInputButton[] | undefined;
		const openSideBySideDirection = this.options?.openSideBySideDirection?.();
		if (openSideBySideDirection) {
			buttons = [{
				iconClass: openSideBySideDirection === 'right' ? ThemeIcon.asClassName(Codicon.splitHorizontal) : ThemeIcon.asClassName(Codicon.splitVertical),
				tooltip: openSideBySideDirection === 'right' ? localize('openToSide', "Open to the Side") : localize('openToBottom', "Open to the Bottom")
			}];
		}

		const filteredSymbolPicks: IGotoSymbolQuickPickItem[] = [];
		for (let index = 0; index < symbols.length; index++) {
			const symbol = symbols[index];

			const symbolLabel = trim(symbol.name);
			const symbolLabelWithIcon = `$(${SymbolKinds.toIcon(symbol.kind).id}) ${symbolLabel}`;
			const symbolLabelIconOffset = symbolLabelWithIcon.length - symbolLabel.length;

			let containerLabel = symbol.containerName;
			if (options?.extraContainerLabel) {
				if (containerLabel) {
					containerLabel = `${options.extraContainerLabel} • ${containerLabel}`;
				} else {
					containerLabel = options.extraContainerLabel;
				}
			}

			let symbolScore: number | undefined = undefined;
			let symbolMatches: IMatch[] | undefined = undefined;

			let containerScore: number | undefined = undefined;
			let containerMatches: IMatch[] | undefined = undefined;

			if (query.original.length > filterPos) {

				// First: try to score on the entire query, it is possible that
				// the symbol matches perfectly (e.g. searching for "change log"
				// can be a match on a markdown symbol "change log"). In that
				// case we want to skip the container query altogether.
				let skipContainerQuery = false;
				if (symbolQuery !== query) {
					[symbolScore, symbolMatches] = scoreFuzzy2(symbolLabelWithIcon, { ...query, values: undefined /* disable multi-query support */ }, filterPos, symbolLabelIconOffset);
					if (typeof symbolScore === 'number') {
						skipContainerQuery = true; // since we consumed the query, skip any container matching
					}
				}

				// Otherwise: score on the symbol query and match on the container later
				if (typeof symbolScore !== 'number') {
					[symbolScore, symbolMatches] = scoreFuzzy2(symbolLabelWithIcon, symbolQuery, filterPos, symbolLabelIconOffset);
					if (typeof symbolScore !== 'number') {
						continue;
					}
				}

				// Score by container if specified
				if (!skipContainerQuery && containerQuery) {
					if (containerLabel && containerQuery.original.length > 0) {
						[containerScore, containerMatches] = scoreFuzzy2(containerLabel, containerQuery);
					}

					if (typeof containerScore !== 'number') {
						continue;
					}

					if (typeof symbolScore === 'number') {
						symbolScore += containerScore; // boost symbolScore by containerScore
					}
				}
			}

			const deprecated = symbol.tags && symbol.tags.indexOf(SymbolTag.Deprecated) >= 0;

			filteredSymbolPicks.push({
				index,
				kind: symbol.kind,
				score: symbolScore,
				label: symbolLabelWithIcon,
				ariaLabel: getAriaLabelForSymbol(symbol.name, symbol.kind),
				description: containerLabel,
				highlights: deprecated ? undefined : {
					label: symbolMatches,
					description: containerMatches
				},
				range: {
					selection: Range.collapseToStart(symbol.selectionRange),
					decoration: symbol.range
				},
				uri: model.uri,
				symbolName: symbolLabel,
				strikethrough: deprecated,
				buttons
			});
		}

		// Sort by score
		const sortedFilteredSymbolPicks = filteredSymbolPicks.sort((symbolA, symbolB) => filterBySymbolKind ?
			this.compareByKindAndScore(symbolA, symbolB) :
			this.compareByScore(symbolA, symbolB)
		);

		// Add separator for types
		// - @  only total number of symbols
		// - @: grouped by symbol kind
		let symbolPicks: Array<IGotoSymbolQuickPickItem | IQuickPickSeparator> = [];
		if (filterBySymbolKind) {
			let lastSymbolKind: SymbolKind | undefined = undefined;
			let lastSeparator: IQuickPickSeparator | undefined = undefined;
			let lastSymbolKindCounter = 0;

			function updateLastSeparatorLabel(): void {
				if (lastSeparator && typeof lastSymbolKind === 'number' && lastSymbolKindCounter > 0) {
					lastSeparator.label = format(NLS_SYMBOL_KIND_CACHE[lastSymbolKind] || FALLBACK_NLS_SYMBOL_KIND, lastSymbolKindCounter);
				}
			}

			for (const symbolPick of sortedFilteredSymbolPicks) {

				// Found new kind
				if (lastSymbolKind !== symbolPick.kind) {

					// Update last separator with number of symbols we found for kind
					updateLastSeparatorLabel();

					lastSymbolKind = symbolPick.kind;
					lastSymbolKindCounter = 1;

					// Add new separator for new kind
					lastSeparator = { type: 'separator' };
					symbolPicks.push(lastSeparator);
				}

				// Existing kind, keep counting
				else {
					lastSymbolKindCounter++;
				}

				// Add to final result
				symbolPicks.push(symbolPick);
			}

			// Update last separator with number of symbols we found for kind
			updateLastSeparatorLabel();
		} else if (sortedFilteredSymbolPicks.length > 0) {
			symbolPicks = [
				{ label: localize('symbols', "symbols ({0})", filteredSymbolPicks.length), type: 'separator' },
				...sortedFilteredSymbolPicks
			];
		}

		return symbolPicks;
	}

	private compareByScore(symbolA: IGotoSymbolQuickPickItem, symbolB: IGotoSymbolQuickPickItem): number {
		if (typeof symbolA.score !== 'number' && typeof symbolB.score === 'number') {
			return 1;
		} else if (typeof symbolA.score === 'number' && typeof symbolB.score !== 'number') {
			return -1;
		}

		if (typeof symbolA.score === 'number' && typeof symbolB.score === 'number') {
			if (symbolA.score > symbolB.score) {
				return -1;
			} else if (symbolA.score < symbolB.score) {
				return 1;
			}
		}

		if (symbolA.index < symbolB.index) {
			return -1;
		} else if (symbolA.index > symbolB.index) {
			return 1;
		}

		return 0;
	}

	private compareByKindAndScore(symbolA: IGotoSymbolQuickPickItem, symbolB: IGotoSymbolQuickPickItem): number {
		const kindA = NLS_SYMBOL_KIND_CACHE[symbolA.kind] || FALLBACK_NLS_SYMBOL_KIND;
		const kindB = NLS_SYMBOL_KIND_CACHE[symbolB.kind] || FALLBACK_NLS_SYMBOL_KIND;

		// Sort by type first if scoped search
		const result = kindA.localeCompare(kindB);
		if (result === 0) {
			return this.compareByScore(symbolA, symbolB);
		}

		return result;
	}

	protected async getDocumentSymbols(document: ITextModel, token: CancellationToken): Promise<DocumentSymbol[]> {
		const model = await this._outlineModelService.getOrCreate(document, token);
		return token.isCancellationRequested ? [] : model.asListOfDocumentSymbols();
	}
}

// #region NLS Helpers

const FALLBACK_NLS_SYMBOL_KIND = localize('property', "properties ({0})");
const NLS_SYMBOL_KIND_CACHE: { [type: number]: string } = {
	[SymbolKind.Method]: localize('method', "methods ({0})"),
	[SymbolKind.Function]: localize('function', "functions ({0})"),
	[SymbolKind.Constructor]: localize('_constructor', "constructors ({0})"),
	[SymbolKind.Variable]: localize('variable', "variables ({0})"),
	[SymbolKind.Class]: localize('class', "classes ({0})"),
	[SymbolKind.Struct]: localize('struct', "structs ({0})"),
	[SymbolKind.Event]: localize('event', "events ({0})"),
	[SymbolKind.Operator]: localize('operator', "operators ({0})"),
	[SymbolKind.Interface]: localize('interface', "interfaces ({0})"),
	[SymbolKind.Namespace]: localize('namespace', "namespaces ({0})"),
	[SymbolKind.Package]: localize('package', "packages ({0})"),
	[SymbolKind.TypeParameter]: localize('typeParameter', "type parameters ({0})"),
	[SymbolKind.Module]: localize('modules', "modules ({0})"),
	[SymbolKind.Property]: localize('property', "properties ({0})"),
	[SymbolKind.Enum]: localize('enum', "enumerations ({0})"),
	[SymbolKind.EnumMember]: localize('enumMember', "enumeration members ({0})"),
	[SymbolKind.String]: localize('string', "strings ({0})"),
	[SymbolKind.File]: localize('file', "files ({0})"),
	[SymbolKind.Array]: localize('array', "arrays ({0})"),
	[SymbolKind.Number]: localize('number', "numbers ({0})"),
	[SymbolKind.Boolean]: localize('boolean', "booleans ({0})"),
	[SymbolKind.Object]: localize('object', "objects ({0})"),
	[SymbolKind.Key]: localize('key', "keys ({0})"),
	[SymbolKind.Field]: localize('field', "fields ({0})"),
	[SymbolKind.Constant]: localize('constant', "constants ({0})")
};

//#endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/quickAccess/test/browser/gotoLineQuickAccess.test.ts]---
Location: vscode-main/src/vs/editor/contrib/quickAccess/test/browser/gotoLineQuickAccess.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Event } from '../../../../../base/common/event.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { IEditor } from '../../../../common/editorCommon.js';
import { withTestCodeEditor } from '../../../../test/browser/testCodeEditor.js';
import { AbstractGotoLineQuickAccessProvider } from '../../browser/gotoLineQuickAccess.js';
import { IStorageService } from '../../../../../platform/storage/common/storage.js';

class TestGotoLineQuickAccessProvider extends AbstractGotoLineQuickAccessProvider {
	protected override onDidActiveTextEditorControlChange = Event.None;
	protected override activeTextEditorControl: IEditor | undefined;
	constructor(private zeroBased: boolean) {
		super();
	}
	protected override readonly storageService = {
		getBoolean: () => this.zeroBased,
		store: () => { }
	} as unknown as IStorageService;

	public parsePositionTest(editor: IEditor, value: string) {
		return super.parsePosition(editor, value);
	}
}

suite('AbstractGotoLineQuickAccessProvider', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	function runTest(input: string, expectedLine: number, expectedColumn?: number, zeroBased = false) {
		const provider = new TestGotoLineQuickAccessProvider(zeroBased);
		withTestCodeEditor([
			'line 1',
			'line 2',
			'line 3',
			'line 4',
			'line 5'
		], {}, (editor, _) => {
			const { lineNumber, column } = provider.parsePositionTest(editor, input);
			assert.strictEqual(lineNumber, expectedLine);
			assert.strictEqual(column, expectedColumn ?? 1);
		});
	}

	test('parsePosition works as expected', () => {
		// :line
		runTest('-100', 1);
		runTest('-5', 1);
		runTest('-1', 5);
		runTest('0', 1);
		runTest('1', 1);
		runTest('2', 2);
		runTest('5', 5);
		runTest('6', 5);
		runTest('7', 5);
		runTest('100', 5);

		// :line,column
		runTest('2:-100', 2, 1);
		runTest('2:-5', 2, 2);
		runTest('2:-1', 2, 6);
		runTest('2:0', 2, 1);
		runTest('2:1', 2, 1);
		runTest('2:2', 2, 2);
		runTest('2:6', 2, 6);
		runTest('2:7', 2, 7);
		runTest('2:8', 2, 7);
		runTest('2:100', 2, 7);

		// ::offset (1-based)
		runTest(':-1000', 1, 1);
		runTest(':-10', 4, 5);
		runTest(':-1', 5, 7);
		runTest(':0', 1, 1);
		runTest(':1', 1, 1);
		runTest(':10', 2, 3);
		runTest(':1000', 5, 7);

		// offset (0-based)
		runTest(':-1000', 1, 1, true);
		runTest(':-10', 4, 4, true);
		runTest(':-1', 5, 6, true);
		runTest(':0', 1, 1, true);
		runTest(':1', 1, 2, true);
		runTest(':10', 2, 4, true);
		runTest(':1000', 5, 7, true);

		// :line#column
		// :line,column
		// spaces
		runTest('-1#6', 5, 6);
		runTest('2,4', 2, 4);
		runTest('  2  :  3  ', 2, 3);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/readOnlyMessage/browser/contribution.ts]---
Location: vscode-main/src/vs/editor/contrib/readOnlyMessage/browser/contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { MarkdownString } from '../../../../base/common/htmlContent.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { EditorContributionInstantiation, registerEditorContribution } from '../../../browser/editorExtensions.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { IEditorContribution } from '../../../common/editorCommon.js';
import { MessageController } from '../../message/browser/messageController.js';
import * as nls from '../../../../nls.js';

export class ReadOnlyMessageController extends Disposable implements IEditorContribution {

	public static readonly ID = 'editor.contrib.readOnlyMessageController';

	constructor(
		private readonly editor: ICodeEditor
	) {
		super();
		this._register(this.editor.onDidAttemptReadOnlyEdit(() => this._onDidAttemptReadOnlyEdit()));
	}

	private _onDidAttemptReadOnlyEdit(): void {
		const messageController = MessageController.get(this.editor);
		if (messageController && this.editor.hasModel()) {
			let message = this.editor.getOptions().get(EditorOption.readOnlyMessage);
			if (!message) {
				if (this.editor.isSimpleWidget) {
					message = new MarkdownString(nls.localize('editor.simple.readonly', "Cannot edit in read-only input"));
				} else {
					message = new MarkdownString(nls.localize('editor.readonly', "Cannot edit in read-only editor"));
				}
			}

			messageController.showMessage(message, this.editor.getPosition());
		}
	}
}

registerEditorContribution(ReadOnlyMessageController.ID, ReadOnlyMessageController, EditorContributionInstantiation.BeforeFirstInteraction);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/rename/browser/rename.ts]---
Location: vscode-main/src/vs/editor/contrib/rename/browser/rename.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { alert } from '../../../../base/browser/ui/aria/aria.js';
import { raceCancellation } from '../../../../base/common/async.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { CancellationError, onUnexpectedError } from '../../../../base/common/errors.js';
import { isMarkdownString } from '../../../../base/common/htmlContent.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { assertType } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import * as nls from '../../../../nls.js';
import { Action2, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { ConfigurationScope, Extensions, IConfigurationRegistry } from '../../../../platform/configuration/common/configurationRegistry.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { IEditorProgressService } from '../../../../platform/progress/common/progress.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { EditorAction, EditorCommand, EditorContributionInstantiation, ServicesAccessor, registerEditorAction, registerEditorCommand, registerEditorContribution, registerModelAndPositionCommand } from '../../../browser/editorExtensions.js';
import { IBulkEditService } from '../../../browser/services/bulkEditService.js';
import { ICodeEditorService } from '../../../browser/services/codeEditorService.js';
import { IPosition, Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { IEditorContribution } from '../../../common/editorCommon.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import { LanguageFeatureRegistry } from '../../../common/languageFeatureRegistry.js';
import { NewSymbolNameTriggerKind, Rejection, RenameLocation, RenameProvider, WorkspaceEdit } from '../../../common/languages.js';
import { ITextModel } from '../../../common/model.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { ITextResourceConfigurationService } from '../../../common/services/textResourceConfiguration.js';
import { EditSources } from '../../../common/textModelEditSource.js';
import { CodeEditorStateFlag, EditorStateCancellationTokenSource } from '../../editorState/browser/editorState.js';
import { MessageController } from '../../message/browser/messageController.js';
import { CONTEXT_RENAME_INPUT_VISIBLE, RenameWidget } from './renameWidget.js';

class RenameSkeleton {

	private readonly _providers: RenameProvider[];
	private _providerRenameIdx: number = 0;

	constructor(
		private readonly model: ITextModel,
		private readonly position: Position,
		registry: LanguageFeatureRegistry<RenameProvider>
	) {
		this._providers = registry.ordered(model);
	}

	hasProvider() {
		return this._providers.length > 0;
	}

	async resolveRenameLocation(token: CancellationToken): Promise<RenameLocation & Rejection | undefined> {

		const rejects: string[] = [];

		for (this._providerRenameIdx = 0; this._providerRenameIdx < this._providers.length; this._providerRenameIdx++) {
			const provider = this._providers[this._providerRenameIdx];
			if (!provider.resolveRenameLocation) {
				break;
			}
			const res = await provider.resolveRenameLocation(this.model, this.position, token);
			if (!res) {
				continue;
			}
			if (res.rejectReason) {
				rejects.push(res.rejectReason);
				continue;
			}
			return res;
		}

		// we are here when no provider prepared a location which means we can
		// just rely on the word under cursor and start with the first provider
		this._providerRenameIdx = 0;

		const word = this.model.getWordAtPosition(this.position);
		if (!word) {
			return {
				range: Range.fromPositions(this.position),
				text: '',
				rejectReason: rejects.length > 0 ? rejects.join('\n') : undefined
			};
		}
		return {
			range: new Range(this.position.lineNumber, word.startColumn, this.position.lineNumber, word.endColumn),
			text: word.word,
			rejectReason: rejects.length > 0 ? rejects.join('\n') : undefined
		};
	}

	async provideRenameEdits(newName: string, token: CancellationToken): Promise<WorkspaceEdit & Rejection> {
		return this._provideRenameEdits(newName, this._providerRenameIdx, [], token);
	}

	private async _provideRenameEdits(newName: string, i: number, rejects: string[], token: CancellationToken): Promise<WorkspaceEdit & Rejection> {
		const provider = this._providers[i];
		if (!provider) {
			return {
				edits: [],
				rejectReason: rejects.join('\n')
			};
		}

		const result = await provider.provideRenameEdits(this.model, this.position, newName, token);
		if (!result) {
			return this._provideRenameEdits(newName, i + 1, rejects.concat(nls.localize('no result', "No result.")), token);
		} else if (result.rejectReason) {
			return this._provideRenameEdits(newName, i + 1, rejects.concat(result.rejectReason), token);
		}
		return result;
	}
}

export function hasProvider(registry: LanguageFeatureRegistry<RenameProvider>, model: ITextModel): boolean {
	const providers = registry.ordered(model);
	return providers.length > 0;
}

export async function prepareRename(registry: LanguageFeatureRegistry<RenameProvider>, model: ITextModel, position: Position, cancellationToken?: CancellationToken): Promise<RenameLocation & Rejection | undefined> {
	const skeleton = new RenameSkeleton(model, position, registry);
	return skeleton.resolveRenameLocation(cancellationToken ?? CancellationToken.None);
}

export async function rawRename(registry: LanguageFeatureRegistry<RenameProvider>, model: ITextModel, position: Position, newName: string, cancellationToken?: CancellationToken): Promise<WorkspaceEdit & Rejection> {
	const skeleton = new RenameSkeleton(model, position, registry);
	return skeleton.provideRenameEdits(newName, cancellationToken ?? CancellationToken.None);
}

export async function rename(registry: LanguageFeatureRegistry<RenameProvider>, model: ITextModel, position: Position, newName: string): Promise<WorkspaceEdit & Rejection> {
	const skeleton = new RenameSkeleton(model, position, registry);
	const loc = await skeleton.resolveRenameLocation(CancellationToken.None);
	if (loc?.rejectReason) {
		return { edits: [], rejectReason: loc.rejectReason };
	}
	return skeleton.provideRenameEdits(newName, CancellationToken.None);
}

// ---  register actions and commands

class RenameController implements IEditorContribution {

	public static readonly ID = 'editor.contrib.renameController';

	static get(editor: ICodeEditor): RenameController | null {
		return editor.getContribution<RenameController>(RenameController.ID);
	}

	private readonly _renameWidget: RenameWidget;
	private readonly _disposableStore = new DisposableStore();
	private _cts: CancellationTokenSource = new CancellationTokenSource();

	constructor(
		private readonly editor: ICodeEditor,
		@IInstantiationService private readonly _instaService: IInstantiationService,
		@INotificationService private readonly _notificationService: INotificationService,
		@IBulkEditService private readonly _bulkEditService: IBulkEditService,
		@IEditorProgressService private readonly _progressService: IEditorProgressService,
		@ILogService private readonly _logService: ILogService,
		@ITextResourceConfigurationService private readonly _configService: ITextResourceConfigurationService,
		@ILanguageFeaturesService private readonly _languageFeaturesService: ILanguageFeaturesService,
	) {
		this._renameWidget = this._disposableStore.add(this._instaService.createInstance(RenameWidget, this.editor, ['acceptRenameInput', 'acceptRenameInputWithPreview']));
	}

	dispose(): void {
		this._disposableStore.dispose();
		this._cts.dispose(true);
	}

	async run(): Promise<void> {

		const trace = this._logService.trace.bind(this._logService, '[rename]');

		// set up cancellation token to prevent reentrant rename, this
		// is the parent to the resolve- and rename-tokens
		this._cts.dispose(true);
		this._cts = new CancellationTokenSource();

		if (!this.editor.hasModel()) {
			trace('editor has no model');
			return undefined;
		}

		const position = this.editor.getPosition();
		const skeleton = new RenameSkeleton(this.editor.getModel(), position, this._languageFeaturesService.renameProvider);

		if (!skeleton.hasProvider()) {
			trace('skeleton has no provider');
			return undefined;
		}

		// part 1 - resolve rename location
		const cts1 = new EditorStateCancellationTokenSource(this.editor, CodeEditorStateFlag.Position | CodeEditorStateFlag.Value, undefined, this._cts.token);

		let loc: RenameLocation & Rejection | undefined;
		try {
			trace('resolving rename location');
			const resolveLocationOperation = skeleton.resolveRenameLocation(cts1.token);
			this._progressService.showWhile(resolveLocationOperation, 250);
			loc = await resolveLocationOperation;
			trace('resolved rename location');
		} catch (e: unknown) {
			if (e instanceof CancellationError) {
				trace('resolve rename location cancelled', JSON.stringify(e, null, '\t'));
			} else {
				trace('resolve rename location failed', e instanceof Error ? e : JSON.stringify(e, null, '\t'));
				if (typeof e === 'string' || isMarkdownString(e)) {
					MessageController.get(this.editor)?.showMessage(e || nls.localize('resolveRenameLocationFailed', "An unknown error occurred while resolving rename location"), position);
				}
			}
			return undefined;

		} finally {
			cts1.dispose();
		}

		if (!loc) {
			trace('returning early - no loc');
			return undefined;
		}

		if (loc.rejectReason) {
			trace(`returning early - rejected with reason: ${loc.rejectReason}`, loc.rejectReason);
			MessageController.get(this.editor)?.showMessage(loc.rejectReason, position);
			return undefined;
		}

		if (cts1.token.isCancellationRequested) {
			trace('returning early - cts1 cancelled');
			return undefined;
		}

		// part 2 - do rename at location
		const cts2 = new EditorStateCancellationTokenSource(this.editor, CodeEditorStateFlag.Position | CodeEditorStateFlag.Value, loc.range, this._cts.token);

		const model = this.editor.getModel(); // @ulugbekna: assumes editor still has a model, otherwise, cts1 should've been cancelled

		const newSymbolNamesProviders = this._languageFeaturesService.newSymbolNamesProvider.all(model);

		const resolvedNewSymbolnamesProviders = await Promise.all(newSymbolNamesProviders.map(async p => [p, await p.supportsAutomaticNewSymbolNamesTriggerKind ?? false] as const));

		const requestRenameSuggestions = (triggerKind: NewSymbolNameTriggerKind, cts: CancellationToken) => {
			let providers = resolvedNewSymbolnamesProviders.slice();

			if (triggerKind === NewSymbolNameTriggerKind.Automatic) {
				providers = providers.filter(([_, supportsAutomatic]) => supportsAutomatic);
			}

			return providers.map(([p,]) => p.provideNewSymbolNames(model, loc.range, triggerKind, cts));
		};

		trace('creating rename input field and awaiting its result');
		const supportPreview = this._bulkEditService.hasPreviewHandler() && this._configService.getValue<boolean>(this.editor.getModel().uri, 'editor.rename.enablePreview');
		const inputFieldResult = await this._renameWidget.getInput(
			loc.range,
			loc.text,
			supportPreview,
			newSymbolNamesProviders.length > 0 ? requestRenameSuggestions : undefined,
			cts2
		);
		trace('received response from rename input field');

		// no result, only hint to focus the editor or not
		if (typeof inputFieldResult === 'boolean') {
			trace(`returning early - rename input field response - ${inputFieldResult}`);
			if (inputFieldResult) {
				this.editor.focus();
			}
			cts2.dispose();
			return undefined;
		}

		this.editor.focus();

		trace('requesting rename edits');
		const renameOperation = raceCancellation(skeleton.provideRenameEdits(inputFieldResult.newName, cts2.token), cts2.token).then(async renameResult => {

			if (!renameResult) {
				trace('returning early - no rename edits result');
				return;
			}
			if (!this.editor.hasModel()) {
				trace('returning early - no model after rename edits are provided');
				return;
			}

			if (renameResult.rejectReason) {
				trace(`returning early - rejected with reason: ${renameResult.rejectReason}`);
				this._notificationService.info(renameResult.rejectReason);
				return;
			}

			// collapse selection to active end
			this.editor.setSelection(Range.fromPositions(this.editor.getSelection().getPosition()));

			trace('applying edits');

			this._bulkEditService.apply(renameResult, {
				editor: this.editor,
				showPreview: inputFieldResult.wantsPreview,
				label: nls.localize('label', "Renaming '{0}' to '{1}'", loc?.text, inputFieldResult.newName),
				code: 'undoredo.rename',
				quotableLabel: nls.localize('quotableLabel', "Renaming {0} to {1}", loc?.text, inputFieldResult.newName),
				respectAutoSaveConfig: true,
				reason: EditSources.rename(loc?.text, inputFieldResult.newName),
			}).then(result => {
				trace('edits applied');
				if (result.ariaSummary) {
					alert(nls.localize('aria', "Successfully renamed '{0}' to '{1}'. Summary: {2}", loc.text, inputFieldResult.newName, result.ariaSummary));
				}
			}).catch(err => {
				trace(`error when applying edits ${JSON.stringify(err, null, '\t')}`);
				this._notificationService.error(nls.localize('rename.failedApply', "Rename failed to apply edits"));
				this._logService.error(err);
			});

		}, err => {
			trace('error when providing rename edits', JSON.stringify(err, null, '\t'));

			this._notificationService.error(nls.localize('rename.failed', "Rename failed to compute edits"));
			this._logService.error(err);

		}).finally(() => {
			cts2.dispose();
		});

		trace('returning rename operation');

		this._progressService.showWhile(renameOperation, 250);
		return renameOperation;

	}

	acceptRenameInput(wantsPreview: boolean): void {
		this._renameWidget.acceptInput(wantsPreview);
	}

	cancelRenameInput(): void {
		this._renameWidget.cancelInput(true, 'cancelRenameInput command');
	}

	focusNextRenameSuggestion(): void {
		this._renameWidget.focusNextRenameSuggestion();
	}

	focusPreviousRenameSuggestion(): void {
		this._renameWidget.focusPreviousRenameSuggestion();
	}
}

// ---- action implementation

export class RenameAction extends EditorAction {

	constructor() {
		super({
			id: 'editor.action.rename',
			label: nls.localize2('rename.label', "Rename Symbol"),
			precondition: ContextKeyExpr.and(EditorContextKeys.writable, EditorContextKeys.hasRenameProvider),
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyCode.F2,
				weight: KeybindingWeight.EditorContrib
			},
			contextMenuOpts: {
				group: '1_modification',
				order: 1.1
			},
			canTriggerInlineEdits: true,
		});
	}

	override runCommand(accessor: ServicesAccessor, args: [URI, IPosition]): void | Promise<void> {
		const editorService = accessor.get(ICodeEditorService);
		const [uri, pos] = Array.isArray(args) && args || [undefined, undefined];

		if (URI.isUri(uri) && Position.isIPosition(pos)) {
			return editorService.openCodeEditor({ resource: uri }, editorService.getActiveCodeEditor()).then(editor => {
				if (!editor) {
					return;
				}
				editor.setPosition(pos);
				editor.invokeWithinContext(accessor => {
					this.reportTelemetry(accessor, editor);
					return this.run(accessor, editor);
				});
			}, onUnexpectedError);
		}

		return super.runCommand(accessor, args);
	}

	run(accessor: ServicesAccessor, editor: ICodeEditor): Promise<void> {
		const logService = accessor.get(ILogService);

		const controller = RenameController.get(editor);

		if (controller) {
			logService.trace('[RenameAction] got controller, running...');
			return controller.run();
		}
		logService.trace('[RenameAction] returning early - controller missing');
		return Promise.resolve();
	}
}

registerEditorContribution(RenameController.ID, RenameController, EditorContributionInstantiation.Lazy);
registerEditorAction(RenameAction);

const RenameCommand = EditorCommand.bindToContribution<RenameController>(RenameController.get);

registerEditorCommand(new RenameCommand({
	id: 'acceptRenameInput',
	precondition: CONTEXT_RENAME_INPUT_VISIBLE,
	handler: x => x.acceptRenameInput(false),
	kbOpts: {
		weight: KeybindingWeight.EditorContrib + 99,
		kbExpr: ContextKeyExpr.and(EditorContextKeys.focus, ContextKeyExpr.not('isComposing')),
		primary: KeyCode.Enter
	}
}));

registerEditorCommand(new RenameCommand({
	id: 'acceptRenameInputWithPreview',
	precondition: ContextKeyExpr.and(CONTEXT_RENAME_INPUT_VISIBLE, ContextKeyExpr.has('config.editor.rename.enablePreview')),
	handler: x => x.acceptRenameInput(true),
	kbOpts: {
		weight: KeybindingWeight.EditorContrib + 99,
		kbExpr: ContextKeyExpr.and(EditorContextKeys.focus, ContextKeyExpr.not('isComposing')),
		primary: KeyMod.CtrlCmd + KeyCode.Enter
	}
}));

registerEditorCommand(new RenameCommand({
	id: 'cancelRenameInput',
	precondition: CONTEXT_RENAME_INPUT_VISIBLE,
	handler: x => x.cancelRenameInput(),
	kbOpts: {
		weight: KeybindingWeight.EditorContrib + 99,
		kbExpr: EditorContextKeys.focus,
		primary: KeyCode.Escape,
		secondary: [KeyMod.Shift | KeyCode.Escape]
	}
}));

registerAction2(class FocusNextRenameSuggestion extends Action2 {
	constructor() {
		super({
			id: 'focusNextRenameSuggestion',
			title: {
				...nls.localize2('focusNextRenameSuggestion', "Focus Next Rename Suggestion"),
			},
			precondition: CONTEXT_RENAME_INPUT_VISIBLE,
			keybinding: [
				{
					primary: KeyCode.DownArrow,
					weight: KeybindingWeight.EditorContrib + 99,
				}
			]
		});
	}

	override run(accessor: ServicesAccessor): void {
		const currentEditor = accessor.get(ICodeEditorService).getFocusedCodeEditor();
		if (!currentEditor) { return; }

		const controller = RenameController.get(currentEditor);
		if (!controller) { return; }

		controller.focusNextRenameSuggestion();
	}
});

registerAction2(class FocusPreviousRenameSuggestion extends Action2 {
	constructor() {
		super({
			id: 'focusPreviousRenameSuggestion',
			title: {
				...nls.localize2('focusPreviousRenameSuggestion', "Focus Previous Rename Suggestion"),
			},
			precondition: CONTEXT_RENAME_INPUT_VISIBLE,
			keybinding: [
				{
					primary: KeyCode.UpArrow,
					weight: KeybindingWeight.EditorContrib + 99,
				}
			]
		});
	}

	override run(accessor: ServicesAccessor): void {
		const currentEditor = accessor.get(ICodeEditorService).getFocusedCodeEditor();
		if (!currentEditor) { return; }

		const controller = RenameController.get(currentEditor);
		if (!controller) { return; }

		controller.focusPreviousRenameSuggestion();
	}
});

// ---- api bridge command

registerModelAndPositionCommand('_executeDocumentRenameProvider', function (accessor, model, position, ...args) {
	const [newName] = args;
	assertType(typeof newName === 'string');
	const { renameProvider } = accessor.get(ILanguageFeaturesService);
	return rename(renameProvider, model, position, newName);
});

registerModelAndPositionCommand('_executePrepareRename', async function (accessor, model, position) {
	const { renameProvider } = accessor.get(ILanguageFeaturesService);
	const skeleton = new RenameSkeleton(model, position, renameProvider);
	const loc = await skeleton.resolveRenameLocation(CancellationToken.None);
	if (loc?.rejectReason) {
		throw new Error(loc.rejectReason);
	}
	return loc;
});


//todo@jrieken use editor options world
Registry.as<IConfigurationRegistry>(Extensions.Configuration).registerConfiguration({
	id: 'editor',
	properties: {
		'editor.rename.enablePreview': {
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			description: nls.localize('enablePreview', "Enable/disable the ability to preview changes before renaming"),
			default: true,
			type: 'boolean'
		}
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/rename/browser/renameWidget.css]---
Location: vscode-main/src/vs/editor/contrib/rename/browser/renameWidget.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-editor .rename-box {
	z-index: 100;
	color: inherit;
	border-radius: 4px;
}

.monaco-editor .rename-box.preview {
	padding: 4px 4px 0 4px;
}

.monaco-editor .rename-box .rename-input-with-button {
	padding: 3px;
	border-radius: 2px;
	width: calc(100% - 8px); /* 4px padding on each side */
}

.monaco-editor .rename-box .rename-input {
	width: calc(100% - 8px); /* 4px padding on each side */
	padding: 0;
}

.monaco-editor .rename-box .rename-input:focus {
	outline: none;
}

.monaco-editor .rename-box .rename-suggestions-button {
	display: flex;
	align-items: center;
	padding: 3px;
	background-color: transparent;
	border: none;
	border-radius: 5px;
	cursor: pointer;
}

.monaco-editor .rename-box .rename-suggestions-button:hover {
	background-color: var(--vscode-toolbar-hoverBackground)
}

.monaco-editor .rename-box .rename-candidate-list-container .monaco-list-row {
	border-radius: 2px;
}

.monaco-editor .rename-box .rename-label {
	display: none;
	opacity: .8;
}

.monaco-editor .rename-box.preview .rename-label {
	display: inherit;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/rename/browser/renameWidget.ts]---
Location: vscode-main/src/vs/editor/contrib/rename/browser/renameWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { StandardKeyboardEvent } from '../../../../base/browser/keyboardEvent.js';
import * as aria from '../../../../base/browser/ui/aria/aria.js';
import { getBaseLayerHoverDelegate } from '../../../../base/browser/ui/hover/hoverDelegate2.js';
import { renderIcon } from '../../../../base/browser/ui/iconLabel/iconLabels.js';
import { IListRenderer, IListVirtualDelegate } from '../../../../base/browser/ui/list/list.js';
import { List } from '../../../../base/browser/ui/list/listWidget.js';
import * as arrays from '../../../../base/common/arrays.js';
import { DeferredPromise, raceCancellation } from '../../../../base/common/async.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { Emitter } from '../../../../base/common/event.js';
import { KeyCode } from '../../../../base/common/keyCodes.js';
import { DisposableStore, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { StopWatch } from '../../../../base/common/stopwatch.js';
import { assertType, isDefined } from '../../../../base/common/types.js';
import './renameWidget.css';
import * as domFontInfo from '../../../browser/config/domFontInfo.js';
import { ContentWidgetPositionPreference, ICodeEditor, IContentWidget, IContentWidgetPosition } from '../../../browser/editorBrowser.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { FontInfo } from '../../../common/config/fontInfo.js';
import { IDimension } from '../../../common/core/2d/dimension.js';
import { Position } from '../../../common/core/position.js';
import { IRange, Range } from '../../../common/core/range.js';
import { ScrollType } from '../../../common/editorCommon.js';
import { NewSymbolName, NewSymbolNameTag, NewSymbolNameTriggerKind, ProviderResult } from '../../../common/languages.js';
import * as nls from '../../../../nls.js';
import { IContextKey, IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { getListStyles } from '../../../../platform/theme/browser/defaultStyles.js';
import {
	editorWidgetBackground,
	inputBackground,
	inputBorder,
	inputForeground,
	quickInputListFocusBackground,
	quickInputListFocusForeground,
	widgetBorder,
	widgetShadow
} from '../../../../platform/theme/common/colorRegistry.js';
import { IColorTheme, IThemeService } from '../../../../platform/theme/common/themeService.js';
import { HoverStyle } from '../../../../base/browser/ui/hover/hover.js';

/** for debugging */
const _sticky = false
	// || Boolean("true") // done "weirdly" so that a lint warning prevents you from pushing this
	;


export const CONTEXT_RENAME_INPUT_VISIBLE = new RawContextKey<boolean>('renameInputVisible', false, nls.localize('renameInputVisible', "Whether the rename input widget is visible"));
export const CONTEXT_RENAME_INPUT_FOCUSED = new RawContextKey<boolean>('renameInputFocused', false, nls.localize('renameInputFocused', "Whether the rename input widget is focused"));

/**
 * "Source" of the new name:
 * - 'inputField' - user entered the new name
 * - 'renameSuggestion' - user picked from rename suggestions
 * - 'userEditedRenameSuggestion' - user _likely_ edited a rename suggestion ("likely" because when input started being edited, a rename suggestion had focus)
 */
export type NewNameSource =
	| { k: 'inputField' }
	| { k: 'renameSuggestion' }
	| { k: 'userEditedRenameSuggestion' };

/**
 * Various statistics regarding rename input field
 */
export type RenameWidgetStats = {
	nRenameSuggestions: number;
	source: NewNameSource;
	timeBeforeFirstInputFieldEdit: number | undefined;
	nRenameSuggestionsInvocations: number;
	hadAutomaticRenameSuggestionsInvocation: boolean;
};

export type RenameWidgetResult = {
	/**
	 * The new name to be used
	 */
	newName: string;
	wantsPreview?: boolean;
	stats: RenameWidgetStats;
};

interface IRenameWidget {
	/**
	 * @returns a `boolean` standing for `shouldFocusEditor`, if user didn't pick a new name, or a {@link RenameWidgetResult}
	 */
	getInput(
		where: IRange,
		currentName: string,
		supportPreview: boolean,
		requestRenameSuggestions: (triggerKind: NewSymbolNameTriggerKind, cts: CancellationToken) => ProviderResult<NewSymbolName[]>[],
		cts: CancellationTokenSource
	): Promise<RenameWidgetResult | boolean>;

	acceptInput(wantsPreview: boolean): void;
	cancelInput(focusEditor: boolean, caller: string): void;

	focusNextRenameSuggestion(): void;
	focusPreviousRenameSuggestion(): void;
}

export class RenameWidget implements IRenameWidget, IContentWidget, IDisposable {

	// implement IContentWidget
	readonly allowEditorOverflow: boolean = true;

	// UI state

	private _domNode?: HTMLElement;
	private _inputWithButton: InputWithButton;
	private _renameCandidateListView?: RenameCandidateListView;
	private _label?: HTMLDivElement;

	private _nPxAvailableAbove?: number;
	private _nPxAvailableBelow?: number;

	// Model state

	private _position?: Position;
	private _currentName?: string;
	/** Is true if input field got changes when a rename candidate was focused; otherwise, false */
	private _isEditingRenameCandidate: boolean;

	private readonly _candidates: Set<string>;

	private _visible?: boolean;

	/** must be reset at session start */
	private _beforeFirstInputFieldEditSW: StopWatch;

	/**
	 * Milliseconds before user edits the input field for the first time
	 * @remarks must be set once per session
	 */
	private _timeBeforeFirstInputFieldEdit: number | undefined;

	private _nRenameSuggestionsInvocations: number;

	private _hadAutomaticRenameSuggestionsInvocation: boolean;

	private _renameCandidateProvidersCts: CancellationTokenSource | undefined;
	private _renameCts: CancellationTokenSource | undefined;

	private readonly _visibleContextKey: IContextKey<boolean>;
	private readonly _disposables = new DisposableStore();

	constructor(
		private readonly _editor: ICodeEditor,
		private readonly _acceptKeybindings: [string, string],
		@IThemeService private readonly _themeService: IThemeService,
		@IKeybindingService private readonly _keybindingService: IKeybindingService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@ILogService private readonly _logService: ILogService,
	) {
		this._visibleContextKey = CONTEXT_RENAME_INPUT_VISIBLE.bindTo(contextKeyService);

		this._isEditingRenameCandidate = false;

		this._nRenameSuggestionsInvocations = 0;

		this._hadAutomaticRenameSuggestionsInvocation = false;

		this._candidates = new Set();

		this._beforeFirstInputFieldEditSW = new StopWatch();

		this._inputWithButton = new InputWithButton();
		this._disposables.add(this._inputWithButton);

		this._editor.addContentWidget(this);

		this._disposables.add(this._editor.onDidChangeConfiguration(e => {
			if (e.hasChanged(EditorOption.fontInfo)) {
				this._updateFont();
			}
		}));

		this._disposables.add(_themeService.onDidColorThemeChange(this._updateStyles, this));
	}

	dispose(): void {
		this._disposables.dispose();
		this._editor.removeContentWidget(this);
	}

	getId(): string {
		return '__renameInputWidget';
	}

	getDomNode(): HTMLElement {
		if (!this._domNode) {
			this._domNode = document.createElement('div');
			this._domNode.className = 'monaco-editor rename-box';

			this._domNode.appendChild(this._inputWithButton.domNode);

			this._renameCandidateListView = this._disposables.add(
				new RenameCandidateListView(this._domNode, {
					fontInfo: this._editor.getOption(EditorOption.fontInfo),
					onFocusChange: (newSymbolName: string) => {
						this._inputWithButton.input.value = newSymbolName;
						this._isEditingRenameCandidate = false; // @ulugbekna: reset
					},
					onSelectionChange: () => {
						this._isEditingRenameCandidate = false; // @ulugbekna: because user picked a rename suggestion
						this.acceptInput(false); // we don't allow preview with mouse click for now
					}
				})
			);

			this._disposables.add(
				this._inputWithButton.onDidInputChange(() => {
					if (this._renameCandidateListView?.focusedCandidate !== undefined) {
						this._isEditingRenameCandidate = true;
					}
					this._timeBeforeFirstInputFieldEdit ??= this._beforeFirstInputFieldEditSW.elapsed();
					if (this._renameCandidateProvidersCts?.token.isCancellationRequested === false) {
						this._renameCandidateProvidersCts.cancel();
					}
					this._renameCandidateListView?.clearFocus();
				})
			);

			this._label = document.createElement('div');
			this._label.className = 'rename-label';
			this._domNode.appendChild(this._label);

			this._updateFont();
			this._updateStyles(this._themeService.getColorTheme());
		}
		return this._domNode;
	}

	private _updateStyles(theme: IColorTheme): void {
		if (!this._domNode) {
			return;
		}

		const widgetShadowColor = theme.getColor(widgetShadow);
		const widgetBorderColor = theme.getColor(widgetBorder);
		this._domNode.style.backgroundColor = String(theme.getColor(editorWidgetBackground) ?? '');
		this._domNode.style.boxShadow = widgetShadowColor ? ` 0 0 8px 2px ${widgetShadowColor}` : '';
		this._domNode.style.border = widgetBorderColor ? `1px solid ${widgetBorderColor}` : '';
		this._domNode.style.color = String(theme.getColor(inputForeground) ?? '');

		const border = theme.getColor(inputBorder);

		this._inputWithButton.domNode.style.backgroundColor = String(theme.getColor(inputBackground) ?? '');
		this._inputWithButton.input.style.backgroundColor = String(theme.getColor(inputBackground) ?? '');
		this._inputWithButton.domNode.style.borderWidth = border ? '1px' : '0px';
		this._inputWithButton.domNode.style.borderStyle = border ? 'solid' : 'none';
		this._inputWithButton.domNode.style.borderColor = border?.toString() ?? 'none';
	}

	private _updateFont(): void {
		if (this._domNode === undefined) {
			return;
		}
		assertType(this._label !== undefined, 'RenameWidget#_updateFont: _label must not be undefined given _domNode is defined');

		this._editor.applyFontInfo(this._inputWithButton.input);

		const fontInfo = this._editor.getOption(EditorOption.fontInfo);
		this._label.style.fontSize = `${this._computeLabelFontSize(fontInfo.fontSize)}px`;
	}

	private _computeLabelFontSize(editorFontSize: number) {
		return editorFontSize * 0.8;
	}

	getPosition(): IContentWidgetPosition | null {
		if (!this._visible) {
			return null;
		}

		if (!this._editor.hasModel() || // @ulugbekna: shouldn't happen
			!this._editor.getDomNode() // @ulugbekna: can happen during tests based on suggestWidget's similar predicate check
		) {
			return null;
		}

		const bodyBox = dom.getClientArea(this.getDomNode().ownerDocument.body);
		const editorBox = dom.getDomNodePagePosition(this._editor.getDomNode());

		const cursorBoxTop = this._getTopForPosition();

		this._nPxAvailableAbove = cursorBoxTop + editorBox.top;
		this._nPxAvailableBelow = bodyBox.height - this._nPxAvailableAbove;

		const lineHeight = this._editor.getOption(EditorOption.lineHeight);
		const { totalHeight: candidateViewHeight } = RenameCandidateView.getLayoutInfo({ lineHeight });

		const positionPreference = this._nPxAvailableBelow > candidateViewHeight * 6 /* approximate # of candidates to fit in (inclusive of rename input box & rename label) */
			? [ContentWidgetPositionPreference.BELOW, ContentWidgetPositionPreference.ABOVE]
			: [ContentWidgetPositionPreference.ABOVE, ContentWidgetPositionPreference.BELOW];

		return {
			position: this._position!,
			preference: positionPreference,
		};
	}

	beforeRender(): IDimension | null {
		const [accept, preview] = this._acceptKeybindings;
		this._label!.innerText = nls.localize({ key: 'label', comment: ['placeholders are keybindings, e.g "F2 to Rename, Shift+F2 to Preview"'] }, "{0} to Rename, {1} to Preview", this._keybindingService.lookupKeybinding(accept)?.getLabel(), this._keybindingService.lookupKeybinding(preview)?.getLabel());

		this._domNode!.style.minWidth = `200px`; // to prevent from widening when candidates come in

		return null;
	}

	afterRender(position: ContentWidgetPositionPreference | null): void {
		// FIXME@ulugbekna: commenting trace log out until we start unmounting the widget from editor properly - https://github.com/microsoft/vscode/issues/226975
		// this._trace('invoking afterRender, position: ', position ? 'not null' : 'null');
		if (position === null) {
			// cancel rename when input widget isn't rendered anymore
			this.cancelInput(true, 'afterRender (because position is null)');
			return;
		}

		if (!this._editor.hasModel() || // shouldn't happen
			!this._editor.getDomNode() // can happen during tests based on suggestWidget's similar predicate check
		) {
			return;
		}

		assertType(this._renameCandidateListView);
		assertType(this._nPxAvailableAbove !== undefined);
		assertType(this._nPxAvailableBelow !== undefined);

		const inputBoxHeight = dom.getTotalHeight(this._inputWithButton.domNode);

		const labelHeight = dom.getTotalHeight(this._label!);

		let totalHeightAvailable: number;
		if (position === ContentWidgetPositionPreference.BELOW) {
			totalHeightAvailable = this._nPxAvailableBelow;
		} else {
			totalHeightAvailable = this._nPxAvailableAbove;
		}

		this._renameCandidateListView.layout({
			height: totalHeightAvailable - labelHeight - inputBoxHeight,
			width: dom.getTotalWidth(this._inputWithButton.domNode),
		});
	}


	private _currentAcceptInput?: (wantsPreview: boolean) => void;
	private _currentCancelInput?: (focusEditor: boolean) => void;
	private _requestRenameCandidatesOnce?: (triggerKind: NewSymbolNameTriggerKind, cts: CancellationToken) => ProviderResult<NewSymbolName[]>[];

	acceptInput(wantsPreview: boolean): void {
		this._trace(`invoking acceptInput`);
		this._currentAcceptInput?.(wantsPreview);
	}

	cancelInput(focusEditor: boolean, caller: string): void {
		// this._trace(`invoking cancelInput, caller: ${caller}, _currentCancelInput: ${this._currentAcceptInput ? 'not undefined' : 'undefined'}`);
		this._currentCancelInput?.(focusEditor);
	}

	focusNextRenameSuggestion() {
		if (!this._renameCandidateListView?.focusNext()) {
			this._inputWithButton.input.value = this._currentName!;
		}
	}

	focusPreviousRenameSuggestion() { // TODO@ulugbekna: this and focusNext should set the original name if no candidate is focused
		if (!this._renameCandidateListView?.focusPrevious()) {
			this._inputWithButton.input.value = this._currentName!;
		}
	}

	/**
	 * @param requestRenameCandidates is `undefined` when there are no rename suggestion providers
	 */
	getInput(
		where: IRange,
		currentName: string,
		supportPreview: boolean,
		requestRenameCandidates: undefined | ((triggerKind: NewSymbolNameTriggerKind, cts: CancellationToken) => ProviderResult<NewSymbolName[]>[]),
		cts: CancellationTokenSource
	): Promise<RenameWidgetResult | boolean> {

		const { start: selectionStart, end: selectionEnd } = this._getSelection(where, currentName);

		this._renameCts = cts;

		const disposeOnDone = new DisposableStore();

		this._nRenameSuggestionsInvocations = 0;

		this._hadAutomaticRenameSuggestionsInvocation = false;

		if (requestRenameCandidates === undefined) {
			this._inputWithButton.button.style.display = 'none';
		} else {
			this._inputWithButton.button.style.display = 'flex';

			this._requestRenameCandidatesOnce = requestRenameCandidates;

			this._requestRenameCandidates(currentName, false);

			disposeOnDone.add(dom.addDisposableListener(
				this._inputWithButton.button,
				'click',
				() => this._requestRenameCandidates(currentName, true)
			));
			disposeOnDone.add(dom.addDisposableListener(
				this._inputWithButton.button,
				dom.EventType.KEY_DOWN,
				(e) => {
					const keyEvent = new StandardKeyboardEvent(e);

					if (keyEvent.equals(KeyCode.Enter) || keyEvent.equals(KeyCode.Space)) {
						keyEvent.stopPropagation();
						keyEvent.preventDefault();
						this._requestRenameCandidates(currentName, true);
					}
				}
			));
		}

		this._isEditingRenameCandidate = false;

		this._domNode!.classList.toggle('preview', supportPreview);

		this._position = new Position(where.startLineNumber, where.startColumn);
		this._currentName = currentName;

		this._inputWithButton.input.value = currentName;
		this._inputWithButton.input.setAttribute('selectionStart', selectionStart.toString());
		this._inputWithButton.input.setAttribute('selectionEnd', selectionEnd.toString());
		this._inputWithButton.input.size = Math.max((where.endColumn - where.startColumn) * 1.1, 20); // determines width

		this._beforeFirstInputFieldEditSW.reset();


		disposeOnDone.add(toDisposable(() => {
			this._renameCts = undefined;
			cts.dispose(true);
		})); // @ulugbekna: this may result in `this.cancelInput` being called twice, but it should be safe since we set it to undefined after 1st call
		disposeOnDone.add(toDisposable(() => {
			if (this._renameCandidateProvidersCts !== undefined) {
				this._renameCandidateProvidersCts.dispose(true);
				this._renameCandidateProvidersCts = undefined;
			}
		}));

		disposeOnDone.add(toDisposable(() => this._candidates.clear()));

		const inputResult = new DeferredPromise<RenameWidgetResult | boolean>();

		inputResult.p.finally(() => {
			disposeOnDone.dispose();
			this._hide();
		});

		this._currentCancelInput = (focusEditor) => {
			this._trace('invoking _currentCancelInput');
			this._currentAcceptInput = undefined;
			this._currentCancelInput = undefined;
			// fixme session cleanup
			this._renameCandidateListView?.clearCandidates();
			inputResult.complete(focusEditor);
			return true;
		};

		this._currentAcceptInput = (wantsPreview) => {
			this._trace('invoking _currentAcceptInput');
			assertType(this._renameCandidateListView !== undefined);

			const nRenameSuggestions = this._renameCandidateListView.nCandidates;

			let newName: string;
			let source: NewNameSource;
			const focusedCandidate = this._renameCandidateListView.focusedCandidate;
			if (focusedCandidate !== undefined) {
				this._trace('using new name from renameSuggestion');
				newName = focusedCandidate;
				source = { k: 'renameSuggestion' };
			} else {
				this._trace('using new name from inputField');
				newName = this._inputWithButton.input.value;
				source = this._isEditingRenameCandidate ? { k: 'userEditedRenameSuggestion' } : { k: 'inputField' };
			}

			if (newName === currentName || newName.trim().length === 0 /* is just whitespace */) {
				this.cancelInput(true, '_currentAcceptInput (because newName === value || newName.trim().length === 0)');
				return;
			}

			this._currentAcceptInput = undefined;
			this._currentCancelInput = undefined;
			this._renameCandidateListView.clearCandidates();
			// fixme session cleanup

			inputResult.complete({
				newName,
				wantsPreview: supportPreview && wantsPreview,
				stats: {
					source,
					nRenameSuggestions,
					timeBeforeFirstInputFieldEdit: this._timeBeforeFirstInputFieldEdit,
					nRenameSuggestionsInvocations: this._nRenameSuggestionsInvocations,
					hadAutomaticRenameSuggestionsInvocation: this._hadAutomaticRenameSuggestionsInvocation,
				}
			});
		};

		disposeOnDone.add(cts.token.onCancellationRequested(() => this.cancelInput(true, 'cts.token.onCancellationRequested')));
		if (!_sticky) {
			disposeOnDone.add(this._editor.onDidBlurEditorWidget(() => this.cancelInput(!this._domNode?.ownerDocument.hasFocus(), 'editor.onDidBlurEditorWidget')));
		}

		this._show();

		return inputResult.p;
	}

	private _requestRenameCandidates(currentName: string, isManuallyTriggered: boolean) {
		if (this._requestRenameCandidatesOnce === undefined) {
			return;
		}
		if (this._renameCandidateProvidersCts !== undefined) {
			this._renameCandidateProvidersCts.dispose(true);
		}

		assertType(this._renameCts);

		if (this._inputWithButton.buttonState !== 'stop') {

			this._renameCandidateProvidersCts = new CancellationTokenSource();

			const triggerKind = isManuallyTriggered ? NewSymbolNameTriggerKind.Invoke : NewSymbolNameTriggerKind.Automatic;
			const candidates = this._requestRenameCandidatesOnce(triggerKind, this._renameCandidateProvidersCts.token);

			if (candidates.length === 0) {
				this._inputWithButton.setSparkleButton();
				return;
			}

			if (!isManuallyTriggered) {
				this._hadAutomaticRenameSuggestionsInvocation = true;
			}

			this._nRenameSuggestionsInvocations += 1;

			this._inputWithButton.setStopButton();

			this._updateRenameCandidates(candidates, currentName, this._renameCts.token);
		}
	}

	/**
	 * This allows selecting only part of the symbol name in the input field based on the selection in the editor
	 */
	private _getSelection(where: IRange, currentName: string): { start: number; end: number } {
		assertType(this._editor.hasModel());

		const selection = this._editor.getSelection();
		let start = 0;
		let end = currentName.length;

		if (!Range.isEmpty(selection) && !Range.spansMultipleLines(selection) && Range.containsRange(where, selection)) {
			start = Math.max(0, selection.startColumn - where.startColumn);
			end = Math.min(where.endColumn, selection.endColumn) - where.startColumn;
		}

		return { start, end };
	}

	private _show(): void {
		this._trace('invoking _show');
		this._editor.revealLineInCenterIfOutsideViewport(this._position!.lineNumber, ScrollType.Smooth);
		this._visible = true;
		this._visibleContextKey.set(true);
		this._editor.layoutContentWidget(this);

		// TODO@ulugbekna: could this be simply run in `afterRender`?
		setTimeout(() => {
			this._inputWithButton.input.focus();
			this._inputWithButton.input.setSelectionRange(
				parseInt(this._inputWithButton.input.getAttribute('selectionStart')!),
				parseInt(this._inputWithButton.input.getAttribute('selectionEnd')!)
			);
		}, 100);
	}

	private async _updateRenameCandidates(candidates: ProviderResult<NewSymbolName[]>[], currentName: string, token: CancellationToken) {
		const trace = (...args: unknown[]) => this._trace('_updateRenameCandidates', ...args);

		trace('start');
		const namesListResults = await raceCancellation(Promise.allSettled(candidates), token);

		this._inputWithButton.setSparkleButton();

		if (namesListResults === undefined) {
			trace('returning early - received updateRenameCandidates results - undefined');
			return;
		}

		const newNames = namesListResults.flatMap(namesListResult =>
			namesListResult.status === 'fulfilled' && isDefined(namesListResult.value)
				? namesListResult.value
				: []
		);
		trace(`received updateRenameCandidates results - total (unfiltered) ${newNames.length} candidates.`);

		// deduplicate and filter out the current value

		const distinctNames = arrays.distinct(newNames, v => v.newSymbolName);
		trace(`distinct candidates - ${distinctNames.length} candidates.`);

		const validDistinctNames = distinctNames.filter(({ newSymbolName }) => newSymbolName.trim().length > 0 && newSymbolName !== this._inputWithButton.input.value && newSymbolName !== currentName && !this._candidates.has(newSymbolName));
		trace(`valid distinct candidates - ${newNames.length} candidates.`);

		validDistinctNames.forEach(n => this._candidates.add(n.newSymbolName));

		if (validDistinctNames.length < 1) {
			trace('returning early - no valid distinct candidates');
			return;
		}

		// show the candidates
		trace('setting candidates');
		this._renameCandidateListView!.setCandidates(validDistinctNames);

		// ask editor to re-layout given that the widget is now of a different size after rendering rename candidates
		trace('asking editor to re-layout');
		this._editor.layoutContentWidget(this);
	}

	private _hide(): void {
		this._trace('invoked _hide');
		this._visible = false;
		this._visibleContextKey.reset();
		this._editor.layoutContentWidget(this);
	}

	private _getTopForPosition(): number {
		const visibleRanges = this._editor.getVisibleRanges();
		let firstLineInViewport: number;
		if (visibleRanges.length > 0) {
			firstLineInViewport = visibleRanges[0].startLineNumber;
		} else {
			this._logService.warn('RenameWidget#_getTopForPosition: this should not happen - visibleRanges is empty');
			firstLineInViewport = Math.max(1, this._position!.lineNumber - 5); // @ulugbekna: fallback to current line minus 5
		}
		return this._editor.getTopForLineNumber(this._position!.lineNumber) - this._editor.getTopForLineNumber(firstLineInViewport);
	}

	private _trace(...args: unknown[]) {
		this._logService.trace('RenameWidget', ...args);
	}
}

class RenameCandidateListView {

	/** Parent node of the list widget; needed to control # of list elements visible */
	private readonly _listContainer: HTMLDivElement;
	private readonly _listWidget: List<NewSymbolName>;

	private _lineHeight: number;
	private _availableHeight: number;
	private _minimumWidth: number;
	private _typicalHalfwidthCharacterWidth: number;

	private readonly _disposables: DisposableStore;

	// FIXME@ulugbekna: rewrite using event emitters
	constructor(parent: HTMLElement, opts: { fontInfo: FontInfo; onFocusChange: (newSymbolName: string) => void; onSelectionChange: () => void }) {

		this._disposables = new DisposableStore();

		this._availableHeight = 0;
		this._minimumWidth = 0;

		this._lineHeight = opts.fontInfo.lineHeight;
		this._typicalHalfwidthCharacterWidth = opts.fontInfo.typicalHalfwidthCharacterWidth;

		this._listContainer = document.createElement('div');
		this._listContainer.className = 'rename-box rename-candidate-list-container';
		parent.appendChild(this._listContainer);

		this._listWidget = RenameCandidateListView._createListWidget(this._listContainer, this._candidateViewHeight, opts.fontInfo);

		this._disposables.add(this._listWidget.onDidChangeFocus(
			e => {
				if (e.elements.length === 1) {
					opts.onFocusChange(e.elements[0].newSymbolName);
				}
			},
			this._disposables
		));

		this._disposables.add(this._listWidget.onDidChangeSelection(
			e => {
				if (e.elements.length === 1) {
					opts.onSelectionChange();
				}
			},
			this._disposables
		));

		this._disposables.add(
			this._listWidget.onDidBlur(e => { // @ulugbekna: because list widget otherwise remembers last focused element and returns it as focused element
				this._listWidget.setFocus([]);
			})
		);

		this._listWidget.style(getListStyles({
			listInactiveFocusForeground: quickInputListFocusForeground,
			listInactiveFocusBackground: quickInputListFocusBackground,
		}));
	}

	dispose() {
		this._listWidget.dispose();
		this._disposables.dispose();
	}

	// height - max height allowed by parent element
	public layout({ height, width }: { height: number; width: number }): void {
		this._availableHeight = height;
		this._minimumWidth = width;
	}

	public setCandidates(candidates: NewSymbolName[]): void {

		// insert candidates into list widget
		this._listWidget.splice(0, 0, candidates);

		// adjust list widget layout
		const height = this._pickListHeight(this._listWidget.length);
		const width = this._pickListWidth(candidates);

		this._listWidget.layout(height, width);

		// adjust list container layout
		this._listContainer.style.height = `${height}px`;
		this._listContainer.style.width = `${width}px`;

		aria.status(nls.localize('renameSuggestionsReceivedAria', "Received {0} rename suggestions", candidates.length));
	}

	public clearCandidates(): void {
		this._listContainer.style.height = '0px';
		this._listContainer.style.width = '0px';
		this._listWidget.splice(0, this._listWidget.length, []);
	}

	public get nCandidates() {
		return this._listWidget.length;
	}

	public get focusedCandidate(): string | undefined {
		if (this._listWidget.length === 0) {
			return;
		}
		const selectedElement = this._listWidget.getSelectedElements()[0];
		if (selectedElement !== undefined) {
			return selectedElement.newSymbolName;
		}
		const focusedElement = this._listWidget.getFocusedElements()[0];
		if (focusedElement !== undefined) {
			return focusedElement.newSymbolName;
		}
		return;
	}

	public focusNext(): boolean {
		if (this._listWidget.length === 0) {
			return false;
		}
		const focusedIxs = this._listWidget.getFocus();
		if (focusedIxs.length === 0) {
			this._listWidget.focusFirst();
			this._listWidget.reveal(0);
			return true;
		} else {
			if (focusedIxs[0] === this._listWidget.length - 1) {
				this._listWidget.setFocus([]);
				this._listWidget.reveal(0); // @ulugbekna: without this, it seems like focused element is obstructed
				return false;
			} else {
				this._listWidget.focusNext();
				const focused = this._listWidget.getFocus()[0];
				this._listWidget.reveal(focused);
				return true;
			}
		}
	}

	/**
	 * @returns true if focus is moved to previous element
	 */
	public focusPrevious(): boolean {
		if (this._listWidget.length === 0) {
			return false;
		}
		const focusedIxs = this._listWidget.getFocus();
		if (focusedIxs.length === 0) {
			this._listWidget.focusLast();
			const focused = this._listWidget.getFocus()[0];
			this._listWidget.reveal(focused);
			return true;
		} else {
			if (focusedIxs[0] === 0) {
				this._listWidget.setFocus([]);
				return false;
			} else {
				this._listWidget.focusPrevious();
				const focused = this._listWidget.getFocus()[0];
				this._listWidget.reveal(focused);
				return true;
			}
		}
	}

	public clearFocus(): void {
		this._listWidget.setFocus([]);
	}

	private get _candidateViewHeight(): number {
		const { totalHeight } = RenameCandidateView.getLayoutInfo({ lineHeight: this._lineHeight });
		return totalHeight;
	}

	private _pickListHeight(nCandidates: number) {
		const heightToFitAllCandidates = this._candidateViewHeight * nCandidates;
		const MAX_N_CANDIDATES = 7;  // @ulugbekna: max # of candidates we want to show at once
		const height = Math.min(heightToFitAllCandidates, this._availableHeight, this._candidateViewHeight * MAX_N_CANDIDATES);
		return height;
	}

	private _pickListWidth(candidates: NewSymbolName[]): number {
		const longestCandidateWidth = Math.ceil(Math.max(...candidates.map(c => c.newSymbolName.length)) * this._typicalHalfwidthCharacterWidth);
		const width = Math.max(
			this._minimumWidth,
			4 /* padding */ + 16 /* sparkle icon */ + 5 /* margin-left */ + longestCandidateWidth + 10 /* (possibly visible) scrollbar width */ // TODO@ulugbekna: approximate calc - clean this up
		);
		return width;
	}

	private static _createListWidget(container: HTMLElement, candidateViewHeight: number, fontInfo: FontInfo) {
		const virtualDelegate = new class implements IListVirtualDelegate<NewSymbolName> {
			getTemplateId(element: NewSymbolName): string {
				return 'candidate';
			}

			getHeight(element: NewSymbolName): number {
				return candidateViewHeight;
			}
		};

		const renderer = new class implements IListRenderer<NewSymbolName, RenameCandidateView> {
			readonly templateId = 'candidate';

			renderTemplate(container: HTMLElement): RenameCandidateView {
				return new RenameCandidateView(container, fontInfo);
			}

			renderElement(candidate: NewSymbolName, index: number, templateData: RenameCandidateView): void {
				templateData.populate(candidate);
			}

			disposeTemplate(templateData: RenameCandidateView): void {
				templateData.dispose();
			}
		};

		return new List(
			'NewSymbolNameCandidates',
			container,
			virtualDelegate,
			[renderer],
			{
				keyboardSupport: false, // @ulugbekna: because we handle keyboard events through proper commands & keybinding service, see `rename.ts`
				mouseSupport: true,
				multipleSelectionSupport: false,
			}
		);
	}
}

class InputWithButton implements IDisposable {

	private _buttonState: 'sparkle' | 'stop' | undefined;

	private _domNode: HTMLDivElement | undefined;
	private _inputNode: HTMLInputElement | undefined;
	private _buttonNode: HTMLElement | undefined;
	private _buttonHoverContent: string = '';
	private _buttonGenHoverText: string | undefined;
	private _buttonCancelHoverText: string | undefined;
	private _sparkleIcon: HTMLElement | undefined;
	private _stopIcon: HTMLElement | undefined;

	private readonly _onDidInputChange = new Emitter<void>();
	public readonly onDidInputChange = this._onDidInputChange.event;

	private readonly _disposables = new DisposableStore();

	get domNode() {
		if (!this._domNode) {

			this._domNode = document.createElement('div');
			this._domNode.className = 'rename-input-with-button';
			this._domNode.style.display = 'flex';
			this._domNode.style.flexDirection = 'row';
			this._domNode.style.alignItems = 'center';

			this._inputNode = document.createElement('input');
			this._inputNode.className = 'rename-input';
			this._inputNode.type = 'text';
			this._inputNode.style.border = 'none';
			this._inputNode.setAttribute('aria-label', nls.localize('renameAriaLabel', "Rename input. Type new name and press Enter to commit."));

			this._domNode.appendChild(this._inputNode);

			this._buttonNode = document.createElement('div');
			this._buttonNode.className = 'rename-suggestions-button';
			this._buttonNode.setAttribute('tabindex', '0');

			this._buttonGenHoverText = nls.localize('generateRenameSuggestionsButton', "Generate New Name Suggestions");
			this._buttonCancelHoverText = nls.localize('cancelRenameSuggestionsButton', "Cancel");
			this._buttonHoverContent = this._buttonGenHoverText;
			this._disposables.add(getBaseLayerHoverDelegate().setupDelayedHover(this._buttonNode, () => ({
				content: this._buttonHoverContent,
				style: HoverStyle.Pointer,
			})));

			this._domNode.appendChild(this._buttonNode);

			// notify if selection changes to cancel request to rename-suggestion providers

			this._disposables.add(dom.addDisposableListener(this.input, dom.EventType.INPUT, () => this._onDidInputChange.fire()));
			this._disposables.add(dom.addDisposableListener(this.input, dom.EventType.KEY_DOWN, (e) => {
				const keyEvent = new StandardKeyboardEvent(e);
				if (keyEvent.keyCode === KeyCode.LeftArrow || keyEvent.keyCode === KeyCode.RightArrow) {
					this._onDidInputChange.fire();
				}
			}));
			this._disposables.add(dom.addDisposableListener(this.input, dom.EventType.CLICK, () => this._onDidInputChange.fire()));

			// focus "container" border instead of input box

			this._disposables.add(dom.addDisposableListener(this.input, dom.EventType.FOCUS, () => {
				this.domNode.style.outlineWidth = '1px';
				this.domNode.style.outlineStyle = 'solid';
				this.domNode.style.outlineOffset = '-1px';
				this.domNode.style.outlineColor = 'var(--vscode-focusBorder)';
			}));
			this._disposables.add(dom.addDisposableListener(this.input, dom.EventType.BLUR, () => {
				this.domNode.style.outline = 'none';
			}));
		}
		return this._domNode;
	}

	get input() {
		assertType(this._inputNode);
		return this._inputNode;
	}

	get button() {
		assertType(this._buttonNode);
		return this._buttonNode;
	}

	get buttonState() {
		return this._buttonState;
	}

	setSparkleButton() {
		this._buttonState = 'sparkle';
		this._sparkleIcon ??= renderIcon(Codicon.sparkle);
		dom.clearNode(this.button);
		this.button.appendChild(this._sparkleIcon);
		this.button.setAttribute('aria-label', 'Generating new name suggestions');
		this._buttonHoverContent = this._buttonGenHoverText!;
		this.input.focus();
	}

	setStopButton() {
		this._buttonState = 'stop';
		this._stopIcon ??= renderIcon(Codicon.stopCircle);
		dom.clearNode(this.button);
		this.button.appendChild(this._stopIcon);
		this.button.setAttribute('aria-label', 'Cancel generating new name suggestions');
		this._buttonHoverContent = this._buttonCancelHoverText!;
		this.input.focus();
	}

	dispose(): void {
		this._disposables.dispose();
	}
}

class RenameCandidateView {

	private static _PADDING: number = 2;

	private readonly _domNode: HTMLElement;
	private readonly _icon: HTMLElement;
	private readonly _label: HTMLElement;

	constructor(parent: HTMLElement, fontInfo: FontInfo) {

		this._domNode = document.createElement('div');
		this._domNode.className = 'rename-box rename-candidate';
		this._domNode.style.display = `flex`;
		this._domNode.style.columnGap = `5px`;
		this._domNode.style.alignItems = `center`;
		this._domNode.style.height = `${fontInfo.lineHeight}px`;
		this._domNode.style.padding = `${RenameCandidateView._PADDING}px`;

		// @ulugbekna: needed to keep space when the `icon.style.display` is set to `none`
		const iconContainer = document.createElement('div');
		iconContainer.style.display = `flex`;
		iconContainer.style.alignItems = `center`;
		iconContainer.style.width = iconContainer.style.height = `${fontInfo.lineHeight * 0.8}px`;
		this._domNode.appendChild(iconContainer);

		this._icon = renderIcon(Codicon.sparkle);
		this._icon.style.display = `none`;
		iconContainer.appendChild(this._icon);

		this._label = document.createElement('div');
		domFontInfo.applyFontInfo(this._label, fontInfo);
		this._domNode.appendChild(this._label);

		parent.appendChild(this._domNode);
	}

	public populate(value: NewSymbolName) {
		this._updateIcon(value);
		this._updateLabel(value);
	}

	private _updateIcon(value: NewSymbolName) {
		const isAIGenerated = !!value.tags?.includes(NewSymbolNameTag.AIGenerated);
		this._icon.style.display = isAIGenerated ? 'inherit' : 'none';
	}

	private _updateLabel(value: NewSymbolName) {
		this._label.innerText = value.newSymbolName;
	}

	public static getLayoutInfo({ lineHeight }: { lineHeight: number }): { totalHeight: number } {
		const totalHeight = lineHeight + RenameCandidateView._PADDING * 2 /* top & bottom padding */;
		return { totalHeight };
	}

	public dispose() {
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/sectionHeaders/browser/sectionHeaders.ts]---
Location: vscode-main/src/vs/editor/contrib/sectionHeaders/browser/sectionHeaders.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancelablePromise, RunOnceScheduler } from '../../../../base/common/async.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { EditorContributionInstantiation, registerEditorContribution } from '../../../browser/editorExtensions.js';
import { EditorOption, IEditorMinimapOptions } from '../../../common/config/editorOptions.js';
import { IEditorContribution, IEditorDecorationsCollection } from '../../../common/editorCommon.js';
import { StandardTokenType } from '../../../common/encodedTokenAttributes.js';
import { ILanguageConfigurationService } from '../../../common/languages/languageConfigurationRegistry.js';
import { IModelDeltaDecoration, MinimapPosition, MinimapSectionHeaderStyle, TrackedRangeStickiness } from '../../../common/model.js';
import { ModelDecorationOptions } from '../../../common/model/textModel.js';
import { IEditorWorkerService } from '../../../common/services/editorWorker.js';
import { FindSectionHeaderOptions, SectionHeader } from '../../../common/services/findSectionHeaders.js';

export class SectionHeaderDetector extends Disposable implements IEditorContribution {

	public static readonly ID: string = 'editor.sectionHeaderDetector';

	private options: FindSectionHeaderOptions | undefined;
	private decorations: IEditorDecorationsCollection;
	private computeSectionHeaders: RunOnceScheduler;
	private computePromise: CancelablePromise<SectionHeader[]> | null;
	private currentOccurrences: { [decorationId: string]: SectionHeaderOccurrence };

	constructor(
		private readonly editor: ICodeEditor,
		@ILanguageConfigurationService private readonly languageConfigurationService: ILanguageConfigurationService,
		@IEditorWorkerService private readonly editorWorkerService: IEditorWorkerService,
	) {
		super();
		this.decorations = this.editor.createDecorationsCollection();

		this.options = this.createOptions(editor.getOption(EditorOption.minimap));
		this.computePromise = null;
		this.currentOccurrences = {};

		this._register(editor.onDidChangeModel((e) => {
			this.currentOccurrences = {};
			this.options = this.createOptions(editor.getOption(EditorOption.minimap));
			this.stop();
			this.computeSectionHeaders.schedule(0);
		}));

		this._register(editor.onDidChangeModelLanguage((e) => {
			this.currentOccurrences = {};
			this.options = this.createOptions(editor.getOption(EditorOption.minimap));
			this.stop();
			this.computeSectionHeaders.schedule(0);
		}));

		this._register(languageConfigurationService.onDidChange((e) => {
			const editorLanguageId = this.editor.getModel()?.getLanguageId();
			if (editorLanguageId && e.affects(editorLanguageId)) {
				this.currentOccurrences = {};
				this.options = this.createOptions(editor.getOption(EditorOption.minimap));
				this.stop();
				this.computeSectionHeaders.schedule(0);
			}
		}));

		this._register(editor.onDidChangeConfiguration(e => {
			if (this.options && !e.hasChanged(EditorOption.minimap)) {
				return;
			}

			this.options = this.createOptions(editor.getOption(EditorOption.minimap));

			// Remove any links (for the getting disabled case)
			this.updateDecorations([]);

			// Stop any computation (for the getting disabled case)
			this.stop();

			// Start computing (for the getting enabled case)
			this.computeSectionHeaders.schedule(0);
		}));

		this._register(this.editor.onDidChangeModelContent(e => {
			this.computeSectionHeaders.schedule();
		}));

		this._register(editor.onDidChangeModelTokens((e) => {
			if (!this.computeSectionHeaders.isScheduled()) {
				this.computeSectionHeaders.schedule(1000);
			}
		}));

		this.computeSectionHeaders = this._register(new RunOnceScheduler(() => {
			this.findSectionHeaders();
		}, 250));

		this.computeSectionHeaders.schedule(0);
	}

	private createOptions(minimap: Readonly<Required<IEditorMinimapOptions>>): FindSectionHeaderOptions | undefined {
		if (!minimap || !this.editor.hasModel()) {
			return undefined;
		}

		const languageId = this.editor.getModel().getLanguageId();
		if (!languageId) {
			return undefined;
		}

		const commentsConfiguration = this.languageConfigurationService.getLanguageConfiguration(languageId).comments;
		const foldingRules = this.languageConfigurationService.getLanguageConfiguration(languageId).foldingRules;

		if (!commentsConfiguration && !foldingRules?.markers) {
			return undefined;
		}

		return {
			foldingRules,
			markSectionHeaderRegex: minimap.markSectionHeaderRegex,
			findMarkSectionHeaders: minimap.showMarkSectionHeaders,
			findRegionSectionHeaders: minimap.showRegionSectionHeaders,
		};
	}

	private findSectionHeaders() {
		if (!this.editor.hasModel()
			|| (!this.options?.findMarkSectionHeaders && !this.options?.findRegionSectionHeaders)) {
			return;
		}

		const model = this.editor.getModel();
		if (model.isDisposed() || model.isTooLargeForSyncing()) {
			return;
		}

		const modelVersionId = model.getVersionId();
		this.editorWorkerService.findSectionHeaders(model.uri, this.options)
			.then((sectionHeaders) => {
				if (model.isDisposed() || model.getVersionId() !== modelVersionId) {
					// model changed in the meantime
					return;
				}
				this.updateDecorations(sectionHeaders);
			});
	}

	private updateDecorations(sectionHeaders: SectionHeader[]): void {

		const model = this.editor.getModel();
		if (model) {
			// Remove all section headers that should be in comments and are not in comments
			sectionHeaders = sectionHeaders.filter((sectionHeader) => {
				if (!sectionHeader.shouldBeInComments) {
					return true;
				}
				const validRange = model.validateRange(sectionHeader.range);
				const tokens = model.tokenization.getLineTokens(validRange.startLineNumber);
				const idx = tokens.findTokenIndexAtOffset(validRange.startColumn - 1);
				const tokenType = tokens.getStandardTokenType(idx);

				const languageIdAtPosition = model.getLanguageIdAtPosition(validRange.startLineNumber, validRange.startColumn);
				const tokenLanguageId = tokens.getLanguageId(idx);
				return (tokenLanguageId === languageIdAtPosition && tokenType === StandardTokenType.Comment);
			});
		}

		const oldDecorations = Object.values(this.currentOccurrences).map(occurrence => occurrence.decorationId);
		const newDecorations = sectionHeaders.map(sectionHeader => decoration(sectionHeader));

		this.editor.changeDecorations((changeAccessor) => {
			const decorations = changeAccessor.deltaDecorations(oldDecorations, newDecorations);

			this.currentOccurrences = {};
			for (let i = 0, len = decorations.length; i < len; i++) {
				const occurrence = { sectionHeader: sectionHeaders[i], decorationId: decorations[i] };
				this.currentOccurrences[occurrence.decorationId] = occurrence;
			}
		});
	}

	private stop(): void {
		this.computeSectionHeaders.cancel();
		if (this.computePromise) {
			this.computePromise.cancel();
			this.computePromise = null;
		}
	}

	public override dispose(): void {
		super.dispose();
		this.stop();
		this.decorations.clear();
	}

}

interface SectionHeaderOccurrence {
	readonly sectionHeader: SectionHeader;
	readonly decorationId: string;
}

function decoration(sectionHeader: SectionHeader): IModelDeltaDecoration {
	return {
		range: sectionHeader.range,
		options: ModelDecorationOptions.createDynamic({
			description: 'section-header',
			stickiness: TrackedRangeStickiness.GrowsOnlyWhenTypingAfter,
			collapseOnReplaceEdit: true,
			minimap: {
				color: undefined,
				position: MinimapPosition.Inline,
				sectionHeaderStyle: sectionHeader.hasSeparatorLine ? MinimapSectionHeaderStyle.Underlined : MinimapSectionHeaderStyle.Normal,
				sectionHeaderText: sectionHeader.text,
			},
		})
	};
}

registerEditorContribution(SectionHeaderDetector.ID, SectionHeaderDetector, EditorContributionInstantiation.AfterFirstRender);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/semanticTokens/browser/documentSemanticTokens.ts]---
Location: vscode-main/src/vs/editor/contrib/semanticTokens/browser/documentSemanticTokens.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { RunOnceScheduler } from '../../../../base/common/async.js';
import { CancellationTokenSource } from '../../../../base/common/cancellation.js';
import * as errors from '../../../../base/common/errors.js';
import { Disposable, IDisposable, dispose } from '../../../../base/common/lifecycle.js';
import { ResourceMap } from '../../../../base/common/map.js';
import { StopWatch } from '../../../../base/common/stopwatch.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { registerEditorFeature } from '../../../common/editorFeatures.js';
import { LanguageFeatureRegistry } from '../../../common/languageFeatureRegistry.js';
import { DocumentSemanticTokensProvider, SemanticTokens, SemanticTokensEdits } from '../../../common/languages.js';
import { ITextModel } from '../../../common/model.js';
import { IFeatureDebounceInformation, ILanguageFeatureDebounceService } from '../../../common/services/languageFeatureDebounce.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { IModelService } from '../../../common/services/model.js';
import { SemanticTokensProviderStyling, toMultilineTokens2 } from '../../../common/services/semanticTokensProviderStyling.js';
import { ISemanticTokensStylingService } from '../../../common/services/semanticTokensStyling.js';
import { IModelContentChangedEvent } from '../../../common/textModelEvents.js';
import { getDocumentSemanticTokens, hasDocumentSemanticTokensProvider, isSemanticTokens, isSemanticTokensEdits } from '../common/getSemanticTokens.js';
import { SEMANTIC_HIGHLIGHTING_SETTING_ID, isSemanticColoringEnabled } from '../common/semanticTokensConfig.js';

export class DocumentSemanticTokensFeature extends Disposable {

	private readonly _watchers = new ResourceMap<ModelSemanticColoring>();

	constructor(
		@ISemanticTokensStylingService semanticTokensStylingService: ISemanticTokensStylingService,
		@IModelService modelService: IModelService,
		@IThemeService themeService: IThemeService,
		@IConfigurationService configurationService: IConfigurationService,
		@ILanguageFeatureDebounceService languageFeatureDebounceService: ILanguageFeatureDebounceService,
		@ILanguageFeaturesService languageFeaturesService: ILanguageFeaturesService,
	) {
		super();

		const register = (model: ITextModel) => {
			this._watchers.get(model.uri)?.dispose();
			this._watchers.set(model.uri, new ModelSemanticColoring(model, semanticTokensStylingService, themeService, languageFeatureDebounceService, languageFeaturesService));
		};
		const deregister = (model: ITextModel, modelSemanticColoring: ModelSemanticColoring) => {
			modelSemanticColoring.dispose();
			this._watchers.delete(model.uri);
		};
		const handleSettingOrThemeChange = () => {
			for (const model of modelService.getModels()) {
				const curr = this._watchers.get(model.uri);
				if (isSemanticColoringEnabled(model, themeService, configurationService)) {
					if (!curr) {
						register(model);
					}
				} else {
					if (curr) {
						deregister(model, curr);
					}
				}
			}
		};
		modelService.getModels().forEach(model => {
			if (isSemanticColoringEnabled(model, themeService, configurationService)) {
				register(model);
			}
		});
		this._register(modelService.onModelAdded((model) => {
			if (isSemanticColoringEnabled(model, themeService, configurationService)) {
				register(model);
			}
		}));
		this._register(modelService.onModelRemoved((model) => {
			const curr = this._watchers.get(model.uri);
			if (curr) {
				deregister(model, curr);
			}
		}));
		this._register(configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(SEMANTIC_HIGHLIGHTING_SETTING_ID)) {
				handleSettingOrThemeChange();
			}
		}));
		this._register(themeService.onDidColorThemeChange(handleSettingOrThemeChange));
	}

	override dispose(): void {
		dispose(this._watchers.values());
		this._watchers.clear();

		super.dispose();
	}
}

class ModelSemanticColoring extends Disposable {

	public static REQUEST_MIN_DELAY = 300;
	public static REQUEST_MAX_DELAY = 2000;

	private _isDisposed: boolean;
	private readonly _model: ITextModel;
	private readonly _provider: LanguageFeatureRegistry<DocumentSemanticTokensProvider>;
	private readonly _debounceInformation: IFeatureDebounceInformation;
	private readonly _fetchDocumentSemanticTokens: RunOnceScheduler;
	private _currentDocumentResponse: SemanticTokensResponse | null;
	private _currentDocumentRequestCancellationTokenSource: CancellationTokenSource | null;
	private _documentProvidersChangeListeners: IDisposable[];
	private _providersChangedDuringRequest: boolean;

	constructor(
		model: ITextModel,
		@ISemanticTokensStylingService private readonly _semanticTokensStylingService: ISemanticTokensStylingService,
		@IThemeService themeService: IThemeService,
		@ILanguageFeatureDebounceService languageFeatureDebounceService: ILanguageFeatureDebounceService,
		@ILanguageFeaturesService languageFeaturesService: ILanguageFeaturesService,
	) {
		super();

		this._isDisposed = false;
		this._model = model;
		this._provider = languageFeaturesService.documentSemanticTokensProvider;
		this._debounceInformation = languageFeatureDebounceService.for(this._provider, 'DocumentSemanticTokens', { min: ModelSemanticColoring.REQUEST_MIN_DELAY, max: ModelSemanticColoring.REQUEST_MAX_DELAY });
		this._fetchDocumentSemanticTokens = this._register(new RunOnceScheduler(() => this._fetchDocumentSemanticTokensNow(), ModelSemanticColoring.REQUEST_MIN_DELAY));
		this._currentDocumentResponse = null;
		this._currentDocumentRequestCancellationTokenSource = null;
		this._documentProvidersChangeListeners = [];
		this._providersChangedDuringRequest = false;

		this._register(this._model.onDidChangeContent(() => {
			if (!this._fetchDocumentSemanticTokens.isScheduled()) {
				this._fetchDocumentSemanticTokens.schedule(this._debounceInformation.get(this._model));
			}
		}));
		this._register(this._model.onDidChangeAttached(() => {
			if (!this._fetchDocumentSemanticTokens.isScheduled()) {
				this._fetchDocumentSemanticTokens.schedule(this._debounceInformation.get(this._model));
			}
		}));
		this._register(this._model.onDidChangeLanguage(() => {
			// clear any outstanding state
			if (this._currentDocumentResponse) {
				this._currentDocumentResponse.dispose();
				this._currentDocumentResponse = null;
			}
			if (this._currentDocumentRequestCancellationTokenSource) {
				this._currentDocumentRequestCancellationTokenSource.cancel();
				this._currentDocumentRequestCancellationTokenSource = null;
			}
			this._setDocumentSemanticTokens(null, null, null, []);
			this._fetchDocumentSemanticTokens.schedule(0);
		}));

		const bindDocumentChangeListeners = () => {
			dispose(this._documentProvidersChangeListeners);
			this._documentProvidersChangeListeners = [];
			for (const provider of this._provider.all(model)) {
				if (typeof provider.onDidChange === 'function') {
					this._documentProvidersChangeListeners.push(provider.onDidChange(() => {
						if (this._currentDocumentRequestCancellationTokenSource) {
							// there is already a request running,
							this._providersChangedDuringRequest = true;
							return;
						}
						this._fetchDocumentSemanticTokens.schedule(0);
					}));
				}
			}
		};
		bindDocumentChangeListeners();
		this._register(this._provider.onDidChange(() => {
			bindDocumentChangeListeners();
			this._fetchDocumentSemanticTokens.schedule(this._debounceInformation.get(this._model));
		}));

		this._register(themeService.onDidColorThemeChange(_ => {
			// clear out existing tokens
			this._setDocumentSemanticTokens(null, null, null, []);
			this._fetchDocumentSemanticTokens.schedule(this._debounceInformation.get(this._model));
		}));

		this._fetchDocumentSemanticTokens.schedule(0);
	}

	public override dispose(): void {
		if (this._currentDocumentResponse) {
			this._currentDocumentResponse.dispose();
			this._currentDocumentResponse = null;
		}
		if (this._currentDocumentRequestCancellationTokenSource) {
			this._currentDocumentRequestCancellationTokenSource.cancel();
			this._currentDocumentRequestCancellationTokenSource = null;
		}
		dispose(this._documentProvidersChangeListeners);
		this._documentProvidersChangeListeners = [];
		this._setDocumentSemanticTokens(null, null, null, []);
		this._isDisposed = true;

		super.dispose();
	}

	private _fetchDocumentSemanticTokensNow(): void {
		if (this._currentDocumentRequestCancellationTokenSource) {
			// there is already a request running, let it finish...
			return;
		}

		if (!hasDocumentSemanticTokensProvider(this._provider, this._model)) {
			// there is no provider
			if (this._currentDocumentResponse) {
				// there are semantic tokens set
				this._model.tokenization.setSemanticTokens(null, false);
			}
			return;
		}

		if (!this._model.isAttachedToEditor()) {
			// this document is not visible, there is no need to fetch semantic tokens for it
			return;
		}

		const cancellationTokenSource = new CancellationTokenSource();
		const lastProvider = this._currentDocumentResponse ? this._currentDocumentResponse.provider : null;
		const lastResultId = this._currentDocumentResponse ? this._currentDocumentResponse.resultId || null : null;
		const request = getDocumentSemanticTokens(this._provider, this._model, lastProvider, lastResultId, cancellationTokenSource.token);
		this._currentDocumentRequestCancellationTokenSource = cancellationTokenSource;
		this._providersChangedDuringRequest = false;

		const pendingChanges: IModelContentChangedEvent[] = [];
		const contentChangeListener = this._model.onDidChangeContent((e) => {
			pendingChanges.push(e);
		});

		const sw = new StopWatch(false);
		request.then((res) => {
			this._debounceInformation.update(this._model, sw.elapsed());
			this._currentDocumentRequestCancellationTokenSource = null;
			contentChangeListener.dispose();

			if (!res) {
				this._setDocumentSemanticTokens(null, null, null, pendingChanges);
			} else {
				const { provider, tokens } = res;
				const styling = this._semanticTokensStylingService.getStyling(provider);
				this._setDocumentSemanticTokens(provider, tokens || null, styling, pendingChanges);
			}
		}, (err) => {
			const isExpectedError = err && (errors.isCancellationError(err) || (typeof err.message === 'string' && err.message.indexOf('busy') !== -1));
			if (!isExpectedError) {
				errors.onUnexpectedError(err);
			}

			// Semantic tokens eats up all errors and considers errors to mean that the result is temporarily not available
			// The API does not have a special error kind to express this...
			this._currentDocumentRequestCancellationTokenSource = null;
			contentChangeListener.dispose();

			if (pendingChanges.length > 0 || this._providersChangedDuringRequest) {
				// More changes occurred while the request was running
				if (!this._fetchDocumentSemanticTokens.isScheduled()) {
					this._fetchDocumentSemanticTokens.schedule(this._debounceInformation.get(this._model));
				}
			}
		});
	}

	private static _copy(src: Uint32Array, srcOffset: number, dest: Uint32Array, destOffset: number, length: number): void {
		// protect against overflows
		length = Math.min(length, dest.length - destOffset, src.length - srcOffset);
		for (let i = 0; i < length; i++) {
			dest[destOffset + i] = src[srcOffset + i];
		}
	}

	private _setDocumentSemanticTokens(provider: DocumentSemanticTokensProvider | null, tokens: SemanticTokens | SemanticTokensEdits | null, styling: SemanticTokensProviderStyling | null, pendingChanges: IModelContentChangedEvent[]): void {
		const currentResponse = this._currentDocumentResponse;
		const rescheduleIfNeeded = () => {
			if ((pendingChanges.length > 0 || this._providersChangedDuringRequest) && !this._fetchDocumentSemanticTokens.isScheduled()) {
				this._fetchDocumentSemanticTokens.schedule(this._debounceInformation.get(this._model));
			}
		};

		if (this._currentDocumentResponse) {
			this._currentDocumentResponse.dispose();
			this._currentDocumentResponse = null;
		}
		if (this._isDisposed) {
			// disposed!
			if (provider && tokens) {
				provider.releaseDocumentSemanticTokens(tokens.resultId);
			}
			return;
		}
		if (!provider || !styling) {
			this._model.tokenization.setSemanticTokens(null, false);
			return;
		}
		if (!tokens) {
			this._model.tokenization.setSemanticTokens(null, true);
			rescheduleIfNeeded();
			return;
		}

		if (isSemanticTokensEdits(tokens)) {
			if (!currentResponse) {
				// not possible!
				this._model.tokenization.setSemanticTokens(null, true);
				return;
			}
			if (tokens.edits.length === 0) {
				// nothing to do!
				tokens = {
					resultId: tokens.resultId,
					data: currentResponse.data
				};
			} else {
				let deltaLength = 0;
				for (const edit of tokens.edits) {
					deltaLength += (edit.data ? edit.data.length : 0) - edit.deleteCount;
				}

				const srcData = currentResponse.data;
				const destData = new Uint32Array(srcData.length + deltaLength);

				let srcLastStart = srcData.length;
				let destLastStart = destData.length;
				for (let i = tokens.edits.length - 1; i >= 0; i--) {
					const edit = tokens.edits[i];

					if (edit.start > srcData.length) {
						styling.warnInvalidEditStart(currentResponse.resultId, tokens.resultId, i, edit.start, srcData.length);
						// The edits are invalid and there's no way to recover
						this._model.tokenization.setSemanticTokens(null, true);
						return;
					}

					const copyCount = srcLastStart - (edit.start + edit.deleteCount);
					if (copyCount > 0) {
						ModelSemanticColoring._copy(srcData, srcLastStart - copyCount, destData, destLastStart - copyCount, copyCount);
						destLastStart -= copyCount;
					}

					if (edit.data) {
						ModelSemanticColoring._copy(edit.data, 0, destData, destLastStart - edit.data.length, edit.data.length);
						destLastStart -= edit.data.length;
					}

					srcLastStart = edit.start;
				}

				if (srcLastStart > 0) {
					ModelSemanticColoring._copy(srcData, 0, destData, 0, srcLastStart);
				}

				tokens = {
					resultId: tokens.resultId,
					data: destData
				};
			}
		}

		if (isSemanticTokens(tokens)) {

			this._currentDocumentResponse = new SemanticTokensResponse(provider, tokens.resultId, tokens.data);

			const result = toMultilineTokens2(tokens, styling, this._model.getLanguageId());

			// Adjust incoming semantic tokens
			if (pendingChanges.length > 0) {
				// More changes occurred while the request was running
				// We need to:
				// 1. Adjust incoming semantic tokens
				// 2. Request them again
				for (const change of pendingChanges) {
					for (const area of result) {
						for (const singleChange of change.changes) {
							area.applyEdit(singleChange.range, singleChange.text);
						}
					}
				}
			}

			this._model.tokenization.setSemanticTokens(result, true);
		} else {
			this._model.tokenization.setSemanticTokens(null, true);
		}

		rescheduleIfNeeded();
	}
}

class SemanticTokensResponse {
	constructor(
		public readonly provider: DocumentSemanticTokensProvider,
		public readonly resultId: string | undefined,
		public readonly data: Uint32Array
	) { }

	public dispose(): void {
		this.provider.releaseDocumentSemanticTokens(this.resultId);
	}
}

registerEditorFeature(DocumentSemanticTokensFeature);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/semanticTokens/browser/viewportSemanticTokens.ts]---
Location: vscode-main/src/vs/editor/contrib/semanticTokens/browser/viewportSemanticTokens.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancelablePromise, createCancelablePromise, RunOnceScheduler } from '../../../../base/common/async.js';
import { Disposable, dispose, IDisposable } from '../../../../base/common/lifecycle.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { EditorContributionInstantiation, registerEditorContribution } from '../../../browser/editorExtensions.js';
import { Range } from '../../../common/core/range.js';
import { IEditorContribution } from '../../../common/editorCommon.js';
import { ITextModel } from '../../../common/model.js';
import { getDocumentRangeSemanticTokens, hasDocumentRangeSemanticTokensProvider } from '../common/getSemanticTokens.js';
import { isSemanticColoringEnabled, SEMANTIC_HIGHLIGHTING_SETTING_ID } from '../common/semanticTokensConfig.js';
import { toMultilineTokens2 } from '../../../common/services/semanticTokensProviderStyling.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IFeatureDebounceInformation, ILanguageFeatureDebounceService } from '../../../common/services/languageFeatureDebounce.js';
import { StopWatch } from '../../../../base/common/stopwatch.js';
import { LanguageFeatureRegistry } from '../../../common/languageFeatureRegistry.js';
import { DocumentRangeSemanticTokensProvider } from '../../../common/languages.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { ISemanticTokensStylingService } from '../../../common/services/semanticTokensStyling.js';

export class ViewportSemanticTokensContribution extends Disposable implements IEditorContribution {

	public static readonly ID = 'editor.contrib.viewportSemanticTokens';

	public static get(editor: ICodeEditor): ViewportSemanticTokensContribution | null {
		return editor.getContribution<ViewportSemanticTokensContribution>(ViewportSemanticTokensContribution.ID);
	}

	private readonly _editor: ICodeEditor;
	private readonly _provider: LanguageFeatureRegistry<DocumentRangeSemanticTokensProvider>;
	private readonly _debounceInformation: IFeatureDebounceInformation;
	private readonly _tokenizeViewport: RunOnceScheduler;
	private _outstandingRequests: CancelablePromise<unknown>[];
	private _rangeProvidersChangeListeners: IDisposable[];

	constructor(
		editor: ICodeEditor,
		@ISemanticTokensStylingService private readonly _semanticTokensStylingService: ISemanticTokensStylingService,
		@IThemeService private readonly _themeService: IThemeService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@ILanguageFeatureDebounceService languageFeatureDebounceService: ILanguageFeatureDebounceService,
		@ILanguageFeaturesService languageFeaturesService: ILanguageFeaturesService,
	) {
		super();
		this._editor = editor;
		this._provider = languageFeaturesService.documentRangeSemanticTokensProvider;
		this._debounceInformation = languageFeatureDebounceService.for(this._provider, 'DocumentRangeSemanticTokens', { min: 100, max: 500 });
		this._tokenizeViewport = this._register(new RunOnceScheduler(() => this._tokenizeViewportNow(), 100));
		this._outstandingRequests = [];
		this._rangeProvidersChangeListeners = [];
		const scheduleTokenizeViewport = () => {
			if (this._editor.hasModel()) {
				this._tokenizeViewport.schedule(this._debounceInformation.get(this._editor.getModel()));
			}
		};
		const bindRangeProvidersChangeListeners = () => {
			this._cleanupProviderListeners();
			if (this._editor.hasModel()) {
				const model = this._editor.getModel();
				for (const provider of this._provider.all(model)) {
					const disposable = provider.onDidChange?.(() => {
						this._cancelAll();
						scheduleTokenizeViewport();
					});
					if (disposable) {
						this._rangeProvidersChangeListeners.push(disposable);
					}
				}
			}
		};

		this._register(this._editor.onDidScrollChange(() => {
			scheduleTokenizeViewport();
		}));
		this._register(this._editor.onDidChangeModel(() => {
			bindRangeProvidersChangeListeners();
			this._cancelAll();
			scheduleTokenizeViewport();
		}));
		this._register(this._editor.onDidChangeModelLanguage(() => {
			// The cleanup of the model's semantic tokens happens in the DocumentSemanticTokensFeature
			bindRangeProvidersChangeListeners();
			this._cancelAll();
			scheduleTokenizeViewport();
		}));
		this._register(this._editor.onDidChangeModelContent((e) => {
			this._cancelAll();
			scheduleTokenizeViewport();
		}));

		bindRangeProvidersChangeListeners();
		this._register(this._provider.onDidChange(() => {
			bindRangeProvidersChangeListeners();
			this._cancelAll();
			scheduleTokenizeViewport();
		}));
		this._register(this._configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(SEMANTIC_HIGHLIGHTING_SETTING_ID)) {
				this._cancelAll();
				scheduleTokenizeViewport();
			}
		}));
		this._register(this._themeService.onDidColorThemeChange(() => {
			this._cancelAll();
			scheduleTokenizeViewport();
		}));
		scheduleTokenizeViewport();
	}

	public override dispose(): void {
		this._cleanupProviderListeners();
		super.dispose();
	}

	private _cleanupProviderListeners(): void {
		dispose(this._rangeProvidersChangeListeners);
		this._rangeProvidersChangeListeners = [];
	}

	private _cancelAll(): void {
		for (const request of this._outstandingRequests) {
			request.cancel();
		}
		this._outstandingRequests = [];
	}

	private _removeOutstandingRequest(req: CancelablePromise<unknown>): void {
		for (let i = 0, len = this._outstandingRequests.length; i < len; i++) {
			if (this._outstandingRequests[i] === req) {
				this._outstandingRequests.splice(i, 1);
				return;
			}
		}
	}

	private _tokenizeViewportNow(): void {
		if (!this._editor.hasModel()) {
			return;
		}
		const model = this._editor.getModel();
		if (model.tokenization.hasCompleteSemanticTokens()) {
			return;
		}
		if (!isSemanticColoringEnabled(model, this._themeService, this._configurationService)) {
			if (model.tokenization.hasSomeSemanticTokens()) {
				model.tokenization.setSemanticTokens(null, false);
			}
			return;
		}
		if (!hasDocumentRangeSemanticTokensProvider(this._provider, model)) {
			if (model.tokenization.hasSomeSemanticTokens()) {
				model.tokenization.setSemanticTokens(null, false);
			}
			return;
		}
		const visibleRanges = this._editor.getVisibleRangesPlusViewportAboveBelow();

		this._outstandingRequests = this._outstandingRequests.concat(visibleRanges.map(range => this._requestRange(model, range)));
	}

	private _requestRange(model: ITextModel, range: Range): CancelablePromise<unknown> {
		const requestVersionId = model.getVersionId();
		const request = createCancelablePromise(token => Promise.resolve(getDocumentRangeSemanticTokens(this._provider, model, range, token)));
		const sw = new StopWatch(false);
		request.then((r) => {
			this._debounceInformation.update(model, sw.elapsed());
			if (!r || !r.tokens || model.isDisposed() || model.getVersionId() !== requestVersionId) {
				return;
			}
			const { provider, tokens: result } = r;
			const styling = this._semanticTokensStylingService.getStyling(provider);
			model.tokenization.setPartialSemanticTokens(range, toMultilineTokens2(result, styling, model.getLanguageId()));
		}).then(() => this._removeOutstandingRequest(request), () => this._removeOutstandingRequest(request));
		return request;
	}
}

registerEditorContribution(ViewportSemanticTokensContribution.ID, ViewportSemanticTokensContribution, EditorContributionInstantiation.AfterFirstRender);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/semanticTokens/common/getSemanticTokens.ts]---
Location: vscode-main/src/vs/editor/contrib/semanticTokens/common/getSemanticTokens.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { onUnexpectedExternalError } from '../../../../base/common/errors.js';
import { URI } from '../../../../base/common/uri.js';
import { ITextModel } from '../../../common/model.js';
import { DocumentSemanticTokensProvider, SemanticTokens, SemanticTokensEdits, SemanticTokensLegend, DocumentRangeSemanticTokensProvider } from '../../../common/languages.js';
import { IModelService } from '../../../common/services/model.js';
import { CommandsRegistry, ICommandService } from '../../../../platform/commands/common/commands.js';
import { assertType } from '../../../../base/common/types.js';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { encodeSemanticTokensDto } from '../../../common/services/semanticTokensDto.js';
import { Range } from '../../../common/core/range.js';
import { LanguageFeatureRegistry } from '../../../common/languageFeatureRegistry.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';

export function isSemanticTokens(v: SemanticTokens | SemanticTokensEdits): v is SemanticTokens {
	return v && !!((<SemanticTokens>v).data);
}

export function isSemanticTokensEdits(v: SemanticTokens | SemanticTokensEdits): v is SemanticTokensEdits {
	return v && Array.isArray((<SemanticTokensEdits>v).edits);
}

export class DocumentSemanticTokensResult {
	constructor(
		public readonly provider: DocumentSemanticTokensProvider,
		public readonly tokens: SemanticTokens | SemanticTokensEdits | null,
		public readonly error: unknown
	) { }
}

export function hasDocumentSemanticTokensProvider(registry: LanguageFeatureRegistry<DocumentSemanticTokensProvider>, model: ITextModel): boolean {
	return registry.has(model);
}

function getDocumentSemanticTokensProviders(registry: LanguageFeatureRegistry<DocumentSemanticTokensProvider>, model: ITextModel): DocumentSemanticTokensProvider[] {
	const groups = registry.orderedGroups(model);
	return (groups.length > 0 ? groups[0] : []);
}

export async function getDocumentSemanticTokens(registry: LanguageFeatureRegistry<DocumentSemanticTokensProvider>, model: ITextModel, lastProvider: DocumentSemanticTokensProvider | null, lastResultId: string | null, token: CancellationToken): Promise<DocumentSemanticTokensResult | null> {
	const providers = getDocumentSemanticTokensProviders(registry, model);

	// Get tokens from all providers at the same time.
	const results = await Promise.all(providers.map(async (provider) => {
		let result: SemanticTokens | SemanticTokensEdits | null | undefined;
		let error: unknown = null;
		try {
			result = await provider.provideDocumentSemanticTokens(model, (provider === lastProvider ? lastResultId : null), token);
		} catch (err) {
			error = err;
			result = null;
		}

		if (!result || (!isSemanticTokens(result) && !isSemanticTokensEdits(result))) {
			result = null;
		}

		return new DocumentSemanticTokensResult(provider, result, error);
	}));

	// Try to return the first result with actual tokens or
	// the first result which threw an error (!!)
	for (const result of results) {
		if (result.error) {
			throw result.error;
		}
		if (result.tokens) {
			return result;
		}
	}

	// Return the first result, even if it doesn't have tokens
	if (results.length > 0) {
		return results[0];
	}

	return null;
}

function _getDocumentSemanticTokensProviderHighestGroup(registry: LanguageFeatureRegistry<DocumentSemanticTokensProvider>, model: ITextModel): DocumentSemanticTokensProvider[] | null {
	const result = registry.orderedGroups(model);
	return (result.length > 0 ? result[0] : null);
}

class DocumentRangeSemanticTokensResult {
	constructor(
		public readonly provider: DocumentRangeSemanticTokensProvider,
		public readonly tokens: SemanticTokens | null,
	) { }
}

export function hasDocumentRangeSemanticTokensProvider(providers: LanguageFeatureRegistry<DocumentRangeSemanticTokensProvider>, model: ITextModel): boolean {
	return providers.has(model);
}

function getDocumentRangeSemanticTokensProviders(providers: LanguageFeatureRegistry<DocumentRangeSemanticTokensProvider>, model: ITextModel): DocumentRangeSemanticTokensProvider[] {
	const groups = providers.orderedGroups(model);
	return (groups.length > 0 ? groups[0] : []);
}

export async function getDocumentRangeSemanticTokens(registry: LanguageFeatureRegistry<DocumentRangeSemanticTokensProvider>, model: ITextModel, range: Range, token: CancellationToken): Promise<DocumentRangeSemanticTokensResult | null> {
	const providers = getDocumentRangeSemanticTokensProviders(registry, model);

	// Get tokens from all providers at the same time.
	const results = await Promise.all(providers.map(async (provider) => {
		let result: SemanticTokens | null | undefined;
		try {
			result = await provider.provideDocumentRangeSemanticTokens(model, range, token);
		} catch (err) {
			onUnexpectedExternalError(err);
			result = null;
		}

		if (!result || !isSemanticTokens(result)) {
			result = null;
		}

		return new DocumentRangeSemanticTokensResult(provider, result);
	}));

	// Try to return the first result with actual tokens
	for (const result of results) {
		if (result.tokens) {
			return result;
		}
	}

	// Return the first result, even if it doesn't have tokens
	if (results.length > 0) {
		return results[0];
	}

	return null;
}

CommandsRegistry.registerCommand('_provideDocumentSemanticTokensLegend', async (accessor, ...args): Promise<SemanticTokensLegend | undefined> => {
	const [uri] = args;
	assertType(uri instanceof URI);

	const model = accessor.get(IModelService).getModel(uri);
	if (!model) {
		return undefined;
	}
	const { documentSemanticTokensProvider } = accessor.get(ILanguageFeaturesService);

	const providers = _getDocumentSemanticTokensProviderHighestGroup(documentSemanticTokensProvider, model);
	if (!providers) {
		// there is no provider => fall back to a document range semantic tokens provider
		return accessor.get(ICommandService).executeCommand('_provideDocumentRangeSemanticTokensLegend', uri);
	}

	return providers[0].getLegend();
});

CommandsRegistry.registerCommand('_provideDocumentSemanticTokens', async (accessor, ...args): Promise<VSBuffer | undefined> => {
	const [uri] = args;
	assertType(uri instanceof URI);

	const model = accessor.get(IModelService).getModel(uri);
	if (!model) {
		return undefined;
	}
	const { documentSemanticTokensProvider } = accessor.get(ILanguageFeaturesService);
	if (!hasDocumentSemanticTokensProvider(documentSemanticTokensProvider, model)) {
		// there is no provider => fall back to a document range semantic tokens provider
		return accessor.get(ICommandService).executeCommand('_provideDocumentRangeSemanticTokens', uri, model.getFullModelRange());
	}

	const r = await getDocumentSemanticTokens(documentSemanticTokensProvider, model, null, null, CancellationToken.None);
	if (!r) {
		return undefined;
	}

	const { provider, tokens } = r;

	if (!tokens || !isSemanticTokens(tokens)) {
		return undefined;
	}

	const buff = encodeSemanticTokensDto({
		id: 0,
		type: 'full',
		data: tokens.data
	});
	if (tokens.resultId) {
		provider.releaseDocumentSemanticTokens(tokens.resultId);
	}
	return buff;
});

CommandsRegistry.registerCommand('_provideDocumentRangeSemanticTokensLegend', async (accessor, ...args): Promise<SemanticTokensLegend | undefined> => {
	const [uri, range] = args;
	assertType(uri instanceof URI);

	const model = accessor.get(IModelService).getModel(uri);
	if (!model) {
		return undefined;
	}
	const { documentRangeSemanticTokensProvider } = accessor.get(ILanguageFeaturesService);
	const providers = getDocumentRangeSemanticTokensProviders(documentRangeSemanticTokensProvider, model);
	if (providers.length === 0) {
		// no providers
		return undefined;
	}

	if (providers.length === 1) {
		// straight forward case, just a single provider
		return providers[0].getLegend();
	}

	if (!range || !Range.isIRange(range)) {
		// if no range is provided, we cannot support multiple providers
		// as we cannot fall back to the one which would give results
		// => return the first legend for backwards compatibility and print a warning
		console.warn(`provideDocumentRangeSemanticTokensLegend might be out-of-sync with provideDocumentRangeSemanticTokens unless a range argument is passed in`);
		return providers[0].getLegend();
	}

	const result = await getDocumentRangeSemanticTokens(documentRangeSemanticTokensProvider, model, Range.lift(range), CancellationToken.None);
	if (!result) {
		return undefined;
	}

	return result.provider.getLegend();
});

CommandsRegistry.registerCommand('_provideDocumentRangeSemanticTokens', async (accessor, ...args): Promise<VSBuffer | undefined> => {
	const [uri, range] = args;
	assertType(uri instanceof URI);
	assertType(Range.isIRange(range));

	const model = accessor.get(IModelService).getModel(uri);
	if (!model) {
		return undefined;
	}
	const { documentRangeSemanticTokensProvider } = accessor.get(ILanguageFeaturesService);

	const result = await getDocumentRangeSemanticTokens(documentRangeSemanticTokensProvider, model, Range.lift(range), CancellationToken.None);
	if (!result || !result.tokens) {
		// there is no provider or it didn't return tokens
		return undefined;
	}

	return encodeSemanticTokensDto({
		id: 0,
		type: 'full',
		data: result.tokens.data
	});
});
```

--------------------------------------------------------------------------------

````
